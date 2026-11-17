---
name: editor-maestro
description: Manual de operación del editor de vídeo con IA de Luis - el flujo completo de un vídeo hablado de principio a fin (preparar el bruto, plan de escenas, diseño, construcción, Premiere, sonido, auditoría, entrega), con la orden exacta de cada paso, qué archivo sale, cuándo parar a preguntar y qué skill cargar. Cargar SIEMPRE PRIMERO al empezar o retomar cualquier vídeo, cuando el usuario diga «edita este vídeo», «llegó material», «prepara este clip», «hazme el plan», «sigue con el vídeo de X», o cuando no esté claro qué skill o herramienta toca.
---

# Editor maestro: cómo se edita un vídeo aquí

Escrito para que cualquier modelo lo ejecute sin contexto previo. Si algo de aquí choca con una orden del usuario en el chat, manda el usuario.

## 0. Antes de tocar nada (2 minutos)
1. Leer `~/.claude/CLAUDE.md` (reglas que no se negocian). Resumen: Premiere es el editor principal · nunca destruir trabajo del usuario (copia o pista nueva; desactivar, no borrar) · releer la línea de tiempo antes de cada cambio · mirar fotogramas antes de decir «hecho» · aplicar solo lo pedido · Drive es de solo lectura · decir siempre lo no comprobado.
2. Saber **de quién es el vídeo** y leer SOLO su ficha: `~/EDICION/0 CLAUDE EDITOR/2 CLIENTES/<CLIENTE>/FICHA.md`. Alumnos de Trainer10x: `7 TRABAJOS EN CURSO/Marcas alumnos Trainer10x · PROPUESTA.md`.
3. Si el trabajo ya existe, leer su ESTADO (`7 TRABAJOS EN CURSO/<trabajo>.md`) y nada más.
4. Decir en una línea en qué modo se trabaja: **PRODUCCIÓN** (vídeo real: sin experimentos) o **ENTRENAMIENTO** (pruebas: siempre en copias).

## 1. El flujo (8 pasos). No saltarse las paradas.
| # | Paso | Orden o skill | Sale | Hecho cuando… | ¿Parar? |
|---|---|---|---|---|---|
| 1 | **Preparar el bruto** | `~/Videos-Remotion/sistema/preparar-clip.sh "<vídeo>"` | `<vídeo> · preparado/`: `palabras.json` (por palabra, en ms), `hojas/` (2 fotogramas/s), `cortado.mp4`, `tramos.json`, `plan.html`, `plan.md`, `RESUMEN.md` | RESUMEN dice «verificada» y he MIRADO las hojas | **Sí:** enseñar cuántos segundos se quitaron y pedir que vea `cortado.mp4` |
| 2 | **Formato y estilo** | Leer `10 BIBLIOTECA DE FORMATOS/00 Índice.md` y `8 BIBLIOTECA DE ESTILOS/00 Índice.md` | Formato + estilo + variante elegidos, con su porqué | Una línea escrita en el BRIEF | Se propone junto con el paso 3 |
| 3 | **Plan de escenas** | Por cada línea: clasificar la idea y consultar el banco (skill `criterio`: `criterio.py buscar --idea <idea> --nicho <nicho>`). Escribir `propuestas.json` (`[{"n":1,"tipo":"…","texto":"qué se ve y por qué","especial":"…"}]`, una por línea) y regenerar: `<python del entorno whisperx> ~/Videos-Remotion/sistema/plan-escenas.py palabras.json --salida <carpeta> --video cortado.mp4 --tramos tramos.json --marca "Cliente:#acento,#oscuro" --propuestas propuestas.json`. El usuario abre `plan.html`: elige paleta y letras (con vista previa), corrige casillas y pega «Copiar plan» | Plan completo + paleta + letras | Cada escena tiene motivo; reparto y tramo máximo de A-roll dentro de las reglas del estilo | **Sí, siempre.** Sin su «sí» no se construye. Guardarlo en el BRIEF |
| 4 | **Recursos** | Lista de imágenes, b-roll, iconos, fotos del cliente que pide el plan | Carpeta `recursos/` + lista de lo que falta | Cada recurso tiene origen y licencia anotados | **Sí** si falta material del cliente o hay que descargar algo |
| 5 | **Fotograma de diseño** de cada escena, sobre un fotograma real | skill del estilo (`minimal-corto`, `edicion-premium`…) | Hoja con todas las escenas en parado | Lo he mirado y no tapa cara, manos ni texto | **Sí:** se anima solo lo aprobado |
| 6 | **Construir y llevar a Premiere** | skill `premiere-puente` (+ `hyperframes`, `remotion-best-practices` o `after-effects-editor` para animar) | Copia de la secuencia con las capas en pistas nuevas | Fotogramas exportados DE PREMIERE mirados | Vista previa del gancho antes de hacer el resto |
| 7 | **Sonido** (al final) | skills `real-sfx` y `earshot` | Efectos en pistas nuevas; música: 3–5 muestras de 10 s | Niveles medidos | **Sí:** la música la elige el usuario |
| 8 | **Revisar y entregar** | QC técnico: `~/Videos-Remotion/herramientas/qc/LEEME.md` · mirar la hoja · `foto-secuencia.sh <trabajo> antes`. **Auditoría del estilo (`auditar-estilo-minimal.py`) solo si:** primer vídeo de un estilo o cliente, vídeo devuelto con correcciones de fondo, rindió mal, o Luis la pide | Informe con OK / FALLA / NO VERIFICADO y nota | He mirado la hoja con mis ojos | Entrega = mensaje en 3 partes (abajo) |

