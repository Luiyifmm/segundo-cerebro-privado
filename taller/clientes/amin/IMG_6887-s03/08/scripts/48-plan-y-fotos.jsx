(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A2 enfasis selectivo")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence;if(s.name!="6887-08 · JORDAN A2 enfasis selectivo")return "ERROR";function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
var v6=s.videoTracks[5],v7=s.videoTracks[6],T=28.62,o=[];
for(var j=0;j<v6.clips.numItems;j++){var c=v6.clips[j];if(c.name=="JORDAN A2 · y te estaré enviando")c.start=seg(T);if(c.name=="JORDAN A2 · comenta la palabra")c.end=seg(T);}
for(var j=0;j<v7.clips.numItems;j++){var c=v7.clips[j];if(c.name=="JORDAN A2 · ÉNFASIS · PLAN"){c.end=seg(T);o.push("PLAN "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2));}}
p.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/";
for(var i=0;i<10;i++){s.setPlayerPosition(tk(2.80+i/30+0.001));q.exportFramePNG(q.CTI.timecode,F+"e"+i+".png");}
for(var i=0;i<4;i++){s.setPlayerPosition(tk(3.24+i/30+0.001));q.exportFramePNG(q.CTI.timecode,F+"n"+i+".png");}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return o.join(" | ");})();
