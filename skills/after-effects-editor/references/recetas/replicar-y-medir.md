# Recetas · Replicar un vídeo de referencia y medir

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.54 Método para replicar un anuncio "literalmente igual" (medir, no adivinar)
- 4.55 Réplica v2: lo que hace que una réplica "se parezca de verdad" (lecciones del rehecho de Glass Health)
- 4.69 Replicar desde una grabación de pantalla (lecciones de la clase 12)
- 4.82 Medir un rebote de la referencia (método de la Tanda 03 · 02) — solo si hace falta

### 4.54 Método para replicar un anuncio "literalmente igual" (medir, no adivinar)

> **Desde el 30/09/2026 el usuario pide APRENDER, NO CALCAR** (2.0f, 4.82, CLAUDE.md). Este método solo se usa si él pide expresamente una copia exacta. Por defecto: construir como enseña el profe, comparar a ojo y dedicar el tiempo a entender.

1. **Referencia limpia** a sus fps reales + detección de cortes + hojas numeradas por escena (`hoja_ref.py`).
2. **Medir el movimiento:**
   - elementos planos que se mueven, giran o escalan: `rastrear_rot.py` (plantilla con ángulo y escala, correlación normalizada con FFT y refinado fino);
   - paneos: rastrear un elemento;
   - perspectivas: 4.52.
3. **De la medida a los keyframes:**
   - `ajuste_multi.py` ajusta N keys (tiempo, valor, velocidad e influencias) a la curva medida: pocas keys, editables y con la "firma" de las curvas del original;
   - ⛔ **nunca keys por fotograma copiadas del rastreo:** el ruido de la medida se ve como temblor. Para movimientos complejos, un **rig** (4.51) o varias curvas simples.
4. **Colores:** muestrear el original en puntos concretos (`muestras.py`). En la réplica, medir con el mismo script cuánto más claro u oscuro está cada punto.
5. **Comparar siempre:** hojas ORIGINAL | RÉPLICA (`comparar_video.py`) en los mismos fotogramas, sobre todo **antes y después de cada corte**. Iterar hasta que no haya diferencias claras.
6. **Construir por script:** una librería del proyecto + un script por escena + scripts de "fix" pequeños. Todo se puede rehacer.
7. **Medir también lo que no es cámara** (4.55): tamaños (logos), tiempos (palabras), color por zonas, luz del halo y nitidez de bordes.

### 4.55 Réplica v2: lo que hace que una réplica "se parezca de verdad" (lecciones del rehecho de Glass Health)

En la v1, del segundo 7 al final "no se parecía nada". Qué lo arregló (detalle en el APRENDIZAJE de la Tanda 02, sección 8):
- **Temblor = keys por fotograma.** Curvas ajustadas o rigs rígidos. Comprobar con `suavidad.py` (temblor < 0,3 px).
- **Glow cortado = precomp justa.** Márgenes de +200 px; al agrandar, AE mueve el ancla de las capas que la usan: fijarla otra vez.
- **Sin motion blur** si el original no lo tiene (mirar un paneo rápido a 1:1).
- **Luz y color por zonas:**
  - `luz_fondo.py` (rejilla con máscara de paneles);
  - `colores_region.py` (color medio y del 3 % más claro);
  - `energia_lineas.py` (contraste de líneas finas frente a neblina).
  - Se corrige hasta ±5–15 niveles.
- **Nitidez:** `nitidez.py` (energía de bordes). Si el original está más blando, **Box Blur** en la precomp (el Gaussian Blur no se aplicó en una precomp grande escalada).
- **Onda en malla** (hebras que se cruzan): N hebras entre dos envolventes medidas, con peso lineal w = base + pendiente·u (cada par se cruza una vez). Neblina = copia con trazo ancho y desenfocado.
- **Objeto 3D que gira** (anillo): elipse de la silueta por momentos (`elipse_anillo.py`).
  - Eje mayor = diámetro (escala).
  - Razón menor/mayor = inclinación: calibrarla con el objeto propio, que no es infinitamente fino.
  - Ángulo del eje mayor = eje de giro en pantalla.
  - Montaje: nulo EJE (Z) → nulo INCLINACIÓN (X) → objeto (Z = −eje).
- **Material de cristal con el renderizador C4D** (no tiene transparencia: "property is hidden"): entorno de estudio con ventanas y tiras de luz (`entorno_estudio.py`) + Tritone (luces cian-blancas, medios azul rey, sombras azul noche).
- **Frase palabra a palabra:**
  - `medir_frase.py` da los bloques de texto y el anillo por fotograma;
  - palabras de golpe;
  - el grupo salta (retención) y se asienta con curva de salida;
  - el objeto intermedio, con su propia x medida.
