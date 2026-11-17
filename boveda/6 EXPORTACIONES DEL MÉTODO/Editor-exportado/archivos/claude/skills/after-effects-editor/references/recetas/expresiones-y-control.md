# Recetas · Expresiones, capa CONTROL y sistemas

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.15 Librería de script
- 4.23 Animar un efecto que no se puede animar
- 4.24 Antes/Después con la misma precomp
- 4.38 Trayectorias, gráficos y "papel cebolla" por expresión
- 4.70 Expresiones: lo esencial (Tanda 03 · 01, clase de conceptos)
- 4.71 Capa CONTROL = panel de mando de toda la animación
- 4.72 Globo de puntos que "se infecta" (CC Sphere + Barrido de degradado)
- 4.74 Glitch digital gobernado por UN deslizador
- 4.76 Sonido sincronizado con las curvas de AE (síntesis con numpy)

### 4.15 Librería de script

- `scripts/ae_lib.jsx`: se carga con `$.evalFile(File(...))` al principio de cada script. Funciones: `keys, pop, rise, fadeIn, newShape, grp, add, rectP, ellP, pathP, bez, fill, stroke, taper, trim, getTrim, drawOn, box, circle, ramp, glow, shadow, blur, bgRadial, bgLinear, vignette, grain, dots, guides, txt, boxText, camNull, loc, parentKeep`, más los estilos de capa (`layerStyle`), el color (`hsl, mix, toHex, wheel`) y, desde la clase 11, `to3D, null3D, fakeMB, easeY, alive, rrMask, footLayer`.

### 4.23 Animar un efecto que no se puede animar

- Hue/Saturation y otros tienen `canVaryOverTime = false` en algunos parámetros → fijar el valor final y animar la **Opacidad del efecto** (`fxFade(efecto, t0, t1)`), o ponerlo en una capa de ajuste y animar la opacidad de la capa.

### 4.24 Antes/Después con la misma precomp

- La precomp dos veces con **Time Remap** (una congelada: `1`; la otra: `17.5 + time*0.25`), máscara de la de arriba animada de ancho completo a la mitad + línea divisoria con glow + etiquetas ANTES / DESPUÉS.

### 4.38 Trayectorias, gráficos y "papel cebolla" por expresión

- Trayectoria que se dibuja con el objeto: `createPath(P.slice(0, n))`, con los puntos precalculados incrustados en la expresión y `n = floor((time − t0)·30)`.
- Gráfico en vivo de otra capa: muestrear `comp("X").layer("Y").transform.position.valueAtTime(t)` en los últimos 3 s.
- Un punto por fotograma para enseñar el espaciado: grupos de forma con opacidad `time >= t_k ? 85 : 0`.
- Curva de suavizado de AE en un script: bézier `(0,0)–(a,0)–(1−a,1)–(1,1)` con `a = influencia/100` (función `easeY`).

### 4.70 Expresiones: lo esencial (Tanda 03 · 01, clase de conceptos)

- **Qué son:** el valor de UNA propiedad calculado con código. Sirven para:
  - automatizar lo que pediría muchos keys;
  - vincular propiedades entre capas y **entre comps**;
  - meter aleatoriedad.
- ⚖️ **Regla de la clase:** si con keyframes es más fácil, keyframes. Mi versión: **pocas keys "de mando" y todo lo demás derivado por expresión**.
  - En "La IA dominará el mundo": 4 propiedades con keys y 227 expresiones.
- **Cómo se ponen** (lo que hace el usuario a mano):
  - Alt + clic en el cronómetro, Animación → Agregar expresión, o Mayús + Alt + =.
  - El valor se pone rojo. **No pulsar Enter** para confirmar: hacer clic fuera.
  - El botón "=" apaga sin borrar. Alt + clic la borra.
- **Pick whip:**
  - Solo dentro de la misma comp, y la propiedad destino tiene que estar visible (**SS** abre solo la seleccionada).
  - Con un Control de ángulo o un deslizador + pick whip se tiene un "mando" (`effect("x")("Angle")`).
