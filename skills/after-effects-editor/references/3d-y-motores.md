# 3D en After Effects: motores, cámaras, luces, mallas y modelos

> Mezcla lo PROBADO en el PC del autor (AE 26.5, Tandas 03–05) con un informe externo de septiembre de 2026. Cuando no coinciden, **manda lo probado**, y se dice abajo. Recetas completas: `recetas/camara-y-3d.md` y `recetas/element-3d-y-producto.md`.

## 1. Los motores y su nombre por script (PROBADO el 01/10/2026; el informe externo los tiene MAL)
| `comp.renderer =` | Es | Para qué |
|---|---|---|
| `"ADBE Advanced 3d"` | **Classic 3D** (¡aunque diga "Advanced"!) | 2.5D con capas planas. Efectos en texto y formas 3D: sí. Motion blur en capas 3D: sí. Desenfoque de cámara: suave. Los .glb no se ven. Rápido. |
| `"ADBE Calder"` | **Advanced 3D** | Mallas paramétricas, modelos GLB/GLTF/OBJ, luz de entorno (HDRI), sombras de focos, luces paralelas y de entorno (26.0), desenfoque de cámara fuerte (26.3), materiales. Los efectos NO se ven en capas de texto o forma 3D (meterlas en una precomp). Sin motion blur de capa (receta 4.33 o CC Force Motion Blur). Con desenfoque + sombras: ~2,3 s por fotograma en 1080p. |
| `"ADBE Ernst"` | **Cinema 4D** | Extruir texto y formas con bisel, materiales y luces. Fondo transparente. Sin desenfoque de cámara. ~1,6 s por fotograma. Camino antiguo. |

- ⚠️ **No buscar el motor por la palabra "advanced"**: la función `setAdvanced3D()` del informe externo elige `"ADBE Advanced 3d"`, que es el **Classic**. Se escribe el nombre exacto de la tabla.
- Comprobar: `comp.renderers` da la lista. Lo que se puede tocar depende del motor activo: las propiedades del otro dan "property is hidden".
- **Elegir:**
  - parallax con fotos o recortes y efectos → Classic;
  - objetos, modelos, reflejos, HDRI, desenfoque fuerte o sombras realistas → Advanced;
  - extrusión con bisel → Cinema 4D;
  - simulaciones, modelado orgánico o materiales complejos (vidrio, emisión, SSS) → Blender, renderizado y compuesto en AE.

## 2. Cámaras
- **Zoom = ancho de la comp × mm / 36** (1920: 50 mm = 2667; 35 mm = 1866,67; 24 mm = 1280). En vertical, con el lado largo: 1080×1920 a 24 mm → 1280; a 50 mm, zoom 1500 con el ancho 1080.
- **Un nodo** (`autoOrient = NO_AUTO_ORIENT`) **colgada de nulos:** el rig limpio. Un nulo por movimiento; el nulo nuevo es padre del anterior y empieza 10 fotogramas antes de que acabe el otro (4.110). Girar el nulo = orbitar.
- **Dos nodos:** cuando hace falta un punto de interés con `wiggle` (4.109) o seguir un objeto. Su *Point of Interest* es `"ADBE Anchor Point"` de la cámara.
- `comp.layers.addCamera(nombre, centro)` deja la cámara en [0, 0, −1500] mirando de lado: hay que colocarla después (4.104).
- **"Center In View" (Ctrl+Home):** la capa queda a "zoom" píxeles delante de la cámara, donde 1 px = 1 px de pantalla. Por script: `cámara(t) + [0, 0, zoom]` en el instante en que llega (4.110).
- **Diseñar primero el plano final** y despejar las posiciones de mundo: `k = (Z + zoom·escalaNulo)/zoom` → `mundo = nulo + (pantalla − centro)·k`, `escala = tamaño·k·100` (4.106 y 4.108).
- **Desenfoque de cámara:**
  - `ADBE Camera Depth of Field` = 1, `ADBE Camera Aperture`;
  - **distancia de foco a lo largo del eje de la cámara**: `dot(p − c, normalize(m − c))` con un nulo FOCO (4.59 y 4.111);
  - apertura 22–25 en 1080p (más alto, más caro).
  - En Advanced 3D (26.3+) hay además *Focus Area Width* y *Near/Far Blur Multiplier* (según el informe; sin probar aquí).
- **Movimientos típicos:**
  - dolly: Z del nulo con ease;
  - órbita: nulo en el centro con Y 0 → 360° lineal;
  - cambio de foco: nulo FOCO que va de un objeto a otro (75 %);
  - curvas: 75 % lo normal, 65 % el desliz lateral, 90 % para cortar en el pico. **Pico = media / (1 − influencia)** (4.110).

