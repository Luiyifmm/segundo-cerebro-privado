// Crea «__NOM__» con las tomas de tramos.json (segundos del bruto) seguidas en V1/A1. No toca otras secuencias.
(function(){var N="__NOM__",T=__TRAMOS__,p=app.project;
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ERROR: ya existe";
function buscar(b,n,r){for(var i=0;i<b.children.numItems;i++){var c=b.children[i];if(c.name==n&&c.type!=2)r.push(c);if(c.type==2)buscar(c,n,r);}return r;}
var its=buscar(p.rootItem,"IMG_6887.MOV",[]),it=null;for(var i=0;i<its.length;i++)if(!its[i].isOffline()){it=its[i];break;}if(!it)return "ERROR: sin IMG_6887.MOV en línea";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="IMG_6887 lote 2 (Claude)")bin=p.rootItem.children[i];if(!bin)bin=p.rootItem.createBin("IMG_6887 lote 2 (Claude)");
var s=p.createNewSequenceFromClips(N,[it],bin);
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var k=tr.clips.numItems-1;k>=0;k--)tr.clips[k].remove(false,false);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var k=tr.clips.numItems-1;k>=0;k--)tr.clips[k].remove(false,false);}
function seg(x){var y=new Time();y.seconds=x;return y;}
var pos=0,v=s.videoTracks[0];for(var i=0;i<T.length;i++){it.setInPoint(T[i][0],4);it.setOutPoint(T[i][1],4);v.overwriteClip(it,seg(pos));pos=v.clips[v.clips.numItems-1].end.seconds;}
it.clearInPoint();it.clearOutPoint();
var st=s.getSettings();return "ok "+s.name+" V1 "+v.clips.numItems+" A1 "+s.audioTracks[0].clips.numItems+" fin "+pos.toFixed(2)+" "+st.videoFrameWidth+"x"+st.videoFrameHeight+" fps "+(1/st.videoFrameRate.seconds).toFixed(3);})();
