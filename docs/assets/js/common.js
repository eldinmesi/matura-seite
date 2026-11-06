/* Gemeinsam für alle Seiten: Hell/Dunkel-Schalter.
   Das gespeicherte Thema wird schon im <head> gesetzt (siehe vorlagen/seite.html),
   hier kommt nur noch der Knopf dazu. */
(function () {
  'use strict';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* privates Fenster: dann eben nur bis zum Neuladen */ }

    // Eingebettete Visualisierungen (iframes) mitnehmen, sonst bleiben sie in der alten Farbe
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) {
      if (f.contentWindow) f.contentWindow.postMessage({ theme: next }, '*');
    });
  });
})();
