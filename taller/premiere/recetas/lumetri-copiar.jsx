// Copia el "Color de Lumetri" de un clip de otra secuencia a una CAPA DE AJUSTE nueva justo encima de V1 en la secuencia activa.
// CFG: {"destino":"IMG_6887","origen":{"secuencia":"Secuencia 01","pista":3,"clip":0},
//       "capaDe":{"secuencia":"Secuencia 01","pista":2,"clip":0},"desde":0,"hasta":40,"guardar":true}
// pista = número como en Premiere (V1 = 1). "hasta": fin de la capa (o el último clip de V1 que empiece antes).
// Comprobado el 06-11 (origen/…/lumcopia.jsx): 130 propiedades copiadas, imagen +16 % de luminancia.
(function(){var C=__CFG__;app.enableQE();
function seg(x){var y=new Time();y.seconds=x;return y;}
function tk(x){return String(Math.round(x*254016000000));}
function buscarSeq(n){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name==n)return s;}for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name.indexOf(n)==0)return s;}return null;}
function comp(cl,n){for(var i=0;i<cl.components.numItems;i++)if(cl.components[i].displayName==n)return cl.components[i];return null;}
function qeItem(qt,t){for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-t)<0.02)return qi;}return null;}
function efecto(n){var f=qe.project.getVideoEffectByName(n);if(!f||!f.name)throw new Error("no existe el efecto \""+n+"\" (mira efectos-lista.jsx)");return f;}
var dst=app.project.activeSequence;if(C.destino&&dst.name!=C.destino)return "ERROR: la activa es "+dst.name;
var so=buscarSeq(C.origen.secuencia);if(!so)return "ERROR: no encuentro "+C.origen.secuencia;
var L=comp(so.videoTracks[C.origen.pista-1].clips[C.origen.clip||0],"Color de Lumetri");if(!L)return "ERROR: el clip de origen no tiene Lumetri";
var sc=buscarSeq(C.capaDe.secuencia),adj=sc.videoTracks[C.capaDe.pista-1].clips[C.capaDe.clip||0].projectItem;
var v1=dst.videoTracks[0],fin=0;for(var c=0;c<v1.clips.numItems;c++)if(v1.clips[c].start.seconds<C.hasta)fin=Math.max(fin,v1.clips[c].end.seconds);
qe.project.getActiveSequence().addTracks(1,1,0);dst=app.project.activeSequence;var tr=dst.videoTracks[1];if(tr.clips.numItems)return "ERROR: la pista nueva no está vacía";
tr.overwriteClip(adj,C.desde||0);var cl=tr.clips[0];cl.end=seg(fin);
var qi=qeItem(qe.project.getActiveSequence().getVideoTrackAt(1),C.desde||0);qi.addVideoEffect(efecto("Color de Lumetri"));
var D=comp(cl,"Color de Lumetri"),ok=0,mal=[];for(var p=0;p<L.properties.numItems;p++){try{D.properties[p].setValue(L.properties[p].getValue(),true);ok++;}catch(x){mal.push(p);}}
if(C.guardar!==false)app.project.save();return "capa V2 "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2)+" | copiadas "+ok+" | fallaron "+mal.join(",");})();
