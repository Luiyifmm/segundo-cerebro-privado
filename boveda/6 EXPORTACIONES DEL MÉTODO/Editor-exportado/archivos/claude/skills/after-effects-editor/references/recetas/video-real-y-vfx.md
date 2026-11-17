# Recetas · Vídeo real y VFX (videoclip)

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.92 Recortar al artista sobre verde por script y pre-renderizarlo (Tanda 03 · 05 · lo que en la clase es el Roto Brush)
- 4.93 Brillo detrás del artista (Tanda 03 · 05)
- 4.94 Zooms "tac, tac" con S_BlurMoCurves (el "Blur More Curves" de la clase)
- 4.95 Fondo infinito y su continuidad (Tanda 03 · 05)
- 4.96 Cara fija: estabilizar al artista y zoom "bum" a la cabeza (Tanda 03 · 05)
- 4.98 Eco fantasma y clones (Tanda 03 · 05)
- 4.99 Shakes y flashes en los golpes (Tanda 03 · 05)
- 4.100 Transiciones con el artista: al revés, teletransporte, entrar y salir, giro, meterse en un objeto (Tanda 03 · 05)

### 4.92 Recortar al artista sobre verde por script y pre-renderizarlo (Tanda 03 · 05 · lo que en la clase es el Roto Brush)

- **Antes, medir el verde** (mediana de una zona de fondo, `color_verde.py` del proyecto) → *Screen Colour*. El de Pexels era apagado, casi oliva (0,57 / 0,61 / 0,41).
- **Comp "Fuente 1080":** el clip 4K reducido al 50 %. El recorte se hace sobre ella: 4 veces menos píxeles, y el vídeo final es 1080.
  - Medido: a 4K, 47 s por segundo de clip; a 1080, 15 s (o 27 con núcleo).
- **Capa "Borde"** (en este orden):
  1. **S_BlurChroma 6** (suaviza solo el color). Sin él, al quitar el verde, la compresión salía como un "puntillado" oscuro en la ropa;
  2. **Keylight 906:** Screen Balance **95** (verde apagado), Gain 100–110, Clip Black 28–30, Clip White 42–45, Pre-blur 0,75, Shrink/Grow −0,75/−1 ("desplazamiento"), Softness 0,9 ("calado");
  3. Advanced Spill Suppressor con el mismo verde (sin él, la piel sale verdosa);
  4. color de noche: Niveles 0,07 / 0,95 / gamma 0,85 / salida 0,84 + Vibrance 22 + Photo Filter cálido 32 %.
- **Capa "Núcleo"** debajo: la misma clave sin suavizar + **Matte Choker** (geom. 3, choke −100, gris 0,1 → geom. 3, choke +100, gris 1 = "cerrar huecos") + Simple Choker 1. Rellena lo que se parece al verde (el corsé dorado).
- **Comprobar sin fiarse del ojo:** `agujeros_alfa.py` (porcentaje del interior con alfa < 0,98) y `comparar_zona.py` (la misma zona del original y del recorte, ×3).
- **Pre-render una vez:** las comps "Artista ·" (1080, **60 fps**, todo el clip) con *High Quality with Alpha* (ProRes 4444, premultiplicado), y todas las tomas usan el .mov. Con 60 fps, la cámara lenta al 0,5x es perfecta.
  - Para cambiar el .mov: renderizar con otro nombre y `item.replace()` (AE tiene abierto el que usa).

### 4.93 Brillo detrás del artista (Tanda 03 · 05)

- Capas: fondo · **silueta** (el artista duplicado) · artista.
- Silueta, en este orden: Relleno blanco → **S_Rays** (en lugar de Shine) → **Deep Glow 2** (en lugar de Optical Glow) → **Desenfoque gaussiano 22** a todo (quita el borde duro).
  - S_Rays: centro en la mitad del artista, largo 0,4, brillo 1,2, umbral 0,2, color blanco, **Source Opacity 0,25** (se ven los rayos, no la silueta).
  - Deep Glow: radio 220, exposición 0,15. Opacidad de la capa 0 → 75 en 8 fotogramas, en la caída del beat.
