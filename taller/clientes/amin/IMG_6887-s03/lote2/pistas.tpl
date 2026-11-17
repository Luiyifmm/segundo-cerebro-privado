(function(){app.enableQE();var s=app.project.activeSequence,n=s.videoTracks.numTracks;qe.project.getActiveSequence().addTracks(2,n,0);s=app.project.activeSequence;
if(s.videoTracks[n].clips.numItems||s.videoTracks[n+1].clips.numItems)return "ERROR";return n+","+(n+1);})();
