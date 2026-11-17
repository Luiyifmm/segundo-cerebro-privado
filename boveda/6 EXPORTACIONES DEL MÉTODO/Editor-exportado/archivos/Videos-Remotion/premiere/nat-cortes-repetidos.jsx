// CLIENTE-N_1010_01 (Reaccion a los pasos): la reacción continua se cambia por los 30 cortes repetidos que hizo el usuario en "como la referencia"
// (mismos puntos de entrada, duración y encuadre), con el contador 1.000–30.000 reconstruido sobre esos cortes y los sonidos recolocados.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000, ref = null;
  if (seq.name !== "CLIENTE-N_1010_01 - Reaccion a los pasos") return "secuencia inesperada: " + seq.name;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "CLIENTE-N_1010_01 - como la referencia") ref = app.project.sequences[i]; if (!ref) return "no encuentro la referencia";
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Texto ClienteN deportivo v1.mogrt", ROJO = [255, 45, 45], VERDE = [0, 255, 4];
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function vp(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return x; return -1; }
  function mot(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x]; return null; }
  // cortes del usuario
  var cortes = [], trR = ref.videoTracks[0]; for (i = 0; i < trR.clips.numItems; i++) { var c = trR.clips[i], m = mot(c); cortes.push({ s: c.start.seconds, e: c.end.seconds, inp: c.inPoint.seconds, out: c.outPoint.seconds, it: c.projectItem, pos: m.properties[0].getValue(), esc: m.properties[1].getValue(), rot: m.properties[4].getValue() }); }
  if (cortes.length !== 30) return "cortes inesperados: " + cortes.length; var FIN = cortes[29].e;
  var vR = vp("REACCION"), vC = vp("CONTADOR"), vT = vp("TITULO"), vB = vp("BOTELLA"); if (vR < 0 || vC < 0) return "faltan pistas";
  // datos del contador actual (posición y tamaño que dejó el usuario)
  var c0 = seq.videoTracks[vC].clips[0], posC = mot(c0).properties[0].getValue(), tamC = 42, g0 = c0.getMGTComponent(); for (k = 0; k < g0.properties.numItems; k++) if (g0.properties[k].displayName.indexOf("Tamano") === 0) tamC = g0.properties[k].getValue();
  // 1) vídeo: fuera la reacción continua, dentro los cortes
  var trV = seq.videoTracks[vR]; for (i = trV.clips.numItems - 1; i >= 0; i--) trV.clips[i].remove(false, false);
  var audAntes = []; for (t = 0; t < seq.audioTracks.numTracks; t++) audAntes.push(seq.audioTracks[t].clips.numItems);
  for (i = 0; i < 30; i++) { var K = cortes[i]; K.it.setInPoint(K.inp, 4); K.it.setOutPoint(K.out, 4); trV.overwriteClip(K.it, K.s); }
  cortes[0].it.clearInPoint && cortes[0].it.clearInPoint(4); cortes[0].it.clearOutPoint && cortes[0].it.clearOutPoint(4);
  // quitar el audio de cámara que entra con los cortes
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; if (ta.clips.numItems > audAntes[t]) for (i = ta.clips.numItems - 1; i >= 0; i--) if (ta.clips[i].name === cortes[0].it.name) ta.clips[i].remove(false, false); }
  var fx = qe.project.getVideoEffectByName("Color de Lumetri"), qt = qe.project.getActiveSequence().getVideoTrackAt(vR); for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (qi && qi.type === "Clip") qi.addVideoEffect(fx); }
  var vals = { 14: 5, 16: 112, 19: 0.18, 20: 22, 21: -16, 22: 8, 23: 8, 24: -12, 41: 38, 42: 14 }, nV = 0;
  for (i = 0; i < trV.clips.numItems; i++) { var cv = trV.clips[i], best = null; for (k = 0; k < 30; k++) if (Math.abs(cortes[k].s - cv.start.seconds) < 0.03) best = cortes[k]; if (!best) { r.errores.push("corte sin pareja " + cv.start.seconds.toFixed(2)); continue; } if (Math.abs(cv.end.seconds - best.e) > 0.03) { cv.end = seg(best.e); } var mv = mot(cv); mv.properties[0].setValue(best.pos, true); mv.properties[1].setValue(best.esc, true); mv.properties[4].setValue(best.rot, true); for (k = 0; k < cv.components.numItems; k++) if (cv.components[k].displayName === "Color de Lumetri") { for (var ix in vals) { try { cv.components[k].properties[+ix].setValue(vals[ix], true); } catch (x) {} } } nV++; }
  r.hecho.push("cortes " + trV.clips.numItems + " (ajustados " + nV + ")");
  // 2) contador sobre los cortes
  var trC = seq.videoTracks[vC]; for (i = trC.clips.numItems - 1; i >= 0; i--) trC.clips[i].remove(false, false);
  for (i = 0; i < 30; i++) { var num = (i + 1) * 1000, txt = (num >= 10000 ? String(num).substr(0, 2) + "." + String(num).substr(2) : String(num).substr(0, 1) + "." + String(num).substr(1)) + " PASOS", col = (num >= 7000 && num <= 20000) ? VERDE : ROJO, nc = seq.importMGT(MOGRT, seg(cortes[i].s).ticks, vC, 0); if (!nc) { r.errores.push("contador " + txt); continue; } nc.end = seg(cortes[i].e); nc.outPoint = seg(nc.inPoint.seconds + (cortes[i].e - cortes[i].s)); var g = nc.getMGTComponent(); for (k = 0; k < g.properties.numItems; k++) { var p = g.properties[k], n = p.displayName; if (n === "Texto") { var j = JSON.parse(p.getValue()); j.textEditValue = txt; p.setValue(JSON.stringify(j), true); } else if (n === "Color") p.setColorValue(255, col[0], col[1], col[2], true); else if (n.indexOf("Tamano") === 0) p.setValue(tamC, true); } mot(nc).properties[0].setValue(posC, true); nc.name = txt; }
  r.hecho.push("contador " + trC.clips.numItems);
  // 3) título y botella (fuera de cuadro) hasta el final nuevo
  function hasta(v) { if (v < 0) return; var tr = seq.videoTracks[v]; for (var a = 0; a < tr.clips.numItems; a++) { var cc = tr.clips[a]; if (Math.abs(cc.end.seconds - FIN) > 0.02 && cc.start.seconds < FIN) { var d = FIN - cc.start.seconds; cc.end = seg(FIN); cc.outPoint = seg(cc.inPoint.seconds + d); } } } hasta(vT); hasta(vB);
  // 4) sonidos a su sitio nuevo
  function mover(nombre, a) { for (var t2 = 0; t2 < seq.audioTracks.numTracks; t2++) for (var b = 0; b < seq.audioTracks[t2].clips.numItems; b++) { var ca = seq.audioTracks[t2].clips[b]; if (ca.name === nombre) { var dl = a - ca.start.seconds; if (Math.abs(dl) > 0.01) ca.move(seg(dl)); r.hecho.push(nombre.substr(0, 14) + " -> " + a.toFixed(2)); return; } } r.errores.push("no esta " + nombre); }
  mover("sfx acierto.wav", cortes[6].s - 0.03); mover("sfx peligro.wav", cortes[20].s - 0.03); mover("riseer 1.MP3", cortes[29].s - 1.79); mover("Deep Bass Hit 1.wav", cortes[29].s - 0.25);
  seq = app.project.activeSequence; r.fin = (seq.end / T).toFixed(2);
  var q = qe.project.getActiveSequence(), ts = [0.2, 2.0, 2.8, 6.0, 9.0, 11.5, 13.5]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nati-" + i); }
  return JSON.stringify(r); })();
