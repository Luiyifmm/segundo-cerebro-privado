---
tipo: informe
actualizado: 2026-11-07
---
# WhisperX y MediaPipe: informe de la prueba experimental

## Instalación
- **Entornos aislados con `uv`** (Python 3.12):
  - `~/Videos-Remotion/herramientas/entornos/whisperx` (972 MB);
  - `…/entornos/mediapipe` (339 MB).
- **Lo que no se hizo:** ningún instalador general; no se tocó Whisper (`voz/transcribir.js`), Vision ni ningún entorno anterior. Las carpetas `entornos/` están fuera de git.
- **Versiones y licencias:**
  - WhisperX 3.8.6 (BSD-2): torch 2.8, faster-whisper, ctranslate2;
  - MediaPipe 1.2.2 (Apache-2.0).
- **Modelos descargados:**
  - faster-whisper-small (MIT, 464 MB);
  - wav2vec2-large-xlsr-53-spanish (Apache-2.0, ~1,2 GB);
  - Silero VAD (MIT);
  - MediaPipe BlazeFace, Face Landmarker y Pose Landmarker lite (Apache-2.0, 10 MB).
- **No se descargaron los modelos de pyannote**, porque exigen aceptar condiciones en Hugging Face. WhisperX usa Silero en su lugar.
- Aviso inofensivo: `torchcodec` no encuentra su FFmpeg; el audio se lee con nuestro ffmpeg. Silenciado.

## WhisperX frente a Whisper small (`transcribir.js`)
Medido sobre IMG_6127 (6,3 min):
- **Tiempo y memoria:** WhisperX 37 s y 3,8 GB; el actual, 47 s y 4,0 GB.
- **Bruto IMG_6887 (46 min):** 5 min 7 s y 3,1 GB.

**Precisión**, medida sobre 114 inicios de frase detectados en el audio:

| | Error mediano | Error al 90 % | Dentro de ±2 f (67 ms) | Retraso |
|---|---|---|---|---|
| Whisper small | 130 ms | 240 ms | **12 %** | +126 ms |
| **WhisperX** | **51 ms** | 219 ms | **59 %** | +46 ms |

**Lo que mejora de verdad:**
- **No inventa texto en los silencios**, porque tiene detector de voz. La transcripción vieja de IMG_6887 colocaba frases sobre el silencio; con WhisperX + verificador, 71–86 % de palabras fiables.
- **Límites de palabra** casi 3 veces más precisos: los cortes en habla continua se hacen en el límite real (0 palabras cortadas en los dos montajes) y la prueba del corte da 130/130 y 112/112.
- **Más rápido** que lo actual.

**Lo que NO consigue:**
- **±2 fotogramas garantizado:** solo el 59 % de los inicios entran. Por eso la sincronía de palabras pegadas sigue saliendo "no verificada", y se dice.
- **Separar al apuntador:** eso lo hace aparte `verificar-transcripcion.py`, por nivel.

**Recomendación:** **integrarlo** como transcriptor para cortes, subtítulos y sincronía, siempre seguido de `verificar-transcripcion.py`. Mantener `transcribir.js` como respaldo.

## MediaPipe frente a Vision de Apple
Medido sobre 110 fotogramas de Amin (bruto oscuro y tu edición):

| | Vision (`caras`) | MediaPipe |
|---|---|---|
| Velocidad | 21–27 ms/fotograma | 21–24 ms/fotograma (+2,6 s de carga) |
| Memoria | ~540 MB | ~1 GB |
| Caras detectadas | **más** (tu edición: 53/55; MediaPipe 33/55) | menos; 1 falso positivo (manos) |
| Ajuste de la caja | **ceñida a la cara** | 1,4–2,6 veces más grande; tiembla 35 px/fotograma en el bruto oscuro |
| Puntos de cara (frente, barbilla) | no (no probado en Vision) | **sí** |
| Hombros (pose) | no (no probado en Vision) | **sí** |

**Encuadres 9:16:** `encuadre.py` (caja de Vision + hombros y frente de MediaPipe) propone W, T y S con escala y posición para Premiere. La vista previa es coherente (T a 227 % en 1080, que es 113 % en el bruto 4K). **No se aplicó a ningún proyecto.**

**Recomendación:**
- **NO integrar MediaPipe para detectar caras:** Vision es mejor y más ligero, y ya funciona.
- MediaPipe solo aporta **hombros y frente** para encuadres medidos. Hoy no lo usamos: dejarlo como **experimental**.
- Antes de integrarlo, probar si la pose de **Vision** (sin instalar nada) da lo mismo.

## Qué integrar definitivamente
| Herramienta | Decisión propuesta |
|---|---|
| WhisperX + `verificar-transcripcion.py` + `prueba-corte.py` | **Integrar** (necesita tu aprobación para que sea el paso por defecto) |
| MediaPipe | **Mantener experimental**; no integrar |
| Vision (`caras`) | Seguir como detector de caras |
