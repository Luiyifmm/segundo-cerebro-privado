// Coloca efectos de sonido en pistas de audio NUEVAS de la secuencia activa, con nivel en dB y duración opcional.
// CFG: {"secuencia":"IMG_6887","bandeja":"SFX (Claude)","pistas":4,
//       "sonidos":{"ui":"/ruta/Ui button.wav"},
//       "eventos":[{"pista":0,"sonido":"ui","t":3.5,"db":-8,"dur":1.0}], "guardar":true}
// 10-11: con "dur" también fija outPoint (antes quedaba al final del archivo y el clip no se podía alargar).
// Comprobado el 06-11 en IMG_6887 (versión con datos fijos en origen/…/sfx-amin.jsx).
(function(){var C=__CFG__;app.enableQE();
function seg(x){var y=new Time();y.seconds=x;return y;}
function tk(x){return String(Math.round(x*254016000000));}
function buscarSeq(n){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name==n)return s;}for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name.indexOf(n)==0)return s;}return null;}
function comp(cl,n){for(var i=0;i<cl.components.numItems;i++)if(cl.components[i].displayName==n)return cl.components[i];return null;}
function qeItem(qt,t){for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-t)<0.02)return qi;}return null;}
function efecto(n){var f=qe.project.getVideoEffectByName(n);if(!f||!f.name)throw new Error("no existe el efecto \""+n+"\" (mira efectos-lista.jsx)");return f;}
var s=app.project.activeSequence,r=[];if(C.secuencia&&s.name!=C.secuencia)return "ERROR: la activa es "+s.name;
var root=app.project.rootItem,bin=null;for(var i=0;i<root.children.numItems;i++)if(root.children[i].name==C.bandeja)bin=root.children[i];if(!bin)bin=root.createBin(C.bandeja);
var lst=[];for(var k in C.sonidos)lst.push(C.sonidos[k]);app.project.importFiles(lst,true,bin,false);
function it(p){var n=p.split("/").pop();for(var j=0;j<bin.children.numItems;j++)if(bin.children[j].name==n)return bin.children[j];return null;}
var n0=s.audioTracks.numTracks;qe.project.getActiveSequence().addTracks(0,0,C.pistas,1,n0);s=app.project.activeSequence;
for(var i=0;i<C.pistas;i++)if(s.audioTracks[n0+i].clips.numItems)return "ERROR: pista nueva no vacía";
function db(x){return Math.pow(10,(x-15)/20);}
var falta=0;for(var e=0;e<C.eventos.length;e++){var v=C.eventos[e],tr=s.audioTracks[n0+v.pista],p=it(C.sonidos[v.sonido]);if(!p){falta++;r.push("falta "+v.sonido);continue;}
 tr.overwriteClip(p,v.t);for(var m=0;m<tr.clips.numItems;m++){var c=tr.clips[m];if(Math.abs(c.start.seconds-v.t)<0.03){if(v.dur){var i0=c.inPoint.seconds;c.end=seg(v.t+v.dur);c.outPoint=seg(i0+v.dur);c.end=seg(v.t+v.dur);}var vol=comp(c,"Volumen");if(vol&&v.db!=null)vol.properties[1].setValue(db(v.db),true);}}}
for(var i=0;i<C.pistas;i++)r.push("A"+(n0+1+i)+": "+s.audioTracks[n0+i].clips.numItems);
if(C.guardar!==false)app.project.save();return r.join(" | ");})();
