// Propuesta: (1) recorta subtítulos que se cruzan con un Flicker, (2) texto de Flicker, (3) reencuadre alterno de V1 (escala A/B, centro desplazado hacia la cara).
(function(){var C={"escalas":[112,125],"bajar":0.2},s=app.project.activeSequence,o=[];var F=[];
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++)if(tr.clips[c].name=="Efecto Flicker Con Brillo")F.push(tr.clips[c]);}
var n=0;for(var t=1;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var cl=tr.clips[c];if(cl.name=="Efecto Flicker Con Brillo")continue;var mg=null;try{mg=cl.getMGTComponent();}catch(e){}if(!mg)continue;
 for(var f=0;f<F.length;f++){var fa=F[f].start.seconds;if(cl.start.seconds<fa-0.01&&fa<cl.end.seconds-0.01){var y=new Time();y.seconds=fa-0.02;cl.end=y;n++;}}}}
o.push("subs recortados "+n);
if(C.textos){for(var f=0;f<F.length;f++){var G=F[f].getMGTComponent().properties[0],j=JSON.parse(G.getValue());if(C.textos[j.textEditValue]){var nt=C.textos[j.textEditValue];j.textEditValue=nt;j.fontTextRunLength=[nt.length];G.setValue(JSON.stringify(j),true);o.push("texto "+nt);}}}
if(C.escalas){var v=s.videoTracks[0];for(var c=0;c<v.clips.numItems;c++){var M=null,cl=v.clips[c];for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Movimiento")M=cl.components[k];var e=C.escalas[c%C.escalas.length];M.properties[1].setValue(e,true);M.properties[0].setValue([0.5,0.5+C.bajar*(e-100)/100],true);}o.push("V1 reencuadrada "+v.clips.numItems);}
app.project.save();return o.join(" | ");})();
