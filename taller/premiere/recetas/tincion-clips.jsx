// Recolorea clips (p. ej. gráficos nativos cuyo texto no se puede editar) con el efecto "Tinción": negro y blanco al color pedido.
// CFG: {"secuencia":"IMG_6887","pista":26,"tiempos":[16.73,22.4] (o "todos"),"negro":[0,0,0],"blanco":[0,250,255],"nivel":100,
//       "resplandorDe":{"pista":24,"t":3.5} (opcional: copia su "Resplandor de VR"),"guardar":true}
// Comprobado el 06-11 (origen/…/v26tinte.jsx). OJO: el efecto se llama "Tinción"; "Tinta"/"Tinte" no existen y no dan error.
(function(){var C=__CFG__;app.enableQE();
function seg(x){var y=new Time();y.seconds=x;return y;}
function tk(x){return String(Math.round(x*254016000000));}
function buscarSeq(n){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name==n)return s;}for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name.indexOf(n)==0)return s;}return null;}
function comp(cl,n){for(var i=0;i<cl.components.numItems;i++)if(cl.components[i].displayName==n)return cl.components[i];return null;}
function qeItem(qt,t){for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-t)<0.02)return qi;}return null;}
function efecto(n){var f=qe.project.getVideoEffectByName(n);if(!f||!f.name)throw new Error("no existe el efecto \""+n+"\" (mira efectos-lista.jsx)");return f;}
var s=app.project.activeSequence,r=[];if(C.secuencia&&s.name!=C.secuencia)return "ERROR: la activa es "+s.name;
var tr=s.videoTracks[C.pista-1],qt=qe.project.getActiveSequence().getVideoTrackAt(C.pista-1),fT=efecto("Tinción"),rv=null,fR=null;
if(C.resplandorDe){var rt=s.videoTracks[C.resplandorDe.pista-1];for(var k=0;k<rt.clips.numItems;k++)if(Math.abs(rt.clips[k].start.seconds-C.resplandorDe.t)<0.05)rv=comp(rt.clips[k],"Resplandor de VR");if(!rv)return "ERROR: no hay Resplandor de VR de referencia";fR=efecto("Resplandor de VR");}
var n=0;for(var k=0;k<tr.clips.numItems;k++){var cl=tr.clips[k],t=cl.start.seconds;
 if(C.tiempos!="todos"){var si=false;for(var a=0;a<C.tiempos.length;a++)if(Math.abs(C.tiempos[a]-t)<0.03)si=true;if(!si)continue;}
 if(comp(cl,"Tinción"))continue;var qi=qeItem(qt,t);if(!qi){r.push("sin item QE en "+t.toFixed(2));continue;}
 qi.addVideoEffect(fT);if(fR)qi.addVideoEffect(fR);
 var T=comp(cl,"Tinción");T.properties[0].setColorValue(255,C.negro[0],C.negro[1],C.negro[2],true);T.properties[1].setColorValue(255,C.blanco[0],C.blanco[1],C.blanco[2],true);T.properties[2].setValue(C.nivel||100,true);
 if(rv){var R2=comp(cl,"Resplandor de VR");for(var p=1;p<rv.properties.numItems;p++){try{R2.properties[p].setValue(rv.properties[p].getValue(),true);}catch(e){}}}
 n++;r.push(t.toFixed(2));}
if(C.guardar!==false)app.project.save();return "teñidos "+n+": "+r.join(", ");})();
