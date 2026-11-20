/* FizLab — UI strings (English / Croatian). Topic content lives in js/content/. */
window.I18N = {
  en: {
    appName: 'FizLab',
    tagline: 'Physics you can play with',
    nav: { home: 'Topics', practice: 'Practice', glossary: 'Glossary', formulas: 'Formulas', flashcards: 'Flashcards', scientists: 'Scientists', progress: 'Progress' },
    hero: {
      title: 'Physics you can <em>play</em> with',
      lede: 'Interactive simulations, short lessons, quizzes and kitchen-table experiments for grades 7 and 8. Every page is also in Croatian: switch with the EN / HR button.',
      start: 'Start exploring', mix: 'Mixed quiz', challenge: 'Today\'s challenge'
    },
    stats: { topics: ['topic', 'topics'], sims: ['simulation', 'simulations'], questions: ['quiz question', 'quiz questions'], terms: ['glossary term', 'glossary terms'], problems: ['problem type', 'problem types'] },
    filter: { all: 'All topics', g7: 'Grade 7', g8: 'Grade 8', bonus: 'Bonus' },
    grade: { 7: 'Grade 7', 8: 'Grade 8', 0: 'Bonus' },
    sections: { topics: 'Topics', tools: 'More ways to learn' },
    quick: {
      mix: { t: 'Mixed quiz', d: '10 random questions from every topic. Different every time.' },
      challenge: { t: 'Daily challenge', d: 'One new question each day. Keep your streak going.' },
      glossary: { t: 'Glossary', d: 'Every key term side by side in English and Croatian.' },
      formulas: { t: 'Formula sheet', d: 'All the formulas from all topics on one page.' },
      flashcards: { t: 'Flashcards', d: 'Flip cards to drill the terms and their meanings.' },
      progress: { t: 'My progress', d: 'Lessons read, quizzes passed, badges earned.' },
      practice: { t: 'Practice problems', d: 'Calculation problems with fresh numbers every time, hints and full solutions. Make worksheets too.' },
      scientists: { t: 'Scientists', d: 'Who discovered what, from Archimedes to Tesla, with the Croatian connections.' },
      converter: { t: 'Unit converter', d: 'km/h to m/s, litres to cm³, kPa to bar and more.' },
      concepts: { t: 'Brain teasers', d: 'Tricky concept questions, ranking tasks and estimates that catch the most common wrong ideas.' }
    },
    tabs: { lesson: 'Lesson', sim: 'Simulation', quiz: 'Quiz', practice: 'Practice', home: 'Try at home' },
    lesson: { keyTerms: 'Key terms', formulas: 'Formulas', funFact: 'Did you know?', markRead: 'I have read this lesson', read: 'Lesson read', hrTerm: 'Croatian' },
    sim: { tryThis: 'Try this', choose: 'Simulation', missing: 'This simulation is not loaded.', count: 'simulations', open: 'Open the simulation' },
    quiz: {
      intro: 'questions. Answer each one, read the explanation, and see your score at the end.',
      start: 'Start the quiz', question: 'Question', of: 'of', check: 'Check', next: 'Next question', finish: 'See my score',
      correct: 'Correct!', wrong: 'Not quite.', correctAnswer: 'Correct answer:', yourScore: 'Your score', retry: 'Try again', back: 'Back to the lesson',
      best: 'Best score', typeMc: 'Multiple choice', typeTf: 'True or false?', typeNum: 'Calculate', 'true': 'True', 'false': 'False',
      placeholder: 'your answer', hint: 'Tip: press 1–4 to pick an answer and Enter to continue.',
      perfect: 'Perfect! You really know this topic.', great: 'Great work! Almost everything right.', good: 'Good start. Read the lesson once more and try again.', again: 'Keep going! Play with the simulation, then come back.',
      pass: 'passed', toSim: 'Open the simulation'
    },
    home: { materials: 'You will need', steps: 'What to do', why: 'Why it works', safety: 'Safety first' },
    glossary: { title: 'Glossary', lede: 'Every key term from every topic, in both languages.', search: 'Search a term in English or Croatian…', term: 'English', croatian: 'Croatian', definition: 'Definition', topic: 'Topic', none: 'No terms match your search.' },
    formulas: { title: 'Formula sheet', lede: 'All the formulas in one place. Tap a topic name to go to its lesson.' },
    flash: { title: 'Flashcards', lede: 'Flip the card to see the answer. Shuffle for a new order.', flip: 'Tap the card to flip it', next: 'Next', prev: 'Previous', shuffle: 'Shuffle', mode1: 'Term → meaning', mode2: 'English → Croatian', mode3: 'Croatian → English', card: 'Card', ofAll: 'of', allTopics: 'All topics' },
    progress: {
      title: 'My progress', lede: 'Everything is saved in this browser only.', lessons: 'lessons read', quizzes: 'quizzes passed (70 % or more)', sims: 'simulations tried',
      badges: 'Badges', problems: ['problem solved', 'problems solved'], problemsCol: 'Problems', reset: 'Reset all progress', resetConfirm: 'Click once more to erase everything', topic: 'Topic', lesson: 'Lesson', simulation: 'Simulations', quiz: 'Best quiz', notYet: 'not yet', streak: 'challenge streak', days: ['day', 'days']
    },
    badges: {
      firstQuiz: { t: 'First quiz', d: 'Finish any quiz.' },
      perfect: { t: 'Perfect score', d: 'Get 100 % on a quiz.' },
      reader: { t: 'Bookworm', d: 'Read 5 lessons.' },
      explorer: { t: 'Explorer', d: 'Try 10 different simulations.' },
      scientist: { t: 'Little scientist', d: 'Pass quizzes in 7 topics.' },
      bilingual: { t: 'Bilingual', d: 'Use the app in both languages.' },
      streak3: { t: 'On a roll', d: 'Solve the daily challenge 3 days in a row.' },
      master: { t: 'Physics master', d: 'Pass every quiz.' },
      solver: { t: 'Problem solver', d: 'Solve 25 practice problems.' },
      hard: { t: 'Hard nut', d: 'Solve a hard (three-star) problem.' },
      thinker: { t: 'Deep thinker', d: 'Get 20 brain teasers right.' }
    },
    challenge: { title: 'Today\'s challenge', lede: 'A new question every day, picked from all topics. Come back tomorrow for the next one.', done: 'You solved today\'s challenge! See you tomorrow.', streak: 'Current streak', from: 'From the topic' },
    mix: { title: 'Mixed quiz', lede: '10 random questions from every topic. Different every time.' },
    common: { back: 'Back', allTopics: 'All topics', theme: 'Switch between light and dark', questions: ['question', 'questions'], sims: ['sim', 'sims'], saved: 'Saved', badgeEarned: 'Badge earned:', loading: 'Loading…', notFound: 'This page does not exist.' },
    practice: {
      title: 'Practice problems', lede: 'Every problem comes with fresh numbers. Type the answer, check it, and read the solution step by step.',
      ledeMixed: 'Problems from the topics you choose, with new numbers every time. Below you can make a worksheet with an answer key.',
      mixed: 'Mixed practice', level: 'Level', all: 'All', l1: 'Easy', l2: 'Medium', l3: 'Hard',
      newProblem: 'New problem', check: 'Check', hint: 'Hint', solution: 'Show solution', steps: 'Solution', next: 'Next problem',
      answer: 'your answer', correct: 'Correct!', wrong: 'Not quite. Try again.', wrongAgain: 'Still not right. Use the hint, or look at the solution.',
      counted: 'Solution shown. Only problems solved without it count towards your progress.', solved: 'Solved', topics: 'Topics',
      none: 'No problems for this selection yet.', enterNumber: 'Type a number; a decimal comma or a decimal point both work. Answers within 2 % count as correct.', invalid: 'Please type a number.',
      summaryTitle: 'In short', misconceptions: 'Common mistakes', myth: 'Many think', truth: 'In fact', worked: 'Worked example', tryMore: 'Try problems like this'
    },
    concepts: {
      title: 'Brain teasers', lede: 'No calculator needed, just thinking. Each question targets a wrong idea that many people have. Pick an answer, then read why.',
      forTopic: 'Brain teasers for this topic', kind: 'Kind', typeMc: 'Concept question', typeRank: 'Ranking task', typeNum: 'Estimate',
      rankHint: 'Tap the items in order, from first to last, then check.', undo: 'Undo', correctOrder: 'Correct order', estimateHint: 'An estimate is enough: any answer in a sensible range counts.', accepted: 'Accepted range:', misconception: 'Common wrong idea'
    },
    guide: {
      title: 'How to solve a physics problem (5 steps)',
      s1t: 'Picture it.', s1: 'Draw a sketch, write down what is given with units, and underline what is asked.',
      s2t: 'Simplify.', s2: 'Decide what you can ignore (air, friction, size of the object) and what model fits.',
      s3t: 'Describe the physics.', s3: 'Which forces act? Which energies change? Draw arrows or a graph if it helps.',
      s4t: 'Write the maths.', s4: 'Pick the formula that links the given quantities to the unknown one and rearrange it.',
      s5t: 'Solve and check.', s5: 'Put in the numbers with units, compute, and ask: is the size and the unit of the answer sensible?'
    },
    worksheet: {
      title: 'Worksheet', lede: 'Make a worksheet with fresh problems for the class or for yourself. The code lets you make the same worksheet again later.',
      count: 'Problems', code: 'Code', generate: 'Make worksheet', showAnswers: 'Show answers', hideAnswers: 'Hide answers', answer: 'Answer', pickTopics: 'Choose at least one topic above.'
    },
    scientists: {
      title: 'Scientists', lede: 'The people behind the ideas, from Archimedes to today. Scientists with a Croatian connection are marked.',
      all: 'All', croatia: 'Croatian connection', known: 'Known for', fact: 'Did you know?', topics: 'Topics', alive: 'today', more: 'Read more', less: 'Show less', bc: 'BC'
    },
    converter: {
      title: 'Unit converter', lede: 'Convert between the units used in physics class. Type a value and pick the units.',
      category: 'Quantity', value: 'Value', from: 'From', to: 'To', result: 'Result', table: 'The same value in every unit',
      cats: { length: 'Length', area: 'Area', volume: 'Volume', mass: 'Mass', time: 'Time', speed: 'Speed', density: 'Density', pressure: 'Pressure', energy: 'Energy', power: 'Power', temperature: 'Temperature' }
    },
    footer: 'FizLab is a free learning tool for curious kids and their teachers. Simulations use real physics; sizes on screen are not always to scale.'
  },
  hr: {
    appName: 'FizLab',
    tagline: 'Fizika s kojom se možeš igrati',
    nav: { home: 'Teme', practice: 'Zadaci', glossary: 'Pojmovnik', formulas: 'Formule', flashcards: 'Kartice', scientists: 'Znanstvenici', progress: 'Napredak' },
    hero: {
      title: 'Fizika s kojom se možeš <em>igrati</em>',
      lede: 'Interaktivne simulacije, kratke lekcije, kvizovi i pokusi za kuhinjskim stolom, namijenjeni 7. i 8. razredu. Svaka je stranica dostupna i na engleskom – jezik mijenjaš gumbom EN / HR.',
      start: 'Kreni istraživati', mix: 'Miješani kviz', challenge: 'Današnji izazov'
    },
    stats: { topics: ['tema', 'teme', 'tema'], sims: ['simulacija', 'simulacije', 'simulacija'], questions: ['pitanje u kvizovima', 'pitanja u kvizovima', 'pitanja u kvizovima'], terms: ['pojam u pojmovniku', 'pojma u pojmovniku', 'pojmova u pojmovniku'], problems: ['vrsta zadataka', 'vrste zadataka', 'vrsta zadataka'] },
    filter: { all: 'Sve teme', g7: '7. razred', g8: '8. razred', bonus: 'Dodatno' },
    grade: { 7: '7. razred', 8: '8. razred', 0: 'Dodatno' },
    sections: { topics: 'Teme', tools: 'Još načina za učenje' },
    quick: {
      mix: { t: 'Miješani kviz', d: '10 nasumičnih pitanja iz svih tema. Svaki put drukčije.' },
      challenge: { t: 'Dnevni izazov', d: 'Svaki dan jedno novo pitanje. Rješavaj ga iz dana u dan i produži niz.' },
      glossary: { t: 'Pojmovnik', d: 'Svi ključni pojmovi usporedno na hrvatskom i engleskom.' },
      formulas: { t: 'Formule', d: 'Sve formule iz svih tema na jednoj stranici.' },
      flashcards: { t: 'Kartice', d: 'Okreći kartice i ponavljaj pojmove i njihova značenja.' },
      progress: { t: 'Napredak', d: 'Pročitane lekcije, položeni kvizovi, osvojene značke.' },
      practice: { t: 'Zadaci za vježbu', d: 'Računski zadaci s uvijek novim brojevima, savjetima i cijelim postupkom rješavanja. Možeš izraditi i radni listić.' },
      scientists: { t: 'Znanstvenici', d: 'Tko je što otkrio, od Arhimeda do Tesle – i tko je od njih povezan s Hrvatskom.' },
      converter: { t: 'Pretvarač jedinica', d: 'km/h u m/s, litre u cm³, kPa u bar i još mnogo toga.' },
      concepts: { t: 'Mozgalice', d: 'Pitanja sa zamkom, zadaci rangiranja i procjene koji otkrivaju najčešće zablude.' }
    },
    tabs: { lesson: 'Lekcija', sim: 'Simulacija', quiz: 'Kviz', practice: 'Zadaci', home: 'Pokus kod kuće' },
    lesson: { keyTerms: 'Ključni pojmovi', formulas: 'Formule', funFact: 'Zanimljivost', markRead: 'Označi kao pročitano', read: 'Lekcija je pročitana', hrTerm: 'engleski' },
    sim: { tryThis: 'Isprobaj', choose: 'Simulacija', missing: 'Ova simulacija nije učitana.', count: 'simulacija', open: 'Otvori simulaciju' },
    quiz: {
      intro: 'pitanja. Odgovori na svako, pročitaj objašnjenje i na kraju pogledaj rezultat.',
      start: 'Započni kviz', question: 'Pitanje', of: 'od', check: 'Provjeri', next: 'Sljedeće pitanje', finish: 'Pogledaj rezultat',
      correct: 'Točno!', wrong: 'Nije točno.', correctAnswer: 'Točan odgovor:', yourScore: 'Tvoj rezultat', retry: 'Pokušaj ponovno', back: 'Natrag na lekciju',
      best: 'Najbolji rezultat', typeMc: 'Odaberi odgovor', typeTf: 'Točno ili netočno?', typeNum: 'Izračunaj', 'true': 'Točno', 'false': 'Netočno',
      placeholder: 'tvoj odgovor', hint: 'Savjet: odgovor biraš tipkama 1–4, a tipkom Enter ideš dalje.',
      perfect: 'Savršeno! Ovu temu stvarno znaš.', great: 'Odlično! Gotovo sve točno.', good: 'Dobar početak. Pročitaj lekciju još jednom i pokušaj ponovno.', again: 'Ne odustaj! Poigraj se simulacijom pa se vrati.',
      pass: 'položeno', toSim: 'Otvori simulaciju'
    },
    home: { materials: 'Trebat će ti', steps: 'Postupak', why: 'Zašto se to događa', safety: 'Sigurnost na prvom mjestu' },
    glossary: { title: 'Pojmovnik', lede: 'Svi ključni pojmovi iz svih tema, na oba jezika.', search: 'Potraži pojam na hrvatskom ili engleskom…', term: 'Hrvatski', croatian: 'Engleski', definition: 'Objašnjenje', topic: 'Tema', none: 'Nijedan pojam ne odgovara pretrazi.' },
    formulas: { title: 'Formule', lede: 'Sve formule na jednom mjestu. Klikni naziv teme i otvorit će se njezina lekcija.' },
    flash: { title: 'Kartice', lede: 'Okreni karticu i pogledaj odgovor. Promiješaj kartice za novi redoslijed.', flip: 'Klikni karticu da je okreneš', next: 'Sljedeća', prev: 'Prethodna', shuffle: 'Promiješaj', mode1: 'Pojam → značenje', mode2: 'Engleski → hrvatski', mode3: 'Hrvatski → engleski', card: 'Kartica', ofAll: 'od', allTopics: 'Sve teme' },
    progress: {
      title: 'Moj napredak', lede: 'Sve se sprema samo u ovom pregledniku.', lessons: 'pročitanih lekcija', quizzes: 'položenih kvizova (70 % ili više)', sims: 'isprobanih simulacija',
      badges: 'Značke', problems: ['riješen zadatak', 'riješena zadatka', 'riješenih zadataka'], problemsCol: 'Zadaci', reset: 'Izbriši sav napredak', resetConfirm: 'Klikni još jednom i sve će se izbrisati', topic: 'Tema', lesson: 'Lekcija', simulation: 'Simulacije', quiz: 'Kviz – najbolji rezultat', notYet: 'još ne', streak: ['dan zaredom s riješenim izazovom', 'dana zaredom s riješenim izazovom', 'dana zaredom s riješenim izazovom'], days: ''
    },
    badges: {
      firstQuiz: { t: 'Prvi kviz', d: 'Završi bilo koji kviz.' },
      perfect: { t: 'Sve točno', d: 'Postigni 100 % u kvizu.' },
      reader: { t: 'Knjiški moljac', d: 'Pročitaj 5 lekcija.' },
      explorer: { t: 'Istraživač', d: 'Isprobaj 10 različitih simulacija.' },
      scientist: { t: 'Mali znanstvenik', d: 'Položi kvizove iz 7 tema.' },
      bilingual: { t: 'Na dva jezika', d: 'Upotrebljavaj aplikaciju na oba jezika.' },
      streak3: { t: 'U nizu', d: 'Riješi dnevni izazov 3 dana zaredom.' },
      master: { t: 'Majstor fizike', d: 'Položi sve kvizove.' },
      solver: { t: 'Rješavač', d: 'Riješi 25 zadataka za vježbu.' },
      hard: { t: 'Tvrd orah', d: 'Riješi težak zadatak (tri zvjezdice).' },
      thinker: { t: 'Mislilac', d: 'Točno riješi 20 mozgalica.' }
    },
    challenge: { title: 'Današnji izazov', lede: 'Svaki dan novo pitanje iz svih tema. Vrati se sutra po sljedeće.', done: 'Današnji izazov je riješen! Vidimo se sutra.', streak: 'Dana zaredom', from: 'Iz teme' },
    mix: { title: 'Miješani kviz', lede: '10 nasumičnih pitanja iz svih tema. Svaki put drukčije.' },
    common: { back: 'Natrag', allTopics: 'Sve teme', theme: 'Prebaci između svijetlog i tamnog izgleda', questions: ['pitanje', 'pitanja', 'pitanja'], sims: ['simulacija', 'simulacije', 'simulacija'], saved: 'Spremljeno', badgeEarned: 'Osvojena značka:', loading: 'Učitavanje…', notFound: 'Ova stranica ne postoji.' },
    practice: {
      title: 'Zadaci za vježbu', lede: 'Svaki zadatak dobiva nove brojeve. Upiši rješenje, provjeri ga i pročitaj postupak korak po korak.',
      ledeMixed: 'Zadaci iz tema koje odabereš, svaki put s novim brojevima. Ispod možeš izraditi radni listić s rješenjima.',
      mixed: 'Miješani zadaci', level: 'Razina', all: 'Sve', l1: 'Lako', l2: 'Srednje', l3: 'Teško',
      newProblem: 'Novi zadatak', check: 'Provjeri', hint: 'Savjet', solution: 'Prikaži rješenje', steps: 'Postupak', next: 'Sljedeći zadatak',
      answer: 'tvoje rješenje', correct: 'Točno!', wrong: 'Nije točno. Pokušaj ponovno.', wrongAgain: 'Još uvijek nije točno. Pogledaj savjet ili rješenje.',
      counted: 'Rješenje je prikazano. U napredak se računaju samo zadaci riješeni bez gledanja rješenja.', solved: 'Riješeno', topics: 'Teme',
      none: 'Za ovaj odabir još nema zadataka.', enterNumber: 'Upiši broj – možeš upotrijebiti decimalni zarez ili decimalnu točku. Odgovor koji odstupa najviše 2 % smatra se točnim.', invalid: 'Upiši broj.',
      summaryTitle: 'Ukratko', misconceptions: 'Česte zablude', myth: 'Mnogi misle', truth: 'Zapravo', worked: 'Riješeni primjer', tryMore: 'Riješi slične zadatke'
    },
    concepts: {
      title: 'Mozgalice', lede: 'Bez kalkulatora – samo razmišljanje. Svako pitanje skriva zabludu koju imaju mnogi. Odaberi odgovor pa pročitaj objašnjenje.',
      forTopic: 'Mozgalice iz ove teme', kind: 'Vrsta', typeMc: 'Konceptualno pitanje', typeRank: 'Zadatak rangiranja', typeNum: 'Procjena',
      rankHint: 'Klikni stavke redom, od prve do posljednje, a zatim provjeri.', undo: 'Poništi', correctOrder: 'Točan redoslijed', estimateHint: 'Dovoljna je procjena: svaki odgovor u razumnom rasponu smatra se točnim.', accepted: 'Prihvaćeni raspon:', misconception: 'Česta zabluda'
    },
    guide: {
      title: 'Kako riješiti zadatak iz fizike (5 koraka)',
      s1t: 'Skiciraj.', s1: 'Nacrtaj skicu, zapiši zadano s jedinicama i podcrtaj što se traži.',
      s2t: 'Pojednostavi.', s2: 'Odluči što možeš zanemariti (zrak, trenje, veličinu tijela) i koji model odgovara.',
      s3t: 'Opiši pojavu.', s3: 'Koje sile djeluju? Koje se energije mijenjaju? Nacrtaj strelice ili graf ako pomaže.',
      s4t: 'Postavi jednadžbu.', s4: 'Odaberi formulu koja povezuje zadane veličine s traženom i preoblikuj je.',
      s5t: 'Izračunaj i provjeri.', s5: 'Uvrsti brojeve s jedinicama, izračunaj i zapitaj se: jesu li iznos i jedinica rezultata razumni?'
    },
    worksheet: {
      title: 'Radni listić', lede: 'Izradi radni listić s novim zadacima za razred ili za sebe. S istim kodom kasnije ponovno dobivaš isti listić.',
      count: 'Broj zadataka', code: 'Kod', generate: 'Izradi listić', showAnswers: 'Prikaži rješenja', hideAnswers: 'Sakrij rješenja', answer: 'Rješenje', pickTopics: 'Najprije gore odaberi barem jednu temu.'
    },
    scientists: {
      title: 'Znanstvenici', lede: 'Ljudi koji stoje iza velikih ideja, od Arhimeda do danas. Označeni su znanstvenici povezani s Hrvatskom.',
      all: 'Svi', croatia: 'Veza s Hrvatskom', known: 'Doprinos', fact: 'Zanimljivost', topics: 'Teme', alive: 'danas', more: 'Pročitaj više', less: 'Sakrij', bc: 'pr. Kr.'
    },
    converter: {
      title: 'Pretvarač jedinica', lede: 'Pretvaraj mjerne jedinice s kojima se susrećeš na nastavi fizike. Upiši vrijednost i odaberi jedinice.',
      category: 'Veličina', value: 'Vrijednost', from: 'Iz', to: 'U', result: 'Rezultat', table: 'Ista vrijednost u svim jedinicama',
      cats: { length: 'Duljina', area: 'Površina', volume: 'Obujam', mass: 'Masa', time: 'Vrijeme', speed: 'Brzina', density: 'Gustoća', pressure: 'Tlak', energy: 'Energija', power: 'Snaga', temperature: 'Temperatura' }
    },
    footer: 'FizLab je besplatan alat za učenje namijenjen znatiželjnoj djeci i njihovim učiteljima. Simulacije se temelje na pravim fizikalnim zakonima, ali veličine na zaslonu nisu uvijek u mjerilu.'
  }
};
