/* =====================================================================
   build.js – baut die Lernseite aus faecher/ nach docs/
   Aufruf:  npm run build

   Warum überhaupt ein Build?  Eine statische Seite kann ihre eigenen Ordner nicht
   auflisten. Darum liest dieses Skript einmal alle Ordner, prüft alles und schreibt
   fertige HTML-Seiten. GitHub Pages liefert dann nur noch docs/ aus.

   Ablauf (jede Phase ist unten eine eigene Funktion):
     1. einlesen   faecher/<fach>/fach.json und faecher/<fach>/<thema>/thema.md
     2. pruefen    ids, Voraussetzungen, Zyklen   → bei Fehlern Abbruch, NICHTS wird geschrieben
     3. rendern    Markdown + Formeln (KaTeX) + Platzhalter → HTML im Speicher
     4. schreiben  Seiten, Datenliste, Bilder (verkleinert), Visualisierungen, assets
     5. aufraeumen Dateien in docs/, die nicht mehr gebraucht werden, löschen
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const katex = require('katex');
const sharp = require('sharp');
const TopicGraph = require('./assets/js/graph.js');

/* ---------- Einstellungen ---------- */
const WURZEL = __dirname;
const QUELLE = path.join(WURZEL, 'faecher');
const ZIEL = path.join(WURZEL, 'docs');
const VORLAGEN = path.join(WURZEL, 'vorlagen');
const BILD_MAX = 1600;    // längste Seite der großen Bilder in Pixel (Handyfotos haben oft 4000+)
const KLEIN_MAX = 480;    // Vorschaubilder in der Galerie
const BILD_ENDUNGEN = ['.jpg', '.jpeg', '.png', '.webp'];
const ID_MUSTER = /^[a-z0-9]+(-[a-z0-9]+)*$/; // kebab-case, keine Umlaute

const fehler = [];        // Fehler sammeln statt beim ersten abbrechen → man sieht alle auf einmal
const warnungen = [];
const geschrieben = new Set(); // jede Datei, die dieser Lauf in docs/ erzeugt (für das Aufräumen)

/* ---------- kleine Helfer ---------- */
const rel = (p) => path.relative(WURZEL, p).split(path.sep).join('/'); // für lesbare Meldungen
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unterordner = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  : [];
const dateien = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name).sort()
  : [];

function schreibe(datei, inhalt) {
  fs.mkdirSync(path.dirname(datei), { recursive: true });
  // Nur schreiben, wenn sich etwas geändert hat → Git zeigt keine unnötigen Änderungen
  if (!fs.existsSync(datei) || fs.readFileSync(datei, 'utf8') !== inhalt) fs.writeFileSync(datei, inhalt);
  geschrieben.add(path.resolve(datei));
}

function kopiere(von, nach) {
  fs.mkdirSync(path.dirname(nach), { recursive: true });
  const a = fs.statSync(von);
  const b = fs.existsSync(nach) ? fs.statSync(nach) : null;
  if (!b || b.size !== a.size || b.mtimeMs < a.mtimeMs) fs.copyFileSync(von, nach);
  geschrieben.add(path.resolve(nach));
}

function kopiereOrdner(von, nach) {
  for (const d of fs.readdirSync(von, { withFileTypes: true })) {
    const a = path.join(von, d.name), b = path.join(nach, d.name);
    if (d.isDirectory()) kopiereOrdner(a, b); else kopiere(a, b);
  }
}

/* Vorlagen: {{name}} wird ersetzt. Unbekannte Platzhalter sind ein Fehler (Tippfehler fallen sofort auf).
   Eingesetzter Inhalt wird NICHT noch einmal durchsucht. */
const vorlagenCache = {};
function vorlage(name, daten) {
  // HTML-Kommentare in Vorlagen sind Notizen für dich → nicht in die fertige Seite übernehmen
  if (!vorlagenCache[name]) vorlagenCache[name] = fs.readFileSync(path.join(VORLAGEN, name), 'utf8').replace(/[ \t]*<!--[\s\S]*?-->\r?\n?/g, '');
  return vorlagenCache[name].replace(/\{\{([a-z_]+)\}\}/g, (m, key) => {
    if (!(key in daten)) throw new Error(`Vorlage ${name}: Platzhalter {{${key}}} hat keinen Wert`);
    return daten[key];
  });
}

