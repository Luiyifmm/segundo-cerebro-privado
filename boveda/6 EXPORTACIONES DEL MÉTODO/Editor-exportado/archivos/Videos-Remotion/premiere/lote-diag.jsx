(function () { app.enableQE(); var s = app.project.activeSequence, q = qe.project.getActiveSequence(), T = 254016000000, S = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", r = { sec: [s.frameSizeHorizontal, s.frameSizeVertical] };
  var c = s.videoTracks[0].clips[0], it = c.projectItem; r.clip = c.name; r.item = it.name; try { r.proxy = it.hasProxy(); r.proxyPath = it.getProxyPath(); } catch (e) { r.e1 = "" + e; }
  try { var fi = it.getFootageInterpretation(); r.interp = { par: fi.pixelAspectRatio, fps: fi.frameRate, rot: fi.vrRotation }; } catch (e) { r.e2 = "" + e; }
  try { r.enProx0 = app.getEnableProxies(); app.setEnableProxies(0); r.enProx1 = app.getEnableProxies(); } catch (e) { r.e3 = "" + e; }
  s.setPlayerPosition(String(Math.round(1.0 * T))); q.exportFramePNG(q.CTI.timecode, S + "diag-sin-proxy");
  try { app.setEnableProxies(1); } catch (e) {} s.setPlayerPosition(String(Math.round(3.0 * T))); q.exportFramePNG(q.CTI.timecode, S + "diag-con-proxy"); s.setPlayerPosition("0");
  return JSON.stringify(r); })();
