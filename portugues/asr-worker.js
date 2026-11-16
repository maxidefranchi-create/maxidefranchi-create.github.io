/* Fala Português · motor de voz en el teléfono.
   Usa el Whisper multilingüe que ya sirve la raíz del sitio (../models, ../vendor) y lo fuerza a portugués.
   Dos análisis: frase (claridad por palabra y qué se entendió) y habla libre con confianza por palabra. */
let T = null, E = null, loaded = null;
const root = new URL("../", self.location.href).href;
const SR = 16000;
const PREFIX = ["<|startoftranscript|>", "<|pt|>", "<|transcribe|>", "<|notimestamps|>"];

/* GitHub Pages manda los modelos comprimidos; con el tamaño real la descarga va derecho y la barra es exacta. */
function sizedFetch(env, sizes) {
  if (!env || !sizes || env.__sized) return;
  const keys = Object.keys(sizes);
  env.fetch = async (input, init) => {
    const r = await self.fetch(input, init);
    try {
      const u = typeof input === "string" ? input : (input && input.url) || String(input);
      const path = new URL(u, self.location.href).pathname;
      const k = keys.find((x) => path.endsWith("/" + x));
      if (!k || !r.ok || !r.body) return r;
      const h = new Headers(r.headers);
      h.set("content-length", String(sizes[k]));
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
    } catch (e) { return r; }
  };
  env.__sized = true;
}
const lse = (arr) => { let m = -Infinity; for (const x of arr) if (x > m) m = x; if (m === -Infinity) return m; let s = 0; for (const x of arr) s += Math.exp(x - m); return m + Math.log(s); };
function rowLS(lg, V, row) { const o = row * V; let m = -Infinity; for (let v = 0; v < V; v++) { const x = lg[o + v]; if (x > m) m = x; } let s = 0; for (let v = 0; v < V; v++) s += Math.exp(lg[o + v] - m); return { m, ls: Math.log(s), o }; }
const lpAt = (lg, V, row, id) => { const r = rowLS(lg, V, row); return lg[r.o + id] - r.m - r.ls; };
const fold = (w) => String(w).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "");
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
function lev(a, b) { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, i) => i); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }

/* ---------- audio ---------- */
function speechStats(a) {
  const fr = 320, n = Math.floor(a.length / fr), rms = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; const o = i * fr; for (let j = 0; j < fr; j++) { const x = a[o + j]; s += x * x; } rms[i] = Math.sqrt(s / fr); }
  if (!n) return { silent: true };
  const sorted = Array.from(rms).sort((x, y) => x - y);
  const floor = sorted[Math.floor(n * 0.1)] || 0, peak = sorted[Math.floor(n * 0.98)] || 0;
  const th = Math.max(floor * 2.5, peak * 0.12, 0.006);
  const sp = Array.from(rms, (v) => v > th), first = sp.indexOf(true), last = sp.lastIndexOf(true);
  if (first < 0 || peak < 0.01) return { silent: true };
  let pauses = 0, pauseT = 0, run = 0;
  for (let i = first; i <= last; i++) { if (!sp[i]) run++; else { const d = run * 0.02; if (d >= 0.36) { pauses++; pauseT += d; } run = 0; } }
  return { silent: false, start: first * fr, end: (last + 1) * fr, speech: (last - first + 1) * 0.02, pauses, pauseT: +pauseT.toFixed(2) };
}
function prep(audio) {
  const st = speechStats(audio);
  if (st.silent) return { st, a: audio };
  const pad = Math.round(0.25 * SR);
  let a = audio.subarray(Math.max(0, st.start - pad), Math.min(audio.length, st.end + pad));
  let m = 0; for (let i = 0; i < a.length; i++) { const x = Math.abs(a[i]); if (x > m) m = x; }
  if (m >= 1e-4 && m <= 0.5) { const g = Math.min(0.5 / m, 20), o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] * g; a = o; }
  if (a.length > SR * 30) a = a.subarray(0, SR * 30);
  return { st, a };
}

