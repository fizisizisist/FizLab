/* FizLab sim: Earth, Moon and Sun — day and night, Moon phases and the seasons (sizes and distances not to scale). */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2, DEG = 180 / Math.PI;
  const SUN = '#f6c445', SUN_EDGE = '#e8912a';          // fixed physical colours
  const MOON = '#d8d8d8', MOON_DARK = '#4a4f5a';
  const SYNODIC = 29.53;                                  // days, new moon to new moon
  const YEAR = 365.25;                                    // days
  const TILT = 23.44 / DEG;                               // axial tilt (rad)
  const LAT = 45.8 / DEG;                                 // latitude of Zagreb (rad)
  const MONTHS = [
    { en: 'January', hr: 'siječanj', gen: 'siječnja' }, { en: 'February', hr: 'veljača', gen: 'veljače' }, { en: 'March', hr: 'ožujak', gen: 'ožujka' },
    { en: 'April', hr: 'travanj', gen: 'travnja' }, { en: 'May', hr: 'svibanj', gen: 'svibnja' }, { en: 'June', hr: 'lipanj', gen: 'lipnja' },
    { en: 'July', hr: 'srpanj', gen: 'srpnja' }, { en: 'August', hr: 'kolovoz', gen: 'kolovoza' }, { en: 'September', hr: 'rujan', gen: 'rujna' },
    { en: 'October', hr: 'listopad', gen: 'listopada' }, { en: 'November', hr: 'studeni', gen: 'studenoga' }, { en: 'December', hr: 'prosinac', gen: 'prosinca' }
  ];
  const SEASONS = [{ en: 'winter', hr: 'zima' }, { en: 'spring', hr: 'proljeće' }, { en: 'summer', hr: 'ljeto' }, { en: 'autumn', hr: 'jesen' }];
  const KEYDATES = [{ en: 'Dec 21', hr: '21. 12.' }, { en: 'Mar 20', hr: '20. 3.' }, { en: 'Jun 21', hr: '21. 6.' }, { en: 'Sep 22', hr: '22. 9.' }];
  const PHASES = [
    { en: 'new moon', hr: 'mlađak' }, { en: 'waxing crescent', hr: 'rastući srp' }, { en: 'first quarter', hr: 'prva četvrt' }, { en: 'waxing gibbous', hr: 'rastući ispupčeni' },
    { en: 'full moon', hr: 'puni mjesec' }, { en: 'waning gibbous', hr: 'opadajući ispupčeni' }, { en: 'last quarter', hr: 'posljednja četvrt' }, { en: 'waning crescent', hr: 'opadajući srp' }
  ];
  // decorative "continents": [angle from the Zagreb meridian (rad), distance from the pole (0–1), size (0–1)]
  const LAND = [[0.05, 0.55, 0.26], [0.6, 0.3, 0.2], [-0.9, 0.62, 0.22], [1.7, 0.72, 0.17], [2.5, 0.45, 0.26], [3.4, 0.68, 0.16], [-2.1, 0.36, 0.22], [-1.5, 0.82, 0.13]];
  const norm = a => ((a % TAU) + TAU) % TAU;
  const pad2 = n => (n < 10 ? '0' : '') + n;

  window.Sims.register({
    id: 'space',
    title: { en: 'Earth, Moon and Sun', hr: 'Zemlja, Mjesec i Sunce' },
    summary: {
      en: 'Spin the Earth to see day and night in Zagreb, drag the Moon around its orbit to make its phases, and follow the tilted Earth around the Sun through the seasons.',
      hr: 'Zavrti Zemlju i gledaj dan i noć u Zagrebu, povuci Mjesec po stazi i stvaraj mijene te prati nagnutu Zemlju oko Sunca kroz godišnja doba.'
    },
    tasks: [
      { en: 'Day and night: drag the Earth so that Zagreb is at 12:00. Where is the Sun? Now turn it to midnight.', hr: 'Dan i noć: zavrti Zemlju tako da je u Zagrebu 12:00. Gdje je Sunce? Zatim je okreni na ponoć.' },
      { en: 'Moon phases: drag the Moon between the Earth and the Sun. What do we see from Earth? Why?', hr: 'Mjesečeve mijene: povuci Mjesec između Zemlje i Sunca. Što vidimo sa Zemlje? Zašto?' },
      { en: 'Find the full moon. Where is the Moon compared to the Sun then? How many days after new moon is that?', hr: 'Pronađi puni mjesec. Gdje je tada Mjesec u odnosu na Sunce? Koliko je to dana nakon mlađaka?' },
      { en: 'Seasons: watch the tilted axis. When does the northern half lean toward the Sun — and which season is that?', hr: 'Godišnja doba: prati nagnutu os. Kad je sjeverna polovica nagnuta prema Suncu — i koje je tada godišnje doba?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 500 });
      const C = K.controls(container, lang);

      const INIT = { rot: -TAU / 8, phi: 1.0, psi: 2.4 }; // 09:00 in Zagreb, a waxing crescent, early May
      const st = { mode: 'day', speed: 1, rot: INIT.rot, phi: INIT.phi, psi: INIT.psi, drag: null };
      let lay = {}; // layout of the last frame (for pointer hit tests)

      // ---------- controls ----------
      C.segmented({ label: { en: 'What to explore', hr: 'Što istražujemo' }, options: [
        { value: 'day', label: { en: 'Day and night', hr: 'Dan i noć' } },
        { value: 'moon', label: { en: 'Moon phases', hr: 'Mjesečeve mijene' } },
        { value: 'seasons', label: { en: 'Seasons', hr: 'Godišnja doba' } }], value: 'day',
        onChange: v => { st.mode = v; st.drag = null; applyMode(); refresh(); } });
      C.slider({ label: { en: 'Speed of time', hr: 'Brzina vremena' }, min: 0.25, max: 8, step: 0.25, value: 1, unit: '×', digits: 2, onChange: v => { st.speed = v; draw(); } });
      const btnPlay = C.button({ label: { en: 'Pause', hr: 'Pauza' }, variant: 'primary', onClick: () => { L.toggle(); updatePlay(); } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const outClock = C.readout({ label: { en: 'Local time in Zagreb', hr: 'Vrijeme u Zagrebu' } });
      const outDN = C.readout({ label: { en: 'Day or night?', hr: 'Dan ili noć?' } });
      const outPhase = C.readout({ label: { en: 'Moon phase', hr: 'Mjesečeva mijena' } });
      const outDay = C.readout({ label: { en: 'Day of the cycle (of 29.5)', hr: 'Dan ciklusa (od 29,5)' }, digits: 1 });
      const outLit = C.readout({ label: { en: 'Lit part we see', hr: 'Osvijetljeni dio' }, unit: '%', digits: 0 });
      const outSeason = C.readout({ label: { en: 'Season (northern half)', hr: 'Godišnje doba (sjever)' } });
      const outDate = C.readout({ label: { en: 'Date', hr: 'Datum' } });
      const outSunH = C.readout({ label: { en: 'Noon Sun height in Croatia', hr: 'Visina Sunca u podne (HR)' }, unit: '°', digits: 0 });
      const outDayLen = C.readout({ label: { en: 'Day length in Croatia', hr: 'Trajanje dana (HR)' }, unit: 'h', digits: 1 });
      const note = C.note({ text: { en: '', hr: '' } });
      const GROUPS = { day: [outClock, outDN], moon: [outPhase, outDay, outLit], seasons: [outSeason, outDate, outSunH, outDayLen] };
      function applyMode() {
        Object.keys(GROUPS).forEach(m => GROUPS[m].forEach(r => { r.el.style.display = m === st.mode ? '' : 'none'; }));
      }

      // ---------- model ----------
      const localHours = () => norm(st.rot) / TAU * 24 + 12; // Zagreb faces the Sun (angle 0) at noon
      function clockStr() { const hh = localHours() % 24; const hrs = Math.floor(hh), min = Math.floor((hh - hrs) * 60); return pad2(hrs) + ':' + pad2(min); }
      const isDay = () => Math.cos(st.rot) > 0;
      const phaseIdx = () => Math.round(norm(st.phi) / TAU * 8) % 8;
      const litFrac = () => (1 - Math.cos(st.phi)) / 2;
      const declination = () => Math.asin(-Math.sin(TILT) * Math.cos(st.psi)); // ψ = 0 at the December solstice
      const seasonIdx = () => Math.floor(norm(st.psi) / (TAU / 4)) % 4;
      function dateParts() { // days since Dec 21 -> month/day (calendar of a plain year)
        const d = Math.floor(norm(st.psi) / TAU * YEAR);
        const dt = new Date(Date.UTC(2025, 11, 21) + d * 86400000);
        return { m: dt.getUTCMonth(), d: dt.getUTCDate() };
      }
      function dateStr(l) { const p = dateParts(); return l === 'hr' ? p.d + '. ' + MONTHS[p.m].gen : MONTHS[p.m].en + ' ' + p.d; }
      const noonAlt = () => (Math.PI / 2 - LAT + declination()) * DEG;
      function dayLength() { const c = K.clamp(-Math.tan(LAT) * Math.tan(declination()), -1, 1); return 2 * Math.acos(c) / TAU * 24; }

      function step(dt) {
        if (st.drag) return;
        const s = st.speed * dt;
        if (st.mode === 'day') st.rot = norm(st.rot + s * TAU / 24);              // 1 hour per second at 1×
        else if (st.mode === 'moon') st.phi = norm(st.phi + s * TAU / SYNODIC);  // 1 day per second
        else st.psi = norm(st.psi + s * 10 * TAU / YEAR);                        // 10 days per second
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function reset() {
        L.stop(); st.rot = INIT.rot; st.phi = INIT.phi; st.psi = INIT.psi; st.drag = null;
        if (!ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }
      function refresh() { updateOut(); draw(); }
      function updateOut() {
        const scale = { en: 'Sizes and distances are not to scale.', hr: 'Veličine i udaljenosti nisu u mjerilu.' };
        if (st.mode === 'day') {
          outClock.set(clockStr()); outDN.set(isDay() ? { en: 'day', hr: 'dan' } : { en: 'night', hr: 'noć' });
          note.set({ en: scale.en + ' Earth turns around its axis once in 24 h; the side facing the Sun has day. Drag the Earth to spin it.', hr: scale.hr + ' Zemlja se oko svoje osi okrene jednom u 24 h; strana okrenuta Suncu ima dan. Povuci Zemlju da je zavrtiš.' });
        } else if (st.mode === 'moon') {
          outPhase.set(PHASES[phaseIdx()]); outDay.set(norm(st.phi) / TAU * SYNODIC); outLit.set(litFrac() * 100);
          note.set({ en: scale.en + ' The Sun always lights half of the Moon — from Earth we see a different part of that lit half as the Moon goes round (29.5 days).', hr: scale.hr + ' Sunce uvijek osvjetljava polovicu Mjeseca — sa Zemlje vidimo različit dio te polovice dok Mjesec kruži (29,5 dana).' });
        } else {
          outSeason.set(SEASONS[seasonIdx()]); outDate.set({ en: dateStr('en'), hr: dateStr('hr') }); outSunH.set(noonAlt()); outDayLen.set(dayLength());
          note.set({ en: scale.en + ' The axis always points the same way (tilt 23.5°). When our half leans toward the Sun, sunlight is steeper and days are longer: summer.', hr: scale.hr + ' Os uvijek pokazuje u istom smjeru (nagib 23,5°). Kad je naša polovica nagnuta prema Suncu, svjetlost pada strmije i dani su dulji: ljeto.' });
        }
      }

      // ---------- pointer (drag Earth / Moon / Earth-on-orbit) ----------
      function onDown(ev) {
        const p = cv.pointer(ev);
        if (st.mode === 'day' && lay.ex !== undefined) {
          if (Math.hypot(p.x - lay.ex, p.y - lay.ey) <= lay.R + 10) { st.drag = { off: Math.atan2(lay.ey - p.y, p.x - lay.ex) - st.rot }; }
        } else if (st.mode === 'moon' && lay.ex !== undefined) {
          const m = lay.moon, dM = Math.hypot(p.x - m.x, p.y - m.y), dO = Math.abs(Math.hypot(p.x - lay.ex, p.y - lay.ey) - lay.ro);
          if (dM <= lay.rm + 16 || dO < 18) { st.drag = { off: 0 }; st.phi = norm(Math.atan2(lay.ey - p.y, p.x - lay.ex)); }
        } else if (st.mode === 'seasons' && lay.earth) {
          if (Math.hypot(p.x - lay.earth.x, p.y - lay.earth.y) <= lay.re + 18) { st.drag = { off: 0 }; setPsiFrom(p); }
        }
        if (st.drag) { ev.preventDefault(); cv.canvas.style.cursor = 'grabbing'; refresh(); }
      }
      function setPsiFrom(p) { st.psi = norm(Math.atan2(-(p.y - lay.sy) / lay.b, (p.x - lay.sx) / lay.a)); }
      function onMove(ev) {
        if (!st.drag) { if (ev.target === cv.canvas) cv.canvas.style.cursor = 'grab'; return; }
        const p = cv.pointer(ev);
        if (st.mode === 'day') st.rot = norm(Math.atan2(lay.ey - p.y, p.x - lay.ex) - st.drag.off);
        else if (st.mode === 'moon') st.phi = norm(Math.atan2(lay.ey - p.y, p.x - lay.ex));
        else setPsiFrom(p);
        if (!L.running) refresh();
      }
      function onUp() { if (!st.drag) return; st.drag = null; cv.canvas.style.cursor = 'grab'; }
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- drawing helpers ----------
      const f12 = () => '12px ' + theme.font, f11 = () => '11px ' + theme.font, fb = () => 'bold 14px ' + theme.fontDisplay;
      function drawSun(ctx, x, y, r) {
        ctx.fillStyle = K.withAlpha(SUN, 0.22); ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, TAU); ctx.fill();
        ctx.fillStyle = SUN; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = SUN_EDGE; ctx.lineWidth = 2; ctx.stroke();
      }
      // Earth seen from above the North Pole; rot = angle (math convention) of the Zagreb meridian; sunDir = direction of the Sun (math angle) or null
      function drawEarth(ctx, x, y, r, rot, sunDir) {
        ctx.fillStyle = theme.water; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
        ctx.fillStyle = theme.ground;
        LAND.forEach(([a, d, s]) => { ctx.beginPath(); ctx.arc(x + Math.cos(a + rot) * d * r, y - Math.sin(a + rot) * d * r, s * r, 0, TAU); ctx.fill(); });
        if (sunDir !== null && sunDir !== undefined) {
          ctx.fillStyle = K.withAlpha(theme.isDark ? '#000000' : '#1a2744', 0.6);
          ctx.beginPath(); ctx.arc(x, y, r + 1, -sunDir + Math.PI / 2, -sunDir + 3 * Math.PI / 2); ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      }
      function sunRays(ctx, x1, x2, ys, label) { // parallel rays from the right (x1) to the left (x2)
        ys.forEach(y => K.arrow(ctx, x1, y, x2, y, { color: K.withAlpha(SUN_EDGE, 0.8), width: 2, head: 9 }));
        if (label) K.text(ctx, K.tr(label, lang), x1, ys[0] - 10, { font: f11(), color: theme.fg, align: 'right' });
      }
      // the Moon as seen from Earth (northern hemisphere): phi = 0 new, π full; waxing phases are lit on the right
      function drawPhase(ctx, x, y, r, phi) {
        const waxing = norm(phi) <= Math.PI, e = waxing ? norm(phi) : TAU - norm(phi);
        const rx = Math.max(0.01, Math.abs(Math.cos(e)) * r);
        ctx.save(); ctx.translate(x, y); if (!waxing) ctx.scale(-1, 1);
        ctx.fillStyle = MOON_DARK; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
        ctx.fillStyle = MOON; ctx.beginPath();
        ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
        if (Math.cos(e) >= 0) ctx.ellipse(0, 0, rx, r, 0, Math.PI / 2, -Math.PI / 2, true);
        else ctx.ellipse(0, 0, rx, r, 0, Math.PI / 2, 3 * Math.PI / 2, false);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      }
      function card(ctx, x, y, w, h) { ctx.fillStyle = K.withAlpha(theme.surface, 0.92); K.roundRect(ctx, x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = theme.line; ctx.lineWidth = 1; ctx.stroke(); }

      // ---------- modes ----------
      function drawDay(ctx, w, h) {
        const R = Math.min(h * 0.34, w * 0.2), ex = Math.round(w * 0.42), ey = Math.round(h * 0.54);
        lay = { ex, ey, R };
        // the Sun at the right edge with parallel rays
        const sr = h * 0.16;
        drawSun(ctx, w + sr * 0.2, ey, sr);
        const ys = [ey - R * 0.75, ey - R * 0.25, ey + R * 0.25, ey + R * 0.75].map(Math.round);
        sunRays(ctx, w - sr * 0.95, ex + R + 14, ys, { en: 'sunlight', hr: 'Sunčeva svjetlost' });
        // 24 h clock around the Earth (fixed to the Sun direction)
        const marks = [[0, '12:00', { en: 'noon', hr: 'podne' }], [TAU / 4, '18:00', { en: 'evening', hr: 'večer' }], [TAU / 2, '00:00', { en: 'midnight', hr: 'ponoć' }], [3 * TAU / 4, '06:00', { en: 'morning', hr: 'jutro' }]];
        marks.forEach(([a, t, word]) => {
          const mx = ex + Math.cos(a) * (R + 22), my = ey - Math.sin(a) * (R + 22);
          const align = a === 0 ? 'left' : a === TAU / 2 ? 'right' : 'center';
          K.text(ctx, t, mx, my - 6, { font: 'bold 12px ' + theme.font, color: theme.fg, align, baseline: 'middle' });
          K.text(ctx, K.tr(word, lang), mx, my + 8, { font: f11(), color: theme.muted, align, baseline: 'middle' });
        });
        // day / night halves, terminator
        drawEarth(ctx, ex, ey, R, st.rot, 0);
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.5); ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ex, ey - R); ctx.lineTo(ex, ey + R); ctx.stroke(); ctx.setLineDash([]);
        K.text(ctx, K.tr({ en: 'day', hr: 'dan' }, lang), ex + R * 0.5, ey + R * 0.88, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'night', hr: 'noć' }, lang), ex - R * 0.5, ey + R * 0.88, { font: 'bold 12px ' + theme.font, color: theme.isDark ? theme.fg : theme.surface, align: 'center', baseline: 'middle' });
        // North Pole + rotation arrow (counter-clockwise seen from above the pole)
        ctx.fillStyle = theme.fg; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, TAU); ctx.fill();
        K.text(ctx, 'N', ex + 6, ey - 6, { font: 'bold 11px ' + theme.font, color: theme.fg });
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, ey, R * 0.3, 0.3, -1.4, true); ctx.stroke();
        const ax = ex + Math.cos(-1.4) * R * 0.3, ay = ey + Math.sin(-1.4) * R * 0.3;
        K.arrow(ctx, ax + 6, ay + 2, ax - 4, ay - 1, { color: theme.fg, width: 2, head: 8 });
        // Zagreb marker (latitude 45.8° → 0.7 R from the axis)
        const zx = ex + Math.cos(st.rot) * R * 0.7, zy = ey - Math.sin(st.rot) * R * 0.7;
        ctx.fillStyle = theme.c2; ctx.beginPath(); ctx.arc(zx, zy, 6, 0, TAU); ctx.fill();
        ctx.strokeStyle = theme.surface; ctx.lineWidth = 2; ctx.stroke();
        const lab = 'Zagreb  ' + clockStr() + '  ·  ' + K.tr(isDay() ? { en: 'day', hr: 'dan' } : { en: 'night', hr: 'noć' }, lang);
        ctx.font = 'bold 12px ' + theme.font; const tw = ctx.measureText(lab).width;
        const lx = K.clamp(zx - tw / 2, 6, w - tw - 6), ly = zy - 16;
        ctx.fillStyle = K.withAlpha(theme.surface, 0.9); K.roundRect(ctx, lx - 5, ly - 9, tw + 10, 18, 5); ctx.fill();
        K.text(ctx, lab, lx, ly, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        // header
        K.text(ctx, K.tr({ en: 'Earth seen from above the North Pole', hr: 'Zemlja gledana iznad Sjevernog pola' }, lang), 10, 16, { font: fb(), color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: '1 turn = 24 h  ·  speed: ', hr: '1 okret = 24 h  ·  brzina: ' }, lang) + K.fmt(st.speed, 2, lang) + K.tr({ en: ' h per second', hr: ' h po sekundi' }, lang), 10, 34, { font: f12(), color: theme.muted, baseline: 'middle' });
      }

      function drawMoon(ctx, w, h) {
        const Wl = Math.round(w * 0.6);
        const ex = Math.round(Wl * 0.5), ey = Math.round(h * 0.56);
        const ro = Math.min(h * 0.34, Wl * 0.36), rm = Math.max(7, ro * 0.13), re = Math.max(10, ro * 0.22);
        const moon = { x: ex + Math.cos(st.phi) * ro, y: ey - Math.sin(st.phi) * ro };
        lay = { ex, ey, ro, rm, moon };
        // sunlight from the right
        const ys = [ey - ro * 0.9, ey - ro * 0.3, ey + ro * 0.3, ey + ro * 0.9].map(Math.round);
        sunRays(ctx, Wl - 6, Wl - 46, ys, null);
        K.text(ctx, K.tr({ en: 'sunlight (Sun far to the right)', hr: 'Sunčeva svjetlost (Sunce je daleko desno)' }, lang), Wl - 6, ys[0] - 10, { font: f11(), color: theme.fg, align: 'right' });
        // orbit
        ctx.strokeStyle = theme.line; ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.arc(ex, ey, ro, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        // direction arrow on the orbit (counter-clockwise)
        const aa = st.phi + 0.45, px = ex + Math.cos(aa) * ro, py = ey - Math.sin(aa) * ro;
        K.arrow(ctx, px + Math.sin(aa) * 10, py + Math.cos(aa) * 10, px - Math.sin(aa) * 10, py - Math.cos(aa) * 10, { color: theme.muted, width: 2, head: 8 });
        // line of sight Earth → Moon
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(moon.x, moon.y); ctx.stroke();
        // Earth (lit from the right) and Moon (always lit on its right half)
        drawEarth(ctx, ex, ey, re, 0, 0);
        K.text(ctx, K.tr({ en: 'Earth', hr: 'Zemlja' }, lang), ex, ey + re + 14, { font: f11(), color: theme.fg, align: 'center' });
        ctx.fillStyle = MOON_DARK; ctx.beginPath(); ctx.arc(moon.x, moon.y, rm, 0, TAU); ctx.fill();
        ctx.fillStyle = MOON; ctx.beginPath(); ctx.arc(moon.x, moon.y, rm, -Math.PI / 2, Math.PI / 2); ctx.fill();
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(moon.x, moon.y, rm, 0, TAU); ctx.stroke();
        K.text(ctx, K.tr({ en: 'Moon', hr: 'Mjesec' }, lang), moon.x, moon.y - rm - 8, { font: f11(), color: theme.fg, align: 'center' });
        // header + hint
        K.text(ctx, K.tr({ en: 'Seen from above the North Pole', hr: 'Pogled iznad Sjevernog pola' }, lang), 10, 16, { font: fb(), color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'drag the Moon along its orbit', hr: 'povuci Mjesec po njegovoj stazi' }, lang), 10, 34, { font: f12(), color: theme.muted, baseline: 'middle' });
        // right card: the Moon as seen from Earth
        const cx0 = Wl + 8, cy0 = 8, cw = w - Wl - 16, chh = h - 16;
        card(ctx, cx0, cy0, cw, chh);
        K.text(ctx, K.tr({ en: 'Seen from Earth', hr: 'Pogled sa Zemlje' }, lang), cx0 + cw / 2, cy0 + 14, { font: 'bold 13px ' + theme.fontDisplay, color: theme.fg, align: 'center', baseline: 'middle' });
        const rp = Math.min(cw * 0.3, chh * 0.26), mcx = cx0 + cw / 2, mcy = cy0 + chh * 0.46;
        drawPhase(ctx, mcx, mcy, rp, st.phi);
        K.text(ctx, K.tr(PHASES[phaseIdx()], lang), mcx, mcy + rp + 18, { font: 'bold 13px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'day ', hr: 'dan ' }, lang) + K.fmt(norm(st.phi) / TAU * SYNODIC, 1, lang) + ' / ' + K.fmt(SYNODIC, 1, lang), mcx, mcy + rp + 36, { font: f12(), color: theme.muted, align: 'center', baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'lit: ', hr: 'osvijetljeno: ' }, lang) + K.fmt(litFrac() * 100, 0, lang) + ' %', mcx, mcy + rp + 52, { font: f12(), color: theme.muted, align: 'center', baseline: 'middle' });
      }

      function drawSeasons(ctx, w, h) {
        const wide = w >= 620;
        const cw = K.clamp(w * 0.28, 100, 230), chh = Math.round(cw * 0.86), cx0 = w - cw - 8, cy0 = 8;
        const sx = wide ? Math.round((w - cw - 16) / 2) : Math.round(w / 2), sy = Math.round(h * 0.58);
        const a = wide ? Math.min(sx * 0.84, h * 0.75) : Math.min(w * 0.4, h * 0.75), b = a * 0.38;
        const re = K.clamp(a * 0.09, 9, 22);
        const earth = { x: sx + Math.cos(st.psi) * a, y: sy - Math.sin(st.psi) * b };
        lay = { sx, sy, a, b, re, earth };
        // orbit + key dates
        ctx.strokeStyle = theme.line; ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.ellipse(sx, sy, a, b, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        KEYDATES.forEach((kd, i) => {
          const ang = i * TAU / 4, kx = sx + Math.cos(ang) * a, ky = sy - Math.sin(ang) * b;
          ctx.fillStyle = theme.muted; ctx.beginPath(); ctx.arc(kx, ky, 2.5, 0, TAU); ctx.fill();
          const align = i === 0 ? 'left' : i === 2 ? 'right' : 'center';
          const off = i === 0 ? 8 : i === 2 ? -8 : 0, offY = i === 1 ? -14 : i === 3 ? 22 : -2;
          K.text(ctx, K.tr(kd, lang) + ' · ' + K.tr(SEASONS[i], lang), kx + off, ky + offY, { font: f11(), color: theme.muted, align, baseline: 'middle' });
        });
        // the Sun in the middle
        drawSun(ctx, sx, sy, K.clamp(a * 0.14, 14, 34));
        // Earth with its tilted axis (always leaning the same way, 23.5° to the right)
        const sunDir = Math.atan2(earth.y - sy, sx - earth.x);
        drawEarth(ctx, earth.x, earth.y, re, 0, sunDir);
        const axL = re * 1.7, dx = Math.sin(TILT) * axL, dy = Math.cos(TILT) * axL;
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(earth.x - dx, earth.y + dy); ctx.lineTo(earth.x + dx, earth.y - dy); ctx.stroke();
        K.text(ctx, 'N', earth.x + dx + 3, earth.y - dy - 2, { font: 'bold 11px ' + theme.font, color: theme.fg });
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.7); ctx.lineWidth = 1; // equator
        ctx.beginPath(); ctx.moveTo(earth.x - Math.cos(TILT) * re, earth.y - Math.sin(TILT) * re); ctx.lineTo(earth.x + Math.cos(TILT) * re, earth.y + Math.sin(TILT) * re); ctx.stroke();
        // header
        K.text(ctx, K.tr(SEASONS[seasonIdx()], lang).replace(/^./, c => c.toUpperCase()) + '  ·  ' + dateStr(lang), 10, 16, { font: fb(), color: theme.fg, baseline: 'middle' });
        K.text(ctx, K.tr({ en: 'drag the Earth along its orbit · 1 year = 365 days', hr: 'povuci Zemlju po stazi · 1 godina = 365 dana' }, lang), 10, 34, { font: f12(), color: theme.muted, baseline: 'middle' });
        // inset: how directly sunlight hits the northern half (side view, Sun to the right)
        card(ctx, cx0, cy0, cw, chh);
        K.text(ctx, K.tr({ en: 'Sunlight on Croatia at noon', hr: 'Sunce nad Hrvatskom u podne' }, lang), cx0 + cw / 2, cy0 + 12, { font: 'bold 11px ' + theme.font, color: theme.fg, align: 'center', baseline: 'middle' });
        const ri = chh * 0.27, icx = cx0 + cw * 0.38, icy = cy0 + chh * 0.55, lean = declination();
        drawEarth(ctx, icx, icy, ri, 0, 0);
        ctx.strokeStyle = theme.fg; ctx.lineWidth = 2; // axis leaning toward (+) or away from (−) the Sun
        ctx.beginPath(); ctx.moveTo(icx - Math.sin(lean) * ri * 1.35, icy + Math.cos(lean) * ri * 1.35); ctx.lineTo(icx + Math.sin(lean) * ri * 1.35, icy - Math.cos(lean) * ri * 1.35); ctx.stroke();
        K.text(ctx, 'N', icx + Math.sin(lean) * ri * 1.35 + 3, icy - Math.cos(lean) * ri * 1.35 - 2, { font: 'bold 10px ' + theme.font, color: theme.fg });
        ctx.strokeStyle = K.withAlpha(theme.fg, 0.7); ctx.lineWidth = 1; // equator
        ctx.beginPath(); ctx.moveTo(icx - Math.cos(lean) * ri, icy - Math.sin(lean) * ri); ctx.lineTo(icx + Math.cos(lean) * ri, icy + Math.sin(lean) * ri); ctx.stroke();
        // Croatia at noon on the Sun-facing side; the ray hits the ground at the noon altitude angle
        const ang = LAT - lean, zx = icx + Math.cos(ang) * ri, zy = icy - Math.sin(ang) * ri;
        [-0.6, 0.2, 0.8].forEach(k => K.arrow(ctx, cx0 + cw - 6, icy + k * ri, icx + ri + 4, icy + k * ri, { color: K.withAlpha(SUN_EDGE, 0.5), width: 1.5, head: 6 }));
        K.arrow(ctx, cx0 + cw - 6, zy, zx + 3, zy, { color: SUN_EDGE, width: 2.5, head: 8 });
        ctx.fillStyle = theme.c2; ctx.beginPath(); ctx.arc(zx, zy, 4, 0, TAU); ctx.fill();
        ctx.strokeStyle = theme.surface; ctx.lineWidth = 1.5; ctx.stroke();
        K.text(ctx, K.fmt(noonAlt(), 0, lang) + '°', zx + 6, zy - 8, { font: 'bold 11px ' + theme.font, color: theme.fg });
        K.text(ctx, K.tr({ en: 'day: ', hr: 'dan: ' }, lang) + K.fmt(dayLength(), 1, lang) + ' h', cx0 + cw / 2, cy0 + chh - 10, { font: f11(), color: theme.fg, align: 'center', baseline: 'middle' });
      }

      function draw() {
        const ctx = cv.ctx, w = cv.w, h = cv.h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, w, h);
        if (st.mode === 'day') drawDay(ctx, w, h); else if (st.mode === 'moon') drawMoon(ctx, w, h); else drawSeasons(ctx, w, h);
        K.text(ctx, K.tr({ en: 'not to scale', hr: 'nije u mjerilu' }, lang), 10, h - 8, { font: f11(), color: theme.muted });
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      cv.canvas.style.cursor = 'grab';
      applyMode();
      reset();
      return {
        destroy() {
          L.destroy();
          cv.canvas.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          cv.destroy(); C.destroy();
        },
        setLang(l) { lang = l; C.setLang(l); refresh(); },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
