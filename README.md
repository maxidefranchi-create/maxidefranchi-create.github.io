# Voz · Ruta de inglés

Laboratorio de pronunciación en inglés para hispanohablantes. Funciona en el navegador del teléfono y se puede instalar como app.

- **Pares**: decís una palabra y el reconocedor decide si sonó a esa o a su pareja (ship · sheep, very · berry, yes · jet).
- **Frases**: cada palabra sale en verde, ámbar o rojo, y marca cuando una palabra sonó como otra.
- **Repetí**: escuchás una frase y la repetís con la misma música.
- **Sonidos**: cómo poner la boca para cada sonido, con dibujo animado de la boca vista de costado y de frente.
- **Charlá**: conversaciones con personajes (cafetería, hotel, migraciones, reuniones) que te contestan según lo que decís y te marcan errores. Opcional: charla libre con Claude usando tu propia clave de la API.

La voz se analiza en el dispositivo. No se envía audio a ningún servidor.

## Novedades

- **Diagnóstico de cada charla**: comprensión, fluidez, gramática, pronunciación y respuestas completas, comparado con la charla anterior, con un objetivo concreto para la próxima y tus respuestas mejoradas para practicar.
- **66 situaciones** en seis grupos: escucha activa (texto oculto, datos para captar, expresiones explicadas y mini clase al final), trabajo, viajes, ciudad y servicios, vida social e imprevistos. Los personajes cambian cómo preguntan entre una pasada y otra.
- **Entrená el oído**: escuchás una palabra y elegís cuál fue, para distinguir sonidos como ship y sheep antes de producirlos.
- **Trucos para cada sonido** y práctica en orden: oído, pares, palabras sueltas y frases.
- **Palabras difíciles**: 287 palabras que más se pronuncian mal, en ocho grupos, con cómo suenan y evaluación con el micrófono.

## Créditos

- Reconocimiento: Whisper (OpenAI, licencia MIT), versión ONNX cuantizada de Xenova.
- Ejecución: Transformers.js (Hugging Face, Apache 2.0) y ONNX Runtime Web (Microsoft, MIT).
- Diccionario fonético: CMU Pronouncing Dictionary.
- Tipografías: Bricolage Grotesque y Atkinson Hyperlegible (SIL Open Font License).
