// volcar_propiedades.jsx — DESCUBRIR antes de adivinar: árbol de propiedades (nombre visible = matchName : valor) de
// una capa o de un efecto, métodos nuevos de un objeto (reflect) y efectos instalados que coinciden con una palabra.
// Así salieron addParametricMesh, addVariableFontAxis, ParametricMeshType y los grupos de las mallas (Tanda 05 · 01).
// Uso (ae_run_script):
//   $.global.VOL = {comp: "Nombre", capa: "Nombre de capa" | índice, prof: 3, efectos: "particle|glow"};
//   return $.evalFile(new File("<skill>/scripts/volcar_propiedades.jsx"));
// - Sin "capa": solo la búsqueda de efectos (si hay "efectos") y los métodos de la colección de capas.
// - Las propiedades ocultas salen marcadas "(oculta)": en las mallas, los grupos de los otros tipos.
(function () {
  var V = $.global.VOL || {}, out = {}, i;
  function nombres(obj, cual) { var r = [], a = obj.reflect[cual]; for (var k = 0; k < a.length; k++) r.push(a[k].name); return r.join(", "); }
  function arbol(g, prof, pre, lista) {
    var n = 0; try { n = g.numProperties; } catch (e0) { return lista; }
    for (var k = 1; k <= n && lista.length < 2500; k++) {
      var p = g.property(k), linea = pre + p.name + " = " + p.matchName;
      try { if (p.propertyType === PropertyType.PROPERTY && p.propertyValueType !== PropertyValueType.NO_VALUE) linea += " : " + String(p.value).substr(0, 50); } catch (e) { linea += " : (oculta)"; }
      lista.push(linea);
      if (prof > 0 && p.numProperties) arbol(p, prof - 1, pre + "  ", lista);
    }
    return lista;
  }
  var c = null;
  if (V.comp) { for (i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === V.comp) c = it; } }
  else if (app.project.activeItem instanceof CompItem) c = app.project.activeItem;
  if (c) out.metodosCapas = nombres(c.layers, "methods");
  if (c && V.capa !== undefined) {
    var L = (typeof V.capa === "number") ? c.layer(V.capa) : c.layer(V.capa);
    if (!L) return {error: "no encuentro la capa " + V.capa};
    out.capa = L.name + " · " + L.matchName;
    out.metodosCapa = nombres(L, "methods");
    out.arbol = arbol(L, V.prof === undefined ? 3 : V.prof, "", []);
  }
  if (V.efectos) {
    var rx = new RegExp(V.efectos, "i"), l = [];
    for (i = 0; i < app.effects.length; i++) { var e = app.effects[i]; if (rx.test(e.displayName + " " + e.matchName + " " + e.category)) l.push(e.displayName + " = " + e.matchName + " [" + e.category + "]"); }
    out.efectos = l;
  }
  out.version = app.version;
  return out;
})();
