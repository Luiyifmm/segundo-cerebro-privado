---
name: talking-head-premium
description: Sistema para editar vídeos hablados (talking head, podcast, reels) con Claude y para ENSEÑARLE un estilo nuevo. Tiene los 4 principios del estilo premium minimal (color y letras, subtítulos y gancho, b-roll e imágenes, animaciones a pantalla completa), el método de 3 pasos para convertir referencias en una skill de estilo, y el flujo de edición paso a paso (corte, 9:16, documento de plan, recursos, subtítulos, escenas, sonido, música) con vista previa y correcciones que se guardan. Usar cuando el usuario pida editar un talking head o un clip de podcast, "estilo premium/minimal/Dope Motions/Joseph", "aprende este estilo", "entrena un estilo", "hazme el plan de escenas", o al empezar un vídeo hablado de cualquier cliente.
---

# Talking head premium: principios + sistema

Origen (14-11-2026): Joseph, «How to Edit VIRAL Talking Head Videos» (lnF3TUIWkO4) y Santiago Siciliano, «Cómo convertir a Claude en tu editor de vídeos» (fyn0iTuUb90). Transcripciones y hojas en
`~/EDICION/0 CLAUDE EDITOR/1 REFERENCIAS/Analizadas por Claude/2026-11-14 editar con Claude (Joseph + Santiago)/`.

**Jerarquía.** Esto es oficio y método, no reglas de cliente. Mandan antes: seguridad, BRIEF/ESTADO del vídeo, FICHA del cliente. Premiere sigue siendo el editor principal. El estilo «podcast minimal» de aquí es una **opción** de la biblioteca de estilos, no el estilo de Amin.

**Idea central (los dos vídeos coinciden).** Claude no edita mal: edita sin ojo. El resultado depende de (a) que el estilo esté escrito con detalle y (b) que el **plan de escenas lo decida un humano con criterio**. Sin eso sale «la edición de IA que se ve en todos lados».

## 1. Los 4 principios del estilo

### 1.1 Color y letras
- **Color: sale del plano, no de una paleta genérica.** Mirar el bruto y listar las fuentes de color (lámpara, planta, ropa, pared). Elegir UNA como acento. De ella sacar **4 colores**: acento vivo, acento oscuro y rico, un blanco y un negro **teñidos** hacia el acento (más cálidos o más fríos, nunca puros). Esos 4 valen para textos, formas y fondos de todo el vídeo.
- **Letras: dos familias.** Texto normal en sans (PP Neue Montreal, Urbanist) a peso **300–400**. Palabra especial en serif, script o la misma sans más gruesa, a peso **600–700**. (En Amin la FICHA fija SF Pro + una segunda: se respeta.)

### 1.2 A-roll, subtítulos y gancho
- **Persona arriba, texto abajo.** La cara en la mitad superior; la zona inferior queda reservada al texto.
- **Gancho:** buscar en la frase la palabra o pregunta que más atrae → va en la letra especial, en el centro; el resto, en letra normal alrededor.
- **Presentar a quien habla** en el primer segundo: rótulo abajo a la izquierda (nombre + cargo). Una sola vez.
- **Resto del vídeo:** 6–8 palabras por escena, o una frase. En cada escena, UNA palabra especial; las demás se alinean a su alrededor. (Coincide con la memoria «subtítulos por unidades de sentido».)

### 1.3 B-roll e imágenes
- **Vídeo:** clip completo con una textura sutil; o texto cinematográfico en el centro; o texto en el tercio inferior. Para destacar un elemento, **caja de selección que lo sigue** (tracking), con flecha y etiqueta. Si solo hay texto: líneas + movimiento de cámara para entrar y salir.
- **Imagen:** (a) lado a lado: sujeto en un lado, texto en el otro, a veces por detrás del sujeto; (b) diseño dentro de la imagen: texto detrás del objeto, líneas y texturas alrededor (cuando el objeto está en el centro).

### 1.4 Animaciones a pantalla completa (4 tipos, según lo que se dice)
| Tipo | Cuándo | Cómo |
|---|---|---|
| Dos objetos alineados | habla de UNA cosa | objeto a un lado con sombra + texto al otro; o texto arriba y un elemento que lleva la vista al tercio inferior |
| Gráficos y cifras | aumentos, caídas, números | gráfica en el centro con texto alrededor; barras a media pantalla; patrones que se van llenando |
| Elementos reales dentro de la animación | una experiencia, algo que hay que ver | fotos o clips en tira, en mosaico o en fila, con el sujeto debajo y texto arriba |
| Objeto central | un solo objeto | objeto al centro con sombra y detalles en las esquinas; o ilustración limpia |

### 1.5 Números del «libro de reglas» de Joseph
👁 Leídos de un fotograma pequeño de su vídeo; son de SU estilo y **no están probados aquí**. Usarlos como punto de partida, no como regla.
1. Tres tipos de pantalla: A-roll con texto ≈ 57 %, b-roll ≈ 24 %, pantalla completa ≈ 18 %.
2. Abrir ya en movimiento: el fotograma 0 empieza ≈ 117 % y vuelve a 100 %.
3. Nombrar a quien habla en el primer segundo, abajo a la izquierda, sin repetir.
4. La palabra tema en pantalla hacia 0,5 s, 100–300 ms **antes** de que se diga.
5. Primera imagen diseñada hacia 2,0 s: la recompensa del gancho, hecha literal.
6. Una página de subtítulo = una cláusula: línea de relleno + UNA frase especial.
7. Subtítulos a la altura del pecho, 44–66 % del alto.
8. Las palabras aparecen en su hueco al decirse.

