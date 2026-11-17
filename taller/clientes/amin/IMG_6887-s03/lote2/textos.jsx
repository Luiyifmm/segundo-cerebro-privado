// Cambia textos de MOGRT (subtítulo v12: prop «Linea»; Flicker: prop 0) y fija la escala de Movimiento. CFG {"cambios":[{"de":..,"a":..,"esc":..}]}
(function(){var C={"cambios":[{"de":"lo que tendrías que hacer es","a":"tendrías que hacer es","esc":100},{"de":"5.000 – 10.000 €","a":"5 – 10 MIL €","esc":60}]},s=app.project.activeSequence,o=[];
function mov(cl){for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Movimiento")return cl.components[k];}
for(var t=1;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var cl=tr.clips[c],mg=null;try{mg=cl.getMGTComponent();}catch(e){}if(!mg)continue;
 for(var y=0;y<mg.properties.numItems;y++){var P=mg.properties[y];if(!(P.displayName=="Linea"||(cl.name=="Efecto Flicker Con Brillo"&&y==0)))continue;var j;try{j=JSON.parse(P.getValue());}catch(e){continue;}
  for(var q=0;q<C.cambios.length;q++){var X=C.cambios[q];if(j.textEditValue==X.de){j.textEditValue=X.a;j.fontTextRunLength=[X.a.length];P.setValue(JSON.stringify(j),true);if(cl.name!="Efecto Flicker Con Brillo")cl.name=X.a;mov(cl).properties[1].setValue(X.esc,true);o.push(X.a+" @"+cl.start.seconds.toFixed(2));}}}}}
app.project.save();return o.join(" | ");})();
