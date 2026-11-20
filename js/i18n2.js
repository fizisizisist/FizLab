/* FizLab — UI strings added in the home-lab / exams / teachers extension. Merged into window.I18N. */
(function () {
  'use strict';
  function merge(dst, src) { Object.keys(src).forEach(k => { if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) { dst[k] = dst[k] || {}; merge(dst[k], src[k]); } else dst[k] = src[k]; }); }
  merge(window.I18N.en, {
    common: { score: 'Score: ', langEn: 'English', langHr: 'Croatian' },
    read: {
      title: 'Reading options',
      dys: 'Dyslexia-friendly text',
      dysHint: 'More space between letters, words and lines, a cream background and no italics.',
      bold: 'Bold word beginnings (ADHD)',
      boldHint: 'Helps some readers keep their eyes moving along the line. Keep it only if reading feels easier.',
      guide: 'Reading ruler',
      guideHint: 'A band follows your mouse or finger and dims the rest of the page.',
      note: 'Everyone reads differently: try the options and keep what helps you. They can be combined.'
    },
    nav: { train: 'Practice', tests: 'Tests', lab: 'Home lab', reference: 'Reference', teachers: 'Teachers' },
    stats: { experiments: ['home experiment', 'home experiments'] },
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
    common: { score: 'Bodovi: ', langEn: 'Engleski', langHr: 'Hrvatski' },
    read: {
      title: 'Prilagodba čitanja',
      dys: 'Tekst za lakše čitanje (disleksija)',
      dysHint: 'Više razmaka između slova, riječi i redaka, krem pozadina i tekst bez kurziva.',
      bold: 'Podebljani počeci riječi (ADHD)',
      boldHint: 'Nekima pomaže da pogled lakše prati redak. Ostavi uključeno samo ako ti je tako lakše čitati.',
      guide: 'Ravnalo za čitanje',
      guideHint: 'Traka prati miš ili prst i zatamnjuje ostatak stranice.',
      note: 'Svatko čita drukčije: isprobaj mogućnosti i zadrži ono što ti pomaže. Možeš ih i kombinirati.'
    },
    nav: { train: 'Vježba', tests: 'Provjere', lab: 'Kućni laboratorij', reference: 'Priručnik', teachers: 'Za učitelje' },
    stats: { experiments: ['pokus kod kuće', 'pokusa kod kuće', 'pokusa kod kuće'] },
    hub: {
      all: 'Prikaži sve', more: 'Ostalo',
      train: { title: 'Vježba', lede: 'Računski zadaci s uvijek novim brojevima, zadaci s grafovima, problemski zadaci, mozgalice i brzi trening.' },
      tests: { title: 'Provjere', lede: 'Saznaj koliko znaš: probna provjera s ocjenom, provjera razumijevanja prije i nakon učenja, miješani kviz i dnevni izazov.' },
      lab: { title: 'Kućni laboratorij', lede: 'Pravi pokusi s predmetima koje imaš kod kuće i alati koji mobitel ili računalo pretvaraju u mjerni instrument.' },
      reference: { title: 'Priručnik', lede: 'Sve za brzo snalaženje: pojmovi na dva jezika, sve formule, kartice, znanstvenici i njihova otkrića te pretvarač jedinica.' },
      teachers: { title: 'Za učitelje', lede: 'Pregled ishoda kurikuluma, nacrti istraživačkih sati, metode utemeljene na istraživanjima, radni listići i provjere znanja s rješenjima.' },
      cards: {
        graphs: { t: 'Zadaci s grafom', d: 'Očitaj brzinu, put, otpor i druge veličine izravno iz grafa – iz nagiba, površine ispod grafa ili pojedinih točaka.' },
        stories: { t: 'Problemski zadaci', d: 'Svakodnevne situacije u kojima sam odlučuješ koji su podaci važni. Jedan je podatak uvijek suvišan.' },
        drills: { t: 'Brzi trening', d: 'Deset brzih pitanja: pretvori jedinice, preoblikuj formulu, poveži veličine s jedinicama i mjernim instrumentima.' },
        exam: { t: 'Probna provjera', d: 'Cijela provjera znanja za temu ili razred, s ocjenom od 1 do 5. Na kraju je objašnjen svaki odgovor.' },
        check: { t: 'Provjera razumijevanja', d: 'Riješi istih 20 konceptualnih pitanja prije i nakon učenja i pogledaj koliki je napredak.' },
        experiments: { t: 'Pokusi kod kuće', d: 'Predvidi, izvedi, opazi, objasni: pokusi i projekti s predmetima iz kućanstva za svaku temu.' },
        homelab: { t: 'Kako izvoditi pokuse kod kuće', d: 'Kratka lekcija o sigurnosti, pravilnom mjerenju, tablicama, grafovima i pisanju izvješća o pokusu.' }
      }
    },
    practice: { kindAll: 'Sve vrste', kindCalc: 'Računski', kindGraph: 'S grafom', kindStory: 'Problemski' },
    exp: {
      title: 'Pokusi kod kuće', lede: 'Najprije predvidi što će se dogoditi, zatim izvedi pokus pa usporedi. Pogrešno predviđanje najbolji je način da naučiš nešto novo.',
      rules: 'Upotrebljavaj samo baterije, nikad struju iz utičnice. S vrućom vodom, svijećama i škarama radi samo uz odraslu osobu. Nikad ne gledaj u Sunce. Kad završiš, pospremi za sobom.',
      kind: 'Vrsta', count: 'u odabiru', doneCount: 'izvedeno',
      type: { observe: 'Opažanje', test: 'Mjerenje', apply: 'Primjena', project: 'Izrada' },
      measure: 'Što mjeriti', tool: 'Alat', sim: 'Simulacija',
      predictHint: 'Odaberi predviđanje prije nego što počneš. Možeš ga mijenjati sve dok ne otkriješ rezultat.',
      reveal: 'Pokus je izveden – pokaži što se trebalo dogoditi', matched: 'Tvoje se predviđanje ostvarilo.', surprised: 'Iznenađenje! Predviđanje je bilo drukčije, a upravo tako uče i znanstvenici.',
      notes: 'Moje bilješke', notesPh: 'Opažanja, rezultati mjerenja, što promijeniti idući put…', done: 'Pokus je izveden', moreForTopic: 'Još pokusa iz ove teme'
    },
    poe: { title: 'Prvo predvidi', try: 'Sad provjeri:', show: 'Provjereno – pokaži objašnjenje', right: 'Tvoje je predviđanje bilo točno.', wrong: 'Simulacija pokazuje nešto drugo.', next: 'Sljedeće predviđanje' },
    exam: {
      title: 'Probna provjera', lede: 'Provjera kao u školi: pitanja iz kvizova, konceptualna pitanja i računski zadaci. Ništa se ne ocjenjuje dok provjeru ne predaš.',
      scope: 'Gradivo', scopeAll: 'Sve (7. i 8. razred)', length: 'Duljina', short: 'Kratka', standard: 'Srednja', long: 'Duga',
      timed: 'Ograniči vrijeme (1,5 minuta po pitanju)', start: 'Započni provjeru',
      note: 'S istim kodom dobiva se ista provjera, pa je cijeli razred može pisati zajedno. Za novu provjeru ostavi polje prazno.',
      taken: 'Riješenih provjera', grade: 'Ocjena', grades: { 1: 'nedovoljan', 2: 'dovoljan', 3: 'dobar', 4: 'vrlo dobar', 5: 'odličan' },
      scale: 'Ljestvica: od 90 % ocjena 5, od 77 % ocjena 4, od 64 % ocjena 3, od 50 % ocjena 2. U tvojoj školi granice mogu biti drukčije.',
      submit: 'Predaj provjeru', submitAnyway: 'Ipak predaj', unanswered: 'bez odgovora. Ako ipak želiš predati, pritisni ponovno.', blank: 'Bez odgovora.', timeLeft: 'Preostalo vrijeme:', newExam: 'Nova provjera'
    },
    check: {
      title: 'Provjera razumijevanja', lede: 'Dvadeset pitanja o idejama, a ne o računanju. Riješi je prije nego što počneš učiti temu i ponovno nakon toga: razlika pokazuje koliko je novoga naučeno.',
      how: 'Vidiš samo rezultat, ne i točne odgovore, kako bi drugi pokušaj ostao pošten. Nastavnici fizike taj rezultat nazivaju normaliziranim dobitkom: to je udio onoga što ti je prije bilo nepoznato, a sada to znaš.',
      first: 'Provjera još nije riješena.', before: 'Prije', after: 'Poslije', gain: 'Dobitak',
      high: 'Velik dobitak: većinu onoga što ti je bilo nepoznato sada znaš.', medium: 'Srednji dobitak: uobičajen za interaktivnu nastavu.', low: 'Malen dobitak: za ideje koje ti nisu jasne iskoristi mozgalice i simulacije.', negative: 'Rezultat je niži nego prije: možda je prvi put bilo i sretnog pogađanja. Pokušaj ponovno nakon još malo vježbe.',
      maxed: 'Već je prvi put sve bilo točno.', comeBack: 'Vrati se nakon učenja i riješi provjeru ponovno.',
      startBefore: 'Započni početnu provjeru', startAfter: 'Riješi ponovno (završna provjera)', reset: 'Kreni ispočetka', showAnswers: 'Prikaži odgovore i objašnjenja', dontPeek: 'Ako ćeš provjeru rješavati još jednom kao završnu, nemoj još gledati odgovore.'
    },
    drills: {
      title: 'Brzi trening', lede: 'Deset pitanja – odgovori što brže možeš. Nadmaši svoj najbolji rezultat i vrijeme.',
      kinds: { units: 'Pretvaranje jedinica', formulas: 'Preoblikovanje formula', quantities: 'Veličine i jedinice' },
      convert: 'Pretvori', into: 'u', from: 'Iz formule', express: 'izrazi',
      howDivide: 'Podijeli obje strane veličinom {x}.', howMultiply: 'Pomnoži obje strane veličinom {x}.', howSwap: 'Pomnoži obje strane veličinom {x}, a zatim ih podijeli veličinom {y}.',
      unitOf: 'Koja je mjerna jedinica veličine:', measuredIn: 'Koja se veličina mjeri jedinicom', instrumentFor: 'Kojim se mjernim instrumentom mjeri veličina:', symbolOf: 'Koja je uobičajena oznaka veličine:', time: 'Vrijeme'
    },
    teach: {
      title: 'Za učitelje', lede: 'FizLab prati hrvatski kurikulum Fizike za 7. i 8. razred i rezultate istraživanja u nastavi fizike. Može poslužiti za uvodne probleme, vođena istraživanja, konceptualna pitanja, domaće zadaće i provjere znanja.',
      tools: 'Spremno za nastavu', toolWorksheet: 'Novi zadaci s rješenjima; s istim kodom ponovno se dobiva isti listić.', toolExam: 'Provjera znanja za temu ili razred; s istim kodom cijeli razred dobiva istu provjeru.',
      toolCheck: 'Isti konceptualni test prije i nakon obrade gradiva, s izračunom normaliziranog dobitka.', toolConcepts: 'Konceptualna pitanja, zadaci rangiranja i procjene za glasovanje i raspravu u paru.', toolExperiments: 'Pokusi opažanja, mjerenja i primjene te projekti izrade za domaću zadaću.',
      outlines: 'Nacrti istraživačkih sati', outlinesLede: 'Kostur sata za svaku temu u tri dijela: uvodni problem, vođeno istraživanje te primjena s konceptualnim pitanjima.',
      outcomes: 'Odgojno-obrazovni ishodi', opening: 'Uvodni problem', question: 'Istraživačko pitanje', investigate: 'Vođeno istraživanje', keyIdea: 'Ključna ideja', talk: 'Pitanja za raspravu u paru',
      peer: 'Konceptualna pitanja (točan odgovor podebljan)', apply: 'Primjena i provjera', exit: 'Izlazna kartica', homework: 'Domaća zadaća: pokusi', watch: 'Na što paziti',
      curriculum: 'Pregled ishoda kurikuluma', curriculumLede: 'Odgojno-obrazovni ishodi iz kurikuluma za nastavni predmet Fizike za osnovne škole i gimnazije (NN 10/2019) i dijelovi FizLaba koji ih podupiru.',
      code: 'Oznaka', outcome: 'Ishod', methods: 'Metode utemeljene na istraživanjima', inApp: 'U FizLabu', resources: 'Otvoreni obrazovni sadržaji koje vrijedi upoznati'
    },
    badges: {
      experimenter: { t: 'Eksperimentator', d: 'Izvedi 5 pokusa kod kuće.' },
      predictor: { t: 'Prorok', d: 'Daj 10 predviđanja prije nego što ih provjeriš.' },
      examAce: { t: 'Čista petica', d: 'Dobij peticu na probnoj provjeri.' }
    },
    progress: { experiments: 'izvedenih pokusa', exams: 'najbolja probna provjera' }
  });
})();
