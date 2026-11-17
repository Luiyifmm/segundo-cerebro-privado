// AMIN_1010_01: imágenes más grandes cuando reposan en su lado.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { img: 0 }, i, k, T = 254016000000;
  function seg(s) { var t = new Time(); t.seconds = s; return t; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  function claves(p, base, lista) { if (p.isTimeVarying()) p.setTimeVarying(false); p.setTimeVarying(true); for (var x = 0; x < lista.length; x++) { var t = seg(base + lista[x][0]); p.addKey(t); p.setValueAtKey(t, lista[x][1], true); } for (x = 0; x < lista.length; x++) try { p.setInterpolationTypeAtKey(seg(base + lista[x][0]), 5, true); } catch (e) {} }
  var IMG = [["arrow_025507", -1, 68.75, 667, 1000, 2, 8, 2, 28], ["arrow_025406", 1, 72.65, 800, 533, 25, 0, 8, 0], ["arrow_025633", -1, 81.82, 464, 700, 0, 2, 0, 10], ["arrow_025657", 1, 84.23, 736, 1104, 0, 0, 0, 28], ["arrow_025914", -1, 90.05, 1200, 1200, 15, 12, 10, 12], ["arrow_030014", 1, 93.35, 736, 981, 15, 20, 0, 8], ["arrow_030117", -1, 96.72, 736, 736, 30, 30, 0, 0], ["arrow_030210", 1, 99.55, 612, 816, 10, 22, 10, 15]];
  for (var t2 = 0; t2 < seq.videoTracks.numTracks; t2++) { var tr = seq.videoTracks[t2]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], d = null; for (k = 0; k < IMG.length; k++) if (c.name.indexOf(IMG[k][0]) === 0) d = IMG[k]; if (!d || c.start.seconds < 65) continue;
    var m = comp(c, "AE.ADBE Motion"), base = c.inPoint.seconds, des = d[2] - c.start.seconds, vw = d[3] * (100 - d[5] - d[7]) / 100, vh = d[4] * (100 - d[6] - d[8]) / 100, e1 = Math.min(800 / vw, 900 / vh) * 100, e2 = Math.min(660 / vw, 720 / vh) * 100;
    function pos(cx, cy, e) { return [cx - (d[5] - d[7]) / 200 * d[3] * e / 100 / 2160, cy - (d[6] - d[8]) / 200 * d[4] * e / 100 / 3840]; }
    claves(m.properties[0], base, [[0, pos(0.5, 0.17, e1 * 0.9)], [0.2, pos(0.5, 0.22, e1)], [des, pos(0.5, 0.22, e1)], [des + 0.3, pos(d[1] > 0 ? 0.755 : 0.245, 0.205, e2)]]);
    claves(m.properties[1], base, [[0, e1 * 0.9], [0.2, e1], [des, e1], [des + 0.3, e2]]); r.img++; } }
  var q = qe.project.getActiveSequence(), ts = [69.6, 85.2, 91, 100.2]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v4-" + i); }
  return JSON.stringify(r); })();
