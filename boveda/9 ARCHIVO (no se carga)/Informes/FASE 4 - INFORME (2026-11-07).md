# Fase 4: informe (07-11-2026): entrenamiento real y transcripción

**Lo que no he hecho:** tocar tus proyectos originales, sobrescribir entregas o borrar nada. Todo se montó en `3 PROYECTOS/_PRUEBAS CLAUDE/`. Instalé solo lo aprobado (WhisperX y MediaPipe), en entornos aislados.

## 1. Problemas pendientes: corregidos
- **Transcripción de IMG_6887:**
  - **Causa real:** el archivo `voz/salida/IMG_6887.palabras.json` **es la transcripción de tu secuencia editada**, guardada con el nombre del bruto. Sus tiempos son del montaje, no del bruto, y por eso caía sobre silencio.
  - Además, el transcriptor viejo (Whisper small, sin detector de voz) inventa o repite texto en los silencios.
  - La voz del apuntador existe, pero es secundaria: 193 palabras de voz baja frente a 4844 de Amin en 46 min.
- **Voz de Amin, apuntador y silencio, diferenciados:** `voz/verificar-transcripcion.py` mide el nivel bajo cada palabra.
  - Calibra el corte en el valle entre la voz principal y las voces bajas (−60 dB en IMG_6887, −46 dB en IMG_6127).
  - Rechaza una transcripción que no corresponde al audio (rechazó la vieja: 47 % de palabras sin voz).
- **Transcripciones no verificadas:** ya no se usan para cortes ni sincronía (regla en el director). La sincronía da "NO VERIFICADO" cuando la palabra va pegada a la anterior.
- **QC técnico separado del creativo:** `4 ENTRENAMIENTO/QC TÉCNICO y QC CREATIVO.md`. Los scripts dicen "No es una aprobación creativa", y la evaluación tiene columnas separadas (QC técnico / mi nota / tu nota).
- **Subtítulos reales en las colisiones:** `qc-colisiones.py --subtitulos auto` lee la banda en cada fotograma (77/86 en la prueba) y da "NO VERIFICADO" si no hay subtítulos visibles.

## 2. Regla aprobada
"Gráfico y subtítulo no repiten la misma información sin necesidad…", añadida a **Lecciones generales** y al REGISTRO.

## 3 y 4. Entrenamiento con vídeo real y comparación
- **Primer intento (IMG_6127, "dar like…"):**
  - montado completo y exportado;
  - pero tu `IMG_6127.mp4` resultó ser de **otro bruto** (IMG_6132): yo había elegido por el nombre del archivo;
  - crucé por contenido todos tus brutos y exportaciones (mapa en `4 ENTRENAMIENTO/Mapa brutos y exportaciones de Amin`).
- **Ejercicio válido (IMG_6124, "¿Tener novia? De pobre"):**
  - bruto, guion y tu edición `tener novia_1.mp4`;
  - plan, montaje, capas, QC y exportación sin mirar tu edición; luego la comparación.
  - Todo en `7 TRABAJOS EN CURSO/ENTRENAMIENTO IMG_6124 (tener novia) — comparación.md`.

**Resumen de la comparación:**
- **Igual:** misma toma en **9 de 11** bloques, misma estructura.
- **Tú, mejor:**
  - recortas lo débil ("Atento" y 2 de 3 costes);
  - golpes en blanco y negro con 💀 tras frases duras;
  - imágenes reales en tarjetas;
  - rojo para lo negativo;
  - subtítulos pequeños de una línea;
  - encuadre más cerrado;
  - la variante del CTA más fuerte.
- **Yo, sobrante:** iconos dibujados, espejo, overlay de seguir.
- **Técnico:** tu exportación **satura** (+2,8 dBTP, 150.738 muestras); la mía queda en −15,3 LUFS y pico −2,4.

**Lecciones propuestas:** 9 (P1–P9), **PENDIENTES** en `PROPUESTAS DE REGLAS.md`. Ninguna es regla todavía.

## 5. HyperFrames y video-editor
Los tres pilotos se conservan. No hice estilos nuevos. Los recursos se eligieron por frase: un marcador en 6127, iconos de coste en 6124. Premiere sigue siendo el editor.

## 6. Evaluación
| | QC técnico (auto) | Mi nota | Tu nota | Vueltas propias | Tiempo |
|---|---|---|---|---|---|
| Entrenamiento 6127 v1 | FALLA (−30,8 LUFS) → corregido | 13/25 | — | 3 | ~40 min |
| Entrenamiento 6124 v1.1 | OK; sincronía NO VERIFICADA | 16/25 | (pendiente) | 2 | ~25 min de herramientas |

**Tokens:** no se pueden medir desde dentro de la sesión. Escribir cada gráfico cuesta unos 1.000 tokens de código; el gasto real lo dominan la lectura de resultados y las revisiones.

**Errores encontrados:**
- **Técnicos (míos):**
  - vídeo elegido por el nombre;
  - voz sin nivelar;
  - halo azul en las claves;
  - overlay sin transparencia;
  - subtítulo fuera de pantalla;
  - espejo no aplicado (fallo silencioso de Premiere);
  - comprobador de sincronía que atribuía mal la palabra y no veía una marca (corregido).
- **De criterio:** ver la comparación.

## 7. Instalaciones (WhisperX y MediaPipe)
Informe completo en `4 ENTRENAMIENTO/WhisperX y MediaPipe — informe (07-11).md`.
- **WhisperX:** error mediano de **51 ms** frente a **130 ms**; **59 %** de inicios dentro de ±2 f frente a **12 %**; más rápido (37 s frente a 47 s en 6,3 min); no inventa en los silencios.
  - **Propuesta:** integrarlo como transcriptor por defecto, junto con el verificador.
  - **Límite:** no garantiza ±2 f, así que sigue habiendo "no verificados".
- **MediaPipe:** Vision detecta más caras, con cajas más ceñidas y la mitad de memoria. MediaPipe solo aporta hombros y frente, útiles para encuadres.
  - **Propuesta:** **no integrarlo**; mantenerlo experimental.
  - El cálculo de encuadres funciona como vista previa y **no se aplicó** a nada.

## Errores sin resolver
1. **Sincronía a ±2 f** de palabras pegadas: no medible ni con WhisperX.
2. **La pose de Vision** (alternativa a MediaPipe) está sin probar.
3. **Las uniones en habla continua** se señalan pero no se pueden escuchar: hay que oírlas.
4. **Las lecciones P1–P9** esperan tu decisión. Sobre todo P3 y P4: rojo para lo negativo y subtítulo pequeño, que contradicen la ficha actual.

## Próximo paso recomendado
Que valores las 9 lecciones y pongas tu nota a la propuesta de 6124. Después, una **segunda ronda** con otro vídeo ya editado por ti (6122 "rico/pobre" o 6126 "vulgaridad"), aplicando lo aprobado, para ver si la nota sube y la distancia con tu edición baja.
