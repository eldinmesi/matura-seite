/* Startseite: Themenkarten + Zusammenhangs-Graph (Voraussetzungen) */
(function () {
  'use strict';
  var T = window.TOPICS, G = window.TopicGraph;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ----- Karten ----- */
  var cards = document.getElementById('cards');
  T.forEach(function (t) {
    var done = t.status === 'fertig';
    var el = document.createElement(done ? 'a' : 'div');
    el.className = 'tcard ' + (done ? 'done' : 'plan');
    if (done) el.href = 'topics/' + t.file;
    el.innerHTML = '<span class="fach">' + t.fach + '</span><h3>' + t.title + '</h3><p>' + t.kurz +
      '</p><span class="badge">' + (done ? '✓ fertig' : 'geplant') + '</span>';
    cards.appendChild(el);
  });

  /* ----- Graph ----- */
  var NODE_W = 178, NODE_H = 42;
  var L = G.layout({ nodeW: NODE_W, nodeH: NODE_H, colW: 232, rowH: 66, pad: 24 });
  var svg = document.getElementById('graph');
  svg.setAttribute('viewBox', '0 0 ' + L.width + ' ' + L.height);
  svg.setAttribute('width', L.width);
  svg.setAttribute('height', L.height);

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }

  var defs = el('defs', {}, svg);
  [['ga', 'ga'], ['ga-hl', 'ga-hl']].forEach(function (m) {
    var mk = el('marker', { id: m[0], viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, defs);
    el('path', { d: 'M0 0 L10 5 L0 10 z', 'class': m[1] }, mk);
  });

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
  T.forEach(function (t) {
    var p = L.pos[t.id], done = t.status === 'fertig';
    var g = el('g', { 'class': 'gn ' + (done ? 'done' : 'plan'), tabindex: 0, role: 'button',
      'aria-label': t.title + (done ? ', fertig' : ', geplant') + ' – Voraussetzungen anzeigen',
      transform: 'translate(' + p.x + ',' + p.y + ')' }, svg);
    el('rect', { width: NODE_W, height: NODE_H, rx: 10 }, g);
    var tx = el('text', { x: 12, y: done ? 19 : 25 }, g);
    tx.textContent = (done ? '✓ ' : '') + t.title;
    if (done) {
      var sub = el('text', { x: 12, y: 34, 'class': 'sub' }, g);
      sub.textContent = t.fach;
    }
    g.addEventListener('click', function () { select(t.id); });
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(t.id); }
    });
    nodeEls[t.id] = g;
  });

  /* ----- Auswahl: zeigt alle (auch indirekten) Voraussetzungen ----- */
  var chain = document.getElementById('chain');

  function chipEl(tid) {
    var t = G.byId[tid];
    var c = document.createElement('li');
    var inner = document.createElement(t.status === 'fertig' ? 'a' : 'span');
    inner.className = 'chip ' + (t.status === 'fertig' ? 'done' : 'plan');
    if (t.status === 'fertig') inner.href = 'topics/' + t.file;
    inner.textContent = t.title;
    c.appendChild(inner);
    return c;
  }

  function select(id) {
    var anc = G.ancestors(id), set = {};
    anc.forEach(function (a) { set[a] = true; });
    set[id] = true;

    T.forEach(function (t) {
      var g = nodeEls[t.id];
      var base = 'gn ' + (t.status === 'fertig' ? 'done' : 'plan');
      if (t.id === id) base += ' sel';
      else if (set[t.id]) base += ' anc';
      else base += ' dim';
      g.setAttribute('class', base);
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
    h.firstChild.textContent = t.title;
    h.appendChild(document.createTextNode(anc.length
      ? ' – das musst du vorher können (in dieser Reihenfolge):'
      : ' – hat keine Voraussetzungen im Graph.'));
    chain.appendChild(h);
    if (anc.length) {
      var ul = document.createElement('ul');
      ul.className = 'chips';
      anc.forEach(function (a) { ul.appendChild(chipEl(a)); });
      chain.appendChild(ul);
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
      r3.innerHTML = '<a class="btn" href="topics/' + t.file + '">Zur Seite →</a>';
      chain.appendChild(r3);
    }
  }

  select('rc-tiefpass');
})();
