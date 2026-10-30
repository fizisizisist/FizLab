/* FizLab practice problems: Levers and Simple Machines / Poluga i jednostavni strojevi */
(function () {
  'use strict';
  // Balanced seesaw with clean numbers: lighter child (G1) further out (d1), heavier child (G2) closer (d2).
  function balance(R) {
    const d2 = R.pick([1, 1.5, 2]);
    const G2 = R.step(300, 600, 50);
    const M = G2 * d2;
    const cands = [1.5, 2, 2.5, 3].filter(d => d > d2 && Math.abs(M / d / 5 - Math.round(M / d / 5)) < 1e-9 && M / d >= 150 && M / d < G2);
    const d1 = R.pick(cands);
    return { G1: M / d1, d1, G2, d2 };
  }
  window.Content.registerProblems('levers', [
    {
      id: 'torque-basic', level: 1,
      params: R => ({ G: R.step(200, 450, 50), d: R.step(0.5, 3, 0.5) }),
      text: {
        en: (p, f) => `A child weighing ${f(p.G)} N sits ${f(p.d)} m from the middle of a seesaw. How big is the moment of the child's weight about the fulcrum (the middle of the seesaw)? (M = F · d)`,
        hr: (p, f) => `Dijete težine ${f(p.G)} N sjedi ${f(p.d)} m od sredine klackalice. Koliki je moment sile težine djeteta oko oslonca (sredine klackalice)? (M = F · d)`
      },
      answer: p => p.G * p.d, unit: 'N·m',
      hint: { en: 'Moment = force × arm (the distance from the fulcrum).', hr: 'Moment sile = sila × krak (udaljenost od oslonca).' },
      steps: {
        en: (p, f) => ['M = F · d', `M = ${f(p.G)} N · ${f(p.d)} m`, `M = ${f(p.G * p.d)} N·m`],
        hr: (p, f) => ['M = F · d', `M = ${f(p.G)} N · ${f(p.d)} m`, `M = ${f(p.G * p.d)} N·m`]
      }
    },
    {
      id: 'seesaw-force', level: 1,
      params: R => balance(R),
      text: {
        en: (p, f) => `Ana weighs ${f(p.G1)} N and sits ${f(p.d1)} m from the middle of a seesaw. Her friend Marko sits ${f(p.d2)} m from the middle on the other side and the seesaw is balanced. What is Marko's weight? (F₁ · d₁ = F₂ · d₂)`,
        hr: (p, f) => `Ana ima težinu ${f(p.G1)} N i sjedi ${f(p.d1)} m od sredine klackalice. Njezin prijatelj Marko sjedi ${f(p.d2)} m od sredine s druge strane i klackalica je u ravnoteži. Kolika je Markova težina? (F₁ · d₁ = F₂ · d₂)`
      },
      answer: p => p.G1 * p.d1 / p.d2, unit: 'N',
      hint: { en: 'Balance: the moments on both sides are equal, so F₂ = F₁ · d₁ / d₂.', hr: 'Ravnoteža: momenti na obje strane su jednaki, pa je F₂ = F₁ · d₁ / d₂.' },
      steps: {
        en: (p, f) => [`Ana's moment: M = ${f(p.G1)} N · ${f(p.d1)} m = ${f(p.G1 * p.d1)} N·m`, 'Balance: F₂ · d₂ = M  →  F₂ = M / d₂', `F₂ = ${f(p.G1 * p.d1)} N·m / ${f(p.d2)} m = ${f(p.G1 * p.d1 / p.d2)} N`],
        hr: (p, f) => [`Anin moment: M = ${f(p.G1)} N · ${f(p.d1)} m = ${f(p.G1 * p.d1)} N·m`, 'Ravnoteža: F₂ · d₂ = M  →  F₂ = M / d₂', `F₂ = ${f(p.G1 * p.d1)} N·m / ${f(p.d2)} m = ${f(p.G1 * p.d1 / p.d2)} N`]
      }
    },
    {
      id: 'pulley-movable', level: 1,
      params: R => ({ G: R.step(100, 900, 50) }),
      text: {
        en: (p, f) => `A bucket of sand weighing ${f(p.G)} N is lifted with a movable pulley. With what force do you have to pull the rope? Ignore friction and the weight of the pulley.`,
        hr: (p, f) => `Kanta s pijeskom težine ${f(p.G)} N diže se pomoću pomične koloture. Kolikom silom moraš vući uže? Zanemari trenje i težinu koloture.`
      },
      answer: p => p.G / 2, unit: 'N',
      hint: { en: 'A movable pulley halves the force: F = G / 2.', hr: 'Pomična kolotura upola smanjuje silu: F = G / 2.' },
      steps: {
        en: (p, f) => ['Movable pulley: two sections of rope hold the load  →  F = G / 2', `F = ${f(p.G)} N / 2`, `F = ${f(p.G / 2)} N`],
        hr: (p, f) => ['Pomična kolotura: teret drže dva dijela užeta  →  F = G / 2', `F = ${f(p.G)} N / 2`, `F = ${f(p.G / 2)} N`]
      }
    },
    {
      id: 'seesaw-distance', level: 2,
      params: R => balance(R),
      text: {
        en: (p, f) => `Ivan weighs ${f(p.G1)} N and sits ${f(p.d1)} m from the middle of a seesaw. His heavier friend weighs ${f(p.G2)} N. How far from the middle must the friend sit on the other side so that the seesaw balances?`,
        hr: (p, f) => `Ivan ima težinu ${f(p.G1)} N i sjedi ${f(p.d1)} m od sredine klackalice. Njegov teži prijatelj ima težinu ${f(p.G2)} N. Koliko daleko od sredine mora prijatelj sjesti s druge strane da bi klackalica bila u ravnoteži?`
      },
      answer: p => p.G1 * p.d1 / p.G2, unit: 'm',
      hint: { en: 'Rearrange F₁ · d₁ = F₂ · d₂ into d₂ = F₁ · d₁ / F₂.', hr: 'Iz F₁ · d₁ = F₂ · d₂ slijedi d₂ = F₁ · d₁ / F₂.' },
      steps: {
        en: (p, f) => ['Law of the lever: F₁ · d₁ = F₂ · d₂  →  d₂ = F₁ · d₁ / F₂', `d₂ = ${f(p.G1)} N · ${f(p.d1)} m / ${f(p.G2)} N`, `d₂ = ${f(p.G1 * p.d1)} N·m / ${f(p.G2)} N = ${f(p.G1 * p.d1 / p.G2)} m`],
        hr: (p, f) => ['Zakon poluge: F₁ · d₁ = F₂ · d₂  →  d₂ = F₁ · d₁ / F₂', `d₂ = ${f(p.G1)} N · ${f(p.d1)} m / ${f(p.G2)} N`, `d₂ = ${f(p.G1 * p.d1)} N·m / ${f(p.G2)} N = ${f(p.G1 * p.d1 / p.G2)} m`]
      }
    },
    {
      id: 'crowbar-force', level: 2,
      params: R => { const a = R.pick([5, 10, 15, 20]); const r = R.pick([4, 5, 6, 8, 10]); const F0 = R.step(50, 250, 10); return { a, b: a * r, G: F0 * r }; },
      text: {
        en: (p, f) => `A rock weighing ${f(p.G)} N is lifted with a crowbar. The rock is ${f(p.a)} cm from the fulcrum and you push on the other end, ${f(p.b)} cm from the fulcrum. What force is needed?`,
        hr: (p, f) => `Kamen težine ${f(p.G)} N podižemo polugom (pajserom). Kamen je ${f(p.a)} cm od oslonca, a ti pritiskaš drugi kraj poluge, ${f(p.b)} cm od oslonca. Kolika je sila potrebna?`
      },
      answer: p => p.G * p.a / p.b, unit: 'N',
      hint: { en: 'Equal moments: F · d₂ = G · d₁, so F = G · d₁ / d₂.', hr: 'Jednaki momenti: F · d₂ = G · d₁, pa je F = G · d₁ / d₂.' },
      steps: {
        en: (p, f) => ['F · d₂ = G · d₁  →  F = G · d₁ / d₂', `F = ${f(p.G)} N · ${f(p.a)} cm / ${f(p.b)} cm`, `F = ${f(p.G * p.a / p.b)} N (the arm is ${f(p.b / p.a)} times longer, so the force is ${f(p.b / p.a)} times smaller)`],
        hr: (p, f) => ['F · d₂ = G · d₁  →  F = G · d₁ / d₂', `F = ${f(p.G)} N · ${f(p.a)} cm / ${f(p.b)} cm`, `F = ${f(p.G * p.a / p.b)} N (krak je ${f(p.b / p.a)} puta dulji, pa je sila ${f(p.b / p.a)} puta manja)`]
      }
    },
    {
      id: 'ramp-force', level: 2,
      params: R => { const h = R.pick([1, 1.5, 2]); const n = R.pick([2, 3, 4, 5]); const F0 = R.step(50, 300, 10); return { h, l: h * n, G: F0 * n }; },
      text: {
        en: (p, f) => `A box weighing ${f(p.G)} N is pushed up a ramp ${f(p.l)} m long and ${f(p.h)} m high. What force is needed along the ramp if there is no friction? (F = G · h / l)`,
        hr: (p, f) => `Kutiju težine ${f(p.G)} N guramo uz kosinu dugu ${f(p.l)} m i visoku ${f(p.h)} m. Kolika je sila potrebna duž kosine ako nema trenja? (F = G · h / l)`
      },
      answer: p => p.G * p.h / p.l, unit: 'N',
      hint: { en: 'The ramp is l / h times longer than it is high, so the force is that many times smaller than the weight.', hr: 'Kosina je l / h puta dulja nego što je visoka, pa je sila toliko puta manja od težine.' },
      steps: {
        en: (p, f) => ['F = G · h / l', `F = ${f(p.G)} N · ${f(p.h)} m / ${f(p.l)} m`, `F = ${f(p.G * p.h / p.l)} N`],
        hr: (p, f) => ['F = G · h / l', `F = ${f(p.G)} N · ${f(p.h)} m / ${f(p.l)} m`, `F = ${f(p.G * p.h / p.l)} N`]
      }
    },
    {
      id: 'wheelbarrow', level: 3,
      params: R => { const k = R.pick([2, 3, 4]); const a = R.pick([30, 40, 50]); const mm = R.pick([10, 15, 20, 25, 30]); return { m: k * mm, a, b: a * k }; },
      text: {
        en: (p, f) => `A wheelbarrow carries ${f(p.m)} kg of sand. The centre of the load is ${f(p.a)} cm from the wheel axle (the fulcrum) and the handles are ${f(p.b)} cm from the axle. With what force must you lift the handles? Use g = 10 N/kg.`,
        hr: (p, f) => `U tačkama je ${f(p.m)} kg pijeska. Središte tereta je ${f(p.a)} cm od osovine kotača (oslonca), a ručke su ${f(p.b)} cm od osovine. Kolikom silom moraš podizati ručke? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10 * p.a / p.b, unit: 'N',
      hint: { en: 'First find the weight of the sand, then use F · d₂ = G · d₁.', hr: 'Najprije izračunaj težinu pijeska, zatim upotrijebi F · d₂ = G · d₁.' },
      steps: {
        en: (p, f) => [`Weight: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, 'Law of the lever: F · d₂ = G · d₁  →  F = G · d₁ / d₂', `F = ${f(p.m * 10)} N · ${f(p.a)} cm / ${f(p.b)} cm = ${f(p.m * 10 * p.a / p.b)} N`],
        hr: (p, f) => [`Težina: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, 'Zakon poluge: F · d₂ = G · d₁  →  F = G · d₁ / d₂', `F = ${f(p.m * 10)} N · ${f(p.a)} cm / ${f(p.b)} cm = ${f(p.m * 10 * p.a / p.b)} N`]
      }
    },
    {
      id: 'pulley-system', level: 3,
      params: R => ({ m: R.step(40, 400, 20) }),
      text: {
        en: (p, f) => `A crate of mass ${f(p.m)} kg hangs on a block and tackle with two movable pulleys (each movable pulley halves the force). What force is needed to hold the crate? Use g = 10 N/kg and ignore friction and the weight of the pulleys.`,
        hr: (p, f) => `Sanduk mase ${f(p.m)} kg visi na koloturniku s dvije pomične koloture (svaka pomična kolotura upola smanjuje silu). Kolika je sila potrebna da se sanduk drži? Uzmi g = 10 N/kg i zanemari trenje i težinu kolotura.`
      },
      answer: p => p.m * 10 / 4, unit: 'N',
      hint: { en: 'Find the weight first, then halve it twice: F = G / 4.', hr: 'Najprije izračunaj težinu, zatim je dvaput prepolovi: F = G / 4.' },
      steps: {
        en: (p, f) => [`G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `First movable pulley: ${f(p.m * 10)} N / 2 = ${f(p.m * 5)} N`, `Second movable pulley: ${f(p.m * 5)} N / 2 = ${f(p.m * 2.5)} N`, `F = G / 4 = ${f(p.m * 2.5)} N`],
        hr: (p, f) => [`G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Prva pomična kolotura: ${f(p.m * 10)} N / 2 = ${f(p.m * 5)} N`, `Druga pomična kolotura: ${f(p.m * 5)} N / 2 = ${f(p.m * 2.5)} N`, `F = G / 4 = ${f(p.m * 2.5)} N`]
      }
    },
    {
      id: 'golden-rule-distance', level: 3,
      params: R => { const n = R.pick([2, 3, 4, 5, 8, 10]); const F = R.step(50, 200, 10); return { n, F, G: F * n, h: R.pick([2, 4, 5, 10, 15, 20]) }; },
      text: {
        en: (p, f) => `With a lever you lift a load weighing ${f(p.G)} N using a force of ${f(p.F)} N. The load rises ${f(p.h)} cm. How far does the end of the lever you push on move? (The work put in equals the work got out: F · s = G · h)`,
        hr: (p, f) => `Polugom podižeš teret težine ${f(p.G)} N silom od ${f(p.F)} N. Teret se podigne za ${f(p.h)} cm. Koliki put prijeđe kraj poluge na koji djeluješ silom? (Uloženi rad jednak je dobivenom radu: F · s = G · h)`
      },
      answer: p => p.G * p.h / p.F, unit: 'cm',
      hint: { en: 'Golden rule of mechanics: what you gain in force you lose in distance. s = G · h / F.', hr: 'Zlatno pravilo mehanike: koliko dobiješ na sili, toliko izgubiš na putu. s = G · h / F.' },
      steps: {
        en: (p, f) => ['Work in = work out:  F · s = G · h  →  s = G · h / F', `s = ${f(p.G)} N · ${f(p.h)} cm / ${f(p.F)} N`, `s = ${f(p.G * p.h / p.F)} cm (${f(p.n)} times smaller force, ${f(p.n)} times longer path)`],
        hr: (p, f) => ['Uloženi rad = dobiveni rad:  F · s = G · h  →  s = G · h / F', `s = ${f(p.G)} N · ${f(p.h)} cm / ${f(p.F)} N`, `s = ${f(p.G * p.h / p.F)} cm (${f(p.n)} puta manja sila, ${f(p.n)} puta dulji put)`]
      }
    }
  ]);
})();
