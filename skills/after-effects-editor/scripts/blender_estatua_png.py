"""Blender sin ventana (Cycles, GPU): una estatua escaneada de Sketchfab (malla con color por vértice) → PNG con fondo
transparente, en mármol blanco y con luz de día, para usarla como capa 2D dentro de una escena 3D de After Effects.
Hecho en Tanda 04 · 03 (Augusto de davide100, CC BY): 1800x4000 a 128 muestras = 35 s en una RTX de 16 GB.
Valores que quedaron: corte_z=18.62 cupula=0.35 sol_e=6.5 cielo_e=0.22 sol_az=60 sol_el=40 "aspecto=Medium High Contrast"
(el aspecto Base Contrast salía gris y plano; Medium High Contrast da blancos limpios y pliegues hondos).
La estatua debe mirar a +Y (si no, mirar antes con inspeccionar el GLB en 4 vistas; `giro=90` orbita la cámara).
Uso: blender -b --python blender_estatua_png.py -- estatua.glb salida.png ancho alto muestras [clave=valor ...]
  claves: aspecto (look de AgX: Base Contrast, Medium High Contrast, High Contrast...),
          corte_z (borra lo que haya por encima: el «plato» roto que el escaneo tiene sobre la cabeza),
          sol_az (grados a la izquierda de la cámara), sol_el (altura del sol), sol_e (fuerza), cielo_e (relleno),
          zoom_z0, zoom_z1 (encuadra solo esa franja de alturas: para mirar un detalle), lente (mm), cam_z (altura cámara)
- Mármol: Principled con algo de subsurface; el color por vértice del escaneo solo aporta un 18 % de variación (suciedad).
- Luz: sol arriba-izquierda-delante + cielo azul suave de relleno (las sombras azuladas casan con el etalonaje del profe).
- Cámara: 85 mm, de frente (la estatua mira a +Y), a media altura: poca perspectiva, como una foto.
"""
import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
glb, salida = Path(args[0]), Path(args[1])
ancho, alto, muestras = int(args[2]), int(args[3]), int(args[4])
op = dict(a.split("=", 1) for a in args[5:])
num = lambda k, d=None: float(op[k]) if k in op else d
corte_z = num("corte_z")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(glb))
mallas = [o for o in bpy.data.objects if o.type == "MESH"]

