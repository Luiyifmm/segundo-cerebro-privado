# 01 · Método completo, del bruto al vídeo final

Escrito para otro Claude Code que va a editar como yo. Los clientes van anonimizados: **ClienteA** (marca personal / negocios, acento azul), **ClienteE** (fitness, acento naranja) y **ClienteN** (fitness femenino, acento rojo). Las rutas `archivos/...` apuntan a las copias de esta exportación. Las rutas `~/Videos-Remotion/...` son las originales en mi Mac.

Cuando un valor está puesto **a ojo**, lo digo y doy el rango. Lo demás sale de scripts, de medidas o de una corrección explícita del usuario.

---

## 0. Cómo trabajo en general (y por qué)

1. **El usuario es editor profesional en Premiere y es quien manda.** Yo le dejo hecho todo lo mecánico (corte, subtítulos, motion graphics, sonido, color, QC). Él decide el gusto. **Por qué:** cada reel le llevaba entre 4 y 6 h y tiene unos 4 al día. El objetivo es bajar ese tiempo, no sustituirle.
2. **Orden de autoridad** (cuando dos cosas chocan, gana la de arriba sin preguntar):
   1. Correcciones directas del usuario o de sus clientes.
   2. Sus referencias y su vídeo de ejemplo de cada cliente.
   3. Las skills externas (Motion Video Director, After Effects editor) y las reglas genéricas, solo como oficio de apoyo.
3. **Todo editable.** Los vídeos de cliente se entregan como **secuencia de Premiere**, no como un vídeo plano:
   - clips originales cortados;
   - zooms como escala del clip;
   - subtítulos como plantillas MOGRT con texto editable;
   - motion graphics como clips ProRes 4444 con alfa en su propia pista;
   - sonidos como clips sueltos.

   **Por qué:** él revisa y pule cada vídeo; si algo va "quemado" en un render, no puede tocarlo.
4. **No destruir trabajo del usuario:**
   - Trabajar en una secuencia nueva o en una pista vacía.
   - Desactivar en vez de borrar; borrar solo con permiso y a la papelera.
   - **Releer la línea de tiempo antes de cada cambio**, porque él edita a la vez que yo.
5. **Mirar fotogramas antes de decir "hecho"** y contar lo que falló.
6. **Dirección de estilo para los clientes: natural, elegante y sencillo.** Lo decidió con ClienteA y lo pidió igual para los otros dos: "nada de sobrecarga dopamínica". Pocos efectos y pocos sonidos; un motion graphic solo donde aclare una idea.
7. **Modos de entrega por cliente:**
   - **ClienteA:** el usuario edita a mano. Yo solo le pongo el **bruto entero** (sin cortar nada, ni silencios) y **marcadores con duración** encima.
   - **ClienteE y ClienteN:** propuesta **completa, "digna de resultado final"**, sin preguntar.
   - **Trials** (variantes para Instagram Trial Reels): edición libre.

---

## 1. Ingesta y transcripción

1. Los brutos llegan de Drive, de Descargas o de una carpeta. Se copian a `~/EDICION/1 CLIENTES/<CLIENTE>/BRUTOS/PENDIENTES/<reel>/`. El original no se toca: Drive es de solo lectura.
2. **Inspección con ffprobe antes de nada:**
   - **Resolución y rotación.** Los clips de cámara `A001_*` vienen en 3840×2160 con rotación −90 en metadatos. Los de iPhone (`IMG_*`) vienen en vertical.
   - **fps:** 24 en cámara, 30 en iPhone.
   - **Color:** si `color_transfer = arib-std-b67` es HLG HDR de iPhone y hay que tratarlo (sección 9).
   - **Canales de audio.** Mido cada canal por separado:

     ```
     ffmpeg -ss 20 -t 6 -i X -map 0:a:0 -af "pan=mono|c0=c0,volumedetect" -f null -
     ```

     Repito con `c0=c1` para el otro canal. **En las cámaras de ClienteE y ClienteN el micrófono graba en UN solo canal (−91 dB en el otro).** Si no se arregla, al exportar la voz "no se escucha" en el móvil.
     - Arreglo en Premiere: efecto "Rellenar izquierda con derecha" o "Rellenar derecha con izquierda" en cada clip de voz.
     - Arreglo con ffmpeg: `pan=stereo|c0=c1|c1=c1`.
