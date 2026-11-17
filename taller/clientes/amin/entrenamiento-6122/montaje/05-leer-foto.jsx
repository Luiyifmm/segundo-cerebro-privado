(function(){var s=app.project.activeSequence;app.enableQE();var q=qe.project.getActiveSequence();
var m=s.videoTracks[2].clips[0].getMGTComponent(),v=[];for(var k=0;k<15;k++){var x;try{x=m.properties[k].getValue();}catch(e){x="?";}v.push(k+"="+String(x).substr(0,30));}
var T=[0.6,1.9,3.2,4.3,10.2,12.0,20.8,22.3,27.0,30.0,35.0,37.6],D="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/";
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,D+"f"+("0"+i).slice(-2)+"_"+T[i]+".png");}
return v.join(" | ");})();
