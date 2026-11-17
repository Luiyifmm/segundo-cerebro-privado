(function(){var p=app.project,s=p.activeSequence;if(s.name!="PRUEBA FORMATO · logos-simple")return "ERROR: secuencia";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="PRUEBA FORMATO")bin=p.rootItem.children[i];
var it=null;for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name=="etiquetas POBRE RICO.png")it=bin.children[i];
if(!it)return "ERROR: no encuentro etiquetas";
var ok=it.changeMediaPath("/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/prueba-formato/etiquetas blancas.png",true);p.save();
app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[5.0,5.4,8.2,9.4];
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"pg"+i+".png");}
return "cambiado "+ok+" → "+it.getMediaPath();})();