## 2. Enseñarme un estilo nuevo (modo ENTRENAMIENTO)
Método de Joseph. Detalle y plantilla de carpetas en `referencias/entrenar-un-estilo.md`.
1. **Referencias:** al menos **10** vídeos buenos del MISMO estilo y, a ser posible, del mismo editor.
2. **Tablero de inspiración** (Figma, Miro): capturas de cada escena bien diseñada.
3. **Desglose del usuario:** agrupar las capturas por patrón (A-roll + subtítulos, b-roll, imágenes, pantalla completa…) y anotar qué las hace funcionar. **Este paso lo hace el humano**: es donde entra el criterio.
4. **Mi estudio:** fotograma a fotograma + transcripción palabra a palabra de cada referencia; después (a) diseño: colores, composición, efectos, proporciones, letras; (b) lógica de animación: tipos, tiempos, velocidad, curva; (c) relación de cada animación con el guion.
5. **Salida = paquete de estilo:** desgloses, guía de inspiración por tipo de escena (fotograma de diseño + hoja de fotogramas clave + cómo está hecho), *lookbook* (paletas y letras), libro de reglas, y el archivo que lo usa.

Aquí el paquete va a `8 BIBLIOTECA DE ESTILOS/` como PROPUESTA. Una skill nueva por estilo solo cuando el estilo esté pulido y aprobado (regla 6 del usuario). Estilos distintos se pueden combinar.

## 3. Editar un vídeo con el sistema
1. **Preparar el bruto.** Transcripción por palabra (`voz/transcribir.sh`), desglose de fotogramas, quitar silencios, reencuadre 9:16 con la cara centrada (seguimiento). Vídeo en log: aplicar el LUT. *Ojo:* Santiago corta los silencios a mano en Premiere porque no se fía; aquí ya hay `cortar-silencios` / `primer-corte` con verificador, pero el corte **se enseña antes de seguir**.
2. **Documento de plan (lo más importante).** Tabla: a la izquierda cada línea del guion; a la derecha, hueco para la escena. Arriba: paleta y familia de letras. El usuario decide; yo propongo cada línea con su motivo. Guía:
   - frase de transición o «¿qué significa?» → A-roll con subtítulos (deja respirar);
   - lista de componentes → b-roll con texto y elementos alrededor;
   - sustancias, conceptos, cifras → pantalla completa (tipo de 1.4);
   - **gancho:** texto + presentación + una animación fuerte temprana que prometa nivel;
   - **cierre:** repetir un motivo visual anterior con variación; terminar en A-roll.
   Es el paso «dirección creativa» del flujo del usuario: se guarda en el BRIEF.
3. **Recursos.** Del plan sale la lista (imágenes, ilustraciones, b-roll, iconos); se buscan y se enseñan.
4. **Construir por bloques, enseñando cada uno:** subtítulos y gancho → b-roll → pantallas completas, una a una. Primero un **fotograma de diseño** de cada escena; se anima cuando el diseño está aprobado.
5. **Vista previa del gancho** (≈ 12 s, calidad normal) antes de hacer el resto. Si el gancho no convence, no se sigue.
6. **Render de comprobación** completo; mirarlo con fotogramas (regla 2).
7. **Sonido, al final:** hoja de sonido (qué pasa en pantalla, cuándo, qué efecto) → colocar al fotograma y a su volumen (`real-sfx`, `earshot`). **Música:** proponer varias con muestras de 10 s; elige el usuario (regla 5).
8. **Máster 1080p** y entrega en la carpeta del bruto. QC como siempre.

## 4. Cómo se mejora (Santiago)
- **Cada corrección se guarda** para que no se repita: en esta casa va a `PROPUESTAS DE REGLAS` y, aprobada, a la FICHA, a Lecciones o al estilo. Nunca directo a regla.
- **Preguntar «¿falta algo?»** tras instalar o terminar un bloque: comprobar de verdad y decir lo no verificado.
- **Anotar el tiempo** por vídeo (`_REGISTRO DE EFICIENCIA`). El primero de un estilo tarda (él: 1 h 10); con el estilo pulido, 25–30 min.
- **Una «oficina» por cliente:** una sesión con nombre por cliente o proyecto en la barra lateral, todas sobre la misma carpeta, y una **cola de edición** por lote (vídeo, gancho, CTA, música, estado). La «galaxia» es la vista de grafo de Obsidian sobre la bóveda.
- **Variantes:** un anuncio × 2 ganchos × 2 CTA = 4 vídeos con el mismo estilo; la cola lo controla.

## 5. Referencias
- De esta skill: `@dopemotions` (Dope Motions), el editor que Joseph usó para el estilo; Joseph (@josephswork); Santiago Siciliano.
- Tablero del usuario (Miro, «referencias de contenido»): `https://miro.com/app/board/uXjVEQWi97U=/`. Privado: **no leído todavía**.
- Ya analizados (no repetir el estudio): Julian Alborna (`perfiles-objetivo/julianealborna/`), Jordan Belfort (`2026-11-08 jordan …`), Marco Said / Invisible (`4 ENTRENAMIENTO/ESTUDIO Invisible…`), S Project (`sproject/`), y Natt Jongsala, Víctor Heras, Guille Collado, Ashish Kumar, Zane Hoyer (`2026-10-30 premium/`, skill `edicion-premium`).
- Skills hermanas: `edicion-premium` (recetas con números), `direccion-viral` (gancho y retención), `subtitulos`, `real-sfx`, `hyperframes`, `premiere-puente`.
