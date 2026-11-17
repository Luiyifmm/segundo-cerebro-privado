"""qc-colisiones.py — ¿el gráfico pisa la cara, los subtítulos o la interfaz? (control objetivo antes de enseñar).

Uso:
  <python con numpy> qc-colisiones.py <gráfico.mov con alfa> --base <vídeo de fondo> [--desde 0]
        [--subtitulos 1000-1240] [--arriba 250 --abajo 300 --lados 70] [--fps 4] [--margen-cara 0.10]
        [--tolerancia 0.002] [--hoja salida.png]

- La cara se detecta en el vídeo base con Vision de Apple (`herramientas/qc/caras`, sin dependencias), en cada fotograma revisado.
- Las medidas van en un lienzo de 1080×1920 y se escalan al tamaño real.
- Colisión = más de --tolerancia (fracción) de la zona prohibida cubierta por tinta del gráfico (alfa > 8 %).
- Un gráfico opaco a pantalla completa (insertos) se reconoce y se informa aparte: tapa la cara a propósito.
- --hoja: dibuja la composición con la caja de la cara (rojo), la banda de subtítulos (amarillo) y la zona segura (verde).
Salida: 0 = limpio · 1 = colisiones · 2 = error · 3 = limpio en lo verificado pero algo NO VERIFICADO. Código propio (06-11-2026).
"""
import argparse, json, os, subprocess, sys, tempfile
import numpy as np

FF, FP = "/Users/luiyi/.local/bin/ffmpeg", "/Users/luiyi/.local/bin/ffprobe"
CARAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "caras")
a = argparse.ArgumentParser()
a.add_argument("grafico"); a.add_argument("--base", required=True); a.add_argument("--desde", type=float, default=0.0)
a.add_argument("--subtitulos", default="auto", help="auto (leídos de cada fotograma del vídeo base) | y0-y1 fijo | no"); a.add_argument("--arriba", type=int, default=250); a.add_argument("--abajo", type=int, default=300)
a.add_argument("--lados", type=int, default=70); a.add_argument("--fps", type=float, default=4); a.add_argument("--margen-cara", type=float, default=0.10)
a.add_argument("--tolerancia", type=float, default=0.002); a.add_argument("--hoja", default="")
o = a.parse_args()

