// A3: desactiva la lista v3 (V10, no se borra) y saca fotogramas limpios para maquetar la lista nueva.
(function(){var S=app.project.activeSequence,o=[];var tr=S.videoTracks[9];
for(var j=0;j<tr.clips.numItems;j++){if(tr.clips[j].name.indexOf("LISTA v3")==0)tr.clips[j].disabled=true;}
o.push("V10 desactivada: "+tr.clips.numItems);
app.enableQE();var q=qe.project.getActiveSequence();var T=[4.0,12.0,15.5,19.0];
for(var i=0;i<T.length;i++){var t=new Time();t.seconds=T[i];S.setPlayerPosition(t.ticks);q=qe.project.getActiveSequence();q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi--claude-spares-spare-etg1hl/0d22a94f-a15b-4efe-b916-aac1a66574f3/scratchpad/a3/limpio_"+T[i]+".png");}
return o.join(" | ");})();
