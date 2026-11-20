/* FizLab sim: Electromagnetic induction — a magnet moved through a coil (galvanometer, bulb, U–t graph), a generator and an electric motor. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2;
  const COPPER = '#c17a3a', IRON = '#8e959e';
  const TURNS = [100, 200, 400];
  const B_WEAK = 0.02, B_STRONG = 0.05;      // T: field of the magnet in the middle of the coil
  const AREA = 7e-4;                         // m²: cross-section of the coil (radius 1.5 cm)
  const BELL_A = 0.05;                       // m: width of the bell-shaped B(x)
  const X_MIN = -0.26, X_MAX = 0.10;         // m: range of the magnet centre (coil centre = 0)
  const AUTO_C = -0.105, AUTO_AMP = 0.105;   // m: "move by itself" swings between x = −0.21 m and the middle of the coil
  const GEN_K = 0.006;                       // V per turn of wire per (turn/s): 200 turns at 5 turns/s give a 6 V peak (bicycle dynamo)
  const GEN_R = 12;                          // Ω: bulb on the generator
  const MOT_R = 6, MOT_K = 39, MOT_B = 1.5;  // motor: coil resistance (Ω), torque per ampere and friction (model units)
  const DEF = { turns: 200, strong: false, pole: 1, auto: false, vAuto: 0.4, drive: 'crank', f: 2, U: 4.5, bat: 1, mag: 1, closed: true };
  const DRIVES = [
    { value: 'crank', label: { en: 'hand crank', hr: 'ručica' } },
    { value: 'water', label: { en: 'water wheel', hr: 'vodeno kolo' } },
    { value: 'wind', label: { en: 'wind turbine', hr: 'vjetroturbina' } }
  ];
  const NOTES = {
    rest: { en: 'Magnet at rest: no voltage, however strong it is. Only a CHANGING magnetic field through the coil induces a voltage.',
      hr: 'Magnet miruje: nema napona, koliko god bio jak. Napon se inducira samo dok se magnetsko polje kroz zavojnicu MIJENJA.' },
    move: { en: 'Faster change → higher voltage. More turns and a stronger magnet help too. The voltage reverses when the motion or the pole reverses.',
      hr: 'Brža promjena → veći napon. Pomažu i veći broj zavoja i jači magnet. Napon mijenja smjer kad se promijeni smjer gibanja ili kad se magnet okrene drugim polom.' },
    gen: { en: 'The turning magnet keeps changing the field through the coil, so the voltage alternates. Faster turning → higher voltage AND higher frequency. This is how power stations and bicycle dynamos work.',
      hr: 'Magnet koji se vrti stalno mijenja polje kroz zavojnicu pa je napon izmjeničan. Brža vrtnja → veći napon I veća frekvencija. Na tom načelu rade generatori u elektranama i dinamo na biciklu.' },
    motor: { en: 'The magnetic field pushes the two sides of the coil in opposite directions, so it turns; the commutator swaps the current every half turn. A motor is a generator run backwards: electrical energy → kinetic energy.',
      hr: 'Magnetsko polje gura dvije strane zavojnice u suprotnim smjerovima pa se ona vrti; komutator svakih pola okreta promijeni smjer struje. Elektromotor radi obrnuto od generatora: električna energija → kinetička energija.' },
    motor0: { en: 'No current, no force: close the switch and raise the voltage. A motor is a generator run backwards: electrical energy → kinetic energy.',
      hr: 'Nema struje, nema sile: zatvori prekidač i povećaj napon. Elektromotor radi obrnuto od generatora: električna energija → kinetička energija.' }
  };
  const bell = x => Math.pow(1 + (x / BELL_A) * (x / BELL_A), -1.5);
  const nz = (v, d) => { const p = Math.pow(10, d); return Math.round(v * p) / p + 0; };   // rounded, never "−0"

  window.Sims.register({
    id: 'induction',
    title: { en: 'Electromagnetic Induction', hr: 'Elektromagnetska indukcija' },
    summary: {
      en: 'Move a magnet into a coil and watch the galvanometer, turn a generator to make alternating voltage, then run an electric motor from a battery.',
      hr: 'Uguraj magnet u zavojnicu i prati galvanometar, vrti generator da dobiješ izmjenični napon, a zatim pokreni elektromotor pomoću baterije.'
    },
    tasks: [
      { en: 'Hold the magnet still inside the coil. Is there a voltage? Now pull it out quickly, then slowly.', hr: 'Drži magnet mirno u zavojnici. Postoji li napon? Zatim ga izvuci brzo, a onda polako.' },
      { en: 'Switch on "Move by itself" and change the number of turns from 100 to 400. What happens to the highest voltage?', hr: 'Uključi „Giba se sam“ i promijeni broj zavoja sa 100 na 400. Što se dogodi s najvećim naponom?' },
      { en: 'In "Generator" double the rotation speed. What happens to the peak voltage and to the frequency?', hr: 'U pokusu „Generator“ udvostruči brzinu vrtnje. Što se dogodi s vršnim naponom, a što s frekvencijom?' },
      { en: 'In "Electric motor" press "Reverse battery", then "Swap magnets". Which way does the coil turn each time?', hr: 'U pokusu „Elektromotor“ pritisni „Okreni bateriju“, a zatim „Zamijeni magnete“. Na koju se stranu svaki put vrti zavojnica?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 300, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'magnet', turns: DEF.turns, strong: DEF.strong, pole: DEF.pole, auto: DEF.auto, vAuto: DEF.vAuto,
        x: -0.2, tx: -0.2, v: 0, U: 0, fluxPrev: null, xPrev: -0.2, phase: 0, drag: false, off: 0, hint: true, rest: 1, noteKey: '',
        t: 0, lastS: -1, pts: [], drive: DEF.drive, f: DEF.f, th: 0.6, Ug: 0, glowP: 0,
        Um: DEF.U, bat: DEF.bat, mag: DEF.mag, closed: DEF.closed, om: 0, ang: 0.5 };
      let geoA = null, geoC = null;

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Experiment', hr: 'Pokus' }, options: [
        { value: 'magnet', label: { en: 'Magnet and coil', hr: 'Magnet i zavojnica' } },
        { value: 'generator', label: { en: 'Generator', hr: 'Generator' } },
        { value: 'motor', label: { en: 'Electric motor', hr: 'Elektromotor' } }], value: 'magnet',
        onChange: v => { st.mode = v; applyMode(); clearGraph(); refresh(); } });
      const segTurns = C.segmented({ label: { en: 'Number of turns', hr: 'Broj zavoja' }, options: TURNS.map(n => ({ value: String(n), label: String(n) })), value: String(DEF.turns),
        onChange: v => { st.turns = parseInt(v, 10); st.fluxPrev = null; refresh(); } });
      const segStr = C.segmented({ label: { en: 'Magnet', hr: 'Magnet' }, options: [
        { value: 'weak', label: { en: 'weak', hr: 'slab' } }, { value: 'strong', label: { en: 'strong', hr: 'jak' } }], value: 'weak',
        onChange: v => { st.strong = v === 'strong'; st.fluxPrev = null; refresh(); } });
      const btnFlip = C.button({ label: { en: 'Flip magnet', hr: 'Okreni magnet' }, onClick: () => { st.pole = -st.pole; st.fluxPrev = null; refresh(); } });
      const tgAuto = C.toggle({ label: { en: 'Move by itself', hr: 'Giba se sam' }, value: DEF.auto, onChange: v => {
        st.auto = v; st.fluxPrev = null;
        if (v) { st.hint = false; st.phase = Math.acos(K.clamp((AUTO_C - st.x) / AUTO_AMP, -1, 1)); if (!L.running) { L.start(); updatePlay(); } }
        else st.tx = st.x;
        refresh(); } });
      const slAuto = C.slider({ label: { en: 'Speed of the motion', hr: 'Brzina gibanja' }, min: 0.1, max: 1, step: 0.05, value: DEF.vAuto, unit: 'm/s', digits: 2, onChange: v => { st.vAuto = v; } });
      const selDrive = C.select({ label: { en: 'Turned by', hr: 'Pokreće ga' }, options: DRIVES, value: DEF.drive, onChange: v => { st.drive = v; refresh(); } });
      const slF = C.slider({ label: { en: 'Rotation speed', hr: 'Brzina vrtnje' }, min: 0, max: 5, step: 0.1, value: DEF.f, unit: { en: 'turns/s', hr: 'okr/s' }, digits: 1, onChange: v => { st.f = v; refresh(); } });
      const slU = C.slider({ label: { en: 'Battery voltage U', hr: 'Napon baterije U' }, min: 0, max: 9, step: 0.5, value: DEF.U, unit: 'V', digits: 1, onChange: v => { st.Um = v; refresh(); } });
      const tgSwitch = C.toggle({ label: { en: 'Switch closed', hr: 'Prekidač zatvoren' }, value: DEF.closed, onChange: v => { st.closed = v; refresh(); } });
      const btnBat = C.button({ label: { en: 'Reverse battery', hr: 'Okreni bateriju' }, onClick: () => { st.bat = -st.bat; btnBat.setActive(st.bat < 0); refresh(); } });
      const btnMag = C.button({ label: { en: 'Swap magnets', hr: 'Zamijeni magnete' }, onClick: () => { st.mag = -st.mag; btnMag.setActive(st.mag < 0); refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Ispočetka' }, onClick: () => reset() });
      const outU = C.readout({ label: { en: 'Induced voltage U', hr: 'Inducirani napon U' }, unit: 'mV', digits: 0 });
      const outV = C.readout({ label: { en: 'Speed of the magnet', hr: 'Brzina magneta' }, unit: 'm/s', digits: 2 });
      const outN = C.readout({ label: { en: 'Turns of the coil', hr: 'Broj zavoja' }, digits: 0 });
      const outF = C.readout({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, unit: 'Hz', digits: 1 });
      const outPk = C.readout({ label: { en: 'Peak voltage', hr: 'Vršni napon' }, unit: 'V', digits: 1 });
      const outPg = C.readout({ label: { en: 'Mean power of the bulb', hr: 'Srednja snaga žaruljice' }, unit: 'W', digits: 2 });
      const outI = C.readout({ label: { en: 'Current I', hr: 'Jakost struje I' }, unit: 'A', digits: 2 });
      const outW = C.readout({ label: { en: 'Rotation speed', hr: 'Brzina vrtnje' }, unit: { en: 'turns/s', hr: 'okr/s' }, digits: 1 });
      const outDir = C.readout({ label: { en: 'Direction of rotation', hr: 'Smjer vrtnje' } });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const a = st.mode === 'magnet', b = st.mode === 'generator', m = st.mode === 'motor';
        [segStr, btnFlip, tgAuto, slAuto, outU, outV].forEach(x => show(x, a));
        [segTurns, outN].forEach(x => show(x, a || b));
        [selDrive, slF, outF, outPk, outPg].forEach(x => show(x, b));
        [slU, tgSwitch, btnBat, btnMag, outI, outW, outDir].forEach(x => show(x, m));
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function setNote(key) { if (st.noteKey !== key) { st.noteKey = key; note.set(NOTES[key]); } }
      function clearGraph() { st.pts = []; st.t = 0; st.lastS = -1; st.fluxPrev = null; st.U = 0; st.v = 0; st.rest = 1; st.glowP = 0; }
      function motorI() { return st.closed ? st.Um / MOT_R : 0; }
      function updateOut() {
        if (st.mode === 'magnet') {
          outU.set(nz(st.U * 1000, 0)); outV.set(Math.abs(st.v)); outN.set(st.turns);
          setNote(st.rest >= 0.6 ? 'rest' : 'move');
        } else if (st.mode === 'generator') {
          const U0 = GEN_K * st.turns * st.f;
          outF.set(st.f); outPk.set(U0); outPg.set(U0 * U0 / (2 * GEN_R)); outN.set(st.turns); setNote('gen');
        } else {
          const I = motorI();
          outI.set(I); outW.set(Math.abs(st.om) / TAU);
          outDir.set(Math.abs(st.om) < 0.3 ? { en: 'at rest', hr: 'miruje' } : (st.om > 0 ? { en: 'anticlockwise', hr: 'suprotno od kazaljke na satu' } : { en: 'clockwise', hr: 'u smjeru kazaljke na satu' }));
          setNote(I > 0 ? 'motor' : 'motor0');
        }
      }
      function refresh() { updateOut(); draw(); }
      function reset() {
        Object.assign(st, { turns: DEF.turns, strong: DEF.strong, pole: DEF.pole, auto: DEF.auto, vAuto: DEF.vAuto, x: -0.2, tx: -0.2, xPrev: -0.2, phase: 0, drag: false, hint: true,
          drive: DEF.drive, f: DEF.f, th: 0.6, Ug: 0, Um: DEF.U, bat: DEF.bat, mag: DEF.mag, closed: DEF.closed, om: 0, ang: 0.5 });
        segTurns.set(String(DEF.turns)); segStr.set('weak'); tgAuto.set(DEF.auto); slAuto.set(DEF.vAuto); selDrive.set(DEF.drive); slF.set(DEF.f);
        slU.set(DEF.U); tgSwitch.set(DEF.closed); btnBat.setActive(false); btnMag.setActive(false);
        clearGraph(); refresh();
      }

      // ---- physics ----
      function flux() { return st.pole * st.turns * (st.strong ? B_STRONG : B_WEAK) * AREA * bell(st.x); }   // Wb, through all turns
      function stepA(dt) {
        if (dt <= 0) return;
        if (st.auto && !st.drag) { st.phase += dt * st.vAuto / AUTO_AMP; st.x = AUTO_C - AUTO_AMP * Math.cos(st.phase); st.tx = st.x; }
        else st.x += (st.tx - st.x) * Math.min(1, dt / 0.035);
        const fl = flux();
        if (st.fluxPrev === null) { st.U = 0; st.v = 0; }
        else {
          const k = Math.min(1, dt / 0.05);                  // light smoothing of the pointer motion
          st.U += (-(fl - st.fluxPrev) / dt - st.U) * k;     // U = −ΔΦ/Δt
          st.v += ((st.x - st.xPrev) / dt - st.v) * k;
        }
        st.fluxPrev = fl; st.xPrev = st.x;
        st.rest = Math.abs(st.v) > 0.012 ? 0 : st.rest + dt;
        st.t += dt;
        if (st.t - st.lastS >= 0.03) { st.lastS = st.t; st.pts.push([st.t, st.U * 1000]); if (st.pts.length > 400) st.pts.shift(); }
      }
      function stepB(dt) {
        if (dt <= 0) return;
        const om = TAU * st.f, U0 = GEN_K * st.turns * st.f, n = Math.max(1, Math.round(dt / 0.006));
        for (let i = 1; i <= n; i++) st.pts.push([st.t + dt * i / n, U0 * Math.sin(st.th + om * dt * i / n)]);   // U = Φ₀·ω·sin(ωt)
        while (st.pts.length > 520) st.pts.shift();
        st.th = (st.th + om * dt) % TAU; st.t += dt;
        st.Ug = U0 * Math.sin(st.th);
        st.glowP += (st.Ug * st.Ug / GEN_R - st.glowP) * Math.min(1, dt / 0.08);   // the filament follows the power with a short delay
      }
      function stepC(dt) {
        const tq = MOT_K * motorI() * st.bat * st.mag * Math.max(Math.abs(Math.cos(st.ang)), 0.15);
        st.om += (tq - MOT_B * st.om) * dt;
        st.ang = (st.ang + st.om * dt) % TAU;
      }

      // ---- drawing helpers ----
      function polyline(c, pts, color, width) {
        c.save(); c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round';
        c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
      }
      function drawBulb(c, x, y, r, glow) {
        c.save();
        if (glow > 0.02) {
          const R = r + 6 + 22 * glow, grd = c.createRadialGradient(x, y, r * 0.6, x, y, R);
          grd.addColorStop(0, K.withAlpha(theme.c4, 0.8 * glow)); grd.addColorStop(1, K.withAlpha(theme.c4, 0));
          c.fillStyle = grd; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill();
        }
        c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = theme.surface; c.fill();
        if (glow > 0.02) { c.fillStyle = K.withAlpha(theme.c4, 0.2 + 0.75 * glow); c.fill(); }
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.stroke();
        c.strokeStyle = glow > 0.05 ? theme.fg : theme.muted; c.lineWidth = 1.5; c.lineJoin = 'round';
        const f = r * 0.45;
        c.beginPath(); c.moveTo(x - f, y + f); c.lineTo(x - f * 0.5, y - f * 0.3); c.lineTo(x, y + f * 0.3); c.lineTo(x + f * 0.5, y - f * 0.3); c.lineTo(x + f, y + f); c.stroke();
        c.restore();
      }
      function drawBar(c, x, y, len, wid, ang, pole) {   // bar magnet; pole = +1 puts N at the +x end (before rotating)
        c.save(); c.translate(x, y); c.rotate(ang);
        c.fillStyle = pole > 0 ? theme.c1 : theme.c8; c.fillRect(-len / 2, -wid / 2, len / 2, wid);
        c.fillStyle = pole > 0 ? theme.c8 : theme.c1; c.fillRect(0, -wid / 2, len / 2, wid);
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.strokeRect(-len / 2, -wid / 2, len, wid);
        c.restore();
        const f = 'bold ' + Math.round(K.clamp(wid * 0.62, 10, 18)) + 'px ' + theme.fontDisplay, dx = Math.cos(ang) * len * 0.27, dy = Math.sin(ang) * len * 0.27;
        K.text(c, pole > 0 ? 'N' : 'S', x + dx, y + dy + 1, { font: f, color: '#ffffff', align: 'center', baseline: 'middle' });
        K.text(c, pole > 0 ? 'S' : 'N', x - dx, y - dy + 1, { font: f, color: '#ffffff', align: 'center', baseline: 'middle' });
      }
      function coilLoops(c, x0, len, y, ry, from, to, alpha) {
        const n = st.turns === 100 ? 6 : st.turns === 200 ? 10 : 16, pitch = len / n;
        c.save(); c.strokeStyle = K.withAlpha(COPPER, alpha); c.lineWidth = K.clamp(pitch * 0.42, 1.2, 2.6);
        for (let i = 0; i < n; i++) { c.beginPath(); c.ellipse(x0 + (i + 0.5) * pitch, y, Math.max(2, Math.min(7, pitch * 0.42)), ry, 0, from, to); c.stroke(); }
        c.restore();
      }
      function drawGalv(c, x, y, r, frac) {   // centre-zero meter, frac = −1…1
        const py = y + r * 0.42, nl = r * 1.05, a = frac * 0.84;
        c.save();
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; c.beginPath();
        for (let k = -2; k <= 2; k++) { const s = Math.sin(k * 0.42), co = Math.cos(k * 0.42); c.moveTo(x + s * nl * 0.86, py - co * nl * 0.86); c.lineTo(x + s * nl, py - co * nl); }
        c.stroke();
        c.strokeStyle = theme.c8; c.lineWidth = 2.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, py); c.lineTo(x + Math.sin(a) * nl * 0.95, py - Math.cos(a) * nl * 0.95); c.stroke();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(x, py, 2.5, 0, TAU); c.fill();
        c.restore();
        const f = 'bold 11px ' + theme.font;
        K.text(c, '−', x - r * 0.62, y + r * 0.34, { font: f, color: theme.muted, align: 'center', baseline: 'middle' });
        K.text(c, '+', x + r * 0.62, y + r * 0.34, { font: f, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function header(c, a, b) {
        K.text(c, a, 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, b, 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }

      // ---- (a) magnet and coil ----
      function layA(S) {
        const ay = S.y + Math.max(74, S.h * 0.36), cx = S.x + S.w * 0.64;
        const cr = K.clamp(S.h * 0.11, 18, 40), cl = K.clamp(S.w * 0.2, 56, 120), ml = K.clamp(S.w * 0.24, 64, 150);
        const gr = K.clamp(S.h * 0.13, 20, 40), gx = cx - gr * 1.5, bx = cx + gr * 1.7;
        return { ay, cx, cr, cl, ml, mh: cr * 1.1, pxm: (cx - S.x - ml / 2 - 6) / -X_MIN, yb: S.y + S.h - Math.max(34, S.h * 0.16),
          gr, gx, bx, br: Math.max(9, gr * 0.45), xl: gx - gr - 10, xr: bx + gr * 0.45 + 16 };
      }
      function drawA(c, S) {
        const g = layA(S); geoA = g;
        const mx = g.cx + st.x * g.pxm, Bf = (st.strong ? 1 : B_WEAK / B_STRONG) * bell(st.x), UmV = nz(st.U * 1000, 0);
        const x1 = g.cx - g.cl / 2, x2 = g.cx + g.cl / 2, y1 = g.ay + g.cr, y2 = y1 + 12;
        polyline(c, [[x1, y1], [x1, y2], [g.xl, y2], [g.xl, g.yb], [g.xr, g.yb], [g.xr, y2], [x2, y2], [x2, y1]], COPPER, 3);
        c.fillStyle = K.withAlpha(theme.c3, 0.06 + 0.5 * Bf); c.fillRect(x1, g.ay - g.cr, g.cl, 2 * g.cr);   // tint = field through the coil
        coilLoops(c, x1, g.cl, g.ay, g.cr, -Math.PI / 2, Math.PI / 2, 0.5);
        drawBar(c, mx, g.ay, g.ml, g.mh, 0, st.pole);
        coilLoops(c, x1, g.cl, g.ay, g.cr, Math.PI / 2, Math.PI * 1.5, 0.9);
        K.text(c, st.turns + ' ' + K.tr({ en: 'turns', hr: 'zavoja' }, lang), x2 + 6, g.ay - g.cr - 5, { font: '11px ' + theme.font, color: theme.muted });
        if (Math.abs(st.v) > 0.02) K.arrow(c, mx, g.ay - g.cr - 9, mx + K.clamp(st.v * 90, -80, 80), g.ay - g.cr - 9, { color: theme.c2, width: 3, head: 9 });
        if (st.hint && !st.auto) K.text(c, '← ' + K.tr({ en: 'drag the magnet', hr: 'povuci magnet' }, lang) + ' →', Math.max(mx, 70), g.ay + g.mh / 2 + 16, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        drawGalv(c, g.gx, g.yb, g.gr, Math.sign(st.U) * Math.sqrt(Math.min(1, Math.abs(st.U) * 1000 / 400)));
        drawBulb(c, g.bx, g.yb, g.br, 1 - Math.exp(-Math.pow(st.U * 1000 / 60, 2)));
        K.text(c, 'U = ' + K.fmt(UmV, 0, lang) + ' mV', g.xl - 8, g.yb, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        if (Math.abs(UmV) >= 2) {   // direction of the induced current
          const s = Math.sign(UmV), xm = (g.gx + g.gr + g.bx - g.br) / 2;
          K.arrow(c, xm - 11 * s, g.yb + 11, xm + 11 * s, g.yb + 11, { color: theme.c2, width: 2.5, head: 8 });
        }
        header(c, K.tr({ en: 'Induced voltage: ', hr: 'Inducirani napon: ' }, lang) + K.fmt(UmV, 0, lang) + ' mV',
          K.tr(st.strong ? { en: 'Strong magnet', hr: 'Jak magnet' } : { en: 'Weak magnet', hr: 'Slab magnet' }, lang) + K.tr({ en: ' · field through the coil: ', hr: ' · polje kroz zavojnicu: ' }, lang) +
          K.fmt(Bf * 100, 0, lang) + ' % ' + K.tr(st.rest < 0.6 ? { en: '(changing)', hr: '(mijenja se)' } : { en: '(steady)', hr: '(stalno)' }, lang));
      }

      // ---- (b) generator ----
      function drawDrive(c, g, hr) {
        const r = g.dr, a = -st.th, water = st.drive === 'water';
        c.save(); c.translate(g.dx, g.my); c.lineCap = 'round';
        if (st.drive === 'wind') {
          c.strokeStyle = theme.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, r * 1.15); c.stroke();
          c.lineWidth = 1.5; c.beginPath();
          for (let i = 0; i < 3; i++) { const xo = -r * 1.5 + ((st.t * 50 + i * 31) % (r * 0.9)), yo = (i - 1) * r * 0.55 - 6; c.moveTo(xo, yo); c.lineTo(xo + 14, yo); }
          c.stroke();
          c.fillStyle = theme.surface; c.strokeStyle = theme.fg;
          for (let k = 0; k < 3; k++) { c.save(); c.rotate(a + k * TAU / 3); c.beginPath(); c.ellipse(r * 0.52, 0, r * 0.48, r * 0.11, 0, 0, TAU); c.fill(); c.stroke(); c.restore(); }
        } else {
          if (water) { c.strokeStyle = K.withAlpha(theme.c1, 0.55); c.lineWidth = 7; c.beginPath(); c.moveTo(-r * 0.78, -r * 1.12); c.lineTo(-r * 0.78, r * 1.05); c.stroke(); }
          c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, r * 0.86, 0, TAU); c.stroke();
          const n = water ? 8 : 4, ro = r * (water ? 1 : 0.86);
          c.lineWidth = 2; c.beginPath();
          for (let k = 0; k < n; k++) { const b = a + k * TAU / n; c.moveTo(Math.cos(b) * hr, Math.sin(b) * hr); c.lineTo(Math.cos(b) * ro, Math.sin(b) * ro); }
          c.stroke();
          if (!water) { c.fillStyle = theme.c2; c.beginPath(); c.arc(Math.cos(a) * ro, Math.sin(a) * ro, 6, 0, TAU); c.fill(); }
        }
        c.fillStyle = theme.fg; c.beginPath(); c.arc(0, 0, hr, 0, TAU); c.fill();
        c.restore();
        K.text(c, K.tr(DRIVES.find(d => d.value === st.drive).label, lang), g.dx, g.my + r * 1.15 + 13, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function drawB(c, S) {
        const my = S.y + Math.max(92, S.h * 0.48), mx = S.x + S.w * 0.5;
        const g = { mx, my, rl: K.clamp(Math.min(S.w * 0.11, S.h * 0.2), 26, 64), dr: K.clamp(Math.min(S.w * 0.12, S.h * 0.22), 26, 76), dx: S.x + S.w * 0.17,
          cl: K.clamp(S.w * 0.16, 46, 100), cr: K.clamp(S.h * 0.11, 16, 34), ccx: S.x + S.w * 0.8, by: S.y + S.h - Math.max(24, S.h * 0.12) };
        const U0 = GEN_K * st.turns * st.f, x1 = g.ccx - g.cl / 2, x2 = g.ccx + g.cl / 2, hr = g.dr * 0.28;
        c.save(); c.strokeStyle = theme.muted; c.lineWidth = 2;   // drive belt
        c.beginPath(); c.moveTo(g.dx, my - hr); c.lineTo(mx, my - 6); c.moveTo(g.dx, my + hr); c.lineTo(mx, my + 6); c.stroke();
        c.fillStyle = IRON; c.fillRect(mx + g.rl + 8, my - g.cr * 0.45, x2 + 6 - (mx + g.rl + 8), g.cr * 0.9);   // iron core of the coil
        c.restore();
        drawDrive(c, g, hr);
        polyline(c, [[x1, my + g.cr], [x1, g.by], [x2, g.by], [x2, my + g.cr]], COPPER, 3);
        coilLoops(c, x1, g.cl, my, g.cr, 0, TAU, 1);
        K.text(c, st.turns + ' ' + K.tr({ en: 'turns', hr: 'zavoja' }, lang), g.ccx, my - g.cr - 9, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        drawBulb(c, g.ccx, g.by, Math.max(9, g.cr * 0.5), 1 - Math.exp(-st.glowP / 0.4));
        K.text(c, 'U = ' + K.fmt(nz(st.Ug, 1), 1, lang) + ' V', x1 - 8, g.by, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        drawBar(c, mx, my, 2 * g.rl, K.clamp(g.rl * 0.5, 14, 26), -st.th, 1);
        c.fillStyle = theme.fg; c.beginPath(); c.arc(mx, my, 4.5, 0, TAU); c.fill();
        header(c, 'Generator: f = ' + K.fmt(st.f, 1, lang) + ' Hz,  ' + K.tr({ en: 'peak voltage ', hr: 'vršni napon ' }, lang) + K.fmt(U0, 1, lang) + ' V',
          K.tr({ en: 'One turn of the magnet = one full wave of the voltage.', hr: 'Jedan okret magneta = jedan cijeli val napona.' }, lang));
      }
      function drawChart(c, G) {
        const A = st.mode === 'magnet', span = A ? 8 : 2, page = A ? 2 : 0.5;
        const x0 = Math.max(0, Math.floor(st.t / page) * page - (span - page));
        let Y = GEN_K * st.turns * 5;
        if (A) { let pk = 0; st.pts.forEach(p => { if (p[0] >= x0) pk = Math.max(pk, Math.abs(p[1])); }); Y = [20, 50, 100, 200, 500, 1000].find(v => v >= pk * 1.1) || 2000; }
        const ch = K.lineChart(c, { x: G.x, y: G.y, w: G.w, h: G.h, xMin: x0, xMax: x0 + span, yMin: -Y, yMax: Y, nice: false, xTicks: 4, yTicks: 4,
          xDigits: A ? 0 : 1, yDigits: (Y / 2) % 1 ? 1 : 0, lang, theme,
          yLabel: A ? { en: 'induced voltage U (mV)', hr: 'inducirani napon U (mV)' } : { en: 'voltage U (V)', hr: 'napon U (V)' },
          series: [{ points: st.pts, color: theme.c1 }] });
        c.save(); c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(ch.px, ch.sy(0)); c.lineTo(ch.px + ch.pw, ch.sy(0)); c.stroke(); c.restore();
        K.text(c, K.tr({ en: 'time t (s)', hr: 'vrijeme t (s)' }, lang), ch.px + ch.pw - 5, ch.py + ch.ph - 6, { font: '11px ' + theme.font, color: theme.fg, align: 'right' });
      }

      // ---- (c) electric motor (coil drawn in a slanted "3D" view: d = depth away from the viewer) ----
      function drawC(c) {
        const w = cv.w, h = cv.h, r = K.clamp(Math.min(w * 0.13, h * 0.22), 34, 105), D = r * 1.25;
        const cx = w * 0.5 - D * 0.2, cy = Math.max(52 + 1.75 * r, h * 0.42), I = motorI(), dir = st.bat * st.mag;
        const P = (a, d) => [cx + r * Math.cos(a) + 0.4 * d, cy - r * Math.sin(a) - 0.3 * d];
        const ccx = cx - 0.2 * r, ccy = cy + 0.15 * r, rc = K.clamp(r * 0.2, 8, 16);
        const xl = ccx - rc - 22, xr = ccx + rc + 22, yb = h - 16, ybat = yb - 28;
        geoC = { sw: { x: xr, y: ybat } };
        // magnet poles and the field between them (N → S)
        const mw = K.clamp(w * 0.09, 30, 80), mh = r * 1.9, myc = cy - 0.15 * D, nx = cx - r - 14 - mw, sx = cx + 0.4 * D + r + 14;
        c.save();
        [[nx, st.mag > 0], [sx, st.mag < 0]].forEach(m => {
          c.fillStyle = m[1] ? theme.c8 : theme.c1; K.roundRect(c, m[0], myc - mh / 2, mw, mh, 6); c.fill();
          c.strokeStyle = theme.fg; c.lineWidth = 2; c.stroke();
          K.text(c, m[1] ? 'N' : 'S', m[0] + mw / 2, myc, { font: 'bold ' + Math.round(K.clamp(mw * 0.5, 14, 26)) + 'px ' + theme.fontDisplay, color: '#ffffff', align: 'center', baseline: 'middle' });
        });
        c.restore();
        for (let k = -1; k <= 1; k++) {
          const y = myc + k * mh * 0.34, xa = nx + mw + 5, xb = sx - 5;
          K.arrow(c, st.mag > 0 ? xa : xb, y, st.mag > 0 ? xb : xa, y, { color: K.withAlpha(theme.c3, 0.6), width: 1.5, head: 8 });
        }
        K.text(c, 'B', sx - 14, myc - mh * 0.34 - 9, { font: 'bold italic 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        // circuit: brushes – battery – switch
        polyline(c, [[ccx - rc - 3, ccy], [xl, ccy], [xl, yb], [xr, yb], [xr, ccy], [ccx + rc + 3, ccy]], theme.fg, 2.5);
        c.save();
        c.fillStyle = theme.sky; c.fillRect(xl - 4, ybat - 5, 8, 10); c.fillRect(xr - 4, ybat - 12, 8, 24);
        const yPlus = ybat - 5 * st.bat, yMinus = ybat + 5 * st.bat, sa = st.closed ? 0 : 0.6;
        c.strokeStyle = theme.fg; c.lineCap = 'round';
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(xl - 15, yPlus); c.lineTo(xl + 15, yPlus); c.stroke();     // long thin plate = +
        c.lineWidth = 6; c.beginPath(); c.moveTo(xl - 8, yMinus); c.lineTo(xl + 8, yMinus); c.stroke();        // short thick plate = −
        c.lineWidth = 3; c.beginPath(); c.moveTo(xr, ybat + 11); c.lineTo(xr + 22 * Math.sin(sa), ybat + 11 - 22 * Math.cos(sa)); c.stroke();
        c.fillStyle = theme.fg; [ybat - 11, ybat + 11].forEach(y => { c.beginPath(); c.arc(xr, y, 3.5, 0, TAU); c.fill(); });
        c.restore();
        const f12 = 'bold 12px ' + theme.font;
        K.text(c, '+', xl - 24, yPlus - 4 * st.bat, { font: 'bold 14px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, '−', xl - 24, yMinus + 4 * st.bat, { font: 'bold 14px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, 'U = ' + K.fmt(st.Um, 1, lang) + ' V', xl - 36, ybat, { font: f12, color: theme.fg, align: 'right', baseline: 'middle' });
        K.text(c, K.tr(st.closed ? { en: 'switch closed', hr: 'prekidač zatvoren' } : { en: 'switch open', hr: 'prekidač otvoren' }, lang), xr + 18, ybat, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
        if (I > 0) {   // conventional current leaves the + plate
          const ym = (ccy + r * 1.7 + ybat - 14) / 2;
          K.arrow(c, xl - 10, ym + 12 * st.bat, xl - 10, ym - 12 * st.bat, { color: theme.c2, width: 2.5, head: 8 });
          K.text(c, 'I', xl - 22, ym, { font: 'bold italic 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        // coil: side A (orange) and side B (violet), joined at the far end; leads to the two commutator halves
        const a = st.ang, An = P(a, 0), Af = P(a, D), Bn = P(a + Math.PI, 0), Bf = P(a + Math.PI, D), ux = Math.cos(a), uy = -Math.sin(a);
        polyline(c, [Af, Bf], COPPER, 4);
        polyline(c, [An, Af], theme.c2, 4); polyline(c, [Bn, Bf], theme.c7, 4);
        polyline(c, [An, [ccx + ux * rc, ccy + uy * rc]], theme.c2, 2.5); polyline(c, [Bn, [ccx - ux * rc, ccy - uy * rc]], theme.c7, 2.5);
        c.save(); c.lineWidth = 5;
        c.strokeStyle = theme.c2; c.beginPath(); c.arc(ccx, ccy, rc, -a - 1.25, -a + 1.25); c.stroke();
        c.strokeStyle = theme.c7; c.beginPath(); c.arc(ccx, ccy, rc, -a + Math.PI - 1.25, -a + Math.PI + 1.25); c.stroke();
        c.fillStyle = theme.fg; c.fillRect(ccx - rc - 10, ccy - 5, 7, 10); c.fillRect(ccx + rc + 3, ccy - 5, 7, 10);   // brushes
        c.restore();
        K.text(c, K.tr({ en: 'commutator', hr: 'komutator' }, lang), ccx, ccy + rc + 13, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        if (I > 0) {
          [a, a + Math.PI].forEach(sa2 => {
            const right = Math.cos(sa2) > 0, m = P(sa2, D / 2), p1 = P(sa2, D * 0.2), p2 = P(sa2, D * 0.8);
            const away = right ? st.bat < 0 : st.bat > 0;   // the side next to the + brush carries the current away from the viewer
            K.arrow(c, away ? p1[0] : p2[0], away ? p1[1] : p2[1], away ? p2[0] : p1[0], away ? p2[1] : p1[1], { color: theme.fg, width: 1.5, head: 9 });
            const up = (right ? 1 : -1) * dir, len = 10 + 0.5 * r * Math.min(1, I / 1.5);   // F = B·I·l, direction from I × B
            K.arrow(c, m[0], m[1], m[0], m[1] - up * len, { color: theme.fg, width: 3, head: 10 });
            K.text(c, 'F', m[0] + 10, m[1] - up * (len - 3), { font: 'bold italic 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
          });
        }
        if (Math.abs(st.om) > 0.3) {   // small arrow over the coil: direction of rotation
          const s = st.om > 0 ? -1 : 1, R = r + 9, ae = -Math.PI / 2 + s * 0.5, ex = cx + R * Math.cos(ae), ey = cy + R * Math.sin(ae);
          c.save(); c.strokeStyle = theme.muted; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5); c.stroke(); c.restore();
          K.arrow(c, ex + s * Math.sin(ae) * 8, ey - s * Math.cos(ae) * 8, ex - s * Math.sin(ae) * 3, ey + s * Math.cos(ae) * 3, { color: theme.muted, width: 2, head: 9 });
        }
        header(c, K.tr({ en: 'Electric motor: ', hr: 'Elektromotor: ' }, lang) + (st.closed ? 'I = U / R = ' + K.fmt(st.Um, 1, lang) + ' V / ' + MOT_R + ' Ω = ' + K.fmt(I, 2, lang) + ' A'
          : K.tr({ en: 'switch open, I = 0 A', hr: 'prekidač otvoren, I = 0 A' }, lang)),
          K.tr({ en: 'Opposite forces F on the two sides turn the coil.', hr: 'Suprotne sile F na dvjema stranama okreću zavojnicu.' }, lang));
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'motor') { drawC(c); return; }
        const wide = w >= 620, S = wide ? { x: 0, y: 0, w: Math.round(w * 0.56), h } : { x: 0, y: 0, w, h: Math.round(h * 0.6) };
        if (st.mode === 'magnet') drawA(c, S); else drawB(c, S);
        drawChart(c, wide ? { x: S.w + 4, y: 8, w: w - S.w - 12, h: h - 16 } : { x: 6, y: S.h, w: w - 12, h: h - S.h - 6 });
      }

      // ---- pointer: drag the magnet, click the motor switch ----
      function overMagnet(p) { return st.mode === 'magnet' && geoA && Math.abs(p.x - (geoA.cx + st.x * geoA.pxm)) < geoA.ml / 2 + 14 && Math.abs(p.y - geoA.ay) < geoA.mh / 2 + 22; }
      function overSwitch(p) { return st.mode === 'motor' && geoC && Math.hypot(p.x - geoC.sw.x, p.y - geoC.sw.y) < 24; }
      const onDown = ev => {
        const p = cv.pointer(ev);
        if (overSwitch(p)) { ev.preventDefault(); st.closed = !st.closed; tgSwitch.set(st.closed); refresh(); return; }
        if (!overMagnet(p)) return;
        ev.preventDefault();
        st.drag = true; st.hint = false; st.off = p.x - (geoA.cx + st.x * geoA.pxm); st.tx = st.x;
        if (st.auto) { st.auto = false; tgAuto.set(false); }
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic event */ }
        cv.canvas.style.cursor = 'grabbing';
        if (!L.running) { L.start(); updatePlay(); }   // the voltage needs running time
      };
      const onMove = ev => {
        const p = cv.pointer(ev);
        if (st.drag && geoA) { st.tx = K.clamp((p.x - st.off - geoA.cx) / geoA.pxm, X_MIN, X_MAX); return; }
        cv.canvas.style.cursor = overMagnet(p) ? 'grab' : (overSwitch(p) ? 'pointer' : 'default');
      };
      const onUp = () => { if (st.drag) { st.drag = false; cv.canvas.style.cursor = 'default'; } };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      const L = K.loop(dt => {
        if (st.mode === 'magnet') stepA(dt); else if (st.mode === 'generator') stepB(dt); else stepC(dt);
        updateOut(); draw();
      });
      cv.onResize(draw);
      applyMode();
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
      return {
        destroy() {
          L.destroy(); window.removeEventListener('pointerup', onUp);
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          cv.canvas.removeEventListener('pointerup', onUp); cv.canvas.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
