// NATALIA_1010_01 (como la referencia): correcciones de Natalia del 10-10-2026.
// Letra deportiva en título y contador, contador rojo / verde / rojo, música enérgica, sonidos de acierto (7.000) y peligro (21.000), imagen más nítida y con más contraste.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000;
  if (seq.name !== "NATALIA_1010_01 - como la referencia") return "secuencia inesperada: " + seq.name;
  var D = "/Users/luiyi/Videos-Remotion/clientes/natalia/NATALIA_1010_01/audio/", MOGRT = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Texto Natalia deportivo v1.mogrt", ROJO = [255, 45, 45], VERDE = [34, 181, 115], BLANCO = [255, 255, 255];
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function db(d) { return Math.pow(10, (d - 15) / 20); }
  function vp(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return x; return -1; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function texto(v, s, e, txt, col, tam, y) { var c = seq.importMGT(MOGRT, seg(s).ticks, v, 0); if (!c) { r.errores.push("texto " + txt); return null; } c.end = seg(e); c.outPoint = seg(c.inPoint.seconds + (e - s)); var g = c.getMGTComponent(); for (var x = 0; x < g.properties.numItems; x++) { var p = g.properties[x], n = p.displayName; if (n === "Texto") { var j = JSON.parse(p.getValue()); j.textEditValue = txt; p.setValue(JSON.stringify(j), true); } else if (n === "Color") p.setColorValue(255, col[0], col[1], col[2], true); else if (n.indexOf("Tamano") === 0) p.setValue(tam, true); } comp(c, "AE.ADBE Motion").properties[0].setValue([0.5, y], true); c.name = txt.replace(/\r/g, " "); return c; }
  // 1) imagen
  var vR = vp("REACCION"), nL = 0; for (i = 0; vR >= 0 && i < seq.videoTracks[vR].clips.numItems; i++) { var cl = seq.videoTracks[vR].clips[i]; for (k = 0; k < cl.components.numItems; k++) if (cl.components[k].displayName === "Color de Lumetri") { var L = cl.components[k].properties, vals = { 16: 112, 19: 0.18, 20: 22, 21: -16, 22: 8, 23: 8, 24: -12, 41: 38, 42: 14 }; for (var ix in vals) { try { L[+ix].setValue(vals[ix], true); } catch (x) { r.errores.push("lumetri " + ix); } } nL++; } } r.hecho.push("lumetri en " + nL + " clips");
  // 2) contador con la letra nueva y colores por tramo
  var vC = vp("CONTADOR (texto)"), lista = []; if (vC < 0) return "sin pista de contador"; var trC = seq.videoTracks[vC];
  for (i = 0; i < trC.clips.numItems; i++) { var c0 = trC.clips[i], g0 = c0.getMGTComponent(); if (!g0) continue; var tx = ""; for (k = 0; k < g0.properties.numItems; k++) if (g0.properties[k].displayName === "Texto") { try { tx = JSON.parse(g0.properties[k].getValue()).textEditValue; } catch (x) {} } lista.push({ s: c0.start.seconds, e: c0.end.seconds, t: tx }); }
  if (lista.length !== 30) return "contador inesperado: " + lista.length;
  for (i = trC.clips.numItems - 1; i >= 0; i--) trC.clips[i].remove(false, false);
  lista.sort(function (a, b) { return a.s - b.s; });
  for (i = 0; i < lista.length; i++) { var num = parseInt(lista[i].t.replace(/[^0-9]/g, ""), 10), col = (num >= 7000 && num <= 20000) ? VERDE : ROJO; texto(vC, lista[i].s, lista[i].e, lista[i].t.toUpperCase(), col, 66, 0.292); }
  r.hecho.push("contador " + trC.clips.numItems);
  // 3) título con la letra nueva (el gráfico anterior queda desactivado, no borrado)
  var vT = vp("MORALEJA"), vG = vp("CONTADOR"); if (vG >= 0) for (i = 0; i < seq.videoTracks[vG].clips.numItems; i++) seq.videoTracks[vG].clips[i].disabled = true;
  if (vT >= 0 && seq.videoTracks[vT].clips.numItems === 0) { texto(vT, 0, seq.end / T, "MI REACCIÓN A TUS\rPASOS DIARIOS", BLANCO, 50, 0.168); r.hecho.push("titulo"); } else r.errores.push("pista de titulo ocupada");
  // 4) sonido
  var q = qe.project.getActiveSequence(), nA = seq.audioTracks.numTracks, nV = seq.videoTracks.numTracks; if (nA < 3) { try { q.addTracks(0, 0, 2, 1, nA); } catch (x) { r.errores.push("addTracks " + x); } seq = app.project.activeSequence; }
  r.pistas = "audio " + nA + " -> " + seq.audioTracks.numTracks + ", video " + nV + " -> " + seq.videoTracks.numTracks;
  function audio(ix, ruta, s, d, fin) { if (ix >= seq.audioTracks.numTracks) { r.errores.push("sin pista " + ix); return; } var ta = seq.audioTracks[ix], it = traer(ruta); if (!it) { r.errores.push("no importa " + ruta); return; } ta.overwriteClip(it, s); for (var m = 0; m < ta.clips.numItems; m++) if (Math.abs(ta.clips[m].start.seconds - s) < 0.02) { var c3 = ta.clips[m]; if (fin && c3.end.seconds > fin) { c3.end = seg(fin); c3.outPoint = seg(c3.inPoint.seconds + (fin - s)); } for (var y = 0; y < c3.components.numItems; y++) if (c3.components[y].displayName === "Volumen") c3.components[y].properties[1].setValue(db(d), true); r.hecho.push(c3.name.substr(0, 20) + " " + s); } }
  if (seq.audioTracks.numTracks >= 3) { for (i = 0; i < seq.audioTracks[0].clips.numItems; i++) if (/Chopin/.test(seq.audioTracks[0].clips[i].name)) seq.audioTracks[0].clips[i].disabled = true;
    audio(1, D + "musica energica (Low Mileage - Hold You, NCS).wav", 0, -9, seq.end / T); audio(2, D + "sfx peligro.wav", 8.6667 - 0.03, -3, 0); audio(2, D + "sfx acierto.wav", 2.625 - 0.03, -3, 0); try { seq.audioTracks[1].name = "MUSICA"; seq.audioTracks[2].name = "SFX"; } catch (x) {} }
  var ts = [0.2, 2.3, 2.8, 5.0, 8.0, 9.0, 11.0, 13.5]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/natc-" + i); }
  return JSON.stringify(r); })();
