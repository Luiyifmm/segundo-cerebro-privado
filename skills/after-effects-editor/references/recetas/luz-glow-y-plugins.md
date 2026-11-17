# Recetas · Luz, brillo (glow) y plugins de pago

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.2 Líneas de energía (conectar A con B)
- 4.3 Bokeh / partículas con profundidad
- 4.39 Deep Glow 2 (plugin de pago, instalado) — valores probados
- 4.40 Shadow Studio 3 (plugin de pago) — sombra larga que se difumina
- 4.41 Crate's Godrays y Sapphire (plugins de pago) — recetas rápidas
- 4.42 Optical Flares (plugin de pago, licenciado) — destello de sol realista
- 4.45 Luz que recorre el borde de un panel
- 4.46 Halo de luz detrás de un panel o botón (la luz "derramada")
- 4.47 Destello de transición (Deep Glow Transition)
- 4.61 Cortocircuito (parpadeo, arcos, chispas y muerte de una luz)
- 4.62 La pantalla se apaga como un televisor viejo
- 4.65 Panel UI oscuro con borde de luz "premium" (clase 12, "Mira cómo edito")

### 4.2 Líneas de energía (conectar A con B)

- Capa de forma con trazado Bézier + **Trim Paths End 0→100** (se dibujan).
- Trazo 5–6 px color crema/blanco, **Taper** (afinado) inicio 35 % y fin 45 % (anchos 0).
- **Doble Glow:** uno corto (radio 14, intensidad 1,4) y otro ancho (radio 60, intensidad 0,6). Imita a Deep Glow. En el PC del autor se puede usar **Deep Glow 2 directamente** (receta 4.39).

### 4.3 Bokeh / partículas con profundidad

> ⚠️ **Corregido el 02/10/2026 por la regla 1 del usuario:** antes esta receta hacía 25–35 círculos sueltos, una capa por partícula. Eso pesa y no se hace: **las partículas van con UN efecto**.
- **Con un efecto, en una sola capa** (sólido del tamaño de la comp):
  - **CC Particle World** (`CC Particle World`, 3D: usa la cámara de la comp en *Extras → Effect Camera*);
  - **CC Particle Systems II** (2D, más simple);
  - o Sapphire **S_Dust / S_Sparkles** (polvo y destellos ya bonitos).
- **Polvo a la deriva:**
  - nacimiento bajo (Birth Rate 0,2–0,5) y vida larga (5–8 s);
  - productor ancho (Radius X/Y/Z grandes, que cubran el cuadro), velocidad casi 0 y gravedad 0;
  - partícula *Faded Sphere* o *Lens*, tamaños pequeños y distintos, opacidad 20–70 %.
  - **Valores sin probar todavía:** ajustarlos mirando con `ae_save_frame`.
- **Desenfoque del bokeh:** Camera Lens Blur o Gaussian Blur en esa capa (con "Repetir píxeles de borde" apagado, o salen cuadrados), o el desenfoque de la cámara si las partículas son 3D.
- **A mano solo para muy pocos discos grandes** (≤ 6–8) delante de la cámara, cuando su sitio exacto importa para la composición: círculo, desenfoque ≈ 0,9 × tamaño, `wiggle(0.25, 10+tamaño*2)` y parpadeo `value*(0.65+0.35*Math.sin(time*f+fase))`. Con un Repeater si son iguales.

### 4.39 Deep Glow 2 (plugin de pago, instalado) — valores probados

- Aplicarlo en una **capa de ajuste** encima del contenido (el texto o la línea debajo; los rótulos que no deben brillar, encima).
- **Threshold `PEDG2-0020` va en % (0–500) y Threshold Smooth `PEDG2-0021` en % (0–100).** "79 %" en la interfaz = **79** por script (corregido en la clase 12: la nota vieja decía 0,3, que es casi sin umbral).
  - **Umbral 79 / suavizado 80** (clase 12): solo brilla lo más blanco. Es el truco del borde que brilla "solo en ciertos puntos" (receta 4.65).
  - Sin umbral (0) brilla también lo oscuro y todo se lava.
