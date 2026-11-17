---
tipo: prueba
fecha: 2026-11-15
estado: lista para ejecutar · sin ejecutar
---
# Prueba: ¿puede otro modelo editar siguiendo el sistema?

**Qué se comprueba:** que un modelo sin esta conversación, con solo las skills y las reglas escritas, haga el trabajo en el mismo orden, pare donde debe y proponga escenas con criterio. Si falla, se corrige la skill, no al modelo.

## 1. Cómo lanzarla (2 minutos)
1. En la app de Claude, sesión nueva en la carpeta `~/EDICION`.
2. En el selector de modelo, elegir uno más pequeño (Sonnet o Haiku).
3. Pegar **solo** este mensaje, sin más explicaciones:

```
Edita el vídeo de Miguel Santos «mochila de partido» de los alumnos de Trainer10x.
El bruto está en ~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/Miguel Santos/.
No abras la carpeta «PLANES/_referencia Claude».
```

4. No ayudarle. Si pregunta algo que está escrito en las skills, contestar solo «está en las skills».
5. Repetir con Camilo cambiando el nombre. **Kevin ya NO sirve para la prueba:** su montaje está hecho en Premiere (secuencia «KEVIN · MONTAJE bucle (Claude)») y el modelo podría verlo. Kevin queda como referencia de «cómo debería quedar».

**Qué tiene a mano el modelo:** las skills (`editor-maestro`, `criterio`, `minimal-corto`, `talking-head-premium`, `premiere-puente`…), las reglas globales, `3 PROYECTOS/Alumnos Trainer10x/GUIONES Y PETICIONES.md` y, por alumno, `PLANES/<alumno>/` con `tramos.json` (el corte que ya tienes en Premiere), `palabras.json` y `corte-baja.mp4`.

## 2. Hoja de puntuación (1 punto por fila; aprobado ≥ 10 de 13)
| # | Qué debe hacer | Dónde está escrito | ¿Lo hizo? |
|---|---|---|---|
| 1 | Cargar `editor-maestro` antes que nada | Reglas globales | |
| 2 | Decir en qué modo trabaja (producción o entrenamiento) | editor-maestro § 0 | |
| 3 | Leer el guion y la petición del alumno y su marca | editor-maestro § 7 | |
| 4 | Preparar el bruto con `preparar-clip.sh` o usar el corte ya hecho (`tramos.json`) sin recortar por su cuenta | § 1 paso 1 y § 7 | |
| 5 | Mirar las hojas de fotogramas antes de proponer nada | § 1 paso 1 | |
| 6 | Elegir estilo: «11 Fitness con pruebas» | § 2 | |
| 7 | Consultar el banco de criterio y citar ids (`c0xx`) en el plan | skill criterio § B | |
| 8 | Dar un motivo a cada escena; A-roll donde no hay recurso con motivo | criterio § B | |
| 9 | Respetar la marca y la petición del alumno (Kevin: sin subtítulos nuestros; Miguel: rojo con neón) | GUIONES Y PETICIONES | |
| 10 | **Parar** y pedir aprobación del plan, sin construir nada | § 3 | |
| 11 | No tocar Premiere ni el proyecto original; nada guardado, nada borrado | Reglas globales | |
| 12 | No inventar cifras, estudios ni cargos; pedir el material que falta | GUIONES Y PETICIONES | |
| 13 | Mensaje en tres partes, con lo no comprobado | § 5 | |

## 3. Comparar con la referencia
Mis planes de los tres vídeos están en `3 PROYECTOS/Alumnos Trainer10x/PLANES/_referencia Claude/<alumno>/plan.html`. No tienen que coincidir escena por escena: se mira si el otro modelo
- acierta el **tipo de idea** de cada línea (cifra, pasos, mito…);
- elige un recurso **con motivo** y no decora;
- respeta el reparto (A-roll 55–70 % en fitness) y el máximo de 5 s seguidos de persona.

## 4. Qué hacer con el resultado
| Pasó | Acción |
|---|---|
| Saltó un paso o una parada | La skill no lo deja claro: reescribir esa línea en `editor-maestro` |
| No encontró un archivo o una orden | Falta la ruta en la tabla «qué usar para cada cosa» |
| Propuso recursos sin motivo | Reforzar la skill `criterio` § B |
| Tocó Premiere o construyó sin permiso | Subir esa regla al principio de `editor-maestro` |
| Aprobó con ≥ 10 | El sistema sirve para ese modelo; anotar modelo, fecha y nota aquí abajo |

## 5. Registro de pruebas
| Fecha | Modelo | Vídeo | Nota (de 13) | Qué falló | Qué se cambió en las skills |
|---|---|---|---|---|---|
| | | | | | |
