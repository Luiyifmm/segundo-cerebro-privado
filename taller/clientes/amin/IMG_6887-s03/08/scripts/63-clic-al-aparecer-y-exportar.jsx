// A4 y A5: cada clic mínimo empieza 0,04 s antes de que aparezca su punto (el golpe dura 9 ms y cae ≈ 1 fotograma antes). Reexporta v3.
(function(){var p=app.project,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/",pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr",o=[];
function seg(x){var y=new Time();y.seconds=x;return y;}
var L=[["6887-08 · JORDAN A4 lista 1 col + clic","6887-08 JORDAN A4 lista 1 col + clic v3.mp4"],["6887-08 · JORDAN A5 franjas negras sin zoom","6887-08 JORDAN A5 franjas negras sin zoom v3.mp4"]];
for(var k=0;k<2;k++){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==L[k][0])p.openSequence(p.sequences[i].sequenceID);var S=p.activeSequence;if(S.name!=L[k][0])return "ERROR";
 var T={};for(var t=0;t<S.videoTracks.numTracks;t++){var tr=S.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j],m=c.name.match(/^LISTA v6 · (\d+)$/);if(m)T[m[1]]=c.start.seconds;}}
 var n=0,d=[];for(var t=0;t<S.audioTracks.numTracks;t++){var tr=S.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j],m=c.name.match(/^SFX3 clic mínimo (\d+)$/);if(!m||T[m[1]]==null)continue;
   var nu=T[m[1]]-0.04,dur=c.end.seconds-c.start.seconds;d.push((nu-c.start.seconds).toFixed(2));c.start=seg(nu);c.end=seg(nu+dur);n++;}}
 o.push(S.name+": movidos "+n+" ("+d.join(",")+") → "+(new File(D+L[k][1]).exists?"ya existe":S.exportAsMediaDirect(D+L[k][1],pr,0)));}
return o.join(" | ");})();
