/* FizLab — "Predict first" / "Prvo predvidi" prompts for the sims induction, resistance and energychain (see _predictions_schema.md) */
(function () {
  'use strict';
  window.Content.registerPredictions({

    // ---------------------------------------------------------------- induction
    induction: [
      {
        q: { en: 'A strong magnet lies perfectly still inside a coil that is connected to a galvanometer. What does the needle show?',
          hr: 'Jak magnet potpuno miruje u zavojnici koja je spojena na galvanometar. Što pokazuje kazaljka?' },
        options: [
          { en: 'A large steady deflection, because the magnet is strong', hr: 'Velik stalan otklon jer je magnet jak' },
          { en: 'Zero: there is no voltage while nothing changes', hr: 'Nulu: nema napona dok se ništa ne mijenja' },
          { en: 'A small steady deflection, because the magnet is not moving', hr: 'Malen stalan otklon jer se magnet ne giba' }
        ],
        answer: 1,
        try: { en: 'In "Magnet and coil" set "Magnet" to "strong", drag the magnet into the coil and hold it still. Then pull it out quickly and watch the needle and the graph.',
          hr: 'U pokusu "Magnet i zavojnica" postavi "Magnet" na "jak", povuci magnet u zavojnicu i drži ga mirno. Zatim ga brzo izvuci i prati kazaljku i graf.' },
        explain: { en: 'A voltage is induced only while the magnetic field through the coil is changing. A magnet at rest, however strong, changes nothing, so the needle stays at zero. The faster the change, the higher the voltage.',
          hr: 'Napon se inducira samo dok se magnetsko polje kroz zavojnicu mijenja. Magnet koji miruje, koliko god bio jak, ništa ne mijenja pa kazaljka ostaje na nuli. Što je promjena brža, napon je veći.' }
      },
      {
        q: { en: 'A generator turns twice as fast: 4 turns per second instead of 2. What happens to its alternating voltage?',
          hr: 'Generator se vrti dvostruko brže: 4 okreta u sekundi umjesto 2. Što se dogodi s njegovim izmjeničnim naponom?' },
        options: [
          { en: 'Only the frequency doubles, the peak voltage stays the same', hr: 'Udvostruči se samo frekvencija, vršni napon ostaje isti' },
          { en: 'Only the peak voltage doubles, the frequency stays the same', hr: 'Udvostruči se samo vršni napon, frekvencija ostaje ista' },
          { en: 'Both the peak voltage and the frequency double', hr: 'Udvostruče se i vršni napon i frekvencija' }
        ],
        answer: 2,
        try: { en: 'Open "Generator", set "Rotation speed" to 2 turns/s and read "Frequency f" and "Peak voltage". Then set 4 turns/s and compare the readouts and the graph.',
          hr: 'Otvori "Generator", postavi "Brzina vrtnje" na 2 okr/s i očitaj "Frekvencija f" i "Vršni napon". Zatim postavi 4 okr/s i usporedi očitanja i graf.' },
        explain: { en: 'One turn of the magnet gives one full wave, so the frequency follows the rotation. The field through the coil also changes twice as fast, and a faster change induces a higher voltage. That is why a bicycle lamp on a dynamo shines brighter when you ride faster.',
          hr: 'Jedan okret magneta daje jedan cijeli val pa frekvencija prati vrtnju. Polje kroz zavojnicu mijenja se i dvostruko brže, a brža promjena inducira veći napon. Zato svjetlo na biciklu s dinamom svijetli jače kad voziš brže.' }
      }
    ],

    // ---------------------------------------------------------------- resistance
    resistance: [
      {
        q: { en: 'A wire is swapped for one of the same metal and length, but twice as thick in cross-section. What happens to its resistance?',
          hr: 'Žicu zamijenimo žicom od istog metala i iste duljine, ali dvostruko većeg presjeka. Što se dogodi s njezinim otporom?' },
        options: [
          { en: 'It halves', hr: 'Prepolovi se' },
          { en: 'It doubles, because there is more metal to get through', hr: 'Udvostruči se jer treba proći kroz više metala' },
          { en: 'It stays the same: only the material matters', hr: 'Ostaje isti: važan je samo materijal' }
        ],
        answer: 0,
        try: { en: 'In "A wire" set "Cross-section A" to 0.50 mm² and read "Resistance R". Then set 1.00 mm² and read it again. Try doubling "Length l" too.',
          hr: 'U pokusu "Žica" postavi "Presjek A" na 0,50 mm² i očitaj "Otpor R". Zatim postavi 1,00 mm² i očitaj ponovno. Pokušaj udvostručiti i "Duljina l".' },
        explain: { en: 'A thicker wire is like a wider road: the electrons have more room, so the resistance is smaller. R = ρ · l / A, so twice the cross-section gives half the resistance, while twice the length gives double.',
          hr: 'Deblja žica je poput šire ceste: elektroni imaju više mjesta pa je otpor manji. R = ρ · l / A, pa dvostruko veći presjek daje upola manji otpor, a dvostruko veća duljina dvostruko veći.' }
      },
      {
        q: { en: 'The two clips of a bulb tester are dipped into pure distilled water, and later into water with a lot of salt. When does the bulb light?',
          hr: 'Dvije štipaljke ispitivača sa žaruljicom uronimo u čistu destiliranu vodu, a poslije u vodu s puno soli. Kada žaruljica svijetli?' },
        options: [
          { en: 'Both times: water always conducts electricity well', hr: 'Oba puta: voda uvijek dobro vodi struju' },
          { en: 'Never: water is an insulator', hr: 'Nikada: voda je izolator' },
          { en: 'Only in the salt water', hr: 'Samo u slanoj vodi' }
        ],
        answer: 2,
        try: { en: 'In "Conductor or insulator?" drag "distilled water" into the gap and read the current. Then drag in "salt water" and move "Salt in the salt water" from 0 g to 20 g.',
          hr: 'U pokusu "Vodič ili izolator?" povuci "destilirana voda" u prazninu i očitaj struju. Zatim stavi "slana voda" i pomiči "Sol u slanoj vodi" od 0 g do 20 g.' },
        explain: { en: 'Pure water has almost no charged particles that could carry a current. Dissolved salt splits into ions; the more salt, the smaller the resistance of the solution and the larger the current. Tap water and wet hands conduct a little, which is why water and mains electricity are a dangerous mix.',
          hr: 'Čista voda gotovo nema nabijenih čestica koje bi prenosile struju. Otopljena sol raspada se na ione; što je više soli, otpor otopine je manji, a struja jača. Voda iz slavine i mokre ruke pomalo vode, pa su voda i struja iz utičnice opasan spoj.' }
      }
    ],

    // ---------------------------------------------------------------- energychain
    energychain: [
      {
        q: { en: 'An old filament bulb receives 100 J of electrical energy. About how much of it becomes light?',
          hr: 'Stara žarulja sa žarnom niti primi 100 J električne energije. Koliko se otprilike pretvori u svjetlost?' },
        options: [
          { en: 'About 5 J; the rest warms the surroundings', hr: 'Oko 5 J; ostatak grije okolinu' },
          { en: 'About half, 50 J', hr: 'Oko polovice, 50 J' },
          { en: 'Nearly all of it, because a bulb is made for light', hr: 'Gotovo sva, jer je žarulja napravljena za svjetlost' }
        ],
        answer: 0,
        try: { en: 'In "Build a chain" choose "filament bulb" as "User (appliance)". Read the share written under the bulb and watch how few light packets leave it. Then switch to "LED lamp".',
          hr: 'U "Složi lanac" za "Trošilo" odaberi "žarulja sa žarnom niti". Pročitaj udio ispisan ispod žarulje i gledaj kako malo paketa svjetlosti izlazi iz nje. Zatim odaberi "LED žarulja".' },
        explain: { en: 'A glowing filament turns only about 5 % of the electrical energy into light; about 95 % spreads out as heat. The energy is not destroyed, it just ends up in a form we did not want. An LED gives the same light from far less energy.',
          hr: 'Užarena nit pretvori samo oko 5 % električne energije u svjetlost; oko 95 % rasprši se kao toplina. Energija nije nestala, samo je završila u obliku koji nismo htjeli. LED žarulja daje isto svjetlo uz puno manje energije.' }
      },
      {
        q: { en: 'A 2000 W kettle boils water for 15 minutes a day. A 150 W fridge is plugged in all day. Which uses more energy per day?',
          hr: 'Kuhalo snage 2000 W grije vodu 15 minuta na dan. Hladnjak snage 150 W uključen je cijeli dan. Koji uređaj dnevno potroši više energije?' },
        options: [
          { en: 'The kettle, because it is far more powerful', hr: 'Kuhalo jer ima puno veću snagu' },
          { en: 'The fridge, because it works for much longer', hr: 'Hladnjak jer radi puno dulje' },
          { en: 'Both use the same', hr: 'Oba potroše jednako' }
        ],
        answer: 1,
        try: { en: 'Open "Electricity at home" and compare the bars for "kettle" and "fridge". Click a bar or use "Appliance to edit", then change "Hours per day" and watch the energy.',
          hr: 'Otvori "Struja kod kuće" i usporedi stupce za "kuhalo za vodu" i "hladnjak". Klikni stupac ili upotrijebi "Uređaj koji mijenjaš", zatim mijenjaj "Sati dnevno" i prati energiju.' },
        explain: { en: 'Energy is power times time, E = P · t. The kettle uses 2000 W · 0.25 h = 0.5 kWh. The fridge motor runs about a third of the day: 150 W · 8 h = 1.2 kWh. Power alone does not decide; the running time matters just as much.',
          hr: 'Energija je umnožak snage i vremena, E = P · t. Kuhalo potroši 2000 W · 0,25 h = 0,5 kWh. Motor hladnjaka radi oko trećine dana: 150 W · 8 h = 1,2 kWh. Ne odlučuje samo snaga; jednako je važno i vrijeme rada.' }
      }
    ]
  });
})();
