# Voz · Ruta de inglés

Laboratorio de pronunciación en inglés para hispanohablantes. Funciona en el navegador del teléfono y se puede instalar como app.

- **Pares**: decís una palabra y el reconocedor decide si sonó a esa o a su pareja (ship · sheep, very · berry, yes · jet).
- **Frases**: cada palabra sale en verde, ámbar o rojo, y marca cuando una palabra sonó como otra.
- **Repetí**: escuchás una frase y la repetís con la misma música.
- **Hablá**: respondés una pregunta durante hasta 30 segundos y ves qué se entendió.

La voz se analiza en el dispositivo. No se envía audio a ningún servidor.

## Créditos

- Reconocimiento: Whisper (OpenAI, licencia MIT), versión ONNX cuantizada de Xenova.
- Ejecución: Transformers.js (Hugging Face, Apache 2.0) y ONNX Runtime Web (Microsoft, MIT).
- Diccionario fonético: CMU Pronouncing Dictionary.
- Tipografías: Bricolage Grotesque y Atkinson Hyperlegible (SIL Open Font License).
