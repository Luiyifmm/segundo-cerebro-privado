// CLIENTE-A_1010_01 en la misma línea de tiempo que el vídeo anterior: coloca las tomas elegidas a partir de 66 s, la voz, los zooms y el mismo color.
(function () { var SEG = [{"src":7.066666666666666,"dur":2.9667,"ini":0},{"src":34.3,"dur":2.1,"ini":2.9667},{"src":52.3,"dur":2.2667,"ini":5.0667},{"src":56.36666666666667,"dur":1.9,"ini":7.3333},{"src":66.16666666666667,"dur":2.9667,"ini":9.2333},{"src":75.9,"dur":4.0333,"ini":12.2},{"src":91.23333333333333,"dur":4.1,"ini":16.2333},{"src":106.76666666666667,"dur":4.3667,"ini":20.3333},{"src":122.66666666666667,"dur":3.1,"ini":24.7},{"src":137.26666666666668,"dur":3.5,"ini":27.8},{"src":158.8,"dur":2.5,"ini":31.3},{"src":178.9,"dur":2.3,"ini":33.8},{"src":186.36666666666667,"dur":3.4667,"ini":36.1},{"src":198.8,"dur":3.6,"ini":39.5667},{"src":206.86666666666667,"dur":3.7,"ini":43.1667},{"src":215.26666666666668,"dur":2.8,"ini":46.8667}], OFF = 66, r = { errores: [] }, seq = app.project.activeSequence, i, k, t;
  try { if (seq.name !== "CLIENTE-A_1009_01 - SONIDO v2") return JSON.stringify({ error: seq.name });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
    function lum(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName.indexOf("Lumetri") >= 0) return c.components[x]; return null; }
    var v1 = seq.videoTracks[0]; for (i = 0; i < v1.clips.numItems; i++) if (v1.clips[i].end.seconds > OFF - 0.01) return JSON.stringify({ error: "V1 ya tiene clips despues de 66 s" });
    // el bruto que puso el usuario se desactiva (no se borra)
    var bruto = null, escala = 100; for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.name.indexOf("IMG_6130") === 0 && c.end.seconds - c.start.seconds > 100) { bruto = c.projectItem; escala = mov(c)[1].getValue(); c.disabled = true; r.brutoV = "V" + (t + 1); } }
    for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) { var ca = seq.audioTracks[t].clips[i]; if (ca.name.indexOf("IMG_6130") === 0 && ca.end.seconds - ca.start.seconds > 100) { ca.disabled = true; r.brutoA = seq.audioTracks[t].name; } }
    if (!bruto) return JSON.stringify({ error: "no encuentro el bruto IMG_6130 en la linea de tiempo" });
    var audioAntes = []; for (t = 0; t < seq.audioTracks.numTracks; t++) audioAntes.push(seq.audioTracks[t].clips.numItems);
    for (i = 0; i < SEG.length; i++) { bruto.setInPoint(SEG[i].src, 4); bruto.setOutPoint(SEG[i].src + SEG[i].dur, 4); v1.overwriteClip(bruto, OFF + SEG[i].ini); }
    try { bruto.clearInPoint(); bruto.clearOutPoint(); } catch (e0) {}
    // audio que haya entrado con el vídeo: se quita (la voz va aparte, centrada)
    r.audioExtra = 0; for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; for (i = ta.clips.numItems - 1; i >= 0; i--) { var x = ta.clips[i]; if (x.name.indexOf("IMG_6130") === 0 && x.start.seconds >= OFF - 0.01 && x.end.seconds - x.start.seconds < 20) { x.remove(false, false); r.audioExtra++; } } }
    // comprobación y ajuste exacto de cada toma, zoom y color
    var ref = null; for (i = 0; i < v1.clips.numItems; i++) if (v1.clips[i].start.seconds < 30 && lum(v1.clips[i])) { ref = lum(v1.clips[i]); break; }
    var IDX = [14, 15, 16, 19, 20, 21, 22, 23, 24, 42], VAL = {}; if (ref) for (k = 0; k < IDX.length; k++) VAL[IDX[k]] = ref.properties[IDX[k]].getValue(); r.color = ref ? "copiado del video anterior" : "sin referencia";
    app.enableQE(); var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Color de Lumetri"), qt = q.getVideoTrackAt(0);
    var Z = [100, 112, 100, 112, 100, 118, 100, 112, 100, 112, 100, 125, 112, 100, 118, 100], FX = 0.475, FY = 0.435, ok = 0;
    for (i = 0; i < SEG.length; i++) { var a = OFF + SEG[i].ini, cl = null; for (k = 0; k < v1.clips.numItems; k++) if (Math.abs(v1.clips[k].start.seconds - a) < 0.02) cl = v1.clips[k]; if (!cl) { r.errores.push("falta toma " + i); continue; }
      if (Math.abs(cl.inPoint.seconds - SEG[i].src) > 0.004) cl.inPoint = seg(SEG[i].src); cl.end = seg(a + SEG[i].dur); cl.outPoint = seg(SEG[i].src + SEG[i].dur);
      if (Math.abs(cl.inPoint.seconds - SEG[i].src) > 0.02 || Math.abs(cl.end.seconds - a - SEG[i].dur) > 0.02) r.errores.push("toma " + i + ": in " + cl.inPoint.seconds.toFixed(2) + " fin " + cl.end.seconds.toFixed(2));
      var pm = mov(cl), s = Z[i] / 100; pm[1].setValue(escala * s, true); pm[0].setValue([FX + (0.5 - FX) * s, FY + (0.5 - FY) * s], true);
      if (ref) { if (!lum(cl)) for (k = 0; k < qt.numItems; k++) { var it = qt.getItemAt(k); if (it && it.type === "Clip" && Math.abs(it.start.secs - a) < 0.01) { it.addVideoEffect(fx); break; } } for (k = 0; k < v1.clips.numItems; k++) if (Math.abs(v1.clips[k].start.seconds - a) < 0.02) cl = v1.clips[k]; var L = lum(cl); if (L) for (var p in VAL) L.properties[+p].setValue(VAL[p], true); else r.errores.push("sin color " + i); }
      ok++; }
    r.tomas = ok; r.escala = escala;
    // voz centrada en una pista libre
    var aV = -1; for (t = 0; t < seq.audioTracks.numTracks; t++) if (seq.audioTracks[t].name === "VOZ 1010") aV = t; if (aV < 0) for (t = seq.audioTracks.numTracks - 1; t >= 0; t--) if (seq.audioTracks[t].clips.numItems === 0) aV = t;
    if (aV < 0) { var n0 = seq.audioTracks.numTracks; q.addTracks(0, 0, 1, 1, n0); aV = n0; } try { seq.audioTracks[aV].name = "VOZ 1010"; } catch (e1) {}
    var bin = app.project.rootItem.createBin("CLIENTE-A_1010_01"); app.project.importFiles(["~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/audio/voz corte.wav"], true, bin, false); var wav = bin.children.numItems ? bin.children[0] : null;
    if (wav) { seq.audioTracks[aV].overwriteClip(wav, OFF); r.voz = seq.audioTracks[aV].name + " " + seq.audioTracks[aV].clips.numItems; } else r.errores.push("sin voz");
    r.fin = seq.end / 254016000000; app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r); })();
