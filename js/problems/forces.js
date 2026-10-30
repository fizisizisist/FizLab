/* FizLab practice problems: Forces / Sile */
(function () {
  'use strict';
  window.Content.registerProblems('forces', [
    {
      id: 'weight-basic', level: 1,
      params: R => ({ m: R.int(2, 60) }),
      text: {
        en: (p, f) => `A schoolbag has a mass of ${f(p.m)} kg. What is its weight on Earth? Use g = 10 N/kg.`,
        hr: (p, f) => `Školska torba ima masu ${f(p.m)} kg. Kolika je njezina težina na Zemlji? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10, unit: 'N',
      hint: { en: 'Weight = mass × g.', hr: 'Težina = masa × g.' },
      steps: {
        en: (p, f) => ['Formula: G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`],
        hr: (p, f) => ['Formula: G = m · g', `G = ${f(p.m)} kg · 10 N/kg`, `G = ${f(p.m * 10)} N`]
      }
    },
    {
      id: 'resultant-same', level: 1,
      params: R => ({ a: R.step(10, 90, 5), b: R.step(10, 90, 5) }),
      text: {
        en: (p, f) => `Two friends push a sofa in the same direction with ${f(p.a)} N and ${f(p.b)} N. How big is the resultant force?`,
        hr: (p, f) => `Dvoje prijatelja gura kauč u istom smjeru silama ${f(p.a)} N i ${f(p.b)} N. Kolika je rezultantna sila?`
      },
      answer: p => p.a + p.b, unit: 'N',
      hint: { en: 'Forces in the same direction add up.', hr: 'Sile istog smjera se zbrajaju.' },
      steps: {
        en: (p, f) => ['Same direction: F = F₁ + F₂', `F = ${f(p.a)} N + ${f(p.b)} N`, `F = ${f(p.a + p.b)} N`],
        hr: (p, f) => ['Isti smjer: F = F₁ + F₂', `F = ${f(p.a)} N + ${f(p.b)} N`, `F = ${f(p.a + p.b)} N`]
      }
    },
    {
      id: 'resultant-opposite', level: 1,
      params: R => { const big = R.step(40, 120, 5); return { big, small: R.step(10, big - 5, 5) }; },
      text: {
        en: (p, f) => `In a tug of war the left team pulls with ${f(p.big)} N and the right team with ${f(p.small)} N. How big is the resultant force?`,
        hr: (p, f) => `U potezanju užeta lijeva ekipa vuče silom ${f(p.big)} N, a desna silom ${f(p.small)} N. Kolika je rezultantna sila?`
      },
      answer: p => p.big - p.small, unit: 'N',
      hint: { en: 'Opposite directions: subtract the smaller force from the bigger one.', hr: 'Suprotni smjerovi: od veće sile oduzmi manju.' },
      steps: {
        en: (p, f) => ['Opposite directions: F = F₁ − F₂', `F = ${f(p.big)} N − ${f(p.small)} N`, `F = ${f(p.big - p.small)} N, towards the left team`],
        hr: (p, f) => ['Suprotni smjerovi: F = F₁ − F₂', `F = ${f(p.big)} N − ${f(p.small)} N`, `F = ${f(p.big - p.small)} N, prema lijevoj ekipi`]
      }
    },
    {
      id: 'mass-from-weight', level: 2,
      params: R => ({ G: R.step(50, 900, 50) }),
      text: {
        en: (p, f) => `A box has a weight of ${f(p.G)} N. What is its mass? Use g = 10 N/kg.`,
        hr: (p, f) => `Kutija ima težinu ${f(p.G)} N. Kolika je njezina masa? Uzmi g = 10 N/kg.`
      },
      answer: p => p.G / 10, unit: 'kg',
      hint: { en: 'Rearrange G = m · g into m = G / g.', hr: 'Iz G = m · g slijedi m = G / g.' },
      steps: {
        en: (p, f) => ['G = m · g  →  m = G / g', `m = ${f(p.G)} N / 10 N/kg`, `m = ${f(p.G / 10)} kg`],
        hr: (p, f) => ['G = m · g  →  m = G / g', `m = ${f(p.G)} N / 10 N/kg`, `m = ${f(p.G / 10)} kg`]
      }
    },
    {
      id: 'three-forces', level: 2,
      params: R => { const a = R.step(20, 80, 10), b = R.step(20, 80, 10); return { a, b, c: R.step(10, Math.min(60, a + b - 10), 10) }; },
      text: {
        en: (p, f) => `Three children push a cart. Two push to the right with ${f(p.a)} N and ${f(p.b)} N, one pushes to the left with ${f(p.c)} N. How big is the resultant force?`,
        hr: (p, f) => `Troje djece gura kolica. Dvoje gura udesno silama ${f(p.a)} N i ${f(p.b)} N, a jedno gura ulijevo silom ${f(p.c)} N. Kolika je rezultantna sila?`
      },
      answer: p => p.a + p.b - p.c, unit: 'N',
      hint: { en: 'Add the forces pointing right, then subtract the one pointing left.', hr: 'Zbroji sile udesno, pa oduzmi silu ulijevo.' },
      steps: {
        en: (p, f) => [`Right: ${f(p.a)} N + ${f(p.b)} N = ${f(p.a + p.b)} N`, `Resultant: ${f(p.a + p.b)} N − ${f(p.c)} N = ${f(p.a + p.b - p.c)} N`, 'The cart is pushed to the right.'],
        hr: (p, f) => [`Udesno: ${f(p.a)} N + ${f(p.b)} N = ${f(p.a + p.b)} N`, `Rezultanta: ${f(p.a + p.b)} N − ${f(p.c)} N = ${f(p.a + p.b - p.c)} N`, 'Kolica se guraju udesno.']
      }
    },
    {
      id: 'acceleration', level: 2,
      params: R => { const m = R.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]); const a = R.step(0.5, 4, 0.5); return { m, F: m * a }; },
      text: {
        en: (p, f) => `A resultant force of ${f(p.F)} N acts on a ${f(p.m)} kg sled. What is its acceleration? (a = F / m)`,
        hr: (p, f) => `Na sanjke mase ${f(p.m)} kg djeluje rezultantna sila ${f(p.F)} N. Koliko je ubrzanje sanjki? (a = F / m)`
      },
      answer: p => p.F / p.m, unit: 'm/s²',
      hint: { en: 'Divide the force by the mass.', hr: 'Podijeli silu masom.' },
      steps: {
        en: (p, f) => ['a = F / m', `a = ${f(p.F)} N / ${f(p.m)} kg`, `a = ${f(p.F / p.m)} m/s²`],
        hr: (p, f) => ['a = F / m', `a = ${f(p.F)} N / ${f(p.m)} kg`, `a = ${f(p.F / p.m)} m/s²`]
      }
    },
    {
      id: 'force-from-ma', level: 2,
      params: R => ({ m: R.int(400, 1500), a: R.step(1, 3, 0.5) }),
      text: {
        en: (p, f) => `A car of mass ${f(p.m)} kg speeds up with an acceleration of ${f(p.a)} m/s². How big is the resultant force on the car? (F = m · a)`,
        hr: (p, f) => `Automobil mase ${f(p.m)} kg ubrzava ubrzanjem ${f(p.a)} m/s². Kolika je rezultantna sila na automobil? (F = m · a)`
      },
      answer: p => p.m * p.a, unit: 'N',
      hint: { en: 'Multiply mass by acceleration.', hr: 'Pomnoži masu i ubrzanje.' },
      steps: {
        en: (p, f) => ['F = m · a', `F = ${f(p.m)} kg · ${f(p.a)} m/s²`, `F = ${f(p.m * p.a)} N`],
        hr: (p, f) => ['F = m · a', `F = ${f(p.m)} kg · ${f(p.a)} m/s²`, `F = ${f(p.m * p.a)} N`]
      }
    },
    {
      id: 'weight-on-moon', level: 3,
      params: R => ({ G: R.step(300, 900, 50) }),
      text: {
        en: (p, f) => `An astronaut weighs ${f(p.G)} N on Earth (g = 10 N/kg). On the Moon g = 1.6 N/kg. What is the astronaut's weight on the Moon?`,
        hr: (p, f) => `Astronaut na Zemlji ima težinu ${f(p.G)} N (g = 10 N/kg). Na Mjesecu je g = 1,6 N/kg. Kolika je težina astronauta na Mjesecu?`
      },
      answer: p => p.G / 10 * 1.6, unit: 'N',
      hint: { en: 'First find the mass (it is the same everywhere), then multiply by the Moon\'s g.', hr: 'Najprije izračunaj masu (ona je svugdje ista), zatim je pomnoži Mjesečevim g.' },
      steps: {
        en: (p, f) => [`Mass: m = G / g = ${f(p.G)} N / 10 N/kg = ${f(p.G / 10)} kg`, `Weight on the Moon: G = m · g = ${f(p.G / 10)} kg · 1.6 N/kg`, `G = ${f(p.G / 10 * 1.6)} N`],
        hr: (p, f) => [`Masa: m = G / g = ${f(p.G)} N / 10 N/kg = ${f(p.G / 10)} kg`, `Težina na Mjesecu: G = m · g = ${f(p.G / 10)} kg · 1,6 N/kg`, `G = ${f(p.G / 10 * 1.6)} N`]
      }
    },
    {
      id: 'friction-acceleration', level: 3,
      params: R => { const m = R.pick([10, 20, 25, 40, 50]); const mu = R.pick([0.1, 0.2, 0.3]); const fr = mu * m * 10; const F = fr + m * R.step(0.5, 2, 0.5); return { m, mu, F }; },
      text: {
        en: (p, f) => `A ${f(p.m)} kg crate is pushed with ${f(p.F)} N across a floor. The friction force is ${f(p.mu)} of the crate's weight (g = 10 N/kg). What is the crate's acceleration?`,
        hr: (p, f) => `Sanduk mase ${f(p.m)} kg guramo silom ${f(p.F)} N po podu. Sila trenja iznosi ${f(p.mu)} težine sanduka (g = 10 N/kg). Koliko je ubrzanje sanduka?`
      },
      answer: p => (p.F - p.mu * p.m * 10) / p.m, unit: 'm/s²',
      hint: { en: 'Find the weight, then the friction, then the net force F − friction, then a = F_net / m.', hr: 'Izračunaj težinu, zatim trenje, pa rezultantu F − trenje, pa a = F_rez / m.' },
      steps: {
        en: (p, f) => [`Weight: G = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Friction: F_fr = ${f(p.mu)} · ${f(p.m * 10)} N = ${f(p.mu * p.m * 10)} N`, `Net force: ${f(p.F)} N − ${f(p.mu * p.m * 10)} N = ${f(p.F - p.mu * p.m * 10)} N`, `a = F_net / m = ${f(p.F - p.mu * p.m * 10)} N / ${f(p.m)} kg = ${f((p.F - p.mu * p.m * 10) / p.m)} m/s²`],
        hr: (p, f) => [`Težina: G = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Trenje: F_tr = ${f(p.mu)} · ${f(p.m * 10)} N = ${f(p.mu * p.m * 10)} N`, `Rezultanta: ${f(p.F)} N − ${f(p.mu * p.m * 10)} N = ${f(p.F - p.mu * p.m * 10)} N`, `a = F_rez / m = ${f(p.F - p.mu * p.m * 10)} N / ${f(p.m)} kg = ${f((p.F - p.mu * p.m * 10) / p.m)} m/s²`]
      }
    }
  ]);
})();
