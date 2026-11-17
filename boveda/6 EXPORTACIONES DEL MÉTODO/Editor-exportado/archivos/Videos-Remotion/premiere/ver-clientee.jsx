(function () {
  var r = { proyecto: app.project.path, nombre: app.project.name, abiertos: [], items: [], secs: [] }, i, t, k;
  for (i = 0; i < app.projects.numProjects; i++) r.abiertos.push(app.projects[i].name);
  function rec(it, pre, n) { for (var j = 0; j < it.children.numItems; j++) { var c = it.children[j], p = ""; try { p = c.getMediaPath(); } catch (e) {} var info = ""; try { if (c.type === 1 && p) { var m = c.getFootageInterpretation(); info = " fps=" + (m ? m.frameRate : "?"); } } catch (e2) {} r.items.push(pre + c.name + (c.type === 2 ? "/" : "") + (p ? "  <" + p + ">" : "") + info); if (c.type === 2 && n < 2) rec(c, pre + "  ", n + 1); } }
  rec(app.project.rootItem, "", 0);
  for (i = 0; i < app.project.sequences.numSequences; i++) { var s = app.project.sequences[i], o = s.name + " | " + s.frameSizeHorizontal + "x" + s.frameSizeVertical + " | " + (s.end / 254016000000).toFixed(1) + " s | "; var st = s.getSettings(); try { o += "fps " + (1 / st.videoFrameRate.seconds).toFixed(2) + " prev " + st.previewFrameWidth + "x" + st.previewFrameHeight + " codec " + st.previewCodec + " | "; } catch (e3) {}
    for (t = 0; t < s.videoTracks.numTracks; t++) o += "V" + (t + 1) + ":" + s.videoTracks[t].clips.numItems + " "; for (t = 0; t < s.audioTracks.numTracks; t++) o += "A" + (t + 1) + ":" + s.audioTracks[t].clips.numItems + " "; r.secs.push(o); }
  r.activa = app.project.activeSequence ? app.project.activeSequence.name : null;
  return JSON.stringify(r);
})();
