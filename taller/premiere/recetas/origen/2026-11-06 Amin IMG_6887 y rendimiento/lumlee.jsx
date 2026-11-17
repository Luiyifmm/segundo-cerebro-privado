(function(){var s=null;for(var i=0;i<app.project.sequences.numSequences;i++)if(app.project.sequences[i].name=="Secuencia 01")s=app.project.sequences[i];var o=["fin="+(s.end/254016000000).toFixed(1)];
for(var t=0;t<s.videoTracks.numTracks;t++){var T=s.videoTracks[t];for(var c=0;c<T.clips.numItems;c++){var cl=T.clips[c];var fx=[];for(var k=0;k<cl.components.numItems;k++)fx.push(cl.components[k].displayName);
 if(t<3||fx.join().indexOf("Lumetri")>-1)o.push("V"+(t+1)+" "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2)+" "+cl.name+" ["+fx.slice(2).join(",")+"]");
 for(var k=0;k<cl.components.numItems;k++){var co=cl.components[k];if(co.displayName!="Color de Lumetri")continue;for(var p=0;p<co.properties.numItems;p++){var v="";try{v=co.properties[p].getValue();}catch(e){v="?"}var sv=String(v);if(sv.length>60)sv=sv.substr(0,60)+"…";o.push("     "+p+" "+co.properties[p].displayName+" = "+sv);}}}}
return o.join(" | ");})();
