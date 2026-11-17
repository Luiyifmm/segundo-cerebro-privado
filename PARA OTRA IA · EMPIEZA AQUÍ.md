# Para otra IA · empieza aquí

Escrito por Claude (Opus) el 17-11-2026, después de ~6 semanas editando vídeo con Luis. Objetivo: que otro modelo, sin haber vivido esas conversaciones, trabaje al mismo nivel. Lee esto entero antes de tocar un vídeo.

## 1. Quién es Luis y cómo se trabaja con él
- Editor profesional en **Premiere Pro**. Clientes: **Amin** (@aminbusinesss, el principal) y, por encargo de Amin, los **alumnos de Trainer10x** (entrenadores que graban reels). Víctor Hugo es prospecto: nada a su nombre sin su sí. Eric y Natalia, archivados.
- Habla en **español, directo y breve**. Cada mensaje en tres partes: **Comunicado** (primero el resultado; separar lo que hiciste de lo que ya estaba) · **Qué necesito de ti** · **Pendiente / no comprobado**. Di siempre lo que no comprobaste.
- Quiere un **editor principal** autónomo (sube y baja vídeos él mismo, scripts sin tokens), pero que **pare a preguntar** en las paradas del flujo y en todo lo que sea hacia fuera (entregar a un alumno, publicar, descargar de internet).
- Corrige mucho y bien: cada corrección es oro. Se apunta como **PROPUESTA**; solo es regla cuando él la aprueba.

## 2. Orden de lectura (≈ 1 hora, en este orden)
1. `claude/CLAUDE.md` — reglas que no se negocian y jerarquía cuando chocan.
2. `skills/editor-maestro/SKILL.md` — el flujo de 8 pasos, qué skill toca y **cuándo parar**. Se carga siempre primero.
3. `boveda/GUÍA · cómo trabajar con Opus.md` — por qué falló la edición de Álvaro y cómo se trabaja: un vídeo = 4 mensajes.
4. `memoria/edicion/*.md` y `memoria/general/*.md` — gustos y correcciones de Luis (sección 5 abajo resume lo esencial).
5. `boveda/4 ENTRENAMIENTO/Lecciones generales de edición.md`, `PROPUESTAS DE REGLAS.md`, `REGISTRO DE CORRECCIONES.md`, `QC TÉCNICO y QC CREATIVO.md`.
6. `boveda/2 CLIENTES/AMIN/FICHA.md` y `boveda/7 TRABAJOS EN CURSO/Marcas alumnos Trainer10x · PROPUESTA.md`.
7. `boveda/10 BIBLIOTECA DE FORMATOS/` y `boveda/8 BIBLIOTECA DE ESTILOS/00 Índice.md` (opciones, no reglas).
8. `boveda/11 BANCO DE CRITERIO/BANCO.md` — 113 recursos: qué recurso explica qué idea y por qué (incluye el estudio de Miro pieza a pieza).
9. `boveda/1 REFERENCIAS/` — `favoritas/` (6 vídeos que **mandan sobre todo lo demás**) y `Analizadas por Claude/` (medidas fotograma a fotograma).
10. `boveda/MANUAL COMPLETO DE EDICIÓN - Claude (2026-11-06).md` — manual largo (consulta, no lectura de corrido).
11. `boveda/7 TRABAJOS EN CURSO/*ESTADO*.md` — dónde está cada trabajo. Para retomar uno: leer SOLO su ESTADO.

