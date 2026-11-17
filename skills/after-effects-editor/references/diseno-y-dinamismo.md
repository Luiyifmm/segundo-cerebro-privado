# Diseño y dinamismo: las leyes, los principios y el estilo

> Parte de la skill **after-effects-editor**. Generado del CEREBRO (la base de conocimiento de las clases, 29/09–02/10/2026). Las rutas de proyectos de ejemplo (`Tanda…/…`) son del PC del autor: no vienen en la skill.

## 0. Mentalidad de editor profesional

1. **El diseño es la base y la animación es el adorno** (analogía del cupcake). Un buen diseño se sostiene con animaciones simples o sin ninguna. Una animación nunca salva un mal diseño.
2. **Diseña el fotograma final antes de animar.** Dedica el 50–80 % del esfuerzo a cómo se ve la escena terminada. Después decide qué se anima y cómo.
3. **Mismos recursos, distinto resultado:** la diferencia entre un editor "vago" y uno "pro" está en cómo trata los recursos (luz, textura, profundidad, jerarquía), no en tener más recursos.
4. **El diseño es la ventaja injusta** frente a editores técnicamente muy buenos (keyframes y curvas) que diseñan mal.
5. **Banco de inspiración:** guardar capturas de animaciones que funcionan y consultarlo al diseñar. Para la skill: pedir referencias al usuario o proponer 2–3 estilos de referencia antes de diseñar.
6. **Repasar las leyes a menudo:** se olvidan. Pasar la checklist de la sección 7 en cada escena.

## 1. Las 5 leyes del diseño (resumen; cada una se amplía en su clase)

| Ley | Pregunta que hay que hacerse | Error típico |
|---|---|---|
| **Composición** | ¿Dónde y cómo está cada elemento? ¿Sobra o falta alguno? | Elementos colocados al azar |
| **Tamaño** | ¿Lo más importante es lo más grande? | Texto gigante y lo que debería destacar diminuto |
| **Espaciado** | ¿Hay aire entre elementos? ¿Se respetan los márgenes? | Cosas pegadas al borde, sin márgenes |
| **Color** | ¿Tono, saturación y brillo están bajo control? ¿Hay una paleta dominante? | Colores al azar, todo saturado |
| **Profundidad** | ¿Se siente espacio (planos, sombras, desenfoque)? | Todo plano, en un solo plano |

### 1.1 Composición (clase 02)
- **Margen seguro:** nada importante a menos de **≈9 % del ancho** de los lados ni **≈13 % del alto** de arriba/abajo (≈170 px y 145 px en 1920×1080). En la franja solo va **decoración que acompaña** (doodles, iconos contextuales, partículas, fotos secundarias).
- **Guía central:** para composiciones centradas (simetría = calma y poder). También se puede centrar en un solo eje. **Si va centrado, al píxel:** un "casi centrado" se nota y estresa.
- **Regla de los tercios:** sujeto en una línea vertical y texto u objeto clave en la intersección opuesta, y así los pesos se compensan. El ojo va solo a las 4 intersecciones.
- **Balance:** repartir el peso visual. Nada de todo a un lado con vacío al otro, ni texto arriba del todo con aire abajo, ni cosas metidas en una esquina vacía.
- **El balance se mantiene DURANTE la animación:** cuando entra un elemento nuevo, **la cámara (un nulo) se mueve o escala a la vez** para re-centrar el conjunto, y **los elementos existentes se reacomodan** (se juntan) para no dejar huecos. Ejemplos replicados: calendario + avatares (la cámara baja) y pirámide de personas (la cámara sube y las demás se juntan).
- Herramienta: **plantilla de guía** (margen seguro + tercios + centro) encima de la comp mientras se compone.

