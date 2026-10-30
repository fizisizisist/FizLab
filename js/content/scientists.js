/* FizLab — scientists and inventors / znanstvenici i izumitelji (see _extras_schema.md) */
(function () {
  'use strict';
  window.Content.registerScientists([
    {
      id: 'archimedes', name: 'Archimedes', born: -287, died: -212,
      country: { en: 'Syracuse, Sicily (ancient Greece)', hr: 'Sirakuza, Sicilija (antička Grčka)' },
      field: { en: 'Buoyancy, levers and geometry', hr: 'Uzgon, poluge i geometrija' },
      topics: ['density', 'levers', 'pressure'],
      known: { en: 'Archimedes\' principle of buoyancy and the law of the lever.', hr: 'Arhimedov zakon o uzgonu i zakon poluge.' },
      bio: {
        en: 'Archimedes lived in Syracuse, a Greek city on the island of Sicily. He worked out why things float: a body in water is pushed up by a force equal to the weight of the water it pushes aside. This is still called Archimedes\' principle, and it is the reason a steel ship floats while a steel nail sinks. He also explained the lever and reportedly said that with a long enough lever he could move the Earth. He designed war machines and a water-lifting screw that is still used today, and he calculated the volume of a sphere. He was killed when Roman soldiers captured Syracuse.',
        hr: 'Arhimed je živio u Sirakuzi, grčkom gradu na otoku Siciliji. Objasnio je zašto tijela plutaju: na tijelo u vodi djeluje uzgon, sila prema gore jednaka težini vode koju tijelo istisne. To i danas zovemo Arhimedov zakon i zato čelični brod pluta, a čelični čavao tone. Objasnio je i polugu te je, kažu, rekao da bi dovoljno dugom polugom pomaknuo Zemlju. Konstruirao je ratne strojeve i vijak za podizanje vode koji se koristi i danas te je izračunao obujam kugle. Poginuo je kad su rimski vojnici osvojili Sirakuzu.'
      },
      fact: {
        en: 'Without decimal numbers or a calculator, Archimedes showed that pi lies between 3 10/71 and 3 1/7, that is between 3.1408 and 3.1429.',
        hr: 'Bez decimalnih brojeva i bez kalkulatora Arhimed je pokazao da je broj pi između 3 10/71 i 3 1/7, dakle između 3,1408 i 3,1429.'
      },
      croatia: false
    },
    {
      id: 'galileo', name: 'Galileo Galilei', born: 1564, died: 1642,
      country: { en: 'Italy', hr: 'Italija' },
      field: { en: 'Motion, free fall and astronomy', hr: 'Gibanje, slobodni pad i astronomija' },
      topics: ['motion', 'gravity', 'space'],
      known: { en: 'Experiments on falling bodies and the first telescope observations of the sky.', hr: 'Pokusi o padanju tijela i prva promatranja neba teleskopom.' },
      bio: {
        en: 'Galileo was born in Pisa, Italy. He tested ideas with experiments instead of trusting old books. Rolling balls down gentle slopes, he found that falling objects gain speed at a steady rate and that, without air, light and heavy objects fall together. He noticed that a swinging lamp takes the same time for a long swing as for a short one. In 1609 he built a telescope and saw mountains on the Moon, four moons circling Jupiter and the phases of Venus. Because he defended the idea that Earth moves around the Sun, the Church put him on trial in 1633 and he spent his last years under house arrest.',
        hr: 'Galileo Galilei rođen je u Pisi u Italiji. Umjesto da samo vjeruje starim knjigama, ideje je provjeravao pokusima. Puštajući kuglice niz blage kosine otkrio je da tijela pri padu jednoliko ubrzavaju i da bez zraka lagana i teška tijela padaju jednako. Zapazio je da njihalu za dugi i kratki zamah treba jednako vremena. Godine 1609. izradio je teleskop i vidio planine na Mjesecu, četiri mjeseca koji kruže oko Jupitera i mijene Venere. Zato što je branio ideju da se Zemlja giba oko Sunca, Crkva mu je 1633. sudila, pa je posljednje godine proveo u kućnom zatvoru.'
      },
      fact: {
        en: 'Three of Galileo\'s fingers and one tooth were removed from his body in 1737 and are kept today in the Galileo Museum in Florence.',
        hr: 'Tri Galileova prsta i jedan zub uzeti su s njegova tijela 1737. godine i danas se čuvaju u Muzeju Galileo u Firenci.'
      },
      croatia: false
    },
    {
      id: 'torricelli', name: 'Evangelista Torricelli', born: 1608, died: 1647,
      country: { en: 'Italy', hr: 'Italija' },
      field: { en: 'Air pressure and vacuum', hr: 'Tlak zraka i vakuum' },
      topics: ['pressure', 'density'],
      known: { en: 'The mercury barometer and the discovery of atmospheric pressure.', hr: 'Živin barometar i otkriće atmosferskog tlaka.' },
      bio: {
        en: 'Torricelli was an Italian mathematician who worked with Galileo in his last months and then took over his post in Florence. In 1643 he did a famous experiment: he filled a glass tube about a metre long with mercury and turned it upside down into a dish of mercury. The mercury dropped until the column was about 76 cm tall, leaving an empty space above it, the first vacuum ever made on purpose. Torricelli explained that the weight of the air pressing on the dish holds the column up. We live, he wrote, at the bottom of an ocean of air. His tube was the first barometer.',
        hr: 'Torricelli je bio talijanski matematičar koji je radio s Galileom u posljednjim mjesecima Galileova života, a zatim preuzeo njegovo mjesto u Firenci. Godine 1643. izveo je slavan pokus: staklenu cijev dugu oko metar napunio je živom, zatvorio prstom, okrenuo naopako u posudu sa živom i pustio. Živa se spustila dok stupac nije bio visok oko 76 cm, a iznad njega ostao je prazan prostor, prvi namjerno napravljeni vakuum. Torricelli je objasnio da stupac drži težina zraka koja tlači na posudu. Živimo, napisao je, na dnu oceana zraka. Njegova cijev bila je prvi barometar.'
      },
      fact: {
        en: 'Had Torricelli used water instead of mercury, which is 13.6 times denser than water, his tube would have had to be more than 10 metres tall.',
        hr: 'Da je Torricelli umjesto žive, koja je 13,6 puta gušća od vode, upotrijebio vodu, cijev bi morala biti viša od 10 metara.'
      },
      croatia: false
    },
    {
      id: 'pascal', name: 'Blaise Pascal', born: 1623, died: 1662,
      country: { en: 'France', hr: 'Francuska' },
      field: { en: 'Pressure in liquids and gases', hr: 'Tlak u tekućinama i plinovima' },
      topics: ['pressure'],
      known: { en: 'Pascal\'s law of pressure in liquids; the unit of pressure bears his name.', hr: 'Pascalov zakon o tlaku u tekućinama; jedinica za tlak nosi njegovo ime.' },
      bio: {
        en: 'Pascal was a French mathematician and physicist who was famous as a child prodigy. At 19 he designed a mechanical calculating machine to help his father, a tax official, with long sums. Pascal studied pressure in liquids and gases. He found that pressure applied to an enclosed liquid is passed on undiminished to every part of it, which we now call Pascal\'s law; it is why a hydraulic jack can lift a car. In 1648 he had his brother-in-law carry a barometer up the Puy de Dôme mountain and showed that air pressure drops with height. The unit of pressure, the pascal, is named after him.',
        hr: 'Pascal je bio francuski matematičar i fizičar, poznat kao čudo od djeteta. S 19 godina konstruirao je mehanički stroj za računanje da pomogne ocu, poreznom službeniku, s dugim zbrajanjima. Proučavao je tlak u tekućinama i plinovima. Otkrio je da se tlak koji djeluje na zatvorenu tekućinu neumanjen prenosi na sve njezine dijelove, što danas zovemo Pascalov zakon; zato hidraulička dizalica može podići automobil. Godine 1648. zamolio je šogora da odnese barometar na planinu Puy de Dôme i tako pokazao da tlak zraka s visinom opada. Jedinica za tlak, paskal, nazvana je po njemu.'
      },
      fact: {
        en: 'Pascal\'s calculating machine, the Pascaline, added and subtracted with little wheels; about 20 were built and nine of them still exist in museums.',
        hr: 'Pascalov stroj za računanje, pascalina, zbrajao je i oduzimao pomoću kotačića; napravljeno ih je oko 20, a devet ih još postoji u muzejima.'
      },
      croatia: false
    },
    {
      id: 'newton', name: 'Isaac Newton', born: 1643, died: 1727,
      country: { en: 'England', hr: 'Engleska' },
      field: { en: 'Motion, gravity and light', hr: 'Gibanje, gravitacija i svjetlost' },
      topics: ['forces', 'gravity', 'light', 'motion', 'space'],
      known: { en: 'The three laws of motion and the law of gravity.', hr: 'Tri zakona gibanja i zakon gravitacije.' },
      bio: {
        en: 'Newton was born on a farm in Woolsthorpe, England, and studied at Cambridge. When the plague closed the university in 1665, he went home and did some of his best thinking there. He showed with a prism that white sunlight is a mixture of all colours and built a telescope that used a mirror instead of a lens. In 1687 he published the Principia, with his three laws of motion and the law of gravity: the same force that makes an apple fall keeps the Moon circling the Earth. He also invented calculus, a new kind of mathematics. The unit of force, the newton, is named after him.',
        hr: 'Newton je rođen na farmi u Woolsthorpeu u Engleskoj i studirao je u Cambridgeu. Kad je kuga 1665. zatvorila sveučilište, otišao je kući i ondje smislio neke od svojih najboljih ideja. Prizmom je pokazao da je bijela sunčeva svjetlost mješavina svih boja i napravio je teleskop sa zrcalom umjesto leće. Godine 1687. objavio je knjigu Principia s tri zakona gibanja i zakonom gravitacije: ista sila zbog koje jabuka pada drži Mjesec u kruženju oko Zemlje. Izumio je i infinitezimalni račun, novu vrstu matematike. Jedinica za silu, njutn, nazvana je po njemu.'
      },
      fact: {
        en: 'For the last 30 years of his life Newton ran the Royal Mint in London and personally tracked down counterfeiters of coins.',
        hr: 'Posljednjih 30 godina života Newton je vodio Kraljevsku kovnicu novca u Londonu i osobno lovio krivotvoritelje kovanica.'
      },
      croatia: false
    },
    {
      id: 'celsius', name: 'Anders Celsius', born: 1701, died: 1744,
      country: { en: 'Sweden', hr: 'Švedska' },
      field: { en: 'Temperature and astronomy', hr: 'Temperatura i astronomija' },
      topics: ['heat', 'magnetism'],
      known: { en: 'The Celsius temperature scale.', hr: 'Celzijeva temperaturna ljestvica.' },
      bio: {
        en: 'Celsius was a Swedish astronomer from Uppsala, where he became professor of astronomy and founded the observatory. He took part in an expedition to Lapland that measured the shape of the Earth and confirmed that it is slightly flattened at the poles. With a colleague he noticed that a compass needle twitches during the northern lights, an early clue that auroras are linked to magnetism. In 1742 he proposed a temperature scale with two fixed points, the freezing and boiling points of water, divided into 100 degrees, so that thermometers everywhere could agree. He died of tuberculosis at only 42.',
        hr: 'Celsius je bio švedski astronom iz Uppsale, gdje je postao profesor astronomije i osnovao zvjezdarnicu. Sudjelovao je u ekspediciji u Laponiju koja je mjerila oblik Zemlje i potvrdila da je Zemlja na polovima malo spljoštena. S kolegom je zapazio da igla kompasa titra za vrijeme polarne svjetlosti, što je bio rani znak da je polarna svjetlost povezana s magnetizmom. Godine 1742. predložio je temperaturnu ljestvicu s dvije stalne točke, ledištem i vrelištem vode, podijeljenu na 100 stupnjeva, kako bi se termometri svugdje slagali. Umro je od tuberkuloze sa samo 42 godine.'
      },
      fact: {
        en: 'The original Celsius scale was upside down: 0° was boiling water and 100° was freezing water; it was flipped only after his death.',
        hr: 'Izvorna Celsiusova ljestvica bila je naopaka: 0° je bilo vrelište vode, a 100° ledište; okrenuta je tek nakon njegove smrti.'
      },
      croatia: false
    },
    {
      id: 'franklin', name: 'Benjamin Franklin', born: 1706, died: 1790,
      country: { en: 'USA', hr: 'SAD' },
      field: { en: 'Electricity', hr: 'Elektricitet' },
      topics: ['electricity'],
      known: { en: 'Showed that lightning is electricity and invented the lightning rod.', hr: 'Pokazao da je munja elektricitet i izumio gromobran.' },
      bio: {
        en: 'Franklin was born in Boston and became a printer, writer and one of the founders of the United States. In the 1740s he became fascinated by electricity. He suggested that there is only one kind of electricity, which objects can have too much or too little of, and named the two cases positive and negative. He proposed that lightning is a giant electric spark, and in 1752 he and his son flew a kite in a thunderstorm; the wet string carried charge down to a key. From this came the lightning rod, a metal spike that leads lightning safely into the ground. He also invented bifocal glasses.',
        hr: 'Franklin je rođen u Bostonu i postao je tiskar, pisac i jedan od utemeljitelja Sjedinjenih Američkih Država. Četrdesetih godina 18. stoljeća zanio se elektricitetom. Predložio je da postoji samo jedna vrsta elektriciteta kojeg tijela mogu imati previše ili premalo i ta dva slučaja nazvao je pozitivnim i negativnim. Tvrdio je da je munja golema električna iskra i 1752. je sa sinom pustio zmaja za vrijeme oluje; mokra uzica prenijela je naboj do ključa. Iz toga je nastao gromobran, metalni šiljak koji munju sigurno odvodi u tlo i još danas štiti zgrade. Izumio je i bifokalne naočale.'
      },
      fact: {
        en: 'Franklin never patented any of his inventions, and many electrical words we still use, such as positive, negative, charge and battery, come from him.',
        hr: 'Franklin nikad nije patentirao nijedan svoj izum, a mnoge električne riječi koje još koristimo, poput pozitivno, negativno, naboj i baterija, potječu od njega.'
      },
      croatia: false
    },
    {
      id: 'volta', name: 'Alessandro Volta', born: 1745, died: 1827,
      country: { en: 'Italy', hr: 'Italija' },
      field: { en: 'Electricity', hr: 'Elektricitet' },
      topics: ['electricity'],
      known: { en: 'The voltaic pile, the first electric battery (1800).', hr: 'Voltin stup, prva električna baterija (1800.).' },
      bio: {
        en: 'Volta was born in Como, in northern Italy, and taught physics at the University of Pavia. His countryman Luigi Galvani had made frog legs twitch with two different metals and believed the electricity came from the animal. Volta disagreed: he showed that the two metals, with a moist material between them, produce the electricity themselves. In 1800 he stacked discs of zinc and copper separated by cardboard soaked in salt water. This voltaic pile was the first battery, the first device to give a steady electric current, and it opened the way for all later electrical science. Napoleon made him a count. The volt is named after him.',
        hr: 'Volta je rođen u Comu u sjevernoj Italiji i predavao je fiziku na Sveučilištu u Paviji. Njegov zemljak Luigi Galvani pomoću dvaju različitih metala izazvao je trzanje žabljih krakova i vjerovao je da elektricitet dolazi iz životinje. Volta se nije složio: pokazao je da elektricitet stvaraju sama dva metala s vlažnom tvari između njih. Godine 1800. naslagao je pločice cinka i bakra odvojene kartonom namočenim u slanu vodu. Taj Voltin stup bio je prva baterija, prva naprava koja daje stalnu električnu struju, i otvorio je put svoj kasnijoj znanosti o elektricitetu. Napoleon ga je proglasio grofom. Volt je nazvan po njemu.'
      },
      fact: {
        en: 'Volta also discovered methane: in 1776 he collected the gas bubbling up from a marsh by Lake Maggiore and showed that it burns.',
        hr: 'Volta je otkrio i metan: 1776. skupio je plin koji se u mjehurićima dizao iz močvare uz jezero Maggiore i pokazao da gori.'
      },
      croatia: false
    },
    {
      id: 'oersted', name: 'Hans Christian Ørsted', born: 1777, died: 1851,
      country: { en: 'Denmark', hr: 'Danska' },
      field: { en: 'Electromagnetism', hr: 'Elektromagnetizam' },
      topics: ['magnetism', 'electricity'],
      known: { en: 'Discovered that an electric current deflects a compass needle (1820).', hr: 'Otkrio da električna struja zakreće iglu kompasa (1820.).' },
      bio: {
        en: 'Ørsted was a Danish physicist and chemist who taught at the University of Copenhagen. For years people had wondered whether electricity and magnetism were related. In 1820, while preparing a lecture, Ørsted switched on a current in a wire lying near a compass and saw the needle swing to the side. An electric current creates a magnetic field around it. The news spread across Europe within months and led to electromagnets, electric motors and generators. Ørsted was also the first to produce the metal aluminium. He wrote poetry, helped found Denmark\'s technical university and was a close friend of the storyteller Hans Christian Andersen.',
        hr: 'Ørsted je bio danski fizičar i kemičar koji je predavao na Sveučilištu u Kopenhagenu. Ljudi su se godinama pitali jesu li elektricitet i magnetizam povezani. Godine 1820., pripremajući predavanje, Ørsted je pustio struju kroz žicu položenu blizu kompasa i vidio da je igla skrenula u stranu. Električna struja oko sebe stvara magnetsko polje. Vijest se u nekoliko mjeseci proširila Europom i dovela do elektromagneta, elektromotora i generatora. Ørsted je bio i prvi koji je proizveo metal aluminij. Pisao je pjesme, pomogao je osnovati dansko tehničko sveučilište i bio je blizak prijatelj pisca bajki Hansa Christiana Andersena.'
      },
      fact: {
        en: 'The Danish satellite launched in 1999 to map Earth\'s magnetic field was named Ørsted in his honour.',
        hr: 'Danski satelit lansiran 1999. za mjerenje Zemljina magnetskog polja nazvan je Ørsted u njegovu čast.'
      },
      croatia: false
    },
    {
      id: 'ohm', name: 'Georg Simon Ohm', born: 1789, died: 1854,
      country: { en: 'Germany', hr: 'Njemačka' },
      field: { en: 'Electric current', hr: 'Električna struja' },
      topics: ['electricity'],
      known: { en: 'Ohm\'s law: current equals voltage divided by resistance.', hr: 'Ohmov zakon: jakost struje jednaka je naponu podijeljenom otporom.' },
      bio: {
        en: 'Ohm grew up in Erlangen, Germany; his father, a locksmith, taught him mathematics at home. He worked for years as a school teacher and experimented with wires and batteries in his spare time. He measured how much current flowed through wires of different lengths, thicknesses and materials. In 1827 he published his result, now Ohm\'s law: the current in a wire is proportional to the voltage and inversely proportional to the resistance, I = U / R. Longer and thinner wires have more resistance. His work was ignored at first, but he finally became a university professor in Munich. The unit of resistance, the ohm, bears his name.',
        hr: 'Ohm je odrastao u Erlangenu u Njemačkoj; otac bravar kod kuće ga je učio matematiku. Ohm je godinama radio kao gimnazijski profesor i u slobodno vrijeme izvodio pokuse sa žicama i baterijama. Mjerio je koliko struje teče kroz žice različite duljine, debljine i materijala. Godine 1827. objavio je rezultat koji danas zovemo Ohmov zakon: jakost struje u vodiču razmjerna je naponu, a obrnuto razmjerna otporu, I = U / R. Dulje i tanje žice imaju veći otpor. U Njemačkoj je njegov rad najprije bio zanemaren, no britanski znanstvenici su ga odlikovali, a na kraju je postao sveučilišni profesor u Münchenu. Jedinica za otpor, om, nosi njegovo ime.'
      },
      fact: {
        en: 'Ohm\'s law was ignored in Germany for years; the Royal Society in London gave him its Copley Medal in 1841, and he became a full professor only at the age of 63.',
        hr: 'Ohmov zakon u Njemačkoj je godinama bio zanemaren; Kraljevsko društvo u Londonu dodijelilo mu je Copleyjevu medalju 1841., a redoviti profesor postao je tek sa 63 godine.'
      },
      croatia: false
    },
    {
      id: 'faraday', name: 'Michael Faraday', born: 1791, died: 1867,
      country: { en: 'England', hr: 'Engleska' },
      field: { en: 'Electricity and magnetism', hr: 'Elektricitet i magnetizam' },
      topics: ['electricity', 'magnetism'],
      known: { en: 'Electromagnetic induction, the principle behind generators and transformers.', hr: 'Elektromagnetska indukcija, načelo na kojem rade generatori i transformatori.' },
      bio: {
        en: 'Faraday was the son of a London blacksmith and had almost no schooling. At 14 he became a bookbinder\'s apprentice and read the science books he was binding. After attending lectures by the chemist Humphry Davy, he became Davy\'s assistant at the Royal Institution and stayed there for the rest of his life. In 1821 he built the first simple electric motor. In 1831 he discovered electromagnetic induction: moving a magnet in and out of a coil of wire creates an electric current. Every power station generator and every transformer works on this principle. He also introduced the idea of field lines and started the Christmas Lectures for young people.',
        hr: 'Faraday je bio sin londonskog kovača i gotovo da nije išao u školu. S 14 godina postao je knjigoveški naučnik i čitao je znanstvene knjige koje je uvezivao. Nakon što je slušao predavanja kemičara Humphryja Davyja, postao je Davyjev pomoćnik u Kraljevskom institutu i ondje je ostao do kraja života. Godine 1821. napravio je prvi jednostavni elektromotor. Godine 1831. otkrio je elektromagnetsku indukciju: pomicanje magneta u zavojnicu i iz nje stvara električnu struju. Na tom načelu rade svi generatori u elektranama i svi transformatori. Uveo je i zamisao o silnicama polja te pokrenuo božićna predavanja za mlade.'
      },
      fact: {
        en: 'The Christmas Lectures for young people that Faraday started at the Royal Institution in 1825 are still held every year and are shown on television.',
        hr: 'Božićna predavanja za mlade koja je Faraday 1825. pokrenuo u Kraljevskom institutu održavaju se još svake godine i prenose se na televiziji.'
      },
      croatia: false
    },
    {
      id: 'joule', name: 'James Prescott Joule', born: 1818, died: 1889,
      country: { en: 'England', hr: 'Engleska' },
      field: { en: 'Energy and heat', hr: 'Energija i toplina' },
      topics: ['energy', 'heat', 'electricity'],
      known: { en: 'Showed that heat is a form of energy and measured how much work makes how much heat.', hr: 'Pokazao da je toplina oblik energije i izmjerio koliko rada daje koliko topline.' },
      bio: {
        en: 'Joule was the son of a wealthy brewer near Manchester, England, and was taught at home, partly by the chemist John Dalton. He never worked at a university; his laboratory was at the family brewery. He showed that an electric current heats a wire in proportion to the current squared and the resistance. Then he let falling weights turn a paddle wheel in water and measured how much the water warmed. The result showed that work and heat are both energy, and that a fixed amount of work always makes the same amount of heat. This became the law of conservation of energy. The joule is named after him.',
        hr: 'Joule je bio sin bogatog pivara blizu Manchestera u Engleskoj i školovao se kod kuće, dijelom kod kemičara Johna Daltona. Nikad nije radio na sveučilištu; pokuse je izvodio u laboratoriju u obiteljskoj pivovari. Joule je mjerio vrlo pažljivo. Pokazao je da električna struja zagrijava žicu ovisno o kvadratu jakosti struje i o otporu. Zatim je utezima koji padaju okretao lopatice u vodi i mjerio koliko se voda ugrijala. Rezultat je pokazao da su mehanički rad i toplina isto, energija, i da jednak rad uvijek daje jednaku toplinu. Iz toga je nastao zakon očuvanja energije. Džul je nazvan po njemu.'
      },
      fact: {
        en: 'According to Lord Kelvin, Joule spent part of his honeymoon in the Alps in 1847 with a long thermometer, trying to measure whether water at the bottom of a waterfall is warmer than at the top.',
        hr: 'Prema lordu Kelvinu, Joule je dio medenog mjeseca u Alpama 1847. proveo s dugim termometrom pokušavajući izmjeriti je li voda na dnu vodopada toplija nego na vrhu.'
      },
      croatia: false
    },
    {
      id: 'kelvin', name: 'Lord Kelvin (William Thomson)', born: 1824, died: 1907,
      country: { en: 'Scotland (born in Belfast)', hr: 'Škotska (rođen u Belfastu)' },
      field: { en: 'Heat and thermodynamics', hr: 'Toplina i termodinamika' },
      topics: ['heat', 'energy'],
      known: { en: 'The absolute (Kelvin) temperature scale starting at −273 °C.', hr: 'Apsolutna (Kelvinova) temperaturna ljestvica koja počinje na −273 °C.' },
      bio: {
        en: 'William Thomson was born in Belfast, grew up in Glasgow, Scotland, and entered the university there at the age of 10. At 22 he became professor of physics in Glasgow and kept the post for 53 years. In 1848 he proposed an absolute temperature scale that starts at the coldest possible temperature, absolute zero, about −273 °C. With Joule he helped build the science of heat and energy, thermodynamics. He also helped make the first telegraph cable across the Atlantic work and improved the ship\'s compass. He was knighted and later made Lord Kelvin. The kelvin, the unit of temperature, is named after him.',
        hr: 'William Thomson rođen je u Belfastu, a kao dječak preselio se u Glasgow u Škotskoj, gdje je sa 10 godina upisao sveučilište. S 22 godine postao je profesor fizike u Glasgowu i na tom je mjestu ostao 53 godine. Godine 1848. predložio je apsolutnu temperaturnu ljestvicu koja počinje na najnižoj mogućoj temperaturi, apsolutnoj nuli, oko −273 °C, gdje čestice imaju najmanju moguću energiju. S Jouleom je pomogao izgraditi znanost o toplini i energiji, termodinamiku. Zaslužan je i za rad prvog telegrafskog kabela preko Atlantika te je poboljšao brodski kompas. Dobio je plemićki naslov i postao lord Kelvin. Kelvin, SI jedinica temperature, nazvan je po njemu.'
      },
      fact: {
        en: 'His title comes from the River Kelvin, which flows past the University of Glasgow, and he is buried in Westminster Abbey next to Isaac Newton.',
        hr: 'Njegov naslov potječe od rijeke Kelvin koja teče pokraj Sveučilišta u Glasgowu, a pokopan je u Westminsterskoj opatiji pokraj Isaaca Newtona.'
      },
      croatia: false
    },
    {
      id: 'hertz', name: 'Heinrich Hertz', born: 1857, died: 1894,
      country: { en: 'Germany', hr: 'Njemačka' },
      field: { en: 'Electromagnetic waves', hr: 'Elektromagnetski valovi' },
      topics: ['waves', 'light', 'electricity'],
      known: { en: 'First to produce and detect radio waves (1886–1888).', hr: 'Prvi proizveo i otkrio radiovalove (1886.–1888.).' },
      bio: {
        en: 'Hertz was born in Hamburg, Germany, and studied physics in Berlin under Hermann von Helmholtz. As a young professor in Karlsruhe, between 1886 and 1888, he made sparks jump across a gap and found that a loop of wire across the room produced tiny sparks too, with nothing connecting them. Invisible electromagnetic waves were crossing the room, exactly as James Clerk Maxwell had predicted on paper. Hertz showed that these waves travel at the speed of light and can be reflected, focused and refracted like light. Today we call them radio waves. He died at only 36. The unit of frequency, the hertz, is named after him.',
        hr: 'Hertz je rođen u Hamburgu u Njemačkoj i studirao je fiziku u Berlinu kod Hermanna von Helmholtza. Kao mladi profesor u Karlsruheu, između 1886. i 1888., napravio je napravu u kojoj su iskre skakale preko zazora i otkrio da i druga petlja od žice na drugom kraju sobe daje sitne iskre, iako ih nije spajala nikakva žica. Sobom su putovali nevidljivi elektromagnetski valovi, točno kako je James Clerk Maxwell predvidio na papiru. Hertz je pokazao da ti valovi putuju brzinom svjetlosti i da se, kao svjetlost, odbijaju, lome i mogu usmjeriti. Danas ih zovemo radiovalovi. Umro je sa samo 36 godina. Jedinica za frekvenciju, herc, nazvana je po njemu.'
      },
      fact: {
        en: 'Asked what use his waves had, Hertz reportedly answered that they had none; within ten years of his death Marconi used them to send a signal across the Atlantic.',
        hr: 'Na pitanje čemu služe njegovi valovi Hertz je navodno odgovorio da ne služe ničemu; nepunih deset godina nakon njegove smrti Marconi je njima poslao signal preko Atlantika.'
      },
      croatia: false
    },
    {
      id: 'curie', name: 'Marie Curie', born: 1867, died: 1934,
      country: { en: 'Poland and France', hr: 'Poljska i Francuska' },
      field: { en: 'Radioactivity', hr: 'Radioaktivnost' },
      topics: ['matter', 'energy'],
      known: { en: 'Discovered polonium and radium and coined the word radioactivity.', hr: 'Otkrila polonij i radij te skovala riječ radioaktivnost.' },
      bio: {
        en: 'Maria Skłodowska grew up in Warsaw, Poland, where women were not allowed to attend university. She worked as a governess to save money, then in 1891 moved to Paris to study physics at the Sorbonne. She married the physicist Pierre Curie. Studying the rays given off by uranium, she found that the mineral pitchblende was far more active than its uranium could explain, and in 1898 she and Pierre discovered two new elements, polonium and radium. She invented the word radioactivity. She won the Nobel Prize in Physics in 1903 and in Chemistry in 1911, the first person to win two.',
        hr: 'Maria Skłodowska odrasla je u Varšavi u Poljskoj, gdje žene nisu smjele studirati. Radila je kao guvernanta da uštedi novac, a 1891. preselila se u Pariz i studirala fiziku na Sorboni. Udala se za fizičara Pierrea Curiea. Istražujući tajanstvene zrake koje zrači uran otkrila je da je mineral uraninit mnogo aktivniji nego što bi njegov uran mogao objasniti, pa su ona i Pierre 1898. otkrili dva nova elementa, polonij i radij. Izmislila je riječ radioaktivnost. Dobila je Nobelovu nagradu za fiziku 1903. i za kemiju 1911., kao prva osoba s dvije Nobelove nagrade.'
      },
      fact: {
        en: 'Her laboratory notebooks from the 1890s are still radioactive; they are kept in lead-lined boxes in Paris and may be read only in protective clothing.',
        hr: 'Njezine laboratorijske bilježnice iz 1890-ih još su radioaktivne; čuvaju se u olovom obloženim kutijama u Parizu i smiju se čitati samo u zaštitnoj odjeći.'
      },
      croatia: false
    },
    {
      id: 'einstein', name: 'Albert Einstein', born: 1879, died: 1955,
      country: { en: 'Germany, Switzerland and USA', hr: 'Njemačka, Švicarska i SAD' },
      field: { en: 'Relativity, light and gravity', hr: 'Relativnost, svjetlost i gravitacija' },
      topics: ['light', 'gravity', 'energy', 'space', 'motion'],
      known: { en: 'The theory of relativity and E = mc².', hr: 'Teorija relativnosti i E = mc².' },
      bio: {
        en: 'Einstein was born in Ulm, Germany. After university he worked at the patent office in Bern, Switzerland. There, in 1905, he published papers that changed physics: he explained that light comes in packets of energy, showed that atoms exist, and set out the special theory of relativity: the speed of light is the same for everyone, and time and length depend on motion. From it came E = mc²: mass is a form of energy. In 1915 he described gravity as the curving of space and time. He won the Nobel Prize in 1921 and in 1933 left Germany for the USA.',
        hr: 'Einstein je rođen u Ulmu u Njemačkoj. Nakon studija radio je u patentnom uredu u Bernu u Švicarskoj. Ondje je 1905. objavio radove koji su promijenili fiziku: objasnio je da svjetlost dolazi u paketićima energije, pokazao je da atomi postoje i postavio je specijalnu teoriju relativnosti, po kojoj je brzina svjetlosti jednaka za sve, a vrijeme i duljina ovise o gibanju. Iz nje je proizašlo E = mc²: masa je oblik energije. Godine 1915. opisao je gravitaciju kao zakrivljenost prostora i vremena. Nobelovu nagradu dobio je 1921., a 1933. napustio je Njemačku i preselio se u SAD.'
      },
      fact: {
        en: 'GPS satellites must correct their clocks for Einstein\'s relativity by about 38 microseconds a day; without this, positions would drift by around 10 km every day.',
        hr: 'Sateliti GPS-a moraju zbog Einsteinove relativnosti ispravljati svoje satove za oko 38 mikrosekundi na dan; bez toga bi položaji svaki dan odstupali za oko 10 km.'
      },
      croatia: false
    },
    {
      id: 'boskovic', name: 'Ruđer Bošković', born: 1711, died: 1787,
      country: { en: 'Republic of Dubrovnik (today Croatia)', hr: 'Dubrovačka Republika (danas Hrvatska)' },
      field: { en: 'Astronomy, optics and the theory of forces', hr: 'Astronomija, optika i teorija sila' },
      topics: ['forces', 'matter', 'space', 'light', 'gravity'],
      known: { en: 'A theory of forces between particles and a method to find an orbit from three observations.', hr: 'Teorija sila među česticama i metoda za određivanje putanje iz tri promatranja.' },
      bio: {
        en: 'Ruđer Bošković was born in Dubrovnik, then an independent republic. At 14 he went to Rome to study with the Jesuits and became a priest, a professor and a leading scientist of his century. In 1758 he published a theory in which all matter is made of point-like particles that attract each other at some distances and repel at others, an idea that pointed towards modern atomic physics. He found a way to calculate the orbit of a comet or planet from only three observations and founded the observatory in Milan. He was a member of the Royal Society in London and worked on optics for the French navy.',
        hr: 'Ruđer Bošković rođen je u Dubrovniku, tada samostalnoj republici. S 14 godina otišao je u Rim učiti kod isusovaca te je postao svećenik, profesor i jedan od vodećih znanstvenika svog stoljeća. Godine 1758. objavio je teoriju po kojoj je sva tvar građena od sitnih točkastih čestica koje se na nekim udaljenostima privlače, a na drugima odbijaju, zamisao koja je najavila modernu atomsku fiziku. Pronašao je način da se putanja kometa ili planeta izračuna iz samo tri promatranja i osnovao je zvjezdarnicu u Milanu. Bio je član Kraljevskog društva u Londonu i radio je na optici za francusku mornaricu.'
      },
      fact: {
        en: 'In 1742 the Pope asked Bošković and two colleagues to examine dangerous cracks in the dome of St Peter\'s Basilica in Rome; on their advice iron rings were fitted around the dome, and it still stands.',
        hr: 'Godine 1742. papa je zamolio Boškovića i dvojicu kolega da pregledaju opasne pukotine na kupoli bazilike svetog Petra u Rimu; po njihovu savjetu oko kupole su postavljeni željezni obruči i kupola stoji i danas.'
      },
      croatia: true
    },
    {
      id: 'tesla', name: 'Nikola Tesla', born: 1856, died: 1943,
      country: { en: 'Croatia (Smiljan, Lika) and USA', hr: 'Hrvatska (Smiljan, Lika) i SAD' },
      field: { en: 'Electricity and magnetism', hr: 'Elektricitet i magnetizam' },
      topics: ['electricity', 'magnetism', 'energy', 'waves'],
      known: { en: 'The alternating current motor and the AC power system used worldwide.', hr: 'Motor na izmjeničnu struju i sustav izmjenične struje koji se koristi u cijelom svijetu.' },
      bio: {
        en: 'Nikola Tesla was born in the village of Smiljan in Lika, in today\'s Croatia, the son of a Serbian Orthodox priest. He went to school in Gospić and Karlovac and studied engineering in Graz. In 1884 he arrived in America with almost no money. There he invented the induction motor and a complete system for producing and sending alternating current, the electricity that comes out of every wall socket today. His system lit the Chicago World\'s Fair in 1893 and powered the first big hydroelectric plant at Niagara Falls. He also invented the Tesla coil, which makes spectacular high-voltage sparks, and experimented with radio and wireless power.',
        hr: 'Nikola Tesla rođen je u selu Smiljan u Lici, u današnjoj Hrvatskoj, kao sin srpskog pravoslavnog svećenika. Školovao se u Gospiću i Karlovcu, a tehniku je studirao u Grazu. Godine 1884. stigao je u Ameriku gotovo bez novca. Ondje je izumio indukcijski motor i cijeli sustav za proizvodnju i prijenos izmjenične struje, one koja danas izlazi iz svake utičnice. Njegov je sustav 1893. osvijetlio Svjetsku izložbu u Chicagu i pokretao prvu veliku hidroelektranu na slapovima Niagare. Izumio je i Teslin transformator, koji stvara spektakularne iskre visokog napona, te je istraživao radio i bežični prijenos energije.'
      },
      fact: {
        en: 'The unit of magnetic field strength is the tesla; the 1.5 T magnet of a hospital MRI scanner is about 30 000 times stronger than Earth\'s magnetic field.',
        hr: 'Jedinica za jakost magnetskog polja je tesla; magnet bolničkog uređaja za magnetsku rezonanciju od 1,5 T oko 30 000 puta jači je od Zemljina magnetskog polja.'
      },
      croatia: true
    },
    {
      id: 'vrancic', name: 'Faust Vrančić', born: 1551, died: 1617,
      country: { en: 'Croatia (Šibenik)', hr: 'Hrvatska (Šibenik)' },
      field: { en: 'Inventions and machines', hr: 'Izumi i strojevi' },
      topics: ['gravity', 'forces', 'energy'],
      known: { en: 'The first detailed design of a parachute, Homo volans (about 1615).', hr: 'Prvi podrobni nacrt padobrana, Homo volans (oko 1615.).' },
      bio: {
        en: 'Faust Vrančić was born in Šibenik and studied in Padua. He served as secretary to Emperor Rudolf II in Prague, became a bishop, and in 1595 published a dictionary of five languages. His most famous work is Machinae Novae, from around 1615, with drawings of 56 machines: bridges hanging from iron chains, mills driven by wind, rivers and the tides, and the first detailed design of a parachute, called Homo volans, the flying man. A square cloth is stretched on a wooden frame and a person hangs below it on ropes. He died in Venice and, as he had wished, was buried on the island of Prvić near Šibenik.',
        hr: 'Faust Vrančić rođen je u Šibeniku i studirao je u Padovi. Bio je tajnik cara Rudolfa II. u Pragu, postao je biskup, a 1595. objavio je rječnik pet jezika. Njegovo najpoznatije djelo je Machinae Novae, tiskano u Veneciji oko 1615., s crtežima 56 strojeva: mostova ovješenih na željeznim lancima, mlinova koje pokreću vjetar, rijeke i morske mijene te prvog podrobnog nacrta padobrana nazvanog Homo volans, leteći čovjek. Četverokutno platno napeto je na drveni okvir, a čovjek visi pod njim na užetima. Umro je u Veneciji i, kako je želio, pokopan je na otoku Prviću kraj Šibenika.'
      },
      fact: {
        en: 'Vrančić\'s dictionary of 1595 listed about 5000 words in Latin, Italian, German, Croatian and Hungarian; it was one of the first printed dictionaries to include Croatian.',
        hr: 'Vrančićev rječnik iz 1595. donosi oko 5000 riječi na latinskom, talijanskom, njemačkom, hrvatskom i mađarskom; bio je jedan od prvih tiskanih rječnika s hrvatskim riječima.'
      },
      croatia: true
    },
    {
      id: 'mohorovicic', name: 'Andrija Mohorovičić', born: 1857, died: 1936,
      country: { en: 'Croatia', hr: 'Hrvatska' },
      field: { en: 'Seismology and meteorology', hr: 'Seizmologija i meteorologija' },
      topics: ['waves'],
      known: { en: 'Discovered the boundary between Earth\'s crust and mantle from earthquake waves (the Moho).', hr: 'Iz potresnih valova otkrio granicu između Zemljine kore i plašta (Moho).' },
      bio: {
        en: 'Andrija Mohorovičić was born in Volosko, near Opatija, the son of a shipwright. He studied mathematics and physics in Prague, taught in Zagreb, Osijek and the nautical school in Bakar, and in 1892 became head of the meteorological observatory in Zagreb. On 8 October 1909 a strong earthquake shook the Kupa valley south of Zagreb. Mohorovičić collected recordings from seismographs across Europe and noticed that each kind of earthquake wave arrived twice. He explained that some waves had travelled through a deeper, denser layer where they move faster. He had discovered the boundary between the crust and the mantle, now called the Mohorovičić discontinuity, or Moho.',
        hr: 'Andrija Mohorovičić rođen je u Voloskom kraj Opatije kao sin brodograditelja. Studirao je matematiku i fiziku u Pragu, predavao u Zagrebu, Osijeku i u pomorskoj školi u Bakru, a 1892. postao je voditelj meteorološkog opservatorija u Zagrebu, gdje je proučavao oblake, oluje i klimu. Dana 8. listopada 1909. jak potres pogodio je Pokuplje južno od Zagreba. Mohorovičić je skupio zapise seizmografa iz cijele Europe i zapazio da svaka vrsta potresnih valova stiže dvaput. Objasnio je da su neki valovi putovali kroz dublji, gušći sloj u kojem se gibaju brže. Otkrio je granicu između Zemljine kore i plašta, koja se danas zove Mohorovičićev diskontinuitet ili Moho.'
      },
      fact: {
        en: 'The Moho lies about 30 to 40 km under the continents but only around 7 km below the ocean floor, and a crater on the far side of the Moon is named Mohorovičić.',
        hr: 'Moho leži oko 30 do 40 km pod kontinentima, a samo oko 7 km pod oceanskim dnom, a po Mohorovičiću je nazvan i krater na strani Mjeseca koja se sa Zemlje ne vidi.'
      },
      croatia: true
    },
    {
      id: 'getaldic', name: 'Marin Getaldić', born: 1568, died: 1626,
      country: { en: 'Republic of Dubrovnik (today Croatia)', hr: 'Dubrovačka Republika (danas Hrvatska)' },
      field: { en: 'Optics and mathematics', hr: 'Optika i matematika' },
      topics: ['light', 'density'],
      known: { en: 'Experiments with a large parabolic mirror and precise measurements of density.', hr: 'Pokusi s velikim paraboličnim zrcalom i točna mjerenja gustoće.' },
      bio: {
        en: 'Marin Getaldić came from a noble family of Dubrovnik. As a young man he travelled across Europe, met Galileo in Padua and the mathematician François Viète in Paris, and became one of the best mathematicians of his time, among the first to solve geometry problems with algebra. He made a large parabolic mirror, about 66 cm across, and in a cave below the city walls of Dubrovnik he used it to focus sunlight and set things alight from a distance, which frightened his neighbours. In his book Promotus Archimedes (1603) he measured the densities of metals and liquids very accurately. He later served the Republic as a diplomat.',
        hr: 'Marin Getaldić potjecao je iz dubrovačke plemićke obitelji. Kao mladić proputovao je Europu, u Padovi je upoznao Galilea, a u Parizu matematičara Françoisa Viètea, te je postao jedan od najboljih matematičara svog doba, među prvima koji su geometrijske zadatke rješavali algebrom. Izradio je veliko parabolično zrcalo promjera oko 66 cm i u špilji pod dubrovačkim zidinama njime je skupljao sunčevu svjetlost te na daljinu palio predmete, što je plašilo susjede. U knjizi Promotus Archimedes (1603.) vrlo je točno izmjerio gustoće metala i tekućina. Kasnije je Republici služio kao diplomat.'
      },
      fact: {
        en: 'Getaldić\'s parabolic mirror survives in the National Maritime Museum in Greenwich, London, and the cave where he experimented is still called Betina špilja after his nickname Bete.',
        hr: 'Getaldićevo parabolično zrcalo sačuvano je u Nacionalnom pomorskom muzeju u Greenwichu u Londonu, a špilja u kojoj je izvodio pokuse još se zove Betina špilja po njegovu nadimku Bete.'
      },
      croatia: true
    }
  ]);
})();