/* Ganze Seite = seite.html mit eingesetztem Inhalt */
/* bodyAttr: zusätzliche Attribute für <body>, z. B. data-fach für fach.js */
function seite({ titel, root, inhalt, kopf = '', skripte = '', bodyAttr = '' }) {
  return vorlage('seite.html', { titel: esc(titel), root, inhalt, kopf, skripte, body: bodyAttr });
}

/* ---------- Front matter (der Block zwischen --- und --- am Anfang von thema.md) ----------
   Bewusst selbst geschrieben statt einer YAML-Bibliothek: unser Format ist einfach.
     schluessel: Text
     schluessel: [a, b, c]     → Liste                                                     */
function frontMatter(text, datei) {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/);
  if (!m) {
    fehler.push(`${rel(datei)}: Front matter fehlt. Die Datei muss mit --- beginnen.`);
    return { daten: {}, text };
  }
  const daten = {};
  m[1].split(/\r?\n/).forEach((zeile, i) => {
    if (!zeile.trim() || zeile.trim().startsWith('#')) return;
    const z = zeile.match(/^([a-zA-Z_]+)\s*:\s*(.*)$/);
    if (!z) { fehler.push(`${rel(datei)}:${i + 2}: Zeile nicht verstanden: "${zeile}" (erwartet: schluessel: wert)`); return; }
    let wert = z[2].trim();
    if (/^\[.*\]$/.test(wert)) {
      wert = wert.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      wert = wert.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }
    daten[z[1]] = wert;
  });
  return { daten, text: text.slice(m[0].length) };
}

/* =====================================================================
   1. EINLESEN
   ===================================================================== */
function einlesen() {
  const faecher = [];
  const themen = [];

  for (const fachId of unterordner(QUELLE)) {
    const fachDir = path.join(QUELLE, fachId);
    const jsonDatei = path.join(fachDir, 'fach.json');
    if (!fs.existsSync(jsonDatei)) { fehler.push(`${rel(fachDir)}: fach.json fehlt.`); continue; }
    let fach;
    try { fach = JSON.parse(fs.readFileSync(jsonDatei, 'utf8')); }
    catch (e) { fehler.push(`${rel(jsonDatei)}: kein gültiges JSON (${e.message})`); continue; }
    if (!ID_MUSTER.test(fachId)) fehler.push(`${rel(fachDir)}: Ordnername nur aus a–z, 0–9 und Bindestrich.`);
    faecher.push({
      id: fachId,
      kuerzel: fach.kuerzel || fachId.toUpperCase(),
      name: fach.name || fachId,
      reihenfolge: Number(fach.reihenfolge) || 99
    });

    for (const id of unterordner(fachDir)) {
      const dir = path.join(fachDir, id);
      const mdDatei = path.join(dir, 'thema.md');
      if (!fs.existsSync(mdDatei)) { warnungen.push(`${rel(dir)}: keine thema.md – Ordner wird übersprungen.`); continue; }
      const { daten, text } = frontMatter(fs.readFileSync(mdDatei, 'utf8'), mdDatei);

      // Visualisierungen: jede .html-Datei in viz/ (die zwei Kommentare oben liefern Titel und Kurztext)
      const vizDir = path.join(dir, 'viz');
      const viz = dateien(vizDir).filter((f) => f.endsWith('.html')).map((f) => {
        const roh = fs.readFileSync(path.join(vizDir, f), 'utf8');
        const name = f.slice(0, -5);
        return {
          name,
          titel: (roh.match(/<!--\s*titel:\s*(.*?)\s*-->/) || [])[1] || name,
          kurz: (roh.match(/<!--\s*kurz:\s*(.*?)\s*-->/) || [])[1] || '',
          roh
        };
      });

      // Bilder: alles mit passender Endung direkt in bilder/
      const bildDir = path.join(dir, 'bilder');
      const bilder = [];
      for (const f of dateien(bildDir)) {
        if (f.startsWith('.')) continue; // .gitkeep usw.
        if (BILD_ENDUNGEN.includes(path.extname(f).toLowerCase())) bilder.push(f);
        else warnungen.push(`${rel(path.join(bildDir, f))}: Format wird nicht verarbeitet (nur ${BILD_ENDUNGEN.join(', ')}). iPhone-Fotos (.heic) bitte als JPG exportieren.`);
      }

      themen.push({
        id, fach: fachId,
        titel: daten.titel || '',
        kurz: daten.kurz || '',
        voraus: Array.isArray(daten.voraus) ? daten.voraus : (daten.voraus ? [daten.voraus] : []),
        status: daten.status === 'geplant' ? 'geplant' : 'fertig',
        statusRoh: daten.status,
        text, viz, bilder, dir, mdDatei
      });
    }
  }
  return { faecher, themen };
}

