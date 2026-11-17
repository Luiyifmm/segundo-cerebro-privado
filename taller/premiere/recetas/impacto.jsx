// Golpe de impacto con efectos NATIVOS de Premiere, keyframes por fotograma (fase 5, estudio «Invisible – Marco Said»).
// Patrón medido en su pila de After Effects: varias capas débiles a la vez, SUBIDA corta (≈0,29 s) y BAJADA larga (0,5–0,8 s),
// sacudida de 4 f en el pico, desenfoque de movimiento por obturador. Después, plano limpio.
// Requiere en cada clip afectado (V de la pista indicada): Transformar, Desenfoque gaussiano, Color de Lumetri, Desplazamiento turbulento
// (la receta los añade si faltan). Cruza cortes: reparte la curva entre los clips que toquen [pico−subida, pico+bajada].
// CFG: {"guardia":{…},"pista":1,"pico":10.66,"subida":0.30,"bajada":0.74,"fps":30,
//       "escala":9,"desenfoque":12,"exposicion":1.0,"temperatura":-20,"turbulencia":35,"sacudida_px":14,"obturador":360}
// Valores: escala = +% sobre 100 en Transformar; desenfoque = Cantidad; exposicion/temperatura = Lumetri (19/14); turbulencia = Cantidad.
// OJO (comprobado 07-11): el Desenfoque gaussiano 2026 entra con Cantidad 20 y el Desplazamiento turbulento con 50 → la receta los pone a 0 fuera del golpe.
(function(){var C=__CFG__;app.enableQE();
var s=app.project.activeSequence,v=s.videoTracks[(C.pista||1)-1],qv=qe.project.getActiveSequence().getVideoTrackAt((C.pista||1)-1);
var fps=C.fps||30,pk=C.pico,up=C.subida||0.3,dn=C.bajada||0.74,t0=pk-up,t1=pk+dn,r=[];
function curva(t){if(t<=t0||t>=t1)return 0;if(t<=pk){var u=(t-t0)/up;return u*u;}var w=(t-pk)/dn;return Math.pow(1-w,2.5);}   // sube acelerando, cae frenando
function sacude(t){var d=t-pk;if(d<0||d>4/fps)return [0,0];var f=Math.round(d*fps);var J=[[1,-0.7],[-0.85,0.6],[0.45,-0.3],[0,0]];return J[Math.min(f,3)];}
function comp(c,n){for(var i=0;i<c.components.numItems;i++)if(c.components[i].displayName==n)return c.components[i];return null;}
function fx(qi,n){var f=qe.project.getVideoEffectByName(n);if(!f||!f.name)throw new Error("no existe el efecto "+n);qi.addVideoEffect(f);}
var nombres=["Transformar","Desenfoque gaussiano","Color de Lumetri","Desplazamiento turbulento"];
for(var k=0;k<v.clips.numItems;k++){var c=v.clips[k],a=c.start.seconds,b=c.end.seconds;if(b<=t0||a>=t1)continue;
 var qi=null;for(var j=0;j<qv.numItems;j++){var q=qv.getItemAt(j);if(q&&q.type=="Clip"&&Math.abs(q.start.secs-a)<0.02)qi=q;}
 for(var n=0;n<nombres.length;n++)if(!comp(c,nombres[n]))fx(qi,nombres[n]);
 var T=comp(c,"Transformar"),G=comp(c,"Desenfoque gaussiano"),L=comp(c,"Color de Lumetri"),D=comp(c,"Desplazamiento turbulento");
 T.properties[2].setValue(true,true);T.properties[9].setValue(false,true);T.properties[10].setValue(C.obturador||360,true);
 var off=c.inPoint.seconds-a;   // tiempo de keyframe = tiempo del ORIGEN del clip
 var props=[[T.properties[3],100,function(x,t){return 100+C.escala*x;}],
  [T.properties[1],[0.5,0.5],function(x,t){var j=sacude(t),px=(C.sacudida_px||14);return [0.5+j[0]*px/s.frameSizeHorizontal,0.5+j[1]*px/s.frameSizeVertical];}],
  [G.properties[5],0,function(x){return C.desenfoque*x;}],
  [L.properties[19],0,function(x){return C.exposicion*x;}],
  [L.properties[14],0,function(x){return C.temperatura*x;}],
  [D.properties[1],0,function(x){return C.turbulencia*x;}]];
 var ta=Math.max(a,t0-1/fps),tb=Math.min(b-0.5/fps,t1+1/fps),nk=0;
 for(var p=0;p<props.length;p++){var P=props[p][0];P.setTimeVarying(true);
  for(var t=ta;t<=tb+1e-6;t+=1/fps){var tt=Math.round(t*fps)/fps;P.addKey(tt+off);P.setValueAtKey(tt+off,props[p][2](curva(tt),tt),true);nk++;}
  // fuera del golpe, valor base (y el desenfoque/turbulencia a 0 aunque el efecto entre con otro valor)
  P.addKey(a+off+0.001);P.setValueAtKey(a+off+0.001,(a<t0)?props[p][1]:props[p][2](curva(a),a),true);}
 r.push("clip "+a.toFixed(2)+"–"+b.toFixed(2)+": "+nk+" keys (tramo "+ta.toFixed(2)+"–"+tb.toFixed(2)+")");}
return r.join(" | ")||"ERROR: ningún clip toca el golpe";})();
