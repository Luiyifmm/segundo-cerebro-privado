(function(){app.enableQE();var r=[],dst=app.project.activeSequence;if(dst.name!="IMG_6887")return "activa "+dst.name;
var src=null;for(var i=0;i<app.project.sequences.numSequences;i++)if(app.project.sequences[i].name=="Secuencia 01")src=app.project.sequences[i];
var srcClip=src.videoTracks[2].clips[0],L=null;for(var k=0;k<srcClip.components.numItems;k++)if(srcClip.components[k].displayName=="Color de Lumetri")L=srcClip.components[k];
var adj=src.videoTracks[1].clips[0].projectItem;
var v1=dst.videoTracks[0],fin=0;for(var c=0;c<v1.clips.numItems;c++)if(v1.clips[c].start.seconds<40)fin=Math.max(fin,v1.clips[c].end.seconds);
var q=qe.project.getActiveSequence();q.addTracks(1,1,0);dst=app.project.activeSequence;var tr=dst.videoTracks[1];
if(tr.clips.numItems)return "la pista nueva no está vacía";
tr.overwriteClip(adj,0);var cl=tr.clips[0];var e=new Time();e.seconds=fin;cl.end=e;
var qt=qe.project.getActiveSequence().getVideoTrackAt(1);for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"){qi.addVideoEffect(qe.project.getVideoEffectByName("Color de Lumetri"));break;}}
var D=null;for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Color de Lumetri")D=cl.components[k];
var ok=0,mal=[];for(var p=0;p<L.properties.numItems;p++){try{var v=L.properties[p].getValue();D.properties[p].setValue(v,true);ok++;}catch(x){mal.push(p);}}
r.push("capa de ajuste V2 "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2)+" | copiadas "+ok+" | fallaron "+mal.join(","));
// comprobar
var chk=[19,95,96,101,103,104,105];for(var i=0;i<chk.length;i++)r.push(chk[i]+"="+D.properties[chk[i]].getValue());
app.project.save();return r.join(" | ");})();
