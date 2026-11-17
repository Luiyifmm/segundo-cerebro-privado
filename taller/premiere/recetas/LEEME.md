# Recetas de Premiere

Scripts reutilizables y probados. Las recetas `.jsx` nuevas llevan el marcador `__CFG__` y se lanzan con un JSON corto, sin reescribir ExtendScript:

```
premiere/recetas/correr-receta.sh <receta.jsx> '<json>' [segundos]
premiere/recetas/correr-receta.sh <receta.jsx> config.json [segundos]
```

`correr-receta.sh` valida el JSON, crea una copia en `/tmp/premiere-recetas/` con la configuración puesta y la ejecuta con `premiere/pr.sh`. La receta original no se modifica.

**Una orden a Premiere cada vez (08-11, 8B.3):** nunca dos `pr.sh` / `correr-receta.sh` en paralelo ni en segundo plano (`&`); varias en un mismo comando, solo en serie. No lanzar una prueba en el mismo paso que el cambio que prueba. Comprobado en la sesión de 6887-08: 184 órdenes, ninguna en paralelo.

## Con configuración JSON (06-11-2026)

| Receta | Qué hace | Estado |
|---|---|---|
| `abrir-secuencia.jsx` | Abre un proyecto si hace falta y deja activas una o varias secuencias | ✅ Probada con JSON el 06-11 (proyecto de pruebas) |
| `guardar-proyectos.jsx` | Guarda todos los proyectos abiertos | ✅ Ídem |
| `proxies.jsx` | Informa de qué clips tienen proxy; activa o desactiva la reproducción con proxies | ✅ Ídem |
| `sfx-colocar.jsx` | Efectos de sonido en pistas de audio nuevas, con nivel en dB y duración | ✅ Ídem |
| `lumetri-copiar.jsx` | Copia el Lumetri de otra secuencia a una capa de ajuste nueva encima de V1 | ✅ Ídem |
| `tincion-clips.jsx` | Recolorea clips (gráficos nativos) con "Tinción" y, opcionalmente, copia un "Resplandor de VR" | ✅ Ídem |
| `mogrt-textos.jsx` | Clips MOGRT de línea + clave con color; se niega si la pista no está libre | ✅ Ídem |
| `fotogramas.jsx` | Exporta PNG en los tiempos dados | ✅ Ídem |
| `hoja.sh` (shell, no Premiere) | `hoja.sh salida.png f1.png f2.png … [--ancho 1600] [--columnas 4] [--rotulos]`: junta los PNG de `fotogramas.jsx` en una hoja pequeña para mirarlos de una vez. No sobrescribe | ✅ 08-11 (8B.2): 4 fotogramas 4K de A5 → 1600×740 px, con rótulos legibles; probados 1 y 3 fotogramas |
| `voz-nivelar.jsx` | Voz a ~−16 LUFS: volumen del clip + Limitador forzado como techo (parámetros normalizados 0–1) | ✅ medido el 07-11 (−15,3 LUFS, pico −2,4) |
| `impacto.jsx` | Golpe de impacto con efectos NATIVOS (Transformar con obturador 360°, Desenfoque gaussiano, Lumetri exposición/temperatura, Desplazamiento turbulento), keyframes por fotograma: subida 0,3 s, bajada 0,74 s, sacudida de 4 f; cruza cortes | ✅ 07-11 en los proyectos de la fase 5 (fotogramas mirados) |
| `exportar.jsx` | H.264 «Coincidir con el origen, velocidad alta» con `exportAsMediaDirect`, o **solo audio en WAV** (`"audio":true`). `"secuencia"` activa una por nombre y luego **vuelve a la que estaba**. Se niega si el archivo existe, si falta la secuencia o si la extensión no cuadra | ✅ 07-11 · ampliada el 08-11 (8B.2): WAV de A5 en 3 s y 6 MB frente a MP4 en 124 s y 291 MB, con la misma sonoridad (−10,6 / −10,5 LUFS); vuelta a la secuencia comprobada |
| `clonar-secuencia.jsx` | Duplica una secuencia con nombre nuevo; la original no se toca y vuelve a quedar activa la que estaba (`"activar":true` deja activa la copia). Se niega si el nombre existe o falta el origen | ✅ 08-11 (8B.2): copia con los mismos 172/87 clips y la misma duración |
| `niveles-clips.jsx` | Volumen (Nivel) de clips de audio por **nombre** (`"nombre"` exacto o `"contiene"`), en todas las pistas o en `"pistas":[1,2]`: `"dB"` final o `"delta"` relativo. Con claves, las escala todas (los fundidos conservan la forma). **Por defecto solo simula**; escribe con `"aplicar":true` y relee cada valor. No cambia la secuencia activa ni guarda. No toca mezclador ni efectos de pista | ✅ 08-11 (8B.2): en un clon, −3 dB a 21 clips de voz releídos a −9; vuelta con `"dB":-6` → WAV idéntico al original (diferencia −inf). Ojo: en esa prueba la mezcla solo bajó 0,5 LUFS con el pico en −6,0 dBFS (comportamiento pendiente de diagnóstico): después de cambiar niveles, medir siempre el WAV |
| `leer-secuencia.jsx` | Foto de la secuencia para el ciclo de aprendizaje. `"audio":true` añade la cadena de efectos de cada clip de audio con sus valores, el volumen en dB y las pistas (nombre, silencio); `"solo":"A"` lee solo audio. No lee el mezclador (salidas, faders, efectos de pista) | ✅ · ampliada el 08-11 (8B.2): probada en A5; sin opciones da la misma salida que antes |
| `efectos-lista.jsx` | Nombres reales (en español) de los efectos que coinciden con un filtro | ✅ Ídem |

