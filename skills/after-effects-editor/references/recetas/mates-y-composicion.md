# Recetas · Mates y composición

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.80 Reflejo en el suelo sin plugins (el VC Reflect de la clase, nativo)
- 4.88 Mates: qué tipo usar y para qué (Tanda 03 · 04 "Why YOU Need Mattes")
- 4.89 Texto como ventana: "Stranger Things" y al revés (Tanda 03 · 04)
- 4.90 Revelado con tinta sin vídeo de stock (Tanda 03 · 04)
- 4.91 Mates de "detalle": brillo que recorre un texto, texto que sale de detrás de una línea y Set Matte (Tanda 03 · 04)

### 4.80 Reflejo en el suelo sin plugins (el VC Reflect de la clase, nativo)

- **Montaje:** la misma precomp otra vez, **debajo**:
  - ancla en la línea del suelo;
  - posición = `thisComp.layer("PALABRA").toComp([x, ySuelo])`;
  - escala = `[s[0], -s[1]]` de la palabra: espejo con el mismo zoom.
- **Caída:** mate de **luminancia** con un sólido que lleva Gradient Ramp lineal, blanco en el suelo y negro 700 px más abajo; sus puntos, por expresión (siguen el zoom).
  - La capa mate puede estar apagada.
- **Valores del original:** opacidad 13,2 % y Box Blur 1,5 (sin inclinación).
- **VC Reflect** (Video Copilot, gratis) no está instalado. Sus valores de la clase: suelo 540, 1053,7; Distance 56 %; Falloff 0,48; Skew 3; Opacity 25 %; blur Directional 0,4 / 17,4 / 0,5.
- **Truco de la clase:** el fondo **fuera** de la precomp que se refleja, o se refleja también.

### 4.88 Mates: qué tipo usar y para qué (Tanda 03 · 04 "Why YOU Need Mattes")

Un mate esconde parte de una capa usando OTRA capa.
| Tipo | Qué mira del mate | Se ve la escena… | Para qué |
|---|---|---|---|
| **Alfa** | la transparencia | donde el mate es opaco | ventanas con forma: PNG recortado, texto, formas |
| **Alfa invertido** | la transparencia | donde el mate es transparente | agujeros, "recortar" una forma de la escena |
| **Luma** | el brillo | donde el mate es claro | texturas (pared, papel, ruido), transiciones con degradado |
| **Luma invertida** | el brillo | donde el mate es oscuro | **revelado con tinta** o humo (tinta negra sobre blanco) |
- **Por script:** `escena.setTrackMatte(mate, TrackMatteType.ALPHA | ALPHA_INVERTED | LUMA | LUMA_INVERTED)` y `mate.enabled = false` (AE lo apaga al hacerlo a mano).
  - En AE 2023+ el mate no tiene que estar justo encima, pero ponerlo encima ordena la línea de tiempo (`mate.moveBefore(escena)`).
- **Controlar cuánto revela un mate de luma:** el brillo del MATE (Curvas en la clase; Brillo y contraste por script, animable).
- **La escena pegada al recorte:** emparentar la escena al mate (`escena.parent = mate`).
- **Solo UN mate de pista por capa:** para dos formas, las dos juntas en una precomp que hace de mate; o escena + mate en una precomp y otro mate encima.
- **El mate tiene que LEERSE:** forma y contenido distintos. Cielo dentro de una nube parece solo una nube; cielo dentro de una mariposa sí se entiende.
- **Miniatura del mate** en una esquina (panel gris + la capa del mate a escala): para ENSEÑAR qué hay dentro (`miniMate()` de `mates_lib.jsx`).

### 4.89 Texto como ventana: "Stranger Things" y al revés (Tanda 03 · 04)

- **Entrar en la escena por una letra:**
  - texto como mate de alfa;
  - ancla dentro del palo de una letra;
  - escala de 100 % a 4000 % con curva de salida (arranca lento y acaba disparada).
  - **Final robusto:** el plano completo entra con un fundido de 10–12 fotogramas al acabar el zoom. Así llena el cuadro aunque el palo no lo cubra justo (medir la letra al píxel no merece la pena).
- **Al revés (la escena se encoge dentro de las letras):**
  - dos copias de la escena: una completa que se funde (14 fotogramas) y otra con el texto como mate;
  - el texto baja de 420 % a 100 %: entra con velocidad (−600 %/s) y frena con influencia 100 %;
  - **el fundido del plano completo tiene que ir ANTES** del encogimiento, o no se ve cómo se encoge.

### 4.90 Revelado con tinta sin vídeo de stock (Tanda 03 · 04)

- **Precomp "Tinta":** sólido blanco + 5 manchas negras (elipses) repartidas, cada una con un retraso (0–32 fotogramas).
  - Escala 0 → 520–640 % con salida rápida (260–700 %/s, 30 %) y llegada larga (65–70 %): se "abre" y se frena.
- **Encima, una capa de ajuste:**
  - Turbulent Displace (cantidad 120–140, tamaño 110–120, complejidad 4, evolución `time*30`);
  - un segundo Turbulent Displace fino (40 / 22 / 3);
  - Box Blur 4–5 con "repetir bordes".
- **En la escena:** esa precomp como mate de **luma invertida**. Fondo de papel (Texturelabs Paper 312) debajo.
- **Entrada rápida** (1,5 s): las manchas llegan a 640 % en unos 46 fotogramas.

### 4.91 Mates de "detalle": brillo que recorre un texto, texto que sale de detrás de una línea y Set Matte (Tanda 03 · 04)

- **Brillo que recorre la palabra:**
  - una barra blanca (150 × 1400, girada 18°, Box Blur 40, modo Añadir, 75 %) que cruza en 36 fotogramas;
  - su mate es una **COPIA** del texto (`texto.duplicate()`), porque cada capa solo puede ser mate de una;
  - **in/out de la barra solo durante el barrido**: si el texto está escalado antes, la barra se ve dentro de un trozo de letra.
- **Texto que sube desde detrás de una línea:**
  - el texto se mueve (de +40 px bajo la línea a su sitio, llegada al 90 %);
  - su mate es un **rectángulo fijo** encima de la línea (alfa);
  - una línea fina que se dibuja desde el centro (Trim Paths Start 50→0 y End 50→100) hace de "borde".
- **Establecer mate (Set Matte, `ADBE Set Matte3`)**, por índices:
  - 1 capa (`setValue(capa.index)`; AE guarda la capa, no el número);
  - 2 canal (4 = alfa, 5 = luminancia);
  - 3 invertir;
  - 4 *Stretch Matte to Fit* (**0**: si no, estira el mate);
  - 5 componer con el original;
  - 6 premultiplicar.
  - El mate puede estar debajo y visible. Con *Invertir*, la escena deja ver el propio mate.
  - Si el mate es una precomp: **contraer transformaciones** (`capa.collapseTransformation = true`) en las dos capas.
- **Textos sobre una escena clara:** franjas negras al 55 % arriba (150 px) y abajo (170 px) detrás de los textos (`barrasTexto()`), o etiquetas con fondo redondeado negro al 62 % (`etiqueta()`).

