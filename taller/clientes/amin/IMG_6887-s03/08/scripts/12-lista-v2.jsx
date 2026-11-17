// Sustituye la lista de V4 por la v2 (más baja, bajo el título). Solo clips «LISTA ·» míos.
(function(){var p=app.project,s=p.activeSequence,L="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/";var T=[2.08,2.96,3.66,5.06,7.13,9.05,10.57,11.98,14.58,15.42,16.58,18.99],FIN=20.72;
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
var v4=s.videoTracks[3];for(var k=v4.clips.numItems-1;k>=0;k--){if(v4.clips[k].name.indexOf("LISTA · ")!=0)return "ERROR ajeno";v4.clips[k].remove(false,false);}
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var fs=[];for(var k=1;k<=12;k++)fs.push(L+"lista v2 "+(k<10?"0":"")+k+".png");p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
for(var k=0;k<12;k++){var it=item("lista v2 "+(k<9?"0":"")+(k+1)+".png");v4.overwriteClip(it,seg(T[k]));var c=null;for(var j=0;j<v4.clips.numItems;j++)if(Math.abs(v4.clips[j].start.seconds-T[k])<0.04)c=v4.clips[j];c.end=seg(k<11?T[k+1]:FIN);c.name="LISTA · "+(k+1);}
p.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",TT=[2.6,5.5,7.5,9.5,12.5,16.0,18.0,20.3];for(var i=0;i<TT.length;i++){s.setPlayerPosition(tk(TT[i]));q.exportFramePNG(q.CTI.timecode,F+"u"+i+".png");}
return "lista v2 "+v4.clips.numItems;})();
