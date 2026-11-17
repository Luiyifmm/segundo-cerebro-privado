(function () { var r = { movidas: [] }, i, dest = app.project.getInsertionBin(); if (!dest || dest.type !== 2 || dest.nodeId === app.project.rootItem.nodeId) return JSON.stringify({ error: "no hay una bandeja seleccionada" });
  r.destino = dest.treePath; var raiz = app.project.rootItem, lista = [];
  for (i = 0; i < raiz.children.numItems; i++) { var c = raiz.children[i]; if (c.type === 2 && (c.name === "EFECTOS DE SONIDO" || c.name.indexOf("SFX PROCESADOS") === 0)) lista.push(c); }
  for (i = 0; i < lista.length; i++) { lista[i].moveBin(dest); r.movidas.push(lista[i].name); }
  r.dentro = []; for (i = 0; i < dest.children.numItems; i++) if (dest.children[i].type === 2) r.dentro.push(dest.children[i].name + " (" + dest.children[i].children.numItems + ")");
  app.project.save(); return JSON.stringify(r); })();
