/* FizLab practice problems: Graph reading / Čitanje grafova
   Every template draws a graph. The numbers the pupil needs are NOT in the text: they are read from the graph,
   and the random parameters are chosen in whole grid squares so every value to be read lies on a grid intersection. */
(function () {
  'use strict';

  const NAMES = ['Ana', 'Marko', 'Iva', 'Luka', 'Petra', 'Filip'];
  // axis label "symbol / unit", the same in both languages
  const ax = s => ({ en: s, hr: s });
  // two decimals: keeps products such as 12 · 0.1 free of floating-point dust
  const r2 = v => Math.round(v * 100) / 100;
  // A line through the origin that climbs k grid squares per square across is drawn SPAN[k] squares wide,
  // so it ends on a grid intersection at most 12 squares up. For k = 0.5 and 1.5 it meets the grid at even squares.
  const SPAN = { 0.5: 12, 1: 10, 1.5: 8, 2: 6 };
  // two different steepnesses from a list sorted from flat to steep: [flatter, steeper]
  const twoOf = (R, ks) => { const a = R.int(0, ks.length - 2); return [ks[a], ks[R.int(a + 1, ks.length - 1)]]; };
  // measured points (dots) on a line through the origin, at every second square across
  const dots = (n, xs, rise) => { const out = []; for (let i = 2; i <= n; i += 2) out.push([i * xs, r2(rise * i)]); return out; };
  // u = metres per square up; ks = allowed steepness (squares up per second), so the speed is k · u
  const MOVERS = [
    { en: 'walker', hr: 'pješak', u: 2, ks: [0.5, 1] },
    { en: 'runner', hr: 'trkač', u: 2, ks: [1.5, 2] },
    { en: 'cyclist', hr: 'biciklist', u: 5, ks: [1, 1.5, 2] },
    { en: 'car', hr: 'automobil', u: 10, ks: [1, 1.5, 2] },
    { en: 'train', hr: 'vlak', u: 20, ks: [1, 1.5, 2] }
  ];

  // ------------------------------------------------------------------ motion
  window.Content.registerProblems('motion', [
    {
      id: 'graph-st-distance', level: 1,
      params: R => {
        const m = R.pick(MOVERS), k = R.pick(m.ks), n = SPAN[k];
        const t = k % 1 ? 2 * R.int(1, n / 2 - 1) : R.int(2, n - 1);
        return { en: m.en, hr: m.hr, u: m.u, k, n, t, s: k * t * m.u };
      },
      text: {
        en: (p, f) => `The graph shows how the distance s covered by a ${p.en} grows with time t. Read from the graph: what distance has the ${p.en} covered after ${f(p.t)} s?`,
        hr: (p, f) => `Graf prikazuje kako put s koji prijeđe ${p.hr} raste s vremenom t. Očitaj iz grafa: koliki je put ${p.hr} prešao nakon ${f(p.t)} s?`
      },
      answer: p => p.s, unit: 'm', tol: 0.02,
      hint: {
        en: 'Find the time on the horizontal axis, go straight up to the line and then across to the vertical axis.',
        hr: 'Pronađi vrijeme na vodoravnoj osi, idi ravno gore do pravca, a zatim vodoravno do okomite osi.'
      },
      steps: {
        en: (p, f) => [`Find t = ${f(p.t)} s on the horizontal axis and go straight up to the line.`, 'From that point go across to the vertical axis and read the distance.', `At t = ${f(p.t)} s the graph shows s = ${f(p.s)} m.`],
        hr: (p, f) => [`Na vodoravnoj osi pronađi t = ${f(p.t)} s i idi ravno gore do pravca.`, 'Od te točke idi vodoravno do okomite osi i očitaj put.', `U trenutku t = ${f(p.t)} s graf pokazuje s = ${f(p.s)} m.`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('s / m'),
        xMax: p.n, yMax: p.k * p.n * p.u, xStep: 1, yStep: p.u,
        lines: [{ pts: [[0, 0], [p.n, p.k * p.n * p.u]] }]
      })
    },
    {
      id: 'graph-st-speed', level: 1,
      params: R => {
        const m = R.pick([
          { en: 'swimmer', hr: 'plivač', u: 1, ks: [1, 1.5, 2] },
          { en: 'boat', hr: 'čamac', u: 2, ks: [1, 1.5, 2] },
          { en: 'skater', hr: 'klizač', u: 5, ks: [1, 1.5, 2] },
          { en: 'tram', hr: 'tramvaj', u: 10, ks: [0.5, 1, 1.5] }
        ]);
        const k = R.pick(m.ks), n = SPAN[k];
        const t = n >= 10 ? 10 : (k === 2 ? 5 : 4);
        return { en: m.en, hr: m.hr, u: m.u, k, n, t, s: k * t * m.u };
      },
      text: {
        en: (p, f) => `The graph shows how the distance s covered by a ${p.en} grows with time t. The ${p.en} moves at a steady speed. Read from the graph the values you need and calculate the speed of the ${p.en}.`,
        hr: (p, f) => `Graf prikazuje kako put s koji prijeđe ${p.hr} raste s vremenom t dok se giba stalnom brzinom. Očitaj iz grafa potrebne vrijednosti i izračunaj kolikom se brzinom ${p.hr} giba.`
      },
      answer: p => p.s / p.t, unit: 'm/s', tol: 0.02,
      hint: {
        en: 'The line passes through the origin: pick one point where it crosses a grid intersection and divide the distance by the time.',
        hr: 'Pravac prolazi kroz ishodište: odaberi točku u kojoj pravac prolazi kroz sjecište crta mreže i podijeli put s vremenom.'
      },
      steps: {
        en: (p, f) => [`The line passes through the origin, so one point is enough. At t = ${f(p.t)} s the graph shows s = ${f(p.s)} m.`, 'v = s / t', `v = ${f(p.s)} m / ${f(p.t)} s = ${f(p.s / p.t)} m/s`],
        hr: (p, f) => [`Pravac prolazi kroz ishodište, pa je dovoljna jedna točka. U trenutku t = ${f(p.t)} s graf pokazuje s = ${f(p.s)} m.`, 'v = s / t', `v = ${f(p.s)} m / ${f(p.t)} s = ${f(p.s / p.t)} m/s`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('s / m'),
        xMax: p.n, yMax: p.k * p.n * p.u, xStep: 1, yStep: p.u,
        lines: [{ pts: [[0, 0], [p.n, p.k * p.n * p.u]] }]
      })
    },
    {
      id: 'graph-vt-speed', level: 1,
      params: R => {
        const c = R.pick([{ u: 1, k: 1 }, { u: 2, k: 1 }, { u: 2, k: 0.5 }, { u: 5, k: 0.5 }]);
        const n = c.k === 1 ? 10 : 12;
        const b = R.int(0, c.u === 5 ? 1 : 2), top = b + c.k * n;
        const up = R.pick([true, false]);
        const t = c.k === 1 ? R.int(1, n - 1) : 2 * R.int(1, n / 2 - 1);
        return { u: c.u, n, lo: b * c.u, hi: top * c.u, up, t, v: (up ? b + c.k * t : top - c.k * t) * c.u };
      },
      text: {
        en: (p, f) => `The graph shows how the speed v of a car changes with time t. Read from the graph: what is the speed of the car at t = ${f(p.t)} s?`,
        hr: (p, f) => `Graf prikazuje kako se brzina v automobila mijenja s vremenom t. Očitaj iz grafa: kolika je brzina automobila u trenutku t = ${f(p.t)} s?`
      },
      answer: p => p.v, unit: 'm/s', tol: 0.02,
      hint: {
        en: 'On a v–t graph the height of the line above a given time is the speed at that moment.',
        hr: 'U v–t grafu visina pravca iznad nekog trenutka pokazuje brzinu u tom trenutku.'
      },
      steps: {
        en: (p, f) => [`Find t = ${f(p.t)} s on the horizontal axis and go straight up to the line.`, 'From that point go across to the vertical axis and read the speed.', `At t = ${f(p.t)} s the graph shows v = ${f(p.v)} m/s.`],
        hr: (p, f) => [`Na vodoravnoj osi pronađi t = ${f(p.t)} s i idi ravno gore do pravca.`, 'Od te točke idi vodoravno do okomite osi i očitaj brzinu.', `U trenutku t = ${f(p.t)} s graf pokazuje v = ${f(p.v)} m/s.`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('v / (m/s)'),
        xMax: p.n, yMax: p.hi, xStep: 1, yStep: p.u,
        lines: [{ pts: p.up ? [[0, p.lo], [p.n, p.hi]] : [[0, p.hi], [p.n, p.lo]] }]
      })
    },
    {
      id: 'graph-st-two-points', level: 2,
      params: R => {
        const m = R.pick(MOVERS), k = R.pick(m.ks);
        const n = { 0.5: 10, 1: 8, 1.5: 6, 2: 4 }[k];
        const a = R.int(1, k === 1.5 ? 3 : 4);
        return { en: m.en, hr: m.hr, u: m.u, n, s0: a * m.u, t1: 2, s1: (a + 2 * k) * m.u, t2: n, s2: (a + k * n) * m.u };
      },
      text: {
        en: (p, f) => `The graph shows the distance s of a ${p.en} from a bridge against time t. The ${p.en} moves at a steady speed and has already passed the bridge when the timing starts. Read from the graph the values you need and calculate the speed of the ${p.en}.`,
        hr: (p, f) => `Graf prikazuje udaljenost s od mosta u ovisnosti o vremenu t dok se ${p.hr} giba stalnom brzinom. Kad je mjerenje vremena počelo, ${p.hr} je već prošao most. Očitaj iz grafa potrebne vrijednosti i izračunaj kolikom se brzinom ${p.hr} giba.`
      },
      answer: p => (p.s2 - p.s1) / (p.t2 - p.t1), unit: 'm/s', tol: 0.02,
      hint: {
        en: 'The line does not start at zero, so s / t at one point does not work. Take two points: v = Δs / Δt.',
        hr: 'Pravac ne počinje u nuli, pa omjer s / t u jednoj točki ne daje brzinu. Uzmi dvije točke: v = Δs / Δt.'
      },
      steps: {
        en: (p, f) => [`Read two points on the line: at t₁ = ${f(p.t1)} s, s₁ = ${f(p.s1)} m, and at t₂ = ${f(p.t2)} s, s₂ = ${f(p.s2)} m.`, `Δs = ${f(p.s2)} m − ${f(p.s1)} m = ${f(p.s2 - p.s1)} m and Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `v = Δs / Δt = ${f(p.s2 - p.s1)} m / ${f(p.t2 - p.t1)} s = ${f((p.s2 - p.s1) / (p.t2 - p.t1))} m/s`],
        hr: (p, f) => [`Očitaj dvije točke na pravcu: u trenutku t₁ = ${f(p.t1)} s je s₁ = ${f(p.s1)} m, a u trenutku t₂ = ${f(p.t2)} s je s₂ = ${f(p.s2)} m.`, `Δs = ${f(p.s2)} m − ${f(p.s1)} m = ${f(p.s2 - p.s1)} m, a Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `v = Δs / Δt = ${f(p.s2 - p.s1)} m / ${f(p.t2 - p.t1)} s = ${f((p.s2 - p.s1) / (p.t2 - p.t1))} m/s`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('s / m'),
        xMax: p.n, yMax: p.s2, xStep: 1, yStep: p.u,
        lines: [{ pts: [[0, p.s0], [p.n, p.s2]] }]
      })
    },
    {
      id: 'graph-st-two-movers', level: 2,
      params: R => {
        const g = R.pick([
          { en: 'runners', one: 'runner', hr: 'Dva trkača', hrOne: 'trkač', xs: 5, u: 20 },
          { en: 'cyclists', one: 'cyclist', hr: 'Dva biciklista', hrOne: 'biciklist', xs: 10, u: 50 },
          { en: 'cars', one: 'car', hr: 'Dva automobila', hrOne: 'automobil', xs: 5, u: 50 },
          { en: 'trains', one: 'train', hr: 'Dva vlaka', hrOne: 'vlak', xs: 10, u: 200 }
        ]);
        const n = R.pick([6, 8]);
        const pair = twoOf(R, n === 6 ? [0.5, 1, 1.5, 2] : [0.5, 1, 1.5]);
        const aFast = R.pick([true, false]);
        const kA = aFast ? pair[1] : pair[0], kB = aFast ? pair[0] : pair[1];
        return { en: g.en, one: g.one, hr: g.hr, hrOne: g.hrOne, xs: g.xs, u: g.u, t: n * g.xs, sA: kA * n * g.u, sB: kB * n * g.u, fast: aFast ? 'A' : 'B' };
      },
      text: {
        en: (p, f) => `Two ${p.en} set off at the same moment from the same place. The graph shows the distance s covered by each of them against time t. Read from the graph the values you need: which one is faster, and by how many m/s? Enter the difference of the two speeds.`,
        hr: (p, f) => `${p.hr} kreću u istom trenutku s istog mjesta. Graf prikazuje put s koji je svaki od njih prešao u ovisnosti o vremenu t. Očitaj iz grafa potrebne vrijednosti: koji je brži i za koliko m/s? Upiši razliku dviju brzina.`
      },
      answer: p => Math.abs(p.sA - p.sB) / p.t, unit: 'm/s', tol: 0.02,
      hint: {
        en: 'The steeper line belongs to the faster one. Read one point on each line, calculate both speeds and subtract.',
        hr: 'Strmiji pravac pripada bržem. Očitaj po jednu točku na svakom pravcu, izračunaj obje brzine i oduzmi ih.'
      },
      steps: {
        en: (p, f) => [`At t = ${f(p.t)} s line A shows s = ${f(p.sA)} m and line B shows s = ${f(p.sB)} m.`, `v_A = ${f(p.sA)} m / ${f(p.t)} s = ${f(p.sA / p.t)} m/s`, `v_B = ${f(p.sB)} m / ${f(p.t)} s = ${f(p.sB / p.t)} m/s`, `Line ${p.fast} is steeper: ${p.one} ${p.fast} is faster by ${f(Math.max(p.sA, p.sB) / p.t)} m/s − ${f(Math.min(p.sA, p.sB) / p.t)} m/s = ${f(Math.abs(p.sA - p.sB) / p.t)} m/s.`],
        hr: (p, f) => [`U trenutku t = ${f(p.t)} s pravac A pokazuje s = ${f(p.sA)} m, a pravac B s = ${f(p.sB)} m.`, `v_A = ${f(p.sA)} m / ${f(p.t)} s = ${f(p.sA / p.t)} m/s`, `v_B = ${f(p.sB)} m / ${f(p.t)} s = ${f(p.sB / p.t)} m/s`, `Pravac ${p.fast} je strmiji: ${p.hrOne} ${p.fast} brži je za ${f(Math.max(p.sA, p.sB) / p.t)} m/s − ${f(Math.min(p.sA, p.sB) / p.t)} m/s = ${f(Math.abs(p.sA - p.sB) / p.t)} m/s.`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('s / m'),
        xMax: p.t, yMax: Math.max(p.sA, p.sB), xStep: p.xs, yStep: p.u,
        lines: [
          { pts: [[0, 0], [p.t, p.sA]], label: { en: p.one + ' A', hr: p.hrOne + ' A' } },
          { pts: [[0, 0], [p.t, p.sB]], label: { en: p.one + ' B', hr: p.hrOne + ' B' } }
        ]
      })
    },
    {
      id: 'graph-st-rest', level: 2,
      params: R => {
        const w = R.pick([
          { en: 'hiker', hr: 'planinar', xs: 20, u: 1 },
          { en: 'cyclist', hr: 'biciklist', xs: 10, u: 2 },
          { en: 'bus', hr: 'autobus', xs: 5, u: 2 },
          { en: 'truck', hr: 'kamion', xs: 10, u: 5 }
        ]);
        // in grid squares: move, rest, move, rest, move
        const m1 = R.int(1, 2), r1 = R.int(1, 3), m2 = R.int(1, 2), r2 = R.int(1, 3), m3 = R.int(1, 2);
        const y1 = m1 * R.int(1, 2), y2 = y1 + m2 * R.int(1, 2), y3 = y2 + m3 * R.int(1, 2);
        const a1 = m1, b1 = a1 + r1, a2 = b1 + m2, b2 = a2 + r2, n = b2 + m3;
        return { en: w.en, hr: w.hr, xs: w.xs, u: w.u, a1: a1 * w.xs, b1: b1 * w.xs, a2: a2 * w.xs, b2: b2 * w.xs, end: n * w.xs, s1: y1 * w.u, s2: y2 * w.u, s3: y3 * w.u, top: Math.max(y3, 6) * w.u };
      },
      text: {
        en: (p, f) => `The graph shows the distance s covered by a ${p.en} during a trip, against time t. Read from the graph: for how many minutes in total was the ${p.en} at rest?`,
        hr: (p, f) => `Graf prikazuje put s koji je ${p.hr} prešao tijekom putovanja u ovisnosti o vremenu t. Očitaj iz grafa: koliko je ukupno minuta ${p.hr} mirovao?`
      },
      answer: p => (p.b1 - p.a1) + (p.b2 - p.a2), unit: 'min', tol: 0.02,
      hint: {
        en: 'At rest the distance stays the same, so look for the horizontal parts and read how long each of them lasts.',
        hr: 'Dok tijelo miruje, put se ne mijenja, pa potraži vodoravne dijelove grafa i očitaj koliko svaki od njih traje.'
      },
      steps: {
        en: (p, f) => [`While the ${p.en} is at rest the distance does not change: the graph is horizontal.`, `First flat part: from t = ${f(p.a1)} min to t = ${f(p.b1)} min, that is ${f(p.b1 - p.a1)} min.`, `Second flat part: from t = ${f(p.a2)} min to t = ${f(p.b2)} min, that is ${f(p.b2 - p.a2)} min.`, `In total: ${f(p.b1 - p.a1)} min + ${f(p.b2 - p.a2)} min = ${f(p.b1 - p.a1 + p.b2 - p.a2)} min`],
        hr: (p, f) => [`Dok ${p.hr} miruje, put se ne mijenja: graf je vodoravan.`, `Prvi vodoravni dio: od t = ${f(p.a1)} min do t = ${f(p.b1)} min, to je ${f(p.b1 - p.a1)} min.`, `Drugi vodoravni dio: od t = ${f(p.a2)} min do t = ${f(p.b2)} min, to je ${f(p.b2 - p.a2)} min.`, `Ukupno: ${f(p.b1 - p.a1)} min + ${f(p.b2 - p.a2)} min = ${f(p.b1 - p.a1 + p.b2 - p.a2)} min`]
      },
      graph: p => ({
        xLabel: ax('t / min'), yLabel: ax('s / km'),
        xMax: p.end, yMax: p.top, xStep: p.xs, yStep: p.u,
        lines: [{ pts: [[0, 0], [p.a1, p.s1], [p.b1, p.s1], [p.a2, p.s2], [p.b2, p.s2], [p.end, p.s3]] }]
      })
    },
    {
      id: 'graph-vt-acceleration', level: 2,
      params: R => {
        const m = R.pick([{ en: 'car', hr: 'Automobil' }, { en: 'motorbike', hr: 'Motocikl' }, { en: 'scooter', hr: 'Skuter' }, { en: 'racing car', hr: 'Trkaći automobil' }]);
        // xs = seconds per square across, u = m/s per square up, k = squares up per square across, n = squares across
        const c = R.pick([
          { xs: 1, u: 1, k: 0.5, n: 10 }, { xs: 1, u: 1, k: 1, n: 8 }, { xs: 1, u: 1, k: 1.5, n: 6 }, { xs: 1, u: 1, k: 2, n: 4 },
          { xs: 1, u: 2, k: 1, n: 8 }, { xs: 1, u: 2, k: 1.5, n: 6 },
          { xs: 2, u: 1, k: 1, n: 8 }, { xs: 2, u: 2, k: 0.5, n: 10 }, { xs: 2, u: 2, k: 1, n: 8 }, { xs: 2, u: 2, k: 1.5, n: 6 }, { xs: 2, u: 2, k: 2, n: 4 }
        ]);
        const b = R.int(0, 3);
        return { en: m.en, hr: m.hr, xs: c.xs, u: c.u, end: c.n * c.xs, v0: b * c.u, t1: 2 * c.xs, v1: (b + 2 * c.k) * c.u, t2: c.n * c.xs, v2: (b + c.k * c.n) * c.u };
      },
      text: {
        en: (p, f) => `A ${p.en} speeds up steadily. The graph shows its speed v against time t. Read from the graph the values you need and calculate the acceleration of the ${p.en}.`,
        hr: (p, f) => `${p.hr} jednoliko ubrzava. Graf prikazuje njegovu brzinu v u ovisnosti o vremenu t. Očitaj iz grafa potrebne vrijednosti i izračunaj ubrzanje.`
      },
      answer: p => (p.v2 - p.v1) / (p.t2 - p.t1), unit: 'm/s²', tol: 0.02,
      hint: {
        en: 'The acceleration is the slope of the v–t line: the change of speed divided by the change of time, a = Δv / Δt.',
        hr: 'Ubrzanje je nagib pravca u v–t grafu: promjena brzine podijeljena s promjenom vremena, a = Δv / Δt.'
      },
      steps: {
        en: (p, f) => [`Read two points on the line: at t₁ = ${f(p.t1)} s, v₁ = ${f(p.v1)} m/s, and at t₂ = ${f(p.t2)} s, v₂ = ${f(p.v2)} m/s.`, `Δv = ${f(p.v2)} m/s − ${f(p.v1)} m/s = ${f(p.v2 - p.v1)} m/s and Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `a = Δv / Δt = ${f(p.v2 - p.v1)} m/s / ${f(p.t2 - p.t1)} s = ${f((p.v2 - p.v1) / (p.t2 - p.t1))} m/s²`],
        hr: (p, f) => [`Očitaj dvije točke na pravcu: u trenutku t₁ = ${f(p.t1)} s je v₁ = ${f(p.v1)} m/s, a u trenutku t₂ = ${f(p.t2)} s je v₂ = ${f(p.v2)} m/s.`, `Δv = ${f(p.v2)} m/s − ${f(p.v1)} m/s = ${f(p.v2 - p.v1)} m/s, a Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `a = Δv / Δt = ${f(p.v2 - p.v1)} m/s / ${f(p.t2 - p.t1)} s = ${f((p.v2 - p.v1) / (p.t2 - p.t1))} m/s²`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('v / (m/s)'),
        xMax: p.end, yMax: p.v2, xStep: p.xs, yStep: p.u,
        lines: [{ pts: [[0, p.v0], [p.end, p.v2]] }]
      })
    },
    {
      id: 'graph-vt-area-rectangle', level: 2,
      params: R => {
        // u = m/s per square up, c = speed in squares, top = squares on the vertical axis
        const m = R.pick([
          { en: 'runner', hr: 'trkač', u: 1, c: [3, 6], top: 8 },
          { en: 'cyclist', hr: 'biciklist', u: 2, c: [2, 5], top: 6 },
          { en: 'car', hr: 'automobil', u: 5, c: [2, 6], top: 8 },
          { en: 'train', hr: 'vlak', u: 10, c: [2, 4], top: 6 }
        ]);
        const xs = R.pick([1, 2, 5]);
        const i1 = R.int(1, 4), i2 = R.int(i1 + 2, 10);
        return { en: m.en, hr: m.hr, u: m.u, xs, top: m.top * m.u, v: R.int(m.c[0], m.c[1]) * m.u, t1: i1 * xs, t2: i2 * xs };
      },
      text: {
        en: (p, f) => `The graph shows the speed v of a ${p.en} against time t. Read from the graph the values you need and calculate the distance the ${p.en} covers between t = ${f(p.t1)} s and t = ${f(p.t2)} s.`,
        hr: (p, f) => `Graf prikazuje brzinu v kojom se giba ${p.hr} u ovisnosti o vremenu t. Očitaj iz grafa potrebne vrijednosti i izračunaj koliki put ${p.hr} prijeđe između trenutaka t = ${f(p.t1)} s i t = ${f(p.t2)} s.`
      },
      answer: p => p.v * (p.t2 - p.t1), unit: 'm', tol: 0.02,
      hint: {
        en: 'The distance is the area under the v–t graph: here a rectangle with height v and width Δt.',
        hr: 'Put je površina ispod v–t grafa: ovdje pravokutnik visine v i širine Δt.'
      },
      steps: {
        en: (p, f) => [`The line is horizontal, so the speed is constant: the graph shows v = ${f(p.v)} m/s.`, `Time interval: Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, 'The distance is the area of the rectangle under the line: s = v · Δt', `s = ${f(p.v)} m/s · ${f(p.t2 - p.t1)} s = ${f(p.v * (p.t2 - p.t1))} m`],
        hr: (p, f) => [`Pravac je vodoravan, pa je brzina stalna: graf pokazuje v = ${f(p.v)} m/s.`, `Vremenski interval: Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, 'Put je površina pravokutnika ispod pravca: s = v · Δt', `s = ${f(p.v)} m/s · ${f(p.t2 - p.t1)} s = ${f(p.v * (p.t2 - p.t1))} m`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('v / (m/s)'),
        xMax: 10 * p.xs, yMax: p.top, xStep: p.xs, yStep: p.u,
        lines: [{ pts: [[0, p.v], [10 * p.xs, p.v]] }]
      })
    },
    {
      id: 'graph-vt-area-triangle', level: 3,
      params: R => {
        const c = R.pick([{ u: 1, k: 1 }, { u: 2, k: 1 }, { u: 2, k: 0.5 }, { u: 5, k: 0.5 }, { u: 1, k: 1.5 }, { u: 1, k: 2 }]);
        const n = SPAN[c.k];
        const t = c.k % 1 ? 2 * R.int(1, n / 2) : R.int(2, n);
        return { u: c.u, k: c.k, n, t, v: c.k * t * c.u };
      },
      text: {
        en: (p, f) => `A car starts from rest and speeds up steadily. The graph shows its speed v against time t. Read from the graph the values you need and calculate the distance the car covers between t = ${f(0)} s and t = ${f(p.t)} s.`,
        hr: (p, f) => `Automobil kreće iz mirovanja i jednoliko ubrzava. Graf prikazuje njegovu brzinu v u ovisnosti o vremenu t. Očitaj iz grafa potrebne vrijednosti i izračunaj koliki put automobil prijeđe od trenutka t = ${f(0)} s do trenutka t = ${f(p.t)} s.`
      },
      answer: p => p.t * p.v / 2, unit: 'm', tol: 0.02,
      hint: {
        en: 'The distance is the area under the v–t graph. Here it is a triangle: half of base times height.',
        hr: 'Put je površina ispod v–t grafa. Ovdje je to trokut: polovica umnoška osnovice i visine.'
      },
      steps: {
        en: (p, f) => [`At t = ${f(p.t)} s the graph shows v = ${f(p.v)} m/s.`, `The distance is the area under the line: a triangle with base ${f(p.t)} s and height ${f(p.v)} m/s.`, `s = (t · v) / ${f(2)} = (${f(p.t)} s · ${f(p.v)} m/s) / ${f(2)}`, `s = ${f(p.t * p.v / 2)} m`],
        hr: (p, f) => [`U trenutku t = ${f(p.t)} s graf pokazuje v = ${f(p.v)} m/s.`, `Put je površina ispod pravca: trokut s osnovicom ${f(p.t)} s i visinom ${f(p.v)} m/s.`, `s = (t · v) / ${f(2)} = (${f(p.t)} s · ${f(p.v)} m/s) / ${f(2)}`, `s = ${f(p.t * p.v / 2)} m`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('v / (m/s)'),
        xMax: p.n, yMax: p.k * p.n * p.u, xStep: 1, yStep: p.u,
        lines: [{ pts: [[0, 0], [p.n, p.k * p.n * p.u]] }]
      })
    },
    {
      id: 'graph-st-average-speed', level: 3,
      params: R => {
        // u = km per square up, cs = allowed squares per hour (so the speed on one part is c · u)
        const m = R.pick([
          { en: 'hiker', hr: 'planinar', u: 2, cs: [1, 2, 3] },
          { en: 'cyclist', hr: 'biciklist', u: 10, cs: [1, 2] },
          { en: 'bus', hr: 'autobus', u: 20, cs: [1, 2, 3, 4] },
          { en: 'car', hr: 'automobil', u: 50, cs: [1, 2] },
          { en: 'train', hr: 'vlak', u: 50, cs: [1, 2, 3] }
        ]);
        let n, t1, c1, c2, tot;
        do {
          n = R.pick([4, 5]);
          t1 = n === 4 ? R.pick([1, 3]) : R.int(1, 4);      // never half of the trip: the plain average of the two speeds is then wrong
          c1 = R.pick(m.cs); c2 = R.pick(m.cs);
          tot = c1 * t1 + c2 * (n - t1);
        } while (c1 === c2 || tot > 12);
        return { en: m.en, hr: m.hr, u: m.u, t1, s1: c1 * t1 * m.u, t: n, s: tot * m.u, v1: c1 * m.u, v2: c2 * m.u };
      },
      text: {
        en: (p, f) => `The graph shows the distance s covered by a ${p.en} during a trip, against time t. Read from the graph the values you need and calculate the average speed of the ${p.en} for the whole trip.`,
        hr: (p, f) => `Graf prikazuje put s koji je ${p.hr} prešao tijekom putovanja u ovisnosti o vremenu t. Očitaj iz grafa potrebne vrijednosti i izračunaj srednju brzinu na cijelom putu.`
      },
      answer: p => p.s / p.t, unit: 'km/h', tol: 0.02,
      hint: {
        en: 'Average speed = total distance / total time. Read the end point of the graph; do not average the two speeds.',
        hr: 'Srednja brzina = ukupni put / ukupno vrijeme. Očitaj krajnju točku grafa; nemoj računati prosjek dviju brzina.'
      },
      steps: {
        en: (p, f) => [`The trip ends at t = ${f(p.t)} h, where the graph shows s = ${f(p.s)} km.`, 'Average speed = total distance / total time', `v = ${f(p.s)} km / ${f(p.t)} h = ${f(p.s / p.t)} km/h`, `Check: the speeds on the two parts are ${f(p.v1)} km/h and ${f(p.v2)} km/h, but the parts last different times, so their plain average is not the answer.`],
        hr: (p, f) => [`Putovanje završava u trenutku t = ${f(p.t)} h, gdje graf pokazuje s = ${f(p.s)} km.`, 'Srednja brzina = ukupni put / ukupno vrijeme', `v = ${f(p.s)} km / ${f(p.t)} h = ${f(p.s / p.t)} km/h`, `Provjera: brzine na dvama dijelovima puta su ${f(p.v1)} km/h i ${f(p.v2)} km/h, ali ti dijelovi ne traju jednako dugo, pa njihov obični prosjek nije rješenje.`]
      },
      graph: p => ({
        xLabel: ax('t / h'), yLabel: ax('s / km'),
        xMax: p.t, yMax: p.s, xStep: 1, yStep: p.u,
        lines: [{ pts: [[0, 0], [p.t1, p.s1], [p.t, p.s]] }]
      })
    }
  ]);

  // ------------------------------------------------------------------ forces
  window.Content.registerProblems('forces', [
    {
      id: 'graph-spring-extension', level: 1,
      params: R => {
        // k = squares up per square across, xs = cm per square, ys = N per square
        const k = R.pick([0.5, 1, 2]), n = SPAN[k];
        const xs = R.pick([1, 2]), ys = R.pick([1, 2, 5]);
        const j = k === 2 ? 2 * R.int(1, 5) : R.int(2, k * n - 1);
        return { k, n, xs, ys, F: j * ys, x: j / k * xs };
      },
      text: {
        en: (p, f) => `Weights are hung on a spring and its extension x is measured. The graph shows the force F against the extension x. Read from the graph: what is the extension of the spring when the force is ${f(p.F)} N?`,
        hr: (p, f) => `Na oprugu se vješaju utezi i mjeri se njezino produljenje x. Graf prikazuje silu F u ovisnosti o produljenju x. Očitaj iz grafa: koliko je produljenje opruge kada je sila ${f(p.F)} N?`
      },
      answer: p => p.x, unit: 'cm', tol: 0.02,
      hint: {
        en: 'Start on the force axis, go across to the line and then straight down to the extension axis.',
        hr: 'Kreni od osi sile, idi vodoravno do pravca, a zatim ravno dolje do osi produljenja.'
      },
      steps: {
        en: (p, f) => [`Find F = ${f(p.F)} N on the vertical axis and go across to the line.`, 'From that point go straight down to the horizontal axis and read the extension.', `At F = ${f(p.F)} N the graph shows x = ${f(p.x)} cm.`],
        hr: (p, f) => [`Na okomitoj osi pronađi F = ${f(p.F)} N i idi vodoravno do pravca.`, 'Od te točke idi ravno dolje do vodoravne osi i očitaj produljenje.', `Pri sili F = ${f(p.F)} N graf pokazuje x = ${f(p.x)} cm.`]
      },
      graph: p => ({
        xLabel: ax('x / cm'), yLabel: ax('F / N'),
        xMax: p.n * p.xs, yMax: p.k * p.n * p.ys, xStep: p.xs, yStep: p.ys,
        lines: [{ pts: [[0, 0], [p.n * p.xs, p.k * p.n * p.ys]] }],
        points: dots(p.n, p.xs, p.k * p.ys)
      })
    },
    {
      id: 'graph-spring-constant', level: 2,
      params: R => {
        const k = R.pick([0.5, 1, 2]), n = SPAN[k];
        const xs = R.pick([1, 2]), ys = R.pick([1, 2, 5]);
        const i = k === 2 ? 5 : 10;
        return { name: R.pick(NAMES), k, n, xs, ys, x: i * xs, F: k * i * ys };
      },
      text: {
        en: (p, f) => `${p.name} hangs weights on a spring and measures its extension x. The graph shows the force F against the extension x. Read from the graph the values you need and calculate the spring constant k in N/m.`,
        hr: (p, f) => `${p.name} vješa utege na oprugu i mjeri njezino produljenje x. Graf prikazuje silu F u ovisnosti o produljenju x. Očitaj iz grafa potrebne vrijednosti i izračunaj konstantu elastičnosti opruge k u N/m.`
      },
      answer: p => p.F * 100 / p.x, unit: 'N/m', tol: 0.02,
      hint: {
        en: 'k = F / x. Read one point on the line and change the centimetres into metres first (divide by 100).',
        hr: 'k = F / x. Očitaj jednu točku na pravcu i najprije pretvori centimetre u metre (podijeli sa 100).'
      },
      steps: {
        en: (p, f) => [`Read a point on the line: at x = ${f(p.x)} cm the graph shows F = ${f(p.F)} N.`, `Change the extension into metres: ${f(p.x)} cm = ${f(p.x / 100)} m`, `k = F / x = ${f(p.F)} N / ${f(p.x / 100)} m`, `k = ${f(p.F * 100 / p.x)} N/m`],
        hr: (p, f) => [`Očitaj točku na pravcu: pri produljenju x = ${f(p.x)} cm graf pokazuje F = ${f(p.F)} N.`, `Pretvori produljenje u metre: ${f(p.x)} cm = ${f(p.x / 100)} m`, `k = F / x = ${f(p.F)} N / ${f(p.x / 100)} m`, `k = ${f(p.F * 100 / p.x)} N/m`]
      },
      graph: p => ({
        xLabel: ax('x / cm'), yLabel: ax('F / N'),
        xMax: p.n * p.xs, yMax: p.k * p.n * p.ys, xStep: p.xs, yStep: p.ys,
        lines: [{ pts: [[0, 0], [p.n * p.xs, p.k * p.n * p.ys]] }],
        points: dots(p.n, p.xs, p.k * p.ys)
      })
    }
  ]);

  // ------------------------------------------------------------------ density
  // [cm³ per square across, g per square up]
  const MV_GRIDS = [[10, 5], [5, 2], [5, 5], [2, 5], [5, 10], [1, 2], [5, 20], [1, 5]];
  window.Content.registerProblems('density', [
    {
      id: 'graph-density-slope', level: 2,
      params: R => {
        const g = R.pick(MV_GRIDS), k = R.pick([0.5, 1, 1.5, 2]), n = SPAN[k];
        const i = k === 2 ? 5 : (k === 1.5 ? 4 : 10);
        return { name: R.pick(NAMES), k, n, xs: g[0], ys: g[1], V: i * g[0], m: k * i * g[1] };
      },
      text: {
        en: (p, f) => `${p.name} measures the mass m and the volume V of several pieces of the same material. The graph shows the mass against the volume. Read from the graph the values you need and calculate the density of the material.`,
        hr: (p, f) => `${p.name} mjeri masu m i obujam V nekoliko komada iste tvari. Graf prikazuje masu u ovisnosti o obujmu. Očitaj iz grafa potrebne vrijednosti i izračunaj gustoću te tvari.`
      },
      answer: p => p.m / p.V, unit: 'g/cm³', tol: 0.02,
      hint: {
        en: 'The density is the slope of the line: read one point on it and divide the mass by the volume.',
        hr: 'Gustoća je nagib pravca: očitaj jednu točku na njemu i podijeli masu s obujmom.'
      },
      steps: {
        en: (p, f) => [`Read a point on the line: at V = ${f(p.V)} cm³ the graph shows m = ${f(p.m)} g.`, 'ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`],
        hr: (p, f) => [`Očitaj točku na pravcu: pri obujmu V = ${f(p.V)} cm³ graf pokazuje m = ${f(p.m)} g.`, 'ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`]
      },
      graph: p => ({
        xLabel: ax('V / cm³'), yLabel: ax('m / g'),
        xMax: p.n * p.xs, yMax: p.k * p.n * p.ys, xStep: p.xs, yStep: p.ys,
        lines: [{ pts: [[0, 0], [p.n * p.xs, p.k * p.n * p.ys]] }],
        points: dots(p.n, p.xs, p.k * p.ys)
      })
    },
    {
      id: 'graph-density-two-materials', level: 2,
      params: R => {
        const g = R.pick(MV_GRIDS), n = R.pick([6, 8]);
        const pair = twoOf(R, n === 6 ? [0.5, 1, 1.5, 2] : [0.5, 1, 1.5]);
        const aDenser = R.pick([true, false]);
        return { name: R.pick(NAMES), n, xs: g[0], ys: g[1], kA: aDenser ? pair[1] : pair[0], kB: aDenser ? pair[0] : pair[1], top: pair[1] * n * g[1], denser: aDenser ? 'A' : 'B', V: 4 * g[0], m: pair[1] * 4 * g[1], mOther: pair[0] * 4 * g[1] };
      },
      text: {
        en: (p, f) => `${p.name} measures the mass m and the volume V of pieces of two materials, A and B. The graph shows the mass against the volume for each material. Read from the graph the values you need: which material is denser? Calculate its density.`,
        hr: (p, f) => `${p.name} mjeri masu m i obujam V komada dviju tvari, A i B. Graf prikazuje masu u ovisnosti o obujmu za svaku tvar. Očitaj iz grafa potrebne vrijednosti: koja je tvar gušća? Izračunaj njezinu gustoću.`
      },
      answer: p => p.m / p.V, unit: 'g/cm³', tol: 0.02,
      hint: {
        en: 'For the same volume the denser material has more mass, so its line is steeper. Then ρ = m / V for a point on that line.',
        hr: 'Pri istom obujmu gušća tvar ima veću masu, pa je njezin pravac strmiji. Zatim izračunaj ρ = m / V za jednu točku na tom pravcu.'
      },
      steps: {
        en: (p, f) => [`For the same volume the denser material has more mass, so its line is steeper: material ${p.denser}.`, `Read a point on that line: at V = ${f(p.V)} cm³ the graph shows m = ${f(p.m)} g.`, `ρ = m / V = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`, `For comparison, the other material: ${f(p.mOther)} g / ${f(p.V)} cm³ = ${f(p.mOther / p.V)} g/cm³`],
        hr: (p, f) => [`Pri istom obujmu gušća tvar ima veću masu, pa je njezin pravac strmiji: tvar ${p.denser}.`, `Očitaj točku na tom pravcu: pri obujmu V = ${f(p.V)} cm³ graf pokazuje m = ${f(p.m)} g.`, `ρ = m / V = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`, `Za usporedbu, druga tvar: ${f(p.mOther)} g / ${f(p.V)} cm³ = ${f(p.mOther / p.V)} g/cm³`]
      },
      graph: p => ({
        xLabel: ax('V / cm³'), yLabel: ax('m / g'),
        xMax: p.n * p.xs, yMax: p.top, xStep: p.xs, yStep: p.ys,
        lines: [
          { pts: [[0, 0], [p.n * p.xs, p.kA * p.n * p.ys]], label: { en: 'material A', hr: 'tvar A' } },
          { pts: [[0, 0], [p.n * p.xs, p.kB * p.n * p.ys]], label: { en: 'material B', hr: 'tvar B' } }
        ]
      })
    }
  ]);

  // ------------------------------------------------------------------ electricity
  window.Content.registerProblems('electricity', [
    {
      id: 'graph-resistance', level: 2,
      params: R => {
        // k = squares up per square across, xs = volts per square, ys = amperes per square
        const k = R.pick([0.5, 1, 2]), n = SPAN[k];
        const xs = R.pick([1, 2]), ys = R.pick([0.05, 0.1, 0.2]);
        const i = k === 2 ? 5 : 10;
        return { name: R.pick(NAMES), k, n, xs, ys, U: i * xs, I: r2(k * i * ys), top: r2(k * n * ys) };
      },
      text: {
        en: (p, f) => `${p.name} connects a resistor to a power supply, changes the voltage U and measures the current I each time. The graph shows the current against the voltage. Read from the graph the values you need and calculate the resistance of the resistor.`,
        hr: (p, f) => `${p.name} spaja otpornik na izvor napona, mijenja napon U i svaki put mjeri jakost struje I. Graf prikazuje jakost struje u ovisnosti o naponu. Očitaj iz grafa potrebne vrijednosti i izračunaj otpor otpornika.`
      },
      answer: p => p.U / p.I, unit: 'Ω', tol: 0.02,
      hint: {
        en: 'Ohm\'s law: R = U / I. Read the voltage and the current at one point of the line.',
        hr: 'Ohmov zakon: R = U / I. Očitaj napon i jakost struje u jednoj točki pravca.'
      },
      steps: {
        en: (p, f) => [`Read a point on the line: at U = ${f(p.U)} V the graph shows I = ${f(p.I)} A.`, 'R = U / I', `R = ${f(p.U)} V / ${f(p.I)} A = ${f(p.U / p.I)} Ω`],
        hr: (p, f) => [`Očitaj točku na pravcu: pri naponu U = ${f(p.U)} V graf pokazuje I = ${f(p.I)} A.`, 'R = U / I', `R = ${f(p.U)} V / ${f(p.I)} A = ${f(p.U / p.I)} Ω`]
      },
      graph: p => ({
        xLabel: ax('U / V'), yLabel: ax('I / A'),
        xMax: p.n * p.xs, yMax: p.top, xStep: p.xs, yStep: p.ys,
        lines: [{ pts: [[0, 0], [p.n * p.xs, p.top]] }],
        points: dots(p.n, p.xs, p.k * p.ys)
      })
    },
    {
      id: 'graph-two-resistors', level: 3,
      params: R => {
        const xs = R.pick([1, 2]), ys = R.pick([0.05, 0.1, 0.2]);
        const pair = twoOf(R, [0.5, 1, 2]);
        const aSteeper = R.pick([true, false]);
        return { name: R.pick(NAMES), xs, ys, kA: aSteeper ? pair[1] : pair[0], kB: aSteeper ? pair[0] : pair[1], top: r2(pair[1] * 6 * ys), steeper: aSteeper ? 'A' : 'B', U: 4 * xs, I: r2(pair[1] * 4 * ys), IOther: r2(pair[0] * 4 * ys) };
      },
      text: {
        en: (p, f) => `${p.name} measures the current I through two resistors, A and B, at several voltages U. The graph shows the current against the voltage for each resistor. Read from the graph the values you need and calculate the resistance of the resistor whose line is steeper.`,
        hr: (p, f) => `${p.name} mjeri jakost struje I kroz dva otpornika, A i B, pri različitim naponima U. Graf prikazuje jakost struje u ovisnosti o naponu za svaki otpornik. Očitaj iz grafa potrebne vrijednosti i izračunaj otpor otpornika čiji je pravac strmiji.`
      },
      answer: p => p.U / p.I, unit: 'Ω', tol: 0.02,
      hint: {
        en: 'R = U / I for a point on the steeper line. Careful: on this graph a steeper line means more current, not more resistance.',
        hr: 'R = U / I za točku na strmijem pravcu. Oprez: u ovom grafu strmiji pravac znači jaču struju, a ne veći otpor.'
      },
      steps: {
        en: (p, f) => [`The steeper line belongs to resistor ${p.steeper}: at the same voltage more current flows through it.`, `Read a point on that line: at U = ${f(p.U)} V the graph shows I = ${f(p.I)} A.`, `R = U / I = ${f(p.U)} V / ${f(p.I)} A = ${f(p.U / p.I)} Ω`, `For comparison, the other resistor: ${f(p.U)} V / ${f(p.IOther)} A = ${f(p.U / p.IOther)} Ω. The steeper line means the smaller resistance.`],
        hr: (p, f) => [`Strmiji pravac pripada otporniku ${p.steeper}: pri istom naponu kroz njega teče jača struja.`, `Očitaj točku na tom pravcu: pri naponu U = ${f(p.U)} V graf pokazuje I = ${f(p.I)} A.`, `R = U / I = ${f(p.U)} V / ${f(p.I)} A = ${f(p.U / p.I)} Ω`, `Za usporedbu, drugi otpornik: ${f(p.U)} V / ${f(p.IOther)} A = ${f(p.U / p.IOther)} Ω. Strmiji pravac znači manji otpor.`]
      },
      graph: p => ({
        xLabel: ax('U / V'), yLabel: ax('I / A'),
        xMax: 6 * p.xs, yMax: p.top, xStep: p.xs, yStep: p.ys,
        lines: [
          { pts: [[0, 0], [6 * p.xs, r2(p.kA * 6 * p.ys)]], label: { en: 'resistor A', hr: 'otpornik A' } },
          { pts: [[0, 0], [6 * p.xs, r2(p.kB * 6 * p.ys)]], label: { en: 'resistor B', hr: 'otpornik B' } }
        ]
      })
    }
  ]);

  // ------------------------------------------------------------------ heat
  window.Content.registerProblems('heat', [
    {
      id: 'graph-heating-curve', level: 1,
      params: R => {
        // melting temperatures rounded to the 10 °C grid
        const sub = R.pick([
          { en: 'Gallium', hr: 'galij', Tm: 30 },
          { en: 'Paraffin wax', hr: 'parafin', Tm: 60 },
          { en: 'Stearic acid', hr: 'stearinska kiselina', Tm: 70 },
          { en: 'Naphthalene', hr: 'naftalen', Tm: 80 }
        ]);
        const xs = R.pick([1, 2]);                                   // minutes per square
        const a = R.int(2, 4), m = R.int(2, 5), c = R.int(2, 3);     // squares: warming up, melting, warming up
        return { en: sub.en, hr: sub.hr, xs, T0: sub.Tm > 30 ? R.pick([20, 30]) : 10, Tm: sub.Tm, Tend: sub.Tm + 10 * R.int(2, 3), ta: a * xs, tb: (a + m) * xs, tend: (a + m + c) * xs };
      },
      text: {
        en: (p, f) => `${p.en} is heated steadily in a test tube. The graph shows its temperature T against time t. While the substance is melting, its temperature does not change. Read from the graph: for how many minutes did the melting last?`,
        hr: (p, f) => `U epruveti se jednoliko zagrijava ${p.hr}. Graf prikazuje temperaturu T u ovisnosti o vremenu t. Dok se tvar tali, temperatura joj se ne mijenja. Očitaj iz grafa: koliko je minuta trajalo taljenje?`
      },
      answer: p => p.tb - p.ta, unit: 'min', tol: 0.02,
      hint: {
        en: 'Find the horizontal part of the graph and read the times at which it begins and ends.',
        hr: 'Pronađi vodoravni dio grafa i očitaj trenutke u kojima počinje i završava.'
      },
      steps: {
        en: (p, f) => [`Melting is the flat part of the graph, at T = ${f(p.Tm)} °C (the melting temperature).`, `The flat part begins at t = ${f(p.ta)} min and ends at t = ${f(p.tb)} min.`, `The melting lasted ${f(p.tb)} min − ${f(p.ta)} min = ${f(p.tb - p.ta)} min.`],
        hr: (p, f) => [`Taljenju odgovara vodoravni dio grafa, pri T = ${f(p.Tm)} °C (to je talište).`, `Vodoravni dio počinje u trenutku t = ${f(p.ta)} min, a završava u trenutku t = ${f(p.tb)} min.`, `Taljenje je trajalo ${f(p.tb)} min − ${f(p.ta)} min = ${f(p.tb - p.ta)} min.`]
      },
      graph: p => ({
        xLabel: ax('t / min'), yLabel: ax('T / °C'),
        xMax: p.tend, yMax: p.Tend, xStep: p.xs, yStep: 10,
        lines: [{ pts: [[0, p.T0], [p.ta, p.Tm], [p.tb, p.Tm], [p.tend, p.Tend]] }]
      })
    },
    {
      id: 'graph-cooling-curve', level: 2,
      params: R => {
        const d = R.pick([{ en: 'tea', hr: 'vruć čaj' }, { en: 'coffee', hr: 'vruća kava' }, { en: 'cocoa', hr: 'vruć kakao' }, { en: 'milk', hr: 'vruće mlijeko' }]);
        // [start temperature, drop in each of the three 10-minute intervals, °C per square]
        const c = R.pick([[80, 30, 20, 10, 10], [90, 30, 20, 10, 10], [90, 40, 20, 10, 10], [50, 15, 10, 5, 5], [55, 15, 10, 5, 5], [55, 20, 10, 5, 5], [60, 15, 10, 5, 5], [60, 20, 10, 5, 5]]);
        return { en: d.en, hr: d.hr, ys: c[4], T0: c[0], T1: c[0] - c[1], T2: c[0] - c[1] - c[2], T3: c[0] - c[1] - c[2] - c[3] };
      },
      text: {
        en: (p, f) => `A cup of hot ${p.en} is cooling on a table. The graph shows its temperature T against time t. Read from the graph: by how many degrees did the temperature fall in the first ${f(10)} minutes?`,
        hr: (p, f) => `Na stolu se hladi ${p.hr}. Graf prikazuje temperaturu T u ovisnosti o vremenu t. Očitaj iz grafa: za koliko se stupnjeva temperatura snizila u prvih ${f(10)} minuta?`
      },
      answer: p => p.T0 - p.T1, unit: '°C', tol: 0.02,
      hint: {
        en: 'Read the temperature at the start and at t = 10 min and subtract. The answer is the change, not the temperature at 10 min.',
        hr: 'Očitaj temperaturu na početku i u trenutku t = 10 min pa ih oduzmi. Traži se promjena, a ne temperatura nakon 10 min.'
      },
      steps: {
        en: (p, f) => [`At t = ${f(0)} min the graph shows T = ${f(p.T0)} °C.`, `At t = ${f(10)} min the graph shows T = ${f(p.T1)} °C.`, `ΔT = ${f(p.T0)} °C − ${f(p.T1)} °C = ${f(p.T0 - p.T1)} °C`, `In the next ${f(10)} minutes the temperature falls by only ${f(p.T1 - p.T2)} °C: the line gets less steep because the cooling slows down.`],
        hr: (p, f) => [`U trenutku t = ${f(0)} min graf pokazuje T = ${f(p.T0)} °C.`, `U trenutku t = ${f(10)} min graf pokazuje T = ${f(p.T1)} °C.`, `ΔT = ${f(p.T0)} °C − ${f(p.T1)} °C = ${f(p.T0 - p.T1)} °C`, `U sljedećih ${f(10)} minuta temperatura se snizi samo za ${f(p.T1 - p.T2)} °C: crta postaje manje strma jer se hlađenje usporava.`]
      },
      graph: p => ({
        xLabel: ax('t / min'), yLabel: ax('T / °C'),
        xMax: 30, yMax: p.ys === 10 ? 100 : 60, xStep: 5, yStep: p.ys,
        lines: [{ pts: [[0, p.T0], [10, p.T1], [20, p.T2], [30, p.T3]] }]
      })
    }
  ]);

  // ------------------------------------------------------------------ energy
  window.Content.registerProblems('energy', [
    {
      id: 'graph-work-area', level: 2,
      params: R => {
        // xs = metres per square across, ys = newtons per square up
        const c = R.pick([
          { en: 'A child pulls a sled', hr: 'Dijete vuče sanjke', xs: 10, ys: 5 },
          { en: 'A shopper pushes a trolley', hr: 'Kupac gura kolica', xs: 2, ys: 5 },
          { en: 'A worker pushes a crate', hr: 'Radnik gura sanduk', xs: 1, ys: 50 },
          { en: 'A horse pulls a cart', hr: 'Konj vuče kola', xs: 10, ys: 100 }
        ]);
        const j = R.int(4, 10), i = R.int(4, 10);
        return { en: c.en, hr: c.hr, xs: c.xs, ys: c.ys, F: j * c.ys, s: i * c.xs, xMax: (i <= 8 ? 10 : 12) * c.xs, yMax: (j <= 8 ? 10 : 12) * c.ys };
      },
      text: {
        en: (p, f) => `${p.en} with a constant force. The graph shows the force F against the distance s. Read from the graph the values you need and calculate the work done over the whole distance shown by the line.`,
        hr: (p, f) => `${p.hr} stalnom silom. Graf prikazuje silu F u ovisnosti o putu s. Očitaj iz grafa potrebne vrijednosti i izračunaj rad obavljen na cijelom putu koji prikazuje crta.`
      },
      answer: p => p.F * p.s, unit: 'J', tol: 0.02,
      hint: {
        en: 'The work is the area under the force–distance graph: here a rectangle, W = F · s.',
        hr: 'Rad je površina ispod grafa sile u ovisnosti o putu: ovdje pravokutnik, W = F · s.'
      },
      steps: {
        en: (p, f) => [`The line is horizontal, so the force is constant: the graph shows F = ${f(p.F)} N.`, `The line ends at s = ${f(p.s)} m.`, 'The work is the area of the rectangle under the line: W = F · s', `W = ${f(p.F)} N · ${f(p.s)} m = ${f(p.F * p.s)} J`],
        hr: (p, f) => [`Crta je vodoravna, pa je sila stalna: graf pokazuje F = ${f(p.F)} N.`, `Crta završava pri s = ${f(p.s)} m.`, 'Rad je površina pravokutnika ispod crte: W = F · s', `W = ${f(p.F)} N · ${f(p.s)} m = ${f(p.F * p.s)} J`]
      },
      graph: p => ({
        xLabel: ax('s / m'), yLabel: ax('F / N'),
        xMax: p.xMax, yMax: p.yMax, xStep: p.xs, yStep: p.ys,
        lines: [{ pts: [[0, p.F], [p.s, p.F]] }]
      })
    },
    {
      id: 'graph-power-slope', level: 3,
      params: R => {
        // 10 s per square across, ys = kJ per square up, ks = allowed squares up per square across (power = k · ys · 100 W)
        const d = R.pick([
          { en: 'kettle', hr: 'kuhalo za vodu', ys: 10, ks: [1.5, 2] },
          { en: 'hair dryer', hr: 'sušilo za kosu', ys: 10, ks: [1, 1.5, 2] },
          { en: 'heater', hr: 'grijalica', ys: 10, ks: [1, 1.5, 2] },
          { en: 'toaster', hr: 'toster', ys: 5, ks: [1.5, 2] },
          { en: 'vacuum cleaner', hr: 'usisavač', ys: 5, ks: [1, 1.5, 2] }
        ]);
        const k = R.pick(d.ks), n = { 1: 8, 1.5: 6, 2: 4 }[k], b = R.int(1, 3);
        return { en: d.en, hr: d.hr, ys: d.ys, E0: b * d.ys, t1: 20, E1: (b + 2 * k) * d.ys, t2: n * 10, E2: (b + k * n) * d.ys };
      },
      text: {
        en: (p, f) => `An electricity meter records the energy E used by a ${p.en}. The graph shows the meter reading against time t while the ${p.en} is switched on. Read from the graph the values you need and calculate the power of the ${p.en} in watts.`,
        hr: (p, f) => `Brojilo mjeri električnu energiju E koju troši ${p.hr}. Graf prikazuje stanje brojila u ovisnosti o vremenu t dok ${p.hr} radi. Očitaj iz grafa potrebne vrijednosti i izračunaj snagu tog uređaja u vatima.`
      },
      answer: p => (p.E2 - p.E1) * 1000 / (p.t2 - p.t1), unit: 'W', tol: 0.02,
      hint: {
        en: 'Power is the slope of the energy–time line: P = ΔE / Δt. The line does not start at zero, so use two points, and change kJ into J (1 kJ = 1000 J).',
        hr: 'Snaga je nagib pravca u grafu energije u ovisnosti o vremenu: P = ΔE / Δt. Pravac ne počinje u nuli, pa uzmi dvije točke i pretvori kJ u J (1 kJ = 1000 J).'
      },
      steps: {
        en: (p, f) => [`Read two points on the line: at t₁ = ${f(p.t1)} s, E₁ = ${f(p.E1)} kJ, and at t₂ = ${f(p.t2)} s, E₂ = ${f(p.E2)} kJ.`, `ΔE = ${f(p.E2)} kJ − ${f(p.E1)} kJ = ${f(p.E2 - p.E1)} kJ = ${f((p.E2 - p.E1) * 1000)} J`, `Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `P = ΔE / Δt = ${f((p.E2 - p.E1) * 1000)} J / ${f(p.t2 - p.t1)} s = ${f((p.E2 - p.E1) * 1000 / (p.t2 - p.t1))} W`],
        hr: (p, f) => [`Očitaj dvije točke na pravcu: u trenutku t₁ = ${f(p.t1)} s je E₁ = ${f(p.E1)} kJ, a u trenutku t₂ = ${f(p.t2)} s je E₂ = ${f(p.E2)} kJ.`, `ΔE = ${f(p.E2)} kJ − ${f(p.E1)} kJ = ${f(p.E2 - p.E1)} kJ = ${f((p.E2 - p.E1) * 1000)} J`, `Δt = ${f(p.t2)} s − ${f(p.t1)} s = ${f(p.t2 - p.t1)} s`, `P = ΔE / Δt = ${f((p.E2 - p.E1) * 1000)} J / ${f(p.t2 - p.t1)} s = ${f((p.E2 - p.E1) * 1000 / (p.t2 - p.t1))} W`]
      },
      graph: p => ({
        xLabel: ax('t / s'), yLabel: ax('E / kJ'),
        xMax: p.t2, yMax: p.E2, xStep: 10, yStep: p.ys,
        lines: [{ pts: [[0, p.E0], [p.t2, p.E2]] }]
      })
    }
  ]);
})();
