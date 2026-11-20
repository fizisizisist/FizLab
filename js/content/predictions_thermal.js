/* FizLab content: "Predict first" prompts for the thermal simulations gas, expansion and heatingcurve.
   Schema: js/content/_predictions_schema.md */
(function () {
  'use strict';
  window.Content.registerPredictions({

    // ---------------------------------------------------------------- gas
    gas: [
      {
        q: { en: 'The gas in the box has a volume of 1 L and a pressure of 100 kPa. You push the piston in until the volume is 0.5 L, keeping the temperature the same. What is the pressure now?',
          hr: 'Plin u posudi ima obujam 1 L i tlak 100 kPa. Uguraš klip tako da obujam bude 0,5 L, a temperatura ostane ista. Koliki je sada tlak?' },
        options: [
          { en: 'About 50 kPa: it halves, just like the volume', hr: 'Oko 50 kPa: prepolovi se, kao i obujam' },
          { en: '100 kPa, because the amount of gas has not changed', hr: '100 kPa jer se količina plina nije promijenila' },
          { en: 'About 200 kPa: it doubles', hr: 'Oko 200 kPa: udvostruči se' }
        ],
        answer: 2,
        try: { en: 'Choose "Squeeze" and read "Pressure p (measured)" at 1 L. Then move "Volume (move the piston)" to 0.5 L, wait for the gauge to settle and read it again. Press "Record" each time to plot the points.',
          hr: 'Odaberi „Stisni“ i očitaj „Tlak p (izmjeren)“ pri 1 L. Zatim pomakni „Obujam (pomakni klip)“ na 0,5 L, pričekaj da se kazaljka manometra smiri i ponovno očitaj tlak. Svaki put pritisni „Zabilježi“ da se točka ucrta u graf.' },
        explain: { en: 'In half the space each particle reaches a wall twice as often, so the walls get twice as many hits every second and the pressure doubles. At constant temperature p·V stays the same: 100 kPa · 1 L = 200 kPa · 0.5 L.',
          hr: 'U upola manjem prostoru svaka čestica dvostruko češće udari o stijenku pa stijenke svake sekunde prime dvostruko više udaraca i tlak se udvostruči. Pri stalnoj temperaturi umnožak p·V ostaje isti: 100 kPa · 1 L = 200 kPa · 0,5 L.' }
      },
      {
        q: { en: 'The piston is locked, so the volume cannot change. The gas is heated from 300 K to 600 K and no particles are added. What happens to the pressure?',
          hr: 'Klip je učvršćen pa se obujam ne može mijenjati. Plin zagrijemo s 300 K na 600 K, a čestice ne dodajemo. Što se događa s tlakom?' },
        options: [
          { en: 'It doubles: faster particles hit the walls harder and more often', hr: 'Udvostruči se: brže čestice jače i češće udaraju o stijenke' },
          { en: 'It stays the same, because the number of particles and the volume are unchanged', hr: 'Ostaje isti jer se broj čestica i obujam ne mijenjaju' },
          { en: 'It rises, because each particle swells and needs more room', hr: 'Raste jer svaka čestica nabubri i treba više mjesta' }
        ],
        answer: 0,
        try: { en: 'Choose "Heat it" and read "Pressure p (measured)" at 300 K. Then move "Temperature (heater / cooler)" to 600 K, watch how the particles move and read the pressure again.',
          hr: 'Odaberi „Zagrij“ i očitaj „Tlak p (izmjeren)“ pri 300 K. Zatim pomakni „Temperatura (grijač / hladilo)“ na 600 K, prati kako se čestice gibaju i ponovno očitaj tlak.' },
        explain: { en: 'The particles do not grow, they get faster. A faster particle hits a wall harder and reaches it more often, so at constant volume the pressure grows in step with the temperature in kelvin: twice the kelvin temperature, twice the pressure.',
          hr: 'Čestice ne postaju veće, nego brže. Brža čestica jače udari o stijenku i češće do nje stigne pa pri stalnom obujmu tlak raste razmjerno temperaturi u kelvinima: dvostruko viša temperatura u kelvinima, dvostruko veći tlak.' }
      }
    ],

    // ---------------------------------------------------------------- expansion
    expansion: [
      {
        q: { en: 'A brass ball only just fits through a brass ring. You heat the ball and now it gets stuck. Then you heat the ring as well. What happens to the hole in the ring?',
          hr: 'Mjedena kuglica jedva prolazi kroz mjedeni prsten. Zagriješ kuglicu i ona zapne. Zatim zagriješ i prsten. Što se događa s otvorom prstena?' },
        options: [
          { en: 'It gets smaller, because the metal swells into the hole', hr: 'Smanji se jer se metal širi prema otvoru' },
          { en: 'It gets bigger, and the hot ball passes again', hr: 'Poveća se pa vruća kuglica opet prolazi' },
          { en: 'It stays the same; only the outside of the ring grows', hr: 'Ostaje isti; raste samo vanjski rub prstena' }
        ],
        answer: 1,
        try: { en: 'Choose "Ball and ring". Press "Heat the ball", wait two seconds and press "Try!". Then press "Heat the ring", wait again and press "Try!". Compare "Ball diameter" and "Hole in the ring".',
          hr: 'Odaberi „Kuglica i prsten“. Pritisni „Zagrij kuglicu“, pričekaj dvije sekunde i pritisni „Probaj!“. Zatim pritisni „Zagrij prsten“, opet pričekaj i pritisni „Probaj!“. Usporedi „Promjer kuglice“ i „Otvor prstena“.' },
        explain: { en: 'When the ring is heated, every part of it grows by the same fraction, like an enlarged photo, so the hole grows exactly as if it were filled with brass. That is why a tight metal lid comes loose under hot water.',
          hr: 'Kad se prsten zagrije, svaki njegov dio naraste u istom omjeru, kao povećana fotografija, pa se otvor širi točno kao da je ispunjen mjedi. Zato se metalni poklopac staklenke koji je zapeo lakše odvrne kad ga stavimo pod vruću vodu.' }
      },
      {
        q: { en: 'A bimetal strip is made of steel on top and copper underneath, firmly bonded together. Copper expands more than steel. Which way does the strip bend when it is heated to 150 °C?',
          hr: 'Bimetalna traka sastoji se od dvaju čvrsto spojenih slojeva: gore je čelik, a dolje bakar. Bakar se pri zagrijavanju širi više od čelika. Na koju se stranu traka savije kad je zagrijemo na 150 °C?' },
        options: [
          { en: 'Down, towards the copper, because copper expands more', hr: 'Prema dolje, prema bakru, jer se bakar više širi' },
          { en: 'It does not bend; it only gets a little longer', hr: 'Ne savija se; samo se malo produlji' },
          { en: 'Up, towards the steel', hr: 'Prema gore, prema čeliku' }
        ],
        answer: 2,
        try: { en: 'Choose "Bimetal strip", set "Two metals (top + bottom)" to "Steel + copper" and move "Temperature of the strip" to 150 °C. Read "Bends toward". Then move the slider to −20 °C.',
          hr: 'Odaberi „Bimetalna traka“, postavi „Dva metala (gornji + donji)“ na „Čelik + bakar“ i pomakni „Temperatura trake“ na 150 °C. Očitaj „Savija se prema“. Zatim pomakni klizač na −20 °C.' },
        explain: { en: 'The copper layer becomes longer than the steel layer, but the two cannot slide apart, so the strip curves with the longer copper on the outside of the bend: towards the steel. Cooled below room temperature, it bends the other way.',
          hr: 'Bakreni sloj postane dulji od čeličnoga, ali slojevi ne mogu kliziti jedan po drugome pa se traka savije tako da je dulji bakar s vanjske strane luka: prema čeliku. Kad se ohladi ispod sobne temperature, traka se savija na suprotnu stranu.' }
      }
    ],

    // ---------------------------------------------------------------- heatingcurve
    heatingcurve: [
      {
        q: { en: 'Half a kilogram of ice at −20 °C sits on a 1000 W heater. At 0 °C the ice starts to melt. What does the thermometer show while the ice is melting?',
          hr: 'Pola kilograma leda temperature −20 °C stoji na grijaču snage 1000 W. Pri 0 °C led se počne taliti. Što pokazuje termometar dok se led tali?' },
        options: [
          { en: 'It stays at 0 °C until all the ice has melted', hr: 'Ostaje na 0 °C dok se sav led ne rastali' },
          { en: 'It keeps rising steadily, because the heater is still on', hr: 'Jednoliko raste i dalje jer grijač još radi' },
          { en: 'It drops, because melting ice cools everything down', hr: 'Pada jer led koji se tali hladi sve oko sebe' }
        ],
        answer: 0,
        try: { en: 'Choose "Heating curve", keep "Mass of the ice" at 0.5 kg and "Heater power" at 1000 W, set "Time speed" to 10× and press "Play". Watch "Temperature", "State" and the graph.',
          hr: 'Odaberi „Krivulja zagrijavanja“, ostavi „Masa leda“ na 0,5 kg i „Snaga grijača“ na 1000 W, postavi „Brzina simulacije“ na 10× i pritisni „Pokreni“. Prati „Temperatura“, „Agregacijsko stanje“ i graf.' },
        explain: { en: 'While the ice melts, all the energy from the heater is used to break the bonds that hold the particles in the crystal, not to make them move faster. So the temperature stays at the melting point, 0 °C, until the last bit of ice is gone; only then does it rise again.',
          hr: 'Dok se led tali, sva se energija grijača troši na kidanje veza koje drže čestice u kristalu, a ne na njihovo brže gibanje. Zato temperatura ostaje na talištu, 0 °C, dok se ne rastali i posljednji komadić leda; tek tada ponovno raste.' }
      },
      {
        q: { en: 'You pour 0.2 kg of hot water at 90 °C into 0.6 kg of cold water at 10 °C. What is the temperature of the mixture?',
          hr: 'U 0,6 kg hladne vode temperature 10 °C uliješ 0,2 kg tople vode temperature 90 °C. Kolika je temperatura smjese?' },
        options: [
          { en: '50 °C, exactly halfway between 90 °C and 10 °C', hr: '50 °C, točno na sredini između 90 °C i 10 °C' },
          { en: '30 °C, closer to the cold water', hr: '30 °C, bliže hladnoj vodi' },
          { en: 'About 70 °C, because the hot water is stronger', hr: 'Oko 70 °C jer je topla voda jača' }
        ],
        answer: 1,
        try: { en: 'Choose "Mixing water", set "Hot water: mass m₁" to 0.2 kg, "Hot water: temperature T₁" to 90 °C, "Cold water: mass m₂" to 0.6 kg and "Cold water: temperature T₂" to 10 °C. Press "Pour together" and read "Temperature of the mixture".',
          hr: 'Odaberi „Miješanje vode“, postavi „Topla voda: masa m₁“ na 0,2 kg, „Topla voda: temperatura T₁“ na 90 °C, „Hladna voda: masa m₂“ na 0,6 kg i „Hladna voda: temperatura T₂“ na 10 °C. Pritisni „Ulij zajedno“ i očitaj „Temperatura smjese“.' },
        explain: { en: 'The hot water gives away exactly as much heat as the cold water takes in. There is three times as much cold water, so it warms by only 20 °C while the hot water cools by 60 °C. The result lies closer to the larger mass: (0.2 · 90 + 0.6 · 10) / 0.8 = 30 °C.',
          hr: 'Topla voda preda točno onoliko topline koliko hladna primi. Hladne vode ima tri puta više pa se zagrije samo za 20 °C, a topla se ohladi za 60 °C. Konačna temperatura bliža je temperaturi vode koje ima više: (0,2 · 90 + 0,6 · 10) / 0,8 = 30 °C.' }
      }
    ]
  });
})();