### 1.2 Tamaño y jerarquía (clase 03)
- **Jerarquía visual** = el orden de importancia. **Cuanto más importante, más grande y obvio.** El tamaño siempre es **relativo** a lo que rodea al elemento.
- Método: numerar los elementos por importancia (1, 2, 3…) y dar tamaños decrecientes. El 1 debe ser claramente dominante (≥2–3× el texto secundario). Ejemplos: "$30M" gigante con "After spending over / On ADS" pequeños; "DIGITAL PRODUCTS" grande con "Selling" pequeño.
- **La falta de jerarquía crea confusión:** mensaje de chat más grande que la foto y el nombre, botón "Export" o cursor más grandes que la carpeta, logos que roban protagonismo al texto.
- **Misma importancia = mismo tamaño** (comparaciones, listas, roadmaps). Para destacar uno: **pop-out** (+13–16 % de escala con rebote) y los demás se encogen (−10 %) y oscurecen.
- **Solo lo importante nítido y enfocado.** Si todo está nítido, la tensión se dispersa.

### 1.3 Espaciado, márgenes y espacio en blanco (clases 01–03)
- **Márgenes siempre.** Nada pegado a los bordes del encuadre (mayor error de los no profesionales).
- **Padding uniforme** dentro de cajas y tarjetas (igual arriba/abajo e izquierda/derecha).
- **Espacio en blanco** = zonas vacías a propósito (estilo **SaaS / Apple**). **No tiene que ser blanco**: basta con que no haya distracciones. Poco espacio en blanco = desorden y sobrecarga.
- **Interlineado:** el de algunas fuentes por defecto es malo. Titulares ≈1,0–1,15×, párrafos ≈1,3–1,5×, sin tracking exagerado. Un espaciado incorrecto da un look **extraño y desconectado**.
- Truco: **copiar el espaciado de diseñadores de UI reales** (webs, apps, perfiles de Instagram) y mirar **miniaturas de buenos diseñadores de YouTube**.
- Referencia usada: tarjeta de las 5 leyes con márgenes laterales iguales (138 px en 1920), separación constante entre tarjetas (36 px) y más aire entre el título y su texto.

### 1.3.1 Los 5 errores típicos de una escena UI (checklist)
1. Espaciado interno no uniforme. 2. Muy poco espacio con el borde. 3. Fuente inadecuada (cómic/cartoon en UI). 4. Interlineado incorrecto. 5. Título y subtítulo del mismo tamaño (sin jerarquía).

### 1.4 Color (clase 04)
- **Una paleta dominante por escena** (1 dominante + 1 acento + neutros). La unidad de color da aspecto profesional.
- **HSL:** todo color = Tono + Saturación + Luminosidad. Se construye la paleta fijando el tono y variando S y L: fondo oscuro y poco saturado, superficies intermedias y acentos claros y saturados.
- **3 esquemas (rueda cromática):**
  - **Monocromático** (el más usado): un tono. Calma, marca, elegancia. Ej.: violeta #120A49 / #2E1E84 / #7A57CA / #B18ED1.
  - **Análogo:** 2–4 tonos vecinos (rojo-naranja-amarillo; rosa-violeta-azul; verde-lima-cian). Armonía.
  - **Complementario:** opuestos (cian-naranja, amarillo-violeta, rojo-verde). Contraste máximo: versus, bien/mal, llamadas a la acción.
- **Excepciones:** combinaciones fuera de los esquemas que funcionan por contraste moderado y tonos poco comunes (rosa + cian). Validar mirando.
- **Significado:** ¿qué color tiene sentido para lo que se dice? Rojo = error, peligro, pérdida. Verde = éxito, dinero, vida. Violeta + negro = misterio o miedo. Amarillo = atención, idea. Azul = confianza, calma, tecnología. Rosa = dulzura. Negro = lujo o poder. Blanco = limpieza. Gris = neutro o serio.
- **Luminosidad y saturación siguen la emoción:** escenas negativas más oscuras, desaturadas y frías; positivas, más luminosas, saturadas y cálidas. Dentro de una escena, **todo en la misma tonalidad** (objeto, suelo, humo y partículas del mismo tono con distinta luz).
- **Biblioteca de paletas:** Pastel (Mac, de pago) → en Windows: Adobe Color, Coolors, un comp "PALETA" con muestras + HEX, o `scripts/extraer_paleta.py` para sacar la paleta de una referencia.

