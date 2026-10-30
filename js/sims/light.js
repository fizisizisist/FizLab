/* FizLab sim: Light rays — (a) reflection in a flat mirror with a virtual image, (b) refraction by Snell's law and total internal
   reflection, (c) shadows from a point or extended lamp (umbra / penumbra), (d) dispersion in a glass prism. Static scenes, drag to explore. */
(function () {
  'use strict';
  const K = window.SimKit;
  const DEG = Math.PI / 180;
  const MEDIA = [
    { id: 'water', n: 1.33, label: { en: 'Water (n = 1.33)', hr: 'Voda (n = 1,33)' }, name: { en: 'water', hr: 'voda' } },
    { id: 'glass', n: 1.5, label: { en: 'Glass (n = 1.5)', hr: 'Staklo (n = 1,5)' }, name: { en: 'glass', hr: 'staklo' } },
    { id: 'diamond', n: 2.42, label: { en: 'Diamond (n = 2.42)', hr: 'Dijamant (n = 2,42)' }, name: { en: 'diamond', hr: 'dijamant' } },
    { id: 'air', n: 1.0, label: { en: 'Air (n = 1.0)', hr: 'Zrak (n = 1,0)' }, name: { en: 'air', hr: 'zrak' } }
  ];
  // Physical spectrum colours (literals are allowed for real colours); n of glass per colour, red → violet.
  const SPECTRUM = [
    { c: '#ff2b2b', n: 1.510, name: { en: 'red', hr: 'crvena' } }, { c: '#ff8a00', n: 1.513 }, { c: '#ffd400', n: 1.516 },
    { c: '#2ec84a', n: 1.519 }, { c: '#1e90ff', n: 1.523 }, { c: '#4040d0', n: 1.527 }, { c: '#9b30d0', n: 1.530, name: { en: 'violet', hr: 'ljubičasta' } }
  ];
  const EXAG = 6;      // dispersion exaggeration factor (stated on canvas and in the note)
  const WALL = 3.6;    // m, position of the wall in the shadow scene
  const NOTES = {
    mirror: { en: 'Law of reflection: the angle of reflection equals the angle of incidence (both measured from the normal, the dashed line). The image in a flat mirror is as far behind the mirror as the object is in front of it.',
      hr: 'Zakon odbijanja: kut odbijanja jednak je upadnom kutu (oba se mjere od okomice, crtkane linije). Slika u ravnom zrcalu jednako je daleko iza zrcala koliko je predmet ispred njega.' },
    refr: { en: 'Snell\'s law: n₁·sin θ₁ = n₂·sin θ₂. Light slows down in water or glass, so it bends toward the normal. Going out it bends away from the normal — and past the critical angle it cannot leave at all.',
      hr: 'Snellov zakon: n₁·sin θ₁ = n₂·sin θ₂. U vodi ili staklu svjetlost se usporava pa se lomi prema okomici. Pri izlasku lomi se od okomice — a iznad graničnog kuta uopće ne može izaći.' },
    shadow: { en: 'Light travels in straight lines, so the shadow is bigger than the object: shadow / object = b / a (similar triangles). A wide lamp gives a fuzzy edge, the penumbra.',
      hr: 'Svjetlost putuje pravocrtno, zato je sjena veća od predmeta: sjena / predmet = b / a (slični trokuti). Širok izvor daje mutan rub, polusjenu.' },
    prism: { en: 'Glass bends violet light a little more than red (its n is slightly larger), so white light fans out into a spectrum. The spread is exaggerated 6× here so you can see it.',
      hr: 'Staklo lomi ljubičastu svjetlost malo jače od crvene (ima malo veći n), pa se bijela svjetlost rasipa u spektar. Rasap je ovdje uvećan 6× da bi se vidio.' }
  };
  const HINTS = {
    mirror: { en: 'Drag the flashlight or the point on the mirror.', hr: 'Povuci svjetiljku ili točku na zrcalu.' },
    refr: { en: 'Drag anywhere to aim the incoming ray, or use the slider.', hr: 'Povuci bilo gdje da usmjeriš upadnu zraku ili koristi klizač.' },
    shadow: { en: 'Drag the lamp and the object.', hr: 'Povuci lampu i predmet.' },
    prism: { en: 'Change the angle of the white beam with the slider.', hr: 'Mijenjaj kut bijelog snopa klizačem.' }
  };

  window.Sims.register({
    id: 'light',
    title: { en: 'Light Rays', hr: 'Zrake svjetlosti' },
    summary: {
      en: 'Bounce a ray off a mirror, bend it into water or glass, make shadows with a lamp, and split white light with a prism.',
      hr: 'Odbij zraku od zrcala, lomi je u vodi ili staklu, pravi sjene lampom i razloži bijelu svjetlost prizmom.'
    },
    tasks: [
      { en: 'Mirror: drag the flashlight. Compare the angle of incidence α with the angle of reflection β. Is this always true?', hr: 'Zrcalo: povuci svjetiljku. Usporedi upadni kut α i kut odbijanja β. Vrijedi li to uvijek?' },
      { en: 'Refraction: set 45° and switch water → glass → diamond. Which bends the light most? Then let light go OUT of the medium and find the angle where it cannot escape.', hr: 'Lom: postavi 45° i mijenjaj voda → staklo → dijamant. Što najjače lomi svjetlost? Zatim pusti svjetlost IZ sredstva i nađi kut pri kojem ne može izaći.' },
      { en: 'Shadows: move the lamp closer to the object. Does the shadow on the wall grow or shrink? Check shadow / object = b / a.', hr: 'Sjene: približi lampu predmetu. Raste li sjena na zidu ili se smanjuje? Provjeri sjena / predmet = b / a.' },
      { en: 'Prism: which colour bends the most, red or violet?', hr: 'Prizma: koja se boja najjače lomi, crvena ili ljubičasta?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 260, maxHeight: 460 });
      const C = K.controls(container, lang);
      const st = {
        mode: 'mirror', drag: null,
        mir: { sx: 0.28, sy: 0.3, px: 0.5, candle: true },           // fractions of the canvas
        ref: { theta: 40, med: MEDIA[0], reverse: false },
        sh: { lx: 0.4, ly: 1.1, ox: 1.6, oy: 1.1, oh: 0.5, ext: false }, // metres
        pr: { theta: 45 }
      };

      // ---------- controls ----------
      C.segmented({ label: { en: 'Mode', hr: 'Način rada' }, options: [
        { value: 'mirror', label: { en: 'Mirror', hr: 'Zrcalo' } }, { value: 'refr', label: { en: 'Refraction', hr: 'Lom svjetlosti' } },
        { value: 'shadow', label: { en: 'Shadows', hr: 'Sjene' } }, { value: 'prism', label: { en: 'Prism', hr: 'Prizma' } }], value: 'mirror', onChange: setMode });
      const tgCandle = C.toggle({ label: { en: 'Show a candle and its image', hr: 'Pokaži svijeću i njezinu sliku' }, value: true, onChange: v => { st.mir.candle = v; update(); } });
      const outInc = C.readout({ label: { en: 'Angle of incidence α', hr: 'Upadni kut α' }, unit: '°', digits: 0 });
      const outRefl = C.readout({ label: { en: 'Angle of reflection β', hr: 'Kut odbijanja β' }, unit: '°', digits: 0 });
      const selMed = C.select({ label: { en: 'Lower medium', hr: 'Donje sredstvo' }, options: MEDIA.map(m => ({ value: m.id, label: m.label })), value: 'water',
        onChange: v => { st.ref.med = MEDIA.find(m => m.id === v); update(); } });
      const slTheta = C.slider({ label: { en: 'Angle of incidence θ₁', hr: 'Upadni kut θ₁' }, min: 0, max: 89, step: 1, value: 40, unit: '°', digits: 0, onChange: v => { st.ref.theta = v; update(); } });
      const tgRev = C.toggle({ label: { en: 'Light goes from the medium into air', hr: 'Svjetlost ide iz sredstva u zrak' }, value: false, onChange: v => { st.ref.reverse = v; update(); } });
      const outT1 = C.readout({ label: { en: 'Angle of incidence θ₁', hr: 'Upadni kut θ₁' }, unit: '°', digits: 0 });
      const outT2 = C.readout({ label: { en: 'Angle of refraction θ₂', hr: 'Kut loma θ₂' }, unit: '', digits: 1 });
      const outN = C.readout({ label: { en: 'Refractive index n', hr: 'Indeks loma n' }, unit: '', digits: 2 });
      const slOH = C.slider({ label: { en: 'Object height h', hr: 'Visina predmeta h' }, min: 0.1, max: 1, step: 0.05, value: 0.5, unit: 'm', digits: 2, onChange: v => { st.sh.oh = v; clampShadow(); update(); } });
      const tgExt = C.toggle({ label: { en: 'Extended lamp (two sources)', hr: 'Prošireni izvor (dva izvora)' }, value: false, onChange: v => { st.sh.ext = v; update(); } });
      const outOH = C.readout({ label: { en: 'Object height h', hr: 'Visina predmeta h' }, unit: 'm', digits: 2 });
      const outSH = C.readout({ label: { en: 'Shadow height (umbra)', hr: 'Visina sjene (potpune)' }, unit: 'm', digits: 2 });
      const outA = C.readout({ label: { en: 'Lamp → object a', hr: 'Lampa → predmet a' }, unit: 'm', digits: 2 });
      const outB = C.readout({ label: { en: 'Lamp → wall b', hr: 'Lampa → zid b' }, unit: 'm', digits: 2 });
      const slPr = C.slider({ label: { en: 'Angle of incidence', hr: 'Upadni kut' }, min: 0, max: 75, step: 1, value: 45, unit: '°', digits: 0, onChange: v => { st.pr.theta = v; update(); } });
      const outDev = C.readout({ label: { en: 'Deviation of the green ray', hr: 'Otklon zelene zrake' }, unit: '°', digits: 1 });
      const outSpread = C.readout({ label: { en: 'Spread red → violet (×6)', hr: 'Rasap crvena → ljubičasta (×6)' }, unit: '°', digits: 1 });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => { resetMode(); } });
      const note = C.note({ text: NOTES.mirror });
      const GROUPS = { mirror: [tgCandle, outInc, outRefl], refr: [selMed, slTheta, tgRev, outT1, outT2, outN],
        shadow: [slOH, tgExt, outOH, outSH, outA, outB], prism: [slPr, outDev, outSpread] };

      function fieldOf(c) { const e = c.el; return (e.classList.contains('sk-field') || e.classList.contains('sk-note')) ? e : e.parentElement; }
      function show(c, on) { fieldOf(c).style.display = on ? '' : 'none'; }
      function applyMode() { Object.keys(GROUPS).forEach(m => GROUPS[m].forEach(c => show(c, m === st.mode))); }
      function setMode(v) { st.mode = v; st.drag = null; applyMode(); update(); }
      function resetMode() {
        if (st.mode === 'mirror') { st.mir = { sx: 0.28, sy: 0.3, px: 0.5, candle: true }; tgCandle.set(true); }
        else if (st.mode === 'refr') { st.ref = { theta: 40, med: MEDIA[0], reverse: false }; slTheta.set(40); selMed.set('water'); tgRev.set(false); }
        else if (st.mode === 'shadow') { st.sh = { lx: 0.4, ly: 1.1, ox: 1.6, oy: 1.1, oh: 0.5, ext: false }; slOH.set(0.5); tgExt.set(false); clampShadow(); }
        else { st.pr = { theta: 45 }; slPr.set(45); }
        update();
      }

      // ---------- geometry helpers ----------
      const ang = (a, b) => Math.acos(K.clamp(a.x * b.x + a.y * b.y, -1, 1)) / DEG;
      function refract(d, n, eta) { // d: unit direction, n: unit normal pointing against d, eta = n1/n2; null on total internal reflection
        const cosI = -(d.x * n.x + d.y * n.y), k = 1 - eta * eta * (1 - cosI * cosI);
        if (k < 0) return null;
        const f = eta * cosI - Math.sqrt(k);
        return { x: eta * d.x + f * n.x, y: eta * d.y + f * n.y };
      }
      function reflect(d, n) { const dot = d.x * n.x + d.y * n.y; return { x: d.x - 2 * dot * n.x, y: d.y - 2 * dot * n.y }; }
      function segHit(p, d, seg) { // ray p + t·d against segment seg[0]–seg[1]
        const ex = seg[1].x - seg[0].x, ey = seg[1].y - seg[0].y, den = d.x * ey - d.y * ex;
        if (Math.abs(den) < 1e-9) return null;
        const wx = seg[0].x - p.x, wy = seg[0].y - p.y, t = (wx * ey - wy * ex) / den, u = (wx * d.y - wy * d.x) / den;
        if (t < 1e-6 || u < -1e-6 || u > 1 + 1e-6) return null;
        return { t, q: { x: p.x + d.x * t, y: p.y + d.y * t } };
      }
      function exitT(p, d, w, h) { // distance along d to the canvas border
        let t = 1e9;
        if (d.x > 1e-9) t = Math.min(t, (w - p.x) / d.x); else if (d.x < -1e-9) t = Math.min(t, -p.x / d.x);
        if (d.y > 1e-9) t = Math.min(t, (h - p.y) / d.y); else if (d.y < -1e-9) t = Math.min(t, -p.y / d.y);
        return t;
      }
      function mirrorGeom() {
        const w = cv.w, h = cv.h, my = h - 78, mx0 = 30, mx1 = w - 30;
        const S = { x: st.mir.sx * w, y: st.mir.sy * h }, P = { x: K.clamp(st.mir.px * w, mx0 + 10, mx1 - 10), y: my };
        return { w, h, my, mx0, mx1, S, P, alpha: Math.atan2(Math.abs(P.x - S.x), Math.abs(P.y - S.y)) / DEG };
      }
      function refrO() { return { x: cv.w / 2, y: cv.h * 0.52 }; }
      function refrCalc() {
        const m = st.ref.med, rev = st.ref.reverse, n1 = rev ? m.n : 1, n2 = rev ? 1 : m.n;
        const th1 = st.ref.theta * DEG, s2 = n1 * Math.sin(th1) / n2, tir = s2 > 1;
        return { m, rev, n1, n2, th1, tir, th2: tir ? null : Math.asin(s2), crit: n1 > n2 ? Math.asin(n2 / n1) : null };
      }
      function shGeom() {
        const w = cv.w, h = cv.h, floorY = h - 44, x0 = 12, pxm = Math.min((w - 24) / 4.0, (floorY - 12) / 2.3);
        return { w, h, floorY, x0, pxm, Hm: (floorY - 12) / pxm, X: m => x0 + m * pxm, Y: m => floorY - m * pxm };
      }
      function clampShadow() {
        const s = st.sh, Hm = shGeom().Hm;
        s.ox = K.clamp(s.ox, 0.6, WALL - 0.3); s.lx = K.clamp(s.lx, 0.1, s.ox - 0.3);
        s.ly = K.clamp(s.ly, 0.15, Hm - 0.15); s.oy = K.clamp(s.oy, s.oh / 2 + 0.05, Hm - s.oh / 2 - 0.05);
      }
      function shadowOf(L) { // where the rays through the object's top and bottom hit the wall (heights in m)
        const s = st.sh, a = s.ox - L.x, b = WALL - L.x;
        return { top: L.y + (s.oy + s.oh / 2 - L.y) * b / a, bot: L.y + (s.oy - s.oh / 2 - L.y) * b / a, a, b };
      }
      function shSources() { const s = st.sh; return s.ext ? [{ x: s.lx, y: s.ly + 0.12 }, { x: s.lx, y: s.ly - 0.12 }] : [{ x: s.lx, y: s.ly }]; }
      function umbraHeight(shs) { return Math.max(0, Math.min(...shs.map(q => q.top)) - Math.max(...shs.map(q => q.bot))); }
      function prismGeom() {
        const w = cv.w, h = cv.h, R = Math.min(w, h) * 0.3, cx = w * 0.5, cy = h * 0.5 + R * 0.1;
        return { w, h, R, V: [{ x: cx, y: cy - R }, { x: cx - R * 0.866, y: cy + R * 0.5 }, { x: cx + R * 0.866, y: cy + R * 0.5 }] };
      }
      function outward(seg, V) { // unit normal of a prism edge pointing away from the centroid
        const ex = seg[1].x - seg[0].x, ey = seg[1].y - seg[0].y, L = Math.hypot(ex, ey) || 1;
        let n = { x: ey / L, y: -ex / L };
        const cx = (V[0].x + V[1].x + V[2].x) / 3, cy = (V[0].y + V[1].y + V[2].y) / 3, mx = (seg[0].x + seg[1].x) / 2 - cx, my = (seg[0].y + seg[1].y) / 2 - cy;
        if (n.x * mx + n.y * my < 0) n = { x: -n.x, y: -n.y };
        return n;
      }
      const nEff = c => 1.52 + (c.n - 1.52) * EXAG;
      function trace(n) { // white beam enters the left face; returns the polyline inside and the exit direction
        const { V } = prismGeom(), edges = [[V[0], V[1]], [V[1], V[2]], [V[2], V[0]]];
        const E = { x: V[0].x + (V[1].x - V[0].x) * 0.55, y: V[0].y + (V[1].y - V[0].y) * 0.55 };
        const nOut = outward(edges[0], V), nin = { x: -nOut.x, y: -nOut.y }, th = -st.pr.theta * DEG;
        const d = { x: nin.x * Math.cos(th) - nin.y * Math.sin(th), y: nin.x * Math.sin(th) + nin.y * Math.cos(th) };
        const pts = [E];
        let dir = refract(d, nOut, 1 / n), p = E, last = 0;
        if (!dir) return { E, d, pts, out: null };
        for (let it = 0; it < 4; it++) {
          let best = null;
          for (let e = 0; e < 3; e++) { if (e === last) continue; const hit = segHit(p, dir, edges[e]); if (hit && (!best || hit.t < best.t)) best = { t: hit.t, e, q: hit.q }; }
          if (!best) break;
          pts.push(best.q); p = best.q; last = best.e;
          const no = outward(edges[best.e], V), t = refract(dir, { x: -no.x, y: -no.y }, n);
          if (t) return { E, d, pts, out: t };
          dir = reflect(dir, no);
        }
        return { E, d, pts, out: null };
      }

      // ---------- readouts ----------
      function update() {
        if (st.mode === 'mirror') { const a = mirrorGeom().alpha; outInc.set(a); outRefl.set(a); }
        else if (st.mode === 'refr') {
          const r = refrCalc(); outT1.set(st.ref.theta); outN.set(r.m.n);
          outT2.set(r.tir ? { en: 'total internal reflection', hr: 'potpuno odbijanje' } : K.fmt(r.th2 / DEG, 1, lang) + '°');
        } else if (st.mode === 'shadow') {
          const shs = shSources().map(shadowOf), s = st.sh;
          outOH.set(s.oh); outSH.set(umbraHeight(shs)); outA.set(s.ox - s.lx); outB.set(WALL - s.lx);
        } else {
          const tr = SPECTRUM.map(c => trace(nEff(c))), gr = tr[3], rd = tr[0], vi = tr[6];
          outDev.set(gr.out ? ang(gr.d, gr.out) : null); outSpread.set(rd.out && vi.out ? ang(rd.out, vi.out) : null);
        }
        note.set(NOTES[st.mode]); draw();
      }

      // ---------- drawing helpers ----------
      function ray(g, x1, y1, x2, y2, color, width, alpha) {
        g.save(); if (alpha !== undefined) g.globalAlpha = alpha; g.lineCap = 'round';
        g.strokeStyle = theme.fg; g.lineWidth = width + 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.strokeStyle = color; g.lineWidth = width; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.restore();
      }
      function dashed(g, x1, y1, x2, y2, color) { g.save(); g.setLineDash([5, 5]); g.strokeStyle = color; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
      function angleArc(g, cx, cy, r, a0, a1, label) { // arc between two directions (canvas radians), label in the middle
        let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        g.save(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, r, a0, a0 + d, d < 0); g.stroke(); g.restore();
        const am = a0 + d / 2;
        K.text(g, label, cx + Math.cos(am) * (r + 18), cy + Math.sin(am) * (r + 18), { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
      }
      function dim(g, x1, x2, y, label) { // dimension line with two arrow heads
        K.arrow(g, x1, y, x2, y, { color: theme.fg, width: 1.5, head: 7 }); K.arrow(g, x2, y, x1, y, { color: theme.fg, width: 1.5, head: 7 });
        K.text(g, label, (x1 + x2) / 2, y - 3, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
      }
      function drawCandle(g, x, baseY, ch, mirrored) {
        const s = mirrored ? -1 : 1, bodyH = ch * 0.7, top = mirrored ? baseY : baseY - bodyH;
        g.save(); if (mirrored) { g.globalAlpha = 0.5; g.setLineDash([4, 3]); }
        g.fillStyle = theme.surface; g.strokeStyle = theme.fg; g.lineWidth = 1.5;
        g.fillRect(x - 9, top, 18, bodyH); g.strokeRect(x - 9, top, 18, bodyH);
        g.beginPath(); g.moveTo(x, baseY - s * bodyH); g.lineTo(x, baseY - s * (bodyH + 6)); g.stroke();
        g.fillStyle = theme.c4; g.beginPath(); g.ellipse(x, baseY - s * (bodyH + 14), 6, 9, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.restore();
      }
      function header(g, w) {
        K.text(g, K.tr(HINTS[st.mode], lang), 12, 16, { font: (w < 480 ? 11 : 12) + 'px ' + theme.font, color: theme.muted, baseline: 'middle' });
      }

      // ---------- scenes ----------
      function drawMirror(g) {
        const { w, h, my, mx0, mx1, S, P, alpha } = mirrorGeom();
        g.fillStyle = theme.surface2; g.fillRect(0, my, w, h - my);
        g.strokeStyle = K.withAlpha(theme.fg, 0.2); g.lineWidth = 1; g.beginPath();
        for (let x = mx0; x < mx1; x += 12) { g.moveTo(x, my); g.lineTo(x - 8, my + 10); } g.stroke();
        g.strokeStyle = theme.c3; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx0, my); g.lineTo(mx1, my); g.stroke();
        K.text(g, K.tr({ en: 'flat mirror', hr: 'ravno zrcalo' }, lang), mx0, my + 14, { font: '11px ' + theme.font, color: theme.muted, baseline: 'top' });
        const nTop = my - Math.min(170, my - 24);
        dashed(g, P.x, nTop, P.x, my + 40, theme.muted);
        K.text(g, K.tr({ en: 'normal', hr: 'okomica' }, lang), P.x + 6, nTop, { font: '11px ' + theme.font, color: theme.muted, baseline: 'top' });
        const dx = P.x - S.x, dy = P.y - S.y, len = Math.hypot(dx, dy) || 1, d = { x: dx / len, y: dy / len }, r = { x: d.x, y: -d.y }, far = w + h;
        ray(g, S.x, S.y, P.x, P.y, theme.c4, 3);
        ray(g, P.x, P.y, P.x + r.x * far, P.y + r.y * far, theme.c4, 3);
        K.arrow(g, S.x + d.x * len * 0.5, S.y + d.y * len * 0.5, S.x + d.x * len * 0.6, S.y + d.y * len * 0.6, { color: theme.fg, width: 2, head: 9 });
        K.arrow(g, P.x + r.x * len * 0.5, P.y + r.y * len * 0.5, P.x + r.x * len * 0.6, P.y + r.y * len * 0.6, { color: theme.fg, width: 2, head: 9 });
        if (alpha > 3) {
          angleArc(g, P.x, P.y, 44, -Math.PI / 2, Math.atan2(S.y - P.y, S.x - P.x), 'α = ' + K.fmt(alpha, 0, lang) + '°');
          angleArc(g, P.x, P.y, 44, -Math.PI / 2, Math.atan2(r.y, r.x), 'β = ' + K.fmt(alpha, 0, lang) + '°');
        }
        g.fillStyle = theme.fg; g.beginPath(); g.arc(P.x, P.y, 4, 0, Math.PI * 2); g.fill();
        // flashlight
        g.save(); g.translate(S.x, S.y); g.rotate(Math.atan2(d.y, d.x));
        g.fillStyle = theme.muted; g.strokeStyle = theme.fg; g.lineWidth = 1.5; K.roundRect(g, -44, -8, 34, 16, 5); g.fill(); g.stroke();
        g.fillStyle = theme.c4; g.beginPath(); g.moveTo(-12, -8); g.lineTo(0, -12); g.lineTo(0, 12); g.lineTo(-12, 8); g.closePath(); g.fill(); g.stroke();
        g.restore();
        K.text(g, K.tr({ en: 'flashlight', hr: 'svjetiljka' }, lang), S.x, S.y - 20, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
        // eye where the reflected ray comes back up to the flashlight's height
        if (alpha > 3 && r.y < -0.05) {
          const ex = P.x + r.x * ((S.y - P.y) / r.y);
          if (ex < w - 24) {
            g.strokeStyle = theme.fg; g.lineWidth = 2; g.fillStyle = theme.surface; g.beginPath(); g.ellipse(ex, S.y, 14, 8, 0, 0, Math.PI * 2); g.fill(); g.stroke();
            g.fillStyle = theme.fg; g.beginPath(); g.arc(ex, S.y, 4, 0, Math.PI * 2); g.fill();
            K.text(g, K.tr({ en: 'eye', hr: 'oko' }, lang), ex, S.y - 14, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'bottom' });
          }
        }
        if (st.mir.candle) {
          const cx = Math.min(w - 60, Math.max(mx0 + 40, w * 0.8)), ch = Math.min(56, my - 40);
          drawCandle(g, cx, my, ch, false); drawCandle(g, cx, my, ch, true);
          dashed(g, cx + 22, my - ch, cx + 22, my + ch, theme.muted);
          K.text(g, 'd', cx + 28, my - ch / 2, { font: 'italic 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
          K.text(g, 'd', cx + 28, my + ch / 2, { font: 'italic 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
          K.text(g, K.tr({ en: 'virtual image', hr: 'virtualna (prividna) slika' }, lang), cx, my + ch + 4, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        }
        header(g, w);
        K.text(g, 'α = β', 12, 38, { font: 'bold 15px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
      }
      function drawRefr(g) {
        const w = cv.w, h = cv.h, O = refrO(), { m, th2, tir, crit, rev } = refrCalc(), s = rev ? -1 : 1, far = w + h, th1 = st.ref.theta * DEG;
        g.fillStyle = K.withAlpha(theme.water, K.clamp(0.2 + (m.n - 1) * 0.35, 0.12, 0.8)); g.fillRect(0, O.y, w, h - O.y);
        g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, O.y); g.lineTo(w, O.y); g.stroke();
        K.text(g, K.tr({ en: 'air', hr: 'zrak' }, lang) + '   n = ' + K.fmt(1, 2, lang), 12, O.y - 10, { font: 'bold 13px ' + theme.font, color: theme.fg, baseline: 'bottom' });
        K.text(g, K.tr(m.name, lang) + '   n = ' + K.fmt(m.n, 2, lang), 12, O.y + 10, { font: 'bold 13px ' + theme.font, color: theme.fg, baseline: 'top' });
        dashed(g, O.x, 24, O.x, h - 12, theme.muted);
        K.text(g, K.tr({ en: 'normal', hr: 'okomica' }, lang), O.x + 6, 26, { font: '11px ' + theme.font, color: theme.muted, baseline: 'top' });
        const d = { x: Math.sin(th1), y: s * Math.cos(th1) }, refl = { x: d.x, y: -d.y };
        ray(g, O.x, O.y, O.x + refl.x * far, O.y + refl.y * far, theme.c4, tir ? 3 : 2, tir ? 1 : 0.35);
        if (!tir) { const t = { x: Math.sin(th2), y: s * Math.cos(th2) }; ray(g, O.x, O.y, O.x + t.x * far, O.y + t.y * far, theme.c4, 3); }
        ray(g, O.x - d.x * far, O.y - d.y * far, O.x, O.y, theme.c4, 3);
        K.arrow(g, O.x - d.x * 100, O.y - d.y * 100, O.x - d.x * 78, O.y - d.y * 78, { color: theme.fg, width: 2, head: 9 });
        if (st.ref.theta > 2) angleArc(g, O.x, O.y, 48, Math.atan2(-s, 0), Math.atan2(-d.y, -d.x), 'θ₁ = ' + K.fmt(st.ref.theta, 0, lang) + '°');
        if (!tir && th2 > 2 * DEG) angleArc(g, O.x, O.y, 48, Math.atan2(s, 0), Math.atan2(s * Math.cos(th2), Math.sin(th2)), 'θ₂ = ' + K.fmt(th2 / DEG, 1, lang) + '°');
        if (tir) K.text(g, K.tr({ en: 'total internal reflection', hr: 'potpuno odbijanje (totalna refleksija)' }, lang), O.x + 16, O.y - s * 56, { font: 'bold 13px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(g, 'n₁ · sin θ₁ = n₂ · sin θ₂', w - 12, 16, { font: 'bold 14px ' + theme.fontDisplay, color: theme.fg, align: 'right', baseline: 'middle' });
        if (crit !== null) K.text(g, K.tr({ en: 'critical angle', hr: 'granični kut' }, lang) + ' θc = ' + K.fmt(crit / DEG, 1, lang) + '°', w - 12, 36, { font: '12px ' + theme.font, color: theme.muted, align: 'right', baseline: 'middle' });
        header(g, w);
      }
      function drawShadow(g) {
        const G = shGeom(), { w, h, floorY, pxm, X, Y, Hm } = G, s = st.sh;
        const wallX = X(WALL), wallW = 0.14 * pxm, topY = Y(Hm) - 4, sources = shSources(), shs = sources.map(shadowOf);
        g.fillStyle = theme.ground; g.fillRect(0, floorY, w, h - floorY);
        g.save(); g.beginPath(); g.rect(0, topY, wallX, floorY - topY); g.clip();
        sources.forEach((L, i) => {
          g.fillStyle = K.withAlpha(theme.c4, s.ext ? 0.08 : 0.14); g.fillRect(X(L.x), topY, wallX - X(L.x), floorY - topY);
          g.fillStyle = K.withAlpha(theme.fg, s.ext ? 0.2 : 0.38); g.beginPath();
          g.moveTo(X(s.ox), Y(s.oy + s.oh / 2)); g.lineTo(wallX, Y(shs[i].top)); g.lineTo(wallX, Y(shs[i].bot)); g.lineTo(X(s.ox), Y(s.oy - s.oh / 2)); g.closePath(); g.fill();
        });
        g.restore();
        g.fillStyle = theme.surface2; g.fillRect(wallX, topY, wallW, floorY - topY);
        g.save(); g.beginPath(); g.rect(wallX - 3, topY, wallW + 3, floorY - topY); g.clip();
        shs.forEach(q => { g.fillStyle = K.withAlpha(theme.fg, s.ext ? 0.28 : 0.5); g.fillRect(wallX - 3, Y(q.top), wallW + 3, Y(q.bot) - Y(q.top)); });
        g.restore();
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.strokeRect(wallX, topY, wallW, floorY - topY);
        K.text(g, K.tr({ en: 'wall', hr: 'zid' }, lang), wallX + wallW + 4, topY + 4, { font: '11px ' + theme.font, color: theme.muted, baseline: 'top' });
        sources.forEach((L, i) => { ray(g, X(L.x), Y(L.y), wallX, Y(shs[i].top), theme.c4, 1.5, s.ext ? 0.6 : 1); ray(g, X(L.x), Y(L.y), wallX, Y(shs[i].bot), theme.c4, 1.5, s.ext ? 0.6 : 1); });
        // object (opaque card)
        g.fillStyle = theme.c7; g.strokeStyle = theme.fg; g.lineWidth = 1.5;
        g.fillRect(X(s.ox) - 5, Y(s.oy + s.oh / 2), 10, s.oh * pxm); g.strokeRect(X(s.ox) - 5, Y(s.oy + s.oh / 2), 10, s.oh * pxm);
        K.text(g, K.tr({ en: 'object', hr: 'predmet' }, lang) + '  h = ' + K.fmt(s.oh, 2, lang) + ' m', X(s.ox), Y(s.oy + s.oh / 2) - 8, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        // lamp
        if (s.ext) { g.strokeStyle = theme.muted; g.lineWidth = 5; g.beginPath(); g.moveTo(X(s.lx), Y(s.ly + 0.12)); g.lineTo(X(s.lx), Y(s.ly - 0.12)); g.stroke(); }
        sources.forEach(L => { g.fillStyle = theme.c4; g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(X(L.x), Y(L.y), 9, 0, Math.PI * 2); g.fill(); g.stroke(); });
        K.text(g, K.tr({ en: 'lamp', hr: 'lampa' }, lang), X(s.lx), Y(s.ly) + (s.ext ? 0.12 * pxm : 0) + 14, { font: '11px ' + theme.font, color: theme.muted, align: 'center', baseline: 'top' });
        // dimensions and formula
        const a = s.ox - s.lx, b = WALL - s.lx, um = umbraHeight(shs);
        dim(g, X(s.lx), X(s.ox), floorY + 12, 'a = ' + K.fmt(a, 2, lang) + ' m');
        dim(g, X(s.lx), wallX, floorY + 32, 'b = ' + K.fmt(b, 2, lang) + ' m');
        const mid = K.clamp((Math.min(...shs.map(q => q.top)) + Math.max(...shs.map(q => q.bot))) / 2, 0.1, Hm - 0.1);
        K.text(g, K.tr({ en: 'shadow', hr: 'sjena' }, lang) + ' ' + K.fmt(um, 2, lang) + ' m', wallX - 10, Y(mid), { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        if (s.ext) K.text(g, K.tr({ en: 'penumbra (half shadow)', hr: 'polusjena' }, lang), wallX - 10, K.clamp(Y(Math.max(...shs.map(q => q.top))) - 10, topY + 10, floorY - 10), { font: '11px ' + theme.font, color: theme.fg, align: 'right', baseline: 'bottom' });
        header(g, w);
        K.text(g, K.tr({ en: 'shadow', hr: 'sjena' }, lang) + ' = h · b / a = ' + K.fmt(s.oh, 2, lang) + ' m · ' + K.fmt(b / a, 2, lang) + ' = ' + K.fmt(s.oh * b / a, 2, lang) + ' m', 12, 38,
          { font: 'bold ' + (w < 480 ? 12 : 14) + 'px ' + theme.fontDisplay, color: theme.fg, baseline: 'middle' });
      }
      function drawPrism(g) {
        const { w, h, R, V } = prismGeom(), far = w + h, traces = SPECTRUM.map(c => trace(nEff(c))), t0 = traces[0];
        g.fillStyle = K.withAlpha(theme.c1, 0.15); g.beginPath(); g.moveTo(V[0].x, V[0].y); g.lineTo(V[1].x, V[1].y); g.lineTo(V[2].x, V[2].y); g.closePath(); g.fill();
        g.strokeStyle = theme.fg; g.lineWidth = 2; g.stroke();
        K.text(g, K.tr({ en: 'glass prism', hr: 'staklena prizma' }, lang) + '  n ≈ ' + K.fmt(1.52, 2, lang), V[0].x, V[0].y - 8, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        // white beam (dark outline + white core so it reads in both themes)
        g.save(); g.lineCap = 'round'; g.beginPath(); g.moveTo(t0.E.x - t0.d.x * far, t0.E.y - t0.d.y * far); g.lineTo(t0.E.x, t0.E.y);
        g.strokeStyle = theme.fg; g.lineWidth = 7; g.stroke(); g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.stroke(); g.restore();
        const lx = t0.E.x - t0.d.x * R * 1.5, ly = t0.E.y - t0.d.y * R * 1.5;
        K.arrow(g, lx, ly, lx + t0.d.x * 26, ly + t0.d.y * 26, { color: theme.fg, width: 2, head: 9 });
        K.text(g, K.tr({ en: 'white light', hr: 'bijela svjetlost' }, lang), lx, ly - 14, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        // coloured rays: thin fg outline first, then the physical colours
        const poly = tr => { const p = tr.pts.slice(); if (tr.out) { const l = p[p.length - 1]; p.push({ x: l.x + tr.out.x * far, y: l.y + tr.out.y * far }); } return p; };
        g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
        [[theme.fg, 4.5, 0.5], [null, 2.5, 1]].forEach(([col, lw, al]) => {
          g.globalAlpha = al; g.lineWidth = lw;
          traces.forEach((tr, i) => { g.strokeStyle = col || SPECTRUM[i].c; g.beginPath(); poly(tr).forEach((q, j) => j ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y)); g.stroke(); });
        });
        g.restore();
        [0, 6].forEach(i => {
          const tr = traces[i]; if (!tr.out) return;
          const l = tr.pts[tr.pts.length - 1], t = exitT(l, tr.out, w, h);
          if (t > 60) K.text(g, K.tr(SPECTRUM[i].name, lang), l.x + tr.out.x * (t - 34), l.y + tr.out.y * (t - 34) + (i === 0 ? -13 : 13), { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        });
        if (!traces[3].out) K.text(g, K.tr({ en: 'the light is trapped: total internal reflection', hr: 'svjetlost je zarobljena: potpuno odbijanje' }, lang), w / 2, h - 24, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        header(g, w);
        K.text(g, K.tr({ en: 'dispersion exaggerated 6×', hr: 'rasap uvećan 6×' }, lang), w - 12, h - 8, { font: '11px ' + theme.font, color: theme.muted, align: 'right', baseline: 'bottom' });
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (st.mode === 'mirror') drawMirror(g); else if (st.mode === 'refr') drawRefr(g); else if (st.mode === 'shadow') drawShadow(g); else drawPrism(g);
      }

      // ---------- pointer ----------
      function hitTest(p) {
        if (st.mode === 'mirror') {
          const { S, P, my } = mirrorGeom();
          if (Math.hypot(p.x - S.x, p.y - S.y) < 30) return 'S';
          if (Math.abs(p.x - P.x) < 24 && Math.abs(p.y - my) < 24) return 'P';
          return null;
        }
        if (st.mode === 'refr') return 'theta';
        if (st.mode === 'shadow') {
          const G = shGeom(), s = st.sh;
          if (Math.hypot(p.x - G.X(s.lx), p.y - G.Y(s.ly)) < 28) return 'lamp';
          if (Math.abs(p.x - G.X(s.ox)) < 18 && p.y > G.Y(s.oy + s.oh / 2) - 12 && p.y < G.Y(s.oy - s.oh / 2) + 12) return 'obj';
        }
        return null;
      }
      function onDown(ev) {
        st.drag = hitTest(cv.pointer(ev));
        if (!st.drag) return;
        try { if (ev.pointerId !== undefined) cv.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        ev.preventDefault(); onMove(ev);
      }
      function onMove(ev) {
        const p = cv.pointer(ev), w = cv.w, h = cv.h;
        if (!st.drag) { const hit = hitTest(p); cv.canvas.style.cursor = hit === 'theta' ? 'crosshair' : (hit ? 'grab' : 'default'); return; }
        ev.preventDefault();
        if (st.drag === 'S') { const { my } = mirrorGeom(); st.mir.sx = K.clamp(p.x / w, 0.03, 0.97); st.mir.sy = K.clamp(p.y / h, 0.05, (my - 30) / h); }
        else if (st.drag === 'P') { const { mx0, mx1 } = mirrorGeom(); st.mir.px = K.clamp(p.x, mx0 + 10, mx1 - 10) / w; }
        else if (st.drag === 'theta') {
          const O = refrO(), dy = (O.y - p.y) * (st.ref.reverse ? -1 : 1);
          if (dy > 4) slTheta.set(Math.round(K.clamp(Math.atan2(Math.abs(p.x - O.x), dy) / DEG, 0, 89)), true);
          return;
        }
        else if (st.drag === 'lamp') { const G = shGeom(); st.sh.lx = (p.x - G.x0) / G.pxm; st.sh.ly = (G.floorY - p.y) / G.pxm; clampShadow(); }
        else if (st.drag === 'obj') { const G = shGeom(); st.sh.ox = (p.x - G.x0) / G.pxm; st.sh.oy = (G.floorY - p.y) / G.pxm; clampShadow(); }
        update();
      }
      function onUp() { st.drag = null; }
      cv.canvas.addEventListener('pointerdown', onDown);
      cv.canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      cv.onResize(() => { clampShadow(); update(); });
      applyMode(); clampShadow(); update();

      return {
        destroy() {
          cv.canvas.removeEventListener('pointerdown', onDown); cv.canvas.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); update(); },
        setTheme(t) { theme = t; draw(); },
        reset: resetMode
      };
    }
  });
})();
