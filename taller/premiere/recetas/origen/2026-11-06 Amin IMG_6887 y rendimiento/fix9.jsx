(function(){app.enableQE();var s=app.project.activeSequence,r=[];
function comp(cl,n){for(var x=0;x<cl.components.numItems;x++)if(cl.components[x].displayName==n)return cl.components[x];return null;}
function find(t,st){var T=s.videoTracks[t];for(var k=0;k<T.clips.numItems;k++)if(Math.abs(T.clips[k].start.seconds-st)<0.02)return T.clips[k];return null;}
var la=find(25,16.73);var tc=comp(la,"Tinción");tc.properties[1].setColorValue(255,255,255,255,true);tc.properties[2].setValue(0,true);var rg=comp(la,"Resplandor de VR");rg.properties[6].setValue(0,true);r.push("la neutro");
var nueve=find(24,16.73);var ref=find(25,18.37);var rv=comp(ref,"Resplandor de VR");
var q=qe.project.getActiveSequence(),qt=q.getVideoTrackAt(24);for(var j=0;j<qt.numItems;j++){var qi=qt.getItemAt(j);if(qi&&qi.type=="Clip"&&Math.abs(qi.start.secs-16.73)<0.03){qi.addVideoEffect(qe.project.getVideoEffectByName("Tinción"));qi.addVideoEffect(qe.project.getVideoEffectByName("Resplandor de VR"));break;}}
var t2=comp(nueve,"Tinción");t2.properties[0].setColorValue(255,0,0,0,true);t2.properties[1].setColorValue(255,0,250,255,true);t2.properties[2].setValue(100,true);
var r2=comp(nueve,"Resplandor de VR");for(var p=1;p<rv.properties.numItems;p++){try{r2.properties[p].setValue(rv.properties[p].getValue(),true)}catch(e){}}
r.push("9 azul");app.project.save();
s.setPlayerPosition(String(Math.round(16.9*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nueve");return r.join(" | ");})();