### 1.5 Profundidad (clase 05) — las 8 técnicas
Profundidad = separación percibida entre capas; hace que la edición se sienta **real**. No hace falta usar las 8 a la vez, pero cuantas más, mejor. **Mínimo: sombra en todo + viñeta + textura sutil + glow en lo clave.**
1. **Sombras:** paralela en casi todo (variando opacidad, distancia y suavidad). **Interior** para falso 3D. **Interior clara** como luz de borde. Sombra de color (naranja o roja) debajo de un aro neón = luz que rebota.
2. **Distorsión:** cámara 3D con **gran angular** (menos mm = más distorsión; 15–24 mm) + **Compensación óptica** (Reverse Lens Distortion = abombado tipo TV).
3. **Capas:** elementos delante, detrás y alrededor del sujeto (copias flotando a distintas Z, objetos apilados, texto detrás de la persona recortada).
4. **Viñeta:** oscurece bordes y guía la mirada (se puede descentrar hacia el punto de interés). Puede ser de color.
5. **Color:** fondo oscuro, apagado y frío; sujeto luminoso, saturado y cálido. Nunca un fondo o caja más saturado que el dato importante.
6. **Texturas:** degradados, ruido o grano, cuadrícula o retícula, **halftone / líneas de TV** para pantallas, overlays (light leaks, partículas, humo, burbujas).
7. **Desenfoque:** mejor con la **profundidad de campo de la cámara 3D** (3 planos: delante desenfocado, sujeto nítido, fondo desenfocado).
8. **Glow:** aura de brillo; **combo ganador: glow + sombra paralela**.
- Además, **movimiento constante** (wiggle o deriva de cámara): en la naturaleza nada está quieto.
- Sombra de contacto (elipse desenfocada bajo un objeto) = el objeto "está" en el espacio.

### 1.6 Texto y tipografía (clase 06) — los 5 principios
1. **Fuente:** contextual (tono y formalidad), fácil de leer (sans serif por defecto) y **consistente (máx. 2–3 fuentes por vídeo)**. Fórmula: **1 sans + 1 exótica/display**. Errores: poco esfuerzo al elegir, fuente incorrecta al recrear una UI, mezclas sin criterio, cambiar de fuente sin motivo y **tamaños inconsistentes** (el más común).
   - Personalidad: caligrafía = amor o cercanía; condensada, pesada e irregular = tensión o terror; serif clásica = elegancia o lujo; sans geométrica = modernidad, tech, UI; display redondeada = gaming o humor.
2. **Mayúsculas:** elegir UN estilo (TODO MAYÚS / minúsculas / Inicial / Títulos) y **mantenerlo**; decidir si hay puntuación y mantenerlo.
3. **Subtítulos:** cortar en **pausas naturales** (cada línea = una idea). Longitudes parecidas, pero manda la pausa. Ritmo rápido = 1–4 palabras por línea; ritmo lento = líneas largas.
4. **Ubicación:** tercio inferior, por encima del margen seguro, **sin tapar** caras, objetos ni interfaces.
5. **Precisión:** cero faltas. Leer "como un bebé" y buscar si hay duda.
- **Subtítulo viral tipo:** Burbank Big Condensed/Bebas en MAYÚSCULAS, relleno blanco, contorno negro 8–12 px detrás, sombra, palabra clave en amarillo, aparición palabra a palabra (escala 0→100 con rebote).

## 2. Principios del dinamismo (clase 07 = introducción)

- **La animación es la crema; el diseño, el cupcake.** Con un buen diseño ya tienes ~50 % de la animación. **Estilo Apple** = diseño contenido + **movimientos de cámara simples**: zoom out, zoom in, paneo izquierda/derecha/abajo, con desenfoque en los cambios.
- Organizar la escena como una **maqueta grande** (grupos separados ~2600 px) y **recorrerla con la cámara** en lugar de cortar.
- **Los 4 principios:** (1) **Adaptación al contexto** (el movimiento encaja con el tono), (2) **Digestibilidad** (no saturar), (3) **Sincronización** (fluir con el audio), (4) **Movimiento constante** (nunca quieto). Se amplían en las clases 08–11.
- Adelanto de movimiento constante: un **zoom lento con un nulo de control** (100→104 % en 8 s) y un vaivén suave en objetos 3D ya dan vida sin distraer.

