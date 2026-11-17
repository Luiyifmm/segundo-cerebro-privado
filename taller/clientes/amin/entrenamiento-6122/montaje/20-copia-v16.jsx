(function(){var p=app.project,s=p.activeSequence,N="ENTRENAMIENTO 6122 · v1.6";
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ERROR: ya existe "+N;
var orig=s.sequenceID;s.clone();
var c=null;for(var i=0;i<p.sequences.numSequences;i++){var q=p.sequences[i];if(q.sequenceID!=orig&&q.name.indexOf("ENTRENAMIENTO 6122 · propuesta Claude v1")==0)c=q;}
if(!c)return "ERROR: no encuentro la copia";c.name=N;p.openSequence(c.sequenceID);p.save();
var a=p.activeSequence;return "activa: "+a.name+" | V1 "+a.videoTracks[0].clips.numItems+" V2 "+a.videoTracks[1].clips.numItems+" V3 "+a.videoTracks[2].clips.numItems+" V4 "+a.videoTracks[3].clips.numItems+" A2 "+a.audioTracks[1].clips.numItems;})();
