/* FizLab topic: Gravity / Sila teža i gravitacija */
(function () {
  'use strict';
  window.Content.register({
    id: 'gravity',
    order: 50,
    gradeLevel: 7,
    color: 'c5',
    title: { en: 'Gravity', hr: 'Sila teža i gravitacija' },
    intro: {
      en: 'The same pull that knocks your pencil off the desk keeps the Moon in the sky and makes the sea rise and fall twice a day.',
      hr: 'Ista sila koja ti ruši olovku sa stola drži Mjesec na nebu i dvaput dnevno diže i spušta more.'
    },
    sims: ['pendulum', 'freefall', 'space', 'circular'],

    lesson: [
      {
        h: { en: 'Every mass attracts every other mass', hr: 'Svaka masa privlači svaku drugu masu' },
        p: {
          en: [
            'Isaac Newton realised that the force pulling an apple to the ground is the same force that holds the Moon on its path around Earth. Every mass attracts every other mass. The bigger the masses and the closer they are, the stronger the pull. You attract your friend too, but your masses are so small that the force is far too weak to notice. Earth is enormous, so its pull on you is obvious.',
            'The pull of Earth on a body is called gravity, and the force it produces is the weight of the body. Weight is mass times the strength of gravity: G = m · g. On Earth g ≈ 9.81 N/kg: every kilogram is pulled with almost 10 N. A 50 kg student weighs about 490 N (we often round to 500 N). Weight points straight down, towards the centre of Earth, which is why a plumb line always hangs vertically.',
            'On other worlds g is different, because their mass and size differ. On the Moon g = 1.62 N/kg, so our student would weigh only 81 N and could jump six times higher. On Mars g = 3.71 N/kg. On Jupiter g = 24.8 N/kg: there the same student would weigh 1240 N, like carrying two friends on their back. The mass, 50 kg, never changes.'
          ],
          hr: [
            'Isaac Newton shvatio je da je sila koja vuče jabuku k tlu ista ona sila koja drži Mjesec na njegovoj putanji oko Zemlje. Svaka masa privlači svaku drugu masu. Što su mase veće i što su bliže, privlačenje je jače. I ti privlačiš svog prijatelja, ali vaše su mase tako male da je sila preslaba da bi se primijetila. Zemlja je golema, pa je njezino privlačenje očito.',
            'Silu kojom Zemlja privlači tijelo zovemo sila teža, a njezin iznos je težina tijela. Težina je umnožak mase i jakosti sile teže: G = m · g. Na Zemlji je g ≈ 9,81 N/kg: svaki kilogram privučen je silom od gotovo 10 N. Učenik mase 50 kg ima težinu oko 490 N (često zaokružujemo na 500 N). Težina je usmjerena ravno prema dolje, prema središtu Zemlje, zato visak uvijek visi okomito.',
            'Na drugim svjetovima g je drukčiji, jer su im masa i veličina različite. Na Mjesecu je g = 1,62 N/kg, pa bi naš učenik imao težinu samo 81 N i mogao bi skočiti šest puta više. Na Marsu je g = 3,71 N/kg. Na Jupiteru je g = 24,8 N/kg: ondje bi isti učenik imao težinu 1240 N, kao da na leđima nosi dva prijatelja. Masa, 50 kg, nikad se ne mijenja.'
          ]
        }
      },
      {
        h: { en: 'Free fall', hr: 'Slobodni pad' },
        p: {
          en: [
            'Which hits the ground first, a heavy stone or a light one? Most people guess the heavy one. Around the year 1600 Galileo showed that, if air does not get in the way, all bodies fall with the same acceleration. A heavy body is pulled harder, but it is also harder to get moving, and the two effects cancel exactly. Drop a coin and a key together and you will hear a single click.',
            'A feather falls slowly only because the air pushes against it. In 1971 astronaut David Scott dropped a hammer and a feather on the airless Moon: they landed together. On Earth, air resistance grows with speed. A skydiver speeds up until the air pushes up as hard as gravity pulls down; from then on the speed stays constant, at about 200 km/h. This is the terminal speed. An open parachute makes the air push far bigger, so the terminal speed drops to a safe 20 km/h.'
          ],
          hr: [
            'Što prije padne na tlo, težak kamen ili lagan? Većina ljudi pogađa težak. Oko 1600. godine Galileo je pokazao da, ako zrak ne smeta, sva tijela padaju jednakim ubrzanjem. Teže tijelo Zemlja jače vuče, ali ga je i teže pokrenuti, i ta se dva učinka točno poništavaju. Pusti istodobno kovanicu i ključ i čut ćeš samo jedan udarac.',
            'Pero pada sporo samo zato što ga zrak koči. Godine 1971. astronaut David Scott pustio je čekić i pero na Mjesecu bez zraka: pali su zajedno. Na Zemlji otpor zraka raste s brzinom. Padobranac ubrzava dok ga zrak ne počne gurati prema gore jednako jako kao što ga sila teža vuče prema dolje; od tada mu je brzina stalna, oko 200 km/h. To je granična brzina. Otvoreni padobran silno poveća otpor zraka, pa granična brzina padne na sigurnih 20 km/h.'
          ]
        }
      },
      {
        h: { en: 'Centre of gravity and stability', hr: 'Težište i stabilnost' },
        p: {
          en: [
            'Gravity pulls on every particle of a body, but we can imagine the whole weight acting at a single point: the centre of gravity. For a ruler it is in the middle; for a hammer it is near the heavy head. Balance a ruler on one finger and your finger is right under its centre of gravity. For a ring or a boomerang the centre of gravity is in the empty space, outside the material itself.',
            'A body stands firm as long as the vertical line through its centre of gravity falls inside its base. Tilt it until that line passes the edge of the base and it topples. So two things make a body stable: a wide base and a low centre of gravity. A bus has its heavy engine and tanks low down and its wheels wide apart, so it can lean a lot without tipping over.',
            'A tightrope walker carries a long pole that bends down at the ends. It lowers the centre of gravity and slows every wobble, so balance becomes much easier. You use the same trick without thinking: when a bus brakes you spread your feet and crouch a little, making your base wider and your centre of gravity lower.'
          ],
          hr: [
            'Sila teža djeluje na svaku česticu tijela, ali možemo zamisliti da cijela težina djeluje u jednoj točki: težištu. Ravnalu je težište na sredini, a čekiću blizu teške glave. Postavi ravnalo na jedan prst tako da miruje i prst ti je točno ispod težišta. Prstenu ili bumerangu težište je u praznom prostoru, izvan samog materijala.',
            'Tijelo stoji čvrsto dok god okomica kroz njegovo težište pada unutar oslonca. Nagni ga dok ta okomica ne prijeđe rub oslonca i tijelo se prevrne. Stabilnim ga, dakle, čine dvije stvari: širok oslonac i nisko težište. Autobus ima teški motor i spremnike nisko dolje, a kotače široko razmaknute, pa se može jako nagnuti, a da se ne prevrne.',
            'Hodač po žici nosi dugu motku koja se na krajevima savija prema dolje. Ona mu spušta težište i usporava svako njihanje, pa je ravnotežu puno lakše održati. Isti trik koristiš i ti bez razmišljanja: kad autobus zakoči, raširiš noge i malo čučneš, čime proširiš oslonac i spustiš težište.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><line x1="20" y1="120" x2="400" y2="120" stroke="var(--muted)" stroke-width="2"/><rect x="60" y="40" width="90" height="80" rx="4" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><circle cx="105" cy="80" r="6" fill="var(--c5)"/><line x1="105" y1="80" x2="105" y2="120" stroke="var(--c5)" stroke-width="2" stroke-dasharray="5 4"/><g transform="rotate(-32 365 120)"><rect x="315" y="40" width="50" height="80" rx="4" fill="var(--surface2)" stroke="var(--c2)" stroke-width="2"/></g><circle cx="323" cy="99" r="6" fill="var(--c2)"/><line x1="323" y1="99" x2="323" y2="136" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 4"/><circle cx="365" cy="120" r="3" fill="var(--fg)"/></svg>'
      },
      {
        h: { en: 'The pendulum', hr: 'Njihalo' },
        p: {
          en: [
            'A pendulum is a mass hanging on a string, swinging back and forth. Gravity pulls it back towards the lowest point every time, and that keeps the swing going. The time for one complete swing, there and back, is called the period. Galileo noticed in a cathedral that a swinging lamp took the same time for a big swing as for a small one; he timed it against his own pulse.',
            'Experiments show something surprising: the period does not depend on the mass of the bob, nor on how wide the swing is (as long as the swing is not huge). It depends only on the length of the string and on g. A longer pendulum swings more slowly: a 1 m pendulum takes about 2 s for a full swing, a 25 cm one about 1 s. Because the period is so steady, pendulum clocks kept the world on time for 300 years.',
            'On the Moon, with its weaker gravity, the same pendulum would swing about two and a half times more slowly. A pendulum clock taken there would run hopelessly late. And a pendulum does not swing at all on a space station: the bob simply floats, because it is in free fall together with the astronauts.'
          ],
          hr: [
            'Njihalo je uteg obješen o nit koji se njiše naprijed-natrag. Sila teža ga svaki put vraća prema najnižoj točki i tako održava njihanje. Vrijeme jednog punog titraja, tamo i natrag, zove se period ili vrijeme titraja. Galileo je u katedrali primijetio da svjetiljki koja se njiše treba jednako vremena za veliki zamah kao i za mali; mjerio je prema otkucajima vlastitog pulsa.',
            'Pokusi pokazuju nešto iznenađujuće: period ne ovisi o masi utega niti o širini zamaha (dok god zamah nije golem). Ovisi samo o duljini niti i o g. Dulje njihalo njiše se sporije: njihalu duljine 1 m treba oko 2 s za puni titraj, a onom od 25 cm oko 1 s. Budući da je period tako postojan, satovi s njihalom držali su svijet u točnom vremenu 300 godina.',
            'Na Mjesecu, uz slabiju silu težu, isto bi se njihalo njihalo oko dva i pol puta sporije. Sat s njihalom odnesen onamo beznadno bi kasnio. A na svemirskoj postaji njihalo se uopće ne njiše: uteg jednostavno lebdi, jer je u slobodnom padu zajedno s astronautima.'
          ]
        }
      },
      {
        h: { en: 'Orbits: falling around the Earth', hr: 'Orbite: padanje oko Zemlje' },
        p: {
          en: [
            'Throw a ball horizontally and it curves down to the ground. Throw it faster and it lands farther away. Newton imagined a cannon on a very high mountain: fire fast enough, about 8 km/s, and the ball curves down exactly as fast as the Earth curves away beneath it. It never lands. It falls around the Earth forever. That is an orbit.',
            'The Moon is doing exactly this, falling around Earth once a month, and satellites do it a few hundred kilometres up, circling the planet in about 90 minutes. Astronauts on the International Space Station float not because there is no gravity there (it is still about 90 percent as strong as on the ground) but because they and their station are falling together. Like a diver in mid-air, they feel weightless, so they can push off a wall and drift across the cabin.'
          ],
          hr: [
            'Baci loptu vodoravno i ona će se zakriviti prema tlu. Baci je jače i past će dalje. Newton je zamislio top na vrlo visokoj planini: ispali li kuglu dovoljno brzo, oko 8 km/s, ona pada prema dolje točno onoliko koliko se Zemlja ispod nje zakrivljuje. Nikad ne padne na tlo. Zauvijek pada oko Zemlje. To je kruženje po orbiti.',
            'Mjesec radi upravo to, pada oko Zemlje jednom mjesečno, a sateliti to rade nekoliko stotina kilometara iznad nas i obiđu planet za oko 90 minuta. Astronauti na Međunarodnoj svemirskoj postaji lebde ne zato što ondje nema gravitacije (još je uvijek oko 90 posto jaka kao na tlu), nego zato što oni i njihova postaja padaju zajedno. Kao skakač u zraku, osjećaju se bestežinski, pa se mogu odgurnuti od zida i lebdjeti kroz kabinu.'
          ]
        }
      },
      {
        h: { en: 'Tides', hr: 'Plima i oseka' },
        p: {
          en: [
            'The Moon pulls on Earth too. It pulls hardest on the side of Earth that faces it, so the ocean there bulges towards the Moon. On the far side the water is pulled least and is left behind in a second bulge. As Earth turns under these two bulges, every coast gets two high tides and two low tides a day. In the Adriatic the difference is small, under a metre; in the Bay of Fundy in Canada the water rises more than 15 m.',
            'The Sun pulls too. When the Sun, the Moon and Earth line up, at new moon and full moon, the pulls add together and we get the biggest tides. When they stand at right angles the tides are smaller. Tides have been dragging on the oceans for billions of years and slowly slow down the spin of Earth: a day gets longer by about 2 milliseconds every century.'
          ],
          hr: [
            'I Mjesec privlači Zemlju. Najjače privlači stranu Zemlje okrenutu prema njemu, pa se ondje ocean izboči prema Mjesecu. Na suprotnoj strani voda je privučena najslabije i zaostaje u drugom izbočenju. Dok se Zemlja okreće ispod ta dva izbočenja, svaka obala dobiva dvije plime i dvije oseke dnevno. Na Jadranu je razlika mala, ispod metra; u zaljevu Fundy u Kanadi voda se diže više od 15 m.',
            'I Sunce privlači. Kad su Sunce, Mjesec i Zemlja u istom pravcu, za mladog i punog Mjeseca, privlačenja se zbrajaju i dobivamo najveće plime. Kad stoje pod pravim kutom, plime su manje. Plima i oseka milijardama godina vuku oceane i polako usporavaju vrtnju Zemlje: dan se svakih sto godina produlji za oko 2 milisekunde.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'gravitation', hr: 'gravitacija' }, def: { en: 'The attraction between all masses in the universe. Bigger and closer masses attract more strongly.', hr: 'Privlačenje između svih masa u svemiru. Veće i bliže mase privlače se jače.' } },
      { term: { en: 'gravity (force of gravity)', hr: 'sila teža' }, def: { en: 'The force with which Earth pulls bodies towards its centre.', hr: 'Sila kojom Zemlja privlači tijela prema svom središtu.' } },
      { term: { en: 'weight', hr: 'težina' }, def: { en: 'The force of gravity on a body: G = m · g, in newtons. It changes from planet to planet; mass does not.', hr: 'Sila teža koja djeluje na tijelo: G = m · g, u njutnima. Mijenja se od planeta do planeta; masa ne.' } },
      { term: { en: 'g (strength of gravity)', hr: 'g (jakost sile teže)' }, def: { en: 'How many newtons pull on each kilogram. Earth 9.81 N/kg, Moon 1.62, Mars 3.71, Jupiter 24.8.', hr: 'Koliko njutna vuče svaki kilogram. Zemlja 9,81 N/kg, Mjesec 1,62, Mars 3,71, Jupiter 24,8.' } },
      { term: { en: 'free fall', hr: 'slobodni pad' }, def: { en: 'Falling with only gravity acting. Without air, all bodies fall with the same acceleration.', hr: 'Padanje pri kojem djeluje samo sila teža. Bez zraka sva tijela padaju jednakim ubrzanjem.' } },
      { term: { en: 'air resistance', hr: 'otpor zraka' }, def: { en: 'The force with which air pushes against a moving body. It grows with speed.', hr: 'Sila kojom zrak koči tijelo koje se giba. Raste s brzinom.' } },
      { term: { en: 'terminal speed', hr: 'granična brzina' }, def: { en: 'The steady speed a falling body reaches when air resistance balances its weight.', hr: 'Stalna brzina koju tijelo u padu postigne kad otpor zraka uravnoteži njegovu težinu.' } },
      { term: { en: 'centre of gravity', hr: 'težište' }, def: { en: 'The point where we can imagine the whole weight of a body acting.', hr: 'Točka u kojoj možemo zamisliti da djeluje cijela težina tijela.' } },
      { term: { en: 'pendulum', hr: 'njihalo' }, def: { en: 'A mass on a string that swings back and forth under gravity.', hr: 'Uteg na niti koji se pod djelovanjem sile teže njiše naprijed-natrag.' } },
      { term: { en: 'period', hr: 'period (vrijeme titraja)' }, def: { en: 'The time for one complete swing of a pendulum, there and back. Depends on length and g only.', hr: 'Vrijeme jednog punog titraja njihala, tamo i natrag. Ovisi samo o duljini i o g.' } },
      { term: { en: 'orbit', hr: 'orbita' }, def: { en: 'The path of a body falling around a planet or star without ever landing.', hr: 'Putanja tijela koje pada oko planeta ili zvijezde, a nikad ne padne na njih.' } },
      { term: { en: 'weightlessness', hr: 'bestežinsko stanje' }, def: { en: 'The feeling of having no weight during free fall, for example on a space station.', hr: 'Osjećaj da nemamo težinu tijekom slobodnog pada, na primjer na svemirskoj postaji.' } }
    ],

    formulas: [
      { expr: 'G = m · g', name: { en: 'weight', hr: 'težina' }, note: { en: 'g ≈ 9.81 N/kg on Earth, 1.62 on the Moon, 3.71 on Mars, 24.8 on Jupiter', hr: 'g ≈ 9,81 N/kg na Zemlji, 1,62 na Mjesecu, 3,71 na Marsu, 24,8 na Jupiteru' } },
      { expr: 'v = g · t', name: { en: 'speed in free fall', hr: 'brzina u slobodnom padu' }, note: { en: 'with g ≈ 10 m/s²: 10 m/s more every second', hr: 'uz g ≈ 10 m/s²: svake sekunde 10 m/s više' } },
      { expr: 'T = 2π · √(l / g)', name: { en: 'period of a pendulum', hr: 'period njihala' }, note: { en: 'for the curious: longer string, longer period; mass does not appear at all', hr: 'za znatiželjne: dulja nit, dulji period; masa se uopće ne pojavljuje' } }
    ],

    funFact: {
      en: 'In 1672 the astronomer Jean Richer took a pendulum clock from Paris to Cayenne near the equator, and it lost about 2.5 minutes a day. Gravity is slightly weaker at the equator, so the pendulum swung more slowly.',
      hr: 'Godine 1672. astronom Jean Richer odnio je sat s njihalom iz Pariza u Cayenne blizu ekvatora, i sat je kasnio oko 2,5 minute na dan. Sila teža je na ekvatoru malo slabija, pa se njihalo njihalo sporije.'
    },

    experiment: {
      title: { en: 'Find the centre of gravity of a cardboard shape', hr: 'Pronađi težište kartonskog oblika' },
      materials: {
        en: ['a piece of stiff cardboard', 'scissors', 'a pencil and a ruler', 'a piece of string about 40 cm long', 'a key or a few washers as a weight', 'a pin or a thin nail', 'a cork board or a thick book to pin into'],
        hr: ['komad tvrdog kartona', 'škare', 'olovka i ravnalo', 'komad špage dug oko 40 cm', 'ključ ili nekoliko matica kao uteg', 'pribadača ili tanki čavao', 'plutena ploča ili debela knjiga u koju možeš zabosti pribadaču']
      },
      steps: {
        en: [
          'Cut an irregular shape out of the cardboard, for example a lopsided cloud or a wonky letter L.',
          'Make a small hole near the edge of the shape, push the pin through it into the cork board, and let the shape hang freely so it can swing.',
          'Tie the key to the string to make a plumb line and hang it from the same pin. When everything is still, draw the line of the string onto the cardboard with the ruler.',
          'Make a second hole somewhere else on the edge, hang the shape from it and draw the plumb line again.',
          'The two lines cross at one point: that is the centre of gravity. Mark it with a dot.',
          'Place the shape on your fingertip at the dot. It should balance. Try balancing it anywhere else: it tips.',
          'Try the same with a ruler: hold it on two fingers, one at each end, and slide them slowly towards each other. They always meet under the centre of gravity.'
        ],
        hr: [
          'Iz kartona izreži nepravilan oblik, na primjer nakrivljeni oblak ili iskrivljeno slovo L.',
          'Napravi malu rupicu blizu ruba oblika, probodi pribadaču kroz nju u plutenu ploču i pusti da oblik slobodno visi tako da se može njihati.',
          'Zaveži ključ na špagu da dobiješ visak i objesi ga na istu pribadaču. Kad se sve smiri, ravnalom precrtaj liniju špage na karton.',
          'Napravi drugu rupicu negdje drugdje na rubu, objesi oblik na nju i ponovno nacrtaj liniju viska.',
          'Dvije se linije sijeku u jednoj točki: to je težište. Označi ga točkom.',
          'Stavi oblik na vrh prsta točno na tu točku. Trebao bi biti u ravnoteži. Pokušaj ga uravnotežiti bilo gdje drugdje: prevrće se.',
          'Pokušaj isto s ravnalom: drži ga na dva prsta, po jednom na svakom kraju, i polako ih približavaj. Uvijek se sastanu ispod težišta.'
        ]
      },
      explain: {
        en: 'A hanging body always settles with its centre of gravity directly below the point it hangs from, so the plumb line passes through the centre of gravity every time. Two such lines can only cross at that one point. When you balance the shape on your finger, the finger supports it exactly where the whole weight acts, so there is nothing to tip it over.',
        hr: 'Obješeno tijelo uvijek se smiri tako da mu je težište točno ispod točke o koju visi, pa visak svaki put prolazi kroz težište. Dvije takve linije mogu se sjeći samo u toj jednoj točki. Kad oblik uravnotežiš na prstu, prst ga podupire upravo ondje gdje djeluje cijela težina, pa ga ništa ne može prevrnuti.'
      },
      safety: { en: 'Be careful with the scissors and the pin; ask for help if the cardboard is hard to cut.', hr: 'Pazi sa škarama i pribadačom; zamoli pomoć ako se karton teško reže.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What is weight?', hr: 'Što je težina?' },
        options: [{ en: 'the amount of matter in a body', hr: 'količina tvari u tijelu' }, { en: 'the force with which Earth pulls a body', hr: 'sila kojom Zemlja privlači tijelo' }, { en: 'how big a body is', hr: 'koliko je tijelo veliko' }, { en: 'the speed at which a body falls', hr: 'brzina kojom tijelo pada' }], answer: 1,
        explain: { en: 'Weight is a force, measured in newtons: G = m · g. The amount of matter is the mass, measured in kilograms.', hr: 'Težina je sila, mjeri se u njutnima: G = m · g. Količina tvari je masa, mjeri se u kilogramima.' } },
      { type: 'num', q: { en: 'A suitcase has a mass of 20 kg. What is its weight on Earth? Use g = 10 N/kg.', hr: 'Kovčeg ima masu 20 kg. Kolika mu je težina na Zemlji? Uzmi g = 10 N/kg.' },
        answer: 200, tolerance: 1, unit: 'N',
        explain: { en: 'G = m · g = 20 kg × 10 N/kg = 200 N.', hr: 'G = m · g = 20 kg × 10 N/kg = 200 N.' } },
      { type: 'mc', q: { en: 'A hammer and a feather are dropped together where there is no air. Which lands first?', hr: 'Čekić i pero pustimo istodobno ondje gdje nema zraka. Što prije padne?' },
        options: [{ en: 'the hammer', hr: 'čekić' }, { en: 'the feather', hr: 'pero' }, { en: 'they land at the same time', hr: 'padnu u istom trenutku' }, { en: 'it depends on the height', hr: 'ovisi o visini' }], answer: 2,
        explain: { en: 'Without air resistance all bodies fall with the same acceleration, as the Apollo 15 astronauts showed on the Moon.', hr: 'Bez otpora zraka sva tijela padaju jednakim ubrzanjem, kao što su astronauti Apolla 15 pokazali na Mjesecu.' } },
      { type: 'tf', q: { en: 'Your mass on the Moon is six times smaller than on Earth.', hr: 'Tvoja masa na Mjesecu šest je puta manja nego na Zemlji.' }, answer: false,
        explain: { en: 'Mass is the same everywhere. It is the weight that is about six times smaller on the Moon, because g there is 1.62 N/kg.', hr: 'Masa je svugdje jednaka. Težina je ta koja je na Mjesecu oko šest puta manja, jer je ondje g = 1,62 N/kg.' } },
      { type: 'mc', q: { en: 'When is a body most stable?', hr: 'Kad je tijelo najstabilnije?' },
        options: [{ en: 'low centre of gravity and wide base', hr: 'nisko težište i širok oslonac' }, { en: 'high centre of gravity and narrow base', hr: 'visoko težište i uzak oslonac' }, { en: 'high centre of gravity and wide base', hr: 'visoko težište i širok oslonac' }, { en: 'low centre of gravity and narrow base', hr: 'nisko težište i uzak oslonac' }], answer: 0,
        explain: { en: 'With a low centre of gravity and a wide base the body can tilt a long way before the vertical through its centre of gravity leaves the base.', hr: 'S niskim težištem i širokim osloncem tijelo se može jako nagnuti prije nego što okomica kroz težište izađe iz oslonca.' } },
      { type: 'mc', q: { en: 'What does the period of a pendulum depend on?', hr: 'O čemu ovisi period njihala?' },
        options: [{ en: 'the mass of the bob', hr: 'o masi utega' }, { en: 'how wide it swings', hr: 'o širini zamaha' }, { en: 'the length of the string', hr: 'o duljini niti' }, { en: 'the thickness of the string', hr: 'o debljini niti' }], answer: 2,
        explain: { en: 'Only the length (and g) matter. A heavier bob or a wider swing gives the same period, which is what makes pendulum clocks so reliable.', hr: 'Važna je samo duljina (i g). Teži uteg ili širi zamah daju isti period, i zato su satovi s njihalom tako pouzdani.' } },
      { type: 'tf', q: { en: 'Astronauts on the space station float because there is no gravity up there.', hr: 'Astronauti na svemirskoj postaji lebde jer gore nema gravitacije.' }, answer: false,
        explain: { en: 'Gravity at the station is still about 90 percent as strong as on the ground. The astronauts float because they and the station are in free fall together.', hr: 'Sila teža na postaji još je uvijek oko 90 posto jaka kao na tlu. Astronauti lebde jer su oni i postaja zajedno u slobodnom padu.' } },
      { type: 'mc', q: { en: 'Why does a skydiver stop speeding up after a few seconds?', hr: 'Zašto padobranac nakon nekoliko sekundi prestane ubrzavati?' },
        options: [{ en: 'gravity stops acting after a few seconds', hr: 'sila teža nakon nekoliko sekundi prestane djelovati' }, { en: 'the mass of the skydiver gets smaller', hr: 'masa padobranca se smanji' }, { en: 'gravity is weaker so high up', hr: 'sila teža je tako visoko slabija' }, { en: 'air resistance grows until it balances the weight', hr: 'otpor zraka raste dok ne uravnoteži težinu' }], answer: 3,
        explain: { en: 'Air resistance grows with speed. When it equals the weight, the forces are balanced and the speed stays constant: the terminal speed.', hr: 'Otpor zraka raste s brzinom. Kad postane jednak težini, sile su uravnotežene i brzina ostaje stalna: to je granična brzina.' } },
      { type: 'num', q: { en: 'An astronaut has a mass of 50 kg. What is her weight on the Moon? Use g = 1.6 N/kg.', hr: 'Astronautkinja ima masu 50 kg. Kolika joj je težina na Mjesecu? Uzmi g = 1,6 N/kg.' },
        answer: 80, tolerance: 1, unit: 'N',
        explain: { en: 'G = m · g = 50 kg × 1.6 N/kg = 80 N. On Earth she weighs about 500 N, six times more.', hr: 'G = m · g = 50 kg × 1,6 N/kg = 80 N. Na Zemlji joj je težina oko 500 N, šest puta veća.' } },
      { type: 'mc', q: { en: 'How many high tides does a coast usually get in one day?', hr: 'Koliko plima obala obično ima u jednom danu?' },
        options: [{ en: 'one', hr: 'jednu' }, { en: 'two', hr: 'dvije' }, { en: 'four', hr: 'četiri' }, { en: 'seven', hr: 'sedam' }], answer: 1,
        explain: { en: 'The oceans bulge on the side facing the Moon and on the opposite side. As Earth turns through both bulges, each coast gets two high tides a day.', hr: 'Oceani se izboče na strani okrenutoj Mjesecu i na suprotnoj strani. Dok se Zemlja okreće kroz oba izbočenja, svaka obala dobiva dvije plime dnevno.' } },
      { type: 'mc', q: { en: 'Why does a satellite stay in orbit around Earth?', hr: 'Zašto satelit ostaje u orbiti oko Zemlje?' },
        options: [{ en: 'there is no gravity in space', hr: 'u svemiru nema gravitacije' }, { en: 'it falls around Earth while moving sideways very fast', hr: 'pada oko Zemlje dok se vrlo brzo giba bočno' }, { en: 'its engines push it upwards all the time', hr: 'motori ga stalno guraju prema gore' }, { en: 'it is lighter than air', hr: 'lakši je od zraka' }], answer: 1,
        explain: { en: 'Gravity keeps pulling the satellite down, but it moves sideways so fast (about 8 km/s) that the ground curves away as quickly as it falls.', hr: 'Sila teža stalno vuče satelit prema dolje, ali on se tako brzo giba bočno (oko 8 km/s) da se tlo zakrivljuje jednako brzo koliko on pada.' } }
    ]
  });
})();
