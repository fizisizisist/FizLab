/* FizLab sim: Liquids under pressure — (a) hydraulic lift (Pascal's law), (b) connected vessels and a U-tube,
   (c) air pressure: Torricelli barometer, Magdeburg hemispheres, drinking straw. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81, P0 = 101325, RHO_W = 1000, RHO_HG = 13595, TAU = Math.PI * 2;   // standard air pressure; mercury at 0 °C
  const S1MAX = 30;            // longest stroke of the small piston (cm)
  const HV = 30, DY = 0.25;    // vessel height (cm) and step of the volume tables
  const U_REST = 12;           // rest level of the water in the U-tube (cm)
  const KF = 80;               // flow conductance between the vessels (cm² / s)
  const COPPER = '#b87333';    // fixed physical colour of the Magdeburg hemispheres
  const SKIN = '#e2b08c';
  const LOADS = [
    { id: 'child', m: 30, label: { en: 'Child (30 kg)', hr: 'Dijete (30 kg)' } },
    { id: 'bike', m: 200, label: { en: 'Motorbike (200 kg)', hr: 'Motocikl (200 kg)' } },
    { id: 'car', m: 1200, label: { en: 'Car (1200 kg)', hr: 'Automobil (1200 kg)' } },
    { id: 'custom', m: 0, label: { en: 'Own mass (slider)', hr: 'Vlastita masa (klizač)' } }
  ];
  // Vessels: A(y) = cross-section (cm²) at height y (cm); drawn as flat vessels 5 cm deep, so the drawn width is A / 5.
  const VES = [
    { x: -32, A: () => 20, off: y => y / 5 },                                           // narrow leaning tube
    { x: -13, A: () => 60, off: () => 0 },                                              // wide jar
    { x: 6, A: y => 10 + 3 * y, off: () => 0 },                                         // funnel
    { x: 28, A: y => (y < 8 ? 80 : y < 16 ? 80 - 8.5 * (y - 8) : 12), off: () => 0 }    // flask
  ];
  VES.forEach(v => {
    v.cum = [0];
    for (let j = 1; j <= HV / DY; j++) v.cum.push(v.cum[j - 1] + DY * (v.A((j - 1) * DY) + v.A(j * DY)) / 2);
    v.cap = v.cum[v.cum.length - 1];
  });
  function volOf(v, h) { const f = K.clamp(h, 0, HV) / DY, j = Math.min(v.cum.length - 2, Math.floor(f)); return v.cum[j] + (v.cum[j + 1] - v.cum[j]) * (f - j); }
  function levelOf(v, V) {
    if (V <= 0) return 0;
    if (V >= v.cap) return HV;
    let lo = 0, hi = v.cum.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (v.cum[mid] <= V) lo = mid; else hi = mid; }
    return (lo + (V - v.cum[lo]) / (v.cum[hi] - v.cum[lo])) * DY;
  }
  const PLACES = [{ h: 120, name: 'Zagreb' }, { h: 1033, name: 'Sljeme' }, { h: 4800, name: 'Mont Blanc' }, { h: 8850, name: 'Mount Everest' }];
  const PROFILE = [[0, 0], [0.06, 120], [0.2, 1033], [0.32, 350], [0.5, 4800], [0.62, 2600], [0.8, 8850], [1, 5200], [1, 0]];

  window.Sims.register({
    id: 'hydraulics',
    title: { en: 'Liquids Under Pressure', hr: 'Tekućine i tlak' },
    summary: {
      en: 'Lift a car with a small push in a hydraulic lift, pour water into connected vessels, and measure the pressure of the air with a barometer.',
      hr: 'Podigni automobil malom silom u hidrauličnoj dizalici, ulijevaj vodu u spojene posude i izmjeri tlak zraka barometrom.'
    },
    tasks: [
      { en: 'Hydraulic lift: put the car (1200 kg) on the large piston. Find areas A₁ and A₂ so that a push of 100 N lifts it.', hr: 'Hidraulična dizalica: stavi automobil (1200 kg) na veliki klip. Pronađi površine A₁ i A₂ uz koje ga podigne sila od 100 N.' },
      { en: 'Pump the small piston down by 30 cm. How far does the load rise? Compare F₁ · s₁ with F₂ · s₂.', hr: 'Spusti mali klip za 30 cm. Koliko se podigne teret? Usporedi F₁ · s₁ i F₂ · s₂.' },
      { en: 'Connected vessels: close the valve, pour water into vessel 1, predict the levels, then open the valve.', hr: 'Spojene posude: zatvori ventil, ulij vodu u posudu 1, predvidi razine pa otvori ventil.' },
      { en: 'Air pressure: climb from Zagreb to Mount Everest. How many millimetres does the mercury column lose?', hr: 'Atmosferski tlak: popni se od Zagreba do Mount Everesta. Koliko milimetara izgubi stupac žive?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 300, maxHeight: 480 });
      const C = K.controls(container, lang);
      const T = o => K.tr(o, lang), N = (v, d) => K.fmt(v, d, lang);
      function defaults() {
        return { mode: 'lift', A1: 2, A2: 100, F1: 100, load: 'child', mass: 500, pump: 0, s1: 0,
          ves: 'four', V: VES.map(v => volOf(v, 10)), pend: 0, target: 1, valve: true, tilt: 0, spill: 0, oil: 10, oilNow: 10, rho: 920,
          air: 'baro', liq: 'hg', alt: 0, colNow: P0 / (RHO_HG * G), rad: 25, vac: true, strawL: 0.2, suck: 0, riseNow: 0, paused: false };
      }
      const st = defaults();
      let drag = null;

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Experiment', hr: 'Pokus' }, options: [
        { value: 'lift', label: { en: 'Hydraulic lift', hr: 'Hidraulična dizalica' } },
        { value: 'vessels', label: { en: 'Connected vessels', hr: 'Spojene posude' } },
        { value: 'air', label: { en: 'Air pressure', hr: 'Atmosferski tlak' } }], value: 'lift', onChange: v => { st.mode = v; drag = null; showControls(); refresh(); } });
      const slA1 = C.slider({ label: { en: 'Small piston area A₁', hr: 'Površina malog klipa A₁' }, min: 1, max: 20, step: 1, value: 2, unit: 'cm²', digits: 0, onChange: v => { st.A1 = v; refresh(); } });
      const slA2 = C.slider({ label: { en: 'Large piston area A₂', hr: 'Površina velikog klipa A₂' }, min: 20, max: 400, step: 10, value: 100, unit: 'cm²', digits: 0, onChange: v => { st.A2 = v; refresh(); } });
      const slF1 = C.slider({ label: { en: 'Push force F₁', hr: 'Sila guranja F₁' }, min: 0, max: 500, step: 5, value: 100, unit: 'N', digits: 0, onChange: v => { st.F1 = v; refresh(); } });
      const selLoad = C.select({ label: { en: 'Load on the large piston', hr: 'Teret na velikom klipu' }, options: LOADS.map(l => ({ value: l.id, label: l.label })), value: 'child', onChange: v => { st.load = v; refresh(); } });
      const slMass = C.slider({ label: { en: 'Own mass of the load', hr: 'Vlastita masa tereta' }, min: 10, max: 2000, step: 10, value: 500, unit: 'kg', digits: 0, onChange: v => { st.mass = v; st.load = 'custom'; selLoad.set('custom'); refresh(); } });
      const slPump = C.slider({ label: { en: 'Pump: small piston pushed down s₁', hr: 'Pumpaj: mali klip spušten za s₁' }, min: 0, max: S1MAX, step: 0.5, value: 0, unit: 'cm', digits: 1, onChange: v => { st.pump = v; refresh(); } });
      const segVes = C.segmented({ label: { en: 'Apparatus', hr: 'Pribor' }, options: [
        { value: 'four', label: { en: 'Four vessels', hr: 'Četiri posude' } }, { value: 'utube', label: { en: 'U-tube: oil and water', hr: 'U-cijev: ulje i voda' } }], value: 'four', onChange: v => { st.ves = v; showControls(); refresh(); } });
      const segTarget = C.segmented({ label: { en: 'Pour into vessel', hr: 'Ulij u posudu' }, options: [0, 1, 2, 3].map(i => ({ value: i, label: String(i + 1) })), value: 1, onChange: v => { st.target = v; refresh(); } });
      const btnPour = C.button({ label: { en: 'Pour in 250 mL', hr: 'Ulij 250 mL' }, variant: 'primary', onClick: () => pour(250) });
      const btnDrain = C.button({ label: { en: 'Take out 250 mL', hr: 'Izvadi 250 mL' }, onClick: () => pour(-250) });
      const tgValve = C.toggle({ label: { en: 'Valve to vessel 1 open', hr: 'Ventil prema posudi 1 otvoren' }, value: true, onChange: v => { st.valve = v; refresh(); } });
      const slTilt = C.slider({ label: { en: 'Tilt the table', hr: 'Nagni stol' }, min: -12, max: 12, step: 1, value: 0, format: (v, l) => K.fmt(v, 0, l) + '°', onChange: v => { st.tilt = v; refresh(); } });
      const slOil = C.slider({ label: { en: 'Oil column h₁', hr: 'Stupac ulja h₁' }, min: 0, max: 20, step: 0.5, value: 10, unit: 'cm', digits: 1, onChange: v => { st.oil = v; refresh(); } });
      const slRho = C.slider({ label: { en: 'Density of the oil ρ₁', hr: 'Gustoća ulja ρ₁' }, min: 600, max: 1000, step: 10, value: 920, unit: 'kg/m³', digits: 0, onChange: v => { st.rho = v; refresh(); } });
      const segAir = C.segmented({ label: { en: 'Show', hr: 'Prikaži' }, options: [
        { value: 'baro', label: { en: 'Barometer', hr: 'Barometar' } }, { value: 'magd', label: { en: 'Magdeburg hemispheres', hr: 'Magdeburške polukugle' } },
        { value: 'straw', label: { en: 'Drinking straw', hr: 'Slamka' } }], value: 'baro', onChange: v => { st.air = v; drag = null; showControls(); refresh(); } });
      const selLiq = C.select({ label: { en: 'Liquid in the barometer', hr: 'Tekućina u barometru' }, options: [
        { value: 'hg', label: { en: 'Mercury (about 13 600 kg/m³)', hr: 'Živa (oko 13 600 kg/m³)' } }, { value: 'water', label: { en: 'Water (1000 kg/m³)', hr: 'Voda (1000 kg/m³)' } }], value: 'hg',
        onChange: v => { st.liq = v; st.colNow = targets().col; refresh(); } });
      const slAlt = C.slider({ label: { en: 'Altitude', hr: 'Nadmorska visina' }, min: 0, max: 9000, step: 10, value: 0, unit: 'm', digits: 0, onChange: v => { st.alt = v; refresh(); } });
      const slRad = C.slider({ label: { en: 'Radius of the hemispheres r', hr: 'Polumjer polukugli r' }, min: 5, max: 50, step: 1, value: 25, unit: 'cm', digits: 0, onChange: v => { st.rad = v; refresh(); } });
      const tgVac = C.toggle({ label: { en: 'Air pumped out', hr: 'Zrak ispumpan' }, value: true, onChange: v => { st.vac = v; refresh(); } });
      const slStraw = C.slider({ label: { en: 'Length of the straw', hr: 'Duljina slamke' }, min: 0.2, max: 12, step: 0.1, value: 0.2, unit: 'm', digits: 1, onChange: v => { st.strawL = v; refresh(); } });
      const slSuck = C.slider({ label: { en: 'Suck: pressure in the mouth lowered by', hr: 'Usiši: tlak u ustima smanjen za' }, min: 0, max: 100, step: 1, value: 0, unit: '%', digits: 0, onChange: v => { st.suck = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, onClick: () => { L.toggle(); st.paused = !L.running; updatePlay(); refresh(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: reset });
      const outP = C.readout({ label: { en: 'Pressure in the oil', hr: 'Tlak u ulju' }, unit: 'kPa', digits: 1 });
      const outF2 = C.readout({ label: { en: 'Force on the large piston F₂', hr: 'Sila na veliki klip F₂' }, unit: 'N', digits: 0 });
      const outG = C.readout({ label: { en: 'Weight of the load G', hr: 'Težina tereta G' }, unit: 'N', digits: 0 });
      const outS2 = C.readout({ label: { en: 'Load raised by s₂', hr: 'Teret podignut za s₂' }, unit: 'cm', digits: 2 });
      const outW1 = C.readout({ label: { en: 'Work in F₁ · s₁', hr: 'Uloženi rad F₁ · s₁' }, unit: 'J', digits: 1 });
      const outW2 = C.readout({ label: { en: 'Work out F₂ · s₂', hr: 'Dobiveni rad F₂ · s₂' }, unit: 'J', digits: 1 });
      const outLift = C.readout({ label: { en: 'Lift', hr: 'Dizalica' } });
      const outVol = C.readout({ label: { en: 'Water in the vessels', hr: 'Vode u posudama' }, unit: 'mL', digits: 0 });
      const outLvl = C.readout({ label: { en: 'Levels', hr: 'Razine' } });
      const outH2 = C.readout({ label: { en: 'Water column h₂', hr: 'Stupac vode h₂' }, unit: 'cm', digits: 1 });
      const outRatH = C.readout({ label: { en: 'Heights h₂ / h₁', hr: 'Visine h₂ / h₁' }, digits: 2 });
      const outRatR = C.readout({ label: { en: 'Densities ρ₁ / ρ₂', hr: 'Gustoće ρ₁ / ρ₂' }, digits: 2 });
      const outPa = C.readout({ label: { en: 'Air pressure (approx.)', hr: 'Tlak zraka (približno)' }, unit: 'kPa', digits: 1 });
      const outCol = C.readout({ label: { en: 'Height of the column', hr: 'Visina stupca' }, unit: 'm', digits: 3 });
      const outFm = C.readout({ label: { en: 'Force to pull them apart', hr: 'Sila za razdvajanje' }, unit: 'N', digits: 0 });
      const outCmp = C.readout({ label: { en: 'That is the weight of', hr: 'To je težina' } });
      const outRise = C.readout({ label: { en: 'Drink rises by', hr: 'Piće se popne za' }, unit: 'm', digits: 2 });
      const outPm = C.readout({ label: { en: 'Pressure in the mouth', hr: 'Tlak u ustima' }, unit: 'kPa', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });

      function fieldOf(ctrl) { const el = ctrl.el; return el.classList.contains('sk-field') ? el : el.parentElement; }
      function show(list, on) { list.forEach(ct => { fieldOf(ct).style.display = on ? '' : 'none'; }); }
      function showControls() {
        const m = st.mode, four = m === 'vessels' && st.ves === 'four', ut = m === 'vessels' && st.ves === 'utube';
        show([slA1, slA2, slF1, selLoad, slMass, slPump, outP, outF2, outG, outS2, outW1, outW2, outLift], m === 'lift');
        show([segVes], m === 'vessels');
        show([segTarget, btnPour, btnDrain, tgValve, slTilt, outVol, outLvl], four);
        show([slOil, slRho, outH2, outRatH, outRatR], ut);
        show([segAir, slAlt, outPa], m === 'air');
        show([selLiq, outCol], m === 'air' && st.air === 'baro');
        show([slRad, tgVac, outFm, outCmp], m === 'air' && st.air === 'magd');
        show([slStraw, slSuck, outRise, outPm], m === 'air' && st.air === 'straw');
        cv.canvas.style.cursor = 'default';
      }

      // ---------- physics ----------
      function lift() {
        const p = st.F1 / (st.A1 * 1e-4), F2 = p * st.A2 * 1e-4;
        const m = st.load === 'custom' ? st.mass : LOADS.find(l => l.id === st.load).m, Gw = m * G;
        return { p, F2, m, Gw, ok: F2 >= Gw, s2: st.s1 * st.A1 / st.A2 };
      }
      function pAir() { return P0 * Math.exp(-st.alt / 8000); }       // approximate (isothermal) atmosphere
      function strawRise() { return pAir() * st.suck / 100 / (RHO_W * G); }
      function targets() {
        return { s1: lift().ok ? st.pump : 0, col: pAir() / ((st.liq === 'water' ? RHO_W : RHO_HG) * G), rise: Math.min(st.strawL, strawRise()) };
      }
      function heads(tanT) { return VES.map((v, i) => { const h = levelOf(v, st.V[i]); return h + (v.x + v.off(h)) * tanT; }); }
      function flow(dt) {
        const tanT = Math.tan(st.tilt * Math.PI / 180), rate = 500 * dt;   // pouring speed 500 mL/s
        if (st.pend > 0) { const dv = Math.min(st.pend, rate); st.pend -= dv; st.V[st.target] += dv; }
        else if (st.pend < 0) { const dv = Math.min(-st.pend, rate, st.V[st.target]); st.pend += dv; st.V[st.target] -= dv; if (dv <= 1e-9) st.pend = 0; }
        const groups = st.valve ? [[0, 1, 2, 3]] : [[0], [1, 2, 3]], n = 4, hs = dt / n;
        for (let s = 0; s < n; s++) {
          const hd = heads(tanT);
          groups.forEach(g => {
            let act = g.slice(), P = 0;
            for (let it = 0; it < 4; it++) {       // empty vessels standing above the common level take no part
              P = act.reduce((a, i) => a + hd[i], 0) / act.length;
              const keep = act.filter(i => st.V[i] > 1e-6 || hd[i] < P);
              if (keep.length === act.length || !keep.length) break;
              act = keep;
            }
            act.forEach(i => { st.V[i] = Math.max(0, st.V[i] + KF * (P - hd[i]) * hs); });
          });
        }
        st.V.forEach((V, i) => { if (V > VES[i].cap) { st.V[i] = VES[i].cap; st.spill = 2.5; } });
        if (st.spill > 0) st.spill -= dt;
      }
      function step(dt) {
        const t = targets();
        if (st.mode === 'lift') { const d = t.s1 - st.s1, v = (d > 0 ? 25 : 12) * dt; st.s1 += K.clamp(d, -v, v); }
        else if (st.mode === 'vessels') {
          if (st.ves === 'four') flow(dt); else st.oilNow += K.clamp(st.oil - st.oilNow, -15 * dt, 15 * dt);
        } else { const k = Math.min(1, 5 * dt); st.colNow += (t.col - st.colNow) * k; st.riseNow += (t.rise - st.riseNow) * k; }
      }
      function settle() { for (let i = 0; i < 300; i++) step(0.03); }
      function pour(v) { st.pend = K.clamp(st.pend + v, -1000, 1000); refresh(); }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { if (!L.running && !st.paused) settle(); updateOut(); draw(); }

      function updateOut() {
        if (st.mode === 'lift') {
          const q = lift(), ratio = st.A2 / st.A1;
          outP.set(q.p / 1000); outF2.set(q.F2); outG.set(q.Gw); outS2.set(q.s2); outW1.set(st.F1 * st.s1 / 100); outW2.set(q.F2 * q.s2 / 100);
          outLift.set(q.ok ? { en: 'lifts the load', hr: 'diže teret' } : { en: 'force too small', hr: 'premala sila' }); outLift.setColor(q.ok ? theme.good : theme.warn);
          note.set(q.ok
            ? { en: 'Pascal\'s law: pressing the small piston raises the pressure everywhere in the oil by the same amount. The large piston is ' + K.fmt(ratio, 1, 'en') + ' times bigger, so the force is ' + K.fmt(ratio, 1, 'en') + ' times bigger, but the load moves ' + K.fmt(ratio, 1, 'en') + ' times less. The work stays the same.',
              hr: 'Pascalov zakon: pritisak na mali klip poveća tlak svuda u ulju jednako. Veliki klip je ' + K.fmt(ratio, 1, 'hr') + ' puta veći pa je sila ' + K.fmt(ratio, 1, 'hr') + ' puta veća, ali se teret pomakne ' + K.fmt(ratio, 1, 'hr') + ' puta manje. Rad ostaje isti.' }
            : { en: 'F₂ = ' + K.fmt(q.F2, 0, 'en') + ' N is smaller than the weight G = ' + K.fmt(q.Gw, 0, 'en') + ' N, so the load stays down. Push harder, make the small piston smaller or the large piston bigger.',
              hr: 'F₂ = ' + K.fmt(q.F2, 0, 'hr') + ' N manja je od težine G = ' + K.fmt(q.Gw, 0, 'hr') + ' N pa teret ostaje dolje. Guraj jače, smanji mali klip ili povećaj veliki.' });
        } else if (st.mode === 'vessels' && st.ves === 'four') {
          const hd = heads(Math.tan(st.tilt * Math.PI / 180)), grp = (st.valve ? [0, 1, 2, 3] : [1, 2, 3]).filter(i => st.V[i] > 0.5);
          const same = grp.length < 2 || Math.max.apply(null, grp.map(i => hd[i])) - Math.min.apply(null, grp.map(i => hd[i])) < 0.08;
          outVol.set(st.V.reduce((a, b) => a + b, 0));
          outLvl.set(same && st.pend === 0 ? { en: 'same level', hr: 'ista razina' } : { en: 'water is flowing', hr: 'voda teče' }); outLvl.setColor(same && st.pend === 0 ? theme.good : theme.warn);
          if (st.spill > 0) note.set({ en: 'A vessel is full to the brim: the extra water spills over.', hr: 'Posuda je puna do ruba: višak vode se prelijeva.' });
          else if (!st.valve) note.set({ en: 'The valve is closed: vessel 1 is cut off, so its level can be different. Predict what happens, then open the valve.', hr: 'Ventil je zatvoren: posuda 1 je odvojena pa njezina razina može biti drukčija. Predvidi što će se dogoditi pa otvori ventil.' });
          else if (st.tilt !== 0) note.set({ en: 'The table is tilted, but the water surface stays horizontal and at one height in all vessels. A spirit level and a builder\'s hose level work this way.', hr: 'Stol je nagnut, ali površina vode ostaje vodoravna i na istoj visini u svim posudama. Tako rade libela i vodena vaga od crijeva.' });
          else note.set({ en: 'In connected vessels the liquid stands at the same level, whatever the shape or width of the vessel. That is how a water tower fills the taps of a whole town.', hr: 'U spojenim posudama tekućina stoji na istoj razini, bez obzira na oblik i širinu posude. Tako vodotoranj puni slavine cijeloga grada.' });
        } else if (st.mode === 'vessels') {
          const h2 = st.rho * st.oilNow / RHO_W;
          outH2.set(h2); outRatH.set(st.oilNow > 0.05 ? h2 / st.oilNow : null); outRatR.set(st.rho / RHO_W);
          note.set({ en: 'At the dashed line both columns press equally: ρ₁ · h₁ = ρ₂ · h₂. The lighter liquid needs the taller column, so the heights are inversely proportional to the densities.',
            hr: 'Na crtkanoj razini oba stupca tlače jednako: ρ₁ · h₁ = ρ₂ · h₂. Rjeđa tekućina treba viši stupac pa su visine obrnuto razmjerne gustoćama.' });
        } else {
          const p = pAir(), hMax = p / (RHO_W * G);
          outPa.set(p / 1000);
          if (st.air === 'baro') {
            outCol.set(targets().col);
            note.set(st.liq === 'hg'
              ? { en: 'The air presses on the mercury in the dish and holds up a column of about 760 mm at sea level. Higher up there is less air above you, so the column is shorter. The pressure at each altitude is an approximate value.', hr: 'Zrak tlači živu u posudi i drži stupac visok oko 760 mm na razini mora. Na većoj visini iznad tebe je manje zraka pa je stupac niži. Tlak na pojedinoj visini približna je vrijednost.' }
              : { en: 'Water is 13.6 times less dense than mercury, so the same air pressure holds up a column 13.6 times taller: about 10.3 m at sea level. The scale of the tube is broken (zigzag) so that it fits.', hr: 'Voda je 13,6 puta rjeđa od žive pa isti tlak zraka drži 13,6 puta viši stupac: oko 10,3 m na razini mora. Mjerilo cijevi je prekinuto (cik-cak) da cijev stane na sliku.' });
          } else if (st.air === 'magd') {
            const F = magdForce(), cars = F / (1200 * G), people = F / (70 * G);
            outFm.set(F);
            outCmp.set(cars >= 1 ? { en: K.fmt(cars, 1, 'en') + ' cars', hr: K.fmt(cars, 1, 'hr') + ' automobila' } : { en: K.fmt(people, 1, 'en') + ' adults', hr: K.fmt(people, 1, 'hr') + ' odraslih' });
            note.set(st.vac
              ? { en: 'With the air pumped out nothing pushes from the inside. The outside air presses the two halves together with F = p · π · r². Otto von Guericke showed in Magdeburg that teams of horses could hardly pull them apart.', hr: 'Kad je zrak ispumpan, iznutra ništa ne gura. Vanjski zrak pritišće polukugle jednu uz drugu silom F = p · π · r². Otto von Guericke pokazao je u Magdeburgu da ih ni zaprege konja jedva mogu razdvojiti.' }
              : { en: 'With air inside, the pressure is the same inside and outside. The forces cancel and the halves come apart easily.', hr: 'Kad je unutra zrak, tlak je jednak iznutra i izvana. Sile se poništavaju i polukugle se lako razdvoje.' });
          } else {
            outRise.set(Math.min(st.strawL, strawRise())); outPm.set(p * (1 - st.suck / 100) / 1000);
            note.set({ en: 'You do not pull the drink up. You lower the pressure in your mouth and the outside air pushes the drink up the straw. Even a perfect vacuum cannot lift water higher than ' + K.fmt(hMax, 1, 'en') + ' m here.',
              hr: 'Ne vučeš piće prema gore. Smanjiš tlak u ustima, a vanjski zrak gura piće uz slamku. Ni savršeni vakuum ovdje ne može podići vodu više od ' + K.fmt(hMax, 1, 'hr') + ' m.' });
          }
        }
      }
      function magdForce() { const r = st.rad / 100; return st.vac ? pAir() * Math.PI * r * r : 0; }

      // ---------- geometry shared by drawing and pointer ----------
      function liftGeom() {
        const w = cv.w, h = cv.h, baseY = h - 30, floorY = baseY - 20, pxc = (floorY - 96) / 78;
        return { baseY, floorY, pxc, x1: Math.round(w * 0.2), x2: Math.round(w * 0.64), kx: Math.min(w * 0.3, 190) / 20,
          Y: cm => floorY - cm * pxc, yH: floorY - (74 - st.s1) * pxc };
      }
      function vesGeom() {
        const w = cv.w, h = cv.h, s = Math.min((w - 24) / 78, (h - 76) / 53);
        return { s, px: w / 2, py: h - 28 - 9.2 * s, th: st.tilt * Math.PI / 180 };
      }
      // screen position of the apparatus point (X, Y) in cm; the table pivots about (1, −5)
      function vesPoint(g, X, Y) {
        const x = (X - 1) * g.s, y = -(Y + 5) * g.s, cs = Math.cos(g.th), sn = Math.sin(g.th);
        return { x: g.px + x * cs + y * sn, y: g.py - x * sn + y * cs };
      }
      function vesselAt(p) {
        const g = vesGeom(), dx = p.x - g.px, dy = p.y - g.py, cs = Math.cos(g.th), sn = Math.sin(g.th);
        const X = (dx * cs - dy * sn) / g.s + 1, Y = -(dx * sn + dy * cs) / g.s - 5;
        if (Y < -3 || Y > HV + 6) return -1;
        const yy = K.clamp(Y, 0, HV);
        return VES.findIndex(v => Math.abs(X - v.x - v.off(yy)) < v.A(yy) / 10 + 3);
      }
      function baroGeom() {
        const w = cv.w, h = cv.h, split = Math.round(w * (w < 520 ? 0.54 : 0.58));
        return { split, ax: split + 16, aTop: 50, aBot: h - 30 };
      }
      function setAlt(y) {
        const g = baroGeom();
        st.alt = Math.round(K.clamp((g.aBot - y) / (g.aBot - g.aTop), 0, 1) * 900) * 10; slAlt.set(st.alt); refresh();
      }

      // ---------- pointer ----------
      function onDown(ev) {
        const p = cv.pointer(ev);
        if (st.mode === 'lift') {
          const g = liftGeom();
          if (Math.abs(p.x - g.x1) < 32 && Math.abs(p.y - g.yH) < 28) drag = { kind: 'pump', y: p.y, v: st.pump, pxc: g.pxc };
        } else if (st.mode === 'vessels' && st.ves === 'four') {
          const i = vesselAt(p);
          if (i >= 0) { st.target = i; segTarget.set(i); pour(250); }
        } else if (st.mode === 'air' && st.air === 'baro' && p.x > baroGeom().ax - 16) { drag = { kind: 'alt' }; setAlt(p.y); }
        if (!drag) return;
        try { cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        cv.canvas.style.cursor = 'grabbing'; ev.preventDefault();
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (drag && drag.kind === 'pump') { st.pump = K.clamp(Math.round((drag.v + (p.y - drag.y) / drag.pxc) * 2) / 2, 0, S1MAX); slPump.set(st.pump); refresh(); }
        else if (drag) setAlt(p.y);
        else if (st.mode === 'lift') { const g = liftGeom(); cv.canvas.style.cursor = Math.abs(p.x - g.x1) < 32 && Math.abs(p.y - g.yH) < 28 ? 'grab' : 'default'; }
        else if (st.mode === 'vessels' && st.ves === 'four') cv.canvas.style.cursor = vesselAt(p) >= 0 ? 'pointer' : 'default';
        else if (st.mode === 'air' && st.air === 'baro') cv.canvas.style.cursor = p.x > baroGeom().ax - 16 ? 'ns-resize' : 'default';
      }
      function onUp() { if (drag) { drag = null; cv.canvas.style.cursor = 'default'; } }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      cv.canvas.addEventListener('pointerup', onUp);
      cv.canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);

      // ---------- drawing helpers ----------
      function label(c, str, x, y, o) {      // text kept inside the canvas, on a soft background
        o = o || {};
        const font = (o.bold ? 'bold ' : '') + (o.size || 12) + 'px ' + theme.font;
        c.font = font;
        const tw = c.measureText(str).width;
        let tx = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
        tx = K.clamp(tx, 4, Math.max(4, cv.w - tw - 4));
        if (o.dot) tx = Math.max(tx, 22);
        if (o.bg !== false) { c.fillStyle = K.withAlpha(theme.surface, 0.82); K.roundRect(c, tx - (o.dot ? 20 : 4), y - 9, tw + (o.dot ? 24 : 8), 18, 5); c.fill(); }
        if (o.dot) { c.fillStyle = o.dot; c.beginPath(); c.arc(tx - 11, y, 5, 0, TAU); c.fill(); }
        K.text(c, str, tx, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function head(c, lines, maxW) {         // header lines, shrunk until they fit
        let y = 18;
        lines.forEach((s, i) => {
          let px = i ? 12 : 14, font;
          do { font = (i ? '' : 'bold ') + px + 'px ' + (i ? theme.font : theme.fontDisplay); c.font = font; px--; } while (c.measureText(s).width > maxW && px >= 9);
          K.text(c, s, 10, y, { font, color: theme.fg, baseline: 'middle' }); y += i ? 17 : 19;
        });
      }
      const aLen = F => (F <= 0 ? 0 : 14 + 11 * Math.log10(1 + F));    // arrow length for forces from 1 N to 100 kN
      function drawLoad(c, id, cx, by, m) {
        if (id === 'child') {
          c.fillStyle = theme.c5; K.roundRect(c, cx - 9, by - 28, 18, 28, 5); c.fill();
          c.beginPath(); c.arc(cx, by - 37, 8, 0, TAU); c.fill();
        } else if (id === 'bike') {
          c.strokeStyle = theme.fg; c.lineWidth = 3;
          [-17, 17].forEach(dx => { c.beginPath(); c.arc(cx + dx, by - 9, 8, 0, TAU); c.stroke(); });
          c.strokeStyle = theme.c7; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath();
          c.moveTo(cx - 17, by - 9); c.lineTo(cx - 4, by - 22); c.lineTo(cx + 9, by - 22); c.lineTo(cx + 17, by - 9); c.moveTo(cx + 9, by - 22); c.lineTo(cx + 13, by - 31); c.stroke();
          c.lineCap = 'butt';
        } else if (id === 'car') {
          c.fillStyle = theme.c1; K.roundRect(c, cx - 36, by - 24, 72, 16, 5); c.fill(); K.roundRect(c, cx - 20, by - 36, 38, 16, 6); c.fill();
          c.fillStyle = theme.fg; [-21, 21].forEach(dx => { c.beginPath(); c.arc(cx + dx, by - 8, 8, 0, TAU); c.fill(); });
        } else {
          c.fillStyle = theme.muted; c.beginPath(); c.moveTo(cx - 26, by); c.lineTo(cx - 19, by - 30); c.lineTo(cx + 19, by - 30); c.lineTo(cx + 26, by); c.closePath(); c.fill();
          K.text(c, N(m, 0) + ' kg', cx, by - 14, { font: 'bold 11px ' + theme.font, color: theme.surface, align: 'center', baseline: 'middle' });
        }
      }

      // ---------- (a) hydraulic lift ----------
      function drawLift(c, w, h) {
        const g = liftGeom(), q = lift(), Y = g.Y, x1 = g.x1, x2 = g.x2;
        const w1 = Math.max(7, Math.sqrt(st.A1) * g.kx), w2 = Math.sqrt(st.A2) * g.kx;
        const yL = Y(40 - st.s1), yRam = Y(6 + q.s2), yTop = Y(42 + q.s2), yH = g.yH;
        const pw = Math.max(w2 + 16, K.clamp(w * 0.28, 84, 150));
        c.fillStyle = theme.ground; c.fillRect(0, g.baseY, w, h - g.baseY);
        c.fillStyle = K.withAlpha(theme.c4, theme.isDark ? 0.75 : 0.6);                 // oil
        c.fillRect(x1 - w1 / 2, g.floorY, x2 + w2 / 2 - x1 + w1 / 2, g.baseY - g.floorY);
        c.fillRect(x1 - w1 / 2, yL, w1, g.floorY - yL); c.fillRect(x2 - w2 / 2, yRam, w2, g.floorY - yRam);
        c.strokeStyle = theme.muted; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath();
        c.moveTo(x1 - w1 / 2, Y(43)); c.lineTo(x1 - w1 / 2, g.baseY); c.lineTo(x2 + w2 / 2, g.baseY); c.lineTo(x2 + w2 / 2, Y(41));
        c.moveTo(x1 + w1 / 2, Y(43)); c.lineTo(x1 + w1 / 2, g.floorY); c.lineTo(x2 - w2 / 2, g.floorY); c.lineTo(x2 - w2 / 2, Y(41)); c.stroke();
        // dashed start marks so that the two distances can be compared
        c.setLineDash([4, 4]); c.strokeStyle = K.withAlpha(theme.fg, 0.5); c.lineWidth = 1; c.beginPath();
        c.moveTo(x1 - 28, Y(74) - 3); c.lineTo(x1 + 28, Y(74) - 3); c.moveTo(x2 - pw / 2 - 8, Y(42) - 3); c.lineTo(x2 + pw / 2 + 8, Y(42) - 3); c.stroke(); c.setLineDash([]);
        // small piston with rod and handle
        c.fillStyle = theme.fg; c.fillRect(x1 - w1 / 2 + 1.5, yL - 5, w1 - 3, 5); c.fillRect(x1 - 2, yH, 4, yL - yH);
        K.roundRect(c, x1 - 20, yH - 7, 40, 8, 4); c.fill();
        // ram, platform and load
        c.fillStyle = K.withAlpha(theme.fg, 0.45); c.fillRect(x2 - w2 / 2 + 2.5, yTop, w2 - 5, yRam - yTop);
        c.fillStyle = theme.fg; K.roundRect(c, x2 - pw / 2, yTop - 6, pw, 7, 3); c.fill();
        drawLoad(c, st.load, x2, yTop - 6, q.m);
        // equal pressure arrows everywhere in the oil
        if (q.p > 0) {
          const o = { color: theme.c7, width: 2, head: 6 };
          for (let k = 1; k <= 4; k++) { const x = K.lerp(x1, x2, k / 5); K.arrow(c, x, g.baseY - 17, x, g.baseY - 3, o); }
          K.arrow(c, x1, yL + 17, x1, yL + 3, o);
          const n = Math.max(1, Math.min(3, Math.floor(w2 / 26)));
          for (let k = 0; k < n; k++) { const x = x2 + (k - (n - 1) / 2) * w2 / (n + 0.4); K.arrow(c, x, yRam + 16, x, yRam + 2, o); }
        }
        // forces
        const l1 = aLen(st.F1), dxa = Math.min(8, w2 / 4);
        if (st.F1 > 0) K.arrow(c, x1, yH - 10 - l1, x1, yH - 8, { color: theme.c1, width: 3, head: 9 });
        K.arrow(c, x2 - dxa, yTop - 2, x2 - dxa, yTop - 2 + aLen(q.Gw), { color: theme.c8, width: 3, head: 9 });
        if (q.F2 > 0) K.arrow(c, x2 + dxa, yRam - 2, x2 + dxa, yRam - 2 - aLen(q.F2), { color: theme.c2, width: 3, head: 9 });
        label(c, 'F₁ = ' + N(st.F1, 0) + ' N', x1 + 14, yH - 26, { bold: true });
        label(c, 's₁ = ' + N(st.s1, 1) + ' cm', x1 + 26, yH + 8);
        label(c, 'G = ' + N(q.Gw, 0) + ' N', x2 - w2 / 2 - 8, yTop + 18, { align: 'right' });
        label(c, 'F₂ = ' + N(q.F2, 0) + ' N', x2 + w2 / 2 + 8, yRam - 12, { bold: true });
        label(c, 's₂ = ' + N(q.s2, 2) + ' cm', x2 + pw / 2 + 6, yTop - 18);
        label(c, 'p = ' + N(q.p / 1000, q.p < 1e5 ? 1 : 0) + ' kPa', (x1 + x2) / 2, g.floorY - 16, { align: 'center', bold: true });
        label(c, 'A₁ = ' + N(st.A1, 0) + ' cm²', x1, g.baseY + 15, { align: 'center', bg: false });
        label(c, 'A₂ = ' + N(st.A2, 0) + ' cm²', x2, g.baseY + 15, { align: 'center', bg: false });
        label(c, T(q.ok ? { en: 'F₂ ≥ G: it lifts', hr: 'F₂ ≥ G: diže se' } : { en: 'F₂ < G: too heavy', hr: 'F₂ < G: preteško' }), x2 + 8, Math.max(60, yTop - 66), { align: 'center', dot: q.ok ? theme.good : theme.warn });
        head(c, [T({ en: 'Pascal\'s law: the same pressure everywhere', hr: 'Pascalov zakon: tlak je svuda jednak' }),
          'p = F₁/A₁ = F₂/A₂   ' + T({ en: 'work', hr: 'rad' }) + ': F₁·s₁ = ' + N(st.F1 * st.s1 / 100, 1) + ' J,  F₂·s₂ = ' + N(q.F2 * q.s2 / 100, 1) + ' J'], w - 20);
      }

      // ---------- (b) connected vessels ----------
      function side(c, v, sgn, start) {       // one wall of a vessel, bottom to top
        for (let y = 0; y <= HV; y++) { const x = v.x + v.off(y) + sgn * v.A(y) / 10; if (y === 0 && start) c.moveTo(x, y); else c.lineTo(x, y); }
      }
      function drawVessels(c, w, h) {
        const g = vesGeom(), tanT = Math.tan(g.th), lv = VES.map((v, i) => levelOf(v, st.V[i])), lw = 1 / g.s;
        c.fillStyle = theme.ground; c.fillRect(0, h - 18, w, 18);
        c.fillStyle = theme.muted; c.beginPath(); c.moveTo(g.px, g.py); c.lineTo(g.px - 12, h - 18); c.lineTo(g.px + 12, h - 18); c.closePath(); c.fill();
        c.save(); c.translate(g.px, g.py); c.rotate(-g.th); c.scale(g.s, -g.s); c.translate(-1, 5);   // from here: cm, Y up
        c.fillStyle = theme.muted; c.fillRect(-39, -6.5, 79, 2.5);                                    // table top
        c.fillStyle = theme.water; c.fillRect(-35, -4, 73, 4);                                        // the connecting pipe is always full
        VES.forEach((v, i) => {
          if (st.V[i] < 0.5) return;
          const xs = v.x + v.off(lv[i]), ys = X => lv[i] - (X - xs) * tanT;                         // the surface stays horizontal in the world
          c.save(); c.beginPath(); side(c, v, -1, true); for (let y = HV; y >= 0; y--) c.lineTo(v.x + v.off(y) + v.A(y) / 10, y); c.closePath(); c.clip();
          c.beginPath(); c.moveTo(v.x - 18, -1); c.lineTo(v.x - 18, ys(v.x - 18)); c.lineTo(v.x + 20, ys(v.x + 20)); c.lineTo(v.x + 20, -1); c.closePath(); c.fill();
          c.restore();
        });
        c.strokeStyle = K.withAlpha(theme.fg, 0.75); c.lineWidth = 2.5 * lw; c.lineJoin = 'round'; c.lineCap = 'round';
        const xs = [-35];
        VES.forEach(v => { c.beginPath(); side(c, v, -1, true); side(c, v, 1, true); c.stroke(); xs.push(v.x - v.A(0) / 10, v.x + v.A(0) / 10); });
        xs.push(38);
        c.beginPath(); c.moveTo(-35, 0); c.lineTo(-35, -4); c.lineTo(38, -4); c.lineTo(38, 0);
        for (let k = 0; k < xs.length; k += 2) { c.moveTo(xs[k], 0); c.lineTo(xs[k + 1], 0); }
        c.stroke();
        // valve between vessel 1 and the others
        c.fillStyle = st.valve ? theme.good : theme.bad;
        if (st.valve) c.fillRect(-26.6, -2.4, 3.2, 0.8); else c.fillRect(-25.5, -4, 1, 4);
        c.fillRect(-25.2, 0, 0.4, 2.2); c.beginPath(); c.arc(-25, 3, 1.1, 0, TAU); c.fill();
        // dashed line: the common level of the connected vessels
        const grp = (st.valve ? [0, 1, 2, 3] : [1, 2, 3]).filter(i => st.V[i] > 0.5);
        if (grp.length) {
          const P = grp.reduce((a, i) => a + lv[i] + (VES[i].x + VES[i].off(lv[i])) * tanT, 0) / grp.length, xa = st.valve ? -37 : -21;
          c.setLineDash([1.2, 1.2]); c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = lw; c.lineCap = 'butt';
          c.beginPath(); c.moveTo(xa, P - xa * tanT); c.lineTo(39, P - 39 * tanT); c.stroke(); c.setLineDash([]);
        }
        c.restore();
        // stream of water into the chosen vessel
        if (st.pend > 0) {
          const v = VES[st.target], mouth = vesPoint(g, v.x + v.off(HV), HV), surf = vesPoint(g, v.x + v.off(lv[st.target]), lv[st.target]);
          c.strokeStyle = theme.water; c.lineWidth = 5; c.lineCap = 'butt'; c.beginPath(); c.moveTo(mouth.x, 52); c.lineTo(mouth.x, mouth.y); c.lineTo(surf.x, surf.y); c.stroke();
          c.fillStyle = theme.muted; K.roundRect(c, mouth.x - 12, 42, 24, 12, 3); c.fill();
        }
        VES.forEach((v, i) => {
          const top = vesPoint(g, v.x + v.off(HV), HV + 3), bot = vesPoint(g, v.x, -9.5), on = i === st.target;
          label(c, N(lv[i], 1) + ' cm', top.x, top.y, { align: 'center', size: 11 });
          c.fillStyle = on ? theme.accent : theme.surface; c.beginPath(); c.arc(bot.x, bot.y, 9, 0, TAU); c.fill();
          K.text(c, String(i + 1), bot.x, bot.y + 0.5, { font: 'bold 11px ' + theme.font, color: on ? '#ffffff' : theme.fg, align: 'center', baseline: 'middle' });
        });
        const vp = vesPoint(g, -25, 6.5);
        label(c, T({ en: 'valve', hr: 'ventil' }), vp.x, vp.y, { align: 'center', size: 10, bg: false });
        head(c, [T({ en: 'Connected vessels: one level', hr: 'Spojene posude: ista razina' }),
          T({ en: 'Tap a vessel to pour water into it. The dashed line is horizontal.', hr: 'Dodirni posudu da uliješ vodu. Crtkana crta je vodoravna.' })], w - 20);
      }
      function drawUtube(c, w, h) {
        const s = Math.min((w - 40) / 62, (h - 96) / 38), ox = w / 2, oy = h - 26 - 6 * s;
        const X = x => ox + x * s, Y = y => oy - y * s;
        const d = st.rho * st.oilNow / (2 * RHO_W), yi = U_REST - d, yo = yi + st.oilNow, yw = U_REST + d;
        c.fillStyle = theme.ground; c.fillRect(0, h - 18, w, 18);
        c.fillStyle = theme.water;
        c.fillRect(X(-11.5), Y(0), 23 * s, 5 * s); c.fillRect(X(-11.5), Y(yi), 5 * s, yi * s); c.fillRect(X(6.5), Y(yw), 5 * s, yw * s);
        c.fillStyle = K.withAlpha(theme.c4, theme.isDark ? 0.85 : 0.75); c.fillRect(X(-11.5), Y(yo), 5 * s, st.oilNow * s);
        c.strokeStyle = K.withAlpha(theme.fg, 0.75); c.lineWidth = 2.5; c.lineJoin = 'round'; c.beginPath();
        c.moveTo(X(-11.5), Y(HV)); c.lineTo(X(-11.5), Y(-5)); c.lineTo(X(11.5), Y(-5)); c.lineTo(X(11.5), Y(HV));
        c.moveTo(X(-6.5), Y(HV)); c.lineTo(X(-6.5), Y(0)); c.lineTo(X(6.5), Y(0)); c.lineTo(X(6.5), Y(HV)); c.stroke();
        // boundary level and the two columns above it
        c.setLineDash([4, 4]); c.strokeStyle = K.withAlpha(theme.fg, 0.6); c.lineWidth = 1; c.beginPath(); c.moveTo(X(-16), Y(yi)); c.lineTo(X(16), Y(yi)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath();
        [[-14, yo], [14, yw]].forEach(([x, yt]) => { c.moveTo(X(x), Y(yi)); c.lineTo(X(x), Y(yt)); c.moveTo(X(x) - 4, Y(yt)); c.lineTo(X(x) + 4, Y(yt)); });
        c.stroke();
        label(c, 'h₁ = ' + N(st.oilNow, 1) + ' cm', X(-15.5), Y((yi + yo) / 2), { align: 'right', bold: true });
        label(c, 'h₂ = ' + N(2 * d, 1) + ' cm', X(15.5), Y((yi + yw) / 2), { bold: true });
        label(c, T({ en: 'oil', hr: 'ulje' }) + ' ρ₁ = ' + N(st.rho, 0) + ' kg/m³', X(-9), Y(HV + 2.2), { align: 'center', size: 11 });
        label(c, T({ en: 'water', hr: 'voda' }) + ' ρ₂ = ' + N(RHO_W, 0) + ' kg/m³', X(9) + 40, Y(HV + 2.2), { align: 'center', size: 11 });
        head(c, [T({ en: 'U-tube: ρ₁ · h₁ = ρ₂ · h₂', hr: 'U-cijev: ρ₁ · h₁ = ρ₂ · h₂' }),
          N(st.rho, 0) + ' · ' + N(st.oilNow, 1) + ' = ' + N(RHO_W, 0) + ' · ' + N(2 * d, 1)], w - 20);
      }

      // ---------- (c) air pressure ----------
      function drawBaro(c, w, h) {
        const g = baroGeom(), p = pAir(), water = st.liq === 'water', col = st.colNow;
        const cx = Math.round(g.split * 0.55), dishY = h - 52, Ht = dishY - 64, low = 0.22 * Ht, tubeLen = water ? 11.5 : 0.9;
        const yOf = water ? (m => (m <= 1 ? dishY - m * low : dishY - low - 14 - (m - 1) / 10.5 * (Ht - low - 14))) : (m => dishY - m / 0.9 * Ht);
        const tint = water ? theme.water : K.withAlpha(theme.muted, 0.85), tw = 20, yT = yOf(tubeLen);
        c.fillStyle = theme.ground; c.fillRect(0, h - 18, g.split, 18);
        // dish with liquid, tube with its column
        c.fillStyle = tint; c.fillRect(cx - 56, dishY, 112, 30); c.fillRect(cx - tw / 2, yOf(col), tw, dishY + 16 - yOf(col));
        c.strokeStyle = K.withAlpha(theme.fg, 0.75); c.lineWidth = 2.5; c.lineJoin = 'round'; c.beginPath();
        c.moveTo(cx - 56, dishY - 8); c.lineTo(cx - 56, dishY + 30); c.lineTo(cx + 56, dishY + 30); c.lineTo(cx + 56, dishY - 8);
        c.moveTo(cx - tw / 2, dishY + 16); c.lineTo(cx - tw / 2, yT + 8); c.arc(cx, yT + 8, tw / 2, Math.PI, 0); c.lineTo(cx + tw / 2, dishY + 16); c.stroke();
        // scale on the left of the tube
        const ticks = water ? [0.5, 1, 2, 4, 6, 8, 10] : [0.2, 0.4, 0.6, 0.8];
        c.strokeStyle = theme.muted; c.lineWidth = 1;
        ticks.forEach(m => {
          const y = yOf(m);
          c.beginPath(); c.moveTo(cx - tw / 2 - 8, y); c.lineTo(cx - tw / 2 - 2, y); c.stroke();
          K.text(c, water ? N(m, m < 1 ? 1 : 0) + ' m' : N(m * 1000, 0) + ' mm', cx - tw / 2 - 11, y, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        });
        if (water) {      // scale break: the tube is far longer than drawn
          const yb = dishY - low - 7;
          c.fillStyle = theme.sky; c.fillRect(cx - tw / 2 - 4, yb - 4, tw + 8, 8);
          c.strokeStyle = theme.fg; c.lineWidth = 1.5;
          [-4, 4].forEach(dy => { c.beginPath(); c.moveTo(cx - tw / 2 - 5, yb + dy + 2); c.lineTo(cx - tw / 6, yb + dy - 2); c.lineTo(cx + tw / 6, yb + dy + 2); c.lineTo(cx + tw / 2 + 5, yb + dy - 2); c.stroke(); });
        }
        if (yOf(col) - yT > 30) K.text(c, T({ en: 'vacuum', hr: 'vakuum' }), cx + tw / 2 + 6, yT + 12, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
        // the air presses on the liquid in the dish
        [-42, -26, 26, 42].forEach(dx => K.arrow(c, cx + dx, dishY - 30, cx + dx, dishY - 3, { color: theme.c7, width: 2, head: 7 }));
        K.text(c, T({ en: 'air presses down', hr: 'zrak tlači' }), cx, dishY + 42, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        c.strokeStyle = theme.fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx + tw / 2 + 2, yOf(col)); c.lineTo(cx + tw / 2 + 10, yOf(col)); c.stroke();
        label(c, 'h = ' + (water ? N(col, 2) + ' m' : N(col * 1000, 0) + ' mm'), cx + tw / 2 + 14, yOf(col), { bold: true });
        // altitude panel
        const yA = a => g.aBot - a / 9000 * (g.aBot - g.aTop), pwid = w - 8 - g.ax;
        c.fillStyle = K.withAlpha(theme.muted, 0.28); c.beginPath();
        PROFILE.forEach(([u, a], i) => { const x = g.ax + u * pwid, y = yA(a); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
        c.closePath(); c.fill();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(g.ax, g.aTop); c.lineTo(g.ax, g.aBot); c.stroke();
        PLACES.forEach(pl => {
          const y = yA(pl.h);
          c.beginPath(); c.moveTo(g.ax - 4, y); c.lineTo(g.ax + 4, y); c.stroke();
          K.text(c, pl.name + ' ' + N(pl.h, 0) + ' m', g.ax + 9, y, { font: '11px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        const ym = yA(st.alt);
        c.strokeStyle = theme.c2; c.lineWidth = 2; c.beginPath(); c.moveTo(g.ax, ym); c.lineTo(w - 8, ym); c.stroke();
        c.fillStyle = theme.c2; c.beginPath(); c.arc(g.ax, ym, 7, 0, TAU); c.fill();
        label(c, 'p = ' + N(p / 1000, 1) + ' kPa', w - 10, ym - 13 < g.aTop ? ym + 13 : ym - 13, { align: 'right', bold: true, size: 11 });
        K.text(c, T({ en: 'Altitude', hr: 'Visina' }) + ': ' + N(st.alt, 0) + ' m', g.ax - 6, 18, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(c, T({ en: 'drag the dot · approximate', hr: 'povuci točku · približno' }), g.ax - 6, 34, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
        head(c, [T({ en: 'Torricelli\'s barometer', hr: 'Torricellijev barometar' }), 'h = p / (ρ · g) = ' + N(targets().col, 3) + ' m'], g.split - 16);
      }
      function icons(c, n, car, cx, y) {      // a row of n small cars or people; the last one is cut to the fraction
        const iw = car ? 34 : 13, total = Math.ceil(n), x0 = cx - total * iw / 2;
        for (let k = 0; k < total; k++) {
          const f = Math.min(1, n - k), x = x0 + k * iw;
          c.save(); c.beginPath(); c.rect(x, y - 26, iw * f, 28); c.clip();
          if (car) {
            c.fillStyle = theme.c1; K.roundRect(c, x + 2, y - 14, 30, 9, 3); c.fill(); K.roundRect(c, x + 9, y - 21, 15, 9, 3); c.fill();
            c.fillStyle = theme.fg; [9, 25].forEach(dx => { c.beginPath(); c.arc(x + dx, y - 4, 4, 0, TAU); c.fill(); });
          } else { c.fillStyle = theme.c5; K.roundRect(c, x + 2, y - 15, 9, 15, 3); c.fill(); c.beginPath(); c.arc(x + 6.5, y - 20, 4, 0, TAU); c.fill(); }
          c.restore();
        }
      }
      function drawMagd(c, w, h) {
        const p = pAir(), F = magdForce(), cx = w / 2, cy = Math.round(64 + (h - 126) / 2);
        const Rmax = Math.max(24, Math.min(w * 0.17, (h - 126) / 2 - 40)), R = 16 + (st.rad - 5) / 45 * (Rmax - 16), gap = st.vac ? 0 : 16;
        for (let k = 0; k < 8; k++) {         // the air presses from all sides
          const a = (k + 0.5) * TAU / 8, r1 = R + 12 + gap / 2, r0 = r1 + 26;
          K.arrow(c, cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), { color: theme.c7, width: 2, head: 7 });
          if (!st.vac && R > 30) K.arrow(c, cx + (R - 22) * Math.cos(a), cy + (R - 22) * Math.sin(a), cx + (R - 6) * Math.cos(a), cy + (R - 6) * Math.sin(a), { color: theme.c7, width: 2, head: 6 });
        }
        [-1, 1].forEach(sg => {
          const hx = cx + sg * gap / 2;
          c.fillStyle = COPPER; c.beginPath(); c.arc(hx, cy, R, sg < 0 ? Math.PI / 2 : -Math.PI / 2, sg < 0 ? Math.PI * 1.5 : Math.PI / 2); c.closePath(); c.fill();
          c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 2; c.stroke();
          c.beginPath(); c.arc(hx + sg * (R + 6), cy, 6, 0, TAU); c.stroke();
          const len = F > 0 ? aLen(F) : 0;
          if (len) K.arrow(c, hx + sg * (R + 14), cy, hx + sg * (R + 14 + len), cy, { color: theme.c1, width: 3, head: 9 });
        });
        if (st.vac) { c.strokeStyle = K.withAlpha(theme.fg, 0.7); c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke(); }
        c.strokeStyle = theme.surface; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx + gap / 2, cy); c.lineTo(cx + gap / 2 + R, cy); c.stroke();
        label(c, 'r = ' + N(st.rad, 0) + ' cm', cx + gap / 2 + R / 2, cy - 12, { align: 'center', size: 11, bg: R > 34 });
        const cars = F / (1200 * G), people = F / (70 * G), by = h - 14;
        if (F > 0) {
          icons(c, cars >= 1 ? cars : people, cars >= 1, cx, by);
          label(c, 'F = ' + N(F, 0) + ' N ≈ ' + (cars >= 1
            ? T({ en: 'weight of ', hr: 'težina ' }) + N(cars, 1) + T({ en: ' cars (1200 kg each)', hr: ' automobila (svaki 1200 kg)' })
            : T({ en: 'weight of ', hr: 'težina ' }) + N(people, 1) + T({ en: ' adults (70 kg each)', hr: ' odraslih (svaki 70 kg)' })), cx, by - 38, { align: 'center', bold: true, size: w < 480 ? 10 : 12 });
        } else label(c, 'F = 0 N', cx, by - 38, { align: 'center', bold: true });
        head(c, [T({ en: 'Magdeburg hemispheres', hr: 'Magdeburške polukugle' }),
          'F = p · π · r² = ' + N(p / 1000, 1) + ' kPa · π · (' + N(st.rad / 100, 2) + ' m)²',
          T(st.vac ? { en: 'Inside: no air (vacuum). Outside: air.', hr: 'Unutra: nema zraka (vakuum). Izvana: zrak.' } : { en: 'Inside and outside: air at the same pressure.', hr: 'Unutra i izvana: zrak jednakog tlaka.' })], w - 20);
      }
      function drawStraw(c, w, h) {
        const p = pAir(), Ls = st.strawL, hMax = p / (RHO_W * G), want = strawRise(), reach = want >= Ls - 1e-9;
        const yS = h - 60, yTop = 92, pxm = (yS - yTop) / Ls, x = Math.round(w * 0.36);
        const gh = K.clamp(0.14 * pxm, 22, 64), gw = gh * 0.85, rise = Math.min(st.riseNow, Ls);
        c.fillStyle = theme.ground; c.fillRect(0, h - 18, w, 18);
        // glass with drink
        c.fillStyle = theme.water; c.fillRect(x - gw / 2, yS, gw, h - 18 - yS);
        c.strokeStyle = K.withAlpha(theme.fg, 0.75); c.lineWidth = 2.5; c.lineJoin = 'round'; c.beginPath();
        c.moveTo(x - gw / 2, yS - gh * 0.25); c.lineTo(x - gw / 2, h - 18); c.lineTo(x + gw / 2, h - 18); c.lineTo(x + gw / 2, yS - gh * 0.25); c.stroke();
        // straw and the drink inside it
        c.fillStyle = K.withAlpha(theme.surface, 0.7); c.fillRect(x - 4, yTop, 8, h - 26 - yTop);
        c.fillStyle = theme.c1; c.fillRect(x - 4, yS - rise * pxm, 8, h - 26 - (yS - rise * pxm));
        c.strokeStyle = theme.fg; c.lineWidth = 1.2; c.strokeRect(x - 4, yTop, 8, h - 26 - yTop);
        // head with the mouth on the straw
        c.fillStyle = SKIN; c.beginPath(); c.arc(x + 20, yTop - 8, 20, 0, TAU); c.fill();
        c.fillStyle = theme.fg; c.beginPath(); c.arc(x + 26, yTop - 16, 2.5, 0, TAU); c.fill();
        // scale
        const stepM = Ls <= 0.5 ? 0.1 : Ls <= 2 ? 0.5 : Ls <= 6 ? 1 : 2;
        c.strokeStyle = theme.muted; c.lineWidth = 1;
        for (let m = 0; m <= Ls + 1e-6; m += stepM) {
          const y = yS - m * pxm;
          c.beginPath(); c.moveTo(x - gw / 2 - 12, y); c.lineTo(x - gw / 2 - 5, y); c.stroke();
          K.text(c, N(m, stepM < 1 ? 1 : 0) + ' m', x - gw / 2 - 15, y, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        if (hMax <= Ls) {
          const y = yS - hMax * pxm;
          c.setLineDash([4, 4]); c.strokeStyle = theme.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 30, y); c.lineTo(x + 70, y); c.stroke(); c.setLineDash([]);
          label(c, T({ en: 'highest possible: ', hr: 'najviše moguće: ' }) + N(hMax, 1) + ' m', x + 74, y, { size: 11 });
        }
        [-0.3, 0.3].forEach(f => K.arrow(c, x + f * gw, yS - 26, x + f * gw, yS - 2, { color: theme.c7, width: 2, head: 7 }));
        label(c, T({ en: 'air', hr: 'zrak' }) + ' p₁ = ' + N(p / 1000, 1) + ' kPa', x + gw / 2 + 10, yS - 14, { size: 11 });
        label(c, T({ en: 'mouth', hr: 'usta' }) + ' p₂ = ' + N(p * (1 - st.suck / 100) / 1000, 1) + ' kPa', x + 46, yTop - 8, { size: 11 });
        if (rise > 0.004) label(c, 'h = ' + N(rise, 2) + ' m', x + 12, K.clamp(yS - rise * pxm, yTop + 22, yS - 36), { bold: true });
        head(c, [T({ en: 'Drinking straw: the air pushes the drink up', hr: 'Slamka: zrak gura piće prema gore' }),
          'h = (p₁ − p₂) / (ρ · g) = ' + N(want, 2) + ' m   ' + T({ en: 'straw', hr: 'slamka' }) + ': ' + N(Ls, 1) + ' m'], w - 20);
        label(c, T(reach ? { en: 'The drink reaches your mouth', hr: 'Piće stiže do usta' } : { en: 'The drink does not reach your mouth', hr: 'Piće ne stiže do usta' }), w - 10, h - 36, { align: 'right', dot: reach ? theme.good : theme.warn, size: 11 });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'lift') drawLift(c, w, h);
        else if (st.mode === 'vessels') { if (st.ves === 'four') drawVessels(c, w, h); else drawUtube(c, w, h); }
        else if (st.air === 'baro') drawBaro(c, w, h);
        else if (st.air === 'magd') drawMagd(c, w, h);
        else drawStraw(c, w, h);
      }

      // ---------- lifecycle ----------
      function reset() {
        Object.assign(st, defaults()); drag = null;
        segMode.set('lift'); slA1.set(2); slA2.set(100); slF1.set(100); selLoad.set('child'); slMass.set(500); slPump.set(0);
        segVes.set('four'); segTarget.set(1); tgValve.set(true); slTilt.set(0); slOil.set(10); slRho.set(920);
        segAir.set('baro'); selLiq.set('hg'); slAlt.set(0); slRad.set(25); tgVac.set(true); slStraw.set(0.2); slSuck.set(0);
        if (ctx.reducedMotion) L.stop(); else L.start();
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
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
