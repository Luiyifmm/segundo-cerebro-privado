"""Extrae la paleta dominante de una imagen de referencia (lo que en la clase de
color se hace a mano con el cuentagotas de Pastel).

uso:  python extraer_paleta.py imagen.jpg [n_colores] [x0 y0 x1 y1] [--vivos]
  - n_colores (por defecto 6)
  - recorte opcional en píxeles para analizar solo una zona
  - --vivos: ignora negros, blancos y grises (saca los colores "de marca" de un
    fondo oscuro, p. ej. un logo neón sobre negro)
Imprime cada color como HEX + % de la imagen + tono/saturación/luminosidad y
guarda "<imagen>_paleta.png" con las muestras. Requiere Pillow.
"""
import colorsys
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def main() -> None:
    args = [a for a in sys.argv[1:] if a != "--vivos"]
    vivid = "--vivos" in sys.argv
    src = Path(args[0])
    n = int(args[1]) if len(args) > 1 else 6
    im = Image.open(src).convert("RGB")
    if len(args) > 5:
        x0, y0, x1, y1 = (int(v) for v in args[2:6])
        im = im.crop((x0, y0, x1, y1))
    small = im.resize((200, round(200 * im.height / im.width)))
    if vivid:
        keep = []
        raw = small.tobytes()
        for i in range(0, len(raw), 3):
            r, g, b = raw[i], raw[i + 1], raw[i + 2]
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if 0.12 < l < 0.92 and s > 0.3:
                keep.append((r, g, b))
        if keep:
            small = Image.new("RGB", (len(keep), 1))
            small.putdata(keep)
    q = small.quantize(colors=n, method=Image.Quantize.MEDIANCUT, kmeans=4)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    rows = []
    for c, idx in counts:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        rows.append((f"#{r:02X}{g:02X}{b:02X}", 100 * c / total, round(h * 360), round(s * 100), round(l * 100), (r, g, b)))
    for hx, pct, h, s, l, _ in rows:
        print(f"{hx}  {pct:5.1f}%  tono {h:3d}°  sat {s:3d}%  lum {l:3d}%")
    sw = Image.new("RGB", (160 * len(rows), 200), "white")
    d = ImageDraw.Draw(sw)
    font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 20)
    for k, (hx, pct, *_rest, rgb) in enumerate(rows):
        d.rectangle((k * 160, 0, k * 160 + 158, 150), fill=rgb)
        d.text((k * 160 + 8, 158), hx, fill="black", font=font)
        d.text((k * 160 + 8, 178), f"{pct:.0f}%", fill="gray", font=font)
    out = src.with_name(src.stem + "_paleta.png")
    sw.save(out)
    print(out)


if __name__ == "__main__":
    main()
