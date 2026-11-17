(function(){var L=[[32.581, 33.741, "aprender una"], [33.741, 35.684, "como ser"], [35.684, 37.125, "y simplemente con"], [37.125, 38.385, "saber ganar músculo"], [38.385, 39.204, "perder grasa"], [39.204, 40.464, "vender tus asesorías"], [40.464, 41.245, "a otras personas"], [41.245, 41.974, "y ganar entre"], [43.035, 44.782, "todos los meses"], [44.782, 46.083, "simplemente ayudando"], [46.083, 47.143, "a otros a cambiar"], [47.143, 47.804, "y verse bien"]],P0=5,COL=[255, 255, 255],Y=0.4606,T=254016000000,n=0;var s=app.project.activeSequence;var tr=s.videoTracks[P0];
for(var c=0;c<tr.clips.numItems;c++)if(tr.clips[c].end.seconds>L[0][0]+0.01)return "ERROR pista no vacía desde "+L[0][0];
function seg(x){var y=new Time();y.seconds=x;return y;}
var V={"Glow de la palabra clave (0 = sin glow, 50 = normal)":0,"Alinear a la izquierda":false,"Tamano (50 = normal, 100 = doble)":100};
for(var i=0;i<L.length;i++){var u=L[i];var cl=s.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",String(Math.round(u[0]*T)),P0,0);if(!cl)continue;cl.end=seg(u[1]);
 var P=cl.getMGTComponent().properties;for(var y=0;y<P.numItems;y++){var nm=P[y].displayName;if(V[nm]!==undefined){P[y].setValue(V[nm],true);continue;}if(nm=="Color linea"){P[y].setColorValue(255,COL[0],COL[1],COL[2],true);continue;}
  if(nm=="Linea"||nm=="Palabra clave"){var tx=(nm=="Linea"?u[2]:"");var j=JSON.parse(P[y].getValue());j.textEditValue=tx;j.fontTextRunLength=[Math.max(1,tx.length)];P[y].setValue(JSON.stringify(j),true);}}
 cl.components[1].properties[0].setValue([0.5,Y],true);cl.name=u[2];n++;}
return "colocados "+n+"/"+L.length;})();
