// Duplica una secuencia y le pone nombre. La original no se toca.
// CFG: {"guardia":{…},"origen":"nombre EXACTO","nuevo":"nombre de la copia","activar":false (por defecto deja activa la que estaba)}
// Se niega si ya existe una secuencia con el nombre nuevo o si no existe la de origen.
// La copia se encuentra por sequenceID nuevo (clone() no la devuelve y cambia la activa).
// 08-11 (fase 8B.2): sustituye a los duplicados escritos a mano en 6887-08 (scripts 16, 20, 24, 26, 47, 50, 59 y 60).
(function(){var C=__CFG__,P=app.project,o=null,ids={};
for(var i=0;i<P.sequences.numSequences;i++){var q=P.sequences[i];ids[q.sequenceID]=1;if(q.name==C.nuevo)return "ERROR: ya existe «"+C.nuevo+"» (no hago nada)";if(q.name==C.origen)o=q;}
if(!o)return "ERROR: no existe la secuencia «"+C.origen+"»";
var antes=P.activeSequence;o.clone();var c=null;
for(var i=0;i<P.sequences.numSequences;i++)if(!ids[P.sequences[i].sequenceID])c=P.sequences[i];
if(!c)return "ERROR: no encuentro la copia";c.name=C.nuevo;
if(C.activar)P.openSequence(c.sequenceID);else if(antes)P.openSequence(antes.sequenceID);
return "copia: «"+c.name+"» de «"+o.name+"» · activa: "+P.activeSequence.name;})();
