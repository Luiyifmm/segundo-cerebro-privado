(function(){var s=app.project.activeSequence,o=[];var T=s.videoTracks[25];var cl=T.clips[0];o.push("V26 "+cl.start.seconds.toFixed(2)+" "+cl.name);
for(var k=0;k<cl.components.numItems;k++){var co=cl.components[k];o.push(" comp "+co.displayName+" ("+co.matchName+")");for(var p=0;p<co.properties.numItems;p++){var pr=co.properties[p],v="";try{v=String(pr.getValue());}catch(e){v="?"}o.push("   ["+p+"] "+pr.displayName+" = "+v.substr(0,300));}}
return o.join("\n");})();
