/* =====================================================================
   Voraussetzungs-Graph – wird an ZWEI Stellen benutzt:
     1. im Browser (Startseite: Graph zeichnen)        → window.TopicGraph
     2. in build.js (Vorwissen-Reiter, Zyklen prüfen)   → require('./assets/js/graph.js')
   Darum kein ES-Modul und keine Browser-Funktionen hier drin.

   Ein Thema sieht so aus (kommt aus thema.md bzw. docs/daten/themen.js):
     { id, titel, fach, status: 'fertig'|'geplant', pfad?, voraus: [ids], kurz }
   ===================================================================== */
(function (global) {
  'use strict';

  /* Erzeugt alle Hilfsfunktionen für eine Themenliste. */
  function create(topics) {
    var byId = {}, order = {};
    topics.forEach(function (t, i) { byId[t.id] = t; order[t.id] = i; });

    /* Nur Voraussetzungen, die es wirklich gibt (Tippfehler meldet build.js). */
    function prereqs(id) {
      return (byId[id].voraus || []).filter(function (p) { return byId[p]; });
    }

    var memo = {};
    /* Ebene = längste Kette an Voraussetzungen davor (0 = braucht nichts).
       memo[id] = 0 vor der Rekursion schützt vor Endlosschleifen bei Zyklen. */
    function layer(id) {
      if (memo[id] != null) return memo[id];
      memo[id] = 0;
      var ps = prereqs(id);
      memo[id] = ps.length ? 1 + Math.max.apply(null, ps.map(layer)) : 0;
      return memo[id];
    }

    /* Alle (auch indirekten) Voraussetzungen, in sinnvoller Lernreihenfolge:
       zuerst nach Ebene, bei Gleichstand nach Reihenfolge in der Liste. */
    function ancestors(id) {
      var seen = {};
      (function walk(x) {
        prereqs(x).forEach(function (p) {
          if (!seen[p]) { seen[p] = true; walk(p); }
        });
      })(id);
      delete seen[id]; // falls doch ein Zyklus existiert
      return Object.keys(seen).sort(function (a, b) {
        return layer(a) - layer(b) || order[a] - order[b];
      });
    }

    /* Themen, die DIREKT auf id aufbauen. */
    function successors(id) {
      return topics.filter(function (t) { return (t.voraus || []).indexOf(id) >= 0; })
        .map(function (t) { return t.id; });
    }

    /* Findet einen Zyklus (A braucht B, B braucht A …) und gibt ihn als Liste zurück, sonst null.
       Klassische Tiefensuche mit drei Zuständen: 0 = neu, 1 = gerade auf dem Weg, 2 = fertig. */
    function findCycle() {
      var state = {}, stack = [], found = null;
      function visit(id) {
        if (found) return;
        state[id] = 1; stack.push(id);
        prereqs(id).forEach(function (p) {
          if (found) return;
          if (state[p] === 1) found = stack.slice(stack.indexOf(p)).concat(p);
          else if (!state[p]) visit(p);
        });
        stack.pop(); state[id] = 2;
      }
      topics.forEach(function (t) { if (!state[t.id]) visit(t.id); });
      return found;
    }

    /* Positionen für die Zeichnung.
       ids (optional) = welche Themen gezeichnet werden (z. B. nur ein Fach plus dessen Voraussetzungen).
       Spalten = Ebenen, Reihen per Schwerpunkt-Sortierung (Mittelwert der Reihen der Voraussetzungen),
       damit sich Kanten möglichst wenig kreuzen. */
    function layout(o, ids) {
      var show = {};
      (ids || topics.map(function (t) { return t.id; })).forEach(function (id) { show[id] = true; });
      var list = topics.filter(function (t) { return show[t.id]; });

      var cols = [], row = {}, pos = {}, edges = [];
      list.forEach(function (t) { (cols[layer(t.id)] = cols[layer(t.id)] || []).push(t.id); });
      cols = cols.filter(Boolean); // leere Spalten weglassen
      cols.forEach(function (c, ci) {
        if (ci > 0) {
          var bary = function (id) {
            var ps = prereqs(id).filter(function (p) { return row[p] != null; });
            if (!ps.length) return 0;
            return ps.reduce(function (s, p) { return s + row[p]; }, 0) / ps.length;
          };
          c.sort(function (a, b) { return bary(a) - bary(b) || order[a] - order[b]; });
        }
        c.forEach(function (id, i) { row[id] = i; });
      });
      var maxRows = Math.max.apply(null, cols.map(function (c) { return c.length; }).concat(1));
      cols.forEach(function (c, ci) {
        var off = (maxRows - c.length) * o.rowH / 2; // jede Spalte vertikal zentrieren
        c.forEach(function (id, i) {
          pos[id] = { x: o.pad + ci * o.colW, y: o.pad + off + i * o.rowH };
        });
      });
      list.forEach(function (t) {
        prereqs(t.id).forEach(function (p) { if (show[p]) edges.push({ from: p, to: t.id }); });
      });
      return {
        ids: list.map(function (t) { return t.id; }),
        pos: pos, edges: edges,
        width: 2 * o.pad + Math.max(0, cols.length - 1) * o.colW + o.nodeW,
        height: 2 * o.pad + (maxRows - 1) * o.rowH + o.nodeH
      };
    }

    return { byId: byId, layer: layer, ancestors: ancestors, successors: successors,
      findCycle: findCycle, layout: layout };
  }

  var api = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; // Node (build.js)
  else global.TopicGraph = api;                                              // Browser
})(this);
