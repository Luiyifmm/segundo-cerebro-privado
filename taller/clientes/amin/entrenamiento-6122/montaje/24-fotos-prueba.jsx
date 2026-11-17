(function(){var s=app.project.activeSequence;app.project.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[5.05,5.4,6.9,7.85,8.2,9.4];
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"ph"+i+".png");}return "ok";})();
