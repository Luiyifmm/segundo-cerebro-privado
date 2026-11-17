# Criterio de edición (referencia)

Resumen propio de las reglas de oficio útiles de la skill "Motion Video Director" (github.com/Miftahul-Islam-Efaz/Motion-graphics-skill), revisada el 2026-10-08. No se instaló entera: su flujo exige voz de ElevenLabs, claves de pago, Python y trabajar sin Premiere, que no encaja con este usuario. Sus scripts son inofensivos (ffmpeg, plantilla de .env).

## Intensidad según el tipo de vídeo
- Marca personal / gancho (Amin): alta. Corte cada 0,5–2 s, zoom de énfasis, sonido en cada cambio.
- Educativo / salud: media. Flechas, resaltados, gráficos; nada que tape el contenido.
- Regla: cuanta más confianza pide el mensaje, menos adorno. Cada efecto sirve a atención, énfasis o transición.

## Estructura
- Gancho (0–3 s) → problema → solución → prueba → llamada a la acción (visible ≥ 2 s, dicha y escrita).
- Una idea por plano. Texto en pantalla ≤ 6–8 palabras; tiempo de lectura ≈ 0,3 s por palabra + 0,5 s.
- Cortar en la primera sílaba; el b-roll tapa los cortes; ritmo rápido-rápido-pausa.

## Composición y color
- 60/30/10: dominante, secundario, acento (el acento solo en palabras clave y llamada a la acción).
- Contraste de texto ≥ 4,5:1; comprobar en gris.
- Zonas seguras 9:16 (1080×1920): fuera de los 220 px de arriba, 420 px de abajo y 140 px de la derecha. Subtítulos al 60–70 % de altura, nunca sobre ojos o boca.
- Máximo 2 familias de letra (+1 de acento).

## Tipografía en movimiento
- Jerarquía por tamaño, peso y color, no por número de fuentes. Palabra clave 2–4× el tamaño del resto, una por grupo.
- Entrada por palabra: desenfoque 12→0 px, opacidad 0→1, 20 px de subida, 180–250 ms, frenada suave. Salidas más rápidas que entradas.
- Escalonado 40–80 ms entre elementos; rebote 5–10 % solo en marcas desenfadadas.
- Sombra 0 4 12 rgba(0,0,0,.35); resplandor = copia desenfocada detrás (8–24 px), nunca sobre texto pequeño.

## Sonido
- Trío: riser (tensión) → impacto (golpe) → whoosh (movimiento).
- Clics y pops = interfaz; whoosh = entradas de texto y cambios; riser antes de una revelación; grave/boom = dato grande o logo; obturador = foto o congelado.
- El sonido marca cambios, no cada palabra. Variar muestras. Silencio antes del golpe final.
- Mezcla: voz 10–15 dB por encima de la música; −14 LUFS, pico ≤ −1,5 dBTP.

## Efectos sobre bruto hablado
Zoom de énfasis 105–120 %, texto detrás de la persona (recorte), cambio de fondo, congelado con etiqueta, blanco y negro puntual, pantalla partida, barras de cine para el momento solemne, cortes de silencio.

## Control antes de entregar
Gancho ≤ 3 s · cierre ≥ 2 s · subtítulos sin faltas y dentro de zona segura · sonido a ±1 fotograma · sin halos en recortes · H.264 yuv420p, AAC 48 kHz.

## Sonido (aprendido el 2026-10-09 de dos vídeos que pasó el usuario; resumen propio)
Fuentes: "How To Sound Design ANY Video In 15 Minutes" (Gavin Herman) y "Efectos de Sonido Explicado Desde 0" (Mirko Vigna). Transcripciones en `~/Videos-Remotion/referencias/sonido/`.

Tres pasadas, siempre en este orden:
1. **Voz** (cadena fija): reducción de ruido suave (o puerta) → EQ de limpieza (cortar por debajo de 80 Hz y por encima de 12–16 kHz) → EQ de carácter (calidez, con moderación) → compresor 2:1 con umbral en el nivel más bajo de la voz y ganancia de salida → de-esser → limitador.
2. **Efectos** (buscar, afinar, ampliar, colocar, ambiente):
   - Afinar: cambiar tono (más grave = más peso, más agudo = más chispa), velocidad, filtros paso alto/bajo. De un whoosh salen tres sonidos: entero, cortado en su punto máximo (impacto) y al revés (riser).
   - Ampliar: capas en frecuencias distintas (una copia grave + una aguda del mismo sonido) para que llene; un sonido solo suena fino.
   - Colocar: el pico de la onda en el fotograma exacto del pico del movimiento.
   - Ambiente: sonidos que existirían en la escena, muy bajos, por debajo de voz y efectos; no se notan, pero se echa de menos si faltan.
