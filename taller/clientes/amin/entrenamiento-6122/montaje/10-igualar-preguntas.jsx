(function(){var Dif={4.93:10.0,7.72:8.5,16.91:7.5,20.28:7.1,23.43:11.5},a=app.project.activeSequence.audioTracks[1],o=[];
for(var i=0;i<a.clips.numItems;i++){var c=a.clips[i],t=Math.round(c.start.seconds*100)/100,d=0;for(var k in Dif)if(Math.abs(k-t)<0.03)d=Dif[k];
 for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen"){c.components[k].properties[1].setValue(Math.pow(10,(14-d-15)/20),true);o.push(t+":"+(14-d)+"dB");}}
app.project.save();return o.join(" ");})();
