/* FizLab — UI strings added in the home-lab / exams / teachers extension. Merged into window.I18N. */
(function () {
  'use strict';
  function merge(dst, src) { Object.keys(src).forEach(k => { if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) { dst[k] = dst[k] || {}; merge(dst[k], src[k]); } else dst[k] = src[k]; }); }
  merge(window.I18N.en, {
    nav: { train: 'Practice', tests: 'Tests', lab: 'Home lab', reference: 'Reference', teachers: 'Teachers' },
    stats: { experiments: 'home experiments' },
    hub: {
      all: 'See all', more: 'More',
      train: { title: 'Practice', lede: 'Calculation problems with fresh numbers, graph reading, story problems, brain teasers and quick drills.' },
      tests: { title: 'Tests', lede: 'Check what you know: a practice exam with a grade, a before-and-after concept check, a mixed quiz and the daily challenge.' },
      lab: { title: 'Home lab', lede: 'Real experiments with things you have at home, and tools that turn your phone or laptop into a measuring instrument.' },
      reference: { title: 'Reference', lede: 'Look things up: terms in two languages, every formula, flashcards, the people behind the ideas and a unit converter.' },
      teachers: { title: 'For teachers', lede: 'Curriculum map, inquiry lesson outlines, research-based methods, worksheets and tests with answer keys.' },
      cards: {
        graphs: { t: 'Graph problems', d: 'Read speeds, distances, resistance and more straight from a graph: slope, area and single points.' },
        stories: { t: 'Story problems', d: 'Real-life situations where you decide which numbers matter. One number is always a distraction.' },
        drills: { t: 'Quick drills', d: 'Ten fast questions: convert units, rearrange formulas, match quantities with units and instruments.' },
        exam: { t: 'Practice exam', d: 'A full test for a topic or a whole grade, graded 1 to 5, with every answer explained afterwards.' },
        check: { t: 'Concept check', d: 'Take the same 20 concept questions before and after you study and see how much you gained.' },
        experiments: { t: 'Experiments at home', d: 'Predict, do it, observe, explain: experiments and projects with household items for every topic.' },
        homelab: { t: 'How to experiment at home', d: 'A short lesson on safety, measuring well, tables, graphs and writing a lab report.' }
      }
    },
    practice: { kindAll: 'All kinds', kindCalc: 'Calculations', kindGraph: 'With a graph', kindStory: 'Story problems' },
    exp: {
      title: 'Experiments at home', lede: 'First predict what will happen, then do the experiment, then compare. A wrong prediction is the best way to learn something new.',
      rules: 'Batteries only, never mains electricity. Hot water, candles and scissors only with an adult nearby. Never look at the Sun. Tidy up when you finish.',
      kind: 'Kind', count: 'experiments', doneCount: 'done',
      type: { observe: 'Observe', test: 'Fair test', apply: 'Apply', project: 'Build it' },
      measure: 'What to measure', tool: 'Lab tool', sim: 'Simulation',
      predictHint: 'Choose your prediction before you start. You can change it until you reveal the result.',
      reveal: 'I did the experiment: show what should happen', matched: 'Your prediction matched.', surprised: 'A surprise! Your prediction was different, and that is how scientists learn.',
      notes: 'My notes', notesPh: 'What I saw, my measurements, what I would change next time…', done: 'I did this experiment', moreForTopic: 'More experiments for this topic'
    },
    poe: { title: 'Predict first', try: 'Now test it:', show: 'I tested it: show the explanation', right: 'Your prediction was right.', wrong: 'The simulation shows something else.', next: 'Another prediction' },
    exam: {
      title: 'Practice exam', lede: 'A test like in school: quiz questions, concept questions and calculation problems. Nothing is marked until you hand it in.',
      scope: 'What to test', scopeAll: 'Everything (grades 7 and 8)', length: 'Length', short: 'Short', standard: 'Standard', long: 'Long',
      timed: 'Use a timer (1.5 minutes per question)', start: 'Start the exam',
      note: 'The code makes the same exam again, so a whole class can sit the same test. Leave it empty for a new exam.',
      taken: 'Exams taken', grade: 'Grade', grades: { 1: 'insufficient', 2: 'sufficient', 3: 'good', 4: 'very good', 5: 'excellent' },
      scale: 'Scale: 90 % or more is 5, from 77 % is 4, from 64 % is 3, from 50 % is 2. Your school may use other limits.',
      submit: 'Hand in the exam', submitAnyway: 'Hand in anyway', unanswered: 'questions are still unanswered. Press again to hand in.', blank: 'No answer.', timeLeft: 'Time left:', newExam: 'New exam'
    },
    check: {
      title: 'Concept check', lede: 'Twenty questions about ideas, not calculations. Take it before you start a topic and again after: the difference shows what you really learned.',
      how: 'You see only your score, not the answers, so the second try stays fair. Physics teachers call the result the normalised gain: the share of what you did not know before that you know now.',
      first: 'You have not taken the check yet.', before: 'Before', after: 'After', gain: 'Gain',
      high: 'A high gain: you learned most of what you did not know.', medium: 'A medium gain: typical for interactive lessons.', low: 'A low gain: use the brain teasers and simulations for the ideas you missed.', negative: 'Lower than before: you may have guessed well the first time. Try again after more practice.',
      maxed: 'You already had everything right the first time.', comeBack: 'Come back after you have studied and take it again.',
      startBefore: 'Start the before-test', startAfter: 'Take it again (after-test)', reset: 'Start over', showAnswers: 'Show answers and explanations', dontPeek: 'If you plan to take this again as an after-test, do not look at the answers yet.'
    },
    drills: {
      title: 'Quick drills', lede: 'Ten questions, as fast as you can. Beat your best score and time.',
      kinds: { units: 'Unit conversions', formulas: 'Rearranging formulas', quantities: 'Quantities and units' },
      convert: 'Convert', into: 'to', from: 'Rearrange', express: 'to find',
      howDivide: 'Divide both sides by {x}.', howMultiply: 'Multiply both sides by {x}.', howSwap: 'Multiply both sides by {x}, then divide by {y}.',
      unitOf: 'Which unit belongs to the quantity:', measuredIn: 'Which quantity is measured in', instrumentFor: 'Which instrument measures the quantity:', symbolOf: 'What is the usual symbol for the quantity:', time: 'Time'
    },
    teach: {
      title: 'For teachers', lede: 'FizLab follows the Croatian curriculum for grades 7 and 8 and the findings of physics education research. Use it for lesson starters, guided investigations, conceptual questions, homework and tests.',
      tools: 'Ready for class', toolWorksheet: 'Fresh problems with an answer key; a code reproduces the same sheet.', toolExam: 'A test for a topic or a grade; a code gives the whole class the same exam.',
      toolCheck: 'The same concept test before and after teaching, with the normalised gain.', toolConcepts: 'Concept, ranking and estimation questions for voting and pair discussion.', toolExperiments: 'Observation, testing, application experiments and projects for homework.',
      outlines: 'Inquiry lesson outlines', outlinesLede: 'A skeleton for each topic in three parts: an opening problem, a guided investigation and an application with conceptual questions.',
      outcomes: 'Curriculum outcomes', opening: 'Opening problem', question: 'Research question', investigate: 'Guided investigation', keyIdea: 'Key idea', talk: 'Questions for pair discussion',
      peer: 'Concept questions (answer in bold)', apply: 'Application and check', exit: 'Exit ticket', homework: 'Homework: experiments', watch: 'Watch out for',
      curriculum: 'Curriculum map', curriculumLede: 'Outcomes of the Croatian physics curriculum for primary school (NN 10/2019) and where FizLab supports them.',
      code: 'Code', outcome: 'Outcome', methods: 'Research-based methods', inApp: 'In FizLab', resources: 'Open resources worth knowing'
    },
    badges: {
      experimenter: { t: 'Experimenter', d: 'Do 5 experiments at home.' },
      predictor: { t: 'Fortune teller', d: 'Make 10 predictions before testing them.' },
      examAce: { t: 'Top marks', d: 'Get grade 5 on a practice exam.' }
    },
    progress: { experiments: 'experiments done', exams: 'best practice exam' }
  });
  merge(window.I18N.hr, {
    nav: { train: 'Vježba', tests: 'Ispiti', lab: 'Kućni laboratorij', reference: 'Podsjetnik', teachers: 'Za učitelje' },
    stats: { experiments: 'pokusa kod kuće' },
    hub: {
      all: 'Prikaži sve', more: 'Još',
      train: { title: 'Vježba', lede: 'Računski zadaci sa svježim brojevima, očitavanje grafova, problemski zadaci, mozgalice i brzi trening.' },
      tests: { title: 'Ispiti', lede: 'Provjeri što znaš: ispit za vježbu s ocjenom, provjera razumijevanja prije i poslije, miješani kviz i dnevni izazov.' },
      lab: { title: 'Kućni laboratorij', lede: 'Pravi pokusi sa stvarima koje imaš kod kuće i alati koji mobitel ili računalo pretvaraju u mjerni instrument.' },
      reference: { title: 'Podsjetnik', lede: 'Potraži: pojmove na dva jezika, sve formule, kartice, ljude iza ideja i pretvarač jedinica.' },
      teachers: { title: 'Za učitelje', lede: 'Karta kurikuluma, okviri istraživačkih sati, metode utemeljene na istraživanjima, radni listići i ispiti s rješenjima.' },
      cards: {
        graphs: { t: 'Zadaci s grafom', d: 'Očitaj brzinu, put, otpor i drugo izravno iz grafa: nagib, površina i pojedine točke.' },
        stories: { t: 'Problemski zadaci', d: 'Situacije iz života u kojima sam odlučuješ koji su podaci važni. Jedan je podatak uvijek višak.' },
        drills: { t: 'Brzi trening', d: 'Deset brzih pitanja: pretvori jedinice, preoblikuj formulu, poveži veličine s jedinicama i instrumentima.' },
        exam: { t: 'Ispit za vježbu', d: 'Cijeli ispit za temu ili razred, s ocjenom od 1 do 5 i objašnjenjem svakog odgovora na kraju.' },
        check: { t: 'Provjera razumijevanja', d: 'Riješi istih 20 konceptualnih pitanja prije i nakon učenja i pogledaj koliki je napredak.' },
        experiments: { t: 'Pokusi kod kuće', d: 'Predvidi, izvedi, opazi, objasni: pokusi i projekti s kućnim priborom za svaku temu.' },
        homelab: { t: 'Kako izvoditi pokuse kod kuće', d: 'Kratka lekcija o sigurnosti, dobrom mjerenju, tablicama, grafovima i izvješću o pokusu.' }
      }
    },
    practice: { kindAll: 'Sve vrste', kindCalc: 'Računski', kindGraph: 'S grafom', kindStory: 'Problemski' },
    exp: {
      title: 'Pokusi kod kuće', lede: 'Najprije predvidi što će se dogoditi, zatim izvedi pokus pa usporedi. Pogrešno predviđanje najbolji je način da naučiš nešto novo.',
      rules: 'Samo baterije, nikad struja iz utičnice. Vruća voda, svijeće i škare samo uz odraslu osobu. Nikad ne gledaj u Sunce. Na kraju pospremi.',
      kind: 'Vrsta', count: 'pokusa', doneCount: 'izvedeno',
      type: { observe: 'Opažanje', test: 'Mjerenje', apply: 'Primjena', project: 'Izrada' },
      measure: 'Što mjeriti', tool: 'Alat', sim: 'Simulacija',
      predictHint: 'Odaberi predviđanje prije početka. Možeš ga mijenjati dok ne otkriješ rezultat.',
      reveal: 'Izveo/la sam pokus: pokaži što se trebalo dogoditi', matched: 'Tvoje se predviđanje ostvarilo.', surprised: 'Iznenađenje! Predvidio/la si nešto drugo, a upravo tako uče i znanstvenici.',
      notes: 'Moje bilješke', notesPh: 'Što sam opazio/la, moja mjerenja, što bih idući put promijenio/la…', done: 'Izveo/la sam ovaj pokus', moreForTopic: 'Još pokusa iz ove teme'
    },
    poe: { title: 'Prvo predvidi', try: 'Sad provjeri:', show: 'Provjerio/la sam: pokaži objašnjenje', right: 'Tvoje je predviđanje bilo točno.', wrong: 'Simulacija pokazuje nešto drugo.', next: 'Drugo predviđanje' },
    exam: {
      title: 'Ispit za vježbu', lede: 'Ispit kao u školi: pitanja iz kviza, konceptualna pitanja i računski zadaci. Ništa se ne ocjenjuje dok ne predaš.',
      scope: 'Što se ispituje', scopeAll: 'Sve (7. i 8. razred)', length: 'Duljina', short: 'Kratki', standard: 'Standardni', long: 'Dugi',
      timed: 'Mjeri vrijeme (1,5 minuta po pitanju)', start: 'Započni ispit',
      note: 'Pomoću koda dobiva se isti ispit, pa cijeli razred može pisati isti. Ostavi prazno za novi ispit.',
      taken: 'Riješenih ispita', grade: 'Ocjena', grades: { 1: 'nedovoljan', 2: 'dovoljan', 3: 'dobar', 4: 'vrlo dobar', 5: 'odličan' },
      scale: 'Ljestvica: 90 % i više je 5, od 77 % je 4, od 64 % je 3, od 50 % je 2. Tvoja škola može imati drukčije pragove.',
      submit: 'Predaj ispit', submitAnyway: 'Ipak predaj', unanswered: 'pitanja još nije odgovoreno. Pritisni ponovno za predaju.', blank: 'Bez odgovora.', timeLeft: 'Preostalo:', newExam: 'Novi ispit'
    },
    check: {
      title: 'Provjera razumijevanja', lede: 'Dvadeset pitanja o idejama, a ne o računanju. Riješi je prije nego što počneš temu i ponovno nakon nje: razlika pokazuje što si stvarno naučio/la.',
      how: 'Vidiš samo rezultat, ne i odgovore, da drugi pokušaj ostane pošten. Nastavnici fizike rezultat zovu normalizirani dobitak: udio onoga što prije nisi znao/la, a sada znaš.',
      first: 'Još nisi rješavao/la provjeru.', before: 'Prije', after: 'Poslije', gain: 'Dobitak',
      high: 'Velik dobitak: naučio/la si većinu onoga što nisi znao/la.', medium: 'Srednji dobitak: tipičan za interaktivnu nastavu.', low: 'Malen dobitak: za ideje koje ti nisu jasne iskoristi mozgalice i simulacije.', negative: 'Niže nego prije: možda si prvi put dobro pogađao/la. Pokušaj ponovno nakon još vježbe.',
      maxed: 'Već si prvi put imao/la sve točno.', comeBack: 'Vrati se nakon učenja i riješi je ponovno.',
      startBefore: 'Započni provjeru prije', startAfter: 'Riješi ponovno (provjera poslije)', reset: 'Kreni ispočetka', showAnswers: 'Prikaži odgovore i objašnjenja', dontPeek: 'Ako ovo planiraš riješiti još jednom kao provjeru poslije, nemoj još gledati odgovore.'
    },
    drills: {
      title: 'Brzi trening', lede: 'Deset pitanja, što brže možeš. Nadmaši svoj najbolji rezultat i vrijeme.',
      kinds: { units: 'Pretvaranje jedinica', formulas: 'Preoblikovanje formula', quantities: 'Veličine i jedinice' },
      convert: 'Pretvori', into: 'u', from: 'Iz', express: 'izrazi',
      howDivide: 'Podijeli obje strane s {x}.', howMultiply: 'Pomnoži obje strane s {x}.', howSwap: 'Pomnoži obje strane s {x}, zatim podijeli s {y}.',
      unitOf: 'Koja mjerna jedinica pripada veličini:', measuredIn: 'Koja se veličina mjeri jedinicom', instrumentFor: 'Kojim se instrumentom mjeri veličina:', symbolOf: 'Koja je uobičajena oznaka za veličinu:', time: 'Vrijeme'
    },
    teach: {
      title: 'Za učitelje', lede: 'FizLab prati hrvatski kurikulum za 7. i 8. razred i rezultate edukacijskih istraživanja u fizici. Poslužit će za uvodne probleme, vođena istraživanja, konceptualna pitanja, domaće zadaće i ispite.',
      tools: 'Spremno za razred', toolWorksheet: 'Svježi zadaci s rješenjima; isti se listić ponovno dobiva pomoću koda.', toolExam: 'Ispit za temu ili razred; pomoću koda cijeli razred dobiva isti ispit.',
      toolCheck: 'Isti konceptualni test prije i nakon poučavanja, s normaliziranim dobitkom.', toolConcepts: 'Konceptualna pitanja, zadaci rangiranja i procjene za glasovanje i raspravu u paru.', toolExperiments: 'Opservacijski, istraživački i aplikacijski pokusi te projekti za domaću zadaću.',
      outlines: 'Okviri istraživačkih sati', outlinesLede: 'Kostur sata za svaku temu u tri dijela: uvodni problem, vođeno istraživanje te primjena s konceptualnim pitanjima.',
      outcomes: 'Ishodi kurikuluma', opening: 'Uvodni problem', question: 'Istraživačko pitanje', investigate: 'Vođeno istraživanje', keyIdea: 'Ključna ideja', talk: 'Pitanja za raspravu u paru',
      peer: 'Konceptualna pitanja (odgovor podebljan)', apply: 'Primjena i provjera', exit: 'Izlazna kartica', homework: 'Domaća zadaća: pokusi', watch: 'Na što paziti',
      curriculum: 'Karta kurikuluma', curriculumLede: 'Odgojno-obrazovni ishodi kurikuluma Fizike za osnovnu školu (NN 10/2019) i mjesta gdje ih FizLab podržava.',
      code: 'Oznaka', outcome: 'Ishod', methods: 'Metode utemeljene na istraživanjima', inApp: 'U FizLabu', resources: 'Otvoreni izvori koje vrijedi poznavati'
    },
    badges: {
      experimenter: { t: 'Eksperimentator', d: 'Izvedi 5 pokusa kod kuće.' },
      predictor: { t: 'Prorok', d: 'Zapiši 10 predviđanja prije provjere.' },
      examAce: { t: 'Čista petica', d: 'Osvoji ocjenu 5 na ispitu za vježbu.' }
    },
    progress: { experiments: 'izvedenih pokusa', exams: 'najbolji ispit za vježbu' }
  });
})();
