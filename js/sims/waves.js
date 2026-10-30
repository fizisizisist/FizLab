/* FizLab sim: Wave on a string — a 6 m rope driven at the left end (continuous waves, one pulse, or by hand),
   with reflections at a fixed, loose or absorbing right end. Discretised wave equation y_tt = v² y_xx. */
(function () {
  'use strict';
  const K = window.SimKit;
  const N = 240;                 // string points
  const LEN = 6;                 // m
  const DX = LEN / (N - 1);      // m between points
  const A_MAX = 0.3;             // m (30 cm)
  const GAMMA = 0.7;             // damping rate (1/s) when damping is on
  const PULSE_T = 0.4;           // s, duration of one hand bump
  const SPEEDS = [
    { id: 'slow', v: 1, label: { en: 'Low tension → 1 m/s', hr: 'Mala napetost → 1 m/s' } },
    { id: 'medium', v: 2, label: { en: 'Medium tension → 2 m/s', hr: 'Srednja napetost → 2 m/s' } },
    { id: 'fast', v: 4, label: { en: 'High tension → 4 m/s', hr: 'Velika napetost → 4 m/s' } }
  ];
  const ENDS = [
    { id: 'fixed', label: { en: 'Fixed end (tied to a wall)', hr: 'Učvršćeni kraj (vezan za zid)' } },
    { id: 'loose', label: { en: 'Loose end (ring on a pole)', hr: 'Slobodni kraj (prsten na štapu)' } },
    { id: 'open', label: { en: 'No end (wave is absorbed)', hr: 'Bez kraja (val se upija)' } }
  ];
  const HINTS = {
    osc: { en: 'The hand shakes the left end up and down f times every second.', hr: 'Ruka trese lijevi kraj gore-dolje f puta u sekundi.' },
    pulse: { en: 'Press "Send pulse" and follow the bump to the far end and back.', hr: 'Pritisni „Pošalji puls“ i prati izbočinu do kraja i natrag.' },
    manual: { en: 'Drag the orange end up and down to make your own waves.', hr: 'Povuci narančasti kraj gore-dolje i napravi vlastite valove.' }
  };
  const END_CAPTION = {
    fixed: { en: 'fixed end: the wave comes back upside down', hr: 'učvršćeni kraj: val se vraća okrenut' },
    loose: { en: 'loose end: the wave comes back upright', hr: 'slobodni kraj: val se vraća uspravan' },
    open: { en: 'no end: the wave travels away, nothing comes back', hr: 'bez kraja: val odlazi dalje, ništa se ne vraća' }
  };

  window.Sims.register({
    id: 'waves',
    title: { en: 'Wave on a String', hr: 'Val na užetu' },
    summary: {
      en: 'Shake the left end of a 6 m rope: send waves or a single pulse, change tension and frequency, and watch the wave bounce back from the far end.',
      hr: 'Tresi lijevi kraj užeta dugog 6 m: šalji valove ili jedan puls, mijenjaj napetost i frekvenciju i gledaj kako se val odbija od drugog kraja.'
    },
    tasks: [
      { en: 'Send a pulse towards a fixed end. Does it come back upright or upside down? Now try a loose end.', hr: 'Pošalji puls prema učvršćenom kraju. Vraća li se uspravan ili okrenut? Zatim probaj slobodni kraj.' },
      { en: 'Double the frequency. What happens to the wavelength? Check it with λ = v / f.', hr: 'Udvostruči frekvenciju. Što se dogodi s valnom duljinom? Provjeri pomoću λ = v / f.' },
      { en: 'Tighten the string (faster wave) at the same frequency. Does the wavelength grow or shrink?', hr: 'Napni uže jače (brži val) pri istoj frekvenciji. Raste li valna duljina ili se smanjuje?' },
      { en: 'Watch the big bead at 3 m. Does it travel along the string, or only move up and down?', hr: 'Promatraj veliku kuglicu na 3 m. Putuje li duž užeta ili se giba samo gore-dolje?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 460 });
      const C = K.controls(container, lang);

      const st = { mode: 'osc', A: 0.15, f: 1, v: 2, damp: true, end: 'fixed', phase: 0, t: 0, pulseT: -1, hand: 0, dragging: false };
      let y = new Float64Array(N), yPrev = new Float64Array(N), yNext = new Float64Array(N);

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'osc', label: { en: 'Oscillate', hr: 'Titranje' } },
        { value: 'pulse', label: { en: 'Pulse', hr: 'Puls' } },
        { value: 'manual', label: { en: 'Manual', hr: 'Ručno' } }], value: 'osc', onChange: setMode });
      const slA = C.slider({ label: { en: 'Amplitude A', hr: 'Amplituda A' }, min: 0, max: 30, step: 1, value: 15, unit: 'cm', digits: 0,
        onChange: v => { st.A = v / 100; updateOut(); if (!L.running) draw(); } });
      const slF = C.slider({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, min: 0.2, max: 3, step: 0.1, value: 1, unit: 'Hz', digits: 1,
        onChange: v => { st.f = v; updateOut(); if (!L.running) draw(); } });
      C.select({ label: { en: 'String tension → wave speed', hr: 'Napetost užeta → brzina vala' }, options: SPEEDS.map(s => ({ value: s.id, label: s.label })), value: 'medium',
        onChange: v => { st.v = SPEEDS.find(s => s.id === v).v; updateOut(); if (!L.running) draw(); } });
      C.toggle({ label: { en: 'Damping (friction)', hr: 'Gušenje (trenje)' }, value: true, onChange: v => { st.damp = v; } });
      C.select({ label: { en: 'Right end', hr: 'Desni kraj' }, options: ENDS.map(e => ({ value: e.id, label: e.label })), value: 'fixed',
        onChange: v => { st.end = v; if (!L.running) draw(); } });
      const btnPulse = C.button({ label: { en: 'Send pulse', hr: 'Pošalji puls' }, icon: '〰', onClick: () => {
        st.pulseT = st.t; if (!L.running) { L.start(); updatePlay(); }
      } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outLam = C.readout({ label: { en: 'Wavelength λ = v / f', hr: 'Valna duljina λ = v / f' }, unit: 'm', digits: 2 });
      const outT = C.readout({ label: { en: 'Period T = 1 / f', hr: 'Period T = 1 / f' }, unit: 's', digits: 2 });
      const outV = C.readout({ label: { en: 'Wave speed v', hr: 'Brzina vala v' }, unit: 'm/s', digits: 1 });
      const outF = C.readout({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, unit: 'Hz', digits: 1 });
      C.note({ text: { en: 'The wave moves along the string, but each piece of string (the beads) only moves up and down.', hr: 'Val putuje duž užeta, a svaki dio užeta (kuglice) giba se samo gore-dolje.' } });
      btnPulse.setDisabled(true);

      function setMode(v) {
        st.mode = v; clearString();
        btnPulse.setDisabled(v !== 'pulse'); slF.setDisabled(v !== 'osc'); slA.setDisabled(v === 'manual');
        if (v === 'pulse') st.pulseT = 0; // send one right away so there is something to see
        if (!L.running && !ctx.reducedMotion) { L.start(); }
        updatePlay(); updateOut(); draw();
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function updateOut() {
        const osc = st.mode === 'osc';
        outLam.set(osc ? st.v / st.f : null); outT.set(osc ? 1 / st.f : null); outV.set(st.v); outF.set(osc ? st.f : null);
      }
      function clearString() { y.fill(0); yPrev.fill(0); yNext.fill(0); st.phase = 0; st.t = 0; st.pulseT = -1; st.hand = 0; }
      function reset() { clearString(); if (st.mode === 'pulse') st.pulseT = 0; updateOut(); updatePlay(); draw(); }

      // ---------- physics ----------
      function drive(h) {
        if (st.mode === 'osc') { st.phase += 2 * Math.PI * st.f * h; return st.A * Math.sin(st.phase); }
        if (st.mode === 'pulse') {
          if (st.pulseT < 0) return 0;
          const u = (st.t - st.pulseT) / PULSE_T;
          return (u >= 0 && u <= 1) ? st.A * Math.sin(Math.PI * u) : 0;
        }
        // manual: the end follows the hand with a speed limit; when released it returns to the middle
        const target = st.dragging ? st.hand : 0;
        const maxStep = (st.dragging ? 4 : 1.5) * h;
        return y[0] + K.clamp(target - y[0], -maxStep, maxStep);
      }
      function step(dt) {
        const v = st.v;
        const n = Math.max(1, Math.ceil(dt / (0.9 * DX / v)));   // sub-steps so that c = v·h/dx ≤ 0.9
        const h = dt / n, c = v * h / DX, c2 = c * c;
        const kd = st.damp ? GAMMA * h : 0;
        for (let s = 0; s < n; s++) {
          st.t += h;
          for (let i = 1; i < N - 1; i++) {
            yNext[i] = 2 * y[i] - yPrev[i] + c2 * (y[i + 1] - 2 * y[i] + y[i - 1]) - kd * (y[i] - yPrev[i]);
          }
          yNext[0] = drive(h);
          if (st.end === 'fixed') yNext[N - 1] = 0;
          else if (st.end === 'loose') yNext[N - 1] = yNext[N - 2];
          else yNext[N - 1] = y[N - 2] + (c - 1) / (c + 1) * (yNext[N - 2] - y[N - 1]); // one-way (absorbing) boundary
          const tmp = yPrev; yPrev = y; y = yNext; yNext = tmp;
        }
      }

      // ---------- layout & drawing ----------
      function layout() {
        const w = cv.w, h = cv.h, small = w < 480;
        const x0 = small ? 30 : 64, x1 = w - (small ? 30 : 48);
        const top = 60, bottom = 56, half = (h - top - bottom) / 2;
        return { w, h, small, x0, x1, top, pxm: (x1 - x0) / LEN, yMid: top + half, ys: half / 0.34 };
      }
      function bracketH(g, xa, xb, yb, label) {
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath();
        g.moveTo(xa, yb); g.lineTo(xb, yb); g.moveTo(xa, yb - 5); g.lineTo(xa, yb + 5); g.moveTo(xb, yb - 5); g.lineTo(xb, yb + 5); g.stroke();
        K.text(g, label, (xa + xb) / 2, yb - 5, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
      }
      function bracketV(g, x, ya, yb) {
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath();
        g.moveTo(x, ya); g.lineTo(x, yb); g.moveTo(x - 5, ya); g.lineTo(x + 5, ya); g.moveTo(x - 5, yb); g.lineTo(x + 5, yb); g.stroke();
      }
      function draw() {
        const g = cv.ctx, lay = layout(), w = lay.w, h = lay.h;
        const { x0, x1, pxm, yMid, ys, small } = lay;
        const X = m => x0 + m * pxm, Y = ym => yMid - ym * ys;
        g.clearRect(0, 0, w, h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);

        // header: live values + hint
        const osc = st.mode === 'osc';
        let head = 'v = ' + K.fmt(st.v, 1, lang) + ' m/s';
        if (osc) head += '    f = ' + K.fmt(st.f, 1, lang) + ' Hz    λ = ' + K.fmt(st.v / st.f, 2, lang) + ' m    T = ' + K.fmt(1 / st.f, 2, lang) + ' s';
        K.text(g, head, 12, 16, { font: 'bold ' + (small ? 12 : 14) + 'px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(g, K.tr(HINTS[st.mode], lang), 12, 36, { font: (small ? 11 : 12) + 'px ' + theme.font, color: theme.muted, baseline: 'middle' });

        // rest position line
        g.setLineDash([4, 6]); g.strokeStyle = theme.line; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x0, yMid); g.lineTo(x1, yMid); g.stroke(); g.setLineDash([]);

        // vertical cm scale (left)
        if (!small) {
          g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath();
          for (let cm = -30; cm <= 30; cm += 10) { const yy = Y(cm / 100); g.moveTo(x0 - 34, yy); g.lineTo(x0 - 28, yy); }
          g.stroke();
          for (let cm = -30; cm <= 30; cm += 10) {
            K.text(g, (cm === 0 ? '0' : K.fmt(Math.abs(cm), 0, lang)), x0 - 38, Y(cm / 100), { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
          }
          K.text(g, 'cm', x0 - 38, Y(0.34) - 4, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
        }

        // ruler in metres (bottom)
        const ry = h - 30;
        g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, ry); g.lineTo(x1, ry);
        for (let m = 0; m <= LEN + 0.01; m += 0.5) { const tx = X(m), big = Math.abs(m - Math.round(m)) < 0.01; g.moveTo(tx, ry); g.lineTo(tx, ry + (big ? 9 : 5)); }
        g.stroke();
        for (let m = 0; m <= LEN; m += 1) K.text(g, K.fmt(m, 0, lang) + ' m', X(m), ry + 12, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });

        // right-end fixture (behind the string)
        const yTop = Y(0.34), yBot = Y(-0.34);
        if (st.end === 'fixed') {
          g.save(); g.beginPath(); g.rect(x1, yTop, 12, yBot - yTop); g.clip();
          g.fillStyle = theme.ground; g.fillRect(x1, yTop, 12, yBot - yTop);
          g.strokeStyle = K.withAlpha(theme.fg, 0.35); g.lineWidth = 1; g.beginPath();
          for (let yy = yTop - 12; yy < yBot; yy += 10) { g.moveTo(x1, yy); g.lineTo(x1 + 12, yy + 12); } g.stroke();
          g.restore();
          g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.strokeRect(x1, yTop, 12, yBot - yTop);
        } else if (st.end === 'loose') {
          g.strokeStyle = theme.muted; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1 + 5, yTop); g.lineTo(x1 + 5, yBot); g.stroke();
        } else {
          K.arrow(g, x1 + 6, yMid, x1 + 28, yMid, { color: theme.muted, width: 2, head: 8 });
        }
        K.text(g, K.tr(END_CAPTION[st.end], lang), x1 + 12, ry - 14, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });

        // driver rail + track of the highlighted bead
        g.setLineDash([3, 5]); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath();
        g.moveTo(x0, yTop); g.lineTo(x0, yBot); g.moveTo(X(3), yTop); g.lineTo(X(3), yBot); g.stroke(); g.setLineDash([]);
        K.text(g, '↕', X(3), yBot + 2, { font: '13px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });

        // the string
        g.strokeStyle = theme.c1; g.lineWidth = 4; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath();
        for (let i = 0; i < N; i++) { const px = X(i * DX), py = Y(y[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke();
        // beads every 0.5 m
        for (let m = 0.5; m < LEN - 0.01; m += 0.5) {
          const i = Math.round(m / DX), big = Math.abs(m - 3) < 0.01;
          g.fillStyle = theme.c2; g.beginPath(); g.arc(X(i * DX), Y(y[i]), big ? 8 : 5, 0, Math.PI * 2); g.fill();
          g.strokeStyle = theme.fg; g.lineWidth = 1; g.stroke();
        }
        if (st.end === 'open') { // fade the string out: the wave just travels away
          const gr = g.createLinearGradient(X(5.1), 0, x1 + 2, 0);
          gr.addColorStop(0, K.withAlpha(theme.sky, 0)); gr.addColorStop(1, theme.sky);
          g.fillStyle = gr; g.fillRect(X(5.1), yTop - 10, x1 + 4 - X(5.1), yBot - yTop + 20);
        } else if (st.end === 'loose') {
          g.strokeStyle = theme.c2; g.lineWidth = 3; g.beginPath(); g.arc(x1 + 5, Y(y[N - 1]), 7, 0, Math.PI * 2); g.stroke();
        }
        // left handle (the hand)
        g.fillStyle = theme.c2; g.beginPath(); g.arc(x0, Y(y[0]), 9, 0, Math.PI * 2); g.fill();
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.stroke();
        if (st.mode === 'manual') K.text(g, '↕', x0, yTop - 3, { font: 'bold 14px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });

        // amplitude bracket (oscillate / pulse) and wavelength bracket (oscillate)
        if (st.mode !== 'manual' && st.A >= 0.04) {
          const bx = x0 - (small ? 12 : 16);
          bracketV(g, bx, Y(st.A), yMid);
          K.text(g, 'A = ' + K.fmt(st.A * 100, 0, lang) + ' cm', x0 + 14, Y(st.A) - 10, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'left', baseline: 'bottom' });
        }
        if (osc) {
          const lam = st.v / st.f, thr = Math.max(0.01, 0.4 * st.A);
          let xa = -1;
          for (let i = 2; i < N - 2; i++) if (y[i] > thr && y[i] >= y[i - 1] && y[i] >= y[i + 1]) { xa = i * DX; break; }
          if (xa < 0 || xa + lam > LEN) xa = 0;
          if (lam <= LEN) bracketH(g, X(xa), X(xa + lam), lay.top - 4, 'λ = ' + K.fmt(lam, 2, lang) + ' m');
          else K.text(g, 'λ = ' + K.fmt(lam, 1, lang) + ' m ' + K.tr({ en: '(longer than the string!)', hr: '(dulja od užeta!)' }, lang), (x0 + x1) / 2, lay.top - 6,
            { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        }
      }

      // ---------- pointer (drag the left end) ----------
      function handleHit(p, lay) { return Math.abs(p.x - lay.x0) < 40 && Math.abs(p.y - (lay.yMid - y[0] * lay.ys)) < 80; }
      function onDown(ev) {
        const p = cv.pointer(ev), lay = layout();
        if (!handleHit(p, lay) && !(st.mode === 'manual' && p.x < lay.x0 + lay.pxm * 0.6)) return;
        if (st.mode !== 'manual') segMode.set('manual', true);
        st.dragging = true; st.hand = K.clamp((lay.yMid - p.y) / lay.ys, -A_MAX, A_MAX);
        try { if (ev.pointerId !== undefined) cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        if (!L.running) { L.start(); updatePlay(); }
        ev.preventDefault();
      }
      function onMove(ev) {
        const p = cv.pointer(ev), lay = layout();
        if (st.dragging) { st.hand = K.clamp((lay.yMid - p.y) / lay.ys, -A_MAX, A_MAX); ev.preventDefault(); }
        else cv.canvas.style.cursor = handleHit(p, lay) ? 'grab' : 'default';
      }
      function onUp() { st.dragging = false; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      const L = K.loop(dt => { step(dt); draw(); });
      cv.onResize(draw);
      reset();
      if (!ctx.reducedMotion) { L.start(); updatePlay(); }

      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
