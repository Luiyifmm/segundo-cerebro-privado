// Escala los Flicker largos (factor 5/longitud, mín. 0.42) y los subtítulos de más de 24 caracteres (24/longitud). Relee.
(function(){var s=app.project.activeSequence,o=[];
function mov(cl){for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Movimiento")return cl.components[k];}
for(var t=1;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var cl=tr.clips[c],mg=null;try{mg=cl.getMGTComponent();}catch(e){}if(!mg)continue;
 var tx;if(cl.name=="Efecto Flicker Con Brillo"){tx=JSON.parse(mg.properties[0].getValue()).textEditValue;var f=tx.length>5?Math.max(0.42,5/tx.length):1;if(f<1){var M=mov(cl),e=M.properties[1].getValue();M.properties[1].setValue(e*f,true);o.push(tx+" "+e.toFixed(0)+"→"+M.properties[1].getValue().toFixed(0));}}
 else{tx=cl.name;if(tx.length>24){var M=mov(cl),e=M.properties[1].getValue();M.properties[1].setValue(e*24/tx.length,true);o.push(tx+" "+e.toFixed(0)+"→"+M.properties[1].getValue().toFixed(0));}}}}
app.project.save();return o.join(" | ");})();
