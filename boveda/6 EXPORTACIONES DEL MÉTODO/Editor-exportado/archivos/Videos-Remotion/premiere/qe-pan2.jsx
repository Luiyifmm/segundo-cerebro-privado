(function () { app.enableQE(); var q = qe.project.getActiveSequence(), r = {}, t, k;
  for (t = 0; t < 2; t++) { var it = null, tr = q.getAudioTrackAt(t); for (k = 0; k < tr.numItems; k++) { var x = tr.getItemAt(k); if (x && x.type === "Clip") { it = x; break; } }
    var p = it.getClipPanComponent(); try { var l = p.getParamList(); r["l" + t] = String(l); var vs = []; for (k = 0; k < l.length; k++) vs.push(l[k] + "=" + p.getParamValue(l[k]) + " ctl " + p.getParamControlValue(l[k])); r["v" + t] = vs; } catch (e) { r["e" + t] = String(e); } }
  return JSON.stringify(r); })();
