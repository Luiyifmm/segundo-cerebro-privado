// 1) «planes»: p6b +2 f al final; p7 empieza 2 f más tarde (recorta su silencio inicial). Sin desplazar nada.
// 2) CTA: bajada de volumen en los 3 últimos fotogramas (el corte cae en habla continua antes de «donde»).
(function(){var s=app.project.activeSequence,f=1/30,o=[];function seg(x){var y=new Time();y.seconds=x;return y;}
var tr=[s.videoTracks[0],s.audioTracks[0]];for(var k=0;k<2;k++){var a=null,b=null;for(var j=0;j<tr[k].clips.numItems;j++){var n=tr[k].clips[j].name;if(/ p6b$/.test(n))a=tr[k].clips[j];if(/ p7$/.test(n))b=tr[k].clips[j];}
 if(!a||!b)return "ERROR: no encuentro p6b/p7 en "+(k?"A1":"V1");var t=b.start.seconds+2*f;b.start=seg(t);a.end=seg(t);o.push((k?"A":"V")+" p6b fin "+a.end.seconds.toFixed(3)+" p7 ini "+b.start.seconds.toFixed(3)+" in "+(b.inPoint.seconds-785.651).toFixed(3));}
var a1=s.audioTracks[0],c=null;for(var j=0;j<a1.clips.numItems;j++)if(/ CTA$/.test(a1.clips[j].name))c=a1.clips[j];
var vol=null;for(var k=0;k<c.components.numItems;k++)if(c.components[k].displayName=="Volumen")vol=c.components[k];var nv=vol.properties[1],v0=nv.getValue();
var tEnd=c.outPoint.seconds,t0=tEnd-3*f;nv.setTimeVarying(true);nv.addKey(t0);nv.setValueAtKey(t0,v0,true);nv.addKey(tEnd);nv.setValueAtKey(tEnd,0,true);o.push("CTA bajada "+t0.toFixed(2)+"→"+tEnd.toFixed(2)+" desde "+v0);
app.project.save();return o.join(" | ");})();
