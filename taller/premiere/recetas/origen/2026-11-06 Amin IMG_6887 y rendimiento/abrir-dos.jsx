(function(){
var p=app.project,a=null,b=null;
for(var j=0;j<p.sequences.numSequences;j++){var n=p.sequences[j].name; if(n.indexOf("AMIN_1018_02")==0)a=p.sequences[j]; if(n.indexOf("AMIN_1018_03")==0)b=p.sequences[j];}
if(a)p.openSequence(a.sequenceID); if(b)p.openSequence(b.sequenceID);
return "proyectos "+app.projects.numProjects+" | pobre "+(!!a)+" | vulgaridad "+(!!b)+" | activa "+p.activeSequence.name;
})();
