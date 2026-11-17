(function(){var p=app.project,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/",pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr",o=[];
var L=[["6887-08 · JORDAN A4 lista 1 col + clic","6887-08 JORDAN A4 lista 1 col + clic.mp4"],["6887-08 · JORDAN A5 franjas negras sin zoom","6887-08 JORDAN A5 franjas negras sin zoom.mp4"]];
for(var k=0;k<2;k++){if(new File(D+L[k][1]).exists){o.push("ya existe "+L[k][1]);continue;}for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==L[k][0])p.openSequence(p.sequences[i].sequenceID);
 if(p.activeSequence.name!=L[k][0]){o.push("ERROR abrir "+L[k][0]);continue;}o.push(L[k][1]+": "+p.activeSequence.exportAsMediaDirect(D+L[k][1],pr,0));}
return o.join(" | ");})();
