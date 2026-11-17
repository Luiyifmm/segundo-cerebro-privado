// escena3d_lib.jsx — ayudas para escenas 3D con planos texturizados (salió del proyecto del faro).
// Cargar DESPUÉS de ae_lib.jsx. La cámara debe llamarse "CAMARA" (lo usa cartelY).
// Mundo: X derecha, Y abajo (suelo en Y=0), Z hacia el fondo. Unidades = px.

function leerJSON(ruta) {
  var f = new File(ruta); f.encoding = "UTF-8"; f.open("r"); var s = f.read(); f.close();
  return eval("(" + s + ")");
}

function carpetaProyecto(nombre) {
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof FolderItem && it.name === nombre) return it;
  }
  return app.project.items.addFolder(nombre);
}

// footage importado, buscado por nombre de archivo
function tex(nombre) {
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof FootageItem && it.name === nombre) return it;
  }
  throw new Error("No encuentro la textura " + nombre);
}

function compPorNombre(n) {
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof CompItem && it.name === n) return it;
  }
  return null;
}

function capaPorNombre(comp, n) {
  for (var i = 1; i <= comp.numLayers; i++) if (comp.layer(i).name === n) return comp.layer(i);
  return null;
}

// plano 3D con una textura. o = {pos:[x,y,z], ancla:[ax,ay] en px de textura (por defecto el centro),
// esc:[sx,sy] en %, rot:[rx,ry,rz], luces:bool (acepta luces), modo: BlendingMode, opac}
function plano(comp, archivo, nombre, o) {
  var it = tex(archivo);
  var L = comp.layers.add(it);
  L.name = nombre;
  L.threeDLayer = true;
  var t = L.property("ADBE Transform Group");
  var an = o.ancla || [it.width / 2, it.height / 2];
  t.property("ADBE Anchor Point").setValue([an[0], an[1], 0]);
  t.property("ADBE Position").setValue(o.pos);
  var e = o.esc || [100, 100];
  t.property("ADBE Scale").setValue([e[0], e[1], 100]);
  if (o.rot) {
    t.property("ADBE Rotate X").setValue(o.rot[0]);
    t.property("ADBE Rotate Y").setValue(o.rot[1]);
    t.property("ADBE Rotate Z").setValue(o.rot[2]);
  }
  if (o.opac !== undefined) t.property("ADBE Opacity").setValue(o.opac);
  if (o.modo) L.blendingMode = o.modo;
  var mat = L.property("ADBE Material Options Group");
  mat.property("ADBE Accepts Lights").setValue(o.luces === false ? 0 : 1);
  mat.property("ADBE Casts Shadows").setValue(0);
  mat.property("ADBE Accepts Shadows").setValue(0);
  return L;
}

// cartel que gira en Y para mirar siempre a la cámara (sirve para cilindros, postes y montones)
var EXPR_CARTEL_Y = "var c = thisComp.layer(\"CAMARA\").toWorld([0,0,0]); var p = toWorld(anchorPoint); " +
  "radiansToDegrees(Math.atan2(-(c[0]-p[0]), -(c[2]-p[2])))";
function cartelY(L) { L.property("ADBE Transform Group").property("ADBE Rotate Y").expression = EXPR_CARTEL_Y; return L; }
