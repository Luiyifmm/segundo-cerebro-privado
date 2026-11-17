---
tipo: estilo
estado: probado (3 ejercicios, 07-11)
origen: ~/Downloads/Invisible - Marco Said/ (proyecto AE + vídeos; solo lectura)
licencia: material de terceros, solo para estudiar. No se copió código ni activos.
actualizado: 2026-11-07
---
# 08 · Invisible (Marco Said): «un efecto, una vez; el gráfico demuestra»

**Opciones, no reglas.** Análisis completo con todas las medidas: [[4 ENTRENAMIENTO/ESTUDIO Invisible (Marco Said) — análisis]].

![[ejemplos/invisible/hoja-Invisible2-entrada.jpg]]

## 1. Qué lo caracteriza visualmente
- **Plano a cámara limpio casi todo el tiempo.** Los efectos fuertes son pocos y muy cortos:
  - entrada de 1,46 s (la persona «se materializa»);
  - impacto de ≈ 1,5 s (rayos y desaparición).
- **Gráficos que enseñan la prueba de lo que se dice:** el carrusel de hooks en «miles de hooks», la tarjeta del producto en «los diez mejores», la barra de comentario en «comenta».
- **Subtítulo sobrio:** Urbanist Bold blanco, interletrado −60, sin caja. Baja un 8,3 % de la altura cuando entra un gráfico.
- **Marco Said (reels):** B-roll literal en las enumeraciones; plano a cámara oscuro y cálido en el argumento; subtítulos diminutos de una línea.

## 2. Técnicas concretas (con números medidos)
| Técnica | Medida |
|---|---|
| Revelado de texto por carácter | Opacidad 0→100 y desenfoque 10→0; **2 fotogramas por letra** |
| Tarjetas que entran escalonadas | **2 f** entre tarjetas; destello de brillo **9,9→0,08 en 4 f** (0,167 s) |
| Deslizamiento de tira | Curva exponencial de salida: **38 % del recorrido en el primer 7,5 % del tiempo** (1361 px en 6,64 s) |
| Acercamiento continuo | 100→130 % en 17,4 s, lineal (**1,7 %/s**): imperceptible pero vivo |
| Impacto | 8 capas débiles a la vez; **subida ≈ 0,29 s, bajada 0,5–0,8 s**; sacudida de 4 f; obturador 360° |
| Materialización | Anillo que crece de 0 a 2257 px en 1,17 s y sirve de **mate de la persona recortada**; refracción del fondo con el propio vídeo como mapa |
| Cámara 3D «en mano» | `wiggle(1,7)` en posición y `wiggle(1,0.7)` en orientación; empuje en Z de 237 en 2,7 s con aceleración y frenada |
| Tarjetas | Radio **9,2 %** del ancho; contorno blanco fino; sombra 50 %, 5 px |
| Subtítulo que cede | Baja 320 px de 3840 (−8,3 %) mientras dura el gráfico |

## 3. Por qué funcionan (interpretación)
- **Contraste:** un efecto se nota porque lo que lo rodea está limpio. Dos efectos seguidos se anulan.
- **Subidas cortas y bajadas largas:** el golpe se siente en el fotograma justo y no se queda «a medias» en pantalla.
- **Curvas exponenciales:** el objeto llega con energía y se asienta solo. Lo lineal parece de plantilla.
- **Varias capas débiles a la vez** (desenfoque, abombado, color, temblor) dan textura sin que ninguna llame la atención.
- **Lo literal retiene:** una pantalla real del chat o una imagen concreta valen más que un icono o un efecto.
- **El escalonado de 2 f** crea ritmo sin parecer animación automática.

## 4. Cuándo usarlas
- Un **gancho** que necesita ganar el primer segundo: una entrada fuerte (materializar, revelar) y después nada.
- **Enumeraciones o listas:** una imagen o tarjeta por elemento, entrando con escalonado.
- **Una sola frase fuerte** (giro o moraleja): un impacto con corte a plano más cerrado.
- **CTA de comentario:** la barra escribiendo la palabra.

## 5. Cuándo NO usarlas
- **Mientras se argumenta:** ahí, plano limpio, como hacen Marco y tu edición de 6118.
- Más de **un efecto fuerte cada ≈ 10 s**, o dos seguidos.
- Si el gráfico **repite el subtítulo** (regla aprobada).
- **En Amin**, la materialización y los rayos chocan con «natural y elegante, sin sobrecarga». Tu edición de 6118 usa cambio de fondo detrás de Amin, no efectos de energía.

## 6. Cómo reproducirlo con herramientas propias
- **Revelado por letra, tarjetas, tira:** HyperFrames (GSAP) con alfa → Premiere. Ejemplos propios:
  - `hyperframes/ejercicio-e3-titulo/` (letras con desenfoque y 2 f de retraso);
  - `ejercicio-e1-tarjetas/` (escalonado, destello y deslizamiento exponencial);
  - `entrenamiento-6118-tarjetas/`.
- **Impacto:** receta de Premiere `premiere/recetas/impacto.jsx`, con efectos nativos y keyframes por fotograma.
- **Profundidad (texto detrás de la persona):** `fondo/recortar.js --alfa`, que ya sale listo para Premiere, y apilado V1 bruto / V2 título / V3 recorte.
- **Acercamiento continuo:** keyframes de escala en Premiere, 1,7 %/s, en el clip y en su recorte a la vez.

## 7. Qué se puede hacer en cada programa
| | Premiere | HyperFrames | After Effects |
|---|---|---|---|
| Impacto (desenfoque, color, temblor, obturador) | ✅ nativo (receta) | — | ✅ (pero Sapphire y BCC no están instalados) |
| Texto por letra, tarjetas, tiras | MOGRT (más trabajo) | ✅ lo más rápido | ✅ |
| Texto detrás de la persona | ✅ con el recorte en V3 | — | ✅ (Roto Brush) |
| Materialización con anillo y refracción | ✗ | parcial (máscara SVG; sin refracción real) | ✅ (Mapa de desplazamiento, CC Glass, Deep Glow) |
| Cámara 3D con muro de tarjetas | ✗ | parcial (CSS 3D) | ✅ |

## 8. Lo que no se pudo analizar
- **El render exacto** con Sapphire (DissolveShake, WarpChroma, BlurMoCurves) y BCC: no están instalados aquí.
- **Un «efecto desconocido»** del informe de recopilación.
- **El sonido de los vídeos:** medido (LUFS), no escuchado.
- **La expresión de rebote «BOUNCr overSHOOT+»:** ofuscada; se comprobó que no llama al sistema ni a archivos, pero no se reutiliza.
- **Las fuentes Urbanist y Poppins:** no comprobadas en este Mac.

## Material original (referencias, sin copiar)
- AEP: `~/Downloads/Invisible - Marco Said/Reel 3 Oct - Hook - Marco Said Hook ultimo.aep`. Copia verificada en `3 PROYECTOS/_PRUEBAS CLAUDE/estudio-invisible/copia/`.
- Vídeos: `(Footage)/Assets/Video/` (FINAL Efecto Con subs v2, Invisible 2, «¿Cuándo fue la última vez que te sentiste invisible?», etc.).
- Hojas de consulta: `ejemplos/invisible/`.
