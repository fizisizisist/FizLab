/* FizLab sim: Circular motion — a ball on a string (let go and it flies straight!), the rotor ride,
   and a car on a bend that skids when friction cannot supply m·v²/r. */
(function () {
  'use strict';
  const K = window.SimKit;
  const G = 9.81;
  const ROTOR_R = 3;        // m, radius of the rotor drum
  const ROTOR_MU = 0.4;     // friction coefficient between the wall and the rider
  const PERSON_M = 60;      // kg
  const FLOOR_DROP = 1.2;   // m, how far the lowered floor is below the rider's feet
  const CAR_M = 1000;       // kg
  const SURFACES = [
    { id: 'dry', mu: 0.8, label: { en: 'Dry asphalt (μ = 0.8)', hr: 'Suhi asfalt (μ = 0,8)' } },
    { id: 'wet', mu: 0.5, label: { en: 'Wet road (μ = 0.5)', hr: 'Mokra cesta (μ = 0,5)' } },
    { id: 'ice', mu: 0.1, label: { en: 'Ice (μ = 0.1)', hr: 'Led (μ = 0,1)' } }
  ];
  const MODES = [
    { value: 'string', label: { en: 'Ball on a string', hr: 'Kuglica na niti' } },
    { value: 'rotor', label: { en: 'Rotor ride', hr: 'Rotor u lunaparku' } },
    { value: 'car', label: { en: 'Car on a bend', hr: 'Automobil u zavoju' } }
  ];

  window.Sims.register({
    id: 'circular',
    title: { en: 'Going Round in Circles', hr: 'Kružno gibanje' },
    summary: {
      en: 'Whirl a ball on a string and let go, ride the rotor, and drive a car round a bend. Where does the force point — and what happens without it?',
      hr: 'Zavrti kuglicu na niti i pusti je, provozaj se rotorom i provezi automobil kroz zavoj. Kamo pokazuje sila — i što se dogodi bez nje?'
    },
    tasks: [
      { en: 'Before you press "Let go!", guess where the ball will fly. Then check. Was it a straight line?', hr: 'Prije nego pritisneš „Pusti!”, pogodi kamo će kuglica odletjeti. Zatim provjeri. Je li to bila ravna crta?' },
      { en: 'Double the speed of the ball. How many times bigger does the force F = m·v²/r become?', hr: 'Udvostruči brzinu kuglice. Koliko puta se poveća sila F = m·v²/r?' },
      { en: 'In the rotor, slow down until the rider slides. Which force got too small — and in which direction does the wall push?', hr: 'U rotoru usporavaj dok osoba ne proklizi. Koja je sila postala premala — i u kojem smjeru gura zid?' },
      { en: 'Car on a bend: find the fastest speed for a 30 m bend on dry road, then switch to ice. What changes?', hr: 'Automobil u zavoju: nađi najveću brzinu za zavoj od 30 m na suhoj cesti, pa prebaci na led. Što se mijenja?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme;
      const cv = K.createCanvas(container, { aspect: 16 / 9, minHeight: 280, maxHeight: 480 });
      const C = K.controls(container, lang);

      const st = {
        mode: 'string', t: 0,
        r: 1, v: 3, m: 0.5, phi: -Math.PI / 2, released: false, relPhi: 0, relPos: null, pos: null, vel: null, showMistake: true,
        rv: 10, rphi: 0, slide: 0, slideV: 0, onFloor: false,
        cr: 30, cvel: 15, surf: SURFACES[0], cphi: Math.PI, skid: false, skidPos: null, cpos: null, cv: null
      };

      // ---------- controls ----------
      const fieldOf = c => (c.el.classList.contains('sk-field') || c.el.classList.contains('sk-note')) ? c.el : c.el.parentElement;
      const show = (c, on) => { fieldOf(c).style.display = on ? '' : 'none'; };

      C.segmented({ label: { en: 'Mode', hr: 'Način' }, options: MODES, value: 'string', onChange: v => { st.mode = v; applyMode(); reset(); } });
      const slR = C.slider({ label: { en: 'Radius (string length)', hr: 'Polumjer (duljina niti)' }, min: 0.5, max: 2, step: 0.1, value: 1, unit: 'm', digits: 1, onChange: v => { st.r = v; if (st.released) clearRun(); refresh(); } });
      const slV = C.slider({ label: { en: 'Speed', hr: 'Brzina' }, min: 1, max: 8, step: 0.5, value: 3, unit: 'm/s', digits: 1, onChange: v => { st.v = v; if (st.released) clearRun(); refresh(); } });
      const slM = C.slider({ label: { en: 'Mass', hr: 'Masa' }, min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'kg', digits: 1, onChange: v => { st.m = v; refresh(); } });
      const tgMistake = C.toggle({ label: { en: 'Show common mistake', hr: 'Pokaži čestu pogrešku' }, value: true, onChange: v => { st.showMistake = v; draw(); } });
      const btnGo = C.button({ label: { en: 'Let go!', hr: 'Pusti!' }, variant: 'primary', onClick: () => {
        if (st.mode !== 'string' || st.released) return;
        release(); if (!L.running) { L.start(); updatePlay(); } refresh();
      } });
      const slRV = C.slider({ label: { en: 'Wall speed', hr: 'Brzina zida' }, min: 0, max: 14, step: 0.5, value: 10, unit: 'm/s', digits: 1, onChange: v => { st.rv = v; refresh(); } });
      const slCR = C.slider({ label: { en: 'Bend radius', hr: 'Polumjer zavoja' }, min: 10, max: 60, step: 5, value: 30, unit: 'm', digits: 0, onChange: v => { st.cr = v; if (st.skid) clearRun(); refresh(); } });
      const slCV = C.slider({ label: { en: 'Car speed', hr: 'Brzina automobila' }, min: 0, max: 30, step: 1, value: 15, unit: 'm/s', digits: 0,
        format: (v, l) => K.fmt(v, 0, l) + ' m/s (' + K.fmt(v * 3.6, 0, l) + ' km/h)', onChange: v => { st.cvel = v; refresh(); } });
      const selSurf = C.select({ label: { en: 'Road surface', hr: 'Podloga' }, options: SURFACES.map(s => ({ value: s.id, label: s.label })), value: 'dry',
        onChange: v => { st.surf = SURFACES.find(s => s.id === v) || SURFACES[0]; refresh(); } });
      const btnPlay = C.button({ label: { en: 'Play', hr: 'Pokreni' }, onClick: () => {
        if (finished()) clearRun();
        L.toggle(); updatePlay(); refresh();
      } });
      C.button({ label: { en: 'Reset', hr: 'Vrati' }, onClick: () => reset() });
      // readouts (one set per mode; the others are hidden)
      const roS = [
        C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Centripetal force', hr: 'Centripetalna sila' }, unit: 'N', digits: 2 }),
        C.readout({ label: { en: 'Period T', hr: 'Period T' }, unit: 's', digits: 2 }),
        C.readout({ label: { en: 'Frequency f', hr: 'Frekvencija f' }, unit: 'Hz', digits: 2 })
      ];
      const roR = [
        C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Wall push (normal force)', hr: 'Sila zida (normalna sila)' }, unit: 'N', digits: 0 }),
        C.readout({ label: { en: 'Friction needed (= weight)', hr: 'Potrebno trenje (= težina)' }, unit: 'N', digits: 0 }),
        C.readout({ label: { en: 'Friction available', hr: 'Raspoloživo trenje' }, unit: 'N', digits: 0 })
      ];
      const roC = [
        C.readout({ label: { en: 'Speed', hr: 'Brzina' }, unit: 'm/s', digits: 1 }),
        C.readout({ label: { en: 'Force needed m·v²/r', hr: 'Potrebna sila m·v²/r' }, unit: 'N', digits: 0 }),
        C.readout({ label: { en: 'Max friction μ·m·g', hr: 'Najveće trenje μ·m·g' }, unit: 'N', digits: 0 }),
        C.readout({ label: { en: 'Max safe speed', hr: 'Najveća sigurna brzina' }, unit: 'm/s', digits: 1 })
      ];
      const note = C.note({ text: { en: '', hr: '' } });

      // ---------- physics helpers ----------
      const fString = () => st.m * st.v * st.v / st.r;
      const period = () => 2 * Math.PI * st.r / st.v;
      const rotorN = () => PERSON_M * st.rv * st.rv / ROTOR_R;
      const rotorFmax = () => ROTOR_MU * rotorN();
      const rotorVmin = () => Math.sqrt(G * ROTOR_R / ROTOR_MU);
      const carNeeded = () => CAR_M * st.cvel * st.cvel / st.cr;
      const carMax = () => st.surf.mu * CAR_M * G;
      const carVmax = () => Math.sqrt(st.surf.mu * G * st.cr);

      function applyMode() {
        const m = st.mode;
        [slR, slV, slM, tgMistake, btnGo].forEach(c => show(c, m === 'string'));
        show(slRV, m === 'rotor');
        [slCR, slCV, selSurf].forEach(c => show(c, m === 'car'));
        roS.forEach(c => show(c, m === 'string')); roR.forEach(c => show(c, m === 'rotor')); roC.forEach(c => show(c, m === 'car'));
      }
      function finished() { return (st.mode === 'string' && st.released && !L.running && st.t > 0 && st.flightDone) || (st.mode === 'car' && st.skid && st.skidDone); }
      function clearRun() {
        st.t = 0;
        st.phi = -Math.PI / 2; st.released = false; st.relPos = null; st.pos = null; st.vel = null; st.flightDone = false;
        st.rphi = 0; st.slide = 0; st.slideV = 0; st.onFloor = false;
        st.cphi = Math.PI; st.skid = false; st.skidPos = null; st.cpos = null; st.cv = null; st.skidDone = false;
      }
      function reset() { L.stop(); clearRun(); updatePlay(); refresh(); }
      function refresh() { updateOut(); draw(); }
      function updatePlay() { btnPlay.setLabel(L.running ? { en: 'Pause', hr: 'Pauza' } : { en: 'Play', hr: 'Pokreni' }); }
      function release() {
        st.released = true; st.relPhi = st.phi;
        st.relPos = { x: st.r * Math.cos(st.phi), y: st.r * Math.sin(st.phi) };
        st.pos = { x: st.relPos.x, y: st.relPos.y };
        st.vel = { x: -Math.sin(st.phi) * st.v, y: Math.cos(st.phi) * st.v };
      }
      function step(dt) {
        if (dt <= 0) return;
        st.t += dt;
        const V = view(), far = Math.hypot(V.w, V.h) / V.ppm;
        if (st.mode === 'string') {
          if (!st.released) st.phi += st.v / st.r * dt;              // ω = v / r
          else {
            st.pos.x += st.vel.x * dt; st.pos.y += st.vel.y * dt;    // no force: straight line, constant velocity
            if (Math.hypot(st.pos.x, st.pos.y) > far) { st.flightDone = true; L.stop(); updatePlay(); }
          }
        } else if (st.mode === 'rotor') {
          st.rphi += st.rv / ROTOR_R * dt;
          if (!st.onFloor) {
            const lack = PERSON_M * G - rotorFmax();                 // weight minus the most friction the wall can give
            if (lack > 0) {
              st.slideV += lack / PERSON_M * dt; st.slide += st.slideV * dt;
              if (st.slide >= FLOOR_DROP) { st.slide = FLOOR_DROP; st.slideV = 0; st.onFloor = true; }
            } else st.slideV = 0;
          }
        } else {
          if (!st.skid) {
            if (st.cvel > 0 && carNeeded() > carMax()) {              // friction cannot bend the path any more
              st.skid = true;
              st.skidPos = { x: st.cr * Math.cos(st.cphi), y: st.cr * Math.sin(st.cphi) };
              st.cpos = { x: st.skidPos.x, y: st.skidPos.y };
              st.cv = { x: -Math.sin(st.cphi) * st.cvel, y: Math.cos(st.cphi) * st.cvel };
            } else st.cphi += st.cvel / st.cr * dt;
          }
          if (st.skid) {
            const sp = Math.hypot(st.cv.x, st.cv.y);
            if (sp > 0.02) {
              const ns = Math.max(0, sp - st.surf.mu * G * dt);        // sliding friction slows the skid
              st.cv.x *= ns / sp; st.cv.y *= ns / sp;
              st.cpos.x += st.cv.x * dt; st.cpos.y += st.cv.y * dt;
            }
            if (sp <= 0.02 || Math.hypot(st.cpos.x, st.cpos.y) > far) { st.skidDone = true; L.stop(); updatePlay(); }
          }
        }
      }
      function updateOut() {
        if (st.mode === 'string') {
          roS[0].set(st.v); roS[1].set(st.released ? 0 : fString()); roS[2].set(period()); roS[3].set(1 / period());
          note.set(st.released
            ? { en: 'No string, no force: the ball keeps its velocity and flies straight along the tangent at constant speed (inertia). It does not curve on by itself.',
              hr: 'Nema niti, nema sile: kuglica zadržava brzinu i leti ravno po tangenti stalnom brzinom (tromost). Ne nastavlja sama zavijati.' }
            : { en: 'The string pulls towards the centre. That force only changes the direction of the velocity, not its size.',
              hr: 'Nit vuče prema središtu. Ta sila mijenja samo smjer brzine, ne njezin iznos.' });
        } else if (st.mode === 'rotor') {
          const N = rotorN(), fmax = rotorFmax(), need = PERSON_M * G;
          roR[0].set(st.rv); roR[1].set(N); roR[2].set(need); roR[3].set(fmax);
          roR[3].setColor(fmax >= need ? theme.good : theme.bad);
          note.set({ en: 'Seen from the ground, the only horizontal force on the rider is the wall pushing inward (towards the centre). The "centrifugal force" pushing outward is how it feels inside the spinning room — it is not a real push.',
            hr: 'Gledano sa zemlje, jedina vodoravna sila na osobu je zid koji je gura prema unutra (prema središtu). „Centrifugalna sila” prema van jest ono što se osjeća u vrtećoj sobi — nije stvarna sila.' });
        } else {
          const need = carNeeded(), fmax = carMax();
          roC[0].set(st.skid ? Math.hypot(st.cv.x, st.cv.y) : st.cvel); roC[1].set(need); roC[2].set(fmax); roC[3].set(carVmax());
          roC[1].setColor(need > fmax ? theme.bad : theme.good);
          note.set({ en: 'Friction between the tyres and the road is what turns the car: it has to supply m·v²/r. If the road cannot give that much (wet, ice, too fast, tight bend), the car carries straight on — it skids.',
            hr: 'Trenje između guma i ceste zakreće automobil: ono mora dati m·v²/r. Ako cesta ne može dati toliko (mokro, led, prebrzo, oštar zavoj), automobil nastavlja ravno — proklizava.' });
        }
      }

      // ---------- geometry ----------
      function view() {
        const w = cv.w, h = cv.h;
        if (st.mode === 'string') return { w, h, ppm: Math.min(w * 0.5, h * 0.42) / 2, cx: w * 0.5, cy: h * 0.53 };
        if (st.mode === 'car') return { w, h, ppm: Math.min(w * 0.42, h * 0.4) / st.cr, cx: w * 0.5, cy: h * 0.54 };
        const split = w >= 560;
        const topR = split ? Math.min(w * 0.2, h * 0.34) : Math.min(w * 0.14, h * 0.18);
        return { w, h, ppm: topR / ROTOR_R, split, topR, cx: split ? w * 0.26 : topR + 18, cy: split ? h * 0.56 : topR + 44,
          side: { x0: split ? w * 0.52 : 2 * topR + 40, x1: w - 16 } };
      }
      const SX = (V, x) => V.cx + x * V.ppm, SY = (V, y) => V.cy - y * V.ppm;

      // tap the ball to let go
      function onDown(ev) {
        if (st.mode !== 'string' || st.released) return;
        const V = view(), p = cv.pointer(ev);
        const bx = SX(V, st.r * Math.cos(st.phi)), by = SY(V, st.r * Math.sin(st.phi));
        if (Math.hypot(p.x - bx, p.y - by) > 26) return;
        release(); if (!L.running) { L.start(); updatePlay(); } refresh();
      }
      cv.canvas.addEventListener('pointerdown', onDown);

      // ---------- drawing ----------
      function label(g, txt, x, y, o) { K.text(g, txt, x, y, Object.assign({ font: 'bold 11px ' + theme.font, color: theme.fg, baseline: 'middle' }, o || {})); }
      function pill(g, txt, x, y, align) {
        g.font = 'bold 11px ' + theme.font;
        const tw = g.measureText(txt).width, tx = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
        g.fillStyle = K.withAlpha(theme.surface, 0.85); K.roundRect(g, tx - 4, y - 8, tw + 8, 16, 5); g.fill();
        label(g, txt, tx, y);
      }
      function drawString(g, V) {
        const w = V.w, h = V.h, rpx = st.r * V.ppm;
        // the circular path
        g.save(); g.strokeStyle = theme.line; g.lineWidth = 1.5; g.setLineDash([5, 5]); g.beginPath(); g.arc(V.cx, V.cy, rpx, 0, Math.PI * 2); g.stroke(); g.restore();
        // hand at the centre
        g.fillStyle = theme.fg; g.beginPath(); g.arc(V.cx, V.cy, 7, 0, Math.PI * 2); g.fill();
        label(g, K.tr({ en: 'hand', hr: 'ruka' }, lang), V.cx, V.cy + 18, { align: 'center', color: theme.muted, font: '11px ' + theme.font });
        const phi = st.released ? st.relPhi : st.phi;
        const bx = st.released ? SX(V, st.pos.x) : SX(V, st.r * Math.cos(phi)), by = st.released ? SY(V, st.pos.y) : SY(V, st.r * Math.sin(phi));
        const tx = -Math.sin(phi), ty = Math.cos(phi);                  // tangent (direction of travel), world coords
        const rx = SX(V, st.relPos ? st.relPos.x : st.r * Math.cos(phi)), ry = SY(V, st.relPos ? st.relPos.y : st.r * Math.sin(phi));
        if (!st.released) {
          g.strokeStyle = theme.fg; g.lineWidth = 2; g.beginPath(); g.moveTo(V.cx, V.cy); g.lineTo(bx, by); g.stroke();
          if (st.showMistake) {   // prediction: if you let go now, it goes straight along the tangent
            g.save(); g.strokeStyle = K.withAlpha(theme.c6, 0.7); g.lineWidth = 2; g.setLineDash([8, 6]); g.beginPath();
            g.moveTo(bx, by); g.lineTo(bx + tx * 600, by - ty * 600); g.stroke(); g.restore();
            pill(g, K.tr({ en: 'if you let go: straight on', hr: 'ako pustiš: ravno dalje' }, lang), bx + tx * 70 + 10, by - ty * 70 - 10, 'left');
          }
        } else {
          // slack string, release point, the real straight path and the "expected" curved one
          g.save(); g.strokeStyle = theme.muted; g.lineWidth = 2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(V.cx, V.cy); g.lineTo(rx, ry); g.stroke(); g.restore();
          g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.arc(rx, ry, 6, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = theme.c6; g.lineWidth = 2.5; g.beginPath(); g.moveTo(rx, ry); g.lineTo(bx, by); g.stroke();
          g.save(); g.strokeStyle = K.withAlpha(theme.c6, 0.5); g.lineWidth = 2; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + tx * 900, by - ty * 900); g.stroke(); g.restore();
          pill(g, K.tr({ en: 'straight along the tangent', hr: 'ravno po tangenti' }, lang), rx + tx * 40 - ty * 16, ry - ty * 40 - tx * 16, 'center');
          if (st.showMistake) {
            g.save(); g.strokeStyle = K.withAlpha(theme.c8, 0.7); g.lineWidth = 2; g.setLineDash([3, 6]); g.beginPath();
            let lx = 0, ly = 0;
            for (let k = 0; k <= 70; k++) { const a = phi + k * 0.045, rr = rpx * (1 + k * 0.012); lx = V.cx + rr * Math.cos(a); ly = V.cy - rr * Math.sin(a); k ? g.lineTo(lx, ly) : g.moveTo(lx, ly); }
            g.stroke(); g.restore();
            pill(g, K.tr({ en: 'not this', hr: 'ne ovako' }, lang), lx, ly, 'center');
          }
        }
        // ball, velocity arrow, force arrow
        g.fillStyle = theme.c5; g.beginPath(); g.arc(bx, by, 11, 0, Math.PI * 2); g.fill(); g.strokeStyle = theme.fg; g.lineWidth = 1.5; g.stroke();
        const vlen = 14 + st.v * 11;
        K.arrow(g, bx + tx * 12, by - ty * 12, bx + tx * (12 + vlen), by - ty * (12 + vlen), { color: theme.fg, width: 3, head: 9 });
        pill(g, 'v = ' + K.fmt(st.v, 1, lang) + ' m/s', bx + tx * (vlen + 24) + ty * 14, by - ty * (vlen + 24) + tx * 14, 'center');
        if (!st.released) {
          const F = fString(), flen = K.clamp(12 + F * 2.5, 16, rpx * 0.85), ux = (V.cx - bx) / rpx, uy = (V.cy - by) / rpx;
          K.arrow(g, bx + ux * 12, by + uy * 12, bx + ux * (12 + flen), by + uy * (12 + flen), { color: theme.c1, width: 3, head: 9 });
          pill(g, 'F = m·v²/r = ' + K.fmt(F, 1, lang) + ' N', bx + ux * (flen / 2 + 12) - uy * 16, by + uy * (flen / 2 + 12) + ux * 16, 'center');
        }
        // header
        label(g, K.tr({ en: 'top view', hr: 'pogled odozgo' }, lang) + '   t = ' + K.fmt(st.t, 1, lang) + ' s', 10, 14, { font: 'bold 13px ' + theme.fontDisplay });
        label(g, 'F = m·v²/r = ' + K.fmt(st.m, 1, lang) + ' kg · (' + K.fmt(st.v, 1, lang) + ' m/s)² / ' + K.fmt(st.r, 1, lang) + ' m = ' + K.fmt(fString(), 1, lang) + ' N', 10, 32, { font: '12px ' + theme.font });
        label(g, 'T = 2π·r/v = ' + K.fmt(period(), 2, lang) + ' s     f = 1/T = ' + K.fmt(1 / period(), 2, lang) + ' Hz', 10, 48, { font: '12px ' + theme.font });
        if (w > 0 && h > 0 && st.released) label(g, K.tr({ en: 'constant speed, straight line', hr: 'stalna brzina, ravna crta' }, lang), w - 10, 14, { align: 'right', color: theme.muted, font: '11px ' + theme.font });
      }
      function drawPerson(g, x, feetY, hpx, color) { // simple rider, x = body centre
        const bw = hpx * 0.26, bh = hpx * 0.6, headR = hpx * 0.1;
        g.fillStyle = color; K.roundRect(g, x - bw / 2, feetY - hpx * 0.8, bw, bh, bw * 0.3); g.fill();
        g.fillRect(x - bw * 0.4, feetY - hpx * 0.22, bw * 0.3, hpx * 0.22); g.fillRect(x + bw * 0.1, feetY - hpx * 0.22, bw * 0.3, hpx * 0.22);
        g.beginPath(); g.arc(x, feetY - hpx * 0.8 - headR - 2, headR, 0, Math.PI * 2); g.fill();
      }
      function drawRotor(g, V) {
        const w = V.w, h = V.h, N = rotorN(), fmax = rotorFmax(), need = PERSON_M * G, holds = fmax >= need;
        // --- top view: drum, rider, inward push, velocity
        g.strokeStyle = theme.fg; g.lineWidth = 4; g.beginPath(); g.arc(V.cx, V.cy, V.topR, 0, Math.PI * 2); g.stroke();
        g.fillStyle = K.withAlpha(theme.surface2, 0.5); g.fill();
        g.fillStyle = theme.muted; g.beginPath(); g.arc(V.cx, V.cy, 3, 0, Math.PI * 2); g.fill();
        const px = V.cx + V.topR * Math.cos(st.rphi), py = V.cy - V.topR * Math.sin(st.rphi);
        const ux = (V.cx - px) / V.topR, uy = (V.cy - py) / V.topR;
        g.fillStyle = theme.c5; g.beginPath(); g.arc(px + ux * 7, py + uy * 7, 7, 0, Math.PI * 2); g.fill();
        const nlen = K.clamp(V.topR * 0.15 + N / need * V.topR * 0.3, 12, V.topR * 0.85);
        K.arrow(g, px + ux * 14, py + uy * 14, px + ux * (14 + nlen), py + uy * (14 + nlen), { color: theme.c1, width: 3, head: 8 });
        if (st.rv > 0.1) { const vl = 10 + st.rv * (V.split ? 4 : 2); K.arrow(g, px - uy * 10, py + ux * 10, px - uy * (10 + vl), py + ux * (10 + vl), { color: theme.fg, width: 2.5, head: 8 }); }
        label(g, K.tr({ en: 'top view', hr: 'pogled odozgo' }, lang), V.cx, V.cy + V.topR + 14, { align: 'center', color: theme.muted, font: '11px ' + theme.font });
        if (V.split) label(g, 'N = m·v²/r = ' + K.fmt(N, 0, lang) + ' N', V.cx, V.cy, { align: 'center' });
        // --- side view: wall on the right, axis on the left, lowered floor
        const S = V.side, topY = 30, floorY = h - 36, pps = (floorY - topY) / 3.1;   // px per metre (side view)
        const wallX = S.x1 - 26, axisX = S.x0 + 22;
        g.fillStyle = theme.ground; g.fillRect(S.x0, floorY, S.x1 - S.x0, h - floorY);
        g.fillStyle = theme.surface2; g.fillRect(wallX, topY, 22, floorY - topY); g.strokeStyle = theme.fg; g.lineWidth = 2; g.strokeRect(wallX, topY, 22, floorY - topY);
        g.save(); g.strokeStyle = theme.muted; g.setLineDash([5, 5]); g.lineWidth = 1; g.beginPath(); g.moveTo(axisX, topY); g.lineTo(axisX, floorY); g.stroke(); g.restore();
        label(g, K.tr({ en: 'axis', hr: 'os' }, lang), axisX, topY - 8, { align: 'center', color: theme.muted, font: '11px ' + theme.font });
        label(g, K.tr({ en: 'wall', hr: 'zid' }, lang), wallX + 11, topY - 8, { align: 'center', color: theme.muted, font: '11px ' + theme.font });
        label(g, K.tr({ en: 'side view', hr: 'pogled sa strane' }, lang), S.x1, h - 10, { align: 'right', color: theme.muted, font: '11px ' + theme.font });
        const hpx = 1.7 * pps, feetY = floorY - (FLOOR_DROP - st.slide) * pps, bodyX = wallX - 0.22 * pps, cyB = feetY - hpx * 0.5;
        drawPerson(g, bodyX, feetY, hpx, theme.c5);
        // forces on the rider: N towards the axis (c1), friction up (c2), weight down (c7)
        const fscale = 0.9 * pps / need;   // px per newton: the weight arrow is ~0.9 m tall
        const nl = K.clamp(N * fscale, 10, bodyX - axisX - 10);
        K.arrow(g, bodyX, cyB, bodyX - nl, cyB, { color: theme.c1, width: 3, head: 9 });
        pill(g, K.tr({ en: 'wall push N = ', hr: 'sila zida N = ' }, lang) + K.fmt(N, 0, lang) + ' N', bodyX - nl / 2, cyB - 14, 'center');
        const fr = Math.min(fmax, need), fl = Math.max(6, fr * fscale), wl = need * fscale;
        K.arrow(g, bodyX - 10, cyB, bodyX - 10, cyB - fl, { color: theme.c2, width: 3, head: 9 });
        K.arrow(g, bodyX + 10, cyB, bodyX + 10, cyB + wl, { color: theme.c7, width: 3, head: 9 });
        pill(g, K.tr({ en: 'friction ', hr: 'trenje ' }, lang) + K.fmt(fr, 0, lang) + ' N', bodyX - 24, cyB - fl - 10, 'right');
        pill(g, K.tr({ en: 'weight ', hr: 'težina ' }, lang) + K.fmt(need, 0, lang) + ' N', bodyX - 24, cyB + wl + 8, 'right');
        const status = st.onFloor ? { en: 'on the floor', hr: 'na podu' } : holds ? { en: 'holds: friction = weight', hr: 'drži: trenje = težina' } : { en: 'slides down! friction < weight', hr: 'klizi prema dolje! trenje < težina' };
        label(g, K.tr(status, lang), S.x0, 14, { color: holds && !st.onFloor ? theme.good : theme.bad, font: 'bold 13px ' + theme.fontDisplay });
        const vminTxt = w >= 760
          ? K.tr({ en: 'minimum speed to hold: ', hr: 'najmanja brzina da drži: ' }, lang) + K.fmt(rotorVmin(), 1, lang) + ' m/s  (μ = ' + K.fmt(ROTOR_MU, 1, lang) + ', m = ' + K.fmt(PERSON_M, 0, lang) + ' kg, r = ' + K.fmt(ROTOR_R, 0, lang) + ' m)'
          : K.tr({ en: 'min. speed ', hr: 'najmanja brzina ' }, lang) + K.fmt(rotorVmin(), 1, lang) + ' m/s (μ = ' + K.fmt(ROTOR_MU, 1, lang) + ')';
        label(g, vminTxt, S.x0, 32, { color: theme.muted, font: '11px ' + theme.font });
      }
      function drawCar(g, V) {
        const w = V.w, h = V.h, rpx = st.cr * V.ppm, need = carNeeded(), fmax = carMax(), roadW = Math.max(12, 6 * V.ppm);
        // ring road
        g.strokeStyle = theme.surface2; g.lineWidth = roadW; g.beginPath(); g.arc(V.cx, V.cy, rpx, 0, Math.PI * 2); g.stroke();
        g.save(); g.strokeStyle = theme.line; g.lineWidth = 1.5; g.setLineDash([8, 8]); g.beginPath(); g.arc(V.cx, V.cy, rpx, 0, Math.PI * 2); g.stroke(); g.restore();
        g.fillStyle = theme.muted; g.beginPath(); g.arc(V.cx, V.cy, 3, 0, Math.PI * 2); g.fill();
        g.save(); g.strokeStyle = theme.muted; g.setLineDash([3, 5]); g.lineWidth = 1; g.beginPath(); g.moveTo(V.cx, V.cy); g.lineTo(V.cx + rpx * Math.cos(-0.6), V.cy - rpx * Math.sin(-0.6)); g.stroke(); g.restore();
        label(g, 'r = ' + K.fmt(st.cr, 0, lang) + ' m', V.cx + rpx * 0.5 * Math.cos(-0.6) + 6, V.cy - rpx * 0.5 * Math.sin(-0.6) + 10);
        // car position and heading
        let cx, cy, hx, hy, spd;
        if (st.skid) { cx = SX(V, st.cpos.x); cy = SY(V, st.cpos.y); spd = Math.hypot(st.cv.x, st.cv.y); hx = spd > 1e-6 ? st.cv.x / spd : -Math.sin(st.cphi); hy = spd > 1e-6 ? st.cv.y / spd : Math.cos(st.cphi); }
        else { cx = SX(V, st.cr * Math.cos(st.cphi)); cy = SY(V, st.cr * Math.sin(st.cphi)); hx = -Math.sin(st.cphi); hy = Math.cos(st.cphi); spd = st.cvel; }
        if (st.skid) {   // skid trail: straight on from where friction gave up
          g.strokeStyle = theme.c8; g.lineWidth = 3; g.beginPath(); g.moveTo(SX(V, st.skidPos.x), SY(V, st.skidPos.y)); g.lineTo(cx, cy); g.stroke();
        }
        const cl = Math.max(18, 4.2 * V.ppm), cw = Math.max(9, 1.9 * V.ppm);
        g.save(); g.translate(cx, cy); g.rotate(Math.atan2(-hy, hx));
        g.fillStyle = theme.c5; K.roundRect(g, -cl / 2, -cw / 2, cl, cw, cw * 0.25); g.fill();
        g.fillStyle = theme.sky; g.fillRect(cl * 0.05, -cw * 0.35, cl * 0.22, cw * 0.7); g.fillRect(-cl * 0.35, -cw * 0.35, cl * 0.18, cw * 0.7);
        g.restore();
        // velocity arrow and the force the road must supply
        if (spd > 0.05) { const vl = 12 + spd * 3; K.arrow(g, cx + hx * cl * 0.6, cy - hy * cl * 0.6, cx + hx * (cl * 0.6 + vl), cy - hy * (cl * 0.6 + vl), { color: theme.fg, width: 3, head: 9 }); pill(g, 'v = ' + K.fmt(spd, 1, lang) + ' m/s', cx + hx * (cl * 0.6 + vl + 10) - hy * 14, cy - hy * (cl * 0.6 + vl + 10) - hx * 14, 'center'); }
        if (!st.skid && st.cvel > 0) {
          const ux = (V.cx - cx) / rpx, uy = (V.cy - cy) / rpx, fl = K.clamp(need / (CAR_M * G) * 130, 10, rpx * 0.8);
          K.arrow(g, cx + ux * cw, cy + uy * cw, cx + ux * (cw + fl), cy + uy * (cw + fl), { color: theme.c1, width: 3, head: 9 });
          pill(g, 'F = m·v²/r = ' + K.fmt(need, 0, lang) + ' N', cx + ux * (cw + fl + 8) - uy * 14, cy + uy * (cw + fl + 8) + ux * 14, 'center');
        } else if (st.skid) {
          pill(g, K.tr({ en: 'skids!', hr: 'proklizava!' }, lang), cx, cy - cl * 0.7 - 10, 'center');
        }
        // header + bars: needed vs available
        label(g, K.tr({ en: 'top view', hr: 'pogled odozgo' }, lang) + '   ' + K.tr(st.surf.label, lang), 10, 14, { font: 'bold 13px ' + theme.fontDisplay });
        label(g, K.tr({ en: 'max safe speed √(μ·g·r) = ', hr: 'najveća sigurna brzina √(μ·g·r) = ' }, lang) + K.fmt(carVmax(), 1, lang) + ' m/s (' + K.fmt(carVmax() * 3.6, 0, lang) + ' km/h)', 10, 32, { font: '12px ' + theme.font });
        const statusTxt = K.tr(need > fmax ? { en: 'friction is not enough → skids', hr: 'trenje nije dovoljno → proklizava' } : { en: 'friction is enough → turns', hr: 'trenje je dovoljno → zakreće' }, lang);
        if (w >= 560) {
          const bw = Math.min(150, w * 0.3), bx = w - bw - 70, by = 8, mx = Math.max(need, fmax, 1);
          [[{ en: 'needed m·v²/r', hr: 'potrebno m·v²/r' }, need, theme.c1], [{ en: 'max friction μ·m·g', hr: 'najveće trenje μ·m·g' }, fmax, theme.c2]].forEach((r, i) => {
            const y = by + i * 30;
            label(g, K.tr(r[0], lang), bx, y + 5, { font: '11px ' + theme.font });
            g.fillStyle = K.withAlpha(theme.fg, 0.08); g.fillRect(bx, y + 12, bw, 10);
            g.fillStyle = r[2]; g.fillRect(bx, y + 12, bw * K.clamp(r[1] / mx, 0, 1), 10);
            label(g, K.fmt(r[1], 0, lang) + ' N', bx + bw + 6, y + 17, { font: '11px ' + theme.font });
          });
          label(g, statusTxt, bx, by + 70, { color: need > fmax ? theme.bad : theme.good, font: 'bold 11px ' + theme.font });
        } else label(g, statusTxt, 10, 50, { color: need > fmax ? theme.bad : theme.good, font: 'bold 11px ' + theme.font });
        label(g, 'm = ' + K.fmt(CAR_M, 0, lang) + ' kg', w - 10, h - 10, { align: 'right', color: theme.muted, font: '11px ' + theme.font });
      }
      function draw() {
        const g = cv.ctx, V = view();
        g.clearRect(0, 0, V.w, V.h);
        g.fillStyle = theme.sky; g.fillRect(0, 0, V.w, V.h);
        if (st.mode === 'string') drawString(g, V); else if (st.mode === 'rotor') drawRotor(g, V); else drawCar(g, V);
      }

      const L = K.loop(dt => { step(dt); updateOut(); draw(); });
      cv.onResize(draw);
      applyMode();
      reset();
      if (!ctx.reducedMotion) { L.start(); updatePlay(); }
      return {
        destroy() { L.destroy(); cv.canvas.removeEventListener('pointerdown', onDown); cv.destroy(); C.destroy(); },
        setLang(l) { lang = l; C.setLang(l); updateOut(); draw(); },
        setTheme(t) { theme = t; updateOut(); draw(); },
        reset
      };
    }
  });
})();
