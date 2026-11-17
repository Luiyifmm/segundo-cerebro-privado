---
tipo: aprendizaje
actualizado: 2026-11-07
---
# Lecciones generales de edición

Reglas de oficio que valen para cualquier vídeo y cualquier cliente. Salen de correcciones reales: muchas de clientes que ya no están activos (Eric y Natalia, archivados el 06-11-2026). Aquí **no hay preferencias de marca**; las de cada cliente activo viven en su ficha.

## Trabajo con el usuario
- **Aplicar solo lo pedido.** Si corrige el movimiento, no se toca el tamaño ni el color.
- **"No lo toques"** = solo la capa pedida, en pista nueva, y la versión anterior desactivada.
- **Trabajar en la secuencia que diga.** Releer la línea de tiempo antes de cada cambio: el usuario recorta y mueve pistas mientras trabajo.
- **Al informar, separar** lo que hice yo de lo que vi y ya estaba.
- **Antes de proponer un vídeo, comprobar que no esté ya hecho** (EXPORTADOS / TERMINADO).
- **Dirección creativa ANTES de montar (regla de flujo, 07-11-2026; vale para todos los clientes):** con un vídeo nuevo que pida decisiones creativas,
  1. analizar el contenido y el contexto;
  2. proponer el mensaje, la emoción, el gancho, qué quitar, qué reforzar y el estilo;
  3. señalar los momentos para respirar;
  4. hacer de 2 a 4 preguntas concretas (nada que se pueda deducir del material o de lo confirmado);
  5. **esperar su aprobación**;
  6. guardar las decisiones en el BRIEF CREATIVO del trabajo y solo entonces montar.
  - Excepciones: correcciones técnicas puntuales, lo ya aprobado o «ejecútalo directamente». Origen: su nota de 6/10 a IMG_6124 («calidad creativa general»).
- **Cada recurso con función:** antes de un gráfico, imagen, zoom o SFX, decir qué hace (explicar, contrastar, emocionar, reforzar, recuperar la atención o conectar partes). Sin función clara, fuera.
- **Propuesta "digna de resultado final"** cuando el encargo es una edición completa: montarla entera y enseñarla, sin preguntar a medias, **una vez aprobado el brief** (la regla de arriba manda).

## Subtítulos
- **La palabra clave nunca va sola.** Línea de 1–3 palabras + clave al final del bloque.
- **Un bloque nunca termina en "de / la / que / y…".** Bloques de menos de ~0,45 s se unen al anterior.
- **Clave que se dice tarde:** clip aparte en la pista de encima, desde que se dice hasta el final del bloque.
- **Cifras como gráfico:** la cifra sale del texto del subtítulo. Si la frase entera es la cifra, sin subtítulo.
- **Durante títulos grandes,** los subtítulos se apartan (más arriba o más abajo) para no chocar.
- **Faltas y tildes:** revisar siempre; completar las palabras que Whisper corta; quitar muletillas.

## Gráficos y motion graphics
- **Efectos con intención (confirmada 07-11-2026, fase 6):** antes de un destello, impacto, zoom, transición o animación, responder cinco cosas:
  1. qué idea refuerza;
  2. qué emoción busca;
  3. qué se pierde si se quita;
  4. si encaja con el estilo y el ritmo;
  5. si el acabado tiene calidad.
  - Si no aporta, no entra. En la duda, montaje limpio y buena imagen.
  - Origen: los destellos de los ejercicios de la fase 5 no aportaban y su acabado no le gustó.
- **Composición con la persona (confirmada 07-11-2026, fase 6):** antes de colocar imágenes o tarjetas, revisar:
  1. la cara y el cuerpo;
  2. la mirada y los gestos;
  3. el espacio libre;
  4. los subtítulos.
  - Si la persona **señala**, la imagen va donde apunta el dedo y **algo por encima de la punta**, sin tapar la mano.
  - Si el gesto no se detecta con fiabilidad, no se inventa: composición equilibrada y marcada para revisión.
  - Nada de posiciones fijas por defecto. Comprobar con fotogramas reales de Premiere.
  - Herramienta: `herramientas/composicion/componer.py`.
  - Origen: en la fase 5 las imágenes debían ir algo más arriba, para que pareciera que Amin las señala.
