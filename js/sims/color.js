/* FizLab sim: Mixing colours — (a) additive mixing of red, green and blue spotlights on a white wall, (b) subtractive mixing of
   cyan, magenta and yellow paints, (c) how coloured light changes the colour objects appear. Visible spectrum strip in every mode.
   Colours of lights, paints, objects and the spectrum are physical, so literal colours are used for them (on a dark stage / white paper). */
(function () {
  'use strict';
  const K = window.SimKit;
  // nearest-name lookup in RGB (0–1); `long` adds the school explanation for cyan / magenta
  const NAMES = [
    { rgb: [0, 0, 0], en: 'black', hr: 'crna' }, { rgb: [1, 1, 1], en: 'white', hr: 'bijela' },
    { rgb: [0.5, 0.5, 0.5], en: 'grey', hr: 'siva' }, { rgb: [0.25, 0.25, 0.25], en: 'dark grey', hr: 'tamnosiva' }, { rgb: [0.8, 0.8, 0.8], en: 'light grey', hr: 'svijetlosiva' },
    { rgb: [1, 0, 0], en: 'red', hr: 'crvena' }, { rgb: [0.5, 0, 0], en: 'dark red', hr: 'tamnocrvena' },
    { rgb: [0, 1, 0], en: 'green', hr: 'zelena' }, { rgb: [0, 0.5, 0], en: 'dark green', hr: 'tamnozelena' },
    { rgb: [0, 0, 1], en: 'blue', hr: 'plava' }, { rgb: [0, 0, 0.5], en: 'dark blue', hr: 'tamnoplava' },
    { rgb: [1, 1, 0], en: 'yellow', hr: 'žuta' }, { rgb: [0.5, 0.5, 0], en: 'olive', hr: 'maslinasta' },
    { rgb: [0, 1, 1], en: 'cyan', hr: 'cijan', long: { en: 'cyan (blue-green)', hr: 'cijan (plavozelena)' } }, { rgb: [0, 0.5, 0.5], en: 'dark cyan', hr: 'tamni cijan' },
    { rgb: [1, 0, 1], en: 'magenta', hr: 'magenta', long: { en: 'magenta', hr: 'magenta (ljubičastocrvena)' } }, { rgb: [0.5, 0, 0.5], en: 'purple', hr: 'ljubičasta' },
    { rgb: [1, 0.5, 0], en: 'orange', hr: 'narančasta' }, { rgb: [0.5, 0, 1], en: 'violet', hr: 'modroljubičasta' }, { rgb: [1, 0.5, 0.75], en: 'pink', hr: 'ružičasta' },
    { rgb: [0.5, 1, 0], en: 'yellow-green', hr: 'žutozelena' }, { rgb: [0.5, 0.75, 1], en: 'light blue', hr: 'svijetloplava' }, { rgb: [0.45, 0.25, 0.1], en: 'brown', hr: 'smeđa' }
  ];
  function nameOf(rgb) {
    let best = NAMES[0], bd = 1e9;
    NAMES.forEach(n => { const d = (n.rgb[0] - rgb[0]) ** 2 + (n.rgb[1] - rgb[1]) ** 2 + (n.rgb[2] - rgb[2]) ** 2; if (d < bd) { bd = d; best = n; } });
    return { en: best.en, hr: best.hr, long: best.long || { en: best.en, hr: best.hr } };
  }
  const ch = v => Math.round(K.clamp(v, 0, 1) * 255);
  const css = rgb => 'rgb(' + ch(rgb[0]) + ',' + ch(rgb[1]) + ',' + ch(rgb[2]) + ')';
  const rgbText = rgb => ch(rgb[0]) + ', ' + ch(rgb[1]) + ', ' + ch(rgb[2]);
  function wlColor(wl) { // approximate colour of a wavelength in nm
    let r, g, b;
    if (wl < 440) { r = (440 - wl) / 60; g = 0; b = 1; } else if (wl < 490) { r = 0; g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { r = 0; g = 1; b = (510 - wl) / 20; } else if (wl < 580) { r = (wl - 510) / 70; g = 1; b = 0; }
    else if (wl < 645) { r = 1; g = (645 - wl) / 65; b = 0; } else { r = 1; g = 0; b = 0; }
    const f = wl < 420 ? 0.35 + 0.65 * (wl - 380) / 40 : wl > 680 ? 0.35 + 0.65 * (700 - wl) / 20 : 1;
    return [r * f, g * f, b * f];
  }
  const OBJECTS = [
    { id: 'apple', refl: [1, 0.12, 0.1], name: { en: 'red apple', hr: 'crvena jabuka' } },
    { id: 'leaf', refl: [0.15, 0.8, 0.2], name: { en: 'green leaf', hr: 'zeleni list' } },
    { id: 'ball', refl: [0.15, 0.3, 1], name: { en: 'blue ball', hr: 'plava lopta' } },
    { id: 'cup', refl: [1, 1, 1], name: { en: 'white cup', hr: 'bijela šalica' } },
    { id: 'banana', refl: [1, 0.9, 0.1], name: { en: 'yellow banana', hr: 'žuta banana' } }
  ];
  const LIGHTS = [
    { id: 'white', rgb: [1, 1, 1], label: { en: 'White light', hr: 'Bijela svjetlost' } },
    { id: 'red', rgb: [1, 0, 0], label: { en: 'Red light', hr: 'Crvena svjetlost' } },
    { id: 'green', rgb: [0, 1, 0], label: { en: 'Green light', hr: 'Zelena svjetlost' } },
    { id: 'blue', rgb: [0, 0, 1], label: { en: 'Blue light', hr: 'Plava svjetlost' } },
    { id: 'yellow', rgb: [1, 1, 0], label: { en: 'Yellow light', hr: 'Žuta svjetlost' } }
  ];
  const NOTES = {
    lights: { en: 'Lights ADD up: red + green = yellow, red + blue = magenta, green + blue = cyan, all three = white. Your screen makes every colour this way from tiny red, green and blue dots.',
      hr: 'Svjetla se ZBRAJAJU: crvena + zelena = žuta, crvena + plava = magenta, zelena + plava = cijan, sve tri = bijela. Tvoj ekran tako stvara sve boje iz sitnih crvenih, zelenih i plavih točkica.' },
    paints: { en: 'Paints work the other way round: each paint REMOVES (absorbs) a colour of light. Cyan absorbs red, magenta absorbs green, yellow absorbs blue. All three together absorb everything, so the mixture is black.',
      hr: 'Boje djeluju obrnuto: svaka boja ODUZIMA (upija) dio svjetlosti. Cijan upija crvenu, magenta zelenu, žuta plavu. Sve tri zajedno upiju sve, pa je smjesa crna.' },
    objects: { en: 'An object only reflects the colours it does not absorb. A red apple reflects red light; under green light there is no red to reflect, so it looks black.',
      hr: 'Predmet odbija samo one boje koje ne upija. Crvena jabuka odbija crvenu svjetlost; pod zelenom svjetlošću nema crvene koju bi odbila, pa izgleda crna.' }
  };
  const HEADS = {
    lights: { en: 'Adding lights (additive mixing) on a white wall in a dark room', hr: 'Zbrajanje svjetla (aditivno miješanje) na bijelom zidu u tamnoj sobi' },
    paints: { en: 'Mixing paints (subtractive mixing) on white paper', hr: 'Miješanje boja (suptraktivno miješanje) na bijelom papiru' },
    objects: { en: 'Objects under coloured light', hr: 'Predmeti pod obojenom svjetlošću' }
  };
  const ANGS = [-90, 30, 150].map(a => a * Math.PI / 180);

  window.Sims.register({
    id: 'color',
    title: { en: 'Mixing Colours', hr: 'Miješanje boja' },
    summary: {
      en: 'Mix red, green and blue lights, mix cyan, magenta and yellow paints, and shine coloured light on everyday objects.',
      hr: 'Miješaj crveno, zeleno i plavo svjetlo, miješaj cijan, magenta i žutu boju i obasjaj svakodnevne predmete obojenom svjetlošću.'
    },
    tasks: [
      { en: 'Lights: turn the blue light off. What colour is the middle now? Then turn red off instead.', hr: 'Svjetla: ugasi plavo svjetlo. Koje je boje sredina sada? Zatim umjesto toga ugasi crveno.' },
      { en: 'Lights vs paints: red + green LIGHT gives yellow. What do you get when you mix all three PAINTS?', hr: 'Svjetla i boje: crveno + zeleno SVJETLO daje žutu. Što dobiješ kad pomiješaš sve tri BOJE?' },
      { en: 'Objects: shine green light on the red apple. Why does it look black?', hr: 'Predmeti: obasjaj crvenu jabuku zelenom svjetlošću. Zašto izgleda crno?' },
      { en: 'Objects: which object keeps its colour under every light? Why?', hr: 'Predmeti: koji predmet zadržava svoju boju pod svakom svjetlošću? Zašto?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 460 });
      const C = K.controls(container, lang);
      const st = { mode: 'lights', li: { r: 100, g: 100, b: 100, apart: true, spacing: 45 }, pa: { c: 100, m: 100, y: 100 }, ob: { light: LIGHTS[0] } };

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'lights', label: { en: 'Lights', hr: 'Svjetla' } }, { value: 'paints', label: { en: 'Paints', hr: 'Boje' } },
        { value: 'objects', label: { en: 'Coloured light on objects', hr: 'Obojena svjetlost na predmetima' } }], value: 'lights', onChange: setMode });
      const pct = { min: 0, max: 100, step: 1, unit: '%', digits: 0 };
      const slR = C.slider(Object.assign({ label: { en: 'Red light', hr: 'Crveno svjetlo' }, value: 100, onChange: v => { st.li.r = v; update(); } }, pct));
      const slG = C.slider(Object.assign({ label: { en: 'Green light', hr: 'Zeleno svjetlo' }, value: 100, onChange: v => { st.li.g = v; update(); } }, pct));
      const slB = C.slider(Object.assign({ label: { en: 'Blue light', hr: 'Plavo svjetlo' }, value: 100, onChange: v => { st.li.b = v; update(); } }, pct));
      const tgApart = C.toggle({ label: { en: 'Move the lights apart', hr: 'Razmakni svjetla' }, value: true, onChange: v => { st.li.apart = v; slSp.setDisabled(!v); update(); } });
      const slSp = C.slider(Object.assign({ label: { en: 'Spacing', hr: 'Razmak' }, value: 45, onChange: v => { st.li.spacing = v; update(); } }, pct));
      const outRGB = C.readout({ label: { en: 'Centre colour (R, G, B)', hr: 'Boja u sredini (R, G, B)' }, unit: '' });
      const outName = C.readout({ label: { en: 'Colour name', hr: 'Naziv boje' }, unit: '' });
      const slC = C.slider(Object.assign({ label: { en: 'Cyan paint', hr: 'Cijan boja' }, value: 100, onChange: v => { st.pa.c = v; update(); } }, pct));
      const slM = C.slider(Object.assign({ label: { en: 'Magenta paint', hr: 'Magenta boja' }, value: 100, onChange: v => { st.pa.m = v; update(); } }, pct));
      const slY = C.slider(Object.assign({ label: { en: 'Yellow paint', hr: 'Žuta boja' }, value: 100, onChange: v => { st.pa.y = v; update(); } }, pct));
      const outRGB2 = C.readout({ label: { en: 'Mixture (R, G, B)', hr: 'Smjesa (R, G, B)' }, unit: '' });
      const outName2 = C.readout({ label: { en: 'Mixture colour', hr: 'Boja smjese' }, unit: '' });
      const selLight = C.select({ label: { en: 'Light colour', hr: 'Boja svjetlosti' }, options: LIGHTS.map(l => ({ value: l.id, label: l.label })), value: 'white',
        onChange: v => { st.ob.light = LIGHTS.find(l => l.id === v); update(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { resetMode(); } });
      const note = C.note({ text: NOTES.lights });
      const GROUPS = { lights: [slR, slG, slB, tgApart, slSp, outRGB, outName], paints: [slC, slM, slY, outRGB2, outName2], objects: [selLight] };

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function show(c, on) { fieldOf(c).style.display = on ? '' : 'none'; }
      function applyMode() { Object.keys(GROUPS).forEach(m => GROUPS[m].forEach(c => show(c, m === st.mode))); }
      function setMode(v) { st.mode = v; applyMode(); update(); }
      function resetMode() {
        if (st.mode === 'lights') { st.li = { r: 100, g: 100, b: 100, apart: true, spacing: 45 }; slR.set(100); slG.set(100); slB.set(100); tgApart.set(true); slSp.set(45); slSp.setDisabled(false); }
        else if (st.mode === 'paints') { st.pa = { c: 100, m: 100, y: 100 }; slC.set(100); slM.set(100); slY.set(100); }
        else { st.ob.light = LIGHTS[0]; selLight.set('white'); }
        update();
      }

      // ---------- colour maths ----------
      const lightI = () => [st.li.r / 100, st.li.g / 100, st.li.b / 100];
      const paintCols = () => [[1 - st.pa.c / 100, 1, 1], [1, 1 - st.pa.m / 100, 1], [1, 1, 1 - st.pa.y / 100]]; // each paint removes its complementary light
      function colourAt(x, y, G, additive) { // colour of a point on the wall / paper from the discs that contain it
        const I = lightI(), P = paintCols(), rgb = additive ? [0, 0, 0] : [1, 1, 1];
        G.centers.forEach((c, i) => {
          if (Math.hypot(x - c.x, y - c.y) > G.R) return;
          for (let k = 0; k < 3; k++) rgb[k] = additive ? Math.min(1, rgb[k] + (k === i ? I[i] : 0)) : rgb[k] * P[i][k];
        });
        return rgb;
      }
      function update() {
        if (st.mode === 'lights') { const G = lightsGeom(), c = colourAt(G.cx, G.cy, G, true); outRGB.set(rgbText(c)); outName.set(nameOf(c).long); }
        else if (st.mode === 'paints') { const P = paintCols(), c = [P[0][0], P[1][1], P[2][2]]; outRGB2.set(rgbText(c)); outName2.set(nameOf(c).long); }
        note.set(NOTES[st.mode]); draw();
      }

      // ---------- layout ----------
      function area() { const w = cv.w, h = cv.h; return { w, h, x: 8, y: 30, aw: w - 16, ah: h - 30 - 8 - 58 }; }
      function discGeom(additive) {
        const A = area(), R = Math.min(A.aw, A.ah) * (additive ? 0.27 : 0.25);
        const cx = additive ? A.x + A.aw / 2 : A.x + A.aw * 0.36, cy = A.y + A.ah / 2 + 4;
        const sp = additive ? (st.li.apart ? st.li.spacing / 100 * R * 0.95 : 0) : R * 0.55;
        return { A, R, cx, cy, sp, centers: ANGS.map(a => ({ x: cx + Math.cos(a) * sp, y: cy + Math.sin(a) * sp })) };
      }
      const lightsGeom = () => discGeom(true);
      function toEdge(cx, cy, dx, dy, A, pad) { // point where a ray from (cx,cy) meets the stage border
        let t = 1e9;
        if (dx > 1e-6) t = Math.min(t, (A.x + A.aw - pad - cx) / dx); else if (dx < -1e-6) t = Math.min(t, (A.x + pad - cx) / dx);
        if (dy > 1e-6) t = Math.min(t, (A.y + A.ah - pad - cy) / dy); else if (dy < -1e-6) t = Math.min(t, (A.y + pad - cy) / dy);
        return { x: cx + dx * t, y: cy + dy * t };
      }
      function otext(g, s, x, y, font, align) { // white text with a dark outline: readable on any physical colour
        g.save(); g.font = font; g.textAlign = align || 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 3;
        g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(s, x, y); g.fillStyle = '#ffffff'; g.fillText(s, x, y); g.restore();
      }
      function inDisc(p, c, R) { return Math.hypot(p.x - c.x, p.y - c.y) <= R; }
      function labelDiscs(g, G, additive) { // name the pure parts, the pairwise overlaps and the centre
        const { R, cx, cy, centers } = G, font = 'bold ' + (R < 60 ? 10 : 12) + 'px ' + theme.font;
        const put = p => otext(g, K.tr(nameOf(colourAt(p.x, p.y, G, additive)), lang), p.x, p.y, font);
        if (G.sp > 2) centers.forEach((c, i) => {
          const p = { x: c.x + Math.cos(ANGS[i]) * R * 0.6, y: c.y + Math.sin(ANGS[i]) * R * 0.6 };
          if (centers.every((o, j) => j === i || !inDisc(p, o, R))) put(p);
        });
        [[0, 1, 2], [1, 2, 0], [0, 2, 1]].forEach(([i, j, k]) => {
          const m = { x: (centers[i].x + centers[j].x) / 2, y: (centers[i].y + centers[j].y) / 2 };
          let p = m;
          const dk = Math.hypot(m.x - centers[k].x, m.y - centers[k].y);
          if (dk <= R + 8 && dk > 1e-6) { const f = (R + 8) / dk; p = { x: centers[k].x + (m.x - centers[k].x) * f, y: centers[k].y + (m.y - centers[k].y) * f }; }
          if (inDisc(p, centers[i], R - 6) && inDisc(p, centers[j], R - 6) && !inDisc(p, centers[k], R)) put(p);
        });
        put({ x: cx, y: cy });
      }

      // ---------- scenes ----------
      function drawLights(g) {
        const G = lightsGeom(), { A, R, centers } = G, I = lightI();
        g.fillStyle = '#141418'; K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();
        g.save(); K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.clip(); g.globalCompositeOperation = 'lighter';
        centers.forEach((c, i) => {
          const col = [0, 0, 0]; col[i] = I[i];
          const dx = Math.cos(ANGS[i]), dy = Math.sin(ANGS[i]), lamp = toEdge(G.cx, G.cy, dx, dy, A, 14);
          g.fillStyle = css(col.map(v => v * 0.12)); g.beginPath(); g.moveTo(lamp.x, lamp.y);
          g.lineTo(c.x - dy * R, c.y + dx * R); g.lineTo(c.x + dy * R, c.y - dx * R); g.closePath(); g.fill();
          g.fillStyle = css(col); g.beginPath(); g.arc(c.x, c.y, R, 0, Math.PI * 2); g.fill();
        });
        g.restore();
        centers.forEach((c, i) => { // lamp icons on the stage border
          const col = [0, 0, 0]; col[i] = Math.max(0.25, I[i]);
          const lamp = toEdge(G.cx, G.cy, Math.cos(ANGS[i]), Math.sin(ANGS[i]), A, 14);
          g.fillStyle = '#3a3a40'; g.beginPath(); g.arc(lamp.x, lamp.y, 11, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#9a9aa5'; g.lineWidth = 1; g.stroke();
          g.fillStyle = css(col); g.beginPath(); g.arc(lamp.x, lamp.y, 6, 0, Math.PI * 2); g.fill();
        });
        labelDiscs(g, G, true);
      }
      function drawPaints(g) {
        const G = discGeom(false), { A, R, centers } = G, P = paintCols();
        g.fillStyle = '#ffffff'; K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 1; g.stroke();
        g.save(); K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.clip(); g.globalCompositeOperation = 'multiply';
        centers.forEach((c, i) => { g.fillStyle = css(P[i]); g.beginPath(); g.arc(c.x, c.y, R, 0, Math.PI * 2); g.fill(); });
        g.restore();
        g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 1; centers.forEach(c => { g.beginPath(); g.arc(c.x, c.y, R, 0, Math.PI * 2); g.stroke(); });
        labelDiscs(g, G, false);
        // result swatch: all three paints mixed
        const mix = [P[0][0], P[1][1], P[2][2]], sw = Math.min(110, A.aw * 0.22, A.ah * 0.5), sx = A.x + A.aw * 0.76 - sw / 2, sy = G.cy - sw / 2 - 10;
        g.fillStyle = css(mix); K.roundRect(g, sx, sy, sw, sw, 12); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.stroke();
        otext(g, K.tr(nameOf(mix), lang), sx + sw / 2, sy + sw / 2, 'bold 13px ' + theme.font);
        K.text(g, K.tr({ en: 'all three mixed', hr: 'sve tri pomiješane' }, lang), sx + sw / 2, sy - 6, { font: 'bold 12px ' + theme.font, color: '#222', align: 'center', baseline: 'bottom' });
        K.text(g, 'C ' + K.fmt(st.pa.c, 0, lang) + ' %  M ' + K.fmt(st.pa.m, 0, lang) + ' %  Y ' + K.fmt(st.pa.y, 0, lang) + ' %', sx + sw / 2, sy + sw + 6, { font: '11px ' + theme.font, color: '#444', align: 'center', baseline: 'top' });
      }
      function drawObject(g, id, x, baseY, s, color) {
        g.save(); g.fillStyle = color; g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 1;
        if (id === 'apple') {
          g.beginPath(); g.arc(x, baseY - s * 0.48, s * 0.46, 0, Math.PI * 2); g.fill(); g.stroke();
          g.strokeStyle = '#6b4a2b'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, baseY - s * 0.9); g.lineTo(x + s * 0.08, baseY - s * 1.12); g.stroke();
        } else if (id === 'leaf') {
          g.translate(x, baseY - s * 0.45); g.rotate(-0.5); g.beginPath(); g.ellipse(0, 0, s * 0.55, s * 0.26, 0, 0, Math.PI * 2); g.fill(); g.stroke();
          g.strokeStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.moveTo(-s * 0.5, 0); g.lineTo(s * 0.5, 0); g.stroke();
        } else if (id === 'ball') {
          g.beginPath(); g.arc(x, baseY - s * 0.46, s * 0.46, 0, Math.PI * 2); g.fill(); g.stroke();
          g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x - s * 0.16, baseY - s * 0.62, s * 0.13, 0, Math.PI * 2); g.fill();
        } else if (id === 'cup') {
          K.roundRect(g, x - s * 0.34, baseY - s * 0.7, s * 0.68, s * 0.7, s * 0.08); g.fill(); g.stroke();
          g.strokeStyle = color; g.lineWidth = s * 0.1; g.beginPath(); g.arc(x + s * 0.38, baseY - s * 0.38, s * 0.16, -Math.PI / 2, Math.PI / 2); g.stroke();
          g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 1; g.beginPath(); g.arc(x + s * 0.38, baseY - s * 0.38, s * 0.21, -Math.PI / 2, Math.PI / 2); g.stroke();
        } else {
          g.lineCap = 'round'; g.beginPath(); g.arc(x, baseY - s * 0.85, s * 0.5, Math.PI * 0.15, Math.PI * 0.85);
          g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = s * 0.22 + 2; g.stroke(); // pale outline first, so a black banana stays visible
          g.strokeStyle = color; g.lineWidth = s * 0.22; g.stroke();
        }
        g.restore();
      }
      function drawObjects(g) {
        const A = area(), L = st.ob.light.rgb, lx = A.x + A.aw / 2, ly = A.y + 20;
        g.fillStyle = '#141418'; K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();
        g.save(); K.roundRect(g, A.x, A.y, A.aw, A.ah, 10); g.clip(); g.globalCompositeOperation = 'lighter';
        g.fillStyle = css(L.map(v => v * 0.1)); g.beginPath(); g.moveTo(lx, ly); g.lineTo(A.x, A.y + A.ah); g.lineTo(A.x + A.aw, A.y + A.ah); g.closePath(); g.fill();
        g.restore();
        g.fillStyle = '#3a3a40'; K.roundRect(g, lx - 28, ly - 14, 56, 18, 5); g.fill();
        g.fillStyle = css(L); g.beginPath(); g.arc(lx, ly + 8, 9, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#9a9aa5'; g.lineWidth = 1; g.stroke();
        otext(g, K.tr(st.ob.light.label, lang), lx + 40, ly, 'bold 12px ' + theme.font, 'left');
        const tableY = A.y + A.ah * 0.76;
        g.strokeStyle = '#555'; g.lineWidth = 2; g.beginPath(); g.moveTo(A.x + 10, tableY); g.lineTo(A.x + A.aw - 10, tableY); g.stroke();
        const n = OBJECTS.length, slot = (A.aw - 20) / n, size = Math.min(slot * 0.6, A.ah * 0.32), small = slot < 86;
        OBJECTS.forEach((o, i) => {
          const x = A.x + 10 + slot * (i + 0.5), seen = o.refl.map((r, k) => r * L[k]);
          drawObject(g, o.id, x, tableY - 2, size, css(seen));
          if (!small) otext(g, K.tr(o.name, lang), x, tableY + 13, '11px ' + theme.font);
          otext(g, K.tr({ en: 'looks ', hr: 'izgleda ' }, lang) + K.tr(nameOf(seen), lang), x, tableY + (small ? 14 : 28), 'bold ' + (small ? 10 : 11) + 'px ' + theme.font);
        });
      }
      function drawSpectrum(g) {
        const w = cv.w, h = cv.h, x0 = 44, x1 = w - 44, y = h - 46, sh = 22, n = Math.max(32, Math.floor((x1 - x0) / 2)), X = wl => x0 + (x1 - x0) * (wl - 380) / 320;
        for (let i = 0; i < n; i++) { g.fillStyle = css(wlColor(380 + 320 * i / n)); g.fillRect(x0 + (x1 - x0) * i / n, y, (x1 - x0) / n + 1, sh); }
        g.strokeStyle = theme.fg; g.lineWidth = 1; g.strokeRect(x0, y, x1 - x0, sh);
        K.text(g, K.tr({ en: 'visible spectrum (wavelength in nm)', hr: 'vidljivi spektar (valna duljina u nm)' }, lang), x0, y - 4, { font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'bottom' });
        g.strokeStyle = theme.muted; g.beginPath();
        for (let wl = 400; wl <= 700; wl += 50) { g.moveTo(X(wl), y + sh); g.lineTo(X(wl), y + sh + 4); } g.stroke();
        for (let wl = 400; wl <= 700; wl += 50) K.text(g, K.fmt(wl, 0, lang) + (wl === 700 ? ' nm' : ''), X(wl), y + sh + 5, { font: '10px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        const bands = [[380, 450, { en: 'violet', hr: 'ljubičasta' }, 520], [450, 495, { en: 'blue', hr: 'plava' }, 520], [495, 570, { en: 'green', hr: 'zelena' }, 520],
          [570, 590, { en: 'yellow', hr: 'žuta' }, 780], [590, 620, { en: 'orange', hr: 'narančasta' }, 780], [620, 700, { en: 'red', hr: 'crvena' }, 520]];
        bands.forEach(b => { if (w >= b[3]) otext(g, K.tr(b[2], lang), X((b[0] + b[1]) / 2), y + sh / 2, '10px ' + theme.font); });
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        K.text(g, K.tr(HEADS[st.mode], lang), 10, 16, { font: 'bold ' + (w < 480 ? 11 : 13) + 'px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
        if (st.mode === 'lights') drawLights(g); else if (st.mode === 'paints') drawPaints(g); else drawObjects(g);
        drawSpectrum(g);
      }

      cv.onResize(draw);
      applyMode(); update();

      return {
        destroy() { cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); update(); },
        setTheme(t) { theme = t; draw(); },
        reset: resetMode
      };
    }
  });
})();
