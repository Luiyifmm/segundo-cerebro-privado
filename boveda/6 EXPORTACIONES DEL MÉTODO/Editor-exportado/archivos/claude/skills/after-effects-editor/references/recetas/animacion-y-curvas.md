# Recetas · Animación, keyframes y curvas

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.5 Aparición con rebote (pop) por keyframes
- 4.31 Aparición en escalera de una precomp ya hecha
- 4.43 Keyframe continuo y corte de acción por script (Tanda 02)
- 4.77 El "pique": rebote con posición unificada y el gráfico de velocidad (Tanda 03 · 02, medido)
- 4.78 Letras que reciben el golpe: aplastado y relleno (Tanda 03 · 02, medido)
- 4.79 Entrada en escalera "con fuerza" y zoom lento (Tanda 03 · 02, medido)
- 4.81 Las curvas de Flow del usuario, por script
- 4.83 Enseñar la velocidad en un render: eco + puntos de fotograma + gráfico dibujado (Tanda 03 · 03)
- 4.84 Rebote con gravedad exacta: una parábola por tramo (Tanda 03 · 03)
- 4.85 Entrar, salir y lanzar sin "frenazos falsos" (Tanda 03 · 03)

### 4.5 Aparición con rebote (pop) por keyframes

- Escala 0 → 110 → 97 → 100 en 0,55 s, con suavizado 60 %. Escalonar 0,1 s entre elementos.
- Texto: opacidad 0→100 y subida de 20–30 px, con suavizado de salida 80–85 %.

### 4.31 Aparición en escalera de una precomp ya hecha

- Duplicar la precomp, asignar cada capa a su fila por su Y y darle un keyframe de entrada (opacidad + desplazamiento de 60 px) con un desfase de 1,2–1,6 s por fila, al ritmo de la voz.

### 4.43 Keyframe continuo y corte de acción por script (Tanda 02)

- Posición con suavizado temporal: `prop.setTemporalEaseAtKey(k, [new KeyframeEase(vel, infl)], [new KeyframeEase(vel, infl)])`.
  - Para una key **continua**, la misma velocidad a los dos lados.
  - Para posiciones espaciales, 1 sola dimensión (velocidad = px/s a lo largo del recorrido).
- **Propiedades 1D (rotación, opacidad…): la velocidad lleva signo.** Si el valor baja, la velocidad es negativa; si se pone positiva, sale un rebote.
- **Corte de acción:**
  - última key del plano con **influencia de entrada 1–5 %** y velocidad alta (≈5 × recorrido/s);
  - primera key del plano siguiente con **influencia de salida 1–5 %** y velocidad alta;
  - el corte, justo entre las dos.
- **Punto lento continuo:** velocidad 50–150 px/s en el mundo, que en pantalla queda < 50 px/s; influencias 80–100 %.
- Ajustar estas cifras a una curva medida: `scripts/ajuste_multi.py` (receta 4.54).

### 4.77 El "pique": rebote con posición unificada y el gráfico de velocidad (Tanda 03 · 02, medido)

Una letra (o cualquier objeto) que salta de sitio en sitio. **Medido en el original de la clase** (error de 1,4–1,6 px por salto):
- **Keys:** una en cada aterrizaje y una en cada cumbre (el "esqueleto": primero todos los sitios y alturas, luego las curvas).
  - Alturas distintas en cada salto; si todos son iguales, "queda robot".
- **Trayecto:**
  - aterrizajes en **esquina** (sin tiradores);
  - cumbres con **tiradores horizontales** de ~45–56 px a cada lado (Pluma **G** en la clase: "la combita").
  - Si el objeto va de derecha a izquierda, los tiradores se invierten (entra +x, sale −x).
- **Velocidad**, posición unificada = gráfico de velocidad a lo largo del trayecto:
  - **salida del aterrizaje:** F9 tal cual (0 px/s, 33 %);
  - **cumbre:** 0 px/s con **influencia 90–100 % a los dos lados**. Se queda ~5 fotogramas casi quieta ("suspendida en el aire");
  - **llegada al aterrizaje:** 0 px/s con **poca influencia (7–21 %)**. En el gráfico sale un pico altísimo justo antes de la key y cae a 0 en la key: **el pique** ("lento… y de golpe rápido");
  - **primera caída** (desde parada): la F aparece solo con opacidad (0 → 100 % en 6 fotogramas, sin crecer), sale de 0 px/s con 57 % y llega **de golpe** (llega a ~2 560 px/s con 12 %).
  - **Pausa antes del salto grande:** en la última letra se posa y se queda quieta 1–2 fotogramas (dos keys en el mismo sitio) antes de despegar.
