---
tipo: estudio
actualizado: 2026-11-07
origen: ~/Downloads/Invisible - Marco Said/ (solo lectura)
---
# Estudio: «Invisible – Marco Said» (proyecto de After Effects + vídeos)

**Cómo se hizo:**
- Se leyó el proyecto **abierto en tu After Effects** solo con scripts de lectura. No se guardó, cerró ni descartó nada. Tenía cambios sin guardar que no son míos y siguen ahí.
- Hay una copia exacta, comprobada con suma de verificación, en `3 PROYECTOS/_PRUEBAS CLAUDE/estudio-invisible/copia/`. Sus medios están enlazados al original.
- Volcado completo en JSON: `~/Videos-Remotion/herramientas/ae-estudio/salida/c<id>.json`. Lo generó el script de solo lectura `volcar-comp.jsx`.
- Los vídeos se midieron con ffmpeg (cortes, sonoridad, hojas de fotogramas) y se transcribieron con WhisperX.

> **M** = medido (dato del proyecto o del archivo). **I** = interpretación mía.

## 1. Qué hay en la carpeta
- **Proyecto:** `Reel 3 Oct - Hook - Marco Said Hook ultimo.aep` (17 MB, AE 26.5, 32 bits por canal). Se recopiló el 28-10-2026 desde otro ordenador (Windows, usuario "vicen").
  - 29 composiciones, 27 archivos de medios (1,8 GB).
  - `(Footage)/Comps/Invisible.aep/` **no es un proyecto**: es una carpeta con `FONDO.png` y `ÚLTIMO HOOK.mov`.
- **El trabajo terminado:** composición principal `Reel 3 Oct - Hook - Marco Said Linked Comp 01`.
  - 2160×3840, 24 fps, 16,71 s.
  - Es un hook que anuncia un pack: «Y esto también es un hook. He editado miles de hooks… comenta hook».
- **Otras piezas del mismo editor:**
  - `Final` y `Hook Correr`: la transición de «impacto/desaparición» del vídeo `FINAL Efecto Con subs v2.mp4`;
  - `Hook 3`: un muro 3D de vídeos;
  - `Invisible 2`: el efecto de entrada.
- **Referencias de Marco Said** (720×1280, de Instagram): «¿Cuándo fue la última vez que te sentiste invisible?», «Cada idea que tienes ya existe», «Ya va a pasar», «Los relojes son para mujeres» y otros. Se usan como contenido de las tarjetas.
- **Otros hooks del editor:** «Hook – Una +», «Viejito», «cc 2.84 %», «Prueba HOOK Efectoo» y Víctor Heras.

## 2. Proyecto de After Effects

### 2.1 Organización (M)
- Carpetas: `Assets/Images`, `Assets/Video`, `Comps`, `Solids`.
- Las capas de ajuste tienen nombre de función: «Impact Shake», «Shake progresivo», «Blur glow», «Turbulent», «Lumetri», «Bulge», «Efectos».
- **Precomposiciones por función:**
  - cada tarjeta de vídeo es una precomp `Video Cliente N` / `Video Hook N` de 1080×1920 con 3 capas: vídeo + máscara redondeada + glitch desactivado;
  - `Carrusel` agrupa 11 tarjetas;
  - `comentar` es la barra de comentario;
  - `Invisible 2` es la entrada.
- **Restos sin uso:** `Hoks` (vacía) y `main` (no la usa nadie).

### 2.2 Línea de tiempo de la composición principal (M)
| Tiempo | Capa | Qué hace |
|---|---|---|
| 0–16,7 s | `Invisible 2` (escala 200 %) | Plano a cámara: entrada de 1,46 s y después plano limpio |
| 0–16,7 s | Capa de ajuste «Transformar» | **Acercamiento continuo** de 100 → 130 % en 17,4 s, lineal: **1,73 %/s** |
| 0,42–14,54 s | 17 capas de texto | Subtítulo por grupos de 1–3 palabras |
| 2,83–7,96 s | `Carrusel` (230 %) | Tira de 11 tarjetas de hooks |
| 7,96–14,54 s | `Video Cliente 17` (133 %) | Tarjeta del producto «Los 10 hooks más locos de internet» |
| 14,54–16,71 s | `comentar` (140 %) | Barra de comentario escribiendo «hook» |

