/* =====================================================================
   Themenseite: Reiter, Bilder-Lightbox, eingebettete Visualisierungen.
   Ohne JavaScript funktioniert die Seite auch: alle Abschnitte stehen untereinander,
   Bilder öffnen sich als Datei, Visualisierungen über "Neuer Tab".
   ===================================================================== */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Reiter ----------
     Jede <section class="tab-panel" data-reiter="Name"> wird ein Reiter.
     Der aktive Reiter steht in der Adresse (#bilder), damit man direkt darauf verlinken kann. */
  var panels = $$('section.tab-panel');
  var leiste = document.querySelector('.tabs');
  var knoepfe = [];

  if (panels.length > 1 && leiste) {
    document.documentElement.classList.add('mit-reitern'); // blendet die Ersatz-Überschriften aus
    leiste.hidden = false;
    panels.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'reiter-' + p.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', p.id);
      b.textContent = p.getAttribute('data-reiter');
      var n = p.getAttribute('data-anzahl');
      if (n) {
        var s = document.createElement('span');
        s.className = 'anzahl';
        s.textContent = n;
        b.appendChild(s);
      }
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', b.id);
      b.addEventListener('click', function () { zeigen(p.id, true); });
      // Pfeiltasten wie bei echten Reitern
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var j = (i + d + panels.length) % panels.length;
        zeigen(panels[j].id, true);
        knoepfe[j].focus();
      });
      leiste.appendChild(b);
      knoepfe.push(b);
    });

    window.addEventListener('hashchange', function () { zeigen(location.hash.slice(1), false); });
    zeigen(location.hash.slice(1), false);
  }

  function zeigen(id, adresseSetzen) {
    if (!document.getElementById(id) || panels.every(function (p) { return p.id !== id; })) id = panels[0].id;
    panels.forEach(function (p, i) {
      var an = p.id === id;
      p.hidden = !an;
      knoepfe[i].setAttribute('aria-selected', String(an));
      knoepfe[i].tabIndex = an ? 0 : -1;
    });
    if (adresseSetzen) history.replaceState(null, '', '#' + id);
  }

  /* ---------- Lightbox für Bilder ----------
     Galerie-Bilder und Bilder im Text öffnen sich groß. Pfeiltasten blättern, Esc schließt. */
  var gruppe = [], pos = 0, vorher = null;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Bild vergrößert');
  box.innerHTML =
    '<button type="button" class="lb-zu" aria-label="Schließen">✕</button>' +
    '<button type="button" class="lb-pfeil lb-zurueck" aria-label="Vorheriges Bild">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="lb-pfeil lb-weiter" aria-label="Nächstes Bild">›</button>';
  document.body.appendChild(box);
  var lbImg = box.querySelector('img'), lbCap = box.querySelector('figcaption');

  function oeffnen(liste, i) {
    gruppe = liste; vorher = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('lb-offen');
    anzeigen(i);
    box.querySelector('.lb-zu').focus();
  }
  function anzeigen(i) {
    pos = (i + gruppe.length) % gruppe.length;
    lbImg.src = gruppe[pos].src;
    lbImg.alt = gruppe[pos].alt;
    lbCap.textContent = gruppe[pos].alt + (gruppe.length > 1 ? '  (' + (pos + 1) + ' / ' + gruppe.length + ')' : '');
    $$('.lb-pfeil', box).forEach(function (b) { b.hidden = gruppe.length < 2; });
  }
  function schliessen() {
    box.hidden = true;
    document.documentElement.classList.remove('lb-offen');
    if (vorher) vorher.focus();
  }
  box.querySelector('.lb-zu').addEventListener('click', schliessen);
  box.querySelector('.lb-zurueck').addEventListener('click', function () { anzeigen(pos - 1); });
  box.querySelector('.lb-weiter').addEventListener('click', function () { anzeigen(pos + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) schliessen(); }); // Klick neben das Bild
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') schliessen();
    else if (e.key === 'ArrowLeft') anzeigen(pos - 1);
    else if (e.key === 'ArrowRight') anzeigen(pos + 1);
  });

  var galerie = $$('.galerie-bild');
  var galerieListe = galerie.map(function (a) { return { src: a.getAttribute('href'), alt: a.querySelector('img').alt }; });
  galerie.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); oeffnen(galerieListe, i); });
  });
  $$('.prose img').forEach(function (img) {
    img.classList.add('zoombar');
    img.addEventListener('click', function () { oeffnen([{ src: img.getAttribute('src'), alt: img.alt }], 0); });
  });

  /* ---------- Eingebettete Visualisierungen (iframes) ---------- */
  var frames = $$('figure.viz iframe');

  // Die Visualisierung meldet ihre Höhe (siehe viz.js) → iframe genau so hoch machen
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data.vizHoehe !== 'number') return;
    frames.forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = Math.max(150, e.data.vizHoehe) + 'px';
    });
  });

  frames.forEach(function (f) {
    // Beim Laden das aktuelle Hell/Dunkel mitgeben (null = wie das System)
    f.addEventListener('load', function () {
      f.contentWindow.postMessage({ theme: document.documentElement.getAttribute('data-theme') }, '*');
    });
    var knopf = f.parentNode.querySelector('.viz-vollbild');
    if (!knopf) return;
    if (!f.requestFullscreen) {
      knopf.hidden = true; // z. B. iPhone: dort gibt es dafür "Neuer Tab"
      return;
    }
    knopf.addEventListener('click', function () {
      f.requestFullscreen().catch(function () { location.href = f.getAttribute('src'); });
    });
  });
})();
