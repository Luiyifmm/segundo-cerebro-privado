// organizar_proyecto.jsx — REGLA DEL USUARIO: proyecto ordenado para un humano.
// 1) Mete cada elemento del panel Proyecto en carpetas fijas (solo mueve; no borra ni cambia nada):
//      01 FINAL        comps que no usa ninguna otra (las que se renderizan)
//      02 ESCENAS      comps usadas por una final
//      03 PRECOMPS     el resto de comps usadas dentro de otras
//      04 MEDIOS / Imágenes · Vídeos · Audio · 3D · Otros   (archivos importados)
//      05 SÓLIDOS      sólidos y nulos (el "Solids" de AE)
//      99 PRUEBAS      comps cuyo nombre empieza por PRUEBA o "__"
// 2) Pone a cada CAPA el color de etiqueta de su tipo (si colores:true):
//      textos 2 amarillo · formas 9 verde · archivos (foto, vídeo, textura) 8 azul · precomps 10 morado ·
//      cámara y nulos 1 rojo · luces 6 melocotón · capas de ajuste 5 lavanda · mallas 3D 3 aguamarina · mates 14 cian
// 3) Avisa de nombres poco claros ("Shape Layer 3", "Pre-comp 1", "Solid 2"…) para renombrarlos.
// 4) Lista lo que no usa ninguna comp (sólidos y nulos que quedan al reconstruir por script, archivos olvidados) y,
//    con limpiarSinUso:true, lo quita (app.project.removeUnusedFootage). En un proyecto del usuario, preguntar antes.
// Uso: $.global.ORG = {aplicar: false, colores: true, limpiarSinUso: false};  return $.evalFile(new File("<skill>/scripts/organizar_proyecto.jsx"));
// Primero aplicar:false (informe). ES3.
(function () {
  var O = $.global.ORG || {};
  var i, j, comps = [], usadaPor = {}, movidos = [], malos = [], coloreadas = 0;
  for (i = 1; i <= app.project.numItems; i++) if (app.project.item(i) instanceof CompItem) comps.push(app.project.item(i));
  for (i = 0; i < comps.length; i++) for (j = 1; j <= comps[i].numLayers; j++) {
    var s = null; try { s = comps[i].layer(j).source; } catch (e) {}
    if (s) { if (!usadaPor[s.id]) usadaPor[s.id] = []; usadaPor[s.id].push(comps[i]); }
  }
  function esFinal(c) { return !usadaPor[c.id]; }
  function carpetaRaiz(nombre) {
    for (var k = 1; k <= app.project.rootFolder.numItems; k++) { var it = app.project.rootFolder.item(k); if (it instanceof FolderItem && it.name === nombre) return it; }
    return O.aplicar ? app.project.items.addFolder(nombre) : null;
  }
  function sub(padre, nombre) {
    if (!padre) return null;
    for (var k = 1; k <= padre.numItems; k++) { var it = padre.item(k); if (it instanceof FolderItem && it.name === nombre) return it; }
    var f = app.project.items.addFolder(nombre); f.parentFolder = padre; return f;
  }
  function mover(it, destino, ruta) {
    if (it.parentFolder && it.parentFolder.name === ruta.split(" / ").pop()) return;
    movidos.push(it.name + " → " + ruta);
    if (O.aplicar && destino) it.parentFolder = destino;
  }
  var lista = [];
  for (i = 1; i <= app.project.numItems; i++) lista.push(app.project.item(i));     // la lista no cambia aunque movamos
  for (i = 0; i < lista.length; i++) {
    var it = lista[i];
    if (it instanceof FolderItem) continue;
    if (it instanceof CompItem) {
      if (/^PRUEBA|^__/i.test(it.name)) { mover(it, carpetaRaiz("99 PRUEBAS"), "99 PRUEBAS"); continue; }
      if (esFinal(it)) { mover(it, carpetaRaiz("01 FINAL"), "01 FINAL"); continue; }
      var deFinal = false, us = usadaPor[it.id];
      for (j = 0; j < us.length; j++) if (esFinal(us[j])) deFinal = true;
      mover(it, carpetaRaiz(deFinal ? "02 ESCENAS" : "03 PRECOMPS"), deFinal ? "02 ESCENAS" : "03 PRECOMPS");
      continue;
    }
    if (it instanceof FootageItem) {
      var ms = it.mainSource;
      if (ms instanceof SolidSource) { mover(it, carpetaRaiz("05 SÓLIDOS"), "05 SÓLIDOS"); continue; }
      var nombre = it.file ? it.file.name.toLowerCase() : it.name.toLowerCase(), tipo = "Otros";
      if (/\.(png|jpe?g|tiff?|psd|ai|svg|exr|webp|bmp|gif|tga|hdr)$/.test(nombre)) tipo = it.mainSource.isStill ? "Imágenes" : "Vídeos";
      if (/\.(mov|mp4|m4v|avi|mxf|webm|mkv)$/.test(nombre)) tipo = "Vídeos";
      if (/\.(wav|mp3|aif+|m4a|aac|ogg|flac)$/.test(nombre)) tipo = "Audio";
      if (/\.(glb|gltf|obj|fbx|c4d)$/.test(nombre)) tipo = "3D";
      var raiz = carpetaRaiz("04 MEDIOS");
      mover(it, O.aplicar ? sub(raiz, tipo) : null, "04 MEDIOS / " + tipo);
    }
  }
  // colores de etiqueta y nombres poco claros
  for (i = 0; i < comps.length; i++) for (j = 1; j <= comps[i].numLayers; j++) {
    var L = comps[i].layer(j), et = 0, src = null;
    try { src = L.source; } catch (e2) {}
    if (L instanceof TextLayer) et = 2;
    else if (L instanceof ShapeLayer) et = 9;
    else if (L instanceof CameraLayer || L.nullLayer) et = 1;
    else if (L instanceof LightLayer) et = 6;
    else if (L.adjustmentLayer) et = 5;
    else if (/ParametricMesh|ThreeDModel/i.test(L.matchName)) et = 3;
    else if (src instanceof CompItem) et = 10;
    else if (src && src.mainSource && !(src.mainSource instanceof SolidSource)) et = 8;
    try { if (L.isTrackMatte) et = 14; } catch (e3) {}
    if (O.colores && et && O.aplicar && L.label !== et) { L.label = et; coloreadas++; }
    if (/^(Shape Layer|Capa de forma|Pre-comp|Precomp|Solid|Sólido|Null|Nulo|Text|Texto|Adjustment Layer|Capa de ajuste|Medium|Dark|Light) ?\d*$/i.test(L.name))
      malos.push(comps[i].name + " → «" + L.name + "»");
  }
  for (i = 0; i < comps.length; i++) if (/^(Comp|Composición|Pre-comp|Precomp) ?\d*$/i.test(comps[i].name)) malos.push("comp «" + comps[i].name + "»");
  // elementos que no usa ninguna comp (sólidos y nulos que quedan al reconstruir, archivos olvidados)
  var sinUso = [];
  for (i = 1; i <= app.project.numItems; i++) { var fi = app.project.item(i); if (fi instanceof FootageItem && fi.usedIn.length === 0) sinUso.push(fi.name); }
  var quitados = 0;
  if (O.aplicar && O.limpiarSinUso) quitados = app.project.removeUnusedFootage();   // = Archivo → Dependencias → Quitar material de archivo no usado
  if (O.aplicar) app.project.save();
  return {aplicado: !!O.aplicar, movidos: movidos, capasColoreadas: coloreadas, nombresPocoClaros: malos, sinUsar: sinUso, quitadosSinUso: quitados};
})();
