---
tipo: protocolo
fase: 8C (preparación; aprobada el 2026-11-08)
estado: propuesta, esperando la elección del vídeo
---
# Fase 8C · Protocolo de medición

**Objetivo:** comprobar si un vídeo real de Amin, hecho en MODO PRODUCCIÓN, gasta menos contexto y menos coste por minuto entregado que 6887-08 sin bajar la calidad.
**Estado:** no se ha montado nada. Falta que el usuario apruebe el vídeo y que hablemos de su dirección creativa.

## 1. Línea base cerrada: 6887-08

### Qué entra en la base
- Sesión `0d22a94f`, desde el inicio (07-11, 23:43 UTC) hasta justo antes del mensaje «FASE 8» (08-11, 15:57 UTC).
- Medida con `consumo.py` sobre una copia del registro.
- La duración es la de A4 y A5 v3 (las dos últimas versiones, medidas con ffprobe). **No enviada al cliente.**

| Medida | Total | Por minuto entregado (32,5 s = 0,542 min) | Cómo se obtuvo |
|---|---|---|---|
| Peticiones del usuario | 30 | 55 | medido |
| Llamadas al modelo | 669 | 1.235 | medido |
| Contexto procesado | 264,9 M tokens | 489 M | medido |
| Coste equivalente API | 85,89 USD | 158,5 USD | estimado: tokens × tarifa oficial |
| Exportaciones (MP4 en disco) | 49 (7,4 GB) | 90 | medido en disco |
| Imágenes leídas | 132 | 244 | medido |
| Scripts de sesión (.jsx) | 114 | 210 | medido |
| Sesiones | 1 | — | medido |
| Correcciones | no medido | — | no quedó registrado |
| Valoración creativa | positiva; nota numérica pendiente del usuario | — | usuario |

Tokens facturables de la base (Opus 5.5):
- entrada sin caché: 1,5 k;
- escritura de caché (1 h): 2,40 M;
- lectura de caché: 262,49 M;
- salida: 708 k, de los que 262 k son razonamiento.

### Los 96,45 USD de la app (no es la cifra del vídeo)
- **Qué es:** la foto de coste que la app guarda en el registro (`cost-state`), tomada el 08-11 a las 20:24 UTC. Suma **toda la sesión `0d22a94f` hasta esa hora**.
- **Por qué es mayor que 85,89:**

  | Parte | USD | Cómo se obtuvo |
  |---|---|---|
  | Base 6887-08, hasta el mensaje «FASE 8» | 85,89 | medido |
  | Fase 8 (8A, 8B.1, parte de 8B.2) hasta las 20:24 | 9,54 | medido |
  | Llamadas que no quedan en el registro (compactaciones, auxiliares) | ≈ 1,0 | diferencia con la app: inferido, no medido una a una |
  | **Total** | **≈ 96,45** | |

- La tarifa oficial aplicada a los tokens que cuenta la app da exactamente 96,4542. La tarifa está validada.
- **Ninguna de las dos cifras es un gasto de la suscripción.** Son el precio que tendrían esos tokens en la API. Sirven solo para comparar vídeos entre sí.

### Producción, entrenamiento y desarrollo en la base: no se pueden separar
- De las 30 peticiones, solo tres llevan una etiqueta explícita de modo:
  - «FASE 7 — PRIMERA EDICIÓN REAL SUPERVISADA» (03:11): producción.
  - «ENTRENAMIENTO DE EDICIÓN — RITMO, COLOR Y SUBTÍTULOS PREMIUM» (04:53): entrenamiento.
  - «CONTINUACIÓN DEL PROYECTO — SUBTÍTULOS Y ANIMACIONES ESTILO JORDAN» (05:31): no dice el modo.