## 3. Luces y sombras
- **Tipos:** `LightType.AMBIENT / PARALLEL / SPOT / POINT / ENVIRONMENT`.
- **Nombres internos** (PROBADOS): `ADBE Light Options Group` → `ADBE Light Intensity`, `ADBE Light Color`, `ADBE Light Cone Angle`, `ADBE Light Cone Feather 2`, `ADBE Light Falloff Type`, `ADBE Casts Shadows`, `ADBE Light Shadow Darkness`, `ADBE Light Shadow Diffusion`. La luz de entorno: `ADBE Light Env Atom` (fuente), `ADBE Light Backgd Visible/Opacity/Blur`.
- **Sombra** = la luz con `ADBE Casts Shadows` + la capa que la da con *Casts Shadows* + la que la recibe con *Accepts Shadows*.
  - En Advanced 3D, los interruptores de las mallas están en `ADBE Compositing Options Group`; en Classic, en `ADBE Material Options Group`.
- **La luz paralela no tiene cono y su difusión está oculta:** sombra algo dura. El foco sí la deja suavizar.
- **Ambiente y luz principal:**
  - la sombra quita la luz principal; el ambiente no hace sombra. Mucho ambiente = sin sombras;
  - para aclarar sin perderlas, **subir las dos en la misma proporción** (4.111);
  - iluminación de 3 puntos (informe): principal 100 %, relleno 30–40 % y contraluz detrás.
- **Estudio blanco sin horizonte:** suelo de malla plana enorme + luz paralela + fondo que termina en el color medido del suelo lejano (4.111).
- **Iluminación por imagen (HDRI):** luz de entorno con un .hdr o .exr (desde la 25.2 se puede animar con una comp o un vídeo). Element trae 16 HDRI de estudio (4.102).
- Una **capa 2D** entre capas 3D parte el render en grupos: lo de arriba tapa lo de abajo. Sirve para reflejos y fondos (4.63).

## 4. Mallas paramétricas (26.x) — PROBADO
- `comp.layers.addParametricMesh("nombre", ParametricMeshType.SPHERE)`. Va **primero el nombre** (el informe decía que la firma era desconocida).
- Tipos: CUBE, SPHERE, PLANE, TORUS, CONE, CYLINDER.
- Opciones, bisel, material (`ADBE3D Base Color`, `Roughness`, `Metallic`, `Emission`…) y desplazamiento: `matchnames-probados.md` y receta 4.111.
- **El toro sale tumbado; el plano, de frente** (X 90° para suelo). Píldora = cilindro con bisel = radio. El ancla, en el centro.
- **Materiales Substance (.sbsar):** en *Material Assignment*. Se bajan gratis de la biblioteca de Adobe (con cuenta: el usuario decide) y pueden desplazar la malla (*Displacement Options*).

## 5. Modelos importados
- GLB/GLTF desde la 24.1 y OBJ desde la 24.2. Capa `ThreeDModelLayer`; solo se ven con Advanced 3D. **FBX no:** convertir a GLB en Blender.
- AE los escala solo (p. ej., 839 %): poner la escala a mano (factor, 1 = tamaño original) y orientarlos con Rotate X/Y.
- Materiales de Blender complejos (vidrio, emisión, transmisión) llegan incompletos: PBR básico y el material, en AE.
- **Cámaras de Blender:** con el add-on oficial "Export: Adobe After Effects (.jsx)". Por GLTF, el FOV llega mal (50 mm → 48,5 mm), según el informe.
- Para **Element 3D**: GLB → OBJ + MTL + PNG con `scripts/glb_a_obj.py` (4.102).
- Pases de Blender: **EXR multicapa** (Cryptomatte, en el mismo EXR) + EXtractoR en AE, a 32 bpc.
- Modelos: Sketchfab con licencia CC BY + descargable, guardando el crédito (y pidiendo permiso antes de descargar).

## 6. 3D "falso" con efectos (sin cámara)
CC Sphere (globo, 4.72), CC Cylinder, CC Environment, CC Spotlight, Card Wipe y Card Dance (`APC CardWipeCam` / `APC CardDanceCam`), Caustics, Shatter, Foam, Wave World, Bevel Alpha, Drop Shadow / Radial Shadow, 3D Camera Tracker (seguir cámara de un vídeo real).

## 7. Trampas 3D que ya costaron caro (más en `trampas-scripting.md`)
- **Contraer transformaciones** en una precomp 3D con Classic 3D la sacó de sitio: no usarlo. Para nitidez de cerca, construir la precomp al doble o al triple.
- **Z-fighting:** dos capas en la misma Z se pisan. Separarlas unos px.
- **Classic 3D ordena por el centro de cada capa:** algo pequeño delante de un panel grande puede quedar detrás.
- **Escenas repartidas en Z:** separarlas más que la distancia de la cámara, o la anterior queda delante del objetivo.
- **Emparentar por script compensa la transformación:** poner escala, posición y orientación DESPUÉS de `parent =`.
- **Capa 3D de dos caras:** detrás se ve la misma imagen en espejo. Para otra cara, otra capa a +1 px en Z local.