- Probado: con rayos 0,55 / 2,2 y glow 0,35 salía media pantalla blanca, y sin el desenfoque al final parecía una pegatina con contorno.
- Al mismo tiempo, el fondo: Tinción 0 → 100 (B/N) y opacidad 100 → 22 en 12–16 fotogramas (rápido → lento).

### 4.94 Zooms "tac, tac" con S_BlurMoCurves (el "Blur More Curves" de la clase)

- En una **capa de ajuste encima de todo**: *Center XY* = el punto al que se va; **Z Dist** = distancia (1 normal, **< 1 acerca**, > 1 aleja; al alejar se ven bordes).
- Dos zooms en dos golpes: Z Dist 1 → 0,8 (8 fotogramas, aterriza en el golpe) y 0,8 → 0,66 en el siguiente, moviendo el centro a la otra mano. Curva lento → rápido → lento en todas las keys.
- *Shutter Duration* 0,8: cuánto desenfoque radial pone el plugin. *Rotate*: giro (para la zambullida, 4.100).
- Zoom lento y constante de un fondo: Z Dist 1 → 0,9 en toda la toma.

### 4.95 Fondo infinito y su continuidad (Tanda 03 · 05)

- Fondo: **Offset** (*Shift Center To*) de [960, 540] a [960 + 17000, 540] en toda la toma, curva lento → acelera (0,75 / 0 / 0,9 / 0,35).
- **Desenfoque direccional** (`ADBE Motion Blur`, dirección 90 = horizontal) de 0 a 160 **con la misma curva**: el desenfoque va con la velocidad.
- Tinción 55 % + S_Flicker (0,12, frec. 12).
- **Toma siguiente:** su fondo (otro clip) sigue moviéndose con la curva al revés.
  - Offset 0 → 3800 px en 30 fotogramas (rápido → lento). Para que la velocidad empate: la pendiente inicial de la curva × la media = la velocidad final de la toma anterior.
  - Desenfoque 160 → 0 con una curva menos marcada ("que el blur no tenga tanta curva").
- La costura del Offset se ve con el fondo lento; con el desenfoque desaparece.

### 4.96 Cara fija: estabilizar al artista y zoom "bum" a la cabeza (Tanda 03 · 05)

- **Rastreo** (el tracker de AE no se lanza por script): `rastrear_cabeza.py`. La cabeza es la parte más alta de la silueta del alfa (centroide de los 210 px de arriba, ±170 px alrededor del punto más alto), suavizada con una media de 7 fotogramas a 60 fps.
- **Estabilizar SOLO al artista recortado:** *Anchor Point* = punto de la cabeza (keys cada 2 fotogramas, auto-bézier) y *Position* fija (960, 380).
  - Estabilizando el clip entero, el Mosaico en espejo dibujó **una segunda cabeza reflejada** (la cabeza tocaba el borde de arriba).
- Bordes del clip que cortan el cuerpo: máscara rectangular del cuadro con **calado 260** (se funden). Arriba y a la derecha la máscara se sale para no comerse la cabeza.
- **Fondo aparte:** Mosaico con movimiento 200/200 + espejo, más un 35 % del movimiento contrario a la cabeza (el mundo se mueve) y el Offset que frena de la toma anterior.
- **Zoom** de ajuste S_BlurMoCurves centro (960, 450), Z Dist 1 → 0,62 en 26 fotogramas, rápido → lento ("bum, y se frena lento"). Tinción 100 → 0 al final.
- Usar un tramo en el que la cabeza no se salga del cuadro (al acercarse a cámara, la cabeza se cortaba arriba).

### 4.98 Eco fantasma y clones (Tanda 03 · 05)

