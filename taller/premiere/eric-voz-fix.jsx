(function () { var f = new File("/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/eric-plan.json"); f.encoding = "UTF-8"; f.open("r"); var vz = JSON.parse(f.read()).voz; f.close();
  var seq = app.project.activeSequence, r = { errores: [], ok: 0 }, i, k, t; function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
  function pistaA(n) { for (var x = 0; x < seq.audioTracks.numTracks; x++) if (seq.audioTracks[x].name === n) return x; return -1; }
  var A = pistaA("VOZ CENTRADA A"), B = pistaA("VOZ CENTRADA B"); if (A < 0 || B < 0) return JSON.stringify({ error: "sin pistas" });
  for (i = 0; i < vz.length; i++) { var v = vz[i]; if (v.pista !== 0 && v.pista !== 2) continue; var tr = seq.audioTracks[v.pista === 0 ? A : B], c = null;
    for (k = 0; k < tr.clips.numItems; k++) if (Math.abs(tr.clips[k].start.seconds - v.a) < 0.05) c = tr.clips[k];
    if (!c) { r.errores.push("falta " + v.a); continue; }
    c.inPoint = seg(v.src); c.outPoint = seg(v.src + (v.b - v.a)); if (Math.abs(c.start.seconds - v.a) > 0.001) c.start = seg(v.a); c.end = seg(v.b);
    if (Math.abs(c.inPoint.seconds - v.src) < 0.004 && Math.abs(c.start.seconds - v.a) < 0.004 && Math.abs(c.end.seconds - v.b) < 0.004) r.ok++; else r.errores.push(v.a + ": " + c.start.seconds.toFixed(3) + "-" + c.end.seconds.toFixed(3) + " in " + c.inPoint.seconds.toFixed(3) + " (quiero in " + v.src + ")"); }
  if (r.ok === 15) for (t = 0; t < 4; t++) seq.audioTracks[t].setMute(1);
  r.silenciadas = []; for (t = 0; t < 4; t++) r.silenciadas.push(seq.audioTracks[t].isMuted()); r.fin = seq.end / 254016000000; app.project.save(); return JSON.stringify(r); })();