- Las otras 27 son respuestas cortas («Aprobado tal cual», «Sí, el 08»…), que no dicen a qué modo pertenecen.
- Desarrollo de herramientas: ninguna petición lo marca.
- **Conclusión: no clasifico.** Repartirlas por la hora o por el tema sería inventar. La base queda como **total mezclado** y se dice siempre que está inflada por el entrenamiento.
- Si el usuario quiere, puede marcar él cada una de las 30 peticiones; entonces se recalcula una base de solo producción con `--desde/--hasta`.

## 2. Vídeo recomendado para 8C

**Recomendación: 6887-13 · «Los tres tipos de dinero».**

### Por qué el 13
- **Sin editar.** Su ESTADO dice «sin montar nada» (07-11). No hay exportaciones con ese nombre, y `Amin.prproj` no se ha guardado desde el 07-11 a las 13:56. *No compruebo si el usuario lo ha editado por su cuenta fuera de estos sitios: que lo confirme.*
- **Comparable con la base:**
  - es una lista, del mismo bruto (IMG_6887, Secuencia 03) y de la misma grabación que 6887-08;
  - mismo audio (mono, −37 LUFS) y misma cámara.
- **Pone a prueba la reutilización:**
  - la transcripción verificada ya existe (`s03_desde_785.651.verificada.json`);
  - la referencia ya está descargada y analizada (DHMsGzgBxF3);
  - el BRIEF ya está en propuesta. No hay que repetir análisis.
- **Material limpio:** según su ESTADO, es el más limpio del lote. Riesgo bajo de que la producción derive en entrenamiento.

### Advertencia de complejidad
El 13 es más sencillo que el 08:

| | 6887-08 | 6887-13 |
|---|---|---|
| Puntos de la lista | 12 | 3 |
| Lista en pantalla | sí | no |
| Duración prevista | ≈ 32,5 s | ≈ 45 s |

- Parte de la reducción vendrá de la sencillez, no del sistema. Normalizar por minuto lo compensa solo en parte.
- **Si quieres una comparación más pareja:** 6887-10 («Cinco temas», cuenta atrás de 5 puntos, ≈ 55 s, un cuadro por tema). Riesgos:
  - hay que buscar cuadros de dominio público, que es trabajo nuevo;
  - se coló un «Repite, por favor» de Javi;
  - la moraleja es larga.

### Descartados
- **09:** muy sucio; el CTA está repetido seis veces.
- **11:** Whisper hace bucle y hay que escuchar qué se dijo; 10 puntos.
- **03:** la referencia no se puede descargar sin sesión; tiene insultos que quitar.

## 3. Cómo se trabaja (MODO PRODUCCIÓN)

- **Una sesión por etapa:**
  1. dirección creativa;
  2. corte;
  3. propuesta (subtítulos, gráficos, sonido);
  4. QC y entrega;
  5. cambios.
- La primera sesión empieza después de que apruebes el vídeo.
- **Al abrir cada sesión:**
  - leer solo el ESTADO (+ BRIEF si toca), nunca la BITÁCORA entera;
  - el primer mensaje dice «8C · <vídeo> · etapa N»;
  - el ID de la sesión se apunta en el ESTADO.
- **Al cerrar cada etapa:**
  - Traspaso en el ESTADO, en 10 líneas como máximo; ESTADO de 40 líneas como máximo;
  - consumo de la sesión medido (sección 4).
- **La dirección creativa no se acorta:**
  1. identificar el formato;
  2. consultar las referencias;
  3. proponer gancho, estructura y tratamiento;
  4. preguntar;
  5. registrar las aprobaciones en el BRIEF.
  - El coste de esa conversación entra en la medición.
- **Reutilizar:**
  - la transcripción verificada del s03 (no se vuelve a transcribir);
  - el análisis de la referencia;
  - las recetas de Premiere verificadas (`premiere/recetas/LEEME.md`);
  - `componer.py` para colocar gráficos.
  - Un script nuevo solo si ninguna receta sirve; se cuenta.
- **Exportar ligero para iterar:**
  - receta `exportar.jsx` en modo ligero;
  - fotogramas sueltos u hojas de fotogramas para revisar;
  - la 4K solo para la entrega final.
