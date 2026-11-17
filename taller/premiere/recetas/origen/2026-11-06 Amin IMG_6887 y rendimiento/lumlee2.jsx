(function(){var s=null;for(var i=0;i<app.project.sequences.numSequences;i++)if(app.project.sequences[i].name=="Secuencia 01")s=app.project.sequences[i];
if(!s)return "no";var o=["tracks "+s.videoTracks.numTracks];for(var t=0;t<s.videoTracks.numTracks;t++){var T=s.videoTracks[t];o.push("V"+(t+1)+" n="+T.clips.numItems);}return o.join(" | ");})();
