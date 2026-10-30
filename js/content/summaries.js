/* FizLab — topic summaries ("In short" / "Ukratko") and common misconceptions (see _extras_schema.md) */
(function () {
  'use strict';
  window.Content.registerSummaries({

    matter: {
      bullets: {
        en: [
          'Everything around us is a body made of some substance: a spoon is a body and steel is the substance it is made of.',
          'All matter is built from tiny particles that never stop moving; the particles of water are the same in ice, liquid water and steam.',
          'Substances exist in three states, solid, liquid and gas, and they change state when they are heated or cooled.',
          'Length is measured in metres (1 km = 1000 m, 1 m = 100 cm = 1000 mm) and volume in m³, dm³ (litres) and cm³ (millilitres), for example with a measuring cylinder.',
          'Mass is measured with a balance in kilograms (1 kg = 1000 g), and prefixes such as kilo- and milli- mean a thousand times bigger or smaller.'
        ],
        hr: [
          'Sve oko nas su tijela načinjena od neke tvari: žlica je tijelo, a čelik je tvar od koje je načinjena.',
          'Sva tvar građena je od sitnih čestica koje se neprestano gibaju; čestice vode iste su u ledu, tekućoj vodi i vodenoj pari.',
          'Tvari postoje u tri agregacijska stanja, čvrstom, tekućem i plinovitom, a stanje mijenjaju zagrijavanjem ili hlađenjem.',
          'Duljinu mjerimo u metrima (1 km = 1000 m, 1 m = 100 cm = 1000 mm), a obujam u m³, dm³ (litrama) i cm³ (mililitrima), na primjer menzurom.',
          'Masu mjerimo vagom u kilogramima (1 kg = 1000 g), a predmetci kao kilo- i mili- znače tisuću puta veće ili manje.'
        ]
      },
      misconceptions: [
        { myth: { en: 'A kilogram of iron is heavier than a kilogram of feathers.', hr: 'Kilogram željeza teži je od kilograma perja.' },
          truth: { en: 'Both have exactly the same mass, 1 kg. The iron only takes up far less space, because it has a much greater density.', hr: 'Oboje ima potpuno jednaku masu, 1 kg. Željezo samo zauzima mnogo manje prostora jer ima mnogo veću gustoću.' } },
        { myth: { en: 'Air is nothing; it has no mass.', hr: 'Zrak je ništa; nema masu.' },
          truth: { en: 'Air is a mixture of gases made of particles, so it is matter and has mass: one cubic metre of air has a mass of about 1.2 kg. That is why a pumped-up ball is slightly heavier than an empty one.', hr: 'Zrak je smjesa plinova građenih od čestica, pa je tvar i ima masu: jedan kubni metar zraka ima masu oko 1,2 kg. Zato je napumpana lopta malo teža od prazne.' } },
        { myth: { en: 'In a solid the particles do not move at all.', hr: 'U čvrstom tijelu čestice se uopće ne gibaju.' },
          truth: { en: 'The particles of a solid vibrate all the time around fixed places; they just cannot slide past one another as they can in a liquid. The warmer the solid, the stronger they vibrate.', hr: 'Čestice čvrstog tijela stalno titraju oko svojih stalnih mjesta; samo ne mogu kliziti jedna pokraj druge kao u tekućini. Što je tijelo toplije, to jače titraju.' } }
      ]
    },

    density: {
      bullets: {
        en: [
          'Density tells how much mass fits into a unit of volume: ρ = m / V, measured in kg/m³ or g/cm³ (1 g/cm³ = 1000 kg/m³).',
          'Density is a property of the substance, so a large and a small piece of the same material have the same density.',
          'Water has a density of 1 g/cm³ (1000 kg/m³); to find the density of an object you measure its mass on a balance and its volume, for example with a measuring cylinder.',
          'An object floats if its average density is lower than the density of the liquid and sinks if it is higher; that is why wood floats and a stone sinks.',
          'Ice is less dense than liquid water, so it floats, and warm air is less dense than cold air, so it rises.'
        ],
        hr: [
          'Gustoća govori koliko mase ima u jedinici obujma: ρ = m / V, a mjerimo je u kg/m³ ili g/cm³ (1 g/cm³ = 1000 kg/m³).',
          'Gustoća je svojstvo tvari, pa veliki i mali komad iste tvari imaju jednaku gustoću.',
          'Voda ima gustoću 1 g/cm³ (1000 kg/m³); gustoću tijela odredimo tako da mu vagom izmjerimo masu, a obujam na primjer menzurom.',
          'Tijelo pluta ako mu je prosječna gustoća manja od gustoće tekućine, a tone ako je veća; zato drvo pluta, a kamen tone.',
          'Led je manje gust od tekuće vode, pa pluta, a topli zrak manje je gust od hladnog, pa se diže.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Heavy things sink and light things float.', hr: 'Teška tijela tonu, a lagana plutaju.' },
          truth: { en: 'Floating depends on density, not on mass alone. A huge steel ship floats because, with all the air inside it, its average density is lower than that of water, while a tiny pebble sinks.', hr: 'Plutanje ovisi o gustoći, a ne samo o masi. Golemi čelični brod pluta jer mu je, sa svim zrakom u njemu, prosječna gustoća manja od gustoće vode, a sitni kamenčić tone.' } },
        { myth: { en: 'A bigger piece of a material has a bigger density.', hr: 'Veći komad neke tvari ima veću gustoću.' },
          truth: { en: 'Density is a property of the substance, not of the piece. Doubling the piece doubles both its mass and its volume, so the ratio m / V stays the same.', hr: 'Gustoća je svojstvo tvari, a ne komada. Dvostruko veći komad ima dvostruko veću masu i dvostruko veći obujam, pa omjer m / V ostaje isti.' } },
        { myth: { en: 'Solids are always denser than liquids, so ice should sink in water.', hr: 'Čvrsta tijela uvijek su gušća od tekućina, pa bi led trebao tonuti u vodi.' },
          truth: { en: 'Ice is unusual: when water freezes its particles arrange into an open structure, so ice has a density of about 0.92 g/cm³, less than liquid water. That is why ice floats and lakes freeze from the top.', hr: 'Led je neobičan: kad se voda ledi, njezine se čestice slože u rahlu strukturu, pa led ima gustoću oko 0,92 g/cm³, manju od tekuće vode. Zato led pluta, a jezera se lede s površine.' } }
      ]
    },

    motion: {
      bullets: {
        en: [
          'Motion is relative: whether something is moving depends on the reference body you compare it with.',
          'The trajectory is the line along which a body moves; the distance travelled is the length of that line, measured in metres.',
          'Speed tells how much distance is covered in a unit of time: v = s / t, in m/s or km/h (1 m/s = 3.6 km/h).',
          'In uniform motion the speed is constant and the distance–time graph is a straight line; average speed is the total distance divided by the total time.',
          'Acceleration tells how quickly speed changes (a = Δv / t, in m/s²); a car needs a reaction distance plus a braking distance to stop, and both grow with speed.'
        ],
        hr: [
          'Gibanje je relativno: giba li se tijelo, ovisi o referentnom tijelu s kojim ga uspoređujemo.',
          'Putanja je crta po kojoj se tijelo giba, a put je duljina te crte i mjeri se u metrima.',
          'Brzina govori koliki put tijelo prijeđe u jedinici vremena: v = s / t, u m/s ili km/h (1 m/s = 3,6 km/h).',
          'Pri jednolikom gibanju brzina je stalna i graf put–vrijeme je pravac; srednja brzina je ukupni put podijeljen ukupnim vremenom.',
          'Ubrzanje govori koliko se brzo mijenja brzina (a = Δv / t, u m/s²); automobilu je za zaustavljanje potreban put reakcije i put kočenja, a oba rastu s brzinom.'
        ]
      },
      misconceptions: [
        { myth: { en: 'A fast-moving object must be accelerating.', hr: 'Tijelo koje se brzo giba sigurno ubrzava.' },
          truth: { en: 'Speed says how fast something moves; acceleration says how quickly the speed changes. A car cruising at a steady 100 km/h has zero acceleration, while a bike starting from rest is accelerating.', hr: 'Brzina govori koliko se brzo tijelo giba, a ubrzanje koliko se brzo brzina mijenja. Automobil koji vozi stalnih 100 km/h ima ubrzanje nula, a bicikl koji kreće iz mirovanja ubrzava.' } },
        { myth: { en: 'If I am sitting still, I am not moving at all.', hr: 'Ako mirno sjedim, uopće se ne gibam.' },
          truth: { en: 'Motion is always relative to a reference body. Sitting in a train you are at rest relative to your seat but moving relative to the ground, and the whole Earth carries you around the Sun at about 30 km/s.', hr: 'Gibanje je uvijek relativno prema referentnom tijelu. U vlaku miruješ prema sjedalu, ali se gibaš prema tlu, a cijela Zemlja nosi te oko Sunca brzinom oko 30 km/s.' } },
        { myth: { en: 'At double the speed a car needs double the braking distance.', hr: 'Pri dvostruko većoj brzini automobilu treba dvostruko dulji put kočenja.' },
          truth: { en: 'The braking distance grows with the square of the speed, so doubling the speed makes it about four times longer; only the reaction distance doubles. That is why speed limits matter so much near schools.', hr: 'Put kočenja raste s kvadratom brzine, pa je pri dvostrukoj brzini oko četiri puta dulji; samo se put reakcije udvostruči. Zato su ograničenja brzine kraj škola toliko važna.' } }
      ]
    },

    forces: {
      bullets: {
        en: [
          'A force is a push or a pull that can change the motion or the shape of a body; it is measured in newtons (N) with a dynamometer.',
          'Some forces need contact (friction, a push, the elastic force of a spring), while gravity and magnetic force act at a distance.',
          'Weight is the force of gravity on a body: G = m · g, with g ≈ 10 N/kg on Earth, while mass in kilograms is the same everywhere.',
          'Forces in the same direction add up and opposite forces partly cancel; balanced forces leave the motion unchanged.',
          'Friction acts against motion, and the bigger the resultant force and the smaller the mass, the bigger the acceleration (F = m · a).'
        ],
        hr: [
          'Sila je guranje ili vučenje koje može promijeniti gibanje ili oblik tijela; mjerimo je u njutnima (N) dinamometrom.',
          'Neke sile trebaju dodir (trenje, guranje, elastična sila opruge), a sila teža i magnetska sila djeluju na daljinu.',
          'Težina je sila kojom Zemlja privlači tijelo: G = m · g, gdje je g ≈ 10 N/kg na Zemlji, dok je masa u kilogramima svugdje jednaka.',
          'Sile istog smjera zbrajaju se, a suprotne se djelomično poništavaju; uravnotežene sile ne mijenjaju gibanje.',
          'Trenje djeluje suprotno gibanju, a što je rezultantna sila veća i masa manja, ubrzanje je veće (F = m · a).'
        ]
      },
      misconceptions: [
        { myth: { en: 'A moving object needs a constant force to keep moving.', hr: 'Tijelu koje se giba potrebna je stalna sila da bi se nastavilo gibati.' },
          truth: { en: 'A body keeps moving at a steady speed by itself when the forces on it are balanced. Things on Earth slow down because friction and air resistance act on them; a space probe keeps going for decades with its engine off.', hr: 'Tijelo se samo od sebe nastavlja gibati stalnom brzinom kad su sile na njega uravnotežene. Tijela na Zemlji usporavaju zato što na njih djeluju trenje i otpor zraka; svemirska sonda leti desetljećima s ugašenim motorom.' } },
        { myth: { en: 'Weight and mass are the same thing.', hr: 'Težina i masa isto su.' },
          truth: { en: 'Mass (in kg) tells how much matter a body contains and is the same everywhere. Weight (in N) is the force with which gravity pulls the body, so on the Moon your weight is six times smaller but your mass is unchanged.', hr: 'Masa (u kg) govori koliko tvari tijelo sadrži i svugdje je jednaka. Težina (u N) je sila kojom sila teža privlači tijelo, pa je na Mjesecu tvoja težina šest puta manja, a masa ostaje ista.' } },
        { myth: { en: 'If an object is not moving, no forces act on it.', hr: 'Ako tijelo miruje, na njega ne djeluje nikakva sila.' },
          truth: { en: 'A book on a table is pulled down by gravity and pushed up by the table with an equal force. The forces are balanced, not absent; remove the table and the book falls.', hr: 'Knjigu na stolu sila teža vuče prema dolje, a stol je gura prema gore jednakom silom. Sile su uravnotežene, a ne odsutne; makni stol i knjiga pada.' } }
      ]
    },

    gravity: {
      bullets: {
        en: [
          'Every mass attracts every other mass; the pull is stronger for bigger masses and weaker at greater distances, and Earth\'s pull on things around us is called gravity.',
          'In free fall without air all bodies speed up equally, by about 9.81 m/s every second; air resistance is the reason a feather falls more slowly than a stone.',
          'Every body has a centre of gravity, and it stands stable when its centre of gravity is low and above its base.',
          'The period of a pendulum depends on its length (and on g), not on its mass or on how wide it swings.',
          'Satellites and the Moon stay in orbit because they keep falling around the Earth, and the pull of the Moon causes the tides.'
        ],
        hr: [
          'Svaka masa privlači svaku drugu masu; privlačenje je jače za veće mase, a slabije na većim udaljenostima, a Zemljino privlačenje tijela oko nas zovemo sila teža.',
          'Pri slobodnom padu bez zraka sva tijela ubrzavaju jednako, za oko 9,81 m/s svake sekunde; otpor zraka razlog je zašto pero pada sporije od kamena.',
          'Svako tijelo ima težište, a stabilno stoji kad mu je težište nisko i iznad podloge.',
          'Period njihala ovisi o njegovoj duljini (i o g), a ne o masi ni o tome koliko se široko njiše.',
          'Sateliti i Mjesec ostaju u orbiti jer neprestano padaju oko Zemlje, a Mjesečevo privlačenje uzrokuje plimu i oseku.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Heavier objects fall faster.', hr: 'Teža tijela padaju brže.' },
          truth: { en: 'Without air, everything falls with the same acceleration, about 9.81 m/s². A heavier body is pulled harder, but it also needs a bigger force to speed up, and the two effects cancel exactly; a feather only lags behind because of air resistance.', hr: 'Bez zraka sva tijela padaju jednakim ubrzanjem, oko 9,81 m/s². Teže tijelo Zemlja jače privlači, ali mu je i potrebna veća sila da ubrza, pa se ta dva učinka točno ponište; pero zaostaje samo zbog otpora zraka.' } },
        { myth: { en: 'Gravity is a kind of magnetism; Earth attracts things because it is a magnet.', hr: 'Gravitacija je vrsta magnetizma; Zemlja privlači tijela jer je magnet.' },
          truth: { en: 'Gravity and magnetism are different forces. Gravity acts on every mass, wood, water and you included, while a magnet attracts only a few metals such as iron. Earth is indeed a weak magnet, but that is what turns a compass, not what makes an apple fall.', hr: 'Gravitacija i magnetizam različite su sile. Gravitacija djeluje na svaku masu, na drvo, vodu i na tebe, dok magnet privlači samo nekoliko metala poput željeza. Zemlja je doduše slab magnet, ali to okreće kompas, a ne čini da jabuka pada.' } },
        { myth: { en: 'The Moon has no gravity.', hr: 'Na Mjesecu nema gravitacije.' },
          truth: { en: 'The Moon has about one sixth of Earth\'s gravity: astronauts could jump higher, but they always came back down. The Moon\'s gravity is also strong enough to pull on our oceans and cause the tides.', hr: 'Mjesec ima oko šest puta slabiju gravitaciju od Zemlje: astronauti su mogli skočiti više, ali su uvijek pali natrag. Mjesečeva gravitacija dovoljno je jaka i da privlači naše oceane i uzrokuje plimu i oseku.' } }
      ]
    },

    pressure: {
      bullets: {
        en: [
          'Pressure is force divided by the area it acts on: p = F / A, measured in pascals (1 Pa = 1 N/m²).',
          'The same force gives a large pressure on a small area (a knife edge, a needle) and a small pressure on a large area (skis, wide tyres).',
          'Pressure in a liquid grows with depth and with the density of the liquid (p = ρ · g · h) and acts equally in all directions, so connected vessels fill to the same level.',
          'Pascal\'s law: pressure applied to an enclosed liquid is passed on everywhere in it, so a hydraulic jack can lift a car with a small force.',
          'Air has weight and presses on everything with about 100 000 Pa (1 bar) at sea level; atmospheric pressure drops with height and is measured with a barometer.'
        ],
        hr: [
          'Tlak je sila podijeljena površinom na koju djeluje: p = F / A, a mjerimo ga u paskalima (1 Pa = 1 N/m²).',
          'Ista sila daje velik tlak na maloj površini (oštrica noža, igla), a mali tlak na velikoj (skije, široke gume).',
          'Tlak u tekućini raste s dubinom i s gustoćom tekućine (p = ρ · g · h) i djeluje jednako u svim smjerovima, pa se spojene posude napune do iste razine.',
          'Pascalov zakon: tlak koji djeluje na zatvorenu tekućinu prenosi se na sve njezine dijelove, pa hidraulička dizalica malom silom podiže automobil.',
          'Zrak ima težinu i na sve tlači s oko 100 000 Pa (1 bar) na razini mora; atmosferski tlak s visinom opada, a mjerimo ga barometrom.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Pressure and force are the same thing.', hr: 'Tlak i sila isto su.' },
          truth: { en: 'Pressure is force spread over an area: p = F / A. The same push produces a far greater pressure through a needle point than through your palm, which is why the needle pierces skin and your hand does not.', hr: 'Tlak je sila raspodijeljena po površini: p = F / A. Isti pritisak kroz vrh igle daje mnogo veći tlak nego kroz dlan, zato igla probija kožu, a ruka ne.' } },
        { myth: { en: 'A straw or a suction cup works because the vacuum sucks.', hr: 'Slamka ili vakuumska kukica rade zato što vakuum usisava.' },
          truth: { en: 'Nothing pulls; it is the surrounding air that pushes. When you lower the pressure inside the straw, the atmosphere, pressing with about 100 000 Pa, pushes the drink up into it.', hr: 'Ništa ne vuče; gura okolni zrak. Kad u slamci smanjiš tlak, atmosfera, koja tlači s oko 100 000 Pa, gura piće u nju prema gore.' } },
        { myth: { en: 'The pressure at the bottom depends on how much water is in the container.', hr: 'Tlak na dnu ovisi o tome koliko je vode u posudi.' },
          truth: { en: 'Hydrostatic pressure depends only on the depth and the density of the liquid: p = ρ · g · h. At 10 m depth the pressure is the same in a narrow pipe and in a wide lake, about 100 000 Pa more than at the surface.', hr: 'Hidrostatski tlak ovisi samo o dubini i gustoći tekućine: p = ρ · g · h. Na 10 m dubine tlak je jednak u uskoj cijevi i u širokom jezeru, oko 100 000 Pa veći nego na površini.' } }
      ]
    },

    levers: {
      bullets: {
        en: [
          'A lever is a rigid bar that turns around a fulcrum; the distance from the fulcrum to the point where a force acts is the arm of that force.',
          'The law of the lever: F₁ · d₁ = F₂ · d₂, so a small force on a long arm balances a large force on a short arm.',
          'Scissors, a seesaw, a wheelbarrow, tweezers and a crowbar are all levers; where the fulcrum sits decides how the lever helps you.',
          'An inclined plane and a screw let you lift a load with a smaller force, but you have to move it along a longer path.',
          'A fixed pulley only changes the direction of the pull and a movable pulley halves the needed force; no machine saves work, which is the golden rule of mechanics.'
        ],
        hr: [
          'Poluga je kruta šipka koja se okreće oko oslonca; udaljenost od oslonca do hvatišta sile je krak te sile.',
          'Zakon poluge: F₁ · d₁ = F₂ · d₂, pa mala sila na dugom kraku uravnotežuje veliku silu na kratkom kraku.',
          'Škare, klackalica, tačke, pinceta i pajser sve su poluge; položaj oslonca odlučuje kako nam poluga pomaže.',
          'Kosina i vijak omogućuju da teret podignemo manjom silom, ali ga moramo pomaknuti po duljem putu.',
          'Nepomična kolotura samo mijenja smjer sile, a pomična upola smanjuje potrebnu silu; nijedan stroj ne štedi rad, to je zlatno pravilo mehanike.'
        ]
      },
      misconceptions: [
        { myth: { en: 'A lever saves work; you get something for nothing.', hr: 'Poluga štedi rad; dobivaš nešto ni za što.' },
          truth: { en: 'A lever reduces the force you need, but your end of the lever has to move a longer distance. Force times distance, the work, stays the same; the golden rule of mechanics says no simple machine saves work.', hr: 'Poluga smanjuje potrebnu silu, ali tvoj kraj poluge mora prijeći dulji put. Umnožak sile i puta, rad, ostaje isti; zlatno pravilo mehanike kaže da nijedan jednostavni stroj ne štedi rad.' } },
        { myth: { en: 'The fulcrum of a lever is always in the middle.', hr: 'Oslonac poluge uvijek je u sredini.' },
          truth: { en: 'The fulcrum can be at one end, as in a wheelbarrow or a nutcracker, and the force can even act between the fulcrum and the load, as in tweezers or a fishing rod. Only the ratio of the two arms matters.', hr: 'Oslonac može biti na jednom kraju, kao kod tačaka ili krckalice za orahe, a sila može djelovati i između oslonca i tereta, kao kod pincete ili ribičkog štapa. Važan je samo omjer dvaju krakova.' } },
        { myth: { en: 'Every pulley halves the force you need.', hr: 'Svaka kolotura upola smanjuje potrebnu silu.' },
          truth: { en: 'A fixed pulley only changes the direction of the pull: you still pull with the full weight of the load, just downwards instead of upwards. Only a movable pulley, or a combination of pulleys, reduces the force.', hr: 'Nepomična kolotura samo mijenja smjer sile: i dalje vučeš punom težinom tereta, samo prema dolje umjesto prema gore. Tek pomična kolotura ili koloturnik smanjuju silu.' } }
      ]
    },

    energy: {
      bullets: {
        en: [
          'Work is done when a force moves a body along its direction: W = F · s, measured in joules (1 J = 1 N · 1 m).',
          'Energy is the ability to do work; it comes in forms such as kinetic, potential, elastic, internal (thermal), electrical and light energy.',
          'Kinetic energy grows with mass and with the square of speed (E_k = ½ · m · v²); gravitational potential energy grows with mass and height (E_p = m · g · h).',
          'Energy is never created or destroyed, only changed from one form to another; a falling ball turns potential energy into kinetic energy.',
          'Power is the work done per unit of time (P = W / t, in watts); electricity bills count energy in kilowatt-hours, and efficiency tells what part of the energy does the useful job.'
        ],
        hr: [
          'Rad se obavlja kad sila pomiče tijelo u svom smjeru: W = F · s, a mjerimo ga u džulima (1 J = 1 N · 1 m).',
          'Energija je sposobnost obavljanja rada; postoji u oblicima kao što su kinetička, potencijalna, elastična, unutarnja (toplinska), električna i svjetlosna energija.',
          'Kinetička energija raste s masom i s kvadratom brzine (E_k = ½ · m · v²); gravitacijska potencijalna energija raste s masom i visinom (E_p = m · g · h).',
          'Energija se ne stvara i ne nestaje, nego samo prelazi iz jednog oblika u drugi; lopta koja pada pretvara potencijalnu energiju u kinetičku.',
          'Snaga je rad obavljen u jedinici vremena (P = W / t, u vatima); račun za struju broji energiju u kilovatsatima, a korisnost govori koji dio energije obavi koristan posao.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Holding a heavy bag still is hard, so it is work in physics.', hr: 'Držati tešku torbu u mjestu naporno je, pa je to rad u fizici.' },
          truth: { en: 'In physics, work needs a force and a movement along it: W = F · s. Holding the bag still does no work, however tired you get; carrying it up the stairs does.', hr: 'U fizici rad zahtijeva silu i pomak u njezinu smjeru: W = F · s. Držanje torbe u mjestu nije rad, koliko god se umorio; nošenje torbe uza stube jest.' } },
        { myth: { en: 'When a car brakes, its energy is used up and disappears.', hr: 'Kad automobil koči, njegova se energija potroši i nestane.' },
          truth: { en: 'Energy is conserved; it only changes form. The kinetic energy of the car becomes internal energy of the hot brakes, tyres and air. It is harder to use afterwards, but it has not vanished.', hr: 'Energija se očuva; samo mijenja oblik. Kinetička energija automobila postaje unutarnja energija vrućih kočnica, guma i zraka. Poslije ju je teže iskoristiti, ali nije nestala.' } },
        { myth: { en: 'Power and energy are the same; a 2000 W heater always uses more energy than a 100 W bulb.', hr: 'Snaga i energija isto su; grijalica od 2000 W uvijek potroši više energije nego žarulja od 100 W.' },
          truth: { en: 'Power is how fast energy is transferred (1 W = 1 J/s); energy is power multiplied by time. A 100 W bulb left on for 20 hours uses the same 2 kWh as a 2000 W heater running for one hour.', hr: 'Snaga govori koliko se brzo energija prenosi (1 W = 1 J/s), a energija je snaga pomnožena vremenom. Žarulja od 100 W upaljena 20 sati potroši jednaka 2 kWh kao grijalica od 2000 W koja radi jedan sat.' } }
      ]
    },

    heat: {
      bullets: {
        en: [
          'Temperature tells how fast the particles of a body move on average; we measure it with a thermometer in degrees Celsius (water freezes at 0 °C and boils at 100 °C).',
          'Internal energy is the total energy of all the particles in a body; heat is the energy that passes from a warmer body to a colder one, measured in joules.',
          'Heat travels in three ways: conduction through solids, convection by moving liquids and gases, and radiation, which needs no matter at all.',
          'Insulators such as wool, air and polystyrene slow the flow of heat; water has a high specific heat capacity, so it warms up and cools down slowly (Q = m · c · ΔT).',
          'Most substances expand when heated and shrink when cooled, and heating or cooling can change their state: melting, evaporation, condensation and freezing.'
        ],
        hr: [
          'Temperatura govori koliko se brzo u prosjeku gibaju čestice tijela; mjerimo je termometrom u Celzijevim stupnjevima (voda se ledi na 0 °C, a vrije na 100 °C).',
          'Unutarnja energija ukupna je energija svih čestica tijela, a toplina je energija koja prelazi s toplijeg tijela na hladnije i mjeri se u džulima.',
          'Toplina se prenosi na tri načina: vođenjem kroz čvrsta tijela, strujanjem tekućina i plinova te zračenjem, kojemu ne treba nikakva tvar.',
          'Izolatori poput vune, zraka i stiropora usporavaju prijenos topline; voda ima velik specifični toplinski kapacitet, pa se sporo grije i sporo hladi (Q = m · c · ΔT).',
          'Većina tvari zagrijavanjem se rasteže, a hlađenjem steže, a zagrijavanje ili hlađenje može promijeniti agregacijsko stanje: taljenje, isparavanje, kondenzacija i ledenje.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Heat and temperature are the same thing.', hr: 'Toplina i temperatura isto su.' },
          truth: { en: 'Temperature (in °C) tells how fast the particles move on average; heat (in J) is energy passing from a warmer body to a colder one. A bathtub of warm water holds far more internal energy than a cup of boiling tea, even though its temperature is lower.', hr: 'Temperatura (u °C) govori koliko se brzo u prosjeku gibaju čestice, a toplina (u J) je energija koja prelazi s toplijeg tijela na hladnije. Kada tople vode sadrži mnogo više unutarnje energije nego šalica kipućeg čaja, iako joj je temperatura niža.' } },
        { myth: { en: 'Cold flows into the room when you open the window; cold is a substance.', hr: 'Kad otvoriš prozor, u sobu ulazi hladnoća; hladnoća je tvar.' },
          truth: { en: 'There is no substance called cold. Only heat moves, and it always flows from the warmer place to the colder one; the room cools because its heat leaks out into the colder air outside.', hr: 'Ne postoji tvar koja se zove hladnoća. Giba se samo toplina i uvijek prelazi s toplijeg mjesta na hladnije; soba se hladi zato što njezina toplina odlazi u hladniji vanjski zrak.' } },
        { myth: { en: 'A sweater makes heat.', hr: 'Džemper stvara toplinu.' },
          truth: { en: 'A sweater is an insulator: it produces no heat, it only slows the flow of heat from your warm body to the cold air. Wrap a thermometer in a sweater and it will not warm up at all.', hr: 'Džemper je izolator: ne stvara toplinu, nego samo usporava prijelaz topline s tvog toplog tijela na hladan zrak. Umotaj termometar u džemper i on se uopće neće ugrijati.' } }
      ]
    },

    electricity: {
      bullets: {
        en: [
          'There are two kinds of electric charge, positive and negative; like charges repel and unlike charges attract, and rubbing can move electrons from one object to another.',
          'Current flows only in a closed circuit made of a source, conductors, a switch and a device such as a bulb; insulators do not let charge through.',
          'Current (I, in amperes) tells how much charge flows every second, and voltage (U, in volts) is the push of the source that drives the current.',
          'Resistance (R, in ohms) opposes the current; Ohm\'s law says I = U / R, and a longer, thinner wire has more resistance.',
          'In a series circuit the same current flows through everything and one broken bulb stops the rest, while in a parallel circuit each branch gets the full voltage; electric power is P = U · I, and fuses protect against too much current.'
        ],
        hr: [
          'Postoje dvije vrste električnog naboja, pozitivni i negativni; istoimeni se naboji odbijaju, a raznoimeni privlače, a trljanjem se elektroni mogu prenijeti s jednog tijela na drugo.',
          'Struja teče samo u zatvorenom strujnom krugu od izvora, vodiča, sklopke i trošila poput žarulje; izolatori ne propuštaju naboj.',
          'Jakost struje (I, u amperima) govori koliko naboja proteče svake sekunde, a napon (U, u voltima) je poticaj izvora koji struju pokreće.',
          'Električni otpor (R, u omima) suprotstavlja se struji; Ohmov zakon kaže I = U / R, a dulja i tanja žica ima veći otpor.',
          'U serijskom spoju kroz sve teče ista struja i jedna pregorjela žarulja gasi ostale, a u paralelnom spoju svaka grana dobiva puni napon; električna snaga je P = U · I, a osigurači štite od prevelike struje.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Current gets used up in a bulb, so less comes out than goes in.', hr: 'Struja se u žarulji troši, pa iz nje izlazi manje struje nego što ulazi.' },
          truth: { en: 'The current is the same on both sides of the bulb; every electron that enters also leaves. What the bulb uses up is energy, which the current carries from the battery and turns into light and heat.', hr: 'Jakost struje jednaka je s obje strane žarulje; svaki elektron koji uđe iz nje i izađe. Žarulja troši energiju, koju struja donosi iz baterije i pretvara u svjetlost i toplinu.' } },
        { myth: { en: 'Voltage and current are the same thing.', hr: 'Napon i struja isto su.' },
          truth: { en: 'Voltage is the push of the source, measured in volts; current is the flow of charge it causes, measured in amperes. A wall socket has 230 V even when nothing is plugged in, but the current is zero until a circuit is closed.', hr: 'Napon je poticaj izvora i mjeri se u voltima, a struja je protok naboja koji on izaziva i mjeri se u amperima. Utičnica ima napon 230 V i kad ništa nije uključeno, ali je struja nula dok se strujni krug ne zatvori.' } },
        { myth: { en: 'One wire from the battery is enough to light a bulb.', hr: 'Jedna žica od baterije dovoljna je da žarulja svijetli.' },
          truth: { en: 'Charge has to flow in a closed loop: from one terminal of the battery, through the bulb and back to the other terminal. Break the loop anywhere, with an open switch or a missing wire, and the current stops.', hr: 'Naboj mora teći u zatvorenoj petlji: od jednog pola baterije, kroz žarulju i natrag do drugog pola. Prekini petlju bilo gdje, otvorenom sklopkom ili žicom koja nedostaje, i struja prestaje teći.' } }
      ]
    },

    magnetism: {
      bullets: {
        en: [
          'Every magnet has two poles, north and south; like poles repel and unlike poles attract, and cutting a magnet always gives two new magnets with both poles.',
          'Magnets attract only magnetic materials: iron, nickel, cobalt and steel; copper, aluminium, wood and plastic are not attracted.',
          'Around a magnet there is a magnetic field, which we picture with field lines running from the north pole to the south pole; iron filings make them visible.',
          'Earth is a huge magnet, so a compass needle lines up with its field and points roughly north; this field also shields us from particles from the Sun and creates the auroras.',
          'An electric current creates a magnetic field (Ørsted, 1820); a coil with an iron core is an electromagnet, stronger with more turns and more current, and it works in motors, loudspeakers and scrapyard cranes.'
        ],
        hr: [
          'Svaki magnet ima dva pola, sjeverni i južni; istoimeni se polovi odbijaju, a raznoimeni privlače, a razrezani magnet uvijek daje dva nova magneta s oba pola.',
          'Magnet privlači samo magnetične tvari: željezo, nikal, kobalt i čelik; bakar, aluminij, drvo i plastiku ne privlači.',
          'Oko magneta postoji magnetsko polje koje prikazujemo silnicama od sjevernog prema južnom polu; željezne strugotine čine ih vidljivima.',
          'Zemlja je golemi magnet, pa se igla kompasa postavi uzduž njezina polja i pokazuje približno prema sjeveru; to nas polje štiti i od čestica sa Sunca te stvara polarnu svjetlost.',
          'Električna struja stvara magnetsko polje (Ørsted, 1820.); zavojnica sa željeznom jezgrom je elektromagnet, jači s više namotaja i jačom strujom, a radi u motorima, zvučnicima i dizalicama na otpadu.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Magnets attract all metals.', hr: 'Magnet privlači sve metale.' },
          truth: { en: 'Only iron, nickel, cobalt and alloys such as steel are magnetic. Aluminium foil, copper wire and a gold ring are metals, but a magnet ignores them completely.', hr: 'Magnetični su samo željezo, nikal, kobalt i legure poput čelika. Aluminijska folija, bakrena žica i zlatni prsten metali su, ali magnet na njih uopće ne djeluje.' } },
        { myth: { en: 'If you cut a magnet in half, one piece is the north pole and the other the south pole.', hr: 'Ako magnet prerežeš napola, jedan komad je sjeverni pol, a drugi južni.' },
          truth: { en: 'Each half becomes a complete magnet with its own north and south pole. Poles always come in pairs, however many times you cut, right down to the tiny magnets inside the atoms.', hr: 'Svaka polovica postaje potpun magnet sa svojim sjevernim i južnim polom. Polovi uvijek dolaze u paru, koliko god puta rezao, sve do sitnih magneta u atomima.' } },
        { myth: { en: 'A compass needle points exactly to the geographic North Pole.', hr: 'Igla kompasa pokazuje točno prema zemljopisnom Sjevernom polu.' },
          truth: { en: 'The needle lines up with Earth\'s magnetic field, whose pole lies a few hundred kilometres from the geographic pole and slowly wanders. So a compass points only approximately north, and maps give the correction for each region.', hr: 'Igla se postavlja uzduž Zemljina magnetskog polja, čiji je pol nekoliko stotina kilometara udaljen od zemljopisnog pola i polako se pomiče. Zato kompas pokazuje samo približno prema sjeveru, a karte za svako područje daju ispravak.' } }
      ]
    },

    waves: {
      bullets: {
        en: [
          'An oscillation is a repeating back-and-forth motion; its period T is the time of one full swing and its frequency f = 1 / T counts swings per second, in hertz (Hz).',
          'A wave carries energy from place to place without carrying the matter along; in a transverse wave the particles move across the direction of travel, in a longitudinal wave along it.',
          'Wavelength λ is the distance between two neighbouring crests; wave speed, wavelength and frequency are linked by v = λ · f.',
          'Sound is a longitudinal wave made by vibrating objects; it needs a medium and travels at about 340 m/s in air, faster in water and fastest in solids, but not at all through a vacuum.',
          'Pitch depends on frequency (we hear roughly 20 Hz to 20 000 Hz) and loudness on amplitude; an echo is reflected sound, and resonance makes a body vibrate strongly at its own frequency.'
        ],
        hr: [
          'Titranje je gibanje koje se ponavlja amo-tamo; period T je vrijeme jednog punog titraja, a frekvencija f = 1 / T broji titraje u sekundi, u hercima (Hz).',
          'Val prenosi energiju s mjesta na mjesto, a tvar ne putuje s njim; u transverzalnom valu čestice titraju okomito na smjer širenja, a u longitudinalnom uzduž njega.',
          'Valna duljina λ razmak je između dvaju susjednih brjegova; brzina vala, valna duljina i frekvencija povezane su izrazom v = λ · f.',
          'Zvuk je longitudinalni val koji stvaraju tijela koja titraju; treba mu sredstvo i u zraku putuje oko 340 m/s, brže u vodi, a najbrže u čvrstim tijelima, dok kroz vakuum uopće ne prolazi.',
          'Visina tona ovisi o frekvenciji (čujemo otprilike od 20 Hz do 20 000 Hz), a glasnoća o amplitudi; jeka je odbijeni zvuk, a rezonancija jako zatitra tijelo na njegovoj vlastitoj frekvenciji.'
        ]
      },
      misconceptions: [
        { myth: { en: 'Sound travels through space, so you could hear an explosion there.', hr: 'Zvuk se širi svemirom, pa bi se ondje čula eksplozija.' },
          truth: { en: 'Sound needs a medium whose particles can vibrate: air, water or a solid. In the vacuum of space there is nothing to carry it, which is why astronauts talk by radio even when they are side by side outside the station.', hr: 'Zvuku treba sredstvo čije čestice mogu titrati: zrak, voda ili čvrsto tijelo. U vakuumu svemira nema ničega što bi ga prenosilo, zato astronauti razgovaraju radiom čak i kad su jedan uz drugoga izvan postaje.' } },
        { myth: { en: 'A louder sound has a higher pitch.', hr: 'Glasniji zvuk ima viši ton.' },
          truth: { en: 'Loudness and pitch are different things. Loudness depends on the amplitude of the vibration and pitch on its frequency: a big drum is loud but low, a quiet whistle is soft but high.', hr: 'Glasnoća i visina tona različite su stvari. Glasnoća ovisi o amplitudi titranja, a visina tona o frekvenciji: veliki bubanj glasan je, ali dubok, a tihi zvižduk tih je, ali visok.' } },
        { myth: { en: 'A wave carries the water along with it.', hr: 'Val nosi vodu sa sobom.' },
          truth: { en: 'A wave carries energy, not matter. A cork on a pond bobs up and down as waves pass and stays roughly in the same place, and the air in a room does not blow across it when someone speaks.', hr: 'Val prenosi energiju, a ne tvar. Čep na ribnjaku diže se i spušta dok valovi prolaze i ostaje otprilike na istom mjestu, a zrak u sobi ne puše preko nje kad netko govori.' } }
      ]
    },

    light: {
      bullets: {
        en: [
          'Light sources make their own light; we see everything else because light bounces off it into our eyes, and light travels in straight lines at about 300 000 km/s.',
          'Opaque objects block light and cast shadows; eclipses are shadows in space, the Moon\'s shadow on Earth or the Moon passing through Earth\'s shadow.',
          'The law of reflection: the angle of incidence equals the angle of reflection; a plane mirror gives a virtual image as far behind the mirror as the object is in front.',
          'Light bends (refracts) when it passes from air into water or glass; a converging lens gathers rays into a focus and a diverging lens spreads them apart.',
          'The eye focuses light onto the retina and glasses correct near- and far-sightedness; white light is a mixture of all colours, and an object shows the colour it reflects.'
        ],
        hr: [
          'Izvori svjetlosti stvaraju vlastitu svjetlost; sve ostalo vidimo jer se svjetlost od toga odbija u naše oči, a svjetlost se širi pravocrtno brzinom oko 300 000 km/s.',
          'Neprozirna tijela zaustavljaju svjetlost i stvaraju sjene; pomrčine su sjene u svemiru, Mjesečeva sjena na Zemlji ili prolazak Mjeseca kroz Zemljinu sjenu.',
          'Zakon odbijanja: upadni kut jednak je kutu odbijanja; ravno zrcalo daje virtualnu sliku jednako daleko iza zrcala koliko je predmet ispred njega.',
          'Svjetlost se lomi pri prelasku iz zraka u vodu ili staklo; konvergentna leća skuplja zrake u žarište, a divergentna ih razdvaja.',
          'Oko lomi svjetlost na mrežnicu, a naočale ispravljaju kratkovidnost i dalekovidnost; bijela svjetlost mješavina je svih boja, a predmet pokazuje boju svjetlosti koju odbija.'
        ]
      },
      misconceptions: [
        { myth: { en: 'We see because light comes out of our eyes and reaches the object.', hr: 'Vidimo zato što svjetlost izlazi iz naših očiju i stiže do predmeta.' },
          truth: { en: 'Eyes only receive light. We see an object when light from a source bounces off it and enters the eye, which is why in a completely dark room you see nothing, however long you wait.', hr: 'Oči svjetlost samo primaju. Predmet vidimo kad se svjetlost iz nekog izvora odbije od njega i uđe u oko, zato u potpuno tamnoj sobi ne vidiš ništa, koliko god dugo čekao.' } },
        { myth: { en: 'A red apple is red in any light.', hr: 'Crvena jabuka crvena je na svakoj svjetlosti.' },
          truth: { en: 'An object has no colour of its own; it reflects some colours and absorbs the rest. A red apple reflects mainly red light, so under pure blue light there is no red to reflect and the apple looks almost black.', hr: 'Predmet nema vlastitu boju; neke boje odbija, a ostale upija. Crvena jabuka odbija uglavnom crvenu svjetlost, pa pod čisto plavom svjetlošću nema crvene koju bi odbila i jabuka izgleda gotovo crna.' } },
        { myth: { en: 'Light arrives instantly; when you see something, you see it as it is right now.', hr: 'Svjetlost stiže trenutačno; kad nešto vidiš, vidiš ga kakvo je upravo sada.' },
          truth: { en: 'Light is extremely fast but not infinitely fast. Sunlight takes about 8 minutes to reach us and moonlight about 1.3 seconds, and the light of the nearest star after the Sun left it more than four years ago.', hr: 'Svjetlost je izuzetno brza, ali ne beskonačno brza. Sunčevoj svjetlosti treba oko 8 minuta do nas, Mjesečevoj oko 1,3 sekunde, a svjetlost najbliže zvijezde nakon Sunca krenula je prije više od četiri godine.' } }
      ]
    },

    space: {
      bullets: {
        en: [
          'Earth spins around its axis once a day, which gives us day and night, and it travels once around the Sun in a year.',
          'The seasons come from the 23.5° tilt of Earth\'s axis, not from its distance to the Sun; the half of Earth tilted towards the Sun has summer.',
          'The Moon circles Earth in about a month and shines with reflected sunlight; we see changing phases because we see different parts of its sunlit half.',
          'The Solar System has eight planets orbiting the Sun, plus moons, dwarf planets, asteroids and comets, spread across an enormous empty space.',
          'Gravity keeps planets and satellites in their orbits, astronauts feel weightless because they are in free fall, and distances to the stars are measured in light years.'
        ],
        hr: [
          'Zemlja se jednom na dan okrene oko svoje osi, zbog čega imamo dan i noć, a oko Sunca obiđe jednom u godini.',
          'Godišnja doba posljedica su nagiba Zemljine osi od 23,5°, a ne udaljenosti od Sunca; polovica Zemlje nagnuta prema Suncu ima ljeto.',
          'Mjesec obiđe Zemlju za otprilike mjesec dana i sjaji odbijenom Sunčevom svjetlošću; mijene vidimo zato što vidimo različite dijelove njegove osvijetljene polovice.',
          'Sunčev sustav ima osam planeta koji kruže oko Sunca, uz mjesece, patuljaste planete, asteroide i komete, raspoređene po golemom praznom prostoru.',
          'Gravitacija drži planete i satelite na njihovim putanjama, astronauti su u bestežinskom stanju jer slobodno padaju, a udaljenosti do zvijezda mjerimo svjetlosnim godinama.'
        ]
      },
      misconceptions: [
        { myth: { en: 'The phases of the Moon are caused by Earth\'s shadow.', hr: 'Mjesečeve mijene nastaju zbog Zemljine sjene.' },
          truth: { en: 'The Sun always lights exactly half of the Moon; as the Moon circles Earth we see different amounts of that lit half, from a thin crescent to full Moon. Earth\'s shadow falls on the Moon only during a lunar eclipse, a few times a year at most.', hr: 'Sunce uvijek osvjetljava točno polovicu Mjeseca; dok Mjesec kruži oko Zemlje, vidimo različite dijelove te osvijetljene polovice, od tankog srpa do punog Mjeseca. Zemljina sjena pada na Mjesec samo za pomrčine Mjeseca, najviše nekoliko puta na godinu.' } },
        { myth: { en: 'Summer is warm because Earth is closer to the Sun then.', hr: 'Ljeto je toplo zato što je Zemlja tada bliže Suncu.' },
          truth: { en: 'The seasons come from the 23.5° tilt of Earth\'s axis. In summer our half of Earth is tilted towards the Sun, so the days are long and the sunlight falls more steeply; Earth is actually closest to the Sun in early January.', hr: 'Godišnja doba posljedica su nagiba Zemljine osi od 23,5°. Ljeti je naša polovica Zemlje nagnuta prema Suncu, pa su dani dugi, a sunčeve zrake padaju okomitije; Zemlja je Suncu zapravo najbliža početkom siječnja.' } },
        { myth: { en: 'Astronauts float because there is no gravity in space.', hr: 'Astronauti lebde zato što u svemiru nema gravitacije.' },
          truth: { en: 'At the height of the space station, about 400 km, gravity is still about 90 % as strong as on the ground. The astronauts float because they and the station are falling around the Earth together, in free fall.', hr: 'Na visini svemirske postaje, oko 400 km, gravitacija je još uvijek oko 90 % jaka kao na tlu. Astronauti lebde zato što oni i postaja zajedno padaju oko Zemlje, u slobodnom padu.' } }
      ]
    }

  });
})();
