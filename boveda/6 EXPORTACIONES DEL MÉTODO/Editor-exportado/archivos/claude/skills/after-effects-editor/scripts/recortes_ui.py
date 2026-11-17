"""Lee VALORES de la interfaz de After Effects en un vídeo-tutorial: recorta una zona de la pantalla en varios
instantes y la amplía, en fila. Sirve para copiar los ajustes exactos del profe (Controles de efectos, Propiedades,
regla de la línea de tiempo con las claves...). Zonas medidas en las grabaciones 1080p de Solazzo (clase 12).

Uso: python recortes_ui.py video.mp4 salida.jpg zona "mm:ss,mm:ss,..." [escala=2]
  zona: efectos | props | flow | timeline | visor | toolbar | izq_tl | regla | x0,y0,x1,y1
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

ZONAS = {
    "efectos": (62, 118, 272, 610),     # Controles de efectos (panel izquierdo)
    "props": (1562, 122, 1758, 490),    # panel Propiedades (derecha): texto, transformación, forma
    "flow": (1325, 122, 1562, 430),     # panel de Flow (curvas)
    "timeline": (62, 605, 760, 1015),   # línea de tiempo
    "visor": (530, 118, 1325, 605),     # visor de la composición
    "toolbar": (380, 95, 1000, 116),    # barra de herramientas
    "izq_tl": (62, 640, 460, 1015),     # nombres y valores de la línea de tiempo
    "regla": (330, 612, 760, 700),      # regla de tiempo + claves (para leer cuándo están)
}
video, salida, zona = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
caja = ZONAS[zona] if zona in ZONAS else tuple(int(v) for v in zona.split(","))
tiempos = sys.argv[4].split(",")
esc = float(sys.argv[5]) if len(sys.argv) > 5 else 2.0
tiles = []
with tempfile.TemporaryDirectory() as tmp:
    for t in tiempos:
        mm, ss = t.split(":")
        seg = int(mm) * 60 + float(ss)
        f = Path(tmp) / "f.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{seg:.2f}", "-i", video, "-frames:v", "1", str(f)], check=True)
        im = Image.open(f).convert("RGB").crop(caja)
        im = im.resize((int(im.width * esc), int(im.height * esc)), Image.LANCZOS)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 60, 16], fill=(0, 0, 0))
        d.text((4, 3), t, fill=(255, 255, 0))
        tiles.append(im)
w = sum(t.width for t in tiles) + 4 * (len(tiles) - 1)
hoja = Image.new("RGB", (w, max(t.height for t in tiles)), (60, 0, 0))
x = 0
for t in tiles:
    hoja.paste(t, (x, 0))
    x += t.width + 4
hoja.save(salida, quality=92)
print(salida, hoja.size)
