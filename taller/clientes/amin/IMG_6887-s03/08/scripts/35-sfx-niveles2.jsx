// Los risers suenan encima de la voz («seis meses», «deja de cambiar horas») y la transcripción falla ahí: risers −9 dB, clics 0 dB.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,n=0;function vol(c,db){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")c.components[k].properties[1].setValue(Math.pow(10,(db-15)/20),true);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];
 if(c.name.indexOf("SFX2 riser")==0){vol(c,-9);n++;}else if(c.name.indexOf("SFX2 clic")==0){vol(c,0);n++;}}}
p.save();for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return "ajustados "+n;})();
