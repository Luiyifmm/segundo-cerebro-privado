// Tres copias de la secuencia del usuario (sus cortes intactos) para las pruebas de subtítulos A/B/C. La original no se toca.
(function(){var p=app.project,ORIG="6887-08 · propuesta Claude v1",N=["6887-08 · PRUEBA SUBS A Belfort","6887-08 · PRUEBA SUBS B Heras","6887-08 · PRUEBA SUBS C Said-Alborna"],o=[];
function seq(n){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==n)return p.sequences[i];return null;}
for(var k=0;k<N.length;k++){if(seq(N[k]))return "ERROR ya existe "+N[k];}
var src=seq(ORIG);for(var k=0;k<N.length;k++){p.openSequence(src.sequenceID);var antes={};for(var i=0;i<p.sequences.numSequences;i++)antes[p.sequences[i].sequenceID]=1;
 app.project.activeSequence.clone();var c=null;for(var i=0;i<p.sequences.numSequences;i++)if(!antes[p.sequences[i].sequenceID])c=p.sequences[i];c.name=N[k];
 p.openSequence(c.sequenceID);var s=p.activeSequence,v3=s.videoTracks[2],d=0;for(var j=0;j<v3.clips.numItems;j++){v3.clips[j].disabled=true;d++;}
 s.setInPoint(1.867);s.setOutPoint(8.30);app.enableQE();var q=qe.project.getActiveSequence();q.addTracks(1,s.videoTracks.numTracks,0);o.push(N[k]+": subs viejos desactivados "+d+", pistas V"+s.videoTracks.numTracks);}
p.openSequence(src.sequenceID);p.save();return o.join(" | ");})();