3. **Música**: elegir por la emoción (para contenido educativo, instrumentos neutros que no compitan con la voz); además de bajar volumen, cortar con EQ los medios donde vive la voz; entre dos canciones, el último golpe invertido como riser + fundido; reverb con mucha cola para finales; enviar toda la música a una submezcla.
Extras: risers/absorciones para entrar o salir de la música, golpe con reverb en el último compás, y panorama que sigue el movimiento en pantalla (−100 izquierda, +100 derecha).

Qué sonido para qué (Mirko): whoosh = cualquier movimiento (transición, texto que entra, movimiento de cámara); impacto/boom = frase importante, revelación, giro; riser = sube tensión y rompe en el momento clave, también para cambiar de espacio; pop = icono, imagen o emoji que aparece; notificación = aviso en pantalla; interfaz = datos, rótulos, contadores; acierto/error; obturador = fotos e imágenes superpuestas; clic = botón de seguir, textos con corte; bass drop = cámara lenta, frase potente, intros rápidas. Regla repetida: no abusar; no un sonido por palabra.

Cómo lo aplico yo a partir de ahora:
- Menos clics: solo en las palabras clave que de verdad importan, no en todas las resaltadas.
- Cada efecto importante en dos capas (cuerpo grave + brillo agudo) y con su pico alineado al movimiento.
- Riser → impacto en revelaciones y cambios de sección; cola con reverb en el final.
- Ambiente muy bajo bajo los motion graphics a pantalla completa.
- Panorama: lo de la izquierda suena a la izquierda y lo de la derecha a la derecha (útil en comparaciones).
- Música con hueco de EQ para la voz, y limitador en la mezcla (evita el pico a 0 dBFS que salió en AMIN_1009_01).

## Color y texturas (aprendido el 2026-10-09 de cuatro vídeos que pasó el usuario; resumen propio)
Fuentes en `~/Videos-Remotion/referencias/color-y-texturas/` (transcripciones): Vane Motion (After Effects, color y textura en motion graphics), Martí MDN (gradación en Premiere), Gaku Lange (look fílmico en Premiere), Enam Alamin (8 pasos).

**En motion graphics** (lo que hace que una escena deje de verse plana), todo sutil y sumado:
- Profundidad: desenfoque ligero en las capas de fondo; desenfoque en los bordes con máscara elíptica muy difuminada para llevar el ojo al centro.
- Sombras proyectadas de textos y objetos: copia en negro con desenfoque radial en la dirección de la luz, a baja opacidad.
- Luz: una fuente clara (ventana, foco) y un barrido de luz suave en esa dirección; foco o viñeta que oscurece bordes y deja el centro más claro; resplandor muy bajo en textos y luces (modo sumar).
- Color por escena: sombras un punto hacia el azul, medios hacia el naranja; curvas con los negros levantados para que no queden duros; saturación de fotos algo más baja y brillo algo más alto para integrarlas.
- Textura encima de todo: ruido/grano en superposición (overlay), una segunda textura (papel, polvo) en aclarar o luz intensa a baja opacidad; la textura no debe verse antes de que entre la escena (usar la forma como mate).
- Vida: parpadeo muy leve de brillo, balanceo tipo péndulo que se frena, desenfoque de movimiento, y un desenfoque breve en los cortes entre escenas.

