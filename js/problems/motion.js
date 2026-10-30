/* FizLab practice problems: Motion / Gibanje */
(function () {
  'use strict';
  window.Content.registerProblems('motion', [
    {
      id: 'speed-ms', level: 1,
      params: R => { const v = R.step(4, 12, 0.5); const t = R.pick([10, 20, 30, 40, 50, 60]); return { s: v * t, t }; },
      text: {
        en: (p, f) => `A cyclist covers ${f(p.s)} m in ${f(p.t)} s. What is the cyclist's speed in m/s?`,
        hr: (p, f) => `Biciklist prijeđe ${f(p.s)} m za ${f(p.t)} s. Kolika je brzina biciklista u m/s?`
      },
      answer: p => p.s / p.t, unit: 'm/s',
      hint: { en: 'Speed = distance divided by time.', hr: 'Brzina = put podijeljen vremenom.' },
      steps: {
        en: (p, f) => ['v = s / t', `v = ${f(p.s)} m / ${f(p.t)} s`, `v = ${f(p.s / p.t)} m/s`],
        hr: (p, f) => ['v = s / t', `v = ${f(p.s)} m / ${f(p.t)} s`, `v = ${f(p.s / p.t)} m/s`]
      }
    },
    {
      id: 'distance-kmh', level: 1,
      params: R => ({ v: R.step(40, 120, 10), t: R.step(0.5, 4, 0.5) }),
      text: {
        en: (p, f) => `A car drives at a steady speed of ${f(p.v)} km/h for ${f(p.t)} h. What distance does it cover?`,
        hr: (p, f) => `Automobil vozi stalnom brzinom ${f(p.v)} km/h tijekom ${f(p.t)} h. Koliki put prijeđe?`
      },
      answer: p => p.v * p.t, unit: 'km',
      hint: { en: 'Distance = speed × time.', hr: 'Put = brzina × vrijeme.' },
      steps: {
        en: (p, f) => ['s = v · t', `s = ${f(p.v)} km/h · ${f(p.t)} h`, `s = ${f(p.v * p.t)} km`],
        hr: (p, f) => ['s = v · t', `s = ${f(p.v)} km/h · ${f(p.t)} h`, `s = ${f(p.v * p.t)} km`]
      }
    },
    {
      id: 'speed-after-accel', level: 1,
      params: R => ({ a: R.step(0.5, 4, 0.5), t: R.int(2, 12) }),
      text: {
        en: (p, f) => `A motorbike starts from rest and accelerates at ${f(p.a)} m/s² for ${f(p.t)} s. What speed does it reach? (v = a · t)`,
        hr: (p, f) => `Motocikl kreće iz mirovanja i ubrzava ubrzanjem ${f(p.a)} m/s² tijekom ${f(p.t)} s. Koliku brzinu postigne? (v = a · t)`
      },
      answer: p => p.a * p.t, unit: 'm/s',
      hint: { en: 'Every second the speed grows by a; multiply the acceleration by the time.', hr: 'Svake sekunde brzina se poveća za a; pomnoži ubrzanje vremenom.' },
      steps: {
        en: (p, f) => ['v = a · t', `v = ${f(p.a)} m/s² · ${f(p.t)} s`, `v = ${f(p.a * p.t)} m/s`],
        hr: (p, f) => ['v = a · t', `v = ${f(p.a)} m/s² · ${f(p.t)} s`, `v = ${f(p.a * p.t)} m/s`]
      }
    },
    {
      id: 'time-from-s-v', level: 2,
      params: R => { const v = R.pick([40, 50, 60, 80, 90, 100, 120]); const t = R.step(0.5, 5, 0.5); return { v, s: v * t }; },
      text: {
        en: (p, f) => `A bus has to cover ${f(p.s)} km at an average speed of ${f(p.v)} km/h. How many hours does the trip take?`,
        hr: (p, f) => `Autobus treba prijeći ${f(p.s)} km srednjom brzinom ${f(p.v)} km/h. Koliko sati traje putovanje?`
      },
      answer: p => p.s / p.v, unit: 'h',
      hint: { en: 'Rearrange v = s / t into t = s / v.', hr: 'Iz v = s / t slijedi t = s / v.' },
      steps: {
        en: (p, f) => ['v = s / t  →  t = s / v', `t = ${f(p.s)} km / ${f(p.v)} km/h`, `t = ${f(p.s / p.v)} h`],
        hr: (p, f) => ['v = s / t  →  t = s / v', `t = ${f(p.s)} km / ${f(p.v)} km/h`, `t = ${f(p.s / p.v)} h`]
      }
    },
    {
      id: 'kmh-to-ms', level: 2,
      params: R => ({ v: R.pick([18, 36, 54, 72, 90, 108, 126, 144]) }),
      text: {
        en: (p, f) => `A car is moving at ${f(p.v)} km/h. Express this speed in m/s. (1 km = 1000 m and 1 h = 3600 s, so divide km/h by ${f(3.6)})`,
        hr: (p, f) => `Automobil se giba brzinom ${f(p.v)} km/h. Izrazi tu brzinu u m/s. (1 km = 1000 m, a 1 h = 3600 s, pa km/h podijeli s ${f(3.6)})`
      },
      answer: p => p.v / 3.6, unit: 'm/s',
      hint: { en: 'From km/h to m/s: divide by 3.6.', hr: 'Iz km/h u m/s: podijeli s 3,6.' },
      steps: {
        en: (p, f) => [`${f(p.v)} km/h = ${f(p.v)} · 1000 m / 3600 s`, `v = ${f(p.v)} / ${f(3.6)} m/s`, `v = ${f(p.v / 3.6)} m/s`],
        hr: (p, f) => [`${f(p.v)} km/h = ${f(p.v)} · 1000 m / 3600 s`, `v = ${f(p.v)} / ${f(3.6)} m/s`, `v = ${f(p.v / 3.6)} m/s`]
      }
    },
    {
      id: 'train-minutes', level: 2,
      params: R => ({ v: R.pick([36, 48, 60, 72, 84, 90, 96, 108, 120]), t: R.pick([10, 15, 20, 30, 40, 45]) }),
      text: {
        en: (p, f) => `A train travels at ${f(p.v)} km/h for ${f(p.t)} minutes. How many kilometres does it cover? (1 h = 60 min)`,
        hr: (p, f) => `Vlak vozi brzinom ${f(p.v)} km/h tijekom ${f(p.t)} minuta. Koliko kilometara prijeđe? (1 h = 60 min)`
      },
      answer: p => p.v * p.t / 60, unit: 'km',
      hint: { en: 'Write the time in hours (minutes / 60), then s = v · t.', hr: 'Zapiši vrijeme u satima (minute / 60), zatim s = v · t.' },
      steps: {
        en: (p, f) => [`t = ${f(p.t)} min = ${f(p.t)}/60 h`, `s = v · t = ${f(p.v)} km/h · ${f(p.t)}/60 h`, `s = ${f(p.v * p.t)} / 60 km = ${f(p.v * p.t / 60)} km`],
        hr: (p, f) => [`t = ${f(p.t)} min = ${f(p.t)}/60 h`, `s = v · t = ${f(p.v)} km/h · ${f(p.t)}/60 h`, `s = ${f(p.v * p.t)} / 60 km = ${f(p.v * p.t / 60)} km`]
      }
    },
    {
      id: 'acceleration', level: 2,
      params: R => { const v1 = R.step(5, 20, 5); const a = R.step(0.5, 3, 0.5); const t = R.int(2, 10); return { v1, v2: v1 + a * t, t }; },
      text: {
        en: (p, f) => `A car speeds up from ${f(p.v1)} m/s to ${f(p.v2)} m/s in ${f(p.t)} s. What is its acceleration? (a = Δv / t)`,
        hr: (p, f) => `Automobil ubrza s ${f(p.v1)} m/s na ${f(p.v2)} m/s za ${f(p.t)} s. Koliko je njegovo ubrzanje? (a = Δv / t)`
      },
      answer: p => (p.v2 - p.v1) / p.t, unit: 'm/s²',
      hint: { en: 'First the change of speed Δv = v₂ − v₁, then divide by the time.', hr: 'Najprije promjena brzine Δv = v₂ − v₁, zatim podijeli vremenom.' },
      steps: {
        en: (p, f) => [`Δv = ${f(p.v2)} m/s − ${f(p.v1)} m/s = ${f(p.v2 - p.v1)} m/s`, `a = Δv / t = ${f(p.v2 - p.v1)} m/s / ${f(p.t)} s`, `a = ${f((p.v2 - p.v1) / p.t)} m/s²`],
        hr: (p, f) => [`Δv = ${f(p.v2)} m/s − ${f(p.v1)} m/s = ${f(p.v2 - p.v1)} m/s`, `a = Δv / t = ${f(p.v2 - p.v1)} m/s / ${f(p.t)} s`, `a = ${f((p.v2 - p.v1) / p.t)} m/s²`]
      }
    },
    {
      id: 'average-two-legs', level: 3,
      params: R => { const T = R.pick([2, 4, 5]); const t1 = R.int(1, T - 1); return { s1: R.step(40, 200, 10), t1, s2: R.step(40, 200, 10), t2: T - t1 }; },
      text: {
        en: (p, f) => `A car covers ${f(p.s1)} km in ${f(p.t1)} h and then another ${f(p.s2)} km in ${f(p.t2)} h. What is the average speed of the car for the whole trip?`,
        hr: (p, f) => `Automobil prijeđe ${f(p.s1)} km za ${f(p.t1)} h, a zatim još ${f(p.s2)} km za ${f(p.t2)} h. Kolika je srednja brzina automobila na cijelom putu?`
      },
      answer: p => (p.s1 + p.s2) / (p.t1 + p.t2), unit: 'km/h',
      hint: { en: 'Average speed = total distance / total time (not the average of the two speeds).', hr: 'Srednja brzina = ukupni put / ukupno vrijeme (a ne prosjek dviju brzina).' },
      steps: {
        en: (p, f) => [`Total distance: ${f(p.s1)} km + ${f(p.s2)} km = ${f(p.s1 + p.s2)} km`, `Total time: ${f(p.t1)} h + ${f(p.t2)} h = ${f(p.t1 + p.t2)} h`, `v = ${f(p.s1 + p.s2)} km / ${f(p.t1 + p.t2)} h = ${f((p.s1 + p.s2) / (p.t1 + p.t2))} km/h`],
        hr: (p, f) => [`Ukupni put: ${f(p.s1)} km + ${f(p.s2)} km = ${f(p.s1 + p.s2)} km`, `Ukupno vrijeme: ${f(p.t1)} h + ${f(p.t2)} h = ${f(p.t1 + p.t2)} h`, `v = ${f(p.s1 + p.s2)} km / ${f(p.t1 + p.t2)} h = ${f((p.s1 + p.s2) / (p.t1 + p.t2))} km/h`]
      }
    },
    {
      id: 'reaction-distance', level: 3,
      params: R => { const vms = R.pick([10, 15, 20, 25, 30]); return { vms, vkmh: vms * 3.6, t: R.pick([0.5, 0.8, 1, 1.2, 1.5]) }; },
      text: {
        en: (p, f) => `A driver notices an obstacle. The reaction time is ${f(p.t)} s and the car is moving at ${f(p.vkmh)} km/h. How far does the car travel during the reaction time? (1 m/s = ${f(3.6)} km/h)`,
        hr: (p, f) => `Vozač primijeti prepreku. Vrijeme reakcije je ${f(p.t)} s, a automobil vozi brzinom ${f(p.vkmh)} km/h. Koliki put automobil prijeđe za vrijeme reakcije? (1 m/s = ${f(3.6)} km/h)`
      },
      answer: p => p.vms * p.t, unit: 'm',
      hint: { en: 'Convert the speed to m/s (divide by 3.6), then s = v · t.', hr: 'Pretvori brzinu u m/s (podijeli s 3,6), zatim s = v · t.' },
      steps: {
        en: (p, f) => [`v = ${f(p.vkmh)} km/h = ${f(p.vkmh)} / ${f(3.6)} m/s = ${f(p.vms)} m/s`, `s = v · t = ${f(p.vms)} m/s · ${f(p.t)} s`, `s = ${f(p.vms * p.t)} m`],
        hr: (p, f) => [`v = ${f(p.vkmh)} km/h = ${f(p.vkmh)} / ${f(3.6)} m/s = ${f(p.vms)} m/s`, `s = v · t = ${f(p.vms)} m/s · ${f(p.t)} s`, `s = ${f(p.vms * p.t)} m`]
      }
    }
  ]);
})();
