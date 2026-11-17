# matchNames de formas, texto, transformación, cámara y controles

> De docsforadobe (lista oficial de matchNames, 2024), a través del informe externo, y de las clases. Los nuevos de AE 26 (mallas, ejes variables, Unmult…) y los de efectos ya probados están en `matchnames-probados.md`. Los efectos instalados, en `catalogo-efectos-instalados.md`. Si uno no aparece: `scripts/volcar_propiedades.jsx` o `scripts/buscar_matchnames.py`.
> **Por script, siempre matchNames** (no los nombres visibles: cambian con el idioma de AE).

## Capa de forma
`ADBE Vector Layer` → `ADBE Root Vectors Group` → `ADBE Vector Group` (grupo) → `ADBE Vectors Group` (contenido) + `ADBE Vector Transform Group` (`ADBE Vector Anchor`, `ADBE Vector Position`, `ADBE Vector Scale`, `ADBE Vector Skew`, `ADBE Vector Skew Axis`, `ADBE Vector Rotation`, `ADBE Vector Group Opacity`).
- **Primitivas:**
  - `ADBE Vector Shape - Rect` (`ADBE Vector Rect Size`, `ADBE Vector Rect Position`, `ADBE Vector Rect Roundness`);
  - `ADBE Vector Shape - Ellipse` (`ADBE Vector Ellipse Size`, `ADBE Vector Ellipse Position`);
  - `ADBE Vector Shape - Star` (`ADBE Vector Star Type` 1 estrella / 2 polígono, `… Points`, `… Position`, `… Rotation`, `… Inner Radius`, `… Outer Radius`, `ADBE Vector Star Inner Roundess` y `ADBE Vector Star Outer Roundess`, **con la errata**);
  - `ADBE Vector Shape - Group` → `ADBE Vector Shape` (el trazado).
- **Pintura:**
  - `ADBE Vector Graphic - Fill` (`ADBE Vector Fill Color`, `… Opacity`, `ADBE Vector Fill Rule`);
  - `ADBE Vector Graphic - Stroke` (`ADBE Vector Stroke Color`, `… Opacity`, `… Width`, `… Line Cap` (2 = redondo), `… Line Join`, `… Miter Limit`);
  - discontinuo: `ADBE Vector Stroke Dashes` (Dash 1, Gap 1… y `ADBE Vector Stroke Offset`);
  - afinado: `ADBE Vector Stroke Taper` (`ADBE Vector Taper Start Width`, `End Width`, `Start Length`, `End Length`, `Start Ease`, `End Ease`);
  - onda: `ADBE Vector Stroke Wave` (`ADBE Vector Taper Wave Amount`, `Units`, `Phase`, `ADBE Vector Taper Wavelength`).
- **Degradado:** `ADBE Vector Graphic - G-Fill` / `G-Stroke` (`ADBE Vector Grad Type`, `Start Pt`, `End Pt`, `HiLite Length`, `HiLite Angle`, `ADBE Vector Grad Colors`, y en 26 `ADBE Vector Grad Scale` y `ADBE Vector Grad Rotation`). ⚠️ **Los colores del degradado no se pueden poner por script** (NO_VALUE): usar el efecto Gradient Ramp, o Tint sobre el degradado por defecto.
- **Operadores:**
  - `ADBE Vector Filter - Merge` (`ADBE Vector Merge Type`);
  - `- Offset` (Amount, Line Join, Miter Limit, Copies, Copy Offset);
  - `- PB` (Pucker & Bloat);
  - `- Repeater` (`ADBE Vector Repeater Copies`, `… Offset`, `… Order`, `… Transform`);
  - `- RC` (`ADBE Vector RoundCorner Radius`);
  - `- Trim` (`ADBE Vector Trim Start`, `End`, `Offset`, `Type`: 2 = secuencial);
  - `- Twist`, `- Roughen` (Wiggle Paths), `- Wiggler` (Wiggle Transform), `- Zigzag`.
- **Orden:** el grupo 1 se dibuja ENCIMA; `addProperty` añade al final. Tras cada `addProperty` las variables anteriores caducan: volver a pedirlas por índice.

