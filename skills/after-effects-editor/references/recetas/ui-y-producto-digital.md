# Recetas · Interfaz (UI) y producto digital

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.10 Iconos de persona de cristal (glass)
- 4.44 Onda con repeater (fondo del anuncio Glass Health)
- 4.48 Logo 3D de cristal o cromo
- 4.50 Degradado que viaja con la capa (Ramp y 4-Color en capas que se mueven)
- 4.51 Rueda de paneles ("ruleta", lo que el profe hace con React)
- 4.52 Panel inclinado: resolver la cámara a partir de lo que se ve
- 4.53 Onda de audio neón procedural
- 4.67 Montones de tarjetas ("10 vídeos") que aparecen en escalera (clase 12)

### 4.10 Iconos de persona de cristal (glass)

- Cabeza: círculo con **Ramp radial** (claro arriba a la izquierda) + brillo elíptico desenfocado al 45 %.
- Cuerpo: elipse ∩ rectángulo (**Merge Paths → Intersect**) + Round Corners 22, con Ramp vertical oscuro→claro al 76–88 % de opacidad. **Luz de borde inferior:** mismo contorno en trazo + Linear Wipe (180°, 62 %, calado 60).
- Glow sobre la precomp (radio 45–50, intensidad 0,85–1,1). Para cambiar de color: segunda precomp en otro color encima, en fundido.

### 4.44 Onda con repeater (fondo del anuncio Glass Health)

- **Capa de forma:** un trazado en U (o en S) con trazo lavanda **#B4C0FF de 0,5–1,5 px**.
- **Repeater:** 8 copias; posición de la copia (0, 150) o (0, 0) si el giro va alrededor del cruce; **rotación por copia animada** (0 → −3°) y **offset** animado (−4 → −3).
- **Trim Paths End** 20 → 100 % en 12 F: la onda "se dibuja".
- **Estilo:** Deep Glow tintado (exposición 0,3–1,1) + **Box Blur 1–2,5**, que imita el desenfoque de lente (más rápido que CC Lens).
- **En 3D:** meterla en una precomp grande (6400×3200) y hacer 3D la precomp (con el motor `"ADBE Calder"` los efectos no van en formas 3D). Paralaje 0,6–0,8 respecto a la cámara.
- **Muy cerca y desenfocada** (trazo 30, desenfoque 90), la misma onda se convierte en "bandas de luz" del fondo.

### 4.48 Logo 3D de cristal o cromo

- **SVG → capas de forma:** función `svgShape()` en `glass_lib.jsx` (lee M/C/L/Z; si el último punto repite el primero, los fusiona).
- **Extruir:**
  - **por script solo con el renderizador Cinema 4D** (profundidad 15–50);
  - material: Specular 45, **Reflection 100, Metal 100**, Specular Shininess alta (es la que da el brillo).
- **Reflejos:**
  - una textura (cromo líquido o cristal en bloques, teñida con Tritone al color de marca) en una capa con **`environmentLayer = true`**;
  - lo que hizo el profe (Advanced 3D + luz Environment) cerró AE con la extrusión puesta por script.
  - Ojo: aquel script ponía `"ADBE Advanced 3d"`, que es el Classic 3D (no tiene extrusión ni luz de entorno). Con `"ADBE Calder"` no está probado.