- **Destello de palabra:**
  - LUZ GRANDE DETRÁS: elipse ~900×300, Box Blur 110, opacidad 34 → 14 → 4 → 0 en 3 F;
  - Deep Glow corto en la palabra con **Mix → 0 en reposo** (a exposición 0 el Deep Glow sigue brillando);
  - desenfoque horizontal de 6 px durante 1 F.
  - Quemar la palabra = "explosión".
- **Logo que se forma:** medir su tamaño por fotograma y diseñar las keys para esa curva (en el original crece durante ~20 F, no en 4). Comprobar que no toca el texto.
- **Degradado radial en un título:** Ramp con forma radial; los puntos, en **coordenadas de la comp** (en texto o forma, que se rasterizan de forma continua).
- **Escenas que "cambian de look"** (un plano más gris): capa de ajuste dentro de la precomp, activa solo en ese tramo (opacidad por expresión según `time`) y **debajo** de lo que debe conservar el color.
- **Revisión final:** hojas 1:1 por escena + `saltos.py` (saltos entre fotogramas que el original no tiene) + ver el render entero.

### 4.69 Replicar desde una grabación de pantalla (lecciones de la clase 12)

1. **Velocidad del reproductor:** la referencia de la clase iba al **0,8x**.
   - Pistas: 1 de cada 5 fotogramas repetido y la barra de progreso más lenta que el reloj.
   - Todos los tiempos medidos salían un 25 % largos.
   - Comprobarlo SIEMPRE con `velocidad_reproduccion.py` antes de medir tiempos.
2. **Rebobinados y saltos:**
   - Si la posición medida retrocede, el profe rebobinó.
   - Si da un salto imposible en un fotograma, el reproductor se saltó fotogramas.
   - Medir con el tramo limpio.
3. **Medir el contenido, no solo la caja:** los separadores del original estaban 23 px a la izquierda del centro del panel.
4. **Leer los ajustes exactos del profe** en su interfaz: `recortes_ui.py` (Controles de efectos, Propiedades, regla con las claves).
5. **Curvas:** `ajustar_curva2keys.py` (2 claves con influencias) o `ajuste_multi.py` (con velocidades).
6. **Comprobar con un render a resolución completa** si hay líneas finas que brillan (receta 4.65).

### 4.82 Medir un rebote de la referencia (método de la Tanda 03 · 02) — solo si hace falta

> **Regla del usuario (30/09/2026): APRENDER, NO CALCAR.** Esta clase me llevó horas por medir al píxel una animación de 5 s. No se repite: la réplica se hace como la enseña el profe, se compara a ojo y se arregla lo que se note. Esto de abajo queda como caja de herramientas para cuando haya que medir algo concreto (un tamaño, un tiempo), no como método por defecto.

Lecciones de las medidas que sí sirven para entender:
- **Con desenfoque fuerte, el rastreador engaña:** un objeto rápido y borroso se midió hasta 9 px mal. Para comparar una réplica con el original es más fiable **deslizar mi render sobre el original** (`desfase_F.py`, en `Tanda 03…/02 Dominando las curvas/_material/scripts/medidas/`): los dos tienen el mismo desenfoque.
- **Mirar la estela:** un remolino borroso donde mi versión sale nítida = allí el original gira mucho más rápido (así apareció la vuelta extra del salto final).
- **El H.264 de AE sale sin etiqueta de color** (trampa en la sección 5): si no se lee como BT.709, los rojos salen más oscuros y parece que el color está mal cuando no lo está.

1. **El objeto pequeño que gira**: el rastreo de gradientes se pierde entre letras del mismo color.
   - Separar por color y por componentes conexas.
   - Leer el giro **a ojo** en ampliaciones ×5 (hoja de recortes).
   - Afinar con correlación normalizada contra el objeto dibujado con **su propia fuente** (PIL + el .ttf), ampliado ×3, buscando ±25° alrededor de lo leído.
   - Resultado: posición del **centro de la caja** (el ancla), giro y escala por fotograma.
2. **Quitar el zoom global** antes de ajustar: medir el alto de las letras quietas (recta en el tiempo) y pasar todo a coordenadas de la comp interior.
3. **Ajustar las keys con el modelo de AE** (`ajuste_posicion_ae.py`): primero libre, para ver el patrón; después **con el patrón de la clase fijado** (F9 en la salida, 0 px/s), que pierde casi nada (1,64 frente a 1,40 px).
4. **Aplastado:** con la parte de **abajo** de la letra (la F nunca la tapa), buscando la escala Y que superpone la letra sin aplastar. Donde la F tapa la parte de arriba, lo de arriba engaña.
5. **Entradas rápidas y borrosas:** **kimógrafo** (x frente al tiempo) y **ajuste global**: todas las letras con la misma curva, escalonadas, sintetizando el perfil con desenfoque de movimiento.
6. **Keys en fotogramas enteros** para que la línea de tiempo se entienda. Reajustar con los tiempos fijos pierde poco: giro 2,25° frente a 2,22°.

