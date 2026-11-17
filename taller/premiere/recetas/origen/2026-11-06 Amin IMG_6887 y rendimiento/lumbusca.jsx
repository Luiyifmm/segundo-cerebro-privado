(function(){var o=[];for(var i=0;i<app.project.sequences.numSequences;i++){var s=app.project.sequences[i],n=0,ej="",tot=0;
for(var t=0;t<Math.min(3,s.videoTracks.numTracks);t++){var T=s.videoTracks[t];for(var c=0;c<T.clips.numItems;c++){var cl=T.clips[c];tot++;for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Color de Lumetri"){n++;if(!ej)ej="V"+(t+1)+"@"+cl.start.seconds.toFixed(1)+" "+cl.name;}}}
o.push(s.name+" (id "+s.sequenceID+") clips="+tot+" lumetri="+n+" "+ej);}return o.join(" | ");})();
