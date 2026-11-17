(function(){var o=[];for(var k=0;k<app.projects.numProjects;k++)o.push("PROY "+app.projects[k].path);var s=app.project.activeSequence;
if(!s)return o.join(" | ")+" | sin secuencia activa";
o.push("ACTIVO "+app.project.name+" / "+s.name+" "+s.frameSizeHorizontal+"x"+s.frameSizeVertical+" fin="+(s.end/254016000000).toFixed(2)+" cursor="+s.getPlayerPosition().seconds.toFixed(2));
var m=s.markers,k2=m.getFirstMarker();while(k2){o.push("MARCA "+k2.start.seconds.toFixed(1)+" "+k2.name+" "+k2.comments);k2=m.getNextMarker(k2);}
for(var t=0;t<s.videoTracks.numTracks;t++){var T=s.videoTracks[t];if(T.clips.numItems){var nm={};for(var c=0;c<T.clips.numItems;c++)nm[T.clips[c].name]=1;var ks=[];for(var n in nm)ks.push(n);o.push("V"+(t+1)+": "+T.clips.numItems+" clips ("+T.clips[0].start.seconds.toFixed(1)+"-"+T.clips[T.clips.numItems-1].end.seconds.toFixed(1)+") "+ks.slice(0,6).join(", "));}}
for(var t=0;t<s.audioTracks.numTracks;t++){var T=s.audioTracks[t];if(T.clips.numItems){var nm={};for(var c=0;c<T.clips.numItems;c++)nm[T.clips[c].name]=1;var ks=[];for(var n in nm)ks.push(n);o.push("A"+(t+1)+": "+T.clips.numItems+" clips ("+T.clips[0].start.seconds.toFixed(1)+"-"+T.clips[T.clips.numItems-1].end.seconds.toFixed(1)+") "+ks.slice(0,5).join(", "));}}
return o.join(" | ");})();
