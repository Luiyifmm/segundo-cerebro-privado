---
tipo: pruebas de diseño
trabajo: 6887-08
fecha: 2026-11-08
estado: propuestas para valorar (NADA aprobado; la secuencia del usuario no se ha tocado)
---
# 6887-08 · Subtítulos «Jordan»: tres alternativas sobre el fragmento 1,87–8,30 s

- **Referencia:** [[1 REFERENCIAS/Analizadas por Claude/2026-11-08 jordan referencia principal/LEEME]] (análisis fotograma a fotograma).
- **Vídeos:** `3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/pruebas Jordan/`:
  - `comparativa Jordan + A B C v2 (ligera).mp4`: 3 s de la referencia y luego A, B y C seguidas;
  - `Jordan A fiel v2.mp4`, `Jordan B adaptado v2.mp4` y `Jordan C cinematografico v2.mp4`, en alta calidad;
  - `hoja A-B-C v2.png`.
- **Secuencias editables** (en `Amin · copia Claude 6887-08.prproj`):
  - «6887-08 · JORDAN A fiel», «… B adaptado» y «… C cinematografico»;
  - son duplicados de la secuencia del usuario: sus cortes, su audio, su color y su velocidad no se tocan;
  - los subtítulos antiguos (V3) están desactivados, no borrados; los nuevos van en V6 (línea 1) y V7 (línea 2).

## 1. La plantilla nueva: `Subtitulo Jordan v4.mogrt` (todo editable en Premiere)
- **Fuente:** script `~/Videos-Remotion/ae/mogrt-jordan.jsx`; plantillas en `clientes/_plantillas/`.
- **Letra:** Avenir Next Bold, 168 px a 4K, interletrado −10, centrada.
  - Poppins (la más parecida a la referencia) no está instalada; instalarla requiere permiso.
- **Controles de la plantilla:**

| Control | Qué hace | Valor por defecto |
|---|---|---|
| Texto | Una línea. La segunda línea es otro clip en otra pista | — |
| Color del texto / Color resaltado | Blanco / #F5C542 | |
| Resaltar desde la palabra n + Palabras resaltadas | Amarillo **dentro de la línea** (p. ej. palabra 3, 1 palabra) | 1 / 0 |
| Retraso por palabra (f) | Escalonado: cada palabra empieza n fotogramas después de la anterior | 2 |
| Fundido de cada palabra (f) | Duración del fundido de cada palabra (curva de salida suave) | 2 |
| Desenfoque de entrada / Subida de entrada (px) | Opcionales, para la versión cinematográfica | 0 / 0 |
| Letras en orden aleatorio + Duración (f) | Revelado letra a letra al azar que sube (énfasis tipo «skill» / «10 years») | no / 9 |
| Tamaño / Altura / Sombra | 50 = normal; sombra negra muy difuminada (difuminado 40, distancia 10) | 50 / 50 / 35 |

- **Comprobado en fotogramas de Premiere:**
  - las palabras aparecen en su sitio final, sin re-centrar la línea;
  - el amarillo cae en la palabra indicada;
  - desde la v4, la primera palabra se ve ya en el primer fotograma del bloque (en la v3 quedaba un fotograma vacío entre bloques).
- **Errores encontrados y corregidos al construirla:**
  - v1: el selector de expresión devolvía un número y AE espera tres valores, así que el texto era invisible;
  - v2: la variable `E=thisComp.layer().effect` no funciona como función;
  - v3: fotograma vacío al cambiar de bloque.

## 2. Sincronía (medida, no escuchada)
- **Inicios de frase:** arranques medidos en la **forma de onda** de la versión del usuario:
  - Ponte 1,865 · forma 2,255 · deja 2,61 · cero 3,285 · busca 4,565 · donde 5,49 · deja 6,57.
- **Dentro de la frase:** WhisperX −0,03 s. En este material, WhisperX va 0–50 ms tarde en los inicios de frase, y 130 ms en «donde».
- **Adelanto como Jordan** (que adelanta 0,05–0,3 s): A 5 f (0,17 s) · B 3 f (0,10 s) · C 4 f (0,13 s).
- **Cambio de bloque:** corte seco, igual que en Jordan.
- **NO VERIFICADO de oído.** Lo único comprobado en fotogramas es que ninguna palabra aparece después de oírse según estas marcas.