### 2.0 Principio 1 — Adaptación al contexto (clase 08)
Antes de animar, definir el **contexto** y fijar 6 parámetros:
| Parámetro | Misterio / documental / drama | Gaming / humor / entretenimiento |
|---|---|---|
| Intensidad | 1 animación larga por escena (~8–12 s) | muchas, encadenadas |
| Velocidad | muy lenta (cuanto más lento, más misterio) | rápida, con overshoot |
| Fluidez | continua y suave, movimiento constante | golpes, shakes, cortes al ritmo |
| Fuentes | con carácter: condensadas o serif, tracking amplio, desgaste | display redondeadas o cartoon, contorno grueso |
| Color | apagado (poca luz y saturación) + 1 acento | saturado y brillante |
| Assets | realistas: fotos, IA, texturas (papel, corcho, ladrillo, polvo de película) | emojis, stickers, cartoon, confeti |
- Si hay dudas, **mirar 2–3 vídeos del mismo género**. **Romper reglas solo a propósito** (humor, incomodidad).
- **Receta "documental de misterio":** tablón de corcho sobre ladrillo con lámpara cenital; cartel con etiquetas de pincelada naranja (Bebas Neue); cámara que se aleja muy despacio (12 s); look = aberración RGB ±3 px + desaturar −25/−30 + contraste + tinte cálido/frío suave + polvo de película en Trama con salto 12 fps + grano 6 % + viñeta fuerte + parpadeo de proyector.

### 2.0b Principio 2 — Digestibilidad (clase 09)
- **Digestibilidad = qué tan fácil se entiende LA PRIMERA VEZ.** El editor ve su animación 100 veces; el espectador, una. Hay que verla como si no se supiera nada.
- **Dos factores:** ¿cuánta información nueva? y ¿cuánto tiempo para procesarla? Ver → procesar **tarda**.
- **Máx. 1–2 elementos principales por escena.** Nada de párrafos reales (líneas que simulen texto), salvo que el producto sea texto.
- **Enfoque claro:** singular, pocos elementos, jerarquía y composición, enfocar lo que importa y desenfocar lo que no.
- **Tiempo:** ~0,3 s por palabra a leer + ~1 s de respiro (mínimo ~2 s). Una tarjeta con 4 filas → 6–9 s. **Si se va en 2 s, nadie la leyó.**
- **Dar tiempo para respirar:** escenas más largas, movimientos más lentos, **minimizar el recorrido del ojo** (lo siguiente aparece cerca), **animación en escalera** (cada ítem entra cuando la voz lo nombra; ni antes ni después), variar el ritmo, **convertirse en el espectador**.
- Regla final: **1 concepto nuevo a la vez + tiempo suficiente para asimilarlo.**

### 2.0c Principio 3 — Sincronización / Timing (clase 10)
- **Asocia movimientos y animaciones con palabras clave y sonidos acentuados.** El pico del movimiento cae en la **sílaba tónica** (ej.: "en-TRAR" → la persona cruza la puerta justo en "trar").
- **Qué debe tener timing:** subtítulos (desde la primera letra), transiciones, pop-ins ("tres" → aparecen tres), flashes, revelar información (escalera), zooms (en la sílaba tónica), impactos, movimientos de cámara. Si no cuadra: **cortar o re-timear** animación o audio.
- **Método por datos:** Whisper con tiempos por palabra → marcar palabras clave y sílabas tónicas → anclar cada evento a su marca. Sílaba tónica ≈ inicio de la palabra + fracción de su duración.
- **Movimiento con suavizado simétrico: el pico de velocidad está en el centro** → centrar el movimiento en la sílaba tónica.
- **Punch zoom:** +14 % en 2 fotogramas → asentar a +8 % en 0,45 s → volver; + flash 15–20 % de 0,15 s; + sonido de impacto 1–2 fotogramas antes.
- Antes = spoiler; después = lento y desconectado. **Justo en el golpe de voz = potente.**

