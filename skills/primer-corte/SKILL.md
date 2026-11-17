---
name: primer-corte
description: Sistema de reels del usuario (cliente activo: amin) - registra el material en bruto, hace el primer corte automático con selección de tomas, lleva el tiempo, entrega con control de calidad y mantiene el panel. Usar cuando diga "llegó material", "procesa los de hoy", "primer corte", "quita 3 y 7", "recupera 4", "abre amin 1", "empiezo", "paro", "entrega", "el cliente pide cambios", "apunta que mejoraría", o pregunte qué tiene pendiente.
---

# Sistema de reels

Una sola puerta: `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; node ~/Videos-Remotion/sistema/reel.js <orden>`

| El usuario dice | Orden |
|---|---|
| "Llegó material de X" | `nuevo <cliente> <archivo\|carpeta\|zip> [título]` |
| "Procesa los de hoy" | `sincronizar` (registra lo que haya en `clientes/*/entrada/`) + `cortar` (todos los pendientes) y después la selección de tomas (abajo) |
| (sin orden) / "ayuda" | muestra la ayuda; **no registra ni escribe nada** (cambio del 06-11-2026) |
| "En amin 1 quita 3 y 7" / "recupera 4" | `quitar <reel> 3,7` / `recuperar <reel> 4` (tarda 2 s) |
| "Abre amin 1" | `abrir <reel>` (importa el corte en una bandeja con su ID; necesita el panel MCP Bridge abierto) |
| "Empiezo amin 1" / "paro" | `empezar <reel>` / `parar` |
| "Entrega" | `entregar [reel] [archivo]` (toma el último vídeo de `<reel>/export/`, pasa `qc.js`, lo copia a `clientes/<c>/entregado/<ID>_vN.mp4`) |
| "El cliente pide…" | `cambios <reel> <texto>` (sube la versión) |
| "Apunta que mejoraría…" | `mejora <reel> <texto>` |

- `<reel>` admite "amin 1", el ID (`AMIN_1008_01` = CLIENTE_MMDD_nn) o parte del título.
- Un reel = una carpeta `clientes/<cliente>/<ID>/` con uno o varios clips (Amin suele mandar uno). Los originales no se mueven.
- El material llega a `~/Downloads` como carpetas o zips de Drive ("Video raw amine"). También vale dejarlo en `clientes/<cliente>/entrada/`.
- Cada orden regenera `sistema/panel.html` (estado, "qué toca ahora", tiempos, guion numerado).

## Selección de tomas (lo hago yo tras `cortar`)
1. Leer el guion numerado que imprime `cortar`.
2. `quitar` lo que sobra: indicaciones fuera de guion ("otra vez", "¿así?", "listo"), palabras inventadas ("Gracias."), tomas anteriores de una frase que se repite (queda la última completa), ideas sin ninguna toma limpia.
3. Decir al usuario qué números quité y cuáles dudo; nunca darlo por definitivo. Lo quitado queda al final de la secuencia tras el marcador DESCARTES.
4. Avisar de lo que no puedo arreglar: repeticiones dentro de una misma frase sin pausa, orden de los clips (van por nombre de archivo), muletillas.

## Cómo corta
- Frases = unidades numeradas (punto, interrogación o pausa > 0,45 s). Tomas repetidas y frases sin terminar ("…") salen solas.
- Los puntos de corte vienen del volumen real (umbral = sonoridad del clip − 10 dB), no del transcriptor, que se desvía hasta 0,5 s. Pausas ≥ 0,4 s se cortan (`--pausa`).
- Prueba 2026-10-08 con Amin IMG_6118: 138 s → 28,3 s; las 11 frases y los 13 cortes coinciden con el montaje manual del usuario (26 s) con ±0,2 s.
- Transcripción guardada en `<reel>/.cache/`: solo la primera pasada es lenta (≈1–2 min por minuto de bruto con el Mac ocupado).
- Los subtítulos `.srt` del corte son aproximados (±0,3 s); para subtítulos animados finales, transcribir de nuevo el corte exportado.

## Reglas del usuario (de su Notion)
- "El sistema sirve a la producción, no la reemplaza": nada que añada pasos. Si una pieza no ahorra trabajo, fuera.
- Ya tiene en Notion una base "Pipeline de Producción de Video" y otra "Práctica Deliberada"; no duplicarlas sin que lo pida.
- Efectos de sonido ordenados: `Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/` (PACKS de Drive es de solo lectura).
- Importar siempre en bandejas (nunca suelto en la raíz del proyecto de Premiere).

## Arranque del día ("buenos días", "qué toca", "empezamos")
1. `descargas` → lista el material de `~/Downloads` que aún no es ningún reel. Asignar cliente por contenido/nombre (IMG_ suele ser Amin; si no está claro de quién es, preguntar) y registrar con `nuevo`.
2. `cortar` en segundo plano; al terminar, selección de tomas en cada reel.
3. Abrir `sistema/panel.html` y decir al usuario, en 3 líneas, qué hay listo y en qué orden editar (primero cambios de cliente, luego Amin).
- Brutos largos con varios reels dentro (algún Amin): `copiar <reel> [título]` crea otro reel sobre el mismo bruto (sin volver a transcribir); en cada copia se dejan solo las frases de ese tema con `quitar`.
- Proyectos de Premiere por cliente: `clientes/<cliente>/<Cliente> - Edición.prproj` (vacíos, creados 2026-10-08). El usuario abre el del cliente y `abrir <reel>` importa el corte en una bandeja con su ID.
- Flujo acordado por reel (objetivo 90 min): entrada → corte (yo) → guion (usuario, 5 min) → montaje en Premiere (usuario, 40 min) → marca y subtítulos (yo) → exportar a `<reel>/export/` y `entregar` → una frase de mejora.
