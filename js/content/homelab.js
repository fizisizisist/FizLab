/* FizLab bonus topic: Home Lab / Kućni laboratorij */
(function () {
  'use strict';
  window.Content.register({
    id: 'homelab',
    order: 6,
    gradeLevel: 0,
    color: 'c1',
    title: { en: 'Home Lab', hr: 'Kućni laboratorij' },
    intro: {
      en: 'A bottle, a piece of string, a few coins and the phone in your pocket are enough for real physics. Learn to experiment at home safely and to measure like a scientist.',
      hr: 'Boca, komad konca, nekoliko kovanica i mobitel u džepu dovoljni su za pravu fiziku. Nauči kako kod kuće sigurno izvoditi pokuse i mjeriti poput znanstvenika.'
    },
    sims: ['stopwatch', 'datalab', 'tonegen', 'sensors'],

    lesson: [
      {
        h: { en: 'Your home is a lab', hr: 'Tvoj dom je laboratorij' },
        p: {
          en: [
            'You do not need a room full of expensive equipment to do physics. A kitchen and a desk drawer will do. With a plastic bottle, a piece of string, a few coins, a ruler, a kitchen scale and a measuring jug you can time a pendulum, find the density of water, test how a rubber band stretches or check whether heavy things really fall faster. The phone in your pocket adds a stopwatch, a microphone and motion sensors.',
            'What turns playing into an experiment is the way you work: you ask a clear question, change one thing on purpose, measure carefully and write everything down. A notebook is your most important piece of equipment. Write the date, what you did and every number you measured, including the ones that look wrong. Numbers kept only in your head are lost by tomorrow.',
            'A good lab is a safe lab, so four rules always apply. Use batteries only and never the mains socket: 230 V can kill. Hot water, candles and matches only with an adult next to you. Never look at the Sun, not even through sunglasses or binoculars. And tidy up when you finish: wipe up spilled water, pick up marbles and coins from the floor, and keep the phone away from water.'
          ],
          hr: [
            'Za fiziku ti ne treba prostorija puna skupe opreme. Dovoljni su kuhinja i ladica pisaćeg stola. S plastičnom bocom, komadom konca, nekoliko kovanica, ravnalom, kuhinjskom vagom i mjericom možeš mjeriti period njihala, odrediti gustoću vode, ispitati kako se rasteže gumica ili provjeriti padaju li teška tijela doista brže. Mobitel u tvom džepu dodaje štopericu, mikrofon i senzore gibanja.',
            'Igru u pokus pretvara način na koji radiš: postaviš jasno pitanje, namjerno mijenjaš jednu stvar, pažljivo mjeriš i sve zapisuješ. Bilježnica je tvoj najvažniji pribor. Zapiši datum, što si radio i svaki broj koji si izmjerio, pa i one koji izgledaju pogrešno. Brojevi koje čuvaš samo u glavi do sutra su izgubljeni.',
            'Dobar laboratorij je siguran laboratorij, zato uvijek vrijede četiri pravila. Koristi samo baterije, a nikad utičnicu: 230 V može ubiti. Vruća voda, svijeće i šibice samo uz odraslu osobu pokraj tebe. Nikad ne gledaj u Sunce, čak ni kroz sunčane naočale ili dalekozor. I pospremi kad završiš: obriši prolivenu vodu, pokupi kuglice i kovanice s poda, a mobitel drži podalje od vode.'
          ]
        }
      },
      {
        h: { en: 'Predict first, then do it, then explain', hr: 'Prvo predvidi, zatim izvedi, pa objasni' },
        p: {
          en: [
            'Before you start an experiment, stop for a moment and write down what you think will happen and why: "I think the bigger coin will land first, because it is heavier." This takes ten seconds, and it changes everything. Now your brain has made a bet, and it will watch the experiment with full attention to see whether the bet was right.',
            'Then do the experiment and look carefully. Drop a large coin and a small coin from the same height at the same moment and listen: one click or two? Finally explain what you saw and compare it with your prediction. Pupils who predict first understand and remember more than pupils who only watch, because a surprise makes the brain rebuild its picture of the world.',
            'What if the result surprises you? First, do not rub out your prediction: a wrong prediction is not a bad mark, it is the place where you learn the most. Second, repeat the experiment to check that it was not an accident or a slip of the hand. If the result stays the same, nature is right and your idea has to change, never the other way round. Then ask the best question in science: why?'
          ],
          hr: [
            'Prije nego što počneš pokus, zastani na trenutak i zapiši što misliš da će se dogoditi i zašto: "Mislim da će veća kovanica pasti prva jer je teža." To traje deset sekundi, a mijenja sve. Tvoj se mozak sada okladio i pratit će pokus punom pažnjom da vidi je li oklada bila dobra.',
            'Zatim izvedi pokus i pažljivo opažaj. Pusti veliku i malu kovanicu s iste visine u istom trenutku i slušaj: jedan udarac ili dva? Na kraju objasni što si opazio i usporedi to sa svojim predviđanjem. Učenici koji prvo predviđaju razumiju i pamte više od onih koji samo gledaju, jer iznenađenje tjera mozak da iznova složi svoju sliku svijeta.',
            'Što ako te rezultat iznenadi? Prvo, nemoj brisati svoje predviđanje: pogrešno predviđanje nije loša ocjena, nego mjesto na kojem najviše naučiš. Drugo, ponovi pokus da provjeriš da nije bila riječ o slučajnosti ili nespretnoj ruci. Ako rezultat ostane isti, priroda je u pravu i mijenjati se mora tvoja ideja, nikad obrnuto. Zatim postavi najbolje pitanje u znanosti: zašto?'
          ]
        }
      },
      {
        h: { en: 'Measuring time well', hr: 'Kako dobro izmjeriti vrijeme' },
        p: {
          en: [
            'Between the moment your eyes see something and the moment your finger presses the button, about 0.2 s pass. That is your reaction time, and it sneaks into every time you measure by hand. If one swing of a pendulum lasts 1.4 s, an error of 0.2 s is huge: one seventh of the result. You cannot switch your reaction time off, but you can outsmart it.',
            'The trick is to time many swings instead of one. Let the pendulum swing 10 times, measure the total time and divide by 10: T = t / n. If 10 swings take 14.2 s, one swing takes 1.42 s, and the 0.2 s error is shared among ten swings, only 0.02 s for each. Count properly: say "zero" when you start the stopwatch and "one" only after the first full swing, otherwise you time just nine swings.',
            'Repeat every timing at least three times and take the mean, because single readings jump around. The Stopwatch tool in this topic helps with all of this. Lap times let you record several results without stopping the clock. With the tap timer you tap the screen in the rhythm of the swings and the tool works out the time between taps. And the reaction test shows your own reaction time in black and white.'
          ],
          hr: [
            'Od trenutka kad tvoje oči nešto vide do trenutka kad prst pritisne tipku prođe oko 0,2 s. To je tvoje vrijeme reakcije i ono se uvuče u svako vrijeme koje mjeriš rukom. Ako jedan titraj njihala traje 1,4 s, pogreška od 0,2 s je golema: sedmina rezultata. Vrijeme reakcije ne možeš isključiti, ali ga možeš nadmudriti.',
            'Trik je mjeriti mnogo titraja umjesto jednoga. Pusti njihalo da napravi 10 titraja, izmjeri ukupno vrijeme i podijeli s 10: T = t / n. Ako 10 titraja traje 14,2 s, jedan titraj traje 1,42 s, a pogreška od 0,2 s podijeli se na deset titraja, samo 0,02 s na svaki. Broji ispravno: reci "nula" kad pokreneš štopericu, a "jedan" tek nakon prvog punog titraja, inače mjeriš samo devet titraja.',
            'Svako mjerenje vremena ponovi najmanje tri puta i izračunaj srednju vrijednost, jer pojedinačni rezultati skaču. Alat Štoperica u ovoj temi pomaže ti u svemu tome. Prolazna vremena omogućuju da zabilježiš više rezultata bez zaustavljanja sata. Pri mjerenju dodirom dodiruješ zaslon u ritmu titraja, a alat izračuna vrijeme između dodira. A test reakcije pokazuje ti tvoje vlastito vrijeme reakcije, crno na bijelo.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><defs><marker id="hl-ar1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><line x1="150" y1="14" x2="270" y2="14" stroke="var(--fg)" stroke-width="3"/><line x1="210" y1="14" x2="210" y2="104" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 4"/><line x1="210" y1="14" x2="255" y2="94" stroke="var(--muted)" stroke-width="2"/><circle cx="255" cy="94" r="10" fill="var(--surface2)" stroke="var(--muted)" stroke-width="2"/><line x1="210" y1="14" x2="165" y2="94" stroke="var(--fg)" stroke-width="2"/><circle cx="165" cy="94" r="10" fill="var(--c1)" stroke="var(--fg)" stroke-width="2"/><path d="M174,114 Q210,128 246,114" fill="none" stroke="var(--c1)" stroke-width="2" marker-start="url(#hl-ar1)" marker-end="url(#hl-ar1)"/><text x="70" y="62" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">0, 1, 2 … 10</text><text x="345" y="62" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">T = t / n</text></svg>'
      },
      {
        h: { en: 'Your phone is full of instruments', hr: 'Tvoj mobitel pun je mjernih instrumenata' },
        p: {
          en: [
            'A phone is a pocket laboratory. Inside it are sensors, tiny electronic parts that turn something physical, like sound, movement or light, into numbers. At many universities physics students now do real lab exercises with their own phones instead of special equipment. The Phone Sensors and Tone Generator tools in this topic let you do the same. The browser will first ask your permission to use the microphone.',
            'The microphone is a sound stopwatch that needs no fingers. Put a coin on the edge of a table and knock it off with a ruler. The microphone hears the knock and then the coin landing, and the time between the two sounds is the time of the fall, measured to a hundredth of a second: about 0.4 s from a table 80 cm high. The microphone can also measure pitch, the frequency of a tone in hertz.',
            'The motion sensors feel how the phone is tilted and how quickly its speed changes, its acceleration. That is how the screen knows when to turn sideways. Lay the phone on a tilted book and you have an angle meter; hold it tight in a lift and you can see the lift start and stop. The speaker works the other way round: the Tone Generator makes a tone of exactly the frequency you choose, for example 440 Hz, the note musicians tune to.'
          ],
          hr: [
            'Mobitel je džepni laboratorij. U njemu su senzori, sitni elektronički dijelovi koji nešto fizičko, poput zvuka, gibanja ili svjetlosti, pretvaraju u brojeve. Na mnogim sveučilištima studenti fizike danas izvode prave laboratorijske vježbe vlastitim mobitelima umjesto posebnom opremom. Alati Senzori mobitela i Generator tona u ovoj temi omogućuju ti isto. Preglednik će te najprije pitati za dopuštenje da koristi mikrofon.',
            'Mikrofon je zvučna štoperica kojoj ne trebaju prsti. Stavi kovanicu na rub stola i izbij je ravnalom. Mikrofon čuje udarac, a zatim i pad kovanice na pod, a vrijeme između ta dva zvuka je vrijeme padanja, izmjereno na stotinku sekunde: oko 0,4 s sa stola visokog 80 cm. Mikrofon može izmjeriti i visinu tona, to jest frekvenciju tona u hercima.',
            'Senzori gibanja osjećaju koliko je mobitel nagnut i koliko mu se brzo mijenja brzina, to jest njegovo ubrzanje. Tako zaslon zna kad se treba okrenuti. Položi mobitel na nagnutu knjigu i imaš kutomjer; drži ga čvrsto u dizalu i vidjet ćeš kako dizalo kreće i staje. Zvučnik radi obrnuto: Generator tona stvara ton točno one frekvencije koju odabereš, na primjer 440 Hz, ton prema kojem glazbenici ugađaju glazbala.'
          ]
        }
      },
      {
        h: { en: 'From a table to a graph', hr: 'Od tablice do grafa' },
        p: {
          en: [
            'A good experiment has one quantity that you change, one that you measure, and everything else kept the same. Write the results in a table straight away: the changed quantity in the first column, the measured one in the second, and the unit in the heading of each column, for example t / s and s / m. A number without a unit means nothing: 12 what? Metres, seconds, coins?',
            'A graph shows at a glance what a table hides. Put the quantity you changed on the horizontal axis and the one you measured on the vertical axis, then mark one point for every row. Do not join the points in a zigzag. If they lie roughly along a line, draw one straight line that passes as close as possible to all of them. The Data Table and Graph tool does this for you.',
            'A straight line through the origin, the point (0, 0), means the two quantities are proportional: twice the one gives twice the other. The steepness of the line is its slope, k = Δy / Δx, and it has a meaning and a unit. Walk steadily and note 6 m after 5 s and 12 m after 10 s: the slope is 6 m / 5 s = 1.2 m/s, your speed. For mass plotted against volume, the slope is the density.'
          ],
          hr: [
            'Dobar pokus ima jednu veličinu koju mijenjaš, jednu koju mjeriš, a sve ostalo držiš jednakim. Rezultate odmah upisuj u tablicu: veličinu koju mijenjaš u prvi stupac, mjerenu veličinu u drugi, a mjernu jedinicu u zaglavlje svakog stupca, na primjer t / s i s / m. Broj bez jedinice ne znači ništa: 12 čega? Metara, sekundi, kovanica?',
            'Graf na prvi pogled pokazuje ono što tablica skriva. Veličinu koju si mijenjao nanesi na vodoravnu os, a onu koju si mjerio na okomitu, pa za svaki redak tablice ucrtaj jednu točku. Ne spajaj točke cik-cak crtom. Ako leže približno duž pravca, povuci jedan pravac koji prolazi što bliže svim točkama. Alat Tablica i graf to radi umjesto tebe.',
            'Pravac kroz ishodište, točku (0, 0), znači da su dvije veličine proporcionalne (razmjerne): dvaput veća jedna daje dvaput veću drugu. Strmina pravca zove se nagib, k = Δy / Δx, i ima značenje i mjernu jedinicu. Hodaj jednoliko i zabilježi 6 m nakon 5 s i 12 m nakon 10 s: nagib je 6 m / 5 s = 1,2 m/s, a to je tvoja brzina. U grafu mase u ovisnosti o obujmu nagib je gustoća.'
          ]
        },
        svg: '<svg viewBox="0 0 420 150" role="img"><defs><marker id="hl-ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><line x1="60" y1="125" x2="395" y2="125" stroke="var(--fg)" stroke-width="2" marker-end="url(#hl-ar2)"/><line x1="60" y1="125" x2="60" y2="12" stroke="var(--fg)" stroke-width="2" marker-end="url(#hl-ar2)"/><line x1="60" y1="125" x2="375" y2="20" stroke="var(--c1)" stroke-width="3"/><g stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"><line x1="180" y1="85" x2="300" y2="85"/><line x1="300" y1="85" x2="300" y2="45"/></g><g fill="var(--c2)" stroke="var(--fg)" stroke-width="1.5"><circle cx="120" cy="107" r="5"/><circle cx="180" cy="83" r="5"/><circle cx="240" cy="67" r="5"/><circle cx="300" cy="43" r="5"/><circle cx="360" cy="27" r="5"/></g><text x="240" y="104" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">Δx</text><text x="310" y="70" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">Δy</text><text x="398" y="143" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">x</text><text x="44" y="20" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">y</text><text x="50" y="141" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">0</text></svg>'
      },
      {
        h: { en: 'A short lab report', hr: 'Kratko izvješće o pokusu' },
        p: {
          en: [
            'An experiment is finished only when somebody else can understand and repeat it. That is what a lab report is for, and one page is enough. It has seven short parts: the question, your prediction, the materials, what you did, the results, the conclusion, and what you would improve next time. A sketch or a photo of the set-up often says more than five sentences.',
            'The results are the heart of the report: a table with units, a graph if you changed something step by step, and the final value written as mean ± largest deviation, for example T = (1.42 ± 0.02) s. The conclusion answers the question from the beginning in one or two sentences and says whether your prediction was right. Do not write "the experiment worked"; write what you found out.',
            'The most important rule is honesty. If one result does not fit the others, do not delete it and do not "fix" it. Leave it in the table, repeat the measurement if you can, and write what you think went wrong: perhaps the string slipped or you miscounted the swings. Real scientists do exactly the same, and some great discoveries began with a number that refused to fit.'
          ],
          hr: [
            'Pokus je gotov tek kad ga netko drugi može razumjeti i ponoviti. Tome služi izvješće o pokusu, a dovoljna je jedna stranica. Ima sedam kratkih dijelova: pitanje, tvoje predviđanje, pribor, što si radio, rezultati, zaključak i što bi sljedeći put poboljšao. Skica ili fotografija postava često kaže više od pet rečenica.',
            'Rezultati su srce izvješća: tablica s mjernim jedinicama, graf ako si nešto mijenjao korak po korak i konačna vrijednost zapisana kao srednja vrijednost ± najveće odstupanje, na primjer T = (1,42 ± 0,02) s. Zaključak u jednoj ili dvije rečenice odgovara na pitanje s početka i kaže je li tvoje predviđanje bilo točno. Nemoj pisati "pokus je uspio"; napiši što si otkrio.',
            'Najvažnije pravilo je poštenje. Ako se jedan rezultat ne uklapa među ostale, nemoj ga brisati niti "popravljati". Ostavi ga u tablici, ponovi mjerenje ako možeš i napiši što misliš da je pošlo po zlu: možda je konac skliznuo ili si pogrešno izbrojio titraje. Pravi znanstvenici rade upravo tako, a neka su velika otkrića počela brojem koji se nikako nije htio uklopiti.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'measuring instrument', hr: 'mjerni instrument' }, def: { en: 'A device that compares a quantity with a unit and shows a number: a ruler, a scale, a stopwatch, a thermometer.', hr: 'Sprava koja veličinu uspoređuje s mjernom jedinicom i pokazuje broj: ravnalo, vaga, štoperica, termometar.' } },
      { term: { en: 'stopwatch', hr: 'štoperica' }, def: { en: 'An instrument for measuring how long something lasts, usually to a hundredth of a second.', hr: 'Mjerni instrument kojim mjerimo koliko nešto traje, obično na stotinku sekunde.' } },
      { term: { en: 'reaction time', hr: 'vrijeme reakcije' }, def: { en: 'The time between noticing a signal and responding to it, about 0.2 s for most people.', hr: 'Vrijeme od opažanja signala do odgovora na njega, kod većine ljudi oko 0,2 s.' } },
      { term: { en: 'sensor', hr: 'senzor' }, def: { en: 'A small electronic part that turns a physical quantity (sound, tilt, acceleration, light) into a number.', hr: 'Sitni elektronički dio koji fizičku veličinu (zvuk, nagib, ubrzanje, svjetlost) pretvara u broj.' } },
      { term: { en: 'microphone', hr: 'mikrofon' }, def: { en: 'A sensor that turns sound into an electrical signal. It can time the gap between two sharp sounds and measure the pitch of a tone.', hr: 'Senzor koji zvuk pretvara u električni signal. Njime možemo izmjeriti vrijeme između dva oštra zvuka i visinu tona.' } },
      { term: { en: 'table of results', hr: 'tablica rezultata' }, def: { en: 'Rows and columns of measured values; the heading of each column gives the quantity and its unit.', hr: 'Redci i stupci s izmjerenim vrijednostima; u zaglavlju svakog stupca stoje veličina i mjerna jedinica.' } },
      { term: { en: 'graph', hr: 'graf' }, def: { en: 'A picture of the results: the quantity you change on the horizontal axis, the one you measure on the vertical axis, one point for each measurement.', hr: 'Slikovni prikaz rezultata: veličina koju mijenjamo na vodoravnoj osi, mjerena veličina na okomitoj, jedna točka za svako mjerenje.' } },
      { term: { en: 'proportionality', hr: 'proporcionalnost (razmjernost)' }, def: { en: 'Two quantities are proportional when doubling one doubles the other. Their graph is a straight line through the origin.', hr: 'Dvije su veličine proporcionalne kad dvostruko veća jedna daje dvostruko veću drugu. Njihov je graf pravac kroz ishodište.' } },
      { term: { en: 'slope of a line', hr: 'nagib pravca' }, def: { en: 'How steep a line on a graph is: k = Δy / Δx. Its unit is the unit of y divided by the unit of x.', hr: 'Koliko je pravac u grafu strm: k = Δy / Δx. Jedinica mu je jedinica veličine y podijeljena jedinicom veličine x.' } },
      { term: { en: 'lab report', hr: 'izvješće o pokusu' }, def: { en: 'A short written record of an experiment: question, prediction, materials, method, results, conclusion and improvements.', hr: 'Kratak pisani zapis o pokusu: pitanje, predviđanje, pribor, postupak, rezultati, zaključak i poboljšanja.' } },
      { term: { en: 'safety', hr: 'sigurnost' }, def: { en: 'Working so that nobody can get hurt: batteries only, an adult for anything hot, never looking at the Sun, tidying up afterwards.', hr: 'Rad pri kojem se nitko ne može ozlijediti: samo baterije, odrasla osoba uz sve vruće, nikad ne gledati u Sunce, pospremanje na kraju.' } }
    ],

    formulas: [
      { expr: 'T = t / n', name: { en: 'period from many swings', hr: 'period iz više titraja' }, note: { en: 't = time of n swings; 10 swings in 14.2 s give T = 1.42 s', hr: 't = vrijeme n titraja; 10 titraja u 14,2 s daje T = 1,42 s' } },
      { expr: 'k = Δy / Δx', name: { en: 'slope of a straight line', hr: 'nagib pravca' }, note: { en: 'change in y divided by change in x between two points on the line; unit of k = unit of y / unit of x', hr: 'promjena y podijeljena promjenom x između dviju točaka pravca; jedinica k = jedinica y / jedinica x' } },
      { expr: 's = v · t', name: { en: 'distance travelled during the reaction time', hr: 'put prijeđen za vrijeme reakcije' }, note: { en: 't = reaction time; on a bike at 5 m/s you travel 1 m in 0.2 s before you even start to brake', hr: 't = vrijeme reakcije; na biciklu pri 5 m/s za 0,2 s prijeđeš 1 m prije nego što uopće počneš kočiti' } }
    ],

    funFact: {
      en: 'Since 1977, world records in sprint races up to 400 m have counted only when measured by fully automatic electronic timing. A timekeeper with a hand stopwatch reacts late to the start signal, so hand-timed 100 m results come out about 0.2 s too short.',
      hr: 'Od 1977. godine svjetski rekordi u sprinterskim utrkama do 400 m priznaju se samo ako su izmjereni potpuno automatskim elektroničkim mjerenjem. Mjeritelj s ručnom štopericom kasni s reakcijom na znak starta, pa ručno izmjereni rezultati na 100 m ispadnu oko 0,2 s prekratki.'
    },

    experiment: {
      title: { en: 'Catch a falling ruler: measure your reaction time', hr: 'Uhvati ravnalo koje pada: izmjeri svoje vrijeme reakcije' },
      materials: {
        en: ['a ruler at least 30 cm long', 'a helper', 'a table to rest your arm on', 'a notebook and a pencil', 'a phone or computer with the Stopwatch tool (reaction test)'],
        hr: ['ravnalo dugo najmanje 30 cm', 'pomoćnik', 'stol na koji ćeš nasloniti ruku', 'bilježnica i olovka', 'mobitel ili računalo s alatom Štoperica (test reakcije)']
      },
      steps: {
        en: [
          'Write down your prediction first: how many centimetres will the ruler fall before you catch it? Will you be faster or slower than your helper?',
          'Rest your forearm on the table with your hand over the edge. Your helper holds the ruler upright by its top end so that the zero mark is level with the top of your open thumb and forefinger. Your fingers must not touch the ruler.',
          'Without any warning, the helper lets go. Catch the ruler as fast as you can by closing your fingers and read the mark at the top edge of your thumb. That is how far the ruler fell.',
          'Do it five times and write down every result, even the bad ones. Calculate the mean distance.',
          'Turn the distance into a time: 5 cm means 0.10 s, 10 cm 0.14 s, 15 cm 0.17 s, 20 cm 0.20 s, 25 cm 0.23 s and 30 cm 0.25 s.',
          'Now open the reaction test in the Stopwatch tool and do it five times as well. Compare the two mean times, then swap roles with your helper.',
          'Extra: test your other hand, or try again late in the evening when you are tired. Does your reaction time change?'
        ],
        hr: [
          'Najprije zapiši svoje predviđanje: koliko će centimetara ravnalo pasti prije nego što ga uhvatiš? Hoćeš li biti brži ili sporiji od pomoćnika?',
          'Nasloni podlakticu na stol tako da ti šaka viri preko ruba. Pomoćnik drži ravnalo uspravno za gornji kraj tako da je oznaka nula u visini gornjeg ruba tvog raširenog palca i kažiprsta. Prsti ne smiju dodirivati ravnalo.',
          'Pomoćnik bez ikakve najave pusti ravnalo. Uhvati ga što brže možeš stiskom prstiju i očitaj oznaku uz gornji rub palca. Toliko je ravnalo palo.',
          'Ponovi pet puta i zapiši svaki rezultat, pa i one loše. Izračunaj srednju vrijednost puta.',
          'Pretvori put u vrijeme: 5 cm znači 0,10 s, 10 cm 0,14 s, 15 cm 0,17 s, 20 cm 0,20 s, 25 cm 0,23 s, a 30 cm 0,25 s.',
          'Sad otvori test reakcije u alatu Štoperica i također ga ponovi pet puta. Usporedi dvije srednje vrijednosti vremena, a zatim zamijeni uloge s pomoćnikom.',
          'Dodatak: ispitaj drugu ruku ili pokušaj ponovno kasno navečer kad si umoran. Mijenja li se tvoje vrijeme reakcije?'
        ]
      },
      explain: {
        en: 'A released ruler falls freely, faster and faster, so the distance it covers before you stop it depends only on the time (s = g · t² / 2). The longer you take to react, the further it falls, and that makes the ruler a clock with no electronics. Most people catch it after 15 to 25 cm, a reaction time of about 0.2 s. The test on the screen usually gives a slightly longer time, because the device also needs a few hundredths of a second to show the signal and to notice your touch.',
        hr: 'Pušteno ravnalo slobodno pada, sve brže i brže, pa put koji prijeđe prije nego što ga zaustaviš ovisi samo o vremenu (s = g · t² / 2). Što ti dulje treba da reagiraš, ravnalo padne dublje, i tako ono postaje sat bez ikakve elektronike. Većina ljudi uhvati ga nakon 15 do 25 cm, što je vrijeme reakcije od oko 0,2 s. Test na zaslonu obično daje malo dulje vrijeme jer i uređaju treba nekoliko stotinki sekunde da prikaže signal i da opazi tvoj dodir.'
      },
      safety: { en: 'Use a plastic or wooden ruler without sharp edges and keep the falling ruler away from faces and eyes.', hr: 'Koristi plastično ili drveno ravnalo bez oštrih rubova i pazi da ravnalo koje pada bude daleko od lica i očiju.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which of these is safe to do in a home lab?', hr: 'Što je od navedenoga sigurno raditi u kućnom laboratoriju?' },
        options: [{ en: 'pushing two wires into a mains socket', hr: 'gurati dvije žice u utičnicu' }, { en: 'looking at the Sun through binoculars', hr: 'gledati Sunce kroz dalekozor' }, { en: 'lighting a small bulb with a 4.5 V battery', hr: 'upaliti žaruljicu baterijom od 4,5 V' }, { en: 'heating water on the stove while you are home alone', hr: 'grijati vodu na štednjaku dok si sam kod kuće' }], answer: 2,
        explain: { en: 'Batteries are safe for experiments. The mains (230 V) can kill, the Sun can damage your eyes for good, and hot water and flames are allowed only with an adult beside you.', hr: 'Baterije su sigurne za pokuse. Gradska mreža (230 V) može ubiti, Sunce može trajno oštetiti oči, a vruća voda i plamen dopušteni su samo uz odraslu osobu.' } },
      { type: 'tf', q: { en: 'If the result of an experiment does not match your prediction, the experiment has failed.', hr: 'Ako se rezultat pokusa ne slaže s tvojim predviđanjem, pokus nije uspio.' }, answer: false,
        explain: { en: 'A surprise is the most useful result of all. Repeat the experiment to make sure, and if the result stays the same, change your idea, not the numbers.', hr: 'Iznenađenje je najkorisniji rezultat od svih. Ponovi pokus da budeš siguran, a ako rezultat ostane isti, promijeni svoju ideju, a ne brojeve.' } },
      { type: 'mc', q: { en: 'About how long is the reaction time of a person pressing a stopwatch button?', hr: 'Koliko otprilike iznosi vrijeme reakcije osobe koja pritišće tipku štoperice?' },
        options: [{ en: 'about 0.002 s', hr: 'oko 0,002 s' }, { en: 'about 0.2 s', hr: 'oko 0,2 s' }, { en: 'about 2 s', hr: 'oko 2 s' }, { en: 'exactly zero', hr: 'točno nula' }], answer: 1,
        explain: { en: 'The signal has to travel from the eyes to the brain and on to the finger, which takes about 0.2 s. Every time measured by hand is uncertain by about that much.', hr: 'Signal mora doputovati od očiju do mozga i dalje do prsta, a za to treba oko 0,2 s. Svako vrijeme izmjereno rukom nesigurno je otprilike za toliko.' } },
      { type: 'tf', q: { en: 'A phone’s microphone can time a falling coin: it hears the knock that starts the fall and the landing that ends it.', hr: 'Mikrofon mobitela može izmjeriti vrijeme padanja kovanice: čuje udarac kojim pad počinje i udarac o pod kojim završava.' }, answer: true,
        explain: { en: 'The time between the two sharp sounds is the time of the fall. No finger is involved, so your reaction time does not spoil the result.', hr: 'Vrijeme između dva oštra zvuka je vrijeme padanja. Prst ne sudjeluje, pa tvoje vrijeme reakcije ne kvari rezultat.' } },
      { type: 'num', q: { en: 'A pendulum makes 10 full swings in 16 s. How long does one swing take? Use T = t / n.', hr: 'Njihalo napravi 10 punih titraja za 16 s. Koliko traje jedan titraj? Uzmi T = t / n.' },
        answer: 1.6, tolerance: 0.02, unit: 's',
        explain: { en: 'T = t / n = 16 s / 10 = 1.6 s.', hr: 'T = t / n = 16 s / 10 = 1,6 s.' } },
      { type: 'mc', q: { en: 'Why is it better to time 10 swings and divide by 10 than to time a single swing?', hr: 'Zašto je bolje izmjeriti vrijeme 10 titraja i podijeliti s 10 nego mjeriti jedan titraj?' },
        options: [{ en: 'a pendulum swings more evenly while it is being timed', hr: 'njihalo titra pravilnije dok mu mjerimo vrijeme' }, { en: 'a stopwatch is more accurate when it runs for longer', hr: 'štoperica je točnija kad dulje radi' }, { en: 'ten swings take less time than one', hr: 'deset titraja traje kraće od jednoga' }, { en: 'the error from your reaction time is shared among ten swings', hr: 'pogreška zbog vremena reakcije podijeli se na deset titraja' }], answer: 3,
        explain: { en: 'Your reaction adds about the same error (0.2 s) whether you time one swing or ten. Divided by 10, it shrinks to about 0.02 s per swing.', hr: 'Tvoja reakcija unosi otprilike jednaku pogrešku (0,2 s) mjeriš li jedan titraj ili deset. Podijeljena s 10, smanji se na oko 0,02 s po titraju.' } },
      { type: 'tf', q: { en: 'You say "one" as you start the stopwatch and stop it when you say "ten". You have timed ten full swings.', hr: 'Kažeš "jedan" u trenutku kad pokreneš štopericu, a zaustaviš je kad kažeš "deset". Izmjerio si vrijeme deset punih titraja.' }, answer: false,
        explain: { en: 'Between "one" and "ten" there are only nine swings. Say "zero" when you start the stopwatch and "one" after the first full swing.', hr: 'Između "jedan" i "deset" ima samo devet titraja. Reci "nula" kad pokreneš štopericu, a "jedan" nakon prvog punog titraja.' } },
      { type: 'mc', q: { en: 'You investigate how the length of the string changes the period of a pendulum. Which quantity goes on the horizontal axis of the graph?', hr: 'Istražuješ kako duljina konca mijenja period njihala. Koju veličinu nanosiš na vodoravnu os grafa?' },
        options: [{ en: 'the mass of the bob', hr: 'masu utega' }, { en: 'the period of the pendulum', hr: 'period njihala' }, { en: 'the length of the string', hr: 'duljinu konca' }, { en: 'the number of swings', hr: 'broj titraja' }], answer: 2,
        explain: { en: 'The quantity you change on purpose (the length) goes on the horizontal axis, and the one you measure (the period) on the vertical axis. The mass stays the same.', hr: 'Veličinu koju namjerno mijenjaš (duljinu) nanosiš na vodoravnu os, a onu koju mjeriš (period) na okomitu. Masa ostaje ista.' } },
      { type: 'mc', q: { en: 'The points on your graph lie along a straight line that passes through the origin. What does this tell you?', hr: 'Točke u tvom grafu leže duž pravca koji prolazi kroz ishodište. Što ti to govori?' },
        options: [{ en: 'the two quantities are proportional', hr: 'dvije su veličine proporcionalne' }, { en: 'the measured quantity does not depend on the one you changed', hr: 'mjerena veličina ne ovisi o onoj koju si mijenjao' }, { en: 'the measurements must be wrong', hr: 'mjerenja su sigurno pogrešna' }, { en: 'one quantity gets smaller as the other grows', hr: 'jedna se veličina smanjuje dok druga raste' }], answer: 0,
        explain: { en: 'A straight line through (0, 0) means proportionality: double one quantity and the other doubles too. A horizontal line would mean "does not depend".', hr: 'Pravac kroz (0, 0) znači proporcionalnost: udvostručiš li jednu veličinu, udvostruči se i druga. Vodoravan pravac značio bi "ne ovisi".' } },
      { type: 'num', q: { en: 'A straight line on a distance–time graph passes through the points (2 s, 3 m) and (6 s, 9 m). What is its slope? Use k = Δy / Δx.', hr: 'Pravac u grafu put–vrijeme prolazi točkama (2 s, 3 m) i (6 s, 9 m). Koliki je njegov nagib? Uzmi k = Δy / Δx.' },
        answer: 1.5, tolerance: 0.02, unit: 'm/s',
        explain: { en: 'Δy = 9 m − 3 m = 6 m and Δx = 6 s − 2 s = 4 s, so k = 6 m / 4 s = 1.5 m/s. On a distance–time graph the slope is the speed.', hr: 'Δy = 9 m − 3 m = 6 m i Δx = 6 s − 2 s = 4 s, pa je k = 6 m / 4 s = 1,5 m/s. U grafu put–vrijeme nagib je brzina.' } },
      { type: 'mc', q: { en: 'Four of your five timings of 10 swings are close to 14.2 s, but one is 12.8 s. What should you do?', hr: 'Četiri od pet tvojih mjerenja vremena 10 titraja blizu su 14,2 s, ali jedno iznosi 12,8 s. Što trebaš učiniti?' },
        options: [{ en: 'rub it out so that the table looks neat', hr: 'izbrisati ga da tablica izgleda urednije' }, { en: 'change it to 14.2 s like the others', hr: 'promijeniti ga u 14,2 s kao ostala' }, { en: 'throw away all five results', hr: 'odbaciti svih pet rezultata' }, { en: 'keep it in the table, repeat the measurement and note what may have gone wrong', hr: 'ostaviti ga u tablici, ponoviti mjerenje i zapisati što je moglo poći po zlu' }], answer: 3,
        explain: { en: 'An honest report keeps every result. Here 12.8 s is about one swing short of 14.2 s, so you probably counted only nine swings, and a repeated measurement will show it.', hr: 'Pošteno izvješće čuva svaki rezultat. Ovdje je 12,8 s otprilike za jedan titraj manje od 14,2 s, pa si vjerojatno izbrojio samo devet titraja, a ponovljeno mjerenje to će pokazati.' } },
      { type: 'mc', q: { en: 'You ride a bike at 5 m/s and your reaction time is 0.2 s. How far do you travel before you even start to brake? Use s = v · t.', hr: 'Voziš bicikl brzinom 5 m/s, a tvoje vrijeme reakcije je 0,2 s. Koliki put prijeđeš prije nego što uopće počneš kočiti? Uzmi s = v · t.' },
        options: [{ en: '0.04 m', hr: '0,04 m' }, { en: '1 m', hr: '1 m' }, { en: '2.5 m', hr: '2,5 m' }, { en: '25 m', hr: '25 m' }], answer: 1,
        explain: { en: 's = v · t = 5 m/s · 0.2 s = 1 m. During your reaction time the bike rolls on at full speed, which is why you should keep your distance.', hr: 's = v · t = 5 m/s · 0,2 s = 1 m. Za vrijeme reakcije bicikl se giba punom brzinom, zato drži razmak.' } }
    ]
  });
})();