- **Sutil y realista:** Radius `PEDG2-0017` = 300 + Exposure `PEDG2-0018` = 0,7.
- **Tinte (corregido en la Tanda 02, probado con render):**
  - El interruptor es **Tint Mode `PEDG2-0043`**: 1 = sin tinte, **2 = Monocolor** (el del tutorial de Glass Health), 4 = dos colores.
  - `PEDG2-0041` ("Enable") **no** activa el tinte.
  - Monocolor: Color `PEDG2-0042` = color de marca. Tint Blend Mode `PEDG2-0067`: 1 = Multiply (más saturado), 2 = más claro.
  - **Núcleo blanco y halo del color:** queda como una luz real (receta 4.46).
  - **Dos colores (modo 4):** Color Outer `-0066` sale **pegado al objeto** y Color `-0042` en el halo lejano (al revés de lo que dice su nombre). Radius 700, Exposure 0,6.
- **Anamórfico (destello horizontal de cine):** Aspect Ratio `PEDG2-0031` = 2 (rango 0–2; valores < 1 lo estiran en vertical) + Enable Glow Aberration `PEDG2-1036` = 1.
- Frente al Glow nativo ×2: más "físico". El núcleo aguanta el color y el halo es amplio y suave. El nativo es más duro y cercano. El profe lo llama "el mejor efecto".

### 4.40 Shadow Studio 3 (plugin de pago) — sombra larga que se difumina

