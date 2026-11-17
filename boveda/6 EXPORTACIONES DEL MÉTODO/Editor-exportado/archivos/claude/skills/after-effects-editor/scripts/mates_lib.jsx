// mates_lib.jsx — ayudas del proyecto "Mattes" (Tanda 03 · 04). Se carga después de ae_lib.jsx y teclas_lib.jsx.
var TEX = "CAMBIA/ESTA/RUTA/Texturas/";   // carpeta con tus texturas (barras /, acabada en /)
// importa (una sola vez) una textura de esa carpeta y la deja en la carpeta "Texturas"
function textura(nombre) {
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof FootageItem && it.file && it.file.displayName === nombre) return it;
  }
  var f = app.project.importFile(new ImportOptions(new File(TEX + nombre)));
  f.parentFolder = folder("Texturas");
  return f;
}
// el "metraje": la foto del cielo llenando el cuadro, con un acercamiento lento (como un plano de vídeo)
function metraje(comp, nombre) {
  var L = comp.layers.add(textura("Texturelabs_Sky_122L.jpg"));
  L.name = nombre || "Metraje (cielo)";
  var s = Math.max(comp.width / L.source.width, comp.height / L.source.height) * 100 * 1.06;
  ponerKeys(T(L).property("ADBE Scale"), [{f: 0, v: [s, s], lin: true}, {f: Math.round(comp.duration * FPS), v: [s * 1.08, s * 1.08], lin: true}]);
  T(L).property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
  return L;
}
// importa (una sola vez) un archivo cualquiera (ruta absoluta) a la carpeta indicada
function importar(ruta, carpeta) {
  var nom = new File(ruta).displayName;
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof FootageItem && it.file && it.file.displayName === nom) return it;
  }
  var f = app.project.importFile(new ImportOptions(new File(ruta)));
  f.parentFolder = folder(carpeta || "Imágenes");
  return f;
}
var IMG = "CAMBIA/ESTA/RUTA/imagenes/";   // carpeta con tus imágenes (barras /, acabada en /)
// la silueta recortada (PNG con transparencia): el "mate de alfa" (en la clase era una cabeza recortada; aquí una mariposa)
function silueta(comp, nombre, pos, esc) {
  var L = comp.layers.add(importar(IMG + "silueta_mariposa.png"));
  L.name = nombre || "Mate · mariposa (PNG con alfa)";
  T(L).property("ADBE Position").setValue(pos || [960, 540]);
  T(L).property("ADBE Scale").setValue([esc || 80, esc || 80]);
  return L;
}
// la nube recortada (PNG con transparencia de Texturelabs)
function nube(comp, nombre, pos, esc) {
  var L = comp.layers.add(textura("Texturelabs_Sky_160M.png"));
  L.name = nombre || "Mate · nube (PNG con alfa)";
  T(L).property("ADBE Position").setValue(pos || [960, 540]);
  T(L).property("ADBE Scale").setValue([esc || 60, esc || 60]);
  return L;
}
// pone el mate a una capa (como en la columna "Track Matte") y apaga el ojo del mate, como hace AE
function ponerMate(capa, mate, tipo) {
  mate.moveBefore(capa);                 // en la clase: el mate justo ENCIMA (en AE 2023+ ya no hace falta)
  capa.setTrackMatte(mate, tipo);
  mate.enabled = false;
  return capa;
}
// franjas oscuras arriba y abajo para que los textos se lean encima de la escena (llamar ANTES de poner los textos)
function barrasTexto(comp) {
  var L = newShape(comp, "Franjas para leer los textos");
  var g1 = grp(L, "arriba"); rectP(g1, [1920, 150], [960, 75], 0); fill(g1, [0, 0, 0], 55);
  var g2 = grp(L, "abajo"); rectP(g2, [1920, 170], [960, 995], 0); fill(g2, [0, 0, 0], 55);
  L.moveToBeginning();
  return L;
}
// etiqueta con fondo oscuro redondeado (texto legible sobre cualquier imagen)
function etiqueta(comp, s, pos, size, col) {
  var t = txt(comp, s, FUENTE.negra, size || 30, col || COL.texto, pos, {name: "Etiqueta · " + s});
  var r = t.sourceRectAtTime(0, false);
  var F = newShape(comp, "Etiqueta · fondo · " + s);
  var g = grp(F, "fondo"); rectP(g, [r.width + 44, r.height + 26], pos, 14); fill(g, [0, 0, 0], 62);
  F.moveAfter(t);
  return t;
}
// miniatura del mate en una esquina, sobre un panel gris (para ENSEÑAR qué hay dentro del mate)
function miniMate(comp, fuente, texto, pos, ancho) {
  var s = (ancho || 320) / fuente.width * 100, w = fuente.width * s / 100, h = fuente.height * s / 100;
  var panel = newShape(comp, "Miniatura · panel · " + texto);
  var g = grp(panel, "panel");
  rectP(g, [w + 16, h + 16], pos, 10);
  fill(g, hex("2A2E38"));
  stroke(g, COL.grisOsc, 2);
  var P = comp.layers.add(fuente);
  T(P).property("ADBE Scale").setValue([s, s]);
  T(P).property("ADBE Position").setValue(pos);
  P.name = "Miniatura · " + texto;
  nota(comp, texto, [pos[0], pos[1] + h / 2 + 34], 22, COL.gris);
  P.moveToBeginning();
  return P;
}