Al cerrar cada paso: actualizar el ESTADO (≤ 40 líneas) y su bloque Traspaso (≤ 10). El detalle va a la BITÁCORA.

## 2. Qué skill o herramienta para cada cosa
| Necesito | Usar |
|---|---|
| Decidir qué recurso explica una idea, o aprender de un vídeo de referencia | skill `criterio` (banco en `11 BANCO DE CRITERIO/BANCO.md`) |
| Transcribir | `~/Videos-Remotion/voz/transcribir.sh <archivo>` (detecta el idioma; `--idioma es\|en` para forzarlo). Comprobar siempre que el texto está en el idioma del vídeo |
| Solo quitar silencios | `preparar-clip.sh` o skill `cortar-silencios` |
| Varias tomas, repeticiones, «quita 3 y 7» | skill `primer-corte` |
| Tocar Premiere | skill `premiere-puente` · recetas en `~/Videos-Remotion/premiere/recetas/LEEME.md` · siempre con guardia |
| Subtítulos | skill `subtitulos` + ficha del cliente |
| Estilo «podcast minimal» | skill `minimal-corto` (16 reglas + auditoría) |
| Vídeo fitness | `8 BIBLIOTECA DE ESTILOS/11 Fitness con pruebas (minimal adaptado).md` |
| Método general de talking head, enseñarme un estilo | skill `talking-head-premium` |
| Recetas premium con números | skill `edicion-premium` |
| Gancho, retención, estructura | skill `direccion-viral` |
| Animar | `hyperframes` (HTML → vídeo) · `remotion-best-practices` · `after-effects-editor` |
| Sonido | `real-sfx` (efectos reales), `earshot` (medir y escuchar) |
| Color de iPhone / HDR | skill `color-hdr` |
| Portada | skill `portadas` |
| Dónde colocar una imagen según la persona | `~/Videos-Remotion/herramientas/composicion/componer.py` |

## 3. Paradas obligatorias (preguntar y esperar)
- Aprobar el corte (paso 1), el plan (3) y los fotogramas de diseño (5).
- Antes de instalar, descargar, borrar o guardar un proyecto de Premiere.
- Música y voz: siempre las elige el usuario.
- Cualquier cosa que cambie una regla del cliente: va como PROPUESTA a `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`.
Lo demás se hace sin preguntar.

