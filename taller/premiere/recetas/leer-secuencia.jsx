// Foto compacta de la secuencia activa: cada clip con pista, tiempos, nombre, desactivado, efectos,
// textos de MOGRT (línea y clave si existen), nivel de volumen y escala/posición de Movimiento.
// Sirve para comparar ANTES y DESPUÉS de que el usuario retoque a mano (herramientas/qc/comparar-secuencias.py).
// CFG: {"secuencia":"<nombre>" (opcional, comprueba), "desde":0, "hasta":99999,
//       "audio":true (opcional: cadena de efectos de cada clip de audio con sus valores, volumen en dB y pistas de audio con nombre y silencio),
//       "solo":"A"|"V" (opcional: solo esas pistas, para que la salida sea corta)}
// Solo lee. Código propio (06-11-2026). "audio" y "solo" añadidos el 08-11 (8B.2); sin ellos la salida es la de siempre.
// Lo que NO lee (límite de Premiere por script): salida de cada pista, faders del mezclador y efectos de pista.
(function(){var C=__CFG__,s=app.project.activeSequence;if(C.secuencia&&s.name!=C.secuencia)return "ERROR: la activa es "+s.name;
var d0=C.desde||0,d1=C.hasta||99999,out={secuencia:s.name,proyecto:app.project.name,clips:[]};
function r3(x){return Math.round(x*1000)/1000;}
function lee(tr,tipo,t){for(var c=0;c<tr.clips.numItems;c++){var cl=tr.clips[c];if(cl.end.seconds<d0||cl.start.seconds>d1)continue;
 var o={p:tipo+(t+1),n:cl.name,i:r3(cl.start.seconds),f:r3(cl.end.seconds),en:r3(cl.inPoint.seconds),off:cl.disabled?1:0,fx:[]};
 for(var k=0;k<cl.components.numItems;k++){var co=cl.components[k],dn=co.displayName;
  if(C.audio&&tipo=="A"){var pv=[];for(var z=0;z<co.properties.numItems;z++){try{var v=co.properties[z].getValue();if(typeof v=="number"||typeof v=="boolean")pv.push(z+"="+(typeof v=="number"?r3(v):v));}catch(e){}}o.cad=(o.cad||[]);o.cad.push(dn+" ["+pv.join(" ")+"]");}
  if(dn=="Volumen"){try{o.vol=r3(co.properties[1].getValue());if(C.audio&&tipo=="A"&&o.vol>0)o.dB=Math.round((20*Math.log(o.vol)/Math.LN10+15)*10)/10;}catch(e){}continue;}
  if(dn=="Movimiento"){try{var pos=co.properties[0].getValue();o.pos=[r3(pos[0]),r3(pos[1])];o.esc=r3(co.properties[1].getValue());}catch(e){}continue;}
  if(dn!="Opacidad"&&dn!="Panoramizador"&&dn!="Canal de volumen")o.fx.push(dn);}
 try{var m=cl.getMGTComponent();if(m){var tx=[];for(var q=0;q<m.properties.numItems;q++){try{var v=m.properties[q].getValue();if(typeof v=="string"&&v.indexOf("textEditValue")>=0)tx.push(JSON.parse(v).textEditValue);}catch(e){}}o.txt=tx;}}catch(e){}
 out.clips.push(o);}}
if(C.solo!="A")for(var t=0;t<s.videoTracks.numTracks;t++)lee(s.videoTracks[t],"V",t);
if(C.solo!="V")for(var t=0;t<s.audioTracks.numTracks;t++)lee(s.audioTracks[t],"A",t);
if(C.audio){out.pistasA=[];for(var t=0;t<s.audioTracks.numTracks;t++){var at=s.audioTracks[t],mu="?";try{mu=at.isMuted()?1:0;}catch(e){}out.pistasA.push("A"+(t+1)+" "+at.name+" silencio="+mu);}}
return JSON.stringify(out);})();
