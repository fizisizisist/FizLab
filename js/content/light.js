/* FizLab topic: Light / Svjetlost */
(function () {
  'use strict';
  window.Content.register({
    id: 'light',
    order: 130,
    gradeLevel: 8,
    color: 'c5',
    title: { en: 'Light', hr: 'Svjetlost' },
    intro: {
      en: 'Light races at 300 000 km/s, bounces off mirrors, bends in water and hides a whole rainbow inside every sunbeam. Learn how it lets you see the world.',
      hr: 'Svjetlost juri brzinom od 300 000 km/s, odbija se od zrcala, lomi se u vodi i u svakoj sunčevoj zraci skriva cijelu dugu. Nauči kako ti omogućuje da vidiš svijet.'
    },
    sims: ['light', 'color'],

    lesson: [
      {
        h: { en: 'Sources of light and how it travels', hr: 'Izvori svjetlosti i kako se svjetlost širi' },
        p: {
          en: [
            'Some things make their own light: the Sun and other stars, a candle flame, a light bulb, a phone screen, a firefly. These are light sources. Most things around you are not sources. You see a book, a tree or the Moon only because light from a source bounces off them and into your eyes. The Moon has no light of its own; it shines with reflected sunlight.',
            'Light travels in straight lines. You cannot see around a corner, and a torch beam in fog looks like a straight ruler. Light is also incredibly fast: about 300 000 kilometres every second, fast enough to circle the Earth seven times in one second. Even so, the Sun is so far away that its light takes about 8 minutes to reach us. When you look at the Sun (never directly!), you see it as it was 8 minutes ago.',
            'For the enormous distances between stars, astronomers use the light year: the distance light travels in one year, about 9.5 trillion kilometres. The nearest star after the Sun is 4.2 light years away. Its light left more than four years ago and only now arrives at your eye.'
          ],
          hr: [
            'Neke stvari stvaraju vlastitu svjetlost: Sunce i druge zvijezde, plamen svijeće, žarulja, zaslon mobitela, krijesnica. To su izvori svjetlosti. Većina stvari oko tebe nisu izvori. Knjigu, drvo ili Mjesec vidiš samo zato što se svjetlost iz nekog izvora odbije od njih i stigne do tvojih očiju. Mjesec nema vlastite svjetlosti; sjaji odbijenom Sunčevom svjetlošću.',
            'Svjetlost se širi pravocrtno. Ne možeš vidjeti iza ugla, a snop džepne svjetiljke u magli izgleda ravno kao ravnalo. Svjetlost je i nevjerojatno brza: oko 300 000 kilometara svake sekunde, dovoljno brzo da u jednoj sekundi sedam puta obiđe Zemlju. Ipak, Sunce je toliko daleko da njegovoj svjetlosti treba oko 8 minuta do nas. Kad pogledaš Sunce (nikad izravno!), vidiš ga kakvo je bilo prije 8 minuta.',
            'Za goleme udaljenosti među zvijezdama astronomi koriste svjetlosnu godinu: udaljenost koju svjetlost prijeđe za godinu dana, oko 9,5 bilijuna kilometara. Nama najbliža zvijezda nakon Sunca udaljena je 4,2 svjetlosne godine. Njezina svjetlost krenula je prije više od četiri godine i tek sada stiže do tvog oka.'
          ]
        }
      },
      {
        h: { en: 'Transparent, translucent, opaque: shadows and eclipses', hr: 'Prozirno, prozračno, neprozirno: sjene i pomrčine' },
        p: {
          en: [
            'Materials treat light in three ways. Transparent materials, like clear glass, water and air, let light pass straight through, so you can see objects behind them clearly. Translucent materials, like frosted glass, thin paper or a plastic milk bottle, let light through but scatter it, so you see only a blur. Opaque materials, like wood, metal and your body, block light completely.',
            'Because light travels in straight lines, an opaque object blocks it and leaves a dark region behind: a shadow. A small light source gives a sharp shadow; a large one gives a shadow with blurry edges. Your shadow is long in the morning and evening, when the Sun is low, and shortest at noon.',
            'Eclipses are shadows in space. In a solar eclipse the Moon passes between the Sun and the Earth, and its shadow falls on a small part of the Earth, where the day turns briefly dark. In a lunar eclipse the Earth is between the Sun and the Moon, and the Moon moves into the Earth’s shadow, turning a dim copper red.'
          ],
          hr: [
            'Tvari propuštaju svjetlost na tri načina. Prozirne tvari, poput čistog stakla, vode i zraka, propuštaju svjetlost ravno, pa predmete iza njih vidiš jasno. Prozračne tvari, poput mutnog stakla, tankog papira ili plastične boce za mlijeko, propuštaju svjetlost, ali je raspršuju, pa vidiš samo mutne obrise. Neprozirne tvari, poput drva, metala i tvog tijela, potpuno zaustavljaju svjetlost.',
            'Budući da se svjetlost širi pravocrtno, neprozirno tijelo je zaustavi i iza sebe ostavi tamno područje: sjenu. Mali izvor svjetlosti daje oštru sjenu, a veliki sjenu s mutnim rubovima. Tvoja je sjena duga ujutro i navečer, kad je Sunce nisko, a najkraća u podne.',
            'Pomrčine su sjene u svemiru. Kod pomrčine Sunca Mjesec prolazi između Sunca i Zemlje, a njegova sjena pada na mali dio Zemlje, gdje dan nakratko potamni. Kod pomrčine Mjeseca Zemlja je između Sunca i Mjeseca, pa Mjesec ulazi u Zemljinu sjenu i poprima tamnu bakrenocrvenu boju.'
          ]
        }
      },
      {
        h: { en: 'Reflection and mirrors', hr: 'Odbijanje svjetlosti i zrcala' },
        p: {
          en: [
            'When light hits a surface, it bounces back: it is reflected. The rule is simple. Imagine a line standing straight up from the surface at the point where the ray hits (the normal). The angle between the incoming ray and this line, the angle of incidence, is always equal to the angle between the reflected ray and the line, the angle of reflection. A ray arriving at 30° leaves at 30°, like a ball bouncing off a wall.',
            'A flat (plane) mirror reflects all the rays in an orderly way, so you see a clear image. The image appears to be behind the mirror, exactly as far behind it as you are in front, and the same size as you. It is called a virtual image because no light actually comes from behind the mirror; your brain just traces the rays back in straight lines. The image is also flipped front to back, which is why writing looks reversed.',
            'Why can you not see your face in a sheet of paper? Paper looks smooth but is rough on a tiny scale. Each ray still obeys the law of reflection, but the surface points in all directions, so the rays scatter everywhere. This diffuse reflection is what lets you see the paper from any angle. Only very smooth surfaces, like polished metal, glass or still water, reflect like a mirror.'
          ],
          hr: [
            'Kad svjetlost udari u površinu, odbija se. Pravilo je jednostavno. Zamisli okomicu na površinu u točki u koju zraka upada. Kut između upadne zrake i okomice, upadni kut, uvijek je jednak kutu između odbijene zrake i okomice, kutu odbijanja. Zraka koja upada pod 30° odbija se pod 30°, kao lopta koja se odbija od zida.',
            'Ravno zrcalo odbija sve zrake uredno, pa vidiš jasnu sliku. Slika se čini iza zrcala, točno jednako daleko iza njega koliko si ti ispred, i jednako je velika kao ti. Zove se virtualna slika jer svjetlost zapravo ne dolazi iza zrcala; tvoj mozak samo produži zrake unatrag po pravcima. Slika je i zamijenjena sprijeda-straga, zato tekst u zrcalu izgleda naopako.',
            'Zašto svoje lice ne možeš vidjeti u listu papira? Papir izgleda glatko, ali je na sitnoj ljestvici hrapav. Svaka zraka i dalje slijedi zakon odbijanja, ali površina je okrenuta na sve strane, pa se zrake rasprše u svim smjerovima. To raspršeno odbijanje omogućuje ti da papir vidiš iz bilo kojeg kuta. Samo vrlo glatke površine, poput poliranog metala, stakla ili mirne vode, odbijaju svjetlost poput zrcala.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><defs><marker id="lt-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><rect x="60" y="108" width="300" height="10" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><line x1="210" y1="108" x2="210" y2="15" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="90" y1="28" x2="206" y2="105" stroke="var(--c5)" stroke-width="3" marker-end="url(#lt-ar)"/><line x1="210" y1="108" x2="326" y2="31" stroke="var(--c5)" stroke-width="3" marker-end="url(#lt-ar)"/><path d="M210,60 A48,48 0 0 0 180,67" fill="none" stroke="var(--c1)" stroke-width="2"/><path d="M210,60 A48,48 0 0 1 240,67" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="186" y="50" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">α</text><text x="236" y="50" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">β</text><text x="330" y="100" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">α = β</text></svg>'
      },
      {
        h: { en: 'Refraction and lenses', hr: 'Lom svjetlosti i leće' },
        p: {
          en: [
            'Light travels a little slower in water or glass than in air. When a ray passes from one medium into another at an angle, this change of speed makes it bend. We call this refraction. It is why a straw in a glass of water looks broken at the surface, why a swimming pool looks shallower than it really is, and why a fish under water is not quite where it seems to be.',
            'A lens is a curved piece of glass or plastic shaped to bend light in a useful way. A converging lens is thicker in the middle. It bends parallel rays inward so that they meet at one point, the focus. Hold a magnifying glass in sunlight and you can gather the Sun’s rays into one bright, hot spot. A diverging lens is thinner in the middle and spreads rays apart, making things look smaller.'
          ],
          hr: [
            'Svjetlost putuje malo sporije kroz vodu ili staklo nego kroz zrak. Kad zraka prelazi iz jednog sredstva u drugo pod nekim kutom, ta promjena brzine je skrene. To zovemo lom svjetlosti. Zato slamka u čaši vode izgleda slomljeno na površini, zato bazen izgleda plići nego što jest i zato riba pod vodom nije baš ondje gdje se čini da jest.',
            'Leća je zakrivljeni komad stakla ili plastike oblikovan tako da korisno lomi svjetlost. Konvergentna (sabirna) leća deblja je u sredini. Ona usporedne zrake lomi prema unutra tako da se sastanu u jednoj točki, žarištu. Drži povećalo na suncu i možeš skupiti Sunčeve zrake u jednu svijetlu, vruću točku. Divergentna (rastresna) leća tanja je u sredini i razdvaja zrake, pa predmeti kroz nju izgledaju manji.'
          ]
        },
        svg: '<svg viewBox="0 0 420 120" role="img"><line x1="20" y1="60" x2="400" y2="60" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="30" y1="25" x2="200" y2="25" stroke="var(--c5)" stroke-width="3"/><line x1="30" y1="42" x2="200" y2="42" stroke="var(--c5)" stroke-width="3"/><line x1="30" y1="78" x2="200" y2="78" stroke="var(--c5)" stroke-width="3"/><line x1="30" y1="95" x2="200" y2="95" stroke="var(--c5)" stroke-width="3"/><line x1="200" y1="25" x2="330" y2="60" stroke="var(--c5)" stroke-width="3"/><line x1="200" y1="42" x2="330" y2="60" stroke="var(--c5)" stroke-width="3"/><line x1="200" y1="78" x2="330" y2="60" stroke="var(--c5)" stroke-width="3"/><line x1="200" y1="95" x2="330" y2="60" stroke="var(--c5)" stroke-width="3"/><line x1="330" y1="60" x2="400" y2="40" stroke="var(--c5)" stroke-width="2"/><line x1="330" y1="60" x2="400" y2="80" stroke="var(--c5)" stroke-width="2"/><path d="M200,10 C224,30 224,90 200,110 C176,90 176,30 200,10 z" fill="var(--c3)" fill-opacity="0.5" stroke="var(--fg)" stroke-width="2"/><circle cx="330" cy="60" r="4" fill="var(--c1)"/><text x="330" y="82" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="14" font-weight="700">F</text></svg>'
      },
      {
        h: { en: 'The eye, glasses and optical instruments', hr: 'Oko, naočale i optičke sprave' },
        p: {
          en: [
            'Your eye is a camera made of living tissue. Light enters through the clear cornea and the pupil, the black hole in the middle. The lens behind it is a converging lens that bends the light to form a sharp, upside-down image on the retina at the back of the eye. The retina turns the picture into signals, and the brain flips it the right way up. Small muscles change the shape of the lens to focus on near or far things.',
            'If the eye is a bit too long, or the lens bends light too much, distant objects focus in front of the retina and look blurry: that is near-sightedness, corrected with diverging lenses in glasses. If the eye is too short, near objects focus behind the retina: far-sightedness, corrected with converging lenses. Reading glasses for grandparents are converging lenses too.',
            'A magnifying glass is a single converging lens held close to a small object, making it look bigger. A camera uses a lens to form a small sharp image on a sensor, just as the eye does on the retina. Microscopes and telescopes combine several lenses, letting us see bacteria and the moons of Jupiter.'
          ],
          hr: [
            'Tvoje oko je fotoaparat od živog tkiva. Svjetlost ulazi kroz prozirnu rožnicu i zjenicu, crnu rupicu u sredini. Očna leća iza nje je konvergentna leća koja lomi svjetlost i na mrežnici na stražnjoj strani oka stvara oštru, obrnutu sliku. Mrežnica pretvara sliku u signale, a mozak je okrene kako treba. Sitni mišići mijenjaju oblik leće da bi oko izoštrilo bliske ili daleke predmete.',
            'Ako je oko malo predugačko ili leća prejako lomi svjetlost, daleki se predmeti izoštre ispred mrežnice i izgledaju mutno: to je kratkovidnost, koja se ispravlja divergentnim lećama u naočalama. Ako je oko prekratko, bliski se predmeti izoštre iza mrežnice: to je dalekovidnost, koja se ispravlja konvergentnim lećama. Naočale za čitanje koje nose bake i djedovi također su konvergentne leće.',
            'Povećalo je jedna konvergentna leća koju držimo blizu malog predmeta da bi izgledao veći. Fotoaparat lećom stvara malu oštru sliku na senzoru, baš kao oko na mrežnici. Mikroskopi i teleskopi spajaju više leća i omogućuju nam da vidimo bakterije i Jupiterove mjesece.'
          ]
        }
      },
      {
        h: { en: 'Colours', hr: 'Boje' },
        p: {
          en: [
            'White sunlight looks plain, but it is a mixture of all the colours. Isaac Newton showed this in 1666 by letting a thin beam of sunlight pass through a glass prism: the beam spread into a band of red, orange, yellow, green, blue, indigo and violet. Raindrops do the same with sunlight, which is why we see a rainbow when the Sun shines from behind us onto falling rain.',
            'Objects have colour because of which colours they reflect and which they absorb. A red apple absorbs most colours and reflects mainly red into your eye. A white shirt reflects all colours; a black one absorbs them all, which is why black clothes get hot in the sun. Shine only blue light on a red apple and it looks almost black, because there is no red to reflect.',
            'Mixing light and mixing paint work differently. Screens mix red, green and blue light: all three together make white, and by varying their brightness a phone screen produces every colour you see. Paints and inks instead absorb light, so mixing many of them takes more and more colours away and ends in a muddy brown or black. And the sky is blue because the air scatters blue sunlight in all directions much more than red.'
          ],
          hr: [
            'Bijela Sunčeva svjetlost izgleda obično, ali je mješavina svih boja. Isaac Newton to je pokazao 1666. godine pustivši tanak snop sunčeve svjetlosti kroz staklenu prizmu: snop se raširio u vrpcu crvene, narančaste, žute, zelene, plave, modre (indigo) i ljubičaste boje. Kapi kiše čine isto sa sunčevom svjetlošću, zato vidimo dugu kad nam Sunce sja iza leđa na kišu koja pada.',
            'Predmeti imaju boju zbog toga koje boje odbijaju, a koje upijaju. Crvena jabuka upija većinu boja, a prema tvom oku odbija uglavnom crvenu. Bijela majica odbija sve boje; crna ih sve upija, zato se crna odjeća na suncu jako ugrije. Osvijetli crvenu jabuku samo plavom svjetlošću i izgledat će gotovo crna, jer nema crvene koju bi odbila.',
            'Miješanje svjetlosti i miješanje boja za slikanje ne rade jednako. Zasloni miješaju crvenu, zelenu i plavu svjetlost: sve tri zajedno daju bijelu, a mijenjajući njihov sjaj zaslon mobitela stvara svaku boju koju vidiš. Boje za slikanje i tinte, naprotiv, upijaju svjetlost, pa miješanje mnogih od njih oduzima sve više boja i završava u blatnjavosmeđoj ili crnoj. A nebo je plavo zato što zrak raspršuje plavu sunčevu svjetlost na sve strane mnogo jače nego crvenu.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'light source', hr: 'izvor svjetlosti' }, def: { en: 'Something that makes its own light: the Sun, a flame, a bulb. The Moon is not one; it reflects sunlight.', hr: 'Nešto što stvara vlastitu svjetlost: Sunce, plamen, žarulja. Mjesec nije izvor; on odbija Sunčevu svjetlost.' } },
      { term: { en: 'light year', hr: 'svjetlosna godina' }, def: { en: 'The distance light travels in one year, about 9.5 trillion km. A unit of distance, not time.', hr: 'Udaljenost koju svjetlost prijeđe za jednu godinu, oko 9,5 bilijuna km. Jedinica za udaljenost, ne za vrijeme.' } },
      { term: { en: 'shadow', hr: 'sjena' }, def: { en: 'The dark region behind an opaque object that blocks light travelling in straight lines.', hr: 'Tamno područje iza neprozirnog tijela koje zaustavlja svjetlost što se širi pravocrtno.' } },
      { term: { en: 'eclipse', hr: 'pomrčina' }, def: { en: 'A shadow in space: the Moon shading part of the Earth (solar) or the Earth shading the Moon (lunar).', hr: 'Sjena u svemiru: Mjesec zasjeni dio Zemlje (pomrčina Sunca) ili Zemlja zasjeni Mjesec (pomrčina Mjeseca).' } },
      { term: { en: 'law of reflection', hr: 'zakon odbijanja (refleksije)' }, def: { en: 'The angle of incidence equals the angle of reflection, both measured from the normal.', hr: 'Upadni kut jednak je kutu odbijanja, oba mjerena od okomice.' } },
      { term: { en: 'virtual image', hr: 'virtualna slika' }, def: { en: 'The image in a plane mirror: same size, as far behind the mirror as the object is in front; no light really comes from it.', hr: 'Slika u ravnom zrcalu: iste veličine, jednako daleko iza zrcala koliko je predmet ispred; svjetlost zapravo ne dolazi iz nje.' } },
      { term: { en: 'refraction', hr: 'lom svjetlosti (refrakcija)' }, def: { en: 'The bending of light when it passes from one medium into another, such as from air into water.', hr: 'Skretanje svjetlosti pri prelasku iz jednog sredstva u drugo, na primjer iz zraka u vodu.' } },
      { term: { en: 'converging lens', hr: 'konvergentna (sabirna) leća' }, def: { en: 'A lens thicker in the middle that gathers parallel rays into a focus: magnifying glass, eye lens.', hr: 'Leća deblja u sredini koja usporedne zrake skuplja u žarište: povećalo, očna leća.' } },
      { term: { en: 'diverging lens', hr: 'divergentna (rastresna) leća' }, def: { en: 'A lens thinner in the middle that spreads rays apart; used in glasses for near-sightedness.', hr: 'Leća tanja u sredini koja razdvaja zrake; koristi se u naočalama za kratkovidnost.' } },
      { term: { en: 'focus', hr: 'žarište' }, def: { en: 'The point where a converging lens brings parallel rays together.', hr: 'Točka u kojoj konvergentna leća sastavlja usporedne zrake.' } },
      { term: { en: 'retina', hr: 'mrežnica' }, def: { en: 'The light-sensitive layer at the back of the eye where the lens forms an upside-down image.', hr: 'Sloj osjetljiv na svjetlost na stražnjoj strani oka na kojem leća stvara obrnutu sliku.' } },
      { term: { en: 'spectrum', hr: 'spektar' }, def: { en: 'The band of colours (red to violet) that white light splits into in a prism or a rainbow.', hr: 'Vrpca boja (od crvene do ljubičaste) na koju se bijela svjetlost rastavlja u prizmi ili dugi.' } }
    ],

    formulas: [
      { expr: 'α = β', name: { en: 'law of reflection', hr: 'zakon odbijanja' }, note: { en: 'angle of incidence = angle of reflection', hr: 'upadni kut = kut odbijanja' } },
      { expr: 'c ≈ 300 000 km/s', name: { en: 'speed of light', hr: 'brzina svjetlosti' }, note: { en: 'about 8 minutes from the Sun, 1.3 s from the Moon', hr: 'oko 8 minuta od Sunca, 1,3 s od Mjeseca' } },
      { expr: 't = d / c', name: { en: 'travel time of light', hr: 'vrijeme putovanja svjetlosti' }, note: { en: 'distance divided by the speed of light', hr: 'udaljenost podijeljena s brzinom svjetlosti' } }
    ],

    funFact: {
      en: 'The Moon is about 384 000 km away, so the moonlight you see left its surface 1.3 seconds ago. And the sunlight it reflects had already travelled 8 minutes from the Sun before bouncing off the Moon.',
      hr: 'Mjesec je udaljen oko 384 000 km, pa je mjesečina koju vidiš napustila njegovu površinu prije 1,3 sekunde. A Sunčeva svjetlost koju Mjesec odbija već je putovala 8 minuta od Sunca prije nego što se odbila od njega.'
    },

    experiment: {
      title: { en: 'The reappearing coin', hr: 'Kovanica koja se ponovno pojavljuje' },
      materials: {
        en: ['an opaque mug or bowl', 'a coin', 'a jug of water', 'a friend', 'bonus: a glass full of water, a sunny windowsill and a sheet of white paper'],
        hr: ['neprozirna šalica ili zdjelica', 'kovanica', 'vrč vode', 'prijatelj', 'dodatak: čaša puna vode, sunčana prozorska daska i list bijelog papira']
      },
      steps: {
        en: [
          'Put the coin on the bottom of the empty mug, close to the far side.',
          'Step back and slowly lower your head until the coin just disappears behind the rim of the mug. Stay exactly in that position.',
          'Your friend slowly pours water into the mug without moving the mug or the coin.',
          'Watch: the coin slowly comes back into view, as if the bottom of the mug had risen.',
          'Try it the other way round: look at the coin through the water from above and ask your friend how deep the mug really is. It looks shallower than it is.',
          'Bonus: on a sunny day, place the glass of water on the windowsill so the Sun shines through it onto the white paper on the floor. Look for a small rainbow on the paper.'
        ],
        hr: [
          'Stavi kovanicu na dno prazne šalice, blizu suprotnog ruba.',
          'Odmakni se i polako spuštaj glavu dok kovanica upravo ne nestane iza ruba šalice. Ostani točno u tom položaju.',
          'Prijatelj polako nalijeva vodu u šalicu, ne pomičući ni šalicu ni kovanicu.',
          'Gledaj: kovanica se polako ponovno pojavljuje, kao da se dno šalice podiglo.',
          'Probaj i obrnuto: gledaj kovanicu kroz vodu odozgo i pitaj prijatelja koliko je šalica zapravo duboka. Izgleda plića nego što jest.',
          'Dodatak: za sunčanog dana stavi čašu vode na prozorsku dasku tako da Sunce sja kroz nju na bijeli papir na podu. Potraži malu dugu na papiru.'
        ]
      },
      explain: {
        en: 'Light from the coin bends (refracts) as it leaves the water and enters the air, so rays that used to hit the side of the mug now bend over the rim and reach your eye. Your brain assumes light travels straight, so it sees the coin higher than it really is. The same effect makes pools look shallower. In the bonus, the curved glass of water acts as a prism: it bends each colour by a slightly different amount and spreads the white sunlight into a spectrum, just like raindrops make a rainbow.',
        hr: 'Svjetlost s kovanice lomi se pri prelasku iz vode u zrak, pa zrake koje su prije udarale u stijenku šalice sad skrenu preko ruba i stignu do tvog oka. Tvoj mozak pretpostavlja da svjetlost putuje ravno, pa kovanicu vidi više nego što jest. Isti učinak čini bazene naizgled plićima. U dodatku zakrivljena čaša vode djeluje kao prizma: svaku boju lomi za malo drukčiji kut i rastavlja bijelu sunčevu svjetlost u spektar, baš kao što kapi kiše stvaraju dugu.'
      },
      safety: { en: 'Never look straight at the Sun, not even for a moment. Look only at the rainbow on the paper.', hr: 'Nikad ne gledaj izravno u Sunce, ni na trenutak. Gledaj samo dugu na papiru.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which of these is a light source?', hr: 'Što je od navedenog izvor svjetlosti?' },
        options: [{ en: 'the Moon', hr: 'Mjesec' }, { en: 'a candle flame', hr: 'plamen svijeće' }, { en: 'a mirror', hr: 'zrcalo' }, { en: 'a white wall', hr: 'bijeli zid' }], answer: 1,
        explain: { en: 'A flame makes its own light. The Moon, a mirror and a wall only reflect light that comes from somewhere else.', hr: 'Plamen stvara vlastitu svjetlost. Mjesec, zrcalo i zid samo odbijaju svjetlost koja dolazi odnekud drugdje.' } },
      { type: 'mc', q: { en: 'Frosted bathroom glass lets light through but you cannot see shapes clearly. It is…', hr: 'Mutno staklo na kupaonskom prozoru propušta svjetlost, ali kroz njega ne vidiš jasne oblike. Ono je…' },
        options: [{ en: 'translucent', hr: 'prozračno' }, { en: 'transparent', hr: 'prozirno' }, { en: 'opaque', hr: 'neprozirno' }, { en: 'a light source', hr: 'izvor svjetlosti' }], answer: 0,
        explain: { en: 'Translucent materials let light through but scatter it, so you see only a blur. Transparent glass lets you see clearly; opaque materials block light completely.', hr: 'Prozračne tvari propuštaju svjetlost, ali je raspršuju, pa vidiš samo mutne obrise. Prozirno staklo propušta jasnu sliku; neprozirne tvari potpuno zaustavljaju svjetlost.' } },
      { type: 'tf', q: { en: 'The Moon is a source of light.', hr: 'Mjesec je izvor svjetlosti.' }, answer: false,
        explain: { en: 'The Moon makes no light of its own. We see it because it reflects sunlight towards the Earth.', hr: 'Mjesec ne stvara vlastitu svjetlost. Vidimo ga zato što odbija Sunčevu svjetlost prema Zemlji.' } },
      { type: 'mc', q: { en: 'A ray of light hits a mirror at an angle of incidence of 30°. At what angle is it reflected?', hr: 'Zraka svjetlosti upada na zrcalo pod upadnim kutom od 30°. Pod kojim se kutom odbija?' },
        options: [{ en: '60°', hr: '60°' }, { en: '0°', hr: '0°' }, { en: '30°', hr: '30°' }, { en: '90°', hr: '90°' }], answer: 2,
        explain: { en: 'The law of reflection: the angle of reflection equals the angle of incidence, both measured from the normal. 30° in, 30° out.', hr: 'Zakon odbijanja: kut odbijanja jednak je upadnom kutu, oba mjerena od okomice. 30° upada, 30° odbijanja.' } },
      { type: 'tf', q: { en: 'Your image in a plane mirror appears as far behind the mirror as you stand in front of it.', hr: 'Tvoja slika u ravnom zrcalu čini se jednako daleko iza zrcala koliko ti stojiš ispred njega.' }, answer: true,
        explain: { en: 'Yes. The virtual image in a plane mirror is the same size as you and the same distance behind the mirror as you are in front.', hr: 'Da. Virtualna slika u ravnom zrcalu jednako je velika kao ti i jednako je daleko iza zrcala koliko si ti ispred.' } },
      { type: 'mc', q: { en: 'Why does a straw in a glass of water look broken at the surface?', hr: 'Zašto slamka u čaši vode izgleda slomljeno na površini?' },
        options: [{ en: 'water dissolves the straw a little', hr: 'voda malo otapa slamku' }, { en: 'light bends when it passes from water into air', hr: 'svjetlost se lomi pri prelasku iz vode u zrak' }, { en: 'the glass is a mirror', hr: 'čaša je zrcalo' }, { en: 'water absorbs red light', hr: 'voda upija crvenu svjetlost' }], answer: 1,
        explain: { en: 'This is refraction. Light from the part under water changes direction as it leaves the water, so that part seems to be in a different place.', hr: 'To je lom svjetlosti. Svjetlost s dijela pod vodom mijenja smjer pri izlasku iz vode, pa se taj dio čini na drugom mjestu.' } },
      { type: 'mc', q: { en: 'A near-sighted person sees distant things blurry. Which lenses correct this?', hr: 'Kratkovidna osoba daleke stvari vidi mutno. Koje leće to ispravljaju?' },
        options: [{ en: 'converging lenses', hr: 'konvergentne (sabirne) leće' }, { en: 'a magnifying glass', hr: 'povećalo' }, { en: 'plane mirrors', hr: 'ravna zrcala' }, { en: 'diverging lenses', hr: 'divergentne (rastresne) leće' }], answer: 3,
        explain: { en: 'In a near-sighted eye the image forms in front of the retina. Diverging lenses spread the rays a little so the image moves back onto the retina.', hr: 'U kratkovidnom oku slika nastaje ispred mrežnice. Divergentne leće malo razdvoje zrake pa se slika pomakne natrag na mrežnicu.' } },
      { type: 'num', q: { en: 'The Moon is 384 000 km away. How long does its light take to reach us? Use c = 300 000 km/s.', hr: 'Mjesec je udaljen 384 000 km. Koliko dugo njegova svjetlost putuje do nas? Uzmi c = 300 000 km/s.' },
        answer: 1.28, tolerance: 0.05, unit: 's',
        explain: { en: 't = d / c = 384 000 km / 300 000 km/s = 1.28 s, a little over a second.', hr: 't = d / c = 384 000 km / 300 000 km/s = 1,28 s, malo više od sekunde.' } },
      { type: 'num', q: { en: 'You stand 2 m in front of a plane mirror. How far is your image from you?', hr: 'Stojiš 2 m ispred ravnog zrcala. Koliko je tvoja slika udaljena od tebe?' },
        answer: 4, tolerance: 0.1, unit: 'm',
        explain: { en: 'The image is 2 m behind the mirror, and you are 2 m in front, so the distance between you and your image is 2 + 2 = 4 m.', hr: 'Slika je 2 m iza zrcala, a ti si 2 m ispred, pa je udaljenost između tebe i tvoje slike 2 + 2 = 4 m.' } },
      { type: 'mc', q: { en: 'A T-shirt looks red in white light because it…', hr: 'Majica u bijeloj svjetlosti izgleda crveno zato što…' },
        options: [{ en: 'absorbs red and reflects the other colours', hr: 'upija crvenu, a odbija ostale boje' }, { en: 'makes its own red light', hr: 'stvara vlastitu crvenu svjetlost' }, { en: 'reflects red and absorbs the other colours', hr: 'odbija crvenu, a upija ostale boje' }, { en: 'reflects all colours equally', hr: 'odbija sve boje jednako' }], answer: 2,
        explain: { en: 'Objects have colour because of what they reflect. The red shirt absorbs most of the spectrum and sends mainly red light to your eye.', hr: 'Predmeti imaju boju zbog onoga što odbijaju. Crvena majica upija većinu spektra, a prema tvom oku šalje uglavnom crvenu svjetlost.' } },
      { type: 'mc', q: { en: 'A screen shines red, green and blue light together at full brightness. What colour do you see?', hr: 'Zaslon istodobno svijetli crvenom, zelenom i plavom svjetlošću punim sjajem. Koju boju vidiš?' },
        options: [{ en: 'white', hr: 'bijelu' }, { en: 'black', hr: 'crnu' }, { en: 'brown', hr: 'smeđu' }, { en: 'yellow', hr: 'žutu' }], answer: 0,
        explain: { en: 'Mixing red, green and blue light gives white. Mixing paints works the other way, because paints absorb light, and ends in dark brown or black.', hr: 'Miješanje crvene, zelene i plave svjetlosti daje bijelu. Miješanje boja za slikanje radi obrnuto, jer boje upijaju svjetlost, i završava u tamnosmeđoj ili crnoj.' } },
      { type: 'tf', q: { en: 'The sky is blue because the air scatters blue sunlight more than red.', hr: 'Nebo je plavo zato što zrak raspršuje plavu sunčevu svjetlost jače nego crvenu.' }, answer: true,
        explain: { en: 'Yes. Tiny air molecules scatter short-wavelength blue light in all directions, so blue reaches your eye from every part of the sky.', hr: 'Da. Sitne molekule zraka raspršuju plavu svjetlost kratke valne duljine na sve strane, pa plava stiže do tvog oka iz svakog dijela neba.' } }
    ]
  });
})();
