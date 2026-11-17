(function () {
  var seq = app.project.activeSequence, r = { a: [], img: [], claves: [] }, i, t;
  for (t = 0; t < seq.audioTracks.numTracks; t++) r.a.push("A" + (t + 1) + " " + seq.audioTracks[t].name + " clips " + seq.audioTracks[t].clips.numItems);
  for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i];
    if (/\.(png|jpe?g|webp)$/i.test(c.name)) r.img.push("V" + (t + 1) + " " + c.start.seconds.toFixed(2));
    var m = c.getMGTComponent(); if (m) { var k = JSON.parse(m.properties.getParamForDisplayName("Palabra clave").getValue()).textEditValue; if (k) r.claves.push(c.start.seconds.toFixed(2) + " " + k + " r" + m.properties.getParamForDisplayName("Retraso de la palabra clave (fotogramas)").getValue()); }
    if (c.name.indexOf("MG ") === 0) r.img.push("MG V" + (t + 1) + " " + c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2) + " " + c.name);
    if (c.name.indexOf("anidada") > 0) r.img.push("NEST V" + (t + 1) + " " + c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2)); }
  app.enableQE(); var q = qe.project.getActiveSequence();
  try { q.addTracks(0, 0, 3, 1, seq.audioTracks.numTracks); r.add = "ok"; } catch (e) { r.add = String(e); }
  r.a2 = seq.audioTracks.numTracks;
  var a1 = seq.audioTracks[0].clips[0]; r.vol = []; for (i = 0; i < a1.components.numItems; i++) { var co = a1.components[i], ps = []; for (var p = 0; p < co.properties.numItems; p++) ps.push(co.properties[p].displayName + "=" + co.properties[p].getValue()); r.vol.push(co.displayName + ": " + ps.join(" | ")); }
  return JSON.stringify(r);
})();
