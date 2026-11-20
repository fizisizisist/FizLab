/* FizLab content: "Predict first" prompts for the mechanics simulations orbits, projectile and collisions.
   Schema: js/content/_predictions_schema.md */
(function () {
  'use strict';
  window.Content.registerPredictions({

    // ---------------------------------------------------------------- orbits
    orbits: [
      {
        q: { en: 'From the top of a very high mountain, with no air, a cannon fires a ball sideways at 7.7 km/s. What happens to the ball?',
          hr: 'Top na vrhu vrlo visoke planine (zamisli da nema zraka) ispali kuglu vodoravno brzinom 7,7 km/s. Što će se dogoditi s kuglom?' },
        options: [
          { en: 'It flies off in a straight line into space, because it is so fast', hr: 'Odleti ravno u svemir jer je tako brza' },
          { en: 'It still falls back to the ground, only very far away', hr: 'Ipak padne natrag na tlo, samo vrlo daleko' },
          { en: 'It keeps falling towards the Earth but always misses it: it orbits', hr: 'Stalno pada prema Zemlji, ali je uvijek promaši: kruži oko nje' }
        ],
        answer: 2,
        try: { en: 'Choose "Newton\'s cannon" and press "Fire!" with "Launch speed" at 4, 6 and 7 km/s. Then set 7.7 km/s and press "Fire!" again. Compare the paths.',
          hr: 'Odaberi „Newtonov top“ i redom pritisni „Ispali!“ uz „Brzina ispaljivanja“ od 4, 6 i 7 km/s. Zatim postavi 7,7 km/s i ponovno pritisni „Ispali!“. Usporedi putanje.' },
        explain: { en: 'Gravity pulls the ball towards the centre of the Earth all the time, so it is always falling. At 7.7 km/s it moves sideways so fast that the curved ground drops away beneath it as fast as it falls, so it never lands. This is an orbit; every satellite stays up this way.',
          hr: 'Gravitacija cijelo vrijeme vuče kuglu prema središtu Zemlje pa ona stalno pada. Pri brzini 7,7 km/s kugla se vodoravno giba tako brzo da se zakrivljena površina Zemlje ispod nje spušta jednako brzo kao što ona pada pa nikad ne dotakne tlo. Tako kugla kruži u orbiti, a na isti se način u orbiti održava svaki satelit.' }
      },
      {
        q: { en: 'Astronauts float inside the space station (ISS), 400 km above the ground. How strong is gravity up there compared with on the ground?',
          hr: 'Astronauti lebde u svemirskoj postaji (ISS) 400 km iznad tla. Kolika je ondje gravitacija u usporedbi s onom na tlu?' },
        options: [
          { en: 'Zero, because there is no gravity in space', hr: 'Nula jer u svemiru nema gravitacije' },
          { en: 'Still about 90 % of its value on the ground', hr: 'I dalje oko 90 % vrijednosti na tlu' },
          { en: 'Only about 10 %: a tiny bit is left', hr: 'Samo oko 10 %: ostalo je tek malo' }
        ],
        answer: 1,
        try: { en: 'Choose "Satellites" and press "ISS 400 km". Read "Gravity there g = G·M/r²" and "Compared with the ground (9.81 m/s²)". Then press "GEO 35 786 km" and compare.',
          hr: 'Odaberi „Sateliti“ i pritisni „ISS 400 km“. Očitaj „g na toj visini = G·M/r²“ i „U odnosu na tlo (9,81 m/s²)“. Zatim pritisni „GEO 35 786 km“ i usporedi.' },
        explain: { en: '400 km is very little compared with the radius of the Earth (6371 km), so gravity there is still about 89 %, about 8.7 m/s². Astronauts float because they and the station are falling around the Earth together (weightlessness), not because gravity is gone.',
          hr: '400 km vrlo je malo u usporedbi sa Zemljinim polumjerom (6371 km) pa ondje gravitacija iznosi još oko 89 % vrijednosti na tlu, oko 8,7 m/s². Astronauti lebde jer zajedno s postajom padaju oko Zemlje (bestežinsko stanje), a ne zato što gravitacije nema.' }
      }
    ],

    // ---------------------------------------------------------------- projectile
    projectile: [
      {
        q: { en: 'From a height of 20 m one ball is dropped and, at the same moment, another ball is thrown sideways at 10 m/s. Which one lands first?',
          hr: 'S visine 20 m jednu kuglicu pustimo, a u istom trenutku drugu bacimo vodoravno brzinom 10 m/s. Koja prva padne na tlo?' },
        options: [
          { en: 'They land at the same moment', hr: 'Padnu u istom trenutku' },
          { en: 'The dropped ball, because its path is shorter', hr: 'Puštena kuglica jer joj je put kraći' },
          { en: 'The thrown ball, because it moves faster', hr: 'Bačena kuglica jer se brže giba' }
        ],
        answer: 0,
        try: { en: 'Choose "Drop and throw", set "Height h" to 20 m and "Throwing speed v₀" to 10 m/s, press "Drop and throw!" and watch the dashed lines and "Time". Repeat with 20 m/s.',
          hr: 'Odaberi „Pusti i baci“, postavi „Visina h“ na 20 m i „Brzina bacanja v₀“ na 10 m/s, pritisni „Pusti i baci!“ i prati crtkane crte i „Vrijeme“. Ponovi s brzinom 20 m/s.' },
        explain: { en: 'The sideways speed does not change the falling. Downwards both balls start from zero and speed up in exactly the same way, so they are always at the same height and land together after about 2 s. The thrown ball only lands farther away.',
          hr: 'Vodoravna brzina ne utječe na padanje. U okomitom smjeru obje kuglice kreću od brzine nula i potpuno jednako ubrzavaju pa su uvijek na istoj visini i padnu zajedno, nakon oko 2 s. Bačena kuglica samo padne dalje.' }
      },
      {
        q: { en: 'A cannon on level ground, with no air, fires two balls at the same speed of 25 m/s: one at 30°, the other at 60°. Which one lands farther away?',
          hr: 'Top na ravnom tlu, bez otpora zraka, ispali dvije kugle istom brzinom 25 m/s: jednu pod kutom 30°, a drugu pod 60°. Koja padne dalje?' },
        options: [
          { en: 'The 60° ball, because it flies higher and longer', hr: 'Kugla pod 60° jer leti više i dulje' },
          { en: 'The 30° ball, because it is aimed more forward', hr: 'Kugla pod 30° jer je usmjerena više prema naprijed' },
          { en: 'They land at the same spot', hr: 'Padnu na isto mjesto' }
        ],
        answer: 2,
        try: { en: 'Choose "Cannon", keep "Air resistance" off and "Launch height" at 0 m, and set "Launch speed v₀" to 25 m/s. Press "Fire!" with "Angle" at 30°, then at 60°, and compare "Range".',
          hr: 'Odaberi „Kosi hitac“, ostavi „Otpor zraka“ isključen i „Početna visina“ na 0 m te postavi „Početna brzina v₀“ na 25 m/s. Pritisni „Ispali!“ uz „Kut“ 30°, zatim 60°, i usporedi „Domet“.' },
        explain: { en: 'The 60° ball stays in the air longer but moves forward more slowly; the 30° ball moves forward faster but lands sooner. The two effects balance exactly, so both reach about 55 m. Angles that add up to 90° give the same range, and 45° gives the longest.',
          hr: 'Kugla pod 60° dulje je u zraku, ali se sporije giba prema naprijed; kugla pod 30° brže se giba prema naprijed, ali prije padne. Ta se dva učinka točno poništavaju pa obje dolete do oko 55 m. Kutovi koji zajedno čine 90° daju jednak domet, a najveći domet daje kut od 45°.' }
      }
    ],

    // ---------------------------------------------------------------- collisions
    collisions: [
      {
        q: { en: 'Cart 1 (1 kg) rolls at 3 m/s into cart 2 (1 kg), which stands still. The collision is perfectly elastic. What happens?',
          hr: 'Kolica 1 (1 kg) brzinom 3 m/s udare u kolica 2 (1 kg) koja miruju. Sudar je savršeno elastičan. Što će se dogoditi?' },
        options: [
          { en: 'Both carts roll on together at 1.5 m/s', hr: 'Oboja kolica nastave zajedno brzinom 1,5 m/s' },
          { en: 'Cart 1 stops and cart 2 rolls on at 3 m/s', hr: 'Kolica 1 stanu, a kolica 2 nastave brzinom 3 m/s' },
          { en: 'Cart 1 bounces back and cart 2 moves off slowly', hr: 'Kolica 1 odskoče unatrag, a kolica 2 polako krenu naprijed' }
        ],
        answer: 1,
        try: { en: 'Choose "Two carts", set "Ready-made collisions" to "Equal masses, elastic" and press "Play". Read "Cart 1 after: v₁′" and "Cart 2 after: v₂′" and compare the momentum bars.',
          hr: 'Odaberi „Dvoja kolica“, postavi „Gotovi primjeri sudara“ na „Jednake mase, elastičan sudar“ i pritisni „Pokreni“. Očitaj „Kolica 1 poslije: v₁′“ i „Kolica 2 poslije: v₂′“ i usporedi stupce količine gibanja.' },
        explain: { en: 'In an elastic collision both the momentum and the kinetic energy must be the same before and after. With equal masses that works only if the carts swap velocities. Rolling on together at 1.5 m/s would keep the momentum but lose half of the kinetic energy.',
          hr: 'U elastičnom sudaru i količina gibanja i kinetička energija moraju biti jednake prije sudara i poslije njega. Uz jednake mase to je moguće samo ako kolica zamijene brzine. Kad bi se kolica nastavila gibati zajedno brzinom 1,5 m/s, količina gibanja bila bi očuvana, ali bi se izgubila polovica kinetičke energije.' }
      },
      {
        q: { en: 'In Newton\'s cradle you pull back the two balls on the left and let them go. What happens on the right?',
          hr: 'Na Newtonovu njihalu podigneš dvije lijeve kuglice i pustiš ih. Što se događa na desnoj strani?' },
        options: [
          { en: 'Two balls swing out, as fast as the two that hit', hr: 'Odskoče dvije kuglice, jednako brzo kao dvije koje su udarile' },
          { en: 'One ball swings out, twice as fast', hr: 'Odskoči jedna kuglica, dvostruko brže' },
          { en: 'All the balls move off slowly together', hr: 'Sve kuglice zajedno polako krenu' }
        ],
        answer: 0,
        try: { en: 'Choose "Newton\'s cradle", set "Balls to pull back" to 2 and press "Let go!". Watch "Balls up on the right". Switch on "Slow motion" to see the hit clearly.',
          hr: 'Odaberi „Newtonovo njihalo“, postavi „Broj podignutih kuglica“ na 2 i pritisni „Pusti!“. Prati očitanje „Podignute kuglice desno“. Uključi „Usporeno“ da bolje vidiš udarac.' },
        explain: { en: 'Two balls leaving at the same speed carry away exactly the momentum and the kinetic energy that came in. One ball at twice the speed would have the same momentum but twice the kinetic energy, and that extra energy cannot appear from nowhere.',
          hr: 'Dvije kuglice koje odskoče istom brzinom odnose točno onoliko količine gibanja i kinetičke energije koliko su donijele kuglice koje su udarile. Jedna kuglica dvostruke brzine imala bi istu količinu gibanja, ali dvostruko veću kinetičku energiju, a ta dodatna energija ne može nastati ni iz čega.' }
      }
    ]
  });
})();
