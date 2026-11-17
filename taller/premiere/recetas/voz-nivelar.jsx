// Nivela la voz de una pista de audio a ~−16 LUFS con techo de −1 dB (comprobado el 07-11 en el proyecto de pruebas,
// bruto de Amin a −30,8 LUFS → −16,1 / −15,3 LUFS, pico −2,4 dBTP, sin subir el ruido como con un compresor).
// Cómo: volumen del clip +N dB (máx. +15) y "Limitador forzado" como TECHO (su entrada en neutro).
// OJO: los parámetros del limitador van NORMALIZADOS 0–1: techo 0,975 ≈ −1 dB; entrada 0,6667 = neutra.
//      Con la entrada al máximo empuja todo contra el techo (−9,7 LUFS y ruido +18 dB): NO hacerlo.
// Si con +15 dB no llega (bruto muy bajo, p. ej. IMG_6118 a −38 dB): +N dB más en «Volumen del canal» (Izq./Der., misma escala), ver LEEME (07-11).
// CFG: {"guardia":{…},"pista":1,"ganancia_db":15}   → medir después con earshot (measure) la exportación.
(function(){var C=__CFG__;app.enableQE();var s=app.project.activeSequence,a=s.audioTracks[(C.pista||1)-1],qa=qe.project.getActiveSequence().getAudioTrackAt((C.pista||1)-1);
var fx=qe.project.getAudioEffectByName("Limitador forzado");if(!fx||!fx.name)return "ERROR: no existe Limitador forzado";
function tiene(c){for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Limitador forzado")return true;return false;}
var n=0;for(var j=0;j<qa.numItems;j++){var qi=qa.getItemAt(j);if(qi&&qi.type=="Clip"){var c=null;for(var i=0;i<a.clips.numItems;i++)if(Math.abs(a.clips[i].start.seconds-qi.start.secs)<0.02)c=a.clips[i];if(c&&!tiene(c))qi.addAudioEffect(fx);}}
var g=Math.min(15,C.ganancia_db==null?15:C.ganancia_db);
for(var i=0;i<a.clips.numItems;i++){var c=a.clips[i];for(var k=0;k<c.components.numItems;k++){var co=c.components[k];
 if(co.displayName=="Limitador forzado"){co.properties[1].setValue(0.975,true);co.properties[2].setValue(0.66666698455811,true);n++;}
 if(co.displayName=="Volumen")co.properties[1].setValue(Math.pow(10,(g-15)/20),true);}}
app.project.save();return "voz nivelada en "+n+" clips (+"+g+" dB, techo −1 dB). Mide la exportación.";})();
