(function () {
  var r = {}, seq = null, i;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("CLIENTE-A_1009_01 - corte") === 0) seq = app.project.sequences[i];
  if (!seq) return JSON.stringify({ error: "sin secuencia" });
  app.project.openSequence(seq.sequenceID);
  r.nombre = seq.name; r.v0 = seq.videoTracks.numTracks; r.a0 = seq.audioTracks.numTracks;
  app.enableQE();
  var q = qe.project.getActiveSequence();
  try { while (seq.videoTracks.numTracks < 4) { q.addTracks(1, seq.videoTracks.numTracks, 0); } } catch (e) { r.err = String(e); }
  r.v1 = seq.videoTracks.numTracks; r.a1 = seq.audioTracks.numTracks;
  var c = seq.videoTracks[0].clips[0], m = null;
  for (i = 0; i < c.components.numItems; i++) { var co = c.components[i]; var ps = []; for (var k = 0; k < co.properties.numItems; k++) ps.push(co.properties[k].displayName + "=" + String(co.properties[k].getValue())); r["comp" + i] = co.displayName + ": " + ps.join(" | "); }
  r.clips = seq.videoTracks[0].clips.numItems;
  return JSON.stringify(r);
})();
