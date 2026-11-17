// Lleva el vídeo a 13 s exactos (312 fotogramas: en cada grupo de 5 cortes, el 1.º y el 3.º duran 11 fotogramas y el resto 10)
// y rehace el contador con contorno más grueso.
(function () { var MOGRT = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Texto contorno v3.mogrt", seq = app.project.activeSequence, r = { errores: [] }, i, T = 254016000000;
  try { if (seq.name !== "NATALIA_1010_01 - como la referencia") return JSON.stringify({ error: seq.name });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
    var v = seq.videoTracks[0], tc = seq.videoTracks[1], n = v.clips.numItems; if (tc.clips.numItems !== n || n !== 30) return JSON.stringify({ error: "esperaba 30 y 30", v: n, c: tc.clips.numItems });
    var ini = [], f = 0; for (i = 0; i < n; i++) { ini.push(f); f += (i % 5 === 0 || i % 5 === 2) ? 11 : 10; } ini.push(f); r.total = f;
    var datos = []; for (i = 0; i < n; i++) { var c0 = tc.clips[i], ps0 = c0.getMGTComponent().properties; datos.push({ txt: JSON.parse(ps0.getParamForDisplayName("Texto").getValue()).textEditValue, tam: ps0.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").getValue(), pos: mov(c0)[0].getValue() }); }
    for (i = n - 1; i >= 0; i--) tc.clips[i].remove(false, false);
    for (i = n - 1; i >= 0; i--) { var c = v.clips[i], ns = ini[i] / 24, d = ns - c.start.seconds, dur = (ini[i + 1] - ini[i]) / 24; if (Math.abs(d) > 0.0005) c.move(seg(d)); c = v.clips[i]; c.end = seg(ns + dur); c.outPoint = seg(c.inPoint.seconds + dur); if (Math.abs(c.start.seconds - ns) > 0.01) r.errores.push("video " + i); }
    var puestos = 0; for (i = 0; i < n; i++) { var a = ini[i] / 24, b = ini[i + 1] / 24, clip = seq.importMGT(MOGRT, seg(a).ticks, 1, 0); if (!clip) { r.errores.push("texto " + i); continue; } clip.end = seg(b); clip.outPoint = seg(b - a); clip.name = datos[i].txt;
      var ps = clip.getMGTComponent().properties, pt = ps.getParamForDisplayName("Texto"), j = JSON.parse(pt.getValue()); j.textEditValue = datos[i].txt; j.fontTextRunLength = [datos[i].txt.length]; pt.setValue(JSON.stringify(j), true);
      ps.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(datos[i].tam, true); mov(clip)[0].setValue(datos[i].pos, true); puestos++; }
    r.contador = puestos; for (var t = 2; t < seq.videoTracks.numTracks; t++) { var tg = seq.videoTracks[t]; for (i = 0; i < tg.clips.numItems; i++) if (tg.clips[i].start.seconds < 0.05 && tg.clips[i].end.seconds > 5) tg.clips[i].end = seg(f / 24); }
    r.finVideo = v.clips[n - 1].end.seconds; r.primero = datos[0].txt; r.ultimo = datos[n - 1].txt;
    app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks; seq.setPlayerPosition(String(Math.round(4.0 * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/n13"); seq.setPlayerPosition(p0); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r); })();
