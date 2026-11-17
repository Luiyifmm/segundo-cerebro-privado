// A4 = duplicado de A3: lista en UNA columna con números desde el inicio (v6), clic minimalista (Mouse Click 02) en vez del clic digital,
// zooms sin paneo. En A4 se DESACTIVA lo sustituido (lista v4, clics A12); no se borra nada. A3 no se toca.
(function(){var p=app.project,o=[],N="6887-08 · JORDAN A4 lista 1 col + clic";
function seg(x){var y=new Time();y.seconds=x;return y;}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ya existe A4";
var A3=p.activeSequence;if(A3.name!="6887-08 · JORDAN A3 zooms + lista 2 col")return "ERROR activa";
var ids={};for(var i=0;i<p.sequences.numSequences;i++)ids[p.sequences[i].sequenceID]=1;A3.clone();var S=null;for(var i=0;i<p.sequences.numSequences;i++)if(!ids[p.sequences[i].sequenceID])S=p.sequences[i];
S.name=N;p.openSequence(S.sequenceID);S=p.activeSequence;if(S.name!=N)return "ERROR no abre A4";
// 1) lista: desactivar v4, poner v6
var tl=S.videoTracks[11],TL=[];for(var j=0;j<tl.clips.numItems;j++){var c=tl.clips[j];if(c.name.indexOf("LISTA v4")==0){TL.push([c.start.seconds,c.end.seconds]);c.disabled=true;}}
if(TL.length!=12)return "ERROR lista v4 "+TL.length;
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var LI="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/",fs=[];for(var k=0;k<=12;k++)fs.push(LI+"lista v6 "+(k<10?"0":"")+k+".png");p.importFiles(fs,true,bin,false);
function item(b,n){for(var i=0;i<b.children.numItems;i++)if(b.children[i].name==n)return b.children[i];return null;}
app.enableQE();var q=qe.project.getActiveSequence();q.addTracks(1,S.videoTracks.numTracks,0);S=p.activeSequence;var tv=S.videoTracks[S.videoTracks.numTracks-1];
var T=[[0,TL[0][0]]];for(var k=0;k<12;k++)T.push(TL[k]);
for(var k=0;k<=12;k++){var it=item(bin,"lista v6 "+(k<10?"0":"")+k+".png");if(!it)return "falta v6 "+k;tv.overwriteClip(it,seg(T[k][0]));var c=null;for(var j=0;j<tv.clips.numItems;j++)if(Math.abs(tv.clips[j].start.seconds-T[k][0])<0.04)c=tv.clips[j];c.end=seg(T[k][1]);c.name="LISTA v6 · "+(k==0?"números":k);}
o.push("lista v6 "+tv.clips.numItems+" en V"+S.videoTracks.numTracks);
// 2) clic: desactivar A12 (Uu Click Digital) y poner Mouse Click 02 en una pista nueva, a los mismos tiempos
var a12=S.audioTracks[11],TC=[];for(var j=0;j<a12.clips.numItems;j++){var c=a12.clips[j];TC.push(c.start.seconds);c.disabled=true;}
var sb=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="SFX (Claude)")sb=p.rootItem.children[i];
var CF="/Users/luiyi/Library/CloudStorage/GoogleDrive-luiscarlosmercadoleon@gmail.com/Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/06 Teclado y clics/Mouse Click 02.wav";
if(!item(sb,"Mouse Click 02.wav"))p.importFiles([CF],true,sb,false);var ci=item(sb,"Mouse Click 02.wav");if(!ci)return "ERROR no importa el clic";
var n0=S.audioTracks.numTracks;q=qe.project.getActiveSequence();q.addTracks(0,0,1,1,n0);S=p.activeSequence;var ta=S.audioTracks[S.audioTracks.numTracks-1];
function vol(c,db){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")c.components[k].properties[1].setValue(Math.pow(10,(db-15)/20),true);}
for(var k=0;k<TC.length;k++){ta.overwriteClip(ci,seg(TC[k]));for(var j=0;j<ta.clips.numItems;j++){var c=ta.clips[j];if(Math.abs(c.start.seconds-TC[k])<0.02){vol(c,0);c.name="SFX3 clic mínimo "+(k+1);}}}
o.push("clics "+ta.clips.numItems+" en A"+S.audioTracks.numTracks+" (A12 desactivada)");
// 3) zooms sin paneo (la columna derecha ya no existe)
var z=S.videoTracks[2].clips[0],TR=null;for(var k=0;k<z.components.numItems;k++)if(z.components[k].displayName=="Transformar")TR=z.components[k];
var P=TR.properties[1];P.setTimeVarying(false);P.setValue([0.5,0.5],true);o.push("paneo quitado");
return o.join(" | ");})();
