---
name: subtitulos
description: Transcribe un vídeo en local y genera subtítulos con tiempos por palabra. Usar cuando el usuario pida subtítulos, captions, transcripción, SRT, o subtítulos animados palabra a palabra.
---

# Subtítulos y transcripción

1. `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; cd ~/Videos-Remotion/voz`
2. `~/Videos-Remotion/voz/transcribir.sh "<video>" [--inicio s] [--duracion s]` (WhisperX + verificador; usar solo palabras `fiable`). Respaldo: `transcribir.sh --respaldo "<video>" [--idioma spanish] [--palabras 3]` (Whisper small, tiempos ±130 ms).
3. Salida en `salida/`: `<nombre>.srt` (líneas de 1 a 3 palabras), `<nombre>.palabras.json` (cada palabra con inicio y fin) y `<nombre>.txt`.

- Whisper small en local: unos 3 s por cada 20 s de audio. Revisar el `.txt` y corregir nombres propios y palabras mal oídas antes de entregar; avisar al usuario de lo corregido.
- Transcribir el vídeo ya cortado, no el bruto, para que los tiempos coincidan con el montaje.
- Entrega simple: el `.srt` se importa en Premiere (Archivo > Importar) y se estiliza en la pista de subtítulos.
- Entrega animada: componer en Remotion leyendo `palabras.json` (palabra activa resaltada, entrada con spring) y renderizar con alfa (`npm run render`) para ponerlo encima en Premiere.
- Estilo Amin Business: SF Pro Bold, blanco, pequeño, 1 a 3 palabras, centrado sobre el pecho.

## Subtítulos MOGRT sobre un corte de Premiere (flujo técnico, sacado de la skill archivada `subtitulos-reels`)
1. Releer la secuencia activa: `premiere/pr.sh premiere/recetas/leer-v1.jsx` → piezas de V1.
2. Bloques desde el corte ACTUAL: `python3 premiere/recetas/subs-desde-linea.py piezas.txt <ficha.json> <prefijo palabras> subs.json [extra.json]` (la ficha da `claves` y `arreglos`). Si un tramo sale sin palabras, re-transcribir solo ese trozo; copiar antes el `.palabras.json`, porque `transcribir.js` lo sobrescribe.
3. Colocar en una pista de vídeo VACÍA y en orden: `colocar-subs-mogrt.py` → `tanda0.jsx`, `tanda1.jsx`… (o la receta `mogrt-textos.jsx`). Contar los colocados frente a los esperados y mirar fotogramas.
4. Quitar solo subtítulos míos, filtrando por nombre de plantilla; nunca tocar animaciones del usuario.
5. Ver qué corrigió el usuario: `premiere/recetas/leer-subs-mogrt.jsx` y aplicar el patrón al resto.
Reglas de bloque: `0 CLAUDE EDITOR/4 ENTRENAMIENTO/Lecciones generales de edición.md` § Subtítulos. Estética: la del cliente activo (su ficha).