## 3. Reglas que no se negocian (resumen; manda `claude/CLAUDE.md`)
1. Premiere es el editor principal. No destruir trabajo: secuencia o pista nueva; desactivar antes que borrar; borrar solo con permiso y a la Papelera.
2. Releer la línea de tiempo antes de cada cambio (Luis edita a la vez). **Mirar fotogramas antes de decir «hecho».**
3. Aplicar solo lo pedido.
4. Nada de instalar, borrar definitivamente ni probar en proyectos reales sin aprobación.
5. Drive (PACKS y brutos) es de solo lectura. No meter voz ni música sin preguntar. Cookies temporales se borran y nunca se imprimen.
6. No crear agentes ni skills sin necesidad demostrada (Luis pidió el 17-11 convertir lo repetitivo en scripts sin tokens: eso sí).
- Si chocan: seguridad › decisiones aprobadas de ESE vídeo (BRIEF/ESTADO) › reglas del cliente (FICHA) › convenciones del formato › referencias.
- Alumnos de Trainer10x: petición escrita del alumno › su marca › estilo.

## 4. Cómo se edita un vídeo (resumen de editor-maestro)
1. Preparar el bruto (`taller/sistema/preparar-clip.sh`): transcripción WhisperX **verificada** + hojas de fotogramas. Parar: enseñar el corte.
2. Formato y estilo (biblioteca de formatos + estilos) → 3. Plan de escenas consultando el banco de criterio. **Parar: sin su sí no se construye.**
4. Recursos (origen y licencia de cada uno) → 5. **Fotograma de diseño** por escena sobre un fotograma real. **Parar.**
6. Construir (Premiere por script con guardia, o HyperFrames/Remotion/After Effects/PIL) → 7. Sonido al final (skills `real-sfx` + `earshot`; música: 3–5 muestras, **la elige Luis**).
8. QC técnico + mirar la hoja con los ojos → mensaje en 3 partes → actualizar ESTADO (≤ 40 líneas) y BITÁCORA.
- Para lotes de alumnos sin tokens: skill `lote-alumnos` + `planes-alumnos/lote-1711/` (generador `reel_alumno.py` con `spec.json`, `sonido.py`, `verificar.py`, `auditoria.py`, `servir.py`, `panel.py`).

## 5. Gustos de Luis (lo que más se repite en sus correcciones)
- **Gancho**: zoom out (1,3→1,0 con desenfoque) + whoosh / riser / golpe grave. Título del gancho cuando lo pide.
- **Cortes en J y L**; zoom de golpe en el remate o el chiste.
- **Elementos en pantalla**: cuadrados/tarjetas de cristal tipo UI de Apple (columna ANIMACIONES EN PANTALLA de su Miro), gráficos que salen de un objeto del plano; **imágenes de FUERA del vídeo** (emoji, Pinterest, foto de producto), **nunca recortes del propio plano**.
- **Una sola estética** por vídeo; nada de b-roll ajeno. Cada gráfico/zoom/sonido necesita una **función**.
- **Subtítulos por unidades de sentido** («somos mejores personas» junto), literales a lo que se oye; la palabra clave entra cuando se dice. Nunca tocan gráficos fijos; si Luis puso un título, se respeta el suyo.
- **Música según la emoción**; efectos reales de su biblioteca (favoritos «love» en `skills/real-sfx/taste.json`). Un sonido de «contador» solo si algo cuenta o se mueve.
- No hay un estilo único para Amin: **se edita según el formato** (comparaciones rápidas, sketch, explicativo…).
- Cuando no sepas qué hacer: «mira Miro, columna X», no inventes.

