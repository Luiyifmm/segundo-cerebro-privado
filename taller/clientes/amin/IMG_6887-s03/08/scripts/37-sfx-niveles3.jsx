// SFX ≥ 12 dB bajo la voz mientras se habla (medido por diferencia v1/v2.2): booms −20 (POR DINERO −18) y 0,8–1 s; cama −20; whooshes −16; clics −6.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,n=0;function seg(x){var y=new Time();y.seconds=x;return y;}function vol(c,db){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")c.components[k].properties[1].setValue(Math.pow(10,(db-15)/20),true);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j],nm=c.name;
 if(nm=="SFX2 boom POR DINERO"){vol(c,-18);c.end=seg(c.start.seconds+1.0);n++;}else if(nm.indexOf("SFX2 boom")==0){vol(c,-20);c.end=seg(c.start.seconds+0.8);n++;}
 else if(nm=="SFX2 cama bajo"){vol(c,-20);n++;}else if(nm.indexOf("SFX2 whoosh")==0){vol(c,-16);n++;}else if(nm.indexOf("SFX2 clic")==0){vol(c,-6);n++;}}}
p.save();for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return "ajustados "+n;})();
