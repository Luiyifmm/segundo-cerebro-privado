"""Blender sin ventana: importa un GLB, lista objetos/materiales (info.json: trozos, alturas, color por vértice, texturas)
y saca 4 vistas ortográficas (desde -Y, +X, +Y, -X) con Workbench para saber hacia dónde mira el modelo y cuántas piezas
trae (p. ej. «Mighty Oak Trees» son 3 árboles: structure_n + foliage_n; la estatua de Augusto mira a +Y).
Uso: blender -b --python inspeccionar_glb.py -- modelo.glb carpeta"""
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
glb, out = Path(args[0]), Path(args[1])
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(glb))
dg = bpy.context.evaluated_depsgraph_get()

info = []
for o in bpy.data.objects:
    d = {"nombre": o.name, "tipo": o.type, "padre": o.parent.name if o.parent else None,
         "loc": [round(v, 3) for v in o.matrix_world.translation]}
    if o.type == "MESH":
        pts = [o.matrix_world @ Vector(c) for c in o.bound_box]
        d["min"] = [round(min(p[i] for p in pts), 3) for i in range(3)]
        d["max"] = [round(max(p[i] for p in pts), 3) for i in range(3)]
        d["verts"] = len(o.data.vertices)
        d["mats"] = [m.name for m in o.data.materials if m]
        d["atributos_color"] = [a.name for a in o.data.color_attributes]
    info.append(d)
mats = {}
for m in bpy.data.materials:
    nodos = [n.type + (":" + n.image.name + f"({n.image.size[0]}x{n.image.size[1]})" if n.type == "TEX_IMAGE" and n.image else "")
             for n in m.node_tree.nodes] if m.use_nodes else []
    mats[m.name] = {"blend": getattr(m, "blend_method", None), "nodos": nodos}
(out / "info.json").write_text(json.dumps({"objetos": info, "materiales": mats}, indent=1, ensure_ascii=False), encoding="utf-8")

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "TEXTURE"
sc.render.resolution_x, sc.render.resolution_y = 700, 700
mallas = [o for o in bpy.data.objects if o.type == "MESH"]
pts = [o.matrix_world @ Vector(c) for o in mallas for c in o.bound_box]
mn = Vector([min(p[i] for p in pts) for i in range(3)]); mx = Vector([max(p[i] for p in pts) for i in range(3)])
centro = (mn + mx) / 2; lado = max(mx - mn)
cam_data = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_data); sc.collection.objects.link(cam); sc.camera = cam
cam_data.type = "ORTHO"; cam_data.ortho_scale = lado * 1.15
# la vista "frente" mira desde -Y hacia +Y (convención de Blender: el frente de un modelo suele mirar a -Y)
for vista, ang in (("v0_desde_menosY", 0), ("v1_desde_masX", 90), ("v2_desde_masY", 180), ("v3_desde_menosX", 270)):
    a = math.radians(ang)
    cam.location = centro + Vector((lado * 2 * math.sin(a), -lado * 2 * math.cos(a), 0))
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = str(out / (vista + ".png"))
    bpy.ops.render.render(write_still=True)
print("OK centro", [round(v, 3) for v in centro], "tam", [round(v, 3) for v in (mx - mn)])