### 2.0d Principio 4 — Movimiento constante (clase 11)
- **Tu animación nunca debe quedarse completamente quieta.** En la naturaleza todo se mueve (gente, coches, nubes, hojas, sombras, polvo) e incluso nuestra mirada tiembla un poco. Un plano congelado se lee como foto o pausa y la atención cae.
- **Las 4 técnicas:**
  1. **Curvas largas y pronunciadas.** Separar los keyframes con la misma curva, y suavizado 75–90 %. Da el mismo movimiento, más suave, y las colas lentas hacen que casi nunca esté parado.
  2. **Movimiento superpuesto.** El siguiente movimiento empieza antes de que acabe el anterior (al 50–70 %). **Un nulo por movimiento** (arriba, adelante, atrás, derecha…).
  3. **Wiggle sutil** en el elemento, en la cámara (orientación) o en ambos. Frecuencia < 1 Hz = deriva, no temblor.
  4. **Zoom lento** (100 → 103–105 % por escena) y **zoom out de −3 a −5 % cada vez que aparece un elemento nuevo** (0,6–1 s). Además de dar vida, deja sitio al que entra.
- **Magnitud:** no tiene que ser grande; **solo no detenerse**. Cuando la cámara "para", el wiggle sigue.
- **Motivar el movimiento:** la cámara acompaña algo de la escena (p. ej., se va a la derecha mientras se llena una barra de carga).
- Arrancar los planos **ya en movimiento** (salida 10–20 %) y aterrizar largo (entrada 80–90 %).
- Gratis y siempre útil: partículas o polvo a la deriva, objetos flotando (seno lento) y fondos con deriva o paralaje.

### 2.0e Curvas de velocidad, keyframe continuo y cortes de acción (módulo Glass Health, Tanda 02)
- **Curva de entrada:** llega muy rápido y frena. **Curva de salida:** arranca lento y acelera al final.
- **Toda curva tiene un "momento muerto"** (velocidad 0). Para que nunca pare:
  - convertir el keyframe del medio en **continuo** (doble clic → *Continuous*);
  - y darle una velocidad distinta de 0.
- **Regla de los 50 px/s:** la velocidad en ese punto lento **no debe pasar de 50 px/s**. Si pasa, el movimiento lento se ve "cuadriculado", a saltos: a 30 fps ya son más de 1,7 px por fotograma y sin desenfoque de movimiento.
- **Cortes de acción (match cuts)**, la transición de todo el anuncio:
  1. el plano termina con **curva de salida** (acelera hasta el corte);
  2. el corte cae **en el pico de velocidad**;
  3. el siguiente plano empieza con **curva de entrada muy exponencial** (influencia de salida 1–5 %).
- **Por qué funcionan:** en el pico el ojo no lee detalles, así que el cambio de contenido no se percibe como corte y se siente un solo movimiento continuo.
- **Animación complementaria:** además del movimiento principal (la cámara), los objetos hacen movimientos pequeños que lo refuerzan (las tarjetas avanzan un poco o siguen girando 2–3°).
- Valores medidos del anuncio:
  - K0 sale a ≈2,5 × recorrido/s con influencia 14 %;
  - K1 es continuo a 154 px/s (influencias 89/100);
  - K2 entra a ≈5 × recorrido/s con influencia 1 %.
  - Receta 4.43.

### 2.0f Las curvas cuentan física: peso, golpe y suspensión (Tanda 03 · 02 "Dominando las curvas")
**La idea de la clase:** con solo posición, escala, opacidad y rotación, lo que hace que algo parezca vivo es la **velocidad**, no el recorrido. Dos animaciones con las mismas keys, una lineal y otra con curvas, cuentan cosas distintas: la lineal es un robot; la curvada tiene peso.

**Qué comunica cada forma del gráfico de velocidad** (posición unificada, F9 y luego los tiradores):
| Forma | Qué siente quien mira | Cuándo usarla |
|---|---|---|
| **Cumbre suspendida**: 0 px/s con influencia 90–100 % a los dos lados | "Flota": se queda arriba un instante, sin gravedad | Lo alto de un salto, una tarjeta que se "posa" en el aire, un logo que respira antes de caer |
| **Pique**: llegada con poca influencia (5–20 %) o con velocidad alta | **Golpe**: llega rapidísimo y se para de sopetón, como algo pesado | Aterrizajes, impactos, texto que "cae" en su sitio, un sello que se estampa |
| **Salida F9** (0 px/s, 33 %) | Despegue con impulso, natural | Rebotes y saltos: la salida del suelo |
| **Entrada "con fuerza"**: sale a ~8× la velocidad media y frena largo (influencia 100 %) | Energía que se apaga: llega y se asienta | Entradas de texto o de elementos desde fuera de cuadro |
| **Lineal** | Máquina, constante | Solo lo que tiene que sentirse mecánico (un zoom lento de fondo, un giro continuo) |

