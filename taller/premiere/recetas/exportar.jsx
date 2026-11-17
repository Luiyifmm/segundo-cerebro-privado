// Exporta una secuencia sin pasar por Media Encoder: H.264 «Coincidir con el origen, velocidad alta», o solo el audio en WAV.
// CFG: {"guardia":{…},"salida":"/ruta/archivo.mp4|.wav","preset":"(opcional) ruta .epr",
//       "secuencia":"(opcional) nombre EXACTO: la activa antes de exportar","audio":true (opcional: WAV 48 kHz 16 bits),
//       "volver":true (por defecto: si cambió de secuencia, deja activa otra vez la que estaba)}
// Se niega si el archivo ya existe (no sobrescribe), si la secuencia no existe o si la extensión no cuadra con el formato.
// 08-11 (fase 8B.2): añadidos "secuencia", "audio" y "volver". Antes había 19 scripts de exportar escritos a mano en 6887-08.
// Para iterar el SONIDO basta el WAV (segundos); el MP4 4K, solo para enseñar una versión.
(function(){var C=__CFG__,P=app.project;var f=new File(C.salida);if(f.exists)return "ERROR: ya existe "+C.salida+" (no sobrescribo)";
var ext=String(C.salida).toLowerCase().split(".").pop();
if(!C.preset&&(C.audio?ext!="wav":ext!="mp4"))return "ERROR: la extensión ."+ext+" no cuadra con "+(C.audio?"audio WAV":"vídeo MP4");
var PR="/Applications/Adobe Premiere Pro 2027/Adobe Premiere Pro 2027.app/Contents/MediaIO/systempresets/"; // 12-11: 2026 desinstalado
var p=C.preset||(C.audio?PR+"3F3F3F3F_57415645/Waveform Audio 48kHz 16-bit.epr":PR+"4E49434B_48323634/01 - Match Source - High bitrate.epr");
if(!new File(p).exists)return "ERROR: no existe el preset "+p;
var antes=P.activeSequence,s=antes;
if(C.secuencia){s=null;for(var i=0;i<P.sequences.numSequences;i++)if(P.sequences[i].name==C.secuencia)s=P.sequences[i];
 if(!s)return "ERROR: no existe la secuencia «"+C.secuencia+"»";if(!antes||antes.sequenceID!=s.sequenceID)P.openSequence(s.sequenceID);}
if(!s)return "ERROR: no hay secuencia activa";
var ok=s.exportAsMediaDirect(C.salida,p,0),vuelta="";
if(antes&&antes.sequenceID!=s.sequenceID&&C.volver!==false){P.openSequence(antes.sequenceID);vuelta=" · activa otra vez: "+P.activeSequence.name;}
return "exportado: "+ok+" · "+s.name+" → "+C.salida+vuelta;})();