- **Color final:** Tritone sobre la precomp (#A9C0FF / #2242EE / #020626) = azul profundo saturado.
- **Giro:** Rotate X/Y/Z de la capa extruida dentro de la precomp, así la precomp se reutiliza con time remap.

### 4.50 Degradado que viaja con la capa (Ramp y 4-Color en capas que se mueven)

- En capas de forma o texto que se mueven (o cuyo padre se mueve), los puntos del efecto se leen en coordenadas de la comp: el degradado se queda quieto y la capa sale de un solo color.
- **Solución:** expresión `toComp([x, y])` en cada punto (coordenadas de la capa). Sirve para el cromado de "Glass Health AI" (Ramp #E2E5F8 → #5E66A8 con los puntos en el borde superior e inferior del texto).

### 4.51 Rueda de paneles ("ruleta", lo que el profe hace con React)

- Paneles colocados en un círculo grande: cada uno girado 25–27° respecto al vecino, con radio ≈3700 px a escala 1.
- Se anima **un solo giro** (el de la rueda) + la escala (la cámara se aleja).
- **Sin plugin, con un RIG RÍGIDO** (no keys por fotograma: temblaban):
  - CÁMARA (nulo: posición X/Y separadas + escala) → RUEDA (nulo en [0, R], giro w) → cada panel en R·(sen d, −cos d) con giro d + τ.
  - Solo se animan w, S y la cámara, con 4–5 keys ajustadas a lo medido (`rastrear_rot.py` + `ajuste_multi.py`).
- Paneles laterales: Exposure −0,8 y desenfoque 1,6 px. El central entra en foco al llegar.

### 4.52 Panel inclinado: resolver la cámara a partir de lo que se ve

- **Inclinación sencilla (una rotación X):** medir el ancho de 2 elementos iguales arriba y abajo y su altura en pantalla, y buscar el zoom y el ángulo que lo cumplen (`s7_perspectiva.py`). Resultado del anuncio: zoom 3720 (≈58 mm) y 39,1°.
  - Montaje: precomp con cámara fija + panel 3D inclinado (**sin** "contraer transformaciones" si dentro solo hay capas 2D).
- **Plano muy inclinado o rotado:**
  - **homografía** con 10–15 puntos (inicios y finales de líneas de texto) → las 4 esquinas → **Corner Pin** (`s8_homografia.py`, error 5,5 px);
  - el movimiento, con un nulo 2D rastreado.
  - Para que el texto no se pixele: envoltura al 200 % con "contraer transformaciones".

### 4.53 Onda de audio neón procedural

- 5 trazados en una capa de forma, cada uno con una expresión `createPath`: 60 puntos a lo largo del ancho.
- Altura de cada punto = envolvente `sin(π·u)` × amplitud × seno que se desplaza con `time` (frecuencias y fases distintas por línea).
- Colores #4B5BFF, #7A6BFF, #9FA8FF, #3E4CFF, #C4B8FF; trazos de 3–6 px; Deep Glow 0,8–1,3 tintado.
- Se mueve sola y nunca se repite.
- **Versión medida (Glass Health v2), más parecida al original: una "cuerda" trenzada.**
  - y = ondulación LENTA común (10·sen(34u − 2,4t) + 5·sen(12,5u + 1,3t) + 3·sen(21u − 1,7t)) + trenzado fino propio de cada hebra ((4 + 3·(k mod 3))·sen((44 + 6k)u − (4,2 + 0,5k)t + 1,3k)).
  - Con frecuencias muy distintas por hebra sale un haz con demasiados cruces.
  - 3 hebras marcadas (azul #3B42F2, índigo #6A48EE, rosa-violeta #B48AF5) y 2 tenues.
  - La neblina, centrada en la onda o debajo (en los primeros planos, un resplandor violeta bajo la onda).

### 4.67 Montones de tarjetas ("10 vídeos") que aparecen en escalera (clase 12)

- **Una precomp por montón:**
  - 3 tarjetas (200×318, radio 18, #1F1F1E);
  - las 2 de detrás con **el ancla en la esquina inferior izquierda**, giradas +3° y +6° (la clase: +4 y +8) y subidas 4 y 8 px;
  - S_DropShadow suave (blur 8) en cada una.
- **"10":** Nexa Heavy (tracking 52, escala horizontal 92 %) con Deep Glow radio 300, exposición 0,18. El halo llena el centro de la tarjeta y deja oscuros el canto y el hueco de fuera.
- **Escalera:** 7 copias de la precomp con fundido de 0,26 s, **una cada 0,14 s**, en orden de lectura.
- **Radios de glow:** dependen del tamaño de la precomp y de la escala. Medirlos en la referencia (el halo cae de ~90 a ~35 en 35 px a 1280); no copiar los números de otra comp.