**Prueba del 06-11 (fase 2):** las 9 recetas, con JSON y con el guardia, sobre `~/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/recetas-2026-11-06/Prueba recetas Claude.prproj` (material sintético). Se comprobaron los valores leídos de vuelta y los fotogramas: Tinción a cian, MOGRT con texto y color, niveles −8/−12 dB exactos, Lumetri con 130 propiedades. Los originales están sin tocar en `origen/2026-11-06 Amin IMG_6887 y rendimiento/`.

**Guardia:** añade `"guardia":{"proyecto":"<nombre.prproj>","secuencia":"<nombre>"}` al JSON; si no coincide con lo activo, no se ejecuta nada. `guardar-proyectos` acepta `"solo":"<nombre>"` para no guardar otros proyectos abiertos.

Las comprobaciones que llevan las recetas, sacadas de errores ya cometidos:
- se niegan si la secuencia activa no es la indicada;
- solo usan pistas nuevas o libres;
- comprueban que el efecto existe (un nombre mal escrito no da error en Premiere);
- recortan los MOGRT con `end` y también con `outPoint`.

## Anteriores (cada una explica su uso en la cabecera)

| Receta | Qué hace |
|---|---|
| `leer-v1.jsx` | Lee las piezas de V1 |
| `leer-subs-mogrt.jsx` | Texto, controles y posición de cada MOGRT |
| `subs-desde-linea.py`, `colocar-subs-mogrt.py` | Subtítulos sobre el corte actual |
| `subtitulos-por-tandas.jsx` | Más de 120 MOGRT, en tandas de 120 |
| `subtitulos-frase-dos-colores.jsx` | Frase completa, hablante en dos colores |
| `plan-reel.py`, `plan-video-entrevistas.py` | Planes de montaje para los constructores |
| `lumetri-hdr-iphone.jsx` | Corrección aceptada para HLG de iPhone |
| `columnas-difuminado.jsx` | Columnas fundidas con barrido lineal |
| `restaurar-textos-desde-cfg.jsx` | Restaura textos desde la configuración |
| `resincronizar.py`, `tiempos.py`, `hablantes-ejemplo.py`, `frases-subtitulos-usuario.py`, `centrar-subtitulos-convertidos.py` | Utilidades |

**NO tocar efectos de PISTA de audio por script (07-11-2026, error real en Amin «Secuencia anidada 14»):** `qe…getAudioTrackAt(i).addAudioEffect(fx, ranura)` sí añade, pero `setParamValue` con texto deja un fotograma clave en 00:00 (un "10,3" quedó como +30 dB de ganancia y saturó A2), con número da "Illegal Parameter type", después ya no cambia el valor, y `remove()` no quita nada. La lectura (`getParamControlValue`) en el mismo script devuelve el valor viejo. Para leer sirven (`getParamList`, `getParamControlValue` en otro script); para cambiar, que lo haga el usuario en el Mezclador de pistas de audio. Los efectos de CLIP (DOM `components[…].properties[…].setValue`) sí funcionan.

