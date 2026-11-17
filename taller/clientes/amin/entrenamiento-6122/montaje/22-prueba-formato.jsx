// Prueba de formato (referencia comparaciones): bloque logos+simple, 4.93–9.71. Solo en la secuencia PRUEBA FORMATO.
(function(){
var A=4.93,Z=9.71,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/prueba-formato/",PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt";
var TX=[[4.93,6.0,"¿Llevar ropa con logos?",[255,255,255]],[6.27,7.72,"DE POBRE",[230,40,40]],[7.72,8.61,"¿Llevar ropa simple?",[255,255,255]],[9.01,9.71,"DE RICO",[30,138,255]]];
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
var p=app.project,s=p.activeSequence;if(s.name!="PRUEBA FORMATO · logos-simple")return "ERROR: secuencia equivocada";
app.enableQE();var q=qe.project.getActiveSequence(),o=[];
// 1) plano abierto (bruto completo) en el bloque
var v1=s.videoTracks[0];for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j];if(c.start.seconds>=A-0.02&&c.start.seconds<Z-0.02){c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);o.push("V1 "+c.name);}}
// 2) desactivar (no borrar) lo viejo de V2-V4 en el bloque
var dis=0;for(var t=1;t<=3;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.start.seconds>=A-0.02&&c.start.seconds<Z-0.02){c.disabled=true;dis++;}}}
o.push("desactivados "+dis);
// 3) pistas nuevas V5-V8
if(s.videoTracks.numTracks<8)q.addTracks(8-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
if(s.videoTracks.numTracks<8)return "ERROR: no se crearon pistas";
for(var t=4;t<8;t++)if(s.videoTracks[t].clips.numItems)return "ERROR: V"+(t+1)+" no está vacía";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="PRUEBA FORMATO")bin=p.rootItem.children[i];
if(!bin)bin=p.rootItem.createBin("PRUEBA FORMATO");
if(bin.children.numItems==0)p.importFiles([D+"tarjeta logos.png",D+"tarjeta simple.png",D+"etiquetas POBRE RICO.png"],true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
function poner(n,t,a,b,fade){var it=item(n);if(!it)return "falta "+n;var tr=s.videoTracks[t];tr.overwriteClip(it,seg(a));var c=tr.clips[tr.clips.numItems-1];
 c.end=seg(b);c.name="PRUEBA · "+n;c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);
 if(fade){var op=c.components[0].properties[0],i0=c.inPoint.seconds;op.setTimeVarying(true);op.addKey(i0);op.setValueAtKey(i0,0,true);op.addKey(i0+0.2);op.setValueAtKey(i0+0.2,100,true);}
 return n+" "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2);}
o.push(poner("tarjeta logos.png",4,4.93,Z,true));o.push(poner("tarjeta simple.png",5,7.72,Z,true));o.push(poner("etiquetas POBRE RICO.png",6,A,Z,false));
// 4) textos
var dflt="";for(var i=0;i<TX.length;i++){var a=TX[i],c=s.importMGT(PL,tk(a[0]),7,0);c.end=seg(a[1]);c.outPoint=seg(a[1]-a[0]);var m=c.getMGTComponent();
 function txt(k,t){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(j),true);}
 if(i==0)dflt="altura "+m.properties[4].getValue();
 txt(16,"");txt(15,a[2]);m.properties[14].setColorValue(255,a[3][0],a[3][1],a[3][2],true);
 m.properties[0].setValue(0,true);m.properties[10].setValue(true,true);m.properties[9].setValue(100,true);m.properties[8].setValue(38,true);m.properties[7].setValue(16,true);
 m.properties[3].setValue(a[2].length>9?Math.round(67.89*11/a[2].length*10)/10:67.89,true);
 c.name="PRUEBA · "+a[2];}
o.push(dflt);
s.setInPoint(A);s.setOutPoint(Z);p.save();
var F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[5.4,6.9,8.2,9.4];
for(var i=0;i<T.length;i++){s.setPlayerPosition(tk(T[i]));q.exportFramePNG(q.CTI.timecode,F+"pf"+i+".png");}
return o.join(" | ");})();
