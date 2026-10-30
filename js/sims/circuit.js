/* FizLab sim: Build a Circuit — battery, switch, 1–3 bulbs in series or parallel, meters and moving electrons. */
(function () {
  'use strict';
  const K = window.SimKit;
  const BULBS = [
    { id: 'small', R: 6, r: 13, label: { en: 'Small bulb (6 Ω)', hr: 'Mala žaruljica (6 Ω)' } },
    { id: 'big', R: 12, r: 17, label: { en: 'Big bulb (12 Ω)', hr: 'Velika žaruljica (12 Ω)' } },
    { id: 'led', R: 24, r: 12, label: { en: 'LED lamp (24 Ω)', hr: 'LED lampica (24 Ω)' } }
  ];
  const P_REF = 3;     // W — reference power for full glow
  const I_WARN = 2;    // A — above this a bulb may burn out
  const SPACING = 20;  // px between drawn electrons
  const DEF = { U: 4.5, n: 2, mode: 'series', closed: true, bulb: 'small', electrons: true };

  window.Sims.register({
    id: 'circuit',
    title: { en: 'Build a Circuit', hr: 'Strujni krug' },
    summary: {
      en: 'Connect a battery, a switch and up to three bulbs in series or in parallel. Read the current and the voltage on the meters.',
      hr: 'Spoji bateriju, prekidač i do tri žaruljice serijski ili paralelno. Očitaj struju i napon na mjernim instrumentima.'
    },
    tasks: [
      { en: 'Open the switch (click it on the drawing). What happens to the current and the bulbs?', hr: 'Otvori prekidač (klikni ga na crtežu). Što se dogodi sa strujom i žaruljicama?' },
      { en: 'Connect 2 bulbs in series, then in parallel. When are they brighter? Compare the current on the ammeter.', hr: 'Spoji 2 žaruljice serijski, pa paralelno. Kad svijetle jače? Usporedi struju na ampermetru.' },
      { en: 'With 1 bulb, double the voltage. How does the current change? Check I = U / R.', hr: 'S 1 žaruljicom udvostruči napon. Kako se promijeni struja? Provjeri I = U / R.' },
      { en: 'Find a combination with more than 2 A. Why might a bulb burn out?', hr: 'Pronađi kombinaciju s više od 2 A. Zašto bi žaruljica mogla pregorjeti?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { U: DEF.U, n: DEF.n, mode: DEF.mode, closed: DEF.closed, bulb: BULBS[0], electrons: DEF.electrons,
        phase: 0, R: 0, I: 0, Ub: 0, Ib: 0, Pb: 0, P: 0, warn: false };
      let geo = null;

      // ---- controls ----
      const slU = C.slider({ label: { en: 'Battery voltage U', hr: 'Napon baterije U' }, min: 1.5, max: 12, step: 1.5, value: DEF.U, unit: 'V', digits: 1,
        onChange: v => { st.U = v; refresh(); } });
      const segN = C.segmented({ label: { en: 'Number of bulbs', hr: 'Broj žaruljica' }, options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }],
        value: String(DEF.n), onChange: v => { st.n = parseInt(v, 10); refresh(); } });
      const segMode = C.segmented({ label: { en: 'Connection', hr: 'Spoj' }, options: [
        { value: 'series', label: { en: 'series', hr: 'serijski' } }, { value: 'parallel', label: { en: 'parallel', hr: 'paralelno' } }],
        value: DEF.mode, onChange: v => { st.mode = v; refresh(); } });
      const tgSwitch = C.toggle({ label: { en: 'Switch closed', hr: 'Prekidač zatvoren' }, value: DEF.closed, onChange: v => { st.closed = v; refresh(); } });
      const selBulb = C.select({ label: { en: 'Bulb type', hr: 'Vrsta žaruljice' }, options: BULBS.map(b => ({ value: b.id, label: b.label })), value: DEF.bulb,
        onChange: v => { st.bulb = BULBS.find(b => b.id === v) || BULBS[0]; refresh(); } });
      const tgEl = C.toggle({ label: { en: 'Show electrons', hr: 'Prikaži elektrone' }, value: DEF.electrons, onChange: v => { st.electrons = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outR = C.readout({ label: { en: 'Total resistance R', hr: 'Ukupni otpor R' }, unit: 'Ω', digits: 1 });
      const outI = C.readout({ label: { en: 'Current I', hr: 'Struja I' }, unit: 'A', digits: 2 });
      const outUb = C.readout({ label: { en: 'Voltage per bulb', hr: 'Napon na žaruljici' }, unit: 'V', digits: 2 });
      const outPb = C.readout({ label: { en: 'Power per bulb', hr: 'Snaga žaruljice' }, unit: 'W', digits: 2 });
      const outP = C.readout({ label: { en: 'Total power', hr: 'Ukupna snaga' }, unit: 'W', digits: 2 });
      const note = C.note({ text: '' });

      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---- physics ----
      function compute() {
        const R = st.bulb.R, n = st.n;
        st.R = st.mode === 'series' ? n * R : R / n;
        st.I = st.closed ? st.U / st.R : 0;
        if (st.mode === 'series') { st.Ub = st.closed ? st.U / n : 0; st.Ib = st.I; }
        else { st.Ub = st.closed ? st.U : 0; st.Ib = st.I / n; }
        st.Pb = st.Ub * st.Ib;
        st.P = st.U * st.I;
        st.warn = st.I > I_WARN;
      }
      function updateOut() {
        outR.set(st.R); outI.set(st.I); outUb.set(st.Ub); outPb.set(st.Pb); outP.set(st.P);
        outI.setColor(st.warn ? theme.warn : '');
        let t;
        if (!st.closed) t = { en: 'The switch is open: the circuit is broken, no current flows (I = 0 A) and the bulbs stay dark.', hr: 'Prekidač je otvoren: strujni krug je prekinut, struja ne teče (I = 0 A) i žaruljice ne svijetle.' };
        else if (st.n === 1) t = { en: 'Ohm\'s law: the current grows with the voltage and shrinks with the resistance, I = U / R.', hr: 'Ohmov zakon: struja raste s naponom, a pada s otporom, I = U / R.' };
        else if (st.mode === 'series') t = { en: 'Series: the same current flows through every bulb; the battery voltage is shared between them.', hr: 'Serijski spoj: kroz sve žaruljice teče ista struja, a napon baterije dijeli se među njima.' };
        else t = { en: 'Parallel: every bulb gets the full battery voltage; the current splits between the branches.', hr: 'Paralelni spoj: svaka žaruljica dobiva puni napon baterije, a struja se dijeli po granama.' };
        if (st.warn) t = { en: t.en + ' Warning: more than 2 A – a bulb may burn out!', hr: t.hr + ' Oprez: više od 2 A – žaruljica može pregorjeti!' };
        note.set(t);
      }
      function refresh() { compute(); updateOut(); draw(); }
      function reset() {
        st.U = DEF.U; st.n = DEF.n; st.mode = DEF.mode; st.closed = DEF.closed; st.bulb = BULBS[0]; st.electrons = DEF.electrons; st.phase = 0;
        slU.set(DEF.U); segN.set(String(DEF.n)); segMode.set(DEF.mode); tgSwitch.set(DEF.closed); selBulb.set(DEF.bulb); tgEl.set(DEF.electrons);
        refresh();
      }

      // ---- layout (from cv.w / cv.h) ----
      function layout() {
        const w = cv.w, h = cv.h, n = st.n, par = st.mode === 'parallel';
        const g = { w, h, par };
        g.left = Math.round(w * 0.1) + 12;
        g.right = w - Math.round(w * 0.07) - 56;
        g.top = 58; g.bottom = h - 48;
        g.yc = Math.round((g.top + g.bottom) / 2);
        const bs = K.clamp((g.right - g.left) * 0.2, 46, 100);
        g.bx = []; for (let k = 0; k < n; k++) g.bx.push(Math.round(g.right - (n - 1 - k) * bs));
        g.xj = par ? g.bx[0] : g.right;                 // first junction / right wire
        g.xsw = Math.round((g.left + g.xj) / 2);        // switch (top) and ammeter (bottom) x
        g.swHalf = K.clamp((g.xj - g.left) * 0.13, 10, 18);
        g.mR = K.clamp((g.xj - g.left) * 0.11, 10, 15);
        const r = st.bulb.r;
        g.bulbs = [];
        for (let k = 0; k < n; k++) {
          if (par) g.bulbs.push({ x: g.bx[k], y: g.yc, r });
          else g.bulbs.push({ x: g.right, y: Math.round(g.top + (g.bottom - g.top) * (k + 1) / (n + 1)), r });
        }
        g.vb = par ? g.bulbs[n - 1] : g.bulbs[0];       // bulb measured by the voltmeter
        g.vm = { x: g.vb.x + 44, y: g.vb.y };
        // wire segments = electron paths (electrons leave the − plate at the bottom of the battery and return to the + plate)
        const L0 = g.left, T = g.top, B = g.bottom, yMinus = g.yc + 14, yPlus = g.yc - 14;
        g.segs = [];
        if (!par) {
          g.segs.push({ pts: [[L0, yMinus], [L0, B], [g.right, B], [g.right, T], [L0, T], [L0, yPlus]], frac: 1 });
        } else {
          const x0 = g.bx[0];
          g.segs.push({ pts: [[L0, yMinus], [L0, B], [x0, B]], frac: 1 });
          g.segs.push({ pts: [[x0, T], [L0, T], [L0, yPlus]], frac: 1 });
          for (let k = 0; k < n; k++) {
            const xk = g.bx[k];
            g.segs.push({ pts: [[xk, B], [xk, T]], frac: 1 / n });
            if (k > 0) {
              const xp = g.bx[k - 1], f = (n - k) / n;
              g.segs.push({ pts: [[xp, B], [xk, B]], frac: f });
              g.segs.push({ pts: [[xk, T], [xp, T]], frac: f });
            }
          }
        }
        g.segs.forEach(s => {
          let len = 0;
          for (let i = 1; i < s.pts.length; i++) len += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]);
          s.len = len;
        });
        return g;
      }
      function pointAt(pts, s) {
        for (let i = 1; i < pts.length; i++) {
          const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], l = Math.hypot(dx, dy);
          if (s <= l || i === pts.length - 1) { const t = l > 0 ? K.clamp(s / l, 0, 1) : 0; return [pts[i - 1][0] + dx * t, pts[i - 1][1] + dy * t]; }
          s -= l;
        }
        return pts[0];
      }

      // ---- drawing ----
      function drawBattery(c, g) {
        const x = g.left, y = g.yc;
        c.save();
        c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, y - 14); c.lineTo(x, y - 6); c.moveTo(x, y + 6); c.lineTo(x, y + 14); c.stroke();
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 16, y - 6); c.lineTo(x + 16, y - 6); c.stroke(); // long thin plate = +
        c.lineWidth = 6; c.beginPath(); c.moveTo(x - 8, y + 6); c.lineTo(x + 8, y + 6); c.stroke();      // short thick plate = −
        c.restore();
        K.text(c, '+', x - 26, y - 8, { font: 'bold 15px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, '−', x - 26, y + 9, { font: 'bold 15px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, 'U = ' + K.fmt(st.U, 1, lang) + ' V', x + 22, y, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
      }
      function drawSwitch(c, g) {
        const x = g.xsw, y = g.top, hh = g.swHalf;
        c.save();
        c.fillStyle = theme.sky; c.fillRect(x - hh - 1, y - 3, 2 * hh + 2, 6); // hide the wire in the gap
        c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round';
        const ang = st.closed ? 0 : -0.62;
        c.beginPath(); c.moveTo(x - hh, y); c.lineTo(x - hh + 2 * hh * Math.cos(ang), y + 2 * hh * Math.sin(ang)); c.stroke();
        c.fillStyle = theme.fg;
        c.beginPath(); c.arc(x - hh, y, 3.5, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(x + hh, y, 3.5, 0, Math.PI * 2); c.fill();
        c.restore();
        const lab = K.tr(st.closed ? { en: 'switch: closed', hr: 'prekidač: zatvoren' } : { en: 'switch: open', hr: 'prekidač: otvoren' }, lang);
        K.text(c, lab, x, y + 18, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function drawMeter(c, x, y, r, letter, value, below) {
        c.save();
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.restore();
        K.text(c, letter, x, y + 1, { font: 'bold ' + Math.round(r * 1.1) + 'px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, value, x, below ? y + r + 12 : y - r - 11, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function drawBulb(c, g, b) {
        const glow = st.closed && st.Pb > 0 ? 1 - Math.exp(-st.Pb / P_REF) : 0;
        c.save();
        if (glow > 0.02) {
          const R = b.r + 8 + 24 * glow;
          const grd = c.createRadialGradient(b.x, b.y, b.r * 0.6, b.x, b.y, R);
          grd.addColorStop(0, K.withAlpha(theme.c4, 0.8 * glow)); grd.addColorStop(1, K.withAlpha(theme.c4, 0));
          c.fillStyle = grd; c.beginPath(); c.arc(b.x, b.y, R, 0, Math.PI * 2); c.fill();
        }
        c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        c.fillStyle = theme.surface; c.fill();
        if (glow > 0) { c.fillStyle = K.withAlpha(theme.c4, 0.2 + 0.75 * glow); c.fill(); }
        c.strokeStyle = st.warn && st.closed ? theme.warn : theme.fg; c.lineWidth = 2; c.stroke();
        // filament
        c.strokeStyle = glow > 0.05 ? theme.fg : theme.muted; c.lineWidth = 1.5; c.lineJoin = 'round';
        const f = b.r * 0.45;
        c.beginPath(); c.moveTo(b.x - f, b.y + f); c.lineTo(b.x - f * 0.5, b.y - f * 0.3); c.lineTo(b.x, b.y + f * 0.3);
        c.lineTo(b.x + f * 0.5, b.y - f * 0.3); c.lineTo(b.x + f, b.y + f); c.stroke();
        c.restore();
        // numbers next to the bulb
        const fnt = '11px ' + theme.font;
        if (g.par) {
          const lines = [K.fmt(st.Ub, 2, lang) + ' V', K.fmt(st.Ib, 2, lang) + ' A', K.fmt(st.Pb, 2, lang) + ' W'];
          lines.forEach((s, i) => K.text(c, s, b.x, b.y + b.r + 12 + i * 13, { font: fnt, color: theme.fg, align: 'center', baseline: 'middle' }));
        } else {
          const lines = [K.fmt(st.Ub, 2, lang) + ' V · ' + K.fmt(st.Ib, 2, lang) + ' A', 'P = ' + K.fmt(st.Pb, 2, lang) + ' W'];
          lines.forEach((s, i) => K.text(c, s, b.x - b.r - 8, b.y - 6 + i * 13, { font: fnt, color: theme.fg, align: 'right', baseline: 'middle' }));
        }
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        geo = layout();
        const g = geo;
        c.clearRect(0, 0, w, h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        // wires
        c.save(); c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineJoin = 'round'; c.lineCap = 'round';
        g.segs.forEach(s => { c.beginPath(); s.pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); });
        c.restore();
        if (g.par && st.n > 1) {
          c.fillStyle = theme.fg;
          for (let k = 0; k < st.n - 1; k++) [g.top, g.bottom].forEach(y => { c.beginPath(); c.arc(g.bx[k], y, 4, 0, Math.PI * 2); c.fill(); });
        }
        // electrons (−) moving from − to +
        if (st.electrons && st.closed && st.I > 0) {
          c.fillStyle = theme.c1;
          g.segs.forEach(s => {
            const off = ((st.phase * s.frac) % SPACING + SPACING) % SPACING;
            for (let d = off; d < s.len; d += SPACING) {
              const p = pointAt(s.pts, d);
              c.beginPath(); c.arc(p[0], p[1], 3.2, 0, Math.PI * 2); c.fill();
            }
          });
        }
        // conventional current arrow on the bottom wire (+ → −, i.e. right to left here)
        if (st.I > 0) {
          const xa = g.xsw + g.mR + 48;
          if (xa < g.xj - 6) {
            K.arrow(c, xa, g.bottom + 14, xa - 36, g.bottom + 14, { color: theme.c2, width: 3, head: 9 });
            K.text(c, 'I', xa + 8, g.bottom + 14, { font: 'bold italic 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
          }
        }
        drawBattery(c, g);
        drawSwitch(c, g);
        drawMeter(c, g.xsw, g.bottom, g.mR, 'A', K.fmt(st.I, 2, lang) + ' A', false);
        g.bulbs.forEach(b => drawBulb(c, g, b));
        // voltmeter across one bulb
        const vb = g.vb, vm = g.vm;
        c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1.5; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(vb.x, vb.y - vb.r - 6); c.lineTo(vm.x, vm.y - g.mR); c.moveTo(vb.x, vb.y + vb.r + 6); c.lineTo(vm.x, vm.y + g.mR); c.stroke();
        c.restore();
        drawMeter(c, vm.x, vm.y, g.mR, 'V', K.fmt(st.Ub, 2, lang) + ' V', true);
        // header: connection + Ohm's law
        const modeLab = st.n === 1 ? { en: 'One bulb', hr: 'Jedna žaruljica' } : (g.par ? { en: 'Parallel connection', hr: 'Paralelni spoj' } : { en: 'Series connection', hr: 'Serijski spoj' });
        let rStr;
        if (st.n === 1) rStr = 'R = ' + K.fmt(st.R, 0, lang) + ' Ω';
        else if (g.par) rStr = 'R = ' + K.fmt(st.bulb.R, 0, lang) + ' Ω / ' + st.n + ' = ' + K.fmt(st.R, 1, lang) + ' Ω';
        else rStr = 'R = ' + st.n + ' · ' + K.fmt(st.bulb.R, 0, lang) + ' Ω = ' + K.fmt(st.R, 0, lang) + ' Ω';
        K.text(c, K.tr(modeLab, lang) + ':  ' + rStr, 12, 13, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const ohm = st.closed
          ? 'I = U / R = ' + K.fmt(st.U, 1, lang) + ' V / ' + K.fmt(st.R, 1, lang) + ' Ω = ' + K.fmt(st.I, 2, lang) + ' A'
          : K.tr({ en: 'Switch open → I = 0 A', hr: 'Prekidač otvoren → I = 0 A' }, lang);
        K.text(c, ohm, 12, 32, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // footer: warning or legend
        if (st.warn && st.closed) {
          K.text(c, '⚠ ' + K.tr({ en: 'More than 2 A – a bulb may burn out!', hr: 'Više od 2 A – žaruljica može pregorjeti!' }, lang), w / 2, h - 10,
            { font: 'bold 12px ' + theme.font, color: theme.warn, align: 'center', baseline: 'middle' });
        } else if (w >= 560) {
          K.text(c, K.tr({ en: 'Blue dots = electrons (−), they move from − to +. The arrow I shows the conventional current direction, from + to −.',
            hr: 'Plave točke = elektroni (−), gibaju se od − prema +. Strelica I pokazuje dogovoreni smjer struje, od + prema −.' }, lang), w / 2, h - 10,
            { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        } else {
          K.text(c, K.tr({ en: 'Electrons (−) move from − to +; arrow I: + to −.', hr: 'Elektroni (−) idu od − prema +; strelica I: od + prema −.' }, lang), w / 2, h - 10,
            { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        }
      }

      // ---- pointer: click the switch on the drawing ----
      function nearSwitch(p) { return geo && Math.hypot(p.x - geo.xsw, p.y - (geo.top - 6)) < geo.swHalf + 14; }
      const onDown = ev => {
        const p = cv.pointer(ev);
        if (nearSwitch(p)) { ev.preventDefault(); st.closed = !st.closed; tgSwitch.set(st.closed); refresh(); }
      };
      const onMove = ev => { cv.canvas.style.cursor = nearSwitch(cv.pointer(ev)) ? 'pointer' : 'default'; };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);

      const L = K.loop(dt => {
        if (st.closed && st.I > 0) { st.phase += dt * Math.min(320, 80 * st.I); if (st.phase > SPACING * 60) st.phase -= SPACING * 60; }
        draw();
      });
      cv.onResize(draw);
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
      return {
        destroy() { L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
