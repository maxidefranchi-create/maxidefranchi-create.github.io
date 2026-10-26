/* Guías de cada sonido: cómo se pone la boca, contra lo que hacemos en español. */
(function (G) {
  "use strict";
  const GUIDES = {
    ih_iy: {
      title: "i corta y i larga", ex: "ship · sheep", focus: ["IH", "IY"], drill: "ih_iy", series: "p1",
      sides: [
        { state: "IH", label: "i corta", word: "ship", note: "Boca relajada, lengua un poco más baja", steps: [
          { t: "Relajá los labios: ni sonrisa ni trompita.", at: "lips" },
          { t: "Bajá apenas la lengua desde la i española, casi hacia la e.", at: "dorsum" },
          { t: "Hacela corta y floja, sin estirarla.", at: null }] },
        { state: "IY", label: "i larga", word: "sheep", note: "Labios estirados, lengua alta y tensa", steps: [
          { t: "Estirá los labios hacia los costados, como sonriendo.", at: "lips" },
          { t: "Subí la lengua bien alta y adelante, casi tocando el paladar.", at: "dorsum" },
          { t: "Sostenela el doble de tiempo: «iii».", at: null }] }
      ],
      check: "Decí «sheep» sonriendo y «ship» con la cara relajada. Si te salen iguales, exagerá: la corta casi suena a «e».",
      error: "En español hay una sola i, que queda entre las dos inglesas. Si decís «ship» con i española, el oído inglés escucha «sheep».",
      words: ["ship", "sheep", "sit", "seat", "live", "leave", "this", "these"]
    },
    ae: {
      title: "a abierta", ex: "cat · cut · bed", focus: ["AE", "AH", "EH"], drill: "ae", series: "p7",
      sides: [
        { state: "ES_A", label: "a española", note: "Lengua baja, en el centro", steps: [
          { t: "Así sale la a que ya conocés: lengua baja y al centro, labios neutros.", at: "dorsum" }] },
        { state: "AE", label: "a de cat", word: "cat", note: "Mandíbula bien abajo y labios estirados", steps: [
          { t: "Bajá bien la mandíbula, más que para la a española.", at: "jaw" },
          { t: "Estirá los labios hacia los costados, como para decir «e».", at: "lips" },
          { t: "Llevá la lengua adelante y abajo: suena entre a y e.", at: "dorsum" }] },
        { state: "AH", label: "a de cut", word: "cut", note: "Boca a medio abrir, relajada", steps: [
          { t: "Abrí la boca a medias, sin estirar los labios.", at: "jaw" },
          { t: "Lengua relajada en el centro: una a española corta y floja.", at: "dorsum" }] }
      ],
      check: "Mirate al espejo: en «cat» se ve la boca más abierta y estirada que en «cut».",
      error: "Usamos la misma a para «cat», «cut» y «cart». En inglés son palabras distintas.",
      words: ["cat", "cut", "bad", "bed", "man", "black", "have", "thanks"]
    },
    schwa: {
      title: "la vocal relajada", ex: "about · the · banana", focus: ["AX"], series: "p9",
      sides: [
        { state: "ES_A", label: "vocal entera", note: "Así suena cada vocal en español", steps: [
          { t: "En español cada vocal suena completa, aunque la sílaba no tenga acento.", at: "dorsum" }] },
        { state: "AX", label: "schwa", word: "about", note: "Todo relajado, casi sin abrir", steps: [
          { t: "Aflojá la mandíbula: la boca apenas abierta.", at: "jaw" },
          { t: "Dejá la lengua en reposo, en el medio de la boca.", at: "dorsum" },
          { t: "Un sonido corto y débil, como el «eh» de una duda.", at: null }] }
      ],
      check: "Decí «banana» con fuerza solo en la del medio: bə-NA-nə. Las otras dos se achican.",
      error: "Pronunciar todas las vocales enteras hace que el inglés suene robótico. La schwa es la vocal más común del inglés.",
      words: ["about", "the", "banana", "today", "problem", "seven"]
    },
    uh_uw: {
      title: "u corta y u larga", ex: "full · fool", focus: ["UH", "UW"], drill: "uh_uw",
      sides: [
        { state: "UH", label: "u corta", word: "full", note: "Labios apenas redondeados", steps: [
          { t: "Redondeá un poco los labios, sin hacer trompita.", at: "lips" },
          { t: "Lengua atrás pero relajada.", at: "dorsum" },
          { t: "Corta, casi entre u y o.", at: null }] },
        { state: "UW", label: "u larga", word: "fool", note: "Trompita bien adelante", steps: [
          { t: "Sacá los labios hacia adelante, como para dar un beso.", at: "lips" },
          { t: "Subí la parte de atrás de la lengua.", at: "dorsum" },
          { t: "Sostenela: «uuu».", at: null }] }
      ],
      check: "«Good», «book» y «look» van con la corta. «Food», «school» y «you» con la larga.",
      error: "La u española queda en el medio. En inglés hay que elegir: corta y floja, o larga con trompita.",
      words: ["full", "fool", "good", "food", "book", "school"]
    },
    ou: {
      title: "la o que se cierra", ex: "go · no · phone", focus: ["OW"],
      sides: [
        { state: "ES_O", label: "o española", note: "Una sola posición, quieta", steps: [
          { t: "Nuestra o es pura: la boca no se mueve mientras suena.", at: "lips" }] },
        { seq: ["ES_O", "UH"], label: "ou inglesa", word: "go", note: "Empieza en o y se cierra hacia u", steps: [
          { t: "Empezá con una o española.", at: "lips" },
          { t: "Mientras suena, cerrá y redondeá los labios hacia una u.", at: "lips" },
          { t: "La boca nunca queda quieta: «go» es «gou».", at: null }] }
      ],
      check: "«No», «go», «phone», «know», «hope»: todas terminan con los labios más cerrados que al principio.",
      error: "Con la o pura, «go» y «phone» suenan a español, y «coat» se acerca a «caught».",
      words: ["go", "no", "phone", "know", "hope", "road"]
    },
    v_b: {
      title: "v y b", ex: "very · berry", focus: ["V", "B"], drill: "v_b", series: "p2",
      sides: [
        { state: "B", label: "b", word: "berry", note: "Los dos labios se juntan", steps: [
          { t: "Juntá los dos labios.", at: "lips" },
          { t: "Soltalos de golpe, con voz.", at: "larynx" }] },
        { state: "V", label: "v", word: "very", note: "Dientes de arriba sobre el labio de abajo", steps: [
          { t: "Apoyá los dientes de arriba sobre el labio de abajo, apenas por dentro.", at: "upperTeeth" },
          { t: "Soplá aire continuo entre el labio y los dientes.", at: "lowerLip" },
          { t: "Hacé vibrar la garganta: tiene que zumbar, «vvvv».", at: "larynx" },
          { t: "Sin cortar el zumbido, pasá a la vocal: vvv-ery.", at: null }] }
      ],
      check: "Un dedo en la garganta y otro frente a la boca: en la v sentís vibración y un aire suave y continuo. En la b, un golpe.",
      error: "En español la b y la v suenan igual, con los labios juntos. Si los juntás en «very», el inglés escucha «berry».",
      words: ["very", "vote", "van", "seven", "have", "visit", "video", "berry"]
    },
    th: {
      title: "th sorda", ex: "think · three", focus: ["TH", "S", "T"], drill: "th", series: "p5",
      sides: [
        { state: "S", label: "s", word: "sink", note: "La lengua queda adentro", steps: [
          { t: "Así sale si la lengua se queda detrás de los dientes: «sink».", at: "tongueTip" }] },
        { state: "T", label: "t", word: "tree", note: "La punta golpea la encía", steps: [
          { t: "Así sale si la punta golpea la encía: «tree».", at: "tongueTip" }] },
        { state: "TH", label: "th", word: "think", note: "Punta de la lengua entre los dientes", steps: [
          { t: "Sacá apenas la punta de la lengua entre los dientes.", at: "tongueTip" },
          { t: "Apoyala suave contra el borde de los dientes de arriba.", at: "upperTeeth" },
          { t: "Soplá aire sin voz, como la z de España.", at: "lips" },
          { t: "La garganta queda quieta, sin vibrar.", at: "larynx" }] }
      ],
      check: "Mirate al espejo: en «think» tiene que verse la punta de la lengua. Si no se ve, salió «sink» o «tink».",
      error: "Como el rioplatense no tiene este sonido, se reemplaza por s o t. «I think» suena «I sink»: me hundo.",
      words: ["think", "three", "thanks", "thing", "both", "month"]
    },
    dh: {
      title: "th sonora", ex: "they · this", focus: ["DH", "D"], drill: "dh", series: "p5",
      sides: [
        { state: "D", label: "d", word: "day", note: "La punta golpea la encía", steps: [
          { t: "Así sale si la punta golpea la encía: «day».", at: "tongueTip" }] },
        { state: "DH", label: "th sonora", word: "they", note: "Lengua entre los dientes, con voz", steps: [
          { t: "Sacá apenas la punta de la lengua entre los dientes.", at: "tongueTip" },
          { t: "Dejá pasar el aire suave contra los dientes de arriba.", at: "upperTeeth" },
          { t: "Hacé vibrar la garganta, como una d muy suave.", at: "larynx" }] }
      ],
      check: "Es el sonido de «the», «this», «they», «that» y «there». Con un dedo en la garganta tenés que sentir la vibración.",
      error: "Se suele decir «de», «dis», «dey» con una d dura. Acercate a la d suave de «nada», con la lengua más afuera.",
      words: ["the", "this", "they", "there", "brother", "father", "weather"]
    },
    h: {
      title: "la h", ex: "hat · house", focus: ["HH"], drill: "h", series: "p2",
      sides: [
        { state: "ES_J", label: "j española", note: "Raspa atrás, contra el paladar blando", steps: [
          { t: "Nuestra j raspa: la parte de atrás de la lengua se acerca al paladar.", at: "dorsum" }] },
        { state: "HH", label: "h inglesa", word: "hat", note: "Solo aire desde la garganta", steps: [
          { t: "Poné la boca en la posición de la vocal que sigue.", at: "lips" },
          { t: "Soltá aire desde la garganta, como para empañar un vidrio.", at: "larynx" },
          { t: "Nada raspa en la boca: es un suspiro suave.", at: "dorsum" }] }
      ],
      check: "Mano frente a la boca: en «hat» sentís aire tibio, sin ruido de raspado.",
      error: "Hay dos errores: dejarla muda como en español («at») o hacerla fuerte como la j («jat»).",
      words: ["hat", "house", "hello", "here", "have", "happy"]
    },
    y: {
      title: "la y inglesa", ex: "yes · you", focus: ["Y", "JH", "SH"], drill: "y", series: "p6",
      sides: [
        { state: "ES_SH", label: "y argentina", note: "La lengua roza y suena «sh»", steps: [
          { t: "Así sale nuestra y: la lengua roza el paladar y hace ruido.", at: "blade" }] },
        { state: "Y", label: "y inglesa", word: "yes", note: "Como una i rápida, sin ruido", steps: [
          { t: "Poné la lengua como para decir «i», alta y adelante.", at: "dorsum" },
          { t: "Sin que roce nada, deslizá rápido hacia la vocal: «i-es».", at: "palate" },
          { t: "Labios relajados, sin trompita.", at: "lips" }] }
      ],
      check: "Pensá «yes» como «iés» muy rápido. Si sentís un zumbido o un roce, todavía es la y argentina.",
      error: "La y rioplatense suena «sh»: «yes» se oye «shes» y «you» se oye «shoe», zapato.",
      words: ["yes", "you", "year", "yellow", "young", "used"]
    },
    sh_ch: {
      title: "sh y ch", ex: "ship · chip", focus: ["SH", "CH"], drill: "sh_ch", series: "p6",
      sides: [
        { state: "SH", label: "sh", word: "ship", note: "Continuo, como pedir silencio", steps: [
          { t: "Redondeá un poco los labios hacia afuera.", at: "lips" },
          { t: "Acercá la parte de adelante de la lengua al paladar, sin tocarlo.", at: "blade" },
          { t: "Soplá continuo: «shhh», sin golpe.", at: null }] },
        { state: "CH", label: "ch", word: "chip", note: "Arranca con un golpe de lengua", steps: [
          { t: "Apoyá la parte de adelante de la lengua detrás de la encía.", at: "blade" },
          { t: "Soltala de golpe, como la ch española.", at: "postridge" }] }
      ],
      check: "La «shhh» la podés sostener. La «ch» no: es un golpe corto.",
      error: "Con la ll argentina en el oído se mezclan «ship», «chip» y «sheep». La ch española sirve tal cual para «chip».",
      words: ["ship", "chip", "she", "cheap", "wash", "watch", "shoes", "choose"]
    },
    z_s: {
      title: "z y s", ex: "zoo · rise · news", focus: ["Z", "S"], drill: "z_s", series: "p8",
      sides: [
        { state: "S", label: "s", word: "sue", note: "Solo aire, sin voz", steps: [
          { t: "Dientes casi juntos y la punta de la lengua cerca de la encía.", at: "tongueTip" },
          { t: "Soplá: «sss», con la garganta quieta.", at: "larynx" }] },
        { state: "Z", label: "z", word: "zoo", note: "Misma posición, pero vibra", steps: [
          { t: "Misma posición que la s.", at: "tongueTip" },
          { t: "Hacé vibrar la garganta: «zzz», como una abeja.", at: "larynx" }] }
      ],
      check: "Dedo en la garganta: en la z vibra, en la s no. Muchas s escritas suenan z: «is», «was», «news», «days».",
      error: "En español casi no usamos la z sonora. «Is» con s suena raro, y «rise» con s se confunde con «rice».",
      words: ["zoo", "is", "was", "news", "rise", "days", "easy", "busy"]
    },
    r: {
      title: "la r inglesa", ex: "red · right · very", focus: ["R", "ER"], series: "p12",
      sides: [
        { state: "ES_R", label: "r española", note: "La punta golpea la encía", steps: [
          { t: "Nuestra r da un golpecito con la punta en la encía, o varios en la rr.", at: "tongueTip" }] },
        { state: "R", label: "r inglesa", word: "red", note: "La punta sube pero no toca", steps: [
          { t: "Levantá la punta de la lengua hacia el paladar, un poco hacia atrás.", at: "tongueTip" },
          { t: "No la dejes tocar nada: el aire pasa por arriba.", at: "ridge" },
          { t: "Redondeá un poco los labios.", at: "lips" },
          { t: "Con voz y sostenida, como un gruñido suave.", at: "larynx" }] }
      ],
      check: "Si la punta vibra o golpea, es la r española. Probá un «rrr» como un perro que gruñe bajito, sin vibrar la punta.",
      error: "Con la r de golpe, «very» suena casi «veddy» y «right» queda con acento muy marcado.",
      words: ["red", "right", "very", "sorry", "really", "three", "work", "car"]
    },
    ptk: {
      title: "p, t y k con soplido", ex: "pen · time · car", focus: ["P", "T", "K"],
      sides: [
        { state: { from: "P", asp: 0 }, label: "p española", note: "Sale sin aire al soltar", steps: [
          { t: "En español la p sale limpia, sin soplido.", at: "lips" }] },
        { state: "P", label: "p inglesa", word: "pen", note: "Un soplido al soltar", steps: [
          { t: "Juntá los labios como en español.", at: "lips" },
          { t: "Al soltarlos, dejá salir un soplido: «p-h».", at: "lips" },
          { t: "Lo mismo con t y k al principio de palabra: «t-hime», «k-har».", at: null }] }
      ],
      check: "Una hoja o la mano frente a la boca: en «pen» se tiene que mover con el aire. En «spin» casi no.",
      error: "Sin el soplido, «pen» puede sonar «ben», «time» puede sonar «dime» y «car» puede sonar «gar».",
      words: ["pen", "pay", "time", "talk", "car", "cold", "people", "coffee"]
    },
    ed: {
      title: "terminación -ed", ex: "worked · played · wanted", focus: ["T", "D"], drill: "ed", series: "p4",
      sides: [
        { state: "T", label: "suena t", word: "worked", note: "Después de p, k, f, s, sh, ch", steps: [
          { t: "Después de sonidos sin voz suena t: «worked» se dice «workt».", at: "tongueTip" },
          { t: "La punta toca la encía y corta, sin agregar vocal.", at: "ridge" }] },
        { state: "D", label: "suena d", word: "played", note: "Después de vocales y sonidos con voz", steps: [
          { t: "Después de vocales, b, g, v, z, m, n, l, r suena d: «played» se dice «playd».", at: "tongueTip" },
          { t: "Misma posición que la t, pero con voz.", at: "larynx" }] },
        { state: "IH", label: "suena id", word: "wanted", note: "Solo después de t o d", steps: [
          { t: "Solo después de t o d se agrega una sílaba: «want-id», «need-id».", at: null }] }
      ],
      check: "«Worked» tiene una sola sílaba. Si decís «wor-ked», agregaste una que no existe.",
      error: "Se pronuncia «ed» siempre, o se la deja muda. Las dos cosas borran el pasado del verbo.",
      words: ["worked", "played", "wanted", "asked", "called", "needed", "watched"]
    },
    s_cluster: {
      title: "s + consonante", ex: "speak, no «espeak»", focus: ["S"], series: "p3",
      sides: [
        { state: "ES_E", label: "la e que sobra", note: "La e que agregamos sin darnos cuenta", steps: [
          { t: "En español ninguna palabra empieza con «sp» o «st», por eso aparece una e: «espeak».", at: "dorsum" }] },
        { state: "S", label: "arrancá con sss", word: "speak", note: "La boca ya en posición de s", steps: [
          { t: "Antes de hablar, poné la boca en s: dientes casi juntos.", at: "tongueTip" },
          { t: "Empezá con un siseo largo: «sss».", at: "lips" },
          { t: "Sin vocal en el medio, pasá a la consonante: «sss-peak».", at: null }] }
      ],
      check: "Grabate diciendo «Spain» y escuchá el principio: no tiene que haber ninguna e antes de la s.",
      error: "«Espeak», «estudent», «eschool»: la e de más es uno de los rasgos que más delatan el acento.",
      words: ["speak", "Spain", "student", "school", "small", "street"]
    },
    ng: {
      title: "ng final", ex: "thing · going", focus: ["NG", "N"], series: "p11",
      sides: [
        { state: "N", label: "n", word: "thin", note: "La punta toca la encía", steps: [
          { t: "En la n, la punta de la lengua toca la encía.", at: "tongueTip" }] },
        { state: "NG", label: "ng", word: "thing", note: "Atrás de la lengua contra el paladar blando", steps: [
          { t: "Dejá la punta abajo, detrás de los dientes.", at: "tongueTip" },
          { t: "Subí la parte de atrás de la lengua hasta tocar el paladar blando, como para una g.", at: "dorsum" },
          { t: "Que el sonido salga por la nariz, sin pronunciar la g.", at: "nose" }] }
      ],
      check: "Tapate la nariz: en la ng el sonido se corta, porque sale por la nariz.",
      error: "Se termina con n («thin» en vez de «thing») o se agrega una g fuerte al final.",
      words: ["thing", "sing", "long", "working", "morning", "going"]
    }
  };
  const GROUPS = [
    { name: "Vocales", ids: ["ih_iy", "ae", "schwa", "uh_uw", "ou"] },
    { name: "Consonantes", ids: ["v_b", "th", "dh", "h", "y", "sh_ch", "z_s", "r", "ptk"] },
    { name: "Finales y grupos", ids: ["ed", "s_cluster", "ng"] }
  ];
  /* de los avisos del análisis a la guía que corresponde */
  const BY_ISSUE = { S_CLUSTER: "s_cluster", TH: "th", DH: "dh", V: "v_b", H: "h", Y: "y", IH: "ih_iy", IY: "ih_iy", AE: "ae", AH: "schwa", Z: "z_s", ED: "ed", SH: "sh_ch", CH: "sh_ch", NG: "ng", ER: "r", R: "r", W: "uh_uw" };
  const BY_RULE = { IH_IY: "ih_iy", IY_IH: "ih_iy", V_B: "v_b", B_V: "v_b", HH_0: "h", HH_ADD: "h", Y_JH: "y", Y_SH: "y", JH_Y: "y", SH_Y: "y", SH_CH: "sh_ch", CH_SH: "sh_ch", TH_T: "th", TH_S: "th", TH_F: "th", T_TH: "th", S_TH: "th", F_TH: "th", DH_D: "dh", D_DH: "dh", AE_EH: "ae", AE_AH: "ae", AH_AE: "ae", EH_AE: "ae", AH_AA: "ae", AA_AH: "ae", UH_UW: "uh_uw", UW_UH: "uh_uw", Z_S: "z_s", S_Z: "z_s", S_0: "z_s", ED_0: "ed", ED_ADD: "ed", NG_N: "ng", AO_OW: "ou", OW_AO: "ou", P_B: "ptk", K_G: "ptk" };
  /* una línea por sonido, para la palabra en cámara lenta */
  const HINT = {
    IY: "labios estirados, lengua alta y adelante", IH: "relajada y corta, casi una e", EY: "de e a i", EH: "como la e española", AE: "boca bien abierta y estirada, entre a y e", AH: "a corta y floja", AX: "débil y relajada, casi sin abrir", AA: "boca abierta, lengua baja y atrás", AO: "o abierta, labios algo redondos", OW: "de o a u, cerrando los labios", UH: "u corta y floja", UW: "trompita, larga", ER: "lengua arriba sin tocar, labios algo redondos", AY: "de a a i", AW: "de a a u", OY: "de o a i",
    P: "labios juntos y soplido al soltar", B: "labios juntos, con voz", M: "labios juntos, el aire sale por la nariz", F: "dientes sobre el labio, sin voz", V: "dientes sobre el labio, con voz", TH: "lengua entre los dientes, sin voz", DH: "lengua entre los dientes, con voz", T: "punta en la encía y soplido", D: "punta en la encía, con voz", N: "punta en la encía, aire por la nariz", S: "siseo, sin voz", Z: "zumbido, con voz", SH: "continuo, labios hacia afuera", ZH: "como sh, con voz", CH: "golpe de lengua y sh", JH: "golpe con voz, como «dy»", K: "atrás de la lengua y soplido", G: "atrás de la lengua, con voz", NG: "atrás de la lengua, por la nariz, sin g", L: "punta en la encía, el aire pasa por los costados", R: "punta arriba sin tocar", W: "trompita y abrir rápido", Y: "como una i rápida, sin roce", HH: "soplido suave desde la garganta"
  };
  G.VOZ_SOUNDS = { GUIDES, GROUPS, BY_ISSUE, BY_RULE, HINT };
})(typeof window !== "undefined" ? window : globalThis);
