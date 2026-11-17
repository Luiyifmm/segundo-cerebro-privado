(function(){var s=app.project.activeSequence,v4=s.videoTracks[3],o=[];
for(var j=0;j<v4.clips.numItems;j++){var c=v4.clips[j],mo=c.components[1],x=mo.properties[0].getValue()[0];
 mo.properties[0].setValue([x>0.5?0.739:0.261,0.39],true);mo.properties[1].setValue(115,true);o.push(c.name.replace("IMAGEN · ",""));}
app.project.save();app.enableQE();var q=qe.project.getActiveSequence();
var Dd="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",TT=[0.6,1.9,3.3,5.5,6.8,8.3,11.0,12.5,15.0,16.3,17.5,19.2,21.0,22.5,24.5,25.5];
for(var i=0;i<TT.length;i++){s.setPlayerPosition(String(Math.round(TT[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,Dd+"jm"+("0"+i).slice(-2)+".png");}
return o.length+" imágenes";})();
