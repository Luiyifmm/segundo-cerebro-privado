# Kevin Palacios · «el lunes empiezo» · ESTADO (15-11-2026)

**Paso:** 6 hecho (construir y llevar a Premiere) · pendiente: ver a velocidad real, sonido a oído, entrega (la hace Luis).
**Plan aprobado por Luis el 15-11** (`PLANES/_referencia Claude/kevin/plan.html`). Modo: ENTRENAMIENTO sobre copia.

## Dónde está
- Proyecto `ALUMNOS TRAINER10X - 14 NOV.prproj` → secuencia **«KEVIN · MONTAJE bucle (Claude)»** (copia; la original «KEVIN PALACIOS · el lunes empiezo» sin tocar).
- V2: capa de gráficos (secuencia de PNG, 1080×1920, 30 fps, 0–42,17 s). A4 y A5: 18 efectos nuevos. A2 y A3 (pop, golpe grave y música) son de antes.
- **El proyecto NO está guardado** (lo guarda Luis). Si algo falla: borrar la secuencia copia; los clips del corte no se han modificado.
- Generador: `PLANES/kevin/montaje_kevin.py` (python del entorno whisperx; `--stills t1,t2` para fotogramas sueltos). Sonidos: `PLANES/kevin/sonidos colocados.json`. Comprobación con fotogramas de Premiere: `PLANES/kevin/comprobacion en Premiere/`.

## Qué se hizo respecto al plan
| Plan | Hecho |
|---|---|
| Anillo de 6 puntos lateral, se enciende uno por paso | Sí (desde «bucle» 6,6 s); gira y vuelve al 1 en «vuelta a empezar» |
| 2 píldoras «6 días de gym» y «cero caprichos» | Sí, en la banda libre entre el título y la cabeza |
| Montaje de 3 planos de b-roll (cena, curro, mal día) | **No hay b-roll:** sustituido por 3 píldoras («una cena», «una mala semana», «un mal día») |
| Pantalla completa: anillo grande, el rojo salta del 5 al 2, «plan perfecto» tachado | Sí (32,9–38,55 s) |
| Caja «BUCLE» en el CTA | Sí, pero solo 0,6 s: la palabra es lo último que dice |
| Golpe grave en «disciplina» y en «liado»; whoosh en giro, entrada y salto | Sí (18 efectos, ≈ 0,4 por segundo) |
| Abrir ampliado (117 → 100 %) y zoom corto en «disciplina» | **No hecho** (tocaría los clips del corte) |
| Sin texto nuestro | Cumplido en los gráficos. Ojo: la secuencia YA tenía rótulos de paso abajo («1 · LA FOTO», «2 · PLAN PERFECTO»…) que repiten el anillo |

## Lo que no se comprobó
- Movimiento a velocidad real y sonido a oído (niveles: pops −12/−14 dB, golpes −10/−12, whoosh −12/−14; voz 0 dB, música −19,9 dB).
- Exportación, auditoría del estilo con el script y la colisión con las manos en todos los fotogramas (miré 24, no los 1265).
- Sin tipografía de la marca: Archivo Black no está instalada; los textos van en Poppins Black.
- Defecto conocido: al desvanecerse, la raya roja de «plan perfecto» se ve oscura 0,2 s (38,55–38,75 s).
- Premiere tiene otro proyecto abierto (`epic.prproj`): no se tocó.

## Traspaso
1. Luis reproduce la copia y decide: ¿se queda el anillo o el rótulo de paso de abajo? (repiten la idea).
2. Si vale: guardar el proyecto y exportar. Cambios: editar `montaje_kevin.py`, regenerar y sustituir la capa en V2.
3. Pedir a Kevin el bruto sin subtítulos metidos (aviso del panel).