/* =====================================================================
   2. PRÜFEN
   ===================================================================== */
function pruefen({ themen }) {
  const ids = {};
  for (const t of themen) {
    const wo = rel(t.mdDatei);
    if (!ID_MUSTER.test(t.id)) fehler.push(`${wo}: Ordnername "${t.id}" ist keine gültige id (nur a–z, 0–9, Bindestrich; ä → ae, ß → ss).`);
    if (ids[t.id]) fehler.push(`${wo}: id "${t.id}" gibt es schon in ${rel(ids[t.id].mdDatei)}.`);
    ids[t.id] = t;
    if (!t.titel) fehler.push(`${wo}: "titel:" fehlt im Front matter.`);
    if (!t.kurz) warnungen.push(`${wo}: "kurz:" fehlt (ein Satz für die Karte auf der Startseite).`);
    if (t.statusRoh && !['geplant', 'fertig'].includes(t.statusRoh)) fehler.push(`${wo}: status "${t.statusRoh}" unbekannt (erlaubt: geplant, fertig).`);
    if (t.status === 'fertig' && !t.text.trim()) warnungen.push(`${wo}: kein Text, aber nicht als "status: geplant" markiert.`);
  }
  for (const t of themen) {
    for (const v of t.voraus) {
      if (v === t.id) fehler.push(`${rel(t.mdDatei)}: Thema setzt sich selbst voraus.`);
      else if (!ids[v]) fehler.push(`${rel(t.mdDatei)}: voraus enthält "${v}", diese id gibt es nicht.`);
    }
  }
  const zyklus = TopicGraph.create(themen).findCycle();
  if (zyklus) fehler.push(`Zyklus in den Voraussetzungen: ${zyklus.join(' → ')} (das kann man nie lernen).`);
}

/* =====================================================================
   3. RENDERN (Markdown → HTML)
   ===================================================================== */

/* Formeln, Themen-Links und Platzhalter in einem thema.md-Text verarbeiten.
   Reihenfolge ist wichtig:
     a) HTML-Kommentare entfernen (Notizen für dich, nicht für die Seite)
     b) Code schützen (darin darf $ oder [[ ganz normal vorkommen)
     c) Formeln herausziehen und durch Platzhalter ersetzen – sonst würde Markdown
        z. B. die _ in $u_a$ als kursiv deuten und die Formel zerstören
     d) [[thema-id]] → normaler Markdown-Link
     e) Markdown rendern, dann Formeln (fertiges KaTeX-HTML) wieder einsetzen
     f) {{viz:name}} → eingebettete Visualisierung, Typische Fragen → aufklappbar */
/* Eine Formel mit KaTeX setzen. strict: 'error' meldet auch Kleinigkeiten (z. B. ° statt ^\circ). */
function texZuHtml(tex, display, wo) {
  try {
    return katex.renderToString(tex.trim(), { displayMode: display, throwOnError: true, strict: 'error' });
  } catch (e) {
    fehler.push(`${wo}: Formel kann nicht gesetzt werden: $${tex.trim()}$ → ${e.message.replace(/^KaTeX parse error: /, '')}`);
    return esc(tex);
  }
}

// Inline-Formel: $...$ ohne Leerzeichen direkt innen (so ist "5 $ und 10 $" keine Formel), \$ = echtes Dollarzeichen
const INLINE_FORMEL = /(^|[^\\$])\$([^\s$](?:[^$\n]*?[^\s\\$])?)\$(?!\d)/g;

/* Kurzer Text (z. B. "kurz:" aus dem Front matter): HTML-sicher machen, $...$ als Formel setzen */
function textMitFormeln(s, wo) {
  const formeln = [];
  const ohne = String(s).replace(INLINE_FORMEL, (m, vor, tex) => { formeln.push(texZuHtml(tex, false, wo)); return `${vor}KATEXPLATZHALTER${formeln.length - 1}X`; });
  return esc(ohne).replace(/KATEXPLATZHALTER(\d+)X/g, (m, i) => formeln[i]);
}

