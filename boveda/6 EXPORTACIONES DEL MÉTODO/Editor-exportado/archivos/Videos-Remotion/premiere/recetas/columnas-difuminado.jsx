// v2: barrido lineal con calado en escalera (borde derecho) y elíptica (borde izquierdo); clip a clip, con informe de fallos.
(function () { app.enableQE(); var s = app.project.activeSequence, q = qe.project.getActiveSequence(), r = [], T = 254016000000, i, k, t; if (s.name !== "CLIENTE-E · TRES CARDIOS · v2 SIN LÍNEAS (guion 17)") return "activa: " + s.name;
  var BW = qe.project.getVideoEffectByName("Barrido lineal (heredado)"), PL = { "IMG_1091.MOV": [270, 31.5], "IMG_1093.MOV": [90, 34.35] };
  function bw(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].displayName.indexOf("Barrido") === 0) return c.components[x]; return null; }
  for (t = 0; t < s.videoTracks.numTracks; t++) { var tr = s.videoTracks[t], qt = q.getVideoTrackAt(t); for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], A = PL[c.name]; if (!A) continue;
      try { if (!bw(c)) { for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (qi.type === "Clip" && Math.abs(qi.start.secs - c.start.seconds) < 0.05) { qi.addVideoEffect(BW); break; } } }
        var W = bw(c); W.properties[0].setValue(A[1], true); W.properties[1].setValue(A[0], true); W.properties[2].setValue(180, true); r.push(c.name + "@" + c.start.seconds.toFixed(1) + " ok"); }
      catch (e) { r.push(c.name + "@" + c.start.seconds.toFixed(1) + " FALLO " + e); } } }
  app.project.save();
  try { var F = [2.0, 6.0, 10.0]; for (i = 0; i < F.length; i++) { s.setPlayerPosition(String(Math.round(F[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/e17/ff-" + i); } } catch (e2) { r.push("fotos: " + e2); }
  return r.join(", "); })();
