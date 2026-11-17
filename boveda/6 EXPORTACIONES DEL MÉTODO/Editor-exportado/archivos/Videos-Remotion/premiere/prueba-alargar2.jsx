(function () {
  var r = {}, seq = app.project.activeSequence, c = seq.videoTracks[4].clips[0];
  var o = new Time(); o.seconds = c.inPoint.seconds + (c.end.seconds - c.start.seconds);
  try { c.outPoint = o; } catch (e) { r.err = String(e); }
  r.ini = c.start.seconds; r.fin = c.end.seconds; r.inP = c.inPoint.seconds; r.outP = c.outPoint.seconds; r.dur = c.duration.seconds;
  var c1 = seq.videoTracks[4].clips[1]; r.sig = c1.start.seconds + "-" + c1.end.seconds + " in " + c1.inPoint.seconds + " out " + c1.outPoint.seconds;
  return JSON.stringify(r);
})();
