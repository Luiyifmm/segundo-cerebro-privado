// Lista los nombres REALES de los efectos de vídeo (en español) que contienen el texto buscado.
// CFG: {"filtro":"tin|lumetri|resplandor"}   (expresión regular, sin distinguir mayúsculas)
(function(){var C=__CFG__;app.enableQE();var l=qe.project.getVideoEffectList(),o=[],re=new RegExp(C.filtro||".","i");
for(var i=0;i<l.length;i++){var n=String(l[i]);if(re.test(n))o.push(n);}return o.length+": "+o.join(" | ");})();
