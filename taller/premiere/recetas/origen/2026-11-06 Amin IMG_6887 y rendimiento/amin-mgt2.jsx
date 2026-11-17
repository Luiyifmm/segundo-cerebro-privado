(function(){app.enableQE();var s=app.project.activeSequence,T=s.videoTracks[28],c=T.clips[0],m=c.getMGTComponent();
function txt(i,t){var p=m.properties[i],j=JSON.parse(p.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];p.setValue(JSON.stringify(j),true);}
txt(16,"por");txt(15,"sesión");m.properties[14].setColorValue(255,0,250,255,true);
var v25=s.videoTracks[24];for(var k=0;k<v25.clips.numItems;k++)if(Math.abs(v25.clips[k].start.seconds-22.401)<0.01)v25.clips[k].disabled=true;
var q=qe.project.getActiveSequence();s.setPlayerPosition(String(Math.round(22.8*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/t1");
s.setPlayerPosition(String(Math.round(27.4*254016000000)));q.exportFramePNG(q.CTI.timecode,"/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/t2");return "ok";})();
