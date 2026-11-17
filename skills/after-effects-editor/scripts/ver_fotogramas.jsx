// ver_fotogramas.jsx — guarda fotogramas PNG de una comp para revisarlos a ojo. ARGS: {comp, fs: [fotogramas], dir, pre}
(function () {
  var V = $.global.VER;
  var c = null;
  for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === V.comp) c = it; }
  if (!c) return "no existe la comp " + V.comp;
  var out = [];
  for (var j = 0; j < V.fs.length; j++) {
    var f = new File(V.dir + (V.pre || "v") + "_" + V.fs[j] + ".png");
    c.saveFrameToPng(V.fs[j] / c.frameRate, f);
    out.push(f.fsName);
  }
  return out;
})();
