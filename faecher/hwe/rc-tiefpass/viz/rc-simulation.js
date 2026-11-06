/* =====================================================================
   RC-Tiefpass – interaktive Simulation
   Alles wird direkt aus den Formeln berechnet (keine Näherung, kein Server):
     H(jω) = 1 / (1 + jωRC)
     |H| = 1/√(1+(ωτ)²)      φ = −arctan(ωτ)      τ = R·C      f_g = 1/(2π·τ)
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };

  /* ---------- Normreihe E12 für R und C ---------- */
  var E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
  function series(d0, d1) {
    var out = [];
    for (var d = d0; d < d1; d++) {
      for (var i = 0; i < E12.length; i++) out.push(Number((E12[i] * Math.pow(10, d)).toPrecision(3)));
    }
    out.push(Math.pow(10, d1));
    return out;
  }
  var RV = series(2, 5);     // 100 Ω … 100 kΩ
  var CV = series(-9, -5);   // 1 nF … 10 µF

  function nearestIndex(arr, v) {
    var bi = 0, bd = Infinity;
    arr.forEach(function (x, i) { var d = Math.abs(Math.log(x / v)); if (d < bd) { bd = d; bi = i; } });
    return bi;
  }

  /* ---------- Zahlen schön formatieren (deutsch, SI-Vorsätze) ---------- */
  var PFX = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  function si(v, unit, dig) {
    dig = dig || 3;
    if (!isFinite(v) || v === 0) return '0 ' + unit;
    var a = Math.abs(v), p = PFX[PFX.length - 1];
    for (var i = 0; i < PFX.length; i++) { if (a >= PFX[i][0] * 0.9995) { p = PFX[i]; break; } }
    var s = (v / p[0]).toPrecision(dig);
    if (s.indexOf('e') >= 0) s = String(Number(s));
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',').replace('-', '−') + ' ' + p[1] + unit;
  }
  function num(x, d) {
    if (Math.abs(x) < 0.5 * Math.pow(10, -d)) x = 0;
    return x.toFixed(d).replace('.', ',').replace('-', '−');
  }

  /* ---------- Bedienelemente ---------- */
  var elR = $('#in-r'), elC = $('#in-c'), elF = $('#in-f');
  elR.min = 0; elR.max = RV.length - 1; elR.step = 1; elR.value = nearestIndex(RV, 1000);
  elC.min = 0; elC.max = CV.length - 1; elC.step = 1; elC.value = nearestIndex(CV, 100e-9);
  elF.min = 0; elF.max = 600; elF.step = 1; elF.value = 320;     // 10^3,2 Hz ≈ 1,6 kHz

  var mode = 'sin';          // 'sin' oder 'rect'
  var hover = null;          // { f, chart }
  var fExact = null;         // exakte Frequenz (z. B. f = f_g), bis der Regler wieder bewegt wird
  var geo = {};              // Geometrie der Bode-Diagramme (für Mausposition → Frequenz)

  function compute() {
    var R = RV[+elR.value], C = CV[+elC.value], f = fExact || Math.pow(10, +elF.value / 100);
    var tau = R * C, w = 2 * Math.PI * f, x = w * tau;
    var mag = 1 / Math.sqrt(1 + x * x);
    return { R: R, C: C, f: f, tau: tau, fg: 1 / (2 * Math.PI * tau), w: w, x: x,
      mag: mag, phi: -Math.atan(x), db: 20 * Math.log10(mag) };
  }
  function setF(f) {
    fExact = Math.max(1, Math.min(1e6, f));
    elF.value = Math.max(0, Math.min(600, Math.round(Math.log10(f) * 100)));
  }

  /* ---------- Bode-Diagramme (Betrag und Phase) ---------- */
  var XL = ['1', '10', '100', '1 k', '10 k', '100 k', '1 M'];

  function drawBode(svg, kind, p) {
    var W = Math.max(280, Math.round(svg.getBoundingClientRect().width)), H = 214;
    var m = { l: 46, r: 14, t: 28, b: 36 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var lo = kind === 'mag' ? -60 : -95, hi = 5;
    function X(f) { return m.l + Math.log10(f) / 6 * iw; }
    function Y(v) { return m.t + (hi - v) / (hi - lo) * ih; }
    function val(f) {
      var x = 2 * Math.PI * f * p.tau;
      return kind === 'mag' ? -10 * Math.log10(1 + x * x) : -Math.atan(x) * 180 / Math.PI;
    }
    geo[kind] = { l: m.l, iw: iw, W: W };
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('height', H);

    var s = '';
    var ticks = kind === 'mag' ? [0, -20, -40, -60] : [0, -45, -90];
    ticks.forEach(function (t) {
      s += '<line class="g-grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/>';
      s += '<text class="t" x="' + (m.l - 8) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + (t === 0 ? '0' : '−' + Math.abs(t)) + '</text>';
    });
    for (var k = 0; k <= 6; k++) {
      var xx = X(Math.pow(10, k));
      s += '<line class="g-grid" x1="' + xx + '" x2="' + xx + '" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
      s += '<text class="t" x="' + xx + '" y="' + (m.t + ih + 16) + '" text-anchor="middle">' + XL[k] + '</text>';
    }
    s += '<line class="g-axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (m.t + ih) + '" y2="' + (m.t + ih) + '"/>';
    s += '<text class="t2" x="' + m.l + '" y="14">' + (kind === 'mag' ? 'Betrag |H| in dB' : 'Phase φ in °') + '</text>';
    s += '<text class="t" x="' + (W - m.r) + '" y="' + (H - 4) + '" text-anchor="end">f in Hz</text>';

    s += '<clipPath id="clip-' + kind + '"><rect x="' + m.l + '" y="' + m.t + '" width="' + iw + '" height="' + ih + '"/></clipPath>';
    s += '<g clip-path="url(#clip-' + kind + ')">';
    var d = '';
    for (var i = 0; i <= 240; i++) {
      var f = Math.pow(10, i / 40);
      d += (i ? 'L' : 'M') + X(f).toFixed(1) + ',' + Y(val(f)).toFixed(1);
    }
    s += '<path class="line-out" d="' + d + '"/>';
    if (p.fg >= 1 && p.fg <= 1e6) {
      s += '<line class="g-ref" x1="' + X(p.fg) + '" x2="' + X(p.fg) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
      s += '<text class="t2" x="' + (X(p.fg) + 5) + '" y="' + (m.t + ih - 6) + '">f<tspan dy="3" font-size="9">g</tspan></text>';
    }
    s += '<line class="g-cur" x1="' + X(p.f) + '" x2="' + X(p.f) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
    var cy = Math.max(lo, Math.min(hi, val(p.f)));
    s += '<circle class="dot-out" cx="' + X(p.f) + '" cy="' + Y(cy) + '" r="5"/>';
    if (hover) {
      var hy = Math.max(lo, Math.min(hi, val(hover.f)));
      s += '<line class="g-hover" x1="' + X(hover.f) + '" x2="' + X(hover.f) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
      s += '<circle class="dot-hover" cx="' + X(hover.f) + '" cy="' + Y(hy) + '" r="4"/>';
    }
    s += '</g>';
    svg.innerHTML = s;

    /* Tooltip */
    var tip = svg.parentNode.querySelector('.tip');
    if (hover && hover.chart === kind) {
      var hx = 2 * Math.PI * hover.f * p.tau, hm = 1 / Math.sqrt(1 + hx * hx);
      tip.innerHTML = 'f = <strong>' + si(hover.f, 'Hz') + '</strong><br>|H| = ' + num(20 * Math.log10(hm), 1) + ' dB (×' + num(hm, 3) +
        ')<br>φ = ' + num(-Math.atan(hx) * 180 / Math.PI, 1) + '°';
      tip.style.display = 'block';
      var left = Math.min(X(hover.f) + 12, W - tip.offsetWidth - 4);
      tip.style.left = Math.max(4, left) + 'px';
      tip.style.top = (m.t + 6) + 'px';
    } else {
      tip.style.display = 'none';
    }
  }

  /* ---------- Zeitverlauf (Sinus oder Rechteck) ---------- */
  function drawTime(svg, p) {
    var W = Math.max(280, Math.round(svg.getBoundingClientRect().width)), H = 250;
    var m = { l: 50, r: 14, t: 14, b: 36 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var T = 1 / p.f, tEnd = 3 * T;
    function X(t) { return m.l + t / tEnd * iw; }
    function Y(v) { return m.t + (1.25 - v) / 2.5 * ih; }
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('height', H);

    var s = '';
    [1, 0, -1].forEach(function (v) {
      s += '<line class="g-grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/>';
      s += '<text class="t" x="' + (m.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + (v === 0 ? '0' : v > 0 ? '+1 V' : '−1 V') + '</text>';
    });
    for (var k = 0; k <= 3; k++) {
      s += '<line class="g-grid" x1="' + X(k * T) + '" x2="' + X(k * T) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
      s += '<text class="t" x="' + X(k * T) + '" y="' + (m.t + ih + 16) + '" text-anchor="' + (k === 0 ? 'start' : k === 3 ? 'end' : 'middle') + '">' + (k === 0 ? '0' : si(k * T, 's')) + '</text>';
    }
    s += '<line class="g-axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    s += '<text class="t" x="' + (W - m.r) + '" y="' + (H - 4) + '" text-anchor="end">Zeit t (drei Perioden, Û_e = 1 V)</text>';

    var di = '', da = '', i, t;
    if (mode === 'sin') {
      var N = 720;
      for (i = 0; i <= N; i++) {
        t = tEnd * i / N;
        di += (i ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(Math.sin(p.w * t)).toFixed(1);
        da += (i ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(p.mag * Math.sin(p.w * t + p.phi)).toFixed(1);
      }
    } else {
      /* Eingeschwungener Zustand bei symmetrischer Rechteckspannung ±1 V:
         Anfangswert V0 = tanh(T / 4τ); danach Auf-/Entladung mit e^(−t/τ). */
      var V0 = Math.tanh(T / (4 * p.tau));
      di = 'M' + X(0) + ',' + Y(1);
      for (var h = 0; h < 6; h++) {
        var lvl = h % 2 === 0 ? 1 : -1, t1 = (h + 1) * T / 2;
        di += 'L' + X(t1) + ',' + Y(lvl);
        if (h < 5) di += 'L' + X(t1) + ',' + Y(-lvl);
        for (var j = 0; j <= 60; j++) {
          var sx = T / 2 * j / 60, e = Math.exp(-sx / p.tau);
          var v = lvl > 0 ? 1 - (1 + V0) * e : -1 + (1 + V0) * e;
          da += (h === 0 && j === 0 ? 'M' : 'L') + X(h * T / 2 + sx).toFixed(1) + ',' + Y(v).toFixed(1);
        }
      }
    }
    s += '<path class="line-in" d="' + di + '"/>';
    s += '<path class="line-out" d="' + da + '"/>';
    svg.innerHTML = s;

    /* Bildunterschrift passend zum Modus */
    var cap = $('#time-caption');
    if (mode === 'sin') {
      var dt = Math.abs(p.phi) / (2 * Math.PI) * T;
      cap.textContent = 'Der Ausgang hat nur noch ' + num(p.mag, 3) + ' · Û_e (' + num(p.db, 1) + ' dB) und eilt dem Eingang um ' +
        num(-p.phi * 180 / Math.PI, 1) + '° nach – das sind ' + si(dt, 's') + ' Verzögerung.';
    } else {
      var half = T / 2 / p.tau;
      var txt = 'Eine halbe Periode dauert ' + num(half, 2) + ' · τ. ';
      if (half >= 5) txt += 'Das ist mindestens 5τ: Der Kondensator wird in jeder Halbperiode praktisch vollständig geladen bzw. entladen, das Rechteck bleibt gut erkennbar.';
      else if (half <= 0.2) txt += 'Das ist viel weniger als τ: Der Kondensator kommt kaum zum Umladen, der Ausgang ist fast ein kleines Dreieck um 0 V.';
      else txt += 'Der Kondensator wird nur teilweise umgeladen: die Flanken werden verschliffen und die Amplitude am Ausgang ist kleiner als 1 V.';
      cap.textContent = txt;
    }
  }

  /* ---------- Alles aktualisieren ---------- */
  function updateTexts(p) {
    $('#out-r').textContent = si(p.R, 'Ω');
    $('#out-c').textContent = si(p.C, 'F');
    $('#out-f').textContent = si(p.f, 'Hz');
    $('#lbl-r').textContent = 'R = ' + si(p.R, 'Ω');
    $('#lbl-c').textContent = 'C = ' + si(p.C, 'F');
    $('#o-fg').textContent = si(p.fg, 'Hz');
    $('#o-tau').textContent = si(p.tau, 's');
    $('#o-h').textContent = num(p.db, 1) + ' dB';
    $('#o-h-sub').textContent = '× ' + num(p.mag, 3) + ' der Eingangsamplitude';
    $('#o-phi').textContent = num(p.phi * 180 / Math.PI, 1) + '°';
    $('#o-f-rel').textContent = 'f = ' + num(p.f / p.fg, 2) + ' · f_g';
    $('#meter-fill').style.width = (p.mag * 100).toFixed(1) + '%';
    $('#meter-txt').textContent = '× ' + num(p.mag, 3) + '  (Û_a = ' + si(p.mag, 'V') + ')';

    var rows = '';
    var all = [{ f: p.fg, hl: true }];
    for (var k = 0; k <= 6; k++) all.push({ f: Math.pow(10, k) });
    all.forEach(function (r) {
      var x = 2 * Math.PI * r.f * p.tau, mg = 1 / Math.sqrt(1 + x * x);
      rows += '<tr' + (r.hl ? ' class="hl"' : '') + '><td>' + (r.hl ? 'f = f_g: ' : '') + si(r.f, 'Hz') + '</td><td>' + num(20 * Math.log10(mg), 1) +
        '</td><td>' + num(mg, 3) + '</td><td>' + num(-Math.atan(x) * 180 / Math.PI, 1) + '°</td></tr>';
    });
    $('#tbl-body').innerHTML = rows;
  }

  function render(onlyBode) {
    var p = compute();
    if (!onlyBode) updateTexts(p);
    drawBode($('#bode-mag'), 'mag', p);
    drawBode($('#bode-ph'), 'ph', p);
    if (!onlyBode) drawTime($('#time-svg'), p);
  }

  /* ---------- Ereignisse ---------- */
  [elR, elC, elF].forEach(function (e) {
    e.addEventListener('input', function () { if (e === elF) fExact = null; render(); });
  });

  document.querySelectorAll('[data-fmult]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = compute();
      setF(p.fg * Number(b.getAttribute('data-fmult')));
      render();
    });
  });

  [['mode-sin', 'sin'], ['mode-rect', 'rect']].forEach(function (pair) {
    $('#' + pair[0]).addEventListener('click', function () {
      mode = pair[1];
      $('#mode-sin').setAttribute('aria-pressed', mode === 'sin');
      $('#mode-rect').setAttribute('aria-pressed', mode === 'rect');
      render();
    });
  });

  /* Maus/Stift/Finger auf den Bode-Diagrammen: Hover = Werte ablesen, Ziehen = Frequenz setzen */
  function bind(svg, kind) {
    var down = false;
    function freqAt(e) {
      var r = svg.getBoundingClientRect(), g = geo[kind], x = e.clientX - r.left;
      if (!g || x < g.l || x > g.l + g.iw) return null;
      return Math.pow(10, (x - g.l) / g.iw * 6);
    }
    svg.addEventListener('pointermove', function (e) {
      var f = freqAt(e);
      hover = f ? { f: f, chart: kind } : null;
      if (down && f) { setF(f); render(); } else render(true);
    });
    svg.addEventListener('pointerdown', function (e) {
      down = true;
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
      var f = freqAt(e);
      if (f) { setF(f); hover = { f: f, chart: kind }; render(); }
    });
    ['pointerup', 'pointercancel'].forEach(function (n) { svg.addEventListener(n, function () { down = false; }); });
    svg.addEventListener('pointerleave', function () { if (!down) { hover = null; render(true); } });
  }
  bind($('#bode-mag'), 'mag');
  bind($('#bode-ph'), 'ph');

  var raf = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { render(); });
  });

  render();
})();
