(function () { app.enableQE(); var q = qe.project.getActiveSequence(), r = {}, t, k;
  for (t = 0; t < 2; t++) { var it = null, tr = q.getAudioTrackAt(t); for (k = 0; k < tr.numItems; k++) { var x = tr.getItemAt(k); if (x && x.type === "Clip") { it = x; break; } }
    try { var p = it.getClipPanComponent(); r["m" + t] = p ? p.reflect.methods.join(",") + " | " + p.reflect.properties.join(",") : "null";
      if (p) { r["n" + t] = p.name + " params " + p.numParams; var ps = []; for (k = 0; k < p.numParams; k++) { var pa = p.getParam(k); ps.push(pa.name + "=" + pa.getValueAtTime(0) + " [" + pa.reflect.methods.join(",").substr(0, 200) + "]"); } r["p" + t] = ps; } } catch (e) { r["e" + t] = String(e); } }
  return JSON.stringify(r); })();
