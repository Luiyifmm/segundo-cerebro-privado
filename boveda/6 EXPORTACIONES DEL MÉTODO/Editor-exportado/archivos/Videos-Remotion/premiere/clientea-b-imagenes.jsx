// Opción B: fotos nuevas (imagenes/v2) con la misma animación y miniaturas acumuladas v3. Solo toca la secuencia B.
(function () { app.enableQE(); var r = { hecho: [], errores: [] }, i, t, k, T = 254016000000, C = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/", S = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", B = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "CLIENTE-A_1010_01 - B motion graphics nuevos") B = app.project.sequences[i]; if (!B) return "sin secuencia B";
  app.project.openSequence(B.sequenceID);
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var tt = seg(base + lista[x][0]); p.addKey(tt); p.setValueAtKey(tt, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  function pista(n) { for (var x = 0; x < B.videoTracks.numTracks; x++) if (B.videoTracks[x].name === n) return B.videoTracks[x]; return null; }
  var tI = pista("IMAGENES"), tM = pista("MOTION GRAPHICS"), tN = null; for (t = 0; t < B.videoTracks.numTracks; t++) for (i = 0; i < B.videoTracks[t].clips.numItems; i++) if (/^miniaturas clientea/.test(B.videoTracks[t].clips[i].name) && B.videoTracks[t].clips[i].start.seconds > 66) tN = B.videoTracks[t];
  if (!tI || !tM || !tN) return "faltan pistas";
  // quitar las antiguas (solo en B)
  var nq = 0, L = [tI, tM, tN]; for (t = 0; t < 3; t++) for (i = L[t].clips.numItems - 1; i >= 0; i--) { var c = L[t].clips[i]; if (c.start.seconds > 65.5 && c.start.seconds < 93 && (/^arrow_/.test(c.name) || /^miniaturas clientea/.test(c.name))) { c.remove(false, false); nq++; } } r.hecho.push("clips antiguos quitados en B: " + nq);
  function poner(tr, ruta, a, b) { var it = traer(ruta); if (!it) { r.errores.push("no importa " + ruta); return null; } tr.overwriteClip(it, a); for (var x = 0; x < tr.clips.numItems; x++) if (Math.abs(tr.clips[x].start.seconds - a) < 0.03) { var c = tr.clips[x]; c.end = seg(b); try { c.outPoint = seg(c.inPoint.seconds + (b - a)); } catch (e) {} return c; } r.errores.push("no encuentro el clip puesto en " + a); return null; }
  var PM = [["01 estudiante", 65.9, 68.967, 2.85, 0.14, 0.165], ["03 rebelde", 74.767, 78.867, 2.06, 0.86, 0.165], ["05 prioridad", 83.0, 87.2, 2.95, 0.64, 0.165], ["07 libre", 89.667, 92.4, 2.13, 0.86, 0.275]], PI = [["02 marioneta", 68.933, 75.667, 5.49, 0.36, 0.165], ["04 los demas", 78.733, 83.9, 3.92, 0.14, 0.275], ["06 funcionario", 86.533, 90.567, 2.79, 0.36, 0.275]], G = [[tM, PM], [tI, PI]], ni = 0;
  for (t = 0; t < 2; t++) for (k = 0; k < G[t][1].length; k++) { var p = G[t][1][k], cl = poner(G[t][0], C + "imagenes/v2/clientea v2 " + p[0] + ".jpg", p[1], p[2]); if (!cl) continue; var m = comp(cl, "AE.ADBE Motion"), base = cl.inPoint.seconds;
      claves(m.properties[0], base, [[0, [0.5, 1.22]], [0.3, [0.5, 0.735]], [p[3], [0.5, 0.735]], [p[3] + 0.3, [p[4], p[5]]]]); claves(m.properties[1], base, [[0, 68], [p[3], 68], [p[3] + 0.3, 29]]); ni++; }
  r.hecho.push("fotos nuevas puestas: " + ni);
  var MN = [[1, 68.967, 75.667], [2, 75.667, 78.867], [3, 78.867, 83.9], [4, 83.9, 87.2], [5, 87.2, 90.567], [6, 90.567, 92.4]], nn = 0;
  for (k = 0; k < MN.length; k++) { var cm = poner(tN, C + "miniaturas/v3/miniaturas clientea v3 0" + MN[k][0] + ".png", MN[k][1], MN[k][2]); if (!cm) continue; var mm = comp(cm, "AE.ADBE Motion"); mm.properties[1].setValue(100, true); mm.properties[0].setValue([0.5, 0.5], true); nn++; }
  r.hecho.push("miniaturas v3: " + nn);
  var est = []; for (t = 0; t < 3; t++) for (i = 0; i < L[t].clips.numItems; i++) { var e = L[t].clips[i]; if (e.start.seconds > 65.5 && e.start.seconds < 99) est.push(L[t].name.substr(0, 4) + " " + e.name.substr(0, 26) + " " + e.start.seconds.toFixed(2) + "-" + e.end.seconds.toFixed(2) + (e.disabled ? " OFF" : "")); } r.est = est;
  var q = qe.project.getActiveSequence(), ts = [66.6, 68.0, 72.0, 76.0, 81.0, 85.0, 88.5, 91.2, 92.3]; for (i = 0; i < ts.length; i++) { B.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, S + "bi-" + i); }
  return JSON.stringify(r); })();
