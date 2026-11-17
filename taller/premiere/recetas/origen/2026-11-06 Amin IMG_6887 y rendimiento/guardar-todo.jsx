(function(){var r=[];for(var i=0;i<app.projects.numProjects;i++){var p=app.projects[i];try{p.save();r.push("guardado "+p.name);}catch(e){r.push("ERROR "+p.name+": "+e);}}return r.join(" | ");})();
