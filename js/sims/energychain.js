/* FizLab sim: Energy chains — source → converter → user with energy packets and losses, a solar panel and its angle, electricity use at home. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2, RAD = Math.PI / 180;
  const PMAX = 300;            // W: solar panel in full perpendicular sunshine
  const FORMS = {              // energy forms and their fixed colours
    light: { ck: 'c4', label: { en: 'light', hr: 'svjetlosna' } },
    kin: { ck: 'c2', label: { en: 'kinetic', hr: 'kinetička' } },
    grav: { ck: 'c1', label: { en: 'gravitational', hr: 'gravitacijska' } },
    chem: { ck: 'c6', label: { en: 'chemical', hr: 'kemijska' } },
    el: { ck: 'c7', label: { en: 'electrical', hr: 'električna' } },
    heat: { ck: 'c8', label: { en: 'thermal', hr: 'toplinska' } }
  };
  const SOURCES = [            // every source brings its own converter(s): eff = useful share, out = form that goes on
    { id: 'sun', form: 'light', label: { en: 'Sun', hr: 'Sunce' }, stages: [{ id: 'panel', eff: 0.20, out: 'el', label: { en: 'solar panel', hr: 'sunčana ploča' } }] },
    { id: 'wind', form: 'kin', label: { en: 'wind', hr: 'vjetar' }, stages: [{ id: 'turbine', eff: 0.40, out: 'el', label: { en: 'wind turbine', hr: 'vjetroturbina' } }] },
    { id: 'dam', form: 'grav', label: { en: 'water behind a dam', hr: 'voda iza brane' }, stages: [{ id: 'hydro', eff: 0.90, out: 'el', label: { en: 'water turbine + generator', hr: 'vodna turbina + generator' } }] },
    { id: 'food', form: 'chem', label: { en: 'cyclist who ate breakfast', hr: 'biciklist koji je doručkovao' }, stages: [
      { id: 'bike', eff: 0.25, out: 'kin', label: { en: 'cyclist\'s muscles', hr: 'mišići biciklista' } },
      { id: 'dynamo', eff: 0.80, out: 'el', label: { en: 'bicycle generator', hr: 'generator na biciklu' } }] },
    { id: 'gas', form: 'chem', label: { en: 'burning gas', hr: 'izgaranje plina' }, stages: [{ id: 'plant', eff: 0.38, out: 'el', label: { en: 'steam turbine + generator', hr: 'parna turbina + generator' } }] }
  ];
  const USERS = [
    { id: 'led', eff: 0.40, out: 'light', label: { en: 'LED lamp', hr: 'LED žarulja' } },
    { id: 'bulb', eff: 0.05, out: 'light', label: { en: 'filament bulb', hr: 'žarulja sa žarnom niti' } },
    { id: 'kettle', eff: 1.00, out: 'heat', label: { en: 'kettle (heater)', hr: 'kuhalo (grijač)' } },
    { id: 'fan', eff: 0.80, out: 'kin', label: { en: 'fan motor', hr: 'motor ventilatora' } },
    { id: 'phone', eff: 0.85, out: 'chem', label: { en: 'charging a phone', hr: 'punjenje mobitela' } }
  ];
  const APPS = [               // typical powers (W) and a starting number of hours per day
    { id: 'led', P: 10, h: 5, on: true, label: { en: 'LED bulb', hr: 'LED žarulja' } },
    { id: 'bulb', P: 60, h: 5, on: false, label: { en: 'old filament bulb', hr: 'stara žarulja' } },
    { id: 'tv', P: 100, h: 3, on: true, label: { en: 'TV', hr: 'televizor' } },
    { id: 'fridge', P: 150, h: 24, on: true, duty: 1 / 3, label: { en: 'fridge', hr: 'hladnjak' } },
    { id: 'laptop', P: 60, h: 4, on: true, label: { en: 'laptop', hr: 'prijenosno računalo' } },
    { id: 'console', P: 150, h: 2, on: false, label: { en: 'game console', hr: 'igraća konzola' } },
    { id: 'kettle', P: 2000, h: 0.25, on: true, label: { en: 'kettle', hr: 'kuhalo za vodu' } },
    { id: 'heater', P: 2000, h: 3, on: false, label: { en: 'electric heater', hr: 'električna grijalica' } },
    { id: 'washer', P: 2000, h: 1, on: false, label: { en: 'washing machine', hr: 'perilica rublja' } },
    { id: 'dryer', P: 1800, h: 0.25, on: true, label: { en: 'hair dryer', hr: 'sušilo za kosu' } },
    { id: 'charger', P: 5, h: 3, on: true, label: { en: 'phone charger', hr: 'punjač mobitela' } }
  ];
  const NOTE = {
    chain: { en: 'Energy is never used up: it changes form and, step by step, spreads out into the surroundings as heat. Only a part ends up in the form we wanted – that share is the efficiency.',
      hr: 'Energija se ne troši: mijenja oblik i postupno se raspršuje u okolinu kao toplina. Samo dio završi u obliku koji smo željeli – taj udio nazivamo korisnošću.' },
    solar: { en: 'The panel gives the most power when the Sun\'s rays hit it at a right angle. Run a whole day for different tilts and compare the curves. (The model ignores that a low Sun shines through more air.)',
      hr: 'Ploča daje najveću snagu kad Sunčeve zrake padaju okomito na nju. Pokreni simulaciju cijelog dana za različite nagibe i usporedi krivulje. (Model zanemaruje to da svjetlost niskog Sunca prolazi kroz deblji sloj zraka.)' },
    home: { en: 'Electrical energy E = P · t is sold in kilowatt-hours: 1 kWh = 1000 W for 1 hour = 3 600 000 J. Powerful heating appliances that run for a long time cost the most. A month is counted as 30 days.',
      hr: 'Električna energija E = P · t naplaćuje se u kilovatsatima: 1 kWh = 1000 W tijekom 1 sata = 3 600 000 J. Najviše koštaju snažni grijaći uređaji koji rade dugo. Za mjesec se uzima 30 dana.' }
  };
  const DEF = { src: 'sun', user: 'led', P: 400, elev: 45, tilt: 30, price: 0.15 };
  function hash(i, j) { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); }
  const joule = (v, lang) => K.fmt(v, v < 10 && v % 1 ? 1 : 0, lang) + ' J';

  window.Sims.register({
    id: 'energychain',
    title: { en: 'Energy Chains', hr: 'Lanci pretvorbe energije' },
    summary: {
      en: 'Follow energy from a source through a converter to an appliance and see how much is spread out as heat, tilt a solar panel towards the Sun, and add up the electricity used at home.',
      hr: 'Prati energiju od izvora preko pretvornika do trošila i pogledaj koliko se rasprši kao toplina. Nagni sunčanu ploču prema Suncu i zbroji električnu energiju potrošenu kod kuće.'
    },
    tasks: [
      { en: 'Light an LED lamp and then a filament bulb from the same source. How many joules of light do you get from 100 J?', hr: 'Istim izvorom napajaj LED žarulju, a zatim žarulju sa žarnom niti. Koliko džula svjetlosne energije dobiješ od 100 J?' },
      { en: 'Which chain has the highest overall efficiency? Which has the lowest? Where does the "lost" energy go?', hr: 'Koji lanac ima najveću ukupnu korisnost, a koji najmanju? Kamo odlazi „izgubljena“ energija?' },
      { en: 'In "Solar panel" set the Sun to 30°. Which tilt gives the most power? Then press "Whole day".', hr: 'Odaberi „Sunčana ploča“ i postavi visinu Sunca na 30°. Koji nagib daje najveću snagu? Zatim pritisni „Cijeli dan“.' },
      { en: 'In "Electricity at home" find the appliance that uses the most energy per day. Is it the most powerful one?', hr: 'Odaberi „Struja kod kuće“ i pronađi uređaj koji dnevno potroši najviše energije. Je li to ujedno uređaj najveće snage?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 340, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'chain', src: SOURCES[0], user: USERS[0], P: DEF.P, pk: [], acc: [0.5, 0.5, 0.5], spawn: 0, count: 0, spin: 0,
        elev: DEF.elev, tilt: DEF.tilt, clouds: false, day: { run: false, t: 0, pts: [], tilt: DEF.tilt, prev: null },
        apps: APPS.map(a => ({ def: a, h: a.h, on: a.on })), sel: 0, price: DEF.price };
      let geoH = null;

      // ---- controls ----
      const segMode = C.segmented({ label: { en: 'Topic', hr: 'Tema' }, options: [
        { value: 'chain', label: { en: 'Build a chain', hr: 'Složi lanac' } }, { value: 'solar', label: { en: 'Solar panel', hr: 'Sunčana ploča' } },
        { value: 'home', label: { en: 'Electricity at home', hr: 'Struja kod kuće' } }], value: 'chain', onChange: v => { st.mode = v; applyMode(); refresh(); } });
      const selSrc = C.select({ label: { en: 'Energy source', hr: 'Izvor energije' }, options: SOURCES.map(s => ({ value: s.id, label: s.label })), value: DEF.src,
        onChange: v => { st.src = SOURCES.find(s => s.id === v) || SOURCES[0]; resetChain(); refresh(); } });
      const selUser = C.select({ label: { en: 'User (appliance)', hr: 'Trošilo' }, options: USERS.map(u => ({ value: u.id, label: u.label })), value: DEF.user,
        onChange: v => { st.user = USERS.find(u => u.id === v) || USERS[0]; resetChain(); refresh(); } });
      const slP = C.slider({ label: { en: 'Source power', hr: 'Snaga izvora' }, min: 100, max: 1000, step: 50, value: DEF.P, unit: 'W', digits: 0, onChange: v => { st.P = v; refresh(); } });
      const deg = (v, l) => K.fmt(v, 0, l) + '°';
      const slElev = C.slider({ label: { en: 'Sun elevation', hr: 'Visina Sunca nad obzorom' }, min: 0, max: 90, step: 1, value: DEF.elev, format: deg, onChange: v => { st.elev = v; st.day.run = false; refresh(); } });
      const slTilt = C.slider({ label: { en: 'Panel tilt', hr: 'Nagib ploče' }, min: 0, max: 90, step: 1, value: DEF.tilt, format: deg, onChange: v => { st.tilt = v; refresh(); } });
      const tgCloud = C.toggle({ label: { en: 'Clouds', hr: 'Oblaci' }, value: false, onChange: v => { st.clouds = v; refresh(); } });
      const btnDay = C.button({ label: { en: 'Whole day', hr: 'Cijeli dan' }, onClick: () => startDay() });
      const selApp = C.select({ label: { en: 'Appliance to edit', hr: 'Odabrani uređaj' }, value: APPS[0].id,
        options: APPS.map(a => ({ value: a.id, label: { en: a.label.en + ' (' + a.P + ' W)', hr: a.label.hr + ' (' + a.P + ' W)' } })),
        onChange: v => { st.sel = Math.max(0, APPS.findIndex(a => a.id === v)); syncApp(); refresh(); } });
      const tgUse = C.toggle({ label: { en: 'Use it', hr: 'U upotrebi' }, value: APPS[0].on, onChange: v => { st.apps[st.sel].on = v; refresh(); } });
      const slH = C.slider({ label: { en: 'Hours per day', hr: 'Sati dnevno' }, min: 0, max: 24, step: 0.25, value: APPS[0].h, unit: 'h', digits: 2, onChange: v => { st.apps[st.sel].h = v; refresh(); } });
      const slPrice = C.slider({ label: { en: 'Price of electricity', hr: 'Cijena struje' }, min: 0.1, max: 0.4, step: 0.01, value: DEF.price, unit: '€/kWh', digits: 2, onChange: v => { st.price = v; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Ispočetka' }, onClick: () => reset() });
      const outUse = C.readout({ label: { en: 'Useful power', hr: 'Korisna snaga' }, unit: 'W', digits: 0 });
      const outHeat = C.readout({ label: { en: 'Spread out as heat', hr: 'Raspršeno kao toplina' }, unit: 'W', digits: 0 });
      const outEff = C.readout({ label: { en: 'Overall efficiency', hr: 'Ukupna korisnost' }, unit: '%', digits: 1 });
      const outPs = C.readout({ label: { en: 'Power of the panel', hr: 'Snaga ploče' }, unit: 'W', digits: 0 });
      const outPct = C.readout({ label: { en: 'Share of the maximum', hr: 'Udio najveće snage' }, unit: '%', digits: 0 });
      const outAng = C.readout({ label: { en: 'Rays to the perpendicular', hr: 'Kut zraka i okomice' } });
      const outDay = C.readout({ label: { en: 'Energy per day', hr: 'Energija dnevno' }, unit: 'kWh', digits: 2 });
      const outMonth = C.readout({ label: { en: 'Energy per month', hr: 'Energija mjesečno' }, unit: 'kWh', digits: 1 });
      const outCost = C.readout({ label: { en: 'Cost per month', hr: 'Trošak mjesečno' }, unit: '€', digits: 2 });
      const outTop = C.readout({ label: { en: 'Uses the most', hr: 'Najviše troši' } });
      const note = C.note({ text: '' });

      function show(ctl, on) {
        const el = ctl.el;
        const f = (el.classList && el.classList.contains('sk-field')) ? el : ((el.closest && el.closest('.sk-field')) || el);
        f.style.display = on ? '' : 'none';
      }
      function applyMode() {
        const a = st.mode === 'chain', b = st.mode === 'solar', h = st.mode === 'home';
        [selSrc, selUser, slP, outUse, outHeat, outEff].forEach(x => show(x, a));
        [slElev, slTilt, tgCloud, btnDay, outPs, outPct, outAng].forEach(x => show(x, b));
        [selApp, tgUse, slH, slPrice, outDay, outMonth, outCost, outTop].forEach(x => show(x, h));
        show(btnPlay, !h);
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function syncApp() { const a = st.apps[st.sel]; selApp.set(a.def.id); tgUse.set(a.on); slH.set(a.h); }

      // ---- model ----
      function chainCalc() {       // joules left after every step, starting from 100 J
        const es = [100];
        st.src.stages.forEach(sg => es.push(es[es.length - 1] * sg.eff));
        es.push(es[es.length - 1] * st.user.eff);
        return { es, eta: es[es.length - 1] / 100 };
      }
      function solarCalc() {       // φ = Sun's angle above the horizon it rises from (0…180°); the panel faces that side
        const phi = st.day.run ? 180 * st.day.t : st.elev, sum = phi + st.tilt;
        const cos = sum <= 180 ? Math.max(0, Math.sin(sum * RAD)) : 0;   // cos of the angle between the rays and the panel's normal
        return { phi, cos, inc: Math.abs(90 - sum), P: PMAX * cos * (st.clouds ? 0.25 : 1) };
      }
      function homeCalc() {        // E = P·t for every appliance in use, in kWh per day
        let day = 0, top = null;
        const rows = st.apps.filter(a => a.on).map(a => { const E = a.def.P * a.h * (a.def.duty || 1) / 1000; day += E; if (E > 0 && (!top || E > top.E)) top = { a, E }; return { a, E }; });
        return { rows, day, month: day * 30, cost: day * 30 * st.price, top: top ? top.a : null };
      }
      function updateOut() {
        if (st.mode === 'chain') {
          const q = chainCalc();
          outUse.set(st.P * q.eta); outHeat.set(st.P * (1 - q.eta)); outEff.set(q.eta * 100); note.set(NOTE.chain);
        } else if (st.mode === 'solar') {
          const q = solarCalc();
          outPs.set(q.P); outPct.set(q.P / PMAX * 100);
          outAng.set(q.cos > 0 ? { en: K.fmt(q.inc, 0, 'en') + '°', hr: K.fmt(q.inc, 0, 'hr') + '°' } : { en: 'Sun behind the panel', hr: 'Sunce je iza ploče' });
          note.set(NOTE.solar);
        } else {
          const q = homeCalc();
          outDay.set(q.day); outMonth.set(q.month); outCost.set(q.cost); outTop.set(q.top ? q.top.def.label : null); note.set(NOTE.home);
        }
      }
      function refresh() { updateOut(); draw(); }
      function resetChain() {
        st.pk = []; st.acc = [0.5, 0.5, 0.5]; st.spawn = 0; st.count = 0;
        for (let i = 0; i < 300; i++) stepChain(0.02);   // the first frame already shows a flowing chain
      }
      function reset() {
        Object.assign(st, { src: SOURCES[0], user: USERS[0], P: DEF.P, elev: DEF.elev, tilt: DEF.tilt, clouds: false, sel: 0, price: DEF.price,
          day: { run: false, t: 0, pts: [], tilt: DEF.tilt, prev: null } });
        st.apps.forEach(a => { a.h = a.def.h; a.on = a.def.on; });
        selSrc.set(DEF.src); selUser.set(DEF.user); slP.set(DEF.P); slElev.set(DEF.elev); slTilt.set(DEF.tilt); tgCloud.set(false); slPrice.set(DEF.price);
        syncApp(); resetChain(); refresh();
      }
      function layChain() {
        const w = cv.w, h = cv.h, n = st.src.stages.length + 2, s = K.clamp(h * 0.055, 17, 26), lb = w < 560 ? 36 : 22, iy = lb + 14 + s, xs = [];
        for (let i = 0; i < n; i++) xs.push(w * (i + 0.5) / n);
        return { w, h, n, s, iy, ly: Math.max(iy + s + 62, h * 0.5), xs, v: K.clamp(w * 0.16, 60, 170) };
      }
      function stepChain(dt) {     // packets run along the lane; at every converter a fixed share turns into heat and drifts away
        const g = layChain(), last = g.n - 2;
        st.spin += dt * 2.5;
        st.spawn += dt * st.P / 100 * 1.2;
        while (st.spawn >= 1) { st.spawn -= 1; st.pk.push({ x: g.xs[0], y: g.ly, seg: 0, mode: 0, a: 1, form: st.src.form, n: st.count++ }); }
        st.pk.forEach(p => {
          if (p.mode === 0) {
            p.x += g.v * dt; p.y = g.ly;
            if (p.x < g.xs[Math.min(p.seg + 1, g.n - 1)]) return;
            const k = Math.min(p.seg, last), eff = k === last ? st.user.eff : st.src.stages[k].eff;
            st.acc[k] += eff;
            if (st.acc[k] >= 1 - 1e-9) { st.acc[k] -= 1; if (k === last) { p.mode = 2; p.form = st.user.out; } else { p.seg++; p.form = st.src.stages[k].out; } }
            else { p.mode = 1; p.form = 'heat'; }
          } else if (p.mode === 1) { p.x += (14 + 30 * hash(p.n, 1)) * dt; p.y += (34 + 22 * hash(p.n, 2)) * dt; p.a -= dt / 1.5; }
          else { p.x += g.v * dt; p.y -= (hash(p.n, 3) - 0.5) * 60 * dt; p.a -= dt / 0.8; }
        });
        st.pk = st.pk.filter(p => p.a > 0);
      }
      function startDay() {
        const d = st.day;
        st.day = { run: true, t: 0, pts: [], tilt: st.tilt, prev: d.pts.length > 1 ? { pts: d.pts, tilt: d.tilt } : d.prev };
        if (!L.running) { L.start(); updatePlay(); }
        refresh();
      }
      function stepDay(dt) {       // 12 hours of daylight in 10 seconds
        const d = st.day;
        d.t = Math.min(1, d.t + dt / 10); d.tilt = st.tilt;
        const hr = 6 + 12 * d.t;
        if (!d.pts.length || hr - d.pts[d.pts.length - 1][0] >= 0.05 || d.t >= 1) d.pts.push([hr, solarCalc().P]);
        if (d.t >= 1) d.run = false;
      }

      // ---- drawing helpers ----
      function head(c, a, b) {
        K.text(c, a, 12, 14, { font: 'bold ' + (cv.w < 420 ? 12 : 13) + 'px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(c, b, 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function wrap2(c, str, maxW) {   // at most two lines, broken at the space nearest the middle
        if (c.measureText(str).width <= maxW) return [str];
        let best = -1;
        for (let i = 0; i < str.length; i++) if (str[i] === ' ' && (best < 0 || Math.abs(i - str.length / 2) < Math.abs(best - str.length / 2))) best = i;
        return best < 0 ? [str] : [str.slice(0, best), str.slice(best + 1)];
      }
      function icon(c, id, x, y, s) {  // small pictograms, drawn in a box of ±s
        const fg = theme.fg, sf = theme.surface;
        c.save(); c.translate(x, y); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = fg; c.lineWidth = 2;
        const path = p => { c.beginPath(); c.moveTo(p[0] * s, p[1] * s); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i] * s, p[i + 1] * s); };
        const line = (...p) => { path(p); c.stroke(); };
        const poly = (fill, ...p) => { path(p); c.closePath(); c.fillStyle = fill; c.fill(); c.stroke(); };
        const circ = (cx, cy, r, fill) => { c.beginPath(); c.arc(cx * s, cy * s, r * s, 0, TAU); if (fill) { c.fillStyle = fill; c.fill(); } c.stroke(); };
        const blades = (n, r) => { for (let i = 0; i < n; i++) { const a = st.spin + i * TAU / n; line(0, 0, Math.cos(a) * r, Math.sin(a) * r); } };
        if (id === 'sun') { blades(8, 1); circ(0, 0, 0.5, theme.c4); }
        else if (id === 'wind') [-0.5, 0, 0.5].forEach(d => { c.beginPath(); c.moveTo(-s * 0.9, d * s); c.bezierCurveTo(-s * 0.3, (d - 0.4) * s, s * 0.3, (d + 0.4) * s, s * 0.9, d * s); c.stroke(); });
        else if (id === 'dam') { poly(K.withAlpha(theme.c1, 0.45), -1, -0.4, 0.2, -0.4, 0.2, 0.8, -1, 0.8); poly(theme.muted, 0.2, -0.8, 0.45, -0.8, 0.8, 0.8, 0.2, 0.8); }
        else if (id === 'food') { c.beginPath(); c.arc(0, 0.1 * s, 0.8 * s, 0, Math.PI); c.closePath(); c.fillStyle = theme.c6; c.fill(); c.stroke(); line(-0.3, -0.2, -0.2, -0.7); line(0.25, -0.2, 0.35, -0.7); }
        else if (id === 'gas') poly(theme.c2, 0, -1, 0.6, 0.1, 0.35, 0.8, -0.35, 0.8, -0.6, 0.1);
        else if (id === 'panel') { poly(theme.c1, -0.9, 0.5, -0.4, -0.6, 0.9, -0.6, 0.4, 0.5); line(-0.65, -0.05, 0.65, -0.05); line(-0.2, 0.5, 0.3, -0.6); }
        else if (id === 'turbine') { line(0, 0, 0, 1); blades(3, 0.95); circ(0, 0, 0.14, fg); }
        else if (id === 'hydro') { circ(0, 0, 0.85, sf); blades(6, 0.85); circ(0, 0, 0.2, fg); }
        else if (id === 'bike') { circ(-0.6, 0.4, 0.42); circ(0.6, 0.4, 0.42); line(-0.6, 0.4, -0.1, -0.3, 0.4, -0.3, 0.6, 0.4); line(-0.1, -0.3, 0.1, 0.4, -0.6, 0.4); circ(0.05, -0.75, 0.2, sf); }
        else if (id === 'dynamo') { poly(sf, -0.45, -0.3, 0.45, -0.3, 0.45, 0.8, -0.45, 0.8); circ(0, -0.6, 0.3, theme.muted); }
        else if (id === 'plant') { poly(sf, -0.9, 0.8, -0.9, -0.1, 0.2, -0.1, 0.2, 0.8); poly(sf, 0.35, 0.8, 0.45, -0.8, 0.75, -0.8, 0.85, 0.8); circ(-0.35, 0.35, 0.3); }
        else if (id === 'led' || id === 'bulb') {
          circ(0, -0.2, 0.62, K.withAlpha(theme.c4, id === 'led' ? 0.9 : 0.45)); poly(theme.muted, -0.3, 0.45, 0.3, 0.45, 0.3, 0.9, -0.3, 0.9);
          if (id === 'bulb') line(-0.25, 0.1, -0.1, -0.3, 0.1, 0, 0.25, -0.3);
        } else if (id === 'kettle') { poly(sf, -0.55, -0.5, 0.45, -0.5, 0.65, 0.8, -0.75, 0.8); line(-0.6, -0.2, -1, -0.5); c.beginPath(); c.arc(0.6 * s, 0.1 * s, 0.4 * s, -1.2, 1.2); c.stroke(); }
        else if (id === 'fan') { circ(0, 0, 0.9, sf); blades(3, 0.8); circ(0, 0, 0.15, fg); }
        else if (id === 'phone') { poly(sf, -0.45, -0.95, 0.45, -0.95, 0.45, 0.95, -0.45, 0.95); c.fillStyle = theme.c6; c.fillRect(-0.3 * s, 0, 0.6 * s, 0.75 * s); }
        c.restore();
      }

      // ---- (a) build a chain ----
      function drawChain(c) {
        const g = layChain(), w = g.w, q = chainCalc(), f11 = '11px ' + theme.font, per = w < 560 ? 3 : 6;
        Object.keys(FORMS).forEach((k, i) => {   // legend: colour = form of energy
          const x = 12 + (i % per) * (w - 16) / per, y = 12 + Math.floor(i / per) * 15;
          c.fillStyle = theme[FORMS[k].ck]; c.beginPath(); c.arc(x + 5, y, 5, 0, TAU); c.fill();
          K.text(c, K.tr(FORMS[k].label, lang), x + 14, y, { font: f11, color: theme.fg, baseline: 'middle' });
        });
        const nodes = [{ id: st.src.id, label: st.src.label }].concat(st.src.stages, [st.user]);
        c.save(); c.strokeStyle = theme.line; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(g.xs[0], g.ly); c.lineTo(g.xs[g.n - 1], g.ly); c.stroke(); c.restore();
        nodes.forEach((nd, i) => {
          const x = g.xs[i], y0 = g.iy + g.s + 12;
          icon(c, nd.id, x, g.iy, g.s);
          if (i) K.text(c, '→', (g.xs[i - 1] + x) / 2, g.iy, { font: 'bold 16px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
          c.font = f11;
          const lines = wrap2(c, K.tr(nd.label, lang), w / g.n - 8);
          lines.forEach((t, j) => K.text(c, t, x, y0 + j * 12, { font: f11, color: theme.fg, align: 'center', baseline: 'middle' }));
          if (nd.eff !== undefined) K.text(c, K.tr({ en: 'useful ', hr: 'korisno ' }, lang) + K.fmt(nd.eff * 100, 0, lang) + ' %', x, y0 + lines.length * 12 + 1, { font: 'bold 11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
          c.save(); c.strokeStyle = theme.muted; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(x, y0 + lines.length * 12 + 10); c.lineTo(x, g.ly - 9); c.stroke(); c.restore();
        });
        st.pk.forEach(p => { c.globalAlpha = K.clamp(p.a, 0, 1); c.fillStyle = theme[FORMS[p.form].ck]; c.beginPath(); c.arc(p.x, p.y, 4.5, 0, TAU); c.fill(); });
        c.globalAlpha = 1;
        K.text(c, '↘ ' + K.tr({ en: 'heat spreads into the surroundings', hr: 'toplina se raspršuje u okolinu' }, lang), 12, g.ly + 62, { font: f11, color: theme.muted, baseline: 'middle' });
        // energy-flow bar for 100 J from the source
        const by = g.h - 58, bw = w - 24, use = q.es[q.es.length - 1], uw = Math.max(2, bw * q.eta), two = w < 460;
        K.text(c, K.tr({ en: 'Of every 100 J from the source:  ', hr: 'Od svakih 100 J iz izvora:  ' }, lang) + q.es.map(e => joule(e, lang)).join(' → '), 12, by - 11, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        c.fillStyle = K.withAlpha(theme.c8, 0.4); K.roundRect(c, 12, by, bw, 18, 4); c.fill();
        c.fillStyle = theme[FORMS[st.user.out].ck]; K.roundRect(c, 12, by, uw, 18, 4); c.fill();
        c.strokeStyle = theme.fg; c.lineWidth = 1; K.roundRect(c, 12, by, bw, 18, 4); c.stroke();
        K.text(c, K.tr({ en: 'useful: ', hr: 'korisno: ' }, lang) + joule(use, lang) + ' (' + K.tr(FORMS[st.user.out].label, lang) + ') → ' + K.tr({ en: 'efficiency ', hr: 'korisnost ' }, lang) + K.fmt(q.eta * 100, q.eta < 0.1 ? 1 : 0, lang) + ' %',
          12, by + 30, { font: f11, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'spread out as heat: ', hr: 'raspršeno kao toplina: ' }, lang) + joule(100 - use, lang), two ? 12 : w - 12, by + (two ? 44 : 30), { font: f11, color: theme.fg, align: two ? 'left' : 'right', baseline: 'middle' });
      }

      // ---- (b) solar panel ----
      function drawSolar(c, S, G) {
        const q = solarCalc(), gy = S.y + S.h - 28, PL = K.clamp(S.w * 0.26, 64, 170), cx = S.x + S.w * 0.5, cy = gy - PL * 0.62;
        const R = Math.max(50, Math.min(S.w * 0.42, cy - S.y - 58)), b = st.tilt * RAD, f = q.phi * RAD;
        const dx = Math.cos(b), dy = -Math.sin(b), sx = -Math.cos(f), sy = -Math.sin(f), f11 = '11px ' + theme.font;
        c.fillStyle = theme.ground; c.fillRect(S.x, gy, S.w, S.y + S.h - gy);
        K.text(c, K.tr({ en: 'sunrise', hr: 'izlazak' }, lang), S.x + 10, gy + 14, { font: f11, color: theme.fg, baseline: 'middle' });
        K.text(c, K.tr({ en: 'sunset', hr: 'zalazak' }, lang), S.x + S.w - 10, gy + 14, { font: f11, color: theme.fg, align: 'right', baseline: 'middle' });
        // Sun and its parallel rays
        const ux = cx + sx * R, uy = cy + sy * R;
        c.save(); c.strokeStyle = theme.c4; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath();
        for (let i = 0; i < 8; i++) { const a = i * TAU / 8; c.moveTo(ux + Math.cos(a) * 16, uy + Math.sin(a) * 16); c.lineTo(ux + Math.cos(a) * 21, uy + Math.sin(a) * 21); }
        c.stroke(); c.fillStyle = theme.c4; c.beginPath(); c.arc(ux, uy, 12, 0, TAU); c.fill(); c.restore();
        for (let k = -2; k <= 2; k++) {
          const x = cx + dx * k * PL * 0.2, y = cy + dy * k * PL * 0.2;
          K.arrow(c, x + sx * R * 0.78, y + sy * R * 0.78, x + sx * 5, y + sy * 5, { color: q.cos > 0 ? K.withAlpha(theme.c4, st.clouds ? 0.4 : 1) : K.withAlpha(theme.muted, 0.6), width: 2, head: 7 });
        }
        if (st.clouds) {
          const kx = cx + sx * R * 0.72, ky = cy + sy * R * 0.72;
          c.save(); c.fillStyle = theme.surface; c.strokeStyle = theme.muted; c.lineWidth = 1.5;
          [[-14, 3, 10], [0, -3, 13], [14, 3, 10]].forEach(p => { c.beginPath(); c.arc(kx + p[0], ky + p[1], p[2], 0, TAU); c.fill(); c.stroke(); });
          c.fillRect(kx - 14, ky - 2, 28, 12); c.restore();
        }
        // post, panel, its normal (perpendicular)
        c.save(); c.strokeStyle = theme.fg; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, gy); c.lineTo(cx, cy); c.stroke();
        c.strokeStyle = theme.muted; c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - Math.sin(b) * 44, cy - Math.cos(b) * 44); c.stroke(); c.setLineDash([]);
        c.translate(cx, cy); c.rotate(-b);
        c.fillStyle = theme.c1; c.strokeStyle = theme.fg; c.lineWidth = 2; c.fillRect(-PL / 2, -4, PL, 8); c.strokeRect(-PL / 2, -4, PL, 8);
        c.restore();
        K.text(c, K.tr({ en: 'tilt ', hr: 'nagib ' }, lang) + K.fmt(st.tilt, 0, lang) + '°', cx + 10, gy - 10, { font: f11, color: theme.fg, baseline: 'middle' });
        const mult = (st.clouds ? ' · ' + K.fmt(0.25, 2, lang) : '') + ' = ' + K.fmt(q.P, 0, lang) + ' W';
        head(c, q.cos > 0 ? 'P = ' + PMAX + ' W · cos ' + K.fmt(q.inc, 0, lang) + '°' + mult : K.tr({ en: 'The Sun is behind the panel: P = 0 W', hr: 'Sunce je iza ploče: P = 0 W' }, lang),
          st.day.run ? K.tr({ en: 'Time of day: ', hr: 'Doba dana: ' }, lang) + K.fmt(6 + 12 * st.day.t, 1, lang) + ' h'
            : K.tr({ en: 'Angle between the rays and the perpendicular: ', hr: 'Kut između zraka i okomice na ploču: ' }, lang) + K.fmt(q.inc, 0, lang) + '°');
        // power during the day
        const d = st.day, series = [], tl = K.tr({ en: 'tilt ', hr: 'nagib ' }, lang);
        if (d.prev) series.push({ points: d.prev.pts, color: theme.c2, label: tl + K.fmt(d.prev.tilt, 0, lang) + '°' });
        series.push({ points: d.pts, color: theme.c1, label: tl + K.fmt(d.tilt, 0, lang) + '°' });
        const ch = K.lineChart(c, { x: G.x, y: G.y, w: G.w, h: G.h, xMin: 6, xMax: 18, yMin: 0, yMax: PMAX, nice: false, xTicks: 4, yTicks: 3, xDigits: 0, yDigits: 0, lang, theme,
          yLabel: { en: 'power P (W)', hr: 'snaga P (W)' }, series });
        K.text(c, K.tr({ en: 'time of day (h)', hr: 'doba dana (h)' }, lang), ch.px + ch.pw - 5, ch.py + 12, { font: f11, color: theme.fg, align: 'right' });
        if (d.pts.length < 2 && !d.prev) K.text(c, K.tr({ en: 'Press "Whole day"', hr: 'Pritisni „Cijeli dan“' }, lang), ch.px + ch.pw / 2, ch.py + ch.ph / 2, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }

      // ---- (c) electricity at home ----
      function drawHome(c) {
        const w = cv.w, h = cv.h, q = homeCalc(), a = st.apps[st.sel], d = a.def, f11 = '11px ' + theme.font, Wh = d.P * a.h * (d.duty || 1);
        head(c, 'E = P · t = ' + d.P + ' W · ' + K.fmt(a.h, a.h % 1 ? 2 : 0, lang) + ' h' + (d.duty ? ' · ⅓' : '') + ' = ' + K.fmt(Wh, 0, lang) + ' Wh = ' + K.fmt(Wh / 1000, 2, lang) + ' kWh',
          K.tr(d.label, lang) + (d.duty ? K.tr({ en: ' (runs ⅓ of the time)', hr: ' (radi ⅓ vremena)' }, lang) : '') +
          K.tr({ en: ' · total ', hr: ' · ukupno ' }, lang) + K.fmt(q.day, 2, lang) + ' kWh ' + K.tr({ en: 'per day', hr: 'dnevno' }, lang));
        const top = 48, n = q.rows.length, rowH = Math.min(34, (h - top - 8) / Math.max(1, n)), LW = K.clamp(w * 0.36, 112, 250), x0 = LW + 8, bw = w - x0 - 78;
        const Emax = q.rows.reduce((m, r) => Math.max(m, r.E), 0.001);
        geoH = { top, rowH, rows: q.rows };
        if (!n) K.text(c, K.tr({ en: 'Nothing is switched on. Choose an appliance and turn on "Use it".', hr: 'Ništa nije uključeno. Odaberi uređaj i uključi „U upotrebi“.' }, lang), 12, top + 20, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        q.rows.forEach((r, i) => {
          const y = top + i * rowH, ym = y + rowH / 2, sel = r.a === a, bh = Math.max(6, rowH - 9), len = Math.max(2, bw * r.E / Emax), most = r.a === q.top;
          if (sel) { c.fillStyle = K.withAlpha(theme.fg, 0.09); K.roundRect(c, 4, y, w - 8, rowH, 5); c.fill(); }
          K.text(c, K.tr(r.a.def.label, lang), LW, ym, { font: (sel ? 'bold ' : '') + f11, color: theme.fg, align: 'right', baseline: 'middle' });
          c.fillStyle = theme.c1; K.roundRect(c, x0, ym - bh / 2, len, bh, 3); c.fill();
          K.text(c, K.fmt(r.E, 2, lang) + ' kWh' + (most ? ' ★' : ''), x0 + len + 6, ym, { font: (most ? 'bold ' : '') + f11, color: theme.fg, baseline: 'middle' });
        });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h);
        c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        if (st.mode === 'chain') drawChain(c);
        else if (st.mode === 'home') drawHome(c);
        else if (w >= 620) { const sw = Math.round(w * 0.56); drawSolar(c, { x: 0, y: 0, w: sw, h }, { x: sw + 4, y: 8, w: w - sw - 12, h: h - 16 }); }
        else { const sh = Math.round(h * 0.6); drawSolar(c, { x: 0, y: 0, w, h: sh }, { x: 6, y: sh + 2, w: w - 12, h: h - sh - 8 }); }
      }

      // ---- pointer: click a bar to edit that appliance ----
      function rowAt(p) {
        if (st.mode !== 'home' || !geoH) return null;
        const i = Math.floor((p.y - geoH.top) / geoH.rowH);
        return i >= 0 && i < geoH.rows.length ? geoH.rows[i].a : null;
      }
      const onDown = ev => { const a = rowAt(cv.pointer(ev)); if (a) { ev.preventDefault(); st.sel = st.apps.indexOf(a); syncApp(); refresh(); } };
      const onMove = ev => { cv.canvas.style.cursor = rowAt(cv.pointer(ev)) ? 'pointer' : 'default'; };
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);

      const L = K.loop(dt => {
        if (st.mode === 'chain') stepChain(dt);
        else if (st.mode === 'solar' && st.day.run) { stepDay(dt); updateOut(); }
        draw();
      });
      cv.onResize(draw);
      applyMode();
      reset();
      if (!ctx.reducedMotion) L.start();
      updatePlay();
      return {
        destroy() { L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
