(function(){app.enableQE();var B=app.project.activeSequence,q=qe.project.getActiveSequence(),ts=[0.9,3.7,15.5,16.9,18.6,20.5,27.2,29.0,33.0,36.2,39.6];
for(var i=0;i<ts.length;i++){B.setPlayerPosition(String(Math.round(ts[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/am-"+i);}return "ok";})();
