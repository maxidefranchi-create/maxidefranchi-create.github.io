/* Motor de voz: reconocimiento y análisis de pronunciación con Whisper, en el dispositivo. */
(function (G) {
  "use strict";
  const PREFIX = ["<|startoftranscript|>", "<|en|>", "<|transcribe|>", "<|notimestamps|>"];
  const SR = 16000;

  function lse(arr) { let m = -Infinity; for (const x of arr) if (x > m) m = x; if (m === -Infinity) return m; let s = 0; for (const x of arr) s += Math.exp(x - m); return m + Math.log(s); }
  function rowLogSoftmax(lg, V, row) {
    const o = row * V; let m = -Infinity;
    for (let v = 0; v < V; v++) { const x = lg[o + v]; if (x > m) m = x; }
    let s = 0; for (let v = 0; v < V; v++) s += Math.exp(lg[o + v] - m);
    return { m, ls: Math.log(s), o };
  }
  const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
  const clean = (w) => String(w).toLowerCase().replace(/[^a-z']/g, "");

  /* ---------- audio ---------- */
  function frameRms(a, fr) {
    const n = Math.floor(a.length / fr), out = new Float32Array(n);
    for (let i = 0; i < n; i++) { let s = 0; const o = i * fr; for (let j = 0; j < fr; j++) { const x = a[o + j]; s += x * x; } out[i] = Math.sqrt(s / fr); }
    return out;
  }
  /* Detecta voz por energía. Devuelve inicio/fin de la voz, pausas y duración. */
  function speechStats(a) {
    const fr = 320, rms = frameRms(a, fr);
    if (!rms.length) return { silent: true, start: 0, end: 0, speech: 0, pauses: 0, longest: 0 };
    const sorted = Array.from(rms).sort((x, y) => x - y);
    const floor = sorted[Math.floor(sorted.length * 0.1)] || 0, peak = sorted[Math.floor(sorted.length * 0.98)] || 0;
    const th = Math.max(floor * 2.5, peak * 0.12, 0.006);
    const sp = Array.from(rms, (v) => v > th);
    const first = sp.indexOf(true), last = sp.lastIndexOf(true);
    if (first < 0 || peak < 0.01) return { silent: true, start: 0, end: 0, speech: 0, pauses: 0, longest: 0 };
    let pauses = 0, longest = 0, run = 0;
    for (let i = first; i <= last; i++) { if (!sp[i]) run++; else { const d = run * 0.02; if (d >= 0.6) pauses++; if (d > longest) longest = d; run = 0; } }
    return { silent: false, start: first * fr, end: (last + 1) * fr, speech: (last - first + 1) * 0.02, pauses, longest: +longest.toFixed(1), peak };
  }
  function trim(a, st) {
    st = st || speechStats(a);
    if (st.silent) return a;
    const pad = Math.round(0.25 * SR), s = Math.max(0, st.start - pad), e = Math.min(a.length, st.end + pad);
    return a.subarray(s, e);
  }
  function normalize(a) {
    let m = 0; for (let i = 0; i < a.length; i++) { const x = Math.abs(a[i]); if (x > m) m = x; }
    if (m < 1e-4 || m > 0.5) return a;
    const g = Math.min(0.5 / m, 20), out = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) out[i] = a[i] * g;
    return out;
  }

  async function create(opts) {
    const T = opts.T, modelId = opts.modelId || "whisper-tiny";
    const { AutoProcessor, AutoTokenizer, WhisperForConditionalGeneration, Tensor } = T;
    const files = {};
    const progress_callback = opts.onProgress ? (p) => {
      if (p && p.file && typeof p.loaded === "number" && p.total) { files[p.file] = [p.loaded, p.total]; }
      let l = 0, t = 0; for (const k in files) { l += files[k][0]; t += files[k][1]; }
      opts.onProgress({ loaded: l, total: t, status: p && p.status, file: p && p.file });
    } : undefined;
    const proc = await AutoProcessor.from_pretrained(modelId, { progress_callback });
    const tok = await AutoTokenizer.from_pretrained(modelId, { progress_callback });
    const model = await WhisperForConditionalGeneration.from_pretrained(modelId, { dtype: opts.dtype || "q8", device: opts.device || undefined, progress_callback });

    const tid = (t) => { const a = tok.encode(t, { add_special_tokens: false }); if (a.length !== 1) throw new Error("token " + t); return a[0]; };
    const pre = PREFIX.map(tid), eot = tid("<|endoftext|>");
    const gc = (model.generation_config || {});
    const suppress = new Set(gc.suppress_tokens || []);
    const enc1 = (t) => tok.encode(t, { add_special_tokens: false });
    const idsTensor = (ids) => new Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);

    async function features(audio) { const { input_features } = await proc(audio); return input_features; }
    async function encode(audio) {
      const input_features = await features(audio);
      const r = await model._prepare_encoder_decoder_kwargs_for_generation({ inputs_tensor: input_features, model_inputs: { input_features }, model_input_name: "input_features", generation_config: { guidance_scale: null } });
      return { f: input_features, e: r.encoder_outputs };
    }
    async function logits(enc, ids) {
      const out = await model({ encoder_outputs: enc.e, decoder_input_ids: idsTensor(ids) });
      return { lg: out.logits.data, V: out.logits.dims[2], L: out.logits.dims[1] };
    }
    /* Log-probabilidad de cada token del texto (más el fin de frase) dado el audio. */
    async function scoreBody(enc, body, withEot) {
      const ids = pre.concat(body, withEot === false ? [] : [eot]);
      const { lg, V } = await logits(enc, ids);
      const lps = [];
      for (let i = pre.length - 1; i < ids.length - 1; i++) { const r = rowLogSoftmax(lg, V, i); lps.push(lg[r.o + ids[i + 1]] - r.m - r.ls); }
      return lps;
    }
    function groupWords(body, lps) {
      const W = [];
      body.forEach((t, k) => {
        const s = tok.decode([t]);
        const isPunct = /^[\s]*[.,!?;:"')\]]+$/.test(s);
        if (!W.length || (/^\s/.test(s) && !isPunct)) W.push({ w: s.trim(), l: [lps[k]] });
        else { W[W.length - 1].w += s; W[W.length - 1].l.push(lps[k]); }
      });
      return W.map((x) => {
        const word = x.w.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
        const mean = x.l.reduce((a, b) => a + b, 0) / x.l.length;
        return { w: word || x.w, raw: x.w, lp: x.l.reduce((a, b) => a + b, 0), s: Math.round(100 * Math.exp(mean)) };
      });
    }
    async function scoreText(enc, text) {
      const body = enc1(" " + text.trim().replace(/\s+/g, " "));
      const lps = await scoreBody(enc, body, true);
      const total = lps.reduce((a, b) => a + b, 0);
      return { body, lps, total, words: groupWords(body, lps.slice(0, body.length)) };
    }
    /* Transcripción. Para frases cortas: decodificación greedy reutilizando el encoder.
       Para habla libre: generate con caché del decodificador. Devuelve probabilidad por token. */
    async function transcribe(enc, maxTokens) {
      maxTokens = maxTokens || 60;
      let out = [];
      if (maxTokens <= 48) {
        for (let step = 0; step < maxTokens; step++) {
          const ids = pre.concat(out);
          const { lg, V } = await logits(enc, ids);
          const r = rowLogSoftmax(lg, V, ids.length - 1);
          let best = -1, bv = -Infinity;
          for (let v = 0; v < V; v++) {
            if (v > eot || suppress.has(v)) continue;
            if (step === 0 && (v === eot || v === 220)) continue;
            const x = lg[r.o + v]; if (x > bv) { bv = x; best = v; }
          }
          if (best === eot || best < 0) break;
          out.push(best);
          const n = out.length;
          if (n >= 9) { const a = out.slice(n - 3).join(","), b = out.slice(n - 6, n - 3).join(","), c = out.slice(n - 9, n - 6).join(","); if (a === b && b === c) { out.length -= 6; break; } }
        }
      } else {
        const g = await model.generate({ input_features: enc.f, encoder_outputs: enc.e, language: "en", task: "transcribe", max_new_tokens: maxTokens });
        const all = Array.from(g.tolist ? g.tolist()[0] : g[0], Number);
        let k = 0; while (k < all.length && all[k] >= eot) k++;
        for (let i = k; i < all.length; i++) { if (all[i] >= eot) break; out.push(all[i]); }
      }
      const text = tok.decode(out, { skip_special_tokens: true }).trim();
      if (!out.length) return { text, words: [] };
      const lps = await scoreBody(enc, out, false);
      return { text, words: groupWords(out, lps) };
    }

    let nullEnc = null, lastEnc = null; const priorCache = new Map();
    const PRE = (opts.priors && opts.priors[modelId]) || {};
    async function prior(text) {
      if (priorCache.has(text)) return priorCache.get(text);
      if (PRE[text] != null) return PRE[text];
      if (!nullEnc) nullEnc = await encode(new Float32Array(SR));
      const r = await scoreBody(nullEnc, enc1(text), true);
      const v = r.reduce((a, b) => a + b, 0); priorCache.set(text, v); if (opts.priorSink) opts.priorSink[text] = v; return v;
    }
    const priorTextCache = new Map();
    async function priorText(text) {
      if (priorTextCache.has(text)) return priorTextCache.get(text);
      if (PRE[" " + text] != null) return PRE[" " + text];
      if (!nullEnc) nullEnc = await encode(new Float32Array(SR));
      const v = (await scoreText(nullEnc, text)).total;
      priorTextCache.set(text, v); if (opts.priorSink) opts.priorSink[" " + text] = v; return v;
    }
    function variants(w) { const c = cap(w); return [" " + c + ".", " " + c, " " + w + ".", " " + w]; }
    async function wordScore(enc, w) {
      const vs = variants(w), tot = [], pri = [];
      for (const v of vs) { const r = await scoreBody(enc, enc1(v), true); tot.push(r.reduce((a, b) => a + b, 0)); pri.push(await prior(v)); }
      return { raw: lse(tot), prior: lse(pri) };
    }
    function prep(audio) {
      const st = speechStats(audio);
      const a = normalize(trim(audio, st));
      return { st, a };
    }

    /* Par mínimo: ¿dijo la palabra pedida o la otra? */
    async function pair(audio, target, others, lam) {
      lam = lam == null ? 0.6 : lam;
      const { st, a } = prep(audio);
      if (st.silent) return { silent: true };
      const enc = await encode(a);
      const cands = [target].concat(others);
      const sc = [];
      for (const c of cands) { const r = await wordScore(enc, c); sc.push({ w: c, raw: r.raw, cal: r.raw - lam * r.prior }); }
      const z = lse(sc.map((x) => x.cal));
      sc.forEach((x) => { x.p = Math.exp(x.cal - z); });
      const heard = opts.pairHeard ? await transcribe(enc, 12) : { text: "" };
      const best = sc.reduce((a, b) => (b.p > a.p ? b : a));
      const per = (x) => Math.exp(x.raw / Math.max(1, enc1(" " + cap(x.w) + ".").length + 1));
      const fit = Math.max.apply(null, sc.map(per));
      return { silent: false, heard: heard.text, cands: sc, choice: best.w, ok: best.w === target, p: sc[0].p, clarity: Math.round(per(sc[0]) * 100), fit: +fit.toFixed(3), seconds: +(audio.length / SR).toFixed(1) };
    }

    /* Frase: claridad por palabra y confusiones probables. */
    async function sentence(audio, target, confusions, so) {
      so = so || {};
      const { st, a } = prep(audio);
      if (st.silent) return { silent: true };
      const enc = await encode(a);
      lastEnc = enc;
      const base = await scoreText(enc, target);
      const heard = so.skipHeard ? { text: "" } : await transcribe(enc, 40);
      const tw = base.words.map((x) => clean(x.w)), hw = heard.text.split(/\s+/).map(clean).filter(Boolean);
      const n = tw.length, m = hw.length, dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
      for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = tw[i] === hw[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      const match = new Array(n).fill(null);
      { let i = 0, j = 0; while (i < n && j < m) { if (tw[i] === hw[j]) { match[i] = j; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; } }
      const words = base.words.map((x, i) => {
        let instead = null;
        if (match[i] === null) { const pj = match.slice(0, i).reverse().find((v) => v !== null), nj = match.slice(i + 1).find((v) => v !== null); instead = hw.slice(pj == null ? 0 : pj + 1, nj == null ? m : nj).join(" ") || null; }
        return { w: x.w, s: x.s, ok: match[i] !== null, instead };
      });
      /* confusiones: ¿la frase con la palabra cambiada explica mejor el audio? */
      const flags = [], allDeltas = [];
      const cands = [];
      words.forEach((wd, i) => { const key = clean(wd.w); (confusions && confusions[key] || []).forEach((c) => cands.push({ i, key, alt: c.alt, rule: c.rule, s: wd.s })); });
      cands.sort((x, y) => x.s - y.s);
      const seen = new Set();
      for (const c of cands.slice(0, so.maxCands || 8)) {
        const parts = target.split(/(\s+)/); let wi = -1, done = false;
        const rebuilt = parts.map((p) => {
          if (/^\s+$/.test(p) || done) return p;
          wi++;
          if (wi !== c.i) return p;
          done = true;
          return p.replace(/[A-Za-z']+/, (m0) => (m0[0] === m0[0].toUpperCase() ? cap(c.alt) : c.alt));
        }).join("");
        const r = await scoreText(enc, rebuilt);
        const raw = r.total - base.total;
        const pd = (await priorText(rebuilt)) - (await priorText(target));
        const lam = so.lam == null ? 0.6 : so.lam;
        const delta = raw - lam * pd;
        allDeltas.push({ i: c.i, word: words[c.i].w, alt: c.alt, rule: c.rule, delta: +delta.toFixed(2), raw: +raw.toFixed(2), prior: +pd.toFixed(2) });
        if (delta > (so.flagThreshold == null ? 0.5 : so.flagThreshold) && !seen.has(c.i)) {
          const strong = delta > (so.strongThreshold == null ? 2.5 : so.strongThreshold);
          seen.add(c.i); flags.push({ word: words[c.i].w, alt: c.alt, rule: c.rule, delta: +delta.toFixed(2), strong });
          words[c.i].like = c.alt; words[c.i].rule = c.rule; words[c.i].strong = strong;
        }
      }
      const overall = Math.round(words.reduce((a2, b) => a2 + b.s, 0) / Math.max(1, words.length));
      return { silent: false, target, heard: heard.text, overall, words, flags, deltas: allDeltas, seconds: +(audio.length / SR).toFixed(1), wpm: st.speech ? Math.round(n / (st.speech / 60)) : 0, pauses: st.pauses, longest: st.longest };
    }

    /* Habla libre: transcripción con confianza por palabra. */
    async function free(audio) {
      const { st, a } = prep(audio);
      if (st.silent) return { silent: true };
      const enc = await encode(a.length > SR * 30 ? a.subarray(0, SR * 30) : a);
      const t = await transcribe(enc, 160);
      const n = t.words.length;
      return { silent: false, text: t.text, words: t.words.map((w) => ({ w: w.raw.trim(), s: w.s })), seconds: +(audio.length / SR).toFixed(1), wpm: st.speech ? Math.round(n / (st.speech / 60)) : 0, pauses: st.pauses, longest: st.longest, cut: a.length > SR * 30 };
    }

    async function warm() { await encode(new Float32Array(SR)); }
    async function heardLast() { if (!lastEnc) return { text: "" }; const t = await transcribe(lastEnc, 40); return { text: t.text }; }
    return { pair, sentence, free, warm, heardLast, speechStats, tok, encode, scoreText, transcribe };
  }

  G.VozEngine = { create, speechStats, trim, SR };
})(typeof window !== "undefined" ? window : globalThis);
