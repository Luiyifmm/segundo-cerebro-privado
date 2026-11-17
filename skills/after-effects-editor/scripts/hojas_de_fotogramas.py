"""Hojas de fotogramas para "ver" una clase: de los fotogramas a 1 fps se quedan
los que cambian en la zona de la diapositiva (la cámara del profe se ignora),
se montan en hojas 3x3 con su tiempo y se escribe un guion que intercala cada
hoja con lo que se dice en ese tramo.

uso: python hojas.py <frames_dir> <transcript.json> <out_dir> [umbral] [max_hueco_s] [recorte] [recorte_cambios]
  recorte = "x0,y0,x1,y1" en fracciones del cuadro: lo que sale en cada miniatura
            (por defecto, la diapositiva de las clases de Solazzo; "0,0,1,1" = cuadro entero).
  recorte_cambios = zona donde se miran los cambios (por defecto, la misma). Sirve para dejar fuera
            la cámara del profe en las grabaciones de pantalla.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

frames_dir, tr_path, out_dir = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
THRESH = float(sys.argv[4]) if len(sys.argv) > 4 else 2.5
MAX_GAP = float(sys.argv[5]) if len(sys.argv) > 5 else 8.0
COLS, ROWS = 3, 3
CROP = (0.02, 0.04, 0.845, 0.965)  # zona de la diapositiva (sin la cámara de la derecha)
if len(sys.argv) > 6:
    CROP = tuple(float(v) for v in sys.argv[6].split(","))
CROP_SIG = tuple(float(v) for v in sys.argv[7].split(",")) if len(sys.argv) > 7 else CROP
TILE_W = 520

out_dir.mkdir(parents=True, exist_ok=True)
for old in out_dir.glob("h_*.jpg"):
    old.unlink()
frames = sorted(frames_dir.glob("f_*.jpg"))
font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 22)


def sig(img: Image.Image) -> np.ndarray:
    w, h = img.size
    box = (int(CROP_SIG[0] * w), int(CROP_SIG[1] * h), int(CROP_SIG[2] * w), int(CROP_SIG[3] * h))
    return np.asarray(img.crop(box).convert("L").resize((160, 96)), dtype=np.float32)


kept: list[tuple[float, Path]] = []
last_sig = None
last_t = -1e9
for i, f in enumerate(frames):
    t = float(i)  # fps=1 -> el fotograma i es el segundo i (centro ~ i+0.5)
    img = Image.open(f)
    s = sig(img)
    diff = 1e9 if last_sig is None else float(np.abs(s - last_sig).mean())
    if diff > THRESH or t - last_t >= MAX_GAP:
        kept.append((t, f))
        last_sig, last_t = s, t

segs = json.loads(tr_path.read_text(encoding="utf-8"))


def mmss(t: float) -> str:
    return f"{int(t // 60):02d}:{int(t % 60):02d}"


per = COLS * ROWS
sheets = [kept[i:i + per] for i in range(0, len(kept), per)]
lines = [f"# {frames_dir.name}: {len(frames)} s, {len(kept)} fotogramas distintos, {len(sheets)} hojas (umbral {THRESH}, hueco max {MAX_GAP}s)\n"]
for n, group in enumerate(sheets, 1):
    tiles = []
    for t, f in group:
        img = Image.open(f)
        w, h = img.size
        img = img.crop((int(CROP[0] * w), int(CROP[1] * h), int(CROP[2] * w), int(CROP[3] * h)))
        img = img.resize((TILE_W, int(TILE_W * img.size[1] / img.size[0])), Image.LANCZOS)
        d = ImageDraw.Draw(img)
        label = mmss(t)
        bb = d.textbbox((0, 0), label, font=font)
        d.rectangle((4, 4, 14 + bb[2], 12 + bb[3]), fill=(0, 0, 0))
        d.text((9, 6), label, font=font, fill=(255, 230, 0))
        tiles.append(img)
    tw, th = tiles[0].size
    pad = 4
    sheet = Image.new("RGB", (COLS * tw + (COLS + 1) * pad, ROWS * th + (ROWS + 1) * pad), "white")
    for k, img in enumerate(tiles):
        r, c = divmod(k, COLS)
        sheet.paste(img, (pad + c * (tw + pad), pad + r * (th + pad)))
    sheet.save(out_dir / f"h_{n:03d}.jpg", quality=88)
    t0 = group[0][0]
    t1 = sheets[n][0][0] if n < len(sheets) else len(frames)
    lines.append(f"\n=== Hoja {n:03d}  [{mmss(t0)} - {mmss(t1)}]  fotogramas: {', '.join(mmss(t) for t, _ in group)}")
    for s in segs:
        if s["e"] > t0 and s["s"] < t1:
            lines.append(f"  [{mmss(s['s'])}] {s['t']}")
(out_dir / "guion.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(lines[0].strip())
