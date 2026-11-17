# Versiones de After Effects y qué trajo cada una (hasta la 26.5, septiembre de 2026)

> Del informe externo (notas de Adobe, CG Channel, ProVideo Coalition, docsforadobe). ✅ = comprobado en la 26.5 del PC del autor (Tanda 05 · 01). Probado en **AE 26.5 (26.5x89)** en inglés.

| Versión | Fecha | Lo relevante |
|---|---|---|
| 24.0 | oct 2023 | Roto Brush de nueva generación; efectos OCIO; scripting de texto (`app.fonts`, muchas propiedades de `TextDocument`) |
| 24.1 | dic 2023 | **Motor Advanced 3D**, importar **GLB/GLTF**, luz de entorno con imagen (HDRI), snapping 3D |
| 24.2 | feb 2024 | Importar **OBJ**; .exr para luz de entorno; Casts/Accepts Shadows en objetos 3D; `addVerticalText` |
| 24.3 | mar 2024 | Estilo por carácter por script (`characterRange`, `paragraphRange`, `composedLineRange`) ✅ |
| 24.4 | may 2024 | Objeto de scripting `ThreeDModelLayer` |
| 24.5 | jun 2024 | Shadow catchers, animaciones dentro del GLB, pase de profundidad, `Project.usedFonts` / `replaceFont()` |
| 24.6 | ago 2024 | Cajas de texto: `boxAutoFitPolicy`, `boxVerticalAlignment`, `boxInsetSpacing` ✅ (aparecen en TextDocument) |
| 25.0 | oct 2024 | Interfaz nueva; estilo por carácter en expresiones; **JavaScript como motor de expresiones por defecto** |
| 25.1 | dic 2024 | Interruptor *Accepts Lights*; Cinema 4D 2025 integrado |
| 25.2 | abr 2025 | Previsualización de alto rendimiento; HDR; **luz de entorno animada** (comp o vídeo como fuente) |
| 25.3 | jun 2025 | Smooth Zoom |
| 25.4 | ago 2025 | Desfase rápido de capas y keys; pegar solo el formato de texto; `app.restart()` |
| 26.0 | ene 2026 | **Mallas paramétricas** ✅, **Substance 3D (.sbsar)**, sombras de focos, paralelas y de entorno en Advanced 3D ✅, **ejes de fuentes variables** ✅ (`addVariableFontAxis`), **importar SVG**, efecto **Unmult** ✅ (`ADBE Unmult`), *Lossless Compressed Playback*, audio Distortion, Compressor y Gate ✅, idioma de la interfaz distinto al del sistema |
| 26.2 | abr 2026 | **Object Matte** con IA (sustituye al Roto Brush: "Roto Brush & Refine Edge" figura como obsoleto ✅); desplazamiento en mallas; **Quick Apply**; arrastre proporcional (Ctrl+Alt); SVG como metraje o como comp |
| 26.3 | jun 2026 | **Desenfoque de cámara en Advanced 3D** ✅; pegar SVG/Illustrator como capas de forma; seguimiento de máscaras hasta 5× más rápido; *Copy Frame to Clipboard*; efecto **Curl Noise** ✅ (`ADBE Curl Noise`); scripting `addParametricMesh()` ✅ (firma: nombre, tipo), propiedades de cámara *FocusAreaWidth* y *NearFarBlurMultiplier* |
| 26.5 | sep 2026 | Guías nuevas (`GuideOptions`); caché en disco para Object Matte; **colores por efecto** en Controles de efectos; OCIO 2.5.1 / ACES 2.0; `Property.layerInputStage` |

## Avisos de la 26.5 (reportes de usuarios en el foro, sin confirmar)
- "Cryptomatte roto" (alguien volvió a la 26.3). Si se usa Cryptomatte de Blender, probarlo antes.
- Propiedades con expresión (menos deslizadores y colores) que no se pueden editar en Controles de efectos.

## Lo que viene
- **UXP para AE:** beta pública anunciada para ~noviembre de 2026. CEP seguirá hasta 2028 (apagado por defecto desde diciembre de 2028).
- **AI Assistant** de AE: beta separada, controla AE con lenguaje natural. Sin API externa confirmada.
