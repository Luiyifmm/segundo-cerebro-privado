# Recetas · Cámaras y 3D (rigs, motores, mallas, escenas)

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.4 Modelos 3D nativos (sin plugins)
- 4.7 Cámara 2D con nulo que re-equilibra (clase 02)
- 4.21 Cámara 3D: gran angular + profundidad de campo
- 4.30 Libro o cuaderno que se abre (3D nativo)
- 4.32 Rig de cámara 3D "un nulo = un movimiento" (clase 11)
- 4.33 "Motion blur" falso con el motor `ADBE Calder` (Advanced 3D, AE 2026)
- 4.34 Cámara 2D con nulo FOCO + zoom out sutil por elemento
- 4.56 Escena 3D "real" con planos texturizados (proyecto propio del faro, 30/09/2026)
- 4.57 Cilindro de tiras (faro, torre, columna, depósito)
- 4.58 Carteles que miran a la cámara (billboards)
- 4.59 Profundidad de campo que se lee (y no mata el render)
- 4.60 Haz de faro volumétrico que barre la escena
- 4.63 Reflejo de la luna en el agua
- 4.68 Cámara de presentación: zoom rápido + bajada que revela (clase 12)
- 4.106 Movimiento de cámara A → B con un nulo, diseñando primero el plano final (Tanda 04 · 01)
- 4.107 La cámara en pisos: un movimiento por nulo, solapados, con alabeo, revelado desde muy cerca y desenfoque a mano (Tanda 04 · 02)
- 4.108 Pieza explicativa con cámara: un nulo por movimiento, colas que no paran, cortes en el pico y montaje por motores (Tanda 04 · 04)
- 4.109 Escena 2.5D que llama la atención: imágenes preparadas, capas en Z, un punto de interés y dos nulos solapados (Tanda 04 · 03)
- 4.110 Cámara que viaja de escena en escena sin parar: un nodo, cadena de nulos, "Center In View" y corte en el pico (Tanda 04 · 05)
- 4.111 Novedades de AE 2026 por script: mallas, sombras de luces y desenfoque en Advanced 3D, y fuentes variables (Tanda 05 · 01)

### 4.4 Modelos 3D nativos (sin plugins)

- AE 2026 importa **.glb / .gltf / .obj** como capa de modelo 3D. Se necesita la comp con el motor **Advanced 3D**, que por script es **`comp.renderer = "ADBE Calder"`**.
  - ⚠️ `"ADBE Advanced 3d"` es el **Classic 3D**: con él, y con Cinema 4D, el modelo **no se ve**.
  - Probado el 01/10/2026 con el cerebro: 120 872 píxeles visibles con Calder y 0 con los otros dos. Antes aquí ponía el nombre equivocado.
- Meterlo en una **precomp propia** (solo el modelo) y usar esa precomp en la escena 2D: aísla el renderizador y se reutiliza.
- La escala de las capas de modelo va en factor (1 = tamaño original), no en %.
- Da vida con rotación de vaivén: `90 + 14*Math.sin(time*0.9)`.
- Modelos: **Sketchfab con filtro de licencia CC BY + descargable**. Formato **glb original**. Guardar siempre el crédito (CC BY lo exige).

### 4.7 Cámara 2D con nulo que re-equilibra (clase 02)

- Todo el contenido se empareja a un nulo (ancla en su centro y posición 960,540). Posición local de cada hijo: `(x−960+ancla_x, y−540+ancla_y)`.
- Para centrar un grupo que en escena va de `y_min` a `y_max` con escala `s`: **posición_y del nulo = 540 − ((y_min+y_max)/2 − 540)·s** (igual en X).
- Se anima el nulo **a la vez** que entra el elemento nuevo: 1–1,2 s, con suavizado 80–85 %. Después, empuje lento de 100→102 % para que nunca pare.

### 4.21 Cámara 3D: gran angular + profundidad de campo

- Cámara de 2 nodos (punto de interés en el sujeto). **zoom = ancho × mm / 36** (1920: 50 mm = 2667, 24 mm = 1280, 17 mm = 907). Para cambiar de lente sin cambiar el tamaño del sujeto: posición Z = −zoom.
- DOF: Depth of Field ON, `focusDistance = length(transform.position, transform.pointOfInterest)`, apertura 90–160, Blur Level 100.
  - **Motor `"ADBE Calder"` (Advanced 3D): desenfoca fuerte**, pero oculta *Blur Level* y el iris.
  - Con `"ADBE Advanced 3d"` (Classic 3D), con la misma apertura, el desenfoque es mucho más suave.
  - Probado el 01/10/2026. Antes aquí ponía "usar Classic 3D": el nombre estaba cambiado.
- Capas 3D delante (z negativa, cerca de los bordes) y detrás (z +500…+2000) con wiggle = profundidad inmediata.

### 4.30 Libro o cuaderno que se abre (3D nativo)

- Tapa (precomp) 3D con **ancla en el borde izquierdo** `[0, alto/2]` y posición = borde izquierdo de la página; **Rotate Y 0→−178°** en 0,8 s (suavizado 80/55).
- **Interior liso:** sólido del color del cartón emparentado a la tapa, a `[ancho/2, alto/2, +1]` en local (aparece solo al girar).
- Página debajo (misma medida) con renglones (Grid) y margen rojo. La cámara se acerca a la página mientras el texto se "escribe" en escalera.

