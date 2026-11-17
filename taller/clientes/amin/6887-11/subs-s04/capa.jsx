(function(){var NOM="ranking-capa-v8.mov";var P=app.project,s=P.activeSequence;function T(x){var y=new Time();y.seconds=x;return y;}
var bin=null;for(var i=0;i<P.rootItem.children.numItems;i++)if(P.rootItem.children[i].name=="Claude 6887-11 ranking")bin=P.rootItem.children[i];
P.importFiles(["/Users/luiyi/Videos-Remotion/clientes/amin/6887-11/graficos/"+NOM],true,bin,false);var it=null;for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==NOM)it=bin.children[i];if(!it)return "ERROR import";
var tr=s.videoTracks[17];if(tr.clips.numItems!=1||tr.clips[0].name.indexOf("ranking-capa")!=0)return "ERROR V18 inesperada";var st=tr.clips[0].start.seconds;
it.setInPoint(T(st),4);tr.overwriteClip(it,T(st));it.clearInPoint();var cl=tr.clips[0];for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Movimiento")cl.components[k].properties[1].setValue(200,true);
return cl.name+" "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2)+" clips "+tr.clips.numItems;})();
