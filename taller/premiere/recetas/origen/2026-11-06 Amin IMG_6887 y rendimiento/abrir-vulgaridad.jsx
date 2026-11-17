(function(){
var ruta="/Users/luiyi/EDICION/3 PROYECTOS/Lotes de edición/AMIN - LOTE 18 OCT.prproj";
try{app.project.save();}catch(e){}
var ok=app.openDocument(ruta,true,false,false,true);
var p=null;
for(var i=0;i<app.projects.numProjects;i++){ if(app.projects[i].path.indexOf("AMIN - LOTE 18 OCT")>=0) p=app.projects[i]; }
if(!p) return "no abierto ("+ok+")";
var s=null;
for(var j=0;j<p.sequences.numSequences;j++){ if(p.sequences[j].name.indexOf("AMIN_1018_03")==0) s=p.sequences[j]; }
if(!s) return "proyecto abierto, secuencia no encontrada";
p.openSequence(s.sequenceID);
return "ok: "+p.name+" | "+s.name+" | activa: "+(app.project.activeSequence?app.project.activeSequence.name:"?");
})();
