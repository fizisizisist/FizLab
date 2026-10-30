/* FizLab topic: Heat and Temperature / Toplina i temperatura */
(function () {
  'use strict';
  window.Content.register({
    id: 'heat',
    order: 90,
    gradeLevel: 7,
    color: 'c2',
    title: { en: 'Heat and Temperature', hr: 'Toplina i temperatura' },
    intro: {
      en: 'Why does a metal spoon feel colder than a wooden one at the same temperature? Find out what heat really is and how it moves through everything around you.',
      hr: 'Zašto se metalna žlica čini hladnijom od drvene iako su iste temperature? Saznaj što je toplina zapravo i kako putuje kroz sve oko tebe.'
    },
    sims: ['heat', 'heattransfer', 'states'],

    lesson: [
      {
        h: { en: 'Temperature', hr: 'Temperatura' },
        p: {
          en: [
            'Everything around you is made of tiny particles (atoms and molecules) that never stop moving. In hot things they rush about quickly; in cold things they move slowly. Temperature is a measure of how fast, on average, the particles are moving. We measure it with a thermometer in degrees Celsius (°C).',
            'The Celsius scale has two fixed points: ice melts at 0 °C and water boils at 100 °C (at normal air pressure). A healthy human body is about 37 °C, a comfortable room is around 20 °C, and a freezer is about −18 °C. Scientists also use the kelvin (K): 0 K is −273 °C, the coldest possible temperature, where particles would barely move at all. One kelvin step is the same size as one degree Celsius.'
          ],
          hr: [
            'Sve oko tebe građeno je od sitnih čestica (atoma i molekula) koje se neprestano gibaju. U vrućim tijelima jure brzo, u hladnima se gibaju sporo. Temperatura je mjera za to koliko se brzo, u prosjeku, čestice gibaju. Mjerimo je termometrom u Celzijevim stupnjevima (°C).',
            'Celzijeva ljestvica ima dvije čvrste točke: led se tali pri 0 °C, a voda vrije pri 100 °C (pri normalnom tlaku zraka). Zdravo ljudsko tijelo ima oko 37 °C, ugodna soba oko 20 °C, a zamrzivač oko −18 °C. Znanstvenici koriste i kelvin (K): 0 K je −273 °C, najniža moguća temperatura, pri kojoj bi se čestice jedva gibale. Jedan kelvin jednako je velik kao jedan Celzijev stupanj.'
          ]
        }
      },
      {
        h: { en: 'Internal energy and heat', hr: 'Unutarnja energija i toplina' },
        p: {
          en: [
            'The total energy of all the moving particles in an object is its internal energy. A bathtub of warm water has far more internal energy than a cup of boiling tea, even though the tea has the higher temperature, simply because the bathtub holds so many more particles.',
            'When a hot object touches a cold one, energy passes from the hot one to the cold one. This energy on the move is called heat, written Q and measured in joules (J). Heat always flows by itself from hotter to colder, never the other way. Your hot chocolate warms the cold spoon; the spoon never makes the chocolate hotter.',
            'The flow continues until both objects have the same temperature. Then we say they are in thermal equilibrium. That is why a forgotten cup of tea ends up at room temperature, and why an ice cube in a drink melts while the drink cools down.'
          ],
          hr: [
            'Ukupna energija svih čestica koje se gibaju u nekom tijelu zove se unutarnja energija. Kada puna tople vode ima mnogo više unutarnje energije nego šalica kipućeg čaja, iako čaj ima višu temperaturu, jednostavno zato što kada sadrži mnogo više čestica.',
            'Kad se vruće tijelo dodirne s hladnim, energija prelazi s vrućeg na hladno. Ta energija u prijelazu zove se toplina, označava se s Q i mjeri u džulima (J). Toplina sama od sebe uvijek prelazi s toplijeg tijela na hladnije, nikad obrnuto. Tvoja vruća čokolada grije hladnu žličicu; žličica nikad ne čini čokoladu vrućom.',
            'Prijelaz traje dok oba tijela ne postignu istu temperaturu. Tada kažemo da su u toplinskoj ravnoteži. Zato zaboravljena šalica čaja na kraju ima sobnu temperaturu i zato se kocka leda u piću tali dok se piće hladi. Termometar radi na istom načelu: pokazuje točnu temperaturu tek kad se izjednači s tijelom koje mjeri.'
          ]
        }
      },
      {
        h: { en: 'Three ways heat travels', hr: 'Tri načina prijenosa topline' },
        p: {
          en: [
            'Conduction is heat passing through a material from particle to particle. Metals conduct heat very well: hold a metal spoon in hot soup and the handle soon gets hot. Wood, plastic, glass and air conduct poorly; that is why pot handles are made of plastic. A metal spoon feels colder than a wooden one at the same temperature because it carries heat away from your hand faster.',
            'Convection happens in liquids and gases. Warm water or air expands, becomes lighter and rises, while cooler, heavier fluid sinks to take its place. This creates a circulating current. A radiator heats a whole room this way, and a sea breeze blows because air over the warm land rises and cooler air from the sea moves in.',
            'Radiation needs no material at all. Hot objects send out invisible infrared rays that travel even through empty space. That is how the Sun warms the Earth across 150 million kilometres and how you feel the heat of a campfire on your face. Dark surfaces absorb radiation well and get hot in the sun; light surfaces reflect it, so white clothes keep you cooler.'
          ],
          hr: [
            'Vođenje (kondukcija) je prijenos topline kroz tvar s čestice na česticu. Metali odlično vode toplinu: drži metalnu žlicu u vrućoj juhi i drška će se ubrzo ugrijati. Drvo, plastika, staklo i zrak slabo vode toplinu; zato su ručke lonaca od plastike. Metalna žlica čini se hladnijom od drvene iste temperature jer brže odvodi toplinu iz tvoje ruke.',
            'Strujanje (konvekcija) događa se u tekućinama i plinovima. Topla voda ili zrak šire se, postaju lakši i dižu se, a hladnija, teža tekućina ili plin spušta se na njihovo mjesto. Tako nastaje kružno strujanje. Radijator na taj način grije cijelu sobu, a morski povjetarac puše jer se zrak iznad toplog kopna diže, a hladniji zrak s mora dolazi na njegovo mjesto.',
            'Zračenje (radijacija) ne treba nikakvu tvar. Vruća tijela odašilju nevidljive infracrvene zrake koje putuju čak i kroz prazan svemir. Tako Sunce grije Zemlju preko 150 milijuna kilometara i tako na licu osjetiš toplinu logorske vatre. Tamne površine dobro upijaju zračenje i na suncu se jako ugriju; svijetle ga odbijaju, pa ti je u bijeloj odjeći ugodnije na vrućini.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><defs><marker id="ht-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><path d="M40,110 C25,95 35,80 45,70 C50,85 60,85 60,70 C70,85 68,100 55,110 z" fill="var(--c2)"/><rect x="60" y="55" width="130" height="12" rx="4" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="75" y1="40" x2="175" y2="40" stroke="var(--c2)" stroke-width="4" marker-end="url(#ht-ar)"/><rect x="240" y="30" width="110" height="90" rx="6" fill="none" stroke="var(--fg)" stroke-width="2"/><path d="M265,110 C265,70 265,50 290,45 C320,40 325,70 325,110" fill="none" stroke="var(--c2)" stroke-width="3" marker-end="url(#ht-ar)"/><path d="M325,45 C325,85 325,100 300,105 C270,110 265,80 265,45" fill="none" stroke="var(--c1)" stroke-width="3" marker-end="url(#ht-ar)"/><path d="M270,120 C265,110 280,110 275,100" fill="none" stroke="var(--c2)" stroke-width="3"/><path d="M295,125 C290,115 305,115 300,105" fill="none" stroke="var(--c2)" stroke-width="3"/><path d="M320,120 C315,110 330,110 325,100" fill="none" stroke="var(--c2)" stroke-width="3"/><circle cx="385" cy="55" r="16" fill="var(--c5)"/><line x1="385" y1="80" x2="385" y2="118" stroke="var(--c5)" stroke-width="3" marker-end="url(#ht-ar)"/><line x1="362" y1="70" x2="330" y2="25" stroke="var(--c5)" stroke-width="3" marker-end="url(#ht-ar)"/></svg>'
      },
      {
        h: { en: 'Insulators and specific heat capacity', hr: 'Toplinski izolatori i specifični toplinski kapacitet' },
        p: {
          en: [
            'Materials that conduct heat badly are called thermal insulators. Many of the best ones work by trapping air: feathers in a duvet, wool in a sweater, styrofoam in a cool box and the fluffy fur of animals all hold tiny pockets of still air. A thermos flask goes further: it has a vacuum between two walls, so there is nothing for heat to travel through.',
            'Different materials also need different amounts of heat to warm up. Water is the champion: it takes 4200 J to heat 1 kg of water by 1 °C, about ten times more than for 1 kg of iron. This number is the specific heat capacity, c. Because of it, water heats up slowly and cools down slowly, which is why a sea coast has mild winters and cool summers while places far inland get hot summers and freezing winters.',
            'The heat needed to warm something is Q = m · c · ΔT: mass times specific heat capacity times the temperature change. To heat 2 kg of water from 20 °C to 30 °C (ΔT = 10 °C) you need 2 · 4200 · 10 = 84 000 J. The same formula tells how much heat an object gives off when it cools.'
          ],
          hr: [
            'Tvari koje slabo vode toplinu zovemo toplinski izolatori. Mnogi od najboljih izolatora rade tako da zarobe zrak: perje u poplunu, vuna u džemperu, stiropor u prijenosnom hladnjaku i pahuljasto krzno životinja sadrže sitne džepove mirnog zraka. Termosica ide i korak dalje: između njezinih dviju stijenki je vakuum, pa toplina nema kroz što putovati.',
            'Različitim tvarima treba i različita količina topline da se ugriju. Voda je prvakinja: da se 1 kg vode ugrije za 1 °C, treba 4200 J, oko deset puta više nego za 1 kg željeza. Taj broj zove se specifični toplinski kapacitet, c. Zbog njega se voda sporo grije i sporo hladi, pa morska obala ima blage zime i svježa ljeta, dok mjesta duboko u unutrašnjosti imaju vruća ljeta i ledene zime.',
            'Toplina potrebna za zagrijavanje iznosi Q = m · c · ΔT: masa puta specifični toplinski kapacitet puta promjena temperature. Da 2 kg vode ugriješ s 20 °C na 30 °C (ΔT = 10 °C), trebaš 2 · 4200 · 10 = 84 000 J. Ista formula govori koliko topline tijelo preda okolini dok se hladi.'
          ]
        }
      },
      {
        h: { en: 'Thermal expansion', hr: 'Toplinsko rastezanje' },
        p: {
          en: [
            'When a material gets warmer, its particles move faster and push each other a little further apart, so the material expands. When it cools, it shrinks. The change is small but real, and engineers must plan for it. Bridges have expansion gaps, and railway tracks are laid with small spaces or special joints so that the hot summer steel has room to grow instead of buckling.',
            'Thermal expansion is also how a classic thermometer works: the liquid inside the thin tube (coloured alcohol or, in old ones, mercury) expands when warmed and climbs up the scale. Liquids and gases expand more than solids. That is why a tightly closed plastic bottle left in the sun bulges, and why a stuck jar lid loosens after you run hot water over it: the metal lid expands more than the glass.'
          ],
          hr: [
            'Kad se tvar ugrije, čestice se gibaju brže i malo se više razmaknu, pa se tvar širi. Kad se ohladi, skuplja se. Promjena je mala, ali stvarna, i inženjeri je moraju predvidjeti. Mostovi imaju rastezne razmake, a željezničke tračnice polažu se s malim razmacima ili posebnim spojevima da bi se vrući ljetni čelik imao kamo proširiti umjesto da se iskrivi.',
            'Na toplinskom rastezanju radi i klasični termometar: tekućina u tankoj cjevčici (obojeni alkohol ili, u starima, živa) pri zagrijavanju se širi i penje po ljestvici. Tekućine i plinovi šire se više od čvrstih tijela. Zato se čvrsto zatvorena plastična boca ostavljena na suncu nadme i zato se zaglavljeni poklopac staklenke olabavi kad ga poliješ vrućom vodom: metalni poklopac proširi se više od stakla.'
          ]
        }
      },
      {
        h: { en: 'Changes of state', hr: 'Promjene agregacijskog stanja' },
        p: {
          en: [
            'Matter comes in three main states: solid, liquid and gas. Heating ice makes it melt into water at 0 °C; heating water makes it boil into steam at 100 °C. Cooling does the reverse: steam condenses into droplets (that is the mist on a cold window) and water freezes into ice. While ice is melting, its temperature stays at 0 °C: all the added heat goes into breaking the particles loose, not into making them faster.',
            'A liquid does not have to boil to become a gas. Evaporation happens at any temperature from the surface, as the fastest particles escape. Those escaping particles take energy with them, so the liquid left behind cools down. This is why sweating cools you, why a wet dog shivers in the wind, and why you feel cold stepping out of the sea even on a hot day.'
          ],
          hr: [
            'Tvar dolazi u tri glavna agregacijska stanja: čvrsto, tekuće i plinovito. Zagrijavanjem se led tali u vodu pri 0 °C, a voda vrije i prelazi u paru pri 100 °C. Hlađenje čini obrnuto: para se kondenzira u kapljice (to je magla na hladnom prozoru), a voda se ledi u led. Dok se led tali, temperatura mu ostaje 0 °C: sva dovedena toplina troši se na oslobađanje čestica iz čvrstog rasporeda, a ne na njihovo ubrzavanje.',
            'Tekućina ne mora vreti da bi postala plin. Isparavanje se događa pri svakoj temperaturi s površine, jer najbrže čestice pobjegnu. Te čestice sa sobom odnose energiju, pa se preostala tekućina hladi. Zato te znojenje hladi, zato mokar pas drhti na vjetru i zato ti je hladno kad izađeš iz mora čak i za vrućeg dana.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'temperature', hr: 'temperatura' }, def: { en: 'A measure of how fast the particles of an object are moving on average. Unit: °C or K.', hr: 'Mjera za to koliko se brzo čestice tijela u prosjeku gibaju. Jedinica: °C ili K.' } },
      { term: { en: 'thermometer', hr: 'termometar' }, def: { en: 'A device for measuring temperature, often using a liquid that expands when warmed.', hr: 'Sprava za mjerenje temperature, često s tekućinom koja se zagrijavanjem širi.' } },
      { term: { en: 'internal energy', hr: 'unutarnja energija' }, def: { en: 'The total energy of all the moving particles inside an object.', hr: 'Ukupna energija svih čestica koje se gibaju unutar tijela.' } },
      { term: { en: 'heat (Q)', hr: 'toplina (Q)' }, def: { en: 'Energy passing from a hotter object to a colder one. Unit: joule (J).', hr: 'Energija koja prelazi s toplijeg tijela na hladnije. Jedinica: džul (J).' } },
      { term: { en: 'thermal equilibrium', hr: 'toplinska ravnoteža' }, def: { en: 'The state when two touching objects have the same temperature and heat stops flowing.', hr: 'Stanje u kojem dva tijela u dodiru imaju istu temperaturu i toplina više ne prelazi.' } },
      { term: { en: 'conduction', hr: 'vođenje topline (kondukcija)' }, def: { en: 'Heat passing through a material from particle to particle. Metals do it best.', hr: 'Prijenos topline kroz tvar s čestice na česticu. Metali to rade najbolje.' } },
      { term: { en: 'convection', hr: 'strujanje (konvekcija)' }, def: { en: 'Heat carried by warm liquid or gas rising and cooler fluid sinking.', hr: 'Prijenos topline dizanjem tople i spuštanjem hladnije tekućine ili plina.' } },
      { term: { en: 'radiation', hr: 'zračenje' }, def: { en: 'Heat travelling as invisible infrared rays, even through empty space.', hr: 'Prijenos topline nevidljivim infracrvenim zrakama, čak i kroz prazan prostor.' } },
      { term: { en: 'thermal insulator', hr: 'toplinski izolator' }, def: { en: 'A material that conducts heat badly, such as wool, styrofoam or still air.', hr: 'Tvar koja slabo vodi toplinu, na primjer vuna, stiropor ili mirni zrak.' } },
      { term: { en: 'specific heat capacity (c)', hr: 'specifični toplinski kapacitet (c)' }, def: { en: 'The heat needed to warm 1 kg of a material by 1 °C. For water 4200 J/(kg·°C).', hr: 'Toplina potrebna da se 1 kg tvari ugrije za 1 °C. Za vodu 4200 J/(kg·°C).' } },
      { term: { en: 'thermal expansion', hr: 'toplinsko rastezanje' }, def: { en: 'Materials get slightly bigger when heated and smaller when cooled.', hr: 'Tvari se zagrijavanjem malo šire, a hlađenjem skupljaju.' } },
      { term: { en: 'evaporation', hr: 'isparavanje' }, def: { en: 'A liquid turning into gas from its surface at any temperature; it cools the liquid left behind.', hr: 'Prelazak tekućine u plin s površine pri bilo kojoj temperaturi; hladi preostalu tekućinu.' } }
    ],

    formulas: [
      { expr: 'Q = m · c · ΔT', name: { en: 'heat for a temperature change', hr: 'toplina za promjenu temperature' }, note: { en: 'm in kg, c in J/(kg·°C), ΔT in °C; water: c = 4200 J/(kg·°C)', hr: 'm u kg, c u J/(kg·°C), ΔT u °C; voda: c = 4200 J/(kg·°C)' } },
      { expr: 'T(K) = t(°C) + 273', name: { en: 'Celsius to kelvin', hr: 'Celzijevi stupnjevi u kelvine' }, note: { en: '0 K is absolute zero, −273 °C', hr: '0 K je apsolutna nula, −273 °C' } }
    ],

    funFact: {
      en: 'It takes 4200 J to warm 1 kg of water by 1 °C, but only about 450 J for 1 kg of iron and 900 J for 1 kg of aluminium. Water is one of the hardest common substances to heat up, which is why the sea stays cool long into summer and warm long into autumn.',
      hr: 'Da se 1 kg vode ugrije za 1 °C, treba 4200 J, ali za 1 kg željeza samo oko 450 J, a za 1 kg aluminija 900 J. Voda je jedna od tvari koje je najteže ugrijati, zato more ostaje svježe duboko u ljeto, a toplo duboko u jesen.'
    },

    experiment: {
      title: { en: 'Which spoon warms up fastest?', hr: 'Koja se žlica najbrže ugrije?' },
      materials: {
        en: ['a tall mug or glass', 'hot water (as hot as the tap gives, or heated by an adult)', 'a metal spoon', 'a wooden spoon', 'a plastic spoon', 'three equal pea-sized pieces of butter', 'a stopwatch'],
        hr: ['visoka šalica ili čaša', 'vruća voda (najtoplija iz slavine ili zagrijana uz pomoć odrasle osobe)', 'metalna žlica', 'drvena žlica', 'plastična žlica', 'tri jednaka komadića maslaca veličine zrna graška', 'štoperica']
      },
      steps: {
        en: [
          'Stand the three spoons in the empty mug with the handles sticking up to about the same height.',
          'Press a pea-sized piece of butter onto the end of each handle, all at the same height above the mug.',
          'Ask an adult to pour hot water into the mug until the spoon heads are covered. The handles must stay dry.',
          'Start the stopwatch and watch the butter. Write down the time when each piece starts to soften, melt or slide.',
          'Carefully touch the three handles near the top. Which one is warmest? Which is still cool?',
          'Try again with other objects: a steel knife, a chopstick, a glass stirring rod. Rank them from best to worst conductor.'
        ],
        hr: [
          'Stavi tri žlice u praznu šalicu tako da im drške strše prema gore do otprilike iste visine.',
          'Na vrh svake drške pritisni komadić maslaca veličine zrna graška, sve na istoj visini iznad šalice.',
          'Zamoli odraslu osobu da u šalicu nalije vruću vodu dok ne pokrije glave žlica. Drške moraju ostati suhe.',
          'Pokreni štopericu i promatraj maslac. Zapiši vrijeme kad se svaki komadić počne mekšati, taliti ili kliziti.',
          'Oprezno dodirni tri drške blizu vrha. Koja je najtoplija? Koja je još hladna?',
          'Ponovi pokus s drugim predmetima: čeličnim nožem, štapićem za jelo, staklenim štapićem. Poredaj ih od najboljeg do najlošijeg vodiča.'
        ]
      },
      explain: {
        en: 'Metal conducts heat quickly: the energy of the hot water travels up the metal handle particle by particle and melts the butter within a minute or two. Wood and plastic are thermal insulators, so their butter stays solid much longer. This is exactly why pans have plastic or wooden handles and why a metal spoon feels colder than a wooden one.',
        hr: 'Metal brzo vodi toplinu: energija vruće vode putuje uz metalnu dršku s čestice na česticu i otopi maslac za minutu ili dvije. Drvo i plastika su toplinski izolatori, pa njihov maslac ostaje čvrst mnogo dulje. Upravo zato tave imaju plastične ili drvene ručke i zato se metalna žlica čini hladnijom od drvene.'
      },
      safety: { en: 'Hot water can scald. Let an adult pour it, do not use boiling water, and keep the mug away from the edge of the table.', hr: 'Vruća voda može opeći. Neka je nalije odrasla osoba, ne koristi kipuću vodu i drži šalicu dalje od ruba stola.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What does a thermometer measure?', hr: 'Što mjeri termometar?' },
        options: [{ en: 'heat', hr: 'toplinu' }, { en: 'temperature', hr: 'temperaturu' }, { en: 'internal energy', hr: 'unutarnju energiju' }, { en: 'mass', hr: 'masu' }], answer: 1,
        explain: { en: 'A thermometer measures temperature, how fast the particles move on average. Heat is energy being transferred and is measured in joules.', hr: 'Termometar mjeri temperaturu, to jest koliko se brzo čestice u prosjeku gibaju. Toplina je energija u prijelazu i mjeri se u džulima.' } },
      { type: 'mc', q: { en: 'Heat flows by itself…', hr: 'Toplina sama od sebe prelazi…' },
        options: [{ en: 'from a hotter object to a colder one', hr: 's toplijeg tijela na hladnije' }, { en: 'from a colder object to a hotter one', hr: 's hladnijeg tijela na toplije' }, { en: 'from a bigger object to a smaller one', hr: 's većeg tijela na manje' }, { en: 'only through metals', hr: 'samo kroz metale' }], answer: 0,
        explain: { en: 'Heat always flows from the hotter object to the colder one until both reach the same temperature (thermal equilibrium).', hr: 'Toplina uvijek prelazi s toplijeg tijela na hladnije dok oba ne postignu istu temperaturu (toplinsku ravnotežu).' } },
      { type: 'tf', q: { en: 'Heat and temperature are two words for the same thing.', hr: 'Toplina i temperatura dvije su riječi za istu stvar.' }, answer: false,
        explain: { en: 'Temperature tells how hot something is (°C). Heat is the energy that moves from a hotter to a colder object (J). A bathtub of warm water holds more energy than a cup of boiling tea.', hr: 'Temperatura govori koliko je nešto vruće (°C). Toplina je energija koja prelazi s toplijeg na hladnije tijelo (J). Kada tople vode sadrži više energije nego šalica kipućeg čaja.' } },
      { type: 'mc', q: { en: 'A metal spoon and a wooden spoon lie in the same drawer. The metal one feels colder because…', hr: 'Metalna i drvena žlica leže u istoj ladici. Metalna se čini hladnijom zato što…' },
        options: [{ en: 'it really has a lower temperature', hr: 'stvarno ima nižu temperaturu' }, { en: 'metal contains cold', hr: 'metal sadrži hladnoću' }, { en: 'wood is warmer than air', hr: 'drvo je toplije od zraka' }, { en: 'metal conducts heat away from your hand faster', hr: 'metal brže odvodi toplinu iz tvoje ruke' }], answer: 3,
        explain: { en: 'Both spoons have the same temperature. Metal is a good conductor, so it carries heat away from your warm hand quickly, and that feels cold.', hr: 'Obje žlice imaju istu temperaturu. Metal je dobar vodič, pa brzo odvodi toplinu iz tvoje tople ruke, a to osjećamo kao hladnoću.' } },
      { type: 'mc', q: { en: 'A radiator warms the whole room mainly by…', hr: 'Radijator grije cijelu sobu uglavnom…' },
        options: [{ en: 'conduction through the floor', hr: 'vođenjem kroz pod' }, { en: 'melting the air', hr: 'taljenjem zraka' }, { en: 'convection: warm air rises and circulates', hr: 'strujanjem: topli zrak se diže i kruži' }, { en: 'sound waves', hr: 'zvučnim valovima' }], answer: 2,
        explain: { en: 'Air warmed by the radiator expands, rises and is replaced by cooler air. This circulation (convection) spreads the warmth around the room.', hr: 'Zrak zagrijan uz radijator širi se, diže i zamjenjuje ga hladniji zrak. To kružno strujanje (konvekcija) raznosi toplinu po sobi.' } },
      { type: 'tf', q: { en: 'A dark T-shirt absorbs more of the Sun’s radiation than a white one.', hr: 'Tamna majica upija više Sunčeva zračenja nego bijela.' }, answer: true,
        explain: { en: 'Dark surfaces absorb radiation well and get hot in the sun; light surfaces reflect most of it. That is why white clothes are cooler in summer.', hr: 'Tamne površine dobro upijaju zračenje i na suncu se ugriju; svijetle ga većinom odbijaju. Zato je bijela odjeća ljeti ugodnija.' } },
      { type: 'num', q: { en: 'How much heat is needed to warm 2 kg of water by 10 °C? Use c = 4200 J/(kg·°C).', hr: 'Koliko je topline potrebno da se 2 kg vode ugrije za 10 °C? Uzmi c = 4200 J/(kg·°C).' },
        answer: 84000, tolerance: 100, unit: 'J',
        explain: { en: 'Q = m · c · ΔT = 2 kg · 4200 J/(kg·°C) · 10 °C = 84 000 J.', hr: 'Q = m · c · ΔT = 2 kg · 4200 J/(kg·°C) · 10 °C = 84 000 J.' } },
      { type: 'mc', q: { en: 'Why are small gaps left between sections of a long bridge?', hr: 'Zašto se između dijelova dugog mosta ostavljaju mali razmaci?' },
        options: [{ en: 'to let rain drain away', hr: 'da kiša može otjecati' }, { en: 'because the metal expands in summer heat', hr: 'jer se metal širi na ljetnoj vrućini' }, { en: 'to make the bridge lighter', hr: 'da most bude lakši' }, { en: 'to reduce the noise of traffic', hr: 'da se smanji buka prometa' }], answer: 1,
        explain: { en: 'Materials expand when heated. The gaps give the hot summer steel and concrete room to grow, so the bridge does not buckle.', hr: 'Tvari se zagrijavanjem šire. Razmaci daju vrućem ljetnom čeliku i betonu prostora za širenje, pa se most ne iskrivi.' } },
      { type: 'mc', q: { en: 'Why does sweating cool you down?', hr: 'Zašto te znojenje hladi?' },
        options: [{ en: 'evaporating sweat takes energy from the skin', hr: 'znoj koji isparava uzima energiju s kože' }, { en: 'sweat is colder than the body', hr: 'znoj je hladniji od tijela' }, { en: 'sweat reflects sunlight', hr: 'znoj odbija sunčevu svjetlost' }, { en: 'sweat blocks warm air', hr: 'znoj zaustavlja topli zrak' }], answer: 0,
        explain: { en: 'When sweat evaporates, the fastest particles leave and carry energy away, so the skin left behind gets cooler. The same happens to a wet dog in the wind.', hr: 'Kad znoj isparava, najbrže čestice odlaze i odnose energiju, pa se koža hladi. Isto se događa mokrom psu na vjetru.' } },
      { type: 'num', q: { en: 'A room is at 25 °C. What is that in kelvins? Use T(K) = t(°C) + 273.', hr: 'U sobi je 25 °C. Koliko je to u kelvinima? Uzmi T(K) = t(°C) + 273.' },
        answer: 298, tolerance: 0.5, unit: 'K',
        explain: { en: 'T = 25 + 273 = 298 K. The kelvin scale starts at absolute zero, −273 °C.', hr: 'T = 25 + 273 = 298 K. Kelvinova ljestvica počinje na apsolutnoj nuli, −273 °C.' } },
      { type: 'mc', q: { en: 'Why does the Croatian coast have milder winters than inland Slavonia?', hr: 'Zašto hrvatska obala ima blaže zime nego unutrašnjost Slavonije?' },
        options: [{ en: 'the sea is closer to the Sun', hr: 'more je bliže Suncu' }, { en: 'salt keeps the air warm', hr: 'sol održava zrak toplim' }, { en: 'water has a high specific heat capacity and cools slowly', hr: 'voda ima velik specifični toplinski kapacitet i sporo se hladi' }, { en: 'the coast has fewer clouds', hr: 'obala ima manje oblaka' }], answer: 2,
        explain: { en: 'Water needs a lot of heat to change its temperature, so the sea stores summer warmth and releases it slowly during winter, keeping the coast mild.', hr: 'Vodi treba mnogo topline da promijeni temperaturu, pa more pohranjuje ljetnu toplinu i polako je otpušta zimi, održavajući obalu blagom.' } }
    ]
  });
})();
