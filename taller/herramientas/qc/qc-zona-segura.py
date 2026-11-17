"""qc-zona-segura.py — control objetivo de un gráfico con transparencia antes de enseñarlo.

Uso:  <python con numpy> qc-zona-segura.py <render.mov> [--arriba 250] [--abajo 300] [--lados 70] [--fps 10]
Lee el canal alfa con ffprobe/ffmpeg, a --fps fotogramas por segundo, y por cada fotograma mira dónde hay "tinta"
(alfa > 8 %). Falla si la tinta entra en las bandas de la interfaz de Instagram/TikTok (medidas en un lienzo
1080×1920 y escaladas al tamaño real) o si el render no tiene canal alfa. Salida: resumen y tramos con fallo.
Código propio (06-11-2026). Valores por defecto: zona segura de Amin (x 70–1010, y 250–1620).
Salida: 0 = limpio, 1 = hay invasiones, 2 = no se pudo leer o no tiene alfa.
"""
import json, subprocess, sys, argparse
import numpy as np

FF = "/Users/luiyi/.local/bin/ffmpeg"; FP = "/Users/luiyi/.local/bin/ffprobe"
a = argparse.ArgumentParser(); a.add_argument("video"); a.add_argument("--arriba", type=int, default=250)
a.add_argument("--abajo", type=int, default=300); a.add_argument("--lados", type=int, default=70); a.add_argument("--fps", type=float, default=10)
o = a.parse_args()
info = json.loads(subprocess.run([FP, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,pix_fmt", "-of", "json", o.video], capture_output=True, text=True).stdout or "{}")
st = (info.get("streams") or [{}])[0]
W, H, pf = st.get("width"), st.get("height"), st.get("pix_fmt", "")
if not W: print("ERROR: no se pudo leer el vídeo"); sys.exit(2)
if "a" not in pf.replace("yuv", "").replace("gray", "") and not pf.startswith(("yuva", "rgba", "argb", "bgra", "gbrap")):
    print(f"ERROR: el render no tiene canal alfa ({pf})"); sys.exit(2)
k = W / 1080.0  # escala respecto al lienzo de referencia
top, bot, side = int(o.arriba * k), int(H - o.abajo * k), int(o.lados * k)
raw = subprocess.run([FF, "-nostdin", "-v", "error", "-i", o.video, "-vf", f"fps={o.fps},alphaextract,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
n = len(raw) // (W * H)
fr = np.frombuffer(raw[: n * W * H], np.uint8).reshape(n, H, W)
if n == 0: print("ERROR: 0 fotogramas revisados: NO VERIFICADO"); sys.exit(2)
malos, conTinta = [], 0
for i in range(n):
    m = fr[i] > 20
    if not m.any(): continue
    conTinta += 1
    ys, xs = np.where(m)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    p = []
    if y0 < top: p.append(f"arriba (y {y0} < {top})")
    if y1 > bot: p.append(f"abajo (y {y1} > {bot})")
    if x0 < side: p.append(f"izquierda (x {x0} < {side})")
    if x1 > W - side: p.append(f"derecha (x {x1} > {W - side})")
    if p: malos.append((i / o.fps, ", ".join(x.split(" (")[0] for x in p), ", ".join(p)))
print(f"{o.video}: {W}×{H} {pf} · {n} fotogramas revisados ({o.fps}/s) · {conTinta} con gráfico · zona segura y {top}–{bot}, x {side}–{W - side}")
if not malos: print("LIMPIO: nada invade las bandas de la interfaz."); sys.exit(0)
tramos, ini, prev, txt, peor = [], None, None, None, None
for t, banda, d in malos:
    if ini is None or t - prev > 1.5 / o.fps or banda != txt:
        if ini is not None: tramos.append((ini, prev, f"{txt} — p. ej. {peor}"))
        ini, txt, peor = t, banda, d
    prev = t
tramos.append((ini, prev, f"{txt} — p. ej. {peor}"))
print(f"FALLA: {len(malos)} fotogramas invaden bandas en {len(tramos)} tramo(s):")
for i0, i1, d in tramos: print(f"  {i0:6.2f}–{i1:6.2f} s  {d}")
sys.exit(1)