- **Giro:** keys en los aterrizajes (fotogramas enteros). +360° por salto, con variaciones: **+180° para caer de cabeza**, y el salto final **dos vueltas hacia atrás (−720°)**. En la clase dice "una", pero el acabado da dos: con motion blur, los fotogramas del centro son un remolino. Un pequeño pasarse de 4° al aterrizar da vida.
- **Aplastado del que golpea:** al posarse en su sitio, la F baja al 85 % de alto (solo Y) y vuelve en 7 fotogramas, con la curva de cumbre (0 %/s, influencias ~90 %). Como su ancla de capa está en el centro (para girar), el aplastado va en el **Transform del grupo** de la forma, con el ancla del grupo en la base de la letra.
- **Por qué posición unificada y no X/Y separadas:** en la cumbre el objeto frena en x y en y a la vez. Con dimensiones separadas seguiría avanzando de lado.
- Para ajustar estas keys a una referencia medida: `ajuste_posicion_ae.py` (sección 5b).

### 4.78 Letras que reciben el golpe: aplastado y relleno (Tanda 03 · 02, medido)

- **Montaje:**
  - texto **solo con trazo** → *Create Shapes from Text* → una capa por letra (Motion Tools o `separarLetras()` de ae_lib);
  - el grupo de cada letra trae **Fill 1 apagado**: se enciende con opacidad 0;
  - **ancla abajo** (`anclarEn(capa, 0.5, 1)`).
- **Aplastado solo en Y** (escala desenlazada):
  - 100 % un fotograma antes del contacto → **87–93 %** en el contacto y el siguiente → 100 % en 2–3 fotogramas;
  - la letra más fina (la I) llega al **75 %**; la última (N, trampolín del salto grande) se queda aplastada ~89 % durante 4 fotogramas, mientras la F hace la pausa;
  - a veces empieza **un fotograma antes** de que llegue la F (la Ó): "un keyframe de diferencia, que no se note".
- **Relleno:** Fill Opacity de 0 a 100 en **2 fotogramas** (3 en la I y la N), lineal, empezando en el contacto (en la clase: "un fotograma antes").
- Hacerlo **en lote**: copiar la escala a todas y buscar "opacity" con Ctrl+F en la línea de tiempo.

### 4.79 Entrada en escalera "con fuerza" y zoom lento (Tanda 03 · 02, medido)

- **Entrada:** las letras entran desde fuera por la izquierda:
  - **~1070 px en ~17 fotogramas**, con un fundido de 0 a 100 % en los 10 primeros (así no aparecen de golpe en el borde);
  - salida a **8,6× la velocidad media** con 12 % de influencia, y llegada a 0 con **79 %**. Es casi la curva "Pa arriba" del usuario [0, 1, 0, 1];
  - salen **casi juntas** y llegan **en escalera de 2 fotogramas** ("escaleritas" en las keys de llegada), la última letra de la palabra primero (la A, primera de la palabra, llega la última);
  - con motion blur, los primeros fotogramas son solo una estela pálida.
- **Concatenar:** la F cae sobre la A cuando esta termina de llegar.
- **Zoom lento:** 2 keys **lineales** de principio a fin (+18,8 % en 5,1 s en el original; "a 110, más o menos" en la clase). Centro en la palabra. En el original **también crece el degradado del fondo** (su radio pasa de 919 a 1 084 px): se consigue atando los puntos del Gradient Ramp al zoom con `toComp` (radio × escala/100).

### 4.81 Las curvas de Flow del usuario, por script

- Flow guarda cada curva como cubic-bezier **[x1, y1, x2, y2]**.
- **Conversión exacta** (`flowCurva(prop, k, curva)` en ae_lib.jsx):
  - salida de la key k: influencia = x1 y velocidad = (y1 / x1) × velocidad media;
  - entrada de la key k+1: influencia = 1 − x2 y velocidad = ((1 − y2) / (1 − x2)) × velocidad media;
  - x = 0 o 1 es un tirador vertical: 0,1 % de influencia.
  - En posición unificada, la velocidad media = largo del trayecto / duración.
  - **Probado: error máximo 0,2 %** en posición y en giro.
- **Sus curvas:**
  - **"Pa arriba" [0, 1, 0, 1]:** hace el 91 % del recorrido en el primer sexto: entra con fuerza y frena largo;
  - **"6" [1, 0, 1, 0]:** al revés, arranca lento y acaba a tope (curva de salida para un corte de acción);
  - **"medio" [1, 0, 0, 1]:** S de 100 %.
