/* Läuft IN jeder Visualisierungs-Seite (wird im <head> geladen).
   Zwei Fälle:
     - allein geöffnet (neuer Tab, Link aus "Alle Visualisierungen"): normale Seite mit Kopfzeile
     - eingebettet im iframe einer Themenseite: Kopf ausblenden, Höhe an die Elternseite melden,
       Hell/Dunkel von der Elternseite übernehmen */
(function () {
  'use strict';
  var root = document.documentElement;
  var eingebettet = false;
  try { eingebettet = window.self !== window.top; } catch (e) { eingebettet = true; }
  if (!eingebettet) return;

  root.classList.add('eingebettet');

  // Elternseite schickt { theme: 'dark' | 'light' | null }
  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || !e.data || !('theme' in e.data)) return;
    if (e.data.theme) root.setAttribute('data-theme', e.data.theme);
    else root.removeAttribute('data-theme');
  });

  // Höhe melden, damit das iframe genau so hoch ist wie der Inhalt (kein doppelter Scrollbalken).
  // ResizeObserver meldet auch Änderungen durch aufgeklappte Tabellen oder neue Diagramme.
  var zuletzt = 0;
  function melden() {
    var h = Math.ceil(root.getBoundingClientRect().height);
    if (h !== zuletzt) {
      zuletzt = h;
      window.parent.postMessage({ vizHoehe: h }, '*');
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    if (window.ResizeObserver) new ResizeObserver(melden).observe(document.body);
    melden();
  });
  window.addEventListener('load', melden);
})();
