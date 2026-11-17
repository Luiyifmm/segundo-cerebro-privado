// «CARO» y «PLAN» se ven muy poco: el bloque siguiente empieza en su palabra (sin adelanto) y el remate y su línea 1 se alargan hasta ahí.
(function(){var p=app.project;for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · JORDAN A completo v1")p.openSequence(p.sequences[i].sequenceID);
var s=p.activeSequence,v6=s.videoTracks[5],v7=s.videoTracks[6],o=[];function seg(x){var y=new Time();y.seconds=x;return y;}
var FIX=[["te van a odiar",15.78,"cobra más","CARO"],["y te estaré enviando",28.44,"comenta la palabra","PLAN"]];
for(var k=0;k<FIX.length;k++){var f=FIX[k],nx=null,pv=null,rm=null;
 for(var j=0;j<v6.clips.numItems;j++){var c=v6.clips[j];if(c.name=="JORDAN A · "+f[0])nx=c;if(c.name=="JORDAN A · "+f[2])pv=c;}
 for(var j=0;j<v7.clips.numItems;j++)if(v7.clips[j].name=="JORDAN A · "+f[3])rm=v7.clips[j];
 if(!nx||!pv||!rm)return "ERROR no encuentro "+f[0];nx.start=seg(f[1]);pv.end=seg(f[1]);rm.end=seg(f[1]);o.push(f[3]+" "+rm.start.seconds.toFixed(2)+"-"+rm.end.seconds.toFixed(2));}
p.save();return o.join(" | ");})();
