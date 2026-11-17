// Montaje del 08: una toma por frase (EDL verificada), V1+A1. Escala alterna 100/110 en la lista; 125 en la frase del dinero y el CTA.
(function(){var E=[["G", 795.621, 797.621, 0, 100], ["p1", 802.211, 803.801, 2.0, 110], ["p2", 828.381, 829.751, 3.59, 100], ["p3", 844.761, 846.791, 4.96, 110], ["p4", 859.301, 862.631, 6.99, 100], ["p5", 869.111, 870.771, 10.32, 110], ["p6b", 876.731, 879.201, 11.98, 100], ["p7", 883.241, 884.111, 14.45, 110], ["p8", 888.801, 890.001, 15.32, 100], ["p9", 902.461, 904.891, 16.52, 110], ["p10", 910.211, 912.371, 18.95, 100], ["D", 919.311, 923.541, 21.11, 125], ["CTA", 928.151, 936.701, 25.34, 125]],p=app.project,s=p.activeSequence;if(s.name!="6887-08 · propuesta Claude v1")return "ERROR secuencia";
if(s.videoTracks[0].clips.numItems||s.audioTracks[0].clips.numItems)return "ERROR: V1/A1 no vacías";
function buscar(b,n,r){for(var i=0;i<b.children.numItems;i++){var c=b.children[i];if(c.name==n&&c.type!=2)r.push(c);if(c.type==2)buscar(c,n,r);}return r;}
var it=buscar(p.rootItem,"IMG_6887.MOV",[])[0];function seg(x){var y=new Time();y.seconds=x;return y;}
var o=[];for(var i=0;i<E.length;i++){var e=E[i];it.setInPoint(e[1],4);it.setOutPoint(e[2],4);s.videoTracks[0].overwriteClip(it,seg(e[3]));}
it.clearInPoint();it.clearOutPoint();
var v=s.videoTracks[0];for(var j=0;j<v.clips.numItems;j++){var c=v.clips[j];for(var i=0;i<E.length;i++)if(Math.abs(c.start.seconds-E[i][3])<0.04){c.name="6887-08 · "+E[i][0];c.components[1].properties[1].setValue(E[i][4],true);}}
var a=s.audioTracks[0];for(var j=0;j<a.clips.numItems;j++){for(var i=0;i<E.length;i++)if(Math.abs(a.clips[j].start.seconds-E[i][3])<0.04)a.clips[j].name="6887-08 · voz "+E[i][0];}
p.save();return "V1 "+v.clips.numItems+" A1 "+a.clips.numItems+" fin "+(s.end/254016000000).toFixed(2);})();