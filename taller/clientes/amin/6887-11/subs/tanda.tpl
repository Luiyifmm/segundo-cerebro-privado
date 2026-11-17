(function(){var L=__L__,P0=20,T=254016000000,n=0;var s=app.project.activeSequence;
var tr=s.videoTracks[P0];if(__PRIMERA__){for(var c=tr.clips.numItems-1;c>=0;c--)tr.clips[c].remove(false,false);}
for(var c=0;c<tr.clips.numItems;c++)if(tr.clips[c].end.seconds>L[0][0]+0.01)return "ERROR pista no vacía desde "+L[0][0];
function seg(x){var y=new Time();y.seconds=x;return y;}
for(var i=0;i<L.length;i++){var u=L[i];var cl=s.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",String(Math.round(u[0]*T)),P0,0);if(!cl)continue;cl.end=seg(u[1]);
 var P=cl.getMGTComponent().properties;var V={"Glow de la palabra clave (0 = sin glow, 50 = normal)":0,"Tamano (50 = normal, 100 = doble)":u[4],"Sombra: distancia":16,"Sombra: difuminado":38,"Sombra: opacidad (0 a 100)":100};
 for(var y=0;y<P.numItems;y++){var nm=P[y].displayName;if(V[nm]!==undefined){P[y].setValue(V[nm],true);continue;}if(nm=="Color clave"){P[y].setColorValue(255,243,255,0,true);continue;}
  if(nm=="Linea"||nm=="Palabra clave"){var tx=(nm=="Linea"?u[2]:u[3]);var j=JSON.parse(P[y].getValue());j.textEditValue=tx;j.fontTextRunLength=[Math.max(1,tx.length)];P[y].setValue(JSON.stringify(j),true);}}
 cl.components[1].properties[0].setValue([0.5,u[3]?0.4375:0.466],true);cl.name=(u[2]+" | "+u[3]);n++;}
return "subs "+n+"/"+L.length;})();