**Regla nueva:** cuando un script de una sesión funcione y se pueda volver a usar, se convierte aquí en receta con `__CFG__`, en vez de quedarse en una carpeta temporal.


## Trampas encontradas en la fase 5 (07-11-2026)
- **Keyframes de efectos:** `prop.setTimeVarying(true); prop.addKey(t); prop.setValueAtKey(t, v, true)` con `t` en tiempo del ORIGEN del clip (`clip.inPoint.seconds + (t_secuencia − clip.start.seconds)`). Interpolación lineal: para curvas, una clave por fotograma (lo hace `impacto.jsx`).
- **Desenfoque gaussiano (2026)** entra con Cantidad 20 y **Desplazamiento turbulento** con Cantidad 50: hay que ponerlos a 0 fuera del golpe. La Cantidad del desenfoque es muy fuerte: 3 en 1080 y 4 en 4K ya bastan; 12 lo emborrona todo.
- **Voz muy baja (bruto a ~−38 dB):** +15 dB de clip no llega. «Volumen del canal» (Izq./Der.) admite otros +15 con la misma escala (valor = 10^((dB−15)/20)); +5 dB ahí con el limitador a −1 dB dio −16,2 LUFS sin recortes (6118).
- **MOGRT v12 en secuencia de 1080×1920:** los valores de la ficha son para 4K; en 1080 hay que poner Movimiento › Escala 50 (si no, el subtítulo sale al doble y se sale de pantalla). Claves de más de ~13 caracteres se salen a 2,4×.
- **Recortes con alfa (`fondo/recortar.js --alfa`):** Premiere ignoraba su alfa (tapaba lo de debajo con el fondo original). Corregido el 07-11: el script ya recodifica con el ffmpeg de Remotion.
- **`changeMediaPath`** puede tardar más de 60 s en responder aunque se aplique: comprobar con una lectura antes de repetir.

- **importMGT pisa lo que viene detrás (07-11):** el MOGRT entra con su duración por defecto (~5 s) y sobrescribe los clips posteriores de esa pista antes de recortarlo. Insertar siempre en orden cronológico o en una pista libre.

**NO reordenar bloques con `trackItem.move()` (12-11-2026, Amin 6887-11 ranking v3):** mover ~95 clips con offsets grandes (dos fases +200 s → destino) dejó las pistas corruptas por dentro (QE: elementos «Empty» solapados y desordenados). Premiere exportó vídeo NEGRO y voz MUDA en varios bloques; guardar y reabrir no lo arregla, y `overwriteClip` encima duplica clips. Para reordenar: secuencia base con todo (desactivar lo que vaya por encima) + secuencia nueva con trozos ANIDADOS de la base (`setInPoint/OutPoint` en ticks exactos de fotograma, 8475667200 por fotograma a 29,97) y lo continuo (capa, título, SFX que cruzan fronteras) en pistas superiores. Comprobar con QE (orden de `getItemAt`), negro (brillo) y silencio (astats) en la exportación.
**Reordenar con clips reales (12-11, probado en 6887-11 v5):** copia de la secuencia → quitar en la COPIA los clips que cambian de sitio → recrearlos desde la original en su hora nueva: vídeo con subclip «solo vídeo» del bruto, voz con subclip «solo audio» (`createSubClip(…, takeVideo, takeAudio)`), entrada con `clip.inPoint = ticks exactos` (el bruto va a 30 fps: no redondear a la rejilla 29,97), MOGRT con `overwriteClip(projectItem)` + copiar Movimiento y parámetros. Recortar cada texto/subtítulo al límite de su bloque (si no, asoma 1 fotograma en otro bloque). Textos nativos (sin projectItem): secuencia aparte solo con ellos, anidada con el audio bloqueado y quitando el audio mudo que crea. Comprobar QE sin desorden. Script: `scratchpad/…/reconstruir.tpl` (copiar a recetas si se repite).
**`overwriteClip` con un MOGRT PISA lo que hay detrás (12-11, 6887-11 v5):** entra con la duración por defecto de la plantilla (larga) y borra los clips siguientes de la pista; recortar después con `.end` no los devuelve. Al insertar MOGRT en una pista con contenido: insertar en orden cronológico sobre una pista vacía desde ese punto, o reconstruir la pista entera en orden. Contar los clips de la pista antes y después.