- Aplicarlo a la **precomp del elemento** (tarjeta, número, iconos), no a cada capa.
- **Valores:**
  - longitud `PESS3-0004` = 380;
  - opacidad inicio `PESS3-0086` = 55 → fin `PESS3-0087` = 0;
  - suavidad inicio `PESS3-0008` = 4 → fin `PESS3-0009` = 70 (nítida junto al objeto y difusa lejos, como una sombra real);
  - color `PESS3-0006` = oscuro del tono de la escena (violeta #2A1460, no negro).
- **Dirección de la luz `PESS3-0002` animada lentamente** (118° → 152° en 6 s): la sombra "respira", y es movimiento constante gratis.
- Es la sombra de los números e iconos de su clase de Profundidad. El Drop Shadow nativo solo da una sombra corta y uniforme.

### 4.41 Crate's Godrays y Sapphire (plugins de pago) — recetas rápidas

- **Godrays:** en una capa de ajuste sobre un texto claro:
  - Length `PEGR-0008` = 1400, Amount `PEGR-0009` = 28, Exposure `PEGR-0011` = 2,2;
  - origen `PEGR-0002` animado con un seno (los rayos se mueven).
- **Sapphire, siempre en capa de ajuste:**
  - **S_FilmEffect** (película antigua): Grain Amp `-0069` = 2,2, Glow Brightness `-0063` = 0,35, Vignette Darkness `-0100` = 0,7. Sustituye a la receta 4.28.
  - **S_Shake** (temblor en impactos): Amplitude `-0050` en keys 0,05 → 0,8 (en el golpe) → 0,08; Frequency `-0051` = 9; Motion Blur `-0054` = 1.
  - **S_DistortRGB** es una deformación por ruido, **no** un simple desplazamiento RGB: Amount `-0050` entre 0,02 y 0,12 (≥ 0,4 destroza el texto) y Blur Lens `-0051` = 500 para que sea suave.

### 4.42 Optical Flares (plugin de pago, licenciado) — destello de sol realista

- Montaje: sólido negro del tamaño de la comp en modo **Añadir** (o Trama) + Optical Flares (Render Mode "on black").
- **Parámetros:**
  - Position XY `-0001`: animada con un seno lento, así el sol nunca está quieto;
  - Center Position `-0002`: el centro de la imagen, que es por donde se alinean los reflejos;
  - Brightness `-0003` = 145; Scale `-0004` = 85;
  - Color `-0006` cálido (#FFD9A8);
  - Animation Evolution `-0073` = `time*12`;
  - Flicker Speed `-0051` = 1,5 y Amount `-0052` = 8.
- Con un fondo cálido (cielo con Tint: negro → #1A1440, blanco → #FFB070, al 85 %) queda un atardecer creíble.
- El Lens Flare nativo da los "aros de colores" anticuados. Usarlo solo si hace falta que el proyecto abra en cualquier PC.
- El **preset** (el tipo de destello) se elige en su ventana Options, a mano. Por script solo se tocan los parámetros.

### 4.45 Luz que recorre el borde de un panel

1. Duplicar la capa del panel y llamarla "borde" (etiqueta azul = luces y decoración).
2. Sin relleno, trazo blanco con puntas y uniones redondas.
3. **Trim Paths:** End animado con 1 s de desfase respecto a Start (o un tramo fijo) y **Offset animado** (recorre el borde).
4. Deep Glow tintado encima.
- Si el glow sale cortado por la precomp, agrandar la precomp (mejor que el rasterizado continuo).

### 4.46 Halo de luz detrás de un panel o botón (la luz "derramada")

- Copia **rellena** del panel (#2F45D6–#3A50E0), escondida **detrás**, con Deep Glow de radio 900–1200 y exposición 0,5–1,1.
- El panel opaco encima tapa la copia y solo se ve el halo que sale por los bordes.
- Queda mucho más natural que poner glow al trazo (que da "neón").
- Para el "aire" azul general: una elipse muy desenfocada (desenfoque 320) al 30–45 %, emparentada con la cámara.

### 4.47 Destello de transición (Deep Glow Transition)

- En la capa que se va: **Exposure del Deep Glow** 0,12 → 1,2 en 5 F, acelerando (las últimas keys, más separadas en valor).
- **Cambio de contenido en el pico.** El elemento nuevo:
  - empieza con exposición 3,0 → 0,3 en 5 F;
  - entra **desenfocado** (10 → 0 px en 3 F);
  - lleva un **velo claro** (#C8CCEC al 38 → 0 %).
- Tinte del destello: blanco → lavanda (keys en el color del tinte).
- **No usar una capa de ajuste encima de todo:** también iluminaría el fondo y las ondas. En el original solo brillan los elementos de la interfaz.
- **Destello por palabra** (títulos), versión **medida** (la v1, con exposición 1,0–3,0 y desenfoque 14, quemaba la palabra y parecía una explosión):
  - la palabra aparece **de golpe** (opacidad 0 → 100 en 1 F);
  - detrás, una **luz grande y suave**: elipse ~900×300 #C8D0FF, Box Blur 110, opacidad 34 → 14 → 4 → 0 %, un fotograma cada valor. En el original la zona sube ~34 niveles el primer fotograma, ~13 el segundo y ~3 el tercero;
  - en la palabra: Deep Glow radio 300, exposición 1,1 → 0,4 → 0,1 → 0 en 6 F y **Mix → 0 en reposo**;
  - desenfoque horizontal de 6 → 2 → 0 px (Box Blur, solo horizontal).

### 4.61 Cortocircuito (parpadeo, arcos, chispas y muerte de una luz)

- **Un solo deslizador POWER** (1 = encendido) que leen la lámpara, los cristales, los haces, las luces y el brillo.
  - Claves HOLD en 3 ataques cada vez más fuertes (0,3 s, 0,6 s y 0,5 s, separados ~0,7 s).
  - Sobrecarga de 1,4 durante 2 fotogramas y caída lineal a 0 en 0,3 s.
  - Zumbido durante la avería: `value * (1 + 0.07*noise(time*45))`.
- **ARCO y CHISPAS** (0/1 en HOLD) en el mismo nulo. La composición final los lee con `comp("…").layer("CONTROL").effect("ARCO")(1)`.
- **Arcos:** Advanced Lightning (`ADBE Lightning 2`):
  - tipo 2 (Strike), desde la lámpara en pantalla (`toComp`) hasta 2 nulos en el marco de la linterna;
  - Conductivity State = `Math.floor(time*30)*7`, núcleo de 1,4 px, brillo de 22 px #78B4FF;
  - modo Añadir, sin "Composite on Original".
- **Chispas:** CC Particle Systems II (Explosive), POCAS: Birth Rate = CHISPAS × 1,3, Longevity 0,55, Velocity 0,8, Gravity 1,3, Resistance 1,6, tamaño 0,03 → 0,008, color #FFF4C8 → #FF6A10.
  - Con Birth Rate 26 salió una explosión blanca.
- **Muerte:** el filamento se queda naranja (#FF7A1A, Añadir) y baja de 100 a 0 en 1,8 s; sale humo lento; el haz frena y se para en 2 s.
- **Sacudida en el golpe:** `wiggle(20, 14*s)` en la posición de la cámara, con s de 1 a 0 en 0,65 s.
- **"Glow dosificado" también aquí:** en la sobrecarga el brillo general sube solo +0,27 (0,25 → 0,52).

### 4.62 La pantalla se apaga como un televisor viejo

- Escala de la escena: 100 → [104, 0,9] en 0,12 s (suavizado de entrada 85 %) → [0,4; 0,9] en 0,12 s.
- Exposure (`ADBE Exposure2-0003`) de 0 a +3 durante el aplastamiento.
- Línea blanca de 1920×5 que se encoge con la imagen y un punto de 14 px que se apaga en 0,3 s. Todo por debajo del Deep Glow.
- **Sólido negro debajo de todo:** si no, la zona aplastada queda transparente.

### 4.65 Panel UI oscuro con borde de luz "premium" (clase 12, "Mira cómo edito")

- **Capas (comp del panel, 4K):**
  1. **Base:** rectángulo redondeado casi negro (#2C2C2C, radio 113 en 2802×761) + **Degradado de 4 colores oscuro y cálido** (una esquina #3A342B, la opuesta #060504; fusión 408) + **Shadow Studio 3** (135°, largo 400, 66 % → 0 %).
  2. **Trazo:** duplicado sin relleno, **trazo de 2 px** (en 4K) en un color muy oscuro (#1E1405). "Cuanto más fino, más premium."
  3. En el trazo:
     - **CC Light Sweep** (una franja de luz);
     - un segundo Light Sweep más ancho y con poco borde ("contrapuesto");
     - **Deep Glow 2:** radio 752, exposición 0,87, **umbral 79 %, suavizado 80 %**, tinte monocolor cálido (#FF9E4C al 80 %).
- **Geometría de CC Light Sweep (medida):**
  - **Direction** es el ángulo desde la vertical: + = "/", − = "\".
  - **Width W:** la luz cae a la mitad a ±0,58·W y se apaga a ±1,86·W.
  - **Shape:** 3 = Sharp (pico), 2 = Smooth (franja ancha y pareja).
  - Center = un punto de la línea.
  - Para poner el brillo donde se quiere: calcular dónde corta la línea el borde de arriba (x = cx + 380·tan(dir) en un panel de 760 de alto).
- **Una franja ilumina SIEMPRE dos cruces** (arriba y abajo) con la misma fuerza; la luz de borde (Edge) no tiene dirección.
  - Si el de abajo debe ser más suave: **máscara rectangular en el trazo** que acaba un poco por debajo del panel, con calado vertical grande (bajo 1620, calado [0, 400]).
  - El Degradado de 4 colores en modo Multiplicar no sirve: mezcla demasiado y apaga también el brillo de arriba.
- **Luz que se mueve con la cámara:** 2 claves en el Center del Light Sweep (+500 px en X) con la misma curva que la bajada de cámara. El reflejo "resbala" por el canto como un especular de verdad.
- **Pastillas (días) con el mismo truco:** relleno #25231F + trazo con 1 Light Sweep (ancho 80, borde 90) y Deep Glow suave (0,1). Texto **Nexa Heavy** con Deep Glow 250 / 0,12.
- ⛔ **Render a media resolución:** el trazo de 2 px queda en 1 px y no pasa el umbral, así que el borde casi no brilla. **Render completo** (4K) y bajar a 1080p con ffmpeg.

