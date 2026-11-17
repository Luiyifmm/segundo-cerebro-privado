---
tipo: procedimiento
actualizado: 2026-11-07
---
# QC técnico y QC creativo: son cosas distintas

**Un QC técnico correcto NO aprueba un vídeo.** Solo dice que no hay errores medibles. La aprobación creativa es tuya; antes de enseñarte nada, yo hago mi revisión creativa y la escribo.

## 1. QC técnico (scripts · resultado: OK / FALLA / NO VERIFICADO)
| Comprobación | Herramienta | Cuándo es NO VERIFICADO |
|---|---|---|
| Colisión con cara | `qc-colisiones.py` (Vision) | Cara no detectada en la mayoría de fotogramas |
| Colisión con subtítulos | `qc-colisiones.py --subtitulos auto` (leídos de cada fotograma) | No hay subtítulos visibles en el vídeo base y no se dio una banda |
| Zona segura | `qc-colisiones.py` / `qc-zona-segura.py` | — |
| Cortes con voz sonando | `cortes-voz.py` (medido en el audio) | — |
| Palabra cortada / frase repetida | `cortes-voz.py` (transcripción) | Si la transcripción no está verificada contra la voz de Amin |
| Sincronía gráfico-palabra ±2 f | `sincronia.py` | Si las marcas de palabra no son fiables (sin alinear o sin verificar) |
| Render y alfa en Premiere | `render-para-premiere.sh` + fotograma de Premiere | — |

**Regla:** una transcripción **no verificada** (que no se haya comprobado que es la voz principal) no se usa para cortes ni para sincronizar por palabra.

## 2. QC creativo (yo lo escribo; tú decides)
Para cada vídeo o gráfico, respondo por escrito:
1. **Idea:** ¿qué tiene que entender el espectador en este momento? ¿El gráfico lo aclara o solo decora?
2. **Redundancia:** ¿el gráfico repite el subtítulo sin necesidad? (regla aprobada el 07-11)
3. **Lectura:** ¿se lee a tamaño de móvil, sobre ESTE fondo y durante el tiempo que está?
4. **Ritmo:** ¿entra y sale en el momento justo? ¿Algún tramo sobra o se hace largo?
5. **Estilo:** ¿encaja con la ficha de Amin (natural, elegante, azul, SF Pro)?
6. **Cortes:** ¿cada corte es invisible o tiene una razón? ¿Se pierde información?
7. **Sonido:** ¿cada sonido acompaña algo visible? ¿Hay alguno de más?
8. **Lo que haría un editor top:** una mejora concreta que no he hecho.

## 3. Tu evaluación
Va en `EVALUACIÓN DE EDICIONES.md`, columna "Tu nota", separada de mi autoevaluación.