**Los principios que se ven en la pieza (y sirven para cualquier animación):**
1. **Esqueleto antes que detalle:** primero todas las posiciones y alturas (keys), después las curvas y al final lo secundario (letras, relleno, reflejo). Si se hace al revés, cada cambio obliga a rehacerlo todo.
2. **Nada es igual dos veces:** alturas distintas en cada salto, un giro de media vuelta para caer de cabeza, una vuelta de más en el salto final. La repetición exacta "queda robot".
3. **Acción y reacción:** lo que recibe el golpe responde (las letras se aplastan solo en Y, con el ancla abajo, 88–93 %, y se rellenan). Y responde **un fotograma antes** del contacto: si llega tarde, el ojo lo ve desconectado.
4. **El que golpea también se deforma:** al posarse en su sitio, la F se aplasta al 85 %: sale de golpe, se queda "suspendida" en el mínimo (0 %/s, influencias ~90 %) y vuelve de golpe. Es la misma curva de la cumbre, aplicada a la escala.
5. **Pausas que dan peso:** en el último aterrizaje, antes del salto grande, la F se queda quieta 2 fotogramas. Esa pausa prepara el salto final (anticipación).
6. **El final se remata:** el salto final es más grande, gira dos vueltas hacia atrás (a ~200°/fotograma en el centro, que con motion blur es un remolino) y la F crece del 35 % al 100 % mientras vuela. El último movimiento siempre es el más llamativo.
7. **Arcos, no rectas:** las cumbres llevan tiradores horizontales en el trayecto (Pluma G, "la combita"). Nada vivo se mueve en línea recta.
8. **Motion blur:** con estas velocidades es obligatorio ("la diferencia es brutal"): convierte el pique y los giros rápidos en estelas creíbles.
9. **Dinamismo de fondo:** toda la pieza (palabra, reflejo y degradado del fondo) crece un 18 % en línea recta durante los 5 s. Así nunca está quieta, ni al final.
10. **Ritmo global:** si todo va lento, Alt + arrastrar la última key escala todas las keys a la vez, o se estira la precomp. El profe lo hace, y por eso sus keys acaban entre fotogramas.

**Cómo usarlo fuera de esta clase:** para cualquier objeto que salta, cae o aterriza (iconos, tarjetas, logos, letras), la receta es la del 4.77. Para cualquier cosa que recibe un impacto, la del 4.78. Para cualquier entrada de elementos, la del 4.79.

### 2.0g Keyframes: la base (Tanda 03 · 03 "Domina los Keyframes")
"Quien domina los keyframes ya tiene el 50 % del trabajo hecho en After Effects."
- **Key = un valor guardado en un instante.**
  - Con dos keys hay animación; **la distancia entre ellas ES el tiempo**.
  - Alt + arrastrar la primera o la última escala todas a la vez.
- **3 tipos y sus mitades:**
  - lineal ◆ = constante; bézier ⧗ = la velocidad cambia; retención ■ = salta sin movimiento;
  - **mitad izquierda = LLEGADA (in), mitad derecha = SALIDA (out)**;
  - Easy Out suaviza la salida, Easy In la llegada y F9 las dos;
  - el icono de la key cuenta qué hace cada mitad (tabla en la demo 04 del proyecto).
- **Leer la velocidad sin darle a play:** los puntos del trayecto son los fotogramas. A la misma distancia = constante; juntos = lento; separados = rápido.
- **Trabajar en el gráfico de VELOCIDAD** (altura = velocidad, largo = influencia).
  - El de VALOR solo para una dimensión (dimensiones separadas: la Y de un rebote).
- **Espacial ≠ temporal:**
  - la ruta se arregla con tiradores y vértices (esquinas si hay "cosas raras");
  - la velocidad, con las curvas;
  - **Rove Across Time** iguala la velocidad de toda una ruta de muchas keys y deja darle UNA curva a todo el recorrido.
