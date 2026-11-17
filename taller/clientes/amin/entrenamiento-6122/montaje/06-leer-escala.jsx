(function(){var s=app.project.activeSequence,c=s.videoTracks[0].clips[2],o=[];
for(var i=0;i<c.components.numItems;i++){var k=c.components[i];var pp=[];for(var j=0;j<Math.min(3,k.properties.numItems);j++){var v;try{v=k.properties[j].getValue();}catch(e){v="?"}pp.push(k.properties[j].displayName+"="+v);}o.push(i+":"+k.displayName+"["+pp.join(";")+"]");}
return c.name+" | "+o.join(" | ");})();
