// +8,5 dB en «Volumen del canal» de cada clip de A1 (la voz del bruto está a −39,6 LUFS; +15 de clip no basta). Escala: valor = 10^((dB−15)/20).
(function(){var s=app.project.activeSequence,a=s.audioTracks[0],v=Math.pow(10,(8.5-15)/20),o=[];
for(var j=0;j<a.clips.numItems;j++){var c=a.clips[j];for(var k=0;k<c.components.numItems;k++){var cm=c.components[k];if(cm.displayName=="Volumen del canal"){for(var q=0;q<cm.properties.numItems;q++){var pr=cm.properties[q];if(pr.displayName!="Omitir"&&pr.displayName!="Bypass"){try{pr.setValue(v,true);}catch(e){}}}o.push(j);}}}
app.project.save();var c0=a.clips[0],r=[];for(var k=0;k<c0.components.numItems;k++){var cm=c0.components[k];var ps=[];for(var q=0;q<cm.properties.numItems;q++){try{ps.push(cm.properties[q].displayName+"="+cm.properties[q].getValue());}catch(e){}}r.push(cm.displayName+"["+ps.join(",")+"]");}
return "clips "+o.length+" | "+r.join(" ; ");})();
