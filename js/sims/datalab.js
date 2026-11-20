/* FizLab tool: Data Table and Graph — (a) an x–y table with a live scatter plot and a straight-line fit,
   (b) repeated measurements: mean, deviations, result ± error, relative error and a gross-error check.
   The tables are kept in localStorage under 'fizlab.datalab', so a reload does not lose the pupil's data. */
(function () {
  'use strict';
  const K = window.SimKit;
  const KEY = 'fizlab.datalab', MAX_XY = 12, MAX_R = 10, START_XY = 6, START_R = 5;
  const MODES = [{ value: 'graph', label: { en: 'Table and graph', hr: 'Tablica i graf' } }, { value: 'repeat', label: { en: 'Repeated measurement', hr: 'Ponovljena mjerenja' } }];
  const FITS = [
    { value: 'none', label: { en: 'no line', hr: 'bez pravca' } },
    { value: 'origin', label: { en: 'line through the origin, y = k·x', hr: 'pravac kroz ishodište, y = k·x' } },
    { value: 'line', label: { en: 'straight line, y = k·x + l', hr: 'pravac, y = k·x + l' } }
  ];
  // realistic example data; the pupil replaces them with their own measurements
  const PRESETS = [
    { id: 'band', label: { en: 'Rubber band: stretch vs number of coins', hr: 'Gumica: produljenje i broj kovanica' }, xn: { en: 'number of coins', hr: 'broj kovanica' }, xu: '', yn: { en: 'stretch', hr: 'produljenje' }, yu: 'mm', fit: 'origin',
      pts: [[1, 2.5], [2, 4.5], [3, 7], [4, 9], [5, 11.5], [6, 13.5], [8, 18.5]] },
    { id: 'walk', label: { en: 'Walking: distance vs time', hr: 'Hodanje: put i vrijeme' }, xn: { en: 'time t', hr: 'vrijeme t' }, xu: 's', yn: { en: 'distance s', hr: 'put s' }, yu: 'm', fit: 'origin',
      pts: [[0, 0], [5, 6.8], [10, 13.9], [15, 20.5], [20, 27.8], [25, 34.4], [30, 41.6]] },
    { id: 'pend', label: { en: 'Pendulum: T² vs length', hr: 'Njihalo: T² i duljina' }, xn: { en: 'length l', hr: 'duljina l' }, xu: 'm', yn: 'T²', yu: 's²', fit: 'origin',
      pts: [[0.2, 0.81], [0.3, 1.19], [0.4, 1.63], [0.5, 2.04], [0.6, 2.39], [0.8, 3.25], [1, 4.01]] },
    { id: 'tea', label: { en: 'Cooling tea: temperature vs time', hr: 'Hlađenje čaja: temperatura i vrijeme' }, xn: { en: 'time t', hr: 'vrijeme t' }, xu: 'min', yn: { en: 'temperature', hr: 'temperatura' }, yu: '°C', fit: 'line',
      pts: [[0, 85], [5, 74], [10, 64], [15, 57], [20, 50], [30, 41], [40, 35], [50, 31], [60, 28]] },
    { id: 'ohm', label: { en: 'Ohm\'s law: current vs voltage', hr: 'Ohmov zakon: struja i napon' }, xn: { en: 'voltage U', hr: 'napon U' }, xu: 'V', yn: { en: 'current I', hr: 'struja I' }, yu: 'mA', fit: 'origin',
      pts: [[1.5, 15], [3, 29], [4.5, 46], [6, 59], [7.5, 76], [9, 89]] },
    { id: 'dens', label: { en: 'Density: mass vs volume', hr: 'Gustoća: masa i obujam' }, xn: { en: 'volume V', hr: 'obujam V' }, xu: 'cm³', yn: { en: 'mass m', hr: 'masa m' }, yu: 'g', fit: 'origin',
      pts: [[50, 51], [100, 99], [150, 151], [200, 198], [250, 252]] }
  ];
  const V = {
    empty: { en: 'Type your measurements into the table (a decimal comma or point both work), or load an example.', hr: 'Upiši svoja mjerenja u tablicu (može decimalni zarez ili točka) ili učitaj primjer.' },
    none: { en: 'Choose a line under "Line through the points" to get the slope k and to see how well the points follow it.', hr: 'Odaberi vrstu pravca pod „Pravac kroz točke“ da dobiješ nagib k i vidiš koliko dobro točke prate pravac.' },
    few: { en: 'Enter at least 3 points to judge a line.', hr: 'Za procjenu pravca upiši barem 3 točke.' },
    samex: { en: 'All x values are the same: a line needs different x values.', hr: 'Sve su vrijednosti x jednake: za pravac trebaju različite vrijednosti x.' },
    prop: { en: 'The points lie very close to a line through the origin: y is proportional to x (double x gives double y).', hr: 'Točke leže vrlo blizu pravca kroz ishodište: y je razmjeran x-u (dvostruko veći x daje dvostruko veći y).' },
    good: { en: 'The points lie very close to the line: a straight-line (linear) relationship describes your measurements very well.', hr: 'Točke leže vrlo blizu pravca: linearna ovisnost vrlo dobro opisuje tvoja mjerenja.' },
    ok: { en: 'The points follow the line roughly. A small scatter is normal measurement error.', hr: 'Točke otprilike prate pravac. Malo raspršenje točaka uobičajena je posljedica pogrešaka mjerenja.' },
    bad: { en: 'The points are scattered far from the line. Check the measurements, or the relationship is not a straight line.', hr: 'Točke su jako raspršene oko pravca. Provjeri mjerenja; možda ovisnost nije linearna.' },
    curve: { en: 'The points bend away from the line in a regular way: this is NOT a straight-line (linear) relationship. A curve describes it better.', hr: 'Točke se pravilno odmiču od pravca: ovo NIJE linearna ovisnost. Bolje je opisuje krivulja.' },
    offset: { en: 'The points lie on a line, but that line does not pass through the origin. Choose "straight line, y = k·x + l".', hr: 'Točke leže na pravcu, ali taj pravac ne prolazi kroz ishodište. Odaberi „pravac, y = k·x + l“.' }
  };

  function el(tag, cls, parent) { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  const bi = f => ({ en: f('en'), hr: f('hr') });
  function num(s) { // accepts a decimal comma or point; null when it is not a number
    s = String(s === null || s === undefined ? '' : s).trim().replace(/\s/g, '').replace(',', '.').replace('−', '-');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return null;
    const v = parseFloat(s); return Number.isFinite(v) && Math.abs(v) <= 1e12 ? v : null;
  }
  const decimals = s => { const m = String(s).trim().replace(',', '.').match(/\.(\d+)/); return m ? m[1].length : 0; };
  const numStr = (v, lang) => (lang === 'hr' ? String(v).replace('.', ',') : String(v));
  function sig(v, lang) { // about three significant digits
    if (!Number.isFinite(v)) return '–';
    return K.fmt(v, v === 0 ? 0 : K.clamp(2 - Math.floor(Math.log10(Math.abs(v))), 0, 6), lang);
  }
  function stepDigits(step) { for (let d = 0; d < 7; d++) { const v = step * Math.pow(10, d); if (Math.abs(v - Math.round(v)) < 1e-6 * v) return d; } return 6; }
  function axis(vals, zero) { // "nice" axis range; it starts at 0 when the data are not far from it
    let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    if (lo > 0 && (zero || lo <= 0.6 * hi)) lo = 0;
    if (hi < 0 && (zero || hi >= 0.6 * lo)) hi = 0;
    if (!(hi - lo > 1e-9 * Math.max(Math.abs(hi), Math.abs(lo)))) { const p = Math.abs(hi) * 0.5 || 1; lo -= p; hi += p; }
    return K.niceScale(lo, hi, 5);
  }
  function fitLine(pts, origin) { // least squares; {k, l, sse}, or null when all x are equal
    const n = pts.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach(p => { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
    let k, l = 0;
    if (origin) { if (!(sxx > 0)) return null; k = sxy / sxx; }
    else { const d = n * sxx - sx * sx; if (!(d > 1e-12 * n * sxx)) return null; k = (n * sxy - sx * sy) / d; l = (sy - k * sx) / n; }
    let sse = 0; pts.forEach(p => { const r = p[1] - k * p[0] - l; sse += r * r; });
    return { k, l, sse };
  }
  function sseParabola(pts) { // squared residual of the best parabola (x centred and scaled to keep the sums tame)
    const n = pts.length; if (n < 4) return null;
    const mx = pts.reduce((a, p) => a + p[0], 0) / n, sc = Math.max.apply(null, pts.map(p => Math.abs(p[0] - mx))) || 1;
    const S = [0, 0, 0, 0, 0], B = [0, 0, 0];
    pts.forEach(p => { const u = (p[0] - mx) / sc; for (let j = 0; j < 5; j++) S[j] += Math.pow(u, j); for (let j = 0; j < 3; j++) B[j] += p[1] * Math.pow(u, j); });
    const det = (a, b, c, d, e, f, g, h, i) => a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    const D = det(S[0], S[1], S[2], S[1], S[2], S[3], S[2], S[3], S[4]);
    if (Math.abs(D) < 1e-10) return null;
    const c0 = det(B[0], S[1], S[2], B[1], S[2], S[3], B[2], S[3], S[4]) / D, c1 = det(S[0], B[0], S[2], S[1], B[1], S[3], S[2], B[2], S[4]) / D, c2 = det(S[0], S[1], B[0], S[1], S[2], B[1], S[2], S[3], B[2]) / D;
    return pts.reduce((a, p) => { const u = (p[0] - mx) / sc, r = p[1] - c0 - c1 * u - c2 * u * u; return a + r * r; }, 0);
  }
  const emptyG = () => ({ xn: 'x', xu: '', yn: 'y', yu: '', rows: Array.from({ length: START_XY }, () => ({ x: '', y: '' })), fit: 'none', sq: false, preset: '' });
  const emptyR = () => ({ name: 'x', unit: '', vals: Array.from({ length: START_R }, () => ({ v: '', out: false })) });
  const presetState = (p, lang) => ({ xn: K.tr(p.xn, lang), xu: p.xu, yn: K.tr(p.yn, lang), yu: p.yu, rows: p.pts.map(q => ({ x: numStr(q[0], lang), y: numStr(q[1], lang) })), fit: p.fit, sq: false, preset: p.id });
  function load(lang) { // restore the saved tables; anything odd in storage is ignored. First visit: open with an example loaded.
    const d = { mode: 'graph', g: presetState(PRESETS[0], lang || 'en'), r: emptyR() };
    try {
      const raw = JSON.parse(window.localStorage.getItem(KEY) || 'null'), str = (v, def) => (typeof v === 'string' ? v.slice(0, 40) : def);
      if (raw && typeof raw === 'object') {
        if (raw.mode === 'repeat') d.mode = 'repeat';
        if (raw.g && Array.isArray(raw.g.rows) && raw.g.rows.length) d.g = { xn: str(raw.g.xn, 'x'), xu: str(raw.g.xu, ''), yn: str(raw.g.yn, 'y'), yu: str(raw.g.yu, ''),
          rows: raw.g.rows.slice(0, MAX_XY).map(r => ({ x: str(r && r.x, ''), y: str(r && r.y, '') })), fit: FITS.some(f => f.value === raw.g.fit) ? raw.g.fit : 'none', sq: !!raw.g.sq, preset: str(raw.g.preset, '') };
        if (raw.r && Array.isArray(raw.r.vals) && raw.r.vals.length) d.r = { name: str(raw.r.name, 'x'), unit: str(raw.r.unit, ''), vals: raw.r.vals.slice(0, MAX_R).map(v => ({ v: str(v && v.v, ''), out: !!(v && v.out) })) };
      }
    } catch (e) { /* no storage or broken data: start with empty tables */ }
    return d;
  }

  window.Sims.register({
    id: 'datalab',
    title: { en: 'Data Table and Graph', hr: 'Tablica i graf' },
    summary: {
      en: 'Type in your own measurements: draw a graph with a best straight line and its slope, or work out the mean and the error of a repeated measurement.',
      hr: 'Upiši vlastita mjerenja: nacrtaj graf, provuci pravac kroz točke i odredi njegov nagib ili izračunaj srednju vrijednost i pogrešku ponovljenog mjerenja.'
    },
    tasks: [
      { en: 'Load the example "Walking". What does the slope of the line tell you? What is its unit?', hr: 'Učitaj primjer „Hodanje“. Što pokazuje nagib pravca? Koja mu je mjerna jedinica?' },
      { en: 'Load "Cooling tea" and choose a straight line. Why does the tool say the relationship is not linear?', hr: 'Učitaj „Hlađenje čaja“ i odaberi pravac. Zašto program javlja da ovisnost nije linearna?' },
      { en: 'Hang coins on a rubber band, measure the stretch and replace the example with your own numbers. Is the stretch proportional to the number of coins?', hr: 'Objesi kovanice na gumicu, izmjeri produljenje i zamijeni podatke iz primjera svojim mjerenjima. Je li produljenje razmjerno broju kovanica?' },
      { en: 'Repeated measurement: measure the length of your desk 5 times and write the result as (x̄ ± Δx) cm. Is the relative error below 10 %?', hr: 'Ponovljena mjerenja: 5 puta izmjeri duljinu svog stola i zapiši rezultat kao (x̄ ± Δx) cm. Je li relativna pogreška manja od 10 %?' }
    ],
    mount(container, ctx) {
      let lang = ctx.lang, theme = ctx.theme, an = { pts: [], fit: null, verdict: V.empty }, rs = { rows: [], act: [], n: 0, gross: -1 }, devCells = [];
      const data = load(ctx.lang);
      const texts = new Map();                         // element -> {en, hr}; re-applied in setLang
      const T = (e, o) => { texts.set(e, o); e.textContent = K.tr(o, lang); return e; };
      const btn = (parent, label, fn) => { const b = el('button', 'sk-btn', parent); b.type = 'button'; b.style.minHeight = '48px'; b.style.whiteSpace = 'normal'; b.addEventListener('click', fn); return T(b, label); };
      const cell = (tr, i, k, val) => { // one table input
        const inp = el('input', '', el('td', '', tr)); inp.type = 'text'; inp.autocomplete = 'off'; inp.setAttribute('inputmode', 'decimal');
        inp.value = val; inp.dataset.i = i; inp.dataset.k = k; inp.setAttribute('aria-label', k + ' ' + (i + 1)); return inp;
      };

      const focusLast = body => { const i = body.querySelector('tr:last-child input[type=text]'); if (i) i.focus(); };   // a new row is ready for typing

      // ---------- DOM ----------
      const C0 = K.controls(container, lang);
      C0.segmented({ label: { en: 'Tool', hr: 'Alat' }, options: MODES, value: data.mode, onChange: setMode });
      const cv = K.createCanvas(container, { aspect: 1.75, minHeight: 250, maxHeight: 420 });

      const secG = el('div', 'sk-panel', container);
      const tblG = el('table', 'sk-table', el('div', 'sk-table-wrap', secG)), headG = el('tr', '', el('thead', '', tblG)), bodyG = el('tbody', '', tblG);
      const thG = [el('th', '', headG), el('th', '', headG), el('th', '', headG)]; thG[0].textContent = '#';
      const rowG = el('div', 'sk-row', secG);
      const bAddG = btn(rowG, { en: 'Add row', hr: 'Dodaj redak' }, () => { if (data.g.rows.length < MAX_XY) { data.g.rows.push({ x: '', y: '' }); buildG(); changed(); focusLast(bodyG); } });
      const bDelG = btn(rowG, { en: 'Remove last row', hr: 'Ukloni zadnji redak' }, () => { if (data.g.rows.length > 1) { data.g.rows.pop(); buildG(); changed(); } });
      btn(rowG, { en: 'Clear', hr: 'Obriši sve' }, () => clearTable('graph'));

      const secR = el('div', 'sk-panel', container);
      const tblR = el('table', 'sk-table', el('div', 'sk-table-wrap', secR)), headR = el('tr', '', el('thead', '', tblR)), bodyR = el('tbody', '', tblR);
      const thR = [el('th', '', headR), el('th', '', headR), el('th', '', headR), el('th', '', headR)]; thR[0].textContent = '#'; thR[2].textContent = '|x − x̄|';
      T(thR[3], { en: 'leave it out', hr: 'izostavi' });
      const rowR = el('div', 'sk-row', secR);
      const bAddR = btn(rowR, { en: 'Add reading', hr: 'Dodaj mjerenje' }, () => { if (data.r.vals.length < MAX_R) { data.r.vals.push({ v: '', out: false }); buildR(); changed(); focusLast(bodyR); } });
      const bDelR = btn(rowR, { en: 'Remove last', hr: 'Ukloni zadnje' }, () => { if (data.r.vals.length > 1) { data.r.vals.pop(); buildR(); changed(); } });
      btn(rowR, { en: 'Clear', hr: 'Obriši sve' }, () => clearTable('repeat'));
      const resR = el('div', 'sk-big', secR); resR.style.fontSize = 'clamp(1.3rem, 5vw, 2.1rem)';
      const msgGross = el('div', 'sk-msg', secR); msgGross.hidden = true;

      const CG = K.controls(container, lang), CR = K.controls(container, lang);
      const selPreset = CG.select({ label: { en: 'Load an example', hr: 'Učitaj primjer' }, value: '', options: [{ value: '', label: { en: 'choose…', hr: 'odaberi…' } }].concat(PRESETS.map(p => ({ value: p.id, label: p.label }))),
        onChange: v => { const p = PRESETS.find(x => x.id === v); selPreset.set(''); if (!p) return; data.g = presetState(p, lang); buildG(); syncInputs(); changed(); } });
      const inXn = CG.input({ label: { en: 'x: quantity', hr: 'x: veličina' }, value: data.g.xn, onChange: v => { data.g.xn = v.slice(0, 40); changed(); } });
      const inXu = CG.input({ label: { en: 'x: unit', hr: 'x: mjerna jedinica' }, value: data.g.xu, onChange: v => { data.g.xu = v.slice(0, 40); changed(); } });
      const inYn = CG.input({ label: { en: 'y: quantity', hr: 'y: veličina' }, value: data.g.yn, onChange: v => { data.g.yn = v.slice(0, 40); changed(); } });
      const inYu = CG.input({ label: { en: 'y: unit', hr: 'y: mjerna jedinica' }, value: data.g.yu, onChange: v => { data.g.yu = v.slice(0, 40); changed(); } });
      const selFit = CG.select({ label: { en: 'Line through the points', hr: 'Pravac kroz točke' }, options: FITS, value: data.g.fit, onChange: v => { data.g.fit = FITS.some(f => f.value === v) ? v : 'none'; changed(); } });
      const togSq = CG.toggle({ label: { en: 'Plot y against x²', hr: 'Crtaj y u ovisnosti o x²' }, value: data.g.sq, onChange: v => { data.g.sq = !!v; changed(); } });
      const outN = CG.readout({ label: { en: 'Points', hr: 'Broj točaka' }, digits: 0 });
      const outK = CG.readout({ label: { en: 'Slope k', hr: 'Nagib pravca k' } });
      const outL = CG.readout({ label: { en: 'Intercept l (y at x = 0)', hr: 'Odsječak l (y za x = 0)' } });
      const noteG = CG.note({ text: V.empty });
      const inRn = CR.input({ label: { en: 'Quantity', hr: 'Veličina' }, value: data.r.name, onChange: v => { data.r.name = v.slice(0, 40); changed(); } });
      const inRu = CR.input({ label: { en: 'Unit', hr: 'Mjerna jedinica' }, value: data.r.unit, onChange: v => { data.r.unit = v.slice(0, 40); changed(); } });
      const outRn = CR.readout({ label: { en: 'Readings used', hr: 'Broj mjerenja' }, digits: 0 });
      const outMean = CR.readout({ label: { en: 'Mean x̄', hr: 'Srednja vrijednost x̄' } });
      const outDev = CR.readout({ label: { en: 'Largest absolute deviation Δx', hr: 'Najveće apsolutno odstupanje Δx' } });
      const outRel = CR.readout({ label: { en: 'Relative error Δx : x̄', hr: 'Relativna pogreška Δx : x̄' }, unit: '%', digits: 1 });
      const noteR = CR.note({ text: '' });

      // ---------- tables ----------
      function buildG() {
        bodyG.textContent = '';
        data.g.rows.forEach((r, i) => { const tr = el('tr', '', bodyG); el('td', '', tr).textContent = String(i + 1); cell(tr, i, 'x', r.x); cell(tr, i, 'y', r.y); });
      }
      function buildR() {
        bodyR.textContent = ''; devCells = [];
        data.r.vals.forEach((r, i) => {
          const tr = el('tr', '', bodyR); el('td', '', tr).textContent = String(i + 1); cell(tr, i, 'v', r.v); devCells.push(el('td', '', tr));
          const cb = el('input', '', el('td', '', tr)); cb.type = 'checkbox'; cb.checked = r.out; cb.dataset.i = i;
          Object.assign(cb.style, { width: '22px', height: '22px', minWidth: '0', padding: '0', accentColor: 'var(--accent)' });
          cb.setAttribute('aria-label', K.tr({ en: 'leave reading ', hr: 'izostavi mjerenje ' }, lang) + (i + 1));
        });
      }
      function onType(e) { // typing in a table cell: keep the raw text, recompute everything else
        const t = e.target; if (!t || t.type === 'checkbox' || !t.dataset || !t.dataset.k) return;
        const row = t.dataset.k === 'v' ? data.r.vals[t.dataset.i] : data.g.rows[t.dataset.i];
        if (row) { row[t.dataset.k] = t.value.slice(0, 40); changed(); }
      }
      function onTick(e) { const t = e.target, row = t && t.type === 'checkbox' ? data.r.vals[t.dataset.i] : null; if (row) { row.out = t.checked; changed(); } }
      bodyG.addEventListener('input', onType); bodyR.addEventListener('input', onType); bodyR.addEventListener('change', onTick);
      function syncInputs() {
        inXn.set(data.g.xn); inXu.set(data.g.xu); inYn.set(data.g.yn); inYu.set(data.g.yu); selFit.set(data.g.fit); togSq.set(data.g.sq);
        inRn.set(data.r.name); inRu.set(data.r.unit);
      }
      function clearTable(m) { if (m === 'graph') { data.g = emptyG(); buildG(); } else { data.r = emptyR(); buildR(); } syncInputs(); changed(); }
      function save() { // empty tables remove the stored copy altogether
        try {
          if (JSON.stringify([data.g, data.r]) === JSON.stringify([emptyG(), emptyR()])) window.localStorage.removeItem(KEY);
          else window.localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e) { /* private mode or full storage: the tool still works */ }
      }
      function changed() { save(); update(); }

      // ---------- numbers ----------
      const label = (name, unit, fallback) => (name.trim() || fallback) + (unit.trim() ? ' (' + unit.trim() + ')' : '');
      function axisLabel(k, plotted) {
        const G = data.g, sq = k === 'x' && plotted && G.sq, u = G[k + 'u'].trim();
        return (G[k + 'n'].trim() || k) + (sq ? '²' : '') + (u ? ' (' + u + (sq ? '²' : '') + ')' : '');
      }
      function slopeUnit() { // unit of k: y-unit per x-unit
        const wrapU = u => (/[\/·\s]/.test(u) ? '(' + u + ')' : u), yu = data.g.yu.trim(), xu = data.g.xu.trim() ? wrapU(data.g.xu.trim()) + (data.g.sq ? '²' : '') : '';
        return xu ? (yu ? wrapU(yu) : '1') + '/' + xu : yu;
      }
      function analyse() {
        const G = data.g, pts = G.rows.map(r => [num(r.x), num(r.y)]).filter(p => p[0] !== null && p[1] !== null).map(p => [G.sq ? p[0] * p[0] : p[0], p[1]]);
        const out = { pts, fit: null, verdict: null };
        if (G.fit === 'none') { out.verdict = pts.length ? V.none : V.empty; return out; }
        if (pts.length < 3) { out.verdict = pts.length ? V.few : V.empty; return out; }
        const lin = fitLine(pts, false), f = G.fit === 'origin' ? fitLine(pts, true) : lin;
        if (!lin || !f) { out.verdict = V.samex; return out; }
        const ys = pts.map(p => p[1]), span = Math.max.apply(null, ys) - Math.min.apply(null, ys);
        const rel = r => (span > 0 ? Math.sqrt(r.sse / pts.length) / span : (r.sse > 0 ? 1 : 0));     // typical distance from the line, compared with the spread of y
        const quad = sseParabola(pts), curved = pts.length >= 5 && quad !== null && quad < 0.3 * lin.sse && rel(lin) > 0.015;
        out.fit = f;
        out.verdict = curved ? V.curve : (G.fit === 'origin' && lin.sse < 0.3 * f.sse && rel(f) > 0.03) ? V.offset
          : rel(f) <= 0.03 ? (G.fit === 'origin' ? V.prop : V.good) : rel(f) <= 0.1 ? V.ok : V.bad;
        return out;
      }
      function repStats() {
        const rows = data.r.vals.map((r, i) => ({ i, v: num(r.v), out: r.out, raw: r.v })).filter(r => r.v !== null), act = rows.filter(r => !r.out), n = act.length;
        if (!n) return { rows, act, n: 0, gross: -1 };
        const mean = act.reduce((a, r) => a + r.v, 0) / n, maxDev = Math.max.apply(null, act.map(r => Math.abs(r.v - mean)));
        const dec = K.clamp(Math.max.apply(null, act.map(r => decimals(r.raw))) + 1, 0, 5);          // one more decimal than the readings
        // possible gross error: one reading lies over three times further from the others than they spread among themselves
        let gross = -1, worst = 3;
        if (n >= 4) act.forEach(r => {
          const rest = act.filter(o => o !== r).map(o => o.v), m = rest.reduce((a, b) => a + b, 0) / rest.length;
          const ratio = Math.abs(r.v - m) / Math.max(Math.max.apply(null, rest.map(v => Math.abs(v - m))), 0.02 * Math.abs(m), 1e-12);
          if (ratio > worst) { worst = ratio; gross = r.i; }
        });
        return { rows, act, n, mean, maxDev, dec, rel: mean !== 0 ? maxDev / Math.abs(mean) * 100 : null, gross };
      }
      function update() {
        const G = data.g, R = data.r;
        thG[1].textContent = axisLabel('x'); thG[2].textContent = axisLabel('y'); thR[1].textContent = label(R.name, R.unit, 'x');
        [bodyG, bodyR].forEach(b => b.querySelectorAll('input[type=text]').forEach(i => { i.style.borderColor = i.value.trim() !== '' && num(i.value) === null ? 'var(--bad)' : ''; }));
        bAddG.disabled = G.rows.length >= MAX_XY; bDelG.disabled = G.rows.length <= 1; bAddR.disabled = R.vals.length >= MAX_R; bDelR.disabled = R.vals.length <= 1;
        // (a) graph
        an = analyse();
        const f = an.fit, ku = slopeUnit();
        outN.set(an.pts.length); outK.set(f ? sig(f.k, lang) + (ku ? ' ' + ku : '') : null);
        outL.set(f && G.fit === 'line' ? sig(f.l, lang) + (G.yu.trim() ? ' ' + G.yu.trim() : '') : null);
        noteG.set(an.verdict);
        // (b) repeated measurement
        const s = rs = repStats(), u = R.unit.trim() ? ' ' + R.unit.trim() : '', fx = v => K.fmt(v, s.dec, lang);
        R.vals.forEach((r, i) => {
          const c = devCells[i]; if (!c) return;
          const v = num(r.v), flag = i === s.gross;
          c.textContent = v === null ? (r.v.trim() ? '?' : '') : r.out ? K.tr({ en: 'left out', hr: 'izostavljeno' }, lang) : fx(Math.abs(v - s.mean)) + (flag ? ' ' + K.tr({ en: '(gross error?)', hr: '(gruba pogreška?)' }, lang) : '');
          c.parentNode.style.background = flag ? 'var(--warn-soft)' : '';
        });
        resR.textContent = s.n < 2 ? '' : (R.name.trim() || 'x') + ' = (' + fx(s.mean) + ' ± ' + fx(s.maxDev) + ')' + u;
        outRn.set(s.n); outMean.set(s.n ? fx(s.mean) + u : null); outDev.set(s.n > 1 ? fx(s.maxDev) + u : null);
        outRel.set(s.n > 1 ? s.rel : null); outRel.setColor(s.n > 1 && s.rel !== null ? (s.rel <= 10 ? 'var(--good)' : 'var(--warn)') : '');
        noteR.set(s.n < 2 ? { en: 'Measure the same thing several times (at least 3, better 5 or more) and type in every reading.', hr: 'Izmjeri istu veličinu više puta (barem 3, još bolje 5 ili više) i upiši svako mjerenje.' }
          : s.rel === null ? { en: 'The mean is 0, so a relative error cannot be given.', hr: 'Srednja vrijednost iznosi 0 pa se relativna pogreška ne može izračunati.' }
            : s.maxDev === 0 ? { en: 'All readings agree. Then take half of the smallest division of your instrument as the error.', hr: 'Sva se mjerenja slažu. Tada za pogrešku uzmi pola najmanjeg podjeljka mjernog instrumenta.' }
              : bi(l => (l === 'en' ? 'Relative error ' : 'Relativna pogreška ') + K.fmt(s.rel, 1, l) + ' %: ' + (s.rel <= 10
                ? (l === 'en' ? 'fine for a school experiment (≤ 10 %).' : 'u redu za školski pokus (≤ 10 %).')
                : (l === 'en' ? 'too scattered: measure again, more carefully or more times.' : 'mjerenja su previše raspršena: ponovi ih pažljivije ili više puta.'))));
        msgGross.hidden = s.gross < 0;
        if (s.gross >= 0) msgGross.textContent = K.tr({ en: 'Reading no. ', hr: 'Mjerenje br. ' }, lang) + (s.gross + 1) + ' (' + numStr(num(R.vals[s.gross].v), lang) + u + ') ' +
          K.tr({ en: 'lies far from the others. It may be a gross error: a slip in reading or in writing. Check it; if it is a mistake, tick "leave it out".', hr: 'jako odskače od ostalih. Možda je riječ o gruboj pogrešci: omašci pri očitavanju ili zapisivanju. Provjeri ga; ako je riječ o pogrešci, označi „izostavi“.' }, lang);
        draw();
      }

      // ---------- drawing ----------
      const hint = (g, w, h, obj) => K.text(g, K.tr(obj, lang), w / 2, h / 2, { font: '13px ' + theme.font, color: theme.muted, align: 'center', baseline: 'middle' });
      function drawGraph(g, w, h) {
        const G = data.g, pts = an.pts, f = an.fit, px = 54, py = 30, pw = w - px - 16, ph = h - py - 42, small = '11px ' + theme.font;
        g.fillStyle = theme.surface; K.roundRect(g, px, py, pw, ph, 6); g.fill();
        K.text(g, axisLabel('y'), 10, 15, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        K.text(g, axisLabel('x', true), px + pw, h - 11, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
        if (!pts.length) { hint(g, 2 * px + pw, 2 * py + ph, { en: 'Your points will appear here.', hr: 'Ovdje će se pojaviti tvoje točke.' }); return; }
        const zero = G.fit === 'origin', sx = axis(pts.map(p => p[0]), zero), sy = axis(pts.map(p => p[1]), zero), dx = stepDigits(sx.step), dy = stepDigits(sy.step);
        const X = v => px + (v - sx.min) / (sx.max - sx.min) * pw, Y = v => py + ph - (v - sy.min) / (sy.max - sy.min) * ph;
        const tick = (sc, i) => { const v = sc.min + i * sc.step; return Math.abs(v) < sc.step * 1e-6 ? 0 : v; };
        for (let i = 0; i <= sx.ticks; i++) {
          const v = tick(sx, i), x = X(v);
          g.strokeStyle = v === 0 ? theme.muted : theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(x, py); g.lineTo(x, py + ph); g.stroke();
          K.text(g, K.fmt(v, dx, lang), x, py + ph + 5, { font: small, color: theme.muted, align: 'center', baseline: 'top' });
        }
        for (let i = 0; i <= sy.ticks; i++) {
          const v = tick(sy, i), y = Y(v);
          g.strokeStyle = v === 0 ? theme.muted : theme.line; g.lineWidth = 1; g.beginPath(); g.moveTo(px, y); g.lineTo(px + pw, y); g.stroke();
          K.text(g, K.fmt(v, dy, lang), px - 6, y, { font: small, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        g.save(); g.beginPath(); g.rect(px, py, pw, ph); g.clip();
        if (f) { g.strokeStyle = theme.c2; g.lineWidth = 2; g.beginPath(); g.moveTo(X(sx.min), Y(f.k * sx.min + f.l)); g.lineTo(X(sx.max), Y(f.k * sx.max + f.l)); g.stroke(); }
        pts.forEach(p => { g.fillStyle = theme.c1; g.beginPath(); g.arc(X(p[0]), Y(p[1]), 5, 0, Math.PI * 2); g.fill(); g.strokeStyle = theme.surface; g.lineWidth = 1.5; g.stroke(); });
        g.restore();
        if (f) K.text(g, 'y = ' + sig(f.k, lang) + '·x' + (G.sq ? '²' : '') + (G.fit === 'line' ? (f.l < 0 ? ' − ' : ' + ') + sig(Math.abs(f.l), lang) : ''), px + pw, 15, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
      }
      function drawRepeat(g, w, h) {
        const s = rs, R = data.r, u = R.unit.trim() ? ' ' + R.unit.trim() : '', small = '11px ' + theme.font;
        K.text(g, label(R.name, R.unit, 'x'), 12, 15, { font: 'bold 12px ' + theme.font, color: theme.fg, baseline: 'middle' });
        if (!s.rows.length) { hint(g, w, h, { en: 'Your readings will appear here on a number line.', hr: 'Ovdje će se tvoja mjerenja prikazati na brojevnom pravcu.' }); return; }
        let lo = Math.min.apply(null, s.rows.map(r => r.v)), hi = Math.max.apply(null, s.rows.map(r => r.v));
        if (s.n) { lo = Math.min(lo, s.mean - s.maxDev); hi = Math.max(hi, s.mean + s.maxDev); }
        const pad = (hi - lo) * 0.15 || Math.abs(hi) * 0.05 || 1, sc = K.niceScale(lo - pad, hi + pad, w < 480 ? 4 : 6), d = stepDigits(sc.step);
        const x0 = 26, x1 = w - 26, y = Math.round(h * 0.66), X = v => x0 + (v - sc.min) / (sc.max - sc.min) * (x1 - x0);
        if (s.n > 1) {
          g.fillStyle = K.withAlpha(theme.c1, 0.18); g.fillRect(X(s.mean - s.maxDev), y - 54, Math.max(2, X(s.mean + s.maxDev) - X(s.mean - s.maxDev)), 54);
          K.text(g, 'x̄ = ' + K.fmt(s.mean, s.dec, lang) + u + ',  Δx = ' + K.fmt(s.maxDev, s.dec, lang) + u, w - 12, 15, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'right', baseline: 'middle' });
          K.text(g, K.tr({ en: 'shaded: from x̄ − Δx to x̄ + Δx', hr: 'osjenčano: od x̄ − Δx do x̄ + Δx' }, lang), x1, h - 10, { font: small, color: theme.muted, align: 'right', baseline: 'middle' });
        }
        if (s.rows.some(r => r.out)) K.text(g, K.tr({ en: 'empty circle: left out', hr: 'prazan krug: izostavljeno' }, lang), x1, h - 25, { font: small, color: theme.muted, align: 'right', baseline: 'middle' });
        g.strokeStyle = theme.muted; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y);
        for (let i = 0; i <= sc.ticks; i++) { const x = X(sc.min + i * sc.step); g.moveTo(x, y); g.lineTo(x, y + 6); }
        g.stroke();
        for (let i = 0; i <= sc.ticks; i++) { const v = sc.min + i * sc.step; K.text(g, K.fmt(Math.abs(v) < sc.step * 1e-6 ? 0 : v, d, lang), X(v), y + 9, { font: small, color: theme.muted, align: 'center', baseline: 'top' }); }
        if (s.n) {
          g.strokeStyle = theme.c2; g.lineWidth = 2; g.beginPath(); g.moveTo(X(s.mean), y - 64); g.lineTo(X(s.mean), y + 6); g.stroke();
          K.text(g, 'x̄', X(s.mean), y - 67, { font: 'bold 12px ' + theme.font, color: theme.fg, align: 'center', baseline: 'bottom' });
        }
        const stack = {};
        s.rows.forEach(r => {
          const x = X(r.v), key = Math.round(x / 9), k = stack[key] || 0, cy = y - 9 - k * 13; stack[key] = k + 1;
          g.beginPath(); g.arc(x, cy, 6, 0, Math.PI * 2);
          if (r.out) { g.fillStyle = theme.sky; g.fill(); g.strokeStyle = theme.muted; g.lineWidth = 2; g.stroke(); }
          else { g.fillStyle = theme.c1; g.fill(); g.strokeStyle = theme.surface; g.lineWidth = 1.5; g.stroke(); }
          if (r.i === s.gross) { g.strokeStyle = theme.warn; g.lineWidth = 2.5; g.beginPath(); g.arc(x, cy, 10, 0, Math.PI * 2); g.stroke(); }
        });
      }
      function draw() {
        const g = cv.ctx, w = cv.w, h = cv.h;
        g.clearRect(0, 0, w, h); g.fillStyle = theme.sky; g.fillRect(0, 0, w, h);
        if (data.mode === 'graph') drawGraph(g, w, h); else drawRepeat(g, w, h);
      }

      // ---------- shared ----------
      function setMode(m) {
        data.mode = m === 'repeat' ? 'repeat' : 'graph';
        secG.hidden = CG.el.hidden = data.mode !== 'graph'; secR.hidden = CR.el.hidden = data.mode !== 'repeat';
        changed();
      }
      function reset() { clearTable(data.mode); }   // the open table goes back to empty (same as "Clear")
      cv.onResize(draw);
      buildG(); buildR(); setMode(data.mode);

      return {
        destroy() {
          bodyG.removeEventListener('input', onType); bodyR.removeEventListener('input', onType); bodyR.removeEventListener('change', onTick);
          cv.destroy(); [C0, CG, CR].forEach(c => c.destroy()); secG.remove(); secR.remove(); texts.clear();
        },
        setLang(l) {
          const G = data.g, p = PRESETS.find(x => x.id === G.preset), old = p && presetState(p, lang);
          if (old && ['xn', 'xu', 'yn', 'yu'].every(k => G[k] === old[k]) && JSON.stringify(G.rows) === JSON.stringify(old.rows)) {
            data.g = Object.assign(presetState(p, l), { fit: G.fit, sq: G.sq }); buildG();          // an untouched example follows the language; typed data never change
          }
          lang = l; [C0, CG, CR].forEach(c => c.setLang(l)); texts.forEach((o, e) => { e.textContent = K.tr(o, l); });
          buildR(); syncInputs(); changed();
        },
        setTheme(t) { theme = t; draw(); },
        reset
      };
    }
  });
})();
