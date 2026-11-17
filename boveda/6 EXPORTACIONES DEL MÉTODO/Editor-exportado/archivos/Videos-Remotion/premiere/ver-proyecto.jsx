(function () {
  var r = { proyecto: app.project.path, abiertos: [], items: [], secuencias: [] }, i;
  for (i = 0; i < app.projects.numProjects; i++) r.abiertos.push(app.projects[i].path);
  function rec(it, pre, n) { for (var k = 0; k < it.children.numItems; k++) { var c = it.children[k]; var p = ""; try { p = c.getMediaPath(); } catch (e) {} r.items.push(pre + c.name + (c.type === 2 ? "/" : "") + (p ? "  <" + p + ">" : "")); if (c.type === 2 && n < 3) rec(c, pre + "  ", n + 1); } }
  rec(app.project.rootItem, "", 0);
  for (i = 0; i < app.project.sequences.numSequences; i++) { var s = app.project.sequences[i]; var cl = 0; for (var t = 0; t < s.videoTracks.numTracks; t++) cl += s.videoTracks[t].clips.numItems; r.secuencias.push(s.name + " | " + s.frameSizeHorizontal + "x" + s.frameSizeVertical + " | " + (s.end / 254016000000).toFixed(1) + " s | clips " + cl); }
  r.activa = app.project.activeSequence ? app.project.activeSequence.name : null;
  return JSON.stringify(r);
})();
