// Duplica «JORDAN A2 enfasis selectivo» → «JORDAN A3 zooms + lista 2 col». A2 no se toca.
(function(){var P=app.project,N="6887-08 · JORDAN A3 zooms + lista 2 col";
for(var i=0;i<P.sequences.numSequences;i++)if(P.sequences[i].name==N)return "ya existe A3; no hago nada";
var S=P.activeSequence; if(S.name!="6887-08 · JORDAN A2 enfasis selectivo")return "ERROR activa no es A2";
var ids={};for(var i=0;i<P.sequences.numSequences;i++)ids[P.sequences[i].sequenceID]=1;
S.clone();var C=null;for(var i=0;i<P.sequences.numSequences;i++)if(!ids[P.sequences[i].sequenceID])C=P.sequences[i];
if(!C)return "ERROR no encuentro la copia";C.name=N;P.openSequence(C.sequenceID);
return "A3 creada: "+C.name+" · activa: "+P.activeSequence.name+" · A2 intacta: "+S.name;})();
