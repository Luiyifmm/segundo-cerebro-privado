(function(){var s=app.project.activeSequence,tr=s.videoTracks[0],o=[],F=s.getSettings().videoFrameRate.seconds;
for(var j=0;j<tr.clips.numItems-1;j++){var c=tr.clips[j],n=tr.clips[j+1],gap=n.start.seconds-c.end.seconds;
 if(gap>0.001&&gap<0.05){var e=new Time();e.seconds=n.start.seconds;var op=new Time();op.seconds=c.outPoint.seconds+gap;c.end=e;c.outPoint=op;o.push(c.end.seconds.toFixed(3)+" ("+c.name.replace("IMG_6122 · ","")+")");}}
var g=[];for(var j=0;j<tr.clips.numItems-1;j++){var d=tr.clips[j+1].start.seconds-tr.clips[j].end.seconds;if(Math.abs(d)>0.001)g.push(tr.clips[j].end.seconds.toFixed(3)+":"+d.toFixed(3));}
app.project.save();return "rellenados "+o.length+": "+o.join(", ")+" | huecos que quedan: "+(g.length?g.join(" "):"ninguno")+" | fotograma "+F.toFixed(4);})();
