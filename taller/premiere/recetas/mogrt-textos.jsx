// Coloca clips de una plantilla MOGRT con dos textos (línea + palabra clave) y color, en una pista concreta.
// CFG: {"secuencia":"IMG_6887","plantilla":"/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt","pista":30,
//       "propLinea":16,"propClave":15,"propColor":14,"color":[30,138,255],
//       "items":[[25.501,26.034,"su","tiempo"]],"desactivar":{"pista":25} (opcional: desactiva el clip que empiece igual),"guardar":true}
// La pista DEBE estar libre en esos tramos (importMGT entra con 30 s y pisa lo que haya). Comprobado el 06-11 (origen/…/amin-mgt*.jsx).
(function(){var C=__CFG__;
function seg(x){var y=new Time();y.seconds=x;return y;}
function tk(x){return String(Math.round(x*254016000000));}
function buscarSeq(n){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name==n)return s;}for(var i=0;i<p.sequences.numSequences;i++){var s=p.sequences[i];if(s.name.indexOf(n)==0)return s;}return null;}
function comp(cl,n){for(var i=0;i<cl.components.numItems;i++)if(cl.components[i].displayName==n)return cl.components[i];return null;}
function qeItem(qt,t){for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-t)<0.02)return qi;}return null;}
function efecto(n){var f=qe.project.getVideoEffectByName(n);if(!f||!f.name)throw new Error("no existe el efecto \""+n+"\" (mira efectos-lista.jsx)");return f;}
var s=app.project.activeSequence,r=[];if(C.secuencia&&s.name!=C.secuencia)return "ERROR: la activa es "+s.name;
var tr=s.videoTracks[C.pista-1];for(var i=0;i<C.items.length;i++){var a=C.items[i];for(var k=0;k<tr.clips.numItems;k++){var c0=tr.clips[k];if(c0.end.seconds>a[0]&&c0.start.seconds<a[0]+30)return "ERROR: la pista V"+C.pista+" no está libre cerca de "+a[0];}}
for(var i=0;i<C.items.length;i++){var a=C.items[i];var c=s.importMGT(C.plantilla,tk(a[0]),C.pista-1,0);c.end=seg(a[1]);c.outPoint=seg(a[1]-a[0]);var m=c.getMGTComponent();
 function txt(k,t){var p=m.properties[k],j=JSON.parse(p.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];p.setValue(JSON.stringify(j),true);}
 txt(C.propLinea,a[2]);txt(C.propClave,a[3]);if(C.color)m.properties[C.propColor].setColorValue(255,C.color[0],C.color[1],C.color[2],true);
 r.push(a[0]+" "+a[2]+"/"+a[3]);
 if(C.desactivar){var dt=s.videoTracks[C.desactivar.pista-1];for(var k=0;k<dt.clips.numItems;k++)if(Math.abs(dt.clips[k].start.seconds-a[0])<0.01){dt.clips[k].disabled=true;r.push("V"+C.desactivar.pista+" "+a[0]+" desactivado");}}}
if(C.guardar!==false)app.project.save();return r.join(" | ");})();
