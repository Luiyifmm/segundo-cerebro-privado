(function(){app.enableQE();var s=app.project.activeSequence,r=[];if(s.name!="IMG_6887")return "activa "+s.name;
var MG="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",T=28,v25=s.videoTracks[24];
var L=[[25.501,26.034,"su","tiempo"],[33.767,34.201,"ser","libre"],[35.367,35.801,"por","dinero"]];
for(var i=0;i<L.length;i++){var a=L[i];var c=s.importMGT(MG,String(Math.round(a[0]*254016000000)),T,0);var e=new Time();e.seconds=a[1];c.end=e;var m=c.getMGTComponent();
 function txt(k,t){var p=m.properties[k],j=JSON.parse(p.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];p.setValue(JSON.stringify(j),true);}
 txt(16,a[2]);txt(15,a[3]);m.properties[14].setColorValue(255,0,250,255,true);
 for(var k=0;k<v25.clips.numItems;k++)if(Math.abs(v25.clips[k].start.seconds-a[0])<0.01){v25.clips[k].disabled=true;r.push("V25 "+a[0]+" desactivado");}}
// V26: tinte cian + resplandor como los azules del usuario
var ref=null,v24=s.videoTracks[23];for(var k=0;k<v24.clips.numItems;k++)if(Math.abs(v24.clips[k].start.seconds-3.5)<0.05)ref=v24.clips[k];
var rv=null;for(var k=0;k<ref.components.numItems;k++)if(ref.components[k].displayName=="Resplandor de VR")rv=ref.components[k];
var q=qe.project.getActiveSequence(),qt=q.getVideoTrackAt(25),v26=s.videoTracks[25],fT=qe.project.getVideoEffectByName("Tinta"),fR=qe.project.getVideoEffectByName("Resplandor de VR");
for(var k=0;k<v26.clips.numItems;k++){var cl=v26.clips[k];var tiene=false;for(var x=0;x<cl.components.numItems;x++)if(cl.components[x].displayName=="Tinta")tiene=true;if(tiene)continue;
 for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-cl.start.seconds)<0.02){qi.addVideoEffect(fT);qi.addVideoEffect(fR);break;}}
 for(var x=0;x<cl.components.numItems;x++){var co=cl.components[x];
  if(co.displayName=="Tinta"){co.properties[0].setColorValue(255,0,0,0,true);co.properties[1].setColorValue(255,0,250,255,true);co.properties[2].setValue(100,true);}
  if(co.displayName=="Resplandor de VR")for(var p=1;p<rv.properties.numItems;p++){try{co.properties[p].setValue(rv.properties[p].getValue(),true);}catch(e){}}}
 r.push("V26 "+cl.start.seconds.toFixed(2)+" azul");}
app.project.save();return r.join(" | ");})();
