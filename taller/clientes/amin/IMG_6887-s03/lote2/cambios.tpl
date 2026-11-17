// Cambios tras el árbitro. CFG: desactivar [{txt,t?}] (MOGRT por texto) · desactivarA [t] (SFX en la última pista de audio) · texto [{de,a,t?,fin?,esc?}] · extender [txt] (Flicker hasta el fin del subtítulo blanco siguiente)
(function(){var C=__CFG__,s=app.project.activeSequence,o=[];function T(x){var y=new Time();y.seconds=x;return y;}
function mov(cl){for(var k=0;k<cl.components.numItems;k++)if(cl.components[k].displayName=="Movimiento")return cl.components[k];}
var M=[],W=[];for(var t=1;t<s.videoTracks.numTracks;t++){var tr=s.videoTracks[t];for(var c=0;c<tr.clips.numItems;c++){var cl=tr.clips[c],mg=null;try{mg=cl.getMGTComponent();}catch(e){}if(!mg)continue;
 var P=null;for(var y=0;y<mg.properties.numItems;y++){var p=mg.properties[y];if(p.displayName=="Linea"||(cl.name=="Efecto Flicker Con Brillo"&&y==0)){P=p;break;}}if(!P)continue;
 var j=JSON.parse(P.getValue());var x={cl:cl,P:P,j:j,txt:j.textEditValue,fl:cl.name=="Efecto Flicker Con Brillo",col:(function(){try{return mg.properties[0].getValue();}catch(e){return "";}})()};M.push(x);}}
function cerca(x,t){return t==null||Math.abs(x.cl.start.seconds-t)<0.08;}
var D=C.desactivar||[];for(var i=0;i<D.length;i++)for(var k=0;k<M.length;k++)if(M[k].txt==D[i].txt&&cerca(M[k],D[i].t)){M[k].cl.disabled=true;o.push("off «"+M[k].txt+"» "+M[k].cl.start.seconds.toFixed(2));}
var A=C.desactivarA||[],at=s.audioTracks[s.audioTracks.numTracks-1];for(var i=0;i<A.length;i++)for(var c=0;c<at.clips.numItems;c++)if(Math.abs(at.clips[c].start.seconds-A[i])<0.08){at.clips[c].disabled=true;o.push("SFX off "+A[i]);}
var X=C.texto||[];for(var i=0;i<X.length;i++)for(var k=0;k<M.length;k++){var m=M[k];if(m.txt==X[i].de&&cerca(m,X[i].t)){m.j.textEditValue=X[i].a;m.j.fontTextRunLength=[X[i].a.length];m.P.setValue(JSON.stringify(m.j),true);if(!m.fl)m.cl.name=X[i].a;if(X[i].fin)m.cl.end=T(X[i].fin);if(X[i].esc)mov(m.cl).properties[1].setValue(X[i].esc,true);m.txt=X[i].a;o.push("«"+X[i].a+"»");}}
var E=C.extender||[],v1=s.videoTracks;for(var k=0;k<M.length;k++){var m=M[k];if(!m.fl||E.indexOf(m.txt)<0)continue;var best=null;
 for(var q=0;q<M.length;q++){var w=M[q];if(w.fl||w.cl.disabled)continue;if(w.cl.start.seconds>=m.cl.start.seconds-0.01&&(!best||w.cl.start.seconds<best.cl.start.seconds))best=w;}
 if(best){var fin=best.cl.end.seconds;for(var q=0;q<M.length;q++){var w=M[q];if(!w.fl&&Math.abs(w.cl.end.seconds-fin)<0.02)fin=Math.max(fin,w.cl.end.seconds);}var lim=9e9;for(var q=0;q<M.length;q++){var w=M[q];if(w.fl&&w!==m&&w.cl.start.seconds>m.cl.start.seconds)lim=Math.min(lim,w.cl.start.seconds-0.03);}
  m.cl.end=T(Math.min(fin,lim));o.push(m.txt+" → "+m.cl.end.seconds.toFixed(2));}}
app.project.save();return o.join(" | ");})();
