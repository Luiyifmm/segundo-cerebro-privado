// Informa de qué clips de la secuencia activa tienen proxy y, si se pide, activa/desactiva la reproducción con proxies.
// CFG: {"activar":true | false | null}   (null = solo informar)
// Comprobado el 06-11 (origen/…/proxy-estado.jsx y proxy-on.jsx).
(function(){var C=__CFG__;if(C.activar===true)app.setEnableProxies(1);if(C.activar===false)app.setEnableProxies(0);
var r=["proxies activados: "+app.getEnableProxies()],s=app.project.activeSequence,vistos={};r.push("seq "+s.name);
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var pi=tr.clips[c].projectItem;if(!pi||vistos[pi.name])continue;vistos[pi.name]=1;var hp=false;try{hp=pi.hasProxy();}catch(e){}if(hp||t==0)r.push("V"+(t+1)+" "+pi.name+" proxy="+hp);}}
return r.join(" | ");})();
