/* FizLab practice problems: Light / Svjetlost */
(function () {
  'use strict';
  window.Content.registerProblems('light', [
    {
      id: 'reflection-angle', level: 1,
      params: R => ({ a: R.step(10, 80, 5) }),
      text: {
        en: (p, f) => `A ray of light hits a plane mirror with an angle of incidence of ${f(p.a)}° (measured from the normal). What is the angle between the incident ray and the reflected ray?`,
        hr: (p, f) => `Zraka svjetlosti upada na ravno zrcalo pod upadnim kutom ${f(p.a)}° (mjereno od okomice). Koliki je kut između upadne i odbijene zrake?`
      },
      answer: p => 2 * p.a, unit: '°',
      hint: { en: 'The angle of reflection equals the angle of incidence; the two angles lie on either side of the normal.', hr: 'Kut odbijanja jednak je upadnom kutu; ta dva kuta leže s dviju strana okomice.' },
      steps: {
        en: (p, f) => [`Law of reflection: angle of reflection = angle of incidence = ${f(p.a)}°`, `Angle between the rays = ${f(p.a)}° + ${f(p.a)}° = ${f(2 * p.a)}°`],
        hr: (p, f) => [`Zakon odbijanja: kut odbijanja = upadni kut = ${f(p.a)}°`, `Kut između zraka = ${f(p.a)}° + ${f(p.a)}° = ${f(2 * p.a)}°`]
      }
    },
    {
      id: 'mirror-image-distance', level: 1,
      params: R => ({ d: R.step(0.5, 4, 0.5) }),
      text: {
        en: (p, f) => `You stand ${f(p.d)} m in front of a plane mirror. How far away from you is your image in the mirror?`,
        hr: (p, f) => `Stojiš ${f(p.d)} m ispred ravnog zrcala. Koliko je tvoja slika u zrcalu udaljena od tebe?`
      },
      answer: p => 2 * p.d, unit: 'm',
      hint: { en: 'The image is as far behind the mirror as you are in front of it.', hr: 'Slika je jednako daleko iza zrcala koliko si ti ispred njega.' },
      steps: {
        en: (p, f) => [`The image is as far behind the mirror as you are in front: ${f(p.d)} m`, `Distance to the image = ${f(p.d)} m + ${f(p.d)} m = ${f(2 * p.d)} m`],
        hr: (p, f) => [`Slika je jednako daleko iza zrcala koliko si ti ispred: ${f(p.d)} m`, `Udaljenost do slike = ${f(p.d)} m + ${f(p.d)} m = ${f(2 * p.d)} m`]
      }
    },
    {
      id: 'light-time-moon', level: 1,
      params: R => ({ d: R.pick([360000, 375000, 384000, 390000, 405000]) }),
      text: {
        en: (p, f) => `The Moon's distance from Earth changes a little during the month. Tonight the Moon is ${f(p.d)} km away. Light travels at c = 300 000 km/s. How long does moonlight take to reach us?`,
        hr: (p, f) => `Udaljenost Mjeseca od Zemlje malo se mijenja tijekom mjeseca. Večeras je Mjesec udaljen ${f(p.d)} km. Svjetlost putuje brzinom c = 300 000 km/s. Koliko dugo svjetlost s Mjeseca putuje do nas?`
      },
      answer: p => p.d / 300000, unit: 's',
      hint: { en: 'Time = distance / speed.', hr: 'Vrijeme = put / brzina.' },
      steps: {
        en: (p, f) => ['t = d / c', `t = ${f(p.d)} km / 300 000 km/s`, `t = ${f(p.d / 300000)} s`],
        hr: (p, f) => ['t = d / c', `t = ${f(p.d)} km / 300 000 km/s`, `t = ${f(p.d / 300000)} s`]
      }
    },
    {
      id: 'mirror-surface-angle', level: 2,
      params: R => ({ b: R.step(10, 80, 5) }),
      text: {
        en: (p, f) => `A ray of light hits a plane mirror so that it makes an angle of ${f(p.b)}° with the surface of the mirror. What is the angle of reflection (measured from the normal)?`,
        hr: (p, f) => `Zraka svjetlosti udara u ravno zrcalo tako da s površinom zrcala zatvara kut ${f(p.b)}°. Koliki je kut odbijanja (mjereno od okomice)?`
      },
      answer: p => 90 - p.b, unit: '°',
      hint: { en: 'The normal is perpendicular to the mirror, so angle of incidence = 90° − angle with the surface. Then use the law of reflection.', hr: 'Okomica je okomita na zrcalo, pa je upadni kut = 90° − kut s površinom. Zatim primijeni zakon odbijanja.' },
      steps: {
        en: (p, f) => [`Angle of incidence (from the normal) = 90° − ${f(p.b)}° = ${f(90 - p.b)}°`, `Law of reflection: angle of reflection = angle of incidence = ${f(90 - p.b)}°`],
        hr: (p, f) => [`Upadni kut (od okomice) = 90° − ${f(p.b)}° = ${f(90 - p.b)}°`, `Zakon odbijanja: kut odbijanja = upadni kut = ${f(90 - p.b)}°`]
      }
    },
    {
      id: 'light-time-planets', level: 2,
      params: R => ({ body: R.pick([
        { en: 'the Sun', gen: 'Sunca', d: 150 },
        { en: 'Venus', gen: 'Venere', d: 45 },
        { en: 'Mars', gen: 'Marsa', d: 75 },
        { en: 'Jupiter', gen: 'Jupitera', d: 600 },
        { en: 'Saturn', gen: 'Saturna', d: 1200 },
        { en: 'Neptune', gen: 'Neptuna', d: 4500 }
      ]) }),
      text: {
        en: (p, f) => `At a certain moment the distance between Earth and ${p.body.en} is about ${f(p.body.d)} million km. Light travels at c = 300 000 km/s. How many seconds does light need to travel from ${p.body.en} to Earth?`,
        hr: (p, f) => `U nekom trenutku udaljenost između Zemlje i ${p.body.gen} iznosi oko ${f(p.body.d)} milijuna km. Svjetlost putuje brzinom c = 300 000 km/s. Koliko sekundi svjetlost putuje od ${p.body.gen} do Zemlje?`
      },
      answer: p => p.body.d * 1000000 / 300000, unit: 's',
      hint: { en: 'Write the distance in km (1 million = 1 000 000), then t = d / c.', hr: 'Zapiši udaljenost u km (1 milijun = 1 000 000), zatim t = d / c.' },
      steps: {
        en: (p, f) => [`${f(p.body.d)} million km = ${f(p.body.d * 1000000)} km`, 't = d / c', `t = ${f(p.body.d * 1000000)} km / 300 000 km/s = ${f(p.body.d * 1000000 / 300000)} s`],
        hr: (p, f) => [`${f(p.body.d)} milijuna km = ${f(p.body.d * 1000000)} km`, 't = d / c', `t = ${f(p.body.d * 1000000)} km / 300 000 km/s = ${f(p.body.d * 1000000 / 300000)} s`]
      }
    },
    {
      id: 'speed-in-glass', level: 2,
      params: R => ({ mat: R.pick([
        { en: 'glass', gen: 'stakla', loc: 'staklu', n: 1.5 },
        { en: 'plexiglass', gen: 'pleksiglasa', loc: 'pleksiglasu', n: 1.5 },
        { en: 'lead glass', gen: 'olovnog stakla', loc: 'olovnom staklu', n: 1.6 },
        { en: 'diamond', gen: 'dijamanta', loc: 'dijamantu', n: 2.4 }
      ]) }),
      text: {
        en: (p, f) => `The refractive index of ${p.mat.en} is n = ${f(p.mat.n)}. In this material light travels n times slower than in vacuum, where c = 300 000 km/s. What is the speed of light in ${p.mat.en}?`,
        hr: (p, f) => `Indeks loma ${p.mat.gen} iznosi n = ${f(p.mat.n)}. U toj tvari svjetlost putuje n puta sporije nego u vakuumu, gdje je c = 300 000 km/s. Kolika je brzina svjetlosti u ${p.mat.loc}?`
      },
      answer: p => 300000 / p.mat.n, unit: 'km/s',
      hint: { en: 'Divide the speed of light in vacuum by the refractive index: v = c / n.', hr: 'Brzinu svjetlosti u vakuumu podijeli indeksom loma: v = c / n.' },
      steps: {
        en: (p, f) => ['v = c / n', `v = 300 000 km/s / ${f(p.mat.n)}`, `v = ${f(300000 / p.mat.n)} km/s`],
        hr: (p, f) => ['v = c / n', `v = 300 000 km/s / ${f(p.mat.n)}`, `v = ${f(300000 / p.mat.n)} km/s`]
      }
    },
    {
      id: 'shadow-size', level: 2,
      params: R => { const d = R.pick([1, 2]); const k = R.pick([2, 3, 4]); return { d, D: d * k, k, h: R.pick([10, 15, 20, 25, 30]) }; },
      text: {
        en: (p, f) => `A small lamp is ${f(p.d)} m away from a cardboard figure ${f(p.h)} cm tall, and the wall behind the figure is ${f(p.D)} m from the lamp. Light travels in straight lines, so the shadow is enlarged in the same ratio as the distances: shadow height = h · D / d. How tall is the shadow of the figure on the wall?`,
        hr: (p, f) => `Mala žarulja udaljena je ${f(p.d)} m od kartonske figure visoke ${f(p.h)} cm, a zid iza figure udaljen je od žarulje ${f(p.D)} m. Svjetlost se širi pravocrtno, pa se sjena uveća u istom omjeru kao i udaljenosti: visina sjene = h · D / d. Kolika je visina sjene figure na zidu?`
      },
      answer: p => p.h * p.k, unit: 'cm',
      hint: { en: 'Find how many times farther the wall is than the figure; the shadow is that many times taller.', hr: 'Izračunaj koliko je puta zid dalje od figure; sjena je toliko puta viša.' },
      steps: {
        en: (p, f) => [`Distance ratio: D / d = ${f(p.D)} m / ${f(p.d)} m = ${f(p.k)}`, `Shadow height = ${f(p.k)} · ${f(p.h)} cm = ${f(p.h * p.k)} cm`],
        hr: (p, f) => [`Omjer udaljenosti: D / d = ${f(p.D)} m / ${f(p.d)} m = ${f(p.k)}`, `Visina sjene = ${f(p.k)} · ${f(p.h)} cm = ${f(p.h * p.k)} cm`]
      }
    },
    {
      id: 'light-around-earth', level: 3,
      params: R => ({ t: R.pick([1, 2, 3, 4, 5, 6, 8, 10]) }),
      text: {
        en: (p, f) => `Light travels at 300 000 km/s. The circumference of the Earth is about 40 000 km. How many times could a beam of light go around the Earth in ${f(p.t)} s?`,
        hr: (p, f) => `Svjetlost putuje brzinom 300 000 km/s. Opseg Zemlje iznosi oko 40 000 km. Koliko bi puta zraka svjetlosti mogla obići Zemlju za ${f(p.t)} s?`
      },
      answer: p => 300000 * p.t / 40000, unit: { en: 'times', hr: 'puta' },
      hint: { en: 'First find how far light travels in that time, then divide by the circumference of the Earth.', hr: 'Najprije izračunaj koliki put svjetlost prijeđe u tom vremenu, zatim ga podijeli opsegom Zemlje.' },
      steps: {
        en: (p, f) => [`Distance in ${f(p.t)} s: 300 000 km/s · ${f(p.t)} s = ${f(300000 * p.t)} km`, `Number of circuits: ${f(300000 * p.t)} km / 40 000 km = ${f(300000 * p.t / 40000)}`],
        hr: (p, f) => [`Put za ${f(p.t)} s: 300 000 km/s · ${f(p.t)} s = ${f(300000 * p.t)} km`, `Broj obilazaka: ${f(300000 * p.t)} km / 40 000 km = ${f(300000 * p.t / 40000)}`]
      }
    },
    {
      id: 'projector-image', level: 3,
      params: R => ({ h: R.pick([2, 3, 4, 5]), m: R.pick([20, 25, 30, 40, 50]) }),
      text: {
        en: (p, f) => `A slide ${f(p.h)} cm tall is projected onto a wall with a magnification of m = ${f(p.m)}. Magnification is the image height divided by the object height (m = H / h). How tall is the image on the wall, in metres?`,
        hr: (p, f) => `Dijapozitiv visok ${f(p.h)} cm projiciramo na zid uz povećanje m = ${f(p.m)}. Povećanje je omjer visine slike i visine predmeta (m = H / h). Kolika je visina slike na zidu, u metrima?`
      },
      answer: p => p.h * p.m / 100, unit: 'm',
      hint: { en: 'Image height = magnification × object height; then turn centimetres into metres.', hr: 'Visina slike = povećanje × visina predmeta; zatim centimetre pretvori u metre.' },
      steps: {
        en: (p, f) => ['m = H / h  →  H = m · h', `H = ${f(p.m)} · ${f(p.h)} cm = ${f(p.h * p.m)} cm`, `H = ${f(p.h * p.m)} cm / 100 = ${f(p.h * p.m / 100)} m`],
        hr: (p, f) => ['m = H / h  →  H = m · h', `H = ${f(p.m)} · ${f(p.h)} cm = ${f(p.h * p.m)} cm`, `H = ${f(p.h * p.m)} cm / 100 = ${f(p.h * p.m / 100)} m`]
      }
    }
  ]);
})();
