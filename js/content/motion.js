/* FizLab topic: Motion and Speed / Gibanje i brzina */
(function () {
  'use strict';
  window.Content.register({
    id: 'motion',
    order: 30,
    gradeLevel: 8,
    color: 'c7',
    title: { en: 'Motion and Speed', hr: 'Gibanje i brzina' },
    intro: {
      en: 'Are you moving right now? Sitting still in your chair, you are racing around the Sun at 30 km/s. Motion depends on what you compare it to, and speed tells how fast.',
      hr: 'Krećeš li se upravo sada? Dok mirno sjediš na stolici, juriš oko Sunca brzinom 30 km/s. Gibanje ovisi o tome s čime ga uspoređuješ, a brzina govori koliko je brzo.'
    },
    sims: ['motion', 'motiongraphs', 'galileo'],

    lesson: [
      {
        h: { en: 'Motion is relative', hr: 'Gibanje je relativno' },
        p: {
          en: [
            'You are sitting on a train. Your friend across the aisle is not moving: your backpack stays in your lap and the juice in your cup stays still. Yet a cow in a field watches you both flash past at 100 km/h. Who is right? Both. Motion is always compared to something, and that something is called the reference body. Compared to the train you are at rest; compared to the cow you are moving fast.',
            'A body moves when its position changes compared to the reference body. Usually we choose the ground, a tree or a house, and we do not even notice the choice. But the choice matters: the Earth itself speeds around the Sun at about 30 km/s, so compared to the Sun nobody is ever at rest, not even when sleeping.'
          ],
          hr: [
            'Sjediš u vlaku. Prijatelj preko puta tebe se ne miče: ruksak ti mirno leži u krilu, a sok u čaši miruje. Ipak, krava na livadi gleda kako oboje projurite brzinom 100 km/h. Tko je u pravu? Oboje. Gibanje uvijek uspoređujemo s nečim, a to nešto zovemo referentno tijelo. U odnosu na vlak ti miruješ, a u odnosu na kravu se brzo gibaš.',
            'Tijelo se giba kad mu se mijenja položaj u odnosu na referentno tijelo. Obično odaberemo tlo, drvo ili kuću i taj izbor niti ne primijetimo. Ali izbor je važan: sama Zemlja juri oko Sunca brzinom oko 30 km/s, pa u odnosu na Sunce nitko nikad ne miruje, čak ni dok spava.'
          ]
        }
      },
      {
        h: { en: 'Path, distance and time', hr: 'Putanja, put i vrijeme' },
        p: {
          en: [
            'The line a body draws as it moves is called its path or trajectory: a straight line for a falling stone, a curve for a thrown ball, a circle for a point on a spinning wheel. The length of that line is the distance travelled, written s and measured in metres (m), or in kilometres for long trips. A football pitch is about 100 m long; the road from Zagreb to Split is about 410 km.',
            'The second thing we need is time, written t and measured in seconds (s), minutes or hours. Careful: the symbol s for distance and the unit s for seconds look the same, but the meaning is always clear from where they stand. We measure time with a stopwatch, and your phone has one built in. One minute is 60 s and one hour is 3600 s.'
          ],
          hr: [
            'Crta koju tijelo opisuje dok se giba zove se putanja: pravac za kamen koji pada, krivulja za bačenu loptu, kružnica za točku na kotaču koji se vrti. Duljina te crte je prijeđeni put, označavamo ga sa s i mjerimo u metrima (m), a za duga putovanja u kilometrima. Nogometno igralište dugo je oko 100 m, a cesta od Zagreba do Splita oko 410 km.',
            'Drugo što nam treba je vrijeme, oznaka t, a mjerimo ga u sekundama (s), minutama ili satima. Pazi: oznaka s za put i jedinica s za sekundu izgledaju jednako, ali značenje je uvijek jasno iz mjesta na kojem stoje. Vrijeme mjerimo štopericom, a ima je i tvoj mobitel. Jedna minuta ima 60 s, a jedan sat 3600 s.'
          ]
        }
      },
      {
        h: { en: 'Speed', hr: 'Brzina' },
        p: {
          en: [
            'Speed tells how much distance a body covers in one unit of time. We calculate it by dividing distance by time: v = s / t. If you run 100 m in 20 s, your speed is 100 m / 20 s = 5 m/s: five metres every second. The unit is the metre per second (m/s). Cars and road signs use kilometres per hour (km/h).',
            'Converting is easy if you remember that 1 m/s = 3.6 km/h: in one hour, which is 3600 s, you cover 3600 m, which is 3.6 km. To go from m/s to km/h multiply by 3.6; to go back, divide by 3.6. A car at 100 km/h moves at about 28 m/s: it covers the length of almost three classrooms every second.',
            'Some speeds worth knowing: walking 1.4 m/s (5 km/h), a cyclist 5 m/s (18 km/h), a sprinter 10 m/s, a car on a motorway 28 m/s (100 km/h), sound in air 340 m/s, a passenger jet 250 m/s (900 km/h), and light 300 000 km/s. Light is so fast that you see the lightning long before you hear the thunder.'
          ],
          hr: [
            'Brzina govori koliki put tijelo prijeđe u jednoj jedinici vremena. Računamo je tako da put podijelimo vremenom: v = s / t. Ako pretrčiš 100 m za 20 s, brzina ti je 100 m / 20 s = 5 m/s: pet metara svake sekunde. Jedinica je metar u sekundi (m/s). Automobili i prometni znakovi koriste kilometre na sat (km/h).',
            'Pretvaranje je lako ako zapamtiš da je 1 m/s = 3,6 km/h: u jednom satu, a to je 3600 s, prijeđeš 3600 m, odnosno 3,6 km. Iz m/s u km/h množimo s 3,6, a natrag dijelimo s 3,6. Automobil pri 100 km/h giba se brzinom oko 28 m/s: svake sekunde prijeđe duljinu gotovo tri učionice.',
            'Nekoliko brzina vrijednih pamćenja: hodanje 1,4 m/s (5 km/h), biciklist 5 m/s (18 km/h), sprinter 10 m/s, automobil na autocesti 28 m/s (100 km/h), zvuk u zraku 340 m/s, putnički zrakoplov 250 m/s (900 km/h) i svjetlost 300 000 km/s. Svjetlost je tako brza da munju vidiš mnogo prije nego što čuješ grmljavinu.'
          ]
        }
      },
      {
        h: { en: 'Uniform motion and the distance–time graph', hr: 'Jednoliko gibanje i graf put–vrijeme' },
        p: {
          en: [
            'When a body covers equal distances in equal times, its motion is uniform. A train cruising at a steady 120 km/h covers 2 km every minute, minute after minute. On a distance–time graph (time across, distance up) uniform motion is a straight line. The steeper the line, the greater the speed. A flat, horizontal line means the body is standing still.',
            'Real journeys are rarely uniform: you stop at traffic lights, speed up, slow down. Then we use the average speed: total distance divided by total time. If a bus covers 30 km in 45 minutes (0.75 h) with all its stops, its average speed is 30 km / 0.75 h = 40 km/h, even though at some moments it was doing 60 km/h and at others it was standing still.'
          ],
          hr: [
            'Kad tijelo u jednakim vremenima prijeđe jednake putove, njegovo gibanje je jednoliko. Vlak koji ravnomjerno vozi 120 km/h svake minute prijeđe 2 km, minutu za minutom. U grafu put–vrijeme (vrijeme vodoravno, put okomito) jednoliko gibanje je pravac. Što je pravac strmiji, brzina je veća. Ravna, vodoravna crta znači da tijelo miruje.',
            'Prava putovanja rijetko su jednolika: staneš na semaforu, ubrzaš, usporiš. Tada računamo srednju brzinu: ukupni put podijeljen ukupnim vremenom. Ako autobus sa svim stajanjima prijeđe 30 km za 45 minuta (0,75 h), srednja mu je brzina 30 km / 0,75 h = 40 km/h, iako je u nekim trenucima vozio 60 km/h, a u drugima stajao na mjestu.'
          ]
        },
        svg: '<svg viewBox="0 0 420 150" role="img"><defs><marker id="mo-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--fg)"/></marker></defs><line x1="50" y1="125" x2="390" y2="125" stroke="var(--fg)" stroke-width="2" marker-end="url(#mo-ar)"/><line x1="50" y1="125" x2="50" y2="15" stroke="var(--fg)" stroke-width="2" marker-end="url(#mo-ar)"/><text x="398" y="130" fill="var(--fg)" font-family="inherit" font-size="14" font-style="italic">t</text><text x="38" y="20" fill="var(--fg)" font-family="inherit" font-size="14" font-style="italic">s</text><line x1="50" y1="125" x2="230" y2="25" stroke="var(--c7)" stroke-width="4" stroke-linecap="round"/><text x="236" y="28" fill="var(--c7)" font-family="inherit" font-size="13" font-weight="700">v₁</text><line x1="50" y1="125" x2="370" y2="60" stroke="var(--c1)" stroke-width="4" stroke-linecap="round"/><text x="376" y="62" fill="var(--c1)" font-family="inherit" font-size="13" font-weight="700">v₂</text><line x1="50" y1="95" x2="370" y2="95" stroke="var(--muted)" stroke-width="3" stroke-dasharray="6 5"/><text x="376" y="99" fill="var(--muted)" font-family="inherit" font-size="13" font-weight="700">v = 0</text><text x="120" y="145" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">v₁ &gt; v₂</text></svg>'
      },
      {
        h: { en: 'Acceleration', hr: 'Ubrzanje' },
        p: {
          en: [
            'When the speed changes, the body accelerates. Acceleration tells how much the speed changes every second: a = Δv / t, where Δv is the change in speed (final speed minus starting speed). The unit is the metre per second squared (m/s²). A car that goes from 0 to 20 m/s in 10 s has an acceleration of 2 m/s²: every second it gains 2 m/s.',
            'Slowing down is also acceleration, just in the opposite direction; we often call it deceleration. A cyclist braking from 6 m/s to a stop in 3 s decelerates at 2 m/s². The bigger the acceleration, the more you feel pushed back into your seat when the car speeds up, or thrown forward when it brakes hard.',
            'The most famous accelerated motion is free fall. Drop a stone and every second it falls 10 m/s faster: after 1 s it moves at 10 m/s, after 2 s at 20 m/s, after 3 s at 30 m/s. This acceleration is about 10 m/s² (more precisely 9.81 m/s²) and it is the same for a stone, a key or a coin, as long as air resistance stays small.'
          ],
          hr: [
            'Kad se brzina mijenja, tijelo se giba ubrzano. Ubrzanje (akceleracija) govori koliko se brzina promijeni svake sekunde: a = Δv / t, gdje je Δv promjena brzine (konačna brzina minus početna). Jedinica je metar u sekundi na kvadrat (m/s²). Automobil koji za 10 s ubrza od 0 do 20 m/s ima ubrzanje 2 m/s²: svake sekunde dobije 2 m/s.',
            'I usporavanje je ubrzanje, samo suprotnog smjera; često ga zovemo usporenje. Biciklist koji od 6 m/s zakoči do zaustavljanja za 3 s usporava s 2 m/s². Što je ubrzanje veće, više te pritišće u sjedalo kad automobil ubrzava, odnosno baca naprijed kad naglo zakoči.',
            'Najpoznatije ubrzano gibanje je slobodni pad. Pusti kamen i on svake sekunde pada brže za 10 m/s: nakon 1 s giba se brzinom 10 m/s, nakon 2 s brzinom 20 m/s, nakon 3 s brzinom 30 m/s. To ubrzanje iznosi oko 10 m/s² (točnije 9,81 m/s²) i jednako je za kamen, ključ ili kovanicu, dok god je otpor zraka malen.'
          ]
        }
      },
      {
        h: { en: 'Reaction time and braking distance', hr: 'Vrijeme reakcije i put kočenja' },
        p: {
          en: [
            'Your brain needs about one second to notice danger and press the brake. During that reaction time the vehicle keeps moving at full speed. At 50 km/h (14 m/s) a car covers about 14 m before the brakes even start working, the length of a bus. At 100 km/h it covers 28 m, almost the length of a swimming pool, while the driver is still only reacting.',
            'Then comes the braking distance, and it grows much faster than the speed: double the speed and the braking distance becomes four times longer. On a dry road a car braking from 50 km/h needs about 14 m to stop; from 100 km/h about 55 m. Reaction distance plus braking distance is the stopping distance. That is why speed limits near schools are low and why a wet or icy road is so dangerous.',
            'The same rules apply to you on a bike or a scooter: keep a safe distance, slow down before a corner, and never assume that a driver has already seen you. A few extra metres per second of speed can mean many extra metres of stopping distance.'
          ],
          hr: [
            'Tvoj mozak treba oko jednu sekundu da primijeti opasnost i pritisne kočnicu. Za to vrijeme reakcije vozilo se i dalje giba punom brzinom. Pri 50 km/h (14 m/s) automobil prijeđe oko 14 m prije nego što kočnice uopće počnu raditi, a to je duljina autobusa. Pri 100 km/h prijeđe 28 m, gotovo duljinu plivačkog bazena, dok vozač tek reagira.',
            'Zatim slijedi put kočenja, a on raste puno brže od brzine: udvostruči brzinu i put kočenja postaje četiri puta dulji. Na suhoj cesti automobil koji koči s 50 km/h treba oko 14 m da stane, a sa 100 km/h oko 55 m. Put reakcije i put kočenja zajedno čine zaustavni put. Zato su ograničenja brzine kraj škola niska i zato je mokra ili zaleđena cesta tako opasna.',
            'Ista pravila vrijede za tebe na biciklu ili romobilu: drži sigurni razmak, uspori prije zavoja i nikad ne pretpostavljaj da te vozač već vidio. Nekoliko metara u sekundi brzine više može značiti mnogo dodatnih metara zaustavnog puta, a na mokroj cesti još i više.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'motion', hr: 'gibanje' }, def: { en: 'A change of position of a body compared to a reference body.', hr: 'Promjena položaja tijela u odnosu na referentno tijelo.' } },
      { term: { en: 'reference body', hr: 'referentno tijelo' }, def: { en: 'The body we compare motion to: the ground, a train, the Sun.', hr: 'Tijelo s kojim uspoređujemo gibanje: tlo, vlak, Sunce.' } },
      { term: { en: 'rest', hr: 'mirovanje' }, def: { en: 'When the position of a body does not change compared to the reference body.', hr: 'Kad se položaj tijela ne mijenja u odnosu na referentno tijelo.' } },
      { term: { en: 'trajectory (path)', hr: 'putanja' }, def: { en: 'The line a body draws as it moves: a straight line, a curve or a circle.', hr: 'Crta koju tijelo opisuje dok se giba: pravac, krivulja ili kružnica.' } },
      { term: { en: 'distance travelled', hr: 'put' }, def: { en: 'The length of the path a body has covered. Symbol s, unit metre (m).', hr: 'Duljina putanje koju je tijelo prešlo. Oznaka s, jedinica metar (m).' } },
      { term: { en: 'speed', hr: 'brzina' }, def: { en: 'Distance covered in one unit of time: v = s / t. Units m/s and km/h.', hr: 'Put prijeđen u jedinici vremena: v = s / t. Jedinice m/s i km/h.' } },
      { term: { en: 'metre per second (m/s)', hr: 'metar u sekundi (m/s)' }, def: { en: 'The basic unit of speed. 1 m/s = 3.6 km/h.', hr: 'Osnovna jedinica brzine. 1 m/s = 3,6 km/h.' } },
      { term: { en: 'uniform motion', hr: 'jednoliko gibanje' }, def: { en: 'Motion with a constant speed: equal distances in equal times. A straight line on a distance–time graph.', hr: 'Gibanje stalnom brzinom: jednaki putovi u jednakim vremenima. Pravac u grafu put–vrijeme.' } },
      { term: { en: 'average speed', hr: 'srednja brzina' }, def: { en: 'Total distance divided by total time for a whole journey.', hr: 'Ukupni put podijeljen ukupnim vremenom cijelog putovanja.' } },
      { term: { en: 'acceleration', hr: 'ubrzanje (akceleracija)' }, def: { en: 'How much the speed changes every second: a = Δv / t. Unit m/s².', hr: 'Koliko se brzina promijeni svake sekunde: a = Δv / t. Jedinica m/s².' } },
      { term: { en: 'free fall', hr: 'slobodni pad' }, def: { en: 'Falling with only gravity acting, with an acceleration of about 10 m/s².', hr: 'Padanje kad djeluje samo sila teža, s ubrzanjem oko 10 m/s².' } },
      { term: { en: 'stopping distance', hr: 'zaustavni put' }, def: { en: 'Reaction distance plus braking distance: how far a vehicle travels before it stops.', hr: 'Put reakcije plus put kočenja: koliko vozilo prijeđe dok se ne zaustavi.' } }
    ],

    formulas: [
      { expr: 'v = s / t', name: { en: 'speed', hr: 'brzina' }, note: { en: 'distance divided by time', hr: 'put podijeljen vremenom' } },
      { expr: 's = v · t', name: { en: 'distance travelled', hr: 'prijeđeni put' }, note: { en: 'speed times time', hr: 'brzina puta vrijeme' } },
      { expr: '1 m/s = 3.6 km/h', name: { en: 'converting speed units', hr: 'pretvaranje jedinica brzine' }, note: { en: 'm/s to km/h: multiply by 3.6', hr: 'iz m/s u km/h: pomnoži s 3,6' } },
      { expr: 'a = Δv / t', name: { en: 'acceleration', hr: 'ubrzanje' }, note: { en: 'change of speed divided by time, in m/s²', hr: 'promjena brzine podijeljena vremenom, u m/s²' } }
    ],

    funFact: {
      en: 'When Usain Bolt ran 100 m in 9.58 s in 2009, his average speed was 10.4 m/s (37.6 km/h), but at his fastest moment he was moving at 12.4 m/s, about 44.7 km/h.',
      hr: 'Kad je Usain Bolt 2009. godine istrčao 100 m za 9,58 s, srednja brzina bila mu je 10,4 m/s (37,6 km/h), ali u najbržem trenutku gibao se brzinom 12,4 m/s, oko 44,7 km/h.'
    },

    experiment: {
      title: { en: 'Measure your own walking and running speed', hr: 'Izmjeri svoju brzinu hodanja i trčanja' },
      materials: {
        en: ['a tape measure', 'chalk or two bags to mark the start and the finish', 'a phone with a stopwatch', 'a friend to time you', 'a notebook and a pencil'],
        hr: ['mjerna vrpca', 'kreda ili dvije torbe za oznaku starta i cilja', 'mobitel sa štopericom', 'prijatelj koji će mjeriti vrijeme', 'bilježnica i olovka']
      },
      steps: {
        en: [
          'In a park or on a quiet path, measure out a straight track of 20 m with the tape measure. Mark the start and the finish.',
          'Your friend stands at the finish with the stopwatch. Start walking a few metres before the start line so you are already at full pace when you cross it; your friend starts the clock then and stops it when you cross the finish.',
          'Write down the time. Repeat three times and take the average.',
          'Now run the track as fast as you can. Again measure three times and average.',
          'Calculate your speed for both: v = s / t, with s = 20 m. Multiply by 3.6 to get km/h.',
          'Compare with the table in the lesson. Are you faster than a walking adult (1.4 m/s)? Could you keep up with a cyclist (5 m/s)?'
        ],
        hr: [
          'U parku ili na mirnoj stazi mjernom vrpcom odmjeri ravnu stazu od 20 m. Označi start i cilj.',
          'Prijatelj stoji na cilju sa štopericom. Počni hodati nekoliko metara prije startne crte da je prijeđeš punom brzinom; prijatelj tada pokrene štopericu i zaustavi je kad prijeđeš cilj.',
          'Zapiši vrijeme. Ponovi tri puta i izračunaj srednju vrijednost.',
          'Sad stazu pretrči što brže možeš. Ponovno mjeri tri puta i izračunaj srednju vrijednost.',
          'Izračunaj brzinu za oboje: v = s / t, uz s = 20 m. Pomnoži s 3,6 da dobiješ km/h.',
          'Usporedi s tablicom iz lekcije. Jesi li brži od odrasle osobe koja hoda (1,4 m/s)? Bi li održao korak s biciklistom (5 m/s)?'
        ]
      },
      explain: {
        en: 'Speed is distance divided by time, so a measured distance and a measured time are all you need. Repeating the measurement and averaging reduces the error from pressing the stopwatch a little too early or too late. Starting before the line makes your motion roughly uniform over the track, so the result is your real pace rather than an average with a slow start.',
        hr: 'Brzina je put podijeljen vremenom, pa su izmjeren put i izmjereno vrijeme sve što ti treba. Ponavljanje mjerenja i računanje srednje vrijednosti smanjuje pogrešku zbog prerano ili prekasno pritisnute štoperice. Zalet prije crte čini tvoje gibanje na stazi približno jednolikim, pa je rezultat tvoja prava brzina, a ne prosjek sa sporim startom.'
      },
      safety: { en: 'Run on flat, soft ground away from traffic, and warm up first.', hr: 'Trči po ravnom, mekom tlu daleko od prometa i prije toga se zagrij.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'A passenger sits on a moving train. Compared to which reference body is the passenger at rest?', hr: 'Putnik sjedi u vlaku koji vozi. U odnosu na koje referentno tijelo putnik miruje?' },
        options: [{ en: 'the trees beside the track', hr: 'drveće uz prugu' }, { en: 'the seat of the train', hr: 'sjedalo u vlaku' }, { en: 'the station building', hr: 'zgrada kolodvora' }, { en: 'the Sun', hr: 'Sunce' }], answer: 1,
        explain: { en: 'The passenger does not change position compared to the seat, so compared to the seat (and the whole train) he is at rest. Compared to the trees or the station he is moving.', hr: 'Putnik ne mijenja položaj u odnosu na sjedalo, pa u odnosu na sjedalo (i cijeli vlak) miruje. U odnosu na drveće ili kolodvor se giba.' } },
      { type: 'mc', q: { en: 'What is the unit of speed?', hr: 'Koja je jedinica brzine?' },
        options: [{ en: 'm', hr: 'm' }, { en: 's', hr: 's' }, { en: 'm/s', hr: 'm/s' }, { en: 'm/s²', hr: 'm/s²' }], answer: 2,
        explain: { en: 'Speed is distance per time, metres per second (m/s). The metre measures distance, the second time, and m/s² acceleration.', hr: 'Brzina je put po vremenu, metri u sekundi (m/s). Metar mjeri put, sekunda vrijeme, a m/s² ubrzanje.' } },
      { type: 'num', q: { en: 'A dog runs 150 m in 30 s. What is its speed?', hr: 'Pas pretrči 150 m za 30 s. Kolika mu je brzina?' },
        answer: 5, tolerance: 0.1, unit: 'm/s',
        explain: { en: 'v = s / t = 150 m / 30 s = 5 m/s, which is 18 km/h.', hr: 'v = s / t = 150 m / 30 s = 5 m/s, odnosno 18 km/h.' } },
      { type: 'mc', q: { en: '1 m/s is the same speed as…', hr: '1 m/s ista je brzina kao…' },
        options: [{ en: '0.6 km/h', hr: '0,6 km/h' }, { en: '3.6 km/h', hr: '3,6 km/h' }, { en: '36 km/h', hr: '36 km/h' }, { en: '60 km/h', hr: '60 km/h' }], answer: 1,
        explain: { en: 'In one hour (3600 s) you cover 3600 m = 3.6 km, so 1 m/s = 3.6 km/h.', hr: 'U jednom satu (3600 s) prijeđeš 3600 m = 3,6 km, pa je 1 m/s = 3,6 km/h.' } },
      { type: 'tf', q: { en: 'On a distance–time graph, a steeper line means a greater speed.', hr: 'U grafu put–vrijeme strmiji pravac znači veću brzinu.' }, answer: true,
        explain: { en: 'A steeper line covers more distance in the same time, and that is exactly what a greater speed means.', hr: 'Strmiji pravac prijeđe veći put u istom vremenu, a upravo to znači veća brzina.' } },
      { type: 'mc', q: { en: 'Which of these is the fastest?', hr: 'Što je od navedenog najbrže?' },
        options: [{ en: 'sound in air (340 m/s)', hr: 'zvuk u zraku (340 m/s)' }, { en: 'a car at 100 km/h', hr: 'automobil pri 100 km/h' }, { en: 'a cyclist at 20 km/h', hr: 'biciklist pri 20 km/h' }, { en: 'a jet at 900 km/h', hr: 'zrakoplov pri 900 km/h' }], answer: 0,
        explain: { en: 'Convert to the same unit: 340 m/s = 1224 km/h, faster than the jet (900 km/h), the car and the cyclist.', hr: 'Pretvori u istu jedinicu: 340 m/s = 1224 km/h, brže od zrakoplova (900 km/h), automobila i biciklista.' } },
      { type: 'mc', q: { en: 'A bus covers 30 km in 45 minutes, stops included. What is its average speed?', hr: 'Autobus prijeđe 30 km za 45 minuta, uključujući stajanja. Kolika mu je srednja brzina?' },
        options: [{ en: '20 km/h', hr: '20 km/h' }, { en: '30 km/h', hr: '30 km/h' }, { en: '40 km/h', hr: '40 km/h' }, { en: '60 km/h', hr: '60 km/h' }], answer: 2,
        explain: { en: '45 minutes is 0.75 h. Average speed = 30 km / 0.75 h = 40 km/h.', hr: '45 minuta je 0,75 h. Srednja brzina = 30 km / 0,75 h = 40 km/h.' } },
      { type: 'tf', q: { en: 'Slowing down is also a kind of acceleration.', hr: 'I usporavanje je vrsta ubrzanja.' }, answer: true,
        explain: { en: 'Acceleration is any change of speed. When the speed drops, the acceleration points against the motion; we call it deceleration.', hr: 'Ubrzanje je svaka promjena brzine. Kad brzina pada, ubrzanje je usmjereno suprotno gibanju; zovemo ga usporenje.' } },
      { type: 'num', q: { en: 'A car speeds up from 0 to 30 m/s in 6 s. What is its acceleration?', hr: 'Automobil ubrza od 0 do 30 m/s za 6 s. Koliko mu je ubrzanje?' },
        answer: 5, tolerance: 0.1, unit: 'm/s²',
        explain: { en: 'a = Δv / t = 30 m/s / 6 s = 5 m/s². Every second the car gains 5 m/s.', hr: 'a = Δv / t = 30 m/s / 6 s = 5 m/s². Svake sekunde automobil dobije 5 m/s.' } },
      { type: 'mc', q: { en: 'A stone is dropped from a high bridge. How fast is it moving after 3 s? Use g = 10 m/s² and ignore air resistance.', hr: 'Kamen pustimo s visokog mosta. Kojom se brzinom giba nakon 3 s? Uzmi g = 10 m/s² i zanemari otpor zraka.' },
        options: [{ en: '3 m/s', hr: '3 m/s' }, { en: '10 m/s', hr: '10 m/s' }, { en: '90 m/s', hr: '90 m/s' }, { en: '30 m/s', hr: '30 m/s' }], answer: 3,
        explain: { en: 'In free fall the speed grows by 10 m/s every second: after 3 s it is 3 × 10 m/s = 30 m/s, over 100 km/h.', hr: 'U slobodnom padu brzina raste za 10 m/s svake sekunde: nakon 3 s iznosi 3 × 10 m/s = 30 m/s, više od 100 km/h.' } },
      { type: 'tf', q: { en: 'If a car doubles its speed, its braking distance also doubles.', hr: 'Ako automobil udvostruči brzinu, i put kočenja mu se udvostruči.' }, answer: false,
        explain: { en: 'The braking distance grows with the square of the speed: double the speed and it becomes four times longer.', hr: 'Put kočenja raste s kvadratom brzine: udvostruči brzinu i on postaje četiri puta dulji.' } },
      { type: 'mc', q: { en: 'On a distance–time graph the line is horizontal. What is the body doing?', hr: 'U grafu put–vrijeme crta je vodoravna. Što tijelo radi?' },
        options: [{ en: 'it is standing still', hr: 'miruje' }, { en: 'it moves uniformly', hr: 'giba se jednoliko' }, { en: 'it is speeding up', hr: 'ubrzava' }, { en: 'it is moving backwards', hr: 'giba se unatrag' }], answer: 0,
        explain: { en: 'A horizontal line means the distance does not change while time passes, so the body is at rest.', hr: 'Vodoravna crta znači da se put ne mijenja dok vrijeme prolazi, dakle tijelo miruje.' } }
    ]
  });
})();
