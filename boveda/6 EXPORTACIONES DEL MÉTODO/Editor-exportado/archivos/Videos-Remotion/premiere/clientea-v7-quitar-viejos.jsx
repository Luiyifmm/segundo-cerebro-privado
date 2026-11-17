// CLIENTE-A_1010_01: quita los subtítulos antiguos (v8) de 65,9 s en adelante solo si en "Vídeo 10" hay el mismo número de subtítulos nuevos (v10).
(function () { app.enableQE(); var seq = app.project.activeSequence, T = 254016000000, nuevos = 0, viejos = [], trV = null, i, t;
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t], n = 0; for (i = 0; i < tr.clips.numItems; i++) if (tr.clips[i].getMGTComponent() && tr.clips[i].start.seconds >= 65.9) n++; if (tr.name === "Vídeo 10") nuevos = n; else if (tr.name === "Vídeo 7") { trV = tr; viejos = n; } }
  if (!trV || nuevos === 0 || nuevos !== viejos) return "no coincide: nuevos " + nuevos + " viejos " + viejos;
  var q = 0; for (i = trV.clips.numItems - 1; i >= 0; i--) if (trV.clips[i].getMGTComponent() && trV.clips[i].start.seconds >= 65.9) { trV.clips[i].remove(false, false); q++; }
  var qs = qe.project.getActiveSequence(), ts = [68.6, 73.2, 81.9, 85.3, 93.5, 104.9, 108.2, 111.4, 115.3]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v8-" + i); }
  return "quitados " + q + ", quedan " + nuevos + " en Vídeo 10"; })();
