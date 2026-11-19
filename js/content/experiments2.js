// FizLab — home experiment library, part 2: heat, electricity, magnetism, waves, light, space, science.
// Format and rules: js/content/_experiments_schema.md
(function () {
  'use strict';
  window.Content.registerExperiments([

    // ───────────────────────────── HEAT ─────────────────────────────
    {
      id: 'heat-bottle-thermometer',
      topic: 'heat',
      type: 'project',
      level: 2,
      minutes: 30,
      outcome: 'A.7.8',
      title: { en: 'A thermometer from a bottle and a straw', hr: 'Termometar od boce i slamke' },
      question: {
        en: 'Can you build a thermometer in which a rising column of coloured water shows that it is getting warmer?',
        hr: 'Možeš li napraviti termometar u kojem stupac obojene vode pokazuje da je postalo toplije?'
      },
      materials: {
        en: ['a small glass bottle (0.2–0.33 L)', 'a clear drinking straw', 'modelling clay', 'cold water and a few drops of food colouring', 'a strip of paper, sticky tape and a pen', 'a bowl of warm water (about 40 °C) and a bowl of cold water with ice'],
        hr: ['mala staklena boca (0,2–0,33 L)', 'prozirna slamka', 'plastelin', 'hladna voda i nekoliko kapi jestive boje', 'traka papira, selotejp i olovka', 'zdjela tople vode (oko 40 °C) i zdjela hladne vode s ledom']
      },
      steps: {
        en: [
          'Fill the bottle to the very brim with cold water and stir in a few drops of food colouring.',
          'Push the straw through the middle of a walnut-sized ball of modelling clay. Check that the straw is not blocked.',
          'Dry the rim of the bottle. Lower the straw into the bottle and press the clay into the neck like a stopper, tightly all the way round. The water rises up the straw; press the stopper a little deeper until it stands about 4 cm above the clay. No air bubble should be left under the stopper.',
          'Tape the strip of paper behind the straw and mark the water level. Write "room" next to the mark.',
          'Stand the bottle in the bowl of warm water for 5 minutes and mark the new level. Then stand it in the ice water for 5 minutes and mark the level again.',
          'Test your thermometer: put it on a sunny windowsill, then in the fridge. Does the level follow the temperature? If it does not move, the stopper leaks: dry the neck and press the clay in again.'
        ],
        hr: [
          'Napuni bocu do samog vrha hladnom vodom i umiješaj nekoliko kapi jestive boje.',
          'Provuci slamku kroz sredinu kuglice plastelina veličine oraha. Provjeri da slamka nije začepljena.',
          'Obriši rub boce da bude suh. Spusti slamku u bocu i utisni plastelin u grlo boce kao čep, čvrsto sa svih strana. Voda se podigne u slamci; utisni čep još malo dublje, dok voda ne bude oko 4 cm iznad plastelina. Ispod čepa ne smije ostati mjehur zraka.',
          'Iza slamke zalijepi traku papira i označi razinu vode. Pokraj oznake napiši "soba".',
          'Stavi bocu na 5 minuta u zdjelu s toplom vodom i označi novu razinu. Zatim je stavi na 5 minuta u vodu s ledom i ponovno označi razinu.',
          'Ispitaj svoj termometar: stavi ga na sunčanu prozorsku dasku, a zatim u hladnjak. Prati li razina temperaturu? Ako se ne miče, čep propušta: obriši grlo boce i ponovno utisni plastelin.'
        ]
      },
      predict: {
        q: {
          en: 'The bottle is full and sealed. What will the water in the straw do when you stand the bottle in warm water?',
          hr: 'Boca je puna i začepljena. Što će učiniti voda u slamci kad bocu staviš u toplu vodu?'
        },
        options: [
          { en: 'It rises: warm water takes up more space', hr: 'Podigne se: topla voda zauzima više prostora' },
          { en: 'It stays put: no water was added', hr: 'Ostane na mjestu: nismo dolili vodu' },
          { en: 'It sinks: warm water is lighter', hr: 'Spusti se: topla voda je lakša' }
        ],
        answer: 0
      },
      observe: {
        en: 'In the warm bath the level may dip for a moment (the glass warms up and widens first) and then climbs several centimetres within a few minutes. In the ice water it sinks below the room mark.',
        hr: 'U toploj vodi razina se možda na trenutak malo spusti (staklo se prvo ugrije i proširi), a zatim se za nekoliko minuta podigne nekoliko centimetara. U vodi s ledom spusti se ispod oznake za sobu.'
      },
      explain: {
        en: 'When water is warmed, its particles move faster and on average need more room, so the same water takes up a larger volume. This is thermal expansion. The bottle is full, so the extra volume can only go up the narrow straw, which turns a tiny change of volume into a rise you can see. No water was added: the mass stays the same, only the volume grows. Liquid thermometers work in the same way, with coloured alcohol in a very thin tube.',
        hr: 'Kad se voda zagrijava, njezine se čestice gibaju brže i u prosjeku trebaju više mjesta, pa ista voda zauzima veći obujam. To je toplinsko širenje. Boca je puna, pa višak obujma može samo uz usku slamku, koja sitnu promjenu obujma pretvara u vidljivo podizanje. Vodu nismo dolili: masa je ostala ista, povećao se samo obujam. Tako rade i termometri s tekućinom, u kojima je obojeni alkohol u vrlo tankoj cjevčici.'
      },
      safety: {
        en: 'Use warm water only, never boiling water: a glass bottle can crack. Carry the bottle with dry hands.',
        hr: 'Koristi samo toplu vodu, nikad kipuću: staklena boca može puknuti. Bocu nosi suhim rukama.'
      },
      sim: 'expansion'
    },

    {
      id: 'heat-dancing-coin',
      topic: 'heat',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: 'A.7.8',
      title: { en: 'The coin that dances on a bottle', hr: 'Kovanica koja pleše na boci' },
      question: {
        en: 'Can the warmth of your hands lift a coin without touching it?',
        hr: 'Može li toplina tvojih dlanova podići kovanicu, a da je ne dotakneš?'
      },
      materials: {
        en: ['an empty glass bottle', 'a coin that just covers the mouth of the bottle (for example 50 cents)', 'a freezer or a fridge', 'a few drops of water'],
        hr: ['prazna staklena boca', 'kovanica koja upravo prekriva otvor boce (na primjer 50 centi)', 'zamrzivač ili hladnjak', 'nekoliko kapi vode']
      },
      steps: {
        en: [
          'Put the empty, open bottle in the freezer for 10 minutes (or in the fridge for half an hour).',
          'Stand the cold bottle on the table. Wet the rim with a drop of water and lay the coin on top so that it closes the mouth completely.',
          'Wrap both warm hands around the bottle and hold still. Watch and listen for a minute.',
          'Count how many times the coin moves. Then take your hands away and see what changes.',
          'If nothing happens, the coin is not sealing the bottle: wet the rim again and centre the coin, or cool the bottle for longer.'
        ],
        hr: [
          'Stavi praznu, otvorenu bocu u zamrzivač na 10 minuta (ili u hladnjak na pola sata).',
          'Postavi hladnu bocu na stol. Navlaži rub grla kapljicom vode i položi kovanicu tako da potpuno zatvori otvor.',
          'Obuhvati bocu objema toplim rukama i miruj. Gledaj i slušaj jednu minutu.',
          'Broji koliko se puta kovanica pomakne. Zatim makni ruke i pogledaj što se promijeni.',
          'Ako se ništa ne događa, kovanica ne brtvi bocu: ponovno navlaži rub i namjesti kovanicu u sredinu ili bocu hladi dulje.'
        ]
      },
      predict: {
        q: {
          en: 'What will the coin do while your hands warm the cold bottle?',
          hr: 'Što će raditi kovanica dok tvoje ruke griju hladnu bocu?'
        },
        options: [
          { en: 'Nothing: hands are too weak to lift metal', hr: 'Ništa: ruke su preslabe da podignu metal' },
          { en: 'It gets sucked firmly onto the bottle', hr: 'Čvrsto se priljubi uz bocu' },
          { en: 'It lifts and clicks back, again and again', hr: 'Odiže se i klikne natrag, iznova i iznova' }
        ],
        answer: 2
      },
      observe: {
        en: 'After a few seconds one edge of the coin lifts and drops back with a click. This repeats every few seconds, often ten times or more, and stops soon after you take your hands away.',
        hr: 'Nakon nekoliko sekundi jedan se rub kovanice odigne i uz klik padne natrag. To se ponavlja svakih nekoliko sekundi, često deset i više puta, a prestane ubrzo nakon što makneš ruke.'
      },
      explain: {
        en: 'Your hands warm the cold air shut inside the bottle. The air particles move faster and hit the walls and the coin harder, so the pressure of the trapped gas rises. When the push from inside becomes larger than the weight of the coin, the coin lifts, a little air escapes, the pressure drops and the coin falls back. Then it all starts again. Your hands do not lift the coin: the warmed air does. A gas that is heated in a closed space presses harder on the walls, and if it can, it expands.',
        hr: 'Tvoje ruke griju hladni zrak zatvoren u boci. Čestice zraka gibaju se brže i jače udaraju u stijenke i u kovanicu, pa tlak zatvorenog plina raste. Kad sila iznutra postane veća od težine kovanice, kovanica se odigne, malo zraka izađe, tlak padne i kovanica padne natrag. Zatim sve kreće ispočetka. Kovanicu ne podižu tvoje ruke, nego ugrijani zrak. Plin koji se grije u zatvorenom prostoru jače tlači stijenke, a ako može, širi se.'
      },
      safety: {
        en: 'Hold the cold, damp glass bottle firmly so that it does not slip, and never put a closed or full bottle in the freezer.',
        hr: 'Hladnu i vlažnu staklenu bocu drži čvrsto da ti ne isklizne i nikad ne stavljaj zatvorenu ili punu bocu u zamrzivač.'
      },
      sim: 'gas'
    },

    {
      id: 'heat-cooling-curve',
      topic: 'heat',
      type: 'test',
      level: 3,
      minutes: 50,
      outcome: 'D.7.9',
      title: { en: 'The cooling curve of warm water', hr: 'Krivulja hlađenja tople vode' },
      question: {
        en: 'Does warm water lose its degrees at a steady pace, or faster at the beginning?',
        hr: 'Gubi li topla voda stupnjeve jednoliko ili na početku brže?'
      },
      materials: {
        en: ['a kitchen thermometer or a bath thermometer', 'a thin drinking glass', 'a large bowl or pot with about 2 L of cold tap water', 'a measuring jug', 'hot water from the tap (about 50 °C)', 'a phone with a stopwatch', 'a notebook and a pencil'],
        hr: ['kuhinjski termometar ili termometar za kupku', 'tanka čaša', 'velika zdjela ili lonac s oko 2 L hladne vode iz slavine', 'mjerna posuda', 'vruća voda iz slavine (oko 50 °C)', 'mobitel sa štopericom', 'bilježnica i olovka']
      },
      steps: {
        en: [
          'Measure the temperature of the cold water in the bowl and write it down.',
          'Draw a table with two columns, time (min) and temperature (°C), and rows for 0, 1, 2 and so on up to 12 minutes.',
          'Measure 100 mL of the hottest tap water into the glass and put the thermometer in. Wait until the reading stops rising.',
          'Stand the glass in the bowl. The cold water should reach about as high as the warm water inside the glass, but must not flow into it. Start the stopwatch and write down the temperature at 0 minutes.',
          'Read the temperature every minute for 12 minutes. Stir the warm water gently with the thermometer before each reading.',
          'Work out how many degrees the water lost in the first 3 minutes and how many in the last 3 minutes. Measure the temperature of the cold bath once more.',
          'Repeat the whole run two more times with fresh cold and hot water in the same amounts. Is the shape of the cooling the same each time?',
          'Enter one run in the FizLab tool Data Table and Graph and draw the graph of temperature against time.'
        ],
        hr: [
          'Izmjeri temperaturu hladne vode u zdjeli i zapiši je.',
          'Nacrtaj tablicu s dva stupca, vrijeme (min) i temperatura (°C), i s redcima za 0, 1, 2 i tako dalje do 12 minuta.',
          'Odmjeri 100 mL najtoplije vode iz slavine u čašu i stavi u nju termometar. Pričekaj da očitanje prestane rasti.',
          'Postavi čašu u zdjelu. Hladna voda treba sezati otprilike do visine tople vode u čaši, ali ne smije se u nju preliti. Pokreni štopericu i zapiši temperaturu u nultoj minuti.',
          'Očitavaj temperaturu svake minute tijekom 12 minuta. Prije svakog očitanja lagano promiješaj toplu vodu termometrom.',
          'Izračunaj koliko je stupnjeva voda izgubila u prve 3 minute, a koliko u zadnje 3 minute. Još jednom izmjeri temperaturu hladne kupelji.',
          'Ponovi cijelo mjerenje još dva puta sa svježom hladnom i vrućom vodom u istim količinama. Je li oblik hlađenja svaki put isti?',
          'Unesi jedno mjerenje u FizLabov alat Tablica i graf i nacrtaj graf temperature u ovisnosti o vremenu.'
        ]
      },
      predict: {
        q: {
          en: 'A glass of water at 50 °C stands in a bath of cold water at 15 °C. When does its temperature fall fastest?',
          hr: 'Čaša vode temperature 50 °C stoji u kupelji hladne vode temperature 15 °C. Kada joj temperatura najbrže pada?'
        },
        options: [
          { en: 'At the same pace all the time', hr: 'Cijelo vrijeme jednako brzo' },
          { en: 'At the start, while it is hottest', hr: 'Na početku, dok je najtoplija' },
          { en: 'At the end, when it is almost cold', hr: 'Na kraju, kad je već gotovo hladna' }
        ],
        answer: 1
      },
      observe: {
        en: 'The temperature falls fast at first, perhaps 12 to 16 °C in the first 3 minutes, and then more and more slowly, only 2 to 3 °C in the last 3 minutes. The points on the graph lie on a curve that flattens out just above the temperature of the bath, not on a straight line.',
        hr: 'Temperatura isprva pada brzo, možda 12 do 16 °C u prve 3 minute, a zatim sve sporije, samo 2 do 3 °C u zadnje 3 minute. Točke na grafu leže na krivulji koja se izravnava malo iznad temperature kupelji, a ne na pravcu.'
      },
      explain: {
        en: 'Heat passes from the warmer body to the colder one, and it passes faster when the temperature difference is larger. At the start the water in the glass is about 35 °C warmer than the bath, so it loses internal energy quickly. Later the difference is small and the flow of heat slows down. When both temperatures are equal, the flow stops: this is thermal equilibrium, so the water never gets colder than its surroundings. A cup of tea in the air of a room cools in the same way, only more slowly. The steady, straight-line cooling that many people expect does not happen.',
        hr: 'Toplina prelazi s toplijeg tijela na hladnije, i to brže što je razlika temperatura veća. Na početku je voda u čaši oko 35 °C toplija od kupelji, pa brzo gubi unutarnju energiju. Kasnije je razlika mala i prijelaz topline usporava. Kad se temperature izjednače, prijelaz prestaje: to je toplinska ravnoteža, pa voda nikad ne postane hladnija od okoline. Šalica čaja na sobnom zraku hladi se na isti način, samo sporije. Jednoliko hlađenje po pravcu, kakvo mnogi očekuju, ne događa se.'
      },
      measure: {
        en: 'You change the time, you measure the temperature, and you keep the glass, the amounts of water and the bath the same. Take 13 readings (every minute from 0 to 12) in each of three runs. Draw temperature against time and compare the drop in the first 3 and the last 3 minutes. Try the best-fit line in the data tool: do your points follow it?',
        hr: 'Mijenjaš vrijeme, mjeriš temperaturu, a čašu, količine vode i kupelj držiš istima. U svakom od tri mjerenja zapiši 13 očitanja (svake minute od 0 do 12). Nacrtaj graf temperature u ovisnosti o vremenu i usporedi pad u prve 3 i u zadnje 3 minute. U alatu za podatke isprobaj pravac koji najbolje prolazi kroz točke: slijede li ga tvoja mjerenja?'
      },
      safety: {
        en: 'Hot tap water can scald: fill the glass over the sink, and do not use water from a kettle.',
        hr: 'Vruća voda iz slavine može opeći: čašu puni iznad sudopera i ne koristi vodu iz kuhala.'
      },
      tool: 'datalab',
      sim: 'heat'
    },

    {
      id: 'heat-black-white-sun',
      topic: 'heat',
      type: 'test',
      level: 2,
      minutes: 45,
      outcome: 'D.7.9',
      title: { en: 'Black and white paper in the sun', hr: 'Crni i bijeli papir na suncu' },
      question: {
        en: 'Does the colour of a surface decide how much it warms up in sunshine?',
        hr: 'Odlučuje li boja površine o tome koliko će se ona ugrijati na suncu?'
      },
      materials: {
        en: ['a sheet of black paper and a sheet of white paper of the same kind', 'a tray or a piece of thick cardboard', '6 equal ice cubes from the same tray', 'a phone with a stopwatch', 'a sunny spot outdoors or on a windowsill', 'a notebook'],
        hr: ['list crnog i list bijelog papira iste vrste', 'pladanj ili komad debelog kartona', '6 jednakih kockica leda iz iste posudice', 'mobitel sa štopericom', 'sunčano mjesto vani ili na prozorskoj dasci', 'bilježnica']
      },
      steps: {
        en: [
          'On a sunny day put the tray in full sunshine and lay the black and the white sheet on it side by side.',
          'Wait 10 minutes, then touch both sheets with the back of your hand. Which one is warmer?',
          'Put three ice cubes on the black sheet and three on the white sheet at the same moment and start the stopwatch.',
          'Do not touch the cubes. Write down the time at which each cube has melted completely.',
          'Work out the mean melting time on black and on white.',
          'Control test: repeat everything in the shade with fresh, dry sheets. Is there still a difference?'
        ],
        hr: [
          'Za sunčanog dana stavi pladanj na puno sunce i na njega položi crni i bijeli list jedan do drugoga.',
          'Pričekaj 10 minuta, a zatim oba lista dodirni vanjskom stranom šake. Koji je topliji?',
          'U istom trenutku stavi tri kockice leda na crni i tri na bijeli list te pokreni štopericu.',
          'Ne diraj kockice. Zapiši vrijeme u kojem se svaka kockica potpuno rastalila.',
          'Izračunaj srednje vrijeme taljenja na crnom i na bijelom papiru.',
          'Kontrolni pokus: ponovi sve u sjeni, sa svježim suhim listovima. Postoji li i dalje razlika?'
        ]
      },
      predict: {
        q: {
          en: 'On which sheet will the ice cubes melt first in the sunshine?',
          hr: 'Na kojem će se listu kockice leda na suncu prije rastaliti?'
        },
        options: [
          { en: 'On the black sheet', hr: 'Na crnom listu' },
          { en: 'On the white sheet', hr: 'Na bijelom listu' },
          { en: 'At the same time: the same Sun shines on both', hr: 'Istodobno: na oba sja isto Sunce' }
        ],
        answer: 0
      },
      observe: {
        en: 'After 10 minutes the black sheet feels clearly warmer. The cubes on black melt first, typically a few minutes before those on white (the exact times depend on the Sun). In the shade the difference almost disappears.',
        hr: 'Nakon 10 minuta crni je list na dodir jasno topliji. Kockice na crnom rastale se prve, obično nekoliko minuta prije onih na bijelom (točna vremena ovise o Suncu). U sjeni razlika gotovo nestane.'
      },
      explain: {
        en: 'Sunlight carries energy to the Earth by radiation. A black surface absorbs most of the light that falls on it, so its internal energy and its temperature rise. A white surface reflects most of the light and stays cooler. The warmer black paper then passes more heat to the ice. Both sheets get the same sunshine, but they do not take in the same share of it. In the shade there is little light to absorb, so black is not warm by itself. This is why solar collectors are black and summer clothes are light.',
        hr: 'Sunčeva svjetlost prenosi energiju do Zemlje zračenjem. Crna površina upije većinu svjetlosti koja na nju padne, pa joj rastu unutarnja energija i temperatura. Bijela površina većinu svjetlosti odbije i ostane hladnija. Topliji crni papir zatim ledu predaje više topline. Oba lista dobivaju jednako sunca, ali ne upiju jednak dio. U sjeni nema mnogo svjetlosti koju bi papir upio, dakle crna boja nije topla sama po sebi. Zato su sunčevi kolektori crni, a ljetna odjeća svijetla.'
      },
      measure: {
        en: 'You change the colour of the paper, you measure the melting time, and you keep the size of the cubes, the place and the base the same. Time three cubes on each colour and work out the two means. Make a table (colour, three times, mean) for the sun and another one for the shade.',
        hr: 'Mijenjaš boju papira, mjeriš vrijeme taljenja, a veličinu kockica, mjesto i podlogu držiš istima. Izmjeri vrijeme za tri kockice na svakoj boji i izračunaj dvije srednje vrijednosti. Napravi tablicu (boja, tri vremena, srednja vrijednost) za sunce i još jednu za sjenu.'
      },
      safety: {
        en: 'Never look straight at the Sun. On a hot day wear a hat and do not stay in the sun longer than you need to.',
        hr: 'Nikad ne gledaj izravno u Sunce. Za vrućeg dana stavi šešir i ne ostaj na suncu dulje nego što treba.'
      },
      tool: 'stopwatch',
      sim: 'heattransfer'
    },

    {
      id: 'heat-ice-metal-plastic',
      topic: 'heat',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: 'D.7.9',
      title: { en: 'Cold to the touch, quick to melt ice', hr: 'Hladan na dodir, a brzo tali led' },
      question: {
        en: 'A metal tray feels colder than a plastic board. On which of them does ice melt faster?',
        hr: 'Metalni lim na dodir je hladniji od plastične daske. Na kojem se od njih led brže tali?'
      },
      materials: {
        en: ['a metal baking tray or, even better, a large thick-bottomed pan turned upside down', 'a plastic or wooden chopping board', '2 equal ice cubes', 'a phone with a stopwatch'],
        hr: ['metalni lim za pečenje ili, još bolje, velika tava debelog dna okrenuta naopako', 'plastična ili drvena daska za rezanje', '2 jednake kockice leda', 'mobitel sa štopericom']
      },
      steps: {
        en: [
          'Leave the tray and the board side by side in the same room for at least half an hour.',
          'Lay one palm on each of them for 5 seconds. Which one feels colder? Write it down.',
          'Put one ice cube on the metal and one on the board at the same moment and start the stopwatch.',
          'Watch for 3 minutes. Under which cube does a puddle appear first?',
          'Write down the time when each cube has melted completely (stop after 15 minutes if the slower one is still there).',
          'Touch the metal next to the puddle. How does it feel now compared with a spot far from the ice?'
        ],
        hr: [
          'Ostavi lim i dasku jedno pokraj drugoga u istoj sobi barem pola sata.',
          'Položi po jedan dlan na svaki od njih na 5 sekundi. Koji je na dodir hladniji? Zapiši.',
          'U istom trenutku stavi jednu kockicu leda na metal, a drugu na dasku i pokreni štopericu.',
          'Promatraj 3 minute. Ispod koje se kockice prije pojavi lokvica?',
          'Zapiši vrijeme kad se svaka kockica potpuno rastalila (prekini nakon 15 minuta ako sporija još nije gotova).',
          'Dodirni metal pokraj lokvice. Kakav je sada na dodir u usporedbi s mjestom daleko od leda?'
        ]
      },
      predict: {
        q: {
          en: 'On which surface will the ice cube melt faster?',
          hr: 'Na kojoj će se podlozi kockica leda brže rastaliti?'
        },
        options: [
          { en: 'On the board: it feels warmer', hr: 'Na dasci: ona je na dodir toplija' },
          { en: 'On the metal', hr: 'Na metalu' },
          { en: 'Equally fast: both are at room temperature', hr: 'Jednako brzo: oboje je na sobnoj temperaturi' }
        ],
        answer: 1
      },
      observe: {
        en: 'The metal feels colder, yet the cube on it starts to melt at once and is gone much sooner than the cube on the board, which hardly changes in the first minutes. On a thick pan the difference is largest. The metal around the puddle becomes cold.',
        hr: 'Metal je na dodir hladniji, a ipak se kockica na njemu počne taliti odmah i nestane mnogo prije kockice na dasci, koja se u prvim minutama jedva mijenja. Na debeloj tavi razlika je najveća. Metal oko lokvice postane hladan.'
      },
      explain: {
        en: 'The metal and the board have the same temperature, the temperature of the room. Metal is a good conductor of heat. It carries heat away from your warm hand quickly, your skin cools down and you feel cold: skin senses how fast it loses heat, not the temperature itself. For the ice the same property works in the other direction: the metal quickly brings heat from the whole tray to the cube. Plastic and wood are insulators, so they take little heat from your hand and give little to the ice.',
        hr: 'Metal i daska imaju istu temperaturu, temperaturu sobe. Metal je dobar vodič topline. Toplinu tvojeg toplog dlana brzo odvodi, koža ti se ohladi i osjećaš hladnoću: koža osjeća koliko brzo gubi toplinu, a ne samu temperaturu. Za led isto svojstvo djeluje u suprotnom smjeru: metal brzo dovodi toplinu iz cijelog lima do kockice. Plastika i drvo su izolatori, pa od tvojeg dlana uzimaju malo topline i malo je predaju ledu.'
      },
      sim: 'heattransfer'
    },

    // ───────────────────────────── ELECTRICITY ─────────────────────────────
    {
      id: 'charge-bending-water',
      topic: 'electricity',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: 'B.8.1',
      title: { en: 'Bend a stream of water without touching it', hr: 'Savij mlaz vode bez dodira' },
      question: {
        en: 'Can a rubbed plastic comb pull on water, which is not charged?',
        hr: 'Može li natrljani plastični češalj privlačiti vodu, koja nije nabijena?'
      },
      materials: {
        en: ['a plastic comb (or an inflated balloon)', 'clean, dry hair or a woollen jumper', 'a water tap'],
        hr: ['plastični češalj (ili napuhani balon)', 'čista i suha kosa ili vuneni džemper', 'slavina']
      },
      steps: {
        en: [
          'Open the tap just enough to get a thin, smooth, unbroken stream about 2 mm wide.',
          'Bring the comb to about 1 cm from the stream without rubbing it first. Does anything happen?',
          'Comb your dry hair briskly ten times, or rub the comb on wool.',
          'Bring the comb slowly towards the stream, about 10 cm below the tap, without touching the water.',
          'Find the largest distance at which the stream still bends. If the comb gets wet, the effect is gone: dry it well and rub it again.',
          'Repeat with a balloon rubbed on your hair. Does the stream bend towards it or away from it?'
        ],
        hr: [
          'Otvori slavinu tek toliko da dobiješ tanak, gladak i neprekinut mlaz širok oko 2 mm.',
          'Približi češalj na oko 1 cm od mlaza, a da ga prije ne natrljaš. Događa li se išta?',
          'Deset puta žustro pročešljaj suhu kosu ili natrljaj češalj o vunu.',
          'Polako približavaj češalj mlazu, oko 10 cm ispod slavine, ne dodirujući vodu.',
          'Pronađi najveću udaljenost na kojoj se mlaz još savija. Ako se češalj smoči, učinak nestaje: dobro ga osuši i ponovno natrljaj.',
          'Ponovi pokus s balonom natrljanim o kosu. Savija li se mlaz prema njemu ili od njega?'
        ]
      },
      predict: {
        q: {
          en: 'What will the thin stream do when the rubbed comb comes close?',
          hr: 'Što će učiniti tanki mlaz kad mu se približi natrljani češalj?'
        },
        options: [
          { en: 'Nothing: water is not charged', hr: 'Ništa: voda nije nabijena' },
          { en: 'It bends away from the comb', hr: 'Savije se od češlja' },
          { en: 'It bends towards the comb', hr: 'Savije se prema češlju' }
        ],
        answer: 2
      },
      observe: {
        en: 'The stream curves clearly towards the comb, by a centimetre or more, and just the same towards the rubbed balloon. The unrubbed comb does nothing. On a damp day or with freshly washed, wet hair the effect is weak.',
        hr: 'Mlaz se jasno savije prema češlju, za centimetar ili više, a jednako tako i prema natrljanom balonu. Nenatrljani češalj ne čini ništa. Za vlažnog dana ili s mokrom, tek opranom kosom učinak je slab.'
      },
      explain: {
        en: 'Rubbing moves electrons from your hair to the comb, so the comb becomes negatively charged. The water as a whole is neutral, but it contains charges that can shift. The charged comb draws the opposite charges to the near side of the stream and pushes the like charges to the far side. The near side is pulled more strongly than the far side is pushed, so the stream is attracted. A charged body therefore attracts neutral bodies too, whatever the sign of its charge. That is why the water is never pushed away.',
        hr: 'Trljanjem elektroni prelaze s kose na češalj, pa češalj postane negativno nabijen. Voda je kao cjelina neutralna, ali u njoj ima naboja koji se mogu pomaknuti. Nabijeni češalj privuče raznoimene naboje na bližu stranu mlaza, a istoimene odgurne na dalju. Bliža strana privlači se jače nego što se dalja odbija, pa se mlaz privlači. Nabijeno tijelo zato privlači i neutralna tijela, bez obzira na predznak svojeg naboja. Zbog toga se voda nikad ne odbija.'
      },
      sim: 'static'
    },

    {
      id: 'charge-jar-electroscope',
      topic: 'electricity',
      type: 'project',
      level: 2,
      minutes: 30,
      outcome: 'B.8.1',
      title: { en: 'An electroscope from a jar and foil', hr: 'Elektroskop od staklenke i folije' },
      question: {
        en: 'Can you build an instrument that shows whether a body is electrically charged?',
        hr: 'Možeš li napraviti uređaj koji pokazuje je li neko tijelo električki nabijeno?'
      },
      materials: {
        en: ['a clean, dry glass jar', 'a piece of cardboard larger than the mouth of the jar', 'a large metal paper clip without a plastic coating', 'aluminium foil', 'sticky tape and scissors', 'a plastic comb or a balloon', 'dry hair or a woollen cloth'],
        hr: ['čista i suha staklenka', 'komad kartona veći od otvora staklenke', 'velika metalna spajalica bez plastične obloge', 'aluminijska folija', 'selotejp i škare', 'plastični češalj ili balon', 'suha kosa ili vunena krpa']
      },
      steps: {
        en: [
          'Unbend the paper clip into a straight wire with a small hook at one end. Push the straight end up through the middle of the cardboard, so that the hook hangs below and about 3 cm of wire sticks out above. Fix it with tape.',
          'Crumple a piece of foil into a tight ball about 2 cm wide and push it onto the top end of the wire.',
          'Cut two strips of foil 1 cm wide and 4 cm long. Make a small hole near one end of each strip and hang both on the hook, so that they hang side by side and swing freely. These are the leaves.',
          'Lay the cardboard on the jar with the leaves inside. They must not touch the glass.',
          'Test: rub the comb on your hair and bring it close to the foil ball without touching it. Watch the leaves. Then take the comb away.',
          'Now stroke the ball with the rubbed comb a few times and take the comb away. Then touch the ball with your finger.',
          'Use your electroscope: test a rubbed balloon, a rubbed plastic ruler and a metal spoon that you rub while holding it in your hand.'
        ],
        hr: [
          'Izravnaj spajalicu u ravnu žicu s malom kukicom na jednom kraju. Ravni kraj provuci odozdo kroz sredinu kartona tako da kukica visi ispod, a oko 3 cm žice strši iznad kartona. Učvrsti je selotejpom.',
          'Zgužvaj komad folije u čvrstu kuglicu široku oko 2 cm i nabodi je na gornji kraj žice.',
          'Izreži dvije trake folije široke 1 cm i duge 4 cm. Blizu jednog kraja svake trake napravi rupicu i objesi obje na kukicu tako da vise jedna uz drugu i slobodno se njišu. To su listići.',
          'Položi karton na staklenku tako da listići budu unutra. Ne smiju dodirivati staklo.',
          'Ispitaj: natrljaj češalj o kosu i približi ga kuglici od folije, ali je ne dodiruj. Promatraj listiće. Zatim odmakni češalj.',
          'Sad nekoliko puta prijeđi natrljanim češljem po kuglici i odmakni ga. Zatim kuglicu dodirni prstom.',
          'Upotrijebi svoj elektroskop: ispitaj natrljani balon, natrljano plastično ravnalo i metalnu žlicu koju trljaš držeći je u ruci.'
        ]
      },
      predict: {
        q: {
          en: 'What will the two foil leaves do when the charged comb comes near the ball?',
          hr: 'Što će učiniti dva listića folije kad se nabijeni češalj približi kuglici?'
        },
        options: [
          { en: 'They move apart', hr: 'Razmaknu se' },
          { en: 'They stick together more tightly', hr: 'Još se čvršće priljube' },
          { en: 'Nothing, because the comb does not touch the ball', hr: 'Ništa, jer češalj ne dodiruje kuglicu' }
        ],
        answer: 0
      },
      observe: {
        en: 'The leaves spread apart like an upside-down V when the comb comes near and fall together when it is taken away. After you stroke the ball with the comb they stay apart, until your finger makes them collapse. If they do not move, cut narrower leaves from thinner foil and try on a dry day.',
        hr: 'Listići se razmaknu u obliku obrnutog slova V kad se češalj približi, a spuste se kad ga odmakneš. Nakon što češljem prijeđeš po kuglici, ostanu razmaknuti sve dok ih dodir prsta ne spusti. Ako se ne miču, izreži uže listiće od tanje folije i pokušaj za suhog dana.'
      },
      explain: {
        en: 'The negatively charged comb repels the electrons in the metal, and they run from the ball down the wire into the leaves. Both leaves now carry the same kind of charge, and like charges repel, so the leaves push each other apart. No charge has crossed from the comb: the charges in the metal were only separated by influence (electrostatic induction), which is why the leaves close when the comb leaves. Stroking the ball really transfers charge, so the leaves stay open. Your finger conducts that charge away into your body: you have earthed the electroscope.',
        hr: 'Negativno nabijeni češalj odbija elektrone u metalu, pa oni iz kuglice niz žicu otječu u listiće. Oba listića sada nose istovrsni naboj, a istoimeni naboji se odbijaju, pa se listići razmaknu. S češlja nije prešao nikakav naboj: naboji u metalu samo su se razdvojili influencijom, i zato se listići spuste čim češalj odmakneš. Kad češljem prijeđeš po kuglici, naboj doista prijeđe na elektroskop i listići ostanu razmaknuti. Tvoj prst taj naboj odvede u tijelo: elektroskop si uzemljio.'
      },
      safety: {
        en: 'The ends of the unbent paper clip are sharp, and so are scissors: work slowly and keep the wire away from your eyes.',
        hr: 'Krajevi izravnane spajalice su oštri, kao i škare: radi polako i drži žicu dalje od očiju.'
      },
      sim: 'static'
    },

    {
      id: 'circuit-pencil-resistor',
      topic: 'electricity',
      type: 'test',
      level: 3,
      minutes: 40,
      outcome: 'A.8.4',
      title: { en: 'A pencil line as a resistor', hr: 'Crta olovkom kao otpornik' },
      question: {
        en: 'How does the brightness of an LED change when the current has to travel through a longer pencil line?',
        hr: 'Kako se mijenja sjaj svjetleće diode kad struja mora proći kroz dulju crtu olovke?'
      },
      materials: {
        en: ['a soft pencil, 2B or softer (4B to 8B works best; HB is too hard)', 'a sheet of smooth white paper', 'a ruler', 'a 9 V battery, if you have one', 'an LED, if you have one (a red one works best)', 'a room you can make dim'],
        hr: ['mekana olovka, 2B ili mekša (najbolje 4B do 8B; HB je pretvrda)', 'list glatkog bijelog papira', 'ravnalo', 'baterija od 9 V, ako je imaš', 'svjetleća dioda (LED), ako je imaš (najbolja je crvena)', 'soba koju možeš zamračiti']
      },
      steps: {
        en: [
          'Draw two parallel tracks, each 12 cm long and 5 mm wide, with a gap of 8 mm between them. Go over each track many times, pressing hard, until it is shiny dark grey with no white showing. The tracks must not touch.',
          'Mark the distances 2, 4, 6, 8 and 10 cm from one end of the tracks. This end is for the battery.',
          'Bend the two legs of the LED apart so that it can stand with one leg on each track. Remember which leg is longer: it is the plus leg.',
          'Stand the battery upside down on the end of the tracks so that one terminal presses on each track. The longer LED leg belongs on the track under the terminal marked +.',
          'In a dim room press the LED legs onto the tracks at the 2 cm marks. Give the brightness a mark from 0 (dark) to 5 (brightest). Then move the LED to 4, 6, 8 and 10 cm.',
          'Repeat the whole series three times and write the marks in a table. If the LED never lights, turn it round, darken the tracks with more graphite and make the room darker.',
          'Extra: draw a second pair of tracks twice as wide and compare the brightness at 6 cm.'
        ],
        hr: [
          'Nacrtaj dvije usporedne trake, svaku dugu 12 cm i široku 5 mm, s razmakom od 8 mm među njima. Preko svake trake prijeđi olovkom mnogo puta, uz jak pritisak, dok ne postane sjajna i tamnosiva, bez bjelina. Trake se ne smiju dodirivati.',
          'Označi udaljenosti 2, 4, 6, 8 i 10 cm od jednog kraja traka. Taj je kraj za bateriju.',
          'Razmakni nožice diode tako da može stajati s po jednom nožicom na svakoj traci. Zapamti koja je nožica dulja: to je plus.',
          'Postavi bateriju naopako na kraj traka tako da svaki pol pritišće jednu traku. Dulja nožica diode ide na traku ispod pola označenog s +.',
          'U zamračenoj sobi pritisni nožice diode na trake kod oznake 2 cm. Ocijeni sjaj ocjenom od 0 (ne svijetli) do 5 (najsjajnije). Zatim pomakni diodu na 4, 6, 8 i 10 cm.',
          'Cijeli niz ponovi tri puta i ocjene upiši u tablicu. Ako dioda uopće ne svijetli, okreni je, zatamni trake s još grafita i jače zamrači sobu.',
          'Dodatak: nacrtaj drugi par dvostruko širih traka i usporedi sjaj na 6 cm.'
        ]
      },
      predict: {
        q: {
          en: 'You slide the LED further from the battery along the pencil tracks. What happens to its light?',
          hr: 'Diodu pomičeš po trakama olovke sve dalje od baterije. Što se događa s njezinim sjajem?'
        },
        options: [
          { en: 'It stays the same: the battery is the same', hr: 'Ostaje isti: baterija je ista' },
          { en: 'It gets dimmer', hr: 'Slabi' },
          { en: 'It gets brighter: more graphite carries more current', hr: 'Jača: više grafita vodi više struje' }
        ],
        answer: 1
      },
      observe: {
        en: 'Near the battery the LED shines clearly. With every step away it gets dimmer, and at 10 cm you may see only a faint glow in a dim room, or nothing. On the wider tracks it is brighter at the same distance.',
        hr: 'Blizu baterije dioda jasno svijetli. Sa svakim pomakom dalje sve je slabija, a na 10 cm u zamračenoj sobi možda vidiš samo slabašan sjaj ili ništa. Na širim trakama na istoj udaljenosti svijetli jače.'
      },
      explain: {
        en: 'Graphite conducts electric current, but much worse than a metal: your pencil line is a resistor. The longer the path through the graphite, the greater its resistance, just as for a wire. The battery always gives the same voltage, but the current is not always the same: the greater the resistance, the smaller the current, and the dimmer the LED. A wider line has a smaller resistance, like a wider road that lets more cars through. So resistance grows with the length of a conductor and falls with its thickness.',
        hr: 'Grafit vodi električnu struju, ali mnogo lošije od metala: tvoja crta olovkom je otpornik. Što je put kroz grafit dulji, to je otpor veći, baš kao kod žice. Baterija uvijek daje isti napon, ali struja nije uvijek ista: što je otpor veći, struja je slabija, a dioda svijetli slabije. Šira crta ima manji otpor, poput šire ceste koja propušta više automobila. Otpor dakle raste s duljinom vodiča, a opada s njegovom debljinom.'
      },
      measure: {
        en: 'You change the length of the graphite path, you judge the brightness, and you keep the battery, the LED and the width of the tracks the same. Record the brightness (0 to 5) at 2, 4, 6, 8 and 10 cm in three series and work out the mean for each distance. Draw a bar chart of mean brightness against distance.',
        hr: 'Mijenjaš duljinu puta kroz grafit, procjenjuješ sjaj, a bateriju, diodu i širinu traka držiš istima. Zapiši sjaj (0 do 5) na 2, 4, 6, 8 i 10 cm u tri niza i izračunaj srednju vrijednost za svaku udaljenost. Nacrtaj stupčasti dijagram srednjeg sjaja u ovisnosti o udaljenosti.'
      },
      safety: {
        en: 'Never put the LED legs straight onto the battery terminals: the LED burns out at once. Never join the two terminals with metal, because the battery gets hot. Use batteries only, never the mains.',
        hr: 'Nikad ne stavljaj nožice diode izravno na polove baterije: dioda odmah pregori. Nikad ne spajaj dva pola metalom jer se baterija zagrije. Koristi samo baterije, nikad utičnicu.'
      },
      sim: 'resistance'
    },

    {
      id: 'power-home-energy-audit',
      topic: 'electricity',
      type: 'apply',
      level: 2,
      minutes: 40,
      outcome: 'D.8.3',
      title: { en: 'An energy audit of your home', hr: 'Energetski pregled tvojeg doma' },
      question: {
        en: 'Which appliance in your home uses the most electrical energy in one day?',
        hr: 'Koji uređaj u tvojem domu potroši najviše električne energije u jednom danu?'
      },
      materials: {
        en: ['a notebook and a pencil', 'a calculator', 'the rating labels on 6 appliances (for example kettle, hairdryer, television, fridge, LED lamp, internet router)', 'an electricity bill for the price of 1 kWh (optional)'],
        hr: ['bilježnica i olovka', 'kalkulator', 'natpisne pločice na 6 uređaja (na primjer kuhalo za vodu, sušilo za kosu, televizor, hladnjak, LED žarulja, ruter za internet)', 'račun za struju radi cijene 1 kWh (po želji)']
      },
      steps: {
        en: [
          'Choose 6 appliances. Find the rating label on the back, the underside or the charger of each one and read its power in watts (W). Ask an adult to help with labels that are hard to reach.',
          'Draw a table with the columns: appliance, power (W), power (kW), time of use per day (h), energy per day (kWh).',
          'Change watts to kilowatts by dividing by 1000. Estimate honestly how long each appliance is on in one day: a kettle perhaps 6 minutes (0.1 h), a router 24 h. The motor of a fridge runs for about a third of the day, so count 8 h.',
          'Work out the energy for each appliance: energy (kWh) = power (kW) × time (h).',
          'Rank the appliances from the largest to the smallest energy per day and compare this order with the order of their powers.',
          'Multiply each energy by the price of 1 kWh to get the cost per day, and then by 30 for a month. Suggest one change that would save the most.'
        ],
        hr: [
          'Odaberi 6 uređaja. Na svakom pronađi natpisnu pločicu, straga, odozdo ili na punjaču, i očitaj snagu u vatima (W). Za pločice do kojih je teško doći zamoli odraslu osobu za pomoć.',
          'Nacrtaj tablicu sa stupcima: uređaj, snaga (W), snaga (kW), vrijeme rada u danu (h), energija u danu (kWh).',
          'Vate pretvori u kilovate dijeljenjem s 1000. Pošteno procijeni koliko dugo svaki uređaj radi u jednom danu: kuhalo možda 6 minuta (0,1 h), ruter 24 h. Motor hladnjaka radi otprilike trećinu dana, pa računaj 8 h.',
          'Izračunaj energiju za svaki uređaj: energija (kWh) = snaga (kW) × vrijeme (h).',
          'Poredaj uređaje od najveće do najmanje energije u danu i usporedi taj poredak s poretkom njihovih snaga.',
          'Pomnoži svaku energiju s cijenom 1 kWh da dobiješ dnevni trošak, a zatim s 30 za mjesec. Predloži jednu promjenu kojom bi se najviše uštedjelo.'
        ]
      },
      predict: {
        q: {
          en: 'A 2000 W kettle works for 6 minutes a day, a 10 W router for all 24 hours. Which uses more energy in a day?',
          hr: 'Kuhalo snage 2000 W radi 6 minuta na dan, a ruter snage 10 W sva 24 sata. Što u danu potroši više energije?'
        },
        options: [
          { en: 'The kettle: its power is 200 times greater', hr: 'Kuhalo: snaga mu je 200 puta veća' },
          { en: 'The router: it never switches off', hr: 'Ruter: nikad se ne gasi' },
          { en: 'They use exactly the same', hr: 'Troše potpuno jednako' }
        ],
        answer: 1
      },
      observe: {
        en: 'Appliances with a large power that work only briefly, such as the kettle or the hairdryer, end up close to weak appliances that are always on. The top places usually go to appliances that heat or cool for hours: the water heater, the cooker, the washing machine, the fridge.',
        hr: 'Uređaji velike snage koji rade kratko, poput kuhala ili sušila za kosu, završe blizu slabih uređaja koji su stalno uključeni. Na vrhu su obično uređaji koji satima griju ili hlade: bojler, štednjak, perilica rublja, hladnjak.'
      },
      explain: {
        en: 'Power tells you how fast an appliance converts electrical energy: 1 W means 1 joule every second. The energy it uses is the power multiplied by the time, E = P · t. The electricity meter counts this energy in kilowatt-hours: 1 kWh is the energy of a 1 kW appliance working for 1 hour, which is 3 600 000 J. The kettle uses 2 kW × 0.1 h = 0.2 kWh, the router 0.01 kW × 24 h = 0.24 kWh. Judging only by the watts and forgetting the time is the most common mistake.',
        hr: 'Snaga govori koliko brzo uređaj pretvara električnu energiju: 1 W znači 1 džul svake sekunde. Potrošena energija jednaka je umnošku snage i vremena, E = P · t. Električno brojilo tu energiju broji u kilovatsatima: 1 kWh je energija koju uređaj snage 1 kW potroši za 1 sat, a to je 3 600 000 J. Kuhalo potroši 2 kW × 0,1 h = 0,2 kWh, a ruter 0,01 kW × 24 h = 0,24 kWh. Najčešća je pogreška suditi samo po vatima, a zaboraviti vrijeme.'
      },
      safety: {
        en: 'Only read the labels. Do not unplug or move large appliances, do not open anything and do not touch sockets: ask an adult.',
        hr: 'Samo čitaj pločice. Ne isključuj i ne pomiči velike uređaje, ništa ne otvaraj i ne diraj utičnice: zamoli odraslu osobu.'
      },
      sim: 'energychain'
    },

    // ───────────────────────────── MAGNETISM ─────────────────────────────
    {
      id: 'magnet-coin-sorter',
      topic: 'magnetism',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: 'D.8.2',
      title: { en: 'Which coins does a magnet catch?', hr: 'Koje kovanice magnet hvata?' },
      question: {
        en: 'Does a magnet attract every metal, or only some of them?',
        hr: 'Privlači li magnet svaki metal ili samo neke?'
      },
      materials: {
        en: ['a magnet (a strong fridge magnet will do)', 'euro coins of as many kinds as you can find, from 1 cent to 2 euros', 'a piece of aluminium foil', 'a food tin and a drinks can', 'a spoon, a knife and a key', 'a notebook'],
        hr: ['magnet (dovoljan je jači magnet s hladnjaka)', 'eurokovanice, što više različitih, od 1 centa do 2 eura', 'komad aluminijske folije', 'konzerva od hrane i limenka od soka', 'žlica, nož i ključ', 'bilježnica']
      },
      steps: {
        en: [
          'Draw a table with three columns: object, my prediction (yes or no), result. Write a prediction for every coin and object before you test anything.',
          'Lay the coins in a row and bring the magnet slowly to each one. Does the coin jump to the magnet? Can you lift it?',
          'Sort the coins into two piles: attracted and not attracted. Look at the colours in each pile.',
          'Test the foil, the food tin, the drinks can, the spoon, the knife and the key in the same way.',
          'Count how many of your predictions were right. What do the attracted objects have in common?',
          'Take the magnet for a walk round the kitchen: the fridge door, the sink, the bottoms of the pots. Add the results to your table.'
        ],
        hr: [
          'Nacrtaj tablicu s tri stupca: predmet, moja pretpostavka (da ili ne), rezultat. Prije ikakvog ispitivanja upiši pretpostavku za svaku kovanicu i predmet.',
          'Poredaj kovanice u niz i svakoj polako približi magnet. Skoči li kovanica na magnet? Možeš li je podići?',
          'Razvrstaj kovanice na dvije hrpice: one koje magnet privlači i one koje ne privlači. Pogledaj boje u svakoj hrpici.',
          'Na isti način ispitaj foliju, konzervu, limenku, žlicu, nož i ključ.',
          'Prebroji koliko je tvojih pretpostavki bilo točno. Što je zajedničko predmetima koje magnet privlači?',
          'Prošeći s magnetom po kuhinji: vrata hladnjaka, sudoper, dna lonaca. Rezultate dodaj u tablicu.'
        ]
      },
      predict: {
        q: {
          en: 'Which coin will a magnet pick up: a copper-coloured 5 cent coin or a yellow 50 cent coin?',
          hr: 'Koju će kovanicu magnet podići: bakrenastu od 5 centi ili žutu od 50 centi?'
        },
        options: [
          { en: 'Both, because both are metal', hr: 'Obje, jer su obje od metala' },
          { en: 'Only the 5 cent coin', hr: 'Samo kovanicu od 5 centi' },
          { en: 'Neither, because coins are not made of iron', hr: 'Nijednu, jer kovanice nisu od željeza' }
        ],
        answer: 1
      },
      observe: {
        en: 'The 1, 2 and 5 cent coins jump to the magnet. The yellow 10, 20 and 50 cent coins do not react at all. The 1 and 2 euro coins are pulled only weakly, in the middle. The food tin holds firmly, the foil and the drinks can do not; a knife usually sticks, a spoon often does not.',
        hr: 'Kovanice od 1, 2 i 5 centi skoče na magnet. Žute kovanice od 10, 20 i 50 centi uopće ne reagiraju. Kovanice od 1 i 2 eura magnet privlači tek slabo, u sredini. Konzerva se čvrsto drži, folija i limenka ne; nož se obično prihvati, a žlica često ne.'
      },
      explain: {
        en: 'A magnet attracts only a few metals: iron, nickel and cobalt, and steel, which is mostly iron. The small euro coins are made of steel with a thin copper coat, so the magnet catches them although they look like copper. The yellow coins are an alloy of copper, aluminium, zinc and tin with no iron in it. The 1 and 2 euro coins hide a layer of nickel in the middle. Copper, aluminium, gold and silver are not attracted at all, so the idea that magnets pull all metals is wrong. Some stainless steels are not magnetic either.',
        hr: 'Magnet privlači samo nekoliko metala: željezo, nikal i kobalt te čelik, koji je uglavnom željezo. Sitne eurokovanice su od čelika s tankom bakrenom prevlakom, pa ih magnet hvata iako izgledaju kao bakar. Žute kovanice su legura bakra, aluminija, cinka i kositra, bez željeza. Kovanice od 1 i 2 eura u sredini skrivaju sloj nikla. Bakar, aluminij, zlato i srebro magnet uopće ne privlači, pa je pogrešno mišljenje da magnet privlači sve metale. Ni neki nehrđajući čelici nisu magnetični.'
      },
      safety: {
        en: 'Keep the magnet away from bank cards, phones and watches.',
        hr: 'Drži magnet podalje od bankovnih kartica, mobitela i satova.'
      },
      sim: 'magnet'
    },

    {
      id: 'magnet-through-layers',
      topic: 'magnetism',
      type: 'test',
      level: 2,
      minutes: 30,
      outcome: 'D.8.2',
      title: { en: 'Can anything stop a magnet?', hr: 'Može li išta zaustaviti magnet?' },
      question: {
        en: 'Does a magnet pull through cardboard, plastic, aluminium and water, and what weakens it more: the material or the distance?',
        hr: 'Djeluje li magnet kroz karton, plastiku, aluminij i vodu i što ga više slabi: tvar ili udaljenost?'
      },
      materials: {
        en: ['a magnet (a strong fridge magnet or a toy magnet)', 'about 20 equal steel paper clips', '4 equal squares of cardboard, about 5 cm × 5 cm, cut from the same box', 'aluminium foil', 'a plastic lid', 'a glass of water', 'a steel jar lid', 'a notebook'],
        hr: ['magnet (jači magnet s hladnjaka ili magnet iz igračke)', 'oko 20 jednakih čeličnih spajalica', '4 jednaka kvadrata kartona, oko 5 cm × 5 cm, izrezana iz iste kutije', 'aluminijska folija', 'plastični poklopac', 'čaša vode', 'čelični poklopac staklenke', 'bilježnica']
      },
      steps: {
        en: [
          'Dip the magnet into the heap of paper clips, lift it slowly and count the clips that hang on. Do this three times and write down the three numbers.',
          'Hold one cardboard square against the magnet, dip it into the clips with the cardboard in between and count again, three times. Repeat with 2, 3 and 4 squares.',
          'Fold the aluminium foil until it is as thick as one cardboard square. Count the clips through the foil, and then through the plastic lid, three times each.',
          'Drop a paper clip into the glass of water. Can you move it with the magnet from outside, through the glass and the water? Try through the palm of your hand too.',
          'Now hold the steel jar lid between the magnet and the clips and count once more.',
          'Work out the means and draw a bar chart: number of clips against number of cardboard layers.'
        ],
        hr: [
          'Uroni magnet u hrpicu spajalica, polako ga podigni i prebroji spajalice koje vise na njemu. Učini to tri puta i zapiši sva tri broja.',
          'Prisloni jedan kvadrat kartona uz magnet, uroni ga u spajalice tako da karton bude između i ponovno broji, tri puta. Ponovi s 2, 3 i 4 kvadrata.',
          'Presavijaj aluminijsku foliju dok ne bude debela kao jedan kvadrat kartona. Prebroji spajalice kroz foliju, a zatim kroz plastični poklopac, svaki put tri puta.',
          'Ubaci spajalicu u čašu vode. Možeš li je pomicati magnetom izvana, kroz staklo i vodu? Pokušaj i kroz dlan.',
          'Sad između magneta i spajalica drži čelični poklopac staklenke i još jednom prebroji.',
          'Izračunaj srednje vrijednosti i nacrtaj stupčasti dijagram: broj spajalica u ovisnosti o broju slojeva kartona.'
        ]
      },
      predict: {
        q: {
          en: 'Between the magnet and the clips you put folded aluminium foil as thick as one cardboard square. Compared with the cardboard, the magnet will hold…',
          hr: 'Između magneta i spajalica staviš presavijenu aluminijsku foliju debelu kao jedan kvadrat kartona. U usporedbi s kartonom magnet će držati…'
        },
        options: [
          { en: 'far fewer clips: metal blocks magnetism', hr: 'mnogo manje spajalica: metal zaustavlja magnetizam' },
          { en: 'more clips: metal passes magnetism on', hr: 'više spajalica: metal prenosi magnetizam' },
          { en: 'about the same number of clips', hr: 'otprilike jednako spajalica' }
        ],
        answer: 2
      },
      observe: {
        en: 'Each extra layer of cardboard costs you clips, for example 8, 4, 2, 1 and then none. Foil, plastic, glass, water and your hand of the same thickness give about the same number as cardboard. Behind the steel lid hardly any clip is held, and the lid itself sticks to the magnet.',
        hr: 'Sa svakim dodatnim slojem kartona gubiš spajalice, na primjer 8, 4, 2, 1 pa nijedna. Folija, plastika, staklo, voda i dlan jednake debljine daju otprilike isti broj kao karton. Iza čeličnog poklopca magnet ne drži gotovo nijednu spajalicu, a sam se poklopac prihvati za magnet.'
      },
      explain: {
        en: 'A magnetic field passes through cardboard, plastic, glass, water, aluminium and your hand as if they were not there. What weakens the pull is the distance: the field gets weaker very quickly as you move away from the pole. So aluminium does not block a magnet just because it is a metal. Only materials that a magnet attracts, such as iron and steel, change the picture. The steel lid gathers the field into itself and leads it sideways, so that very little of it is left for the clips behind the lid.',
        hr: 'Magnetsko polje prolazi kroz karton, plastiku, staklo, vodu, aluminij i tvoj dlan kao da ih nema. Privlačenje slabi zbog udaljenosti: polje vrlo brzo slabi kad se udaljavaš od pola. Aluminij dakle ne zaustavlja magnet samo zato što je metal. Sliku mijenjaju jedino tvari koje magnet privlači, poput željeza i čelika. Čelični poklopac skuplja polje u sebe i vodi ga u stranu, pa za spajalice iza poklopca ostane vrlo malo polja.'
      },
      measure: {
        en: 'First you change the number of cardboard layers (0 to 4) and count the clips, three times for each number of layers; the magnet, the clips and the way you dip stay the same. Then you keep the thickness the same and change the material. Table: layers, three counts, mean. Draw a bar chart of the means.',
        hr: 'Najprije mijenjaš broj slojeva kartona (0 do 4) i brojiš spajalice, tri puta za svaki broj slojeva; magnet, spajalice i način uranjanja ostaju isti. Zatim debljinu držiš istom, a mijenjaš tvar. Tablica: slojevi, tri brojenja, srednja vrijednost. Nacrtaj stupčasti dijagram srednjih vrijednosti.'
      },
      sim: 'magnet'
    },

    {
      id: 'magnet-screw-motor',
      topic: 'magnetism',
      type: 'project',
      level: 3,
      minutes: 20,
      outcome: 'D.8.2',
      title: { en: 'The simplest electric motor', hr: 'Najjednostavniji elektromotor' },
      question: {
        en: 'Can a battery, a magnet, a screw and a piece of wire make something spin?',
        hr: 'Mogu li baterija, magnet, vijak i komad žice nešto zavrtjeti?'
      },
      materials: {
        en: ['a fresh AA battery (1.5 V)', 'a steel screw 3–5 cm long', 'a small strong disc magnet (neodymium, about 1 cm wide), if you have one', 'about 15 cm of thin copper wire with 1 cm of insulation stripped from each end'],
        hr: ['nova baterija AA (1,5 V)', 'čelični vijak dug 3–5 cm', 'mali jaki magnet u obliku pločice (neodimijski, širok oko 1 cm), ako ga imaš', 'oko 15 cm tanke bakrene žice kojoj je s oba kraja skinut 1 cm izolacije']
      },
      steps: {
        en: [
          'Put the flat magnet on the head of the screw. It holds by itself.',
          'Hold the battery upright and bring the point of the screw to its lower terminal from below. The screw has become a magnet and hangs from the battery by its point.',
          'Press one bare end of the wire onto the upper terminal of the battery with your forefinger.',
          'Touch the other bare end lightly to the rim of the magnet and watch the screw. Take the wire away after 5 seconds at most.',
          'If the screw does not spin, press the wire harder on the terminal, touch the magnet only lightly on its side and check that the wire ends are bare, shiny copper.',
          'Test: turn the magnet over so that its other face is on the screw head and repeat. What changes? Let everything cool for a minute between tries.'
        ],
        hr: [
          'Stavi plosnati magnet na glavu vijka. Drži se sam.',
          'Drži bateriju uspravno i odozdo prinesi vrh vijka njezinu donjem polu. Vijak je postao magnet i vrhom visi na bateriji.',
          'Jedan ogoljeni kraj žice kažiprstom pritisni na gornji pol baterije.',
          'Drugim ogoljenim krajem lagano dotakni rub magneta i promatraj vijak. Odmakni žicu nakon najviše 5 sekundi.',
          'Ako se vijak ne vrti, jače pritisni žicu na pol, magnet dodiruj samo lagano sa strane i provjeri jesu li krajevi žice goli, sjajni bakar.',
          'Provjera: okreni magnet tako da mu na glavi vijka bude druga strana i ponovi pokus. Što se promijenilo? Između pokušaja pusti da se sve hladi jednu minutu.'
        ]
      },
      predict: {
        q: {
          en: 'What happens when the wire touches the rim of the magnet?',
          hr: 'Što se dogodi kad žica dotakne rub magneta?'
        },
        options: [
          { en: 'The screw and the magnet start to spin', hr: 'Vijak i magnet počnu se vrtjeti' },
          { en: 'The screw drops off the battery', hr: 'Vijak otpadne s baterije' },
          { en: 'Nothing moves; the wire only gets warm', hr: 'Ništa se ne miče; žica se samo zagrije' }
        ],
        answer: 0
      },
      observe: {
        en: 'The screw starts to spin at once and within a second it whirrs round very fast. When you turn the magnet over, it spins the other way. The wire and the battery get noticeably warm.',
        hr: 'Vijak se odmah počne vrtjeti i za sekundu se već vrlo brzo vrti uz zujanje. Kad okreneš magnet, vrti se u suprotnom smjeru. Žica i baterija osjetno se zagriju.'
      },
      explain: {
        en: 'When the wire touches the magnet, the circuit is closed: current flows from the battery through the screw and the magnet and back through the wire. Inside the magnet the current runs from the middle to the rim, straight across the magnetic field of the magnet. A magnetic field pushes on a conductor that carries a current, at right angles to both the current and the field. Here that force points sideways, round the axis, so it turns the magnet and the screw. Electrical energy becomes kinetic energy and heat. Every electric motor, in a fan or in an electric car, uses this same force.',
        hr: 'Kad žica dotakne magnet, strujni krug je zatvoren: struja teče iz baterije kroz vijak i magnet te se žicom vraća u bateriju. U magnetu struja teče od sredine prema rubu, poprijeko kroz magnetsko polje samog magneta. Magnetsko polje djeluje silom na vodič kojim teče struja, okomito i na struju i na polje. Ovdje ta sila djeluje u stranu, oko osi, pa zakreće magnet i vijak. Električna energija pretvara se u kinetičku energiju i toplinu. Svaki elektromotor, u ventilatoru ili u električnom automobilu, koristi tu istu silu.'
      },
      safety: {
        en: 'Connect for a few seconds only: this is almost a short circuit, and the wire and the battery heat up quickly. Strong magnets can pinch your skin and must never go into the mouth; keep them away from small children, phones and bank cards. Keep your face away from the spinning screw.',
        hr: 'Spajaj samo na nekoliko sekundi: ovo je gotovo kratki spoj, pa se žica i baterija brzo zagriju. Jaki magneti mogu priklještiti kožu i nikad ne smiju u usta; drži ih podalje od male djece, mobitela i bankovnih kartica. Lice drži dalje od vijka koji se vrti.'
      },
      sim: 'induction'
    },

    // ───────────────────────────── WAVES AND SOUND ─────────────────────────────
    {
      id: 'sound-echo-speed',
      topic: 'waves',
      type: 'test',
      level: 3,
      minutes: 45,
      outcome: '8.7',
      title: { en: 'Measure the speed of sound with an echo', hr: 'Izmjeri brzinu zvuka pomoću jeke' },
      question: {
        en: 'How fast does sound travel through the air, and can you measure it with nothing but claps and a stopwatch?',
        hr: 'Kolikom brzinom zvuk putuje zrakom i možeš li je izmjeriti samo pljeskom i štopericom?'
      },
      materials: {
        en: ['a large flat wall with open space in front of it (a school or a sports hall)', 'two small wooden boards or your hands for clapping', 'a tape measure', 'a phone with a stopwatch', 'a helper', 'a notebook and a calculator'],
        hr: ['velik ravan zid sa slobodnim prostorom ispred njega (škola ili sportska dvorana)', 'dvije daščice ili dlanovi za pljeskanje', 'metar', 'mobitel sa štopericom', 'pomagač', 'bilježnica i kalkulator']
      },
      steps: {
        en: [
          'Stand facing the wall, about 50 to 60 m away. Clap once and listen: you should hear a clear echo.',
          'Measure your distance d from the wall: find the length of 10 of your normal steps with the tape measure, divide by 10 and multiply by the number of steps to the wall.',
          'Clap steadily and change your rhythm until each echo falls exactly halfway between two claps: clap, echo, clap, echo, as evenly as the ticking of a clock.',
          'When the rhythm is steady, your helper starts the stopwatch on one clap (count it as zero) and stops it on clap number 20. Write down the time t.',
          'Repeat the timing five times and work out the mean time.',
          'From one clap to the next the sound could travel to the wall and back twice, a distance of 4 · d. In 20 intervals that is 80 · d, so the speed of sound is v = 80 · d / t.',
          'Compare your result with the textbook value of about 340 m/s.'
        ],
        hr: [
          'Stani licem prema zidu, oko 50 do 60 m od njega. Pljesni jednom i slušaj: trebaš čuti jasnu jeku.',
          'Izmjeri svoju udaljenost d od zida: metrom izmjeri duljinu 10 svojih običnih koraka, podijeli s 10 i pomnoži s brojem koraka do zida.',
          'Plješći ravnomjerno i mijenjaj ritam dok svaka jeka ne padne točno na polovicu vremena između dva pljeska: pljesak, jeka, pljesak, jeka, jednoliko kao kucanje sata.',
          'Kad je ritam ujednačen, pomagač pokrene štopericu na jedan pljesak (broji ga kao nulti) i zaustavi je na dvadeseti. Zapiši vrijeme t.',
          'Mjerenje ponovi pet puta i izračunaj srednje vrijeme.',
          'Od jednog pljeska do sljedećeg zvuk bi stigao dva puta otići do zida i vratiti se, a to je put 4 · d. U 20 razmaka to je 80 · d, pa je brzina zvuka v = 80 · d / t.',
          'Usporedi svoj rezultat s vrijednošću iz udžbenika, oko 340 m/s.'
        ]
      },
      predict: {
        q: {
          en: 'You clap 50 m from a wall. How long after the clap will you hear the echo?',
          hr: 'Plješćeš 50 m od zida. Koliko ćeš vremena nakon pljeska čuti jeku?'
        },
        options: [
          { en: 'After about 0.3 s', hr: 'Nakon otprilike 0,3 s' },
          { en: 'After about 3 s', hr: 'Nakon otprilike 3 s' },
          { en: 'At once: sound needs no time for such a short distance', hr: 'Odmah: zvuku za tako kratak put ne treba vrijeme' }
        ],
        answer: 0
      },
      observe: {
        en: 'The echo comes back about a third of a second after the clap. At 55 m twenty clap intervals take about 13 s, and your result will probably lie between 300 and 380 m/s.',
        hr: 'Jeka se vraća otprilike trećinu sekunde nakon pljeska. Na 55 m dvadeset razmaka između pljesaka traje oko 13 s, a tvoj će rezultat vjerojatno biti između 300 i 380 m/s.'
      },
      explain: {
        en: 'Sound is a wave that travels through air at about 340 m/s: fast, but not instantly. An echo is the sound wave reflected from the wall, so it has travelled there and back, 2 · d. One such trip lasts only about 0.3 s, which is no longer than your reaction time, so a single echo cannot be timed by hand. When you time 20 intervals, the same reaction error is shared among all of them and becomes small. The speed of sound does not depend on how loudly you clap, but it is slightly greater in warmer air.',
        hr: 'Zvuk je val koji se zrakom širi brzinom od oko 340 m/s: brzo, ali ne trenutačno. Jeka je zvučni val odbijen od zida, pa je prešao put do zida i natrag, 2 · d. Jedan takav put traje samo oko 0,3 s, što nije dulje od tvojeg vremena reakcije, pa se jedna jeka ne može mjeriti rukom. Kad mjeriš 20 razmaka, ista se pogreška reakcije raspodijeli na sve njih i postane malena. Brzina zvuka ne ovisi o tome koliko glasno plješćeš, ali je u toplijem zraku malo veća.'
      },
      measure: {
        en: 'Measure the distance d to the wall and the time t of 20 clap intervals, five times. Work out the mean time and v = 80 · d / t. Write down by how many metres per second and by what percentage your result differs from 340 m/s. Keep the place and the rhythm the same in all five trials.',
        hr: 'Izmjeri udaljenost d do zida i vrijeme t za 20 razmaka između pljesaka, pet puta. Izračunaj srednje vrijeme i v = 80 · d / t. Zapiši za koliko se metara u sekundi i za koji postotak tvoj rezultat razlikuje od 340 m/s. U svih pet mjerenja zadrži isto mjesto i isti ritam.'
      },
      safety: {
        en: 'Choose a playground or a yard without traffic, never a road or a car park, and go with an adult or a friend.',
        hr: 'Odaberi igralište ili dvorište bez prometa, nikad cestu ni parkiralište, i pođi s odraslom osobom ili prijateljem.'
      },
      tool: 'stopwatch',
      sim: 'sound'
    },

    {
      id: 'sound-straw-pipes',
      topic: 'waves',
      type: 'test',
      level: 2,
      minutes: 35,
      outcome: '8.7',
      title: { en: 'Pan pipes from drinking straws', hr: 'Panova frula od slamki' },
      question: {
        en: 'How does the pitch of a pipe depend on the length of the air column inside it?',
        hr: 'Kako visina tona svirale ovisi o duljini stupca zraka u njoj?'
      },
      materials: {
        en: ['4 drinking straws of the same width (wide ones are easier to play)', 'scissors and a ruler', 'modelling clay', 'sticky tape', 'the FizLab tone generator on a phone', 'a notebook'],
        hr: ['4 slamke jednake širine (na širima je lakše svirati)', 'škare i ravnalo', 'plastelin', 'selotejp', 'FizLabov generator tona na mobitelu', 'bilježnica']
      },
      steps: {
        en: [
          'Cut the straws to 20 cm, 16 cm, 10 cm and 8 cm. Close the bottom end of each one airtight with a small plug of modelling clay.',
          'Hold the 20 cm straw upright with the open end against your lower lip and blow gently across the top, as you would across a bottle, until you get a clear tone and not just a hiss.',
          'Blow each straw in turn and put them in order from the lowest tone to the highest.',
          'Open the tone generator at low volume. For each straw find the frequency that sounds the same as the straw: blow, listen, adjust. Do this three times for each straw.',
          'Work out the mean frequency for each length. Compare the 20 cm straw with the 10 cm straw, and the 16 cm straw with the 8 cm straw: how many times greater is the frequency of the shorter one?',
          'Tape the straws side by side from the longest to the shortest. Your pan pipes are ready: play a tune.'
        ],
        hr: [
          'Odreži slamke na 20 cm, 16 cm, 10 cm i 8 cm. Donji kraj svake slamke nepropusno zatvori malim čepom od plastelina.',
          'Drži slamku od 20 cm uspravno, otvorenim krajem uz donju usnu, i nježno puši preko vrha, kao preko boce, dok ne dobiješ jasan ton, a ne samo šum.',
          'Puhni redom u svaku slamku i poredaj ih od najnižeg do najvišeg tona.',
          'Otvori generator tona i postavi malu glasnoću. Za svaku slamku pronađi frekvenciju koja zvuči jednako kao slamka: puhni, poslušaj, namjesti. Učini to tri puta za svaku slamku.',
          'Izračunaj srednju frekvenciju za svaku duljinu. Usporedi slamku od 20 cm sa slamkom od 10 cm te slamku od 16 cm sa slamkom od 8 cm: koliko je puta frekvencija kraće slamke veća?',
          'Zalijepi slamke selotejpom jednu uz drugu, od najdulje do najkraće. Tvoja Panova frula je gotova: odsviraj melodiju.'
        ]
      },
      predict: {
        q: {
          en: 'You cut a straw pipe to half its length. What happens to the frequency of its tone?',
          hr: 'Sviralu od slamke skratiš na polovicu duljine. Što se događa s frekvencijom njezina tona?'
        },
        options: [
          { en: 'It is halved', hr: 'Prepolovi se' },
          { en: 'It is doubled', hr: 'Udvostruči se' },
          { en: 'It stays the same', hr: 'Ostaje ista' }
        ],
        answer: 1
      },
      observe: {
        en: 'The shorter the straw, the higher the tone. The four straws give roughly 430, 530, 850 and 1050 Hz, so a straw of half the length has about twice the frequency and sounds an octave higher. If a tone suddenly jumps much higher, you are blowing too hard.',
        hr: 'Što je slamka kraća, ton je viši. Četiri slamke daju otprilike 430, 530, 850 i 1050 Hz, pa upola kraća slamka ima oko dvostruko veću frekvenciju i zvuči za oktavu više. Ako ton odjednom skoči mnogo više, pušeš prejako.'
      },
      explain: {
        en: 'When you blow across the edge, the air column inside the straw starts to vibrate, and this vibrating air is the source of the sound. A long column vibrates slowly, so the frequency is small and the tone is low; a short column vibrates quickly and sounds high. In a pipe closed at one end the wavelength of the tone is about four times the length of the pipe, so half the length means half the wavelength and twice the frequency. Blowing a little harder changes the loudness, which depends on the amplitude, but not the pitch. Flutes and organ pipes work in the same way.',
        hr: 'Kad pušeš preko ruba, stupac zraka u slamci počne titrati i taj je zrak koji titra izvor zvuka. Dugi stupac titra sporo, pa je frekvencija mala, a ton nizak; kratki stupac titra brzo i zvuči visoko. U svirali zatvorenoj na jednom kraju valna duljina tona je oko četiri puta veća od duljine svirale, pa upola kraća svirala daje upola kraću valnu duljinu i dvostruko veću frekvenciju. Malo jače puhanje mijenja glasnoću, koja ovisi o amplitudi, ali ne i visinu tona. Jednako rade flaute i orguljske svirale.'
      },
      measure: {
        en: 'You change the length of the air column, you measure the frequency of the matching tone, and you keep the width of the straw and the way you blow the same. Match each of the four straws three times and work out the mean. Table: length (cm), frequency (Hz), length × frequency. Is the product roughly the same for all four?',
        hr: 'Mijenjaš duljinu stupca zraka, mjeriš frekvenciju tona koji zvuči jednako, a širinu slamke i način puhanja držiš istima. Svaku od četiri slamke usporedi s generatorom tri puta i izračunaj srednju vrijednost. Tablica: duljina (cm), frekvencija (Hz), duljina × frekvencija. Je li umnožak za sve četiri slamke otprilike jednak?'
      },
      safety: {
        en: 'Cut the straws carefully and keep the volume of the tone generator low.',
        hr: 'Slamke reži pažljivo, a generator tona drži na maloj glasnoći.'
      },
      tool: 'tonegen',
      sim: 'sound'
    },

    {
      id: 'sound-dancing-rice',
      topic: 'waves',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: '8.7',
      title: { en: 'See a sound: dancing rice', hr: 'Vidi zvuk: riža koja pleše' },
      question: {
        en: 'Can a sound move things that it does not touch?',
        hr: 'Može li zvuk pomaknuti predmete koje ne dodiruje?'
      },
      materials: {
        en: ['a large bowl', 'cling film', 'a rubber band big enough to go round the bowl', 'a teaspoon of rice or coarse salt', 'a metal pot or baking tray', 'a wooden spoon'],
        hr: ['velika zdjela', 'prozirna folija za hranu', 'gumica dovoljno velika da obuhvati zdjelu', 'žličica riže ili krupne soli', 'metalni lonac ili lim za pečenje', 'kuhača']
      },
      steps: {
        en: [
          'Stretch the cling film tightly over the bowl like the skin of a drum and hold it in place with the rubber band. Smooth out every wrinkle.',
          'Sprinkle about 20 grains of rice on the film.',
          'Hold the pot about 10 cm from the bowl, without touching it, and hit the pot hard with the wooden spoon. Watch the grains.',
          'Repeat from 50 cm and from 1 m. What changes?',
          'Bring your mouth close to the film and hum a long tone, first low, then higher and higher. At which pitch do the grains jump most?',
          'Control test: blow gently across the film. Do the grains move in the same way as with sound?'
        ],
        hr: [
          'Napni prozirnu foliju preko zdjele kao kožu bubnja i učvrsti je gumicom. Izravnaj svaki nabor.',
          'Pospi po foliji dvadesetak zrna riže.',
          'Drži lonac oko 10 cm od zdjele, ne dodirujući je, i snažno udari po njemu kuhačom. Promatraj zrna.',
          'Ponovi s udaljenosti od 50 cm i od 1 m. Što se mijenja?',
          'Približi usta foliji i pjevuši dug ton, prvo dubok, a zatim sve viši. Pri kojoj visini tona zrna najviše skaču?',
          'Kontrolni pokus: lagano puhni preko folije. Gibaju li se zrna jednako kao kod zvuka?'
        ]
      },
      predict: {
        q: {
          en: 'You bang a pot next to the bowl without touching it. What will the grains of rice do?',
          hr: 'Udariš po loncu pokraj zdjele, a da je ne dotakneš. Što će učiniti zrna riže?'
        },
        options: [
          { en: 'Nothing: sound cannot move things', hr: 'Ništa: zvuk ne može pomicati predmete' },
          { en: 'They slide away from the pot, blown by the sound', hr: 'Otklize od lonca jer ih zvuk otpuše' },
          { en: 'They jump up and down', hr: 'Poskakuju gore-dolje' }
        ],
        answer: 2
      },
      observe: {
        en: 'At every bang the grains hop on the spot; from further away they hop less. When you hum, there is one pitch at which they dance wildly. Blowing only rolls them to one side.',
        hr: 'Pri svakom udarcu zrna poskoče na mjestu; s veće udaljenosti poskakuju slabije. Kad pjevušiš, postoji jedna visina tona pri kojoj divlje plešu. Puhanje ih samo otkotrlja na jednu stranu.'
      },
      explain: {
        en: 'The pot vibrates and pushes the air next to it back and forth. These compressions and rarefactions spread through the air as a sound wave. When the wave reaches the tight film, the film starts to vibrate too and throws the grains up. Sound carries energy, but it does not carry air from the pot to the bowl: the air only vibrates around its place, which is why the grains hop instead of being blown away. Your eardrum is a membrane of the same kind. Further from the source the energy is spread more thinly, so the sound is weaker.',
        hr: 'Lonac titra i gura zrak oko sebe naprijed-natrag. Ta se zgušnjenja i razrjeđenja šire zrakom kao zvučni val. Kad val stigne do napete folije, i ona počne titrati pa izbacuje zrna uvis. Zvuk prenosi energiju, ali ne prenosi zrak od lonca do zdjele: zrak samo titra oko svojeg mjesta, i zato zrna poskakuju, a ne odlete. Tvoj bubnjić je opna iste vrste. Dalje od izvora energija je raspoređena na veći prostor, pa je zvuk slabiji.'
      },
      safety: {
        en: 'Do not bang the pot close to anyone’s ears.',
        hr: 'Ne udaraj po loncu blizu ničijih ušiju.'
      },
      sim: 'sound'
    },

    {
      id: 'sound-hearing-range',
      topic: 'waves',
      type: 'apply',
      level: 1,
      minutes: 20,
      outcome: '8.7',
      title: { en: 'How high can you hear?', hr: 'Koliko visoke tonove čuješ?' },
      question: {
        en: 'What are the lowest and the highest tones you can hear, and do adults hear the same range?',
        hr: 'Koji su najniži i najviši ton koje čuješ i čuju li odrasli isti raspon?'
      },
      materials: {
        en: ['the FizLab tone generator on a phone or computer', 'headphones or a good loudspeaker', 'one or two family members of different ages', 'a notebook'],
        hr: ['FizLabov generator tona na mobitelu ili računalu', 'slušalice ili dobar zvučnik', 'jedan ili dva člana obitelji različite dobi', 'bilježnica']
      },
      steps: {
        en: [
          'Open the tone generator and set the volume low, about a quarter. Do not turn it up during the test.',
          'Start at 1000 Hz and raise the frequency step by step: 4000, 8000, 10 000, 12 000 Hz and then in steps of 1000 Hz. Stop at the last tone you can still hear.',
          'Check that you are not imagining it: a helper switches the tone on and off where you cannot see, and you say when you hear it. Do three trials at your limit.',
          'Now go down from 200 Hz: 100, 60, 40, 30, 20 Hz. Write down the lowest tone you hear. Use headphones, because small loudspeakers cannot produce very low tones.',
          'Test an adult, and a grandparent if you can, in the same way and at the same volume.',
          'Make a table: person, age, lowest tone, highest tone. Who has the widest range?'
        ],
        hr: [
          'Otvori generator tona i postavi malu glasnoću, otprilike četvrtinu. Tijekom ispitivanja je ne pojačavaj.',
          'Kreni od 1000 Hz i povećavaj frekvenciju korak po korak: 4000, 8000, 10 000, 12 000 Hz, a zatim u koracima od 1000 Hz. Stani na zadnjem tonu koji još čuješ.',
          'Provjeri da ti se ne pričinja: pomagač uključuje i isključuje ton tako da ti to ne vidiš, a ti kažeš kad ga čuješ. Na svojoj granici napravi tri pokušaja.',
          'Sad se spuštaj od 200 Hz: 100, 60, 40, 30, 20 Hz. Zapiši najniži ton koji čuješ. Koristi slušalice jer mali zvučnici ne mogu proizvesti vrlo duboke tonove.',
          'Na isti način i uz istu glasnoću ispitaj odraslu osobu, a ako možeš, i baku ili djeda.',
          'Napravi tablicu: osoba, dob, najniži ton, najviši ton. Tko ima najširi raspon?'
        ]
      },
      predict: {
        q: {
          en: 'Who will hear the highest tones: you, a parent or a grandparent?',
          hr: 'Tko će čuti najviše tonove: ti, roditelj ili baka i djed?'
        },
        options: [
          { en: 'I will: young ears hear the highest tones', hr: 'Ja: mlade uši čuju najviše tonove' },
          { en: 'The adults: their hearing is fully grown', hr: 'Odrasli: njihov je sluh potpuno razvijen' },
          { en: 'Everyone hears the same range', hr: 'Svi čuju jednak raspon' }
        ],
        answer: 0
      },
      observe: {
        en: 'You probably hear up to 17 000–19 000 Hz, a parent perhaps up to 13 000–16 000 Hz and a grandparent up to 8000–12 000 Hz. With good headphones the lowest tone is near 20–30 Hz. A phone loudspeaker falls silent below about 200 Hz, but that is the limit of the loudspeaker, not of your ear.',
        hr: 'Ti vjerojatno čuješ do 17 000–19 000 Hz, roditelj možda do 13 000–16 000 Hz, a baka ili djed do 8000–12 000 Hz. S dobrim slušalicama najniži je ton oko 20–30 Hz. Zvučnik mobitela utihne ispod otprilike 200 Hz, ali to je granica zvučnika, a ne tvojeg uha.'
      },
      explain: {
        en: 'Frequency is the number of vibrations in one second, measured in hertz, and it decides the pitch of a tone. A healthy young ear hears from about 20 Hz to about 20 000 Hz. Slower vibrations are called infrasound and faster ones ultrasound; dogs and bats hear ultrasound, we do not. In the inner ear tiny sensory cells answer to different frequencies, and those for the highest tones wear out first as we grow older, so the upper limit slowly falls. Loud noise damages these cells much sooner, and they do not grow back.',
        hr: 'Frekvencija je broj titraja u jednoj sekundi, mjeri se u hercima i određuje visinu tona. Zdravo mlado uho čuje od oko 20 Hz do oko 20 000 Hz. Sporije titranje zovemo infrazvuk, a brže ultrazvuk; psi i šišmiši čuju ultrazvuk, mi ne. U unutarnjem uhu sitne osjetne stanice odgovaraju na različite frekvencije, a one za najviše tonove starenjem prve stradaju, pa se gornja granica polako spušta. Glasna buka te stanice oštećuje mnogo ranije, a one se ne obnavljaju.'
      },
      safety: {
        en: 'Keep the volume low all the time, especially with headphones. Never turn it up to find a tone: a high tone can harm your ears even when you can hardly hear it.',
        hr: 'Cijelo vrijeme drži malu glasnoću, osobito sa slušalicama. Nikad ne pojačavaj u potrazi za tonom: visoki ton može oštetiti uši i kad ga jedva čuješ.'
      },
      tool: 'tonegen',
      sim: 'sound'
    },

    {
      id: 'wave-rope-pulses',
      topic: 'waves',
      type: 'observe',
      level: 1,
      minutes: 15,
      outcome: '8.7',
      title: { en: 'Waves on a rope: what really travels?', hr: 'Valovi na užetu: što zapravo putuje?' },
      question: {
        en: 'When a wave runs along a rope, does the rope itself travel with it?',
        hr: 'Kad val putuje po užetu, putuje li s njim i samo uže?'
      },
      materials: {
        en: ['a rope 4–6 m long (a washing line, a long skipping rope or a garden hose)', 'a door handle or a friend to hold the other end', 'a piece of coloured ribbon or wool', 'a long corridor or a yard'],
        hr: ['uže dugo 4–6 m (uže za rublje, duga vijača ili vrtno crijevo)', 'kvaka ili prijatelj koji drži drugi kraj', 'komad vrpce ili vune u boji', 'dug hodnik ili dvorište']
      },
      steps: {
        en: [
          'Tie one end of the rope to the door handle and tie the ribbon round the middle of the rope. Hold the other end so that the rope is lightly stretched.',
          'Flick your wrist quickly up and down once. Watch the bump travel to the door and back.',
          'Send another bump and this time watch only the ribbon. Which way does it move?',
          'Look carefully at the bump that comes back from the door. Is it on the same side of the rope as when it left?',
          'Pull the rope tighter and send a bump, then let the rope hang looser. When is the bump faster?',
          'Now move your hand up and down steadily, first slowly and then quickly. How does the length of the waves change?'
        ],
        hr: [
          'Zaveži jedan kraj užeta za kvaku, a oko sredine užeta zaveži vrpcu. Drugi kraj drži tako da uže bude lagano napeto.',
          'Jednom brzo trzni zglobom gore-dolje. Promatraj kako brijeg putuje do vrata i natrag.',
          'Pošalji još jedan brijeg i ovaj put gledaj samo vrpcu. Kamo se ona giba?',
          'Pažljivo pogledaj brijeg koji se vraća od vrata. Je li na istoj strani užeta kao kad je krenuo?',
          'Jače napni uže i pošalji brijeg, a zatim uže malo opusti. Kada je brijeg brži?',
          'Sad ravnomjerno pomiči ruku gore-dolje, prvo polako, a zatim brzo. Kako se mijenja duljina valova?'
        ]
      },
      predict: {
        q: {
          en: 'A bump runs along the rope past the ribbon. What does the ribbon do?',
          hr: 'Brijeg putuje po užetu i prolazi kraj vrpce. Što učini vrpca?'
        },
        options: [
          { en: 'It travels with the bump to the door', hr: 'Otputuje s brijegom do vrata' },
          { en: 'It moves up and down and stays in its place', hr: 'Pomakne se gore-dolje i ostane na svojem mjestu' },
          { en: 'It does not move at all', hr: 'Uopće se ne pomakne' }
        ],
        answer: 1
      },
      observe: {
        en: 'The bump runs to the door in less than a second, but the ribbon only jumps up and returns to its place. The bump comes back from the fixed end upside down. On a tighter rope it travels faster, and faster shaking gives shorter waves.',
        hr: 'Brijeg stigne do vrata za manje od sekunde, ali vrpca samo poskoči i vrati se na svoje mjesto. Od učvršćenog kraja brijeg se vraća okrenut na drugu stranu. Na napetijem užetu putuje brže, a brže mahanje daje kraće valove.'
      },
      explain: {
        en: 'A wave carries energy from place to place, but not matter. Each piece of the rope only oscillates around its own position and passes the motion on to its neighbour, so the ribbon stays where it was. The rope moves across the direction in which the wave travels: this is a transverse wave. The speed of the wave depends on the rope, on how tight and how heavy it is, and not on how hard you flick. When you shake faster, the frequency is greater and, at the same speed, the wavelength is shorter.',
        hr: 'Val prenosi energiju s mjesta na mjesto, ali ne i tvar. Svaki djelić užeta samo titra oko svojeg položaja i predaje gibanje susjednom djeliću, pa vrpca ostaje gdje je bila. Uže se giba okomito na smjer u kojem val putuje: to je transverzalni val. Brzina vala ovisi o užetu, o tome koliko je napeto i koliko je teško, a ne o tome koliko jako trzneš. Kad mašeš brže, frekvencija je veća, a uz istu brzinu valna duljina je manja.'
      },
      safety: {
        en: 'Do not whip the rope near people’s faces or breakable things.',
        hr: 'Ne trzaj užetom blizu tuđih lica ni lomljivih stvari.'
      },
      sim: 'waves'
    },

    // ───────────────────────────── LIGHT ─────────────────────────────
    {
      id: 'light-pinhole-camera',
      topic: 'light',
      type: 'project',
      level: 2,
      minutes: 40,
      outcome: '8.8',
      title: { en: 'A pinhole camera from a box', hr: 'Tamna komora od kutije' },
      question: {
        en: 'Can a tiny hole make a picture of the world without any lens?',
        hr: 'Može li sićušna rupica stvoriti sliku svijeta bez ikakve leće?'
      },
      materials: {
        en: ['a small cardboard box (a shoe box or a tea box)', 'aluminium foil', 'baking paper', 'a pin', 'scissors and sticky tape', 'a dark towel or blanket'],
        hr: ['manja kartonska kutija (od cipela ili od čaja)', 'aluminijska folija', 'papir za pečenje', 'pribadača', 'škare i selotejp', 'tamni ručnik ili deka']
      },
      steps: {
        en: [
          'Cut a window 2 cm × 2 cm in the middle of one end of the box. Tape foil over it and prick one clean round hole in the middle of the foil with the pin.',
          'Cut away most of the opposite end, leaving a frame 1 cm wide, and tape a piece of baking paper tightly over it. This is your screen.',
          'Close the box and tape over every gap, so that light can enter only through the pinhole.',
          'In daytime point the pinhole at a bright window or at sunlit houses and trees. Throw the towel over your head and the screen end of the box, so that only the pinhole end sticks out.',
          'Give your eyes half a minute to get used to the dark and look at the screen from about 20 cm. Ask someone to wave in front of the window.',
          'Test: make the hole 3 mm wide with the tip of a pencil. Is the picture brighter? Is it sharper?'
        ],
        hr: [
          'Na sredini jedne manje stranice kutije izreži prozorčić 2 cm × 2 cm. Prelijepi ga folijom i pribadačom probuši jednu urednu okruglu rupicu u sredini folije.',
          'Izreži veći dio suprotne stranice tako da ostane okvir širok 1 cm i preko njega napeto zalijepi komad papira za pečenje. To je tvoj zastor.',
          'Zatvori kutiju i selotejpom prelijepi svaku pukotinu, tako da svjetlost može ući samo kroz rupicu.',
          'Danju okreni rupicu prema svijetlom prozoru ili prema kućama i drveću obasjanima suncem. Prebaci ručnik preko glave i kraja kutije sa zastorom, tako da viri samo kraj s rupicom.',
          'Pričekaj pola minute da ti se oči priviknu na mrak i gledaj zastor s udaljenosti od oko 20 cm. Zamoli nekoga da maše ispred prozora.',
          'Provjera: vrhom olovke proširi rupicu na 3 mm. Je li slika svjetlija? Je li oštrija?'
        ]
      },
      predict: {
        q: {
          en: 'How will the picture of the window look on the screen?',
          hr: 'Kako će na zastoru izgledati slika prozora?'
        },
        options: [
          { en: 'Upright, as on a phone screen', hr: 'Uspravno, kao na zaslonu mobitela' },
          { en: 'There will be no picture, only a bright spot', hr: 'Neće biti slike, samo svijetla mrlja' },
          { en: 'Upside down and with left and right swapped', hr: 'Naopako i sa zamijenjenom lijevom i desnom stranom' }
        ],
        answer: 2
      },
      observe: {
        en: 'On the screen you see a dim picture of the window in colour, upside down and with left and right swapped; a waving hand moves the opposite way. With the bigger hole the picture is brighter but blurred. If you see nothing, make it darker under the towel and choose a brighter view.',
        hr: 'Na zastoru vidiš blijedu sliku prozora u boji, naopaku i sa zamijenjenom lijevom i desnom stranom; ruka koja maše giba se u suprotnom smjeru. S većom rupicom slika je svjetlija, ali mutna. Ako ne vidiš ništa, bolje se zamrači ručnikom i odaberi svjetliji prizor.'
      },
      explain: {
        en: 'Light travels in straight lines. From every point of the window only a narrow beam gets through the tiny hole. Light from the top of the window passes downwards through the hole and lands at the bottom of the screen, and light from the bottom lands at the top: the rays cross in the hole, so the picture is upside down. No lens is needed for that. Through a bigger hole each point of the window makes a small patch instead of a point; the patches overlap and the picture is brighter but blurred. Your eye works like this box, and the picture on its retina is also upside down.',
        hr: 'Svjetlost se širi pravocrtno. Iz svake točke prozora kroz sićušnu rupicu prođe samo uzak snop. Svjetlost s vrha prozora prolazi kroz rupicu prema dolje i pada na dno zastora, a svjetlost s dna pada na vrh: zrake se u rupici križaju, pa je slika naopaka. Za to nije potrebna leća. Kroz veću rupicu svaka točka prozora daje malu mrlju umjesto točke; mrlje se preklapaju i slika je svjetlija, ali mutna. Tvoje oko radi poput ove kutije, a i slika na njegovoj mrežnici je naopaka.'
      },
      safety: {
        en: 'Scissors and pins are sharp. Never point the camera at the Sun and never look at the Sun through the hole.',
        hr: 'Škare i pribadača su oštre. Nikad ne usmjeravaj komoru prema Suncu i nikad ne gledaj Sunce kroz rupicu.'
      },
      sim: 'lens'
    },

    {
      id: 'light-periscope',
      topic: 'light',
      type: 'project',
      level: 2,
      minutes: 45,
      outcome: '8.8',
      title: { en: 'A periscope from milk cartons', hr: 'Periskop od tetrapaka' },
      question: {
        en: 'How can two mirrors let you see over a wall or round a corner?',
        hr: 'Kako ti dva zrcala mogu omogućiti da vidiš preko zida ili iza ugla?'
      },
      materials: {
        en: ['2 empty one-litre milk or juice cartons, washed and dry', '2 small flat mirrors, each about as wide as a carton', 'scissors', 'strong sticky tape', 'a ruler and a pencil'],
        hr: ['2 prazna tetrapaka od mlijeka ili soka od jedne litre, oprana i suha', '2 mala ravna zrcala, svako široko otprilike kao tetrapak', 'škare', 'jaka ljepljiva traka', 'ravnalo i olovka']
      },
      steps: {
        en: [
          'Cut the tops off both cartons. Push the open ends together and tape them firmly, so that you get one long box closed at both ends.',
          'Cut a window about 5 cm high in one face of the box, right at the bottom end. Cut the same window in the opposite face, right at the top end.',
          'Lay the box down with the window faces to the left and right. Measure the width of the carton, about 7 cm. At each end draw a slanting line on the side facing you: from the corner at the end of the box on the window side to a point 7 cm along the opposite long edge. The two lines must be parallel.',
          'Cut a slit along both lines, and matching slits in the side wall exactly behind them.',
          'Slide a mirror through each pair of slits with its shiny face towards the nearest window, and tape it in place.',
          'Hold the periscope upright and look into the bottom window. If you see only the inside of the box, one mirror is not at 45°: correct its tilt.',
          'Test: crouch behind a sofa and look over it, then hold the periscope sideways and look round a corner. Can you read a text through it?'
        ],
        hr: [
          'Odreži vrhove s oba tetrapaka. Otvorene krajeve spoji i čvrsto zalijepi trakom, tako da dobiješ jednu dugu kutiju zatvorenu na oba kraja.',
          'Na jednoj strani kutije, sasvim pri donjem kraju, izreži prozor visok oko 5 cm. Jednak prozor izreži na suprotnoj strani, sasvim pri gornjem kraju.',
          'Polegni kutiju tako da strane s prozorima budu lijevo i desno. Izmjeri širinu tetrapaka, oko 7 cm. Na strani okrenutoj prema tebi nacrtaj pri svakom kraju kosu crtu: od ugla na kraju kutije na strani prozora do točke udaljene 7 cm duž suprotnog dugog brida. Dvije crte moraju biti usporedne.',
          'Duž obje crte izreži prorez, a jednake proreze izreži i na bočnoj strani točno iza njih.',
          'Kroz svaki par proreza uvuci zrcalo, sjajnom stranom okrenutom prema najbližem prozoru, i učvrsti ga trakom.',
          'Drži periskop uspravno i pogledaj kroz donji prozor. Ako vidiš samo unutrašnjost kutije, jedno zrcalo nije pod kutom od 45°: popravi mu nagib.',
          'Provjera: čučni iza kauča i pogledaj preko njega, a zatim periskop okreni vodoravno i pogledaj iza ugla. Možeš li kroz njega pročitati tekst?'
        ]
      },
      predict: {
        q: {
          en: 'In a periscope the light is reflected twice. How will a poster on the wall look through it?',
          hr: 'U periskopu se svjetlost odbije dva puta. Kako će kroz njega izgledati plakat na zidu?'
        },
        options: [
          { en: 'Upside down', hr: 'Naopako' },
          { en: 'Upright, and the text can be read normally', hr: 'Uspravno, a tekst se normalno čita' },
          { en: 'Upright, but in mirror writing', hr: 'Uspravno, ali u zrcalnom pismu' }
        ],
        answer: 1
      },
      observe: {
        en: 'Through the bottom window you see what is in front of the top window, upright and the right way round, so that you can read text normally. The view is narrow and a little darker than with the naked eye.',
        hr: 'Kroz donji prozor vidiš ono što je ispred gornjeg prozora, uspravno i neizokrenuto, pa tekst možeš normalno čitati. Vidno polje je usko i malo tamnije nego golim okom.'
      },
      explain: {
        en: 'A mirror reflects light so that the angle of reflection is equal to the angle of incidence. A ray that hits a mirror tilted at 45° therefore turns through a right angle. The top mirror sends the light from the scene down the box, and the bottom mirror turns it once more, into your eye. The light leaves in the same direction in which it arrived, only lower down. One mirror alone swaps the picture, as you know from mirror writing, but the second mirror swaps it back. That is why the image is neither upside down nor mirrored.',
        hr: 'Zrcalo odbija svjetlost tako da je kut odbijanja jednak upadnom kutu. Zraka koja padne na zrcalo nagnuto pod 45° zato skrene za pravi kut. Gornje zrcalo šalje svjetlost s prizora niz kutiju, a donje je još jednom zakrene, u tvoje oko. Svjetlost izlazi u istom smjeru u kojem je došla, samo niže. Jedno zrcalo samo po sebi izokrene sliku, što znaš po zrcalnom pismu, ali drugo zrcalo je vrati. Zato slika nije ni naopaka ni zrcalno okrenuta.'
      },
      safety: {
        en: 'Cartons are tough to cut: ask an adult to help with the slits. Handle the mirrors carefully, and never look at the Sun through the periscope.',
        hr: 'Tetrapak se teško reže: zamoli odraslu osobu da ti pomogne s prorezima. Pažljivo rukuj zrcalima i nikad ne gledaj Sunce kroz periskop.'
      },
      sim: 'light'
    },

    {
      id: 'light-kaleidoscope',
      topic: 'light',
      type: 'project',
      level: 2,
      minutes: 45,
      outcome: '8.8',
      title: { en: 'A kaleidoscope from a cardboard tube', hr: 'Kaleidoskop od kartonskog tuljca' },
      question: {
        en: 'How do three mirrors turn a few beads into an endless pattern?',
        hr: 'Kako tri zrcala od nekoliko perlica naprave beskrajan uzorak?'
      },
      materials: {
        en: ['a cardboard tube from a kitchen roll', 'stiff clear plastic from packaging (or card covered smoothly with aluminium foil)', 'black paper', 'scissors, a ruler and sticky tape', 'cling film, baking paper and 2 rubber bands', 'a pinch of small coloured beads, sequins or scraps of coloured paper', 'a piece of card for the eyepiece'],
        hr: ['kartonski tuljac od papirnatih ručnika', 'kruta prozirna plastika s ambalaže (ili karton glatko oblijepljen aluminijskom folijom)', 'crni papir', 'škare, ravnalo i selotejp', 'prozirna folija za hranu, papir za pečenje i 2 gumice', 'prstohvat sitnih šarenih perlica, šljokica ili komadića papira u boji', 'komad kartona za okular']
      },
      steps: {
        en: [
          'Cut three strips 3.5 cm wide and 20 cm long from the clear plastic, and three equal strips of black paper. Tape a black strip to the back of each plastic strip.',
          'Lay the three strips side by side, black side down, with gaps of 2 mm, and tape them together. Fold them into a triangular tube with the plastic inside and tape the last edge.',
          'Slide the triangular tube into the cardboard tube. If it is loose, pad it with paper; if it does not fit, trim the strips a little narrower.',
          'Stretch cling film over one end of the tube and fix it with a rubber band. Press the film in gently to make a shallow hollow and put the beads into it.',
          'Cover the hollow with baking paper and the second rubber band, so that the beads can move but cannot fall out.',
          'Cut a card disc with a hole 1 cm wide in the middle and tape it over the other end as an eyepiece.',
          'Test: point the kaleidoscope at a bright window, look in and turn it slowly. How many copies of one bead can you count?'
        ],
        hr: [
          'Od prozirne plastike izreži tri trake široke 3,5 cm i duge 20 cm te tri jednake trake crnog papira. Na poleđinu svake plastične trake zalijepi crnu traku.',
          'Položi tri trake jednu do druge, crnom stranom prema dolje, s razmacima od 2 mm, i spoji ih selotejpom. Savij ih u trokutastu cijev tako da plastika bude iznutra i zalijepi zadnji brid.',
          'Uvuci trokutastu cijev u kartonski tuljac. Ako je labava, podloži je papirom; ako ne stane, malo suzi trake.',
          'Preko jednog kraja tuljca napni prozirnu foliju i učvrsti je gumicom. Lagano utisni foliju da nastane plitka udubina i u nju stavi perlice.',
          'Pokrij udubinu papirom za pečenje i drugom gumicom, tako da se perlice mogu micati, ali ne mogu ispasti.',
          'Izreži kartonski krug s rupom širokom 1 cm u sredini i zalijepi ga na drugi kraj kao okular.',
          'Provjera: usmjeri kaleidoskop prema svijetlom prozoru, pogledaj kroz njega i polako ga okreći. Koliko kopija jedne perlice možeš izbrojiti?'
        ]
      },
      predict: {
        q: {
          en: 'Three mirrors face one another in a triangle. How many images of one bead will you see?',
          hr: 'Tri zrcala gledaju jedno u drugo u obliku trokuta. Koliko ćeš slika jedne perlice vidjeti?'
        },
        options: [
          { en: 'Three: one in each mirror', hr: 'Tri: po jednu u svakom zrcalu' },
          { en: 'One: the mirrors cancel each other', hr: 'Jednu: zrcala se međusobno poništavaju' },
          { en: 'Many, repeated in a regular pattern', hr: 'Mnogo, ponovljenih u pravilnom uzorku' }
        ],
        answer: 2
      },
      observe: {
        en: 'The whole field of view is filled with triangles in which the beads repeat again and again, with six triangles meeting round every corner. The pattern changes as you turn the tube, and the copies further out are dimmer. If the picture is dull, clean the strips and point at a brighter light.',
        hr: 'Cijelo vidno polje ispunjeno je trokutima u kojima se perlice uvijek iznova ponavljaju, a oko svakog vrha sastaje se šest trokuta. Uzorak se mijenja dok okrećeš tuljac, a udaljenije kopije su tamnije. Ako je slika mutna, očisti trake i usmjeri kaleidoskop prema jačem svjetlu.'
      },
      explain: {
        en: 'Each mirror makes an image of the beads by reflection. But each mirror also sees the other two mirrors together with their images, and reflects them as well: you get images of images of images. Because the mirrors meet at 60°, the copies fit together without gaps, six round every corner, since 6 × 60° = 360°. A little light is lost at every reflection, so the far copies are dimmer. The answer is not three images, one per mirror, because light can bounce many times before it reaches your eye.',
        hr: 'Svako zrcalo odbijanjem stvara sliku perlica. No svako zrcalo vidi i druga dva zrcala zajedno s njihovim slikama, pa odbija i njih: nastaju slike slika i slike tih slika. Budući da se zrcala sastaju pod kutom od 60°, kopije se slažu bez praznina, po šest oko svakog vrha, jer je 6 × 60° = 360°. Pri svakom odbijanju izgubi se malo svjetlosti, pa su daleke kopije tamnije. Odgovor nije tri slike, po jedna u svakom zrcalu, jer se svjetlost može odbiti mnogo puta prije nego što stigne u tvoje oko.'
      },
      safety: {
        en: 'Cut plastic can have sharp edges: cut slowly and ask an adult for help. Never look at the Sun through the kaleidoscope.',
        hr: 'Izrezana plastika može imati oštre rubove: reži polako i zamoli odraslu osobu za pomoć. Nikad ne gledaj Sunce kroz kaleidoskop.'
      },
      sim: 'light'
    },

    {
      id: 'light-comb-reflection',
      topic: 'light',
      type: 'test',
      level: 2,
      minutes: 35,
      outcome: '8.8',
      title: { en: 'The law of reflection with a comb and a torch', hr: 'Zakon odbijanja uz pomoć češlja i svjetiljke' },
      question: {
        en: 'At what angle does a ray of light leave a mirror?',
        hr: 'Pod kojim kutom zraka svjetlosti napušta zrcalo?'
      },
      materials: {
        en: ['a small flat mirror', 'a comb', 'a torch or the light of a phone', 'a sheet of white paper', 'a ruler, a pencil and a protractor', 'sticky tape', 'modelling clay or a book to hold the mirror upright', 'a room you can darken'],
        hr: ['malo ravno zrcalo', 'češalj', 'džepna svjetiljka ili svjetlo mobitela', 'list bijelog papira', 'ravnalo, olovka i kutomjer', 'selotejp', 'plastelin ili knjiga koja drži zrcalo uspravno', 'soba koju možeš zamračiti']
      },
      steps: {
        en: [
          'Draw a straight line across the paper and, from its middle, a dashed line at right angles to it: the normal. Stand the mirror upright on the first line.',
          'Cover the teeth of the comb with tape so that only one gap stays open. Stand the comb on the paper about 10 cm in front of the mirror.',
          'Darken the room. Lay the torch on the table about half a metre behind the comb, so that a narrow ray runs across the paper and hits the mirror exactly at the foot of the normal.',
          'Mark two dots on the incoming ray and two dots on the reflected ray. Switch on the light and join the dots with the ruler.',
          'Measure the angle between the incoming ray and the normal (the angle of incidence) and the angle between the reflected ray and the normal (the angle of reflection).',
          'Repeat for five different directions of the ray, from steep to shallow, using a new colour or a new sheet each time. Write the pairs of angles in a table.'
        ],
        hr: [
          'Nacrtaj ravnu crtu preko papira, a iz njezine sredine isprekidanu crtu okomitu na nju: okomicu. Postavi zrcalo uspravno na prvu crtu.',
          'Prelijepi zupce češlja selotejpom tako da ostane otvoren samo jedan razmak. Postavi češalj na papir oko 10 cm ispred zrcala.',
          'Zamrači sobu. Položi svjetiljku na stol oko pola metra iza češlja, tako da uska zraka ide preko papira i pogodi zrcalo točno u podnožju okomice.',
          'Označi dvije točke na upadnoj zraci i dvije na odbijenoj zraci. Upali svjetlo i spoji točke ravnalom.',
          'Izmjeri kut između upadne zrake i okomice (upadni kut) i kut između odbijene zrake i okomice (kut odbijanja).',
          'Ponovi za pet različitih smjerova zrake, od strmih do položenih, svaki put drugom bojom ili na novom listu. Parove kutova upiši u tablicu.'
        ]
      },
      predict: {
        q: {
          en: 'A ray hits the mirror at 30° to the normal. At what angle to the normal does it leave?',
          hr: 'Zraka pada na zrcalo pod kutom od 30° prema okomici. Pod kojim kutom prema okomici odlazi?'
        },
        options: [
          { en: 'At 30°, on the other side of the normal', hr: 'Pod 30°, s druge strane okomice' },
          { en: 'At 60°', hr: 'Pod 60°' },
          { en: 'It goes straight back to the torch', hr: 'Vraća se ravno prema svjetiljci' }
        ],
        answer: 0
      },
      observe: {
        en: 'The reflected ray leaves on the other side of the normal, and the two angles agree to within 2 or 3 degrees every time. Only a ray that arrives along the normal goes straight back.',
        hr: 'Odbijena zraka odlazi s druge strane okomice, a dva se kuta svaki put podudaraju unutar 2 ili 3 stupnja. Samo zraka koja dolazi duž okomice vraća se ravno natrag.'
      },
      explain: {
        en: 'This is the law of reflection: the angle of reflection is equal to the angle of incidence. Both angles are measured from the normal, not from the mirror, and the two rays and the normal lie in the same plane. A mirror therefore does not send light back to where it came from, unless the ray arrives along the normal. A mirror is smooth, so parallel rays stay parallel after reflection and you see an image. Paper is rough: it reflects light in all directions, which is why you can see it from every side but cannot see yourself in it.',
        hr: 'To je zakon odbijanja svjetlosti: kut odbijanja jednak je upadnom kutu. Oba se kuta mjere od okomice, a ne od zrcala, a obje zrake i okomica leže u istoj ravnini. Zrcalo dakle ne vraća svjetlost onamo odakle je došla, osim ako zraka dolazi duž okomice. Zrcalo je glatko, pa usporedne zrake nakon odbijanja ostaju usporedne i vidiš sliku. Papir je hrapav: odbija svjetlost u svim smjerovima, pa ga vidiš sa svih strana, ali se u njemu ne možeš ogledati.'
      },
      measure: {
        en: 'You change the angle of incidence, you measure the angle of reflection, and you keep the mirror and the point where the ray hits it the same. Measure both angles for five different rays and repeat one of them three times to see how much your readings scatter. Table: angle of incidence, angle of reflection, difference.',
        hr: 'Mijenjaš upadni kut, mjeriš kut odbijanja, a zrcalo i točku u koju zraka pada držiš istima. Izmjeri oba kuta za pet različitih zraka, a jednu od njih ponovi tri puta da vidiš koliko se tvoja očitanja rasipaju. Tablica: upadni kut, kut odbijanja, razlika.'
      },
      safety: {
        en: 'Do not shine the torch into anyone’s eyes, and handle the mirror carefully.',
        hr: 'Ne svijetli svjetiljkom nikome u oči i pažljivo rukuj zrcalom.'
      },
      sim: 'light'
    },

    {
      id: 'light-flipping-arrow',
      topic: 'light',
      type: 'observe',
      level: 1,
      minutes: 10,
      outcome: '8.9',
      title: { en: 'The arrow that turns round', hr: 'Strelica koja se okrene' },
      question: {
        en: 'Can a glass of water turn a drawing round without anyone touching it?',
        hr: 'Može li čaša vode okrenuti crtež, a da ga nitko ne dotakne?'
      },
      materials: {
        en: ['a smooth round drinking glass', 'a jug of water', 'a piece of paper and a thick felt-tip pen', 'a book to lean the paper against'],
        hr: ['glatka okrugla čaša', 'vrč vode', 'komad papira i debeli flomaster', 'knjiga na koju ćeš nasloniti papir']
      },
      steps: {
        en: [
          'Draw two arrows on the paper, one above the other, both pointing to the left and each about 4 cm long. Lean the paper against the book.',
          'Stand the empty glass about 10 cm in front of the paper, so that you see the lower arrow through the glass and the upper arrow above it.',
          'Look from about half a metre away and pour water slowly into the glass until it rises above the lower arrow.',
          'Compare the two arrows. Which way does each one point now?',
          'Slide the glass slowly towards the paper until it touches it, and watch the lower arrow all the time.',
          'Write a word on the paper and try to read it through the glass of water.'
        ],
        hr: [
          'Nacrtaj na papiru dvije strelice, jednu iznad druge, obje usmjerene ulijevo i duge oko 4 cm. Nasloni papir na knjigu.',
          'Postavi praznu čašu oko 10 cm ispred papira, tako da donju strelicu vidiš kroz čašu, a gornju iznad nje.',
          'Gledaj s udaljenosti od oko pola metra i polako ulijevaj vodu u čašu dok se ne podigne iznad donje strelice.',
          'Usporedi dvije strelice. Kamo je sada usmjerena svaka od njih?',
          'Polako primiči čašu papiru dok ga ne dotakne i cijelo vrijeme promatraj donju strelicu.',
          'Napiši na papiru neku riječ i pokušaj je pročitati kroz čašu vode.'
        ]
      },
      predict: {
        q: {
          en: 'What will happen to the lower arrow when water fills the glass in front of it?',
          hr: 'Što će se dogoditi s donjom strelicom kad voda ispuni čašu ispred nje?'
        },
        options: [
          { en: 'It will look bigger but point the same way', hr: 'Izgledat će veća, ali će pokazivati isti smjer' },
          { en: 'It will point the other way', hr: 'Pokazivat će u suprotnom smjeru' },
          { en: 'It will only become blurred', hr: 'Samo će postati mutna' }
        ],
        answer: 1
      },
      observe: {
        en: 'Through the water the lower arrow points to the right, while the upper arrow still points to the left. When the glass comes close to the paper, the arrow stretches, smears and then flips back, now only widened. Words seen through the glass are in mirror writing.',
        hr: 'Kroz vodu donja strelica pokazuje udesno, dok gornja i dalje pokazuje ulijevo. Kad se čaša približi papiru, strelica se rastegne, razmaže i zatim okrene natrag, sada samo proširena. Riječi gledane kroz čašu ispisane su zrcalnim pismom.'
      },
      explain: {
        en: 'A round glass of water acts as a converging lens. Light is refracted when it enters the water and again when it leaves, so the rays from the left and the right end of the arrow are bent towards each other. They cross behind the glass and continue with left and right swapped, and that is what your eye receives. The glass is curved only sideways, so up and down do not change. When the arrow is very close to the glass, the rays do not cross before they reach you, and you see an upright, widened image, as through a magnifying glass.',
        hr: 'Okrugla čaša vode djeluje kao sabirna leća. Svjetlost se lomi kad ulazi u vodu i ponovno kad iz nje izlazi, pa se zrake s lijevog i desnog kraja strelice skrenu jedna prema drugoj. Iza čaše se ukrste i nastave sa zamijenjenom lijevom i desnom stranom, i takve stižu u tvoje oko. Čaša je zakrivljena samo postrance, pa se gore i dolje ne mijenjaju. Kad je strelica sasvim blizu čaše, zrake se ne ukrste prije nego što stignu do tebe i vidiš uspravnu, proširenu sliku, kao kroz povećalo.'
      },
      sim: 'lens'
    },

    {
      id: 'lens-focal-length',
      topic: 'light',
      type: 'test',
      level: 3,
      minutes: 30,
      outcome: '8.9',
      title: { en: 'The focal length of a magnifying glass', hr: 'Žarišna daljina povećala' },
      question: {
        en: 'How far from a magnifying glass does the sharp picture of a distant window form?',
        hr: 'Na kojoj udaljenosti od povećala nastaje oštra slika udaljenog prozora?'
      },
      materials: {
        en: ['a magnifying glass', 'a sheet of white paper', 'a ruler or a tape measure', 'a room with a window, in daytime with the lights off', 'a helper', 'a notebook'],
        hr: ['povećalo', 'list bijelog papira', 'ravnalo ili metar', 'soba s prozorom, danju i s ugašenim svjetlom', 'pomagač', 'bilježnica']
      },
      steps: {
        en: [
          'Stand by the wall opposite the window, at least 3 m from the window, and hold the paper flat against the wall.',
          'Hold the magnifying glass close to the paper, facing the window, and move it slowly away from the paper until a small sharp picture of the window appears.',
          'Look closely at the picture. Which way up is it? Ask your helper to walk past the window.',
          'Your helper measures the distance from the middle of the lens to the paper. Write it down in centimetres.',
          'Take the lens away, find the sharp picture again and measure again. Do this five times and work out the mean: this is the focal length f.',
          'Cover the upper half of the lens with your hand and watch the picture.',
          'Work out the power of the lens in dioptres: divide 1 by the focal length in metres.'
        ],
        hr: [
          'Stani uza zid nasuprot prozoru, barem 3 m od prozora, i drži papir prislonjen na zid.',
          'Drži povećalo blizu papira, okrenuto prema prozoru, i polako ga odmiči od papira dok se ne pojavi mala oštra slika prozora.',
          'Dobro pogledaj sliku. Kako je okrenuta? Zamoli pomagača da prođe ispred prozora.',
          'Pomagač mjeri udaljenost od sredine leće do papira. Zapiši je u centimetrima.',
          'Odmakni leću, ponovno pronađi oštru sliku i ponovno izmjeri. Učini to pet puta i izračunaj srednju vrijednost: to je žarišna daljina f.',
          'Pokrij rukom gornju polovicu leće i promatraj sliku.',
          'Izračunaj jakost leće u dioptrijama: podijeli 1 sa žarišnom daljinom u metrima.'
        ]
      },
      predict: {
        q: {
          en: 'You cover the upper half of the lens with your hand. What happens to the picture of the window?',
          hr: 'Rukom pokriješ gornju polovicu leće. Što se događa sa slikom prozora?'
        },
        options: [
          { en: 'The upper half of the picture disappears', hr: 'Nestane gornja polovica slike' },
          { en: 'The lower half disappears, because the picture is upside down', hr: 'Nestane donja polovica, jer je slika obrnuta' },
          { en: 'The whole picture stays, only dimmer', hr: 'Ostaje cijela slika, samo tamnija' }
        ],
        answer: 2
      },
      observe: {
        en: 'At one particular distance, usually between 10 and 25 cm, a small, sharp, coloured picture of the window appears, upside down. Repeated measurements agree to within about 1 cm. With half of the lens covered, the whole picture is still there, only dimmer.',
        hr: 'Na jednoj određenoj udaljenosti, obično između 10 i 25 cm, pojavi se mala, oštra slika prozora u boji, obrnuta. Ponovljena mjerenja podudaraju se unutar otprilike 1 cm. Kad je polovica leće pokrivena, cijela je slika i dalje tu, samo tamnija.'
      },
      explain: {
        en: 'A magnifying glass is a converging lens, thicker in the middle than at the edge. It refracts parallel rays so that they meet in one point, the focus. The window is far away, so the rays from each of its points arrive almost parallel and the picture forms almost exactly at the focus: the distance from the lens to the paper is the focal length. The image is real, because it can be caught on a screen, and it is upside down. Every part of the lens sends light from every point of the window to its place in the image, so half a lens still gives the whole picture, with half the light.',
        hr: 'Povećalo je sabirna (konvergentna) leća, deblja u sredini nego na rubu. Usporedne zrake lomi tako da se sastanu u jednoj točki, žarištu. Prozor je daleko, pa zrake iz svake njegove točke stižu gotovo usporedne i slika nastaje gotovo točno u žarištu: udaljenost od leće do papira je žarišna daljina. Slika je realna, jer se može uhvatiti na zastoru, i obrnuta je. Svaki dio leće šalje svjetlost iz svake točke prozora na njezino mjesto u slici, pa i polovica leće daje cijelu sliku, s upola manje svjetlosti.'
      },
      measure: {
        en: 'Measure the distance from the lens to the sharp picture five times, with the same lens and the same distant window. Work out the mean, and take half the difference between the largest and the smallest value as the uncertainty, for example f = (18 ± 1) cm. Then work out the power: 1 / 0.18 m ≈ 5.6 dioptres.',
        hr: 'Izmjeri udaljenost od leće do oštre slike pet puta, s istom lećom i istim udaljenim prozorom. Izračunaj srednju vrijednost, a kao nesigurnost uzmi polovicu razlike najveće i najmanje vrijednosti, na primjer f = (18 ± 1) cm. Zatim izračunaj jakost: 1 / 0,18 m ≈ 5,6 dioptrija.'
      },
      safety: {
        en: 'Never look at the Sun through the lens and never leave the lens lying in sunshine: it gathers sunlight into a point hot enough to burn skin and set paper on fire.',
        hr: 'Nikad ne gledaj Sunce kroz leću i ne ostavljaj je na suncu: ona skuplja Sunčevu svjetlost u točku dovoljno vruću da opeče kožu i zapali papir.'
      },
      tool: 'datalab',
      sim: 'lens'
    },

    // ───────────────────────────── SPACE ─────────────────────────────
    {
      id: 'space-toilet-paper-scale',
      topic: 'space',
      type: 'apply',
      level: 2,
      minutes: 40,
      title: { en: 'The Solar System on a roll of toilet paper', hr: 'Sunčev sustav na roli toaletnog papira' },
      question: {
        en: 'How far apart are the planets really, if the whole Solar System is shrunk to the length of a corridor?',
        hr: 'Koliko su planeti zaista udaljeni jedan od drugoga ako cijeli Sunčev sustav smanjimo na duljinu hodnika?'
      },
      materials: {
        en: ['a roll of toilet paper with at least 50 sheets', 'a felt-tip pen', 'a calculator', 'a corridor or a yard at least 5 m long', 'a notebook'],
        hr: ['rola toaletnog papira s najmanje 50 listića', 'flomaster', 'kalkulator', 'hodnik ili dvorište dugo barem 5 m', 'bilježnica']
      },
      steps: {
        en: [
          'Copy the distances from the Sun in millions of kilometres: Mercury 58, Venus 108, Earth 150, Mars 228, Jupiter 778, Saturn 1430, Uranus 2870, Neptune 4500.',
          'The scale of your model is: 1 sheet = 100 million km. Divide each distance by 100 to get the number of sheets, for example 1.5 sheets for the Earth.',
          'Unroll 46 sheets along the corridor without tearing them. Draw a dot for the Sun on the edge of the first sheet.',
          'Count the sheets and mark Mercury, Venus, Earth and Mars with the pen. Write the names next to the marks.',
          'Carry on to Jupiter, Saturn, Uranus and Neptune.',
          'Stand at the Sun and look along the strip. Then find the middle of the strip: which planets are near it?',
          'Work it out: light needs 8 minutes and 20 seconds from the Sun to the Earth. How long does it need to reach Neptune?'
        ],
        hr: [
          'Prepiši udaljenosti od Sunca u milijunima kilometara: Merkur 58, Venera 108, Zemlja 150, Mars 228, Jupiter 778, Saturn 1430, Uran 2870, Neptun 4500.',
          'Mjerilo tvojeg modela je: 1 listić = 100 milijuna km. Svaku udaljenost podijeli sa 100 da dobiješ broj listića, na primjer 1,5 listića za Zemlju.',
          'Odmotaj 46 listića duž hodnika, bez trganja. Na rubu prvog listića nacrtaj točku za Sunce.',
          'Broji listiće i flomasterom označi Merkur, Veneru, Zemlju i Mars. Uz oznake napiši imena.',
          'Nastavi do Jupitera, Saturna, Urana i Neptuna.',
          'Stani kod Sunca i pogledaj duž trake. Zatim pronađi sredinu trake: koji su planeti blizu nje?',
          'Izračunaj: svjetlosti treba 8 minuta i 20 sekundi od Sunca do Zemlje. Koliko joj treba do Neptuna?'
        ]
      },
      predict: {
        q: {
          en: 'The strip from the Sun to Neptune is 45 sheets long. Where on it are Mercury, Venus, the Earth and Mars?',
          hr: 'Traka od Sunca do Neptuna duga je 45 listića. Gdje su na njoj Merkur, Venera, Zemlja i Mars?'
        },
        options: [
          { en: 'Spread evenly over the first half', hr: 'Jednoliko raspoređeni po prvoj polovici' },
          { en: 'All four on the first 3 sheets', hr: 'Sva četiri na prva 3 listića' },
          { en: 'On the first 10 sheets', hr: 'Na prvih 10 listića' }
        ],
        answer: 1
      },
      observe: {
        en: 'The four inner planets crowd together on the first two and a half sheets. After that come long empty stretches: Jupiter at sheet 8, Saturn at 14, Uranus at 29 and Neptune at 45. The middle of the strip is empty, between Saturn and Uranus.',
        hr: 'Četiri unutarnja planeta stisnuta su na prva dva i pol listića. Nakon toga slijede duge praznine: Jupiter je na 8. listiću, Saturn na 14., Uran na 29., a Neptun na 45. Sredina trake je prazna, između Saturna i Urana.'
      },
      explain: {
        en: 'Pictures in books show the planets large and evenly spaced, because a picture drawn to scale would not fit on a page. In reality the Solar System is almost entirely empty space. On your scale the Sun would be a dot only 1.5 mm wide, and the Earth a speck a hundred times smaller, too small to see. A scale model divides every real distance by the same number, so the ratios stay true. Light reaches Neptune after about 4 hours, and the nearest star would be more than 40 km away on this scale.',
        hr: 'Slike u knjigama prikazuju planete velike i jednoliko razmaknute, jer crtež u pravom mjerilu ne bi stao na stranicu. U stvarnosti je Sunčev sustav gotovo sasvim prazan prostor. U tvojem mjerilu Sunce bi bilo točka široka samo 1,5 mm, a Zemlja zrnce sto puta manje, premalo da se vidi. Model u mjerilu svaku stvarnu udaljenost dijeli istim brojem, pa omjeri ostaju točni. Svjetlost do Neptuna stiže nakon otprilike 4 sata, a najbliža zvijezda bila bi u ovom mjerilu udaljena više od 40 km.'
      },
      sim: 'space'
    },

    {
      id: 'space-slanted-sunlight',
      topic: 'space',
      type: 'test',
      level: 2,
      minutes: 30,
      title: { en: 'Why slanting sunlight warms less', hr: 'Zašto kose Sunčeve zrake griju slabije' },
      question: {
        en: 'What happens to a beam of light when it falls on a surface at a slant instead of straight on?',
        hr: 'Što se događa sa snopom svjetlosti kad na površinu padne koso umjesto okomito?'
      },
      materials: {
        en: ['a torch (or a phone light with a toilet-roll tube taped in front of it)', 'a sheet of squared paper', 'a hardback book', 'sticky tape', 'a ruler', 'pencils in three colours', 'a room you can darken'],
        hr: ['džepna svjetiljka (ili svjetlo mobitela s tuljcem od toaletnog papira zalijepljenim ispred njega)', 'list papira na kvadratiće', 'knjiga tvrdih korica', 'selotejp', 'ravnalo', 'olovke u tri boje', 'soba koju možeš zamračiti']
      },
      steps: {
        en: [
          'Tape the squared paper onto the book. Lay the torch on a pile of books so that it shines horizontally.',
          'Darken the room. Hold the book upright 20 cm in front of the torch, so that the beam hits the paper straight on. Trace the edge of the bright patch.',
          'Keep the middle of the patch 20 cm from the torch and tilt the book back until the paper makes an angle of about 60° with the beam (two thirds of a right angle). Trace the patch in another colour.',
          'Tilt the book further, to about 30° between the paper and the beam (one third of a right angle), and trace the patch in a third colour.',
          'Count the squares inside each outline. Count a square if more than half of it is inside.',
          'Repeat all three positions three times and work out the mean number of squares for each.'
        ],
        hr: [
          'Zalijepi papir na kvadratiće na knjigu. Položi svjetiljku na hrpu knjiga tako da svijetli vodoravno.',
          'Zamrači sobu. Drži knjigu uspravno 20 cm ispred svjetiljke, tako da snop pada na papir okomito. Ocrtaj rub svijetle mrlje.',
          'Zadrži sredinu mrlje 20 cm od svjetiljke i nagni knjigu unatrag dok papir sa snopom ne zatvara kut od oko 60° (dvije trećine pravog kuta). Ocrtaj mrlju drugom bojom.',
          'Nagni knjigu još više, na oko 30° između papira i snopa (trećina pravog kuta), i ocrtaj mrlju trećom bojom.',
          'Prebroji kvadratiće unutar svakog obrisa. Kvadratić broji ako je više od polovice unutra.',
          'Sva tri položaja ponovi tri puta i za svaki izračunaj srednji broj kvadratića.'
        ]
      },
      predict: {
        q: {
          en: 'The beam hits the paper at 30° instead of straight on. How many squares does it light up now?',
          hr: 'Snop pada na papir pod kutom od 30° umjesto okomito. Koliko kvadratića sada osvjetljava?'
        },
        options: [
          { en: 'The same number: it is the same beam', hr: 'Jednako: snop je isti' },
          { en: 'About half as many', hr: 'Otprilike upola manje' },
          { en: 'About twice as many', hr: 'Otprilike dvostruko više' }
        ],
        answer: 2
      },
      observe: {
        en: 'Straight on, the patch is a small bright circle. On the tilted paper it stretches into a longer and dimmer oval. At 60° it covers only a few more squares, but at 30° about twice as many as at the start.',
        hr: 'Kad snop pada okomito, mrlja je mali svijetli krug. Na nagnutom papiru rastegne se u dulji i tamniji oval. Pod 60° pokriva tek nešto više kvadratića, a pod 30° otprilike dvostruko više nego na početku.'
      },
      explain: {
        en: 'The torch gives out the same amount of light energy every second, however the paper is tilted. On a slanted surface this energy is spread over a larger area, so every square receives less: at 30° only about half. The same happens to sunlight. In winter the Sun stands low, its rays strike the ground at a slant and every square metre receives less energy; the days are shorter too. This comes from the tilt of the Earth’s axis, not from the distance to the Sun: the Earth is in fact closest to the Sun in early January.',
        hr: 'Svjetiljka svake sekunde daje jednaku količinu svjetlosne energije, kako god papir bio nagnut. Na kosoj površini ta se energija raspodijeli na veću površinu, pa svaki kvadratić dobije manje: pod 30° samo oko polovice. Isto se događa sa Sunčevom svjetlošću. Zimi je Sunce nisko, zrake padaju na tlo koso i svaki kvadratni metar dobiva manje energije, a i dani su kraći. Uzrok je nagib Zemljine osi, a ne udaljenost od Sunca: Zemlja je zapravo najbliža Suncu početkom siječnja.'
      },
      measure: {
        en: 'You change the angle between the beam and the paper (90°, 60°, 30°), you count the lit squares, and you keep the torch and its distance the same. Count three times for each angle and work out the mean. Divide each mean by the mean at 90°: how many times larger is the patch?',
        hr: 'Mijenjaš kut između snopa i papira (90°, 60°, 30°), brojiš osvijetljene kvadratiće, a svjetiljku i njezinu udaljenost držiš istima. Za svaki kut broji tri puta i izračunaj srednju vrijednost. Svaku srednju vrijednost podijeli s onom za 90°: koliko je puta mrlja veća?'
      },
      sim: 'space'
    },

    {
      id: 'space-flour-craters',
      topic: 'space',
      type: 'test',
      level: 2,
      minutes: 40,
      title: { en: 'Craters in flour', hr: 'Krateri u brašnu' },
      question: {
        en: 'How does the width of a crater depend on the height from which the falling body is dropped?',
        hr: 'Kako širina kratera ovisi o visini s koje tijelo pada?'
      },
      materials: {
        en: ['a deep baking tin or a washing-up bowl', 'about 1 kg of flour', 'a little cocoa powder and a small sieve', 'a marble or a small round pebble', 'a ruler and a tape measure', 'old newspapers for the floor', 'a notebook'],
        hr: ['duboki lim za pečenje ili plastična posuda za pranje', 'oko 1 kg brašna', 'malo kakaa u prahu i malo sito', 'špekula (staklena kuglica) ili mali okrugli kamenčić', 'ravnalo i metar', 'stare novine za pod', 'bilježnica']
      },
      steps: {
        en: [
          'Spread the newspapers on the floor, best of all outdoors or on a balcony. Fill the tin with flour 3 to 4 cm deep, level it without pressing and sift a thin layer of cocoa over it.',
          'Hold the marble 20 cm above the surface and let it go without pushing.',
          'Lift the marble out carefully and measure the width of the crater from rim to rim in millimetres.',
          'Drop the marble from 20 cm three times, each time onto a fresh spot. Then do three drops each from 40, 60, 80 and 100 cm.',
          'When the tin is full of craters, level the flour and dust it with cocoa again.',
          'Write all the widths in a table, work out the mean for each height and draw a graph of mean width against height.'
        ],
        hr: [
          'Raširi novine po podu, najbolje vani ili na balkonu. Napuni lim brašnom do visine 3 do 4 cm, poravnaj ga bez pritiskanja i preko njega prosij tanak sloj kakaa.',
          'Drži špekulu 20 cm iznad površine i pusti je bez guranja.',
          'Pažljivo izvadi špekulu i izmjeri širinu kratera od ruba do ruba u milimetrima.',
          'Ispusti špekulu s 20 cm tri puta, svaki put na svježe mjesto. Zatim je po tri puta ispusti s 40, 60, 80 i 100 cm.',
          'Kad je lim pun kratera, poravnaj brašno i ponovno ga pospi kakaom.',
          'Upiši sve širine u tablicu, izračunaj srednju vrijednost za svaku visinu i nacrtaj graf srednje širine u ovisnosti o visini.'
        ]
      },
      predict: {
        q: {
          en: 'You drop the marble from 100 cm instead of 20 cm, five times higher. The crater will be…',
          hr: 'Špekulu ispustiš sa 100 cm umjesto s 20 cm, s pet puta veće visine. Krater će biti…'
        },
        options: [
          { en: 'wider, but far less than five times', hr: 'širi, ali mnogo manje od pet puta' },
          { en: 'about five times wider', hr: 'oko pet puta širi' },
          { en: 'equally wide, only deeper', hr: 'jednako širok, samo dublji' }
        ],
        answer: 0
      },
      observe: {
        en: 'A higher drop makes a wider and deeper crater, and white flour is thrown out over the brown cocoa in rays. The width grows more and more slowly: from 100 cm the crater is only about one and a half times as wide as from 20 cm.',
        hr: 'Pad s veće visine stvara širi i dublji krater, a bijelo brašno izbačeno je preko smeđeg kakaa u obliku zraka. Širina raste sve sporije: krater sa 100 cm samo je oko jedan i pol puta širi od onoga s 20 cm.'
      },
      explain: {
        en: 'The higher the marble starts, the more gravitational potential energy it has. During the fall this energy turns into kinetic energy, and on impact it does the work of pushing the flour aside and throwing it out. More energy makes a bigger crater, but not in proportion: a crater that is twice as wide is also deeper, so much more flour has to be moved. The craters on the Moon were made in the same way, by bodies arriving at many kilometres per second. The Moon has no air, water or weather to erase them; on the Earth most craters have been worn away.',
        hr: 'Što je špekula na početku više, to ima više gravitacijske potencijalne energije. Tijekom pada ta se energija pretvara u kinetičku, a pri udaru obavlja rad: razmiče brašno i izbacuje ga. Više energije stvara veći krater, ali ne razmjerno: dvostruko širi krater je i dublji, pa treba pomaknuti mnogo više brašna. Krateri na Mjesecu nastali su na isti način, udarima tijela koja su doletjela brzinom od mnogo kilometara u sekundi. Mjesec nema zraka, vode ni vremenskih prilika koje bi ih izbrisale; na Zemlji je većina kratera istrošena.'
      },
      measure: {
        en: 'You change the drop height (20, 40, 60, 80, 100 cm), you measure the width of the crater in millimetres, and you keep the marble and the flour the same. Do three drops from each height and work out the mean. Enter the means in the FizLab tool Data Table and Graph and look at the graph: is it a straight line through zero or a curve that flattens?',
        hr: 'Mijenjaš visinu pada (20, 40, 60, 80, 100 cm), mjeriš širinu kratera u milimetrima, a špekulu i brašno držiš istima. Sa svake visine ispusti špekulu tri puta i izračunaj srednju vrijednost. Unesi srednje vrijednosti u FizLabov alat Tablica i graf i pogledaj graf: je li to pravac kroz ishodište ili krivulja koja se izravnava?'
      },
      tool: 'datalab',
      sim: 'space'
    },

    // ───────────────────────────── SCIENCE ─────────────────────────────
    {
      id: 'science-black-box',
      topic: 'science',
      type: 'apply',
      level: 1,
      minutes: 25,
      outcome: '7.10',
      title: { en: 'The black box: find out without looking', hr: 'Crna kutija: otkrij bez gledanja' },
      question: {
        en: 'How can you find out what is inside a sealed box that you are not allowed to open?',
        hr: 'Kako možeš otkriti što je u zatvorenoj kutiji koju ne smiješ otvoriti?'
      },
      materials: {
        en: ['a shoe box with a lid', 'sticky tape', '1 to 3 small household objects chosen secretly by a helper', 'a magnet', 'a kitchen scale', 'a second, empty box of the same kind', 'a notebook'],
        hr: ['kutija od cipela s poklopcem', 'selotejp', '1 do 3 mala predmeta iz kuće koje potajno odabere pomagač', 'magnet', 'kuhinjska vaga', 'druga, prazna kutija iste vrste', 'bilježnica']
      },
      steps: {
        en: [
          'Ask your helper to put one, two or three small objects into the box in secret, tape it shut and write down what is inside. You must not open the box.',
          'Draw two columns in your notebook: "what I observe" and "what I conclude". Tilt the box slowly in every direction and shake it gently. Does something roll or slide? How many things do you hear? Do they sound hard or soft?',
          'Use your tools. Slide the magnet along the outside of the box: does anything follow it? Weigh the box and the empty box and work out the mass of the contents.',
          'Write a hypothesis: draw what you think is inside, how many objects, and their shape, size and material.',
          'Think of one new test that could show your hypothesis is wrong. A ball, for example, must roll in every direction, a pencil only in one. Carry out the test.',
          'Write down your final model of the contents and how much you trust it, in per cent. Only then open the box and compare.'
        ],
        hr: [
          'Zamoli pomagača da u kutiju potajno stavi jedan, dva ili tri mala predmeta, zalijepi je selotejpom i zapiše što je unutra. Kutiju ne smiješ otvoriti.',
          'U bilježnici nacrtaj dva stupca: "što opažam" i "što zaključujem". Polako naginji kutiju u svim smjerovima i lagano je protresi. Kotrlja li se nešto ili klizi? Koliko predmeta čuješ? Zvuče li tvrdo ili mekano?',
          'Posluži se priborom. Prelazi magnetom po vanjskoj strani kutije: slijedi li ga nešto? Izvaži kutiju i praznu kutiju pa izračunaj masu sadržaja.',
          'Napiši hipotezu: nacrtaj što misliš da je unutra, koliko je predmeta te kakvi su im oblik, veličina i tvar.',
          'Smisli jedan novi pokus koji bi mogao pokazati da je tvoja hipoteza pogrešna. Kuglica se, na primjer, mora kotrljati u svim smjerovima, a olovka samo u jednom. Izvedi taj pokus.',
          'Zapiši svoj konačni model sadržaja i koliko mu vjeruješ, u postocima. Tek tada otvori kutiju i usporedi.'
        ]
      },
      predict: {
        q: {
          en: 'How sure can anyone be about what is in the box without opening it?',
          hr: 'Koliko se sigurno može znati što je u kutiji, a da se ona ne otvori?'
        },
        options: [
          { en: 'Completely sure, if you shake it long enough', hr: 'Potpuno sigurno, ako se kutija dovoljno dugo trese' },
          { en: 'Not at all: without seeing, it is only guessing', hr: 'Nikako: bez gledanja to je samo nagađanje' },
          { en: 'Never completely, but more with every test that agrees', hr: 'Nikad potpuno, ali sve sigurnije sa svakim pokusom koji se slaže' }
        ],
        answer: 2
      },
      observe: {
        en: 'You can usually tell how many objects there are, whether they roll or slide, whether a magnet attracts them and roughly how heavy they are. You cannot tell their colour. Two investigators often propose different contents that fit the same observations.',
        hr: 'Obično možeš odrediti koliko je predmeta unutra, kotrljaju li se ili klize, privlači li ih magnet i koliko su otprilike teški. Boju im ne možeš odrediti. Dva istraživača često predlože različit sadržaj koji odgovara istim opažanjima.'
      },
      explain: {
        en: 'This is how science studies things that nobody can look into: the inside of an atom, the core of the Earth or a distant star. Scientists collect observations, build a model that explains all of them and then try to knock it down with new tests. A model that survives many tests deserves trust, but it stays open to correction. So science is neither complete certainty nor mere guessing. It is important to keep an observation, such as a metallic rattle, apart from a conclusion, such as "it is a coin". Rutherford found the nucleus of the atom in this way, without ever seeing it.',
        hr: 'Ovako znanost istražuje ono u što nitko ne može zaviriti: unutrašnjost atoma, Zemljinu jezgru ili daleku zvijezdu. Znanstvenici prikupljaju opažanja, grade model koji ih sva objašnjava, a zatim ga novim pokusima pokušavaju srušiti. Model koji preživi mnogo provjera zaslužuje povjerenje, ali ostaje otvoren za ispravke. Znanost dakle nije ni potpuna sigurnost ni puko nagađanje. Važno je odvojiti opažanje, na primjer metalno zveckanje, od zaključka, na primjer "to je kovanica". Rutherford je tako otkrio atomsku jezgru, a da je nikad nije vidio.'
      },
      sim: 'inquiry'
    },

    {
      id: 'science-paper-helicopter',
      topic: 'science',
      type: 'test',
      level: 3,
      minutes: 45,
      outcome: '7.10',
      title: { en: 'The paper helicopter: a fair test', hr: 'Papirnati helikopter: pošten pokus' },
      question: {
        en: 'How does the length of the wings change the time a paper helicopter takes to fall?',
        hr: 'Kako duljina krila mijenja vrijeme padanja papirnatog helikoptera?'
      },
      materials: {
        en: ['a sheet of A4 paper', 'scissors and a ruler', '2 paper clips', 'a phone with a stopwatch', 'a helper', 'a notebook'],
        hr: ['list papira A4', 'škare i ravnalo', '2 spajalice', 'mobitel sa štopericom', 'pomagač', 'bilježnica']
      },
      steps: {
        en: [
          'Cut a strip 6 cm wide and 21 cm long from the paper. From one end cut along the middle to a depth of 4 cm: these are the two wings. Fold one wing towards you and the other away from you.',
          'At 11 cm from the wing end cut 2 cm in from each side. Fold the two side flaps below these cuts inwards to make a narrow stem, and slide one paper clip onto its lower end.',
          'Hold the helicopter by the stem as high as you can reach while standing on the floor and let it go. Your helper times the fall with the stopwatch. Do five drops, always from the same height.',
          'Lengthen the middle cut to 6 cm, fold the wings at the new place and do five drops again. Then do the same with wings 8 cm and 10 cm long.',
          'Work out the mean fall time for each wing length and draw a graph of mean time against wing length.',
          'Now change one other thing of your choice, for example two paper clips instead of one, keep everything else the same and test with five drops.'
        ],
        hr: [
          'Izreži iz papira traku široku 6 cm i dugu 21 cm. S jednog kraja zareži po sredini 4 cm duboko: to su dva krila. Jedno krilo savij prema sebi, a drugo od sebe.',
          'Na 11 cm od kraja s krilima zareži 2 cm sa svake strane. Dva bočna dijela ispod tih zareza savij prema unutra da dobiješ uzak trup i na njegov donji kraj stavi jednu spajalicu.',
          'Drži helikopter za trup što više možeš dosegnuti stojeći na podu i pusti ga. Pomagač štopericom mjeri vrijeme pada. Ispusti ga pet puta, uvijek s iste visine.',
          'Produlji srednji zarez na 6 cm, savij krila na novom mjestu i ponovno ga ispusti pet puta. Zatim isto učini s krilima dugima 8 cm i 10 cm.',
          'Izračunaj srednje vrijeme pada za svaku duljinu krila i nacrtaj graf srednjeg vremena u ovisnosti o duljini krila.',
          'Sad promijeni još jednu stvar po svojem izboru, na primjer dvije spajalice umjesto jedne, sve ostalo zadrži isto i ispitaj s pet ispuštanja.'
        ]
      },
      predict: {
        q: {
          en: 'All four helicopters have the same mass. Which wing length gives the longest fall?',
          hr: 'Sva četiri helikoptera imaju jednaku masu. Uz koju duljinu krila pad traje najdulje?'
        },
        options: [
          { en: 'The longest wings, 10 cm', hr: 'Uz najdulja krila, 10 cm' },
          { en: 'The shortest wings, 4 cm: they spin fastest', hr: 'Uz najkraća krila, 4 cm: ona se najbrže vrte' },
          { en: 'All fall equally: the mass is the same', hr: 'Svi padaju jednako: masa je ista' }
        ],
        answer: 0
      },
      observe: {
        en: 'After the first half metre the helicopter starts to spin and then sinks at a steady speed. The longer the wings, the longer the fall: from 2 m about 1.3 s with 4 cm wings and about 2 s with 10 cm wings. With two paper clips it falls faster.',
        hr: 'Nakon prvih pola metra helikopter se počne vrtjeti i zatim se spušta stalnom brzinom. Što su krila dulja, pad traje dulje: s 2 m oko 1,3 s uz krila od 4 cm i oko 2 s uz krila od 10 cm. S dvije spajalice pada brže.'
      },
      explain: {
        en: 'Gravity pulls the helicopter down and air resistance on the wings holds it back. Longer wings catch more air, so the two forces balance at a lower speed and the fall lasts longer. The mass was the same every time, because you used the same paper and the same clip, and that is the whole point of a fair test: you change only one variable (the wing length), you measure one (the fall time) and you keep all the others the same. If the wings and the clips had changed together, nobody could say which of them caused the difference. Five drops and a mean reduce the error of your reaction time.',
        hr: 'Sila teža vuče helikopter prema dolje, a otpor zraka na krilima ga zadržava. Dulja krila zahvaćaju više zraka, pa se dvije sile izjednače pri manjoj brzini i pad traje dulje. Masa je svaki put bila ista jer je papir isti i spajalica ista, a upravo je to bit poštenog pokusa: mijenjaš samo jednu varijablu (duljinu krila), mjeriš jednu (vrijeme pada), a sve ostale držiš istima. Da su se krila i spajalice mijenjali zajedno, ne bi se moglo reći što je uzrokovalo razliku. Pet ispuštanja i srednja vrijednost smanjuju pogrešku zbog vremena reakcije.'
      },
      measure: {
        en: 'Time five drops from the same height for each of the four wing lengths (4, 6, 8, 10 cm). Work out the mean for each length, and take half the difference between the longest and the shortest time as the uncertainty. Table: wing length, five times, mean. Graph: mean time against wing length.',
        hr: 'Izmjeri vrijeme pet padova s iste visine za svaku od četiri duljine krila (4, 6, 8, 10 cm). Za svaku duljinu izračunaj srednju vrijednost, a kao nesigurnost uzmi polovicu razlike najduljeg i najkraćeg vremena. Tablica: duljina krila, pet vremena, srednja vrijednost. Graf: srednje vrijeme u ovisnosti o duljini krila.'
      },
      safety: {
        en: 'Do not climb onto chairs or lean over railings to gain height: drop the helicopter while standing on the floor.',
        hr: 'Ne penji se na stolce i ne naginji se preko ograde da dobiješ na visini: helikopter ispuštaj stojeći na podu.'
      },
      tool: 'stopwatch',
      sim: 'inquiry'
    }

  ]);
})();
