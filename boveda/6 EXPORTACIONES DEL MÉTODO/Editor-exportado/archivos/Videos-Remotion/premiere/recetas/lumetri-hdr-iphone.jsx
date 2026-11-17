// ClienteN guion 16: corrección que baja el brillo del HDR del iPhone al exportar (la misma que aceptó en ClienteE, sin calentar ni saturar: la pared ya es amarilla).
(function () { app.enableQE(); var s = app.project.activeSequence, q = qe.project.getActiveSequence(), n = 0, i, t, k, T = 254016000000; if (s.name !== "CLIENTE-N · GUION 16 · PROPUESTA (proteína)") return "activa: " + s.name;
  s.setPlayerPosition(String(Math.round(8.6 * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/n16/br-antes");
  function lum(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].displayName === "Color de Lumetri") return c.components[x]; return null; }
  var FX = qe.project.getVideoEffectByName("Color de Lumetri"), AJ = { 14: 0, 15: 0, 16: 100, 19: -0.45, 20: 14, 21: -45, 22: 4, 23: -28, 24: -8, 41: 12, 42: 8 };
  for (t = 0; t < s.videoTracks.numTracks; t++) { var tr = s.videoTracks[t], qt = q.getVideoTrackAt(t); for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (!/^IMG_/.test(c.name)) continue;
      if (!lum(c)) for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (qi.type === "Clip" && Math.abs(qi.start.secs - c.start.seconds) < 0.02) { qi.addVideoEffect(FX); break; } }
      var L = lum(c); if (!L) continue; for (var id in AJ) { try { L.properties[+id].setValue(AJ[id], true); } catch (e) {} } n++; } }
  app.project.save(); return "corrección en " + n + " tomas"; })();
