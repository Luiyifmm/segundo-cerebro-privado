# Expresiones: motor, idioma y biblioteca

> Lo esencial y los sistemas con capa CONTROL están en `recetas/expresiones-y-control.md` (4.70–4.76). Aquí van el motor, cómo hacerlas a prueba de idioma y una biblioteca lista para usar. Lo marcado *(informe)* viene de un informe externo y no se ha probado aquí.

## Motor y reglas
- **Dos lenguajes distintos:**
  - los **scripts** (lo que se lanza con `ae_run_script`) son ExtendScript **ES3**: sin `let`/`const`, sin funciones flecha, sin JSON;
  - las **expresiones** usan por defecto el motor **JavaScript** (ES2018, V8) en los proyectos nuevos desde la 25.0, que va hasta ~5× más rápido *(informe)*. Los proyectos viejos abren con el *Legacy ExtendScript*.
  - Para que una expresión valga en los dos: `var`, `function` y sin trucos modernos.
- **Con el motor JavaScript:**
  - `if/else` con sintaxis estricta; nada de `this_comp` ni `to_world`;
  - en texto, `text.sourceText.value`;
  - en `eval()` o en librerías .jsx, escribir `thisLayer.` delante *(informe)*.
- **A prueba de idioma** (AE en español traduce los nombres de efectos y parámetros):
  - nombrar los efectos propios con un texto que no se traduce ("CTRL_Tamaño") y leer el parámetro por índice: `effect("CTRL_Tamaño")(1)`;
  - las expresiones aceptan matchNames: `effect("ADBE Slider Control")("ADBE Slider Control-0001")`;
  - las transformaciones, por atributo: `transform.position`, `thisLayer.scale`.
  - El AE del usuario está en inglés (`language: en_US`), pero las plantillas que se entregan deben valer en cualquiera.
- **Comentarios `//` dentro de cada expresión** que digan qué hace (regla 3 de organización).
- **Una expresión que nombra una capa que aún no existe** nace con error (aviso amarillo): crear primero la capa nombrada.
- **Revisar antes de cada render:** recorrer las propiedades CON expresión, `valueAtTime(t, false)` y leer `expressionError`.
  - En capas de malla no recorrer todo: tienen cientos de propiedades ocultas y AE se quedó sin responder.
- **Unidades que engañan:** Gradient Wipe va de 0 a 1 con `setValue` pero en % dentro de una expresión. `linear()` con colores mezcla en RGB y a mitad sale gris: mezclar en HSL (4.75).

## Biblioteca (probadas aquí salvo las marcadas *(informe)*)
```javascript
// --- vida y movimiento ---
wiggle(0.5, 12)                                   // deriva suave (< 1 Hz = deriva, no temblor)
[value[0], wiggle(2, 30)[1]]                      // solo en Y  (informe)
var f = 2, a = 40, L = 4, t = time % L;           // wiggle en bucle perfecto de L s  (informe)
linear(t, 0, L, wiggle(f, a, 1, 0.5, t), wiggle(f, a, 1, 0.5, t - L));
loopOut("cycle")                                  // "pingpong", "offset", "continue"
posterizeTime(12); value                          // stop-motion
value + [random(-40, 40), 0] * g                  // glitch leído de un deslizador g (4.74), con posterizeTime(15)

// --- rebote al llegar (inercia) — informe ---
var amp = .06, freq = 2.5, decay = 6, n = 0;
if (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }
var t = (n == 0) ? 0 : time - key(n).time;
if (n > 0 && t < 1) { var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);
  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t); } else value;

// --- escalonado y relación entre capas ---
var d = framesToTime(3) * (index - 1);            // cada capa 3 fotogramas después (informe)
thisComp.layer("CONTROL").transform.position.valueAtTime(time - d);
lookAt(position, thisComp.layer("MIRA").transform.position)            // orientar una cámara de un nodo (4.59)
var c = thisComp.layer("CAMARA").toWorld([0,0,0]); var p = toWorld(anchorPoint);
radiansToDegrees(Math.atan2(-(c[0]-p[0]), -(c[2]-p[2])))               // cartel que mira a la cámara en Y (4.58)
var d = length(toComp(anchorPoint), thisComp.layer("Cursor").toComp([0,0]));
linear(d, 0, 300, 150, 100)                       // reacciona a la proximidad (informe)

// --- texto ---
s.substr(0, Math.floor((time - inPoint) * 26)) + ((Math.floor(time*3) % 2 == 0) ? "▌" : " ")   // máquina de escribir (4.73)
String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")   // miles con punto (4.73)
"t = " + time.toFixed(2).replace(".", ",") + " s" // reloj en español (4.110)
var r = sourceRectAtTime(time, false); [r.left + r.width/2, r.top + r.height/2]   // ancla centrada siempre

// --- caja que se ajusta al texto (Rect Size de una forma) — informe ---
var t = thisComp.layer("TEXTO · rótulo"), r = t.sourceRectAtTime(time, false), pad = [40, 20];
[r.width + pad[0]*2, r.height + pad[1]*2];
// y su Rect Position, alineada con el texto:
var t = thisComp.layer("TEXTO · rótulo"), r = t.sourceRectAtTime(time, false);
fromComp(t.toComp([r.left + r.width/2, r.top + r.height/2]));

// --- trazo que no engorda al escalar (Stroke Width) — informe ---
value / (length(toComp([0,0]), toComp([0.7071,0.7071])) || 0.001);

// --- audio reactivo (tras "Convert Audio to Keyframes") — informe ---
linear(thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider"), 0, 20, 100, 130);

// --- colores sin gris a mitad (4.75) ---
var a = rgbToHsl(c1), b = rgbToHsl(c2); hslToRgb(linear(D, 0, 100, a, b));

// --- foco de cámara a un nulo, a lo largo del eje (4.59 / 4.111) ---
var p = thisComp.layer("FOCO").transform.position, c = transform.position, m = transform.pointOfInterest;
Math.max(50, dot(p - c, normalize(m - c)));

// --- ¿la capa de otra comp está viva? (4.110) ---
var L = comp("X").layer("Y"); (time >= L.inPoint && time < L.outPoint) ? 100 : 22;

// --- curva que arranca suave sin keys: s = t − τ(1 − e^(−t/τ)) (4.72) ---
var tau = 1.2; time - tau * (1 - Math.exp(-time / tau));
```

## Texto con estilo por carácter (25.0+) — informe, comprobar firmas antes de usar
`text.sourceText.style.setFontSize(80).setFillColor([1,1,1])`, `style.setText("…")`, `getStyleAt(i, time)`, y variantes con índices de carácter. Por **script** (probado): `doc.characterRange(a, b).fillColor = color` y `.font = "PS-Name"` (4.14, 4.49).

## Desplegables por script (17.0.1+) — informe
```javascript
var dd = capa.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
dd.property(1).setPropertyParameters(["Izquierda", "Centro", "Derecha"]);   // 26.0: propertyParameters y valueText para leer
```

## Rendimiento
- `sampleImage`, `sourceRectAtTime` y los bucles con `valueAtTime`: caros. Solo en pocas capas.
- **Hornear a keys** si se repiten en muchas: recorrer los fotogramas con `prop.valueAtTime(t, false)`, guardar con `prop.setValuesAtTimes(tiempos, valores)` y poner `prop.expression = ""`.
- Una capa CONTROL que calcula una vez y las demás que la leen es mejor que la misma cuenta en 50 capas.
- Tablas precalculadas en la expresión (un array por fotograma) en vez de muestrear otra capa en bucle (4.110: el camino con Trim Paths).
