(function(){var s=app.project.activeSequence,a=s.audioTracks[0],G=0.7639,n=0;
for(var j=0;j<a.clips.numItems;j++){var c=a.clips[j],lim=0;for(var k=0;k<c.components.numItems;k++){var cm=c.components[k];
 if(cm.displayName=="Amplificación"){for(var q=0;q<cm.properties.numItems;q++){var pr=cm.properties[q];if(pr.displayName=="Ganancia"||pr.displayName==""){try{pr.setValue(G,true);}catch(e){}}}n++;}
 if(cm.displayName=="Limitador forzado"){lim++;if(lim==2)for(var q=0;q<cm.properties.numItems;q++){if(cm.properties[q].displayName=="Amplitud máxima")cm.properties[q].setValue(0.975,true);}}}}
app.project.save();return "ganancia "+G+" en "+n;})();
