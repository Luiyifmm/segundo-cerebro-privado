// Música elegida por el usuario: Radiohead «Everything In Its Right Place» (instrumental), desde el inicio de la canción, −18 dB (≈ 18 dB bajo la voz), fundido de salida en el último segundo. Pista de audio nueva.
(function(){var p=app.project,F="/Users/luiyi/Downloads/Radiohead - Everything In Its Right Place (Instrumental).mp3";for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence;if(s.name!="6887-08 · JORDAN A completo v1")return "ERROR";function seg(x){var y=new Time();y.seconds=x;return y;}
var it=null;function rec(b){for(var i=0;i<b.children.numItems;i++){var c=b.children[i];if(c.type==2)rec(c);else{try{if(c.getMediaPath()==F)it=c;}catch(e){}}}}rec(p.rootItem);
if(!it){p.importFiles([F],true,p.rootItem,false);rec(p.rootItem);}if(!it)return "ERROR no importada";
app.enableQE();var n0=s.audioTracks.numTracks;qe.project.getActiveSequence().addTracks(0,0,1,1,n0);s=p.activeSequence;var tr=s.audioTracks[n0];
it.setInPoint(0,4);it.setOutPoint(s.end/254016000000,4);tr.overwriteClip(it,seg(0));it.clearInPoint();it.clearOutPoint();var c=tr.clips[0];c.name="MÚSICA Radiohead (fondo)";
var fin=c.end.seconds;var vol=null;for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")vol=c.components[k].properties[1];
var g=Math.pow(10,(-18-15)/20);vol.setTimeVarying(true);var t1=c.inPoint.seconds+(fin-c.start.seconds)-1.0,t2=c.inPoint.seconds+(fin-c.start.seconds);
vol.addKey(c.inPoint.seconds);vol.setValueAtKey(c.inPoint.seconds,g,true);vol.addKey(t1);vol.setValueAtKey(t1,g,true);vol.addKey(t2);vol.setValueAtKey(t2,0,true);
p.save();for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return "A"+(n0+1)+" "+c.start.seconds.toFixed(2)+"-"+fin.toFixed(2)+" in "+c.inPoint.seconds.toFixed(2);})();
