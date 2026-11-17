# Recursos que se pueden usar (y qué comprobar en cada PC)

> Parte de la skill **after-effects-editor** (versión pública). «El autor» es el PC donde se probó todo (Windows 11, AE 26.5 en inglés); en otro PC hay que comprobarlo.

## ⭐ Si no tienes algo, búscalo (con permiso)

> No inventar a mano lo que se puede conseguir bien hecho.
- **Modelos 3D → Sketchfab:** filtro **licencia CC BY + descargable**, formato **glb** original, y **guardar el crédito** (autor, título, enlace) en las notas del proyecto. Se importan nativos en AE con el motor Advanced 3D, que por script es `"ADBE Calder"` (receta 4.4).
- **Imágenes, referencias y fondos → Pinterest** o webs de stock: guardar la imagen (con permiso del usuario) e importarla con `importFile`.
- **Texturas → Texturelabs** (gratis, uso comercial): papel, película, cielo (categoría **Sky** → Clouds), madera (**Wood → Boards**), metal, polvo, grunge…
- **Vídeo y fotos de stock → Pexels** (gratis, sin atribución obligatoria): enseñar antes cuáles y cuánto pesan, y guardar los créditos en `CREDITOS.txt`.
- **Lo demás → buscar en la web:** iconos, SVG de logos (leídos con JavaScript), fuentes gratis, referencias de estilo, overlays…
- **Normas que no cambian:**
  - **Antes de CADA descarga, pedir permiso** diciendo qué archivo, de dónde y cuánto pesa (se pueden pedir varias juntas).
  - Las descargas van a la carpeta Descargas y luego se copian a `_material\` del proyecto.
  - Nada de contraseñas ni de cuentas. No ejecutar instaladores sin permiso.
  - Sin caras reales ni marcas de otros, salvo que el usuario lo pida.
- **Generado por Claude, sin descargar nada:** texturas procedurales en Python (receta 4.29), emojis de Windows en color (4.35) y formas y trazados por script.

## Qué comprobar en cada PC

- **Fuentes:** `ae_list_fonts` (devuelve el nombre PostScript, que es el que usa AE). Si falta la pedida, proponer una parecida.
  - Útiles del sistema en Windows: Segoe Script Bold (a mano), Georgia Bold (serif con cuerpo), Burbank Big Condensed Black (impacto).
  - **Fuentes VARIABLES** (un deslizador cambia el grosor o el ancho; receta 4.111): **Bahnschrift** (peso 300–700 y ancho 75–100: la más útil), **Segoe UI Variable** (peso 300–700, tamaño óptico), Cascadia Code y Mono (peso 200–700), Sitka y Arsenica Variable.
- **Plugins de pago:** `ae_search_effects`. El autor usó Deep Glow 2, Shadow Studio 3, Sapphire, Crate's Godrays, Displacer Pro, Pixel Sorter 4, Element 3D y Optical Flares. Si no están, `efectos-y-plugins.md` da la alternativa gratis o nativa de cada uno.
  - **Element 3D:** su escena se monta en su propia ventana, no por script. O la monta el usuario, o se usa un preset .ffx guardado, o texto 3D con el motor Cinema 4D (receta 4.97). Trae 16 HDRI de entorno de 4k (*photo_studio_01_4k* y *brown_photostudio* para productos).
  - **Sapphire** incluye S_BlurMoCurves (zoom con Z Dist), S_Shake, S_TVDamage, S_Flicker, S_Vignette, S_Rays y S_BlurChroma (recetas 4.92–4.100).
- **Extensiones (paneles)** como Flow, Mover, Copy Pasta o Prime Tools: lo que hacen con clics se puede hacer por script (tabla A2 de `efectos-y-plugins.md`). Las curvas de Flow son cubic-bezier [x1, y1, x2, y2].
- **Iconos sin descargar (Windows 11):** Segoe Fluent Icons (`C:\Windows\Fonts\SegoeIcons.ttf`, ~1540 glifos), con `tabla_glifos.py` + `iconos_png.py`. **Emojis:** Segoe UI Emoji renderizada a PNG (receta 4.35).
- **Guías de composición:** tercios en cian + centro en rojo. En AE se crean con `addGuide`.

## Forma de trabajar

- Que **todo se vea en la pantalla de After Effects**: abrir en el visor la comp en la que se trabaja (`comp.openInViewer()`), seleccionar la capa con el efecto (así se ven sus controles) y colocar el tiempo en un momento representativo.
