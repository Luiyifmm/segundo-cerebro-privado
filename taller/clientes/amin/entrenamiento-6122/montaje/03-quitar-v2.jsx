(function(){var s=app.project.activeSequence,v2=s.videoTracks[1],n=0;
for(var j=v2.clips.numItems-1;j>=0;j--){var c=v2.clips[j];if(c.name.indexOf("IMG_6122")!=0)return "ERROR: hay en V2 algo que no es mío: "+c.name;c.remove(false,false);n++;}
app.project.save();
var o=[];for(var t=0;t<3;t++)o.push("V"+(t+1)+" "+s.videoTracks[t].clips.numItems+" A"+(t+1)+" "+s.audioTracks[t].clips.numItems);
return "quitados "+n+" | "+o.join(" | ");})();
