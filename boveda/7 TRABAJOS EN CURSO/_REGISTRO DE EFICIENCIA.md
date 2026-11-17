---
tipo: registro
fase: 8B.3 (creado el 2026-11-08)
---
# Registro de eficiencia por vídeo

Una fila por vídeo en cada tabla. Sirve para comparar vídeos **del mismo formato** y saber si una optimización ahorra sin bajar la calidad.
- **Regla de comparación (8A, aprobada):** cuenta como mejora solo si baja el consumo **y tu nota no baja**. Si baja la nota, se revierte.
- **Tabla A:** la rellena `consumo.py` (números de los registros de sesión).
- **Tabla B:** la rellenamos juntos al entregar. La nota y la valoración son **tuyas**: yo no las pongo.

## Cómo se rellena (al cerrar la entrega)
1. Buscar las sesiones del vídeo:
   `python3 ~/Videos-Remotion/herramientas/consumo/consumo.py --buscar "<ID del vídeo>"`
2. Medir (varias sesiones a la vez; `--desde`/`--hasta` o `--hasta-peticion` si una sesión mezcla otro trabajo):
   `consumo.py <sesión1> <sesión2> --exportaciones "<carpeta de exportaciones>" --md /tmp/fila.md --nombre "<ID>"`
3. Pegar la fila en la tabla A. Formato, modo y fecha a mano.
4. Tabla B: versiones enseñadas, tus correcciones, problemas técnicos; **tu nota y si se acerca al mensaje del BRIEF, las escribes tú**.

Guía y límites de la herramienta: `~/Videos-Remotion/herramientas/consumo/LEEME.md`.

## A · Consumo (automático)
- **Contexto medio / total:** lo que el modelo lee por llamada y la suma. Mide el tamaño de la conversación, **no es dinero**.
- **Coste eq. API (USD):** tokens × tarifa oficial. **No es lo que pagas** con suscripción: sirve para comparar vídeos.
- **Exportaciones:** archivos en la carpeta de exportaciones dentro del periodo (dato de disco).

| Vídeo | Formato | Modo | Fecha | Sesiones | Peticiones | Llamadas al modelo | Compactaciones | Contexto medio | Contexto total | Coste eq. API (USD) | Scripts de sesión | Recetas usadas | Exportaciones | Imágenes leídas |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6887-08 (**base**) | lista (12 hábitos) | producción + entrenamiento mezclados | 07/08-11 | 1 | 30 | 669 | 2 | 396 k | 264,9 M | 85,89 | 114 | 23 | 49 MP4 (7,4 GB) | 132 |

## B · Proceso y calidad (manual)
| Vídeo | Versiones enseñadas | Tus correcciones | Problemas técnicos | **Tu nota (1–10)** | ¿Se acerca al mensaje del BRIEF? | Comentario |
|---|---|---|---|---|---|---|
| 6887-08 (**base**) | no medido (cuáles viste no queda registrado). En la copia hay 12 secuencias «6887-08 · …»: propuesta v1, JORDAN A fiel / A completo v1 / A2 / A3 / A4 / A5 / B / C, PRUEBA SUBS A / B / C | *pendiente: la pones tú* | incidencia de audio de A4 (abierta, aparte) | *pendiente: la pones tú* (dijiste que es buena) | *pendiente: la pones tú* | |

## Notas sobre la base 6887-08
- Medida el 08-11 con `consumo.py` sobre una **copia** del registro de la sesión `0d22a94f`, cortada justo antes de tu mensaje «FASE 8». La fase 8 no está incluida.
- Mezcla producción con tres rondas de entrenamiento (pruebas A/B/C, Jordan, A2–A5). La comparación justa en 8C es con un vídeo de producción del mismo formato, sabiendo que esta base está inflada por el entrenamiento.
- No he podido separar automáticamente producción y entrenamiento: las peticiones no lo marcan.
- **Cerrada el 08-11 (8C).** Duración: 32,5 s (A4 y A5 v3, ffprobe; no enviada). Por minuto entregado: 1.235 llamadas · 489 M de contexto · 158,5 USD eq. API · 90 MP4 · 244 imágenes · 210 scripts.
- **Los 96,45 USD de la app no son la cifra del vídeo:** son la foto de coste de toda la sesión a las 20:24 UTC = base 85,89 + fase 8 hasta esa hora 9,54 + ≈ 1,0 de llamadas que no quedan en el registro. Ninguna de las dos cifras es gasto de la suscripción.
- Solo 3 de las 30 peticiones llevan una etiqueta de modo explícita: no se clasifica (sería inventar). Detalle en `FASE 8C - PROTOCOLO DE MEDICIÓN (2026-11-08).md`.
- Valoración: positiva (usuario, 08-11); nota numérica pendiente.
