// Deja sin conexión todos los medios del proyecto de Erick que viven en Google Drive, salvo los del reel en curso,
// para que Premiere deje de leerlos y Drive descargue solo lo que hace falta. Guarda las rutas para reconectarlos después.
(function () {
  var SALVAR = "te quita el hambre", r = { errores: [] }, lista = [], hechos = 0, saltados = 0;
  if (app.project.name !== "ERICK EDICION.prproj") return JSON.stringify({ error: "el proyecto abierto no es ERICK EDICION", abierto: app.project.name });
  function rec(bin, ruta) { for (var i = 0; i < bin.children.numItems; i++) { var c = bin.children[i]; if (c.type === 2) { rec(c, ruta + "/" + c.name); continue; }
      var p = ""; try { p = c.getMediaPath(); } catch (e) {} if (!p || p.indexOf("GoogleDrive") < 0) continue;
      if (ruta.indexOf(SALVAR) >= 0) { saltados++; continue; }
      var off = false; try { off = c.isOffline(); } catch (e2) {} if (off) continue;
      lista.push({ bandeja: ruta, nombre: c.name, ruta: p, id: c.nodeId });
      try { if (c.setOffline()) hechos++; else r.errores.push("no se pudo: " + c.name); } catch (e3) { r.errores.push(c.name + ": " + e3); } } }
  rec(app.project.rootItem, "");
  var f = new File("/Users/luiyi/Videos-Remotion/clientes/eric/medios-desconectados.json"); f.encoding = "UTF-8"; f.open("w"); f.write(JSON.stringify(lista)); f.close();
  r.desconectados = hechos; r.conservados = saltados; r.guardado = lista.length;
  app.project.save();
  return JSON.stringify(r);
})();
