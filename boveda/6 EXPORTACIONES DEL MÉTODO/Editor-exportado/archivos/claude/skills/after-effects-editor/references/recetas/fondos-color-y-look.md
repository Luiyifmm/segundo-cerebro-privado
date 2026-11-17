# Recetas · Fondos, color, texturas y look

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.1 Fondo "caro" en 4 capas
- 4.6 Diapositiva de comparación "antes / después"
- 4.8 Retícula de puntos (textura "tech") sin plugins
- 4.12 Fondo sunburst (rayos) nativo
- 4.13 Pop-out para comparar
- 4.16 Cambiar el humor de una escena con UNA capa de ajuste
- 4.17 Suelo con perspectiva (baldosas)
- 4.18 Glow sin "quemar" el color
- 4.19 Rueda cromática y colores por script
- 4.20 Estilos de capa por script (falso 3D, luz de borde)
- 4.22 Pantalla o TV abombada
- 4.27 Aberración cromática (separación RGB) nativa
- 4.28 Look de película antigua / documental
- 4.29 Textura procedural fiable (corcho, piedra, papel)
- 4.37 Papel rasgado sobre madera
- 4.66 Fondo claro con retícula de puntos, degradado medido y viñeta (clase 12)
- 4.75 Mezclar dos colores con una expresión sin que salga gris (HSL)

### 4.1 Fondo "caro" en 4 capas

1. Sólido + **Gradient Ramp radial**: centro claro del color de la paleta y borde casi negro. **Ramp Scatter 10–12** para evitar bandas.
2. Sólido + **Fractal Noise** en **Luz suave** al **10–18 %**, escala grande y `evolución = time*25` (textura viva pero sutil).
3. Sólido con Ramp radial claro en **Trama (Screen)** al 20–30 % = luz que entra por una esquina.
4. **Viñeta:** sólido negro con máscara elíptica **invertida**, calado 400 px, 70–75 %.
5. Encima de todo, capa de ajuste con **Noise 2,5–3,5 %** (grano fino que une todo).

### 4.6 Diapositiva de comparación "antes / después"

- Dos precomps como miniaturas al 30 % con borde blanco (rectángulo emparentado detrás).
- Revelado: la mala baja al 27 % y 42 % de opacidad, la buena sube al 34 % y se acerca al centro. El título cambia con un fundido cruzado y un pequeño rebote.

### 4.8 Retícula de puntos (textura "tech") sin plugins

- Sólido + **Grid**: Size From = Width & Height, ancho = alto = separación (16–18), **Border = separación − tamaño del punto** (p. ej., 16−3=13), **Invert Grid ON**, Blending Mode "None".
- Capa en **Multiply** (puntos oscuros sobre claro) u **Overlay** (sobre oscuro) al 22–45 %.

### 4.12 Fondo sunburst (rayos) nativo

