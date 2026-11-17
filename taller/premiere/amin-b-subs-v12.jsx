// Opción B: subtítulos con la estética de siempre (plantilla v12 = v11 + orden invertible), jugando un poco:
// en uno de cada tres la palabra clave va arriba, tres entradas distintas que se alternan, y Deep Glow del usuario en las azules.
// También cambia el MG "libre" a la v3 (celda a golpes + cadenas) con su sonido. Solo toca la secuencia B.
(function () { app.enableQE(); var r = { hecho: [], errores: [] }, i, t, k, T = 254016000000, C = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1010_01/", S = "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", M = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt", B = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "AMIN_1010_01 - B motion graphics nuevos") B = app.project.sequences[i]; if (!B) return "sin secuencia B";
  app.project.openSequence(B.sequenceID); var q = qe.project.getActiveSequence();
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function compN(c, nm) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].displayName === nm) return c.components[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var tt = seg(base + lista[x][0]); p.addKey(tt); p.setValueAtKey(tt, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  // 1) MG libre v3 y su sonido
  var cam = [["MG libre (estilo Julian v2).mp4", "motion/MG libre (estilo Julian v3).mp4"], ["cama prueba Julian.wav", "sfx/cama libre Julian v3.wav"]];
  for (i = 0; i < cam.length; i++) { var it = buscar(app.project.rootItem, cam[i][0]); if (it && it.canChangeMediaPath()) { it.changeMediaPath(C + cam[i][1], true); it.name = cam[i][1].substr(cam[i][1].lastIndexOf("/") + 1); r.hecho.push("medio: " + it.name); } else if (!buscar(app.project.rootItem, cam[i][1].substr(cam[i][1].lastIndexOf("/") + 1))) r.errores.push("no encuentro " + cam[i][0]); }
  for (t = 0; t < B.audioTracks.numTracks; t++) for (i = 0; i < B.audioTracks[t].clips.numItems; i++) { var ca = B.audioTracks[t].clips[i]; if (/^cama (libre|prueba) Julian/.test(ca.name) && Math.abs(ca.start.seconds - 98.167) < 0.05) ca.components[0].properties[1].setValue(0.0624, true); }
  // 2) pistas
  var vBase = -1, bn = 0, vGlowOld = -1; for (t = 0; t < B.videoTracks.numTracks; t++) { var n = 0, g = 0; for (i = 0; i < B.videoTracks[t].clips.numItems; i++) { var c0 = B.videoTracks[t].clips[i]; if (c0.start.seconds > 66 && c0.start.seconds < 108.3) { if (c0.name.indexOf("Subtitulo Amin v10") === 0) n++; if (c0.name.indexOf("glow:") === 0) g++; } } if (n > bn) { bn = n; vBase = t; } if (g > 3) vGlowOld = t; }
  var vFino = -1; for (t = 0; t < B.videoTracks.numTracks; t++) for (i = B.videoTracks[t].clips.numItems - 1; i >= 0; i--) if (B.videoTracks[t].clips[i].name.indexOf("fino: ") === 0) { vFino = t; B.videoTracks[t].clips[i].remove(false, false); }
  var vNew = -1; for (t = vBase + 1; t < B.videoTracks.numTracks; t++) { var oc = 0; for (i = 0; i < B.videoTracks[t].clips.numItems; i++) if (B.videoTracks[t].clips[i].end.seconds > 66 && B.videoTracks[t].clips[i].start.seconds < 108.3) oc++; if (oc === 0) { vNew = t; break; } }
  if (vBase < 0 || vGlowOld < 0 || vFino < 0 || vNew < 0) return JSON.stringify({ error: "pistas", vBase: vBase, vGlowOld: vGlowOld, vFino: vFino, vNew: vNew });
  var libreF = true; for (i = 0; i < B.videoTracks[vFino].clips.numItems; i++) { var cf = B.videoTracks[vFino].clips[i]; if (cf.end.seconds > 66 && cf.start.seconds < 94.7) libreF = false; if (cf.start.seconds >= 105.4 && cf.start.seconds < 108.3) libreF = false; } if (!libreF) return "la pista de las copias no quedó libre";
  function leer(c) { var g0 = c.getMGTComponent(), o = { s: c.start.seconds, e: c.end.seconds, p: [], clave: "", linea: "" }; for (var x = 0; x < g0.properties.numItems; x++) { var pr = g0.properties[x], nm = pr.displayName, q0 = { n: nm }; if (nm === "Linea" || nm === "Palabra clave") { q0.t = "txt"; try { q0.v = JSON.parse(pr.getValue()).textEditValue; } catch (e) { q0.v = ""; } if (nm === "Palabra clave") o.clave = q0.v; else o.linea = q0.v; } else if (nm.indexOf("Color") === 0) { q0.t = "col"; try { q0.v = pr.getColorValue(); } catch (e) { q0.t = "nada"; } } else { q0.t = "val"; q0.v = pr.getValue(); } o.p.push(q0); } var m = comp(c, "AE.ADBE Motion"); o.pos = m.properties[0].getValue(); o.esc = m.properties[1].getValue(); return o; }
  function dentro(s) { return (s >= 66 && s < 94.75) || (s >= 105.4 && s < 108.3); }
  var bases = [], glows = {}; for (i = 0; i < B.videoTracks[vBase].clips.numItems; i++) { var cb = B.videoTracks[vBase].clips[i]; if (cb.name.indexOf("Subtitulo Amin v10") === 0 && dentro(cb.start.seconds)) bases.push(leer(cb)); }
  for (i = 0; i < B.videoTracks[vGlowOld].clips.numItems; i++) { var cg = B.videoTracks[vGlowOld].clips[i]; if (cg.name.indexOf("glow:") !== 0 || !dentro(cg.start.seconds)) continue; var og = leer(cg), ef = compN(cg, "Resplandor de VR"); og.fx = []; if (ef) for (k = 0; k < ef.properties.numItems; k++) { try { og.fx.push(ef.properties[k].getValue()); } catch (e) { og.fx.push(null); } } glows[cg.start.seconds.toFixed(2)] = og; }
  bases.sort(function (a, b) { return a.s - b.s; });
  var fxG = qe.project.getVideoEffectByName("Resplandor de VR");
  function crear(pista, L, arriba, efecto, esGlow) { var tr = B.videoTracks[pista]; B.importMGT(M, String(Math.round(L.s * T)), pista, 0); var nc = null; for (var x = 0; x < tr.clips.numItems; x++) if (Math.abs(tr.clips[x].start.seconds - L.s) < 0.03) nc = tr.clips[x]; if (!nc) { r.errores.push("no entra " + L.s.toFixed(2)); return null; }
    nc.end = seg(L.e); try { nc.outPoint = seg(nc.inPoint.seconds + (L.e - L.s)); } catch (e) {}
    var g2 = nc.getMGTComponent(); for (var y = 0; y < g2.properties.numItems; y++) { var d = g2.properties[y], nm = d.displayName, o2 = null; for (var z = 0; z < L.p.length; z++) if (L.p[z].n === nm) o2 = L.p[z];
      try { if (nm === "Palabra clave arriba") d.setValue(arriba ? 1 : 0, true); else if (!o2) continue; else if (o2.t === "txt") { var j = JSON.parse(d.getValue()); j.textEditValue = o2.v; d.setValue(JSON.stringify(j), true); } else if (o2.t === "col") d.setColorValue(255, o2.v[1], o2.v[2], o2.v[3], true); else if (o2.t === "val") d.setValue(o2.v, true); } catch (e) { r.errores.push(nm + ": " + e); } }
    var m = comp(nc, "AE.ADBE Motion"), P = m.properties[0], E = m.properties[1], A = m.properties[5], a0 = A.getValue(), base = nc.inPoint.seconds, AY = 0.655;
    A.setValue([a0[0], a0[1] * (AY / 0.5)], true); var px = L.pos[0], py = L.pos[1] + (AY - 0.5), s0 = L.esc;
    if (efecto === 0) { P.setValue([px, py], true); claves(E, base, [[0, s0 * 0.8], [0.1, s0 * 1.05], [0.2, s0]]); }
    else if (efecto === 1) { E.setValue(s0, true); claves(P, base, [[0, [px - 0.05, py]], [0.2, [px, py]]]); }
    else { claves(P, base, [[0, [px, py + 0.024]], [0.2, [px, py]]]); claves(E, base, [[0, s0 * 0.93], [0.2, s0]]); }
    if (esGlow && fxG) { var qt = q.getVideoTrackAt(pista); for (var w = 0; w < qt.numItems; w++) { var qc = qt.getItemAt(w); if (qc && qc.type === "Clip" && Math.abs(qc.start.secs - L.s) < 0.02) { qc.addVideoEffect(fxG); break; } } var e2 = compN(nc, "Resplandor de VR"); if (e2 && L.fx) for (var u = 0; u < e2.properties.numItems && u < L.fx.length; u++) if (L.fx[u] !== null) { try { e2.properties[u].setValue(L.fx[u], true); } catch (e) {} } nc.name = "glow: " + L.clave; }
    return nc; }
  var nb = 0, ng = 0, na = 0, kc = 0; r.anc = null;
  for (i = 0; i < bases.length; i++) { var L = bases[i], tieneClave = L.clave.replace(/\s/g, "") !== "", tieneLinea = L.linea.replace(/\s/g, "") !== "", arriba = false; if (tieneClave && tieneLinea) { kc++; arriba = kc % 3 === 2; } var ef2 = i % 3;
    var G = glows[L.s.toFixed(2)]; if (G) { if (crear(vFino, G, arriba, ef2, true)) ng++; }
    if (crear(vNew, L, arriba, ef2, false)) { nb++; if (arriba) na++; } }
  r.hecho.push("subtitulos v12: " + nb + " de " + bases.length + " (clave arriba en " + na + "), copias con Deep Glow: " + ng + ", pistas " + (vNew + 1) + " y " + (vFino + 1));
  var ts = [69.6, 71.6, 74.6, 77.5, 82.3, 85.0, 86.1, 89.5, 91.0, 92.2, 100.3, 103.0, 104.6, 107.8]; for (i = 0; i < ts.length; i++) { B.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, S + "bv-" + i); }
  return JSON.stringify(r); })();
