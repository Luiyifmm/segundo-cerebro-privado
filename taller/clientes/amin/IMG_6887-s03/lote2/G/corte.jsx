// Crea «6887-G Quién paga en las citas · corte (Claude)» con las tomas de tramos.json (segundos del bruto) seguidas en V1/A1. No toca otras secuencias.
(function(){var N="6887-G Quién paga en las citas · corte (Claude)",T=[[2082.341, 2084.151], [2100.941, 2103.311], [2108.571, 2109.321], [2110.291, 2110.869], [2115.051, 2115.681], [2116.521, 2117.251], [2123.161, 2123.831], [2124.441, 2125.151], [2136.071, 2136.881], [2137.451, 2138.261], [2139.471, 2140.221], [2140.871, 2141.681], [2148.851, 2151.751], [2160.461, 2161.871], [2162.561, 2164.691], [2167.551, 2168.861], [2186.841, 2190.021], [2195.024, 2197.431], [2234.401, 2237.891], [2243.203, 2245.611], [2282.061, 2284.011], [2284.641, 2287.091], [2288.421, 2294.421], [2294.981, 2300.721], [2304.831, 2308.641], [2335.801, 2339.711]],p=app.project;
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
