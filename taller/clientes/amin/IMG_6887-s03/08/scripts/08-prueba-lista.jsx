// Prueba: un clip v12 con la lista completa (12 líneas) en V3, para ver tamaño y posición. Se borra después si no vale.
(function(){var s=app.project.activeSequence,PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt";function seg(x){var y=new Time();y.seconds=x;return y;}
if(s.videoTracks[2].clips.numItems)return "ERROR V3 ocupada";
var c=s.importMGT(PL,String(Math.round(18.95*254016000000)),2,0);c.end=seg(20.6);c.outPoint=seg(1.65);c.name="PRUEBA lista";var m=c.getMGTComponent(),o=[];
for(var k=0;k<m.properties.numItems;k++){var v="";try{v=m.properties[k].getValue();}catch(e){}o.push(k+":"+m.properties[k].displayName+"="+String(v).slice(0,40));}
var L=["1 · Ponte en forma","2 · Deja el porno","3 · Cero móvil por las mañanas","4 · Busca un mentor","5 · No mires las historias de otros","6 · No cuentes tus metas","7 · Sal del grupo que no aporta","8 · Di que no al 99 %","9 · Aprende a vender","10 · Cobra más caro","11 · Que te llamen loco","12 · Hazlo con miedo"].join("\r");
var pp=m.properties[16],j=JSON.parse(pp.getValue());j.textEditValue=L;j.fontTextRunLength=[L.length];pp.setValue(JSON.stringify(j),true);
var pk=m.properties[15],jk=JSON.parse(pk.getValue());jk.textEditValue="";jk.fontTextRunLength=[0];pk.setValue(JSON.stringify(jk),true);
m.properties[0].setValue(0,true);m.properties[11].setValue(true,true);m.properties[3].setValue(30,true);m.properties[4].setValue(70,true);
app.project.save();app.enableQE();var q=qe.project.getActiveSequence();s.setPlayerPosition(String(Math.round(19.8*254016000000)));q.exportFramePNG(q.CTI.timecode,"/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista-prueba.png");
return o.join(" | ");})();
