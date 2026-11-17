(function(){var p=app.project,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/pruebas Jordan/",pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr",o=[];
Folder(D).create();var SQ=[["6887-08 · JORDAN A fiel","Jordan A fiel v2.mp4"],["6887-08 · JORDAN B adaptado","Jordan B adaptado v2.mp4"],["6887-08 · JORDAN C cinematografico","Jordan C cinematografico v2.mp4"]];
for(var k=0;k<3;k++){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==SQ[k][0])p.openSequence(p.sequences[i].sequenceID);var s=p.activeSequence;if(new File(D+SQ[k][1]).exists){o.push("ya existe "+SQ[k][1]);continue;}
 s.setInPoint(1.867);s.setOutPoint(8.30);o.push(SQ[k][1]+": "+s.exportAsMediaDirect(D+SQ[k][1],pr,1));}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return o.join(" | ");})();