def info(v):
    d = json.loads(subprocess.run([FP, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,pix_fmt:format=duration", "-of", "json", v], capture_output=True, text=True).stdout or "{}")
    s = (d.get("streams") or [{}])[0]; return s.get("width"), s.get("height"), s.get("pix_fmt", ""), float(d.get("format", {}).get("duration", 0))
W, H, pf, dur = info(o.grafico)
if not W: print("ERROR: no se pudo leer el gráfico"); sys.exit(2)
if not pf.startswith(("yuva", "rgba", "argb", "bgra", "gbrap")): print(f"ERROR: el gráfico no tiene alfa ({pf})"); sys.exit(2)
k = W / 1080.0
top, bot, side = int(o.arriba * k), int(H - o.abajo * k), int(o.lados * k)
sub_fija = tuple(int(int(x) * k) for x in o.subtitulos.split("-")) if o.subtitulos not in ("", "auto", "no") else None
sub = sub_fija

def frames(v, vf, ss=0.0, fmt="gray", ch=1):
    raw = subprocess.run([FF, "-nostdin", "-v", "error", "-ss", f"{ss}", "-i", v, "-t", f"{dur}", "-vf", f"fps={o.fps},scale={W}:{H},{vf}format={fmt}", "-f", "rawvideo", "-"], capture_output=True).stdout
    n = len(raw) // (W * H * ch); return np.frombuffer(raw[: n * W * H * ch], np.uint8).reshape((n, H, W) + ((ch,) if ch > 1 else ()))
alfa = frames(o.grafico, "format=yuva444p,alphaextract,")
tmp = tempfile.mkdtemp(prefix="qc-caras-")
subprocess.run([FF, "-nostdin", "-v", "error", "-ss", f"{o.desde}", "-i", o.base, "-t", f"{dur}", "-vf", f"fps={o.fps},scale={W}:{H}", f"{tmp}/f%04d.png"])
pngs = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
def banda_subtitulos(png):
    """Banda de texto de subtítulos en un fotograma: filas con texto blanco o azul/cian de marca entre y≈850 y 1700 (lienzo 1080×1920)."""
    raw = subprocess.run([FF, "-nostdin", "-v", "error", "-i", png, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    if len(raw) < W * H * 3: return None
    im = np.frombuffer(raw[: W * H * 3], np.uint8).reshape(H, W, 3).astype(int)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    m = (((r > 225) & (g > 225) & (b > 225)) | ((b > 200) & (g > 140) & (r < 120)))[:, int(150 * k):int(930 * k)]
    y0, y1 = int(850 * k), int(1700 * k)
    filas = np.where(m[y0:y1].sum(1) > 6 * k)[0] + y0
    if len(filas) < 10 * k: return None
    grupos, ini, prev = [], filas[0], filas[0]
    for f in filas[1:]:
        if f - prev > 25 * k: grupos.append((ini, prev)); ini = f
        prev = f
    grupos.append((ini, prev))
    g0, g1 = max(grupos, key=lambda t: t[1] - t[0])
    if g1 - g0 < 18 * k: return None
    return (int(g0 - 15 * k), int(g1 + 15 * k))
subs_auto = [banda_subtitulos(f"{tmp}/{p}") for p in pngs] if o.subtitulos == "auto" else []
caras = []
if pngs and os.path.exists(CARAS):
    for l in subprocess.run([CARAS] + [f"{tmp}/{p}" for p in pngs], capture_output=True, text=True).stdout.splitlines():
        try: caras.append(json.loads(l).get("caras", []))
        except ValueError: caras.append([])
n = min(len(alfa), len(caras) if caras else len(alfa))
if n == 0:
    print(f"ERROR: 0 fotogramas revisados (gráfico {len(alfa)}, base {len(pngs)}): NO VERIFICADO"); sys.exit(2)
res, sin_cara, opacos = [], 0, 0
for i in range(n):
    m = alfa[i] > 20; t = i / o.fps
    if not m.any(): continue
    if m.mean() > 0.97: opacos += 1; continue  # inserto a pantalla completa
    prob = []
    cs = caras[i] if i < len(caras) else []
    if not cs: sin_cara += 1
    for c in cs:
        x0, y0, x1, y1 = c[:4]; mx, my = (x1 - x0) * o.margen_cara, (y1 - y0) * o.margen_cara
        x0, y0, x1, y1 = int(max(0, x0 - mx)), int(max(0, y0 - my)), int(min(W, x1 + mx)), int(min(H, y1 + my))
        f = m[y0:y1, x0:x1].mean() if (y1 > y0 and x1 > x0) else 0
        if f > o.tolerancia: prob.append(f"cara {f:.0%}")
    sub = sub_fija if sub_fija else (subs_auto[i] if i < len(subs_auto) else None)
    if sub:
        f = m[sub[0]:sub[1], :].mean()
        if f > o.tolerancia: prob.append(f"subtítulos {f:.1%}")
    ys, xs = np.where(m)
    if ys.min() < top: prob.append("banda de arriba")
    if ys.max() > bot: prob.append("banda de abajo")
    if xs.min() < side or xs.max() > W - side: prob.append("lados")
    if prob: res.append((t, ", ".join(prob)))
print(f"{os.path.basename(o.grafico)} sobre {os.path.basename(o.base)} (desde {o.desde}s): {n} fotogramas a {o.fps}/s · "
      f"cara detectada en {n - sin_cara}/{n} · subtítulos {('fijos y %d–%d' % sub_fija) if sub_fija else (('leídos del fotograma en %d/%d' % (sum(1 for x in subs_auto[:n] if x), n)) if o.subtitulos == 'auto' else 'no comprobados')} · zona segura y {top}–{bot}, x {side}–{W - side}")
if opacos: print(f"  {opacos} fotograma(s) son un inserto a pantalla completa (tapa la cara a propósito)")
if o.subtitulos == "auto" and not any(subs_auto[:n]): print("  AVISO: no se encontraron subtítulos en el vídeo base: posición de subtítulos NO VERIFICADA (pasa --subtitulos y0-y1 si los habrá)")
if sin_cara > n / 2: print("  AVISO: la cara no se detectó en la mayoría de fotogramas: la comprobación de cara queda NO VERIFICADA")
if o.hoja and n:
    idx = sorted(set([0, n // 4, n // 2, (3 * n) // 4, n - 1]))
    base = frames(o.base, "", ss=o.desde, fmt="rgb24", ch=3); rgba = frames(o.grafico, "", fmt="rgba", ch=4)
    tiles = []
    for i in idx:
        if i >= len(base) or i >= len(rgba): continue
        b = base[i].astype(float); g = rgba[i].astype(float); al = g[..., 3:4] / 255
        c = (b * (1 - al) + g[..., :3] * al).astype(np.uint8)
        def caja(x0, y0, x1, y1, col, gro=int(4 * k)):
            x0, y0, x1, y1 = [int(v) for v in (x0, y0, x1, y1)]
            c[y0:y0 + gro, x0:x1] = col; c[max(y1 - gro, 0):y1, x0:x1] = col; c[y0:y1, x0:x0 + gro] = col; c[y0:y1, max(x1 - gro, 0):x1] = col
        caja(side, top, W - side, bot, (40, 220, 90))
        sb = sub_fija if sub_fija else (subs_auto[i] if i < len(subs_auto) else None)
        if sb: caja(0, sb[0], W, sb[1], (250, 210, 40))
        for cc in (caras[i] if i < len(caras) else []): caja(*cc[:4], (240, 50, 50))
        tiles.append(c[::4, ::4])
    hoja = np.concatenate(tiles, axis=1)
    subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{hoja.shape[1]}x{hoja.shape[0]}", "-i", "-", o.hoja], input=hoja.tobytes())
    print("  hoja:", o.hoja)
nov = []
if o.subtitulos == "auto" and not any(subs_auto[:n]): nov.append("posición de subtítulos")
if o.subtitulos == "no": nov.append("subtítulos (no comprobados)")
if sin_cara > n / 2: nov.append("cara")
if not res:
    if nov: print("QC TÉCNICO: limpio en lo verificado · NO VERIFICADO: " + ", ".join(nov) + ". No es una aprobación."); sys.exit(3)
    print("QC TÉCNICO: limpio (cara, subtítulos y bandas). No es una aprobación creativa."); sys.exit(0)
tramos, ini, prev, txt = [], None, None, None
for t, d in res:
    clave = ",".join(sorted(x.split(" ")[0] for x in d.split(", ")))
    if ini is None or t - prev > 1.5 / o.fps or clave != txt:
        if ini is not None: tramos.append((ini, prev, ej))
        ini, txt, ej = t, clave, d
    prev = t
tramos.append((ini, prev, ej))
print(f"COLISIONES en {len(res)} fotograma(s), {len(tramos)} tramo(s):")
for i0, i1, d in tramos: print(f"  {i0:5.2f}–{i1:5.2f} s  {d}")
sys.exit(1)
