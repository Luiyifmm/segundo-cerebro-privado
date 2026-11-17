(function () { app.enableQE(); var r = { hecho: [], errores: [] }, i, T = 254016000000, C = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/", S = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", B = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "CLIENTE-A_1010_01 - B motion graphics nuevos") B = app.project.sequences[i]; if (!B) return "sin secuencia B";
  app.project.openSequence(B.sequenceID);
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  var M = [["clientea v3 01 escuela.jpg", "imagenes/v3-pinterest/clientea v3 01 estudiante.jpg"]]; for (i = 1; i <= 6; i++) M.push(["miniaturas clientea v4 0" + i + ".png", "miniaturas/v5/miniaturas clientea v5 0" + i + ".png"]);
  var n = 0; for (i = 0; i < M.length; i++) { var it = buscar(app.project.rootItem, M[i][0]); if (!it || !it.canChangeMediaPath()) { r.errores.push("no cambia " + M[i][0]); continue; } it.changeMediaPath(C + M[i][1], true); it.name = M[i][1].substr(M[i][1].lastIndexOf("/") + 1); n++; } r.hecho.push("medios cambiados: " + n);
  var q = qe.project.getActiveSequence(), ts = [67.4, 72.0, 91.0]; for (i = 0; i < ts.length; i++) { B.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, S + "be-" + i); }
  return JSON.stringify(r); })();
