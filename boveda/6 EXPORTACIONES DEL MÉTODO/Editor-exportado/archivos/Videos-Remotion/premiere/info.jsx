(function(){
  var out={proyectos:[],activo:app.project.name,ruta:app.project.path};
  for(var p=0;p<app.projects.numProjects;p++){out.proyectos.push(app.projects[p].name);}
  var seqs=[];for(var i=0;i<app.project.sequences.numSequences;i++){var s=app.project.sequences[i];seqs.push({nombre:s.name,fin:s.end/254016000000,w:s.frameSizeHorizontal,h:s.frameSizeVertical});}
  out.secuencias=seqs; out.secuenciaActiva=app.project.activeSequence?app.project.activeSequence.name:null;
  return JSON.stringify(out);
})()
