(function(){var s=app.project.activeSequence;if(s.name!="ENTRENAMIENTO 6122 · v2 formato")return "ERROR";var v8=s.videoTracks[7],n=0;
for(var j=0;j<v8.clips.numItems;j++){var c=v8.clips[j];if(c.start.seconds>26.2&&c.start.seconds<37.4){c.getMGTComponent().properties[3].setValue(28,true);n++;}}
app.project.save();return "moraleja a 28: "+n;})();
