/* FizLab practice problems: Waves and sound / Valovi i zvuk */
(function () {
  'use strict';
  window.Content.registerProblems('waves', [
    {
      id: 'frequency-from-period', level: 1,
      params: R => ({ T: R.pick([0.1, 0.2, 0.25, 0.5, 2, 4, 5]) }),
      text: {
        en: (p, f) => `A weight on a spring makes one complete oscillation in ${f(p.T)} s. What is the frequency of the oscillation?`,
        hr: (p, f) => `Uteg na opruzi načini jedan potpuni titraj za ${f(p.T)} s. Kolika je frekvencija titranja?`
      },
      answer: p => 1 / p.T, unit: 'Hz',
      hint: { en: 'Frequency is the reciprocal of the period: f = 1 / T.', hr: 'Frekvencija je obrnuta vrijednost perioda: f = 1 / T.' },
      steps: {
        en: (p, f) => ['f = 1 / T', `f = 1 / ${f(p.T)} s`, `f = ${f(1 / p.T)} Hz`],
        hr: (p, f) => ['f = 1 / T', `f = 1 / ${f(p.T)} s`, `f = ${f(1 / p.T)} Hz`]
      }
    },
    {
      id: 'wave-speed', level: 1,
      params: R => ({ lam: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), fr: R.pick([1, 2, 3, 4, 5]) }),
      text: {
        en: (p, f) => `A wave travels along a rope. Its wavelength is ${f(p.lam)} m and its frequency is ${f(p.fr)} Hz. What is the speed of the wave?`,
        hr: (p, f) => `Užetom putuje val. Valna duljina vala je ${f(p.lam)} m, a frekvencija ${f(p.fr)} Hz. Kolika je brzina vala?`
      },
      answer: p => p.lam * p.fr, unit: 'm/s',
      hint: { en: 'Wave speed = wavelength × frequency.', hr: 'Brzina vala = valna duljina × frekvencija.' },
      steps: {
        en: (p, f) => ['v = λ · f', `v = ${f(p.lam)} m · ${f(p.fr)} Hz`, `v = ${f(p.lam * p.fr)} m/s`],
        hr: (p, f) => ['v = λ · f', `v = ${f(p.lam)} m · ${f(p.fr)} Hz`, `v = ${f(p.lam * p.fr)} m/s`]
      }
    },
    {
      id: 'oscillations-count', level: 1,
      params: R => ({ fr: R.pick([110, 220, 262, 330, 440]), t: R.int(2, 10) }),
      text: {
        en: (p, f) => `A guitar string vibrates with a frequency of ${f(p.fr)} Hz. How many complete oscillations does it make in ${f(p.t)} s?`,
        hr: (p, f) => `Žica gitare titra frekvencijom ${f(p.fr)} Hz. Koliko potpunih titraja načini u ${f(p.t)} s?`
      },
      answer: p => p.fr * p.t, unit: { en: 'oscillations', hr: 'titraja' },
      hint: { en: 'Frequency tells how many oscillations happen every second.', hr: 'Frekvencija kaže koliko se titraja dogodi svake sekunde.' },
      steps: {
        en: (p, f) => ['Frequency = oscillations per second, so n = f · t', `n = ${f(p.fr)} Hz · ${f(p.t)} s`, `n = ${f(p.fr * p.t)} oscillations`],
        hr: (p, f) => ['Frekvencija = broj titraja u sekundi, pa je n = f · t', `n = ${f(p.fr)} Hz · ${f(p.t)} s`, `n = ${f(p.fr * p.t)} titraja`]
      }
    },
    {
      id: 'wavelength-sound', level: 2,
      params: R => ({ fr: R.pick([68, 85, 136, 170, 340, 680, 850]) }),
      text: {
        en: (p, f) => `A loudspeaker plays a tone with a frequency of ${f(p.fr)} Hz. Sound travels through air at 340 m/s. What is the wavelength of this sound?`,
        hr: (p, f) => `Zvučnik svira ton frekvencije ${f(p.fr)} Hz. Zvuk se zrakom širi brzinom 340 m/s. Kolika je valna duljina tog zvuka?`
      },
      answer: p => 340 / p.fr, unit: 'm',
      hint: { en: 'Rearrange v = λ · f into λ = v / f.', hr: 'Iz v = λ · f slijedi λ = v / f.' },
      steps: {
        en: (p, f) => ['v = λ · f  →  λ = v / f', `λ = 340 m/s / ${f(p.fr)} Hz`, `λ = ${f(340 / p.fr)} m`],
        hr: (p, f) => ['v = λ · f  →  λ = v / f', `λ = 340 m/s / ${f(p.fr)} Hz`, `λ = ${f(340 / p.fr)} m`]
      }
    },
    {
      id: 'thunder-distance', level: 2,
      params: R => ({ t: R.int(2, 12) }),
      text: {
        en: (p, f) => `You see a flash of lightning and hear the thunder ${f(p.t)} s later. The light reaches you almost instantly, while sound travels at 340 m/s. How far away did the lightning strike?`,
        hr: (p, f) => `Vidiš bljesak munje, a grom čuješ ${f(p.t)} s kasnije. Svjetlost do tebe stiže gotovo trenutno, a zvuk putuje brzinom 340 m/s. Koliko je daleko udarila munja?`
      },
      answer: p => 340 * p.t, unit: 'm',
      hint: { en: 'The delay is the time the sound needed to reach you: s = v · t.', hr: 'Kašnjenje je vrijeme koje je zvuku trebalo do tebe: s = v · t.' },
      steps: {
        en: (p, f) => ['The delay is the travel time of the sound: s = v · t', `s = 340 m/s · ${f(p.t)} s`, `s = ${f(340 * p.t)} m`],
        hr: (p, f) => ['Kašnjenje je vrijeme putovanja zvuka: s = v · t', `s = 340 m/s · ${f(p.t)} s`, `s = ${f(340 * p.t)} m`]
      }
    },
    {
      id: 'echo-distance', level: 2,
      params: R => ({ t: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]) }),
      text: {
        en: (p, f) => `You shout towards a cliff and hear the echo ${f(p.t)} s later. Sound travels at 340 m/s. How far away is the cliff?`,
        hr: (p, f) => `Vikneš prema stijeni i jeku čuješ nakon ${f(p.t)} s. Zvuk putuje brzinom 340 m/s. Koliko je stijena udaljena?`
      },
      answer: p => 340 * p.t / 2, unit: 'm',
      hint: { en: 'The sound travels there and back, so the cliff is only half of the total path away: d = v · t / 2.', hr: 'Zvuk putuje tamo i natrag, pa je stijena udaljena samo pola ukupnog puta: d = v · t / 2.' },
      steps: {
        en: (p, f) => [`Total path there and back: s = v · t = 340 m/s · ${f(p.t)} s = ${f(340 * p.t)} m`, 'The cliff is half of that away: d = s / 2', `d = ${f(340 * p.t)} m / 2 = ${f(340 * p.t / 2)} m`],
        hr: (p, f) => [`Ukupni put tamo i natrag: s = v · t = 340 m/s · ${f(p.t)} s = ${f(340 * p.t)} m`, 'Stijena je udaljena pola tog puta: d = s / 2', `d = ${f(340 * p.t)} m / 2 = ${f(340 * p.t / 2)} m`]
      }
    },
    {
      id: 'sonar-echo-time', level: 2,
      params: R => ({ d: R.pick([150, 300, 450, 600, 750, 900, 1500, 3000]) }),
      text: {
        en: (p, f) => `A ship measures the depth of the sea with ultrasound (sonar). The sea is ${f(p.d)} m deep and sound travels through water at 1500 m/s. After how many seconds does the echo from the sea floor return to the ship?`,
        hr: (p, f) => `Brod ultrazvukom (sonarom) mjeri dubinu mora. More je duboko ${f(p.d)} m, a zvuk se vodom širi brzinom 1500 m/s. Nakon koliko se sekundi jeka s morskog dna vrati do broda?`
      },
      answer: p => 2 * p.d / 1500, unit: 's',
      hint: { en: 'The sound goes down to the bottom and back up, so it travels twice the depth: t = 2d / v.', hr: 'Zvuk putuje do dna i natrag, pa prijeđe dvostruku dubinu: t = 2d / v.' },
      steps: {
        en: (p, f) => [`Path down and back up: s = 2 · ${f(p.d)} m = ${f(2 * p.d)} m`, 't = s / v', `t = ${f(2 * p.d)} m / 1500 m/s = ${f(2 * p.d / 1500)} s`],
        hr: (p, f) => [`Put do dna i natrag: s = 2 · ${f(p.d)} m = ${f(2 * p.d)} m`, 't = s / v', `t = ${f(2 * p.d)} m / 1500 m/s = ${f(2 * p.d / 1500)} s`]
      }
    },
    {
      id: 'period-to-wavelength', level: 3,
      params: R => ({ T: R.pick([2, 2.5, 4, 5, 10]) }),
      text: {
        en: (p, f) => `A loudspeaker membrane vibrates with a period of ${f(p.T)} ms (1 s = 1000 ms). Sound travels through air at 340 m/s. What is the wavelength of the sound it produces?`,
        hr: (p, f) => `Membrana zvučnika titra s periodom ${f(p.T)} ms (1 s = 1000 ms). Zvuk se zrakom širi brzinom 340 m/s. Kolika je valna duljina zvuka koji membrana stvara?`
      },
      answer: p => 340 / (1000 / p.T), unit: 'm',
      hint: { en: 'First find the frequency from the period (in seconds), then λ = v / f.', hr: 'Najprije iz perioda (u sekundama) izračunaj frekvenciju, zatim λ = v / f.' },
      steps: {
        en: (p, f) => [`1 s = 1000 ms, so f = 1 / T = 1000 / ${f(p.T)} = ${f(1000 / p.T)} Hz`, 'λ = v / f', `λ = 340 m/s / ${f(1000 / p.T)} Hz = ${f(340 / (1000 / p.T))} m`],
        hr: (p, f) => [`1 s = 1000 ms, pa je f = 1 / T = 1000 / ${f(p.T)} = ${f(1000 / p.T)} Hz`, 'λ = v / f', `λ = 340 m/s / ${f(1000 / p.T)} Hz = ${f(340 / (1000 / p.T))} m`]
      }
    },
    {
      id: 'guitar-string', level: 3,
      params: R => { const s = R.pick([{ L1: 60, L2: 30 }, { L1: 60, L2: 20 }, { L1: 60, L2: 15 }, { L1: 80, L2: 40 }, { L1: 80, L2: 20 }, { L1: 90, L2: 30 }, { L1: 90, L2: 45 }]); return { L1: s.L1, L2: s.L2, k: s.L1 / s.L2, f1: R.pick([100, 110, 120, 150, 200]) }; },
      text: {
        en: (p, f) => `A guitar string ${f(p.L1)} cm long sounds a note of ${f(p.f1)} Hz. The frequency is inversely proportional to the vibrating length: half the length gives twice the frequency. The player presses the string so that only ${f(p.L2)} cm of it vibrates. What is the frequency of the note now?`,
        hr: (p, f) => `Žica gitare duga ${f(p.L1)} cm daje ton frekvencije ${f(p.f1)} Hz. Frekvencija je obrnuto razmjerna duljini dijela žice koji titra: dvostruko kraća žica daje dvostruko veću frekvenciju. Gitarist pritisne žicu tako da titra samo ${f(p.L2)} cm žice. Kolika je frekvencija tona sada?`
      },
      answer: p => p.f1 * p.k, unit: 'Hz',
      hint: { en: 'Find how many times shorter the string is; the frequency becomes that many times higher.', hr: 'Izračunaj koliko je puta žica kraća; frekvencija postane toliko puta veća.' },
      steps: {
        en: (p, f) => [`Length ratio: ${f(p.L1)} cm / ${f(p.L2)} cm = ${f(p.k)}`, `The string is ${f(p.k)} times shorter, so the frequency is ${f(p.k)} times higher.`, `f = ${f(p.k)} · ${f(p.f1)} Hz = ${f(p.f1 * p.k)} Hz`],
        hr: (p, f) => [`Omjer duljina: ${f(p.L1)} cm / ${f(p.L2)} cm = ${f(p.k)}`, `Žica je ${f(p.k)} puta kraća, pa je frekvencija ${f(p.k)} puta veća.`, `f = ${f(p.k)} · ${f(p.f1)} Hz = ${f(p.f1 * p.k)} Hz`]
      }
    }
  ]);
})();
