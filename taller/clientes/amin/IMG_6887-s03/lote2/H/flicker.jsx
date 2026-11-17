// Copia el MOGRT «Efecto Flicker Con Brillo» de la Secuencia 04 (todos sus parámetros) en una pista NUEVA y cambia solo el texto y la posición.
(function(){var C={"items": [{"sv": 7, "sc": 6, "t0": 6.051, "t1": 7.152, "txt": "×150", "pos": [0.5, 0.6375]}, {"sv": 7, "sc": 6, "t0": 10.356, "t1": 11.584, "txt": "×0,10", "pos": [0.5, 0.6375]}, {"sv": 7, "sc": 6, "t0": 15.981, "t1": 16.621, "txt": "×6", "pos": [0.5, 0.6375]}, {"sv": 7, "sc": 6, "t0": 18.356, "t1": 19.397, "txt": "×0,70", "pos": [0.5, 0.6375]}, {"sv": 7, "sc": 6, "t0": 58.219, "t1": 59.74, "txt": "5.000 – 10.000", "pos": [0.5, 0.6375]}, {"sv": 7, "sc": 6, "t0": 64.951, "t1": 65.611, "txt": "PLAN", "pos": [0.5, 0.6375]}]};app.enableQE();var P=app.project;function S(n){for(var i=0;i<P.sequences.numSequences;i++)if(P.sequences[i].name==n)return P.sequences[i];}
function T(x){var y=new Time();y.seconds=x;return y;}
var src=S("Secuencia 04"),s=P.activeSequence;var nV=s.videoTracks.numTracks;qe.project.getActiveSequence().addTracks(1,nV,0);s=P.activeSequence;var tr=s.videoTracks[nV];var o=[];
for(var q=0;q<C.items.length;q++){var it=C.items[q];var sc=src.videoTracks[it.sv-1].clips[it.sc];
 tr.overwriteClip(sc.projectItem,T(it.t0));var cl=null;for(var c=0;c<tr.clips.numItems;c++)if(Math.abs(tr.clips[c].start.seconds-it.t0)<0.02)cl=tr.clips[c];
 cl.end=T(it.t1);var Ms=sc.components[1],Md=cl.components[1];for(var z=0;z<Ms.properties.numItems;z++){try{Md.properties[z].setValue(Ms.properties[z].getValue(),true);}catch(e){}}
 if(it.pos)Md.properties[0].setValue(it.pos,true);
 var Gs=sc.getMGTComponent(),Gd=cl.getMGTComponent();for(var z=1;z<Gs.properties.numItems;z++){var ps=Gs.properties[z],pd=Gd.properties[z];try{var cv=ps.getColorValue();if(cv&&ps.displayName.indexOf("Color")>=0){pd.setColorValue(cv[0],cv[1],cv[2],cv[3],true);continue;}}catch(e){}try{pd.setValue(ps.getValue(),true);}catch(e){}}
 var j=JSON.parse(Gs.properties[0].getValue());j.textEditValue=it.txt;j.fontTextRunLength=[it.txt.length];Gd.properties[0].setValue(JSON.stringify(j),true);
 o.push(it.txt+" "+cl.start.seconds.toFixed(2)+"-"+cl.end.seconds.toFixed(2));}
return "V"+(nV+1)+": "+o.join(" | ");})();
