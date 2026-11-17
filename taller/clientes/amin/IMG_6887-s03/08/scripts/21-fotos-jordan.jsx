(function(){var p=app.project,SQ={"A":"6887-08 · JORDAN A fiel","B":"6887-08 · JORDAN B adaptado","C":"6887-08 · JORDAN C cinematografico"},T=[1.90,2.0,2.50,2.78,3.0,3.3,4.6,5.2,5.75,6.2,6.6,7.3,7.62,8.1],F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/";
function tk(x){return String(Math.round(x*254016000000));}app.enableQE();
for(var k in SQ){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==SQ[k])p.openSequence(p.sequences[i].sequenceID);var s=p.activeSequence,q=qe.project.getActiveSequence();
 for(var i=0;i<T.length;i++){s.setPlayerPosition(tk(T[i]));q.exportFramePNG(q.CTI.timecode,F+"j"+k+(i<10?"0":"")+i+".png");}}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);return "ok";})();
