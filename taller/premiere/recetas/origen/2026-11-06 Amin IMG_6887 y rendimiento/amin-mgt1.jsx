(function(){app.enableQE();var s=app.project.activeSequence;if(s.name!="IMG_6887")return "activa "+s.name;
var n=s.videoTracks.numTracks;qe.project.getActiveSequence().addTracks(1,n,0);s=app.project.activeSequence;
var c=s.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt",String(Math.round(22.401*254016000000)),n,0);
var e=new Time();e.seconds=22.901;c.end=e;var m=c.getMGTComponent(),o=["pista V"+(n+1)];
for(var p=0;p<m.properties.numItems;p++){var v="";try{v=String(m.properties[p].getValue()).substr(0,120)}catch(x){}o.push(p+" "+m.properties[p].displayName+" = "+v);}
return o.join(" | ");})();
