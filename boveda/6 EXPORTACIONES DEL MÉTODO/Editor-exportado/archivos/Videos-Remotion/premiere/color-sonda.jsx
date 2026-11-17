(function () {
  var seq = app.project.activeSequence, r = { errores: [] }, i, k;
  try {
    r.pistas = []; for (i = 0; i < seq.videoTracks.numTracks; i++) r.pistas.push("V" + (i + 1) + " " + seq.videoTracks[i].name + ":" + seq.videoTracks[i].clips.numItems);
    var c = seq.videoTracks[0].clips[0]; r.clip = c.name; r.comps = [];
    for (i = 0; i < c.components.numItems; i++) r.comps.push(c.components[i].displayName + " [" + c.components[i].matchName + "]");
    var tiene = false; for (i = 0; i < c.components.numItems; i++) if (c.components[i].matchName.indexOf("Lumetri") >= 0) tiene = true;
    r.tenia = tiene;
    if (!tiene) {
      app.enableQE(); var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Lumetri Color"); r.fx1 = fx ? fx.name : null;
      if (!fx || !fx.name) { fx = qe.project.getVideoEffectByName("Color de Lumetri"); r.fx2 = fx ? fx.name : null; }
      var it = q.getVideoTrackAt(0).getItemAt(0); r.qeItem = it ? it.name : null;
      it.addVideoEffect(fx);
    }
    c = seq.videoTracks[0].clips[0];
    for (i = 0; i < c.components.numItems; i++) if (c.components[i].matchName.indexOf("Lumetri") >= 0) { var ps = []; for (k = 0; k < c.components[i].properties.numItems; k++) { var p = c.components[i].properties[k], v; try { v = String(p.getValue()).substr(0, 18); } catch (e) { v = "?"; } ps.push(k + ":" + p.displayName + "=" + v); } r.lumetri = ps; }
  } catch (err) { r.errores.push(String(err) + " linea " + err.line); }
  return JSON.stringify(r);
})();
