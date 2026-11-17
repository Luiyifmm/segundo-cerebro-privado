// Pruebas de subtítulos A (Belfort, v12), B (Heras, SF limpio en 2 líneas), C (Said/Alborna, fino v1). Pista V6 de cada copia. Amarillo #F5C542 = 245,197,66.
(function(){var p=app.project,D="/Users/luiyi/Videos-Remotion/clientes/_plantillas/",Y=[245,197,66],W=[255,255,255],o=[];
function seg(x){var y=new Time();y.seconds=x;return y;}function tk(x){return String(Math.round(x*254016000000));}
function abrir(n){for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name==n){p.openSequence(p.sequences[i].sequenceID);return p.activeSequence;}return null;}
function poner(s,pl,a,b,pista){var c=s.importMGT(D+pl+".mogrt",tk(a),pista==null?5:pista,0);c.end=seg(b);c.outPoint=seg(b-a);return c;}
function txt(m,k,t){var pp=m.properties[k],j=JSON.parse(pp.getValue());j.textEditValue=t;j.fontTextRunLength=[t.length];pp.setValue(JSON.stringify(j),true);}
function vacia(s){app.enableQE();if(s.videoTracks.numTracks<7)qe.project.getActiveSequence().addTracks(1,s.videoTracks.numTracks,0);for(var tt=5;tt<7;tt++){var v=s.videoTracks[tt];for(var k=v.clips.numItems-1;k>=0;k--)v.clips[k].remove(false,false);}}
// A · Belfort
var s=abrir("6887-08 · PRUEBA SUBS A Belfort");vacia(s);
var A=[[1.88,2.60,"ponte en forma",""],[2.60,3.26,"deja el","PORNO"],[3.26,3.74,"cero móvil",""],[3.74,4.58,"por las mañanas",""],[4.58,5.24,"busca un","MENTOR"],[5.24,5.82,"que esté donde",""],[5.82,6.60,"tú quieres estar",""],[6.60,7.34,"deja de mirar",""],[7.34,7.76,"las historias",""],[7.76,8.30,"de los demás",""]];
for(var i=0;i<A.length;i++){var a=A[i],c=poner(s,"Subtitulo Amin v12",a[0],a[1]),m=c.getMGTComponent();txt(m,16,a[2]);txt(m,15,a[3]);if(!a[3])m.properties[2].setValue(true,true);
 m.properties[13].setColorValue(255,255,255,255,true);m.properties[14].setColorValue(255,Y[0],Y[1],Y[2],true);m.properties[0].setValue(0,true);m.properties[1].setValue(false,true);
 m.properties[3].setValue(55,true);m.properties[5].setValue(0,true);m.properties[6].setValue(4,true);m.properties[10].setValue(true,true);m.properties[9].setValue(60,true);m.properties[8].setValue(40,true);m.properties[7].setValue(8,true);c.name="A · "+a[2]+" "+a[3];}
o.push("A "+s.videoTracks[5].clips.numItems);
// B · Víctor Heras: frase en 2 líneas; la línea con la idea clave en amarillo
s=abrir("6887-08 · PRUEBA SUBS B Heras");vacia(s);
var B=[[1.88,3.26,"ponte en forma",W,"y deja el porno",Y],[3.26,4.58,"cero móvil",W,"por las mañanas",W],[4.58,6.60,"busca un mentor",Y,"que esté donde tú quieres estar",W],[6.60,8.30,"deja de mirar las historias",W,"de los demás",W]];
for(var i=0;i<B.length;i++){var b=B[i];for(var L=0;L<2;L++){var c=poner(s,"Subtitulo SF limpio v1",b[0],b[1],L==0?6:5),m=c.getMGTComponent(),col=b[2+L*2+1];txt(m,5,b[2+L*2]);m.properties[0].setValue(false,true);m.properties[1].setColorValue(255,col[0],col[1],col[2],true);m.properties[4].setValue(__TB__,true);m.properties[3].setValue(L==0?__H1__:__H2__,true);m.properties[2].setValue(60,true);c.name="B · "+b[2+L*2];}
 if(i==0){}}
o.push("B "+(s.videoTracks[5].clips.numItems+s.videoTracks[6].clips.numItems));
// C · Marco Said / Alborna: frase fina palabra a palabra + clave en amarillo con brillo suave
s=abrir("6887-08 · PRUEBA SUBS C Said-Alborna");vacia(s);
var C=[[1.88,2.60,"ponte en","forma"],[2.60,3.26,"deja el","porno"],[3.26,3.74,"cero","móvil"],[3.74,4.58,"por las mañanas",""],[4.58,5.24,"busca un","mentor"],[5.24,6.60,"que esté donde tú quieres estar",""],[6.60,7.34,"deja de mirar",""],[7.34,8.30,"las historias de los demás",""]];
for(var i=0;i<C.length;i++){var a=C[i],c=poner(s,"Subtitulo Amin fino v1",a[0],a[1]),m=c.getMGTComponent();txt(m,9,a[2]);txt(m,8,a[3]);m.properties[7].setColorValue(255,255,255,255,true);m.properties[6].setColorValue(255,Y[0],Y[1],Y[2],true);m.properties[1].setValue(30,true);m.properties[4].setValue(9,true);m.properties[2].setValue(__TC__,true);m.properties[3].setValue(__HC__,true);c.name="C · "+a[2]+" "+a[3];}
o.push("C "+s.videoTracks[5].clips.numItems);
// fotos
app.enableQE();var F="/Users/luiyi/Videos-Remotion/clientes/amin/IMG_6887-s03/08/fotos/",T=[2.2,3.0,3.6,4.2,5.0,6.2,7.0,8.0],SQ=["6887-08 · PRUEBA SUBS A Belfort","6887-08 · PRUEBA SUBS B Heras","6887-08 · PRUEBA SUBS C Said-Alborna"],L3=["A","B","C"];
for(var k=0;k<3;k++){s=abrir(SQ[k]);var q=qe.project.getActiveSequence();for(var i=0;i<T.length;i++){s.setPlayerPosition(tk(T[i]));q.exportFramePNG(q.CTI.timecode,F+"prueba"+L3[k]+i+".png");}}
for(var i=0;i<p.sequences.numSequences;i++)if(p.sequences[i].name=="6887-08 · propuesta Claude v1")p.openSequence(p.sequences[i].sequenceID);
p.save();return o.join(" | ");})();
