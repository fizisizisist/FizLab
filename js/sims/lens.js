/* FizLab sim: Lenses and mirrors — (a) converging lens: three principal rays, real / virtual image, movable screen,
   (b) diverging lens, (c) concave / convex mirror, (d) the eye with short and long sight and correcting glasses,
   (e) pinhole camera. Static scenes: drag the object (or the screen) to explore. */
(function () {
  'use strict';
  const K = window.SimKit;
  const DIST = [10, 12, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 600, Infinity]; // eye: object distances (cm)
  const ACC = 4;      // D: how much the model eye lens can strengthen itself (normal near point = 25 cm)
  const DEFECT = 2;   // D: error of the short- / long-sighted model eye
  const P0 = 60;      // D: relaxed normal eye (retina about 1.7 cm behind the lens)
  const APER = 7;     // cm: half-height of the bench lens, sets the blur on the screen
  const OBJ_H = 20;   // cm: object height in the pinhole camera
  const NOTES = {
    conv: { en: 'Lens equation: 1/f = 1/a + 1/b, magnification m = b/a. Object farther than the focus F: real, inverted image that can be caught on a screen. Object between F and the lens: virtual, upright, magnified image (a magnifying glass); b is then negative.',
      hr: 'Jednadžba leće: 1/f = 1/a + 1/b, uvećanje m = b/a. Predmet dalje od žarišta F: stvarna, obrnuta slika koja se može uhvatiti na zastoru. Predmet između F i leće: prividna, uspravna, uvećana slika (povećalo); b je tada negativan.' },
    div: { en: 'A diverging lens spreads the rays, so they only seem to come from a point in front of the lens: the image is always virtual, upright and reduced (f and b are negative). It cannot be caught on a screen.',
      hr: 'Rastresna leća širi zrake pa one samo prividno dolaze iz točke ispred leće: slika je uvijek prividna, uspravna i umanjena (f i b su negativni). Ne može se uhvatiti na zastoru.' },
    mirror: { en: 'Curved mirrors obey the same equation, 1/f = 1/a + 1/b; F lies halfway between the mirror and its centre C. A concave mirror acts like a converging lens (make-up mirror, telescope); a convex mirror always gives a virtual, upright, reduced image (car mirror).',
      hr: 'Za zakrivljena zrcala vrijedi ista jednadžba, 1/f = 1/a + 1/b; žarište F je na pola puta između zrcala i središta C. Udubljeno zrcalo djeluje kao sabirna leća (kozmetičko zrcalo, teleskop); ispupčeno uvijek daje prividnu, uspravnu, umanjenu sliku (retrovizor).' },
    eye: { en: 'Short-sighted eye: the image of a far object forms in front of the retina; a diverging lens (minus dioptres) corrects it. Long-sighted eye: the image of a near object would form behind the retina; a converging lens (plus dioptres) corrects it. Strength in dioptres = 1 / f in metres.',
      hr: 'Kratkovidno oko: slika dalekog predmeta nastaje ispred mrežnice; ispravlja se rastresnom lećom (minus dioptrije). Dalekovidno oko: slika bliskog predmeta nastala bi iza mrežnice; ispravlja se sabirnom lećom (plus dioptrije). Jakost leće u dioptrijama = 1 / f u metrima.' },
    pinhole: { en: 'Light travels in straight lines, so the picture is upside down. Similar triangles: image height = object height · b / a. A bigger hole lets in more light (brighter picture), but every point becomes a spot (blurrier picture).',
      hr: 'Svjetlost putuje pravocrtno, zato je slika obrnuta. Slični trokuti: visina slike = visina predmeta · b / a. Veći otvor propušta više svjetlosti (svjetlija slika), ali svaka točka postaje mrlja (mutnija slika).' }
  };
  const HINTS = {
    bench: { en: 'Drag the object; drag its tip to change the height.', hr: 'Povuci predmet; povuci vrh za promjenu visine.' },
    eye: { en: 'Drag the candle nearer or farther.', hr: 'Povuci svijeću bliže ili dalje.' },
    pinhole: { en: 'Drag the object or the screen.', hr: 'Povuci predmet ili zastor.' }
  };

  window.Sims.register({
    id: 'lens',
    title: { en: 'Lenses and Mirrors', hr: 'Leće i zrcala' },
    summary: {
      en: 'Build images with lenses and curved mirrors, see how glasses correct short and long sight, and try a pinhole camera.',
      hr: 'Gradi slike lećama i zakrivljenim zrcalima, pogledaj kako naočale ispravljaju kratkovidnost i dalekovidnost i isprobaj tamnu komoru.'
    },
    tasks: [
      { en: 'Converging lens: drag the object from far away towards the lens. At which distance does the image stop being real and inverted and become virtual and upright?', hr: 'Sabirna leća: povlači predmet izdaleka prema leći. Na kojoj udaljenosti slika prestaje biti stvarna i obrnuta i postaje prividna i uspravna?' },
      { en: 'Set a = 2f (for example f = 15 cm, a = 30 cm). How big is the image? Switch on the screen and find the place where the picture is sharp.', hr: 'Postavi a = 2f (npr. f = 15 cm, a = 30 cm). Kolika je slika? Uključi zastor i nađi mjesto na kojem je slika oštra.' },
      { en: 'The eye: choose the short-sighted eye and a far object. Which glasses, and how many dioptres, make the picture sharp?', hr: 'Oko: odaberi kratkovidno oko i daleki predmet. Koje naočale i koliko dioptrija daju oštru sliku?' },
      { en: 'Pinhole camera: make the hole bigger. What happens to the brightness of the picture, and what to its sharpness?', hr: 'Tamna komora: povećaj otvor. Što se događa sa svjetlinom slike, a što s njezinom oštrinom?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);
      const st = { mode: 'conv', drag: null, a: 40, ho: 6, f: 15, screen: false, sp: 24, mir: 'concave',
        eyeD: 9, vision: 'normal', glasses: 'none', diop: 2, po: 50, ps: 20, hole: 2 };
      const T = o => K.tr(o, lang), F = (v, d) => K.fmt(v, d, lang);

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'conv', label: { en: 'Converging lens', hr: 'Sabirna leća' } }, { value: 'div', label: { en: 'Diverging lens', hr: 'Rastresna leća' } },
        { value: 'mirror', label: { en: 'Curved mirror', hr: 'Zakrivljeno zrcalo' } }, { value: 'eye', label: { en: 'The eye', hr: 'Oko' } },
        { value: 'pinhole', label: { en: 'Pinhole camera', hr: 'Tamna komora' } }], value: 'conv', onChange: setMode });
      const selMir = C.select({ label: { en: 'Mirror', hr: 'Zrcalo' }, options: [
        { value: 'concave', label: { en: 'Concave (hollow)', hr: 'Udubljeno (konkavno)' } }, { value: 'convex', label: { en: 'Convex (bulging)', hr: 'Ispupčeno (konveksno)' } }], value: 'concave',
        onChange: v => { st.mir = v; update(); } });
      const slA = C.slider({ label: { en: 'Object distance a', hr: 'Udaljenost predmeta a' }, min: 2, max: 80, step: 0.5, value: 40, unit: 'cm', digits: 1, onChange: v => { st.a = v; update(); } });
      const slF = C.slider({ label: { en: 'Focal length f', hr: 'Žarišna daljina f' }, min: 5, max: 30, step: 1, value: 15, unit: 'cm', digits: 0, onChange: v => { st.f = v; update(); } });
      const tgScr = C.toggle({ label: { en: 'Screen', hr: 'Zastor' }, value: false, onChange: v => { st.screen = v; slScr.setDisabled(!v); update(); } });
      const slScr = C.slider({ label: { en: 'Screen distance from the lens', hr: 'Udaljenost zastora od leće' }, min: 2, max: 80, step: 0.5, value: 24, unit: 'cm', digits: 1, onChange: v => { st.sp = v; update(); } });
      const outB = C.readout({ label: { en: 'Image distance b', hr: 'Udaljenost slike b' }, unit: 'cm', digits: 1 });
      const outM = C.readout({ label: { en: 'Magnification m', hr: 'Uvećanje m' }, unit: '×', digits: 2 });
      const outImg = C.readout({ label: { en: 'Image', hr: 'Slika' } });
      const slD = C.slider({ label: { en: 'Object distance', hr: 'Udaljenost predmeta' }, min: 0, max: DIST.length - 1, step: 1, value: 9,
        format: (v, l) => distLabel(DIST[Math.round(v)], l), onChange: v => { st.eyeD = K.clamp(Math.round(v), 0, DIST.length - 1); update(); } });
      const selVis = C.select({ label: { en: 'Eye', hr: 'Oko' }, options: [
        { value: 'normal', label: { en: 'Normal sight', hr: 'Normalan vid' } }, { value: 'short', label: { en: 'Short-sighted', hr: 'Kratkovidno' } },
        { value: 'long', label: { en: 'Long-sighted', hr: 'Dalekovidno' } }], value: 'normal', onChange: v => { st.vision = v; update(); } });
      const selGl = C.select({ label: { en: 'Glasses', hr: 'Naočale' }, options: [
        { value: 'none', label: { en: 'None', hr: 'Bez naočala' } }, { value: 'div', label: { en: 'Diverging lens (−)', hr: 'Rastresna leća (−)' } },
        { value: 'conv', label: { en: 'Converging lens (+)', hr: 'Sabirna leća (+)' } }], value: 'none', onChange: v => { st.glasses = v; syncGlasses(); update(); } });
      const slDi = C.slider({ label: { en: 'Strength of the glasses', hr: 'Jakost naočala' }, min: 0.5, max: 5, step: 0.5, value: 2,
        format: (v, l) => (st.glasses === 'div' ? '−' : st.glasses === 'conv' ? '+' : '') + K.fmt(v, 1, l) + (l === 'hr' ? ' dpt' : ' D'), onChange: v => { st.diop = v; update(); } });
      const outFocus = C.readout({ label: { en: 'Sharp image forms', hr: 'Oštra slika nastaje' } });
      const outSee = C.readout({ label: { en: 'The eye sees', hr: 'Oko vidi' } });
      const slPO = C.slider({ label: { en: 'Object to hole a', hr: 'Predmet do otvora a' }, min: 20, max: 100, step: 1, value: 50, unit: 'cm', digits: 0, onChange: v => { st.po = v; update(); } });
      const slPS = C.slider({ label: { en: 'Hole to screen b', hr: 'Otvor do zastora b' }, min: 5, max: 40, step: 1, value: 20, unit: 'cm', digits: 0, onChange: v => { st.ps = v; update(); } });
      const slHole = C.slider({ label: { en: 'Hole diameter', hr: 'Promjer otvora' }, min: 0.5, max: 10, step: 0.5, value: 2, unit: 'mm', digits: 1, onChange: v => { st.hole = v; update(); } });
      const outPH = C.readout({ label: { en: 'Image height', hr: 'Visina slike' }, unit: 'cm', digits: 1 });
      const outSpot = C.readout({ label: { en: 'Blur spot of one point', hr: 'Mrlja jedne točke' }, unit: 'mm', digits: 1 });
      const outBr = C.readout({ label: { en: 'Brightness (start = 1)', hr: 'Svjetlina (početak = 1)' }, unit: '×', digits: 2 });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { resetMode(); } });
      const note = C.note({ text: NOTES.conv });
      const lensCtl = [slA, slF, tgScr, slScr, outB, outM, outImg];
      const GROUPS = { conv: lensCtl, div: lensCtl, mirror: [selMir, slA, slF, outB, outM, outImg],
        eye: [slD, selVis, selGl, slDi, outFocus, outSee], pinhole: [slPO, slPS, slHole, outPH, outSpot, outBr] };
      const ALL = [selMir, slA, slF, tgScr, slScr, outB, outM, outImg, slD, selVis, selGl, slDi, outFocus, outSee, slPO, slPS, slHole, outPH, outSpot, outBr];

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function applyMode() { ALL.forEach(c => { fieldOf(c).style.display = GROUPS[st.mode].indexOf(c) >= 0 ? '' : 'none'; }); }
      function syncGlasses() { slDi.setDisabled(st.glasses === 'none'); slDi.set(st.diop); }
      function setMode(v) { st.mode = v; st.drag = null; applyMode(); update(); }
      function resetMode() {
        if (st.mode === 'eye') {
          st.eyeD = 9; st.vision = 'normal'; st.glasses = 'none'; st.diop = 2;
          slD.set(9); selVis.set('normal'); selGl.set('none'); syncGlasses();
        } else if (st.mode === 'pinhole') {
          st.po = 50; st.ps = 20; st.hole = 2; slPO.set(50); slPS.set(20); slHole.set(2);
        } else {
          st.a = 40; st.ho = 6; st.f = 15; st.screen = false; st.sp = 24; st.mir = 'concave';
          slA.set(40); slF.set(15); tgScr.set(false); slScr.set(24); slScr.setDisabled(true); selMir.set('concave');
        }
        st.drag = null; update();
      }
      function distLabel(d, l) {
        if (!isFinite(d)) return K.tr({ en: 'far away', hr: 'daleko' }, l);
        return d < 100 ? K.fmt(d, 0, l) + ' cm' : K.fmt(d / 100, 1, l) + ' m';
      }

      // ---------- physics ----------
      const isBench = () => st.mode === 'conv' || st.mode === 'div' || st.mode === 'mirror';
      function optics() { // lens / mirror equation with a signed f; b > 0 means a real image
        const diverging = st.mode === 'div' || (st.mode === 'mirror' && st.mir === 'convex');
        const f = diverging ? -st.f : st.f, a = st.a, inf = Math.abs(a - f) < 1e-6;
        const b = inf ? Infinity : a * f / (a - f);
        return { f, a, b, inf, diverging, real: !inf && b > 0, m: inf ? Infinity : Math.abs(b) / a, hi: inf ? Infinity : -st.ho * b / a };
      }
      function describe(o) {
        if (o.inf) return { en: 'none: the rays leave parallel', hr: 'nema je: zrake izlaze usporedno' };
        const kind = o.real ? { en: 'real', hr: 'stvarna' } : { en: 'virtual', hr: 'prividna' };
        const ori = o.real ? { en: 'inverted', hr: 'obrnuta' } : { en: 'upright', hr: 'uspravna' };
        const size = Math.abs(o.m - 1) < 0.005 ? { en: 'same size', hr: 'jednako velika' } : o.m > 1 ? { en: 'magnified', hr: 'uvećana' } : { en: 'reduced', hr: 'umanjena' };
        return { en: kind.en + ', ' + ori.en + ', ' + size.en, hr: kind.hr + ', ' + ori.hr + ', ' + size.hr };
      }
      function screenInfo(o) { // what a screen at st.sp shows: picture height and blur of one point (cm)
        if (o.inf || !o.real) return null;
        const blur = APER * Math.abs(st.sp - o.b) / o.b;
        return { hgt: st.ho * st.sp / o.a, blur, sharp: blur < 0.25 };
      }
      function eyeCalc() { // powers in dioptres; thin lenses in contact simply add
        const d = DIST[st.eyeD], V = isFinite(d) ? 100 / d : 0;
        const E = st.vision === 'short' ? DEFECT : st.vision === 'long' ? -DEFECT : 0;
        const Gl = st.glasses === 'div' ? -st.diop : st.glasses === 'conv' ? st.diop : 0;
        const acc = K.clamp(V - E - Gl, 0, ACC);   // the eye lens adjusts as far as it can
        const dz = E + Gl + acc - V;               // > 0: too strong, the image forms in front of the retina
        const nearP = E + Gl + ACC, farP = E + Gl;
        return { d, E, Gl, acc, dz, sharp: Math.abs(dz) < 0.2, rel: -dz / (P0 + dz),
          near: nearP > 0.01 ? 100 / nearP : null, far: farP > 0.01 ? 100 / farP : Infinity };
      }
      function pinCalc() {
        return { hi: OBJ_H * st.ps / st.po, spot: st.hole / 10 * (st.po + st.ps) / st.po, bright: Math.pow(st.hole / 2, 2) * Math.pow(20 / st.ps, 2) };
      }

      // ---------- geometry ----------
      function benchGeom() {
        const w = cv.w, h = cv.h, isMir = st.mode === 'mirror';
        const ex = Math.round(w * (isMir ? 0.68 : st.mode === 'div' ? 0.6 : 0.5)), ay = Math.round(h * 0.56);
        const top = w >= 640 ? 56 : 68, H = Math.min(ay - top, h - ay - 16);   // the header needs three lines on a narrow canvas
        return { w, h, isMir, ex, ay, H, sx: (ex - 12) / 82, sy: (ay - top - 4) / 10.5, sag: Math.min(10, H * 0.1) };
      }
      function eyeGeom() {
        const w = cv.w, h = cv.h, R = Math.min(h * 0.26, w * 0.15), cx = w - R - 16, ay = Math.round(h * 0.6);
        const xg = cx - R - Math.max(20, R * 0.45), xNear = xg - Math.max(34, w * 0.07), xFar = Math.max(40, w * 0.07);
        return { w, h, R, cx, ay, xl: cx - R * 0.6, hl: R * 0.36, xg, xNear, xFar, objX: d => xNear - Math.log(d / 10) / Math.log(60) * (xNear - xFar) };
      }
      function pinGeom() {
        const w = cv.w, h = cv.h, s = Math.min((w - 36) / 150, (h - 96) / 44);
        return { w, h, s, wallX: Math.round((w - 150 * s) / 2 + 104 * s), ay: Math.round(h * 0.55) };
      }

      // ---------- readouts ----------
      function update() {
        if (st.mode === 'eye') {
          const e = eyeCalc();
          outFocus.set(e.sharp ? { en: 'on the retina', hr: 'na mrežnici' } : e.dz > 0 ? { en: 'in front of the retina', hr: 'ispred mrežnice' } : { en: 'behind the retina', hr: 'iza mrežnice' });
          outSee.set(e.sharp ? { en: 'a sharp picture', hr: 'oštru sliku' } : { en: 'a blurred picture', hr: 'mutnu sliku' });
          outSee.setColor(e.sharp ? theme.good : theme.warn);
        } else if (st.mode === 'pinhole') {
          const p = pinCalc(); outPH.set(p.hi); outSpot.set(p.spot * 10); outBr.set(p.bright);
        } else {
          const o = optics();
          outB.set(o.inf ? '∞' : o.b); outM.set(o.inf ? '∞' : o.m); outImg.set(describe(o));
        }
        note.set(NOTES[st.mode]); draw();
      }

      // ---------- drawing helpers ----------
      function ray(g, x1, y1, x2, y2, color, width, alpha) {
        g.save(); if (alpha !== undefined) g.globalAlpha = alpha; g.lineCap = 'round';
        g.strokeStyle = theme.fg; g.lineWidth = width + 1.5; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.strokeStyle = color; g.lineWidth = width; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.restore();
      }
      function dashed(g, x1, y1, x2, y2, color) { g.save(); g.setLineDash([5, 4]); g.strokeStyle = color; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
      function lensShape(g, x, y, H, t, diverging) { // thin-lens symbol: glass that is thick (converging) or thin (diverging) in the middle
        g.save(); g.beginPath();
        if (diverging) { g.moveTo(x - t, y - H); g.lineTo(x + t, y - H); g.quadraticCurveTo(x - t * 0.6, y, x + t, y + H); g.lineTo(x - t, y + H); g.quadraticCurveTo(x + t * 0.6, y, x - t, y - H); }
        else { g.moveTo(x, y - H); g.quadraticCurveTo(x + t * 2, y, x, y + H); g.quadraticCurveTo(x - t * 2, y, x, y - H); }
        g.closePath(); g.fillStyle = K.withAlpha(theme.c1, 0.22); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 2; g.stroke(); g.restore();
      }
      function panel(g, x, y, w, h, title) { // small inset card
        g.save(); g.fillStyle = theme.surface; K.roundRect(g, x, y, w, h, 8); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1.5; g.stroke(); g.restore();
        K.text(g, title, x + 8, y + 12, { font: 'bold 11px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }
      function smear(g, r, fn) { // cheap blur: the shape is drawn many times, shifted around two rings, each copy faint
        if (r < 0.7) { fn(0, 0); return; }
        const a0 = g.globalAlpha; g.globalAlpha = a0 * 0.16;
        for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2, rr = i % 2 ? r : r * 0.5; fn(Math.cos(an) * rr, Math.sin(an) * rr); }
        g.globalAlpha = a0;
      }
      function drawCandle(g, x, flameY, s) { // candle whose flame sits at (x, flameY)
        g.save(); g.fillStyle = theme.surface; g.strokeStyle = theme.fg; g.lineWidth = 1.5;
        g.fillRect(x - 5 * s, flameY + 11 * s, 10 * s, 26 * s); g.strokeRect(x - 5 * s, flameY + 11 * s, 10 * s, 26 * s);
        g.beginPath(); g.moveTo(x, flameY + 11 * s); g.lineTo(x, flameY + 6 * s); g.stroke();
        g.fillStyle = theme.c4; g.beginPath(); g.ellipse(x, flameY, 4.5 * s, 7.5 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.restore();
      }
      function dim(g, x1, x2, y, label, below) { // dimension line with two arrow heads
        K.arrow(g, x1, y, x2, y, { color: theme.fg, width: 1.5, head: 6 }); K.arrow(g, x2, y, x1, y, { color: theme.fg, width: 1.5, head: 6 });
        K.text(g, label, (x1 + x2) / 2, y + (below ? 4 : -3), { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: below ? 'top' : 'bottom' });
      }
      function hint(g, key, w, y) { if (w >= 760) K.text(g, T(HINTS[key]), w - 10, y, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' }); }

      // ---------- optical bench: lens or curved mirror ----------
      function drawElement(g, G, o) {
        const { ex, ay, H } = G;
        if (!G.isMir) {
          lensShape(g, ex, ay, H, Math.max(5, Math.min(11, G.w * 0.012)), o.diverging);
          dashed(g, ex, ay - H, ex, ay + H, K.withAlpha(theme.fg, 0.4));
          return;
        }
        const s = o.diverging ? -1 : 1, sag = G.sag, xOf = y => ex - s * sag * (y / H) * (y / H); // concave: the hollow side faces the object
        g.save(); g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath();
        for (let y = -H + 4; y < H; y += 9) { g.moveTo(xOf(y), ay + y); g.lineTo(xOf(y) + 8, ay + y + 5); }
        g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex - s * sag, ay - H); g.quadraticCurveTo(ex + s * sag, ay, ex - s * sag, ay + H); g.stroke();
        g.restore();
      }
      function drawBench(g) {
        const G = benchGeom(), o = optics(), { w, h, ex, ay, sx, sy, isMir, H } = G;
        const X = u => ex + u * sx, XI = v => ex + (isMir ? -v : v) * sx, Y = y => ay - y * sy;
        const f11 = '11px ' + theme.font, b12 = 'bold 12px ' + theme.font;
        // optical axis and focal points
        g.strokeStyle = theme.muted; g.lineWidth = 1; g.beginPath(); g.moveTo(0, ay); g.lineTo(w, ay); g.stroke();
        for (let k = 1; k <= 2; k++) for (let sd = -1; sd <= 1; sd += 2) {
          if (isMir && (sd === 1) !== o.diverging) continue;   // a mirror has F and C on one side only
          const x = ex + sd * k * st.f * sx;
          if (x < 6 || x > w - 6) continue;
          g.fillStyle = theme.fg; g.beginPath(); g.arc(x, ay, 3, 0, Math.PI * 2); g.fill();
          if (k === 1 || st.f * sx > 17) K.text(g, k === 1 ? 'F' : (isMir ? 'C' : '2F'), x, ay + 6, { font: b12, color: theme.fg, align: 'center', baseline: 'top' });
        }
        drawElement(g, G, o);
        K.text(g, T(isMir ? (o.diverging ? { en: 'convex mirror', hr: 'ispupčeno zrcalo' } : { en: 'concave mirror', hr: 'udubljeno zrcalo' })
          : (o.diverging ? { en: 'diverging lens', hr: 'rastresna leća' } : { en: 'converging lens', hr: 'sabirna leća' })), ex, ay + H + 3, { font: f11, color: theme.muted, align: 'center', baseline: 'top' });
        // the three principal rays: parallel → focus, through the centre, through the focus → parallel
        const O = { x: X(-o.a), y: Y(st.ho) }, I = o.inf ? null : { x: XI(o.b), y: Y(o.hi) };
        const scrOn = st.screen && !isMir, xs = ex + st.sp * sx, far = (w + h) * 3;
        const out = [[Math.abs(o.f), -st.ho * Math.sign(o.f)], [o.a, -st.ho], [1, 0]], cols = [theme.c3, theme.c4, theme.c5];
        const hits = [st.ho, 0, o.inf ? null : o.hi].map(v => { // where each ray meets the lens plane / the mirror surface
          if (v === null) return null;
          const y = Y(v), d = (y - ay) / H;
          return { x: isMir && Math.abs(d) <= 1 ? ex - (o.diverging ? -1 : 1) * G.sag * d * d : ex, y };
        });
        for (let i = 0; i < 3; i++) {
          const hp = hits[i], centre = i === 1 && !isMir;
          if (!hp) continue;
          let dx = out[i][0] * sx, dy = -out[i][1] * sy;
          if (isMir) { dx = -dx; if (I) { const sg = o.real ? 1 : -1; dx = (I.x - hp.x) * sg; dy = (I.y - hp.y) * sg; } }
          const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
          const reach = scrOn && dx > 0.01 ? (xs - ex) / dx : far;   // a screen stops the light
          ray(g, O.x, O.y, hp.x, hp.y, cols[i], 2);
          ray(g, hp.x, hp.y, hp.x + dx * reach, hp.y + dy * reach, cols[i], 2);
          if (I && !o.real && !(centre && Math.abs(o.b) <= o.a)) dashed(g, centre ? O.x : hp.x, centre ? O.y : hp.y, I.x, I.y, cols[i]);
        }
        if (!o.inf) { // dashed guides to the focal points the rays are aimed at
          if (o.f > 0 && o.a < o.f) dashed(g, X(-o.f), ay, O.x, O.y, cols[2]);
          if (o.f < 0) { dashed(g, hits[2].x, hits[2].y, X(-o.f), ay, cols[2]); dashed(g, hits[0].x, hits[0].y, XI(o.f), ay, cols[0]); }
        }
        // object and image arrows
        K.arrow(g, O.x, ay, O.x, O.y, { color: theme.c1, width: 4, head: 11 });
        K.text(g, T({ en: 'object', hr: 'predmet' }), O.x, O.y - 5, { font: f11, color: theme.muted, align: 'center', baseline: 'bottom' });
        if (I) {
          const hidden = scrOn && o.real && st.sp < o.b - 0.01;   // the screen catches the light before the image
          const lbl = T(o.real ? { en: 'image', hr: 'slika' } : { en: 'virtual image', hr: 'prividna slika' });
          g.save(); if (!o.real || hidden) { g.setLineDash([5, 4]); g.globalAlpha = hidden ? 0.35 : 0.85; }
          K.arrow(g, I.x, ay, I.x, I.y, { color: theme.c2, width: 4, head: 11 }); g.restore();
          if (I.x > 24 && I.x < w - 24) {
            if (o.real) K.text(g, lbl, I.x + (isMir ? -7 : 7), ay - 6, { font: f11, color: theme.muted, align: isMir ? 'right' : 'left', baseline: 'bottom' });
            else K.text(g, lbl, I.x, ay + 21, { font: f11, color: theme.muted, align: 'center', baseline: 'top' });
          } else K.text(g, (I.x <= 24 ? '← ' : '') + lbl + ': b = ' + F(o.b, 0) + ' cm' + (I.x <= 24 ? '' : ' →'), I.x <= 24 ? 8 : w - 8, ay - 9, { font: b12, color: theme.fg, align: I.x <= 24 ? 'left' : 'right', baseline: 'bottom' });
        }
        // screen and what it shows
        if (scrOn) {
          const si = screenInfo(o), bw = Math.round(K.clamp(w * 0.26, 100, 136)), bh = h < 340 ? 88 : 104, bx = 8, by = h - bh - 8, mx = bx + bw / 2, my = by + 20 + (bh - 40) / 2, sc = (bh - 40) / 12;
          g.save(); g.fillStyle = theme.surface2; g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.fillRect(xs - 3, ay - H, 6, 2 * H); g.strokeRect(xs - 3, ay - H, 6, 2 * H);
          if (si) { g.beginPath(); g.rect(xs - 3, ay - H, 6, 2 * H); g.clip(); g.fillStyle = K.withAlpha(theme.c2, si.sharp ? 0.95 : 0.45); g.fillRect(xs - 3, Y(si.blur), 6, (si.hgt + 2 * si.blur) * sy); }
          g.restore();
          K.text(g, T({ en: 'screen', hr: 'zastor' }), xs, ay - H - 3, { font: f11, color: theme.muted, align: 'center', baseline: 'bottom' });
          panel(g, bx, by, bw, bh, T({ en: 'On the screen', hr: 'Na zastoru' }));
          if (si) {
            const hh = si.hgt * sc / 2, r = si.sharp ? 0 : Math.min(12, 1 + si.blur * sc);
            g.save(); g.beginPath(); g.rect(bx + 2, by + 20, bw - 4, bh - 40); g.clip();
            smear(g, r, (ox, oy) => K.arrow(g, mx + ox, my - hh + oy, mx + ox, my + hh + oy, { color: theme.c2, width: 4, head: 9 }));
            g.restore();
          }
          K.text(g, T(!si ? { en: 'no image', hr: 'nema slike' } : si.sharp ? { en: 'sharp image', hr: 'oštra slika' } : { en: 'blurred', hr: 'mutno' }), mx, by + bh - 10, { font: b12, color: theme.fg, align: 'center', baseline: 'middle' });
        }
        // header: equation, numbers, kind of image
        const eq = '1/f = 1/a + 1/b', vals = 'a = ' + F(o.a, 1) + ' cm   f = ' + F(o.f, 0) + ' cm   b = ' + (o.inf ? '∞' : F(o.b, 1) + ' cm') + '   m = ' + (o.inf ? '∞' : F(o.m, 2));
        const desc = T({ en: 'Image: ', hr: 'Slika: ' }) + T(describe(o)), bold = 'bold 14px ' + theme.fontDisplay;
        g.fillStyle = K.withAlpha(theme.sky, 0.8); g.fillRect(0, 0, w, w >= 640 ? 46 : 55);
        if (w >= 640) {
          K.text(g, eq, 10, 15, { font: bold, color: theme.fg, baseline: 'middle' }); K.text(g, vals, 150, 15, { font: '12px ' + theme.font, color: theme.fg, baseline: 'middle' });
          K.text(g, desc, 10, 35, { font: bold, color: theme.fg, baseline: 'middle' });
        } else {
          K.text(g, eq, 10, 13, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' }); K.text(g, vals, 10, 29, { font: f11, color: theme.fg, baseline: 'middle' });
          K.text(g, desc, 10, 45, { font: b12, color: theme.fg, baseline: 'middle' });
        }
        hint(g, 'bench', w, 15);
      }

      // ---------- the eye ----------
      function drawEye(g) {
        const E = eyeGeom(), e = eyeCalc(), { w, h, R, cx, ay, xl, hl, xg } = E, xr = cx + R;
        const f11 = '11px ' + theme.font, b12 = 'bold 12px ' + theme.font, far = !isFinite(e.d), ox = far ? 0 : E.objX(e.d);
        // eyeball: cornea bulge, white of the eye, retina, iris, lens (fatter when it strains for near objects)
        g.save(); g.lineWidth = 2; g.strokeStyle = theme.fg;
        g.fillStyle = K.withAlpha(theme.water, 0.6); g.beginPath(); g.ellipse(cx - R * 0.8, ay, R * 0.34, R * 0.52, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = theme.surface; g.beginPath(); g.arc(cx, ay, R, 0, Math.PI * 2); g.fill(); g.stroke();
        g.strokeStyle = theme.c8; g.lineWidth = 5; g.beginPath(); g.arc(cx, ay, R - 4, -1.05, 1.05); g.stroke();
        g.strokeStyle = theme.muted; g.lineWidth = 4; g.beginPath();
        g.moveTo(xl - R * 0.14, ay - R * 0.42); g.lineTo(xl - R * 0.14, ay - R * 0.64); g.moveTo(xl - R * 0.14, ay + R * 0.42); g.lineTo(xl - R * 0.14, ay + R * 0.64); g.stroke();
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.fillStyle = K.withAlpha(theme.c1, 0.35);
        g.beginPath(); g.ellipse(xl, ay, R * (0.11 + 0.07 * e.acc / ACC), R * 0.42, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.restore();
        K.text(g, T({ en: 'retina', hr: 'mrežnica' }), cx + R * 0.45, ay + R + 5, { font: f11, color: theme.muted, align: 'center', baseline: 'top' });
        K.text(g, T({ en: 'eye lens', hr: 'očna leća' }), xl, ay - R - 5, { font: f11, color: theme.muted, align: 'center', baseline: 'bottom' });
        // glasses
        const gl = st.glasses !== 'none';
        if (gl) {
          lensShape(g, xg, ay, R * 0.66, Math.max(4, R * 0.07), st.glasses === 'div');
          K.text(g, (e.Gl > 0 ? '+' : '−') + F(Math.abs(e.Gl), 1) + (lang === 'hr' ? ' dpt' : ' D'), xg, ay + R * 0.66 + 5, { font: b12, color: theme.fg, align: 'center', baseline: 'top' });
        }
        // rays from one point of the object: to the eye lens, then towards the point where the sharp image forms
        const xf = xl + (xr - xl) * K.clamp(1 + 5 * e.rel, 0.35, 2.4);
        for (let s = -1; s <= 1; s++) {
          const yl = ay + s * hl;
          let px = ox, py = far ? yl : ay;
          if (gl && s !== 0) {
            const hn = far ? hl : hl * (xg - ox) / (xl - ox), yg = ay + s * hn * (st.glasses === 'div' ? 0.75 : 1.25);
            if (far) py = yg;
            ray(g, px, py, xg, yg, theme.c4, 2); px = xg; py = yg;
          }
          ray(g, px, py, xl, yl, theme.c4, 2);
          const dx = xf - xl, dy = ay - yl, pcx = xl - cx, pcy = yl - ay, rr = R - 6;   // stop the ray at the retina (circle)
          const qa = dx * dx + dy * dy, qb = 2 * (pcx * dx + pcy * dy), qc = pcx * pcx + pcy * pcy - rr * rr;
          const t = (-qb + Math.sqrt(Math.max(0, qb * qb - 4 * qa * qc))) / (2 * qa);
          ray(g, xl, yl, xl + dx * t, yl + dy * t, theme.c4, 2);
          if (t < 1) dashed(g, xl + dx * t, yl + dy * t, xf, ay, theme.c4);
        }
        if (xf < w - 8) {
          g.fillStyle = theme.fg; g.beginPath(); g.arc(xf, ay, 4, 0, Math.PI * 2); g.fill();
          K.text(g, T({ en: 'sharp image here', hr: 'ovdje je oštra slika' }), Math.min(xf, w - 60), ay - R - 20, { font: b12, color: theme.fg, align: 'center', baseline: 'bottom' });
          dashed(g, xf, ay - 6, Math.min(xf, w - 60), ay - R - 18, K.withAlpha(theme.fg, 0.6));
        }
        // object
        if (far) K.text(g, T({ en: 'far object → parallel rays', hr: 'daleki predmet → usporedne zrake' }), 10, ay - hl * 1.3 - 12, { font: f11, color: theme.muted, baseline: 'bottom' });
        else { drawCandle(g, ox, ay, Math.max(0.8, R / 70)); K.text(g, distLabel(e.d, lang), ox, ay - 14 - R / 8, { font: b12, color: theme.fg, align: 'center', baseline: 'bottom' }); }
        // what the eye sees
        const pw = Math.round(K.clamp(w * 0.4, 140, 190)), ph = 76, r = e.sharp ? 0 : Math.min(8, 1.2 + Math.abs(e.dz) * 2);
        panel(g, 8, 8, pw, ph, T({ en: 'What the eye sees', hr: 'Što oko vidi' }));
        g.save(); g.beginPath(); g.rect(10, 28, pw - 4, ph - 22); g.clip();
        smear(g, r, (ox2, oy2) => {
          K.text(g, 'FizLab', 8 + pw / 2 + ox2, 46 + oy2, { font: 'bold 22px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
          K.text(g, '1 2 3 4 5 6 7', 8 + pw / 2 + ox2, 69 + oy2, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        });
        g.restore();
        g.fillStyle = e.sharp ? theme.good : theme.warn; g.beginPath(); g.arc(pw - 2, 20, 5, 0, Math.PI * 2); g.fill();
        // range of clear sight
        const range = e.near === null ? T({ en: 'This eye sees nothing sharply', hr: 'Ovo oko ništa ne vidi oštro' })
          : T({ en: 'Sharp from ', hr: 'Oštro od ' }) + distLabel(e.near, lang) + T({ en: ' to ', hr: ' do ' }) + distLabel(e.far, lang);
        K.text(g, range, w - 10, 15, { font: b12, color: theme.fg, align: 'right', baseline: 'middle' });
        K.text(g, T({ en: 'not to scale; focus shift enlarged', hr: 'nije u mjerilu; pomak žarišta uvećan' }), 10, h - 10, { font: f11, color: theme.muted, baseline: 'middle' });
        hint(g, 'eye', w, h - 10);
      }

      // ---------- pinhole camera ----------
      function drawPinhole(g) {
        const P = pinGeom(), p = pinCalc(), { w, h, s, wallX, ay } = P, f11 = '11px ' + theme.font, b12 = 'bold 12px ' + theme.font;
        const xo = wallX - st.po * s, xs = wallX + st.ps * s, top = ay - 23 * s, bot = ay + 23 * s, gp = 4 + st.hole * 1.5, hy = OBJ_H / 2 * s;
        // dark box
        g.fillStyle = K.withAlpha(theme.fg, 0.08); g.fillRect(wallX, top, xs - wallX, bot - top);
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(wallX, top); g.lineTo(xs, top); g.moveTo(wallX, bot); g.lineTo(xs, bot); g.stroke();
        // light from the top and the bottom of the object: a narrow bundle through the hole
        const ends = [ay - hy, ay + hy], cols = [theme.c3, theme.c5];
        for (let i = 0; i < 2; i++) {
          const py = ends[i], k = (xs - xo) / (wallX - xo), yU = py + (ay - gp / 2 - py) * k, yL = py + (ay + gp / 2 - py) * k;
          g.fillStyle = K.withAlpha(theme.c4, 0.3); g.beginPath(); g.moveTo(xo, py); g.lineTo(wallX, ay - gp / 2); g.lineTo(xs, yU); g.lineTo(xs, yL); g.lineTo(wallX, ay + gp / 2); g.closePath(); g.fill();
          ray(g, xo, py, xs, py + (ay - py) * k, cols[i], 2);
        }
        // wall with the hole, screen
        g.fillStyle = theme.fg; g.fillRect(wallX - 3, top, 6, ay - gp / 2 - top); g.fillRect(wallX - 3, ay + gp / 2, 6, bot - ay - gp / 2);
        g.fillStyle = theme.surface2; g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.fillRect(xs - 3, top, 6, bot - top); g.strokeRect(xs - 3, top, 6, bot - top);
        K.text(g, T({ en: 'hole (drawn larger)', hr: 'otvor (nacrtan veći)' }), wallX, top - 4, { font: f11, color: theme.muted, align: 'center', baseline: 'bottom' });
        K.text(g, T({ en: 'screen', hr: 'zastor' }), xs + 8, top + 2, { font: f11, color: theme.muted, baseline: 'top' });
        // object and its upside-down image
        K.arrow(g, xo, ay + hy, xo, ay - hy, { color: theme.c1, width: 4, head: 11 });
        K.text(g, T({ en: 'object', hr: 'predmet' }) + ' ' + F(OBJ_H, 0) + ' cm', Math.max(xo, 6), ay + hy + 5, { font: f11, color: theme.muted, align: xo < 50 ? 'left' : 'center', baseline: 'top' });
        const ih = p.hi * s / 2, il = T({ en: 'image', hr: 'slika' }) + ' ' + F(p.hi, 1) + ' cm';
        K.arrow(g, xs + 9, ay - ih, xs + 9, ay + ih, { color: theme.c2, width: 4, head: Math.min(11, ih * 2) });
        g.font = b12;
        if (xs + 18 + g.measureText(il).width < w - 4) K.text(g, il, xs + 18, ay, { font: b12, color: theme.fg, baseline: 'middle' });
        dim(g, xo, wallX, bot + 13, 'a = ' + F(st.po, 0) + ' cm', false); dim(g, wallX, xs, bot + 13, 'b = ' + F(st.ps, 0) + ' cm', true);
        // what the screen shows (enlarged blur so it can be seen)
        const bw = 116, bh = 122, mx = 8 + bw / 2, my = 8 + 20 + (bh - 24) / 2, sc = (bh - 30) / 40;
        panel(g, 8, 8, bw, bh, T({ en: 'On the screen', hr: 'Na zastoru' }));
        g.save(); g.fillStyle = '#10131f'; K.roundRect(g, 12, 28, bw - 8, bh - 24, 5); g.fill(); g.clip();
        g.globalAlpha = K.clamp(0.16 + 0.84 * (st.hole / 10) * Math.min(1.5, 20 / st.ps), 0.16, 1);
        smear(g, Math.min(9, p.spot * 3), (ox, oy) => K.arrow(g, mx + ox, my - p.hi * sc / 2 + oy, mx + ox, my + p.hi * sc / 2 + oy, { color: '#ffd75a', width: 4, head: 9 }));
        g.restore();
        // similar triangles
        const l1 = T({ en: 'image = object · b / a', hr: 'slika = predmet · b / a' }), l2 = '= ' + F(OBJ_H, 0) + ' cm · ' + F(st.ps / st.po, 2) + ' = ' + F(p.hi, 1) + ' cm';
        if (w >= 640) K.text(g, l1 + '  ' + l2, w - 10, 15, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, align: 'right', baseline: 'middle' });
        else { K.text(g, l1, w - 10, 13, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, align: 'right', baseline: 'middle' }); K.text(g, l2, w - 10, 30, { font: b12, color: theme.fg, align: 'right', baseline: 'middle' }); }
        hint(g, 'pinhole', w, h - 10);
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (st.mode === 'eye') drawEye(g); else if (st.mode === 'pinhole') drawPinhole(g); else drawBench(g);
      }

      // ---------- pointer ----------
      function hitTest(p) {
        if (isBench()) {
          const G = benchGeom();
          if (st.screen && !G.isMir && Math.abs(p.x - (G.ex + st.sp * G.sx)) < 14) return 'screen';
          if (Math.hypot(p.x - (G.ex - st.a * G.sx), p.y - (G.ay - st.ho * G.sy)) < 20) return 'tip';
          return p.x < G.ex - 6 ? 'obj' : null;
        }
        if (st.mode === 'eye') return p.x < eyeGeom().xg - 6 ? 'eyeObj' : null;
        const P = pinGeom();
        if (p.x > P.wallX + 8) return 'pscreen';
        return p.x < P.wallX - 8 ? 'pobj' : null;
      }
      function onDown(ev) {
        st.drag = hitTest(cv.pointer(ev));
        if (!st.drag) return;
        try { if (ev.pointerId !== undefined) cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        ev.preventDefault(); onMove(ev);
      }
      function onMove(ev) {
        const p = cv.pointer(ev);
        if (!st.drag) { const hit = hitTest(p); cv.canvas.style.cursor = hit === 'tip' ? 'move' : hit ? 'ew-resize' : 'default'; return; }
        ev.preventDefault();
        if (st.drag === 'obj' || st.drag === 'tip') {
          const G = benchGeom();
          if (st.drag === 'tip') st.ho = K.clamp(Math.round((G.ay - p.y) / G.sy * 2) / 2, 1, 10);
          slA.set(K.clamp(Math.round((G.ex - p.x) / G.sx * 2) / 2, 2, 80), true);
        } else if (st.drag === 'screen') {
          const G = benchGeom(); slScr.set(K.clamp(Math.round((p.x - G.ex) / G.sx * 2) / 2, 2, 80), true);
        } else if (st.drag === 'eyeObj') {
          const E = eyeGeom(); let best = 0, bd = 1e9;
          for (let i = 0; i < DIST.length; i++) { const dd = Math.abs(p.x - (isFinite(DIST[i]) ? E.objX(DIST[i]) : E.xFar - 30)); if (dd < bd) { bd = dd; best = i; } }
          slD.set(best, true);
        } else if (st.drag === 'pobj') {
          const P = pinGeom(); slPO.set(K.clamp(Math.round((P.wallX - p.x) / P.s), 20, 100), true);
        } else if (st.drag === 'pscreen') {
          const P = pinGeom(); slPS.set(K.clamp(Math.round((p.x - P.wallX) / P.s), 5, 40), true);
        }
      }
      function onUp() { st.drag = null; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      cv.onResize(draw);
      applyMode(); slScr.setDisabled(true); syncGlasses(); update();

      return {
        destroy() {
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); update(); },
        setTheme(t) { theme = t; update(); },
        reset: resetMode
      };
    }
  });
})();
