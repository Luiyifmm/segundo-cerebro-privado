(function(){var s=app.project.activeSequence,E={medias:190,iphone:215,logos:190,simple:215,coche:190,casa:215,invertir:190,banco:215,cocinar:190,moraleja1:215,moraleja2:190,moraleja3:230,cta:190};
var vt=s.videoTracks[0],n=0;for(var j=0;j<vt.clips.numItems;j++){var c=vt.clips[j],b=c.name.split(" · ")[1];if(E[b]){c.components[1].properties[1].setValue(E[b],true);n++;}}
var m2=0;for(var t=1;t<=2;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){var g=tr.clips[j].getMGTComponent();if(!g)continue;
 g.properties[0].setValue(0,true);g.properties[3].setValue(67.89,true);g.properties[10].setValue(true,true);g.properties[9].setValue(100,true);g.properties[8].setValue(38,true);g.properties[7].setValue(16,true);
 if(t==1)g.properties[4].setValue(80,true);m2++;}}
app.project.save();
app.enableQE();var q=qe.project.getActiveSequence(),T=[0.6,1.9,3.2,10.2,12.0,22.3,27.0,30.0,35.0,37.6],D="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/";
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,D+"g"+("0"+i).slice(-2)+".png");}
return "escalas "+n+" | textos "+m2;})();
