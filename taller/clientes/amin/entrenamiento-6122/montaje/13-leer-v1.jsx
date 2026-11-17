(function(){var s=app.project.activeSequence,o=[];for(var t=0;t<2;t++){var tr=t==0?s.videoTracks[0]:s.audioTracks[0];
for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];o.push((t?"A1 ":"V1 ")+c.start.seconds.toFixed(3)+"-"+c.end.seconds.toFixed(3)+" in "+c.inPoint.seconds.toFixed(3)+" "+c.name.replace("IMG_6122 · ",""));}}
return o.join("\n");})();
