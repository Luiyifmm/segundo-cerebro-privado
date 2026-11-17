// Lista acumulada (12 PNG, V4), título v12 (V5) y escala 100 en todo el tramo de la lista. Solo pistas nuevas.
(function(){var p=app.project,s=p.activeSequence,L="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/",PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt";
var T=[2.08,2.96,3.66,5.06,7.13,9.05,10.57,11.98,14.58,15.42,16.58,18.99],FIN=20.72;function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
app.enableQE();var q=qe.project.getActiveSequence();if(s.videoTracks.numTracks<5)q.addTracks(5-s.videoTracks.numTracks,s.videoTracks.numTracks,0);
if(s.videoTracks[3].clips.numItems||s.videoTracks[4].clips.numItems)return "ERROR: V4/V5 ocupadas";
var v1=s.videoTracks[0];for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j];if(c.end.seconds<=FIN+0.05)c.components[1].properties[1].setValue(100,true);}
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var fs=[];for(var k=1;k<=12;k++)fs.push(L+"lista "+(k<10?"0":"")+k+".png");p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name==n)return bin.children[i];return null;}
var v4=s.videoTracks[3];for(var k=0;k<12;k++){var n="lista "+(k<9?"0":"")+(k+1)+".png",it=item(n);if(!it)return "falta "+n;v4.overwriteClip(it,seg(T[k]));var c=null;for(var j=0;j<v4.clips.numItems;j++)if(Math.abs(v4.clips[j].start.seconds-T[k])<0.04)c=v4.clips[j];
 c.end=seg(k<11?T[k+1]:FIN);c.name="LISTA · "+(k+1);c.components[1].properties[1].setValue(100,true);c.components[1].properties[0].setValue([0.5,0.5],true);}
var t=s.importMGT(PL,tk(0),4,0);t.end=seg(FIN);t.outPoint=seg(FIN);var m=t.getMGTComponent();
function txt(k,x){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=x;j.fontTextRunLength=[x.length];pp.setValue(JSON.stringify(j),true);}
txt(16,"TU VIDA EN");txt(15,"6 MESES");m.properties[14].setColorValue(255,30,138,255,true);m.properties[0].setValue(0,true);m.properties[10].setValue(true,true);m.properties[9].setValue(100,true);m.properties[8].setValue(38,true);m.properties[7].setValue(16,true);
m.properties[3].setValue(45,true);m.properties[4].setValue(92,true);t.name="TÍTULO · TU VIDA EN 6 MESES";
p.save();var F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",TT=[0.6,2.6,9.5,19.5,22.5,31.0];for(var i=0;i<TT.length;i++){s.setPlayerPosition(tk(TT[i]));q.exportFramePNG(q.CTI.timecode,F+"t"+i+".png");}
return "lista "+v4.clips.numItems+" | título "+t.start.seconds.toFixed(2)+"-"+t.end.seconds.toFixed(2);})();
