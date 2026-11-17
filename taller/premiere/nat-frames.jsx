(function () { app.enableQE(); var seq = app.project.activeSequence, q = qe.project.getActiveSequence(), T = 254016000000, ts = [0.2, 2.9, 5.0, 8.0, 11.0, 13.5], r = [];
  for (var i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nat-" + i); }
  var tr = seq.videoTracks[1]; for (i = 0; i < tr.clips.numItems; i++) r.push([+tr.clips[i].start.seconds.toFixed(2), tr.clips[i].name]);
  var c0 = seq.videoTracks[0].clips[0], fx = []; for (var k = 0; k < c0.components.numItems; k++) if (c0.components[k].displayName === "Color de Lumetri") { var l = c0.components[k]; var ix = [14, 15, 16, 19, 20, 21, 22, 23, 24, 42]; for (var j = 0; j < ix.length; j++) { try { fx.push(ix[j] + ":" + l.properties[ix[j]].displayName + "=" + l.properties[ix[j]].getValue()); } catch (x) {} } }
  var ins = []; for (i = 0; i < seq.videoTracks[0].clips.numItems; i++) ins.push(+seq.videoTracks[0].clips[i].inPoint.seconds.toFixed(2));
  return JSON.stringify({ cont: r, lumetri: fx, ins: ins, ruta: c0.projectItem.getMediaPath() }); })();
