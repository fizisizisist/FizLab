/* FizLab topic: Density / Gustoća */
(function () {
  'use strict';
  window.Content.register({
    id: 'density',
    order: 20,
    gradeLevel: 7,
    color: 'c1',
    title: { en: 'Density', hr: 'Gustoća' },
    intro: {
      en: 'Why does a steel ship float while a steel nail sinks? The answer is density, the secret behind everything that floats, sinks or rises.',
      hr: 'Zašto čelični brod pluta, a čelični čavao tone? Odgovor je gustoća, tajna svega što pluta, tone ili se diže.'
    },
    sims: ['density'],

    lesson: [
      {
        h: { en: 'What is density?', hr: 'Što je gustoća?' },
        p: {
          en: [
            'Which is heavier, a kilogram of feathers or a kilogram of iron? Neither: both have a mass of 1 kg. But the feathers fill a big sack while the iron fits in your palm. Iron packs much more mass into the same space. We say that iron has a greater density. Density tells us how much mass is squeezed into one unit of volume.',
            'To find density we divide mass by volume: ρ = m / V (ρ is the Greek letter rho). If a stone has a mass of 250 g and a volume of 100 cm³, its density is 250 g / 100 cm³ = 2.5 g/cm³. Every cubic centimetre of that stone has a mass of 2.5 g. Density is a property of the substance, not of the body: a small iron nail and a huge iron anchor have the same density.'
          ],
          hr: [
            'Što je teže, kilogram perja ili kilogram željeza? Nijedno: oboje ima masu 1 kg. Ali perje ispunjava veliku vreću, a željezo stane na dlan. Željezo u isti prostor zbija puno više mase. Kažemo da željezo ima veću gustoću. Gustoća nam govori koliko je mase stisnuto u jednu jedinicu obujma.',
            'Gustoću računamo tako da masu podijelimo obujmom: ρ = m / V (ρ je grčko slovo ro). Ako kamen ima masu 250 g i obujam 100 cm³, gustoća mu je 250 g / 100 cm³ = 2,5 g/cm³. Svaki kubni centimetar tog kamena ima masu 2,5 g. Gustoća je svojstvo tvari, a ne tijela: mali željezni čavao i golemo željezno sidro imaju istu gustoću.'
          ]
        }
      },
      {
        h: { en: 'Units and the densities of common substances', hr: 'Jedinice i gustoće poznatih tvari' },
        p: {
          en: [
            'The official unit of density is the kilogram per cubic metre (kg/m³). In the lab we often use grams per cubic centimetre (g/cm³) because the numbers are handier. The two are easy to convert: 1 g/cm³ = 1000 kg/m³. Water has a density of 1 g/cm³, which is 1000 kg/m³: a litre of water has a mass of 1 kg, and a cubic metre of water has a mass of a whole tonne.',
            'Some useful densities in kg/m³: air 1.2, pine wood about 700, cooking oil about 920, ice 917, water 1000, aluminium 2700, iron 7870, gold 19 300. Gold is almost 20 times denser than water: a gold bar the size of a smartphone has a mass of about 1.5 kg. A cubic metre of air, roughly the size of a washing machine, has a mass of only 1.2 kg.'
          ],
          hr: [
            'Službena jedinica gustoće je kilogram po kubnom metru (kg/m³). U laboratoriju često koristimo gram po kubnom centimetru (g/cm³) jer su brojevi zgodniji. Pretvaranje je jednostavno: 1 g/cm³ = 1000 kg/m³. Voda ima gustoću 1 g/cm³, odnosno 1000 kg/m³: litra vode ima masu 1 kg, a kubni metar vode masu od cijele tone.',
            'Nekoliko korisnih gustoća u kg/m³: zrak 1,2, borovo drvo oko 700, jestivo ulje oko 920, led 917, voda 1000, aluminij 2700, željezo 7870, zlato 19 300. Zlato je gotovo 20 puta gušće od vode: zlatna pločica veličine mobitela ima masu oko 1,5 kg. Kubni metar zraka, otprilike veličine perilice rublja, ima masu od samo 1,2 kg.'
          ]
        }
      },
      {
        h: { en: 'How to measure density', hr: 'Kako izmjeriti gustoću' },
        p: {
          en: [
            'To measure the density of a solid you need two numbers. First, put it on a balance to find its mass. Then find its volume: for a box multiply the edges; for an irregular stone lower it into a measuring cylinder and see how much the water rises. Finally divide: ρ = m / V. A pebble of 54 g that raises the water by 20 mL has a density of 54 g / 20 cm³ = 2.7 g/cm³.',
            'For a liquid, weigh an empty measuring cylinder, pour in exactly 100 mL and weigh again. The difference is the mass of the liquid. If 100 mL of cooking oil has a mass of 92 g, its density is 0.92 g/cm³, less than water. Mechanics check car batteries and dairies check milk in a similar way: a change in density tells them that something inside has changed.'
          ],
          hr: [
            'Da izmjeriš gustoću čvrstog tijela, trebaš dva broja. Najprije ga stavi na vagu i izmjeri masu. Zatim odredi obujam: kvadru pomnoži bridove, a nepravilan kamen spusti u menzuru i pogledaj koliko se voda podigla. Na kraju podijeli: ρ = m / V. Kamenčić mase 54 g koji podigne vodu za 20 mL ima gustoću 54 g / 20 cm³ = 2,7 g/cm³.',
            'Za tekućinu izvaži praznu menzuru, ulij točno 100 mL i izvaži ponovno. Razlika je masa tekućine. Ako 100 mL jestivog ulja ima masu 92 g, gustoća mu je 0,92 g/cm³, manja nego u vode. Na sličan način automehaničari provjeravaju akumulatore, a mljekare mlijeko: promjena gustoće otkriva im da se unutra nešto promijenilo.'
          ]
        }
      },
      {
        h: { en: 'Float or sink?', hr: 'Pluta ili tone?' },
        p: {
          en: [
            'Drop a body into a liquid and compare the two densities. If the body is denser than the liquid, it sinks: a stone (about 2500 kg/m³) sinks in water. If it is less dense, it floats: wood (700 kg/m³) and oil float on water. A body with the same density as the liquid hovers anywhere inside it, like a fish that neither rises nor sinks.',
            'Why does anything float at all? Water pushes upwards on every body dipped into it. This upward push is called buoyancy. It is equal to the weight of the water that the body pushes aside. A floating body pushes aside just enough water for the buoyancy to balance its weight. You feel buoyancy whenever you lift a friend in a pool: they seem almost weightless.',
            'A steel nail sinks, yet a steel ship floats. The trick is the shape. A ship is mostly hollow and full of air, so its average density, steel plus air, is less than the density of water. Squash the ship into a solid lump and it would sink at once. A submarine uses this on purpose: it lets water into its tanks to dive and blows the water out with air to rise.'
          ],
          hr: [
            'Spusti tijelo u tekućinu i usporedi dvije gustoće. Ako je tijelo gušće od tekućine, tone: kamen (oko 2500 kg/m³) tone u vodi. Ako je manje gusto, pluta: drvo (700 kg/m³) i ulje plutaju na vodi. Tijelo iste gustoće kao tekućina lebdi bilo gdje u njoj, kao riba koja se niti diže niti tone.',
            'Zašto uopće išta pluta? Voda gura prema gore svako tijelo uronjeno u nju. Tu silu prema gore zovemo uzgon. Jednaka je težini vode koju tijelo istisne. Tijelo koje pluta istisne upravo toliko vode da uzgon uravnoteži njegovu težinu. Uzgon osjetiš svaki put kad u bazenu podigneš prijatelja: čini se gotovo bestežinskim.',
            'Čelični čavao tone, a čelični brod pluta. Trik je u obliku. Brod je većinom šupalj i pun zraka, pa mu je prosječna gustoća, čelik plus zrak, manja od gustoće vode. Zgnječi brod u punu grudu i odmah bi potonuo. Podmornica to koristi namjerno: pušta vodu u spremnike da zaroni, a istiskuje je zrakom da izroni.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><path d="M60,15 L60,125 L360,125 L360,15" fill="none" stroke="var(--fg)" stroke-width="2"/><rect x="61" y="45" width="298" height="79" fill="var(--c1)" opacity="0.35"/><line x1="60" y1="45" x2="360" y2="45" stroke="var(--c1)" stroke-width="3"/><text x="372" y="50" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">1000</text><rect x="110" y="30" width="60" height="40" rx="4" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><text x="140" y="55" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">700</text><rect x="250" y="83" width="60" height="40" rx="4" fill="var(--muted)" stroke="var(--fg)" stroke-width="2"/><text x="280" y="108" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">7870</text></svg>'
      },
      {
        h: { en: 'Ice floats and the sea holds you up', hr: 'Led pluta, a more te nosi' },
        p: {
          en: [
            'Most substances shrink when they freeze, but water is odd: ice takes up more space than the water it came from, so its density (917 kg/m³) is lower than that of water. That is why ice cubes float and why icebergs float with about nine tenths hidden under the surface. It is also why a full bottle of water can crack in the freezer.',
            'This oddity keeps lakes alive in winter. Ice forms on top and acts like a lid, slowing down the cooling of the water below. Fish and plants survive in the liquid water under the ice. If ice sank, lakes would freeze from the bottom up and could turn completely solid, killing everything in them.',
            'Dissolving salt makes water denser. Sea water (about 1025 kg/m³) holds you up slightly better than a swimming pool. The Dead Sea is about ten times saltier than the ocean, with a density of around 1240 kg/m³, so people float on their backs reading a newspaper, unable to sink. A fresh egg sinks in tap water but floats in very salty water.'
          ],
          hr: [
            'Većina tvari skuplja se kad se smrzava, ali voda je neobična: led zauzima više prostora od vode od koje je nastao, pa mu je gustoća (917 kg/m³) manja od gustoće vode. Zato kockice leda plutaju i zato sante leda plutaju s oko devet desetina skrivenih ispod površine. Zato i puna boca vode može puknuti u zamrzivaču.',
            'Ta neobičnost zimi održava jezera na životu. Led se stvara na površini i djeluje kao poklopac koji usporava hlađenje vode ispod njega. Ribe i biljke prežive u tekućoj vodi pod ledom. Kad bi led tonuo, jezera bi se smrzavala od dna prema gore i mogla bi se potpuno zalediti, a sve u njima bi uginulo.',
            'Otopljena sol čini vodu gušćom. Morska voda (oko 1025 kg/m³) drži te na površini malo bolje nego bazen. Mrtvo more oko deset puta je slanije od oceana, gustoće oko 1240 kg/m³, pa ljudi plutaju na leđima i čitaju novine, a ne mogu potonuti. Svježe jaje tone u vodi iz slavine, ali pluta u jako slanoj vodi.'
          ]
        }
      },
      {
        h: { en: 'Hot air rises', hr: 'Topli zrak se diže' },
        p: {
          en: [
            'Gases have density too, just very little. Air is about 1.2 kg/m³. When air is heated its particles move faster and spread apart, so the same mass fills more space: hot air is less dense than cold air. Surrounded by cooler air it is pushed upwards, exactly like a cork in water. That is why a hot-air balloon rises, why smoke goes up and why the air near the ceiling is warmer than near the floor.',
            'The same idea drives the weather. The Sun warms the ground, the air above it rises, cooler air flows in to take its place, and we feel wind. A helium balloon rises for the same reason: helium is about seven times less dense than air. Fill the same balloon with your breath and it drops to the floor, because the air inside is no lighter than the air outside and the rubber adds mass.'
          ],
          hr: [
            'I plinovi imaju gustoću, samo vrlo malu. Zrak ima oko 1,2 kg/m³. Kad zrak zagrijemo, čestice se gibaju brže i razmiču se, pa ista masa ispunjava više prostora: topli zrak manje je gust od hladnog. Okružen hladnijim zrakom, potisnut je prema gore, baš kao pluteni čep u vodi. Zato se balon na vrući zrak diže, zato dim ide uvis i zato je zrak pod stropom topliji nego pri podu.',
            'Ista zamisao pokreće i vrijeme. Sunce grije tlo, zrak iznad njega se diže, hladniji zrak dotječe na njegovo mjesto i mi osjećamo vjetar. Balon s helijem diže se iz istog razloga: helij je oko sedam puta manje gust od zraka. Napuhneš li isti balon ustima, pada na pod, jer zrak u njemu nije lakši od okolnog zraka, a guma dodaje masu.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'density', hr: 'gustoća' }, def: { en: 'How much mass is packed into one unit of volume: ρ = m / V. Unit: kg/m³ or g/cm³.', hr: 'Koliko je mase zbijeno u jedinicu obujma: ρ = m / V. Jedinica: kg/m³ ili g/cm³.' } },
      { term: { en: 'kilogram per cubic metre (kg/m³)', hr: 'kilogram po kubnom metru (kg/m³)' }, def: { en: 'The official unit of density. Water: 1000 kg/m³.', hr: 'Službena jedinica gustoće. Voda: 1000 kg/m³.' } },
      { term: { en: 'gram per cubic centimetre (g/cm³)', hr: 'gram po kubnom centimetru (g/cm³)' }, def: { en: 'A handy unit of density. 1 g/cm³ = 1000 kg/m³. Water: 1 g/cm³.', hr: 'Zgodna jedinica gustoće. 1 g/cm³ = 1000 kg/m³. Voda: 1 g/cm³.' } },
      { term: { en: 'mass', hr: 'masa' }, def: { en: 'How much matter a body contains, measured in kilograms or grams.', hr: 'Koliko tvari tijelo sadrži, mjeri se u kilogramima ili gramima.' } },
      { term: { en: 'volume', hr: 'obujam (volumen)' }, def: { en: 'How much space a body takes up, in m³, dm³ (litres) or cm³ (millilitres).', hr: 'Koliko prostora tijelo zauzima, u m³, dm³ (litrama) ili cm³ (mililitrima).' } },
      { term: { en: 'buoyancy', hr: 'uzgon' }, def: { en: 'The upward push of a liquid or gas on a body dipped into it. Equal to the weight of the fluid pushed aside.', hr: 'Sila prema gore kojom tekućina ili plin djeluje na uronjeno tijelo. Jednaka je težini istisnute tekućine.' } },
      { term: { en: 'to float', hr: 'plutati' }, def: { en: 'To stay on the surface of a liquid. A body floats when it is less dense than the liquid.', hr: 'Ostati na površini tekućine. Tijelo pluta kad je manje gusto od tekućine.' } },
      { term: { en: 'to sink', hr: 'tonuti' }, def: { en: 'To fall to the bottom of a liquid. A body sinks when it is denser than the liquid.', hr: 'Padati na dno tekućine. Tijelo tone kad je gušće od tekućine.' } },
      { term: { en: 'to hover', hr: 'lebdjeti' }, def: { en: 'To stay anywhere inside a liquid, neither rising nor sinking. The body and the liquid have the same density.', hr: 'Ostati bilo gdje u tekućini, ne dizati se i ne tonuti. Tijelo i tekućina imaju istu gustoću.' } },
      { term: { en: 'average density', hr: 'prosječna gustoća' }, def: { en: 'The total mass of a body divided by its total volume, including any air inside. A hollow ship has a low average density.', hr: 'Ukupna masa tijela podijeljena njegovim ukupnim obujmom, uključujući zrak unutra. Šupalj brod ima malu prosječnu gustoću.' } },
      { term: { en: 'measuring cylinder', hr: 'menzura' }, def: { en: 'A tall glass with a scale, used to measure the volume of liquids and of irregular solids.', hr: 'Visoka staklena posuda s ljestvicom za mjerenje obujma tekućina i nepravilnih tijela.' } }
    ],

    formulas: [
      { expr: 'ρ = m / V', name: { en: 'density', hr: 'gustoća' }, note: { en: 'mass divided by volume', hr: 'masa podijeljena obujmom' } },
      { expr: 'm = ρ · V', name: { en: 'mass from density', hr: 'masa iz gustoće' }, note: { en: 'density times volume', hr: 'gustoća puta obujam' } },
      { expr: 'V = m / ρ', name: { en: 'volume from density', hr: 'obujam iz gustoće' }, note: { en: 'mass divided by density', hr: 'masa podijeljena gustoćom' } },
      { expr: '1 g/cm³ = 1000 kg/m³', name: { en: 'converting units of density', hr: 'pretvaranje jedinica gustoće' }, note: { en: 'water is 1 g/cm³ = 1000 kg/m³', hr: 'voda ima 1 g/cm³ = 1000 kg/m³' } }
    ],

    funFact: {
      en: 'Saturn is the only planet in the Solar System less dense than water: about 690 kg/m³. If you could find a bathtub big enough, Saturn would float in it.',
      hr: 'Saturn je jedini planet Sunčeva sustava manje gust od vode: oko 690 kg/m³. Kad bi postojala dovoljno velika kada, Saturn bi u njoj plutao.'
    },

    experiment: {
      title: { en: 'Build a density tower', hr: 'Napravi toranj gustoće' },
      materials: {
        en: ['a tall, narrow glass', 'honey', 'water', 'a few drops of food colouring', 'cooking oil', 'a spoon', 'small objects: a coin, a grape, a plastic brick, a piece of cork'],
        hr: ['visoka uska čaša', 'med', 'voda', 'nekoliko kapi jestive boje', 'jestivo ulje', 'žlica', 'mali predmeti: kovanica, zrno grožđa, plastična kockica, komadić pluta']
      },
      steps: {
        en: [
          'Pour honey into the glass until it is about one third full. Pour it straight down the middle so it does not stick to the walls.',
          'Mix water with a few drops of food colouring. Hold a spoon just above the honey and pour the water slowly over the back of the spoon, so it does not splash into the honey.',
          'Pour cooking oil the same way, slowly over the spoon, on top of the water.',
          'Wait a minute and look: three clear layers. Which liquid is at the bottom, which in the middle, which on top?',
          'Gently drop in the coin, the grape, the plastic brick and the cork, one at a time. Watch where each one stops.',
          'Write down the order of the liquids and of the objects, from the bottom up. Then order them by density.'
        ],
        hr: [
          'Ulij med u čašu do otprilike jedne trećine. Ulijevaj ga ravno u sredinu da se ne zalijepi za stijenke.',
          'Pomiješaj vodu s nekoliko kapi jestive boje. Drži žlicu malo iznad meda i polako ulijevaj vodu preko leđa žlice, da ne prska u med.',
          'Na isti način, polako preko žlice, ulij jestivo ulje na vodu.',
          'Pričekaj minutu i pogledaj: tri jasna sloja. Koja je tekućina na dnu, koja u sredini, koja na vrhu?',
          'Lagano ubaci kovanicu, zrno grožđa, plastičnu kockicu i pluto, jedno po jedno. Promatraj gdje se svaki predmet zaustavi.',
          'Zapiši redoslijed tekućina i predmeta od dna prema vrhu. Zatim ih poredaj po gustoći.'
        ]
      },
      explain: {
        en: 'Each liquid floats on the denser one below it: honey (about 1.4 g/cm³) at the bottom, water (1.0 g/cm³) in the middle, oil (0.92 g/cm³) on top. Each object sinks until it reaches a liquid denser than itself: the coin falls to the bottom, the grape (about 1.1 g/cm³) stops on the honey, the plastic brick sits between water and oil, and the cork floats on everything.',
        hr: 'Svaka tekućina pluta na gušćoj ispod sebe: med (oko 1,4 g/cm³) na dnu, voda (1,0 g/cm³) u sredini, ulje (0,92 g/cm³) na vrhu. Svaki predmet tone dok ne dođe do tekućine gušće od sebe: kovanica pada na dno, zrno grožđa (oko 1,1 g/cm³) zaustavlja se na medu, plastična kockica stane između vode i ulja, a pluto pluta na svemu.'
      },
      safety: { en: 'Food colouring stains clothes and tablecloths, so cover the table and wear an old T-shirt.', hr: 'Jestiva boja ostavlja mrlje na odjeći i stolnjaku, zato zaštiti stol i obuci staru majicu.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What does density tell us?', hr: 'Što nam govori gustoća?' },
        options: [{ en: 'how heavy a body is', hr: 'koliko je tijelo teško' }, { en: 'how much mass is in one unit of volume', hr: 'koliko je mase u jednoj jedinici obujma' }, { en: 'how big a body is', hr: 'koliko je tijelo veliko' }, { en: 'how fast a body sinks', hr: 'koliko brzo tijelo tone' }], answer: 1,
        explain: { en: 'Density is mass divided by volume: how tightly the mass is packed. A big body can have a small density and a tiny body a huge one.', hr: 'Gustoća je masa podijeljena obujmom: koliko je masa zbijena. Veliko tijelo može imati malu gustoću, a sitno tijelo golemu.' } },
      { type: 'mc', q: { en: 'Which is a unit of density?', hr: 'Što je jedinica gustoće?' },
        options: [{ en: 'kg', hr: 'kg' }, { en: 'm³', hr: 'm³' }, { en: 'kg/m³', hr: 'kg/m³' }, { en: 'N', hr: 'N' }], answer: 2,
        explain: { en: 'Density is mass per volume, so its unit is kg/m³ (or g/cm³). kg is mass, m³ is volume and N is force.', hr: 'Gustoća je masa po obujmu, pa je jedinica kg/m³ (ili g/cm³). kg je masa, m³ obujam, a N sila.' } },
      { type: 'tf', q: { en: 'A small iron nail and a big iron anchor have the same density.', hr: 'Mali željezni čavao i veliko željezno sidro imaju istu gustoću.' }, answer: true,
        explain: { en: 'Density is a property of the substance. The anchor has more mass, but also more volume, in the same ratio.', hr: 'Gustoća je svojstvo tvari. Sidro ima više mase, ali i više obujma, u istom omjeru.' } },
      { type: 'num', q: { en: 'A stone has a mass of 300 g and a volume of 150 cm³. What is its density?', hr: 'Kamen ima masu 300 g i obujam 150 cm³. Kolika mu je gustoća?' },
        answer: 2, tolerance: 0.05, unit: 'g/cm³',
        explain: { en: 'ρ = m / V = 300 g / 150 cm³ = 2 g/cm³. Twice as dense as water, so it sinks.', hr: 'ρ = m / V = 300 g / 150 cm³ = 2 g/cm³. Dvostruko gušći od vode, pa tone.' } },
      { type: 'mc', q: { en: '1 g/cm³ is the same as…', hr: '1 g/cm³ isto je što i…' },
        options: [{ en: '1 kg/m³', hr: '1 kg/m³' }, { en: '10 kg/m³', hr: '10 kg/m³' }, { en: '100 kg/m³', hr: '100 kg/m³' }, { en: '1000 kg/m³', hr: '1000 kg/m³' }], answer: 3,
        explain: { en: 'A cubic metre holds a million cubic centimetres and a kilogram is a thousand grams, so 1 g/cm³ = 1 000 000 g/m³ = 1000 kg/m³.', hr: 'U kubni metar stane milijun kubnih centimetara, a kilogram ima tisuću grama, pa je 1 g/cm³ = 1 000 000 g/m³ = 1000 kg/m³.' } },
      { type: 'mc', q: { en: 'A body floats on a liquid when…', hr: 'Tijelo pluta na tekućini kad…' },
        options: [{ en: 'it has a mass under 1 kg', hr: 'ima masu manju od 1 kg' }, { en: 'it is less dense than the liquid', hr: 'je manje gusto od tekućine' }, { en: 'it is denser than the liquid', hr: 'je gušće od tekućine' }, { en: 'it has a large volume', hr: 'ima velik obujam' }], answer: 1,
        explain: { en: 'Only the comparison of densities matters. A huge log floats and a tiny pebble sinks.', hr: 'Važna je samo usporedba gustoća. Golema cjepanica pluta, a sitan kamenčić tone.' } },
      { type: 'mc', q: { en: 'Why does ice float on water?', hr: 'Zašto led pluta na vodi?' },
        options: [{ en: 'because ice is colder than water', hr: 'jer je led hladniji od vode' }, { en: 'because ice is harder than water', hr: 'jer je led tvrđi od vode' }, { en: 'because ice is less dense than water', hr: 'jer je led manje gust od vode' }, { en: 'because ice has less mass than water', hr: 'jer led ima manju masu od vode' }], answer: 2,
        explain: { en: 'Water expands when it freezes, so ice has a density of 917 kg/m³, less than the 1000 kg/m³ of water.', hr: 'Voda se smrzavanjem širi, pa led ima gustoću 917 kg/m³, manju od 1000 kg/m³ vode.' } },
      { type: 'tf', q: { en: 'It is easier to float in the Dead Sea than in a swimming pool.', hr: 'U Mrtvom moru lakše je plutati nego u bazenu.' }, answer: true,
        explain: { en: 'The Dead Sea is extremely salty, so its water is much denser (about 1240 kg/m³) and pushes up harder on your body.', hr: 'Mrtvo more iznimno je slano, pa mu je voda puno gušća (oko 1240 kg/m³) i jače gura tvoje tijelo prema gore.' } },
      { type: 'mc', q: { en: 'Why does a steel ship float?', hr: 'Zašto čelični brod pluta?' },
        options: [{ en: 'its hollow hull makes its average density lower than that of water', hr: 'šuplji trup čini njegovu prosječnu gustoću manjom od gustoće vode' }, { en: 'steel is less dense than water', hr: 'čelik je manje gust od vode' }, { en: 'sea water is much denser than steel', hr: 'morska voda puno je gušća od čelika' }, { en: 'the engines keep pushing it upwards', hr: 'motori ga stalno guraju prema gore' }], answer: 0,
        explain: { en: 'Steel itself sinks (7870 kg/m³). But the ship is mostly air, so steel plus air together are less dense than water.', hr: 'Sam čelik tone (7870 kg/m³). Ali brod je većinom zrak, pa su čelik i zrak zajedno manje gusti od vode.' } },
      { type: 'num', q: { en: 'A block of wood has a volume of 2000 cm³ and a density of 0.7 g/cm³. What is its mass in grams?', hr: 'Drveni blok ima obujam 2000 cm³ i gustoću 0,7 g/cm³. Kolika mu je masa u gramima?' },
        answer: 1400, tolerance: 10, unit: 'g',
        explain: { en: 'm = ρ · V = 0.7 g/cm³ × 2000 cm³ = 1400 g = 1.4 kg.', hr: 'm = ρ · V = 0,7 g/cm³ × 2000 cm³ = 1400 g = 1,4 kg.' } },
      { type: 'mc', q: { en: 'A glass holds honey (1.4 g/cm³), water (1.0 g/cm³) and oil (0.92 g/cm³) in layers. Where does a grape with a density of 1.1 g/cm³ end up?', hr: 'U čaši su slojevi meda (1,4 g/cm³), vode (1,0 g/cm³) i ulja (0,92 g/cm³). Gdje će se zaustaviti zrno grožđa gustoće 1,1 g/cm³?' },
        options: [{ en: 'at the very bottom, under the honey', hr: 'na samom dnu, ispod meda' }, { en: 'between the honey and the water', hr: 'između meda i vode' }, { en: 'between the water and the oil', hr: 'između vode i ulja' }, { en: 'floating on top of the oil', hr: 'plutajući na ulju' }], answer: 1,
        explain: { en: 'The grape is denser than water and oil, so it sinks through them, but less dense than honey, so it stops on the honey.', hr: 'Grožđe je gušće od vode i ulja, pa kroz njih tone, ali manje gusto od meda, pa se zaustavi na medu.' } }
    ]
  });
})();
