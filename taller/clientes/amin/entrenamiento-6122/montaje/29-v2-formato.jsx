// Aplica el tratamiento aprobado (prueba logos-simple) a todo el vídeo. Solo en «ENTRENAMIENTO 6122 · v2 formato».
(function(){
var D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/prueba-formato/",PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",FIN=38.33,COMP=26.24;
var W=[255,255,255],RO=[230,40,40],AZ=[30,138,255];
// tarjetas: [nombre, pista (4=izq POBRE, 5=der RICO), entra, sale]
var CA=[["medias",4,0.0,2.72],["iphone",4,2.72,4.93],["logos",4,4.93,9.71],["simple",5,7.72,9.71],["coche",4,9.71,14.37],["casa",4,14.37,20.28],["invertir",5,16.91,20.28],["banco",4,20.28,23.43],["cocinar",5,23.43,26.24]];
var TX=[[0.0,1.24,"¿Pagar a medias con tu novia?",W],[1.62,2.03,"TRISTE",RO],[2.03,2.72,"Y DE MEDIOCRE",RO],
[2.72,3.84,"¿Tener el último iPhone?",W],[4.26,4.93,"DE POBRE",RO],
[4.93,6.0,"¿Llevar ropa con logos?",W],[6.2,7.2,"DE POBRE",RO],[7.2,7.72,"MEDIOCRE",RO],
[7.73,8.61,"¿Llevar ropa simple?",W],[9.02,9.71,"DE RICO",AZ],
[9.71,10.57,"¿Comprarte un coche?",W],[10.98,11.44,"DE POBRE",RO],[11.44,12.65,"CASI SIEMPRE",RO],[12.65,13.45,"PERO DE RICO",AZ],[13.45,14.37,"SI SABES COMPRARLO",AZ],
[14.37,15.75,"¿Comprarte una casa para vivir?",W],[16.15,16.91,"DE POBRE",RO],
[16.91,18.23,"¿Y si es para invertir en ella?",W],[18.65,19.67,"DE RICO",AZ],[19.67,20.28,"MUY RICO",AZ],
[20.28,21.56,"¿Dejar el dinero en el banco?",W],[21.99,22.57,"DE POBRE",RO],[22.57,23.43,"PORQUE TE ARRUINA",RO],
[23.43,24.64,"¿Cocinar para ti?",W],[24.64,25.3,"O ERES POBRE",RO],[25.3,26.24,"O ERES MUY RICO",AZ],
[26.24,27.65,"Los pobres gastan dinero",W],[27.65,28.33,"para aparentar",W],[28.33,29.75,"Los ricos invierten",W],[29.75,30.87,"en conocimiento",W],[30.87,31.76,"que les hará ganar",W],[31.76,32.88,"mucho más dinero",W],
[32.88,33.65,"Si quieres aprender",W],[33.65,34.42,"una habilidad online",W],[34.42,35.58,"para poder ganar dinero",W],[35.58,37.5,"y vivir la vida que quieres",W],[37.5,FIN,"COMENTA RICO",AZ]];
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
var p=app.project,s=p.activeSequence;if(s.name!="ENTRENAMIENTO 6122 · v2 formato")return "ERROR: secuencia equivocada";
app.enableQE();var q=qe.project.getActiveSequence(),o=[];
var v1=s.videoTracks[0];for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j];c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);}
o.push("V1 abierto "+v1.clips.numItems);
var dis=0;for(var t=1;t<=3;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){tr.clips[j].disabled=true;dis++;}}o.push("desactivados "+dis);
if(s.videoTracks.numTracks<8)q.addTracks(8-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
if(s.videoTracks.numTracks<8)return "ERROR: pistas";for(var t=4;t<8;t++)if(s.videoTracks[t].clips.numItems)return "ERROR: V"+(t+1)+" ocupada";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="PRUEBA FORMATO")bin=p.rootItem.children[i];
var fs=[];for(var i=0;i<CA.length;i++){var ok=false;for(var k=0;k<bin.children.numItems;k++)if(bin.children[k].name=="tarjeta "+CA[i][0]+".png")ok=true;if(!ok)fs.push(D+"tarjeta "+CA[i][0]+".png");}
if(fs.length)p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
function poner(n,t,a,b,fade){var it=item(n);if(!it)return "FALTA "+n;var tr=s.videoTracks[t];tr.overwriteClip(it,seg(a));var c=null;
 for(var j=0;j<tr.clips.numItems;j++)if(Math.abs(tr.clips[j].start.seconds-a)<0.02)c=tr.clips[j];if(!c)return "no colocado "+n;
 c.end=seg(b);c.name="FORMATO · "+n;c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);
 if(fade){var op=c.components[0].properties[0],i0=c.inPoint.seconds;op.setTimeVarying(true);op.addKey(i0);op.setValueAtKey(i0,0,true);op.addKey(i0+0.2);op.setValueAtKey(i0+0.2,100,true);}
 return n+" "+c.start.seconds.toFixed(2)+"-"+c.end.seconds.toFixed(2);}
for(var i=0;i<CA.length;i++)o.push(poner("tarjeta "+CA[i][0]+".png",CA[i][1],CA[i][2],CA[i][3],true));
o.push(poner("etiquetas POBRE RICO.png",6,0.0,COMP,false));
var nt=0;for(var i=0;i<TX.length;i++){var a=TX[i],c=s.importMGT(PL,tk(a[0]),7,0);c.end=seg(a[1]);c.outPoint=seg(a[1]-a[0]);var m=c.getMGTComponent();
 function txt(k,t){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(j),true);}
 txt(16,"");txt(15,a[2]);m.properties[14].setColorValue(255,a[3][0],a[3][1],a[3][2],true);
 m.properties[0].setValue(0,true);m.properties[10].setValue(true,true);m.properties[9].setValue(100,true);m.properties[8].setValue(38,true);m.properties[7].setValue(16,true);
 m.properties[3].setValue(a[2].length>9?Math.round(67.89*11/a[2].length*10)/10:67.89,true);c.name="FORMATO · "+a[2];nt++;}
var v8=s.videoTracks[7];o.push("textos "+nt+" / en V8 "+v8.clips.numItems);
p.save();return o.join(" | ");})();
