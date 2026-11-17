// Crea «6887-F2 Tres cosas que dan dinero · corte (Claude)» con las tomas de tramos.json (segundos del bruto) seguidas en V1/A1. No toca otras secuencias.
(function(){var N="6887-F2 Tres cosas que dan dinero · corte (Claude)",T=[[1927.502, 1929.631], [1933.671, 1934.961], [1939.878, 1940.891], [1941.261, 1943.071], [1949.501, 1949.911], [1957.041, 1958.811], [1960.481, 1961.631], [1962.021, 1963.231], [1963.621, 1964.111], [1986.609, 1989.041], [1994.141, 2000.461], [2001.811, 2002.621], [2003.771, 2006.181], [2026.591, 2033.181], [2033.451, 2036.181], [2039.201, 2043.311]],p=app.project;
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
