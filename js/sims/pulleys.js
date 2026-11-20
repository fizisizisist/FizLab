/* FizLab sim: Pulleys and ramps — simple machines and the golden rule of mechanics:
   (a) pulleys and block and tackle, (b) inclined plane, (c) wheel and axle (a well windlass). */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, TAU = Math.PI * 2;
  const RW = 0.24;       // radius of a pulley wheel (m)
  const SMAX = 4;        // longest pull on the rope (m)
  const WELL = 4;        // depth of the well (m)
  const CRATE = '#c48a4b', CRATE_EDGE = '#6e4420', SKIN = '#e2b08c';   // fixed physical colours (wood, hand)
  // wheels in rope order: F = fixed to the beam, M = movable (hangs with the load); start = where the rope is tied
  const SYS = [
    { id: 'fixed', n: 1, start: 'load', wheels: ['F'], up: false, xl: 0, label: { en: 'One fixed pulley (n = 1)', hr: 'Jedna nepomična kolotura (n = 1)' } },
    { id: 'movable', n: 2, start: 'ceil', wheels: ['M'], up: true, xl: RW, label: { en: 'One movable pulley (n = 2)', hr: 'Jedna pomična kolotura (n = 2)' } },
    { id: 'tackle3', n: 3, start: 'block', wheels: ['F', 'M', 'F'], up: false, xl: 2 * RW, label: { en: 'Block and tackle (n = 3)', hr: 'Koloturnik (n = 3)' } },
    { id: 'tackle4', n: 4, start: 'ceil', wheels: ['M', 'F', 'M', 'F'], up: false, xl: 3 * RW, label: { en: 'Block and tackle (n = 4)', hr: 'Koloturnik (n = 4)' } }
  ];
  const MUS = [
    { id: 'none', mu: 0, label: { en: 'No friction', hr: 'Bez trenja' } },
    { id: 'wheels', mu: 0.02, label: { en: 'On wheels (μ = 0.02)', hr: 'Na kotačima (μ = 0,02)' } },
    { id: 'wood', mu: 0.3, label: { en: 'Wood on wood (μ = 0.3)', hr: 'Drvo po drvu (μ = 0,3)' } }
  ];

  window.Sims.register({
    id: 'pulleys',
    title: { en: 'Pulleys and Ramps', hr: 'Koloture i kosina' },
    summary: {
      en: 'Lift a load with pulleys, push a crate up a ramp and wind a bucket out of a well. Less force always means a longer way.',
      hr: 'Podigni teret koloturama, guraj sanduk uz kosinu i izvuci vjedro iz bunara vitlom. Manja sila uvijek znači dulji put.'
    },
    tasks: [
      { en: 'Count the rope segments that hold the load in the block and tackle with n = 4. How much rope must you pull to lift the load by 1 m?', hr: 'Prebroji dijelove užeta koji drže teret u koloturniku s n = 4. Koliko užeta moraš povući da teret podigneš za 1 m?' },
      { en: 'Compare the two rectangles "force × distance" for every pulley system. What stays the same?', hr: 'Usporedi dva pravokutnika „sila × put“ za svaki sustav kolotura. Što ostaje isto?' },
      { en: 'Switch on "Real pulleys" and lift a 5 kg load with n = 4. Why is the efficiency so low?', hr: 'Uključi „Stvarne koloture“ i podigni teret od 5 kg uz n = 4. Zašto je korisnost tako mala?' },
      { en: 'Inclined plane: the crate has 100 kg and the height is 1 m. How long must the ramp be so that 200 N is enough (no friction)?', hr: 'Kosina: masa sanduka je 100 kg, a visina kosine 1 m. Kolika mora biti duljina kosine da bude dovoljna sila od 200 N (bez trenja)?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 380, maxHeight: 500 });
      const C = K.controls(container, lang);
      const T = o => K.tr(o, lang), N = (v, d) => K.fmt(v, d, lang);
      function defaults() { return { mode: 'pulleys', sys: 'fixed', m: 20, s: 0, real: false, l: 5, h: 1, mc: 50, mu: 'none', pos: 0, R: 40, r: 10, mb: 10, turns: 0 }; }
      const st = defaults();
      let drag = null;

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Simple machine', hr: 'Jednostavni stroj' }, options: [
        { value: 'pulleys', label: { en: 'Pulleys', hr: 'Koloture' } }, { value: 'ramp', label: { en: 'Inclined plane', hr: 'Kosina' } },
        { value: 'wind', label: { en: 'Wheel and axle', hr: 'Vitlo' } }], value: 'pulleys', onChange: v => { st.mode = v; drag = null; stop(); showControls(); refresh(); } });
      const selSys = C.select({ label: { en: 'Pulley system', hr: 'Sustav kolotura' }, options: SYS.map(s => ({ value: s.id, label: s.label })), value: 'fixed', onChange: v => { st.sys = v; refresh(); } });
      const slMass = C.slider({ label: { en: 'Mass of the load', hr: 'Masa tereta' }, min: 5, max: 100, step: 1, value: 20, unit: 'kg', digits: 0, onChange: v => { st.m = v; refresh(); } });
      const slPull = C.slider({ label: { en: 'Rope pulled s', hr: 'Povučeno uže s' }, min: 0, max: SMAX, step: 0.05, value: 0, unit: 'm', digits: 2, onChange: v => { st.s = v; refresh(); } });
      const tgReal = C.toggle({ label: { en: 'Real pulleys (weight and friction)', hr: 'Stvarne koloture (težina i trenje)' }, value: false, onChange: v => { st.real = v; refresh(); } });
      const slL = C.slider({ label: { en: 'Length of the ramp l', hr: 'Duljina kosine l' }, min: 1, max: 10, step: 0.1, value: 5, unit: 'm', digits: 1,
        onChange: v => { st.l = v; if (st.h > 0.95 * v) { st.h = Math.max(0.2, Math.floor(9.5 * v) / 10); slH.set(st.h); } refresh(); } });
      const slH = C.slider({ label: { en: 'Height of the ramp h', hr: 'Visina kosine h' }, min: 0.2, max: 3, step: 0.1, value: 1, unit: 'm', digits: 1,
        onChange: v => { st.h = v; if (v > 0.95 * st.l) { st.l = Math.min(10, Math.ceil(v / 0.95 * 10) / 10); slL.set(st.l); } refresh(); } });
      const slMc = C.slider({ label: { en: 'Mass of the crate', hr: 'Masa sanduka' }, min: 10, max: 200, step: 5, value: 50, unit: 'kg', digits: 0, onChange: v => { st.mc = v; refresh(); } });
      const selMu = C.select({ label: { en: 'Friction on the ramp', hr: 'Trenje na kosini' }, options: MUS.map(s => ({ value: s.id, label: s.label })), value: 'none', onChange: v => { st.mu = v; refresh(); } });
      const slPos = C.slider({ label: { en: 'Push the crate up the ramp', hr: 'Guraj sanduk uz kosinu' }, min: 0, max: 100, step: 1, value: 0, unit: '%', digits: 0, onChange: v => { st.pos = v; refresh(); } });
      const slR = C.slider({ label: { en: 'Radius of the handle R', hr: 'Polumjer ručke R' }, min: 10, max: 60, step: 1, value: 40, unit: 'cm', digits: 0, onChange: v => { st.R = v; refresh(); } });
      const slr = C.slider({ label: { en: 'Radius of the drum r', hr: 'Polumjer vratila r' }, min: 3, max: 20, step: 1, value: 10, unit: 'cm', digits: 0, onChange: v => { st.r = v; st.turns = Math.min(st.turns, wind().maxT); slTurns.set(st.turns); refresh(); } });
      const slMb = C.slider({ label: { en: 'Mass of the full bucket', hr: 'Masa punog vjedra' }, min: 2, max: 30, step: 1, value: 10, unit: 'kg', digits: 0, onChange: v => { st.mb = v; refresh(); } });
      const slTurns = C.slider({ label: { en: 'Turns of the handle', hr: 'Broj okretaja ručke' }, min: 0, max: 22, step: 0.25, value: 0, digits: 2, onChange: v => { st.turns = Math.min(v, wind().maxT); if (st.turns < v) slTurns.set(st.turns); refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => {
        if (!L.running && atEnd()) { if (st.mode === 'pulleys') st.s = 0; else if (st.mode === 'ramp') st.pos = 0; else st.turns = 0; syncSliders(); }
        L.toggle(); updatePlay(); refresh();
      } });
      C.button({ label: { en: 'Reset', hr: 'Ispočetka' }, onClick: reset });
      const outF = C.readout({ label: { en: 'Force needed F', hr: 'Potrebna sila F' }, unit: 'N', digits: 1 });
      const outS = C.readout({ label: { en: 'Rope pulled s', hr: 'Povučeno uže s' }, unit: 'm', digits: 2 });
      const outH = C.readout({ label: { en: 'Load raised by h', hr: 'Teret podignut za h' }, unit: 'm', digits: 2 });
      const outAng = C.readout({ label: { en: 'Angle of the ramp α', hr: 'Kut kosine α' }, unit: '°', digits: 1 });
      const outTurns = C.readout({ label: { en: 'Turns', hr: 'Broj okretaja' }, digits: 2 });
      const outPer = C.readout({ label: { en: 'Bucket rise per turn 2πr', hr: 'Pomak vjedra po okretu 2πr' }, unit: 'm', digits: 2 });
      const outRise = C.readout({ label: { en: 'Bucket raised by', hr: 'Vjedro podignuto za' }, unit: 'm', digits: 2 });
      const outWin = C.readout({ label: { en: 'Work in (force × your distance)', hr: 'Uloženi rad (sila × tvoj put)' }, unit: 'J', digits: 0 });
      const outWout = C.readout({ label: { en: 'Work of lifting straight up G · h', hr: 'Rad dizanja ravno uvis G · h' }, unit: 'J', digits: 0 });
      const outEff = C.readout({ label: { en: 'Efficiency', hr: 'Korisnost' }, unit: '%', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(ctrl) { const el = ctrl.el; return el.classList.contains('sk-field') ? el : el.parentElement; }
      function show(list, on) { list.forEach(ct => { fieldOf(ct).style.display = on ? '' : 'none'; }); }
      function showControls() {
        const m = st.mode;
        show([selSys, slMass, slPull, tgReal, outS, outH], m === 'pulleys');
        show([slL, slH, slMc, selMu, slPos, outAng], m === 'ramp');
        show([slR, slr, slMb, slTurns, outTurns, outPer, outRise], m === 'wind');
        show([outEff], m !== 'wind');
        cv.canvas.style.cursor = 'default';
      }
      function syncSliders() { slPull.set(st.s); slPos.set(st.pos); slTurns.set(st.turns); }

      // ---------- physics ----------
      function pul() {
        const sys = SYS.find(x => x.id === st.sys) || SYS[0], Gw = st.m * G, mov = sys.wheels.filter(t => t === 'M').length;
        const Gb = st.real ? 2 * G * mov : 0;                         // movable block: 2 kg per wheel
        const F = (Gw + Gb) / sys.n * (st.real ? 1.1 : 1), h = st.s / sys.n;   // friction: 10 % more force
        return { sys, Gw, Gb, F, h, Win: F * st.s, Wout: Gw * h, eff: Gw / (sys.n * F) };
      }
      function ramp() {
        const l = st.l, h = Math.min(st.h, 0.95 * l), sin = h / l, cos = Math.sqrt(1 - sin * sin), Gw = st.mc * G;
        const mu = (MUS.find(x => x.id === st.mu) || MUS[0]).mu, Fpar = Gw * sin, Fperp = Gw * cos, Ffr = mu * Fperp, F = Fpar + Ffr;
        return { l, h, sin, cos, alpha: Math.asin(sin), Gw, mu, Fpar, Fperp, Ffr, F, Win: F * l, Wout: Gw * h, eff: Gw * h / (F * l) };
      }
      function wind() {
        const Gw = st.mb * G, R = st.R / 100, r = st.r / 100, per = TAU * r, maxT = WELL / per, turns = Math.min(st.turns, maxT);
        return { Gw, R, r, F: Gw * r / R, per, maxT, turns, rise: turns * per, dIn: TAU * R * turns };
      }
      function atEnd() { return st.mode === 'pulleys' ? st.s >= SMAX - 1e-6 : st.mode === 'ramp' ? st.pos >= 100 - 1e-6 : st.turns >= wind().maxT - 1e-6; }
      function stop() { L.stop(); updatePlay(); }
      function step(dt) {       // Play pulls the rope / pushes the crate / turns the handle steadily
        if (st.mode === 'pulleys') st.s = Math.min(SMAX, st.s + 0.6 * dt);
        else if (st.mode === 'ramp') st.pos = Math.min(100, st.pos + 18 * dt);
        else st.turns = Math.min(wind().maxT, st.turns + 0.5 * dt);
        syncSliders();
        if (atEnd()) stop();
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        if (st.mode === 'pulleys') {
          const q = pul(), n = q.sys.n;
          outF.set(q.F); outS.set(st.s); outH.set(q.h); outWin.set(q.Win); outWout.set(q.Wout); outEff.set(q.eff * 100);
          if (st.real) note.set({ en: 'Real pulleys: you also lift the movable pulleys (2 kg per wheel) and overcome friction (10 % more force). The work you put in is bigger than the useful work, so the efficiency is below 100 %.',
            hr: 'Stvarne koloture: dižeš i pomične koloture (2 kg po koloturi) i svladavaš trenje (10 % više sile). Uloženi rad veći je od korisnog pa je korisnost manja od 100 %.' });
          else if (n === 1) note.set({ en: 'A fixed pulley does not make the force smaller. It only changes its direction: you pull down instead of lifting up. Rope pulled = load raised.',
            hr: 'Nepomična kolotura ne smanjuje silu, nego joj samo mijenja smjer: vučeš prema dolje umjesto da dižeš prema gore. Za koliko povučeš uže, za toliko se teret podigne.' });
          else note.set({ en: 'Golden rule of mechanics: what you gain in force you lose in distance. ' + n + ' rope segments hold the load, so you pull with G / ' + n + ', but you must pull ' + n + ' times more rope. The work is the same.',
            hr: 'Zlatno pravilo mehanike: koliko dobiješ na sili, toliko izgubiš na putu. Teret drže ' + n + ' dijela užeta pa vučeš silom G / ' + n + ', ali moraš povući ' + n + ' puta više užeta. Rad je isti.' });
        } else if (st.mode === 'ramp') {
          const q = ramp(), k = q.l / q.h;
          outF.set(q.F); outAng.set(q.alpha * 180 / Math.PI); outWin.set(q.Win); outWout.set(q.Wout); outEff.set(q.eff * 100);
          note.set(q.mu === 0
            ? { en: 'On the ramp you need F = G · h / l: ' + K.fmt(k, 1, 'en') + ' times less force than lifting straight up, but along a path ' + K.fmt(k, 1, 'en') + ' times longer. The work is the same. A screw and a wedge are ramps too.',
              hr: 'Na kosini je potrebna sila F = G · h / l, tj. ' + K.fmt(k, 1, 'hr') + ' puta manja nego pri dizanju ravno uvis, ali na ' + K.fmt(k, 1, 'hr') + ' puta duljem putu. Rad je isti. I vijak i klin zapravo su kosine.' }
            : { en: 'With friction you must add μ · G⊥ along the ramp (G⊥ is the part of the weight that presses on the ramp). The work up the ramp is then bigger than G · h. A screw and a wedge are ramps too.',
              hr: 'Uz trenje treba dodati μ · G⊥ (G⊥ je sastavnica težine okomita na kosinu, tj. pritisna sila). Rad uz kosinu tada je veći od G · h. I vijak i klin zapravo su kosine.' });
        } else {
          const q = wind();
          outF.set(q.F); outTurns.set(q.turns); outPer.set(q.per); outRise.set(q.rise); outWin.set(q.F * q.dIn); outWout.set(q.Gw * q.rise);
          note.set(st.r > st.R
            ? { en: 'The drum is now bigger than the circle of the handle: you need MORE force than the weight of the bucket, but the bucket moves farther than your hand.', hr: 'Vratilo je sada veće od kružnice ručke: treba ti VEĆA sila od težine vjedra, ali vjedro prijeđe dulji put od tvoje ruke.' }
            : { en: 'Wheel and axle: the handle moves on a big circle (2πR), the rope winds on a small one (2πr). The force is only r / R of the weight, but your hand travels R / r times farther. Each turn lifts the bucket by 2πr.',
              hr: 'Vitlo: ručka se giba po velikoj kružnici (2πR), a uže se namata na malu (2πr). Sila je samo r / R težine, ali ruka prijeđe R / r puta dulji put. Svaki okret podigne vjedro za 2πr.' });
        }
      }

      // ---------- geometry shared by drawing and pointer ----------
      function pulGeom() {
        const w = cv.w, h = cv.h, q = pul(), sceneW = Math.round(w * (w < 560 ? 0.5 : 0.46)), floorY = h - 22, pxm = (floorY - 12) / 5.8;
        const nw = q.sys.wheels.length, x0 = sceneW / 2 - (nw * RW + 0.2) * pxm, yM = RW + 0.75 + q.h;
        const yHand = q.sys.up ? RW + 1.05 + st.s : 4.3 - st.s;
        return { q, sceneW, floorY, pxm, nw, yM, yF: 4.95, yHand, X: m => x0 + m * pxm, Y: m => floorY - m * pxm, xHand: x0 + 2 * nw * RW * pxm, hy: floorY - yHand * pxm };
      }
      function rampGeom() {
        const w = cv.w, h = cv.h, q = ramp(), wide = w >= 560;
        const sw = wide ? Math.round(w * 0.6) : w, sh = wide ? h : Math.round(h * 0.56);
        const Lg = K.clamp(sh * 0.18, 36, 64), groundY = sh - Lg - 6;       // Lg: arrow length of the weight; the ground band leaves room for it
        const pxm = Math.min((sw - 56 - 88) / (q.l * q.cos), (groundY - 92) / q.h), x0 = 56, cs = K.clamp(sw * 0.075, 24, 38), Lpx = q.l * pxm;
        const u = cs / 2 + st.pos / 100 * Math.max(0, Lpx - cs);            // centre of the crate along the ramp (px)
        return { q, wide, sw, sh, Lg, groundY, pxm, x0, cs, Lpx, xr: x0 + q.l * q.cos * pxm, yt: groundY - q.h * pxm,
          ccx: x0 + u * q.cos - cs / 2 * q.sin, ccy: groundY - u * q.sin - cs / 2 * q.cos };
      }
      function windGeom() {
        const w = cv.w, h = cv.h, q = wind(), sceneW = Math.round(w * (w < 560 ? 0.5 : 0.46)), gY = Math.round(h * 0.5);
        const k = Math.min((gY - 30) / 126, sceneW * 0.4 / 60), cx = Math.round(sceneW * 0.5), cy = gY - 64 * k;
        const phi = -Math.PI / 4 - TAU * q.turns;                             // lifting turns the handle anticlockwise
        return { q, sceneW, gY, k, cx, cy, phi, hx: cx + st.R * k * Math.cos(phi), hy: cy + st.R * k * Math.sin(phi) };
      }

      // ---------- pointer ----------
      function hit(p) {
        if (st.mode === 'pulleys') { const g = pulGeom(); return Math.hypot(p.x - g.xHand, p.y - g.hy) < 26 ? { kind: 'rope', y: p.y, s: st.s, pxm: g.pxm, sgn: g.q.sys.up ? -1 : 1 } : null; }
        if (st.mode === 'ramp') { const g = rampGeom(); return Math.hypot(p.x - g.ccx, p.y - g.ccy) < g.cs ? { kind: 'crate' } : null; }
        const g = windGeom();
        return Math.hypot(p.x - g.hx, p.y - g.hy) < 24 ? { kind: 'crank', a: Math.atan2(p.y - g.cy, p.x - g.cx) } : null;
      }
      function onDown(ev) {
        drag = hit(cv.pointer(ev));
        if (!drag) return;
        stop();
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (!drag) { cv.canvas.style.cursor = hit(p) ? 'grab' : 'default'; return; }
        if (drag.kind === 'rope') st.s = K.clamp(Math.round((drag.s + drag.sgn * (p.y - drag.y) / drag.pxm) * 20) / 20, 0, SMAX);
        else if (drag.kind === 'crate') {
          const g = rampGeom(), u = (p.x - g.x0) * g.q.cos + (g.groundY - p.y) * g.q.sin;
          st.pos = Math.round(K.clamp((u - g.cs / 2) / Math.max(1, g.Lpx - g.cs), 0, 1) * 100);
        } else {
          const g = windGeom(), a = Math.atan2(p.y - g.cy, p.x - g.cx);
          let d = a - drag.a; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
          drag.a = a; st.turns = K.clamp(st.turns - d / TAU, 0, g.q.maxT);
        }
        syncSliders(); refresh();
      }
      function onUp() { if (drag) { drag = null; cv.canvas.style.cursor = 'default'; } }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing helpers ----------
      function label(c, str, x, y, o) {      // text on a soft background, kept between 4 px and o.maxX
        o = o || {};
        const font = (o.bold ? 'bold ' : '') + (o.size || 12) + 'px ' + theme.font;
        c.font = font;
        const tw = c.measureText(str).width;
        let tx = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, 4, Math.max(4, (o.maxX || cv.w) - tw - 4));
        if (o.bg !== false) { c.fillStyle = K.withAlpha(theme.surface, 0.82); K.roundRect(c, tx - 4, y - 9, tw + 8, 18, 5); c.fill(); }
        K.text(c, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function fitText(c, s, x, y, maxW, px, bold, color) {
        let font;
        do { font = (bold ? 'bold ' : '') + px + 'px ' + (bold ? theme.fontDisplay : theme.font); c.font = font; px--; } while (c.measureText(s).width > maxW && px >= 8);
        K.text(c, s, x, y, { font, color: color || theme.fg, baseline: 'middle' });
      }
      function lines(c, arr, x, y, maxW) { arr.forEach((s, i) => { fitText(c, s, x, y, maxW, i ? 12 : 14, !i); y += 17; }); return y; }
      const aLen = F => (F <= 0 ? 0 : 14 + 11 * Math.log10(1 + F));
      // Two rectangles "force × distance": the area is the work. a = what you do, b = lifting straight up.
      function workBoxes(c, x, y, w, h, a, b, dMax) {
        fitText(c, T({ en: 'Area = force × distance = work', hr: 'Površina = sila × put = rad' }), x, y + 6, w, 11, false, theme.muted);
        const rowH = (h - 16) / 2, rectH = Math.max(10, rowH - 36), Fmax = Math.max(a.F, b.F, 1e-9);
        [a, b].forEach((o, i) => {
          const y0 = y + 16 + i * rowH, rw = Math.max(2, Math.min(1, o.d / dMax) * w), rh = Math.max(2, o.F / Fmax * rectH), ry = y0 + 18 + rectH - rh;
          fitText(c, o.title, x, y0 + 8, w, 11, true);
          c.fillStyle = K.withAlpha(o.color, 0.35); c.fillRect(x, ry, rw, rh); c.strokeStyle = o.color; c.lineWidth = 2; c.strokeRect(x, ry, rw, rh);
          fitText(c, N(o.F, o.F < 100 ? 1 : 0) + ' N · ' + N(o.d, 2) + ' m = ' + N(o.F * o.d, 0) + ' J', x, y0 + 18 + rectH + 10, w, 11, false);
        });
      }
      function crate(c, x, y, s) {
        c.fillStyle = CRATE; c.fillRect(x, y, s, s); c.strokeStyle = CRATE_EDGE; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, s - 2, s - 2);
        c.beginPath(); c.moveTo(x + 3, y + 3); c.lineTo(x + s - 3, y + s - 3); c.moveTo(x + s - 3, y + 3); c.lineTo(x + 3, y + s - 3); c.stroke();
      }

      // ---------- (a) pulleys ----------
      function drawPulleys(c, w, h) {
        const g = pulGeom(), q = g.q, sys = q.sys, X = g.X, Y = g.Y, rp = RW * g.pxm, nw = g.nw;
        const wy = sys.wheels.map(t => (t === 'F' ? g.yF : g.yM)), boxTop = q.h + 0.5, yoke = g.yM - RW - 0.1;
        const startY = sys.start === 'load' ? boxTop + 0.12 : sys.start === 'ceil' ? 5.3 : yoke;
        c.fillStyle = theme.ground; c.fillRect(0, g.floorY, g.sceneW, h - g.floorY);
        // beam with the fixed wheels and (if any) the tied rope end
        const fx = []; sys.wheels.forEach((t, j) => { if (t === 'F') fx.push((2 * j + 1) * RW); }); if (sys.start === 'ceil') fx.push(0);
        const bx0 = X(Math.min.apply(null, fx) - 0.3), bx1 = X(Math.max.apply(null, fx) + 0.3);
        c.fillStyle = theme.muted; c.fillRect(bx0, Y(5.46), bx1 - bx0, 0.16 * g.pxm);
        c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
        sys.wheels.forEach((t, j) => { if (t === 'F') { c.moveTo(X((2 * j + 1) * RW), Y(5.3)); c.lineTo(X((2 * j + 1) * RW), Y(g.yF)); } });
        // movable block: yoke, hangers and the hook to the load
        const mx = []; sys.wheels.forEach((t, j) => { if (t === 'M') mx.push((2 * j + 1) * RW); });
        if (mx.length) {
          const xa = Math.min.apply(null, mx.concat(sys.start === 'block' ? [0] : [])), xb = Math.max.apply(null, mx.concat([sys.xl]));
          c.moveTo(X(xa), Y(yoke)); c.lineTo(X(xb), Y(yoke));
          mx.forEach(x => { c.moveTo(X(x), Y(g.yM)); c.lineTo(X(x), Y(yoke)); });
          c.moveTo(X(sys.xl), Y(yoke)); c.lineTo(X(sys.xl), Y(boxTop));
        } else { c.moveTo(X(sys.xl), Y(boxTop + 0.12)); c.lineTo(X(sys.xl), Y(boxTop)); }
        c.stroke();
        // wheels (a marked spoke shows how far each one has turned)
        sys.wheels.forEach((t, j) => {
          const cxp = X((2 * j + 1) * RW), cyp = Y(wy[j]), ang = (j + 1) * q.h / RW * (t === 'F' ? 1 : -1);
          c.fillStyle = theme.surface; c.beginPath(); c.arc(cxp, cyp, rp - 1.5, 0, TAU); c.fill();
          c.strokeStyle = theme.muted; c.lineWidth = 2; c.stroke();
          c.beginPath();
          for (let k = 0; k < 3; k++) { const a = ang + k * TAU / 3; c.moveTo(cxp, cyp); c.lineTo(cxp + (rp - 3) * Math.cos(a), cyp + (rp - 3) * Math.sin(a)); }
          c.stroke();
          c.fillStyle = theme.c2; c.beginPath(); c.arc(cxp + (rp - 5) * Math.cos(ang), cyp + (rp - 5) * Math.sin(ang), 3, 0, TAU); c.fill();
          c.fillStyle = theme.fg; c.beginPath(); c.arc(cxp, cyp, 3, 0, TAU); c.fill();
        });
        // rope: the segments that hold the load are coloured and numbered
        const badges = [];
        for (let j = 0; j <= nw; j++) {
          const ya = j === 0 ? startY : wy[j - 1], yb = j === nw ? g.yHand : wy[j], x = X(2 * j * RW);
          const sup = (j === 0 && sys.start !== 'ceil') || (j > 0 && sys.wheels[j - 1] === 'M') || (j < nw && sys.wheels[j] === 'M');
          c.strokeStyle = sup ? theme.c3 : theme.fg; c.lineWidth = sup ? 3.5 : 2.5; c.lineCap = 'butt';
          c.beginPath(); c.moveTo(x, Y(ya)); c.lineTo(x, Y(yb)); c.stroke();
          if (sup) badges.push({ x, y: (Y(Math.min(ya, yb)) + Y(Math.max(ya, yb))) / 2 });
        }
        c.strokeStyle = theme.fg; c.lineWidth = 2.5;
        sys.wheels.forEach((t, j) => { c.beginPath(); if (t === 'F') c.arc(X((2 * j + 1) * RW), Y(g.yF), rp, Math.PI, 0); else c.arc(X((2 * j + 1) * RW), Y(g.yM), rp, 0, Math.PI); c.stroke(); });
        badges.forEach((b, i) => {
          const by = b.y + (i % 2 ? 10 : -10);
          c.fillStyle = theme.surface; c.beginPath(); c.arc(b.x, by, 8, 0, TAU); c.fill(); c.strokeStyle = theme.c3; c.lineWidth = 2; c.stroke();
          K.text(c, String(i + 1), b.x, by + 0.5, { font: 'bold 10px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        });
        // load
        const bw = 0.95 * g.pxm, bh = 0.5 * g.pxm, bxp = X(sys.xl) - bw / 2, byp = Y(boxTop);
        c.fillStyle = CRATE; c.fillRect(bxp, byp, bw, bh); c.strokeStyle = CRATE_EDGE; c.lineWidth = 2; c.strokeRect(bxp + 1, byp + 1, bw - 2, bh - 2);
        const lg = Math.min(aLen(q.Gw), h - 5 - (byp + bh));
        if (lg > 6) K.arrow(c, X(sys.xl), byp + bh, X(sys.xl), byp + bh + lg, { color: theme.c8, width: 3, head: 8 });
        label(c, 'G = ' + N(q.Gw, 0) + ' N', X(sys.xl), byp + bh / 2, { align: 'center', size: 10, bold: true, maxX: g.sceneW });
        // hand on the free rope end
        const dir = sys.up ? -1 : 1, hy = g.hy;
        c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.arc(g.xHand, hy, 7, 0, TAU); c.stroke();
        c.fillStyle = SKIN; c.beginPath(); c.arc(g.xHand, hy + dir * 12, 8, 0, TAU); c.fill(); c.strokeStyle = CRATE_EDGE; c.lineWidth = 1; c.stroke();
        const lf = Math.max(8, Math.min(aLen(q.F), sys.up ? hy - 28 : g.floorY + 14 - (hy + 24)));
        K.arrow(c, g.xHand, hy + dir * 24, g.xHand, hy + dir * (24 + lf), { color: theme.c1, width: 3, head: 9 });
        label(c, 'F = ' + N(q.F, 1) + ' N', g.xHand + 12, Math.max(12, hy + dir * 30), { bold: true, maxX: g.sceneW });
        K.text(c, T({ en: 'Drag the rope end', hr: 'Povuci kraj užeta' }), 8, h - 7, { font: '11px ' + theme.font, color: theme.fg });
        // panel: formulas and the two work rectangles
        const px = g.sceneW + 8, pw = w - px - 8, n = sys.n;
        const arr = [T(sys.label), n === 1 ? T({ en: '1 rope segment holds the load', hr: '1 dio užeta drži teret' }) : n + T({ en: ' rope segments hold the load', hr: ' dijela užeta drže teret' })];
        if (st.real) arr.push('F = 1,1 · (G + G_k) / n'.replace(',', lang === 'hr' ? ',' : '.'), '= ' + N(1.1, 1) + ' · (' + N(q.Gw, 0) + ' + ' + N(q.Gb, 1) + ') / ' + n + ' = ' + N(q.F, 1) + ' N');
        else arr.push('F = G / n = ' + N(q.Gw, 0) + ' N / ' + n + ' = ' + N(q.F, 1) + ' N');
        arr.push('h = s / n = ' + N(st.s, 2) + ' m / ' + n + ' = ' + N(q.h, 2) + ' m');
        const y = lines(c, arr, px, 16, pw);
        workBoxes(c, px, y, pw, h - y - 8,
          { F: q.F, d: st.s, color: theme.c1, title: T({ en: 'You: F × s (rope pulled)', hr: 'Ti: F × s (povučeno uže)' }) },
          { F: q.Gw, d: q.h, color: theme.c2, title: T({ en: 'Load: G × h (raised)', hr: 'Teret: G × h (podignut)' }) }, SMAX);
      }

      // ---------- (b) inclined plane ----------
      function drawRamp(c, w, h) {
        const g = rampGeom(), q = g.q, x0 = g.x0, gy = g.groundY, cs = g.cs, cx = g.ccx, cy = g.ccy;
        c.fillStyle = theme.ground; c.fillRect(0, gy, g.sw, g.sh - gy);
        c.fillStyle = K.withAlpha(theme.muted, 0.4); c.beginPath(); c.moveTo(x0, gy); c.lineTo(g.xr, g.yt); c.lineTo(g.xr, gy); c.closePath(); c.fill();
        c.strokeStyle = st.mu === 'wood' ? CRATE_EDGE : theme.fg; c.lineWidth = st.mu === 'wood' ? 4 : 2; c.beginPath(); c.moveTo(x0, gy); c.lineTo(g.xr, g.yt); c.stroke();
        c.strokeStyle = theme.fg; c.lineWidth = 1; c.beginPath(); c.arc(x0, gy, 30, -q.alpha, 0); c.stroke();
        // lifting straight up, for comparison
        if (gy - g.yt > 16) { c.setLineDash([4, 4]); K.arrow(c, g.xr + 14, gy, g.xr + 14, g.yt, { color: K.withAlpha(theme.fg, 0.6), width: 2, head: 8 }); c.setLineDash([]); }
        label(c, 'h = ' + N(q.h, 1) + ' m', g.xr + 24, (gy + g.yt) / 2, { size: 11, maxX: g.sw });
        label(c, 'l', (x0 + g.xr) / 2 + 12 * q.sin, (gy + g.yt) / 2 + 12 * q.cos, { align: 'center', size: 11, bold: true, bg: false });
        // crate
        c.save(); c.translate(cx, cy); c.rotate(-q.alpha); crate(c, -cs / 2, -cs / 2, cs);
        if (st.mu === 'wheels') { c.fillStyle = theme.fg; [-cs / 3, cs / 3].forEach(dx => { c.beginPath(); c.arc(dx, cs / 2, 4, 0, TAU); c.fill(); }); }
        c.restore();
        // weight and its two components, push and friction
        const sc = g.Lg / q.Gw;
        const gt = { x: cx, y: cy + q.Gw * sc }, pt = { x: cx - q.cos * q.Fpar * sc, y: cy + q.sin * q.Fpar * sc }, nt = { x: cx + q.sin * q.Fperp * sc, y: cy + q.cos * q.Fperp * sc };
        c.setLineDash([3, 3]); c.strokeStyle = K.withAlpha(theme.fg, 0.55); c.lineWidth = 1; c.beginPath(); c.moveTo(pt.x, pt.y); c.lineTo(gt.x, gt.y); c.lineTo(nt.x, nt.y); c.stroke(); c.setLineDash([]);
        K.arrow(c, cx, cy, pt.x, pt.y, { color: theme.c7, width: 2.5, head: 8 });
        K.arrow(c, cx, cy, nt.x, nt.y, { color: theme.c7, width: 2.5, head: 8 });
        K.arrow(c, cx, cy, gt.x, gt.y, { color: theme.c8, width: 3, head: 9 });
        const ft = { x: cx + q.cos * q.F * sc, y: cy - q.sin * q.F * sc };
        K.arrow(c, cx, cy, ft.x, ft.y, { color: theme.c1, width: 3, head: 9 });
        if (q.Ffr * sc > 3) {
          const bx = cx + cs / 2 * q.sin, by = cy + cs / 2 * q.cos;
          K.arrow(c, bx, by, bx - q.cos * q.Ffr * sc, by + q.sin * q.Ffr * sc, { color: theme.c2, width: 3, head: 8 });
          label(c, T({ en: 'F_fr', hr: 'F_tr' }), bx - q.cos * q.Ffr * sc - 6, by + q.sin * q.Ffr * sc + 12, { align: 'right', size: 10, maxX: g.sw });
        }
        label(c, 'G∥', pt.x - 8, pt.y - 5, { align: 'right', size: 10, maxX: g.sw });
        label(c, 'G⊥', nt.x + 8, nt.y - 5, { size: 10, maxX: g.sw });
        label(c, 'G = ' + N(q.Gw, 0) + ' N', gt.x, Math.min(g.sh - 10, gt.y + 12), { align: 'center', size: 11, maxX: g.sw });
        label(c, 'F = ' + N(q.F, 1) + ' N', ft.x + 8, Math.max(58, ft.y - 10), { bold: true, maxX: g.sw });
        lines(c, [T({ en: 'Inclined plane: less force, longer way', hr: 'Kosina: manja sila, dulji put' }),
          'l = ' + N(q.l, 1) + ' m · h = ' + N(q.h, 1) + ' m · α = ' + N(q.alpha * 180 / Math.PI, 1) + '° · ' + T({ en: 'drag the crate', hr: 'povuci sanduk' })], 10, 16, g.sw - 20);
        // panel
        const arr = ['F = G · h / l' + (q.mu > 0 ? ' + μ · G⊥' : ''), 'G = ' + N(q.Gw, 0) + ' N,  G∥ = G · h / l = ' + N(q.Fpar, 1) + ' N'];
        if (q.mu > 0) arr.push('G⊥ = ' + N(q.Fperp, 0) + ' N,  ' + T({ en: 'F_fr', hr: 'F_tr' }) + ' = μ · G⊥ = ' + N(q.Ffr, 1) + ' N');
        arr.push(T({ en: 'Along the ramp: F = ', hr: 'Uz kosinu: F = ' }) + N(q.F, 1) + ' N', T({ en: 'Straight up: G = ', hr: 'Ravno uvis: G = ' }) + N(q.Gw, 0) + ' N');
        const a = { F: q.F, d: q.l, color: theme.c1, title: T({ en: 'Up the ramp: F × l', hr: 'Uz kosinu: F × l' }) };
        const b = { F: q.Gw, d: q.h, color: theme.c2, title: T({ en: 'Straight up: G × h', hr: 'Ravno uvis: G × h' }) };
        if (g.wide) { const px = g.sw + 8, pw = w - px - 8, y = lines(c, arr, px, 16, pw); workBoxes(c, px, y, pw, h - y - 8, a, b, 10); }
        else { const half = w / 2 - 12; lines(c, arr, 8, g.sh + 12, half); workBoxes(c, w / 2 + 4, g.sh + 2, half, h - g.sh - 8, a, b, 10); }
      }

      // ---------- (c) wheel and axle ----------
      function drawWind(c, w, h) {
        const g = windGeom(), q = g.q, cx = g.cx, cy = g.cy, rp = Math.max(3, st.r * g.k), Rp = st.R * g.k;
        const sx0 = cx - 24, sx1 = cx + 46, yDeep = h - 48, xr = cx + rp, yb = yDeep - q.rise / WELL * (yDeep - g.gY);
        // ground, shaft of the well, water
        c.fillStyle = theme.ground; c.fillRect(0, g.gY, g.sceneW, h - g.gY);
        c.fillStyle = theme.sky; c.fillRect(sx0, g.gY, sx1 - sx0, h - g.gY - 6);
        c.fillStyle = K.withAlpha(theme.fg, 0.16); c.fillRect(sx0, g.gY, sx1 - sx0, h - g.gY - 6);
        c.fillStyle = theme.water; c.fillRect(sx0, yDeep + 14, sx1 - sx0, h - 6 - yDeep - 14);
        c.fillStyle = theme.muted; c.fillRect(sx0 - 8, g.gY - 12, 8, 12); c.fillRect(sx1, g.gY - 12, 8, 12); c.fillRect(cx - 4, cy, 8, g.gY - cy);
        c.strokeStyle = theme.muted; c.lineWidth = 1;
        for (let d = 0; d <= WELL; d++) {
          const y = g.gY + d / WELL * (yDeep - g.gY);
          c.beginPath(); c.moveTo(sx1 - 6, y); c.lineTo(sx1, y); c.stroke();
          K.text(c, N(d, 0) + ' m', sx1 + 12, y, { font: '10px ' + theme.font, color: theme.fg, baseline: 'middle' });
        }
        // rope and bucket
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.moveTo(xr, cy); c.lineTo(xr, yb - 8); c.lineTo(xr - 11, yb); c.moveTo(xr, yb - 8); c.lineTo(xr + 11, yb); c.stroke();
        c.fillStyle = theme.muted; c.beginPath(); c.moveTo(xr - 11, yb); c.lineTo(xr + 11, yb); c.lineTo(xr + 8, yb + 22); c.lineTo(xr - 8, yb + 22); c.closePath(); c.fill();
        c.fillStyle = theme.water; c.fillRect(xr - 10, yb + 1, 20, 4);
        // drum, crank and handle
        c.setLineDash([3, 5]); c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, Rp, 0, TAU); c.stroke(); c.setLineDash([]);
        c.fillStyle = CRATE; c.beginPath(); c.arc(cx, cy, rp, 0, TAU); c.fill(); c.strokeStyle = CRATE_EDGE; c.lineWidth = 2; c.stroke();
        c.strokeStyle = theme.fg; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(g.hx, g.hy); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = theme.fg; c.beginPath(); c.arc(cx, cy, 3.5, 0, TAU); c.fill();
        c.fillStyle = theme.c1; c.beginPath(); c.arc(g.hx, g.hy, 8, 0, TAU); c.fill();
        // forces
        const lf = aLen(q.F), tx = Math.sin(g.phi), ty = -Math.cos(g.phi);
        K.arrow(c, g.hx, g.hy, g.hx + lf * tx, g.hy + lf * ty, { color: theme.c1, width: 3, head: 9 });
        const lg = Math.min(aLen(q.Gw), h - 6 - (yb + 22));
        if (lg > 6) K.arrow(c, xr, yb + 22, xr, yb + 22 + lg, { color: theme.c8, width: 3, head: 8 });
        label(c, 'R', (cx + g.hx) / 2 + 9 * tx, (cy + g.hy) / 2 + 9 * ty, { align: 'center', size: 11, bold: true });
        label(c, 'r', cx - rp - 10, cy + 12, { align: 'center', size: 11, bold: true });
        label(c, 'F = ' + N(q.F, 1) + ' N', g.hx + lf * tx + 8, K.clamp(g.hy + lf * ty, 44, h - 12), { bold: true, maxX: g.sceneW });
        label(c, 'G = ' + N(q.Gw, 0) + ' N', sx0 - 12, yb + 12, { align: 'right', size: 11, maxX: g.sceneW });
        K.text(c, T({ en: 'windlass shown enlarged', hr: 'vitlo je prikazano uvećano' }), 8, 12, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
        K.text(c, T({ en: 'turns: ', hr: 'broj okretaja: ' }) + N(q.turns, 2), 8, 27, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(c, T({ en: 'Drag the handle round', hr: 'Vrti ručku' }), 8, h - 7, { font: '11px ' + theme.font, color: theme.fg });
        // panel
        const px = g.sceneW + 8, pw = w - px - 8;
        const y = lines(c, [T({ en: 'Wheel and axle: F · R = G · r', hr: 'Vitlo: F · R = G · r' }),
          'F = G · r / R = ' + N(q.Gw, 0) + ' · ' + N(st.r, 0) + ' / ' + N(st.R, 0) + ' = ' + N(q.F, 1) + ' N',
          T({ en: 'One turn: handle 2πR = ', hr: 'Jedan okret: ručka 2πR = ' }) + N(TAU * q.R, 2) + ' m',
          T({ en: 'bucket rises 2πr = ', hr: 'vjedro se digne 2πr = ' }) + N(q.per, 2) + ' m'], px, 16, pw);
        workBoxes(c, px, y, pw, h - y - 8,
          { F: q.F, d: q.dIn, color: theme.c1, title: T({ en: 'You: F × path of the hand', hr: 'Ti: F × put ruke' }) },
          { F: q.Gw, d: q.rise, color: theme.c2, title: T({ en: 'Bucket: G × height', hr: 'Vjedro: G × visina' }) }, Math.max(WELL, WELL * q.R / q.r));
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'pulleys') drawPulleys(c, w, h); else if (st.mode === 'ramp') drawRamp(c, w, h); else drawWind(c, w, h);
      }

      // ---------- lifecycle ----------
      function reset() {
        L.stop(); Object.assign(st, defaults()); drag = null;
        segMode.set('pulleys'); selSys.set('fixed'); slMass.set(20); tgReal.set(false);
        slL.set(5); slH.set(1); slMc.set(50); selMu.set('none'); slR.set(40); slr.set(10); slMb.set(10); syncSliders();
        showControls(); updatePlay(); refresh();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() {
          L.destroy(); window.removeEventListener('pointerup', onUp);
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          cv.canvas.removeEventListener('pointerup', onUp); cv.canvas.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; refresh(); },
        reset
      };
    }
  });
})();