### 2.3 Tipografía y jerarquía (M)
- **Subtítulo:**
  - Urbanist Bold, 100 px × escala 139 % = **139 px en 2160 de ancho** (6,4 % del ancho; equivale a 69 px en 1080);
  - interletrado −60, blanco puro, sin caja ni contorno;
  - Deep Glow muy suave: radio 820, exposición 0,03.
- **Duración de cada grupo:** 0,21–1,38 s (mediana ≈ 0,8 s). Cada grupo es su propia capa y sigue el habla.
- **Posición:**
  - y = 2540 (66 % del alto) mientras no hay gráfico, de 0,4 a 2,75 s;
  - y = 2860 (**74,5 %**) desde que entra el carrusel a 2,83 s.
  - **El subtítulo baja 320 px (8,3 % del alto) para dejar sitio al gráfico** y no vuelve a subir.
- **Segunda fuente:** Poppins Light, solo en la barra «comentar» (palabra «hook» a 32 %). Contraste fino frente a grueso.
- **Animación de entrada de cada grupo** (rig «TextEvo», pack de terceros):
  - por carácter, con retraso de 2 fotogramas por letra (5 en tres capas);
  - opacidad 0 → 100 con desenfoque 10 → 0.
  - Comprobado en el fotograma de 4,2 s: a los 0,49 s de entrar se leen 6 caracteres («Miles »), coherente con 2 f por letra.

### 2.4 Movimiento y curvas (M, valores leídos en el tiempo)
- **Carrusel:**
  - un nulo padre mueve las 11 tarjetas 1361 px de la comp (≈ 3130 px en el lienzo final) en **6,64 s**;
  - curva de **salida exponencial**: influencia de salida 0,1 %, de llegada 100 %;
  - recorre el **38 % en los primeros 0,5 s** y el 81 % en 2 s; los 3 últimos segundos casi quieto: 1994 → 1473 → 1249 → 1095 → 980 → 890 … 637 → 633.
- **Entrada de cada tarjeta:**
  - escalonada cada **0,08 s** (2 fotogramas a 25 fps);
  - destello de Deep Glow: exposición **9,9 → 0,08 en 0,167 s** (4 f).
  - La tarjeta del producto usa el mismo destello.
- **Medidas de las tarjetas:**
  - máscara 970×1724, redondez 89 (radio = 9,2 % del ancho);
  - contorno blanco;
  - en pantalla, ≈ 297×527 px de 2160 (**13,8 % del ancho**);
  - paso 371 px, hueco 74 px (25 % de la tarjeta).
- **Muro 3D (`Hook 3`):**
  - cámara con `wiggle(1,7)` en posición y `wiggle(1,0.7)` en orientación: cámara en mano muy sutil;
  - empuje en Z de 0 a 237 entre 0,67 y 3,34 s: casi nada hasta 1 s, rápido entre 1,5 y 2 s (+128) y frenada al final;
  - 7 tarjetas en Z −423 a −891 con escalas 26–92 %, en modo de fusión «Pantalla»;
  - sombra paralela (50 %, 5 px) y el mismo destello 9,9 → 0,08;
  - entran escalonadas entre 1,46 y 1,84 s;
  - el fondo es el plano repetido en mosaico (CC RepeTile).
- **Barra de comentario:**
  - texto «hook» que se escribe en **0,33 s** (selector de rango 0 → 100);
  - cursor que parpadea con periodo de 0,57 s (`loopOut`);
  - píldora 857×109, redondez 49, relleno gris oscuro y contorno rojo;
  - rebote con la expresión «BOUNCr overSHOOT+» (amplitud 50, frecuencia 2, caída 4).

