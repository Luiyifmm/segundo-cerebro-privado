(function(){var s=app.project.activeSequence,v1=s.videoTracks[0],n=0;
for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j],b=c.name.split(" · ")[1];if(b=="simple"||b=="invertir"){c.components[1].properties[0].setValue([0.77,0.5],true);n++;}}
app.project.save();app.enableQE();var q=qe.project.getActiveSequence(),Dd="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",TT=[8.0,9.3,17.4,19.5];
for(var i=0;i<TT.length;i++){s.setPlayerPosition(String(Math.round(TT[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,Dd+"izq"+i+".png");}
return "movidos "+n;})();
