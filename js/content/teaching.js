/* FizLab — teacher corner ("Za učitelje"): curriculum outcomes, inquiry-lesson outlines, teaching methods, resources (see _teaching_schema.md) */
(function () {
  'use strict';
  window.Content.registerTeaching({

    /* ---------- 1. Outcomes of the Croatian physics curriculum for primary school (NN 10/2019) ---------- */
    outcomes: [
      { code: 'FIZ OŠ A.7.1.', grade: 7,
        hr: 'Uspoređuje dimenzije, masu i gustoću različitih tijela i tvari.',
        en: 'Compares the dimensions, mass and density of different bodies and substances.',
        topics: ['matter', 'density'],
        sims: ['measure', 'density', 'datalab'] },
      { code: 'FIZ OŠ B.7.2.', grade: 7,
        hr: 'Analizira međudjelovanje tijela te primjenjuje koncept sile.',
        en: 'Analyses the interaction of bodies and applies the concept of force.',
        topics: ['forces', 'gravity'],
        sims: ['forcepairs', 'forces', 'spring', 'freefall'] },
      { code: 'FIZ OŠ B.7.3.', grade: 7,
        hr: 'Interpretira silu trenja i njezine učinke.',
        en: 'Interprets the force of friction and its effects.',
        topics: ['forces'],
        sims: ['friction', 'forces', 'galileo'] },
      { code: 'FIZ OŠ B.7.4.', grade: 7,
        hr: 'Analizira uvjete ravnoteže tijela i zakonitost poluge.',
        en: 'Analyses the conditions for the equilibrium of a body and the law of the lever.',
        topics: ['levers', 'gravity'],
        sims: ['lever', 'balance', 'pulleys'] },
      { code: 'FIZ OŠ B.7.5.', grade: 7,
        hr: 'Analizira utjecaj tlaka.',
        en: 'Analyses the effect of pressure.',
        topics: ['pressure', 'density'],
        sims: ['pressure', 'hydraulics', 'density'] },
      { code: 'FIZ OŠ D.7.6.', grade: 7,
        hr: 'Povezuje rad s energijom tijela i analizira pretvorbe energije.',
        en: 'Relates work to the energy of a body and analyses energy transformations.',
        topics: ['energy', 'levers'],
        sims: ['energy', 'energybars', 'energychain', 'spring', 'pulleys'] },
      { code: 'FIZ OŠ A.7.7.', grade: 7,
        hr: 'Objašnjava agregacijska stanja i svojstva tvari na temelju njihove čestične građe.',
        en: 'Explains the states of matter and the properties of substances on the basis of their particle structure.',
        topics: ['matter', 'heat'],
        sims: ['states', 'gas', 'heatingcurve'] },
      { code: 'FIZ OŠ A.7.8.', grade: 7,
        hr: 'Povezuje promjenu volumena tijela i tlaka plina s građom tvari i promjenom temperature.',
        en: 'Relates the change in the volume of a body and in the pressure of a gas to the structure of matter and to the change in temperature.',
        topics: ['heat', 'matter'],
        sims: ['expansion', 'gas', 'states'] },
      { code: 'FIZ OŠ D.7.9.', grade: 7,
        hr: 'Povezuje promjenu unutarnje energije i toplinu.',
        en: 'Relates the change in internal energy to heat.',
        topics: ['heat', 'energy'],
        sims: ['heat', 'heattransfer', 'heatingcurve', 'energybars'] },
      { code: 'FIZ OŠ A.7.10. / B.7.10. / C.7.10. / D.7.10.', grade: 7,
        hr: 'Istražuje fizičke pojave.',
        en: 'Investigates physical phenomena.',
        topics: ['science', 'homelab'],
        sims: ['inquiry', 'measure', 'datalab', 'stopwatch'] },
      { code: 'FIZ OŠ A.7.11. / B.7.11. / C.7.11. / D.7.11.', grade: 7,
        hr: 'Rješava fizičke probleme.',
        en: 'Solves physics problems.',
        topics: ['density', 'forces', 'pressure', 'levers', 'energy', 'heat'],
        sims: ['measure', 'motiongraphs', 'energybars'] },

      { code: 'FIZ OŠ B.8.1.', grade: 8,
        hr: 'Povezuje razdvajanja električnog naboja s električnom strujom i naponom.',
        en: 'Relates the separation of electric charge to electric current and voltage.',
        topics: ['electricity'],
        sims: ['static', 'circuit', 'resistance'] },
      { code: 'FIZ OŠ D.8.2.', grade: 8,
        hr: 'Analizira učinke električne struje i magnetizam.',
        en: 'Analyses the effects of electric current and magnetism.',
        topics: ['magnetism', 'electricity'],
        sims: ['magnet', 'electromagnet', 'induction', 'circuit'] },
      { code: 'FIZ OŠ D.8.3.', grade: 8,
        hr: 'Analizira električnu struju i napon te primjenjuje koncepte rada i snage.',
        en: 'Analyses electric current and voltage and applies the concepts of work and power.',
        topics: ['electricity', 'energy'],
        sims: ['circuit', 'resistance', 'energychain'] },
      { code: 'FIZ OŠ A.8.4.', grade: 8,
        hr: 'Objašnjava električni otpor vodiča.',
        en: 'Explains the electrical resistance of a conductor.',
        topics: ['electricity'],
        sims: ['resistance', 'circuit'] },
      { code: 'FIZ OŠ C.8.5.', grade: 8,
        hr: 'Analizira gibanje tijela po pravcu.',
        en: 'Analyses the motion of a body along a straight line.',
        topics: ['motion'],
        sims: ['motion', 'motiongraphs', 'freefall', 'stopwatch'] },
      { code: 'FIZ OŠ C.8.6.', grade: 8,
        hr: 'Analizira povezanost promjene brzine, sile i mase tijela.',
        en: 'Analyses the relationship between the change in velocity, the force and the mass of a body.',
        topics: ['forces', 'motion', 'gravity'],
        sims: ['forces', 'galileo', 'forcepairs', 'freefall', 'collisions', 'circular'] },
      { code: 'FIZ OŠ C.8.7. / D.8.7.', grade: 8,
        hr: 'Povezuje pojavu titranja i prijenos energije valom.',
        en: 'Relates the phenomenon of oscillation to the transfer of energy by a wave.',
        topics: ['waves'],
        sims: ['pendulum', 'waves', 'sound', 'ripple', 'tonegen'] },
      { code: 'FIZ OŠ C.8.8. / D.8.8.', grade: 8,
        hr: 'Analizira rasprostiranje i odbijanje svjetlosti te nastanak slike u zrcalu.',
        en: 'Analyses the propagation and reflection of light and the formation of an image in a mirror.',
        topics: ['light', 'space'],
        sims: ['light', 'eclipse', 'lens', 'space'] },
      { code: 'FIZ OŠ C.8.9. / D.8.9.', grade: 8,
        hr: 'Analizira lom i odbijanje svjetlosti na granici dvaju optičkih sredstava.',
        en: 'Analyses the refraction and reflection of light at the boundary between two optical media.',
        topics: ['light'],
        sims: ['light', 'lens', 'color'] },
      { code: 'FIZ OŠ A.8.10. / B.8.10. / C.8.10. / D.8.10.', grade: 8,
        hr: 'Istražuje fizičke pojave.',
        en: 'Investigates physical phenomena.',
        topics: ['science', 'homelab'],
        sims: ['inquiry', 'measure', 'datalab', 'stopwatch'] },
      { code: 'FIZ OŠ A.8.11. / B.8.11. / C.8.11. / D.8.11.', grade: 8,
        hr: 'Rješava fizičke probleme.',
        en: 'Solves physics problems.',
        topics: ['motion', 'forces', 'electricity', 'energy', 'waves', 'light'],
        sims: ['measure', 'motiongraphs', 'energybars'] }
    ],

    /* ---------- 2. Inquiry-lesson outlines, one per topic ---------- */
    topics: {

      matter: {
        opening: {
          en: 'Close the tip of a syringe full of air with a finger and push the plunger, then do the same with a syringe full of water. Before the experiment pupils predict which one can be squeezed and draw how they imagine air and water under a magnifier that shows even the tiniest parts. Collect the drawings without comment: they reveal who pictures matter as continuous.',
          hr: 'Prstom začepite štrcaljku punu zraka i pritisnite klip, a zatim isto učinite sa štrcaljkom punom vode. Prije pokusa učenici predviđaju što se može stlačiti i crtaju kako zamišljaju zrak i vodu pod povećalom koje vidi i najsitnije dijelove. Crteže prikupite bez komentara: oni otkrivaju tko tvar zamišlja kao neprekinutu.'
        },
        question: {
          en: 'What must matter be made of if a gas can be squeezed and a liquid or a solid hardly at all?',
          hr: 'Od čega tvar mora biti građena ako plin možemo stlačiti, a tekućinu i čvrsto tijelo gotovo nikako?'
        },
        investigate: {
          en: 'In the simulation "States of Matter" pupils keep the substance the same (water) and change only the temperature with Heat and Cool. For the solid, the liquid and the gas they record how the particles are arranged, how far apart they are and how they move, then repeat it for iron and oxygen. Hands-on: a drop of food colouring in cold and in warm water, same glass and same amount of water, timing how long the colour takes to spread.',
          hr: 'U simulaciji "Agregacijska stanja" učenici zadrže istu tvar (vodu) i mijenjaju samo temperaturu tipkama Zagrijavaj i Hladi. Za čvrsto, tekuće i plinovito stanje bilježe kako su čestice raspoređene, koliko su razmaknute i kako se gibaju, a zatim isto ponove za željezo i kisik. Pokus u učionici: kap prehrambene boje u hladnoj i u toploj vodi, jednaka čaša i jednaka količina vode, mjeri se vrijeme za koje se boja raširi.'
        },
        keyIdea: {
          en: 'All matter is made of tiny particles that never stop moving, with empty space between them. The three states differ in how the particles are arranged and how freely they move, not in the particles themselves.',
          hr: 'Sva je tvar građena od sitnih čestica koje se neprestano gibaju, a među njima je prazan prostor. Tri agregacijska stanja razlikuju se po rasporedu i slobodi gibanja čestica, a ne po samim česticama.'
        },
        talk: [
          { en: 'What is between the particles of air: more air, or nothing at all?', hr: 'Što se nalazi između čestica zraka: još zraka ili baš ništa?' },
          { en: 'An ice cube melts. Did the particles themselves melt, grow or change, or did something else change?', hr: 'Kocka leda se rastali. Jesu li se rastalile, narasle ili promijenile same čestice ili se promijenilo nešto drugo?' },
          { en: 'A pumped-up ball is slightly heavier than a flat one. What does that tell us about air?', hr: 'Napumpana lopta malo je teža od ispuhane. Što nam to govori o zraku?' }
        ],
        exit: {
          en: 'Draw the particles of air in a closed syringe before and after the plunger is pushed, and write in one sentence what changed and what stayed the same.',
          hr: 'Nacrtaj čestice zraka u začepljenoj štrcaljki prije i nakon pritiska klipa te jednom rečenicom napiši što se promijenilo, a što je ostalo isto.'
        },
        watch: {
          en: 'Pupils give the particles the properties of the whole body: particles of ice are cold and hard, particles expand or melt, and between them there is air. Ask Socratic questions about the drawings (what is in the gap?) and use the syringe as a cognitive conflict: if air were continuous, what would give way when we squeeze it?',
          hr: 'Učenici česticama pripisuju svojstva cijelog tijela: čestice leda su hladne i tvrde, čestice se šire ili tale, a među njima je zrak. Postavljajte sokratska pitanja o crtežima (što je u razmaku?) i iskoristite štrcaljku kao kognitivni konflikt: da je zrak neprekinut, što bi popustilo kad ga stlačimo?'
        }
      },

      density: {
        opening: {
          en: 'Show a heavy wooden block and a light steel paper clip and ask which of them will sink. Then hold up a whole candle and a crumb cut from it. Pupils vote individually and write down a reason before anything touches the water; most reasons will speak about how heavy the thing is.',
          hr: 'Pokažite težak drveni kvadar i laganu čeličnu spajalicu i pitajte što će od toga potonuti. Zatim podignite cijelu svijeću i mrvicu odrezanu s nje. Učenici pojedinačno glasuju i zapisuju obrazloženje prije nego što išta dotakne vodu; većina obrazloženja govorit će o tome koliko je tijelo teško.'
        },
        question: {
          en: 'What decides whether a body floats or sinks: its mass, its size, or something else?',
          hr: 'O čemu ovisi hoće li tijelo plutati ili potonuti: o masi, o veličini ili o nečem trećem?'
        },
        investigate: {
          en: 'In the simulation "Float or Sink?" pupils first keep the material and the liquid the same and change only the volume of the cube, writing mass, volume and the ratio m / V in a table. Then they keep the volume and change only the material, and finally only the liquid, noting each time whether the cube floats. Hands-on: find the density of three plasticine lumps of different size with a kitchen scale and a measuring cylinder, measuring each three times.',
          hr: 'U simulaciji "Pluta ili tone?" učenici najprije zadrže isti materijal i istu tekućinu, a mijenjaju samo obujam kocke te u tablicu upisuju masu, obujam i omjer m / V. Zatim zadrže obujam, a mijenjaju samo materijal i na kraju samo tekućinu, svaki put bilježeći pluta li kocka. Pokus u učionici: kuhinjskom vagom i menzurom odrede gustoću triju različito velikih komada plastelina, a svaki mjere tri puta.'
        },
        keyIdea: {
          en: 'Density, ρ = m / V, is a property of the substance, not of the piece. A body floats when its average density is lower than the density of the liquid, however heavy it is.',
          hr: 'Gustoća, ρ = m / V, svojstvo je tvari, a ne komada. Tijelo pluta kad mu je prosječna gustoća manja od gustoće tekućine, bez obzira na to koliko je teško.'
        },
        talk: [
          { en: 'A steel ship of 50 000 tonnes floats and a steel nail sinks. How can both be true?', hr: 'Čelični brod od 50 000 tona pluta, a čelični čavao tone. Kako je moguće oboje?' },
          { en: 'You break a bar of chocolate in half. What happens to its mass, its volume and its density?', hr: 'Čokoladu prelomiš napola. Što se dogodi s njezinom masom, obujmom i gustoćom?' },
          { en: 'The same egg sinks in tap water and floats in very salty water. What changed: the egg or the water?', hr: 'Isto jaje tone u vodi iz slavine, a pluta u jako slanoj vodi. Što se promijenilo: jaje ili voda?' }
        ],
        exit: {
          en: 'A block has a mass of 240 g and a volume of 300 cm³. Will it float in water? Explain without using the words heavy and light.',
          hr: 'Kvadar ima masu 240 g i obujam 300 cm³. Hoće li plutati u vodi? Objasni bez riječi teško i lagano.'
        },
        watch: {
          en: 'Pupils say that heavy things sink and that a bigger piece is denser, because they treat density as another word for weight. Use the tiny paper clip that sinks and the big block that floats as a cognitive conflict, then ask for m / V of several pieces of the same material: the constant ratio lets density replace heaviness as the explanation.',
          hr: 'Učenici tvrde da teška tijela tonu i da je veći komad gušći jer gustoću shvaćaju kao drugu riječ za težinu. Sitnu spajalicu koja tone i velik kvadar koji pluta iskoristite kao kognitivni konflikt, a zatim tražite omjer m / V za nekoliko komada iste tvari: stalan omjer omogućuje da gustoća zamijeni težinu kao objašnjenje.'
        }
      },

      motion: {
        opening: {
          en: 'Two pupils cross the classroom: one at a steady pace, the other slowly at first and then faster, and they arrive together. Ask the class who was faster, and have everyone sketch a distance–time graph for each walker before any discussion. Keep the sketches: many will look like a picture of the path.',
          hr: 'Dvoje učenika prijeđe učionicu: jedan stalnim korakom, drugi isprva sporo, a zatim brže, i stignu istodobno. Pitajte razred tko je bio brži i neka svatko prije rasprave skicira graf put–vrijeme za oba hodača. Sačuvajte skice: mnoge će izgledati kao slika putanje.'
        },
        question: {
          en: 'How can we tell from a distance–time graph how fast a body moves and whether its speed is changing?',
          hr: 'Kako iz grafa put–vrijeme pročitati koliko se brzo tijelo giba i mijenja li mu se brzina?'
        },
        investigate: {
          en: 'In the simulation "Motion Graphs" pupils move the man at a steady pace, then faster, then let him stand still, and note how the slope of the position graph changes; then they try to reproduce a given graph. In "Speed and Distance" they keep the finish line fixed, change only the speed of the cyclist and measure the time. Hands-on: time a toy car over 1 m, 2 m and 3 m with a phone stopwatch, three runs each, and plot distance against time.',
          hr: 'U simulaciji "Grafovi gibanja" učenici pomiču čovjeka stalnim korakom, zatim brže, pa ga ostave da miruje i bilježe kako se mijenja nagib grafa položaja; zatim pokušavaju ponoviti zadani graf. U simulaciji "Brzina i put" drže cilj na istom mjestu, mijenjaju samo brzinu biciklista i mjere vrijeme. Pokus u učionici: štopericom mobitela mjere vrijeme autića na 1 m, 2 m i 3 m, po tri puta, i crtaju graf puta u ovisnosti o vremenu.'
        },
        keyIdea: {
          en: 'Speed is the distance covered per unit of time, v = s / t, and on a distance–time graph it is the steepness of the line. A straight line means uniform motion; a line that gets steeper means the body is speeding up.',
          hr: 'Brzina je put prijeđen u jedinici vremena, v = s / t, a na grafu put–vrijeme pokazuje je strmina crte. Pravac znači jednoliko gibanje, a crta koja postaje sve strmija znači da tijelo ubrzava.'
        },
        talk: [
          { en: 'The graph has a horizontal part. What is the body doing during that time, and how do you know?', hr: 'Graf ima vodoravni dio. Što tijelo radi u tom vremenu i po čemu to znaš?' },
          { en: 'Two lines on the same distance–time graph cross. Does that mean the two bodies have the same speed at that moment?', hr: 'Dvije se crte na istom grafu put–vrijeme sijeku. Znači li to da tijela u tom trenutku imaju jednaku brzinu?' },
          { en: 'A car drives along the motorway at a steady 100 km/h. What is its acceleration?', hr: 'Automobil vozi autocestom stalnom brzinom 100 km/h. Koliko mu je ubrzanje?' }
        ],
        exit: {
          en: 'Sketch the distance–time graph of a pupil who walks slowly, stops for a moment and then runs on. Mark the part where the speed is greatest.',
          hr: 'Skiciraj graf put–vrijeme učenika koji polako hoda, nakratko stane, a zatim potrči dalje. Označi dio u kojem je brzina najveća.'
        },
        watch: {
          en: 'Pupils read a graph as a picture of the route (a rising line is a hill) and judge speed by the height of the line instead of its slope; many also mix up speed and acceleration. Let them walk a graph themselves or reproduce one in the simulation, and keep asking Socratic questions: what does this point say, and what does this steepness say?',
          hr: 'Učenici graf čitaju kao sliku puta (crta koja raste je uzbrdica) i brzinu procjenjuju prema visini crte umjesto prema nagibu; mnogi miješaju i brzinu i ubrzanje. Neka graf sami prikažu hodanjem ili ga ponove u simulaciji, a vi ustrajno postavljajte sokratska pitanja: što govori ova točka, a što ova strmina?'
        }
      },

      forces: {
        opening: {
          en: 'Slide a book across the desk and let it come to rest. Ask: why did it stop, and what would it do on a perfectly smooth, endless table? Pupils write down their own answer and vote; most will say that the force of the push ran out.',
          hr: 'Gurnite knjigu po stolu i pustite da se zaustavi. Pitajte: zašto je stala i što bi radila na savršeno glatkom, beskonačnom stolu? Učenici zapišu svoj odgovor i glasuju; većina će reći da se sila guranja potrošila.'
        },
        question: {
          en: 'What does a force do to the motion of a body: does it keep the body moving, or does it change the motion?',
          hr: 'Što sila čini gibanju tijela: održava li gibanje ili ga mijenja?'
        },
        investigate: {
          en: 'In the simulation "Push the Crate" pupils keep the mass of the crate and the push force the same and change only the floor, from rubber through wood and ice to no friction, recording the friction force, the net force and the acceleration. Then they keep the floor and change only the push. "Galileo\'s Ramp" extends the idea: what happens when the second ramp becomes flat? Hands-on: pull a block with a dynamometer over different surfaces at a steady speed.',
          hr: 'U simulaciji "Guranje sanduka" učenici drže masu sanduka i silu guranja stalnima, a mijenjaju samo podlogu, od gume preko drva i leda do podloge bez trenja, i bilježe silu trenja, rezultantnu silu i ubrzanje. Zatim zadrže podlogu, a mijenjaju samo silu guranja. "Galilejeva kosina" proširuje ideju: što se dogodi kad druga kosina postane vodoravna? Pokus u učionici: dinamometrom jednoliko vuku kvadar po različitim podlogama.'
        },
        keyIdea: {
          en: 'A force describes an interaction between two bodies, and a resultant force changes motion: it speeds a body up, slows it down or turns it. With balanced forces a body stays at rest or keeps moving at a steady speed.',
          hr: 'Sila opisuje međudjelovanje dvaju tijela, a rezultantna sila mijenja gibanje: tijelo ubrzava, usporava ili skreće. Kad su sile uravnotežene, tijelo i dalje miruje ili se i dalje giba stalnom brzinom.'
        },
        talk: [
          { en: 'A book lies on the table. Which bodies act on it, and how can it stay at rest if forces act on it?', hr: 'Knjiga leži na stolu. Koja tijela na nju djeluju i kako može mirovati ako na nju djeluju sile?' },
          { en: 'A space probe far from every planet switches off its engine. Describe its motion from then on.', hr: 'Svemirska sonda daleko od svih planeta ugasi motor. Opiši njezino gibanje od tog trenutka.' },
          { en: 'On the Moon your mass is the same but your weight is six times smaller. What is the difference between mass and weight?', hr: 'Na Mjesecu ti je masa ista, a težina šest puta manja. U čemu je razlika između mase i težine?' }
        ],
        exit: {
          en: 'A sledge is pulled over level snow at a steady speed with a horizontal force of 40 N. How large is the friction force, and how do you know?',
          hr: 'Sanjke vučemo po vodoravnom snijegu stalnom brzinom, vodoravnom silom od 40 N. Kolika je sila trenja i po čemu to znaš?'
        },
        watch: {
          en: 'The most persistent idea is that motion needs a constant force and that a body stops when the force is used up. Do not just correct it: use the series of ever smoother floors as a cognitive conflict and extrapolate with the pupils to no friction at all, then have them draw the forces on the sliding book and name the body that exerts each one.',
          hr: 'Najtvrdokornija je ideja da je za gibanje potrebna stalna sila i da tijelo stane kad se sila potroši. Nemojte je samo ispraviti: niz sve glađih podloga iskoristite kao kognitivni konflikt i s učenicima ekstrapolirajte do podloge bez trenja, a zatim neka nacrtaju sile na knjigu koja klizi i za svaku navedu tijelo koje njome djeluje.'
        }
      },

      gravity: {
        opening: {
          en: 'Hold a heavy book and a single sheet of paper at the same height and ask which will land first; take a vote, then drop them. Now crumple the sheet into a ball and ask again before dropping. The second result contradicts the first explanation, and that contradiction is the opening problem.',
          hr: 'Držite tešku knjigu i list papira na istoj visini i pitajte što će prije pasti; glasujte pa ih pustite. Zatim list zgužvajte u kuglicu i ponovno pitajte prije puštanja. Drugi ishod proturječi prvom objašnjenju i upravo je to proturječje uvodni problem.'
        },
        question: {
          en: 'Does the time of a fall depend on the mass of the body, and what else could it depend on?',
          hr: 'Ovisi li vrijeme padanja o masi tijela i o čemu bi još moglo ovisiti?'
        },
        investigate: {
          en: 'In the simulation "Free Fall" pupils keep the drop height and the planet the same, change only the second object (stone, tennis ball, paper ball, feather) and compare its fall with that of the steel ball, first with air resistance and then without it. Then they keep the object and change only the planet, reading the speed graph. Hands-on: two equal plastic bottles, one empty and one full of water, dropped together from the same height and filmed in slow motion.',
          hr: 'U simulaciji "Slobodni pad" učenici drže visinu i planet stalnima, mijenjaju samo drugo tijelo (kamen, teniska loptica, papirnata kuglica, pero) i njegov pad uspoređuju s padom čelične kuglice, najprije s otporom zraka, a zatim bez njega. Potom zadrže tijelo, a mijenjaju samo planet i čitaju graf brzine. Pokus u učionici: dvije jednake plastične boce, prazna i puna vode, puštene istodobno s iste visine i snimljene usporeno.'
        },
        keyIdea: {
          en: 'Without air resistance all bodies fall with the same acceleration, about 9.81 m/s² on Earth, whatever their mass. Earth pulls a heavier body harder, but that body is also harder to speed up.',
          hr: 'Bez otpora zraka sva tijela padaju jednakim ubrzanjem, na Zemlji oko 9,81 m/s², bez obzira na masu. Teže tijelo Zemlja privlači jače, ali ga je i teže ubrzati.'
        },
        talk: [
          { en: 'On the Moon an astronaut dropped a hammer and a feather together. What happened, and why does it look different on Earth?', hr: 'Astronaut je na Mjesecu istodobno pustio čekić i pero. Što se dogodilo i zašto na Zemlji to izgleda drukčije?' },
          { en: 'Earth attracts an apple and a magnet attracts a nail. Name two differences between these two forces.', hr: 'Zemlja privlači jabuku, a magnet privlači čavao. Navedi dvije razlike između tih dviju sila.' },
          { en: 'A heavier bob is hung on the same string of a pendulum. What happens to the time of one swing?', hr: 'Na istu nit njihala objesimo teži uteg. Što se dogodi s trajanjem jednog titraja?' }
        ],
        exit: {
          en: 'A 1 kg ball and a 5 kg ball of the same size are dropped together from 2 m. Which one lands first? Explain in two sentences.',
          hr: 'Kugla od 1 kg i kugla od 5 kg jednake veličine puštene su istodobno s 2 m. Koja prije padne? Objasni u dvije rečenice.'
        },
        watch: {
          en: 'Everyday experience keeps confirming that heavier bodies fall faster, so one demonstration rarely removes the idea. Separate the two variables with a fair test (same shape, different mass; same mass, different shape) and use the crumpled sheet as a cognitive conflict: its mass did not change, yet its fall did, so mass cannot be the cause.',
          hr: 'Svakodnevno iskustvo stalno potvrđuje da teža tijela padaju brže, pa jedan pokus tu ideju rijetko uklanja. Razdvojite dvije varijable poštenim pokusom (isti oblik, različita masa; ista masa, različit oblik) i iskoristite zgužvani list kao kognitivni konflikt: masa mu se nije promijenila, a pad jest, pa masa ne može biti uzrok.'
        }
      },

      pressure: {
        opening: {
          en: 'Each pair holds a sharpened pencil gently between two index fingers, the point on one finger and the blunt end on the other, and presses lightly. On which finger does the pencil push with the greater force, and which finger hurts more? Pupils write down both answers before the discussion.',
          hr: 'Svaki par lagano drži zašiljenu olovku između dvaju kažiprsta, vrh na jednom, a tupi kraj na drugom prstu, i malo pritisne. Na koji prst olovka djeluje većom silom, a koji prst više boli? Učenici zapišu oba odgovora prije rasprave.'
        },
        question: {
          en: 'Why can the same force have very different effects on the surface it presses on?',
          hr: 'Zašto ista sila može imati vrlo različite učinke na podlogu na koju djeluje?'
        },
        investigate: {
          en: 'In the simulation "Pressure", mode "On a surface", pupils keep the force the same and change only the contact area, recording the pressure and how deep the block sinks into the sand; then they keep the area and change only the force. In the mode "In a liquid" they keep the liquid the same and change only the depth of the sensor, then change the liquid at a fixed depth. Hands-on: a brick on a sponge, lying flat, on its side and on its end.',
          hr: 'U simulaciji "Tlak", u načinu "Na podlogu", učenici drže silu stalnom i mijenjaju samo dodirnu površinu te bilježe tlak i dubinu do koje blok utone u pijesak; zatim zadrže površinu, a mijenjaju samo silu. U načinu "U tekućini" zadrže istu tekućinu i mijenjaju samo dubinu senzora, a potom na stalnoj dubini mijenjaju tekućinu. Pokus u učionici: cigla na spužvi, položena na najveću, srednju i najmanju plohu.'
        },
        keyIdea: {
          en: 'Pressure tells how concentrated a force is: p = F / A. The same force gives a large pressure on a small area and a small pressure on a large area; in a liquid, pressure grows with depth and acts in all directions.',
          hr: 'Tlak govori kako je sila raspodijeljena po površini: p = F / A. Ista sila daje velik tlak na maloj površini, a malen na velikoj; u tekućini tlak raste s dubinom i djeluje u svim smjerovima.'
        },
        talk: [
          { en: 'Why do you sink into deep snow in boots but not on skis, although your weight is the same?', hr: 'Zašto u dubok snijeg propadaš u čizmama, a na skijama ne, iako ti je težina ista?' },
          { en: 'A narrow pipe and a wide lake are both 10 m deep. Where is the pressure at the bottom greater?', hr: 'Uska cijev i široko jezero duboki su po 10 m. Gdje je tlak na dnu veći?' },
          { en: 'When you drink through a straw, what pushes the juice up into your mouth?', hr: 'Kad piješ na slamku, što gura sok prema gore u tvoja usta?' }
        ],
        exit: {
          en: 'The same brick first lies on its largest face and then stands on its smallest. Compare the force on the table and the pressure on the table in the two cases.',
          hr: 'Ista cigla najprije leži na najvećoj plohi, a zatim stoji na najmanjoj. Usporedi silu na stol i tlak na stol u ta dva slučaja.'
        },
        watch: {
          en: 'Pupils use pressure and force as the same quantity, so they expect a bigger pressure only where the force is bigger. The pencil between the fingers is the cognitive conflict: the force on both fingers is equal and the effect is not. Each time, insist on two separate sentences, one about the force and one about the area, before anyone says the word pressure.',
          hr: 'Učenici tlak i silu rabe kao istu veličinu, pa veći tlak očekuju samo ondje gdje je sila veća. Olovka među prstima kognitivni je konflikt: sila je na oba prsta jednaka, a učinak nije. Svaki put tražite dvije odvojene rečenice, jednu o sili i jednu o površini, prije nego što itko izgovori riječ tlak.'
        }
      },

      levers: {
        opening: {
          en: 'Ask the smallest pupil to hold the classroom door shut with one finger next to the handle while the strongest pupil pushes from the other side right beside the hinges. Before they try, everyone predicts who will win and why. The surprise opens the question of what matters besides the size of the force.',
          hr: 'Zamolite najsitnijeg učenika da jednim prstom kraj kvake drži vrata zatvorenima dok ih najjači učenik s druge strane gura tik uz šarke. Prije pokušaja svi predviđaju tko će pobijediti i zašto. Iznenađenje otvara pitanje što je, osim iznosa sile, još važno.'
        },
        question: {
          en: 'When does a small force balance a large one on a lever?',
          hr: 'Kada mala sila na poluzi uravnoteži veliku silu?'
        },
        investigate: {
          en: 'In the simulation "Balancing Act" pupils put a weight on a fixed mark on the left (for example 2 kg at 1 m) and look for the place on the right where a lighter weight balances it. They change only the right-hand weight and its distance from the fulcrum, write force and arm for both sides in a table and look for a pattern. Hands-on: a ruler on a pencil with equal coins in stacks of one, two and three.',
          hr: 'U simulaciji "Ravnoteža na poluzi" učenici postave uteg na stalnu oznaku lijevo od oslonca (primjerice 2 kg na 1 m) i traže mjesto na desnoj strani na kojem ga uravnotežuje lakši uteg. Mijenjaju samo desni uteg i njegovu udaljenost od oslonca, za obje strane u tablicu upisuju silu i krak te traže pravilnost. Pokus u učionici: ravnalo na olovci i jednake kovanice u stupićima od jedne, dviju i triju.'
        },
        keyIdea: {
          en: 'A lever is balanced when force times arm is equal on both sides: F₁ · d₁ = F₂ · d₂. A smaller force is paid for with a longer path, so no machine saves work.',
          hr: 'Poluga je u ravnoteži kad je umnožak sile i kraka jednak na obje strane: F₁ · d₁ = F₂ · d₂. Manju silu plaćamo duljim putem, pa nijedan stroj ne štedi rad.'
        },
        talk: [
          { en: 'Why is a door handle placed far from the hinges and not in the middle of the door?', hr: 'Zašto je kvaka daleko od šarki, a ne na sredini vrata?' },
          { en: 'With a crowbar you lift a rock using a force four times smaller than its weight. What do you pay for that?', hr: 'Pajserom podižeš kamen silom četiri puta manjom od njegove težine. Čime to plaćaš?' },
          { en: 'Where is the fulcrum in a wheelbarrow, and where is it in tweezers?', hr: 'Gdje je oslonac kod tačaka, a gdje kod pincete?' }
        ],
        exit: {
          en: 'A child who weighs 300 N sits 2 m from the fulcrum of a seesaw. Where must an adult who weighs 600 N sit to balance it? Show your reasoning.',
          hr: 'Dijete težine 300 N sjedi 2 m od oslonca klackalice. Kamo mora sjesti odrasla osoba težine 600 N da klackalica bude u ravnoteži? Pokaži postupak.'
        },
        watch: {
          en: 'Pupils believe that a lever saves work, and they judge balance by the weights alone, ignoring the arms, or measure the arm to the end of the bar instead of from the fulcrum. Have them measure the paths of both ends while the load is lifted and compare force times path: the equal products are a cognitive conflict with getting something for nothing.',
          hr: 'Učenici vjeruju da poluga štedi rad, a ravnotežu procjenjuju samo prema utezima, zanemarujući krakove, ili krak mjere do kraja šipke umjesto od oslonca. Neka pri podizanju tereta izmjere putove obaju krajeva i usporede umnoške sile i puta: jednaki umnošci kognitivni su konflikt s idejom da se nešto dobiva ni za što.'
        }
      },

      energy: {
        opening: {
          en: 'Hang a heavy ball from the ceiling on a long string, pull it back until it touches your nose and let go without a push, standing perfectly still. Before the release pupils vote: on its way back, will the ball hit your nose, stop short of it or just reach it? Ask them to give reasons in their own words.',
          hr: 'Tešku kuglu objesite o dugu nit sa stropa, povucite je do svog nosa i pustite bez guranja, stojeći posve mirno. Prije puštanja učenici glasuju: hoće li vas kugla pri povratku udariti u nos, stati prije nosa ili točno doći do njega? Tražite obrazloženje njihovim riječima.'
        },
        question: {
          en: 'Where does the energy of a moving body come from, and where does it go when the body stops?',
          hr: 'Odakle energija tijelu koje se giba i kamo ona odlazi kad se tijelo zaustavi?'
        },
        investigate: {
          en: 'In the simulation "Energy Skate Park" pupils keep the mass and the track the same, change only the height from which the skater starts and read the speed at the bottom and the energy bars, first without friction and then with it. In "Energy Bar Charts" they compare the chart at the start and at a later moment of the same motion. Hands-on: release a marble on a curved track from three heights, three times each, and measure how high it climbs on the other side.',
          hr: 'U simulaciji "Energija na rampi" učenici drže masu i stazu stalnima, mijenjaju samo visinu s koje skejter kreće i očitavaju brzinu na dnu i stupce energije, najprije bez trenja, a zatim s trenjem. U simulaciji "Stupčasti dijagram energije" za isto gibanje uspoređuju dijagram na početku i u kasnijem trenutku. Pokus u učionici: pikulu puštaju niz zakrivljenu stazu s triju visina, po tri puta, i mjere do koje se visine popne na drugoj strani.'
        },
        keyIdea: {
          en: 'Energy is never created or used up; it only changes form or passes from one body to another. With friction, part of it becomes internal energy of the bodies and the air, so the total stays the same although the motion dies away.',
          hr: 'Energija se ne stvara i ne troši; samo mijenja oblik ili prelazi s tijela na tijelo. Uz trenje dio prelazi u unutarnju energiju tijela i zraka, pa ukupna energija ostaje ista iako gibanje zamire.'
        },
        talk: [
          { en: 'A ball dropped on the floor bounces lower each time. Where is the missing energy?', hr: 'Lopta puštena na pod svaki put odskoči niže. Gdje je energija koja nedostaje?' },
          { en: 'You hold a heavy bag still for five minutes and get tired. Did you do work on the bag in the physics sense?', hr: 'Pet minuta mirno držiš tešku torbu i umoriš se. Jesi li u fizikalnom smislu obavio rad nad torbom?' },
          { en: 'A 100 W bulb and a 2000 W heater: which one uses more energy? What else do you need to know?', hr: 'Žarulja od 100 W i grijalica od 2000 W: koja potroši više energije? Što još moraš znati?' }
        ],
        exit: {
          en: 'A skater starts from rest at a height of 3 m on a track with friction. Draw the energy bar chart at the start and at the lowest point, and explain where the difference went.',
          hr: 'Skejter kreće iz mirovanja s visine 3 m na stazi s trenjem. Nacrtaj stupčasti dijagram energije na početku i u najnižoj točki te objasni kamo je otišla razlika.'
        },
        watch: {
          en: 'Pupils say that energy is used up or disappears when a body stops, because everyday language also speaks of spending energy. Have them feel something that has just braked (rubbed palms, the rim of a bicycle wheel) and add a bar for internal energy to the chart: the idea of lost energy is replaced by energy that has changed form and is harder to use.',
          hr: 'Učenici govore da se energija potroši ili nestane kad se tijelo zaustavi jer i svakodnevni govor spominje trošenje energije. Neka opipaju nešto što je upravo kočilo (protrljane dlanove, obruč kotača bicikla) i u dijagram dodaju stupac unutarnje energije: ideju izgubljene energije zamjenjuje energija koja je promijenila oblik i teže ju je iskoristiti.'
        }
      },

      heat: {
        opening: {
          en: 'Pupils touch the metal leg and the wooden top of their desk and decide which is colder. Then ask: both have stood in this room all night, so what would a thermometer show on each of them? Collect the predictions before measuring with a thermometer taped to each surface.',
          hr: 'Učenici dotaknu metalnu nogu i drvenu ploču klupe i odluče što je hladnije. Zatim pitajte: oboje je cijelu noć bilo u ovoj prostoriji, pa što bi termometar pokazao na jednom, a što na drugom? Prikupite predviđanja prije mjerenja termometrom zalijepljenim na svaku površinu.'
        },
        question: {
          en: 'What passes between a warmer and a colder body when they touch, and when does it stop?',
          hr: 'Što prelazi između toplijeg i hladnijeg tijela kad se dodirnu i kada to prestaje?'
        },
        investigate: {
          en: 'In the simulation "Hot Meets Cold" pupils first write down their prediction of the final temperature, then join two blocks of the same material and mass at different temperatures. Next they change only the mass of one block, and finally only its material, recording the starting temperatures, the final temperature and the heat transferred. Hands-on: mix 100 g of cold and 100 g of warm water, then 100 g and 200 g, measuring every temperature.',
          hr: 'U simulaciji "Toplo i hladno" učenici najprije zapišu predviđanje konačne temperature, a zatim spoje dva bloka iste tvari i mase, a različitih temperatura. Potom mijenjaju samo masu jednog bloka, a na kraju samo njegovu tvar, i bilježe početne temperature, konačnu temperaturu i prenesenu toplinu. Pokus u učionici: pomiješaju 100 g hladne i 100 g tople vode, zatim 100 g i 200 g, i svaki put izmjere sve temperature.'
        },
        keyIdea: {
          en: 'Heat is energy that passes by itself from a warmer body to a colder one until their temperatures are equal. Temperature tells how fast the particles move on average; how much it changes depends on the mass and on the substance.',
          hr: 'Toplina je energija koja sama od sebe prelazi s toplijeg tijela na hladnije dok im se temperature ne izjednače. Temperatura govori koliko se brzo čestice u prosjeku gibaju, a koliko će se promijeniti, ovisi o masi i o tvari.'
        },
        talk: [
          { en: 'The metal leg and the wooden top of the desk have the same temperature. Why does the metal feel colder?', hr: 'Metalna noga i drvena ploča klupe imaju jednaku temperaturu. Zašto nam se metal čini hladnijim?' },
          { en: 'You wrap an ice cube in a woollen sweater. Will it melt sooner or later than an unwrapped one?', hr: 'Kocku leda umotaš u vuneni džemper. Hoće li se rastaliti prije ili kasnije od neumotane?' },
          { en: 'A bathtub of warm water or a cup of boiling tea: which has the higher temperature, and which holds more internal energy?', hr: 'Kada tople vode ili šalica kipućeg čaja: što ima višu temperaturu, a što više unutarnje energije?' }
        ],
        exit: {
          en: 'You pour 1 dL of water at 80 °C into 1 dL of water at 20 °C. Estimate the final temperature and say what passed from which water to which.',
          hr: 'U 1 dL vode temperature 20 °C uliješ 1 dL vode temperature 80 °C. Procijeni konačnu temperaturu i napiši što je prešlo s koje vode na koju.'
        },
        watch: {
          en: 'Pupils treat heat and temperature as one thing and speak of cold as a substance that flows in; they also trust their skin as a thermometer. Use the equal thermometer readings on metal and wood as a cognitive conflict, and replace "the cold comes in" with a fixed sentence pattern: energy passes from ... to ... because ... is warmer.',
          hr: 'Učenici toplinu i temperaturu smatraju istim, a o hladnoći govore kao o tvari koja ulazi; uz to vjeruju koži kao termometru. Jednaka očitanja termometra na metalu i drvu iskoristite kao kognitivni konflikt, a rečenicu "ulazi hladnoća" zamijenite stalnim obrascem: energija prelazi s ... na ... jer je ... toplije.'
        }
      },

      electricity: {
        opening: {
          en: 'Give each pair a battery, a bulb and a single wire and ask them to draw every arrangement they think will light the bulb before they try anything. Then let them try. Follow with a vote: in a working circuit, is the current after the bulb smaller than, equal to or greater than the current before it?',
          hr: 'Svaki par dobije bateriju, žaruljicu i jednu žicu te prije pokušaja nacrta svaki spoj za koji misli da će žaruljica zasvijetliti. Zatim neka pokušaju. Slijedi glasovanje: je li u strujnom krugu koji radi struja nakon žaruljice manja, jednaka ili veća od struje prije nje?'
        },
        question: {
          en: 'What does a bulb use up in a circuit: the current, or something that the current carries?',
          hr: 'Što žarulja u strujnom krugu troši: struju ili nešto što struja prenosi?'
        },
        investigate: {
          en: 'In the simulation "Build a Circuit" pupils keep the battery voltage and the bulb type the same, change only the number of bulbs connected in series and record the current, the voltage per bulb and the brightness; then they repeat it with the bulbs in parallel. With real equipment they move the same ammeter to a place before and after the bulb, changing nothing else, and compare the two readings.',
          hr: 'U simulaciji "Strujni krug" učenici drže napon baterije i vrstu žaruljice stalnima, mijenjaju samo broj serijski spojenih žaruljica i bilježe jakost struje, napon na žaruljici i sjaj; zatim isto ponove s paralelno spojenim žaruljicama. S pravim priborom isti ampermetar premještaju ispred i iza žaruljice, ne mijenjajući ništa drugo, i uspoređuju dva očitanja.'
        },
        keyIdea: {
          en: 'Current flows only in a closed loop and is the same before and after a bulb. The bulb does not use up current; it transforms the energy that the current carries from the source, and the voltage tells how strongly the source drives the current.',
          hr: 'Struja teče samo u zatvorenom strujnom krugu i jednaka je prije i poslije žarulje. Žarulja ne troši struju, nego pretvara energiju koju struja prenosi od izvora, a napon govori koliko snažno izvor struju pokreće.'
        },
        talk: [
          { en: 'If the current is the same before and after the bulb, why does the battery run down?', hr: 'Ako je struja jednaka prije i poslije žarulje, zašto se baterija isprazni?' },
          { en: 'You add a second bulb in series. What happens to the brightness of the first one, and why?', hr: 'Serijski dodaš drugu žaruljicu. Što se dogodi sa sjajem prve i zašto?' },
          { en: 'A wall socket has 230 V although nothing is plugged in. Is there a current?', hr: 'Utičnica ima napon 230 V iako ništa nije uključeno. Teče li struja?' }
        ],
        exit: {
          en: 'Two equal bulbs are connected in series to a battery. Compare the current through the first bulb, between the bulbs and through the second bulb, and explain.',
          hr: 'Dvije jednake žaruljice serijski su spojene na bateriju. Usporedi jakost struje kroz prvu žaruljicu, između žaruljica i kroz drugu žaruljicu te objasni.'
        },
        watch: {
          en: 'The belief that current is used up in the bulb survives even correct ammeter readings, because pupils do not separate current from energy. Use an analogy in which something circulates and something is delivered (a closed ring of delivery vans carrying bread, or water turning a mill wheel) and ask what in the circuit corresponds to the vans and what to the bread.',
          hr: 'Uvjerenje da se struja u žarulji troši preživi i točna očitanja ampermetra jer učenici ne razlikuju struju od energije. Poslužite se analogijom u kojoj nešto kruži, a nešto se isporučuje (zatvoreni krug dostavnih kombija koji razvoze kruh ili voda koja okreće mlinsko kolo) i pitajte što u strujnom krugu odgovara kombijima, a što kruhu.'
        }
      },

      magnetism: {
        opening: {
          en: 'Lay out a steel paper clip, an iron nail, a piece of copper wire, aluminium foil, a brass key and a wooden stick. Each pupil sorts them on paper into attracted and not attracted before a magnet comes near anything. Count how many placed all the metals in the first group.',
          hr: 'Na stol stavite čeličnu spajalicu, željezni čavao, komad bakrene žice, aluminijsku foliju, mjedeni ključ i drveni štapić. Svaki ih učenik na papiru razvrsta na one koje magnet privlači i one koje ne privlači, prije nego što se magnet ičemu približi. Prebrojite koliko ih je sve metale stavilo u prvu skupinu.'
        },
        question: {
          en: 'Which materials does a magnet attract, and how does it act on things it does not even touch?',
          hr: 'Koje tvari magnet privlači i kako djeluje na tijela koja i ne dodiruje?'
        },
        investigate: {
          en: 'In the simulation "Magnets and Compasses", mode "What sticks?", pupils test the objects one by one with the same magnet and compare the result with their sorting. Then they move a compass needle around a single bar magnet, sketch its direction at ten places and compare the sketch with the field lines. Finally they add a second magnet and change only which poles face each other. Hands-on: the same with a magnet, a compass and iron filings on paper.',
          hr: 'U simulaciji "Magneti i kompasi", u načinu "Što privlači magnet?", učenici istim magnetom ispituju predmete jedan po jedan i ishod uspoređuju sa svojim razvrstavanjem. Zatim iglu kompasa pomiču oko jednoga štapićastog magneta, skiciraju njezin smjer na deset mjesta i skicu uspoređuju sa silnicama polja. Na kraju dodaju drugi magnet i mijenjaju samo to koji su polovi okrenuti jedan prema drugome. Pokus u učionici: isto s magnetom, kompasom i željeznom strugotinom na papiru.'
        },
        keyIdea: {
          en: 'A magnet attracts only a few materials, such as iron, nickel and cobalt, not all metals. Around every magnet there is a magnetic field that acts at a distance; poles always come in pairs, like poles repel and unlike poles attract.',
          hr: 'Magnet privlači samo neke tvari, poput željeza, nikla i kobalta, a ne sve metale. Oko svakog magneta postoji magnetsko polje koje djeluje na daljinu; polovi uvijek dolaze u paru, istoimeni se odbijaju, a raznoimeni privlače.'
        },
        talk: [
          { en: 'You break a bar magnet in half. What do you get, and how could you check it?', hr: 'Štapićasti magnet prelomiš napola. Što dobiješ i kako bi to provjerio?' },
          { en: 'A compass needle turns although nothing touches it. What is acting on it?', hr: 'Igla kompasa zakrene se iako je ništa ne dodiruje. Što na nju djeluje?' },
          { en: 'An electromagnet lifts five paper clips. Name two changes that would make it lift more.', hr: 'Elektromagnet podigne pet spajalica. Navedi dvije promjene uz koje bi ih podigao više.' }
        ],
        exit: {
          en: 'A 5-cent coin looks like copper, yet a magnet picks it up. What can you conclude about what is inside the coin?',
          hr: 'Kovanica od 5 centi izgleda kao da je od bakra, a magnet je ipak podigne. Što možeš zaključiti o tome što je u kovanici?'
        },
        watch: {
          en: 'Pupils expect a magnet to attract all metals, and they often explain magnetism with electric charge, calling the poles plus and minus. Let the copper wire and the aluminium foil produce the cognitive conflict, then ask Socratic questions: if the poles were charges, why does a magnet ignore the scraps of paper that a rubbed balloon picks up? Keep the two sets of terms apart from the first lesson.',
          hr: 'Učenici očekuju da magnet privlači sve metale, a magnetizam često objašnjavaju električnim nabojem i polove zovu plus i minus. Neka bakrena žica i aluminijska folija izazovu kognitivni konflikt, a zatim postavljajte sokratska pitanja: da su polovi naboji, zašto magnet ne djeluje na papiriće koje natrljani balon podiže? Dva skupa pojmova razdvajajte od prvog sata.'
        }
      },

      waves: {
        opening: {
          en: 'Float a cork in a shallow tray of water and ask how to bring it to the far edge using only waves made at the near edge. Pupils predict what the cork will do, then try it. Alternatively, send a pulse along a long spring or rope with a ribbon tied to it.',
          hr: 'U plitku posudu s vodom stavite čep i pitajte kako ga dovesti do suprotnog ruba samo valovima koje stvaramo na bližem rubu. Učenici predviđaju što će čep učiniti, a zatim pokušaju. Druga mogućnost: pošaljite puls po dugoj opruzi ili užetu na kojem je zavezana vrpca.'
        },
        question: {
          en: 'What travels along a rope or across water when a wave passes, if the rope and the water stay where they are?',
          hr: 'Što putuje užetom ili vodom kad prolazi val ako uže i voda ostaju na svome mjestu?'
        },
        investigate: {
          en: 'In the simulation "Wave on a String" pupils send a single pulse and follow one point of the rope: where does the point move, and where does the pulse go? Then they keep the tension the same, change only the frequency and record the wavelength and the wave speed; after that they keep the frequency and change only the tension. Hands-on: a long spring on the floor with a ribbon on one coil, timing a pulse over a measured distance three times.',
          hr: 'U simulaciji "Val na užetu" učenici pošalju jedan puls i prate jednu točku užeta: kamo se giba ta točka, a kamo puls? Zatim drže napetost stalnom, mijenjaju samo frekvenciju i bilježe valnu duljinu i brzinu vala; nakon toga zadrže frekvenciju, a mijenjaju samo napetost. Pokus u učionici: duga opruga na podu s vrpcom na jednom zavoju, a vrijeme pulsa na izmjerenoj udaljenosti mjeri se tri puta.'
        },
        keyIdea: {
          en: 'A wave carries energy from place to place, while the particles of the medium only oscillate around their own positions. The speed of the wave is set by the medium, and v = λ · f links it to the wavelength and the frequency.',
          hr: 'Val prenosi energiju s mjesta na mjesto, a čestice sredstva samo titraju oko svojih položaja. Brzinu vala određuje sredstvo, a izraz v = λ · f povezuje je s valnom duljinom i frekvencijom.'
        },
        talk: [
          { en: 'You shake the rope twice as often with the same tension. Does the wave reach the wall sooner?', hr: 'Uže treseš dvostruko češće uz istu napetost. Hoće li val prije stići do zida?' },
          { en: 'Why can astronauts outside the space station not hear each other without a radio?', hr: 'Zašto se astronauti izvan svemirske postaje ne mogu čuti bez radija?' },
          { en: 'A big drum and a small whistle: which is louder, which is higher, and what in the vibration decides each?', hr: 'Veliki bubanj i mala zviždaljka: što je glasnije, što je više i o čemu u titranju ovisi jedno, a o čemu drugo?' }
        ],
        exit: {
          en: 'A leaf floats on a pond while waves pass under it. Describe the motion of the leaf and say what the wave carried to the shore.',
          hr: 'List pluta na ribnjaku dok ispod njega prolaze valovi. Opiši gibanje lista i napiši što je val prenio do obale.'
        },
        watch: {
          en: 'Pupils picture a wave as matter travelling along, and they believe that a faster hand makes a faster wave because they mix up the speed of the wave with the speed of the oscillating particles. The ribbon that returns to its place is the cognitive conflict; then use Socratic questions to keep three things apart: how fast the hand moves, how often, and how fast the pulse travels.',
          hr: 'Učenici val zamišljaju kao tvar koja putuje, a vjeruju i da brža ruka daje brži val jer miješaju brzinu vala s brzinom čestica koje titraju. Vrpca koja se vraća na svoje mjesto kognitivni je konflikt; zatim sokratskim pitanjima razdvajajte tri stvari: koliko se brzo giba ruka, koliko često i koliko brzo putuje puls.'
        }
      },

      light: {
        opening: {
          en: 'Darken the room completely for a few seconds and ask what the pupils can see, and whether they would see more if they waited longer. Then switch on a small torch pointed at the ceiling. On a sketch with a lamp, a book and an eye, everyone draws arrows to show how the eye sees the book.',
          hr: 'Nakratko potpuno zamračite učionicu i pitajte što učenici vide i bi li vidjeli više da čekaju dulje. Zatim upalite malu svjetiljku usmjerenu u strop. Svatko na skici s lampom, knjigom i okom strelicama prikaže kako oko vidi knjigu.'
        },
        question: {
          en: 'How does light travel, and what has to happen for us to see an object that does not shine by itself?',
          hr: 'Kako se svjetlost širi i što se mora dogoditi da vidimo predmet koji sam ne svijetli?'
        },
        investigate: {
          en: 'In the simulation "Light Rays", mode "Mirror", pupils change only the angle of incidence (for example 20°, 40°, 60°) and record the angle of reflection in a table; with the candle and its image shown, they compare the distances of the object and of the image from the mirror. In the mode "Shadows" they keep the object and the wall where they are and change only the distance of the lamp, recording the height of the shadow. Hands-on: a torch, a comb and a mirror on paper.',
          hr: 'U simulaciji "Zrake svjetlosti", u načinu "Zrcalo", učenici mijenjaju samo upadni kut (primjerice 20°, 40°, 60°) i u tablicu upisuju kut odbijanja; uz prikazanu svijeću i njezinu sliku uspoređuju udaljenost predmeta i udaljenost slike od zrcala. U načinu "Sjene" predmet i zid ostaju na mjestu, mijenja se samo udaljenost lampe, a bilježi se visina sjene. Pokus u učionici: svjetiljka, češalj i zrcalo na papiru.'
        },
        keyIdea: {
          en: 'Light travels in straight lines from a source. We see an object when light from it enters our eye, either its own light or light it reflects; at a mirror the angle of reflection equals the angle of incidence.',
          hr: 'Svjetlost se od izvora širi pravocrtno. Predmet vidimo kad svjetlost s njega uđe u naše oko, bilo vlastita, bilo odbijena; pri odbijanju od zrcala kut odbijanja jednak je upadnom kutu.'
        },
        talk: [
          { en: 'Can you see the beam of a torch from the side in clean air? What does that tell us about seeing?', hr: 'Vidiš li sa strane snop svjetiljke u čistom zraku? Što nam to govori o gledanju?' },
          { en: 'Where is your image in a plane mirror: on the glass, or behind it? How could you check?', hr: 'Gdje je tvoja slika u ravnom zrcalu: na staklu ili iza njega? Kako bi to provjerio?' },
          { en: 'A red apple is lit only with blue light. What colour does it appear, and why?', hr: 'Crvenu jabuku obasjamo samo plavom svjetlošću. Kakve nam se boje čini i zašto?' }
        ],
        exit: {
          en: 'Draw the path of the light that lets you read a book by a desk lamp, with arrows showing its direction.',
          hr: 'Nacrtaj put svjetlosti zahvaljujući kojoj čitaš knjigu uz stolnu lampu i strelicama označi njezin smjer.'
        },
        watch: {
          en: 'Many pupils draw arrows from the eye to the object, or only from the lamp to the object, and they place the mirror image on the surface of the glass. Use the dark room as a cognitive conflict (if eyes sent out light, we would see in the dark) and insist that every ray diagram ends with an arrow entering an eye.',
          hr: 'Mnogi učenici crtaju strelice od oka prema predmetu ili samo od lampe do predmeta, a sliku u zrcalu smještaju na površinu stakla. Zamračenu učionicu iskoristite kao kognitivni konflikt (da oči šalju svjetlost, vidjeli bismo i u mraku) i tražite da svaki crtež zraka završi strelicom koja ulazi u oko.'
        }
      },

      space: {
        opening: {
          en: 'Ask pupils to explain, with a drawing and two sentences, why the Moon sometimes looks like a thin crescent and, separately, why it is warmer in summer than in winter. Sort the answers on the board without judging them. Most will mention the shadow of the Earth and the distance from the Sun.',
          hr: 'Zamolite učenike da crtežom i dvjema rečenicama objasne zašto Mjesec katkad izgleda kao tanak srp te, zasebno, zašto je ljeti toplije nego zimi. Odgovore razvrstajte na ploči bez ocjenjivanja. Većina će spomenuti Zemljinu sjenu i udaljenost od Sunca.'
        },
        question: {
          en: 'Why does the shape of the lit part of the Moon that we see change during a month?',
          hr: 'Zašto se tijekom mjeseca mijenja oblik osvijetljenog dijela Mjeseca koji vidimo?'
        },
        investigate: {
          en: 'Hands-on model in a darkened room: a lamp is the Sun, the head of the pupil is the Earth and a ball on a stick is the Moon. The lamp and the ball stay the same; pupils change only the position of the ball around their head in eight steps and draw the lit part they see each time. Then they check the order in the simulation "Earth, Moon and Sun", mode "Moon phases", and note where the Moon is at full Moon and at new Moon.',
          hr: 'Model u zamračenoj učionici: lampa je Sunce, učenikova glava Zemlja, a lopta na štapiću Mjesec. Lampa i lopta ostaju iste; učenici mijenjaju samo položaj lopte oko svoje glave u osam koraka i svaki put nacrtaju osvijetljeni dio koji vide. Zatim redoslijed provjere u simulaciji "Zemlja, Mjesec i Sunce", u načinu "Mjesečeve mijene", i zabilježe gdje je Mjesec za punog Mjeseca, a gdje za mlađaka.'
        },
        keyIdea: {
          en: 'The Sun always lights one half of the Moon. The phases arise because, as the Moon circles the Earth, we see a different part of that lit half; the shadow of the Earth matters only during a lunar eclipse.',
          hr: 'Sunce uvijek osvjetljava jednu polovicu Mjeseca. Mijene nastaju zato što, dok Mjesec kruži oko Zemlje, vidimo različit dio te osvijetljene polovice; Zemljina sjena važna je samo za pomrčine Mjeseca.'
        },
        talk: [
          { en: 'Where are the Sun, the Earth and the Moon at full Moon? Why is there not a lunar eclipse every month?', hr: 'Gdje su Sunce, Zemlja i Mjesec za punog Mjeseca? Zašto pomrčina Mjeseca nije svaki mjesec?' },
          { en: 'Earth is closest to the Sun in early January. What does that say about the cause of the seasons?', hr: 'Zemlja je Suncu najbliža početkom siječnja. Što to govori o uzroku godišnjih doba?' },
          { en: 'Astronauts float in the space station 400 km above the ground. Does gravity act there?', hr: 'Astronauti lebde u svemirskoj postaji 400 km iznad tla. Djeluje li ondje gravitacija?' }
        ],
        exit: {
          en: 'Draw the Sun, the Earth and the Moon at first quarter, shade the dark half of the Moon and mark the part we see from the Earth.',
          hr: 'Nacrtaj Sunce, Zemlju i Mjesec za prve četvrti, osjenčaj tamnu polovicu Mjeseca i označi dio koji vidimo sa Zemlje.'
        },
        watch: {
          en: 'The shadow of the Earth as the cause of the phases and distance as the cause of the seasons are among the most stable ideas in school science; a correct explanation from the teacher rarely changes them. Let pupils hold the model themselves: when the ball looks like a crescent, ask where the shadow of their head falls. For the seasons, the January fact is the cognitive conflict.',
          hr: 'Zemljina sjena kao uzrok mijena i udaljenost kao uzrok godišnjih doba među najpostojanijim su idejama u nastavi prirodoslovlja; točno učiteljevo objašnjenje rijetko ih mijenja. Neka učenici sami drže model: kad lopta izgleda kao srp, pitajte kamo pada sjena njihove glave. Za godišnja doba kognitivni je konflikt podatak o siječnju.'
        }
      },

      science: {
        opening: {
          en: 'Show a pendulum and ask what could change the time of one swing. Write every suggestion on the board: mass, length, how far it is pulled back, even colour. Then a volunteer tests mass by hanging a heavier bob on a shorter string; ask the class whether that has convinced them.',
          hr: 'Pokažite njihalo i pitajte što bi moglo promijeniti trajanje jednog titraja. Sve prijedloge zapišite na ploču: masa, duljina, otklon, čak i boja. Zatim dobrovoljac ispituje masu tako da teži uteg objesi o kraću nit; pitajte razred je li ih to uvjerilo.'
        },
        question: {
          en: 'How must we plan an experiment so that its result really answers our question?',
          hr: 'Kako moramo isplanirati pokus da njegov rezultat doista odgovori na naše pitanje?'
        },
        investigate: {
          en: 'In the simulation "Design a Fair Test" pupils choose the pendulum, state a hypothesis, pick the one variable they will change, say what they measure and what they keep the same, write the prediction and only then run the trials. With a real pendulum they do the same: for three masses on the same string and with the same starting angle they time 10 swings three times, take the mean and compare the differences with the measurement uncertainty.',
          hr: 'U simulaciji "Osmisli pošten pokus" učenici odaberu njihalo, postave hipotezu, izaberu jednu varijablu koju će mijenjati, navedu što mjere i što drže stalnim, zapišu predviđanje i tek tada izvode mjerenja. Isto rade i s pravim njihalom: za tri mase na istoj niti i uz isti početni otklon triput mjere trajanje 10 titraja, računaju srednju vrijednost i razlike uspoređuju s mjernom nesigurnošću.'
        },
        keyIdea: {
          en: 'In a fair test we change one variable, measure another and keep all the others the same. A prediction derived from the hypothesis is compared with the measurement: disagreement rejects the hypothesis, agreement supports it but never proves it for good.',
          hr: 'U poštenom pokusu jednu varijablu mijenjamo, drugu mjerimo, a sve ostale držimo stalnima. Predviđanje izvedeno iz hipoteze uspoređujemo s mjerenjem: neslaganje hipotezu odbacuje, a slaganje je podupire, ali je nikad konačno ne dokazuje.'
        },
        talk: [
          { en: 'Three timings of the same 10 swings give 20.1 s, 19.8 s and 20.2 s. Which one is right?', hr: 'Tri mjerenja istih 10 titraja daju 20,1 s, 19,8 s i 20,2 s. Koje je točno?' },
          { en: 'With a heavier bob you measured 20.0 s instead of 20.1 s. Does the period depend on the mass?', hr: 'S težim utegom izmjerio si 20,0 s umjesto 20,1 s. Ovisi li period o masi?' },
          { en: 'Your result contradicts your hypothesis. Was the experiment a failure?', hr: 'Rezultat proturječi tvojoj hipotezi. Je li pokus propao?' }
        ],
        exit: {
          en: 'You want to find out whether the height of a bounce depends on the kind of ball. Write what you change, what you measure and two things you keep the same.',
          hr: 'Želiš saznati ovisi li visina odskoka o vrsti lopte. Napiši što mijenjaš, što mjeriš i dvije stvari koje držiš stalnima.'
        },
        watch: {
          en: 'Pupils change several variables at once, take a single measurement as the truth and see the purpose of an experiment in proving that they were right. Let a test without control of variables fail in front of them, then give their reasoning a fixed frame: if ... and ... then ... but ... therefore. Praise a rejected hypothesis as a result, not as a mistake.',
          hr: 'Učenici mijenjaju više varijabli odjednom, jedno mjerenje smatraju istinom, a svrhu pokusa vide u dokazivanju da su bili u pravu. Neka pokus bez kontrole varijabli pred njima zakaže, a zatim njihovu zaključivanju dajte stalan okvir: ako ... i ... onda ... ali ... dakle. Odbačenu hipotezu pohvalite kao rezultat, a ne kao pogrešku.'
        }
      },

      homelab: {
        opening: {
          en: 'Ask who has a physics laboratory at home; hardly a hand will go up. Then ask what they carry in their pocket: a phone with a stopwatch, a camera, a microphone and motion sensors. The challenge: how could we measure, with a phone alone, how long a coin takes to fall from the desk? Collect ideas in pairs.',
          hr: 'Pitajte tko kod kuće ima fizikalni laboratorij; ruku neće podići gotovo nitko. Zatim pitajte što nose u džepu: mobitel sa štopericom, kamerom, mikrofonom i senzorima gibanja. Izazov: kako samo mobitelom izmjeriti koliko dugo kovanica pada sa stola? Ideje prikupite u parovima.'
        },
        question: {
          en: 'How can we carry out an experiment at home so that someone else can trust our result and repeat it?',
          hr: 'Kako pokus izvesti kod kuće tako da našem rezultatu netko drugi može vjerovati i ponoviti ga?'
        },
        investigate: {
          en: 'Each pupil chooses a test from the Home experiments library, for example a pendulum made of string and a key. The length of the string is changed (five values), the time of 10 swings is measured with the phone stopwatch three times for each length, and the bob and the starting angle are kept the same. A prediction is written down first; the readings go into a table, the means into a graph, and the report states the measurement uncertainty and one thing that went wrong.',
          hr: 'Svaki učenik iz zbirke Pokusi kod kuće odabere jedan pokus, primjerice njihalo od konca i ključa. Mijenja se duljina niti (pet vrijednosti), za svaku se duljinu tri puta štopericom mobitela mjeri trajanje 10 titraja, a uteg i početni otklon ostaju isti. Najprije se zapiše predviđanje; mjerenja se upisuju u tablicu, srednje vrijednosti u graf, a u izvješću se navode mjerna nesigurnost i jedna stvar koja nije uspjela.'
        },
        keyIdea: {
          en: 'A home experiment is real physics when it is safe, starts with a prediction, repeats every measurement, records everything in a table and reports honestly what was measured, including what did not work.',
          hr: 'Kućni pokus prava je fizika kad je siguran, kad počinje predviđanjem, kad se svako mjerenje ponavlja, kad se sve bilježi u tablicu i kad se pošteno izvijesti što je izmjereno, uključujući i ono što nije uspjelo.'
        },
        talk: [
          { en: 'Your three timings differ by a few tenths of a second. What does that tell you about your result, and how will you write it down?', hr: 'Tvoja se tri mjerenja razlikuju za nekoliko desetinki sekunde. Što ti to govori o rezultatu i kako ćeš ga zapisati?' },
          { en: 'Why is it better to time 10 swings and divide by 10 than to time a single swing?', hr: 'Zašto je bolje izmjeriti trajanje 10 titraja i podijeliti s 10 nego mjeriti jedan titraj?' },
          { en: 'A classmate got a different value in the same experiment. How would the two of you find out why?', hr: 'Prijatelj iz razreda u istom je pokusu dobio drukčiju vrijednost. Kako biste vas dvoje otkrili zašto?' }
        ],
        exit: {
          en: 'Name one thing that you kept the same in your home experiment and explain what could have happened to the result if you had not.',
          hr: 'Navedi jednu stvar koju si u kućnom pokusu držao stalnom i objasni što se moglo dogoditi s rezultatom da nisi.'
        },
        watch: {
          en: 'At home pupils tend to measure once, tidy up numbers that look wrong and write the report from memory, because they believe the aim is to get the value from the textbook. Assess the method, not the closeness to the expected number: ask for the original table, the spread of the readings and a photo of the set-up, and discuss an honest odd result in class.',
          hr: 'Kod kuće učenici često mjere samo jednom, dotjeruju brojeve koji izgledaju pogrešno i izvješće pišu po sjećanju jer vjeruju da je cilj dobiti vrijednost iz udžbenika. Vrednujte postupak, a ne blizinu očekivanom broju: tražite izvornu tablicu, raspon mjerenja i fotografiju postava pokusa, a pošten neobičan rezultat raspravite u razredu.'
        }
      }
    },

    /* ---------- 3. Research-based teaching methods ---------- */
    methods: [
      { id: 'peer-instruction',
        name:   { en: 'Peer Instruction', hr: 'Konceptualna pitanja s karticama (Peer Instruction)' },
        origin: { en: 'Eric Mazur, Harvard University', hr: 'Eric Mazur, Sveučilište Harvard' },
        idea:   {
          en: 'Short conceptual questions turn a lecture into a discussion: pupils commit to an answer on their own and then try to convince a neighbour, so that understanding grows through explaining.',
          hr: 'Kratka konceptualna pitanja pretvaraju izlaganje u raspravu: učenici se sami odluče za odgovor, a zatim pokušavaju uvjeriti susjeda, pa razumijevanje raste kroz objašnjavanje.'
        },
        steps:  {
          en: [
            'Pose a conceptual question with three or four answers, one of which is a common preconception.',
            'Everyone thinks in silence for a minute and votes with cards or fingers.',
            'If between a third and two thirds are right, pupils try to convince a neighbour who chose a different answer.',
            'Vote again and notice how the distribution of answers has changed.',
            'Have pupils explain the right answer and also why the tempting wrong one fails.'
          ],
          hr: [
            'Postavite konceptualno pitanje s tri ili četiri ponuđena odgovora, od kojih je jedan česta pretkoncepcija.',
            'Svatko minutu razmišlja u tišini i glasuje karticama ili prstima.',
            'Ako je točno odgovorilo između trećine i dvije trećine razreda, učenici uvjeravaju susjeda koji je odabrao drukčiji odgovor.',
            'Glasujte ponovno i uočite kako se raspodjela odgovora promijenila.',
            'Neka učenici objasne točan odgovor, ali i zašto privlačan pogrešan odgovor ne vrijedi.'
          ]
        },
        inApp:  {
          en: 'The Brain teasers page offers ready-made concept questions for every topic, each with the misconception behind the tempting answer named. Project a question and let the class vote.',
          hr: 'Stranica Mozgalice nudi gotova konceptualna pitanja za svaku temu, a uz svako je imenovana zabluda koja stoji iza privlačnog pogrešnog odgovora. Projicirajte pitanje i neka razred glasuje.'
        } },

      { id: 'predict-observe-explain',
        name:   { en: 'Predict, observe, explain', hr: 'Predviđanje, opažanje, objašnjenje' },
        origin: { en: 'Interactive Lecture Demonstrations, David Sokoloff and Ronald Thornton', hr: 'Interaktivni demonstracijski pokusi (Interactive Lecture Demonstrations), David Sokoloff i Ronald Thornton' },
        idea:   {
          en: 'Pupils learn from a demonstration only when they have committed to a prediction first, so that the observation can confirm or contradict their own idea.',
          hr: 'Učenici iz demonstracijskog pokusa uče tek kad su se prije toga odlučili za predviđanje, pa opažanje može potvrditi ili osporiti njihovu vlastitu ideju.'
        },
        steps:  {
          en: [
            'Describe the experiment and, if needed, show it without the measurement.',
            'Each pupil writes down an individual prediction.',
            'Pupils discuss in small groups and record their final prediction.',
            'Carry out the experiment so that everyone can observe the result.',
            'A few pupils describe the result, and the class explains it and compares it with the predictions.',
            'Extend the idea to an analogous situation that looks different on the surface.'
          ],
          hr: [
            'Opišite pokus i, ako treba, izvedite ga bez mjerenja.',
            'Svaki učenik zapiše vlastito predviđanje.',
            'Učenici raspravljaju u malim skupinama i zapišu konačno predviđanje.',
            'Izvedite pokus tako da svi mogu opažati ishod.',
            'Nekoliko učenika opiše ishod, a razred ga objašnjava i uspoređuje s predviđanjima.',
            'Proširite ideju na analognu situaciju koja naizgled izgleda drukčije.'
          ]
        },
        inApp:  {
          en: 'Every simulation opens with a "Predict first" card: pupils choose an answer, check it in the simulation by following the suggested steps and then read the explanation. The home experiments follow the same order.',
          hr: 'Svaka simulacija počinje karticom "Prvo predvidi": učenici odaberu odgovor, provjere ga u simulaciji prema predloženim koracima i zatim pročitaju objašnjenje. Isti redoslijed imaju i pokusi kod kuće.'
        } },

      { id: 'isle-cycle',
        name:   { en: 'The ISLE cycle', hr: 'Ciklus ISLE' },
        origin: { en: 'Investigative Science Learning Environment, Eugenia Etkina, Rutgers University', hr: 'Investigative Science Learning Environment (ISLE), Eugenia Etkina, Sveučilište Rutgers' },
        idea:   {
          en: 'Pupils build physics ideas the way physicists do: they observe a phenomenon, invent explanations, test them with experiments whose outcome they predict, and then apply what has survived.',
          hr: 'Učenici izgrađuju fizikalne ideje onako kako to čine fizičari: opažaju pojavu, smišljaju objašnjenja, provjeravaju ih pokusima čiji ishod predviđaju i zatim primjenjuju ono što je izdržalo provjeru.'
        },
        steps:  {
          en: [
            'Observational experiment: pupils watch a simple phenomenon and describe it without explaining.',
            'They look for patterns and propose several explanations or hypotheses.',
            'Testing experiment: for each hypothesis they predict the outcome of a new experiment before doing it.',
            'They compare the outcome with the prediction and reject or keep the hypothesis.',
            'Application experiment: they use the tested idea to solve a practical problem or to measure a quantity.'
          ],
          hr: [
            'Opažački pokus: učenici promatraju jednostavnu pojavu i opisuju je bez objašnjavanja.',
            'Traže pravilnosti i predlažu više objašnjenja ili hipoteza.',
            'Ispitni pokus: za svaku hipotezu predviđaju ishod novog pokusa prije nego što ga izvedu.',
            'Ishod uspoređuju s predviđanjem te hipotezu odbacuju ili zadržavaju.',
            'Primjenski pokus: provjerenu ideju primjenjuju na praktičan problem ili na mjerenje neke veličine.'
          ]
        },
        inApp:  {
          en: 'The Home experiments library labels every experiment as observe, test, apply or project, so a whole cycle for a topic can be assembled from experiments of the first three kinds.',
          hr: 'U zbirci Pokusi kod kuće svaki je pokus označen kao opažanje, provjera, primjena ili projekt, pa se cijeli ciklus za neku temu može složiti od pokusa prvih triju vrsta.'
        } },

      { id: 'inquiry-lesson',
        name:   { en: 'The three-part inquiry lesson', hr: 'Trodijelni sat istraživački usmjerene nastave' },
        origin: {
          en: 'Interactive inquiry-based teaching as taught in physics-teaching-methods courses, for example at the Faculty of Science, University of Zagreb',
          hr: 'Interaktivna istraživački usmjerena nastava kakva se poučava na kolegijima metodike nastave fizike, primjerice na Prirodoslovno-matematičkom fakultetu Sveučilišta u Zagrebu'
        },
        idea:   {
          en: 'The lesson is organised around one question that pupils answer themselves: it opens with a problem that brings out their ideas, continues with a guided investigation and ends with applying the new model.',
          hr: 'Sat je organiziran oko jednog pitanja na koje učenici sami odgovaraju: počinje problemom koji otkriva njihove ideje, nastavlja se vođenim istraživanjem i završava primjenom novog modela.'
        },
        steps:  {
          en: [
            'Opening problem: a short demonstration or question that raises interest and brings out what pupils think.',
            'Formulate the research question of the lesson together with the class.',
            'Guided investigation: pupils predict, experiment or work in a simulation, and discuss what the results mean.',
            'Building the model: name the new idea and express it in words, a sketch, a graph and, last of all, an equation.',
            'Application: conceptual questions and problems in new situations show whether the idea has taken hold.'
          ],
          hr: [
            'Uvodni problem: kratak pokus ili pitanje koje pobuđuje interes i otkriva što učenici misle.',
            'Zajedno s razredom oblikujte istraživačko pitanje sata.',
            'Vođeno istraživanje: učenici predviđaju, izvode pokus ili rade u simulaciji te raspravljaju o značenju rezultata.',
            'Izgradnja modela: novu ideju imenujte i izrazite riječima, skicom, grafom i tek na kraju jednadžbom.',
            'Primjena: konceptualna pitanja i zadaci u novim situacijama pokazuju je li ideja usvojena.'
          ]
        },
        inApp:  {
          en: 'The lesson outlines in the teacher corner follow these three parts for every topic. The Concept check, the same test before and after teaching, shows the normalised gain of the class.',
          hr: 'Skice sati u dijelu Za učitelje za svaku temu slijede ta tri dijela. Provjera razumijevanja, isti test prije i poslije poučavanja, pokazuje normalizirani dobitak razreda.'
        } },

      { id: 'fair-test',
        name:   { en: 'The fair test and if–then reasoning', hr: 'Pošten pokus i zaključivanje ako–onda' },
        origin: {
          en: 'Control of variables and hypothetico-deductive reasoning in science education research',
          hr: 'Kontrola varijabli i hipotetičko-deduktivno zaključivanje u istraživanjima prirodoslovnog obrazovanja'
        },
        idea:   {
          en: 'Pupils learn to change one variable at a time and to reason from a hypothesis to a prediction that an experiment can contradict.',
          hr: 'Učenici uče mijenjati samo jednu varijablu i od hipoteze zaključivanjem doći do predviđanja koje pokus može opovrgnuti.'
        },
        steps:  {
          en: [
            'Ask the three questions: what do I change, what do I measure, what do I keep the same?',
            'IF the hypothesis is true AND I carry out this test, THEN I should observe this result.',
            'Carry out the test and repeat every measurement at least three times.',
            'BUT the result is different, THEREFORE the hypothesis is rejected; or AND the result agrees, THEREFORE the hypothesis is supported.',
            'Before concluding, judge whether the difference is larger than the measurement uncertainty.'
          ],
          hr: [
            'Postavite tri pitanja: što mijenjam, što mjerim, što držim stalnim?',
            'AKO je hipoteza točna I izvedem ovaj pokus, ONDA bih trebao opaziti ovaj ishod.',
            'Izvedite pokus i svako mjerenje ponovite najmanje tri puta.',
            'ALI ishod je drukčiji, DAKLE hipotezu odbacujemo; ili: I ishod se slaže, DAKLE hipoteza je poduprta.',
            'Prije zaključka procijenite je li razlika veća od mjerne nesigurnosti.'
          ]
        },
        inApp:  {
          en: 'The simulation "Design a Fair Test" leads pupils through hypothesis, choice of variables, prediction, trials and conclusion; "Measure It!" practises repeated measurement, the mean and the uncertainty.',
          hr: 'Simulacija "Osmisli pošten pokus" vodi učenike kroz hipotezu, izbor varijabli, predviđanje, mjerenja i zaključak, a u simulaciji "Izmjeri!" vježbaju ponavljanje mjerenja, srednju vrijednost i mjernu nesigurnost.'
        } },

      { id: 'elicit-confront-resolve',
        name:   { en: 'Elicit, confront, resolve', hr: 'Izazovi, suoči, razriješi' },
        origin: {
          en: 'Tutorials in Introductory Physics, Lillian McDermott and the Physics Education Group, University of Washington',
          hr: 'Tutorials in Introductory Physics, Lillian McDermott i Physics Education Group, Sveučilište Washington u Seattleu'
        },
        idea:   {
          en: 'A known difficulty is deliberately brought to the surface, pupils meet evidence that contradicts it, and guided questions help them resolve the contradiction themselves.',
          hr: 'Poznatu poteškoću namjerno izvodimo na vidjelo, učenici se susreću s dokazom koji joj proturječi, a vođena pitanja pomažu im da proturječje sami razriješe.'
        },
        steps:  {
          en: [
            'Elicit: ask a question to which the preconception gives a clear but wrong answer, and have pupils write it down.',
            'Confront: let an experiment, a simulation or a check of consistency contradict that answer (cognitive conflict).',
            'Resolve: guide small groups with a sequence of questions until they reconcile the result with a better model.',
            'Check the new idea with a question that looks different but needs the same reasoning.'
          ],
          hr: [
            'Izazovi: postavite pitanje na koje pretkoncepcija daje jasan, ali pogrešan odgovor i neka ga učenici zapišu.',
            'Suoči: neka pokus, simulacija ili provjera dosljednosti proturječi tom odgovoru (kognitivni konflikt).',
            'Razriješi: nizom pitanja vodite male skupine dok ishod ne usklade s boljim modelom.',
            'Novu ideju provjerite pitanjem koje izgleda drukčije, a traži isto zaključivanje.'
          ]
        },
        inApp:  {
          en: 'The Common mistakes box in every topic summary, the misconception named with each brain teaser and the Concept check taken before teaching tell you which idea to elicit; the "Predict first" cards supply the confrontation.',
          hr: 'Okvir Česte zablude u sažetku svake teme, zabluda navedena uz svaku mozgalicu i Provjera razumijevanja riješena prije poučavanja govore vam koju ideju treba izazvati, a kartice "Prvo predvidi" donose suočavanje.'
        } },

      { id: 'context-rich-problems',
        name:   { en: 'Context-rich problems', hr: 'Zadaci bogati kontekstom' },
        origin: {
          en: 'Cooperative group problem solving, Patricia Heller and Kenneth Heller, University of Minnesota',
          hr: 'Suradničko rješavanje problema u skupinama, Patricia Heller i Kenneth Heller, Sveučilište u Minnesoti'
        },
        idea:   {
          en: 'A realistic short story replaces the textbook exercise: the pupil has a reason to want the answer and must decide which quantities matter before reaching for any formula.',
          hr: 'Kratka realistična priča zamjenjuje udžbenički zadatak: učenik ima razlog zašto želi odgovor i mora sam odlučiti koje su veličine važne prije nego što posegne za ijednom formulom.'
        },
        steps:  {
          en: [
            'Focus the problem: retell the story, draw a sketch and state what is being asked.',
            'Describe the physics: choose the model, draw a diagram and name the known and unknown quantities.',
            'Plan the solution: write the relations and rearrange them before putting in numbers.',
            'Execute the plan: calculate with units.',
            'Evaluate the answer: is it reasonable, does it have the right unit and does it answer the question?'
          ],
          hr: [
            'Usmjeri se na problem: prepričaj priču, nacrtaj skicu i reci što se traži.',
            'Opiši fiziku: odaberi model, nacrtaj dijagram i imenuj poznate i nepoznate veličine.',
            'Isplaniraj rješenje: zapiši relacije i preuredi ih prije uvrštavanja brojeva.',
            'Provedi plan: računaj s mjernim jedinicama.',
            'Vrednuj rezultat: je li razuman, ima li ispravnu jedinicu i odgovara li na pitanje?'
          ]
        },
        inApp:  {
          en: 'The practice problems include context-rich problems written as short stories, and every problem has a step-by-step solution. Worksheets and practice exams let groups work on them on paper.',
          hr: 'Među zadacima za vježbu nalaze se i zadaci bogati kontekstom napisani kao kratke priče, a svaki zadatak ima postupak rješavanja korak po korak. Radni listići i ispiti za vježbu omogućuju skupinama rad na papiru.'
        } },

      { id: 'ranking-tasks',
        name:   { en: 'Ranking tasks', hr: 'Zadaci rangiranja' },
        origin: {
          en: 'Ranking tasks and other TIPERs, Thomas O\'Kuma, David Maloney and Curtis Hieggelke',
          hr: 'Zadaci rangiranja i drugi zadaci TIPERs, Thomas O\'Kuma, David Maloney i Curtis Hieggelke'
        },
        idea:   {
          en: 'Pupils order several similar situations by one quantity and justify the order, which exposes the rule they really use far better than a calculation does.',
          hr: 'Učenici nekoliko sličnih situacija poredaju prema jednoj veličini i obrazlože poredak, što mnogo bolje od računa otkriva pravilo kojim se doista služe.'
        },
        steps:  {
          en: [
            'Show four to six variants of one situation that differ in two quantities.',
            'Each pupil ranks them from the largest to the smallest value, ties allowed, and writes down the reason.',
            'Pupils compare their rankings in pairs and defend their reasoning.',
            'Discuss which rule gives which order, and check one case by experiment or calculation.'
          ],
          hr: [
            'Pokažite četiri do šest inačica iste situacije koje se razlikuju u dvjema veličinama.',
            'Svaki ih učenik poreda od najveće do najmanje vrijednosti, uz mogućnost jednakih, i zapiše obrazloženje.',
            'Učenici u parovima uspoređuju poretke i brane svoje zaključivanje.',
            'Raspravite koje pravilo daje koji poredak i jedan slučaj provjerite pokusom ili računom.'
          ]
        },
        inApp:  {
          en: 'The Brain teasers page contains ranking tasks alongside concept questions and estimation tasks; use them as a warm-up or for work in pairs.',
          hr: 'Stranica Mozgalice uz konceptualna pitanja i zadatke procjene sadrži i zadatke rangiranja; upotrijebite ih za zagrijavanje ili za rad u paru.'
        } },

      { id: 'multiple-representations',
        name:   { en: 'Multiple representations', hr: 'Višestruki prikazi' },
        origin: { en: 'Alan Van Heuvelen and other physics education researchers', hr: 'Alan Van Heuvelen i drugi istraživači edukacijske fizike' },
        idea:   {
          en: 'The same situation is described in words, a sketch, a force diagram, a graph, an energy bar chart and an equation, and pupils practise translating from one into another.',
          hr: 'Ista se situacija opisuje riječima, skicom, dijagramom sila, grafom, stupčastim dijagramom energije i jednadžbom, a učenici vježbaju prevođenje iz jednog prikaza u drugi.'
        },
        steps:  {
          en: [
            'Start from a description in words or a short video of the event.',
            'Draw a sketch and a qualitative diagram: forces, motion or energy bars.',
            'Draw the graph and read from it what the slope and the height of the line mean.',
            'Only then write the equation and check that it tells the same story as the diagrams.',
            'Reverse the task: give a graph or a bar chart and ask for the story.'
          ],
          hr: [
            'Krenite od opisa riječima ili kratke snimke događaja.',
            'Nacrtajte skicu i kvalitativni dijagram: sile, gibanje ili stupce energije.',
            'Nacrtajte graf i iz njega pročitajte što znače nagib i visina crte.',
            'Tek tada zapišite jednadžbu i provjerite govori li isto što i dijagrami.',
            'Obrnite zadatak: zadajte graf ili stupčasti dijagram i tražite priču.'
          ]
        },
        inApp:  {
          en: 'The simulations "Motion Graphs", "Energy Bar Charts" and "Forces Come in Pairs" show an event side by side with its graph, bar chart or force diagram, so pupils can move between representations of the same event.',
          hr: 'Simulacije "Grafovi gibanja", "Stupčasti dijagram energije" i "Sile dolaze u parovima" prikazuju događaj usporedno s njegovim grafom, stupčastim dijagramom ili dijagramom sila, pa učenici mogu prelaziti s jednog prikaza istog događaja na drugi.'
        } }
    ],

    /* ---------- 4. Open resources ---------- */
    resources: [
      { name: 'PhET Interactive Simulations', by: 'University of Colorado Boulder', url: 'https://phet.colorado.edu',
        note: {
          en: 'Free research-based simulations for physics and other sciences, many translated into Croatian, with activities contributed by teachers.',
          hr: 'Besplatne simulacije utemeljene na istraživanjima za fiziku i druge prirodne znanosti, mnoge prevedene na hrvatski, s aktivnostima koje su pripremili učitelji.'
        } },
      { name: 'phyphox', by: 'RWTH Aachen University', url: 'https://phyphox.org',
        note: {
          en: 'A free app that turns the sensors of a phone into measuring instruments for acceleration, sound, light, magnetic field and more, with data export.',
          hr: 'Besplatna aplikacija koja senzore mobitela pretvara u mjerne instrumente za ubrzanje, zvuk, svjetlost, magnetsko polje i drugo, uz izvoz podataka.'
        } },
      { name: 'PhysPort', by: 'American Association of Physics Teachers', url: 'https://www.physport.org',
        note: {
          en: 'A guide to research-based teaching methods and to free concept tests, with advice on using them and interpreting the results.',
          hr: 'Vodič kroz nastavne metode utemeljene na istraživanjima i besplatne konceptualne testove, sa savjetima za primjenu i tumačenje rezultata.'
        } },
      { name: 'Interactive Lecture Demonstrations', by: 'PhysPort', url: 'https://www.physport.org/methods/method.cfm?G=ILD',
        note: {
          en: 'How to run demonstrations in eight steps built around prediction, with the research evidence and ready-made sequences.',
          hr: 'Kako demonstracijske pokuse izvoditi u osam koraka utemeljenih na predviđanju, uz rezultate istraživanja i gotove nizove pokusa.'
        } },
      { name: 'ISLE', by: 'Rutgers University (via PhysPort)', url: 'https://www.physport.org/methods/method.cfm?G=ISLE',
        note: {
          en: 'An overview of the Investigative Science Learning Environment: observational, testing and application experiments, with links to materials.',
          hr: 'Pregled pristupa Investigative Science Learning Environment: opažački, ispitni i primjenski pokusi, s poveznicama na materijale.'
        } },
      { name: 'Science Snacks', by: 'Exploratorium', url: 'https://www.exploratorium.edu/snacks',
        note: {
          en: 'Hundreds of tested hands-on activities made from cheap everyday materials, each with an explanation of the science behind it.',
          hr: 'Stotine provjerenih pokusa od jeftinih svakodnevnih materijala, svaki s objašnjenjem fizikalne pozadine.'
        } },
      { name: 'IOP Spark', by: 'Institute of Physics', url: 'https://spark.iop.org',
        note: {
          en: 'Teaching resources for ages 11 to 19: practical experiments, lesson ideas and guidance on common misconceptions.',
          hr: 'Nastavni materijali za uzrast od 11 do 19 godina: praktični pokusi, ideje za sate i upute o čestim pretkoncepcijama.'
        } },
      { name: 'Physics Education Group', by: 'Faculty of Science, University of Zagreb', url: 'https://www.pmf.unizg.hr/phy/en/zavodi/zef/physics_education',
        note: {
          en: 'The group at the Department of Physics that researches the teaching and learning of physics and educates future physics teachers in Croatia.',
          hr: 'Grupa na Fizičkom odsjeku koja istražuje učenje i poučavanje fizike te obrazuje buduće nastavnike fizike u Hrvatskoj.'
        } },
      { name: 'Kurikulum nastavnog predmeta Fizika (NN 10/2019)', by: 'Ministarstvo znanosti i obrazovanja', url: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_210.html',
        note: {
          en: 'The official Croatian physics curriculum for primary schools and grammar schools: the outcomes, their elaboration and recommendations for achieving them.',
          hr: 'Službeni kurikulum fizike za osnovne škole i gimnazije: ishodi, njihova razrada i preporuke za njihovo ostvarivanje.'
        } }
    ]

  });
})();