### 2.5 Entrada «Invisible 2» (M): 1,46 s, la pieza estrella
Al principio la persona es **invisible**: solo se ve su silueta por refracción. Luego se «materializa» desde una onda de luz.
1. **0–0,54 s:** fondo (`FONDO.png`) desplazado por un mapa de desplazamiento cuya capa de mapa es el propio vídeo.
   - Desplazamiento horizontal 506 px, en modo «Pantalla»;
   - más turbulento con evolución `time*20`.
   - Resultado: silueta de cristal sobre el fondo.
2. **0,54–1,71 s: anillo de choque.** Una elipse crece de 0 a **2257 px** (más que el lienzo).
   - Turbulento (nivel −116, `time*100`) + CC Glass (desplazamiento 182, luz cálida 1/0,92/0,79) + Deep Glow (radio 1770);
   - funciona como **mate alfa** de la persona recortada con «Mate de objeto»: la persona aparece donde pasa el anillo.
   - Dos copias desfasadas 1 fotograma (0,042 s).
3. **0,71–1,04 s:** brillo de la persona, exposición 1 → 0 (radio 572).
4. **0,46–1,08 s:** abombamiento −0,51 y cromática radial (Sapphire WarpChroma, distancia Z 1 → 0,89 → 1), en ventana de **0,62 s**.
5. **0,29–1,46 s:** temblor progresivo (Sapphire DissolveShake, 0 → 15 → 0).
6. **0,83–1,08 s:** el fondo de cristal se apaga, opacidad 100 → 0 en 0,25 s.
7. **Viñeta** (CC Vignette 40) durante 0–6,6 s.

Desde 1,46 s **no hay ningún efecto**: plano limpio hasta el final.

### 2.6 Transición «impacto / desaparición» (comps `Final` y `Hook Correr`) (M)
Pila de **8 capas de ajuste** que se dispara en el golpe (10,708 s en `Final`, 0,165 s en `Hook Correr`):

| Capa | Pico | Subida | Bajada |
|---|---|---|---|
| Impact Shake: BCC Directional Blur | 23 | instantáneo | 0,067 s |
| Impact Shake: S_BlurMoCurves, Shift Y | −100 → +50 → 0 | — | 0,167 s en total |
| Shake progresivo (S_DissolveShake) | 15 % | 0,29 s | 0,79 s |
| Abombar | −1,01 → +0,1 → −0,13 → 0 (oscilación amortiguada) | — | 1,46 s |
| Desenfoque de lente | 10 | 0,29 s | 0,46 s |
| Deep Glow | pulso | — | 0,25 s |
| Turbulento (máscara con calado de 250 px) | nivel 49 | 0,29 s | 0,5 s |
| Lumetri | temperatura −20 y exposición +2 | 0,29 s | 0,5 s |
| Cromática radial | Z 0,92 y brillo 1,11 | — | 0,46 s |
| CC Force Motion Blur | obturador 360°, 8 muestras | — | — |

**Patrón:** subida corta (≈ 0,29 s) y bajada más larga (0,5–0,8 s). Todo cabe en **1,5 s** y deja el plano limpio.
- En `Hook Correr` la base es un vídeo `hf_…mp4` con remapeo de tiempo y escala 200 %.
  - **I:** probablemente generado con IA (prefijo de Higgsfield). No verificado.
  - Los rayos de `FINAL` vienen de ese metraje, no de la pila de efectos (en `Final` no hay capa de vídeo).

### 2.7 Expresiones (revisadas antes de abrir nada)
- **TextEvo:**
  - matemáticas de retraso por carácter: `textIndex`, `thisComp.frameDuration`, `valueAtTime`, `seedRandom`;
  - sin acceso a archivos ni al sistema.
