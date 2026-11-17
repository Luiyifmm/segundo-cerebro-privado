// NATALIA_1010_01: el fondo expandido de la botella pasa a ser una copia del mismo clip, estirada a lo ancho y desenfocada, detrás de la botella original.
// Así el fondo sigue la luz y el movimiento del clip (una imagen fija se despegaba al final).
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000; if (app.project.name !== "NATALIA EDICION.prproj" || seq.name !== "NATALIA_1010_01 - Reaccion a los pasos") return "proyecto o secuencia inesperados";
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function mot(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x]; return null; }
  var vZ = -1, vF = -1; for (t = 0; t < seq.videoTracks.numTracks; t++) { if (seq.videoTracks[t].name === "ZONA IDEAL") vZ = t; if (seq.videoTracks[t].name === "REACCION") vF = t; }
  if (vZ < 0 || vF < 0 || !seq.videoTracks[vZ].clips.numItems) return "faltan pistas";
  var b = seq.videoTracks[vZ].clips[0], mb = mot(b), it = b.projectItem, d = { s: b.start.seconds, e: b.end.seconds, inp: b.inPoint.seconds, out: b.outPoint.seconds, pos: mb.properties[0].getValue(), esc: mb.properties[1].getValue(), rot: mb.properties[4].getValue() };
  var trF = seq.videoTracks[vF]; for (i = trF.clips.numItems - 1; i >= 0; i--) trF.clips[i].remove(false, false);
  var audAntes = []; for (t = 0; t < seq.audioTracks.numTracks; t++) audAntes.push(seq.audioTracks[t].clips.numItems);
  it.setInPoint(d.inp, 4); it.setOutPoint(d.out, 4); trF.overwriteClip(it, d.s); try { it.clearInPoint(4); it.clearOutPoint(4); } catch (x) {}
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; if (ta.clips.numItems > audAntes[t]) for (i = ta.clips.numItems - 1; i >= 0; i--) if (ta.clips[i].name === it.name && Math.abs(ta.clips[i].start.seconds - d.s) < 0.05) ta.clips[i].remove(false, false); }
  var f = trF.clips[0]; if (!f) return "no entro la copia"; if (Math.abs(f.end.seconds - d.e) > 0.03) f.end = seg(d.e);
  var mf = mot(f); mf.properties[3].setValue(false, true); mf.properties[1].setValue(d.esc * 2160 / 1512 * 1.02, true); mf.properties[2].setValue(d.esc, true); mf.properties[0].setValue([0.5, d.pos[1]], true); mf.properties[4].setValue(d.rot, true);
  var q = qe.project.getActiveSequence(), qt = q.getVideoTrackAt(vF), fxR = qe.project.getVideoEffectByName("Recortar"), fxD = qe.project.getVideoEffectByName("Desenfoque gaussiano"); for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (qi && qi.type === "Clip") { qi.addVideoEffect(fxD); qi.addVideoEffect(fxR); } }
  for (k = 0; k < f.components.numItems; k++) { var cm = f.components[k]; if (cm.displayName === "Recortar") cm.properties[2].setValue(6.8, true); if (cm.displayName === "Desenfoque gaussiano") { var nm = []; for (var j = 0; j < cm.properties.numItems; j++) { nm.push(j + ":" + cm.properties[j].displayName); if (/^Desenfoque$/i.test(cm.properties[j].displayName)) cm.properties[j].setValue(28, true); if (/repet/i.test(cm.properties[j].displayName)) cm.properties[j].setValue(true, true); } r.desenfoque = nm.join("|"); } }
  r.hecho.push("copia estirada en " + trF.name);
  var ts = [0.1, 5.0, 10.0, 14.8]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nats-" + i); }
  return JSON.stringify(r); })();