- **Las 3 reglas de oro del realismo:**
  1. **Lo que entra de fuera de cuadro ya viene rápido** (la key de fuera con velocidad). **Lo que sale no frena fuera** (sale de 0 con influencia 100 % y la key de fuera con velocidad). F9 lo hace al revés: el error más común.
  2. **Nada lanzado sale de 0 ni se para arriba.** La key de la cumbre es continua y con algo de velocidad: en el gráfico, una U ("rampa de skate"), no un pico.
  3. **La gravedad es asimétrica:** rápido abajo, lento arriba. En un rebote, los tiradores rotos en el suelo (pico) y un arco redondo arriba. F9 en todo = "flota".
- **Keys en fotogramas enteros:** una key entre fotogramas se salta su valor (la pelota "no toca el suelo").
- **Números exactos:** doble clic en una key → *Keyframe Velocity* (entrada/salida: velocidad + influencia; *Continuous*). Sirve para copiar la misma curva a otra capa.

### 2.0h El videoclip con VFX: cómo piensa el editor (Tanda 03 · 05 "EDITS")
"Es un vídeo grabado con un iPhone, pero los VFX hacen la diferencia."
- **Flujo:** cortar cada tramo → precomponer (mover atributos + ajustar duración) → trabajar dentro.
  - Vista a media o un tercio de resolución; **la rotoscopia, a resolución completa**.
  - Si el vídeo ya viene montado, *Detección de edición de escenas* lo parte en sus cortes.
- **El artista recortado es el recurso estrella: se reutiliza de todas las maneras.**
  - Debajo y blanco = brillo detrás; duplicado e invertido = teletransporte, salidas y entradas entre clips; duplicado detrás = eco y clones; estabilizado = cara fija.
  - La estructura de casi todo: **fondo · efecto · artista encima**.
- **Cada efecto cae en la música:** shakes en los "rompes" del beat (marcador en el golpe); zooms "tac, tac" en los golpes; flashes en los cortes.
- **Las 4 curvas del videoclip** (de Flow; detalle en 4.81 y `edits_lib.jsx`):

  | Curva | Para qué |
  |---|---|
  | lento → rápido → lento | zooms ("la mejor curva de todas") |
  | rápido → frena lento | entradas, texto que cae, el zoom "bum" a la cabeza |
  | lento → acelera | salidas ("su mejor amiga"), fondo infinito, zambullida en un objeto |
  | rápido → lento → rápido | el zoom de los clones |
- **Continuidad entre cortes:**
  - el movimiento del fondo sigue en el clip siguiente con la curva al revés (acelera hasta el corte, frena después);
  - el artista del clip anterior sale mientras el nuevo entra;
  - el clip siguiente puede arrancar en negro.
- **Un zoom se siente por proporción**, no por píxeles (100 → 200 se siente igual que 200 → 400). Con Escala en keys lineales, la segunda mitad parece frenar. Por eso el profe usa un plugin de **distancia Z** (S_BlurMoCurves) + curva de Flow, que además pone el desenfoque de movimiento.
- **Flashes de verdad = Niveles en una capa de ajuste**, nunca un sólido blanco. Uno entra antes del corte y otro (invertido) sale después.
- **Bordes negros por estabilizar, girar o temblar → Mosaico con movimiento 200/200 con bordes en espejo** en la capa que se mueve.
- **La estética, coherente en todo el vídeo** (si arrancas con rotoscopias y VFX, no metas textos que no pegan).
- **Sin ideas → ver videoclips llenos de efectos** (lista "Sin ideas"; Fredo Bang: "pura rotoscopia, rotaciones…").
- **Guardar los shakes como preset** para reutilizarlos. **Exportar** H.264 a ≥100 Mbps en 4K y ≥50 en 1080p, porque YouTube recomprime.

