(function(){var PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt";function seg(x){var y=new Time();y.seconds=x;return y;}
var p=app.project,s=p.activeSequence,v8=s.videoTracks[7],dp=null;
for(var j=0;j<v8.clips.numItems;j++){if(v8.clips[j].name=="PRUEBA · MEDIOCRE")return "ERROR: ya existe";if(v8.clips[j].name=="PRUEBA · DE POBRE")dp=v8.clips[j];}
if(!dp)return "ERROR: no encuentro DE POBRE";dp.end=seg(7.2);
var c=s.importMGT(PL,String(Math.round(7.24*254016000000)),7,0);c.end=seg(7.72);c.outPoint=seg(0.48);var m=c.getMGTComponent();
function txt(k,t){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(j),true);}
txt(16,"");txt(15,"MEDIOCRE");m.properties[14].setColorValue(255,230,40,40,true);m.properties[0].setValue(0,true);m.properties[10].setValue(true,true);m.properties[9].setValue(100,true);m.properties[8].setValue(38,true);m.properties[7].setValue(16,true);m.properties[3].setValue(67.89,true);c.name="PRUEBA · MEDIOCRE";
p.save();app.enableQE();var q=qe.project.getActiveSequence();s.setPlayerPosition(String(Math.round(7.5*254016000000)));q.exportFramePNG(q.CTI.timecode,"/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/pm.png");
return "DE POBRE "+dp.start.seconds.toFixed(2)+"-"+dp.end.seconds.toFixed(2)+" | MEDIOCRE "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2);})();