- **Eco:** una precomp con el artista (cambia por dentro en cada fotograma) → en la toma, esa precomp DEBAJO del artista limpio.
  - Echo: tiempo −0,05 (1,5 fotogramas), **8 copias, intensidad 1, caída 0,7, operador 6 = Composite In Front**.
  - Desenfoque gaussiano 10, opacidad 80.
- **Clones:** precomp con dos copias del artista. A mitad de toma salen a ±470 px (rápido → lento) y vuelven al final (lento → acelera), opacidad 85, desenfoque de movimiento (también en la precomp).
  - La precomp va dos veces: limpia y debajo con el mismo Echo + desenfoque (70 %).
- Si el artista entra desde un lado, **la precomp de clones recibe la misma entrada**: si no, los clones se ven quietos en el centro mientras el artista llega.
- Zoom de ajuste a la vez: Z Dist 1 → 0,86 → 1 (rápido → lento → rápido). Es un zoom ADENTRO: al alejar se verían los bordes cortados de los cuerpos.

### 4.99 Shakes y flashes en los golpes (Tanda 03 · 05)

- **Shake:** capa de ajuste de 14 fotogramas con **S_Shake**:
  - Amplitude 0 → pico → 0 (fotograma −2 → golpe → +10), curva rápido → lento.
  - El pico es un multiplicador: 1 = X 192 px / Y 96 px. Probado: 0,25–0,3 en golpes pequeños y 0,8–0,9 en los grandes.
  - Frecuencia 12; **Motion Blur 1** ("siempre motion blur").
  - Pulso de brillo: Deep Glow 450 / 0,35 con **Mix (`PEDG2-0082`) 0 → 30 → 0**.
- **No juntar brillos:** sin pulso donde ya hay flash o aparece un aura. Juntos, la imagen se pone lechosa.
- **Flash:** capa de ajuste de 8 fotogramas con Niveles fijo en "quemado" (blanco de entrada 0,45, gamma 1,3), animando la **opacidad del efecto** 0 → 100 → 0. Por script, Input White y Gamma no aceptan keys.
  - Probado: con 0,28 / 1,5 el flash del camión era una explosión blanca.

### 4.100 Transiciones con el artista: al revés, teletransporte, entrar y salir, giro, meterse en un objeto (Tanda 03 · 05)

- **Clip al revés (Ctrl+Alt+R) por script: con Time Remap**, de tClip hacia atrás (`capaAlReves()`). Con *Estirar* negativo, AE da la vuelta también a las keys de la capa.
- **Teletransporte:** el artista del clip anterior, al revés, durante 15 fotogramas, con keys de **retención** de opacidad (on 2, off 1, on 2, off 2, on 1…, el último al 60 %). Mientras, el clip siguiente sale del negro (opacidad 0 → 100 en 18 fotogramas).
- **Sale por la izquierda:** el artista anterior al revés, Posición 960 → −1250 en 12 fotogramas (lento → acelera), desenfoque de movimiento + shake en el corte.
- **Entra por la derecha:** el artista nuevo +1500 → 0 en 12 fotogramas (rápido → frena), desenfoque de movimiento. El fondo, al 35 % mientras entra.
- **Giro:** Rotación −360 → 0 en 22 fotogramas (rápido → frena) + desenfoque de movimiento + Mosaico con movimiento 200/200 en espejo.
- **Meterse en un objeto:**
  1. Fotograma congelado (Time Remap con UNA key) con el objeto recortado: máscara de 4 puntos, invertida, calado 4.
  2. Debajo, el clip siguiente.
  3. Zoom S_BlurMoCurves **en la capa congelada** (no en una de ajuste, para que lo de dentro no se amplíe): centro en el objeto, Z Dist 1 → 0,1 en 20 fotogramas, curva lento → acelera, Rotate 0 → 10.
  4. Shake + flash al entrar.
  - Lo de dentro: tinción 60 % y desenfoque 18 que se quitan al entrar. Con 100 % y 60, por un agujero pequeño se veía un bloque gris.
- **Congelar al final:** Time Remap con una key en el último golpe con salida HOLD; luego, fundido a negro.