function renderMarkdown(t, ctx) {
  const wo = rel(t.mdDatei);
  let md = t.text.replace(/<!--[\s\S]*?-->/g, '');

  const code = [];
  md = md.replace(/```[\s\S]*?```|`[^`\n]+`/g, (m) => { code.push(m); return `CODEPLATZHALTER${code.length - 1}X`; });

  const formeln = [];
  const formel = (tex, display) => {
    formeln.push({ html: texZuHtml(tex, display, wo), display });
    return `KATEXPLATZHALTER${formeln.length - 1}X`;
  };
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) => formel(tex, true));
  md = md.replace(INLINE_FORMEL, (m, vor, tex) => vor + formel(tex, false));

  // [[id]] → Link auf das Thema (jedes Thema hat eine Seite, auch geplante)
  md = md.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, text) => {
    const z = ctx.byId[id];
    if (!z) { fehler.push(`${wo}: Link [[${id}]] – dieses Thema gibt es nicht.`); return text || id; }
    return `[${text || z.titel}](../../${z.fach}/${z.id}/index.html)`;
  });

  md = md.replace(/CODEPLATZHALTER(\d+)X/g, (m, i) => code[i]);

  let html = marked.parse(md);

  // Formeln einsetzen. Block-Formeln ($$...$$) bekommen einen eigenen Kasten (<div class="formula">,
  // waagrecht scrollbar am Handy). Steht $$...$$ direkt unter einer Textzeile (ohne Leerzeile),
  // packt Markdown beides in EINEN Absatz → Absatz an der Formel aufteilen.
  const blockFormel = (i) => `<div class="formula">${formeln[i].html}</div>`;
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (m, inner) => {
    // Nur an BLOCK-Formeln trennen; Inline-Formeln bleiben im Text. Block-Platzhalter vorher mit \u0000 markieren.
    const markiert = inner.replace(/KATEXPLATZHALTER(\d+)X/g, (tok, i) => formeln[i].display ? `\u0000${i}\u0000` : tok);
    if (markiert === inner) return m;
    return markiert.split(/\u0000(\d+)\u0000/).map((teil, j) =>
      j % 2 === 1 ? blockFormel(teil) : (teil.trim() ? `<p>${teil.trim()}</p>` : '')
    ).join('\n');
  });
  html = html.replace(/KATEXPLATZHALTER(\d+)X/g, (m, i) => formeln[i].display ? blockFormel(i) : formeln[i].html);

  // Visualisierung einbetten (muss allein in einer Zeile stehen).
  // Fehlt die Datei noch: Warnung + Platzhalter-Kasten, damit man trotzdem veröffentlichen kann.
  html = html.replace(/<p>\s*\{\{viz:([a-z0-9-]+)\}\}\s*<\/p>/g, (m, name) => {
    const v = t.viz.find((x) => x.name === name);
    if (v) return vizEinbetten(v);
    warnungen.push(`${wo}: {{viz:${name}}} – Datei viz/${name}.html gibt es noch nicht (Platzhalter angezeigt).`);
    return `<div class="fehlt">Visualisierung „${esc(name)}“ kommt noch.</div>`;
  });

  // Bilder: prüfen, ob es sie gibt; lazy laden. Fehlt ein Foto: Warnung + Platzhalter mit Dateiname.
  html = html.replace(/<img src="bilder\/([^"]+)" alt="([^"]*)"[^>]*>/g, (m, f, alt) => {
    if (t.bilder.includes(decodeURIComponent(f))) return `<img loading="lazy" src="bilder/${f}" alt="${alt}">`;
    warnungen.push(`${wo}: Foto bilder/${decodeURIComponent(f)} fehlt noch (Platzhalter angezeigt).`);
    return `<span class="fehlt">Foto fehlt: ${alt ? alt + ' – ' : ''}<code>bilder/${f}</code></span>`;
  });

  // "Typische Fragen": jede Frage wird zu <details> (erst überlegen, dann aufklappen).
  // Zwei Schreibweisen gehen:   ### Frage?          oder   **Frage?**
  //                             Antwort.                   Antwort.
  html = html.replace(/(<h2>Typische Fragen<\/h2>)([\s\S]*?)(?=<h2>|$)/, (m, kopf, rumpf) =>
    kopf + rumpf.split(/(?=<h3>|<p><strong>)/).map((teil) => {
      let q = teil.match(/^<h3>([\s\S]*?)<\/h3>([\s\S]*)$/);
      if (q) return `<details class="qa"><summary>${q[1]}</summary>${q[2]}</details>\n`;
      q = teil.match(/^<p><strong>([\s\S]*?)<\/strong>\s*(?:<br>)?\s*([\s\S]*)$/);
      if (!q) return teil;
      // Antwort stand im selben Absatz (nur Zeilenumbruch) → Absatz wieder öffnen
      const antwort = q[2].startsWith('</p>') ? q[2].slice(4) : '<p>' + q[2];
      return `<details class="qa"><summary>${q[1]}</summary>${antwort}</details>\n`;
    }).join(''));

  return html;
}

function vizEinbetten(v) {
  return `<figure class="viz">
  <figcaption class="viz-leiste">
    <span>${esc(v.titel)}</span>
    <span class="viz-knoepfe">
      <button type="button" class="viz-vollbild">⛶ Vollbild</button>
      <a href="viz/${v.name}.html" target="_blank" rel="noopener">Neuer Tab ↗</a>
    </span>
  </figcaption>
  <iframe src="viz/${v.name}.html" title="${esc(v.titel)}" loading="lazy" allowfullscreen></iframe>
</figure>`;
}

/* Link-Chip auf ein anderes Thema (von einer Themenseite aus) */
function chip(z, faecherById, eigenesFach) {
  const fachTxt = z.fach !== eigenesFach ? ` · ${esc(faecherById[z.fach].kuerzel)}` : '';
  const href = `../../${z.fach}/${z.id}/index.html`;
  if (z.status === 'fertig') return `<a class="chip done" href="${href}">✓ ${esc(z.titel)}${fachTxt}</a>`;
  return `<a class="chip plan" href="${href}">${esc(z.titel)}${fachTxt} (geplant)</a>`;
}

/* Themenkarte (auf der Fach-Seite). Jede Karte ist ein Link, auch bei geplanten Themen. */
function themaKarte(t, ctx, href, nr) {
  const done = t.status === 'fertig';
  return `      <a class="tcard ${done ? 'done' : 'plan'}" href="${href}">
        <span class="fach">${nr}. ${esc(ctx.faecherById[t.fach].kuerzel)}</span>
        <h3>${esc(t.titel)}</h3>
        <p>${textMitFormeln(t.kurz, rel(t.mdDatei))}</p>
        <span class="badge">${done ? '✓ Zusammenfassung' : 'geplant'}</span>
      </a>\n`;
}

/* Startseite: nur die Fach-Kacheln */
function startSeite(ctx) {
  const kacheln = ctx.faecher.map((f) => {
    const liste = ctx.themen.filter((t) => t.fach === f.id);
    const fertig = liste.filter((t) => t.status === 'fertig').length;
    const info = liste.length ? `${liste.length} ${liste.length === 1 ? 'Thema' : 'Themen'} · ${fertig} fertig` : 'noch keine Themen';
    return `      <a class="fach-kachel" href="faecher/${f.id}/index.html">
        <strong>${esc(f.kuerzel)}</strong>
        <span class="name">${esc(f.name)}</span>
        <span class="info">${info}</span>
      </a>`;
  }).join('\n');
  return seite({ titel: 'Matura-Lernseite', root: '', inhalt: vorlage('start.html', { kacheln }) });
}

/* Fach-Seite: alle Themen des Fachs (in Lernreihenfolge) + Graph nur für dieses Fach */
function fachSeite(f, ctx) {
  const liste = ctx.themen.filter((t) => t.fach === f.id);
  const karten = liste.length
    ? `    <div class="cards">\n${liste.map((t, i) => themaKarte(t, ctx, `${t.id}/index.html`, i + 1)).join('')}    </div>`
    : `    <p class="leer">Hier gibt es noch keine Themen. Neues Thema anlegen: <code>npm run neu -- ${f.id} thema-id</code></p>`;
  const graph = liste.length ? vorlage('graph.html', {}) : '';
  return seite({
    titel: `${f.kuerzel} – ${f.name} – Matura-Lernseite`,
    root: '../../',
    bodyAttr: ` data-fach="${f.id}" data-root="../../"`,
    inhalt: vorlage('fach.html', { root: '../../', kuerzel: esc(f.kuerzel), name: esc(f.name), karten, graph }),
    kopf: '  <link rel="stylesheet" href="../../assets/katex/katex.min.css">',
    skripte: liste.length
      ? ['daten/themen.js', 'assets/js/graph.js', 'assets/js/fach.js'].map((s) => `  <script src="../../${s}"></script>`).join('\n')
      : ''
  });
}

function themaSeite(t, ctx) {
  const fach = ctx.faecherById[t.fach];
  const G = ctx.graph;

  // Reiter "Visualisierungen"
  const vizHtml = t.viz.length ? `
    <section class="tab-panel" id="visualisierungen" data-reiter="Visualisierungen" data-anzahl="${t.viz.length}">
      <h2 class="nur-ohne-js">Visualisierungen</h2>
${t.viz.map((v) => `      <h3>${esc(v.titel)}</h3>${v.kurz ? `<p class="caption">${esc(v.kurz)}</p>` : ''}\n${vizEinbetten(v)}`).join('\n')}
    </section>` : '';

  // Reiter "Bilder": Vorschaubilder (klein/) verlinken auf die große Version
  const bildHtml = t.bilder.length ? `
    <section class="tab-panel" id="bilder" data-reiter="Bilder" data-anzahl="${t.bilder.length}">
      <h2 class="nur-ohne-js">Bilder</h2>
      <div class="galerie">
${t.bilder.map((f) => `        <a href="bilder/${encodeURI(f)}" class="galerie-bild"><img src="bilder/klein/${encodeURI(f)}" alt="${esc(f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))}" loading="lazy"></a>`).join('\n')}
      </div>
    </section>` : '';

  // Reiter "Vorwissen": direkt beim Build berechnet, braucht kein JavaScript
  const anc = G.ancestors(t.id), suc = G.successors(t.id);
  let vw = '<div class="panel">';
  if (anc.length) vw += `<div class="row"><div class="lab">Das solltest du vorher können (in dieser Reihenfolge):</div><ol class="chips">${anc.map((id) => `<li>${chip(ctx.byId[id], ctx.faecherById, t.fach)}</li>`).join('')}</ol></div>`;
  else vw += '<div class="row">Dieses Thema braucht kein Vorwissen aus anderen Themen.</div>';
  if (suc.length) vw += `<div class="row"><div class="lab">Darauf baut auf:</div><ul class="chips">${suc.map((id) => `<li>${chip(ctx.byId[id], ctx.faecherById, t.fach)}</li>`).join('')}</ul></div>`;
  vw += `<div class="row"><a href="../index.html#thema=${t.id}">Im Graphen ansehen →</a></div></div>`;

  // Geplantes Thema ohne Text: Seite gibt es trotzdem (Klick soll immer irgendwo hinführen)
  const zusammenfassung = t.text.trim()
    ? renderMarkdown(t, ctx)
    : `<div class="fehlt gross">Für dieses Thema gibt es noch keine Zusammenfassung.<br>
        <small>Text in <code>faecher/${t.fach}/${t.id}/thema.md</code> schreiben, dann <code>npm run build</code>.</small></div>`;

  const inhalt = vorlage('thema.html', {
    root: '../../../',
    fach_kuerzel: esc(fach.kuerzel), fach_name: esc(fach.name),
    titel: esc(t.titel) + (t.status === 'fertig' ? '' : ' <span class="h-sub">(geplant)</span>'),
    kurz: textMitFormeln(t.kurz, rel(t.mdDatei)),
    zusammenfassung,
    visualisierungen: vizHtml, bilder: bildHtml, vorwissen: vw
  });
  return seite({
    titel: `${t.titel} – ${fach.kuerzel} – Matura-Lernseite`,
    root: '../../../',
    inhalt,
    kopf: '  <link rel="stylesheet" href="../../../assets/katex/katex.min.css">',
    skripte: '  <script src="../../../assets/js/thema.js"></script>'
  });
}

function alleVizSeite(ctx) {
  let liste = '';
  for (const f of ctx.faecher) {
    const eintraege = ctx.themen.filter((t) => t.fach === f.id)
      .flatMap((t) => t.viz.map((v) => ({ t, v })));
    if (!eintraege.length) continue;
    liste += `    <h2>${esc(f.kuerzel)} <span class="h-sub">${esc(f.name)}</span></h2>\n    <div class="cards">\n`;
    for (const { t, v } of eintraege) {
      liste += `      <div class="tcard done">
        <span class="fach">${esc(f.kuerzel)} · ${esc(t.titel)}</span>
        <h3><a class="karten-link" href="faecher/${f.id}/${t.id}/viz/${v.name}.html">${esc(v.titel)}</a></h3>
        <p>${textMitFormeln(v.kurz, rel(t.mdDatei))}</p>
        <a class="badge" href="faecher/${f.id}/${t.id}/index.html">Zum Thema →</a>
      </div>\n`;
    }
    liste += '    </div>\n';
  }
  if (!liste) liste = '    <p>Noch keine Visualisierungen.</p>\n';
  return seite({ titel: 'Alle Visualisierungen – Matura-Lernseite', root: '', inhalt: vorlage('alle-viz.html', { liste }) });
}

/* =====================================================================
   4. SCHREIBEN
   ===================================================================== */
async function bildVerkleinern(von, nach, max) {
  // Nur neu rechnen, wenn das Original neuer ist (Bilder sind der langsamste Teil des Builds)
  if (fs.existsSync(nach) && fs.statSync(nach).mtimeMs >= fs.statSync(von).mtimeMs) { geschrieben.add(path.resolve(nach)); return false; }
  fs.mkdirSync(path.dirname(nach), { recursive: true });
  let bild = sharp(von).rotate() // .rotate() ohne Zahl = Handyfoto laut EXIF richtig drehen
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  const endung = path.extname(von).toLowerCase();
  if (endung === '.png') bild = bild.png({ compressionLevel: 9 }); // PNG bleibt PNG (scharfe Linien bei Schaltplänen)
  else if (endung === '.webp') bild = bild.webp({ quality: 80 });
  else bild = bild.jpeg({ quality: 82, mozjpeg: true });
  await bild.toFile(nach);
  geschrieben.add(path.resolve(nach));
  return true;
}

function aufraeumen(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      aufraeumen(p);
      if (!fs.readdirSync(p).length) fs.rmdirSync(p);
    } else if (!geschrieben.has(path.resolve(p))) {
      fs.unlinkSync(p);
    }
  }
}

/* =====================================================================
   HAUPTPROGRAMM
   ===================================================================== */
async function main() {
  const start = Date.now();

  // 1 + 2
  const { faecher, themen } = einlesen();
  pruefen({ themen });
  if (fehler.length) return abbruch();

  // Sortierung: Fach-Reihenfolge, dann Ebene im Graphen, dann alphabetisch
  faecher.sort((a, b) => a.reihenfolge - b.reihenfolge || a.id.localeCompare(b.id));
  const fachPos = Object.fromEntries(faecher.map((f, i) => [f.id, i]));
  const G0 = TopicGraph.create(themen);
  themen.sort((a, b) => fachPos[a.fach] - fachPos[b.fach] || G0.layer(a.id) - G0.layer(b.id) || a.titel.localeCompare(b.titel, 'de'));

  const ctx = {
    faecher, themen,
    faecherById: Object.fromEntries(faecher.map((f) => [f.id, f])),
    byId: Object.fromEntries(themen.map((t) => [t.id, t])),
    graph: TopicGraph.create(themen)
  };

  // 3: alle Seiten im Speicher erzeugen (Formelfehler usw. werden gesammelt)
  const seiten = [];
  seiten.push([path.join(ZIEL, 'index.html'), startSeite(ctx)]);
  seiten.push([path.join(ZIEL, 'alle-visualisierungen.html'), alleVizSeite(ctx)]);
  for (const f of faecher) seiten.push([path.join(ZIEL, 'faecher', f.id, 'index.html'), fachSeite(f, ctx)]);
  // JEDES Thema bekommt eine Seite (geplante zeigen "noch keine Zusammenfassung")
  for (const t of themen) {
    seiten.push([path.join(ZIEL, 'faecher', t.fach, t.id, 'index.html'), themaSeite(t, ctx)]);
    for (const v of t.viz) {
      const inhalt = v.roh.replace(/^\s*<!--\s*(titel|kurz):.*?-->\s*\n?/gm, '');
      seiten.push([path.join(ZIEL, 'faecher', t.fach, t.id, 'viz', v.name + '.html'), vorlage('viz.html', {
        titel: esc(v.titel), root: '../../../../', thema_link: '../index.html', thema_titel: esc(t.titel), inhalt
      })]);
    }
  }
  if (fehler.length) return abbruch();

  // 4: schreiben
  for (const [datei, html] of seiten) schreibe(datei, html);

  // Datenliste für den Graphen auf den Fach-Seiten. Als .js statt .json, weil fetch() bei file:// nicht geht.
  // pfad ist relativ zu docs/ (fach.js setzt davor, wie weit es bis docs/ zurück ist).
  const daten = {
    faecher: faecher.map(({ id, kuerzel, name }) => ({ id, kuerzel, name })),
    themen: themen.map((t) => ({
      id: t.id, titel: t.titel, fach: t.fach, status: t.status, voraus: t.voraus,
      pfad: `faecher/${t.fach}/${t.id}/index.html`
    }))
  };
  schreibe(path.join(ZIEL, 'daten', 'themen.js'),
    '/* Automatisch erzeugt von build.js – nicht von Hand ändern, sondern thema.md bearbeiten. */\n' +
    `window.FAECHER = ${JSON.stringify(daten.faecher, null, 2)};\n` +
    `window.TOPICS = ${JSON.stringify(daten.themen, null, 2)};\n`);

  schreibe(path.join(ZIEL, '.nojekyll'), ''); // GitHub Pages soll nichts selbst umbauen

  kopiereOrdner(path.join(WURZEL, 'assets'), path.join(ZIEL, 'assets'));
  const katexDir = path.dirname(require.resolve('katex/dist/katex.min.css'));
  kopiere(path.join(katexDir, 'katex.min.css'), path.join(ZIEL, 'assets', 'katex', 'katex.min.css'));
  for (const f of dateien(path.join(katexDir, 'fonts')).filter((f) => f.endsWith('.woff2'))) {
    kopiere(path.join(katexDir, 'fonts', f), path.join(ZIEL, 'assets', 'katex', 'fonts', f));
  }

  // Bilder und sonstige viz-Dateien (z. B. .js) je Thema
  let neueBilder = 0, anzahlBilder = 0;
  for (const t of themen) {
    const aus = path.join(ZIEL, 'faecher', t.fach, t.id);
    for (const f of dateien(path.join(t.dir, 'viz')).filter((f) => !f.endsWith('.html'))) {
      kopiere(path.join(t.dir, 'viz', f), path.join(aus, 'viz', f));
    }
    for (const f of t.bilder) {
      const von = path.join(t.dir, 'bilder', f);
      anzahlBilder++;
      try {
        if (await bildVerkleinern(von, path.join(aus, 'bilder', f), BILD_MAX)) neueBilder++;
        await bildVerkleinern(von, path.join(aus, 'bilder', 'klein', f), KLEIN_MAX);
      } catch (e) {
        fehler.push(`${rel(von)}: Bild kann nicht gelesen werden (${e.message})`);
      }
    }
  }
  if (fehler.length) return abbruch();

  // 5
  aufraeumen(ZIEL);

  warnungen.forEach((w) => console.log('⚠  ' + w));
  const fertig = themen.filter((t) => t.status === 'fertig');
  console.log(`✓ Build fertig in ${((Date.now() - start) / 1000).toFixed(1).replace('.', ',')} s → docs/`);
  console.log(`  ${faecher.length} Fächer, ${themen.length} Themen (${fertig.length} fertig), ` +
    `${fertig.reduce((s, t) => s + t.viz.length, 0)} Visualisierungen, ${anzahlBilder} Bilder (${neueBilder} neu verkleinert)`);
}

function abbruch() {
  warnungen.forEach((w) => console.log('⚠  ' + w));
  console.error(`\n✗ ${fehler.length} Fehler – Build abgebrochen:\n`);
  fehler.forEach((f) => console.error('  • ' + f));
  process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
