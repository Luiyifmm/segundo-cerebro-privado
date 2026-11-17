# Estudio de edición del usuario (Videos-Remotion)

Editor profesional (Premiere Pro 27 + After Effects). Clientes activos: Amin y los alumnos de Trainer10x; Víctor Hugo es prospecto (Eric y Natalia archivados el 06-11-2026; no aplicar sus reglas). Responder en español, directo, con secciones "Comunicado / Qué necesito de ti / Pendiente".

## Skills (cargar solo la que toque)
| Tarea | Skill |
|---|---|
| **Empezar o retomar cualquier vídeo (flujo completo, qué toca ahora)** | `editor-maestro` |
| Analizar un vídeo y decidir qué recurso explica cada idea | `criterio` (`sistema/criterio.py`) |
| Preparar un bruto: transcripción, hojas, silencios y plan de escenas | `sistema/preparar-clip.sh` |
| Estilo podcast minimal / fitness, auditar un vídeo | `minimal-corto`, `talking-head-premium` |
| Tocar Premiere por script | `premiere-puente` |
| Marca, plantillas y entrega por cliente | `clientes` |
| Editar / proponer / pensar como director, viralidad | `direccion-viral` |
| Vídeo brillante al exportar, color, HDR iPhone | `color-hdr` |
| Portadas | `portadas` |
| Motion graphics con Remotion/AE, analizar referencias | `edicion-video` (criterio en `criterio.md`), `after-effects-editor` |
| Llega material, primer corte, entrega, panel | `primer-corte` |
| Subtítulos MOGRT sobre un corte de Premiere | `subtitulos` (flujo técnico) + ficha del cliente |
| Subtítulos/transcripción sueltos, silencios, fondo | `subtitulos`, `cortar-silencios`, `cambiar-fondo` |
| "Escuchar" audio (LUFS, sincronía, elegir sonidos), efectos reales de la biblioteca | MCP/skill `earshot`, skill `real-sfx` (cómo encajan con Premiere: `edicion-video` › Oír el sonido) |

## Mapa
- **Hub de entrenamiento: `~/EDICION/0 CLAUDE EDITOR/`** (referencias, fichas de cliente `2 CLIENTES/<C>/FICHA.md`, `4 ENTRENAMIENTO/BANDEJA DE ENTRADA` + `REGISTRO DE CORRECCIONES.md`). "Entrénate" / "mira la bandeja" = analizar lo nuevo, sacar reglas con números, escribirlas en ficha/skill/memoria, apuntar en el registro y mover el material. Cada corrección del usuario va también al registro y a la ficha del cliente.
- `premiere/` puente (`pr.sh`), constructores (`propuesta-hablado.jsx`, `propuesta-yt.jsx`), `recetas/`.
- `ae/` generadores de MOGRT (`run.sh <jsx>`); plantillas en `clientes/_plantillas/`.
- `motion/` Remotion (portadas, vtrials, MG). `voz/` transcripción: **`voz/transcribir.sh <archivo>`** = WhisperX + verificador (por defecto desde 07-11) → `salida-whisperx/*.verificada.json`; `--respaldo` = Whisper small de siempre (`transcribir.js` → `salida/`).
- `herramientas/` recorte (`recorte-objetos/`), emoji, fotogramas nítidos, entorno Python (`separar-env`), consumo de sesiones (`consumo/consumo.py`: contexto, tokens facturables y coste estimado por separado; solo lectura).
- `referencias/` vídeos analizados (acceso a `0 CLAUDE EDITOR/1 REFERENCIAS/Analizadas por Claude`); `clientes/<cliente>/` material por vídeo.
- Material del usuario: `~/EDICION/` (1 CLIENTES, 2 MATERIALES, 3 PROYECTOS…). Drive y PACKS: solo lectura.

## Reglas
Las reglas que no se negocian están en un solo sitio: `~/.claude/CLAUDE.md` (no destruir trabajo, releer la línea de tiempo, mirar fotogramas, voz y música, cookies). Aquí solo lo propio del taller:
- El puente de Premiere normalmente arranca solo. Si no responde: comprobar, y si hace falta pedir "Ventana > Extensiones > MCP Bridge" y parar (detalle en skill `premiere-puente`).
- Antes de escribir ExtendScript nuevo, mirar `premiere/recetas/LEEME.md`. Una operación por script; nunca dos órdenes a Premiere a la vez.
- `sistema/reel.js` sin orden solo muestra la ayuda; registrar material exige `nuevo` o `sincronizar`.
- `voz/transcribir.sh` detecta el idioma solo desde el 14-11-2026 (`--idioma es|en` para forzarlo).
