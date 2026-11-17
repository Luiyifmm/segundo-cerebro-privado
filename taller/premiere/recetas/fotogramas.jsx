// Exporta fotogramas PNG de la secuencia activa en los tiempos dados (para mirarlos antes de decir "hecho").
// CFG: {"tiempos":[0.9,3.7,15.5],"carpeta":"/ruta/carpeta","prefijo":"f"}
// OJO: repetir el mismo instante en el mismo script devuelve caché; para comparar estados, scripts y tiempos distintos.
(function(){var C=__CFG__;app.enableQE();var B=app.project.activeSequence,q=qe.project.getActiveSequence(),r=[];
for(var i=0;i<C.tiempos.length;i++){B.setPlayerPosition(String(Math.round(C.tiempos[i]*254016000000)));var f=C.carpeta+"/"+(C.prefijo||"f")+"-"+i;q.exportFramePNG(q.CTI.timecode,f);r.push(f+".png");}
return r.join(" | ");})();
