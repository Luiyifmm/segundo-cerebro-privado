(function(){var p=app.project,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/",pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr",o=[];
var L=[["6887-08 · JORDAN A4 lista 1 col + clic","6887-08 JORDAN A4 lista 1 col + clic v2.mp4"],["6887-08 · JORDAN A5 franjas negras sin zoom","6887-08 JORDAN A5 franjas negras sin zoom v2.mp4"]];
for(var k=0;k<2;k++){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==L[k][0])p.openSequence(p.sequences[i].sequenceID);var S=p.activeSequence;if(S.name!=L[k][0])return "ERROR";
 var n=0;for(var t=0;t<S.audioTracks.numTracks;t++){var tr=S.audioTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.name.indexOf("SFX3 clic mínimo")!=0)continue;
  for(var x=0;x<c.components.numItems;x++)if(c.components[x].displayName=="Volumen")c.components[x].properties[1].setValue(Math.pow(10,(-8-15)/20),true);n++;}}
 o.push(S.name+": clics "+n+" → "+(new File(D+L[k][1]).exists?"ya existe":S.exportAsMediaDirect(D+L[k][1],pr,0)));}
return o.join(" | ");})();
