/* =====================================================================
   Startseite: Fach-Kacheln (Filter), Themenkarten und Zusammenhangs-Graph.
   Daten kommen aus docs/daten/themen.js (von build.js erzeugt):
     window.FAECHER = [{ id, kuerzel, name }]
     window.TOPICS  = [{ id, titel, fach, status, voraus, kurz, pfad? }]
   Der Filter steht in der Adresse: index.html#fach=hwe  (oder #thema=rc-tiefpass)
   So funktionieren Zurück-Knopf und Links von den Themenseiten.
   ===================================================================== */
(function () {
  'use strict';
  var F = window.FAECHER, T = window.TOPICS;
  var G = window.TopicGraph.create(T);
  var SVGNS = 'http://www.w3.org/2000/svg';
  var fachById = {};
  F.forEach(function (f) { fachById[f.id] = f; });

  var NODE_W = 178, NODE_H = 42;
  var LAYOUT = { nodeW: NODE_W, nodeH: NODE_H, colW: 232, rowH: 66, pad: 24 };

  var aktFach = null;   // null = alle Fächer
  var auswahl = null;   // ausgewähltes Thema im Graphen

  /* ---------- Adresse lesen/schreiben (#fach=hwe&thema=rc-tiefpass) ---------- */
  function hashLesen() {
    var p = {};
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    return p;
  }
  function hashSchreiben() {
    var h = aktFach ? 'fach=' + aktFach : '';
    // replaceState: ändert die Adresse, ohne zu springen und ohne neuen Verlaufseintrag pro Klick im Graphen
    history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
  }

  /* ---------- Fach-Kacheln ---------- */
  var kachelBox = document.getElementById('faecher');
  function kachel(id, gross, klein, info) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fach-kachel';
    b.setAttribute('data-fach', id || '');
    b.innerHTML = '<strong></strong><span class="name"></span><span class="info"></span>';
    b.children[0].textContent = gross;
    b.children[1].textContent = klein;
    b.children[2].textContent = info;
    b.addEventListener('click', function () { fachWaehlen(id); hashSchreiben(); });
    kachelBox.appendChild(b);
  }
  function zaehlen(liste) {
    var fertig = liste.filter(function (t) { return t.status === 'fertig'; }).length;
    return liste.length ? fertig + ' von ' + liste.length + ' fertig' : 'noch keine Themen';
  }
  kachel(null, 'Alle', 'alle Fächer', zaehlen(T));
  F.forEach(function (f) {
    kachel(f.id, f.kuerzel, f.name, zaehlen(T.filter(function (t) { return t.fach === f.id; })));
  });

  /* ---------- Themenkarten ---------- */
  var cards = document.getElementById('cards');
  function kartenZeichnen(liste) {
    cards.innerHTML = '';
    if (!liste.length) {
      var p = document.createElement('p');
      p.className = 'leer';
      p.innerHTML = 'Hier gibt es noch keine Themen. Neues Thema anlegen: <code></code>';
      p.querySelector('code').textContent = 'npm run neu -- ' + aktFach + ' thema-id';
      cards.appendChild(p);
      return;
    }
    liste.forEach(function (t) {
      var done = t.status === 'fertig';
      var el = document.createElement(done ? 'a' : 'div');
      el.className = 'tcard ' + (done ? 'done' : 'plan');
      if (done) el.href = t.pfad;
      el.innerHTML = '<span class="fach"></span><h3></h3><p></p><span class="badge"></span>';
      el.children[0].textContent = fachById[t.fach].kuerzel;
      el.children[1].textContent = t.titel;
      el.children[2].textContent = t.kurz;
      el.children[3].textContent = done ? '✓ fertig' : 'geplant';
      cards.appendChild(el);
    });
  }

  /* ---------- Graph ---------- */
  var svg = document.getElementById('graph');
  var nodeEls = {}, edgeEls = [], sichtbar = [];

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ids = welche Themen gezeichnet werden. Beim Fach-Filter: Themen des Fachs
     PLUS alle ihre Voraussetzungen, auch aus anderen Fächern (die gestrichelt). */
  function graphZeichnen(ids) {
    var L = G.layout(LAYOUT, ids);
    sichtbar = L.ids;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 ' + L.width + ' ' + L.height);
    svg.setAttribute('width', L.width);
    svg.setAttribute('height', L.height);

    var defs = el('defs', {}, svg);
    ['ga', 'ga-hl'].forEach(function (m) {
      var mk = el('marker', { id: m, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, defs);
      el('path', { d: 'M0 0 L10 5 L0 10 z', 'class': m }, mk);
    });

    // Kanten: kubische Bézierkurve von rechts-Mitte der Voraussetzung zu links-Mitte des Themas
    edgeEls = L.edges.map(function (e) {
      var a = L.pos[e.from], b = L.pos[e.to];
      var x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x - 2, y2 = b.y + NODE_H / 2, dx = (x2 - x1) / 2;
      var p = el('path', {
        'class': 'ge', 'marker-end': 'url(#ga)',
        d: 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2
      }, svg);
      return { el: p, from: e.from, to: e.to };
    });

    nodeEls = {};
    L.ids.forEach(function (id) {
      var t = G.byId[id], p = L.pos[id], done = t.status === 'fertig';
      var g = el('g', { tabindex: 0, role: 'button',
        'aria-label': t.titel + ' (' + fachById[t.fach].kuerzel + (done ? ', fertig' : ', geplant') + ') – Voraussetzungen anzeigen',
        transform: 'translate(' + p.x + ',' + p.y + ')' }, svg);
      el('rect', { width: NODE_W, height: NODE_H, rx: 10 }, g);
      var tx = el('text', { x: 12, y: 19 }, g);
      tx.textContent = (done ? '✓ ' : '') + kuerzen(t.titel, 21);
      var sub = el('text', { x: 12, y: 34, 'class': 'sub' }, g);
      sub.textContent = fachById[t.fach].kuerzel + (done ? '' : ' · geplant'); // Status nie nur über Farbe
      g.addEventListener('click', function () { waehlen(id); });
      g.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); waehlen(id); }
      });
      nodeEls[id] = g;
    });
  }

  function kuerzen(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function grundKlasse(id) {
    var t = G.byId[id];
    return 'gn ' + (t.status === 'fertig' ? 'done' : 'plan') + (aktFach && t.fach !== aktFach ? ' fremd' : '');
  }

  /* ---------- Auswahl: zeigt alle (auch indirekten) Voraussetzungen ---------- */
  var chain = document.getElementById('chain');

  function chipEl(tid) {
    var t = G.byId[tid], done = t.status === 'fertig';
    var li = document.createElement('li');
    var inner = document.createElement(done ? 'a' : 'span');
    inner.className = 'chip ' + (done ? 'done' : 'plan');
    if (done) inner.href = t.pfad;
    inner.textContent = (done ? '✓ ' : '') + t.titel + ' · ' + fachById[t.fach].kuerzel + (done ? '' : ' (geplant)');
    li.appendChild(inner);
    return li;
  }

  function waehlen(id) {
    auswahl = id;
    var anc = G.ancestors(id), set = {};
    anc.forEach(function (a) { set[a] = true; });
    set[id] = true;

    sichtbar.forEach(function (tid) {
      var k = grundKlasse(tid);
      if (tid === id) k += ' sel';
      else if (set[tid]) k += ' anc';
      else k += ' dim';
      nodeEls[tid].setAttribute('class', k);
    });
    edgeEls.forEach(function (e) {
      var hl = set[e.from] && set[e.to];
      e.el.setAttribute('class', 'ge' + (hl ? ' hl' : ' dim'));
      e.el.setAttribute('marker-end', hl ? 'url(#ga-hl)' : 'url(#ga)');
    });

    var t = G.byId[id], suc = G.successors(id);
    chain.innerHTML = '';
    var h = document.createElement('div');
    h.className = 'row';
    h.innerHTML = '<strong></strong>';
    h.firstChild.textContent = t.titel;
    h.appendChild(document.createTextNode(anc.length
      ? ' – das musst du vorher können (in dieser Reihenfolge):'
      : ' – hat keine Voraussetzungen im Graph.'));
    chain.appendChild(h);
    if (anc.length) {
      var ol = document.createElement('ol');
      ol.className = 'chips';
      anc.forEach(function (a) { ol.appendChild(chipEl(a)); });
      chain.appendChild(ol);
    }
    if (suc.length) {
      var r2 = document.createElement('div');
      r2.className = 'row';
      r2.innerHTML = '<div class="lab">Darauf baut auf:</div>';
      var ul2 = document.createElement('ul');
      ul2.className = 'chips';
      suc.forEach(function (s) { ul2.appendChild(chipEl(s)); });
      r2.appendChild(ul2);
      chain.appendChild(r2);
    }
    if (t.status === 'fertig') {
      var r3 = document.createElement('div');
      r3.className = 'row';
      r3.innerHTML = '<a class="btn">Zur Seite →</a>';
      r3.firstChild.href = t.pfad;
      chain.appendChild(r3);
    }
  }

  /* ---------- Fach wählen: Kacheln, Karten und Graph neu ---------- */
  var titel = document.getElementById('themen-titel');
  var bereich = document.getElementById('zusammenhaenge');
  var legende = document.getElementById('graph-legende');

  function fachWaehlen(fachId) {
    aktFach = fachById[fachId] ? fachId : null;
    Array.prototype.forEach.call(kachelBox.children, function (b) {
      b.setAttribute('aria-pressed', String((b.getAttribute('data-fach') || null) === aktFach));
    });

    var eigene = T.filter(function (t) { return !aktFach || t.fach === aktFach; });
    titel.textContent = aktFach ? 'Themen in ' + fachById[aktFach].kuerzel + ' – ' + fachById[aktFach].name : 'Alle Themen';
    kartenZeichnen(eigene);

    if (!eigene.length) { bereich.hidden = true; return; }
    bereich.hidden = false;

    var ids = {};
    eigene.forEach(function (t) {
      ids[t.id] = true;
      G.ancestors(t.id).forEach(function (a) { ids[a] = true; });
    });
    graphZeichnen(Object.keys(ids));
    var fremde = sichtbar.some(function (id) { return aktFach && G.byId[id].fach !== aktFach; });
    legende.textContent = fremde
      ? 'Gestrichelt: Voraussetzung aus einem anderen Fach. ✓ = fertig, mit eigener Seite.'
      : '✓ = fertig, mit eigener Seite.';

    // Auswahl behalten, wenn sichtbar; sonst erstes fertiges Thema des Fachs, sonst erstes überhaupt
    if (!auswahl || sichtbar.indexOf(auswahl) < 0 || (aktFach && G.byId[auswahl].fach !== aktFach)) {
      var erstes = eigene.filter(function (t) { return t.status === 'fertig'; })[0] || eigene[0];
      auswahl = erstes.id;
    }
    waehlen(auswahl);
  }

  /* ---------- Start ---------- */
  function ausAdresse() {
    var p = hashLesen();
    if (p.thema && G.byId[p.thema]) {
      auswahl = p.thema;
      fachWaehlen(p.fach || null);
      bereich.scrollIntoView();
    } else {
      fachWaehlen(p.fach || null);
    }
  }
  window.addEventListener('hashchange', ausAdresse);
  ausAdresse();
})();
