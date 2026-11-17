# Recetas · Element 3D, texto 3D y anuncios de producto

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.97 Texto 3D dorado por script (Tanda 03 · 05 · el Element 3D de la clase)
- 4.101 Título 3D con Element: escena una vez con clics, preset y después todo por script (Tanda 03 · 06 "TITULO")
- 4.102 Modelo 3D de Sketchfab dentro de Element (Tanda 03 · 07)
- 4.103 Pantalla de un aparato = una comp de AE (y se puede animar)
- 4.104 Cámaras "de verdad" para un producto: macro, giro y caída (Tanda 03 · 07)
- 4.105 Render de Element: calidad y tiempo (medido en la Tanda 03 · 07)

### 4.97 Texto 3D dorado por script (Tanda 03 · 05 · el Element 3D de la clase)

- **Precomp con el motor Cinema 4D** (`comp.renderer = "ADBE Ernst"`). Es el único que deja poner por script:
  - extrusión (`ADBE Extrsn Depth` 55), bisel (`ADBE Bevel Styles` 2, profundidad 5);
  - material: especular 85, brillo 35, **Metal 100**, reflexión 45, nitidez 60, Fresnel 40.
- Relleno #E9B24C, Gotham-Black 230, tracking 40.
- Luces: ambiente 30 + puntual 115 arriba a la izquierda delante + contraluz cálido #FFB060 a 70 por detrás a la derecha.
- La calle como capa de entorno (`capa.environmentLayer = true`) para los reflejos. **Sale con fondo transparente.**
- **Caída:** posición [960, −420, 2600] → [960, 420, 0], giro X −75 → 0 e Y 35 → −6, curva (0,25 / 0,7 / 0,35 / 1). Con 0,1 / 0,9 el texto llegaba casi entero en 3 fotogramas y no se veía caer. Después, una deriva lenta en Y.
- **El brillo va en la capa de la precomp**, no en el texto 3D: Deep Glow 180 / 0,12 + S_Rays suave dorado. Así no se corta.
- Al aterrizar: fondo con desenfoque gaussiano 25 → 100 (con repetir bordes) y opacidad → 18.
- **Texto detrás del artista:** solo si el artista roza una letra. Aquí tapaba 2–3 y no se leía → delante.
- **Element 3D no se puede montar por script** (su escena se crea en su propia ventana). Haría falta un preset .ffx ya guardado con la extrusión.

### 4.101 Título 3D con Element: escena una vez con clics, preset y después todo por script (Tanda 03 · 06 "TITULO")

