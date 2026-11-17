// Subtítulos de frase en la secuencia del usuario (MVI_1373), pista V3, con "Subtitulo ClienteE YT v1": ClienteE en verde, entrevistado en amarillo, con sombra.
(function () { var s = app.project.activeSequence, L = __LOTE__, T = 254016000000, n = 0, i, PL = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteE YT v1.mogrt"; if (s.name !== "MVI_1373") return "activa: " + s.name;
  function seg(x) { var y = new Time(); y.seconds = x; return y; }
  if (__PRIMERO__) { try { s.videoTracks[2].name = "SUBTITULOS (Claude)"; } catch (e0) {} var u2 = s.videoTracks[1]; for (i = 0; i < u2.clips.numItems; i++) if (u2.clips[i].start.seconds < 66.2) u2.clips[i].disabled = true; }
  for (i = 0; i < L.length; i++) { var u = L[i], cl = s.importMGT(PL, String(Math.round(u[0] * T)), 2, 0); if (!cl) continue; cl.end = seg(u[1]); try { cl.outPoint = seg(cl.inPoint.seconds + (u[1] - u[0])); } catch (e) {}
    var P = cl.getMGTComponent().properties; for (var y = 0; y < P.numItems; y++) { var pp = P[y]; try { if (pp.displayName === "Texto") { var j = JSON.parse(pp.getValue()); j.textEditValue = u[2]; j.fontTextRunLength = [u[2].length]; pp.setValue(JSON.stringify(j), true); } else if (pp.displayName === "Color" && u[3] === "I") pp.setColorValue(255, 255, 249, 0, true); } catch (e2) {} }
    cl.name = u[2]; n++; }
  return "subtítulos " + n + "/" + L.length; })();
