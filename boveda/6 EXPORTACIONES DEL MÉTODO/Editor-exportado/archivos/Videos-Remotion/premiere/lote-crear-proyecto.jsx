// Crea un proyecto de lote para un cliente e importa la secuencia de ejemplo (la que editó el usuario) en la bandeja "00 EJEMPLO".
(function () { var CFG = __CFG__, r = { pasos: [], errores: [] }, i, j;
  function abierto(n) { for (var x = 0; x < app.projects.numProjects; x++) if (app.projects[x].name === n) return app.projects[x]; return null; }
  var destino = CFG.proyecto, nombre = destino.substr(destino.lastIndexOf("/") + 1);
  if (new File(destino).exists || abierto(nombre)) return JSON.stringify({ error: "ya existe " + nombre });
  var src = abierto(CFG.origen.substr(CFG.origen.lastIndexOf("/") + 1)); if (!src) { app.openDocument(CFG.origen, true, true, true); src = abierto(CFG.origen.substr(CFG.origen.lastIndexOf("/") + 1)); r.pasos.push("abierto origen"); }
  if (!src) return JSON.stringify({ error: "no abre el origen" });
  var ids = [], nombres = []; for (j = 0; j < src.sequences.numSequences; j++) { var s = src.sequences[j]; nombres.push(s.name); for (i = 0; i < CFG.secuencias.length; i++) if (s.name === CFG.secuencias[i]) ids.push(s.sequenceID); }
  if (!ids.length) return JSON.stringify({ error: "no encuentro la secuencia de ejemplo", hay: nombres });
  if (!app.newProject(destino)) r.errores.push("newProject devolvió falso");
  var np = abierto(nombre); if (!np) return JSON.stringify({ error: "no se creó el proyecto", r: r });
  r.activo = app.project.name; if (app.project.name !== nombre) { app.openDocument(destino, true, true, true); r.activo = app.project.name; }
  var bin = app.project.rootItem.createBin("00 EJEMPLO (editado por ti)");
  var antes = {}; for (i = 0; i < app.project.rootItem.children.numItems; i++) antes[app.project.rootItem.children[i].nodeId] = 1;
  var ok = app.project.importSequences(CFG.origen, ids); r.pasos.push("importSequences: " + ok);
  var movidos = 0; for (i = app.project.rootItem.children.numItems - 1; i >= 0; i--) { var c = app.project.rootItem.children[i]; if (!antes[c.nodeId] && c.nodeId !== bin.nodeId) { try { c.moveBin(bin); movidos++; } catch (e) {} } }
  r.pasos.push("elementos a la bandeja de ejemplo: " + movidos);
  var S = []; for (j = 0; j < app.project.sequences.numSequences; j++) S.push(app.project.sequences[j].name); r.secuencias = S;
  try { app.project.save(); r.pasos.push("guardado"); } catch (e) { r.errores.push("guardar: " + e); }
  return JSON.stringify(r); })();
