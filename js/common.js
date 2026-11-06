/* Gemeinsames: Dark-Mode-Schalter und "Vorwissen"-Kasten auf Themenseiten */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ----- Hell/Dunkel ----- */
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) { /* egal */ }
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* egal */ }
    });
  }

  /* ----- Vorwissen-Kasten (nur auf Seiten mit <body data-topic="...">) ----- */
  var id = document.body.getAttribute('data-topic');
  var box = document.getElementById('prereq');
  if (!id || !box || !window.TopicGraph) return;
  var G = window.TopicGraph;

  function chip(tid) {
    var t = G.byId[tid];
    var el = document.createElement(t.status === 'fertig' ? 'a' : 'span');
    el.className = 'chip ' + (t.status === 'fertig' ? 'done' : 'plan');
    if (t.status === 'fertig') el.href = t.file;
    el.textContent = t.title + (t.status === 'fertig' ? '' : ' (geplant)');
    return el;
  }
  function row(label, ids) {
    var wrap = document.createElement('div');
    wrap.className = 'row';
    var lab = document.createElement('div');
    lab.className = 'lab';
    lab.textContent = label;
    wrap.appendChild(lab);
    var ul = document.createElement('ul');
    ul.className = 'chips';
    ids.forEach(function (x) { var li = document.createElement('li'); li.appendChild(chip(x)); ul.appendChild(li); });
    wrap.appendChild(ul);
    return wrap;
  }

  var anc = G.ancestors(id), suc = G.successors(id);
  if (anc.length) box.appendChild(row('Das solltest du vorher können (in dieser Reihenfolge):', anc));
  if (suc.length) box.appendChild(row('Darauf baut auf:', suc));
  if (!anc.length && !suc.length) box.style.display = 'none';
})();