- **Menú del lenguaje (flecha):** plantillas por categorías (Interpolación, Global, Aleatorio, Conversión de color…). Los huecos (`tMin`, `value1`…) dan error hasta que se rellenan.
- **Gráfico de post-expresión** (Editor de gráficos): la línea tenue es el original y la brillante, el resultado. Sirve para enseñar al usuario qué hace una expresión.
- **Copiar:**
  - **"Copiar solo expresión"** (clic derecho en la propiedad) + seleccionar capas + Ctrl+V: la misma expresión en muchas capas.
  - **"Copiar con enlaces de propiedad relativa"** → `thisComp.layer(...)`.
  - **"Copiar con enlaces de propiedad"** (absoluto) → `comp("X").layer(...)`: **vincula comps distintas** (plantillas, cámaras, precomps).
- **Ejercicio final (plantilla que viaja con la capa):**
  ```
  // opacidad
  ease(time, inPoint, inPoint + 1, 0, 100)
  // escala
  var miVariable = linear(transform.opacity, 0, 100, effect("ESCALA INICIAL")("Slider"), 100); [miVariable, miVariable]
  ```
  - Mover la capa en la línea de tiempo mueve su animación, sin tocar keys.
  - En capas 3D, 3 valores.
- **Por script:**
  - `prop.expression = "…"`, con **comentarios `//` dentro** para que el usuario entienda cada expresión al abrirla.
  - Revisar TODO el proyecto antes del render: recorrer propiedades, `valueAtTime(t, false)` y leer `prop.expressionError`.

### 4.71 Capa CONTROL = panel de mando de toda la animación

- **Nulo "CONTROL …" arriba del todo** con Controles de expresión:
  - un deslizador de **historia** (DOMINIO 0–100 = cuánto ha avanzado la IA);
  - deslizadores de **momentos** (GLITCH 0–1 y TITULO 0–1);
  - **ajustes** (PULSO, ESCALA INICIAL);
  - un Control de ángulo (GIRO, en °/s).
- **Cómo se lee:**
  - En la misma comp: `thisComp.layer("CONTROL IA").effect("DOMINIO")(1)`.
  - En las precomps: `comp("LA IA DOMINARA EL MUNDO").layer("CONTROL IA").effect("DOMINIO")(1)` (el vínculo absoluto de la clase). Un deslizador mueve mapa, núcleo y atmósfera, cada uno en su comp.
- **Las keys de mando llevan curva:**
  - DOMINIO: 2 keys (2,6 → 6,0 s). Key 1 con salida al 50 %, key 2 con entrada a 60 %/s y 30 %: arranca pronto y llega al 100 % con velocidad, que es el golpe.
  - GLITCH: keys lineales en ráfagas (0 → pico en 0,04 s → 0 en 0,3 s).
- **Eventos que dependen del mando** (ciudades, elementos de la lista): el script busca con `valueAtTime` cuándo DOMINIO cruza su umbral y pone ahí el **inPoint** de la capa. Su expresión `ease(time, inPoint, …)` hace el resto.

### 4.72 Globo de puntos que "se infecta" (CC Sphere + Barrido de degradado)

- **Mapa equirectangular 4096×2048 generado en Python** (`generar_mapas.py` del proyecto) a partir de Blue Marble y Black Marble de la NASA:
  - 26 000 puntos en espiral de Fibonacci (solo tierra), dibujados como **elipses 1/cos(lat) más anchas** para que en la esfera sean redondos;
  - luces de ciudades;
  - **mapa de distancia** al origen (distancia de círculo máximo, + ruido, más rápido por tierra);
  - rutas de círculo máximo, partidas en el borde del mapa.
- **Globo:** la precomp dentro de **CC Sphere** (radio 400), dos veces:
  - **Outside** delante;
  - **Inside** detrás, al 32 % con Box Blur 2: se ven los continentes del otro lado, como un holograma.
- **Orientación:**
  - **Rotación Y = −longitud y Rotación X = −latitud** ponen ese punto de frente a la cámara.
  - Giro que arranca suave sin keys: `s = t − τ·(1 − e^(−t/τ))` y `Ry = −lon − s·GIRO`.
