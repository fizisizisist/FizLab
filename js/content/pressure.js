/* FizLab topic: Pressure / Tlak */
(function () {
  'use strict';
  window.Content.register({
    id: 'pressure',
    order: 60,
    gradeLevel: 7,
    color: 'c4',
    title: { en: 'Pressure', hr: 'Tlak' },
    intro: {
      en: 'Why can a sharp knife cut what a blunt one cannot, and why do your ears pop in a plane? Pressure explains both.',
      hr: 'Zašto oštar nož reže ono što tupi ne može i zašto ti u avionu pucketa u ušima? Oboje objašnjava tlak.'
    },
    sims: ['pressure'],

    lesson: [
      {
        h: { en: 'What is pressure?', hr: 'Što je tlak?' },
        p: {
          en: [
            'Push a drawing pin into a cork board. Your thumb presses on the flat head and feels nothing, yet the sharp point sinks into the board. The force is the same at both ends. What differs is the area over which it is spread. A force spread over a small area has a big effect; the same force spread over a large area has a small effect. The quantity that measures this is pressure.',
            'Pressure is force divided by the area it acts on: p = F / A. The unit is the pascal (Pa): one newton on one square metre. One pascal is tiny, roughly the pressure of a sheet of paper lying on a table, so we usually use kilopascals (1 kPa = 1000 Pa). Another everyday unit is the bar: 1 bar is about 100 kPa, close to the pressure of the air around us. A bicycle tyre is pumped to about 4 bar.'
          ],
          hr: [
            'Zabodi pribadaču u plutenu ploču. Palac pritišće plosnatu glavicu i ne osjeća ništa, a oštar vrh tone u ploču. Sila je na oba kraja jednaka. Razlikuje se površina na koju je raspoređena. Sila raspoređena na malu površinu ima velik učinak; ista sila na velikoj površini ima malen učinak. Veličina koja to mjeri zove se tlak.',
            'Tlak je sila podijeljena površinom na koju djeluje: p = F / A. Jedinica je paskal (Pa): jedan njutn na jedan kvadratni metar. Jedan paskal je sićušan, otprilike tlak lista papira koji leži na stolu, pa obično koristimo kilopaskale (1 kPa = 1000 Pa). Još jedna svakodnevna jedinica je bar: 1 bar je oko 100 kPa, blizu tlaka zraka oko nas. Gumu bicikla napumpamo na oko 4 bara.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><defs><marker id="pr-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--c4)"/></marker></defs><line x1="20" y1="120" x2="400" y2="120" stroke="var(--muted)" stroke-width="2"/><rect x="80" y="60" width="40" height="60" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="100" y1="12" x2="100" y2="52" stroke="var(--c4)" stroke-width="5" marker-end="url(#pr-ar)"/><text x="112" y="30" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">F = 100 N</text><text x="100" y="136" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">p = 100 Pa</text><rect x="240" y="60" width="160" height="60" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="320" y1="12" x2="320" y2="52" stroke="var(--c4)" stroke-width="5" marker-end="url(#pr-ar)"/><text x="332" y="30" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">F = 100 N</text><text x="320" y="136" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">p = 25 Pa</text><text x="100" y="95" text-anchor="middle" fill="var(--muted)" font-family="inherit" font-size="12">A = 1 m²</text><text x="320" y="95" text-anchor="middle" fill="var(--muted)" font-family="inherit" font-size="12">A = 4 m²</text></svg>'
      },
      {
        h: { en: 'Pressure in everyday life', hr: 'Tlak u svakodnevnom životu' },
        p: {
          en: [
            'Sometimes we want a small pressure. Snowshoes and skis spread your weight over a large area so you do not sink into the snow. The wide, padded feet of a camel do the same in sand. A truck carrying 20 tonnes has many wide tyres so that the road is not crushed, and a tractor has huge tyres so that it does not sink into a muddy field.',
            'Sometimes we want a big pressure. A knife is sharpened so that its edge has a tiny area: the same push then gives an enormous pressure that slices through a tomato. Nails, needles and drawing pins have sharp points for the same reason. A person in high heels, with her weight on a heel of 1 cm², presses on the floor with a greater pressure than an elephant does with its wide feet. That is why heels leave dents in a soft floor.'
          ],
          hr: [
            'Ponekad želimo malen tlak. Krplje i skije raspoređuju tvoju težinu na veliku površinu, pa ne propadaš u snijeg. Široka, mekana stopala deve rade isto u pijesku. Kamion koji vozi 20 tona ima mnogo širokih guma da ne razori cestu, a traktor ima goleme gume da ne propadne u blatnjavo polje.',
            'Ponekad želimo velik tlak. Nož brusimo tako da mu oštrica ima sićušnu površinu: isti pritisak ruke tada daje golem tlak koji reže rajčicu. Čavli, igle i pribadače imaju oštre vrhove iz istog razloga. Osoba u cipelama s visokom petom, s težinom na peti od 1 cm², pritišće pod većim tlakom nego slon svojim širokim stopalima. Zato pete ostavljaju udubine u mekom podu.'
          ]
        }
      },
      {
        h: { en: 'Pressure in liquids', hr: 'Tlak u tekućinama' },
        p: {
          en: [
            'Dive to the bottom of a pool and your ears hurt. The water above you presses down with its weight, and the deeper you go, the more water is above you. The pressure in a liquid grows with depth: p = ρ · g · h, density times g times depth. In water every 10 m of depth adds about 100 kPa, as much as the whole atmosphere. At 30 m a diver feels four times the pressure at the surface.',
            'Liquid pressure acts in all directions, not just downwards: it pushes on the sides of a container, on a fish from every side, and even upwards on the bottom of a boat. Because pressure grows with depth, dam walls are built much thicker at the bottom than at the top. A water tower stores water high up, so that the pressure is enough to push it through the pipes to every flat in town.',
            'Pour water into connected vessels, tubes of different shapes joined at the bottom, and the water settles at the same height in all of them. It does not matter whether a tube is wide or narrow: the pressure at the bottom depends only on the height of the water. Builders use this with a long transparent hose full of water to mark the same level in two far-apart corners of a room.'
          ],
          hr: [
            'Zaroni na dno bazena i zabole te uši. Voda iznad tebe pritišće svojom težinom, a što dublje ideš, iznad tebe je više vode. Tlak u tekućini raste s dubinom: p = ρ · g · h, gustoća puta g puta dubina. U vodi svakih 10 m dubine dodaje oko 100 kPa, koliko iznosi cijela atmosfera. Na 30 m ronilac osjeća četiri puta veći tlak nego na površini.',
            'Tlak u tekućini djeluje na sve strane, ne samo prema dolje: pritišće stijenke posude, ribu sa svih strana, pa čak i prema gore na dno čamca. Budući da tlak raste s dubinom, zidovi brana grade se puno deblji pri dnu nego pri vrhu. Vodotoranj drži vodu visoko kako bi tlak bio dovoljan da je potisne kroz cijevi do svakog stana u gradu.',
            'Ulij vodu u spojene posude, cijevi različitih oblika spojene pri dnu, i voda će se u svima smiriti na istoj visini. Nije važno je li cijev široka ili uska: tlak na dnu ovisi samo o visini vode. Građevinari to koriste dugim prozirnim crijevom punim vode da označe istu visinu u dva udaljena kuta prostorije.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><path d="M40,30 L40,110 L380,110 L380,30 M100,30 L100,90 L130,90 L130,30 M200,30 L200,90 L215,90 L215,30 M290,30 L290,90 L330,90 L330,30" fill="none" stroke="var(--fg)" stroke-width="2"/><path d="M41,58 L41,109 L379,109 L379,58 L331,58 L331,89 L289,89 L289,58 L216,58 L216,89 L199,89 L199,58 L131,58 L131,89 L99,89 L99,58 Z" fill="var(--c4)" opacity="0.4"/><line x1="25" y1="58" x2="395" y2="58" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/><text x="400" y="62" fill="var(--fg)" font-family="inherit" font-size="13" font-style="italic">h</text></svg>'
      },
      {
        h: { en: 'Pascal\'s law and hydraulics', hr: 'Pascalov zakon i hidraulika' },
        p: {
          en: [
            'Squeeze a closed bottle full of water and every part of the water feels the extra pressure equally, in all directions. Blaise Pascal discovered this rule: pressure applied to an enclosed liquid is passed on undiminished to every point of the liquid. Prick holes all over a plastic bottle, squeeze it, and water spurts out of every hole with the same strength.',
            'This is the secret of hydraulic machines. Imagine two pistons connected by a pipe full of oil, one small and one with ten times the area. Push the small piston with 100 N. The pressure travels through the oil and pushes on the big piston with ten times the force: 1000 N. Car brakes work like this: your foot presses a small piston and larger pistons squeeze the brake pads. Excavators, car lifts in garages and the dentist chair all use the same trick.',
            'There is a catch. To lift the big piston by 1 cm you have to push the small piston down by 10 cm. The force is ten times bigger, but the distance is ten times shorter. Hydraulics multiply force, not work: you never get something for nothing.'
          ],
          hr: [
            'Stisni zatvorenu bocu punu vode i svaki dio vode osjeti dodatni tlak jednako, na sve strane. To je pravilo otkrio Blaise Pascal: tlak koji djeluje na zatvorenu tekućinu prenosi se nesmanjen u svaku točku tekućine. Izbuši plastičnu bocu rupicama sa svih strana, stisni je, i voda će iz svake rupice šiknuti jednakom jačinom.',
            'To je tajna hidrauličkih strojeva. Zamisli dva klipa spojena cijevi punom ulja, jedan mali i jedan s deset puta većom površinom. Gurni mali klip silom od 100 N. Tlak putuje kroz ulje i na veliki klip djeluje deset puta većom silom: 1000 N. Tako rade kočnice automobila: tvoja noga pritišće mali klip, a veći klipovi stišću kočione pločice. Bageri, dizalice za automobile u radionicama i zubarski stolac koriste isti trik.',
            'Ali ima kvaka. Da veliki klip podigneš za 1 cm, mali moraš gurnuti 10 cm prema dolje. Sila je deset puta veća, ali put je deset puta kraći. Hidraulika umnožava silu, a ne rad: nikad ne dobivaš nešto za ništa.'
          ]
        }
      },
      {
        h: { en: 'Atmospheric pressure', hr: 'Atmosferski tlak' },
        p: {
          en: [
            'We live at the bottom of an ocean of air. Air has weight, and the column of air above one square metre of ground, reaching all the way up to space, weighs about 100 000 N. So the air presses on everything with about 101 kPa at sea level: around 10 N on every square centimetre of your skin. You do not feel it, because the air and the liquids inside your body push back just as hard.',
            'In 1643 Evangelista Torricelli filled a glass tube with mercury, turned it upside down into a bowl, and the mercury stayed up in the tube to a height of 76 cm. The air pressing on the mercury in the bowl held it there. He had built the first barometer. Today barometers help forecast the weather: falling pressure usually means rain is coming, rising pressure means fair weather.',
            'Climb a mountain and there is less air above you, so the pressure drops, by roughly 10 kPa for every kilometre at first. On top of Mount Everest it is only about a third of the value at sea level, which is why climbers carry oxygen. Water also boils at a lower temperature up there, so tea on a high mountain is never really hot.'
          ],
          hr: [
            'Živimo na dnu oceana zraka. Zrak ima težinu, a stupac zraka iznad jednog kvadratnog metra tla, sve do ruba svemira, ima težinu oko 100 000 N. Zato zrak na sve pritišće tlakom od oko 101 kPa na razini mora: oko 10 N na svaki kvadratni centimetar tvoje kože. Ne osjećaš ga, jer zrak i tekućine u tvom tijelu guraju natrag jednako jako.',
            'Godine 1643. Evangelista Torricelli napunio je staklenu cijev živom, okrenuo je naopako u zdjelicu i živa je u cijevi ostala stajati do visine od 76 cm. Držao ju je zrak koji pritišće živu u zdjelici. Napravio je prvi barometar. Danas barometri pomažu u prognozi vremena: pad tlaka obično najavljuje kišu, a porast lijepo vrijeme.',
            'Popni se na planinu i iznad tebe je manje zraka, pa tlak pada, isprva otprilike 10 kPa na svaki kilometar visine. Na vrhu Mount Everesta iznosi samo oko trećinu vrijednosti na razini mora, zato se penjači nose kisik. Ondje i voda vrije na nižoj temperaturi, pa čaj na visokoj planini nikad nije baš vruć.'
          ]
        }
      },
      {
        h: { en: 'Air pressure at work', hr: 'Tlak zraka na djelu' },
        p: {
          en: [
            'When a plane climbs, the pressure in the cabin drops a little, but the air trapped in your middle ear still has the old, higher pressure. It pushes your eardrum outwards, and you feel the pop when a small tube opens and lets the extra air out. Swallowing or yawning helps. The same thing happens in a fast lift or when driving down from a mountain.',
            'Drinking through a straw is not really sucking the liquid up. By expanding your lungs you lower the pressure inside the straw, and the atmosphere pressing on the surface of the drink pushes the juice up into your mouth. A suction cup works the same way: you press the air out from under it, and the outside air pressure holds it firmly against the tile. If the tile is dusty, air leaks in and the cup falls off.'
          ],
          hr: [
            'Kad se avion uspinje, tlak u kabini malo padne, ali zrak zarobljen u tvom srednjem uhu još ima stari, viši tlak. Gura bubnjić prema van, a ti osjetiš pucketanje kad se mala cjevčica otvori i propusti višak zraka. Pomaže gutanje ili zijevanje. Isto se događa u brzom dizalu ili pri vožnji s planine prema dolje.',
            'Piti na slamku zapravo nije usisavanje tekućine. Širenjem pluća smanjiš tlak u slamci, a atmosfera koja pritišće površinu pića gura sok prema gore u tvoja usta. Vakuumska prianjaljka (gumeni držač za pločice) radi isto: istisneš zrak ispod nje, a vanjski tlak zraka čvrsto je drži uz pločicu. Ako je pločica prašnjava, zrak uđe ispod i držač otpadne.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'pressure', hr: 'tlak' }, def: { en: 'Force divided by the area it acts on: p = F / A. Unit: pascal (Pa).', hr: 'Sila podijeljena površinom na koju djeluje: p = F / A. Jedinica: paskal (Pa).' } },
      { term: { en: 'pascal (Pa)', hr: 'paskal (Pa)' }, def: { en: 'The unit of pressure: one newton on one square metre. 1 kPa = 1000 Pa.', hr: 'Jedinica tlaka: jedan njutn na jedan kvadratni metar. 1 kPa = 1000 Pa.' } },
      { term: { en: 'bar', hr: 'bar' }, def: { en: 'An everyday unit of pressure. 1 bar ≈ 100 kPa, about the pressure of the atmosphere.', hr: 'Svakodnevna jedinica tlaka. 1 bar ≈ 100 kPa, otprilike tlak atmosfere.' } },
      { term: { en: 'area', hr: 'površina' }, def: { en: 'The size of the surface a force presses on, in m² or cm². Smaller area, bigger pressure.', hr: 'Veličina plohe na koju sila pritišće, u m² ili cm². Manja površina, veći tlak.' } },
      { term: { en: 'hydrostatic pressure', hr: 'hidrostatski tlak' }, def: { en: 'The pressure inside a liquid caused by its own weight. It grows with depth: p = ρ · g · h.', hr: 'Tlak u tekućini koji nastaje zbog njezine težine. Raste s dubinom: p = ρ · g · h.' } },
      { term: { en: 'connected vessels', hr: 'spojene posude' }, def: { en: 'Containers joined at the bottom. A liquid stands at the same height in all of them.', hr: 'Posude spojene pri dnu. Tekućina u svima stoji na istoj visini.' } },
      { term: { en: 'Pascal\'s law', hr: 'Pascalov zakon' }, def: { en: 'Pressure applied to an enclosed liquid is passed on equally to every part of the liquid.', hr: 'Tlak koji djeluje na zatvorenu tekućinu prenosi se jednako u svaki dio tekućine.' } },
      { term: { en: 'hydraulic machine', hr: 'hidraulički stroj' }, def: { en: 'A machine that uses liquid pressure to turn a small force on a small piston into a big force on a big piston.', hr: 'Stroj koji tlakom tekućine pretvara malu silu na malom klipu u veliku silu na velikom klipu.' } },
      { term: { en: 'piston', hr: 'klip' }, def: { en: 'A tight-fitting plug that slides in a cylinder and pushes on the liquid inside.', hr: 'Čep koji klizi u cilindru i pritišće tekućinu u njemu.' } },
      { term: { en: 'atmospheric pressure', hr: 'atmosferski tlak' }, def: { en: 'The pressure of the air around us, caused by the weight of the atmosphere. About 101 kPa at sea level.', hr: 'Tlak zraka oko nas, nastaje zbog težine atmosfere. Oko 101 kPa na razini mora.' } },
      { term: { en: 'barometer', hr: 'barometar' }, def: { en: 'An instrument that measures atmospheric pressure, invented by Torricelli in 1643.', hr: 'Sprava za mjerenje atmosferskog tlaka, izumio ju je Torricelli 1643. godine.' } }
    ],

    formulas: [
      { expr: 'p = F / A', name: { en: 'pressure', hr: 'tlak' }, note: { en: 'force divided by area; 1 Pa = 1 N/m²', hr: 'sila podijeljena površinom; 1 Pa = 1 N/m²' } },
      { expr: 'p = ρ · g · h', name: { en: 'pressure in a liquid', hr: 'hidrostatski tlak' }, note: { en: 'density × g × depth; about 100 kPa for every 10 m of water', hr: 'gustoća × g × dubina; oko 100 kPa za svakih 10 m vode' } },
      { expr: 'F₂ = F₁ · A₂ / A₁', name: { en: 'hydraulic lift', hr: 'hidraulička dizalica' }, note: { en: 'the big piston gets as many times more force as its area is bigger', hr: 'veliki klip dobiva toliko puta veću silu koliko mu je površina veća' } },
      { expr: '1 bar ≈ 100 kPa = 100 000 Pa', name: { en: 'units of pressure', hr: 'jedinice tlaka' }, note: { en: 'atmospheric pressure at sea level ≈ 101 kPa', hr: 'atmosferski tlak na razini mora ≈ 101 kPa' } }
    ],

    funFact: {
      en: 'In 1654 Otto von Guericke pumped the air out of two joined metal hemispheres in Magdeburg. Two teams of eight horses could not pull them apart, yet they fell apart by themselves as soon as he let the air back in.',
      hr: 'Godine 1654. Otto von Guericke ispumpao je zrak iz dviju spojenih metalnih polukugli u Magdeburgu. Dvije zaprege od po osam konja nisu ih mogle razdvojiti, a raspale su se same čim je pustio zrak natrag.'
    },

    experiment: {
      title: { en: 'The leaking bottle and the upside-down glass', hr: 'Boca koja prska i okrenuta čaša' },
      materials: {
        en: ['an empty 1.5 L plastic bottle', 'a nail or a skewer (an adult makes the holes)', 'a strip of sticky tape', 'water', 'a sink, a basin or a spot outdoors', 'a drinking glass', 'a postcard or a piece of stiff, smooth cardboard'],
        hr: ['prazna plastična boca od 1,5 L', 'čavao ili ražnjić (rupe buši odrasla osoba)', 'traka selotejpa', 'voda', 'sudoper, lavor ili mjesto na otvorenom', 'čaša za piće', 'razglednica ili komad tvrdog, glatkog kartona']
      },
      steps: {
        en: [
          'Ask an adult to make three holes of the same size in a vertical line on the bottle: one near the bottom, one in the middle and one near the top.',
          'Cover all three holes with one strip of tape and fill the bottle to the top with water.',
          'Stand the bottle at the edge of the sink and pull the tape off in one go. Watch the three jets.',
          'Which jet shoots farthest? Watch how the jets change as the water level falls.',
          'Now fill the glass to the brim with water and lay the postcard flat on top so it touches the water everywhere.',
          'Hold the card on with your palm and turn the glass upside down over the sink. Carefully take your hand away. The card stays on and the water stays in!'
        ],
        hr: [
          'Zamoli odraslu osobu da na boci napravi tri jednake rupice u okomitom nizu: jednu blizu dna, jednu u sredini i jednu blizu vrha.',
          'Prekrij sve tri rupice jednom trakom selotejpa i napuni bocu vodom do vrha.',
          'Stavi bocu na rub sudopera i u jednom potezu skini selotejp. Promatraj tri mlaza.',
          'Koji mlaz prska najdalje? Gledaj kako se mlazovi mijenjaju dok razina vode pada.',
          'Sad napuni čašu vodom do vrha i polegni razglednicu na nju tako da svugdje dodiruje vodu.',
          'Pridrži razglednicu dlanom i okreni čašu naopako iznad sudopera. Oprezno makni ruku. Razglednica ostaje, a voda ne izlazi!'
        ]
      },
      explain: {
        en: 'In the bottle the pressure grows with depth, so the water near the bottom is pushed out hardest and that jet shoots farthest; as the level falls, every jet gets weaker. The card stays on the glass because the atmosphere pushes up on it with about 10 N per square centimetre, far more than the weight of the water pressing down. A little air leaking in breaks the trick, so the card must seal the rim.',
        hr: 'U boci tlak raste s dubinom, pa je voda blizu dna najjače potisnuta i taj mlaz prska najdalje; kako razina pada, svaki mlaz slabi. Razglednica ostaje na čaši jer je atmosfera gura prema gore s oko 10 N po kvadratnom centimetru, daleko više od težine vode koja pritišće prema dolje. Malo zraka koji uđe pokvari trik, zato razglednica mora dobro brtviti rub.'
      },
      safety: { en: 'Let an adult make the holes, and do both experiments over a sink or outside: things will get wet.', hr: 'Rupe neka buši odrasla osoba, a oba pokusa radi iznad sudopera ili vani: bit će mokro.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'How do we calculate pressure?', hr: 'Kako računamo tlak?' },
        options: [{ en: 'force times area', hr: 'sila puta površina' }, { en: 'force divided by area', hr: 'sila podijeljena površinom' }, { en: 'area divided by force', hr: 'površina podijeljena silom' }, { en: 'mass divided by volume', hr: 'masa podijeljena obujmom' }], answer: 1,
        explain: { en: 'p = F / A. The same force on a smaller area gives a bigger pressure. Mass divided by volume is density.', hr: 'p = F / A. Ista sila na manjoj površini daje veći tlak. Masa podijeljena obujmom je gustoća.' } },
      { type: 'mc', q: { en: 'What is the unit of pressure?', hr: 'Koja je jedinica tlaka?' },
        options: [{ en: 'pascal (Pa)', hr: 'paskal (Pa)' }, { en: 'newton (N)', hr: 'njutn (N)' }, { en: 'joule (J)', hr: 'džul (J)' }, { en: 'kilogram (kg)', hr: 'kilogram (kg)' }], answer: 0,
        explain: { en: 'One pascal is one newton spread over one square metre. The newton is the unit of force, the joule of energy and the kilogram of mass.', hr: 'Jedan paskal je jedan njutn raspoređen na jedan kvadratni metar. Njutn je jedinica sile, džul energije, a kilogram mase.' } },
      { type: 'num', q: { en: 'A box weighs 600 N and stands on a base of 2 m². What pressure does it put on the floor?', hr: 'Kutija ima težinu 600 N i stoji na podlozi površine 2 m². Kolikim tlakom pritišće pod?' },
        answer: 300, tolerance: 1, unit: 'Pa',
        explain: { en: 'p = F / A = 600 N / 2 m² = 300 Pa.', hr: 'p = F / A = 600 N / 2 m² = 300 Pa.' } },
      { type: 'mc', q: { en: 'Why do skis stop you sinking into deep snow?', hr: 'Zašto na skijama ne propadaš u duboki snijeg?' },
        options: [{ en: 'they are very light', hr: 'vrlo su lagane' }, { en: 'they are smooth and slide', hr: 'glatke su i klize' }, { en: 'they spread your weight over a larger area, so the pressure is smaller', hr: 'raspoređuju tvoju težinu na veću površinu, pa je tlak manji' }, { en: 'they warm up the snow', hr: 'zagrijavaju snijeg' }], answer: 2,
        explain: { en: 'Your weight does not change, but the area is many times bigger than your boots, so the pressure on the snow is many times smaller.', hr: 'Tvoja težina se ne mijenja, ali površina je mnogo puta veća nego kod čizama, pa je tlak na snijeg mnogo puta manji.' } },
      { type: 'tf', q: { en: 'The pressure in water grows with depth.', hr: 'Tlak u vodi raste s dubinom.' }, answer: true,
        explain: { en: 'The deeper you go, the more water is above you pressing down. Every 10 m of water adds about 100 kPa.', hr: 'Što dublje ideš, iznad tebe je više vode koja pritišće. Svakih 10 m vode dodaje oko 100 kPa.' } },
      { type: 'mc', q: { en: 'Water is poured into connected vessels: one tube is narrow, one is wide. Where does the water stand highest?', hr: 'Voda se ulijeva u spojene posude: jedna je cijev uska, druga široka. Gdje voda stoji najviše?' },
        options: [{ en: 'in the narrow tube', hr: 'u uskoj cijevi' }, { en: 'in the wide tube', hr: 'u širokoj cijevi' }, { en: 'it depends on which tube you pour into', hr: 'ovisi u koju cijev ulijevaš' }, { en: 'at the same height in both tubes', hr: 'na istoj visini u obje cijevi' }], answer: 3,
        explain: { en: 'The pressure at the bottom depends only on the height of the water, so the water settles at the same level in every tube, whatever its shape.', hr: 'Tlak na dnu ovisi samo o visini vode, pa se voda smiri na istoj razini u svakoj cijevi, bez obzira na oblik.' } },
      { type: 'mc', q: { en: 'Atmospheric pressure at sea level is about…', hr: 'Atmosferski tlak na razini mora iznosi oko…' },
        options: [{ en: '1 kPa', hr: '1 kPa' }, { en: '10 kPa', hr: '10 kPa' }, { en: '101 kPa', hr: '101 kPa' }, { en: '1000 kPa', hr: '1000 kPa' }], answer: 2,
        explain: { en: 'About 101 kPa, which is roughly 1 bar: around 10 N on every square centimetre.', hr: 'Oko 101 kPa, što je otprilike 1 bar: oko 10 N na svaki kvadratni centimetar.' } },
      { type: 'tf', q: { en: 'Atmospheric pressure is greater on top of a mountain than at the seaside.', hr: 'Atmosferski tlak veći je na vrhu planine nego na morskoj obali.' }, answer: false,
        explain: { en: 'Higher up there is less air above you, so the pressure is lower. On Everest it is only about a third of the value at sea level.', hr: 'Više gore iznad tebe je manje zraka, pa je tlak niži. Na Everestu iznosi samo oko trećinu vrijednosti na razini mora.' } },
      { type: 'num', q: { en: 'In a hydraulic lift the small piston has an area of 1 cm² and is pushed with 50 N. The big piston has an area of 20 cm². The pressure is the same on both. What force does the big piston push with?', hr: 'U hidrauličkoj dizalici mali klip ima površinu 1 cm² i guramo ga silom 50 N. Veliki klip ima površinu 20 cm². Tlak je na oba klipa jednak. Kolikom silom gura veliki klip?' },
        answer: 1000, tolerance: 5, unit: 'N',
        explain: { en: 'The pressure is 50 N / 1 cm² = 50 N per cm². On 20 cm² that gives 50 N × 20 = 1000 N: twenty times the force, because the area is twenty times bigger.', hr: 'Tlak je 50 N / 1 cm² = 50 N po cm². Na 20 cm² to daje 50 N × 20 = 1000 N: dvadeset puta veća sila, jer je površina dvadeset puta veća.' } },
      { type: 'mc', q: { en: 'Why is a dam wall built thicker at the bottom than at the top?', hr: 'Zašto se zid brane gradi deblji pri dnu nego pri vrhu?' },
        options: [{ en: 'because the whole dam must weigh more', hr: 'jer cijela brana mora biti teža' }, { en: 'because water flows faster at the bottom', hr: 'jer voda pri dnu teče brže' }, { en: 'because the pressure of the water is greatest at the bottom', hr: 'jer je tlak vode najveći pri dnu' }, { en: 'because the top gets more sunshine', hr: 'jer vrh dobiva više sunca' }], answer: 2,
        explain: { en: 'Pressure in a liquid grows with depth, so the bottom of the wall must hold back a much bigger push than the top.', hr: 'Tlak u tekućini raste s dubinom, pa dno zida mora izdržati puno veći pritisak nego vrh.' } },
      { type: 'mc', q: { en: 'How does juice rise up a straw?', hr: 'Kako se sok diže kroz slamku?' },
        options: [{ en: 'the muscles of your mouth suck the juice up', hr: 'mišići usta usisaju sok prema gore' }, { en: 'the atmosphere pushes the juice up when you lower the pressure inside the straw', hr: 'atmosfera gura sok prema gore kad smanjiš tlak u slamci' }, { en: 'the juice climbs by itself because it is wet', hr: 'sok se sam penje jer je mokar' }, { en: 'the straw warms the juice and it expands', hr: 'slamka zagrije sok i on se proširi' }], answer: 1,
        explain: { en: 'You only lower the pressure in the straw. The air pressing on the drink in the glass then pushes the juice up into the space of lower pressure.', hr: 'Ti samo smanjiš tlak u slamci. Zrak koji pritišće piće u čaši tada gura sok prema gore, u prostor nižeg tlaka.' } }
    ]
  });
})();
