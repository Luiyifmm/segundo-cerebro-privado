# 05 · Errores, lecciones y correcciones del usuario

Formato: **qué pasó → cómo lo arreglé → regla que saqué.** Primero las correcciones de gusto (las que más importan) y después los fallos técnicos.

## A. Correcciones del usuario y de sus clientes

1. **Imágenes que tapaban a la persona** (primera tanda, 08-10).
   - Arreglo: las imágenes pasaron detrás de la persona recortada o fuera de su silueta, y aparecen justo cuando se nombran.
   - Regla: **nada sobre la cara nunca**; revisar los fotogramas de cada versión antes de exportar.
2. **"Quiero las propuestas dentro de Premiere, por capas"** (08-10).
   - Regla: **todo editable**. Subtítulos como MOGRT con texto, zooms como escala del clip, motion graphics en pista aparte. Nunca un render plano para un vídeo de cliente.
3. **Subtítulos de ClienteA: "sencillos, sin animación o una fácil de editar"**, y después "minimalista" (09-10).
   - Arreglo: plantillas v4 → v8 → v10, todas en SF Pro, clave azul ~2,4× más grande que la línea, bloque compacto alineado a la izquierda.
   - Regla: los subtítulos de cliente son sencillos; los animados, solo para trials.
4. **"Los clips de plantilla no se pueden estirar con el ratón."**
   - Arreglo: recortar con `clip.end` Y después `clip.outPoint`.
   - Regla: siempre los dos.
5. **Las alternativas de ClienteA NO son su formato de marca**, son variantes para Trial Reels (09-10).
   - Regla: no tratar ninguna variante como plantilla del cliente.
6. **"Vídeos más naturales, sin sobrecarga dopamínica; edición elegante y sencilla"** (10-10, decisión hablada con el cliente).
   - Regla: menos es más en todos los clientes; la densidad de efectos de las referencias virales no se aplica salvo que la pidan.
7. **"Las referencias y el documento con vídeos que os pasamos son lo más importante"** (10-10, justo después de que yo instalara una skill externa).
   - Regla: el orden de autoridad (correcciones > referencias del usuario > skills externas).
8. **Imágenes de stock → "sácalas de Pinterest, que retengan, que generen controversia"** (10-10).
   - Regla: imagen conceptual o satírica, no stock neutro.
9. **ClienteE: voz "niquelada" muy por encima de la música; verde = bueno y rojo = malo aunque la marca sea naranja; títulos más pequeños; los alimentos quedan como miniatura acumulada** (10-10).
   - Regla: la voz manda (~18 dB sobre la música); color con significado en comparativas; acumular miniaturas para no perder el hilo.
10. **ClienteN: letra "tipo Nike", sin contorno; música "más fuerte, no suave"; sonidos de acierto y error; "no te compliques"** (10-10).
    - Regla: con ClienteN, versión simple; palabra grande en Futura Condensed ExtraBold roja y el resto fino.
11. **"Ese vídeo ya estaba hecho, haz otro"** (12-10).
    - Regla: antes de montar una propuesta, mirar en EXPORTADOS / HECHOS si ya existe.
12. **Acelerar la edición entera anidada sonaba "como una ardilla", o "con eco" si se mantenía el tono, y los efectos dejaban de oírse** (12-10).
    - Arreglo: imagen anidada y acelerada; voz en su propio anidado acelerado manteniendo el tono; efectos y música sueltos a velocidad normal, recolocados.
    - Regla: **nunca meter voz y efectos en el mismo clip acelerado.**
13. **"No separes los canales"** (12-10). Mi XML repartía el estéreo en A1/A2 y el usuario oía un solo lado.
    - Regla: dejar el audio como el original (un clip estéreo) y arreglarlo con "Rellenar…".
14. **"No me entregues los vídeos cortados: en crudo, y solo quita los silencios"**, y después, para ClienteA, "ni silencios" (11-10).
    - Regla: con ClienteA, bruto entero + marcadores con duración por idea; nada de marcadores por frase ni con emojis.
