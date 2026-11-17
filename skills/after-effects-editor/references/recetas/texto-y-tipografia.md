# Recetas · Texto y tipografía animada

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

Contenido:
- 4.9 Texto 3D extruido nativo
- 4.11 Contador numérico animado (sin plugins)
- 4.14 Resaltar palabras dentro de un texto
- 4.25 Subtítulos animados palabra a palabra (animadores de texto)
- 4.26 Texto "de terror" y "romántico"
- 4.35 Emojis en color para AE
- 4.36 Texto en onda (bandera) + texto 3D extruido falso
- 4.49 Texto que aparece por palabras o por líneas (selector de expresión)
- 4.64 Créditos de director elegantes ("DIRIGIDO POR …")
- 4.73 HUD de interfaz con Source Text por expresión
- 4.86 Texto que se escribe con keys de RETENCIÓN (máquina de escribir sin expresiones)
- 4.87 Letras que aparecen cuando algo pasa por encima (evento leído de otra capa)

### 4.9 Texto 3D extruido nativo

- Comp con renderizador **Cinema 4D** (`comp.renderer = "ADBE Ernst"`). Con `"ADBE Advanced 3d"` (que es el Classic 3D) la extrusión queda oculta.
- Texto 3D: Geometry Options → Extrusion Depth 40–60, bisel (Bevel Style 2, profundidad 4). Material: especular 80, brillo 40, reflexión 25. **Luces:** puntual de color (rosa) + blanca frontal + ambiente 45 %.
- **Los efectos no se aplican a la capa extruida:** el Glow va en una **capa de ajuste enmascarada** encima.
- Entrada: rotación Y −70°→−18° (0,8 s, suavizado 85 %) + vaivén `value + 4*Math.sin(t*1.2)`.

### 4.11 Contador numérico animado (sin plugins)

- Source Text con expresión: `"$" + Math.round(easeOut(time, 0.3, 1.5, 0, 30)) + "M"`. Para miles: `.toLocaleString()` no existe en ES3, así que se formatea a mano o se usa el efecto nativo "Numbers".

### 4.14 Resaltar palabras dentro de un texto

- `var d = td.value; d.characterRange(i0, i1).fillColor = color; td.setValue(d);` (AE 2024+). Sin duplicar capas.

### 4.25 Subtítulos animados palabra a palabra (animadores de texto)

- Animador 1 "Pop": propiedades Escala 0 % + Opacidad 0. Selector: Units = Porcentaje (1), Based On = **Palabras (3)**. Start 0→100 % en 0,5–0,7 s (una línea).
- Animador 2 "Palabra clave": Fill Color amarillo. Selector con **Units = Índice (2)** (si no, Index Start/End están ocultos) y Based On = Palabras. Index Start = n−1, End = n.
- Contorno: `doc.applyStroke = true; doc.strokeWidth = 10; doc.strokeOverFill = false`.

### 4.26 Texto "de terror" y "romántico"

- Terror: Burbank Big Condensed Black roja, **Turbulent Displace** (cantidad 14, tamaño 18), gotas (rectángulo redondeado + bola, escala Y 0→100 lenta desde el borde) y salpicadura de círculos.
- Romántico: caligrafía (Segoe Script) roja + corazón que late (`s = 100 + 8*max(0, sin(t*6))`).

### 4.35 Emojis en color para AE

- AE pinta Segoe UI Emoji en monocromo. Se renderizan a PNG con `_material/emojis/generar_emojis.py` (clase 11). El script usa:
  - Pillow + `embedded_color`;
  - fontTools para los tonos de piel y ZWJ.
- Se importan como footage (PNG sin diálogos).
- Estilo "3D emoji" sobre fondo crema: sombra larga y suave (distancia 18, suavidad 38, 28 %, 135°, color marrón).

### 4.36 Texto en onda (bandera) + texto 3D extruido falso

- **Onda:** animador con Position `[0,−22]` + Rotation 7 y **selector de expresión**: `100*Math.sin(time*4.5 + textIndex*0.45)`. La entrada va con otro animador (Opacidad 0 + desplazamiento, Start 0 → 100 %).
- **Extrusión falsa:** precomp con el texto 2D. Luego 12–16 copias 3D de la precomp separadas 9–12 px en Z, la cara delantera con color y glow y las de detrás con Fill más oscuro.
  - Color que cambia: `pal[Math.floor(time*4) % pal.length]`.
  - Look "chunky": Burbank Big Condensed Black.
