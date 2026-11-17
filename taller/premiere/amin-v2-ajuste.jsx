// AMIN_1010_01: rótulos más pequeños, imágenes más pequeñas al llegar a su lado y palabra clave blanca sobre el fondo azul.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], n: 0, rot: 0, sub: 0 }, i, k, T = 254016000000;
  function seg(s) { var t = new Time(); t.seconds = s; return t; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var t = seg(base + lista[x][0]); p.addKey(t); p.setValueAtKey(t, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  var IMG = [["arrow_025507", 1, 68.75, 667, 1000], ["arrow_025406", -1, 72.65, 800, 533], ["arrow_025633", 1, 81.82, 464, 700], ["arrow_025657", -1, 84.23, 736, 1104], ["arrow_025914", 1, 90.05, 1200, 1200], ["arrow_030014", -1, 93.35, 736, 981], ["arrow_030117", 1, 96.72, 736, 736], ["arrow_030210", -1, 99.55, 612, 816]], YC = 0.215;
  for (var t2 = 0; t2 < seq.videoTracks.numTracks; t2++) { var tr = seq.videoTracks[t2]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], g = c.getMGTComponent();
    if (g && c.start.seconds > 65.9) { var txt = "", pc = null, pt = null; for (k = 0; k < g.properties.numItems; k++) { var n = g.properties[k].displayName; if (n === "Palabra clave") { try { txt = JSON.parse(g.properties[k].getValue()).textEditValue; } catch (e) {} } if (n === "Color clave") pc = g.properties[k]; if (n.indexOf("Tamano") === 0) pt = g.properties[k]; }
      if (txt === "EXITOSO" || txt === "MEDIOCRE") { pt.setValue(37, true); comp(c, "AE.ADBE Motion").properties[0].setValue([txt === "EXITOSO" ? 0.25 : 0.75, -0.085], true); r.rot++; }
      else if (txt === "mental" && c.start.seconds > 109) { pc.setColorValue(255, 255, 255, 255, true); r.sub++; } continue; }
    var d = null; for (k = 0; k < IMG.length; k++) if (c.name.indexOf(IMG[k][0]) === 0) d = IMG[k]; if (!d || c.start.seconds < 65) continue;
    var m = comp(c, "AE.ADBE Motion"), base = c.inPoint.seconds, des = d[2] - c.start.seconds, esc = Math.min(760 / d[3], 900 / d[4]) * 100, xl = d[1] > 0 ? 0.81 : 0.19;
    claves(m.properties[0], base, [[0, [0.5, YC - 0.05]], [0.2, [0.5, YC]], [des, [0.5, YC]], [des + 0.3, [xl, YC - 0.03]]]);
    claves(m.properties[1], base, [[0, esc * 0.9], [0.2, esc], [des, esc], [des + 0.3, esc * 0.7]]); r.n++; } }
  var q = qe.project.getActiveSequence(), ts = [69.5, 78, 91, 96.2, 105.2, 111.6]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v2c-" + i); }
  return JSON.stringify(r); })();
