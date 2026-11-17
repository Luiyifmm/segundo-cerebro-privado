// Voz: +15 dB de clip ya puestos; aquí «Amplificar» +8,5 dB y un segundo «Limitador forzado» detrás como techo (−1 dB). Solo A1.
(function(){app.enableQE();var s=app.project.activeSequence,a=s.audioTracks[0],qa=qe.project.getActiveSequence().getAudioTrackAt(0);
var fa=qe.project.getAudioEffectByName("Amplificación"),fl=qe.project.getAudioEffectByName("Limitador forzado");if(!fa||!fa.name)return "ERROR: no hay Amplificación";
function n(c,nm){var k=0;for(var i=0;i<c.components.numItems;i++)if(c.components[i].displayName==nm)k++;return k;}
for(var j=0;j<qa.numItems;j++){var qi=qa.getItemAt(j);if(!qi||qi.type!="Clip")continue;var c=null;for(var i=0;i<a.clips.numItems;i++)if(Math.abs(a.clips[i].start.seconds-qi.start.secs)<0.02)c=a.clips[i];
 if(c&&n(c,"Amplificación")==0){qi.addAudioEffect(fa);qi.addAudioEffect(fl);}}
var o=[],c0=a.clips[0];for(var k=0;k<c0.components.numItems;k++){var cm=c0.components[k],ps=[];for(var q=0;q<cm.properties.numItems;q++){try{ps.push(cm.properties[q].displayName+"="+cm.properties[q].getValue());}catch(e){}}o.push(k+":"+cm.displayName+"["+ps.join(",")+"]");}
return o.join(" ; ");})();
