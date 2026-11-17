// CLIENTE-A_1010_01: rótulos EXITOSO (azul, izquierda) y MEDIOCRE (rojo, derecha), imágenes que entran arriba y se deslizan a su lado, y los dos motion graphics en los marcadores.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], img: [], sfx: [] }, i, k, T = 254016000000;
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  var D = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/", MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteA v8.mogrt";
  function seg(s) { var t = new Time(); t.seconds = s; return t; }
  function db(d) { return Math.pow(10, (d - 15) / 20); }
  function pista(lista, nombre) { for (var x = 0; x < lista.numTracks; x++) if (lista[x].name === nombre) return x; return -1; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function claves(p, base, lista) { p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var t = seg(base + lista[x][0]); p.addKey(t); p.setValueAtKey(t, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  var vImg = pista(seq.videoTracks, "IMAGENES"), vMg = pista(seq.videoTracks, "MOTION GRAPHICS"), vR1 = pista(seq.videoTracks, "Vídeo 4"), vR2 = pista(seq.videoTracks, "SUBTITULOS");
  if (vImg < 0 || vMg < 0 || vR1 < 0 || vR2 < 0) return "faltan pistas " + [vImg, vMg, vR1, vR2].join(",");
  // 1) imágenes: [nombre, lado (1 = mediocre a la derecha, -1 = exitoso a la izquierda), inicio del deslizamiento, fin, ancho, alto]
  var IMG = [["arrow_025507", 1, 68.75, 70.0, 667, 1000], ["arrow_025406", -1, 72.65, 73.9, 800, 533], ["arrow_025633", 1, 81.82, 83.05, 464, 700], ["arrow_025657", -1, 84.23, 86.27, 736, 1104], ["arrow_025914", 1, 90.05, 91.3, 1200, 1200], ["arrow_030014", -1, 93.35, 94.6, 736, 981], ["arrow_030117", 1, 96.72, 97.95, 736, 736], ["arrow_030210", -1, 99.55, 100.6, 612, 816]];
  var YC = 0.215, pistas = [vImg, vMg];
  for (var p2 = 0; p2 < 2; p2++) { var tr = seq.videoTracks[pistas[p2]]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], d = null; for (k = 0; k < IMG.length; k++) if (c.name.indexOf(IMG[k][0]) === 0) d = IMG[k]; if (!d) continue;
    var s = c.start.seconds, fin = Math.max(c.end.seconds, d[3]), des = d[2] - s, dur = fin - s; c.end = seg(fin); c.outPoint = seg(c.inPoint.seconds + dur);
    var m = comp(c, "AE.ADBE Motion"), op = comp(c, "AE.ADBE Opacity"), base = c.inPoint.seconds, esc = Math.min(900 / d[4], 900 / d[5]) * 100, xl = d[1] > 0 ? 0.74 : 0.26;
    if (m.properties[0].isTimeVarying()) { r.errores.push("ya animada " + d[0]); continue; }
    claves(m.properties[0], base, [[0, [0.5, YC - 0.05]], [0.2, [0.5, YC]], [des, [0.5, YC]], [des + 0.3, [xl, YC + 0.005]]]);
    claves(m.properties[1], base, [[0, esc * 0.9], [0.2, esc], [des, esc], [des + 0.3, esc * 0.92]]);
    if (op) claves(op.properties[0], base, [[0, 0], [0.13, 100], [dur - 0.17, 100], [dur - 0.02, 0]]);
    r.img.push([d[0], +s.toFixed(2), +fin.toFixed(2), Math.round(esc)]); } }
  // 2) rótulos
  function rotulo(v, texto, col, x) { var c = seq.importMGT(MOGRT, seg(66).ticks, v, 0); if (!c) { r.errores.push("rotulo " + texto); return; } c.end = seg(100.6); c.outPoint = seg(c.inPoint.seconds + 34.6); var g = c.getMGTComponent();
    for (var x2 = 0; x2 < g.properties.numItems; x2++) { var pr = g.properties[x2], n = pr.displayName; if (n === "Linea" || n === "Palabra clave") { var j = JSON.parse(pr.getValue()); j.textEditValue = n === "Linea" ? " " : texto; pr.setValue(JSON.stringify(j), true); } else if (n === "Color clave") pr.setColorValue(255, col[0], col[1], col[2], true); else if (n === "Alinear a la izquierda") pr.setValue(false, true); else if (n.indexOf("Tamano") === 0) pr.setValue(46, true); else if (n.indexOf("Retraso") === 0) pr.setValue(0, true); }
    var m2 = comp(c, "AE.ADBE Motion"); if (m2) m2.properties[0].setValue([x, -0.09], true); }
  rotulo(vR1, "EXITOSO", [30, 139, 255], 0.26); rotulo(vR2, "MEDIOCRE", [229, 38, 31], 0.74);
  // 3) motion graphics en los marcadores (de derecha a izquierda)
  var mgs = [["motion/MG romper cadenas.mp4", 109.3333, 106 / 30], ["motion/MG escuela a empleado.mp4", 102.2, 101 / 30]], trM = seq.videoTracks[vMg];
  for (i = 0; i < mgs.length; i++) { var it = traer(D + mgs[i][0]), libre = true; if (!it) { r.errores.push("no importa " + mgs[i][0]); continue; } for (k = 0; k < trM.clips.numItems; k++) if (trM.clips[k].start.seconds < mgs[i][1] + mgs[i][2] - 0.02 && trM.clips[k].end.seconds > mgs[i][1] + 0.02) libre = false; if (!libre) { r.errores.push("ocupado MG " + mgs[i][1]); continue; } trM.overwriteClip(it, mgs[i][1]); }
  // 4) sonido
  function sfx(nomPista, ruta, s2, d, dur) { var x = pista(seq.audioTracks, nomPista), it2 = traer(ruta); if (x < 0 || !it2) { r.errores.push("sfx " + ruta); return; } var ta = seq.audioTracks[x]; for (var m3 = 0; m3 < ta.clips.numItems; m3++) if (ta.clips[m3].start.seconds < s2 + (dur || 1.2) && ta.clips[m3].end.seconds > s2) { r.errores.push("ocupado " + nomPista + " " + s2); return; } ta.overwriteClip(it2, s2); for (m3 = 0; m3 < ta.clips.numItems; m3++) if (Math.abs(ta.clips[m3].start.seconds - s2) < 0.02) { var c3 = ta.clips[m3]; if (dur) { c3.end = seg(s2 + dur); c3.outPoint = seg(c3.inPoint.seconds + dur); } var vol = null; for (var y = 0; y < c3.components.numItems; y++) if (c3.components[y].displayName === "Volumen") vol = c3.components[y]; if (vol) vol.properties[1].setValue(db(d), true); r.sfx.push([nomPista, +s2.toFixed(2)]); } }
  var A1 = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1009_01/sfx/";
  sfx("SFX CAPAS", A1 + "impacto en capas.wav", 110.78 - 0.333, -9, 0); sfx("SFX MOTION", "riseer 1.MP3", 110.78 - 1.787, -8, 1.8); sfx("SFX CAPAS", A1 + "golpe en capas.wav", 104.35 - 0.05, -9, 0); sfx("SFX MOTION", A1 + "whoosh en capas.wav", 102.2 - 0.6, -11, 0);
  for (i = IMG.length - 1; i >= 0; i--) sfx("SFX IMAGENES", D + "sfx/whoosh " + (IMG[i][1] > 0 ? "derecha" : "izquierda") + ".wav", IMG[i][2] - 0.25, -12, 0);
  var q = qe.project.getActiveSequence(), ts = [67.5, 69.5, 78, 84.6, 91, 100.2, 102.8, 105.2, 110.2, 111.6]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v2b-" + i); }
  return JSON.stringify(r); })();
