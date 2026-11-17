(function(){
var P="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/Entrenamiento 6122 Claude.prproj";
var B="/Users/luiyi/EDICION/1 CLIENTES/AMIN/BRUTOS/PENDIENTES/IMG_6122.MOV";
var X="/Users/luiyi/EDICION/1 CLIENTES/AMIN/BRUTOS/PENDIENTES/Proxies/IMG_6122_Proxy.mp4";
var f=new File(P); if(f.exists) return "ERROR: ya existe el proyecto, no lo piso";
app.newProject(P);
var p=null; for(var i=0;i<app.projects.numProjects;i++) if(app.projects[i].path==P) p=app.projects[i];
if(!p) return "ERROR: no se creó";
p.importFiles([B],true,p.rootItem,false);
var it=null; for(var i=0;i<p.rootItem.children.numItems;i++){var c=p.rootItem.children[i]; if(c.name=="IMG_6122.MOV") it=c;}
if(!it) return "ERROR: no importó";
var px="sin proxy"; if(it.canProxy()){ it.attachProxy(X,0); px="proxy "+it.hasProxy(); }
var s=p.createNewSequenceFromClips("ENTRENAMIENTO 6122 · propuesta Claude v1",[it],p.rootItem);
// dejar la secuencia vacía: la llenará el montaje
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t]; for(var k=tr.clips.numItems-1;k>=0;k--) tr.clips[k].remove(false,false);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t]; for(var k=tr.clips.numItems-1;k>=0;k--) tr.clips[k].remove(false,false);}
p.save();
return "ok "+p.name+" | seq "+s.name+" "+s.frameSizeHorizontal+"x"+s.frameSizeVertical+" | "+px+" | activo "+app.project.name+" | V"+s.videoTracks.numTracks+" A"+s.audioTracks.numTracks;
})();