**En vídeo (Premiere, Lumetri)**, orden de trabajo en capas de ajuste separadas y con nombre:
1. Corrección: conversión log→Rec.709 si hace falta, exposición (altas luces por debajo de ~90 IRE salvo fuentes de luz) y balance de blancos, mirando la forma de onda y el vectorscopio.
2. Contraste con curvas: S suave con el pivote hacia las sombras; negros un poco levantados y blancos un poco bajados (negro "lechoso", caída suave de las luces).
3. Paleta (curvas de matiz/saturación): cálidos hacia el naranja y fríos hacia el cian; bajar saturación de azules, cianes, verdes y magentas, subir algo rojos y naranjas; luminancia de rojos/naranjas un poco abajo para dar densidad; desaturar las zonas más claras y los negros puros. Curvas siempre suaves.
4. Matiz tonal (ruedas): azul en sombras, naranja en medios, amarillo cálido en luces.
5. Densidad "de cine": en matiz vs luminancia, bajar la luminancia del tono de piel y del cielo; en luminancia vs saturación, subir un poco los medios.
6. Piel: máscara con seguimiento + selección HSL; alinear con la línea de piel del vectorscopio.
7. Máscaras: oscurecer o aclarar solo sujeto o solo fondo (máscara de objeto); la máscara de recuperación va por encima de la capa de contraste.
8. Acabado: bloom (copia anidada + clave de luminancia + desenfoque gaussiano, modo aclarar), desenfoque radial en los bordes a ~25–30 %, grano de película.
LUT creativo: en la pestaña Creativo de una capa aparte, con la intensidad bajada; nunca en el LUT de entrada. Usar imagen de referencia con la vista de comparación.

Cómo lo aplico yo:
- Los motion graphics con emojis siguen siendo válidos (al usuario le funcionan); lo que cambia es el acabado.
- Mis motion graphics dejan de ser planos: fondo con degradado + viñeta, grano encima, sombra proyectada en textos y tarjetas, resplandor leve en el acento azul, un barrido de luz suave y desenfoque breve al entrar y salir.
- Las fotos que entran en un vídeo se integran: un punto menos de saturación, sombra suave y el mismo tinte que el resto.
- La corrección de vídeo deja de ser solo "Corrección básica": contraste por curva con negros levantados, azul en sombras y naranja en medios, y piel vigilada. Material de iPhone ya viene en Rec.709: no lleva LUT de conversión.

## Motion graphics que acompañan el mensaje (referencia que pasó el usuario el 2026-10-10)
Reel de @divyansh (motion designer), guardado en `~/Videos-Remotion/referencias/perfiles-objetivo/reel-mensaje/Da0DayIpsie.mp4` (26 s, sin un solo corte). Lo que hace, visto fotograma a fotograma:
- **Una idea por pantalla y cada frase tiene su metáfora visual**, no un adorno: "Attention / every second" = aguja de reloj; "Your audience" = iconos de personas con un marco de enfoque; "12 is a second" = contador en anillo; "Losing prospects / momentum / opportunities" = nodos hexagonales que se ramifican uno a uno; la lista de ventajas = píldoras que se van apilando.
- **Fondo blanco, un solo color de acento (verde) y negro.** Mucho aire: el elemento ocupa poco y va centrado.
- **Dos letras:** sans fina para casi todo y una serifa cursiva solo en la palabra con emoción.
- **Todo se construye acumulando:** lo anterior se queda y lo nuevo se suma (como las miniaturas por grupo), en vez de borrar y empezar.
- **Transiciones por movimiento y desenfoque**, no por corte: una pantalla se convierte en la siguiente.
- Ritmo: unas 10 ideas en 26 s (≈ 2,6 s por idea). Cierre con la frase clave rodeada por un trazo y el logo.
Cómo lo aplico: antes de animar, escribir para cada frase qué objeto la representa; si no hay metáfora clara, texto limpio y nada más.

## Oficio de motion graphics tomado de la skill "Motion Video Director" (Efaz, 2026-10-10)
**Rango: apoyo.** Mandan primero las correcciones del usuario y sus referencias y documento con vídeos (lo dijo el 2026-10-10); si algo de esta sección choca con ellas, se ignora.
Skill entera en `~/.claude/skills/motion-video-director/SKILL.md`. Ella dibuja todo en código (Canvas/Three.js/GSAP en Chrome sin ventana + ffmpeg) y trabaja con voz de ElevenLabs; aquí se usa su criterio sobre el flujo propio (Remotion → Premiere, voz real del cliente). Lo que aplico siempre:

