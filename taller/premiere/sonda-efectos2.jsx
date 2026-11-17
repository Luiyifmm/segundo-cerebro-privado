(function () { app.enableQE(); var l = qe.project.getVideoEffectList(), r = []; for (var i = 0; i < l.length; i++) if (/esenfo|blur|enfo/i.test(l[i])) r.push(l[i]); return JSON.stringify(r); })();