if corte_z is not None:
    # El escáner no llegó a la coronilla y la cerró con un «plato» roto. Se une la malla (viene en 6 trozos de 65k
    # vértices), se corta en corte_z y el agujero se tapa con una cúpula (abanico desde el centro, subdividido y
    # levantado con perfil parabólico): bajo el velo la cabeza es redonda.
    bpy.ops.object.select_all(action="DESELECT")
    for o in mallas:
        o.select_set(True)
    bpy.context.view_layer.objects.active = mallas[0]
    bpy.ops.object.join()
    obj = mallas[0]; mallas = [obj]
    mw = obj.matrix_world.copy(); mwi = mw.inverted()
    bm = bmesh.new(); bm.from_mesh(obj.data)
    bm.transform(mw)                                         # trabajar en coordenadas del mundo
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)  # soldar las costuras entre trozos
    geo = bm.verts[:] + bm.edges[:] + bm.faces[:]
    res = bmesh.ops.bisect_plane(bm, geom=geo, plane_co=(0, 0, corte_z), plane_no=(0, 0, 1), clear_outer=True)
    # El escaneo tiene rotos: el borde del corte no forma un aro cerrado y «rellenar agujeros» no hace nada (probado).
    # Se tapa con una cúpula nueva sobre el contorno EXTERIOR del corte (envolvente convexa en planta).
    corte = {v for g in res["geom_cut"] if isinstance(g, bmesh.types.BMEdge) for v in g.verts if v.is_valid}
    pts = sorted({(round(v.co.x, 6), round(v.co.y, 6)) for v in corte})

    def cruz(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    abajo, arriba = [], []
    for p in pts:                                            # envolvente convexa (cadena monótona)
        while len(abajo) >= 2 and cruz(abajo[-2], abajo[-1], p) <= 0:
            abajo.pop()
        abajo.append(p)
    for p in reversed(pts):
        while len(arriba) >= 2 and cruz(arriba[-2], arriba[-1], p) <= 0:
            arriba.pop()
        arriba.append(p)
    casco = abajo[:-1] + arriba[:-1]                         # en sentido antihorario visto desde arriba
    # repartir el aro en 96 puntos a la misma distancia (el casco tiene lados muy desiguales)
    per = [((casco[(i + 1) % len(casco)][0] - casco[i][0]) ** 2 + (casco[(i + 1) % len(casco)][1] - casco[i][1]) ** 2) ** 0.5
           for i in range(len(casco))]
    total, n_aro, aro = sum(per), 96, []
    for k in range(n_aro):
        d, i = total * k / n_aro, 0
        while d > per[i] and i < len(per) - 1:
            d -= per[i]; i += 1
        a, b = casco[i], casco[(i + 1) % len(casco)]
        f = d / per[i] if per[i] else 0
        aro.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
    cx = sum(p[0] for p in aro) / n_aro; cy = sum(p[1] for p in aro) / n_aro
    radio = sum(((p[0] - cx) ** 2 + (p[1] - cy) ** 2) ** 0.5 for p in aro) / n_aro
    sube = num("cupula", 0.35) * radio
    # la cúpula un 1,5 % más ancha y 0,025 más baja que el corte: tapa la rendija (si no, se ve una raya oscura)
    ancha, baja = 1.015, 0.025
    anillos = 10
    filas = []
    for k in range(anillos):                                 # k=0 es el aro (t=1); hacia dentro t baja
        t = 1 - k / anillos
        filas.append([bm.verts.new((cx + (p[0] - cx) * t * ancha, cy + (p[1] - cy) * t * ancha,
                                    corte_z - baja + (sube + baja) * (1 - t * t))) for p in aro])
    cima = bm.verts.new((cx, cy, corte_z + sube))
    nuevas = []
    for k in range(anillos - 1):
        for i in range(n_aro):
            j = (i + 1) % n_aro
            nuevas.append(bm.faces.new((filas[k][i], filas[k][j], filas[k + 1][j], filas[k + 1][i])))
    for i in range(n_aro):
        nuevas.append(bm.faces.new((filas[-1][i], filas[-1][(i + 1) % n_aro], cima)))
    for f in nuevas:
        f.smooth = True
    # quitar islas sueltas que hayan quedado del «plato» (trozos pequeños sin conexión con la estatua)
    bm.verts.index_update()                                  # los vértices nuevos traen índice -1
    vistos, islas = set(), []
    for v0 in bm.verts:
        if v0.index in vistos:
            continue
        pila, isla = [v0], []
        vistos.add(v0.index)
        while pila:                                          # cada vértice entra una sola vez: termina seguro
            v = pila.pop(); isla.append(v)
            for e in v.link_edges:
                w = e.other_vert(v)
                if w.index not in vistos:
                    vistos.add(w.index); pila.append(w)
        islas.append(isla)
    grande = max(len(i) for i in islas)
    sueltas = [v for i in islas if len(i) < 0.002 * grande and all(v.co.z > corte_z - 0.8 for v in i) for v in i]
    bmesh.ops.delete(bm, geom=sueltas, context="VERTS")
    bm.transform(mwi)
    bm.to_mesh(obj.data); bm.free()
    obj.data.update(); bpy.context.view_layer.update()
    print("CUPULA aro", len(casco), "puntos del casco; radio", round(radio, 3), "alto", round(sube, 3),
          "islas", len(islas), "borradas", len(sueltas), "verts")

# --- material de mármol (uno para todas las piezas) ---
mat = bpy.data.materials.new("marmol"); mat.use_nodes = True
nt = mat.node_tree; nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
vc = nt.nodes.new("ShaderNodeVertexColor"); vc.layer_name = mallas[0].data.color_attributes[0].name
gris = nt.nodes.new("ShaderNodeRGBToBW")
mapa = nt.nodes.new("ShaderNodeMapRange")           # luminancia del escaneo 0..1 → 0.82..1.0 (solo un toque)
mapa.inputs["To Min"].default_value = 0.82; mapa.inputs["To Max"].default_value = 1.0
mezcla = nt.nodes.new("ShaderNodeMix"); mezcla.data_type = "RGBA"; mezcla.blend_type = "MULTIPLY"
mezcla.inputs["Factor"].default_value = 1.0
mezcla.inputs["A"].default_value = (0.80, 0.80, 0.78, 1)  # mármol blanco algo cálido
nt.links.new(vc.outputs["Color"], gris.inputs["Color"])
nt.links.new(gris.outputs["Val"], mapa.inputs["Value"])
nt.links.new(mapa.outputs["Result"], mezcla.inputs["B"])
nt.links.new(mezcla.outputs["Result"], bsdf.inputs["Base Color"])
bsdf.inputs["Roughness"].default_value = 0.42
bsdf.inputs["Subsurface Weight"].default_value = 0.12
bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.85, 0.7)
bsdf.inputs["Subsurface Scale"].default_value = 0.06
nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
for o in mallas:
    o.data.materials.clear(); o.data.materials.append(mat)

