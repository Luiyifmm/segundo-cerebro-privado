# Flujo de edición (del bruto a la entrega)

Todo en una carpeta de trabajo nueva dentro de `~/Desktop/2 · Contenido/Edición/05 Entregas/<nombre>/`. El bruto original no se toca.
Antes de empezar: mirar en `05 Entregas` y en la Sala que ese vídeo no esté ya hecho.
`H=~/.claude/herramientas/edicion`, `export PATH=~/.local/bin:$PATH`.

## 1. Ingesta
`uv run --with numpy python $H/sistema/ingesta.py BRUTO carpeta/ingesta.json`
- Si es HDR, se pasa a SDR antes de montar (receta en `recetas.md`).
- Si la voz va en un solo canal, se rellena el otro.
- Apuntar el ruido de fondo: es la referencia del paso 4.
- Si la rotación o los fps son raros, se resuelve antes de seguir.

## 2. Transcripción y elección de tomas
- `uv run --with mlx-whisper python $H/transcribir.py BRUTO carpeta/X.transcripcion.json` (whisper large-v3-turbo).
- **La transcripción es una ayuda, no la verdad**: Whisper se desvía hasta 0,5 s y a veces inventa o se salta palabras.
- **Tomas:** la última completa es la candidata preferente, no una obligación. Si está peor dicha, se elige otra y se dice por qué.
- **Fuera:** indicaciones («espérate», «vale», «el CTA lo pongo aquí»), arranques en falso y frases a medias.
- **No se quitan ideas ni se cambian cifras para tapar contradicciones.** Si la voz, el guion y el gráfico no cuadran, se resuelve con material auténtico (otra toma) o se le pregunta a Amin.

## 3. Montaje
- `uv run --with numpy python $H/montar.py BRUTO TRANSCRIPCION carpeta/corte "i,j,k" 0.18 0.08` (los índices son segmentos de la transcripción).
- El script ajusta cada corte a donde baja la voz de verdad.
- Escribe `palabras.json` con `tramos`: segundo del montaje ↔ segundos del bruto.
- **Validar siempre**: `uv run --with mlx-whisper python $H/sistema/validar_cortes.py corte/montaje.mp4 corte/palabras.json`.
  - Una diferencia **junto a un corte** = corte mal puesto: más aire o mover el corte.
  - Una diferencia lejos de un corte suele ser error del transcriptor. Escuchar o comparar antes de tocar.
- **Ritmo:** pausas ≥ 0,4 s fuera; aire de 0,08 s.
- **Zoom solo en los cortes:** alternar dos escalas (ficha `encuadre`) para que el salto parezca un cambio de plano. Nada de zoom en cada frase.

## 4. Voz
`uv run --with numpy python $H/sistema/voz.py voz-original.wav voz.wav`
- Deja la voz a −14 LUFS y −1,5 dBTP.
- Compara la relación voz/ruido antes y después. Si empeora más de 3 dB, usa solo la normalización y lo dice.
- Leer `voz.json`. Lo que no se ha escuchado con oídos humanos se dice así en el informe.
- **Música: ninguna** salvo que Amin la elija o la autorice.

## 5. Subtítulos
- **Bloques por sentido:** escribirlos a mano en `bloques.txt` (`texto|clave`, `+` = palabra que el audio elide) y alinearlos con `subtitulos.py PALABRAS FICHA SALIDA bloques.txt`. El modo automático solo sirve de borrador.
- **Reglas:**
  - nada de conectores colgando ni de bloques fugaces (< 0,45 s);
  - la clave va al final del bloque, nunca sola, y se queda ≥ 0,7 s;
  - como mucho 2–3 claves por cada 30 s;
  - ortografía revisada.
- **Cifras:** el texto en pantalla dice lo que dice la voz.

## 6. Gráficos
- **Solo si ayudan a entender o retener:** una idea por gráfico, ligada a la palabra que lo dispara.
- **En `montaje.json`** cada gráfico guarda `t` (montaje) **y** `t_bruto`. Si luego se recorta, se recoloca por el segundo del bruto con `tramos`.
- **Nunca sobre la cara ni sobre los subtítulos.** Comprobar con fotogramas del render final en los momentos en que zoom y gráfico coinciden.
- **Efectos de sonido:** uno por gráfico como mucho, bajo (≈ −18 dB), con su motivo apuntado.

## 7. Render y entrega
- **Render:** composición `Muestra` (`npx remotion render src/index.ts Muestra salida.mp4 --props=montaje.json --public-dir=public`). Ver `recetas.md` para las capas con alfa.
- **Entregar:**
  - el MP4;
  - `capas/` (voz tratada, vídeo cortado, subtítulos .mov con alfa y .srt, gráficos .mov con alfa);
  - `montaje.json`, `bloques.txt`;
  - un resumen de qué se hizo, qué se decidió y qué queda.

## 8. Control antes de decir «hecho»
1. `qc.py` sobre el exportado.
2. `validar_cortes.py` sobre el **exportado final**.
3. Hoja de fotogramas de todo el vídeo (2 fps) más fotogramas a tamaño real en:
   - el gancho;
   - cada clave y cada gráfico;
   - cada cambio de zoom;
   - el cierre.
4. Buscar:
   - texto sobre la cara;
   - choques entre gráfico y subtítulo;
   - faltas;
   - cifras que no cuadran;
   - negros.
5. En el informe, separar lo que hice de lo que ya estaba, y decir lo que no he podido verificar (por ejemplo, escuchar).
6. **Nunca publicar ni enviar a terceros.**

## Correcciones
Cada corrección de Amin va a `correcciones.md` (problema, decisión, motivo, ámbito). Si es de estilo suyo, se actualiza también `fichas/amin.json`. Solo se convierte en regla general si él lo dice o se repite.
