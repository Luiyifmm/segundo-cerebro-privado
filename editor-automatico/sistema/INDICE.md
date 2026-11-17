# Sistema de edición · índice (30-10-2026)

Método adaptado del editor Luis (traspaso en `~/Desktop/2 · Contenido/Edición/Traspaso-Luis/`, solo referencia) al Mac de Amin.
Convive con lo que ya funcionaba: el agente de la Sala (`../sala_agente.py`), `montar.py`, `frases.py`, el motor Remotion (`../motor`).

| Necesito… | Leer |
|---|---|
| Editar un vídeo de principio a fin | `flujo.md` |
| El estilo de un cliente (Amin u otro) | `fichas/` (`amin.json` + `README.md`) |
| Un comando que ya está probado | `recetas.md` |
| Saber qué corrigió Amin y a qué se aplica | `correcciones.md` |
| Qué está instalado, qué falta y qué no se puede | `estado.md` |

Orden de autoridad cuando algo choca: **correcciones de Amin > su ficha y referencias aprobadas > método de Luis > reglas genéricas.**
Los números de Luis son puntos de partida: se validan con la fuente y el montaje reales.

Herramientas de esta carpeta (todas probadas el 30-10 con VIDEO2):
- `ingesta.py`: ficha técnica del bruto (rotación, fps, HDR, canales, ruido de fondo, LUFS).
- `voz.py`: tratamiento de voz que mide el ruido antes y después y se echa atrás si empeora.
- `subtitulos.py`: bloques por sentido (automático o escritos a mano con `bloques.txt`).
- `validar_cortes.py`: vuelve a transcribir el montaje y señala cortes que comen palabras.
- `qc.py`: veredicto técnico del exportado.
- Composición `Muestra` en `../motor/src/Muestra.tsx`: render desde `montaje.json`, también por capas con alfa.