# --- encuadre ---
pts = [o.matrix_world @ Vector(c) for o in mallas for c in o.bound_box]
mn = Vector([min(p[i] for p in pts) for i in range(3)]); mx = Vector([max(p[i] for p in pts) for i in range(3)])
centro = (mn + mx) / 2; altura = mx.z - mn.z
sc = bpy.context.scene
cam_d = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam); sc.camera = cam
lente = num("lente", 85)
cam_d.lens = lente; cam_d.sensor_fit = "VERTICAL"; cam_d.sensor_height = 24
fov_v = 2 * math.atan(12 / lente)
dist = (altura * 1.08 / 2) / math.tan(fov_v / 2)            # distancia que encuadra la estatua entera
cam_z = num("cam_z", centro.z)
giro = math.radians(num("giro", 0))                          # orbitar la cámara alrededor de la estatua (revisar)
cam.location = (centro.x - dist * math.sin(giro), centro.y + dist * math.cos(giro), cam_z)
cam.rotation_euler = (math.radians(90), 0, math.radians(180) + giro)   # giro 0: mira hacia -Y (la estatua mira a +Y)
if "zoom_z0" in op:                                         # mirar un detalle: misma cámara, encuadre desplazado
    z0, z1 = num("zoom_z0"), num("zoom_z1")
    cam_d.sensor_height = 24 * (z1 - z0) / (altura * 1.08)
    cam_d.shift_y = ((z0 + z1) / 2 - cam_z) / (z1 - z0)
    if "zoom_x" in op and giro == 0:                         # la derecha de la cámara es -X
        cam_d.shift_x = (centro.x - num("zoom_x")) / (z1 - z0)

# --- luz ---
sol_d = bpy.data.lights.new("sol", "SUN"); sol_d.energy = num("sol_e", 5.0); sol_d.angle = math.radians(3)
sol_d.color = (1.0, 0.96, 0.9)
sol = bpy.data.objects.new("sol", sol_d); sc.collection.objects.link(sol)
# sol_az: grados desde la cámara hacia su izquierda (+X, porque la cámara mira a -Y); sol_el: altura sobre el horizonte
az, el = math.radians(num("sol_az", 55)), math.radians(num("sol_el", 42))
sol.rotation_euler = (math.radians(90) - el, 0, math.radians(180) - az)
w = bpy.data.worlds.new("cielo"); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs["Color"].default_value = (0.5, 0.64, 0.92, 1)
bg.inputs["Strength"].default_value = num("cielo_e", 0.35)

# --- render ---
sc.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for tipo in ("OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = tipo; prefs.get_devices()
        if any(d.type == tipo for d in prefs.devices):
            for d in prefs.devices: d.use = d.type == tipo
            sc.cycles.device = "GPU"; break
    except Exception:
        pass
sc.cycles.samples = muestras; sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = ancho, alto, 100
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - " + op.get("aspecto", "Base Contrast")      # p. ej. aspecto=Medium High Contrast
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
sc.render.filepath = str(salida)
bpy.ops.render.render(write_still=True)
print("OK", salida, "dispositivo", sc.cycles.device, "altura", round(altura, 3), "z", round(mn.z, 3), round(mx.z, 3))