15. **Marcadores sin duración** (11-10). Con `m.end = Time` no da error, pero el marcador queda sin duración.
    - Regla: `m.end = <número de segundos>` y leer `end − start` después de crearlo.
16. **Propuesta de ClienteE rechazada (22-10):** cajas de etiqueta naranja y negra, palabras clave solas, textos demasiado cortos y "Normal Pop.wav" (varios pops seguidos).
    - Regla:
      - sin cajas;
      - las plantillas del propio usuario;
      - la clave nunca sola;
      - un solo pop por objeto (Smooth Pop);
      - Cinematic Click en claves y Data Collect en cifras.
17. **"Calcula esto", corrección del cliente (29-10):**
    - quitar del audio las cifras alternativas;
    - lista con emoji + nombre en blanco + valor pequeño debajo;
    - título grande;
    - píldora de 1–2 s como máximo;
    - pizarra más pequeña que esconde la lista mientras está;
    - suma final de kcal.

    Regla: la cifra en pantalla tiene que coincidir con la voz; si el cliente quiere otra cifra, **hay que cortar el audio**, no solo cambiar el gráfico.
18. **"Que el tablero aparezca donde están los demás resultados"** (29-10).
    - Regla: una tarjeta nueva aparece en la zona de la lista que sustituye, no en otro sitio.
19. **Tabla "Si quieres / Debes" (29-10):**
    - "más llamativo, naranja con glow y verde en Debes";
    - después "al revés": el glow va en las casillas vacías y se quita al aparecer el texto;
    - "no agrandes los cuadros";
    - "no los muevas".

    Regla: aplicar **solo** lo pedido. Si el usuario corrige el movimiento, no tocar otra cosa que el movimiento. La animación de entrada "sale hacia fuera" no gustó: opacidad sí, movimiento no.
20. **"Hice recortes: acomoda subtítulos y animaciones"** (varias veces).
    - Regla: recalcular todo por el segundo del bruto (in-point de cada pieza de V1). No asumir que la línea de tiempo sigue igual: **releerla antes de cada cambio.**
21. **"No tenías que hacer tantos cambios: hay espacios sin vídeo, moviste los subtítulos"** (30-10).
    - En realidad los huecos ya estaban, pero mi mensaje dio a entender otra cosa.
    - Regla: al informar, separar claramente **lo que hice yo** de **lo que vi y ya estaba**, y no proponer arreglos que no se pidieron como si fueran parte del trabajo.
22. **"Usa el que tengo en 5 PARA EDITAR, no lo toques, solo la animación"** (30-10).
    - Regla: cuando el usuario dice en qué secuencia trabajar, se trabaja ahí. "No lo toques" = no tocar vídeo, audio ni subtítulos; solo la capa pedida, en una pista nueva, y la versión anterior desactivada.
23. **Pizarra con "mucho texto" (30-10, audio del cliente).** Pidió:
    - "???" al empezar;
    - cada operación aparece, se fusiona en su resultado y solo el resultado queda fijado;
    - al sumar o restar, los fijados se fusionan y sale un resultado más grande.

    Regla: en gráficos de cálculo, una operación cada vez y solo el resultado fijo.
24. **"Que la segunda alternativa no dé con los subtítulos"** (30-10).
    - Arreglo: medí la franja real de los subtítulos (≈ 915–995 px, hasta x ≈ 560–800 px) en fotogramas sin la animación y compacté la lista por encima de esa franja.
    - Regla: comprobar las colisiones con **fotogramas reales de Premiere y los subtítulos del usuario**, no solo con el render suelto de Remotion.
25. **"Al exportar no se escucha la voz"** (30-10).
    - Causa: en esas cámaras la voz está solo en el canal derecho (el izquierdo a −91 dB).
    - Arreglo: "Rellenar izquierda con derecha" en cada clip de voz.
    - Regla: **medir los canales de cada bruto en la ingesta.**
