/* Contenido extra: trucos por sonido, pares para entrenar el oído y palabras difíciles. */
(function (G) {
  "use strict";
  /* Trucos concretos para llegar al sonido desde algo que ya sabés hacer en español */
  const TRICKS = {
    ih_iy: [
      { t: "De la e a la i corta", d: "Decí «e» y cerrá apenas la boca, sin llegar a la i española. Ahí está la i de «ship»: corta y floja.", w: "sit · ship · live" },
      { t: "La i larga es una sonrisa", d: "Para «sheep» estirá los labios como para una foto y sostené el sonido el doble de tiempo: «shiiip».", w: "seat · sheep · leave" }
    ],
    ae: [
      { t: "La a con cara de e", d: "Poné la boca de «e» y bajá bien la mandíbula sin dejar de estirar los labios. Sale un sonido entre a y e: «cat».", w: "cat · bad · man" },
      { t: "Exagerá al principio", d: "Abrí la boca como si te sorprendieras: «aeh». Con la práctica lo vas achicando.", w: "that · happy · black" }
    ],
    schwa: [
      { t: "El sonido de la duda", d: "Es el «eh…» que hacés cuando pensás, pero cortito y sin abrir la boca. Va en las sílabas que no llevan acento: «a-BOUT», «ba-NA-na».", w: "about · banana · today" },
      { t: "No pronuncies todas las vocales", d: "En inglés las sílabas débiles casi desaparecen. «Chocolate» son dos sílabas: «CHÓK-let».", w: "chocolate · family · camera" }
    ],
    uh_uw: [
      { t: "La u corta es floja", d: "Para «full» decí una u española pero relajada, sin hacer trompita, como si estuvieras cansado.", w: "full · book · good" },
      { t: "La u larga hace trompita", d: "Para «fool» adelantá los labios en círculo y sostené: «fuuul».", w: "fool · food · school" }
    ],
    ou: [
      { t: "La o que se desliza", d: "En «go» no hay una o sola: arrancá con o y terminá en u, «gou». Si la cortás en o, suena a español.", w: "go · no · phone" },
      { t: "La o abierta no se desliza", d: "En «caught» abrí bien la boca y sostené una o abierta, sin ir a la u.", w: "caught · talk · law" }
    ],
    v_b: [
      { t: "De la f a la v", d: "Hacé una «f» larga: dientes de arriba sobre el labio de abajo, soplando. Sin moverte, sumale voz y vibra: eso es la v.", w: "fan → van · fine → vine" },
      { t: "Prohibido juntar los labios", d: "Si los labios se tocan, es b. Para la v, el labio de abajo toca los dientes, nunca el otro labio. Mirate en el espejo.", w: "very · video · have" }
    ],
    th: [
      { t: "De la s a la th", d: "Decí «sss» y, sin cortar el aire, adelantá la lengua hasta que la punta quede entre los dientes. El sonido cambia a «th».", w: "sink → think · sick → thick" },
      { t: "Mostrá la lengua", d: "Al principio exagerá: que se vea la punta de la lengua. Después la vas escondiendo apenas detrás de los dientes.", w: "three · thanks · thing" }
    ],
    dh: [
      { t: "Una d con la lengua afuera", d: "Poné la punta de la lengua entre los dientes y decí «d» suave, dejando que vibre. Como la d de «nada» pero más adelante.", w: "the · this · they" },
      { t: "Tocá la garganta", d: "Con la mano en la garganta: en «this» vibra, en «think» no. Es la misma posición con y sin voz.", w: "this / think · they / thank" }
    ],
    h: [
      { t: "Empañá un vidrio", d: "La h es el aire que soltás para empañar un vidrio: «hhh». Suave, sin raspar la garganta como la j.", w: "hat · house · hello" },
      { t: "Un papel frente a la boca", d: "Sostené un papelito delante de la boca: con «hat» se tiene que mover, con «at» no.", w: "hat / at · heat / eat" }
    ],
    y: [
      { t: "Arrancá con i", d: "La y de «yes» es una i rápida que se pega a la vocal: «i-es» muy rápido. Nada de «sh» ni de «ll» argentina.", w: "yes · you · year" },
      { t: "Contra la j inglesa", d: "«Yes» empieza suave como i; «jet» empieza con un golpe, como «dy». Practicá alternando las dos.", w: "yet / jet · yolk / joke" }
    ],
    sh_ch: [
      { t: "Pedí silencio", d: "La sh es el «shhh» de pedir silencio: continuo, sin golpe, con los labios un poco adelante.", w: "she · show · wash" },
      { t: "La ch es una t + sh", d: "Para «ch», tocá con la lengua detrás de los dientes como para una t y soltá en «sh»: «t-sh».", w: "chip · watch · cheap" }
    ],
    z_s: [
      { t: "La abeja", d: "La z inglesa es el zumbido de una abeja: la misma posición de la s pero con voz, «zzz». Tocá la garganta: vibra.", w: "zoo · is · was" },
      { t: "Las s finales que suenan z", d: "En «is», «was», «news», «days» la s final suena z. Alargala un poquito y que vibre.", w: "is · was · days" }
    ],
    r: [
      { t: "De la u a la r", d: "Decí una «u» larga y, sin tocar nada, curvá la punta de la lengua hacia atrás. Ese sonido oscuro es la r inglesa.", w: "red · right · car" },
      { t: "La lengua no toca", d: "La r española golpea el paladar; la inglesa nunca toca nada. Si sentís un golpecito, todavía es española.", w: "really · around · very" }
    ],
    ptk: [
      { t: "El papel que se mueve", d: "Al principio de palabra, p, t y k salen con un soplido. Con un papel delante de la boca, «pin» lo mueve y «bin» no.", w: "pin · time · coffee" },
      { t: "Como una h escondida", d: "Pensá «p-h», «t-h», «k-h»: un mini soplido después de la consonante.", w: "people · talk · keep" }
    ],
    ed: [
      { t: "Tres finales, una regla", d: "Después de p, k, f, s, sh, ch suena t («worked» = «workt»). Después de t o d se agrega sílaba («wanted» = «wan-tid»). En el resto, d («played»).", w: "worked · played · wanted" },
      { t: "No agregues una e", d: "«Worked» es una sola sílaba. Si decís «work-ed», te van a entender otra cosa.", w: "asked · watched · helped" }
    ],
    s_cluster: [
      { t: "Arrancá silbando", d: "Antes de «speak» hacé una «sss» larga, como un silbido, y recién ahí la palabra: «ssspeak». Nada de e adelante.", w: "speak · study · school" },
      { t: "Pegala a la palabra anterior", d: "Si te cuesta, uní la s con la palabra de antes: «I study» → «aistudy». La s se apoya en la vocal anterior.", w: "I study · my school" }
    ],
    ng: [
      { t: "La n de atrás", d: "Decí «nnn» y llevá la lengua hacia atrás hasta que la parte de atrás toque el paladar. El aire sale por la nariz, sin g al final.", w: "sing · thing · long" },
      { t: "Sin agregar g", d: "«Singing» no es «sin-guin-g». La g no se pronuncia: termina en la nariz.", w: "singing · going · morning" }
    ]
  };

  /* Pares para entrenar el oído en sonidos que no tienen pares en la lista principal */
  const EAR = {
    ou: [["coat", "caught"], ["boat", "bought"], ["low", "law"], ["so", "saw"], ["hole", "hall"], ["coal", "call"]],
    r: [["right", "light"], ["read", "lead"], ["rice", "lice"], ["fry", "fly"], ["pray", "play"], ["grass", "glass"], ["road", "load"]],
    ptk: [["pin", "bin"], ["tie", "die"], ["coat", "goat"], ["pea", "bee"], ["cap", "gap"], ["tear", "dear"], ["pear", "bear"]],
    ng: [["thing", "thin"], ["sing", "sin"], ["rang", "ran"], ["wing", "win"], ["sung", "sun"], ["bang", "ban"]],
    schwa: [["affect", "effect"], ["accept", "except"], ["a lot", "allot"]]
  };

  /* Palabras que los hispanohablantes suelen decir mal. r: cómo suena (mayúscula = sílaba fuerte) */
  const HARD = [
    { g: "Letras que no suenan", items: [
      { w: "island", r: "ÁI-land", t: "La s no suena." },
      { w: "receipt", r: "ri-SÍT", t: "La p no suena." },
      { w: "salmon", r: "SÁ-mon", t: "La l no suena." },
      { w: "walk", r: "uók", t: "La l no suena. Rima con «talk»." },
      { w: "half", r: "jaf", t: "La l no suena y la h es un soplido suave." },
      { w: "could", r: "kud", t: "La l no suena y la u es corta. Igual «would» y «should»." },
      { w: "debt", r: "det", t: "La b no suena." },
      { w: "doubt", r: "dáut", t: "La b no suena." },
      { w: "muscle", r: "MÁ-sel", t: "La c no suena." },
      { w: "answer", r: "ÁN-ser", t: "La w no suena." },
      { w: "listen", r: "LÍ-sen", t: "La t no suena." },
      { w: "hour", r: "ÁU-er", t: "La h no suena: «an hour»." },
      { w: "honest", r: "Ó-nest", t: "La h no suena." },
      { w: "knife", r: "náif", t: "La k no suena." },
      { w: "knowledge", r: "NÓ-lich", t: "La k no suena y termina en «lich»." },
      { w: "campaign", r: "kam-PÉIN", t: "La g no suena." },
      { w: "design", r: "di-SÁIN", t: "La g no suena y la s suena z." },
      { w: "foreign", r: "FÓ-ren", t: "La g no suena." }
    ] },
    { g: "Menos sílabas de las que parece", items: [
      { w: "comfortable", r: "CÁMF-ter-bel", t: "Tres sílabas: la «or» casi desaparece." },
      { w: "vegetable", r: "VÉCH-te-bel", t: "Tres sílabas, no cuatro." },
      { w: "chocolate", r: "CHÓK-let", t: "Dos sílabas." },
      { w: "interesting", r: "ÍN-tres-ting", t: "Tres sílabas, acento al principio." },
      { w: "business", r: "BÍZ-nes", t: "Dos sílabas y la u suena i." },
      { w: "Wednesday", r: "UÉNZ-dei", t: "La primera d no suena: dos sílabas." },
      { w: "clothes", r: "clóudz", t: "Una sola sílaba, casi como «close»." },
      { w: "family", r: "FÁM-li", t: "En el habla rápida, dos sílabas." },
      { w: "every", r: "ÉV-ri", t: "Dos sílabas." },
      { w: "different", r: "DÍF-rent", t: "Dos sílabas." }
    ] },
    { g: "Vocales engañosas", items: [
      { w: "women", r: "UÍ-min", t: "Se escribe con o pero suena i." },
      { w: "people", r: "PÍ-pol", t: "La «eo» es una i larga." },
      { w: "busy", r: "BÍ-zi", t: "La u suena i y la s suena z." },
      { w: "said", r: "sed", t: "Rima con «red». Nunca «sáid»." },
      { w: "breakfast", r: "BRÉK-fast", t: "La «ea» es una e corta." },
      { w: "world", r: "uérld", t: "Vocal de «bird» y r curvada antes de la l." },
      { w: "work", r: "uérk", t: "No es «uork»: la vocal es la de «bird»." },
      { w: "walk", r: "uók", t: "Ojo con «work»: «walk» es o abierta, sin r." },
      { w: "beautiful", r: "BIÚ-ti-fol", t: "La «eau» suena iú." },
      { w: "minute", r: "MÍ-nit", t: "Termina en «nit»." },
      { w: "focus", r: "FÓU-kes", t: "La o suena «ou»." },
      { w: "media", r: "MÍ-dia", t: "La primera e suena i." },
      { w: "data", r: "DÉI-ta", t: "En Estados Unidos, «déi-ta»." },
      { w: "Europe", r: "IÚ-rop", t: "Empieza con «iú»." }
    ] },
    { g: "El acento cambia de lugar", items: [
      { w: "develop", r: "di-VÉ-lop", t: "Acento en la segunda sílaba." },
      { w: "determine", r: "di-TÉR-min", t: "Termina en «min», no en «máin»." },
      { w: "technology", r: "tek-NÓ-lo-yi", t: "La ch suena k; acento en NÓ." },
      { w: "environment", r: "en-VÁI-ron-ment", t: "Acento en VÁI." },
      { w: "government", r: "GÁ-ver-ment", t: "La primera n casi no suena." },
      { w: "specific", r: "spe-SÍ-fik", t: "Sin e al principio, acento en SÍ." },
      { w: "available", r: "a-VÉI-la-bel", t: "Acento en VÉI." },
      { w: "photographer", r: "fo-TÓ-gra-fer", t: "En «photograph» el acento va al principio; en «photographer», en TÓ." },
      { w: "event", r: "i-VÉNT", t: "Acento al final; empieza con i." },
      { w: "idea", r: "ai-DÍ-a", t: "Empieza con «ai»; acento en DÍ." },
      { w: "hotel", r: "jo-TÉL", t: "Acento al final y h suave." },
      { w: "Argentina", r: "ar-yen-TÍ-na", t: "La g suena como «y» con golpe." }
    ] },
    { g: "Th y otras trampas", items: [
      { w: "thought", r: "zot", t: "th sin voz (lengua entre los dientes) y o abierta. La gh no suena." },
      { w: "though", r: "dou", t: "th con voz: lengua entre los dientes y vibra." },
      { w: "through", r: "zru", t: "th sin voz + «ru»." },
      { w: "tough", r: "taf", t: "La «ough» suena «af»." },
      { w: "three", r: "zrii", t: "th sin voz. Si decís «tri», suena «tree» (árbol)." },
      { w: "months", r: "mánz", t: "En el habla rápida la th casi desaparece: «mánz»." },
      { w: "schedule", r: "SKÉ-yul", t: "En Estados Unidos «ské-yul»; en Inglaterra «shé-yul»." },
      { w: "colleague", r: "CÓ-lig", t: "Dos sílabas: «có-lig»." },
      { w: "recipe", r: "RÉ-si-pi", t: "Tres sílabas, termina en i." },
      { w: "library", r: "LÁI-bre-ri", t: "Es «biblioteca», no «librería»." }
    ] }
  ];

  G.VOZ_EXTRA = { TRICKS, EAR, HARD };
})(typeof window !== "undefined" ? window : globalThis);
