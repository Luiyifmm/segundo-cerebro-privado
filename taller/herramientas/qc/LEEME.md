# Control de calidad y aprendizaje (código propio, 06-11-2026)

| Herramienta | Qué hace | Probada |
|---|---|---|
| `qc-zona-segura.py <render.mov>` | Revisa un gráfico con transparencia fotograma a fotograma: falla si invade las bandas de la interfaz (por defecto y 250–1620, x 70–1010 en 1080×1920, escala sola a 4K) o si no tiene alfa | ✅ limpio / con invasión / sin alfa |
| `premiere/recetas/leer-secuencia.jsx` + `comparar-secuencias.py antes.json despues.json` | Foto de la secuencia (clips, tiempos, textos MOGRT, niveles, escala, efectos) y lista de lo que cambió entre dos fotos = **los retoques a mano del usuario** | ✅ detectó mover, cambiar texto, desactivar y bajar nivel |
| `hyperframes/render-para-premiere.sh <carpeta> <salida.mov>` | Render de HyperFrames con alfa que Premiere SÍ lee (recodifica con el ffmpeg de Remotion) | ✅ importado y comprobado en Premiere |

Python con numpy (sin instalar nada): `~/Videos-Remotion/herramientas/separar-env/bin/python`.

**Ciclo de aprendizaje:**
1. Al entregar: foto "antes" (`leer-secuencia`).
2. Cuando el usuario devuelva el vídeo retocado: foto "después".
3. `comparar-secuencias.py` → cada cambio repetido se convierte en regla (ficha del cliente o "Lecciones generales"), con una línea en el REGISTRO.

## Fase 3 (06-11-2026)
| Herramienta | Qué hace | Probada |
|---|---|---|
| `caras` (Swift + Vision, `src/caras.swift`) | Cajas de cara en imágenes, sin dependencias | ✅ Amin: confianza 0,87 (bruto) y 0,92 (edición) |
| `qc-colisiones.py <gráfico.mov> --base <vídeo> --subtitulos y0-y1 --hoja x.png` | El gráfico ¿pisa la cara, los subtítulos o las bandas? Con hoja visual | ✅ cazó cara + solape (piloto 01 v1) y margen (02 v1); falla si revisa 0 fotogramas |
| `cortes-voz.py --fuente --palabras --tramos` | Cortes con voz sonando (medido) y frases repetidas (transcripción) | ✅ limpio / corte en plena voz / toma repetida |
| `sincronia.py --grafico --cues --audio` | Cada elemento a ±2 f de su palabra; si la palabra no es fiable: NO VERIFICADO | ✅ mide el gráfico; palabras sin verificar con Whisper small |
| `foto-secuencia.sh` + `aprender.py` | Ciclo de aprendizaje: cambios exactos → TÉCNICA / ESTILO / VÍDEO → propuesta pendiente | ✅ 2 rondas en el proyecto de pruebas |

**Antes de enseñar un gráfico o un vídeo:**
1. `qc-colisiones`.
2. `sincronia` (si hay voz).
3. `cortes-voz` (si hay cortes).
4. **Mirar la hoja con mis ojos.** Un "LIMPIO" no aprueba nada: el script no ve repeticiones de texto, lectura sobre fondos cargados ni gusto.

Banda de subtítulos de Amin medida en su edición (IMG_6887_1): y ≈ 1030–1210 en 1080×1920 → usar `--subtitulos 1000-1240`.