3. **Transcripción local** con Whisper small y tiempos por palabra (`archivos/Videos-Remotion/voz/transcribir.js`). Usa `@huggingface/transformers` con el modelo `onnx-community/whisper-small_timestamped`, `chunk_length_s 30`, `stride 5`, encoder fp32 y decoder q4. Salida:
   - `<nombre>.palabras.json`: `[{texto, inicio, fin}]`.
   - `.srt`: líneas de hasta 3 palabras; también corta en pausas > 0,35 s y en puntuación.
   - `.txt`.

   Si sale una palabra repetida en bucle ("bueno bueno…"), retranscribir en tramos de 15 s con `--inicio/--duracion`.

   **OJO:** `transcribir.js` sobrescribe el `.palabras.json` del mismo nombre. Antes de retranscribir un trozo, copia el original y luego restáuralo.
4. **Whisper se equivoca en tiempos hasta 0,5 s**, inventa palabras ("Gracias.") y se salta tramos. Por eso:
   - los puntos de corte salen del **volumen real**, no del transcriptor (sección 2);
   - si un tramo sale sin palabras, se retranscribe solo ese trozo con `--inicio X --duracion 4`;
   - antes de elegir tomas se busca el guion del cliente; la transcripción automática de ClienteA falla mucho.

---

## 2. Cortes

### 2.1 Silencios (dos métodos)

**a) Corte simple** (`voz/cortar-silencios.js`, sobre un vídeo):
- `silencedetect=noise=-35dB:d=0.45`: silencio = por debajo de **−35 dB** durante **≥ 0,45 s**.
- Aire a cada lado de la voz: **0,08 s**.
- Ajustes:
  - si corta sílabas, `--aire 0.12` o `--umbral -40`;
  - si deja pausas, `--minimo 0.3`.
- No se generan tramos de menos de 0,15 s.
- Salida: `-cortado.mp4` (libx264, CRF 17, preset fast, yuv420p, AAC 256 kb/s) + `.tramos.json`.

**b) Primer corte con frases** (`voz/primer-corte.js`, el que uso en reels):
- Umbral de silencio **relativo**: la sonoridad integrada del clip (LUFS) **−10 dB**. Así sirve igual para un clip grabado bajo que para uno alto.
- Las frases son unidades numeradas. Se cierra frase en punto, interrogación o exclamación, o en una pausa **> 0,45 s**.
- Las pausas **≥ 0,4 s** se cortan (`--pausa`). Aire **0,08 s** antes y **0,15 s** después de cada pieza.
- Prueba real: un bruto de 138 s quedó en 28,3 s. Las 11 frases y los 13 cortes coincidieron con el montaje manual del usuario (26 s) con un margen de **±0,2 s**.

**c) Brutos con puerta de ruido y una voz de apuntador** (ClienteA). La voz principal va a unos −35 dB; el silencio, a −80; el apuntador que dicta cada frase, a unos −60:
- `silencedetect` a **−58 dB**, unido a las palabras;
- quedarse con los tramos con palabras y un pico **≥ −50 dB**;
- conservar todas las tomas repetidas (él elige).

**d) Recortes finos en Premiere** (lo que hice esta semana con ClienteE):
- Busco silencios con un **perfil RMS de energía de voz**: ventanas de 10 ms (160 muestras a 16 kHz) con una media móvil de 3.
- El punto de corte va en el **mínimo de energía** entre dos palabras vecinas (`calma()` en `premiere/recetas/plan-reel.py`).
- **Valido cada corte** montando el audio de prueba con `ffmpeg concat` y **retranscribiéndolo**: si una palabra sale cortada o falta, el corte está mal.

### 2.2 Muletillas, repeticiones y tomas falsas: elegir la mejor toma

