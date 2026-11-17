---
name: subtitulos
description: Transcribe un vídeo en local y genera subtítulos con tiempos por palabra. Usar cuando el usuario pida subtítulos, captions, transcripción, SRT, o subtítulos animados palabra a palabra.
---

# Subtítulos y transcripción

1. `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; cd ~/Videos-Remotion/voz`
2. `node transcribir.js "<video>" [--idioma spanish] [--palabras 3] [--inicio s] [--duracion s]`
3. Salida en `salida/`: `<nombre>.srt` (líneas de 1 a 3 palabras), `<nombre>.palabras.json` (cada palabra con inicio y fin) y `<nombre>.txt`.

- Whisper small en local: unos 3 s por cada 20 s de audio. Revisar el `.txt` y corregir nombres propios y palabras mal oídas antes de entregar; avisar al usuario de lo corregido.
- Transcribir el vídeo ya cortado, no el bruto, para que los tiempos coincidan con el montaje.
- Entrega simple: el `.srt` se importa en Premiere (Archivo > Importar) y se estiliza en la pista de subtítulos.
- Entrega animada: componer en Remotion leyendo `palabras.json` (palabra activa resaltada, entrada con spring) y renderizar con alfa (`npm run render`) para ponerlo encima en Premiere.
- Estilo ClienteA Business: SF Pro Bold, blanco, pequeño, 1 a 3 palabras, centrado sobre el pecho.
