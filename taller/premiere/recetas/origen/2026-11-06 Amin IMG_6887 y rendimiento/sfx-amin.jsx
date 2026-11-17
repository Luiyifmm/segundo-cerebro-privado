(function(){app.enableQE();var r=[],s=app.project.activeSequence;if(s.name!="IMG_6887")return "activa: "+s.name;
var I="/Users/luiyi/Library/CloudStorage/GoogleDrive-luiscarlosmercadoleon@gmail.com/Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/09 Interfaz y avisos/";
var F={ui:I+"Ui button.wav",clic:"/Users/luiyi/Library/CloudStorage/GoogleDrive-luiscarlosmercadoleon@gmail.com/Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/06 Teclado y clics/Mouse Click 03.wav",wh:"/Users/luiyi/Library/CloudStorage/GoogleDrive-luiscarlosmercadoleon@gmail.com/Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/01 Whooshes/VS_Short Whoosh 3.mp3",pop:I+"Smooth Pop.wav",glitch:I+"Ui Glitch, Flicker, Text (2).wav",reloj:I+"RELOJ.mp3",cont:I+"106 Counter_9.wav",caja:I+"Cash Machine sound effect.m4a",noti:I+"snapchat-notification-sound.mp3"};
var root=app.project.rootItem,bin=null;for(var i=0;i<root.children.numItems;i++)if(root.children[i].name=="SFX (Claude)")bin=root.children[i];if(!bin)bin=root.createBin("SFX (Claude)");
var lst=[];for(var k in F)lst.push(F[k]);app.project.importFiles(lst,true,bin,false);
function it(p){var n=p.split("/").pop();for(var j=0;j<bin.children.numItems;j++)if(bin.children[j].name==n)return bin.children[j];return null;}
var n0=s.audioTracks.numTracks;qe.project.getActiveSequence().addTracks(0,0,4,1,n0);s=app.project.activeSequence;
function db(x){return Math.pow(10,(x-15)/20);}
function pon(ti,key,t,d,dur){var tr=s.audioTracks[n0+ti],p=it(F[key]);if(!p){r.push("falta "+key);return;}tr.overwriteClip(p,t);for(var m=0;m<tr.clips.numItems;m++){var c=tr.clips[m];if(Math.abs(c.start.seconds-t)<0.03){if(dur){var e=new Time();e.seconds=t+dur;c.end=e;}for(var x=0;x<c.components.numItems;x++)if(c.components[x].displayName=="Volumen")c.components[x].properties[1].setValue(db(d),true);}}}
var NUM=[3.50,4.90,6.73,8.13,9.07,10.70,12.43,13.83,15.03];for(var i=0;i<NUM.length;i++)pon(0,"ui",NUM[i],-8);
pon(0,"noti",36.97,-8);
var CL=[16.73,18.37,19.10,20.23,22.40,25.50,26.93,28.63,33.77,35.37];for(var i=0;i<CL.length;i++)pon(1,"clic",CL[i],-6);
pon(1,"glitch",0.23,-10);pon(1,"glitch",1.77,-10);
var MG=[2.20,3.80,5.27,7.07,9.40,11.03,14.23];for(var i=0;i<MG.length;i++)pon(2,"pop",MG[i],-12);
pon(2,"wh",1.93-0.5,-10);pon(2,"wh",15.93-0.5,-10);pon(2,"pop",39.27,-8);
pon(3,"reloj",0.77,-14,1.03);pon(3,"cont",29.57,-12,1.45);pon(3,"caja",31.05,-14);
for(var i=0;i<4;i++)r.push("A"+(n0+1+i)+": "+s.audioTracks[n0+i].clips.numItems);
app.project.save();return r.join(" | ");})();
