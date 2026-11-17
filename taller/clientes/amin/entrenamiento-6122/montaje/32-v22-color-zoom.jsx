// v2.2: color solo en el veredicto; plano más cerrado en moraleja y CTA.
(function(){var s=app.project.activeSequence;if(s.name!="ENTRENAMIENTO 6122 · v2.2")return "ERROR: secuencia";
var W=[255,255,255],RO=[230,40,40];
// nombre actual → [texto nuevo, color]
var C={"TRISTE":["Triste y",W],"Y DE MEDIOCRE":["DE MEDIOCRE",RO],"MEDIOCRE":["mediocre",W],"CASI SIEMPRE":["casi siempre",W],"SI SABES COMPRARLO":["si sabes comprarlo",W],"MUY RICO":["muy rico",W],"PORQUE TE ARRUINA":["porque te arruina",W],"O ERES POBRE":["o eres pobre",W]};
var v8=s.videoTracks[7],o=[];
for(var j=0;j<v8.clips.numItems;j++){var c=v8.clips[j],n=c.name.replace("FORMATO · ","");if(!C[n])continue;var t=C[n][0],col=C[n][1],m=c.getMGTComponent();
 var pp=m.properties[15],js=JSON.parse(pp.getValue());js.textEditValue=t;js.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(js),true);
 m.properties[14].setColorValue(255,col[0],col[1],col[2],true);
 var sz=(col==W)?Math.min(30,Math.round(67.89*11/t.length*10)/10):(t.length>9?Math.round(67.89*11/t.length*10)/10:67.89);m.properties[3].setValue(sz,true);
 c.name="FORMATO · "+t;o.push(t+"@"+c.start.seconds.toFixed(2)+" "+sz);}
var Z={moraleja1:160,moraleja2:180,moraleja3:160,cta:185},v1=s.videoTracks[0];
for(var j=0;j<v1.clips.numItems;j++){var c=v1.clips[j],b=c.name.split(" · ")[1];if(Z[b]){c.components[1].properties[1].setValue(Z[b],true);c.components[1].properties[0].setValue([0.5,0.5],true);o.push(b+" "+Z[b]);}}
app.project.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[1.9,2.4,7.5,11.9,13.9,19.9,22.9,25.0,27.0,28.6,30.5,34.0,38.0];
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"v22_"+("0"+i).slice(-2)+".png");}
return o.join(" | ");})();
