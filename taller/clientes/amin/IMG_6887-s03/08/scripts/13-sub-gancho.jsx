// El subtítulo «en 6 MESES» repetía el título: queda como línea blanca «en 6 meses», sin clave.
(function(){var s=app.project.activeSequence,v3=s.videoTracks[2],n=0;for(var j=0;j<v3.clips.numItems;j++){var c=v3.clips[j];if(c.name=="SUB · en 6 MESES"){var m=c.getMGTComponent();
 function txt(k,t){var pp=m.properties[k],js=JSON.parse(pp.getValue());js.textEditValue=t;js.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(js),true);}txt(16,"en 6 meses");txt(15,"");c.name="SUB · en 6 meses";n++;}}
app.project.save();return "cambiados "+n;})();
