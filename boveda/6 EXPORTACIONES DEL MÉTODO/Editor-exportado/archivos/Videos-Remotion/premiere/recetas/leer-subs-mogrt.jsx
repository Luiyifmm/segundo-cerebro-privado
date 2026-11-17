// Lee todos los clips MOGRT de la secuencia activa (texto, controles, posición, escala) para ver qué cambió el usuario a mano.
(function(){var s=app.project.activeSequence,o=[app.project.name+" / "+s.name];
for(var k=0;k<s.videoTracks.numTracks;k++){var t=s.videoTracks[k];for(var i=0;i<t.clips.numItems;i++){var c=t.clips[i],m=null;try{m=c.getMGTComponent()}catch(e){}if(!m)continue;
var d={};for(var p=0;p<m.properties.numItems;p++){var pr=m.properties[p],v;try{v=pr.getValue()}catch(e){v="?"}if(typeof v=="string"&&v.charAt(0)=="{"){try{var j=JSON.parse(v);v="T:"+j.textEditValue+(j.fontEditValue?" F:"+j.fontEditValue:"")+(j.fontSizeEditValue?" S:"+j.fontSizeEditValue:"")}catch(e){}}if(pr.displayName.indexOf("Color")>=0){try{v=pr.getColorValue().join(",")}catch(e){}}d[pr.displayName]=String(v)}
var mv=null;for(var x=0;x<c.components.numItems;x++)if(c.components[x].matchName=="AE.ADBE Motion")mv=c.components[x];
d["_pos"]=String(mv.properties[0].getValue());d["_esc"]=String(mv.properties[1].getValue());var op=c.components[0].properties[0];d["_opac"]=String(op.getValue());
o.push("V"+(k+1)+"|"+c.start.seconds.toFixed(2)+"|"+c.end.seconds.toFixed(2)+"|"+(c.disabled?"OFF":"on")+"|"+c.name+"|"+JSON.stringify(d))}}return o.join("\n")})();
