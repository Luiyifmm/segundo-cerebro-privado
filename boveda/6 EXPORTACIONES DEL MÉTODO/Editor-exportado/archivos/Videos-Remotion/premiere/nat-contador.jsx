// Contador de ClienteN: un clip de texto editable por cada corte del vídeo (1,000 → 25,000 y salto a 30,000), con el estilo del título del usuario,
// y corrección de color sencilla en los cortes.
(function () { var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Texto contorno.mogrt", seq = app.project.activeSequence, r = { errores: [] }, i, k, T = 254016000000;
  try {
    if (seq.name !== "CLIENTE-N_1010_01 - como la referencia") return JSON.stringify({ error: seq.name });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
    var v1 = seq.videoTracks[0], cortes = []; for (i = 0; i < v1.clips.numItems; i++) cortes.push([v1.clips[i].start.seconds, v1.clips[i].end.seconds]);
    var tC = seq.videoTracks[1]; if (tC.clips.numItems) return JSON.stringify({ error: "la pista TITULO no esta vacia" });
    // quitar los marcadores de posición "1,000 pasos" del usuario (gráficos nativos sin plantilla) de la pista 4
    var tP = seq.videoTracks[3], quit = 0; for (i = tP.clips.numItems - 1; i >= 0; i--) if (!tP.clips[i].getMGTComponent() && tP.clips[i].name === "Gráfico") { tP.clips[i].remove(false, false); quit++; } r.quitados = quit;
    var n = 0; for (i = 0; i < cortes.length; i++) { var num = i < 25 ? i + 1 : 30, txt = num + ",000 pasos", clip = seq.importMGT(MOGRT, seg(cortes[i][0]).ticks, 1, 0); if (!clip) { r.errores.push("no entra " + i); continue; }
      clip.end = seg(cortes[i][1]); clip.outPoint = seg(cortes[i][1] - cortes[i][0]); clip.name = txt; var ps = clip.getMGTComponent().properties, pt = ps.getParamForDisplayName("Texto"), j = JSON.parse(pt.getValue()); j.textEditValue = txt; j.fontTextRunLength = [txt.length]; pt.setValue(JSON.stringify(j), true);
      ps.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(62, true); mov(clip)[0].setValue([0.5, 0.286], true); n++; }
    r.contador = n; try { seq.videoTracks[1].name = "CONTADOR (texto)"; } catch (e0) {}
    // color
    app.enableQE(); var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Color de Lumetri"), qt = q.getVideoTrackAt(0), VAL = { 14: 5, 20: 10, 21: -10, 23: 4, 24: -5, 16: 108, 42: 8 }, nc = 0;
    function lum(c2) { for (var m = 0; m < c2.components.numItems; m++) if (c2.components[m].matchName.indexOf("Lumetri") >= 0) return c2.components[m]; return null; }
    for (i = 0; i < v1.clips.numItems; i++) { if (!lum(v1.clips[i])) for (k = 0; k < qt.numItems; k++) { var it = qt.getItemAt(k); if (it && it.type === "Clip" && Math.abs(it.start.secs - v1.clips[i].start.seconds) < 0.01) { it.addVideoEffect(fx); break; } } var L = lum(v1.clips[i]); if (!L) { r.errores.push("sin Lumetri " + i); continue; } for (var p in VAL) L.properties[+p].setValue(VAL[p], true); nc++; }
    r.color = nc; var p0 = seq.getPlayerPosition().ticks, ts = [0.1, 2.5, 5.0, 7.0, 7.6, 8.6];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nc-" + i); }
    seq.setPlayerPosition(p0); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r); })();
