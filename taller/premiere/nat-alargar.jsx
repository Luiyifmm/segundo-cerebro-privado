// Alarga cada corte (vídeo y contador) de 7 a 10 fotogramas: 30 cortes x 10 = 12,5 s. Mismo punto de entrada de cada corte.
(function () { var seq = app.project.activeSequence, r = { errores: [] }, i, t, F = 10 / 24, T = 254016000000;
  try { if (seq.name !== "NATALIA_1010_01 - como la referencia") return JSON.stringify({ error: seq.name });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    var n = seq.videoTracks[0].clips.numItems; if (seq.videoTracks[1].clips.numItems !== n) return JSON.stringify({ error: "video y contador no tienen el mismo numero de clips", v: n, c: seq.videoTracks[1].clips.numItems });
    for (t = 0; t < 2; t++) { var tr = seq.videoTracks[t]; for (i = n - 1; i >= 0; i--) { var c = tr.clips[i], ns = i * F, d = ns - c.start.seconds; if (Math.abs(d) > 0.0005) c.move(seg(d)); c = tr.clips[i]; c.end = seg(ns + F); c.outPoint = seg(c.inPoint.seconds + F);
        if (Math.abs(c.start.seconds - ns) > 0.01 || Math.abs(c.end.seconds - ns - F) > 0.01) r.errores.push("pista " + (t + 1) + " clip " + i + ": " + c.start.seconds.toFixed(3) + "-" + c.end.seconds.toFixed(3)); } }
    for (t = 2; t < seq.videoTracks.numTracks; t++) { var tg = seq.videoTracks[t]; for (i = 0; i < tg.clips.numItems; i++) if (tg.clips[i].start.seconds < 0.05 && tg.clips[i].end.seconds > 5) tg.clips[i].end = seg(n * F); }
    r.clips = n; r.finVideo = seq.videoTracks[0].clips[n - 1].end.seconds; r.titulo = seq.videoTracks[2].clips.numItems ? seq.videoTracks[2].clips[0].end.seconds : null;
    r.ultimo = seq.videoTracks[1].clips[n - 1].name + " " + seq.videoTracks[1].clips[n - 1].start.seconds.toFixed(2); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r); })();
