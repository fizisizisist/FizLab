/* FizLab topic: Levers and Simple Machines / Poluga i jednostavni strojevi */
(function () {
  'use strict';
  window.Content.register({
    id: 'levers',
    order: 70,
    gradeLevel: 7,
    color: 'c6',
    title: { en: 'Levers and Simple Machines', hr: 'Poluga i jednostavni strojevi' },
    intro: {
      en: 'Give me a place to stand and I will move the Earth, said Archimedes. With a lever, a ramp or a pulley you can lift what your muscles alone never could.',
      hr: 'Dajte mi oslonac i pomaknut ću Zemlju, rekao je Arhimed. Polugom, kosinom ili koloturnikom možeš podići ono što tvoji mišići sami nikad ne bi mogli.'
    },
    sims: ['lever'],

    lesson: [
      {
        h: { en: 'What is a lever?', hr: 'Što je poluga?' },
        p: {
          en: [
            'Try lifting a big rock with your bare hands: impossible. Now slide a long stick under it, rest the stick on a small stone and push down on the far end. The rock rises. You have used a lever, one of the oldest tools of humankind. A lever is a stiff bar that turns around a fixed point called the fulcrum or pivot.',
            'Three things matter on every lever: the fulcrum, the force you apply (the effort) and the force you work against (the load, for example the weight of the rock). The distance from the fulcrum to the point where a force acts is called its arm. A longer arm for your effort means you need less force to do the same job.'
          ],
          hr: [
            'Pokušaj golim rukama podići veliki kamen: nemoguće. Sad podvuci dugačku motku pod njega, osloni je na mali kamen i pritisni daleki kraj prema dolje. Kamen se diže. Upotrijebio si polugu, jedan od najstarijih ljudskih alata. Poluga je kruta šipka koja se okreće oko čvrste točke koju zovemo oslonac ili os poluge.',
            'Na svakoj polugi važne su tri stvari: oslonac, sila kojom djelujemo i sila protiv koje radimo (teret, na primjer težina kamena). Udaljenost od oslonca do mjesta na kojem sila djeluje zove se krak sile. Dulji krak za tvoju silu znači da ti za isti posao treba manja sila.'
          ]
        }
      },
      {
        h: { en: 'The law of the lever', hr: 'Zakon poluge' },
        p: {
          en: [
            'How strongly a force turns a lever depends on two things: how big the force is and how far from the fulcrum it acts. Their product is called the moment of the force, or torque: M = F · d, measured in newton-metres (N·m). Pushing a door near the hinge is hard; pushing at the handle, far from the hinge, is easy, because the same force makes a bigger moment.',
            'A lever is balanced when the moment turning it one way equals the moment turning it the other way: F₁ · d₁ = F₂ · d₂. Think of a seesaw. A child weighing 300 N who sits 2 m from the middle makes a moment of 600 N·m. A heavier friend weighing 600 N must sit only 1 m from the middle to balance: 600 N · 1 m = 600 N·m. Lighter child, longer arm.',
            'Archimedes used this law to explain how a small force can beat a big one: give it a long enough arm. To lift a 1000 N rock with a 200 N push, the arm of your effort must be five times longer than the arm of the load. That is where his famous boast about moving the Earth comes from.'
          ],
          hr: [
            'Koliko jako sila okreće polugu ovisi o dvije stvari: koliko je sila velika i koliko daleko od oslonca djeluje. Njihov umnožak zove se moment sile: M = F · d, a mjerimo ga u njutnmetrima (N·m). Gurati vrata blizu šarki je teško, a gurati ih za kvaku, daleko od šarki, lako, jer ista sila daje veći moment.',
            'Poluga je u ravnoteži kad je moment koji je okreće na jednu stranu jednak momentu koji je okreće na drugu stranu: F₁ · d₁ = F₂ · d₂. Zamisli klackalicu. Dijete težine 300 N koje sjedi 2 m od sredine stvara moment od 600 N·m. Teži prijatelj težine 600 N mora sjesti samo 1 m od sredine da bi je uravnotežio: 600 N · 1 m = 600 N·m. Lakše dijete, dulji krak.',
            'Arhimed je tim zakonom objasnio kako mala sila može pobijediti veliku: daj joj dovoljno dug krak. Da kamen težine 1000 N podigneš silom od 200 N, krak tvoje sile mora biti pet puta dulji od kraka tereta. Odatle njegova slavna rečenica o pomicanju Zemlje.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><defs><marker id="lv-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--c6)"/></marker></defs><polygon points="210,80 195,115 225,115" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><rect x="30" y="74" width="360" height="8" rx="3" fill="var(--fg)"/><rect x="40" y="40" width="30" height="34" rx="3" fill="var(--c6)" stroke="var(--fg)" stroke-width="2"/><rect x="290" y="30" width="44" height="44" rx="3" fill="var(--c2)" stroke="var(--fg)" stroke-width="2"/><text x="55" y="32" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">300 N</text><text x="312" y="22" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">600 N</text><line x1="55" y1="100" x2="210" y2="100" stroke="var(--muted)" stroke-width="2"/><line x1="210" y1="100" x2="312" y2="100" stroke="var(--muted)" stroke-width="2"/><line x1="55" y1="94" x2="55" y2="106" stroke="var(--muted)" stroke-width="2"/><line x1="312" y1="94" x2="312" y2="106" stroke="var(--muted)" stroke-width="2"/><text x="132" y="128" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">2 m</text><text x="261" y="128" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">1 m</text></svg>'
      },
      {
        h: { en: 'Levers all around us', hr: 'Poluge oko nas' },
        p: {
          en: [
            'Look for the fulcrum and you will find levers everywhere. In a crowbar, scissors, pliers and a seesaw the fulcrum sits between the effort and the load. Long handles and short jaws give pliers their crushing grip. In a wheelbarrow, a bottle opener and a nutcracker the load sits between the fulcrum and the effort: the wheel is the fulcrum, the heavy sand is in the middle and you lift at the long handles, so a small force moves a big load.',
            'In tweezers, a fishing rod, a broom and your own forearm the effort is between the fulcrum and the load. Your elbow is the fulcrum, the biceps pulls just a few centimetres from it, and the load is far away in your hand. These levers do not save force, they cost force, but they give speed and reach: a small movement of the muscle swings the hand through a big arc.',
            'The equal-arm balance, the classic scales of a market or a pharmacy, is a lever with two arms of exactly the same length. When the pans balance, the moments are equal, and since the arms are equal, the masses on both sides must be equal too. That is how masses were compared for thousands of years.'
          ],
          hr: [
            'Potraži oslonac i naći ćeš poluge posvuda. Kod poluge za podizanje (pajsera), škara, kliješta i klackalice oslonac je između sile i tereta. Duge ručke i kratke čeljusti daju kliještima snažan stisak. Kod tačaka, otvarača za boce i krckalice za orahe teret je između oslonca i sile: kotač je oslonac, teški pijesak je u sredini, a ti dižeš za dugačke ručke, pa malom silom pomičeš velik teret.',
            'Kod pincete, štapa za pecanje, metle i tvoje vlastite podlaktice sila je između oslonca i tereta. Lakat je oslonac, biceps vuče samo nekoliko centimetara od njega, a teret je daleko, u šaci. Takve poluge ne štede silu, nego je troše, ali daju brzinu i doseg: mali pomak mišića zamahne šakom po velikom luku.',
            'Vaga s jednakim krakovima, klasična vaga s tržnice ili iz ljekarne, poluga je s dva kraka točno iste duljine. Kad su zdjelice u ravnoteži, momenti su jednaki, a budući da su krakovi jednaki, i mase na objema stranama moraju biti jednake. Tako su se mase uspoređivale tisućama godina.'
          ]
        }
      },
      {
        h: { en: 'The inclined plane and the screw', hr: 'Kosina i vijak' },
        p: {
          en: [
            'A ramp is a simple machine too. Lifting a 500 N box straight up onto a truck bed 1 m high takes 500 N. Pushing it up a 5 m long ramp takes only about 100 N (ignoring friction), one fifth of the force, because the ramp is five times longer than it is high. The gentler the slope, the smaller the force and the longer the push. Mountain roads zigzag for exactly this reason.',
            'A screw is a ramp wrapped around a cylinder. Each turn of the screwdriver moves the screw into the wood only a tiny bit, but with a huge force. A wedge, like the blade of an axe, is two ramps back to back: a downward blow becomes a sideways force that splits the log apart.'
          ],
          hr: [
            'I kosina (rampa) je jednostavan stroj. Da kutiju težine 500 N podigneš ravno uvis na kamion visok 1 m, treba ti 500 N. Da je guraš uz kosinu dugu 5 m, treba ti samo oko 100 N (bez trenja), petina sile, jer je kosina pet puta dulja nego što je visoka. Što je nagib blaži, sila je manja, a guranje dulje. Planinske ceste vijugaju upravo zbog toga.',
            'Vijak je kosina namotana oko valjka. Svaki okret odvijača pomakne vijak u drvo samo malo, ali golemom silom, pa vijak drži puno čvršće od čavla. Klin, poput oštrice sjekire, dvije su kosine spojene leđima: udarac prema dolje pretvara se u bočnu silu koja cijepa cjepanicu.'
          ]
        }
      },
      {
        h: { en: 'Pulleys', hr: 'Kolotur i koloturnik' },
        p: {
          en: [
            'A pulley is a wheel with a rope running over it. A fixed pulley, attached to a beam, does not reduce the force: you still pull with the full weight of the load. But it changes the direction: you pull down and the bucket goes up, and you can use your own weight to help. A flagpole and a well use fixed pulleys.',
            'A movable pulley hangs on the rope and moves together with the load. Now two sections of rope hold the load, so each carries half: you pull with half the force. Combine several pulleys into a block and tackle and the force divides again and again. Cranes lift tonnes with a thin cable this way. The price, as always: to lift the load 1 m with half the force, you must pull in 2 m of rope.'
          ],
          hr: [
            'Kolotura je kotač preko kojeg prelazi uže. Nepomična kolotura, pričvršćen za gredu, ne smanjuje silu: i dalje vučeš punom težinom tereta. Ali mijenja smjer: ti vučeš prema dolje, a kanta ide gore, pa si možeš pomoći vlastitom težinom. Jarbol za zastavu i bunar koriste nepomična kolotura.',
            'Pomična kolotura visi na užetu i giba se zajedno s teretom. Sad teret drže dva dijela užeta, pa svaki nosi polovicu: vučeš upola manjom silom. Spoji više kolotura u koloturnik i sila se dijeli iznova i iznova. Dizalice tako dižu tone tankim čeličnim užetom. Cijena, kao i uvijek: da teret podigneš 1 m upola manjom silom, moraš povući 2 m užeta.'
          ]
        }
      },
      {
        h: { en: 'The golden rule of mechanics', hr: 'Zlatno pravilo mehanike' },
        p: {
          en: [
            'Every simple machine seems to give you something for nothing, but it never does. The lever, the ramp and the pulley all trade force for distance. When you halve the force, you double the distance you have to move. Physicists call the product of force and distance work: W = F · s, measured in joules (J). The work you put in equals the work you get out, or a little more because of friction.',
            'This is the golden rule of mechanics: what you gain in force, you lose in distance. A machine cannot create work; it only lets weak muscles spread the same work over a longer path. A car jack lifts a car with one hand, but you have to turn the handle a hundred times. Check it on your own lever: push down 20 cm with 100 N and the 400 N load on the other side rises only 5 cm.'
          ],
          hr: [
            'Svaki jednostavni stroj kao da ti daje nešto za ništa, ali nikad ne daje. Poluga, kosina i koloturnik mijenjaju silu za put. Kad silu prepoloviš, udvostručiš put koji moraš prijeći. Fizičari umnožak sile i puta zovu rad: W = F · s, mjeri se u džulima (J). Rad koji uložiš jednak je radu koji dobiješ, ili malo veći zbog trenja.',
            'To je zlatno pravilo mehanike: koliko dobiješ na sili, toliko izgubiš na putu. Stroj ne može stvoriti rad; on samo omogućuje slabim mišićima da isti rad rasporede na dulji put. Dizalica za automobil podiže auto jednom rukom, ali ručicu moraš okrenuti sto puta. Provjeri na vlastitoj polugi: pritisni 20 cm prema dolje silom 100 N i teret od 400 N na drugoj strani podigne se samo 5 cm.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'lever', hr: 'poluga' }, def: { en: 'A stiff bar that turns around a fixed point and lets a small force move a big load.', hr: 'Kruta šipka koja se okreće oko čvrste točke i omogućuje da mala sila pomakne velik teret.' } },
      { term: { en: 'fulcrum (pivot)', hr: 'oslonac (os poluge)' }, def: { en: 'The fixed point a lever turns around.', hr: 'Čvrsta točka oko koje se poluga okreće.' } },
      { term: { en: 'arm of a force', hr: 'krak sile' }, def: { en: 'The distance from the fulcrum to the point where the force acts.', hr: 'Udaljenost od oslonca do mjesta na kojem sila djeluje.' } },
      { term: { en: 'load', hr: 'teret' }, def: { en: 'The force a machine works against, for example the weight of the object being lifted.', hr: 'Sila protiv koje stroj radi, na primjer težina tijela koje dižemo.' } },
      { term: { en: 'moment of a force (torque)', hr: 'moment sile' }, def: { en: 'How strongly a force turns a lever: M = F · d. Unit: newton-metre (N·m).', hr: 'Koliko jako sila okreće polugu: M = F · d. Jedinica: njutnmetar (N·m).' } },
      { term: { en: 'law of the lever', hr: 'zakon poluge' }, def: { en: 'A lever is balanced when F₁ · d₁ = F₂ · d₂: the moments on both sides are equal.', hr: 'Poluga je u ravnoteži kad je F₁ · d₁ = F₂ · d₂: momenti na obje strane su jednaki.' } },
      { term: { en: 'equal-arm balance', hr: 'vaga s jednakim krakovima' }, def: { en: 'A lever with two equal arms used to compare masses.', hr: 'Poluga s dva jednaka kraka kojom uspoređujemo mase.' } },
      { term: { en: 'inclined plane (ramp)', hr: 'kosina' }, def: { en: 'A sloping surface that lets you lift a load with less force over a longer path.', hr: 'Nagnuta ploha koja omogućuje da teret podigneš manjom silom na duljem putu.' } },
      { term: { en: 'screw', hr: 'vijak' }, def: { en: 'A ramp wrapped around a cylinder; many turns, tiny movement, huge force.', hr: 'Kosina namotana oko valjka; mnogo okreta, malen pomak, golema sila.' } },
      { term: { en: 'fixed pulley', hr: 'nepomična kolotura' }, def: { en: 'A wheel with a rope, fixed to a beam. It changes the direction of the force but not its size.', hr: 'Kotač s užetom pričvršćen za gredu. Mijenja smjer sile, ali ne i njezin iznos.' } },
      { term: { en: 'movable pulley', hr: 'pomična kolotura' }, def: { en: 'A pulley that hangs on the rope and moves with the load. It halves the force needed.', hr: 'Kolotur koji visi na užetu i giba se s teretom. Upola smanjuje potrebnu silu.' } },
      { term: { en: 'work', hr: 'rad' }, def: { en: 'Force times the distance moved: W = F · s, in joules (J). Machines cannot create it.', hr: 'Sila puta prijeđeni put: W = F · s, u džulima (J). Strojevi ga ne mogu stvoriti.' } }
    ],

    formulas: [
      { expr: 'M = F · d', name: { en: 'moment of a force', hr: 'moment sile' }, note: { en: 'force times its arm, in N·m', hr: 'sila puta njezin krak, u N·m' } },
      { expr: 'F₁ · d₁ = F₂ · d₂', name: { en: 'law of the lever', hr: 'zakon poluge' }, note: { en: 'balance: equal moments on both sides', hr: 'ravnoteža: jednaki momenti na obje strane' } },
      { expr: 'F = G / 2', name: { en: 'movable pulley', hr: 'pomična kolotura' }, note: { en: 'half the weight of the load, but twice the rope', hr: 'polovica težine tereta, ali dvostruko više užeta' } },
      { expr: 'W = F · s', name: { en: 'work', hr: 'rad' }, note: { en: 'stays the same for every simple machine', hr: 'ostaje isti kod svakog jednostavnog stroja' } }
    ],

    funFact: {
      en: 'According to the ancient writer Plutarch, Archimedes once used a system of levers and pulleys to drag a fully loaded ship across the beach by himself, pulling on a single rope while sitting down.',
      hr: 'Prema antičkom piscu Plutarhu, Arhimed je jednom sustavom poluga i kolotura sam izvukao potpuno natovaren brod na obalu, vukući jedno jedino uže dok je sjedio.'
    },

    experiment: {
      title: { en: 'A ruler lever: check the law of the lever with coins', hr: 'Poluga od ravnala: provjeri zakon poluge kovanicama' },
      materials: {
        en: ['a 30 cm ruler', 'a round pencil or a thick marker', 'about 10 identical coins', 'a flat table', 'paper and a pencil for a table of results'],
        hr: ['ravnalo od 30 cm', 'okrugla olovka ili deblji flomaster', 'oko 10 jednakih kovanica', 'ravan stol', 'papir i olovka za tablicu rezultata']
      },
      steps: {
        en: [
          'Lay the pencil on the table and rest the ruler across it at the 15 cm mark. Shift it until the ruler balances level on its own: the pencil is now the fulcrum.',
          'Put 2 coins on the left side, 6 cm from the pencil. The ruler tips.',
          'Put 1 coin on the right side and slide it until the ruler balances again. Measure its distance from the pencil. It should be about 12 cm.',
          'Write both sides down: 2 coins × 6 cm = 12, and 1 coin × 12 cm = 12. Equal!',
          'Try 3 coins at 4 cm on the left. Predict where 1 coin must go on the right, then test it.',
          'Try 4 coins at 3 cm, then 2 coins at 9 cm against 3 coins. Each time, multiply coins by distance on both sides and compare.',
          'Finally stack 6 coins at 2 cm and lift them with just 1 coin at 12 cm. A small force with a long arm wins.'
        ],
        hr: [
          'Položi olovku na stol i preko nje stavi ravnalo na oznaci 15 cm. Pomiči ga dok ravnalo samo ne stane vodoravno: olovka je sad oslonac.',
          'Stavi 2 kovanice na lijevu stranu, 6 cm od olovke. Ravnalo se nagne.',
          'Stavi 1 kovanicu na desnu stranu i pomiči je dok ravnalo ponovno ne bude u ravnoteži. Izmjeri njezinu udaljenost od olovke. Trebala bi biti oko 12 cm.',
          'Zapiši obje strane: 2 kovanice × 6 cm = 12, a 1 kovanica × 12 cm = 12. Jednako!',
          'Pokušaj s 3 kovanice na 4 cm slijeva. Predvidi kamo mora doći 1 kovanica zdesna, pa provjeri.',
          'Pokušaj s 4 kovanice na 3 cm, zatim 2 kovanice na 9 cm protiv 3 kovanice. Svaki put pomnoži broj kovanica i udaljenost na obje strane i usporedi.',
          'Na kraju složi 6 kovanica na 2 cm i podigni ih samo 1 kovanicom na 12 cm. Mala sila s dugim krakom pobjeđuje.'
        ]
      },
      explain: {
        en: 'Every coin has the same weight, so the number of coins stands for the force, and the distance from the pencil is the arm. The ruler balances exactly when coins × distance is the same on both sides: that is the law of the lever, F₁ · d₁ = F₂ · d₂. You balance the empty ruler first so that its own weight does not spoil the result.',
        hr: 'Svaka kovanica ima istu težinu, pa broj kovanica predstavlja silu, a udaljenost od olovke je krak. Ravnalo je u ravnoteži točno onda kad je umnožak broja kovanica i udaljenosti jednak na obje strane: to je zakon poluge, F₁ · d₁ = F₂ · d₂. Prazno ravnalo najprije uravnotežiš da njegova vlastita težina ne pokvari rezultat.'
      }
    },

    quiz: [
      { type: 'mc', q: { en: 'What do we call the fixed point a lever turns around?', hr: 'Kako zovemo čvrstu točku oko koje se poluga okreće?' },
        options: [{ en: 'the load', hr: 'teret' }, { en: 'the fulcrum', hr: 'oslonac (os)' }, { en: 'the arm', hr: 'krak' }, { en: 'the effort', hr: 'sila' }], answer: 1,
        explain: { en: 'The fulcrum is the pivot. The arm is the distance from the fulcrum to a force; the load and the effort are the two forces.', hr: 'Oslonac je točka okretanja. Krak je udaljenost od oslonca do sile; teret i sila kojom djelujemo dvije su sile na polugi.' } },
      { type: 'mc', q: { en: 'What is the unit of the moment of a force?', hr: 'Koja je jedinica momenta sile?' },
        options: [{ en: 'newton (N)', hr: 'njutn (N)' }, { en: 'joule (J)', hr: 'džul (J)' }, { en: 'newton-metre (N·m)', hr: 'njutnmetar (N·m)' }, { en: 'metre (m)', hr: 'metar (m)' }], answer: 2,
        explain: { en: 'M = F · d, force in newtons times distance in metres, so the unit is the newton-metre.', hr: 'M = F · d, sila u njutnima puta udaljenost u metrima, pa je jedinica njutnmetar.' } },
      { type: 'num', q: { en: 'A child weighing 400 N sits 1.5 m from the middle of a seesaw. How far from the middle must a friend weighing 500 N sit to balance it?', hr: 'Dijete težine 400 N sjedi 1,5 m od sredine klackalice. Koliko daleko od sredine mora sjesti prijatelj težine 500 N da bi je uravnotežio?' },
        answer: 1.2, tolerance: 0.05, unit: 'm',
        explain: { en: 'F₁ · d₁ = F₂ · d₂: 400 N × 1.5 m = 600 N·m, so d₂ = 600 N·m / 500 N = 1.2 m.', hr: 'F₁ · d₁ = F₂ · d₂: 400 N × 1,5 m = 600 N·m, pa je d₂ = 600 N·m / 500 N = 1,2 m.' } },
      { type: 'mc', q: { en: 'Where should you push a heavy door to open it most easily?', hr: 'Gdje trebaš gurnuti teška vrata da ih najlakše otvoriš?' },
        options: [{ en: 'near the hinges', hr: 'blizu šarki' }, { en: 'in the middle of the door', hr: 'na sredini vrata' }, { en: 'it makes no difference', hr: 'nema razlike' }, { en: 'at the handle, far from the hinges', hr: 'za kvaku, daleko od šarki' }], answer: 3,
        explain: { en: 'The hinges are the fulcrum. The farther from them you push, the longer the arm and the bigger the moment for the same force.', hr: 'Šarke su oslonac. Što dalje od njih guraš, krak je dulji, a moment za istu silu veći.' } },
      { type: 'tf', q: { en: 'A fixed pulley halves the force needed to lift a load.', hr: 'Nepomična kolotura upola smanjuje silu potrebnu za podizanje tereta.' }, answer: false,
        explain: { en: 'A fixed pulley only changes the direction of the pull. It is the movable pulley that halves the force.', hr: 'Nepomična kolotura samo mijenja smjer sile. Pomična kolotura je taj koji upola smanjuje silu.' } },
      { type: 'mc', q: { en: 'In a wheelbarrow, where is the fulcrum?', hr: 'Gdje je oslonac kod tačaka?' },
        options: [{ en: 'at the handles', hr: 'na ručkama' }, { en: 'in the load', hr: 'u teretu' }, { en: 'at the wheel', hr: 'na kotaču' }, { en: 'in your hands', hr: 'u tvojim rukama' }], answer: 2,
        explain: { en: 'The wheelbarrow turns around its wheel. The load sits between the wheel and your hands, so a small lift at the long handles moves a heavy load.', hr: 'Tačke se okreću oko kotača. Teret je između kotača i tvojih ruku, pa malo podizanje na dugim ručkama pomiče težak teret.' } },
      { type: 'mc', q: { en: 'In which of these levers is the effort between the fulcrum and the load?', hr: 'Kod koje je od ovih poluga sila između oslonca i tereta?' },
        options: [{ en: 'tweezers', hr: 'pinceta' }, { en: 'scissors', hr: 'škare' }, { en: 'a crowbar', hr: 'poluga za podizanje (pajser)' }, { en: 'a bottle opener', hr: 'otvarač za boce' }], answer: 0,
        explain: { en: 'In tweezers you squeeze between the joined end (fulcrum) and the tips (load). Scissors and a crowbar have the fulcrum in the middle; a bottle opener has the load in the middle.', hr: 'Kod pincete stišćeš između spojenog kraja (oslonca) i vrhova (tereta). Škare i pajser imaju oslonac u sredini, a otvarač za boce teret u sredini.' } },
      { type: 'tf', q: { en: 'A ramp lets you lift a load with a smaller force, but you have to push it over a longer path.', hr: 'Kosina omogućuje da teret podigneš manjom silom, ali ga moraš gurati duljim putem.' }, answer: true,
        explain: { en: 'The gentler the ramp, the smaller the force and the longer the path. The work, force times distance, stays the same.', hr: 'Što je kosina blaža, sila je manja, a put dulji. Rad, sila puta put, ostaje isti.' } },
      { type: 'num', q: { en: 'A bucket weighing 240 N hangs on a movable pulley. Ignoring friction and the weight of the pulley, how much force do you need to hold it?', hr: 'Kanta težine 240 N visi na pomičnoj koloturi. Ako zanemarimo trenje i težinu koloture, kolikom je silom moraš držati?' },
        answer: 120, tolerance: 1, unit: 'N',
        explain: { en: 'Two sections of rope hold the load, each carrying half: 240 N / 2 = 120 N.', hr: 'Teret drže dva dijela užeta, svaki nosi polovicu: 240 N / 2 = 120 N.' } },
      { type: 'mc', q: { en: 'What does the golden rule of mechanics say?', hr: 'Što kaže zlatno pravilo mehanike?' },
        options: [{ en: 'machines create extra work', hr: 'strojevi stvaraju dodatni rad' }, { en: 'what you gain in force, you lose in distance', hr: 'koliko dobiješ na sili, toliko izgubiš na putu' }, { en: 'a longer lever always needs more force', hr: 'dulja poluga uvijek treba veću silu' }, { en: 'pulleys only change the direction of a force', hr: 'koloture samo mijenjaju smjer sile' }], answer: 1,
        explain: { en: 'No machine creates work. A smaller force must act over a longer distance, so force times distance stays the same.', hr: 'Nijedan stroj ne stvara rad. Manja sila mora djelovati na duljem putu, pa umnožak sile i puta ostaje isti.' } },
      { type: 'mc', q: { en: 'You push a lever down with 100 N at 40 cm from the fulcrum. The load is 10 cm from the fulcrum. What is the heaviest load you can lift?', hr: 'Polugu pritišćeš silom 100 N na 40 cm od oslonca. Teret je 10 cm od oslonca. Koliki najveći teret možeš podići?' },
        options: [{ en: '25 N', hr: '25 N' }, { en: '100 N', hr: '100 N' }, { en: '400 N', hr: '400 N' }, { en: '4000 N', hr: '4000 N' }], answer: 2,
        explain: { en: 'F₁ · d₁ = F₂ · d₂: 100 N × 40 cm = 4000 N·cm, so F₂ = 4000 N·cm / 10 cm = 400 N. Four times the force, because the arm is four times longer.', hr: 'F₁ · d₁ = F₂ · d₂: 100 N × 40 cm = 4000 N·cm, pa je F₂ = 4000 N·cm / 10 cm = 400 N. Četiri puta veća sila, jer je krak četiri puta dulji.' } }
    ]
  });
})();
