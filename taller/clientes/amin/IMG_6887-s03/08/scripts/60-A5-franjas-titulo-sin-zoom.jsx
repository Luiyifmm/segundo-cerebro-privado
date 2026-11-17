// A5 = duplicado de A4 con franjas negras (arriba 0–960, abajo 2900–3840; PNG en pista nueva sobre el vídeo y debajo de los textos),
// título «12 HÁBITOS PARA CAMBIAR / TU VIDA EN 6 MESES» en la franja de arriba (plantilla Jordan v4, editable) y SIN zooms.
// Se desactiva (no se borra): capa de zoom y título anterior. A4 no se toca.
(function(){var p=app.project,o=[],N="6887-08 · JORDAN A5 franjas negras sin zoom";
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==N)return "ya existe A5";
var A4=p.activeSequence;if(A4.name!="6887-08 · JORDAN A4 lista 1 col + clic")return "ERROR activa";
var ids={};for(var i=0;i<p.sequences.numSequences;i++)ids[p.sequences[i].sequenceID]=1;A4.clone();var S=null;for(var i=0;i<p.sequences.numSequences;i++)if(!ids[p.sequences[i].sequenceID])S=p.sequences[i];
S.name=N;p.openSequence(S.sequenceID);S=p.activeSequence;if(S.name!=N)return "ERROR no abre A5";
var FIN=S.videoTracks[0].clips[S.videoTracks[0].clips.numItems-1].end.seconds;
// sin zoom
var z=S.videoTracks[2].clips[0];if(z.name.indexOf("ZOOM")!=0)return "ERROR V3";z.disabled=true;
// título anterior desactivado
var d=0;for(var t=0;t<S.videoTracks.numTracks;t++){var tr=S.videoTracks[t];for(var j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.name.indexOf("TÍTULO")==0&&!c.disabled){c.disabled=true;d++;}}}o.push("título viejo desactivado "+d);
// franjas en pista nueva justo encima de la capa de zoom (V4 nueva)
app.enableQE();var q=qe.project.getActiveSequence();q.addTracks(1,3,0);S=p.activeSequence;var tf=S.videoTracks[3];if(tf.clips.numItems)return "ERROR pista franjas no vacía";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var FP="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/lista/franjas negras 960-2900.png";p.importFiles([FP],true,bin,false);
var fi=null;for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name=="franjas negras 960-2900.png")fi=bin.children[i];
tf.overwriteClip(fi,seg(0));var fc=tf.clips[0];fc.end=seg(FIN);fc.name="FRANJAS NEGRAS";
// título en la franja: dos líneas, pistas nuevas arriba; la plantilla dura 30 s → segundo tramo sin animación
var PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Jordan v4.mogrt";
var TT=[["12 HÁBITOS PARA CAMBIAR",1,2,0.405],["TU VIDA EN 6 MESES",4,2,0.452]];
q=qe.project.getActiveSequence();q.addTracks(2,S.videoTracks.numTracks,0);S=p.activeSequence;var nT=S.videoTracks.numTracks;
var tramos=[[0,30,true],[30,FIN,false]];
for(var k=0;k<2;k++)for(var r=0;r<2;r++){var a=tramos[r][0],b=tramos[r][1];var c=S.importMGT(PL,tk(a),nT-2+k,0);c.end=seg(b);var m=c.getMGTComponent();
 var pp=m.properties[13],js=JSON.parse(pp.getValue());js.textEditValue=TT[k][0];js.fontTextRunLength=[TT[k][0].length];pp.setValue(JSON.stringify(js),true);
 m.properties[11].setColorValue(255,245,197,66,true);m.properties[10].setValue(TT[k][1],true);m.properties[9].setValue(TT[k][2],true);m.properties[8].setValue(40,true);m.properties[7].setValue(100,true);
 m.properties[2].setValue(tramos[r][2],true);m.properties[1].setValue(9+k*3,true);m.properties[0].setValue(0,true);m.properties[6].setValue(0,true);m.properties[5].setValue(1,true);
 for(var x=0;x<c.components.numItems;x++)if(c.components[x].displayName=="Movimiento")c.components[x].properties[0].setValue([0.5,TT[k][3]],true);
 c.name="TÍTULO FRANJA · "+TT[k][0]+(r?" (cont.)":"");}
o.push("título en V"+(nT-1)+"–V"+nT);
return o.join(" | ");})();
