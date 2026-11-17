(function(){var p=app.project,D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/",N="6887-08 JORDAN A3 zooms + lista 2 col.mp4",pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr";
if(new File(D+N).exists)return "ERROR ya existe";var s=p.activeSequence;if(s.name!="6887-08 · JORDAN A3 zooms + lista 2 col")return "ERROR secuencia";
var r=s.exportAsMediaDirect(D+N,pr,0);return "exportado "+r;})();
