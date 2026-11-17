(function(){var s=app.project.activeSequence,o=[];var A=[[0,3.84],[1,2.72]];
for(var x=0;x<A.length;x++){var a=s.audioTracks[A[x][0]];for(var i=0;i<a.clips.numItems;i++){var c=a.clips[i];if(Math.abs(c.start.seconds-A[x][1])<0.03)
 for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen"){c.components[k].properties[1].setValue(Math.pow(10,(7-15)/20),true);o.push("A"+(A[x][0]+1)+" "+c.start.seconds.toFixed(2)+" → +7 dB");}}}
app.project.save();return o.join(" | ");})();
