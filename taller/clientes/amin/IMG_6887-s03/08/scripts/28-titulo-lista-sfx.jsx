// Duplicado «JORDAN A completo v1»: título nuevo amarillo (Jordan v4, letras al azar), lista con números amarillos sincronizada, SFX. Lo del usuario (V4 lista, V5 título, A5 tics) se DESACTIVA en este duplicado, no se borra.
(function(){var p=app.project,PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Jordan v4.mogrt",LI="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/",SX="/Users/luiyi/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/Sound Effects By Motionix /";
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);var s=p.activeSequence,o=[];
if(s.name!="6887-08 · JORDAN A completo v1")return "ERROR secuencia";
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
// desactivar capas del usuario en el duplicado
var d=0;for(var t=3;t<=4;t++){var tr=s.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){tr.clips[j].disabled=true;d++;}}
var a5=s.audioTracks[4];for(var j=0;j<a5.clips.numItems;j++){a5.clips[j].disabled=true;d++;}o.push("desactivados "+d);
app.enableQE();var q=qe.project.getActiveSequence();if(s.videoTracks.numTracks<10)q.addTracks(10-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
var FIN=19.333;
// título en dos líneas (V8, V9)
var TT=[["CAMBIA TU VIDA",7,107],["EN 6 MESES",8,101.5]];
for(var k=0;k<2;k++){var c=s.importMGT(PL,tk(0),TT[k][1],0);c.end=seg(FIN);c.outPoint=seg(FIN);var m=c.getMGTComponent();
 var pp=m.properties[13],js=JSON.parse(pp.getValue());js.textEditValue=TT[k][0];js.fontTextRunLength=[TT[k][0].length];pp.setValue(JSON.stringify(js),true);
 m.properties[11].setColorValue(255,245,197,66,true);m.properties[10].setValue(1,true);m.properties[9].setValue(4,true);m.properties[8].setValue(50,true);m.properties[7].setValue(TT[k][2],true);
 m.properties[2].setValue(true,true);m.properties[1].setValue(9+k*3,true);m.properties[0].setValue(35,true);c.name="TÍTULO · "+TT[k][0];}
// lista sincronizada (V10)
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var fs=[];for(var k=1;k<=12;k++)fs.push(LI+"lista v3 "+(k<10?"0":"")+k+".png");p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
var T=[1.693,2.423,3.123,4.403,6.403,8.023,9.683,11.163,13.643,14.463,15.78,18.193],v10=s.videoTracks[9];
for(var k=0;k<12;k++){var it=item("lista v3 "+(k<9?"0":"")+(k+1)+".png");v10.overwriteClip(it,seg(T[k]));var c=null;for(var j=0;j<v10.clips.numItems;j++)if(Math.abs(v10.clips[j].start.seconds-T[k])<0.04)c=v10.clips[j];c.end=seg(k<11?T[k+1]:FIN);c.name="LISTA v3 · "+(k+1);}
o.push("título 2 · lista "+v10.clips.numItems);
// SFX: pistas de audio nuevas
var n0=s.audioTracks.numTracks;q.addTracks(0,0,2,1,n0);s=p.activeSequence;
var sb=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="SFX (Claude)")sb=p.rootItem.children[i];
p.importFiles([SX+"Whooshes /Cinematic Low Whoosh.wav",SX+"Whooshes /Whoosh Deep Short.wav",SX+"Ui Sound Effects /Ui button.wav"],true,sb,false);
function sit(n){for(var i=0;i<sb.children.numItems;i++)if(sb.children[i].name==n)return sb.children[i];return null;}
function vol(c,db){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")c.components[k].properties[1].setValue(Math.pow(10,(db-15)/20),true);}
function poner(tr,it,t,dur,db,nom){tr.overwriteClip(it,seg(t));for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(Math.abs(c.start.seconds-t)<0.03){c.end=seg(t+dur);vol(c,db);c.name=nom;}}}
var at=s.audioTracks[n0],ar=s.audioTracks[n0+1];
for(var k=0;k<12;k++)poner(at,sit("Ui button.wav"),T[k],0.27,-14,"SFX tic lista "+(k+1));
var W=[[0,"Cinematic Low Whoosh.wav",1.5,-4,"SFX título"],[2.463,"Whoosh Deep Short.wav",1.0,-12,"SFX remate PORNO"],[15.063,"Whoosh Deep Short.wav",1.0,-12,"SFX remate CARO"],[21.343,"Whoosh Deep Short.wav",1.0,-12,"SFX remate POR DINERO"],[27.793,"Whoosh Deep Short.wav",1.0,-12,"SFX remate PLAN"]];
for(var k=0;k<W.length;k++)poner(ar,sit(W[k][1]),W[k][0],W[k][2],W[k][3],W[k][4]);
o.push("A"+(n0+1)+" "+at.clips.numItems+" · A"+(n0+2)+" "+ar.clips.numItems);
p.save();var F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",TS=[0.05,0.2,0.45,1.0,2.9,5.9,9.0,12.3,15.5,17.2,19.6,21.9,25.3,28.2,30.5,32.3];
for(var i=0;i<TS.length;i++){s.setPlayerPosition(tk(TS[i]));q.exportFramePNG(q.CTI.timecode,F+"c"+(i<10?"0":"")+i+".png");}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);
return o.join(" | ");})();
