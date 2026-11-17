(function(){var tr=app.project.activeSequence.videoTracks[1],o="no encontrado";
for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j],g=c.getMGTComponent(),p=g.properties[16],J=JSON.parse(p.getValue());
 if(J.textEditValue=="¿Y llevar ropa simple?"){J.textEditValue="¿Llevar ropa simple?";J.fontTextRunLength=[J.textEditValue.length];p.setValue(JSON.stringify(J),true);c.name="PREGUNTA · ¿Llevar ropa simple? ";o="cambiado en "+c.start.seconds.toFixed(2);}}
app.project.save();return o;})();
