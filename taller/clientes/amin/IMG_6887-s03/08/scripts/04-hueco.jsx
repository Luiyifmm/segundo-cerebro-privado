(function(){var s=app.project.activeSequence,o=[];function seg(x){var y=new Time();y.seconds=x;return y;}
var tr=[s.videoTracks[0],s.audioTracks[0]];for(var k=0;k<2;k++)for(var j=0;j<tr[k].clips.numItems-1;j++){var c=tr[k].clips[j],n=tr[k].clips[j+1];var g=n.start.seconds-c.end.seconds;if(g>0.001&&g<0.05){c.end=seg(n.start.seconds);o.push((k?"A":"V")+" "+c.name+" → "+c.end.seconds.toFixed(3));}}
app.project.save();return o.join(" | ")||"nada";})();
