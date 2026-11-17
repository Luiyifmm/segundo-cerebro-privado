// Piezas de V1 de la secuencia activa, en el formato que espera subs-desde-linea.py.
(function () { var s = app.project.activeSequence, v = s.videoTracks[0], o = [];
  for (var i = 0; i < v.clips.numItems; i++) { var c = v.clips[i]; o.push("V1 " + c.name + " " + c.start.seconds.toFixed(3) + "-" + c.end.seconds.toFixed(3) + " in " + c.inPoint.seconds.toFixed(3)); }
  return o.join("\n"); })();
