/* FizLab sim: Heating, Melting and Mixing — the heating curve of ice → water → steam, mixing hot and cold water, and which substance heats fastest. */
(function () {
  'use strict';
  const K = window.SimKit;
  const C_ICE = 2100, C_WATER = 4200, C_STEAM = 2000;        // specific heat capacities, J/(kg·°C)
  const L_MELT = 334000, L_BOIL = 2260000;                   // latent heats, J/kg
  const T_ICE = -20, T_TOP = 140, T_ROOM = 20;
  // energy per kilogram for each stage (ice warms, melts, water warms, boils, steam warms) and the running totals
  const STAGE_E = [C_ICE * (0 - T_ICE), L_MELT, C_WATER * 100, L_BOIL, C_STEAM * (T_TOP - 100)];
  const EDGE = [0, 42000, 376000, 796000, 3056000, 3136000], EDGE_T = [T_ICE, 0, 0, 100, 100, T_TOP];
  const CUP_C = 100, AIR_LOSS = 0.02;                        // "real cup": 100 J/°C of cup at 20 °C, and 2 % of the excess escapes into the air
  const ICE_COL = '#cfe6fb';
  const STAGES = [
    { name: { en: 'ice warms up', hr: 'led se grije' }, state: { en: 'ice (solid)', hr: 'led (krutina)' }, parts: { en: 'ordered, vibrating in place', hr: 'uređene, titraju na mjestu' },
      note: { en: 'The ice warms up: its particles vibrate faster and faster in their fixed places. Ice needs 2100 J to warm 1 kg by 1 °C.', hr: 'Led se grije: čestice sve brže titraju na svojim stalnim mjestima. Da bi se 1 kg leda zagrijao za 1 °C, potrebno je 2100 J.' } },
    { name: { en: 'melting', hr: 'taljenje' }, state: { en: 'ice + water (melting)', hr: 'led + voda (taljenje)' }, parts: { en: 'the pattern is breaking up', hr: 'raspored se raspada' },
      note: { en: 'The temperature stays at 0 °C until all the ice has melted: the energy goes into breaking the bonds between the particles (334 kJ for each kilogram).', hr: 'Temperatura ostaje 0 °C dok se sav led ne rastali: energija odlazi na kidanje veza među česticama (334 kJ za svaki kilogram).' } },
    { name: { en: 'water warms up', hr: 'voda se grije' }, state: { en: 'water (liquid)', hr: 'voda (tekućina)' }, parts: { en: 'close together, sliding', hr: 'blizu su, klize' },
      note: { en: 'Liquid water warms up. It needs 4200 J to warm 1 kg by 1 °C, twice as much as ice, so this line is less steep.', hr: 'Tekuća se voda grije. Da bi se 1 kg vode zagrijao za 1 °C, potrebno je 4200 J, dvostruko više nego za led, pa je ovaj dio grafa položeniji.' } },
    { name: { en: 'boiling', hr: 'vrenje' }, state: { en: 'water + steam (boiling)', hr: 'voda + para (vrenje)' }, parts: { en: 'some break free and fly off', hr: 'neke se otkidaju i odlijeću' },
      note: { en: 'The temperature stays at 100 °C while the water boils: the energy tears the particles apart into steam. That takes 2260 kJ per kilogram, almost seven times more than melting.', hr: 'Temperatura ostaje 100 °C dok voda vrije: energija odvaja čestice jednu od druge i nastaje para. Za to treba 2260 kJ po kilogramu, gotovo sedam puta više nego za taljenje.' } },
    { name: { en: 'steam warms up', hr: 'para se grije' }, state: { en: 'steam (gas)', hr: 'vodena para (plin)' }, parts: { en: 'far apart, flying freely', hr: 'daleko su, slobodno lete' },
      note: { en: 'All the water is now steam, an invisible gas, and its temperature rises again.', hr: 'Sva je voda sada para, nevidljivi plin, i temperatura joj ponovno raste.' } }
  ];
  const SUBS = [
    { c: 4200, label: { en: 'Water', hr: 'Voda' }, short: { en: 'water', hr: 'voda' } },
    { c: 2000, label: { en: 'Cooking oil', hr: 'Jestivo ulje' }, short: { en: 'oil', hr: 'ulje' } },
    { c: 800, label: { en: 'Sand', hr: 'Pijesak' }, short: { en: 'sand', hr: 'pijesak' } },
    { c: 900, label: { en: 'Aluminium', hr: 'Aluminij' }, short: { en: 'aluminium', hr: 'aluminij' } },
    { c: 450, label: { en: 'Iron', hr: 'Željezo' }, short: { en: 'iron', hr: 'željezo' } },
    { c: 385, label: { en: 'Copper', hr: 'Bakar' }, short: { en: 'copper', hr: 'bakar' } }
  ];
  const MODES = [
    { value: 'curve', label: { en: 'Heating curve', hr: 'Krivulja zagrijavanja' } },
    { value: 'mix', label: { en: 'Mixing water', hr: 'Miješanje vode' } },
    { value: 'race', label: { en: 'Which heats fastest?', hr: 'Što se najbrže zagrije?' } }
  ];
  const NOTE_MIX = { en: 'The hot water gives away exactly the heat the cold water takes in, until both have the same temperature: T = (m₁·T₁ + m₂·T₂) / (m₁ + m₂).', hr: 'Topla voda predaje točno onoliko topline koliko hladna prima, sve dok im se temperature ne izjednače: T = (m₁·T₁ + m₂·T₂) / (m₁ + m₂).' };
  const NOTE_REAL = { en: 'A real cup and the air take some of the heat too, so the measured temperature of the mixture ends a little closer to room temperature (20 °C) than the formula says.', hr: 'Stvarna šalica i okolni zrak također preuzmu dio topline, pa je izmjerena temperatura smjese malo bliža sobnoj temperaturi (20 °C) od one koju daje formula.' };
  const NOTE_RACE = { en: 'Water has a very large specific heat capacity: it needs a lot of energy to warm up and gives a lot back as it cools. That is why the sea warms and cools much more slowly than the land.', hr: 'Voda ima vrlo velik specifični toplinski kapacitet: za zagrijavanje joj treba mnogo energije, a pri hlađenju mnogo energije i otpušta. Zato se more zagrijava i hladi mnogo sporije od kopna.' };
  const NOTE_MAX = { en: 'The chart shows at most 4 substances. Switch one off first.', hr: 'Graf prikazuje najviše 4 tvari. Najprije isključi jednu.' };
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
  // state of water that started as ice at −20 °C after receiving e joules per kilogram
  function stateOf(e) {
    if (e < EDGE[1]) return { stage: 0, T: T_ICE + e / C_ICE, ice: 1, water: 0, steam: 0 };
    if (e < EDGE[2]) { const f = (e - EDGE[1]) / L_MELT; return { stage: 1, T: 0, ice: 1 - f, water: f, steam: 0 }; }
    if (e < EDGE[3]) return { stage: 2, T: (e - EDGE[2]) / C_WATER, ice: 0, water: 1, steam: 0 };
    if (e < EDGE[4]) { const f = (e - EDGE[3]) / L_BOIL; return { stage: 3, T: 100, ice: 0, water: 1 - f, steam: f }; }
    return { stage: 4, T: Math.min(T_TOP, 100 + (e - EDGE[4]) / C_STEAM), ice: 0, water: 0, steam: 1 };
  }

  window.Sims.register({
    id: 'heatingcurve',
    title: { en: 'Heating, Melting and Mixing', hr: 'Zagrijavanje, taljenje i miješanje' },
    summary: {
      en: 'Heat a block of ice until it is steam and watch the temperature graph, mix hot and cold water and predict the result, and race six substances on identical heaters.',
      hr: 'Zagrijavaj komad leda dok ne postane para i prati graf temperature. Pomiješaj toplu i hladnu vodu i predvidi temperaturu smjese, a zatim usporedi zagrijavanje šest tvari na jednakim grijačima.'
    },
    tasks: [
      { en: 'Heating curve: press Play. Where is the graph flat, and what is happening in the beaker during those times?', hr: 'Krivulja zagrijavanja: pritisni „Pokreni“. Gdje je graf vodoravan i što se tada događa u čaši?' },
      { en: 'Which takes more energy: melting 1 kg of ice or boiling away 1 kg of water? Read the energies on the graph.', hr: 'Za što treba više energije: da se rastali 1 kg leda ili da ispari 1 kg vode? Očitaj energije s grafa.' },
      { en: 'Mixing: guess the temperature of 0.2 kg at 90 °C poured into 0.6 kg at 10 °C. Pour, record it and try three more mixtures.', hr: 'Miješanje: predvidi temperaturu smjese kad se 0,2 kg vode od 90 °C ulije u 0,6 kg vode od 10 °C. Ulij vodu, zabilježi rezultat i isprobaj još tri smjese.' },
      { en: 'Which heats fastest? Put the six substances in order. How does the order compare with their values of c?', hr: 'Što se najbrže zagrije? Poredaj šest tvari prema brzini zagrijavanja. Slaže li se taj poredak s njihovim vrijednostima c?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 380, maxHeight: 500 });
      const C = K.controls(container, lang);
      const tr = o => K.tr(o, lang), fm = (v, d) => K.fmt(v, d, lang);
      let seed = 3;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const parts = Array.from({ length: 24 }, (q, i) => ({ lx: 0.2 + (i % 6) * 0.12, ly: 0.5 + Math.floor(i / 6) * 0.12, p1: rnd() * 6.283, p2: rnd() * 6.283, gas: false, x: 0, y: 0, vx: 0, vy: 0 }));
      const st = { mode: 'curve', speed: 60, anim: 0, noteKey: '',
        cu: { m: 0.5, P: 1000, E: 0, t: 0, done: false },
        mx: { m1: 0.5, T1: 80, m2: 0.5, T2: 20, real: false, p: 0, poured: false, trials: [] },
        rc: { m: 0.5, P: 300, t: 0, done: false, sel: [true, true, true, false, false, true], full: false } };

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'Experiment', hr: 'Pokus' }, options: MODES, value: 'curve', onChange: v => setMode(v) });
      const slM = C.slider({ label: { en: 'Mass of the ice', hr: 'Masa leda' }, min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.cu.m = v; restartCurve(); } });
      const slP = C.slider({ label: { en: 'Heater power', hr: 'Snaga grijača' }, min: 200, max: 3000, step: 100, value: 1000, unit: 'W', digits: 0, onChange: v => { st.cu.P = v; restartCurve(); } });
      const unpour = () => { st.mx.p = 0; st.mx.poured = false; refresh(); };
      const slM1 = C.slider({ label: { en: 'Hot water: mass m₁', hr: 'Topla voda: masa m₁' }, min: 0.1, max: 1, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.mx.m1 = v; unpour(); } });
      const slT1 = C.slider({ label: { en: 'Hot water: temperature T₁', hr: 'Topla voda: temperatura T₁' }, min: 40, max: 100, step: 1, value: 80, unit: '°C', digits: 0, onChange: v => { st.mx.T1 = v; unpour(); } });
      const slM2 = C.slider({ label: { en: 'Cold water: mass m₂', hr: 'Hladna voda: masa m₂' }, min: 0.1, max: 1, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.mx.m2 = v; unpour(); } });
      const slT2 = C.slider({ label: { en: 'Cold water: temperature T₂', hr: 'Hladna voda: temperatura T₂' }, min: 0, max: 30, step: 1, value: 20, unit: '°C', digits: 0, onChange: v => { st.mx.T2 = v; unpour(); } });
      const tgReal = C.toggle({ label: { en: 'Real cup (some heat is lost)', hr: 'Stvarna šalica (dio topline se gubi)' }, value: false, onChange: v => { st.mx.real = v; unpour(); } });
      const btnPour = C.button({ label: { en: 'Pour together', hr: 'Ulij zajedno' }, variant: 'primary', onClick: () => { st.mx.p = 0; st.mx.poured = true; if (!L.running) L.start(); refresh(); } });
      const btnRec = C.button({ label: { en: 'Record', hr: 'Zabilježi' }, onClick: () => {
        const mx = st.mx;
        if (mx.p < 1) return;
        mx.trials.push({ m1: mx.m1, T1: mx.T1, m2: mx.m2, T2: mx.T2, T: mixT(mx.real), real: mx.real });
        if (mx.trials.length > 6) mx.trials.shift();
        refresh();
      } });
      const slMr = C.slider({ label: { en: 'Mass of each sample', hr: 'Masa svakog uzorka' }, min: 0.2, max: 1, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.rc.m = v; restartRace(); } });
      const slPr = C.slider({ label: { en: 'Power of each heater', hr: 'Snaga svakog grijača' }, min: 100, max: 1000, step: 50, value: 300, unit: 'W', digits: 0, onChange: v => { st.rc.P = v; restartRace(); } });
      const tgSub = SUBS.map((sub, i) => C.toggle({ label: { en: 'Chart: ' + sub.short.en, hr: 'Graf: ' + sub.short.hr }, value: st.rc.sel[i], onChange: v => {
        const rc = st.rc;
        rc.full = v && rc.sel.filter(Boolean).length >= 4;
        if (rc.full) tgSub[i].set(false); else rc.sel[i] = v;
        refresh();
      } }));
      const segSpeed = C.segmented({ label: { en: 'Time speed', hr: 'Brzina simulacije' }, options: [{ value: '10', label: '10×' }, { value: '60', label: '60×' }, { value: '300', label: '300×' }], value: '60',
        onChange: v => { st.speed = parseFloat(v) || 60; } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => {
        if (!L.running && st.mode === 'curve' && st.cu.done) restartCurve();
        if (!L.running && st.mode === 'race' && st.rc.done) restartRace();
        L.toggle(); updatePlay();
      } });
      C.button({ label: { en: 'Reset', hr: 'Ispočetka' }, onClick: () => reset() });
      const outT = C.readout({ label: { en: 'Temperature', hr: 'Temperatura' }, unit: '°C', digits: 1 });
      const outState = C.readout({ label: { en: 'State', hr: 'Agregacijsko stanje' } });
      const outTime = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 0 });
      const outE = C.readout({ label: { en: 'Energy supplied (heat)', hr: 'Dovedena energija (toplina)' }, unit: 'kJ', digits: 0 });
      const outTmix = C.readout({ label: { en: 'Temperature of the mixture', hr: 'Temperatura smjese' }, unit: '°C', digits: 1 });
      const outQ1 = C.readout({ label: { en: 'Heat given by the hot water', hr: 'Toplina koju je predala topla voda' }, unit: 'kJ', digits: 1 });
      const outQ2 = C.readout({ label: { en: 'Heat taken by the cold water', hr: 'Toplina koju je primila hladna voda' }, unit: 'kJ', digits: 1 });
      const note = C.note({ text: STAGES[0].note });

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
      const GROUPS = { curve: [slM, slP, outT, outState], mix: [slM1, slT1, slM2, slT2, tgReal, btnPour, btnRec, outTmix, outQ1, outQ2], race: [slMr, slPr].concat(tgSub) };
      function showControls() {
        Object.keys(GROUPS).forEach(m => GROUPS[m].forEach(c => { fieldOf(c).style.display = m === st.mode ? '' : 'none'; }));
        [segSpeed, btnPlay, outTime, outE].forEach(c => { fieldOf(c).style.display = st.mode === 'mix' ? 'none' : ''; });
      }
      function updatePlay() {
        const e = st.mode === 'race' ? st.rc : st.cu;
        btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : e.t > 0 && !e.done ? { en: 'Continue', hr: 'Nastavi' } : { en: 'Play', hr: 'Pokreni' });
      }

      // ---------- model ----------
      function mixT(real) {
        const mx = st.mx, sum = mx.m1 * mx.T1 + mx.m2 * mx.T2, m = mx.m1 + mx.m2;
        if (!real) return sum / m;
        const withCup = (C_WATER * sum + CUP_C * T_ROOM) / (C_WATER * m + CUP_C);   // the cup warms up (or cools down) too
        return withCup - AIR_LOSS * (withCup - T_ROOM);                              // and a little heat is exchanged with the air
      }
      const raceT = (i, t) => Math.min(100, T_ROOM + st.rc.P * t / (st.rc.m * SUBS[i].c));   // ΔT = P·t / (m·c), heater off at 100 °C
      const raceEnd = i => (100 - T_ROOM) * st.rc.m * SUBS[i].c / st.rc.P;
      function phaseOf(i, s) {   // 0 solid, 1 liquid, 2 gas for particle i of the inset
        const n = parts.length;
        if (s.stage === 1) return i < Math.round(s.water * n) ? 1 : 0;
        if (s.stage === 3) return i < Math.round(s.steam * n) ? 2 : 1;
        return s.stage === 0 ? 0 : s.stage === 2 ? 1 : 2;
      }
      function moveParticles(dt, s) {
        const hot = K.clamp((s.T - T_ICE) / (T_TOP - T_ICE), 0, 1), t = st.anim;
        parts.forEach((p, i) => {
          const ph = phaseOf(i, s);
          if (ph === 2) {
            if (!p.gas) { p.gas = true; p.vx = Math.cos(p.p1 + i) * 0.8; p.vy = -0.35 - 0.6 * Math.abs(Math.sin(p.p2 + i)); }
            const k = 1 + 0.5 * (s.T - 100) / 40;
            p.x += p.vx * dt * k; p.y += p.vy * dt * k;
            if (p.x < 0.06) { p.x = 0.06; p.vx = Math.abs(p.vx); } else if (p.x > 0.94) { p.x = 0.94; p.vx = -Math.abs(p.vx); }
            if (p.y < 0.06) { p.y = 0.06; p.vy = Math.abs(p.vy); } else if (p.y > 0.94) { p.y = 0.94; p.vy = -Math.abs(p.vy); }
          } else {
            p.gas = false;
            const A = ph === 0 ? 0.005 + 0.012 * K.clamp((s.T - T_ICE) / 20, 0, 1) : 0.028 + 0.02 * hot, om = ph === 0 ? 13 : 2.2 + 3.5 * hot;
            p.x = p.lx + A * Math.sin(om * t + p.p1) + (ph === 1 ? 0.04 * Math.sin(0.6 * om * t + 2 * p.p2) : 0);
            p.y = p.ly + A * Math.sin(1.3 * om * t + p.p2) + (ph === 1 ? 0.025 * Math.sin(0.45 * om * t + 3 * p.p1) : 0);
          }
        });
      }
      function restartCurve() { L.stop(); st.cu.E = 0; st.cu.t = 0; st.cu.done = false; moveParticles(0, stateOf(0)); updatePlay(); refresh(); }
      function restartRace() { L.stop(); st.rc.t = 0; st.rc.done = false; updatePlay(); refresh(); }
      function setMode(m) {
        L.stop(); st.mode = m; st.rc.full = false;
        showControls(); updatePlay(); refresh();
      }
      function step(dt) {
        st.anim += dt;
        if (st.mode === 'curve') {
          const cu = st.cu, tot = EDGE[5] * cu.m;
          cu.E = Math.min(tot, cu.E + cu.P * dt * st.speed); cu.t = cu.E / cu.P; cu.done = cu.E >= tot;
          moveParticles(dt, stateOf(cu.E / cu.m));
          if (cu.done) { L.stop(); updatePlay(); }
        } else if (st.mode === 'race') {
          const rc = st.rc, tEnd = raceEnd(0);
          rc.t = Math.min(tEnd, rc.t + dt * st.speed); rc.done = rc.t >= tEnd;
          if (rc.done) { L.stop(); updatePlay(); }
        } else {
          const mx = st.mx;
          if (mx.poured) mx.p = Math.min(1, mx.p + dt / 2.6);
          if (!mx.poured || mx.p >= 1) L.stop();
        }
      }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        let key, text;
        if (st.mode === 'curve') {
          const cu = st.cu, s = stateOf(cu.E / cu.m);
          outT.set(s.T); outState.set(STAGES[s.stage].state); outTime.set(cu.t); outE.set(cu.E / 1000);
          key = 'c' + s.stage; text = STAGES[s.stage].note;
        } else if (st.mode === 'race') {
          outTime.set(st.rc.t); outE.set(st.rc.P * st.rc.t / 1000);
          key = st.rc.full ? 'max' : 'race'; text = st.rc.full ? NOTE_MAX : NOTE_RACE;
        } else {
          const mx = st.mx, T = mixT(mx.real), q = { en: '?', hr: '?' };
          outTmix.set(mx.p >= 1 ? T : q); outQ1.set(mx.p >= 1 ? mx.m1 * C_WATER * (mx.T1 - T) / 1000 : q); outQ2.set(mx.p >= 1 ? mx.m2 * C_WATER * (T - mx.T2) / 1000 : q);
          key = mx.real ? 'real' : 'mix'; text = mx.real ? NOTE_REAL : NOTE_MIX;
        }
        if (key !== st.noteKey) { st.noteKey = key; note.set(text); }
      }

      // ---------- drawing helpers ----------
      function fit(c, str, x, y, maxW, o) {   // text that shrinks until it fits maxW
        o = o || {};
        const pre = o.bold ? 'bold ' : '', face = o.display ? theme.fontDisplay : theme.font;
        let size = o.size || 12;
        for (; size > 9; size--) { c.font = pre + size + 'px ' + face; if (c.measureText(str).width <= maxW) break; }
        K.text(c, str, x, y, { font: pre + size + 'px ' + face, color: o.color || theme.fg, align: o.align || 'left', baseline: o.baseline || 'middle' });
      }
      const head = (c, str, w) => fit(c, str, 12, 15, w - 24, { size: 14, bold: true, display: true });
      const tempCol = T => mixColor(theme.c1, theme.c8, T / 100);
      function thermo(c, x, top, bot, T, lo, hi) {
        const tw = 8, r = 7, yT = bot - K.clamp((T - lo) / (hi - lo), 0, 1) * (bot - top - 4);
        c.fillStyle = theme.surface; c.strokeStyle = theme.fg; c.lineWidth = 1.5;
        K.roundRect(c, x - tw / 2, top, tw, bot - top, 4); c.fill(); c.stroke();
        c.beginPath(); c.arc(x, bot + r - 1, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = theme.c8; c.fillRect(x - 2, yT, 4, bot - yT + 2);
        c.beginPath(); c.arc(x, bot + r - 1, r - 3, 0, Math.PI * 2); c.fill();
      }
      function steam(c, x, y, wd, a, n) {
        c.strokeStyle = K.withAlpha(theme.muted, a); c.lineWidth = 2;
        for (let s = 0; s < n; s++) {
          const sx = x + wd * (s + 0.5) / n;
          c.beginPath();
          for (let yy = 0; yy <= 30; yy += 2) c.lineTo(sx + 4 * Math.sin(yy / 6 + st.anim * 2.5 + s * 1.7), y - yy);
          c.stroke();
        }
      }
      function split(w, h, frac, tall) {   // scene on the left (wide) or on top (narrow), chart / table in the rest
        if (w >= 640) { const sw = Math.round(w * frac); return { sw, sh: h, r: { x: sw + 4, y: 8, w: w - sw - 12, h: h - 16 } }; }
        const sh = Math.round(h * tall);
        return { sw: w, sh, r: { x: 8, y: sh + 2, w: w - 16, h: h - sh - 10 } };
      }
      function timeAxis(total) {             // seconds for short runs, minutes for long ones
        const u = total > 900 ? 60 : 1, n = K.niceScale(0, total / u, 5);
        return { u, max: n.max, ticks: n.ticks, label: u === 60 ? { en: 'time (min)', hr: 'vrijeme (min)' } : { en: 'time (s)', hr: 'vrijeme (s)' } };
      }
      const xLabel = (c, ch, obj) => K.text(c, tr(obj), ch.px + ch.pw, ch.py + ch.ph + 15, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'top' });

      // ---------- (a) heating curve ----------
      function drawCurve(c, w, h) {
        const cu = st.cu, s = stateOf(cu.E / cu.m), L0 = split(w, h, 0.42, 0.47), sw = L0.sw, sh = L0.sh, heating = L.running && !cu.done;
        head(c, (s.stage + 1) + ' · ' + tr(STAGES[s.stage].name), sw);
        fit(c, 'Q = P · t = ' + fm(cu.P, 0) + ' W · ' + fm(cu.t, 0) + ' s = ' + fm(cu.E / 1000, 0) + ' kJ', 12, 36, sw - 24, { size: 12 });
        // beaker on the heater
        const bw = Math.min(sw * 0.36, 150), bh = Math.min(sh - 100, 190), bx = Math.max(16, sw * 0.3 - bw / 2), bb = sh - 32, bt = bb - bh;
        const lvl0 = (0.32 + 0.5 * cu.m / 2) * bh, lv = lvl0 * (s.ice + s.water), yl = bb - 3 - lv;
        c.fillStyle = heating ? theme.c8 : theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 1.5; K.roundRect(c, bx - 14, bb + 4, bw + 28, 9, 3); c.fill(); c.stroke();
        fit(c, fm(cu.m, 1) + ' kg · ' + fm(cu.P, 0) + ' W', bx + bw / 2, bb + 22, bw + 60, { size: 11, align: 'center', color: theme.muted });
        if (s.water > 0) { c.fillStyle = theme.water; c.fillRect(bx + 2, yl, bw - 4, lv + 1); }
        if (s.ice > 0) {
          const k = Math.sqrt(s.ice), iw = (bw - 18) * k, ih = Math.min(lvl0 * 0.95, bh * 0.75) * k, iy = Math.min(yl - ih * 0.15, bb - 3 - ih);
          c.fillStyle = ICE_COL; c.strokeStyle = theme.c1; c.lineWidth = 1.5; K.roundRect(c, bx + bw / 2 - iw / 2, iy, iw, ih, 5); c.fill(); c.stroke();
          c.strokeStyle = K.withAlpha('#ffffff', 0.9); c.beginPath(); c.moveTo(bx + bw / 2 - iw * 0.3, iy + ih * 0.25); c.lineTo(bx + bw / 2 - iw * 0.05, iy + ih * 0.6); c.stroke();
        }
        const nb = s.stage === 3 ? 9 : s.stage === 2 && s.T > 85 ? 3 : 0;
        c.fillStyle = K.withAlpha('#ffffff', 0.8);
        for (let i = 0; i < nb && lv > 10; i++) { c.beginPath(); c.arc(bx + 10 + (i * 47) % (bw - 20), bb - 6 - ((st.anim * 55 + i * 31) % (lv - 6)), 3, 0, Math.PI * 2); c.fill(); }
        const sa = s.stage === 3 ? 0.9 : s.stage === 4 ? 0.6 : s.stage === 2 && s.T > 60 ? (s.T - 60) / 40 * 0.5 : 0;
        if (sa > 0) steam(c, bx + 8, bt - 4, bw - 40, sa, 3);
        if (s.stage === 4) steam(c, bx + 8, bb - 10, bw - 40, 0.5, 3);
        c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.moveTo(bx - 5, bt - 3); c.lineTo(bx, bt); c.lineTo(bx, bb); c.lineTo(bx + bw, bb); c.lineTo(bx + bw, bt); c.lineTo(bx + bw + 5, bt - 3); c.stroke();
        thermo(c, bx + bw - 15, bt - 30, bb - 18, s.T, T_ICE, T_TOP);
        K.text(c, fm(s.T, 1) + ' °C', bx + bw + 12, bt - 14, { font: 'bold 16px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        // particle inset
        const is = Math.max(56, Math.min(sw * 0.36, sh * 0.42, 150)), ix = sw - is - 12, iy0 = w >= 640 ? 58 : 50;
        c.fillStyle = theme.surface; c.strokeStyle = theme.muted; c.lineWidth = 1.5; K.roundRect(c, ix, iy0, is, is, 8); c.fill(); c.stroke();
        c.fillStyle = theme.c1; c.beginPath();
        parts.forEach(p => { const X = ix + p.x * is, Y = iy0 + p.y * is, r = Math.max(2.5, is / 30); c.moveTo(X + r, Y); c.arc(X, Y, r, 0, Math.PI * 2); });
        c.fill();
        fit(c, tr({ en: 'particles: ', hr: 'čestice: ' }) + tr(STAGES[s.stage].parts), ix + is, iy0 + is + 11, Math.min(sw - 20, is + 110), { size: 11, align: 'right', color: theme.muted });
        // temperature–time graph with the five stages
        const r = L0.r, tot = EDGE[5] * cu.m / cu.P, ax = timeAxis(tot), pts = [[0, T_ICE]];
        for (let i = 1; i <= 5; i++) {
          const ti = EDGE[i] * cu.m / cu.P;
          if (cu.t >= ti) pts.push([ti / ax.u, EDGE_T[i]]); else { pts.push([cu.t / ax.u, s.T]); break; }
        }
        const ch = K.lineChart(c, { x: r.x, y: r.y, w: r.w, h: r.h, xMin: 0, xMax: ax.max, xTicks: ax.ticks, yMin: -50, yMax: 150, yTicks: 4, nice: false,
          yLabel: { en: 'temperature (°C)', hr: 'temperatura (°C)' }, series: [{ points: pts, color: theme.c1 }], theme, lang });
        xLabel(c, ch, ax.label);
        const ex = i => ch.sx(EDGE[i] * cu.m / cu.P / ax.u), small = ch.ph < 220, rowH = small ? 12 : 16, tf = (small ? 10 : 12) + 'px ' + theme.font;
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath();
        for (let i = 1; i <= 4; i++) { c.moveTo(ex(i), ch.py); c.lineTo(ex(i), ch.py + ch.ph); }
        c.stroke(); c.restore();
        for (let i = 0; i < 5; i++) K.text(c, String(i + 1), (ex(i) + ex(i + 1)) / 2, ch.py + ch.ph - 9 - (i % 2 ? 12 : 0), { font: 'bold 11px ' + theme.font, color: i === s.stage ? theme.fg : theme.muted, align: 'center', baseline: 'middle' });
        let ty = ch.sy(100) + (small ? 12 : 18);
        K.text(c, tr({ en: 'Energy needed for each stage', hr: 'Energija potrebna za svaku fazu' }), ch.px + ch.pw - 8, ty, { font: 'bold ' + tf, color: theme.fg, align: 'right', baseline: 'middle' });
        STAGES.forEach((sg, i) => {
          ty += rowH;
          K.text(c, (i + 1) + '  ' + tr(sg.name) + ': ' + fm(STAGE_E[i] * cu.m / 1000, 0) + ' kJ', ch.px + ch.pw - 8, ty, { font: (i === s.stage ? 'bold ' : '') + tf, color: i === s.stage ? theme.fg : theme.muted, align: 'right', baseline: 'middle' });
        });
      }

      // ---------- (b) mixing water ----------
      function jug(c, sx, sy, jw, jh, side, ang, lvl, T, body) {   // spout corner at (sx, sy); side +1: spout on the right
        c.save(); c.translate(sx, sy); c.rotate(side * ang);
        const x0 = side > 0 ? -jw : 0;
        if (lvl > 0.01) { c.fillStyle = K.withAlpha(tempCol(T), 0.75); c.fillRect(x0 + 2, jh * (1 - lvl), jw - 4, jh * lvl - 2); }
        c.strokeStyle = theme.fg; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0, jh - 4); c.quadraticCurveTo(x0, jh, x0 + 4, jh); c.lineTo(x0 + jw - 4, jh); c.quadraticCurveTo(x0 + jw, jh, x0 + jw, jh - 4); c.lineTo(x0 + jw, 0); c.stroke();
        if (body) { c.beginPath(); c.arc(side > 0 ? -jw : jw, jh * 0.45, jh * 0.22, side > 0 ? Math.PI / 2 : -Math.PI / 2, side > 0 ? -Math.PI / 2 : Math.PI / 2); c.stroke(); c.beginPath(); c.moveTo(0, 0); c.lineTo(side * 7, -5); c.stroke(); }
        c.restore();
      }
      function drawMix(c, w, h) {
        const mx = st.mx, L0 = split(w, h, 0.58, 0.58), sw = L0.sw, sh = L0.sh, done = mx.p >= 1, Tf = mixT(mx.real);
        head(c, tr({ en: 'Mixing hot and cold water', hr: 'Miješanje tople i hladne vode' }), sw);
        if (done) fit(c, 'T = (m₁·T₁ + m₂·T₂) / (m₁ + m₂) = (' + fm(mx.m1, 1) + ' · ' + fm(mx.T1, 0) + ' + ' + fm(mx.m2, 1) + ' · ' + fm(mx.T2, 0) + ') / ' + fm(mx.m1 + mx.m2, 1) + ' = ' + fm(mixT(false), 1) + ' °C', 12, 36, sw - 24, { size: 12 });
        else fit(c, tr({ en: 'What will the temperature of the mixture be? Guess, then pour.', hr: 'Kolika će biti temperatura smjese? Predvidi pa ulij.' }), 12, 36, sw - 24, { size: 12, color: theme.muted });
        if (done && mx.real) fit(c, tr({ en: 'Measured in the real cup: ', hr: 'Izmjereno u stvarnoj šalici: ' }) + fm(Tf, 1) + ' °C', 12, 53, sw - 24, { size: 12, bold: true });
        const jw = Math.min(sw * 0.19, 84), jh = Math.min(jw * 1.3, sh * 0.34), base = sh - 26, cx = sw / 2, cw = jw * 1.3, chh = Math.min(jh * 1.15, sh * 0.38), ct = base - chh;
        c.strokeStyle = theme.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(8, base + 2); c.lineTo(sw - 8, base + 2); c.stroke();
        // the cup with its thermometer
        const fill = ease((mx.p - 0.15) / 0.65) * (mx.m1 + mx.m2) / 2, Tshow = mx.p < 0.2 ? null : done ? Tf : Tf + (T_ROOM - Tf) * Math.exp(-6 * (mx.p - 0.2) / 0.8), wl = base - 2 - fill * (chh - 8);
        if (fill > 0.005) { c.fillStyle = K.withAlpha(tempCol(Tshow === null ? T_ROOM : Tshow), 0.75); c.fillRect(cx - cw / 2 + 2, wl, cw - 4, base - 2 - wl); }
        thermo(c, cx + cw * 0.22, ct - 34, base - 20, Tshow === null ? T_ROOM : Tshow, 0, 100);
        jug(c, cx - cw / 2, ct, cw, chh, -1, 0, 0, 0, false);
        K.text(c, Tshow === null ? 'T = ?' : 'T = ' + fm(Tshow, 1) + ' °C', cx - cw * 0.1, ct - 22, { font: 'bold 16px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        // the two jugs: they lift, tilt and pour, then go back
        const mv = ease(Math.min(1, mx.p * 3.2)) * (1 - ease((mx.p - 0.82) / 0.18)), left = 1 - ease((mx.p - 0.12) / 0.6);
        [[1, sw * 0.16, mx.m1, mx.T1, { en: 'hot water', hr: 'topla voda' }, '₁'], [-1, sw * 0.84, mx.m2, mx.T2, { en: 'cold water', hr: 'hladna voda' }, '₂']].forEach(q => {
          const side = q[0], rx = q[1] + side * jw / 2, ry = base - jh, px = cx - side * (cw / 2 - 6), py = ct - 16;
          const sx = K.lerp(rx, px - side * 4, mv), sy = K.lerp(ry, py, mv);
          if (mx.p > 0.14 && mx.p < 0.8) { c.strokeStyle = K.withAlpha(tempCol(q[3]), 0.85); c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx + side * 4, sy); c.quadraticCurveTo(sx + side * 12, sy + 6, sx + side * 12, Math.max(sy + 8, wl)); c.stroke(); c.lineCap = 'butt'; }
          jug(c, sx, sy, jw, jh, side, 1.05 * mv, (0.12 + 0.8 * q[2]) * left, q[3], true);
          if (mv < 0.05) {
            fit(c, tr(q[4]), q[1], ry - 42, sw * 0.3, { size: 12, bold: true, align: 'center' });
            fit(c, 'm' + q[5] + ' = ' + fm(q[2], 1) + ' kg', q[1], ry - 27, sw * 0.3, { size: 12, align: 'center' });
            fit(c, 'T' + q[5] + ' = ' + fm(q[3], 0) + ' °C', q[1], ry - 12, sw * 0.3, { size: 12, align: 'center' });
          }
        });
        // results table
        const r = L0.r, n = mx.trials.length, rowH = Math.min(24, (r.h - 44) / 7.4), cols = ['m₁ (kg)', 'T₁ (°C)', 'm₂ (kg)', 'T₂ (°C)', 'T (°C)'], colW = (r.w - 16) / 5, tf = (r.w < 330 ? 11 : 12) + 'px ' + theme.font;
        c.fillStyle = theme.surface; K.roundRect(c, r.x, r.y, r.w, r.h, 8); c.fill();
        K.text(c, tr({ en: 'Results: temperature of a mixture', hr: 'Rezultati: temperatura smjese' }), r.x + 10, r.y + 15, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        const y0 = r.y + 30 + rowH / 2;
        cols.forEach((s, i) => K.text(c, s, r.x + 8 + colW * (i + 1) - 6, y0, { font: 'bold ' + tf, color: i === 4 ? theme.fg : theme.muted, align: 'right', baseline: 'middle' }));
        c.strokeStyle = theme.line; c.lineWidth = 1; c.beginPath();
        for (let k = 0; k <= Math.max(1, n); k++) { c.moveTo(r.x + 8, y0 + rowH * (k + 0.5)); c.lineTo(r.x + r.w - 8, y0 + rowH * (k + 0.5)); }
        c.stroke();
        mx.trials.forEach((t, k) => [fm(t.m1, 1), fm(t.T1, 0), fm(t.m2, 1), fm(t.T2, 0), fm(t.T, 1) + (t.real ? ' *' : '')].forEach((s, i) =>
          K.text(c, s, r.x + 8 + colW * (i + 1) - 6, y0 + rowH * (k + 1), { font: (i === 4 ? 'bold ' : '') + tf, color: theme.fg, align: 'right', baseline: 'middle' })));
        if (!n) K.text(c, tr({ en: 'Pour, then press Record', hr: 'Ulij pa pritisni „Zabilježi“' }), r.x + r.w / 2, y0 + rowH, { font: tf, color: theme.muted, align: 'center', baseline: 'middle' });
        if (mx.trials.some(t => t.real)) K.text(c, tr({ en: '* real cup', hr: '* stvarna šalica' }), r.x + 10, r.y + r.h - 10, { font: '10px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }

      // ---------- (c) which heats fastest? ----------
      function drawRace(c, w, h) {
        const rc = st.rc, L0 = split(w, h, 0.56, 0.54), sw = L0.sw, sh = L0.sh, chosen = SUBS.map((s, i) => i).filter(i => rc.sel[i]), cols = [theme.c1, theme.c2, theme.c3, theme.c4];
        head(c, tr({ en: 'Same mass, same heater: ', hr: 'Ista masa, isti grijač: ' }) + fm(rc.m, 1) + ' kg, ' + fm(rc.P, 0) + ' W', sw);
        fit(c, 'ΔT = P · t / (m · c),   c: J/(kg·°C),   t = ' + fm(rc.t, 0) + ' s', 12, 36, sw - 24, { size: 12 });
        const colW = (sw - 12) / 6, top = 74, bot = sh - 76;
        SUBS.forEach((sub, i) => {
          const x = 6 + colW * (i + 0.5), T = raceT(i, rc.t), fin = rc.t >= raceEnd(i), k = chosen.indexOf(i);
          K.text(c, fm(T, 0) + ' °C', x, top - 14, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          thermo(c, x, top, bot, T, 0, 100);
          c.strokeStyle = theme.muted; c.lineWidth = 1; c.beginPath(); [T_ROOM, 100].forEach(tv => { const y = bot - tv / 100 * (bot - top - 4); c.moveTo(x + 4, y); c.lineTo(x + 9, y); }); c.stroke();
          c.fillStyle = L.running && !fin ? theme.c8 : theme.surface2; c.strokeStyle = theme.fg; c.lineWidth = 1.5; K.roundRect(c, x - colW * 0.3, bot + 18, colW * 0.6, 6, 3); c.fill(); c.stroke();
          if (k >= 0) { c.fillStyle = cols[k]; c.fillRect(x - colW * 0.3, bot + 29, colW * 0.6, 4); }
          fit(c, tr(sub.short), x, sh - 36, colW - 4, { size: 11, bold: true, align: 'center' });
          fit(c, 'c = ' + fm(sub.c, 0), x, sh - 23, colW - 4, { size: 10, align: 'center', color: theme.muted });
          if (fin) fit(c, fm(raceEnd(i), 0) + ' s', x, sh - 9, colW - 4, { size: 11, bold: true, align: 'center', color: theme.good });
        });
        const r = L0.r, ax = timeAxis(raceEnd(0));
        const ch = K.lineChart(c, { x: r.x, y: r.y, w: r.w, h: r.h, xMin: 0, xMax: ax.max, xTicks: ax.ticks, yMin: 0, yMax: 100, yTicks: 5, nice: false,
          yLabel: { en: 'temperature (°C)', hr: 'temperatura (°C)' }, series: [], theme, lang });
        xLabel(c, ch, ax.label);
        c.save(); c.beginPath(); c.rect(ch.px, ch.py - 6, ch.pw + 6, ch.ph + 6); c.clip();
        chosen.forEach((i, k) => {
          const te = Math.min(rc.t, raceEnd(i));
          c.strokeStyle = cols[k]; c.lineWidth = 2; c.beginPath(); c.moveTo(ch.sx(0), ch.sy(T_ROOM)); c.lineTo(ch.sx(te / ax.u), ch.sy(raceT(i, te))); c.lineTo(ch.sx(rc.t / ax.u), ch.sy(raceT(i, rc.t))); c.stroke();
          c.fillStyle = cols[k]; c.beginPath(); c.arc(ch.sx(rc.t / ax.u), ch.sy(raceT(i, rc.t)), 4, 0, Math.PI * 2); c.fill();
        });
        c.restore();
        chosen.forEach((i, k) => {   // legend in the empty corner below the lines
          const y = ch.py + ch.ph - 12 - 15 * (chosen.length - 1 - k), txt = tr(SUBS[i].short);
          K.text(c, txt, ch.px + ch.pw - 8, y, { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
          c.font = '11px ' + theme.font; c.fillStyle = cols[k]; c.fillRect(ch.px + ch.pw - 24 - c.measureText(txt).width, y - 5, 10, 10);
        });
        if (!chosen.length) K.text(c, tr({ en: 'Switch on up to 4 substances for the chart', hr: 'Za graf uključi najviše 4 tvari' }), ch.px + ch.pw / 2, ch.py + ch.ph / 2, { font: '12px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      }
      function draw() {
        const c = cv.ctx, w = cv.w, h = cv.h;
        c.clearRect(0, 0, w, h); c.fillStyle = theme.sky; c.fillRect(0, 0, w, h);
        c.lineCap = 'butt'; c.lineJoin = 'round';
        if (st.mode === 'curve') drawCurve(c, w, h); else if (st.mode === 'mix') drawMix(c, w, h); else drawRace(c, w, h);
      }

      // ---------- lifecycle ----------
      function reset() {
        L.stop();
        st.mode = 'curve'; segMode.set('curve'); st.speed = 60; segSpeed.set('60'); st.anim = 0;
        st.cu = { m: 0.5, P: 1000, E: 0, t: 0, done: false }; slM.set(0.5); slP.set(1000);
        st.mx = { m1: 0.5, T1: 80, m2: 0.5, T2: 20, real: false, p: 0, poured: false, trials: [] }; slM1.set(0.5); slT1.set(80); slM2.set(0.5); slT2.set(20); tgReal.set(false);
        st.rc = { m: 0.5, P: 300, t: 0, done: false, sel: [true, true, true, false, false, true], full: false }; slMr.set(0.5); slPr.set(300);
        tgSub.forEach((t, i) => t.set(st.rc.sel[i]));
        moveParticles(0, stateOf(0));
        showControls(); updatePlay(); refresh();
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
