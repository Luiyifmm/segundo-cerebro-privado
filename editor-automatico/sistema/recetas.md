# Recetas técnicas

Estado: **[probado]** = ejecutado en este Mac con resultado comprobado; **[documentado]** = viene de Luis y aún no se ha probado aquí.

## Medir y preparar
- **[probado]** Ficha del bruto: `uv run --with numpy python sistema/ingesta.py BRUTO ingesta.json`.
  - VIDEO2: HEVC 2816×1584 con rotación −90, que ffmpeg ya gira al decodificar. 30 fps, SDR, voz en los dos canales, −26 LUFS.
- **[probado]** ffprobe no está en `~/.local/bin`. Se usa el de Remotion:
  `DYLD_LIBRARY_PATH=<dir> <motor>/node_modules/@remotion/compositor-darwin-arm64/ffprobe` (`ingesta.py` ya lo hace).
- **[documentado]** Voz en un solo canal: `-af "pan=stereo|c0=c1|c1=c1"` (o `c0=c0|c1=c0`).
- **[documentado]** HDR (HLG) de iPhone a SDR:
  `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.

## Montaje
- **[probado]** `montar.py BRUTO TRANSCRIPCION carpeta "3,4,5,7,11" 0.18 0.08` con `BITRATE=24M`.
  - VIDEO2: 24,5 s y 6 tramos.
  - `validar_cortes.py` dio 88/88 palabras, cortes limpios.
- **[probado]** `tramos` en `palabras.json`: `{montaje, bruto_ini, bruto_fin, seg}`. Para pasar de montaje a bruto: `bruto_ini + (t − montaje)` del tramo correspondiente.
- **[documentado]** Luis pone 0,08 s de aire antes y 0,15 s después, y corta en el mínimo de energía entre palabras. Nuestro `montar.py` usa un umbral de energía con un margen simétrico. Con VIDEO2 no hizo falta más; si un corte come el final de una palabra, subir el margen a 0,12.

## Voz
- **[probado]** `voz.py`: highpass 80 → lowpass 14k → afftdn −25 (solo si el ruido supera −60 dB) → compresor 2:1 → de-esser → loudnorm a dos pasadas (−14 LUFS / −1,5 dBTP).
  - VIDEO2: de −26,8 a −14,2 LUFS.
  - Relación voz/ruido de 32,4 a 38,7 dB: mejora, así que se usa la cadena completa.
  - **No escuchado**: medido.

## Subtítulos
- **[probado]** `subtitulos.py PALABRAS ficha.json SALIDA bloques.txt` alinea los bloques escritos a mano. Si el número de palabras no cuadra, se para con error.
- **[probado]** Regla de 0,7 s para la clave: DESPUÉS pasó de 0,34 s a 0,7 s en pantalla.
- **[probado]** SRT para CapCut: generado desde `subtitulos.json` (ver la entrega de la muestra).

## Render (Remotion, motor 4.0.535)
- **[probado]** Vídeo completo:
  `cd motor && npx remotion render src/index.ts Muestra OUT.mp4 --props=montaje.json --public-dir=CARPETA/public --concurrency=4`.
- **[probado]** Capa con alfa (subtítulos o gráficos): el mismo JSON con `"capa": "subs"` o `"capa": "graficos"`, y
  `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`. Sale yuva444p12le, 1080×1920.
- **[probado]** Fotograma suelto: `npx remotion still src/index.ts Muestra f.jpg --frame=N --props=… --public-dir=… --image-format=jpeg` (N = segundos × 30).
- **[documentado]** Luis: el ProRes 4444 con alfa del ffmpeg 6 normal no lo lee Premiere; el de Remotion sí.

## Control
- **[probado]** `qc.py VIDEO`: VIDEO2 aprobado (1080×1920, 30 fps, −14,2 LUFS, pico −1,5, sin negros ni congelados).
- **[probado]** Hoja de fotogramas: `ffmpeg -i V -vf "fps=2,scale=180:320,tile=10x5" -frames:v 1 hoja.jpg`.
- **[probado]** Volver a transcribir el final con `validar_cortes.py`: confirmó que se oye «mira **a** los ojos».
