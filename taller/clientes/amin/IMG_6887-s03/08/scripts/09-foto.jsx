(function(){var s=app.project.activeSequence;app.enableQE();var q=qe.project.getActiveSequence(),T=__T__,F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/";
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"__P__"+i+".png");}return "ok";})();
