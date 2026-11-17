(function(){var p=app.project,s=p.activeSequence,N="ENTRENAMIENTO 6122 · v2 formato";
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ERROR: ya existe "+N;
var orig=s.sequenceID;s.clone();
var c=null;for(var i=0;i<p.sequences.numSequences;i++){var q=p.sequences[i];if(q.sequenceID!=orig&&q.name.indexOf("ENTRENAMIENTO 6122 · v1.6")==0)c=q;}
if(!c)return "ERROR: no encuentro la copia";c.name=N;p.openSequence(c.sequenceID);p.save();
var a=p.activeSequence,ss=[];for(var i=0;i<p.sequences.numSequences;i++)ss.push(p.sequences[i].name);
return "activa: "+a.name+" | "+ss.join(" / ");})();
