// Adelanta el inicio de 4 subtítulos a su primera palabra (WhisperX sobre la exportación v1); recorta el anterior.
(function(){var s=app.project.activeSequence,v3=s.videoTracks[2],A={"SUB · y tu vida cambia":0.67,"SUB · las historias":7.78,"SUB · y no le cuentes":8.76,"SUB · y cómo puedes ganar":27.02},o=[];function seg(x){var y=new Time();y.seconds=x;return y;}
for(var j=1;j<v3.clips.numItems;j++){var c=v3.clips[j];if(A[c.name]!=null){var t=A[c.name],pr=v3.clips[j-1];pr.end=seg(t);c.start=seg(t);o.push(c.name+" "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2)+" (ant. "+pr.end.seconds.toFixed(2)+")");}}
app.project.save();return o.join(" | ");})();