### 4.32 Rig de cámara 3D "un nulo = un movimiento" (clase 11)

- Cadena: NULO X (derecha) → NULO Z (atrás) → NULO Z (adelante) → NULO Y (arriba) → NULO Z (final) → **WIGGLE** → Cámara.
  - Todos los nulos son 3D, con ancla `[50,50,0]`; los hijos van en local `[50,50,0]` + desplazamiento.
  - La cámara es de 1 nodo (`autoOrient = NO_AUTO_ORIENT`) en local `[50, 50, −zoom]`.
- Cada nulo lleva 2 keyframes (suavizado 85 %) y **se solapan** en el tiempo. Re-timear = mover 2 keyframes.
- **Alabeo:** girar en Z el nulo WIGGLE (la cámara está en su eje óptico). WIGGLE: posición `wiggle(0.5,12)` + rotación X/Y/Z `wiggle(0.4–0.55, 0.35–0.7)`.
- Enfoque que cambia: nulo FOCO + `dot(sub(p, cp), normalize(toWorldVec([0,0,1])))` en Focus Distance. Apertura 25 (discreta).
- Desglose didáctico: línea de tiempo con una barra por nulo que se ilumina cuando actúa + `Source Text` con los nulos activos.

### 4.33 "Motion blur" falso con el motor `ADBE Calder` (Advanced 3D, AE 2026)

- Solo hace falta con `"ADBE Calder"`, que no acepta el motion blur de las capas 3D. Con `"ADBE Advanced 3d"` (Classic 3D) el de verdad funciona (receta 4.106).
- Directional Blur por capa (en precomps, footage o sólidos) con:
  - `var c0 = toComp(anchorPoint), c1 = toComp(anchorPoint, time - thisComp.frameDuration*0.5); var v = fromComp(c1) - fromComp(c0);`
  - Direction: `radiansToDegrees(Math.atan2(v[0], -v[1]))`.
  - Blur Length: `Math.min(150, length(v))`.
- Se aplica solo a lo que pasa rápido cerca de la cámara (cintas, nubes cercanas, texto que cruza, personaje que entra).

### 4.34 Cámara 2D con nulo FOCO + zoom out sutil por elemento

- Nulo FOCO (a dónde mira la cámara) con keyframes por escena. Posición del nulo cámara:
  - `[960 − (f[0]−960)·s + noise(t·0.5)·5, 540 − (f[1]−540)·s + noise(t·0.5+40)·5]`, con `s = escala/100`.
  - Así el zoom no descuadra.
- Escala: bajar un 3–5 % en cada aparición y reiniciar en cada cambio de escena (debajo de un desenfoque 0 → 45 → 0 en una capa de ajuste con "repetir píxeles de borde" activado).
- Escenas colocadas como maqueta vertical (1160 px entre escenas).

### 4.56 Escena 3D "real" con planos texturizados (proyecto propio del faro, 30/09/2026)

- **Motor `ADBE Calder`**: es donde la profundidad de campo desenfoca de verdad en todas las capas.
  - Es el **Advanced 3D**. Aquí ponía "Classic 3D": el nombre estaba cambiado (prueba del 01/10/2026).
- **Escala:** 1 px de textura = 1 px de mundo. Una planta ≈ 230 px ≈ 3 m.
  - Las texturas se generan con Python (ruido fractal, ventanas, grietas, óxido, musgo) a la medida exacta de cada cara.
  - Las medidas van en un `escena.json` que leen Python y AE.
- **Sentido de giro medido en AE 26.5:**
  - con 30° en Y, el borde derecho de una capa va a (43,3; 0; −25): x̂ → (cos φ, 0, −sen φ);
  - con 30° en X, el borde de abajo va a (0; 43,3; 25).
  - La normal (la cara que mira a la cámara por defecto) girada φ en Y = (−sen φ, 0, −cos φ).
- **Edificio = caja de 3 caras:**
  - fachada a la calle con giro Y = −90 (izquierda, mira a +X) o +90 (derecha);
  - frente que mira a la cámara (sin giro);
  - techo con X = −90, 100 px por debajo del borde roto.
