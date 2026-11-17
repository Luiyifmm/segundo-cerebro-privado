// El primer bloque de cada variante empieza con el mismo adelanto que el resto (antes del punto de entrada del fragmento).
(function(){var p=app.project,SQ={"6887-08 · JORDAN A fiel":1.698,"6887-08 · JORDAN B adaptado":1.765,"6887-08 · JORDAN C cinematografico":1.732},o=[];function seg(x){var y=new Time();y.seconds=x;return y;}
for(var n in SQ){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==n)p.openSequence(p.sequences[i].sequenceID);var s=p.activeSequence,v=s.videoTracks[5],c=v.clips[0];
 if(c.name.indexOf("ponte en forma")<0)return "ERROR primer clip "+c.name;c.start=seg(SQ[n]);o.push(n+": "+c.start.seconds.toFixed(3)+"-"+c.end.seconds.toFixed(3));}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);p.save();return o.join(" | ");})();
