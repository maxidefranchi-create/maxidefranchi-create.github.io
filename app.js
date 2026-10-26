/* Voz: laboratorio de pronunciación con reconocimiento en el dispositivo. */
(function () {
  "use strict";
  const D = window.VOZ_DATA, C = window.VOZ_CONF || { words: {}, pairRule: {} };
  const M = window.VozMouth, CV = window.VOZ_CONVOS;
  const SND = window.VOZ_SOUNDS || { GUIDES: {}, GROUPS: [], BY_ISSUE: {}, BY_RULE: {}, HINT: {} };
  /* diccionario de pronunciación (se baja la primera vez que hace falta) */
  let DICT = null, dictP = null;
  function loadDict() { if (DICT) return Promise.resolve(DICT); if (!dictP) dictP = fetch("dict.json").then((r) => (r.ok ? r.json() : {})).then((d) => (DICT = d)).catch(() => (DICT = {})); return dictP; }
  const cleanW = (w) => String(w || "").toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z']/g, "").replace(/^'+|'+$/g, "");
  function pronOf(w) { w = cleanW(w); return (DICT && DICT[w]) || (C.prons && C.prons[w] ? C.prons[w] : null); }
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const app = $("#app");
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------- íconos ---------- */
  const sv = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    mic: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    stop: sv('<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>'),
    play: sv('<path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none"/>'),
    speaker: sv('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a3.5 3.5 0 0 1 0 6M18.5 6.5a7 7 0 0 1 0 11"/>'),
    me: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    back: sv('<path d="M15 5l-7 7 7 7"/>'),
    gear: sv('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
    home: sv('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>'),
    pairs: sv('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>'),
    text: sv('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    repeat: sv('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>'),
    chat: sv('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>'),
    flame: sv('<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-9-1 2-2 3-4 3 0-2-1-4-3-6 0 4-3 6-3 11 0 4.3 3 8 7 8z"/>'),
    check: sv('<path d="M5 12l5 5 9-10"/>'),
    retry: sv('<path d="M4 4v6h6"/><path d="M20 12a8 8 0 0 1-14.9 4M4.6 10A8 8 0 0 1 20 12"/>'),
    next: sv('<path d="M9 5l7 7-7 7"/>'),
    copy: sv('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
    down: sv('<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>'),
    shield: sv('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
    mouth: sv('<path d="M3 12c2.5-3.5 5.5-5 9-3 3.5-2 6.5-.5 9 3-2.5 4-5.5 6-9 6s-6.5-2-9-6z"/><path d="M3 12h18"/>'),
    camera: sv('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    close: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
    bulb: sv('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
    eye: sv('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    spark: sv('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
    key: sv('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>'),
    ext: sv('<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>')
  };

  /* ---------- progreso guardado ---------- */
  const KEY = "voz-v1";
  const DEF = { settings: { model: "whisper-base", accent: "US", rate: 0.9 }, contrasts: {}, series: {}, rules: {}, days: {}, hist: [], free: 0, tipSeen: false };
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (!s) return JSON.parse(JSON.stringify(DEF)); const o = Object.assign(JSON.parse(JSON.stringify(DEF)), s); o.settings = Object.assign({}, DEF.settings, s.settings || {}); return o; }
    catch (e) { return JSON.parse(JSON.stringify(DEF)); }
  }
  let ST = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} };
  const dkey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const markDay = () => { const k = dkey(new Date()); ST.days[k] = (ST.days[k] || 0) + 1; };
  function streak() { let n = 0; const d = new Date(); if (!ST.days[dkey(d)]) d.setDate(d.getDate() - 1); while (ST.days[dkey(d)]) { n++; d.setDate(d.getDate() - 1); } return n; }
  function logHist(k, s, extra) { ST.hist.unshift(Object.assign({ t: Date.now(), k, s }, extra || {})); ST.hist = ST.hist.slice(0, 300); markDay(); save(); }
  const RULE_C = { IH_IY: "ih_iy", IY_IH: "ih_iy", V_B: "v_b", B_V: "v_b", HH_0: "h", HH_ADD: "h", Y_JH: "y", Y_SH: "y", JH_Y: "y", SH_Y: "y", SH_CH: "sh_ch", CH_SH: "sh_ch", TH_T: "th", TH_S: "th", TH_F: "th", T_TH: "th", S_TH: "th", F_TH: "th", DH_D: "dh", D_DH: "dh", AE_EH: "ae", AE_AH: "ae", AH_AE: "ae", EH_AE: "ae", AH_AA: "ae", AA_AH: "ae", UH_UW: "uh_uw", UW_UH: "uh_uw", Z_S: "z_s", S_Z: "z_s", S_0: "z_s", ED_0: "ed", ED_ADD: "ed" };
  function cStat(id) { return ST.contrasts[id] || (ST.contrasts[id] = { n: 0, ok: 0, recent: [] }); }
  function acc(id) { const s = ST.contrasts[id]; if (!s || !s.recent.length) return null; return Math.round(100 * s.recent.reduce((a, b) => a + b, 0) / s.recent.length); }
  function likelyIssue(word) {
    const w = String(word).toLowerCase().replace(/[^a-z']/g, ""), raw = pronOf(w), pr = raw ? raw.replace(/\d/g, "").split(" ") : null;
    if (!pr) return "GENERIC";
    const has = (x) => pr.includes(x), n = pr.length;
    if (pr[0] === "S" && /^(P|T|K|M|N|L|W)$/.test(pr[1] || "") && w[0] === "s") return "S_CLUSTER";
    if (has("TH")) return "TH";
    if (has("DH")) return "DH";
    if (has("V")) return "V";
    if (pr[0] === "HH") return "H";
    if (pr[0] === "Y") return "Y";
    if (has("IH")) return "IH";
    if (has("AE")) return "AE";
    if (pr[n - 1] === "Z" && /s$/.test(w)) return "Z";
    if (/ed$/.test(w) && /^(T|D)$/.test(pr[n - 1])) return "ED";
    if (has("SH")) return "SH";
    if (has("CH")) return "CH";
    if (has("NG")) return "NG";
    if (has("ER")) return "ER";
    if (has("R")) return "R";
    if (has("W")) return "W";
    if (has("AH")) return "AH";
    if (has("IY")) return "IY";
    return "GENERIC";
  }
  function tipFor(rule, word, alt) { const t = D.TIPS[rule] || D.TIPS.ANY; return t.replace(/\{word\}/g, word).replace(/\{alt\}/g, alt); }
  const MODELS = { "whisper-tiny": { name: "Rápido", mb: 70, desc: "Más liviano y más rápido, pero se equivoca más con los acentos." }, "whisper-base": { name: "Preciso", mb: 105, desc: "Entiende mejor los acentos. Tarda unos segundos más en analizar." } };

  /* ---------- voz modelo ---------- */
  const TTS = {
    voices: [],
    init() {
      if (!("speechSynthesis" in window)) return;
      const f = () => { try { this.voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)); } catch (e) {} };
      f(); try { speechSynthesis.addEventListener("voiceschanged", f); } catch (e) {}
    },
    pick(o) {
      o = o || {};
      const want = (o.accent || ST.settings.accent) === "UK" ? /en[-_]GB/i : /en[-_]US/i;
      const loc = this.voices.filter((v) => v.localService !== false), base = loc.length ? loc : this.voices;
      const pool = base.filter((v) => want.test(v.lang)), p = pool.length ? pool : base;
      const good = /premium|enhanced|natural|neural|siri|google/i;
      if (o.tone) {
        const g = o.tone === "f" ? /samantha|ava|allison|susan|victoria|karen|moira|serena|jenny|aria|libby|sonia|kate|zira|\bfemale\b|emma|olivia|joanna|salli|kimberly|amy|fiona|tessa|nicky|martha|catherine/i : /daniel|alex|fred|\btom\b|aaron|arthur|\bguy\b|ryan|\bmale\b|david|mark|james|oliver|george|brian|matthew|justin|eric|evan|nathan|reed|rocko/i;
        const c = p.filter((v) => g.test(v.name));
        if (c.length) return c.find((v) => good.test(v.name)) || c[0];
      }
      return p.find((v) => /premium|enhanced|natural|neural|siri|google|samantha|ava|allison|serena|daniel|jenny|aria|libby/i.test(v.name)) || p[0] || null;
    },
    /* Algunos navegadores se tragan el audio si se cancela y se habla al toque, si la voz elegida
       falla o si el sintetizador quedó en pausa. Por eso: pausa corta tras cancelar, resume() y un
       reintento con la voz por defecto si a los 1,6 s no arrancó. «Lento» es lento de verdad:
       velocidad 0,5 y, en frases largas, de a grupos de palabras con un respiro entre medio. */
    seq: 0, cur: null,
    say(text, rate, o) {
      if (!("speechSynthesis" in window)) { toast("Este navegador no tiene voces en inglés."); return Promise.resolve(); }
      const ss = speechSynthesis, token = ++this.seq;
      if (!this.voices.length) this.init();
      const slow = rate != null && rate < 0.85;
      const r = slow ? 0.5 : rate || ST.settings.rate;
      const words = String(text).trim().split(/\s+/);
      let parts = [String(text)];
      if (slow && words.length > 3) {
        parts = [];
        String(text).split(/(?<=[,.!?;:])\s+/).forEach((seg) => { const w = seg.split(/\s+/); for (let i = 0; i < w.length; i += 3) parts.push(w.slice(i, i + 3).join(" ")); });
      }
      const run = async () => {
        for (let i = 0; i < parts.length; i++) {
          if (token !== this.seq) return;
          await this.one(parts[i], r, o, false);
          if (slow && i < parts.length - 1) await new Promise((z) => setTimeout(z, 260));
        }
      };
      const busy = ss.speaking || ss.pending;
      if (busy) { try { ss.cancel(); } catch (e) {} }
      try { ss.resume(); } catch (e) {}
      return busy ? new Promise((res) => setTimeout(() => run().then(res), 120)) : run();
    },
    one(text, r, o, retry) {
      return new Promise((res) => {
        const ss = speechSynthesis, u = new SpeechSynthesisUtterance(text), v = retry ? null : this.pick(o);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = ((o && o.accent) || ST.settings.accent) === "UK" ? "en-GB" : "en-US";
        if (o && o.pitch) u.pitch = o.pitch;
        u.rate = r; this.cur = u;
        let started = false, done = false, t1 = 0, t2 = 0;
        const fin = () => { if (done) return; done = true; clearTimeout(t1); clearTimeout(t2); res(); };
        const again = () => { if (done) return; done = true; clearTimeout(t1); clearTimeout(t2); try { ss.cancel(); } catch (e) {} setTimeout(() => this.one(text, r, o, true).then(res), 120); };
        u.onstart = () => { started = true; };
        u.onend = fin;
        u.onerror = (e) => { if (!started && !retry && e && e.error !== "interrupted" && e.error !== "canceled") again(); else fin(); };
        ss.speak(u);
        t1 = setTimeout(() => { if (!started && !ss.speaking && !retry) again(); }, 1600);
        t2 = setTimeout(fin, Math.max(4000, String(text).length * 140 / r + 1500));
      });
    },
    stop() { try { speechSynthesis.cancel(); } catch (e) {} }
  };

  /* ---------- micrófono ---------- */
  function concat(chunks) { let n = 0; chunks.forEach((c) => (n += c.length)); const o = new Float32Array(n); let k = 0; chunks.forEach((c) => { o.set(c, k); k += c.length; }); return o; }
  function resample(a, from, to) {
    if (from === to) return a;
    const r = from / to, n = Math.floor(a.length / r), out = new Float32Array(n), h = Math.max(0, Math.floor(r / 2));
    for (let i = 0; i < n; i++) { const c = Math.floor(i * r); let s = 0, k = 0; for (let j = c - h; j <= c + h; j++) if (j >= 0 && j < a.length) { s += a[j]; k++; } out[i] = k ? s / k : 0; }
    return out;
  }
  const Mic = {
    ctx: null, stream: null, src: null, node: null, sink: null, wl: null, state: "idle", level: 0, finish: null, onChunk: null,
    audioCtx() { const AC = window.AudioContext || window.webkitAudioContext; if (!this.ctx) this.ctx = new AC(); return this.ctx; },
    async open() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw { code: "nomic" };
      const ctx = this.audioCtx();
      if (ctx.state !== "running") { try { await ctx.resume(); } catch (e) {} }
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
      this.src = ctx.createMediaStreamSource(this.stream);
      this.sink = ctx.createGain(); this.sink.gain.value = 0; this.sink.connect(ctx.destination);
      if (this.wl === null) {
        this.wl = false;
        if (ctx.audioWorklet && window.AudioWorkletNode) {
          try {
            const code = 'class R extends AudioWorkletProcessor{constructor(){super();this.b=new Float32Array(1024);this.n=0}process(i){const c=i[0]&&i[0][0];if(c){for(let k=0;k<c.length;k++){this.b[this.n++]=c[k];if(this.n===1024){this.port.postMessage(this.b.slice(0));this.n=0}}}return true}}registerProcessor("voz-rec",R);';
            await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: "application/javascript" })));
            this.wl = true;
          } catch (e) { this.wl = false; }
        }
      }
      if (this.wl) { this.node = new AudioWorkletNode(ctx, "voz-rec"); this.node.port.onmessage = (e) => this.onChunk && this.onChunk(e.data); }
      else { this.node = ctx.createScriptProcessor(4096, 1, 1); this.node.onaudioprocess = (e) => this.onChunk && this.onChunk(new Float32Array(e.inputBuffer.getChannelData(0))); }
      this.src.connect(this.node); this.node.connect(this.sink);
    },
    close() {
      try { this.src && this.src.disconnect(); } catch (e) {}
      try { this.node && this.node.disconnect(); } catch (e) {}
      try { this.sink && this.sink.disconnect(); } catch (e) {}
      if (this.node && this.node.port) this.node.port.onmessage = null;
      this.node = null; this.src = null; this.onChunk = null;
      if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    },
    /* Graba hasta que hay silencio después de hablar, o hasta el máximo. */
    async record(o) {
      await this.open();
      if (o.onStart) o.onStart();
      const rate = this.ctx.sampleRate, buf = [];
      let t = 0, speech = false, lastVoice = 0, floor = 0.003; const early = [];
      this.state = "rec";
      return new Promise((resolve) => {
        this.finish = (reason) => {
          if (this.state !== "rec") return;
          this.state = "idle"; this.level = 0;
          const a = concat(buf); this.close();
          resolve({ audio: resample(a, rate, 16000), reason, speech });
        };
        this.onChunk = (c) => {
          if (this.state !== "rec") return;
          buf.push(c); t += c.length / rate;
          let s = 0; for (let i = 0; i < c.length; i++) s += c[i] * c[i];
          const rms = Math.sqrt(s / c.length); this.level = rms;
          if (t < 0.25) { early.push(rms); const so = early.slice().sort((x, y) => x - y); floor = Math.max(0.002, so[Math.floor(so.length / 2)]); }
          const th = Math.max(0.008, floor * 3);
          if (t > 0.25 && rms > th) { speech = true; lastVoice = t; }
          if (speech && t - lastVoice > o.silence) this.finish("silence");
          else if (!speech && t > o.wait) this.finish("nospeech");
          else if (t > o.max) this.finish("max");
        };
      });
    },
    stop() { if (this.finish) this.finish("manual"); },
    chime(good) {
      try {
        const ctx = this.audioCtx(); ctx.resume();
        const t = ctx.currentTime, g = ctx.createGain(); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (good ? 0.42 : 0.3));
        const notes = good ? [659.25, 987.77] : [329.63];
        notes.forEach((f, i) => { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(g); o.start(t + i * 0.09); o.stop(t + 0.45); });
      } catch (e) {}
    },
    play(a) {
      const ctx = this.audioCtx(); try { ctx.resume(); } catch (e) {}
      const b = ctx.createBuffer(1, a.length, 16000); b.getChannelData(0).set(a);
      const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start();
      return new Promise((r) => { s.onended = r; });
    }
  };

  /* ---------- reconocedor (en un worker) ---------- */
  const Eng = {
    w: null, main: null, mainChain: Promise.resolve(), mainTried: false, status: "idle", loaded: 0, total: 0, err: null, seq: 0, pend: new Map(), subs: new Set(), ready: null, res: null, rej: null, model: null,
    sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
    emit() { this.subs.forEach((f) => { try { f(); } catch (e) {} }); },
    start() {
      if (this.ready && (this.status === "loading" || this.status === "ready") && this.model === ST.settings.model) return this.ready;
      if (this.model !== ST.settings.model) { if (this.w) { this.w.terminate(); this.w = null; } this.main = null; this.mainTried = false; }
      this.model = ST.settings.model; this.status = "loading"; this.err = null; this.loaded = 0; this.total = 0; this.emit();
      this.ready = new Promise((res, rej) => {
        this.res = res; this.rej = rej;
        try {
          if (!this.w) {
            this.w = new Worker("worker.js", { type: "module" });
            this.w.onmessage = (e) => this.onmsg(e.data);
            this.w.onerror = (e) => { e.preventDefault && e.preventDefault(); this.fail((e && e.message) || "El reconocedor no pudo arrancar."); };
          }
          this.w.postMessage({ type: "load", model: this.model });
        } catch (e) { this.fail("Este navegador no puede correr el reconocedor de voz."); }
      });
      this.ready.catch(() => {});
      return this.ready;
    },
    onmsg(m) {
      if (m.type === "progress") { if (m.total) { this.loaded = m.loaded; this.total = m.total; } this.emit(); }
      else if (m.type === "ready") { this.status = "ready"; this.emit(); this.res && this.res(); try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {} }
      else if (m.type === "result" || m.type === "error") {
        const p = this.pend.get(m.id);
        if (p) { this.pend.delete(m.id); if (m.type === "result") p.res(m.result); else p.rej(new Error(m.message)); }
        else if (m.type === "error" && this.status === "loading") this.fail(m.message);
      }
    },
    fail(msg) {
      if (this.w) { this.w.terminate(); this.w = null; }
      if (!this.mainTried && this.status === "loading") { this.mainTried = true; this.startMain(); return; }
      this.status = "error"; this.err = msg; this.emit(); if (this.rej) this.rej(new Error(msg)); this.ready = null;
    },
    /* Plan B: si el worker no arranca, el reconocedor corre en la página. */
    async startMain() {
      try {
        const T = await import(new URL("vendor/transformers.min.js", location.href).href);
        const env = T.env; env.allowRemoteModels = false; env.allowLocalModels = true; env.localModelPath = "models/"; env.useBrowserCache = "caches" in window;
        const o = env.backends.onnx; o.wasm.numThreads = 1; o.wasm.proxy = false;
        o.wasm.wasmPaths = { mjs: new URL("vendor/ort-wasm-simd-threaded.asyncify.mjs", location.href).href, wasm: new URL("vendor/ort-wasm-simd-threaded.asyncify.wasm", location.href).href };
        const e = await window.VozEngine.create({ T, modelId: this.model, dtype: "q8", priors: window.VOZ_PRIORS, sizes: window.VOZ_SIZES, onProgress: (p) => { if (p.total) { this.loaded = p.loaded; this.total = p.total; } this.emit(); } });
        await e.warm();
        this.main = e; this.status = "ready"; this.emit(); this.res && this.res();
      } catch (err) { this.status = "error"; this.err = String((err && err.message) || err); this.emit(); if (this.rej) this.rej(new Error(this.err)); this.ready = null; }
    },
    async run(type, payload) {
      await this.start();
      if (this.main) {
        const job = this.mainChain.then(() => this.runMain(type, payload));
        this.mainChain = job.catch(() => {});
        return job;
      }
      const id = ++this.seq;
      return new Promise((res, rej) => { this.pend.set(id, { res, rej }); this.w.postMessage(Object.assign({ type, id }, payload), payload.audio ? [payload.audio.buffer] : []); });
    },
    async runMain(type, payload) {
      {
        const conf = (C && C.words) || {};
        if (type === "pair") return this.main.pair(payload.audio, payload.target, payload.others, payload.lam);
        if (type === "sentence") return this.main.sentence(payload.audio, payload.target, conf, { flagThreshold: payload.flagThreshold, strongThreshold: payload.strongThreshold, lam: payload.lam, skipHeard: true });
        if (type === "heard") return this.main.heardLast();
        return this.main.free(payload.audio);
      }
    },
    async cached() {
      try {
        if (!("caches" in window)) return false;
        const c = await caches.open("transformers-cache"); const keys = await c.keys();
        return keys.some((k) => k.url.includes("models/" + ST.settings.model + "/onnx/decoder"));
      } catch (e) { return false; }
    }
  };

  /* ---------- utilidades de interfaz ---------- */
  let toastT = null;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2600); }
  const mb = (b) => Math.round(b / 1e6);
  function engineCard() {
    const m = MODELS[ST.settings.model];
    if (Eng.status === "ready") return "";
    if (Eng.status === "loading") {
      const pct = Eng.total ? Math.round(100 * Eng.loaded / Eng.total) : 3;
      return `<section class="card" id="engcard"><div class="row" style="justify-content:space-between"><h3>Preparando el reconocedor</h3><span class="spin" style="color:var(--accent)"></span></div>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <p class="small muted">${Eng.total ? mb(Eng.loaded) + " de " + mb(Eng.total) + " MB" : "Arrancando…"} · se baja una sola vez y queda en tu teléfono.</p></section>`;
    }
    if (Eng.status === "error") return `<section class="card" id="engcard"><h3>No arrancó el reconocedor</h3><p class="err">${esc(Eng.err)}</p><button class="btn primary" data-act="engine">${I.retry} Reintentar</button></section>`;
    return `<section class="card" id="engcard"><h3>Bajá el reconocedor de voz</h3>
      <p class="muted small">Es lo que escucha tu pronunciación. Se baja una vez, unos ${m.mb} MB, y después funciona sin internet. Conviene hacerlo con wifi.</p>
      <button class="btn primary" data-act="engine">${I.down} Descargar ahora</button>
      ${ST.settings.model === "whisper-base" ? `<button class="btn sm ghost" data-act="engine-fast">Prefiero el rápido, unos ${MODELS["whisper-tiny"].mb} MB</button>` : ""}</section>`;
  }
  function wordClass(s) { return s >= 70 ? "g" : s >= 40 ? "o" : "r"; }

  /* ---------- grabador reutilizable ---------- */
  const MODES = { conv: { silence: 1.5, max: 20, wait: 9 }, pair: { silence: 0.75, max: 4, wait: 7 }, sentence: { silence: 1.3, max: 15, wait: 7 }, shadow: { silence: 1.1, max: 10, wait: 7 }, free: { silence: 2.6, max: 30, wait: 8 } };
  let raf = 0, lastAudio = null;
  function stageHTML(label) {
    return `<div class="stage"><canvas class="wave" id="wave" width="680" height="96" aria-hidden="true"></canvas>
      <div class="micwrap"><div class="micring" id="ring"></div><button class="mic" id="mic" aria-label="Grabar">${I.mic}</button></div>
      <div class="miclabel" id="miclabel">${esc(label || "Tocá y hablá")}</div></div>`;
  }
  function drawWave(history) {
    const cv = $("#wave"); if (!cv) return;
    const g = cv.getContext("2d"), W = cv.width, H = cv.height;
    g.clearRect(0, 0, W, H);
    const col = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#0E6A68";
    g.fillStyle = col; const n = 48, bw = W / n;
    for (let i = 0; i < n; i++) { const v = history[history.length - n + i] || 0; const h = Math.max(4, Math.min(H, v * H * 9)); g.globalAlpha = 0.35 + 0.65 * (i / n); g.fillRect(i * bw + bw * 0.2, (H - h) / 2, bw * 0.6, h); }
    g.globalAlpha = 1;
  }
  /* bind: conecta el botón de micrófono; onAudio recibe el audio a 16 kHz */
  function bindStage(mode, onAudio, label) {
    const mic = $("#mic"), lab = $("#miclabel"), ring = $("#ring");
    if (!mic) return;
    let busy = false; const hist = [];
    drawWave(hist);
    mic.onclick = async () => {
      if (Mic.state === "rec") { Mic.stop(); return; }
      if (busy) return;
      try { speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
      Eng.start();
      busy = true; mic.classList.add("rec"); mic.innerHTML = I.stop; mic.setAttribute("aria-label", "Terminar"); lab.textContent = "Abriendo el micrófono…";
      if (navigator.vibrate) navigator.vibrate(12);
      const loop = () => { hist.push(Mic.level); if (hist.length > 200) hist.shift(); drawWave(hist); ring.style.setProperty("--lv", String(1 + Math.min(0.45, Mic.level * 6))); raf = requestAnimationFrame(loop); };
      let rec;
      try {
        rec = await Mic.record(Object.assign({}, MODES[mode], { onStart: () => { lab.textContent = mode === "free" ? "Te escucho. Tocá para terminar." : "Te escucho…"; raf = requestAnimationFrame(loop); } }));
      } catch (e) {
        cancelAnimationFrame(raf); Mic.close(); busy = false;
        mic.classList.remove("rec"); mic.innerHTML = I.mic; ring.style.setProperty("--lv", "1");
        lab.textContent = (e && (e.name === "NotAllowedError" || e.name === "SecurityError")) ? "Sin permiso para el micrófono. Habilitalo para este sitio en los ajustes del navegador." : (e && e.code === "nomic") ? "Este navegador no da acceso al micrófono." : "No se pudo abrir el micrófono.";
        return;
      }
      cancelAnimationFrame(raf); ring.style.setProperty("--lv", "1");
      if (navigator.vibrate) navigator.vibrate(8);
      mic.classList.remove("rec"); mic.classList.add("busy"); mic.innerHTML = '<span class="spin"></span>'; mic.setAttribute("aria-label", "Analizando");
      if (!rec.speech && rec.reason === "nospeech") { lab.textContent = "No te escuché. Probá de nuevo, más cerca del teléfono."; mic.classList.remove("busy"); mic.innerHTML = I.mic; busy = false; return; }
      lastAudio = rec.audio.slice(0);
      lab.textContent = Eng.status === "ready" ? "Analizando tu voz…" : "Analizando… la primera vez tarda más";
      const t0 = performance.now();
      try { await onAudio(rec.audio); perfNote(performance.now() - t0); }
      catch (e) { const r = $("#result"); if (r) r.innerHTML = `<p class="err">${esc(e && e.message ? e.message : "No se pudo analizar. Probá de nuevo.")}</p>`; }
      mic.classList.remove("busy"); mic.innerHTML = I.mic; mic.setAttribute("aria-label", "Grabar de nuevo"); lab.textContent = label || "Tocá para grabar de nuevo"; busy = false;
    };
  }
  let slowCount = 0;
  function perfNote(ms) {
    if (Eng.status !== "ready") return;
    slowCount = ms > 9000 ? slowCount + 1 : 0;
    if (slowCount === 2 && ST.settings.model === "whisper-base") toast("Si el análisis te resulta lento, probá el reconocedor Rápido en Progreso.");
  }
  function bindCommon(root) {
    $$("[data-say]", root).forEach((b) => (b.onclick = () => TTS.say(b.getAttribute("data-say"), b.hasAttribute("data-slow") ? 0.65 : undefined, b.dataset.tone ? { tone: b.dataset.tone, accent: b.dataset.accent } : undefined)));
    $$("[data-me]", root).forEach((b) => (b.onclick = () => { if (lastAudio) Mic.play(lastAudio); }));
    $$("[data-word]", root).forEach((b) => (b.onclick = () => openWord(b.getAttribute("data-word"))));
    $$("[data-guide]", root).forEach((b) => (b.onclick = () => { closeSheet(); go({ name: "guia", id: b.getAttribute("data-guide"), word: b.getAttribute("data-gword") || null, from: Object.assign({}, view) }); }));
    $$("[data-es]", root).forEach((b) => (b.onclick = () => { const es = b.closest(".bub").querySelector(".es"); if (es) { es.hidden = !es.hidden; b.setAttribute("aria-pressed", String(!es.hidden)); } }));
    $$("[data-reveal]", root).forEach((b) => (b.onclick = () => { b.classList.remove("veil"); b.removeAttribute("data-reveal"); b.removeAttribute("role"); }));
  }

  /* ---------- análisis y resultados ---------- */
  async function analyzePair(audio, target, other) {
    const r = await Eng.run("pair", { audio, target, others: [other], lam: 0.6 });
    if (r.silent) return { silent: true };
    const p = r.p, verdict = (r.fit != null && r.fit < 0.05) ? "unclear" : p >= 0.65 ? "good" : p >= 0.35 ? "mid" : "bad";
    return Object.assign(r, { verdict });
  }
  function pairResultHTML(r, target, other) {
    if (r.silent) return `<p class="err">No te escuché. Probá de nuevo.</p>`;
    const rule = C.pairRule[target + "|" + other] || "ANY";
    const gid = SND.BY_RULE[rule];
    const mouthBtn = gid ? `<button class="btn sm ghost" data-guide="${gid}" data-gword="${esc(target)}">${I.mouth} Cómo poner la boca</button>` : "";
    const pct = Math.round(r.p * 100);
    let head;
    if (r.verdict === "unclear") return `<div class="verdict mid"><strong>No se entendió la palabra</strong><span>El reconocedor no escuchó «${esc(target)}» ni «${esc(other)}». Decí solo la palabra, clara y separada.</span></div>
      <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(target)}">${I.speaker} Modelo</button>${mouthBtn}</div>`;
    if (r.verdict === "good") head = `<div class="verdict good"><strong>Bien, sonó «${esc(target)}»</strong><span>Se distingue de «${esc(other)}».</span></div>`;
    else if (r.verdict === "mid") head = `<div class="verdict mid"><strong>Quedó entre «${esc(target)}» y «${esc(other)}»</strong><span>${esc(tipFor(rule, target, other))}</span></div>`;
    else head = `<div class="verdict bad"><strong>Sonó «${esc(other)}»</strong><span>${esc(tipFor(rule, target, other))}</span></div>`;
    return `${head}
      <div class="split" role="img" aria-label="${pct}% ${esc(target)}"><div class="a" style="flex:${Math.max(pct, 1)} 1 0">${esc(target)} ${pct}%</div><div class="b" style="flex:${Math.max(100 - pct, 1)} 1 0">${esc(other)}</div></div>
      <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(target)}">${I.speaker} Modelo</button><button class="btn sm" data-say="${esc(target)}" data-slow>Lento</button>${r.verdict === "good" ? "" : mouthBtn}</div>`;
  }
  async function analyzeSentence(audio, text) {
    const tiny = ST.settings.model === "whisper-tiny";
    const r = await Eng.run("sentence", { audio, target: text, lam: 0.6, flagThreshold: tiny ? 1.0 : 0.5, strongThreshold: tiny ? 3.0 : 2.5 });
    return r;
  }
  function sentenceResultHTML(r) {
    if (r.silent) return `<p class="err">No te escuché. Probá de nuevo.</p>`;
    const chips = r.words.map((w) => `<button class="w ${w.like && w.strong ? "r" : w.like && w.s >= 70 ? "o" : wordClass(w.s)}" data-word="${esc(w.w)}">${esc(w.w)}${w.like ? `<small>${w.strong ? "sonó" : "se acerca a"} «${esc(w.like)}»</small>` : ""}</button>`).join("");
    const rules = [], seen = new Set();
    r.flags.forEach((f) => { if (!seen.has(f.rule)) { seen.add(f.rule); rules.push(f); } });
    const weak = r.words.filter((w) => w.s < 40 && !w.like);
    const byIssue = new Map();
    weak.forEach((w) => { const k = likelyIssue(w.w); if (!byIssue.has(k)) byIssue.set(k, []); byIssue.get(k).push(w.w); });
    const issueTips = Array.from(byIssue.entries()).filter(([k]) => k !== "GENERIC").concat(byIssue.has("GENERIC") ? [["GENERIC", byIssue.get("GENERIC")]] : []);
    const tips = rules.slice(0, 3).map((f) => `<div class="tip"><b>«${esc(f.word)}» ${f.strong ? "sonó" : "se acerca a"} «${esc(f.alt)}»</b><span>${esc(tipFor(f.rule, f.word, f.alt))}</span><div class="row"><button class="btn sm" data-say="${esc(f.word)}">${I.speaker} ${esc(f.word)}</button><button class="btn sm" data-say="${esc(f.alt)}">${I.speaker} ${esc(f.alt)}</button>${SND.BY_RULE[f.rule] ? `<button class="btn sm ghost" data-guide="${SND.BY_RULE[f.rule]}" data-gword="${esc(f.word)}">${I.mouth} La boca</button>` : ""}</div></div>`).join("")
      + issueTips.slice(0, Math.max(0, 3 - rules.length)).map(([k, ws]) => `<div class="tip"><b>Poco clara${ws.length > 1 ? "s" : ""}: ${esc(ws.slice(0, 4).join(", "))}</b><span>${esc((D.ISSUE[k] || D.ISSUE.GENERIC).replace(/\{word\}/g, ws[0]))}</span><div class="row"><button class="btn sm" data-say="${esc(ws[0])}">${I.speaker} ${esc(ws[0])}</button><button class="btn sm" data-say="${esc(ws[0])}" data-slow>Lento</button>${SND.BY_ISSUE[k] ? `<button class="btn sm ghost" data-guide="${SND.BY_ISSUE[k]}" data-gword="${esc(ws[0])}">${I.mouth} La boca</button>` : `<button class="btn sm ghost" data-word="${esc(ws[0])}">${I.mouth} La boca</button>`}</div></div>`).join("");
    return `<div><p class="score">${r.overall}<small> /100</small></p><p class="tiny">claridad promedio de tus palabras</p></div>
      <div class="stats"><div class="stat"><b>${r.wpm || 0}</b><span>palabras por minuto</span></div><div class="stat"><b>${r.pauses || 0}</b><span>pausas largas</span></div><div class="stat"><b>${r.flags.length}</b><span>sonidos a corregir</span></div></div>
      <div class="words">${chips}</div><p class="tiny">Tocá una palabra para ver cómo se mueve la boca.</p>
      ${tips ? `<div class="stack">${tips}</div>` : `<div class="verdict good"><strong>Muy bien</strong><span>No apareció ninguna confusión típica en esta frase.</span></div>`}
      <div class="stack"><p class="tiny">Lo que entendió el reconocedor</p><p class="heard" data-heard>${r.heard ? esc(r.heard) : '<span class="muted">Transcribiendo…</span>'}</p></div>
      <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(r.target)}">${I.speaker} Modelo</button><button class="btn sm" data-say="${esc(r.target)}" data-slow>Lento</button></div>`;
  }
  function fillHeard() {
    const box = $("[data-heard]"); if (!box) return;
    Eng.run("heard", {}).then((h) => { if (box.isConnected) box.textContent = (h && h.text) || "No se entendió una frase clara."; }).catch(() => { if (box.isConnected) box.textContent = "…"; });
  }
  function recordPair(c, target, other, r) {
    const s = cStat(c); s.n++; const ok = r.verdict === "good" ? 1 : 0; if (ok) s.ok++;
    s.recent.push(r.verdict === "good" ? 1 : r.verdict === "mid" ? 0.5 : 0); s.recent = s.recent.slice(-20);
    logHist("pair", Math.round(r.p * 100), { w: target, c });
  }
  function recordSentence(seriesId, r) {
    if (seriesId) { const s = ST.series[seriesId] || (ST.series[seriesId] = { best: 0, n: 0 }); s.n++; s.best = Math.max(s.best, r.overall); s.last = r.overall; }
    r.flags.forEach((f) => { ST.rules[f.rule] = (ST.rules[f.rule] || 0) + 1; const c = RULE_C[f.rule]; if (c && f.strong) { const st = cStat(c); st.recent.push(0); st.recent = st.recent.slice(-20); } });
    logHist(seriesId ? "sent" : "shadow", r.overall, { id: seriesId || null });
  }

  /* ---------- navegación ---------- */
  let view = { name: "hoy" };
  const TABS = [["hoy", "Hoy", I.home], ["sonidos", "Sonidos", I.mouth], ["frases", "Frases", I.text], ["repeti", "Repetí", I.repeat], ["charla", "Charlá", I.chat]];
  function renderTabs() {
    const cur = { hoy: "hoy", session: "hoy", progreso: "hoy", pares: "sonidos", sonidos: "sonidos", guia: "sonidos", drill: "sonidos", wdrill: "sonidos", frases: "frases", serie: "frases", repeti: "repeti", habla: "charla", charla: "charla", conv: "charla", ia: "charla", iachat: "charla" }[view.name];
    $("#tabs").innerHTML = TABS.map(([id, l, ic]) => `<button class="tab" data-tab="${id}" ${cur === id ? 'aria-current="page"' : ""}>${ic}<span>${l}</span></button>`).join("");
    $$("[data-tab]").forEach((b) => (b.onclick = () => go({ name: b.getAttribute("data-tab") })));
  }
  let cleanups = [];
  const onLeave = (f) => cleanups.push(f);
  function runCleanups() { const c = cleanups; cleanups = []; c.forEach((f) => { try { f(); } catch (e) {} }); }
  function go(v) {
    if (Mic.state === "rec") Mic.stop();
    try { speechSynthesis.cancel(); } catch (e) {}
    closeSheet();
    view = v; render(); window.scrollTo(0, 0);
  }
  function render() {
    runCleanups();
    renderTabs();
    const f = { hoy: vHoy, session: vSession, progreso: vProgreso, pares: vSonidos, sonidos: vSonidos, guia: vGuia, wdrill: vWdrill, drill: vDrill, frases: vFrases, serie: vSerie, repeti: vRepeti, habla: vHabla, charla: vCharla, conv: vConv, ia: vIA, iachat: vIAChat }[view.name] || vHoy;
    f();
    bindCommon(app);
    bindEngineButtons();
  }
  function bindEngineButtons() {
    $$("[data-act=engine]").forEach((b) => (b.onclick = () => { Eng.start(); }));
    $$("[data-act=engine-fast]").forEach((b) => (b.onclick = () => { ST.settings.model = "whisper-tiny"; save(); Eng.start(); }));
  }
  Eng.sub(() => { const c = $("#engcard"); if (c) { const h = engineCard(); if (h) { c.outerHTML = h; bindEngineButtons(); } else c.remove(); } });
  const header = (title, eyebrow, back) => `<header class="top">${back ? `<button class="iconbtn" data-back aria-label="Volver">${I.back}</button>` : ""}<div class="grow">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}<h1 style="${back ? "font-size:24px" : ""}">${esc(title)}</h1></div>${view.name === "hoy" ? `<button class="iconbtn" data-go="progreso" aria-label="Progreso y ajustes">${I.gear}</button>` : ""}</header>`;
  function wireNav(backTo) {
    $$("[data-back]").forEach((b) => (b.onclick = () => go(backTo || { name: "hoy" })));
    $$("[data-go]").forEach((b) => (b.onclick = () => go({ name: b.getAttribute("data-go") })));
  }

  /* ---------- HOY ---------- */
  function weakest(n) {
    return D.CONTRASTS.map((c) => ({ c, a: acc(c.id) })).sort((x, y) => (x.a == null ? 60 : x.a) - (y.a == null ? 60 : y.a)).slice(0, n).map((x) => x.c);
  }
  function vHoy() {
    const s = streak(), todayN = ST.days[dkey(new Date())] || 0;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    const ios = /iP(hone|ad|od)/.test(navigator.userAgent);
    const weak = weakest(3);
    app.innerHTML = `<div class="screen stack">${header("Voz", "Tu laboratorio de pronunciación")}
      <section class="card" style="background:var(--accent);border-color:var(--accent);color:var(--on-accent)">
        <div class="row" style="justify-content:space-between"><span class="pill" style="background:rgba(255,255,255,.18);color:inherit">${I.flame} ${s} ${s === 1 ? "día" : "días"} seguidos</span><span class="small" style="opacity:.85">${todayN} ejercicios hoy</span></div>
        <h2 style="color:inherit">Sesión de 5 minutos</h2>
        <p style="opacity:.9">6 pares de sonidos, 2 frases y una repetición, elegidos según lo que más te cuesta.</p>
        <button class="btn" style="background:var(--card);color:var(--accent);border-color:transparent" data-act="session">${I.play} Empezar</button>
      </section>
      ${engineCard()}
      ${(() => { const sc = CV.SCENES[new Date().getDate() % CV.SCENES.length]; return `<section class="card convday"><div class="row" style="gap:12px;flex-wrap:nowrap">${avatar(sc.who.name)}<div style="min-width:0"><p class="eyebrow">Charla del día</p><h3>${esc(sc.title)}</h3><p class="small muted">${esc(sc.who.name)} · ${esc(sc.sub)}</p></div></div><button class="btn" data-conv="${sc.id}">${I.chat} Charlar</button></section>`; })()}
      <section class="stack"><h3>Para trabajar</h3><div class="list">${weak.map((c) => { const a = acc(c.id); return `<button class="item" data-drill="${c.id}"><span class="badge">${esc(SND.GUIDES[c.id] ? badgeOf(c.id) : c.ex.split(" · ")[0].slice(0, 4))}</span><span style="min-width:0"><span class="t">${esc(c.name)}</span><br><span class="s">${esc(c.ex)}</span></span>${a == null ? '<span class="pill">Nuevo</span>' : `<span class="pill ${a >= 75 ? "good" : a >= 50 ? "mid" : "bad"}">${a}%</span>`}</button>`; }).join("")}</div></section>
      ${!standalone && !ST.tipSeen ? `<section class="card flat" id="installtip"><h3>Tenela como app</h3><p class="small muted">${ios ? "En Safari tocá Compartir y después «Agregar a pantalla de inicio»." : "En el menú del navegador elegí «Instalar app» o «Agregar a la pantalla principal»."} Se abre a pantalla completa y funciona sin internet.</p><button class="btn sm ghost" data-act="tipok">Entendido</button></section>` : ""}
      <p class="tiny privacy">${I.shield}<span>Tu voz se analiza en el teléfono. No se graba en ningún servidor.</span></p>
    </div>`;
    wireNav();
    $("[data-act=session]").onclick = () => startSession();
    $$("[data-drill]").forEach((b) => (b.onclick = () => go(SND.GUIDES[b.getAttribute("data-drill")] ? { name: "guia", id: b.getAttribute("data-drill") } : { name: "drill", id: b.getAttribute("data-drill") })));
    $$("[data-conv]").forEach((b) => (b.onclick = () => go({ name: "conv", id: b.getAttribute("data-conv") })));
    const t = $("[data-act=tipok]"); if (t) t.onclick = () => { ST.tipSeen = true; save(); $("#installtip").remove(); };
  }

  /* ---------- SESIÓN GUIADA ---------- */
  let SES = null;
  function startSession() {
    const weak = weakest(4), tasks = [];
    for (let i = 0; i < 6; i++) { const c = weak[i % weak.length], pr = pick(c.pairs), flip = Math.random() < 0.5; tasks.push({ k: "pair", c: c.id, target: flip ? pr[1] : pr[0], other: flip ? pr[0] : pr[1] }); }
    const ser = shuffle(D.SERIES).slice(0, 2);
    ser.forEach((s) => tasks.push({ k: "sent", id: s.id, text: pick(s.s) }));
    tasks.push({ k: "shadow", text: pick(D.SHADOW) });
    SES = { tasks: shuffle(tasks.slice(0, 6)).concat(tasks.slice(6)), i: 0, res: [] };
    go({ name: "session" });
  }
  function vSession() {
    if (!SES) return go({ name: "hoy" });
    const t = SES.tasks[SES.i];
    const dots = `<div class="dots">${SES.tasks.map((_, i) => `<i class="${i < SES.i ? "done" : i === SES.i ? "on" : ""}"></i>`).join("")}</div>`;
    if (!t) {
      const pairs = SES.res.filter((x) => x.k === "pair"), okp = pairs.filter((x) => x.v === "good").length;
      const sents = SES.res.filter((x) => x.k !== "pair"), avg = sents.length ? Math.round(sents.reduce((a, b) => a + b.s, 0) / sents.length) : 0;
      const misses = pairs.filter((x) => x.v !== "good").map((x) => x.c);
      const worst = misses.length ? D.CONTRASTS.find((c) => c.id === misses.sort((a, b) => misses.filter((v) => v === b).length - misses.filter((v) => v === a).length)[0]) : null;
      app.innerHTML = `<div class="screen stack">${header("Sesión completa", "Hoy", true)}
        <section class="card"><div class="stats"><div class="stat"><b>${okp}/${pairs.length}</b><span>pares bien</span></div><div class="stat"><b>${avg}</b><span>claridad en frases</span></div><div class="stat"><b>${streak()}</b><span>días seguidos</span></div></div>
        ${worst ? `<div class="tip"><b>Lo que más te costó: ${esc(worst.name)}</b><span>${esc(D.ADVICE[worst.id] || "")}</span></div>` : `<div class="verdict good"><strong>Excelente</strong><span>Todos los pares salieron bien.</span></div>`}
        <div class="row">${worst ? `<button class="btn primary" data-drill="${worst.id}">Practicar ${esc(worst.name)}</button>` : ""}<button class="btn" data-back>Volver al inicio</button></div></section></div>`;
      wireNav(); $$("[data-drill]").forEach((b) => (b.onclick = () => go({ name: "drill", id: b.getAttribute("data-drill") })));
      return;
    }
    let body = "";
    if (t.k === "pair") {
      const c = D.CONTRASTS.find((x) => x.id === t.c);
      body = `<section class="card"><p class="eyebrow">${esc(c.name)}</p><p class="hint">Decí</p><p class="target">${esc(t.target)}</p><p class="hint">y no «${esc(t.other)}»</p>
        <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(t.target)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(t.target)}" data-slow>Lento</button></div>${stageHTML()}</section>`;
    } else {
      const hide = t.k === "shadow";
      body = `<section class="card"><p class="eyebrow">${hide ? "Escuchá y repetí" : "Leé en voz alta"}</p>
        ${hide ? `<p class="hint">Escuchá la frase y repetila igual. El texto aparece después.</p>` : `<p class="sentence">${esc(t.text)}</p>`}
        <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(t.text)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(t.text)}" data-slow>Lento</button></div>${stageHTML()}</section>`;
    }
    app.innerHTML = `<div class="screen stack">${header("Sesión de hoy", "Paso " + (SES.i + 1) + " de " + SES.tasks.length, true)}${dots}${engineCard()}${body}<section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">${SES.i === SES.tasks.length - 1 ? "Ver resumen" : "Siguiente"} ${I.next}</button></section></div>`;
    wireNav({ name: "hoy" });
    $("#nextbtn").onclick = () => { SES.i++; const nt = SES.tasks[SES.i]; if (nt && nt.k === "shadow") TTS.say(nt.text); render(); window.scrollTo(0, 0); };
    bindStage(t.k === "pair" ? "pair" : t.k === "shadow" ? "shadow" : "sentence", async (audio) => {
      const res = $("#result"), card = $("#resultcard");
      if (t.k === "pair") {
        const r = await analyzePair(audio, t.target, t.other);
        res.innerHTML = pairResultHTML(r, t.target, t.other);
        if (!r.silent && r.verdict !== "unclear") Mic.chime(r.verdict === "good");
        if (!r.silent && r.verdict !== "unclear") { recordPair(t.c, t.target, t.other, r); SES.res = SES.res.filter((x) => x.i !== SES.i).concat([{ i: SES.i, k: "pair", c: t.c, v: r.verdict }]); }
      } else {
        const r = await analyzeSentence(audio, t.text);
        res.innerHTML = (t.k === "shadow" ? `<p class="sentence" style="text-align:left;font-size:20px">${esc(t.text)}</p>` : "") + sentenceResultHTML(r);
        if (!r.silent) fillHeard();
        if (!r.silent) { recordSentence(t.k === "sent" ? t.id : null, r); SES.res = SES.res.filter((x) => x.i !== SES.i).concat([{ i: SES.i, k: t.k, s: r.overall }]); }
      }
      card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- PARES ---------- */
  function newRound(c) { const items = []; for (let i = 0; i < 8; i++) { const pr = pick(c.pairs), f = Math.random() < 0.5; items.push({ target: f ? pr[1] : pr[0], other: f ? pr[0] : pr[1] }); } return { items, i: 0, res: [] }; }
  function vDrill() {
    const c = D.CONTRASTS.find((x) => x.id === view.id);
    if (!view.round) view.round = newRound(c);
    const R = view.round, it = R.items[R.i];
    if (!it) {
      const ok = R.res.filter((v) => v === "good").length;
      app.innerHTML = `<div class="screen stack">${header(c.name, "Resultado", true)}<section class="card"><p class="score">${ok}<small> /${R.items.length}</small></p><p class="muted">pares bien diferenciados</p>
        <div class="tip"><b>Cómo se hace</b><span>${esc(D.ADVICE[c.id] || "")}</span></div>
        <div class="row"><button class="btn primary" data-act="again">${I.retry} Otra ronda</button><button class="btn" data-back>Elegir otro sonido</button></div></section></div>`;
      wireNav(SND.GUIDES[c.id] ? { name: "guia", id: c.id } : { name: "sonidos" }); $("[data-act=again]").onclick = () => { view.round = newRound(c); render(); };
      return;
    }
    app.innerHTML = `<div class="screen stack">${header(c.name, (R.i + 1) + " de " + R.items.length, true)}${engineCard()}
      <section class="card"><p class="hint">Decí</p><p class="target">${esc(it.target)}</p><p class="hint">y no «${esc(it.other)}»</p>
      <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(it.target)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(it.target)}" data-slow>Lento</button><button class="btn sm" data-say="${esc(it.target)}. ${esc(it.other)}.">Comparar</button></div>
      ${stageHTML()}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">Siguiente ${I.next}</button></section>
      ${SND.GUIDES[c.id] ? `<section class="card flat drillmouth"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3>La boca para «${esc(it.target)}»</h3><button class="btn sm ghost" data-guide="${c.id}" data-gword="${esc(it.target)}">Guía ${I.next}</button></div><div class="mouthbox" id="dmouth"></div><p class="small" id="dnote"></p></section>` : `<details class="card flat"><summary class="small" style="cursor:pointer;font-weight:700">Cómo se hace este sonido</summary><p class="small muted" style="margin-top:8px">${esc(D.ADVICE[c.id] || "")}</p></details>`}</div>`;
    wireNav(SND.GUIDES[c.id] ? { name: "guia", id: c.id } : { name: "sonidos" });
    const g = SND.GUIDES[c.id];
    if (g) {
      const side = g.sides[sideForWord(g, it.target)];
      const mo = M.mount($("#dmouth"), { small: true, label: "Boca para " + it.target });
      mo.to(sideState(side), 0); mo.setMarks(marksOf(side));
      $("#dnote").innerHTML = `<b>${esc(side.label)}</b> · ${esc(side.note)}`;
      onLeave(() => mo.stop());
    }
    $("#nextbtn").onclick = () => { R.i++; render(); window.scrollTo(0, 0); };
    bindStage("pair", async (audio) => {
      const r = await analyzePair(audio, it.target, it.other);
      $("#result").innerHTML = pairResultHTML(r, it.target, it.other);
      if (!r.silent && r.verdict !== "unclear") Mic.chime(r.verdict === "good");
      if (!r.silent && r.verdict !== "unclear") { recordPair(c.id, it.target, it.other, r); R.res[R.i] = r.verdict; }
      const card = $("#resultcard"); card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- FRASES ---------- */
  function vFrases() {
    app.innerHTML = `<div class="screen stack">${header("Frases", "Leé en voz alta")}
      <p class="muted">Cada palabra sale en verde, ámbar o rojo, y si alguna sonó como otra palabra te lo marca con el sonido que hay que corregir.</p>
      <div class="list">${D.SERIES.map((s, i) => { const st = ST.series[s.id]; return `<button class="item" data-serie="${s.id}"><span class="badge">P${i + 1}</span><span style="min-width:0"><span class="t">${esc(s.title)}</span><br><span class="s">${esc(s.sound)}</span></span>${st ? `<span class="pill ${st.best >= 70 ? "good" : st.best >= 40 ? "mid" : "bad"}">${st.best}</span>` : '<span class="pill">Nueva</span>'}</button>`; }).join("")}</div></div>`;
    wireNav();
    $$("[data-serie]").forEach((b) => (b.onclick = () => go({ name: "serie", id: b.getAttribute("data-serie"), i: 0 })));
  }
  function vSerie() {
    const s = D.SERIES.find((x) => x.id === view.id), i = view.i || 0, text = s.s[i];
    app.innerHTML = `<div class="screen stack">${header(s.title, "Frase " + (i + 1) + " de " + s.s.length, true)}${engineCard()}
      <section class="card"><p class="sentence">${esc(text)}</p>
      <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(text)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(text)}" data-slow>Lento</button></div>${stageHTML()}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">${i < s.s.length - 1 ? "Siguiente frase" : "Terminar serie"} ${I.next}</button></section></div>`;
    wireNav({ name: "frases" });
    $("#nextbtn").onclick = () => { if (i < s.s.length - 1) go({ name: "serie", id: s.id, i: i + 1 }); else go({ name: "frases" }); };
    bindStage("sentence", async (audio) => {
      const r = await analyzeSentence(audio, text);
      $("#result").innerHTML = sentenceResultHTML(r);
      if (!r.silent) { recordSentence(s.id, r); fillHeard(); }
      const card = $("#resultcard"); card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- REPETÍ ---------- */
  function vRepeti() {
    if (view.text == null) view.text = pick(D.SHADOW);
    const text = view.text;
    app.innerHTML = `<div class="screen stack">${header("Repetí", "Escuchá y repetí")}${engineCard()}
      <section class="card"><p class="hint">Escuchá la frase sin leerla y repetila con la misma música. El texto aparece después.</p>
      <div class="row" style="justify-content:center"><button class="btn primary" data-say="${esc(text)}">${I.speaker} Escuchar</button><button class="btn" data-say="${esc(text)}" data-slow>Lento</button></div>
      ${stageHTML("Tocá y repetí")}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">Otra frase ${I.next}</button></section></div>`;
    wireNav();
    $("#nextbtn").onclick = () => { view.text = pick(D.SHADOW.filter((x) => x !== text)); TTS.say(view.text); render(); window.scrollTo(0, 0); };
    bindStage("shadow", async (audio) => {
      const r = await analyzeSentence(audio, text);
      $("#result").innerHTML = `<p class="sentence" style="text-align:left;font-size:20px">${esc(text)}</p>` + sentenceResultHTML(r);
      if (!r.silent) { recordSentence(null, r); fillHeard(); }
      const card = $("#resultcard"); card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "start" });
    }, "Tocá y repetí");
  }

  /* ---------- HABLÁ ---------- */
  function vHabla() {
    if (view.p == null) view.p = Math.floor(Math.random() * D.PROMPTS.length);
    const p = D.PROMPTS[view.p];
    app.innerHTML = `<div class="screen stack">${header("Respuesta libre", "Hasta 30 segundos", true)}${engineCard()}
      <section class="card"><p class="eyebrow">Respondé en inglés</p><p class="sentence" style="text-align:left">${esc(p.en)}</p><p class="small muted">${esc(p.es)}</p>
      <div class="row"><button class="btn sm" data-say="${esc(p.en)}">${I.speaker} Escuchar</button><button class="btn sm ghost" data-act="otra">${I.retry} Otra pregunta</button></div>
      ${stageHTML("Tocá y hablá. Tocá de nuevo para terminar.")}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div></section></div>`;
    wireNav({ name: "charla" });
    $("[data-act=otra]").onclick = () => { view.p = (view.p + 1) % D.PROMPTS.length; render(); };
    bindStage("free", async (audio) => {
      const r = await Eng.run("free", { audio });
      const res = $("#result");
      if (r.silent || !r.text) { res.innerHTML = `<p class="err">No te escuché. Probá de nuevo.</p>`; $("#resultcard").hidden = false; return; }
      const low = r.words.filter((w) => w.s < 40).length;
      res.innerHTML = `<div class="stats"><div class="stat"><b>${r.wpm}</b><span>palabras por minuto</span></div><div class="stat"><b>${r.pauses}</b><span>pausas largas</span></div><div class="stat"><b>${r.seconds}s</b><span>duración</span></div></div>
        <div class="stack"><p class="tiny">Lo que entendió el reconocedor. En rojo, las palabras que le costó entender.</p><div class="words">${r.words.map((w) => `<button class="w ${wordClass(w.s)}" data-word="${esc(w.w)}">${esc(w.w)}</button>`).join("")}</div></div>
        <div class="tip"><b>${r.wpm < 90 ? "Ritmo lento" : r.wpm > 170 ? "Ritmo rápido" : "Buen ritmo"}</b><span>${r.wpm < 90 ? "Hablás con muchas pausas. Probá armar la idea antes de arrancar y decirla de corrido." : r.wpm > 170 ? "Vas rápido. Bajá un cambio para que se entienda cada palabra." : "Tu velocidad es natural para una conversación."}${low ? " Repetí en voz alta las palabras en rojo." : ""}</span></div>
        <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-act="copy">${I.copy} Copiar para Claude</button></div>${r.cut ? '<p class="tiny">Se analizaron los primeros 30 segundos.</p>' : ""}`;
      ST.free++; logHist("free", 100 - Math.round(100 * low / Math.max(1, r.words.length)));
      $("[data-act=copy]").onclick = async () => {
        const msg = `Corregime esto que dije en inglés. Es la transcripción automática de mi voz, así que puede tener errores del reconocedor. La pregunta era: "${p.en}"\n\n"${r.text}"\n\nMarcame los errores de gramática y vocabulario, y decime cómo lo diría un nativo.`;
        try { await navigator.clipboard.writeText(msg); toast("Copiado. Pegalo en Claude."); } catch (e) { toast("No se pudo copiar."); }
      };
      const card = $("#resultcard"); card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "start" });
    }, "Tocá y hablá. Tocá de nuevo para terminar.");
  }

  /* ---------- PROGRESO Y AJUSTES ---------- */
  function vProgreso() {
    const days = []; const d = new Date(); d.setDate(d.getDate() - 27);
    for (let i = 0; i < 28; i++) { days.push(!!ST.days[dkey(d)]); d.setDate(d.getDate() + 1); }
    const rows = D.CONTRASTS.map((c) => ({ c, a: acc(c.id), n: (ST.contrasts[c.id] || {}).n || 0 }));
    const total = ST.hist.length;
    app.innerHTML = `<div class="screen stack">${header("Progreso", "Tus sonidos", true)}
      <section class="card"><div class="stats"><div class="stat"><b>${streak()}</b><span>días seguidos</span></div><div class="stat"><b>${Object.keys(ST.days).length}</b><span>días practicados</span></div><div class="stat"><b>${total}</b><span>ejercicios</span></div></div>
        <p class="tiny">Últimas 4 semanas</p><div class="cal">${days.map((x) => `<i class="${x ? "on" : ""}"></i>`).join("")}</div></section>
      <section class="card"><h3>Precisión por sonido</h3><div class="bars">${rows.map((r) => `<div class="bar"><div class="stack" style="gap:4px"><div class="lbl"><span>${esc(r.c.name)}</span><span class="muted">${r.c.ex}</span></div><div class="meter"><i style="width:${r.a == null ? 0 : r.a}%;background:${r.a == null ? "var(--line)" : r.a >= 75 ? "var(--good)" : r.a >= 50 ? "var(--mid)" : "var(--bad)"}"></i></div></div><b style="text-align:right;font-variant-numeric:tabular-nums">${r.a == null ? "–" : r.a + "%"}</b></div>`).join("")}</div>
        <p class="tiny">Según tus últimos 20 intentos de cada sonido, en pares y frases.</p></section>
      <section class="card"><h3>Reconocedor</h3>
        <div class="seg" role="group" aria-label="Reconocedor">${Object.keys(MODELS).map((k) => `<button data-model="${k}" aria-pressed="${ST.settings.model === k}">${MODELS[k].name}</button>`).join("")}</div>
        <p class="small muted">${esc(MODELS[ST.settings.model].desc)} Ocupa unos ${MODELS[ST.settings.model].mb} MB.</p>
        <h3>Voz modelo</h3>
        <div class="seg" role="group" aria-label="Acento">${[["US", "Estadounidense"], ["UK", "Británica"]].map(([k, l]) => `<button data-accent="${k}" aria-pressed="${ST.settings.accent === k}">${l}</button>`).join("")}</div>
        <div class="seg" role="group" aria-label="Velocidad">${[[0.75, "Pausada"], [0.9, "Normal"]].map(([k, l]) => `<button data-rate="${k}" aria-pressed="${ST.settings.rate === k}">${l}</button>`).join("")}</div>
        <button class="btn sm" data-say="This is how the model voice sounds.">${I.speaker} Probar voz</button></section>
      <section class="card"><h3>Charlas</h3>
        <div class="seg" role="group" aria-label="Texto de la otra persona"><button data-showtext="1" aria-pressed="${ST.settings.showText !== false}">Ver el texto</button><button data-showtext="0" aria-pressed="${ST.settings.showText === false}">Solo escuchar</button></div>
        <p class="small muted">Con «Solo escuchar» el texto aparece cuando lo tocás: entrena el oído.</p>
        <h3>Charla libre con Claude</h3>
        ${aiKey() ? `<p class="small muted">Clave guardada en este teléfono, termina en «${esc(aiKey().slice(-4))}».</p>
          <div class="seg" role="group" aria-label="Modelo">${Object.keys(AI_MODELS).map((k) => `<button data-aimodel="${k}" aria-pressed="${(ST.settings.aiModel || "fast") === k}">${AI_MODELS[k].name}</button>`).join("")}</div>
          <p class="small muted">«Rápido» contesta antes. «Mejor» corrige con más detalle y cuesta un poco más.</p>
          <button class="btn sm" data-act="delkey">${I.close} Borrar la clave</button>` : `<p class="small muted">Sin clave. Se activa desde Charlá.</p><button class="btn sm" data-go="ia">${I.key} Configurar</button>`}
      </section>
      <section class="card flat"><h3>Borrar progreso</h3><p class="small muted">Borra rachas, puntajes e historial de este teléfono.</p><button class="btn sm" data-act="reset">Borrar todo</button></section>
      <p class="tiny">Voz · Ruta de inglés. El reconocimiento usa Whisper de OpenAI corriendo en tu teléfono.</p></div>`;
    wireNav();
    $$("[data-model]").forEach((b) => (b.onclick = () => { ST.settings.model = b.getAttribute("data-model"); save(); if (Eng.w) { Eng.w.terminate(); Eng.w = null; } Eng.status = "idle"; Eng.ready = null; render(); Eng.cached().then((c) => { if (c) Eng.start(); }); }));
    $$("[data-accent]").forEach((b) => (b.onclick = () => { ST.settings.accent = b.getAttribute("data-accent"); save(); render(); }));
    $$("[data-rate]").forEach((b) => (b.onclick = () => { ST.settings.rate = +b.getAttribute("data-rate"); save(); render(); }));
    $$("[data-showtext]").forEach((b) => (b.onclick = () => { ST.settings.showText = b.getAttribute("data-showtext") === "1"; save(); render(); }));
    $$("[data-aimodel]").forEach((b) => (b.onclick = () => { ST.settings.aiModel = b.getAttribute("data-aimodel"); save(); render(); }));
    const dk = $("[data-act=delkey]"); if (dk) dk.onclick = () => { try { localStorage.removeItem(AIK); } catch (e) {} AI = null; toast("Clave borrada."); render(); };
    const rb = $("[data-act=reset]");
    rb.onclick = () => {
      if (rb.dataset.armed) { const keep = ST.settings; ST = JSON.parse(JSON.stringify(DEF)); ST.settings = keep; save(); toast("Progreso borrado."); render(); return; }
      rb.dataset.armed = "1"; rb.textContent = "Tocá de nuevo para confirmar"; rb.classList.add("primary");
      setTimeout(() => { if (rb.isConnected) { delete rb.dataset.armed; rb.textContent = "Borrar todo"; rb.classList.remove("primary"); } }, 4000);
    };
  }

  /* ---------- BOCA: guías, palabra en cámara lenta, espejo ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const IPA_BADGE = { ptk: "pʰ", s_cluster: "sp", ed: "-ed" };
  function badgeOf(id) { const g = SND.GUIDES[id]; return IPA_BADGE[id] || g.focus.slice(0, 2).map((p) => M.IPA[p] || p).join(" "); }
  function sideState(side) {
    if (!side) return M.STATES.REST;
    if (side.seq) return M.STATES[side.seq[0]];
    if (typeof side.state === "string") return M.STATES[side.state];
    const o = Object.assign({}, M.STATES[side.state.from], side.state); delete o.from; o.name = side.state.from; return o;
  }
  function sideForWord(g, word) {
    const w = cleanW(word);
    let i = g.sides.findIndex((s) => s.word && cleanW(s.word) === w);
    if (i >= 0) return i;
    const pr = pronOf(word);
    if (pr) {
      for (const p of pr.replace(/\d/g, "").split(" ")) {
        if (!g.focus.includes(p)) continue;
        i = g.sides.findIndex((s) => s.state === p || (s.seq && s.seq.includes(p)));
        if (i >= 0) return i;
      }
    }
    return g.sides.length - 1;
  }
  const marksOf = (side) => side.steps.map((st, i) => (st.at ? { n: i + 1, at: st.at } : null)).filter(Boolean);
  const stepsHTML = (side) => side.steps.map((st, i) => `<li><span class="num">${i + 1}</span><span>${esc(st.t)}</span></li>`).join("");
  function guideForWord(w) { const k = likelyIssue(w); return SND.BY_ISSUE[k] || null; }

  /* espejo con la cámara de adelante (no se graba nada) */
  const Mirror = {
    stream: null,
    async start(video) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("nocam");
      this.stop();
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } }, audio: false });
      video.srcObject = this.stream;
      try { await video.play(); } catch (e) {}
    },
    stop() { if (this.stream) this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
  };

  /* palabra → fichas de sonidos */
  function phoneChips(seq) {
    const chips = [], map = [];
    seq.forEach((x) => { if (!x.ph) { map.push(-1); return; } if (x.part === 1) { map.push(chips.length - 1); return; } map.push(chips.length); chips.push(x); });
    return { chips, map };
  }
  const chipStrip = (word, chips) => `<span class="phw">${esc(word)}</span>` + chips.map((x, i) => `<span class="ph" data-i="${i}">${esc(x.label)}</span>`).join("");
  async function playWord(mo, word, strip, hintEl, opts) {
    opts = opts || {};
    await loadDict();
    const pr = pronOf(word);
    if (!pr) { if (hintEl) { hintEl.hidden = false; hintEl.textContent = "No tengo la pronunciación de esa palabra."; } return null; }
    const seq = M.sequence(pr).map((x) => Object.assign({}, x, { dur: x.dur * (opts.slow || 2.4) }));
    const { chips, map } = phoneChips(seq);
    strip.hidden = false;
    strip.innerHTML = chipStrip(word, chips);
    const show = (i) => {
      const ci = i >= 0 ? map[i] : -1;
      $$(".ph", strip).forEach((e) => e.classList.toggle("on", +e.dataset.i === ci));
      if (ci >= 0 && hintEl) { hintEl.hidden = false; hintEl.innerHTML = `<b>${esc(chips[ci].label)}</b> · ${esc(SND.HINT[chips[ci].ph] || "")}`; }
    };
    if (opts.speak !== false) TTS.say(word, 0.7);
    await mo.play(seq, show);
    return chips;
  }

  /* hoja con una palabra en cámara lenta */
  let sheetEl = null;
  function closeSheet() { if (!sheetEl) return; try { sheetEl._mo && sheetEl._mo.stop(); } catch (e) {} sheetEl.remove(); sheetEl = null; document.body.classList.remove("sheet-open"); }
  function openWord(word) {
    closeSheet(); TTS.stop();
    word = String(word).replace(/[^A-Za-z'’ -]/g, "").trim();
    if (!word) return;
    const gid = guideForWord(word), g = gid && SND.GUIDES[gid];
    const el = document.createElement("div");
    el.className = "sheet"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Cómo se dice " + word);
    el.innerHTML = `<div class="sheet-card"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div style="min-width:0"><p class="eyebrow">La boca en cámara lenta</p><h2>${esc(word)}</h2></div><button class="iconbtn" data-close aria-label="Cerrar">${I.close}</button></div>
      <div class="mouthbox" id="wsm"></div>
      <div class="phones" id="wsp" hidden></div>
      <p class="small hintline" id="wsh">Mirá cómo se mueve la boca mientras la escuchás despacio.</p>
      <div class="row"><button class="btn primary" data-act="ws-play">${I.play} Ver y escuchar</button><button class="btn" data-act="ws-step">Paso a paso</button></div>
      ${g ? `<button class="btn sm ghost" data-guide="${gid}" data-gword="${esc(word)}">${I.mouth} Guía completa: ${esc(g.title)}</button>` : ""}</div>`;
    document.body.appendChild(el); sheetEl = el; document.body.classList.add("sheet-open");
    const mo = M.mount($("#wsm", el), { label: "Boca diciendo " + word }); el._mo = mo;
    const strip = $("#wsp", el), hint = $("#wsh", el);
    let stepper = null;
    $("[data-close]", el).onclick = closeSheet;
    el.addEventListener("click", (e) => { if (e.target === el) closeSheet(); });
    $("[data-act=ws-play]", el).onclick = () => { stepper = null; playWord(mo, word, strip, hint); };
    $("[data-act=ws-step]", el).onclick = async () => {
      await loadDict();
      const pr = pronOf(word);
      if (!pr) { hint.textContent = "No tengo la pronunciación de esa palabra."; return; }
      mo.stop();
      if (!stepper) { const pc = phoneChips(M.sequence(pr)); stepper = { pc, k: -1 }; strip.hidden = false; strip.innerHTML = chipStrip(word, pc.chips); }
      stepper.k++;
      if (stepper.k >= stepper.pc.chips.length) {
        stepper.k = -1; mo.to("REST");
        $$(".ph", strip).forEach((e) => e.classList.remove("on"));
        hint.textContent = "Ahora toda junta. Tocá «Paso a paso» para volver a empezar.";
        TTS.say(word, 0.75); return;
      }
      const ch = stepper.pc.chips[stepper.k];
      mo.to(ch.state, 380);
      $$(".ph", strip).forEach((e) => e.classList.toggle("on", +e.dataset.i === stepper.k));
      hint.innerHTML = `<b>${esc(ch.label)}</b> · ${esc(SND.HINT[ch.ph] || "")}`;
    };
    bindCommon(el);
    setTimeout(() => { if (sheetEl === el) playWord(mo, word, strip, hint); }, 300);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

  /* ---------- SONIDOS ---------- */
  function vSonidos() {
    app.innerHTML = `<div class="screen stack">${header("Sonidos", "Cómo se pone la boca")}
      <p class="muted">Cada sonido con un dibujo animado de la boca, comparado con lo que hacemos en español. Primero mirás y escuchás, después practicás con el micrófono.</p>
      ${SND.GROUPS.map((gr) => `<section class="stack"><h3>${esc(gr.name)}</h3><div class="list">${gr.ids.map((id) => {
        const g = SND.GUIDES[id], a = g.drill ? acc(g.drill) : null;
        return `<button class="item" data-guia="${id}"><span class="badge ipa">${esc(badgeOf(id))}</span><span style="min-width:0"><span class="t">${esc(g.title)}</span><br><span class="s">${esc(g.ex)}</span></span>${a == null ? `<span class="pill">${I.next}</span>` : `<span class="pill ${a >= 75 ? "good" : a >= 50 ? "mid" : "bad"}">${a}%</span>`}</button>`;
      }).join("")}</div></section>`).join("")}
    </div>`;
    wireNav();
    $$("[data-guia]").forEach((b) => (b.onclick = () => go({ name: "guia", id: b.getAttribute("data-guia") })));
  }

  function vGuia() {
    const g = SND.GUIDES[view.id];
    if (!g) { view = { name: "sonidos" }; vSonidos(); return; }
    const n = g.sides.length;
    if (view.side == null) view.side = view.word ? sideForWord(g, view.word) : n - 1;
    app.innerHTML = `<div class="screen stack">${header(g.title, g.ex, true)}
      <section class="card guide">
        ${n > 1 ? `<div class="seg sides" role="group" aria-label="Elegí qué sonido ver" style="grid-template-columns:repeat(${n},minmax(0,1fr))">${g.sides.map((sd, i) => `<button data-side="${i}" aria-pressed="false">${esc(sd.label)}</button>`).join("")}</div>` : ""}
        <div class="mouthbox" id="gmouth"></div>
        <p class="gnow" id="gnow"></p>
        <div class="phones" id="gphones" hidden></div>
        <p class="small hintline" id="ghint" hidden></p>
        <div class="row" id="gbtns"></div>
      </section>
      <section class="card"><h3 id="gstitle">Cómo se hace</h3><ol class="gsteps" id="gsteps"></ol></section>
      <section class="card flat"><h3>Comprobalo</h3><p>${esc(g.check)}</p></section>
      <section class="card flat warnbox"><h3>Lo que solemos hacer</h3><p>${esc(g.error)}</p></section>
      <section class="card"><h3>La boca en cámara lenta</h3><p class="small muted">Tocá una palabra: la ves sonido por sonido y la escuchás despacio.</p><div class="wchips">${g.words.map((w) => `<button class="chip" data-slowword="${esc(w)}">${esc(w)}</button>`).join("")}</div></section>
      <section class="card"><h3>Practicá con el micrófono</h3><div class="stack">
        ${g.drill ? `<button class="btn primary" data-pdrill="${g.drill}">${I.pairs} Pares de palabras</button>` : ""}
        <button class="btn${g.drill ? "" : " primary"}" data-act="wdrill">${I.mic} Palabras sueltas</button>
        ${g.series ? `<button class="btn" data-pserie="${g.series}">${I.text} Frases para leer</button>` : ""}
      </div></section></div>`;
    wireNav(view.from || { name: "sonidos" });
    const mo = M.mount($("#gmouth"), { label: "Boca: " + g.title });
    const video = document.createElement("video");
    video.className = "mirror"; video.muted = true; video.playsInline = true; video.setAttribute("playsinline", ""); video.setAttribute("aria-label", "Tu cara en el espejo"); video.hidden = true;
    mo.el.appendChild(video);
    let seqTimer = 0, token = 0;
    onLeave(() => { clearTimeout(seqTimer); token++; mo.stop(); Mirror.stop(); });
    function apply(i, ms) {
      view.side = i; const sd = g.sides[i];
      clearTimeout(seqTimer); mo.stop();
      $$("[data-side]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.side === i)));
      $$("[data-slowword]").forEach((x) => x.classList.remove("on"));
      $("#gnow").innerHTML = `<b>${esc(sd.label)}</b> · ${esc(sd.note)}`;
      $("#gsteps").innerHTML = stepsHTML(sd);
      $("#gstitle").textContent = n > 1 ? "Cómo se hace: " + sd.label : "Cómo se hace";
      $("#gphones").hidden = true; $("#ghint").hidden = true;
      $("#gbtns").innerHTML = (sd.word ? `<button class="btn sm" data-say="${esc(sd.word)}">${I.speaker} ${esc(sd.word)}</button><button class="btn sm" data-say="${esc(sd.word)}" data-slow>Lento</button>` : "")
        + (n > 1 ? `<button class="btn sm" data-act="compare">${I.repeat} Comparar</button>` : "")
        + `<button class="btn sm ghost" data-act="mirror">${I.camera} ${Mirror.stream ? "Cerrar espejo" : "Espejo"}</button>`;
      mo.setMarks(marksOf(sd));
      mo.to(sideState(sd), ms == null ? 450 : ms);
      if (sd.seq) { let k = 0; const tick = () => { k++; mo.to(sd.seq[k % sd.seq.length], 520); seqTimer = setTimeout(tick, k % 2 ? 1000 : 750); }; seqTimer = setTimeout(tick, 900); }
      bindCommon($("#gbtns"));
      const cb = $("[data-act=compare]"); if (cb) cb.onclick = compare;
      $("[data-act=mirror]").onclick = toggleMirror;
    }
    async function compare() {
      const my = ++token;
      for (let round = 0; round < 2; round++) for (let i = 0; i < n; i++) {
        if (my !== token) return;
        apply(i); token = my;
        const w = g.sides[i].word;
        if (w) await TTS.say(w, 0.8); else await sleep(700);
        if (my !== token) return;
        await sleep(650);
      }
    }
    async function toggleMirror() {
      if (Mirror.stream) { Mirror.stop(); video.hidden = true; mo.el.classList.remove("mirroring"); apply(view.side, 0); return; }
      try { await Mirror.start(video); video.hidden = false; mo.el.classList.add("mirroring"); apply(view.side, 0); }
      catch (e) { toast(e && (e.name === "NotAllowedError" || e.name === "SecurityError") ? "Sin permiso para la cámara. Habilitalo en los ajustes del navegador." : "No se pudo abrir la cámara."); }
    }
    $$("[data-side]").forEach((b) => (b.onclick = () => { token++; apply(+b.dataset.side); }));
    $$("[data-slowword]").forEach((b) => (b.onclick = () => {
      token++; clearTimeout(seqTimer);
      $$("[data-slowword]").forEach((x) => x.classList.toggle("on", x === b));
      mo.setMarks([]);
      playWord(mo, b.dataset.slowword, $("#gphones"), $("#ghint"));
    }));
    $$("[data-pdrill]").forEach((b) => (b.onclick = () => go({ name: "drill", id: b.getAttribute("data-pdrill") })));
    $$("[data-pserie]").forEach((b) => (b.onclick = () => go({ name: "serie", id: b.getAttribute("data-pserie"), i: 0 })));
    $("[data-act=wdrill]").onclick = () => go({ name: "wdrill", id: view.id, i: 0 });
    apply(view.side, 0);
  }

  /* palabras sueltas de una guía, con micrófono */
  function vWdrill() {
    const g = SND.GUIDES[view.id];
    if (!g) { view = { name: "sonidos" }; vSonidos(); return; }
    const i = view.i || 0, w = g.words[i % g.words.length];
    app.innerHTML = `<div class="screen stack">${header(g.title, "Palabra " + ((i % g.words.length) + 1) + " de " + g.words.length, true)}${engineCard()}
      <section class="card"><p class="hint">Decí</p><p class="target">${esc(w)}</p>
        <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(w)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(w)}" data-slow>Lento</button><button class="btn sm" data-word="${esc(w)}">${I.mouth} La boca</button></div>
        ${stageHTML()}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">Siguiente palabra ${I.next}</button></section></div>`;
    wireNav({ name: "guia", id: view.id });
    $("#nextbtn").onclick = () => { view.i = i + 1; render(); window.scrollTo(0, 0); };
    bindStage("pair", async (audio) => {
      const tiny = ST.settings.model === "whisper-tiny";
      const r = await Eng.run("sentence", { audio, target: w, lam: 0.6, flagThreshold: tiny ? 1.0 : 0.5, strongThreshold: tiny ? 3.0 : 2.5 });
      const res = $("#result"), card = $("#resultcard");
      if (!res) return;
      if (r.silent) { res.innerHTML = `<p class="err">No te escuché. Probá de nuevo, más cerca del teléfono.</p>`; card.hidden = false; return; }
      const wd = r.words[0] || { s: 0 }, fl = r.flags && r.flags[0];
      const v = fl && fl.strong ? "bad" : wd.s >= 70 && !fl ? "good" : wd.s >= 40 ? "mid" : "bad";
      const sd = g.sides[sideForWord(g, w)];
      Mic.chime(v === "good");
      res.innerHTML = `<div class="verdict ${v}"><strong>${v === "good" ? "Bien, se entendió «" + esc(w) + "»" : fl ? "Sonó como «" + esc(fl.alt) + "»" : v === "mid" ? "Se entendió a medias" : "No se entendió «" + esc(w) + "»"}</strong><span>${v === "good" ? "Claridad " + wd.s + " de 100." : esc(sd.label) + ": " + esc(sd.note).toLowerCase() + "."}</span></div>
        <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(w)}">${I.speaker} Modelo</button><button class="btn sm" data-word="${esc(w)}">${I.mouth} La boca</button></div>`;
      logHist("word", wd.s, { w, g: view.id });
      card.hidden = false; bindCommon(card); card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- CHARLÁ ---------- */
  const avIdx = (name) => { let h = 0; for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % 4; };
  const avatar = (name) => `<span class="av av${avIdx(name)}" aria-hidden="true">${esc(String(name).replace(/^(Officer|Ms\.|Mr\.)\s*/, "").charAt(0))}</span>`;
  const PERSONA_TONE = { Alex: "m", Sarah: "f", Nora: "f", Emma: "f", Liam: "m", "Ms. Carter": "f", Tom: "m" };

  function vCharla() {
    const best = ST.convs || {};
    app.innerHTML = `<div class="screen stack">${header("Charlá", "Conversación")}
      <p class="muted">Hablás con personajes en situaciones reales. Te escuchan, te contestan y te marcan lo que conviene corregir.</p>
      ${[["Trabajo", ["meet", "meeting", "interview", "pitch", "disagree", "press", "agency", "dinner"]], ["Viajes y vida diaria", null]].map(([title, ids], gi, all) => { const used = new Set(all[0][1]); const list = CV.SCENES.filter((sc) => (ids ? ids.includes(sc.id) : !used.has(sc.id))); return `<section class="stack"><h3>${title}</h3><div class="list">${list.map((sc) => { const b = best[sc.id]; return `<button class="item" data-conv="${sc.id}">${avatar(sc.who.name)}<span style="min-width:0"><span class="t">${esc(sc.title)}</span><br><span class="s">${esc(sc.who.name)} · ${esc(sc.sub)}</span></span>${b ? `<span class="pill ${b.best >= 75 ? "good" : b.best >= 50 ? "mid" : "bad"}">${b.best}%</span>` : `<span class="pill">${esc(sc.level)}</span>`}</button>`; }).join("")}</div></section>`; }).join("")}
      <section class="card aicard"><div class="row" style="gap:12px;flex-wrap:nowrap"><span class="badge spark">${I.spark}</span><div style="min-width:0"><h3>Charla libre con Claude</h3><p class="small muted">Sin guion: hablás de lo que quieras y te contesta en voz alta.</p></div></div><button class="btn primary" data-go="ia">Elegir tema ${I.next}</button></section>
      <section class="card flat"><h3>Respuesta libre</h3><p class="small muted">Respondé una pregunta durante hasta 30 segundos y mirá qué se entendió.</p><button class="btn sm" data-go="habla">${I.chat} Probar</button></section>
    </div>`;
    wireNav();
    $$("[data-conv]").forEach((b) => (b.onclick = () => go({ name: "conv", id: b.getAttribute("data-conv") })));
  }

  /* mensajes de una charla (guiada o con Claude) */
  function msgHTML(m) {
    if (m.k === "them") {
      const show = ST.settings.showText !== false || m.reveal;
      return `<div class="msg them">${avatar(m.who)}<div class="bub"><p class="en${show ? "" : " veil"}"${show ? "" : ' data-reveal role="button" tabindex="0" aria-label="Mostrar el texto"'}>${esc(m.text)}</p>${m.es ? `<p class="es" hidden>${esc(m.es)}</p>` : ""}<div class="tools"><button class="mini" data-say="${esc(m.text)}" data-tone="${esc(m.tone || "")}" data-accent="${esc(m.accent || "")}" aria-label="Escuchar de nuevo">${I.speaker}</button><button class="mini" data-say="${esc(m.text)}" data-tone="${esc(m.tone || "")}" data-accent="${esc(m.accent || "")}" data-slow>Lento</button>${m.es ? `<button class="mini" data-es aria-pressed="false">ES</button>` : ""}</div></div></div>`;
    }
    if (m.k === "me") {
      const ws = (m.words || []).filter((w) => w.w && /[a-z]/i.test(w.w));
      const chips = ws.length ? ws.map((w) => `<button class="w ${wordClass(w.s)}" data-word="${esc(w.w)}">${esc(w.w)}</button>`).join("") : `<span>${esc(m.text)}</span>`;
      return `<div class="msg me"><div class="bub"><div class="words">${chips}</div>${m.ok ? "" : `<p class="small notok">${esc(m.note || "Eso no responde a lo que te preguntó.")}</p>`}${(m.fixes || []).map((f) => `<div class="fix"><b>«${esc(f.from)}» → «${esc(f.to)}»</b><span>${esc(f.why)}</span>${f.to.indexOf("…") < 0 ? `<button class="mini" data-say="${esc(f.to)}" aria-label="Escuchar la corrección">${I.speaker}</button>` : ""}</div>`).join("")}${m.aiFix ? `<div class="fix"><span>${esc(m.aiFix)}</span></div>` : ""}</div></div>`;
    }
    if (m.k === "note") return `<p class="lognote">${esc(m.text)}</p>`;
    if (m.k === "html") return m.html;
    return "";
  }
  function appendMsg(m, scroll) {
    const log = $("#log"); if (!log) return null;
    log.insertAdjacentHTML("beforeend", msgHTML(m));
    const el = log.lastElementChild;
    bindCommon(el);
    if (scroll !== false && el) el.scrollIntoView({ behavior: "smooth", block: "end" });
    return el;
  }
  function refreshMsg(sess, m) {
    const log = $("#log"); if (!log) return;
    const i = sess.log.indexOf(m); const el = log.children[i]; if (!el) return;
    el.outerHTML = msgHTML(m); bindCommon(log.children[i]);
  }

  /* ---- charla guiada ---- */
  let CONV = null;
  const EXPAND = [[/\bi'm\b/g, "i am"], [/\bit's\b/g, "it is"], [/\bdon't\b/g, "do not"], [/\bi'd\b/g, "i would"], [/\bi've\b/g, "i have"], [/\bwe're\b/g, "we are"], [/\bthat's\b/g, "that is"], [/\bwhat's\b/g, "what is"], [/\bcan't\b/g, "cannot"], [/\bi'll\b/g, "i will"], [/\bwe'll\b/g, "we will"], [/\byou're\b/g, "you are"], [/\bthey're\b/g, "they are"], [/\bhere's\b/g, "here is"], [/\bwhere's\b/g, "where is"]];
  const normText = (t) => " " + String(t || "").toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  const expandC = (n) => EXPAND.reduce((a, [re, r]) => a.replace(re, r), n);
  const titleCase = (x) => String(x).replace(/\b[a-z]/g, (c) => c.toUpperCase());
  function fillT(text) {
    if (Array.isArray(text) && !CONV) text = text[0];
    if (Array.isArray(text)) { CONV._pick = CONV._pick || new Map(); if (!CONV._pick.has(text)) CONV._pick.set(text, pick(text)); text = CONV._pick.get(text); }
    const raw = (CONV && CONV.slots) || {}, sl = {};
    for (const k in raw) sl[k] = /name|city|country|place/.test(k) ? raw[k] : String(raw[k]).toLowerCase();
    return String(text).replace(/\{(\w+)\|([^}]*)\}/g, (_, k, fb) => sl[k] || fb).replace(/,?\s*\{(\w+)\}/g, (m0, k) => (sl[k] ? m0.replace("{" + k + "}", sl[k]) : ""));
  }
  function findFixes(text) {
    const out = [];
    for (const f of CV.FIXES) { const m = String(text).match(f.re); if (!m) continue; const r = f.fix(m); if (r && !out.some((x) => x.to === r)) out.push({ from: m[0].trim(), to: r, why: f.why }); }
    return out.slice(0, 2);
  }
  function convStart(id) {
    const sc = CV.SCENES.find((x) => x.id === id) || CV.SCENES[0];
    CONV = { sc, turn: sc.start, attempt: 0, slots: {}, scores: [], fixes: [], low: [], started: false, done: false, log: [] };
  }
  const voiceOf = (sc) => ({ tone: sc.who.tone, accent: sc.who.accent });
  function addC(m) { CONV.log.push(m); appendMsg(m); return m; }
  function vConv() {
    if (!CONV || CONV.sc.id !== view.id) convStart(view.id);
    const my = CONV, sc = my.sc;
    app.innerHTML = `<div class="screen conv">
      <header class="top"><button class="iconbtn" data-back aria-label="Volver">${I.back}</button><div class="who">${avatar(sc.who.name)}<div style="min-width:0"><p class="t">${esc(sc.who.name)}</p><p class="s">${esc(sc.who.role)} · ${esc(sc.title)}</p></div></div><button class="iconbtn" data-act="restart" aria-label="Empezar de nuevo">${I.retry}</button></header>
      ${engineCard()}
      <div class="log" id="log" aria-live="polite"></div>
      <div class="dock" id="dock"></div></div>`;
    wireNav({ name: "charla" });
    $("[data-act=restart]").onclick = () => { convStart(sc.id); render(); };
    my.log.forEach((m) => appendMsg(m, false));
    onLeave(() => { TTS.stop(); if (Mic.state === "rec") Mic.stop(); });
    if (!my.started) dockIntro(); else if (my.done) dockDone(); else dockTurn();
  }
  function dockIntro() {
    const sc = CONV.sc;
    $("#dock").innerHTML = `<p class="small">${esc(sc.intro)}</p><p class="tiny">Escuchá a ${esc(sc.who.name)} y respondé con el micrófono. Si no entendés, podés decir «Sorry, can you repeat?».</p><button class="btn primary" data-act="go">${I.play} Empezar la charla</button>`;
    $("[data-act=go]").onclick = () => { CONV.started = true; Eng.start(); partnerTurn(CONV.turn); };
  }
  function dockListening(sess, name) {
    const d = $("#dock"); if (!d) return;
    d.innerHTML = `<div class="dockrow"><span class="spin" style="color:var(--accent)"></span><p class="small muted grow">${esc(name)} está hablando…</p><button class="btn sm ghost" data-act="answer">Responder ya</button></div>`;
    $("[data-act=answer]").onclick = () => { TTS.stop(); sess === CONV ? dockTurn() : aiDock(); };
  }
  const hintHTML = (t) => `<p class="hintline">${I.bulb} ${t.hint.map(esc).join(" · ")}</p>`;
  const modelHTML = (t, voice) => `<div class="model"><p class="tiny">Podés decir:</p>${t.model.map((x) => `<p class="modelline"><button class="mini" data-say="${esc(x)}" aria-label="Escuchar">${I.speaker}</button><span>${esc(x)}</span></p>`).join("")}</div>`;
  function dockTurn() {
    const d = $("#dock"); if (!d || !CONV) return;
    const t = CONV.sc.turns[CONV.turn];
    const a = CONV.attempt;
    d.innerHTML = `<div><p class="eyebrow">Tu turno</p><p class="goal">${esc(t.you)}</p></div>
      <div class="hints" id="hints">${a >= 1 ? hintHTML(t) : ""}${a >= 2 ? modelHTML(t) : ""}</div>
      <div class="dockrow"><div class="micwrap sm"><div class="micring" id="ring"></div><button class="mic sm" id="mic" aria-label="Responder">${I.mic}</button></div>
        <div class="grow"><div class="miclabel left" id="miclabel">Tocá y respondé</div><div class="row tight">${a < 1 ? `<button class="btn sm ghost" data-act="hint">${I.bulb} Pista</button>` : ""}${a < 2 ? `<button class="btn sm ghost" data-act="model">Ejemplo</button>` : ""}${a >= 3 ? `<button class="btn sm" data-act="skip">Seguir ${I.next}</button>` : ""}</div></div></div>`;
    const hb = $("[data-act=hint]"); if (hb) hb.onclick = () => { $("#hints").insertAdjacentHTML("afterbegin", hintHTML(t)); hb.remove(); };
    const mb = $("[data-act=model]"); if (mb) mb.onclick = () => { $("#hints").insertAdjacentHTML("beforeend", modelHTML(t)); bindCommon($("#hints")); mb.remove(); };
    const sk = $("[data-act=skip]"); if (sk) sk.onclick = () => { CONV.scores.push(0); partnerTurn(t.next, "No worries."); };
    bindCommon(d);
    bindStage("conv", convAudio, "Tocá y respondé");
  }
  async function partnerTurn(id, pre) {
    const my = CONV; if (!my) return;
    my.turn = id; my.attempt = 0;
    const t = my.sc.turns[id];
    const text = ((pre ? pre + " " : "") + fillT(t.say)).trim();
    addC({ k: "them", text, es: t.es, who: my.sc.who.name, tone: my.sc.who.tone, accent: my.sc.who.accent });
    dockListening(my, my.sc.who.name);
    await TTS.say(text, null, voiceOf(my.sc));
    if (CONV !== my || my.turn !== id || !$("#dock")) return;
    if (t.end) { finishConv(); return; }
    dockTurn();
  }
  async function convAudio(audio) {
    const my = CONV;
    const r = await Eng.run("free", { audio });
    if (CONV !== my || !$("#dock")) return;
    if (r.silent || !r.text || !r.text.trim()) { const l = $("#miclabel"); if (l) l.textContent = "No te escuché. Probá de nuevo."; return; }
    await convAnswer(r);
  }
  async function convAnswer(r) {
    const my = CONV, t = my.sc.turns[my.turn];
    const nrm = normText(r.text), both = nrm + "|" + expandC(nrm);
    const words = (r.words || []).filter((w) => /[a-z]/i.test(w.w));
    const avg = words.length ? words.reduce((a, b) => a + b.s, 0) / words.length : 0;
    const nW = nrm.trim().split(" ").filter(Boolean).length;
    const plausible = avg >= 18 || nW >= 3;
    const ok = plausible && (t.expect ? t.expect.some((re) => re.test(both)) : nW >= (t.open || 1));
    const fixes = findFixes(r.text);
    words.filter((w) => w.s < 40).forEach((w) => { const c = cleanW(w.w); if (c && !my.low.includes(c)) my.low.push(c); });
    fixes.forEach((f) => { if (!my.fixes.some((x) => x.to === f.to)) my.fixes.push(f); });
    if (!ok && nW <= 6 && CV.REPAIR.test(r.text)) {
      addC({ k: "me", words, text: r.text, ok: true, fixes });
      addC({ k: "note", text: "Le pediste que repita: eso también es conversar." });
      const text = "Sure. " + fillT(t.say);
      addC({ k: "them", text, es: t.es, who: my.sc.who.name, tone: my.sc.who.tone, accent: my.sc.who.accent });
      dockListening(my, my.sc.who.name);
      await TTS.say(text, 0.72, voiceOf(my.sc));
      if (CONV === my && $("#dock")) dockTurn();
      return;
    }
    addC({ k: "me", words, text: r.text, ok, fixes, note: plausible ? "Eso no responde a lo que te preguntó." : "No se entendió bien. Probá de nuevo, más claro." });
    if (ok) {
      if (t.slot) for (const k in t.slot) { const m = both.match(t.slot[k]); const v = m && (m[1] || m[2]); if (v && !(k === "name" && CV.NOT_NAME.test(v))) my.slots[k] = titleCase(v.trim()); }
      my.scores.push(my.attempt === 0 ? 1 : my.attempt === 1 ? 0.6 : 0.3);
      let next = t.next;
      (t.branch || []).some((b) => (b.if.test(both) ? ((next = b.to), true) : false));
      const reacts = (t.react || []).filter((x) => (x.match(/\{(\w+)\}/g) || []).every((ph) => my.slots[ph.slice(1, -1)]));
      const nextSay = fillT((my.sc.turns[next] && my.sc.turns[next].say) || "");
      const startsAck = /^(sure|great|okay|ok|perfect|nice|thanks|thank you|of course|oh|wow|interesting|exactly|not at all|yes|yum|sounds|that's|let me|no problem|well|impressive)\b/i.test(nextSay);
      const pre = reacts.length ? fillT(pick(reacts)) : !startsAck && Math.random() < 0.35 ? pick(CV.ACK) : "";
      await partnerTurn(next, pre);
      return;
    }
    my.attempt++;
    if (my.attempt >= 3) { dockTurn(); return; }
    const text = pick(CV.SORRY) + " " + fillT(t.say);
    addC({ k: "them", text, es: t.es, who: my.sc.who.name, tone: my.sc.who.tone, accent: my.sc.who.accent });
    dockListening(my, my.sc.who.name);
    await TTS.say(text, 0.85, voiceOf(my.sc));
    if (CONV === my && $("#dock")) dockTurn();
  }
  function summaryHTML(title, score, first, total, fixes, low) {
    const guides = [];
    low.forEach((w) => { const g = guideForWord(w); if (g && !guides.includes(g)) guides.push(g); });
    return `<section class="card summary"><p class="eyebrow">${esc(title)}</p>
      ${score != null ? `<div class="stats"><div class="stat"><b>${score}%</b><span>puntaje</span></div><div class="stat"><b>${first}/${total}</b><span>entendidas de una</span></div><div class="stat"><b>${fixes.length}</b><span>correcciones</span></div></div>` : ""}
      ${fixes.length ? `<div class="stack"><h3>Para decirlo mejor</h3>${fixes.map((f) => `<div class="fix"><b>«${esc(f.from)}» → «${esc(f.to)}»</b><span>${esc(f.why)}</span></div>`).join("")}</div>` : ""}
      ${low.length ? `<div class="stack"><h3>Palabras que costó entender</h3><div class="wchips">${low.slice(0, 10).map((w) => `<button class="chip" data-word="${esc(w)}">${I.mouth} ${esc(w)}</button>`).join("")}</div><p class="tiny">Tocá una para ver cómo se mueve la boca.</p></div>` : `<p class="small muted">Se entendieron bien todas tus palabras.</p>`}
      ${guides.length ? `<div class="row">${guides.slice(0, 3).map((g) => `<button class="btn sm ghost" data-guide="${g}">${I.mouth} ${esc(SND.GUIDES[g].title)}</button>`).join("")}</div>` : ""}
    </section>`;
  }
  function finishConv() {
    const my = CONV; my.done = true;
    const sc = my.sc, n = my.scores.length;
    const score = n ? Math.round(100 * my.scores.reduce((a, b) => a + b, 0) / n) : 0;
    const first = my.scores.filter((x) => x === 1).length;
    const all = (ST.convs = ST.convs || {}); const cs = all[sc.id] || (all[sc.id] = { best: 0, n: 0 }); cs.n++; cs.best = Math.max(cs.best, score); cs.last = score;
    logHist("conv", score, { id: sc.id });
    addC({ k: "html", html: summaryHTML("Charla terminada", score, first, n, my.fixes, my.low) });
    dockDone();
  }
  function dockDone() {
    const d = $("#dock"); if (!d) return;
    d.innerHTML = `<div class="row"><button class="btn primary" data-act="again">${I.retry} Otra vez</button><button class="btn" data-act="other">Otra charla</button></div>`;
    $("[data-act=again]").onclick = () => { const id = CONV.sc.id; convStart(id); render(); };
    $("[data-act=other]").onclick = () => go({ name: "charla" });
  }

  /* ---- charla libre con Claude ---- */
  const AIK = "voz-ai-key";
  const aiKey = () => { try { return localStorage.getItem(AIK) || ""; } catch (e) { return ""; } };
  const AI_MODELS = { fast: { id: "claude-haiku-4-5-20251001", name: "Rápido" }, best: { id: "claude-sonnet-5-5", name: "Mejor" } };
  const aiModel = () => (AI_MODELS[ST.settings.aiModel] || AI_MODELS.fast).id;
  let AI = null;
  function vIA() {
    const key = aiKey(), sel = view.topic || "free";
    const topic = CV.AI_TOPICS.find((x) => x.id === sel) || CV.AI_TOPICS[0];
    app.innerHTML = `<div class="screen stack">${header("Charla libre", "Con Claude", true)}
      <section class="card"><h3>Elegí el tema</h3><div class="wchips" role="group" aria-label="Tema">${CV.AI_TOPICS.map((x) => `<button class="chip${x.id === sel ? " on" : ""}" data-topic="${x.id}" aria-pressed="${x.id === sel}">${esc(x.title)}</button>`).join("")}</div></section>
      <section class="card"><h3>Acá adentro, con tu voz analizada</h3>
        ${key ? `<p class="small muted">Hablás, Voz transcribe tu voz en el teléfono y Claude te contesta en voz alta y te corrige. Tu audio no sale del teléfono: a Claude solo le llega el texto.</p><button class="btn primary" data-act="start">${I.mic} Empezar: ${esc(topic.title)}</button>`
        : `<p class="small muted">Para charlar dentro de Voz hace falta una clave de la API de Claude. Se paga aparte del plan de Claude, según el uso: una charla larga cuesta unos centavos de dólar.</p>
          <ol class="gsteps"><li><span class="num">1</span><span>Entrá a <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>, cargá crédito y creá una clave.</span></li><li><span class="num">2</span><span>Copiala y pegala acá. Queda guardada solo en este teléfono.</span></li></ol>
          <label class="field" for="aikey"><span class="small">Clave de la API</span><input id="aikey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="sk-ant-…"></label>
          <button class="btn primary" data-act="savekey">${I.key} Guardar y probar</button><p class="err" id="keyerr" hidden></p>`}
      </section>
      <section class="card flat"><h3>En la app de Claude</h3><p class="small muted">Sin configurar nada: se abre una charla nueva con la consigna lista y la copia por las dudas. Tocá el ícono de voz para hablar. No tiene el análisis de pronunciación de Voz.</p><button class="btn" data-act="handoff">${I.ext} Abrir en Claude</button></section>
    </div>`;
    wireNav({ name: "charla" });
    $$("[data-topic]").forEach((b) => (b.onclick = () => { view.topic = b.dataset.topic; render(); }));
    const st = $("[data-act=start]"); if (st) st.onclick = () => go({ name: "iachat", topic: sel });
    const sk = $("[data-act=savekey]");
    if (sk) sk.onclick = async () => {
      const v = ($("#aikey").value || "").trim(), err = $("#keyerr");
      err.hidden = true;
      if (!/^sk-ant-[A-Za-z0-9_\-]{20,}$/.test(v)) { err.textContent = "Esa no parece una clave de Claude: empieza con «sk-ant-»."; err.hidden = false; return; }
      sk.disabled = true; sk.innerHTML = `<span class="spin"></span> Probando…`;
      try {
        await claudeCall(v, { model: aiModel(), max_tokens: 1, messages: [{ role: "user", content: "Hi" }] });
        try { localStorage.setItem(AIK, v); } catch (e) {}
        toast("Clave guardada."); render();
      } catch (e) { err.textContent = aiError(e); err.hidden = false; sk.disabled = false; sk.innerHTML = `${I.key} Guardar y probar`; }
    };
    $("[data-act=handoff]").onclick = () => {
      const prompt = CV.handoffPrompt(topic.title);
      try { navigator.clipboard && navigator.clipboard.writeText(prompt).catch(() => {}); } catch (e) {}
      window.open("https://claude.ai/new?q=" + encodeURIComponent(prompt), "_blank", "noopener");
      toast("Consigna copiada. Si no aparece, pegala en Claude.");
    };
  }
  function aiError(e) {
    const st = e && e.status, msg = String((e && e.message) || "");
    if (e && e.name === "AbortError") return "Se canceló.";
    if (st === 401) return "La clave no es válida. Revisala y pegala de nuevo.";
    if (st === 403) return "Esa clave no tiene permiso para usar Claude.";
    if (st === 429) return "Demasiados pedidos seguidos. Esperá un minuto y probá de nuevo.";
    if (st === 400 && /credit|balance|billing/i.test(msg)) return "La cuenta de la API no tiene crédito. Cargalo en console.anthropic.com.";
    if (st === 529 || st === 500 || st === 503) return "Claude está saturado en este momento. Probá en un rato.";
    if (!st) return "No hay conexión con Claude. Revisá internet.";
    return "No se pudo hablar con Claude (" + st + "). " + msg.slice(0, 120);
  }
  async function claudeCall(key, body, onText, signal) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal,
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify(Object.assign({}, body, onText ? { stream: true } : {}))
    });
    if (!res.ok) { let msg = ""; try { const j = await res.json(); msg = (j && j.error && j.error.message) || ""; } catch (e) {} throw { status: res.status, message: msg }; }
    if (!onText) { const j = await res.json(); return (j.content || []).map((c) => c.text || "").join(""); }
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = "", text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
        const line = chunk.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let ev; try { ev = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
        if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") { text += ev.delta.text; onText(text); }
        else if (ev.type === "error") throw { status: 529, message: (ev.error && ev.error.message) || "" };
      }
    }
    return text;
  }
  function parseAI(txt) {
    const r = /<reply>([\s\S]*?)(?:<\/reply>|$)/i.exec(txt), f = /<fix>([\s\S]*?)(?:<\/fix>|$)/i.exec(txt);
    const reply = (r ? r[1] : txt.replace(/<fix>[\s\S]*$/i, "").replace(/<\/?reply>/gi, "")).replace(/<[^>]*$/, "").trim();
    return { reply, fix: f ? f[1].replace(/<[^>]*$/, "").trim() : "" };
  }
  function addA(m) { AI.log.push(m); appendMsg(m); return m; }
  function vIAChat() {
    if (!aiKey()) { view = { name: "ia", topic: view.topic }; vIA(); return; }
    if (!AI || AI.topic !== view.topic) AI = { topic: view.topic || "free", msgs: [], log: [], started: false, done: false, ctrl: null, fixes: [], low: [] };
    const my = AI, topic = CV.AI_TOPICS.find((x) => x.id === my.topic) || CV.AI_TOPICS[0];
    my.persona = CV.AI_PERSONAS[my.topic] || "Alex";
    app.innerHTML = `<div class="screen conv">
      <header class="top"><button class="iconbtn" data-back aria-label="Volver">${I.back}</button><div class="who">${avatar(my.persona)}<div style="min-width:0"><p class="t">${esc(my.persona)}</p><p class="s">Claude · ${esc(topic.title)}</p></div></div><button class="iconbtn" data-act="restart" aria-label="Empezar de nuevo">${I.retry}</button></header>
      ${engineCard()}
      <div class="log" id="log" aria-live="polite"></div>
      <div class="dock" id="dock"></div></div>`;
    wireNav({ name: "ia", topic: my.topic });
    $("[data-act=restart]").onclick = () => { if (my.ctrl) my.ctrl.abort(); AI = null; render(); };
    my.log.forEach((m) => appendMsg(m, false));
    onLeave(() => { TTS.stop(); if (Mic.state === "rec") Mic.stop(); });
    if (!my.started) {
      $("#dock").innerHTML = `<p class="small">Tema: ${esc(topic.title)}. ${esc(my.persona)} arranca la charla y vos respondés con el micrófono.</p><button class="btn primary" data-act="go">${I.play} Empezar</button>`;
      $("[data-act=go]").onclick = () => { my.started = true; Eng.start(); try { speechSynthesis.speak(new SpeechSynthesisUtterance(" ")); } catch (e) {} aiTurn(null); };
    } else if (my.done) aiDone(); else aiDock();
  }
  function aiDock(note) {
    const d = $("#dock"); if (!d || !AI) return;
    d.innerHTML = `${note ? `<p class="err">${esc(note)}</p>` : ""}<div class="dockrow"><div class="micwrap sm"><div class="micring" id="ring"></div><button class="mic sm" id="mic" aria-label="Responder">${I.mic}</button></div>
      <div class="grow"><div class="miclabel left" id="miclabel">Tocá y respondé</div><div class="row tight">${note ? `<button class="btn sm" data-act="retry">${I.retry} Reintentar</button>` : ""}<button class="btn sm ghost" data-act="end">Terminar</button></div></div></div>`;
    const rt = $("[data-act=retry]"); if (rt) rt.onclick = () => aiTurn(AI.pending, true);
    $("[data-act=end]").onclick = () => aiFinish();
    bindStage("conv", aiAudio, "Tocá y respondé");
  }
  async function aiAudio(audio) {
    const my = AI;
    const r = await Eng.run("free", { audio });
    if (AI !== my || !$("#dock")) return;
    if (r.silent || !r.text || !r.text.trim()) { const l = $("#miclabel"); if (l) l.textContent = "No te escuché. Probá de nuevo."; return; }
    const words = (r.words || []).filter((w) => /[a-z]/i.test(w.w));
    words.filter((w) => w.s < 40).forEach((w) => { const c = cleanW(w.w); if (c && !my.low.includes(c)) my.low.push(c); });
    my.lastMe = addA({ k: "me", words, text: r.text, ok: true, fixes: [] });
    await aiTurn(r.text.trim());
  }
  async function aiTurn(userText, retry) {
    const my = AI; if (!my) return;
    const topic = CV.AI_TOPICS.find((x) => x.id === my.topic) || CV.AI_TOPICS[0];
    if (!retry) my.msgs.push({ role: "user", content: userText == null ? "(Start the conversation now: greet Maxi and ask your first question about the topic.)" : userText });
    my.pending = userText;
    const bubble = addA({ k: "them", text: "…", who: my.persona, tone: PERSONA_TONE[my.persona] || "f", accent: "US", reveal: true });
    const d = $("#dock"); if (d) d.innerHTML = `<div class="dockrow"><span class="spin" style="color:var(--accent)"></span><p class="small muted grow">${esc(my.persona)} está pensando…</p></div>`;
    const el = $("#log").lastElementChild, enP = el && el.querySelector(".en");
    let full = "";
    try {
      my.ctrl = new AbortController();
      full = await claudeCall(aiKey(), { model: aiModel(), max_tokens: 300, system: CV.aiSystem(topic.en, my.persona), messages: my.msgs }, (txt) => { if (enP && enP.isConnected) enP.textContent = parseAI(txt).reply || "…"; }, my.ctrl.signal);
    } catch (e) {
      if (AI !== my) return;
      my.log.splice(my.log.indexOf(bubble), 1); if (el) el.remove();
      aiDock(aiError(e));
      return;
    }
    if (AI !== my) return;
    const p = parseAI(full);
    my.msgs.push({ role: "assistant", content: p.reply || full });
    bubble.text = p.reply || "…"; refreshMsg(my, bubble);
    if (p.fix && my.lastMe) { my.lastMe.aiFix = p.fix; my.fixes.push({ from: "", to: "", why: p.fix }); refreshMsg(my, my.lastMe); }
    my.lastMe = null;
    dockListening(my, my.persona);
    await TTS.say(bubble.text, null, { tone: bubble.tone, accent: "US" });
    if (AI === my && $("#dock") && !my.done) aiDock();
  }
  function aiFinish() {
    const my = AI; if (!my) return;
    my.done = true; TTS.stop();
    const fixes = my.log.filter((m) => m.k === "me" && m.aiFix).map((m) => ({ from: m.text.slice(0, 60), to: "", why: m.aiFix }));
    addA({ k: "html", html: `<section class="card summary"><p class="eyebrow">Charla terminada</p>
      ${fixes.length ? `<div class="stack"><h3>Correcciones</h3>${fixes.map((f) => `<div class="fix"><span>${esc(f.why)}</span></div>`).join("")}</div>` : `<p class="small muted">Sin correcciones importantes.</p>`}
      ${my.low.length ? `<div class="stack"><h3>Palabras que costó entender</h3><div class="wchips">${my.low.slice(0, 10).map((w) => `<button class="chip" data-word="${esc(w)}">${I.mouth} ${esc(w)}</button>`).join("")}</div></div>` : ""}</section>` });
    logHist("ai", fixes.length, { topic: my.topic });
    aiDone();
  }
  function aiDone() {
    const d = $("#dock"); if (!d) return;
    d.innerHTML = `<div class="row"><button class="btn primary" data-act="again">${I.retry} Otra charla</button><button class="btn" data-act="topics">Cambiar tema</button></div>`;
    $("[data-act=again]").onclick = () => { const t = AI.topic; AI = null; go({ name: "iachat", topic: t }); };
    $("[data-act=topics]").onclick = () => go({ name: "ia", topic: AI.topic });
  }

  /* ---------- arranque ---------- */
  TTS.init();
  render();
  Eng.cached().then((c) => { if (c) Eng.start(); });
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  document.addEventListener("visibilitychange", () => { if (document.hidden && Mic.state === "rec") Mic.stop(); });
  window.__voz = { Eng, Mic, ST: () => ST, go, convAudio, aiAudio, openWord, conv: () => CONV, ai: () => AI };
})();
