/* Voz: laboratorio de pronunciación con reconocimiento en el dispositivo. */
(function () {
  "use strict";
  const D = window.VOZ_DATA, C = window.VOZ_CONF || { words: {}, pairRule: {} };
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
    shield: sv('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>')
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
    const w = String(word).toLowerCase().replace(/[^a-z']/g, ""), pr = (C.prons && C.prons[w]) ? C.prons[w].split(" ") : null;
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
    pick() {
      const want = ST.settings.accent === "UK" ? /en[-_]GB/i : /en[-_]US/i;
      const pool = this.voices.filter((v) => want.test(v.lang)), p = pool.length ? pool : this.voices;
      return p.find((v) => /premium|enhanced|natural|neural|siri|google|samantha|ava|allison|serena|daniel|jenny|aria|libby/i.test(v.name)) || p[0] || null;
    },
    say(text, rate) {
      if (!("speechSynthesis" in window)) { toast("Este navegador no tiene voces en inglés."); return Promise.resolve(); }
      try { speechSynthesis.cancel(); } catch (e) {}
      return new Promise((res) => {
        const u = new SpeechSynthesisUtterance(text), v = this.pick();
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = ST.settings.accent === "UK" ? "en-GB" : "en-US";
        u.rate = rate || ST.settings.rate; u.onend = res; u.onerror = res;
        speechSynthesis.speak(u);
        setTimeout(res, 12000);
      });
    }
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
        const e = await window.VozEngine.create({ T, modelId: this.model, dtype: "q8", priors: window.VOZ_PRIORS, onProgress: (p) => { if (p.total) { this.loaded = p.loaded; this.total = p.total; } this.emit(); } });
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
  const MODES = { pair: { silence: 0.75, max: 4, wait: 7 }, sentence: { silence: 1.3, max: 15, wait: 7 }, shadow: { silence: 1.1, max: 10, wait: 7 }, free: { silence: 2.6, max: 30, wait: 8 } };
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
    $$("[data-say]", root).forEach((b) => (b.onclick = () => TTS.say(b.getAttribute("data-say"), b.hasAttribute("data-slow") ? 0.65 : undefined)));
    $$("[data-me]", root).forEach((b) => (b.onclick = () => { if (lastAudio) Mic.play(lastAudio); }));
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
    const pct = Math.round(r.p * 100);
    let head;
    if (r.verdict === "unclear") return `<div class="verdict mid"><strong>No se entendió la palabra</strong><span>El reconocedor no escuchó «${esc(target)}» ni «${esc(other)}». Decí solo la palabra, clara y separada.</span></div>
      <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(target)}">${I.speaker} Modelo</button></div>`;
    if (r.verdict === "good") head = `<div class="verdict good"><strong>Bien, sonó «${esc(target)}»</strong><span>Se distingue de «${esc(other)}».</span></div>`;
    else if (r.verdict === "mid") head = `<div class="verdict mid"><strong>Quedó entre «${esc(target)}» y «${esc(other)}»</strong><span>${esc(tipFor(rule, target, other))}</span></div>`;
    else head = `<div class="verdict bad"><strong>Sonó «${esc(other)}»</strong><span>${esc(tipFor(rule, target, other))}</span></div>`;
    return `${head}
      <div class="split" role="img" aria-label="${pct}% ${esc(target)}"><div class="a" style="flex:${Math.max(pct, 1)} 1 0">${esc(target)} ${pct}%</div><div class="b" style="flex:${Math.max(100 - pct, 1)} 1 0">${esc(other)}</div></div>
      <div class="row"><button class="btn sm" data-me>${I.me} Escucharte</button><button class="btn sm" data-say="${esc(target)}">${I.speaker} Modelo</button><button class="btn sm" data-say="${esc(target)}" data-slow>Lento</button></div>`;
  }
  async function analyzeSentence(audio, text) {
    const tiny = ST.settings.model === "whisper-tiny";
    const r = await Eng.run("sentence", { audio, target: text, lam: 0.6, flagThreshold: tiny ? 1.0 : 0.5, strongThreshold: tiny ? 3.0 : 2.5 });
    return r;
  }
  function sentenceResultHTML(r) {
    if (r.silent) return `<p class="err">No te escuché. Probá de nuevo.</p>`;
    const chips = r.words.map((w) => `<span class="w ${w.like && w.strong ? "r" : w.like && w.s >= 70 ? "o" : wordClass(w.s)}">${esc(w.w)}${w.like ? `<small>${w.strong ? "sonó" : "se acerca a"} «${esc(w.like)}»</small>` : ""}</span>`).join("");
    const rules = [], seen = new Set();
    r.flags.forEach((f) => { if (!seen.has(f.rule)) { seen.add(f.rule); rules.push(f); } });
    const weak = r.words.filter((w) => w.s < 40 && !w.like);
    const byIssue = new Map();
    weak.forEach((w) => { const k = likelyIssue(w.w); if (!byIssue.has(k)) byIssue.set(k, []); byIssue.get(k).push(w.w); });
    const issueTips = Array.from(byIssue.entries()).filter(([k]) => k !== "GENERIC").concat(byIssue.has("GENERIC") ? [["GENERIC", byIssue.get("GENERIC")]] : []);
    const tips = rules.slice(0, 3).map((f) => `<div class="tip"><b>«${esc(f.word)}» ${f.strong ? "sonó" : "se acerca a"} «${esc(f.alt)}»</b><span>${esc(tipFor(f.rule, f.word, f.alt))}</span><div class="row"><button class="btn sm" data-say="${esc(f.word)}">${I.speaker} ${esc(f.word)}</button><button class="btn sm" data-say="${esc(f.alt)}">${I.speaker} ${esc(f.alt)}</button></div></div>`).join("")
      + issueTips.slice(0, Math.max(0, 3 - rules.length)).map(([k, ws]) => `<div class="tip"><b>Poco clara${ws.length > 1 ? "s" : ""}: ${esc(ws.slice(0, 4).join(", "))}</b><span>${esc((D.ISSUE[k] || D.ISSUE.GENERIC).replace(/\{word\}/g, ws[0]))}</span><div class="row"><button class="btn sm" data-say="${esc(ws[0])}">${I.speaker} ${esc(ws[0])}</button><button class="btn sm" data-say="${esc(ws[0])}" data-slow>Lento</button></div></div>`).join("");
    return `<div><p class="score">${r.overall}<small> /100</small></p><p class="tiny">claridad promedio de tus palabras</p></div>
      <div class="stats"><div class="stat"><b>${r.wpm || 0}</b><span>palabras por minuto</span></div><div class="stat"><b>${r.pauses || 0}</b><span>pausas largas</span></div><div class="stat"><b>${r.flags.length}</b><span>sonidos a corregir</span></div></div>
      <div class="words">${chips}</div>
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
  const TABS = [["hoy", "Hoy", I.home], ["pares", "Pares", I.pairs], ["frases", "Frases", I.text], ["repeti", "Repetí", I.repeat], ["habla", "Hablá", I.chat]];
  function renderTabs() {
    const cur = { hoy: "hoy", session: "hoy", progreso: "hoy", pares: "pares", drill: "pares", frases: "frases", serie: "frases", repeti: "repeti", habla: "habla" }[view.name];
    $("#tabs").innerHTML = TABS.map(([id, l, ic]) => `<button class="tab" data-tab="${id}" ${cur === id ? 'aria-current="page"' : ""}>${ic}<span>${l}</span></button>`).join("");
    $$("[data-tab]").forEach((b) => (b.onclick = () => go({ name: b.getAttribute("data-tab") })));
  }
  function go(v) {
    if (Mic.state === "rec") Mic.stop();
    try { speechSynthesis.cancel(); } catch (e) {}
    view = v; render(); window.scrollTo(0, 0);
  }
  function render() {
    renderTabs();
    const f = { hoy: vHoy, session: vSession, progreso: vProgreso, pares: vPares, drill: vDrill, frases: vFrases, serie: vSerie, repeti: vRepeti, habla: vHabla }[view.name] || vHoy;
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
      <section class="stack"><h3>Para trabajar</h3><div class="list">${weak.map((c) => { const a = acc(c.id); return `<button class="item" data-drill="${c.id}"><span class="badge">${esc(c.ex.split(" · ")[0].slice(0, 4))}</span><span style="min-width:0"><span class="t">${esc(c.name)}</span><br><span class="s">${esc(c.ex)}</span></span>${a == null ? '<span class="pill">Nuevo</span>' : `<span class="pill ${a >= 75 ? "good" : a >= 50 ? "mid" : "bad"}">${a}%</span>`}</button>`; }).join("")}</div></section>
      ${!standalone && !ST.tipSeen ? `<section class="card flat" id="installtip"><h3>Tenela como app</h3><p class="small muted">${ios ? "En Safari tocá Compartir y después «Agregar a inicio»." : "En el menú del navegador elegí «Instalar app» o «Agregar a la pantalla principal»."} Se abre a pantalla completa y funciona sin internet.</p><button class="btn sm ghost" data-act="tipok">Entendido</button></section>` : ""}
      <p class="tiny privacy">${I.shield}<span>Tu voz se analiza en el teléfono. No se graba en ningún servidor.</span></p>
    </div>`;
    wireNav();
    $("[data-act=session]").onclick = () => startSession();
    $$("[data-drill]").forEach((b) => (b.onclick = () => go({ name: "drill", id: b.getAttribute("data-drill") })));
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
  function vPares() {
    app.innerHTML = `<div class="screen stack">${header("Pares de sonidos", "Pares mínimos")}
      <p class="muted">Decís una palabra y el reconocedor decide si sonó a esa o a su pareja. Es la forma más directa de entrenar los sonidos que en español no existen.</p>
      <div class="list">${D.CONTRASTS.map((c) => { const a = acc(c.id); return `<button class="item" data-drill="${c.id}"><span class="badge">${esc(c.ex.split(" · ")[0].slice(0, 4))}</span><span style="min-width:0"><span class="t">${esc(c.name)}</span><br><span class="s">${esc(c.ex)}</span></span>${a == null ? '<span class="pill">Nuevo</span>' : `<span class="pill ${a >= 75 ? "good" : a >= 50 ? "mid" : "bad"}">${a}%</span>`}</button>`; }).join("")}</div></div>`;
    wireNav();
    $$("[data-drill]").forEach((b) => (b.onclick = () => go({ name: "drill", id: b.getAttribute("data-drill") })));
  }
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
      wireNav({ name: "pares" }); $("[data-act=again]").onclick = () => { view.round = newRound(c); render(); };
      return;
    }
    app.innerHTML = `<div class="screen stack">${header(c.name, (R.i + 1) + " de " + R.items.length, true)}${engineCard()}
      <section class="card"><p class="hint">Decí</p><p class="target">${esc(it.target)}</p><p class="hint">y no «${esc(it.other)}»</p>
      <div class="row" style="justify-content:center"><button class="btn sm" data-say="${esc(it.target)}">${I.speaker} Escuchar</button><button class="btn sm" data-say="${esc(it.target)}" data-slow>Lento</button><button class="btn sm" data-say="${esc(it.target)}. ${esc(it.other)}.">Comparar</button></div>
      ${stageHTML()}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div><button class="btn primary" id="nextbtn">Siguiente ${I.next}</button></section>
      <details class="card flat"><summary class="small" style="cursor:pointer;font-weight:700">Cómo se hace este sonido</summary><p class="small muted" style="margin-top:8px">${esc(D.ADVICE[c.id] || "")}</p></details></div>`;
    wireNav({ name: "pares" });
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
    app.innerHTML = `<div class="screen stack">${header("Hablá", "Hasta 30 segundos")}${engineCard()}
      <section class="card"><p class="eyebrow">Respondé en inglés</p><p class="sentence" style="text-align:left">${esc(p.en)}</p><p class="small muted">${esc(p.es)}</p>
      <div class="row"><button class="btn sm" data-say="${esc(p.en)}">${I.speaker} Escuchar</button><button class="btn sm ghost" data-act="otra">${I.retry} Otra pregunta</button></div>
      ${stageHTML("Tocá y hablá. Tocá de nuevo para terminar.")}</section>
      <section class="card" id="resultcard" hidden><div class="stack" id="result"></div></section></div>`;
    wireNav();
    $("[data-act=otra]").onclick = () => { view.p = (view.p + 1) % D.PROMPTS.length; render(); };
    bindStage("free", async (audio) => {
      const r = await Eng.run("free", { audio });
      const res = $("#result");
      if (r.silent || !r.text) { res.innerHTML = `<p class="err">No te escuché. Probá de nuevo.</p>`; $("#resultcard").hidden = false; return; }
      const low = r.words.filter((w) => w.s < 40).length;
      res.innerHTML = `<div class="stats"><div class="stat"><b>${r.wpm}</b><span>palabras por minuto</span></div><div class="stat"><b>${r.pauses}</b><span>pausas largas</span></div><div class="stat"><b>${r.seconds}s</b><span>duración</span></div></div>
        <div class="stack"><p class="tiny">Lo que entendió el reconocedor. En rojo, las palabras que le costó entender.</p><div class="words">${r.words.map((w) => `<span class="w ${wordClass(w.s)}">${esc(w.w)}</span>`).join("")}</div></div>
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
      <section class="card flat"><h3>Borrar progreso</h3><p class="small muted">Borra rachas, puntajes e historial de este teléfono.</p><button class="btn sm" data-act="reset">Borrar todo</button></section>
      <p class="tiny">Voz · Ruta de inglés. El reconocimiento usa Whisper de OpenAI corriendo en tu teléfono.</p></div>`;
    wireNav();
    $$("[data-model]").forEach((b) => (b.onclick = () => { ST.settings.model = b.getAttribute("data-model"); save(); if (Eng.w) { Eng.w.terminate(); Eng.w = null; } Eng.status = "idle"; Eng.ready = null; render(); Eng.cached().then((c) => { if (c) Eng.start(); }); }));
    $$("[data-accent]").forEach((b) => (b.onclick = () => { ST.settings.accent = b.getAttribute("data-accent"); save(); render(); }));
    $$("[data-rate]").forEach((b) => (b.onclick = () => { ST.settings.rate = +b.getAttribute("data-rate"); save(); render(); }));
    const rb = $("[data-act=reset]");
    rb.onclick = () => {
      if (rb.dataset.armed) { const keep = ST.settings; ST = JSON.parse(JSON.stringify(DEF)); ST.settings = keep; save(); toast("Progreso borrado."); render(); return; }
      rb.dataset.armed = "1"; rb.textContent = "Tocá de nuevo para confirmar"; rb.classList.add("primary");
      setTimeout(() => { if (rb.isConnected) { delete rb.dataset.armed; rb.textContent = "Borrar todo"; rb.classList.remove("primary"); } }, 4000);
    };
  }

  /* ---------- arranque ---------- */
  TTS.init();
  render();
  Eng.cached().then((c) => { if (c) Eng.start(); });
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  document.addEventListener("visibilitychange", () => { if (document.hidden && Mic.state === "rec") Mic.stop(); });
  window.__voz = { Eng, Mic, ST: () => ST, go };
})();
