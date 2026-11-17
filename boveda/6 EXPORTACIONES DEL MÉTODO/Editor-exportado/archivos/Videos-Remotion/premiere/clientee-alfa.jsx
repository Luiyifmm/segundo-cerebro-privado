(function () { var r = {}, seq = app.project.activeSequence, i, T = 254016000000, tr = seq.videoTracks[2], mg = null, cta = null;
  for (i = 0; i < tr.clips.numItems; i++) { if (tr.clips[i].name.indexOf("MG emojis") === 0) mg = tr.clips[i]; if (tr.clips[i].name.indexOf("CTA") === 0) cta = tr.clips[i]; }
  var fc = cta.projectItem.getFootageInterpretation(), fm = mg.projectItem.getFootageInterpretation();
  r.cta = fc.alphaUsage + "/" + fc.ignoreAlpha + "/" + fc.invertAlpha; r.mgAntes = fm.alphaUsage + "/" + fm.ignoreAlpha + "/" + fm.invertAlpha;
  var probar = [1, 2], q; app.enableQE(); q = qe.project.getActiveSequence();
  for (i = 0; i < probar.length; i++) { fm = mg.projectItem.getFootageInterpretation(); fm.alphaUsage = probar[i]; fm.ignoreAlpha = false; r["set" + probar[i]] = mg.projectItem.setFootageInterpretation(fm);
    seq.setPlayerPosition(String(Math.round(57.4 * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/alfa-" + probar[i]); }
  r.final = mg.projectItem.getFootageInterpretation().alphaUsage; seq.setPlayerPosition("0"); return JSON.stringify(r); })();
