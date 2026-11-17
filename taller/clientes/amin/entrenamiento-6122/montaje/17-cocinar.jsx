(function(){var s=app.project.activeSequence,v1=s.videoTracks[0],n=0;
for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j];if(c.name.split(" · ")[1]=="cocinar"){c.components[1].properties[0].setValue([0.76,0.5],true);n++;}}
app.project.save();app.enableQE();var q=qe.project.getActiveSequence();
var Dd="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/";var TT=[23.8,25.5];
for(var i=0;i<TT.length;i++){s.setPlayerPosition(String(Math.round(TT[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,Dd+"coc"+i+".png");}
return "cocinar movido en "+n+" clips";})();
