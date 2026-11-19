/* FizLab sim: Resistance and Ohm's law — a wire (R = ρ·l/A), an Ohm's-law lab with an I–U graph, and a conductor/insulator tester. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2;
  const I_MAX = 20;            // A: above this the wire "would overheat"
  const HOT = '#ff5a2a';
  const MATS = [               // resistivity ρ in Ω·mm²/m
    { id: 'cu', rho: 0.017, color: '#c17a3a', label: { en: 'copper', hr: 'bakar' } },
    { id: 'al', rho: 0.028, color: '#b9c0c8', label: { en: 'aluminium', hr: 'aluminij' } },
    { id: 'fe', rho: 0.10, color: '#8e959e', label: { en: 'iron', hr: 'željezo' } },
    { id: 'konst', rho: 0.50, color: '#b79a78', label: { en: 'constantan', hr: 'konstantan' } },
    { id: 'nicr', rho: 1.10, color: '#a3a9ad', label: { en: 'nichrome', hr: 'nikrom' } }
  ];
  const COMPS = [
    { id: 'r10', R: 10, ck: 'c1', label: { en: 'resistor 10 Ω', hr: 'otpornik 10 Ω' }, short: '10 Ω' },
    { id: 'r20', R: 20, ck: 'c2', label: { en: 'resistor 20 Ω', hr: 'otpornik 20 Ω' }, short: '20 Ω' },
    { id: 'r50', R: 50, ck: 'c3', label: { en: 'resistor 50 Ω', hr: 'otpornik 50 Ω' }, short: '50 Ω' },
    { id: 'bulb', R: 6, bulb: true, ck: 'c4', label: { en: 'filament bulb', hr: 'žaruljica sa žarnom niti' }, short: { en: 'bulb', hr: 'žaruljica' } }
  ];
  const compR = (cp, U) => cp.bulb ? cp.R * (1 + 2 * U / 12) : cp.R;   // the hot filament resists more: 6 Ω cold → 18 Ω at 12 V
  const U_T = 4.5, R_BULB = 10;   // tester: battery (V) and its bulb (Ω)
  const ITEMS = [                 // R = resistance of the item between the clips (Ω)
    { id: 'copper', R: 0.01, shape: 'wave', color: '#c17a3a', lw: 3, name: { en: 'copper wire', hr: 'bakrena žica' } },
    { id: 'nail', R: 0.02, shape: 'bar', color: '#8e959e', w: 38, h: 5, name: { en: 'iron nail', hr: 'željezni čavao' } },
    { id: 'foil', R: 0.02, shape: 'bar', color: '#cdd5dd', w: 34, h: 14, name: { en: 'aluminium foil', hr: 'alu-folija' } },
    { id: 'coin', R: 0.01, shape: 'coin', color: '#d4a93a', name: { en: 'coin', hr: 'kovanica' } },
    { id: 'lead', R: 5, shape: 'bar', color: '#5b616b', w: 38, h: 4, name: { en: 'pencil lead', hr: 'mina olovke' }, full: { en: 'pencil lead (graphite)', hr: 'mina olovke (grafit)' } },
    { id: 'string', R: 2e4, shape: 'wave', color: '#cbb994', lw: 2, name: { en: 'wet string', hr: 'mokri konac' } },
    { id: 'ruler', R: Infinity, shape: 'bar', ck: 'c4', w: 40, h: 9, name: { en: 'plastic ruler', hr: 'plastično ravnalo' } },
    { id: 'stick', R: Infinity, shape: 'bar', color: '#a8744a', w: 40, h: 6, name: { en: 'wooden stick', hr: 'drveni štapić' } },
    { id: 'glass', R: Infinity, shape: 'bar', ck: 'c3', alpha: 0.4, w: 38, h: 7, name: { en: 'glass rod', hr: 'stakleni štapić' } },
    { id: 'rubber', R: Infinity, shape: 'bar', ck: 'c5', w: 26, h: 13, r: 4, name: { en: 'rubber', hr: 'gumica' } },
    { id: 'dist', R: 1e6, shape: 'cup', name: { en: 'distilled water', hr: 'destilirana voda' } },
    { id: 'tap', R: 5000, shape: 'cup', name: { en: 'tap water', hr: 'voda iz slavine' } },
    { id: 'salt', R: 0, shape: 'cup', name: { en: 'salt water', hr: 'slana voda' } }
  ];
  const CLASS = {
    good: { en: 'a conductor', hr: 'vodič' }, poor: { en: 'a poor conductor', hr: 'slab vodič' }, ins: { en: 'an insulator', hr: 'izolator' }
  };
  const NOTE = {
    wire: { en: 'A longer wire has more resistance, a thicker wire has less, and the material matters too: R = ρ · l / A. Blue dots are electrons; they keep bumping into the atoms of the metal (grey dots).',
      hr: 'Dulja žica ima veći otpor, deblja manji, a važan je i materijal: R = ρ · l / A. Plave točke su elektroni; stalno se sudaraju s atomima metala (sive točke).' },
    over: { en: 'More than 20 A: the wire would overheat! Its resistance is too small for this voltage. Make it longer or thinner, pick another material or lower the voltage.',
      hr: 'Više od 20 A: žica bi se pregrijala! Otpor joj je premalen za ovaj napon. Produlji je ili stanji, odaberi drugi materijal ili smanji napon.' },
    ohm: { en: 'Record several points. A straight line through the origin means that I is proportional to U (Ohm\'s law), so R = U / I stays the same. A steeper line means a smaller resistance.',
      hr: 'Zabilježi nekoliko točaka. Pravac kroz ishodište znači da je I razmjerna s U (Ohmov zakon) pa je R = U / I stalan. Strmiji pravac znači manji otpor.' },
    bulb: { en: 'The bulb does not give a straight line: its filament heats up, its resistance grows, and U / I is no longer constant.',
      hr: 'Žaruljica ne daje pravac: žarna nit se grije, otpor joj raste i U / I više nije stalan.' },
    tester: { en: 'Metals and graphite conduct well; plastic, wood, glass and rubber are insulators. Pure (distilled) water hardly conducts. Dissolved salt gives the water charged particles (ions): more salt → smaller resistance → more current.',
      hr: 'Metali i grafit dobro vode struju; plastika, drvo, staklo i guma su izolatori. Čista (destilirana) voda jedva vodi. Otopljena sol daje vodi nabijene čestice (ione): više soli → manji otpor → jača struja.' }
  };
  const DEF = { l: 2, A: 0.5, mat: 'konst', U: 6, U2: 4, comp: 'r10', salt: 5 };
  function hash(i, j) { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); }
  function mix(a, b, t) {      // blend two '#rrggbb' colours
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), ch = sh => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
    return 'rgb(' + ch(16) + ',' + ch(8) + ',' + ch(0) + ')';
  }
  function sig3(v, lang) {     // three significant digits
    if (!(v > 0)) return K.fmt(0, 2, lang);
    return K.fmt(v, K.clamp(2 - Math.floor(Math.log10(v)), 0, 6), lang);
  }
  function mA(I, lang) { const v = I * 1000; return K.fmt(v, v >= 10 ? 0 : 2, lang) + ' mA'; }

  window.Sims.register({
    id: 'resistance',
    title: { en: 'Resistance and Ohm\'s Law', hr: 'Električni otpor i Ohmov zakon' },
    summary: {
      en: 'Stretch, thicken and swap a wire to see what sets its resistance, measure the I–U graph of resistors and a bulb, and test which things conduct electricity.',
      hr: 'Produlji, podebljaj i zamijeni žicu da vidiš o čemu ovisi otpor, izmjeri I–U graf otpornika i žaruljice te ispitaj koji predmeti vode struju.'
    },
    tasks: [
      { en: 'In "A wire" double the length. What happens to R? Now double the cross-section instead.', hr: 'U "Žici" udvostruči duljinu. Što se dogodi s otporom R? Sada umjesto toga udvostruči presjek.' },
      { en: 'Which material would you choose for a heater and which for the cables in the wall? Compare copper and nichrome.', hr: 'Koji bi materijal odabrao za grijač, a koji za vodove u zidu? Usporedi bakar i nikrom.' },
      { en: 'In "Ohm\'s law lab" record at least 5 points for the 20 Ω resistor. Is the graph a straight line? Then try the bulb.', hr: 'U "Ohmovom zakonu" zabilježi barem 5 točaka za otpornik od 20 Ω. Je li graf pravac? Zatim ispitaj žaruljicu.' },
      { en: 'Test every item. Then put the salt water in the gap and add salt: what happens to the current?', hr: 'Ispitaj svaki predmet. Zatim stavi slanu vodu u prazninu i dodaj soli: što se događa sa strujom?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 10, minHeight: 360, maxHeight: 500 });
      const C = K.controls(container, lang);
      const st = { mode: 'wire', l: DEF.l, A: DEF.A, mat: MATS[3], U: DEF.U, t: 0, el: [],
        U2: DEF.U2, comp: COMPS[0], data: { r10: [], r20: [], r50: [], bulb: [] }, salt: DEF.salt, item: null, drag: null };
      for (let i = 0; i < 70; i++) st.el.push({ u: hash(i, 1), v: hash(i, 2) * 2 - 1, vt: hash(i, 3) * 2 - 1 });
      let geoT = null;

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Experiment', hr: 'Pokus' }, options: [
        { value: 'wire', label: { en: 'A wire', hr: 'Žica' } }, { value: 'ohm', label: { en: 'Ohm\'s law lab', hr: 'Ohmov zakon' } },
        { value: 'tester', label: { en: 'Conductor or insulator?', hr: 'Vodič ili izolator?' } }], value: 'wire',
        onChange: v => { st.mode = v; st.drag = null; applyMode(); refresh(); } });
      const slL = C.slider({ label: { en: 'Length l', hr: 'Duljina l' }, min: 0.1, max: 10, step: 0.1, value: DEF.l, unit: 'm', digits: 1, onChange: v => { st.l = v; refresh(); } });
      const slA = C.slider({ label: { en: 'Cross-section A', hr: 'Presjek A' }, min: 0.05, max: 2, step: 0.05, value: DEF.A, unit: 'mm²', digits: 2, onChange: v => { st.A = v; refresh(); } });
      const selMat = C.select({ label: { en: 'Material', hr: 'Materijal' }, value: DEF.mat,
        options: MATS.map(m => ({ value: m.id, label: { en: m.label.en + ' (ρ = ' + K.fmt(m.rho, 3, 'en') + ')', hr: m.label.hr + ' (ρ = ' + K.fmt(m.rho, 3, 'hr') + ')' } })),
        onChange: v => { st.mat = MATS.find(m => m.id === v) || MATS[0]; refresh(); } });
      const slU = C.slider({ label: { en: 'Source voltage U', hr: 'Napon izvora U' }, min: 0, max: 12, step: 0.5, value: DEF.U, unit: 'V', digits: 1, onChange: v => { st.U = v; refresh(); } });
      const slU2 = C.slider({ label: { en: 'Source voltage U', hr: 'Napon izvora U' }, min: 0, max: 12, step: 1, value: DEF.U2, unit: 'V', digits: 0, onChange: v => { st.U2 = v; refresh(); } });
      const selComp = C.select({ label: { en: 'Component', hr: 'Trošilo' }, options: COMPS.map(cp => ({ value: cp.id, label: cp.label })), value: DEF.comp,
        onChange: v => { st.comp = COMPS.find(cp => cp.id === v) || COMPS[0]; refresh(); } });
      const btnRec = C.button({ label: { en: 'Record point', hr: 'Zabilježi' }, onClick: () => record() });
      const btnClr = C.button({ label: { en: 'Clear', hr: 'Obriši' }, onClick: () => { COMPS.forEach(cp => { st.data[cp.id] = []; }); refresh(); } });
      const slSalt = C.slider({ label: { en: 'Salt in the salt water', hr: 'Sol u slanoj vodi' }, min: 0, max: 20, step: 1, value: DEF.salt, unit: 'g', digits: 0, onChange: v => { st.salt = v; refresh(); } });
      const btnOut = C.button({ label: { en: 'Take the item out', hr: 'Izvadi predmet' }, onClick: () => { st.item = null; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outR = C.readout({ label: { en: 'Resistance R', hr: 'Otpor R' }, unit: 'Ω' });
      const outI = C.readout({ label: { en: 'Current I', hr: 'Jakost struje I' }, unit: 'A', digits: 2 });
      const outP = C.readout({ label: { en: 'Power P', hr: 'Snaga P' }, unit: 'W', digits: 1 });
      const outI2 = C.readout({ label: { en: 'Ammeter: I', hr: 'Ampermetar: I' }, unit: 'A', digits: 2 });
      const outRatio = C.readout({ label: { en: 'U / I now', hr: 'U / I sada' }, unit: 'Ω', digits: 1 });
      const outFit = C.readout({ label: { en: 'R from the graph line', hr: 'R iz pravca na grafu' } });
      const outIc = C.readout({ label: { en: 'Current I', hr: 'Jakost struje I' }, unit: 'mA', digits: 2 });
      const outClass = C.readout({ label: { en: 'The item is', hr: 'Predmet je' } });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const a = st.mode === 'wire', b = st.mode === 'ohm', t = st.mode === 'tester';
        [slL, slA, selMat, slU, btnPlay, outR, outI, outP].forEach(x => show(x, a));
        [slU2, selComp, btnRec, btnClr, outI2, outRatio, outFit].forEach(x => show(x, b));
        [slSalt, btnOut, outIc, outClass].forEach(x => show(x, t));
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---- physics ----
      function wireCalc() {
        const R = st.mat.rho * st.l / st.A, I = st.U / R, over = I > I_MAX, p = st.U * I / st.l;   // p = power per metre of wire
        return { R, I, over, P: st.U * I, Ishow: Math.min(I, I_MAX), heat: over ? 1 : (p > 4 ? K.clamp(Math.log10(p / 4) / Math.log10(50), 0, 1) : 0) };
      }
      function ohmNow() { const R = compR(st.comp, st.U2); return { R, I: st.U2 / R }; }
      function fitR(pts) {       // best-fit line through the origin: I = U / R
        let suu = 0, sui = 0;
        pts.forEach(p => { suu += p[0] * p[0]; sui += p[0] * p[1]; });
        return pts.length >= 2 && sui > 0 ? suu / sui : null;
      }
      function record() {
        const pts = st.data[st.comp.id], I = ohmNow().I, k = pts.findIndex(p => p[0] === st.U2);
        if (k >= 0) pts[k][1] = I; else { pts.push([st.U2, I]); pts.sort((a, b) => a[0] - b[0]); }
        refresh();
      }
      function itemById(id) { return ITEMS.find(it => it.id === id) || null; }
      function testerCalc() {
        const it = st.item ? itemById(st.item) : null;
        const R = !it ? Infinity : (it.id === 'salt' ? 1 / (1 / 5000 + 0.0062 * st.salt) : it.R);   // salt adds ions → more conductance
        const I = U_T / (R_BULB + R);
        return { it, I, glow: 1 - Math.exp(-I * I * R_BULB / 0.4), cls: !it ? null : (I >= 0.05 ? 'good' : (I >= 1e-5 ? 'poor' : 'ins')) };
      }
      function updateOut() {
        if (st.mode === 'wire') {
          const q = wireCalc();
          outR.set({ en: sig3(q.R, 'en'), hr: sig3(q.R, 'hr') });
          outI.set(q.over ? { en: 'more than 20', hr: 'više od 20' } : q.I); outI.setColor(q.over ? theme.bad : '');
          outP.set(q.over ? { en: 'more than ' + K.fmt(st.U * I_MAX, 0, 'en'), hr: 'više od ' + K.fmt(st.U * I_MAX, 0, 'hr') } : q.P);
          note.set(q.over ? NOTE.over : NOTE.wire);
        } else if (st.mode === 'ohm') {
          const q = ohmNow(), R = fitR(st.data[st.comp.id]);
          outI2.set(q.I); outRatio.set(st.U2 > 0 ? q.R : null);
          outFit.set(st.comp.bulb ? { en: 'not constant', hr: 'nije stalan' } : (R ? { en: K.fmt(R, 1, 'en') + ' Ω', hr: K.fmt(R, 1, 'hr') + ' Ω' } : { en: 'record 2 points', hr: 'zabilježi 2 točke' }));
          note.set(st.comp.bulb ? NOTE.bulb : NOTE.ohm);
        } else {
          const q = testerCalc();
          outIc.set(q.it ? q.I * 1000 : null);
          outClass.set(q.cls ? CLASS[q.cls] : null); outClass.setColor(q.cls === 'good' ? theme.good : (q.cls === 'poor' ? theme.warn : ''));
          note.set(NOTE.tester);
        }
      }
      function refresh() { updateOut(); draw(); }
      function reset() {
        Object.assign(st, { l: DEF.l, A: DEF.A, mat: MATS[3], U: DEF.U, U2: DEF.U2, comp: COMPS[0], salt: DEF.salt, item: null, drag: null });
        COMPS.forEach(cp => { st.data[cp.id] = []; });
        slL.set(DEF.l); slA.set(DEF.A); selMat.set(DEF.mat); slU.set(DEF.U); slU2.set(DEF.U2); selComp.set(DEF.comp); slSalt.set(DEF.salt);
        refresh();
      }
      function stepWire(dt) {
        const q = wireCalc(), len = Math.max(8, st.l / 10 * (cv.w - 64)), sp = q.Ishow * 12;   // drift speed in px/s ∝ current
        st.t += dt;
        st.el.forEach((e, i) => {
          e.u = (e.u + sp * dt / len * (0.7 + 0.6 * hash(i, 5))) % 1;
          if (sp > 0 && Math.random() < dt * (2 + sp / 12)) e.vt = Math.random() * 2 - 1;   // a bump into an atom sends it another way
          e.v += (e.vt - e.v) * Math.min(1, dt * 10);
        });
      }

      // ---- drawing helpers ----
      function polyline(c, pts, color, width) {
        c.save(); c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round';
        c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
      }
      function head(c, lines) {   // header lines: [text, colour]
        lines.forEach((ln, i) => K.text(c, ln[0], 12, 14 + i * 17, { font: i ? '12px ' + theme.font : 'bold ' + (cv.w < 420 ? 12 : 13) + 'px ' + theme.fontDisplay,
          color: ln[1] || (i ? theme.muted : theme.fg), baseline: 'middle' }));
      }
      function battery(c, x, y, onRail) {   // onRail: the wire runs left–right (− left, + right); otherwise up–down (+ on top)
        const ln = (x1, y1, x2, y2, lw) => { c.lineWidth = lw; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
        c.save(); c.fillStyle = theme.sky; c.strokeStyle = theme.fg; c.lineCap = 'round';
        if (onRail) { c.fillRect(x - 5, y - 3, 10, 6); ln(x - 5, y - 7, x - 5, y + 7, 6); ln(x + 5, y - 14, x + 5, y + 14, 2.5); }
        else { c.fillRect(x - 3, y - 5, 6, 10); ln(x - 15, y - 5, x + 15, y - 5, 2.5); ln(x - 8, y + 5, x + 8, y + 5, 6); }
        c.restore();
        const f = 'bold 14px ' + theme.font;
        K.text(c, '+', onRail ? x + 17 : x - 23, onRail ? y - 13 : y - 8, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, '−', onRail ? x - 17 : x - 23, onRail ? y - 13 : y + 9, { font: f, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function meter(c, x, y, r, letter, value, below) {
        c.save(); c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke(); c.restore();
        K.text(c, letter, x, y + 1, { font: 'bold ' + Math.round(r * 1.1) + 'px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(c, value, x, below ? y + r + 12 : y - r - 11, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function bulb(c, x, y, r, glow) {
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

      // ---- (a) a wire: R = ρ·l/A ----
      function drawWire(c) {
        const w = cv.w, h = cv.h, q = wireCalc(), cx = w / 2;
        const len = Math.max(8, st.l / 10 * (w - 64)), xa = cx - len / 2, xb = cx + len / 2;
        const th = 2 * Math.sqrt(st.A / Math.PI) * K.clamp(h * 0.09, 24, 40);   // thickness ∝ diameter
        const wy = Math.max(118, h * 0.42), yr = h - 38, xL = Math.min(xa, cx - 84), xR = Math.max(xb, cx + 84), rr = Math.min(4, th / 2);
        polyline(c, [[xa, wy], [xL, yr], [xR, yr], [xb, wy]], theme.fg, 2.5);
        battery(c, cx - 42, yr, true);
        K.text(c, 'U = ' + K.fmt(st.U, 1, lang) + ' V', cx - 42, yr + 25, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        meter(c, cx + 42, yr, 12, 'A', q.over ? '> ' + I_MAX + ' A' : K.fmt(q.I, 2, lang) + ' A', true);
        // the wire: colour of the metal, red-hot when the power per metre is large
        c.save();
        if (q.heat > 0.02) { c.shadowColor = K.withAlpha(HOT, 0.9 * q.heat); c.shadowBlur = 8 + 22 * q.heat; }
        c.fillStyle = mix(st.mat.color, HOT, q.heat * 0.85); K.roundRect(c, xa, wy - th / 2, len, th, rr); c.fill();
        c.restore();
        c.save(); K.roundRect(c, xa, wy - th / 2, len, th, rr); c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = 1; c.stroke(); c.clip();
        const rows = Math.max(1, Math.floor(th / 13)), cols = Math.max(1, Math.floor(len / 20));
        c.fillStyle = 'rgba(40,44,52,0.42)';   // atoms of the metal (they shake more when hot)
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const jx = q.heat * 2 * Math.sin(st.t * 31 + i * 1.7 + j), jy = q.heat * 2 * Math.cos(st.t * 27 + i + j * 2.3);
          c.beginPath(); c.arc(xa + (i + 0.5) * len / cols + jx, wy + ((j + 0.5) / rows - 0.5) * th + jy, 2.2, 0, TAU); c.fill();
        }
        const n = K.clamp(Math.round(len * Math.max(th, 8) / 170), 3, st.el.length);
        c.fillStyle = theme.c1;
        for (let i = 0; i < n; i++) { const e = st.el[i]; c.beginPath(); c.arc(xa + e.u * len, wy + e.v * Math.max(0, th / 2 - 3), 2.7, 0, TAU); c.fill(); }
        c.restore();
        // length mark, cross-section
        const yd = wy - th / 2 - 12, f11 = '11px ' + theme.font;
        c.save(); c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xa, yd); c.lineTo(xb, yd); c.moveTo(xa, yd - 4); c.lineTo(xa, yd + 4); c.moveTo(xb, yd - 4); c.lineTo(xb, yd + 4); c.stroke(); c.restore();
        K.text(c, K.tr(st.mat.label, lang) + ',  l = ' + K.fmt(st.l, 1, lang) + ' m', cx, yd - 10, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        const iy = wy + (yr - wy) * 0.5;
        c.save(); c.fillStyle = st.mat.color; c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = 1; c.beginPath(); c.arc(cx, iy, th / 2, 0, TAU); c.fill(); c.stroke(); c.restore();
        K.text(c, K.tr({ en: 'cross-section', hr: 'presjek' }, lang), cx, iy - th / 2 - 9, { font: f11, color: theme.muted, align: 'center', baseline: 'middle' });
        K.text(c, 'A = ' + K.fmt(st.A, 2, lang) + ' mm²', cx, iy + th / 2 + 10, { font: f11, color: theme.fg, align: 'center', baseline: 'middle' });
        head(c, [['R = ρ · l / A = ' + K.fmt(st.mat.rho, 3, lang) + ' · ' + K.fmt(st.l, 1, lang) + ' m / ' + K.fmt(st.A, 2, lang) + ' mm² = ' + sig3(q.R, lang) + ' Ω'],
          q.over ? ['I = U / R = ' + K.fmt(q.I, 0, lang) + ' A  ⚠ ' + K.tr({ en: 'the wire would overheat!', hr: 'žica bi se pregrijala!' }, lang), theme.bad]
            : ['I = U / R = ' + K.fmt(st.U, 1, lang) + ' V / ' + sig3(q.R, lang) + ' Ω = ' + K.fmt(q.I, 2, lang) + ' A', theme.fg],
          q.over ? [K.tr({ en: 'More than 20 A: too much for this wire.', hr: 'Više od 20 A: previše za ovu žicu.' }, lang)]
            : ['P = U · I = ' + K.fmt(st.U, 1, lang) + ' V · ' + K.fmt(q.I, 2, lang) + ' A = ' + K.fmt(q.P, 1, lang) + ' W', theme.fg]]);
      }

      // ---- (b) Ohm's law lab ----
      function drawOhm(c) {
        const w = cv.w, h = cv.h, q = ohmNow(), pts = st.data[st.comp.id], f11 = '11px ' + theme.font, f12 = 'bold 12px ' + theme.font;
        const cell = K.clamp((w - 60) / 13, 36, 60), cols = Math.max(1, Math.floor((w - 60) / cell)), blocks = Math.ceil(13 / cols), TH = 24 + blocks * 32;
        const top = 46, H1 = h - TH - top - 4, cw = Math.round(w * 0.42);
        // circuit: source, ammeter in series, voltmeter in parallel with the component
        const xl = 32, xr = cw - 58, yt = top + 18, yb = top + H1 - 28, yc = (yt + yb) / 2, xm = (xl + xr) / 2;
        polyline(c, [[xl, yt], [xr, yt], [xr, yb], [xl, yb], [xl, yt]], theme.fg, 2.5);
        battery(c, xl, yc, false);
        K.text(c, K.fmt(st.U2, 0, lang) + ' V', xl + 8, yc + 27, { font: f12, color: theme.fg, baseline: 'middle' });
        meter(c, xm, yb, 12, 'A', K.fmt(q.I, 2, lang) + ' A', false);
        c.save(); c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1.5; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(xr, yc - 30); c.lineTo(xr + 40, yc - 12); c.moveTo(xr, yc + 30); c.lineTo(xr + 40, yc + 12); c.stroke(); c.restore();
        meter(c, xr + 40, yc, 12, 'V', K.fmt(st.U2, 1, lang) + ' V', true);
        if (st.comp.bulb) bulb(c, xr, yc, 13, 1 - Math.exp(-st.U2 * q.I / 3));
        else {
          c.save(); c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 2; c.fillRect(xr - 8, yc - 20, 16, 40); c.strokeRect(xr - 8, yc - 20, 16, 40); c.restore();
          K.text(c, st.comp.short, xr - 14, yc - 30, { font: f12, color: theme.fg, align: 'right', baseline: 'middle' });
        }
        // I–U graph: points, best-fit line through the origin (resistors), curve (bulb)
        const ch = K.lineChart(c, { x: cw + 4, y: top, w: w - cw - 10, h: H1, xMin: 0, xMax: 12, yMin: 0, yMax: 1.2, nice: false, xTicks: 6, yTicks: 4, xDigits: 0, yDigits: 1,
          lang, theme, yLabel: { en: 'current I (A)', hr: 'jakost struje I (A)' }, series: [] });
        K.text(c, K.tr({ en: 'voltage U (V)', hr: 'napon U (V)' }, lang), ch.px + ch.pw - 5, ch.py + ch.ph - 6, { font: f11, color: theme.fg, align: 'right' });
        c.save(); c.beginPath(); c.rect(ch.px - 6, ch.py - 6, ch.pw + 12, ch.ph + 12); c.clip();
        let ly = ch.py + 24;
        COMPS.forEach(cp => {
          const d = st.data[cp.id], col = theme[cp.ck], R = cp.bulb ? null : fitR(d);
          if (!d.length) return;
          c.strokeStyle = col; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
          if (cp.bulb) d.forEach((p, i) => i ? c.lineTo(ch.sx(p[0]), ch.sy(p[1])) : c.moveTo(ch.sx(p[0]), ch.sy(p[1])));
          else if (R) { c.moveTo(ch.sx(0), ch.sy(0)); c.lineTo(ch.sx(12), ch.sy(12 / R)); }
          c.stroke();
          d.forEach(p => { c.fillStyle = col; c.beginPath(); c.arc(ch.sx(p[0]), ch.sy(p[1]), 4, 0, TAU); c.fill(); c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.stroke(); });
          c.fillStyle = col; c.fillRect(ch.px + 8, ly - 5, 10, 10);
          K.text(c, K.tr(cp.short, lang), ch.px + 23, ly, { font: f11, color: theme.fg, baseline: 'middle' });
          ly += 15;
        });
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.arc(ch.sx(st.U2), ch.sy(q.I), 7, 0, TAU); c.stroke();   // where the meters are now
        c.restore();
        // table of the recorded points of the chosen component
        const ty = h - TH;
        c.fillStyle = theme.surface; K.roundRect(c, 4, ty, w - 8, TH - 4, 8); c.fill();
        K.text(c, K.tr({ en: 'Measurements: ', hr: 'Mjerenja: ' }, lang) + K.tr(st.comp.label, lang) + (pts.length ? '' : K.tr({ en: ' – press "Record point"', hr: ' – pritisni "Zabilježi"' }, lang)), 12, ty + 12, { font: f12, color: theme.fg, baseline: 'middle' });
        for (let b = 0; b < blocks; b++) {
          const y0 = ty + 22 + b * 32;
          K.text(c, 'U (V)', 12, y0 + 8, { font: f11, color: theme.muted, baseline: 'middle' });
          K.text(c, 'I (A)', 12, y0 + 22, { font: f11, color: theme.muted, baseline: 'middle' });
          c.save(); c.strokeStyle = theme.line; c.lineWidth = 1; c.beginPath(); c.moveTo(10, y0 + 15); c.lineTo(w - 10, y0 + 15); c.stroke(); c.restore();
          for (let k = 0; k < cols; k++) {
            const p = pts[b * cols + k], x = 60 + (k + 0.5) * cell;
            if (!p) break;
            K.text(c, K.fmt(p[0], 0, lang), x, y0 + 8, { font: f11, color: theme.fg, align: 'center', baseline: 'middle' });
            K.text(c, K.fmt(p[1], 2, lang), x, y0 + 22, { font: f11, color: theme.fg, align: 'center', baseline: 'middle' });
          }
        }
        head(c, [[K.tr(st.comp.label, lang) + ':  U = ' + K.fmt(st.U2, 0, lang) + ' V,  I = ' + K.fmt(q.I, 2, lang) + ' A'],
          [st.U2 > 0 ? 'U / I = ' + K.fmt(st.U2, 0, lang) + ' V / ' + K.fmt(q.I, 2, lang) + ' A = ' + K.fmt(q.R, 1, lang) + ' Ω' : K.tr({ en: 'Raise the voltage above 0 V.', hr: 'Povećaj napon iznad 0 V.' }, lang), theme.fg]]);
      }

      // ---- (c) conductor or insulator? ----
      function drawItem(c, it, x, y, s) {
        c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round';
        if (it.shape === 'cup') {
          c.fillStyle = K.withAlpha(theme.c1, 0.32); c.beginPath(); c.moveTo(-13, -6); c.lineTo(13, -6); c.lineTo(10, 12); c.lineTo(-10, 12); c.closePath(); c.fill();
          c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-14, -13); c.lineTo(-10, 12); c.lineTo(10, 12); c.lineTo(14, -13); c.stroke();
          const n = it.id === 'salt' ? Math.round(st.salt * 0.8) : (it.id === 'tap' ? 2 : 0);   // dots = dissolved particles
          c.fillStyle = theme.fg;
          for (let i = 0; i < n; i++) c.fillRect(-8 + hash(i, 2) * 16, -3 + hash(i, 9) * 12, 1.7, 1.7);
        } else if (it.shape === 'coin') {
          c.fillStyle = it.color; c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1; c.beginPath(); c.arc(0, 0, 10, 0, TAU); c.fill(); c.stroke();
          c.beginPath(); c.arc(0, 0, 6.5, 0, TAU); c.stroke();
        } else if (it.shape === 'wave') {
          c.strokeStyle = it.color; c.lineWidth = it.lw; c.beginPath(); c.moveTo(-18, 0); c.bezierCurveTo(-8, -11, 6, 11, 18, 0); c.stroke();
          if (it.id === 'string') { c.fillStyle = K.withAlpha(theme.c1, 0.8); [[-9, 5], [2, 7], [12, 4]].forEach(d => { c.beginPath(); c.arc(d[0], d[1], 1.8, 0, TAU); c.fill(); }); }
        } else {
          c.fillStyle = it.ck ? K.withAlpha(theme[it.ck], it.alpha || 1) : it.color; c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 1;
          K.roundRect(c, -it.w / 2, -it.h / 2, it.w, it.h, it.r || 1.5); c.fill(); c.stroke();
          if (it.id === 'nail') { c.fillRect(-it.w / 2 - 2, -5, 3, 10); c.strokeRect(-it.w / 2 - 2, -5, 3, 10); }
          if (it.id === 'ruler') { c.beginPath(); for (let i = -3; i <= 3; i++) { c.moveTo(i * 5, -it.h / 2); c.lineTo(i * 5, -it.h / 2 + (i % 2 ? 3 : 5)); } c.stroke(); }
        }
        c.restore();
      }
      function halfW(it) { return it.shape === 'cup' ? 7 : (it.shape === 'coin' ? 10 : (it.shape === 'wave' ? 18 : it.w / 2)); }
      function layT() {
        const w = cv.w, h = cv.h, rows = Math.ceil(ITEMS.length / K.clamp(Math.floor(w / 62), 5, ITEMS.length)), cols = Math.ceil(ITEMS.length / rows), cellW = w / cols, cellH = 52;
        const trayY = h - rows * cellH - 6, xl = Math.max(42, w * 0.14), s = K.clamp(w / 260, 1.5, 2.2);
        return { w, h, cellW, cellH, trayY, xl, xr: w - xl, yt: 66, yb: trayY - 12 - 21 * s, gap: K.clamp(w * 0.2, 72, 120), gx: w / 2, s,
          cells: ITEMS.map((it, i) => ({ it, x: (i % cols + 0.5) * cellW, y: trayY + Math.floor(i / cols) * cellH + 18 })) };
      }
      function drawTester(c) {
        const g = layT(), q = testerCalc(), f12 = 'bold 12px ' + theme.font, yc = (g.yt + g.yb) / 2;
        geoT = g;
        const placed = q.it && !(st.drag && st.drag.id === q.it.id), hw = placed ? halfW(q.it) * g.s : g.gap / 2;
        // tray
        c.fillStyle = theme.surface; K.roundRect(c, 4, g.trayY - 4, g.w - 8, g.h - g.trayY, 10); c.fill();
        g.cells.forEach(cl => {
          const used = st.item === cl.it.id || (st.drag && st.drag.id === cl.it.id), name = K.tr(cl.it.name, lang), font = '10px ' + theme.font, o = { font, color: theme.fg, align: 'center', baseline: 'middle' };
          c.globalAlpha = used ? 0.25 : 1;
          drawItem(c, cl.it, cl.x, cl.y, 1);
          c.font = font;
          const k = name.lastIndexOf(' ');
          if (c.measureText(name).width <= g.cellW - 4 || k < 0) K.text(c, name, cl.x, cl.y + 20, o);
          else { K.text(c, name.slice(0, k), cl.x, cl.y + 19, o); K.text(c, name.slice(k + 1), cl.x, cl.y + 30, o); }
          c.globalAlpha = 1;
        });
        // tester circuit: battery, bulb, ammeter and two clips
        polyline(c, [[g.gx - hw, g.yb], [g.xl, g.yb], [g.xl, g.yt], [g.xr, g.yt], [g.xr, g.yb], [g.gx + hw, g.yb]], theme.fg, 2.5);
        battery(c, g.xl, yc, false);
        K.text(c, K.fmt(U_T, 1, lang) + ' V', g.xl + 21, yc, { font: f12, color: theme.fg, baseline: 'middle' });
        const xb = g.xl + (g.xr - g.xl) * 0.3, xa = g.xl + (g.xr - g.xl) * 0.7;
        bulb(c, xb, g.yt, 13, q.glow);
        meter(c, xa, g.yt, 12, 'A', mA(q.I, lang), true);
        if (placed && q.it.shape === 'cup') {   // the clips hold two electrodes dipped into the water
          polyline(c, [[g.gx - hw, g.yb], [g.gx - hw, g.yb + 13 * g.s]], theme.fg, 2.5); polyline(c, [[g.gx + hw, g.yb], [g.gx + hw, g.yb + 13 * g.s]], theme.fg, 2.5);
          drawItem(c, q.it, g.gx, g.yb + 8 * g.s, g.s);
        } else if (placed) drawItem(c, q.it, g.gx, g.yb, g.s);
        else K.text(c, '?', g.gx, g.yb, { font: 'bold 18px ' + theme.fontDisplay, color: theme.muted, align: 'center', baseline: 'middle' });
        c.fillStyle = theme.fg; c.fillRect(g.gx - hw - 5, g.yb - 6, 8, 12); c.fillRect(g.gx + hw - 3, g.yb - 6, 8, 12);   // clips
        if (st.drag) drawItem(c, itemById(st.drag.id), st.drag.x, st.drag.y, 1.5);
        let l2 = '';
        if (q.it) l2 = 'I = ' + mA(q.I, lang) + ': ' + K.tr(q.glow > 0.5 ? { en: 'the bulb shines brightly', hr: 'žaruljica jako svijetli' } : (q.glow > 0.03 ? { en: 'the bulb glows weakly', hr: 'žaruljica slabo svijetli' }
          : (q.I >= 1e-5 ? { en: 'too small to light the bulb', hr: 'premalo da žaruljica zasvijetli' } : { en: 'no current flows', hr: 'struja ne teče' })), lang);
        head(c, [[q.it ? K.tr(q.it.full || q.it.name, lang) + ': ' + K.tr(CLASS[q.cls], lang) : K.tr({ en: 'Drag an item into the gap (or tap it).', hr: 'Povuci predmet u prazninu (ili ga dodirni).' }, lang)], [l2, theme.fg]]);
      }
      function draw() {
        const c = cv.ctx;
        c.clearRect(0, 0, cv.w, cv.h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'wire') drawWire(c); else if (st.mode === 'ohm') drawOhm(c); else drawTester(c);
      }

      // ---- pointer: drag or tap the items of the tester ----
      function hitTray(p) {
        if (!geoT) return null;
        const cl = geoT.cells.find(k => Math.abs(p.x - k.x) < geoT.cellW / 2 && p.y > k.y - 20 && p.y < k.y + geoT.cellH - 20);
        return cl && cl.it.id !== st.item ? cl.it : null;
      }
      function inGap(p) { return !!geoT && Math.abs(p.x - geoT.gx) < geoT.gap / 2 + 26 && Math.abs(p.y - geoT.yb) < 36; }
      const onDown = ev => {
        if (st.mode !== 'tester') return;
        const p = cv.pointer(ev);
        let it = hitTray(p), tray = true;
        if (!it && st.item && inGap(p)) { it = itemById(st.item); st.item = null; tray = false; }
        if (!it) return;
        ev.preventDefault();
        st.drag = { id: it.id, x: p.x, y: p.y, x0: p.x, y0: p.y, moved: false, tray };
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic event */ }
        cv.canvas.style.cursor = 'grabbing';
        refresh();
      };
      const onMove = ev => {
        if (st.mode !== 'tester') { cv.canvas.style.cursor = 'default'; return; }
        const p = cv.pointer(ev), d = st.drag;
        if (d) { d.x = p.x; d.y = p.y; if (Math.hypot(p.x - d.x0, p.y - d.y0) > 6) d.moved = true; draw(); return; }
        cv.canvas.style.cursor = hitTray(p) || (st.item && inGap(p)) ? 'grab' : 'default';
      };
      const onUp = () => {
        const d = st.drag;
        if (!d) return;
        st.drag = null; cv.canvas.style.cursor = 'default';
        if (d.moved ? inGap(d) : d.tray) st.item = d.id;   // dropped into the gap, or a tray item was tapped
        refresh();
      };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      const L = K.loop(dt => { if (st.mode === 'wire') stepWire(dt); draw(); });
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
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
