/* FizLab practice problems: Electricity / Električna struja */
(function () {
  'use strict';
  window.Content.registerProblems('electricity', [
    {
      id: 'ohm-current', level: 1,
      params: R => { const I = R.pick([0.5, 1, 1.5, 2, 3]); const Rr = R.pick([2, 3, 4, 6, 8, 10, 12, 20]); return { R: Rr, U: I * Rr }; },
      text: {
        en: (p, f) => `A resistor of ${f(p.R)} Ω is connected to a battery of ${f(p.U)} V. What current flows through the resistor? (I = U / R)`,
        hr: (p, f) => `Otpornik otpora ${f(p.R)} Ω spojen je na bateriju napona ${f(p.U)} V. Kolika jakost struje teče kroz otpornik? (I = U / R)`
      },
      answer: p => p.U / p.R, unit: 'A',
      hint: { en: 'Ohm\'s law: divide the voltage by the resistance.', hr: 'Ohmov zakon: podijeli napon otporom.' },
      steps: {
        en: (p, f) => ['I = U / R', `I = ${f(p.U)} V / ${f(p.R)} Ω`, `I = ${f(p.U / p.R)} A`],
        hr: (p, f) => ['I = U / R', `I = ${f(p.U)} V / ${f(p.R)} Ω`, `I = ${f(p.U / p.R)} A`]
      }
    },
    {
      id: 'ohm-voltage', level: 1,
      params: R => ({ I: R.pick([0.2, 0.5, 1, 1.5, 2, 2.5, 3]), R: R.int(2, 40) }),
      text: {
        en: (p, f) => `A current of ${f(p.I)} A flows through a resistor of ${f(p.R)} Ω. What is the voltage across the resistor? (U = I · R)`,
        hr: (p, f) => `Kroz otpornik otpora ${f(p.R)} Ω teče struja jakosti ${f(p.I)} A. Koliki je napon na krajevima otpornika? (U = I · R)`
      },
      answer: p => p.I * p.R, unit: 'V',
      hint: { en: 'Multiply the current by the resistance.', hr: 'Pomnoži jakost struje otporom.' },
      steps: {
        en: (p, f) => ['U = I · R', `U = ${f(p.I)} A · ${f(p.R)} Ω`, `U = ${f(p.I * p.R)} V`],
        hr: (p, f) => ['U = I · R', `U = ${f(p.I)} A · ${f(p.R)} Ω`, `U = ${f(p.I * p.R)} V`]
      }
    },
    {
      id: 'charge-basic', level: 1,
      params: R => ({ I: R.pick([0.5, 1, 2, 3, 4, 5]), t: R.step(10, 120, 10) }),
      text: {
        en: (p, f) => `A current of ${f(p.I)} A flows through a wire for ${f(p.t)} s. How much electric charge passes through the wire? (Q = I · t, in coulombs)`,
        hr: (p, f) => `Kroz vodič teče struja jakosti ${f(p.I)} A tijekom ${f(p.t)} s. Koliki električni naboj prođe kroz vodič? (Q = I · t, u kulonima)`
      },
      answer: p => p.I * p.t, unit: 'C',
      hint: { en: 'Charge = current × time.', hr: 'Naboj = jakost struje × vrijeme.' },
      steps: {
        en: (p, f) => ['Q = I · t', `Q = ${f(p.I)} A · ${f(p.t)} s`, `Q = ${f(p.I * p.t)} C`],
        hr: (p, f) => ['Q = I · t', `Q = ${f(p.I)} A · ${f(p.t)} s`, `Q = ${f(p.I * p.t)} C`]
      }
    },
    {
      id: 'ohm-resistance', level: 2,
      params: R => { const I = R.pick([0.2, 0.5, 1, 2, 4]); const Rr = R.int(3, 60); return { I, U: I * Rr }; },
      text: {
        en: (p, f) => `An electrical device connected to ${f(p.U)} V draws a current of ${f(p.I)} A. What is its resistance?`,
        hr: (p, f) => `Kroz trošilo spojeno na napon ${f(p.U)} V teče struja jakosti ${f(p.I)} A. Koliki je električni otpor trošila?`
      },
      answer: p => p.U / p.I, unit: 'Ω',
      hint: { en: 'Rearrange I = U / R into R = U / I.', hr: 'Iz I = U / R slijedi R = U / I.' },
      steps: {
        en: (p, f) => ['I = U / R  →  R = U / I', `R = ${f(p.U)} V / ${f(p.I)} A`, `R = ${f(p.U / p.I)} Ω`],
        hr: (p, f) => ['I = U / R  →  R = U / I', `R = ${f(p.U)} V / ${f(p.I)} A`, `R = ${f(p.U / p.I)} Ω`]
      }
    },
    {
      id: 'parallel-two', level: 2,
      params: R => { const pair = R.pick([[6, 3], [12, 4], [12, 6], [20, 5], [15, 10], [30, 6], [24, 8], [4, 4], [8, 8], [10, 10], [12, 12], [20, 20]]); return { R1: pair[0], R2: pair[1] }; },
      text: {
        en: (p, f) => `Two resistors of ${f(p.R1)} Ω and ${f(p.R2)} Ω are connected in parallel. What is their total resistance? (R = R₁ · R₂ / (R₁ + R₂))`,
        hr: (p, f) => `Dva otpornika otpora ${f(p.R1)} Ω i ${f(p.R2)} Ω spojena su paralelno. Koliki je njihov ukupni otpor? (R = R₁ · R₂ / (R₁ + R₂))`
      },
      answer: p => p.R1 * p.R2 / (p.R1 + p.R2), unit: 'Ω',
      hint: { en: 'In parallel the total resistance is smaller than the smaller resistor; for two equal resistors it is half of one.', hr: 'U paralelnom spoju ukupni otpor je manji od manjeg otpora; za dva jednaka otpornika iznosi polovicu jednog.' },
      steps: {
        en: (p, f) => ['Parallel: R = R₁ · R₂ / (R₁ + R₂)', `R = ${f(p.R1)} Ω · ${f(p.R2)} Ω / (${f(p.R1)} Ω + ${f(p.R2)} Ω)`, `R = ${f(p.R1 * p.R2)} / ${f(p.R1 + p.R2)} Ω = ${f(p.R1 * p.R2 / (p.R1 + p.R2))} Ω`],
        hr: (p, f) => ['Paralelni spoj: R = R₁ · R₂ / (R₁ + R₂)', `R = ${f(p.R1)} Ω · ${f(p.R2)} Ω / (${f(p.R1)} Ω + ${f(p.R2)} Ω)`, `R = ${f(p.R1 * p.R2)} / ${f(p.R1 + p.R2)} Ω = ${f(p.R1 * p.R2 / (p.R1 + p.R2))} Ω`]
      }
    },
    {
      id: 'bulb-current', level: 2,
      params: R => { const U = R.pick([12, 230]); const I = R.pick([0.2, 0.25, 0.5, 1, 2, 4, 5]); return { U, P: U * I }; },
      text: {
        en: (p, f) => `An electric appliance rated ${f(p.P)} W is connected to ${f(p.U)} V. What current flows through it? (P = U · I)`,
        hr: (p, f) => `Trošilo snage ${f(p.P)} W spojeno je na napon ${f(p.U)} V. Kolika jakost struje teče kroz njega? (P = U · I)`
      },
      answer: p => p.P / p.U, unit: 'A',
      hint: { en: 'Rearrange P = U · I into I = P / U.', hr: 'Iz P = U · I slijedi I = P / U.' },
      steps: {
        en: (p, f) => ['P = U · I  →  I = P / U', `I = ${f(p.P)} W / ${f(p.U)} V`, `I = ${f(p.P / p.U)} A`],
        hr: (p, f) => ['P = U · I  →  I = P / U', `I = ${f(p.P)} W / ${f(p.U)} V`, `I = ${f(p.P / p.U)} A`]
      }
    },
    {
      id: 'series-circuit', level: 3,
      params: R => { const I = R.pick([0.5, 1, 1.5, 2, 3]); const R1 = R.int(2, 20); const R2 = R.int(2, 20); return { R1, R2, U: I * (R1 + R2) }; },
      text: {
        en: (p, f) => `Two resistors, R₁ = ${f(p.R1)} Ω and R₂ = ${f(p.R2)} Ω, are connected in series to a source of ${f(p.U)} V. What is the voltage across R₁?`,
        hr: (p, f) => `Dva otpornika, R₁ = ${f(p.R1)} Ω i R₂ = ${f(p.R2)} Ω, spojena su serijski na izvor napona ${f(p.U)} V. Koliki je napon na otporniku R₁?`
      },
      answer: p => p.U * p.R1 / (p.R1 + p.R2), unit: 'V',
      hint: { en: 'Total resistance R = R₁ + R₂, current I = U / R, then U₁ = I · R₁.', hr: 'Ukupni otpor R = R₁ + R₂, jakost struje I = U / R, zatim U₁ = I · R₁.' },
      steps: {
        en: (p, f) => [`Series: R = R₁ + R₂ = ${f(p.R1)} Ω + ${f(p.R2)} Ω = ${f(p.R1 + p.R2)} Ω`, `I = U / R = ${f(p.U)} V / ${f(p.R1 + p.R2)} Ω = ${f(p.U / (p.R1 + p.R2))} A (the same through both resistors)`, `U₁ = I · R₁ = ${f(p.U / (p.R1 + p.R2))} A · ${f(p.R1)} Ω = ${f(p.U * p.R1 / (p.R1 + p.R2))} V`],
        hr: (p, f) => [`Serijski spoj: R = R₁ + R₂ = ${f(p.R1)} Ω + ${f(p.R2)} Ω = ${f(p.R1 + p.R2)} Ω`, `I = U / R = ${f(p.U)} V / ${f(p.R1 + p.R2)} Ω = ${f(p.U / (p.R1 + p.R2))} A (ista kroz oba otpornika)`, `U₁ = I · R₁ = ${f(p.U / (p.R1 + p.R2))} A · ${f(p.R1)} Ω = ${f(p.U * p.R1 / (p.R1 + p.R2))} V`]
      }
    },
    {
      id: 'parallel-current', level: 3,
      params: R => ({ U: R.pick([6, 12, 24]), R1: R.pick([2, 3, 4, 6, 8, 12]), R2: R.pick([2, 3, 4, 6, 8, 12]) }),
      text: {
        en: (p, f) => `Two resistors, R₁ = ${f(p.R1)} Ω and R₂ = ${f(p.R2)} Ω, are connected in parallel to a source of ${f(p.U)} V. What total current does the source supply? (Each resistor gets the full voltage U.)`,
        hr: (p, f) => `Dva otpornika, R₁ = ${f(p.R1)} Ω i R₂ = ${f(p.R2)} Ω, spojena su paralelno na izvor napona ${f(p.U)} V. Kolika je ukupna jakost struje koju daje izvor? (Na svakom je otporniku puni napon U.)`
      },
      answer: p => p.U / p.R1 + p.U / p.R2, unit: 'A',
      hint: { en: 'Find the current in each branch with I = U / R, then add them.', hr: 'Izračunaj struju u svakoj grani iz I = U / R, zatim ih zbroji.' },
      steps: {
        en: (p, f) => [`I₁ = U / R₁ = ${f(p.U)} V / ${f(p.R1)} Ω = ${f(p.U / p.R1)} A`, `I₂ = U / R₂ = ${f(p.U)} V / ${f(p.R2)} Ω = ${f(p.U / p.R2)} A`, `I = I₁ + I₂ = ${f(p.U / p.R1)} A + ${f(p.U / p.R2)} A = ${f(p.U / p.R1 + p.U / p.R2)} A`],
        hr: (p, f) => [`I₁ = U / R₁ = ${f(p.U)} V / ${f(p.R1)} Ω = ${f(p.U / p.R1)} A`, `I₂ = U / R₂ = ${f(p.U)} V / ${f(p.R2)} Ω = ${f(p.U / p.R2)} A`, `I = I₁ + I₂ = ${f(p.U / p.R1)} A + ${f(p.U / p.R2)} A = ${f(p.U / p.R1 + p.U / p.R2)} A`]
      }
    },
    {
      id: 'energy-cost', level: 3,
      params: R => ({ P: R.pick([100, 200, 500, 1000, 1500, 2000]), t: R.pick([1, 2, 3, 4, 5]), c: R.pick([0.1, 0.15, 0.2, 0.25]) }),
      text: {
        en: (p, f) => `An electric heater of power ${f(p.P)} W is switched on for ${f(p.t)} h every day. How much does it cost to run it for 30 days if 1 kWh costs ${f(p.c)} €? (E = P · t)`,
        hr: (p, f) => `Električna grijalica snage ${f(p.P)} W uključena je ${f(p.t)} h svaki dan. Koliko košta njezin rad tijekom 30 dana ako 1 kWh košta ${f(p.c)} €? (E = P · t)`
      },
      answer: p => p.P / 1000 * p.t * 30 * p.c, unit: '€',
      hint: { en: 'W → kW, then kW × h = kWh per day, × 30 days, × price per kWh.', hr: 'W → kW, zatim kW × h = kWh dnevno, × 30 dana, × cijena po kWh.' },
      steps: {
        en: (p, f) => [`P = ${f(p.P)} W = ${f(p.P / 1000)} kW`, `Per day: E = P · t = ${f(p.P / 1000)} kW · ${f(p.t)} h = ${f(p.P / 1000 * p.t)} kWh`, `In 30 days: ${f(p.P / 1000 * p.t)} kWh · 30 = ${f(p.P / 1000 * p.t * 30)} kWh`, `Cost: ${f(p.P / 1000 * p.t * 30)} kWh · ${f(p.c)} €/kWh = ${f(p.P / 1000 * p.t * 30 * p.c)} €`],
        hr: (p, f) => [`P = ${f(p.P)} W = ${f(p.P / 1000)} kW`, `Dnevno: E = P · t = ${f(p.P / 1000)} kW · ${f(p.t)} h = ${f(p.P / 1000 * p.t)} kWh`, `Za 30 dana: ${f(p.P / 1000 * p.t)} kWh · 30 = ${f(p.P / 1000 * p.t * 30)} kWh`, `Cijena: ${f(p.P / 1000 * p.t * 30)} kWh · ${f(p.c)} €/kWh = ${f(p.P / 1000 * p.t * 30 * p.c)} €`]
      }
    }
  ]);
})();
