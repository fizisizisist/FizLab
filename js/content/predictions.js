/* FizLab — "Predict first" / "Prvo predvidi" prompts for the simulations (see _predictions_schema.md) */
(function () {
  'use strict';
  window.Content.registerPredictions({

    // ---------------------------------------------------------------- freefall
    freefall: [
      {
        q: { en: 'On Earth, with air resistance switched off, a steel ball and a feather are dropped together from 20 m. What happens?',
          hr: 'Na Zemlji, s isključenim otporom zraka, čelična kuglica i pero pušteni su istodobno s visine 20 m. Što će se dogoditi?' },
        options: [
          { en: 'The ball lands first because it is heavier', hr: 'Kuglica padne prva jer je teža' },
          { en: 'They land at the same moment', hr: 'Padnu u istom trenutku' },
          { en: 'The feather still drifts down slowly', hr: 'Pero i dalje polako lebdi prema dolje' }
        ],
        answer: 1,
        try: { en: 'Set "Planet" to "Earth" and "Second object" to "Feather", switch "Air resistance" off and press "Drop!". Compare the two landing times, then switch the air on and repeat.',
          hr: 'Postavi "Planet" na "Zemlja" i "Drugo tijelo" na "Pero", isključi "Otpor zraka" i pritisni "Pusti!". Usporedi vremena pada, zatim uključi zrak i ponovi.' },
        explain: { en: 'Without air, gravity gives every object the same acceleration, whatever its mass. In everyday life the feather is slow only because air resistance holds it back, not because it is light.',
          hr: 'Bez zraka sila teža svim tijelima daje isto ubrzanje, bez obzira na masu. U svakodnevnom životu pero pada sporo samo zato što ga koči otpor zraka, a ne zato što je lagano.' }
      },
      {
        q: { en: 'An astronaut on the Moon lets go of a steel ball 20 m above the ground. What does the ball do?',
          hr: 'Astronaut na Mjesecu ispusti čeličnu kuglicu s visine 20 m. Što će kuglica učiniti?' },
        options: [
          { en: 'It floats where it is, because there is no gravity on the Moon', hr: 'Lebdi na mjestu jer na Mjesecu nema gravitacije' },
          { en: 'It falls exactly as fast as on Earth, because there is no air', hr: 'Pada jednako brzo kao na Zemlji jer nema zraka' },
          { en: 'It falls, but takes longer than on Earth', hr: 'Pada, ali joj treba više vremena nego na Zemlji' }
        ],
        answer: 2,
        try: { en: 'Drop the ball on "Earth" and note the landing time. Then set "Planet" to "Moon (no air)" and press "Drop!" again. Compare the times and the speed graphs.',
          hr: 'Pusti kuglicu na planetu "Zemlja" i zapiši vrijeme pada. Zatim postavi "Planet" na "Mjesec (bez zraka)" i opet pritisni "Pusti!". Usporedi vremena i grafove brzine.' },
        explain: { en: 'The Moon has gravity too, only about six times weaker (g = 1.62 m/s²). The ball speeds up more slowly, so the same fall takes about 5 s instead of 2 s.',
          hr: 'I Mjesec ima gravitaciju, samo oko šest puta slabiju (g = 1,62 m/s²). Kuglica sporije ubrzava pa isti pad traje oko 5 s umjesto 2 s.' }
      }
    ],

    // ---------------------------------------------------------------- motion
    motion: [
      {
        q: { en: 'The car drives at 10 m/s and the cyclist rides at 5 m/s. Whose line on the distance–time graph will be steeper?',
          hr: 'Automobil vozi brzinom 10 m/s, a biciklist 5 m/s. Čija će crta na grafu puta i vremena biti strmija?' },
        options: [
          { en: 'The line of the car', hr: 'Crta automobila' },
          { en: 'The line of the cyclist, because he rides for a longer time', hr: 'Crta biciklista jer on vozi dulje vrijeme' },
          { en: 'Both are equally steep, because both cover 100 m', hr: 'Obje su jednako strme jer oboje prijeđu 100 m' }
        ],
        answer: 0,
        try: { en: 'Choose "Constant speed", set "Cyclist speed" to 5 m/s and "Car speed" to 10 m/s, and press "Play". Compare the two lines on the graph.',
          hr: 'Odaberi "Stalna brzina", postavi "Brzina biciklista" na 5 m/s i "Brzina automobila" na 10 m/s pa pritisni "Pokreni". Usporedi dvije crte na grafu.' },
        explain: { en: 'The slope of a distance–time line is the speed: the faster mover gains more metres every second, so its line climbs more steeply. A longer line only means a longer time.',
          hr: 'Nagib crte na grafu puta i vremena jednak je brzini: brže tijelo svake sekunde prijeđe više metara pa mu se crta strmije penje. Dulja crta znači samo dulje vrijeme.' }
      },
      {
        q: { en: 'The cyclist (5 m/s) gets a 40 m head start. The car (10 m/s) starts from 0 m. Who reaches the finish line at 100 m first?',
          hr: 'Biciklist (5 m/s) dobije prednost od 40 m. Automobil (10 m/s) kreće s 0 m. Tko će prvi stići na cilj na 100 m?' },
        options: [
          { en: 'The cyclist, a 40 m lead is too big', hr: 'Biciklist jer je prednost od 40 m prevelika' },
          { en: 'They arrive together', hr: 'Stižu istodobno' },
          { en: 'The car', hr: 'Automobil' }
        ],
        answer: 2,
        try: { en: 'In "Constant speed" set "Cyclist speed" 5 m/s, "Car speed" 10 m/s, "Cyclist head start" 40 m and "Finish line" 100 m. Press "Play" and watch where the car overtakes.',
          hr: 'U načinu "Stalna brzina" postavi "Brzina biciklista" 5 m/s, "Brzina automobila" 10 m/s, "Prednost biciklista" 40 m i "Cilj" 100 m. Pritisni "Pokreni" i gledaj gdje automobil pretječe.' },
        explain: { en: 'The cyclist needs 60 m ÷ 5 m/s = 12 s, the car 100 m ÷ 10 m/s = 10 s. The car closes the gap by 5 m every second and overtakes at 80 m, where the two lines on the graph cross.',
          hr: 'Biciklistu treba 60 m : 5 m/s = 12 s, a automobilu 100 m : 10 m/s = 10 s. Automobil svake sekunde smanji zaostatak za 5 m i pretekne biciklista na 80 m, gdje se crte na grafu sijeku.' }
      }
    ],

    // ---------------------------------------------------------------- motiongraphs
    motiongraphs: [
      {
        q: { en: 'The man stands still at +3 m for 10 seconds. What will his position–time (x–t) graph look like?',
          hr: 'Čovjek 10 sekundi mirno stoji na položaju +3 m. Kako će izgledati njegov graf položaja i vremena (x–t)?' },
        options: [
          { en: 'A single dot, because nothing is happening', hr: 'Samo jedna točka jer se ništa ne događa' },
          { en: 'A horizontal line at 3 m', hr: 'Vodoravna crta na 3 m' },
          { en: 'A rising line, because time goes on', hr: 'Crta koja se penje jer vrijeme teče' }
        ],
        answer: 1,
        try: { en: 'Choose "Set velocity", set "Starting position" to 3 m and "Starting velocity" to 0 m/s, then press "Play" and watch the x–t graph.',
          hr: 'Odaberi "Zadaj brzinu", postavi "Početni položaj" na 3 m i "Početna brzina" na 0 m/s, zatim pritisni "Pokreni" i prati graf x–t.' },
        explain: { en: 'Time keeps running, so the graph keeps drawing to the right, but the position stays 3 m: a flat line. A flat x–t line means standing still, and the velocity graph stays at zero.',
          hr: 'Vrijeme teče pa se graf i dalje crta udesno, ali položaj ostaje 3 m: crta je vodoravna. Vodoravna crta x–t znači mirovanje, a graf brzine ostaje na nuli.' }
      },
      {
        q: { en: 'The man walks back to the left at a steady 1 m/s. What will his velocity–time (v–t) graph show?',
          hr: 'Čovjek se jednoliko vraća ulijevo brzinom 1 m/s. Što će pokazati njegov graf brzine i vremena (v–t)?' },
        options: [
          { en: 'A line sloping downward, like his position', hr: 'Crtu koja se spušta, kao i njegov položaj' },
          { en: 'A horizontal line above zero, because a velocity is never negative', hr: 'Vodoravnu crtu iznad nule jer brzina nikad nije negativna' },
          { en: 'A horizontal line below zero, at −1 m/s', hr: 'Vodoravnu crtu ispod nule, na −1 m/s' }
        ],
        answer: 2,
        try: { en: 'Choose "Set velocity", set "Starting position" to 6 m and "Starting velocity" to −1 m/s, press "Play" and compare the x–t and v–t graphs.',
          hr: 'Odaberi "Zadaj brzinu", postavi "Početni položaj" na 6 m i "Početna brzina" na −1 m/s, pritisni "Pokreni" i usporedi grafove x–t i v–t.' },
        explain: { en: 'The x–t line slopes down because the position gets smaller. The velocity itself does not change, so the v–t line is flat; the minus sign only tells the direction: to the left.',
          hr: 'Crta x–t se spušta jer se položaj smanjuje. Sama brzina se ne mijenja pa je crta v–t vodoravna; predznak minus govori samo o smjeru: ulijevo.' }
      }
    ],

    // ---------------------------------------------------------------- galileo
    galileo: [
      {
        q: { en: 'A ball is released from 0.6 m. The right ramp is lowered from 30° to 10°, and there is no friction. How high does the ball climb now?',
          hr: 'Kuglica se pušta s visine 0,6 m. Desnu kosinu spustimo s 30° na 10°, a trenja nema. Koliko se visoko kuglica sada popne?' },
        options: [
          { en: 'To the same height, 0.6 m, but it travels farther', hr: 'Do iste visine, 0,6 m, ali prijeđe dulji put' },
          { en: 'Lower, because the gentle ramp is longer', hr: 'Niže jer je blaga kosina dulja' },
          { en: 'Higher, because a gentle ramp is easier to climb', hr: 'Više jer se uz blagu kosinu lakše penje' }
        ],
        answer: 0,
        try: { en: 'Set "Release height" to 0.6 m, switch "Friction" off and press "Release!" with "Right ramp angle" at 30°, then at 10°. Compare the highest point with the dashed line.',
          hr: 'Postavi "Visina puštanja" na 0,6 m, isključi "Trenje" i pritisni "Pusti!" uz "Kut desne kosine" 30°, zatim 10°. Usporedi najvišu točku s crtkanom linijom.' },
        explain: { en: 'Without friction no energy is lost, so the ball always returns to its release height. On a gentler ramp it simply has to roll a longer distance to get that high.',
          hr: 'Bez trenja se energija ne gubi pa se kuglica uvijek vrati na visinu s koje je puštena. Na blažoj kosini samo mora prijeći dulji put da stigne do te visine.' }
      },
      {
        q: { en: 'Now the right ramp is flat (0°) and there is no friction. What does the ball do on the flat track?',
          hr: 'Sada je desna kosina vodoravna (0°) i nema trenja. Što će kuglica raditi na ravnoj stazi?' },
        options: [
          { en: 'It slows down and stops, because nothing pushes it', hr: 'Usporava i stane jer je ništa ne gura' },
          { en: 'It rolls on at the same speed and never stops', hr: 'Kotrlja se dalje istom brzinom i ne zaustavlja se' },
          { en: 'It keeps speeding up', hr: 'Sve više ubrzava' }
        ],
        answer: 1,
        try: { en: 'Set "Right ramp angle" to 0°, keep "Friction" off and press "Release!". Watch the "Speed" readout on the flat part. Then switch "Friction" on.',
          hr: 'Postavi "Kut desne kosine" na 0°, ostavi "Trenje" isključeno i pritisni "Pusti!". Prati očitanje "Brzina" na ravnom dijelu. Zatim uključi "Trenje".' },
        explain: { en: 'A moving object does not need a force to keep moving; a force is needed only to change its motion. With no friction nothing slows the ball, so it keeps its speed: this is inertia.',
          hr: 'Tijelu koje se giba ne treba sila da se nastavi gibati; sila je potrebna samo da se gibanje promijeni. Bez trenja ništa ne usporava kuglicu pa ona zadržava brzinu: to je tromost.' }
      }
    ],

    // ---------------------------------------------------------------- forces
    forces: [
      {
        q: { en: 'A 20 kg crate stands on wood. It needs about 59 N to start sliding, but you push with only 40 N. How big is the friction force?',
          hr: 'Sanduk od 20 kg stoji na drvu. Da krene, treba oko 59 N, a ti guraš sa samo 40 N. Kolika je sila trenja?' },
        options: [
          { en: '59 N, friction is always at its maximum', hr: '59 N jer je trenje uvijek najveće moguće' },
          { en: '0 N, because nothing is moving', hr: '0 N jer se ništa ne giba' },
          { en: '40 N, exactly as big as your push', hr: '40 N, točno koliko i tvoje guranje' }
        ],
        answer: 2,
        try: { en: 'Set "Floor surface" to "Wood (μ = 0.3)", "Mass of the crate" to 20 kg and "Push force" to 40 N. Press "Play" and read "Friction force" and "Net force".',
          hr: 'Postavi "Podloga" na "Drvo (μ = 0,3)", "Masa sanduka" na 20 kg i "Sila guranja" na 40 N. Pritisni "Pokreni" i očitaj "Sila trenja" i "Rezultanta sila".' },
        explain: { en: 'The crate stays at rest, so the forces on it must cancel: friction pushes back with exactly 40 N. Friction at rest adjusts to the push and reaches its maximum only just before the crate starts to move.',
          hr: 'Sanduk miruje pa se sile na njega moraju poništiti: trenje djeluje unatrag s točno 40 N. Trenje mirovanja prilagođava se guranju i najveću vrijednost dosegne tek neposredno prije nego što sanduk krene.' }
      },
      {
        q: { en: 'You push a 20 kg crate across ice with a steady 40 N the whole time. What happens to its speed?',
          hr: 'Sanduk od 20 kg guraš po ledu stalnom silom 40 N cijelo vrijeme. Što se događa s njegovom brzinom?' },
        options: [
          { en: 'It keeps growing as long as you push', hr: 'Raste sve dok guraš' },
          { en: 'It grows at first and then stays constant', hr: 'Najprije raste, a zatim ostaje stalna' },
          { en: 'It is constant from the start: steady force, steady speed', hr: 'Stalna je od početka: stalna sila, stalna brzina' }
        ],
        answer: 0,
        try: { en: 'Set "Floor surface" to "Ice (μ = 0.05)", "Mass of the crate" to 20 kg and "Push force" to 40 N. Press "Play" and watch "Speed" and "Acceleration".',
          hr: 'Postavi "Podloga" na "Led (μ = 0,05)", "Masa sanduka" na 20 kg i "Sila guranja" na 40 N. Pritisni "Pokreni" i prati "Brzina" i "Ubrzanje".' },
        explain: { en: 'The push (40 N) is bigger than the friction (about 10 N), so a net force of about 30 N acts all the time. A constant net force gives a constant acceleration, not a constant speed.',
          hr: 'Guranje (40 N) veće je od trenja (oko 10 N) pa cijelo vrijeme djeluje rezultanta od oko 30 N. Stalna rezultantna sila daje stalno ubrzanje, a ne stalnu brzinu.' }
      }
    ],

    // ---------------------------------------------------------------- forcepairs
    forcepairs: [
      {
        q: { en: 'A 10 000 kg truck crashes head-on into a 500 kg car. Which vehicle feels the bigger force during the crash?',
          hr: 'Kamion od 10 000 kg sudari se čeono s autom od 500 kg. Na koje vozilo pri sudaru djeluje veća sila?' },
        options: [
          { en: 'The car, because the truck hits much harder', hr: 'Na auto jer kamion udara mnogo jače' },
          { en: 'Both feel exactly the same force', hr: 'Na oba djeluje točno jednaka sila' },
          { en: 'The truck, because it is bigger', hr: 'Na kamion jer je veći' }
        ],
        answer: 1,
        try: { en: 'Choose "Truck meets car", set "Truck mass" to 10 000 kg and "Car mass" to 500 kg, and press "Play". Compare "Force on the car" with "Force on the truck", then the accelerations.',
          hr: 'Odaberi "Kamion i auto", postavi "Masa kamiona" na 10 000 kg i "Masa auta" na 500 kg pa pritisni "Pokreni". Usporedi "Sila na auto" i "Sila na kamion", zatim ubrzanja.' },
        explain: { en: 'Forces always come in pairs of equal size and opposite direction (Newton\'s third law). The car is damaged more because the same force gives its small mass a 20 times bigger acceleration.',
          hr: 'Sile uvijek dolaze u paru: jednake su po iznosu, a suprotnog smjera (treći Newtonov zakon). Auto strada više jer ista sila njegovoj maloj masi daje 20 puta veće ubrzanje.' }
      },
      {
        q: { en: 'Ana pulls one end of a dynamometer with 100 N and Bruno pulls the other end with 100 N. What does the dynamometer show?',
          hr: 'Ana vuče jedan kraj dinamometra silom 100 N, a Bruno drugi kraj silom 100 N. Što pokazuje dinamometar?' },
        options: [
          { en: '200 N, the two pulls add up', hr: '200 N jer se dvije sile zbrajaju' },
          { en: '0 N, the two pulls cancel', hr: '0 N jer se dvije sile poništavaju' },
          { en: '100 N', hr: '100 N' }
        ],
        answer: 2,
        try: { en: 'Choose "Tug on a dynamometer", set "Ana pulls to the left" and "Bruno pulls to the right" to 100 N and read "Scale reading (tension)". Then switch on "Tie the left end to a wall".',
          hr: 'Odaberi "Dinamometar", postavi "Ana vuče ulijevo" i "Bruno vuče udesno" na 100 N i očitaj "Dinamometar pokazuje (napetost)". Zatim uključi "Lijevi kraj veži na zid".' },
        explain: { en: 'A dynamometer shows the force that stretches it at one end; the other end must be held with an equal force, or it would simply be pulled away. A wall that holds it pulls back with the same 100 N as Ana did.',
          hr: 'Dinamometar pokazuje silu koja ga rasteže na jednom kraju; drugi kraj mora držati jednaka sila, inače bi ga prva samo odvukla. Zid koji ga drži vuče natrag istom silom od 100 N kao prije Ana.' }
      }
    ],

    // ---------------------------------------------------------------- pendulum
    pendulum: [
      {
        q: { en: 'You change the bob of a pendulum from 0.1 kg to 2 kg and keep the length the same. What happens to the time of one swing (the period)?',
          hr: 'Kuglicu njihala od 0,1 kg zamijeniš kuglicom od 2 kg, a duljina ostaje ista. Što se događa s trajanjem jednog njihaja (periodom)?' },
        options: [
          { en: 'It gets shorter: a heavy bob swings faster', hr: 'Skrati se: teška kuglica njiše se brže' },
          { en: 'It gets longer: a heavy bob is harder to move', hr: 'Produlji se: tešku kuglicu teže je pokrenuti' },
          { en: 'It stays the same', hr: 'Ostaje isto' }
        ],
        answer: 2,
        try: { en: 'Set "Mass of the bob" to 0.1 kg and read "Period (measured)" after a few swings. Then move the slider to 2 kg and read it again.',
          hr: 'Postavi "Masa kuglice" na 0,1 kg i nakon nekoliko njihaja očitaj "Period (mjereno)". Zatim pomakni klizač na 2 kg i očitaj ponovno.' },
        explain: { en: 'A heavier bob is pulled by a bigger force, but it is also harder to speed up, and the two effects cancel exactly. The period depends only on the length and on gravity.',
          hr: 'Težu kuglicu vuče veća sila, ali ju je i teže ubrzati, pa se ta dva učinka točno ponište. Period ovisi samo o duljini njihala i o gravitaciji.' }
      },
      {
        q: { en: 'You take a 1 m long pendulum from the Earth to the Moon. How does it swing there?',
          hr: 'Njihalo duljine 1 m preneseš sa Zemlje na Mjesec. Kako se ondje njiše?' },
        options: [
          { en: 'More slowly: one swing takes longer', hr: 'Sporije: jedan njihaj traje dulje' },
          { en: 'Exactly as on Earth', hr: 'Posve jednako kao na Zemlji' },
          { en: 'Faster, because everything is lighter on the Moon', hr: 'Brže jer je na Mjesecu sve lakše' }
        ],
        answer: 0,
        try: { en: 'Set "Length L" to 1 m and read "Period (measured)" for "Earth (g = 9.81 m/s²)". Then set "Where are we?" to "Moon (g = 1.62 m/s²)" and read it again.',
          hr: 'Postavi "Duljina L" na 1 m i očitaj "Period (mjereno)" za "Zemlja (g = 9,81 m/s²)". Zatim postavi "Gdje smo?" na "Mjesec (g = 1,62 m/s²)" i očitaj ponovno.' },
        explain: { en: 'Gravity is what pulls the bob back towards the middle. On the Moon gravity is about six times weaker, so the bob returns more slowly and the period grows from about 2 s to about 5 s.',
          hr: 'Kuglicu prema sredini vraća gravitacija. Na Mjesecu je gravitacija oko šest puta slabija pa se kuglica vraća sporije i period naraste s oko 2 s na oko 5 s.' }
      }
    ],

    // ---------------------------------------------------------------- circular
    circular: [
      {
        q: { en: 'You whirl a ball on a string in a circle and suddenly let go of the string. Seen from above, where does the ball go?',
          hr: 'Vrtiš kuglicu na niti po kružnici i odjednom pustiš nit. Kamo odleti kuglica, gledano odozgo?' },
        options: [
          { en: 'Straight outward, directly away from the centre', hr: 'Ravno prema van, točno od središta' },
          { en: 'It keeps curving round for a while', hr: 'Još neko vrijeme nastavi zavijati u krug' },
          { en: 'Straight ahead along the tangent to the circle', hr: 'Ravno naprijed po tangenti na kružnicu' }
        ],
        answer: 2,
        try: { en: 'Choose "Ball on a string" and press "Let go!". Watch the path of the ball. With "Show common mistake" on, compare it with the dotted curve marked "not this".',
          hr: 'Odaberi "Kuglica na niti" i pritisni "Pusti!". Prati putanju kuglice. Uz uključeno "Pokaži čestu pogrešku" usporedi je s točkastom krivuljom označenom "ne ovako".' },
        explain: { en: 'The string pulls the ball towards the centre and so keeps bending its path. Once the string is released no force turns the ball any more, so it keeps the direction it had at that moment: a straight line along the tangent.',
          hr: 'Nit vuče kuglicu prema središtu i tako joj stalno zakreće putanju. Kad se nit pusti, više nema sile koja je zakreće pa kuglica zadrži smjer koji je imala u tom trenutku: ravnu crtu po tangenti.' }
      },
      {
        q: { en: 'The ball on the string circles at 2 m/s. You double its speed to 4 m/s on the same circle. How does the force in the string change?',
          hr: 'Kuglica na niti kruži brzinom 2 m/s. Udvostručiš joj brzinu na 4 m/s na istoj kružnici. Kako se promijeni sila u niti?' },
        options: [
          { en: 'It becomes 4 times bigger', hr: 'Postane 4 puta veća' },
          { en: 'It becomes 2 times bigger', hr: 'Postane 2 puta veća' },
          { en: 'It stays the same, because the circle is the same', hr: 'Ostane ista jer je kružnica ista' }
        ],
        answer: 0,
        try: { en: 'In "Ball on a string" set "Speed" to 2 m/s and read "Centripetal force". Then set "Speed" to 4 m/s and read it again.',
          hr: 'U načinu "Kuglica na niti" postavi "Brzina" na 2 m/s i očitaj "Centripetalna sila". Zatim postavi "Brzina" na 4 m/s i očitaj ponovno.' },
        explain: { en: 'The force needed to keep an object on a circle is F = m·v²/r. It grows with the square of the speed, so twice the speed needs four times the force. That is why fast bends are so dangerous.',
          hr: 'Sila potrebna da tijelo ostane na kružnici je F = m·v²/r. Raste s kvadratom brzine pa dvostruka brzina traži četiri puta veću silu. Zato su brzi zavoji tako opasni.' }
      }
    ],

    // ---------------------------------------------------------------- space
    space: [
      {
        q: { en: 'Some nights we see only a thin crescent of the Moon. Why is the rest of it dark?',
          hr: 'Nekih noći vidimo samo tanak Mjesečev srp. Zašto je ostatak Mjeseca taman?' },
        options: [
          { en: 'The shadow of the Earth covers that part', hr: 'Taj dio prekriva Zemljina sjena' },
          { en: 'We are looking mostly at the half that the Sun does not light', hr: 'Gledamo uglavnom polovicu koju Sunce ne osvjetljava' },
          { en: 'Clouds hide part of the Moon', hr: 'Dio Mjeseca zaklanjaju oblaci' }
        ],
        answer: 1,
        try: { en: 'Choose "Moon phases" and drag the Moon slowly once around its orbit. Check which half the Sun lights each time and compare with "Seen from Earth" and "Lit part we see".',
          hr: 'Odaberi "Mjesečeve mijene" i polako povuci Mjesec jedan krug po stazi. Svaki put provjeri koju polovicu Sunce osvjetljava i usporedi s prikazom "Pogled sa Zemlje" i očitanjem "Osvijetljeni dio".' },
        explain: { en: 'The Sun always lights half of the Moon. As the Moon goes round the Earth we see more or less of that lit half. The shadow of the Earth reaches the Moon only during a lunar eclipse.',
          hr: 'Sunce uvijek osvjetljava polovicu Mjeseca. Dok Mjesec kruži oko Zemlje, vidimo veći ili manji dio te osvijetljene polovice. Zemljina sjena pada na Mjesec samo za pomrčine Mjeseca.' }
      },
      {
        q: { en: 'Why is it summer in Croatia in June and July?',
          hr: 'Zašto je u Hrvatskoj u lipnju i srpnju ljeto?' },
        options: [
          { en: 'The Earth is then closest to the Sun', hr: 'Zemlja je tada najbliže Suncu' },
          { en: 'The Sun shines more strongly in summer', hr: 'Sunce ljeti jače sja' },
          { en: 'The northern half of the Earth is tilted towards the Sun', hr: 'Sjeverna polovica Zemlje nagnuta je prema Suncu' }
        ],
        answer: 2,
        try: { en: 'Choose "Seasons" and drag the Earth along its orbit to June 21, then to December 21. Watch the tilted axis and compare "Noon Sun height in Croatia" and "Day length in Croatia".',
          hr: 'Odaberi "Godišnja doba" i povuci Zemlju po stazi do 21. lipnja, zatim do 21. prosinca. Prati nagnutu os i usporedi "Visina Sunca u podne (HR)" i "Trajanje dana (HR)".' },
        explain: { en: 'The axis of the Earth is tilted by 23.5°. In June the northern half leans towards the Sun: sunlight falls more steeply and the days are longer. Distance is not the cause: the Earth is actually closest to the Sun in early January.',
          hr: 'Zemljina os nagnuta je za 23,5°. U lipnju je sjeverna polovica nagnuta prema Suncu: svjetlost pada strmije i dani su dulji. Udaljenost nije uzrok: Zemlja je Suncu zapravo najbliže početkom siječnja.' }
      }
    ],

    // ---------------------------------------------------------------- density
    density: [
      {
        q: { en: 'A big oak cube (2000 cm³, 1.4 kg) and a small aluminium cube (100 cm³, 0.27 kg) are dropped into water. What happens?',
          hr: 'Veliku hrastovu kocku (2000 cm³, 1,4 kg) i malu aluminijsku kocku (100 cm³, 0,27 kg) pustimo u vodu. Što će se dogoditi?' },
        options: [
          { en: 'The heavy oak cube sinks, the light aluminium cube floats', hr: 'Teška hrastova kocka tone, a lagana aluminijska pluta' },
          { en: 'The oak cube floats, the aluminium cube sinks', hr: 'Hrastova kocka pluta, a aluminijska tone' },
          { en: 'Both sink', hr: 'Obje tonu' }
        ],
        answer: 1,
        try: { en: 'Set "Liquid" to "Water", "Material" to "Oak wood" and "Volume" to 2000 cm³, then press "Drop". Repeat with "Aluminium" and 100 cm³. Compare "Mass" and "Object density".',
          hr: 'Postavi "Tekućina" na "Voda", "Materijal" na "Hrastovo drvo" i "Obujam" na 2000 cm³ pa pritisni "Pusti". Ponovi uz "Aluminij" i 100 cm³. Usporedi "Masa" i "Gustoća tijela".' },
        explain: { en: 'Floating is decided by density, not by mass. Oak (700 kg/m³) is less dense than water (1000 kg/m³) and floats however big the cube is; aluminium (2700 kg/m³) is denser and sinks even as a tiny piece.',
          hr: 'O plutanju odlučuje gustoća, a ne masa. Hrast (700 kg/m³) ima manju gustoću od vode (1000 kg/m³) i pluta ma koliko kocka bila velika; aluminij (2700 kg/m³) ima veću gustoću i tone čak i kao sitan komadić.' }
      },
      {
        q: { en: 'An ice cube floats in a glass of water. How much of the ice is below the water surface?',
          hr: 'Kocka leda pluta u čaši vode. Koliki je dio leda ispod površine vode?' },
        options: [
          { en: 'About nine tenths', hr: 'Oko devet desetina' },
          { en: 'About half', hr: 'Oko polovice' },
          { en: 'Almost none, the ice lies on top of the water', hr: 'Gotovo ništa jer led leži na vodi' }
        ],
        answer: 0,
        try: { en: 'Set "Liquid" to "Water" and "Material" to "Ice", press "Drop" and read "Under the surface". Then try "Sea water" and "Alcohol (ethanol)".',
          hr: 'Postavi "Tekućina" na "Voda" i "Materijal" na "Led", pritisni "Pusti" i očitaj "Pod površinom". Zatim probaj "Morska voda" i "Alkohol (etanol)".' },
        explain: { en: 'A floating object sinks in until the part under the surface equals its density divided by the density of the liquid: 917 ÷ 1000 ≈ 92 %. That is why most of an iceberg is hidden under the sea.',
          hr: 'Tijelo koje pluta uroni toliko da je dio pod površinom jednak omjeru njegove gustoće i gustoće tekućine: 917 : 1000 ≈ 92 %. Zato je veći dio ledenog brijega skriven pod morem.' }
      }
    ],

    // ---------------------------------------------------------------- pressure
    pressure: [
      {
        q: { en: 'The same person (600 N) stands on sand, first in high heels and then on snowshoes. In which case does she sink deeper?',
          hr: 'Ista osoba (600 N) stane na pijesak najprije u štiklama, a zatim na krpljama. Kada utone dublje?' },
        options: [
          { en: 'Equally deep, because her weight is the same', hr: 'Jednako duboko jer joj je težina ista' },
          { en: 'On snowshoes, because they are bigger and heavier', hr: 'Na krpljama jer su veće i teže' },
          { en: 'In high heels, much deeper', hr: 'U štiklama, i to mnogo dublje' }
        ],
        answer: 2,
        try: { en: 'Choose "On a surface" and press "High heel", then "Snowshoe". Each time read "Pressure" and watch how deep the block sinks into the sand.',
          hr: 'Odaberi "Na podlogu" i pritisni "Štikla", zatim "Krplje". Svaki put očitaj "Tlak" i gledaj koliko duboko blok utone u pijesak.' },
        explain: { en: 'Pressure is force divided by area, p = F / A. The same 600 N on a 2 cm² heel gives a pressure 200 times bigger than on a 400 cm² snowshoe, so the heel digs in deep.',
          hr: 'Tlak je sila podijeljena s površinom, p = F / A. Istih 600 N na štikli od 2 cm² daje 200 puta veći tlak nego na krplji od 400 cm², pa štikla duboko utone.' }
      },
      {
        q: { en: 'A tank full of water has three equal holes in its wall: near the top, in the middle and near the bottom. From which hole does the water shoot out fastest?',
          hr: 'Spremnik pun vode ima u zidu tri jednake rupe: pri vrhu, u sredini i pri dnu. Iz koje rupe voda izlazi najbrže?' },
        options: [
          { en: 'From the bottom hole', hr: 'Iz donje rupe' },
          { en: 'From the top hole', hr: 'Iz gornje rupe' },
          { en: 'Equally fast from all three', hr: 'Jednako brzo iz sve tri' }
        ],
        answer: 0,
        try: { en: 'Choose "In a liquid" and switch on "Holes in the wall" (press "Play" if the water does not move). Then drag the sensor up and down and read "Liquid pressure".',
          hr: 'Odaberi "U tekućini" i uključi "Rupe u zidu" (pritisni "Pokreni" ako voda miruje). Zatim povuci senzor gore-dolje i očitaj "Tlak tekućine".' },
        explain: { en: 'The pressure in a liquid grows with depth, p = ρ·g·h, because more and more water presses down from above. At the bottom hole the pressure is biggest, so the water is pushed out fastest there.',
          hr: 'Tlak u tekućini raste s dubinom, p = ρ·g·h, jer odozgo pritišće sve više vode. Kod donje rupe tlak je najveći pa voda ondje izlazi najbrže.' }
      }
    ],

    // ---------------------------------------------------------------- lever
    lever: [
      {
        q: { en: 'A 10 kg weight sits 1 m to the left of the pivot and a 5 kg weight sits 2 m to the right. What happens when the beam is unlocked?',
          hr: 'Uteg od 10 kg stoji 1 m lijevo od oslonca, a uteg od 5 kg 2 m desno od njega. Što se dogodi kad se greda otključa?' },
        options: [
          { en: 'The left side goes down: the heavier weight wins', hr: 'Lijeva strana se spusti: teži uteg pobjeđuje' },
          { en: 'The beam stays level', hr: 'Greda ostane vodoravna' },
          { en: 'The right side goes down: the weight farther out wins', hr: 'Desna strana se spusti: udaljeniji uteg pobjeđuje' }
        ],
        answer: 1,
        try: { en: 'Choose "Balance", drag the "10 kg" weight to the 1 m mark on the left and the "5 kg" weight to the 2 m mark on the right. Switch off "Lock beam (level)" and compare the two torques.',
          hr: 'Odaberi "Ravnoteža", povuci uteg "10 kg" na oznaku 1 m lijevo, a uteg "5 kg" na oznaku 2 m desno. Isključi "Zaključaj gredu (vodoravno)" i usporedi lijevi i desni moment.' },
        explain: { en: 'What counts is the torque: force times distance from the pivot. 10 kg at 1 m turns the beam exactly as strongly as 5 kg at 2 m, so the torques are equal and the beam balances.',
          hr: 'Važan je moment sile: sila puta udaljenost od oslonca. 10 kg na 1 m zakreće gredu jednako jako kao 5 kg na 2 m, pa su momenti jednaki i greda je u ravnoteži.' }
      },
      {
        q: { en: 'You lift a 1000 N rock with a 4 m long lever. You move the fulcrum closer to the rock. What happens to the force you need?',
          hr: 'Polugom duljine 4 m podižeš kamen težine 1000 N. Oslonac pomakneš bliže kamenu. Što se događa sa silom koja ti je potrebna?' },
        options: [
          { en: 'It gets smaller', hr: 'Smanji se' },
          { en: 'It stays 1000 N, because the rock weighs the same', hr: 'Ostaje 1000 N jer je kamen jednako težak' },
          { en: 'It gets bigger', hr: 'Poveća se' }
        ],
        answer: 0,
        try: { en: 'Choose "Lift the rock" and set "Rock weight F₁" to 1000 N. Move "Fulcrum position (from the rock)" from 2 m to 0.5 m and watch "Force needed".',
          hr: 'Odaberi "Podigni kamen" i postavi "Težina kamena F₁" na 1000 N. Pomakni "Položaj oslonca (od kamena)" s 2 m na 0,5 m i prati "Potrebna sila".' },
        explain: { en: 'For a lever F₁·d₁ = F₂·d₂. With the fulcrum near the rock your arm of the lever is much longer than the arm of the rock, so a small force is enough: about 143 N instead of 1000 N. In return your hand moves a longer way.',
          hr: 'Za polugu vrijedi F₁·d₁ = F₂·d₂. Kad je oslonac blizu kamena, tvoj je krak mnogo dulji od kraka kamena pa je dovoljna mala sila: oko 143 N umjesto 1000 N. Zauzvrat tvoja ruka prijeđe dulji put.' }
      }
    ],

    // ---------------------------------------------------------------- states
    states: [
      {
        q: { en: 'Water is cooled to −20 °C and becomes ice. What do its particles do then?',
          hr: 'Vodu ohladimo na −20 °C i ona postane led. Što tada rade njezine čestice?' },
        options: [
          { en: 'They stand completely still', hr: 'Potpuno miruju' },
          { en: 'They vibrate in place in a regular pattern', hr: 'Titraju na mjestu u pravilnom rasporedu' },
          { en: 'They wander around slowly', hr: 'Polako lutaju naokolo' }
        ],
        answer: 1,
        try: { en: 'Set "Substance" to "Water" and move "Temperature" to −20 °C. Look closely at the particles, then press "Cool" and watch what changes.',
          hr: 'Postavi "Tvar" na "Voda" i pomakni "Temperatura" na −20 °C. Pažljivo pogledaj čestice, zatim pritisni "Hladi" i prati što se mijenja.' },
        explain: { en: 'In a solid the particles are locked in a fixed pattern, but they never stop moving: they vibrate around their places. Colder means weaker vibrations, not perfect rest.',
          hr: 'U čvrstom tijelu čestice su vezane u pravilan raspored, ali se ne prestaju gibati: titraju oko svojih mjesta. Hladnije znači slabije titranje, a ne potpuno mirovanje.' }
      },
      {
        q: { en: 'Liquid water is heated above 100 °C and turns into a gas (steam). What happens to its particles?',
          hr: 'Tekuću vodu zagrijemo iznad 100 °C i ona prijeđe u plin (vodenu paru). Što se događa s njezinim česticama?' },
        options: [
          { en: 'The particles themselves swell and get bigger', hr: 'Same čestice se šire i postaju veće' },
          { en: 'The particles break up and disappear', hr: 'Čestice se raspadnu i nestanu' },
          { en: 'They stay the same size but fly fast and far apart', hr: 'Ostaju jednako velike, ali lete brzo i daleko jedna od druge' }
        ],
        answer: 2,
        try: { en: 'Set "Substance" to "Water" at 20 °C, then press "Heat" until the temperature passes 100 °C. Compare the size, spacing and speed of the particles before and after.',
          hr: 'Postavi "Tvar" na "Voda" pri 20 °C, zatim pritisni "Zagrijavaj" dok temperatura ne prijeđe 100 °C. Usporedi veličinu, razmak i brzinu čestica prije i poslije.' },
        explain: { en: 'A gas takes up more room because its particles move apart and fly freely, not because each particle grows. The particles are the same in ice, water and steam; only their motion and spacing change.',
          hr: 'Plin zauzima više prostora zato što se čestice razmaknu i slobodno lete, a ne zato što svaka čestica naraste. Čestice su iste u ledu, vodi i pari; mijenjaju se samo njihovo gibanje i razmak.' }
      }
    ],

    // ---------------------------------------------------------------- energy
    energy: [
      {
        q: { en: 'A skater starts from rest 4 m high on a half-pipe with no friction. How high does he get on the other side?',
          hr: 'Skejter kreće iz mirovanja s visine 4 m na U-rampi bez trenja. Koliko visoko stigne na drugoj strani?' },
        options: [
          { en: 'Lower than 4 m, some height is always lost', hr: 'Niže od 4 m jer se dio visine uvijek izgubi' },
          { en: 'Exactly 4 m', hr: 'Točno 4 m' },
          { en: 'Higher than 4 m, because he picks up speed at the bottom', hr: 'Više od 4 m jer na dnu dobije brzinu' }
        ],
        answer: 1,
        try: { en: 'Choose the track "Half-pipe", set "Friction μ" to 0 and drag the skater onto the track until "Height" shows about 4 m. Let go (press "Play" if needed) and watch the "start height" line.',
          hr: 'Odaberi stazu "U-rampa", postavi "Trenje μ" na 0 i povuci skejtera na stazu dok "Visina" ne pokaže oko 4 m. Pusti ga (po potrebi pritisni "Pokreni") i prati crtu "početna visina".' },
        explain: { en: 'Going down, potential energy turns into kinetic energy; going up, it turns back. Without friction nothing is lost, so the skater reaches exactly the starting height, and never more.',
          hr: 'Pri spuštanju potencijalna energija prelazi u kinetičku, a pri penjanju natrag u potencijalnu. Bez trenja se ništa ne gubi pa skejter stigne točno do početne visine, i nikad više od toga.' }
      },
      {
        q: { en: 'With friction switched on, the skater swings lower and lower and finally stops. What happened to his energy?',
          hr: 'Uz uključeno trenje skejter se njiše sve niže i na kraju stane. Što se dogodilo s njegovom energijom?' },
        options: [
          { en: 'It turned into thermal (internal) energy; the total is unchanged', hr: 'Prešla je u unutarnju energiju (toplinu); ukupna je ostala ista' },
          { en: 'It was used up and no longer exists', hr: 'Potrošila se i više ne postoji' },
          { en: 'It all turned into potential energy', hr: 'Sva je prešla u potencijalnu energiju' }
        ],
        answer: 0,
        try: { en: 'Set "Friction μ" to 0.10, switch on "Show energy bars" and place the skater high on the "Half-pipe". Watch the "Thermal" bar and the "Total energy" readout until he stops.',
          hr: 'Postavi "Trenje μ" na 0,10, uključi "Prikaži stupce energije" i postavi skejtera visoko na stazu "U-rampa". Prati stupac "Unutar." i očitanje "Ukupna energija" dok ne stane.' },
        explain: { en: 'Energy is never destroyed. Friction turns the kinetic energy into thermal energy: the board and the track get a little warmer. The total stays the same, but this energy can no longer lift the skater.',
          hr: 'Energija se nikad ne uništava. Trenje pretvara kinetičku energiju u unutarnju: daska i staza malo se zagriju. Ukupna energija ostaje ista, ali ta energija više ne može podići skejtera.' }
      }
    ],

    // ---------------------------------------------------------------- energybars
    energybars: [
      {
        q: { en: 'A ball is thrown straight up. Compare its kinetic energy at the same height: once on the way up and once on the way down.',
          hr: 'Lopta je bačena uvis. Usporedi njezinu kinetičku energiju na istoj visini: jednom pri usponu, a jednom pri padu.' },
        options: [
          { en: 'It is bigger on the way up', hr: 'Veća je pri usponu' },
          { en: 'It is bigger on the way down, because falling things gain energy', hr: 'Veća je pri padu jer tijela padanjem dobivaju energiju' },
          { en: 'It is the same both times', hr: 'Oba je puta jednaka' }
        ],
        answer: 2,
        try: { en: 'Choose "Ball thrown straight up" and press "Pause". Drag "Time (scrub when paused)" to 25 % and read "Kinetic energy E_k", then drag it to 75 %, where the ball is at the same height.',
          hr: 'Odaberi "Lopta bačena uvis" i pritisni "Pauza". Povuci "Vrijeme (povlači kad je pauza)" na 25 % i očitaj "Kinetička energija E_k", zatim povuci na 75 %, gdje je lopta na istoj visini.' },
        explain: { en: 'At the same height the ball has the same potential energy. The total energy does not change, so the kinetic energy must also be the same: the ball has the same speed, only in the opposite direction.',
          hr: 'Na istoj visini lopta ima jednaku potencijalnu energiju. Ukupna se energija ne mijenja pa i kinetička mora biti jednaka: lopta ima istu brzinu, samo suprotnog smjera.' }
      },
      {
        q: { en: 'You carry a 2 kg bag along a level corridor at constant speed. How much work does your hand do on the bag?',
          hr: 'Torbu od 2 kg nosiš vodoravnim hodnikom stalnom brzinom. Koliki rad tvoja ruka obavi na torbi?' },
        options: [
          { en: 'A lot, and more the farther you walk', hr: 'Velik, i to veći što dalje hodaš' },
          { en: 'None', hr: 'Nikakav' },
          { en: 'A little, because the bag is light', hr: 'Malen jer je torba lagana' }
        ],
        answer: 1,
        try: { en: 'Choose "Carrying a bag at constant speed" and let it run (press "Play" if it is paused). Watch the energy bars and the "Work done on the system W" readout.',
          hr: 'Odaberi "Nošenje torbe stalnom brzinom" i pusti da se odvija (pritisni "Pokreni" ako je pauza). Prati stupce energije i očitanje "Rad na sustavu W".' },
        explain: { en: 'In physics work is done only when a force acts along the direction of motion. The hand pulls upward while the bag moves sideways, so the energy of the bag does not change. Your arm gets tired, but that is not work on the bag.',
          hr: 'U fizici se rad obavlja samo kad sila djeluje u smjeru gibanja. Ruka vuče prema gore, a torba se giba vodoravno, pa se energija torbe ne mijenja. Ruka se umori, ali to nije rad na torbi.' }
      }
    ],

    // ---------------------------------------------------------------- heat
    heat: [
      {
        q: { en: '1 kg of water at 80 °C is put in contact with 1 kg of water at 20 °C. What temperature do they both reach in the end?',
          hr: '1 kg vode temperature 80 °C dovedemo u dodir s 1 kg vode temperature 20 °C. Koju temperaturu na kraju imaju obje?' },
        options: [
          { en: '100 °C, the temperatures add up', hr: '100 °C jer se temperature zbroje' },
          { en: '60 °C, the difference between them', hr: '60 °C, koliko iznosi njihova razlika' },
          { en: '50 °C, halfway between', hr: '50 °C, točno na pola' }
        ],
        answer: 2,
        try: { en: 'Set both blocks to "Water" and 1 kg, "Left block: temperature" to 80 °C and "Right block: temperature" to 20 °C. Press "Touch!" and watch the two temperature lines meet.',
          hr: 'Postavi oba bloka na "Voda" i 1 kg, "Lijevi blok: temperatura" na 80 °C i "Desni blok: temperatura" na 20 °C. Pritisni "Spoji!" i prati kako se dvije temperature izjednačuju.' },
        explain: { en: 'Temperatures do not add up. Heat flows from the hot water to the cold water until both are equally warm. The masses are equal, so the hot water cools by 30 °C and the cold water warms by 30 °C.',
          hr: 'Temperature se ne zbrajaju. Toplina prelazi s tople vode na hladnu dok obje ne budu jednako tople. Mase su jednake pa se topla voda ohladi za 30 °C, a hladna zagrije za 30 °C.' }
      },
      {
        q: { en: '1 kg of iron at 80 °C touches 1 kg of water at 20 °C. Where does the final temperature end up?',
          hr: '1 kg željeza temperature 80 °C dodirne 1 kg vode temperature 20 °C. Gdje će završiti konačna temperatura?' },
        options: [
          { en: 'Much closer to 20 °C', hr: 'Mnogo bliže 20 °C' },
          { en: 'Exactly 50 °C, because the masses are equal', hr: 'Točno 50 °C jer su mase jednake' },
          { en: 'Much closer to 80 °C, because iron holds heat well', hr: 'Mnogo bliže 80 °C jer željezo dobro drži toplinu' }
        ],
        answer: 0,
        try: { en: 'Set "Left block: material" to "Iron" at 80 °C and "Right block: material" to "Water" at 20 °C, both 1 kg. Press "Touch!" and read T₁ and T₂ when they become equal.',
          hr: 'Postavi "Lijevi blok: materijal" na "Željezo" uz 80 °C i "Desni blok: materijal" na "Voda" uz 20 °C, oba po 1 kg. Pritisni "Spoji!" i očitaj T₁ i T₂ kad se izjednače.' },
        explain: { en: 'Water has a specific heat capacity about nine times bigger than iron: it needs nine times more heat to warm by 1 °C. The heat the iron gives away warms the water only a little, so they meet at about 26 °C.',
          hr: 'Voda ima oko devet puta veći specifični toplinski kapacitet od željeza: treba joj devet puta više topline da se zagrije za 1 °C. Toplina koju željezo preda vodu zagrije tek malo, pa se izjednače na oko 26 °C.' }
      }
    ],

    // ---------------------------------------------------------------- heattransfer
    heattransfer: [
      {
        q: { en: 'A silver spoon and a wooden spoon stand in the same hot tea. After two minutes, which handle tip is hotter?',
          hr: 'Srebrna i drvena žlica stoje u istom vrućem čaju. Nakon dvije minute, vrh koje ručke je topliji?' },
        options: [
          { en: 'Both the same, because the tea is the same', hr: 'Oba jednako jer je čaj isti' },
          { en: 'The silver one, by far', hr: 'Srebrne žlice, i to znatno' },
          { en: 'The wooden one, because wood warms up easily', hr: 'Drvene žlice jer se drvo lako zagrije' }
        ],
        answer: 1,
        try: { en: 'Choose "Conduction", set "Spoon material" to "Silver" and read "Spoon tip temperature" after about 120 s (press "Play" if time stands still). Then choose "Wood", which restarts the time, and read again after 120 s.',
          hr: 'Odaberi "Vođenje", postavi "Materijal žlice" na "Srebro" i očitaj "Temperatura vrha žlice" nakon oko 120 s (pritisni "Pokreni" ako vrijeme stoji). Zatim odaberi "Drvo", čime vrijeme kreće ispočetka, i očitaj ponovno nakon 120 s.' },
        explain: { en: 'Metals conduct heat well: energy passes quickly from particle to particle along the spoon. Wood is a poor conductor (an insulator), so its handle stays cool. That is why cooking spoons are made of wood.',
          hr: 'Metali dobro vode toplinu: energija brzo prelazi s čestice na česticu duž žlice. Drvo je loš vodič (izolator) pa mu ručka ostaje hladna. Zato su kuhače drvene.' }
      },
      {
        q: { en: 'A black can and a shiny can stand at the same distance from an electric heater. Which one warms up faster?',
          hr: 'Crna i sjajna limenka stoje na jednakoj udaljenosti od električne grijalice. Koja se brže zagrijava?' },
        options: [
          { en: 'The black can', hr: 'Crna limenka' },
          { en: 'The shiny can, because shiny metal draws in the heat', hr: 'Sjajna limenka jer sjajni metal privlači toplinu' },
          { en: 'Both equally, because the heater and the distance are the same', hr: 'Obje jednako jer su grijalica i udaljenost isti' }
        ],
        answer: 0,
        try: { en: 'Choose "Radiation" and compare the readouts "Black can" and "Shiny can" as time runs (press "Play" if it stands still). Then switch on "Shield between heater and cans".',
          hr: 'Odaberi "Zračenje" i uspoređuj očitanja "Crna limenka" i "Sjajna limenka" dok vrijeme teče (pritisni "Pokreni" ako stoji). Zatim uključi "Zaslon između grijalice i limenki".' },
        explain: { en: 'The heater warms the cans by radiation. A dark surface absorbs most of the radiation that hits it, while a shiny surface reflects most of it away, so the black can gets much warmer.',
          hr: 'Grijalica zagrijava limenke zračenjem. Tamna površina upije većinu zračenja koje na nju padne, a sjajna ga većinom odbije, pa se crna limenka mnogo više zagrije.' }
      }
    ],

    // ---------------------------------------------------------------- spring
    spring: [
      {
        q: { en: 'A 100 g mass stretches the medium spring by about 4 cm. You replace it with a 200 g mass. How far does the spring stretch now?',
          hr: 'Uteg od 100 g produlji srednju oprugu za oko 4 cm. Zamijeniš ga utegom od 200 g. Koliko se opruga sada produlji?' },
        options: [
          { en: 'About 6 cm: more, but not double', hr: 'Oko 6 cm: više, ali ne dvostruko' },
          { en: 'About 8 cm: exactly double', hr: 'Oko 8 cm: točno dvostruko' },
          { en: 'About 16 cm: four times as much', hr: 'Oko 16 cm: četiri puta više' }
        ],
        answer: 1,
        try: { en: 'Choose "Medium (k = 25 N/m)", hang the 100 g mass and read "Extension x" when it settles. Press "Remove last mass", hang 200 g and read again. Look at the points on the graph.',
          hr: 'Odaberi "Srednja (k = 25 N/m)", objesi uteg od 100 g i očitaj "Produljenje x" kad se smiri. Pritisni "Skini zadnji uteg", objesi 200 g i očitaj ponovno. Pogledaj točke na grafu.' },
        explain: { en: 'Hooke\'s law: the extension is proportional to the force, F = k·x. Twice the mass means twice the weight and so twice the extension. This is why a dynamometer has an evenly spaced scale.',
          hr: 'Hookeov zakon: produljenje je razmjerno sili, F = k·x. Dvostruka masa znači dvostruku težinu, a time i dvostruko produljenje. Zato dinamometar ima jednoliku ljestvicu.' }
      },
      {
        q: { en: 'A 200 g mass hangs on the medium spring (k = 25 N/m). You hang the same mass on the stiff spring (k = 50 N/m). How does the extension change?',
          hr: 'Uteg od 200 g visi na srednjoj opruzi (k = 25 N/m). Isti uteg objesiš na tvrdu oprugu (k = 50 N/m). Kako se promijeni produljenje?' },
        options: [
          { en: 'It stays the same, because the weight is the same', hr: 'Ostaje isto jer je težina ista' },
          { en: 'It doubles, because a stiff spring pulls harder', hr: 'Udvostruči se jer tvrda opruga jače vuče' },
          { en: 'It is halved', hr: 'Prepolovi se' }
        ],
        answer: 2,
        try: { en: 'Hang the 200 g mass on "Medium (k = 25 N/m)" and read "Extension x". Then set "Spring" to "Stiff (k = 50 N/m)" and read it again when the mass settles.',
          hr: 'Objesi uteg od 200 g na oprugu "Srednja (k = 25 N/m)" i očitaj "Produljenje x". Zatim postavi "Opruga" na "Tvrda (k = 50 N/m)" i očitaj ponovno kad se uteg smiri.' },
        explain: { en: 'The force is the same, but the extension also depends on the spring: x = F / k. A spring that is twice as stiff stretches only half as much under the same weight (about 3.9 cm instead of 7.8 cm).',
          hr: 'Sila je ista, ali produljenje ovisi i o opruzi: x = F / k. Dvostruko tvrđa opruga pod istom težinom produlji se upola manje (oko 3,9 cm umjesto 7,8 cm).' }
      }
    ],

    // ---------------------------------------------------------------- circuit
    circuit: [
      {
        q: { en: 'One bulb shines on a battery. You add a second identical bulb in series. How do the bulbs shine now?',
          hr: 'Jedna žaruljica svijetli spojena na bateriju. Dodaš drugu jednaku žaruljicu u seriju. Kako sada svijetle žaruljice?' },
        options: [
          { en: 'Both shine equally, but more dimly than the single bulb', hr: 'Obje svijetle jednako, ali slabije nego jedna sama' },
          { en: 'The first is bright, the second is dimmer because less current reaches it', hr: 'Prva svijetli jako, a druga slabije jer do nje stigne manje struje' },
          { en: 'Both shine as brightly as the single bulb', hr: 'Obje svijetle jednako jako kao jedna sama' }
        ],
        answer: 0,
        try: { en: 'Set "Number of bulbs" to 1 and read "Current I" and "Power per bulb". Then choose 2 bulbs with "Connection" set to "series" and compare the glow and the readouts.',
          hr: 'Postavi "Broj žaruljica" na 1 i očitaj "Struja I" i "Snaga žaruljice". Zatim odaberi 2 žaruljice uz "Spoj" postavljen na "serijski" i usporedi sjaj i očitanja.' },
        explain: { en: 'Current is not used up in a bulb: the same current flows through both, so they shine equally. Two bulbs in series have twice the resistance, so the current is halved and each bulb is dimmer.',
          hr: 'Struja se u žaruljici ne troši: kroz obje teče ista struja pa svijetle jednako. Dvije žaruljice u seriji imaju dvostruko veći otpor, pa je struja upola manja i svaka svijetli slabije.' }
      },
      {
        q: { en: 'One bulb shines on a battery. You add a second identical bulb in parallel. How brightly does each bulb shine?',
          hr: 'Jedna žaruljica svijetli spojena na bateriju. Dodaš drugu jednaku žaruljicu paralelno. Kako jako svijetli svaka žaruljica?' },
        options: [
          { en: 'More dimly, because they share the current of the battery', hr: 'Slabije jer dijele struju baterije' },
          { en: 'As brightly as the single bulb', hr: 'Jednako jako kao jedna sama' },
          { en: 'More brightly, because the current has two paths', hr: 'Jače jer struja ima dva puta' }
        ],
        answer: 1,
        try: { en: 'Set "Number of bulbs" to 1 and read "Power per bulb" and "Current I". Then choose 2 bulbs with "Connection" set to "parallel" and read them again.',
          hr: 'Postavi "Broj žaruljica" na 1 i očitaj "Snaga žaruljice" i "Struja I". Zatim odaberi 2 žaruljice uz "Spoj" postavljen na "paralelno" i očitaj ponovno.' },
        explain: { en: 'In parallel every bulb is connected straight to the battery and gets its full voltage, so each shines as before. The battery simply delivers twice the current, and it runs down faster.',
          hr: 'U paralelnom spoju svaka je žaruljica spojena izravno na bateriju i dobiva njezin puni napon pa svijetli kao prije. Baterija jednostavno daje dvostruko veću struju i brže se troši.' }
      }
    ],

    // ---------------------------------------------------------------- static
    static: [
      {
        q: { en: 'Two balloons hang side by side on strings. Both are rubbed with wool, so both get a negative charge. What do they do?',
          hr: 'Dva balona vise jedan do drugoga na nitima. Oba protrljamo vunom pa oba dobiju negativan naboj. Što će učiniti?' },
        options: [
          { en: 'They pull together, because charged objects attract', hr: 'Privuku se jer se nabijena tijela privlače' },
          { en: 'Nothing, they keep hanging straight down', hr: 'Ništa, i dalje vise ravno prema dolje' },
          { en: 'They push each other apart', hr: 'Odgurnu se jedan od drugoga' }
        ],
        answer: 2,
        try: { en: 'Choose "Two balloons" and press "Charge balloon A (−)" and "Charge balloon B". Watch "Angle between strings". Then switch on "Opposite charge on B (+)".',
          hr: 'Odaberi "Dva balona" i pritisni "Nabij balon A (−)" i "Nabij balon B". Prati "Kut između niti". Zatim uključi "Suprotan naboj na B (+)".' },
        explain: { en: 'Like charges repel and unlike charges attract. Both balloons carry the same kind of charge, so they push each other away. They would pull together only if one were positive and the other negative.',
          hr: 'Istoimeni naboji se odbijaju, a raznoimeni privlače. Oba balona imaju istu vrstu naboja pa se međusobno odbijaju. Privukli bi se samo da je jedan pozitivan, a drugi negativan.' }
      },
      {
        q: { en: 'You rub a balloon on a wool sweater and the balloon becomes negatively charged. What about the sweater?',
          hr: 'Balon protrljaš o vunenu vestu i balon postane negativno nabijen. Što je s vestom?' },
        options: [
          { en: 'It becomes positive by exactly the same amount', hr: 'Postane pozitivna za točno isti iznos' },
          { en: 'It stays neutral, because rubbing created the charge on the balloon', hr: 'Ostane neutralna jer je trljanje stvorilo naboj na balonu' },
          { en: 'It becomes negative too', hr: 'I ona postane negativna' }
        ],
        answer: 0,
        try: { en: 'Choose "Balloon and sweater" and drag the balloon back and forth over the sweater. Compare "Charge on balloon" with "Charge on sweater" and count the − and + signs.',
          hr: 'Odaberi "Balon i vesta" i povlači balon amo-tamo preko veste. Usporedi "Naboj balona" i "Naboj veste" te prebroji znakove − i +.' },
        explain: { en: 'Rubbing does not create charge; it only moves electrons from the wool to the balloon. Every electron the balloon gains is missing from the sweater, so the sweater is left equally positive.',
          hr: 'Trljanjem se naboj ne stvara, nego elektroni samo prelaze s vune na balon. Svaki elektron koji balon dobije nedostaje vesti, pa vesta ostane jednako pozitivno nabijena.' }
      }
    ],

    // ---------------------------------------------------------------- magnet
    magnet: [
      {
        q: { en: 'An iron nail, a copper coin and aluminium foil are all metals. Which of them does a magnet attract?',
          hr: 'Željezni čavao, bakreni novčić i alu-folija su metali. Koje od njih magnet privlači?' },
        options: [
          { en: 'All three, because magnets attract metals', hr: 'Sva tri jer magnet privlači metale' },
          { en: 'Only the iron nail', hr: 'Samo željezni čavao' },
          { en: 'The nail and the copper coin', hr: 'Čavao i bakreni novčić' }
        ],
        answer: 1,
        try: { en: 'Choose "What sticks?" and drag the "Iron nail", the "Copper coin" and the "Aluminium foil" up to the magnet, one by one. Read "Magnetic?" each time.',
          hr: 'Odaberi "Što privlači magnet?" i povuci "Željezni čavao", "Bakreni novčić" i "Alu-folija" do magneta, jedan po jedan. Svaki put očitaj "Magnetično?".' },
        explain: { en: 'A magnet attracts only a few metals: iron, steel (which is mostly iron), nickel and cobalt. Copper and aluminium are metals and conduct electricity well, but they are not magnetic.',
          hr: 'Magnet privlači samo neke metale: željezo, čelik (koji je većinom željezo), nikal i kobalt. Bakar i aluminij su metali i dobro vode struju, ali nisu magnetični.' }
      },
      {
        q: { en: 'Two bar magnets lie in a line and attract each other. You turn one of them around. What happens now?',
          hr: 'Dva štapićasta magneta leže u istoj liniji i privlače se. Jedan od njih okreneš. Što se sada događa?' },
        options: [
          { en: 'They still attract, because magnets always pull each other', hr: 'I dalje se privlače jer se magneti uvijek privlače' },
          { en: 'Nothing, the force disappears', hr: 'Ništa, sila nestane' },
          { en: 'They repel each other', hr: 'Odbijaju se' }
        ],
        answer: 2,
        try: { en: 'Choose "Field", switch on "Second magnet" and read "Facing poles" and "The magnets". Then press "Flip magnet 2" and read them again.',
          hr: 'Odaberi "Polje", uključi "Drugi magnet" i očitaj "Sučeljeni polovi" i "Magneti se". Zatim pritisni "Okreni magnet 2" i očitaj ponovno.' },
        explain: { en: 'Every magnet has two poles, north (N) and south (S). Unlike poles (N and S) attract, like poles (N and N, or S and S) repel. Turning one magnet around brings two like poles face to face.',
          hr: 'Svaki magnet ima dva pola, sjeverni (N) i južni (S). Raznoimeni polovi (N i S) se privlače, a istoimeni (N i N ili S i S) odbijaju. Okretanjem jednog magneta dva istoimena pola dođu jedan nasuprot drugome.' }
      }
    ],

    // ---------------------------------------------------------------- electromagnet
    electromagnet: [
      {
        q: { en: 'An electromagnet with 20 turns and a current of 1.5 A lifts 3 paperclips. You wind 40 turns and keep the same current. How many paperclips does it lift now?',
          hr: 'Elektromagnet s 20 namotaja i strujom 1,5 A podigne 3 spajalice. Namotaš 40 namotaja uz istu struju. Koliko spajalica sada podigne?' },
        options: [
          { en: 'About 6', hr: 'Oko 6' },
          { en: 'Still 3, because the current is the same', hr: 'I dalje 3 jer je struja ista' },
          { en: 'Fewer than 3, because the extra wire weakens it', hr: 'Manje od 3 jer ga dodatna žica oslabi' }
        ],
        answer: 0,
        try: { en: 'Choose "Coil and nail", set "Current I" to 1.5 A and "Number of turns" to 20 and read "Paperclips lifted". Then move "Number of turns" to 40.',
          hr: 'Odaberi "Zavojnica i čavao", postavi "Struja I" na 1,5 A i "Broj namotaja" na 20 te očitaj "Podignute spajalice". Zatim pomakni "Broj namotaja" na 40.' },
        explain: { en: 'Every turn of wire that carries current adds its own magnetic field. Twice as many turns with the same current give a field about twice as strong, so the nail lifts about twice as many paperclips.',
          hr: 'Svaki namotaj žice kojim teče struja dodaje svoje magnetsko polje. Dvostruko više namotaja uz istu struju daje oko dvostruko jače polje pa čavao podigne oko dvostruko više spajalica.' }
      },
      {
        q: { en: 'An electromagnet with 60 turns and a current of 3 A lifts 18 paperclips. You pull the iron nail out of the coil. What happens?',
          hr: 'Elektromagnet sa 60 namotaja i strujom 3 A podigne 18 spajalica. Izvučeš željezni čavao iz zavojnice. Što se događa?' },
        options: [
          { en: 'Nothing changes, because the current makes the field', hr: 'Ništa se ne mijenja jer polje stvara struja' },
          { en: 'It lifts a few paperclips fewer', hr: 'Podigne nekoliko spajalica manje' },
          { en: 'It lifts almost none', hr: 'Ne podigne gotovo nijednu' }
        ],
        answer: 2,
        try: { en: 'Set "Current I" to 3 A and "Number of turns" to 60 and read "Paperclips lifted". Then switch off "Iron core (nail)" and watch "Field strength (relative)".',
          hr: 'Postavi "Struja I" na 3 A i "Broj namotaja" na 60 te očitaj "Podignute spajalice". Zatim isključi "Željezna jezgra (čavao)" i prati "Jakost polja (relativno)".' },
        explain: { en: 'The current does create the field, but the iron core becomes a magnet itself and strengthens that field many times. Without the core the bare coil is about 20 times weaker.',
          hr: 'Polje doista stvara struja, ali željezna jezgra i sama postane magnet i to polje višestruko pojača. Bez jezgre sama je zavojnica oko 20 puta slabija.' }
      }
    ],

    // ---------------------------------------------------------------- waves
    waves: [
      {
        q: { en: 'You shake the end of a rope twice as fast (2 Hz instead of 1 Hz) without changing its tension. What happens to the waves?',
          hr: 'Kraj užeta treseš dvostruko brže (2 Hz umjesto 1 Hz), a napetost ne mijenjaš. Što se događa s valovima?' },
        options: [
          { en: 'They travel along the rope twice as fast', hr: 'Putuju užetom dvostruko brže' },
          { en: 'They become half as long, and their speed stays the same', hr: 'Postanu upola kraći, a brzina im ostane ista' },
          { en: 'They become twice as long', hr: 'Postanu dvostruko dulji' }
        ],
        answer: 1,
        try: { en: 'Choose "Oscillate", set "Frequency f" to 1 Hz, press "Play" and read "Wave speed v" and "Wavelength λ = v / f". Then set "Frequency f" to 2 Hz and read them again.',
          hr: 'Odaberi "Titranje", postavi "Frekvencija f" na 1 Hz, pritisni "Pokreni" i očitaj "Brzina vala v" i "Valna duljina λ = v / f". Zatim postavi "Frekvencija f" na 2 Hz i očitaj ponovno.' },
        explain: { en: 'The speed of a wave is set by the rope (its tension), not by how fast the hand shakes. Shaking faster only sends the crests closer together: λ = v / f, so twice the frequency gives half the wavelength.',
          hr: 'Brzinu vala određuje uže (njegova napetost), a ne brzina kojom ruka trese. Bržim trešenjem brjegovi vala samo dolaze gušće jedan za drugim: λ = v / f, pa dvostruka frekvencija daje upola manju valnu duljinu.' }
      },
      {
        q: { en: 'Waves travel along a rope from left to right. What does the big bead fixed on the rope at 3 m do?',
          hr: 'Valovi putuju užetom slijeva nadesno. Što radi velika kuglica pričvršćena na uže na 3 m?' },
        options: [
          { en: 'It only moves up and down in the same place', hr: 'Giba se samo gore-dolje na istom mjestu' },
          { en: 'It travels to the right together with the wave', hr: 'Putuje udesno zajedno s valom' },
          { en: 'It stays completely still', hr: 'Potpuno miruje' }
        ],
        answer: 0,
        try: { en: 'Choose "Oscillate", press "Play" and keep your eye on the big bead at 3 m while several waves pass. Then try "Pulse" and press "Send pulse".',
          hr: 'Odaberi "Titranje", pritisni "Pokreni" i prati veliku kuglicu na 3 m dok prođe nekoliko valova. Zatim probaj "Puls" i pritisni "Pošalji puls".' },
        explain: { en: 'A wave carries energy along the rope, but not the material of the rope. Each piece of rope only swings up and down around its own place and passes the motion on to its neighbour.',
          hr: 'Val užetom prenosi energiju, ali ne i tvar od koje je uže. Svaki dio užeta samo titra gore-dolje oko svojeg mjesta i predaje gibanje susjednom dijelu.' }
      }
    ],

    // ---------------------------------------------------------------- sound
    sound: [
      {
        q: { en: 'Sound can travel through air, water and steel. In which of them is it fastest?',
          hr: 'Zvuk se može širiti zrakom, vodom i čelikom. U kojem je od njih najbrži?' },
        options: [
          { en: 'In air, because nothing stands in its way', hr: 'U zraku jer mu ništa ne smeta' },
          { en: 'In water', hr: 'U vodi' },
          { en: 'In steel', hr: 'U čeliku' }
        ],
        answer: 2,
        try: { en: 'Choose "Waves" and set "Medium" to "Air (343 m/s)", then "Water (1480 m/s)", then "Steel (5900 m/s)". Each time read "Speed of sound v" and watch the wavelength.',
          hr: 'Odaberi "Valovi" i postavi "Sredstvo" na "Zrak (343 m/s)", zatim "Voda (1480 m/s)", zatim "Čelik (5900 m/s)". Svaki put očitaj "Brzina zvuka v" i prati valnu duljinu.' },
        explain: { en: 'Sound is a vibration handed on from particle to particle. In solids and liquids the particles are close together and strongly linked, so they pass the vibration on much faster than the far-apart particles of air.',
          hr: 'Zvuk je titranje koje se prenosi s čestice na česticu. U čvrstim tijelima i tekućinama čestice su blizu i čvrsto povezane pa titranje prenose mnogo brže nego međusobno udaljene čestice zraka.' }
      },
      {
        q: { en: 'You shout towards a cliff 170 m away. Sound travels 343 m every second in air. After about how long do you hear the echo?',
          hr: 'Vikneš prema stijeni udaljenoj 170 m. Zvuk u zraku svake sekunde prijeđe 343 m. Nakon koliko otprilike vremena čuješ jeku?' },
        options: [
          { en: 'After about 0.5 s', hr: 'Nakon oko 0,5 s' },
          { en: 'After about 1 s', hr: 'Nakon oko 1 s' },
          { en: 'After about 2 s', hr: 'Nakon oko 2 s' }
        ],
        answer: 1,
        try: { en: 'Choose "Echo", set "Distance to the cliff d" to 170 m and press "Shout!". Read "Stopwatch" when the echo returns. Then try 340 m.',
          hr: 'Odaberi "Jeka", postavi "Udaljenost do stijene d" na 170 m i pritisni "Vikni!". Očitaj "Štoperica" kad se jeka vrati. Zatim probaj 340 m.' },
        explain: { en: 'The sound has to travel to the cliff and back, so it covers 2 · 170 m = 340 m, which takes about 1 s. Half a second is only the one-way trip to the cliff.',
          hr: 'Zvuk mora prijeći put do stijene i natrag, dakle 2 · 170 m = 340 m, za što mu treba oko 1 s. Pola sekunde traje samo put u jednom smjeru, do stijene.' }
      }
    ],

    // ---------------------------------------------------------------- light
    light: [
      {
        q: { en: 'A light ray hits a flat mirror at an angle of incidence of 30° (measured from the normal). How does it leave the mirror?',
          hr: 'Zraka svjetlosti pada na ravno zrcalo pod upadnim kutom 30° (mjereno od okomice). Kako se odbije od zrcala?' },
        options: [
          { en: 'Straight back along the path it came', hr: 'Ravno natrag istim putem kojim je došla' },
          { en: 'At 60° on the other side of the normal', hr: 'Pod kutom 60° s druge strane okomice' },
          { en: 'At 30° on the other side of the normal', hr: 'Pod kutom 30° s druge strane okomice' }
        ],
        answer: 2,
        try: { en: 'Choose "Mirror" and drag the flashlight until "Angle of incidence α" shows 30°. Read "Angle of reflection β". Then try other angles.',
          hr: 'Odaberi "Zrcalo" i povlači svjetiljku dok "Upadni kut α" ne pokaže 30°. Očitaj "Kut odbijanja β". Zatim probaj druge kutove.' },
        explain: { en: 'Law of reflection: the angle of reflection always equals the angle of incidence, both measured from the normal. A ray returns along its own path only when it hits the mirror at right angles (0°).',
          hr: 'Zakon odbijanja: kut odbijanja uvijek je jednak upadnom kutu, a oba se mjere od okomice. Zraka se vraća istim putem samo kad na zrcalo padne okomito (0°).' }
      },
      {
        q: { en: 'A light ray goes from air into water at an angle of 40° to the normal. What happens at the surface?',
          hr: 'Zraka svjetlosti prelazi iz zraka u vodu pod kutom 40° prema okomici. Što se događa na površini?' },
        options: [
          { en: 'It bends towards the normal and goes down more steeply', hr: 'Lomi se prema okomici i nastavlja strmije prema dolje' },
          { en: 'It goes straight on, because water is transparent', hr: 'Nastavlja ravno jer je voda prozirna' },
          { en: 'It bends away from the normal and goes on flatter', hr: 'Lomi se od okomice i nastavlja položenije' }
        ],
        answer: 0,
        try: { en: 'Choose "Refraction", set "Lower medium" to "Water (n = 1.33)" and "Angle of incidence θ₁" to 40°. Read "Angle of refraction θ₂". Then try "Glass (n = 1.5)".',
          hr: 'Odaberi "Lom svjetlosti", postavi "Donje sredstvo" na "Voda (n = 1,33)" i "Upadni kut θ₁" na 40°. Očitaj "Kut loma θ₂". Zatim probaj "Staklo (n = 1,5)".' },
        explain: { en: 'Light travels more slowly in water than in air, so the ray changes direction at the surface: it bends towards the normal (from 40° to about 29°). Only a ray that hits the surface at right angles goes straight on.',
          hr: 'Svjetlost je u vodi sporija nego u zraku pa zraka na površini mijenja smjer: lomi se prema okomici (s 40° na oko 29°). Ravno nastavlja samo zraka koja na površinu padne okomito.' }
      }
    ],

    // ---------------------------------------------------------------- color
    color: [
      {
        q: { en: 'A red spotlight and a green spotlight shine on the same spot of a white wall in a dark room. What colour is that spot?',
          hr: 'Crveni i zeleni reflektor obasjavaju isto mjesto na bijelom zidu u tamnoj sobi. Koje je boje to mjesto?' },
        options: [
          { en: 'Brown, as when paints are mixed', hr: 'Smeđe, kao kad se pomiješaju boje za slikanje' },
          { en: 'Yellow', hr: 'Žute' },
          { en: 'Black, because the colours cancel', hr: 'Crne jer se boje ponište' }
        ],
        answer: 1,
        try: { en: 'Choose "Lights", set "Red light" and "Green light" to 100 % and "Blue light" to 0 %. Read "Colour name" for the middle. Then turn the blue light up as well.',
          hr: 'Odaberi "Svjetla", postavi "Crveno svjetlo" i "Zeleno svjetlo" na 100 %, a "Plavo svjetlo" na 0 %. Očitaj "Naziv boje" za sredinu. Zatim pojačaj i plavo svjetlo.' },
        explain: { en: 'Lights add up: the wall sends both red and green light to your eye, and together we see them as yellow. Paints behave differently, because each paint takes some of the light away.',
          hr: 'Svjetla se zbrajaju: zid u oko šalje i crvenu i zelenu svjetlost, a zajedno ih vidimo kao žutu. Boje za slikanje ponašaju se drukčije jer svaka od njih dio svjetlosti oduzima.' }
      },
      {
        q: { en: 'In a dark room you shine pure green light on a red apple. What colour does the apple appear?',
          hr: 'U tamnoj sobi crvenu jabuku obasjaš čistom zelenom svjetlošću. Koje boje izgleda jabuka?' },
        options: [
          { en: 'Almost black', hr: 'Gotovo crne' },
          { en: 'Red, because the apple is red', hr: 'Crvene jer je jabuka crvena' },
          { en: 'Yellow, because red and green mix', hr: 'Žute jer se crvena i zelena pomiješaju' }
        ],
        answer: 0,
        try: { en: 'Choose "Coloured light on objects" and set "Light colour" to "Green light". Look at the red apple, then try "Red light" and "White light".',
          hr: 'Odaberi "Obojena svjetlost na predmetima" i postavi "Boja svjetlosti" na "Zelena svjetlost". Pogledaj crvenu jabuku, zatim probaj "Crvena svjetlost" i "Bijela svjetlost".' },
        explain: { en: 'An object has no light of its own: a red apple looks red because it reflects red light and absorbs the rest. Green light contains no red to reflect, so almost nothing reaches your eye and the apple looks black.',
          hr: 'Predmet nema vlastitu svjetlost: crvena jabuka izgleda crveno jer odbija crvenu svjetlost, a ostalu upija. U zelenoj svjetlosti nema crvene koju bi odbila, pa do oka ne dolazi gotovo ništa i jabuka izgleda crno.' }
      }
    ]
  });
})();
