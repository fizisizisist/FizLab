/* FizLab topic: Magnetism / Magnetizam */
(function () {
  'use strict';
  window.Content.register({
    id: 'magnetism',
    order: 110,
    gradeLevel: 8,
    color: 'c8',
    title: { en: 'Magnetism', hr: 'Magnetizam' },
    intro: {
      en: 'A compass needle, a fridge magnet and a scrapyard crane all work because of one invisible thing: a magnetic field. Learn where it comes from and how you can make one yourself.',
      hr: 'Igla kompasa, magnet na hladnjaku i dizalica na otpadu rade zahvaljujući istoj nevidljivoj stvari: magnetskom polju. Nauči odakle ono dolazi i kako ga sam možeš napraviti.'
    },
    sims: ['magnet', 'electromagnet'],

    lesson: [
      {
        h: { en: 'Two poles', hr: 'Dva pola' },
        p: {
          en: [
            'Every magnet has two ends where its pull is strongest. We call them poles: a north pole (N) and a south pole (S). Hang a bar magnet on a thread and it turns until its north pole points roughly north; that is how the poles got their names.',
            'Bring two magnets together and you feel a rule: like poles repel, unlike poles attract. N pushes N away and S pushes S away, but N and S snap together. You can feel the invisible push between two like poles as a springy cushion of nothing.',
            'You might think cutting a magnet in half would separate its north from its south. It does not! Each half immediately has both poles, so you get two smaller complete magnets. Cut again and you get four. No matter how small the pieces, a magnet always has two poles; a lone north pole has never been found.'
          ],
          hr: [
            'Svaki magnet ima dva kraja na kojima najjače privlači. Zovemo ih polovi: sjeverni pol (N) i južni pol (S). Objesi štapićasti magnet na konac i okretat će se dok mu sjeverni pol ne pokaže otprilike prema sjeveru; tako su polovi i dobili imena.',
            'Približi dva magneta i osjetit ćeš pravilo: istoimeni polovi se odbijaju, raznoimeni se privlače. N odgurava N, S odgurava S, ali N i S se privuku i spoje. Nevidljivo odbijanje dvaju istoimenih polova osjetiš kao opružni jastučić od ničega. Što su magneti bliže, sila je jača.',
            'Možda misliš da bi prerezivanjem magneta napola odvojio sjever od juga. Ne bi! Svaka polovica odmah ima oba pola, pa dobiješ dva manja potpuna magneta. Prereži ponovno i dobiješ četiri. Ma koliko komadići bili mali, magnet uvijek ima dva pola; samostalni sjeverni pol nikad nije pronađen.'
          ]
        }
      },
      {
        h: { en: 'Magnetic and non-magnetic materials', hr: 'Magnetične i nemagnetične tvari' },
        p: {
          en: [
            'A magnet does not attract everything. It pulls strongly on iron and steel (which is mostly iron), and also on nickel and cobalt. These are called magnetic materials. A fridge door, a paper clip, a steel nail and a tin can (steel under a thin coat of tin) all jump to a magnet.',
            'Copper, aluminium, gold, silver, wood, glass, plastic and paper are non-magnetic: a magnet ignores them completely. Try it with coins: euro cents are copper-plated steel and stick to a magnet, but aluminium foil and a copper wire do not. This is a quick way to tell steel from aluminium.',
            'A piece of iron near a magnet becomes a temporary magnet itself; that is why a chain of paper clips can hang from one magnet. Steel can be magnetised permanently by stroking it with a magnet in one direction many times. Heating a magnet strongly or hammering it shakes up its tiny internal magnets and weakens it.'
          ],
          hr: [
            'Magnet ne privlači sve. Snažno privlači željezo i čelik (koji je uglavnom željezo), a također nikal i kobalt. To su magnetične tvari. Vrata hladnjaka, spajalica, čelični čavao i limenka (čelik pod tankim slojem kositra) skaču na magnet. Zato magnet na hladnjaku drži, a s drvenog ormara pada.',
            'Bakar, aluminij, zlato, srebro, drvo, staklo, plastika i papir nisu magnetični: magnet ih potpuno zanemaruje. Isprobaj s kovanicama: euro centi su čelik presvučen bakrom i lijepe se za magnet, ali aluminijska folija i bakrena žica ne. To je brz način da razlikuješ čelik od aluminija.',
            'Komad željeza blizu magneta i sam privremeno postane magnet; zato lanac spajalica može visjeti s jednog magneta. Čelik se može trajno magnetizirati ako ga mnogo puta u istom smjeru potareš magnetom. Jako zagrijavanje ili udaranje čekićem rastrese sitne unutarnje magnetiće i oslabi magnet.'
          ]
        }
      },
      {
        h: { en: 'The magnetic field and field lines', hr: 'Magnetsko polje i silnice' },
        p: {
          en: [
            'The space around a magnet, where its force can be felt, is its magnetic field. You cannot see it, but you can map it. Put a sheet of paper over a bar magnet and sprinkle iron filings: each tiny filing turns into a little compass and they line up in curved lines from one pole to the other.',
            'We draw these as magnetic field lines. Outside the magnet they run from the north pole to the south pole, and where the lines are packed closest together, at the poles, the field is strongest. Field lines never cross. A small compass placed anywhere in the field turns to point along the line through that spot.'
          ],
          hr: [
            'Prostor oko magneta u kojem se osjeća njegova sila zove se magnetsko polje. Ne možeš ga vidjeti, ali ga možeš iscrtati. Stavi list papira preko štapićastog magneta i pospi željeznu piljevinu: svaka sitna strugotina postane mali kompas i sve se poredaju u zakrivljene linije od jednog pola do drugoga.',
            'Te linije crtamo kao magnetske silnice. Izvan magneta idu od sjevernog pola prema južnom, a gdje su silnice najgušće, na polovima, polje je najjače. Silnice se nikad ne sijeku. Mali kompas postavljen bilo gdje u polju okrene se u smjeru silnice koja prolazi kroz to mjesto.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><defs><marker id="mg-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><path d="M270,70 C300,10 120,10 150,70" fill="none" stroke="var(--c8)" stroke-width="2" marker-mid="url(#mg-ar)"/><path d="M270,70 C330,-20 90,-20 150,70" fill="none" stroke="var(--c8)" stroke-width="2"/><path d="M270,70 C300,130 120,130 150,70" fill="none" stroke="var(--c8)" stroke-width="2"/><path d="M270,70 C330,160 90,160 150,70" fill="none" stroke="var(--c8)" stroke-width="2"/><line x1="270" y1="70" x2="400" y2="70" stroke="var(--c8)" stroke-width="2" marker-end="url(#mg-ar)"/><line x1="20" y1="70" x2="150" y2="70" stroke="var(--c8)" stroke-width="2" marker-end="url(#mg-ar)"/><rect x="150" y="52" width="60" height="36" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><rect x="210" y="52" width="60" height="36" fill="var(--c1)" stroke="var(--fg)" stroke-width="2"/><text x="180" y="76" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="15" font-weight="700">S</text><text x="240" y="76" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="15" font-weight="700">N</text><polygon points="208,38 216,41 208,44" fill="var(--c8)"/><polygon points="212,96 204,99 212,102" fill="var(--c8)"/></svg>'
      },
      {
        h: { en: 'Earth is a magnet', hr: 'Zemlja je magnet' },
        p: {
          en: [
            'Earth itself is a giant magnet. Deep inside, molten iron swirls around and produces a magnetic field that reaches far out into space. This is why a compass works: its needle is a small magnet that lines up with Earth’s field, so its north pole points towards the Arctic. Sailors have found their way with compasses for about a thousand years.',
            'Here is a twist: since the north pole of a compass is attracted north, the magnetic pole near the geographic North Pole is actually a magnetic south pole! The magnetic poles also do not sit exactly on the geographic ones, and they slowly wander by tens of kilometres every year.',
            'Earth’s field is a shield. It steers electrically charged particles streaming from the Sun towards the polar regions, where they hit the upper air and make it glow: the auroras, or northern and southern lights. Many animals sense the field too. Migrating birds, sea turtles and even some bacteria use it to find their way.'
          ],
          hr: [
            'I sama Zemlja je golemi magnet. Duboko u njezinoj unutrašnjosti kovitla se rastaljeno željezo i stvara magnetsko polje koje seže daleko u svemir. Zato kompas radi: njegova igla je mali magnet koji se poravna sa Zemljinim poljem, pa joj sjeverni pol pokazuje prema Arktiku. Pomorci se kompasom snalaze već oko tisuću godina.',
            'Evo začkoljice: budući da sjeverni pol kompasa privlači sjever, magnetski pol blizu geografskog Sjevernog pola zapravo je magnetski južni pol! Magnetski polovi ne leže točno na geografskima i polako lutaju po nekoliko desetaka kilometara svake godine. Pomorci i piloti zato moraju redovito ispravljati svoje karte.',
            'Zemljino polje je štit. Ono skreće električki nabijene čestice koje struje sa Sunca prema polarnim krajevima, gdje udaraju u visoke slojeve zraka i tjeraju ih da svijetle: to je polarna svjetlost. Mnoge životinje također osjećaju polje. Ptice selice, morske kornjače, pa čak i neke bakterije pomoću njega pronalaze put.'
          ]
        }
      },
      {
        h: { en: 'Current makes magnetism: electromagnets', hr: 'Struja stvara magnetizam: elektromagneti' },
        p: {
          en: [
            'In 1820 the Danish physicist Hans Christian Ørsted noticed something during a lecture: when he switched on a current in a wire, a compass needle lying nearby swung round. He had discovered that an electric current creates a magnetic field around it. Electricity and magnetism, which seemed like two separate things, turned out to be deeply connected.',
            'Wind the wire into a coil and the fields of all the turns add up. Push an iron core, such as a nail, into the coil and the field becomes many times stronger still. This is an electromagnet. It is stronger with more turns of wire and with more current, and, best of all, it can be switched off: cut the current and the magnetism disappears.',
            'That on-off switch is what makes electromagnets so useful. A scrapyard crane lifts a whole car with its electromagnet, swings it over a pile and drops it by switching the current off. A doorbell uses an electromagnet to pull a hammer onto a bell. In a loudspeaker a coil pushes a paper cone back and forth to make sound, and in an electric motor magnets and coils push on each other to make a shaft spin.'
          ],
          hr: [
            'Godine 1820. danski fizičar Hans Christian Ørsted primijetio je nešto za vrijeme predavanja: kad je uključio struju u žici, igla kompasa koja je ležala u blizini zakrenula se. Otkrio je da električna struja oko sebe stvara magnetsko polje. Elektricitet i magnetizam, koji su se činili kao dvije odvojene pojave, pokazali su se duboko povezanima.',
            'Namotaj žicu u zavojnicu i polja svih zavoja se zbroje. Gurni u zavojnicu željeznu jezgru, na primjer čavao, i polje postane još mnogo puta jače. To je elektromagnet. Jači je što zavojnica ima više zavoja i što je struja jača, a najbolje od svega, može se isključiti: prekini struju i magnetizam nestane.',
            'Upravo to uključivanje i isključivanje čini elektromagnete tako korisnima. Dizalica na otpadu elektromagnetom podigne cijeli automobil, prenese ga iznad hrpe i ispusti ga isključivanjem struje. Električno zvono elektromagnetom povlači batić na zvono. U zvučniku zavojnica gura papirnatu membranu naprijed-natrag i stvara zvuk, a u elektromotoru magneti i zavojnice guraju jedni druge i okreću osovinu.'
          ]
        },
        svg: '<svg viewBox="0 0 420 120" role="img"><rect x="110" y="48" width="200" height="24" rx="4" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><polygon points="310,52 330,60 310,68" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><path d="M130,78 C120,30 150,30 140,78 C130,30 160,30 150,78 C140,30 170,30 160,78 C150,30 180,30 170,78 C160,30 190,30 180,78 C170,30 200,30 190,78 C180,30 210,30 200,78 C190,30 220,30 210,78 C200,30 230,30 220,78 C210,30 240,30 230,78 C220,30 250,30 240,78 C230,30 260,30 250,78 C240,30 270,30 260,78 C250,30 280,30 270,78" fill="none" stroke="var(--c4)" stroke-width="3"/><line x1="130" y1="78" x2="60" y2="100" stroke="var(--c4)" stroke-width="3"/><line x1="270" y1="78" x2="340" y2="100" stroke="var(--c4)" stroke-width="3"/><rect x="40" y="94" width="14" height="22" fill="var(--c4)" stroke="var(--fg)" stroke-width="2"/><rect x="54" y="98" width="8" height="14" fill="var(--fg)"/><line x1="62" y1="105" x2="340" y2="105" stroke="var(--c4)" stroke-width="3"/><rect x="345" y="78" width="5" height="12" fill="var(--c3)"/><rect x="352" y="78" width="5" height="12" fill="var(--c3)"/><rect x="359" y="78" width="5" height="12" fill="var(--c3)"/><text x="60" y="35" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">I</text><text x="365" y="68" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">N</text><text x="85" y="68" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">S</text></svg>'
      },
      {
        h: { en: 'Magnets around us', hr: 'Magneti oko nas' },
        p: {
          en: [
            'Magnets are everywhere in modern life. Fridge magnets hold notes; magnetic clasps close bags and phone cases; the strip on a bank card and old cassette tapes store information as tiny magnetised patches, and hard disks in computers still store billions of bits the same way. Every speaker, headphone and electric motor, from a toy car to an electric bus, contains magnets.',
            'In hospitals, an MRI scanner uses a magnet tens of thousands of times stronger than Earth’s field to take detailed pictures of the inside of the body without any X-rays. In Japan and China, maglev trains float a few centimetres above the track on magnetic fields: with no wheels touching the rails there is almost no friction, and they can run at over 400 km/h.'
          ],
          hr: [
            'Magneti su posvuda u suvremenom životu. Magneti na hladnjaku drže poruke; magnetske kopče zatvaraju torbe i maskice za mobitel; traka na bankovnoj kartici i stare kasete pohranjuju podatke kao sitne namagnetizirane mrlje, a tvrdi diskovi u računalima na isti način i danas čuvaju milijarde bitova. Svaki zvučnik, slušalica i elektromotor, od autića igračke do električnog autobusa, sadrži magnete.',
            'U bolnicama uređaj za magnetsku rezonanciju (MR) koristi magnet desetke tisuća puta jači od Zemljina polja da bi snimio detaljne slike unutrašnjosti tijela bez ikakvog rendgenskog zračenja. U Japanu i Kini vlakovi maglev lebde nekoliko centimetara iznad pruge na magnetskim poljima: budući da kotači ne dodiruju tračnice, gotovo nema trenja i mogu voziti brže od 400 km/h.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'magnet', hr: 'magnet' }, def: { en: 'An object that attracts iron, steel, nickel and cobalt and always has two poles.', hr: 'Tijelo koje privlači željezo, čelik, nikal i kobalt i uvijek ima dva pola.' } },
      { term: { en: 'magnetic poles', hr: 'magnetski polovi' }, def: { en: 'The two ends of a magnet (N and S) where it pulls most strongly. Like poles repel, unlike attract.', hr: 'Dva kraja magneta (N i S) na kojima najjače privlači. Istoimeni se odbijaju, raznoimeni privlače.' } },
      { term: { en: 'magnetic materials', hr: 'magnetične tvari' }, def: { en: 'Materials a magnet attracts: iron, steel, nickel, cobalt. Copper, aluminium, wood and plastic are not.', hr: 'Tvari koje magnet privlači: željezo, čelik, nikal, kobalt. Bakar, aluminij, drvo i plastika nisu.' } },
      { term: { en: 'magnetic field', hr: 'magnetsko polje' }, def: { en: 'The space around a magnet or a current-carrying wire where magnetic force acts.', hr: 'Prostor oko magneta ili vodiča sa strujom u kojem djeluje magnetska sila.' } },
      { term: { en: 'field lines', hr: 'magnetske silnice' }, def: { en: 'Lines that show the shape of a magnetic field; outside a magnet they run from N to S and are densest at the poles.', hr: 'Crte koje prikazuju oblik magnetskog polja; izvan magneta idu od N prema S i najgušće su na polovima.' } },
      { term: { en: 'compass', hr: 'kompas' }, def: { en: 'A small magnetic needle that turns freely and lines up with Earth’s magnetic field.', hr: 'Mala magnetska igla koja se slobodno okreće i poravnava sa Zemljinim magnetskim poljem.' } },
      { term: { en: 'magnetising', hr: 'magnetiziranje' }, def: { en: 'Turning a piece of steel into a magnet, for example by stroking it with a magnet in one direction.', hr: 'Pretvaranje komada čelika u magnet, na primjer trljanjem magnetom u jednom smjeru.' } },
      { term: { en: 'Ørsted’s discovery', hr: 'Ørstedov pokus' }, def: { en: 'An electric current creates a magnetic field around the wire it flows through (1820).', hr: 'Električna struja stvara magnetsko polje oko vodiča kroz koji teče (1820.).' } },
      { term: { en: 'coil', hr: 'zavojnica' }, def: { en: 'Wire wound into many loops; the fields of all the turns add together.', hr: 'Žica namotana u mnogo zavoja; polja svih zavoja se zbrajaju.' } },
      { term: { en: 'electromagnet', hr: 'elektromagnet' }, def: { en: 'A coil with an iron core that becomes a magnet while current flows and stops when it is switched off.', hr: 'Zavojnica sa željeznom jezgrom koja je magnet dok teče struja i prestaje biti kad se struja isključi.' } },
      { term: { en: 'aurora', hr: 'polarna svjetlost' }, def: { en: 'Glowing sky near the poles, made by charged particles from the Sun steered there by Earth’s magnetic field.', hr: 'Svjetlucanje neba blizu polova koje stvaraju nabijene čestice sa Sunca koje tamo skreće Zemljino magnetsko polje.' } }
    ],

    formulas: [
      { expr: 'N → S', name: { en: 'direction of field lines outside a magnet', hr: 'smjer silnica izvan magneta' }, note: { en: 'from the north pole to the south pole', hr: 'od sjevernog prema južnom polu' } },
      { expr: 'B ∝ N · I', name: { en: 'strength of an electromagnet', hr: 'jakost elektromagneta' }, note: { en: 'grows with the number of turns N and the current I; an iron core makes it much stronger', hr: 'raste s brojem zavoja N i jakošću struje I; željezna jezgra čini ga mnogo jačim' } }
    ],

    funFact: {
      en: 'The north pole of a compass needle points north because the magnetic pole near the Arctic is actually a magnetic south pole. That pole is not fixed, either: in recent decades it has drifted from Canada towards Siberia by tens of kilometres a year.',
      hr: 'Sjeverni pol igle kompasa pokazuje prema sjeveru zato što je magnetski pol blizu Arktika zapravo magnetski južni pol. Ni taj pol ne stoji na mjestu: posljednjih desetljeća seli se od Kanade prema Sibiru po nekoliko desetaka kilometara godišnje.'
    },

    experiment: {
      title: { en: 'Make a compass and an electromagnet', hr: 'Napravi kompas i elektromagnet' },
      materials: {
        en: ['a sewing needle', 'a magnet (a strong fridge magnet or one from a toy)', 'a thin slice of cork or a small piece of styrofoam', 'a bowl of water', 'a large iron nail (about 10 cm)', 'about 1 m of thin insulated copper wire', 'a 1.5 V or 4.5 V battery', 'paper clips', 'sticky tape'],
        hr: ['igla za šivanje', 'magnet (jači magnet s hladnjaka ili iz igračke)', 'tanak kolutić pluta ili komadić stiropora', 'zdjela vode', 'veliki željezni čavao (oko 10 cm)', 'oko 1 m tanke izolirane bakrene žice', 'baterija od 1,5 V ili 4,5 V', 'spajalice', 'selotejp']
      },
      steps: {
        en: [
          'Stroke the needle with one pole of the magnet about 30 times, always in the same direction, lifting the magnet away between strokes. The needle is now a weak magnet.',
          'Lay the needle on the cork slice and float it in the bowl, far from metal objects. It slowly turns and settles pointing north–south. Nudge it; it comes back. Check with a phone compass.',
          'For the electromagnet, wind the wire tightly around the nail, 40–50 turns side by side, leaving about 15 cm free at each end. Strip 1 cm of insulation from the ends.',
          'Press the bare ends onto the two terminals of the battery (tape them for a moment) and bring the nail to the paper clips: it picks them up.',
          'Let go of one wire: the paper clips drop. The magnetism needs the current.',
          'Try 20 turns, then 80 turns, and a 1.5 V battery against a 4.5 V one. Count the paper clips each time and write down what makes the electromagnet stronger.'
        ],
        hr: [
          'Potari iglu jednim polom magneta oko 30 puta, uvijek u istom smjeru, odmičući magnet između poteza. Igla je sad slab magnet.',
          'Položi iglu na kolutić pluta i pusti ga da pluta u zdjeli, daleko od metalnih predmeta. Igla se polako okrene i smiri u smjeru sjever–jug. Gurni je; vraća se. Provjeri kompasom na mobitelu.',
          'Za elektromagnet čvrsto namotaj žicu oko čavla, 40–50 zavoja jedan uz drugi, i ostavi oko 15 cm slobodne žice na oba kraja. Skini 1 cm izolacije s krajeva.',
          'Pritisni ogoljene krajeve na dva pola baterije (na trenutak ih zalijepi selotejpom) i približi čavao spajalicama: podiže ih.',
          'Pusti jednu žicu: spajalice padnu. Magnetizmu je potrebna struja.',
          'Probaj s 20 zavoja, zatim s 80, te s baterijom od 1,5 V i od 4,5 V. Svaki put prebroji spajalice i zapiši što elektromagnet čini jačim.'
        ]
      },
      explain: {
        en: 'Stroking lines up the tiny magnetic regions inside the steel needle, so it becomes a magnet; floating on water lets it turn freely in Earth’s magnetic field, just like a real compass. In the electromagnet, the current in the coil creates a magnetic field, the iron nail makes it much stronger, and the field vanishes the moment the current stops. More turns and more current mean a stronger field, which is exactly what Ørsted’s discovery predicts.',
        hr: 'Trljanje poravna sitna magnetska područja u čeličnoj igli, pa ona postane magnet; plutanje na vodi omogućuje joj da se slobodno okreće u Zemljinu magnetskom polju, baš kao pravi kompas. U elektromagnetu struja u zavojnici stvara magnetsko polje, željezni čavao ga mnogo pojača, a polje nestane čim struja prestane teći. Više zavoja i jača struja daju jače polje, upravo kako predviđa Ørstedovo otkriće.'
      },
      safety: { en: 'Connect the electromagnet only for a few seconds at a time: the wire and battery get warm and the battery drains quickly. The needle is sharp. Keep magnets away from phones, bank cards and small children.', hr: 'Elektromagnet spajaj samo na nekoliko sekundi odjednom: žica i baterija se zagriju, a baterija se brzo isprazni. Igla je oštra. Drži magnete podalje od mobitela, bankovnih kartica i male djece.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which two poles repel each other?', hr: 'Koja se dva pola međusobno odbijaju?' },
        options: [{ en: 'N and S', hr: 'N i S' }, { en: 'N and N', hr: 'N i N' }, { en: 'any two poles', hr: 'bilo koja dva pola' }, { en: 'poles never repel', hr: 'polovi se nikad ne odbijaju' }], answer: 1,
        explain: { en: 'Like poles (N–N or S–S) repel; unlike poles (N–S) attract.', hr: 'Istoimeni polovi (N–N ili S–S) se odbijaju; raznoimeni (N–S) se privlače.' } },
      { type: 'mc', q: { en: 'Which object will a magnet pick up?', hr: 'Koji će predmet magnet podignuti?' },
        options: [{ en: 'a copper coin', hr: 'bakrenu kovanicu' }, { en: 'an aluminium can', hr: 'aluminijsku limenku' }, { en: 'a wooden pencil', hr: 'drvenu olovku' }, { en: 'an iron nail', hr: 'željezni čavao' }], answer: 3,
        explain: { en: 'Only iron, steel, nickel and cobalt are magnetic. Copper, aluminium and wood are not attracted at all.', hr: 'Samo su željezo, čelik, nikal i kobalt magnetični. Bakar, aluminij i drvo magnet uopće ne privlači.' } },
      { type: 'tf', q: { en: 'If you cut a bar magnet in half, one half is a lone north pole and the other a lone south pole.', hr: 'Ako štapićasti magnet prerežeš napola, jedna polovica je samo sjeverni pol, a druga samo južni pol.' }, answer: false,
        explain: { en: 'Each half immediately has both a north and a south pole. You simply get two smaller complete magnets.', hr: 'Svaka polovica odmah ima i sjeverni i južni pol. Jednostavno dobiješ dva manja potpuna magneta.' } },
      { type: 'mc', q: { en: 'Outside a magnet, field lines run…', hr: 'Izvan magneta silnice idu…' },
        options: [{ en: 'from the north pole to the south pole', hr: 'od sjevernog pola prema južnom' }, { en: 'from the south pole to the north pole', hr: 'od južnog pola prema sjevernom' }, { en: 'in circles around the middle', hr: 'u krugovima oko sredine' }, { en: 'straight out from the middle', hr: 'ravno iz sredine prema van' }], answer: 0,
        explain: { en: 'By convention field lines leave the north pole and enter the south pole. They are densest at the poles, where the field is strongest.', hr: 'Prema dogovoru silnice izlaze iz sjevernog pola i ulaze u južni. Najgušće su na polovima, gdje je polje najjače.' } },
      { type: 'mc', q: { en: 'Why does a compass needle point north?', hr: 'Zašto igla kompasa pokazuje prema sjeveru?' },
        options: [{ en: 'the needle is heavier at one end', hr: 'igla je teža na jednom kraju' }, { en: 'the Sun pulls it', hr: 'privlači je Sunce' }, { en: 'it lines up with Earth’s magnetic field', hr: 'poravnava se sa Zemljinim magnetskim poljem' }, { en: 'cold air flows from the north', hr: 'hladan zrak struji sa sjevera' }], answer: 2,
        explain: { en: 'Earth is a giant magnet. The small magnetic needle turns until it lines up with Earth’s field, with its north pole pointing towards the Arctic.', hr: 'Zemlja je golemi magnet. Mala magnetska igla okreće se dok se ne poravna sa Zemljinim poljem, sa sjevernim polom okrenutim prema Arktiku.' } },
      { type: 'tf', q: { en: 'Ørsted discovered that an electric current creates a magnetic field.', hr: 'Ørsted je otkrio da električna struja stvara magnetsko polje.' }, answer: true,
        explain: { en: 'Yes, in 1820. A compass needle next to a wire swung round when current flowed. This link between electricity and magnetism is the basis of every electromagnet and motor.', hr: 'Da, 1820. godine. Igla kompasa uz žicu zakrenula se kad je potekla struja. Ta veza elektriciteta i magnetizma temelj je svakog elektromagneta i motora.' } },
      { type: 'mc', q: { en: 'Which change makes an electromagnet stronger?', hr: 'Koja promjena čini elektromagnet jačim?' },
        options: [{ en: 'using a plastic core instead of iron', hr: 'plastična jezgra umjesto željezne' }, { en: 'more turns of wire in the coil', hr: 'više zavoja žice u zavojnici' }, { en: 'a longer wire from the battery', hr: 'dulja žica od baterije' }, { en: 'less current', hr: 'slabija struja' }], answer: 1,
        explain: { en: 'More turns and more current both strengthen the field, and an iron core multiplies it. A plastic core or weaker current would make it weaker.', hr: 'Više zavoja i jača struja pojačavaju polje, a željezna jezgra ga umnogostruči. Plastična jezgra ili slabija struja oslabile bi ga.' } },
      { type: 'mc', q: { en: 'Why does a scrapyard crane use an electromagnet instead of an ordinary magnet?', hr: 'Zašto dizalica na otpadu koristi elektromagnet umjesto običnog magneta?' },
        options: [{ en: 'electromagnets are lighter', hr: 'elektromagneti su lakši' }, { en: 'ordinary magnets do not attract steel', hr: 'obični magneti ne privlače čelik' }, { en: 'electromagnets work without electricity', hr: 'elektromagneti rade bez struje' }, { en: 'it can be switched off to drop the load', hr: 'može se isključiti da ispusti teret' }], answer: 3,
        explain: { en: 'An electromagnet is a magnet only while current flows. Switch the current off and the scrap falls exactly where the crane operator wants it.', hr: 'Elektromagnet je magnet samo dok teče struja. Isključi struju i otpad padne točno gdje rukovatelj dizalice želi.' } },
      { type: 'num', q: { en: 'A coil with 50 turns lifts 10 paper clips. If the lifting power grows in proportion to the number of turns, how many clips will a coil with 150 turns lift (same current)?', hr: 'Zavojnica s 50 zavoja podiže 10 spajalica. Ako snaga podizanja raste razmjerno broju zavoja, koliko će spajalica podignuti zavojnica sa 150 zavoja (ista struja)?' },
        answer: 30, tolerance: 0.5, unit: '',
        explain: { en: '150 turns is 3 times as many as 50, so the coil lifts about 3 × 10 = 30 clips.', hr: '150 zavoja je 3 puta više od 50, pa zavojnica podiže oko 3 × 10 = 30 spajalica.' } },
      { type: 'num', q: { en: 'An MRI magnet has a field of 1.5 T. Earth’s field is about 0.00005 T. How many times stronger is the MRI magnet?', hr: 'Magnet uređaja za magnetsku rezonanciju ima polje od 1,5 T. Zemljino polje iznosi oko 0,00005 T. Koliko je puta MR magnet jači?' },
        answer: 30000, tolerance: 500, unit: '×',
        explain: { en: '1.5 / 0.00005 = 30 000. Hospital magnets are tens of thousands of times stronger than the field that turns a compass.', hr: '1,5 / 0,00005 = 30 000. Bolnički magneti deseci su tisuća puta jači od polja koje okreće kompas.' } },
      { type: 'mc', q: { en: 'What causes the auroras (northern lights)?', hr: 'Što uzrokuje polarnu svjetlost?' },
        options: [{ en: 'sunlight reflected from ice', hr: 'sunčeva svjetlost odbijena od leda' }, { en: 'lightning in high clouds', hr: 'munje u visokim oblacima' }, { en: 'charged particles from the Sun steered by Earth’s magnetic field', hr: 'nabijene čestice sa Sunca koje skreće Zemljino magnetsko polje' }, { en: 'volcanoes under the ice', hr: 'vulkani pod ledom' }], answer: 2,
        explain: { en: 'Earth’s field guides charged particles from the Sun towards the poles, where they hit the upper atmosphere and make it glow in green and red curtains.', hr: 'Zemljino polje usmjerava nabijene čestice sa Sunca prema polovima, gdje udaraju u gornje slojeve atmosfere i tjeraju je da svijetli u zelenim i crvenim zastorima.' } }
    ]
  });
})();
