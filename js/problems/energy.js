/* FizLab practice problems: Work, Energy and Power / Rad, energija i snaga */
(function () {
  'use strict';
  window.Content.registerProblems('energy', [
    {
      id: 'work-basic', level: 1,
      params: R => ({ F: R.step(20, 150, 10), s: R.int(5, 60) }),
      text: {
        en: (p, f) => `A boy pulls a sled with a force of ${f(p.F)} N over a distance of ${f(p.s)} m. How much work does he do?`,
        hr: (p, f) => `Dječak vuče sanjke silom ${f(p.F)} N na putu od ${f(p.s)} m. Koliki rad obavi?`
      },
      answer: p => p.F * p.s, unit: 'J',
      hint: { en: 'Work = force × distance.', hr: 'Rad = sila × put.' },
      steps: {
        en: (p, f) => ['W = F · s', `W = ${f(p.F)} N · ${f(p.s)} m`, `W = ${f(p.F * p.s)} J`],
        hr: (p, f) => ['W = F · s', `W = ${f(p.F)} N · ${f(p.s)} m`, `W = ${f(p.F * p.s)} J`]
      }
    },
    {
      id: 'potential-energy', level: 1,
      params: R => ({ m: R.int(2, 20), h: R.step(0.5, 3, 0.5) }),
      text: {
        en: (p, f) => `A bag of mass ${f(p.m)} kg is lifted onto a shelf ${f(p.h)} m above the floor. What is its gravitational potential energy relative to the floor? Use g = 10 N/kg.`,
        hr: (p, f) => `Vreća mase ${f(p.m)} kg podignuta je na policu ${f(p.h)} m iznad poda. Kolika je njezina gravitacijska potencijalna energija u odnosu na pod? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10 * p.h, unit: 'J',
      hint: { en: 'Potential energy = mass × g × height.', hr: 'Potencijalna energija = masa × g × visina.' },
      steps: {
        en: (p, f) => ['E_p = m · g · h', `E_p = ${f(p.m)} kg · 10 N/kg · ${f(p.h)} m`, `E_p = ${f(p.m * 10 * p.h)} J`],
        hr: (p, f) => ['E_p = m · g · h', `E_p = ${f(p.m)} kg · 10 N/kg · ${f(p.h)} m`, `E_p = ${f(p.m * 10 * p.h)} J`]
      }
    },
    {
      id: 'kinetic-energy', level: 1,
      params: R => ({ m: R.step(50, 100, 10), v: R.pick([2, 3, 4, 5, 6, 8, 10]) }),
      text: {
        en: (p, f) => `A cyclist together with the bike has a mass of ${f(p.m)} kg and rides at ${f(p.v)} m/s. What is the kinetic energy? (E_k = ½ · m · v²)`,
        hr: (p, f) => `Biciklist zajedno s biciklom ima masu ${f(p.m)} kg i vozi brzinom ${f(p.v)} m/s. Kolika je njegova kinetička energija? (E_k = ½ · m · v²)`
      },
      answer: p => 0.5 * p.m * p.v * p.v, unit: 'J',
      hint: { en: 'Square the speed first, then multiply by the mass and halve.', hr: 'Najprije kvadriraj brzinu, zatim pomnoži masom i podijeli s 2.' },
      steps: {
        en: (p, f) => ['E_k = ½ · m · v²', `E_k = ½ · ${f(p.m)} kg · (${f(p.v)} m/s)²`, `E_k = ½ · ${f(p.m)} kg · ${f(p.v * p.v)} m²/s²`, `E_k = ${f(0.5 * p.m * p.v * p.v)} J`],
        hr: (p, f) => ['E_k = ½ · m · v²', `E_k = ½ · ${f(p.m)} kg · (${f(p.v)} m/s)²`, `E_k = ½ · ${f(p.m)} kg · ${f(p.v * p.v)} m²/s²`, `E_k = ${f(0.5 * p.m * p.v * p.v)} J`]
      }
    },
    {
      id: 'power-basic', level: 2,
      params: R => { const P = R.step(200, 3000, 100); const t = R.pick([5, 10, 20, 30, 60]); return { W: P * t / 1000, t }; },
      text: {
        en: (p, f) => `A crane does ${f(p.W)} kJ of work in ${f(p.t)} s. What is the power of the crane? Give the answer in watts.`,
        hr: (p, f) => `Dizalica obavi rad od ${f(p.W)} kJ za ${f(p.t)} s. Kolika je snaga dizalice? Odgovor izrazi u vatima.`
      },
      answer: p => p.W * 1000 / p.t, unit: 'W',
      hint: { en: 'Convert kJ to J (× 1000), then P = W / t.', hr: 'Pretvori kJ u J (× 1000), zatim P = W / t.' },
      steps: {
        en: (p, f) => [`W = ${f(p.W)} kJ = ${f(p.W * 1000)} J`, 'P = W / t', `P = ${f(p.W * 1000)} J / ${f(p.t)} s = ${f(p.W * 1000 / p.t)} W`],
        hr: (p, f) => [`W = ${f(p.W)} kJ = ${f(p.W * 1000)} J`, 'P = W / t', `P = ${f(p.W * 1000)} J / ${f(p.t)} s = ${f(p.W * 1000 / p.t)} W`]
      }
    },
    {
      id: 'height-from-potential', level: 2,
      params: R => { const m = R.pick([2, 4, 5, 8, 10, 20, 25, 50]); const h = R.int(2, 40); return { m, E: m * 10 * h }; },
      text: {
        en: (p, f) => `A load of mass ${f(p.m)} kg hangs from a crane and has a gravitational potential energy of ${f(p.E)} J relative to the ground. How high above the ground is it? Use g = 10 N/kg.`,
        hr: (p, f) => `Teret mase ${f(p.m)} kg visi na dizalici i ima gravitacijsku potencijalnu energiju ${f(p.E)} J u odnosu na tlo. Na kojoj je visini iznad tla? Uzmi g = 10 N/kg.`
      },
      answer: p => p.E / (p.m * 10), unit: 'm',
      hint: { en: 'Rearrange E_p = m · g · h into h = E_p / (m · g).', hr: 'Iz E_p = m · g · h slijedi h = E_p / (m · g).' },
      steps: {
        en: (p, f) => ['E_p = m · g · h  →  h = E_p / (m · g)', `h = ${f(p.E)} J / (${f(p.m)} kg · 10 N/kg)`, `h = ${f(p.E)} J / ${f(p.m * 10)} N = ${f(p.E / (p.m * 10))} m`],
        hr: (p, f) => ['E_p = m · g · h  →  h = E_p / (m · g)', `h = ${f(p.E)} J / (${f(p.m)} kg · 10 N/kg)`, `h = ${f(p.E)} J / ${f(p.m * 10)} N = ${f(p.E / (p.m * 10))} m`]
      }
    },
    {
      id: 'speed-from-kinetic', level: 2,
      params: R => { const m = R.pick([2, 4, 5, 8, 10, 20]); const v = R.pick([2, 3, 4, 5, 6, 8, 10]); return { m, E: 0.5 * m * v * v }; },
      text: {
        en: (p, f) => `A cart of mass ${f(p.m)} kg has a kinetic energy of ${f(p.E)} J. How fast is it moving? (E_k = ½ · m · v²)`,
        hr: (p, f) => `Kolica mase ${f(p.m)} kg imaju kinetičku energiju ${f(p.E)} J. Kolikom se brzinom gibaju? (E_k = ½ · m · v²)`
      },
      answer: p => Math.sqrt(2 * p.E / p.m), unit: 'm/s',
      hint: { en: 'v² = 2 · E_k / m, then take the square root.', hr: 'v² = 2 · E_k / m, zatim izračunaj drugi korijen.' },
      steps: {
        en: (p, f) => ['E_k = ½ · m · v²  →  v² = 2 · E_k / m', `v² = 2 · ${f(p.E)} J / ${f(p.m)} kg = ${f(2 * p.E / p.m)} m²/s²`, `v = √${f(2 * p.E / p.m)} = ${f(Math.sqrt(2 * p.E / p.m))} m/s`],
        hr: (p, f) => ['E_k = ½ · m · v²  →  v² = 2 · E_k / m', `v² = 2 · ${f(p.E)} J / ${f(p.m)} kg = ${f(2 * p.E / p.m)} m²/s²`, `v = √${f(2 * p.E / p.m)} = ${f(Math.sqrt(2 * p.E / p.m))} m/s`]
      }
    },
    {
      id: 'slide-speed', level: 3,
      params: R => { const v = R.pick([4, 6, 8, 10, 12, 20, 30]); return { h: v * v / 20 }; },
      text: {
        en: (p, f) => `A roller coaster car starts from rest at the top of a hill ${f(p.h)} m high and rolls down without friction. What is its speed at the bottom? Use g = 10 N/kg. (All the potential energy turns into kinetic energy: m · g · h = ½ · m · v²)`,
        hr: (p, f) => `Vagon vlaka u zabavnom parku kreće iz mirovanja s vrha uspona visokog ${f(p.h)} m i spušta se bez trenja. Kolikom brzinom stigne do dna? Uzmi g = 10 N/kg. (Sva potencijalna energija prelazi u kinetičku: m · g · h = ½ · m · v²)`
      },
      answer: p => Math.sqrt(2 * 10 * p.h), unit: 'm/s',
      hint: { en: 'The mass cancels: v² = 2 · g · h.', hr: 'Masa se pokrati: v² = 2 · g · h.' },
      steps: {
        en: (p, f) => ['m · g · h = ½ · m · v²  →  the mass cancels: v² = 2 · g · h', `v² = 2 · 10 N/kg · ${f(p.h)} m = ${f(20 * p.h)} m²/s²`, `v = √${f(20 * p.h)} = ${f(Math.sqrt(20 * p.h))} m/s`],
        hr: (p, f) => ['m · g · h = ½ · m · v²  →  masa se pokrati: v² = 2 · g · h', `v² = 2 · 10 N/kg · ${f(p.h)} m = ${f(20 * p.h)} m²/s²`, `v = √${f(20 * p.h)} = ${f(Math.sqrt(20 * p.h))} m/s`]
      }
    },
    {
      id: 'appliance-cost', level: 3,
      params: R => { const Pk = R.pick([1, 1.5, 2, 2.5, 3]); return { P: Pk * 1000, Pk, t: R.pick([2, 4, 6, 8, 10]), c: R.pick([0.1, 0.15, 0.2, 0.25]) }; },
      text: {
        en: (p, f) => `An electric heater of power ${f(p.P)} W runs for ${f(p.t)} h. Electricity costs ${f(p.c)} € per kWh. How much does the heating cost? (E = P · t)`,
        hr: (p, f) => `Električna grijalica snage ${f(p.P)} W radi ${f(p.t)} h. Cijena električne energije je ${f(p.c)} € po kWh. Koliko košta to grijanje? (E = P · t)`
      },
      answer: p => p.Pk * p.t * p.c, unit: '€',
      hint: { en: 'Convert W to kW, multiply by the hours to get kWh, then multiply by the price.', hr: 'Pretvori W u kW, pomnoži satima da dobiješ kWh, zatim pomnoži cijenom.' },
      steps: {
        en: (p, f) => [`P = ${f(p.P)} W = ${f(p.Pk)} kW`, `E = P · t = ${f(p.Pk)} kW · ${f(p.t)} h = ${f(p.Pk * p.t)} kWh`, `Cost = ${f(p.Pk * p.t)} kWh · ${f(p.c)} €/kWh = ${f(p.Pk * p.t * p.c)} €`],
        hr: (p, f) => [`P = ${f(p.P)} W = ${f(p.Pk)} kW`, `E = P · t = ${f(p.Pk)} kW · ${f(p.t)} h = ${f(p.Pk * p.t)} kWh`, `Cijena = ${f(p.Pk * p.t)} kWh · ${f(p.c)} €/kWh = ${f(p.Pk * p.t * p.c)} €`]
      }
    },
    {
      id: 'efficiency-lift', level: 3,
      params: R => {
        const E = R.pick([2000, 4000, 6000, 8000, 10000, 12000]); const eta = R.pick([50, 60, 75, 80]);
        const W = E * eta / 100;
        const cands = [2, 3, 4, 5, 6, 8, 10].filter(h => Number.isInteger(W / 10 / h) && W / 10 / h >= 10 && W / 10 / h <= 600);
        const h = R.pick(cands);
        return { E, m: W / 10 / h, h };
      },
      text: {
        en: (p, f) => `An electric motor uses ${f(p.E)} J of electrical energy to lift a load of mass ${f(p.m)} kg to a height of ${f(p.h)} m. What is the efficiency of the motor in percent? Use g = 10 N/kg.`,
        hr: (p, f) => `Električni motor potroši ${f(p.E)} J električne energije da podigne teret mase ${f(p.m)} kg na visinu ${f(p.h)} m. Kolika je korisnost motora u postocima? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10 * p.h / p.E * 100, unit: '%',
      hint: { en: 'Useful work = m · g · h; efficiency = useful work / energy used × 100 %.', hr: 'Korisni rad = m · g · h; korisnost = korisni rad / uložena energija × 100 %.' },
      steps: {
        en: (p, f) => [`Useful work: W = m · g · h = ${f(p.m)} kg · 10 N/kg · ${f(p.h)} m = ${f(p.m * 10 * p.h)} J`, `η = W / E · 100 % = ${f(p.m * 10 * p.h)} J / ${f(p.E)} J · 100 %`, `η = ${f(p.m * 10 * p.h / p.E * 100)} %`],
        hr: (p, f) => [`Korisni rad: W = m · g · h = ${f(p.m)} kg · 10 N/kg · ${f(p.h)} m = ${f(p.m * 10 * p.h)} J`, `η = W / E · 100 % = ${f(p.m * 10 * p.h)} J / ${f(p.E)} J · 100 %`, `η = ${f(p.m * 10 * p.h / p.E * 100)} %`]
      }
    }
  ]);
})();
