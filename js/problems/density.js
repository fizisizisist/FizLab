/* FizLab practice problems: Density / Gustoća */
(function () {
  'use strict';
  /* densities in g/cm³; hr is the genitive ("komad aluminija", "gustoća zlata") */
  const SOLIDS = [
    { en: 'aluminium', hr: 'aluminija', rho: 2.7 },
    { en: 'iron', hr: 'željeza', rho: 7.87 },
    { en: 'copper', hr: 'bakra', rho: 8.9 },
    { en: 'glass', hr: 'stakla', rho: 2.5 },
    { en: 'silver', hr: 'srebra', rho: 10.5 },
    { en: 'lead', hr: 'olova', rho: 11.3 },
    { en: 'gold', hr: 'zlata', rho: 19.3 }
  ];
  /* densities in kg/m³; hr in the nominative */
  const BULK = [
    { en: 'Sand', hr: 'Pijesak', rho: 1600 },
    { en: 'Concrete', hr: 'Beton', rho: 2400 },
    { en: 'Pine wood', hr: 'Borovo drvo', rho: 700 },
    { en: 'Cooking oil', hr: 'Jestivo ulje', rho: 920 },
    { en: 'Brick', hr: 'Opeka', rho: 1800 },
    { en: 'Water', hr: 'Voda', rho: 1000 }
  ];
  /* block materials in g/cm³; hr genitive */
  const BLOCKS = [
    { en: 'aluminium', hr: 'aluminija', rho: 2.7 },
    { en: 'copper', hr: 'bakra', rho: 8.9 },
    { en: 'glass', hr: 'stakla', rho: 2.5 },
    { en: 'oak wood', hr: 'hrastovine', rho: 0.8 },
    { en: 'pine wood', hr: 'borovine', rho: 0.7 },
    { en: 'steel', hr: 'čelika', rho: 7.8 }
  ];

  window.Content.registerProblems('density', [
    {
      id: 'density-g-cm3', level: 1,
      params: R => { const s = R.pick(SOLIDS); const V = R.pick([10, 20, 25, 40, 50, 100]); return { s, V, m: s.rho * V }; },
      text: {
        en: (p, f) => `A piece of ${p.s.en} has a volume of ${f(p.V)} cm³ and a mass of ${f(p.m)} g. What is the density of ${p.s.en} in g/cm³?`,
        hr: (p, f) => `Komad ${p.s.hr} ima obujam ${f(p.V)} cm³ i masu ${f(p.m)} g. Kolika je gustoća ${p.s.hr} u g/cm³?`
      },
      answer: p => p.m / p.V, unit: 'g/cm³',
      hint: { en: 'Density = mass divided by volume.', hr: 'Gustoća = masa podijeljena obujmom.' },
      steps: {
        en: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³`, `ρ = ${f(p.m / p.V)} g/cm³`],
        hr: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³`, `ρ = ${f(p.m / p.V)} g/cm³`]
      }
    },
    {
      id: 'density-kg-m3', level: 1,
      params: R => { const s = R.pick(BULK); const V = R.pick([0.5, 1, 2, 2.5, 4, 5]); return { s, V, m: s.rho * V }; },
      text: {
        en: (p, f) => `${p.s.en} with a volume of ${f(p.V)} m³ has a mass of ${f(p.m)} kg. What is the density of this substance in kg/m³?`,
        hr: (p, f) => `${p.s.hr} obujma ${f(p.V)} m³ ima masu ${f(p.m)} kg. Kolika je gustoća te tvari u kg/m³?`
      },
      answer: p => p.m / p.V, unit: 'kg/m³',
      hint: { en: 'Divide the mass in kg by the volume in m³.', hr: 'Podijeli masu u kg obujmom u m³.' },
      steps: {
        en: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} kg / ${f(p.V)} m³`, `ρ = ${f(p.m / p.V)} kg/m³`],
        hr: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} kg / ${f(p.V)} m³`, `ρ = ${f(p.m / p.V)} kg/m³`]
      }
    },
    {
      id: 'gold-bar-mass', level: 1,
      params: R => ({ V: R.step(10, 100, 5) }),
      text: {
        en: (p, f) => `A small gold bar has a volume of ${f(p.V)} cm³. The density of gold is ${f(19.3)} g/cm³. What is the mass of the bar?`,
        hr: (p, f) => `Mala zlatna poluga ima obujam ${f(p.V)} cm³. Gustoća zlata je ${f(19.3)} g/cm³. Kolika je masa poluge?`
      },
      answer: p => 19.3 * p.V, unit: 'g',
      hint: { en: 'Rearrange ρ = m / V into m = ρ · V.', hr: 'Iz ρ = m / V slijedi m = ρ · V.' },
      steps: {
        en: (p, f) => ['m = ρ · V', `m = ${f(19.3)} g/cm³ · ${f(p.V)} cm³`, `m = ${f(19.3 * p.V)} g`],
        hr: (p, f) => ['m = ρ · V', `m = ${f(19.3)} g/cm³ · ${f(p.V)} cm³`, `m = ${f(19.3 * p.V)} g`]
      }
    },
    {
      id: 'convert-to-kg-m3', level: 2,
      params: R => ({ s: R.pick(SOLIDS.concat([{ en: 'pine wood', hr: 'borovine', rho: 0.7 }, { en: 'cooking oil', hr: 'jestivog ulja', rho: 0.92 }])) }),
      text: {
        en: (p, f) => `The density of ${p.s.en} is ${f(p.s.rho)} g/cm³. Express it in kg/m³. (1 g/cm³ = 1000 kg/m³)`,
        hr: (p, f) => `Gustoća ${p.s.hr} iznosi ${f(p.s.rho)} g/cm³. Izrazi je u kg/m³. (1 g/cm³ = 1000 kg/m³)`
      },
      answer: p => p.s.rho * 1000, unit: 'kg/m³',
      hint: { en: 'A cubic metre has a million cm³ and a kilogram has 1000 g, so the number gets 1000 times bigger.', hr: 'Kubni metar ima milijun cm³, a kilogram 1000 g, pa broj postaje 1000 puta veći.' },
      steps: {
        en: (p, f) => ['1 g/cm³ = 1000 kg/m³', `${f(p.s.rho)} g/cm³ · 1000 = ${f(p.s.rho * 1000)} kg/m³`],
        hr: (p, f) => ['1 g/cm³ = 1000 kg/m³', `${f(p.s.rho)} g/cm³ · 1000 = ${f(p.s.rho * 1000)} kg/m³`]
      }
    },
    {
      id: 'volume-from-density', level: 2,
      params: R => { const s = R.pick(SOLIDS); const V = R.pick([2, 4, 5, 8, 10, 20, 50]); return { s, V, m: s.rho * V }; },
      text: {
        en: (p, f) => `A piece of ${p.s.en} has a mass of ${f(p.m)} g. The density of ${p.s.en} is ${f(p.s.rho)} g/cm³. What is the volume of the piece?`,
        hr: (p, f) => `Komad ${p.s.hr} ima masu ${f(p.m)} g. Gustoća ${p.s.hr} je ${f(p.s.rho)} g/cm³. Koliki je obujam tog komada?`
      },
      answer: p => p.m / p.s.rho, unit: 'cm³',
      hint: { en: 'Rearrange ρ = m / V into V = m / ρ.', hr: 'Iz ρ = m / V slijedi V = m / ρ.' },
      steps: {
        en: (p, f) => ['V = m / ρ', `V = ${f(p.m)} g / ${f(p.s.rho)} g/cm³`, `V = ${f(p.m / p.s.rho)} cm³`],
        hr: (p, f) => ['V = m / ρ', `V = ${f(p.m)} g / ${f(p.s.rho)} g/cm³`, `V = ${f(p.m / p.s.rho)} cm³`]
      }
    },
    {
      id: 'float-or-sink', level: 2,
      params: R => { const rho = R.pick([0.5, 0.6, 0.8, 0.9, 1.2, 1.5, 2, 2.5]); const V = R.pick([20, 40, 50, 100, 200]); return { rho, V, m: rho * V }; },
      text: {
        en: (p, f) => `A piece of unknown material has a mass of ${f(p.m)} g and a volume of ${f(p.V)} cm³. Calculate its density. (It floats in water if its density is less than the density of water, 1 g/cm³.)`,
        hr: (p, f) => `Komad nepoznate tvari ima masu ${f(p.m)} g i obujam ${f(p.V)} cm³. Izračunaj njegovu gustoću. (Pluta na vodi ako mu je gustoća manja od gustoće vode, 1 g/cm³.)`
      },
      answer: p => p.m / p.V, unit: 'g/cm³',
      hint: { en: 'Compute ρ = m / V and compare it with 1 g/cm³.', hr: 'Izračunaj ρ = m / V i usporedi s 1 g/cm³.' },
      steps: {
        en: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`, p.rho < 1 ? 'Less than 1 g/cm³: the piece floats.' : 'More than 1 g/cm³: the piece sinks.'],
        hr: (p, f) => ['ρ = m / V', `ρ = ${f(p.m)} g / ${f(p.V)} cm³ = ${f(p.m / p.V)} g/cm³`, p.rho < 1 ? 'Manje od 1 g/cm³: komad pluta.' : 'Više od 1 g/cm³: komad tone.']
      }
    },
    {
      id: 'displacement-density', level: 3,
      params: R => { const v1 = R.step(40, 150, 5); const dv = R.pick([10, 20, 25, 40, 50]); const rho = R.step(2.2, 3, 0.1); return { v1, v2: v1 + dv, m: rho * dv }; },
      text: {
        en: (p, f) => `A pebble has a mass of ${f(p.m)} g. When it is put into a measuring cylinder, the water level rises from ${f(p.v1)} mL to ${f(p.v2)} mL. What is the density of the pebble? (1 mL = 1 cm³)`,
        hr: (p, f) => `Kamenčić ima masu ${f(p.m)} g. Kad ga spustimo u menzuru, razina vode podigne se s ${f(p.v1)} mL na ${f(p.v2)} mL. Kolika je gustoća kamenčića? (1 mL = 1 cm³)`
      },
      answer: p => p.m / (p.v2 - p.v1), unit: 'g/cm³',
      hint: { en: 'The rise of the water level is the volume of the pebble; then ρ = m / V.', hr: 'Podizanje razine vode jednako je obujmu kamenčića; zatim ρ = m / V.' },
      steps: {
        en: (p, f) => [`Volume: V = ${f(p.v2)} mL − ${f(p.v1)} mL = ${f(p.v2 - p.v1)} cm³`, `ρ = m / V = ${f(p.m)} g / ${f(p.v2 - p.v1)} cm³`, `ρ = ${f(p.m / (p.v2 - p.v1))} g/cm³`],
        hr: (p, f) => [`Obujam: V = ${f(p.v2)} mL − ${f(p.v1)} mL = ${f(p.v2 - p.v1)} cm³`, `ρ = m / V = ${f(p.m)} g / ${f(p.v2 - p.v1)} cm³`, `ρ = ${f(p.m / (p.v2 - p.v1))} g/cm³`]
      }
    },
    {
      id: 'aquarium-water-mass', level: 3,
      params: R => ({ a: R.step(40, 100, 10), b: R.step(20, 50, 10), h: R.step(20, 50, 5) }),
      text: {
        en: (p, f) => `An aquarium is ${f(p.a)} cm long and ${f(p.b)} cm wide. It is filled with water to a height of ${f(p.h)} cm. What is the mass of the water? (1 L = 1000 cm³; 1 L of water has a mass of 1 kg)`,
        hr: (p, f) => `Akvarij je dug ${f(p.a)} cm i širok ${f(p.b)} cm. Napunjen je vodom do visine ${f(p.h)} cm. Kolika je masa vode? (1 L = 1000 cm³; 1 L vode ima masu 1 kg)`
      },
      answer: p => p.a * p.b * p.h / 1000, unit: 'kg',
      hint: { en: 'Volume of the water in cm³, then in litres; every litre of water is 1 kg.', hr: 'Obujam vode u cm³, zatim u litrama; svaka litra vode ima 1 kg.' },
      steps: {
        en: (p, f) => [`V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.h)} cm = ${f(p.a * p.b * p.h)} cm³`, `V = ${f(p.a * p.b * p.h)} cm³ / 1000 = ${f(p.a * p.b * p.h / 1000)} L`, `m = ${f(p.a * p.b * p.h / 1000)} L · 1 kg/L = ${f(p.a * p.b * p.h / 1000)} kg`],
        hr: (p, f) => [`V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.h)} cm = ${f(p.a * p.b * p.h)} cm³`, `V = ${f(p.a * p.b * p.h)} cm³ / 1000 = ${f(p.a * p.b * p.h / 1000)} L`, `m = ${f(p.a * p.b * p.h / 1000)} L · 1 kg/L = ${f(p.a * p.b * p.h / 1000)} kg`]
      }
    },
    {
      id: 'box-density-mass', level: 3,
      params: R => ({ s: R.pick(BLOCKS), a: R.int(2, 10), b: R.int(2, 10), c: R.int(2, 10) }),
      text: {
        en: (p, f) => `A block of ${p.s.en} is ${f(p.a)} cm long, ${f(p.b)} cm wide and ${f(p.c)} cm high. The density of ${p.s.en} is ${f(p.s.rho)} g/cm³. What is the mass of the block?`,
        hr: (p, f) => `Kvadar od ${p.s.hr} dug je ${f(p.a)} cm, širok ${f(p.b)} cm i visok ${f(p.c)} cm. Gustoća ${p.s.hr} je ${f(p.s.rho)} g/cm³. Kolika je masa kvadra?`
      },
      answer: p => p.s.rho * p.a * p.b * p.c, unit: 'g',
      hint: { en: 'First the volume V = a · b · c, then the mass m = ρ · V.', hr: 'Najprije obujam V = a · b · c, zatim masa m = ρ · V.' },
      steps: {
        en: (p, f) => [`V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm = ${f(p.a * p.b * p.c)} cm³`, `m = ρ · V = ${f(p.s.rho)} g/cm³ · ${f(p.a * p.b * p.c)} cm³`, `m = ${f(p.s.rho * p.a * p.b * p.c)} g`],
        hr: (p, f) => [`V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm = ${f(p.a * p.b * p.c)} cm³`, `m = ρ · V = ${f(p.s.rho)} g/cm³ · ${f(p.a * p.b * p.c)} cm³`, `m = ${f(p.s.rho * p.a * p.b * p.c)} g`]
      }
    }
  ]);
})();
