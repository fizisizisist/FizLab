/* FizLab practice problems: Pressure / Tlak */
(function () {
  'use strict';
  const TO_KPA = [
    { from: 'Pa', div: 1000, rel: '1 kPa = 1000 Pa', item: { en: 'The pressure under a brick is', hr: 'Tlak pod opekom iznosi' }, min: 1500, max: 9500, stp: 500 },
    { from: 'Pa', div: 1000, rel: '1 kPa = 1000 Pa', item: { en: 'The pressure at the bottom of a pool is', hr: 'Tlak na dnu bazena iznosi' }, min: 20000, max: 45000, stp: 1000 },
    { from: 'bar', mul: 100, rel: '1 bar = 100 kPa', item: { en: 'A car tyre is pumped to', hr: 'Guma automobila napumpana je na' }, min: 1.5, max: 4, stp: 0.1 }
  ];

  window.Content.registerProblems('pressure', [
    {
      id: 'pressure-basic', level: 1,
      params: R => { const p = R.step(200, 3000, 100); const A = R.pick([0.2, 0.25, 0.5, 1, 2]); return { F: p * A, A }; },
      text: {
        en: (p, f) => `A crate stands on the floor. Its weight is ${f(p.F)} N and its base has an area of ${f(p.A)} m². What pressure does the crate exert on the floor? (p = F / A)`,
        hr: (p, f) => `Sanduk stoji na podu. Njegova težina je ${f(p.F)} N, a površina dna ${f(p.A)} m². Koliki tlak sanduk vrši na pod? (p = F / A)`
      },
      answer: p => p.F / p.A, unit: 'Pa',
      hint: { en: 'Pressure = force divided by area; 1 N/m² = 1 Pa.', hr: 'Tlak = sila podijeljena površinom; 1 N/m² = 1 Pa.' },
      steps: {
        en: (p, f) => ['p = F / A', `p = ${f(p.F)} N / ${f(p.A)} m²`, `p = ${f(p.F / p.A)} Pa`],
        hr: (p, f) => ['p = F / A', `p = ${f(p.F)} N / ${f(p.A)} m²`, `p = ${f(p.F / p.A)} Pa`]
      }
    },
    {
      id: 'hydrostatic-water', level: 1,
      params: R => ({ h: R.step(0.5, 20, 0.5) }),
      text: {
        en: (p, f) => `What is the hydrostatic pressure of the water at a depth of ${f(p.h)} m in a lake? Use ρ = 1000 kg/m³ and g = 10 N/kg (p = ρ · g · h).`,
        hr: (p, f) => `Koliki je hidrostatski tlak vode na dubini ${f(p.h)} m u jezeru? Uzmi ρ = 1000 kg/m³ i g = 10 N/kg (p = ρ · g · h).`
      },
      answer: p => 1000 * 10 * p.h, unit: 'Pa',
      hint: { en: 'Multiply density, g and depth.', hr: 'Pomnoži gustoću, g i dubinu.' },
      steps: {
        en: (p, f) => ['p = ρ · g · h', `p = 1000 kg/m³ · 10 N/kg · ${f(p.h)} m`, `p = ${f(10000 * p.h)} Pa`],
        hr: (p, f) => ['p = ρ · g · h', `p = 1000 kg/m³ · 10 N/kg · ${f(p.h)} m`, `p = ${f(10000 * p.h)} Pa`]
      }
    },
    {
      id: 'hydraulic-lift', level: 1,
      params: R => { const A1 = R.pick([2, 4, 5, 10]); const k = R.pick([5, 10, 20, 25, 50]); return { A1, A2: A1 * k, F1: R.step(50, 500, 50) }; },
      text: {
        en: (p, f) => `In a hydraulic lift the small piston has an area of ${f(p.A1)} cm² and the large piston ${f(p.A2)} cm². We push the small piston with a force of ${f(p.F1)} N. How big is the force on the large piston? (F₂ = F₁ · A₂ / A₁)`,
        hr: (p, f) => `U hidrauličkoj dizalici mali klip ima površinu ${f(p.A1)} cm², a veliki klip ${f(p.A2)} cm². Mali klip pritisnemo silom ${f(p.F1)} N. Kolika je sila na velikom klipu? (F₂ = F₁ · A₂ / A₁)`
      },
      answer: p => p.F1 * p.A2 / p.A1, unit: 'N',
      hint: { en: 'The force grows as many times as the area is bigger.', hr: 'Sila se poveća toliko puta koliko je puta površina veća.' },
      steps: {
        en: (p, f) => [`A₂ / A₁ = ${f(p.A2)} cm² / ${f(p.A1)} cm² = ${f(p.A2 / p.A1)}`, `F₂ = F₁ · A₂ / A₁ = ${f(p.F1)} N · ${f(p.A2 / p.A1)}`, `F₂ = ${f(p.F1 * p.A2 / p.A1)} N`],
        hr: (p, f) => [`A₂ / A₁ = ${f(p.A2)} cm² / ${f(p.A1)} cm² = ${f(p.A2 / p.A1)}`, `F₂ = F₁ · A₂ / A₁ = ${f(p.F1)} N · ${f(p.A2 / p.A1)}`, `F₂ = ${f(p.F1 * p.A2 / p.A1)} N`]
      }
    },
    {
      id: 'area-from-force', level: 2,
      params: R => { const p = R.pick([500, 1000, 2000, 2500, 4000, 5000]); const A = R.step(0.2, 2, 0.2); return { p, F: p * A }; },
      text: {
        en: (p, f) => `A wardrobe presses on the floor with a force of ${f(p.F)} N and exerts a pressure of ${f(p.p)} Pa. What is the area of its base? (A = F / p)`,
        hr: (p, f) => `Ormar pritišće pod silom ${f(p.F)} N i vrši tlak ${f(p.p)} Pa. Kolika je površina njegova dna? (A = F / p)`
      },
      answer: p => p.F / p.p, unit: 'm²',
      hint: { en: 'Rearrange p = F / A into A = F / p.', hr: 'Iz p = F / A slijedi A = F / p.' },
      steps: {
        en: (p, f) => ['p = F / A  →  A = F / p', `A = ${f(p.F)} N / ${f(p.p)} Pa`, `A = ${f(p.F / p.p)} m²`],
        hr: (p, f) => ['p = F / A  →  A = F / p', `A = ${f(p.F)} N / ${f(p.p)} Pa`, `A = ${f(p.F / p.p)} m²`]
      }
    },
    {
      id: 'convert-to-kpa', level: 2,
      params: R => { const c = R.pick(TO_KPA); return { c, v: R.step(c.min, c.max, c.stp) }; },
      text: {
        en: (p, f) => `${p.c.item.en} ${f(p.v)} ${p.c.from}. Express this pressure in kilopascals. (${p.c.rel})`,
        hr: (p, f) => `${p.c.item.hr} ${f(p.v)} ${p.c.from}. Izrazi taj tlak u kilopaskalima. (${p.c.rel})`
      },
      answer: p => p.c.mul ? p.v * p.c.mul : p.v / p.c.div, unit: 'kPa',
      hint: { en: 'A kilopascal is 1000 pascals; a bar is 100 kilopascals.', hr: 'Kilopaskal ima 1000 paskala; bar ima 100 kilopaskala.' },
      steps: {
        en: (p, f) => [p.c.rel, p.c.mul ? `${f(p.v)} bar · ${f(p.c.mul)} = ${f(p.v * p.c.mul)} kPa` : `${f(p.v)} Pa / ${f(p.c.div)} = ${f(p.v / p.c.div)} kPa`],
        hr: (p, f) => [p.c.rel, p.c.mul ? `${f(p.v)} bar · ${f(p.c.mul)} = ${f(p.v * p.c.mul)} kPa` : `${f(p.v)} Pa / ${f(p.c.div)} = ${f(p.v / p.c.div)} kPa`]
      }
    },
    {
      id: 'depth-from-pressure', level: 2,
      params: R => ({ h: R.int(1, 40) }),
      text: {
        en: (p, f) => `At what depth in a lake does the water alone exert a pressure of ${f(10 * p.h)} kPa? Use ρ = 1000 kg/m³ and g = 10 N/kg. (1 kPa = 1000 Pa)`,
        hr: (p, f) => `Na kojoj dubini u jezeru sama voda vrši tlak ${f(10 * p.h)} kPa? Uzmi ρ = 1000 kg/m³ i g = 10 N/kg. (1 kPa = 1000 Pa)`
      },
      answer: p => p.h, unit: 'm',
      hint: { en: 'Write the pressure in Pa, then h = p / (ρ · g).', hr: 'Zapiši tlak u Pa, zatim h = p / (ρ · g).' },
      steps: {
        en: (p, f) => [`p = ${f(10 * p.h)} kPa = ${f(10000 * p.h)} Pa`, `h = p / (ρ · g) = ${f(10000 * p.h)} Pa / (1000 kg/m³ · 10 N/kg)`, `h = ${f(10000 * p.h)} / 10000 m = ${f(p.h)} m`],
        hr: (p, f) => [`p = ${f(10 * p.h)} kPa = ${f(10000 * p.h)} Pa`, `h = p / (ρ · g) = ${f(10000 * p.h)} Pa / (1000 kg/m³ · 10 N/kg)`, `h = ${f(10000 * p.h)} / 10000 m = ${f(p.h)} m`]
      }
    },
    {
      id: 'diver-total-pressure', level: 3,
      params: R => ({ h: R.int(5, 40) }),
      text: {
        en: (p, f) => `A diver is ${f(p.h)} m below the surface of the sea. The density of sea water is 1030 kg/m³, g = 10 N/kg and the atmospheric pressure at the surface is 100 kPa. What is the total pressure on the diver, in kPa?`,
        hr: (p, f) => `Ronilac je ${f(p.h)} m ispod površine mora. Gustoća morske vode je 1030 kg/m³, g = 10 N/kg, a atmosferski tlak na površini iznosi 100 kPa. Koliki je ukupni tlak na ronioca, u kPa?`
      },
      answer: p => 100 + 1030 * 10 * p.h / 1000, unit: 'kPa',
      hint: { en: 'Pressure of the water ρ · g · h in kPa, plus the 100 kPa of the atmosphere.', hr: 'Tlak vode ρ · g · h u kPa, plus 100 kPa atmosfere.' },
      steps: {
        en: (p, f) => [`Water: p = ρ · g · h = 1030 kg/m³ · 10 N/kg · ${f(p.h)} m = ${f(10300 * p.h)} Pa = ${f(10.3 * p.h)} kPa`, `Total: ${f(10.3 * p.h)} kPa + 100 kPa`, `p = ${f(100 + 10.3 * p.h)} kPa`],
        hr: (p, f) => [`Voda: p = ρ · g · h = 1030 kg/m³ · 10 N/kg · ${f(p.h)} m = ${f(10300 * p.h)} Pa = ${f(10.3 * p.h)} kPa`, `Ukupno: ${f(10.3 * p.h)} kPa + 100 kPa`, `p = ${f(100 + 10.3 * p.h)} kPa`]
      }
    },
    {
      id: 'atmosphere-window', level: 3,
      params: R => ({ a: R.step(0.5, 2, 0.1), b: R.step(0.5, 1.5, 0.1) }),
      text: {
        en: (p, f) => `A window is ${f(p.a)} m wide and ${f(p.b)} m high. With what force does the atmosphere press on it? Take the atmospheric pressure p = 100 kPa = ${f(100000)} Pa. (F = p · A)`,
        hr: (p, f) => `Prozor je širok ${f(p.a)} m i visok ${f(p.b)} m. Kolikom silom atmosfera pritišće na prozor? Uzmi atmosferski tlak p = 100 kPa = ${f(100000)} Pa. (F = p · A)`
      },
      answer: p => 100000 * p.a * p.b, unit: 'N',
      hint: { en: 'First the area of the window, then F = p · A.', hr: 'Najprije površina prozora, zatim F = p · A.' },
      steps: {
        en: (p, f) => [`A = ${f(p.a)} m · ${f(p.b)} m = ${f(p.a * p.b)} m²`, `F = p · A = ${f(100000)} Pa · ${f(p.a * p.b)} m²`, `F = ${f(100000 * p.a * p.b)} N`],
        hr: (p, f) => [`A = ${f(p.a)} m · ${f(p.b)} m = ${f(p.a * p.b)} m²`, `F = p · A = ${f(100000)} Pa · ${f(p.a * p.b)} m²`, `F = ${f(100000 * p.a * p.b)} N`]
      }
    },
    {
      id: 'person-standing', level: 3,
      params: R => ({ m: R.int(40, 90), A: R.pick([400, 500]) }),
      text: {
        en: (p, f) => `A pupil of mass ${f(p.m)} kg stands on both feet. The total area of the shoe soles is ${f(p.A)} cm². What pressure does the pupil exert on the floor? Use g = 10 N/kg and 1 cm² = ${f(0.0001, 4)} m².`,
        hr: (p, f) => `Učenik mase ${f(p.m)} kg stoji na obje noge. Ukupna površina potplata je ${f(p.A)} cm². Koliki tlak učenik vrši na pod? Uzmi g = 10 N/kg i 1 cm² = ${f(0.0001, 4)} m².`
      },
      answer: p => p.m * 10 / (p.A / 10000), unit: 'Pa',
      hint: { en: 'Weight G = m · g, area in m², then p = G / A.', hr: 'Težina G = m · g, površina u m², zatim p = G / A.' },
      steps: {
        en: (p, f) => [`G = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `A = ${f(p.A)} cm² = ${f(p.A / 10000)} m²`, `p = G / A = ${f(p.m * 10)} N / ${f(p.A / 10000)} m² = ${f(p.m * 10 / (p.A / 10000))} Pa`],
        hr: (p, f) => [`G = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `A = ${f(p.A)} cm² = ${f(p.A / 10000)} m²`, `p = G / A = ${f(p.m * 10)} N / ${f(p.A / 10000)} m² = ${f(p.m * 10 / (p.A / 10000))} Pa`]
      }
    }
  ]);
})();
