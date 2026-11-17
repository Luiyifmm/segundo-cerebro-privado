// A3 v2: zooms + paneo de 80 px a la izquierda entre 13,7 y 19,5 s (hace sitio a la columna derecha cuando se inclina) y recarga la lista v4.
(function(){var p=app.project,S=p.activeSequence,o=[];if(S.name!="6887-08 · JORDAN A3 zooms + lista 2 col")return "ERROR secuencia";
function seg(x){var y=new Time();y.seconds=x;return y;}
var z=S.videoTracks[2].clips[0];if(z.name.indexOf("ZOOM")!=0)return "ERROR V3 no es el zoom";
var T=null;for(var k=0;k<z.components.numItems;k++)if(z.components[k].displayName=="Transformar")T=z.components[k];
var E=T.properties[3],base=z.inPoint.seconds-z.start.seconds,FIN=z.end.seconds;E.setTimeVarying(false);E.setValue(100,true);E.setTimeVarying(true);
var K={};function key(t,v){t=Math.round(t*1000)/1000;K[t]=v;}
function mover(t0,dur,a,b,c){for(var i=0;i<c.length;i++)key(t0+dur*c[i][0],a+(b-a)*c[i][1]);}
var OUT=[[0,0],[0.2,0.45],[0.4,0.72],[0.6,0.88],[1,1]],LENTO=[[0,0],[0.1,0.19],[0.25,0.44],[0.45,0.7],[0.7,0.91],[1,1]],ZI=108;
mover(0,1.8,130.9,100,LENTO);   // zoom out del inicio (tu receta)
mover(3.23,0.4,100,ZI,OUT);     // cero móvil
mover(6.57,0.4,ZI,100,OUT);     // deja de mirar
mover(9.70,0.4,100,ZI,OUT);     // sal del grupo
mover(11.30,0.4,ZI,100,OUT);    // di que no
 mover(13.73,0.4,100,ZI,OUT);    // aprende a vender: acercamiento + paneo (ver P)
 mover(17.60,0.4,ZI,105,OUT);    // acostúmbrate: suelta un poco

key(19.483,ZI);key(19.50,100);  // tu corte a 125 %
mover(20.53,0.4,100,ZI,OUT);    // deja de cambiar horas por dinero
mover(22.27,0.4,ZI,100,OUT);    // si tú quieres aprender
mover(25.17,0.4,100,ZI,OUT);    // decenas de miles de euros
key(27.283,ZI);key(27.30,100);  // corte del CTA
mover(28.20,0.4,100,106,OUT);   // PLAN
mover(28.60,FIN-28.60,106,109,[[0,0],[1,1]]); // cierre lento
var P=T.properties[1];P.setTimeVarying(false);P.setValue([0.5,0.5],true);P.setTimeVarying(true);var KP={};function kp(t,x){t=Math.round(t*1000)/1000;KP[t]=x;}
for(var i=0;i<OUT.length;i++){kp(13.73+0.4*OUT[i][0],0.5-0.037*OUT[i][1]);kp(17.60+0.4*OUT[i][0],0.463+0.012*OUT[i][1]);}kp(0,0.5);kp(13.70,0.5);kp(19.483,0.475);kp(19.50,0.5);
var np=0;for(var t in KP){var tt=seg(parseFloat(t)+base);P.addKey(tt);P.setValueAtKey(tt,[KP[t],0.5],true);np++;}o.push("paneo "+np);
var n=0;for(var t in K){var tt=seg(parseFloat(t)+base);E.addKey(tt);E.setValueAtKey(tt,K[t],true);n++;}o.push("claves "+n);
var bin=null;for(var i=0;i<p.rootItem.children.numItems;i++)if(p.rootItem.children[i].name=="6887-08 (Claude)")bin=p.rootItem.children[i];
var r=0;for(var i=0;i<bin.children.numItems;i++){var it=bin.children[i];if(it.name.indexOf("lista v4 ")==0){try{it.refreshMedia();r++;}catch(e){o.push("refresh falla "+it.name+": "+e);}}}o.push("PNG recargados "+r);
return o.join(" | ");})();