- **Premiere:**
  - una orden cada vez;
  - guardia PR_PROYECTO/PR_SECUENCIA;
  - trabajar en una copia del proyecto en `_PRUEBAS CLAUDE/6887-13/`. **El proyecto original no se toca.**
- **El QC no se reduce:**
  - `herramientas/qc/` completo;
  - mirar la hoja de fotogramas yo mismo;
  - lo que no se puede medir se marca NO VERIFICADO.
- **Si aparece algo de entrenamiento:**
  - se para y se pregunta;
  - si se hace, va en una sesión aparte, marcada «ENTRENAMIENTO», y **queda fuera** de la medición de 8C (se informa aparte).
- **Herramientas nuevas:** solo si algo impide terminar el vídeo. Antes, explicar el beneficio y el coste y esperar el sí. Si se hace, cuenta como desarrollo y se informa aparte.
- **Correcciones:** cada cambio que pidas después de ver una versión se apunta en el ESTADO («Correcciones: n. …») en el momento. Ese recuento es el dato medido.

## 4. Qué se mide y cómo

**Al cerrar cada etapa:** copiar el `.jsonl` de la sesión y medir la copia:
`consumo.py <copia> --exportaciones "_PRUEBAS CLAUDE/6887-13" --json etapaN.json`

**Al entregar:** medir todas las sesiones juntas (`consumo.py s1 s2 s3 …`) y sacar la fila de la tabla A del registro.

| Métrica | Fuente | Tipo |
|---|---|---|
| Llamadas al modelo | consumo.py | medido |
| Tokens por categoría (entrada, escritura de caché 5m/1h, lectura de caché, salida, razonamiento) | consumo.py | medido |
| Contexto procesado (total y media por llamada) | consumo.py | medido |
| Coste equivalente API | consumo.py × `precios.json`; se contrasta con el `cost-state` de cada sesión cuando exista (la app manda en el total) | estimado (tarifa validada) |
| Exportaciones | archivos en la carpeta del vídeo durante el periodo | medido en disco |
| Scripts creados | consumo.py (rutas `.jsx` distintas) | medido |
| Imágenes revisadas | consumo.py (lecturas de imagen) | medido |
| Sesiones | IDs apuntados en el ESTADO | medido |
| Duración final | ffprobe de la exportación entregada | medido |
| Correcciones | recuento del ESTADO | medido (manual) |
| Valoración creativa (1–10) y cercanía al BRIEF | el usuario | usuario |

- **Normalización:** cada métrica se divide por los minutos entregados.
- **Informe final, en tres columnas:** base, 8C y diferencia en %. Cada cifra va marcada como **medida** o **estimada**.

## 5. Criterio de éxito

- **Meta:** ≈ −30 % de contexto por minuto y ≈ −30 % de coste equivalente por minuto, con una valoración **igual o mejor** que la de 6887-08.
- **La meta no justifica recortar** creatividad, seguridad, QC ni precisión. Si para llegar habría que recortar, no se recorta y el resultado se informa tal cual.
- **Lectura del resultado:**
  - Llega a la meta y la nota no baja → **evidencia inicial** a favor del sistema optimizado. No es una demostración para todos los formatos.
  - La nota baja → no cuenta como mejora (regla de 8A).
  - No llega → se informa qué etapa gastó más (peticiones más caras) y se propone qué cambiar. No se maquilla.
- **Advertencias que van siempre en el informe:**
  - el 13 es más sencillo que el 08;
  - la base mezcla entrenamiento, así que la comparación favorece a 8C;
  - es un único vídeo;
  - el coste es equivalente de API, no lo que se paga.

## 6. Lo que no se toca
- Incidencia de audio de A4 y dato de A5: abiertas y separadas. No se toca el mezclador, los faders ni los niveles de esos vídeos.
- Secuencias de prueba de 6887-08 (A4, A5, clon «_PRUEBA receta clonar»…): se conservan.
- Proyectos originales y brutos de Drive: solo lectura.
