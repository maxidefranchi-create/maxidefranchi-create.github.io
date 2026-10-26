/* Boca: dibujo animado de cómo se articula cada sonido.
   Corte lateral (labios, dientes, lengua, paladar, velo, garganta) y vista de frente de los labios.
   Todo se calcula con parámetros, así se puede animar de un sonido al otro. */
(function (G) {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const PIV = [112, 96];                 // articulación de la mandíbula
  const MAXJ = 12 * Math.PI / 180;       // apertura máxima en el habla
  const lerp = (a, b, t) => a + (b - a) * t;
  const L2 = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  const f1 = (n) => Math.round(n * 10) / 10;
  const P = (p) => f1(p[0]) + " " + f1(p[1]);
  const rot = (p, a) => { const dx = p[0] - PIV[0], dy = p[1] - PIV[1], c = Math.cos(a), s = Math.sin(a); return [PIV[0] + dx * c - dy * s, PIV[1] + dx * s + dy * c]; };
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  /* Curva suave que pasa por todos los puntos (Catmull-Rom convertida a Bézier). */
  function through(pts, move) {
    let d = move === false ? "" : "M" + P(pts[0]);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += "C" + P(c1) + " " + P(c2) + " " + P(p2);
    }
    return d;
  }
  const poly = (pts) => "M" + pts.map(P).join("L") + "Z";

  /* ---------- anatomía fija ---------- */
  const PAL = [[240, 141], [234, 133], [224, 126], [210, 121], [194, 118], [176, 118], [158, 120]];     // paladar, cara de la boca
  const PALN = [[247, 131], [236, 123], [222, 117], [206, 113], [188, 111], [170, 111], [158, 113]];    // paladar, cara de la nariz
  const WALL = [[126, 98], [117, 110], [114, 124], [113, 150], [114, 180], [116, 210], [119, 238], [121, 262]];
  const VEL_UP = { o: [[158, 120], [148, 122.5], [138, 124], [129, 124.5]], t: [119.5, 118], n: [[121, 110], [133, 108], [147, 110], [158, 113]] };
  const VEL_DN = { o: [[158, 120], [151, 128], [145.5, 138], [142, 148]], t: [137, 154], n: [[132.5, 149], [134.5, 136], [144, 121], [158, 113]] };
  const UPPER_INC = "M252 137C253.5 146 252.5 156 249.5 163.5L247.3 163.5C245.5 157 242.5 150.5 241.3 144C240.8 140.5 242.5 138 246 137Z";
  const LOWER_INC = [[244, 164], [246.5, 169], [248, 176], [247.5, 184], [240.5, 184], [239.5, 177], [240.5, 170], [242, 165.5]];
  const FACE_TOP = [[241, 72], [250, 84], [262, 96], [275, 104.5], [282, 109], [280.5, 115], [271, 118.5], [262, 119.5]];
  const TIP_REST = [237, 173];
  const NOSTRIL_OUT = [[266, 119], [262, 121]];

  /* ---------- sonidos ----------
     jaw: mandíbula 0..1 · r: labios redondos · s: estirados · c: labios cerrados · l: labio inferior contra los dientes
     B, D, F, T: puntos de la lengua (raíz, dorso, lámina, punta) · tip: "rest" = punta apoyada detrás de los dientes de abajo
     v: velo bajo (aire por la nariz) · voice: vibra la garganta · fr: fricción · st: cierre · asp: soplido · dental: punta entre los dientes */
  const BASE = { flow: 1, jaw: 0.2, r: 0, s: 0, c: 0, l: 0, B: [134, 199], D: [170, 146], F: [212, 158], T: "rest", v: 0, voice: 1, fr: 0, st: 0, asp: 0, dental: 0, k: null };
  const RAW = {
    IY: { jaw: 0.06, s: 0.8, B: [139, 189], D: [204, 127], F: [226, 135] },
    IH: { jaw: 0.18, s: 0.3, B: [137, 194], D: [199, 134], F: [223, 144] },
    EH: { jaw: 0.36, s: 0.4, B: [135, 199], D: [193, 143], F: [220, 155] },
    AE: { jaw: 0.82, s: 0.6, B: [133, 204], D: [188, 157], F: [222, 166] },
    AH: { jaw: 0.45, B: [132, 206], D: [167, 153], F: [210, 164] },
    AX: { jaw: 0.22, B: [133, 202], D: [171, 146], F: [212, 158] },
    AA: { jaw: 0.86, B: [129, 214], D: [150, 162], F: [204, 172] },
    AO: { jaw: 0.6, r: 0.55, B: [129, 210], D: [146, 152], F: [200, 166] },
    UH: { jaw: 0.24, r: 0.5, B: [132, 201], D: [149, 138], F: [196, 156] },
    UW: { jaw: 0.14, r: 1, B: [133, 197], D: [146, 130], F: [192, 151] },
    ER: { jaw: 0.2, r: 0.45, B: [129, 206], D: [168, 141], F: [214, 139], T: [225, 141] },
    P: { jaw: 0.06, c: 1, voice: 0, st: 1, asp: 1 },
    B: { jaw: 0.06, c: 1, st: 1 },
    M: { jaw: 0.06, c: 1, v: 1 },
    F: { jaw: 0.1, l: 1, voice: 0, fr: 1 },
    V: { jaw: 0.1, l: 1, fr: 1 },
    TH: { jaw: 0.16, voice: 0, fr: 1, dental: 1, D: [190, 143], F: [234, 152], T: [254, 163.5] },
    DH: { jaw: 0.16, fr: 1, dental: 1, D: [190, 143], F: [234, 152], T: [254, 163.5] },
    T: { jaw: 0.1, voice: 0, st: 1, asp: 1, D: [186, 141], F: [222, 141], T: [238.5, 139.5] },
    D: { jaw: 0.1, st: 1, D: [186, 141], F: [222, 141], T: [238.5, 139.5] },
    N: { jaw: 0.1, v: 1, D: [186, 141], F: [222, 141], T: [238.5, 139.5] },
    S: { jaw: 0.04, s: 0.4, voice: 0, fr: 1, D: [189, 138], F: [222, 144], T: [236.5, 145] },
    Z: { jaw: 0.04, s: 0.4, fr: 1, D: [189, 138], F: [222, 144], T: [236.5, 145] },
    SH: { jaw: 0.07, r: 0.7, voice: 0, fr: 1, D: [192, 134], F: [224, 131.5], T: [236.5, 156] },
    ZH: { jaw: 0.07, r: 0.7, fr: 1, D: [192, 134], F: [224, 131.5], T: [236.5, 156] },
    CH: { jaw: 0.07, r: 0.5, voice: 0, st: 1, D: [192, 133], F: [225, 127], T: [237, 152] },
    JH: { jaw: 0.07, r: 0.5, st: 1, D: [192, 133], F: [225, 127], T: [237, 152] },
    K: { jaw: 0.15, voice: 0, st: 1, asp: 1, B: [135, 196], D: [152, 119.5], F: [196, 133] },
    G: { jaw: 0.15, st: 1, B: [135, 196], D: [152, 119.5], F: [196, 133] },
    NG: { jaw: 0.15, v: 1, B: [135, 196], D: [148, 127], F: [196, 140] },
    L: { jaw: 0.14, B: [130, 206], D: [166, 147], F: [226, 146], T: [238.5, 139.5] },
    R: { jaw: 0.14, r: 0.5, B: [129, 207], D: [172, 146], F: [214, 140], T: [226, 142] },
    W: { jaw: 0.08, r: 1, B: [133, 196], D: [146, 127], F: [192, 150] },
    Y: { jaw: 0.06, s: 0.7, B: [139, 188], D: [206, 124], F: [227, 132] },
    HH: { jaw: 0.3, voice: 0, fr: 0.6, B: [134, 200], D: [178, 146], F: [214, 157] },
    /* como suenan en español rioplatense */
    ES_B: { jaw: 0.08, c: 1, st: 0.6 },
    ES_J: { jaw: 0.18, voice: 0, fr: 1, B: [135, 197], D: [153, 125], F: [197, 140] },
    ES_SH: { jaw: 0.07, r: 0.35, fr: 1, D: [192, 134], F: [224, 131.5], T: [236.5, 156] },
    ES_R: { jaw: 0.12, st: 0.6, D: [182, 143], F: [222, 142], T: [238.5, 139.5] },
    ES_I: { jaw: 0.08, s: 0.6, B: [139, 190], D: [203, 128], F: [226, 136] },
    ES_E: { jaw: 0.28, s: 0.4, B: [136, 197], D: [195, 139], F: [221, 151] },
    ES_A: { jaw: 0.7, B: [132, 207], D: [172, 160], F: [214, 168] },
    ES_U: { jaw: 0.12, r: 0.8, B: [133, 197], D: [147, 132], F: [193, 151] },
    ES_O: { jaw: 0.38, r: 0.6, B: [131, 204], D: [151, 145], F: [198, 160] },
    ES_T: { jaw: 0.1, voice: 0, st: 1, D: [188, 142], F: [228, 147], T: [246, 152] },
    ES_S: { jaw: 0.04, s: 0.4, voice: 0, fr: 1, D: [189, 138], F: [222, 144], T: [236.5, 145] },
    REST: { jaw: 0.04, voice: 0, flow: 0, v: 1 }
  };
  const STATES = {};
  function build(name) {
    const o = Object.assign({}, BASE, RAW[name]);
    if (o.T === "rest") o.T = rot(TIP_REST, o.jaw * MAXJ);
    o.name = name;
    return o;
  }
  Object.keys(RAW).forEach((k) => (STATES[k] = build(k)));
  /* diptongos: dos posiciones seguidas */
  const DIPH = { EY: ["ES_E", "IY"], AY: ["AA", "IH"], AW: ["AA", "UH"], OY: ["AO", "IY"], OW: ["ES_O", "UH"] };

  /* nombres para mostrar */
  const LABEL = {
    IY: "i larga", IH: "i corta", EY: "ei", EH: "e", AE: "a abierta", AH: "a corta", AX: "schwa", AA: "a larga", AO: "o abierta", OW: "ou", UH: "u corta", UW: "u larga", ER: "er", AY: "ai", AW: "au", OY: "oi",
    P: "p", B: "b", M: "m", F: "f", V: "v", TH: "th sorda", DH: "th sonora", T: "t", D: "d", N: "n", S: "s", Z: "z", SH: "sh", ZH: "zh", CH: "ch", JH: "j", K: "k", G: "g", NG: "ng", L: "l", R: "r", W: "w", Y: "y", HH: "h",
    ES_B: "b/v en español", ES_J: "j española", ES_SH: "ll/y argentina", ES_R: "r española", ES_I: "i española", ES_E: "e española", ES_A: "a española", ES_U: "u española", ES_O: "o española", ES_T: "t española", ES_S: "s española", REST: "boca en reposo"
  };
  const IPA = { IY: "iː", IH: "ɪ", EY: "eɪ", EH: "e", AE: "æ", AH: "ʌ", AX: "ə", AA: "ɑː", AO: "ɔː", OW: "oʊ", UH: "ʊ", UW: "uː", ER: "ɜr", AY: "aɪ", AW: "aʊ", OY: "ɔɪ", P: "p", B: "b", M: "m", F: "f", V: "v", TH: "θ", DH: "ð", T: "t", D: "d", N: "n", S: "s", Z: "z", SH: "ʃ", ZH: "ʒ", CH: "tʃ", JH: "dʒ", K: "k", G: "g", NG: "ŋ", L: "l", R: "r", W: "w", Y: "j", HH: "h" };

  /* ---------- interpolación ---------- */
  const NUM = ["jaw", "r", "s", "c", "l", "v", "voice", "fr", "st", "asp", "dental", "flow"];
  const PTS = ["B", "D", "F", "T"];
  function mix(a, b, t) {
    const o = { name: t < 0.5 ? a.name : b.name };
    NUM.forEach((k) => (o[k] = lerp(a[k], b[k], t)));
    PTS.forEach((k) => (o[k] = L2(a[k], b[k], t)));
    o.k = t < 0.5 ? a.k : b.k;
    return o;
  }

  /* ---------- geometría derivada de un estado ---------- */
  function geom(S) {
    const a = S.jaw * MAXJ, J = (p) => rot(p, a);
    /* labio de arriba (fijo + redondeo, cierre) */
    const ur = S.r * 6, us = S.s * 1.5;
    let U = { S0: [256, 124], S1: [259, 136], S2: [264.5 + ur * 0.8, 145], S3: [268.5 + ur - us, 151.5 + S.r * 0.5], S4: [266 + ur - us, 157.5 + S.c * 0.8 - S.l * 2], St: [258.5 + ur * 0.8 - us, 160 + S.c * 0.6 - S.l * 1.5], I1: [253, 158 - S.l], I2: [251.5, 149] };
    /* labio de abajo (sigue a la mandíbula) */
    const lr = S.r * 6;
    let Lb = { St: [258 + lr * 0.8, 161 - S.r * 1.5], Q1: [265.5 + lr, 165 - S.r * 1.5], Q2: [268.5 + lr - S.s, 172 - S.r], Q3: [264 + lr * 0.5, 181], Q4: [254, 188], C1: [259, 203], C2: [256, 219], C3: [240, 229], C4: [214, 236], J1: [253, 163], J2: [249.5, 169] };
    Object.keys(Lb).forEach((k) => (Lb[k] = J(Lb[k])));
    if (S.c > 0) { /* labios cerrados: el de abajo sube a encontrarse con el de arriba */
      const dy = (U.St[1] + 0.4) - Lb.St[1], dx = (U.St[0] + 0.5) - Lb.St[0];
      [["St", 1], ["Q1", 0.9], ["J1", 0.9], ["Q2", 0.55], ["J2", 0.5], ["Q3", 0.25]].forEach(([k, w]) => { Lb[k] = [Lb[k][0] + dx * w * S.c, Lb[k][1] + dy * w * S.c]; });
    }
    if (S.l > 0) { /* labio de abajo contra el borde de los dientes de arriba */
      const tgt = { St: [250.5, 163.6], Q1: [257.5, 165.5], J1: [246.5, 167], Q2: [263, 172], J2: [245.5, 172] };
      Object.keys(tgt).forEach((k) => { Lb[k] = L2(Lb[k], tgt[k], S.l); });
    }
    /* incisivos de abajo */
    const LI = LOWER_INC.map(J);
    /* piso de la boca */
    const half = (p) => rot(p, a * 0.55);
    const floor = [J([236, 193]), J([222, 203]), half([192, 218]), half([160, 232]), rot([140, 239], a * 0.25)];
    /* velo */
    const V = { o: VEL_UP.o.map((p, i) => L2(p, VEL_DN.o[i], S.v)), t: L2(VEL_UP.t, VEL_DN.t, S.v), n: VEL_UP.n.map((p, i) => L2(p, VEL_DN.n[i], S.v)) };
    /* lengua */
    const R0 = rot([140, 242], a * 0.25);
    const T = S.T, F = S.F, D = S.D, B = S.B;
    const tipUp = Math.max(0, (rot(TIP_REST, a)[1] - T[1]) / 30); // cuánto se levantó la punta
    const tu = Math.min(1, tipUp);
    /* parte de abajo de la lengua: pegada a los dientes de abajo, o con un hueco si la punta sube */
    const Tu = L2([T[0] + 1.5, T[1] + 6], [T[0] - 7, T[1] + 8], tu);
    const Tm = L2(J([239.8, 181]), [T[0] - 12, T[1] + 26], tu);
    const U1 = L2(J([239.5, 186]), J([234, 190]), tu);
    /* lomo de la lengua: un punto extra atrás para que quede redondeada */
    const Bt = [B[0] + (D[0] - B[0]) * 0.3, D[1] + (B[1] - D[1]) * 0.22];
    return { a, J, U, Lb, LI, floor, V, R0, T, F, D, B, Bt, Tu, Tm, U1, tipUp };
  }

  function paths(S, g) {
    const { U, Lb, LI, floor, V } = g;
    const out = {};
    /* piel: cabeza (fija), cuello (fijo), mandíbula (gira) */
    out.skinUp = "M96 70L241 70" + through(FACE_TOP, false) + through([U.S0, U.S1, U.S2, U.S3, U.S4, U.St], false).replace(/^/, "L" + P(U.S0)) + "L" + P(U.I1) + "L" + P(U.I2) + "L240 150L150 156L96 156Z";
    out.skinJaw = "M" + P(Lb.St) + through([Lb.St, Lb.Q1, Lb.Q2, Lb.Q3, Lb.Q4, Lb.C1, Lb.C2, Lb.C3, Lb.C4], false) + "L" + P(rot([170, 240], g.a)) + "L" + P(rot([120, 200], g.a * 0.6)) + "L" + P(rot([112, 140], g.a * 0.3)) + "L200 160L" + P(Lb.J2) + "L" + P(Lb.J1) + "Z";
    out.skinNeck = "M96 140L196 140L" + P(Lb.C4) + "C" + P([Lb.C4[0] - 6, Lb.C4[1] + 14]) + " 205 262 206 286L96 286Z";
    /* aire: boca + faringe */
    const velWallIdx = 2;
    const oral = [[249.4, 163.4], [246, 156], [242.5, 149], [240, 141]].concat(PAL.slice(1), V.o.slice(1), [V.t]);
    /* pared de la faringe desde donde termina el velo */
    const wallAt = (y) => { for (let i = 0; i < WALL.length - 1; i++) { const a = WALL[i], b = WALL[i + 1]; if (y >= a[1] && y <= b[1]) return [lerp(a[0], b[0], (y - a[1]) / (b[1] - a[1])), y]; } return [116, y]; };
    const wallBelow = [wallAt(V.t[1] + 1)].concat(WALL.filter((p) => p[1] > V.t[1] + 2));
    const oralPts = oral.concat(wallBelow, [[122, 288], [149, 288], [147, 262], [146, 248]], floor.slice().reverse(), [LI[4], LI[5], LI[6], LI[7], LI[0], Lb.J2, Lb.J1, Lb.St, U.St, U.I1, [251, 156]]);
    out.oral = poly(oralPts);
    /* aire: nariz */
    const nasal = [[126, 98], [140, 90], [170, 86], [205, 86], [232, 93], [248, 104], [258, 113], NOSTRIL_OUT[0], NOSTRIL_OUT[1], [256, 123]].concat(PALN, V.n.slice().reverse().slice(1), [V.t, wallAt(V.t[1] - 1)], WALL.filter((p) => p[1] < V.t[1] - 1 && p[1] > 100).reverse());
    out.nasal = poly(nasal);
    void velWallIdx;
    /* paladar duro (hueso) */
    out.palate = poly(PAL.concat(PALN.slice().reverse(), [[247, 131], [244, 136], [240.5, 139]]));
    /* velo */
    out.velum = "M" + P(V.o[0]) + through(V.o.concat([V.t]), false) + through([V.t].concat(V.n), false) + "Z";
    /* lengua (se recorta con el aire de la boca) */
    const up = [g.R0, g.B, g.Bt, g.D, g.F, g.T];
    out.tongueTop = through(up);
    out.tongue = through(up) + through([g.T, g.Tu, g.Tm, g.U1], false) + "L" + P([g.U1[0] - 2, g.U1[1] + 22]) + "L" + P([floor[1][0], floor[1][1] + 30]) + "L" + P([g.R0[0] + 20, g.R0[1] + 8]) + "Z";
    /* dientes */
    out.upperInc = UPPER_INC;
    out.lowerInc = "M" + P(LI[0]) + through([LI[0], LI[1], LI[2], LI[3]], false) + "L" + P(LI[4]) + through([LI[4], LI[5], LI[6], LI[7], LI[0]], false) + "Z";
    /* bermellón de los labios */
    out.lipUp = "M" + P(U.S2) + through([U.S2, U.S3, U.S4, U.St], false) + "L" + P(U.I1) + "L" + P([U.I1[0] + 1, U.S2[1] + 4]) + "Z";
    out.lipLo = "M" + P(Lb.St) + through([Lb.St, Lb.Q1, Lb.Q2, Lb.Q3], false) + "L" + P(L2(Lb.Q3, Lb.J2, 0.55)) + "L" + P(Lb.J2) + "L" + P(Lb.J1) + "Z";
    /* contorno */
    out.lineUp = "M241 72" + through(FACE_TOP, false) + "L" + P(U.S0) + through([U.S0, U.S1, U.S2, U.S3, U.S4, U.St], false);
    out.lineLo = "M" + P(Lb.St) + through([Lb.St, Lb.Q1, Lb.Q2, Lb.Q3, Lb.Q4, Lb.C1, Lb.C2, Lb.C3, Lb.C4], false) + "C" + P([Lb.C4[0] - 6, Lb.C4[1] + 14]) + " 205 262 206 286";
    out.lineFace = "M241 72C238 64 236 60 234 56";
    return out;
  }

  /* recorrido del aire */
  function flowPath(S, g) {
    const wallX = (y) => { for (let i = 0; i < WALL.length - 1; i++) { const a = WALL[i], b = WALL[i + 1]; if (y >= a[1] && y <= b[1]) return lerp(a[0], b[0], (y - a[1]) / (b[1] - a[1])); } return 116; };
    const palY = (x) => { for (let i = 0; i < PAL.length - 1; i++) { const a = PAL[i], b = PAL[i + 1]; if (x <= a[0] && x >= b[0]) return lerp(a[1], b[1], (a[0] - x) / (a[0] - b[0])); } return 120; };
    const pts = [[134, 268], [129, 246]];
    pts.push([(wallX(205) + g.B[0]) / 2, 205]);
    if (S.v > 0.5) { /* por la nariz */
      pts.push([(wallX(165) + g.Bt[0]) / 2, 165], [121, 128], [138, 102], [180, 96], [222, 99], [250, 110], [266, 119.5], [286, 126]);
      return pts;
    }
    const by = Math.min(g.Bt[1] - 6, 170);
    pts.push([(wallX(by) + Math.min(g.Bt[0], g.B[0] + 6)) / 2 - 1, by]);
    const dTop = palY(g.D[0]);
    pts.push([g.D[0] - 4, Math.min((dTop + g.D[1]) / 2, g.D[1] - 3)]);
    const fx = Math.min(g.F[0], 232), fTop = palY(fx);
    pts.push([fx, (fTop + g.F[1]) / 2]);
    if (S.st > 0.5 && S.c < 0.5) { /* cierre con la lengua: el aire se frena ahí */
      return pts.slice(0, -1).concat([[Math.min(g.F[0], 226) - 6, (palY(Math.min(g.F[0], 226) - 6) + g.F[1]) / 2 + 3]]).filter((p, i, arr) => i === 0 || p[0] >= arr[i - 1][0] - 30);
    }
    const lipMid = L2(g.U.St, g.Lb.St, 0.5);
    pts.push([246, (g.T[1] + 163) / 2 - (S.dental ? 4 : 0)]);
    if (S.c > 0.5) { pts.push([lipMid[0] - 6, lipMid[1]]); return pts; }
    pts.push([lipMid[0] + 2, lipMid[1]], [292, lipMid[1] + 1]);
    return pts;
  }

  /* puntos para marcar en el dibujo */
  function anchor(name, S, g) {
    const lipMid = L2(g.U.St, g.Lb.St, 0.5);
    switch (name) {
      case "lips": return [lipMid[0] + 9, lipMid[1]];
      case "upperLip": return [g.U.S3[0] + 3, g.U.S3[1] - 2];
      case "lowerLip": return [g.Lb.Q1[0] + 3, g.Lb.Q1[1] + 3];
      case "upperTeeth": return [249, 160];
      case "lowerTeeth": return g.LI[0];
      case "tongueTip": return g.T;
      case "blade": return g.F;
      case "dorsum": return [g.D[0], g.D[1] + 3];
      case "root": return [g.B[0] + 6, g.B[1]];
      case "ridge": return [237, 140];
      case "postridge": return [225, 127];
      case "palate": return [200, 119];
      case "velum": return g.V.t;
      case "larynx": return [134, 262];
      case "throat": return [131, 238];
      case "jaw": return g.Lb.C2;
      case "nose": return [264, 117];
      default: return [200, 150];
    }
  }

  /* ---------- vista de frente ---------- */
  function front(S) {
    const cx = 60, y0 = 64;
    const W = 27 * (1 + 0.08 * S.s - 0.4 * S.r);
    const shut = Math.max(S.c, S.l * 0.85);
    let h = (2 + 26 * S.jaw) * (1 - shut);
    if (S.dental) h = Math.max(h, 6);
    const hTop = h * 0.42, hBot = h * 0.58;
    const tu = 6.5 + 1.8 * S.r, tl = 8 + 2 * S.r;
    const Wi = lerp(W * 0.8, Math.max(4, 3.5 + h * 0.42), Math.min(1, S.r * 1.1));
    const bow = 1 - S.r * 0.6;
    const uo = `M${cx - W} ${y0}C${cx - W * 0.7} ${y0 - hTop - tu * 0.6} ${cx - 13} ${y0 - hTop - tu - 1} ${cx - 7} ${y0 - hTop - tu - 1.5 * bow}C${cx - 3} ${y0 - hTop - tu - 1.5 * bow} ${cx - 1.5} ${y0 - hTop - tu + 1.6 * bow} ${cx} ${y0 - hTop - tu + 1.8 * bow}C${cx + 1.5} ${y0 - hTop - tu + 1.6 * bow} ${cx + 3} ${y0 - hTop - tu - 1.5 * bow} ${cx + 7} ${y0 - hTop - tu - 1.5 * bow}C${cx + 13} ${y0 - hTop - tu - 1} ${cx + W * 0.7} ${y0 - hTop - tu * 0.6} ${cx + W} ${y0}`;
    const lo = `C${cx + W * 0.75} ${y0 + hBot + tl * 0.9} ${cx + 10} ${y0 + hBot + tl + 2} ${cx} ${y0 + hBot + tl + 2}C${cx - 10} ${y0 + hBot + tl + 2} ${cx - W * 0.75} ${y0 + hBot + tl * 0.9} ${cx - W} ${y0}Z`;
    const innerTop = y0 - hTop, innerBot = y0 + hBot;
    const open = h < 0.6 ? `M${cx - Wi} ${y0}C${cx - Wi * 0.5} ${y0 - 0.4} ${cx + Wi * 0.5} ${y0 - 0.4} ${cx + Wi} ${y0}C${cx + Wi * 0.5} ${y0 + 0.4} ${cx - Wi * 0.5} ${y0 + 0.4} ${cx - Wi} ${y0}Z`
      : `M${cx - Wi} ${y0}C${cx - Wi * 0.85} ${innerTop} ${cx - Wi * 0.4} ${innerTop} ${cx} ${innerTop}C${cx + Wi * 0.4} ${innerTop} ${cx + Wi * 0.85} ${innerTop} ${cx + Wi} ${y0}C${cx + Wi * 0.85} ${innerBot} ${cx + Wi * 0.4} ${innerBot} ${cx} ${innerBot}C${cx - Wi * 0.4} ${innerBot} ${cx - Wi * 0.85} ${innerBot} ${cx - Wi} ${y0}Z`;
    const teethUp = `M${cx - 22} ${innerTop - 4}L${cx + 22} ${innerTop - 4}L${cx + 22} ${innerTop + 6.5}Q${cx} ${innerTop + 8.5} ${cx - 22} ${innerTop + 6.5}Z`;
    const teethLo = `M${cx - 20} ${innerBot + 4}L${cx + 20} ${innerBot + 4}L${cx + 20} ${innerBot - 4.5}Q${cx} ${innerBot - 6} ${cx - 20} ${innerBot - 4.5}Z`;
    const tongue = `M${cx - Wi - 2} ${innerBot + 2}C${cx - Wi * 0.6} ${innerBot - 9} ${cx + Wi * 0.6} ${innerBot - 9} ${cx + Wi + 2} ${innerBot + 2}Z`;
    const tip = `M${cx - 9} ${y0 + 2.5}C${cx - 8} ${y0 - 3.5} ${cx + 8} ${y0 - 3.5} ${cx + 9} ${y0 + 2.5}C${cx + 5} ${y0 + 4.5} ${cx - 5} ${y0 + 4.5} ${cx - 9} ${y0 + 2.5}Z`;
    /* dientes de arriba apoyados en el labio de abajo (v, f) */
    const ld = `M${cx - 13} ${y0 - 4.5}L${cx + 13} ${y0 - 4.5}L${cx + 13} ${y0 + 1.5}Q${cx} ${y0 + 3} ${cx - 13} ${y0 + 1.5}Z`;
    const pucker = S.r > 0.45 ? [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => `M${cx + sx * (W * 0.55)} ${y0 + sy * (sy > 0 ? hBot + tl * 0.55 : hTop + tu * 0.55)}l${sx * 3} ${sy * 2}`).join("") : "";
    return { uo: uo + lo, open, teethUp, teethLo, tongue, tip, ld, pucker, showTeethUp: h > 3 && S.r < 0.75 ? 1 : 0, showTeethLo: S.jaw > 0.5 && S.r < 0.6 ? 1 : 0, showTip: S.dental > 0.5 ? 1 : 0, showLd: S.l > 0.5 ? 1 : 0, lipLine: `M${cx - W} ${y0}Q${cx} ${y0 + (h < 0.6 ? 0.5 : 0)} ${cx + W} ${y0}` };
  }

  /* ---------- armado del SVG ---------- */
  let uid = 0;
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  function mount(host, opts) {
    opts = opts || {};
    const id = "vm" + (++uid);
    const wrap = document.createElement("div");
    wrap.className = "mouth" + (opts.small ? " small" : "");
    const side = el("svg", { viewBox: "100 74 196 210", class: "mouth-side", role: "img", "aria-label": opts.label || "Corte de la boca" });
    const defs = el("defs", {}, side);
    const clip = el("clipPath", { id: id + "c" }, defs);
    const clipP = el("path", {}, clip);
    const N = {};
    N.skinNeck = el("path", { class: "m-skin" }, side);
    N.skinUp = el("path", { class: "m-skin" }, side);
    N.skinJaw = el("path", { class: "m-skin" }, side);
    N.nasal = el("path", { class: "m-air nasal" }, side);
    el("path", { class: "m-turb", d: "M150 97q22 -5 46 1q14 4 26 12M156 104q20 -4 40 1q10 3 18 9" }, side);
    N.oral = el("path", { class: "m-air" }, side);
    const tg = el("g", { "clip-path": `url(#${id}c)` }, side);
    N.tongue = el("path", { class: "m-tongue" }, tg);
    N.tongueTop = el("path", { class: "m-tongue-line" }, tg);
    N.velum = el("path", { class: "m-velum" }, side);
    N.palate = el("path", { class: "m-bone" }, side);
    N.upperInc = el("path", { class: "m-tooth" }, side);
    N.lowerInc = el("path", { class: "m-tooth" }, side);
    N.lipUp = el("path", { class: "m-lip" }, side);
    N.lipLo = el("path", { class: "m-lip" }, side);
    N.lineUp = el("path", { class: "m-line" }, side);
    N.lineLo = el("path", { class: "m-line" }, side);
    /* laringe */
    const lar = el("g", { class: "m-larynx" }, side);
    el("path", { class: "m-line thin", d: "M121 250L121.5 286M147 250L148.5 286" }, lar);
    const foldA = el("path", { class: "m-fold" }, lar), foldB = el("path", { class: "m-fold" }, lar);
    const waves = el("g", { class: "m-waves" }, lar);
    [0, 1, 2].forEach((i) => el("path", { d: `M${152 + i * 6} ${254 - i * 3}q${4 + i * 2} ${8 + i * 3} 0 ${16 + i * 6}`, style: `animation-delay:${i * 0.12}s` }, waves));
    /* aire */
    const flow = el("path", { class: "m-flow" }, side);
    const fric = el("g", { class: "m-fric" }, side);
    const fricP = el("path", {}, fric);
    const stop = el("path", { class: "m-stop" }, side);
    const puff = el("g", { class: "m-puff" }, side);
    el("path", { d: "M0 -6q6 6 0 12M5 -9q9 9 0 18" }, puff);
    const marks = el("g", { class: "m-marks" }, side);
    wrap.appendChild(side);

    let frontSvg = null, FN = null;
    if (!opts.noFront) {
      frontSvg = el("svg", { viewBox: "8 18 104 92", class: "mouth-front", role: "img", "aria-label": "Labios de frente" });
      const fd = el("defs", {}, frontSvg);
      const fc = el("clipPath", { id: id + "f" }, fd);
      const fcP = el("path", {}, fc);
      FN = { clipP: fcP };
      el("rect", { x: 8, y: 18, width: 104, height: 92, rx: 22, class: "f-skin" }, frontSvg);
      el("path", { class: "f-shade", d: "M48 30q12 -6 24 0q3 4 -2 6q-10 3 -20 0q-5 -2 -2 -6z" }, frontSvg);
      el("path", { class: "f-nostril", d: "M50 33q4 -2 7 1M70 33q-4 -2 -7 1" }, frontSvg);
      el("path", { class: "f-philtrum", d: "M56 38q1 5 1 11M64 38q-1 5 -1 11" }, frontSvg);
      FN.uo = el("path", { class: "f-lips" }, frontSvg);
      FN.open = el("path", { class: "f-open" }, frontSvg);
      const fg = el("g", { "clip-path": `url(#${id}f)` }, frontSvg);
      FN.tongue = el("path", { class: "f-tongue" }, fg);
      FN.teethLo = el("path", { class: "f-teeth" }, fg);
      FN.teethUp = el("path", { class: "f-teeth" }, fg);
      FN.tip = el("path", { class: "f-tongue tip" }, fg);
      FN.ld = el("path", { class: "f-teeth" }, frontSvg);
      FN.lipLine = el("path", { class: "f-lipline" }, frontSvg);
      FN.pucker = el("path", { class: "f-pucker" }, frontSvg);
      wrap.appendChild(frontSvg);
    }
    host.appendChild(wrap);

    let cur = Object.assign({}, STATES.REST), raf = 0, markList = [];
    function draw(S) {
      const g = geom(S), d = paths(S, g);
      for (const k in N) if (d[k] != null) N[k].setAttribute("d", d[k]);
      clipP.setAttribute("d", d.oral);
      /* cuerdas vocales: juntas y vibrando, o separadas */
      const sep = 7 * (1 - S.voice) + 1.2;
      foldA.setAttribute("d", `M121.5 258L${134 - sep / 2} 262L121.5 266Z`);
      foldB.setAttribute("d", `M147 258L${134 + sep / 2} 262L147 266Z`);
      lar.classList.toggle("voiced", S.voice > 0.5);
      /* aire */
      const fp = flowPath(S, g);
      flow.setAttribute("d", through(fp));
      flow.classList.toggle("nasal", S.v > 0.5);
      flow.style.opacity = S.flow > 0.5 ? "" : 0;
      /* fricción, cierre, soplido */
      const end = fp[fp.length - 1];
      let k = null;
      if (S.l > 0.5) k = [251, 165];
      else if (S.dental > 0.5) k = [g.T[0] - 1, g.T[1] - 2.5];
      else if (S.c > 0.5) k = L2(g.U.St, g.Lb.St, 0.5);
      else if (S.v < 0.5 && S.st > 0.4) k = g.F[1] < 135 ? [g.F[0] + 2, g.F[1] - 6] : g.D[1] < 126 ? [g.D[0], g.D[1] - 4] : [g.T[0], g.T[1] - 4];
      else if (S.fr > 0.5) k = S.name === "HH" ? [134, 262] : S.name === "ES_J" ? [g.D[0], g.D[1] - 5] : g.F[1] < 136 ? [g.F[0] + 4, g.F[1] - 4] : [g.T[0] + 1, g.T[1] - 4];
      if (S.fr > 0.5 && k) {
        const x = k[0] + 4, y = k[1];
        fricP.setAttribute("d", `M${x} ${y - 4}q2 -1.5 4 0t4 0M${x + 1} ${y}q2 -1.5 4 0t4 0M${x} ${y + 4}q2 -1.5 4 0t4 0`);
        fric.style.opacity = 1;
      } else fric.style.opacity = 0;
      if (S.st > 0.5 && k) { stop.setAttribute("d", `M${k[0] - 4} ${k[1] - 4}l8 8M${k[0] + 4} ${k[1] - 4}l-8 8`); stop.style.opacity = 1; } else stop.style.opacity = 0;
      if (S.asp > 0.5) { const lm = L2(g.U.St, g.Lb.St, 0.5); puff.setAttribute("transform", `translate(${lm[0] + 14} ${lm[1]})`); puff.style.opacity = 1; } else puff.style.opacity = 0;
      void end;
      /* marcas numeradas */
      while (marks.firstChild) marks.removeChild(marks.firstChild);
      /* marcas: si dos quedan encimadas, se separan */
      const pos = markList.map((m) => anchor(m.at, S, g).slice());
      for (let it = 0; it < 8; it++) for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[j][0] - pos[i][0], dy = pos[j][1] - pos[i][1], d = Math.hypot(dx, dy);
        if (d < 14) { const ux = d ? dx / d : 0.6, uy = d ? dy / d : 0.8, push = (14 - d) / 2; pos[i][0] -= ux * push; pos[i][1] -= uy * push; pos[j][0] += ux * push; pos[j][1] += uy * push; }
      }
      markList.forEach((m, mi) => {
        const p = pos[mi];
        const gm = el("g", { class: "m-mark" + (m.hot ? " hot" : ""), transform: `translate(${f1(p[0])} ${f1(p[1])})` }, marks);
        el("circle", { r: 6.5 }, gm);
        const t = el("text", { y: 2.6 }, gm); t.textContent = String(m.n);
      });
      if (FN) {
        const fv = front(S);
        FN.uo.setAttribute("d", fv.uo);
        FN.open.setAttribute("d", fv.open);
        FN.clipP.setAttribute("d", fv.open);
        FN.tongue.setAttribute("d", fv.tongue);
        FN.teethUp.setAttribute("d", fv.teethUp); FN.teethUp.style.opacity = fv.showTeethUp;
        FN.teethLo.setAttribute("d", fv.teethLo); FN.teethLo.style.opacity = fv.showTeethLo;
        FN.tip.setAttribute("d", fv.tip); FN.tip.style.opacity = fv.showTip;
        FN.ld.setAttribute("d", fv.ld); FN.ld.style.opacity = fv.showLd;
        FN.lipLine.setAttribute("d", fv.lipLine);
        FN.pucker.setAttribute("d", fv.pucker);
      }
    }
    const reduce = G.matchMedia && G.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function to(target, ms) {
      const T = typeof target === "string" ? STATES[target] : target;
      if (!T) return Promise.resolve();
      cancelAnimationFrame(raf);
      const from = Object.assign({}, cur);
      ms = reduce ? 0 : ms == null ? 420 : ms;
      return new Promise((res) => {
        if (!ms) { cur = Object.assign({}, T); draw(cur); res(); return; }
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          cur = mix(from, T, ease(t)); cur.name = T.name; draw(cur);
          if (t < 1) raf = requestAnimationFrame(step); else { cur = Object.assign({}, T); draw(cur); res(); }
        };
        raf = requestAnimationFrame(step);
      });
    }
    let playing = 0;
    async function play(seq, onStep) {
      const my = ++playing;
      for (let i = 0; i < seq.length; i++) {
        if (my !== playing) return;
        if (onStep) onStep(i);
        const it = seq[i];
        await to(it.state, Math.min(260, it.dur * 0.55));
        await new Promise((r) => setTimeout(r, Math.max(60, it.dur * 0.45)));
      }
      if (my === playing && onStep) onStep(-1);
    }
    function setMarks(list) { markList = list || []; draw(cur); }
    draw(cur);
    if (opts.state) to(opts.state, 0);
    return { to, play, stop() { playing++; }, setMarks, get state() { return cur; }, el: wrap };
  }

  /* palabra → secuencia de posiciones, con duraciones aproximadas */
  function sequence(arpa) {
    const out = [];
    const ph = String(arpa).trim().split(/\s+/);
    ph.forEach((p, i) => {
      const stress = /1/.test(p), base = p.replace(/\d/g, "");
      const vowel = /^(AA|AE|AH|AO|AW|AX|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(base);
      let name = base === "AH" && /0/.test(p) ? "AX" : base;
      if (DIPH[name]) {
        const [a, b] = DIPH[name];
        out.push({ state: STATES[a], dur: stress ? 240 : 170, ph: name, label: LABEL[name], ipa: IPA[name], part: 0 });
        out.push({ state: STATES[b], dur: stress ? 200 : 140, ph: name, label: LABEL[name], ipa: IPA[name], part: 1 });
        return;
      }
      const S = STATES[name];
      if (!S) return;
      let st = S;
      /* p, t, k solo soplan al principio de la palabra o de sílaba acentuada */
      if ((name === "P" || name === "T" || name === "K") && i > 0 && !/1/.test(ph[i + 1] || "")) st = Object.assign({}, S, { asp: 0 });
      out.push({ state: st, dur: vowel ? (stress ? 300 : 180) : /^(S|Z|SH|ZH|F|V|TH|DH|M|N|NG|L|R)$/.test(name) ? 200 : 150, ph: name, label: LABEL[name], ipa: IPA[name] });
    });
    out.push({ state: STATES.REST, dur: 200, ph: "", label: "", ipa: "" });
    return out;
  }

  G.VozMouth = { mount, sequence, STATES, LABEL, IPA, build: (o) => Object.assign({}, BASE, o) };
})(typeof window !== "undefined" ? window : globalThis);
