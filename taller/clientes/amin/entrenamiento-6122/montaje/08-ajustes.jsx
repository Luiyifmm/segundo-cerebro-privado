(function(){var s=app.project.activeSequence,o=[];
var tr=s.videoTracks[1];for(var j=0;j<tr.clips.numItems;j++){var g=tr.clips[j].getMGTComponent();g.properties[4].setValue(105,true);g.properties[3].setValue(85,true);}
var t3=s.videoTracks[2];for(var j=0;j<t3.clips.numItems;j++){var c=t3.clips[j];if(c.name.indexOf("CONOCIMIENTO")>0){c.getMGTComponent().properties[3].setValue(52,true);o.push("conocimiento "+c.start.seconds);}}
app.project.save();
app.enableQE();var q=qe.project.getActiveSequence(),T=[0.6,3.2,5.4,15.0,17.5,24.0,30.0],D="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/";
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,D+"h"+i+".png");}
return o.join(" | ");})();