- **Gráfico y subtítulo no repiten la misma información sin necesidad** (aprobada el 06-11-2026). Si el gráfico explica la idea visualmente, adaptar u ocultar un momento el subtítulo cuando convenga. Se permiten las repeticiones deliberadas que mejoran la comprensión.
- **La cifra en pantalla = la que dice la voz.** Si hay que cambiar la cifra, se corta el audio, no solo el gráfico.
- **Gráficos de cálculo:** una operación cada vez; solo el resultado queda fijo; los resultados se fusionan al sumar.
- **Una tarjeta nueva aparece donde está lo que sustituye**, no en otro sitio.
- **Píldoras de contexto:** 1–2 s como máximo.
- **Lista acumulada / miniaturas:** lo ya dicho se queda en pantalla en pequeño para no perder el hilo.
- **Comparativas:** malo en rojo, bueno en verde, aunque el color de marca sea otro.
- **Nada de cajas o etiquetas** si el estilo del cliente no las usa: primero sus propias plantillas.
- **Entradas por opacidad** si el usuario pide "que no se mueva".
- **Comprobar colisiones con fotogramas reales de Premiere** (con los subtítulos del usuario), no solo con el render suelto.
- **Zona segura 9:16:** nada clave en los ~200–250 px de arriba ni en los ~300 px de abajo.

## Sonido
- **Un objeto = un sonido.** Un pop simple, nunca un archivo con varios pops seguidos (parece que salen varios objetos).
- **Clic en las palabras clave importantes, sonido de datos en cifras, pop en emojis o ítems.** No uno por palabra.
- **La voz manda:** unos 15–18 dB por encima de la música.
- **Mejora de voz:** medir el ruido antes y después. Si sube (gimnasio, sala con eco), dejar la voz sin comprimir.
- **Exportar después de "Mejorar la voz":** esperar a que termine el análisis o la voz sale "superpuesta"; comprobar transcribiendo la exportación.
- **Música:** si el vídeo vive de la música (sin voz), la de la referencia, potente (~−15 LUFS).

## Audio técnico
- **Medir los canales de cada bruto al recibirlo.** Si la voz va en un solo canal: "Rellenar izquierda con derecha" (o al revés), nunca separar canales en A1/A2.
- **Acelerar:** nunca voz y efectos en el mismo clip acelerado.

## Premiere por script
- `importMGT` entra con 30 s y pisa lo que haya detrás: **pista vacía y en orden**.
- Recortar MOGRT con `end` **y** `outPoint`.
- Filtrar por **nombre de plantilla + pista**, nunca por nombre de propiedad.
- Plantillas MOGRT de más de 30 s se quedan vacías: partir en dos clips.
- Clips de cámara A001 (3840×2160 con giro): leer `VideoInfo`; proxy regenerado = otro nombre de archivo.
- Plantillas verticales en secuencias 16:9 salen enormes: probar con 5 clips y un fotograma antes de meter cientos.

## Color
- **Antes de corregir:** comprobar que se exporta la secuencia correcta y que TODAS las tomas tienen Lumetri (los clips añadidos después llegan sin él).
- Material de iPhone HLG: corrección base aceptada en la skill `color-hdr`.

## Portadas
- Fotograma desde el 4K a 2160×3840, el más nítido (varianza del laplaciano), mirando manos y cara al 100 %.
- Persona recortada sobre su propio fondo oscurecido y desenfocado, sin sepia; limpiar el halo de pared con filtro estricto.
- Planos de correr salen movidos: usar caminar.
