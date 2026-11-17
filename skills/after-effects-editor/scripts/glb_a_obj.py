"""Blender (sin ventana): convierte un modelo GLB/GLTF (p. ej. de Sketchfab) a OBJ + MTL + texturas PNG, que es lo que
importa Element 3D. Probado con el iPhone de la Tanda 03 · 07.
- Saca a archivos PNG las texturas que vienen DENTRO del GLB (si no, el OBJ se queda sin ellas).
- El MTL nombra cada PNG sin ruta (path_mode STRIP): OBJ, MTL y PNG van juntos en la misma carpeta.
  (Con RELATIVE, Blender escribía rutas "../../../.." sin sentido.)
- Opcional: renombra materiales (los de Sketchfab suelen tener nombres aleatorios) con un JSON {"viejo": "NUEVO"}.
- Escribe materiales.json (material → texturas) y dos vistas ortográficas de prueba (frente y espalda).
Uso: blender.exe -b --python glb_a_obj.py -- entrada.glb carpeta_salida [nombres.json]
     (Blender: "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe")
"""
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
glb, out = Path(args[0]), Path(args[1])
nombres = json.loads(Path(args[2]).read_text(encoding="utf-8")) if len(args) > 2 else {}
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(glb))

for m in bpy.data.materials:
    if m.name in nombres:
        m.name = nombres[m.name]

for img in bpy.data.images:                      # texturas empaquetadas → PNG junto al OBJ
    if img.size[0] == 0:
        continue
    img.filepath_raw = str(out / (img.name.replace(" ", "_") + ".png"))
    img.file_format = "PNG"
    try:
        img.save()
    except Exception as e:
        print("no se pudo guardar", img.name, e)

info = {m.name: [n.image.name for n in m.node_tree.nodes if n.type == "TEX_IMAGE" and n.image] if m.use_nodes else []
        for m in bpy.data.materials}
(out / "materiales.json").write_text(json.dumps(info, indent=1, ensure_ascii=False), encoding="utf-8")

nombre = glb.stem + ".obj"
bpy.ops.wm.obj_export(filepath=str(out / nombre), export_materials=True, path_mode="STRIP",
                      forward_axis="NEGATIVE_Z", up_axis="Y", export_selected_objects=False)

# vistas de prueba (Workbench, color de textura, ortográfica; el encuadre se ajusta al tamaño del modelo)
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "TEXTURE"
sc.render.resolution_x, sc.render.resolution_y = 900, 900
mallas = [o for o in bpy.data.objects if o.type == "MESH"]
puntos = [o.matrix_world @ Vector(c) for o in mallas for c in o.bound_box]
lado = max(max(p[i] for p in puntos) - min(p[i] for p in puntos) for i in range(3)) if puntos else 1
cam_data = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_data); sc.collection.objects.link(cam); sc.camera = cam
cam_data.type = "ORTHO"; cam_data.ortho_scale = lado * 1.25
for vista, ang in (("vista_frente", 0), ("vista_espalda", 180)):
    a = math.radians(ang)
    cam.location = (lado * 2 * math.sin(a), -lado * 2 * math.cos(a), 0)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = str(out / (vista + ".png"))
    bpy.ops.render.render(write_still=True)
print("OK", nombre, "texturas:", len([i for i in bpy.data.images if i.size[0] > 0]))
