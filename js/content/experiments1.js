/* FizLab home experiments, part 1: matter, density, motion, forces, gravity, pressure, levers, energy.
   Format and safety rules: js/content/_experiments_schema.md */
(function () {
  'use strict';
  window.Content.registerExperiments([

    // ───────────────────────────── MATTER ─────────────────────────────
    {
      id: 'lung-volume-bottle',
      topic: 'matter',
      type: 'apply',
      level: 2,
      minutes: 20,
      outcome: 'A.7.1',
      title: { en: 'How much air fits in your lungs?', hr: 'Koliko zraka stane u tvoja pluća?' },
      question: {
        en: 'Air is invisible. Can you still measure the volume of the air you breathe out in one breath?',
        hr: 'Zrak je nevidljiv. Možeš li ipak izmjeriti obujam zraka koji izdahneš u jednom dahu?'
      },
      materials: {
        en: ['a 5 L plastic water bottle with a cap (or the biggest bottle you have)', 'a large basin or a sink', 'a bendy straw or about 50 cm of clean flexible tube', 'a kitchen measuring jug', 'a waterproof marker', 'water'],
        hr: ['plastična boca za vodu od 5 L s čepom (ili najveća koju imaš)', 'veliki lavor ili sudoper', 'savitljiva slamka ili oko 50 cm čiste savitljive cijevi', 'kuhinjska mjerica', 'vodootporni flomaster', 'voda']
      },
      steps: {
        en: [
          'Make a scale on the bottle: pour in water with the measuring jug, half a litre at a time, and mark every level with the marker (0.5 L, 1 L, 1.5 L and so on).',
          'Fill the bottle to the very top and screw the cap on. Fill the basin with water about 10 cm deep.',
          'Turn the bottle upside down, lower its neck under the water in the basin and only then unscrew the cap. The water stays in the bottle. Hold the bottle upright or ask someone to hold it.',
          'Push the short end of the bendy straw up into the neck of the bottle, under the water.',
          'Take a deep breath and blow it all out through the straw in one long breath. The bubbles collect at the top of the bottle and push water out.',
          'Read on your scale how much air is now in the bottle. Refill the bottle and repeat twice more; then try one calm, ordinary breath out.'
        ],
        hr: [
          'Napravi ljestvicu na boci: mjericom ulijevaj vodu po pola litre i svaku razinu označi flomasterom (0,5 L, 1 L, 1,5 L i tako dalje).',
          'Napuni bocu do samog vrha i zatvori je čepom. U lavor ulij vodu do visine od oko 10 cm.',
          'Okreni bocu naopako, uroni joj grlo pod vodu u lavoru i tek tada odvrni čep. Voda ostaje u boci. Drži bocu uspravno ili zamoli nekoga da je pridrži.',
          'Kraći kraj savitljive slamke uguraj pod vodom u grlo boce.',
          'Duboko udahni i kroz slamku jednim dugim izdahom ispuhni sav zrak. Mjehurići se skupljaju na vrhu boce i istiskuju vodu.',
          'Na ljestvici očitaj koliko je zraka sada u boci. Ponovno napuni bocu i ponovi još dvaput; zatim pokušaj s jednim mirnim, običnim izdahom.'
        ]
      },
      predict: {
        q: { en: 'How much air can you blow out after one deep breath?', hr: 'Koliko zraka možeš ispuhnuti nakon jednog dubokog udaha?' },
        options: [
          { en: 'About one glass (0.2 L)', hr: 'Oko jedne čaše (0,2 L)' },
          { en: 'About 2 to 3 litres', hr: 'Oko 2 do 3 litre' },
          { en: 'More than 10 litres', hr: 'Više od 10 litara' }
        ],
        answer: 1
      },
      observe: {
        en: 'The air you blow in collects at the top of the bottle and pushes the same volume of water out into the basin. After a deep breath most pupils your age reach 2 to 3.5 litres; a calm breath is only about half a litre.',
        hr: 'Zrak koji upuhneš skuplja se na vrhu boce i istiskuje jednak obujam vode u lavor. Nakon dubokog udaha većina učenika tvoje dobi dosegne 2 do 3,5 litre; miran izdah ima tek oko pola litre.'
      },
      explain: {
        en: 'Air is matter: it takes up space, so it pushes the water out of the bottle, and the volume of water that leaves equals the volume of air that came in. It is the same displacement method you use for a stone, only upside down. Your lungs never empty completely: about one litre of air always stays inside, so their real volume is even larger than the number you measured.',
        hr: 'Zrak je tvar: zauzima prostor, pa istiskuje vodu iz boce, a obujam vode koja izađe jednak je obujmu zraka koji je ušao. To je ista metoda istiskivanja kojom mjeriš obujam kamena, samo okrenuta naopako. Pluća se nikad ne isprazne do kraja: u njima uvijek ostane oko litra zraka, pa je njihov stvarni obujam još veći od izmjerenog broja.'
      },
      safety: {
        en: 'Use your own clean straw and do not share it. Stop and rest if you feel dizzy from blowing hard.',
        hr: 'Koristi svoju čistu slamku i ne dijeli je s drugima. Stani i odmori se ako ti se od snažnog puhanja zavrti u glavi.'
      },
      sim: 'measure'
    },

    {
      id: 'paper-thickness-stack',
      topic: 'matter',
      type: 'test',
      level: 2,
      minutes: 15,
      outcome: 'A.7.1',
      title: { en: 'How thick is one sheet of paper?', hr: 'Koliko je debeo jedan list papira?' },
      question: {
        en: 'Your ruler shows only millimetres. Can you still measure something much thinner than one millimetre?',
        hr: 'Tvoje ravnalo pokazuje samo milimetre. Možeš li ipak izmjeriti nešto mnogo tanje od jednog milimetra?'
      },
      materials: {
        en: ['a thick book with at least 400 pages', 'a ruler with a millimetre scale', 'a calculator', 'paper and a pencil'],
        hr: ['debela knjiga s najmanje 400 stranica', 'ravnalo s milimetarskom ljestvicom', 'kalkulator', 'papir i olovka']
      },
      steps: {
        en: [
          'Take exactly 100 sheets of the book between your fingers, without the covers. Careful: one sheet has two pages, so 100 sheets are 200 page numbers, for example from page 1 to page 200.',
          'Press the 100 sheets firmly together and measure the thickness of the bundle in millimetres. Write it down.',
          'Divide the thickness by 100. That is the thickness of one sheet.',
          'Repeat with 50 sheets and with 200 sheets, pressing just as hard each time.',
          'Compare the three results for one sheet and work out their mean.',
          'Finally try to measure a single sheet directly with the ruler. Why does that not work?'
        ],
        hr: [
          'Uhvati prstima točno 100 listova knjige, bez korica. Pazi: jedan list ima dvije stranice, pa je 100 listova 200 brojeva stranica, na primjer od 1. do 200. stranice.',
          'Čvrsto stisni tih 100 listova i izmjeri debljinu snopa u milimetrima. Zapiši je.',
          'Podijeli debljinu sa 100. To je debljina jednog lista.',
          'Ponovi s 50 listova i s 200 listova, svaki put jednako čvrsto stišćući.',
          'Usporedi tri rezultata za jedan list i izračunaj njihovu srednju vrijednost.',
          'Na kraju pokušaj ravnalom izravno izmjeriti jedan jedini list. Zašto to ne uspijeva?'
        ]
      },
      predict: {
        q: { en: 'How thick do you think one sheet of the book is?', hr: 'Što misliš, koliko je debeo jedan list knjige?' },
        options: [
          { en: 'About 1 mm', hr: 'Oko 1 mm' },
          { en: 'About 0.5 mm', hr: 'Oko 0,5 mm' },
          { en: 'About 0.1 mm', hr: 'Oko 0,1 mm' }
        ],
        answer: 2
      },
      observe: {
        en: 'A bundle of 100 sheets is usually 8 to 12 mm thick, so one sheet is about 0.1 mm. The three bundles give nearly the same result, and the bundle of 200 sheets gives the most reliable one.',
        hr: 'Snop od 100 listova obično je debeo 8 do 12 mm, pa je jedan list debeo oko 0,1 mm. Sva tri snopa daju gotovo isti rezultat, a najpouzdaniji je onaj od 200 listova.'
      },
      explain: {
        en: 'The smallest division of the ruler is 1 mm, so every reading can be wrong by about half a millimetre. For one sheet that error is five times larger than the sheet itself. When you measure 100 sheets together, the same half millimetre is shared among all of them, so each sheet carries an error of only 0.005 mm. Measuring many equal things at once and dividing is a trick physicists also use for the mass of a grain of rice or the time of one swing of a pendulum.',
        hr: 'Najmanji podjeljak ravnala je 1 mm, pa svako očitanje može biti pogrešno za oko pola milimetra. Za jedan list ta je pogreška pet puta veća od samog lista. Kad mjeriš 100 listova zajedno, istih se pola milimetra podijeli na sve njih, pa na svaki list otpada pogreška od samo 0,005 mm. Mjerenje mnogo jednakih stvari odjednom i dijeljenje trik je kojim se fizičari služe i za masu zrna riže ili trajanje jednog titraja njihala.'
      },
      measure: {
        en: 'Change: the number of sheets (50, 100, 200). Measure: the thickness of the bundle in millimetres. Keep the same: the book, the ruler and how hard you press. Make a table with the number of sheets, the thickness of the bundle and the thickness of one sheet, and work out the mean of the three results.',
        hr: 'Mijenjaš: broj listova (50, 100, 200). Mjeriš: debljinu snopa u milimetrima. Ne mijenjaš: knjigu, ravnalo ni snagu kojom stišćeš. Napravi tablicu s brojem listova, debljinom snopa i debljinom jednog lista te izračunaj srednju vrijednost triju rezultata.'
      },
      sim: 'measure'
    },

    {
      id: 'dry-tissue-glass',
      topic: 'matter',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'A.7.7',
      title: { en: 'The tissue that stays dry under water', hr: 'Maramica koja ostaje suha pod vodom' },
      question: {
        en: 'Is an empty glass really empty, or is there something inside it?',
        hr: 'Je li prazna čaša doista prazna ili je u njoj ipak nešto?'
      },
      materials: {
        en: ['a clear drinking glass', 'a paper tissue', 'a large bowl or a sink, deeper than the glass', 'water', 'a small piece of sticky tape'],
        hr: ['prozirna čaša', 'papirnata maramica', 'velika zdjela ili sudoper, dublji od čaše', 'voda', 'komadić selotejpa']
      },
      steps: {
        en: [
          'Crumple the tissue and press it firmly into the bottom of the glass. Turn the glass upside down: the tissue must not fall out. If it does, fix it with the tape.',
          'Fill the bowl with water so that it is deeper than the glass is tall.',
          'Hold the glass upside down and perfectly straight, and push it straight down until it is completely under water. Count to ten.',
          'Look through the side of the glass: how far has the water come in?',
          'Lift the glass straight up, dry your hand and take out the tissue. Is it wet?',
          'Repeat, but this time tilt the glass a little while it is under water. Watch what comes out and what goes in.'
        ],
        hr: [
          'Zgužvaj maramicu i čvrsto je utisni na dno čaše. Okreni čašu naopako: maramica ne smije ispasti. Ako ispada, pričvrsti je selotejpom.',
          'Napuni zdjelu vodom tako da voda bude dublja nego što je čaša visoka.',
          'Drži čašu naopako i sasvim ravno te je gurni ravno dolje dok ne bude cijela pod vodom. Broji do deset.',
          'Pogledaj kroz stijenku čaše: dokle je voda ušla?',
          'Izvadi čašu ravno prema gore, obriši ruku i izvadi maramicu. Je li mokra?',
          'Ponovi, ali ovaj put čašu pod vodom malo nagni. Promatraj što izlazi, a što ulazi.'
        ]
      },
      predict: {
        q: { en: 'What will the tissue be like when you lift the glass out of the water?', hr: 'Kakva će biti maramica kad izvadiš čašu iz vode?' },
        options: [
          { en: 'Dry, although it was under water', hr: 'Suha, iako je bila pod vodom' },
          { en: 'Soaked, because water fills the glass', hr: 'Potpuno mokra, jer voda napuni čašu' },
          { en: 'Wet only at its lower edge', hr: 'Mokra samo na donjem rubu' }
        ],
        answer: 0
      },
      observe: {
        en: 'The water hardly enters the glass at all, and the tissue stays dry. When you tilt the glass, large air bubbles escape, water rushes in and the tissue gets wet.',
        hr: 'Voda gotovo uopće ne ulazi u čašu i maramica ostaje suha. Kad čašu nagneš, iz nje izlaze veliki mjehuri zraka, voda navre unutra i maramica se smoči.'
      },
      explain: {
        en: 'The glass was not empty: it was full of air. Air is matter and takes up space, so the water cannot get in while the air is trapped inside. The water rises by only a millimetre or so, because its pressure squeezes the air into a slightly smaller volume; gases can be compressed. Only when the air leaves as bubbles can water take its place. A diving bell keeps divers dry in the same way.',
        hr: 'Čaša nije bila prazna: bila je puna zraka. Zrak je tvar i zauzima prostor, pa voda ne može ući dok je zrak zarobljen u čaši. Voda se podigne tek za otprilike jedan milimetar jer njezin tlak stisne zrak na malo manji obujam; plinovi se mogu stlačiti. Tek kad zrak izađe u obliku mjehura, voda može zauzeti njegovo mjesto. Na isti način ronilačko zvono čuva ronioce suhima.'
      },
      sim: 'gas'
    },

    {
      id: 'sugar-dissolve-mass',
      topic: 'matter',
      type: 'observe',
      level: 2,
      minutes: 20,
      outcome: 'A.7.7',
      title: { en: 'Where does the sugar go?', hr: 'Kamo nestane šećer?' },
      question: {
        en: 'When sugar dissolves in water you cannot see it any more. Is it still there, and what happens to the mass and to the volume?',
        hr: 'Kad se šećer otopi u vodi, više ga ne vidiš. Je li još uvijek ondje i što se događa s masom, a što s obujmom?'
      },
      materials: {
        en: ['a kitchen scale', 'a kitchen measuring jug', 'a large glass', 'a small dry cup', 'sugar (about 100 g)', 'warm tap water', 'a spoon'],
        hr: ['kuhinjska vaga', 'kuhinjska mjerica', 'velika čaša', 'mala suha šalica', 'šećer (oko 100 g)', 'topla voda iz slavine', 'žlica']
      },
      steps: {
        en: [
          'Fill the dry measuring jug with sugar up to the 100 mL mark and tip the sugar into the small cup.',
          'Measure 200 mL of warm tap water with the jug and pour it into the glass.',
          'Put the glass of water, the cup of sugar and the spoon on the scale together. Write down the total mass.',
          'Tip the sugar into the water and stir until you cannot see a single grain. This takes two or three minutes.',
          'Put everything back on the scale: the glass, the empty cup and the spoon. Compare with the first mass.',
          'Pour the sugar water into the measuring jug and read its volume. Is it 300 mL, as 200 mL plus 100 mL would suggest?'
        ],
        hr: [
          'Suhu mjericu napuni šećerom do oznake 100 mL pa šećer istresi u malu šalicu.',
          'Mjericom odmjeri 200 mL tople vode iz slavine i ulij je u čašu.',
          'Stavi čašu s vodom, šalicu sa šećerom i žlicu zajedno na vagu. Zapiši ukupnu masu.',
          'Istresi šećer u vodu i miješaj dok više ne vidiš nijedno zrnce. To traje dvije do tri minute.',
          'Vrati sve na vagu: čašu, praznu šalicu i žlicu. Usporedi s prvom masom.',
          'Prelij zašećerenu vodu u mjericu i očitaj obujam. Je li 300 mL, kako bi se očekivalo od 200 mL i 100 mL?'
        ]
      },
      predict: {
        q: { en: 'The sugar has dissolved and you cannot see it. What does the scale show now?', hr: 'Šećer se otopio i više ga ne vidiš. Što sada pokazuje vaga?' },
        options: [
          { en: 'Less than before: dissolved sugar no longer has mass', hr: 'Manje nego prije: otopljeni šećer više nema masu' },
          { en: 'The same as before', hr: 'Isto kao i prije' },
          { en: 'More than before: sweet water is heavier', hr: 'Više nego prije: slatka je voda teža' }
        ],
        answer: 1
      },
      observe: {
        en: 'The scale shows the same mass as before, to within a gram or two. The volume, however, is not 300 mL but only about 250 to 260 mL: clearly less than the water and the sugar measured separately.',
        hr: 'Vaga pokazuje istu masu kao i prije, uz razliku od najviše gram ili dva. Obujam, međutim, nije 300 mL, nego tek oko 250 do 260 mL: jasno manje nego voda i šećer mjereni odvojeno.'
      },
      explain: {
        en: 'Dissolving does not destroy matter. The sugar crystals break up into particles far too small to see, which spread among the particles of water, but every one of them is still there. That is why the mass stays the same and the water tastes sweet. The volume is smaller because the heap of sugar was not solid sugar: almost half of it was air between the grains, and that air escaped. Masses always add up; volumes do not have to.',
        hr: 'Otapanjem tvar ne nestaje. Kristali šećera raspadnu se na čestice premalene da bismo ih vidjeli, koje se rasporede među čestice vode, ali svaka je od njih još uvijek ondje. Zato masa ostaje ista, a voda je slatka. Obujam je manji jer hrpa šećera nije bila sam šećer: gotovo polovicu činio je zrak među zrncima, a taj je zrak izašao. Mase se uvijek zbrajaju, a obujmi ne moraju.'
      },
      sim: 'states'
    },

    // ───────────────────────────── DENSITY ─────────────────────────────
    {
      id: 'egg-salt-float',
      topic: 'density',
      type: 'test',
      level: 2,
      minutes: 25,
      outcome: 'A.7.1',
      title: { en: 'How much salt makes an egg float?', hr: 'Koliko soli treba da jaje zapluta?' },
      question: {
        en: 'A fresh egg sinks in tap water. How much salt must you dissolve in the water before the egg floats?',
        hr: 'Svježe jaje u vodi iz slavine potone. Koliko soli moraš otopiti u vodi da jaje zapluta?'
      },
      materials: {
        en: ['a fresh raw egg', 'a tall clear glass or jar (at least 0.5 L)', 'a kitchen measuring jug', 'table salt (about 150 g)', 'a teaspoon and a ruler to level it', 'a tablespoon for lifting the egg', 'paper and a pencil'],
        hr: ['svježe sirovo jaje', 'visoka prozirna čaša ili staklenka (najmanje 0,5 L)', 'kuhinjska mjerica', 'kuhinjska sol (oko 150 g)', 'čajna žličica i ravnalo za poravnavanje', 'jušna žlica za vađenje jajeta', 'papir i olovka']
      },
      steps: {
        en: [
          'Pour exactly 300 mL of lukewarm tap water into the glass and lower the egg in gently with the tablespoon. It sinks to the bottom.',
          'Lift the egg out. Add one level teaspoon of salt (scrape off the heap with the ruler), stir until it has dissolved and put the egg back.',
          'Keep adding salt, one level teaspoon at a time, taking the egg out before each stir. Count the spoons.',
          'Stop when the egg lifts off the bottom and floats. Write down the number of spoons.',
          'Pour the salty water away and start again with 300 mL of fresh water and the same egg. Do the whole run three times.',
          'At the end, while the egg floats, pour fresh water slowly over a spoon onto the salty water, without stirring. Where does the egg stay now?'
        ],
        hr: [
          'Ulij u čašu točno 300 mL mlake vode iz slavine i jušnom žlicom polako spusti jaje. Ono potone na dno.',
          'Izvadi jaje. Dodaj jednu ravnu žličicu soli (višak skini ravnalom), miješaj dok se ne otopi i vrati jaje.',
          'Nastavi dodavati sol, po jednu ravnu žličicu, a jaje izvadi prije svakog miješanja. Broji žličice.',
          'Stani kad se jaje odvoji od dna i zapluta. Zapiši broj žličica.',
          'Izlij slanu vodu i počni iznova s 300 mL svježe vode i istim jajetom. Cijeli postupak ponovi tri puta.',
          'Na kraju, dok jaje pluta, polako preko žlice dolij svježe vode na slanu, bez miješanja. Gdje jaje sada stoji?'
        ]
      },
      predict: {
        q: { en: 'How many level teaspoons of salt will 300 mL of water need before the egg floats?', hr: 'Koliko će ravnih žličica soli trebati u 300 mL vode da jaje zapluta?' },
        options: [
          { en: 'One or two are enough', hr: 'Dovoljna je jedna ili dvije' },
          { en: 'About four to eight', hr: 'Otprilike četiri do osam' },
          { en: 'The egg never floats, however much salt you add', hr: 'Jaje nikad neće zaplutati, koliko god soli dodao' }
        ],
        answer: 1
      },
      observe: {
        en: 'After the first few spoons nothing seems to happen. Then, usually between the fourth and the eighth spoon, the egg lifts off the bottom and floats with a small patch above the surface. The three runs agree to within one spoon. Under the layer of fresh water the egg hovers in the middle of the glass.',
        hr: 'Nakon prvih nekoliko žličica čini se da se ništa ne događa. Zatim se, obično između četvrte i osme žličice, jaje odvoji od dna i zapluta tako da mu mali dio viri iznad površine. Tri se pokušaja slažu unutar jedne žličice. Ispod sloja svježe vode jaje lebdi u sredini čaše.'
      },
      explain: {
        en: 'The egg does not change: its mass and volume stay the same. What changes is the water. Dissolved salt adds a lot of mass and only a little volume, so the density of the water grows. A fresh egg has a density of about 1.03 to 1.09 g/cm³. As soon as the salty water is denser than the egg, the buoyant force is larger than the weight of the egg and the egg rises. Floating is decided by comparing densities, not by how heavy a thing is. An older egg has a bigger air pocket and needs less salt.',
        hr: 'Jaje se ne mijenja: masa i obujam ostaju mu isti. Mijenja se voda. Otopljena sol dodaje mnogo mase, a tek malo obujma, pa gustoća vode raste. Svježe jaje ima gustoću od oko 1,03 do 1,09 g/cm³. Čim slana voda postane gušća od jajeta, uzgon je veći od težine jajeta i ono se podiže. O plutanju odlučuje usporedba gustoća, a ne to koliko je nešto teško. Starije jaje ima veću zračnu komoricu i treba mu manje soli.'
      },
      measure: {
        en: 'Change: the amount of salt. Measure: the number of level teaspoons at which the egg first floats. Keep the same: 300 mL of water, the same egg, the same spoon levelled each time. Write down the three numbers and work out their mean. With a kitchen scale you can weigh one level teaspoon of salt and calculate the grams of salt per litre.',
        hr: 'Mijenjaš: količinu soli. Mjeriš: broj ravnih žličica pri kojem jaje prvi put zapluta. Ne mijenjaš: 300 mL vode, isto jaje, istu žličicu svaki put poravnatu. Zapiši tri broja i izračunaj srednju vrijednost. Kuhinjskom vagom možeš izvagati jednu ravnu žličicu soli i izračunati koliko je grama soli po litri.'
      },
      safety: {
        en: 'Wash your hands after touching the raw egg and do not drink the water from the experiment.',
        hr: 'Operi ruke nakon dodirivanja sirovog jajeta i ne pij vodu iz pokusa.'
      },
      sim: 'density'
    },

    {
      id: 'straw-hydrometer',
      topic: 'density',
      type: 'project',
      level: 3,
      minutes: 40,
      outcome: 'A.7.1',
      title: { en: 'Build a hydrometer from a straw', hr: 'Napravi areometar od slamke' },
      question: {
        en: 'Can a floating straw tell you which of two liquids is denser, without a scale and without tasting?',
        hr: 'Može li slamka koja pluta pokazati koja je od dviju tekućina gušća, bez vage i bez kušanja?'
      },
      materials: {
        en: ['a plastic drinking straw', 'plasticine', 'scissors', 'a waterproof marker', 'two tall glasses or jars', 'table salt and a tablespoon', 'water'],
        hr: ['plastična slamka', 'plastelin', 'škare', 'vodootporni flomaster', 'dvije visoke čaše ili staklenke', 'kuhinjska sol i jušna žlica', 'voda']
      },
      steps: {
        en: [
          'Cut a straight piece of straw about 12 cm long. Close one end with a ball of plasticine the size of a hazelnut, pushing the straw into it so that no water can get in.',
          'Fill a tall glass with tap water and stand the straw in it, plasticine down. It should float upright with about a third of its length above the water. If it tips over, add a little plasticine; if it sinks, take some off.',
          'When it floats steadily, mark the water line on the straw with the marker. This is the mark for water, 1.0 g/cm³.',
          'In the second glass dissolve 3 level tablespoons of salt in about 250 mL of water. Float the straw in it and mark the new water line.',
          'Compare the two marks. In which liquid does more of the straw stick out?',
          'Mix half a glass of tap water with half a glass of your salty water. Predict where the water line will be, then check.',
          'Test your instrument: ask someone to give you two glasses, one with tap water and one with salty water, without telling you which is which. Find the salty one with your hydrometer.'
        ],
        hr: [
          'Odreži ravan komad slamke dug oko 12 cm. Jedan kraj zatvori kuglicom plastelina veličine lješnjaka, tako da slamku utisneš u nju i voda ne može ući.',
          'Napuni visoku čašu vodom iz slavine i stavi slamku u nju, plastelinom prema dolje. Treba plutati uspravno, s otprilike trećinom duljine iznad vode. Ako se prevrće, dodaj malo plastelina; ako potone, malo ga skini.',
          'Kad mirno pluta, flomasterom označi na slamci razinu vode. To je oznaka za vodu, 1,0 g/cm³.',
          'U drugoj čaši otopi 3 ravne jušne žlice soli u oko 250 mL vode. Stavi slamku da pluta i označi novu razinu.',
          'Usporedi dvije oznake. U kojoj tekućini viri veći dio slamke?',
          'Pomiješaj pola čaše vode iz slavine i pola čaše svoje slane vode. Predvidi gdje će biti razina, pa provjeri.',
          'Ispitaj svoj instrument: zamoli nekoga da ti da dvije čaše, jednu s vodom iz slavine i jednu sa slanom vodom, a da ti ne kaže koja je koja. Pronađi slanu svojim areometrom.'
        ]
      },
      predict: {
        q: { en: 'How will the straw float in salty water compared with tap water?', hr: 'Kako će slamka plutati u slanoj vodi u usporedbi s vodom iz slavine?' },
        options: [
          { en: 'Deeper: salty water is heavier and pulls it down', hr: 'Dublje: slana je voda teža i vuče je dolje' },
          { en: 'At exactly the same depth', hr: 'Na potpuno istoj dubini' },
          { en: 'Higher: more of the straw sticks out', hr: 'Više: veći dio slamke viri van' }
        ],
        answer: 2
      },
      observe: {
        en: 'In salty water the straw floats one to two centimetres higher than in tap water, so the mark for salty water is lower down on the straw. In the half-and-half mixture the water line lies between the two marks.',
        hr: 'U slanoj vodi slamka pluta jedan do dva centimetra više nego u vodi iz slavine, pa je oznaka za slanu vodu niže na slamci. U mješavini pola-pola razina je između tih dviju oznaka.'
      },
      explain: {
        en: 'A floating body sinks in until the liquid it pushes aside weighs exactly as much as the body itself. The weight of the straw never changes. Salty water is denser, so a smaller volume of it already weighs as much as the straw, and the straw does not have to sink as far. That is why a hydrometer floats higher in a denser liquid, although many people expect the opposite. Wine makers and dairies use glass hydrometers in the same way to check grape juice and milk.',
        hr: 'Tijelo koje pluta uranja dok tekućina koju istisne ne bude teška točno koliko i samo tijelo. Težina slamke se ne mijenja. Slana je voda gušća, pa već manji obujam te vode teži koliko i slamka i slamka ne mora uroniti toliko duboko. Zato areometar u gušćoj tekućini pluta više, iako mnogi očekuju suprotno. Vinari i mljekare na isti način staklenim areometrima provjeravaju mošt i mlijeko.'
      },
      sim: 'density'
    },

    {
      id: 'straw-diver-bottle',
      topic: 'density',
      type: 'observe',
      level: 2,
      minutes: 20,
      outcome: 'B.7.5',
      title: { en: 'The obedient diver', hr: 'Poslušni ronilac' },
      question: {
        en: 'Can you make a little diver sink and rise inside a closed bottle without touching it?',
        hr: 'Možeš li natjerati malog ronioca da tone i izranja u zatvorenoj boci, a da ga i ne dotakneš?'
      },
      materials: {
        en: ['a clear 1.5 L plastic bottle with a cap', 'a plastic drinking straw', 'four or five paper clips', 'a small piece of plasticine', 'scissors', 'a glass of water for testing'],
        hr: ['prozirna plastična boca od 1,5 L s čepom', 'plastična slamka', 'četiri ili pet spajalica', 'komadić plastelina', 'škare', 'čaša vode za isprobavanje']
      },
      steps: {
        en: [
          'Cut a piece of straw about 6 cm long. Fold it in half and clip the two open ends together with a paper clip, so that it looks like a narrow letter U.',
          'Hang one or two more paper clips on the first one as ballast.',
          'Test the diver in the glass of water, bend up and open ends down. It must only just float, with the tip of the bend at the surface. If it floats too high, add a clip or a crumb of plasticine; if it sinks, take some weight off.',
          'Fill the bottle with water to the very top, drop the diver in and screw the cap on tightly.',
          'Squeeze the bottle hard with both hands and watch the diver. Then let go.',
          'Look closely at the water inside the straw while you squeeze and release. Can you make the diver hover in the middle of the bottle?'
        ],
        hr: [
          'Odreži komad slamke dug oko 6 cm. Presavij ga napola i oba otvorena kraja spoji spajalicom, tako da izgleda kao usko slovo U.',
          'Na prvu spajalicu objesi još jednu ili dvije kao uteg.',
          'Isprobaj ronioca u čaši vode, pregibom gore, a otvorenim krajevima dolje. Mora jedva plutati, s vrhom pregiba na samoj površini. Ako pluta previsoko, dodaj spajalicu ili mrvicu plastelina; ako tone, skini dio tereta.',
          'Napuni bocu vodom do samog vrha, ubaci ronioca i čvrsto zavrni čep.',
          'Snažno stisni bocu objema rukama i promatraj ronioca. Zatim popusti.',
          'Pažljivo gledaj vodu u slamci dok stišćeš i popuštaš. Možeš li postići da ronilac lebdi u sredini boce?'
        ]
      },
      predict: {
        q: { en: 'You squeeze the sides of the closed bottle. What does the diver do?', hr: 'Stisneš stijenke zatvorene boce. Što će učiniti ronilac?' },
        options: [
          { en: 'It sinks towards the bottom', hr: 'Tone prema dnu' },
          { en: 'It shoots up towards the cap', hr: 'Poleti gore prema čepu' },
          { en: 'It stays where it is', hr: 'Ostaje gdje je i bio' }
        ],
        answer: 0
      },
      observe: {
        en: 'When you squeeze, the diver sinks; when you let go, it rises again. Look closely: while you squeeze, water pushes a little way into the straw and the air bubble inside gets smaller. If the diver refuses to sink, it is too light, so add a crumb of plasticine. If it stays at the bottom, it is too heavy.',
        hr: 'Kad stisneš bocu, ronilac tone; kad popustiš, opet izranja. Pogledaj pažljivo: dok stišćeš, voda malo uđe u slamku, a mjehurić zraka u njoj se smanji. Ako ronilac ne želi potonuti, prelagan je, pa dodaj mrvicu plastelina. Ako ostane na dnu, pretežak je.'
      },
      explain: {
        en: 'Squeezing raises the pressure everywhere in the bottle, because a liquid passes pressure on in all directions. Water can hardly be compressed, but the air trapped in the straw can: it shrinks, and water moves into the straw. The diver now pushes aside less water, so the buoyant force on it is smaller, while its weight has not changed. Its average density becomes larger than that of water and it sinks. When you let go, the air expands and the diver floats again. A submarine dives and surfaces in a similar way, by letting water in and out of its tanks.',
        hr: 'Stiskanjem povećavaš tlak svugdje u boci jer tekućina prenosi tlak u svim smjerovima. Voda se gotovo ne može stlačiti, ali zrak zarobljen u slamci može: on se stisne i voda uđe u slamku. Ronilac sada istiskuje manje vode, pa je uzgon na njega manji, a težina mu se nije promijenila. Njegova prosječna gustoća postane veća od gustoće vode i on tone. Kad popustiš, zrak se raširi i ronilac ponovno pluta. Podmornica zaranja i izranja na sličan način, puštajući vodu u svoje spremnike i iz njih.'
      },
      sim: 'density'
    },

    {
      id: 'potato-density',
      topic: 'density',
      type: 'test',
      level: 3,
      minutes: 35,
      outcome: 'A.7.1',
      title: { en: 'Does a bigger piece have a greater density?', hr: 'Ima li veći komad veću gustoću?' },
      question: {
        en: 'A whole potato is much heavier than a small piece of it. Is its density greater as well?',
        hr: 'Cijeli je krumpir mnogo teži od svojeg malog komadića. Je li mu i gustoća veća?'
      },
      materials: {
        en: ['one large potato', 'a knife and a chopping board (an adult cuts)', 'a kitchen scale', 'a kitchen measuring jug, the narrower the better', 'water', 'a paper towel', 'paper and a pencil'],
        hr: ['jedan veliki krumpir', 'nož i daska za rezanje (reže odrasla osoba)', 'kuhinjska vaga', 'kuhinjska mjerica, što uža to bolje', 'voda', 'papirnati ručnik', 'papir i olovka']
      },
      steps: {
        en: [
          'Ask an adult to cut the potato into three pieces of clearly different sizes: roughly a half, a third and a sixth.',
          'Weigh each piece on the kitchen scale and write down its mass in grams.',
          'Pour water into the jug up to a round mark, for example 300 mL, and read it with your eye level with the surface.',
          'Lower the largest piece gently into the water and read the new level. The rise in millilitres is the volume of the piece in cubic centimetres.',
          'Take the piece out, top the water up to the starting mark and measure the same piece twice more. Then do the same with the other two pieces.',
          'For each piece work out the mean volume and then the density: mass divided by volume.',
          'Draw a graph with volume on the horizontal axis and mass on the vertical axis. Do the three points lie on one straight line through zero?'
        ],
        hr: [
          'Zamoli odraslu osobu da krumpir razreže na tri komada jasno različite veličine: otprilike polovicu, trećinu i šestinu.',
          'Izvaži svaki komad na kuhinjskoj vagi i zapiši masu u gramima.',
          'Ulij vodu u mjericu do okrugle oznake, na primjer 300 mL, i očitaj je s okom u visini površine.',
          'Najveći komad polako spusti u vodu i očitaj novu razinu. Porast u mililitrima obujam je komada u kubnim centimetrima.',
          'Izvadi komad, dolij vodu do početne oznake i isti komad izmjeri još dvaput. Zatim isto napravi s ostala dva komada.',
          'Za svaki komad izračunaj srednju vrijednost obujma, a zatim gustoću: masu podijeli obujmom.',
          'Nacrtaj graf s obujmom na vodoravnoj i masom na okomitoj osi. Leže li tri točke na istom pravcu kroz ishodište?'
        ]
      },
      predict: {
        q: { en: 'Which piece of the potato will have the greatest density?', hr: 'Koji će komad krumpira imati najveću gustoću?' },
        options: [
          { en: 'The biggest, because it is the heaviest', hr: 'Najveći, jer je najteži' },
          { en: 'The smallest, because it is the most compact', hr: 'Najmanji, jer je najzbijeniji' },
          { en: 'All three will have about the same density', hr: 'Sva tri imat će približno jednaku gustoću' }
        ],
        answer: 2
      },
      observe: {
        en: 'The masses and the volumes are very different, but mass divided by volume comes out nearly the same for every piece: about 1.1 g/cm³, or anywhere between 1.0 and 1.2 with a kitchen jug. On the graph the three points lie close to one straight line through zero.',
        hr: 'Mase i obujmi vrlo su različiti, ali omjer mase i obujma ispada gotovo jednak za svaki komad: oko 1,1 g/cm³, odnosno između 1,0 i 1,2 kad se mjeri kuhinjskom mjericom. Na grafu tri točke leže blizu istog pravca kroz ishodište.'
      },
      explain: {
        en: 'Density tells you how much mass is packed into each cubic centimetre, so it is a property of the material, not of the piece. A piece twice as big has twice the mass but also twice the volume, and the ratio stays the same. That is why a whole potato and a crumb of it both sink in water: the density of potato is a little above 1 g/cm³. The small differences between your results come from reading the level in the jug: a mistake of 5 mL matters most for the smallest piece.',
        hr: 'Gustoća govori koliko je mase smješteno u svakom kubnom centimetru, pa je ona svojstvo tvari, a ne komada. Dvostruko veći komad ima dvostruko veću masu, ali i dvostruko veći obujam, pa omjer ostaje isti. Zato u vodi potonu i cijeli krumpir i njegova mrvica: gustoća krumpira malo je veća od 1 g/cm³. Male razlike među tvojim rezultatima dolaze od očitavanja razine u mjerici: pogreška od 5 mL najviše se osjeti kod najmanjeg komada.'
      },
      measure: {
        en: 'Change: the size of the piece. Measure: its mass on the scale and its volume by the rise of the water, three times for each piece. Keep the same: the potato, the jug, your eye level with the surface. Table: piece, mass in g, volume in cm³, density in g/cm³. Plot mass against volume (the FizLab data tool draws the best-fit line for you): the slope of the line is the density.',
        hr: 'Mijenjaš: veličinu komada. Mjeriš: masu vagom i obujam porastom razine vode, tri puta za svaki komad. Ne mijenjaš: krumpir, mjericu ni položaj oka u visini površine. Tablica: komad, masa u g, obujam u cm³, gustoća u g/cm³. Nacrtaj graf ovisnosti mase o obujmu (FizLabov alat za podatke sam će povući pravac koji najbolje pristaje točkama): nagib pravca jest gustoća.'
      },
      safety: {
        en: 'Let an adult cut the potato. Wipe up spilled water so nobody slips.',
        hr: 'Krumpir neka razreže odrasla osoba. Obriši prolivenu vodu da se nitko ne posklizne.'
      },
      tool: 'datalab',
      sim: 'density'
    },

    // ───────────────────────────── MOTION ─────────────────────────────
    {
      id: 'cupcake-cases-fall',
      topic: 'motion',
      type: 'test',
      level: 2,
      minutes: 30,
      outcome: 'C.8.6',
      title: { en: 'Falling cupcake cases', hr: 'Papirnate košarice u padu' },
      question: {
        en: 'Do four paper cases nested together fall faster than a single one, and does a falling case keep speeding up all the way down?',
        hr: 'Padaju li četiri papirnate košarice složene jedna u drugu brže od jedne i ubrzava li košarica cijelim putem do poda?'
      },
      materials: {
        en: ['4 identical paper cupcake cases (or paper coffee filters)', 'a tape measure', 'sticky tape to mark the height', 'a phone with a stopwatch', 'paper and a pencil'],
        hr: ['4 jednake papirnate košarice za muffine (ili papirnata filtra za kavu)', 'mjerna vrpca', 'selotejp za oznaku visine', 'mobitel sa štopericom', 'papir i olovka']
      },
      steps: {
        en: [
          'Mark a height of 2 m on a wall or a door frame (or the greatest height you can reach without climbing). Close the windows: there must be no draught.',
          'Hold one case at the mark, open side up, and let it go without pushing. Time the fall to the floor. Do this five times.',
          'Push two cases tightly into each other: the shape is the same, but the mass is doubled. Time five falls.',
          'Do the same with all four cases nested together.',
          'Work out the mean time for one, two and four cases, and the average speed: 2 m divided by the mean time.',
          'Finally drop a single case from 1 m and then from 2 m and compare the times. Is the time from 2 m about twice as long?'
        ],
        hr: [
          'Označi visinu od 2 m na zidu ili dovratku (ili najveću visinu koju možeš dosegnuti bez penjanja). Zatvori prozore: ne smije biti propuha.',
          'Drži jednu košaricu kod oznake, otvorom prema gore, i pusti je bez guranja. Izmjeri vrijeme pada do poda. Učini to pet puta.',
          'Čvrsto utisni dvije košarice jednu u drugu: oblik je isti, a masa dvostruka. Izmjeri vrijeme pet padova.',
          'Isto napravi sa sve četiri košarice složene jedna u drugu.',
          'Izračunaj srednje vrijeme za jednu, dvije i četiri košarice te srednju brzinu: 2 m podijeli srednjim vremenom.',
          'Na kraju pusti jednu košaricu s 1 m pa s 2 m i usporedi vremena. Je li vrijeme s 2 m otprilike dvostruko dulje?'
        ]
      },
      predict: {
        q: { en: 'Four nested cases have four times the mass of one. How do they fall compared with a single case?', hr: 'Četiri složene košarice imaju četiri puta veću masu od jedne. Kako padaju u usporedbi s jednom košaricom?' },
        options: [
          { en: 'In the same time: all bodies fall equally fast', hr: 'Za isto vrijeme: sva tijela padaju jednako brzo' },
          { en: 'Faster, but not four times faster', hr: 'Brže, ali ne četiri puta brže' },
          { en: 'Four times faster', hr: 'Četiri puta brže' }
        ],
        answer: 1
      },
      observe: {
        en: 'A single case speeds up only over the first few centimetres and then drifts down at a steady speed of roughly 1.5 m/s. The nested cases fall clearly faster, but far from four times faster: four cases are about one and a half to two times as fast as one. From 2 m a single case takes almost twice as long as from 1 m.',
        hr: 'Jedna košarica ubrzava samo prvih nekoliko centimetara, a zatim se spušta stalnom brzinom od otprilike 1,5 m/s. Složene košarice padaju jasno brže, ali ni izdaleka četiri puta brže: četiri košarice brže su od jedne oko jedan i pol do dva puta. S 2 m jednoj košarici treba gotovo dvostruko više vremena nego s 1 m.'
      },
      explain: {
        en: 'Two forces act on a falling case: its weight pulls it down and air resistance pushes up. Air resistance grows with speed. A light case very soon reaches the speed at which air resistance equals its weight; from then on the forces are balanced and it falls at a constant speed, which is why twice the height takes twice the time. Four cases have four times the weight but the same shape, so they must fall faster before the air pushes back hard enough. Air resistance grows roughly with the square of the speed, so about twice the speed is enough. All bodies fall equally fast only when air resistance can be neglected.',
        hr: 'Na košaricu koja pada djeluju dvije sile: sila teža vuče je dolje, a otpor zraka gura gore. Otpor zraka raste s brzinom. Lagana košarica vrlo brzo postigne brzinu pri kojoj je otpor zraka jednak sili teži; otad su sile u ravnoteži i ona pada stalnom brzinom, pa zato za dvostruku visinu treba dvostruko vrijeme. Četiri košarice imaju četiri puta veću težinu, ali isti oblik, pa moraju padati brže prije nego što ih zrak dovoljno snažno zakoči. Otpor zraka raste otprilike s kvadratom brzine, pa je dovoljna oko dvostruko veća brzina. Sva tijela padaju jednako brzo samo kad se otpor zraka može zanemariti.'
      },
      measure: {
        en: 'Change: the number of nested cases (1, 2, 4). Measure: the time of fall from 2 m, five times for each. Keep the same: the height, the way you let go, the open side up, no draught. Table: number of cases, five times, mean time, speed. Leave out any fall in which the case tumbled or drifted sideways.',
        hr: 'Mijenjaš: broj složenih košarica (1, 2, 4). Mjeriš: vrijeme pada s 2 m, pet puta za svaki broj. Ne mijenjaš: visinu, način puštanja, otvor prema gore, prostor bez propuha. Tablica: broj košarica, pet vremena, srednje vrijeme, brzina. Izostavi svaki pad u kojem se košarica prevrtala ili odlutala u stranu.'
      },
      tool: 'stopwatch',
      sim: 'freefall'
    },

    {
      id: 'ruler-reaction-time',
      topic: 'motion',
      type: 'test',
      level: 2,
      minutes: 20,
      outcome: 'C.8.5',
      title: { en: 'Catch the ruler: measure your reaction time', hr: 'Uhvati ravnalo: izmjeri svoje vrijeme reakcije' },
      question: {
        en: 'How long do you need to react? Can a falling ruler measure a time shorter than a quarter of a second?',
        hr: 'Koliko ti vremena treba da reagiraš? Može li ravnalo koje pada izmjeriti vrijeme kraće od četvrtine sekunde?'
      },
      materials: {
        en: ['a 30 cm ruler', 'a helper', 'a table to rest your wrist on', 'paper and a pencil'],
        hr: ['ravnalo od 30 cm', 'pomoćnik', 'stol na koji ćeš osloniti zapešće', 'papir i olovka']
      },
      steps: {
        en: [
          'Rest your wrist on the edge of the table with your thumb and forefinger about 2 cm apart. The helper holds the ruler by its top end so that it hangs straight down with the zero mark between your fingers.',
          'Without any warning the helper lets go. Catch the ruler as quickly as you can.',
          'Read the mark just above your thumb: that is how far the ruler fell. Write it down in centimetres.',
          'Do ten drops. Leave out any drop in which you guessed and closed your fingers too early. Work out the mean distance.',
          'Turn the distance into time: 5 cm is 0.10 s, 8 cm is 0.13 s, 11 cm is 0.15 s, 15 cm is 0.17 s, 20 cm is 0.20 s, 25 cm is 0.23 s, 30 cm is 0.25 s.',
          'Do ten more drops while you count aloud backwards from 100 in threes. Compare the two mean values.',
          'Compare your result with the reaction test in the FizLab stopwatch.'
        ],
        hr: [
          'Osloni zapešće na rub stola, s palcem i kažiprstom razmaknutima oko 2 cm. Pomoćnik drži ravnalo za gornji kraj tako da visi ravno dolje, s oznakom nula između tvojih prstiju.',
          'Pomoćnik bez ikakva upozorenja pusti ravnalo. Uhvati ga što brže možeš.',
          'Očitaj oznaku tik iznad palca: toliko je ravnalo palo. Zapiši u centimetrima.',
          'Napravi deset pokušaja. Izostavi svaki u kojem si pogađao i prerano stisnuo prste. Izračunaj srednju vrijednost puta.',
          'Pretvori put u vrijeme: 5 cm je 0,10 s, 8 cm je 0,13 s, 11 cm je 0,15 s, 15 cm je 0,17 s, 20 cm je 0,20 s, 25 cm je 0,23 s, 30 cm je 0,25 s.',
          'Napravi još deset pokušaja dok naglas brojiš unatrag od 100 po tri. Usporedi dvije srednje vrijednosti.',
          'Usporedi svoj rezultat s testom reakcije u FizLabovoj štoperici.'
        ]
      },
      predict: {
        q: { en: 'Your fingers wait at the zero mark. At which mark of the 30 cm ruler will you catch it?', hr: 'Tvoji prsti čekaju kod oznake nula. Kod koje ćeš oznake uhvatiti ravnalo od 30 cm?' },
        options: [
          { en: 'Within the first 2 cm: I react at once', hr: 'Unutar prva 2 cm: reagiram odmah' },
          { en: 'Somewhere between 10 and 25 cm', hr: 'Negdje između 10 i 25 cm' },
          { en: 'I will not catch it at all', hr: 'Uopće ga neću uhvatiti' }
        ],
        answer: 1
      },
      observe: {
        en: 'Most people catch the ruler between 12 and 22 cm, which means a reaction time of 0.16 to 0.21 s. The distance changes by a few centimetres from drop to drop, which is why you need ten drops. While you are counting backwards the ruler falls noticeably farther.',
        hr: 'Većina ljudi uhvati ravnalo između 12 i 22 cm, što znači vrijeme reakcije od 0,16 do 0,21 s. Put se od pokušaja do pokušaja mijenja za nekoliko centimetara, i zato ti treba deset pokušaja. Dok brojiš unatrag, ravnalo padne primjetno dalje.'
      },
      explain: {
        en: 'Between the moment your eyes see the ruler move and the moment your fingers close, a signal has to travel from the eye to the brain and from the brain to the muscles of your hand. That takes about two tenths of a second, and all that time the ruler is in free fall. A falling body speeds up, so the distance grows with the square of the time, s = g·t²/2: twice the reaction time means four times the distance. The ruler turns a time too short for a stopwatch into a length that is easy to read. Even 0.2 s matters: a cyclist riding at 18 km/h covers a whole metre in that time.',
        hr: 'Od trenutka kad oči vide da se ravnalo pomaknulo do trenutka kad se prsti stisnu, signal mora prijeći put od oka do mozga i od mozga do mišića šake. To traje oko dvije desetinke sekunde, a cijelo to vrijeme ravnalo slobodno pada. Tijelo koje pada ubrzava, pa put raste s kvadratom vremena, s = g·t²/2: dvostruko dulje vrijeme reakcije znači četiri puta veći put. Ravnalo pretvara vrijeme prekratko za štopericu u duljinu koju je lako očitati. I 0,2 s je važno: biciklist koji vozi 18 km/h u tom vremenu prijeđe cijeli metar.'
      },
      measure: {
        en: 'Change: with or without a distraction (counting backwards aloud). Measure: the distance the ruler falls, ten drops for each case. Keep the same: the hand, the gap between your fingers, the helper, the wrist resting on the table. Table: number of the drop and distance in cm; work out the mean and turn it into time.',
        hr: 'Mijenjaš: s ometanjem ili bez njega (brojenje unatrag naglas). Mjeriš: put koji ravnalo prijeđe, deset pokušaja za svaki slučaj. Ne mijenjaš: ruku, razmak među prstima, pomoćnika, zapešće oslonjeno na stol. Tablica: redni broj pokušaja i put u cm; izračunaj srednju vrijednost i pretvori je u vrijeme.'
      },
      tool: 'stopwatch',
      sim: 'freefall'
    },

    {
      id: 'water-clock-bottle',
      topic: 'motion',
      type: 'project',
      level: 3,
      minutes: 45,
      outcome: '7.10',
      title: { en: 'Build a water clock', hr: 'Napravi vodeni sat' },
      question: {
        en: 'People measured time long before there were clocks with springs and batteries. Can running water measure three minutes for you?',
        hr: 'Ljudi su mjerili vrijeme mnogo prije satova s oprugama i baterijama. Može li ti voda koja istječe izmjeriti tri minute?'
      },
      materials: {
        en: ['a 1.5 L plastic bottle with a cap', 'scissors and a drawing pin (an adult cuts and pierces)', 'paper tape or sticky tape you can write on', 'a waterproof marker', 'a phone with a stopwatch', 'water'],
        hr: ['plastična boca od 1,5 L s čepom', 'škare i čavlić za ploču (reže i buši odrasla osoba)', 'papirnata ljepljiva traka ili selotejp po kojem se može pisati', 'vodootporni flomaster', 'mobitel sa štopericom', 'voda']
      },
      steps: {
        en: [
          'Ask an adult to cut the bottle in two across the middle and to pierce a small hole in the centre of the cap with the drawing pin. Screw the cap back on.',
          'Turn the top half upside down and stand it in the bottom half like a funnel. Stick a strip of tape down the side of the bottom half.',
          'Draw a filling line near the top of the funnel. Hold a finger over the hole and fill the funnel with water exactly to that line.',
          'Take your finger away and start the stopwatch at the same moment. After every full minute mark the water level in the bottom half on the tape and number the marks.',
          'Empty the bottom half and fill the funnel to the line again. Now use your clock: without looking at the phone, say "now" when the water reaches the mark for 3 minutes. A helper reads the stopwatch.',
          'Repeat the test three times and write down how many seconds your clock was off each time.'
        ],
        hr: [
          'Zamoli odraslu osobu da bocu prereže napola po sredini i da čavlićem probuši rupicu u sredini čepa. Vrati čep na bocu.',
          'Gornju polovicu okreni naopako i postavi je u donju polovicu kao lijevak. Uz stijenku donje polovice okomito zalijepi traku.',
          'Blizu vrha lijevka nacrtaj crtu punjenja. Prstom zatvori rupicu i napuni lijevak vodom točno do te crte.',
          'Makni prst i u istom trenutku pokreni štopericu. Nakon svake pune minute označi na traci razinu vode u donjoj polovici i uz oznake napiši brojeve.',
          'Isprazni donju polovicu i ponovno napuni lijevak do crte. Sad se posluži svojim satom: ne gledajući mobitel, reci „sad“ kad voda dođe do oznake za 3 minute. Pomoćnik očitava štopericu.',
          'Ponovi provjeru tri puta i svaki put zapiši za koliko je sekundi tvoj sat pogriješio.'
        ]
      },
      predict: {
        q: { en: 'You mark the water level after every minute. How will the marks be spaced?', hr: 'Razinu vode označavaš nakon svake minute. Kako će oznake biti razmaknute?' },
        options: [
          { en: 'Evenly: the same amount of water runs out every minute', hr: 'Jednako: svake minute isteče ista količina vode' },
          { en: 'Farther and farther apart', hr: 'Sve dalje jedna od druge' },
          { en: 'Closer and closer together', hr: 'Sve bliže jedna drugoj' }
        ],
        answer: 2
      },
      observe: {
        en: 'The first marks are far apart and the later ones crowd together: the water runs fast at first and then more and more slowly as the funnel empties. Filled to the same line, your clock repeats its times to within a few seconds. If the water only drips or stops, the hole is too small: ask an adult to widen it a little.',
        hr: 'Prve su oznake daleko jedna od druge, a kasnije se zbijaju: voda isprva istječe brzo, a zatim sve sporije kako se lijevak prazni. Napunjen do iste crte, tvoj sat ponavlja svoja vremena uz razliku od nekoliko sekundi. Ako voda samo kaplje ili stane, rupica je premalena: zamoli odraslu osobu da je malo proširi.'
      },
      explain: {
        en: 'The water is pushed through the hole by the pressure of the water above it, and that pressure depends on depth. A full funnel means a large depth, a high pressure and a fast stream; as the level falls, the pressure and the flow get smaller. So equal times do not give equal amounts of water. A clock does not need even marks, though: it only has to repeat itself exactly, which is why you always fill to the same line. The ancient Egyptians and Greeks evened out the flow with specially shaped vessels or by keeping the upper vessel full all the time.',
        hr: 'Vodu kroz rupicu gura tlak vode iznad nje, a taj tlak ovisi o dubini. Pun lijevak znači veliku dubinu, velik tlak i brz mlaz; kako razina pada, tlak i protok se smanjuju. Zato u jednakim vremenima ne isteče jednaka količina vode. Satu, međutim, ne trebaju jednako razmaknute oznake: mora se samo točno ponavljati, i zato lijevak uvijek puniš do iste crte. Stari Egipćani i Grci ujednačavali su istjecanje posebno oblikovanim posudama ili tako da je gornja posuda stalno bila puna.'
      },
      safety: {
        en: 'An adult should cut the bottle and pierce the cap. Cover the cut edges with tape, because they can be sharp.',
        hr: 'Bocu neka prereže i čep probuši odrasla osoba. Odrezane rubove oblijepi trakom jer mogu biti oštri.'
      },
      tool: 'stopwatch',
      sim: 'pressure'
    },

    // ───────────────────────────── FORCES ─────────────────────────────
    {
      id: 'friction-area-load',
      topic: 'forces',
      type: 'test',
      level: 2,
      minutes: 30,
      outcome: 'B.7.3',
      title: { en: 'Does friction depend on the area of contact?', hr: 'Ovisi li trenje o veličini dodirne plohe?' },
      question: {
        en: 'Is a box harder to drag when it lies on its wide side than on its narrow side? And what changes when you load it?',
        hr: 'Je li kutiju teže vući kad leži na široj nego na užoj strani? I što se mijenja kad je opteretiš?'
      },
      materials: {
        en: ['a full 1 L drink carton with a wide and a narrow side', 'a second full carton or a 1 kg bag of sugar as a load', 'string', 'a strong rubber band', 'a paper clip', 'a ruler', 'a smooth table'],
        hr: ['pun tetrapak od 1 L sa širom i užom bočnom stranom', 'drugi pun tetrapak ili vrećica šećera od 1 kg kao teret', 'špaga', 'jaka gumica', 'spajalica', 'ravnalo', 'gladak stol']
      },
      steps: {
        en: [
          'Tie the string around the carton like a parcel and hook the rubber band to the string with the paper clip. Measure the length of the unstretched band.',
          'Lay the carton on its wide side. Pull the band horizontally, slowly and steadily, so that the carton slides at a constant speed. While it slides, measure the length of the band with the ruler held beside it (a helper makes this easier).',
          'The stretch is that length minus the unstretched length. Repeat three times and take the mean.',
          'Turn the carton onto its narrow side: a smaller area of contact, the same weight. Measure the stretch three times.',
          'Lay the carton on its wide side again and put the second carton on top: the same area, double the weight. Measure three times.',
          'Compare the three mean stretches. Which change made a difference: the area or the weight?'
        ],
        hr: [
          'Zaveži špagu oko tetrapaka kao oko paketa i spajalicom zakvači gumicu za špagu. Izmjeri duljinu nerastegnute gumice.',
          'Položi tetrapak na širu stranu. Vuci gumicu vodoravno, polako i ravnomjerno, tako da tetrapak klizi stalnom brzinom. Dok klizi, ravnalom koje držiš uz gumicu izmjeri njezinu duljinu (lakše je uz pomoćnika).',
          'Produljenje je ta duljina umanjena za duljinu nerastegnute gumice. Ponovi tri puta i izračunaj srednju vrijednost.',
          'Okreni tetrapak na užu stranu: manja dodirna ploha, ista težina. Izmjeri produljenje tri puta.',
          'Ponovno položi tetrapak na širu stranu i na njega stavi drugi tetrapak: ista ploha, dvostruka težina. Izmjeri tri puta.',
          'Usporedi tri srednja produljenja. Koja je promjena nešto promijenila: ploha ili težina?'
        ]
      },
      predict: {
        q: { en: 'The carton lies first on its wide side and then on its narrow side. When is the friction larger?', hr: 'Tetrapak leži najprije na široj, a zatim na užoj strani. Kada je trenje veće?' },
        options: [
          { en: 'On the wide side: more surface is rubbing', hr: 'Na široj strani: tare se veća površina' },
          { en: 'On the narrow side: the weight is concentrated', hr: 'Na užoj strani: težina je skupljena na manjoj plohi' },
          { en: 'It is about the same both times', hr: 'Oba je puta približno jednako' }
        ],
        answer: 2
      },
      observe: {
        en: 'The band stretches practically the same on the wide side and on the narrow side; the difference is within your measuring error. With the second carton on top the stretch, and so the friction, roughly doubles. Just before the carton starts to move, the band stretches a little more than during sliding.',
        hr: 'Gumica se na široj i na užoj strani rastegne praktički jednako; razlika je unutar tvoje mjerne pogreške. S drugim tetrapakom na vrhu produljenje, a time i trenje, otprilike se udvostruči. Tik prije nego što se tetrapak pokrene, gumica se rastegne malo više nego tijekom klizanja.'
      },
      explain: {
        en: 'While the carton slides at a steady speed, the pull of the band is equal to the friction, so the stretch shows how large the friction is. Sliding friction depends on how hard the two surfaces are pressed together, here by the weight, and on what the surfaces are like. It does not depend on the area of contact: on the narrow side the same weight presses on fewer square centimetres, so each of them is pressed harder, and that exactly makes up for the smaller area. Double the weight gives double the friction. The slightly larger pull needed to start the motion is static friction.',
        hr: 'Dok tetrapak klizi stalnom brzinom, sila kojom vuče gumica jednaka je trenju, pa produljenje pokazuje koliko je trenje. Trenje klizanja ovisi o tome koliko su snažno dvije plohe pritisnute jedna uz drugu, ovdje težinom, i o tome kakve su te plohe. Ne ovisi o veličini dodirne plohe: na užoj strani ista težina pritišće manje kvadratnih centimetara, pa je svaki od njih jače pritisnut, što točno nadoknadi manju plohu. Dvostruka težina daje dvostruko trenje. Nešto veća sila potrebna za pokretanje jest trenje mirovanja.'
      },
      measure: {
        en: 'Change: first the area of contact (wide or narrow side), then the weight (one or two cartons). Measure: the stretch of the band during steady sliding, three times for each case. Keep the same: the table, the band, a slow steady speed, a horizontal pull. Table: case, three stretches, mean.',
        hr: 'Mijenjaš: najprije dodirnu plohu (šira ili uža strana), a zatim težinu (jedan ili dva tetrapaka). Mjeriš: produljenje gumice tijekom jednolikog klizanja, tri puta za svaki slučaj. Ne mijenjaš: stol, gumicu, malu stalnu brzinu, vodoravno povlačenje. Tablica: slučaj, tri produljenja, srednja vrijednost.'
      },
      safety: {
        en: 'Do not stretch the band to its limit: it can snap and hit your face.',
        hr: 'Ne napinji gumicu do kraja: može puknuti i udariti te u lice.'
      },
      sim: 'friction'
    },

    {
      id: 'inertia-coin-card',
      topic: 'forces',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'C.8.6',
      title: { en: 'The lazy coin', hr: 'Lijena kovanica' },
      question: {
        en: 'Can you get a coin into a glass without touching it, and knock the bottom coin out of a tower without toppling the tower?',
        hr: 'Možeš li ubaciti kovanicu u čašu, a da je ne dotakneš, i izbiti donju kovanicu iz tornja, a da toranj ne srušiš?'
      },
      materials: {
        en: ['a drinking glass', 'a playing card or a piece of stiff card', '7 identical coins', 'a smooth table'],
        hr: ['čaša', 'igraća karta ili komad tvrdog kartona', '7 jednakih kovanica', 'gladak stol']
      },
      steps: {
        en: [
          'Lay the card on the glass and put a coin on the card, exactly above the middle of the glass.',
          'Flick the edge of the card sharply with your finger, so that the card shoots away sideways. Where does the coin go?',
          'Put the coin back and this time pull the card away slowly. What does the coin do now?',
          'Build a neat tower of six coins on the table.',
          'Lay the seventh coin flat on the table a hand away and flick it hard at the bottom coin of the tower.',
          'Try once more with a gentle, slow flick and compare.'
        ],
        hr: [
          'Položi kartu na čašu i na kartu stavi kovanicu, točno iznad sredine čaše.',
          'Prstom naglo kvrcni rub karte tako da karta odleti u stranu. Kamo ode kovanica?',
          'Vrati kovanicu, a ovaj put kartu izvuci polako. Što sad napravi kovanica?',
          'Na stolu složi uredan toranj od šest kovanica.',
          'Sedmu kovanicu položi na stol na udaljenosti od jednog dlana i snažno je kvrcni prema donjoj kovanici tornja.',
          'Pokušaj još jednom, blagim i sporim udarcem, pa usporedi.'
        ]
      },
      predict: {
        q: { en: 'You flick the card away very quickly. What happens to the coin?', hr: 'Vrlo brzo izbiješ kartu ispod kovanice. Što se dogodi s kovanicom?' },
        options: [
          { en: 'It drops straight into the glass', hr: 'Padne ravno u čašu' },
          { en: 'It flies away together with the card', hr: 'Odleti zajedno s kartom' },
          { en: 'It jumps up into the air', hr: 'Poskoči uvis' }
        ],
        answer: 0
      },
      observe: {
        en: 'After a fast flick the card shoots out and the coin drops straight into the glass with a clink. Pulled slowly, the card carries the coin away with it. Hit hard, the bottom coin flies out of the tower and the other coins drop down by one storey, still stacked.',
        hr: 'Nakon brzog udarca prstom karta odleti, a kovanica uz zveket padne ravno u čašu. Kad kartu vučeš polako, ona odnese kovanicu sa sobom. Nakon snažnog udarca donja kovanica izleti iz tornja, a ostale se spuste za jedan kat i ostanu složene.'
      },
      explain: {
        en: 'Every body stays at rest, or keeps moving the way it is moving, until a force changes that. This property is called inertia. The only sideways force on the coin is friction with the card. During a fast flick friction acts for such a short time that it hardly gets the coin moving, so the coin stays where it was and gravity then pulls it down into the glass. Pulled slowly, the same friction has plenty of time to drag the coin along. The greater the mass of a body, the greater its inertia.',
        hr: 'Svako tijelo miruje, ili se nastavlja gibati onako kako se giba, sve dok to ne promijeni neka sila. To se svojstvo zove tromost. Jedina sila koja kovanicu gura u stranu jest trenje s kartom. Pri brzom udarcu trenje djeluje tako kratko da kovanicu jedva pokrene, pa ona ostane gdje je bila, a sila teža je zatim povuče dolje u čašu. Kad kartu vučeš polako, isto trenje ima dovoljno vremena da povuče kovanicu sa sobom. Što je masa tijela veća, veća je i njegova tromost.'
      },
      sim: 'forces'
    },

    {
      id: 'balloon-rocket-string',
      topic: 'forces',
      type: 'apply',
      level: 2,
      minutes: 25,
      outcome: 'B.7.2',
      title: { en: 'A balloon rocket on a string', hr: 'Raketa od balona na špagi' },
      question: {
        en: 'A balloon has no wheels and no engine. What pushes it forward when the air rushes out, and how much cargo can it carry?',
        hr: 'Balon nema ni kotače ni motor. Što ga gura naprijed dok zrak izlazi i koliko tereta može ponijeti?'
      },
      materials: {
        en: ['a balloon (a long one is best)', '4 to 5 m of smooth string or thread', 'a drinking straw', 'sticky tape', 'a clothes peg', 'two chairs', 'paper clips as cargo', 'a tape measure'],
        hr: ['balon (najbolji je duguljasti)', '4 do 5 m glatke špage ili konca', 'slamka', 'selotejp', 'štipaljka', 'dva stolca', 'spajalice kao teret', 'mjerna vrpca']
      },
      steps: {
        en: [
          'Thread the string through the straw. Tie its ends to two chairs about 4 m apart and move the chairs until the string is tight and level.',
          'Blow up the balloon, twist its neck and close it with the clothes peg. Do not tie a knot.',
          'Tape the balloon to the straw with two strips of tape, its opening pointing along the string, and slide it to the chair behind the opening.',
          'Decide which way it will go, then take off the peg.',
          'Measure how far the rocket travelled. Repeat three times with the balloon blown up to the same size.',
          'Now the task: tape paper clips under the balloon, two at a time. What is the largest cargo with which the rocket still reaches the other chair? Then try a string that slopes upwards.'
        ],
        hr: [
          'Provuci špagu kroz slamku. Krajeve zaveži za dva stolca udaljena oko 4 m i razmakni stolce dok špaga ne bude napeta i vodoravna.',
          'Napuhni balon, zavrni mu grlo i zatvori ga štipaljkom. Nemoj vezati čvor.',
          'Dvjema trakama selotejpa zalijepi balon za slamku, s otvorom u smjeru špage, i odgurni ga do stolca koji je iza otvora.',
          'Odluči na koju će stranu krenuti, pa skini štipaljku.',
          'Izmjeri koliko je daleko raketa stigla. Ponovi tri puta s balonom napuhanim do iste veličine.',
          'Sad zadatak: ispod balona lijepi spajalice, po dvije odjednom. S kojim najvećim teretom raketa još stigne do drugog stolca? Zatim pokušaj sa špagom koja se penje ukoso.'
        ]
      },
      predict: {
        q: { en: 'The opening of the balloon points to the left. Which way does the balloon move, and why?', hr: 'Otvor balona okrenut je ulijevo. Na koju će se stranu balon gibati i zašto?' },
        options: [
          { en: 'To the left, following the air that rushes out', hr: 'Ulijevo, za zrakom koji izlazi' },
          { en: 'To the right: the balloon pushes air out to the left, and that air pushes the balloon to the right', hr: 'Udesno: balon gura zrak ulijevo, a taj zrak gura balon udesno' },
          { en: 'To the right, because the jet pushes off against the air in the room', hr: 'Udesno, jer se mlaz odupire o zrak u sobi' }
        ],
        answer: 1
      },
      observe: {
        en: 'The balloon shoots along the string in the direction opposite to the jet of air, fast at first and more slowly as it empties. With more cargo it starts off more slowly and stops sooner.',
        hr: 'Balon pojuri po špagi u smjeru suprotnom od mlaza zraka, isprva brzo, a zatim sve sporije kako se prazni. S više tereta kreće sporije i staje ranije.'
      },
      explain: {
        en: 'The stretched rubber squeezes the air and pushes it out backwards. By the law of action and reaction the air pushes the balloon with an equally large force in the opposite direction, forwards. The two forces act on different bodies, one on the air and one on the balloon, so they do not cancel. The rocket does not need outside air to push against: real rockets work even better in empty space, where they throw hot gas backwards. More cargo means more mass, and the same force then gives a smaller acceleration.',
        hr: 'Napeta guma stišće zrak i izbacuje ga unatrag. Prema zakonu akcije i reakcije zrak gura balon jednako velikom silom u suprotnom smjeru, naprijed. Te dvije sile djeluju na različita tijela, jedna na zrak, a druga na balon, pa se ne poništavaju. Raketi ne treba vanjski zrak o koji bi se odupirala: prave rakete rade još bolje u praznom svemiru, gdje unatrag izbacuju vruće plinove. Više tereta znači veću masu, a ista sila tada daje manje ubrzanje.'
      },
      sim: 'forcepairs'
    },

    // ───────────────────────────── GRAVITY ─────────────────────────────
    {
      id: 'paper-on-book-fall',
      topic: 'gravity',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'C.8.6',
      title: { en: 'Paper and a book: which falls faster?', hr: 'Papir i knjiga: što pada brže?' },
      question: {
        en: 'Does a heavy book really fall faster than a light sheet of paper, or is something else slowing the paper down?',
        hr: 'Pada li teška knjiga doista brže od laganog lista papira ili papir usporava nešto drugo?'
      },
      materials: {
        en: ['a hardcover book', 'a sheet of paper smaller than the cover of the book', 'a carpet or a blanket to drop things on'],
        hr: ['knjiga tvrdih korica', 'list papira manji od korica knjige', 'tepih ili deka na koju ćeš ispuštati predmete']
      },
      steps: {
        en: [
          'Hold the book flat in one hand and the sheet of paper flat in the other, both at shoulder height. Let them go at the same moment. Which lands first?',
          'Now lay the paper on top of the book. It must not stick out over the edge. Before you drop them, make your prediction.',
          'Drop the book flat, with the paper lying on it, and watch the paper.',
          'Crumple the sheet into a tight ball. Drop the ball and the book side by side from the same height.',
          'Finally drop the paper ball and a flat sheet of the same paper together: the same mass, a different shape.'
        ],
        hr: [
          'Drži knjigu vodoravno u jednoj ruci, a list papira vodoravno u drugoj, oboje u visini ramena. Pusti ih u istom trenutku. Što prije padne?',
          'Sad položi papir na knjigu. Ne smije viriti preko ruba. Prije nego što ih pustiš, zapiši svoje predviđanje.',
          'Pusti knjigu vodoravno, s papirom na njoj, i promatraj papir.',
          'Zgužvaj list u čvrstu lopticu. Pusti lopticu i knjigu jednu uz drugu s iste visine.',
          'Na kraju zajedno pusti papirnatu lopticu i ravan list istog papira: ista masa, drukčiji oblik.'
        ]
      },
      predict: {
        q: { en: 'The sheet lies on top of the book and you drop them together. What does the paper do?', hr: 'List leži na knjizi i pustiš ih zajedno. Što će učiniti papir?' },
        options: [
          { en: 'It stays on the book all the way down', hr: 'Ostaje na knjizi cijelim putem do poda' },
          { en: 'It lags behind and flutters down slowly, as before', hr: 'Zaostaje i polako lebdi dolje, kao i prije' },
          { en: 'It is blown off sideways at once', hr: 'Odmah ga otpuhne u stranu' }
        ],
        answer: 0
      },
      observe: {
        en: 'On its own the flat sheet glides and flutters and lands long after the book. Lying on the book, it falls together with it as if it were glued on. The crumpled ball lands almost together with the book, although its mass has not changed at all.',
        hr: 'Sam ravan list jedri i leprša te padne mnogo nakon knjige. Kad leži na knjizi, pada zajedno s njom kao da je zalijepljen. Zgužvana loptica padne gotovo zajedno s knjigom, iako joj se masa nije nimalo promijenila.'
      },
      explain: {
        en: 'The sheet is not slow because it is light. It is slow because the air pushes hard against its large surface compared with its small weight. On top of the book the paper travels in the shelter of the book: the book pushes the air aside, almost no air resistance acts on the paper, and it falls just as fast as the book. Crumpling does not change the mass, only the surface the air can push against. Without air all bodies fall with the same acceleration: gravity pulls a heavier body harder, but a heavier body is also harder to speed up.',
        hr: 'List nije spor zato što je lagan. Spor je zato što zrak snažno gura njegovu veliku površinu u usporedbi s njegovom malom težinom. Na knjizi papir putuje u njezinu zaklonu: knjiga razmiče zrak, na papir gotovo da i ne djeluje otpor zraka i on pada jednako brzo kao knjiga. Gužvanjem se ne mijenja masa, nego samo površina na koju zrak može djelovati. Bez zraka sva tijela padaju jednakim ubrzanjem: sila teža teže tijelo vuče jače, ali teže je tijelo i teže ubrzati.'
      },
      sim: 'freefall'
    },

    {
      id: 'pendulum-length-g',
      topic: 'gravity',
      type: 'test',
      level: 3,
      minutes: 45,
      outcome: '7.10',
      title: { en: 'The pendulum: what sets its period, and how big is g?', hr: 'Njihalo: o čemu ovisi period i koliki je g?' },
      question: {
        en: 'What decides how fast a pendulum swings: its length, the mass of the bob or how far you pull it aside? And can it measure the acceleration of free fall?',
        hr: 'O čemu ovisi koliko brzo njihalo titra: o duljini, masi utega ili o tome koliko ga otkloniš? I može li njihalo izmjeriti ubrzanje slobodnog pada?'
      },
      materials: {
        en: ['about 1.5 m of thin string', 'a heavy bob (a bunch of keys or a large metal nut) and a light one (a single key)', 'strong sticky tape', 'a door frame or the edge of a table', 'a tape measure', 'a phone with a stopwatch', 'paper, a pencil and a calculator'],
        hr: ['oko 1,5 m tanke špage', 'teži uteg (svežanj ključeva ili velika matica) i lakši uteg (jedan ključ)', 'jaka ljepljiva traka', 'dovratak ili rub stola', 'mjerna vrpca', 'mobitel sa štopericom', 'papir, olovka i kalkulator']
      },
      steps: {
        en: [
          'Tie the heavy bob to the string and tape the string firmly to the top of a door frame so that the bob can swing freely. Set the length to 1.00 m, measured from the fixing point to the middle of the bob.',
          'Pull the bob about 10 cm aside and let it go without pushing. Time 10 full swings (there and back is one swing) and divide by 10: that is the period T. Do this three times.',
          'Shorten the pendulum to 0.50 m and then to 0.25 m, and time 10 swings three times for each length.',
          'Go back to 1.00 m and change only the mass: hang the single key instead of the heavy bob. Time 10 swings three times.',
          'With the heavy bob at 1.00 m change only the starting pull: 5 cm and then 20 cm.',
          'From the result for 1.00 m calculate g = 39.5 · L / T², with L in metres and T in seconds.'
        ],
        hr: [
          'Zaveži teži uteg za špagu i špagu čvrsto zalijepi za vrh dovratka tako da se uteg može slobodno njihati. Namjesti duljinu na 1,00 m, mjereno od učvršćenja do sredine utega.',
          'Otkloni uteg oko 10 cm u stranu i pusti ga bez guranja. Izmjeri vrijeme 10 punih titraja (tamo i natrag jedan je titraj) i podijeli s 10: to je period T. Učini to tri puta.',
          'Skrati njihalo na 0,50 m, a zatim na 0,25 m i za svaku duljinu tri puta izmjeri vrijeme 10 titraja.',
          'Vrati duljinu na 1,00 m i promijeni samo masu: umjesto težeg utega objesi jedan ključ. Tri puta izmjeri vrijeme 10 titraja.',
          'S težim utegom na 1,00 m promijeni samo početni otklon: 5 cm, a zatim 20 cm.',
          'Iz rezultata za 1,00 m izračunaj g = 39,5 · L / T², uz L u metrima i T u sekundama.'
        ]
      },
      predict: {
        q: { en: 'You hang a much heavier bob on the same string. What happens to the period?', hr: 'Na istu špagu objesiš mnogo teži uteg. Što se događa s periodom?' },
        options: [
          { en: 'It gets shorter: a heavy bob swings faster', hr: 'Skrati se: teži uteg titra brže' },
          { en: 'It gets longer: a heavy bob is slower', hr: 'Produlji se: teži je uteg sporiji' },
          { en: 'It stays the same', hr: 'Ostaje isti' }
        ],
        answer: 2
      },
      observe: {
        en: 'With a length of 1 m ten swings take about 20 s, so T is about 2.0 s. For 0.5 m you get about 1.4 s and for 0.25 m about 1.0 s. Changing the bob or the starting pull does not change the period by more than your timing error. Your g should come out between 9.5 and 10.1 m/s².',
        hr: 'Uz duljinu od 1 m deset titraja traje oko 20 s, pa je T oko 2,0 s. Za 0,5 m dobije se oko 1,4 s, a za 0,25 m oko 1,0 s. Promjena utega ili početnog otklona ne mijenja period više od tvoje pogreške mjerenja vremena. Tvoj g trebao bi ispasti između 9,5 i 10,1 m/s².'
      },
      explain: {
        en: 'The period of a pendulum depends only on its length and on gravity: T = 2π·√(L/g). A heavier bob is pulled harder by gravity, but it is also harder to set in motion, and the two effects cancel exactly, just as in free fall. A pendulum four times as long has a period only twice as long, because the period grows with the square root of the length. Timing ten swings spreads the error of your reaction over ten periods. That is why a piece of string and a key can measure g to within a few per cent.',
        hr: 'Period njihala ovisi samo o njegovoj duljini i o sili teži: T = 2π·√(L/g). Teži uteg sila teža vuče jače, ali njega je i teže pokrenuti, pa se ta dva učinka točno poništavaju, baš kao pri slobodnom padu. Četiri puta dulje njihalo ima samo dvostruko dulji period jer period raste s drugim korijenom duljine. Mjerenjem deset titraja pogreška tvoje reakcije raspodijeli se na deset perioda. Zato komad špage i ključ mogu izmjeriti g s pogreškom od samo nekoliko posto.'
      },
      measure: {
        en: 'Change one thing at a time: the length (1.00 m, 0.50 m, 0.25 m), then the mass, then the starting pull. Measure: the time of 10 swings, three times for each case; T is the mean time divided by 10. Table: length, three times, mean, T, T². Plot T² against L (the FizLab data tool can do it): the points lie on a straight line through zero with a slope of about 4 s²/m.',
        hr: 'Mijenjaš jedno po jedno: duljinu (1,00 m, 0,50 m, 0,25 m), zatim masu, zatim početni otklon. Mjeriš: vrijeme 10 titraja, tri puta za svaki slučaj; T je srednje vrijeme podijeljeno s 10. Tablica: duljina, tri vremena, srednja vrijednost, T, T². Nacrtaj T² u ovisnosti o L (može i u FizLabovu alatu za podatke): točke leže na pravcu kroz ishodište s nagibom od oko 4 s²/m.'
      },
      tool: 'stopwatch',
      sim: 'pendulum'
    },

    {
      id: 'weightless-cup',
      topic: 'gravity',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'B.7.2',
      title: { en: 'The cup that stops leaking while it falls', hr: 'Čaša koja u padu prestane curiti' },
      question: {
        en: 'Water pours out of a cup with holes in it. What happens to the jets while the cup is falling?',
        hr: 'Iz čaše s rupicama voda istječe u mlazovima. Što se događa s mlazovima dok čaša pada?'
      },
      materials: {
        en: ['a paper or plastic cup', 'a sharp pencil', 'water', 'a place outdoors or a bathtub', 'a phone that can film in slow motion, if you have one'],
        hr: ['papirnata ili plastična čaša', 'zašiljena olovka', 'voda', 'mjesto na otvorenom ili kada', 'mobitel koji može snimati usporeno, ako ga imaš']
      },
      steps: {
        en: [
          'With the point of the pencil make two holes in the cup, opposite each other and close to the bottom.',
          'Go outdoors or stand in front of the bathtub. Cover the holes with your fingers and fill the cup with water.',
          'Take your fingers off the holes and hold the cup by its rim. Watch the two jets.',
          'Fill the cup again, hold it high above the ground with the jets running, and let it go. Watch the holes while the cup falls, or film the fall in slow motion.',
          'Repeat a few times. Then toss the leaking cup gently upwards: do the jets run while it is on its way up?'
        ],
        hr: [
          'Vrhom olovke probuši na čaši dvije rupice, jednu nasuprot drugoj i blizu dna.',
          'Izađi van ili stani ispred kade. Prstima zatvori rupice i napuni čašu vodom.',
          'Makni prste s rupica i drži čašu za rub. Promatraj dva mlaza.',
          'Ponovno napuni čašu, drži je visoko iznad tla dok mlazovi teku i pusti je. Promatraj rupice dok čaša pada ili pad snimi usporeno.',
          'Ponovi nekoliko puta. Zatim čašu koja curi lagano baci uvis: teku li mlazovi dok se penje?'
        ]
      },
      predict: {
        q: { en: 'While the cup is falling, what happens to the two jets of water?', hr: 'Što se događa s dvama mlazovima vode dok čaša pada?' },
        options: [
          { en: 'They keep running just as before', hr: 'Teku jednako kao i prije' },
          { en: 'They become stronger, because everything is moving downwards', hr: 'Pojačaju se, jer se sve giba prema dolje' },
          { en: 'They stop: no water comes out during the fall', hr: 'Prestanu: tijekom pada voda ne izlazi' }
        ],
        answer: 2
      },
      observe: {
        en: 'As long as you hold the cup, water pours out of both holes. The moment you let go, the jets stop, and the cup and the water fall together until they hit the ground. A slow-motion video shows it clearly. The same happens while the cup is flying upwards after a toss.',
        hr: 'Dok držiš čašu, voda istječe iz obiju rupica. U trenutku kad je pustiš mlazovi prestanu, a čaša i voda padaju zajedno sve do tla. Na usporenoj snimci to se jasno vidi. Isto se događa i dok čaša nakon bacanja leti uvis.'
      },
      explain: {
        en: 'In a cup at rest the water presses on the bottom and on the walls with its weight, and that pressure pushes water out through the holes. In free fall the cup and the water fall with the same acceleration, so the water no longer presses on the cup: it is weightless, and without pressure nothing pushes it out. Gravity has not disappeared. It still pulls on both, which is exactly why they fall. Astronauts on a space station float for the same reason: the station and everything in it are in free fall around the Earth all the time.',
        hr: 'U čaši koja miruje voda svojom težinom pritišće dno i stijenke, a taj tlak istiskuje vodu kroz rupice. U slobodnom padu čaša i voda padaju jednakim ubrzanjem, pa voda više ne pritišće čašu: u bestežinskom je stanju, a bez tlaka ništa je ne gura van. Sila teža nije nestala. Ona i dalje vuče i čašu i vodu, i upravo zato one padaju. Astronauti na svemirskoj postaji lebde iz istog razloga: postaja i sve u njoj neprestano slobodno padaju oko Zemlje.'
      },
      safety: {
        en: 'Do this outdoors or over a bathtub and wipe the floor afterwards: wet floors are slippery.',
        hr: 'Pokus radi vani ili iznad kade i poslije obriši pod: mokar je pod sklizak.'
      },
      sim: 'freefall'
    },

    {
      id: 'freefall-sound-g',
      topic: 'gravity',
      type: 'test',
      level: 3,
      minutes: 30,
      outcome: 'C.8.5',
      title: { en: 'Measure g with the sound of a falling coin', hr: 'Izmjeri g zvukom kovanice koja pada' },
      question: {
        en: 'A fall from a table lasts less than half a second, too short for your thumb on a stopwatch. Can the microphone of a phone time it for you?',
        hr: 'Pad sa stola traje manje od pola sekunde, prekratko za tvoj palac na štoperici. Može li ga umjesto tebe izmjeriti mikrofon mobitela?'
      },
      materials: {
        en: ['a phone with the FizLab sound stopwatch', 'a coin', 'a ruler and a wooden spoon', 'a tape measure', 'a chair, a table and a shelf at about head height', 'a metal baking tray or a pot lid for the coin to land on', 'paper, a pencil and a calculator'],
        hr: ['mobitel s FizLabovom zvučnom štopericom', 'kovanica', 'ravnalo i kuhača', 'mjerna vrpca', 'stolac, stol i polica otprilike u visini glave', 'metalni lim za pečenje ili poklopac lonca na koji će kovanica pasti', 'papir, olovka i kalkulator']
      },
      steps: {
        en: [
          'Put the baking tray on the floor under the edge of the table. Measure the height from the table top down to the tray, in metres.',
          'Lay the phone on the table near the edge and open the sound stopwatch. It starts at the first sharp sound and stops at the second, so the room must be quiet.',
          'Lay the ruler on the table so that 5 cm of it sticks out over the edge, and put the coin on that end. Hold the other end down lightly with a finger.',
          'Hit the end that sticks out sharply sideways with the wooden spoon, so that the ruler is knocked out from under the coin. The knock starts the stopwatch and the landing of the coin stops it.',
          'Write down the time. Collect five good times and work out their mean.',
          'Do the same from the seat of the chair and from the shelf, with the tray moved underneath. Measure each height.',
          'For every height calculate g = 2 · h / t², using the mean time.'
        ],
        hr: [
          'Stavi lim za pečenje na pod ispod ruba stola. Izmjeri visinu od ploče stola do lima, u metrima.',
          'Položi mobitel na stol blizu ruba i otvori zvučnu štopericu. Ona se pokreće na prvi oštar zvuk, a zaustavlja na drugi, pa u sobi mora biti tiho.',
          'Položi ravnalo na stol tako da 5 cm viri preko ruba i na taj kraj stavi kovanicu. Drugi kraj lagano pridrži prstom.',
          'Kuhačom naglo udari sa strane kraj koji viri, tako da ravnalo izbiješ ispod kovanice. Udarac pokreće štopericu, a pad kovanice na lim je zaustavlja.',
          'Zapiši vrijeme. Prikupi pet dobrih vremena i izračunaj njihovu srednju vrijednost.',
          'Isto napravi sa sjedala stolca i s police, s limom premještenim ispod. Izmjeri svaku visinu.',
          'Za svaku visinu izračunaj g = 2 · h / t², uz srednje vrijeme.'
        ]
      },
      predict: {
        q: { en: 'You drop the coin from a height twice as great. How does the time of the fall change?', hr: 'Kovanicu pustiš s dvostruko veće visine. Kako se promijeni vrijeme pada?' },
        options: [
          { en: 'It is twice as long', hr: 'Dvostruko je dulje' },
          { en: 'It is longer, but only about 1.4 times', hr: 'Dulje je, ali samo oko 1,4 puta' },
          { en: 'It stays the same', hr: 'Ostaje isto' }
        ],
        answer: 1
      },
      observe: {
        en: 'From a table 75 cm high the fall takes about 0.39 s, from 45 cm about 0.30 s and from 150 cm about 0.55 s. Twice the height gives only about 1.4 times the time. Your values of g should lie between 9 and 10.5 m/s². If one time is far off, another noise triggered the stopwatch: leave it out.',
        hr: 'Sa stola visokog 75 cm pad traje oko 0,39 s, s 45 cm oko 0,30 s, a sa 150 cm oko 0,55 s. Dvostruka visina daje samo oko 1,4 puta dulje vrijeme. Tvoje vrijednosti za g trebale bi biti između 9 i 10,5 m/s². Ako neko vrijeme jako odstupa, štopericu je pokrenuo neki drugi zvuk: izostavi ga.'
      },
      explain: {
        en: 'A falling coin speeds up all the time: every second its speed grows by about 10 m/s. In the second half of the fall time it therefore covers much more distance than in the first half, and the height grows with the square of the time: h = g·t²/2. Twice the time means four times the height, and twice the height means only √2, about 1.4, times the time. Turned around, the formula gives g = 2h/t². The microphone reacts within thousandths of a second, while your thumb is late by about two tenths of a second, which is half of the whole fall.',
        hr: 'Kovanica koja pada neprestano ubrzava: svake sekunde brzina joj poraste za oko 10 m/s. Zato u drugoj polovici vremena pada prijeđe mnogo veći put nego u prvoj, a visina raste s kvadratom vremena: h = g·t²/2. Dvostruko vrijeme znači četiri puta veću visinu, a dvostruka visina samo √2, oko 1,4 puta dulje vrijeme. Iz iste formule slijedi g = 2h/t². Mikrofon reagira za nekoliko tisućinki sekunde, a tvoj palac kasni oko dvije desetinke, što je polovica cijelog pada.'
      },
      measure: {
        en: 'Change: the height of the fall (three heights). Measure: the time of the fall with the sound stopwatch, five times for each height. Keep the same: the coin, the way you knock the ruler away, a quiet room. Table: height, five times, mean time, g = 2h/t². How far is your mean g from 9.81 m/s²?',
        hr: 'Mijenjaš: visinu pada (tri visine). Mjeriš: vrijeme pada zvučnom štopericom, pet puta za svaku visinu. Ne mijenjaš: kovanicu, način izbijanja ravnala, tišinu u sobi. Tablica: visina, pet vremena, srednje vrijeme, g = 2h/t². Koliko tvoj srednji g odstupa od 9,81 m/s²?'
      },
      tool: 'sensors',
      sim: 'freefall'
    },

    // ───────────────────────────── PRESSURE ─────────────────────────────
    {
      id: 'bottle-crushes-itself',
      topic: 'pressure',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: 'A.7.8',
      title: { en: 'The bottle that crushes itself', hr: 'Boca koja se sama zgužva' },
      question: {
        en: 'Can a plastic bottle be crushed without anyone squeezing it?',
        hr: 'Može li se plastična boca zgužvati, a da je nitko ne stišće?'
      },
      materials: {
        en: ['an empty thin-walled plastic bottle (0.5 to 1.5 L) with a cap', 'hot tap water', 'cold tap water', 'a sink'],
        hr: ['prazna plastična boca tankih stijenki (0,5 do 1,5 L) s čepom', 'vruća voda iz slavine', 'hladna voda iz slavine', 'sudoper']
      },
      steps: {
        en: [
          'Let the hot tap run until the water is as hot as it gets. Fill about a quarter of the bottle, holding it by the neck.',
          'Swirl the hot water around in the bottle for half a minute, so that the air inside warms up, and then pour it out.',
          'Screw the cap on at once, as tightly as you can.',
          'Hold the closed bottle under the cold tap, or simply leave it on the table for a few minutes. Watch and listen.',
          'Unscrew the cap slowly and listen.',
          'Now the other way round: close a cold empty bottle tightly and hold it under the hot tap. Feel how hard it becomes.'
        ],
        hr: [
          'Pusti vruću vodu da teče dok ne postane najtoplija što može biti. Napuni otprilike četvrtinu boce, držeći je za grlo.',
          'Pola minute kružno mućkaj vruću vodu u boci da se zrak u njoj zagrije, a zatim je izlij.',
          'Odmah zavrni čep što čvršće možeš.',
          'Drži zatvorenu bocu pod hladnom vodom ili je jednostavno ostavi nekoliko minuta na stolu. Gledaj i slušaj.',
          'Polako odvrni čep i slušaj.',
          'Sad obrnuto: čvrsto zatvori hladnu praznu bocu i drži je pod vrućom vodom. Opipaj kako postaje tvrda.'
        ]
      },
      predict: {
        q: { en: 'You close a bottle full of warm air and cool it down. What happens to the bottle?', hr: 'Zatvoriš bocu punu toplog zraka i ohladiš je. Što se dogodi s bocom?' },
        options: [
          { en: 'Its walls cave in', hr: 'Stijenke joj se uvuku' },
          { en: 'It swells up', hr: 'Napuhne se' },
          { en: 'Nothing: it is closed, so nothing can change', hr: 'Ništa: zatvorena je, pa se ništa ne može promijeniti' }
        ],
        answer: 0
      },
      observe: {
        en: 'Within half a minute the walls of the bottle buckle inwards with a crackling sound, as if an invisible hand were squeezing it. When you unscrew the cap, air hisses in and the bottle springs back into shape. The cold bottle under hot water becomes hard and tight.',
        hr: 'Za pola minute stijenke boce uvuku se uz pucketanje, kao da je stišće nevidljiva ruka. Kad odvrneš čep, zrak uz šištanje uđe i boca se vrati u svoj oblik. Hladna boca pod vrućom vodom postane tvrda i napeta.'
      },
      explain: {
        en: 'The particles of warm air move fast and hit the walls hard. After you close the bottle and cool it, the particles inside slow down and hit the walls more weakly, and some of the water vapour turns back into droplets, so the pressure inside drops. Nothing inside pulls the walls in. It is the outside air, pressing with about 10 N on every square centimetre, that pushes them in until the pressures are equal again. What we call suction is always a larger pressure pushing from the other side.',
        hr: 'Čestice toplog zraka gibaju se brzo i snažno udaraju o stijenke. Kad bocu zatvoriš i ohladiš, čestice u njoj uspore i slabije udaraju o stijenke, a dio vodene pare ponovno se pretvori u kapljice, pa tlak u boci padne. Ništa iznutra ne vuče stijenke. Vanjski zrak, koji na svaki kvadratni centimetar pritišće silom od oko 10 N, gura ih unutra dok se tlakovi ponovno ne izjednače. Ono što zovemo usisavanjem uvijek je veći tlak koji gura s druge strane.'
      },
      safety: {
        en: 'Use hot tap water only, never boiling water. Hold the bottle by the neck and keep your hand out of the hot stream.',
        hr: 'Koristi samo vruću vodu iz slavine, nikad kipuću. Drži bocu za grlo i pazi da ti ruka ne dođe pod vrući mlaz.'
      },
      sim: 'gas'
    },

    {
      id: 'jar-balloon-barometer',
      topic: 'pressure',
      type: 'project',
      level: 3,
      minutes: 40,
      outcome: 'B.7.5',
      title: { en: 'A barometer from a jar and a balloon', hr: 'Barometar od staklenke i balona' },
      question: {
        en: 'Air pressure changes from day to day. Can a jar with a balloon lid show whether it is rising or falling?',
        hr: 'Tlak zraka mijenja se iz dana u dan. Može li staklenka s poklopcem od balona pokazati raste li ili pada?'
      },
      materials: {
        en: ['a wide glass jar', 'a balloon', 'a strong rubber band', 'a drinking straw', 'sticky tape', 'scissors', 'a sheet of card and a pencil', 'the air pressure from a weather report'],
        hr: ['široka staklenka', 'balon', 'jaka gumica', 'slamka', 'selotejp', 'škare', 'list kartona i olovka', 'podatak o tlaku zraka iz vremenske prognoze']
      },
      steps: {
        en: [
          'Cut the neck off the balloon and stretch the rest tightly over the mouth of the jar, like the skin of a drum. Fasten it with the rubber band so that no air can leak.',
          'Tape one end of the straw to the middle of the balloon skin. The straw should lie flat and stick out well beyond the rim of the jar: it is your pointer.',
          'Stand the jar next to a wall in a place with a steady temperature, away from the sun, radiators and windows. Fix the card to the wall behind the tip of the pointer.',
          'Mark where the tip points today. Write the date and the air pressure from the weather report next to the mark.',
          'Make a new mark at the same time every day for a week, always with the date and the reported pressure.',
          'Test your barometer: on the days with the highest reported pressure, was the tip up or down? Finally warm the jar with your hands for a minute and watch the pointer.'
        ],
        hr: [
          'Odreži grlo balona, a ostatak čvrsto napni preko otvora staklenke, kao kožu na bubnju. Učvrsti ga gumicom tako da zrak nigdje ne može izlaziti.',
          'Jedan kraj slamke zalijepi selotejpom na sredinu napetog balona. Slamka treba ležati vodoravno i viriti daleko preko ruba staklenke: to je tvoja kazaljka.',
          'Postavi staklenku uza zid, na mjesto sa stalnom temperaturom, daleko od sunca, radijatora i prozora. Iza vrha kazaljke pričvrsti karton na zid.',
          'Označi kamo vrh danas pokazuje. Uz oznaku napiši datum i tlak zraka iz vremenske prognoze.',
          'Tjedan dana svaki dan u isto vrijeme napravi novu oznaku, uvijek s datumom i tlakom iz prognoze.',
          'Provjeri svoj barometar: je li u dane s najvišim tlakom iz prognoze vrh bio gore ili dolje? Na kraju minutu grij staklenku dlanovima i promatraj kazaljku.'
        ]
      },
      predict: {
        q: { en: 'The air pressure outside rises. What does the tip of the pointer do?', hr: 'Tlak zraka vani poraste. Što učini vrh kazaljke?' },
        options: [
          { en: 'It moves up', hr: 'Pomakne se prema gore' },
          { en: 'It moves down, pushed by the heavier air', hr: 'Pomakne se prema dolje jer ga gura teži zrak' },
          { en: 'It does not move: the jar is sealed', hr: 'Ne pomakne se: staklenka je zatvorena' }
        ],
        answer: 0
      },
      observe: {
        en: 'From day to day the tip moves by a few millimetres: up when the pressure rises and down when it falls. The movement is small, so a long straw helps. Warm hands make the pointer drop quickly, which shows why the jar must stay at a steady temperature. If the pointer creeps in one direction all week, the seal is leaking.',
        hr: 'Iz dana u dan vrh se pomiče za nekoliko milimetara: gore kad tlak raste, a dolje kad pada. Pomak je malen, pa pomaže dulja slamka. Topli dlanovi brzo spuste kazaljku, što pokazuje zašto staklenka mora biti na stalnoj temperaturi. Ako kazaljka cijeli tjedan polako klizi u jednom smjeru, balon negdje propušta zrak.'
      },
      explain: {
        en: 'When you sealed the jar you trapped air at the pressure of that day. If the pressure outside rises, the outside air pushes the balloon skin a little way into the jar, until the trapped air is squeezed to the same pressure. The middle of the skin sinks and, like a seesaw resting on the rim of the jar, the free end of the straw rises. When the outside pressure falls, the trapped air pushes the skin outwards and the pointer drops. Rising pressure usually brings settled, clear weather, and falling pressure brings clouds and rain. Warm air in the jar expands, so temperature can fool your barometer.',
        hr: 'Kad si zatvorio staklenku, u njoj si zarobio zrak pri tlaku toga dana. Ako vanjski tlak poraste, vanjski zrak malo utisne balon u staklenku, sve dok se zarobljeni zrak ne stlači na isti tlak. Sredina balona se spusti, a slobodni kraj slamke podigne se, kao klackalica oslonjena na rub staklenke. Kad vanjski tlak padne, zarobljeni zrak izboči balon i kazaljka se spusti. Porast tlaka obično donosi stabilno i vedro vrijeme, a pad tlaka oblake i kišu. Topli zrak u staklenci širi se, pa temperatura može prevariti tvoj barometar.'
      },
      sim: 'hydraulics'
    },

    {
      id: 'straw-finger-water',
      topic: 'pressure',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'B.7.5',
      title: { en: 'Water held in a straw by one finger', hr: 'Voda koju u slamci drži jedan prst' },
      question: {
        en: 'What keeps the water inside a straw when you lift it out of the glass with a finger on top?',
        hr: 'Što zadržava vodu u slamci kad je izvadiš iz čaše s prstom na vrhu?'
      },
      materials: {
        en: ['a clear drinking straw', 'a glass of water', 'an empty glass', 'a few drops of juice or food colouring, so that the water is easier to see'],
        hr: ['prozirna slamka', 'čaša vode', 'prazna čaša', 'nekoliko kapi soka ili jestive boje, da se voda bolje vidi']
      },
      steps: {
        en: [
          'Dip the straw into the water, open at both ends. Compare the water level inside the straw with the level outside.',
          'Press a finger firmly on the top end and lift the straw out of the water. Does the water run out?',
          'Hold the straw over the empty glass and lift your finger.',
          'Carry water from the full glass to the empty one in this way, ten straws full.',
          'Now put your finger on top first and only then push the straw into the water. How much water gets in?',
          'Fill the straw once more and lift your finger just a little, for a moment. Can you let the water out one drop at a time?'
        ],
        hr: [
          'Uroni slamku u vodu, otvorenu na oba kraja. Usporedi razinu vode u slamci s razinom izvan nje.',
          'Čvrsto pritisni prst na gornji kraj i izvadi slamku iz vode. Istječe li voda?',
          'Drži slamku iznad prazne čaše i podigni prst.',
          'Na taj način prenesi vodu iz pune čaše u praznu, deset punih slamki.',
          'Sad najprije stavi prst na vrh, a tek onda gurni slamku u vodu. Koliko vode uđe?',
          'Još jednom napuni slamku i samo malo, na trenutak, odmakni prst. Možeš li ispuštati vodu kap po kap?'
        ]
      },
      predict: {
        q: { en: 'You lift the straw out with your finger closing the top end. What does the water in it do?', hr: 'Izvadiš slamku držeći prst na gornjem kraju. Što učini voda u njoj?' },
        options: [
          { en: 'It all runs out, because nothing holds it from below', hr: 'Sva isteče, jer je ništa ne drži odozdo' },
          { en: 'It stays in the straw', hr: 'Ostane u slamci' },
          { en: 'About half of it runs out', hr: 'Otprilike polovica isteče' }
        ],
        answer: 1
      },
      observe: {
        en: 'With your finger on top the water stays in the straw although the bottom end is open; at most one drop falls. The moment you lift the finger, all the water runs out. If you close the top first, almost no water enters the straw.',
        hr: 'S prstom na vrhu voda ostaje u slamci iako je donji kraj otvoren; padne najviše jedna kap. Čim podigneš prst, sva voda isteče. Ako najprije zatvoriš vrh, u slamku gotovo uopće ne uđe voda.'
      },
      explain: {
        en: 'The water is not held by your finger and it is not sucked up: it is pushed up by the air below. The atmosphere presses on the open bottom end with about 10 N on every square centimetre. With the top closed, as soon as the water slips down by a hair, the small pocket of air under your finger expands and its pressure falls a little below the pressure outside. That small difference is enough to carry the weight of the water. Lift the finger, and the air presses equally from above and from below, so gravity wins. A medicine dropper and a laboratory pipette work in the same way.',
        hr: 'Vodu ne drži tvoj prst niti je išta usisava: gura je zrak odozdo. Atmosfera pritišće otvoreni donji kraj silom od oko 10 N na svaki kvadratni centimetar. Kad je vrh zatvoren, čim voda sklizne za dlaku, mali džep zraka ispod prsta raširi se i tlak mu padne malo ispod vanjskog tlaka. Ta je mala razlika dovoljna da nosi težinu vode. Podigneš li prst, zrak pritišće jednako odozgo i odozdo, pa pobjeđuje sila teža. Kapaljka i laboratorijska pipeta rade na isti način.'
      },
      sim: 'hydraulics'
    },

    {
      id: 'balloon-bed-of-pins',
      topic: 'pressure',
      type: 'observe',
      level: 2,
      minutes: 15,
      outcome: 'B.7.5',
      title: { en: 'A balloon on a bed of pins', hr: 'Balon na ležaju od čavlića' },
      question: {
        en: 'One drawing pin pops a balloon at once. What happens when you press the balloon onto fifty pins at the same time?',
        hr: 'Jedan čavlić odmah probuši balon. Što se dogodi kad balon pritisneš na pedeset čavlića odjednom?'
      },
      materials: {
        en: ['2 or 3 balloons', 'about 50 identical drawing pins with flat heads', 'a tray or a large hardcover book as a base', 'a second book to press with'],
        hr: ['2 ili 3 balona', 'oko 50 jednakih čavlića za ploču s plosnatom glavom', 'pladanj ili velika knjiga tvrdih korica kao podloga', 'druga knjiga za pritiskanje']
      },
      steps: {
        en: [
          'Blow up two balloons to a medium size, not too tight, and tie them.',
          'Put one drawing pin on the base, point up. Lay a balloon on it and press down slowly with the book. Notice how small a force is enough to pop it.',
          'Arrange about 50 pins point up in a tight block, head against head, for example 5 rows of 10. All the points must be at the same height.',
          'Lay the second balloon on the bed of pins and press straight down with the book, slowly and without sliding it sideways.',
          'Press harder and compare with the force that popped the first balloon.',
          'Take away half of the pins, then half again. With how few pins does the balloon still survive the same force?'
        ],
        hr: [
          'Napuhni dva balona do srednje veličine, ne prenapeto, i zaveži ih.',
          'Stavi jedan čavlić na podlogu, šiljkom prema gore. Položi balon na njega i polako pritišći knjigom. Uoči kako je mala sila dovoljna da balon pukne.',
          'Složi oko 50 čavlića šiljkom prema gore u zbijen blok, glavu uz glavu, na primjer 5 redova po 10. Svi šiljci moraju biti na istoj visini.',
          'Položi drugi balon na ležaj od čavlića i pritišći knjigom ravno dolje, polako i bez pomicanja u stranu.',
          'Pritisni jače i usporedi sa silom pri kojoj je puknuo prvi balon.',
          'Makni polovicu čavlića, pa još jednu polovicu. Uz koliko malo čavlića balon još izdrži istu silu?'
        ]
      },
      predict: {
        q: { en: 'You press the balloon onto 50 pins instead of one. What happens?', hr: 'Balon pritisneš na 50 čavlića umjesto na jedan. Što se dogodi?' },
        options: [
          { en: 'It pops even sooner: fifty points are worse than one', hr: 'Pukne još prije: pedeset šiljaka gore je od jednoga' },
          { en: 'It pops just as easily as before', hr: 'Pukne jednako lako kao i prije' },
          { en: 'It survives a much stronger push', hr: 'Izdrži mnogo jače pritiskanje' }
        ],
        answer: 2
      },
      observe: {
        en: 'On a single pin the balloon bursts after a light push. On the bed of pins you can lean on the book quite hard: the balloon flattens and small dimples appear, but it does not burst. If one pin stands higher than the others, it can still pop the balloon, so check that they are all level.',
        hr: 'Na jednom čavliću balon pukne već nakon laganog pritiskanja. Na ležaju od čavlića možeš se na knjigu prilično jako nasloniti: balon se spljošti i na njemu se pojave male udubine, ali ne pukne. Ako jedan čavlić strši više od ostalih, i dalje može probušiti balon, zato provjeri jesu li svi u ravnini.'
      },
      explain: {
        en: 'What breaks the rubber is not the force alone but the pressure: the force divided by the area it acts on, p = F/A. The point of a pin has a tiny area, so even a small force gives an enormous pressure. On fifty pins the same push is shared among fifty points. Each point gets only one fiftieth of the force, so the pressure under it is fifty times smaller, too small to pierce the rubber. The same idea explains why snowshoes keep you from sinking into snow and why a knife has to be sharp to cut well.',
        hr: 'Gumu ne probija sama sila, nego tlak: sila podijeljena površinom na koju djeluje, p = F/A. Šiljak čavlića ima sićušnu površinu, pa već mala sila daje golem tlak. Na pedeset čavlića ista se sila raspodijeli na pedeset šiljaka. Svaki šiljak dobije samo pedeseti dio sile, pa je tlak pod njim pedeset puta manji, premalen da probije gumu. Ista ideja objašnjava zašto krplje ne daju da propadneš u snijeg i zašto nož mora biti oštar da bi dobro rezao.'
      },
      safety: {
        en: 'The bang is loud: keep the balloon away from your face and warn the others in the room. Drawing pins are sharp, so count them before and after and never leave one on the floor.',
        hr: 'Prasak je glasan: drži balon dalje od lica i upozori ostale u sobi. Čavlići su oštri, zato ih prebroji prije i poslije i nijedan ne ostavljaj na podu.'
      },
      sim: 'pressure'
    },

    // ───────────────────────────── LEVERS ─────────────────────────────
    {
      id: 'ruler-balance-weigh',
      topic: 'levers',
      type: 'test',
      level: 3,
      minutes: 30,
      outcome: 'B.7.4',
      title: { en: 'Weigh a small object with a ruler and coins', hr: 'Izvaži mali predmet ravnalom i kovanicama' },
      question: {
        en: 'You have no scale, only a ruler, a pencil and a few coins. Can you find the mass of an eraser almost as well as a kitchen scale does?',
        hr: 'Nemaš vagu, nego samo ravnalo, olovku i nekoliko kovanica. Možeš li odrediti masu gumice za brisanje gotovo jednako dobro kao kuhinjska vaga?'
      },
      materials: {
        en: ['a 30 cm ruler', 'a pencil with flat sides', 'sticky tape', 'three 1 euro coins (7.5 g each)', 'a small object of 10 to 30 g: an eraser, a key or a glue stick', 'a kitchen scale for checking at the end', 'paper and a calculator'],
        hr: ['ravnalo od 30 cm', 'olovka s bridovima', 'selotejp', 'tri kovanice od 1 eura (svaka ima 7,5 g)', 'mali predmet mase 10 do 30 g: gumica za brisanje, ključ ili ljepilo u stiku', 'kuhinjska vaga za provjeru na kraju', 'papir i kalkulator']
      },
      steps: {
        en: [
          'Tape the pencil to the table and balance the empty ruler across it. Note the mark at which it balances, close to 15 cm: this is the fulcrum, and the ruler stays there for all measurements.',
          'Put the object on the ruler with its middle exactly 5 cm from the fulcrum.',
          'On the other side slide one coin until the ruler balances. Read the distance from the fulcrum to the middle of the coin. If even the end of the ruler is not far enough, move the object to 3 cm and start again.',
          'Calculate: mass of the object = mass of the coins × distance of the coins / distance of the object.',
          'Repeat with two coins stacked and then with three. They balance at other distances, so you get three separate results.',
          'Work out the mean of the three results and check it on the kitchen scale.'
        ],
        hr: [
          'Zalijepi olovku za stol i preko nje uravnoteži prazno ravnalo. Zapamti oznaku na kojoj je u ravnoteži, blizu 15 cm: to je oslonac, i ravnalo ondje ostaje tijekom svih mjerenja.',
          'Stavi predmet na ravnalo tako da mu je sredina točno 5 cm od oslonca.',
          'Na drugoj strani pomiči jednu kovanicu dok ravnalo ne bude u ravnoteži. Očitaj udaljenost od oslonca do sredine kovanice. Ako ni kraj ravnala nije dovoljno daleko, premjesti predmet na 3 cm i počni iznova.',
          'Izračunaj: masa predmeta = masa kovanica × udaljenost kovanica / udaljenost predmeta.',
          'Ponovi s dvije kovanice složene jedna na drugu, a zatim s tri. One su u ravnoteži na drugim udaljenostima, pa dobivaš tri zasebna rezultata.',
          'Izračunaj srednju vrijednost triju rezultata i provjeri je kuhinjskom vagom.'
        ]
      },
      predict: {
        q: { en: 'A 7.5 g coin 12 cm from the fulcrum balances an eraser 4 cm from the fulcrum. What is the mass of the eraser?', hr: 'Kovanica od 7,5 g udaljena 12 cm od oslonca uravnotežuje gumicu udaljenu 4 cm od oslonca. Kolika je masa gumice?' },
        options: [
          { en: '7.5 g: balance means equal masses', hr: '7,5 g: ravnoteža znači jednake mase' },
          { en: '22.5 g', hr: '22,5 g' },
          { en: '2.5 g', hr: '2,5 g' }
        ],
        answer: 1
      },
      observe: {
        en: 'The lighter side has to sit farther out. One coin balances far from the fulcrum, two coins at half that distance and three at a third of it. All three calculations give nearly the same mass, usually within a gram or two of what the kitchen scale shows.',
        hr: 'Lakša strana mora biti dalje od oslonca. Jedna je kovanica u ravnoteži daleko od oslonca, dvije na polovici te udaljenosti, a tri na trećini. Sva tri računa daju gotovo istu masu, obično unutar grama ili dva od onoga što pokaže kuhinjska vaga.'
      },
      explain: {
        en: 'A lever is balanced when force times arm is the same on both sides. Weight is proportional to mass, so you can write mass × distance on one side equals mass × distance on the other, and the only unknown is the mass of the object. A balanced lever therefore does not mean equal masses: it means equal products. The closer the object is to the fulcrum, the farther out the coin has to go. Balancing the empty ruler first takes the weight of the ruler itself out of the calculation. Old market scales with a sliding weight work in exactly this way.',
        hr: 'Poluga je u ravnoteži kad je umnožak sile i kraka jednak na obje strane. Težina je razmjerna masi, pa možeš pisati da je masa × udaljenost na jednoj strani jednako masa × udaljenost na drugoj, a jedina je nepoznanica masa predmeta. Poluga u ravnoteži zato ne znači jednake mase, nego jednake umnoške. Što je predmet bliže osloncu, to kovanica mora biti dalje. Time što najprije uravnotežiš prazno ravnalo, iz računa izbacuješ težinu samog ravnala. Stare tržne vage s pomičnim utegom, kantari, rade upravo tako.'
      },
      measure: {
        en: 'Change: the number of coins (1, 2, 3). Measure: the distance from the fulcrum to the middle of the coins when the ruler balances. Keep the same: the object, its distance from the fulcrum, the position of the ruler on the pencil. Table: number of coins, their mass, their distance, calculated mass of the object. Work out the mean and compare it with the kitchen scale.',
        hr: 'Mijenjaš: broj kovanica (1, 2, 3). Mjeriš: udaljenost od oslonca do sredine kovanica kad je ravnalo u ravnoteži. Ne mijenjaš: predmet, njegovu udaljenost od oslonca, položaj ravnala na olovci. Tablica: broj kovanica, njihova masa, njihova udaljenost, izračunana masa predmeta. Izračunaj srednju vrijednost i usporedi je s kuhinjskom vagom.'
      },
      sim: 'lever'
    },

    {
      id: 'broomstick-pulley',
      topic: 'levers',
      type: 'observe',
      level: 2,
      minutes: 15,
      outcome: 'B.7.4',
      title: { en: 'Stronger than two friends: broomsticks and a rope', hr: 'Jači od dvoje prijatelja: metle i uže' },
      question: {
        en: 'Can one pupil pull two others together, although they resist with all their strength?',
        hr: 'Može li jedan učenik privući dvoje drugih jedno drugome, iako se oni opiru svom snagom?'
      },
      materials: {
        en: ['two broomsticks (or two long, smooth sticks)', 'about 5 m of smooth, strong rope, for example a washing line', 'two helpers', 'some free space'],
        hr: ['dvije drške od metle (ili dva duga, glatka štapa)', 'oko 5 m glatkog i čvrstog užeta, na primjer konop za rublje', 'dvoje pomoćnika', 'malo slobodnog prostora']
      },
      steps: {
        en: [
          'The two helpers stand facing each other, about a metre apart. Each holds a broomstick level in front of the body with both hands wide apart.',
          'Tie one end of the rope to one of the sticks. Wind the rope back and forth around both sticks, between the hands of the helpers, until four strands run between the sticks.',
          'The helpers try to keep the sticks apart. You pull the free end of the rope, steadily and without jerking.',
          'Notice how much rope runs through your hands while the sticks move only a little.',
          'Repeat with the rope wound round only once, so that just two strands run between the sticks, and compare.',
          'Swap roles, so that everybody feels both sides.'
        ],
        hr: [
          'Dvoje pomoćnika stane jedno nasuprot drugome, na udaljenosti od oko jednog metra. Svatko drži dršku vodoravno ispred tijela, s rukama široko razmaknutima.',
          'Zaveži jedan kraj užeta za jednu dršku. Namotaj uže naprijed-natrag oko obiju drški, između ruku pomoćnika, sve dok između drški ne budu četiri dijela užeta.',
          'Pomoćnici pokušavaju držati drške razmaknute. Ti vuci slobodni kraj užeta, ravnomjerno i bez trzanja.',
          'Uoči koliko ti užeta prođe kroz ruke dok se drške pomaknu tek malo.',
          'Ponovi s užetom namotanim samo jednom, tako da su između drški samo dva dijela užeta, pa usporedi.',
          'Zamijenite uloge, da svatko osjeti obje strane.'
        ]
      },
      predict: {
        q: { en: 'Two helpers push the sticks apart with all their strength and you pull the free end. Who wins?', hr: 'Dvoje pomoćnika svom snagom razmiče drške, a ti vučeš slobodni kraj užeta. Tko pobjeđuje?' },
        options: [
          { en: 'The helpers: two are stronger than one', hr: 'Pomoćnici: dvoje je jače od jednoga' },
          { en: 'You: the sticks come together', hr: 'Ti: drške se približe' },
          { en: 'Nobody: the forces cancel and nothing moves', hr: 'Nitko: sile se poništavaju i ništa se ne miče' }
        ],
        answer: 1
      },
      observe: {
        en: 'You pull the sticks together quite easily, however hard the helpers resist. But you have to pull a lot of rope: with four strands about four times as much as the distance the sticks move. With the rope wound round only once it is much harder.',
        hr: 'Drške privučeš prilično lako, koliko god se pomoćnici opirali. Ali moraš povući mnogo užeta: uz četiri dijela užeta oko četiri puta više nego što se drške pomaknu. S užetom namotanim samo jednom mnogo je teže.'
      },
      explain: {
        en: 'The sticks and the rope work like a set of pulleys. The same tension runs along the whole rope, and every strand between the sticks pulls them together with that force. With four strands your pull acts four times over, minus what the friction between rope and wood takes away. Nothing comes for free, though: to bring the sticks 10 cm closer you have to pull about 40 cm of rope. You gain force and lose distance, and the work stays the same. This is the golden rule of mechanics, and cranes and sailing boats use it every day.',
        hr: 'Drške i uže djeluju kao koloturnik. Duž cijelog užeta napetost je jednaka i svaki dio užeta između drški privlači ih tom silom. Uz četiri dijela užeta tvoja sila djeluje četiri puta, umanjeno za ono što odnese trenje između užeta i drveta. Ipak, ništa nije besplatno: da drške približiš za 10 cm, moraš povući oko 40 cm užeta. Dobivaš na sili, a gubiš na putu, dok rad ostaje isti. To je zlatno pravilo mehanike, a dizalice i jedrilice njime se služe svaki dan.'
      },
      safety: {
        en: 'Pull steadily, never with a jerk, and warn the helpers before you start. Nobody may put fingers between the sticks or wrap the rope around a hand.',
        hr: 'Vuci ravnomjerno, nikad naglo, i upozori pomoćnike prije nego što počneš. Nitko ne smije stavljati prste između drški ni omatati uže oko šake.'
      },
      sim: 'pulleys'
    },

    {
      id: 'straw-mobile',
      topic: 'levers',
      type: 'project',
      level: 2,
      minutes: 45,
      outcome: 'B.7.4',
      title: { en: 'A balanced mobile from straws and thread', hr: 'Uravnoteženi mobil od slamki i konca' },
      question: {
        en: 'How do you hang light and heavy shapes on the same bar so that it stays perfectly level?',
        hr: 'Kako na istu prečku objesiti lagane i teške oblike, a da ona ostane savršeno vodoravna?'
      },
      materials: {
        en: ['3 drinking straws or thin wooden skewers', 'thread', 'scissors', 'card and coloured pens for the shapes', 'about 10 identical paper clips', 'sticky tape', 'a place to hang the mobile, for example a door frame'],
        hr: ['3 slamke ili tanka drvena štapića', 'konac', 'škare', 'karton i flomasteri za oblike', 'oko 10 jednakih spajalica', 'selotejp', 'mjesto za vješanje mobila, na primjer dovratak']
      },
      steps: {
        en: [
          'Cut three small shapes out of card. Fasten 1 paper clip to the first, 2 to the second and 3 to the third, and tie about 15 cm of thread to each shape.',
          'Start at the bottom. Hang the shape with 1 clip on one end of a straw and the shape with 2 clips on the other end, and fix the threads with tape.',
          'Tie a loop of thread around this straw. Hold the straw by the loop and slide the loop along until the straw hangs level. Fix the loop with a dot of tape.',
          'Hang this whole bar from one end of the second straw and the shape with 3 clips from its other end.',
          'Find the balance point of the upper straw in the same way and hang the mobile from the door frame.',
          'Test it: blow at it gently. A mobile that is built well turns and swings, but always comes back to level. Add a third storey if you like.'
        ],
        hr: [
          'Izreži iz kartona tri mala oblika. Na prvi pričvrsti 1 spajalicu, na drugi 2, a na treći 3 te za svaki oblik zaveži oko 15 cm konca.',
          'Počni odozdo. Oblik s 1 spajalicom objesi na jedan kraj slamke, a oblik s 2 spajalice na drugi kraj i učvrsti konce selotejpom.',
          'Oko te slamke zaveži omču od konca. Drži slamku za omču i pomiči je dok slamka ne stane vodoravno. Učvrsti omču komadićem selotejpa.',
          'Cijelu tu prečku objesi na jedan kraj druge slamke, a na njezin drugi kraj oblik s 3 spajalice.',
          'Na isti način pronađi točku ravnoteže gornje slamke i objesi mobil na dovratak.',
          'Provjeri ga: lagano puhni u njega. Dobro napravljen mobil okreće se i njiše, ali se uvijek vrati u vodoravan položaj. Ako želiš, dodaj i treći kat.'
        ]
      },
      predict: {
        q: { en: 'One clip hangs from the left end of a straw and two clips from the right end. Where must the thread be tied so that the straw hangs level?', hr: 'Na lijevom kraju slamke visi jedna spajalica, a na desnom dvije. Gdje mora biti zavezan konac da slamka visi vodoravno?' },
        options: [
          { en: 'Exactly in the middle', hr: 'Točno u sredini' },
          { en: 'Closer to the single clip', hr: 'Bliže jednoj spajalici' },
          { en: 'Closer to the two clips', hr: 'Bliže dvjema spajalicama' }
        ],
        answer: 2
      },
      observe: {
        en: 'The lower straw hangs level only when the loop is about one third of the way from the heavier end: twice the weight needs half the arm. The upper straw balances close to its middle, because the whole lower bar with its three clips hangs on one side and the shape with three clips on the other.',
        hr: 'Donja slamka visi vodoravno tek kad je omča na otprilike trećini duljine od težeg kraja: dvostruka težina traži upola kraći krak. Gornja je slamka u ravnoteži blizu svoje sredine jer na jednoj strani visi cijela donja prečka s tri spajalice, a na drugoj oblik s tri spajalice.'
      },
      explain: {
        en: 'Every straw is a lever, and the thread it hangs from is its fulcrum. The straw is level when weight times distance from the thread is the same on both sides, so the heavier shape must hang closer to the thread. For the upper straw it does not matter how the lower bar is arranged: everything that hangs from one point pulls there with its whole weight. That is why a mobile is built from the bottom up. Once a lower bar is balanced, you can treat it as one single weight.',
        hr: 'Svaka je slamka poluga, a konac o koji visi njezin je oslonac. Slamka je vodoravna kad je umnožak težine i udaljenosti od konca jednak na obje strane, pa teži oblik mora visjeti bliže koncu. Za gornju slamku nije važno kako je složena donja prečka: sve što visi o jednoj točki vuče ondje svojom ukupnom težinom. Zato se mobil gradi odozdo prema gore. Kad je donja prečka jednom u ravnoteži, možeš je promatrati kao jedan jedini uteg.'
      },
      sim: 'lever'
    },

    // ───────────────────────────── ENERGY ─────────────────────────────
    {
      id: 'ball-bounce-height',
      topic: 'energy',
      type: 'test',
      level: 2,
      minutes: 30,
      outcome: 'D.7.6',
      title: { en: 'How high does a dropped ball bounce?', hr: 'Koliko visoko odskoči ispuštena loptica?' },
      question: {
        en: 'A ball dropped from a greater height bounces higher. Does it ever get back to where it started, and what share of its energy does it keep?',
        hr: 'Loptica ispuštena s veće visine odskoči više. Vrati li se ikad onamo odakle je krenula i koliki dio energije zadrži?'
      },
      materials: {
        en: ['a tennis ball or another bouncy ball', 'a tape measure', 'sticky tape', 'a wall and a hard floor', 'a helper or a phone that films in slow motion', 'a carpet or a doormat', 'paper and a pencil'],
        hr: ['teniska loptica ili neka druga skočna loptica', 'mjerna vrpca', 'selotejp', 'zid i tvrd pod', 'pomoćnik ili mobitel koji snima usporeno', 'tepih ili otirač', 'papir i olovka']
      },
      steps: {
        en: [
          'Tape the tape measure upright to the wall, with its zero on the floor.',
          'Hold the ball with its lowest point at the 50 cm mark and let it go without throwing it. The helper watches with eyes at the height of the bounce and reads the highest point reached by the bottom of the ball. A slow-motion video works even better.',
          'Repeat three times and work out the mean.',
          'Do the same from 100 cm and from 150 cm.',
          'For each drop height calculate the ratio: bounce height divided by drop height.',
          'Change the floor: drop the ball from 100 cm onto the carpet, three times, and compare.'
        ],
        hr: [
          'Zalijepi mjernu vrpcu okomito na zid, s nulom na podu.',
          'Drži lopticu tako da joj je najniža točka na oznaci 50 cm i pusti je bez bacanja. Pomoćnik gleda s očima u visini odskoka i očitava najvišu točku do koje dođe dno loptice. Još je bolja usporena snimka.',
          'Ponovi tri puta i izračunaj srednju vrijednost.',
          'Isto napravi sa 100 cm i sa 150 cm.',
          'Za svaku početnu visinu izračunaj omjer: visinu odskoka podijeli početnom visinom.',
          'Promijeni podlogu: pusti lopticu sa 100 cm na tepih, tri puta, pa usporedi.'
        ]
      },
      predict: {
        q: { en: 'Dropped from 50 cm, your ball bounces back to 30 cm. How high will it bounce from 100 cm?', hr: 'Ispuštena s 50 cm, tvoja loptica odskoči do 30 cm. Koliko će visoko odskočiti sa 100 cm?' },
        options: [
          { en: 'To about 60 cm: the same share as before', hr: 'Do oko 60 cm: isti udio kao i prije' },
          { en: 'To about 80 cm: it loses the same 20 cm', hr: 'Do oko 80 cm: izgubi istih 20 cm' },
          { en: 'Back to 100 cm: the extra height gives it enough energy', hr: 'Natrag do 100 cm: veća visina daje joj dovoljno energije' }
        ],
        answer: 0
      },
      observe: {
        en: 'The ball never returns to the height from which it started. A tennis ball comes back to a little more than half of the drop height, a rubber bouncy ball to about four fifths. The ratio of bounce height to drop height is nearly the same for all three heights. On the carpet the bounce is clearly lower.',
        hr: 'Loptica se nikad ne vrati na visinu s koje je krenula. Teniska loptica vrati se na nešto više od polovice početne visine, a gumena skočna loptica na oko četiri petine. Omjer visine odskoka i početne visine gotovo je jednak za sve tri visine. Na tepihu je odskok jasno niži.'
      },
      explain: {
        en: 'At the top the ball has gravitational potential energy, which depends on height. During the fall this turns into kinetic energy. On the floor the ball is squashed for an instant and the energy is stored as elastic energy, which then turns back into motion and height. At every bounce a part of the energy is converted into internal energy, because the ball and the floor warm up a little, and into sound, so the ball cannot reach its starting height. Since potential energy is proportional to height, the ratio of the heights tells you what share of the energy the ball kept. The energy is not lost: it has only changed into forms that cannot lift the ball.',
        hr: 'Na vrhu loptica ima gravitacijsku potencijalnu energiju, koja ovisi o visini. Tijekom pada ona se pretvara u kinetičku energiju. Na podu se loptica na trenutak spljošti i energija se pohrani kao elastična energija, koja se zatim ponovno pretvara u gibanje i visinu. Pri svakom odskoku dio energije prijeđe u unutarnju energiju, jer se loptica i pod malo zagriju, i u zvuk, pa loptica ne može dosegnuti početnu visinu. Budući da je potencijalna energija razmjerna visini, omjer visina govori koliki je dio energije loptica zadržala. Energija nije izgubljena: samo je prešla u oblike koji lopticu ne mogu podići.'
      },
      measure: {
        en: 'Change: the drop height (50, 100, 150 cm). Measure: the bounce height, three times for each, reading the bottom of the ball. Keep the same: the ball, the floor, letting go without a push. Table: drop height, three bounce heights, mean, ratio. Plot bounce height against drop height (the FizLab data tool draws the best-fit line): the slope is the share of energy the ball keeps.',
        hr: 'Mijenjaš: početnu visinu (50, 100, 150 cm). Mjeriš: visinu odskoka, tri puta za svaku, očitavajući dno loptice. Ne mijenjaš: lopticu, podlogu, puštanje bez guranja. Tablica: početna visina, tri visine odskoka, srednja vrijednost, omjer. Nacrtaj visinu odskoka u ovisnosti o početnoj visini (FizLabov alat za podatke povući će pravac): nagib je udio energije koji loptica zadrži.'
      },
      tool: 'datalab',
      sim: 'energybars'
    },

    {
      id: 'rollback-can',
      topic: 'energy',
      type: 'project',
      level: 3,
      minutes: 40,
      outcome: 'D.7.6',
      title: { en: 'The can that rolls back by itself', hr: 'Limenka koja se sama vraća' },
      question: {
        en: 'Can you build a can that stops and rolls back to you after you have pushed it away?',
        hr: 'Možeš li napraviti limenku koja stane i otkotrlja se natrag k tebi nakon što je odgurneš?'
      },
      materials: {
        en: ['a tube-shaped box with a plastic lid, for example a crisp tube or a cocoa tin', 'a long rubber band (or two looped together)', 'a heavy weight: a large metal nut or five coins taped together', 'a short piece of string', 'two paper clips', 'sticky tape', 'a nail for making the holes (an adult does this)'],
        hr: ['valjkasta kutija s plastičnim poklopcem, na primjer tuba od čipsa ili kutija od kakaa', 'duga gumica (ili dvije povezane u jednu)', 'težak uteg: velika matica ili pet kovanica slijepljenih selotejpom', 'kratak komad špage', 'dvije spajalice', 'selotejp', 'čavao za bušenje rupa (to radi odrasla osoba)']
      },
      steps: {
        en: [
          'Ask an adult to make a hole about 5 mm wide in the centre of the bottom and in the centre of the lid.',
          'Tie the weight to the middle of the rubber band with the string, so that it hangs 1 to 2 cm below the band.',
          'Push one end of the band from the inside through the hole in the bottom. Slip a paper clip through the loop on the outside and tape the clip flat.',
          'Pull the other end through the hole in the lid, close the lid and secure this loop with the second paper clip. The band should be slightly stretched, and the weight must hang freely without touching the wall.',
          'Lay the can on a smooth, level floor and roll it gently away from you. Watch what it does.',
          'Test and improve: how far can you roll it so that it still comes all the way back? If it does not return, the weight is too light and spins with the band, or it rubs against the wall.'
        ],
        hr: [
          'Zamoli odraslu osobu da u sredini dna i u sredini poklopca probuši rupu široku oko 5 mm.',
          'Špagom zaveži uteg za sredinu gumice tako da visi 1 do 2 cm ispod nje.',
          'Jedan kraj gumice provuci iznutra kroz rupu na dnu. Izvana kroz omču provuci spajalicu i zalijepi je selotejpom uz dno.',
          'Drugi kraj provuci kroz rupu na poklopcu, zatvori poklopac i tu omču učvrsti drugom spajalicom. Gumica treba biti lagano napeta, a uteg mora slobodno visjeti i ne dodirivati stijenku.',
          'Položi limenku na gladak, vodoravan pod i lagano je otkotrljaj od sebe. Promatraj što radi.',
          'Ispitaj je i poboljšaj: koliko je daleko možeš otkotrljati, a da se još vrati do kraja? Ako se ne vraća, uteg je prelagan i vrti se zajedno s gumicom ili struže o stijenku.'
        ]
      },
      predict: {
        q: { en: 'You roll the can away from you along a level floor. What does it do?', hr: 'Otkotrljaš limenku od sebe po vodoravnom podu. Što ona učini?' },
        options: [
          { en: 'It rolls until friction stops it and stays there', hr: 'Kotrlja se dok je trenje ne zaustavi i ondje ostane' },
          { en: 'It slows down, stops and rolls back towards you', hr: 'Uspori, stane i otkotrlja se natrag prema tebi' },
          { en: 'It rolls faster and faster', hr: 'Kotrlja se sve brže' }
        ],
        answer: 1
      },
      observe: {
        en: 'The can slows down sooner than an empty can would, stops for a moment and then rolls back towards you. Often it overshoots and goes back and forth a few times before it comes to rest.',
        hr: 'Limenka uspori prije nego što bi usporila prazna, na trenutak stane, a zatim se otkotrlja natrag prema tebi. Često te i prijeđe pa se nekoliko puta zakotrlja naprijed-natrag prije nego što se smiri.'
      },
      explain: {
        en: 'Your push gives the can kinetic energy. Inside, the weight keeps hanging straight down while the can turns around it, so the rubber band is twisted. Twisting the band takes work: the kinetic energy of the can is stored as elastic potential energy in the band. When the can stops, all that energy is in the twisted band, which now untwists and turns the can the other way, so elastic energy becomes kinetic energy again. Each time a little energy is turned into heat by friction, so every trip is shorter. A wind-up toy stores energy in its spring in the same way.',
        hr: 'Guranjem daješ limenci kinetičku energiju. Unutra uteg stalno visi ravno dolje dok se limenka okreće oko njega, pa se gumica uvija. Za uvijanje gumice potreban je rad: kinetička energija limenke pohranjuje se kao elastična potencijalna energija gumice. Kad limenka stane, sva je ta energija u uvijenoj gumici, koja se sada odvija i okreće limenku u suprotnom smjeru, pa elastična energija ponovno postaje kinetička. Svaki put trenje pretvori malo energije u toplinu, pa je svaki put kraći. Igračka na navijanje na isti način sprema energiju u svojoj opruzi.'
      },
      safety: {
        en: 'Let an adult make the holes. Keep your face away from the rubber band while you thread it: it can snap back.',
        hr: 'Rupe neka probuši odrasla osoba. Dok provlačiš gumicu, drži lice podalje: može se naglo vratiti i udariti te.'
      },
      sim: 'energy'
    },

    {
      id: 'marble-run-hill',
      topic: 'energy',
      type: 'apply',
      level: 2,
      minutes: 40,
      outcome: 'D.7.6',
      title: { en: 'A marble run with a hill', hr: 'Staza za kuglicu s brijegom' },
      question: {
        en: 'From how high must a marble start so that it only just gets over a hill on its track?',
        hr: 'S koje visine kuglica mora krenuti da jedva prijeđe brijeg na svojoj stazi?'
      },
      materials: {
        en: ['thin card from cereal boxes (or a piece of foam pipe insulation cut in half lengthways)', 'scissors', 'sticky tape', 'a marble', 'books and a small box as supports', 'a ruler', 'a cup to catch the marble'],
        hr: ['tanki karton od kutija žitarica (ili komad spužvaste izolacije za cijevi prerezan po duljini)', 'škare', 'selotejp', 'staklena kuglica (špekula)', 'knjige i mala kutija kao potpornji', 'ravnalo', 'čaša u koju će kuglica upasti']
      },
      steps: {
        en: [
          'Cut strips of card 7 cm wide and fold up 2 cm along each long edge, so that you get a channel with walls. Tape the strips end to end into a track about 1.5 m long. Where the track has to bend, snip the walls every 2 cm.',
          'Tape the start of the track to a stack of books about 30 cm high. Lead the track down to the table, then over a hill 10 cm high made of the small box, and down again into the cup.',
          'Let the marble go, without pushing it, from a point 5 cm above the table. Does it get over the hill?',
          'Move the starting point up in steps of 2 cm until the marble only just clears the hill. Measure this height above the table and check it three times.',
          'Compare the lowest starting height that works with the height of the hill.',
          'Now make the hill 15 cm high. Predict the new starting height first, then test it. Can you add a second hill that is higher than the first?'
        ],
        hr: [
          'Izreži trake kartona široke 7 cm i uz svaki dulji rub presavij 2 cm prema gore, tako da dobiješ žlijeb sa stijenkama. Selotejpom spoji trake u stazu dugu oko 1,5 m. Ondje gdje se staza mora savijati zareži stijenke svaka 2 cm.',
          'Početak staze zalijepi na hrpu knjiga visoku oko 30 cm. Povedi stazu dolje do stola, zatim preko brijega visokog 10 cm napravljenog od male kutije, pa opet dolje u čašu.',
          'Pusti kuglicu, bez guranja, s mjesta koje je 5 cm iznad stola. Prijeđe li brijeg?',
          'Pomiči početnu točku naviše u koracima od 2 cm sve dok kuglica jedva ne prijeđe brijeg. Izmjeri tu visinu iznad stola i provjeri je tri puta.',
          'Usporedi najmanju početnu visinu koja uspijeva s visinom brijega.',
          'Sad napravi brijeg visok 15 cm. Najprije predvidi novu početnu visinu, a zatim je provjeri. Možeš li dodati drugi brijeg koji je viši od prvoga?'
        ]
      },
      predict: {
        q: { en: 'The hill is 10 cm high. From what height must the marble start to get over it?', hr: 'Brijeg je visok 10 cm. S koje visine kuglica mora krenuti da ga prijeđe?' },
        options: [
          { en: 'From exactly 10 cm, or even a little less', hr: 'Točno s 10 cm ili čak malo niže' },
          { en: 'From any height, as long as the start is steep enough', hr: 'S bilo koje visine, samo ako je početak dovoljno strm' },
          { en: 'From a few centimetres more than 10 cm', hr: 'S nekoliko centimetara više od 10 cm' }
        ],
        answer: 2
      },
      observe: {
        en: 'Starting lower than the top of the hill, the marble never gets over: it climbs, stops below the top and rolls back. It clears the hill only from a start a few centimetres higher than the hill, typically 12 to 15 cm for a hill of 10 cm. How steep the start is hardly matters; what counts is how high it is.',
        hr: 'Kad krene s visine manje od vrha brijega, kuglica ga nikad ne prijeđe: popne se, stane ispod vrha i otkotrlja se natrag. Brijeg prijeđe tek kad krene nekoliko centimetara više od njega, obično s 12 do 15 cm za brijeg od 10 cm. Strmina početka gotovo da i nije važna; važna je visina.'
      },
      explain: {
        en: 'At the start the marble has gravitational potential energy, which depends only on height. On the way down it turns into kinetic energy, and on the way up the hill it turns back into potential energy. If nothing were lost, the marble would climb exactly to the height from which it started, whatever the shape of the track. But friction and the bumps at the joins turn part of the energy into heat and sound, so the marble needs some extra height to pay for these losses. That is why the first hill of a roller coaster is always the highest.',
        hr: 'Na početku kuglica ima gravitacijsku potencijalnu energiju, koja ovisi samo o visini. Na putu prema dolje ona se pretvara u kinetičku energiju, a na usponu uz brijeg ponovno u potencijalnu. Kad se ništa ne bi gubilo, kuglica bi se popela točno na visinu s koje je krenula, kakav god bio oblik staze. No trenje i neravnine na spojevima pretvaraju dio energije u toplinu i zvuk, pa kuglici treba nešto dodatne visine da pokrije te gubitke. Zato je prvi brijeg vlaka smrti uvijek najviši.'
      },
      safety: {
        en: 'Cut the card carefully, and pick the marble up from the floor so that nobody slips on it.',
        hr: 'Pažljivo reži karton i podigni kuglicu s poda da se nitko ne posklizne na nju.'
      },
      sim: 'energy'
    }

  ]);
})();
