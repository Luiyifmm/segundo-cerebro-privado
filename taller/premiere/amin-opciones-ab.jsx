// AMIN_1010_01: opción A sin motion graphics y opción B con los motion graphics nuevos (estilo Julián). El original no se toca.
(function () { app.enableQE(); var r = { A: [], B: [], errores: [] }, i, t, k, T = 254016000000, C = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1010_01/", S = "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/";
  if (app.project.name !== "AMIN EDICION.prproj") return "proyecto inesperado";
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function sec(n) { for (var x = 0; x < app.project.sequences.numSequences; x++) if (app.project.sequences[x].name === n) return app.project.sequences[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  var SFX_MG = [["whoosh en capas", 94.2], ["ambiente MG escuela", 94.8], ["golpe en capas", 96.9], ["riseer 1", 101.6], ["ambiente MG cadenas", 101.93], ["impacto en capas", 103.03]];
  function quitarMG(seq, log) { var n = 0, m = 0; for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (/^MG escuela/.test(c.name) && c.start.seconds > 94 && c.start.seconds < 96) { c.disabled = true; n++; } }
    for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) { var a = seq.audioTracks[t].clips[i]; for (k = 0; k < SFX_MG.length; k++) if (a.name.indexOf(SFX_MG[k][0]) === 0 && Math.abs(a.start.seconds - SFX_MG[k][1]) < 0.15) { a.disabled = true; m++; } } log.push("MG antiguos desactivados: " + n + ", sonidos de MG desactivados: " + m); }
  function fotos(seq, pre, ts) { app.project.openSequence(seq.sequenceID); var q = qe.project.getActiveSequence(); for (var x = 0; x < ts.length; x++) { seq.setPlayerPosition(String(Math.round(ts[x] * T))); q.exportFramePNG(q.CTI.timecode, S + pre + x); } }
  var A = sec("AMIN_1010_01 - A sin motion graphics"), B = sec("AMIN_1010_01 - B motion graphics nuevos"); if (!A || !B) return "faltan las secuencias";
  quitarMG(A, r.A); fotos(A, "opA-", [95.5, 97.2, 100.5, 103.5]);
  quitarMG(B, r.B);
  var vT = -1, aT = -1; for (t = 10; t <= 11; t++) { var oc = false; for (i = 0; i < B.videoTracks[t].clips.numItems; i++) if (B.videoTracks[t].clips[i].start.seconds < 105.5 && B.videoTracks[t].clips[i].end.seconds > 94.7) oc = true; if (!oc && vT < 0) vT = t; } r.B.push("pista de video: " + (vT + 1) + " " + (vT >= 0 ? B.videoTracks[vT].name : "")); for (t = 0; t < B.audioTracks.numTracks; t++) if (B.audioTracks[t].name === "SFX IMAGENES") aT = t;
  if (vT < 0 || aT < 0) return JSON.stringify({ error: "sin pista", vT: vT, aT: aT });
  function libre(tr, a, b) { for (var x = 0; x < tr.clips.numItems; x++) if (tr.clips[x].start.seconds < b - 0.01 && tr.clips[x].end.seconds > a + 0.01) return false; return true; }
  var PLAN = [["motion/MG escuela (estilo Julian).mp4", 94.8, 0, 3.367, "sfx/cama escuela Julian.wav", 0.0513], ["motion/MG libre (estilo Julian v2).mp4", 98.167, 0.097, 7.397, "sfx/cama prueba Julian.wav", 0.0776]];
  for (k = 0; k < PLAN.length; k++) { var p = PLAN[k], fin = p[1] + (p[3] - p[2]), vt = B.videoTracks[vT], at = B.audioTracks[aT];
    if (!libre(vt, p[1], fin) || !libre(at, p[1], fin)) { r.errores.push("pista ocupada para " + p[0]); continue; }
    var iv = traer(C + p[0]), ia = traer(C + p[4]); if (!iv || !ia) { r.errores.push("no importa " + p[0]); continue; }
    iv.setInPoint(p[2], 4); iv.setOutPoint(p[3], 4); vt.overwriteClip(iv, p[1]); ia.setInPoint(p[2], 4); ia.setOutPoint(p[3], 4); at.overwriteClip(ia, p[1]);
    for (i = 0; i < vt.clips.numItems; i++) if (Math.abs(vt.clips[i].start.seconds - p[1]) < 0.03) { var cv = vt.clips[i]; if (Math.abs(cv.end.seconds - fin) > 0.03) { cv.end = seg(fin); } r.B.push("video " + cv.name + " " + cv.start.seconds.toFixed(2) + "-" + cv.end.seconds.toFixed(2)); }
    for (i = 0; i < at.clips.numItems; i++) if (Math.abs(at.clips[i].start.seconds - p[1]) < 0.03) { var ca = at.clips[i]; if (Math.abs(ca.end.seconds - fin) > 0.03) ca.end = seg(fin); ca.components[0].properties[1].setValue(p[5], true); r.B.push("audio " + ca.name + " " + ca.start.seconds.toFixed(2) + "-" + ca.end.seconds.toFixed(2)); } }
  // audio que haya caído de más (el mp4 no lleva audio, pero por si acaso) y subtítulos del tramo
  var ns = 0; for (t = 0; t < B.videoTracks.numTracks; t++) for (i = 0; i < B.videoTracks[t].clips.numItems; i++) { var s = B.videoTracks[t].clips[i]; if (s.start.seconds >= 94.8 && s.start.seconds < 105.4 && s.getMGTComponent() && /^(Subtitulo Amin|glow:)/.test(s.name)) { s.disabled = true; ns++; } } r.B.push("subtitulos del tramo desactivados: " + ns);
  fotos(B, "opB-", [95.3, 96.5, 97.9, 99.6, 101.2, 102.5, 103.0, 104.9]);
  return JSON.stringify(r); })();
