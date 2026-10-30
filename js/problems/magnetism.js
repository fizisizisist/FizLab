/* FizLab practice problems: Magnetism / Magnetizam */
(function () {
  'use strict';
  window.Content.registerProblems('magnetism', [
    {
      id: 'cut-magnet-poles', level: 1,
      params: R => ({ n: R.int(3, 10) }),
      text: {
        en: (p, f) => `A bar magnet is cut into ${f(p.n)} pieces. Every piece is again a complete magnet with a north pole and a south pole. How many magnetic poles do all the pieces have together?`,
        hr: (p, f) => `Štapićasti magnet prerežemo na ${f(p.n)} komada. Svaki je komad opet potpun magnet sa sjevernim i južnim polom. Koliko magnetskih polova imaju svi komadi zajedno?`
      },
      answer: p => 2 * p.n, unit: { en: 'poles', hr: 'polova' },
      hint: { en: 'A magnet can never have just one pole: every piece has 2 poles.', hr: 'Magnet nikad nema samo jedan pol: svaki komad ima 2 pola.' },
      steps: {
        en: (p, f) => ['Each piece has 2 poles (N and S).', `Number of poles = 2 · ${f(p.n)}`, `= ${f(2 * p.n)} poles`],
        hr: (p, f) => ['Svaki komad ima 2 pola (N i S).', `Broj polova = 2 · ${f(p.n)}`, `= ${f(2 * p.n)} polova`]
      }
    },
    {
      id: 'electromagnet-current-ratio', level: 1,
      params: R => { const I1 = R.pick([0.5, 1, 1.5, 2]); const k = R.pick([2, 3, 4]); return { N: R.pick([100, 200, 300, 500]), I1, I2: I1 * k, k }; },
      text: {
        en: (p, f) => `An electromagnet has ${f(p.N)} turns. The strength of an electromagnet is proportional to the number of turns times the current (B ∝ N · I). The current is increased from ${f(p.I1)} A to ${f(p.I2)} A. How many times stronger does the electromagnet become?`,
        hr: (p, f) => `Elektromagnet ima ${f(p.N)} zavoja. Jakost elektromagneta razmjerna je umnošku broja zavoja i jakosti struje (B ∝ N · I). Struju povećamo s ${f(p.I1)} A na ${f(p.I2)} A. Koliko puta elektromagnet postane jači?`
      },
      answer: p => p.k, unit: { en: 'times', hr: 'puta' },
      hint: { en: 'The turns stay the same, so the strength grows as many times as the current does.', hr: 'Broj zavoja je isti, pa jakost poraste onoliko puta koliko i struja.' },
      steps: {
        en: (p, f) => ['The number of turns does not change, only the current.', `Current ratio: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.k)}`, `The electromagnet is ${f(p.k)} times stronger.`],
        hr: (p, f) => ['Broj zavoja se ne mijenja, samo struja.', `Omjer struja: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.k)}`, `Elektromagnet je ${f(p.k)} puta jači.`]
      }
    },
    {
      id: 'coil-turns', level: 1,
      params: R => ({ tpc: R.pick([6, 8, 10, 12, 15, 20]), L: R.int(4, 15) }),
      text: {
        en: (p, f) => `A coil is wound tightly: there are ${f(p.tpc)} turns of wire on every centimetre of its length, and the coil is ${f(p.L)} cm long. How many turns does the coil have?`,
        hr: (p, f) => `Zavojnica je gusto namotana: na svaki centimetar duljine dolazi ${f(p.tpc)} zavoja žice, a zavojnica je duga ${f(p.L)} cm. Koliko zavoja ima zavojnica?`
      },
      answer: p => p.tpc * p.L, unit: { en: 'turns', hr: 'zavoja' },
      hint: { en: 'Turns = turns per centimetre × length in centimetres.', hr: 'Broj zavoja = zavoji po centimetru × duljina u centimetrima.' },
      steps: {
        en: (p, f) => ['N = turns per cm · length', `N = ${f(p.tpc)} · ${f(p.L)}`, `N = ${f(p.tpc * p.L)} turns`],
        hr: (p, f) => ['N = zavoji po cm · duljina', `N = ${f(p.tpc)} · ${f(p.L)}`, `N = ${f(p.tpc * p.L)} zavoja`]
      }
    },
    {
      id: 'paperclips-from-turns', level: 2,
      params: R => { const N1 = R.pick([50, 100, 150, 200]); const k = R.pick([2, 3, 4]); return { N1, N2: N1 * k, k, c1: R.pick([5, 10, 15]), I: R.pick([0.5, 1, 2]) }; },
      text: {
        en: (p, f) => `An electromagnet with ${f(p.N1)} turns lifts ${f(p.c1)} paperclips when a current of ${f(p.I)} A flows through it. The lifting strength is proportional to the number of turns times the current (N · I). How many paperclips will it lift if it has ${f(p.N2)} turns and the current stays the same?`,
        hr: (p, f) => `Elektromagnet koji ima ${f(p.N1)} zavoja podiže ${f(p.c1)} spajalica kad kroz njega teče struja ${f(p.I)} A. Snaga podizanja razmjerna je umnošku broja zavoja i jakosti struje (N · I). Koliko će spajalica podići ako ima ${f(p.N2)} zavoja, a struja ostane ista?`
      },
      answer: p => p.c1 * p.k, unit: { en: 'paperclips', hr: 'spajalica' },
      hint: { en: 'Find how many times more turns there are; the number of paperclips grows the same number of times.', hr: 'Izračunaj koliko je puta više zavoja; broj spajalica poraste isto toliko puta.' },
      steps: {
        en: (p, f) => [`Turns ratio: ${f(p.N2)} / ${f(p.N1)} = ${f(p.k)}`, `Same current, so the electromagnet is ${f(p.k)} times stronger.`, `Paperclips: ${f(p.k)} · ${f(p.c1)} = ${f(p.c1 * p.k)}`],
        hr: (p, f) => [`Omjer zavoja: ${f(p.N2)} / ${f(p.N1)} = ${f(p.k)}`, `Struja je ista, pa je elektromagnet ${f(p.k)} puta jači.`, `Spajalice: ${f(p.k)} · ${f(p.c1)} = ${f(p.c1 * p.k)}`]
      }
    },
    {
      id: 'current-needed', level: 2,
      params: R => { const N2 = R.pick([50, 100, 150, 200]); const k = R.pick([2, 3, 4]); const I1 = R.pick([0.5, 1, 1.5]); return { N1: N2 * k, N2, k, I1, I2: I1 * k }; },
      text: {
        en: (p, f) => `A coil with ${f(p.N1)} turns carrying a current of ${f(p.I1)} A holds up a steel plate. A second coil has only ${f(p.N2)} turns. The strength of an electromagnet is proportional to N · I. What current must flow through the second coil for it to be just as strong?`,
        hr: (p, f) => `Zavojnica koja ima ${f(p.N1)} zavoja i kroz koju teče struja ${f(p.I1)} A drži čeličnu pločicu. Druga zavojnica ima samo ${f(p.N2)} zavoja. Jakost elektromagneta razmjerna je umnošku N · I. Kolika struja mora teći kroz drugu zavojnicu da bude jednako jaka?`
      },
      answer: p => p.I2, unit: 'A',
      hint: { en: 'Equal strength means N₁ · I₁ = N₂ · I₂. Fewer turns need a bigger current.', hr: 'Jednaka jakost znači N₁ · I₁ = N₂ · I₂. Manje zavoja traži jaču struju.' },
      steps: {
        en: (p, f) => ['Equal strength: N₁ · I₁ = N₂ · I₂', `I₂ = N₁ · I₁ / N₂ = ${f(p.N1)} · ${f(p.I1)} A / ${f(p.N2)}`, `I₂ = ${f(p.I2)} A`],
        hr: (p, f) => ['Jednaka jakost: N₁ · I₁ = N₂ · I₂', `I₂ = N₁ · I₁ / N₂ = ${f(p.N1)} · ${f(p.I1)} A / ${f(p.N2)}`, `I₂ = ${f(p.I2)} A`]
      }
    },
    {
      id: 'compass-angle', level: 2,
      params: R => { const I1 = R.pick([0.5, 1, 1.5, 2]); const k = R.pick([2, 3, 4]); return { I1, I2: I1 * k, k, a1: R.pick([3, 4, 5, 6, 8, 10]) }; },
      text: {
        en: (p, f) => `In Ørsted's experiment a compass needle lying next to a wire turns by ${f(p.a1)}° when a current of ${f(p.I1)} A flows through the wire. Assume that the deflection of the needle is proportional to the current. By how many degrees does the needle turn when the current is ${f(p.I2)} A?`,
        hr: (p, f) => `U Ørstedovu pokusu igla kompasa položena uz vodič zakrene se za ${f(p.a1)}° kad kroz vodič teče struja ${f(p.I1)} A. Pretpostavi da je otklon igle razmjeran jakosti struje. Za koliko se stupnjeva igla zakrene kad je struja ${f(p.I2)} A?`
      },
      answer: p => p.a1 * p.k, unit: '°',
      hint: { en: 'How many times bigger is the current? The angle grows the same number of times.', hr: 'Koliko je puta struja jača? Toliko puta poraste i kut.' },
      steps: {
        en: (p, f) => [`Current ratio: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.k)}`, `Deflection: ${f(p.k)} · ${f(p.a1)}° = ${f(p.a1 * p.k)}°`],
        hr: (p, f) => [`Omjer struja: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.k)}`, `Otklon: ${f(p.k)} · ${f(p.a1)}° = ${f(p.a1 * p.k)}°`]
      }
    },
    {
      id: 'turns-and-current', level: 3,
      params: R => { const N1 = R.pick([100, 200]); const kN = R.pick([2, 3]); const I1 = R.pick([1, 2]); const kI = R.pick([0.5, 2, 3]); return { N1, N2: N1 * kN, kN, I1, I2: I1 * kI, kI, c1: R.pick([6, 8, 10]) }; },
      text: {
        en: (p, f) => `An electromagnet with ${f(p.N1)} turns and a current of ${f(p.I1)} A lifts ${f(p.c1)} paperclips. The teacher rewinds it so that it has ${f(p.N2)} turns and sets the current to ${f(p.I2)} A. The lifting strength is proportional to N · I. How many paperclips does it lift now?`,
        hr: (p, f) => `Elektromagnet koji ima ${f(p.N1)} zavoja i struju ${f(p.I1)} A podiže ${f(p.c1)} spajalica. Učiteljica ga premota tako da ima ${f(p.N2)} zavoja i namjesti struju na ${f(p.I2)} A. Snaga podizanja razmjerna je umnošku N · I. Koliko spajalica podiže sada?`
      },
      answer: p => p.c1 * p.kN * p.kI, unit: { en: 'paperclips', hr: 'spajalica' },
      hint: { en: 'Find the ratio for the turns and the ratio for the current, multiply them, then multiply by the old number of paperclips.', hr: 'Izračunaj omjer zavoja i omjer struja, pomnoži ih, pa pomnoži sa starim brojem spajalica.' },
      steps: {
        en: (p, f) => [`Turns: ${f(p.N2)} / ${f(p.N1)} = ${f(p.kN)} times`, `Current: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.kI)} times`, `Strength changes ${f(p.kN)} · ${f(p.kI)} = ${f(p.kN * p.kI)} times`, `Paperclips: ${f(p.kN * p.kI)} · ${f(p.c1)} = ${f(p.c1 * p.kN * p.kI)}`],
        hr: (p, f) => [`Zavoji: ${f(p.N2)} / ${f(p.N1)} = ${f(p.kN)} puta`, `Struja: ${f(p.I2)} A / ${f(p.I1)} A = ${f(p.kI)} puta`, `Jakost se promijeni ${f(p.kN)} · ${f(p.kI)} = ${f(p.kN * p.kI)} puta`, `Spajalice: ${f(p.kN * p.kI)} · ${f(p.c1)} = ${f(p.c1 * p.kN * p.kI)}`]
      }
    },
    {
      id: 'magnet-distance', level: 3,
      params: R => { const d1 = R.pick([1, 2, 3, 4, 5]); const k = R.pick([2, 3, 4]); const F2 = R.pick([0.5, 1, 1.5, 2]); return { d1, d2: d1 * k, k, F1: F2 * k, F2 }; },
      text: {
        en: (p, f) => `A magnet pulls a steel ball with a force of ${f(p.F1)} N when the ball is ${f(p.d1)} cm away. For this magnet the rule holds: at twice the distance the pull is half as big (the force is inversely proportional to the distance). How big is the pull when the ball is ${f(p.d2)} cm away?`,
        hr: (p, f) => `Magnet privlači čeličnu kuglicu silom ${f(p.F1)} N kad je kuglica udaljena ${f(p.d1)} cm. Za ovaj magnet vrijedi pravilo: na dvostruko većoj udaljenosti sila je dvostruko manja (sila je obrnuto razmjerna udaljenosti). Kolika je sila kad je kuglica udaljena ${f(p.d2)} cm?`
      },
      answer: p => p.F2, unit: 'N',
      hint: { en: 'Find how many times farther the ball is; the force becomes that many times smaller.', hr: 'Izračunaj koliko je puta kuglica dalje; sila postane toliko puta manja.' },
      steps: {
        en: (p, f) => [`Distance ratio: ${f(p.d2)} cm / ${f(p.d1)} cm = ${f(p.k)}`, `${f(p.k)} times farther → ${f(p.k)} times weaker pull`, `F = ${f(p.F1)} N / ${f(p.k)} = ${f(p.F2)} N`],
        hr: (p, f) => [`Omjer udaljenosti: ${f(p.d2)} cm / ${f(p.d1)} cm = ${f(p.k)}`, `${f(p.k)} puta dalje → ${f(p.k)} puta slabija sila`, `F = ${f(p.F1)} N / ${f(p.k)} = ${f(p.F2)} N`]
      }
    }
  ]);
})();
