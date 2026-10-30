/* FizLab bonus topic: How Science Works / Kako znanost radi */
(function () {
  'use strict';
  window.Content.register({
    id: 'science',
    order: 5,
    gradeLevel: 0,
    color: 'c6',
    title: { en: 'How Science Works', hr: 'Kako znanost radi' },
    intro: {
      en: 'Physics is not a list of facts to memorise. It is a way of asking nature questions and checking the answers. Learn the rules of that game.',
      hr: 'Fizika nije popis činjenica za učenje napamet. Ona je način kako prirodi postavljamo pitanja i provjeravamo odgovore. Nauči pravila te igre.'
    },
    sims: ['inquiry', 'measure'],

    lesson: [
      {
        h: { en: 'Physics asks questions', hr: 'Fizika postavlja pitanja' },
        p: {
          en: [
            'Why is the sky blue? Why does a ball always come back down? Why does a spoon in hot tea get hot? Physics starts with questions like these about the nature around us. The job of a physicist is not to know all the answers by heart, but to find a reliable way of discovering them.',
            'There are two ways to collect facts. Observation means watching carefully what happens on its own: the Moon changing shape, a thunderstorm, a bird gliding. An experiment means setting things up on purpose and changing them: you drop two balls at the same moment to see which one lands first. In an experiment you are in control, so you can repeat it as often as you like.',
            'A good rule in physics is "first the idea, then the name". You have known since you were a baby that things fall when you let go of them. Only later did you learn the words gravity and weight. A name is just a label for an idea you already understand. Learning names without ideas is not physics.'
          ],
          hr: [
            'Zašto je nebo plavo? Zašto se lopta uvijek vrati na tlo? Zašto se žlica u vrućem čaju ugrije? Fizika počinje takvim pitanjima o prirodi oko nas. Posao fizičara nije znati sve odgovore napamet, nego pronaći pouzdan način kako ih otkriti.',
            'Činjenice prikupljamo na dva načina. Opažanje (promatranje) znači pažljivo gledati što se događa samo od sebe: Mjesec mijenja oblik, grmljavinska oluja, ptica jedri. Pokus (eksperiment) znači namjerno nešto postaviti i mijenjati: istodobno pustiš dvije lopte da vidiš koja prije padne. U pokusu ti upravljaš, pa ga možeš ponavljati koliko god želiš.',
            'Dobro pravilo u fizici glasi: "prvo ideja, pa onda ime". Još od malih nogu znaš da stvari padnu kad ih pustiš. Tek kasnije si naučio riječi sila teža i težina. Ime je samo naljepnica za ideju koju već razumiješ. Učiti imena bez ideja nije fizika.'
          ]
        }
      },
      {
        h: { en: 'From hypothesis to conclusion', hr: 'Od hipoteze do zaključka' },
        p: {
          en: [
            'A hypothesis is a clear guess that can be tested: "The time of one swing of a pendulum depends on the mass of the bob." Then we think ahead and make a prediction: IF the hypothesis is right AND I hang a heavier washer on the same string, THEN one swing will take longer. Now we do the test and record the result.',
            'The result: with one washer, 10 swings take 20.1 s; with three washers, 20.0 s. The period hardly changed. BUT the prediction said it should get longer, THEREFORE the hypothesis is wrong: the period of a pendulum does not depend on its mass. This chain, if, and, then, but, therefore, is the heart of every experiment.',
            'Notice something strange: an experiment can kill a hypothesis, but it can never prove one completely. For centuries Europeans had seen only white swans and were sure that all swans are white. Thousands of white swans supported the idea, yet a single black swan found in Australia in 1697 destroyed it. A hypothesis that passes many tests is well supported and trusted, but a good scientist keeps the door open.'
          ],
          hr: [
            'Hipoteza je jasna pretpostavka koju je moguće provjeriti: "Vrijeme jednog titraja njihala ovisi o masi utega." Zatim mislimo unaprijed i postavljamo predviđanje: AKO je hipoteza točna I ako na istu nit objesim teži uteg, ONDA će jedan titraj trajati dulje. Sad izvodimo pokus i zapisujemo rezultat.',
            'Rezultat: s jednim utegom 10 titraja traje 20,1 s, a s tri utega 20,0 s. Period se gotovo nije promijenio. ALI predviđanje je bilo da će se produljiti, DAKLE hipoteza je pogrešna: period njihala ne ovisi o masi. Taj lanac, ako, i, onda, ali, dakle, srce je svakog pokusa.',
            'Primijeti nešto neobično: pokus može srušiti hipotezu, ali je nikad ne može potpuno dokazati. Europljani su stoljećima viđali samo bijele labudove i bili su sigurni da su svi labudovi bijeli. Tisuće bijelih labudova podupirale su tu ideju, a ipak ju je jedan jedini crni labud pronađen u Australiji 1697. godine srušio. Hipoteza koja prođe mnogo provjera dobro je potkrijepljena i vjerujemo joj, ali dobar znanstvenik ostavlja vrata otvorena.'
          ]
        }
      },
      {
        h: { en: 'A fair test: change one thing at a time', hr: 'Pošten pokus: mijenjaj samo jednu stvar' },
        p: {
          en: [
            'Imagine you want to know how the pulling force affects how quickly a cart speeds up. If you change the force and at the same time load the cart with extra bricks, and the cart speeds up more slowly, which change caused it? You cannot tell. A fair test changes only one thing at a time.',
            'Scientists give the parts of a fair test names. The independent variable is the one you change on purpose: the pulling force (1 N, 2 N, 3 N). The dependent variable is what you measure to see the effect: the acceleration of the cart. The controlled variables are everything you keep the same so they cannot spoil the result: the mass of the cart, the surface, the same cart every time.',
            'A quick check for any experiment: What am I changing? What am I measuring? What am I keeping the same? If you can answer all three, your test is fair. And draw a table for your results before you start, so the numbers do not get mixed up later.'
          ],
          hr: [
            'Zamisli da želiš saznati kako sila vučenja utječe na to koliko brzo kolica ubrzavaju. Ako promijeniš silu i istodobno na kolica natovariš dodatne cigle, pa kolica ubrzaju sporije, koja je promjena to prouzročila? Ne možeš znati. Pošten pokus mijenja samo jednu stvar.',
            'Znanstvenici dijelovima poštenog pokusa daju imena. Nezavisna varijabla je ona koju namjerno mijenjaš: sila vučenja (1 N, 2 N, 3 N). Zavisna varijabla je ono što mjeriš da vidiš učinak: ubrzanje kolica. Kontrolirane varijable su sve što držiš nepromijenjenim da ne pokvari rezultat: masa kolica, podloga, uvijek ista kolica.',
            'Brza provjera za svaki pokus: Što mijenjam? Što mjerim? Što držim jednakim? Ako znaš odgovoriti na sva tri pitanja, pokus je pošten. I nacrtaj tablicu za rezultate prije nego što počneš, da se brojevi poslije ne pomiješaju.'
          ]
        }
      },
      {
        h: { en: 'Measuring and its uncertainty', hr: 'Mjerenje i mjerna nesigurnost' },
        p: {
          en: [
            'No measurement is perfect. Measure the length of your desk three times and you may get 120.3 cm, 120.5 cm and 120.4 cm. The ruler shifts a little, your eye reads the scale a little differently, the edge is not perfectly sharp. That is why we measure at least three times and take the mean value: add the readings and divide by their number. Here x̄ = (120.3 + 120.5 + 120.4) cm / 3 = 120.4 cm.',
            'How much can we trust that number? Look at how far each reading is from the mean: 0.1 cm, 0.1 cm and 0 cm. The biggest of these, the maximum absolute deviation Δx = 0.1 cm, is our measurement uncertainty. We write the result as an interval: l = (120.4 ± 0.1) cm, which means "somewhere between 120.3 cm and 120.5 cm". The relative error compares the uncertainty with the value: r = 0.1 / 120.4 · 100 % ≈ 0.08 %, a very good measurement.',
            'Two more habits of good measurers. First, do not write more digits than you can trust: a calculator may show 120.4333 cm, but a ruler with millimetre marks cannot tell you thousandths of a millimetre. Second, remember the darts picture. Darts that land close together but in the wrong corner are precise but not accurate (a stretched measuring tape does that). Darts scattered around the bullseye are accurate but not precise. We want both: close together and on target.'
          ],
          hr: [
            'Nijedno mjerenje nije savršeno. Izmjeri duljinu svog stola tri puta i možda dobiješ 120,3 cm, 120,5 cm i 120,4 cm. Ravnalo se malo pomakne, oko drukčije pročita skalu, rub nije posve oštar. Zato mjerimo najmanje tri puta i računamo srednju vrijednost: zbrojimo rezultate i podijelimo njihovim brojem. Ovdje je x̄ = (120,3 + 120,5 + 120,4) cm / 3 = 120,4 cm.',
            'Koliko tom broju možemo vjerovati? Pogledaj koliko je svaki rezultat udaljen od srednje vrijednosti: 0,1 cm, 0,1 cm i 0 cm. Najveće od tih odstupanja, maksimalno apsolutno odstupanje Δx = 0,1 cm, naša je mjerna nesigurnost. Rezultat pišemo kao interval: l = (120,4 ± 0,1) cm, što znači "negdje između 120,3 cm i 120,5 cm". Relativna pogreška uspoređuje nesigurnost s vrijednošću: r = 0,1 / 120,4 · 100 % ≈ 0,08 %, vrlo dobro mjerenje.',
            'Još dvije navike dobrih mjeritelja. Prvo, ne piši više znamenki nego što možeš jamčiti: kalkulator može pokazati 120,4333 cm, ali ravnalo s milimetarskim crticama ne može ti reći tisućinke milimetra. Drugo, sjeti se slike s pikadom. Strelice koje padnu blizu jedna drugoj, ali u krivom kutu, precizne su, ali nisu točne (to radi istegnuta mjerna traka). Strelice rasute oko središta točne su, ali nisu precizne. Želimo oboje: blizu jedna drugoj i u središtu.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><g fill="none" stroke="var(--muted)" stroke-width="2"><circle cx="70" cy="70" r="52"/><circle cx="70" cy="70" r="34"/><circle cx="70" cy="70" r="16"/><circle cx="210" cy="70" r="52"/><circle cx="210" cy="70" r="34"/><circle cx="210" cy="70" r="16"/><circle cx="350" cy="70" r="52"/><circle cx="350" cy="70" r="34"/><circle cx="350" cy="70" r="16"/></g><g fill="var(--c2)"><circle cx="70" cy="70" r="5"/><circle cx="210" cy="70" r="5"/><circle cx="350" cy="70" r="5"/></g><g fill="var(--c1)"><circle cx="96" cy="44" r="4"/><circle cx="101" cy="50" r="4"/><circle cx="94" cy="52" r="4"/><circle cx="100" cy="42" r="4"/><circle cx="188" cy="58" r="4"/><circle cx="232" cy="88" r="4"/><circle cx="204" cy="98" r="4"/><circle cx="226" cy="48" r="4"/><circle cx="194" cy="82" r="4"/><circle cx="348" cy="67" r="4"/><circle cx="353" cy="72" r="4"/><circle cx="349" cy="74" r="4"/><circle cx="354" cy="66" r="4"/></g></svg>'
      },
      {
        h: { en: 'Models, laws and theories', hr: 'Modeli, zakoni i teorije' },
        p: {
          en: [
            'Nature is complicated, so physicists simplify it on purpose. A model keeps only what matters for the question and leaves out the rest. To work out where a kicked ball lands, we treat it as a single point and forget its colour, its stitches and even its spin. The "ideal gas" is a model of air as tiny bouncing balls that never stick together. A model is useful as long as it predicts well; when it fails, we build a better one.',
            'A law describes WHAT happens, often as a formula: the law of the lever says that force times arm is equal on both sides. A theory explains WHY: the kinetic theory explains why gases push on the walls of their container (moving particles bump into them) and predicts new things that nobody had measured yet. In science, "theory" does not mean "a guess"; it means a well-tested explanation.',
            'Scientific ideas can change: Newton\'s laws of motion were improved by Einstein for very fast objects, but your bike still obeys Newton perfectly well. That is exactly why science is reliable: it keeps checking itself. Science also knows its limits. It can tell you how fast a stone falls, but not whether you should throw it, and not which song is the most beautiful. Those are questions of ethics and taste, and other kinds of thinking take over.'
          ],
          hr: [
            'Priroda je složena, pa je fizičari namjerno pojednostavljuju. Model zadržava samo ono što je važno za pitanje, a ostalo izostavlja. Da izračunamo gdje će pasti udarena lopta, gledamo je kao jednu točku i zaboravimo njezinu boju, šavove, čak i vrtnju. "Idealni plin" je model zraka kao sitnih kuglica koje se odbijaju i nikad se ne lijepe. Model je koristan dok dobro predviđa; kad zakaže, gradimo bolji.',
            'Zakon opisuje ŠTO se događa, često kao formula: zakon poluge kaže da je umnožak sile i kraka jednak na obje strane. Teorija objašnjava ZAŠTO: kinetička teorija objašnjava zašto plinovi tlače stijenke posude (čestice u gibanju udaraju u njih) i predviđa nove pojave koje još nitko nije izmjerio. U znanosti "teorija" ne znači "nagađanje", nego dobro provjereno objašnjenje.',
            'Znanstvene ideje mogu se mijenjati: Newtonove zakone gibanja Einstein je popravio za vrlo brza tijela, ali tvoj bicikl i dalje savršeno sluša Newtona. Baš zato je znanost pouzdana: stalno provjerava samu sebe. Znanost također zna svoje granice. Može ti reći kako brzo kamen pada, ali ne i trebaš li ga baciti, ni koja je pjesma najljepša. To su pitanja etike i ukusa, i tu preuzimaju druge vrste razmišljanja.'
          ]
        }
      },
      {
        h: { en: 'Why physics is hard, and why it is worth it', hr: 'Zašto je fizika teška i zašto se isplati' },
        p: {
          en: [
            'Everyone carries an "intuitive physics" built from everyday experience, and it is often wrong. We feel that a moving thing needs a constant push to keep moving (but a puck on ice glides on with no push at all; it is friction that stops things). We feel that heavier objects fall faster (in a vacuum a hammer and a feather land together). We feel that in a crash the big truck pushes harder on the small car (the forces are equal; the car suffers more only because it is lighter).',
            'Physics is hard because these old feelings must be replaced, not just added to. The only tool that can do this is the experiment: nature is the referee, and it does not care who is louder or older. Every time you measure something yourself and the result surprises you, your intuition gets a little better.',
            'Finally, science is teamwork and honesty. Scientists publish exactly how they did their experiments so that others can repeat them and catch mistakes. A result that only one person can get is not yet science. Writing down the number you actually measured, even when it ruins your lovely hypothesis, is the most important rule of all.'
          ],
          hr: [
            'Svatko u sebi nosi "intuitivnu fiziku" izgrađenu iz svakodnevnog iskustva, a ona je često pogrešna. Osjećamo da tijelo u gibanju treba stalno gurati da bi se gibalo (ali pak na ledu klizi dalje bez ikakvog guranja; trenje je ono što zaustavlja tijela). Osjećamo da teža tijela padaju brže (u vakuumu čekić i pero padnu istodobno). Osjećamo da u sudaru veliki kamion gura jače na mali automobil (sile su jednake; automobil više strada samo zato što je lakši).',
            'Fizika je teška jer te stare osjećaje treba zamijeniti, a ne samo dodati novo znanje. Jedini alat koji to može jest pokus: priroda je sudac i nije joj važno tko je glasniji ili stariji. Svaki put kad nešto sam izmjeriš i rezultat te iznenadi, tvoja intuicija postaje malo bolja.',
            'Na kraju, znanost je timski rad i poštenje. Znanstvenici objavljuju točno kako su izveli pokuse da bi ih drugi mogli ponoviti i uočiti pogreške. Rezultat koji može dobiti samo jedna osoba još nije znanost. Zapisati broj koji si stvarno izmjerio, čak i kad ruši tvoju lijepu hipotezu, najvažnije je pravilo od svih.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'hypothesis', hr: 'hipoteza' }, def: { en: 'A clear, testable guess about how something in nature works.', hr: 'Jasna pretpostavka o tome kako nešto u prirodi radi, koju je moguće provjeriti pokusom.' } },
      { term: { en: 'observation', hr: 'opažanje (promatranje)' }, def: { en: 'Carefully watching and recording what happens in nature without changing it.', hr: 'Pažljivo promatranje i bilježenje onoga što se u prirodi događa, bez našeg utjecaja.' } },
      { term: { en: 'experiment', hr: 'pokus (eksperiment)' }, def: { en: 'A test we set up on purpose: we change one thing and measure the effect.', hr: 'Provjera koju namjerno izvodimo: mijenjamo jednu stvar i mjerimo učinak.' } },
      { term: { en: 'prediction', hr: 'predviđanje' }, def: { en: 'What should happen in the test if the hypothesis is true.', hr: 'Ono što bi se u pokusu trebalo dogoditi ako je hipoteza točna.' } },
      { term: { en: 'independent variable', hr: 'nezavisna varijabla' }, def: { en: 'The quantity we change on purpose in a fair test.', hr: 'Veličina koju u poštenom pokusu namjerno mijenjamo.' } },
      { term: { en: 'dependent variable', hr: 'zavisna varijabla' }, def: { en: 'The quantity we measure to see the effect of the change.', hr: 'Veličina koju mjerimo da vidimo učinak promjene.' } },
      { term: { en: 'controlled variable', hr: 'kontrolirana varijabla' }, def: { en: 'Everything we keep the same so that it cannot affect the result.', hr: 'Sve što držimo nepromijenjenim da ne bi utjecalo na rezultat.' } },
      { term: { en: 'measurement uncertainty', hr: 'mjerna nesigurnost' }, def: { en: 'How far the true value may be from our result. Every measurement has one; we estimate it with the maximum absolute deviation Δx.', hr: 'Koliko se prava vrijednost može razlikovati od našeg rezultata. Ima je svako mjerenje; procjenjujemo je maksimalnim apsolutnim odstupanjem Δx.' } },
      { term: { en: 'mean value', hr: 'srednja vrijednost' }, def: { en: 'The sum of all readings divided by their number.', hr: 'Zbroj svih izmjerenih vrijednosti podijeljen njihovim brojem.' } },
      { term: { en: 'relative error', hr: 'relativna pogreška' }, def: { en: 'The uncertainty compared with the value, in percent: r = Δx / x̄ · 100 %.', hr: 'Nesigurnost u usporedbi s vrijednošću, u postocima: r = Δx / x̄ · 100 %.' } },
      { term: { en: 'model', hr: 'model' }, def: { en: 'A simplified picture of a real thing that keeps only what matters for the question.', hr: 'Pojednostavljena slika stvarnog tijela ili pojave koja zadržava samo ono bitno za pitanje.' } },
      { term: { en: 'law', hr: 'zakon' }, def: { en: 'A rule that describes what happens, often written as a formula.', hr: 'Pravilo koje opisuje što se događa, često zapisano kao formula.' } },
      { term: { en: 'theory', hr: 'teorija' }, def: { en: 'A well-tested explanation of why things happen, which also predicts new things.', hr: 'Dobro provjereno objašnjenje zašto se nešto događa, koje predviđa i nove pojave.' } }
    ],

    formulas: [
      { expr: 'x̄ = (x₁ + x₂ + x₃) / 3', name: { en: 'mean value of three readings', hr: 'srednja vrijednost triju mjerenja' }, note: { en: 'add the readings, divide by how many there are', hr: 'zbroji rezultate i podijeli njihovim brojem' } },
      { expr: 'x = x̄ ± Δx', name: { en: 'result written as an interval', hr: 'rezultat zapisan kao interval' }, note: { en: 'Δx = the largest deviation of a reading from the mean', hr: 'Δx = najveće odstupanje pojedinog mjerenja od srednje vrijednosti' } },
      { expr: 'r = Δx / x̄ · 100 %', name: { en: 'relative error', hr: 'relativna pogreška' }, note: { en: 'a small r means a good measurement', hr: 'mali r znači dobro mjerenje' } }
    ],

    funFact: {
      en: 'Until 2019 the kilogram was defined by a single platinum-iridium cylinder kept in a vault near Paris. Over a century its mass drifted by about 50 micrograms compared with its official copies, roughly the mass of a grain of fine sand, so scientists redefined the kilogram using a constant of nature that can never change.',
      hr: 'Do 2019. godine kilogram je bio određen jednim jedinim valjkom od platine i iridija koji se čuva u trezoru kraj Pariza. Tijekom stoljeća njegova se masa u odnosu na službene kopije promijenila za oko 50 mikrograma, otprilike koliko ima zrnce sitnog pijeska, pa su znanstvenici kilogram iznova definirali pomoću prirodne konstante koja se nikad ne mijenja.'
    },

    experiment: {
      title: { en: 'A fair test: does the period of a pendulum depend on its mass?', hr: 'Pošten pokus: ovisi li period njihala o masi?' },
      materials: {
        en: ['a piece of string about 1 m long', '3 or 4 identical metal washers or nuts', 'a phone with a stopwatch', 'sticky tape and a table edge or door frame', 'a notebook for a table of results'],
        hr: ['komad niti dug oko 1 m', '3 ili 4 jednake metalne podloške ili matice', 'mobitel sa štopericom', 'selotejp i rub stola ili okvir vrata', 'bilježnica za tablicu rezultata']
      },
      steps: {
        en: [
          'Tie one washer to the string and tape the other end to the table edge so that the washer hangs freely. Measure the length from the knot at the top to the middle of the washer and write it down.',
          'Pull the washer aside a little (about a hand\'s width), let it go and start the stopwatch as it passes the lowest point. Count 10 full swings (there and back) and stop the watch.',
          'Repeat the timing two more times. Compute the mean time for 10 swings and divide it by 10 to get the period of one swing.',
          'Now add a second and later a third washer, keeping the string length and the starting pull exactly the same. For each mass, time 10 swings three times.',
          'Compare the periods. Which variable did you change, which did you measure, and which did you keep the same?',
          'Extra: with one washer, shorten the string to half its length. Does the period change now?'
        ],
        hr: [
          'Jednu podlošku zaveži na nit, a drugi kraj niti selotejpom pričvrsti na rub stola tako da podloška slobodno visi. Izmjeri duljinu od gornjeg čvora do sredine podloške i zapiši je.',
          'Podlošku malo otkloni (otprilike za širinu dlana), pusti je i pokreni štopericu kad prođe kroz najniži položaj. Broji 10 punih titraja (tamo i natrag) i zaustavi štopericu.',
          'Mjerenje ponovi još dva puta. Izračunaj srednje vrijeme za 10 titraja i podijeli ga s 10 da dobiješ period jednog titraja.',
          'Sad dodaj drugu, a zatim i treću podlošku, pazeći da duljina niti i početni otklon ostanu potpuno isti. Za svaku masu tri puta izmjeri vrijeme 10 titraja.',
          'Usporedi periode. Koju si varijablu mijenjao, koju mjerio, a koju držao jednakom?',
          'Dodatak: s jednom podloškom skrati nit na polovicu duljine. Mijenja li se period sada?'
        ]
      },
      explain: {
        en: 'Timing 10 swings instead of one makes the error from your reaction time 10 times smaller per swing. You should find that one, two or three washers give the same period within your uncertainty: the period of a pendulum depends on its length (and on gravity), not on its mass. Halving the length makes the period about 1.4 times shorter.',
        hr: 'Mjerenjem 10 titraja umjesto jednoga pogreška zbog tvojeg vremena reakcije po titraju postaje 10 puta manja. Trebao bi dobiti da jedna, dvije ili tri podloške daju isti period unutar mjerne nesigurnosti: period njihala ovisi o njegovoj duljini (i o sili teži), a ne o masi. Kad duljinu smanjiš na polovicu, period postaje oko 1,4 puta kraći.'
      },
      safety: { en: 'Keep the swings small and make sure nobody stands in the path of the washer.', hr: 'Otkloni neka budu mali i pazi da nitko ne stoji na putu podloške.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which of these is an observation rather than an experiment?', hr: 'Što je od navedenoga opažanje, a ne pokus?' },
        options: [{ en: 'dropping two balls to see which lands first', hr: 'puštanje dviju lopti da se vidi koja prije padne' }, { en: 'pulling a cart with 1 N, 2 N and 3 N', hr: 'vučenje kolica silama 1 N, 2 N i 3 N' }, { en: 'heating water and timing when it boils', hr: 'grijanje vode i mjerenje kad zakipi' }, { en: 'watching the Moon change shape over a month', hr: 'promatranje kako Mjesec mijenja oblik tijekom mjeseca' }], answer: 3,
        explain: { en: 'An observation records what nature does on its own. In an experiment we set things up and change them on purpose.', hr: 'Opažanjem bilježimo što priroda radi sama od sebe. U pokusu stvari namjerno postavljamo i mijenjamo.' } },
      { type: 'mc', q: { en: 'Which sentence is a hypothesis?', hr: 'Koja je rečenica hipoteza?' },
        options: [{ en: 'Pendulums are interesting.', hr: 'Njihala su zanimljiva.' }, { en: 'The period of a pendulum depends on the length of the string.', hr: 'Period njihala ovisi o duljini niti.' }, { en: 'I measured 20.1 s for 10 swings.', hr: 'Izmjerio sam 20,1 s za 10 titraja.' }, { en: 'Measure three times and take the mean.', hr: 'Mjeri tri puta i uzmi srednju vrijednost.' }], answer: 1,
        explain: { en: 'A hypothesis is a testable statement about how something works. An opinion, a single reading or an instruction is not a hypothesis.', hr: 'Hipoteza je provjerljiva tvrdnja o tome kako nešto radi. Mišljenje, jedno mjerenje ili uputa nisu hipoteza.' } },
      { type: 'tf', q: { en: 'Scientific knowledge can change when new evidence appears.', hr: 'Znanstveno znanje može se promijeniti kad se pojave novi dokazi.' }, answer: true,
        explain: { en: 'Yes. Ideas are improved or replaced when experiments demand it. That is exactly what makes science trustworthy.', hr: 'Da. Ideje se popravljaju ili zamjenjuju kad to pokusi zahtijevaju. Upravo to čini znanost pouzdanom.' } },
      { type: 'mc', q: { en: 'You pull the same cart with 1 N, 2 N and 3 N and measure its acceleration each time. Which of these is a controlled variable?', hr: 'Ista kolica vučeš silama 1 N, 2 N i 3 N i svaki put mjeriš njihovo ubrzanje. Što je od navedenoga kontrolirana varijabla?' },
        options: [{ en: 'the pulling force', hr: 'sila vučenja' }, { en: 'the acceleration of the cart', hr: 'ubrzanje kolica' }, { en: 'the mass of the cart', hr: 'masa kolica' }, { en: 'the stopwatch reading', hr: 'vrijeme na štoperici' }], answer: 2,
        explain: { en: 'The force is the independent variable (you change it), the acceleration is the dependent variable (you measure it). The mass of the cart must stay the same: it is controlled.', hr: 'Sila je nezavisna varijabla (nju mijenjaš), ubrzanje je zavisna varijabla (nju mjeriš). Masa kolica mora ostati ista: ona je kontrolirana.' } },
      { type: 'num', q: { en: 'A pencil was measured three times: 14.2 cm, 14.4 cm and 14.3 cm. What is the mean value?', hr: 'Olovka je izmjerena tri puta: 14,2 cm, 14,4 cm i 14,3 cm. Kolika je srednja vrijednost?' },
        answer: 14.3, tolerance: 0.05, unit: 'cm',
        explain: { en: 'x̄ = (14.2 + 14.4 + 14.3) cm / 3 = 42.9 cm / 3 = 14.3 cm.', hr: 'x̄ = (14,2 + 14,4 + 14,3) cm / 3 = 42,9 cm / 3 = 14,3 cm.' } },
      { type: 'num', q: { en: 'Ten swings of a pendulum were timed three times: 19.8 s, 20.2 s and 20.0 s. The mean is 20.0 s. What is the maximum absolute deviation Δt?', hr: 'Vrijeme 10 titraja njihala izmjereno je tri puta: 19,8 s, 20,2 s i 20,0 s. Srednja vrijednost je 20,0 s. Koliko iznosi maksimalno apsolutno odstupanje Δt?' },
        answer: 0.2, tolerance: 0.01, unit: 's',
        explain: { en: 'The deviations from the mean are 0.2 s, 0.2 s and 0 s. The largest is 0.2 s, so t = (20.0 ± 0.2) s.', hr: 'Odstupanja od srednje vrijednosti su 0,2 s, 0,2 s i 0 s. Najveće je 0,2 s, pa je t = (20,0 ± 0,2) s.' } },
      { type: 'tf', q: { en: 'Science can prove a law beyond any doubt.', hr: 'Znanost može dokazati zakon bez ikakve sumnje.' }, answer: false,
        explain: { en: 'Experiments can support a law many times, but a single clear failed prediction can overturn it (the black swan). Science gives reliable, well-tested knowledge, not absolute proof.', hr: 'Pokusi mogu zakon potvrđivati mnogo puta, ali jedno jasno neuspjelo predviđanje može ga srušiti (crni labud). Znanost daje pouzdano, dobro provjereno znanje, a ne apsolutni dokaz.' } },
      { type: 'mc', q: { en: 'What is the difference between a law and a theory in physics?', hr: 'Koja je razlika između zakona i teorije u fizici?' },
        options: [{ en: 'A law describes what happens; a theory explains why and predicts new things.', hr: 'Zakon opisuje što se događa; teorija objašnjava zašto i predviđa nove pojave.' }, { en: 'A law is proven, a theory is only a guess.', hr: 'Zakon je dokazan, a teorija je samo nagađanje.' }, { en: 'A theory becomes a law when enough people believe it.', hr: 'Teorija postaje zakon kad u nju vjeruje dovoljno ljudi.' }, { en: 'There is no difference.', hr: 'Nema razlike.' }], answer: 0,
        explain: { en: 'Laws describe (often as formulas), theories explain and predict. Both are tested by experiment; neither is "just a guess".', hr: 'Zakoni opisuju (često formulom), teorije objašnjavaju i predviđaju. Oboje se provjerava pokusom; ni jedno nije "samo nagađanje".' } },
      { type: 'mc', q: { en: 'A measurement is written as l = (25.43 ± 0.07) cm. What does this mean?', hr: 'Rezultat mjerenja zapisan je kao l = (25,43 ± 0,07) cm. Što to znači?' },
        options: [{ en: 'The exact length is 25.43 cm.', hr: 'Točna duljina je 25,43 cm.' }, { en: 'The length is somewhere between 25.36 cm and 25.50 cm.', hr: 'Duljina je negdje između 25,36 cm i 25,50 cm.' }, { en: 'The length is 25.50 cm.', hr: 'Duljina je 25,50 cm.' }, { en: 'The measurement was repeated 7 times.', hr: 'Mjerenje je ponovljeno 7 puta.' }], answer: 1,
        explain: { en: 'x̄ ± Δx describes an interval: from 25.43 − 0.07 = 25.36 cm to 25.43 + 0.07 = 25.50 cm. The true value is somewhere inside it.', hr: 'x̄ ± Δx opisuje interval: od 25,43 − 0,07 = 25,36 cm do 25,43 + 0,07 = 25,50 cm. Prava vrijednost je negdje unutar njega.' } },
      { type: 'mc', q: { en: 'A pupil weighs a 100.0 g standard mass four times and gets 103.1 g, 103.0 g, 103.2 g and 103.1 g. These measurements are…', hr: 'Učenik četiri puta važe uteg od točno 100,0 g i dobiva 103,1 g, 103,0 g, 103,2 g i 103,1 g. Ta su mjerenja…' },
        options: [{ en: 'accurate but not precise', hr: 'točna, ali nisu precizna' }, { en: 'both precise and accurate', hr: 'i precizna i točna' }, { en: 'neither precise nor accurate', hr: 'ni precizna ni točna' }, { en: 'precise but not accurate', hr: 'precizna, ali nisu točna' }], answer: 3,
        explain: { en: 'The readings are close together (precise) but all about 3 g too high (not accurate). The scale probably needs zeroing, like a stretched measuring tape that always reads wrong in the same way.', hr: 'Rezultati su blizu jedan drugome (precizni), ali svi su oko 3 g previsoki (nisu točni). Vagu vjerojatno treba namjestiti na nulu, kao istegnutu mjernu traku koja uvijek griješi na isti način.' } },
      { type: 'tf', q: { en: 'If you are very careful, measuring once is enough.', hr: 'Ako si vrlo pažljiv, dovoljno je mjeriti jedanput.' }, answer: false,
        explain: { en: 'Even a careful measurement has an uncertainty, and you cannot see it from a single reading. At least three readings let you find the mean and estimate Δx.', hr: 'I pažljivo mjerenje ima nesigurnost, a iz jednog mjerenja ne možeš je vidjeti. Najmanje tri mjerenja omogućuju ti da nađeš srednju vrijednost i procijeniš Δx.' } },
      { type: 'mc', q: { en: 'Which of these measurements has the smallest relative error?', hr: 'Koje od ovih mjerenja ima najmanju relativnu pogrešku?' },
        options: [{ en: '(100 ± 2) cm', hr: '(100 ± 2) cm' }, { en: '(10 ± 1) cm', hr: '(10 ± 1) cm' }, { en: '(2.0 ± 0.1) cm', hr: '(2,0 ± 0,1) cm' }, { en: '(50 ± 5) cm', hr: '(50 ± 5) cm' }], answer: 0,
        explain: { en: 'r = Δx / x̄ · 100 %: 2 %, 10 %, 5 % and 10 %. The first measurement is relatively the best, even though its absolute error (2 cm) is the biggest.', hr: 'r = Δx / x̄ · 100 %: 2 %, 10 %, 5 % i 10 %. Prvo je mjerenje relativno najbolje, iako je njegova apsolutna pogreška (2 cm) najveća.' } }
    ]
  });
})();