**Método**
- Planificar antes de construir: por plano, tiempo · frase · qué se ve · movimiento · transición · sonido · texto en pantalla. Los tiempos salen de las marcas de palabra de la voz real y viven en un solo archivo.
- Revisar cada cambio con una hoja de contacto del tramo (8 fps, pequeño, con el tiempo bajo cada fotograma), no con fotogramas sueltos: lo que falla suele pasar entre dos fotogramas. Antes de entregar, hojas de todo el vídeo.
- Cada fotograma depende solo del tiempo (sin azar sin semilla), así la vista previa es igual al final.
- Con una referencia: analizar máx. 15 s (fotogramas a 4 fps, cortes, espectrograma, transcripción) y sacar receta: formato y color · sistema de letras · línea de tiempo plano a plano · recursos que se repiten · mapa de sonidos · ritmo de corte.

**Dirección**
- Gancho en 0–3 s (afirmación fuerte, pregunta, resultado primero, sorpresa visual); nunca logo de entrada. Estructura: gancho → problema → solución → prueba → llamada a la acción (una sola, dicha y en pantalla ≥ 2 s).
- Una idea por plano; texto en pantalla ≤ 6–8 palabras; tiempo de lectura ≈ 0,3 s por palabra + 0,5 s.
- Ritmo: reels corte cada 0,5–2 s, explicativos 2–5 s por idea; variar (rápido–rápido–pausa); cortar en la primera sílaba.
- Intensidad según el tipo: 5 reel/marca personal (efecto en cada golpe, nada quieto > 1,5 s) · 4 anuncio · 3 educativo (resaltados, flechas, contadores) · 2 producto (claridad, zoom de foco) · 1 corporativo. Cuanta más confianza pide el mensaje, menos adorno; cada efecto sirve a atención, énfasis o transición.

**Animación**
- Nunca lineal. Entradas con salida suave (cúbica/expo) de 200–500 ms; salidas más rápidas que las entradas; rebote solo en marcas juguetonas.
- Escalonar elementos hermanos 40–80 ms; pasarse 5–10 % y asentar.
- Un foco por momento y el siguiente cerca del anterior; primero movimiento, luego texto. Misma dirección y misma familia de curvas en todo el vídeo.
- Zoom de énfasis en metraje: 105–120 %. Empuje lento en pausas: 0,5–2 %/s.
- 2D por defecto; 3D solo en los picos (revelación, producto, cifra, logo), máx. uno cada 5–10 s.

**Letras**
- Máx. 2 familias (+1 manuscrita). Jerarquía por tamaño, peso y color: palabra clave 2–4× el relleno, una por grupo, y solo ella lleva el acento.
- Parejas que funcionan: fina + negra en la clave · negra gruesa + rotulador · una sola geométrica con contraste de escala · serifa de titular + sans pequeña.
- Entrada por palabra: desenfoque 12→0, opacidad 0→1, sube 20 px, 180–250 ms. Por letra: 20–40 ms de escalón. Otros: cambio de palabra en el mismo hueco, contador que rueda con tic, eco de color como estela, interletrado que se cierra en el logo.
- Los textos rodean al sujeto y nunca tapan ojos ni boca; cambian de sitio por grupo para guiar la mirada.
- Zonas seguras 9:16: libre arriba ≈ 220 px, abajo ≈ 420 px, derecha ≈ 140 px; subtítulos al 60–70 % de altura.

**Color**
- 60-30-10 (dominante / secundario / acento solo para resaltar). Contraste de texto ≥ 4,5:1 (≥ 3:1 en grande); comprobar en gris. Un acento carga con todo el énfasis.

**Sonido**
- Trío: subida → golpe → silbido. Capas: grave + medio + agudo. Grande = grave y lento; pequeño = agudo y corto. El transitorio cae en el fotograma pico (±1).
- Qué suena con qué: clics → interfaz · silbido → movimiento y entradas de texto · subida → antes de revelar · golpe grave → logo o gran impacto · cámara → congelado · papel → recortes · ambiente → realismo.
- Los sonidos marcan cambios (mundo nuevo, revelación, clic), no cada palabra; variar muestras; silencio alrededor del golpe del logo.
- Mezcla: voz 10–15 dB sobre la música, música agachada bajo la voz, −14 LUFS y pico ≤ −1,5 dBTP.

**Control final**
- Gancho ≤ 3 s · subtítulos iguales a la voz y en zona segura · sonidos en su fotograma · sin halos en recortes ni parpadeos · H.264 yuv420p, AAC 48 kHz · licencias de fuentes e imágenes anotadas.

