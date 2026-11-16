const C="fala-v2";
const SHELL=["./","asr-worker.js","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
/* Al actualizar, borra la versión anterior y recarga la app abierta para que no quede la vieja en pantalla. */
self.addEventListener("activate",e=>e.waitUntil((async()=>{const old=(await caches.keys()).filter(k=>k.startsWith("fala-")&&k!==C);await Promise.all(old.map(k=>caches.delete(k)));await self.clients.claim();
  if(old.length){const cs=await self.clients.matchAll({type:"window"});cs.forEach(c=>{try{c.navigate(c.url)}catch(err){}})}})()));
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  if(!u.pathname.includes("/portugues/"))return; /* modelos y librerías de la raíz: los guarda el reconocedor */
  if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(ca=>ca.put("./",c))}return r}).catch(()=>caches.match("./")));return}
  e.respondWith(caches.match(e.request).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(ca=>ca.put(e.request,c))}return r}).catch(()=>hit);return hit||net}))});
