/* FizLab topic: Electricity / Električna struja */
(function () {
  'use strict';
  window.Content.register({
    id: 'electricity',
    order: 100,
    gradeLevel: 8,
    color: 'c4',
    title: { en: 'Electricity', hr: 'Električna struja' },
    intro: {
      en: 'Flip a switch and a bulb lights up instantly. What is actually moving inside the wire, and why does one broken bulb sometimes turn off a whole string of lights?',
      hr: 'Pritisneš sklopku i žarulja odmah zasvijetli. Što se zapravo giba u žici i zašto jedna pregorjela žaruljica ponekad ugasi cijeli niz lampica?'
    },
    sims: ['circuit', 'static'],

    lesson: [
      {
        h: { en: 'Electric charge', hr: 'Električni naboj' },
        p: {
          en: [
            'Everything is made of atoms, and atoms contain charged particles. Protons in the centre carry positive charge; electrons around them carry negative charge. Normally the two balance and the object is neutral. Opposite charges attract each other and like charges repel: plus pulls minus, but plus pushes plus away.',
            'When you rub a balloon on your hair, some electrons jump from the hair onto the balloon. The balloon becomes negative and your hair positive, so they attract each other and your hair stands up towards the balloon. The charged balloon will also stick to a wall and pick up tiny scraps of paper. This is static electricity.',
            'Lightning is static electricity on a giant scale. Inside a storm cloud, ice crystals and water droplets rub together and separate huge amounts of charge. When the difference becomes too large, the charge suddenly jumps across the sky, heating the air so fast that it explodes with a flash and a thunderclap.'
          ],
          hr: [
            'Sve je građeno od atoma, a atomi sadrže nabijene čestice. Protoni u jezgri nose pozitivan naboj, a elektroni oko njih negativan. Obično su ta dva naboja u ravnoteži pa je tijelo neutralno. Raznoimeni naboji se privlače, a istoimeni odbijaju: plus privlači minus, ali plus odgurava plus.',
            'Kad protrljaš balon o kosu, dio elektrona preskoči s kose na balon. Balon postane negativan, a kosa pozitivna, pa se privlače i kosa ti se diže prema balonu. Nabijeni balon zalijepit će se i za zid i privući sitne komadiće papira. To je statički elektricitet.',
            'Munja je statički elektricitet u divovskom mjerilu. U olujnom oblaku kristalići leda i kapljice vode taru se jedni o druge i razdvajaju goleme količine naboja. Kad razlika postane prevelika, naboj naglo preskoči nebom i zagrije zrak tako brzo da on eksplodira u bljesku i grmljavini.'
          ]
        }
      },
      {
        h: { en: 'Conductors, insulators and the circuit', hr: 'Vodiči, izolatori i strujni krug' },
        p: {
          en: [
            'In some materials electrons can move freely from atom to atom. These are conductors: all metals (copper, aluminium, iron, gold), but also salt water, the human body and the graphite in a pencil. In insulators the electrons are held tightly and cannot flow: plastic, rubber, glass, dry wood, dry air. That is why wires are copper inside and plastic outside.',
            'For electricity to be useful we need a circuit: a closed loop that charge can flow around. The simplest circuit has a source (a battery), wires, a switch and a device such as a bulb. When the switch is closed, the loop is complete and the bulb lights. Open the switch and there is a gap: the circuit is open and nothing flows. A circuit works only when it is closed all the way round.'
          ],
          hr: [
            'U nekim tvarima elektroni se mogu slobodno gibati od atoma do atoma. To su vodiči: svi metali (bakar, aluminij, željezo, zlato), ali i slana voda, ljudsko tijelo i grafit u olovci. U izolatorima su elektroni čvrsto vezani i ne mogu teći: plastika, guma, staklo, suho drvo, suhi zrak. Zato su žice iznutra od bakra, a izvana od plastike.',
            'Da bi nam elektricitet koristio, trebamo strujni krug: zatvorenu petlju kojom naboj može kružiti. Najjednostavniji strujni krug ima izvor (bateriju), vodiče (žice), sklopku i trošilo, na primjer žarulju. Kad je sklopka zatvorena, petlja je potpuna i žarulja svijetli. Otvori sklopku i nastaje prekid: krug je otvoren i ništa ne teče. Strujni krug radi samo kad je zatvoren cijelim putem.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><rect x="60" y="25" width="300" height="85" fill="none" stroke="var(--fg)" stroke-width="3"/><rect x="40" y="55" width="12" height="26" fill="var(--c4)" stroke="var(--fg)" stroke-width="2"/><rect x="52" y="60" width="8" height="16" fill="var(--fg)"/><text x="30" y="55" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">+</text><text x="30" y="85" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">−</text><circle cx="360" cy="68" r="16" fill="var(--surface2)" stroke="var(--fg)" stroke-width="3"/><line x1="349" y1="57" x2="371" y2="79" stroke="var(--fg)" stroke-width="2"/><line x1="371" y1="57" x2="349" y2="79" stroke="var(--fg)" stroke-width="2"/><rect x="170" y="18" width="80" height="14" fill="var(--surface2)" stroke="none"/><circle cx="175" cy="25" r="4" fill="var(--fg)"/><circle cx="245" cy="25" r="4" fill="var(--fg)"/><line x1="175" y1="25" x2="238" y2="6" stroke="var(--c1)" stroke-width="3"/><text x="210" y="125" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">I</text><line x1="150" y1="110" x2="200" y2="110" stroke="var(--c4)" stroke-width="4"/><polygon points="200,104 212,110 200,116" fill="var(--c4)"/></svg>'
      },
      {
        h: { en: 'Current and voltage', hr: 'Jakost struje i napon' },
        p: {
          en: [
            'Electric current is the flow of charge through a conductor, like water flowing through a pipe. In metal wires it is the electrons that move. The amount of charge passing each second is the current, written I and measured in amperes (A). A phone charger delivers about 1–2 A, a bulb in a school circuit about 0.3 A, and a lightning bolt around 30 000 A. We measure current with an ammeter connected in series, so that the whole current flows through it.',
            'Charges do not flow on their own; something has to push them. That push comes from the source and is called voltage, written U and measured in volts (V). It is like the pressure of a water pump. A small battery gives 1.5 V, a flat battery 4.5 V, a car battery 12 V, and the sockets at home 230 V. Voltage is measured with a voltmeter connected in parallel, across the two points whose difference we want.'
          ],
          hr: [
            'Električna struja je usmjereno gibanje naboja kroz vodič, slično vodi koja teče kroz cijev. U metalnim žicama gibaju se elektroni. Količina naboja koja prođe svake sekunde zove se jakost struje, označava se s I i mjeri u amperima (A). Punjač mobitela daje oko 1–2 A, žaruljica u školskom strujnom krugu oko 0,3 A, a munja oko 30 000 A. Jakost struje mjerimo ampermetrom spojenim serijski (u seriju), tako da cijela struja prolazi kroz njega.',
            'Naboji ne teku sami od sebe; nešto ih mora gurati. Taj poticaj daje izvor, a zove se napon, označava se s U i mjeri u voltima (V). Napon je poput tlaka pumpe za vodu. Mala baterija daje 1,5 V, plosnata baterija 4,5 V, akumulator automobila 12 V, a utičnice kod kuće 230 V. Napon mjerimo voltmetrom spojenim paralelno, između dviju točaka čiju razliku želimo izmjeriti.'
          ]
        }
      },
      {
        h: { en: 'Resistance and Ohm’s law', hr: 'Otpor i Ohmov zakon' },
        p: {
          en: [
            'Every conductor resists the flow of charge a little, like a narrow pipe resists water. This is electrical resistance, written R and measured in ohms (Ω). A thick, short copper wire has very low resistance. A long, thin wire, or the special wire in a heater or a bulb filament, has high resistance and gets hot when current flows.',
            'Georg Ohm discovered the rule that connects the three quantities: I = U / R. Current equals voltage divided by resistance. More voltage pushes more current; more resistance lets less through. The same rule can be written U = I · R or R = U / I.',
            'Worked example: a bulb with a resistance of 9 Ω is connected to a 4.5 V battery. The current is I = 4.5 V / 9 Ω = 0.5 A. Connect the same bulb to a 1.5 V battery and the current drops to 1.5 / 9 ≈ 0.17 A, so the bulb glows much more dimly.'
          ],
          hr: [
            'Svaki vodič pomalo se opire protjecanju naboja, kao što se uska cijev opire vodi. To je električni otpor, označava se s R i mjeri u omima (Ω). Debela, kratka bakrena žica ima vrlo mali otpor. Duga, tanka žica ili posebna žica u grijalici i nit žarulje imaju velik otpor i zagriju se kad kroz njih teče struja.',
            'Georg Ohm otkrio je pravilo koje povezuje te tri veličine: I = U / R. Jakost struje jednaka je naponu podijeljenom s otporom. Veći napon gura jaču struju; veći otpor propušta slabiju. Isto pravilo možemo zapisati i kao U = I · R ili R = U / I.',
            'Riješeni primjer: žarulja otpora 9 Ω spojena je na bateriju od 4,5 V. Jakost struje je I = 4,5 V / 9 Ω = 0,5 A. Spoji istu žarulju na bateriju od 1,5 V i struja padne na 1,5 / 9 ≈ 0,17 A, pa žarulja svijetli mnogo slabije.'
          ]
        }
      },
      {
        h: { en: 'Series and parallel connection', hr: 'Serijski i paralelni spoj' },
        p: {
          en: [
            'There are two ways to connect several bulbs. In a series connection they sit one after another on a single loop. The same current flows through every bulb, and the voltage of the source is shared between them, so each bulb glows more dimly. Worst of all, if one bulb burns out the loop is broken and all the bulbs go out. Cheap old Christmas lights worked like this.',
            'In a parallel connection each bulb has its own branch connected directly to the source. Every bulb gets the full voltage and shines at full brightness, and if one burns out the others keep working. The wiring in your home is parallel: you can switch the kitchen light on without the bathroom light, and a broken lamp does not darken the whole house.'
          ],
          hr: [
            'Više žarulja možemo spojiti na dva načina. U serijskom spoju nalaze se jedna za drugom u jednoj jedinoj petlji. Kroz svaku žarulju teče ista struja, a napon izvora dijeli se među njima, pa svaka svijetli slabije. Najgore od svega, ako jedna žarulja pregori, petlja je prekinuta i sve se žarulje ugase. Stare jeftine božićne lampice radile su upravo tako.',
            'U paralelnom spoju svaka žarulja ima svoju granu spojenu izravno na izvor. Svaka žarulja dobiva puni napon i svijetli punim sjajem, a ako jedna pregori, ostale rade dalje. Instalacija u tvom domu je paralelna: možeš upaliti svjetlo u kuhinji, a da kupaonica ostane u mraku, i jedna pokvarena svjetiljka ne zamrači cijelu kuću.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><rect x="20" y="25" width="170" height="80" fill="none" stroke="var(--fg)" stroke-width="3"/><rect x="12" y="52" width="10" height="26" fill="var(--c4)" stroke="var(--fg)" stroke-width="2"/><circle cx="80" cy="25" r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="3"/><line x1="72" y1="17" x2="88" y2="33" stroke="var(--fg)" stroke-width="2"/><line x1="88" y1="17" x2="72" y2="33" stroke="var(--fg)" stroke-width="2"/><circle cx="140" cy="25" r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="3"/><line x1="132" y1="17" x2="148" y2="33" stroke="var(--fg)" stroke-width="2"/><line x1="148" y1="17" x2="132" y2="33" stroke="var(--fg)" stroke-width="2"/><rect x="240" y="25" width="160" height="80" fill="none" stroke="var(--fg)" stroke-width="3"/><rect x="232" y="52" width="10" height="26" fill="var(--c4)" stroke="var(--fg)" stroke-width="2"/><line x1="320" y1="25" x2="320" y2="105" stroke="var(--fg)" stroke-width="3"/><circle cx="320" cy="50" r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="3"/><line x1="312" y1="42" x2="328" y2="58" stroke="var(--fg)" stroke-width="2"/><line x1="328" y1="42" x2="312" y2="58" stroke="var(--fg)" stroke-width="2"/><circle cx="400" cy="65" r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="3"/><line x1="392" y1="57" x2="408" y2="73" stroke="var(--fg)" stroke-width="2"/><line x1="408" y1="57" x2="392" y2="73" stroke="var(--fg)" stroke-width="2"/><text x="105" y="124" text-anchor="middle" fill="var(--muted)" font-family="inherit" font-size="12">1</text><text x="320" y="124" text-anchor="middle" fill="var(--muted)" font-family="inherit" font-size="12">2</text></svg>'
      },
      {
        h: { en: 'Effects of current, power and safety', hr: 'Učinci struje, snaga i sigurnost' },
        p: {
          en: [
            'Current can do several things. It heats: the thin high-resistance wire in a toaster, hair dryer, electric heater or old bulb glows red or white hot. It lights: LEDs and bulb filaments turn electrical energy into light. It is magnetic: a coil carrying current becomes an electromagnet, the heart of every electric motor, doorbell and speaker. And it has chemical effects: current can split water into hydrogen and oxygen or coat a spoon with a layer of silver.',
            'How much energy a device uses each second is its electrical power: P = U · I, voltage times current. A hair dryer at 230 V drawing 8 A has a power of about 1840 W. Over time this adds up to energy, which the electricity company bills in kilowatt-hours: a 2 kW heater left on for 5 hours uses 10 kWh.',
            'Mains electricity at 230 V can kill. Never touch bare wires or push anything into a socket, never use electrical devices with wet hands or near the bath, and never climb pylons or go near fallen cables. Water makes your body conduct much better. Fuses and circuit breakers protect homes: when the current grows too large, they cut the circuit before wires overheat and start a fire. Batteries are safe for experiments; the mains is not.'
          ],
          hr: [
            'Struja može činiti nekoliko stvari. Grije: tanka žica velikog otpora u tosteru, sušilu za kosu, električnoj grijalici ili staroj žarulji užari se do crvenog ili bijelog sjaja. Svijetli: LED-diode i niti žarulja pretvaraju električnu energiju u svjetlost. Djeluje magnetski: zavojnica kroz koju teče struja postaje elektromagnet, srce svakog elektromotora, zvona i zvučnika. I ima kemijski učinak: struja može rastaviti vodu na vodik i kisik ili prevući žlicu slojem srebra.',
            'Koliko energije uređaj potroši svake sekunde njegova je električna snaga: P = U · I, napon puta jakost struje. Sušilo za kosu na 230 V koje vuče 8 A ima snagu oko 1840 W. S vremenom se to zbroji u energiju, koju elektrodistribucija naplaćuje u kilovatsatima: grijalica od 2 kW uključena 5 sati potroši 10 kWh.',
            'Gradska mreža od 230 V može ubiti. Nikad ne diraj gole žice i ne guraj ništa u utičnicu, nikad ne koristi električne uređaje mokrim rukama ili blizu kade i nikad se ne penji na stupove dalekovoda niti prilazi palim kabelima. Voda čini tvoje tijelo puno boljim vodičem. Osigurači i automatski osigurači štite dom: kad struja postane prejaka, prekinu krug prije nego što se žice pregriju i izazovu požar. Baterije su sigurne za pokuse; mreža nije.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'electric charge', hr: 'električni naboj' }, def: { en: 'A property of particles: positive (protons) or negative (electrons). Like charges repel, unlike attract.', hr: 'Svojstvo čestica: pozitivan (protoni) ili negativan (elektroni). Istoimeni se odbijaju, raznoimeni privlače.' } },
      { term: { en: 'electron', hr: 'elektron' }, def: { en: 'A tiny negatively charged particle. In metals electrons move and carry the current.', hr: 'Sićušna negativno nabijena čestica. U metalima se elektroni gibaju i nose struju.' } },
      { term: { en: 'conductor', hr: 'vodič' }, def: { en: 'A material in which charge flows easily: metals, salt water, graphite.', hr: 'Tvar kroz koju naboj lako teče: metali, slana voda, grafit.' } },
      { term: { en: 'insulator', hr: 'izolator' }, def: { en: 'A material that does not let charge flow: plastic, rubber, glass, dry wood.', hr: 'Tvar koja ne propušta naboj: plastika, guma, staklo, suho drvo.' } },
      { term: { en: 'electric circuit', hr: 'strujni krug' }, def: { en: 'A closed loop of source, wires, switch and device around which current can flow.', hr: 'Zatvorena petlja od izvora, vodiča, sklopke i trošila kojom može teći struja.' } },
      { term: { en: 'current (I)', hr: 'jakost struje (I)' }, def: { en: 'How much charge flows past a point each second. Unit: ampere (A). Measured with an ammeter in series.', hr: 'Koliko naboja prođe kroz točku svake sekunde. Jedinica: amper (A). Mjeri se ampermetrom u seriji.' } },
      { term: { en: 'voltage (U)', hr: 'napon (U)' }, def: { en: 'The push of the source that drives the current. Unit: volt (V). Measured with a voltmeter in parallel.', hr: 'Poticaj izvora koji pokreće struju. Jedinica: volt (V). Mjeri se voltmetrom paralelno.' } },
      { term: { en: 'resistance (R)', hr: 'električni otpor (R)' }, def: { en: 'How strongly a conductor opposes the current. Unit: ohm (Ω).', hr: 'Koliko se vodič opire struji. Jedinica: om (Ω).' } },
      { term: { en: 'Ohm’s law', hr: 'Ohmov zakon' }, def: { en: 'I = U / R: current equals voltage divided by resistance.', hr: 'I = U / R: jakost struje jednaka je naponu podijeljenom s otporom.' } },
      { term: { en: 'series connection', hr: 'serijski spoj' }, def: { en: 'Devices one after another in a single loop; the same current flows through all of them.', hr: 'Trošila jedno za drugim u jednoj petlji; kroz sva teče ista struja.' } },
      { term: { en: 'parallel connection', hr: 'paralelni spoj' }, def: { en: 'Each device on its own branch with the full voltage; others keep working if one fails.', hr: 'Svako trošilo u svojoj grani s punim naponom; ostala rade i ako jedno pregori.' } },
      { term: { en: 'fuse / circuit breaker', hr: 'osigurač' }, def: { en: 'A safety device that cuts the circuit when the current becomes dangerously large.', hr: 'Zaštitna naprava koja prekida strujni krug kad struja postane opasno jaka.' } }
    ],

    formulas: [
      { expr: 'I = U / R', name: { en: 'Ohm’s law', hr: 'Ohmov zakon' }, note: { en: 'U in V, R in Ω, I in A', hr: 'U u V, R u Ω, I u A' } },
      { expr: 'P = U · I', name: { en: 'electrical power', hr: 'električna snaga' }, note: { en: 'volts × amperes = watts', hr: 'volti × amperi = vati' } },
      { expr: 'E = P · t', name: { en: 'electrical energy', hr: 'električna energija' }, note: { en: 'kW × h = kWh, the unit on the bill', hr: 'kW × h = kWh, jedinica na računu' } }
    ],

    funFact: {
      en: 'A lightning bolt carries a current of around 30 000 A and heats the air in its path to about 30 000 °C, roughly five times hotter than the surface of the Sun. Yet the whole flash lasts only a few tenths of a second.',
      hr: 'Munja nosi struju jakosti oko 30 000 A i zagrije zrak na svom putu na oko 30 000 °C, otprilike pet puta više od temperature Sunčeve površine. Ipak, cijeli bljesak traje samo nekoliko desetinki sekunde.'
    },

    experiment: {
      title: { en: 'A circuit with a paper clip switch', hr: 'Strujni krug sa sklopkom od spajalice' },
      materials: {
        en: ['a 4.5 V flat battery (or two 1.5 V batteries in a holder)', 'a small torch bulb (3.5 V) with a holder, or taped wires', 'three pieces of insulated wire with bare ends, about 20 cm each', 'a metal paper clip', 'two metal thumbtacks or paper fasteners', 'a piece of thick cardboard or cork', 'sticky tape', 'test objects: a coin, a key, an eraser, a pencil lead, a plastic ruler'],
        hr: ['plosnata baterija od 4,5 V (ili dvije baterije od 1,5 V u držaču)', 'mala žaruljica za džepnu svjetiljku (3,5 V) s grlom ili zalijepljenim žicama', 'tri komada izolirane žice s ogoljenim krajevima, svaki oko 20 cm', 'metalna spajalica', 'dvije metalne pribadače ili rascjepke', 'komad debelog kartona ili pluta', 'selotejp', 'predmeti za ispitivanje: kovanica, ključ, gumica za brisanje, mina olovke, plastično ravnalo']
      },
      steps: {
        en: [
          'Push the two thumbtacks into the cardboard about 3 cm apart. Hook the paper clip under one of them so that it can swing round and touch the other. This is your switch.',
          'Connect the first wire from one terminal of the battery to one contact of the bulb.',
          'Connect the second wire from the other contact of the bulb to one thumbtack.',
          'Connect the third wire from the other thumbtack to the other terminal of the battery.',
          'Swing the paper clip so that it touches both tacks: the bulb lights, the circuit is closed. Swing it away: the bulb goes out, the circuit is open.',
          'Leave the clip open and bridge the two tacks with a coin, a key, an eraser, a pencil lead and a plastic ruler. Which ones make the bulb light? Those are conductors.'
        ],
        hr: [
          'Zabodi dvije pribadače u karton na razmaku od oko 3 cm. Pod jednu zakvači spajalicu tako da se može zaokrenuti i dodirnuti drugu. To je tvoja sklopka.',
          'Prvom žicom spoji jedan pol baterije s jednim kontaktom žaruljice.',
          'Drugom žicom spoji drugi kontakt žaruljice s jednom pribadačom.',
          'Trećom žicom spoji drugu pribadaču s drugim polom baterije.',
          'Zaokreni spajalicu tako da dodiruje obje pribadače: žaruljica svijetli, strujni krug je zatvoren. Odmakni je: žaruljica se ugasi, krug je otvoren.',
          'Ostavi spajalicu odmaknutu i premosti dvije pribadače kovanicom, ključem, gumicom, minom olovke i plastičnim ravnalom. Što od toga upali žaruljicu? To su vodiči.'
        ]
      },
      explain: {
        en: 'Current flows only around a complete, closed loop. The paper clip closes or opens that loop, exactly like the light switch on your wall. Metals such as the coin and key conduct well and the bulb shines; the graphite in the pencil lead conducts a little, so the bulb glows dimly; the eraser and plastic ruler are insulators and nothing happens.',
        hr: 'Struja teče samo kroz potpunu, zatvorenu petlju. Spajalica tu petlju zatvara ili otvara, baš kao sklopka za svjetlo na zidu. Metali poput kovanice i ključa dobro vode struju i žaruljica svijetli; grafit u mini olovke vodi slabo, pa žaruljica svijetli prigušeno; gumica i plastično ravnalo su izolatori i ništa se ne događa.'
      },
      safety: { en: 'Use batteries only, never the mains socket. Never join the two battery terminals directly with a wire: that is a short circuit and the wire and battery get hot.', hr: 'Koristi samo baterije, nikad utičnicu. Nikad ne spajaj dva pola baterije izravno žicom: to je kratki spoj i žica i baterija se zagriju.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which particle carries negative charge?', hr: 'Koja čestica nosi negativan naboj?' },
        options: [{ en: 'proton', hr: 'proton' }, { en: 'atom', hr: 'atom' }, { en: 'electron', hr: 'elektron' }, { en: 'molecule', hr: 'molekula' }], answer: 2,
        explain: { en: 'Electrons are negative, protons positive. A whole atom is normally neutral because it has equal numbers of both.', hr: 'Elektroni su negativni, protoni pozitivni. Cijeli atom obično je neutralan jer ima jednak broj i jednih i drugih.' } },
      { type: 'mc', q: { en: 'Which of these is an electrical conductor?', hr: 'Što je od navedenog električni vodič?' },
        options: [{ en: 'a copper wire', hr: 'bakrena žica' }, { en: 'a rubber glove', hr: 'gumena rukavica' }, { en: 'a glass rod', hr: 'stakleni štapić' }, { en: 'a plastic ruler', hr: 'plastično ravnalo' }], answer: 0,
        explain: { en: 'All metals, including copper, let electrons move freely. Rubber, glass and plastic are insulators.', hr: 'Svi metali, uključujući bakar, puštaju elektrone da se slobodno gibaju. Guma, staklo i plastika su izolatori.' } },
      { type: 'tf', q: { en: 'A bulb can light up even when the switch leaves a gap in the circuit.', hr: 'Žarulja može svijetliti i kad sklopka ostavlja prekid u strujnom krugu.' }, answer: false,
        explain: { en: 'Current needs a closed loop. An open switch leaves a gap, so no current flows and the bulb stays dark.', hr: 'Struji treba zatvorena petlja. Otvorena sklopka ostavlja prekid, pa struja ne teče i žarulja ostaje ugašena.' } },
      { type: 'mc', q: { en: 'What is the unit of electric current?', hr: 'Koja je mjerna jedinica za jakost električne struje?' },
        options: [{ en: 'volt', hr: 'volt' }, { en: 'ampere', hr: 'amper' }, { en: 'ohm', hr: 'om' }, { en: 'watt', hr: 'vat' }], answer: 1,
        explain: { en: 'Current is measured in amperes (A). The volt measures voltage, the ohm resistance and the watt power.', hr: 'Jakost struje mjerimo u amperima (A). Voltom mjerimo napon, omom otpor, a vatom snagu.' } },
      { type: 'mc', q: { en: 'How is an ammeter connected to measure the current through a bulb?', hr: 'Kako se spaja ampermetar da bi izmjerio jakost struje kroz žarulju?' },
        options: [{ en: 'in parallel with the bulb', hr: 'paralelno sa žaruljom' }, { en: 'in parallel with the battery', hr: 'paralelno s baterijom' }, { en: 'it is not connected, just held near the wire', hr: 'ne spaja se, samo se drži blizu žice' }, { en: 'in series with the bulb', hr: 'serijski sa žaruljom' }], answer: 3,
        explain: { en: 'The whole current must flow through the ammeter, so it is placed in series, in the same loop as the bulb. A voltmeter, by contrast, goes in parallel.', hr: 'Cijela struja mora proći kroz ampermetar, pa se on spaja serijski, u istu petlju sa žaruljom. Voltmetar se, naprotiv, spaja paralelno.' } },
      { type: 'num', q: { en: 'A 12 V battery is connected to a resistor of 4 Ω. What current flows? Use I = U / R.', hr: 'Baterija od 12 V spojena je na otpornik od 4 Ω. Kolika struja teče? Uzmi I = U / R.' },
        answer: 3, tolerance: 0.05, unit: 'A',
        explain: { en: 'I = U / R = 12 V / 4 Ω = 3 A.', hr: 'I = U / R = 12 V / 4 Ω = 3 A.' } },
      { type: 'mc', q: { en: 'Three bulbs are connected in series. One burns out. What happens?', hr: 'Tri žarulje spojene su serijski. Jedna pregori. Što se dogodi?' },
        options: [{ en: 'all three go out', hr: 'sve tri se ugase' }, { en: 'the other two shine brighter', hr: 'druge dvije svijetle jače' }, { en: 'nothing changes for the other two', hr: 'drugim dvjema ništa se ne mijenja' }, { en: 'the battery explodes', hr: 'baterija eksplodira' }], answer: 0,
        explain: { en: 'In series there is only one loop. A burnt-out bulb breaks it, so no current flows anywhere and all the bulbs go dark.', hr: 'U serijskom spoju postoji samo jedna petlja. Pregorjela žarulja je prekida, pa struja ne teče nigdje i sve se žarulje ugase.' } },
      { type: 'tf', q: { en: 'The lights and sockets in a house are connected in parallel.', hr: 'Svjetla i utičnice u kući spojeni su paralelno.' }, answer: true,
        explain: { en: 'Yes. Each lamp and socket has its own branch with the full 230 V, so devices work independently and one failure does not switch off the others.', hr: 'Da. Svaka svjetiljka i utičnica ima svoju granu s punih 230 V, pa uređaji rade neovisno i kvar jednoga ne isključuje ostale.' } },
      { type: 'mc', q: { en: 'Which effect of electric current does a toaster use?', hr: 'Koji učinak električne struje koristi toster?' },
        options: [{ en: 'chemical effect', hr: 'kemijski učinak' }, { en: 'magnetic effect', hr: 'magnetski učinak' }, { en: 'heating effect', hr: 'toplinski učinak' }, { en: 'sound effect', hr: 'zvučni učinak' }], answer: 2,
        explain: { en: 'The wires in a toaster have high resistance and glow red hot when current flows. The same heating effect runs hair dryers, heaters and electric kettles.', hr: 'Žice u tosteru imaju velik otpor i užare se do crvenog kad kroz njih teče struja. Isti toplinski učinak pokreće sušila za kosu, grijalice i kuhala za vodu.' } },
      { type: 'num', q: { en: 'A heater on 230 V draws a current of 2 A. What is its power? Use P = U · I.', hr: 'Grijalica na 230 V vuče struju od 2 A. Kolika je njezina snaga? Uzmi P = U · I.' },
        answer: 460, tolerance: 1, unit: 'W',
        explain: { en: 'P = U · I = 230 V · 2 A = 460 W.', hr: 'P = U · I = 230 V · 2 A = 460 W.' } },
      { type: 'mc', q: { en: 'What protects the wiring in a house if the current becomes too large?', hr: 'Što štiti instalaciju u kući ako struja postane prejaka?' },
        options: [{ en: 'a voltmeter', hr: 'voltmetar' }, { en: 'a fuse or circuit breaker', hr: 'osigurač ili automatski osigurač' }, { en: 'a longer cable', hr: 'dulji kabel' }, { en: 'a bigger bulb', hr: 'veća žarulja' }], answer: 1,
        explain: { en: 'A fuse melts and a circuit breaker switches off when the current is too high, cutting the circuit before the wires overheat and cause a fire.', hr: 'Osigurač se rastali, a automatski osigurač isključi kad je struja prejaka, prekidajući krug prije nego što se žice pregriju i izazovu požar.' } },
      { type: 'tf', q: { en: 'It is safe to use a hair dryer with wet hands as long as you are careful.', hr: 'Sigurno je koristiti sušilo za kosu mokrim rukama ako si oprezan.' }, answer: false,
        explain: { en: 'Never. Water makes your skin conduct much better, and mains voltage (230 V) can then drive a deadly current through your body. Dry your hands and stay away from water.', hr: 'Nikad. Voda čini tvoju kožu mnogo boljim vodičem, a mrežni napon (230 V) tada može kroz tijelo potjerati smrtonosnu struju. Osuši ruke i drži se podalje od vode.' } }
    ]
  });
})();