## 6. Dónde está cada cosa en este repositorio
| Carpeta | Contenido |
|---|---|
| `boveda/` | Bóveda de Obsidian (ábrela en Obsidian). `00 ÍNDICE` y `00 MAPA` (todas las notas enlazadas). |
| `skills/` | Skills de Claude Code. Propias (en español): editor-maestro, criterio, direccion-viral, edicion-premium, edicion-video, minimal-corto, talking-head-premium, subtitulos, cortar-silencios, primer-corte, premiere-puente, portadas, color-hdr, cambiar-fondo, clientes, after-effects-editor, lote-alumnos. De terceros: real-sfx, earshot, hyperframes*, remotion*, graphify, figma… |
| `memoria/` | Memoria persistente (hechos, gustos, correcciones con su porqué). |
| `chats/` | **Las 176 conversaciones** en Markdown (mensajes de Luis, respuestas, herramientas usadas; sin imágenes ni salidas). La historia completa de cómo se aprendió cada cosa. Lo más denso: `chats/EDICION/` y `chats/inicio/`. |
| `planes-alumnos/` | Planes, specs, diseños y hojas de cada alumno; el lote del 17-11 con sus scripts y la auditoría. |
| `editor-automatico/` | El trabajador que edita solo los vídeos del panel: `luis/editor.md` (manual base), `director.md`, `revisor.md`, `NORMAS.md`, `formatos.md`, fichas por alumno, y el motor (`motor/src`, Remotion). |
| `taller/` | Código de `~/Videos-Remotion`: recetas de Premiere (ExtendScript), voz (WhisperX + verificador), sistema (preparar-clip, plan-escenas), QC, composición (componer.py), motion. Su `CLAUDE.md` explica el taller. |
| `ejemplos-premium/` | Planes y decisiones de los ejemplos premium (cine, clave, profundidad). |
| `edicion-mac/` | Cómo está organizada la carpeta `~/EDICION` y los materiales (LÉEME), licencias de sonidos. |

## 7. Reproducir el entorno (lo que NO está en el repo)
- **No están**: vídeos y audios (brutos, exportaciones, 5 GB de referencias; salvo las 6 favoritas), proyectos .prproj/.aep, la biblioteca de efectos de sonido y música (`~/EDICION/editing luiyi pack`, `sala-edicion/public/lib`), fuentes de pago, modelos y entornos de Python, credenciales (`~/.config/claude-editor/*.json`), la app del panel y la página de Notion «Estudio de Edición».
- **Hace falta**: macOS, Premiere Pro 2027 con la extensión MCP Bridge, After Effects, ffmpeg, Python 3.12 con un entorno WhisperX (`taller/voz/transcribir.sh` dice cómo), Pillow/NumPy, Node para Remotion/HyperFrames, las fuentes Sequel Sans, SF Pro, Montserrat, Poppins, Playfair Display.

## 8. Errores que ya pasaron (no repetirlos)
- Construir todo de golpe sin plan ni fotograma de diseño aprobados (Álvaro v1). → Respetar las paradas aunque digan «edita el vídeo», salvo que pidan expresamente v1 + auditoría.
- Leer Miro «de lejos». → Estudiarlo pieza a pieza (hecho el 16-11 para ANIMACIONES EN PANTALLA, HOOK y CTA).
- Gráficos planos o tarjetas grises a pantalla completa; b-roll fuera de estética; recortes del plano.
- Subtítulos parafraseados (se desalinean) o que parten una idea.
- Transcripciones con voz baja o alucinadas → repetir con large-v3 (+ganancia); se detecta por nivel mediano < −30 dB, fiables < 60 % o frases repetidas.
- Un «LIMPIO» de un script no aprueba nada. Mirar la hoja.
- Premiere: una operación por script; nunca dos órdenes a la vez; PNG en secuencia para transparencia; no cambiar de proyecto si Luis tiene otro abierto.
- Elementos que viajan por encima de la cara; colores pastel de marca sobre fondo claro sin sombra.
- `python -m http.server` no sirve vídeo a Safari (sin rangos): usar `servir.py`.

## 9. Huecos conocidos (lo que ni yo tengo resuelto)
- Miro: faltan estudiar las columnas TEXTO NORMAL, TEXTO ESPECIAL y documental.
- No existe formato «sketch de humor» (pedidas 3–5 referencias a Luis).
- Propuestas 15-11-L1…L8 y las del lote 17-11 sin aprobar.
- Nada del sonido se ha escuchado con oídos humanos: niveles medidos, no oídos.
- La auditoría del lote 17-11 espera las correcciones de Luis.
