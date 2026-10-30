/* FizLab topic: Earth and Space / Zemlja i svemir (bonus topic) */
(function () {
  'use strict';
  window.Content.register({
    id: 'space',
    order: 140,
    gradeLevel: 0,
    color: 'c7',
    title: { en: 'Earth and Space', hr: 'Zemlja i svemir' },
    intro: {
      en: 'Why is it winter in Croatia while Australians swim at the beach? Why does the Moon change shape? Zoom out from your backyard to the stars and see how it all fits together.',
      hr: 'Zašto je u Hrvatskoj zima dok se Australci kupaju na plaži? Zašto Mjesec mijenja oblik? Udalji se iz dvorišta do zvijezda i pogledaj kako se sve uklapa.'
    },
    sims: ['space', 'freefall'],

    lesson: [
      {
        h: { en: 'Day and night', hr: 'Dan i noć' },
        p: {
          en: [
            'The Earth is a ball about 12 700 km across, and it spins around an imaginary line through the North and South Poles, its axis. One full turn takes 24 hours: one day. The side facing the Sun has daytime; the side turned away has night. Because of this spin you are moving at hundreds of kilometres per hour right now, even sitting still.',
            'The Sun seems to rise in the east, cross the sky and set in the west. In fact the Sun stays put; it is the ground under you that turns eastward, carrying you with it. That is also why it is morning in Zagreb when it is still the middle of the night in New York: different parts of the Earth face the Sun at different times, and the world is divided into time zones.'
          ],
          hr: [
            'Zemlja je kugla promjera oko 12 700 km koja se vrti oko zamišljene crte kroz Sjeverni i Južni pol, svoje osi. Jedan puni okret traje 24 sata: jedan dan. Strana okrenuta Suncu ima dan, a strana okrenuta od Sunca noć. Zbog te vrtnje upravo se sada gibaš brzinom od više stotina kilometara na sat, čak i dok sjediš mirno.',
            'Čini se da Sunce izlazi na istoku, prelazi nebo i zalazi na zapadu. Zapravo Sunce stoji; tlo pod tobom okreće se prema istoku i nosi te sa sobom. Zato je u Zagrebu jutro dok je u New Yorku još sred noći: različiti dijelovi Zemlje okrenuti su Suncu u različito vrijeme, pa je svijet podijeljen na vremenske zone.'
          ]
        }
      },
      {
        h: { en: 'The year and the seasons', hr: 'Godina i godišnja doba' },
        p: {
          en: [
            'While it spins, the Earth also travels around the Sun along a nearly circular path called its orbit. One trip takes 365 and a quarter days: one year. Because of that extra quarter day, every fourth year we add 29 February and get a leap year of 366 days. Without it the calendar would slowly drift and, after centuries, summer would arrive in December.',
            'Many people think summer is warm because the Earth is closer to the Sun. That is wrong: the Earth is actually closest to the Sun in early January! The real reason is that the Earth’s axis is tilted by 23.5°. For half the year the northern half of the Earth leans towards the Sun: the Sun climbs higher in the sky, days are long, and sunlight hits the ground more directly, so it is summer. Six months later the north leans away: low Sun, short days, winter.',
            'The southern half of the Earth has it the other way round. When it is summer in Croatia it is winter in Australia, and when Croatians build snowmen at Christmas, Australians are at the beach. At the equator the Sun is always high and there are hardly any seasons at all; near the poles the Sun does not set for weeks in summer and does not rise for weeks in winter.'
          ],
          hr: [
            'Dok se vrti, Zemlja istodobno putuje oko Sunca gotovo kružnom stazom koju zovemo putanja ili orbita. Jedan obilazak traje 365 i četvrt dana: jednu godinu. Zbog te dodatne četvrtine dana svake četvrte godine dodajemo 29. veljače i dobivamo prijestupnu godinu od 366 dana. Bez toga bi kalendar polako klizio i nakon nekoliko stoljeća ljeto bi stizalo u prosincu.',
            'Mnogi misle da je ljeto toplo zato što je Zemlja bliže Suncu. To je pogrešno: Zemlja je Suncu zapravo najbliža početkom siječnja! Pravi razlog je to što je Zemljina os nagnuta za 23,5°. Pola godine sjeverna polovica Zemlje nagnuta je prema Suncu: Sunce se penje više na nebu, dani su dugi, a sunčeve zrake padaju na tlo okomitije, pa je ljeto. Šest mjeseci kasnije sjever je nagnut od Sunca: nisko Sunce, kratki dani, zima.',
            'Južna polovica Zemlje ima sve obrnuto. Kad je u Hrvatskoj ljeto, u Australiji je zima, a kad Hrvati za Božić grade snjegoviće, Australci su na plaži. Na ekvatoru je Sunce uvijek visoko i godišnjih doba gotovo i nema; blizu polova Sunce ljeti tjednima ne zalazi, a zimi tjednima ne izlazi.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><circle cx="210" cy="65" r="24" fill="var(--c5)"/><ellipse cx="210" cy="65" rx="170" ry="48" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="6 5"/><g transform="translate(60 65)"><line x1="-8" y1="-32" x2="8" y2="32" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="0" cy="0" r="18" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-18 A18,18 0 0 1 0,18 z" fill="var(--c1)" fill-opacity="0.25"/><line x1="-14" y1="-4" x2="14" y2="4" stroke="var(--fg)" stroke-width="1.5"/></g><g transform="translate(360 65)"><line x1="-8" y1="-32" x2="8" y2="32" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="0" cy="0" r="18" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-18 A18,18 0 0 0 0,18 z" fill="var(--c1)" fill-opacity="0.25"/><line x1="-14" y1="-4" x2="14" y2="4" stroke="var(--fg)" stroke-width="1.5"/></g><text x="60" y="122" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="12" font-weight="700">N ↓</text><text x="360" y="122" text-anchor="middle" fill="var(--fg)" font-family="inherit" font-size="12" font-weight="700">N ↑</text></svg>'
      },
      {
        h: { en: 'The Moon', hr: 'Mjesec' },
        p: {
          en: [
            'The Moon is our only natural satellite, a rocky ball about a quarter the width of the Earth, orbiting us at a distance of about 384 000 km. It goes round the Earth once in about 27 days. The Moon spins on its axis in exactly the same time, so it always shows us the same face. Nobody saw the far side until a spacecraft photographed it in 1959.',
            'The Moon makes no light of its own; the Sun always lights one half of it. As the Moon travels around us, we see that lit half from different angles, so its shape seems to change: new moon (we see the dark side), first quarter, full moon (we see the whole lit side), last quarter, and back to new. One full cycle of phases takes 29.5 days, a little longer than the orbit because the Earth has meanwhile moved along around the Sun.',
            'Now and then the three bodies line up exactly. If the Moon passes directly between the Sun and the Earth, its shadow falls on the Earth: a solar eclipse. If the full Moon passes into the Earth’s shadow, we get a lunar eclipse and the Moon turns a dim red. This does not happen every month because the Moon’s orbit is tilted a little, so it usually passes above or below the line.'
          ],
          hr: [
            'Mjesec je naš jedini prirodni satelit, stjenovita kugla široka oko četvrtine Zemlje, koja kruži oko nas na udaljenosti od oko 384 000 km. Oko Zemlje obiđe jednom u oko 27 dana. Oko svoje osi okrene se za točno isto vrijeme, pa nam uvijek pokazuje isto lice. Nitko nije vidio njegovu drugu stranu dok je letjelica nije snimila 1959. godine.',
            'Mjesec ne stvara vlastitu svjetlost; Sunce uvijek osvjetljava jednu njegovu polovicu. Dok Mjesec putuje oko nas, tu osvijetljenu polovicu vidimo iz različitih kutova, pa se čini da mu se oblik mijenja: mlađak (vidimo tamnu stranu), prva četvrt, uštap ili puni Mjesec (vidimo cijelu osvijetljenu stranu), zadnja četvrt i opet mlađak. Jedan puni ciklus mijena traje 29,5 dana, malo dulje od obilaska, jer se Zemlja u međuvremenu pomaknula na svom putu oko Sunca.',
            'S vremena na vrijeme sva se tri tijela poravnaju točno u crtu. Ako Mjesec prođe točno između Sunca i Zemlje, njegova sjena padne na Zemlju: pomrčina Sunca. Ako puni Mjesec uđe u Zemljinu sjenu, nastaje pomrčina Mjeseca i Mjesec postane tamnocrven. To se ne događa svaki mjesec jer je Mjesečeva putanja malo nagnuta, pa Mjesec obično prođe iznad ili ispod te crte.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><defs><marker id="sp-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><line x1="10" y1="40" x2="60" y2="40" stroke="var(--c5)" stroke-width="3" marker-end="url(#sp-ar)"/><line x1="10" y1="70" x2="60" y2="70" stroke="var(--c5)" stroke-width="3" marker-end="url(#sp-ar)"/><line x1="10" y1="100" x2="60" y2="100" stroke="var(--c5)" stroke-width="3" marker-end="url(#sp-ar)"/><ellipse cx="240" cy="70" rx="120" ry="50" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="6 5"/><circle cx="240" cy="70" r="16" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><path d="M240,54 A16,16 0 0 0 240,86 z" fill="var(--c5)" fill-opacity="0.35"/><g transform="translate(120 70)"><circle r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-12 A12,12 0 0 0 0,12 z" fill="var(--c5)"/></g><g transform="translate(360 70)"><circle r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-12 A12,12 0 0 0 0,12 z" fill="var(--c5)"/></g><g transform="translate(240 20)"><circle r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-12 A12,12 0 0 0 0,12 z" fill="var(--c5)"/></g><g transform="translate(240 120)"><circle r="12" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><path d="M0,-12 A12,12 0 0 0 0,12 z" fill="var(--c5)"/></g></svg>'
      },
      {
        h: { en: 'The Solar System', hr: 'Sunčev sustav' },
        p: {
          en: [
            'The Sun is a star, a huge ball of hot gas 1.4 million kilometres across, over 100 times wider than the Earth. It shines because deep inside, hydrogen is fused into helium, releasing enormous energy. Nearly all the energy on Earth, from wind to food to the fuel in cars, began as sunlight.',
            'Eight planets orbit the Sun. In order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The four inner planets are small and rocky, with solid surfaces you could stand on. The four outer planets are giants made mostly of gas and ice: Jupiter alone is so large that 1300 Earths would fit inside it, and Saturn has spectacular rings of ice and rock.',
            'Besides the planets there are moons (Jupiter and Saturn have dozens each), dwarf planets like Pluto, millions of asteroids between Mars and Jupiter, and icy comets that grow long tails when they come near the Sun. Everything is spread across vast emptiness: if the Sun were a football, the Earth would be a peppercorn about 25 metres away.'
          ],
          hr: [
            'Sunce je zvijezda, golema kugla vrućeg plina promjera 1,4 milijuna kilometara, više od 100 puta šira od Zemlje. Sjaji zato što se duboko u njemu vodik spaja u helij i pritom oslobađa goleme količine energije. Gotovo sva energija na Zemlji, od vjetra preko hrane do goriva u automobilima, započela je kao sunčeva svjetlost.',
            'Oko Sunca kruži osam planeta. Redom: Merkur, Venera, Zemlja, Mars, Jupiter, Saturn, Uran, Neptun. Četiri unutarnja planeta mala su i stjenovita, s čvrstom površinom na kojoj bi se moglo stajati. Četiri vanjska planeta divovi su građeni uglavnom od plina i leda: samo u Jupiter stalo bi 1300 Zemalja, a Saturn ima spektakularne prstenove od leda i kamenja.',
            'Osim planeta tu su i mjeseci (Jupiter i Saturn imaju ih na desetke), patuljasti planeti poput Plutona, milijuni asteroida između Marsa i Jupitera te ledeni kometi kojima izrastu dugi repovi kad se približe Suncu. Sve je to rašireno po golemoj praznini: da je Sunce nogometna lopta, Zemlja bi bila zrno papra udaljeno oko 25 metara.'
          ]
        }
      },
      {
        h: { en: 'Gravity, orbits and weightlessness', hr: 'Gravitacija, putanje i bestežinsko stanje' },
        p: {
          en: [
            'What keeps the planets going round the Sun, and the Moon round the Earth? Gravity. Every object pulls on every other object; the more mass, the stronger the pull. The Sun, with 99.8 % of all the mass in the Solar System, holds every planet on a leash of gravity.',
            'But why do the planets not simply fall into the Sun? Because they are moving sideways very fast. Imagine throwing a ball: it curves down and hits the ground. Throw it faster and it lands farther away. Throw it fast enough, about 8 km/s near the Earth, and the ground curves away beneath it as fast as it falls. The ball never lands: it is in orbit. An orbit is simply falling around and around, forever missing the ground.',
            'This also explains why astronauts float on the International Space Station. The ISS is only about 400 km up, where gravity is still 90 % as strong as on the ground. The astronauts are not beyond gravity; they and their station are falling around the Earth together, and when everything falls together nothing presses on anything. That feeling is weightlessness: the same feeling you get for a moment when a lift starts going down fast.'
          ],
          hr: [
            'Što drži planete da kruže oko Sunca, a Mjesec oko Zemlje? Gravitacija. Svako tijelo privlači svako drugo tijelo; što je masa veća, privlačenje je jače. Sunce, u kojem je 99,8 % sve mase Sunčeva sustava, drži svaki planet na uzici gravitacije.',
            'No zašto planeti jednostavno ne padnu na Sunce? Zato što se vrlo brzo gibaju postrance. Zamisli da baciš loptu: ona se savije prema dolje i udari u tlo. Baci je brže i past će dalje. Baci je dovoljno brzo, blizu Zemlje oko 8 km/s, i tlo će se ispod nje zakrivljavati jednako brzo koliko ona pada. Lopta nikad ne padne na tlo: ona kruži oko Zemlje. Kruženje po putanji zapravo je neprekidno padanje uokolo koje stalno promašuje tlo.',
            'To objašnjava i zašto astronauti lebde na Međunarodnoj svemirskoj postaji. ISS je samo oko 400 km visoko, gdje je gravitacija još uvijek 90 % jaka kao na tlu. Astronauti nisu izvan dosega gravitacije; oni i njihova postaja zajedno padaju oko Zemlje, a kad sve pada zajedno, ništa ne pritišće ni na što. Taj osjećaj je bestežinsko stanje: isti osjećaj kakav na trenutak imaš kad dizalo krene brzo prema dolje.'
          ]
        }
      },
      {
        h: { en: 'How far, and how do we know?', hr: 'Koliko daleko i kako to znamo?' },
        p: {
          en: [
            'Space is so big that kilometres become useless. Instead we measure how long light takes to cross a distance. Light from the Moon reaches us in 1.3 seconds, from the Sun in 8 minutes, from Neptune in about 4 hours. The nearest star beyond the Sun, Proxima Centauri, is 4.2 light years away: its light takes over four years to arrive. Our galaxy, the Milky Way, is about 100 000 light years across, and it is one of billions.',
            'How can we know all this without going there? Mostly by looking very carefully. Galileo pointed the first telescope at the sky in 1609 and saw moons circling Jupiter and mountains on the Moon. Today giant telescopes on mountaintops and in space, like Hubble and the James Webb Space Telescope, collect faint light from billions of years ago. Robot probes have landed on Mars, flown past every planet and sent back photos, and twelve astronauts walked on the Moon between 1969 and 1972.'
          ],
          hr: [
            'Svemir je toliko velik da kilometri postaju beskorisni. Umjesto toga mjerimo koliko dugo svjetlost putuje nekom udaljenošću. Svjetlost s Mjeseca stigne do nas za 1,3 sekunde, sa Sunca za 8 minuta, s Neptuna za oko 4 sata. Najbliža zvijezda nakon Sunca, Proxima Centauri, udaljena je 4,2 svjetlosne godine: njezinoj svjetlosti treba više od četiri godine do nas. Naša galaksija, Mliječna staza, široka je oko 100 000 svjetlosnih godina, a jedna je od milijardi galaksija.',
            'Kako sve to možemo znati, a da ne odemo onamo? Uglavnom vrlo pažljivim gledanjem. Galileo je 1609. godine prvi uperio teleskop u nebo i vidio mjesece koji kruže oko Jupitera i planine na Mjesecu. Danas golemi teleskopi na planinskim vrhovima i u svemiru, poput Hubblea i svemirskog teleskopa James Webb, skupljaju slabašnu svjetlost staru milijarde godina. Robotske sonde sletjele su na Mars, proletjele pokraj svih planeta i poslale fotografije, a dvanaest astronauta hodalo je po Mjesecu između 1969. i 1972. godine.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'axis', hr: 'Zemljina os' }, def: { en: 'The imaginary line through the poles around which the Earth spins once every 24 hours.', hr: 'Zamišljena crta kroz polove oko koje se Zemlja okrene jednom u 24 sata.' } },
      { term: { en: 'rotation', hr: 'vrtnja (rotacija)' }, def: { en: 'The spinning of the Earth around its axis; it causes day and night.', hr: 'Okretanje Zemlje oko vlastite osi; uzrokuje dan i noć.' } },
      { term: { en: 'orbit', hr: 'putanja (orbita)' }, def: { en: 'The path of one body around another, such as the Earth around the Sun (one year).', hr: 'Staza jednog tijela oko drugoga, na primjer Zemlje oko Sunca (jedna godina).' } },
      { term: { en: 'leap year', hr: 'prijestupna godina' }, def: { en: 'A year with 366 days, every fourth year, to make up for the extra quarter day in each orbit.', hr: 'Godina od 366 dana, svaka četvrta, kojom nadoknađujemo dodatnu četvrtinu dana u svakom obilasku.' } },
      { term: { en: 'seasons', hr: 'godišnja doba' }, def: { en: 'Caused by the 23.5° tilt of the Earth’s axis, not by distance from the Sun.', hr: 'Posljedica nagiba Zemljine osi od 23,5°, a ne udaljenosti od Sunca.' } },
      { term: { en: 'satellite', hr: 'satelit' }, def: { en: 'A body that orbits a planet. The Moon is our natural satellite; the ISS is an artificial one.', hr: 'Tijelo koje kruži oko planeta. Mjesec je naš prirodni satelit, a ISS umjetni.' } },
      { term: { en: 'phases of the Moon', hr: 'Mjesečeve mijene' }, def: { en: 'The changing shape of the lit part of the Moon we see: new moon, first quarter, full moon, last quarter; a cycle of 29.5 days.', hr: 'Promjena oblika osvijetljenog dijela Mjeseca koji vidimo: mlađak, prva četvrt, uštap, zadnja četvrt; ciklus od 29,5 dana.' } },
      { term: { en: 'planet', hr: 'planet' }, def: { en: 'A large round body orbiting a star. The Solar System has eight, from Mercury to Neptune.', hr: 'Veliko okruglo tijelo koje kruži oko zvijezde. Sunčev sustav ima ih osam, od Merkura do Neptuna.' } },
      { term: { en: 'star', hr: 'zvijezda' }, def: { en: 'A huge ball of hot gas that makes its own light by fusing hydrogen into helium. The Sun is a star.', hr: 'Golema kugla vrućeg plina koja stvara vlastitu svjetlost spajanjem vodika u helij. Sunce je zvijezda.' } },
      { term: { en: 'gravity', hr: 'gravitacija' }, def: { en: 'The pull between all objects with mass; it holds planets in orbit and keeps the Moon around the Earth.', hr: 'Privlačenje između svih tijela koja imaju masu; drži planete na putanjama i Mjesec uz Zemlju.' } },
      { term: { en: 'weightlessness', hr: 'bestežinsko stanje' }, def: { en: 'The floating feeling in free fall, for example on the ISS, which falls around the Earth together with its crew.', hr: 'Osjećaj lebdenja u slobodnom padu, na primjer na ISS-u, koji pada oko Zemlje zajedno s posadom.' } },
      { term: { en: 'light year', hr: 'svjetlosna godina' }, def: { en: 'The distance light travels in a year, about 9.5 trillion km. The nearest star is 4.2 light years away.', hr: 'Udaljenost koju svjetlost prijeđe za godinu, oko 9,5 bilijuna km. Najbliža zvijezda udaljena je 4,2 svjetlosne godine.' } }
    ],

    formulas: [
      { expr: 'd = c · t', name: { en: 'distance light travels', hr: 'put koji prijeđe svjetlost' }, note: { en: 'c ≈ 300 000 km/s; the Sun is about 500 light seconds away', hr: 'c ≈ 300 000 km/s; Sunce je udaljeno oko 500 svjetlosnih sekundi' } },
      { expr: 'v ≈ 8 km/s', name: { en: 'speed needed to orbit near the Earth', hr: 'brzina potrebna za kruženje blizu Zemlje' }, note: { en: 'fast enough that the ground curves away as fast as you fall', hr: 'dovoljno brzo da se tlo zakrivljuje jednako brzo koliko padaš' } }
    ],

    funFact: {
      en: 'The Earth is nearest to the Sun around 3 January (about 147 million km) and farthest around 4 July (about 152 million km). During a Croatian winter we are actually closer to the Sun than in summer: distance has nothing to do with the seasons.',
      hr: 'Zemlja je Suncu najbliža oko 3. siječnja (oko 147 milijuna km), a najdalja oko 4. srpnja (oko 152 milijuna km). Tijekom hrvatske zime zapravo smo bliže Suncu nego ljeti: udaljenost nema nikakve veze s godišnjim dobima.'
    },

    experiment: {
      title: { en: 'Moon phases with a lamp and a ball', hr: 'Mjesečeve mijene s lampom i loptom' },
      materials: {
        en: ['a desk lamp without a shade (the Sun)', 'a light-coloured ball, such as a tennis or styrofoam ball (the Moon)', 'a pencil or stick pushed into the ball to hold it', 'a room you can make dark', 'your own head (the Earth)', 'bonus: a pencil, a sunny day and chalk or small stones'],
        hr: ['stolna lampa bez sjenila (Sunce)', 'svijetla lopta, na primjer teniska ili od stiropora (Mjesec)', 'olovka ili štapić zaboden u loptu kao držač', 'soba koju možeš zamračiti', 'tvoja glava (Zemlja)', 'dodatak: olovka, sunčan dan i kreda ili kamenčići']
      },
      steps: {
        en: [
          'Put the lamp on a table at about head height in a dark room and switch it on. It is the Sun. You are the Earth and the ball is the Moon.',
          'Face the lamp and hold the ball at arm’s length, slightly above your head. The lit side faces the lamp and you see only the dark side: new moon.',
          'Turn slowly to your left, keeping the ball in front of you. After a quarter turn, half of the ball is lit: first quarter.',
          'Keep turning until your back is to the lamp. Now you see the whole lit side: full moon.',
          'Continue turning: last quarter, then back to new moon. One full turn of your body is one month of Moon phases.',
          'With your back to the lamp, lower the ball into the shadow of your head: it goes dark. That is a lunar eclipse. Raise the ball again and the full moon returns.',
          'Bonus: on a sunny day, stand a pencil upright in the ground and mark the tip of its shadow every hour. Watch the shadow swing from west to east and become shortest around noon.'
        ],
        hr: [
          'Stavi lampu na stol otprilike u visini glave u zamračenoj sobi i upali je. Ona je Sunce. Ti si Zemlja, a lopta je Mjesec.',
          'Okreni se prema lampi i drži loptu ispruženom rukom, malo iznad glave. Osvijetljena strana okrenuta je lampi, a ti vidiš samo tamnu stranu: mlađak.',
          'Polako se okreći ulijevo, držeći loptu ispred sebe. Nakon četvrtine okreta osvijetljena je polovica lopte: prva četvrt.',
          'Nastavi se okretati dok ne budeš leđima prema lampi. Sad vidiš cijelu osvijetljenu stranu: uštap, puni Mjesec.',
          'Okreći se dalje: zadnja četvrt, pa opet mlađak. Jedan puni okret tvog tijela jedan je mjesec Mjesečevih mijena.',
          'Leđima prema lampi spusti loptu u sjenu svoje glave: potamni. To je pomrčina Mjeseca. Podigni loptu i puni Mjesec se vrati.',
          'Dodatak: za sunčanog dana zabodi olovku uspravno u zemlju i svaki sat označi vrh njezine sjene. Gledaj kako se sjena pomiče od zapada prema istoku i kako je najkraća oko podneva.'
        ]
      },
      explain: {
        en: 'The lamp always lights exactly half of the ball, just as the Sun always lights half of the Moon. What changes is how much of that lit half you can see from where you stand, and that depends only on where the ball is in its circle around your head. Phases are not the Earth’s shadow; the shadow appears only in the rare case when the ball passes exactly behind your head, which is an eclipse. The shadow stick shows the Earth turning: as you spin eastward, the Sun appears to cross the sky.',
        hr: 'Lampa uvijek osvjetljava točno polovicu lopte, baš kao što Sunce uvijek osvjetljava polovicu Mjeseca. Mijenja se samo koliko te osvijetljene polovice vidiš s mjesta na kojem stojiš, a to ovisi jedino o tome gdje je lopta na svom krugu oko tvoje glave. Mijene nisu Zemljina sjena; sjena se pojavi samo u rijetkom slučaju kad lopta prođe točno iza tvoje glave, a to je pomrčina. Štap sa sjenom pokazuje da se Zemlja okreće: dok se ti vrtiš prema istoku, čini se da Sunce prelazi nebo.'
      },
      safety: { en: 'Do not stare into the bare bulb, and do not touch it: it gets hot. Never look at the real Sun directly.', hr: 'Ne gledaj izravno u golu žarulju i ne diraj je: vruća je. Nikad ne gledaj izravno u pravo Sunce.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'What causes day and night?', hr: 'Što uzrokuje dan i noć?' },
        options: [{ en: 'the Earth spinning around its axis', hr: 'vrtnja Zemlje oko vlastite osi' }, { en: 'the Earth moving around the Sun', hr: 'gibanje Zemlje oko Sunca' }, { en: 'the Moon covering the Sun', hr: 'Mjesec koji zaklanja Sunce' }, { en: 'the Sun switching off at night', hr: 'Sunce koje se noću gasi' }], answer: 0,
        explain: { en: 'The Earth turns once every 24 hours. The side facing the Sun has day, the side turned away has night.', hr: 'Zemlja se okrene jednom u 24 sata. Strana okrenuta Suncu ima dan, a strana okrenuta od Sunca noć.' } },
      { type: 'mc', q: { en: 'How long does the Earth take to travel once around the Sun?', hr: 'Koliko Zemlji treba da jednom obiđe Sunce?' },
        options: [{ en: 'one day', hr: 'jedan dan' }, { en: 'one month', hr: 'jedan mjesec' }, { en: 'one year', hr: 'jedna godina' }, { en: 'one century', hr: 'jedno stoljeće' }], answer: 2,
        explain: { en: 'One orbit takes 365.25 days, which is how we define a year. The extra quarter day is why we have leap years.', hr: 'Jedan obilazak traje 365,25 dana, i tako definiramo godinu. Zbog dodatne četvrtine dana imamo prijestupne godine.' } },
      { type: 'tf', q: { en: 'It is summer because the Earth is closer to the Sun than in winter.', hr: 'Ljeto je zato što je Zemlja bliže Suncu nego zimi.' }, answer: false,
        explain: { en: 'Seasons come from the 23.5° tilt of the axis, not distance. The Earth is actually closest to the Sun in early January, in the middle of the Croatian winter.', hr: 'Godišnja doba posljedica su nagiba osi od 23,5°, a ne udaljenosti. Zemlja je Suncu zapravo najbliža početkom siječnja, usred hrvatske zime.' } },
      { type: 'mc', q: { en: 'When it is summer in Croatia, what season is it in Australia?', hr: 'Kad je u Hrvatskoj ljeto, koje je godišnje doba u Australiji?' },
        options: [{ en: 'summer', hr: 'ljeto' }, { en: 'winter', hr: 'zima' }, { en: 'spring', hr: 'proljeće' }, { en: 'autumn', hr: 'jesen' }], answer: 1,
        explain: { en: 'When the northern half of the Earth leans towards the Sun, the southern half leans away. The seasons are opposite in the two hemispheres.', hr: 'Kad je sjeverna polovica Zemlje nagnuta prema Suncu, južna je nagnuta od njega. Godišnja doba na dvjema polutkama su suprotna.' } },
      { type: 'mc', q: { en: 'How long does a full cycle of Moon phases take (from one full moon to the next)?', hr: 'Koliko traje puni ciklus Mjesečevih mijena (od jednog uštapa do sljedećeg)?' },
        options: [{ en: 'about 1 day', hr: 'oko 1 dan' }, { en: 'about 7 days', hr: 'oko 7 dana' }, { en: 'about 365 days', hr: 'oko 365 dana' }, { en: 'about 29.5 days', hr: 'oko 29,5 dana' }], answer: 3,
        explain: { en: 'The phases repeat every 29.5 days, roughly a month. That is where the word month comes from.', hr: 'Mijene se ponavljaju svakih 29,5 dana, otprilike mjesec dana. Odatle i dolazi riječ mjesec za razdoblje u godini.' } },
      { type: 'tf', q: { en: 'From the Earth we always see the same side of the Moon.', hr: 'Sa Zemlje uvijek vidimo istu stranu Mjeseca.' }, answer: true,
        explain: { en: 'The Moon spins once in exactly the time it takes to orbit the Earth, so the same face always points towards us. The far side was first photographed in 1959.', hr: 'Mjesec se oko svoje osi okrene točno za vrijeme koje mu treba da obiđe Zemlju, pa je isto lice uvijek okrenuto prema nama. Druga strana prvi je put snimljena 1959. godine.' } },
      { type: 'mc', q: { en: 'Which planet is closest to the Sun?', hr: 'Koji je planet najbliži Suncu?' },
        options: [{ en: 'Venus', hr: 'Venera' }, { en: 'Earth', hr: 'Zemlja' }, { en: 'Mercury', hr: 'Merkur' }, { en: 'Mars', hr: 'Mars' }], answer: 2,
        explain: { en: 'The order from the Sun is Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', hr: 'Redoslijed od Sunca je Merkur, Venera, Zemlja, Mars, Jupiter, Saturn, Uran, Neptun.' } },
      { type: 'mc', q: { en: 'Jupiter is…', hr: 'Jupiter je…' },
        options: [{ en: 'a gas giant, the largest planet', hr: 'plinoviti div, najveći planet' }, { en: 'a small rocky planet', hr: 'mali stjenoviti planet' }, { en: 'a star', hr: 'zvijezda' }, { en: 'a moon of Saturn', hr: 'Saturnov mjesec' }], answer: 0,
        explain: { en: 'Jupiter is the biggest planet, made mostly of gas; about 1300 Earths would fit inside it. The rocky planets are the four inner ones.', hr: 'Jupiter je najveći planet, građen uglavnom od plina; u njega bi stalo oko 1300 Zemalja. Stjenoviti planeti su četiri unutarnja.' } },
      { type: 'num', q: { en: 'The Sun is 150 000 000 km away. How many seconds does its light take to reach the Earth? Use c = 300 000 km/s.', hr: 'Sunce je udaljeno 150 000 000 km. Koliko sekundi njegova svjetlost putuje do Zemlje? Uzmi c = 300 000 km/s.' },
        answer: 500, tolerance: 2, unit: 's',
        explain: { en: 't = d / c = 150 000 000 km / 300 000 km/s = 500 s, a little over 8 minutes.', hr: 't = d / c = 150 000 000 km / 300 000 km/s = 500 s, malo više od 8 minuta.' } },
      { type: 'num', q: { en: 'A year lasts 365.25 days. How many days are there in 4 years?', hr: 'Godina traje 365,25 dana. Koliko dana ima u 4 godine?' },
        answer: 1461, tolerance: 0.5, unit: '',
        explain: { en: '4 × 365.25 = 1461 days: three ordinary years of 365 days plus one leap year of 366.', hr: '4 × 365,25 = 1461 dan: tri obične godine od 365 dana i jedna prijestupna od 366.' } },
      { type: 'mc', q: { en: 'Why do astronauts float inside the International Space Station?', hr: 'Zašto astronauti lebde u Međunarodnoj svemirskoj postaji?' },
        options: [{ en: 'there is no gravity in space', hr: 'u svemiru nema gravitacije' }, { en: 'they are too far from the Earth to be pulled', hr: 'predaleko su od Zemlje da bi ih privlačila' }, { en: 'the air inside the station is very thin', hr: 'zrak u postaji je vrlo rijedak' }, { en: 'they and the station are in free fall around the Earth', hr: 'oni i postaja slobodno padaju oko Zemlje' }], answer: 3,
        explain: { en: 'At 400 km up gravity is still 90 % as strong as on the ground. The station and everyone in it fall around the Earth together, so nothing presses on anything: weightlessness.', hr: 'Na 400 km visine gravitacija je još uvijek 90 % jaka kao na tlu. Postaja i svi u njoj zajedno padaju oko Zemlje, pa ništa ne pritišće ni na što: bestežinsko stanje.' } },
      { type: 'tf', q: { en: 'The Sun is a star.', hr: 'Sunce je zvijezda.' }, answer: true,
        explain: { en: 'Yes. The Sun is an ordinary star that looks huge and bright only because it is so close. The other stars are suns, too, trillions of kilometres away.', hr: 'Da. Sunce je obična zvijezda koja izgleda golema i sjajna samo zato što nam je tako blizu. I druge zvijezde su sunca, udaljena bilijune kilometara.' } }
    ]
  });
})();
