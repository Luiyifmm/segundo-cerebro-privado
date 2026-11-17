// CLIENTE-A_1010_01 tras los recortes del usuario (quitó arrow_025406, 2ª imagen, EXITOSO): huecos de EXITOSO sin agujero,
// miniaturas acumuladas nuevas (7 imágenes), música continua con fundidos y whoosh huérfano desactivado.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { hecho: [], errores: [] }, i, k, t, T = 254016000000, D = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/miniaturas/v2/", S = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/";
  if (app.project.name !== "CLIENTE-A EDICION.prproj" || seq.name.indexOf("SONIDO v2") < 0) return "proyecto o secuencia inesperados";
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var tt = seg(base + lista[x][0]); p.addKey(tt); p.setValueAtKey(tt, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  var NUEVO = { "arrow_025657_101026.png": [0.86, 0.1797], "arrow_030014_101026.png": [0.6295, 0.1587], "arrow_030210_101026.png": [0.86, 0.2708] }, n = 0;
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.start.seconds < 65.5 || !NUEVO[c.name]) continue; var m = comp(c, "AE.ADBE Motion"), P = m.properties[0], E = m.properties[1], ks = P.getKeys(), base = c.inPoint.seconds;
      if (c.name === "arrow_030210_101026.png") { var v0 = [], e0 = [], ke = E.getKeys(), a; for (a = 0; a < ks.length; a++) v0.push(P.getValueAtKey(ks[a])); for (a = 0; a < ke.length; a++) e0.push(E.getValueAtKey(ke[a]));
        claves(P, base, [[0, v0[0]], [0.3, v0[1]], [2.13, v0[2]], [2.43, NUEVO[c.name]]]); claves(E, base, [[0, e0[0]], [2.13, e0[1]], [2.43, e0[2]]]); }
      else P.setValueAtKey(ks[ks.length - 1], NUEVO[c.name], true);
      n++; } } r.hecho.push("destinos EXITOSO cambiados: " + n);
  // miniaturas: mismos clips, medio nuevo
  var hechoIt = {}, nm = 0; for (t = 0; t < seq.videoTracks.numTracks; t++) { var tv = seq.videoTracks[t]; for (i = 0; i < tv.clips.numItems; i++) { var cm = tv.clips[i], mt = /^miniaturas clientea (\d\d)\.png$/.exec(cm.name); if (!mt || cm.start.seconds < 65.5) continue; var num = parseInt(mt[1], 10) - 1, it = cm.projectItem;
      if (!hechoIt[cm.name]) { var np = D + "miniaturas clientea v2 0" + num + ".png"; if (!it.canChangeMediaPath()) { r.errores.push("no se puede cambiar " + cm.name); continue; } it.changeMediaPath(np, true); hechoIt[cm.name] = "miniaturas clientea v2 0" + num + ".png"; }
      nm++; } }
  r.hecho.push("clips de miniatura repuntados: " + nm);
  // primera miniatura desde que termina el clip de la imagen 1
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tw = seq.videoTracks[t]; for (i = 0; i < tw.clips.numItems; i++) { var c1 = tw.clips[i]; if (/^miniaturas clientea 02/.test(c1.name) && Math.abs(c1.start.seconds - 69.467) < 0.05) { c1.start = seg(68.967); r.hecho.push("primera miniatura: " + c1.start.seconds.toFixed(3) + "-" + c1.end.seconds.toFixed(3)); } } }
  // audio
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; for (i = 0; i < ta.clips.numItems; i++) { var ca = ta.clips[i];
      if (/^whoosh derecha/.test(ca.name) && ca.start.seconds > 72.3 && ca.start.seconds < 73.4) { ca.disabled = true; r.hecho.push("whoosh desactivado " + ca.start.seconds.toFixed(2)); }
      if (/^whoosh derecha/.test(ca.name) && Math.abs(ca.start.seconds - 91.9) < 0.05) { ca.move(seg(-0.35)); r.hecho.push("whoosh final adelantado"); } } }
  return JSON.stringify(r); })();
