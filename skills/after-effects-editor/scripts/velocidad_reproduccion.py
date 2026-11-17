"""¿A qué velocidad se reprodujo la referencia DENTRO de una grabación de pantalla? (clase 12: iba a 0,8x)

Si el profe reproduce el vídeo de referencia en un reproductor mientras graba la pantalla, el reproductor puede ir
más lento que el tiempo real. Entonces TODOS los tiempos medidos en la grabación salen largos.
Pistas: (1) fotogramas repetidos: a 30 fps de grabación, 1 de cada 5 repetido = 24 fotogramas nuevos por segundo;
(2) la barra de progreso del reproductor frente al reloj de la grabación; (3) un movimiento conocido (el zoom de la clase
duraba 1,78 s en su línea de tiempo y medía 2,3 s en la grabación: 0,78).

Uso: python velocidad_reproduccion.py grabacion.mp4 t_ini t_fin x0,y0,x1,y1 [fps_grab=30]
  (la caja es la zona del vídeo de referencia dentro de la grabación, sin la barra del reproductor)
Imprime los fotogramas repetidos, la cadencia y los fotogramas nuevos por segundo.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

video, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x0, y0, x1, y1 = (int(v) for v in sys.argv[4].split(","))
fps = float(sys.argv[5]) if len(sys.argv) > 5 else 30.0
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}", "-i", video, "-vf",
                    f"fps={fps},crop={x1 - x0}:{y1 - y0}:{x0}:{y0},format=gray", str(Path(tmp) / "f_%05d.png")], check=True)
    fr = sorted(Path(tmp).glob("f_*.png"))
    g = [np.asarray(Image.open(f), dtype=np.float32) for f in fr]
dif = np.array([np.abs(g[i] - g[i - 1]).mean() for i in range(1, len(g))])
med = np.median(dif)
rep = np.nonzero(dif < 0.15 * med)[0] + 1
print(f"{len(g)} fotogramas de grabación; diferencia mediana {med:.2f}")
print("repetidos en los fotogramas:", rep.tolist())
if len(rep) > 1:
    cad = np.diff(rep).mean()
    nuevos = fps * (1 - 1 / cad)
    print(f"cadencia: 1 repetido cada {cad:.2f} fotogramas -> {nuevos:.1f} fotogramas NUEVOS por segundo")
    print("Si la referencia es de 30 fps y se ven ~24 nuevos/s, iba a ~0,8x: multiplicar los tiempos medidos por 0,8.")
else:
    print("sin repetidos: la referencia va a los fps de la grabación (o más)")
