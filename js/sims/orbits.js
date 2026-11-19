/* FizLab sim: Gravity and Orbits — Newton's cannon (real two-body motion around the Earth), a planet round a star
   (equal and opposite gravity forces, gravity on/off, a moon) and real satellites from the ISS to geostationary orbit. */
(function () {
  'use strict';
  const K = window.SimKit;
  const TAU = Math.PI * 2;
  const GM = 3.986e14;                              // G·M of the Earth (m³/s²)
  const RE = 6.371e6;                               // radius of the Earth (m)
  const H0 = 3.0e5;                                 // height of Newton's mountain (m)
  const R0 = RE + H0;
  const TC = TAU * Math.sqrt(R0 * R0 * R0 / GM);    // period of the circular orbit at that height ≈ 5420 s
  const RA_VIEW = 10 * RE;                          // the cannon picture never zooms out further than this
  const G0 = 9.81;
  const DAY = 86164;                                // one turn of the Earth (s)
  const ALT_MIN = 200, ALT_MAX = 40000;             // km
  // Sun and planet: astronomical units (AU), years and solar masses, so that G·M = 4π²·M
  const AU_KM = 1.496e8, AUYR_KMS = 4.74, F0 = 3.54e22;   // 1 AU in km; 1 AU/year in km/s; Sun–Earth force (N)
  const SUN_VIEW = 6;                               // AU: the planet picture never zooms out further than this
  const MOON_T = 27.32 / 365.25, MOON_D = 0.15, MOON_V = 0.215; // moon: period (years), drawn distance (AU, exaggerated), real speed (AU/year)
  const SUN = '#f6c445', SUN_EDGE = '#e8912a', MOONC = '#d8d8d8'; // fixed physical colours (as in the Earth–Moon–Sun sim)
  const LAND = [[0.05, 0.55, 0.26], [0.6, 0.3, 0.2], [-0.9, 0.62, 0.22], [1.7, 0.72, 0.17], [2.5, 0.45, 0.26], [3.4, 0.68, 0.16], [-2.1, 0.36, 0.22], [-1.5, 0.82, 0.13]];
  const MODES = [
    { value: 'cannon', label: { en: 'Newton\'s cannon', hr: 'Newtonov top' } },
    { value: 'sun', label: { en: 'Sun and planet', hr: 'Sunce i planet' } },
    { value: 'sat', label: { en: 'Satellites', hr: 'Sateliti' } }
  ];
  const PRESETS = [
    { alt: 400, label: { en: 'ISS 400 km', hr: 'ISS 400 km' }, name: { en: 'ISS (space station)', hr: 'ISS (svemirska postaja)' }, short: 'ISS' },
    { alt: 20200, label: { en: 'GPS 20 200 km', hr: 'GPS 20 200 km' }, name: { en: 'GPS satellites', hr: 'GPS sateliti' }, short: 'GPS' },
    { alt: 35786, label: { en: 'GEO 35 786 km', hr: 'GEO 35 786 km' }, name: { en: 'geostationary orbit', hr: 'geostacionarna orbita' }, short: 'GEO' }
  ];
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function sci(v, l) { // 3.54e22 -> "3,5·10²²"
    if (!v) return '0';
    const e = Math.floor(Math.log10(Math.abs(v)));
    return K.fmt(v / Math.pow(10, e), 1, l) + '·10' + String(e).split('').map(c => SUP[c] || c).join('');
  }
  const big = (v, l) => K.fmt(v, 0, l).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 35786 -> "35 786"
  function dur(T) { // seconds -> bilingual "92 min" / "11.9 h" / "50.2 days"
    const f = l => T < 7200 ? K.fmt(T / 60, T < 600 ? 1 : 0, l) + ' min' : T < 172800 ? K.fmt(T / 3600, 1, l) + ' h' : K.fmt(T / 86400, 1, l) + (l === 'hr' ? ' dana' : ' days');
    return { en: f('en'), hr: f('hr') };
  }
  // one velocity-Verlet step (symplectic): s = {x, y, vx, vy}, h = time step, mu = G·M of the central body
  function verlet(s, h, mu) {
    let r2 = Math.max(1e-12, s.x * s.x + s.y * s.y), k = -mu / (r2 * Math.sqrt(r2));
    s.vx += 0.5 * h * k * s.x; s.vy += 0.5 * h * k * s.y;
    s.x += h * s.vx; s.y += h * s.vy;
    r2 = Math.max(1e-12, s.x * s.x + s.y * s.y); k = -mu / (r2 * Math.sqrt(r2));
    s.vx += 0.5 * h * k * s.x; s.vy += 0.5 * h * k * s.y;
  }
  // shape of the orbit that belongs to a position and a velocity (energy + eccentricity vector)
  function elements(s, mu) {
    const r = Math.hypot(s.x, s.y), v2 = s.vx * s.vx + s.vy * s.vy, rv = s.x * s.vx + s.y * s.vy, eps = v2 / 2 - mu / r;
    const ex = ((v2 - mu / r) * s.x - rv * s.vx) / mu, ey = ((v2 - mu / r) * s.y - rv * s.vy) / mu, e = Math.hypot(ex, ey);
    if (eps >= 0) return { bound: false, e, ex, ey };
    const a = -mu / (2 * eps);
    return { bound: true, a, e, ex, ey, rp: a * (1 - e), ra: a * (1 + e), b: a * Math.sqrt(Math.max(0, 1 - e * e)), T: TAU * Math.sqrt(a * a * a / mu) };
  }
  function niceAlt(raw) { // slider value -> a round altitude; the three presets stay exact
    for (let i = 0; i < PRESETS.length; i++) if (Math.abs(raw - PRESETS[i].alt) < 0.6) return PRESETS[i].alt;
    const stp = raw < 1000 ? 10 : raw < 10000 ? 100 : 500;
    return K.clamp(Math.round(raw / stp) * stp, ALT_MIN, ALT_MAX);
  }
  const altOfS = s => niceAlt(ALT_MIN * Math.pow(ALT_MAX / ALT_MIN, s));   // logarithmic slider 0…1
  const sOfAlt = a => Math.log(a / ALT_MIN) / Math.log(ALT_MAX / ALT_MIN);

  window.Sims.register({
    id: 'orbits',
    title: { en: 'Gravity and Orbits', hr: 'Gravitacija i orbite' },
    summary: {
      en: 'Fire Newton\'s cannon faster and faster until the ball never lands, send a planet around a star, and compare real satellites from the ISS to geostationary orbit.',
      hr: 'Ispaljuj Newtonov top sve brže dok kugla više ne padne, pošalji planet oko zvijezde i usporedi stvarne satelite od ISS-a do geostacionarne orbite.'
    },
    tasks: [
      { en: 'Newton\'s cannon: fire at 2, 4, 6 and 7 km/s. How does the landing point move? Then try 7.7 km/s.', hr: 'Newtonov top: ispali kuglu brzinom 2, 4, 6 i 7 km/s. Kako se pomiče mjesto pada? Zatim probaj 7,7 km/s.' },
      { en: 'Find the slowest speed at which the ball never comes back (escape). Is it twice the orbital speed, or less?', hr: 'Nađi najmanju brzinu pri kojoj se kugla više ne vraća (bijeg). Je li dvostruko veća od orbitalne brzine ili manja?' },
      { en: 'Sun and planet: compare the two force arrows. Then switch gravity off while the planet is moving. Which way does it go?', hr: 'Sunce i planet: usporedi dvije strelice sile. Zatim isključi gravitaciju dok se planet giba. Kamo ode?' },
      { en: 'Satellites: how strong is gravity at the height of the ISS, in percent? So why do astronauts float?', hr: 'Sateliti: kolika je gravitacija na visini ISS-a, u postocima? Zašto onda astronauti lebde?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 10, minHeight: 300, maxHeight: 520 });
      const C = K.controls(container, lang);

      const st = { mode: 'cannon' };
      const cn = { v: 4, shots: [], cur: null, count: 0 };               // Newton's cannon (SI units)
      const sn = { M: 1, k: 100, grav: true, moon: false };              // Sun and planet (AU, years)
      const sa = { alt: 400, th: Math.PI / 2, rot: Math.PI / 2, t: 0, drag: null }; // satellite

      // ---------- controls ----------
      const fieldOf = c => { let e = c.el; while (e && e !== C.el) { if (e.classList && (e.classList.contains('sk-field') || e.classList.contains('sk-note'))) return e; e = e.parentNode; } return c.el; };
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };

      C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: MODES, value: 'cannon', onChange: v => setMode(v) });
      const slV = C.slider({ label: { en: 'Launch speed', hr: 'Brzina ispaljivanja' }, min: 0, max: 12, step: 0.1, value: 4, unit: 'km/s', digits: 1, onChange: v => { cn.v = v; refresh(); } });
      const btnFire = C.button({ label: { en: 'Fire!', hr: 'Ispali!' }, variant: 'primary', onClick: () => fire() });
      const btnClear = C.button({ label: { en: 'Clear trails', hr: 'Obriši tragove' }, onClick: () => { if (st.mode !== 'cannon') return; L.stop(); clearCannon(); updatePlay(); refresh(); } });
      const slM = C.slider({ label: { en: 'Star mass (Sun = 1)', hr: 'Masa zvijezde (Sunce = 1)' }, min: 0.5, max: 2, step: 0.1, value: 1, digits: 1, onChange: v => { sn.M = v; restartSun(); } });
      const slK = C.slider({ label: { en: 'Planet\'s starting speed (% of the circular speed)', hr: 'Početna brzina planeta (% kružne brzine)' }, min: 50, max: 150, step: 5, value: 100, unit: '%', digits: 0,
        onChange: v => { sn.k = v; restartSun(); } });
      const tgGrav = C.toggle({ label: { en: 'Gravity on', hr: 'Gravitacija uključena' }, value: true, onChange: v => { setGrav(v); refresh(); } });
      const tgMoon = C.toggle({ label: { en: 'Add a moon', hr: 'Dodaj mjesec' }, value: false, onChange: v => { sn.moon = v; refresh(); } });
      const slAlt = C.slider({ label: { en: 'Height above the ground', hr: 'Visina iznad tla' }, min: 0, max: 1, value: sOfAlt(400),
        format: (v, l) => big(altOfS(v), l) + ' km', onChange: v => { sa.alt = altOfS(v); refresh(); } });
      const btnPre = PRESETS.map(p => C.button({ label: p.label, onClick: () => { sa.alt = p.alt; slAlt.set(sOfAlt(p.alt)); refresh(); } }));
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, onClick: () => {
        if (st.mode === 'cannon' && !(cn.cur && (cn.cur.state === 'fly' || cn.cur.state === 'orbit'))) { fire(); return; }
        if (st.mode === 'sun' && sn.lost) resetSun();
        L.toggle(); updatePlay(); refresh();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      const roC = [
        C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'km/s', digits: 2 }),
        C.readout({ label: { en: 'Height above the ground', hr: 'Visina iznad tla' }, unit: 'km', digits: 0 }),
        C.readout({ label: { en: 'Time', hr: 'Vrijeme' }, unit: 'min', digits: 1 }),
        C.readout({ label: { en: 'Orbital period', hr: 'Ophodno vrijeme' }, unit: 'min', digits: 1 })
      ];
      const roS = [
        C.readout({ label: { en: 'Time (Earth years)', hr: 'Vrijeme (Zemljine godine)' }, digits: 2 }),
        C.readout({ label: { en: 'Orbital period (Earth years)', hr: 'Ophodno vrijeme (Zemljine godine)' }, digits: 2 }),
        C.readout({ label: { en: 'Planet\'s speed', hr: 'Brzina planeta' }, unit: 'km/s', digits: 1 }),
        C.readout({ label: { en: 'Distance from the star', hr: 'Udaljenost od zvijezde' }, unit: { en: 'million km', hr: 'milijuna km' }, digits: 0 }),
        C.readout({ label: { en: 'Gravity force on each body', hr: 'Gravitacijska sila na svako tijelo' }, unit: 'N', digits: 0 })
      ];
      const roA = [
        C.readout({ label: { en: 'Orbital speed v = √(G·M/r)', hr: 'Orbitalna brzina v = √(G·M/r)' }, unit: 'km/s', digits: 2 }),
        C.readout({ label: { en: 'Orbital period', hr: 'Ophodno vrijeme' } }),
        C.readout({ label: { en: 'Gravity there g = G·M/r²', hr: 'Gravitacija ondje g = G·M/r²' }, unit: 'm/s²', digits: 2 }),
        C.readout({ label: { en: 'Compared with the ground (9.81 m/s²)', hr: 'U odnosu na tlo (9,81 m/s²)' }, unit: '%', digits: 0 })
      ];
      const note = C.note({ text: { en: '', hr: '' } });
      let noteKey = '';
      function setNote(key, make) { if (key === noteKey) return; noteKey = key; note.set(make()); }

      function applyMode() {
        const m = st.mode;
        [slV, btnFire, btnClear].concat(roC).forEach(c => show(c, m === 'cannon'));
        [slM, slK, tgGrav, tgMoon].concat(roS).forEach(c => show(c, m === 'sun'));
        [slAlt].concat(btnPre, roA).forEach(c => show(c, m === 'sat'));
      }
      function setMode(v) {
        st.mode = v; sa.drag = null; L.stop(); applyMode();
        if (v !== 'cannon' && !ctx.reducedMotion && !(v === 'sun' && sn.lost)) L.start();
        updatePlay(); refresh();
      }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function refresh() { updateOut(); draw(); }

      // ---------- Newton's cannon ----------
      function classify(v) { // what will a horizontal shot with speed v (m/s) from the mountain top do?
        const o = elements({ x: 0, y: R0, vx: v, vy: 0 }, GM);
        o.kind = !o.bound ? 'escape' : o.rp <= RE ? 'fall' : o.e < 0.012 ? 'circle' : 'ellipse';
        return o;
      }
      function fallTime(v) { // quick look-ahead, only used to choose a watchable time scale
        const s = { x: 0, y: R0, vx: v, vy: 0 }; let t = 0;
        while (t < 2e4 && s.x * s.x + s.y * s.y > RE * RE) { verlet(s, 2, GM); t += 2; }
        return Math.max(t, 2);
      }
      function clearCannon() { cn.shots = []; cn.cur = null; cn.count = 0; }
      function fire() {
        if (st.mode !== 'cannon') return;
        if (cn.cur) { if (cn.cur.state === 'fly') cn.cur.state = 'cut'; cn.shots.push(cn.cur); if (cn.shots.length > 7) cn.shots.shift(); }
        const v = cn.v * 1000, o = classify(v);
        const s = { v, o, x: 0, y: R0, vx: v, vy: 0, t: 0, ang: 0, pts: [[0, R0]], state: 'fly', idx: cn.count++, land: 0, period: null, scale: TC / 6 };
        if (o.kind === 'fall') { const tf = fallTime(v); s.scale = tf / K.clamp(tf / (TC / 10), 2.5, 10); }
        else if (o.bound && o.ra <= RA_VIEW) s.scale = o.T / K.clamp(10 * o.T / TC, 10, 18);   // a circular orbit takes 10 s on screen
        cn.cur = s;
        L.start(); updatePlay(); refresh();
      }
      function stepCannon(dt) {
        const s = cn.cur;
        if (!s || (s.state !== 'fly' && s.state !== 'orbit')) { L.stop(); updatePlay(); return; }
        const n = 24, hh = dt * s.scale / n;
        if (hh <= 0) return;
        for (let i = 0; i < n; i++) {
          const px = s.x, py = s.y;
          verlet(s, hh, GM); s.t += hh;
          const da = Math.abs(Math.atan2(px * s.y - py * s.x, px * s.x + py * s.y));   // angle swept around the Earth's centre
          s.ang += da;
          if (s.state !== 'fly') continue;
          const r = Math.hypot(s.x, s.y);
          if (r <= RE) { s.x *= RE / r; s.y *= RE / r; s.state = 'landed'; s.land = s.ang * RE / 1000; break; }   // hit the ground
          if (s.ang >= TAU) { s.state = 'orbit'; s.period = s.t - hh * (s.ang - TAU) / (da || 1); s.pts.push([s.x, s.y]); }   // all the way round
          else if (r > 60 * RE) { s.state = 'gone'; break; }
        }
        if (s.state !== 'orbit') s.pts.push([s.x, s.y]);
        if (s.state === 'fly' && !(s.o.bound && s.o.ra <= RA_VIEW)) {   // too far to follow: stop when it leaves the picture
          const V = viewCannon(), X = V.cx + s.x * V.ppm, Y = V.cy - s.y * V.ppm;
          if (X < -20 || X > V.w + 20 || Y < -20 || Y > V.h + 20) s.state = 'gone';
        }
        if (s.state === 'landed' || s.state === 'gone') { L.stop(); updatePlay(); }
      }
      function outcome(s) { // long text for the header
        if (s.state === 'fly') return { en: 'In flight… gravity keeps bending the path towards the Earth.', hr: 'Leti… gravitacija stalno savija putanju prema Zemlji.' };
        if (s.state === 'landed') {
          if (s.land < 1) return { en: 'No sideways speed: it falls straight down.', hr: 'Bez bočne brzine: pada ravno dolje.' };
          return { en: 'Falls back to the ground ' + big(s.land, 'en') + ' km away (measured along the surface).', hr: 'Pada natrag na tlo ' + big(s.land, 'hr') + ' km dalje (mjereno po površini).' };
        }
        const T = dur(s.period || s.o.T || 0);
        if (s.state === 'orbit') {
          if (s.o.kind === 'circle') return { en: 'Circular orbit! It keeps falling, but the ground curves away just as fast. One lap: ' + T.en + '.', hr: 'Kružna orbita! Stalno pada, ali se tlo jednako brzo zakrivljuje. Jedan obilazak: ' + T.hr + '.' };
          return { en: 'Elliptical orbit: highest point ' + big((s.o.ra - RE) / 1000, 'en') + ' km above the ground, one lap ' + T.en + '.', hr: 'Eliptična orbita: najviša točka ' + big((s.o.ra - RE) / 1000, 'hr') + ' km iznad tla, jedan obilazak ' + T.hr + '.' };
        }
        if (s.o.bound) return { en: 'A very long ellipse: it leaves the picture and comes back after ' + T.en + '.', hr: 'Vrlo izdužena elipsa: izlazi iz slike i vraća se nakon ' + T.hr + '.' };
        return { en: 'Escape! Above about 10.9 km/s gravity can never bring it back.', hr: 'Bijeg! Iznad otprilike 10,9 km/s gravitacija je više ne može vratiti.' };
      }
      function shortOutcome(s) { // short text for the list of shots
        if (s.state === 'fly') return { en: 'in flight', hr: 'leti' };
        if (s.state === 'landed') return { en: 'lands after ' + big(s.land, 'en') + ' km', hr: 'pada nakon ' + big(s.land, 'hr') + ' km' };
        if (s.o.kind === 'fall') return { en: 'falls back', hr: 'pada natrag' };
        if (s.o.kind === 'circle') return { en: 'circular orbit', hr: 'kružna orbita' };
        if (!s.o.bound) return { en: 'escapes', hr: 'bijeg' };
        return s.o.ra > RA_VIEW ? { en: 'very long ellipse', hr: 'vrlo duga elipsa' } : { en: 'elliptical orbit', hr: 'eliptična orbita' };
      }

      // ---------- Sun and planet ----------
      const sunMu = () => 4 * Math.PI * Math.PI * sn.M;
      function setGrav(on) {
        sn.grav = on;
        if (on) { sn.off = null; return; }
        sn.off = { x: sn.x, y: sn.y };                                   // from here on: no force, straight line
        sn.mux = -Math.sin(sn.mphi) * MOON_V; sn.muy = Math.cos(sn.mphi) * MOON_V;
      }
      function resetSun() {
        sn.x = 1; sn.y = 0; sn.vx = 0; sn.vy = TAU * Math.sqrt(sn.M) * sn.k / 100;   // circular speed at 1 AU = 2π·√M AU/year
        sn.t = 0; sn.ang = 0; sn.pts = [[1, 0]]; sn.lost = false;
        sn.mphi = 0.8; sn.md = MOON_D; sn.mrx = Math.cos(0.8) * MOON_D; sn.mry = Math.sin(0.8) * MOON_D;
        sn.orb0 = elements(sn, sunMu());                                 // the starting orbit fixes the picture and the time scale
        sn.yps = (sn.orb0.bound && sn.orb0.ra <= SUN_VIEW) ? sn.orb0.T / K.clamp(8 * sn.orb0.T, 6, 16) : 1 / 6;   // years per second
        setGrav(sn.grav);
      }
      function restartSun() {
        const wasLost = sn.lost; resetSun();
        if (wasLost && st.mode === 'sun' && !ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }
      function stepSun(dt) {
        if (sn.lost) { L.stop(); updatePlay(); return; }
        const n = 40, total = dt * sn.yps, hh = total / n, mu = sunMu();
        for (let i = 0; i < n; i++) {
          const px = sn.x, py = sn.y;
          if (sn.grav) verlet(sn, hh, mu); else { sn.x += sn.vx * hh; sn.y += sn.vy * hh; }
          sn.ang += Math.atan2(px * sn.y - py * sn.x, px * sn.x + py * sn.y);
        }
        sn.t += total;
        if (sn.grav) {                                                   // the moon circles the planet (drawn far too far out)
          sn.mphi += TAU / MOON_T * total; sn.md += (MOON_D - sn.md) * Math.min(1, dt * 4);
          sn.mrx = Math.cos(sn.mphi) * sn.md; sn.mry = Math.sin(sn.mphi) * sn.md;
        } else {                                                         // no gravity: the moon drifts off in its own straight line
          sn.mrx += sn.mux * total; sn.mry += sn.muy * total;
          sn.mphi = Math.atan2(sn.mry, sn.mrx); sn.md = Math.hypot(sn.mrx, sn.mry);
        }
        sn.pts.push([sn.x, sn.y]); if (sn.pts.length > 1600) sn.pts.shift();
        const V = viewSun(), X = V.cx + sn.x * V.ppu, Y = V.cy - sn.y * V.ppu;
        if (X < -40 || X > V.w + 40 || Y < -40 || Y > V.h + 40) { sn.lost = true; L.stop(); updatePlay(); }
      }

      // ---------- satellites ----------
      function satNums() { const r = RE + sa.alt * 1000, v = Math.sqrt(GM / r); return { r, v, T: TAU * r / v, g: GM / (r * r), pct: GM / (r * r) / G0 * 100 }; }
      const satScreenT = () => 4 + 8 * sOfAlt(sa.alt);                   // seconds on screen for one lap
      function resetSat() { sa.th = Math.PI / 2; sa.rot = Math.PI / 2; sa.t = 0; sa.drag = null; }
      function stepSat(dt) {
        if (sa.drag) return;
        const q = satNums(), S = satScreenT(), scale = q.T / S;
        sa.th += TAU * dt / S;                                           // satellite: one lap in S seconds
        sa.rot += TAU * dt * scale / DAY;                                // the Earth turns at the same time scale
        sa.t += dt * scale;
      }
      function onDown(ev) {
        if (st.mode !== 'sat') return;
        const V = viewSat(), p = cv.pointer(ev);
        const X = V.cx + Math.cos(sa.th) * V.r * V.ppm, Y = V.cy - Math.sin(sa.th) * V.r * V.ppm;
        if (Math.hypot(p.x - X, p.y - Y) > 30) return;
        sa.drag = { vr: V.vr }; ev.preventDefault(); cv.canvas.style.cursor = 'grabbing';
      }
      function onMove(ev) {
        if (!sa.drag) return;
        const V = viewSat(), p = cv.pointer(ev);
        sa.alt = niceAlt(K.clamp((Math.hypot(p.x - V.cx, p.y - V.cy) / V.ppm - RE) / 1000, ALT_MIN, ALT_MAX));
        sa.th = Math.atan2(V.cy - p.y, p.x - V.cx);
        slAlt.set(sOfAlt(sa.alt));
        refresh();
      }
      function onUp() { if (!sa.drag) return; sa.drag = null; cv.canvas.style.cursor = ''; refresh(); }
      cv.canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      // ---------- readouts and notes ----------
      function updateOut() {
        if (st.mode === 'cannon') {
          const s = cn.cur;
          roC[0].set(s ? Math.hypot(s.vx, s.vy) / 1000 : cn.v);
          roC[1].set(s ? Math.max(0, (Math.hypot(s.x, s.y) - RE) / 1000) : H0 / 1000);
          roC[2].set(s ? s.t / 60 : 0);
          roC[3].set(s && s.period ? s.period / 60 : null);
          setNote('cannon', () => ({
            en: 'An orbit is falling around the Earth: the ball falls all the time, but it moves sideways so fast that the ground curves away beneath it and it keeps missing the Earth. The 300 km mountain is hugely exaggerated (Mount Everest is 8.8 km) and there is no air.',
            hr: 'Orbita je padanje oko Zemlje: kugla stalno pada, ali se bočno giba tako brzo da se tlo pod njom zakrivljuje pa stalno „promašuje” Zemlju. Planina od 300 km jako je pretjerana (Mount Everest ima 8,8 km), a zraka nema.' }));
        } else if (st.mode === 'sun') {
          const r = Math.hypot(sn.x, sn.y), o = sn.grav ? elements(sn, sunMu()) : null, F = F0 * sn.M / (r * r);
          roS[0].set(sn.t);
          roS[1].set(!o ? { en: '–', hr: '–' } : o.bound ? o.T : { en: 'none (it escapes)', hr: 'nema (bježi)' });
          roS[2].set(Math.hypot(sn.vx, sn.vy) * AUYR_KMS);
          roS[3].set(r * AU_KM / 1e6);
          roS[4].set(sn.grav ? { en: sci(F, 'en'), hr: sci(F, 'hr') } : 0);
          if (sn.grav) setNote('sun-on', () => ({
            en: 'Gravity pulls the planet towards the star and the star towards the planet with equal and opposite forces. The star hardly moves because its mass is enormous. The force only bends the path; with no force the planet would go straight. Sizes and distances are not to scale.',
            hr: 'Gravitacija privlači planet prema zvijezdi i zvijezdu prema planetu jednakim silama suprotnog smjera. Zvijezda se gotovo ne miče jer joj je masa golema. Sila samo zakrivljuje putanju; bez sile planet bi išao ravno. Veličine i udaljenosti nisu u mjerilu.' }));
          else setNote('sun-off', () => ({
            en: 'No gravity, no force: the planet keeps the velocity it had and moves in a straight line along the tangent at constant speed (inertia). It does not fly straight away from the star.',
            hr: 'Nema gravitacije, nema sile: planet zadržava brzinu koju je imao i giba se ravno po tangenti stalnom brzinom (tromost). Ne odleti ravno od zvijezde.' }));
        } else {
          const q = satNums(), p = K.fmt(q.pct, 0, 'en');
          roA[0].set(q.v / 1000); roA[1].set(dur(q.T)); roA[2].set(q.g); roA[3].set(q.pct);
          setNote('sat' + p, () => ({
            en: 'Here gravity is still ' + p + ' % of its value on the ground (at the ISS about 89 %). Astronauts float because they and their spacecraft are in free fall together (weightlessness), not because gravity is gone. Drag the satellite or use the slider.',
            hr: 'Ovdje je gravitacija još ' + p + ' % one na tlu (na ISS-u oko 89 %). Astronauti lebde jer su zajedno s letjelicom u slobodnom padu (bestežinsko stanje), a ne zato što gravitacije nema. Povuci satelit ili pomakni klizač.' }));
        }
      }

      // ---------- geometry ----------
      function viewCannon() {
        const w = cv.w, h = cv.h;
        let apo = R0, bmax = R0;
        const all = cn.cur ? cn.shots.concat([cn.cur]) : cn.shots;
        all.forEach(s => {
          const o = s.o;
          if (o.kind === 'fall') return;
          const far = !o.bound || o.ra > RA_VIEW;
          apo = Math.max(apo, far ? RA_VIEW : o.ra); bmax = Math.max(bmax, far ? RA_VIEW * 0.8 : o.b);
        });
        const top = 64, bot = 26, span = (R0 + apo) * 1.03;
        const ppm = Math.min((h - top - bot) / span, w * 0.47 / (bmax * 1.05));
        return { w, h, ppm, cx: w / 2, cy: top + (h - top - bot - span * ppm) / 2 + R0 * 1.03 * ppm };
      }
      function viewSun() {
        const w = cv.w, h = cv.h, o = sn.orb0;
        let Lx = 3.2, B = 2.4;
        if (o.bound && sn.k >= 100) { Lx = Math.min(o.ra, SUN_VIEW); B = Math.min(o.b, SUN_VIEW * 0.6); }
        else if (o.bound) { Lx = o.rp; B = o.b; }
        Lx = Math.max(Lx, 0.5) * 1.12 + 0.1; B = Math.max(B, 0.6) * 1.15 + 0.1;
        const Rx = 1.3, top = 74, bot = 24;
        const ppu = Math.min((w - 20) / (Lx + Rx), (h - top - bot) / (2 * B));
        return { w, h, ppu, cx: (w - (Lx + Rx) * ppu) / 2 + Lx * ppu, cy: top + (h - top - bot) / 2 };
      }
      function viewSat() {
        const w = cv.w, h = cv.h, r = RE + sa.alt * 1000, wide = w >= 640;
        const vr = sa.drag ? sa.drag.vr : Math.max(r * 1.2, RE * 1.75);
        const availW = wide ? w * 0.62 : w, top = 54, bot = 26;
        return { w, h, wide, r, vr, ppm: Math.min(availW / 2 - 8, (h - top - bot) / 2) / vr, cx: availW / 2, cy: top + (h - top - bot) / 2 };
      }

      // ---------- drawing helpers ----------
      const fnt = (px, bold, display) => (bold ? 'bold ' : '') + px + 'px ' + (display ? theme.fontDisplay : theme.font);
      function fit(g, str, maxW, base, bold, display) {
        let px = base; g.font = fnt(px, bold, display);
        while (px > 9 && g.measureText(str).width > maxW) { px--; g.font = fnt(px, bold, display); }
        return fnt(px, bold, display);
      }
      function label(g, txt, x, y, o) { K.text(g, txt, x, y, Object.assign({ font: fnt(11, true), color: theme.fg, baseline: 'middle' }, o || {})); }
      function pill(g, txt, x, y, align) {
        g.font = fnt(11, true);
        const tw = g.measureText(txt).width;
        const tx = K.clamp(align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x, 4, Math.max(4, cv.w - tw - 4));
        g.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(g, tx - 4, y - 8, tw + 8, 16, 5); g.fill();
        label(g, txt, tx, y);
      }
      function header(g, s1, s2, maxW) { // bold title line + a hint that wraps onto a second line on narrow screens
        K.text(g, s1, 10, 15, { font: fit(g, s1, maxW, 14, true, true), color: theme.fg, baseline: 'middle' });
        if (!s2) return;
        g.font = fnt(12);
        if (g.measureText(s2).width <= maxW) { K.text(g, s2, 10, 34, { font: fnt(12), color: theme.muted, baseline: 'middle' }); return; }
        g.font = fnt(11);
        const words = s2.split(' ');
        let a = '', i = 0;
        while (i < words.length && g.measureText(a ? a + ' ' + words[i] : words[i]).width <= maxW) { a = a ? a + ' ' + words[i] : words[i]; i++; }
        const b = words.slice(i).join(' ');
        K.text(g, a, 10, 31, { font: fnt(11), color: theme.muted, baseline: 'middle' });
        if (b) K.text(g, b, 10, 45, { font: fit(g, b, maxW, 11, false), color: theme.muted, baseline: 'middle' });
      }
      function arrowKey(g, y) { // what the two arrow colours mean
        let x = 10;
        [[theme.fg, { en: 'v: velocity', hr: 'v: brzina' }], [theme.c1, { en: 'F: gravity', hr: 'F: gravitacija' }]].forEach(a => {
          K.arrow(g, x, y, x + 20, y, { color: a[0], width: 2.5, head: 7 });
          const s = K.tr(a[1], lang); label(g, s, x + 25, y, { font: fnt(11), color: theme.muted });
          g.font = fnt(11); x += 25 + g.measureText(s).width + 14;
        });
      }
      function corner(g, obj) { label(g, K.tr(obj, lang), cv.w - 10, cv.h - 12, { align: 'right', font: fnt(11), color: theme.muted }); }
      function drawEarth(g, x, y, r, rot) { // seen from above the North Pole; rot = how far it has turned
        g.fillStyle = theme.water; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
        g.fillStyle = theme.ground;
        LAND.forEach(l => { g.beginPath(); g.arc(x + Math.cos(l[0] + rot) * l[1] * r, y - Math.sin(l[0] + rot) * l[1] * r, l[2] * r, 0, TAU); g.fill(); });
        g.restore();
        g.strokeStyle = K.withAlpha(theme.fg, 0.6); g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
      }
      function drawStar(g, x, y, r) {
        g.fillStyle = K.withAlpha(SUN, 0.22); g.beginPath(); g.arc(x, y, r * 1.35, 0, TAU); g.fill();
        g.fillStyle = SUN; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        g.strokeStyle = SUN_EDGE; g.lineWidth = 2; g.stroke();
      }
      const shotCol = s => theme['c' + (1 + s.idx % 8)];

      // ---------- scene: Newton's cannon ----------
      function drawCannon(g, V) {
        const w = V.w, h = V.h, Rpx = RE * V.ppm, topY = V.cy - R0 * V.ppm, baseY = V.cy - Rpx;
        const all = cn.cur ? cn.shots.concat([cn.cur]) : cn.shots, s = cn.cur;
        drawEarth(g, V.cx, V.cy, Rpx, 0.6);
        // the mountain with the cannon on its top
        const mh = Math.max(baseY - topY, 5), mw = Math.max(mh * 0.8, 5);
        g.fillStyle = theme.muted; g.beginPath(); g.moveTo(V.cx - mw, baseY + 1.5); g.lineTo(V.cx, baseY - mh); g.lineTo(V.cx + mw, baseY + 1.5); g.closePath(); g.fill();
        g.fillStyle = theme.fg; g.fillRect(V.cx - 3, baseY - mh - 4, 11, 4);
        // paths: older shots faint, the newest one bold
        all.forEach(q => {
          const cur = q === s, col = shotCol(q);
          g.save(); g.strokeStyle = cur ? col : K.withAlpha(col, 0.6); g.lineWidth = cur ? 2.5 : 1.5; g.lineJoin = 'round'; g.beginPath();
          for (let i = 0; i < q.pts.length; i++) { const X = V.cx + q.pts[i][0] * V.ppm, Y = V.cy - q.pts[i][1] * V.ppm; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
          g.stroke(); g.restore();
          if (q.state === 'landed') { g.fillStyle = col; g.beginPath(); g.arc(V.cx + q.x * V.ppm, V.cy - q.y * V.ppm, cur ? 4.5 : 3, 0, TAU); g.fill(); }
        });
        pill(g, K.tr({ en: '300 km mountain (exaggerated!)', hr: 'planina 300 km (pretjerano!)' }, lang), V.cx - mw - 8, topY - 12, 'right');
        if (s && s.state === 'landed' && s.land >= 1) {                 // the distance is measured along the curved ground
          g.strokeStyle = shotCol(s); g.lineWidth = 3; g.beginPath(); g.arc(V.cx, V.cy, Rpx + 3, -Math.PI / 2, -Math.PI / 2 + s.ang); g.stroke();
          const a = Math.atan2(s.y, s.x);
          pill(g, big(s.land, lang) + ' km', V.cx + Math.cos(a) * (Rpx + 22), V.cy - Math.sin(a) * (Rpx + 22), Math.cos(a) >= 0 ? 'left' : 'right');
        }
        if (s && (s.state === 'fly' || s.state === 'orbit')) {          // the ball with its velocity and the pull of gravity
          const X = V.cx + s.x * V.ppm, Y = V.cy - s.y * V.ppm, r = Math.hypot(s.x, s.y), sp = Math.hypot(s.vx, s.vy);
          const gl = K.clamp(34 * GM / (r * r) / G0, 6, 40), vl = 8 + sp / 1000 * 4.5;
          K.arrow(g, X, Y, X - s.x / r * gl, Y + s.y / r * gl, { color: theme.c1, width: 3, head: 8 });
          if (sp > 1) K.arrow(g, X, Y, X + s.vx / sp * vl, Y - s.vy / sp * vl, { color: theme.fg, width: 3, head: 8 });
          g.fillStyle = shotCol(s); g.beginPath(); g.arc(X, Y, 5, 0, TAU); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.stroke();
        } else {                                                         // the next shot
          const vl = cn.v * 5;
          if (vl > 2) K.arrow(g, V.cx + 9, topY - 2, V.cx + 9 + vl, topY - 2, { color: theme.fg, width: 3, head: 8 });
          pill(g, 'v₀ = ' + K.fmt(cn.v, 1, lang) + ' km/s', V.cx + 16 + vl, topY - 12, 'left');
        }
        // list of the shots so far
        let legW = 0;
        if (w >= 560 && all.length) {
          const rows = all.slice(-6).map(q => ({ q, t: K.fmt(q.v / 1000, 1, lang) + ' km/s · ' + K.tr(shortOutcome(q), lang) }));
          g.font = fnt(11, true); rows.forEach(r => { legW = Math.max(legW, g.measureText(r.t).width); });
          rows.forEach((r, i) => {
            g.fillStyle = shotCol(r.q); g.fillRect(w - 24 - legW, 10 + i * 15, 9, 9);
            label(g, r.t, w - 10 - legW, 15 + i * 15, { font: fnt(11, r.q === s) });
          });
          legW += 34;
        }
        header(g, K.tr(MODES[0].label, lang) + (s ? '  ·  v₀ = ' + K.fmt(s.v / 1000, 1, lang) + ' km/s' : ''),
          K.tr(s ? outcome(s) : { en: 'Choose a launch speed and press Fire!', hr: 'Odaberi brzinu i pritisni Ispali!' }, lang), w - 20 - legW);
        arrowKey(g, h - 12);
        corner(g, w >= 520 ? { en: 'Earth and paths to scale · no air', hr: 'Zemlja i putanje u mjerilu · bez zraka' } : { en: 'to scale', hr: 'u mjerilu' });
      }

      // ---------- scene: Sun and planet ----------
      function drawSunScene(g, V) {
        const w = V.w, h = V.h, o = sn.grav ? elements(sn, sunMu()) : null;
        const sx = V.cx, sy = V.cy, X = sx + sn.x * V.ppu, Y = sy - sn.y * V.ppu;
        const rs = K.clamp(V.ppu * 0.085, 6, 20) * Math.pow(sn.M, 0.3), pr = K.clamp(V.ppu * 0.04, 5, 9);
        const r = Math.hypot(sn.x, sn.y), sp = Math.hypot(sn.vx, sn.vy);
        if (o && o.bound) {                                              // the orbit gravity bends the planet into (dashed)
          g.save(); g.strokeStyle = theme.line; g.lineWidth = 1.5; g.setLineDash([5, 6]); g.beginPath();
          g.ellipse(sx - o.a * o.ex * V.ppu, sy + o.a * o.ey * V.ppu, o.a * V.ppu, Math.max(0.5, o.b * V.ppu), -Math.atan2(o.ey, o.ex), 0, TAU);
          g.stroke(); g.restore();
        }
        g.strokeStyle = theme.c2; g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath();   // the path so far
        for (let i = 0; i < sn.pts.length; i++) { const px = sx + sn.pts[i][0] * V.ppu, py = sy - sn.pts[i][1] * V.ppu; i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke();
        g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.arc(sx + V.ppu, sy, 4, 0, TAU); g.stroke();   // starting point
        if (!sn.grav && sn.off) {
          const ox = sx + sn.off.x * V.ppu, oy = sy - sn.off.y * V.ppu;
          g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.beginPath(); g.arc(ox, oy, 7, 0, TAU); g.stroke();
          if (sp > 1e-9) { g.save(); g.strokeStyle = K.withAlpha(theme.c6, 0.7); g.lineWidth = 2; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(X, Y); g.lineTo(X + sn.vx / sp * 2000, Y - sn.vy / sp * 2000); g.stroke(); g.restore(); }
          pill(g, K.tr({ en: 'gravity switched off here', hr: 'ovdje je gravitacija isključena' }, lang), ox, oy + 20, 'center');
        }
        drawStar(g, sx, sy, rs);
        if (sn.grav) {                                                   // the pair of forces: same size, opposite directions, on two bodies
          const d = Math.hypot(sx - X, sy - Y) || 1, ux = (sx - X) / d, uy = (sy - Y) / d;
          const len = Math.max(6, Math.min(K.clamp(30 * sn.M / (r * r), 10, 80), (d - rs - pr) / 2 - 5));
          K.arrow(g, X + ux * (pr + 2), Y + uy * (pr + 2), X + ux * (pr + 2 + len), Y + uy * (pr + 2 + len), { color: theme.c1, width: 3, head: 9 });
          K.arrow(g, sx - ux * (rs + 2), sy - uy * (rs + 2), sx - ux * (rs + 2 + len), sy - uy * (rs + 2 + len), { color: theme.c1, width: 3, head: 9 });
          label(g, 'F', X + ux * (pr + 4 + len / 2) - uy * 11, Y + uy * (pr + 4 + len / 2) + ux * 11, { align: 'center' });
          label(g, 'F', sx - ux * (rs + 4 + len / 2) - uy * 11, sy - uy * (rs + 4 + len / 2) + ux * 11, { align: 'center' });
          pill(g, K.tr({ en: 'force on the planet = force on the star = ', hr: 'sila na planet = sila na zvijezdu = ' }, lang) + sci(F0 * sn.M / (r * r), lang) + ' N', 10, 62, 'left');
        }
        if (sp > 1e-9 && !sn.lost) {
          const vl = K.clamp(34 * sp / TAU, 8, 90), vx = sn.vx / sp, vy = -sn.vy / sp;
          K.arrow(g, X + vx * (pr + 2), Y + vy * (pr + 2), X + vx * (pr + 2 + vl), Y + vy * (pr + 2 + vl), { color: theme.fg, width: 3, head: 9 });
          pill(g, 'v = ' + K.fmt(sp * AUYR_KMS, 1, lang) + ' km/s', X + vx * (pr + vl + 22), Y + vy * (pr + vl + 22), 'center');
        }
        if (sn.moon) {
          let mx = sn.mrx * V.ppu, my = -sn.mry * V.ppu;
          const md = Math.hypot(mx, my) || 1, minD = pr + 7;
          if (md < minD) { mx *= minD / md; my *= minD / md; }
          if (sn.grav) { g.strokeStyle = theme.line; g.lineWidth = 1; g.beginPath(); g.arc(X, Y, Math.max(md, minD), 0, TAU); g.stroke(); }
          g.fillStyle = MOONC; g.beginPath(); g.arc(X + mx, Y + my, 3.2, 0, TAU); g.fill(); g.strokeStyle = K.withAlpha(theme.fg, 0.7); g.lineWidth = 1; g.stroke();
        }
        drawEarth(g, X, Y, pr, 0.6);
        const l1 = K.tr({ en: 'Star: ', hr: 'Zvijezda: ' }, lang) + K.fmt(sn.M, 1, lang) + K.tr({ en: ' × Sun', hr: ' × Sunce' }, lang) + '  ·  ' + K.tr({ en: 'year ', hr: 'godina ' }, lang) + K.fmt(sn.t, 2, lang) +
          '  ·  ' + K.tr({ en: 'laps: ', hr: 'obilazaka: ' }, lang) + K.fmt(Math.max(0, Math.floor(sn.ang / TAU + 1e-6)), 0, lang);
        const l2 = sn.lost ? { en: 'The planet has left the picture' + (o && o.bound ? ' (it would return after ' + K.fmt(o.T, 0, 'en') + ' years)' : '') + '. Press Reset.', hr: 'Planet je izašao iz slike' + (o && o.bound ? ' (vratio bi se nakon ' + K.fmt(o.T, 0, 'hr') + ' god.)' : '') + '. Pritisni Vrati.' }
          : !sn.grav ? { en: 'Gravity is off: no force, so the planet moves in a straight line at constant speed.', hr: 'Gravitacija je isključena: nema sile pa se planet giba ravno stalnom brzinom.' }
            : o.bound ? { en: 'One lap takes ' + K.fmt(o.T, 2, 'en') + ' Earth years (Earth round the Sun = 1).', hr: 'Jedan obilazak traje ' + K.fmt(o.T, 2, 'hr') + ' Zemljine godine (Zemlja oko Sunca = 1).' }
              : { en: 'Too fast: the star\'s gravity cannot hold the planet, it escapes.', hr: 'Prebrzo: gravitacija zvijezde ne može zadržati planet, on bježi.' };
        header(g, l1, K.tr(l2, lang), w - 20);
        arrowKey(g, h - 12);
        corner(g, w >= 520 ? { en: 'sizes and distances not to scale', hr: 'veličine i udaljenosti nisu u mjerilu' } : { en: 'not to scale', hr: 'nije u mjerilu' });
      }

      // ---------- scene: satellites ----------
      function drawSat(g, V) {
        const w = V.w, h = V.h, q = satNums(), Rpx = RE * V.ppm, rpx = q.r * V.ppm, preset = PRESETS.filter(p => p.alt === sa.alt)[0];
        PRESETS.forEach(p => {                                           // the three well-known orbits for comparison
          const pp = (RE + p.alt * 1000) * V.ppm;
          if (p === preset || pp > V.vr * V.ppm) return;
          g.save(); g.setLineDash([4, 6]); g.lineWidth = 1; g.strokeStyle = theme.muted; g.beginPath(); g.arc(V.cx, V.cy, pp, 0, TAU); g.stroke(); g.restore();
          label(g, p.short, V.cx - pp * 0.707 - 3, V.cy + pp * 0.707 + 3, { align: 'right', font: fnt(10), color: theme.muted });
        });
        g.strokeStyle = K.withAlpha(theme.fg, 0.5); g.lineWidth = 1.5; g.beginPath(); g.arc(V.cx, V.cy, rpx, 0, TAU); g.stroke();
        drawEarth(g, V.cx, V.cy, Rpx, sa.rot);
        if (Rpx > 22) { g.fillStyle = theme.fg; g.beginPath(); g.arc(V.cx, V.cy, 2.5, 0, TAU); g.fill(); label(g, 'N', V.cx + 5, V.cy - 7); }
        // a place on the equator and the line straight up from it
        const cr = Math.cos(sa.rot), sr = Math.sin(sa.rot);
        g.save(); g.setLineDash([3, 5]); g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.moveTo(V.cx + cr * Rpx, V.cy - sr * Rpx); g.lineTo(V.cx + cr * rpx, V.cy - sr * rpx); g.stroke(); g.restore();
        g.fillStyle = theme.c2; g.beginPath(); g.arc(V.cx + cr * Rpx, V.cy - sr * Rpx, 5, 0, TAU); g.fill(); g.strokeStyle = theme.surface; g.lineWidth = 1.5; g.stroke();
        // the satellite, the pull of gravity on it and its velocity
        const ct = Math.cos(sa.th), sn2 = Math.sin(sa.th), X = V.cx + ct * rpx, Y = V.cy - sn2 * rpx;
        const gl = K.clamp(46 * q.g / G0, 5, 60), vl = 10 + q.v / 1000 * 5;
        K.arrow(g, X, Y, X - ct * gl, Y + sn2 * gl, { color: theme.c1, width: 3, head: 8 });
        K.arrow(g, X, Y, X - sn2 * vl, Y - ct * vl, { color: theme.fg, width: 3, head: 8 });
        g.save(); g.translate(X, Y); g.rotate(Math.atan2(-ct, -sn2));
        g.fillStyle = theme.c3; g.fillRect(-14, -3, 8, 6); g.fillRect(6, -3, 8, 6);
        g.fillStyle = theme.c5; K.roundRect(g, -6, -5, 12, 10, 2); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 1; g.stroke();
        g.restore();
        pill(g, 'v = ' + K.fmt(q.v / 1000, 2, lang) + ' km/s', X - sn2 * (vl + 12) + ct * 16, Y - ct * (vl + 12) - sn2 * 16, 'center');
        // numbers: a card on wide screens, one line on narrow ones
        const geo = Math.abs(q.T - DAY) / DAY < 0.01;
        const gTxt = 'g = ' + K.fmt(q.g, 2, lang) + ' m/s² = ' + K.fmt(q.pct, 0, lang) + ' % ' + K.tr({ en: 'of 9.81', hr: 'od 9,81' }, lang);
        if (V.wide) {
          const x0 = Math.round(w * 0.62) + 8, y0 = 46, cw = w - x0 - 10, ch = Math.min(h - y0 - 30, 172);
          g.fillStyle = K.withAlpha(theme.surface, 0.92); K.roundRect(g, x0, y0, cw, ch, 10); g.fill(); g.strokeStyle = theme.line; g.lineWidth = 1; g.stroke();
          const rows = ['r = R + h = ' + big(q.r / 1000, lang) + ' km', 'v = √(G·M/r) = ' + K.fmt(q.v / 1000, 2, lang) + ' km/s', 'T = 2π·r/v = ' + K.tr(dur(q.T), lang),
            K.tr({ en: 'laps per day: ', hr: 'obilazaka na dan: ' }, lang) + K.fmt(86400 / q.T, 1, lang), 'g = G·M/r² = ' + K.fmt(q.g, 2, lang) + ' m/s²'];
          const lh = Math.min(22, (ch - 54) / rows.length);
          rows.forEach((t, i) => K.text(g, t, x0 + 12, y0 + 16 + i * lh, { font: fit(g, t, cw - 24, 13, i === 4), color: theme.fg, baseline: 'middle' }));
          const by = y0 + 16 + rows.length * lh, bw = cw - 24;
          g.fillStyle = K.withAlpha(theme.fg, 0.1); g.fillRect(x0 + 12, by - 5, bw, 10);
          g.fillStyle = theme.c1; g.fillRect(x0 + 12, by - 5, bw * K.clamp(q.pct / 100, 0, 1), 10);
          const pt = K.fmt(q.pct, 0, lang) + ' % ' + K.tr({ en: 'of gravity on the ground', hr: 'gravitacije na tlu' }, lang);
          K.text(g, pt, x0 + 12, by + 17, { font: fit(g, pt, bw, 12, true), color: theme.fg, baseline: 'middle' });
        }
        const l2 = geo ? { en: 'One lap takes exactly one turn of the Earth, so it stays above the same place.', hr: 'Jedan obilazak traje točno jedan okret Zemlje pa ostaje iznad istog mjesta.' }
          : V.wide ? { en: 'The satellite is in free fall around the Earth: gravity is the only force on it.', hr: 'Satelit je u slobodnom padu oko Zemlje: gravitacija je jedina sila na njega.' } : { en: gTxt, hr: gTxt };
        header(g, K.tr({ en: 'Height ', hr: 'Visina ' }, lang) + big(sa.alt, lang) + ' km' + (preset ? '  ·  ' + K.tr(preset.name, lang) : '') + (V.wide ? '' : '  ·  T = ' + K.tr(dur(q.T), lang)), K.tr(l2, lang), w - 20);
        arrowKey(g, h - 12);
        const scale = q.T / satScreenT();
        const ts = '1 s = ' + (scale < 7200 ? K.fmt(scale / 60, 0, lang) + ' min' : K.fmt(scale / 3600, 1, lang) + ' h');
        corner(g, w >= 520 ? { en: 'Earth and orbit to scale · ' + ts, hr: 'Zemlja i orbita u mjerilu · ' + ts } : { en: ts, hr: ts });
      }

      function draw() {
        const g = cv.ctx;
        g.clearRect(0, 0, cv.w, cv.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, cv.w, cv.h);
        if (st.mode === 'cannon') drawCannon(g, viewCannon()); else if (st.mode === 'sun') drawSunScene(g, viewSun()); else drawSat(g, viewSat());
      }
      function step(dt) { if (st.mode === 'cannon') stepCannon(dt); else if (st.mode === 'sun') stepSun(dt); else stepSat(dt); }
      function reset() {
        L.stop(); clearCannon(); resetSat();
        sn.grav = true; tgGrav.set(true); resetSun();
        if (st.mode !== 'cannon' && !ctx.reducedMotion) L.start();
        updatePlay(); refresh();
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
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
