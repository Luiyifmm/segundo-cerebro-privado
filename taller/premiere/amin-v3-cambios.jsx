// AMIN_1010_01: MEDIOCRE a la izquierda y EXITOSO a la derecha, imágenes recortadas y más grandes, línea azul de separación, glow en los rótulos y motion graphics nuevos.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], img: 0, rot: 0, glow: [], sfx: 0, linea: "" }, i, k, T = 254016000000;
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  var D = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1010_01/", q = qe.project.getActiveSequence();
  function seg(s) { var t = new Time(); t.seconds = s; return t; }
  function db(d) { return Math.pow(10, (d - 15) / 20); }
  function pista(lista, nombre) { for (var x = 0; x < lista.numTracks; x++) if (lista[x].name === nombre) return x; return -1; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var t = seg(base + lista[x][0]); p.addKey(t); p.setValueAtKey(t, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  function libre(tr, a, b) { for (var x = 0; x < tr.clips.numItems; x++) if (tr.clips[x].start.seconds < b - 0.02 && tr.clips[x].end.seconds > a + 0.02) return false; return true; }
  // 1) imágenes: [nombre, lado (-1 = mediocre a la izquierda, 1 = exitoso a la derecha), deslizamiento, ancho, alto, recorte izq, arriba, der, abajo en %]
  var IMG = [["arrow_025507", -1, 68.75, 667, 1000, 2, 8, 2, 28], ["arrow_025406", 1, 72.65, 800, 533, 25, 0, 8, 0], ["arrow_025633", -1, 81.82, 464, 700, 0, 2, 0, 10], ["arrow_025657", 1, 84.23, 736, 1104, 0, 0, 0, 28], ["arrow_025914", -1, 90.05, 1200, 1200, 15, 12, 10, 12], ["arrow_030014", 1, 93.35, 736, 981, 15, 20, 0, 8], ["arrow_030117", -1, 96.72, 736, 736, 30, 30, 0, 0], ["arrow_030210", 1, 99.55, 612, 816, 10, 22, 10, 15]];
  for (var t2 = 0; t2 < seq.videoTracks.numTracks; t2++) { var tr = seq.videoTracks[t2]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], g = c.getMGTComponent();
    if (g && c.start.seconds > 65.9) { var txt = ""; for (k = 0; k < g.properties.numItems; k++) if (g.properties[k].displayName === "Palabra clave") { try { txt = JSON.parse(g.properties[k].getValue()).textEditValue; } catch (e) {} }
      if (txt === "EXITOSO" || txt === "MEDIOCRE") { comp(c, "AE.ADBE Motion").properties[0].setValue([txt === "EXITOSO" ? 0.75 : 0.25, -0.085], true); r.rot++;
        var ya = false; for (k = 0; k < c.components.numItems; k++) if (c.components[k].displayName === "Resplandor alfa") ya = true;
        if (!ya) { var qt = q.getVideoTrackAt(t2), fx = qe.project.getVideoEffectByName("Resplandor alfa"); for (k = 0; k < qt.numItems; k++) { var qi = qt.getItemAt(k); if (qi && qi.type === "Clip" && Math.abs(qi.start.secs - c.start.seconds) < 0.02) qi.addVideoEffect(fx); } }
        for (k = 0; k < c.components.numItems; k++) if (c.components[k].displayName === "Resplandor alfa") { var ge = c.components[k], l = []; for (var p3 = 0; p3 < ge.properties.numItems; p3++) { var v = ""; try { v = String(ge.properties[p3].getValue()); } catch (e) {} l.push(p3 + ":" + ge.properties[p3].displayName + "=" + v); } r.glow.push([txt, l]); } } continue; }
    var d = null; for (k = 0; k < IMG.length; k++) if (c.name.indexOf(IMG[k][0]) === 0) d = IMG[k]; if (!d || c.start.seconds < 65) continue;
    var m = comp(c, "AE.ADBE Motion"), base = c.inPoint.seconds, des = d[2] - c.start.seconds, vw = d[3] * (100 - d[5] - d[7]) / 100, vh = d[4] * (100 - d[6] - d[8]) / 100, e1 = Math.min(800 / vw, 900 / vh) * 100, e2 = Math.min(560 / vw, 640 / vh) * 100;
    for (k = 0; k < 4; k++) m.properties[7 + k].setValue(d[5 + k], true);
    function pos(cx, cy, e) { return [cx - (d[5] - d[7]) / 200 * d[3] * e / 100 / 2160, cy - (d[6] - d[8]) / 200 * d[4] * e / 100 / 3840]; }
    claves(m.properties[0], base, [[0, pos(0.5, 0.17, e1 * 0.9)], [0.2, pos(0.5, 0.22, e1)], [des, pos(0.5, 0.22, e1)], [des + 0.3, pos(d[1] > 0 ? 0.8 : 0.2, 0.19, e2)]]);
    claves(m.properties[1], base, [[0, e1 * 0.9], [0.2, e1], [des, e1], [des + 0.3, e2]]); r.img++; } }
  // 2) línea azul: pista nueva debajo de las imágenes si se puede; si no, corta y arriba
  var itL = traer(D + "motion/linea azul.png"), vI = pista(seq.videoTracks, "IMAGENES"), nAntes = seq.videoTracks.numTracks, vL = pista(seq.videoTracks, "LINEA");
  if (vL < 0) { try { q.addTracks(1, 1, 0); } catch (e) { r.errores.push("addTracks " + e); } seq = app.project.activeSequence; var vI2 = pista(seq.videoTracks, "IMAGENES"); if (seq.videoTracks.numTracks === nAntes + 1 && vI2 === vI + 1 && seq.videoTracks[vI].clips.numItems === 0) { vL = vI; try { seq.videoTracks[vL].name = "LINEA"; } catch (e) {} } }
  var abajo = vL >= 0; if (!abajo) { for (k = seq.videoTracks.numTracks - 1; k >= 0; k--) if (libre(seq.videoTracks[k], 66, 100.6)) { vL = k; break; } }
  r.linea = (abajo ? "debajo de las imagenes, pista " : "arriba, pista ") + vL + " de " + seq.videoTracks.numTracks;
  if (itL && vL >= 0 && libre(seq.videoTracks[vL], 66, 100.6)) { seq.videoTracks[vL].overwriteClip(itL, 66); for (k = 0; k < seq.videoTracks[vL].clips.numItems; k++) { var cl = seq.videoTracks[vL].clips[k]; if (Math.abs(cl.start.seconds - 66) < 0.02) { cl.end = seg(100.6); cl.outPoint = seg(cl.inPoint.seconds + 34.6); var ml = comp(cl, "AE.ADBE Motion"); ml.properties[1].setValue(100, true); if (!abajo) ml.properties[10].setValue(71, true); r.lineaEsc = ml.properties[1].getValue(); } } } else r.errores.push("linea sin sitio");
  // 3) motion graphics: cadenas nueva en su sitio y escuela sin emojis encima de la de emojis
  var vMg = pista(seq.videoTracks, "MOTION GRAPHICS"), v4 = pista(seq.videoTracks, "Vídeo 4"), itC = traer(D + "motion/MG romper cadenas v2.mp4"), itE = traer(D + "motion/MG escuela a empleado (sin emojis).mp4");
  if (itC && vMg >= 0) seq.videoTracks[vMg].overwriteClip(itC, 109.3333); else r.errores.push("cadenas");
  if (itE && v4 >= 0 && libre(seq.videoTracks[v4], 102.2, 105.57)) seq.videoTracks[v4].overwriteClip(itE, 102.2); else r.errores.push("escuela sin emojis: pista ocupada");
  // 4) whoosh hacia el lado nuevo
  var aI = pista(seq.audioTracks, "SFX IMAGENES"); if (aI >= 0) { var ta = seq.audioTracks[aI]; for (i = ta.clips.numItems - 1; i >= 0; i--) if (ta.clips[i].start.seconds > 66 && ta.clips[i].start.seconds < 101 && ta.clips[i].name.indexOf("whoosh ") === 0) ta.clips[i].remove(false, false);
    for (i = IMG.length - 1; i >= 0; i--) { var s2 = IMG[i][2] - 0.25, itW = traer(D + "sfx/whoosh " + (IMG[i][1] > 0 ? "derecha" : "izquierda") + ".wav"); ta.overwriteClip(itW, s2); for (k = 0; k < ta.clips.numItems; k++) if (Math.abs(ta.clips[k].start.seconds - s2) < 0.02) for (var y = 0; y < ta.clips[k].components.numItems; y++) if (ta.clips[k].components[y].displayName === "Volumen") { ta.clips[k].components[y].properties[1].setValue(db(-12), true); r.sfx++; } } }
  r.pistas = []; for (k = 0; k < seq.videoTracks.numTracks; k++) r.pistas.push(k + ":" + seq.videoTracks[k].name + ":" + seq.videoTracks[k].clips.numItems);
  return JSON.stringify(r); })();
