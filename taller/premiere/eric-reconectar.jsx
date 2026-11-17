// Reconecta los medios que eric-desconectar.jsx dejó sin conexión. FILTRO = texto de la bandeja a reconectar ("" = todos).
// Si existe una copia local en clientes/eric/entrada/<bandeja>/<archivo>, enlaza a la copia local en vez de a Drive.
(function () {
  var FILTRO = "";
  var f = new File("/Users/luiyi/Videos-Remotion/clientes/eric/medios-desconectados.json"); f.encoding = "UTF-8"; f.open("r"); var lista = JSON.parse(f.read()); f.close();
  var porId = {}, r = { errores: [], reconectados: 0, locales: 0 }, i;
  function rec(bin) { for (var k = 0; k < bin.children.numItems; k++) { var c = bin.children[k]; if (c.type === 2) rec(c); else porId[c.nodeId] = c; } }
  rec(app.project.rootItem);
  for (i = 0; i < lista.length; i++) { var x = lista[i]; if (FILTRO && x.bandeja.indexOf(FILTRO) < 0) continue; var it = porId[x.id]; if (!it) { r.errores.push("no esta: " + x.nombre); continue; }
    var carpeta = x.bandeja.split("/").pop().replace(/\s+$/, ""), local = new File("/Users/luiyi/Videos-Remotion/clientes/eric/entrada/" + carpeta + "/" + x.nombre), destino = local.exists ? local.fsName : x.ruta;
    try { if (it.changeMediaPath(destino, true)) { r.reconectados++; if (local.exists) r.locales++; } else r.errores.push("no enlaza: " + x.nombre); } catch (e) { r.errores.push(x.nombre + ": " + e); } }
  app.project.save();
  return JSON.stringify(r);
})();
