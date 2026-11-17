var SEG=[[795.731, 797.771], [815.251, 816.931], [828.351, 829.731], [844.851, 846.871], [859.311, 862.731], [869.211, 870.871], [872.551, 876.071], [881.151, 882.471], [886.551, 887.851], [920.651, 923.531], [897.451, 900.601], [909.951, 911.751], [928.131, 939.101]];

var RUTA="/Users/luiyi/Downloads/IMG_6887.MOV",NOMBRE="IMG_6887 · vídeo 5 (Claude)";
function seg(x){var y=new Time();y.seconds=x;return y;}
var it=null;function rec(p){for(var i=0;i<p.children.numItems;i++){var c=p.children[i];if(c.type==2)rec(c);else{try{if(c.getMediaPath()==RUTA&&!it)it=c;}catch(e){}}}}rec(app.project.rootItem);
var ya=false;for(var i=0;i<app.project.sequences.numSequences;i++)if(app.project.sequences[i].name==NOMBRE)ya=true;
if(!it)"ERROR: no encuentro el bruto";else if(ya)"ERROR: ya existe "+NOMBRE;else{
var sq=app.project.createNewSequenceFromClips(NOMBRE,[it],app.project.rootItem);
for(var t=0;t<sq.videoTracks.numTracks;t++)while(sq.videoTracks[t].clips.numItems)sq.videoTracks[t].clips[0].remove(false,false);
for(var t=0;t<sq.audioTracks.numTracks;t++)while(sq.audioTracks[t].clips.numItems)sq.audioTracks[t].clips[0].remove(false,false);
var pos=0;for(var k=0;k<SEG.length;k++){it.setInPoint(SEG[k][0],4);it.setOutPoint(SEG[k][1],4);sq.videoTracks[0].overwriteClip(it,seg(pos));pos+=SEG[k][1]-SEG[k][0];}
it.clearInPoint(4);it.clearOutPoint(4);
app.project.save();sq.name+" "+sq.frameSizeHorizontal+"x"+sq.frameSizeVertical+" dur "+pos.toFixed(2)+" V1="+sq.videoTracks[0].clips.numItems+" A1="+sq.audioTracks[0].clips.numItems+" V2="+(sq.videoTracks.numTracks>1?sq.videoTracks[1].clips.numItems:"-");}
