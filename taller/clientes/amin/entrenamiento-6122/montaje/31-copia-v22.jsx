(function(){var p=app.project,s=p.activeSequence,N="ENTRENAMIENTO 6122 · v2.2";
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ERROR: ya existe "+N;
var orig=s.sequenceID,antes={};for(var i=0;i<p.sequences.numSequences;i++)antes[p.sequences[i].sequenceID]=1;s.clone();
var c=null;for(var i=0;i<p.sequences.numSequences;i++){var q=p.sequences[i];if(!antes[q.sequenceID])c=q;}
if(!c)return "ERROR: no encuentro la copia";c.name=N;p.openSequence(c.sequenceID);p.save();
var a=p.activeSequence,v1=a.videoTracks[0],o=[];for(var j=0;j<v1.clips.numItems;j++){var k=v1.clips[j];if(k.start.seconds>26)o.push(k.name+" "+k.start.seconds.toFixed(2)+"-"+k.end.seconds.toFixed(2));}
return "activa: "+a.name+" | "+o.join(" / ");})();
