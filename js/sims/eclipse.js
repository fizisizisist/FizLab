/* FizLab sim: Eclipses and shadows — (a) umbra and penumbra behind a ball lit by an extended lamp, (b) solar eclipse,
   (c) lunar eclipse, (d) why eclipses do not happen every month (the Moon's orbit is tilted about 5°).
   All scenes are schematic: sizes and distances are not to scale. */
(function () {
  'use strict';
  const K = window.SimKit;
  const DEG = Math.PI / 180;
  const SCREEN = 200, BALL_R = 10;               // cm: shadow scene (lamp at 0, screen at 200 cm, ball radius 10 cm)
  const TILT_DRAW = 15 * DEG;                    // the 5° tilt is drawn three times steeper so that it can be seen
  const MOON_DIST = 384400, TILT = 5.14 * DEG;   // km and the real tilt of the Moon's orbit
  // physical colours (readable on the light and on the dark sky)
  const SUN = '#ffc93c', SUN_EDGE = '#e89b00', MOON = '#cfd3da', NEW_MOON = '#1c2030', COPPER = '#a8482a', NIGHT = '#0b1030', DAY = '#8fc7ff';
  const NOTES = {
    shadow: { en: 'Light travels in straight lines. Behind the ball there is a region that no light reaches (umbra, the full shadow) and a region reached by light from only a part of the lamp (penumbra, the half-shadow). A point lamp gives a sharp shadow without a penumbra.',
      hr: 'Svjetlost putuje pravocrtno. Iza lopte postoji područje u koje ne dolazi nimalo svjetlosti (sjena) i područje u koje dolazi svjetlost samo s dijela lampe (polusjena). Točkasta lampa daje oštru sjenu bez polusjene.' },
    solar: { en: 'Solar eclipse: at new moon the Moon passes between the Sun and the Earth. In the narrow tip of the umbra the Sun is completely covered (total eclipse); in the wide penumbra only a part of it is covered (partial eclipse).',
      hr: 'Pomrčina Sunca: za mlađaka Mjesec prolazi između Sunca i Zemlje. U uskom vrhu sjene Sunce je potpuno prekriveno (potpuna pomrčina), a u širokoj polusjeni samo djelomično (djelomična pomrčina).' },
    lunar: { en: 'Lunar eclipse: at full moon the Moon passes through the Earth\'s shadow. Inside the umbra it does not vanish but glows dim copper-red, because the Earth\'s air bends a little reddish sunlight into the shadow.',
      hr: 'Pomrčina Mjeseca: za uštapa Mjesec prolazi kroz Zemljinu sjenu. U sjeni ne nestaje, nego slabo svijetli bakrenocrveno, jer Zemljin zrak lomi malo crvenkaste Sunčeve svjetlosti u sjenu.' },
    tilt: { en: 'The Moon\'s orbit is tilted about 5° to the Earth\'s orbit, so at most new and full moons the Moon passes above or below the Sun–Earth line and the shadows miss. An eclipse is possible only when new or full moon happens near a node, where the orbits cross: about twice a year.',
      hr: 'Mjesečeva staza nagnuta je oko 5° prema Zemljinoj stazi, pa za većine mlađaka i uštapa Mjesec prolazi iznad ili ispod pravca Sunce–Zemlja i sjene promaše. Pomrčina je moguća samo kad mlađak ili uštap nastupi blizu čvora, mjesta gdje se staze sijeku: otprilike dvaput godišnje.' }
  };
  const SAFETY = { en: 'Sizes and distances are not to scale. Never look at the Sun directly, not even during an eclipse: use eclipse glasses.',
    hr: 'Veličine i udaljenosti nisu u mjerilu. Nikad ne gledaj izravno u Sunce, ni za vrijeme pomrčine: koristi naočale za pomrčinu.' };
  const TYPES = {
    none: { short: { en: 'none', hr: 'nema' }, solar: { en: 'No eclipse', hr: 'Nema pomrčine' }, lunar: { en: 'No eclipse', hr: 'Nema pomrčine' } },
    penumbral: { short: { en: 'penumbra only', hr: 'samo polusjena' }, lunar: { en: 'Moon in the penumbra', hr: 'Mjesec u polusjeni' } },
    partial: { short: { en: 'partial', hr: 'djelomična' }, solar: { en: 'Partial solar eclipse', hr: 'Djelomična pomrčina Sunca' }, lunar: { en: 'Partial lunar eclipse', hr: 'Djelomična pomrčina Mjeseca' } },
    total: { short: { en: 'total', hr: 'potpuna' }, solar: { en: 'Total solar eclipse', hr: 'Potpuna pomrčina Sunca' }, lunar: { en: 'Total lunar eclipse', hr: 'Potpuna pomrčina Mjeseca' } }
  };
  const PLAY = { en: 'Play', hr: 'Pokreni' }, PAUSE = { en: 'Pause', hr: 'Pauza' };

  window.Sims.register({
    id: 'eclipse',
    title: { en: 'Eclipses and Shadows', hr: 'Pomrčine i sjene' },
    summary: {
      en: 'Make a full shadow and a half-shadow with a lamp and a ball, then move the Moon to cause eclipses of the Sun and of the Moon.',
      hr: 'Napravi sjenu i polusjenu lampom i loptom, a zatim pomiči Mjesec i izazovi pomrčinu Sunca i pomrčinu Mjeseca.'
    },
    tasks: [
      { en: 'Shadow and half-shadow: make the lamp bigger. What happens to the umbra, and what to the penumbra? Then set the lamp size to 0.', hr: 'Sjena i polusjena: povećaj lampu. Što se događa sa sjenom, a što s polusjenom? Zatim postavi veličinu lampe na 0.' },
      { en: 'Solar eclipse: drag the Moon across the Sun–Earth line. When is the eclipse total and when partial? Compare the dark spot with the size of the Earth.', hr: 'Pomrčina Sunca: povuci Mjesec preko pravca Sunce–Zemlja. Kada je pomrčina potpuna, a kada djelomična? Usporedi tamnu mrlju s veličinom Zemlje.' },
      { en: 'Lunar eclipse: move the Moon into the Earth\'s shadow. What colour does it turn? Who on Earth can see this eclipse?', hr: 'Pomrčina Mjeseca: uvedi Mjesec u Zemljinu sjenu. Koje boje postaje? Tko je na Zemlji može vidjeti?' },
      { en: 'Why not every month: move the slider. At which angles from the node is an eclipse possible?', hr: 'Zašto ne svaki mjesec: pomiči klizač. Pri kojim je kutovima od čvora pomrčina moguća?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'shadow', drag: null, lamp: 14, bx: 90, by: 0, cmp: false, phiS: -65, phiL: -22, node: 60, nu: 0.6 };
      const T = o => K.tr(o, lang), F = (v, d) => K.fmt(v, d, lang);

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'shadow', label: { en: 'Shadow and half-shadow', hr: 'Sjena i polusjena' } }, { value: 'solar', label: { en: 'Solar eclipse', hr: 'Pomrčina Sunca' } },
        { value: 'lunar', label: { en: 'Lunar eclipse', hr: 'Pomrčina Mjeseca' } }, { value: 'tilt', label: { en: 'Why not every month?', hr: 'Zašto ne svaki mjesec?' } }], value: 'shadow', onChange: setMode });
      const slLamp = C.slider({ label: { en: 'Lamp size', hr: 'Veličina lampe' }, min: 0, max: 40, step: 1, value: 14, unit: 'cm', digits: 0, onChange: v => { st.lamp = v; update(); } });
      const tgCmp = C.toggle({ label: { en: 'Compare with a point lamp', hr: 'Usporedi s točkastom lampom' }, value: false, onChange: v => { st.cmp = v; update(); } });
      const outUm = C.readout({ label: { en: 'Umbra (full shadow) on the screen', hr: 'Sjena na zastoru' }, unit: 'cm', digits: 1 });
      const outPen = C.readout({ label: { en: 'Whole shadow with the penumbra', hr: 'Cijela sjena s polusjenom' }, unit: 'cm', digits: 1 });
      const slPhi = C.slider({ label: { en: 'Moon position on its orbit', hr: 'Položaj Mjeseca na stazi' }, min: -180, max: 180, step: 1, value: -65, unit: '°', digits: 0,
        onChange: v => { st[st.mode === 'lunar' ? 'phiL' : 'phiS'] = v; update(); } });
      const slNode = C.slider({ label: { en: 'New moon: angle from the node', hr: 'Mlađak: kut od čvora' }, min: -180, max: 180, step: 1, value: 60, unit: '°', digits: 0, onChange: v => { st.node = v; update(); } });
      const outType = C.readout({ label: { en: 'Eclipse', hr: 'Pomrčina' } });
      const outCov = C.readout({ label: { en: 'Sun covered', hr: 'Prekriveno Sunca' }, unit: '%', digits: 0 });
      const outIn = C.readout({ label: { en: 'Moon inside the umbra', hr: 'Mjesec u Zemljinoj sjeni' }, unit: '%', digits: 0 });
      const outZ = C.readout({ label: { en: 'New moon above (+) / below (−) Earth\'s orbital plane', hr: 'Mlađak iznad (+) / ispod (−) ravnine Zemljine staze' }, unit: 'km', digits: 0 });
      const btnPlay = C.button({ label: PLAY, variant: 'primary', onClick: () => { if (st.mode !== 'shadow') L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { reset(); } });
      const note = C.note({ text: NOTES.shadow });
      C.note({ text: SAFETY });
      const GROUPS = { shadow: [slLamp, tgCmp, outUm, outPen], solar: [slPhi, outType, outCov, btnPlay], lunar: [slPhi, outType, outIn, btnPlay], tilt: [slNode, outType, outZ, btnPlay] };
      const ALL = [slLamp, tgCmp, outUm, outPen, slPhi, slNode, outType, outCov, outIn, outZ, btnPlay];

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function applyMode() { ALL.forEach(c => { fieldOf(c).style.display = GROUPS[st.mode].indexOf(c) >= 0 ? '' : 'none'; }); }
      function updatePlay() { btnPlay.setLabel(L.running ? PAUSE : PLAY); }
      function setMode(v) {
        L.stop(); st.mode = v; st.drag = null; applyMode();
        if (v === 'solar' || v === 'lunar') slPhi.set(Math.round(v === 'lunar' ? st.phiL : st.phiS));
        updatePlay(); update();
      }
      function reset() {
        L.stop();
        if (st.mode === 'shadow') { st.lamp = 14; st.bx = 90; st.by = 0; st.cmp = false; slLamp.set(14); tgCmp.set(false); }
        else if (st.mode === 'solar') { st.phiS = -65; slPhi.set(-65); }
        else if (st.mode === 'lunar') { st.phiL = -22; slPhi.set(-22); }
        else { st.node = 60; st.nu = 0.6; slNode.set(60); }
        st.drag = null; updatePlay(); update();
      }

      // ---------- geometry and physics ----------
      function shGeom() { // lamp–ball–screen scene, in cm
        const w = cv.w, h = cv.h, s = Math.min((w - 44) / 214, (h - 64) / 110), x0 = Math.round((w - 200 * s) / 2 - 3 * s), cy = Math.round(h * 0.55);
        return { w, h, s, x0, cy, X: c => x0 + c * s, Y: c => cy - c * s };
      }
      function tangents(P) { // the two lines from lamp point P that just touch the ball: touching point q, height ys on the screen
        const dx = st.bx - P.x, dy = st.by - P.y, d = Math.hypot(dx, dy), base = Math.atan2(dy, dx);
        const da = Math.asin(Math.min(0.99, BALL_R / d)), len = Math.sqrt(Math.max(0, d * d - BALL_R * BALL_R));
        return [-1, 1].map(sg => { const an = base + sg * da; return { q: { x: P.x + len * Math.cos(an), y: P.y + len * Math.sin(an) }, ys: P.y + Math.tan(an) * (SCREEN - P.x) }; });
      }
      function shadowCalc() { // top and bottom lamp points decide everything: [0] lower tangent, [1] upper tangent
        const top = tangents({ x: 0, y: st.lamp / 2 }), bot = tangents({ x: 0, y: -st.lamp / 2 }), mid = tangents({ x: 0, y: 0 });
        return { top, bot, mid, umbra: Math.max(0, top[1].ys - bot[0].ys), whole: bot[1].ys - top[0].ys, point: mid[1].ys - mid[0].ys };
      }
      function spaceGeom() { // top view: Sun on the left, Earth on the right, the Moon on its orbit around the Earth
        const w = cv.w, h = cv.h, cy = Math.round(h * 0.57), Rs = h * 0.2, Re = Math.min(30, h * 0.065), Rm = Re * 0.36;
        const S = { x: Rs * 0.7, y: cy }, E = { x: w - Math.max(74, w * 0.17), y: cy }, D = E.x - S.x;
        const k = Rm / (Rs - Rm), Ro = (Re + 0.8 * k * D) / (1 + 0.8 * k);   // orbit chosen so that the umbra tip just reaches the Earth
        const solar = st.mode === 'solar', phi = (solar ? st.phiS : st.phiL) * DEG;
        return { w, h, cy, Rs, Re, Rm, S, E, D, Ro, solar, M: { x: E.x + (solar ? -1 : 1) * Ro * Math.cos(phi), y: E.y + Ro * Math.sin(phi) } };
      }
      function cones(S, Rs, B, Rb) { // edge rays of the shadow of body B: umbra (outer tangents) and penumbra (crossed tangents)
        const dx = B.x - S.x, dy = B.y - S.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
        const mk = (sinA, side) => [-1, 1].map(sg => {
          const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA)), mx = sinA * ux - sg * cosA * uy, my = sinA * uy + sg * cosA * ux;
          const p = { x: S.x + Rs * mx, y: S.y + Rs * my }, q = { x: B.x + side * Rb * mx, y: B.y + side * Rb * my }, tl = Math.hypot(q.x - p.x, q.y - p.y) || 1;
          return { p, q, tx: (q.x - p.x) / tl, ty: (q.y - p.y) / tl };
        });
        const apex = d * Rb / (Rs - Rb);
        return { umbra: mk((Rs - Rb) / d, 1), pen: mk((Rs + Rb) / d, -1), tip: Math.sqrt(Math.max(0, apex * apex - Rb * Rb)) };
      }
      function overlap(r1, r2, d) { // area shared by two discs
        if (d >= r1 + r2) return 0;
        if (d <= Math.abs(r1 - r2)) return Math.PI * Math.pow(Math.min(r1, r2), 2);
        const a = Math.acos(K.clamp((d * d + r1 * r1 - r2 * r2) / (2 * d * r1), -1, 1)), b = Math.acos(K.clamp((d * d + r2 * r2 - r1 * r1) / (2 * d * r2), -1, 1));
        return r1 * r1 * (a - Math.sin(2 * a) / 2) + r2 * r2 * (b - Math.sin(2 * b) / 2);
      }
      function solarCalc(G) { // what the best-placed observer on Earth sees: angular sizes and separation of the Sun and the Moon
        const { S, E, M, Rs, Re, Rm } = G, d = Math.hypot(M.x - S.x, M.y - S.y), ux = (M.x - S.x) / d, uy = (M.y - S.y) / d;
        const ex = E.x - M.x, ey = E.y - M.y, along = ex * ux + ey * uy, lat = -ex * uy + ey * ux;
        let obs;
        if (Math.abs(lat) <= Re) { const a1 = along - Math.sqrt(Re * Re - lat * lat); obs = { x: M.x + ux * a1, y: M.y + uy * a1 }; }
        else { const sg = lat > 0 ? 1 : -1; obs = { x: E.x + uy * sg * Re, y: E.y - ux * sg * Re }; }
        if (along <= 0) return { type: 'none', cov: 0, sep: 9, as: 1, am: 1, obs };   // the Moon is behind the Earth
        const vsx = S.x - obs.x, vsy = S.y - obs.y, vmx = M.x - obs.x, vmy = M.y - obs.y;
        const as = Math.asin(Math.min(1, Rs / Math.hypot(vsx, vsy))), am = Math.asin(Math.min(1, Rm / Math.hypot(vmx, vmy)));
        const sep = Math.atan2(vsx * vmy - vsy * vmx, vsx * vmx + vsy * vmy), a = Math.abs(sep);
        return { type: a >= as + am ? 'none' : a <= am - as ? 'total' : 'partial', cov: overlap(as, am, a) / (Math.PI * as * as), sep, as, am, obs };
      }
      function lunarCalc(G) { // how much of the Moon is inside the Earth's umbra (fu) and penumbra (fp)
        const { S, E, M, Rs, Re, Rm, D } = G, ux = (E.x - S.x) / D, uy = (E.y - S.y) / D;
        const mx = M.x - E.x, my = M.y - E.y, along = mx * ux + my * uy, lat = -mx * uy + my * ux;
        if (along <= 0) return { type: 'none', fu: 0, fp: 0, lat, hu: 0, hp: 0 };
        const hu = Math.max(0, Re * (1 - along * (Rs - Re) / (D * Re))), hp = Re + along * (Rs + Re) / Math.sqrt(D * D - (Rs + Re) * (Rs + Re));
        const fu = K.clamp((hu + Rm - Math.abs(lat)) / (2 * Rm), 0, 1), fp = K.clamp((hp + Rm - Math.abs(lat)) / (2 * Rm), 0, 1);
        return { type: fu >= 0.999 ? 'total' : fu > 0.001 ? 'partial' : fp > 0.001 ? 'penumbral' : 'none', fu, fp, lat, hu, hp };
      }
      function tiltGeom() { // side view: Earth's orbital plane is the horizontal line, the Moon's orbit is tilted to it
        const w = cv.w, h = cv.h, cy = Math.round(h * 0.57), E = { x: Math.round(w * 0.56), y: cy };
        const Ro = Math.min(w * 0.36, h * 1.1), si = Math.sin(TILT_DRAW), ci = Math.cos(TILT_DRAW), Re = Ro * si / 4.8, Rm = Math.max(3, Re * 0.3);
        const Om = -st.node * DEG, cO = Math.cos(Om), sO = Math.sin(Om);
        const pos = nu => { const c = Math.cos(nu), s = Math.sin(nu); return { x: E.x - Ro * (c * cO - s * ci * sO), y: cy - Ro * s * si, depth: Ro * (c * sO + s * ci * cO) }; };
        const nuNew = Math.atan2(Math.sin(st.node * DEG), Math.cos(st.node * DEG) * ci), zn = Ro * si * Math.sin(nuNew);
        return { w, h, cy, E, Ro, Re, Rm, pos, nuNew, zn, possible: Math.abs(zn) < Re + Rm, zKm: Math.round(MOON_DIST * Math.sin(TILT) * Math.sin(nuNew) / 100) * 100 };
      }

      // ---------- readouts ----------
      function update() {
        if (st.mode === 'shadow') { const c = shadowCalc(); outUm.set(c.umbra); outPen.set(c.whole); }
        else if (st.mode === 'solar') { const r = solarCalc(spaceGeom()); outType.set(TYPES[r.type].short); outType.setColor(''); outCov.set(r.cov * 100); }
        else if (st.mode === 'lunar') { const r = lunarCalc(spaceGeom()); outType.set(TYPES[r.type].short); outType.setColor(''); outIn.set(r.fu * 100); }
        else { const G = tiltGeom(); outType.set(G.possible ? { en: 'possible', hr: 'moguća' } : { en: 'not this month', hr: 'ne ovaj mjesec' }); outType.setColor(G.possible ? theme.good : ''); outZ.set(G.zKm); }
        note.set(NOTES[st.mode]); draw();
      }

      // ---------- drawing helpers ----------
      function shade(g, pts, strong) { // "no light here": the sky colour plus black, on top of the sunlit wash
        g.save(); g.beginPath(); pts.forEach((p, i) => { if (i) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }); g.closePath();
        g.fillStyle = theme.sky; g.globalAlpha = strong ? 1 : 0.55; g.fill();
        g.fillStyle = '#000000'; g.globalAlpha = strong ? 0.5 : 0.16; g.fill(); g.restore();
      }
      function wash(g, x, y, w, h) { g.fillStyle = K.withAlpha(SUN, theme.isDark ? 0.13 : 0.2); g.fillRect(x, y, w, h); }
      function tag(g, str, x, y, align) { // label on a small card: readable over light and over shadow
        const font = 'bold 11px ' + theme.font;
        g.save(); g.font = font; const tw = g.measureText(str).width + 10, x0 = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        g.fillStyle = K.withAlpha(theme.surface, 0.88); K.roundRect(g, x0, y - 9, tw, 18, 5); g.fill(); g.restore();
        K.text(g, str, x0 + 5, y, { font, color: theme.fg, baseline: 'middle' });
      }
      function legend(g, h) { // the two kinds of shadow
        const y = h - 13, f = '11px ' + theme.font;
        shade(g, [{ x: 10, y: y - 6 }, { x: 26, y: y - 6 }, { x: 26, y: y + 6 }, { x: 10, y: y + 6 }], true);
        K.text(g, T({ en: 'umbra (full shadow)', hr: 'sjena' }), 31, y, { font: f, color: theme.fg, baseline: 'middle' });
        g.font = f; const x2 = 31 + g.measureText(T({ en: 'umbra (full shadow)', hr: 'sjena' })).width + 12;
        shade(g, [{ x: x2, y: y - 6 }, { x: x2 + 16, y: y - 6 }, { x: x2 + 16, y: y + 6 }, { x: x2, y: y + 6 }], false);
        g.strokeStyle = theme.line; g.lineWidth = 1; g.strokeRect(10, y - 6, 16, 12); g.strokeRect(x2, y - 6, 16, 12);
        K.text(g, T({ en: 'penumbra (half-shadow)', hr: 'polusjena' }), x2 + 21, y, { font: f, color: theme.fg, baseline: 'middle' });
      }
      function scaleNote(g, w, h) { if (w >= 520) K.text(g, T({ en: 'not to scale', hr: 'nije u mjerilu' }), w - 10, h - 13, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' }); }
      function header(g, title, sub, room) { // room: is there space for the second line (no inset in the way)?
        const small = cv.w < 520;
        K.text(g, title, 10, 16, { font: 'bold ' + (small ? 13 : 15) + 'px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        if (sub && (room || !small)) K.text(g, sub, 10, 35, { font: '11px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function body(g, P, R, color, S) { // a ball lit from S: the far half is in its own shade
        const an = Math.atan2(P.y - S.y, P.x - S.x);
        g.save(); g.fillStyle = color; g.beginPath(); g.arc(P.x, P.y, R, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.arc(P.x, P.y, R, an - Math.PI / 2, an + Math.PI / 2); g.closePath(); g.fill();
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(P.x, P.y, R, 0, Math.PI * 2); g.stroke(); g.restore();
      }
      function drawSun(g, S, Rs) {
        const gr = g.createRadialGradient(S.x, S.y, Rs * 0.9, S.x, S.y, Rs * 1.5);
        gr.addColorStop(0, K.withAlpha(SUN, 0.55)); gr.addColorStop(1, K.withAlpha(SUN, 0));
        g.save(); g.fillStyle = gr; g.beginPath(); g.arc(S.x, S.y, Rs * 1.5, 0, Math.PI * 2); g.fill();
        g.fillStyle = SUN; g.strokeStyle = SUN_EDGE; g.lineWidth = 2; g.beginPath(); g.arc(S.x, S.y, Rs, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
      }
      function drawCones(g, cn, len, edges) { // penumbra, then umbra; optional thin construction rays from the Sun's rim
        const far = (q, l) => ({ x: q.q.x + q.tx * l, y: q.q.y + q.ty * l }), u = cn.umbra, p = cn.pen;
        shade(g, [p[0].q, far(p[0], len), far(p[1], len), p[1].q], false);
        if (cn.tip <= len) shade(g, [u[0].q, far(u[0], cn.tip), u[1].q], true); else shade(g, [u[0].q, far(u[0], len), far(u[1], len), u[1].q], true);
        if (!edges) return;
        g.save(); g.strokeStyle = K.withAlpha(theme.fg, 0.4); g.lineWidth = 1; g.beginPath();
        u.concat(p).forEach(q => { g.moveTo(q.p.x, q.p.y); g.lineTo(q.q.x, q.q.y); }); g.stroke(); g.restore();
      }
      function insetBox(g, w, h, title) { // card in the top right corner; returns the picture area
        const bw = Math.round(K.clamp(h * 0.27, 108, 128)), x = w - bw - 8, y = 8;
        g.save(); g.fillStyle = theme.surface; K.roundRect(g, x, y, bw, bw, 8); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1.5; g.stroke(); g.restore();
        K.text(g, title, x + bw / 2, y + 12, { font: 'bold 11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
        return { x: x + 5, y: y + 22, w: bw - 10, h: bw - 27 };
      }

      // ---------- (a) lamp, ball, screen ----------
      function drawShadow(g) {
        const G = shGeom(), c = shadowCalc(), { w, h, X, Y } = G, xs = X(SCREEN), xl = X(0), half = st.lamp / 2;
        const pt = p => ({ x: X(p.x), y: Y(p.y) }), sp = y => ({ x: xs, y: Y(y) });
        wash(g, xl, 0, xs - xl, h);
        g.save(); g.beginPath(); g.rect(xl, 0, xs - xl, h); g.clip();
        shade(g, [pt(c.top[0].q), sp(c.top[0].ys), sp(c.bot[1].ys), pt(c.bot[1].q)], false);
        if (c.top[1].ys >= c.bot[0].ys) shade(g, [pt(c.bot[0].q), sp(c.bot[0].ys), sp(c.top[1].ys), pt(c.top[1].q)], true);
        else { // the umbra ends in a point before the screen
          const a = c.bot[0].q, b = c.top[1].q, k1 = (a.y + half) / a.x, k2 = (b.y - half) / b.x, xa = st.lamp / (k1 - k2);
          shade(g, [pt(a), pt({ x: xa, y: -half + k1 * xa }), pt(b)], true);
        }
        // edge rays from the top and the bottom of the lamp
        g.strokeStyle = theme.c4; g.lineWidth = 1.5; g.beginPath();
        [[half, c.top], [-half, c.bot]].forEach(([y0, tn]) => tn.forEach(q => { g.moveTo(xl, Y(y0)); g.lineTo(xs, Y(q.ys)); })); g.stroke();
        if (st.cmp) { g.setLineDash([6, 5]); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); c.mid.forEach(q => { g.moveTo(xl, Y(0)); g.lineTo(xs, Y(q.ys)); }); g.stroke(); }
        g.restore();
        // screen with the pattern: bright, half-shadow (gradual), full shadow
        const p0 = c.top[0].ys, p1 = Math.min(c.bot[0].ys, c.top[1].ys), p2 = Math.max(c.bot[0].ys, c.top[1].ys), p3 = c.bot[1].ys, sw = 14, sTop = 58, sH = h - 30 - sTop;
        const level = c.umbra > 0 ? 1 : (p1 - p0) / Math.max(1e-6, p2 - p0), tot = Math.max(1, Y(p0) - Y(p3));
        g.save(); g.beginPath(); g.rect(xs, sTop, sw, sH); g.clip();
        g.fillStyle = theme.surface; g.fillRect(xs, sTop, sw, sH); g.fillStyle = K.withAlpha(SUN, 0.55); g.fillRect(xs, sTop, sw, sH);
        const gr = g.createLinearGradient(0, Y(p3), 0, Y(p0)), dark = 'rgba(0,0,0,' + (0.82 * level).toFixed(3) + ')';
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(K.clamp((Y(p2) - Y(p3)) / tot, 0, 1), dark); gr.addColorStop(K.clamp((Y(p1) - Y(p3)) / tot, 0, 1), dark); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(xs, Y(p3), sw, tot); g.restore();
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.strokeRect(xs, sTop, sw, sH);
        K.text(g, T({ en: 'screen', hr: 'zastor' }), xs + sw, sTop - 4, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
        if (st.cmp) { g.strokeStyle = theme.fg; g.lineWidth = 2.5; g.beginPath(); g.moveTo(xs + sw + 5, Y(c.mid[1].ys)); g.lineTo(xs + sw + 5, Y(c.mid[0].ys)); g.stroke(); }
        // labels of the regions next to the screen
        if (c.umbra > 0) tag(g, T({ en: 'umbra', hr: 'sjena' }) + ' ' + F(c.umbra, 1) + ' cm', xs - 6, K.clamp(Y((p1 + p2) / 2), sTop + 10, h - 40), 'right');
        if ((p3 - p2) * G.s > 9) tag(g, T({ en: 'penumbra', hr: 'polusjena' }), xs - 6, K.clamp(Y((p2 + p3) / 2) - (c.umbra > 0 && (p3 - p1) * G.s < 44 ? 12 : 0), sTop + 10, h - 40), 'right');
        // lamp and ball
        g.save(); g.fillStyle = SUN; g.strokeStyle = theme.fg; g.lineWidth = 1.5;
        if (st.lamp < 1) { g.beginPath(); g.arc(xl, Y(0), 6, 0, Math.PI * 2); g.fill(); g.stroke(); }
        else { K.roundRect(g, xl - 6, Y(half), 12, st.lamp * G.s, 6); g.fill(); g.stroke(); }
        g.fillStyle = theme.c7; g.beginPath(); g.arc(X(st.bx), Y(st.by), BALL_R * G.s, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.3)'; g.beginPath(); g.arc(X(st.bx) - BALL_R * G.s * 0.35, Y(st.by) - BALL_R * G.s * 0.35, BALL_R * G.s * 0.3, 0, Math.PI * 2); g.fill(); g.restore();
        K.text(g, T(st.lamp < 1 ? { en: 'point lamp', hr: 'točkasta lampa' } : { en: 'lamp', hr: 'lampa' }) , Math.max(xl, 34), Y(-half) + 10, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        K.text(g, T({ en: 'ball', hr: 'lopta' }), X(st.bx), Y(st.by) - BALL_R * G.s - 5, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
        header(g, T({ en: 'Drag the ball', hr: 'Povuci loptu' }), st.cmp ? T({ en: 'Point lamp (dashed): sharp shadow of ', hr: 'Točkasta lampa (crtkano): oštra sjena od ' }) + F(c.point, 1) + ' cm' : '', true);
        legend(g, h);
      }

      // ---------- (b) and (c) Sun, Earth, Moon from above ----------
      function drawSpace(g) {
        const G = spaceGeom(), { w, h, S, E, M, Rs, Re, Rm, Ro, solar } = G, f11 = '11px ' + theme.font;
        const sc = solar ? solarCalc(G) : null, lc = solar ? null : lunarCalc(G);
        wash(g, 0, 0, w, h);
        drawCones(g, cones(S, Rs, E, Re), w, !solar);
        drawCones(g, cones(S, Rs, M, Rm), w, solar);
        g.save(); g.setLineDash([4, 5]); g.strokeStyle = theme.muted; g.lineWidth = 1.2; g.beginPath(); g.arc(E.x, E.y, Ro, 0, Math.PI * 2); g.stroke(); g.restore();
        drawSun(g, S, Rs);
        body(g, E, Re, theme.c1, S); body(g, M, Rm, MOON, S);
        if (lc && lc.fp > 0) { // inside the Earth's shadow the Moon dims and turns copper-red
          g.save(); g.beginPath(); g.arc(M.x, M.y, Rm, 0, Math.PI * 2); g.clip();
          g.fillStyle = 'rgba(0,0,0,' + (0.3 * lc.fp).toFixed(3) + ')'; g.fillRect(M.x - Rm, M.y - Rm, 2 * Rm, 2 * Rm);
          g.globalAlpha = lc.fu; g.fillStyle = COPPER; g.fillRect(M.x - Rm, M.y - Rm, 2 * Rm, 2 * Rm); g.restore();
        }
        if (sc && sc.type !== 'none') { g.fillStyle = theme.fg; g.beginPath(); g.arc(sc.obs.x, sc.obs.y, 2.5, 0, Math.PI * 2); g.fill(); }
        K.text(g, T({ en: 'Sun', hr: 'Sunce' }), Math.max(S.x, 26), S.y + Rs + 8, { font: f11, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(g, T({ en: 'Earth', hr: 'Zemlja' }), E.x, E.y + Ro + Rm + 6, { font: f11, color: theme.fg, align: 'center', baseline: 'top' });
        K.text(g, T({ en: 'Moon', hr: 'Mjesec' }), M.x, M.y - Rm - 4, { font: f11, color: theme.fg, align: 'center', baseline: 'bottom' });
        // what an observer sees
        const B = insetBox(g, w, h, T(solar ? { en: 'Seen from Earth', hr: 'Pogled sa Zemlje' } : { en: 'The Moon in the sky', hr: 'Mjesec na nebu' }));
        const mx = B.x + B.w / 2, my = B.y + B.h / 2, r = B.h * 0.27;
        g.save(); K.roundRect(g, B.x, B.y, B.w, B.h, 5); g.clip();
        if (solar) {
          const tot = sc.type === 'total';
          g.fillStyle = DAY; g.fillRect(B.x, B.y, B.w, B.h); g.fillStyle = NIGHT; g.globalAlpha = tot ? 0.95 : sc.cov * 0.6; g.fillRect(B.x, B.y, B.w, B.h); g.globalAlpha = 1;
          if (tot) { const cr = g.createRadialGradient(mx, my, r, mx, my, r * 1.9); cr.addColorStop(0, 'rgba(255,255,255,0.9)'); cr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = cr; g.beginPath(); g.arc(mx, my, r * 1.9, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = SUN; g.beginPath(); g.arc(mx, my, r, 0, Math.PI * 2); g.fill();
          if (sc.sep < 8) { g.fillStyle = NEW_MOON; g.beginPath(); g.arc(mx + r * sc.sep / sc.as, my, r * sc.am / sc.as, 0, Math.PI * 2); g.fill(); }
        } else {
          const k = r / Rm;
          g.fillStyle = NIGHT; g.fillRect(B.x, B.y, B.w, B.h);
          g.fillStyle = MOON; g.beginPath(); g.arc(mx, my, r, 0, Math.PI * 2); g.fill(); g.clip();
          if (lc.fp > 0) {
            g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.arc(mx - lc.lat * k, my, lc.hp * k, 0, Math.PI * 2); g.fill();
            g.fillStyle = COPPER; g.beginPath(); g.arc(mx - lc.lat * k, my, lc.hu * k, 0, Math.PI * 2); g.fill();
            g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.arc(mx - lc.lat * k, my, lc.hu * k, 0, Math.PI * 2); g.fill();
          }
        }
        g.restore();
        header(g, T(TYPES[(sc || lc).type][solar ? 'solar' : 'lunar']), T({ en: 'Drag the Moon along its orbit, or press Play.', hr: 'Povuci Mjesec po stazi ili pritisni Pokreni.' }));
        legend(g, h); scaleNote(g, w, h);
      }

      // ---------- (d) the tilted orbit, seen from the side ----------
      function drawTilt(g) {
        const G = tiltGeom(), { w, h, cy, E, Ro, Re, Rm, pos, nuNew, zn } = G, f11 = '11px ' + theme.font, Sp = { x: -1000, y: cy };
        const nw = pos(nuNew), fl = pos(nuNew + Math.PI), hit = G.possible;
        wash(g, 0, 0, w, h);
        // sunlight comes from the left; shadows are straight bands to the right
        drawSun(g, { x: -h * 0.16, y: cy }, h * 0.26);
        for (let i = -1; i <= 1; i++) K.arrow(g, h * 0.13, cy + i * h * 0.16, h * 0.13 + 30, cy + i * h * 0.16, { color: theme.c4, width: 2.5, head: 8 });
        shade(g, [{ x: E.x, y: cy - Re }, { x: w, y: cy - Re }, { x: w, y: cy + Re }, { x: E.x, y: cy + Re }], true);
        const xEnd = hit ? E.x : Math.min(w, E.x + Ro * 0.6);
        shade(g, [{ x: nw.x, y: nw.y - Rm }, { x: xEnd, y: nw.y - Rm }, { x: xEnd, y: nw.y + Rm }, { x: nw.x, y: nw.y + Rm }], true);
        // Earth's orbital plane and the Moon's tilted orbit (far half dashed)
        g.save(); g.setLineDash([7, 5]); g.strokeStyle = theme.muted; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, cy); g.lineTo(w, cy); g.stroke(); g.restore();
        if (w >= 520) K.text(g, T({ en: 'plane of the Earth\'s orbit', hr: 'ravnina Zemljine staze' }), w - 8, cy + Re + 5, { font: f11, color: theme.muted, align: 'right', baseline: 'top' });
        for (let half = 0; half < 2; half++) {
          g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1.6; if (half) { g.setLineDash([3, 4]); g.globalAlpha = 0.55; }
          g.beginPath(); let pen = false;
          for (let i = 0; i <= 96; i++) { const q = pos(i / 96 * Math.PI * 2); if ((q.depth > 0) === !!half) { if (pen) g.lineTo(q.x, q.y); else g.moveTo(q.x, q.y); pen = true; } else pen = false; }
          g.stroke(); g.restore();
        }
        [0, Math.PI].forEach(nu => { const q = pos(nu); g.save(); g.translate(q.x, q.y); g.rotate(Math.PI / 4); g.fillStyle = theme.c7; g.strokeStyle = theme.fg; g.lineWidth = 1; g.fillRect(-4, -4, 8, 8); g.strokeRect(-4, -4, 8, 8); g.restore(); });
        const nd = pos(0), ndx = Math.abs(nd.x - E.x) > 40 ? nd.x : pos(Math.PI).x;
        if (Math.abs(ndx - E.x) > 40) K.text(g, T({ en: 'node', hr: 'čvor' }), ndx, cy + 9, { font: f11, color: theme.fg, align: 'center', baseline: 'top' });
        // the travelling Moon (behind or in front of the Earth), new moon and full moon places
        const mv = pos(st.nu);
        if (mv.depth > 0) body(g, mv, Rm, MOON, Sp);
        body(g, E, Re, theme.c1, Sp);
        if (mv.depth <= 0) body(g, mv, Rm, MOON, Sp);
        [[nw, { en: 'new moon', hr: 'mlađak' }, NEW_MOON], [fl, { en: 'full moon', hr: 'uštap' }, hit ? COPPER : MOON]].forEach(([q, lbl, col]) => {
          g.save(); g.fillStyle = col; g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.setLineDash([3, 2]); g.beginPath(); g.arc(q.x, q.y, Rm + 1.5, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
          const up = q.y <= cy;
          K.text(g, T(lbl), q.x, q.y + (up ? -Rm - 6 : Rm + 6), { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: up ? 'bottom' : 'top' });
        });
        K.text(g, T({ en: 'Earth', hr: 'Zemlja' }), E.x, cy + Re + 5, { font: f11, color: theme.fg, align: 'center', baseline: 'top' });
        const where = zn > 0 ? { en: 'above', hr: 'iznad' } : { en: 'below', hr: 'ispod' };
        header(g, T(hit ? { en: 'Eclipse possible', hr: 'Pomrčina moguća' } : { en: 'No eclipse this month', hr: 'Ovaj mjesec nema pomrčine' }),
          hit ? T({ en: 'New and full moon are near a node: the shadows hit.', hr: 'Mlađak i uštap su blizu čvora: sjene pogađaju.' })
            : T({ en: 'The Moon\'s shadow passes ', hr: 'Mjesečeva sjena prolazi ' }) + T(where) + T({ en: ' the Earth; the full moon misses the Earth\'s shadow.', hr: ' Zemlje; uštap promašuje Zemljinu sjenu.' }), w >= 440);
        g.fillStyle = hit ? theme.good : theme.muted; g.beginPath(); g.arc(w - 18, 16, 7, 0, Math.PI * 2); g.fill();
        K.text(g, T({ en: 'Moon\'s orbit: tilt ≈ 5° (drawn steeper)', hr: 'Mjesečeva staza: nagib ≈ 5° (nacrtan strmije)' }), 10, h - 13, { font: f11, color: theme.muted, baseline: 'middle' });
        scaleNote(g, w, h);
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (st.mode === 'shadow') drawShadow(g); else if (st.mode === 'tilt') drawTilt(g); else drawSpace(g);
      }

      // ---------- animation: the Moon moves along its orbit ----------
      function step(dt) {
        if (st.mode === 'tilt') st.nu = (st.nu + dt * Math.PI / 6) % (Math.PI * 2);
        else if (st.mode !== 'shadow') {
          const key = st.mode === 'solar' ? 'phiS' : 'phiL';
          let v = st[key] + dt * 15 * (0.2 + 0.8 * Math.min(1, Math.abs(st[key]) / 45));   // slower near the line-up
          if (v > 180) v -= 360;
          st[key] = v; slPhi.set(Math.round(v));
        }
      }
      const L = K.loop(dt => { step(dt); update(); });

      // ---------- pointer ----------
      function hitTest(p) {
        if (st.mode === 'shadow') { const G = shGeom(); return Math.hypot(p.x - G.X(st.bx), p.y - G.Y(st.by)) < BALL_R * G.s + 14 ? 'ball' : null; }
        if (st.mode === 'tilt') return null;
        const G = spaceGeom();
        return (Math.hypot(p.x - G.M.x, p.y - G.M.y) < 26 || Math.abs(Math.hypot(p.x - G.E.x, p.y - G.E.y) - G.Ro) < 16) ? 'moon' : null;
      }
      function onDown(ev) {
        st.drag = hitTest(cv.pointer(ev));
        if (!st.drag) return;
        try { if (ev.pointerId !== undefined) cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        ev.preventDefault(); onMove(ev);
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (!st.drag) { cv.canvas.style.cursor = hitTest(p) ? 'grab' : 'default'; return; }
        ev.preventDefault();
        if (st.drag === 'ball') {
          const G = shGeom(); st.bx = K.clamp((p.x - G.x0) / G.s, 30, 175); st.by = K.clamp((G.cy - p.y) / G.s, -30, 30); update();
        } else if (st.drag === 'moon') {
          const G = spaceGeom(), an = Math.atan2(p.y - G.E.y, (G.solar ? -1 : 1) * (p.x - G.E.x)) / DEG;
          slPhi.set(Math.round(an), true);
        }
      }
      function onUp() { st.drag = null; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      cv.onResize(draw);
      applyMode(); update();

      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); update(); },
        setTheme(t) { theme = t; update(); },
        reset
      };
    }
  });
})();
