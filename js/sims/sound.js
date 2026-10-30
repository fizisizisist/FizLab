/* FizLab sim: Sound — (a) a loudspeaker sending longitudinal waves through a row of particles, with a pressure graph
   and a real audible tone (Web Audio); (b) an echo from a cliff with a stopwatch. */
(function () {
  'use strict';
  const K = window.SimKit;
  const MEDIA = [
    { id: 'air', v: 343, label: { en: 'Air (343 m/s)', hr: 'Zrak (343 m/s)' }, name: { en: 'air', hr: 'zrak' } },
    { id: 'water', v: 1480, label: { en: 'Water (1480 m/s)', hr: 'Voda (1480 m/s)' }, name: { en: 'water', hr: 'voda' } },
    { id: 'steel', v: 5900, label: { en: 'Steel (5900 m/s)', hr: 'Čelik (5900 m/s)' }, name: { en: 'steel', hr: 'čelik' } }
  ];
  const NP = 80, ROWS = 3;       // particles per row, rows
  const TWO_PI = Math.PI * 2;
  function makeJitter(n, seed) {  // deterministic pseudo-random offsets in [-0.5, 0.5]
    const a = new Float32Array(n); let s = seed >>> 0;
    for (let i = 0; i < n; i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; a[i] = s / 4294967296 - 0.5; }
    return a;
  }

  window.Sims.register({
    id: 'sound',
    title: { en: 'Sound', hr: 'Zvuk' },
    summary: {
      en: 'See how a loudspeaker squeezes and stretches the air, hear the tone you draw, and time an echo bouncing off a cliff.',
      hr: 'Pogledaj kako zvučnik stišće i rasteže zrak, poslušaj ton koji crtaš i izmjeri vrijeme jeke koja se odbija od stijene.'
    },
    tasks: [
      { en: 'Raise the frequency (pitch). What happens to the wavelength on the pressure graph?', hr: 'Povisi frekvenciju (ton). Što se događa s valnom duljinom na grafu tlaka?' },
      { en: 'Keep the pitch and switch the medium to water or steel. Is the wavelength longer or shorter? Why?', hr: 'Zadrži ton i promijeni sredstvo u vodu ili čelik. Je li valna duljina dulja ili kraća? Zašto?' },
      { en: 'Watch one particle. Does it travel to the right with the wave, or just wobble back and forth?', hr: 'Promatraj jednu česticu. Putuje li udesno s valom ili samo titra naprijed-natrag?' },
      { en: 'In Echo mode set the cliff to 170 m and shout. How long until the echo? Now try 340 m and 17 m.', hr: 'U načinu Jeka postavi stijenu na 170 m i vikni. Koliko traje do jeke? Zatim probaj 340 m i 17 m.' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 460 });
      const C = K.controls(container, lang);
      const st = { mode: 'waves', f: 440, loud: 60, med: MEDIA[0], phase: 0, d: 170, echo: null, flash: 0 };
      const jx = makeJitter(NP * ROWS, 7), jy = makeJitter(NP * ROWS, 13);
      let audio = null; // { ac, osc, gain } while a tone plays

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'waves', label: { en: 'Waves', hr: 'Valovi' } }, { value: 'echo', label: { en: 'Echo', hr: 'Jeka' } }], value: 'waves', onChange: setMode });
      const slF = C.slider({ label: { en: 'Frequency (pitch)', hr: 'Frekvencija (visina tona)' }, min: 100, max: 2000, step: 10, value: 440,
        format: (v, l) => K.fmt(v, 0, l) + ' Hz · ' + K.tr(v < 300 ? { en: 'low', hr: 'nizak ton' } : v > 1000 ? { en: 'high', hr: 'visok ton' } : { en: 'medium', hr: 'srednji ton' }, l),
        onChange: v => { st.f = v; retune(); updateOut(); if (!L.running) draw(); } });
      const slLoud = C.slider({ label: { en: 'Loudness (amplitude)', hr: 'Glasnoća (amplituda)' }, min: 0, max: 100, step: 1, value: 60, unit: '%', digits: 0,
        onChange: v => { st.loud = v; retune(); if (!L.running) draw(); } });
      C.select({ label: { en: 'Medium', hr: 'Sredstvo' }, options: MEDIA.map(m => ({ value: m.id, label: m.label })), value: 'air',
        onChange: v => { st.med = MEDIA.find(m => m.id === v); st.echo = null; updateOut(); if (!L.running) draw(); } });
      const btnTone = C.button({ label: { en: 'Play tone', hr: 'Sviraj ton' }, icon: '🔊', onClick: () => { if (audio) stopTone(); else startTone(); } });
      const slD = C.slider({ label: { en: 'Distance to the cliff d', hr: 'Udaljenost do stijene d' }, min: 17, max: 1000, step: 1, value: 170, unit: 'm', digits: 0,
        onChange: v => { st.d = v; st.echo = null; st.flash = 0; updateOut(); if (!L.running) draw(); } });
      const btnShout = C.button({ label: { en: 'Shout!', hr: 'Vikni!' }, icon: '📣', onClick: () => {
        st.echo = { r: 0, done: false }; st.flash = 0; if (!L.running) { L.start(); updatePlay(); } } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); if (!L.running) stopTone(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outLam = C.readout({ label: { en: 'Wavelength λ = v / f', hr: 'Valna duljina λ = v / f' }, unit: 'm', digits: 3 });
      const outT = C.readout({ label: { en: 'Period T = 1 / f', hr: 'Period T = 1 / f' }, unit: 'ms', digits: 2 });
      const outV = C.readout({ label: { en: 'Speed of sound v', hr: 'Brzina zvuka v' }, unit: 'm/s', digits: 0 });
      const outEcho = C.readout({ label: { en: 'Echo time t = 2·d / v', hr: 'Vrijeme jeke t = 2·d / v' }, unit: 's', digits: 2 });
      const outWatch = C.readout({ label: { en: 'Stopwatch', hr: 'Štoperica' }, unit: 's', digits: 2 });
      const note = C.note({ text: '' });

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function show(c, on) { fieldOf(c).style.display = on ? '' : 'none'; }
      function applyMode() {
        const wv = st.mode === 'waves';
        [slF, slLoud, btnTone, outLam, outT].forEach(c => show(c, wv));
        [slD, btnShout, outEcho, outWatch].forEach(c => show(c, !wv));
      }
      function setMode(v) {
        st.mode = v; stopTone(); st.echo = null; st.flash = 0; applyMode();
        if (!L.running && !ctx.reducedMotion) L.start();
        updatePlay(); updateOut(); draw();
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function echoTime() { return 2 * st.d / st.med.v; }
      function watchTime() { return st.echo ? Math.min(echoTime(), st.echo.r / st.med.v) : 0; }
      function updateOut() {
        const v = st.med.v;
        outV.set(v); outLam.set(v / st.f); outT.set(1000 / st.f);
        const te = echoTime();
        outEcho.set(te); outEcho.setColor(te < 0.1 ? theme.bad : '');
        outWatch.set(watchTime());
        if (st.mode === 'waves') note.set({
          en: 'The drawing is slowed down enormously: a real ' + K.fmt(st.f, 0, 'en') + ' Hz tone vibrates ' + K.fmt(st.f, 0, 'en') + ' times every second. Wavelengths are drawn relative to air so they stay visible; the numbers are real.',
          hr: 'Crtež je jako usporen: pravi ton od ' + K.fmt(st.f, 0, 'hr') + ' Hz zatitra ' + K.fmt(st.f, 0, 'hr') + ' puta u sekundi. Valne duljine su nacrtane u odnosu na zrak da ostanu vidljive; brojevi su pravi.' });
        else note.set({
          en: 'Our ear hears a separate echo only if it arrives at least 0.1 s after the shout. In air sound covers 34 m (there and back) in 0.1 s, so the wall must be at least 17 m away.',
          hr: 'Uho čuje odvojenu jeku samo ako stigne barem 0,1 s nakon povika. U zraku zvuk prijeđe 34 m (tamo i natrag) za 0,1 s, zato zid mora biti udaljen barem 17 m.' });
      }
      function reset() { stopTone(); st.phase = 0; st.echo = null; st.flash = 0; updateOut(); updatePlay(); draw(); }

      // ---------- Web Audio (created on click only) ----------
      function toneGain() { return 0.15 * K.clamp(st.loud / 100, 0, 1); }
      function startTone() {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          const ac = new AC(), osc = ac.createOscillator(), gain = ac.createGain();
          osc.type = 'sine'; osc.frequency.value = st.f;
          gain.gain.setValueAtTime(0, ac.currentTime);
          osc.connect(gain); gain.connect(ac.destination); osc.start();
          gain.gain.linearRampToValueAtTime(toneGain(), ac.currentTime + 0.05);
          if (ac.state === 'suspended' && ac.resume) ac.resume();
          audio = { ac, osc, gain };
        } catch (e) { audio = null; }
        btnTone.setLabel(audio ? { en: 'Stop tone', hr: 'Zaustavi ton' } : { en: 'Play tone', hr: 'Sviraj ton' }); btnTone.setActive(!!audio);
      }
      function stopTone() {
        if (!audio) return;
        const a = audio; audio = null;
        try {
          const t = a.ac.currentTime;
          a.gain.gain.cancelScheduledValues(t); a.gain.gain.setValueAtTime(a.gain.gain.value, t); a.gain.gain.linearRampToValueAtTime(0, t + 0.04);
          a.osc.onended = () => { try { a.ac.close(); } catch (e) { /* ignore */ } };
          a.osc.stop(t + 0.06);
        } catch (e) { try { a.ac.close(); } catch (e2) { /* ignore */ } }
        btnTone.setLabel({ en: 'Play tone', hr: 'Sviraj ton' }); btnTone.setActive(false);
      }
      function retune() {
        if (!audio) return;
        try { const t = audio.ac.currentTime; audio.osc.frequency.setTargetAtTime(st.f, t, 0.02); audio.gain.gain.setTargetAtTime(toneGain(), t, 0.02); } catch (e) { /* ignore */ }
      }

      // ---------- layout ----------
      function layoutWaves() {
        const w = cv.w, h = cv.h, small = w < 480;
        const xs = small ? 72 : 104, xe = w - 14;
        const tubeTop = 48, tubeH = Math.max(60, (h - 48) * 0.4);
        const gTop = tubeTop + tubeH + 28, gBot = h - 36;
        // on-screen wavelength: ~4 waves across at 440 Hz in air; other media scaled (compressed) so they stay visible
        const nWaves = K.clamp(4 * (st.f / 440) * Math.sqrt(343 / st.med.v), 1.25, 9);
        const lamPx = (xe - xs) / nWaves, spacing = (xe - xs) / NP;
        const amp = Math.min(0.2 * lamPx, 1.3 * spacing) * (st.loud / 100);
        const vPx = 110 * K.clamp(Math.sqrt(st.med.v / 343), 1, 2.2); // visual propagation speed (px/s)
        return { w, h, small, xs, xe, tubeTop, tubeH, gTop, gBot, lamPx, spacing, amp, vPx, k: TWO_PI / lamPx };
      }
      function layoutEcho() {
        const w = cv.w, h = cv.h, small = w < 480;
        const groundY = h - 44, xP = small ? 36 : 60, xC = w - (small ? 40 : 70);
        return { w, h, small, groundY, xP, xC, pxm: (xC - xP) / st.d, yMouth: groundY - 60 };
      }

      // ---------- physics ----------
      function step(dt) {
        if (st.mode === 'waves') {
          const lay = layoutWaves();
          st.phase = (st.phase + lay.k * lay.vPx * dt) % TWO_PI;
        } else if (st.echo && !st.echo.done) {
          const vVis = Math.max(170, 2 * st.d / 6);   // visual speed (m/s on screen): 340 m takes 2 s, long trips capped at 6 s
          st.echo.r += vVis * dt;
          if (st.echo.r >= 2 * st.d) { st.echo.r = 2 * st.d; st.echo.done = true; st.flash = 1.5; }
        }
        if (st.flash > 0) st.flash = Math.max(0, st.flash - dt);
      }

      // ---------- drawing ----------
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (st.mode === 'waves') drawWaves(g); else drawEcho(g);
      }
      function drawWaves(g) {
        const lay = layoutWaves(), { w, h, small, xs, xe, tubeTop, tubeH, gTop, gBot, lamPx, spacing, amp, k } = lay;
        const v = st.med.v, lam = v / st.f;
        const pressure = x => -Math.cos(k * (x - xs) - st.phase);           // ∝ −∂s/∂x
        const disp = x => amp * Math.sin(k * (x - xs) - st.phase);          // longitudinal displacement
        // header
        const head1 = 'f = ' + K.fmt(st.f, 0, lang) + ' Hz    λ = ' + K.fmt(lam, 3, lang) + ' m    T = ' + K.fmt(1000 / st.f, 2, lang) + ' ms';
        const head2 = 'v = ' + K.fmt(v, 0, lang) + ' m/s (' + K.tr(st.med.name, lang) + ')';
        if (small) {
          K.text(g, head1, 12, 14, { font: 'bold 12px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
          K.text(g, head2, 12, 32, { font: 'bold 12px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        } else K.text(g, head1 + '    ' + head2, 12, 16, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        // loudspeaker
        const boxX = 12, boxW = xs - 24, cy = tubeTop + tubeH / 2;
        g.fillStyle = theme.surface2; g.strokeStyle = theme.muted; g.lineWidth = 2;
        K.roundRect(g, boxX, tubeTop + 4, boxW, tubeH - 8, 8); g.fill(); g.stroke();
        const coneX = boxX + boxW - 8 + K.clamp(disp(xs) * 1.5, -10, 10);
        g.fillStyle = theme.c2; g.beginPath();
        g.moveTo(coneX - 22, cy - tubeH * 0.14); g.lineTo(coneX, cy - tubeH * 0.36); g.lineTo(coneX, cy + tubeH * 0.36); g.lineTo(coneX - 22, cy + tubeH * 0.14); g.closePath(); g.fill();
        g.strokeStyle = theme.fg; g.lineWidth = 1; g.stroke();
        g.fillStyle = theme.fg; g.beginPath(); g.arc(coneX - 20, cy, 4, 0, TWO_PI); g.fill();
        K.text(g, K.tr({ en: 'loudspeaker', hr: 'zvučnik' }, lang), boxX + boxW / 2, tubeTop + tubeH + 6, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        // tube of particles
        g.strokeStyle = theme.line; g.lineWidth = 1; g.strokeRect(xs, tubeTop, xe - xs, tubeH);
        const pr = K.clamp(spacing * 0.3, 2, 4.5);
        for (let r = 0; r < ROWS; r++) for (let i = 0; i < NP; i++) {
          const idx = r * NP + i;
          const x0 = xs + (i + 0.5) * spacing + jx[idx] * spacing * 0.5;
          const y0 = tubeTop + tubeH * (r + 0.5) / ROWS + jy[idx] * tubeH * 0.22;
          const x = x0 + disp(x0);
          g.fillStyle = K.withAlpha(theme.c1, 0.55 + 0.45 * pressure(x0));
          g.beginPath(); g.arc(x, y0, pr, 0, TWO_PI); g.fill();
        }
        K.text(g, K.tr({ en: 'particles of ', hr: 'čestice: ' }, lang) + K.tr(st.med.name, lang), xe, tubeTop + tubeH + 6, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
        // compression / rarefaction markers (move with the wave)
        let xC = xs + ((st.phase + Math.PI) % TWO_PI) / k; if (xC < xs + 14) xC += lamPx;
        let xR = xC - lamPx / 2; if (xR < xs + 14) xR = xC + lamPx / 2;
        const mark = (x, label) => {
          if (x > xe - 14) return;
          g.strokeStyle = theme.fg; g.lineWidth = 1; g.beginPath(); g.moveTo(x, tubeTop - 4); g.lineTo(x, tubeTop - 12); g.stroke();
          K.text(g, K.tr(label, lang), x, tubeTop - 14, { font: (small ? 10 : 11) + 'px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        };
        mark(xC, { en: 'compression', hr: 'zgušnjenje' }); mark(xR, { en: 'rarefaction', hr: 'razrjeđenje' });
        // pressure graph
        const mid = (gTop + gBot) / 2, ampG = Math.max(2, ((gBot - gTop) / 2 - 8) * (st.loud / 100));
        g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(xs, mid); g.lineTo(xe, mid); g.moveTo(xs, gTop); g.lineTo(xs, gBot); g.stroke();
        K.text(g, K.tr({ en: 'pressure', hr: 'tlak' }, lang), xs + 6, gTop - 2, { font: '11px ' + theme.font, color: theme.fg, baseline: 'bottom' });
        K.text(g, '+', xs - 10, gTop + 6, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        K.text(g, '−', xs - 10, gBot - 6, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        g.strokeStyle = theme.c3; g.lineWidth = 2; g.beginPath();
        for (let x = xs; x <= xe; x += 2) { const yv = mid - ampG * pressure(x); x === xs ? g.moveTo(x, yv) : g.lineTo(x, yv); }
        g.stroke();
        // wavelength bracket from one compression (pressure peak) to the next
        let ba = xC, bb = xC + lamPx;
        if (bb > xe) { ba = xC - lamPx; bb = xC; }
        if (ba < xs) { ba = xs; bb = xs + lamPx; }
        const by = gBot + 6;
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath();
        g.moveTo(ba, by); g.lineTo(bb, by); g.moveTo(ba, by - 5); g.lineTo(ba, by + 5); g.moveTo(bb, by - 5); g.lineTo(bb, by + 5); g.stroke();
        K.text(g, 'λ = ' + K.fmt(lam, 3, lang) + ' m', (ba + bb) / 2, by + 7, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
      }
      function drawEcho(g) {
        const lay = layoutEcho(), { w, h, small, groundY, xP, xC, pxm, yMouth } = lay;
        const v = st.med.v, te = echoTime(), tw = watchTime();
        const vVis = Math.max(170, 2 * st.d / 6), slow = v / vVis;
        // ground and cliff
        g.fillStyle = theme.ground; g.fillRect(0, groundY, w, h - groundY); g.fillRect(xC, 26, w - xC, groundY - 26);
        g.fillStyle = theme.good; g.fillRect(0, groundY, xC, 4);
        g.strokeStyle = K.withAlpha(theme.fg, 0.25); g.lineWidth = 1; g.beginPath();
        for (let yy = 50; yy < groundY; yy += 24) { g.moveTo(xC + 4, yy); g.lineTo(w, yy + 6); } g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(xC, 26); g.lineTo(xC, groundY); g.stroke();
        K.text(g, K.tr({ en: 'cliff', hr: 'stijena' }, lang), xC + (w - xC) / 2, 40, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        // person
        g.strokeStyle = theme.c2; g.fillStyle = theme.c2; g.lineWidth = 3; g.lineCap = 'round';
        g.beginPath(); g.arc(xP, yMouth - 8, 9, 0, TWO_PI); g.fill();
        g.beginPath(); g.moveTo(xP, yMouth + 2); g.lineTo(xP, groundY - 22); g.moveTo(xP, groundY - 22); g.lineTo(xP - 8, groundY); g.moveTo(xP, groundY - 22); g.lineTo(xP + 8, groundY);
        g.moveTo(xP, yMouth + 10); g.lineTo(xP + 14, yMouth + 2); g.moveTo(xP, yMouth + 10); g.lineTo(xP - 10, yMouth + 22); g.stroke();
        // distance arrow in the ground
        const dy = groundY + 22;
        K.arrow(g, xP + 20, dy, xC - 2, dy, { color: theme.fg, width: 2, head: 8 }); K.arrow(g, xC - 20, dy, xP + 2, dy, { color: theme.fg, width: 2, head: 8 });
        K.text(g, 'd = ' + K.fmt(st.d, 0, lang) + ' m', (xP + xC) / 2, dy - 4, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        // sound pulse: arcs from the mouth, then from the mirror image of the mouth behind the cliff
        if (st.echo) {
          const rPx = st.echo.r * pxm, dPx = st.d * pxm, mx = xP + 8;
          g.save(); g.beginPath(); g.rect(mx, 0, xC - mx, groundY); g.clip();
          g.lineWidth = 3; g.lineCap = 'round';
          for (let j = 0; j < 3; j++) {
            const r = rPx - j * 14; if (r <= 0) continue;
            g.strokeStyle = K.withAlpha(theme.c1, 1 - j * 0.3); g.beginPath();
            if (r <= dPx) g.arc(mx, yMouth, r, -1.1, 1.1); else g.arc(2 * xC - mx, yMouth, r, Math.PI - 1.1, Math.PI + 1.1);
            g.stroke();
          }
          g.restore();
        }
        if (st.flash > 0) {
          K.text(g, K.tr({ en: 'Echo!', hr: 'Jeka!' }, lang), xP + 26, yMouth - 30, { font: 'bold 18px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        }
        // stopwatch + explanation
        K.text(g, '⏱ ' + K.fmt(tw, 2, lang) + ' s', 12, 18, { font: 'bold 20px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(g, 't = 2·d / v = 2·' + K.fmt(st.d, 0, lang) + ' m / ' + K.fmt(v, 0, lang) + ' m/s = ' + K.fmt(te, 2, lang) + ' s', 12, 42, { font: (small ? 11 : 13) + 'px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(g, K.tr({ en: 'on screen the sound is slowed down ×', hr: 'na ekranu je zvuk usporen ×' }, lang) + K.fmt(slow, 1, lang), 12, 60, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        if (te < 0.1) K.text(g, K.tr({ en: 'under 0.1 s: too quick to hear a separate echo', hr: 'manje od 0,1 s: prebrzo za odvojenu jeku' }, lang), 12, 78, { font: 'bold 11px ' + theme.font, color: theme.bad, baseline: 'middle' });
      }

      const L = K.loop(dt => { step(dt); draw(); if (st.mode === 'echo' && st.echo && !st.echo.done) outWatch.set(watchTime()); else if (st.echo && st.echo.done) outWatch.set(echoTime()); });
      cv.onResize(draw);
      applyMode(); reset();
      if (!ctx.reducedMotion) { L.start(); updatePlay(); }

      return {
        destroy() { stopTone(); L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
