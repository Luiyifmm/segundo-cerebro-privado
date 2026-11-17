// Enlaza (o vuelve a enlazar) los proxies de los brutos de un proyecto de lote.
(function () { var CFG = __CFG__, r = { puestos: 0, errores: [] }, i, pr = null; for (i = 0; i < app.projects.numProjects; i++) if (app.projects[i].name === CFG.proyecto) pr = app.projects[i]; if (!pr) return "proyecto cerrado";
  function rec(b) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { rec(c); continue; } var mp = ""; try { mp = c.getMediaPath(); } catch (e) {} var px = CFG.proxies[mp]; if (!px) continue; try { if (c.hasProxy && c.hasProxy()) c.detachProxy(); if (c.canProxy()) { c.attachProxy(px, 0); r.puestos++; } } catch (e) { r.errores.push(c.name + ": " + e); } } }
  rec(pr.rootItem); try { pr.save(); } catch (e) {} return JSON.stringify(r); })();
