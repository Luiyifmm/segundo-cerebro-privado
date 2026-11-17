(function(){var out="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/prueba formato logos-simple v3.mp4";if(new File(out).exists)return "ERROR: ya existe";
var pr="/Applications/Adobe Premiere Pro 2026/Adobe Premiere Pro 2026.app/Contents/MediaIO/systempresets/4E49434B_48323634/01 - Match Source - High bitrate.epr";
var s=app.project.activeSequence;s.setInPoint(4.93);s.setOutPoint(9.71);return "exportado: "+s.exportAsMediaDirect(out,pr,1);})();