## 3. Las tres alternativas
| | A · Jordan fiel | B · Jordan adaptado | C · Jordan cinematográfico |
|---|---|---|---|
| Tamaño (alto de línea medido) | 3,3 % (Jordan 3,1 %) | 3,05 % | 2,5 % |
| Altura de la x en un móvil 1080×1920 | 41 px | 37 px | 31 px |
| Posición | Pecho, y ≈ 0,62 | Algo más bajo, y ≈ 0,64 (todo sobre la camisa negra) | y ≈ 0,64 |
| Bloques | 2–3 palabras, con 2.ª línea amarilla de continuación («tú quieres estar», «de los demás») | Igual que A, sin remate en mayúsculas | 1 línea siempre, 2–3 palabras |
| Amarillo | Dentro de la línea en forma, móvil y mentor + remate **PORNO** en mayúscula (1,5×) | Dentro de la línea en forma, porno, móvil y mentor + líneas de continuación | Solo porno y mentor |
| Animación | Escalonado 2 f, fundido 2 f; remate de golpe | Escalonado 3 f, fundido 3 f, subida 12 px | Escalonado 3 f, fundido 5 f, desenfoque 8, subida 18 px |
| Sombra | 35 (como Jordan) | 15: el fondo ya es oscuro | 20 |

### Revisión crítica (mía; la decisión es del usuario)
- **A** es la más cercana a la referencia en tamaño, jerarquía y ritmo.
  - Sobra amarillo: Jordan resalta en uno de cada dos bloques y A, en casi todos.
  - «PORNO» se repite a la vez en la lista. Para el vídeo completo: 1 resaltado cada 2 bloques, 1 remate cada 6–10 s.
- **B** se lee igual de bien y es más tranquila. Pierde el golpe del remate, y la subida de 12 px se nota poco.
- **C** es la más elegante, pero en el móvil (31 px de altura de la x) queda en el límite, y el desenfoque retrasa la lectura. Impacto bajo para un vídeo de lista rápida.
- **Contraste medido:** blanco sobre la camisa ≈ 19:1; #F5C542 ≈ 12:1 de media y 4,5:1 en el peor caso. Fondo oscuro en toda la franja.
- **Recomendación:** A como base, con el amarillo reducido a la mitad de los bloques. B es la alternativa si se quiere menos golpe.

## 4. Título y lista: cómo compiten (propuesta, NO aplicada)
- **Hoy hay tres zonas de texto a la vez:**
  - título azul grande arriba;
  - lista pequeña a la izquierda (≈ 1,5 % del alto: **no se lee en el móvil**);
  - subtítulo grande en el pecho.
- **Dos acentos de color:** azul y amarillo compiten. El azul del título es lo más saturado del encuadre y se lleva la mirada.
- **Desfase:** en la versión del usuario, la lista entra entre 0,2 y 0,6 s tarde respecto a la voz (efecto de los cortes; ver [[6887-08 · APRENDIZAJE (tus cortes, 07-11)]]).
- **Propuestas, de más a menos cambio:**
  1. **Título** «TU VIDA EN **6 MESES**»:
     - que entre en el gancho con las letras al azar (como «10 years» de Jordan), grande, en blanco con «6 MESES» en #F5C542;
     - luego, que suba y se encoja a la cabecera, o que desaparezca a los 3 s.
     - Se quedaría un solo acento de color. Se conserva una versión azul para comparar, como pediste.
  2. **Lista:** o se agranda (≥ 2,2 % del alto, 4–5 puntos visibles y los antiguos atenuados) o se quita durante la lista y se enseña completa como resumen al final («guárdalo»). Con subtítulos de este tamaño, la lista duplica el texto.
  3. **Si la lista se queda:** sin amarillo en sus números (azul o blanco atenuado), para que el amarillo signifique «lo importante ahora».
  4. **Sincronizar la lista con la voz,** igual que los subtítulos.

## 5. Pendiente
- La valoración del usuario sobre A, B y C.
- Permiso para instalar Poppins (opcional).
- Decidir el título y la lista.
- Aplicar al vídeo completo **solo** cuando el usuario apruebe una versión.