- `wiggle`, `loopOut`, `time*N`: estándar.
- **«BOUNCr overSHOOT+» está ofuscada** (`var _0x9233=[…]`).
  - Se buscó en el binario: no hay `callSystem`, `File`, `eval` ni `$.evalFile` (0 coincidencias).
  - Es un script de pago de terceros: **no se copia ni se reutiliza**.

### 2.8 Dependencias y lo que falta
- **Instalado aquí:** Deep Glow (`DeepGlow2.plugin`), CC (Cycore), Mate de objeto, efectos nativos.
- **NO instalados:**
  - Boris BCC (Directional Blur);
  - **Sapphire** (S_DissolveShake, S_WarpChroma, S_BlurMoCurves);
  - un efecto «desconocido».
  - Los fotogramas renderizados aquí salen **sin esos efectos**.
- **Fuentes:** Urbanist Bold y Poppins Light (las dos de Google Fonts, OFL), no comprobadas en este Mac.
- **Packs de terceros:** TextEvo y BOUNCr (de pago).
- **Lo que no pude analizar:**
  - el render exacto con Sapphire/BCC;
  - el contenido del efecto desconocido;
  - el audio dentro del AEP (las capas no traen sonido; el sonido final está en los MP4).

## 3. Los vídeos

### 3.1 «¿Cuándo fue la última vez que te sentiste invisible?» (Marco Said, 61,6 s)
**Estructura (M, transcripción WhisperX):**

| Tramo | Qué se dice | Imagen |
|---|---|---|
| 0–2,7 s | Pregunta gancho | Plano a cámara, fondo **blanco luminoso**, simétrico, sentado a la mesa |
| 2,9–24,8 s | Cuatro ejemplos de «ser invisible»: cena, grupo de amigos, perro, vídeo con 21 likes y el comentario de tu madre | **B-roll literal de cada ejemplo**: mesa con la familia, pantalla del chat, llegar a casa, perro, métricas del móvil, comentario «Qué lindo vídeo mijito» |
| 25,3–50 s | Giro: «imagínate que todo fuera al revés…» | **Plano a cámara oscuro y cálido**; casi sin cortes (plano más largo **10,4 s**) |
| 50–54 s | Prueba («¿como este?») | Móvil con un vídeo viral |
| 54–60 s | CTA | Plano a cámara; cierre en negro «The Inner Circle — te veo en el link de mi perfil» |

- **Ritmo (M):** 27 cortes; plano medio 2,2 s; mediana 1,46 s; mínimo 0,38 s.
  - Densidad muy desigual: **casi todos los cortes en los ejemplos** y casi ninguno en el argumento.
- **Subtítulos (M aprox.):** una línea, minúsculas, 1–4 palabras, blancos.
  - Muy pequeños: altura de letra ≈ 1 % del alto (≈ 14 px de 1280); ancho ≈ 26 % en «mientras todos hablaban».
  - Centrados a la altura del pecho, ≈ 45 % del alto.
- **Efectos:** ninguno visible. Solo cortes, enfoque y luz.
- **Sonido (M):** −14,3 LUFS, rango de sonoridad 3,9 LU. **No escuchado.**
- **I:**
  - La fuerza está en el **contraste de luz**: frío y blanco para el problema, cálido y oscuro para la promesa.
  - Las imágenes son **literales y concretas**: el chat real, el contador de likes.
  - El efecto especial no hace falta.

### 3.2 «Invisible 2» (16,7 s) y la composición principal
- **M:**
  - 1 corte detectado (la entrada);
  - −14,9 LUFS, rango 2,2 LU;
  - plano a cámara con luz cálida lateral (aplique a la izquierda) y fondo oscuro.
  - El encuadre cambia de escala en varios momentos (hoja de 1 fps), pero la detección de cortes no los registra. **I:** son saltos de encuadre suaves o el propio acercamiento.
