// Cambia el Volumen (Nivel) de los clips de audio elegidos por NOMBRE. Por defecto solo SIMULA: dice qué cambiaría y no toca nada.
// CFG: {"guardia":{…},
//       "secuencia":"(opcional) nombre EXACTO; si no, la activa. Al terminar vuelve a la que estaba",
//       "nombre":"nombre EXACTO del clip"  o  "contiene":"trozo del nombre" (uno de los dos, obligatorio),
//       "pistas":[1,2] (opcional, pistas de audio contando desde 1; por defecto todas),
//       "dB":-6  (nivel final del clip)  o  "delta":-3  (subir/bajar N dB respecto a lo que tiene) — uno de los dos,
//       "aplicar":true (sin esto, solo simula)}
// Claves: si el Nivel tiene claves, se escalan todas por la misma diferencia (los fundidos conservan su forma).
//   Con "dB", la diferencia se calcula para que la PRIMERA clave quede en ese nivel.
// Escala de Premiere: valor = 10^((dB−15)/20). No guarda el proyecto. No toca el mezclador, faders ni efectos de pista (no hay API).
// 08-11 (fase 8B.2): sustituye a los 12 scripts de niveles escritos a mano en 6887-08 (05, 06, 07, 07b, 07c, 33, 35, 37, 43, 62, 64, 65).
(function(){var C=__CFG__,P=app.project;
function dB(v){return v>0?Math.round((20*Math.log(v)/Math.LN10+15)*10)/10:"-inf";}
if(!C.nombre&&!C.contiene)return "ERROR: falta \"nombre\" o \"contiene\"";
if((typeof C.dB=="number")==(typeof C.delta=="number"))return "ERROR: pon \"dB\" o \"delta\" (uno, numérico)";
var antes=P.activeSequence,s=antes;
if(C.secuencia){s=null;for(var i=0;i<P.sequences.numSequences;i++)if(P.sequences[i].name==C.secuencia)s=P.sequences[i];
 if(!s)return "ERROR: no existe la secuencia «"+C.secuencia+"»";}
if(!s)return "ERROR: no hay secuencia activa";
var pis={},hay=false;if(C.pistas){for(var i=0;i<C.pistas.length;i++){pis[C.pistas[i]-1]=1;hay=true;}}
var o=[],n=0,sinVol=0;
for(var t=0;t<s.audioTracks.numTracks;t++){if(hay&&!pis[t])continue;var tr=s.audioTracks[t];
 for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];
  if(C.nombre?c.name!=C.nombre:c.name.indexOf(C.contiene)<0)continue;
  var L=null;for(var k=0;k<c.components.numItems;k++){var cm=c.components[k];if(cm.displayName=="Volumen"){
   for(var q=0;q<cm.properties.numItems;q++)if(cm.properties[q].displayName=="Nivel"||cm.properties[q].displayName=="Level")L=cm.properties[q];
   if(!L&&cm.properties.numItems>1)L=cm.properties[1];}}
  if(!L){sinVol++;continue;}n++;
  var claves=L.isTimeVarying(),ks=claves?L.getKeys():[],v0=claves?L.getValueAtKey(ks[0]):L.getValue();
  var f=typeof C.delta=="number"?Math.pow(10,C.delta/20):(v0>0?Math.pow(10,(C.dB-15)/20)/v0:null);
  if(f===null){o.push("A"+(t+1)+" «"+c.name+"» @"+c.start.seconds.toFixed(2)+"s: está en -inf, no se puede escalar (sin cambios)");continue;}
  var txt="A"+(t+1)+" «"+c.name+"» @"+c.start.seconds.toFixed(2)+"s: "+dB(v0)+" → "+dB(v0*f)+" dB"+(claves?" ("+ks.length+" claves)":"");
  if(C.aplicar){if(claves){for(var z=0;z<ks.length;z++)L.setValueAtKey(ks[z],L.getValueAtKey(ks[z])*f,true);}else L.setValue(v0*f,true);
   var v1=claves?L.getValueAtKey(ks[0]):L.getValue();txt+=" · leído después: "+dB(v1);}
  o.push(txt);}}
var r=(C.aplicar?"APLICADO":"SIMULACIÓN (nada cambiado; añade \"aplicar\":true)")+" · «"+s.name+"» · clips: "+n+(sinVol?" · sin Volumen: "+sinVol:"");
if(antes&&antes.sequenceID!=s.sequenceID)r+=" · activa sigue siendo: "+antes.name;
return r+"\n"+o.join("\n");})();
