(function(){app.enableQE();var s=app.project.activeSequence,r=[],q=qe.project.getActiveSequence(),qt=q.getVideoTrackAt(25),v26=s.videoTracks[25];
var f=qe.project.getVideoEffectByName("Tinción");
for(var k=0;k<v26.clips.numItems;k++){var cl=v26.clips[k];var nm=[];for(var x=0;x<cl.components.numItems;x++)nm.push(cl.components[x].displayName);if(nm.join().indexOf("Tinci")>-1)continue;
 for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-cl.start.seconds)<0.02){qi.addVideoEffect(f);break;}}
 var lst=[];for(var x=0;x<cl.components.numItems;x++){var co=cl.components[x];lst.push(co.displayName);if(co.displayName.indexOf("Tinci")==0){var ps=[];for(var p=0;p<co.properties.numItems;p++)ps.push(p+":"+co.properties[p].displayName);r.push(ps.join(","));
   co.properties[0].setColorValue(255,0,0,0,true);co.properties[1].setColorValue(255,0,250,255,true);co.properties[2].setValue(100,true);}}
 r.push(cl.start.seconds.toFixed(2)+": "+lst.join(" > "));}
app.project.save();return r.join(" | ");})();
