(function () {
  var r = {}, seq = app.project.activeSequence, i, SUB = -1, mejor = 0;
  for (var t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (seq.videoTracks[t].clips[i].getMGTComponent()) n++; if (n > mejor) { mejor = n; SUB = t; } }
  var c = seq.videoTracks[SUB].clips[0];
  r.pista = SUB; r.nombre = c.name; r.ini = c.start.seconds; r.fin = c.end.seconds; r.inP = c.inPoint.seconds; r.outP = c.outPoint.seconds; r.dur = c.duration.seconds;
  try { r.speed = c.getSpeed(); } catch (e) {}
  try { r.medio = c.projectItem.name + " | " + c.projectItem.getOutPoint().seconds; } catch (e) { r.medioErr = String(e); }
  var antes = c.end.ticks, f = new Time(); f.seconds = 0.8;
  try { c.end = f; r.finTras = c.end.seconds; r.outTras = c.outPoint.seconds; } catch (e) { r.errFin = String(e); }
  var v = new Time(); v.ticks = antes; c.end = v; r.finRestaurado = c.end.seconds;
  return JSON.stringify(r);
})();
