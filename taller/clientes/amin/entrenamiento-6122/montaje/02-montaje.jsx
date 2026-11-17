(function(){var D=[["P", 0.0, 117.9, 119.14, [115.11, 116.35], 125, "medias"], ["R", 1.24, 119.14, 120.62, null, 125, "medias"], ["P", 2.72, 94.99, 96.11, [93.18, 94.3], 140, "iphone"], ["R", 3.84, 96.11, 97.2, null, 140, "iphone"], ["P", 4.93, 184.26, 185.33, [181.85, 182.92], 125, "logos"], ["R", 6.0, 185.33, 187.05, null, 125, "logos"], ["P", 7.72, 194.16, 195.05, [191.76, 192.65], 140, "simple"], ["R", 8.61, 195.05, 196.15, null, 140, "simple"], ["P", 9.71, 148.64, 149.5, [131.46, 132.32], 125, "coche"], ["R", 10.57, 149.5, 153.3, null, 125, "coche"], ["P", 14.37, 163.91, 165.29, [161.1, 162.48], 140, "casa"], ["R", 15.75, 165.29, 166.45, null, 140, "casa"], ["P", 16.91, 173.68, 175.0, [171.85, 173.17], 125, "invertir"], ["R", 18.23, 175.0, 177.05, null, 125, "invertir"], ["P", 20.28, 238.35, 239.63, [229.78, 231.06], 140, "banco"], ["R", 21.56, 239.63, 241.5, null, 140, "banco"], ["P", 23.43, 106.04, 106.81, [104.08, 104.85], 125, "cocinar"], ["R", 24.2, 106.81, 108.85, null, 125, "cocinar"], ["H", 26.24, 272.5, 274.5, null, 140, "moraleja1"], ["H", 28.24, 290.95, 291.75, null, 125, "moraleja2"], ["H", 29.04, 292.32, 296.1, null, 150, "moraleja3"], ["H", 32.82, 315.05, 320.55, null, 125, "cta"]];
function seg(x){var y=new Time();y.seconds=x;return y;}
var p=app.project,s=p.activeSequence,it=null;
for(var i=0;i<p.rootItem.children.numItems;i++){var c=p.rootItem.children[i];if(c.name=="IMG_6122.MOV")it=c;}
if(s.videoTracks[0].clips.numItems>0||s.audioTracks[0].clips.numItems>0)return "ERROR: la secuencia no está vacía";
var r=[];
for(var k=0;k<D.length;k++){var d=D[k];
 it.setInPoint(seg(d[2]),4);it.setOutPoint(seg(d[3]),4);
 s.videoTracks[0].overwriteClip(it,seg(d[1]));
}
it.clearInPoint();it.clearOutPoint();
// escala y quitar el audio original de los planos callados
var vt=s.videoTracks[0],at=s.audioTracks[0];
for(var k=0;k<D.length;k++){var d=D[k];
 for(var j=0;j<vt.clips.numItems;j++){var c=vt.clips[j];if(Math.abs(c.start.seconds-d[1])<0.02){var mo=c.components[1];mo.properties[1].setValue(d[5],true);c.name="IMG_6122 · "+d[6]+(d[0]=="P"?" · plano callado":"");}}
 if(d[0]=="P"){for(var j=at.clips.numItems-1;j>=0;j--){var c=at.clips[j];if(Math.abs(c.start.seconds-d[1])<0.02){c.remove(false,false);}}}
}
// voz de Amin con la pregunta, en A2
var a2=s.audioTracks[1];
for(var k=0;k<D.length;k++){var d=D[k];if(d[0]!="P")continue;
 it.setInPoint(seg(d[4][0]),4);it.setOutPoint(seg(d[4][1]),4);
 a2.overwriteClip(it,seg(d[1]));
}
it.clearInPoint();it.clearOutPoint();
for(var j=0;j<a2.clips.numItems;j++)a2.clips[j].name="IMG_6122 · voz de Amin (pregunta)";
var v2=s.videoTracks[1].clips.numItems;
p.save();
return "V1 "+vt.clips.numItems+" | A1 "+at.clips.numItems+" | A2 "+a2.clips.numItems+" | V2 "+v2+" | fin "+s.end/254016000000;
})();