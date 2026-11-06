/* =====================================================================
   Alle Themen der Seite.
   Neues Thema anlegen:
     1. Eintrag unten ergänzen  (voraus = Liste von ids, die man vorher können muss)
     2. status auf 'fertig' setzen und file angeben (HTML-Datei im Ordner topics/)
   Der Zusammenhangs-Graph auf der Startseite baut sich daraus von selbst auf.
   ===================================================================== */
window.TOPICS = [
  { id: 'komplexe-zahlen', title: 'Komplexe Zahlen', fach: 'Mathematik', status: 'geplant', voraus: [],
    kurz: 'Rechnen mit j, Betrag und Phase, Polarform.' },
  { id: 'dgl-1-ordnung', title: 'DGL 1. Ordnung', fach: 'Mathematik', status: 'geplant', voraus: [],
    kurz: 'Differentialgleichungen und die e-Funktion.' },
  { id: 'spannungsteiler', title: 'Spannungsteiler', fach: 'Elektronik', status: 'geplant', voraus: [],
    kurz: 'Zwei Widerstände teilen eine Spannung.' },

  { id: 'impedanz', title: 'Impedanz & Reaktanz', fach: 'Elektronik', status: 'geplant', voraus: ['komplexe-zahlen'],
    kurz: 'Komplexe Wechselstromrechnung mit R, L und C.' },
  { id: 'laplace', title: 'Laplace-Transformation', fach: 'Mathematik', status: 'geplant', voraus: ['komplexe-zahlen', 'dgl-1-ordnung'],
    kurz: 'Vom Zeitbereich in den Bildbereich.' },

  { id: 'rc-tiefpass', title: 'RC-Tiefpass', fach: 'Elektronik', status: 'fertig', file: 'rc-tiefpass.html',
    voraus: ['spannungsteiler', 'impedanz', 'dgl-1-ordnung'],
    kurz: 'Grenzfrequenz, Bode-Diagramm und Sprungantwort zum Ausprobieren.' },
  { id: 'uebertragungsfunktion', title: 'Übertragungsfunktion', fach: 'Elektronik', status: 'geplant', voraus: ['laplace', 'impedanz'],
    kurz: 'H(s) aufstellen, Pole und Nullstellen.' },

  { id: 'rlc-schwingkreis', title: 'RLC-Schwingkreis', fach: 'Elektronik', status: 'geplant', voraus: ['impedanz', 'rc-tiefpass'],
    kurz: 'Resonanz, Güte und Bandbreite.' },
  { id: 'bode-diagramm', title: 'Bode-Diagramm', fach: 'Elektronik', status: 'geplant', voraus: ['uebertragungsfunktion', 'rc-tiefpass'],
    kurz: 'Betrag und Phase über der Frequenz zeichnen.' }
];

/* ---------- Hilfsfunktionen für den Voraussetzungs-Graphen ---------- */
window.TopicGraph = (function () {
  'use strict';
  var T = window.TOPICS, byId = {}, order = {};
  T.forEach(function (t, i) { byId[t.id] = t; order[t.id] = i; });

  var memo = {};
  /* Ebene = längste Kette an Voraussetzungen davor (0 = braucht nichts) */
  function layer(id) {
    if (memo[id] != null) return memo[id];
    memo[id] = 0; // Schutz gegen Zyklen
    var ps = (byId[id].voraus || []).filter(function (p) { return byId[p]; });
    memo[id] = ps.length ? 1 + Math.max.apply(null, ps.map(layer)) : 0;
    return memo[id];
  }

  /* alle (auch indirekten) Voraussetzungen, in sinnvoller Lernreihenfolge */
  function ancestors(id) {
    var seen = {};
    (function walk(x) {
      (byId[x].voraus || []).forEach(function (p) {
        if (byId[p] && !seen[p]) { seen[p] = true; walk(p); }
      });
    })(id);
    return Object.keys(seen).sort(function (a, b) {
      return layer(a) - layer(b) || order[a] - order[b];
    });
  }

  function successors(id) {
    return T.filter(function (t) { return (t.voraus || []).indexOf(id) >= 0; }).map(function (t) { return t.id; });
  }

  /* Positionen für die Zeichnung: Spalten = Ebenen, Reihen per Schwerpunkt-Sortierung */
  function layout(o) {
    var cols = [], row = {}, pos = {}, edges = [];
    T.forEach(function (t) { (cols[layer(t.id)] = cols[layer(t.id)] || []).push(t.id); });
    cols.forEach(function (c, ci) {
      if (ci > 0) {
        var bary = function (id) {
          var ps = byId[id].voraus.filter(function (p) { return byId[p]; });
          return ps.reduce(function (s, p) { return s + row[p]; }, 0) / ps.length;
        };
        c.sort(function (a, b) { return bary(a) - bary(b) || order[a] - order[b]; });
      }
      c.forEach(function (id, i) { row[id] = i; });
    });
    var maxRows = Math.max.apply(null, cols.map(function (c) { return c.length; }));
    cols.forEach(function (c, ci) {
      var off = (maxRows - c.length) * o.rowH / 2;
      c.forEach(function (id, i) {
        pos[id] = { x: o.pad + ci * o.colW, y: o.pad + off + i * o.rowH };
      });
    });
    T.forEach(function (t) {
      (t.voraus || []).forEach(function (p) { if (byId[p]) edges.push({ from: p, to: t.id }); });
    });
    return {
      pos: pos, edges: edges,
      width: 2 * o.pad + (cols.length - 1) * o.colW + o.nodeW,
      height: 2 * o.pad + (maxRows - 1) * o.rowH + o.nodeH
    };
  }

  return { byId: byId, layer: layer, ancestors: ancestors, successors: successors, layout: layout };
})();
