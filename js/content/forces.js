/* FizLab topic: Forces / Sile */
(function () {
  'use strict';
  window.Content.register({
    id: 'forces',
    order: 40,
    gradeLevel: 7,
    color: 'c2',
    title: { en: 'Forces', hr: 'Sile' },
    intro: {
      en: 'Every push and every pull is a force. Learn how forces start, stop and bend the motion of everything around you.',
      hr: 'Svako guranje i svako vučenje je sila. Nauči kako sile pokreću, zaustavljaju i skreću sve oko tebe.'
    },
    sims: ['forces', 'freefall', 'spring', 'forcepairs'],

    lesson: [
      {
        h: { en: 'What is a force?', hr: 'Što je sila?' },
        p: {
          en: [
            'A force is a push or a pull. When you kick a ball, push a door or pull a sled, you are using a force. A force can make something start moving, speed up, slow down, stop, change direction, or change its shape.',
            'Forces are measured in newtons (N), named after Isaac Newton. One newton is roughly the force you need to hold a small apple (about 100 g) in your hand. A device for measuring forces is called a dynamometer, or spring scale.',
            'In diagrams we draw a force as an arrow. The length of the arrow shows how strong the force is, and the direction shows where it pushes or pulls.'
          ],
          hr: [
            'Sila je guranje ili vučenje. Kad udariš loptu, gurneš vrata ili vučeš sanjke, djeluješ silom. Sila može tijelo pokrenuti, ubrzati, usporiti, zaustaviti, promijeniti mu smjer gibanja ili promijeniti njegov oblik.',
            'Silu mjerimo u njutnima (N), prema Isaacu Newtonu. Jedan njutn je otprilike sila kojom u ruci držiš malu jabuku (oko 100 g). Sprava za mjerenje sile zove se dinamometar.',
            'Na crtežima silu prikazujemo strelicom. Duljina strelice pokazuje koliko je sila jaka, a smjer strelice pokazuje kamo sila gura ili vuče.'
          ]
        },
        svg: '<svg viewBox="0 0 420 110" role="img"><defs><marker id="fz-ar1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--c1)"/></marker></defs><rect x="150" y="40" width="80" height="50" rx="6" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="40" y1="65" x2="140" y2="65" stroke="var(--c1)" stroke-width="5" marker-end="url(#fz-ar1)"/><text x="90" y="52" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">F = 20 N</text><line x1="240" y1="65" x2="290" y2="65" stroke="var(--c1)" stroke-width="5" marker-end="url(#fz-ar1)"/><text x="265" y="52" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">F = 10 N</text><line x1="20" y1="90" x2="400" y2="90" stroke="var(--muted)" stroke-width="2"/></svg>'
      },
      {
        h: { en: 'Contact forces and forces at a distance', hr: 'Sile dodirom i sile na daljinu' },
        p: {
          en: [
            'Some forces act only when objects touch: friction when you slide a book on a table, the push of your hand, the elastic force of a stretched rubber band. Others act at a distance, without touching: gravity pulls an apple to the ground before it lands, and a magnet pulls a paperclip from a few centimetres away.',
            'Every force comes from an interaction between two objects. When you push a wall, the wall pushes back on you just as hard. That is why you roll backwards on skates when you push off a wall.'
          ],
          hr: [
            'Neke sile djeluju samo kad se tijela dodiruju: trenje kad guraš knjigu po stolu, pritisak tvoje ruke, elastična sila napete gumice. Druge djeluju na daljinu, bez dodira: sila teža privlači jabuku k tlu prije nego što padne, a magnet privlači spajalicu s nekoliko centimetara udaljenosti.',
            'Svaka sila nastaje međudjelovanjem dvaju tijela. Kad gurneš zid, zid jednako jako gura tebe. Zato se na koturaljkama otkotrljaš unatrag kad se odgurneš od zida.'
          ]
        }
      },
      {
        h: { en: 'Gravity and weight', hr: 'Sila teža i težina' },
        p: {
          en: [
            'Earth pulls every object towards its centre. This pull is called gravity. The force of gravity on an object is its weight. Weight depends on mass: every kilogram is pulled with about 9.81 N (we often round this to 10 N). So a 2 kg bag of flour weighs about 20 N.',
            'Mass and weight are not the same! Mass (in kg) tells how much matter an object contains and is the same everywhere. Weight (in N) is a force and depends on where you are. On the Moon gravity is about 6 times weaker, so the same bag of flour would weigh only about 3 N, but its mass would still be 2 kg.'
          ],
          hr: [
            'Zemlja privlači svako tijelo prema svom središtu. To privlačenje zovemo sila teža. Sila kojom Zemlja privlači tijelo zove se težina tijela. Težina ovisi o masi: svaki kilogram Zemlja privlači silom od oko 9,81 N (često zaokružujemo na 10 N). Vrećica brašna mase 2 kg ima težinu oko 20 N.',
            'Masa i težina nisu isto! Masa (u kg) govori koliko tvari ima u tijelu i jednaka je svugdje. Težina (u N) je sila i ovisi o tome gdje se nalazimo. Na Mjesecu je sila teža oko 6 puta slabija, pa bi ista vrećica brašna imala težinu oko 3 N, ali masa bi joj i dalje bila 2 kg.'
          ]
        }
      },
      {
        h: { en: 'Adding forces', hr: 'Slaganje sila' },
        p: {
          en: [
            'When several forces act on an object, they combine into one resultant force. Two forces in the same direction add up: two friends pushing a box with 30 N each push like one person with 60 N. Two forces in opposite directions partly cancel: 50 N to the right and 30 N to the left give 20 N to the right.',
            'If the forces cancel completely, we say they are balanced. An object with balanced forces does not change its motion: a book lying on a table stays still, and a parachutist with balanced forces falls at a steady speed.'
          ],
          hr: [
            'Kad na tijelo djeluje više sila, one se slažu u jednu rezultantnu silu (rezultantu). Dvije sile istog smjera zbrajamo: dva prijatelja koji guraju kutiju silom od po 30 N guraju kao jedna osoba silom od 60 N. Dvije sile suprotnog smjera djelomično se poništavaju: 50 N udesno i 30 N ulijevo daju 20 N udesno.',
            'Ako se sile potpuno poništavaju, kažemo da su uravnotežene. Tijelo na koje djeluju uravnotežene sile ne mijenja gibanje: knjiga na stolu miruje, a padobranac s uravnoteženim silama pada stalnom brzinom.'
          ]
        },
        svg: '<svg viewBox="0 0 420 120" role="img"><defs><marker id="fz-ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><rect x="170" y="35" width="80" height="50" rx="6" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="260" y1="50" x2="360" y2="50" stroke="var(--c1)" stroke-width="5" marker-end="url(#fz-ar2)"/><text x="310" y="40" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">50 N</text><line x1="160" y1="50" x2="100" y2="50" stroke="var(--c2)" stroke-width="5" marker-end="url(#fz-ar2)"/><text x="130" y="40" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">30 N</text><line x1="210" y1="105" x2="250" y2="105" stroke="var(--c7)" stroke-width="6" marker-end="url(#fz-ar2)"/><text x="300" y="110" text-anchor="start" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">F = 20 N</text></svg>'
      },
      {
        h: { en: 'Friction', hr: 'Trenje' },
        p: {
          en: [
            'Friction is a force that appears when surfaces rub against each other. It always acts against the motion. Friction slows down a sled, but it also lets you walk without slipping and lets a car brake.',
            'Rough surfaces give more friction; smooth or wet surfaces give less. Rolling friction (wheels, ball bearings) is much smaller than sliding friction. That is why the wheel was such a great invention.'
          ],
          hr: [
            'Trenje je sila koja nastaje kad se površine taru jedna o drugu. Uvijek djeluje suprotno gibanju. Trenje usporava sanjke, ali nam i omogućuje da hodamo bez klizanja i da automobil zakoči.',
            'Hrapave površine daju veće trenje, a glatke ili mokre manje. Trenje kotrljanja (kotači, kuglični ležajevi) puno je manje od trenja klizanja. Zato je kotač bio tako velik izum.'
          ]
        }
      },
      {
        h: { en: 'Force, mass and motion', hr: 'Sila, masa i gibanje' },
        p: {
          en: [
            'The bigger the resultant force, the faster an object changes its speed. The bigger its mass, the harder it is to change its motion. Pushing an empty shopping cart with 20 N makes it speed up quickly; the same push on a full cart does much less.',
            'Scientists write this as F = m · a, where a is the acceleration: how quickly the speed changes, measured in metres per second squared (m/s²). A resultant force of 10 N on a 5 kg box gives an acceleration of 2 m/s², so the box gains 2 m/s of speed every second.'
          ],
          hr: [
            'Što je rezultantna sila veća, tijelo brže mijenja brzinu. Što je masa tijela veća, teže mu je promijeniti gibanje. Prazna kolica u trgovini gurnuta silom od 20 N brzo ubrzaju; ista sila na puna kolica postiže mnogo manje.',
            'Fizičari to zapisuju kao F = m · a, gdje je a ubrzanje: koliko se brzo mijenja brzina, mjereno u metrima u sekundi na kvadrat (m/s²). Rezultantna sila od 10 N na kutiju mase 5 kg daje ubrzanje 2 m/s², pa kutija svake sekunde dobije 2 m/s brzine.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'force', hr: 'sila' }, def: { en: 'A push or a pull that can change how an object moves or what shape it has. Unit: newton (N).', hr: 'Guranje ili vučenje koje može promijeniti gibanje ili oblik tijela. Jedinica: njutn (N).' } },
      { term: { en: 'newton (N)', hr: 'njutn (N)' }, def: { en: 'The unit of force. About the weight of a small apple.', hr: 'Mjerna jedinica za silu. Otprilike težina male jabuke.' } },
      { term: { en: 'dynamometer', hr: 'dinamometar' }, def: { en: 'A spring device for measuring force.', hr: 'Sprava s oprugom za mjerenje sile.' } },
      { term: { en: 'gravity', hr: 'sila teža' }, def: { en: 'The force with which Earth pulls everything towards its centre.', hr: 'Sila kojom Zemlja privlači sva tijela prema svom središtu.' } },
      { term: { en: 'weight', hr: 'težina' }, def: { en: 'The force of gravity on an object, measured in newtons. W = m · g.', hr: 'Sila kojom Zemlja privlači tijelo, mjeri se u njutnima. G = m · g.' } },
      { term: { en: 'mass', hr: 'masa' }, def: { en: 'How much matter an object contains, in kilograms. The same everywhere in the universe.', hr: 'Koliko tvari sadrži tijelo, u kilogramima. Jednaka je svugdje u svemiru.' } },
      { term: { en: 'resultant force', hr: 'rezultantna sila (rezultanta)' }, def: { en: 'The single force that has the same effect as all the forces acting together.', hr: 'Jedna sila koja ima isti učinak kao sve sile zajedno.' } },
      { term: { en: 'balanced forces', hr: 'uravnotežene sile' }, def: { en: 'Forces that cancel each other out, so the motion does not change.', hr: 'Sile koje se međusobno poništavaju, pa se gibanje ne mijenja.' } },
      { term: { en: 'friction', hr: 'trenje' }, def: { en: 'A force between touching surfaces that acts against motion.', hr: 'Sila između površina koje se dodiruju, djeluje suprotno gibanju.' } },
      { term: { en: 'elastic force', hr: 'elastična sila' }, def: { en: 'The force a stretched or squeezed spring or rubber band uses to return to its shape.', hr: 'Sila kojom se napeta ili stisnuta opruga ili gumica vraća u svoj oblik.' } },
      { term: { en: 'acceleration', hr: 'ubrzanje' }, def: { en: 'How quickly speed changes, in m/s².', hr: 'Koliko se brzo mijenja brzina, u m/s².' } }
    ],

    formulas: [
      { expr: 'G = m · g', name: { en: 'weight', hr: 'težina' }, note: { en: 'g ≈ 9.81 N/kg on Earth (≈ 10 N/kg for quick sums)', hr: 'g ≈ 9,81 N/kg na Zemlji (≈ 10 N/kg za brzo računanje)' } },
      { expr: 'F = F₁ + F₂', name: { en: 'forces in the same direction', hr: 'sile istog smjera' }, note: { en: 'they add up', hr: 'zbrajaju se' } },
      { expr: 'F = F₁ − F₂', name: { en: 'forces in opposite directions', hr: 'sile suprotnog smjera' }, note: { en: 'the bigger one wins', hr: 'veća pobjeđuje' } },
      { expr: 'F = m · a', name: { en: 'force, mass and acceleration', hr: 'sila, masa i ubrzanje' }, note: { en: 'a in m/s²', hr: 'a u m/s²' } }
    ],

    funFact: {
      en: 'In 1971 astronaut David Scott dropped a hammer and a falcon feather on the Moon at the same time. With no air to slow the feather, both hit the ground together, just as Galileo had predicted 350 years earlier.',
      hr: 'Godine 1971. astronaut David Scott na Mjesecu je istodobno pustio čekić i sokolovo pero. Bez zraka koji bi usporio pero, oboje je palo na tlo u istom trenutku, baš kako je Galileo predvidio 350 godina ranije.'
    },

    experiment: {
      title: { en: 'Build a rubber-band force meter', hr: 'Napravi dinamometar od gumice' },
      materials: {
        en: ['a rubber band', 'a paper clip', 'a ruler or a strip of cardboard', 'sticky tape', 'a small plastic bag', 'coins or marbles', 'a book, a towel and a smooth tray'],
        hr: ['gumica', 'spajalica', 'ravnalo ili traka kartona', 'selotejp', 'mala plastična vrećica', 'kovanice ili kuglice', 'knjiga, ručnik i glatki pladanj']
      },
      steps: {
        en: [
          'Tape one end of the rubber band to the top of the ruler.',
          'Bend the paper clip into a hook and attach it to the free end of the band.',
          'Mark where the hook points when nothing hangs on it. That mark is zero.',
          'Hang the bag on the hook and add coins one at a time. Mark the position of the hook after each coin.',
          'Look at your marks: equal coins stretch the band by equal steps. You have made a force scale!',
          'Now tie the band to a book and pull it along the table, a towel and a smooth tray. Where does the band stretch the most? That surface has the most friction.'
        ],
        hr: [
          'Selotejpom pričvrsti jedan kraj gumice na vrh ravnala.',
          'Spajalicu savij u kukicu i zakvači je na slobodni kraj gumice.',
          'Označi gdje kukica pokazuje kad ništa ne visi. To je nula.',
          'Zakvači vrećicu na kukicu i dodaj kovanice jednu po jednu. Nakon svake kovanice označi položaj kukice.',
          'Pogledaj oznake: jednake kovanice produljuju gumicu za jednake korake. Napravio si mjerač sile!',
          'Sad gumicu zaveži za knjigu i vuci je po stolu, po ručniku i po glatkom pladnju. Gdje se gumica najviše produlji? Ta površina ima najveće trenje.'
        ]
      },
      explain: {
        en: 'A stretched rubber band pulls back with an elastic force. The more it stretches, the bigger the force, so the stretch tells you how big the force is. Real dynamometers work the same way, with a metal spring instead of a band.',
        hr: 'Napeta gumica vraća se elastičnom silom. Što je više napeta, sila je veća, pa produljenje pokazuje kolika je sila. Pravi dinamometri rade na isti način, s metalnom oprugom umjesto gumice.'
      },
      safety: { en: 'Do not overstretch the band: it can snap and hit your eye.', hr: 'Ne napinji gumicu previše: može puknuti i udariti te u oko.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What is the unit of force?', hr: 'Koja je mjerna jedinica za silu?' },
        options: [{ en: 'kilogram', hr: 'kilogram' }, { en: 'metre', hr: 'metar' }, { en: 'joule', hr: 'džul' }, { en: 'newton', hr: 'njutn' }], answer: 3,
        explain: { en: 'Force is measured in newtons (N), named after Isaac Newton. The kilogram measures mass, the metre length and the joule energy.', hr: 'Silu mjerimo u njutnima (N), prema Isaacu Newtonu. Kilogramom mjerimo masu, metrom duljinu, a džulom energiju.' } },
      { type: 'mc', q: { en: 'Which of these forces acts at a distance, without touching?', hr: 'Koja od ovih sila djeluje na daljinu, bez dodira?' },
        options: [{ en: 'friction', hr: 'trenje' }, { en: 'the push of a hand', hr: 'pritisak ruke' }, { en: 'gravity', hr: 'sila teža' }, { en: 'the elastic force of a rubber band', hr: 'elastična sila gumice' }], answer: 2,
        explain: { en: 'Gravity (and magnetic force) act without contact. Friction, a push and an elastic force need the objects to touch.', hr: 'Sila teža (i magnetska sila) djeluju bez dodira. Trenje, guranje i elastična sila trebaju dodir tijela.' } },
      { type: 'num', q: { en: 'A bag has a mass of 3 kg. What is its weight on Earth? Use g = 10 N/kg.', hr: 'Torba ima masu 3 kg. Kolika je njezina težina na Zemlji? Uzmi g = 10 N/kg.' },
        answer: 30, tolerance: 0.5, unit: 'N',
        explain: { en: 'Weight = mass × g = 3 kg × 10 N/kg = 30 N.', hr: 'Težina = masa × g = 3 kg × 10 N/kg = 30 N.' } },
      { type: 'mc', q: { en: 'Two children push a box in the same direction with 40 N and 25 N. What is the resultant force?', hr: 'Dvoje djece gura kutiju u istom smjeru silama 40 N i 25 N. Kolika je rezultanta?' },
        options: [{ en: '15 N', hr: '15 N' }, { en: '40 N', hr: '40 N' }, { en: '65 N', hr: '65 N' }, { en: '1000 N', hr: '1000 N' }], answer: 2,
        explain: { en: 'Forces in the same direction add up: 40 N + 25 N = 65 N.', hr: 'Sile istog smjera zbrajamo: 40 N + 25 N = 65 N.' } },
      { type: 'mc', q: { en: 'A rope is pulled with 80 N to the left and 50 N to the right. The resultant force is…', hr: 'Uže se vuče silom 80 N ulijevo i 50 N udesno. Rezultanta je…' },
        options: [{ en: '130 N to the left', hr: '130 N ulijevo' }, { en: '30 N to the left', hr: '30 N ulijevo' }, { en: '30 N to the right', hr: '30 N udesno' }, { en: 'zero', hr: 'nula' }], answer: 1,
        explain: { en: 'Opposite forces partly cancel: 80 N − 50 N = 30 N, in the direction of the bigger force (left).', hr: 'Suprotne sile djelomično se poništavaju: 80 N − 50 N = 30 N, u smjeru veće sile (ulijevo).' } },
      { type: 'tf', q: { en: 'Your mass would be smaller on the Moon than on Earth.', hr: 'Tvoja masa bila bi manja na Mjesecu nego na Zemlji.' }, answer: false,
        explain: { en: 'Mass is the same everywhere. Your weight (the force of gravity) would be about 6 times smaller on the Moon.', hr: 'Masa je svugdje jednaka. Tvoja težina (sila teža) bila bi na Mjesecu oko 6 puta manja.' } },
      { type: 'mc', q: { en: 'Which device measures force?', hr: 'Kojom spravom mjerimo silu?' },
        options: [{ en: 'dynamometer', hr: 'dinamometar' }, { en: 'thermometer', hr: 'termometar' }, { en: 'stopwatch', hr: 'štoperica' }, { en: 'ruler', hr: 'ravnalo' }], answer: 0,
        explain: { en: 'A dynamometer (spring scale) measures force by how far its spring stretches.', hr: 'Dinamometar mjeri silu po tome koliko se njegova opruga produlji.' } },
      { type: 'tf', q: { en: 'Friction always acts against the direction of motion.', hr: 'Trenje uvijek djeluje suprotno smjeru gibanja.' }, answer: true,
        explain: { en: 'Friction opposes sliding. That is why things slow down and stop when we stop pushing.', hr: 'Trenje se suprotstavlja klizanju. Zato se tijela usporavaju i stanu kad ih prestanemo gurati.' } },
      { type: 'mc', q: { en: 'A book lies still on a table. Which statement is true?', hr: 'Knjiga miruje na stolu. Što je točno?' },
        options: [{ en: 'No forces act on it.', hr: 'Na nju ne djeluje nikakva sila.' }, { en: 'The forces on it are balanced.', hr: 'Sile na nju su uravnotežene.' }, { en: 'Gravity is bigger than the push of the table.', hr: 'Sila teža veća je od sile stola.' }, { en: 'The table pushes harder than gravity pulls.', hr: 'Stol gura jače nego što sila teža vuče.' }], answer: 1,
        explain: { en: 'Gravity pulls the book down and the table pushes it up with an equal force. Balanced forces: no change in motion.', hr: 'Sila teža vuče knjigu prema dolje, a stol je gura prema gore jednakom silom. Uravnotežene sile: gibanje se ne mijenja.' } },
      { type: 'mc', q: { en: 'Where is the friction the smallest?', hr: 'Gdje je trenje najmanje?' },
        options: [{ en: 'dragging a box over a carpet', hr: 'vučenje kutije po tepihu' }, { en: 'sliding a box over wet tiles', hr: 'klizanje kutije po mokrim pločicama' }, { en: 'rolling a box on a cart with wheels', hr: 'vožnja kutije na kolicima s kotačima' }, { en: 'pushing a box over sand', hr: 'guranje kutije po pijesku' }], answer: 2,
        explain: { en: 'Rolling friction is much smaller than sliding friction, so wheels make moving heavy things easy.', hr: 'Trenje kotrljanja puno je manje od trenja klizanja, zato kotači olakšavaju premještanje teških stvari.' } },
      { type: 'num', q: { en: 'A 5 kg box is pushed with a resultant force of 10 N. What is its acceleration (a = F / m)?', hr: 'Kutiju mase 5 kg guramo rezultantnom silom od 10 N. Koliko je njezino ubrzanje (a = F / m)?' },
        answer: 2, tolerance: 0.1, unit: 'm/s²',
        explain: { en: 'a = F / m = 10 N / 5 kg = 2 m/s². The box gains 2 m/s of speed every second.', hr: 'a = F / m = 10 N / 5 kg = 2 m/s². Kutija svake sekunde dobije 2 m/s brzine.' } },
      { type: 'mc', q: { en: 'What does the length of a force arrow in a diagram show?', hr: 'Što pokazuje duljina strelice sile na crtežu?' },
        options: [{ en: 'the mass of the object', hr: 'masu tijela' }, { en: 'only the direction of the force', hr: 'samo smjer sile' }, { en: 'the speed of the object', hr: 'brzinu tijela' }, { en: 'how strong the force is', hr: 'koliko je sila jaka' }], answer: 3,
        explain: { en: 'A longer arrow means a bigger force. The direction of the arrow shows the direction of the force.', hr: 'Dulja strelica znači veću silu. Smjer strelice pokazuje smjer sile.' } }
    ]
  });
})();
