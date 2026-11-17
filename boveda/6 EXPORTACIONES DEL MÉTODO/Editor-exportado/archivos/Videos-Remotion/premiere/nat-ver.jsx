(function () { var r = { proyecto: app.project.path, items: [], secs: [] }, i;
  try { var b = app.project.getInsertionBin(); r.insercion = b ? b.treePath : null; r.enBin = []; for (i = 0; i < b.children.numItems; i++) { var c = b.children[i], p = ""; try { p = c.getMediaPath(); } catch (e) {} r.enBin.push(c.name + (c.type === 2 ? "/" : "") + " <" + p + ">"); } } catch (e2) { r.e = String(e2); }
  for (i = 0; i < app.project.rootItem.children.numItems; i++) { var x = app.project.rootItem.children[i]; r.items.push(x.name + (x.type === 2 ? "/ (" + x.children.numItems + ")" : "")); }
  for (i = 0; i < app.project.sequences.numSequences; i++) { var s = app.project.sequences[i]; r.secs.push(s.name + " " + s.frameSizeHorizontal + "x" + s.frameSizeVertical + " " + (s.end / 254016000000).toFixed(1) + "s"); }
  r.activa = app.project.activeSequence ? app.project.activeSequence.name : null; return JSON.stringify(r); })();
