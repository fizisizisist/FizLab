/* FizLab topic: Work, Energy and Power / Rad, energija i snaga */
(function () {
  'use strict';
  window.Content.register({
    id: 'energy',
    order: 80,
    gradeLevel: 7,
    color: 'c8',
    title: { en: 'Work, Energy and Power', hr: 'Rad, energija i snaga' },
    intro: {
      en: 'Why does a roller coaster need no engine after the first hill? Discover what work, energy and power really mean, and measure your own power on the stairs.',
      hr: 'Zašto vlak smrti ne treba motor nakon prvog brijega? Otkrij što rad, energija i snaga zaista znače i izmjeri vlastitu snagu na stubama.'
    },
    sims: ['energy', 'spring', 'energybars'],

    lesson: [
      {
        h: { en: 'Work in physics', hr: 'Rad u fizici' },
        p: {
          en: [
            'In everyday life, work can mean homework or a job. In physics, work has a precise meaning: work is done when a force moves something. You do work when you lift a bag, push a cart or pull a sled. The bigger the force and the longer the path, the more work is done. Work is written W and measured in joules (J).',
            'The formula is W = F · s: work equals force times the distance moved in the direction of the force. Lifting a 1 kg bag (weight about 10 N) up by 1 m takes about 10 J of work. Lifting it 2 m takes 20 J, and lifting a 2 kg bag 2 m takes 40 J.',
            'Here is the surprising part: if nothing moves, no work is done, no matter how hard you push. Holding a heavy bag still, or pushing a wall that does not budge, is zero work in physics, even though your muscles get tired. Work needs both a force and a movement.'
          ],
          hr: [
            'U svakodnevnom životu rad može značiti zadaću ili posao. U fizici rad ima točno značenje: rad se obavlja kad sila pomiče tijelo. Obavljaš rad kad podižeš torbu, guraš kolica ili vučeš sanjke. Što je sila veća i put dulji, rad je veći. Rad označavamo slovom W i mjerimo u džulima (J).',
            'Formula glasi W = F · s: rad je jednak umnošku sile i puta prijeđenog u smjeru sile. Da podigneš vrećicu mase 1 kg (težina oko 10 N) za 1 m, trebaš oko 10 J rada. Za 2 m visine treba 20 J, a za vrećicu od 2 kg podignutu 2 m treba 40 J.',
            'Evo iznenađenja: ako se ništa ne pomakne, rad nije obavljen, ma koliko jako gurao. Držati tešku torbu u mjestu ili gurati zid koji se ne miče u fizici je nula rada, iako se mišići umore. Za rad trebaju i sila i pomak.'
          ]
        },
        svg: '<svg viewBox="0 0 420 120" role="img"><defs><marker id="en-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><line x1="20" y1="105" x2="400" y2="105" stroke="var(--muted)" stroke-width="2"/><rect x="60" y="65" width="50" height="40" rx="5" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><rect x="290" y="65" width="50" height="40" rx="5" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2" stroke-dasharray="5 4"/><line x1="115" y1="85" x2="175" y2="85" stroke="var(--c8)" stroke-width="5" marker-end="url(#en-ar)"/><text x="145" y="72" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">F</text><line x1="85" y1="30" x2="315" y2="30" stroke="var(--c1)" stroke-width="2" marker-start="url(#en-ar)" marker-end="url(#en-ar)"/><text x="200" y="22" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">s</text><text x="200" y="60" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">W = F · s</text></svg>'
      },
      {
        h: { en: 'Energy and its forms', hr: 'Energija i njezini oblici' },
        p: {
          en: [
            'Energy is the ability to do work. Whatever can move something, heat it up, light it or make a sound has energy. Energy is measured in joules too, the same unit as work, because work is simply energy being passed from one object to another. When you lift the bag, 10 J of energy moves from your muscles into the bag.',
            'Energy comes in many forms. A moving ball has kinetic energy. A book on a high shelf has gravitational potential energy. A stretched bow has elastic energy. Hot soup has thermal (internal) energy. Food and fuel store chemical energy. There is also electrical energy in wires, light energy from the Sun and sound energy from a drum.',
            'All these forms can change into each other. The chemical energy in your breakfast becomes the kinetic energy of your bike, the chemical energy in a battery becomes light in a torch, and the light energy of the Sun becomes chemical energy in plants. Physics is largely the story of energy changing form.'
          ],
          hr: [
            'Energija je sposobnost obavljanja rada. Sve što može nešto pokrenuti, zagrijati, osvijetliti ili proizvesti zvuk ima energiju. I energiju mjerimo u džulima, istom jedinicom kao rad, jer je rad zapravo energija koja prelazi s jednog tijela na drugo. Kad podigneš vrećicu, 10 J energije prijeđe iz tvojih mišića u vrećicu.',
            'Energija dolazi u mnogo oblika. Lopta koja se giba ima kinetičku energiju. Knjiga na visokoj polici ima gravitacijsku potencijalnu energiju. Napeti luk ima elastičnu energiju. Vruća juha ima toplinsku (unutarnju) energiju. Hrana i gorivo pohranjuju kemijsku energiju. Postoje i električna energija u žicama, energija svjetlosti sa Sunca i energija zvuka iz bubnja.',
            'Svi se ti oblici mogu pretvarati jedni u druge. Kemijska energija iz tvog doručka postaje kinetička energija bicikla, kemijska energija baterije postaje svjetlost džepne svjetiljke, a svjetlosna energija Sunca postaje kemijska energija u biljkama. Fizika je velikim dijelom priča o pretvorbama energije.'
          ]
        }
      },
      {
        h: { en: 'Kinetic and potential energy', hr: 'Kinetička i potencijalna energija' },
        p: {
          en: [
            'Kinetic energy is the energy of motion. It depends on mass and speed: E_k = ½ · m · v², half the mass times the speed squared. A 2 kg ball moving at 3 m/s has ½ · 2 · 9 = 9 J. Because the speed is squared, doubling the speed gives four times the energy, and tripling it gives nine times.',
            'That square is why speeding is so dangerous. A car at 100 km/h has four times the kinetic energy of the same car at 50 km/h, so it needs about four times the distance to brake, and a crash does four times the damage. Small increases in speed mean big increases in energy.',
            'Gravitational potential energy is stored energy an object has because of its height: E_p = m · g · h, mass times g (about 10 N/kg) times height. A 1 kg book on a 2 m shelf has 1 · 10 · 2 = 20 J. Lift it twice as high and it stores twice as much. When the book falls, this stored energy turns into kinetic energy.'
          ],
          hr: [
            'Kinetička energija je energija gibanja. Ovisi o masi i brzini: E_k = ½ · m · v², dakle polovina mase pomnožena s kvadratom brzine. Lopta mase 2 kg koja se giba brzinom 3 m/s ima ½ · 2 · 9 = 9 J. Budući da je brzina na kvadrat, dvostruko veća brzina daje četiri puta veću energiju, a trostruko veća čak devet puta.',
            'Upravo zbog tog kvadrata prebrza vožnja je tako opasna. Automobil pri 100 km/h ima četiri puta veću kinetičku energiju nego isti automobil pri 50 km/h, pa mu treba oko četiri puta dulji put za kočenje, a sudar čini četiri puta veću štetu. Malo povećanje brzine znači veliko povećanje energije.',
            'Gravitacijska potencijalna energija je pohranjena energija koju tijelo ima zbog svoje visine: E_p = m · g · h, dakle masa puta g (oko 10 N/kg) puta visina. Knjiga mase 1 kg na polici visokoj 2 m ima 1 · 10 · 2 = 20 J. Podigni je dvostruko više i pohranit će dvostruko više energije. Kad knjiga padne, ta se pohranjena energija pretvara u kinetičku.'
          ]
        }
      },
      {
        h: { en: 'Energy is conserved', hr: 'Očuvanje energije' },
        p: {
          en: [
            'Energy cannot be created or destroyed, only changed from one form to another. This is the law of conservation of energy, one of the most important rules in all of physics. The total amount of energy always stays the same; it just moves around and changes its form.',
            'A roller coaster shows this beautifully. A motor pulls the train up the first hill, giving it a lot of potential energy. From there no engine is needed: going down, potential energy becomes kinetic energy and the train speeds up; going up the next hill, kinetic energy turns back into potential energy and it slows down. A swinging pendulum does the same thing again and again.',
            'But a bouncing ball bounces lower each time, and a pendulum eventually stops. Is energy lost? No. Friction and air resistance turn some of the motion energy into heat (the ball and the air get a tiny bit warmer) and into sound (the thump you hear). The energy is still there, just spread out where we can no longer use it.'
          ],
          hr: [
            'Energija se ne može stvoriti ni uništiti, može se samo pretvarati iz jednog oblika u drugi. To je zakon očuvanja energije, jedno od najvažnijih pravila u cijeloj fizici. Ukupna količina energije uvijek ostaje ista; energija samo putuje i mijenja oblik.',
            'Vlak smrti to lijepo pokazuje. Motor vuče vlak na prvi brijeg i daje mu veliku potencijalnu energiju. Dalje motor nije potreban: pri spuštanju potencijalna energija prelazi u kinetičku i vlak ubrzava; pri usponu na sljedeći brijeg kinetička se energija vraća u potencijalnu i vlak usporava. Njihalo koje se njiše radi isto, iznova i iznova.',
            'No lopta koja odskakuje svaki put odskoči niže, a njihalo se na kraju zaustavi. Je li energija izgubljena? Nije. Trenje i otpor zraka pretvaraju dio energije gibanja u toplinu (lopta i zrak postanu mrvicu topliji) i u zvuk (udarac koji čuješ). Energija je i dalje tu, samo raspršena tamo gdje je više ne možemo iskoristiti.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><path d="M20,30 C90,30 110,110 200,110 C290,110 310,60 400,60" fill="none" stroke="var(--muted)" stroke-width="3"/><circle cx="40" cy="26" r="9" fill="var(--c8)" stroke="var(--fg)" stroke-width="2"/><circle cx="200" cy="101" r="9" fill="var(--c8)" stroke="var(--fg)" stroke-width="2"/><circle cx="380" cy="55" r="9" fill="var(--c8)" stroke="var(--fg)" stroke-width="2"/><rect x="26" y="48" width="10" height="40" fill="var(--c3)"/><rect x="40" y="86" width="10" height="2" fill="var(--c1)"/><rect x="186" y="118" width="10" height="2" fill="var(--c3)"/><rect x="200" y="80" width="10" height="40" fill="var(--c1)"/><rect x="366" y="78" width="10" height="24" fill="var(--c3)"/><rect x="380" y="86" width="10" height="16" fill="var(--c1)"/><text x="60" y="60" fill="var(--fg)" font-family="inherit" font-size="12" font-weight="700">Ep</text><text x="218" y="92" fill="var(--fg)" font-family="inherit" font-size="12" font-weight="700">Ek</text><text x="300" y="130" fill="var(--fg)" font-family="inherit" font-size="12" font-weight="700">Ep + Ek = konst.</text></svg>'
      },
      {
        h: { en: 'Power', hr: 'Snaga' },
        p: {
          en: [
            'Two people carry the same boxes up the same stairs. One takes 10 seconds, the other 30. They do the same work, but the first one is more powerful. Power tells how fast work is done: P = W / t, work divided by time. Its unit is the watt (W): one watt is one joule per second.',
            'One thousand watts is a kilowatt (kW). The old unit horsepower is about 735 W, so a 100-horsepower car has about 74 kW. A person running up stairs produces around 300 W for a short time, a top cyclist can hold over 400 W for an hour, and a phone charger uses about 10 W.',
            'Do not mix up power and energy! Power is the rate, energy is the amount. A powerful kettle (2000 W) boils water fast, but boiling the same water with a weak kettle (1000 W) uses the same energy; it just takes twice as long.'
          ],
          hr: [
            'Dvoje ljudi nosi iste kutije uz iste stube. Jedan za to treba 10 sekundi, drugi 30. Obavili su jednak rad, ali prvi ima veću snagu. Snaga govori koliko se brzo obavlja rad: P = W / t, rad podijeljen s vremenom. Jedinica je vat (W): jedan vat je jedan džul u sekundi.',
            'Tisuću vata je kilovat (kW). Stara jedinica konjska snaga iznosi oko 735 W, pa automobil od 100 konjskih snaga ima oko 74 kW. Osoba koja trči uz stube kratko vrijeme razvija oko 300 W, vrhunski biciklist može sat vremena održavati više od 400 W, a punjač mobitela troši oko 10 W.',
            'Ne miješaj snagu i energiju! Snaga je brzina, a energija količina. Snažno kuhalo (2000 W) brzo zakuha vodu, ali slabo kuhalo (1000 W) za istu vodu potroši jednaku energiju; samo mu treba dvostruko više vremena. Isto vrijedi za sportaše: sprinter ima veliku snagu, a maratonac potroši više energije.'
          ]
        }
      },
      {
        h: { en: 'The kilowatt-hour and efficiency', hr: 'Kilovatsat i korisnost' },
        p: {
          en: [
            'A joule is tiny, so the electricity company uses a bigger unit of energy: the kilowatt-hour (kWh). It is the energy used by a 1 kW device running for 1 hour, which is 3 600 000 J. A 2 kW heater running for 3 hours uses 6 kWh. Your family pays for every kilowatt-hour on the bill, so the kWh is a unit of energy, not of power.',
            'No machine turns all of its energy into the useful kind. An old light bulb turns only about 5 % of its electrical energy into light; the rest becomes heat. An LED bulb manages several times more, around 40 %. The share of energy that comes out useful is called efficiency. Higher efficiency means less waste, lower bills and less fuel burned.'
          ],
          hr: [
            'Džul je sitna jedinica, pa elektrodistribucija koristi veću jedinicu za energiju: kilovatsat (kWh). To je energija koju potroši uređaj snage 1 kW radeći 1 sat, a iznosi 3 600 000 J. Grijalica od 2 kW uključena 3 sata potroši 6 kWh. Tvoja obitelj plaća svaki kilovatsat na računu, pa je kWh jedinica za energiju, a ne za snagu.',
            'Nijedan stroj ne pretvori svu energiju u koristan oblik. Stara žarulja sa žarnom niti pretvori samo oko 5 % električne energije u svjetlost; ostatak postane toplina. LED žarulja postiže nekoliko puta više, oko 40 %. Udio energije koji izađe kao koristan zove se korisnost (iskoristivost). Veća korisnost znači manje rasipanja, manje račune i manje spaljenog goriva.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'work (W)', hr: 'rad (W)' }, def: { en: 'Energy transferred when a force moves an object: W = F · s. Unit: joule (J).', hr: 'Energija prenesena kad sila pomiče tijelo: W = F · s. Jedinica: džul (J).' } },
      { term: { en: 'joule (J)', hr: 'džul (J)' }, def: { en: 'The unit of work and energy. About the work of lifting a small apple by 1 m.', hr: 'Jedinica za rad i energiju. Otprilike rad potreban da se mala jabuka podigne 1 m.' } },
      { term: { en: 'energy', hr: 'energija' }, def: { en: 'The ability to do work. It can change form but the total amount never changes.', hr: 'Sposobnost obavljanja rada. Mijenja oblik, ali ukupna količina ostaje ista.' } },
      { term: { en: 'kinetic energy', hr: 'kinetička energija' }, def: { en: 'The energy of a moving object: E_k = ½ · m · v². Grows with the square of speed.', hr: 'Energija tijela koje se giba: E_k = ½ · m · v². Raste s kvadratom brzine.' } },
      { term: { en: 'gravitational potential energy', hr: 'gravitacijska potencijalna energija' }, def: { en: 'Energy stored because of height: E_p = m · g · h.', hr: 'Energija pohranjena zbog visine tijela: E_p = m · g · h.' } },
      { term: { en: 'elastic energy', hr: 'elastična potencijalna energija' }, def: { en: 'Energy stored in a stretched or squeezed spring, bow or rubber band.', hr: 'Energija pohranjena u napetoj ili stisnutoj opruzi, luku ili gumici.' } },
      { term: { en: 'internal (thermal) energy', hr: 'unutarnja (toplinska) energija' }, def: { en: 'The energy of the moving particles inside an object. Friction turns motion into it.', hr: 'Energija čestica koje se gibaju unutar tijela. Trenje pretvara gibanje u nju.' } },
      { term: { en: 'law of conservation of energy', hr: 'zakon očuvanja energije' }, def: { en: 'Energy cannot be created or destroyed, only changed from one form to another.', hr: 'Energija se ne može stvoriti ni uništiti, samo pretvarati iz jednog oblika u drugi.' } },
      { term: { en: 'power (P)', hr: 'snaga (P)' }, def: { en: 'How fast work is done: P = W / t. Unit: watt (W).', hr: 'Koliko se brzo obavlja rad: P = W / t. Jedinica: vat (W).' } },
      { term: { en: 'watt (W)', hr: 'vat (W)' }, def: { en: 'The unit of power: one joule per second. 1 kW = 1000 W.', hr: 'Jedinica za snagu: jedan džul u sekundi. 1 kW = 1000 W.' } },
      { term: { en: 'kilowatt-hour (kWh)', hr: 'kilovatsat (kWh)' }, def: { en: 'The unit of energy on the electricity bill: 1 kW for 1 hour = 3 600 000 J.', hr: 'Jedinica za energiju na računu za struju: 1 kW tijekom 1 sata = 3 600 000 J.' } },
      { term: { en: 'efficiency', hr: 'korisnost (iskoristivost)' }, def: { en: 'The share of the energy put in that comes out in the useful form.', hr: 'Udio uložene energije koji izlazi u korisnom obliku.' } }
    ],

    formulas: [
      { expr: 'W = F · s', name: { en: 'work', hr: 'rad' }, note: { en: 'force in N, distance in m, work in J', hr: 'sila u N, put u m, rad u J' } },
      { expr: 'E_k = ½ · m · v²', name: { en: 'kinetic energy', hr: 'kinetička energija' }, note: { en: 'double the speed, four times the energy', hr: 'dvostruka brzina, četiri puta veća energija' } },
      { expr: 'E_p = m · g · h', name: { en: 'gravitational potential energy', hr: 'gravitacijska potencijalna energija' }, note: { en: 'g ≈ 10 N/kg, h in metres', hr: 'g ≈ 10 N/kg, h u metrima' } },
      { expr: 'P = W / t', name: { en: 'power', hr: 'snaga' }, note: { en: 'work in J, time in s, power in W', hr: 'rad u J, vrijeme u s, snaga u W' } }
    ],

    funFact: {
      en: 'A single 50 g bar of chocolate stores roughly 1000 kJ of chemical energy. If your body could turn all of it into lifting work, it would carry a 50 kg person about 2 km straight up, higher than Dinara, the highest peak in Croatia (1831 m).',
      hr: 'Jedna čokolada od 50 g pohranjuje oko 1000 kJ kemijske energije. Kad bi tvoje tijelo svu tu energiju pretvorilo u rad dizanja, podiglo bi osobu mase 50 kg oko 2 km uvis, više od Dinare, najvišeg vrha Hrvatske (1831 m).'
    },

    experiment: {
      title: { en: 'Measure your own power on the stairs', hr: 'Izmjeri vlastitu snagu na stubama' },
      materials: {
        en: ['a flight of stairs (at least 10 steps)', 'a tape measure or ruler', 'a stopwatch (a phone will do)', 'a bathroom scale', 'a calculator, paper and a pencil', 'a friend to time you'],
        hr: ['stubište (barem 10 stuba)', 'metar ili ravnalo', 'štoperica (može i mobitel)', 'kućna vaga', 'kalkulator, papir i olovka', 'prijatelj koji će mjeriti vrijeme']
      },
      steps: {
        en: [
          'Measure the height of one step in metres (for example 0.17 m) and count the steps. The total height is h = step height × number of steps.',
          'Weigh yourself on the scale. That is your mass m in kilograms.',
          'Work out your weight: F = m · 10 N/kg. Then the work for the climb: W = F · h, in joules.',
          'Have your friend time you walking up the stairs at a normal pace. Write down the time t in seconds.',
          'Calculate your power: P = W / t, in watts.',
          'Repeat the climb running (carefully!) and compare. Same work, less time, more power.',
          'Compare your result with a 60 W light bulb and a 2000 W kettle. How many of you would it take to run the kettle?'
        ],
        hr: [
          'Izmjeri visinu jedne stube u metrima (na primjer 0,17 m) i prebroji stube. Ukupna visina je h = visina stube × broj stuba.',
          'Izvaži se na vagi. To je tvoja masa m u kilogramima.',
          'Izračunaj svoju težinu: F = m · 10 N/kg. Zatim rad za uspon: W = F · h, u džulima.',
          'Neka ti prijatelj mjeri vrijeme dok normalnim tempom hodaš uz stube. Zapiši vrijeme t u sekundama.',
          'Izračunaj svoju snagu: P = W / t, u vatima.',
          'Ponovi uspon trčeći (oprezno!) i usporedi. Isti rad, manje vremena, veća snaga.',
          'Usporedi svoj rezultat sa žaruljom od 60 W i kuhalom za vodu od 2000 W. Koliko bi vas trebalo da pokrenete kuhalo?'
        ]
      },
      explain: {
        en: 'Lifting your body against gravity takes work equal to your weight times the height you climb. Power is how fast you do that work. Most people reach 200–500 W walking up stairs and more when running, but only for a few seconds. A kettle keeps up 2000 W for minutes, which is why you cannot replace a power station with a gym.',
        hr: 'Dizanje tijela protiv sile teže zahtijeva rad jednak tvojoj težini puta visina na koju se popneš. Snaga je brzina kojom taj rad obavljaš. Većina ljudi hodajući uz stube razvije 200–500 W, a trčeći i više, ali samo nekoliko sekundi. Kuhalo održava 2000 W minutama, zato elektranu ne možeš zamijeniti teretanom.'
      },
      safety: { en: 'Hold the handrail and never run on wet or slippery stairs. Stop if you feel dizzy.', hr: 'Drži se za rukohvat i nikad ne trči po mokrim ili skliskim stubama. Stani ako ti se zavrti u glavi.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What is the unit of energy?', hr: 'Koja je mjerna jedinica za energiju?' },
        options: [{ en: 'newton', hr: 'njutn' }, { en: 'watt', hr: 'vat' }, { en: 'joule', hr: 'džul' }, { en: 'kilogram', hr: 'kilogram' }], answer: 2,
        explain: { en: 'Energy and work are measured in joules (J). The newton measures force, the watt power and the kilogram mass.', hr: 'Energiju i rad mjerimo u džulima (J). Njutnom mjerimo silu, vatom snagu, a kilogramom masu.' } },
      { type: 'mc', q: { en: 'In which case is NO work done in the physics sense?', hr: 'U kojem slučaju NIJE obavljen rad u fizikalnom smislu?' },
        options: [{ en: 'holding a heavy bag still for a minute', hr: 'držanje teške torbe u mjestu jednu minutu' }, { en: 'lifting a bag onto a table', hr: 'podizanje torbe na stol' }, { en: 'pushing a cart along a corridor', hr: 'guranje kolica niz hodnik' }, { en: 'pulling a sled up a hill', hr: 'vučenje sanjki uz brijeg' }], answer: 0,
        explain: { en: 'Work needs a force AND a movement. Holding a bag still takes effort, but nothing moves, so the work is zero.', hr: 'Za rad trebaju sila I pomak. Držanje torbe u mjestu zahtijeva napor, ali ništa se ne pomiče, pa je rad nula.' } },
      { type: 'tf', q: { en: 'Energy can be created from nothing if a machine is clever enough.', hr: 'Energija se može stvoriti iz ničega ako je stroj dovoljno pametan.' }, answer: false,
        explain: { en: 'The law of conservation of energy says energy can only change form. No machine can make energy from nothing.', hr: 'Zakon očuvanja energije kaže da energija može samo mijenjati oblik. Nijedan stroj ne može stvoriti energiju iz ničega.' } },
      { type: 'num', q: { en: 'You lift a box with a force of 20 N to a height of 2 m. How much work do you do?', hr: 'Kutiju podižeš silom od 20 N na visinu 2 m. Koliki rad obaviš?' },
        answer: 40, tolerance: 0.5, unit: 'J',
        explain: { en: 'W = F · s = 20 N · 2 m = 40 J.', hr: 'W = F · s = 20 N · 2 m = 40 J.' } },
      { type: 'mc', q: { en: 'Which form of energy does a stretched bow have just before the arrow is released?', hr: 'Koji oblik energije ima napeti luk neposredno prije ispuštanja strijele?' },
        options: [{ en: 'kinetic energy', hr: 'kinetičku energiju' }, { en: 'chemical energy', hr: 'kemijsku energiju' }, { en: 'light energy', hr: 'energiju svjetlosti' }, { en: 'elastic potential energy', hr: 'elastičnu potencijalnu energiju' }], answer: 3,
        explain: { en: 'A stretched bow stores elastic energy. When released, it changes into the kinetic energy of the arrow.', hr: 'Napeti luk pohranjuje elastičnu energiju. Kad ga pustiš, ona prelazi u kinetičku energiju strijele.' } },
      { type: 'mc', q: { en: 'A car doubles its speed from 30 km/h to 60 km/h. Its kinetic energy becomes…', hr: 'Automobil udvostruči brzinu s 30 km/h na 60 km/h. Njegova kinetička energija postaje…' },
        options: [{ en: 'two times bigger', hr: 'dva puta veća' }, { en: 'four times bigger', hr: 'četiri puta veća' }, { en: 'the same', hr: 'jednaka' }, { en: 'eight times bigger', hr: 'osam puta veća' }], answer: 1,
        explain: { en: 'Kinetic energy depends on the square of the speed (v²). Twice the speed means 2² = 4 times the energy, and about four times the braking distance.', hr: 'Kinetička energija ovisi o kvadratu brzine (v²). Dvostruka brzina znači 2² = 4 puta veću energiju i oko četiri puta dulji put kočenja.' } },
      { type: 'tf', q: { en: 'One horsepower is about 735 watts.', hr: 'Jedna konjska snaga iznosi oko 735 vata.' }, answer: true,
        explain: { en: 'Yes. Horsepower is an old unit of power still used for cars; 1 hp ≈ 735 W, so 100 hp ≈ 74 kW.', hr: 'Da. Konjska snaga je stara jedinica za snagu koja se još koristi za automobile; 1 KS ≈ 735 W, pa je 100 KS ≈ 74 kW.' } },
      { type: 'mc', q: { en: 'A pendulum swings. Where is its kinetic energy the largest?', hr: 'Njihalo se njiše. Gdje mu je kinetička energija najveća?' },
        options: [{ en: 'at the highest point on the left', hr: 'u najvišoj točki lijevo' }, { en: 'at the highest point on the right', hr: 'u najvišoj točki desno' }, { en: 'at the lowest point', hr: 'u najnižoj točki' }, { en: 'it is the same everywhere', hr: 'jednaka je svugdje' }], answer: 2,
        explain: { en: 'At the lowest point the pendulum is fastest, so kinetic energy is largest and potential energy smallest. At the top it stops for a moment: all the energy is potential.', hr: 'U najnižoj točki njihalo je najbrže, pa je kinetička energija najveća, a potencijalna najmanja. Na vrhu se na trenutak zaustavi: sva je energija potencijalna.' } },
      { type: 'num', q: { en: 'A motor does 3000 J of work in 10 s. What is its power?', hr: 'Motor obavi rad od 3000 J za 10 s. Kolika je njegova snaga?' },
        answer: 300, tolerance: 1, unit: 'W',
        explain: { en: 'P = W / t = 3000 J / 10 s = 300 W.', hr: 'P = W / t = 3000 J / 10 s = 300 W.' } },
      { type: 'mc', q: { en: 'A ball bounces lower and lower until it stops. Where did its energy go?', hr: 'Lopta odskakuje sve niže dok se ne zaustavi. Kamo je otišla njezina energija?' },
        options: [{ en: 'it was destroyed', hr: 'uništena je' }, { en: 'into heat and sound', hr: 'u toplinu i zvuk' }, { en: 'back into the hand that dropped it', hr: 'natrag u ruku koja ju je pustila' }, { en: 'into the mass of the ball', hr: 'u masu lopte' }], answer: 1,
        explain: { en: 'Each bounce turns some motion energy into heat (the ball and floor warm slightly) and sound. The total energy is conserved, but it is no longer useful motion.', hr: 'Svaki odskok pretvori dio energije gibanja u toplinu (lopta i pod se malo ugriju) i zvuk. Ukupna energija je očuvana, ali više nije korisno gibanje.' } },
      { type: 'mc', q: { en: 'A 1500 W heater runs for 2 hours. How much energy does it use?', hr: 'Grijalica snage 1500 W radi 2 sata. Koliko energije potroši?' },
        options: [{ en: '750 kWh', hr: '750 kWh' }, { en: '1500 kWh', hr: '1500 kWh' }, { en: '0.75 kWh', hr: '0,75 kWh' }, { en: '3 kWh', hr: '3 kWh' }], answer: 3,
        explain: { en: '1500 W = 1.5 kW. Energy = power × time = 1.5 kW × 2 h = 3 kWh. That is what appears on the electricity bill.', hr: '1500 W = 1,5 kW. Energija = snaga × vrijeme = 1,5 kW × 2 h = 3 kWh. Upravo to piše na računu za struju.' } }
    ]
  });
})();
