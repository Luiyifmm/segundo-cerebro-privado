(function(){app.enableQE();var B=app.project.activeSequence,q=qe.project.getActiveSequence(),ts=[22.8,23.0,26.0,32.4,34.25,35.75,36.9];
for(var i=0;i<ts.length;i++){B.setPlayerPosition(String(Math.round(ts[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ak-"+i);}return "ok";})();
