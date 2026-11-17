// Margen ≈ 11 dB en «seis meses» (riser) y «planes» (clic 9): riser +0,3 s (cresta sobre «ponte en forma»), clic 9 a −14 dB.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,o=[];function seg(x){var y=new Time();y.seconds=x;return y;}function vol(c,db){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")c.components[k].properties[1].setValue(Math.pow(10,(db-15)/20),true);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];
 if(c.name=="SFX2 riser gancho"){var d=c.end.seconds-c.start.seconds,st=c.start.seconds+0.30;c.end=seg(st+d);c.start=seg(st);o.push("riser "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2)+" in "+c.inPoint.seconds.toFixed(2));}
 if(c.name=="SFX2 clic lista 9"){vol(c,-14);o.push("clic 9 −14");}}}
p.save();for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return o.join(" | ");})();
