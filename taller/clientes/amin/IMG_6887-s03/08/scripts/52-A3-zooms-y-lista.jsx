// A3 (duplicado de A2): 1) capa de ajuste nueva con «Transformar» (zoom out inicial al estilo del usuario + zooms cortos de Jordan)
// en una pista NUEVA justo encima del color (V2), por debajo de todos los textos; 2) lista v4 en dos columnas en una pista nueva arriba.
// Nada se borra: la lista v3 (V10 antigua) ya está desactivada en A3.
(function(){var p=app.project,S=p.activeSequence,o=[];
if(S.name!="6887-08 · JORDAN A3 zooms + lista 2 col")return "ERROR secuencia";
function seg(x){var y=new Time();y.seconds=x;return y;}
var ADJ=S.videoTracks[1].clips[0].projectItem; if(ADJ.name!="Capa de ajuste")return "ERROR no encuentro la capa de ajuste";
var FIN=S.videoTracks[0].clips[S.videoTracks[0].clips.numItems-1].end.seconds;
app.enableQE();var q=qe.project.getActiveSequence();
// --- 1) ZOOM ---
q.addTracks(1,2,0);S=p.activeSequence;var tz=S.videoTracks[2];if(tz.clips.numItems)return "ERROR la pista nueva no está vacía";
tz.overwriteClip(ADJ,seg(0));var z=tz.clips[0];z.end=seg(FIN);z.name="ZOOM · Transformar (Claude)";
q=qe.project.getActiveSequence();var qc=q.getVideoTrackAt(2).getItemAt(0);qc.addVideoEffect(qe.project.getVideoEffectByName("Transformar"));
var T=null;for(var k=0;k<z.components.numItems;k++)if(z.components[k].displayName=="Transformar")T=z.components[k];if(!T)return "ERROR sin Transformar";
T.properties[2].setValue(true,true);T.properties[9].setValue(false,true);T.properties[10].setValue(360,true); // como el usuario: desenfoque de movimiento
var E=T.properties[3],base=z.inPoint.seconds-z.start.seconds;E.setTimeVarying(true);
var K={};function key(t,v){t=Math.round(t*1000)/1000;K[t]=v;}
function mover(t0,dur,a,b,curva){for(var i=0;i<curva.length;i++)key(t0+dur*curva[i][0],a+(b-a)*curva[i][1]);}
var OUT=[[0,0],[0.2,0.45],[0.4,0.72],[0.6,0.88],[1,1]];          // ease-out medido en Jordan (60 % del recorrido en el primer 40 %)
var LENTO=[[0,0],[0.1,0.19],[0.25,0.44],[0.45,0.7],[0.7,0.91],[1,1]];
var ZI=108;
mover(0,1.8,130.9,100,LENTO);           // zoom out del inicio (tu receta: 130,9 % → 100)
mover(3.23,0.4,100,ZI,OUT);              // cero móvil
mover(6.57,0.4,ZI,100,OUT);              // deja de mirar
mover(9.70,0.4,100,ZI,OUT);              // sal del grupo
mover(13.73,0.4,ZI,100,OUT);             // aprende a vender
mover(15.77,0.4,100,ZI,OUT);             // te van a odiar
key(19.483,ZI);key(19.50,100);           // en tu corte a 125 % (19,50) vuelve a 100 de golpe: el salto lo da tu plano
mover(20.53,0.4,100,ZI,OUT);             // deja de cambiar horas por dinero
mover(22.27,0.4,ZI,100,OUT);             // si tú quieres aprender
mover(25.17,0.4,100,ZI,OUT);             // decenas de miles de euros
key(27.283,ZI);key(27.30,100);           // corte del CTA
mover(28.20,0.4,100,106,OUT);            // PLAN
mover(28.60,FIN-28.60,106,109,[[0,0],[1,1]]); // cierre: acercamiento lento (Jordan +3 % al final)
var n=0;for(var t in K){var tt=seg(parseFloat(t)+base);E.addKey(tt);E.setValueAtKey(tt,K[t],true);n++;}
o.push("zoom: "+n+" claves en V3, fin "+FIN.toFixed(2));
// --- 2) LISTA v4 ---
var old=S.videoTracks[10];var TL=[];for(var j=0;j<old.clips.numItems;j++){var c=old.clips[j];if(c.name.indexOf("LISTA v3")==0)TL.push([c.start.seconds,c.end.seconds]);}
if(TL.length!=12)return o.join(" | ")+" | ERROR lista v3: "+TL.length+" en V11";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var LI="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/",fs=[];for(var k=1;k<=12;k++)fs.push(LI+"lista v4 "+(k<10?"0":"")+k+".png");p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
q.addTracks(1,S.videoTracks.numTracks,0);S=p.activeSequence;var tl=S.videoTracks[S.videoTracks.numTracks-1];if(tl.clips.numItems)return "ERROR pista lista no vacía";
for(var k=0;k<12;k++){var it=item("lista v4 "+(k<9?"0":"")+(k+1)+".png");if(!it)return "falta png "+(k+1);tl.overwriteClip(it,seg(TL[k][0]));var c=null;for(var j=0;j<tl.clips.numItems;j++)if(Math.abs(tl.clips[j].start.seconds-TL[k][0])<0.04)c=tl.clips[j];c.end=seg(TL[k][1]);c.name="LISTA v4 · "+(k+1);}
o.push("lista v4: "+tl.clips.numItems+" clips en V"+S.videoTracks.numTracks);
return o.join(" | ");})();
