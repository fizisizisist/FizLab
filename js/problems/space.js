/* FizLab practice problems: Earth and space / Zemlja i svemir */
(function () {
  'use strict';
  window.Content.registerProblems('space', [
    {
      id: 'rotation-degrees', level: 1,
      params: R => ({ h: R.int(5, 20) }),
      text: {
        en: (p, f) => `The Earth turns once around its axis (360°) in 24 hours. Through how many degrees does it turn in ${f(p.h)} hours?`,
        hr: (p, f) => `Zemlja se oko svoje osi okrene jednom (za 360°) u 24 sata. Za koliko se stupnjeva okrene u ${f(p.h)} sati?`
      },
      answer: p => 15 * p.h, unit: '°',
      hint: { en: 'First find how many degrees the Earth turns in one hour.', hr: 'Najprije izračunaj za koliko se stupnjeva Zemlja okrene u jednom satu.' },
      steps: {
        en: (p, f) => ['In 1 hour: 360° / 24 = 15°', `In ${f(p.h)} hours: 15° · ${f(p.h)} = ${f(15 * p.h)}°`],
        hr: (p, f) => ['U 1 satu: 360° / 24 = 15°', `U ${f(p.h)} sati: 15° · ${f(p.h)} = ${f(15 * p.h)}°`]
      }
    },
    {
      id: 'time-zones', level: 1,
      params: R => { const k = R.int(2, 11); return { k, deg: 15 * k }; },
      text: {
        en: (p, f) => `Two cities differ in longitude by ${f(p.deg)}°. The Earth turns through 15° every hour (360° in 24 h). By how many hours do their local times differ?`,
        hr: (p, f) => `Dva grada razlikuju se u geografskoj dužini za ${f(p.deg)}°. Zemlja se okrene za 15° svakoga sata (360° u 24 h). Za koliko se sati razlikuje njihovo mjesno vrijeme?`
      },
      answer: p => p.k, unit: 'h',
      hint: { en: 'Divide the difference in degrees by 15° per hour.', hr: 'Razliku u stupnjevima podijeli s 15° po satu.' },
      steps: {
        en: (p, f) => ['Hours = degrees / 15', `${f(p.deg)}° / 15° per hour = ${f(p.k)} h`],
        hr: (p, f) => ['Sati = stupnjevi / 15', `${f(p.deg)}° / 15° po satu = ${f(p.k)} h`]
      }
    },
    {
      id: 'weight-on-planet', level: 1,
      params: R => ({ m: R.pick([40, 50, 60, 70, 80, 90]), pl: R.pick([
        { en: 'Mars', loc: 'Marsu', g: 3.7 },
        { en: 'the Moon', loc: 'Mjesecu', g: 1.6 },
        { en: 'Jupiter', loc: 'Jupiteru', g: 25 },
        { en: 'Venus', loc: 'Veneri', g: 9 }
      ]) }),
      text: {
        en: (p, f) => `On ${p.pl.en} the gravitational acceleration is g = ${f(p.pl.g)} N/kg. What is the weight of an astronaut with a mass of ${f(p.m)} kg there? (G = m · g)`,
        hr: (p, f) => `Na ${p.pl.loc} je g = ${f(p.pl.g)} N/kg. Kolika je ondje težina astronauta mase ${f(p.m)} kg? (G = m · g)`
      },
      answer: p => p.m * p.pl.g, unit: 'N',
      hint: { en: 'Weight = mass × g; the mass is the same everywhere, only g changes.', hr: 'Težina = masa × g; masa je svugdje ista, mijenja se samo g.' },
      steps: {
        en: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · ${f(p.pl.g)} N/kg`, `G = ${f(p.m * p.pl.g)} N`],
        hr: (p, f) => ['G = m · g', `G = ${f(p.m)} kg · ${f(p.pl.g)} N/kg`, `G = ${f(p.m * p.pl.g)} N`]
      }
    },
    {
      id: 'leap-year-days', level: 2,
      params: R => ({ n: R.pick([8, 12, 16, 20, 40, 100]) }),
      text: {
        en: (p, f) => `The Earth takes ${f(365.25)} days to go once around the Sun, which is why every fourth year is a leap year. How many days are there in ${f(p.n)} years?`,
        hr: (p, f) => `Zemlja obiđe Sunce jednom za ${f(365.25)} dana, pa je zato svaka četvrta godina prijestupna. Koliko dana ima ${f(p.n)} godina?`
      },
      answer: p => 365.25 * p.n, unit: { en: 'days', hr: 'dana' },
      hint: { en: 'Every 4 years make exactly 1461 days (3 × 365 + 366).', hr: 'Svake 4 godine imaju točno 1461 dan (3 × 365 + 366).' },
      steps: {
        en: (p, f) => [`4 years = 4 · ${f(365.25)} = 1461 days`, `${f(p.n)} years = ${f(p.n / 4)} · 1461 days = ${f(365.25 * p.n)} days`],
        hr: (p, f) => [`4 godine = 4 · ${f(365.25)} = 1461 dan`, `${f(p.n)} godina = ${f(p.n / 4)} · 1461 dana = ${f(365.25 * p.n)} dana`]
      }
    },
    {
      id: 'moon-cycles', level: 2,
      params: R => ({ d: R.pick([100, 200, 365, 366, 500, 730, 1000]) }),
      text: {
        en: (p, f) => `The phases of the Moon repeat every ${f(29.5)} days (from one full moon to the next). About how many times does the cycle of phases repeat in ${f(p.d)} days?`,
        hr: (p, f) => `Mjesečeve mijene ponavljaju se svakih ${f(29.5)} dana (od jednog punog Mjeseca do sljedećeg). Koliko se puta otprilike ciklus mijena ponovi u ${f(p.d)} dana?`
      },
      answer: p => p.d / 29.5, unit: { en: 'times', hr: 'puta' }, abs: 0.5,
      hint: { en: 'Divide the number of days by the length of one cycle.', hr: 'Broj dana podijeli trajanjem jednog ciklusa.' },
      steps: {
        en: (p, f) => ['Number of cycles = days / length of one cycle', `${f(p.d)} days / ${f(29.5)} days = ${f(p.d / 29.5)}`, `The cycle repeats about ${f(p.d / 29.5, 1)} times.`],
        hr: (p, f) => ['Broj ciklusa = dani / trajanje jednog ciklusa', `${f(p.d)} dana / ${f(29.5)} dana = ${f(p.d / 29.5)}`, `Ciklus se ponovi oko ${f(p.d / 29.5, 1)} puta.`]
      }
    },
    {
      id: 'light-minutes', level: 2,
      params: R => ({ body: R.pick([
        { en: 'the Sun', gen: 'Sunca', d: 150 },
        { en: 'Mercury', gen: 'Merkura', d: 90 },
        { en: 'Venus', gen: 'Venere', d: 45 },
        { en: 'Mars', gen: 'Marsa', d: 75 },
        { en: 'Jupiter', gen: 'Jupitera', d: 600 },
        { en: 'Saturn', gen: 'Saturna', d: 1200 }
      ]) }),
      text: {
        en: (p, f) => `The distance from Earth to ${p.body.en} is about ${f(p.body.d)} million km. Light travels at c = 300 000 km/s. How many minutes does light take to get from ${p.body.en} to Earth?`,
        hr: (p, f) => `Udaljenost od Zemlje do ${p.body.gen} iznosi oko ${f(p.body.d)} milijuna km. Svjetlost putuje brzinom c = 300 000 km/s. Koliko minuta svjetlost putuje od ${p.body.gen} do Zemlje?`
      },
      answer: p => p.body.d * 1000000 / 300000 / 60, unit: 'min', abs: 0.1,
      hint: { en: 'First find the time in seconds (t = d / c), then divide by 60.', hr: 'Najprije izračunaj vrijeme u sekundama (t = d / c), zatim podijeli sa 60.' },
      steps: {
        en: (p, f) => [`t = d / c = ${f(p.body.d * 1000000)} km / 300 000 km/s = ${f(p.body.d * 1000000 / 300000)} s`, `In minutes: ${f(p.body.d * 1000000 / 300000)} s / 60 = ${f(p.body.d * 1000000 / 300000 / 60)} min`],
        hr: (p, f) => [`t = d / c = ${f(p.body.d * 1000000)} km / 300 000 km/s = ${f(p.body.d * 1000000 / 300000)} s`, `U minutama: ${f(p.body.d * 1000000 / 300000)} s / 60 = ${f(p.body.d * 1000000 / 300000 / 60)} min`]
      }
    },
    {
      id: 'mars-day', level: 2,
      params: R => ({ n: R.pick([5, 6, 8, 10, 12, 15, 20, 30]) }),
      text: {
        en: (p, f) => `A day on Mars (a sol) lasts ${f(24.6)} hours, a day on Earth 24 hours. A rover works on Mars for ${f(p.n)} Martian days. How many minutes longer is that than ${f(p.n)} Earth days?`,
        hr: (p, f) => `Dan na Marsu (sol) traje ${f(24.6)} sata, a dan na Zemlji 24 sata. Rover radi na Marsu ${f(p.n)} marsovskih dana. Koliko je to minuta dulje od ${f(p.n)} Zemljinih dana?`
      },
      answer: p => 36 * p.n, unit: 'min',
      hint: { en: 'Find how much longer one sol is (in hours), turn it into minutes, then multiply by the number of days.', hr: 'Izračunaj koliko je jedan sol dulji (u satima), pretvori u minute, pa pomnoži brojem dana.' },
      steps: {
        en: (p, f) => [`One sol is longer by ${f(24.6)} h − 24 h = ${f(0.6)} h`, `${f(0.6)} h = ${f(0.6)} · 60 min = 36 min`, `${f(p.n)} sols: ${f(p.n)} · 36 min = ${f(36 * p.n)} min`],
        hr: (p, f) => [`Jedan sol dulji je za ${f(24.6)} h − 24 h = ${f(0.6)} h`, `${f(0.6)} h = ${f(0.6)} · 60 min = 36 min`, `${f(p.n)} marsovskih dana: ${f(p.n)} · 36 min = ${f(36 * p.n)} min`]
      }
    },
    {
      id: 'orbital-speed', level: 3,
      params: R => ({ sat: R.pick([
        { en: 'The Moon', hr: 'Mjesec', r: 384000, T: 655.2, days: 27.3 },
        { en: 'The International Space Station (ISS)', hr: 'Međunarodna svemirska postaja (ISS)', r: 6800, T: 1.5 },
        { en: 'A GPS satellite', hr: 'GPS satelit', r: 26600, T: 12 },
        { en: 'A geostationary TV satellite', hr: 'Geostacionarni TV satelit', r: 42000, T: 24 }
      ]) }),
      text: {
        en: (p, f) => `${p.sat.en} circles the Earth on a nearly circular path of radius ${f(p.sat.r)} km (measured from the centre of the Earth) and completes one orbit in ${f(p.sat.T)} h${p.sat.days ? ' (' + f(p.sat.days) + ' days)' : ''}. What is its speed in km/h? The length of the path is 2 · π · r; use π ≈ ${f(3.14)}.`,
        hr: (p, f) => `${p.sat.hr} kruži oko Zemlje po gotovo kružnoj putanji polumjera ${f(p.sat.r)} km (mjereno od središta Zemlje) i jedan obilazak traje ${f(p.sat.T)} h${p.sat.days ? ' (' + f(p.sat.days) + ' dana)' : ''}. Kolika je brzina u km/h? Duljina putanje je 2 · π · r; uzmi π ≈ ${f(3.14)}.`
      },
      answer: p => 2 * 3.14 * p.sat.r / p.sat.T, unit: 'km/h', tol: 0.05,
      hint: { en: 'First find the length of one orbit (2 · π · r), then speed = path / time.', hr: 'Najprije izračunaj duljinu jednog obilaska (2 · π · r), zatim brzina = put / vrijeme.' },
      steps: {
        en: (p, f) => [`Length of the path: s = 2 · ${f(3.14)} · ${f(p.sat.r)} km = ${f(2 * 3.14 * p.sat.r)} km`, 'v = s / t', `v = ${f(2 * 3.14 * p.sat.r)} km / ${f(p.sat.T)} h = ${f(2 * 3.14 * p.sat.r / p.sat.T)} km/h`],
        hr: (p, f) => [`Duljina putanje: s = 2 · ${f(3.14)} · ${f(p.sat.r)} km = ${f(2 * 3.14 * p.sat.r)} km`, 'v = s / t', `v = ${f(2 * 3.14 * p.sat.r)} km / ${f(p.sat.T)} h = ${f(2 * 3.14 * p.sat.r / p.sat.T)} km/h`]
      }
    },
    {
      id: 'scale-model', level: 3,
      params: R => ({ D: R.pick([50, 100, 109, 150, 200, 218]) }),
      text: {
        en: (p, f) => `In a scale model of the Solar System the Sun is a ball ${f(p.D)} cm across. The diameter of the Sun is 109 times the diameter of the Earth. How big (in mm) should the diameter of the model Earth be?`,
        hr: (p, f) => `U modelu Sunčeva sustava Sunce je kugla promjera ${f(p.D)} cm. Promjer Sunca je 109 puta veći od promjera Zemlje. Koliki (u mm) treba biti promjer modela Zemlje?`
      },
      answer: p => p.D * 10 / 109, unit: 'mm', abs: 0.2,
      hint: { en: 'Turn the Sun\'s diameter into millimetres, then divide by 109.', hr: 'Promjer Sunca pretvori u milimetre, zatim podijeli sa 109.' },
      steps: {
        en: (p, f) => [`Sun in the model: ${f(p.D)} cm = ${f(p.D * 10)} mm`, 'Earth is 109 times smaller: d = D / 109', `d = ${f(p.D * 10)} mm / 109 = ${f(p.D * 10 / 109)} mm`],
        hr: (p, f) => [`Sunce u modelu: ${f(p.D)} cm = ${f(p.D * 10)} mm`, 'Zemlja je 109 puta manja: d = D / 109', `d = ${f(p.D * 10)} mm / 109 = ${f(p.D * 10 / 109)} mm`]
      }
    }
  ]);
})();
