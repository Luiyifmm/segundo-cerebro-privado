// Crea «6887-H No estar pelado · corte (Claude)» con las tomas de tramos.json (segundos del bruto) seguidas en V1/A1. No toca otras secuencias.
(function(){var N="6887-H No estar pelado · corte (Claude)",T=[[2414.511, 2417.141], [2424.08, 2430.641], [2449.895, 2451.937], [2459.603, 2463.431], [2472.611, 2473.941], [2478.201, 2479.271], [2491.211, 2492.921], [2496.151, 2496.901], [2497.271, 2501.291], [2535.621, 2537.731], [2539.421, 2542.391], [2542.481, 2544.891], [2545.281, 2546.671], [2547.801, 2549.262], [2549.282, 2550.051], [2556.305, 2557.211], [2557.681, 2562.441], [2565.881, 2569.061], [2570.011, 2574.161], [2574.331, 2578.381], [2579.191, 2581.861], [2582.451, 2584.261], [2584.851, 2587.661], [2588.135, 2588.751], [2590.271, 2592.071], [2593.481, 2598.491], [2604.108, 2605.581]],p=app.project;
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