async function create(modelId, onProgress) {
  const { AutoProcessor, AutoTokenizer, WhisperForConditionalGeneration, Tensor } = T;
  const files = {};
  const progress_callback = (p) => {
    if (p && p.file && typeof p.loaded === "number" && p.total) files[p.file] = [p.loaded, p.total];
    let l = 0, t = 0; for (const k in files) { l += files[k][0]; t += files[k][1]; }
    if (t) onProgress(Math.min(99, Math.round((l / t) * 100)));
  };
  const proc = await AutoProcessor.from_pretrained(modelId, { progress_callback });
  const tok = await AutoTokenizer.from_pretrained(modelId, { progress_callback });
  const model = await WhisperForConditionalGeneration.from_pretrained(modelId, { dtype: "q8", progress_callback });
  const enc1 = (t) => tok.encode(t, { add_special_tokens: false });
  const tid = (t) => { const a = enc1(t); if (a.length !== 1) throw new Error("token " + t); return a[0]; };
  const pre = PREFIX.map(tid), eot = tid("<|endoftext|>");
  const suppress = new Set((model.generation_config || {}).suppress_tokens || []);
  const idsT = (ids) => new Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);

  async function encode(audio) {
    const { input_features } = await proc(audio);
    const r = await model._prepare_encoder_decoder_kwargs_for_generation({ inputs_tensor: input_features, model_inputs: { input_features }, model_input_name: "input_features", generation_config: { guidance_scale: null } });
    return { f: input_features, e: r.encoder_outputs };
  }
  async function logits(enc, ids) { const out = await model({ encoder_outputs: enc.e, decoder_input_ids: idsT(ids) }); return { lg: out.logits.data, V: out.logits.dims[2] }; }
  async function scorePlain(enc, body, withEot) {
    const ids = pre.concat(body, withEot === false ? [] : [eot]);
    const { lg, V } = await logits(enc, ids), lps = [];
    for (let i = pre.length - 1; i < ids.length - 1; i++) lps.push(lpAt(lg, V, i, ids[i + 1]));
    return lps;
  }
  /* La atención sobre el audio se calcula una vez por grabación; cada texto a evaluar es una pasada corta. */
  let useCache = typeof model.getPastKeyValues === "function";
  async function prefixState(enc) {
    if (enc.pre) return enc.pre;
    const out = await model({ encoder_outputs: enc.e, decoder_input_ids: idsT(pre) });
    const V = out.logits.dims[2], L = out.logits.dims[1];
    enc.pre = { last: out.logits.data.slice((L - 1) * V, L * V), V, past: model.getPastKeyValues(out, null) };
    return enc.pre;
  }
  async function scoreCached(enc, body, withEot) {
    const ids = body.concat(withEot === false ? [] : [eot]);
    if (!ids.length) return [];
    const P = await prefixState(enc), lps = [lpAt(P.last, P.V, 0, ids[0])];
    if (ids.length > 1) {
      const out = await model({ encoder_outputs: enc.e, decoder_input_ids: idsT(ids.slice(0, -1)), past_key_values: P.past });
      const lg = out.logits.data, V = out.logits.dims[2];
      for (let i = 0; i < ids.length - 1; i++) lps.push(lpAt(lg, V, i, ids[i + 1]));
    }
    return lps;
  }
  async function scoreBody(enc, body, withEot) {
    if (useCache) { try { return await scoreCached(enc, body, withEot); } catch (e) { useCache = false; } }
    return scorePlain(enc, body, withEot);
  }
  /* Agrupa tokens en palabras. La puntuación no cuenta para la claridad de la palabra. */
  function groupWords(body, lps) {
    const W = [];
    body.forEach((t, k) => {
      const s = tok.decode([t]);
      if (/^\s*[.,!?;:"'»«)\]…-]+$/.test(s)) return;
      if (!W.length || /^\s/.test(s)) W.push({ w: s.trim(), l: [lps[k]] });
      else { W[W.length - 1].w += s; W[W.length - 1].l.push(lps[k]); }
    });
    return W.map((x) => ({ w: x.w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "") || x.w, s: Math.round(100 * Math.exp(x.l.reduce((a, b) => a + b, 0) / x.l.length)) }));
  }
  async function scoreText(enc, text) {
    const body = enc1(" " + text.trim().replace(/\s+/g, " "));
    const lps = await scoreBody(enc, body, true);
    return { total: lps.reduce((a, b) => a + b, 0), words: groupWords(body, lps.slice(0, body.length)) };
  }
  function pickNext(lg, V, row, step) {
    const o = row * V; let best = -1, bv = -Infinity;
    for (let v = 0; v < V; v++) { if (v > eot || suppress.has(v)) continue; if (step === 0 && (v === eot || v === 220)) continue; const x = lg[o + v]; if (x > bv) { bv = x; best = v; } }
    return best;
  }
  const looping = (out) => { const n = out.length; if (n < 9) return false; const a = out.slice(n - 3).join(","), b = out.slice(n - 6, n - 3).join(","), c = out.slice(n - 9, n - 6).join(","); return a === b && b === c; };
  async function transcribeIds(enc, maxTokens) {
    if (useCache) {
      try {
        const P = await prefixState(enc); let past = P.past, lg = P.last, V = P.V; const out = [];
        for (let step = 0; step < maxTokens; step++) {
          const best = pickNext(lg, V, 0, step);
          if (best === eot || best < 0) break;
          out.push(best);
          if (looping(out)) { out.length -= 6; break; }
          const o = await model({ encoder_outputs: enc.e, decoder_input_ids: idsT([best]), past_key_values: past });
          past = model.getPastKeyValues(o, past); lg = o.logits.data; V = o.logits.dims[2];
        }
        return out;
      } catch (e) { useCache = false; }
    }
    const g = await model.generate({ input_features: enc.f, encoder_outputs: enc.e, language: "pt", task: "transcribe", max_new_tokens: maxTokens });
    const all = Array.from(g.tolist ? g.tolist()[0] : g[0], Number), out = [];
    let k = 0; while (k < all.length && all[k] >= eot) k++;
    for (let i = k; i < all.length; i++) { if (all[i] >= eot) break; out.push(all[i]); }
    return out;
  }
  async function transcribe(enc, maxTokens) {
    const out = await transcribeIds(enc, maxTokens || 60);
    let text = tok.decode(out, { skip_special_tokens: true }).trim();
    if (/amara\.org|legendas pela comunidade|inscreva-se/i.test(text)) return { text: "", words: [] };   // frases que Whisper inventa sobre silencio
    if (!out.length) return { text, words: [] };
    const lps = await scoreBody(enc, out, false);
    return { text, words: groupWords(out, lps) };
  }

  /* Frase: claridad de cada palabra del texto pedido y qué se entendió en su lugar. */
  async function sentence(audio, target) {
    const { st, a } = prep(audio);
    if (st.silent) return { silent: true };
    const enc = await encode(a);
    const clean = target.trim().replace(/\s+/g, " ");
    const asWritten = cap(clean) + (/[.!?…]$/.test(clean) ? "" : ".");
    const base = await scoreText(enc, asWritten);
    const heard = await transcribe(enc, Math.min(96, 16 + clean.length));
    const tw = base.words.map((x) => fold(x.w)), hraw = heard.text.split(/\s+/).filter(Boolean), hw = hraw.map(fold);
    const n = tw.length, m = hw.length, same = (x, y) => x === y || (x.length > 3 && y.length > 3 && lev(x, y) <= 1);
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = same(tw[i], hw[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const match = new Array(n).fill(null);
    { let i = 0, j = 0; while (i < n && j < m) { if (same(tw[i], hw[j])) { match[i] = j; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; } }
    const words = base.words.map((x, i) => {
      let instead = null;
      if (match[i] === null) { const pj = match.slice(0, i).reverse().find((v) => v !== null), nj = match.slice(i + 1).find((v) => v !== null); instead = hraw.slice(pj == null ? 0 : pj + 1, nj == null ? m : nj).join(" ").replace(/[.,!?;:]+$/, "") || null; if (instead && lev(fold(instead), tw[i]) > Math.max(2, Math.ceil(tw[i].length * 0.5))) instead = null; }
      const ok = match[i] !== null;
      /* verde: se entendió con claridad; ámbar: dudosa; rojo: no se entendió */
      const tier = ok ? (x.s >= 30 ? "ok" : "mid") : (x.s >= 50 ? "ok" : x.s >= 20 ? "mid" : "bad");
      return { w: x.w, s: x.s, ok, tier, pts: ok ? Math.max(x.s, 62) : x.s, instead };
    });
    /* El arranque de la grabación suele comerse la primera sílaba: no castiga la primera palabra si el resto salió bien. */
    if (words.length > 2 && words[0].tier !== "ok") { const rest = words.slice(1).reduce((s, w) => s + w.pts, 0) / (words.length - 1); if (rest >= 60) { words[0].pts = Math.max(words[0].pts, 60); words[0].tier = "mid"; words[0].soft = true; } }
    const overall = Math.round(words.reduce((s, w) => s + w.pts, 0) / Math.max(1, words.length));
    return { silent: false, heard: heard.text, overall, words, seconds: +(a.length / SR).toFixed(1), speech: +st.speech.toFixed(2), pauses: st.pauses, pauseT: st.pauseT };
  }

  /* Habla libre: transcripción con confianza por palabra. */
  async function free(audio) {
    const { st, a } = prep(audio);
    if (st.silent) return { silent: true };
    const t = await transcribe(await encode(a), 160);
    return { silent: false, text: t.text, words: t.words, seconds: +(a.length / SR).toFixed(1), speech: +st.speech.toFixed(2), pauses: st.pauses };
  }
  async function warm() { const e = await encode(new Float32Array(SR)); try { await scoreBody(e, enc1(" Olá."), true); } catch (x) {} }
  return { sentence, free, warm };
}

async function load(model) {
  if (E && loaded === model) return;
  if (!T) {
    T = await import(root + "vendor/transformers.min.js");
    try { await import(root + "sizes.js"); } catch (e) {}
    const env = T.env;
    env.allowRemoteModels = false; env.allowLocalModels = true; env.localModelPath = "../models/";
    env.useBrowserCache = typeof caches !== "undefined";
    const o = env.backends.onnx; o.wasm.numThreads = 1; o.wasm.proxy = false;
    o.wasm.wasmPaths = { mjs: root + "vendor/ort-wasm-simd-threaded.asyncify.mjs", wasm: root + "vendor/ort-wasm-simd-threaded.asyncify.wasm" };
    if (self.VOZ_SIZES) sizedFetch(env, self.VOZ_SIZES);
  }
  E = await create(model, (pct) => self.postMessage({ type: "progress", pct }));
  await E.warm();
  loaded = model;
}
let chain = Promise.resolve();
self.onmessage = (ev) => { chain = chain.then(() => handle(ev.data || {})).catch(() => {}); };
async function handle(m) {
  try {
    if (m.type === "load") { await load(m.model); self.postMessage({ type: "ready", model: m.model }); return; }
    if (!E) throw new Error("El reconocedor todavía no está cargado.");
    let result;
    if (m.type === "sentence") result = await E.sentence(m.audio, m.target);
    else if (m.type === "free") result = await E.free(m.audio);
    else throw new Error("Pedido desconocido.");
    self.postMessage({ type: "result", id: m.id, result });
  } catch (e) {
    const message = String((e && e.message) || e);
    self.postMessage(m.type === "load" ? { type: "fail", message } : { type: "error", id: m.id, message });
  }
}
