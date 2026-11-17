(function(){
var D="/Users/luiyi/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/";
var L={medias:"R",iphone:"R",logos:"R",simple:"L",coche:"R",casa:"R",invertir:"L",banco:"R",cocinar:"L"};
function seg(x){var y=new Time();y.seconds=x;return y;}
var p=app.project,s=p.activeSequence;app.enableQE();var q=qe.project.getActiveSequence();
if(s.videoTracks.numTracks<4){q.addTracks(1,3,0);}
if(s.videoTracks.numTracks<4)return "ERROR: no se creó V4";
var v4=s.videoTracks[3];if(v4.clips.numItems)return "ERROR: V4 no está vacía";
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="IMÁGENES 6122")bin=p.rootItem.children[i];
if(!bin)bin=p.rootItem.createBin("IMÁGENES 6122");
var fs=[];for(var k in L)fs.push(D+"6122 "+k+".png");
if(bin.children.numItems==0)p.importFiles(fs,true,bin,false);
function item(n){for(var i=0;i<bin.children.numItems;i++)if(bin.children[i].name=="6122 "+n+".png")return bin.children[i];return null;}
// tramos por bloque a partir de V1
var v1=s.videoTracks[0],T={};for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j],b=c.name.split(" · ")[1];if(!L[b])continue;if(!T[b])T[b]=[c.start.seconds,c.end.seconds];T[b][0]=Math.min(T[b][0],c.start.seconds);T[b][1]=Math.max(T[b][1],c.end.seconds);
 c.components[1].properties[0].setValue([L[b]=="R"?0.30:0.70,0.5],true);}
var fx=qe.project.getVideoEffectByName("Sombra paralela");var o=[];
for(var b in T){var it=item(b);if(!it){o.push("falta "+b);continue;}
 v4.overwriteClip(it,seg(T[b][0]));
 var c=null;for(var j=0;j<v4.clips.numItems;j++)if(Math.abs(v4.clips[j].start.seconds-T[b][0])<0.02)c=v4.clips[j];
 c.end=seg(T[b][1]);c.name="IMAGEN · "+b;
 var mo=c.components[1];mo.properties[0].setValue([L[b]=="R"?0.764:0.236,0.354],true);mo.properties[1].setValue(100,true);
 var qv=q.getVideoTrackAt(3);for(var j=0;j<qv.numItems;j++){var qi=qv.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-T[b][0])<0.02&&fx&&fx.name)qi.addVideoEffect(fx);}
 o.push(b+" "+T[b][0].toFixed(2)+"-"+T[b][1].toFixed(2)+" "+L[b]);}
p.save();
var Dd="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",TT=[0.6,3.3,5.5,8.3,11.0,15.0,17.5,21.0,24.5];
for(var i=0;i<TT.length;i++){s.setPlayerPosition(String(Math.round(TT[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,Dd+"im"+i+".png");}
return o.join(" | ");})();
