// NATALIA_1010_01: coloca la botella original (misma secuencia anidada, sin máscara ni incrustación) en la pista libre de encima y desactiva la recortada.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000; if (app.project.name !== "NATALIA EDICION.prproj" || seq.name !== "NATALIA_1010_01 - Reaccion a los pasos") return "proyecto o secuencia inesperados";
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function mot(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x]; return null; }
  var vB = -1, vZ = -1; for (t = 0; t < seq.videoTracks.numTracks; t++) { if (seq.videoTracks[t].name === "BOTELLA") vB = t; if (seq.videoTracks[t].name === "ZONA IDEAL") vZ = t; }
  if (vB < 0 || vZ < 0 || seq.videoTracks[vZ].clips.numItems) return "pistas: botella " + vB + ", libre " + vZ;
  var c = seq.videoTracks[vB].clips[0], m = mot(c), it = c.projectItem, d = { s: c.start.seconds, e: c.end.seconds, inp: c.inPoint.seconds, out: c.outPoint.seconds, pos: m.properties[0].getValue(), esc: m.properties[1].getValue(), rot: m.properties[4].getValue() };
  r.item = it.name + " tipo " + it.type + " sec " + (it.isSequence ? it.isSequence() : "?"); try { r.ruta = it.getMediaPath(); } catch (x) {} r.d = d;
  var audAntes = []; for (t = 0; t < seq.audioTracks.numTracks; t++) audAntes.push(seq.audioTracks[t].clips.numItems);
  it.setInPoint(d.inp, 4); it.setOutPoint(d.out, 4); seq.videoTracks[vZ].overwriteClip(it, d.s); try { it.clearInPoint(4); it.clearOutPoint(4); } catch (x) {}
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; if (ta.clips.numItems > audAntes[t]) for (i = ta.clips.numItems - 1; i >= 0; i--) if (ta.clips[i].name === it.name && Math.abs(ta.clips[i].start.seconds - d.s) < 0.05) { ta.clips[i].remove(false, false); r.hecho.push("audio de la botella quitado"); } }
  var n = seq.videoTracks[vZ].clips[0]; if (!n) return JSON.stringify({ error: "no entro el clip", r: r }); if (Math.abs(n.end.seconds - d.e) > 0.03) n.end = seg(d.e);
  var mn = mot(n); mn.properties[0].setValue(d.pos, true); mn.properties[1].setValue(d.esc, true); mn.properties[4].setValue(d.rot, true); c.disabled = true; r.hecho.push("original en ZONA IDEAL " + n.start.seconds.toFixed(2) + "-" + n.end.seconds.toFixed(2));
  var q = qe.project.getActiveSequence(), ts = [0.1, 5.0, 10.0, 14.8]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/natp-" + i); }
  return JSON.stringify(r); })();
