// v2.2: las tarjetas entran con la palabra pobre/rico (fundido 0,25 s, 0,1 s antes). Antiguas V5-V7 desactivadas; nuevas en V9 (POBRE), V10 (RICO), V11 (etiquetas).
(function(){var s=app.project.activeSequence;if(s.name!="ENTRENAMIENTO 6122 · v2.2")return "ERROR: secuencia";
var CA=[["medias",8,2.08,4.36],["iphone",8,4.36,6.32],["logos",8,6.32,11.08],["simple",9,9.16,11.08],["coche",8,11.08,16.27],["casa",8,16.27,22.09],["invertir",9,18.79,22.09],["banco",8,22.09,24.88],["cocinar",8,24.88,26.24],["cocinar",9,25.74,26.24]];
function seg(x){var y=new Time();y.seconds=x;return y;}
app.enableQE();var q=qe.project.getActiveSequence(),p=app.project,o=[];
for(var t=4;t<=6;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++)tr.clips[j].disabled=true;}
if(s.videoTracks.numTracks<11)q.addTracks(11-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
if(s.videoTracks.numTracks<11)return "ERROR: pistas";for(var t=8;t<11;t++)if(s.videoTracks[t].clips.numItems)return "ERROR: V"+(t+1)+" ocupada";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="PRUEBA FORMATO")bin=p.rootItem.children[i];
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
function poner(n,t,a,b,fade,nombre){var it=item(n);if(!it)return "FALTA "+n;var tr=s.videoTracks[t];tr.overwriteClip(it,seg(a));var c=null;
 for(var j=0;j<tr.clips.numItems;j++)if(Math.abs(tr.clips[j].start.seconds-a)<0.02)c=tr.clips[j];if(!c)return "no colocado "+n;
 c.end=seg(b);c.name=nombre;c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);
 if(fade){var op=c.components[0].properties[0],i0=c.inPoint.seconds;op.setTimeVarying(true);op.addKey(i0);op.setValueAtKey(i0,0,true);op.addKey(i0+0.25);op.setValueAtKey(i0+0.25,100,true);}
 return nombre.replace("PALABRA · ","")+" V"+(t+1)+" "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2);}
// cocinar en RICO necesita otra tarjeta colocada a la derecha
var D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/prueba-formato/";
if(!item("tarjeta cocinar izquierda.png"))p.importFiles([D+"tarjeta cocinar izquierda.png"],true,bin,false);
for(var i=0;i<CA.length;i++){var n="tarjeta "+CA[i][0]+".png";
 if(CA[i][0]=="cocinar"&&CA[i][1]==8)n="tarjeta cocinar izquierda.png";
 if(CA[i][0]=="medias"||CA[i][0]=="iphone"||CA[i][0]=="logos"||CA[i][0]=="coche"||CA[i][0]=="casa"||CA[i][0]=="banco"||CA[i][0]=="simple"||CA[i][0]=="invertir"||CA[i][0]=="cocinar")
 o.push(poner(n,CA[i][1],CA[i][2],CA[i][3],true,"PALABRA · "+CA[i][0]+(CA[i][1]==8?" (POBRE)":" (RICO)")));}
o.push(poner("etiquetas POBRE RICO.png",10,0.0,26.24,false,"PALABRA · etiquetas"));
app.project.save();var F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[1.5,2.4,4.2,4.6,9.0,9.5,13.0,18.7,19.2,25.1,26.0];
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"w_"+("0"+i).slice(-2)+".png");}
return o.join(" | ");})();