## Texto
- `ADBE Text Properties` → `ADBE Text Document` (Source Text), `ADBE Text Path Options`, `ADBE Text More Options`, `ADBE Text Animators`.
- `ADBE Text Animators` → `ADBE Text Animator` → `ADBE Text Selectors` + `ADBE Text Animator Properties`.
  - **Selectores:**
    - de rango `ADBE Text Selector` (`ADBE Text Percent Start/End/Offset`, `ADBE Text Index Start/End/Offset`, `ADBE Text Range Advanced` → `ADBE Text Range Units` (1 % / 2 índice), `ADBE Text Range Type2` (Based On: 1 caracteres, 3 palabras, 4 líneas), `ADBE Text Selector Mode`, `ADBE Text Selector Max Amount`, `ADBE Text Range Shape`, `ADBE Text Selector Smoothness`, `ADBE Text Levels Max Ease` / `Min Ease`, `ADBE Text Randomize Order`, `ADBE Text Random Seed`);
    - `ADBE Text Wiggly Selector`;
    - de expresión `ADBE Text Expressible Selector` (`ADBE Text Expressible Amount`).
  - **Propiedades animables:** `ADBE Text Anchor Point 3D`, `ADBE Text Position 3D`, `ADBE Text Scale 3D`, `ADBE Text Skew` (+ Axis), `ADBE Text Rotation X/Y`, `ADBE Text Rotation`, `ADBE Text Opacity`, `ADBE Text Fill Color/Opacity/Hue/Saturation/Brightness`, `ADBE Text Stroke Color/Width/…`, `ADBE Text Tracking Amount`, `ADBE Text Line Anchor`, `ADBE Text Line Spacing`, `ADBE Text Character Offset`, `ADBE Text Character Replace`, `ADBE Text Blur`, y en 26 `ADBE Text VF Axis 1…8` (solo con `addVariableFontAxis(tag)`). Con el motor Cinema 4D: `ADBE 3DText Front/Bevel/Side/Back …` y `ADBE 3DText Extrude Depth` / `Bevel Depth`.
- **TextDocument (por script):**
  - `font` (nombre PostScript; releerlo para ver que no lo sustituyó), `fontSize`, `fillColor`, `applyFill`, `applyStroke`, `strokeColor`, `strokeWidth`, `strokeOverFill`, `tracking`, `leading` + `autoLeading`, `justification`, `allCaps`, `horizontalScale`;
  - cajas: `boxText`, `boxTextSize`, `boxAutoFitPolicy`, `boxVerticalAlignment`, `boxInsetSpacing`;
  - `fontObject` (con `designVector`);
  - métodos `characterRange(a, b)`, `paragraphRange`, `composedLineRange`, `resetCharStyle()`.

## Transformación, máscaras y otros
`ADBE Transform Group` → `ADBE Anchor Point`, `ADBE Position` (separadas: `ADBE Position_0/_1/_2`), `ADBE Scale`, `ADBE Orientation`, `ADBE Rotate X`, `ADBE Rotate Y`, **`ADBE Rotate Z`** (también la rotación 2D: no existe "ADBE Rotation"), `ADBE Opacity`.
- `ADBE Effect Parade` (efectos) · `ADBE Mask Parade` → `ADBE Mask Atom` → `ADBE Mask Shape`, `ADBE Mask Feather`, `ADBE Mask Opacity`, `ADBE Mask Offset` · `ADBE Marker` · `ADBE Time Remapping` · `ADBE Layer Styles` (estilos de capa por comando: receta 4.20).
- Capa 3D: `ADBE Material Options Group` (Casts/Accepts Shadows, Accepts Lights, Ambient, Diffuse, Specular, Shininess, Metal, Reflection, Glossiness, Fresnel, Transparency, IOR) · `ADBE Extrsn Options Group` · `ADBE Plane Options Group`.

## Cámara
`ADBE Camera Options Group` → `ADBE Camera Zoom`, `ADBE Camera Depth of Field`, `ADBE Camera Focus Distance`, `ADBE Camera Aperture`, `ADBE Camera Blur Level` (oculto en Advanced 3D). Iris: `ADBE Iris Shape`, `… Rotation`, `… Roundness`, `… Aspect Ratio`, `… Diffraction Fringe`, `ADBE Iris Highlight Gain`, `… Threshold`, `ADBE Iris Hightlight Saturation` (**errata incluida**).

## Controles de expresión (todos 32 bpc)
`ADBE Slider Control`, `ADBE Angle Control`, `ADBE Checkbox Control`, `ADBE Color Control`, `ADBE Point Control`, `ADBE Point3D Control`, `ADBE Layer Control`, `ADBE Dropdown Control`. Su valor es el parámetro 1: `efecto.property(1)`. En expresiones, `effect("CTRL_Nombre")(1)`.

## Obsoletos (no usar en trabajo nuevo) → su reemplazo
`ADBE Gaussian Blur` → `ADBE Gaussian Blur 2` · `ADBE Fast Blur` → `ADBE Box Blur2` (Fast Box Blur) · `ADBE Basic 3D` → capa 3D · `ADBE Basic Text2` / `ADBE Path Text` → capas de texto · `ADBE Color Key` / `ADBE Luma Key` → Keylight / mates · `ADBE Lightning` → `ADBE Lightning 2` · `ADBE Spill Suppressor` → `ADBE Spill2` · `ADBE Transform` → `ADBE Geometry2` · `ADBE Samurai` (Roto Brush & Refine Edge) → Object Matte (con clics).
