(function(){var s=null;for(var i=0;i<app.project.sequences.numSequences;i++)if(app.project.sequences[i].name=="Secuencia 01")s=app.project.sequences[i];var o=[];
try{for(var t=0;t<3;t++){var T=s.videoTracks[t];for(var c=0;c<T.clips.numItems;c++){var cl=T.clips[c];var fx=[];for(var k=0;k<cl.components.numItems;k++)fx.push(cl.components[k].displayName);o.push("V"+(t+1)+" "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2)+" "+cl.name+" ["+fx.join(",")+"]");}}
var cl=s.videoTracks[2].clips[0];for(var k=0;k<cl.components.numItems;k++){var co=cl.components[k];if(co.displayName!="Color de Lumetri")continue;o.push("LUM n="+co.properties.numItems);
 for(var p=0;p<co.properties.numItems;p++){var pr=co.properties[p],v;try{v=pr.getValue();}catch(e){v="ERR";}var tv=typeof v;if(tv=="number"||tv=="boolean")o.push(p+" "+pr.displayName+" = "+v);else o.push(p+" "+pr.displayName+" ("+tv+")");}}}catch(e){o.push("EXC "+e);}
return o.join(" | ");})();
