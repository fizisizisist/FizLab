/* FizLab practice problems: How Science Works / Kako znanost radi (measurement / mjerenje) */
(function () {
  'use strict';

  // zero-sum deviation sets (in the last digit) so that the mean comes out clean
  const DEV4 = [[-2, 1, 3, -2], [2, -3, 1, 0], [-1, 4, -2, -1], [3, -1, -1, -1], [-3, 2, 2, -1]];
  const DEV5 = [[-2, 1, 3, -1, -1], [2, -3, 1, 1, -1], [-1, 2, -2, 3, -2], [1, -1, 2, -3, 1], [-2, -1, 0, 1, 2]];
  const MATERIALS = [
    { name: { en: 'aluminium', hr: 'aluminij', hrGen: 'aluminija' }, rho: 2.7 },
    { name: { en: 'glass', hr: 'staklo', hrGen: 'stakla' }, rho: 2.5 },
    { name: { en: 'iron', hr: 'željezo', hrGen: 'željeza' }, rho: 7.9 },
    { name: { en: 'copper', hr: 'bakar', hrGen: 'bakra' }, rho: 9 },
    { name: { en: 'silver', hr: 'srebro', hrGen: 'srebra' }, rho: 10.5 },
    { name: { en: 'gold', hr: 'zlato', hrGen: 'zlata' }, rho: 19.3 },
    { name: { en: 'ice', hr: 'led', hrGen: 'leda' }, rho: 0.9 },
    { name: { en: 'oak wood', hr: 'hrastovo drvo', hrGen: 'hrastova drva' }, rho: 0.7 }
  ];

  window.Content.registerProblems('science', [
    {
      id: 'mean-of-three', level: 1,
      params: R => {
        const m = R.step(12, 30, 0.5);
        const d1 = R.pick([-0.3, -0.2, -0.1]);
        const d2 = R.pick([0.1, 0.2, 0.3]);
        const d3 = -(d1 + d2);
        return { m, x1: m + d1, x2: m + d2, x3: m + d3 };
      },
      text: {
        en: (p, f) => `Ana measured the length of her pencil case three times: ${f(p.x1, 1)} cm, ${f(p.x2, 1)} cm and ${f(p.x3, 1)} cm. What is the mean value of the length?`,
        hr: (p, f) => `Ana je tri puta izmjerila duljinu svoje pernice: ${f(p.x1, 1)} cm, ${f(p.x2, 1)} cm i ${f(p.x3, 1)} cm. Kolika je srednja vrijednost duljine?`
      },
      answer: p => p.m, unit: 'cm', abs: 0.05,
      hint: { en: 'Add the three readings and divide by 3.', hr: 'Zbroji tri izmjerene vrijednosti i podijeli s 3.' },
      steps: {
        en: (p, f) => ['x̄ = (x₁ + x₂ + x₃) / 3', `x̄ = (${f(p.x1, 1)} + ${f(p.x2, 1)} + ${f(p.x3, 1)}) cm / 3 = ${f(p.x1 + p.x2 + p.x3, 1)} cm / 3`, `x̄ = ${f(p.m, 1)} cm`],
        hr: (p, f) => ['x̄ = (x₁ + x₂ + x₃) / 3', `x̄ = (${f(p.x1, 1)} + ${f(p.x2, 1)} + ${f(p.x3, 1)}) cm / 3 = ${f(p.x1 + p.x2 + p.x3, 1)} cm / 3`, `x̄ = ${f(p.m, 1)} cm`]
      }
    },
    {
      id: 'max-deviation', level: 1,
      params: R => {
        const m = R.int(80, 260);
        const ds = R.pick(DEV4);
        const xs = ds.map(d => m + d);
        const dmax = Math.max(...ds.map(d => Math.abs(d)));
        return { m, x: xs, d: ds, dmax };
      },
      text: {
        en: (p, f) => `An apple was weighed four times on a kitchen scale: ${f(p.x[0])} g, ${f(p.x[1])} g, ${f(p.x[2])} g and ${f(p.x[3])} g. The mean value is ${f(p.m)} g. What is the maximum absolute deviation Δm?`,
        hr: (p, f) => `Jabuka je četiri puta izvagana na kuhinjskoj vagi: ${f(p.x[0])} g, ${f(p.x[1])} g, ${f(p.x[2])} g i ${f(p.x[3])} g. Srednja vrijednost je ${f(p.m)} g. Koliko iznosi maksimalno apsolutno odstupanje Δm?`
      },
      answer: p => p.dmax, unit: 'g', abs: 0.1,
      hint: { en: 'Find how far each reading is from the mean (ignore the sign) and take the biggest.', hr: 'Nađi koliko je svaka vrijednost udaljena od srednje vrijednosti (bez predznaka) i uzmi najveću.' },
      steps: {
        en: (p, f) => [`Deviations: |${f(p.x[0])} − ${f(p.m)}| = ${f(Math.abs(p.d[0]))} g, |${f(p.x[1])} − ${f(p.m)}| = ${f(Math.abs(p.d[1]))} g`, `|${f(p.x[2])} − ${f(p.m)}| = ${f(Math.abs(p.d[2]))} g, |${f(p.x[3])} − ${f(p.m)}| = ${f(Math.abs(p.d[3]))} g`, `The largest: Δm = ${f(p.dmax)} g`, `Result: m = (${f(p.m)} ± ${f(p.dmax)}) g`],
        hr: (p, f) => [`Odstupanja: |${f(p.x[0])} − ${f(p.m)}| = ${f(Math.abs(p.d[0]))} g, |${f(p.x[1])} − ${f(p.m)}| = ${f(Math.abs(p.d[1]))} g`, `|${f(p.x[2])} − ${f(p.m)}| = ${f(Math.abs(p.d[2]))} g, |${f(p.x[3])} − ${f(p.m)}| = ${f(Math.abs(p.d[3]))} g`, `Najveće: Δm = ${f(p.dmax)} g`, `Rezultat: m = (${f(p.m)} ± ${f(p.dmax)}) g`]
      }
    },
    {
      id: 'unit-packets', level: 1,
      params: R => ({ mat: R.pick(MATERIALS), V: R.int(4, 40) }),
      text: {
        en: (p, f) => `One cubic centimetre of ${p.mat.name.en} has a mass of ${f(p.mat.rho)} g. What is the mass of ${f(p.V)} cm³ of ${p.mat.name.en}?`,
        hr: (p, f) => `Jedan kubični centimetar ${p.mat.name.hrGen} ima masu ${f(p.mat.rho)} g. Kolika je masa ${f(p.V)} cm³ ${p.mat.name.hrGen}?`
      },
      answer: p => p.mat.rho * p.V, unit: 'g',
      hint: { en: 'Every cm³ is one "packet" of mass. Count the packets.', hr: 'Svaki cm³ je jedan "paketić" mase. Prebroji paketiće.' },
      steps: {
        en: (p, f) => [`Each cm³ carries ${f(p.mat.rho)} g.`, `${f(p.V)} cm³ means ${f(p.V)} such packets: m = ${f(p.V)} · ${f(p.mat.rho)} g`, `m = ${f(p.mat.rho * p.V)} g`],
        hr: (p, f) => [`Svaki cm³ nosi ${f(p.mat.rho)} g.`, `${f(p.V)} cm³ znači ${f(p.V)} takvih paketića: m = ${f(p.V)} · ${f(p.mat.rho)} g`, `m = ${f(p.mat.rho * p.V)} g`]
      }
    },
    {
      id: 'interval-half-width', level: 2,
      params: R => {
        const xbar = R.step(20, 40, 0.01);
        const dx = R.pick([0.05, 0.06, 0.07, 0.08, 0.1, 0.12, 0.15]);
        return { xbar, dx, lo: xbar - dx, hi: xbar + dx };
      },
      text: {
        en: (p, f) => `After measuring, Luka knows that the width of a book lies between ${f(p.lo, 2)} cm and ${f(p.hi, 2)} cm. He writes the result as x = (x̄ ± Δx) cm. What is Δx, the half-width of the interval?`,
        hr: (p, f) => `Nakon mjerenja Luka zna da je širina knjige između ${f(p.lo, 2)} cm i ${f(p.hi, 2)} cm. Rezultat zapisuje kao x = (x̄ ± Δx) cm. Koliko iznosi Δx, polovica širine intervala?`
      },
      answer: p => p.dx, unit: 'cm', abs: 0.005,
      hint: { en: 'Subtract the two ends of the interval and halve the result.', hr: 'Oduzmi dva kraja intervala i rezultat podijeli na pola.' },
      steps: {
        en: (p, f) => [`Width of the interval: ${f(p.hi, 2)} cm − ${f(p.lo, 2)} cm = ${f(2 * p.dx, 2)} cm`, `Half-width: Δx = ${f(2 * p.dx, 2)} cm / 2 = ${f(p.dx, 2)} cm`, `Mean (middle): x̄ = (${f(p.lo, 2)} + ${f(p.hi, 2)}) cm / 2 = ${f(p.xbar, 2)} cm`, `Result: x = (${f(p.xbar, 2)} ± ${f(p.dx, 2)}) cm`],
        hr: (p, f) => [`Širina intervala: ${f(p.hi, 2)} cm − ${f(p.lo, 2)} cm = ${f(2 * p.dx, 2)} cm`, `Polovica širine: Δx = ${f(2 * p.dx, 2)} cm / 2 = ${f(p.dx, 2)} cm`, `Srednja vrijednost (sredina): x̄ = (${f(p.lo, 2)} + ${f(p.hi, 2)}) cm / 2 = ${f(p.xbar, 2)} cm`, `Rezultat: x = (${f(p.xbar, 2)} ± ${f(p.dx, 2)}) cm`]
      }
    },
    {
      id: 'interval-upper-bound', level: 2,
      params: R => ({ T: R.step(1.2, 2.8, 0.01), dT: R.pick([0.02, 0.03, 0.04, 0.05]) }),
      text: {
        en: (p, f) => `The period of a pendulum was measured as T = (${f(p.T, 2)} ± ${f(p.dT, 2)}) s. According to this result, what is the largest value the period could have?`,
        hr: (p, f) => `Period njihala izmjeren je kao T = (${f(p.T, 2)} ± ${f(p.dT, 2)}) s. Kolika je prema tom rezultatu najveća vrijednost koju period može imati?`
      },
      answer: p => p.T + p.dT, unit: 's', abs: 0.005,
      hint: { en: 'x̄ ± Δx means an interval from x̄ − Δx to x̄ + Δx.', hr: 'x̄ ± Δx znači interval od x̄ − Δx do x̄ + Δx.' },
      steps: {
        en: (p, f) => [`The interval runs from ${f(p.T, 2)} s − ${f(p.dT, 2)} s to ${f(p.T, 2)} s + ${f(p.dT, 2)} s`, `Lower bound: ${f(p.T - p.dT, 2)} s`, `Upper bound: ${f(p.T + p.dT, 2)} s`],
        hr: (p, f) => [`Interval ide od ${f(p.T, 2)} s − ${f(p.dT, 2)} s do ${f(p.T, 2)} s + ${f(p.dT, 2)} s`, `Donja granica: ${f(p.T - p.dT, 2)} s`, `Gornja granica: ${f(p.T + p.dT, 2)} s`]
      }
    },
    {
      id: 'relative-error', level: 2,
      params: R => ({ x: R.step(60, 200, 10), dx: R.pick([0.5, 1, 2, 3, 4, 5]) }),
      text: {
        en: (p, f) => `The length of a table was measured as l = (${f(p.x)} ± ${f(p.dx)}) cm. What is the relative error of the measurement, in percent?`,
        hr: (p, f) => `Duljina stola izmjerena je kao l = (${f(p.x)} ± ${f(p.dx)}) cm. Kolika je relativna pogreška mjerenja, u postocima?`
      },
      answer: p => p.dx / p.x * 100, unit: '%', abs: 0.5,
      hint: { en: 'Divide the uncertainty by the mean value and multiply by 100 %.', hr: 'Podijeli nesigurnost srednjom vrijednošću i pomnoži sa 100 %.' },
      steps: {
        en: (p, f) => ['r = Δx / x̄ · 100 %', `r = ${f(p.dx)} cm / ${f(p.x)} cm · 100 %`, `r = ${f(p.dx / p.x * 100)} %`],
        hr: (p, f) => ['r = Δx / x̄ · 100 %', `r = ${f(p.dx)} cm / ${f(p.x)} cm · 100 %`, `r = ${f(p.dx / p.x * 100)} %`]
      }
    },
    {
      id: 'missing-reading', level: 3,
      params: R => {
        const n = R.pick([4, 5]);
        const m = R.step(16, 24, 0.1);
        const ds = R.pick(n === 4 ? DEV4 : DEV5).map(d => d / 10);
        const xs = ds.map(d => m + d);
        return { n, m, given: xs.slice(0, n - 1), last: xs[n - 1] };
      },
      text: {
        en: (p, f) => `Ivan wants the mean of ${f(p.n)} readings of the time for 10 swings of a pendulum. The first ${f(p.n - 1)} readings are ${p.given.slice(0, -1).map(v => f(v, 1) + ' s').join(', ')} and ${f(p.given[p.given.length - 1], 1)} s. The mean of all ${f(p.n)} readings is ${f(p.m, 1)} s. What was the last reading?`,
        hr: (p, f) => `Ivan želi srednju vrijednost ${f(p.n)} mjerenja vremena za 10 titraja njihala. Prva ${f(p.n - 1)} mjerenja su ${p.given.slice(0, -1).map(v => f(v, 1) + ' s').join(', ')} i ${f(p.given[p.given.length - 1], 1)} s. Srednja vrijednost svih ${f(p.n)} mjerenja je ${f(p.m, 1)} s. Koliko je iznosilo posljednje mjerenje?`
      },
      answer: p => p.last, unit: 's', abs: 0.05,
      hint: { en: 'Mean × number of readings = the sum of all readings. Subtract the readings you know.', hr: 'Srednja vrijednost × broj mjerenja = zbroj svih mjerenja. Oduzmi mjerenja koja znaš.' },
      steps: {
        en: (p, f) => { const sum = p.given.reduce((a, b) => a + b, 0); return [`Sum of all ${f(p.n)} readings: ${f(p.n)} · ${f(p.m, 1)} s = ${f(p.n * p.m, 1)} s`, `Sum of the first ${f(p.n - 1)}: ${f(sum, 1)} s`, `Last reading: ${f(p.n * p.m, 1)} s − ${f(sum, 1)} s = ${f(p.last, 1)} s`]; },
        hr: (p, f) => { const sum = p.given.reduce((a, b) => a + b, 0); return [`Zbroj svih ${f(p.n)} mjerenja: ${f(p.n)} · ${f(p.m, 1)} s = ${f(p.n * p.m, 1)} s`, `Zbroj prvih ${f(p.n - 1)}: ${f(sum, 1)} s`, `Posljednje mjerenje: ${f(p.n * p.m, 1)} s − ${f(sum, 1)} s = ${f(p.last, 1)} s`]; }
      }
    },
    {
      id: 'error-of-sum', level: 3,
      params: R => ({ a: R.step(80, 200, 5), da: R.pick([0.2, 0.3, 0.5, 1]), b: R.step(30, 120, 5), db: R.pick([0.1, 0.2, 0.4, 0.5]) }),
      text: {
        en: (p, f) => `Two boards are laid end to end. Their lengths were measured as (${f(p.a, 1)} ± ${f(p.da, 1)}) cm and (${f(p.b, 1)} ± ${f(p.db, 1)}) cm. What is the absolute uncertainty Δl of the total length? (Absolute uncertainties of a sum add up.)`,
        hr: (p, f) => `Dvije daske položene su u nizu, jedna uz drugu. Njihove duljine izmjerene su kao (${f(p.a, 1)} ± ${f(p.da, 1)}) cm i (${f(p.b, 1)} ± ${f(p.db, 1)}) cm. Kolika je apsolutna nesigurnost Δl ukupne duljine? (Apsolutne nesigurnosti zbroja se zbrajaju.)`
      },
      answer: p => p.da + p.db, unit: 'cm', abs: 0.01,
      hint: { en: 'Each board may be a bit longer or shorter; in the worst case both errors point the same way, so add them.', hr: 'Svaka daska može biti malo dulja ili kraća; u najgorem slučaju obje pogreške idu na istu stranu, pa ih zbroji.' },
      steps: {
        en: (p, f) => [`Total length: ${f(p.a, 1)} cm + ${f(p.b, 1)} cm = ${f(p.a + p.b, 1)} cm`, `Uncertainties add: Δl = ${f(p.da, 1)} cm + ${f(p.db, 1)} cm`, `Δl = ${f(p.da + p.db, 1)} cm`, `Result: l = (${f(p.a + p.b, 1)} ± ${f(p.da + p.db, 1)}) cm`],
        hr: (p, f) => [`Ukupna duljina: ${f(p.a, 1)} cm + ${f(p.b, 1)} cm = ${f(p.a + p.b, 1)} cm`, `Nesigurnosti se zbrajaju: Δl = ${f(p.da, 1)} cm + ${f(p.db, 1)} cm`, `Δl = ${f(p.da + p.db, 1)} cm`, `Rezultat: l = (${f(p.a + p.b, 1)} ± ${f(p.da + p.db, 1)}) cm`]
      }
    },
    {
      id: 'relative-error-of-product', level: 3,
      params: R => {
        const a = R.pick([50, 100, 200, 250]); const ra = R.pick([1, 2, 4]);
        const b = R.pick([40, 50, 80, 120]); const rb = R.pick([1, 2, 5]);
        return { a, ra, da: a * ra / 100, b, rb, db: b * rb / 100 };
      },
      text: {
        en: (p, f) => `A rectangular table top was measured: length (${f(p.a)} ± ${f(p.da)}) cm, width (${f(p.b)} ± ${f(p.db)}) cm. What is the relative error of the computed area, in percent? (Relative errors of a product add up.)`,
        hr: (p, f) => `Izmjerena je pravokutna ploča stola: duljina (${f(p.a)} ± ${f(p.da)}) cm, širina (${f(p.b)} ± ${f(p.db)}) cm. Kolika je relativna pogreška izračunane površine, u postocima? (Relativne pogreške umnoška se zbrajaju.)`
      },
      answer: p => p.ra + p.rb, unit: '%', abs: 0.1,
      hint: { en: 'First find the relative error of each side in %, then add the two percentages.', hr: 'Najprije izračunaj relativnu pogrešku svake stranice u %, a zatim zbroji ta dva postotka.' },
      steps: {
        en: (p, f) => [`Length: r₁ = ${f(p.da)} / ${f(p.a)} · 100 % = ${f(p.ra)} %`, `Width: r₂ = ${f(p.db)} / ${f(p.b)} · 100 % = ${f(p.rb)} %`, `Area: r = r₁ + r₂ = ${f(p.ra)} % + ${f(p.rb)} % = ${f(p.ra + p.rb)} %`, `A = ${f(p.a * p.b)} cm², uncertain by about ${f(p.a * p.b * (p.ra + p.rb) / 100)} cm²`],
        hr: (p, f) => [`Duljina: r₁ = ${f(p.da)} / ${f(p.a)} · 100 % = ${f(p.ra)} %`, `Širina: r₂ = ${f(p.db)} / ${f(p.b)} · 100 % = ${f(p.rb)} %`, `Površina: r = r₁ + r₂ = ${f(p.ra)} % + ${f(p.rb)} % = ${f(p.ra + p.rb)} %`, `A = ${f(p.a * p.b)} cm², nesigurnost oko ${f(p.a * p.b * (p.ra + p.rb) / 100)} cm²`]
      }
    }
  ]);
})();
