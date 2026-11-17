// Prueba de la plantilla Jordan en la copia «PRUEBA SUBS A Belfort» (pista V8 nueva, fuera del uso final): propiedades y fotogramas.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · PRUEBA SUBS A Belfort")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence;app.enableQE();var q=qe.project.getActiveSequence();if(s.videoTracks.numTracks<8)q.addTracks(8-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
var v=s.videoTracks[7];for(var k=v.clips.numItems-1;k>=0;k--)v.clips[k].remove(false,false);
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
var c=s.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Jordan v3.mogrt",tk(20),7,0);c.end=seg(22);c.outPoint=seg(2);var m=c.getMGTComponent(),o=[];
for(var j=0;j<m.properties.numItems;j++){var val="";try{val=String(m.properties[j].getValue()).slice(0,30);}catch(e){}o.push(j+":"+m.properties[j].displayName+"="+val);}
var pp=m.properties[13],js=JSON.parse(pp.getValue());js.textEditValue="busca un mentor";js.fontTextRunLength=[15];pp.setValue(JSON.stringify(js),true);m.properties[10].setValue(3,true);m.properties[9].setValue(1,true);
var F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",T=[0,1,2,3,4,5,6,8,12];for(var i=0;i<T.length;i++){s.setPlayerPosition(tk(20+T[i]/30+0.001));q.exportFramePNG(q.CTI.timecode,F+"pl"+i+".png");}
return o.join(" | ");})();