- $ dorado: texto con Ramp (#FFF7B8 → #C98208) + Bevel & Emboss, dentro de una precomp. Encima, 8 copias en Z con Fill dorado oscuro.

### 4.49 Texto que aparece por palabras o por líneas (selector de expresión)

- Animador con **Opacity 0 + Blur (8–20)** (+ posición Y 18 px si "sube"). Selector de expresión con *Based On*: 3 = palabras, 4 = líneas.
- **Amount:**
  ```
  var t0 = 26/30, dt = 1.15/30, d = 6.5/30;
  var p = clamp((time - (t0 + (textIndex-1)*dt)) / d, 0, 1);
  p = 1 - Math.pow(1 - p, 1.5);
  (1 - p) * 100;
  ```
- **Ritmos medidos:**
  - pregunta: 1,15 F entre palabras y 6,5 F de fundido;
  - respuesta: 2,8 F entre líneas y 22 F de fundido;
  - editor: 2 F entre líneas.
- **Espacios más estrechos:** otro animador con *Tracking Amount* −3/−4 y el selector `(text.sourceText.charAt(textIndex-1)==' ') ? 100 : 0` (Based On = caracteres).
- **Negrita en parte del texto:** `d.characterRange(0, n).font = "SFProDisplay-Bold"` (AE 26.5).

### 4.64 Créditos de director elegantes ("DIRIGIDO POR …")

- **Fondo negro.**
- **Texto:**
  - "DIRIGIDO POR": Gotham Book, 30 px, tracking 800, #8E96A0;
  - nombre: Gotham Light, 132 px, tracking 420, #EDE3D2.
- **Animación:**
  - "DIRIGIDO POR" entra con fundido y desenfoque de 10 a 0 en 0,8 s;
  - el nombre se enciende parpadeando como un tubo (claves HOLD: 0 → 70 → 0 → 100 → 25 → 100 en 0,25 s);
  - acercamiento 100 → 104 % durante los 4 s.
- **Brillo:** Deep Glow 2 tintado cálido (#FFB45A, modo 2), radio 260, exposición de 0,8 a 0,2 al encenderse.
- **Salida:** fundido con desenfoque de 14 en 0,7 s.

### 4.73 HUD de interfaz con Source Text por expresión

- **Máquina de escribir:**
  ```
  s.substr(0, Math.floor((time - inPoint) * 26)) + cursor
  ```
  El cursor es `(Math.floor(time*3) % 2 == 0) ? "▌" : " "`.
- **Contador con ceros:**
  ```
  (n < 10 ? "00" : (n < 100 ? "0" : "")) + n + "%"
  ```
  Su color va con un efecto Relleno (Fill) con expresión.
- **Número enorme con puntos de miles:**
  ```
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  ```
- **Números que cambian 10 veces/s:**
  ```
  posterizeTime(10); seedRandom(index, false); Math.floor(random(10000, 99999))
  ```
- **Reloj:**
  ```
  "T+" + timeToTimecode(time)
  ```
  El punto que parpadea es `Math.floor(time*4) % 2 ? "●" : "○"`.
- **Dos colores en una línea** (nombre blanco + "BAJO CONTROL" rojo): `textDocument.characterRange(a, b).fillColor`.
- **Todo el HUD se va** multiplicando su opacidad por `(1 − TITULO)`.
- ⚠️ **Esquinas y marcos del HUD 26 px POR FUERA del margen de los textos.** En el mismo x/y, la línea tacha las letras (pasó con "DISPOSITIVOS" y con el reloj).

### 4.86 Texto que se escribe con keys de RETENCIÓN (máquina de escribir sin expresiones)

- Animador de texto con **Opacidad 0** y un selector de rango.
- **Start** de 0 a 100 %: una key por carácter (`100·i/n`), **cada una en HOLD**. El texto aparece a saltos, letra a letra.
- Un fotograma por letra = 30 letras/s.
- Las retenciones se ponen al final: `setTemporalEaseAtKey` las quita.

### 4.87 Letras que aparecen cuando algo pasa por encima (evento leído de otra capa)

- El script recorre los fotogramas y busca cuándo la X de la pelota cruza el centro de cada letra (`px.valueAtTime`). Ahí pone la aparición de la letra.
- **Aparición:** ancla en la base, escala [70, 0] → [104, 114] → [100, 100] en 11 fotogramas, con salida suave y llegada larga. Opacidad 0 → 100 en 3 fotogramas.
- Si cambian las curvas de la pelota, se vuelve a lanzar el script y las letras se recolocan solas (como los eventos del 4.71).