Recetas de referencia ya desmontadas en su §14 (reel de busto con subtítulos premium, documental cinematográfico, lanzamiento de producto, promo cinética a ritmo): leerlas cuando el encargo se parezca.

## Referencia del usuario: @julianealborna (TikTok, 2026-10-10) — motion graphics y sonido que quiere replicar
**Rango: referencia del usuario (manda sobre skills externas).** Estudiados sus 20 últimos vídeos (más 2 antiguos muy vistos) en `~/Videos-Remotion/referencias/perfiles-objetivo/julianealborna/`: `hojas/v20_<id>.jpg` (un fotograma cada 2 s), `detalle/`, `sonido/` (medidas por vídeo en `<id>.analisis.json`, resumen en `resumen20.jsonl`) y `stems/` (voz y música+efectos separadas). Lista en `ids20.txt`. La imagen la vi fotograma a fotograma; el sonido lo medí, no lo oí (ver límites abajo).

**Estructura (igual en los 20)**
- Duran 1,5–3 min (mediana 167 s), corte cada ~2,7 s de mediana (16–100 cortes).
- 1) Escena actuada de 10–20 s con dos personajes (él hace los dos, o uno envejecido/caracterizado): policía y conductor, cura y penitente, médico y paciente, Santa, abuelo en el hospital, taquero. Acaba en la pregunta gancho.
- 2) Historia real de alguien conocido o de un experimento (Jordan, Phelps, Clapton, Dylan, Will Smith, Jiro Ono, Gastón Acurio, Asch, la fiebre del oro) con fotos de archivo.
- 3) Explicación con motion graphics. 4) Vuelta a la escena para cerrar, con la llamada a la acción ("link en mi perfil") dicha dentro del personaje.
- El tramo sin color (motion graphics + archivo en blanco y negro) ocupa de mediana la mitad del vídeo (9–88 %).

**Motion graphics, estilo A — figuras blancas (dominante de nov 2025 a ene 2026, 12 de 20)**
- Fondo negro casi puro con grano fino y viñeta; a veces suelo gris con horizonte y reflejo.
- Figuras 3D mates blancas o grises, sin cara ni textura (maniquí, cerebro, mano con móvil, caja, trofeo, oreja, planta, médico, cavernícola), sombreado tipo arcilla, borde con resplandor blanco difuso y ligera aberración de color. A veces solo la silueta blanca plana con resplandor.
- Un acento de color por vídeo y en UN objeto: cerebro morado/azul iridiscente, zona de dolor roja, corazón azul, barra roja vs azul, silueta naranja.
- Líneas finas luminosas para lo invisible (ondas, pulso, caminos, conexiones a iconos en círculos) que se acumulan sobre el mismo plano.
- Interfaz dibujada en el mismo material: móvil con notificaciones, píldoras, contador, batería, semáforo, bocadillos.
- Una metáfora concreta por frase (cerebro = bosque con caminos; cuerpo = gerente con presupuesto; conciencia = piloto de dron).

**Motion graphics, estilo B — imagen cinematográfica con acento neón (los 8 más recientes, feb–oct 2026)**
- Menos figuras blancas; más planos generados o de archivo en blanco y negro (o muy desaturados) con UN elemento coloreado en naranja/rojo luminoso: la caja, la fogata, el botón, los barcos, el año en cifras.
- El material de apoyo adopta el mundo de la escena: confesionario → pinturas al óleo bíblicas; abuelo → fiebre del oro de 1848; cocina → archivo del chef.
- Collages de recortes de prensa y fotos con borde, inclinados, sobre negro; nombres propios en serifa o sans fina grande sobre la foto.
- Convive con el estilo A dentro del mismo vídeo cuando toca explicar algo abstracto.

**Comunes a A y B**
- Cámara siempre viva: empuje lento; entre ideas, desenfoque de movimiento corto que transforma un objeto en el siguiente; entrada desde el busto con un fotograma muy desenfocado que enfoca en ~0,3 s; algún destello blanco/cálido a pantalla completa como golpe.
- Archivo: blanco y negro, grano, pérdida de foco en bordes, viñeta fuerte, nombre de la persona en letra fina.

