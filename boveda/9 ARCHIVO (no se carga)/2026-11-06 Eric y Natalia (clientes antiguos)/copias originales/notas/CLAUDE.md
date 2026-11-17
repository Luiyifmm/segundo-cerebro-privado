# Estudio de edición del usuario (Videos-Remotion)

Editor profesional (Premiere 2026 + After Effects) con tres clientes: Amin, Eric y Natalia. Responder en español, directo, con secciones "Comunicado / Qué necesito de ti / Pendiente".

## Skills (cargar solo la que toque)
| Tarea | Skill |
|---|---|
| Tocar Premiere por script | `premiere-puente` |
| Marca, plantillas y entrega por cliente | `clientes` |
| Editar / proponer / pensar como director, viralidad | `direccion-viral` |
| Vídeo brillante al exportar, color, HDR iPhone | `color-hdr` |
| Portadas | `portadas` |
| Motion graphics con Remotion/AE, analizar referencias | `edicion-video` (criterio en `criterio.md`), `after-effects-editor` |
| Llega material, primer corte, entrega, panel | `primer-corte` |
| Subtítulos de reels en Premiere (Eric/Natalia), estética del usuario | `subtitulos-reels` |
| Subtítulos/transcripción sueltos, silencios, fondo | `subtitulos`, `cortar-silencios`, `cambiar-fondo` |
| "Escuchar" audio (LUFS, sincronía, elegir sonidos), efectos reales de la biblioteca | MCP/skill `earshot`, skill `real-sfx` (cómo encajan con Premiere: `edicion-video` › Oír el sonido) |

## Mapa
- **Hub de entrenamiento: `~/EDICION/0 CLAUDE EDITOR/`** (referencias, fichas de cliente `2 CLIENTES/<C>/FICHA.md`, `4 ENTRENAMIENTO/BANDEJA DE ENTRADA` + `REGISTRO DE CORRECCIONES.md`). "Entrénate" / "mira la bandeja" = analizar lo nuevo, sacar reglas con números, escribirlas en ficha/skill/memoria, apuntar en el registro y mover el material. Cada corrección del usuario va también al registro y a la ficha del cliente.
- `premiere/` puente (`pr.sh`), constructores (`propuesta-hablado.jsx`, `propuesta-yt.jsx`), `recetas/`.
- `ae/` generadores de MOGRT (`run.sh <jsx>`); plantillas en `clientes/_plantillas/`.
- `motion/` Remotion (portadas, vtrials, MG). `voz/` Whisper (`transcribir.js` → `salida/`).
- `herramientas/` recorte (`recorte-objetos/`), emoji, fotogramas nítidos, entorno Python (`separar-env`).
- `referencias/` vídeos analizados (acceso a `0 CLAUDE EDITOR/1 REFERENCIAS/Analizadas por Claude`); `clientes/<cliente>/` material por vídeo.
- Material del usuario: `~/EDICION/` (1 CLIENTES, 2 MATERIALES, 3 PROYECTOS…). Drive y PACKS: solo lectura.

## Reglas que no se negocian
- No destruir trabajo del usuario: secuencia nueva o pista nueva, desactivar en vez de borrar, borrar solo con permiso y a la papelera.
- Releer la línea de tiempo antes de cada cambio (el usuario edita a la vez).
- Mirar fotogramas antes de decir "hecho". Decir lo que falló.
- El puente de Premiere normalmente arranca solo. Si no responde: comprobar, y si hace falta pedir "Ventana > Extensiones > MCP Bridge" y parar (detalle en skill `premiere-puente`).
- Antes de escribir ExtendScript nuevo, mirar `premiere/recetas/LEEME.md`.
- `sistema/reel.js` sin orden solo muestra la ayuda; registrar material exige `nuevo` o `sincronizar`.
- No meter voz/música del usuario sin preguntar; cookies temporales se borran y nunca se imprimen.
