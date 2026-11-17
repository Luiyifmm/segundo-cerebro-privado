// Repara el recorte de los subtítulos: fin en la línea de tiempo y punto de salida del origen coherentes (así se pueden alargar con el ratón).
(function () {
  var D = [0.3333333333333333,0.7,0.7333,0.4667,0.5,0.9333,0.2667,0.5333,0.4333,0.3,0.6667,0.4333,0.7333,0.3,1,0.3,0.4,0.8333,0.3333,1,0.4,0.6667,0.5333,0.5333,0.4333,0.8,0.4333,0.5333,1.1333,0.3,0.6333,0.3667,0.9333,0.7,0.5667,0.4,0.2667,1.3333,1.4,0.8333,1.2,0.5667,0.8333,1.3,0.7333,1.2,1.1,1,0.8,2.2667,1.1,0.7667,1.0333,0.6667];
  var seq = app.project.activeSequence, tr = seq.videoTracks[4], r = { n: tr.clips.numItems, mal: [] }, i;
  if (tr.clips.numItems !== D.length) return JSON.stringify({ error: "numero de clips distinto", n: tr.clips.numItems });
  for (i = tr.clips.numItems - 1; i >= 0; i--) {
    var c = tr.clips[i], ini = c.start.seconds, sig = i + 1 < tr.clips.numItems ? tr.clips[i + 1].start.seconds : 1e9;
    var fin = Math.min(ini + D[i], sig), e = new Time(); e.seconds = fin; c.end = e;
    var o = new Time(); o.seconds = fin - ini; c.outPoint = o;
  }
  for (i = 0; i < tr.clips.numItems; i++) { var k = tr.clips[i]; if (Math.abs(k.inPoint.seconds) > 0.01 || Math.abs(k.outPoint.seconds - (k.end.seconds - k.start.seconds)) > 0.02 || Math.abs(k.end.seconds - k.start.seconds - D[i]) > 0.04) r.mal.push(i + ": " + k.start.seconds.toFixed(2) + "-" + k.end.seconds.toFixed(2) + " out " + k.outPoint.seconds.toFixed(2)); }
  r.fin = seq.end / 254016000000; r.ultimo = tr.clips[tr.clips.numItems - 1].end.seconds;
  app.project.save();
  return JSON.stringify(r);
})();
