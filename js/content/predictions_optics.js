/* FizLab content: "Predict first" prompts for the optics and wave simulations lens, eclipse and ripple.
   Schema: js/content/_predictions_schema.md */
(function () {
  'use strict';
  window.Content.registerPredictions({
    lens: [
      {
        q: { en: 'An object stands 40 cm from a converging lens with a focal length of 15 cm. Its image is real and upside down. You push the object to 9 cm, closer than the focus. What happens to the image?',
          hr: 'Predmet se nalazi 40 cm od sabirne leće žarišne daljine 15 cm. Njegova je slika realna i obrnuta. Primakneš predmet na 9 cm od leće, dakle bliže od žarišta. Što se događa sa slikom?' },
        options: [
          { en: 'It stays upside down and only gets bigger', hr: 'Ostaje obrnuta i samo postaje veća' },
          { en: 'It disappears: so close, a lens makes no image', hr: 'Nestaje: tako blizu leća ne daje sliku' },
          { en: 'It turns upright and magnified, on the same side as the object', hr: 'Postaje uspravna i uvećana, s iste strane leće kao i predmet' }
        ],
        answer: 2,
        try: { en: 'Choose "Converging lens", keep "Focal length f" at 15 cm and move "Object distance a" from 40 cm to 9 cm. Read "Image" and "Magnification m".',
          hr: 'Odaberi „Sabirna leća“, ostavi „Žarišna daljina f“ na 15 cm i pomakni „Udaljenost predmeta a“ s 40 cm na 9 cm. Očitaj „Slika“ i „Povećanje m“.' },
        explain: { en: 'Inside the focus the lens can no longer bring the rays together. They leave spreading out, as if they came from a bigger upright object behind the real one: a virtual image. That is how a magnifying glass works.',
          hr: 'Kad je predmet unutar žarišne daljine, leća više ne može skupiti zrake. One iz leće izlaze razilazeći se, kao da dolaze od većeg uspravnog predmeta iza stvarnoga: to je virtualna slika. Tako radi povećalo.' }
      },
      {
        q: { en: 'A short-sighted person sees distant things blurred. Which glasses make the distant picture sharp?',
          hr: 'Kratkovidna osoba mutno vidi udaljene predmete. S kojim će ih naočalama vidjeti oštro?' },
        options: [
          { en: 'Converging lenses (+), because they magnify', hr: 'Sabirne leće (+) jer povećavaju' },
          { en: 'Diverging lenses (−)', hr: 'Rastresne leće (−)' },
          { en: 'Either kind, only the strength matters', hr: 'Bilo koje, važna je samo jakost' }
        ],
        answer: 1,
        try: { en: 'Choose "The eye", set "Eye" to "Short-sighted" and "Object distance" to "far away". Then try both kinds of "Glasses" with a strength of 2 D and watch "What the eye sees".',
          hr: 'Odaberi „Oko“, postavi „Oko“ na „Kratkovidno“, a „Udaljenost predmeta“ na „daleko“. Zatim pod „Naočale“ isprobaj obje vrste leća jakosti 2 dpt i prati „Što oko vidi“.' },
        explain: { en: 'A short-sighted eye bends light too strongly, so the sharp image forms in front of the retina. A diverging lens spreads the rays a little first, and the image moves back onto the retina. Glasses do not work by magnifying.',
          hr: 'Kratkovidno oko prejako lomi svjetlost pa oštra slika nastaje ispred mrežnice. Rastresna leća najprije malo rasprši zrake pa se slika pomakne natrag na mrežnicu. Naočale ne djeluju povećavanjem.' }
      }
    ],
    eclipse: [
      {
        q: { en: 'A lamp shines on a ball and the ball casts a shadow on a screen. You replace the lamp with a much bigger one at the same place. What happens to the completely dark part of the shadow (the umbra)?',
          hr: 'Lampa obasjava loptu i lopta baca sjenu na zastor. Lampu zamijeniš mnogo većom i postaviš je na isto mjesto. Što se događa s potpuno tamnim dijelom sjene?' },
        options: [
          { en: 'It gets bigger: a bigger lamp makes a bigger shadow', hr: 'Povećava se: veća lampa daje veću sjenu' },
          { en: 'It gets smaller, and a grey half-shadow grows around it', hr: 'Smanjuje se, a oko njega raste siva polusjena' },
          { en: 'It stays the same, it only gets darker', hr: 'Ostaje isti, samo postaje tamniji' }
        ],
        answer: 1,
        try: { en: 'Choose "Shadow and half-shadow" and move "Lamp size" from 0 cm to 40 cm. Watch the readout "Umbra (full shadow) on the screen".',
          hr: 'Odaberi „Sjena i polusjena“ i pomiči „Veličina lampe“ od 0 cm do 40 cm. Prati očitanje „Sjena na zastoru“.' },
        explain: { en: 'The umbra is where no point of the lamp can be seen. A wider lamp peeks around the ball from more directions, so that region shrinks. Around it is the penumbra, lit by only a part of the lamp.',
          hr: 'Potpuna sjena nastaje ondje odakle se ne vidi nijedna točka lampe. Veća lampa svijetli iz više smjerova pa njezina svjetlost dopire dublje iza rubova lopte i to se područje smanjuje. Oko njega je polusjena, koju obasjava samo dio lampe.' }
      },
      {
        q: { en: 'New moon happens about every 29 days. Why is there not a solar eclipse at every new moon?',
          hr: 'Mlađak nastupa otprilike svakih 29 dana. Zašto ne dolazi do pomrčine Sunca pri svakom mlađaku?' },
        options: [
          { en: 'The Moon\'s orbit is tilted, so its shadow usually passes above or below the Earth', hr: 'Mjesečeva je putanja nagnuta pa njegova sjena obično prođe iznad Zemlje ili ispod nje' },
          { en: 'The Moon comes between the Sun and the Earth only twice a year', hr: 'Mjesec dolazi između Sunca i Zemlje samo dvaput godišnje' },
          { en: 'The Moon is usually too far away to cover the Sun', hr: 'Mjesec je obično predaleko da bi prekrio Sunce' }
        ],
        answer: 0,
        try: { en: 'Choose "Why not every month?" and move "New moon: angle from the node" slowly from 60° to 0°. Watch where the Moon\'s shadow goes.',
          hr: 'Odaberi „Zašto ne svakog mjeseca?“ i polako pomiči „Mlađak: kut od čvora“ od 60° do 0°. Prati kamo pada Mjesečeva sjena.' },
        explain: { en: 'The Moon passes between the Sun and the Earth every month, but its orbit is tilted about 5°. Its shadow hits the Earth only when new moon happens near a node, where the two orbits cross.',
          hr: 'Mjesec svakog mjeseca prolazi između Sunca i Zemlje, ali mu je putanja nagnuta za oko 5°. Njegova sjena padne na Zemlju samo kad je mlađak blizu čvora, mjesta gdje se putanje sijeku.' }
      }
    ],
    ripple: [
      {
        q: { en: 'A dipper makes waves on water. You make it dip twice as often: the frequency goes from 2 Hz to 4 Hz. The water stays the same. What changes?',
          hr: 'Izvor koji uranja u vodu stvara valove. Namjestiš ga da uranja dvostruko češće: frekvencija se poveća s 2 Hz na 4 Hz. Voda ostaje ista. Što se mijenja?' },
        options: [
          { en: 'The waves travel twice as fast', hr: 'Valovi putuju dvostruko brže' },
          { en: 'The crests get twice as far apart', hr: 'Brjegovi su dvostruko udaljeniji jedan od drugoga' },
          { en: 'The crests get twice as close; the speed stays the same', hr: 'Brjegovi su dvostruko bliže jedan drugome; brzina ostaje ista' }
        ],
        answer: 2,
        try: { en: 'Choose "One source", set "Frequency f" to 2 Hz and read "Wave speed v" and "Wavelength λ = v / f". Then set 4 Hz and read them again.',
          hr: 'Odaberi „Jedan izvor“, postavi „Frekvencija f“ na 2 Hz i očitaj „Brzina vala v“ i „Valna duljina λ = v / f“. Zatim postavi 4 Hz i ponovno očitaj vrijednosti.' },
        explain: { en: 'The speed of a wave depends on the water, not on the source. Since v = λ · f, twice the frequency at the same speed means half the wavelength.',
          hr: 'Brzina vala ovisi o vodi, a ne o izvoru. Budući da je v = λ · f, dvostruka frekvencija uz istu brzinu znači upola manju valnu duljinu.' }
      },
      {
        q: { en: 'Straight waves reach a wall with a gap in it. When do the waves spread out most behind the wall?',
          hr: 'Ravni valovi nailaze na zid s otvorom. Kada se valovi iza zida najviše šire u stranu?' },
        options: [
          { en: 'When the gap is narrow, about one wavelength wide', hr: 'Kad je otvor uzak, širok otprilike jednu valnu duljinu' },
          { en: 'When the gap is wide, because more of the wave gets through', hr: 'Kad je otvor širok jer tada prolazi veći dio vala' },
          { en: 'Never: behind a wall waves go straight on, like a beam', hr: 'Nikad: iza zida valovi idu ravno, kao snop' }
        ],
        answer: 0,
        try: { en: 'Choose "Wall with a gap", keep "Frequency f" at 3 Hz and compare "Gap width" 8 cm with 24 cm. Look at how far the waves reach sideways behind the wall.',
          hr: 'Odaberi „Zid s otvorom“, ostavi „Frekvencija f“ na 3 Hz i usporedi što se događa kad je „Širina otvora“ 8 cm i kad je 24 cm. Prati koliko se valovi iza zida šire u stranu.' },
        explain: { en: 'This spreading is called diffraction. A gap about one wavelength wide acts like a new point source and sends out circular waves. Through a wide gap the wave goes on almost as a straight beam.',
          hr: 'To širenje zove se ogib. Otvor širok otprilike jednu valnu duljinu djeluje kao novi točkasti izvor i šalje kružne valove. Kroz širok otvor val prolazi gotovo kao ravan snop.' }
      }
    ]
  });
})();
