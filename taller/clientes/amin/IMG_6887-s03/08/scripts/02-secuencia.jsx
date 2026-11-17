(function(){var p=app.project,N="6887-08 · propuesta Claude v1";
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ERROR: ya existe";
function buscar(b,n,r){for(var i=0;i<b.children.numItems;i++){var c=b.children[i];if(c.name==n&&c.type!=2)r.push(c);if(c.type==2)buscar(c,n,r);}return r;}
var its=buscar(p.rootItem,"IMG_6887.MOV",[]);if(!its.length)return "ERROR: sin IMG_6887.MOV";var it=its[0];
var bin=p.rootItem.createBin("6887-08 (Claude)");
var s=p.createNewSequenceFromClips(N,[it],bin);
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var k=tr.clips.numItems-1;k>=0;k--)tr.clips[k].remove(false,false);}
for(var t=0;t<s.audioTracks.numTracks;t++){var tr=s.audioTracks[t];for(var k=tr.clips.numItems-1;k>=0;k--)tr.clips[k].remove(false,false);}
var st=s.getSettings();var sfx=buscar(p.rootItem,"SFX (Claude)",[]);
var o="ok "+s.name+" "+st.videoFrameWidth+"x"+st.videoFrameHeight+" fps "+(1/st.videoFrameRate.seconds).toFixed(2)+" | items IMG_6887 "+its.length+" proxy "+it.hasProxy()+" | V"+s.videoTracks.numTracks+" A"+s.audioTracks.numTracks;
// bandeja de SFX
for(var i=0;i<p.rootItem.children.numItems;i++){var c=p.rootItem.children[i];if(c.name.indexOf("SFX")>=0){o+=" | bin "+c.name+":";for(var j=0;j<c.children.numItems&&j<20;j++)o+=" "+c.children[j].name+";";}}
p.save();return o;})();
