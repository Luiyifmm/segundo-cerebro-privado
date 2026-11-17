(function(){
var p=null;
for(var i=0;i<app.projects.numProjects;i++){ if(app.projects[i].path.indexOf("AMIN - LOTE 18 OCT")>=0) p=app.projects[i]; }
if(!p) return "proyecto no abierto";
var s=null;
for(var j=0;j<p.sequences.numSequences;j++){ if(p.sequences[j].name.indexOf("AMIN_1018_02")==0) s=p.sequences[j]; }
if(!s) return "secuencia no encontrada";
p.openSequence(s.sequenceID);
var v=0; for(var t=0;t<s.videoTracks.numTracks;t++) v+=s.videoTracks[t].clips.numItems;
return "ok: "+s.name+" | dur "+s.end/254016000000+" s | clips video "+v+" | proyectos abiertos "+app.projects.numProjects;
})();
