/* FizLab sim: Thermal Expansion — rails and bridges, a bimetal strip and thermostat, ball and ring, a liquid thermometer, air in a bottle. */
(function () {
  'use strict';
  const K = window.SimKit;
  const T_REF = 20;                                   // everything is "cold" at 20 °C
  const MATS = [                                      // linear expansion coefficient α per °C
    { id: 'steel', a: 0.000012, label: { en: 'Steel', hr: 'Čelik' } },
    { id: 'aluminium', a: 0.000023, label: { en: 'Aluminium', hr: 'Aluminij' } },
    { id: 'copper', a: 0.000017, label: { en: 'Copper', hr: 'Bakar' } },
    { id: 'glass', a: 0.000009, label: { en: 'Glass', hr: 'Staklo' } },
    { id: 'concrete', a: 0.000012, label: { en: 'Concrete', hr: 'Beton' } },
    { id: 'invar', a: 0.000001, label: { en: 'Invar (special alloy)', hr: 'Invar (posebna slitina)' } }
  ];
  const PAIRS = [
    { id: 'steel-copper', top: 'steel', bot: 'copper', label: { en: 'Steel + copper', hr: 'Čelik + bakar' } },
    { id: 'steel-aluminium', top: 'steel', bot: 'aluminium', label: { en: 'Steel + aluminium', hr: 'Čelik + aluminij' } },
    { id: 'invar-copper', top: 'invar', bot: 'copper', label: { en: 'Invar + copper', hr: 'Invar + bakar' } }
  ];
  const LIQUIDS = [                                   // volume expansion coefficient β per °C
    { id: 'alcohol', b: 0.0011, color: 'c8', label: { en: 'Alcohol (dyed red)', hr: 'Alkohol (obojen crveno)' } },
    { id: 'water', b: 0.00021, color: 'c1', label: { en: 'Water (dyed blue)', hr: 'Voda (obojena plavo)' } },
    { id: 'mercury', b: 0.00018, color: '', label: { en: 'Mercury', hr: 'Živa' } }
  ];
  const MODES = [
    { value: 'rails', label: { en: 'Rails and bridges', hr: 'Tračnice i mostovi' } },
    { value: 'bimetal', label: { en: 'Bimetal strip', hr: 'Bimetalna traka' } },
    { value: 'ball', label: { en: 'Ball and ring', hr: 'Kuglica i prsten' } },
    { value: 'thermo', label: { en: 'Liquid thermometer', hr: 'Termometar s tekućinom' } },
    { value: 'air', label: { en: 'Air', hr: 'Zrak' } }
  ];
  const STRIP_H = 0.001, STRIP_L = 0.1, BEND_X = 6;   // bimetal strip: 1 mm thick, 10 cm long; bending drawn 6× exaggerated
  const HYST = 15, P_IRON = 1000, C_IRON = 450, H_IRON = 4, IRON_SPEED = 15;   // iron: 1000 W heater, 450 J/°C, loses 4 W per °C, time ×15
  const BALL_D = 25, HOLE_D = 25.05, BRASS = 0.000019, SIZE_X = 25, T_HOT = 300;   // brass ball and ring (mm); size change drawn 25× exaggerated
  const BULB = 500, TUBE = 250, LEVEL0 = 8;           // thermometer: bulb 500 mm³, tube 250 mm, column 8 mm high at −10 °C
  const NOTES = {
    rails: { en: 'Rails and bridges are built with expansion gaps so that they have room to grow on a hot day. ΔL = α · L · ΔT: a longer bar, a bigger temperature change or a material with a larger α expands more.',
      hr: 'Tračnice i mostovi grade se s malim razmacima (dilatacijskim reškama) kako bi se za vrućeg dana imali kamo produljiti. ΔL = α · L · ΔT: šipka se rasteže više ako je dulja, ako joj se temperatura više promijeni ili ako je od materijala s većim α.' },
    bimetal: { en: 'Two metals are bonded together. When heated, one expands more than the other, so the strip must bend: toward the metal that expands less. A thermostat uses this bending to switch a heater off and on.',
      hr: 'Dva su metala čvrsto spojena. Pri zagrijavanju jedan se rasteže više od drugoga pa se traka mora saviti: prema metalu koji se rasteže manje. Termostat zahvaljujući tom savijanju isključuje i uključuje grijač.' },
    ball: { en: 'A hole expands exactly as if it were filled with the same metal: a heated ring gets wider, not narrower. That is why a tight metal lid loosens under hot water.',
      hr: 'Otvor se širi točno kao da je ispunjen istim metalom: zagrijani prsten postaje širi, a ne uži. Zato se čvrsto zatvoren metalni poklopac olabavi pod vrućom vodom.' },
    thermo: { en: 'The liquid expands much more than the glass, so it climbs up the thin tube. Calibrating: mark the column in ice water (0 °C) and in boiling water (100 °C), then divide the distance into 100 equal parts.',
      hr: 'Tekućina se širi mnogo više od stakla pa se penje u tankoj cjevčici. Baždarenje: označi vrh stupca u vodi s ledom (0 °C) i u kipućoj vodi (100 °C) pa razmak podijeli na 100 jednakih dijelova.' },
    air: { en: 'Gases expand much more than liquids and solids. At constant pressure the volume of the air grows in step with its temperature in kelvin (V ∝ T), so the warm air needs more room and inflates the balloon.',
      hr: 'Plinovi se šire mnogo više od tekućina i čvrstih tijela. Pri stalnom tlaku obujam zraka raste razmjerno temperaturi u kelvinima (V ∝ T), pa topli zrak treba više mjesta i napuhuje balon.' }
  };
  function rgbOf(col) {
    col = (col || '#888').trim();
    if (col.startsWith('rgb')) { const p = col.replace(/rgba?\(([^)]+)\)/, '$1').split(',').map(s => parseFloat(s)); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
    let h = col.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
  }
  function mixColor(a, b, t) {
    const A = rgbOf(a), B = rgbOf(b); t = K.clamp(t, 0, 1);
    return 'rgb(' + Math.round(K.lerp(A[0], B[0], t)) + ',' + Math.round(K.lerp(A[1], B[1], t)) + ',' + Math.round(K.lerp(A[2], B[2], t)) + ')';
  }
  const ease = u => { u = K.clamp(u, 0, 1); return u * u * (3 - 2 * u); };
  const signed = (v, d, l) => (v > 0 ? '+' : '') + K.fmt(v, d, l);

  window.Sims.register({
    id: 'expansion',
    title: { en: 'Thermal Expansion', hr: 'Toplinsko rastezanje' },
    summary: {
      en: 'Heat things up and watch them grow: a rail that needs a gap, a bimetal strip that bends, a ball that no longer fits its ring, a thermometer you calibrate yourself and a balloon on a warm bottle.',
      hr: 'Zagrij tijela i promatraj kako se šire: tračnica kojoj treba razmak, bimetalna traka koja se savija, kuglica koja više ne prolazi kroz prsten, termometar koji sam baždariš i balon na toploj boci.'
    },
    tasks: [
      { en: 'Rails: a 25 m steel rail warms from 20 °C to 60 °C. How many millimetres does it grow? How big must the gap be so that it never buckles?', hr: 'Tračnice: čelična tračnica duga 25 m zagrije se s 20 °C na 60 °C. Za koliko se milimetara produlji? Koliki mora biti razmak da se tračnica nikad ne izvije?' },
      { en: 'Bimetal strip: which pair of metals bends the most? Switch the thermostat on and explain the zigzag graph.', hr: 'Bimetalna traka: koji se par metala najviše savija? Uključi termostat i objasni cik-cak graf.' },
      { en: 'Ball and ring: the hot ball is stuck. What can you do so that it passes again without cooling the ball?', hr: 'Kuglica i prsten: vruća kuglica je zapela. Što možeš učiniti da opet prođe, a da ne hladiš kuglicu?' },
      { en: 'Thermometer: mark 0 °C and 100 °C, then make the tube thinner. What happens to the scale, and why are real tubes so thin?', hr: 'Termometar: označi 0 °C i 100 °C pa stanji cjevčicu. Što se dogodi s ljestvicom i zašto su cjevčice pravih termometara tako tanke?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 340, maxHeight: 480 });
      const C = K.controls(container, lang);
      const tr = o => K.tr(o, lang), fm = (v, d) => K.fmt(v, d, lang);
      let seed = 5;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const st = { mode: 'rails', time: 0,
        r: { L: 25, mat: MATS[0], dT: 0, gap: 10 },
        b: { pair: PAIRS[0], T: T_REF, thermo: false, set: 140, on: true, t: 0, pts: [], xMax: 240, last: 0 },
        g: { Tb: T_REF, Tr: T_REF, tgtB: T_REF, tgtR: T_REF, ta: -1, fits: true, result: '' },
        t: { T: T_REF, d: 0.6, liq: LIQUIDS[0], m0: null, m100: null },
        a: { T: T_REF, Tair: T_REF, parts: [] } };

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'What expands?', hr: 'Što se širi?' }, options: MODES, value: 'rails', onChange: v => { st.mode = v; showControls(); refresh(); } });
      const slL = C.slider({ label: { en: 'Length L', hr: 'Duljina L' }, min: 1, max: 100, step: 1, value: 25, unit: 'm', digits: 0, onChange: v => { st.r.L = v; refresh(); } });
      const selMat = C.select({ label: { en: 'Material', hr: 'Materijal' }, options: MATS.map(m => ({ value: m.id, label: m.label })), value: 'steel',
        onChange: v => { st.r.mat = MATS.find(m => m.id === v) || MATS[0]; refresh(); } });
      const slDT = C.slider({ label: { en: 'Temperature change ΔT (from 20 °C)', hr: 'Promjena temperature ΔT (od 20 °C)' }, min: -30, max: 60, step: 1, value: 0, unit: '°C', digits: 0, onChange: v => { st.r.dT = v; refresh(); } });
      const slGap = C.slider({ label: { en: 'Expansion gap at 20 °C', hr: 'Dilatacijski razmak pri 20 °C' }, min: 0, max: 50, step: 1, value: 10, unit: 'mm', digits: 0, onChange: v => { st.r.gap = v; refresh(); } });
      const selPair = C.select({ label: { en: 'Two metals (top + bottom)', hr: 'Dva metala (gornji + donji)' }, options: PAIRS.map(p => ({ value: p.id, label: p.label })), value: PAIRS[0].id,
        onChange: v => { st.b.pair = PAIRS.find(p => p.id === v) || PAIRS[0]; refresh(); } });
      const slTb = C.slider({ label: { en: 'Temperature of the strip', hr: 'Temperatura trake' }, min: -20, max: 200, step: 5, value: T_REF, unit: '°C', digits: 0, onChange: v => { if (!st.b.thermo) st.b.T = v; refresh(); } });
      const tgThermo = C.toggle({ label: { en: 'Thermostat (iron)', hr: 'Termostat (glačalo)' }, value: false, onChange: v => setThermo(v) });
      const slSet = C.slider({ label: { en: 'Thermostat setting', hr: 'Postavka termostata' }, min: 60, max: 200, step: 10, value: 140, unit: '°C', digits: 0, onChange: v => { st.b.set = v; refresh(); } });
      const btnBall = C.button({ label: { en: 'Heat the ball', hr: 'Zagrij kuglicu' }, onClick: () => { st.g.tgtB = T_HOT; st.g.result = ''; kick(); } });
      const btnRing = C.button({ label: { en: 'Heat the ring', hr: 'Zagrij prsten' }, onClick: () => { st.g.tgtR = T_HOT; st.g.result = ''; kick(); } });
      const btnCool = C.button({ label: { en: 'Cool both', hr: 'Ohladi oboje' }, onClick: () => { st.g.tgtB = st.g.tgtR = T_REF; st.g.result = ''; kick(); } });
      const btnTry = C.button({ label: { en: 'Try!', hr: 'Probaj!' }, onClick: () => { st.g.ta = 0; st.g.fits = ballD() < holeD(); st.g.result = ''; kick(); } });
      const slTt = C.slider({ label: { en: 'Temperature of the bath', hr: 'Temperatura kupke' }, min: -10, max: 110, step: 1, value: T_REF, unit: '°C', digits: 0, onChange: v => { st.t.T = v; refresh(); } });
      const slTube = C.slider({ label: { en: 'Tube thickness (inside)', hr: 'Unutarnji promjer cjevčice' }, min: 0.3, max: 1.2, step: 0.1, value: 0.6, unit: 'mm', digits: 1,
        onChange: v => { st.t.d = v; st.t.m0 = st.t.m100 = null; refresh(); } });
      const selLiq = C.select({ label: { en: 'Liquid', hr: 'Tekućina' }, options: LIQUIDS.map(l => ({ value: l.id, label: l.label })), value: 'alcohol',
        onChange: v => { st.t.liq = LIQUIDS.find(l => l.id === v) || LIQUIDS[0]; st.t.m0 = st.t.m100 = null; refresh(); } });
      const btnM0 = C.button({ label: { en: 'Mark 0 °C', hr: 'Označi 0 °C' }, onClick: () => mark(0) });
      const btnM100 = C.button({ label: { en: 'Mark 100 °C', hr: 'Označi 100 °C' }, onClick: () => mark(100) });
      const slTa = C.slider({ label: { en: 'Water in the bowl', hr: 'Voda u posudi' }, min: 0, max: 90, step: 1, value: T_REF, unit: '°C', digits: 0, onChange: v => { st.a.T = v; kick(); refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Ispočetka' }, onClick: () => reset() });
      const outT = C.readout({ label: { en: 'Temperature', hr: 'Temperatura' }, unit: '°C', digits: 0 });
      const outDL = C.readout({ label: { en: 'Change in length ΔL', hr: 'Promjena duljine ΔL' }, unit: 'mm', digits: 1 });
      const outLen = C.readout({ label: { en: 'New length', hr: 'Nova duljina' }, unit: 'm', digits: 4 });
      const outGap = C.readout({ label: { en: 'Gap left', hr: 'Preostali razmak' }, unit: 'mm', digits: 1 });
      const outDefl = C.readout({ label: { en: 'Tip moves (10 cm strip)', hr: 'Pomak vrha (traka 10 cm)' }, unit: 'mm', digits: 1 });
      const outToward = C.readout({ label: { en: 'Bends toward', hr: 'Savija se prema' } });
      const outHeat = C.readout({ label: { en: 'Heater of the iron', hr: 'Grijač glačala' } });
      const outBall = C.readout({ label: { en: 'Ball diameter', hr: 'Promjer kuglice' }, unit: 'mm', digits: 2 });
      const outHole = C.readout({ label: { en: 'Hole in the ring', hr: 'Otvor prstena' }, unit: 'mm', digits: 2 });
      const outRes = C.readout({ label: { en: 'Does the ball pass?', hr: 'Prolazi li kuglica?' } });
      const outCol = C.readout({ label: { en: 'Column height', hr: 'Visina stupca' }, unit: 'mm', digits: 1 });
      const outSens = C.readout({ label: { en: 'Column rise per 1 °C', hr: 'Porast stupca po 1 °C' }, unit: 'mm', digits: 2 });
      const outRead = C.readout({ label: { en: 'Reading on your scale', hr: 'Očitanje na tvojoj ljestvici' }, unit: '°C', digits: 0 });
      const outTK = C.readout({ label: { en: 'Air temperature', hr: 'Temperatura zraka' }, unit: 'K', digits: 0 });
      const outDV = C.readout({ label: { en: 'Change of air volume', hr: 'Promjena obujma zraka' }, unit: '%', digits: 1 });
      const outML = C.readout({ label: { en: 'Change for a 1 L bottle', hr: 'Promjena za bocu od 1 L' }, unit: 'mL', digits: 0 });
      const note = C.note({ text: NOTES.rails });

      function fieldOf(c) {
        let e = c.el;
        while (e) {
          const cls = String(e.className || '').split(/\s+/);
          if (cls.indexOf('sk-field') >= 0) return e;
          if (cls.indexOf('sk-controls') >= 0) return c.el;
          e = e.parentNode;
        }
        return c.el;
      }
      const GROUPS = { rails: [slL, selMat, slDT, slGap, outDL, outLen, outGap], bimetal: [selPair, slTb, tgThermo, slSet, outDefl, outToward, outHeat],
        ball: [btnBall, btnRing, btnCool, btnTry, outBall, outHole, outRes], thermo: [slTt, slTube, selLiq, btnM0, btnM100, outCol, outSens, outRead], air: [slTa, outTK, outDV, outML] };
      function showControls() {
        Object.keys(GROUPS).forEach(m => GROUPS[m].forEach(c => { fieldOf(c).style.display = m === st.mode ? '' : 'none'; }));
        fieldOf(slSet).style.display = st.mode === 'bimetal' && st.b.thermo ? '' : 'none';
        fieldOf(outHeat).style.display = st.mode === 'bimetal' && st.b.thermo ? '' : 'none';
        fieldOf(outT).style.display = st.mode === 'ball' ? 'none' : '';
        note.set(NOTES[st.mode]);
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function kick() { if (!L.running) { L.start(); updatePlay(); } }

      // ---------- physics ----------
      const alphaOf = id => (MATS.find(m => m.id === id) || MATS[0]).a;
      const labelOf = id => (MATS.find(m => m.id === id) || MATS[0]).label;
      // bimetal of two equal layers, total thickness h: curvature κ = 1.5 · Δα · ΔT / h
      const kappa = T => 1.5 * (alphaOf(st.b.pair.bot) - alphaOf(st.b.pair.top)) * (T - T_REF) / STRIP_H;
      const tipMm = T => { const k = kappa(T); return Math.abs(k) < 1e-9 ? 0 : (1 - Math.cos(k * STRIP_L)) / k * 1000; };
      const ballD = () => BALL_D * (1 + BRASS * (st.g.Tb - T_REF));
      const holeD = () => HOLE_D * (1 + BRASS * (st.g.Tr - T_REF));
      const rise = () => BULB * st.t.liq.b / (Math.PI * st.t.d * st.t.d / 4);      // mm of column per °C: ΔV = V·β·ΔT spread over the tube's cross-section
      const level = T => LEVEL0 + rise() * (T + 10);                               // column height in mm
      const dVair = () => (st.a.Tair - T_REF) / (T_REF + 273.15) * 100;            // % change at constant pressure: V ∝ T (K)
      function setThermo(v) {
        const b = st.b;
        b.thermo = v; b.t = 0; b.last = 0; b.xMax = 240; b.on = b.T < b.set + HYST;
        if (!v) { b.T = Math.round(b.T / 5) * 5; slTb.set(b.T); }
        b.pts = [[0, b.T]];
        slTb.setDisabled(v);
        if (v) kick();
        showControls(); refresh();
      }
      function mark(Tm) {
        const t = st.t;
        t.T = Tm; slTt.set(Tm);
        if (level(Tm) <= TUBE) { if (Tm === 0) t.m0 = level(0); else t.m100 = level(100); }
        refresh();
      }
      function step(dt) {
        st.time += dt;
        const b = st.b, g = st.g, a = st.a;
        if (st.mode === 'bimetal' && b.thermo) {
          let rem = dt * IRON_SPEED;
          while (rem > 1e-9) {
            const hh = Math.min(0.25, rem); rem -= hh;
            b.T += ((b.on ? P_IRON : 0) - H_IRON * (b.T - T_REF)) / C_IRON * hh; b.t += hh;
            if (b.on && b.T >= b.set + HYST) b.on = false; else if (!b.on && b.T <= b.set - HYST) b.on = true;
          }
          if (b.t > b.xMax * 0.95) { b.xMax *= 2; b.pts = b.pts.filter((p, i) => i % 2 === 0); }
          if (b.t - b.last >= b.xMax / 300) { b.last = b.t; b.pts.push([b.t, b.T]); }
          slTb.set(Math.round(b.T));
        }
        if (st.mode === 'ball') {
          g.Tb += K.clamp(g.tgtB - g.Tb, -140 * dt, 140 * dt); g.Tr += K.clamp(g.tgtR - g.Tr, -140 * dt, 140 * dt);
          if (g.ta >= 0) {
            g.ta += dt;
            if (g.ta >= 0.8 && !g.result) g.result = g.fits ? 'pass' : 'stuck';
            if (g.ta > 2.8) g.ta = -1;
          }
        }
        if (st.mode === 'air') {
          a.Tair += (a.T - a.Tair) * Math.min(1, dt / 1.2);
          if (Math.abs(a.T - a.Tair) < 0.02) a.Tair = a.T;
          const sp = Math.sqrt((a.Tair + 273.15) / 293.15);
          a.parts.forEach(p => {
            p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
            if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); } else if (p.x > 1) { p.x = 1; p.vx = -Math.abs(p.vx); }
            if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); } else if (p.y > 1) { p.y = 1; p.vy = -Math.abs(p.vy); }
          });
        }
      }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        const m = st.mode, r = st.r, b = st.b, t = st.t;
        if (m === 'rails') {
          const dL = r.mat.a * r.L * r.dT * 1000, buckled = dL > r.gap + 1e-9;
          outT.set(T_REF + r.dT); outDL.set(dL); outLen.set(r.L + dL / 1000);
          outGap.set(buckled ? 0 : r.gap - dL); outGap.setColor(buckled ? theme.warn : '');
        } else if (m === 'bimetal') {
          const d = tipMm(b.T);
          outT.set(b.T); outDefl.set(Math.abs(d));
          outToward.set(Math.abs(b.T - T_REF) < 1 ? { en: 'straight', hr: 'ne savija se' } : labelOf(b.T > T_REF ? b.pair.top : b.pair.bot));
          outHeat.set(b.on ? { en: 'ON', hr: 'UKLJUČEN' } : { en: 'OFF', hr: 'ISKLJUČEN' });
        } else if (m === 'ball') {
          outBall.set(ballD()); outHole.set(holeD());
          outRes.set(st.g.result === 'pass' ? { en: 'yes, it passes', hr: 'da, prolazi' } : st.g.result === 'stuck' ? { en: 'no, it is stuck', hr: 'ne, zapela je' } : { en: 'press Try!', hr: 'pritisni „Probaj!“' });
          outRes.setColor(st.g.result === 'pass' ? theme.good : st.g.result === 'stuck' ? theme.warn : '');
        } else if (m === 'thermo') {
          const over = level(t.T) > TUBE;
          outT.set(t.T); outSens.set(rise());
          outCol.set(over ? { en: 'over ' + TUBE, hr: 'više od ' + TUBE } : level(t.T)); outCol.setColor(over ? theme.warn : '');
          outRead.set(t.m0 !== null && t.m100 !== null && !over ? (level(t.T) - t.m0) / (t.m100 - t.m0) * 100 : { en: '–', hr: '–' });
        } else {
          outT.set(st.a.T); outTK.set(st.a.Tair + 273.15);
          const dv = dVair(), sdv = { en: signed(dv, 1, 'en'), hr: signed(dv, 1, 'hr') }, sml = { en: signed(dv * 10, 0, 'en'), hr: signed(dv * 10, 0, 'hr') };
          outDV.set(sdv); outML.set(sml);
        }
      }

      // ---------- drawing helpers ----------
      function fit(c, str, x, y, maxW, o) {   // text that shrinks until it fits maxW
        o = o || {};
        const pre = o.bold ? 'bold ' : '', face = o.display ? theme.fontDisplay : theme.font;
        let size = o.size || 12;
        for (; size > 9; size--) { c.font = pre + size + 'px ' + face; if (c.measureText(str).width <= maxW) break; }
        K.text(c, str, x, y, { font: pre + size + 'px ' + face, color: o.color || theme.fg, align: o.align || 'left', baseline: o.baseline || 'middle' });
      }
      function flame(c, x, y, s, ph) {        // base centre (x, y), height about s
        const fh = s * (1 + 0.22 * Math.sin(st.time * 9 + ph));
        [[theme.c2, 0.45, 1], [theme.c4, 0.22, 0.55]].forEach(q => {
          c.fillStyle = q[0]; c.beginPath(); c.moveTo(x - s * q[1], y);
          c.quadraticCurveTo(x - s * q[1] * 1.2, y - fh * q[2] * 0.5, x, y - fh * q[2]); c.quadraticCurveTo(x + s * q[1] * 1.2, y - fh * q[2] * 0.5, x + s * q[1], y);
          c.closePath(); c.fill();
        });
      }
      function thermoIcon(c, x, top, bot, T, lo, hi) {
        const tw = 8, r = 7, yT = bot - K.clamp((T - lo) / (hi - lo), 0, 1) * (bot - top - 4);
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        K.roundRect(c, x - tw / 2, top, tw, bot - top, 4); c.fill(); c.stroke();
        c.beginPath(); c.arc(x, bot + r - 1, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = mixColor(theme.c1, theme.c8, (T - lo) / (hi - lo)); c.fillRect(x - 2, yT, 4, bot - yT + 2);
        c.beginPath(); c.arc(x, bot + r - 1, r - 3, 0, Math.PI * 2); c.fill();
        K.text(c, fm(T, 0) + ' °C', x, bot + 2 * r + 4, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
      }
      const head = (c, str, w) => fit(c, str, 12, 15, w - 24, { size: 14, bold: true, display: true });
      const foot = (c, obj, h, w) => fit(c, tr(obj), 12, h - 11, w - 24, { size: 11, color: theme.muted });

      // ---------- (a) rails and bridges ----------
      function drawRails(c, w, h) {
        const r = st.r, a = r.mat.a, dL = a * r.L * r.dT * 1000, buckled = dL > r.gap + 1e-9, T = T_REF + r.dT;
        const k = K.clamp((w - 200) * 0.3 / 50, 1.2, 4);                    // px per mm of expansion (exaggerated scale)
        const xA = 46, by = Math.round(h * 0.66), th = 18;
        const Lbar = (w - xA - 106 - 50 * k) * (0.55 + 0.45 * Math.sqrt(r.L / 100));
        const xE0 = xA + Lbar, xB = xE0 + r.gap * k, xE = buckled ? xB : xE0 + dL * k;
        const col = mixColor(theme.c1, theme.c8, (T + 10) / 90);
        c.fillStyle = theme.ground; c.fillRect(0, by + 36, w, h - by - 36);
        c.fillStyle = theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 1.5; K.roundRect(c, xA - 30, by + 18, xB + 70 - xA, 18, 3); c.fill(); c.stroke();
        for (let x = xA + 16; x < xE0 - 6; x += 44) { c.beginPath(); c.arc(x, by + th / 2 + 5, 5, 0, Math.PI * 2); c.fill(); c.stroke(); }   // rollers: the bar can slide
        c.fillStyle = theme.muted; K.roundRect(c, xA - 30, by - 34, 30, 54, 3); c.fill(); K.roundRect(c, xB, by - 34, 40, 54, 3); c.fill();
        K.text(c, tr({ en: 'fixed', hr: 'učvršćeno' }), xA - 15, by - 40, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
        if (buckled) {   // the bar has nowhere to go: it arches
          const A = Math.min(46, 8 + 2.4 * Math.sqrt(dL - r.gap));
          [[theme.fg, th + 3], [col, th]].forEach(q => {
            c.strokeStyle = q[0]; c.lineWidth = q[1]; c.beginPath();
            for (let i = 0; i <= 40; i++) { const u = i / 40, x = xA + (xB - xA) * u, y = by - A * Math.pow(Math.sin(Math.PI * u), 2); i ? c.lineTo(x, y) : c.moveTo(x, y); }
            c.stroke();
          });
        } else {
          c.fillStyle = col; c.strokeStyle = theme.fg; c.lineWidth = 1.5; K.roundRect(c, xA, by - th / 2, Math.max(4, xE - xA), th, 3); c.fill(); c.stroke();
          if (Math.abs(xE - xE0) > 1) {   // where the end was at 20 °C
            c.save(); c.setLineDash([4, 4]); c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xE0, by - th / 2 - 14); c.lineTo(xE0, by + th / 2 + 4); c.stroke(); c.restore();
            if (Math.abs(xE - xE0) > 9) K.arrow(c, xE0, by - th / 2 - 9, xE, by - th / 2 - 9, { color: theme.fg, width: 2, head: 7 });
          }
        }
        fit(c, 'ΔL = ' + signed(dL, 1, lang) + ' mm', K.clamp(xE0, 110, w - 70), by - 50, 200, { size: 14, bold: true, align: 'center' });
        K.text(c, 'L = ' + fm(r.L, 0) + ' m', (xA + xE0) / 2, by + 48, { font: '12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        fit(c, tr({ en: 'gap: ', hr: 'razmak: ' }) + fm(buckled ? 0 : r.gap - dL, 1) + ' mm', Math.min(w - 8, xB + 40), by + 64, 160, { size: 12, align: 'right' });
        thermoIcon(c, w - 30, 14, 14 + Math.min(74, h * 0.2), T, -10, 80);
        // formula with the current numbers
        head(c, tr(r.mat.label) + ' · α = ' + fm(a, 6) + tr({ en: ' per °C', hr: ' po °C' }), w - 50);
        const f1 = 'ΔL = α · L · ΔT = ' + fm(a, 6) + ' · ' + fm(r.L, 0) + ' m · ' + fm(r.dT, 0) + ' °C', f2 = '= ' + fm(dL / 1000, 4) + ' m = ' + fm(dL, 1) + ' mm';
        c.font = '13px ' + theme.font;
        const one = c.measureText(f1 + ' ' + f2).width <= w - 80;
        fit(c, one ? f1 + ' ' + f2 : f1, 12, 36, w - 80, { size: 13 });
        if (!one) fit(c, f2, 12, 53, w - 80, { size: 13 });
        const sy = one ? 55 : 71;
        if (buckled) fit(c, tr({ en: 'The rail buckles: the gap is too small!', hr: 'Tračnica se izvija: razmak je premalen!' }), 12, sy, w - 80, { size: 13, bold: true, color: theme.warn });
        else fit(c, tr({ en: 'Temperature: ', hr: 'Temperatura: ' }) + fm(T, 0) + ' °C', 12, sy, w - 80, { size: 12, color: theme.muted });
        foot(c, { en: 'Not to scale: the change in length is drawn much bigger than it really is.', hr: 'Nije u mjerilu: promjena duljine nacrtana je mnogo veća nego što stvarno jest.' }, h, w);
      }

      // ---------- (b) bimetal strip and thermostat ----------
      function stripPoint(ang, s, Lp) {       // point at fraction s along a strip of length Lp bent into an arc of total angle ang (up for ang > 0)
        if (Math.abs(ang) < 1e-4) return { x: s * Lp, y: 0, a: 0 };
        const R = Lp / ang;
        return { x: R * Math.sin(ang * s), y: -R * (1 - Math.cos(ang * s)), a: ang * s };
      }
      function drawBimetal(c, w, h) {
        const b = st.b;
        let sw = w, sh = h, gr = null;
        if (b.thermo && w >= 640) { sw = Math.round(w * 0.56); gr = { x: sw + 8, y: 8, w: w - sw - 16, h: h - 16 }; }
        else if (b.thermo) { sh = Math.round(h * 0.62); gr = { x: 8, y: sh + 2, w: w - 16, h: h - sh - 10 }; }
        const Lp = Math.max(60, Math.min(sw - 104, sh * (b.thermo ? 0.42 : 0.5))), xc = Math.max(40, (sw - Lp) / 2 - 20), yc = b.thermo ? sh * 0.56 : sh * 0.64, tl = K.clamp(Lp / 26, 5, 9);
        const angOf = T => kappa(T) * STRIP_L * BEND_X;
        const pt = (ang, s, off) => { const q = stripPoint(ang, s, Lp); return [xc + q.x - Math.sin(q.a) * off, yc + q.y - Math.cos(q.a) * off]; };
        const ang = angOf(b.T);
        head(c, tr({ en: 'Bimetal strip at ', hr: 'Bimetalna traka pri ' }) + fm(b.T, 0) + ' °C', sw);
        [[theme.c1, b.pair.top, { en: 'top: ', hr: 'gore: ' }], [theme.c2, b.pair.bot, { en: 'bottom: ', hr: 'dolje: ' }]].forEach((q, i) => {
          c.fillStyle = q[0]; c.fillRect(12, 29 + i * 16, 12, 8);
          fit(c, tr(q[2]) + tr(labelOf(q[1])).toLowerCase() + ', α = ' + fm(alphaOf(q[1]), 6), 30, 33 + i * 16, sw - 42, { size: 12 });
        });
        // heat source in the hand-controlled mode
        if (!b.thermo && b.T > 30) flame(c, xc + Lp * 0.5, yc + 46, 10 + (b.T - 30) / 9, 0);
        if (!b.thermo && b.T < 10) for (let i = 0; i < 3; i++) { c.fillStyle = theme.c1; K.roundRect(c, xc + Lp * (0.3 + 0.2 * i) - 6, yc + 26, 12, 12, 2); c.fill(); }
        if (b.thermo) {   // contact, wires, heater coil and the mains
          const tip = pt(ang, 1, -tl - 3), park = pt(angOf(b.set - HYST), 1, -tl - 3), con = b.on ? tip : park;
          const xt = xc + Lp + 26, yt = yc + 30, yb = Math.min(sh - 28, yc + 86), x1 = xc + Lp * 0.2, x2 = xc + Lp * 0.75;
          c.strokeStyle = b.on ? theme.fg : theme.muted; c.lineWidth = b.on ? 2.5 : 1.5;
          c.beginPath(); c.moveTo(con[0], con[1]); c.quadraticCurveTo(con[0] + 4, yt, xt, yt); c.lineTo(xt, yb); c.lineTo(x2, yb);
          c.moveTo(x1, yb); c.lineTo(xc - 12, yb); c.lineTo(xc - 12, yc + 22); c.stroke();
          c.strokeStyle = b.on ? theme.c8 : theme.muted; c.lineWidth = b.on ? 4 : 2; c.beginPath(); c.moveTo(x1, yb);      // heater coil
          for (let i = 1; i <= 12; i++) c.lineTo(x1 + (x2 - x1) * i / 12, yb + (i === 12 ? 0 : (i % 2 ? -7 : 7)));
          c.stroke();
          c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.arc(xt, (yt + yb) / 2, 10, 0, Math.PI * 2); c.fill(); c.stroke();
          K.text(c, '~', xt, (yt + yb) / 2, { font: 'bold 15px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          c.fillStyle = theme.fg; c.beginPath(); c.arc(con[0], con[1], 4.5, 0, Math.PI * 2); c.fill();
          fit(c, tr(b.on ? { en: 'contact closed: heater ON', hr: 'kontakt zatvoren: grijač UKLJUČEN' } : { en: 'contact open: heater OFF', hr: 'kontakt otvoren: grijač ISKLJUČEN' }), sw / 2, yb + 17, sw - 20,
            { size: 12, bold: true, align: 'center', color: b.on ? theme.fg : theme.muted });
        }
        // the two bonded layers
        c.fillStyle = theme.muted; K.roundRect(c, xc - 24, yc - 22, 24, 44, 4); c.fill();
        [[tl / 2, theme.c1], [-tl / 2, theme.c2]].forEach(q => {
          c.strokeStyle = q[1]; c.lineWidth = tl; c.lineCap = 'butt'; c.beginPath();
          for (let i = 0; i <= 30; i++) { const p = pt(ang, i / 30, q[0]); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
          c.stroke();
        });
        if (!b.thermo && Math.abs(b.T - T_REF) >= 1) {
          const tip = pt(ang, 1, 0);
          fit(c, fm(Math.abs(tipMm(b.T)), 1) + ' mm', Math.min(sw - 8, tip[0] + 56), tip[1] - 12, 80, { size: 12, bold: true, align: 'right' });
        }
        if (!b.thermo) foot(c, { en: 'It bends toward the metal that expands less. The bending is drawn 6× bigger.', hr: 'Savija se prema metalu koji se manje rasteže. Savijanje je nacrtano 6× veće.' }, h, w);
        if (gr) {
          const pts = b.pts.concat([[b.t, b.T]]);
          const ch = K.lineChart(c, { x: gr.x, y: gr.y, w: gr.w, h: gr.h, xMin: 0, xMax: b.xMax, yMin: 0, yMax: 250, xTicks: 4, yTicks: 5, nice: false,
            yLabel: { en: 'temperature of the iron (°C)', hr: 'temperatura glačala (°C)' }, series: [{ points: pts, color: theme.c1 }], theme, lang });
          K.text(c, tr({ en: 'time (s)', hr: 'vrijeme (s)' }), ch.px + ch.pw, ch.py + ch.ph + 15, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });
          c.save(); c.setLineDash([5, 4]); c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(ch.px, ch.sy(b.set)); c.lineTo(ch.px + ch.pw, ch.sy(b.set)); c.stroke(); c.restore();
          K.text(c, tr({ en: 'setting ', hr: 'postavka ' }) + fm(b.set, 0) + ' °C', ch.px + ch.pw - 4, ch.sy(b.set) + 4, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
        }
      }

      // ---------- (c) ball and ring ----------
      function drawBall(c, w, h) {
        const g = st.g, R0 = K.clamp(Math.min(w * 0.085, h * 0.115), 20, 52), xb = w * 0.42, yr = h * 0.66, top = 76;
        const Rb = R0 * (1 + SIZE_X * BRASS * (g.Tb - T_REF)), Rh = R0 * (1 + SIZE_X * (HOLE_D / BALL_D - 1) + SIZE_X * BRASS * (g.Tr - T_REF));
        const y0 = top + R0 + 8, yEnd = g.fits ? yr + 12 + Rb + 22 : yr - Math.sqrt(Math.max(0, Rb * Rb - Rh * Rh));
        const u = g.ta < 0 ? 0 : g.ta <= 0.8 ? ease(g.ta / 0.8) : g.ta <= 2 ? 1 : 1 - ease((g.ta - 2) / 0.8), yb = K.lerp(y0, yEnd, u);
        const hot = T => mixColor(theme.c4, theme.c8, (T - T_REF) / (T_HOT - T_REF));
        head(c, tr({ en: 'Brass ball and brass ring', hr: 'Mjedena kuglica i mjedeni prsten' }), w);
        fit(c, tr({ en: 'ball: ', hr: 'kuglica: ' }) + fm(g.Tb, 0) + ' °C, ' + fm(ballD(), 2) + ' mm', 12, 36, w - 24, { size: 12 });
        fit(c, tr({ en: 'hole in the ring: ', hr: 'otvor prstena: ' }) + fm(g.Tr, 0) + ' °C, ' + fm(holeD(), 2) + ' mm', 12, 53, w - 24, { size: 12 });
        // stand with the ring (seen from the side, cut through the middle)
        const bw = R0 * 0.9, px = xb + Rh + bw + R0 * 1.3;
        c.strokeStyle = theme.muted; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, yr + 6); c.lineTo(px, h - 26); c.moveTo(px - R0 * 1.4, h - 26); c.lineTo(px + R0 * 1.4, h - 26);
        c.moveTo(xb + Rh + bw, yr + 6); c.lineTo(px, yr + 6); c.stroke(); c.lineCap = 'butt';
        if (g.tgtR > g.Tr + 1) { flame(c, xb - Rh - bw / 2, yr + 34, 16, 0); flame(c, xb + Rh + bw / 2, yr + 34, 16, 2); }
        c.fillStyle = hot(g.Tr); c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        [xb - Rh - bw, xb + Rh].forEach(x => { K.roundRect(c, x, yr, bw, 12, 3); c.fill(); c.stroke(); });
        c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xb - Rh, yr + 20); c.lineTo(xb + Rh, yr + 20); c.moveTo(xb - Rh, yr + 15); c.lineTo(xb - Rh, yr + 25); c.moveTo(xb + Rh, yr + 15); c.lineTo(xb + Rh, yr + 25); c.stroke();
        // ball on its chain
        c.strokeStyle = theme.muted; c.lineWidth = 2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xb, top - 8); c.lineTo(xb, yb - Rb); c.stroke(); c.setLineDash([]);
        c.fillStyle = theme.muted; K.roundRect(c, xb - 22, top - 14, 44, 7, 3); c.fill();
        if (g.tgtB > g.Tb + 1 && g.ta < 0) flame(c, xb, yb + Rb + 26, 18, 1);
        c.fillStyle = hot(g.Tb); c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.arc(xb, yb, Rb, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = K.withAlpha('#ffffff', 0.35); c.beginPath(); c.arc(xb - Rb * 0.35, yb - Rb * 0.35, Rb * 0.28, 0, Math.PI * 2); c.fill();
        if (g.result) fit(c, tr(g.result === 'pass' ? { en: 'It passes!', hr: 'Prolazi!' } : { en: 'Stuck!', hr: 'Zapela je!' }), Math.min(w - 12, px + R0 * 2.6), y0, w * 0.4, { size: 20, bold: true, display: true, align: 'right', color: g.result === 'pass' ? theme.good : theme.warn });
        foot(c, { en: 'The change in size is drawn 25× bigger than it really is.', hr: 'Promjena veličine nacrtana je 25× veća nego što stvarno jest.' }, h, w);
      }

      // ---------- (d) liquid thermometer ----------
      function drawThermo(c, w, h) {
        const t = st.t, slim = w < 520, x = slim ? w * 0.62 : w * 0.5, yTop = 30, yBot = h - (slim ? 108 : 92), pxmm = (yBot - yTop) / TUBE, lv = level(t.T), over = lv > TUBE;
        const liq = t.liq.color ? theme[t.liq.color] : '#9aa3ad', bore = 2 + t.d * 5, yL = yBot - Math.min(lv, TUBE) * pxmm, yOf = mm => yBot - mm * pxmm;
        // bath
        const bx = x - 62, bt = yBot - 18, bb = h - (slim ? 28 : 12);
        c.fillStyle = K.withAlpha(mixColor(theme.c1, theme.c8, (t.T + 10) / 120), 0.45); c.fillRect(bx + 2, bt + 12, 120, bb - bt - 14);
        if (t.T <= 2) { c.fillStyle = theme.surface; c.strokeStyle = theme.c1; c.lineWidth = 1.5; [[10, 8], [34, 14], [92, 9]].forEach(q => { K.roundRect(c, bx + q[0], bt + q[1], 16, 14, 3); c.fill(); c.stroke(); }); }
        if (t.T >= 98) { c.fillStyle = K.withAlpha('#ffffff', 0.75); for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(bx + 14 + (i * 37) % 100, bb - 6 - ((st.time * 46 + i * 23) % (bb - bt - 22)), 3, 0, Math.PI * 2); c.fill(); } }
        c.strokeStyle = theme.fg; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, bt); c.lineTo(bx, bb); c.lineTo(bx + 124, bb); c.lineTo(bx + 124, bt); c.stroke();
        fit(c, tr(t.T <= 2 ? { en: 'ice water', hr: 'voda s ledom' } : t.T >= 98 ? { en: 'boiling water', hr: 'kipuća voda' } : { en: 'water bath', hr: 'vodena kupka' }), bx - 8, (bt + bb) / 2, bx - 14, { size: 11, align: 'right', color: theme.muted });
        // glass tube and bulb
        c.fillStyle = theme.surface; c.strokeStyle = theme.muted; c.lineWidth = 1.5;
        K.roundRect(c, x - 7, yTop - 8, 14, yBot - yTop + 16, 7); c.fill(); c.stroke();
        c.beginPath(); c.arc(x, yBot + 20, 15, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = liq; c.beginPath(); c.arc(x, yBot + 20, 12, 0, Math.PI * 2); c.fill(); c.fillRect(x - bore / 2, yL, bore, yBot + 12 - yL);
        // millimetre ruler on the left
        c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath();
        for (let mm = 0; mm <= TUBE; mm += 50) { c.moveTo(x - 8, yOf(mm)); c.lineTo(x - 14, yOf(mm)); }
        c.stroke();
        for (let mm = 0; mm <= TUBE; mm += 50) K.text(c, fm(mm, 0) + (mm === TUBE ? ' mm' : ''), x - 17, yOf(mm), { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        // your own marks and scale on the right
        const both = t.m0 !== null && t.m100 !== null;
        if (both) {
          const per = (t.m100 - t.m0) / 100 * pxmm, minor = per >= 3 ? 1 : per >= 1.2 ? 5 : 10;
          c.strokeStyle = theme.fg; c.lineWidth = 1; c.beginPath();
          for (let T = -10; T <= 110; T += minor) { const y = yOf(t.m0 + (t.m100 - t.m0) * T / 100); if (y >= yTop - 2) { c.moveTo(x + 8, y); c.lineTo(x + (T % 10 === 0 ? 17 : 12), y); } }
          c.stroke();
          const lab = per * 10 >= 13 ? 10 : per * 20 >= 13 ? 20 : 50;
          for (let T = -10; T <= 110; T += 10) { const y = yOf(t.m0 + (t.m100 - t.m0) * T / 100); if (y >= yTop - 2 && T % lab === 0 && T !== 0 && T !== 100) K.text(c, fm(T, 0), x + 20, y, { font: '10px ' + theme.font, color: theme.fg, baseline: 'middle' }); }
        }
        [[t.m0, 0], [t.m100, 100]].forEach(q => {
          if (q[0] === null) return;
          c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + 8, yOf(q[0])); c.lineTo(x + 22, yOf(q[0])); c.stroke();
          K.text(c, fm(q[1], 0) + ' °C', x + 26, yOf(q[0]), { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        // text
        const tw = slim ? x - 60 : w * 0.34;
        head(c, tr(t.liq.label), tw + 12);
        fit(c, 'β = ' + fm(t.liq.b, t.liq.b * 10000 % 1 < 1e-6 ? 4 : 5) + tr({ en: ' per °C', hr: ' po °C' }), 12, 36, tw, { size: 12 });
        fit(c, tr({ en: 'rise: ', hr: 'porast: ' }) + fm(rise(), 2) + tr({ en: ' mm per °C', hr: ' mm po °C' }), 12, 53, tw, { size: 12 });
        fit(c, tr({ en: 'bath: ', hr: 'kupka: ' }) + fm(t.T, 0) + ' °C', 12, 70, tw, { size: 12, bold: true });
        const msg = over ? { en: 'The liquid overflows! Use a thicker tube.', hr: 'Tekućina se prelijeva! Uzmi deblju cjevčicu.' }
          : both ? { en: '0 to 100 °C divided into 100 equal parts', hr: 'Od 0 do 100 °C podijeljeno na 100 jednakih dijelova' }
            : t.m0 === null && t.m100 === null ? { en: 'Mark 0 °C and 100 °C to make a scale', hr: 'Označi 0 °C i 100 °C da izradiš ljestvicu' } : { en: 'One mark made. Now the other one.', hr: 'Jedna je oznaka postavljena. Sada označi drugu.' };
        if (slim) foot(c, msg, h, w); else fit(c, tr(msg), w - 12, 36, w * 0.36, { size: 12, align: 'right', bold: over, color: over ? theme.warn : theme.muted });
        if (over) { c.fillStyle = liq; c.beginPath(); c.arc(x, yTop - 10, 5, 0, Math.PI * 2); c.fill(); }
      }

      // ---------- (e) air in a bottle with a balloon ----------
      function drawAir(c, w, h) {
        const a = st.a, wide = w >= 560, sw = wide ? w * 0.56 : w, x = sw * 0.5, dv = dVair();
        const bh = Math.min(h * 0.4, 150), bw = bh * 0.52, by = h - 40, bt = by - bh, nw = bw * 0.3, nt = bt - bh * 0.3;
        // bowl with water
        const ww = Math.min(sw * 0.78, bw * 3.4), wt = by - bh * 0.5;
        c.fillStyle = K.withAlpha(mixColor(theme.c1, theme.c8, a.T / 90), 0.5); c.fillRect(x - ww / 2 + 2, wt, ww - 4, by + 8 - wt);
        if (a.T >= 60) { c.strokeStyle = K.withAlpha(theme.muted, 0.7); c.lineWidth = 1.5; for (let s = 0; s < 4; s++) { const sx = x - ww * 0.38 + (s > 1 ? ww * 0.5 : 0) + s % 2 * ww * 0.14; c.beginPath(); for (let yy = 0; yy <= 22; yy += 2) c.lineTo(sx + 3 * Math.sin(yy / 5 + st.time * 2 + s), wt - 4 - yy); c.stroke(); } }
        if (a.T <= 4) { c.fillStyle = theme.surface; c.strokeStyle = theme.c1; c.lineWidth = 1.5; [-0.4, -0.27, 0.3].forEach(q => { K.roundRect(c, x + ww * q, wt - 5, 15, 13, 3); c.fill(); c.stroke(); }); }
        c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - ww / 2, wt - 12); c.lineTo(x - ww / 2, by + 9); c.lineTo(x + ww / 2, by + 9); c.lineTo(x + ww / 2, wt - 12); c.stroke();
        fit(c, tr({ en: 'water: ', hr: 'voda: ' }) + fm(a.T, 0) + ' °C', x, by + 22, sw - 20, { size: 12, bold: true, align: 'center' });
        // balloon
        const q = dv / 24, rMax = Math.min(h * 0.17, sw * 0.2), rb = rMax * Math.cbrt(Math.abs(q));
        c.fillStyle = K.withAlpha(theme.c5, 0.75); c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        if (q > 0.004) { c.beginPath(); c.ellipse(x, nt - rb * 1.05, rb * 0.92, rb * 1.1, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }
        else if (q < -0.004) { c.fillRect(x - nw / 2 + 2, nt, nw - 4, bt - nt + 4); c.beginPath(); c.ellipse(x, bt + rb * 0.7, Math.min(rb * 0.5, bw * 0.36), rb * 0.7, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }   // pulled into the bottle
        else { c.beginPath(); c.moveTo(x - nw / 2, nt); c.quadraticCurveTo(x + nw * 1.6, nt - 12, x + nw * 1.3, nt + 16); c.quadraticCurveTo(x + nw * 0.7, nt + 4, x + nw / 2, nt); c.closePath(); c.fill(); c.stroke(); }
        // bottle (glass) and the air particles inside
        c.fillStyle = K.withAlpha(theme.surface, 0.55); c.strokeStyle = theme.fg; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x - nw / 2, nt); c.lineTo(x - nw / 2, bt - 6); c.quadraticCurveTo(x - bw / 2, bt, x - bw / 2, bt + 14); c.lineTo(x - bw / 2, by - 6); c.quadraticCurveTo(x - bw / 2, by, x - bw / 2 + 6, by);
        c.lineTo(x + bw / 2 - 6, by); c.quadraticCurveTo(x + bw / 2, by, x + bw / 2, by - 6); c.lineTo(x + bw / 2, bt + 14); c.quadraticCurveTo(x + bw / 2, bt, x + nw / 2, bt - 6); c.lineTo(x + nw / 2, nt);
        c.fill(); c.stroke();
        c.fillStyle = theme.c5; c.fillRect(x - nw / 2 - 2, nt - 2, nw + 4, 5);
        c.fillStyle = theme.c1; c.beginPath();
        a.parts.forEach(p => { const X = x - bw / 2 + 6 + p.x * (bw - 12), Y = bt + 16 + p.y * (bh - 24); c.moveTo(X + 2.5, Y); c.arc(X, Y, 2.5, 0, Math.PI * 2); });
        c.fill();
        // text and comparison
        head(c, tr({ en: 'Air in a bottle: ', hr: 'Zrak u boci: ' }) + fm(a.Tair, 0) + ' °C = ' + fm(a.Tair + 273.15, 0) + ' K', w);
        fit(c, 'V₂ / V₁ = T₂ / T₁ = ' + fm(a.Tair + 273.15, 0) + ' K / ' + fm(T_REF + 273.15, 0) + ' K = ' + fm((a.Tair + 273.15) / (T_REF + 273.15), 3), 12, 36, w - 24, { size: 12 });
        fit(c, tr({ en: 'volume of the air: ', hr: 'obujam zraka: ' }) + signed(dv, 1, lang) + ' %', 12, 53, sw - 24, { size: 13, bold: true });
        const dT = a.Tair - T_REF, rows = [[{ en: 'air', hr: 'zrak' }, dv, theme.c1], [{ en: 'water', hr: 'voda' }, 0.00021 * dT * 100, theme.c2], [{ en: 'steel', hr: 'čelik' }, 3 * 0.000012 * dT * 100, theme.c3]];
        const cx = wide ? sw + 10 : 12, cw = wide ? w - sw - 22 : Math.min(w - 24, 220), cy = wide ? h * 0.36 : 70;
        if (wide || h >= 330) {
          const zero = cx + 58 + (cw - 110) * 0.25, sc = (cw - 110) * 0.75 / 25;
          if (wide) fit(c, tr({ en: 'Change of volume from 20 °C', hr: 'Promjena obujma od 20 °C' }), cx, cy - 16, cw, { size: 12, bold: true });
          rows.forEach((r, i) => {
            const y = cy + 6 + i * (wide ? 26 : 15), bhh = wide ? 14 : 8;
            K.text(c, tr(r[0]), cx, y + bhh / 2, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
            c.fillStyle = r[2]; c.fillRect(Math.min(zero, zero + r[1] * sc), y, Math.max(1.5, Math.abs(r[1] * sc)), bhh);
            K.text(c, signed(r[1], Math.abs(r[1]) < 1 ? 2 : 1, lang) + ' %', Math.max(zero, zero + r[1] * sc) + 5, y + bhh / 2, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
          });
          c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(zero, cy + 2); c.lineTo(zero, cy + 8 + rows.length * (wide ? 26 : 15)); c.stroke();
        }
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        c.lineCap = 'butt'; c.lineJoin = 'round';
        if (st.mode === 'rails') drawRails(c, w, h);
        else if (st.mode === 'bimetal') drawBimetal(c, w, h);
        else if (st.mode === 'ball') drawBall(c, w, h);
        else if (st.mode === 'thermo') drawThermo(c, w, h);
        else drawAir(c, w, h);
      }

      // ---------- lifecycle ----------
      function reset() {
        st.mode = 'rails'; segMode.set('rails'); st.time = 0;
        st.r = { L: 25, mat: MATS[0], dT: 0, gap: 10 }; slL.set(25); selMat.set('steel'); slDT.set(0); slGap.set(10);
        st.b = { pair: PAIRS[0], T: T_REF, thermo: false, set: 140, on: true, t: 0, pts: [[0, T_REF]], xMax: 240, last: 0 };
        selPair.set(PAIRS[0].id); slTb.set(T_REF); slTb.setDisabled(false); tgThermo.set(false); slSet.set(140);
        st.g = { Tb: T_REF, Tr: T_REF, tgtB: T_REF, tgtR: T_REF, ta: -1, fits: true, result: '' };
        st.t = { T: T_REF, d: 0.6, liq: LIQUIDS[0], m0: null, m100: null }; slTt.set(T_REF); slTube.set(0.6); selLiq.set('alcohol');
        seed = 5;
        st.a = { T: T_REF, Tair: T_REF, parts: Array.from({ length: 30 }, () => { const an = rnd() * Math.PI * 2; return { x: rnd(), y: rnd(), vx: 0.6 * Math.cos(an), vy: 0.6 * Math.sin(an) }; }) };
        slTa.set(T_REF);
        showControls();
        if (ctx.reducedMotion) L.stop(); else L.start();
        updatePlay(); refresh();
      }
      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; refresh(); },
        reset
      };
    }
  });
})();
