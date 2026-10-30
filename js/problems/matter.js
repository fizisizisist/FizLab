/* FizLab practice problems: Matter and measurement / Tijela i tvari, mjerenje */
(function () {
  'use strict';
  const LENGTH = [
    { from: 'km', mul: 1000, rel: '1 km = 1000 m', item: { en: 'A hiking trail', hr: 'Planinarska staza' }, min: 0.5, max: 12, stp: 0.5 },
    { from: 'cm', div: 100, rel: '1 m = 100 cm', item: { en: 'A table', hr: 'Stol' }, min: 120, max: 950, stp: 5 },
    { from: 'mm', div: 1000, rel: '1 m = 1000 mm', item: { en: 'A plank', hr: 'Daska' }, min: 1250, max: 4750, stp: 50 }
  ];
  const VOLUME = [
    { from: 'cm³', rel: '1 L = 1000 cm³', item: { en: 'A jug', hr: 'Vrč' }, min: 250, max: 4750, stp: 250 },
    { from: 'mL', rel: '1 L = 1000 mL', item: { en: 'A bottle of juice', hr: 'Boca soka' }, min: 250, max: 2500, stp: 250 },
    { from: 'm³', rel: '1 m³ = 1000 L', item: { en: 'A water tank', hr: 'Spremnik za vodu' }, min: 0.5, max: 8, stp: 0.5 }
  ];
  const MASS_ITEMS = [
    { en: 'A parcel', hr: 'Paket' }, { en: 'A pumpkin', hr: 'Tikva' }, { en: 'A bag of rice', hr: 'Vrećica riže' }, { en: 'A melon', hr: 'Dinja' }
  ];
  const DEVIATIONS = [[-0.1, 0, 0.1], [0, 0.1, 0.2], [0.1, 0.2, 0.3], [-0.2, 0, 0.2], [-0.3, 0, 0.3], [0.2, 0.3, 0.4], [-0.2, -0.1, 0], [-0.1, 0.1, 0.3]];

  window.Content.registerProblems('matter', [
    {
      id: 'length-to-m', level: 1,
      params: R => { const c = R.pick(LENGTH); return { c, v: R.step(c.min, c.max, c.stp) }; },
      text: {
        en: (p, f) => `${p.c.item.en} has a length of ${f(p.v)} ${p.c.from}. Express this length in metres. (${p.c.rel})`,
        hr: (p, f) => `${p.c.item.hr} ima duljinu ${f(p.v)} ${p.c.from}. Izrazi tu duljinu u metrima. (${p.c.rel})`
      },
      answer: p => p.c.mul ? p.v * p.c.mul : p.v / p.c.div, unit: 'm',
      hint: { en: 'Kilo means 1000 times a metre, centi one hundredth and milli one thousandth of a metre.', hr: 'Kilo znači 1000 puta veći od metra, centi stoti dio, a mili tisućiti dio metra.' },
      steps: {
        en: (p, f) => [p.c.rel, p.c.mul ? `${f(p.v)} ${p.c.from} · ${f(p.c.mul)} = ${f(p.v * p.c.mul)} m` : `${f(p.v)} ${p.c.from} / ${f(p.c.div)} = ${f(p.v / p.c.div)} m`],
        hr: (p, f) => [p.c.rel, p.c.mul ? `${f(p.v)} ${p.c.from} · ${f(p.c.mul)} = ${f(p.v * p.c.mul)} m` : `${f(p.v)} ${p.c.from} / ${f(p.c.div)} = ${f(p.v / p.c.div)} m`]
      }
    },
    {
      id: 'mass-kg-to-g', level: 1,
      params: R => ({ m: R.step(0.25, 8, 0.25), item: R.pick(MASS_ITEMS) }),
      text: {
        en: (p, f) => `${p.item.en} has a mass of ${f(p.m)} kg. How many grams is that? (1 kg = 1000 g)`,
        hr: (p, f) => `${p.item.hr} ima masu ${f(p.m)} kg. Koliko je to grama? (1 kg = 1000 g)`
      },
      answer: p => p.m * 1000, unit: 'g',
      hint: { en: 'One kilogram is 1000 grams, so multiply by 1000.', hr: 'Jedan kilogram ima 1000 grama, pa pomnoži s 1000.' },
      steps: {
        en: (p, f) => ['1 kg = 1000 g', `${f(p.m)} kg · 1000 = ${f(p.m * 1000)} g`],
        hr: (p, f) => ['1 kg = 1000 g', `${f(p.m)} kg · 1000 = ${f(p.m * 1000)} g`]
      }
    },
    {
      id: 'box-volume-cm3', level: 1,
      params: R => ({ a: R.int(4, 30), b: R.int(3, 20), c: R.int(2, 15) }),
      text: {
        en: (p, f) => `A box is ${f(p.a)} cm long, ${f(p.b)} cm wide and ${f(p.c)} cm high. What is its volume in cm³?`,
        hr: (p, f) => `Kutija je duga ${f(p.a)} cm, široka ${f(p.b)} cm i visoka ${f(p.c)} cm. Koliki je njezin obujam u cm³?`
      },
      answer: p => p.a * p.b * p.c, unit: 'cm³',
      hint: { en: 'Volume of a box = length × width × height.', hr: 'Obujam kvadra = duljina × širina × visina.' },
      steps: {
        en: (p, f) => ['V = a · b · c', `V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm`, `V = ${f(p.a * p.b * p.c)} cm³`],
        hr: (p, f) => ['V = a · b · c', `V = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm`, `V = ${f(p.a * p.b * p.c)} cm³`]
      }
    },
    {
      id: 'volume-to-litres', level: 2,
      params: R => { const c = R.pick(VOLUME); return { c, v: R.step(c.min, c.max, c.stp) }; },
      text: {
        en: (p, f) => `${p.c.item.en} has a volume of ${f(p.v)} ${p.c.from}. How many litres is that? (${p.c.rel})`,
        hr: (p, f) => `${p.c.item.hr} ima obujam ${f(p.v)} ${p.c.from}. Koliko je to litara? (${p.c.rel})`
      },
      answer: p => p.c.from === 'm³' ? p.v * 1000 : p.v / 1000, unit: 'L',
      hint: { en: 'A litre is 1000 cm³ (1000 mL); a cubic metre is 1000 litres.', hr: 'Litra ima 1000 cm³ (1000 mL), a kubni metar ima 1000 litara.' },
      steps: {
        en: (p, f) => [p.c.rel, p.c.from === 'm³' ? `${f(p.v)} m³ · 1000 = ${f(p.v * 1000)} L` : `${f(p.v)} ${p.c.from} / 1000 = ${f(p.v / 1000)} L`],
        hr: (p, f) => [p.c.rel, p.c.from === 'm³' ? `${f(p.v)} m³ · 1000 = ${f(p.v * 1000)} L` : `${f(p.v)} ${p.c.from} / 1000 = ${f(p.v / 1000)} L`]
      }
    },
    {
      id: 'displacement', level: 2,
      params: R => { const v1 = R.step(40, 150, 5); const dv = R.step(10, 80, 5); return { v1, v2: v1 + dv }; },
      text: {
        en: (p, f) => `A measuring cylinder contains ${f(p.v1)} mL of water. When a stone is lowered into it, the water level rises to ${f(p.v2)} mL. What is the volume of the stone in cm³? (1 mL = 1 cm³)`,
        hr: (p, f) => `U menzuri je ${f(p.v1)} mL vode. Kad u nju uronimo kamen, razina vode podigne se na ${f(p.v2)} mL. Koliki je obujam kamena u cm³? (1 mL = 1 cm³)`
      },
      answer: p => p.v2 - p.v1, unit: 'cm³',
      hint: { en: 'The stone pushes aside exactly its own volume of water: subtract the two readings.', hr: 'Kamen istisne točno onoliko vode koliki mu je obujam: oduzmi dva očitanja.' },
      steps: {
        en: (p, f) => ['V = V₂ − V₁', `V = ${f(p.v2)} mL − ${f(p.v1)} mL = ${f(p.v2 - p.v1)} mL`, `1 mL = 1 cm³, so V = ${f(p.v2 - p.v1)} cm³`],
        hr: (p, f) => ['V = V₂ − V₁', `V = ${f(p.v2)} mL − ${f(p.v1)} mL = ${f(p.v2 - p.v1)} mL`, `1 mL = 1 cm³, pa je V = ${f(p.v2 - p.v1)} cm³`]
      }
    },
    {
      id: 'mass-difference', level: 2,
      params: R => { const m1 = R.step(150, 450, 10); const honey = R.step(250, 1500, 50); return { m1, m2: m1 + honey }; },
      text: {
        en: (p, f) => `An empty jar has a mass of ${f(p.m1)} g. Filled with honey it has a mass of ${f(p.m2)} g. What is the mass of the honey in kilograms? (1 kg = 1000 g)`,
        hr: (p, f) => `Prazna staklenka ima masu ${f(p.m1)} g. Napunjena medom ima masu ${f(p.m2)} g. Kolika je masa meda u kilogramima? (1 kg = 1000 g)`
      },
      answer: p => (p.m2 - p.m1) / 1000, unit: 'kg',
      hint: { en: 'Subtract the mass of the empty jar, then convert grams to kilograms.', hr: 'Oduzmi masu prazne staklenke, zatim grame pretvori u kilograme.' },
      steps: {
        en: (p, f) => [`Honey: m = ${f(p.m2)} g − ${f(p.m1)} g = ${f(p.m2 - p.m1)} g`, `${f(p.m2 - p.m1)} g / 1000 = ${f((p.m2 - p.m1) / 1000)} kg`],
        hr: (p, f) => [`Med: m = ${f(p.m2)} g − ${f(p.m1)} g = ${f(p.m2 - p.m1)} g`, `${f(p.m2 - p.m1)} g / 1000 = ${f((p.m2 - p.m1) / 1000)} kg`]
      }
    },
    {
      id: 'box-volume-litres', level: 3,
      params: R => ({ a: R.step(20, 60, 10), b: R.step(10, 40, 10), c: R.step(5, 40, 5) }),
      text: {
        en: (p, f) => `A plastic storage box is ${f(p.a)} cm long, ${f(p.b)} cm wide and ${f(p.c)} cm high. What is its volume in litres? (1 L = 1000 cm³)`,
        hr: (p, f) => `Plastična kutija za pohranu duga je ${f(p.a)} cm, široka ${f(p.b)} cm i visoka ${f(p.c)} cm. Koliki je njezin obujam u litrama? (1 L = 1000 cm³)`
      },
      answer: p => p.a * p.b * p.c / 1000, unit: 'L',
      hint: { en: 'First multiply the three edges to get cm³, then divide by 1000 to get litres.', hr: 'Najprije pomnoži tri brida da dobiješ cm³, zatim podijeli s 1000 da dobiješ litre.' },
      steps: {
        en: (p, f) => [`V = a · b · c = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm = ${f(p.a * p.b * p.c)} cm³`, '1 L = 1000 cm³', `V = ${f(p.a * p.b * p.c)} cm³ / 1000 = ${f(p.a * p.b * p.c / 1000)} L`],
        hr: (p, f) => [`V = a · b · c = ${f(p.a)} cm · ${f(p.b)} cm · ${f(p.c)} cm = ${f(p.a * p.b * p.c)} cm³`, '1 L = 1000 cm³', `V = ${f(p.a * p.b * p.c)} cm³ / 1000 = ${f(p.a * p.b * p.c / 1000)} L`]
      }
    },
    {
      id: 'scale-reading', level: 3,
      params: R => ({ kg: R.int(1, 5), g: R.step(50, 950, 50) }),
      text: {
        en: (p, f) => `A market scale shows that a bag of apples has a mass of ${f(p.kg)} kg and ${f(p.g)} g. What is this mass in grams? (1 kg = 1000 g)`,
        hr: (p, f) => `Vaga na tržnici pokazuje da vrećica jabuka ima masu ${f(p.kg)} kg i ${f(p.g)} g. Kolika je ta masa u gramima? (1 kg = 1000 g)`
      },
      answer: p => p.kg * 1000 + p.g, unit: 'g',
      hint: { en: 'Convert the kilograms to grams first, then add the grams.', hr: 'Najprije kilograme pretvori u grame, zatim dodaj grame.' },
      steps: {
        en: (p, f) => [`${f(p.kg)} kg = ${f(p.kg)} · 1000 g = ${f(p.kg * 1000)} g`, `m = ${f(p.kg * 1000)} g + ${f(p.g)} g = ${f(p.kg * 1000 + p.g)} g`],
        hr: (p, f) => [`${f(p.kg)} kg = ${f(p.kg)} · 1000 g = ${f(p.kg * 1000)} g`, `m = ${f(p.kg * 1000)} g + ${f(p.g)} g = ${f(p.kg * 1000 + p.g)} g`]
      }
    },
    {
      id: 'average-three', level: 3,
      params: R => { const b = R.int(10, 30); const d = R.pick(DEVIATIONS); return { m1: b + d[0], m2: b + d[1], m3: b + d[2] }; },
      text: {
        en: (p, f) => `Ana measured the length of her pencil three times: ${f(p.m1)} cm, ${f(p.m2)} cm and ${f(p.m3)} cm. What is the average (mean) value of the length?`,
        hr: (p, f) => `Ana je tri puta izmjerila duljinu svoje olovke: ${f(p.m1)} cm, ${f(p.m2)} cm i ${f(p.m3)} cm. Kolika je srednja vrijednost duljine?`
      },
      answer: p => (p.m1 + p.m2 + p.m3) / 3, unit: 'cm',
      hint: { en: 'Add the three measurements and divide the sum by 3.', hr: 'Zbroji tri mjerenja i zbroj podijeli s 3.' },
      steps: {
        en: (p, f) => [`Sum: ${f(p.m1)} cm + ${f(p.m2)} cm + ${f(p.m3)} cm = ${f(p.m1 + p.m2 + p.m3)} cm`, `Average: ${f(p.m1 + p.m2 + p.m3)} cm / 3 = ${f((p.m1 + p.m2 + p.m3) / 3)} cm`],
        hr: (p, f) => [`Zbroj: ${f(p.m1)} cm + ${f(p.m2)} cm + ${f(p.m3)} cm = ${f(p.m1 + p.m2 + p.m3)} cm`, `Srednja vrijednost: ${f(p.m1 + p.m2 + p.m3)} cm / 3 = ${f((p.m1 + p.m2 + p.m3) / 3)} cm`]
      }
    }
  ]);
})();