Las reglas (las aplico yo tras el primer corte, con `quitar <reel> 3,7` / `recuperar <reel> 4`):
- **Se quita:**
  - indicaciones fuera de guion ("otra vez", "¿así?", "listo");
  - palabras que Whisper se inventa;
  - **tomas anteriores de una frase que se repite: se queda la ÚLTIMA COMPLETA**, porque normalmente es la buena;
  - ideas sin ninguna toma limpia;
  - frases sin terminar ("…").
- Si hay varias tomas candidatas y Whisper falla, uno las tomas en un solo WAV y transcribo ese WAV. Da el guion limpio y los tiempos del corte.
- En brutos de ClienteE vienen ensayo y toma final en clips distintos, y otra persona dice el nombre del alimento: **se eligen las tomas de la última pasada**.
- **Alternativas dentro de una frase** ("por 30 **o por 35**"): el cliente pidió quitar la alternativa y dejar solo una cifra. Corto el audio en el silencio previo a la "o", lo valido retranscribiendo y quito de los subtítulos la parte cortada.
- Siempre digo **qué números quité y cuáles dudo**. Nunca lo doy por definitivo. Lo quitado queda al final de la secuencia, tras un marcador DESCARTES.
- Lo que **no** puedo arreglar y aviso: repeticiones dentro de una misma frase sin pausa, muletillas pegadas a palabras y el orden de los clips (van por nombre de archivo).

### 2.3 Aire entre frases y ritmo

- **Aire:** 0,08 s antes y 0,15 s después de cada pieza. Entre frases, ninguna pausa ≥ 0,4 s.
- **Ritmo objetivo:**
  - marca personal: un corte o cambio visual cada **0,5–2 s**;
  - educativo: **2–5 s** por idea;
  - variar el patrón rápido-rápido-pausa;
  - cortar en la primera sílaba.
- **Audio solapado** (lo que hace el usuario en ClienteE): en algunos cortes la frase siguiente entra **unos fotogramas antes** de que acabe el audio de la anterior. El audio va en tablero (A1/A2 alternando) y solo se solapa donde queda silencio suficiente. **Máximo 3–4 por vídeo** (`sistema/montaje-solapado.js --solapar 1,2,6 --max 8`).
- Para ClienteA: **bruto entero sin cortar**. Encima, solo marcadores con duración por idea: "IMAGEN derecha: …", "IMAGEN izquierda: …", "MOTION GRAPHIC: …", "CIERRE: seguir …". Se marca la última toma de cada idea y el comentario dice cuántas tomas hay.

---

## 3. Gancho (primeros 3 segundos) y estructura

- **Estructura:** gancho (0–3 s) → problema → solución → prueba → llamada a la acción (una sola, dicha y escrita, visible **≥ 2 s**).
- **Gancho de un reel hablado:** la frase más fuerte primero (afirmación, pregunta, resultado, sorpresa) y un título arriba con la marca. **Nunca el logo de entrada.**
- **¿Reordeno?**
  - Solo si la frase fuerte está más adelante y el sentido no se rompe; en ese caso la subo al principio.
  - En reels con guion (ClienteE/N) **no reordeno**: el guion ya trae el gancho delante y el cliente lo escribió así.
  - En vídeos largos de YouTube (entrevistas) sí monto un gancho de **10–20 s** con 3–4 frases punch de distintos entrevistados: una cifra sorprendente, un consejo potente y una de humor.
- **Títulos de gancho de ClienteE:**
  - plantillas propias del usuario "Animación Limpia Rápida" (blanco) + "Animación Rápida Con Brillo" / "Desenfoque Con Brillo" (naranja 255,96,0);
  - con Sombra paralela: opacidad 127,5, dirección 135, distancia 5;
  - el usuario decidió hacer él el título "CALCULA esto" del último vídeo, así que **los títulos de gancho a veces los hace él**: preguntar si no está claro.

---

## 4. Subtítulos

Van siempre como **plantilla MOGRT con texto editable** en Premiere, una por bloque. Plantillas en `archivos/plantillas/mogrt/`, generadas por los `.jsx` de `archivos/Videos-Remotion/ae/` con After Effects.

### 4.1 Estilo por cliente (valores exactos)

