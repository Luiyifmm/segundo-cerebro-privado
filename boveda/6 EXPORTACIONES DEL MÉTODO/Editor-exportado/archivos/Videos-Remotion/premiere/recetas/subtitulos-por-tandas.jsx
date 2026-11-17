// Subtítulos por tandas en la secuencia activa (pista V2) con la plantilla de ClienteE v3.
(function () { var s = app.project.activeSequence, L = __LOTE__, A = __AJ__, T = 254016000000, n = 0, i; if (s.name.indexOf("SE HICIERON RICOS") < 0) return "activa: " + s.name;
  function seg(x) { var y = new Time(); y.seconds = x; return y; }
  for (i = 0; i < L.length; i++) { var u = L[i], cl = s.importMGT(A.pl, String(Math.round(u[0] * T)), 1, 0); if (!cl) continue; cl.end = seg(u[1]); try { cl.outPoint = seg(cl.inPoint.seconds + (u[1] - u[0])); } catch (e) {}
    var P = cl.getMGTComponent().properties, pr = {}; for (var k in A.aj) pr[k] = A.aj[k]; pr["Linea"] = u[2]; pr["Palabra clave"] = u[3];
    for (var y = 0; y < P.numItems; y++) { var pp = P[y], v = pr[pp.displayName]; if (pp.displayName === "Color clave") { pp.setColorValue(255, A.col[0], A.col[1], A.col[2], true); continue; } if (v === undefined) continue; try { if (typeof v === "string") { var j = JSON.parse(pp.getValue()); j.textEditValue = v; j.fontTextRunLength = [v.length]; pp.setValue(JSON.stringify(j), true); } else pp.setValue(v, true); } catch (e2) {} }
    for (var x = 0; x < cl.components.numItems; x++) if (cl.components[x].matchName === "AE.ADBE Motion") { cl.components[x].properties[0].setValue(A.pos, true); cl.components[x].properties[1].setValue(A.esc, true); } cl.name = (u[2] + " " + u[3]).replace(/^\s+|\s+$/g, ""); n++; }
  if (A.foto) { app.enableQE(); var q = qe.project.getActiveSequence(); s.setPlayerPosition(String(Math.round(A.foto * T))); q.exportFramePNG(q.CTI.timecode, A.fotoRuta); }
  return "subtítulos " + n + "/" + L.length; })();
