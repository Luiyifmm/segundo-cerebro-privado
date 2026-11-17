(function(){var s=app.project.activeSequence,o=[];
var tr=s.videoTracks[1];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j],g=c.getMGTComponent(),L=JSON.parse(g.properties[16].getValue()).textEditValue.length;
 var t=Math.min(85,Math.round(85*25/L*10)/10);g.properties[4].setValue(92,true);g.properties[3].setValue(t,true);o.push(L+"→"+t);}
app.project.save();
app.enableQE();var q=qe.project.getActiveSequence(),T=[0.6,3.2,15.0,17.5,21.0],D="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/";
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,D+"k"+i+".png");}
return o.join(" ");})();