## Fase 4 (07-11-2026)
| Herramienta | Qué hace | Probada |
|---|---|---|
| `voz/verificar-transcripcion.py <palabras.json> <audio>` | Etiqueta cada palabra como voz principal / voz baja (apuntador, teléfono) / sin voz; marca las FIABLES; rechaza una transcripción que no es de ese audio | ✅ rechazó la vieja de IMG_6887 (otra base de tiempos); 6124: 86 % fiables |
| `prueba-corte.py --tramos --fuente --esperado` | Monta el audio de los cortes, lo vuelve a transcribir y lo compara con el texto esperado | ✅ 130/130 (6127) y 112/112 (6124) |
| `cortes-voz.py` (mejorado) | Distingue CORTE DENTRO DE PALABRA (error) de UNIÓN EN HABLA CONTINUA (escuchar); repeticiones solo de ≥3 palabras cercanas | ✅ |
| `sincronia.py` (mejorado) | Solo mide si la palabra va tras un silencio; si no, da la diferencia estimada con WhisperX y NO VERIFICADO | ✅ |
| `qc-colisiones.py` (mejorado) | `--subtitulos auto`: lee la banda real de subtítulos en cada fotograma; NO VERIFICADO si no los hay | ✅ |
| `mp-caras.py`, `encuadre.py` | MediaPipe (experimental): cara + frente/barbilla + hombros; encuadres W/T/S propuestos (no se aplican) | ✅ en pruebas |
| `sistema/montaje-desde-tomas.py` | De tomas.json a EDL con cortes ajustados al silencio medido, sin cruzar a la palabra vecina | ✅ |
| `voz/transcribir.sh` | **Transcriptor por defecto (07-11):** WhisperX (entorno aislado) + `verificar-transcripcion.py`; `--respaldo` = `transcribir.js` | ✅ |

**Separación:** QC TÉCNICO = estos scripts (OK / FALLA / NO VERIFICADO). QC CREATIVO = `0 CLAUDE EDITOR/4 ENTRENAMIENTO/QC TÉCNICO y QC CREATIVO.md`. Uno no sustituye al otro.


## Composición (fase 6)
| `../composicion/componer.py` + `sujeto` (Vision) | Propone dónde colocar imágenes según cara, gesto de señalar, silueta, subtítulos y zona segura; solo propone | ✅ 07-11 (6118: 3/3 gestos, 0 falsos tras el ajuste) |

## Fase 8B.2 (08-11-2026): iterar barato sin bajar la calidad
**Protocolo visual (mientras se itera):**
1. Primero la medida numérica (caras, colisiones, alfa, zona segura).
2. Después **una hoja pequeña**: `fotogramas.jsx` + `premiere/recetas/hoja.sh` (≤ 1600 px), o un recorte de la zona dudosa.
3. **Revisión final, siempre:** fotogramas a tamaño completo de las zonas dudosas y la hoja completa, mirados con mis ojos. Esta fase no se quita.

**Sonido:** para iterar, `exportar.jsx` con `"audio":true` (WAV en segundos, misma sonoridad que el MP4: −10,6 / −10,5 LUFS en A5). El MP4 4K, solo para enseñar una versión al usuario.

**Reglas de validez: qué se reutiliza y cuándo se recalcula**
| Resultado | Se reutiliza mientras… | Se recalcula si… |
|---|---|---|
| Transcripción WhisperX del bruto | el bruto sea el mismo (nombre, duración y tamaño) | cambia el bruto o el canal de voz |
| Palabras de la versión montada | no cambien los cortes de voz (A1/A2) | cambia el montaje: tiempos recalculados desde el bruto (sin retranscribir) y sincronía comprobada en el render nuevo |
| Transcripción de un render | — | solo si cambia la voz; no por SFX, música ni gráficos |
| Sonoridad y márgenes | el WAV de la mezcla no cambie | cambia un clip, efecto o nivel de audio, o el mezclador: se mide un WAV nuevo |
| Caras y colisiones | no cambien montaje, zoom ni gráficos de esa zona | cambia cualquiera |
| Fotogramas y QC «LIMPIO» | el mismo render | hay render nuevo (y un LIMPIO no aprueba nada creativo) |
| Referencias analizadas | siempre: se citan | el usuario pide otra lectura |

**Ojo:** el usuario edita a la vez. Antes de reutilizar una medida de sonido, comprobar que la secuencia no ha cambiado. Ejemplo del 08-11: A5 pasó de −16,3 a −10,6 LUFS sin cambios míos.