- Capa de forma: cuña triangular (3 puntos desde el centro, ±6°) + **Repeater** (15 copias, rotación 24°) + `rotación = time*6`. Colores: fondo y rayos del mismo tono (morado #4A18A8 / #6A2FE0) + viñeta.

### 4.13 Pop-out para comparar

- El elegido: escala 100→116→113 % (0,45 s) + un poco hacia el centro + sombra más grande. El otro: 100→90 % + Exposure −1,3.

### 4.16 Cambiar el humor de una escena con UNA capa de ajuste

- Positiva: Exposure +0,45 · Hue/Saturation (saturación maestra) +22.
- Negativa: Hue/Saturation −65 · Exposure −1,1 · Tint (negro→#0A1020, blanco→#B8C6E0) al 35 %.

### 4.17 Suelo con perspectiva (baldosas)

- Sólido + Ramp (oscuro lejos → claro cerca) + **Grid** (Blending Mode "Normal", líneas oscuras) + **Corner Pin** al trapecio del suelo (arriba estrecho, abajo más ancho que el cuadro). Niebla lejana: Ramp en Trama arriba.

### 4.18 Glow sin "quemar" el color

- Umbral ≈170, radio 40, intensidad 0,4–0,5, colores A&B del mismo tono. Intensidades altas vuelven blanco o amarillo lo que es naranja o violeta.

### 4.19 Rueda cromática y colores por script

- `hsl(h,s,l)`, `mix(a,b,t)`, `toHex(c)`, `wheel(comp,nombre,R,pos,sel)` (12 tonos × 4 anillos; `sel(i)` decide qué cuñas van en color) y `wedgeOutline()` (selector) en `ae_lib.jsx`.

### 4.20 Estilos de capa por script (falso 3D, luz de borde)

- `layerStyle(capa, "inner"|"drop"|"innerGlow"|"outerGlow"|"bevel"|"satin"|"colorOverlay"|"gradOverlay"|"stroke", {opacity, distance, blur, angle, color, …})`. Internamente: capa seleccionada + comp en el visor + `app.executeCommand(9000…9008)`.
- Receta de **falso 3D** para tarjetas y avatares: Inner Shadow (negro-azulado, dist. 12, tamaño 22, 55 %, 90°) + Inner Glow blanco (tamaño 26, 45 %) + Drop Shadow (dist. 16, tamaño 30, 60 %, 120°).

### 4.22 Pantalla o TV abombada

- Capa de ajuste: **Optics Compensation** FOV 30–45 + **Reverse Lens Distortion ON** + líneas de TV (sólido negro + **Venetian Blinds** dirección 90°, ancho 6, 55 %, en Multiplicar al 35 %) + viñeta + grano. Las capas de fondo, más grandes que el cuadro.

### 4.27 Aberración cromática (separación RGB) nativa

- Sólido negro abajo + 3 copias de la escena (precomp) con **Shift Channels**: R (Red=2, Green=10, Blue=10), G (10, 3, 10), B (10, 10, 4). **10 = Full Off.** Modo **Añadir**, desplazadas −3/0/+3 px, escala 100,4 %.

### 4.28 Look de película antigua / documental

- Polvo y rayas: textura (Texturelabs Film 185) en **Trama** al 25–30 % con `posterizeTime(12); value + [random(-40,40), random(-30,30)]`.
- Parpadeo: sólido negro con opacidad `posterizeTime(15); random(0,7)`.
- Grano 5–6 %, viñeta 85–90 %, desaturar 25–30 %, Tint 10–20 % (negro→azul muy oscuro, blanco→crema).

### 4.29 Textura procedural fiable (corcho, piedra, papel)

- Fractal Noise con su modo de fusión en **None** + **Tint** (negro→oscuro del material, blanco→claro del material) + Noise 10–15 %. (El modo de fusión interno de Fractal Noise por script no es fiable.)

### 4.37 Papel rasgado sobre madera

- Madera: Texturelabs Wood 227 al 52 % + brillo −12 + luz cálida (sólido con Ramp radial en Luz suave al 70 %).
- Papel: Texturelabs Paper 312 con:
  - máscara de 36 vértices con desplazamientos irregulares;
  - **Roughen Edges** (Border 16, Sharpness 2,5, Scale 22);
  - Tint (negro → #4A2A12, blanco → #F4E0BA, al 60 %) y sombra suave.
- Texto a mano: Segoe Script Bold granate (#6E1E14) que se escribe (animador de opacidad, Start 0 → 100 % en 2,8 s) + Roughen Edges suave (tinta).
- Polaroids: marco crema + foto cálida (Ramp radial naranja → marrón + bokeh en Añadir + vela). Lápiz con formas.
- Cámara: zoom out 132 → 110 % (¡no a 100 %: con el giro y el wiggle se verían los bordes!) + giro −8° → −2° + wiggle.

### 4.66 Fondo claro con retícula de puntos, degradado medido y viñeta (clase 12)

- **Degradado de 4 colores** en un sólido blanco + **puntos:** sólido negro con 2 Venetian Blinds (80 %, direcciones 0° y 90°, ancho = separación de los puntos; 31 px en 4K) al 30 %.
- **Viñeta:** capa de ajuste 2D con **CC Vignette 200** (ángulo 45) **justo encima del fondo**. Así solo oscurece el fondo y no el panel ("más contraste").
- **Fondo 3D más grande que el cuadro** (5760×3240 para una cámara que se aleja al 72 %).
  - En la clase se rellena con CC RepeTile + CC Composite, pero con un degradado **se ve la costura** (un rectángulo).
- **Ajustar el degradado a una referencia:**
  - modelo exacto de AE: w = 1/(d² + fusión²)^1,1 (sección 5);
  - `degradado4_modelo.py` busca los 4 puntos, los grises y la fusión;
  - aquí el error quedó en 4,9 niveles, contando tres momentos del vídeo.
  - La luz que "necesita" el fondo es la medida ÷ el factor de la viñeta (tabla en la sección 5).

### 4.75 Mezclar dos colores con una expresión sin que salga gris (HSL)

- `linear(D, 0, 100, cian, rojo)` mezcla en **RGB**: al 50 % salió **gris-malva** (175, 131, 158).
- **Mezclar en HSL:**
  ```
  var a = rgbToHsl(c1), b = rgbToHsl(c2); hslToRgb(linear(D, 0, 100, a, b))
  ```
  Cian (tono 0,536) → rojo (0,985) pasa por azul y violeta, siempre saturado.
- **Para ir por el otro lado del círculo** (por verde y amarillo): sumar o restar 1 al tono de uno de los dos colores.