- **Suelo:** X = −90, para que la fila 0 de la textura quede al fondo.
- **Luces:** ambiente 32 % (#6E88AA) + luna paralela 85 % (#C3D5F0). Las fachadas de un lado quedan iluminadas y las del otro en sombra, como de verdad.
- **Agua y cielo SIN luces:** la textura ya lleva su luz. El agua que recibe luces queda negra.
- **Profundidad:** niebla en carteles (modo Trama, 13–18 %) que se desvanece al acercarse (`linear(distancia, 500, 1500, 0, 1)`), polvo 3D (que la profundidad de campo convierte en bokeh; ⚠️ hacerlo con UN efecto de partículas, CC Particle World con la cámara de la comp, no con capas sueltas: regla 1, receta 4.3), cables con caída (Bézier con controles que bajan 4/3 de la caída) y escombros.

### 4.57 Cilindro de tiras (faro, torre, columna, depósito)

- **Montaje:** N tiras con su centro en la apotema r·cos(π/N) y giro Y = −θ, con θ = (i + 0,5)·360/N − 180. La tira 0 queda detrás; θ = 0 mira a la cámara.
- **Textura:** desenrollada (ancho = 2πr), cortada en N tiras con 2 px de solape (sin solape se ven rendijas).
- **Sin facetas:**
  - la luz se hornea en la textura, columna a columna (Lambert: ambiente + luna·max(0, sen θ·Lx − cos θ·Lz));
  - las tiras llevan "Acepta luces" en OFF. Con luces de AE, cada tira sale de un tono distinto.
- **Con 24 tiras** el borde es un círculo perfecto a cualquier distancia (error de 1,6 px en r = 190).
- **Piezas con transparencia** (baranda, montantes): tiras con alfa. Los cristales llevan alfa de 0,55 y un Ramp radial cálido cuya opacidad de efecto lee POWER.

### 4.58 Carteles que miran a la cámara (billboards)

- **Solo en Y** (postes, farolas, rocas, escombros, cúpula, niebla), con expresión en Y Rotation:
  `var c = thisComp.layer("CAMARA").toWorld([0,0,0]); var p = toWorld(anchorPoint); radiansToDegrees(Math.atan2(-(c[0]-p[0]), -(c[2]-p[2])))`
- **En todos los ejes** (puntos de luz, polvo, halos): `autoOrient = CAMERA_OR_POINT_OF_INTEREST`.
- Un objeto redondo (poste, torre o roca) visto de lado es igual desde cualquier ángulo horizontal: por eso el cartel en Y no se nota.
- **Brillos que no tapen lo que tienen delante:** desplazarlos por detrás del centro, visto desde la cámara: `value - normalize(c - value) * 30`.

### 4.59 Profundidad de campo que se lee (y no mata el render)

- **Cámara de 1 nodo:** Orientation = `lookAt(position, thisComp.layer("MIRA").transform.position)`.
- **Foco:** nulo FOCO, con la distancia a lo largo del eje de la cámara:
  `var p = thisComp.layer("FOCO").transform.position; var c = toWorld([0,0,0]); var v = normalize(toWorldVec([0,0,1])); Math.max(50, dot(p - c, v));`
- **Apertura 22** en 1080p: el fondo desenfocado se sigue reconociendo.
  - Con 55 el faro del fondo era una mancha y el fotograma tardaba ~17 s.
  - Con 22 tarda ~10 s. El coste crece con el radio del desenfoque.
- **Cambio de foco:** 2 s con suavizado 75 %, empezando mientras la cámara ya se mueve.

### 4.60 Haz de faro volumétrico que barre la escena

- **Rig:** ROTOR (giro Y, 72°/s) → TILT (Z = 3°, el haz baja un poco). El segundo haz, con un nulo intermedio de Y = 180° (el orden por padres es seguro).
- **Volumen:** 3 planos cruzados (X = 0/60/120°) con una textura de cono (se ensancha 0,118 px por px, cae 1/(1 + x/260)^0,75 y lleva ruido alargado), en modo Añadir al 34 %, con Fill cálido.
  - Se apagan cuando apuntan a la cámara (si no, se ve una estrella de 3 líneas): opacidad × (1 − `linear(dot(dir, aCamara), 0.80, 0.985, 0, 1)`).
- **Luz real:** foco de 12°, calado 70 y 260 %.
  - No se empareja: posición = `thisComp.layer("TILT1").toWorld([50,50,0])` y orientación = `lookAt(position, thisComp.layer("TILT1").toWorld([1050,50,0]))`.
- **Destello cuando el haz mira a la cámara:**
  - un velo con tamaño ∝ distancia/5200 y opacidad `dm^24`;
  - un núcleo intenso con tamaño ∝ distancia/3000 y opacidad `dm^40`;
  - así ocupa lo mismo en pantalla de lejos y de cerca. A tamaño fijo, de cerca cubría todo con un velo marrón.

### 4.63 Reflejo de la luna en el agua

- **Textura:** columna de destellos cortos (2–7 px), más estrecha y fina hacia el horizonte.
- **Capa 2D** en la escena, anclada arriba en el punto del horizonte bajo la luna (`toComp` de un nulo en el mar); se estira hasta abajo. Modo Añadir al 75 %.
- **Truco de capas:** una capa 2D parte el render 3D en dos grupos. Cielo, luna y mar van debajo; ciudad y faro, encima, así que lo tapan.
- **Temblor:** Turbulent Displace (cantidad 9, tamaño 14, evolución `time*240`). El Offset repite la textura y sacaba un bloque sobre el horizonte.

### 4.68 Cámara de presentación: zoom rápido + bajada que revela (clase 12)

- **Rig:** nulo 3D → cámara hija (sin autoorientación, en la posición local [50, 50, Z]).
  - El nulo hace la **bajada** (Y) y la cámara el **zoom** (Z).
  - Wiggle 0,5 Hz / 0,25° en la orientación de la cámara.
  - Motor `"ADBE Advanced 3d"` (que es el **Classic 3D**), para el motion blur en capas 3D.
- **Zoom:** 1,84 s, Z −4307 → −3034 (con zoom de cámara 3100):
  - clave 1 con **salida al 5 % y velocidad 1875 px/s**: arranca ya rápido;
  - clave 2 con entrada al 95 %.
- **Bajada:** 2,05 s, empieza a los 2,02 s, en S (**salida 50 %, entrada 95 %**, velocidades 0): arranca suave y frena muy largo.
- **Iconos que suben:** empiezan 0,6 s después de la bajada, uno cada 0,1 s, 520 px en 0,8 s (salida rápida, entrada 95 %). Llevan la misma sombra que el panel.

### 4.106 Movimiento de cámara A → B con un nulo, diseñando primero el plano final (Tanda 04 · 01)

- **Los 5 pasos de la clase (Marketing Demons):**
  1. capas 3D repartidas en Z (más Z = más lejos): el paralaje, "lo cercano se mueve más rápido que lo lejano";
  2. cámara de **35 mm** (zoom = 35/36 × ancho de la comp = 1866,67 en 1920);
  3. un **nulo 3D padre de la cámara**: cámara de un nodo (`NO_AUTO_ORIENT`) en local [0, 0, −zoom];
  4. **2 keys en la posición y la escala del nulo** ("simple y efectivo");
  5. **la curva:** F9 y, en el gráfico de VALOR, los tiradores para que **salga fuerte y aterrice muy largo** (Flow [0,1; 0,75; 0,15; 1]: el 54 % del cambio en el primer 10 % del tiempo y el 95 % a la mitad) + **motion blur**.
- **La escala del nulo es un dolly:** la cámara cuelga a −zoom del nulo y la escala del padre multiplica esa distancia.
  - Nulo al 50 % = cámara a la mitad de distancia = lo de Z = 0 se ve al doble.
  - Posición del nulo = hacia dónde va. Escala = cuánto se acerca.
- **Motor: Classic 3D** (`"ADBE Advanced 3d"`), el que deja motion blur en capas 3D (tabla de motores en la sección 5).
- **Diseñar primero el fotograma B** (donde la cámara aterriza y se queda ~4 s; con esta curva el A pasa en un instante):
  - para cada capa: dónde se ve en B (sx, sy), a qué tamaño (t, 1 = su tamaño de diseño) y su Z;
  - k = (Z + zoom × escalaB) / zoom → **posición de mundo = nuloB + (s − centro) × k** y **escala = t × k × 100**;
  - el fotograma A sale solo: revisarlo (que nada se monte ni quede cortado).
  - Por qué: colocado "a ojo", el plano final quedó 56 px a la izquierda (un nulo 40 px a la derecha, con la cámara al 72 %, mueve lo de Z = 0 −40 / 0,72) y con "SUSCRÍBETE" cortado en el borde.
- **Cuánto empujar** (escala del nulo 100 → 50 %):
  - el logo (Z 0) crece ×2, lo de Z −400 ×2,75 y el haz de Z 1500 ×1,38. Esa diferencia ES el paralaje;
  - con 100 → 72 % (×1,39) casi no se notaba;
  - el profe empuja más: en una comp de 1440 lleva el nulo a [960, 372, 1054] con escala 95 % (va a la derecha, sube y avanza).
- **Qué Z dar:** lo cercano no debe quedar a menos de ~500 px de la cámara en B, o explota de tamaño.
- **Comparar con y sin profundidad (para enseñar):** la escena plana pone cada capa en Z = 0 donde se ve en A y a su tamaño en A.
  - Mismo primer fotograma; al final, la plana es un zoom 2D (todo crece igual) y la otra tiene paralaje.
  - Compensar solo la escala no basta: la posición también (si no, lo cercano sale desplazado hacia fuera).
- **Lámina de enseñar** (`02_comparacion.jsx`):
  - vista desde arriba: cada capa en su Z, y la cámara y su campo de visión leídos de la escena real con `toWorld`;
  - la curva de la escala del nulo, dibujada con `valueAtTime`, con un cursor que la recorre.
- Proyecto: `Tanda 04…/01 Camera Movement (2 min)/` (`01_escena.jsx`: el diseño de B está en el objeto `B` del principio).

### 4.107 La cámara en pisos: un movimiento por nulo, solapados, con alabeo, revelado desde muy cerca y desenfoque a mano (Tanda 04 · 02)

Lo que el profe llama "dominar la cámara 3D": recorrer varios "puntos" (textos, iconos) sin que la cámara se pare nunca.
- **Rig:** NULO 2 (mov. 3) → NULO 1 (mov. 2) → cámara de 50 mm (mov. 1). Cada piso hace UNA cosa con 2 keys, y **el siguiente empieza antes de que acabe el anterior**. Tiempos del profe (comp de 60 fps):
  - mov. 1, la cámara se aleja del punto 1 (*Position*; el *Point of Interest* fijo): 0 → 1,18 s, "curva de entrada" (sale 0,1 %, llega 100 %);
  - mov. 2, NULO 1 va al punto 2 (posición, escala 100 → 79 % y giro Z +6°): 0,89 → 2,99 s, "montaña suave" (60/60);
  - mov. 3, NULO 2 retrocede y lo enseña todo (posición con Z ≈ −1650 y giro −5° → el plano vuelve a quedar recto): 2,59 → 4,12 s, "gana y pierde" (33/100).
  - Por qué: con una sola cámara, una tercera key haría que "una animación acabe y empiece la otra" (rígido). Con pisos se solapan y la velocidad nunca llega a 0 hasta el final (lámina `03_lamina.jsx`).
- **El giro Z de un nulo es un alabeo de la cámara.** La cámara de 2 nodos colgada lo hereda. Un texto girado 6° se ve recto al llegar y es el mundo el que se inclina: dinamismo sin tocar el texto. El piso de arriba lo deshace al final.
- **"Súper adelante" = muy cerca de la cámara:** cuando la cámara retrocede, ese elemento entra enorme y rapidísimo y se posa. Revelado sin keys propias (la caja de iconos a Z −1650 con la cámara pasando de −2107 a −3333).
  - Precomp que pasa tan cerca: **construirla al triple** (nulo padre al 300 %) y escalarla /3. Se rasteriza a su tamaño, y aquí pasa ampliada ~2,6×.
  - **Sin contraer transformaciones** (en Classic 3D la sacó de sitio: sección 5).
- **Desenfoque gaussiano a mano** en lo que deja de importar cuando llega lo nuevo (el profe: *Blurriness* 5). Un deslizador "Desenfoque" en el nulo de cada grupo, leído por todas sus capas. Es profundidad de campo dirigida a la atención.
- **Subrayador amarillo** (#FFED00) en **modo Oscurecer**, 3 px por detrás del texto: el amarillo tiñe el fondo y la cuadrícula se ve a través, como tinta. Crece desde la izquierda (ancla en el borde, escala X 0 → 100, "gana y pierde"), con la última key en la llegada de la cámara.
- **Texto letra a letra** como el preset gratis *Type Array*: selector de expresión por letras (sin espacios), 2 fotogramas de retraso por letra, cada una con opacidad 0 → 100, desenfoque 12 → 0 y subida de 18 px en 24 fotogramas (`aparecerLetras()` de `camara_lib.jsx`).
- **Z-fighting:** dos capas en la misma Z se pisan. Separarlas unos px (texto delante, forma detrás).
- **Plano final diseñado** (4.106) con pisos: cámara = NULO 2 + giro(r2) × NULO 1 + [0, 0, escala1 × Z de la cámara]. Se decide la cámara final y de ahí sale la posición final del NULO 2.
- Proyecto: `Tanda 04…/02 MASTER 3D Camera/` (`camara_lib.jsx`, `01_caja_iconos.jsx`, `02_escena.jsx`, `03_lamina.jsx`).

### 4.108 Pieza explicativa con cámara: un nulo por movimiento, colas que no paran, cortes en el pico y montaje por motores (Tanda 04 · 04)

La "guía completa" de motion graphics: una pieza de ~15 s con voz en off que va de idea en idea con la cámara.
- **Rig:** cámara de 35 mm de un nodo colgada de NULO 1. Cada movimiento nuevo es un nulo nuevo que se hace **PADRE** del anterior (duplicar el nulo, borrar sus keys y emparentar el viejo al nuevo). Cada nulo anima UNA cosa (Z, X o giro) con dimensiones separadas.
- **La cola que no para** (`movConCola()` de `camara_lib.jsx`):
  - 3 keys: arranque (salida 70 %), **key continua** al 90 % del recorrido y key final más lejos;
  - en el gráfico de velocidad, un pico y una cola larga;
  - **medido para que frene SIEMPRE:** velocidad en la continua = 2,5 × la media de la cola, salida de la continua 20 %, llegada final ≤ 55 %. Así los tiradores de la cola forman una curva cóncava.
  - Con 75 % a los dos lados se pasaba del final y volvía; con 0,9 × la media, repuntaba.
  - Comprobarlo midiendo la velocidad con `valueAtTime` cada 0,15 s: debe bajar siempre después del pico.
- **Los cortes en el pico de velocidad** (corte de acción, 2.0e): buscar el pico midiendo (`valueAtTime`) y cortar ahí.
  - Corte directo: la escena A acaba y la B empieza en el mismo fotograma.
  - **Destello:** un sólido blanco (#F6F6F6) con opacidad 0 → 100 → 0, 5 fotogramas antes y 5 después del pico.
  - La dirección del movimiento, igual a los dos lados.
- **Montaje por motores:** cada escena en su comp con el motor que necesita y **los mismos nulos y keys** del movimiento del corte. En la comp final se cortan en la marca.
  - A la de Cinema 4D o Advanced 3D, **CC Force Motion Blur** (esos motores no hacen motion blur), aunque es caro: Cinema 4D × 10 muestras = 133 s por segundo de vídeo.
- **Colocar cada elemento diseñando su plano** (4.106 generalizado): con la cámara sin giros, su sitio es la suma de los nulos en el instante t.
  - Para que en t se vea en (sx, sy), a "tam" de su tamaño y a "dist" de la cámara: `mundo = cámara(t) + [(sx − 960)·k, (sy − 540)·k, dist]` y `escala = tam·k·100`, con `k = dist / zoom`.
  - Función `colocar()` de `03_escena_B.jsx`.
- **No girar la cámara 180° si se puede girar el objeto:** con un fondo liso se ve igual y no obliga a poner todo lo demás girado 180°.
- **Elementos de la pieza:**
  - reloj con agujas por expresión (minutero `time*120`, horaria /12);
  - moneda extruida con relieves (4.97 y sección 5);
  - pósit con CC Page Turn (`wiggle` en el doblez) y sombra con Bezier Warp enlazado;
  - palabras "a tiza" (Ink Free + Roughen Edges) tachadas con Trim Paths;
  - cajas que suben con un rebote suave (abajo → −16 → 0);
  - camino tumbado (X −90: el borde de arriba de la comp queda lejos) que se dibuja, con la copia clara completa debajo;
  - bandera al final.
- **Acabado del profe:** Fast Box Blur con elipse restada y calado 300 (bordes desenfocados), contraste, viñeta, grano fijo gris en Superponer al 6 % (suaviza bandas) y fundido desde negro.
- **Voz en off:** guion en SSML → `voz_onecore.ps1` (voz Pablo) → Whisper → cada efecto en su palabra.
- Proyecto: `Tanda 04…/04 Motion Graphics designer (guia completa)/` (`pieza_lib.jsx` + pasos 01–05).

### 4.109 Escena 2.5D que llama la atención: imágenes preparadas, capas en Z, un punto de interés y dos nulos solapados (Tanda 04 · 03)

Una estatua en un prado con "MOTION / DESIGN" detrás, árboles en las esquinas y una fila de iconos. Todo son imágenes planas en 3D.
- **1. Las imágenes son la mitad del éxito.**
  - Antes del etalonaje general, **medir el color medio por zonas contra el plano del profe** (`comparar_color_zonas.py`: cielo, horizonte, hierba, árboles) y corregir **cada capa** con Hue/Saturation.
  - Medido: su cielo, luz 223 y cian; el nuestro, 166 y azul. Su hierba, verde frío (63, 127, 74); la nuestra, amarilla (48, 86, 27).
  - **Recursos gratis que funcionaron:**
    - estatua escaneada de Sketchfab → mármol en Blender (`blender_estatua_png.py`);
    - árbol 3D → PNG por árbol (`render_arbol.py` de la clase);
    - foto de Pexels sin cielo (`quitar_cielo.py`);
    - Sky 122 de Texturelabs;
    - iconos de Segoe Fluent Icons (`iconos_png.py`).
- **2. Capas separadas en Z.** Profundidades sacadas de su resultado (D_B = distancia de la cámara cercana a la figura):
  - **El fondo:**
    - si entre dos planos de un retroceso la figura cambia de tamaño r_e veces y el fondo r_t veces: **Z del fondo = D_B · (r_e − r_t)/(r_t − 1)**;
    - en su vídeo 1,93 y 1,19, o sea 3,9 · D_B. Usé 2,5 · D_B, porque en la subida salía 1,7.
  - Texto en 2500, **prado 150 por delante del texto** (la cima tapa el pie de "DESIGN") y cielo en 7 · D_B.
  - Lo de delante, entre la cámara cercana y la figura: iconos −0,62 · D_B y árboles −0,65 / −0,8 · D_B.
  - **Lo lejano se escala, no se acerca:** cielo al 250 %, prado al 150 %.
- **3. La cámara**, 35 mm de dos nodos ← cam control 1 ← cam control 2 (todo en cian):
  - diseñar el **plano final C** (4.106) y despejar los planos A y B de "dónde debe verse la coronilla";
  - **mov. 1 (nulo 1) sube:** 0 → 1,9 s, salida 10 % / llegada 100 % (el pico de velocidad, al principio);
  - **mov. 2 (nulo 2) retrocede ×1,93 y baja un poco:** 1,4 → 3,3 s, 33 % / 100 %. **Empieza 0,5 s antes de que acabe el 1.** Medido contra el suyo: 91 % a los 2,5 s, igual que él;
  - **`wiggle(1, 8)` en el punto de interés.** Por eso la cámara de dos nodos. Es la vida del plano cuando la cámara para.
- **4. Lo que está delante de la cámara y se vería al empezar entra tarde** (su "los empiezo más o menos aquí"):
  - el *in point* se calcula hacia atrás desde el plano final: el último fotograma en que su dibujo aún está fuera del cuadro;
  - dejar ≥ 80 px de margen por debajo del cuadro en el plano B. Con 30 px entraba a 0 s.
- **5. Árboles en las esquinas:**
  - la copa asoma por la esquina y el tronco queda fuera del cuadro;
  - se enseña **el lado de la copa con el borde limpio**: el otro tenía hojas colgando hasta la fila de iconos;
  - la otra esquina, la misma imagen en espejo (escala X negativa).
- **6. Estilo, con 3 capas de ajuste 2D:**
  - **color**, arriba del todo: Color Balance con sombras −12/0/+26, medios −6/0/+4 y conservar luminosidad (= su rueda de sombras hacia el azul) + Lumetri Contraste 15 (= su curva en S);
  - **effects**, debajo de color: Radial Blur Spin 2 + VR Chromatic Aberrations ±2 + **Transform al 101,2 %** (empuja la raya del borde), todo bajo una elipse del tamaño de la capa, invertida y calada 350;
  - **blur**, justo encima del prado: Fast Box Blur 8 en una franja del horizonte (y 400–720, calado 200). Funde prado, texto y cielo, y deja nítidos la figura y lo de delante, porque la capa 2D parte el render 3D;
  - motion blur en todo lo 3D y motor Classic 3D. Unos 0,36 s por fotograma.
- **7. La lámina que lo explica** (`03_lamina.jsx`):
  - **vista de lado a escala:** Z hacia la derecha, Y hacia abajo y la misma escala en los dos ejes, así los ángulos son los reales;
  - cada capa con su alto real, y la cámara leída con `toWorld` con su campo de visión cortado en la franja;
  - las curvas de los dos nulos con el tramo solapado, y lo que ve la cámara.
- **La fuente se reconoce por la proporción** de una palabra (ancho / alto): "MOTION" = 5,84 = Montserrat ExtraBold.
- Proyecto: `Tanda 04…/03 Eye-catching 3D Scenes/` (`construir.jsx` + pasos 01–03, `render_estatua.py`, `render_arbol.py`, `prado_sin_cielo.py`, `iconos.py`).

### 4.110 Cámara que viaja de escena en escena sin parar: un nodo, cadena de nulos, "Center In View" y corte en el pico (Tanda 04 · 05)

Pieza vertical de ~12 s (Vane Motion): un cursor abre una ventana en unas líneas, la cámara entra por ella y pasa por un icono que se transforma, un barrido curvo, un número en el que se mete y un corte final a la firma.
- **1. El rig:**
  - cámara de **50 mm de UN nodo** (zoom 1500) dentro de la cadena en Z −zoom. No gira hacia ningún punto: viaja recta, y por eso se ve limpia;
  - **un nulo por movimiento**: el nuevo es **padre** del anterior (Ctrl+D, U, borrar keys, retroceder **10 fotogramas**, key nueva, emparentar el viejo al nuevo). Los movimientos se suman y se solapan: la cámara no se para nunca;
  - por script, la cámara en t = suma de las posiciones de los nulos + [0, 0, −zoom] (`camEn()` de `01_pieza.jsx`).
- **2. "Center In View" (Ctrl+Home):** la capa queda a "zoom" píxeles delante de la cámara, donde 1 px de la capa = 1 px de pantalla.
  - Por script: posición = `camEn(t) + [0, 0, zoom]`, con t = el instante en que la cámara **llega** (la key final de su movimiento).
  - Cada escena se diseña como si fuera 2D.
- **3. La influencia decide el pico de velocidad.** Con la misma influencia p en las dos keys: **pico = media / (1 − p)**.
  - 33 % → 1,5 veces la media; 65 % → 2,9; 75 % → 4; 90 % → 10.
  - 75 % para lo normal; **65 % para el desliz lateral** (más tranquilo); **90 % para el corte final**.
- **4. El corte va en el fotograma más rápido** (2.0e, 4.43). Se mide la velocidad fotograma a fotograma y, si la key no cae en el pico, se mueve un fotograma. En el corte: fondo gris muy oscuro y la firma, con Center In View en la key final.
- **5. La ventana que abre un cursor:**
  - líneas de 3 puntos (el del medio se anima);
  - **Create Nulls From Paths → Points Follow Nulls**, o por expresión `createPath([[0,y],[p[0],p[1]],[W,y]],[],[],false)` leyendo un nulo;
  - cada línea siguiente **se parte cuando el tirador pasa por encima**: antes, una copia recta; después, su nulo sigue al tirador;
  - el hueco: la forma de la V como mate. Por script, un sólido oscuro con **mate alfa invertido**;
  - el cursor cuelga del tirador.
  - Comprobar que cuando la cámara cruza el plano, el centro del cuadro cae dentro de la V.
- **6. El icono que se transforma:**
  - tamaño del **Rectangle Path** (no la escala) y color, en las mismas dos marcas;
  - las letras se van y el triángulo entra girando, los dos con la forma como mate alfa;
  - fondo con **Fill** animado (`ADBE Fill-0002`).
- **7. Adorno que entra suave:** un aro **más cerca de la cámara** que el icono. Al alejarse entra desde fuera del cuadro.
  - Se diseña por su tamaño en pantalla al final (860 px) y se comprueba que al empezar está fuera.
- **8. Barrido curvo con parallax:**
  - un círculo **muy cerca de la cámara** + desliz lateral de la cámara (65 %): el círculo cruza la pantalla mucho más rápido que lo de detrás. Aquí, el círculo a ~725 de la cámara y el icono a ~2350 (un tercio);
  - la escena siguiente (fondo rojo 2D y números 3D) con **mate alfa invertido** del círculo, y una copia en trazo de 5 px para el borde;
  - se diseña en pantalla (radio 1280 px, centro en (300, 960)) → mundo con k = distancia / zoom;
  - comprobar que al empezar cubre todo el cuadro y al acabar no toca nada.
- **9. Meterse en una letra:**
  - el 0 (Bebas Neue) gira 90° y la cámara se mete tanto que sus lados son **dos franjas**;
  - el texto encima va **del color del fondo**: lo que se sale de la franja desaparece solo;
  - interlineado medido para que cada palabra caiga en una franja (`medir_cero.py`: a 1000 px, lados de 110 y hueco de 114);
  - su giro, `thisComp.layer("0").transform.zRotation - 90`;
  - aparece con el **Range Selector Start 0 → 100** en la palabra de la voz (marcador en la onda, L L) y se va con 100 → 0;
  - el 0 sigue hasta 180° mientras la cámara se aleja: vuelve a ser un 0 ("desde 0").
- **10. Marcadores en la comp encima de cada par de keys:** las referencias de tiempo a la vista.
- **11. La lámina que lo explica** (`02_lamina.jsx`, se lee entera de la pieza):
  - **vista de arriba a escala** (X a la derecha, Z hacia arriba): cada capa 3D con su ancho, encendida solo mientras existe (`time >= L.inPoint && time < L.outPoint`);
  - el camino de la cámara con Trim Paths y una tabla tiempo → fracción;
  - la cámara (`toWorld`) con su campo de visión hasta **"el cuadro"** (a zoom delante): cada escena coincide con esa raya cuando la cámara llega;
  - la cadena de nulos con el activo encendido, y **la velocidad: una campana por movimiento y el corte en el pico**.
- **Fuentes del profe:** Bebas Neue (números), Helvetica Bold ("step") e Ink Free (lo escrito a mano). Todas están en el PC del autor.
- Proyecto: `Tanda 04…/05 Smooth 3D Camera Animation/` (`construir.jsx` + `01_pieza.jsx` + `02_lamina.jsx`).

### 4.111 Novedades de AE 2026 por script: mallas, sombras de luces y desenfoque en Advanced 3D, y fuentes variables (Tanda 05 · 01)

Probado en AE 26.5. Pieza de ejemplo: "NOVEDADES · AFTER EFFECTS 2026" (cinco objetos de colores en un estudio blanco).
- **1. Objetos 3D nativos sin plugins (mallas paramétricas):**
  - `var m = comp.layers.addParametricMesh("esfera", ParametricMeshType.SPHERE)`. Tipos: CUBE, SPHERE, PLANE, TORUS, CONE, CYLINDER;
  - medidas en su grupo (`ADBE SphereMeshOptionsSGrp` → `ADBE SphereRadiusStrm`…; lista completa en la Referencia de matchNames). Los grupos de los otros tipos están ocultos;
  - **bisel:** cubo redondeado = `ADBE CubeBevelRadiusStrm`; **píldora** = cilindro con `ADBE CylinderBevelRadiusStrm` = radio;
  - color: `ADBE3D Para Mat Parade` → `ADBE3D Param Mat Atom` → `ADBE3D Base Color`, `ADBE3D Roughness` (0–100), `ADBE3D Metallic` (0–100). Un pastel mate: rugosidad 45, metálico 0;
  - **el toro sale tumbado** (un donut en el suelo); de pie, X 90°. **El plano sale de frente**; de suelo, X 90°;
  - el ancla está en el centro: un objeto apoyado en el suelo (y = Ysuelo) va a y = Ysuelo − medio alto (esfera: radio; toro de pie: anillo + tubo).
- **2. Motor Advanced 3D** (`comp.renderer = "ADBE Calder"`): las mallas se ven, **los focos y la luz paralela dan sombras** (antes solo la luz de entorno) y la cámara desenfoca fuerte.
  - En la malla: `ADBE Compositing Options Group` → `ADBE Casts Shadows` = 1 (y el suelo, `ADBE Accepts Shadows`). En la luz: `ADBE Casts Shadows`, oscuridad `ADBE Light Shadow Darkness`.
  - La difusión de la sombra está **oculta en la luz paralela** (sombra algo dura). En el foco se puede.
  - Coste: con desenfoque + sombras, **~2,3 s por fotograma** a 1080p (9,5 s = ~11 min).
- **3. Estudio blanco sin horizonte** (estilo Apple):
  - suelo = plano de 12 000 × 12 000, casi blanco (#FBF8F3), tumbado y con el centro lejos (z 3000);
  - **luz paralela** (ilumina todo el suelo igual porque la dirección no cambia) + ambiente. Con un foco, el suelo lejano sale del cono y se oscurece: horizonte duro;
  - **subir las dos luces en la misma proporción** hasta que el suelo quede claro (aquí ambiente 75 + paralela 82 → suelo 234). Mucho ambiente borra las sombras: la sombra solo quita la luz principal;
  - fondo 2D: degradado (Ramp) que termina **en el color medido del suelo lejano** justo en el horizonte (`perfil_color.py`: color por filas en unas columnas). No se ve el corte.
- **4. Fuentes variables:**
  - en el PC del autor: Bahnschrift (wght 300–700, wdth 75–100), Segoe UI Variable (wght 300–700, opsz), Cascadia, Sitka y Arsenica Variable;
  - **instancia fija:** `app.fonts.getFontsByPostScriptName("Bahnschrift")[0].postScriptNameForDesignVector([650, 80])` → "Bahnschrift_650.000wght_80.000wdth", que va en `doc.font`. Para cualquier peso intermedio (rótulos en 350, por ejemplo);
  - **animado:** animador → `animador.property("ADBE Text Animator Properties").addVariableFontAxis("wght")` → aparece `ADBE Text VF Axis 1` ("Font Axis Weight") con valor **absoluto** (400 = el normal). Valor 700 + selector End 0 → 100 = **engorda letra a letra**. Con "wdth", se ensancha.
- **5. El reparto proporcional (Ctrl+Alt + arrastrar, en la clase) por script:** `valor_i = inicio + i × paso` en posición, giro o tiempo de entrada (aquí x + 190·i, z + 150·i, giro + 72°·i y entrada cada 0,16 s).
- **6. Lo que solo va con clics** (explicado en el APRENDIZAJE): Object Matte (sustituye al Roto Brush), seguimiento de máscaras, materiales Substance (.sbsar, con cuenta de Adobe), copiar fotograma, pegar trazados de Illustrator, Quick Apply, etiquetas de color de los efectos y el control del ancla (comando 10312 sí existe).
- **7. Cómo se descubrió lo que no viene documentado:** `objeto.reflect.methods` / `reflect.properties` (funciones y enums nuevos) y `buscar_matchnames.py` (nombres internos dentro de los .dll de AE).
- Proyecto: `Tanda 05…/01 Novedades de AE 2026/` (`construir.jsx`, `00_sondeo*.jsx`, `01_pieza.jsx`).

