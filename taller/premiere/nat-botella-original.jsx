// NATALIA_1010_01: prueba con la botella original (sin incrustación). Guarda antes una copia de la secuencia con la versión recortada.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000; if (app.project.name !== "NATALIA EDICION.prproj" || seq.name !== "NATALIA_1010_01 - Reaccion a los pasos") return "proyecto o secuencia inesperados";
  var nS = app.project.sequences.numSequences; try { seq.clone(); } catch (x) { r.errores.push("sin copia " + x); } r.hecho.push("copias nuevas: " + (app.project.sequences.numSequences - nS));
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "NATALIA_1010_01 - Reaccion a los pasos") app.project.openSequence(app.project.sequences[i].sequenceID); seq = app.project.activeSequence; if (seq.name !== "NATALIA_1010_01 - Reaccion a los pasos") return "quedo activa otra secuencia: " + seq.name;
  var vB = -1, vF = -1; for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.name === "Botella") vB = t; if (/^fondo botella/.test(c.name)) vF = t; }
  if (vB < 0) return "no encuentro la botella";
  var qt = qe.project.getActiveSequence().getVideoTrackAt(vB), quit = 0; for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (!qi || qi.type !== "Clip") continue; for (var n = qi.numComponents - 1; n >= 0; n--) { var cp = qi.getComponentAt(n); if (cp && /ultra/i.test(cp.name)) { try { cp.remove(); quit++; } catch (x) { r.errores.push("no se quita: " + x); } } } }
  r.hecho.push("incrustaciones quitadas: " + quit);
  if (vF >= 0) for (i = 0; i < seq.videoTracks[vF].clips.numItems; i++) if (/^fondo botella/.test(seq.videoTracks[vF].clips[i].name)) seq.videoTracks[vF].clips[i].disabled = true;
  var cb = seq.videoTracks[vB].clips[0], l = []; for (k = 0; k < cb.components.numItems; k++) l.push(cb.components[k].displayName); r.comps = l.join(", ");
  var q = qe.project.getActiveSequence(), ts = [0.1, 5.0, 10.0, 14.8]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nato-" + i); }
  return JSON.stringify(r); })();
