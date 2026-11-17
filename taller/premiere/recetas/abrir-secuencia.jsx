// Abre (si hace falta) un proyecto y deja activa una secuencia por nombre o prefijo. No guarda ni cambia nada más.
// CFG: {"proyecto":"/ruta/AMIN - LOTE 18 OCT.prproj" (opcional),"secuencias":["AMIN_1018_02","AMIN_1018_03"]} (la última queda activa)
// Comprobado el 06-11 (origen/…/abrir-*.jsx).
(function(){var C=__CFG__,p=app.project;
if(C.proyecto){p=null;for(var i=0;i<app.projects.numProjects;i++)if(app.projects[i].path==C.proyecto)p=app.projects[i];
 if(!p){app.openDocument(C.proyecto,true,false,false,true);for(var i=0;i<app.projects.numProjects;i++)if(app.projects[i].path==C.proyecto)p=app.projects[i];}
 if(!p)return "ERROR: no se pudo abrir "+C.proyecto;}
var r=[];for(var k=0;k<C.secuencias.length;k++){var s=null,n=C.secuencias[k];for(var j=0;j<p.sequences.numSequences;j++)if(p.sequences[j].name.indexOf(n)==0)s=p.sequences[j];
 if(!s){r.push("no encontrada: "+n);continue;}p.openSequence(s.sequenceID);r.push(s.name);}
return "proyecto "+p.name+" | abiertas: "+r.join(" ; ")+" | proyectos abiertos "+app.projects.numProjects;})();