### 2.1 Receta "estilo Apple" 3D (probada)
- Comp con renderizador **Cinema 4D**. Suelo = sólido 3D gris claro (#D3D3D3) + Noise 6 % + Fractal Noise en Multiplicar (contraste 420, brillo +150, escala 18) = papel con motas.
- Letras **extruidas** gris medio (#8E8E8E; Poppins Black/BlackItalic; profundidad 14–44; bisel 2), formas extruidas para paneles o pastillas (bisel 3). Un solo acento de color (azul de icono, granate de pastillas).
- Luz: **Spot** que sigue a la cámara (intensidad 85, cono 120, calado 85, sombra 60 %, difusión 35) + **Ambient 42 %**. (Parallel = sombras duras, sin difusión.)
- Cámara de 2 nodos, 50 mm, un poco desde la izquierda y abajo (posición = POI + [−320, +190, z]). Keys: zoom out 0→3,2 s; paneo 0,6 s con suavizado 85 %; push-in lento; paneo; zoom out lento. **Desenfoque 0→40→0** en cada paneo (capa de ajuste 2D encima). Viñeta y grano 2D por encima.

## 3. ADN visual "pro" (estilo Solazzo, observado en sus ejemplos)

- **Fondos nunca planos:** degradado radial (más claro donde está la acción) + textura sutil (ruido o grano) + viñeta.
- **Brillo (glow) solo en lo que guía la mirada:** líneas que conectan ideas, números clave, bordes neón.
- **Materiales:** cristal (glassmorphism), neón, cromo, objetos 3D reales (cerebro, dientes, lupa, maniquíes).
- **Paletas monocromáticas por escena:** rosa/magenta, morado, oliva/amarillo, azul/cian.
- **Profundidad con sombras** (personajes en la pared, cortinas, texto con sombra en el borde).
- Líneas con **afinado en las puntas** (taper) + brillo = energía que fluye.

## 3b. Estilo "UI tech de marca" (anuncio Glass Health, Tanda 02)

Así debe verse una animación de producto digital, SaaS o IA en este estilo. Detalle y valores en `Tanda 02…/APRENDIZAJE - Modulo Glass Health AI CDS.md`.
- **Paleta:**
  - Fondo azul marino casi negro (#000B46 → negro, 4-Color Gradient con `wiggle(3, 15)` en los puntos de color).
  - Superficies #13162C–#1E2445.
  - Textos lavanda claro (#D8DBEE / #ADB4DE, nunca blanco puro).
  - **Un solo color de luz:** el de la marca.
- **La luz manda, pero dosificada:**
  - Deep Glow con **tinte monocolor** (Tint Mode 2) en casi todo, exposición **0,1–0,5**.
  - Picos (1–3) solo en transiciones y palabras clave.
  - "Si todo brilla, nada destaca": el propio profe bajó el glow al final.
- **Luz detrás de los paneles:** una **copia rellena escondida detrás** con Deep Glow de radio grande (receta 4.46), no un trazo brillante.
- **Bordes:** finos (1,5–2,5 px), lavanda, con glow corto. Opcional: una luz que recorre el borde (Trim Paths + Offset, receta 4.45).
- **Cámara:**
  - Nunca para: keys continuas por debajo de 50 px/s.
  - Planos que empiezan con curva de entrada exponencial.
  - Todos los cortes de acción (2.0e).
- **Transición por destello** entre estados de la interfaz (receta 4.47).
- **Texto:**
  - Helvetica o SF Pro con **tracking negativo** (−20 a −55).
  - Aparece por **palabras** (1–1,5 F entre palabras) o por **líneas** (2–3 F), con fundido + desenfoque (receta 4.49).
  - Títulos con destello palabra a palabra.
- **Profundidad:**
  - Paneles laterales con −0,8 de exposición y algo desenfocados.
  - Ondas de fondo con paralaje 0,6–0,8.
  - **Bulge** de 0,3 → 0 al empezar un plano.
  - Profundidad de campo en los primerísimos planos.
- **Recursos que se repiten:**
  - la **onda con repeater** (4.44);
  - el **logo SVG animado** (4 piezas que se abren y giran);
  - el **logo 3D de cristal** (4.48);
  - la interfaz real de la marca montada en paneles.
- **Pensar en plantilla:** paneles en precomps con tiempo propio (se reutilizan desplazando `startTime`) y logo en SVG. Cambiar de marca = cambiar el SVG, los recortes y el color de la luz.