- **Una vez, en la ventana de Element (control de pantalla, solo en AE):**
  1. sólido + Element + texto oculto (Path Layer 1 por script: `VIDEOCOPILOT 3DArray-1802` = índice del texto);
  2. botón *Scene Setup* de los controles del efecto (la ventana tarda ~5 s);
  3. **EXTRUDE**;
  4. *Bevel Copies* 3;
  5. el material: Presets > Materials > Pro_Shaders_2 > Metal > clean_metal_clean_02, con doble clic sobre cada bisel seleccionado;
  6. después los relieves: bisel 2 con Expand Edges −0,12 y Z Offset −0,17; bisel 3 con −0,22 y −0,34. Un material de preset los pone a 0, por eso van después;
  7. *Reflectivity Color* del color de la escena (#A28CFF violeta);
  8. textura de *Glossiness* y *Normal Bump* con **UV Repeat 15 × 15** (más fina, no se pixela);
  9. entorno Basic → OK.
- **Por script** (controles del efecto, matchNames en `Referencia - Element 3D (parametros).txt`):
  - AO `-1252` = 1 (intensidad `-1254`); rotación de la luz adicional Y `-1064`; Render Mode `-1950` = 1 (Full Render);
  - Particle Size `-0185` (tamaño); Multi-Object `-0302` = 1;
  - **Animation Engine** `-0083` = 1, tipo `-0055`, *Smoothness* `-0061` = 75;
  - **Animation `-0054` 100 → 0** (100 = no se ve ninguna letra) en 30 fotogramas, rápido → lento;
  - *Rotation Random Multi* `-0304` 120 → **0** (si termina en −120, las letras se quedan torcidas);
  - salida: Particle Size → 0, lento → rápido.
- Encima, en este orden: **CC Light Sweep** (Direction −20, Width 170, Sweep 85, Edge 70, centro de −400 a 2300 en 45 fotogramas) → Deep Glow (160 / 0,22) → S_Rays (0,22 / 0,9, #D9CCFF).
- Escena: fondo 100 → 60 % al entrar, shake 0 → 0,35 → 0, viñeta + contraste 12, y un acercamiento del 100 al 104 % (nada quieto).
- **Guardar el preset:** efectos seleccionados (`efecto.selected = true` por script) → menú Animation > Save Animation Preset → nombre → Guardar. Hecho con clics: el menú abre un cuadro modal.
- **Usarlo (ya probado):** `solido.applyPreset(new File(".../User Presets/Titulo violeta 3D (Element).ffx"))` + Path Layer 1 = otro texto. Sale igual ("NOCHE") sin abrir Element.

### 4.102 Modelo 3D de Sketchfab dentro de Element (Tanda 03 · 07)

- **Buscar:** API `https://api.sketchfab.com/v3/search?type=models&q=…&downloadable=true&licenses=by`. Enseñar las opciones al usuario, descargar con su permiso a Descargas y guardar `CREDITOS.txt` (título, autor, licencia).
  - Si el botón de descarga "no hace nada": Chrome tenía bloqueadas las **descargas automáticas** de la página. El usuario las permitió.
- **Element no lee GLB.** `scripts/glb_a_obj.py` (Blender sin ventana):
  - saca a PNG las texturas que el GLB lleva **dentro** (si no, el OBJ sale gris);
  - escribe OBJ + MTL con solo el nombre de cada PNG;
  - renombra materiales con un JSON (los de Sketchfab traen nombres aleatorios: "pIJKfZsazmcpEiU" → PANTALLA);
  - hace dos vistas de prueba para saber qué es cada pieza (la pantalla es el plano con UV 0–1 del tamaño de la pantalla).
- **En Scene Setup:**
  1. IMPORT → escribir la ruta del OBJ → en las opciones marcar **Opacity** (si no, los vidrios salen opacos y tapan la pantalla) → OK;
  2. Edit > Transform > **Normalize Size**;
  3. Presets > Environment (16) → doble clic en un HDRI (aquí *photo_studio_01_4k*: estudio con softboxes, reflejos limpios). Avisa de que lo reduce a 2048: OK.
- **En AE el modelo sale de espaldas:** grupo 1, rotación Y `-0205` = 180.
  - A *Particle Size* 30, el iPhone mide ≈ 740 × 1525 px y ≈ 79 px de grueso; la pantalla queda en Z ≈ −40.
- **"El negro" del profe** (oscuro, poco brillo, reflejos del entorno), sobre los materiales del modelo:
  - trasera #232326, Glossiness 60 %, reflejo 10 %;
  - marco #505056 multiplicando su textura, reflejo 50 %;
  - logo con reflejo 45 % (se distingue de la trasera por el brillo, no por el color).
  - Tecleado, *Glossiness* no pasa de 100 %.

### 4.103 Pantalla de un aparato = una comp de AE (y se puede animar)

- **La comp:** del tamaño de la pantalla real (iPhone 15 Pro Max 1290 × 2796; el profe usa 1242 × 2688).
  - Va **oculta** en la comp de Element. `-1852` (Custom Texture Maps > Layer 1) = su índice; AE sigue a la capa aunque cambie de número.
- **Material de la pantalla:**
  - *Diffuse* = Custom Layer 1, con el color *Diffuse* en **blanco** (en negro la apaga: le pasó al profe);
  - *Illumination* = Custom Layer 1, intensidad 100 % (brilla sola, sin depender de la luz);
  - *Diffuse* y *Ambient* 0,25, para que no se queme;
  - **reflejo ≤ 2 %**: con 6 % el negro se ve gris y manchado (refleja el estudio).
- **Sale al revés:** **UV Repeat (1, −1)** en los dos canales.
- **Element lee la comp en cada fotograma**, así que la pantalla se puede animar:
  - **escribir:** keys retenidas de *Source Text*, una por letra, a ritmo de dedo (3–6 fotogramas, más en los espacios);
  - **cursor:** una expresión con `sourceRectAtTime` lo pone detrás de lo escrito; parpadea si no se teclea;
  - **tecla pulsada:** un PNG con keys retenidas de posición, escala (la barra espaciadora es más ancha) y opacidad 100 → 0 en 3 fotogramas;
  - **enviar:** la burbuja sale del botón (ancla abajo-derecha, 55 → 104 → 100 %) y el chat sube lo que mide la burbuja (precomp con máscara fija entre la cabecera y el campo).
- Diseño propio con Pillow (`pantalla.py` de la clase): barra de estado, cabecera, burbujas con emojis en color, fila de apps y **teclado en español con ñ**.

### 4.104 Cámaras "de verdad" para un producto: macro, giro y caída (Tanda 03 · 07)

- **Una cámara de un nodo** (`autoOrient = NO_AUTO_ORIENT`) **colgada de un nulo 3D** en el punto que se mira.
  - La Z local de la cámara es la distancia; girar el nulo = orbitar.
  - Una cámara + nulo **por toma**, recortadas con su entrada y salida (AE usa la cámara activa de más arriba).
- **24 mm en vertical:** sensor de 36 mm con el lado largo a lo alto → *Zoom* = 24/36 × alto de la comp (1280 en 1080 × 1920).
- **Macro rasante sobre el teclado** (teléfono de 1525 px):
  - nulo en la pantalla con X 62° (la cámara baja y mira hacia arriba, a ras del vidrio), Y −28°, Z 18° (las filas en diagonal);
  - cámara a ~290 px; el nulo recorre del teclado al campo de texto, lento → rápido → lento;
  - foco de 245 (teclas de cerca) a 290 (el punto); *Aperture* 90, *Blur Level* 150, iris decágono, *Roundness* 100 %.
- **Giro + acercamiento:**
  - el grupo de Element gira (Y 30° → 180°, X −18° → 0°) y la cámara pasa de 2700 a 1500, lento-rápido-lento;
  - ***Blur Level* 0 mientras se ve el teléfono entero** (si no, parece una maqueta: el efecto *tilt-shift* de las ciudades de juguete); 0 → 90 en el último tercio.
- **Caída hacia atrás:**
  - empieza pegada a la pantalla (donde pasa algo: llega la respuesta);
  - la cámara se aleja acelerando (lento → rápido) hasta 12 000 px, el nulo gira X 0° → 55° (se ve tumbarse hacia atrás) y Z −8° → 20°;
  - motion blur de Element y fundido a negro.
- **Cortes:** cada toma empieza con otro encuadre (más cerca o más lejos). Si dos tomas seguidas encuadran parecido, el corte parece un salto.

### 4.105 Render de Element: calidad y tiempo (medido en la Tanda 03 · 07)

- **"Todo esto al último"** (hace lenta la vista previa):
  - AO Ray-Traced: `-1267` = 2, muestras `-1276` = 12;
  - Motion Blur `-1102` = **2** (el propio de Element; 1 = el de la comp y oculta el *shutter*), muestras `-1103` = 15, *shutter* `-1104` = 180. Funciona también con el movimiento de la cámara;
  - Multisampling `-1452` = 7 (máximo); Supersampling `-1465` de 1 a 4 (= 1x, 2x, 4x, 8x); Enhanced Multisampling `-1469` = 1.
- **Tiempo por fotograma** (1080 × 1920, toma con desenfoque):
  - ajustes de prueba ≈ 0,1 s;
  - MS 7 + SS 2x + MB 15 + AO 12 ≈ **3 s**;
  - **SS 8x (lo del profe) ≈ 30 s**, y en el recorte casi no se nota → **2x**.
  - Los 12 s del anuncio tardaron 10 min (con 8x serían ~1,5 h).
- Motion blur con 8 muestras deja "copias" en una caída rápida; con 15 ya no.
- Antes del render largo: 1 s de prueba (88 s aquí) y avisar al usuario de los minutos y del "(No responde)".

