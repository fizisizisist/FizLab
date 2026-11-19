/* FizLab practice problems: context-rich story problems across topics / Problemski zadaci s pričom
   Every template is level 3, addressed to "you", set in a real place, with at least one number that is NOT needed
   and no formula named in the text. Steps start with what is asked and which data matter. */
(function () {
  'use strict';

  /* ---------- MOTION / GIBANJE ---------- */
  window.Content.registerProblems('motion', [
    {
      id: 'ctx-tram-ride-time', level: 3,
      params: R => { const v = R.pick([12, 15, 18]); const t = R.int(10, 24); return { v, t, s: v * t / 60, stops: R.int(6, 14), price: R.pick([0.53, 0.93]) }; },
      text: {
        en: (p, f) => `You are meeting friends at Trg bana Jelačića in Zagreb and want to know when to leave. From your stop the tram has to cover ${f(p.s)} km, with ${f(p.stops)} stops on the way, and a ticket costs ${f(p.price)} €. According to the timetable its average speed, stops included, is ${f(p.v)} km/h. How many minutes will the ride take?`,
        hr: (p, f) => `Nalaziš se s prijateljima na Trgu bana Jelačića u Zagrebu i zanima te kada trebaš krenuti. Od tvoje stanice tramvaj mora prijeći ${f(p.s)} km, uz ${f(p.stops)} stanica na putu, a karta stoji ${f(p.price)} €. Prema voznom redu njegova je prosječna brzina, zajedno sa stajanjima, ${f(p.v)} km/h. Koliko će minuta trajati vožnja?`
      },
      answer: p => p.s / p.v * 60, unit: 'min', tol: 0.03,
      hint: { en: 'Only the distance and the average speed matter. Find the time in hours, then change it into minutes.', hr: 'Važni su samo put i prosječna brzina. Izračunaj vrijeme u satima, pa ga pretvori u minute.' },
      steps: {
        en: (p, f) => [`Asked: the riding time in minutes. Needed: the distance ${f(p.s)} km and the average speed ${f(p.v)} km/h; the number of stops and the ticket price are not needed.`, `t = s / v = ${f(p.s)} km / ${f(p.v)} km/h`, `In minutes: t = ${f(p.s)} / ${f(p.v)} · ${f(60)} min = ${f(p.s / p.v * 60)} min`],
        hr: (p, f) => [`Traži se: trajanje vožnje u minutama. Važni podaci: put ${f(p.s)} km i prosječna brzina ${f(p.v)} km/h; broj stanica i cijena karte nisu potrebni.`, `t = s / v = ${f(p.s)} km / ${f(p.v)} km/h`, `U minutama: t = ${f(p.s)} / ${f(p.v)} · ${f(60)} min = ${f(p.s / p.v * 60)} min`]
      }
    },
    {
      id: 'ctx-plitvice-bus-speed', level: 3,
      params: R => { const T = R.pick([12, 15, 24, 30, 36, 45, 48]); const v = R.pick([40, 50, 60, 70, 80]); return { T, v, d: v * T / 60, n: R.int(38, 52) }; },
      text: {
        en: (p, f) => `Your class is on a school trip from Zagreb to the Plitvice Lakes, about ${f(130)} km away. The tickets for the ${f(p.n)} pupils are booked for a fixed entry time, which is in ${f(p.T)} min, and the driver says there are still ${f(p.d)} km to go. What is the lowest average speed, in km/h, at which the bus still arrives on time?`,
        hr: (p, f) => `Tvoj razred putuje na školski izlet iz Zagreba na Plitvička jezera, udaljena oko ${f(130)} km. Ulaznice za ${f(p.n)} učenika rezervirane su za točno određeno vrijeme ulaska, do kojega je ostalo još ${f(p.T)} min, a vozač kaže da ima još ${f(p.d)} km puta. Kolika je najmanja prosječna brzina, u km/h, kojom autobus još stiže na vrijeme?`
      },
      answer: p => p.d / (p.T / 60), unit: 'km/h', tol: 0.03,
      hint: { en: 'Only the remaining distance and the remaining time matter. Change the minutes into hours first.', hr: 'Važni su samo preostali put i preostalo vrijeme. Najprije minute pretvori u sate.' },
      steps: {
        en: (p, f) => [`Asked: the average speed in km/h. Needed: the remaining distance ${f(p.d)} km and the remaining time ${f(p.T)} min; the whole distance from Zagreb and the number of pupils are not needed.`, `t = ${f(p.T)} min = ${f(p.T / 60)} h`, `v = s / t = ${f(p.d)} km / ${f(p.T / 60)} h`, `v = ${f(p.d / (p.T / 60))} km/h`],
        hr: (p, f) => [`Traži se: prosječna brzina u km/h. Važni podaci: preostali put ${f(p.d)} km i preostalo vrijeme ${f(p.T)} min; cijela udaljenost od Zagreba i broj učenika nisu potrebni.`, `t = ${f(p.T)} min = ${f(p.T / 60)} h`, `v = s / t = ${f(p.d)} km / ${f(p.T / 60)} h`, `v = ${f(p.d / (p.T / 60))} km/h`]
      }
    }
  ]);

  /* ---------- FORCES / SILE ---------- */
  window.Content.registerProblems('forces', [
    {
      id: 'ctx-push-start-car', level: 3,
      params: R => { const m = R.pick([800, 900, 1000, 1200]); const a = R.pick([0.2, 0.25, 0.4, 0.5]); const res = R.pick([100, 150, 200]); return { m, a, res, F: res + Math.round(m * a), v: R.pick([2, 3]), age: R.int(25, 30) }; },
      text: {
        en: (p, f) => `Your uncle's ${f(p.age)}-year-old car will not start in a car park in Zadar, so you and two cousins push it. Together you push with ${f(p.F)} N, while friction and rolling resistance hold the car back with ${f(p.res)} N. The car with your uncle in it has a mass of ${f(p.m)} kg, and he says the engine will catch at ${f(p.v)} m/s. For how many seconds do you have to push, starting from rest?`,
        hr: (p, f) => `Stričev automobil star ${f(p.age)} godina ne može upaliti na parkiralištu u Zadru, pa ga ti i dvoje bratića gurate. Zajedno gurate silom ${f(p.F)} N, dok trenje i otpor kotrljanja zadržavaju automobil silom ${f(p.res)} N. Automobil sa stricem u njemu ima masu ${f(p.m)} kg, a stric kaže da će motor upaliti pri brzini ${f(p.v)} m/s. Koliko sekundi morate gurati ako krećete iz mirovanja?`
      },
      answer: p => p.v * p.m / (p.F - p.res), unit: 's', tol: 0.03,
      hint: { en: 'First find the resultant force on the car, then its acceleration from the force and the mass, and finally the time needed to reach the given speed. The age of the car does not matter.', hr: 'Najprije odredi rezultantnu silu na automobil, zatim iz sile i mase ubrzanje, a na kraju vrijeme potrebno da postigne zadanu brzinu. Starost automobila nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the pushing time in s. Needed: both forces, the mass and the final speed; the age of the car is not needed.', `Resultant force: F = ${f(p.F)} N − ${f(p.res)} N = ${f(p.F - p.res)} N`, `a = F / m = ${f(p.F - p.res)} N / ${f(p.m)} kg = ${f((p.F - p.res) / p.m)} m/s²`, `t = v / a = ${f(p.v)} m/s / ${f((p.F - p.res) / p.m)} m/s² = ${f(p.v * p.m / (p.F - p.res))} s`],
        hr: (p, f) => ['Traži se: vrijeme guranja u s. Važni podaci: obje sile, masa i konačna brzina; starost automobila nije potrebna.', `Rezultantna sila: F = ${f(p.F)} N − ${f(p.res)} N = ${f(p.F - p.res)} N`, `a = F / m = ${f(p.F - p.res)} N / ${f(p.m)} kg = ${f((p.F - p.res) / p.m)} m/s²`, `t = v / a = ${f(p.v)} m/s / ${f((p.F - p.res) / p.m)} m/s² = ${f(p.v * p.m / (p.F - p.res))} s`]
      }
    }
  ]);

  /* ---------- GRAVITY / GRAVITACIJA ---------- */
  window.Content.registerProblems('gravity', [
    {
      id: 'ctx-red-lake-drop', level: 3,
      params: R => ({ t: R.step(3, 6, 0.5), mg: R.pick([20, 30, 50, 80]), depth: R.pick([250, 260, 270, 280]) }),
      text: {
        en: (p, f) => `At the viewpoint above the Red Lake (Crveno jezero) near Imotski a guide tells you that a small stone of ${f(p.mg)} g, breaking off the edge, falls for ${f(p.t)} s before it hits the water, and that the lake itself is about ${f(p.depth)} m deep. Your friend bets that the viewpoint is less than ${f(100)} m above the water. How high above the water is it, in metres? Use g = 10 m/s² and ignore air resistance.`,
        hr: (p, f) => `Na vidikovcu iznad Crvenog jezera kod Imotskog vodič ti kaže da kamenčić mase ${f(p.mg)} g, kad se odlomi s ruba, pada ${f(p.t)} s prije nego što udari u vodu, a da je samo jezero duboko oko ${f(p.depth)} m. Prijatelj se kladi da je vidikovac manje od ${f(100)} m iznad vode. Koliko je metara vidikovac iznad vode? Uzmi g = 10 m/s² i zanemari otpor zraka.`
      },
      answer: p => 5 * p.t * p.t, unit: 'm', tol: 0.03,
      hint: { en: 'Only the time of the fall and g matter; the mass of the stone and the depth of the lake do not. In free fall the distance grows with the square of the time.', hr: 'Važni su samo vrijeme pada i g; masa kamenčića i dubina jezera nisu. Pri slobodnom padu put raste s kvadratom vremena.' },
      steps: {
        en: (p, f) => [`Asked: the height of the fall in m. Needed: the time ${f(p.t)} s and g; the mass of the stone and the depth of the lake are not needed.`, `h = g · t² / 2 = 10 m/s² · (${f(p.t)} s)² / 2`, `h = 10 m/s² · ${f(p.t * p.t)} s² / 2 = ${f(5 * p.t * p.t)} m`, `That is ${5 * p.t * p.t < 100 ? 'less' : 'more'} than ${f(100)} m, so your friend ${5 * p.t * p.t < 100 ? 'wins' : 'loses'} the bet.`],
        hr: (p, f) => [`Traži se: visina pada u m. Važni podaci: vrijeme ${f(p.t)} s i g; masa kamenčića i dubina jezera nisu potrebne.`, `h = g · t² / 2 = 10 m/s² · (${f(p.t)} s)² / 2`, `h = 10 m/s² · ${f(p.t * p.t)} s² / 2 = ${f(5 * p.t * p.t)} m`, `To je ${5 * p.t * p.t < 100 ? 'manje' : 'više'} od ${f(100)} m, pa prijatelj ${5 * p.t * p.t < 100 ? 'dobiva' : 'gubi'} okladu.`]
      }
    }
  ]);

  /* ---------- PRESSURE / TLAK ---------- */
  window.Content.registerProblems('pressure', [
    {
      id: 'ctx-skis-on-snow', level: 3,
      params: R => { const ski = R.pick([[100, 10], [110, 10], [120, 10], [130, 10], [140, 10], [150, 10], [125, 8], [150, 8]]); return { m: R.step(40, 70, 5), L: ski[0], w: ski[1], snow: R.int(25, 60), temp: R.int(2, 9) }; },
      text: {
        en: (p, f) => `After a night of snowfall there are ${f(p.snow)} cm of fresh powder on Sljeme and the thermometer shows ${f(p.temp)} °C below zero. In boots you sink in up to your knees, so you wonder how much gentler skis are on the snow. With all your gear you have a mass of ${f(p.m)} kg, and each ski touches the snow over a length of ${f(p.L)} cm and a width of ${f(p.w)} cm. What pressure, in Pa, do you put on the snow when you stand on both skis? Use g = 10 N/kg.`,
        hr: (p, f) => `Nakon noćnog snijega na Sljemenu ima ${f(p.snow)} cm svježeg pršića, a termometar pokazuje ${f(p.temp)} °C ispod nule. U čizmama propadaš do koljena, pa te zanima koliko su skije blaže prema snijegu. S opremom imaš masu ${f(p.m)} kg, a svaka skija dodiruje snijeg na duljini ${f(p.L)} cm i širini ${f(p.w)} cm. Kolikim tlakom, u Pa, djeluješ na snijeg dok stojiš na obje skije? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10 / (2 * p.L * p.w / 10000), unit: 'Pa', tol: 0.03,
      hint: { en: 'You need your weight and the total area of both skis in m². The depth of the snow and the temperature do not matter.', hr: 'Trebaju ti tvoja težina i ukupna površina obiju skija u m². Dubina snijega i temperatura nisu važne.' },
      steps: {
        en: (p, f) => ['Asked: the pressure in Pa. Needed: the mass and the length and width of the skis; the depth of the snow and the temperature are not needed.', `Weight: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Area of both skis: A = 2 · ${f(p.L)} cm · ${f(p.w)} cm = ${f(2 * p.L * p.w)} cm² = ${f(2 * p.L * p.w / 10000)} m²`, `p = G / A = ${f(p.m * 10)} N / ${f(2 * p.L * p.w / 10000)} m² = ${f(p.m * 10 / (2 * p.L * p.w / 10000))} Pa`],
        hr: (p, f) => ['Traži se: tlak u Pa. Važni podaci: masa te duljina i širina skija; dubina snijega i temperatura nisu potrebne.', `Težina: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Površina obiju skija: A = 2 · ${f(p.L)} cm · ${f(p.w)} cm = ${f(2 * p.L * p.w)} cm² = ${f(2 * p.L * p.w / 10000)} m²`, `p = G / A = ${f(p.m * 10)} N / ${f(2 * p.L * p.w / 10000)} m² = ${f(p.m * 10 / (2 * p.L * p.w / 10000))} Pa`]
      }
    }
  ]);

  /* ---------- DENSITY / GUSTOĆA ---------- */
  window.Content.registerProblems('density', [
    {
      id: 'ctx-olive-oil-canister', level: 3,
      params: R => ({ V: R.pick([2, 3, 5, 8, 10]), m0: R.step(0.2, 0.6, 0.1), price: R.int(10, 16) }),
      text: {
        en: (p, f) => `Your grandmother on Brač is sending you home with ${f(p.V)} L of her olive oil, which she usually sells for ${f(p.price)} € a litre. Your backpack is already heavy, so you want to know how much more you will carry. The density of olive oil is ${f(920)} kg/m³ and the empty canister has a mass of ${f(p.m0)} kg. What is the mass of the full canister, in kg?`,
        hr: (p, f) => `Baka s Brača šalje te kući s ${f(p.V)} L svojega maslinova ulja, koje inače prodaje po ${f(p.price)} € za litru. Ruksak ti je već težak, pa želiš znati koliko ćeš još nositi. Gustoća maslinova ulja je ${f(920)} kg/m³, a prazan kanistar ima masu ${f(p.m0)} kg. Kolika je masa punog kanistra, u kg?`
      },
      answer: p => 0.92 * p.V + p.m0, unit: 'kg', tol: 0.03,
      hint: { en: 'You need the volume of the oil in m³ (1 L = 0.001 m³), its density and the mass of the empty canister. The price does not matter.', hr: 'Trebaju ti obujam ulja u m³ (1 L = 0,001 m³), njegova gustoća i masa praznog kanistra. Cijena nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the mass of the full canister in kg. Needed: the volume, the density and the mass of the empty canister; the price is not needed.', `V = ${f(p.V)} L = ${f(p.V / 1000, p.V % 10 ? 3 : 2)} m³`, `Oil: m = ρ · V = ${f(920)} kg/m³ · ${f(p.V / 1000, p.V % 10 ? 3 : 2)} m³ = ${f(0.92 * p.V)} kg`, `Full canister: ${f(0.92 * p.V)} kg + ${f(p.m0)} kg = ${f(0.92 * p.V + p.m0)} kg`],
        hr: (p, f) => ['Traži se: masa punog kanistra u kg. Važni podaci: obujam, gustoća i masa praznog kanistra; cijena nije potrebna.', `V = ${f(p.V)} L = ${f(p.V / 1000, p.V % 10 ? 3 : 2)} m³`, `Ulje: m = ρ · V = ${f(920)} kg/m³ · ${f(p.V / 1000, p.V % 10 ? 3 : 2)} m³ = ${f(0.92 * p.V)} kg`, `Pun kanistar: ${f(0.92 * p.V)} kg + ${f(p.m0)} kg = ${f(0.92 * p.V + p.m0)} kg`]
      }
    },
    {
      id: 'ctx-silver-spoon-check', level: 3,
      params: R => { const rho = R.pick([10.5, 8.9, 7.9, 2.7]); const dV = R.pick([4, 5, 6, 8, 10]); const V1 = R.step(40, 70, 5); return { rho, V1, V2: V1 + dV, m: Math.round(rho * dV * 10) / 10, price: R.int(15, 40) }; },
      text: {
        en: (p, f) => `Your grandfather bought a "solid silver" spoon for ${f(p.price)} € at the Sunday antiques fair on Britanski trg in Zagreb, and you want to check the seller's claim. The kitchen scale shows ${f(p.m)} g. When you lower the spoon into a measuring cylinder, the water level rises from ${f(p.V1)} mL to ${f(p.V2)} mL. Silver has a density of ${f(10.5)} g/cm³. What is the density of the spoon, in g/cm³?`,
        hr: (p, f) => `Djed je na nedjeljnom sajmu antikviteta na Britanskom trgu u Zagrebu za ${f(p.price)} € kupio žlicu od "čistog srebra", a ti želiš provjeriti prodavačevu tvrdnju. Kuhinjska vaga pokazuje ${f(p.m)} g. Kad žlicu spustiš u menzuru, razina vode poraste s ${f(p.V1)} mL na ${f(p.V2)} mL. Gustoća srebra je ${f(10.5)} g/cm³. Kolika je gustoća žlice, u g/cm³?`
      },
      answer: p => p.m / (p.V2 - p.V1), unit: 'g/cm³', tol: 0.03,
      hint: { en: 'You need the mass and the volume of the spoon; the volume is the rise of the water level (1 mL = 1 cm³). The price does not matter.', hr: 'Trebaju ti masa i obujam žlice; obujam je jednak porastu razine vode (1 mL = 1 cm³). Cijena nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the density of the spoon in g/cm³. Needed: the mass and the two water levels; the price is not needed.', `V = ${f(p.V2)} mL − ${f(p.V1)} mL = ${f(p.V2 - p.V1)} mL = ${f(p.V2 - p.V1)} cm³`, `ρ = m / V = ${f(p.m)} g / ${f(p.V2 - p.V1)} cm³ = ${f(p.m / (p.V2 - p.V1))} g/cm³`, `Silver has ${f(10.5)} g/cm³, so the spoon ${Math.abs(p.rho - 10.5) < 0.3 ? 'may well be silver' : 'is not solid silver'}.`],
        hr: (p, f) => ['Traži se: gustoća žlice u g/cm³. Važni podaci: masa i dvije razine vode; cijena nije potrebna.', `V = ${f(p.V2)} mL − ${f(p.V1)} mL = ${f(p.V2 - p.V1)} mL = ${f(p.V2 - p.V1)} cm³`, `ρ = m / V = ${f(p.m)} g / ${f(p.V2 - p.V1)} cm³ = ${f(p.m / (p.V2 - p.V1))} g/cm³`, `Srebro ima ${f(10.5)} g/cm³, pa žlica ${Math.abs(p.rho - 10.5) < 0.3 ? 'doista može biti srebrna' : 'nije od čistog srebra'}.`]
      }
    }
  ]);

  /* ---------- ENERGY / ENERGIJA ---------- */
  window.Content.registerProblems('energy', [
    {
      id: 'ctx-cable-car-power', level: 3,
      params: R => ({ m: R.pick([1200, 1500, 1600, 1800, 2000, 2400]), t: R.pick([15, 20, 25]) }),
      text: {
        en: (p, f) => `You ride the Sljeme cable car in Zagreb and wonder how strong its motor has to be. The line is about ${f(5)} km long and climbs through a height difference of ${f(750)} m; the ride takes ${f(p.t)} min. A gondola with its passengers has a mass of ${f(p.m)} kg. What power, in kW, is needed just to lift this one gondola? Use g = 10 N/kg.`,
        hr: (p, f) => `Voziš se sljemenskom žičarom u Zagrebu i pitaš se koliko joj snažan mora biti motor. Trasa je duga oko ${f(5)} km i svladava visinsku razliku od ${f(750)} m, a vožnja traje ${f(p.t)} min. Gondola s putnicima ima masu ${f(p.m)} kg. Kolika je snaga, u kW, potrebna samo za podizanje te jedne gondole? Uzmi g = 10 N/kg.`
      },
      answer: p => p.m * 10 * 750 / (p.t * 60) / 1000, unit: 'kW', tol: 0.03,
      hint: { en: 'The mass, the height difference and the time in seconds matter. The length of the line does not.', hr: 'Važni su masa, visinska razlika i vrijeme u sekundama. Duljina trase nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the power in kW. Needed: the mass, the height difference and the time; the length of the line is not needed.', `Work: W = m · g · h = ${f(p.m)} kg · 10 N/kg · ${f(750)} m = ${f(p.m * 7500)} J`, `Time: t = ${f(p.t)} min = ${f(p.t * 60)} s`, `P = W / t = ${f(p.m * 7500)} J / ${f(p.t * 60)} s = ${f(p.m * 7500 / (p.t * 60))} W = ${f(p.m * 7500 / (p.t * 60) / 1000)} kW`],
        hr: (p, f) => ['Traži se: snaga u kW. Važni podaci: masa, visinska razlika i vrijeme; duljina trase nije potrebna.', `Rad: W = m · g · h = ${f(p.m)} kg · 10 N/kg · ${f(750)} m = ${f(p.m * 7500)} J`, `Vrijeme: t = ${f(p.t)} min = ${f(p.t * 60)} s`, `P = W / t = ${f(p.m * 7500)} J / ${f(p.t * 60)} s = ${f(p.m * 7500 / (p.t * 60))} W = ${f(p.m * 7500 / (p.t * 60) / 1000)} kW`]
      }
    },
    {
      id: 'ctx-rock-jump-speed', level: 3,
      params: R => { const v = R.pick([5, 6, 7, 8, 10]); return { v, h: v * v / 20, depth: R.int(4, 8), m: R.int(40, 60) }; },
      text: {
        en: (p, f) => `At Makarska you jump feet first into the sea from a rock ${f(p.h)} m above the water; the sea below it is ${f(p.depth)} m deep and your mass is ${f(p.m)} kg. Your friend bets that you hit the water faster than a cyclist riding at ${f(20)} km/h. With what speed, in km/h, do you reach the water? Use g = 10 N/kg and ignore air resistance.`,
        hr: (p, f) => `U Makarskoj skačeš na noge u more sa stijene visoke ${f(p.h)} m iznad vode; more je ispod nje duboko ${f(p.depth)} m, a tvoja je masa ${f(p.m)} kg. Prijatelj se kladi da u vodu ulijećeš brže nego što vozi biciklist pri ${f(20)} km/h. Kolikom brzinom, u km/h, stižeš do vode? Uzmi g = 10 N/kg i zanemari otpor zraka.`
      },
      answer: p => p.v * 3.6, unit: 'km/h', tol: 0.03,
      hint: { en: 'Only the height and g matter: the potential energy at the top turns into kinetic energy at the water, and the mass cancels. Change m/s into km/h at the end.', hr: 'Važni su samo visina i g: potencijalna energija na vrhu prelazi u kinetičku pri vodi, a masa se pokrati. Na kraju m/s pretvori u km/h.' },
      steps: {
        en: (p, f) => [`Asked: the speed at the water in km/h. Needed: the height ${f(p.h)} m and g; your mass and the depth of the sea are not needed.`, `m · g · h = m · v² / 2, the mass cancels: v² = 2 · g · h = 2 · 10 N/kg · ${f(p.h)} m = ${f(p.v * p.v)} m²/s²`, `v = ${f(p.v)} m/s = ${f(p.v)} · ${f(3.6)} km/h = ${f(p.v * 3.6)} km/h`, `That is ${p.v * 3.6 > 20 ? 'more' : 'less'} than ${f(20)} km/h, so your friend ${p.v * 3.6 > 20 ? 'wins' : 'loses'} the bet.`],
        hr: (p, f) => [`Traži se: brzina pri vodi u km/h. Važni podaci: visina ${f(p.h)} m i g; tvoja masa i dubina mora nisu potrebne.`, `m · g · h = m · v² / 2, masa se pokrati: v² = 2 · g · h = 2 · 10 N/kg · ${f(p.h)} m = ${f(p.v * p.v)} m²/s²`, `v = ${f(p.v)} m/s = ${f(p.v)} · ${f(3.6)} km/h = ${f(p.v * 3.6)} km/h`, `To je ${p.v * 3.6 > 20 ? 'više' : 'manje'} od ${f(20)} km/h, pa prijatelj ${p.v * 3.6 > 20 ? 'dobiva' : 'gubi'} okladu.`]
      }
    }
  ]);

  /* ---------- HEAT / TOPLINA ---------- */
  window.Content.registerProblems('heat', [
    {
      id: 'ctx-bura-bed-brick', level: 3,
      params: R => ({ m: R.step(2, 4, 0.5), T1: R.pick([70, 80, 90]), T2: R.pick([25, 30, 35]), wind: R.step(90, 150, 10) }),
      text: {
        en: (p, f) => `On a winter night in Senj the bura is blowing at ${f(p.wind)} km/h, and your grandmother warms your bed the old way: she heats a brick of ${f(p.m)} kg in the oven to ${f(p.T1)} °C, wraps it in a towel and puts it under the blanket. By morning the brick has cooled to ${f(p.T2)} °C. You want to compare it with a hot-water bottle, so: how much heat, in kJ, did the brick give to the bed? The specific heat capacity of brick is ${f(800)} J/(kg·°C).`,
        hr: (p, f) => `Zimske noći u Senju puše bura brzinom ${f(p.wind)} km/h, a baka ti grije krevet na starinski način: ciglu mase ${f(p.m)} kg zagrije u pećnici na ${f(p.T1)} °C, umota je u ručnik i stavi pod pokrivač. Do jutra se cigla ohladi na ${f(p.T2)} °C. Želiš je usporediti s termoforom, pa te zanima: koliko je topline, u kJ, cigla predala krevetu? Specifični toplinski kapacitet cigle je ${f(800)} J/(kg·°C).`
      },
      answer: p => p.m * 800 * (p.T1 - p.T2) / 1000, unit: 'kJ', tol: 0.03,
      hint: { en: 'The mass of the brick, its temperature change and its specific heat capacity matter. The speed of the bura does not.', hr: 'Važni su masa cigle, promjena njezine temperature i specifični toplinski kapacitet. Brzina bure nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the heat given off in kJ. Needed: the mass, the two temperatures and the specific heat capacity; the speed of the bura is not needed.', `ΔT = ${f(p.T1)} °C − ${f(p.T2)} °C = ${f(p.T1 - p.T2)} °C`, `Q = m · c · ΔT = ${f(p.m)} kg · ${f(800)} J/(kg·°C) · ${f(p.T1 - p.T2)} °C = ${f(p.m * 800 * (p.T1 - p.T2))} J`, `Q = ${f(p.m * 800 * (p.T1 - p.T2) / 1000)} kJ`],
        hr: (p, f) => ['Traži se: predana toplina u kJ. Važni podaci: masa, dvije temperature i specifični toplinski kapacitet; brzina bure nije potrebna.', `ΔT = ${f(p.T1)} °C − ${f(p.T2)} °C = ${f(p.T1 - p.T2)} °C`, `Q = m · c · ΔT = ${f(p.m)} kg · ${f(800)} J/(kg·°C) · ${f(p.T1 - p.T2)} °C = ${f(p.m * 800 * (p.T1 - p.T2))} J`, `Q = ${f(p.m * 800 * (p.T1 - p.T2) / 1000)} kJ`]
      }
    },
    {
      id: 'ctx-shower-cost', level: 3,
      params: R => { const temps = R.pick([[14, 38], [16, 40], [10, 40], [12, 42]]); return { V: R.pick([30, 40, 50, 60]), T1: temps[0], T2: temps[1], cap: R.pick([50, 80, 100]), price: R.pick([0.14, 0.15, 0.16, 0.18]) }; },
      text: {
        en: (p, f) => `Your parents say your showers are too expensive, and you want to check. One shower uses ${f(p.V)} L of water (1 L has a mass of 1 kg), which the electric boiler heats from ${f(p.T1)} °C to ${f(p.T2)} °C. The boiler holds ${f(p.cap)} L. The specific heat capacity of water is ${f(4200)} J/(kg·°C), 1 kWh is ${f(3600000)} J, and 1 kWh costs ${f(p.price)} €. How many cents does one shower cost?`,
        hr: (p, f) => `Roditelji kažu da su tvoja tuširanja preskupa, a ti to želiš provjeriti. Za jedno tuširanje potrošiš ${f(p.V)} L vode (1 L ima masu 1 kg), koju električni bojler zagrije s ${f(p.T1)} °C na ${f(p.T2)} °C. U bojler stane ${f(p.cap)} L. Specifični toplinski kapacitet vode je ${f(4200)} J/(kg·°C), 1 kWh iznosi ${f(3600000)} J, a 1 kWh stoji ${f(p.price)} €. Koliko centi stoji jedno tuširanje?`
      },
      answer: p => p.V * 4200 * (p.T2 - p.T1) / 3600000 * p.price * 100, unit: { en: 'cents', hr: 'centi' }, tol: 0.03,
      hint: { en: 'The mass of the water, its temperature change and the price of 1 kWh matter. The size of the boiler does not. Find the heat in J, change it into kWh, then into money.', hr: 'Važni su masa vode, promjena temperature i cijena 1 kWh. Veličina bojlera nije važna. Izračunaj toplinu u J, pretvori je u kWh, pa u novac.' },
      steps: {
        en: (p, f) => ['Asked: the cost in cents. Needed: the amount of water, the two temperatures and the price of 1 kWh; the size of the boiler is not needed.', `Q = m · c · ΔT = ${f(p.V)} kg · ${f(4200)} J/(kg·°C) · ${f(p.T2 - p.T1)} °C = ${f(p.V * 4200 * (p.T2 - p.T1))} J`, `E = ${f(p.V * 4200 * (p.T2 - p.T1))} J / ${f(3600000)} J/kWh = ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000)} kWh`, `Price: ${f(p.price)} € = ${f(p.price * 100)} cents for 1 kWh`, `Cost: ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000)} kWh · ${f(p.price * 100)} cents/kWh = ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000 * p.price * 100)} cents`],
        hr: (p, f) => ['Traži se: cijena u centima. Važni podaci: količina vode, dvije temperature i cijena 1 kWh; veličina bojlera nije potrebna.', `Q = m · c · ΔT = ${f(p.V)} kg · ${f(4200)} J/(kg·°C) · ${f(p.T2 - p.T1)} °C = ${f(p.V * 4200 * (p.T2 - p.T1))} J`, `E = ${f(p.V * 4200 * (p.T2 - p.T1))} J / ${f(3600000)} J/kWh = ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000)} kWh`, `Cijena: ${f(p.price)} € = ${f(p.price * 100)} centi za 1 kWh`, `Trošak u centima: ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000)} kWh · ${f(p.price * 100)} centi/kWh = ${f(p.V * 4200 * (p.T2 - p.T1) / 3600000 * p.price * 100)}`]
      }
    }
  ]);

  /* ---------- ELECTRICITY / ELEKTRICITET ---------- */
  window.Content.registerProblems('electricity', [
    {
      id: 'ctx-led-advert-saving', level: 3,
      params: R => ({ Pold: R.pick([40, 60, 75, 100]), Pled: R.pick([5, 8, 10, 12]), h: R.pick([2, 3, 4, 5, 6]), price: R.pick([0.14, 0.15, 0.16, 0.2]), cost: R.step(3, 6, 0.5), claim: R.pick([10, 20]) }),
      text: {
        en: (p, f) => `An advert claims: "Swap your old ${f(p.Pold)} W bulb for our ${f(p.Pled)} W LED bulb and save more than ${f(p.claim)} € a year!" The LED bulb costs ${f(p.cost)} € and should last ${f(15000)} h. The lamp in your room is on for about ${f(p.h)} h a day, and 1 kWh costs ${f(p.price)} €. How many euros would you really save in a year (365 days)?`,
        hr: (p, f) => `Reklama tvrdi: "Zamijenite staru žarulju od ${f(p.Pold)} W našom LED žaruljom od ${f(p.Pled)} W i uštedite više od ${f(p.claim)} € godišnje!" LED žarulja stoji ${f(p.cost)} € i trebala bi trajati ${f(15000)} h. Svjetiljka u tvojoj sobi svijetli oko ${f(p.h)} h dnevno, a 1 kWh stoji ${f(p.price)} €. Kolika bi doista bila tvoja ušteda u godini dana (365 dana), u eurima?`
      },
      answer: p => (p.Pold - p.Pled) / 1000 * p.h * 365 * p.price, unit: '€', tol: 0.03,
      hint: { en: 'What matters is the difference between the two powers, the hours per day and the price of 1 kWh. The price and the lifetime of the LED bulb do not matter for the yearly saving.', hr: 'Važni su razlika dviju snaga, broj sati dnevno i cijena 1 kWh. Cijena i trajnost LED žarulje nisu važne za godišnju uštedu.' },
      steps: {
        en: (p, f) => ['Asked: the yearly saving in €. Needed: both powers, the hours per day and the price of 1 kWh; the price and the lifetime of the LED bulb are not needed.', `Power saved: ${f(p.Pold)} W − ${f(p.Pled)} W = ${f(p.Pold - p.Pled)} W = ${f((p.Pold - p.Pled) / 1000, (p.Pold - p.Pled) % 10 ? 3 : 2)} kW`, `Energy saved in a year: E = P · t = ${f((p.Pold - p.Pled) / 1000, (p.Pold - p.Pled) % 10 ? 3 : 2)} kW · ${f(p.h)} h · ${f(365)} = ${f((p.Pold - p.Pled) / 1000 * p.h * 365)} kWh`, `Saving: ${f((p.Pold - p.Pled) / 1000 * p.h * 365)} kWh · ${f(p.price)} €/kWh = ${f((p.Pold - p.Pled) / 1000 * p.h * 365 * p.price)} €`, `The advert promised more than ${f(p.claim)} €, so for you the claim is ${(p.Pold - p.Pled) / 1000 * p.h * 365 * p.price > p.claim ? 'true' : 'not true'}.`],
        hr: (p, f) => ['Traži se: godišnja ušteda u €. Važni podaci: obje snage, broj sati dnevno i cijena 1 kWh; cijena i trajnost LED žarulje nisu potrebne.', `Ušteđena snaga: ${f(p.Pold)} W − ${f(p.Pled)} W = ${f(p.Pold - p.Pled)} W = ${f((p.Pold - p.Pled) / 1000, (p.Pold - p.Pled) % 10 ? 3 : 2)} kW`, `Ušteđena energija u godini dana: E = P · t = ${f((p.Pold - p.Pled) / 1000, (p.Pold - p.Pled) % 10 ? 3 : 2)} kW · ${f(p.h)} h · ${f(365)} = ${f((p.Pold - p.Pled) / 1000 * p.h * 365)} kWh`, `Ušteda: ${f((p.Pold - p.Pled) / 1000 * p.h * 365)} kWh · ${f(p.price)} €/kWh = ${f((p.Pold - p.Pled) / 1000 * p.h * 365 * p.price)} €`, `Reklama je obećala više od ${f(p.claim)} €, pa za tebe ta tvrdnja ${(p.Pold - p.Pled) / 1000 * p.h * 365 * p.price > p.claim ? 'vrijedi' : 'ne vrijedi'}.`]
      }
    }
  ]);

  /* ---------- WAVES / VALOVI ---------- */
  window.Content.registerProblems('waves', [
    {
      id: 'ctx-canyon-echo', level: 3,
      params: R => ({ t: R.step(1, 4, 0.5), H: R.pick([200, 250, 300, 350]), bet: R.pick([300, 400, 500]) }),
      text: {
        en: (p, f) => `In the Velika Paklenica canyon you shout towards the opposite rock face, which towers ${f(p.H)} m above you, and the echo comes back after ${f(p.t)} s. Your friend bets that the rock face is more than ${f(p.bet)} m away. How far away is it, in metres? Sound travels through air at 340 m/s.`,
        hr: (p, f) => `U kanjonu Velike Paklenice vikneš prema nasuprotnoj stijeni, koja se nad tobom uzdiže ${f(p.H)} m, a jeka se vrati nakon ${f(p.t)} s. Prijatelj se kladi da je stijena udaljena više od ${f(p.bet)} m. Koliko je metara stijena udaljena? Zvuk se zrakom širi brzinom 340 m/s.`
      },
      answer: p => 170 * p.t, unit: 'm', tol: 0.03,
      hint: { en: 'Only the time of the echo and the speed of sound matter, and remember that the sound travels there and back. The height of the rock face does not matter.', hr: 'Važni su samo vrijeme jeke i brzina zvuka, a zvuk prijeđe put do stijene i natrag. Visina stijene nije važna.' },
      steps: {
        en: (p, f) => [`Asked: the distance to the rock face in m. Needed: the echo time ${f(p.t)} s and the speed of sound; the height of the rock face is not needed.`, `Path of the sound there and back: s = v · t = 340 m/s · ${f(p.t)} s = ${f(340 * p.t)} m`, `Distance: d = ${f(340 * p.t)} m / 2 = ${f(170 * p.t)} m`, `That is ${170 * p.t > p.bet ? 'more' : 'less'} than ${f(p.bet)} m, so your friend ${170 * p.t > p.bet ? 'wins' : 'loses'} the bet.`],
        hr: (p, f) => [`Traži se: udaljenost stijene u m. Važni podaci: vrijeme jeke ${f(p.t)} s i brzina zvuka; visina stijene nije potrebna.`, `Put zvuka do stijene i natrag: s = v · t = 340 m/s · ${f(p.t)} s = ${f(340 * p.t)} m`, `Udaljenost: d = ${f(340 * p.t)} m / 2 = ${f(170 * p.t)} m`, `To je ${170 * p.t > p.bet ? 'više' : 'manje'} od ${f(p.bet)} m, pa prijatelj ${170 * p.t > p.bet ? 'dobiva' : 'gubi'} okladu.`]
      }
    }
  ]);

  /* ---------- LEVERS / POLUGE ---------- */
  window.Content.registerProblems('levers', [
    {
      id: 'ctx-drystone-crowbar', level: 3,
      params: R => { const c = R.pick([{ L: 2, d: 40, k: 4 }, { L: 2, d: 25, k: 7 }, { L: 2, d: 20, k: 9 }, { L: 1.5, d: 30, k: 4 }, { L: 1.5, d: 25, k: 5 }, { L: 1.5, d: 15, k: 9 }]); const F = R.step(50, 150, 10); return { L: c.L, d: c.d, m: F * c.k / 10, wall: R.int(15, 40) }; },
      text: {
        en: (p, f) => `On Hvar you are helping your grandfather repair a dry-stone wall ${f(p.wall)} m long. A stone of ${f(p.m)} kg has to be lifted, so he gives you an iron bar ${f(p.L)} m long. You slide one end under the stone and put a small rock under the bar as a support, ${f(p.d)} cm from that end. With what force, in N, must you press down on the other end to lift the stone? Use g = 10 N/kg and ignore the weight of the bar.`,
        hr: (p, f) => `Na Hvaru pomažeš djedu popraviti suhozid dug ${f(p.wall)} m. Treba podići kamen mase ${f(p.m)} kg, pa ti djed da željeznu polugu dugu ${f(p.L)} m. Jedan kraj podvučeš pod kamen, a pod polugu, ${f(p.d)} cm od tog kraja, podmetneš manji kamen kao oslonac. Kolikom silom, u N, moraš pritisnuti drugi kraj da podigneš kamen? Uzmi g = 10 N/kg i zanemari težinu poluge.`
      },
      answer: p => p.m * 10 * p.d / (p.L * 100 - p.d), unit: 'N', tol: 0.03,
      hint: { en: 'You need the weight of the stone and the two arms of the lever in the same unit: from the support to the stone, and from the support to your hands. The length of the wall does not matter.', hr: 'Trebaju ti težina kamena i oba kraka poluge u istoj jedinici: od oslonca do kamena i od oslonca do tvojih ruku. Duljina zida nije važna.' },
      steps: {
        en: (p, f) => ['Asked: the force of your hands in N. Needed: the mass of the stone, the length of the bar and the place of the support; the length of the wall is not needed.', `Weight of the stone: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Arms: ${f(p.d)} cm for the stone and ${f(p.L * 100)} cm − ${f(p.d)} cm = ${f(p.L * 100 - p.d)} cm for your hands`, `Balance: F · ${f(p.L * 100 - p.d)} cm = ${f(p.m * 10)} N · ${f(p.d)} cm`, `F = ${f(p.m * 10)} N · ${f(p.d)} cm / ${f(p.L * 100 - p.d)} cm = ${f(p.m * 10 * p.d / (p.L * 100 - p.d))} N`],
        hr: (p, f) => ['Traži se: sila tvojih ruku u N. Važni podaci: masa kamena, duljina poluge i položaj oslonca; duljina zida nije potrebna.', `Težina kamena: G = m · g = ${f(p.m)} kg · 10 N/kg = ${f(p.m * 10)} N`, `Krakovi: ${f(p.d)} cm za kamen i ${f(p.L * 100)} cm − ${f(p.d)} cm = ${f(p.L * 100 - p.d)} cm za tvoje ruke`, `Ravnoteža: F · ${f(p.L * 100 - p.d)} cm = ${f(p.m * 10)} N · ${f(p.d)} cm`, `F = ${f(p.m * 10)} N · ${f(p.d)} cm / ${f(p.L * 100 - p.d)} cm = ${f(p.m * 10 * p.d / (p.L * 100 - p.d))} N`]
      }
    }
  ]);
})();
