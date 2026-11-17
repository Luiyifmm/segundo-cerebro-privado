(function(){
var r=["proxies activados: "+app.getEnableProxies()];
var s=app.project.activeSequence; r.push("seq "+s.name+" "+s.frameSizeHorizontal+"x"+s.frameSizeVertical);
var vistos={};
for(var t=0;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var pi=tr.clips[c].projectItem;if(!pi||vistos[pi.name])continue;vistos[pi.name]=1;var hp=false;try{hp=pi.hasProxy();}catch(e){}r.push("V"+(t+1)+" "+pi.name+" proxy="+hp);}}
return r.join(" | ");
})();
