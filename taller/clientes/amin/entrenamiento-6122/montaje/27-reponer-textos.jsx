(function(){var PL="/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v12.mogrt";function seg(x){var y=new Time();y.seconds=x;return y;}
var TX=[[7.73,8.61,"¿Llevar ropa simple?",[255,255,255]],[9.0,9.71,"DE RICO",[30,138,255]]];
var p=app.project,s=p.activeSequence,v8=s.videoTracks[7];for(var j=0;j<v8.clips.numItems;j++)if(v8.clips[j].start.seconds>7.5)return "ERROR: V8 ya tiene algo tras 7,5";
var o=[];for(var i=0;i<TX.length;i++){var a=TX[i],c=s.importMGT(PL,String(Math.round(a[0]*254016000000)),7,0);c.end=seg(a[1]);c.outPoint=seg(a[1]-a[0]);var m=c.getMGTComponent();
 function txt(k,t){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(j),true);}
 txt(16,"");txt(15,a[2]);m.properties[14].setColorValue(255,a[3][0],a[3][1],a[3][2],true);m.properties[0].setValue(0,true);m.properties[10].setValue(true,true);m.properties[9].setValue(100,true);m.properties[8].setValue(38,true);m.properties[7].setValue(16,true);
 m.properties[3].setValue(a[2].length>9?Math.round(67.89*11/a[2].length*10)/10:67.89,true);c.name="PRUEBA · "+a[2];}
p.save();for(var j=0;j<v8.clips.numItems;j++)o.push(v8.clips[j].name+" "+v8.clips[j].start.seconds.toFixed(2)+"-"+v8.clips[j].end.seconds.toFixed(2));return o.join(" | ");})();