- **I:** un solo efecto potente al principio para ganar el primer segundo. Luego gráficos que **demuestran** lo que dice: «miles de hooks» → carrusel de hooks reales; «los diez mejores» → la tarjeta del producto; «comenta hook» → la barra escribiendo «hook».

### 3.3 «FINAL Efecto Con subs v2» (16,1 s)
- **Medido (M):**
  - un plano fijo general en una cocina, sin cortes;
  - **−25,4 LUFS** (sin mezclar o sin música), rango 10,7 LU.
- **Subtítulo (M en el recorte de 7,6 s):**
  - dos líneas, sans negrita de interletrado cerrado;
  - **justificado**: la segunda línea reparte sus palabras al ancho de la primera, ≈ 65 % del ancho;
  - centrado a ≈ 52 % del alto;
  - las palabras **aún no dichas** aparecen con **desenfoque y menos opacidad** y se enfocan al decirse;
  - brillo suave.
- **Desaparición (M, hoja de 10,25–11,5 s):**
  - arcos eléctricos que nacen en horizontal (≈ 6 f);
  - la carga cubre a la persona (≈ 4 f);
  - salida con desenfoque de movimiento hacia cámara (≈ 4 f);
  - queda la cocina vacía con rayos residuales que se apagan en ≈ 2 s.
  - El subtítulo se queda y parpadea.
- **I:** el efecto **literaliza el texto**: «en el link de mi perfil… algo que pueda ayudarte» y desaparece, como si fuera allí.

### 3.4 Ritmo de los otros vídeos (M; cortes con umbral 0,28, aproximado)
| Vídeo | Cortes | Plano medio | Mediana | Cortes en los primeros 5 s |
|---|---|---|---|---|
| Cada idea que tienes ya existe (83 s) | 25 | 3,2 s | 0,33 s | 8 |
| Ya va a pasar (125 s) | 29 | 4,2 s | 2,5 s | 4 |
| Los relojes son para mujeres (59 s) | 12 | 4,5 s | 3,4 s | 2 |
| Víctor Heras (78 s) | 13 | 5,6 s | 5,4 s | 2 |
| Hook – Viejito (5,4 s) | 4 | 1,1 s | 1,1 s | 4 |

- **Sonoridad de las referencias de Marco:** −14,1 a −14,6 LUFS.
- **Límite:** los cortes en escenas oscuras o con destellos pueden contarse de más o de menos. La mediana de 0,33 s de «Cada idea» indica ráfagas de destellos o glitch, no planos reales.

## 4. Qué hace que parezca profesional (I, apoyado en las medidas)
1. **Un efecto fuerte, una vez, con duración cerrada:** 1,46 s de entrada y ≈ 1,5 s de impacto. Después, plano limpio. Nunca hay dos efectos fuertes seguidos.
2. **Subidas cortas y bajadas largas:** el pico llega en 0,29 s y se va en 0,5–0,8 s. Los destellos de las tarjetas duran 4 f. Nada se queda «a medias».
3. **Curvas exponenciales, no lineales**, en lo que se desplaza. El carrusel recorre el 38 % en 0,5 s. Lo único lineal es el acercamiento continuo, que debe ser imperceptible: 1,7 %/s.
4. **Varias capas débiles en vez de una fuerte:** el impacto suma 8 efectos pequeños (desenfoque, abombado, cromática, temperatura, exposición, turbulencia) que se mueven a la vez.
5. **El gráfico demuestra lo que dice la voz:** carrusel en «miles de hooks», producto en «los diez mejores», barra en «comenta». No decora.
6. **El subtítulo cede su sitio:** baja un 8 % cuando entra el gráfico, y se mantiene en una tipografía, un color y un tamaño.
7. **Escalonado de 2 fotogramas** en letras y tarjetas: da ritmo sin parecer animación «de plantilla».
8. **El B-roll es literal y concreto** (Marco): una pantalla real vale más que un icono.
9. **Contraste de luz por acto:** blanco y frío para el problema, oscuro y cálido para la promesa.
