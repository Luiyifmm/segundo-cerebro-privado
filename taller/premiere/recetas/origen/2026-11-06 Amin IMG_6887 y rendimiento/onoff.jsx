(function(){app.enableQE();var s=app.project.activeSequence,cl=s.videoTracks[1].clips[0],q=qe.project.getActiveSequence();
cl.disabled=true;s.setPlayerPosition(String(Math.round(24.0*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/off");
cl.disabled=false;s.setPlayerPosition(String(Math.round(24.04*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/on");return "ok";})();