| | ClienteE (reels) | ClienteN | ClienteA |
|---|---|---|---|
| Plantilla | `Subtitulo ClienteE v3.mogrt` | la de ClienteE con sus colores | `Subtitulo ClienteA v10/v12.mogrt` |
| Fuente | Sequel Sans (Medium Disp en la línea, Heavy Disp en la clave) | igual | SF Pro (Bold en todo) |
| Tamaño | Tamano **52,2** · Tamaño de la línea **77** · palabra clave **50** | igual | **67,89** |
| Color línea / clave | blanco / **naranja 255,88,0 (#FF5800)** | blanco / **rojo 211,38,28 (#D3261C)** (verde #00FF04 solo para "lo bueno") | blanco / **azul 30,138,255 (#1E8BFF)** |
| Sombra | opacidad **100**, difuminado **34**, distancia **18** | igual | **100 / 38 / 16**, glow 0 |
| Posición (Movimiento, normalizada) | **[0,5, 0,3909]** sobre el pecho (en 16:9: escala 40, [0,5, 0,57]) | igual | y **0,4375** con clave / **0,466** sin clave |
| Entrada | **6 fotogramas**; la clave entra **2 fotogramas** después | igual | fundido de 3 f en la línea; la clave sube unos px en 6 f, sin desenfoque |
| Alineación | izquierda | izquierda | izquierda, línea pegada encima de la clave como un solo bloque compacto |

Cosas comunes:
- **Por qué esa posición:** sobre el pecho, nunca sobre ojos ni boca, y fuera de las zonas de interfaz de Instagram.
- **Zonas seguras 9:16 (1080×1920):** libre arriba ≈ **220 px**, abajo ≈ **420 px** y derecha ≈ **140 px**. Los subtítulos van al 60–70 % de la altura (en la práctica a ~950 px de 1920 en ClienteE).

### 4.2 Bloques y palabras por línea

- **Máximo 4 palabras por bloque** en ClienteE/N; **1–3 palabras** en ClienteA.
- Forma preferida (corrección del usuario del 22-10): **línea de 1–3 palabras + palabra clave grande al final** ("Seguramente haces / **ejercicio**").
- **Nunca acabar un bloque en "de", "la", "que", "y"…**: esa palabra pasa al bloque siguiente.
- **Nunca una palabra clave sola** en pantalla. Si la clave se dice claramente después de la línea, la línea sigue en su pista (V3) y la clave va en un clip aparte en la pista de encima, desde que se dice hasta el final del bloque.
- Un bloque de menos de ~0,45 s se une a la frase anterior.
- La partición automática sale troceada. Los bloques buenos los escribo a mano (`línea|clave` por renglón) y los alineo a los tiempos de palabra.

### 4.3 Cómo elijo la palabra clave y su color

- **Una clave por bloque, y solo si es la ÚLTIMA palabra del bloque.**
- Es la palabra que lleva el significado: el sustantivo o verbo del beneficio o el problema ("grasa", "proteína", "levantes", "hambre"). Nunca un conector.
- **Color:** el acento de la marca. En comparativas, **malo en rojo (226,38,38) y bueno en verde (22,170,72)**, aunque la marca sea naranja; fue una corrección del usuario y de los clientes.
- **Menos clics:** el sonido de "clave" solo va en las palabras que de verdad importan, no en todas las resaltadas.

### 4.4 Correcciones que el usuario aplica y yo copio sin que lo pida

- **Intro con títulos animados:** subir los subtítulos de esos segundos a **y 0,32** para que no choquen.
- **Números de cada punto** ("1.", "2.", "3."):
  - MOGRT "Efecto Brillo", Inter-Black **300**, en **[0,5, 0,616]**, durante **≈ 0,83 s**;
  - entra con Transformar: sube de y 0,6536 a 0,5 y opacidad 1→100 en 0,2 s;
  - sale con desvanecido.
- **Cifras como gráfico** ("3 DÍAS × 45 MIN", "2–3 H"): Efecto Brillo, Inter-Black 225–300. La cifra **se quita del subtítulo** y queda el resto de la frase. Si la frase entera es la cifra, ese bloque va sin subtítulo.
- **Énfasis del cierre:**
  - frases clave más grandes (Tamano 74 y línea 100);
  - números en cifra ("3", "1 mes").
- **Texto:**
  - completar la clave que Whisper corta ("da sueño", "comer algo");
  - corregir faltas y tildes; **revisar siempre la ortografía** del texto en pantalla;
  - quitar muletillas.
- **Si hay rótulo con la operación:** quitar el subtítulo que repite la operación y dejar solo el resultado.

### 4.5 Colocar los subtítulos

```
python3 premiere/recetas/colocar-subs-mogrt.py subs.json cfg.json <pista 0=V1> "<nombre secuencia>" <carpeta>
```

Después se ejecutan `tanda0.jsx`, `tanda1.jsx`… en orden: 120 MOGRT por tanda como máximo.
- `subs.json` = `[[inicio, fin, línea, clave], …]`.
- El `cfg` lleva plantilla, ajustes, `colorClave` y `subPos` (ejemplo en `ejemplos/02…/cfg-subtitulos-mogrt.json`).
- **Siempre en una pista VACÍA.** `importMGT` mete la plantilla con 30 s de duración y **pisa lo que haya detrás** antes de recortarla. Así se borraron 32 subtítulos el 19-10.
- **Recortar con `clip.end = fin` Y después `clip.outPoint = fin − start`.** Con solo uno de los dos, el clip no se puede estirar con el ratón o se queda de 30 s.
- Las plantillas duran 30 s como máximo; un texto más largo se queda vacío a partir de ahí, sin dar error. Hay que partirlo en dos clips.
- Al terminar: contar los colocados frente a los esperados y mirar fotogramas en la intro, en cada número y en el cierre.

### 4.6 Subtítulos animados fuera de Premiere (trials)

Remotion leyendo `palabras.json`: palabra activa resaltada y entrada con spring. Se renderiza con alfa y se pone encima. Solo para trials.

---

## 5. Zooms y movimiento

- **Zoom de énfasis** en frases fuertes: **105–120 %** (YouTube entrevistas: **108–118 %**).
  - En Premiere va como **escala del clip** por pieza, no como fotograma clave quemado. En `plan-reel.py` cada pieza lleva un factor (1,0 / 1,1).
  - **Corte de cámara simulado:** se alterna 100 % ↔ 110 % entre piezas consecutivas. Así un salto de corte parece un cambio de plano.
  - **A ojo:** elijo en qué frases según el guion. Suelen ser 1 de cada 3–4 piezas.
- **Empuje lento en pausas:** 0,5–2 % por segundo (a ojo, dentro de ese rango).
- **Reencuadre para dejar sitio a un gráfico:**
  - ejemplo "Mejores alimentos" de ClienteE: escala **125**, ancla [0,5, 0,5], posición **[0,375 o 0,625, 0,52]**, alternando lado según hacia dónde señala;
  - así se esconde la mesa y queda el hueco libre donde va la lista.
- **Curvas** (en los motion graphics de Remotion):
  - nunca lineal;
  - entradas con `spring({damping: 14, stiffness: 190–200, mass: 0.7})`;
  - movimientos con `Easing.bezier(0.16, 1, 0.3, 1)` o `Easing.out(Easing.cubic)`;
  - salidas más rápidas que las entradas (fundido de 0,2–0,35 s);
  - escalonado **40–80 ms** entre elementos hermanos (en mi código, de 0,05 a 0,3 s según el caso).
- **Seguimiento de cara:** **no lo uso.** Encuadro a mano con posición y escala por pieza.

---

## 6. B-roll, imágenes, emojis y textos en pantalla

- **Cuándo:**
  - solo cuando la frase nombra algo concreto (alimento, objeto, persona, cifra);
  - una idea por pantalla;
  - **nunca tapar la cara** (fue la primera queja del usuario, el 08-10).
- **Imágenes de apoyo:**
  - **provocadoras / conceptuales**, no stock neutro (corrección del usuario): ilustración satírica, la escuela como fábrica, una mano con hilos…;
  - de páginas públicas `pinterest.com/ideas/<tema>/<id>/`, con el original en `i.pinimg.com/originals/…`;
  - con licencia libre: Wikimedia Commons (`generator=search&gsrnamespace=6`) y Openverse (`license=cc0,pdm,by`), anotando el origen en `fuentes.json`.
- **Formatos que funcionan:**
  - cuadrícula 2×2 con línea blanca;
  - tarjeta redondeada (1500×900, esquinas de 60 px, borde blanco);
  - miniaturas que **se acumulan** por grupo para no perder el hilo (corrección de ClienteE);
  - recorte del objeto que entra grande y vuela a su sitio.
- **Emojis:** emojis de Apple a PNG con `herramientas/emoji/emoji "<emoji>" out.png 512`. Son válidos (el usuario no los descarta). Para alimentos los uso en lugar de fotos libres, porque estas salen muy desiguales.
- **Duración en pantalla:** tiempo de lectura ≈ **0,3 s por palabra + 0,5 s**, y texto **≤ 6–8 palabras**. Una píldora de contexto ("Perder grasa 🔥") dura **1–2 s como máximo** (corrección del cliente).
- **Motion graphics a pantalla completa:**
  - antes de animar, escribo para cada frase **qué objeto la representa** (metáfora visual);
  - si no hay una metáfora clara, texto limpio y nada más;
  - lo nuevo se suma a lo anterior en vez de borrarlo.
- **Pizarra de cálculos** (corrección de ClienteE del 30-10): **una operación cada vez**, en grande. Los números se juntan y se convierten en el resultado. Solo el resultado queda fijado arriba. Al sumar o restar, los fijados bajan, se fusionan y sale el resultado más grande. Empieza con "???" en negro.

---

## 7. Sonido

### 7.1 Voz
- **Primero los canales:** si la voz está en un solo canal, "Rellenar izquierda con derecha" (o al revés). Es lo más grave que me ha pasado: el vídeo exportado "no tenía voz".
- **Cadena en Premiere** (la que tiene el usuario en ClienteE): Mejorar la voz → Volumen 0 dB → Compresor de banda única → Limitador forzado.
- **Normalización:**
  - voz de ClienteA en bruto a unos −33 LUFS → `loudnorm=I=-15:TP=-1.5`;
  - mezcla final cerca de **−14 LUFS**, pico **≤ −1,5 dBTP**;
  - el QC avisa fuera de **−18 a −11 LUFS**.
- **Cadena "ideal"** (de las referencias): reducción de ruido suave → EQ de limpieza (corte < 80 Hz y > 12–16 kHz) → compresor **2:1** con umbral en el nivel más bajo de la voz → de-esser → limitador.
- **Excepción medida, ClienteE en el gimnasio** (ruido de fondo a unos −36 dB): **no comprimir ni subir ganancia ni presencia**. La cadena subió el ruido 5 dB y el usuario lo notó. `afftdn` + `agate` no lo bajaron. **Medir el nivel de los silencios antes y después** de procesar una voz.
- **Adobe Podcast Enhance:** ClienteE lo pidió ("sale súper niquelada"). No se puede lanzar por script; se hace a mano o en podcast.adobe.com/enhance y se reconecta el WAV.

### 7.2 Música
- **Estilo:**
  - la de la referencia del cliente;
  - ClienteN: "más fuerte, no suave" (rechazó el piano de Chopin);
  - en educativo, instrumental neutro sin voz;
  - la música de ClienteE la elige el usuario.
- **Volumen:**
  - la voz **10–15 dB por encima** de la música;
  - en ClienteE quedó en unos **18 dB por debajo** de la voz;
  - las reglas de las referencias dan **−20 / −24 dB** bajo la voz y **unos −25 dB** en vídeos sin cara.
- **Cuánto baja cuando habla la voz:** la referencia que el usuario quiere imitar (@julianealborna) solo sube la música **~2–3 dB** cuando la voz calla, sin bombeo marcado: la voz manda siempre. Además se recorta con EQ en los medios donde vive la voz.
- En vídeos largos: música en bucle con `acrossfade`.

### 7.3 Efectos (los míos, con nivel exacto)

| Sonido | Cuándo | Nivel en Premiere | ≈ dB |
|---|---|---|---|
| Cinematic Click | palabra clave importante | 0,517 | +9,3 (el archivo es muy bajo) |
| Data Collect | cifras en pantalla | 0,124 | −3,1 |
| **Smooth Pop** (UN solo pop) | emoji / alimento / ítem que aparece | 0,06 | −9,4 |
| Pop up SFX (0–0,62 s) | entrada de la animación de seguir | 0,06 | −9,4 |
| Mouse Click 01 | clic en "Seguir" | 0,08 | −6,9 |
| Ui button | aparece una operación o fila | lo que tenga el clip (0,071) | −8 |
| Mouse Click 03 | "× número" y resultados | 0,089 | −6 |
| VS_Short Whoosh 3 | entra una tarjeta (pizarra) | (0,071) | −8 |

- **Fórmula del nivel:** `Nivel = 10^((dB − 15)/20)`, así que 0 dB = 0,1778.
- **No usar "Normal Pop.wav":** son varios pops seguidos y parece que salen varios objetos.
- **Colocación:** el pico del sonido en el fotograma exacto del movimiento (±1 f). El clic, 0,02 s antes.
- **Regla:** el sonido marca **cambios**, no cada palabra.
  - Riser → impacto en revelaciones.
  - Whoosh en movimientos y entradas de texto.
  - Pop en iconos, imágenes y emojis.
  - Clic en interfaz y botón de seguir.
  - Obturador en fotos.
  - Acierto / error en veredictos (ClienteN).
- Cada efecto importante en **dos capas** (grave + agudo) y con panorama que sigue el movimiento (−100 izquierda / +100 derecha) en comparativas.

### 7.4 CTA final
Animación propia "Guárdalo / Compártelo / @cuenta · Siguiendo":
- ProRes 4444 con alfa, 3,63 s, en posición [0,5, 0,98] y en la pista libre más alta;
- **empieza 2,2 s antes de "sígueme"**, porque el botón pasa a "Siguiendo" a los 2,2 s;
- Pop up SFX al entrar y Mouse Click 01 en el clic.

---

## 8. Motion graphics (Remotion → Premiere)

- **Componentes:** en `archivos/Videos-Remotion/motion/src/`.
  - Están hechos a **1080×1920 y 30 fps** y se colocan en la secuencia 2160×3840 a **escala 200**, posición [0,5, 0,5].
  - Fondo transparente.
  - Los tiempos de cada elemento van en **props JSON** (`ejemplos/01…/animacion-props-v17.json`), sacados de las marcas de palabra de la voz.
- **Render para Premiere:**

  ```
  npx remotion render src/index.ts <Comp> salida.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --props=props.json
  ```

- **Revisión:**
  - fotogramas sueltos con `npx remotion still … --frame=N`. **Ojo:** frame = segundos × **30**; me equivoqué usando 24;
  - una hoja de contacto del tramo;
  - después, fotogramas reales exportados desde Premiere con los subtítulos del usuario debajo, **para comprobar que no chocan**.
- **Cuando el usuario recorta la secuencia, se recalcula todo por tiempo de origen:**
  - para cada tiempo del gráfico: tiempo en la secuencia vieja → segundo del bruto (con el `inPoint` de las piezas de V1) → tiempo en la secuencia nueva;
  - si ese segundo ya no existe, el evento se lleva al inicio de la pieza siguiente y se avisa;
  - se vuelve a renderizar y se coloca encima;
  - los sonidos se mueven igual: primero todos +200 s para que no se pisen y luego cada uno a su sitio (`trackItem.move`).
- **Alfa:** el ProRes 4444 del ffmpeg 6 normal deja un alfa que Premiere NO lee. Hay que usar el ffmpeg incluido en Remotion o renderizar desde Remotion.

---

## 9. Imagen

- **HDR iPhone (HLG):** en la secuencia `autoToneMapEnabled = true`. Si no, se ve lavado.
- **Corrección Lumetri aceptada por el usuario** (índices de Corrección básica):

  | Ajuste (índice) | Valor |
  |---|---|
  | Exposición (19) | **−0,45** |
  | Contraste (20) | **+14** |
  | Resaltados (21) | **−45** |
  | Sombras (22) | **+4** |
  | Blancos (23) | **−28** |
  | Negros (24) | **−8** |
  | Nitidez (41) | **12** |

  - ClienteE: temperatura (14) **+3**, saturación (16) **108**, intensidad (42) **14**.
  - ClienteN (pared amarilla): temperatura **0**, saturación **100**, intensidad **8**.
  - Tomas grises de gimnasio de ClienteE: +9 / 120 / +0,12 / +24 / −14 / −6 / +8 / −12 / 14 / 16 (orden: temperatura, saturación, exposición, contraste, resaltados, sombras, blancos, negros, nitidez, intensidad).
  - **Comprobar que TODAS las tomas tienen Lumetri:** los clips que el usuario añade o corta después llegan sin él.
- **LUTs:** no uso LUT de conversión con material de iPhone (ya es Rec.709 o HLG con tone mapping). Si va un LUT creativo, en una capa aparte y con la intensidad bajada.
- **Paso a 9:16:** el material ya se graba vertical. Los clips de cámara `A001_*` llevan Rotación 90 en Movimiento si Premiere no los gira; se mira `VideoInfo` en los metadatos del proyecto: "2160 x 3840" = ya girado. Para 16:9 (YouTube), plantillas verticales a escala 40.
- **Fotogramas o portadas desde HLG:**

  ```
  zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=rgb24
  ```

  Para elegir el fotograma nítido se usa la varianza del laplaciano y se miran manos y cara al 100 %.

---

## 10. Exportación

- **Final (lo hace el usuario en Media Encoder):** preset `archivos/presets/max h264 (Media Encoder).epr`.
  - H.264, 2160×3840, VBR con objetivo ~60 Mb/s y máximo ~72 Mb/s; leído del preset, los valores exactos están en el archivo.
  - Se corrigió que el nivel 6.0 forzaba la codificación por software.
  - **Esperar a que Premiere termine de analizar "Mejorar la voz"** antes de exportar. Si se exporta enseguida, la voz sale "como superpuesta".
- **Previsualizaciones y trials hechos por mí:** 1080×1920, 30 fps, H.264 yuv420p, CRF 17, AAC 48 kHz 256 kb/s.
- **Overlays:** ProRes 4444 yuva444p10le, 1080×1920 y 30 fps.
- **Portada:** 2160×3840 PNG desde el fotograma 4K (nunca a 1080 y luego ampliar). Componentes `ClienteEPortadaCalcula`, `ClienteNPortada` (estilo "mixto", `natural: true`).

---

## 11. Revisión antes de dar un vídeo por bueno

1. Releer la secuencia (el usuario edita a la vez) y comprobar que mis cambios están donde deben.
2. Exportar **6–16 fotogramas** desde Premiere en momentos clave y mirarlos en una tira:
   - gancho;
   - cada número o tarjeta;
   - cambios de sección;
   - CTA;
   - último fotograma.

   Hay que comprobar:
   - texto sobre la cara;
   - gráficos que pisan subtítulos;
   - cifras que no cuadran con la voz;
   - faltas de ortografía;
   - huecos negros en V1.
3. Contar los subtítulos y los sonidos colocados frente a los esperados.
4. **Sonido:**
   - canales de la voz;
   - ningún efecto pisándose en la misma pista: compruebo duraciones después de mover;
   - "Mejorar la voz" terminado.
5. `node voz/qc.js <video>` sobre la exportación: formato, duración, negros, congelados, silencios y volumen. Veredicto **APROBADO / REVISAR / BLOQUEADO** con evidencia.
6. Guardar el proyecto.
7. Contar al usuario qué hice, qué decidí por mi cuenta y qué necesito de él.

**Cómo aplico correcciones:**
- Leo la corrección entera y la convierto en cambios concretos.
- Si es ambigua y cambia el resultado, pregunto **una** vez, con opciones.
- Aplico la corrección **solo** a lo que se pidió. Por ejemplo, "no agrandes los cuadros" significa solo eso.
- Releo antes y vuelvo a mirar fotogramas.
- Si el usuario dice "no lo toques", no se toca ni el vídeo ni el audio, solo la capa pedida.
- La regla que sale de cada corrección se guarda en memoria (ver `05-errores-y-lecciones.md`).
