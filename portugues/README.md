# Fala Português

App para aprender portugués de Brasil desde cero, instalable en el teléfono. Vive en `/portugues/`, separada de Voz.

- `index.html`: toda la app (estilos, contenido y lógica en un solo archivo).
- `asr-worker.js`: motor de voz. Transcribe y puntúa la claridad de cada palabra en el teléfono.
- `sw.js` y `manifest.webmanifest`: instalación y uso sin internet.

Usa archivos de la raíz del sitio, que comparte con Voz: `../models/` (Whisper multilingüe), `../vendor/` (transformers y onnxruntime), `../sizes.js`, `../mouth.js` (dibujo de la boca) y `../fonts/`. Si esos archivos se mueven o cambian de nombre, hay que actualizar las rutas acá.

El tutor usa la misma clave de la API que Voz (`voz-ai-key` en el almacenamiento del navegador).
