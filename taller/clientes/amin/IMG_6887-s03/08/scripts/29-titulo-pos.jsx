// Título: altura 100 (máximo del control) y desplazamiento con Movimiento › Posición para separar las dos líneas.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,o=[],P={"TÍTULO · CAMBIA TU VIDA":0.421,"TÍTULO · EN 6 MESES":0.468};
for(var t=7;t<=8;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(P[c.name]==null)continue;c.getMGTComponent().properties[7].setValue(100,true);
 var mov=null;for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Movimiento")mov=c.components[k];mov.properties[0].setValue([0.5,P[c.name]],true);o.push(c.name+" y "+P[c.name]);}}
p.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",TS=[0.05,0.2,0.45,1.0,5.9,15.5];
for(var i=0;i<TS.length;i++){s.setPlayerPosition(String(Math.round(TS[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"t2"+i+".png");}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return o.join(" | ");})();
