(function () { var r = {}, raiz = app.project.rootItem, bin = null, i;
  for (i = 0; i < raiz.children.numItems; i++) if (raiz.children[i].name === "RECURSOS" && raiz.children[i].type === 2) bin = raiz.children[i];
  if (!bin) bin = raiz.createBin("RECURSOS");
  app.project.importFiles(["/Users/luiyi/Videos-Remotion/clientes/_recursos/Degradado a negro subtítulos.png"], true, bin, false);
  r.proyecto = app.project.name; r.enBandeja = []; for (i = 0; i < bin.children.numItems; i++) r.enBandeja.push(bin.children[i].name);
  app.project.save(); return JSON.stringify(r); })();
