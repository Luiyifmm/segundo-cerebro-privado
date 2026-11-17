// v2.2: resaltar solo una palabra (línea blanca + palabra clave de color), tamaño menor y textos más arriba.
(function(){var s=app.project.activeSequence;if(s.name!="ENTRENAMIENTO 6122 · v2.2")return "ERROR";
var V={"DE POBRE":["de","POBRE"],"DE MEDIOCRE":["de","MEDIOCRE"],"DE RICO":["de","RICO"],"PERO DE RICO":["pero de","RICO"],"O ERES MUY RICO":["o eres muy","RICO"],"COMENTA RICO":["comenta","RICO"]};
var TAM=45,ALT=56,v8=s.videoTracks[7],o=[],n=0;
for(var j=0;j<v8.clips.numItems;j++){var c=v8.clips[j],m=c.getMGTComponent();m.properties[4].setValue(ALT,true);n++;
 var k=c.name.replace("FORMATO · ","");if(!V[k])continue;
 function set(i,t){var pp=m.properties[i],js=JSON.parse(pp.getValue());js.textEditValue=t;js.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(js),true);}
 set(16,V[k][0]);set(15,V[k][1]);m.properties[13].setColorValue(255,255,255,255,true);m.properties[3].setValue(TAM,true);c.name="FORMATO · "+V[k][0]+" "+V[k][1];o.push(c.name.replace("FORMATO · ","")+"@"+c.start.seconds.toFixed(2));}
app.project.save();app.enableQE();var q=qe.project.getActiveSequence(),F="/Users/luiyi/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/fotos/",T=[0.6,2.4,4.7,9.4,13.0,19.2,22.3,25.9,27.0,30.5,38.0];
for(var i=0;i<T.length;i++){s.setPlayerPosition(String(Math.round(T[i]*254016000000)));q.exportFramePNG(q.CTI.timecode,F+"u_"+("0"+i).slice(-2)+".png");}
return "altura en "+n+" | "+o.join(" | ");})();