**Texto**
- Sans grotesca fina, minúsculas, muy pequeña (≈ 3–4 % del alto), interletrado cerrado; se escribe palabra a palabra formando un bloque de 2–3 líneas; la palabra nueva entra atenuada y se asienta; la clave solo sube de peso.
- En motion graphics: blanco con resplandor suave, arriba o al lado del objeto, nunca encima.
- En el busto: a la altura del pecho, amarillo cálido con resplandor (constante en casi todos).
- En la escena actuada: blanco, pequeño, al lado de la cara de quien habla, como bocadillo; cambia de lado con el personaje.
- Cifras y años: grandes, con resplandor rojo/naranja, a veces rodando.

**Imagen del busto y de la escena**
- Decorado oscuro con profundidad y una gama por vídeo (verde hospital, ámbar bar, azul noche, verde/teal porche); sujeto centrado, luz suave; gran angular cercano en las escenas; empujes en frases clave.

**Diseño de sonido (medido en los 20; voz separada de música+efectos)**
- Nivel final: mediana −16 LUFS (de −24 a −10; no normaliza igual todos).
- Música+efectos unos 11 dB por debajo de la voz (mediana), y solo suben ~2–3 dB cuando la voz calla: no hay bombeo marcado, la voz manda siempre.
- Hay sonido el 96 % del tiempo: casi nunca silencio total. Pero la cama respira mucho: entre sus momentos bajos y altos hay ~26 dB (p10 −50 dB, p90 −24 dB). El "silencio" se hace bajando la cama, no cortándola.
- Cama oscura: el 71 % de su energía está por debajo de 120 Hz y menos del 1 % por encima de 4 kHz. Graves y colchones, sin brillo que compita con la voz.
- Sin pulso constante (fuerza de pulso ~0,3): es ambiente/cine, no una canción con ritmo, salvo cuando el tema lo pide (en el de reggaeton suena un patrón de reggaeton solo mientras lo explica).
- Efectos puntuales: uno cada ~0,9 s de mediana; más densos en los motion graphics (≈ 14 cada 10 s) que en el busto (≈ 9). Por tipo (clasificación automática, aproximada): golpes graves ≈ 49 %, clics/tics agudos cortos ≈ 25 %, resto mezclado; barridos largos tipo silbido casi ninguno.
- Sincronía: la mitad de los cortes (53 % de mediana, hasta 77 %) llevan un sonido a menos de 0,12 s, clavado en el corte (desfase mediano +4 ms). La otra mitad pasa sin sonido propio.
- Subidas: ~10 por vídeo (≈ 1 de cada 5 cortes) llegan con la cama creciendo durante el segundo anterior; caídas bruscas tras el corte, solo ~2 por vídeo.
- En 13 de 20 la música está más alta en los motion graphics que en el busto (+2,5 dB de mediana): el gráfico "abre" el sonido y la vuelta al busto lo recoge.
- La música cambia por secciones: en el de reggaeton hay golpe de banda ancha al entrar el gráfico, patrón rítmico durante la explicación, casi vacío en la frase a cámara y colchón tonal sostenido al llegar la metáfora del jardín.
- Imagen estéreo moderada (lados ≈ 0,4 del centro): cama abierta, voz al centro.
- Límites: no puedo oír. No sé qué instrumento o muestra es cada sonido ni qué canción usa; los tipos salen de duración y espectro, y la separación de voz deja restos (sibilantes, golpes de voz) que inflan algo la cuenta de efectos.

**Cómo lo aplico a los clientes**
- Imagen: fondo negro con grano, figura blanca mate con resplandor o plano en blanco y negro con un único acento = color de marca (#1E8BFF Amin), líneas luminosas que se acumulan, texto fino pequeño.
- Sonido: cama grave y oscura siempre presente unos 11 dB bajo la voz; golpe grave o tic en la mitad de los cortes, exacto en el fotograma; subir la cama ~2–3 dB dentro del motion graphic y crecer un segundo antes de las revelaciones; bajar la cama (no cortarla) para las frases importantes a cámara; sin brillos por encima de 4 kHz en la cama.
- Las figuras 3D mates: Remotion con Three.js (material mate + bloom) o siluetas con degradado y desenfoque interior, según el encargo.
- Convive con el collage de recortes: collage para Amin cuando lo pida; este estilo cuando pida "como Julián".