- **La infección son Barridos de degradado** (Gradient Wipe) que usan la capa DISTANCIA como degradado (apagada: sigue sirviendo):
  - **Lo que se va:** Completion = `D`.
  - **Lo que llega:** Completion = `100 − D` con **Invertir** activado.
  - **Frente luminoso:** banda = barrido(`100 − D`) con un mate **alfa invertido** que es el barrido(`100 − (D − 2,5)`). Sale una línea que avanza con la forma del ruido.
  - Suavidad 0,03–0,04 (por script va de 0 a 1).
- **Red:**
  - Cada ruta es una capa de forma con Recortar trazados en modo **secuencial** (Trim Type 2).
  - Su fin es `clamp(D·1,8·1,3/grados·100, 0, 100)`: la red va un 30 % por delante de la mancha.
  - En cada llegada, un punto con onda (inPoint = llegada).
- **Atmósfera:** precomp con 2 elipses (trazo fino y trazo ancho con desenfoque) en 3D y modo Añadir, del color de D (receta 4.75).
- **Cámara:** nulo que orbita en Y (−6° → 5°), la cámara hija hace el zoom (keys medidas) y la Orientación lleva `wiggle(0.5, 0.35)`.

### 4.74 Glitch digital gobernado por UN deslizador

- **Capa de ajuste "GLITCH"** (g = deslizador GLITCH, 0–1):
  - **Turbulent Displace:** tamaño 14, complejidad 1,2; cantidad `posterizeTime(15); g * random(8, 26)`; evolución `posterizeTime(15); random(0, 3600)`.
  - **S_DigitalDamage (Sapphire):** intensidad `g * 1.8`, Freeze 0, Invert 0. Hace algo de daño **siempre**, así que **la opacidad del efecto** va por expresión: `g > 0.01 ? 100 : 0`.
  - **Exposición** `g * 1.1`: el destello del golpe.
- **Palabra con glitch propio:**
  ```
  posterizeTime(12); value + [random(-40, 40) * g, random(-6, 6) * g]
  ```
- Con turbulencia 40+ el texto "se derrite". Los cortes en bloques los hace Digital Damage, no la turbulencia.

### 4.76 Sonido sincronizado con las curvas de AE (síntesis con numpy)

- **Exportar de AE** los deslizadores de mando cada 0,01 s y los inPoints de las capas que "suenan" a un JSON: script con `valueAtTime` (ver `curvas_para_sonido.json` del proyecto).
- **Sintetizar con `sfx_lib.py`** (sección 5b; ejemplo completo en `sonido.py` del proyecto). Las reglas que funcionaron:
  - **Una tecla por cada letra** que aparece, en el fotograma en que aparece (26 letras/s).
  - **Latidos** a los mismos tiempos que la expresión del latido.
  - **Cama grave** cuyo tono y brillo suben con el deslizador.
  - **Pulso que acelera:** frecuencia 2,5 → 16/s con D. Los instantes salen de la tasa acumulada.
  - **Carga** que se corta en seco 20 ms antes del golpe, y **golpe** en el instante exacto de la key.
  - **Glitch sonoro** = ruido digital × curva GLITCH, en bloques de 1/15 s como `posterizeTime(15)`.
  - **Pitidos en pentatónica**, más flojos cuando coinciden (÷√vecinos).
- **Mezcla:**
  - reverb por convolución (ruido que decae);
  - **nivelador lento**: sin él, el tramo de subida quedaba 15 dB por debajo del golpe;
  - limitador suave `tanh`; pico −1 dBFS, RMS ≈ −14 dB.
- **Revisar sin oír:**
  - `espectrograma.py` con el mapa de eventos, y el RMS por segundo.
  - En el MP4: correlación de la envolvente con el WAV. El AAC queda ~21 ms detrás (retardo normal del codificador, < 1 fotograma).
- **Meterlo en AE:** paso `06_sonido.jsx`, que busca el item por `File.displayName` y recarga el WAV si ya estaba importado.

