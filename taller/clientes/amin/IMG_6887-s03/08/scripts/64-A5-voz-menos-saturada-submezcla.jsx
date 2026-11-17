// A5: voz menos aplastada. En A1 y A2 (21 clips): «Mejorar la voz» en omitir (no se borra); Volumen +15 → −6 dB (las claves de los
// dos últimos clips, −21 dB relativas); Amplificación 0,7639 → 0,80. Medido en un clon solo con la voz: −16,5 LUFS, LRA 3,7 (antes −13,5, LRA 1,8).
// Recrea «Submezcla 1» (la asignación de salidas la hace el usuario: no hay API).
(function(){var S=app.project.activeSequence,o=[];if(S.name!="6887-08 · JORDAN A5 franjas negras sin zoom")return "ERROR secuencia";
var n=0,k2=0,antes=[];for(var t=0;t<2;t++){var tr=S.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.name.indexOf("voz")<0)continue;n++;
 for(var k=0;k<c.components.numItems;k++){var cm=c.components[k];
  if(cm.displayName=="Mejorar la voz")cm.properties[0].setValue(true,true);
  if(cm.displayName=="Volumen"){var P=cm.properties[1];if(P.isTimeVarying()){var ks=P.getKeys();for(var z=0;z<ks.length;z++){antes.push(P.getValueAtKey(ks[z]).toFixed(3));P.setValueAtKey(ks[z],P.getValueAtKey(ks[z])*Math.pow(10,-21/20),true);k2++;}}else P.setValue(Math.pow(10,(-6-15)/20),true);}
  if(cm.displayName=="Amplificación")cm.properties[3].setValue(0.80,true);}}}
o.push("clips de voz "+n+", claves escaladas "+k2+" (antes: "+antes.join(",")+")");
app.enableQE();qe.project.getActiveSequence().addTracks(0,S.videoTracks.numTracks,0,1,S.audioTracks.numTracks,1,1,0);o.push("submezcla añadida");
return o.join(" | ");})();
