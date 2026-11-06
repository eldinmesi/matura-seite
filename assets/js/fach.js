/* =====================================================================
   Fach-Seite: Zusammenhangs-Graph für EIN Fach.
   (Kacheln und Themenkarten erzeugt schon build.js als fertiges HTML.)

   Woher weiß das Skript, welches Fach?  <body data-fach="mtrs" data-root="../../">
     data-root = Weg zurück nach docs/, damit die Links aus themen.js stimmen.
   Daten: docs/daten/themen.js  →  window.FAECHER, window.TOPICS
   Adresse: #thema=<id> wählt ein Thema im Graphen aus (Link "Im Graphen ansehen").
   ===================================================================== */
(function () {
  'use strict';
  var FACH = document.body.getAttribute('data-fach');
  var ROOT = document.body.getAttribute('data-root') || '';
  var T = window.TOPICS;
  var G = window.TopicGraph.create(T);
  var SVGNS = 'http://www.w3.org/2000/svg';
  var fachById = {};
  window.FAECHER.forEach(function (f) { fachById[f.id] = f; });

  var NODE_W = 178, NODE_H = 42;
  var LAYOUT = { nodeW: NODE_W, nodeH: NODE_H, colW: 232, rowH: 66, pad: 24 };

  var svg = document.getElementById('graph');
  var chain = document.getElementById('chain');
  var legende = document.getElementById('graph-legende');
  if (!svg) return;

  /* Gezeichnet werden die Themen dieses Fachs PLUS alle ihre Voraussetzungen,
     auch aus anderen Fächern (die bekommen einen gestrichelten Rand). */
  var eigene = T.filter(function (t) { return t.fach === FACH; });
  var ids = {};
  eigene.forEach(function (t) {
    ids[t.id] = true;
    G.ancestors(t.id).forEach(function (a) { ids[a] = true; });
  });
  var L = G.layout(LAYOUT, Object.keys(ids));

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function kuerzen(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function link(t) { return ROOT + t.pfad; }

  /* ---------- Zeichnen ---------- */
  svg.setAttribute('viewBox', '0 0 ' + L.width + ' ' + L.height);
  svg.setAttribute('width', L.width);
  svg.setAttribute('height', L.height);

  var defs = el('defs', {}, svg);
  ['ga', 'ga-hl'].forEach(function (m) {
    var mk = el('marker', { id: m, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, defs);
    el('path', { d: 'M0 0 L10 5 L0 10 z', 'class': m }, mk);
  });

  // Kanten: kubische Bézierkurve von rechts-Mitte der Voraussetzung zu links-Mitte des Themas
  var edgeEls = L.edges.map(function (e) {
    var a = L.pos[e.from], b = L.pos[e.to];
    var x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x - 2, y2 = b.y + NODE_H / 2, dx = (x2 - x1) / 2;
    var p = el('path', {
      'class': 'ge', 'marker-end': 'url(#ga)',
      d: 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2
    }, svg);
    return { el: p, from: e.from, to: e.to };
  });

  var nodeEls = {};
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
    var tip = el('title', {}, g); // voller Titel beim Drüberfahren (falls gekürzt)
    tip.textContent = t.titel;
    g.addEventListener('click', function () { waehlen(id); });
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); waehlen(id); }
    });
    nodeEls[id] = g;
  });

  var fremde = L.ids.some(function (id) { return G.byId[id].fach !== FACH; });
  legende.textContent = (fremde ? 'Gestrichelt: Voraussetzung aus einem anderen Fach. ' : '') + '✓ = fertige Zusammenfassung.';

  function grundKlasse(id) {
    var t = G.byId[id];
    return 'gn ' + (t.status === 'fertig' ? 'done' : 'plan') + (t.fach !== FACH ? ' fremd' : '');
  }

  /* ---------- Auswahl: zeigt alle (auch indirekten) Voraussetzungen ---------- */
  function chipEl(tid) {
    var t = G.byId[tid], done = t.status === 'fertig';
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'chip ' + (done ? 'done' : 'plan');
    a.href = link(t);
    a.textContent = (done ? '✓ ' : '') + t.titel + (t.fach !== FACH ? ' · ' + fachById[t.fach].kuerzel : '') + (done ? '' : ' (geplant)');
    li.appendChild(a);
    return li;
  }

  function waehlen(id) {
    var anc = G.ancestors(id), set = {};
    anc.forEach(function (a) { set[a] = true; });
    set[id] = true;

    L.ids.forEach(function (tid) {
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
    var r3 = document.createElement('div');
    r3.className = 'row';
    r3.innerHTML = '<a class="btn">Zur Zusammenfassung →</a>';
    r3.firstChild.href = link(t);
    chain.appendChild(r3);
  }

  /* ---------- Start: Thema aus der Adresse, sonst das am weitesten fortgeschrittene Thema des Fachs ---------- */
  var m = location.hash.match(/thema=([a-z0-9-]+)/);
  if (m && nodeEls[m[1]]) {
    waehlen(m[1]);
    document.getElementById('zusammenhaenge').scrollIntoView();
  } else {
    // Letztes Thema in Lernreihenfolge = zeigt die längste Kette, also am meisten Zusammenhang
    waehlen(eigene[eigene.length - 1].id);
  }
})();