## 4. Errores que ya han pasado (no repetirlos)
| Pasó | Regla |
|---|---|
| Premiere se colgó al quitar un clip, importar y colocar en un mismo script | **Una operación por script.** Importar en un paso aparte y leer el estado antes del siguiente |
| Una capa transparente salió con fondo negro | El ProRes 4444 de ffmpeg no lo lee Premiere: usar **secuencia de PNG** (`importFiles(..., true)` y poner 30 fps) o `~/Videos-Remotion/hyperframes/render-para-premiere.sh`. Mirar un fotograma de Premiere antes de seguir |
| `fotogramas.jsx` devolvió el fotograma viejo | No repetir el mismo instante: usar tiempos distintos en cada comprobación |
| Texto de color ilegible sobre pared clara | El acento va sobre zonas oscuras o dentro de una caja |
| Subtítulo encima de la mano y el micro | Mirar el plano antes de fijar la altura del texto |
| Salidas enormes llenaron el contexto | `yt-dlp -q --no-progress`; no listar carpetas grandes (`premiere/` tiene 224 scripts): buscar por nombre; no leer JSON de palabras enteros |
| Los subtítulos de un vídeo de YouTube dieron error 429 | Bajar el audio y transcribir en local |
| Tablero de Miro o panel con contraseña | No escribir contraseñas: usar el Chrome del usuario con su sesión, o pedir exportación |
| Dos órdenes a Premiere a la vez | Nunca en paralelo ni en segundo plano |
| Premiere tenía abierto OTRO proyecto del usuario | No cambiar de proyecto ni de secuencia: leer el `.prproj` con `leer-prproj.js` (§ 7) y esperar a que el usuario abra el suyo para escribir |
| Un «LIMPIO» de un script se dio por aprobación | Un script no aprueba: se mira la hoja |

## 5. Cómo se escribe al usuario
Español, directo. Tres partes: **Comunicado** (primero el resultado; separar lo que hice de lo que ya estaba) · **Qué necesito de ti** · **Pendiente / no comprobado**. Nunca decir «hecho» sin haber mirado fotogramas. Lo no medido se escribe NO VERIFICADO.

## 7. Alumnos de Trainer10x (entrenadores)
- **Antes de nada:** leer `~/EDICION/3 PROYECTOS/Alumnos Trainer10x/GUIONES Y PETICIONES.md` (guion, petición del alumno, marca y material que falta). Si el alumno no está ahí, el guion y la petición están en el panel de Trainer10x: se abre con el Chrome de Luis (su sesión), nunca escribiendo contraseñas.
- **Jerarquía:** petición escrita del alumno › su marca (`7 TRABAJOS EN CURSO/Marcas alumnos Trainer10x · PROPUESTA.md`) › estilo.
- **Estilo:** `8 BIBLIOTECA DE ESTILOS/11 Fitness con pruebas (minimal adaptado).md`. Cada afirmación con su prueba; A-roll 55–70 %.
- **El corte ya suele estar hecho** en `ALUMNOS TRAINER10X - 14 NOV.prproj`. No se vuelve a cortar: en `PLANES/<alumno>/` están `tramos.json` (lo que el corte conserva, en segundos del bruto), `palabras.json` y `corte-baja.mp4`. Si faltan, se sacan sin abrir Premiere:
  `gunzip -c "<proyecto>.prproj" > /tmp/p.xml && node ~/Videos-Remotion/premiere/leer-prproj.js /tmp/p.xml /tmp/clips.json` (por secuencia, los clips de V1 con `entrada` y `salida`).
- **Plan:** `<python del entorno whisperx> ~/Videos-Remotion/sistema/plan-escenas.py PLANES/<alumno>/palabras.json --salida <carpeta> --video PLANES/<alumno>/corte-baja.mp4 --tramos PLANES/<alumno>/tramos.json --marca "<Alumno>:#bueno,#malo" --propuestas propuestas.json`.
- **Nunca** inventar un estudio, una cifra o un cargo; si falta una foto o un b-roll del alumno, se pide y la escena queda en A-roll mientras tanto.
- **Entregar al alumno** lo hace Luis desde el panel.

## 6. Definición de «terminado»
Un vídeo está terminado cuando: el plan aprobado está en el BRIEF · todo vive en una copia o en pistas nuevas · hay fotogramas de Premiere mirados de cada escena · el QC y la auditoría están escritos con sus NO VERIFICADO · el ESTADO tiene el Traspaso · el usuario ha recibido el mensaje en 3 partes. Guardar el proyecto y entregar al cliente son decisiones del usuario.
