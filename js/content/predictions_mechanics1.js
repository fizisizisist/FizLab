/* FizLab content: "Predict first" prompts for the mechanics simulations hydraulics, pulleys, balance and friction.
   Schema: js/content/_predictions_schema.md */
(function () {
  'use strict';
  window.Content.registerPredictions({
    hydraulics: [
      {
        q: { en: 'In a hydraulic lift you push the small piston (2 cm²) with 100 N. The large piston has an area of 100 cm². How big is the force of the oil on the large piston?',
          hr: 'U hidrauličkoj dizalici guraš mali klip (2 cm²) silom od 100 N. Veliki klip ima površinu 100 cm². Kolikom silom ulje gura veliki klip?' },
        options: [
          { en: '100 N, the same force as your push', hr: '100 N, istom silom kojom ti guraš' },
          { en: 'Less than 100 N, the oil loses some force on the way', hr: 'Manjom od 100 N jer ulje putem izgubi dio sile' },
          { en: '5000 N, 50 times bigger', hr: '5000 N, 50 puta većom' }
        ],
        answer: 2,
        try: { en: 'Choose "Hydraulic lift", keep "Small piston area A₁" at 2 cm², "Large piston area A₂" at 100 cm² and "Push force F₁" at 100 N. Read "Force on the large piston F₂".',
          hr: 'Odaberi „Hidraulička dizalica“, ostavi „Površina malog klipa A₁“ na 2 cm², „Površina velikog klipa A₂“ na 100 cm² i „Sila guranja F₁“ na 100 N. Očitaj „Sila na veliki klip F₂“.' },
        explain: { en: 'Your push makes the same pressure everywhere in the oil: p = 100 N / 2 cm² = 500 kPa. The large piston has 50 times the area, so the oil pushes it with 50 times the force, 5000 N. This is Pascal\'s law.',
          hr: 'Sila kojom guraš stvara u ulju tlak koji je posvuda jednak: p = 100 N / 2 cm² = 500 kPa. Veliki klip ima 50 puta veću površinu pa ga ulje gura 50 puta većom silom, 5000 N. To je Pascalov zakon.' }
      },
      {
        q: { en: 'You push the small piston (2 cm²) down by 30 cm. The large piston has 100 cm². How far does the load on the large piston rise?',
          hr: 'Mali klip (2 cm²) spustiš za 30 cm. Veliki klip ima površinu 100 cm². Koliko se podigne teret na velikom klipu?' },
        options: [
          { en: '30 cm, the same as the small piston', hr: '30 cm, jednako kao i mali klip' },
          { en: 'Only 0.6 cm, 50 times less', hr: 'Samo 0,6 cm, 50 puta manje' },
          { en: 'It does not rise, the oil just gets squeezed', hr: 'Ne podigne se jer se ulje samo stisne' }
        ],
        answer: 1,
        try: { en: 'Choose "Hydraulic lift" with the load "Child (30 kg)". Move "Pump: small piston pushed down s₁" to 30 cm and read "Load raised by s₂". Compare "Work in F₁ · s₁" and "Work out F₂ · s₂".',
          hr: 'Odaberi „Hidraulička dizalica“ i teret „Dijete (30 kg)“. Pomakni „Pumpaj: mali klip spušten za s₁“ na 30 cm i očitaj „Teret podignut za s₂“. Usporedi „Uloženi rad F₁ · s₁“ i „Dobiveni rad F₂ · s₂“.' },
        explain: { en: 'The oil pushed out of the small cylinder (2 cm² × 30 cm = 60 cm³) spreads under the 100 cm² piston, so the load rises only 0.6 cm. The force is 50 times bigger but the distance 50 times smaller: the work stays the same.',
          hr: 'Ulje istisnuto iz malog cilindra (2 cm² × 30 cm = 60 cm³) raširi se ispod klipa od 100 cm² pa se teret podigne za samo 0,6 cm. Sila je 50 puta veća, ali je put 50 puta manji: rad ostaje isti.' }
      }
    ],
    pulleys: [
      {
        q: { en: 'A block and tackle with 4 rope segments lets you lift a 20 kg load with a quarter of the force. What happens to the work needed to raise the load by 1 m?',
          hr: 'Koloturnik s četiri nosiva dijela užeta omogućuje da teret od 20 kg podigneš četiri puta manjom silom. Što se događa s radom potrebnim da teret podigneš za 1 m?' },
        options: [
          { en: 'It is 4 times smaller, because the force is 4 times smaller', hr: 'Četiri je puta manji jer je sila četiri puta manja' },
          { en: 'It is 4 times bigger, because you pull 4 m of rope', hr: 'Četiri je puta veći jer povlačiš 4 m užeta' },
          { en: 'It stays the same: a quarter of the force, but 4 times the rope', hr: 'Ostaje isti: četvrtina sile, ali četiri puta više užeta' }
        ],
        answer: 2,
        try: { en: 'Choose "Pulleys" and "Block and tackle (n = 4)". Move "Rope pulled s" to 4 m. Compare "Work in (force × your distance)" with "Work of lifting straight up G · h".',
          hr: 'Odaberi „Koloture“ i „Koloturnik (n = 4)“. Pomakni „Povučeno uže s“ na 4 m. Usporedi „Uloženi rad (sila × tvoj put)“ i „Rad dizanja ravno uvis G · h“.' },
        explain: { en: 'Four rope segments share the load, so you pull with G / 4 = 49 N. But to raise the load by 1 m you must pull 4 m of rope: 49 N × 4 m = 196 J, the same as lifting 196 N straight up by 1 m. Machines save force, never work.',
          hr: 'Teret drže četiri dijela užeta pa vučeš silom G / 4 = 49 N. No da teret podigneš za 1 m, moraš povući 4 m užeta: 49 N × 4 m = 196 J, isto kao kad teret težine 196 N podigneš ravno uvis za 1 m. Jednostavni strojevi štede silu, ali nikad rad.' }
      },
      {
        q: { en: 'You lift a 20 kg load (weight 196 N) with one fixed pulley hanging from a beam. How big a force do you need on the rope?',
          hr: 'Teret od 20 kg (težina 196 N) dižeš jednom nepomičnom koloturom obješenom o gredu. Kolika ti je sila potrebna?' },
        options: [
          { en: 'About 196 N, as big as the weight', hr: 'Oko 196 N, jednako koliko i težina tereta' },
          { en: 'About 98 N, a pulley halves the force', hr: 'Oko 98 N jer kolotura prepolovi silu' },
          { en: 'Almost nothing, the wheel does the work', hr: 'Gotovo nikakva jer sav posao obavi kotač' }
        ],
        answer: 0,
        try: { en: 'Choose "Pulleys" and "One fixed pulley (n = 1)", keep "Mass of the load" at 20 kg and read "Force needed F". Then try "One movable pulley (n = 2)".',
          hr: 'Odaberi „Koloture“ i „Jedna nepomična kolotura (n = 1)“, ostavi „Masa tereta“ na 20 kg i očitaj „Potrebna sila F“. Zatim isprobaj „Jedna pomična kolotura (n = 2)“.' },
        explain: { en: 'A fixed pulley only changes the direction of the force: you pull down instead of lifting up. One rope segment holds the load, so the force equals the weight. Only a movable pulley shares the load between two rope segments.',
          hr: 'Nepomična kolotura samo mijenja smjer sile: vučeš prema dolje umjesto da dižeš prema gore. Teret drži samo jedan dio užeta pa je sila jednaka težini tereta. Tek pomična kolotura raspodjeljuje teret na dva dijela užeta.' }
      }
    ],
    balance: [
      {
        q: { en: 'Where is the centre of mass of a cardboard boomerang, a flat V-shape with two arms?',
          hr: 'Gdje je težište kartonskog bumeranga, plosnatog lika u obliku slova V s dva kraka?' },
        options: [
          { en: 'In the thickest part of the cardboard, where there is most material', hr: 'U najdebljem dijelu kartona, gdje je najviše materijala' },
          { en: 'Outside the cardboard, in the empty space between the arms', hr: 'Izvan kartona, u praznom prostoru između krakova' },
          { en: 'It has none: only symmetric, solid shapes have a centre of mass', hr: 'Nema ga: težište imaju samo simetrični, puni likovi' }
        ],
        answer: 1,
        try: { en: 'Choose "Find the centre of mass" and the shape "Boomerang". Click the cardboard, wait until it hangs still and press "Draw plumb line". Repeat at another point, then switch on "Reveal the true centre of mass".',
          hr: 'Odaberi „Pronađi težište“ i lik „Bumerang“. Klikni na karton, pričekaj da se umiri i pritisni „Ucrtaj visak“. Ponovi za drugu točku, a zatim uključi „Otkrij pravo težište“.' },
        explain: { en: 'Every plumb line passes through the centre of mass, so it lies where the lines cross. For a bent shape like a boomerang that point is in the gap between the arms. The centre of mass is the balance point of all the material, and it does not have to lie on the material.',
          hr: 'Svaka crta viska prolazi kroz težište pa je ono ondje gdje se crte sijeku. Kod savijenog lika kao što je bumerang ta je točka u praznini između krakova. Težište je točka ravnoteže svega materijala i ne mora ležati na samom materijalu.' }
      },
      {
        q: { en: 'A heavy box (1 m wide and 1 m tall) and a light, tall, narrow bottle stand on the same platform. You tilt it slowly. Which one topples at the smaller angle?',
          hr: 'Teška kutija (široka 1 m i visoka 1 m) i lagana, visoka i uska boca stoje na istoj podlozi. Podlogu polako naginješ. Koje se tijelo prevrne pri manjem kutu?' },
        options: [
          { en: 'The heavy box: heavier things tip over first', hr: 'Teška kutija: teža se tijela prije prevrnu' },
          { en: 'Both at the same angle, because the platform is the same', hr: 'Oba tijela pri istom kutu jer je podloga ista' },
          { en: 'The light, tall bottle', hr: 'Lagana, visoka boca' }
        ],
        answer: 2,
        try: { en: 'Choose "Will it topple?". Pick the object "Box" and read "Tipping angle α", then pick "Tall bottle" and read it again. Check with "Tilt of the platform".',
          hr: 'Odaberi „Hoće li se prevrnuti?“. Izaberi tijelo „Kutija“ i očitaj „Kut prevrtanja α“, zatim izaberi „Visoka boca“ i ponovno očitaj kut. Provjeri pomoću klizača „Nagib podloge“.' },
        explain: { en: 'Tipping depends on shape, not on weight: an object topples when the vertical line through its centre of mass passes the edge of its base. The narrow, tall bottle gets there at about 27°, the wide box only at 45°.',
          hr: 'Prevrtanje ovisi o obliku, a ne o težini: tijelo se prevrne kad okomica povučena kroz težište prijeđe rub plohe na kojoj tijelo stoji. Uska i visoka boca do toga dođe već pri oko 27°, a široka kutija tek pri 45°.' }
      }
    ],
    friction: [
      {
        q: { en: 'A wooden block slides steadily across a table, lying on its big flat face. You stand it on its narrow side, so less of it touches the table. What happens to the sliding friction?',
          hr: 'Drveni blok položen na svoju najveću plohu jednoliko kliže po stolu. Postaviš ga na uski bok pa stol dodiruje manja površina bloka. Što se događa s trenjem klizanja?' },
        options: [
          { en: 'It stays the same', hr: 'Ostaje isto' },
          { en: 'It gets smaller: less surface rubs on the table', hr: 'Smanji se: po stolu se tare manja površina' },
          { en: 'It gets bigger: the block digs into the table harder', hr: 'Poveća se: blok se jače utiskuje u stol' }
        ],
        answer: 0,
        try: { en: 'Press "Pull slowly" and wait until the block slides at a steady speed. Read "Friction force", then set "Block position" to "Standing on its side" and read it again.',
          hr: 'Pritisni „Vuci polako“ i pričekaj da blok kliže stalnom brzinom. Očitaj „Sila trenja“, zatim pod „Položaj bloka“ odaberi „Stoji na boku“ i ponovno očitaj silu trenja.' },
        explain: { en: 'Friction depends on how hard the surfaces press together (the normal force) and on the materials, not on the size of the contact area. On a smaller area the same weight presses harder on each square centimetre, and the two effects cancel.',
          hr: 'Trenje ovisi o tome koliko jako plohe pritišću jedna drugu (pritisna sila) i o materijalima, a ne o veličini dodirne površine. Na manjoj površini ista težina jače pritišće svaki kvadratni centimetar pa se ta dva učinka poništavaju.' }
      },
      {
        q: { en: 'You pull a block on wood with a spring scale, harder and harder, until it starts to slide. Then you keep it sliding at a steady speed. How does the scale reading change?',
          hr: 'Vučeš blok po drvu dinamometrom, sve jače i jače, dok ne počne klizati. Zatim ga vučeš tako da kliže stalnom brzinom. Kako se mijenja očitanje dinamometra?' },
        options: [
          { en: 'It stays the same: friction does not change', hr: 'Ostaje isto: trenje se ne mijenja' },
          { en: 'It drops once the block slides', hr: 'Padne kad blok počne klizati' },
          { en: 'It rises: a moving block needs more force', hr: 'Poraste: za blok u gibanju potrebna je veća sila' }
        ],
        answer: 1,
        try: { en: 'In "Surface" choose "Wood on wood" and press "Pull slowly". Watch "Pull (scale reading)" and the graph of the scale reading: find the peak and the level after it.',
          hr: 'Pod „Podloga“ odaberi „Drvo po drvu“ i pritisni „Vuci polako“. Prati „Vučna sila (dinamometar)“ i graf očitanja dinamometra: pronađi najvišu točku i razinu na kojoj se očitanje zatim ustali.' },
        explain: { en: 'At rest the friction grows with your pull up to its largest value, μ_s · F_N = 2.2 N for one block. Once the block slides, the friction is smaller (μ_k · F_N = 1.5 N), so the reading drops. Static friction is bigger than sliding friction.',
          hr: 'Dok blok miruje, trenje raste s tvojom silom do najveće vrijednosti, μ_s · F_N = 2,2 N za jedan blok. Kad blok počne klizati, trenje je manje (μ_k · F_N = 1,5 N) pa očitanje padne. Najveće trenje mirovanja veće je od trenja klizanja.' }
      }
    ]
  });
})();
