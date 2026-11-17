(function () { var seq = app.project.activeSequence, c = seq.videoTracks[0].clips[0], it = c.projectItem, r = {};
  try { r.cs = it.getColorSpace ? JSON.stringify(it.getColorSpace()) : "sin getColorSpace"; } catch (e) { r.cs = "err " + e; }
  try { r.orig = it.getOriginalColorSpace ? JSON.stringify(it.getOriginalColorSpace()) : "sin"; } catch (e) { r.orig = "err " + e; }
  try { r.lut = it.getEmbeddedLUTID ? String(it.getEmbeddedLUTID()) : "sin"; } catch (e) { r.lut = "err"; }
  r.tieneSet = typeof it.setOverrideColorSpace; r.setCS = typeof it.setColorSpace;
  try { var st = seq.getSettings(); r.seq = []; for (var k in st) if (/color|hdr|tone|working/i.test(k)) r.seq.push(k + "=" + st[k]); } catch (e) {}
  try { r.wcs = seq.workingColorSpace ? String(seq.workingColorSpace) : (seq.getSettings().workingColorSpace || "?"); } catch (e) {}
  return JSON.stringify(r); })();
