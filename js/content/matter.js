/* FizLab topic: Matter and Measurement / Tijela i tvari */
(function () {
  'use strict';
  window.Content.register({
    id: 'matter',
    order: 10,
    gradeLevel: 7,
    color: 'c3',
    title: { en: 'Matter and Measurement', hr: 'Tijela i tvari' },
    intro: {
      en: 'Everything around you is made of tiny particles. Learn to tell a body from a substance and to measure length, volume and mass like a scientist.',
      hr: 'Sve oko tebe građeno je od sitnih čestica. Nauči razlikovati tijelo od tvari i mjeriti duljinu, obujam i masu kao pravi znanstvenik.'
    },
    sims: ['states', 'measure', 'gas'],

    lesson: [
      {
        h: { en: 'Body and substance', hr: 'Tijelo i tvar' },
        p: {
          en: [
            'Look around: a spoon, a window, a bottle of water, a bike. In physics each of these objects is called a body. The material a body is made of is called a substance. A spoon can be made of steel or of plastic; a window is made of glass. One body can even contain several substances: a pencil has wood and graphite.',
            'Every substance has its own properties: colour, hardness, smell, whether it conducts heat or electricity, at what temperature it melts. Iron is hard, grey and rusts; gold shines and never rusts; sugar dissolves in water, sand does not. By testing these properties we can tell substances apart, even when two bodies look exactly the same.'
          ],
          hr: [
            'Pogledaj oko sebe: žlica, prozor, boca vode, bicikl. U fizici se svaki takav predmet zove tijelo. Ono od čega je tijelo načinjeno zove se tvar. Žlica može biti od čelika ili od plastike, a prozor je od stakla. Jedno tijelo može biti načinjeno i od više tvari: olovka je od drva i grafita.',
            'Svaka tvar ima svoja svojstva: boju, tvrdoću i miris, a važno je i provodi li toplinu i električnu struju te na kojoj se temperaturi tali. Željezo je tvrdo, sivo i hrđa; zlato se sjaji i nikad ne hrđa; šećer se otapa u vodi, a pijesak ne. Ispitivanjem tih svojstava možemo razlikovati tvari čak i kad dva tijela izgledaju posve jednako.'
          ]
        }
      },
      {
        h: { en: 'Everything is made of tiny particles', hr: 'Sve je građeno od sitnih čestica' },
        p: {
          en: [
            'If you could zoom into a drop of water millions of times, you would see that it is not smooth at all. It is made of tiny particles, far too small to see even with a school microscope. All matter is built this way: air, stone, your own body. Between the particles there is empty space.',
            'The particles are never still. They jiggle, bump into each other and move around. You can notice this yourself: drop a tea bag into hot water and the colour spreads without stirring, because moving water particles carry the colour away. A drop of perfume in one corner is soon smelled across the whole room.',
            'The particles also attract each other. That is why a drop of water keeps its shape on a leaf and why you need force to break a stick. In hotter substances the particles move faster. That is what temperature really measures: how fast the particles are moving.'
          ],
          hr: [
            'Kad bismo kap vode mogli povećati milijune puta, vidjeli bismo da uopće nije glatka. Građena je od sitnih čestica, premalenih da bi se vidjele čak i školskim mikroskopom. Tako je građena sva tvar: zrak, kamen, pa i tvoje tijelo. Između čestica je prazan prostor.',
            'Čestice nikad ne miruju. Titraju, sudaraju se i premještaju s mjesta na mjesto. To lako možeš primijetiti: spusti vrećicu čaja u vruću vodu i boja će se proširiti i bez miješanja jer je raznose čestice vode koje se gibaju. Kap parfema u jednom kutu sobe ubrzo se osjeti u cijeloj sobi.',
            'Čestice se i međusobno privlače. Zato kap vode na listu zadržava svoj oblik i zato je potrebna sila da slomiš štap. U toplijim tvarima čestice se gibaju brže, a u hladnijima sporije. Upravo to pokazuje temperatura: koliko se brzo gibaju čestice neke tvari.'
          ]
        }
      },
      {
        h: { en: 'The three states of matter', hr: 'Tri agregacijska stanja' },
        p: {
          en: [
            'Matter comes in three states: solid, liquid and gas. Ice, water and steam are the same substance, water, in three states. A solid keeps its shape and its volume. A liquid keeps its volume but takes the shape of its container. A gas has neither a fixed shape nor a fixed volume: it spreads out to fill whatever space it is given.',
            'The particles explain the difference. In a solid they are packed tightly in a regular pattern and only vibrate in place, like people in a crowded cinema. In a liquid they are still close but can slide past each other, like people in a crowded corridor. In a gas they are far apart and fly freely, like children running across an empty playground.',
            'Heating gives the particles more energy. Heat ice and the particles shake loose from their pattern: the ice melts. Heat water enough and particles escape into the air: the water boils and evaporates. Cooling does the opposite: steam condenses into drops on a cold window, and water freezes in the freezer.'
          ],
          hr: [
            'Tvar može biti u trima agregacijskim stanjima: čvrstom, tekućem i plinovitom. Led, tekuća voda i vodena para ista su tvar – voda – u trima različitim stanjima. Čvrsto tijelo zadržava i oblik i obujam. Tekućina zadržava obujam, ali poprima oblik posude. Plin nema ni stalan oblik ni stalan obujam: širi se i ispunjava sav prostor koji mu je na raspolaganju.',
            'Razliku objašnjavamo česticama. U čvrstom tijelu one su gusto i pravilno složene te samo titraju na mjestu, kao ljudi u punom kinu. U tekućini su i dalje blizu jedna drugoj, ali mogu kliziti jedna pokraj druge, kao ljudi u punom hodniku. U plinu su daleko jedna od druge i slobodno lete, kao djeca koja trče po praznom igralištu.',
            'Zagrijavanjem čestice dobivaju više energije. Zagrijemo li led, čestice se oslobode iz pravilnog poretka: led se tali. Zagrijemo li vodu dovoljno, čestice izlijeću u zrak: voda isparava i vrije. Hlađenje ima suprotan učinak: para se na hladnom prozoru kondenzira u kapljice, a voda se u zamrzivaču smrzava.'
          ]
        },
        svg: '<svg viewBox="0 0 420 130" role="img"><rect x="15" y="15" width="110" height="100" rx="6" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><g fill="var(--c3)"><circle cx="35" cy="35" r="7"/><circle cx="55" cy="35" r="7"/><circle cx="75" cy="35" r="7"/><circle cx="95" cy="35" r="7"/><circle cx="115" cy="35" r="7"/><circle cx="35" cy="55" r="7"/><circle cx="55" cy="55" r="7"/><circle cx="75" cy="55" r="7"/><circle cx="95" cy="55" r="7"/><circle cx="115" cy="55" r="7"/><circle cx="35" cy="75" r="7"/><circle cx="55" cy="75" r="7"/><circle cx="75" cy="75" r="7"/><circle cx="95" cy="75" r="7"/><circle cx="115" cy="75" r="7"/><circle cx="35" cy="95" r="7"/><circle cx="55" cy="95" r="7"/><circle cx="75" cy="95" r="7"/><circle cx="95" cy="95" r="7"/><circle cx="115" cy="95" r="7"/></g><rect x="155" y="15" width="110" height="100" rx="6" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><g fill="var(--c3)"><circle cx="172" cy="60" r="7"/><circle cx="190" cy="48" r="7"/><circle cx="210" cy="58" r="7"/><circle cx="230" cy="46" r="7"/><circle cx="248" cy="60" r="7"/><circle cx="180" cy="78" r="7"/><circle cx="200" cy="74" r="7"/><circle cx="220" cy="80" r="7"/><circle cx="240" cy="76" r="7"/><circle cx="172" cy="98" r="7"/><circle cx="192" cy="94" r="7"/><circle cx="212" cy="100" r="7"/><circle cx="232" cy="96" r="7"/><circle cx="250" cy="98" r="7"/></g><rect x="295" y="15" width="110" height="100" rx="6" fill="var(--surface2)" stroke="var(--fg)" stroke-width="2"/><g fill="var(--c3)"><circle cx="315" cy="40" r="7"/><circle cx="380" cy="30" r="7"/><circle cx="350" cy="68" r="7"/><circle cx="312" cy="98" r="7"/><circle cx="388" cy="92" r="7"/></g><g stroke="var(--muted)" stroke-width="2" stroke-linecap="round"><line x1="324" y1="46" x2="336" y2="56"/><line x1="371" y1="34" x2="358" y2="40"/><line x1="357" y1="60" x2="368" y2="50"/><line x1="320" y1="92" x2="332" y2="84"/><line x1="380" y1="86" x2="370" y2="76"/></g></svg>'
      },
      {
        h: { en: 'Particles never rest: Brownian motion and gas pressure', hr: 'Čestice nikad ne miruju: Brownovo gibanje i tlak plina' },
        p: {
          en: [
            'In 1827 the Scottish botanist Robert Brown looked through his microscope at tiny grains from pollen floating in water and saw something odd: the grains kept jiggling to and fro and never came to rest. They were not alive; dust from stone did the same. Today we know why: the invisible particles of water hit each grain from all sides, now harder from the left, now from the right. Brownian motion is visible evidence that particles never rest.',
            'The same restless motion explains the pressure of a gas. The particles of air in a ball or a tyre fly around at several hundred metres per second and keep crashing into the walls. One hit is far too weak to notice, but countless hits every second add up to a steady push on every square centimetre of the wall. That is how the pressure of a gas arises.',
            'There are two ways to raise the pressure. Squeeze the gas into a smaller space, as a bicycle pump does, and the particles hit the walls more often. Or heat it: hotter particles move faster and hit harder, so a football left in the sun becomes rock hard. This is also why you must never heat a spray can or throw it into a fire: the pressure can grow until the can bursts.'
          ],
          hr: [
            'Godine 1827. škotski botaničar Robert Brown promatrao je mikroskopom sitna zrnca iz peludi koja su plutala u vodi i opazio nešto neobično: zrnca su se neprestano trzala amo-tamo i nikako se nisu smirivala. Nije bila riječ o živim bićima: jednako se ponašala i kamena prašina. Danas znamo zašto: nevidljive čestice vode udaraju u svako zrnce sa svih strana, čas jače slijeva, čas zdesna. Brownovo gibanje vidljiv je dokaz da čestice nikad ne miruju.',
            'Isto nemirno gibanje objašnjava tlak plina. Čestice zraka u lopti ili automobilskoj gumi jure brzinama od nekoliko stotina metara u sekundi i neprestano udaraju u stijenke. Jedan udarac preslab je da bismo ga osjetili, ali bezbrojni udarci svake sekunde zbrajaju se u stalnu silu na svaki kvadratni centimetar stijenke. Tako nastaje tlak plina.',
            'Tlak možemo povećati na dva načina. Možemo plin stisnuti u manji prostor, kao što to čini pumpa za bicikl, pa čestice češće udaraju u stijenke. Ili ga možemo zagrijati: toplije čestice gibaju se brže i udaraju jače, pa nogometna lopta ostavljena na suncu postane tvrda kao kamen. Zato nikad ne smiješ zagrijavati bocu spreja ni bacati je u vatru: tlak može narasti toliko da boca eksplodira.'
          ]
        }
      },
      {
        h: { en: 'Measuring length', hr: 'Mjerenje duljine' },
        p: {
          en: [
            'Measuring means comparing something with a unit. The basic unit of length is the metre (m). A door is about 2 m high and a big step is about 1 m long. For small things we use centimetres (cm) and millimetres (mm): 1 m = 100 cm = 1000 mm. For long distances we use kilometres (km): 1 km = 1000 m.',
            'A ruler measures short lengths; a tape measure is for longer ones, such as a room or a running track. Always read a ruler from the zero mark, not from its edge, and look straight down at the scale. Every measurement has a small error, so scientists repeat it a few times and take the average.'
          ],
          hr: [
            'Mjeriti znači uspoređivati nešto s mjernom jedinicom. Osnovna jedinica duljine jest metar (m). Vrata su visoka oko 2 m, a veliki korak dug je oko 1 m. Kratke duljine izražavamo u centimetrima (cm) i milimetrima (mm): 1 m = 100 cm = 1000 mm. Velike udaljenosti izražavamo u kilometrima (km): 1 km = 1000 m.',
            'Ravnalom mjerimo kratke duljine, a mjernom vrpcom dulje, primjerice duljinu sobe ili trkaće staze. Uvijek mjeri od oznake 0 na ravnalu, a ne od njegova ruba, i gledaj okomito na ljestvicu. Svako mjerenje ima malu pogrešku, pa znanstvenici mjerenje ponavljaju nekoliko puta i računaju srednju vrijednost.'
          ]
        }
      },
      {
        h: { en: 'Measuring volume', hr: 'Mjerenje obujma' },
        p: {
          en: [
            'Volume tells how much space a body takes up. The unit is the cubic metre (m³): a cube with edges of 1 m. That is big, so we usually use smaller units. A cubic decimetre (dm³) is a cube with 10 cm edges and holds exactly one litre (L). A cubic centimetre (cm³) is the size of a sugar cube and holds one millilitre (mL). So 1 L = 1000 mL and 1 m³ = 1000 L.',
            'For a box we calculate the volume: length × width × height. A box 10 cm × 5 cm × 4 cm has a volume of 200 cm³. Liquids are measured in a measuring cylinder or a kitchen measuring jug. Read the scale at the bottom of the curved water surface, with your eye at the same level, otherwise you read too much or too little.',
            'What about a stone or a key, with no straight edges? Use water. Pour some water into a measuring cylinder and note the level, for example 60 mL. Lower the stone in and read again, say 85 mL. The water rose by 25 mL, so the stone pushed aside 25 mL of water. Its volume is therefore 25 cm³.'
          ],
          hr: [
            'Obujam (volumen) govori koliko prostora tijelo zauzima. Jedinica obujma je kubni metar (m³), obujam kocke s bridom od 1 m. To je velika jedinica, pa se obično služimo manjima. Kubni decimetar (dm³) kocka je s bridom od 10 cm i u nju stane točno jedna litra (L). Kubni centimetar (cm³) velik je kao kockica šećera i u njega stane jedan mililitar (mL). Dakle, 1 L = 1000 mL, a 1 m³ = 1000 L.',
            'Obujam kutije (kvadra) izračunamo tako da pomnožimo duljinu, širinu i visinu. Kutija dimenzija 10 cm × 5 cm × 4 cm ima obujam 200 cm³. Obujam tekućine mjerimo menzurom ili kuhinjskom mjericom. Vrijednost očitaj na dnu zakrivljene površine vode, s okom u visini površine; inače ćeš očitati previše ili premalo.',
            'A kako izmjeriti obujam kamena ili ključa, koji nemaju ravne bridove? Pomoću vode. Ulij malo vode u menzuru i zabilježi razinu, na primjer 60 mL. Spusti kamen u vodu i ponovno očitaj razinu, recimo 85 mL. Razina se podigla za 25 mL, dakle kamen je istisnuo 25 mL vode. Njegov je obujam stoga 25 cm³.'
          ]
        },
        svg: '<svg viewBox="0 0 420 140" role="img"><rect x="80" y="15" width="70" height="110" rx="4" fill="none" stroke="var(--fg)" stroke-width="2"/><rect x="81" y="70" width="68" height="54" fill="var(--c1)" opacity="0.45"/><line x1="80" y1="70" x2="150" y2="70" stroke="var(--c1)" stroke-width="3"/><g stroke="var(--muted)" stroke-width="2"><line x1="80" y1="40" x2="92" y2="40"/><line x1="80" y1="55" x2="92" y2="55"/><line x1="80" y1="85" x2="92" y2="85"/><line x1="80" y1="100" x2="92" y2="100"/></g><text x="160" y="74" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">60 mL</text><rect x="270" y="15" width="70" height="110" rx="4" fill="none" stroke="var(--fg)" stroke-width="2"/><rect x="271" y="51" width="68" height="73" fill="var(--c1)" opacity="0.45"/><line x1="270" y1="51" x2="340" y2="51" stroke="var(--c1)" stroke-width="3"/><g stroke="var(--muted)" stroke-width="2"><line x1="270" y1="40" x2="282" y2="40"/><line x1="270" y1="55" x2="282" y2="55"/><line x1="270" y1="85" x2="282" y2="85"/><line x1="270" y1="100" x2="282" y2="100"/></g><ellipse cx="305" cy="108" rx="18" ry="12" fill="var(--c3)" stroke="var(--fg)" stroke-width="2"/><text x="350" y="55" fill="var(--fg)" font-family="inherit" font-size="13" font-weight="700">85 mL</text><text x="210" y="74" text-anchor="middle" fill="var(--muted)" font-family="inherit" font-size="20" font-weight="700">→</text></svg>'
      },
      {
        h: { en: 'Measuring mass and unit prefixes', hr: 'Mjerenje mase i predmetci jedinica' },
        p: {
          en: [
            'Mass tells how much matter a body contains. The unit is the kilogram (kg). A litre of water has a mass of almost exactly 1 kg, a bag of sugar 1 kg, you perhaps 40 kg. For small things we use grams (g) and milligrams (mg): 1 kg = 1000 g and 1 g = 1000 mg. Very heavy loads are given in tonnes: 1 t = 1000 kg.',
            'Mass is measured with a balance. An old-fashioned balance compares the body with known masses on two pans; a kitchen or bathroom scale shows the result directly. Mass does not change when you move a body: a 1 kg bag has a mass of 1 kg in Zagreb, on a mountain or on the Moon.',
            'The small letters in front of a unit are prefixes, and each one stands for a number: kilo (k) means 1000, centi (c) means one hundredth, milli (m) means one thousandth. The same prefixes work for every unit. To convert, multiply or divide: 3.5 km = 3500 m, 250 cm = 2.5 m, 0.75 kg = 750 g, 40 mm = 4 cm.'
          ],
          hr: [
            'Masa govori koliko tvari tijelo sadrži. Jedinica je kilogram (kg). Litra vode ima masu gotovo točno 1 kg, vrećica šećera 1 kg, ti možda 40 kg. Mase malih tijela izražavamo u gramima (g) i miligramima (mg): 1 kg = 1000 g, a 1 g = 1000 mg. Vrlo teške terete izražavamo u tonama: 1 t = 1000 kg.',
            'Masu mjerimo vagom. Starinska vaga s dvjema zdjelicama uspoređuje tijelo s poznatim utezima, a kuhinjska ili osobna vaga odmah pokazuje rezultat. Masa se ne mijenja kad tijelo premjestimo: vrećica od 1 kg ima masu 1 kg u Zagrebu, na planini i na Mjesecu.',
            'Mala slova ispred jedinice zovu se predmetci (prefiksi) i svaki označava neki broj: kilo (k) znači tisuću (1000), centi (c) jednu stotinku, a mili (m) jednu tisućinku. Isti predmetci vrijede za sve jedinice. Pri pretvaranju množimo ili dijelimo: 3,5 km = 3500 m, 250 cm = 2,5 m, 0,75 kg = 750 g, 40 mm = 4 cm.'
          ]
        }
      }
    ],

    keyTerms: [
      { term: { en: 'body', hr: 'tijelo' }, def: { en: 'Any object: a spoon, a stone, a drop of water, a planet.', hr: 'Bilo koji predmet: žlica, kamen, kap vode, planet.' } },
      { term: { en: 'substance', hr: 'tvar' }, def: { en: 'The material a body is made of, such as steel, glass, water or air.', hr: 'Ono od čega je tijelo načinjeno, na primjer čelik, staklo, voda ili zrak.' } },
      { term: { en: 'particle', hr: 'čestica' }, def: { en: 'One of the tiny building blocks that all matter is made of. Particles are always moving.', hr: 'Jedan od sitnih dijelova od kojih je građena sva tvar. Čestice se stalno gibaju.' } },
      { term: { en: 'state of matter', hr: 'agregacijsko stanje' }, def: { en: 'The form a substance is in: solid, liquid or gas.', hr: 'Stanje u kojem se tvar nalazi: čvrsto, tekuće ili plinovito.' } },
      { term: { en: 'melting', hr: 'taljenje' }, def: { en: 'The change from solid to liquid when a substance is heated.', hr: 'Prijelaz iz čvrstog u tekuće stanje zagrijavanjem.' } },
      { term: { en: 'evaporation', hr: 'isparavanje' }, def: { en: 'The change from liquid to gas, when particles escape from the surface of a liquid.', hr: 'Prijelaz iz tekućeg u plinovito stanje pri kojem čestice izlaze s površine tekućine.' } },
      { term: { en: 'Brownian motion', hr: 'Brownovo gibanje' }, def: { en: 'The endless random jiggling of tiny grains in a liquid or gas, caused by hits from invisible particles. First described by Robert Brown in 1827.', hr: 'Neprestano nasumično gibanje sitnih zrnaca u tekućini ili plinu, uzrokovano udarcima nevidljivih čestica. Prvi ga je opisao Robert Brown 1827. godine.' } },
      { term: { en: 'gas pressure', hr: 'tlak plina' }, def: { en: 'The push of a gas on the walls of its container, made by countless hits of its particles. It grows when the gas is squeezed or heated.', hr: 'Djelovanje plina na stijenke posude, nastalo bezbrojnim udarcima njegovih čestica. Raste kad plin stisnemo ili zagrijemo.' } },
      { term: { en: 'length', hr: 'duljina' }, def: { en: 'How long something is. Unit: metre (m).', hr: 'Koliko je nešto dugo. Jedinica: metar (m).' } },
      { term: { en: 'volume', hr: 'obujam (volumen)' }, def: { en: 'How much space a body takes up. Units: m³, dm³ (litre), cm³ (millilitre).', hr: 'Koliko prostora tijelo zauzima. Jedinice: m³, dm³ (litra), cm³ (mililitar).' } },
      { term: { en: 'measuring cylinder', hr: 'menzura' }, def: { en: 'A tall glass with a scale for measuring the volume of liquids.', hr: 'Visoka staklena posuda s ljestvicom za mjerenje obujma tekućina.' } },
      { term: { en: 'mass', hr: 'masa' }, def: { en: 'How much matter a body contains. Unit: kilogram (kg). The same everywhere.', hr: 'Koliko tvari tijelo sadrži. Jedinica: kilogram (kg). Ista je na svakom mjestu.' } },
      { term: { en: 'balance', hr: 'vaga' }, def: { en: 'An instrument for measuring mass.', hr: 'Sprava za mjerenje mase.' } },
      { term: { en: 'prefix', hr: 'predmetak (prefiks)' }, def: { en: 'A letter in front of a unit that multiplies it: kilo = 1000, centi = 1/100, milli = 1/1000.', hr: 'Slovo ispred jedinice koje je množi: kilo = 1000, centi = 1/100, mili = 1/1000.' } }
    ],

    formulas: [
      { expr: 'V = a · b · c', name: { en: 'volume of a box', hr: 'obujam kvadra' }, note: { en: 'multiply length, width and height', hr: 'pomnoži duljinu, širinu i visinu' } },
      { expr: '1 km = 1000 m, 1 m = 100 cm = 1000 mm', name: { en: 'units of length', hr: 'jedinice duljine' }, note: { en: 'kilo = 1000, centi = 1/100, milli = 1/1000', hr: 'kilo = 1000, centi = 1/100, mili = 1/1000' } },
      { expr: '1 dm³ = 1 L = 1000 cm³ = 1000 mL', name: { en: 'units of volume', hr: 'jedinice obujma' }, note: { en: '1 m³ = 1000 L', hr: '1 m³ = 1000 L' } },
      { expr: '1 kg = 1000 g, 1 g = 1000 mg', name: { en: 'units of mass', hr: 'jedinice mase' }, note: { en: '1 t = 1000 kg', hr: '1 t = 1000 kg' } }
    ],

    funFact: {
      en: 'Until 2019 the kilogram was defined by one metal cylinder kept in a vault near Paris, and every scale in the world was ultimately compared with it. Today it is defined by a constant of nature, so it can never be scratched, dusted or lost.',
      hr: 'Do 2019. godine kilogram je bio određen jednim metalnim valjkom koji se čuvao u trezoru kraj Pariza, a sve vage na svijetu u konačnici su se uspoređivale s njim. Danas je određen prirodnom konstantom, pa ga više nije moguće ogrepsti, zaprašiti ni izgubiti.'
    },

    experiment: {
      title: { en: 'Measure the volume of a stone with water', hr: 'Izmjeri obujam kamena pomoću vode' },
      materials: {
        en: ['a kitchen measuring jug with a millilitre scale', 'water', 'a small stone that fits into the jug', 'a key or a toy brick', 'paper and a pencil'],
        hr: ['kuhinjska mjerica s ljestvicom u mililitrima', 'voda', 'mali kamen koji stane u mjericu', 'ključ ili kockica za slaganje', 'papir i olovka']
      },
      steps: {
        en: [
          'Pour water into the jug up to a round mark, for example 200 mL. Put the jug on the table and read the level with your eye at the same height as the water surface.',
          'Write down the level. This is the volume of the water alone.',
          'Tilt the jug a little and let the stone slide gently into the water, so it does not splash. Make sure it is completely under water.',
          'Read the new level the same way and write it down.',
          'Subtract: new level minus old level. The difference in millilitres is the volume of the stone in cubic centimetres.',
          'Repeat with the key or the toy brick. For the brick, also measure its edges with a ruler and multiply them. Do the two volumes agree?'
        ],
        hr: [
          'Ulij vodu u mjericu do oznake s okruglim brojem, na primjer 200 mL. Stavi mjericu na stol i očitaj razinu s okom u visini površine vode.',
          'Zapiši razinu. To je obujam same vode.',
          'Malo nagni mjericu i pusti da kamen lagano sklizne u vodu kako ne bi prskala. Provjeri je li kamen potpuno pod vodom.',
          'Na isti način očitaj novu razinu i zapiši je.',
          'Od nove razine oduzmi staru. Razlika u mililitrima obujam je kamena u kubnim centimetrima.',
          'Ponovi pokus s ključem ili kockicom. Kockici još ravnalom izmjeri bridove i pomnoži njihove duljine. Slažu li se ta dva obujma?'
        ]
      },
      explain: {
        en: 'A body under water pushes aside exactly as much water as its own volume, because two things cannot be in the same place at the same time. The water has nowhere to go but up, so the rise in the level shows the volume of the stone. 1 mL is exactly 1 cm³.',
        hr: 'Tijelo pod vodom istisne točno onoliko vode koliki je njegov obujam, jer dvije stvari ne mogu istodobno biti na istom mjestu. Voda se nema kamo maknuti osim prema gore, pa porast razine pokazuje obujam kamena. 1 mL jednak je točno 1 cm³.'
      },
      safety: { en: 'Wipe up any spilled water so nobody slips.', hr: 'Obriši prolivenu vodu da se nitko ne posklizne.' }
    },

    quiz: [
      { type: 'mc', q: { en: 'Which of these is a substance, not a body?', hr: 'Što je od navedenog tvar, a ne tijelo?' },
        options: [{ en: 'a spoon', hr: 'žlica' }, { en: 'a bottle', hr: 'boca' }, { en: 'a bicycle', hr: 'bicikl' }, { en: 'steel', hr: 'čelik' }], answer: 3,
        explain: { en: 'Steel is a material, a substance. A spoon, a bottle and a bicycle are bodies made of substances.', hr: 'Čelik je materijal, tvar. Žlica, boca i bicikl tijela su načinjena od tvari.' } },
      { type: 'mc', q: { en: 'Which state of matter keeps its volume but takes the shape of its container?', hr: 'Koje agregacijsko stanje zadržava obujam, ali poprima oblik posude?' },
        options: [{ en: 'solid', hr: 'čvrsto' }, { en: 'gas', hr: 'plinovito' }, { en: 'liquid', hr: 'tekuće' }, { en: 'none of them', hr: 'nijedno' }], answer: 2,
        explain: { en: 'A liquid keeps its volume but flows to fill the shape of its container. A solid keeps both, a gas keeps neither.', hr: 'Tekućina zadržava obujam, ali poprima oblik posude. Čvrsto tijelo zadržava oboje, a plin ništa od toga.' } },
      { type: 'mc', q: { en: 'One litre is the same volume as…', hr: 'Jedna litra jednaka je…' },
        options: [{ en: '1 cm³', hr: '1 cm³' }, { en: '1 dm³', hr: '1 dm³' }, { en: '1 m³', hr: '1 m³' }, { en: '100 mL', hr: '100 mL' }], answer: 1,
        explain: { en: 'A litre is a cube with 10 cm edges, which is one cubic decimetre: 1 L = 1 dm³ = 1000 mL.', hr: 'Litra je obujam kocke s bridom od 10 cm, a to je jedan kubni decimetar: 1 L = 1 dm³ = 1000 mL.' } },
      { type: 'tf', q: { en: 'The particles of a solid do not move at all.', hr: 'Čestice čvrstog tijela uopće se ne gibaju.' }, answer: false,
        explain: { en: 'They cannot swap places, but they constantly vibrate around their positions. The hotter the solid, the stronger the vibration.', hr: 'Ne mogu mijenjati mjesta, ali stalno titraju oko svojih položaja. Što je tijelo toplije, titranje je jače.' } },
      { type: 'mc', q: { en: 'Why does a football left in the sun become harder?', hr: 'Zašto nogometna lopta ostavljena na suncu postane tvrđa?' },
        options: [{ en: 'more air gets into the ball', hr: 'u loptu uđe još zraka' }, { en: 'the air particles move faster and hit the walls harder', hr: 'čestice zraka gibaju se brže i jače udaraju u stijenke' }, { en: 'the air particles grow bigger', hr: 'čestice zraka postanu veće' }, { en: 'the ball shrinks in the heat', hr: 'lopta se na toplini skupi' }], answer: 1,
        explain: { en: 'The number and size of the particles stay the same. Heating makes them move faster, so they hit the inside of the ball harder and more often, and the gas pressure rises.', hr: 'Broj i veličina čestica ostaju isti. Zagrijavanjem se čestice gibaju brže, pa jače i češće udaraju u unutrašnju stijenku lopte i tlak plina raste.' } },
      { type: 'num', q: { en: 'A hiking trail is 2.5 km long. How many metres is that?', hr: 'Planinarska staza duga je 2,5 km. Koliko je to metara?' },
        answer: 2500, tolerance: 1, unit: 'm',
        explain: { en: 'kilo means 1000, so 2.5 km = 2.5 × 1000 m = 2500 m.', hr: 'kilo znači 1000, pa je 2,5 km = 2,5 × 1000 m = 2500 m.' } },
      { type: 'mc', q: { en: 'Which instrument measures mass?', hr: 'Kojom spravom mjerimo masu?' },
        options: [{ en: 'a ruler', hr: 'ravnalo' }, { en: 'a measuring cylinder', hr: 'menzura' }, { en: 'a balance', hr: 'vaga' }, { en: 'a thermometer', hr: 'termometar' }], answer: 2,
        explain: { en: 'A balance (scale) measures mass. A ruler measures length, a measuring cylinder volume and a thermometer temperature.', hr: 'Vagom mjerimo masu. Ravnalom mjerimo duljinu, menzurom obujam, a termometrom temperaturu.' } },
      { type: 'tf', q: { en: 'To read a measuring cylinder correctly, your eye should be level with the water surface.', hr: 'Pri očitavanju menzure oko mora biti u visini površine vode.' }, answer: true,
        explain: { en: 'Looking from above or below makes the reading too large or too small. Read at the bottom of the curved surface, at eye level.', hr: 'Gledanje odozgo ili odozdo daje preveliko ili premalo očitanje. Očitavaj na dnu zakrivljene površine, s okom u istoj visini.' } },
      { type: 'mc', q: { en: 'Which prefix means one thousandth?', hr: 'Koji predmetak znači jednu tisućinku?' },
        options: [{ en: 'milli (m)', hr: 'mili (m)' }, { en: 'kilo (k)', hr: 'kilo (k)' }, { en: 'centi (c)', hr: 'centi (c)' }, { en: 'deci (d)', hr: 'deci (d)' }], answer: 0,
        explain: { en: 'milli = 1/1000 (1 mm = 0.001 m). kilo = 1000, centi = 1/100, deci = 1/10.', hr: 'mili = 1/1000 (1 mm = 0,001 m). kilo = 1000, centi = 1/100, deci = 1/10.' } },
      { type: 'mc', q: { en: 'The water in a measuring cylinder rises from 120 mL to 150 mL when a key is lowered in. What is the volume of the key?', hr: 'Voda se u menzuri podigne sa 120 mL na 150 mL kad u nju spustimo ključ. Koliki je obujam ključa?' },
        options: [{ en: '30 cm³', hr: '30 cm³' }, { en: '120 cm³', hr: '120 cm³' }, { en: '150 cm³', hr: '150 cm³' }, { en: '270 cm³', hr: '270 cm³' }], answer: 0,
        explain: { en: 'The key pushed aside 150 mL − 120 mL = 30 mL of water, and 30 mL = 30 cm³.', hr: 'Ključ je istisnuo 150 mL − 120 mL = 30 mL vode, a 30 mL = 30 cm³.' } },
      { type: 'num', q: { en: 'A box is 10 cm long, 5 cm wide and 4 cm high. What is its volume?', hr: 'Kutija je duga 10 cm, široka 5 cm i visoka 4 cm. Koliki je njezin obujam?' },
        answer: 200, tolerance: 0.5, unit: 'cm³',
        explain: { en: 'V = a · b · c = 10 cm × 5 cm × 4 cm = 200 cm³. That is 200 mL, a small glass of juice.', hr: 'V = a · b · c = 10 cm × 5 cm × 4 cm = 200 cm³. To je 200 mL, mala čaša soka.' } },
      { type: 'mc', q: { en: 'Which length is the greatest?', hr: 'Koja je duljina najveća?' },
        options: [{ en: '45 cm', hr: '45 cm' }, { en: '0.5 m', hr: '0,5 m' }, { en: '0.0004 km', hr: '0,0004 km' }, { en: '520 mm', hr: '520 mm' }], answer: 3,
        explain: { en: 'Convert everything to metres: 45 cm = 0.45 m, 0.5 m, 0.0004 km = 0.4 m, 520 mm = 0.52 m. The greatest is 520 mm.', hr: 'Pretvori sve u metre: 45 cm = 0,45 m, 0,5 m, 0,0004 km = 0,4 m, 520 mm = 0,52 m. Najveća je 520 mm.' } }
    ]
  });
})();
