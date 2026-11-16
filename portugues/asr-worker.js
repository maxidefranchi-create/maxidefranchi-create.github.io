/* Reconocedor de voz en el teléfono: Whisper multilingüe, compartido con la app de la raíz. */
let T=null,asr=null;const root=new URL("../",self.location.href).href;
async function load(model){
  T=await import(root+"vendor/transformers.min.js");
  const env=T.env;env.allowRemoteModels=false;env.allowLocalModels=true;env.localModelPath="../models/";env.useBrowserCache=typeof caches!=="undefined";
  const o=env.backends.onnx;o.wasm.numThreads=1;o.wasm.proxy=false;
  o.wasm.wasmPaths={mjs:root+"vendor/ort-wasm-simd-threaded.asyncify.mjs",wasm:root+"vendor/ort-wasm-simd-threaded.asyncify.wasm"};
  const files={};
  const progress_callback=p=>{if(p&&p.file&&typeof p.loaded==="number"&&p.total){files[p.file]=[p.loaded,p.total];let l=0,t=0;for(const k in files){l+=files[k][0];t+=files[k][1]}self.postMessage({type:"progress",pct:Math.round(l/t*100)})}};
  const proc=await T.AutoProcessor.from_pretrained(model,{progress_callback});
  const tok=await T.AutoTokenizer.from_pretrained(model,{progress_callback});
  const mdl=await T.WhisperForConditionalGeneration.from_pretrained(model,{dtype:"q8",progress_callback});
  asr=async audio=>{const {input_features}=await proc(audio);const g=await mdl.generate({input_features,language:"pt",task:"transcribe",max_new_tokens:96});
    const seq=g.sequences||g;const ids=seq.tolist?seq.tolist()[0]:Array.from(seq[0]);return tok.decode(ids.map(Number),{skip_special_tokens:true}).trim()};
}
let chain=Promise.resolve();
self.onmessage=ev=>{chain=chain.then(()=>handle(ev.data||{}))};
async function handle(m){
  try{
    if(m.type==="load"){await load(m.model);self.postMessage({type:"ready"})}
    else if(m.type==="run"){const text=await asr(m.audio);self.postMessage({type:"result",id:m.id,text})}
  }catch(e){const message=String(e&&e.message||e);self.postMessage(m.type==="load"?{type:"fail",message}:{type:"error",id:m.id,message})}
}
