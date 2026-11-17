(function () { app.enableQE(); var r = { n: 0, props: [] }, i, t, k, T = 254016000000, S = "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", B = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "AMIN_1010_01 - B motion graphics nuevos") B = app.project.sequences[i]; if (!B) return "sin secuencia B";
  app.project.openSequence(B.sequenceID);
  for (t = 0; t < B.videoTracks.numTracks; t++) for (i = 0; i < B.videoTracks[t].clips.numItems; i++) { var c = B.videoTracks[t].clips[i]; if (c.name.indexOf("fino: ") !== 0) continue; var m = c.getMGTComponent(); for (k = 0; k < m.properties.numItems; k++) { var p = m.properties[k]; if (r.n === 0) r.props.push(p.displayName); if (/^Altura/.test(p.displayName)) p.setValue(53, true); } r.n++; }
  var q = qe.project.getActiveSequence(), ts = [72.33, 72.6, 73.0, 84.5, 85.3, 91.0]; for (i = 0; i < ts.length; i++) { B.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, S + "bt-" + i); }
  return JSON.stringify(r); })();
