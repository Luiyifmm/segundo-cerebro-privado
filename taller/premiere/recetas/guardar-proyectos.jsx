// Guarda proyectos abiertos. CFG: {} = todos · {"solo":"<nombre.prproj o parte de la ruta>"} = solo ese (recomendado en pruebas).
// Comprobado el 06-11 (origen/…/guardar-todo.jsx).
(function(){var C=__CFG__,r=[];for(var i=0;i<app.projects.numProjects;i++){var p=app.projects[i];
if(C.solo&&p.name!=C.solo&&String(p.path).indexOf(C.solo)<0){r.push("sin tocar "+p.name);continue;}
try{p.save();r.push("guardado "+p.name);}catch(e){r.push("ERROR "+p.name+": "+e);}}return r.join(" | ");})();
