/* FizLab practice problems: Heat and Temperature / Toplina i temperatura */
(function () {
  'use strict';
  window.Content.registerProblems('heat', [
    {
      id: 'temperature-change', level: 1,
      params: R => { const T1 = R.int(5, 40); return { T1, T2: R.int(T1 + 10, 100) }; },
      text: {
        en: (p, f) => `Water in a pot is heated from ${f(p.T1)} °C to ${f(p.T2)} °C. By how many degrees did its temperature change?`,
        hr: (p, f) => `Voda u posudi zagrijava se od ${f(p.T1)} °C do ${f(p.T2)} °C. Za koliko se stupnjeva promijenila njezina temperatura?`
      },
      answer: p => p.T2 - p.T1, unit: '°C',
      hint: { en: 'ΔT = final temperature − initial temperature.', hr: 'ΔT = konačna temperatura − početna temperatura.' },
      steps: {
        en: (p, f) => ['ΔT = T₂ − T₁', `ΔT = ${f(p.T2)} °C − ${f(p.T1)} °C`, `ΔT = ${f(p.T2 - p.T1)} °C`],
        hr: (p, f) => ['ΔT = T₂ − T₁', `ΔT = ${f(p.T2)} °C − ${f(p.T1)} °C`, `ΔT = ${f(p.T2 - p.T1)} °C`]
      }
    },
    {
      id: 'celsius-to-kelvin', level: 1,
      params: R => ({ t: R.int(0, 100) }),
      text: {
        en: (p, f) => `A liquid in the school lab has a temperature of ${f(p.t)} °C. What is that in kelvins? (T(K) = t(°C) + 273)`,
        hr: (p, f) => `Tekućina u školskom laboratoriju ima temperaturu ${f(p.t)} °C. Koliko je to u kelvinima? (T(K) = t(°C) + 273)`
      },
      answer: p => p.t + 273, unit: 'K',
      hint: { en: 'Add 273 to the Celsius temperature.', hr: 'Celzijevim stupnjevima dodaj 273.' },
      steps: {
        en: (p, f) => ['T(K) = t(°C) + 273', `T = ${f(p.t)} + 273`, `T = ${f(p.t + 273)} K`],
        hr: (p, f) => ['T(K) = t(°C) + 273', `T = ${f(p.t)} + 273`, `T = ${f(p.t + 273)} K`]
      }
    },
    {
      id: 'heat-water', level: 1,
      params: R => ({ m: R.pick([0.5, 1, 1.5, 2, 3, 4, 5]), dT: R.step(10, 80, 10) }),
      text: {
        en: (p, f) => `How much heat is needed to warm ${f(p.m)} kg of water by ${f(p.dT)} °C? The specific heat capacity of water is c = 4200 J/(kg·°C).`,
        hr: (p, f) => `Koliko je topline potrebno da se ${f(p.m)} kg vode ugrije za ${f(p.dT)} °C? Specifični toplinski kapacitet vode je c = 4200 J/(kg·°C).`
      },
      answer: p => p.m * 4200 * p.dT, unit: 'J',
      hint: { en: 'Q = m · c · ΔT.', hr: 'Q = m · c · ΔT.' },
      steps: {
        en: (p, f) => ['Q = m · c · ΔT', `Q = ${f(p.m)} kg · 4200 J/(kg·°C) · ${f(p.dT)} °C`, `Q = ${f(p.m * 4200 * p.dT)} J`],
        hr: (p, f) => ['Q = m · c · ΔT', `Q = ${f(p.m)} kg · 4200 J/(kg·°C) · ${f(p.dT)} °C`, `Q = ${f(p.m * 4200 * p.dT)} J`]
      }
    },
    {
      id: 'heat-metal-mass', level: 2,
      params: R => { const metal = R.pick([{ en: 'iron', hrg: 'željeza', c: 450 }, { en: 'aluminium', hrg: 'aluminija', c: 900 }]); const m = R.pick([0.5, 1, 2, 3, 4, 5]); const dT = R.step(10, 100, 10); return { metal, dT, Q: metal.c * m * dT }; },
      text: {
        en: (p, f) => `A piece of ${p.metal.en} receives ${f(p.Q)} J of heat and its temperature rises by ${f(p.dT)} °C. What is the mass of the piece? The specific heat capacity of ${p.metal.en} is ${f(p.metal.c)} J/(kg·°C).`,
        hr: (p, f) => `Komad ${p.metal.hrg} primi ${f(p.Q)} J topline i temperatura mu se povisi za ${f(p.dT)} °C. Kolika je masa tog komada? Specifični toplinski kapacitet ${p.metal.hrg} je ${f(p.metal.c)} J/(kg·°C).`
      },
      answer: p => p.Q / (p.metal.c * p.dT), unit: 'kg',
      hint: { en: 'Rearrange Q = m · c · ΔT into m = Q / (c · ΔT).', hr: 'Iz Q = m · c · ΔT slijedi m = Q / (c · ΔT).' },
      steps: {
        en: (p, f) => ['Q = m · c · ΔT  →  m = Q / (c · ΔT)', `m = ${f(p.Q)} J / (${f(p.metal.c)} J/(kg·°C) · ${f(p.dT)} °C)`, `m = ${f(p.Q)} J / ${f(p.metal.c * p.dT)} J/kg = ${f(p.Q / (p.metal.c * p.dT))} kg`],
        hr: (p, f) => ['Q = m · c · ΔT  →  m = Q / (c · ΔT)', `m = ${f(p.Q)} J / (${f(p.metal.c)} J/(kg·°C) · ${f(p.dT)} °C)`, `m = ${f(p.Q)} J / ${f(p.metal.c * p.dT)} J/kg = ${f(p.Q / (p.metal.c * p.dT))} kg`]
      }
    },
    {
      id: 'temperature-rise', level: 2,
      params: R => { const sub = R.pick([{ en: 'water', hr: 'Voda', hrg: 'vode', c: 4200 }, { en: 'iron', hr: 'Željezo', hrg: 'željeza', c: 450 }, { en: 'aluminium', hr: 'Aluminij', hrg: 'aluminija', c: 900 }]); const m = R.pick([0.5, 1, 2, 4, 5]); const dT = R.int(2, 40); return { sub, m, Q: sub.c * m * dT }; },
      text: {
        en: (p, f) => `A mass of ${f(p.m)} kg of ${p.sub.en} receives ${f(p.Q)} J of heat. By how many degrees does its temperature rise? The specific heat capacity of ${p.sub.en} is ${f(p.sub.c)} J/(kg·°C).`,
        hr: (p, f) => `${p.sub.hr} mase ${f(p.m)} kg primi ${f(p.Q)} J topline. Za koliko se stupnjeva povisi temperatura? Specifični toplinski kapacitet ${p.sub.hrg} je ${f(p.sub.c)} J/(kg·°C).`
      },
      answer: p => p.Q / (p.m * p.sub.c), unit: '°C',
      hint: { en: 'Rearrange Q = m · c · ΔT into ΔT = Q / (m · c).', hr: 'Iz Q = m · c · ΔT slijedi ΔT = Q / (m · c).' },
      steps: {
        en: (p, f) => ['Q = m · c · ΔT  →  ΔT = Q / (m · c)', `ΔT = ${f(p.Q)} J / (${f(p.m)} kg · ${f(p.sub.c)} J/(kg·°C))`, `ΔT = ${f(p.Q)} J / ${f(p.m * p.sub.c)} J/°C = ${f(p.Q / (p.m * p.sub.c))} °C`],
        hr: (p, f) => ['Q = m · c · ΔT  →  ΔT = Q / (m · c)', `ΔT = ${f(p.Q)} J / (${f(p.m)} kg · ${f(p.sub.c)} J/(kg·°C))`, `ΔT = ${f(p.Q)} J / ${f(p.m * p.sub.c)} J/°C = ${f(p.Q / (p.m * p.sub.c))} °C`]
      }
    },
    {
      id: 'final-temperature', level: 2,
      params: R => { const m = R.pick([0.5, 1, 2, 3, 5]); const T1 = R.step(10, 30, 5); const dT = R.step(5, 60, 5); return { m, T1, Q: m * 4200 * dT }; },
      text: {
        en: (p, f) => `Water of mass ${f(p.m)} kg at ${f(p.T1)} °C receives ${f(p.Q)} J of heat. What is its final temperature? c(water) = 4200 J/(kg·°C).`,
        hr: (p, f) => `Voda mase ${f(p.m)} kg temperature ${f(p.T1)} °C primi ${f(p.Q)} J topline. Kolika je njezina konačna temperatura? c(vode) = 4200 J/(kg·°C).`
      },
      answer: p => p.T1 + p.Q / (p.m * 4200), unit: '°C',
      hint: { en: 'First the temperature rise ΔT = Q / (m · c), then T = T₁ + ΔT.', hr: 'Najprije povišenje temperature ΔT = Q / (m · c), zatim T = T₁ + ΔT.' },
      steps: {
        en: (p, f) => [`ΔT = Q / (m · c) = ${f(p.Q)} J / (${f(p.m)} kg · 4200 J/(kg·°C)) = ${f(p.Q / (p.m * 4200))} °C`, 'T = T₁ + ΔT', `T = ${f(p.T1)} °C + ${f(p.Q / (p.m * 4200))} °C = ${f(p.T1 + p.Q / (p.m * 4200))} °C`],
        hr: (p, f) => [`ΔT = Q / (m · c) = ${f(p.Q)} J / (${f(p.m)} kg · 4200 J/(kg·°C)) = ${f(p.Q / (p.m * 4200))} °C`, 'T = T₁ + ΔT', `T = ${f(p.T1)} °C + ${f(p.Q / (p.m * 4200))} °C = ${f(p.T1 + p.Q / (p.m * 4200))} °C`]
      }
    },
    {
      id: 'kettle-time', level: 3,
      params: R => ({ m: R.pick([0.5, 1, 1.5, 2]), T1: R.pick([10, 15, 20, 25, 30]), P: R.pick([1050, 1400, 2100]) }),
      text: {
        en: (p, f) => `A kettle of power ${f(p.P)} W heats ${f(p.m)} kg of water from ${f(p.T1)} °C to 100 °C. How long does it take if all the energy goes into the water? c(water) = 4200 J/(kg·°C).`,
        hr: (p, f) => `Kuhalo za vodu snage ${f(p.P)} W zagrijava ${f(p.m)} kg vode od ${f(p.T1)} °C do 100 °C. Koliko dugo to traje ako sva energija prelazi u vodu? c(vode) = 4200 J/(kg·°C).`
      },
      answer: p => p.m * 4200 * (100 - p.T1) / p.P, unit: 's',
      hint: { en: 'Find the heat Q = m · c · ΔT, then the time t = Q / P.', hr: 'Izračunaj toplinu Q = m · c · ΔT, zatim vrijeme t = Q / P.' },
      steps: {
        en: (p, f) => [`ΔT = 100 °C − ${f(p.T1)} °C = ${f(100 - p.T1)} °C`, `Q = m · c · ΔT = ${f(p.m)} kg · 4200 J/(kg·°C) · ${f(100 - p.T1)} °C = ${f(p.m * 4200 * (100 - p.T1))} J`, `t = Q / P = ${f(p.m * 4200 * (100 - p.T1))} J / ${f(p.P)} W = ${f(p.m * 4200 * (100 - p.T1) / p.P)} s (about ${f(p.m * 4200 * (100 - p.T1) / p.P / 60, 1)} min)`],
        hr: (p, f) => [`ΔT = 100 °C − ${f(p.T1)} °C = ${f(100 - p.T1)} °C`, `Q = m · c · ΔT = ${f(p.m)} kg · 4200 J/(kg·°C) · ${f(100 - p.T1)} °C = ${f(p.m * 4200 * (100 - p.T1))} J`, `t = Q / P = ${f(p.m * 4200 * (100 - p.T1))} J / ${f(p.P)} W = ${f(p.m * 4200 * (100 - p.T1) / p.P)} s (oko ${f(p.m * 4200 * (100 - p.T1) / p.P / 60, 1)} min)`]
      }
    },
    {
      id: 'mixing-water', level: 3,
      params: R => { const m1 = R.pick([1, 2, 3, 4]); const m2 = R.pick([1, 2, 3, 4]); const T1 = R.step(10, 30, 5); const k = R.int(2, 8); return { m1, m2, T1, T2: T1 + k * (m1 + m2) }; },
      text: {
        en: (p, f) => `In a bowl you mix ${f(p.m1)} kg of water at ${f(p.T1)} °C with ${f(p.m2)} kg of water at ${f(p.T2)} °C. What is the final temperature of the mixture? (The warm water gives off as much heat as the cold water receives; ignore losses.)`,
        hr: (p, f) => `U posudi pomiješaš ${f(p.m1)} kg vode temperature ${f(p.T1)} °C s ${f(p.m2)} kg vode temperature ${f(p.T2)} °C. Kolika je konačna temperatura smjese? (Topla voda preda jednako topline koliko hladna primi; zanemari gubitke.)`
      },
      answer: p => (p.m1 * p.T1 + p.m2 * p.T2) / (p.m1 + p.m2), unit: '°C',
      hint: { en: 'Heat given = heat received: m₂ · c · (T₂ − T) = m₁ · c · (T − T₁). The c cancels.', hr: 'Predana toplina = primljena toplina: m₂ · c · (T₂ − T) = m₁ · c · (T − T₁). c se pokrati.' },
      steps: {
        en: (p, f) => ['m₂ · (T₂ − T) = m₁ · (T − T₁)  →  T = (m₁ · T₁ + m₂ · T₂) / (m₁ + m₂)', `T = (${f(p.m1)} · ${f(p.T1)} + ${f(p.m2)} · ${f(p.T2)}) / (${f(p.m1)} + ${f(p.m2)})`, `T = ${f(p.m1 * p.T1 + p.m2 * p.T2)} / ${f(p.m1 + p.m2)} °C = ${f((p.m1 * p.T1 + p.m2 * p.T2) / (p.m1 + p.m2))} °C`],
        hr: (p, f) => ['m₂ · (T₂ − T) = m₁ · (T − T₁)  →  T = (m₁ · T₁ + m₂ · T₂) / (m₁ + m₂)', `T = (${f(p.m1)} · ${f(p.T1)} + ${f(p.m2)} · ${f(p.T2)}) / (${f(p.m1)} + ${f(p.m2)})`, `T = ${f(p.m1 * p.T1 + p.m2 * p.T2)} / ${f(p.m1 + p.m2)} °C = ${f((p.m1 * p.T1 + p.m2 * p.T2) / (p.m1 + p.m2))} °C`]
      }
    },
    {
      id: 'rail-expansion', level: 3,
      params: R => ({ mat: R.pick([{ en: 'A steel rail', hr: 'Čelična tračnica', alpha: 0.000012 }, { en: 'An aluminium rod', hr: 'Aluminijska šipka', alpha: 0.000024 }]), L: R.pick([10, 20, 25, 30, 40, 50]), dT: R.step(20, 60, 10) }),
      text: {
        en: (p, f) => `${p.mat.en} is ${f(p.L)} m long. On a hot day its temperature rises by ${f(p.dT)} °C. By how much does it get longer? Coefficient of thermal expansion α = ${f(p.mat.alpha, 6)} per °C (ΔL = α · L · ΔT). Give the answer in millimetres.`,
        hr: (p, f) => `${p.mat.hr} duga je ${f(p.L)} m. Vrućeg dana temperatura joj poraste za ${f(p.dT)} °C. Za koliko se produlji? Koeficijent toplinskog rastezanja α = ${f(p.mat.alpha, 6)} po °C (ΔL = α · L · ΔT). Odgovor izrazi u milimetrima.`
      },
      answer: p => p.mat.alpha * p.L * p.dT * 1000, unit: 'mm', abs: 0.2,
      hint: { en: 'ΔL = α · L · ΔT gives metres; multiply by 1000 to get millimetres.', hr: 'ΔL = α · L · ΔT daje metre; pomnoži s 1000 da dobiješ milimetre.' },
      steps: {
        en: (p, f) => ['ΔL = α · L · ΔT', `ΔL = ${f(p.mat.alpha, 6)} · ${f(p.L)} m · ${f(p.dT)} °C = ${f(p.mat.alpha * p.L * p.dT, 4)} m`, `ΔL = ${f(p.mat.alpha * p.L * p.dT, 4)} m · 1000 = ${f(p.mat.alpha * p.L * p.dT * 1000)} mm`],
        hr: (p, f) => ['ΔL = α · L · ΔT', `ΔL = ${f(p.mat.alpha, 6)} · ${f(p.L)} m · ${f(p.dT)} °C = ${f(p.mat.alpha * p.L * p.dT, 4)} m`, `ΔL = ${f(p.mat.alpha * p.L * p.dT, 4)} m · 1000 = ${f(p.mat.alpha * p.L * p.dT * 1000)} mm`]
      }
    }
  ]);
})();
