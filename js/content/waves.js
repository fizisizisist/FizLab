/* FizLab topic: Waves and Sound / Valovi i zvuk */
(function () {
  'use strict';
  window.Content.register({
    id: 'waves',
    order: 120,
    gradeLevel: 8,
    color: 'c3',
    title: { en: 'Waves and Sound', hr: 'Valovi i zvuk' },
    intro: {
      en: 'Drop a stone in a pond, pluck a guitar string, shout at a cliff: waves carry energy, music and even your voice. Find out how, and why no one can hear you scream in space.',
      hr: 'Baci kamen u ribnjak, trzni žicu gitare, vikni prema stijeni: valovi prenose energiju, glazbu, pa i tvoj glas. Otkrij kako i zašto te u svemiru nitko ne može čuti kad vičeš.'
    },
    sims: ['waves', 'sound'],

    lesson: [
      {
        h: { en: 'Oscillations', hr: 'Titranje' },
        p: {
          en: [
            'A swing, a guitar string, a pendulum and your heart all do the same thing: they move back and forth around a rest position, over and over. This repeating motion is called oscillation. One complete back-and-forth movement is one oscillation.',
            'The time one full oscillation takes is the period, T, measured in seconds. The number of oscillations in one second is the frequency, f, measured in hertz (Hz). They are opposites of each other: f = 1 / T. A swing that takes 2 s for one full swing has a frequency of 0.5 Hz; a guitar string vibrating 440 times a second (440 Hz) has a period of about 0.0023 s.',
            'The amplitude is the largest distance the oscillating object moves away from its rest position. Push a swing harder and the amplitude grows, but the period stays almost the same. Amplitude tells how big the oscillation is; frequency tells how fast it repeats.'
          ],
          hr: [
            'Ljuljačka, žica gitare, njihalo i tvoje srce rade istu stvar: gibaju se amo-tamo oko ravnotežnog položaja, iznova i iznova. Takvo ponavljajuće gibanje zove se titranje. Jedan potpuni pokret amo i natrag jedan je titraj. Ravnotežni položaj je mjesto na kojem bi tijelo mirovalo da ga ništa ne pokreće.',
            'Vrijeme jednog potpunog titraja zove se period, T, i mjeri se u sekundama. Broj titraja u jednoj sekundi je frekvencija, f, i mjeri se u hercima (Hz). Oni su jedno drugome suprotni: f = 1 / T. Ljuljačka kojoj za jedan puni zamah treba 2 s ima frekvenciju 0,5 Hz; žica gitare koja titra 440 puta u sekundi (440 Hz) ima period od oko 0,0023 s.',
            'Amplituda je najveća udaljenost na koju se tijelo koje titra udalji od ravnotežnog položaja. Zanjiši ljuljačku jače i amplituda raste, ali period ostaje gotovo isti. Amplituda govori koliko je titranje veliko, a frekvencija koliko se brzo ponavlja. Zbog trenja amplituda se s vremenom smanjuje, pa se ljuljačka sama zaustavi.'
          ]
        }
      },
      {
        h: { en: 'What is a wave?', hr: 'Što je val?' },
        p: {
          en: [
            'When oscillations spread out from place to place, we get a wave. Drop a stone into a pond: ripples travel outward across the water. But watch a duck floating nearby. It does not get carried away with the ripples; it just bobs up and down in the same place. The wave moves, the water stays. A wave carries energy from one place to another, not matter.',
            'In a transverse wave the particles move up and down while the wave travels sideways, like a rope you shake at one end, or ripples on water. Light is also a transverse wave. In a longitudinal wave the particles move back and forth along the same direction the wave travels, like a long spring you push and pull at one end: squeezed and stretched parts travel along it. Sound is a longitudinal wave.'
          ],
          hr: [
            'Kad se titranje širi s mjesta na mjesto, nastaje val. Baci kamen u ribnjak: valići putuju vodom prema van. No pogledaj patku koja pluta u blizini. Nju valići ne odnose; ona se samo diže i spušta na istom mjestu. Val se giba, voda ostaje. Val prenosi energiju s jednog mjesta na drugo, a ne tvar.',
            'Kod transverzalnog vala čestice se gibaju gore-dolje, a val putuje postrance, kao uže koje protreseš na jednom kraju ili valovi na vodi. I svjetlost je transverzalni val. Kod longitudinalnog vala čestice se gibaju naprijed-natrag u istom smjeru u kojem putuje val, kao duga opruga koju gurneš i povučeš na jednom kraju: zgusnuti i razvučeni dijelovi putuju duž nje. Zvuk je longitudinalni val.'
          ]
        }
      },
      {
        h: { en: 'Wavelength and wave speed', hr: 'Valna duljina i brzina vala' },
        p: {
          en: [
            'Look at a wave frozen in a photo: it has crests (high points) and troughs (low points). The distance from one crest to the next is the wavelength, written with the Greek letter λ (lambda) and measured in metres. Sea waves may have a wavelength of 50 m; the sound wave of a deep voice is a few metres long; a light wave is less than a thousandth of a millimetre.',
            'How fast does a wave travel? Every second the source makes f oscillations, and each one pushes the wave forward by one wavelength. So the wave speed is v = λ · f: wavelength times frequency. Example: a rope wave with a wavelength of 1.5 m and a frequency of 2 Hz travels at 1.5 m · 2 Hz = 3 m/s.',
            'The formula works the other way, too. Sound in air travels at 340 m/s. A note with a frequency of 340 Hz therefore has a wavelength of λ = v / f = 340 / 340 = 1 m. A higher note of 3400 Hz has a wavelength of only 10 cm. Higher frequency means shorter wavelength when the speed is fixed.'
          ],
          hr: [
            'Pogledaj val zamrznut na fotografiji: ima brijegove (najviše točke) i dolove (najniže točke). Udaljenost od jednog brijega do sljedećeg zove se valna duljina, označava se grčkim slovom λ (lambda) i mjeri u metrima. Morski valovi mogu imati valnu duljinu 50 m; zvučni val dubokog glasa dug je nekoliko metara; val svjetlosti kraći je od tisućinke milimetra.',
            'Koliko brzo val putuje? Svake sekunde izvor napravi f titraja, a svaki od njih pogura val naprijed za jednu valnu duljinu. Brzina vala je stoga v = λ · f: valna duljina puta frekvencija. Primjer: val na užetu valne duljine 1,5 m i frekvencije 2 Hz putuje brzinom 1,5 m · 2 Hz = 3 m/s.',
            'Formula radi i u drugom smjeru. Zvuk u zraku putuje brzinom 340 m/s. Ton frekvencije 340 Hz ima stoga valnu duljinu λ = v / f = 340 / 340 = 1 m. Viši ton od 3400 Hz ima valnu duljinu od samo 10 cm. Veća frekvencija znači kraću valnu duljinu kad je brzina ista.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><defs><marker id="wv-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><line x1="20" y1="75" x2="420" y2="75" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/><path d="M20,75 C40,25 80,25 100,75 C120,125 160,125 180,75 C200,25 240,25 260,75 C280,125 320,125 340,75 C360,25 400,25 420,75" fill="none" stroke="var(--c3)" stroke-width="4"/><line x1="60" y1="18" x2="220" y2="18" stroke="var(--fg)" stroke-width="2" marker-start="url(#wv-ar)" marker-end="url(#wv-ar)"/><line x1="60" y1="12" x2="60" y2="38" stroke="var(--muted)" stroke-width="1.5"/><line x1="220" y1="12" x2="220" y2="38" stroke="var(--muted)" stroke-width="1.5"/><text x="140" y="12" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="15" font-weight="700">λ</text><line x1="380" y1="75" x2="380" y2="40" stroke="var(--c1)" stroke-width="2.5" marker-end="url(#wv-ar)"/><text x="394" y="62" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">A</text></svg>'
      },
      {
        h: { en: 'Sound', hr: 'Zvuk' },
        p: {
          en: [
            'Every sound begins with something vibrating: a guitar string, a drum skin, your vocal cords, the cone of a speaker. The vibration pushes and pulls on the air next to it, and those squeezes travel outward as a longitudinal wave. When they reach your ear they make your eardrum vibrate in the same rhythm, and your brain hears a sound.',
            'Sound needs a medium, a material to travel through: air, water, wood, steel. In the empty space between planets there is nothing to vibrate, so there is no sound at all. Astronauts on a spacewalk can only talk by radio. The famous explosions in space movies would, in reality, be perfectly silent.',
            'Sound travels at about 340 m/s in air, roughly a kilometre every three seconds, which is why you see lightning before you hear the thunder. In water it is much faster, around 1500 m/s, and in steel about 5000 m/s. That is why you can hear a distant train through the rails long before you hear it through the air. Sound travels faster in liquids than in gases, and fastest in solids.'
          ],
          hr: [
            'Svaki zvuk počinje nečim što titra: žicom gitare, kožom bubnja, tvojim glasnicama, membranom zvučnika. Titranje gura i povlači zrak uz sebe, a ta zgušnjenja putuju prema van kao longitudinalni val. Kad stignu do tvog uha, zatitraju bubnjić u istom ritmu i mozak čuje zvuk.',
            'Zvuku treba sredstvo, tvar kroz koju putuje: zrak, voda, drvo, čelik. U praznom prostoru između planeta nema ničega što bi titralo, pa zvuka uopće nema. Astronauti u svemirskoj šetnji mogu razgovarati samo radiovezom. Slavne eksplozije iz svemirskih filmova u stvarnosti bi bile potpuno nečujne.',
            'Zvuk u zraku putuje brzinom oko 340 m/s, otprilike kilometar svake tri sekunde, pa zato munju vidiš prije nego što čuješ grom. U vodi je mnogo brži, oko 1500 m/s, a u čeliku oko 5000 m/s. Zato daleki vlak možeš čuti kroz tračnice mnogo prije nego kroz zrak. Zvuk putuje brže u tekućinama nego u plinovima, a najbrže u čvrstim tijelima.'
          ]
        }
      },
      {
        h: { en: 'Pitch and loudness', hr: 'Visina i glasnoća tona' },
        p: {
          en: [
            'The pitch of a sound, how high or low it is, depends on frequency. A bass drum vibrates slowly, maybe 60 times a second; a whistle vibrates thousands of times a second. On a guitar, a shorter, tighter or thinner string vibrates faster and gives a higher note. That is why pressing a string against a fret, which shortens it, raises the pitch.',
            'Human ears hear frequencies from about 20 Hz to 20 000 Hz (20 kHz), and the upper limit drops as we grow older. Sounds above 20 kHz are called ultrasound. Dogs hear up to about 45 kHz, which is why dog whistles seem silent to us, and bats hear well above 100 kHz. Doctors use ultrasound to look at babies before they are born, because it passes safely through the body and echoes back from the inside.',
            'Loudness depends on amplitude: a bigger vibration carries more energy and sounds louder. Loudness is often given in decibels (dB). A whisper is about 30 dB, normal talking 60 dB, a busy street 80 dB, a rock concert 110 dB. Sounds above about 85 dB damage the tiny hair cells in the ear if they last long, and that damage never heals. Keep headphones below about 60 % volume and give your ears a break.'
          ],
          hr: [
            'Visina tona, to jest koliko je zvuk visok ili dubok, ovisi o frekvenciji. Veliki bubanj titra sporo, možda 60 puta u sekundi; zviždaljka titra tisućama puta u sekundi. Na gitari kraća, zategnutija ili tanja žica titra brže i daje viši ton. Zato pritiskanje žice na prag, koje je skraćuje, povisuje ton.',
            'Ljudsko uho čuje frekvencije od oko 20 Hz do 20 000 Hz (20 kHz), a gornja granica pada kako starimo. Zvukovi iznad 20 kHz zovu se ultrazvuk. Psi čuju do oko 45 kHz, zato nam se zviždaljke za pse čine nečujnima, a šišmiši čuju daleko iznad 100 kHz. Liječnici ultrazvukom pregledavaju bebe prije rođenja, jer ultrazvuk sigurno prolazi kroz tijelo i odbija se od unutrašnjosti.',
            'Glasnoća ovisi o amplitudi: veće titranje nosi više energije i zvuči glasnije. Glasnoću često izražavamo u decibelima (dB). Šapat ima oko 30 dB, običan razgovor 60 dB, prometna ulica 80 dB, rock koncert 110 dB. Zvukovi iznad oko 85 dB oštećuju sitne dlačice u uhu ako dugo traju, a to oštećenje nikad ne zacijeli. Drži slušalice ispod oko 60 % glasnoće i daj ušima predah.'
          ]
        }
      },
      {
        h: { en: 'Echo, echolocation and resonance', hr: 'Jeka, eholokacija i rezonancija' },
        p: {
          en: [
            'Shout towards a cliff or a big wall and a moment later you hear yourself again: an echo. The sound travelled to the wall, bounced off and came back. Because it went there and back, it covered twice the distance: t = 2d / v. If the echo returns after 2 s, the sound travelled 2 · 340 = 680 m in total, so the cliff is 340 m away. Our ears hear a separate echo only if the wall is at least about 17 m away.',
            'Bats and dolphins use echoes to see in the dark. They send out ultrasound clicks and listen for the returning echoes to find insects or fish and to avoid obstacles. This is called echolocation. Ships and submarines do the same with sonar, measuring the depth of the sea or finding shoals of fish by timing sound echoes from below.',
            'Every object has frequencies at which it likes to vibrate. If a sound of exactly that frequency reaches it, the object starts vibrating strongly: this is resonance. It is why a singer can shatter a glass, why a swing goes high when you push in time with it, and why the body of a guitar or violin makes the thin string sound so much louder.'
          ],
          hr: [
            'Vikni prema stijeni ili velikom zidu i trenutak kasnije čut ćeš sebe ponovno: to je jeka. Zvuk je otputovao do zida, odbio se i vratio. Budući da je išao tamo i natrag, prešao je dvostruku udaljenost: t = 2d / v. Ako se jeka vrati nakon 2 s, zvuk je ukupno prešao 2 · 340 = 680 m, pa je stijena udaljena 340 m. Uho razabire zasebnu jeku samo ako je zid udaljen barem oko 17 m.',
            'Šišmiši i dupini jekom vide u mraku. Odašilju ultrazvučne klikove i osluškuju jeke koje se vraćaju da bi pronašli kukce ili ribe i izbjegli prepreke. To se zove eholokacija. Brodovi i podmornice rade isto sonarom: mjere dubinu mora ili pronalaze jata riba mjereći vrijeme povratka zvuka s dna.',
            'Svako tijelo ima frekvencije na kojima najradije titra. Ako do njega dopre zvuk točno te frekvencije, tijelo počne snažno titrati: to je rezonancija. Zato pjevač može razbiti čašu, zato se ljuljačka visoko zanjiše kad je guraš u pravom ritmu i zato tijelo gitare ili violine čini zvuk tanke žice toliko glasnijim.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'oscillation', hr: 'titranje' }, def: { en: 'Repeating back-and-forth motion around a rest position, like a swing or a plucked string.', hr: 'Ponavljajuće gibanje amo-tamo oko ravnotežnog položaja, poput ljuljačke ili trznute žice.' } },
      { term: { en: 'period (T)', hr: 'period (T)' }, def: { en: 'The time for one complete oscillation, in seconds.', hr: 'Vrijeme jednog potpunog titraja, u sekundama.' } },
      { term: { en: 'frequency (f)', hr: 'frekvencija (f)' }, def: { en: 'The number of oscillations per second, in hertz (Hz). f = 1 / T.', hr: 'Broj titraja u sekundi, u hercima (Hz). f = 1 / T.' } },
      { term: { en: 'amplitude', hr: 'amplituda' }, def: { en: 'The largest distance from the rest position. Bigger amplitude means a louder sound.', hr: 'Najveća udaljenost od ravnotežnog položaja. Veća amplituda znači glasniji zvuk.' } },
      { term: { en: 'wave', hr: 'val' }, def: { en: 'Oscillations spreading through space; a wave carries energy, not matter.', hr: 'Titranje koje se širi prostorom; val prenosi energiju, a ne tvar.' } },
      { term: { en: 'transverse wave', hr: 'transverzalni val' }, def: { en: 'Particles move at right angles to the direction the wave travels: a rope, water ripples, light.', hr: 'Čestice se gibaju okomito na smjer širenja vala: uže, valovi na vodi, svjetlost.' } },
      { term: { en: 'longitudinal wave', hr: 'longitudinalni val' }, def: { en: 'Particles move back and forth along the direction the wave travels: a spring, sound.', hr: 'Čestice se gibaju naprijed-natrag u smjeru širenja vala: opruga, zvuk.' } },
      { term: { en: 'wavelength (λ)', hr: 'valna duljina (λ)' }, def: { en: 'The distance from one crest to the next, in metres.', hr: 'Udaljenost od jednog brijega vala do sljedećeg, u metrima.' } },
      { term: { en: 'sound', hr: 'zvuk' }, def: { en: 'A longitudinal wave made by a vibrating object; it needs a medium such as air, water or steel.', hr: 'Longitudinalni val koji stvara tijelo koje titra; treba mu sredstvo poput zraka, vode ili čelika.' } },
      { term: { en: 'ultrasound', hr: 'ultrazvuk' }, def: { en: 'Sound with a frequency above 20 000 Hz, too high for humans to hear; used by bats and in medicine.', hr: 'Zvuk frekvencije iznad 20 000 Hz, previsok da bi ga ljudi čuli; koriste ga šišmiši i medicina.' } },
      { term: { en: 'echo', hr: 'jeka' }, def: { en: 'Sound reflected from a distant surface, heard again after a delay.', hr: 'Zvuk odbijen od udaljene površine koji čujemo ponovno nakon kratkog vremena.' } },
      { term: { en: 'resonance', hr: 'rezonancija' }, def: { en: 'Strong vibration of an object when it is driven at its own natural frequency.', hr: 'Snažno titranje tijela kad ga pobuđujemo njegovom vlastitom frekvencijom.' } }
    ],

    formulas: [
      { expr: 'f = 1 / T', name: { en: 'frequency and period', hr: 'frekvencija i period' }, note: { en: 'T in s, f in Hz', hr: 'T u s, f u Hz' } },
      { expr: 'v = λ · f', name: { en: 'wave speed', hr: 'brzina vala' }, note: { en: 'λ in m, f in Hz, v in m/s', hr: 'λ u m, f u Hz, v u m/s' } },
      { expr: 'd = v · t / 2', name: { en: 'distance from an echo', hr: 'udaljenost iz jeke' }, note: { en: 'the sound travels there and back; v ≈ 340 m/s in air', hr: 'zvuk putuje tamo i natrag; v ≈ 340 m/s u zraku' } }
    ],

    funFact: {
      en: 'You can measure how far away a thunderstorm is: count the seconds between the lightning flash and the thunder and divide by 3. Light arrives almost instantly, but sound needs about 3 seconds to travel one kilometre.',
      hr: 'Možeš izmjeriti koliko je oluja daleko: broji sekunde između bljeska munje i groma i podijeli s 3. Svjetlost stiže gotovo trenutno, a zvuku treba oko 3 sekunde za jedan kilometar.'
    },

    experiment: {
      title: { en: 'The singing ruler', hr: 'Ravnalo koje pjeva' },
      materials: {
        en: ['a 30 cm plastic or wooden ruler', 'a table with a straight edge', 'your hand', 'optional: two paper cups and 3–5 m of string'],
        hr: ['plastično ili drveno ravnalo od 30 cm', 'stol s ravnim rubom', 'tvoja ruka', 'po želji: dvije papirnate čaše i 3–5 m špage']
      },
      steps: {
        en: [
          'Lay the ruler flat on the table with about 20 cm sticking out over the edge. Press the part on the table down hard with one hand.',
          'Pull the free end down a little and let go. Watch it wobble and listen to the hum.',
          'Slide the ruler in so that only 15 cm sticks out and twang it again. Then 10 cm, then 5 cm. What happens to the sound? And to the speed of the wobbling?',
          'Now keep the same length but pull the end down a lot, then only a little. What changes: the pitch or the loudness?',
          'Bonus: make a small hole in the bottom of each paper cup, thread the string through and knot it inside. Pull the string tight and talk quietly into one cup while a friend listens at the other.'
        ],
        hr: [
          'Položi ravnalo na stol tako da oko 20 cm strši preko ruba. Dio na stolu čvrsto pritisni jednom rukom.',
          'Slobodni kraj malo povuci prema dolje i pusti. Gledaj kako se njiše i slušaj zujanje.',
          'Pomakni ravnalo tako da strši samo 15 cm i ponovno ga trzni. Zatim 10 cm, pa 5 cm. Što se događa sa zvukom? A s brzinom njihanja?',
          'Sad zadrži istu duljinu, ali kraj povuci jako prema dolje, a zatim samo malo. Što se mijenja: visina ili glasnoća tona?',
          'Dodatak: napravi rupicu na dnu obje papirnate čaše, provuci špagu i zaveži čvor iznutra. Napni špagu i tiho govori u jednu čašu dok prijatelj sluša na drugoj.'
        ]
      },
      explain: {
        en: 'A shorter ruler is stiffer, so it vibrates faster: higher frequency, higher pitch. You can even see the oscillations slow down as you make the free part longer. Pulling the end further down gives a bigger amplitude, so the sound is louder, but the pitch stays the same. In the string telephone your voice vibrates the cup bottom, the vibration runs along the tight string and shakes the other cup: sound travelling through a solid.',
        hr: 'Kraće ravnalo je kruće, pa titra brže: veća frekvencija, viši ton. Čak možeš vidjeti kako titranje usporava kad slobodni dio produljiš. Jače povlačenje kraja daje veću amplitudu, pa je zvuk glasniji, ali visina tona ostaje ista. U telefonu od špage tvoj glas zatitra dno čaše, titranje putuje duž napete špage i zatrese drugu čašu: zvuk putuje kroz čvrsto tijelo.'
      },
      safety: { en: 'Do not twang the ruler towards anyone’s face, and do not bend it so far that it snaps.', hr: 'Ne trzaj ravnalo prema ničijem licu i ne savijaj ga toliko da pukne.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What is the unit of frequency?', hr: 'Koja je mjerna jedinica za frekvenciju?' },
        options: [{ en: 'second', hr: 'sekunda' }, { en: 'metre', hr: 'metar' }, { en: 'hertz', hr: 'herc' }, { en: 'decibel', hr: 'decibel' }], answer: 2,
        explain: { en: 'Frequency is measured in hertz (Hz): one hertz is one oscillation per second. The second measures the period and the decibel loudness.', hr: 'Frekvenciju mjerimo u hercima (Hz): jedan herc je jedan titraj u sekundi. Sekundom mjerimo period, a decibelom glasnoću.' } },
      { type: 'mc', q: { en: 'Waves pass under a duck floating on a pond. What does the duck do?', hr: 'Valovi prolaze ispod patke koja pluta na ribnjaku. Što patka radi?' },
        options: [{ en: 'bobs up and down in the same place', hr: 'diže se i spušta na istom mjestu' }, { en: 'is carried along with the wave', hr: 'val je nosi sa sobom' }, { en: 'moves against the wave', hr: 'giba se suprotno od vala' }, { en: 'sinks', hr: 'potone' }], answer: 0,
        explain: { en: 'A wave carries energy, not matter. The water (and the duck) only oscillate up and down while the wave shape travels past.', hr: 'Val prenosi energiju, a ne tvar. Voda (i patka) samo titraju gore-dolje dok oblik vala prolazi.' } },
      { type: 'tf', q: { en: 'Sound can travel through empty space.', hr: 'Zvuk može putovati kroz prazan prostor.' }, answer: false,
        explain: { en: 'Sound needs a medium whose particles can vibrate: air, water or a solid. In the vacuum of space there is nothing to carry it.', hr: 'Zvuku treba sredstvo čije čestice mogu titrati: zrak, voda ili čvrsto tijelo. U vakuumu svemira nema ničega što bi ga prenosilo.' } },
      { type: 'num', q: { en: 'A pendulum takes 0.5 s for one full swing. What is its frequency? Use f = 1 / T.', hr: 'Njihalu za jedan puni titraj treba 0,5 s. Kolika je njegova frekvencija? Uzmi f = 1 / T.' },
        answer: 2, tolerance: 0.05, unit: 'Hz',
        explain: { en: 'f = 1 / T = 1 / 0.5 s = 2 Hz: two full swings every second.', hr: 'f = 1 / T = 1 / 0,5 s = 2 Hz: dva puna titraja svake sekunde.' } },
      { type: 'mc', q: { en: 'What kind of wave is sound in air?', hr: 'Kakav je val zvuk u zraku?' },
        options: [{ en: 'transverse', hr: 'transverzalni' }, { en: 'longitudinal', hr: 'longitudinalni' }, { en: 'a light wave', hr: 'svjetlosni val' }, { en: 'a water wave', hr: 'val na vodi' }], answer: 1,
        explain: { en: 'In a sound wave the air particles move back and forth along the direction the sound travels, so it is longitudinal. Light and water ripples are transverse.', hr: 'U zvučnom valu čestice zraka gibaju se naprijed-natrag u smjeru širenja zvuka, pa je longitudinalan. Svjetlost i valovi na vodi su transverzalni.' } },
      { type: 'mc', q: { en: 'The pitch of a sound (how high or low it is) depends on its…', hr: 'Visina tona (koliko je zvuk visok ili dubok) ovisi o…' },
        options: [{ en: 'amplitude', hr: 'amplitudi' }, { en: 'speed', hr: 'brzini' }, { en: 'loudness', hr: 'glasnoći' }, { en: 'frequency', hr: 'frekvenciji' }], answer: 3,
        explain: { en: 'Higher frequency means a higher pitch. Amplitude decides loudness, and the speed of sound in air is the same for all pitches.', hr: 'Veća frekvencija znači viši ton. Amplituda određuje glasnoću, a brzina zvuka u zraku jednaka je za sve tonove.' } },
      { type: 'tf', q: { en: 'Sound travels faster in steel than in air.', hr: 'Zvuk putuje brže kroz čelik nego kroz zrak.' }, answer: true,
        explain: { en: 'About 5000 m/s in steel compared with 340 m/s in air. That is why you can hear a train through the rails before you hear it through the air.', hr: 'Oko 5000 m/s u čeliku u usporedbi s 340 m/s u zraku. Zato vlak možeš čuti kroz tračnice prije nego kroz zrak.' } },
      { type: 'num', q: { en: 'You shout at a cliff and hear the echo 2 s later. How far away is the cliff? Use v = 340 m/s.', hr: 'Vikneš prema stijeni i jeku čuješ nakon 2 s. Koliko je stijena udaljena? Uzmi v = 340 m/s.' },
        answer: 340, tolerance: 2, unit: 'm',
        explain: { en: 'The sound travels there and back: total path = 340 m/s · 2 s = 680 m, so the cliff is 680 / 2 = 340 m away.', hr: 'Zvuk putuje tamo i natrag: ukupni put = 340 m/s · 2 s = 680 m, pa je stijena udaljena 680 / 2 = 340 m.' } },
      { type: 'mc', q: { en: 'Which frequency can a dog hear but a human cannot?', hr: 'Koju frekvenciju pas može čuti, a čovjek ne može?' },
        options: [{ en: '50 Hz', hr: '50 Hz' }, { en: '5000 Hz', hr: '5000 Hz' }, { en: '30 000 Hz', hr: '30 000 Hz' }, { en: '15 000 Hz', hr: '15 000 Hz' }], answer: 2,
        explain: { en: 'Humans hear from about 20 Hz to 20 000 Hz. A dog hears up to about 45 000 Hz, so 30 000 Hz (ultrasound) is silent to us but clear to the dog.', hr: 'Ljudi čuju od oko 20 Hz do 20 000 Hz. Pas čuje do oko 45 000 Hz, pa je 30 000 Hz (ultrazvuk) za nas nečujno, a psu jasno.' } },
      { type: 'mc', q: { en: 'A wave has a wavelength of 2 m and a frequency of 5 Hz. What is its speed?', hr: 'Val ima valnu duljinu 2 m i frekvenciju 5 Hz. Kolika je njegova brzina?' },
        options: [{ en: '2.5 m/s', hr: '2,5 m/s' }, { en: '10 m/s', hr: '10 m/s' }, { en: '7 m/s', hr: '7 m/s' }, { en: '0.4 m/s', hr: '0,4 m/s' }], answer: 1,
        explain: { en: 'v = λ · f = 2 m · 5 Hz = 10 m/s.', hr: 'v = λ · f = 2 m · 5 Hz = 10 m/s.' } },
      { type: 'mc', q: { en: 'A guitarist presses a string against a fret, making the vibrating part shorter. The note becomes…', hr: 'Gitarist pritisne žicu na prag i tako skrati dio koji titra. Ton postaje…' },
        options: [{ en: 'higher', hr: 'viši' }, { en: 'lower', hr: 'niži' }, { en: 'louder but the same pitch', hr: 'glasniji, ali iste visine' }, { en: 'silent', hr: 'nečujan' }], answer: 0,
        explain: { en: 'A shorter string vibrates faster, so its frequency and pitch go up. Loudness depends on how hard the string is plucked, not on its length.', hr: 'Kraća žica titra brže, pa joj frekvencija i visina tona rastu. Glasnoća ovisi o tome koliko jako trzneš žicu, a ne o njezinoj duljini.' } },
      { type: 'tf', q: { en: 'Listening to very loud music for a long time can permanently damage your hearing.', hr: 'Dugotrajno slušanje vrlo glasne glazbe može trajno oštetiti sluh.' }, answer: true,
        explain: { en: 'Sounds above about 85 dB slowly destroy the hair cells in the inner ear, and they do not grow back. Keep the volume moderate and take breaks.', hr: 'Zvukovi iznad oko 85 dB polako uništavaju dlačice u unutarnjem uhu, a one ne rastu ponovno. Drži glasnoću umjerenom i pravi pauze.' } }
    ]
  });
})();
