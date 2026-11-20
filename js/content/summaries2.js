/* FizLab — topic summaries ("In short" / "Ukratko") and common misconceptions, part 2: science and homelab (same format as summaries.js) */
(function () {
  'use strict';
  window.Content.registerSummaries({

    science: {
      bullets: {
        en: [
          'Physics answers questions about nature by observation and experiment: in an observation you watch what happens by itself, in an experiment you set things up and change them on purpose.',
          'A hypothesis is a clear guess that can be tested; from it you derive a prediction (if ... and ... then ...) and compare it with the result (but ... or and ..., therefore ...).',
          'In a fair test you change only one variable (the independent one), measure another (the dependent one) and keep all the others the same (the controlled variables).',
          'No measurement is perfect: measure at least three times, take the mean and state the measurement uncertainty, for example l = (120.4 ± 0.1) cm.',
          'A model is a deliberate simplification, a law says what happens and a theory explains why; we trust them because they have passed many tests, and they can still be improved.'
        ],
        hr: [
          'Fizika na pitanja o prirodi odgovara opažanjem i pokusom: pri opažanju pratiš što se događa samo od sebe, a u pokusu namjerno nešto postavljaš i mijenjaš.',
          'Hipoteza je jasna pretpostavka koju je moguće provjeriti; iz nje izvodiš predviđanje (ako … i …, onda …) i uspoređuješ ga s rezultatom (ali … ili i …, dakle …).',
          'U kontroliranom pokusu mijenjaš samo jednu varijablu (nezavisnu), mjeriš drugu (zavisnu), a sve ostale držiš stalnima (kontrolirane varijable).',
          'Nijedno mjerenje nije savršeno: mjeri najmanje tri puta, izračunaj srednju vrijednost i navedi mjernu nesigurnost, na primjer l = (120,4 ± 0,1) cm.',
          'Model je namjerno pojednostavljenje, zakon kaže što se događa, a teorija objašnjava zašto; vjerujemo im jer su prošli mnoge provjere, a ipak se i dalje mogu poboljšavati.'
        ]
      },
      misconceptions: [
        { myth: { en: 'An experiment can prove that a hypothesis is true.', hr: 'Pokus može dokazati da je hipoteza točna.' },
          truth: { en: 'An experiment can knock a hypothesis down, but it can never prove one once and for all: thousands of white swans did not prove that all swans are white, and a single black one disproved it. A hypothesis that passes many tests is well supported, and that is the most science can offer.', hr: 'Pokus hipotezu može srušiti, ali je nikad ne može dokazati jednom zauvijek: tisuće bijelih labudova nisu dokazale da su svi labudovi bijeli, a jedan jedini crni labud to je opovrgnuo. Hipoteza koja prođe mnoge provjere dobro je potkrijepljena, i to je najviše što znanost može ponuditi.' } },
        { myth: { en: 'A theory is only a guess; once it is proved, it becomes a law.', hr: 'Teorija je samo nagađanje; kad se dokaže, postaje zakon.' },
          truth: { en: 'In science a theory is a well-tested explanation of why something happens, while a law describes what happens, often as a formula. One does not grow into the other: the kinetic theory explains why a gas presses on the walls of its container, and it is not waiting to become a law.', hr: 'U znanosti je teorija dobro provjereno objašnjenje zašto se nešto događa, a zakon opisuje što se događa, često formulom. Jedno ne prerasta u drugo: kinetička teorija objašnjava zašto plin tlači stijenke posude i ne čeka da postane zakon.' } },
        { myth: { en: 'A careful scientist measures once and gets the exact value.', hr: 'Pažljiv znanstvenik mjeri jednom i dobije točnu vrijednost.' },
          truth: { en: 'Every measurement has an uncertainty, however careful you are. That is why we repeat it, take the mean and write the result as an interval, such as (120.4 ± 0.1) cm; a result without its uncertainty tells only half the story.', hr: 'Svako mjerenje ima mjernu nesigurnost, koliko god bio pažljiv. Zato mjerenje ponavljamo, računamo srednju vrijednost i rezultat zapisujemo kao interval, na primjer (120,4 ± 0,1) cm; rezultat bez mjerne nesigurnosti otkriva samo pola priče.' } }
      ]
    },

    homelab: {
      bullets: {
        en: [
          'Safety first: read the whole procedure before you start, use only batteries and never the mains socket, and call an adult when you need hot water, a flame or a sharp tool.',
          'Predict before you do: write down what you expect and why, then carry out the experiment and compare; a wrong prediction teaches you the most.',
          'Change only one thing at a time, keep everything else the same and repeat every measurement at least three times.',
          'Write the numbers into a table straight away, with their units, and then draw a graph: a picture shows the pattern that a column of numbers hides.',
          'Your phone is a measuring instrument: a stopwatch, a slow-motion camera, a microphone, a torch and motion sensors; an honest report says what you really measured, even when the result surprises you.'
        ],
        hr: [
          'Sigurnost na prvom mjestu: prije početka pročitaj cijeli postupak, upotrebljavaj samo baterije, nikad struju iz utičnice, i pozovi odraslu osobu kad ti treba vruća voda, plamen ili oštar alat.',
          'Prvo predvidi, a onda izvedi pokus: zapiši što očekuješ i zašto, a nakon pokusa usporedi rezultat s predviđanjem; iz pogrešnog predviđanja naučiš najviše.',
          'Mijenjaj samo jednu stvar odjednom, sve ostalo drži jednakim i svako mjerenje ponovi najmanje tri puta.',
          'Brojeve odmah upiši u tablicu, zajedno s mjernim jedinicama, a zatim nacrtaj graf: slika pokazuje pravilnost koju stupac brojeva skriva.',
          'Mobitel je mjerni instrument: štoperica, kamera za usporene snimke, mikrofon, svjetiljka i senzori gibanja; u poštenom izvješću piše što si stvarno izmjerio, čak i kad te rezultat iznenadi.'
        ]
      },
      misconceptions: [
        { myth: { en: 'If my result differs from the one in the textbook, the experiment has failed.', hr: 'Ako se moj rezultat razlikuje od onoga u udžbeniku, pokus nije uspio.' },
          truth: { en: 'A home measurement always differs a little from the textbook value, and the interesting question is why: friction, air, a slow finger on the stopwatch. Write down what you really measured and look for the cause; changing the numbers to make them fit is the only real failure.', hr: 'Kućno mjerenje uvijek se malo razlikuje od vrijednosti iz udžbenika, a zanimljivo je pitanje zašto: trenje, zrak, spor prst na štoperici. Zapiši što si stvarno izmjerio i potraži uzrok; jedini pravi neuspjeh bio bi prepraviti brojeve da se slažu s udžbenikom.' } },
        { myth: { en: 'One careful measurement is enough.', hr: 'Dovoljno je jedno pažljivo mjerenje.' },
          truth: { en: 'A single reading cannot show how far it can be trusted. Your reaction time alone can shift a stopwatch reading by about 0.2 s, so repeat the measurement at least three times, take the mean and, whenever you can, time 10 swings instead of one.', hr: 'Jedno očitanje ne može pokazati koliko mu se smije vjerovati. Već samo vrijeme reakcije može promijeniti očitanje štoperice za oko 0,2 s, zato mjerenje ponovi najmanje tri puta, izračunaj srednju vrijednost i, kad god možeš, mjeri 10 titraja umjesto jednoga.' } },
        { myth: { en: 'Real physics needs expensive laboratory equipment.', hr: 'Za pravu fiziku potrebna je skupa laboratorijska oprema.' },
          truth: { en: 'What makes an experiment real physics is the method, not the price of the equipment: a clear question, a prediction, a fair test and honest records. A piece of string, a ruler, a kitchen scale and a phone, whose sensors measure time, sound and acceleration, are enough for many good measurements.', hr: 'Pokus pravom fizikom čini metoda, a ne cijena opreme: jasno pitanje, predviđanje, kontrolirani pokus i pošteni zapisi. Komad konca, ravnalo, kuhinjska vaga i mobitel, čiji senzori mjere vrijeme, zvuk i ubrzanje, dovoljni su za mnoga dobra mjerenja.' } }
      ]
    }

  });
})();
