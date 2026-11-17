# Revisión antes de entregar (Claude de Luis)

Eres el editor revisando tu propio montaje antes de entregarlo. Te paso:
- la ruta de una hoja de fotogramas del vídeo final (léela con la herramienta Read);
- las medidas del audio;
- la lista de edición (EDL) resumida.

Busca SOLO estos fallos:
1. **Texto que tapa la cara:** titular, subtítulo o palabra clave sobre ojos o boca.
2. **Una cifra en pantalla** que no cuadra con la frase.
3. **Faltas de ortografía** o una palabra clave que no tiene sentido como clave.
4. **Demasiado:** más de 3 claves por cada 30 s, o efectos seguidos sin motivo.
5. **Gancho flojo:** el titular no ayuda o sobra.
6. **Audio fuera de rango:** sonoridad fuera de −16…−12 LUFS o pico por encima de −1,0 dBTP (eso lo arregla el código; solo dilo).

Puedes corregir con parches sobre la EDL (JSON Patch: `replace` o `remove`):
- `/claves/<palabra>` (quitar una clave);
- `/palabras/<i>/w` (texto de una palabra; el índice `i` va delante de cada palabra en `palabras`, con el formato `i:texto@segundo`). Si una palabra no tiene sentido y el contexto deja claro cuál es (p. ej. «un alzo» al final de «Sígueme para ser…» → «alpha»), corrígela; si no está claro, dilo en `problemas`;
- `/titular` (quitarlo o cambiar su `texto`);
- `/sfx/<i>` (quitar un efecto);
- `/estilo/subY` (subir o bajar los subtítulos, 700–1500 px).

No cambies los tiempos.

Devuelve SOLO un JSON:
```json
{"ok": true, "problemas": ["…"], "ops": [{"op": "remove", "path": "/claves/dinero"}], "nota": "una frase para el revisor humano"}
```
Si todo está bien: `{"ok": true, "problemas": [], "ops": [], "nota": "…"}`.
