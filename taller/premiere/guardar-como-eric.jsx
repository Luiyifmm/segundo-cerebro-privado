(function () { var r = { antes: app.project.path }, dest = "/Users/luiyi/Documents/Adobe/Premiere Pro/26.0/ERICK EDICION.prproj";
  if (app.project.name !== "erick proyecto.prproj") return JSON.stringify({ error: "el proyecto abierto no es el de Erick", abierto: app.project.name });
  if (new File(dest).exists) return JSON.stringify({ error: "ya existe ERICK EDICION.prproj" });
  app.project.save(); r.res = app.project.saveAs(dest); r.despues = app.project.path; r.nombre = app.project.name; return JSON.stringify(r); })();
