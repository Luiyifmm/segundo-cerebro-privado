(function () { var r = { antes: app.project.path }, dest = "~/Documents/Adobe/Premiere Pro/26.0/CLIENTE-E EDICION.prproj";
  if (app.project.name !== "clientee proyecto.prproj") return JSON.stringify({ error: "el proyecto abierto no es el de ClienteE", abierto: app.project.name });
  if (new File(dest).exists) return JSON.stringify({ error: "ya existe CLIENTE-E EDICION.prproj" });
  app.project.save(); r.res = app.project.saveAs(dest); r.despues = app.project.path; r.nombre = app.project.name; return JSON.stringify(r); })();