26. **Portadas:**
    - nitidez: siempre desde el fotograma 4K a 2160×3840, eligiendo por varianza del laplaciano y mirando las manos;
    - "fondos más naturales": persona recortada sobre su fondo oscurecido y desenfocado, sin sepia;
    - pelo con huecos de pared: limpiar el halo con un filtro estricto (distancia al color de pared < 0,16).
27. **"Recuerda: digno de un resultado final"** con ClienteE y ClienteN (11-10).
    - Regla: no preguntar ni entregar a medias; montar la propuesta completa y enseñarla.

## B. Fallos técnicos y su arreglo

| Fallo | Arreglo / regla |
|---|---|
| `importMGT` mete la plantilla con 30 s y **pisa** los clips de detrás: se borraron 32 subtítulos (19-10) | Colocar siempre en una pista VACÍA y en orden de tiempo |
| Al cambiar una plantilla filtrando por nombre de propiedad ("Palabra clave"), se sobrescribieron textos de otras plantillas (16-10) | Filtrar por `clip.projectItem.name` + pista; clonar la secuencia antes |
| `overwriteClip` de un efecto entra con la duración completa del archivo y pisa lo siguiente | Colocar de derecha a izquierda o en una pista libre |
| Mover efectos dentro de la misma pista los superpone | Primero todos +200 s, luego cada uno a su sitio, y después comprobar duraciones (un whoosh quedó superpuesto y lo adelanté) |
| Huecos de 1 fotograma tras `overwriteClip` | Script que mueve los clips siguientes a la izquierda |
| Fotogramas de Remotion calculados a 24 fps en una composición de 30 | `frame = s × fps` real; mirar `fps` en Root.tsx |
| `interpolate` con `Infinity` en el rango tumbó un render a mitad | Usar valores finitos (por ejemplo `tFin + 5`) |
| Emoji ⚖️ en gris (texto con contorno) / emoji de balanza en vez de báscula | Emojis siempre como PNG de Apple; comprobar que el emoji significa lo que se pide |
| "Doble fantasma" cuando un resultado se usa enseguida | Si se reutiliza en < 1,6 s, no se fija arriba: se queda en el centro y se funde |
| Subtítulos nativos ("Gráfico") no se leen ni se escriben por script | Para textos en serie, plantillas MOGRT propias; los nativos los corrige el usuario a mano |
| Las pistas de subtítulos copiadas en subsecuencias no son accesibles | Pedir al usuario que las borre |
| `exportFramePNG` devuelve caché si se repite el mismo instante | Un script por estado y tiempos distintos |
| Clips A001 girados o no según el archivo; proxy regenerado se ve deformado | Leer `VideoInfo`; proxy nuevo con OTRO nombre de archivo |
| Voz "superpuesta" al exportar justo después de tocar "Mejorar la voz" | Esperar a que termine el análisis; comprobar transcribiendo la exportación |
| La cadena de mejora subió 5 dB el ruido del gimnasio de ClienteE | Medir los silencios antes y después; si sube el ruido, dejar la voz sin procesar |
| ProRes 4444 de ffmpeg 6 con un alfa que Premiere no lee | Usar el ffmpeg de Remotion |
| `qe…getVideoEffectByName` con un nombre inexistente devuelve un objeto vacío y no falla | Comprobar `fx.name`; los nombres van en español ("Volteado horizontal", "Color de Lumetri") |
| El puente "timed out" pero el script sigue | No lanzar otro encima; leer el estado después |
| Demucs falla al guardar con torchaudio | API de Python + guardar con soundfile |
| ffmpeg `lavfi color` sin `-frames` se quedó colgado en segundo plano | Usar siempre `-frames:v 1` |
| Las imágenes de Wikimedia fueron de mala calidad y con error 429 | Para alimentos, emojis de Apple; Wikimedia solo con revisión a ojo de la hoja de candidatas |
| `while read` + ffmpeg se comía las líneas del bucle | `ffmpeg -nostdin` |
