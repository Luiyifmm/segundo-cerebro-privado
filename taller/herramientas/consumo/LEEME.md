# consumo.py — cuánto gasta un vídeo (fase 8B.3, 08-11)

Lee los registros de sesión de Claude Code (`~/.claude/projects/*/<id>.jsonl`). **Solo lectura**: no modifica los registros. Sin dependencias (biblioteca estándar de Python). Tarda menos de 1 s con un registro de 140 MB.

## Uso
```
python3 consumo.py --buscar "6887-08"                     # sesiones cuyos mensajes tuyos lo mencionan
python3 consumo.py <id o .jsonl> [más sesiones…]          # informe en pantalla
   --desde 2026-11-08T10:00Z --hasta …                    # recortar por hora (UTC, como el registro)
   --hasta-peticion "FASE 8"                              # parar antes del primer mensaje tuyo que contenga ese texto
   --exportaciones "<carpeta>"                            # contar en disco los archivos exportados en el periodo
   --json salida.json  --md fila.md --nombre "<ID>"       # guardar (se niega a sobrescribir)
```
Para medir sin riesgo la sesión en curso, medir una **copia** del `.jsonl` (la original sigue creciendo mientras hablamos).

## Qué separa (no confundir)
| Bloque | Qué es | Qué NO es |
|---|---|---|
| **Contexto** | lo que el modelo lee en cada llamada: entrada + caché escrita + caché leída. Media, mediana, máximo, total | dinero |
| **Tokens facturables** | por tipo: entrada sin caché, escritura de caché 5 min / 1 h, lectura de caché, salida (incluye razonamiento) | un único número: cada tipo tiene precio distinto |
| **Coste estimado** | tokens × `precios.json` (USD, tarifa oficial de la API) | lo que pagas con suscripción. Sirve para comparar vídeos |
| **Operaciones** | herramientas, Bash por tipo, recetas usadas, scripts `.jsx` escritos, exportaciones, imágenes, errores, comandos idénticos repetidos | — |
| **Peticiones más caras** | coste y contexto entre un mensaje tuyo y el siguiente | — |

## Validación (08-11)
- `precios.json` aplicado a los tokens de la sesión `0d22a94f` (según la app) da **96,4542 USD = cost-state de la app (96,4542)**. La tarifa de Opus 5.5 está confirmada.
- `consumo.py` cortado a la hora de esa foto de la app: **95,44 USD frente a 96,48 (−1,1 %)**. Las escrituras de caché coinciden exactas (2,71 M). Falta ≈ 1,9 M de lectura y 29 k de salida.
- Cada respuesta aparece una sola vez con su uso (comprobado: 788 ids, ninguno con usos distintos).
- Prueba de solo lectura: md5 de la copia del registro igual antes y después.

## Límites (decirlos siempre)
1. **No ve las llamadas que no quedan en el registro:** compactaciones (resumen), auxiliares (Haiku: títulos, búsqueda web). Por eso sale ≈ 1 % por debajo de la app. Si existe `cost-state` de la sesión entera, esa cifra manda para el total.
2. **El `cost-state` de la app es una foto** de un momento: para compararlo, cortar con `--hasta` a esa hora.
3. **Coste ≠ factura.** Con suscripción no se paga por token. Precios de Haiku 5.5 con caché: supuestos (×0,1 / ×1,25 / ×2), sin confirmar; en 6887-08 no hay tokens de Haiku en el registro.
4. **Exportaciones por comandos = incompletas** (un script puede exportar varias secuencias en bucle: 32 detectadas frente a 49 MP4 en disco en 6887-08). El dato fiable es `--exportaciones <carpeta>`, que a su vez no ve lo sobrescrito o movido.
5. **«Scripts de sesión»** = rutas `.jsx` distintas escritas con Write o `cat >` (incluye /tmp). Las recetas creadas o reescritas se cuentan aparte.
6. **No separa producción de entrenamiento** si van en la misma sesión: hay que cortar por hora o por petición.
7. **Tiempo activo** = suma de pausas ≤ 30 min entre entradas del registro. Es una aproximación: no mide tu tiempo real.
8. **No mide calidad.** La nota creativa y la cercanía al BRIEF las pone el usuario (tabla B del registro).

## Registro por vídeo
`~/EDICION/0 CLAUDE EDITOR/7 TRABAJOS EN CURSO/_REGISTRO DE EFICIENCIA.md` (tabla A automática, tabla B manual con tu nota).
