/* FizLab sim: How Heat Travels — conduction (spoon in hot tea), convection (pot on a stove), radiation (heater and two cans). */
(function () {
  'use strict';
  const K = window.SimKit;
  const T_ROOM = 20;
  const T_COLD = 20, T_HOT = 100;           // colour scale
  // Conduction rod: thermal diffusivity a (m²/s) and surface-loss rate b (1/s) of a thin spoon handle (h ≈ 10 W/(m²·K), r ≈ 3 mm)
  const ROD_MATS = [
    { id: 'silver', a: 1.65e-4, b: 2.7e-3, label: { en: 'Silver', hr: 'Srebro' } },
    { id: 'copper', a: 1.11e-4, b: 1.9e-3, label: { en: 'Copper', hr: 'Bakar' } },
    { id: 'steel', a: 1.2e-5, b: 1.7e-3, label: { en: 'Steel', hr: 'Čelik' } },
    { id: 'glass', a: 3.4e-7, b: 3.2e-3, label: { en: 'Glass', hr: 'Staklo' } },
    { id: 'wood', a: 8.2e-8, b: 6.5e-3, label: { en: 'Wood', hr: 'Drvo' } },
    { id: 'plastic', a: 1.0e-7, b: 3.7e-3, label: { en: 'Plastic', hr: 'Plastika' } }
  ];
  const N_CELLS = 40, ROD_L = 0.12, DX = ROD_L / N_CELLS;   // exposed handle: 12 cm
  // Convection pot
  const N_PART = 120, M_WATER = 1, C_WATER = 4186;
  // Radiation: heater power, can data (empty aluminium can)
  const P_HEATER = 2000, CAN_C = 13.5 /* J/K */, CAN_A = 0.01 /* m² facing area */, CAN_HA = 0.36 /* W/K losses */, ABS_BLACK = 0.95, ABS_SHINY = 0.10;

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
  const MODES = [
    { id: 'conduction', label: { en: 'Conduction', hr: 'Vođenje' }, speed: 30 },
    { id: 'convection', label: { en: 'Convection', hr: 'Strujanje' }, speed: 10 },
    { id: 'radiation', label: { en: 'Radiation', hr: 'Zračenje' }, speed: 10 }
  ];

  window.Sims.register({
    id: 'heattransfer',
    title: { en: 'How Heat Travels', hr: 'Kako putuje toplina' },
    summary: {
      en: 'Three ways heat moves: along a spoon in hot tea (conduction), around a pot of water (convection) and across empty space from a heater (radiation).',
      hr: 'Tri načina na koja se toplina širi: uz žlicu u vrućem čaju (vođenje), kruženjem vode u loncu (strujanje) i kroz prazan prostor od grijalice (zračenje).'
    },
    tasks: [
      { en: 'Conduction: compare a steel and a wooden spoon. Which tip gets hot? Which would you rather hold?', hr: 'Vođenje: usporedi čeličnu i drvenu žlicu. Koji se vrh ugrije? Koju bi radije držao?' },
      { en: 'Convection: turn the stove to full power and switch the arrows on. Where does the warm water go?', hr: 'Strujanje: pojačaj štednjak do kraja i uključi strelice. Kamo odlazi topla voda?' },
      { en: 'Radiation: which can gets hotter, the black or the shiny one? Now move the cans twice as far away.', hr: 'Zračenje: koja se limenka više ugrije, crna ili sjajna? Sad odmakni limenke dvostruko dalje.' },
      { en: 'Put the shield between the heater and the cans. What happens to their temperatures?', hr: 'Stavi zaslon između grijalice i limenki. Što se događa s njihovim temperaturama?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 480 });
      const C = K.controls(container, lang);

      let seed = 7;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const st = {
        mode: 'conduction', speed: 30, t: 0, anim: 0,
        rod: { mat: 'steel', Ttea: 80, T: new Array(N_CELLS).fill(T_ROOM) },
        conv: { P: 1000, arrows: true, parts: [], Tmean: T_ROOM },
        rad: { d: 0.5, shield: false, Tb: T_ROOM, Ts: T_ROOM }
      };

      // ---------- controls ----------
      const segMode = C.segmented({ label: { en: 'How does the heat travel?', hr: 'Kako putuje toplina?' }, options: MODES.map(m => ({ value: m.id, label: m.label })), value: 'conduction',
        onChange: v => { st.mode = v; const m = MODES.find(x => x.id === v) || MODES[0]; st.speed = m.speed; slSpeed.set(m.speed); resetMode(); showControls(); } });
      const selMat = C.select({ label: { en: 'Spoon material', hr: 'Materijal žlice' }, options: ROD_MATS.map(m => ({ value: m.id, label: m.label })), value: 'steel',
        onChange: v => { st.rod.mat = v; resetMode(); } });
      const slTea = C.slider({ label: { en: 'Tea temperature', hr: 'Temperatura čaja' }, min: 50, max: 100, step: 1, value: 80, unit: '°C', digits: 0, onChange: v => { st.rod.Ttea = v; } });
      const slPower = C.slider({ label: { en: 'Stove power', hr: 'Snaga štednjaka' }, min: 0, max: 2000, step: 100, value: 1000, unit: 'W', digits: 0, onChange: v => { st.conv.P = v; } });
      const tgArrows = C.toggle({ label: { en: 'Show circulation arrows', hr: 'Prikaži strelice kruženja' }, value: true, onChange: v => { st.conv.arrows = v; } });
      const slDist = C.slider({ label: { en: 'Distance of the cans', hr: 'Udaljenost limenki' }, min: 0.3, max: 1.5, step: 0.05, value: 0.5, unit: 'm', digits: 2, onChange: v => { st.rad.d = v; } });
      const tgShield = C.toggle({ label: { en: 'Shield between heater and cans', hr: 'Zaslon između grijalice i limenki' }, value: false, onChange: v => { st.rad.shield = v; } });
      const slSpeed = C.slider({ label: { en: 'Time speed', hr: 'Brzina vremena' }, min: 1, max: 60, step: 1, value: 30, format: (v, l) => K.fmt(v, 0, l) + '×', onChange: v => { st.speed = v; } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const outTip = C.readout({ label: { en: 'Spoon tip temperature', hr: 'Temperatura vrha žlice' }, unit: '°C', digits: 1 });
      const outMid = C.readout({ label: { en: 'Handle middle', hr: 'Sredina ručke' }, unit: '°C', digits: 1 });
      const outWater = C.readout({ label: { en: 'Water temperature (average)', hr: 'Temperatura vode (prosjek)' }, unit: '°C', digits: 1 });
      const outCirc = C.readout({ label: { en: 'Circulation', hr: 'Kruženje' } });
      const outPower = C.readout({ label: { en: 'Stove power', hr: 'Snaga štednjaka' }, unit: 'W', digits: 0 });
      const outBlack = C.readout({ label: { en: 'Black can', hr: 'Crna limenka' }, unit: '°C', digits: 1 });
      const outShiny = C.readout({ label: { en: 'Shiny can', hr: 'Sjajna limenka' }, unit: '°C', digits: 1 });
      const outInt = C.readout({ label: { en: 'Radiation intensity at the cans', hr: 'Jakost zračenja kod limenki' }, unit: 'W/m²', digits: 0 });
      const outTime = C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 's', digits: 0 });
      const note = C.note({ text: { en: '', hr: '' } });

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
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };
      function showControls() {
        const m = st.mode;
        [[selMat, 'conduction'], [slTea, 'conduction'], [outTip, 'conduction'], [outMid, 'conduction'],
          [slPower, 'convection'], [tgArrows, 'convection'], [outWater, 'convection'], [outCirc, 'convection'], [outPower, 'convection'],
          [slDist, 'radiation'], [tgShield, 'radiation'], [outBlack, 'radiation'], [outShiny, 'radiation'], [outInt, 'radiation']
        ].forEach(([c, mode]) => show(c, mode === m));
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }

      // ---------- state ----------
      function initParticles() {
        seed = 7;
        st.conv.parts = Array.from({ length: N_PART }, () => ({ x: 0.04 + 0.92 * rnd(), y: 0.04 + 0.92 * rnd(), T: T_ROOM }));
      }
      function resetMode() {
        st.t = 0;
        st.rod.T = new Array(N_CELLS).fill(T_ROOM);
        initParticles(); st.conv.Tmean = T_ROOM;
        st.rad.Tb = T_ROOM; st.rad.Ts = T_ROOM;
        updateOut(); draw();
      }
      function reset() {
        st.mode = 'conduction'; segMode.set('conduction'); st.speed = 30; slSpeed.set(30);
        st.rod.mat = 'steel'; selMat.set('steel'); st.rod.Ttea = 80; slTea.set(80);
        st.conv.P = 1000; slPower.set(1000); st.conv.arrows = true; tgArrows.set(true);
        st.rad.d = 0.5; slDist.set(0.5); st.rad.shield = false; tgShield.set(false);
        showControls(); resetMode();
        if (!ctx.reducedMotion) L.start(); else L.stop();
        updatePlay(); draw();
      }

      // ---------- physics ----------
      function stepRod(dte) {
        const mat = ROD_MATS.find(m => m.id === st.rod.mat) || ROD_MATS[2];
        const T = st.rod.T, a = mat.a, b = mat.b;
        const dtMax = 0.4 * DX * DX / a;
        const n = Math.min(600, Math.max(1, Math.ceil(dte / dtMax))), h = dte / n;
        for (let k = 0; k < n; k++) {
          const prev = T.slice();
          for (let i = 0; i < N_CELLS; i++) {
            const left = i === 0 ? st.rod.Ttea : prev[i - 1];          // cell 0 touches the spoon bowl in the tea
            const right = i === N_CELLS - 1 ? prev[i] : prev[i + 1];   // insulated tip
            T[i] = prev[i] + h * (a * (left - 2 * prev[i] + right) / (DX * DX) - b * (prev[i] - T_ROOM));
          }
        }
      }
      function stepConv(dt, dte) {
        const P = st.conv.P, parts = st.conv.parts;
        const mp = M_WATER / N_PART * C_WATER;                 // heat capacity of one particle (J/K)
        let heated = 0;
        parts.forEach(p => { if (p.y < 0.14 && Math.abs(p.x - 0.5) < 0.3) heated++; });
        const dTheat = heated ? P * dte / (heated * mp) : 0;
        const dtAdv = dt * Math.min(st.speed, 4);               // circulation drawn smoothly even at high time speed
        let sum = 0;
        const A0 = 0.035 * (P / 1000);
        parts.forEach(p => {
          const Tn = K.clamp((p.T - T_COLD) / (T_HOT - T_COLD), 0, 1);
          const A = A0 * (0.4 + 0.6 * Tn);                     // warm water moves faster
          const u = A * Math.PI * Math.sin(2 * Math.PI * p.x) * Math.cos(Math.PI * p.y);
          const v = -2 * Math.PI * A * Math.cos(2 * Math.PI * p.x) * Math.sin(Math.PI * p.y);
          p.x += (u + (rnd() - 0.5) * 0.01) * dtAdv * 2;
          p.y += (v + (rnd() - 0.5) * 0.01) * dtAdv * 2;
          if (p.x < 0.03) p.x = 0.03; if (p.x > 0.97) p.x = 0.97; if (p.y < 0.03) p.y = 0.03; if (p.y > 0.97) p.y = 0.97;
          if (p.y < 0.14 && Math.abs(p.x - 0.5) < 0.3) p.T += dTheat;
          if (p.y > 0.86 || p.x < 0.1 || p.x > 0.9) p.T -= 0.01 * (p.T - T_ROOM) * dte;  // heat lost at the surface and walls
          p.T += (st.conv.Tmean - p.T) * Math.min(0.5, 0.02 * dte);                     // slow mixing
          if (p.T > T_HOT) p.T = T_HOT;                                                  // boiling point
          sum += p.T;
        });
        st.conv.Tmean = sum / parts.length;
      }
      function stepRad(dte) {
        const I = st.rad.shield ? 0 : P_HEATER / (4 * Math.PI * st.rad.d * st.rad.d);
        const n = 4, h = dte / n;
        for (let k = 0; k < n; k++) {
          st.rad.Tb += h * (ABS_BLACK * I * CAN_A - CAN_HA * (st.rad.Tb - T_ROOM)) / CAN_C;
          st.rad.Ts += h * (ABS_SHINY * I * CAN_A - CAN_HA * (st.rad.Ts - T_ROOM)) / CAN_C;
        }
        return I;
      }
      function step(dt) {
        st.anim += dt;
        const dte = dt * st.speed;
        if (st.mode === 'conduction') stepRod(dte);
        else if (st.mode === 'convection') stepConv(dt, dte);
        else stepRad(dte);
        st.t += dte;
      }
      function circWord() {
        const P = st.conv.P;
        if (P <= 0) return { en: 'none', hr: 'nema' };
        if (P < 700) return { en: 'slow', hr: 'sporo' };
        if (P < 1400) return { en: 'medium', hr: 'srednje' };
        return { en: 'fast', hr: 'brzo' };
      }
      function updateOut() {
        outTime.set(st.t);
        if (st.mode === 'conduction') {
          outTip.set(st.rod.T[N_CELLS - 1]); outMid.set(st.rod.T[Math.floor(N_CELLS / 2)]);
          note.set({ en: 'Conduction: in a solid, heat passes from particle to particle. Metals conduct well; wood and plastic badly — that is why pan handles are plastic.',
            hr: 'Vođenje: u čvrstom tijelu toplina prelazi s čestice na česticu. Metali dobro vode toplinu, a drvo i plastika slabo – zato su ručke lonaca plastične.' });
        } else if (st.mode === 'convection') {
          outWater.set(st.conv.Tmean); outCirc.set(circWord()); outPower.set(st.conv.P);
          note.set({ en: 'Convection: warm water is less dense, so it rises; cooler water sinks and takes its place. The whole liquid circulates and carries the heat.',
            hr: 'Strujanje: topla voda ima manju gustoću pa se diže; hladnija se spušta na njezino mjesto. Cijela tekućina kruži i prenosi toplinu.' });
        } else {
          outBlack.set(st.rad.Tb); outShiny.set(st.rad.Ts); outInt.set(st.rad.shield ? 0 : P_HEATER / (4 * Math.PI * st.rad.d * st.rad.d));
          note.set({ en: 'Radiation needs no material — it reaches us from the Sun through empty space. Dark surfaces absorb it, shiny ones reflect it. Twice as far → four times weaker.',
            hr: 'Zračenje ne treba tvar – od Sunca do nas stiže kroz prazan svemir. Tamne površine ga upijaju, sjajne odbijaju. Dvostruko dalje → četiri puta slabije.' });
        }
      }

      // ---------- drawing ----------
      const tempColor = T => mixColor(theme.c1, theme.c8, (T - T_COLD) / (T_HOT - T_COLD));
      function colorScale(ctx, x, y, w) {
        for (let i = 0; i < w; i++) { ctx.fillStyle = mixColor(theme.c1, theme.c8, i / w); ctx.fillRect(x + i, y, 1.5, 8); }
        K.text(ctx, K.fmt(T_COLD, 0, lang) + ' °C', x, y + 12, { font: '10px ' + theme.font, color: theme.muted, baseline: 'top' });
        K.text(ctx, K.fmt(T_HOT, 0, lang) + ' °C', x + w, y + 12, { font: '10px ' + theme.font, color: theme.muted, align: 'right', baseline: 'top' });
      }
      function thermometer(ctx, x, yTop, yBot, T, Tmin, Tmax) {
        const tw = 7, r = 6;
        ctx.fillStyle = theme.surface; ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        K.roundRect(ctx, x - tw / 2, yTop, tw, yBot - yTop, 3); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, yBot + r - 1, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const frac = K.clamp((T - Tmin) / (Tmax - Tmin), 0, 1), level = yBot - frac * (yBot - yTop - 3);
        ctx.fillStyle = theme.c8; ctx.fillRect(x - 1.5, level, 3, yBot - level + 2);
        ctx.beginPath(); ctx.arc(x, yBot + r - 1, r - 2.5, 0, Math.PI * 2); ctx.fill();
      }
      function drawConduction(ctx, w, h) {
        const tableY = h - 36;
        ctx.fillStyle = theme.ground; ctx.fillRect(0, tableY, w, h - tableY);
        const cw = K.clamp(w * 0.2, 70, 130), chh = cw * 0.85, cx = w * 0.14, ctop = tableY - chh;
        const teaY = ctop + chh * 0.18;
        // cup + tea
        ctx.fillStyle = theme.surface2; ctx.strokeStyle = theme.fg; ctx.lineWidth = 2;
        K.roundRect(ctx, cx, ctop, cw, chh, 10); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + cw + 2, ctop + chh * 0.5, chh * 0.22, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.fillStyle = K.withAlpha(theme.c2, 0.55); ctx.fillRect(cx + 3, teaY, cw - 6, chh - (teaY - ctop) - 3);
        K.text(ctx, K.fmt(st.rod.Ttea, 0, lang) + ' °C', cx + cw / 2, tableY - 14, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center' });
        // steam
        ctx.strokeStyle = K.withAlpha(theme.muted, 0.5 + 0.5 * (st.rod.Ttea - 50) / 50); ctx.lineWidth = 1.5;
        for (let s = 0; s < 3; s++) {
          const sx = cx + cw * (0.3 + 0.2 * s), ph = st.anim * 2 + s;
          ctx.beginPath();
          for (let yy = 0; yy <= 26; yy += 2) ctx.lineTo(sx + 4 * Math.sin(yy / 6 + ph), teaY - 4 - yy);
          ctx.stroke();
        }
        // spoon: bowl in the tea, handle up to the right
        const ang = 62 * Math.PI / 180, bx = cx + cw * 0.5, by = tableY - chh * 0.3;
        const sub = (by - teaY) / Math.sin(ang);
        const Lpx = Math.min((teaY - 52) / Math.sin(ang), (w - bx - 70) / Math.cos(ang));
        const ux = Math.cos(ang), uy = -Math.sin(ang);
        ctx.lineCap = 'round'; ctx.lineWidth = 9;
        ctx.strokeStyle = tempColor(st.rod.Ttea); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + ux * sub, by + uy * sub); ctx.stroke();
        ctx.fillStyle = tempColor(st.rod.Ttea); ctx.beginPath(); ctx.ellipse(bx, by, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
        const hx0 = bx + ux * sub, hy0 = by + uy * sub, seg = Lpx / N_CELLS;
        ctx.lineCap = 'butt';
        for (let i = 0; i < N_CELLS; i++) {
          ctx.strokeStyle = tempColor(st.rod.T[i]);
          ctx.beginPath(); ctx.moveTo(hx0 + ux * seg * i, hy0 + uy * seg * i); ctx.lineTo(hx0 + ux * seg * (i + 1.15), hy0 + uy * seg * (i + 1.15)); ctx.stroke();
        }
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(hx0 - uy * 4.5, hy0 + ux * 4.5); ctx.lineTo(hx0 + ux * Lpx - uy * 4.5, hy0 + uy * Lpx + ux * 4.5);
        ctx.moveTo(hx0 + uy * 4.5, hy0 - ux * 4.5); ctx.lineTo(hx0 + ux * Lpx + uy * 4.5, hy0 + uy * Lpx - ux * 4.5); ctx.stroke();
        // temperature labels along the handle (teacher values)
        [[0, { en: 'near the tea', hr: 'uz čaj' }], [N_CELLS / 2, { en: 'middle', hr: 'sredina' }], [N_CELLS - 1, { en: 'tip', hr: 'vrh' }]].forEach(([i, lab]) => {
          const px = hx0 + ux * seg * (i + 0.5), py = hy0 + uy * seg * (i + 0.5);
          const T = st.rod.T[Math.min(N_CELLS - 1, Math.floor(i))];
          ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
          K.text(ctx, K.tr(lab, lang) + ': ' + K.fmt(T, 1, lang) + ' °C', px + 12, py, { font: (i === N_CELLS - 1 ? 'bold ' : '') + '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        });
        // tip thermometer
        const tipX = hx0 + ux * Lpx, tipY = hy0 + uy * Lpx;
        thermometer(ctx, tipX + 30, tipY + 14, tipY + 64, st.rod.T[N_CELLS - 1], T_COLD, T_HOT);
        const mat = ROD_MATS.find(m => m.id === st.rod.mat) || ROD_MATS[2];
        K.text(ctx, K.tr({ en: 'Spoon: ', hr: 'Žlica: ' }, lang) + K.tr(mat.label, lang).toLowerCase() + ', ' + K.fmt(ROD_L * 100, 0, lang) + ' cm ' + K.tr({ en: 'handle', hr: 'ručke' }, lang) + '   t = ' + K.fmt(st.t, 0, lang) + ' s', 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'Heat is conducted from particle to particle along the spoon', hr: 'Toplina se vodi s čestice na česticu duž žlice' }, lang), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        colorScale(ctx, w - 110, h - 30, 96);
      }
      function drawConvection(ctx, w, h) {
        const pw = Math.min(w * 0.5, h * 0.95), ph = pw * 0.6, px = (w - pw) / 2, ptop = h * 0.2;
        const pbot = ptop + ph, wtop = ptop + 12;
        // stove plate and flames
        const plateY = pbot + 16;
        ctx.fillStyle = theme.surface2; ctx.strokeStyle = theme.fg; ctx.lineWidth = 2;
        K.roundRect(ctx, px - 20, plateY, pw + 40, 12, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = theme.ground; ctx.fillRect(0, plateY + 12, w, h - plateY - 12);
        const nf = Math.round(st.conv.P / 200);
        for (let i = 0; i < nf; i++) {
          const fx = px + pw * (0.5 + (i - (nf - 1) / 2) * 0.08), fh = 10 + 4 * Math.sin(st.anim * 9 + i * 1.7);
          ctx.fillStyle = i % 2 ? theme.c4 : theme.c2;
          ctx.beginPath(); ctx.moveTo(fx - 5, plateY); ctx.lineTo(fx, plateY - fh); ctx.lineTo(fx + 5, plateY); ctx.closePath(); ctx.fill();
        }
        // water + particles
        ctx.fillStyle = theme.water; ctx.fillRect(px, wtop, pw, pbot - wtop);
        const r = K.clamp(pw / 80, 2.5, 4);
        st.conv.parts.forEach(p => {
          ctx.fillStyle = tempColor(p.T);
          ctx.beginPath(); ctx.arc(px + p.x * pw, pbot - p.y * (pbot - wtop), r, 0, Math.PI * 2); ctx.fill();
        });
        if (st.conv.Tmean >= T_HOT - 0.5) {
          ctx.fillStyle = K.withAlpha('#ffffff', 0.7);
          for (let i = 0; i < 8; i++) { const bxp = px + pw * (0.3 + 0.4 * ((i * 0.37) % 1)), byp = pbot - ((st.anim * 40 + i * 30) % (pbot - wtop)); ctx.beginPath(); ctx.arc(bxp, byp, 3, 0, Math.PI * 2); ctx.fill(); }
        }
        // pot walls
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, ptop); ctx.lineTo(px, pbot); ctx.lineTo(px + pw, pbot); ctx.lineTo(px + pw, ptop); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 18, ptop + 8); ctx.lineTo(px, ptop + 8); ctx.moveTo(px + pw, ptop + 8); ctx.lineTo(px + pw + 18, ptop + 8); ctx.stroke();
        // circulation arrows (two rolls: up in the middle, down at the walls)
        if (st.conv.arrows && st.conv.P > 0) {
          const cy = (wtop + pbot) / 2, ry = (pbot - wtop) * 0.33, rx = pw * 0.2;
          [[px + pw * 0.27, -1], [px + pw * 0.73, 1]].forEach(([cx, dir]) => {
            const pt = th => [cx + rx * Math.cos(th), cy + ry * Math.sin(th)];
            ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
            for (let q = 0; q < 4; q++) { const th = q * Math.PI / 2 + Math.PI / 4, a = pt(th), b = pt(th + dir * 0.3); K.arrow(ctx, a[0], a[1], b[0], b[1], { color: theme.fg, width: 3, head: 9 }); }
          });
          K.text(ctx, K.tr({ en: 'warm ↑', hr: 'toplo ↑' }, lang), px + pw / 2, cy, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
          K.text(ctx, K.tr({ en: 'cool ↓', hr: 'hladno ↓' }, lang), px + 6, cy, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' });
          K.text(ctx, K.tr({ en: 'cool ↓', hr: 'hladno ↓' }, lang), px + pw - 6, cy, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        }
        K.text(ctx, K.tr({ en: 'Pot with 1 kg of water on a stove, ', hr: 'Lonac s 1 kg vode na štednjaku, ' }, lang) + K.fmt(st.conv.P, 0, lang) + ' W   t = ' + K.fmt(st.t, 0, lang) + ' s', 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'water: ', hr: 'voda: ' }, lang) + K.fmt(st.conv.Tmean, 1, lang) + ' °C' + (st.conv.Tmean >= T_HOT - 0.5 ? K.tr({ en: ' — boiling!', hr: ' – kipi!' }, lang) : ''), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
        colorScale(ctx, w - 110, h - 30, 96);
      }
      function drawCan(ctx, x, y, cw, chh, dark, T, label) {
        ctx.fillStyle = dark ? '#262626' : '#e9e9ee'; ctx.strokeStyle = theme.fg; ctx.lineWidth = 1.5;
        K.roundRect(ctx, x, y, cw, chh, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = dark ? '#3a3a3a' : '#ffffff'; ctx.beginPath(); ctx.ellipse(x + cw / 2, y, cw / 2, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (!dark) { ctx.fillStyle = K.withAlpha('#ffffff', 0.9); ctx.fillRect(x + cw * 0.2, y + 8, cw * 0.15, chh - 16); }
        thermometer(ctx, x + cw + 14, y + 4, y + chh - 10, T, T_COLD, T_HOT);
        K.text(ctx, K.tr(label, lang), x + cw / 2, y - 10, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        K.text(ctx, K.fmt(T, 1, lang) + ' °C', x + cw + 26, y + chh / 2, { font: 'bold 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
      }
      function drawRadiation(ctx, w, h) {
        const R = K.clamp(h * 0.08, 16, 32), hx = 30 + R, hy = h * 0.5;
        const cw = K.clamp(w * 0.07, 24, 44), chh = cw * 1.6;
        const x0 = hx + R + 16, pxPerM = (w - x0 - cw - 80) / 1.6;
        const canX = x0 + st.rad.d * pxPerM;
        const yB = h * 0.3 - chh / 2 + 10, yS = h * 0.72 - chh / 2;
        const shieldX = x0 + (canX - x0) * 0.55;
        // heater (glowing, physical colour)
        ctx.fillStyle = theme.c2; ctx.beginPath(); ctx.arc(hx, hy, R + 4 + 2 * Math.sin(st.anim * 4), 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = theme.c4; ctx.beginPath(); ctx.arc(hx, hy, R, 0, Math.PI * 2); ctx.fill();
        K.text(ctx, K.tr({ en: 'heater', hr: 'grijalica' }, lang), hx, hy + R + 10, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(ctx, K.fmt(P_HEATER, 0, lang) + ' W', hx, hy + R + 24, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        // rays
        const nRays = 13, yTop = yB - 14, yBot = yS + chh + 14;
        ctx.save(); ctx.setLineDash([7, 9]); ctx.lineDashOffset = -((st.anim * 90) % 16); ctx.lineWidth = 2;
        for (let i = 0; i < nRays; i++) {
          const ty = yTop + (yBot - yTop) * i / (nRays - 1);
          const dx = canX - hx, dy = ty - hy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
          let endX = w - 6, hit = null;
          if (st.rad.shield && ty > yTop - 4 && ty < yBot + 4) { endX = shieldX; hit = 'shield'; }
          else if (ty >= yB && ty <= yB + chh) { endX = canX; hit = 'black'; }
          else if (ty >= yS && ty <= yS + chh) { endX = canX; hit = 'shiny'; }
          const ex = endX, ey = hy + uy / ux * (endX - hx);
          ctx.strokeStyle = K.withAlpha(theme.c2, 0.85);
          ctx.beginPath(); ctx.moveTo(hx + ux * (R + 2), hy + uy * (R + 2)); ctx.lineTo(ex, ey); ctx.stroke();
          if (hit === 'shiny') {       // reflected ray
            ctx.strokeStyle = K.withAlpha(theme.c2, 0.45);
            ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - ux * 70, ey + uy * 70); ctx.stroke();
          }
        }
        ctx.restore();
        // shield
        if (st.rad.shield) {
          ctx.fillStyle = theme.surface2; ctx.strokeStyle = theme.fg; ctx.lineWidth = 2;
          K.roundRect(ctx, shieldX - 4, yTop - 10, 8, yBot - yTop + 20, 3); ctx.fill(); ctx.stroke();
          K.text(ctx, K.tr({ en: 'shield', hr: 'zaslon' }, lang), shieldX, yTop - 14, { font: '11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        }
        drawCan(ctx, canX, yB, cw, chh, true, st.rad.Tb, { en: 'black can', hr: 'crna limenka' });
        drawCan(ctx, canX, yS, cw, chh, false, st.rad.Ts, { en: 'shiny can', hr: 'sjajna limenka' });
        // distance marker
        const my = h - 26;
        ctx.strokeStyle = theme.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, my); ctx.lineTo(canX, my); ctx.moveTo(hx, my - 5); ctx.lineTo(hx, my + 5); ctx.moveTo(canX, my - 5); ctx.lineTo(canX, my + 5); ctx.stroke();
        K.text(ctx, 'd = ' + K.fmt(st.rad.d, 2, lang) + ' m', (hx + canX) / 2, my - 4, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
        const I = st.rad.shield ? 0 : P_HEATER / (4 * Math.PI * st.rad.d * st.rad.d);
        K.text(ctx, K.tr({ en: 'Intensity at the cans: ', hr: 'Jakost zračenja kod limenki: ' }, lang) + K.fmt(I, 0, lang) + ' W/m²   t = ' + K.fmt(st.t, 0, lang) + ' s', 12, 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'I = P / (4π·d²): twice as far → four times weaker', hr: 'I = P / (4π·d²): dvostruko dalje → četiri puta slabije' }, lang), 12, 32, { font: '12px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        if (st.mode === 'conduction') drawConduction(ctx, w, h);
        else if (st.mode === 'convection') drawConvection(ctx, w, h);
        else drawRadiation(ctx, w, h);
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      reset();
      return {
        destroy() { L.destroy(); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
