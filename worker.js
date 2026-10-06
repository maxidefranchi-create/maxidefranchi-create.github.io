/* Worker del reconocedor: carga Whisper y analiza audio sin trabar la interfaz. */
let T = null, eng = null, loading = null, loadedModel = null;
const base = new URL("./", self.location.href).href;

async function boot() {
  if (T) return;
  T = await import(base + "vendor/transformers.min.js");
  await import(base + "engine.js");
  await import(base + "conf.js");
  await import(base + "priors.js");
  const env = T.env;
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = "models/";
  env.useBrowserCache = typeof caches !== "undefined";
  const o = env.backends.onnx;
  o.wasm.numThreads = 1;
  o.wasm.proxy = false;
  o.wasm.wasmPaths = {
    mjs: base + "vendor/ort-wasm-simd-threaded.asyncify.mjs",
    wasm: base + "vendor/ort-wasm-simd-threaded.asyncify.wasm"
  };
}

async function load(model) {
  if (eng && loadedModel === model) return;
  if (loading) return loading;
  loading = (async () => {
    await boot();
    eng = await self.VozEngine.create({
      T, modelId: model, dtype: "q8", priors: self.VOZ_PRIORS,
      onProgress: (p) => self.postMessage({ type: "progress", loaded: p.loaded, total: p.total })
    });
    await eng.warm();
    loadedModel = model;
  })();
  try { await loading; } finally { loading = null; }
}

let chain = Promise.resolve();
self.onmessage = (ev) => { chain = chain.then(() => handle(ev)).catch(() => {}); };
async function handle(ev) {
  const m = ev.data || {};
  try {
    if (m.type === "load") {
      await load(m.model);
      self.postMessage({ type: "ready", model: m.model });
      return;
    }
    if (!eng) throw new Error("El reconocedor todavía no está cargado.");
    const conf = (self.VOZ_CONF && self.VOZ_CONF.words) || {};
    let result = null;
    if (m.type === "pair") result = await eng.pair(m.audio, m.target, m.others, m.lam);
    else if (m.type === "sentence") result = await eng.sentence(m.audio, m.target, conf, { flagThreshold: m.flagThreshold, strongThreshold: m.strongThreshold, lam: m.lam, skipHeard: true });
    else if (m.type === "heard") result = await eng.heardLast();
    else if (m.type === "free") result = await eng.free(m.audio);
    self.postMessage({ type: "result", id: m.id, result });
  } catch (e) {
    self.postMessage({ type: "error", id: m.id, message: String((e && e.message) || e) });
  }
}
