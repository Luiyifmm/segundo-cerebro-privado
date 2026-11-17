(function () { var r = { abiertos: [], nuevo: typeof app.newProject, impSeq: typeof app.project.importSequences, attach: "" }, i, j, t, k;
  for (i = 0; i < app.projects.numProjects; i++) { var p = app.projects[i], S = []; for (j = 0; j < p.sequences.numSequences; j++) { var s = p.sequences[j], info = { n: s.name, id: s.sequenceID, dur: +(s.end / 254016000000).toFixed(1), w: s.frameSizeHorizontal, h: s.frameSizeVertical, fps: +(254016000000 / s.timebase).toFixed(2), marc: s.markers ? s.markers.numMarkers : -1, subs: {} };
      for (t = 0; t < s.videoTracks.numTracks; t++) for (k = 0; k < s.videoTracks[t].clips.numItems; k++) { var c = s.videoTracks[t].clips[k]; if (c.getMGTComponent()) { var nm = c.projectItem ? c.projectItem.name : c.name; info.subs[nm] = (info.subs[nm] || 0) + 1; } }
      S.push(info); } r.abiertos.push({ p: p.name, sec: S }); }
  return JSON.stringify(r); })();
