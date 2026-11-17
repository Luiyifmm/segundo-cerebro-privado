// Música a −16 dB (≈ 17,6 dB bajo la voz, dentro de la lección «voz 15–18 dB por encima»), manteniendo el fundido final.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,o="";for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.name!="MÚSICA Radiohead (fondo)")continue;
 var v=null;for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")v=c.components[k].properties[1];var ks=v.getKeys(),g=Math.pow(10,(-16-15)/20);
 for(var q=0;q<ks.length-1;q++)v.setValueAtKey(ks[q],g,true);o="claves "+ks.length;}}
p.save();for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return o;})();
