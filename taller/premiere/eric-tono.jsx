(function () { var seq = app.project.activeSequence, r = { errores: [] }, i, m, T = 254016000000;
  if (seq.name.indexOf("ERIC_1009_01") !== 0) return JSON.stringify({ error: seq.name });
  try { var st = seq.getSettings(); r.antes = st.autoToneMapEnabled; st.autoToneMapEnabled = true; seq.setSettings(st); r.despues = seq.getSettings().autoToneMapEnabled; } catch (e) { r.errores.push("tono " + e); }
  var d = seq.videoTracks[3].clips[0]; r.deg = d ? d.name + " " + d.start.seconds + "-" + d.end.seconds.toFixed(1) + " habilitado " + (d.disabled ? "no" : "si") : "sin clip";
  if (d) for (m = 0; m < d.components.numItems; m++) { var co = d.components[m], ps = []; for (var k = 0; k < co.properties.numItems && k < 4; k++) ps.push(co.properties[k].displayName + "=" + co.properties[k].getValue()); r["c" + m] = co.displayName + ": " + ps.join(" | "); }
  try { r.pistaVisible = !seq.videoTracks[3].isMuted(); } catch (e2) {}
  app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks; seq.setPlayerPosition(String(Math.round(16.9 * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/eric-t1"); seq.setPlayerPosition(p0);
  app.project.save(); return JSON.stringify(r); })();