- Comp de demostración: "Tus curvas de Flow" en el proyecto de la clase.

### 4.83 Enseñar la velocidad en un render: eco + puntos de fotograma + gráfico dibujado (Tanda 03 · 03)

Para explicar una animación (tutoriales, explicativos, "antes y después"):
- **Eco en una CAPA DE AJUSTE** encima: Echo Time −1/30, 10–12 copias, Decay 0,78–0,8, operador *Composite In Back* (5).
  - En la propia capa que se mueve por Transformar no deja estela: los efectos van antes del movimiento.
- **Puntos de fotograma** (lo que AE dibuja en el visor y no sale en el render): por script, la posición de la capa en cada fotograma con `valueAtTime` → una capa de forma con un círculo de 7 px en cada sitio (`puntosFotograma()` de `teclas_lib.jsx`).
- **Gráfico de velocidad dibujado en la comp** (`grafVelocidad()`): se muestrea la velocidad (cada ¼ de fotograma), se dibuja la curva en un panel y un cabezal (punto blanco con borde) la recorre con `length(position.velocityAtTime(t))`.
  - Muestrear DENTRO del tramo (±0,003 s de las keys): en la key justa, la diferencia mezcla el antes y el después.
- **Gráfico de altura** de un rebote (arriba = alto): muestra los "puentes" de la gravedad.
  - En el gráfico de valor de AE sale al revés, con el suelo arriba.
- **Figuras con la forma del icono de key** (`capaIcono(comp, nombre, tipoIzq, tipoDer, r, color, pos)`): tipos "lin", "bez", "hold" y "auto".
  - Dos mitades de dos tonos: la de llegada, un 22 % más oscura.

### 4.84 Rebote con gravedad exacta: una parábola por tramo (Tanda 03 · 03)

- **Dimensiones separadas** (`position.dimensionsSeparated = true`): X por su lado, Y con las keys de la física.
- **Cada tramo (suelo ↔ cumbre) es una parábola exacta** si:
  - las dos keys llevan **influencia 33,33 %**;
  - la velocidad en el suelo es **v = 2 · altura / tiempo del tramo**;
  - en la cumbre la velocidad es 0.
- **Signos:** en el suelo, entrada **+v** (bajando, la Y crece) y salida **−v** (subiendo). Son los "tiradores rotos" de la clase.
- **Si ya venía cayendo a v₀** (entra de fuera de cuadro): v₁ = 2h/T − v₀.
- **Tiempos con la misma gravedad** (g ≈ 2400 px/s² a 1080p) y cada rebote perdiendo el 30 % de velocidad:
  - alturas 300 → 184 → 90 → 44 → 22 → 11 px;
  - medios tramos de 12, 8, 6, 4 y 3 fotogramas;
  - **redondeados a fotogramas enteros**; la velocidad se recalcula con el tiempo redondeado.
- **X:** entra ya con velocidad y **frena rodando** con Easy In (70 %) en la última key.
- Probado en una pieza propia (la pelota acaba como el punto final).

### 4.85 Entrar, salir y lanzar sin "frenazos falsos" (Tanda 03 · 03)

- **Entrar:** key de fuera con velocidad (≈ 1–1,3× la velocidad media del tramo; 1366 px/s en la clase), influencia 33 %. Key de dentro a 0 con **influencia 100 %**.
- **Salir:** key de dentro a 0 con **influencia 100 %**. Key de fuera con velocidad.
- **Lanzar en arco:**
  - sale con la velocidad de un tiro de verdad: subir H en T → v₀ ≈ 2H/T (≈1700 px/s para 830 px en 1 s);
  - en la cumbre, **key continua** (`setTemporalContinuousAtKey(k, true)`) con la velocidad lateral (~280 px/s);
  - influencias 33 %; trayecto con tiradores horizontales en la cumbre.
  - ⚠️ Con una salida enorme (4000 px/s) y 70 % arriba se queda "colgado" (meseta): los números de la clase dependen del tamaño y del tiempo de su ejemplo.
- **Rove Across Time por script:** `p.setRovingAtKey(k, true)` en las keys del medio (ni la primera ni la última). Luego, una curva en los extremos: `claveEase(p, 1, 0, 33, 2600, 20)` y `claveEase(p, n, 0, 90, 0, 33)` = el billar (sale fuerte y frena a lo largo de toda la ruta).
- **Easy Out / Easy In "de verdad"** (como el Asistente de keys: solo una mitad):
  - poner la curva;
  - después `setInterpolationTypeAtKey(1, LINEAR, BEZIER)` (Easy Out) o `(2, BEZIER, LINEAR)` (Easy In).

