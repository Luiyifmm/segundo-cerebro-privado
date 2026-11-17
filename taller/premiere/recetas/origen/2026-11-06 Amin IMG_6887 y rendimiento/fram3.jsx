(function(){app.enableQE();var B=app.project.activeSequence,q=qe.project.getActiveSequence(),ts=[16.9,18.6,19.3,20.5,25.9,27.3,29.0,34.1,35.7];
for(var i=0;i<ts.length;i++){B.setPlayerPosition(String(Math.round(ts[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/az-"+i);}return "ok";})();
