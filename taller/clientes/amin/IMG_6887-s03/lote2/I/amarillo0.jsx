(function(){var L=[[2.813, 3.829, "estos 5 números"], [6.108, 6.755, "lo básico"], [9.59, 10.39, "sin remordimientos"], [10.951, 11.655, "lo que quieras"], [13.191, 13.751, "deudas,"], [15.072, 15.941, "a invertir"], [23.245, 24.006, "a largo plazo"], [24.586, 25.327, "inversiones"], [26.447, 27.217, "cada mes"], [30.999, 31.3, "pobre"], [32.981, 33.741, "habilidad"], [34.602, 35.684, "entrenador online"]],P0=6,COL=[243, 255, 0],Y=0.5056,T=254016000000,n=0;var s=app.project.activeSequence;var tr=s.videoTracks[P0];
for(var c=0;c<tr.clips.numItems;c++)if(tr.clips[c].end.seconds>L[0][0]+0.01)return "ERROR pista no vacía desde "+L[0][0];
function seg(x){var y=new Time();y.seconds=x;return y;}
var V={"Glow de la palabra clave (0 = sin glow, 50 = normal)":0,"Alinear a la izquierda":false,"Tamano (50 = normal, 100 = doble)":100};
for(var i=0;i<L.length;i++){var u=L[i];var cl=s.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",String(Math.round(u[0]*T)),P0,0);if(!cl)continue;cl.end=seg(u[1]);
 var P=cl.getMGTComponent().properties;for(var y=0;y<P.numItems;y++){var nm=P[y].displayName;if(V[nm]!==undefined){P[y].setValue(V[nm],true);continue;}if(nm=="Color linea"){P[y].setColorValue(255,COL[0],COL[1],COL[2],true);continue;}
  if(nm=="Linea"||nm=="Palabra clave"){var tx=(nm=="Linea"?u[2]:"");var j=JSON.parse(P[y].getValue());j.textEditValue=tx;j.fontTextRunLength=[Math.max(1,tx.length)];P[y].setValue(JSON.stringify(j),true);}}
 cl.components[1].properties[0].setValue([0.5,Y],true);cl.name=u[2];n++;}
return "colocados "+n+"/"+L.length;})();
