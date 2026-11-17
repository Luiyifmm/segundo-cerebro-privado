(function(){var P="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/Amin · copia Claude 6887-08.prproj";
for(var i=0;i<app.projects.numProjects;i++)if(app.projects[i].path==P)return "ya abierta; activo "+app.project.name;
var ok=app.openDocument(P,true,false,false,true);var o=[];for(var i=0;i<app.projects.numProjects;i++)o.push(app.projects[i].name);
return "abierta "+ok+" | activo "+app.project.name+" | abiertos: "+o.join(" / ");})();
