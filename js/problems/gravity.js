/* FizLab practice problems: Gravity / Gravitacija i sila teža */
(function () {
  'use strict';
  /* hr is the locative ("na Mjesecu") */
  const WORLDS = [
    { en: 'the Moon', hr: 'Mjesecu', g: 1.6 },
    { en: 'Mars', hr: 'Marsu', g: 3.7 },
    { en: 'Jupiter', hr: 'Jupiteru', g: 25 }
  ];
  const HEIGHTS = [5, 20, 45, 80, 125];           /* t = √(2h / 10) = 1, 2, 3, 4, 5 s */
  const STRINGS = [0.4, 0.9, 1.6, 2.5, 3.6];      /* √(L / 10) = 0.2, 0.3, 0.4, 0.5, 0.6 */

  window.Content.registerProblems('gravity', [
    {
      id: 'weight-earth', level: 1,
      params: R => ({ m: R.int(25, 90) }),
      text: {
        en: (p, f) => `A pupil has a mass of ${f(p.m)} kg. What is the pupil's weight on Earth? Use g = 10 N/kg.`,
        hr: (p, f) => `Učenik ima masu ${f(p.m)} kg. Kolika je njegova težina na Zemlji? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10, unit: 'N',
      hint: { en: 'Weight = mass × g; every kilogram is pulled with 10 N.', hr: 'Težina = masa × g; svaki kilogram Zemlja privlači silom 10 N.' },
      steps: {
        en: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`],
        hr: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`]
      }
    },
    {
      id: 'weight-other-world', level: 1,
      params: R => ({ w: R.pick(WORLDS), m: R.step(5, 100, 5) }),
      text: {
        en: (p, f) => `On ${p.w.en} g = ${f(p.w.g)} N/kg. What is the weight of a robot of mass ${f(p.m)} kg on ${p.w.en}?`,
        hr: (p, f) => `Na ${p.w.hr} je g = ${f(p.w.g)} N/kg. Kolika je težina robota mase ${f(p.m)} kg na ${p.w.hr}?`
      },
      answer: p => p.m * p.w.g, unit: 'N',
      hint: { en: 'Same formula G = m · g, just with that world\'s g.', hr: 'Ista formula G = m · g, samo s g tog svijeta.' },
      steps: {
        en: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · ${f(p.w.g)} N/kg`, `G = ${f(p.m * p.w.g)} N`],
        hr: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · ${f(p.w.g)} N/kg`, `G = ${f(p.m * p.w.g)} N`]
      }
    },
    {
      id: 'free-fall-speed', level: 1,
      params: R => ({ t: R.step(0.5, 6, 0.5) }),
      text: {
        en: (p, f) => `A ball is dropped and falls freely (ignore air resistance). What is its speed after ${f(p.t)} s? Use g = 10 m/s² and v = g · t.`,
        hr: (p, f) => `Loptu pustimo da slobodno pada (zanemari otpor zraka). Kolika je njezina brzina nakon ${f(p.t)} s? Uzmi g = 10 m/s² i v = g · t.`
      },
      answer: p => 10 * p.t, unit: 'm/s',
      hint: { en: 'In free fall the speed grows by 10 m/s every second.', hr: 'U slobodnom padu brzina svake sekunde poraste za 10 m/s.' },
      steps: {
        en: (p, f) => ['v = g · t', `v = 10 m/s² · ${f(p.t)} s`, `v = ${f(10 * p.t)} m/s`],
        hr: (p, f) => ['v = g · t', `v = 10 m/s² · ${f(p.t)} s`, `v = ${f(10 * p.t)} m/s`]
      }
    },
    {
      id: 'mass-from-weight', level: 2,
      params: R => ({ G: R.step(50, 600, 10) }),
      text: {
        en: (p, f) => `A sack of potatoes has a weight of ${f(p.G)} N on Earth. What is its mass? Use g = 10 N/kg.`,
        hr: (p, f) => `Vreća krumpira ima težinu ${f(p.G)} N na Zemlji. Kolika je njezina masa? Uzmi g = 10 N/kg.`
      },
      answer: p => p.G / 10, unit: 'kg',
      hint: { en: 'Rearrange G = m · g into m = G / g.', hr: 'Iz G = m · g slijedi m = G / g.' },
      steps: {
        en: (p, f) => ['G = m · g  →  m = G / g', `m = ${f(p.G)} N / 10 N/kg`, `m = ${f(p.G / 10)} kg`],
        hr: (p, f) => ['G = m · g  →  m = G / g', `m = ${f(p.G)} N / 10 N/kg`, `m = ${f(p.G / 10)} kg`]
      }
    },
    {
      id: 'compare-weights', level: 2,
      params: R => { const m1 = R.int(40, 80); return { m1, m2: R.int(15, m1 - 10) }; },
      text: {
        en: (p, f) => `Marko has a mass of ${f(p.m1)} kg and his younger sister has a mass of ${f(p.m2)} kg. By how many newtons is Marko's weight greater than his sister's? Use g = 10 N/kg.`,
        hr: (p, f) => `Marko ima masu ${f(p.m1)} kg, a njegova mlađa sestra ${f(p.m2)} kg. Za koliko je njutna Markova težina veća od sestrine? Uzmi g = 10 N/kg.`
      },
      answer: p => (p.m1 - p.m2) * 10, unit: 'N',
      hint: { en: 'Find both weights with G = m · g and subtract them.', hr: 'Izračunaj obje težine pomoću G = m · g i oduzmi ih.' },
      steps: {
        en: (p, f) => [`Marko: G₁ = ${f(p.m1)} kg · 10 N/kg = ${f(p.m1 * 10)} N`, `Sister: G₂ = ${f(p.m2)} kg · 10 N/kg = ${f(p.m2 * 10)} N`, `Difference: ${f(p.m1 * 10)} N − ${f(p.m2 * 10)} N = ${f((p.m1 - p.m2) * 10)} N`],
        hr: (p, f) => [`Marko: G₁ = ${f(p.m1)} kg · 10 N/kg = ${f(p.m1 * 10)} N`, `Sestra: G₂ = ${f(p.m2)} kg · 10 N/kg = ${f(p.m2 * 10)} N`, `Razlika: ${f(p.m1 * 10)} N − ${f(p.m2 * 10)} N = ${f((p.m1 - p.m2) * 10)} N`]
      }
    },
    {
      id: 'fall-time', level: 2,
      params: R => ({ h: R.pick(HEIGHTS) }),
      text: {
        en: (p, f) => `A stone is dropped from a bridge ${f(p.h)} m above the water. How long does it fall? Use g = 10 m/s² and t = √(2h / g).`,
        hr: (p, f) => `Kamen pustimo s mosta koji je ${f(p.h)} m iznad vode. Koliko dugo kamen pada? Uzmi g = 10 m/s² i t = √(2h / g).`
      },
      answer: p => Math.sqrt(2 * p.h / 10), unit: 's',
      hint: { en: 'Compute 2h / g first, then take the square root.', hr: 'Najprije izračunaj 2h / g, zatim izvadi drugi korijen.' },
      steps: {
        en: (p, f) => [`2h / g = 2 · ${f(p.h)} m / 10 m/s² = ${f(2 * p.h / 10)} s²`, `t = √${f(2 * p.h / 10)} s² = ${f(Math.sqrt(2 * p.h / 10))} s`],
        hr: (p, f) => [`2h / g = 2 · ${f(p.h)} m / 10 m/s² = ${f(2 * p.h / 10)} s²`, `t = √${f(2 * p.h / 10)} s² = ${f(Math.sqrt(2 * p.h / 10))} s`]
      }
    },
    {
      id: 'pendulum-period', level: 3,
      params: R => ({ L: R.pick(STRINGS) }),
      text: {
        en: (p, f) => `A pendulum hangs on a string of length ${f(p.L)} m. What is its period? Use T = 2π · √(L / g), g = 10 m/s² and π ≈ ${f(3.14)}.`,
        hr: (p, f) => `Njihalo visi na niti duljine ${f(p.L)} m. Koliki je njegov period? Uzmi T = 2π · √(L / g), g = 10 m/s² i π ≈ ${f(3.14)}.`
      },
      answer: p => 2 * 3.14 * Math.sqrt(p.L / 10), unit: 's',
      hint: { en: 'Divide L by g, take the square root, then multiply by 2π.', hr: 'Podijeli L s g, izvadi drugi korijen, zatim pomnoži s 2π.' },
      steps: {
        en: (p, f) => [`L / g = ${f(p.L)} m / 10 m/s² = ${f(p.L / 10)} s²`, `√${f(p.L / 10)} s² = ${f(Math.sqrt(p.L / 10))} s`, `T = 2 · ${f(3.14)} · ${f(Math.sqrt(p.L / 10))} s = ${f(2 * 3.14 * Math.sqrt(p.L / 10))} s`],
        hr: (p, f) => [`L / g = ${f(p.L)} m / 10 m/s² = ${f(p.L / 10)} s²`, `√${f(p.L / 10)} s² = ${f(Math.sqrt(p.L / 10))} s`, `T = 2 · ${f(3.14)} · ${f(Math.sqrt(p.L / 10))} s = ${f(2 * 3.14 * Math.sqrt(p.L / 10))} s`]
      }
    },
    {
      id: 'weight-two-step', level: 3,
      params: R => ({ w: R.pick(WORLDS), G: R.step(200, 2000, 50) }),
      text: {
        en: (p, f) => `A space probe has a weight of ${f(p.G)} N on Earth (g = 10 N/kg). On ${p.w.en} g = ${f(p.w.g)} N/kg. What is the weight of the probe on ${p.w.en}?`,
        hr: (p, f) => `Svemirska sonda ima težinu ${f(p.G)} N na Zemlji (g = 10 N/kg). Na ${p.w.hr} je g = ${f(p.w.g)} N/kg. Kolika je težina sonde na ${p.w.hr}?`
      },
      answer: p => p.G / 10 * p.w.g, unit: 'N',
      hint: { en: 'First the mass from the weight on Earth (it does not change), then multiply by the other g.', hr: 'Najprije masa iz težine na Zemlji (ona se ne mijenja), zatim pomnoži drugim g.' },
      steps: {
        en: (p, f) => [`Mass: m = G / g = ${f(p.G)} N / 10 N/kg = ${f(p.G / 10)} kg`, `Weight there: G = m · g = ${f(p.G / 10)} kg · ${f(p.w.g)} N/kg`, `G = ${f(p.G / 10 * p.w.g)} N`],
        hr: (p, f) => [`Masa: m = G / g = ${f(p.G)} N / 10 N/kg = ${f(p.G / 10)} kg`, `Težina ondje: G = m · g = ${f(p.G / 10)} kg · ${f(p.w.g)} N/kg`, `G = ${f(p.G / 10 * p.w.g)} N`]
      }
    },
    {
      id: 'free-fall-distance', level: 3,
      params: R => ({ t: R.step(1, 6, 0.5) }),
      text: {
        en: (p, f) => `A coin falls freely from a tower for ${f(p.t)} s (ignore air resistance). What distance does it fall? Use g = 10 m/s² and s = g · t² / 2.`,
        hr: (p, f) => `Kovanica slobodno pada s tornja ${f(p.t)} s (zanemari otpor zraka). Koliki put prijeđe? Uzmi g = 10 m/s² i s = g · t² / 2.`
      },
      answer: p => 10 * p.t * p.t / 2, unit: 'm',
      hint: { en: 'Square the time first, multiply by g, then halve.', hr: 'Najprije kvadriraj vrijeme, pomnoži s g, pa podijeli s 2.' },
      steps: {
        en: (p, f) => [`t² = ${f(p.t)} s · ${f(p.t)} s = ${f(p.t * p.t)} s²`, `s = g · t² / 2 = 10 m/s² · ${f(p.t * p.t)} s² / 2`, `s = ${f(10 * p.t * p.t / 2)} m`],
        hr: (p, f) => [`t² = ${f(p.t)} s · ${f(p.t)} s = ${f(p.t * p.t)} s²`, `s = g · t² / 2 = 10 m/s² · ${f(p.t * p.t)} s² / 2`, `s = ${f(10 * p.t * p.t / 2)} m`]
      }
    }
  ]);
})();
