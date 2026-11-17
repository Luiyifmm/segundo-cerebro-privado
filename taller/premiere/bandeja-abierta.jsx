(function () { var r = { proyecto: app.project.name, abiertos: [] }, i; for (i = 0; i < app.projects.numProjects; i++) r.abiertos.push(app.projects[i].name);
  try { var b = app.project.getInsertionBin(); r.insercion = b ? b.name + " (" + b.treePath + ")" : null; } catch (e) { r.e = String(e); }
  r.raiz = []; for (i = 0; i < app.project.rootItem.children.numItems; i++) { var c = app.project.rootItem.children[i]; r.raiz.push(c.name + (c.type === 2 ? "/ (" + c.children.numItems + ")" : "")); }
  r.sec = app.project.activeSequence ? app.project.activeSequence.name : null; return JSON.stringify(r); })();
