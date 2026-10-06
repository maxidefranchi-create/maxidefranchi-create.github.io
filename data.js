/* Contenido del laboratorio de voz */
(function (G) {
  "use strict";
  const CONTRASTS = [
    { id: "ih_iy", name: "i corta y i larga", ex: "ship · sheep", pairs: [["ship", "sheep"], ["sit", "seat"], ["live", "leave"], ["fill", "feel"], ["hit", "heat"], ["rich", "reach"], ["chip", "cheap"], ["slip", "sleep"]] },
    { id: "v_b", name: "v y b", ex: "very · berry", pairs: [["very", "berry"], ["vote", "boat"], ["van", "ban"], ["vest", "best"], ["vet", "bet"]] },
    { id: "h", name: "la h", ex: "hat · at", pairs: [["hat", "at"], ["heat", "eat"], ["hair", "air"], ["hold", "old"], ["hear", "ear"], ["high", "eye"], ["hill", "ill"]] },
    { id: "y", name: "la y inglesa", ex: "yes · jet", pairs: [["yet", "jet"], ["yell", "shell"], ["you", "shoe"], ["year", "sheer"], ["yolk", "joke"], ["yam", "jam"]] },
    { id: "sh_ch", name: "sh y ch", ex: "ship · chip", pairs: [["ship", "chip"], ["share", "chair"], ["sheep", "cheap"], ["wash", "watch"], ["shoes", "choose"], ["cash", "catch"]] },
    { id: "th", name: "th sin voz", ex: "think · sink", pairs: [["think", "sink"], ["thick", "sick"], ["three", "tree"], ["thank", "tank"], ["thin", "tin"], ["thought", "taught"], ["path", "pass"], ["mouth", "mouse"]] },
    { id: "dh", name: "th con voz", ex: "they · day", pairs: [["they", "day"], ["then", "den"], ["those", "doze"], ["though", "dough"]] },
    { id: "ae", name: "a abierta", ex: "cat · cut · bed", pairs: [["cat", "cut"], ["hat", "hut"], ["bag", "bug"], ["cap", "cup"], ["bad", "bed"], ["man", "men"], ["sad", "said"], ["pan", "pen"]] },
    { id: "uh_uw", name: "u corta y u larga", ex: "full · fool", pairs: [["full", "fool"], ["pull", "pool"]] },
    { id: "z_s", name: "z y s", ex: "zoo · sue", pairs: [["zoo", "sue"], ["rise", "rice"], ["eyes", "ice"], ["prize", "price"], ["peas", "peace"], ["lose", "loose"]] },
    { id: "ed", name: "terminación -ed", ex: "worked · work", pairs: [["worked", "work"], ["played", "play"], ["watched", "watch"], ["asked", "ask"], ["called", "call"], ["launched", "launch"]] }
  ];

  const SERIES = [
    { id: "p1", title: "Vocales cortas y largas", sound: "ship · sheep", s: ["Please sit in this seat and read the list.", "I live here, but I want to leave next week.", "The ship was full of sheep."] },
    { id: "p2", title: "V, B y la H", sound: "very · berry · hat", s: ["Very busy voters visit the village every evening.", "He has a house on the hill.", "We have a very big van."] },
    { id: "p3", title: "S con consonante", sound: "speak, no espeak", s: ["Spain is a special place.", "Students study in a small school.", "The speaker started his speech."] },
    { id: "p4", title: "Terminación -ed", sound: "worked · played · wanted", s: ["I worked, played, and waited all day.", "We launched the campaign and posted the video.", "She wanted to know what happened."] },
    { id: "p5", title: "El sonido TH", sound: "think · this", s: ["I think this is the third thing.", "They thought the weather was better on Thursday.", "My brother and my father are both there."] },
    { id: "p6", title: "La y y la sh", sound: "yes · she · chair", s: ["Yes, I used to live here years ago.", "You should choose your shoes.", "She shared her chair with you."] },
    { id: "p7", title: "La a abierta", sound: "cat · bad · man", s: ["That man has a bad back.", "The cat sat on my hat.", "Thanks for the black jacket."] },
    { id: "p8", title: "Z y s", sound: "zoo · rise · news", s: ["He was busy with his news.", "These prices always rise.", "She closes the doors at noon."] },
    { id: "p9", title: "Tu trabajo", sound: "campaign · strategy", s: ["The government launched a new communication strategy.", "Our audience engagement grew this quarter.", "The minister will make a statement this afternoon."] },
    { id: "p10", title: "Reuniones", sound: "schedule · report", s: ["Let's schedule a meeting for Thursday.", "I'll send you the report by email.", "Could we move the call to the afternoon?"] },
    { id: "p11", title: "Presentarte", sound: "small talk", s: ["Nice to meet you. Where are you from?", "I work in communications for the government.", "How long have you been here?"] },
    { id: "p12", title: "Viajes", sound: "hotel · airport", s: ["I'd like to check in, please.", "Is breakfast included in the price?", "Where is the nearest station?"] }
  ];

  const SHADOW = [
    "How's it going?", "Could you say that again?", "I'm not sure I follow.", "That makes sense.", "Let me think about it.",
    "What do you mean by that?", "I'll get back to you.", "Sorry, I'm running late.", "Can you speak a bit slower?", "It was nice talking to you.",
    "I totally agree with you.", "Let's keep in touch.", "I'm looking forward to it.", "Thanks for having me.", "What do you do for a living?",
    "I've been working here for a few years.", "We need to talk about the budget.", "Could you send me the details?", "I'd like to make a reservation.", "Where is the nearest station?",
    "That's a great question.", "I see what you mean.", "Let's move on to the next point.", "Can I ask you something?", "It depends on the context."
  ];

  const PROMPTS = [
    { en: "Tell me about your job.", es: "Contá en qué trabajás." },
    { en: "What did you do last weekend?", es: "Qué hiciste el último fin de semana." },
    { en: "Describe your neighborhood.", es: "Describí tu barrio." },
    { en: "What was the last campaign you worked on?", es: "La última campaña en la que trabajaste." },
    { en: "What do you like about Buenos Aires?", es: "Qué te gusta de Buenos Aires." },
    { en: "Where would you like to travel next?", es: "A dónde te gustaría viajar." },
    { en: "How do you usually start your day?", es: "Cómo arrancás el día." },
    { en: "What are you learning right now?", es: "Qué estás aprendiendo ahora." }
  ];

  const TIPS = {
    IH_IY: "Tu i sonó larga, como en «{alt}». En «{word}» la i es corta y floja: boca relajada, casi entre i y e, y bien breve.",
    IY_IH: "Sonó corta, como «{alt}». En «{word}» la i es larga: estirá los labios como sonriendo y sostenela, iii.",
    UH_UW: "Sonó como «{alt}», con u larga. En «{word}» la u es corta y floja, con los labios apenas redondeados.",
    UW_UH: "Sonó como «{alt}». En «{word}» la u es larga: labios bien redondeados hacia adelante y sostenida, uuu.",
    AE_EH: "Sonó como «{alt}», con e. La a de «{word}» es muy abierta: bajá bien la mandíbula, un sonido entre a y e.",
    AE_AH: "Sonó como «{alt}». La a de «{word}» es abierta y tensa: mandíbula abajo y labios estirados.",
    AH_AE: "Sonó como «{alt}». La vocal de «{word}» es una a corta y relajada, como una a española rápida y floja.",
    EH_AE: "Sonó como «{alt}». En «{word}» va una e española normal, sin abrir tanto la boca.",
    AH_AA: "Sonó como «{alt}». La vocal de «{word}» es corta y relajada, no una a larga.",
    AA_AH: "Sonó como «{alt}». La vocal de «{word}» es una a larga y abierta, con la boca bien abierta.",
    AO_OW: "Sonó como «{alt}». La vocal de «{word}» es una o abierta, sin deslizar hacia u.",
    OW_AO: "Sonó como «{alt}». En «{word}» la o se desliza hacia u, como «ou».",
    V_B: "Sonó con b, como «{alt}». La v se hace con los dientes de arriba apoyados en el labio de abajo, y vibra: vvv.",
    B_V: "Sonó con v, como «{alt}». En «{word}» la b se hace cerrando los dos labios.",
    HH_0: "No se escuchó la h: sonó «{alt}». Soltá aire antes de la vocal, como un suspiro suave. No es la j española.",
    TH_T: "Sonó como «{alt}», con t. Para la th de «{word}», sacá apenas la punta de la lengua entre los dientes y soplá sin voz.",
    TH_S: "Sonó como «{alt}», con s. La th de «{word}» se hace con la lengua entre los dientes, como la z de España.",
    TH_F: "Sonó como «{alt}», con f. La th de «{word}» se hace con la lengua entre los dientes, no con los labios.",
    DH_D: "Sonó como «{alt}», con d. La th de «{word}» vibra: lengua entre los dientes y con voz, como una d muy suave.",
    Z_S: "Sonó como «{alt}», con s. Esa s en inglés suena z: vibra, como una abeja, zzz.",
    S_Z: "Sonó como «{alt}», con z. En «{word}» la s es sorda, sin vibrar.",
    SH_CH: "Sonó como «{alt}», con ch. La sh es un sonido continuo, como cuando pedís silencio: shhh, sin golpe.",
    CH_SH: "Sonó como «{alt}», sin golpe. La ch de «{word}» arranca con un golpe de lengua, como la ch española.",
    Y_JH: "Sonó como «{alt}», con y fuerte. La y inglesa es suave, casi una i: «{word}» arranca como «i».",
    Y_SH: "Sonó como «{alt}», con la y argentina. La y inglesa es suave, casi una i: «{word}» arranca como «i».",
    JH_Y: "Sonó como «{alt}». La j de «{word}» es fuerte, como la ll/y argentina con golpe: dch.",
    SH_Y: "Sonó como «{alt}». En «{word}» va sh, como cuando pedís silencio.",
    NG_N: "Sonó como «{alt}». La ng final se hace con la parte de atrás de la lengua contra el paladar, sin pronunciar la g.",
    ED_0: "No se escuchó la terminación: sonó «{alt}». Cerrá «{word}» con una t o d corta y suave.",
    ED_ADD: "Sonó como «{alt}». En «{word}» no hay terminación: cortá la palabra limpia.",
    S_0: "Se perdió la s final: sonó «{alt}». Marcá la s del final.",
    HH_ADD: "Sonó como «{alt}», con h. «{word}» arranca directo con la vocal, sin aire antes.",
    P_B: "Sonó como «{alt}», con b. La p inglesa al principio sale con un soplido de aire: p-h.",
    K_G: "Sonó como «{alt}», con g. La k inglesa al principio sale con un soplido de aire: k-h.",
    ANY: "Sonó como «{alt}». Escuchá el modelo en lento y repetí exagerando el sonido que cambia."
  };

  const ADVICE = {
    ih_iy: "La i corta (ship) es floja y breve, casi entre i y e. La i larga (sheep) se estira con los labios como sonriendo.",
    v_b: "Para la v, dientes de arriba sobre el labio de abajo y que vibre. Para la b, los dos labios se juntan.",
    h: "La h inglesa es un soplido suave antes de la vocal. No es muda ni es la j española.",
    y: "La y inglesa es suave, casi una i. No uses la y argentina (sh) ni una y fuerte (dch).",
    sh_ch: "La sh es continua, como pedir silencio. La ch arranca con un golpe de lengua.",
    th: "Lengua entre los dientes y soplido sin voz. Ni t, ni s, ni f.",
    dh: "Lengua entre los dientes, con voz, como una d muy suave.",
    ae: "La a de cat es muy abierta: mandíbula abajo, entre a y e. La de cut es corta y floja.",
    uh_uw: "La u de full es corta y floja. La de fool es larga, con labios redondeados.",
    z_s: "La z vibra como una abeja. La s solo sopla.",
    ed: "Después de sonidos sordos la -ed suena t (workt). Después de sonoros, d (playd). Solo después de t o d se agrega sílaba (wan-tid)."
  };


  const ISSUE = {
    S_CLUSTER: "En «{word}» arrancá directo con la s, sin una e adelante: sss…",
    TH: "La th de «{word}»: punta de la lengua entre los dientes y soplá sin voz.",
    DH: "La th de «{word}» vibra: lengua entre los dientes y con voz, como una d muy suave.",
    V: "La v de «{word}»: dientes de arriba sobre el labio de abajo, y que vibre.",
    H: "La h de «{word}» es un soplido suave antes de la vocal. No es muda ni es una j.",
    Y: "La y de «{word}» es suave, casi una i. No la hagas como la y argentina.",
    IH: "La i de «{word}» es corta y floja, casi entre i y e.",
    AE: "La a de «{word}» es muy abierta, entre a y e: bajá bien la mandíbula.",
    Z: "La s final de «{word}» suena z: que vibre.",
    ED: "La terminación de «{word}» es corta, una t o una d, sin agregar sílaba.",
    SH: "La sh de «{word}» es continua, como cuando pedís silencio: shhh.",
    CH: "La ch de «{word}» arranca con un golpe de lengua.",
    NG: "La ng de «{word}» se hace con la parte de atrás de la lengua, sin pronunciar la g.",
    ER: "La vocal con r de «{word}» se hace con la lengua curvada hacia atrás, sin vibrar.",
    R: "La r de «{word}» no vibra: la lengua no toca el paladar y se curva un poco hacia atrás.",
    AH: "La vocal de «{word}» es una a corta y relajada.",
    IY: "La i de «{word}» es larga: estirá los labios y sostenela.",
    W: "La w de «{word}» suena como una u rápida, con los labios redondeados.",
    GENERIC: "Escuchá «{word}» en lento y repetila marcando cada sonido."
  };

  G.VOZ_DATA = { CONTRASTS, SERIES, SHADOW, PROMPTS, TIPS, ADVICE, ISSUE };
})(typeof window !== "undefined" ? window : globalThis);
