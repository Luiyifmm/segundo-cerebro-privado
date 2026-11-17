(function () { app.enableQE(); var q = qe.project.getActiveSequence(), t = q.getAudioTrackAt(0), r = {};
  try { r.track = t.reflect.methods.join(",").substr(0, 900); } catch (e) { r.e1 = String(e); }
  try { r.props = t.reflect.properties.join(",").substr(0, 600); } catch (e) { r.e2 = String(e); }
  try { var it = t.getItemAt(0); r.item = it.reflect.methods.join(",").substr(0, 900); r.itemP = it.reflect.properties.join(",").substr(0, 500); } catch (e) { r.e3 = String(e); }
  var s = app.project.activeSequence, a = s.audioTracks[0]; try { r.dom = a.reflect.methods.join(",") + " | " + a.reflect.properties.join(","); } catch (e) { r.e4 = String(e); }
  try { r.clipDom = a.clips[0].reflect.methods.join(",").substr(0, 700); } catch (e) {}
  return JSON.stringify(r); })();
