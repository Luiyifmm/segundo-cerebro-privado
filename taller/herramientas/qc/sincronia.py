"""sincronia.py — ¿cada elemento del gráfico aparece en su palabra (±2 fotogramas)?

Uso:
  <python con numpy> sincronia.py --grafico <render.mov con alfa> --cues cues.json --audio <voz alineada con el gráfico>
        [--fps 30] [--tolerancia 2] [--ventana 0.5]
  cues.json: {"eventos":[{"id":…, "palabra":…, "t_palabra": s (según la transcripción)}, …]}

1. EVENTOS DEL GRÁFICO (medido): fotogramas en los que aparece tinta nueva en el canal alfa (render a la cadencia real).
2. PALABRA (medida cuando se puede):
   - Whisper small da tiempos con errores de 0,3–0,5 s en los brutos de Amin;
   - por eso se busca en el audio, dentro de ±--ventana, un ARRANQUE de voz (de silencio a voz);
   - si hay uno solo claro → tiempo de palabra fiable;
   - si la palabra va dentro de una frase continua (sin silencio delante) o hay varios arranques → NO VERIFICADO.
3. VEREDICTO por evento: OK si |evento − palabra| ≤ tolerancia en fotogramas; FUERA si no; NO VERIFICADO si la palabra no es fiable.
Salida: 0 = todo lo verificable OK · 1 = algún FUERA · 3 = nada verificable. Código propio (06-11-2026).
"""
import argparse, json, subprocess, sys
import numpy as np

FF, FP = "/Users/luiyi/.local/bin/ffmpeg", "/Users/luiyi/.local/bin/ffprobe"
a = argparse.ArgumentParser(); a.add_argument("--grafico", required=True); a.add_argument("--cues", required=True); a.add_argument("--audio", required=True)
a.add_argument("--palabras", default="", help="palabras.json del MISMO audio (WhisperX) para saber si la palabra va tras un silencio"); a.add_argument("--fps", type=float, default=30); a.add_argument("--tolerancia", type=float, default=2); a.add_argument("--ventana", type=float, default=0.5)
o = a.parse_args()
cues = json.load(open(o.cues))["eventos"]
# 1. eventos del gráfico
w, h = 270, 480
raw = subprocess.run([FF, "-nostdin", "-v", "error", "-i", o.grafico, "-vf", f"fps={o.fps},format=yuva444p,alphaextract,scale={w}:{h},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
n = len(raw) // (w * h)
if n == 0: print("ERROR: no se pudo leer el gráfico"); sys.exit(2)
A = np.frombuffer(raw[: n * w * h], np.uint8).reshape(n, h, w) > 20
nuevo = np.array([0] + [int((A[i] & ~A[i - 1]).sum()) for i in range(1, n)])
umbral_px = max(40, 0.0008 * w * h)
eventos = [i / o.fps for i in range(1, n) if nuevo[i] > umbral_px and nuevo[i - 1] <= umbral_px]
# 2. arranques de voz en el audio
SR = 16000
x = np.frombuffer(subprocess.run([FF, "-nostdin", "-v", "error", "-i", o.audio, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
hop = int(0.01 * SR); env = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
db = 20 * np.log10(env + 1e-9); voz, ruido = np.percentile(db, 90), np.percentile(db, 15); u = ruido + 0.5 * (voz - ruido)
on = db > u
arranques = [i * 0.01 for i in range(8, len(on)) if on[i] and not on[i - 8:i].any()]  # voz tras ≥ 80 ms de silencio
print(f"{len(eventos)} apariciones medidas en el gráfico · {len(arranques)} arranques de voz tras silencio en el audio · tolerancia ±{o.tolerancia:g} f ({o.tolerancia/o.fps*1000:.0f} ms)")
PW = [w for w in json.load(open(o.palabras)) if w.get("inicio") is not None] if o.palabras else []
def hueco_antes(t):
    prev = [w["fin"] for w in PW if w["fin"] <= t + 0.02 and w["inicio"] < t - 0.02]
    return (t - max(prev)) if prev else 9.9
ok = fuera = nv = 0
for c in cues:
    tw = c["t_palabra"]
    cerca = [t for t in eventos if abs(t - tw) <= 0.5]
    ev = min(cerca, key=lambda t: abs(t - tw)) if cerca else None
    if ev is None:
        print(f"  {c['id']:8s} «{c['palabra']}»: NO aparece nada en el gráfico a ±0,5 s de la palabra"); fuera += 1; continue
    tras_silencio = (hueco_antes(tw) >= 0.12) if PW else True
    cand = [t for t in arranques if abs(t - tw) <= 0.25] if tras_silencio else []
    if len(cand) == 1:
        tp = cand[0]; d = (ev - tp) * o.fps
        v = "OK" if abs(d) <= o.tolerancia else "FUERA"
        ok += v == "OK"; fuera += v == "FUERA"
        print(f"  {c['id']:8s} «{c['palabra']}»: gráfico {ev:.3f}s · palabra {tp:.2f}s (MEDIDA en el audio; WhisperX {tw:.2f}) · {d:+.1f} f → {v}")
    else:
        nv += 1; d = (ev - tw) * o.fps
        motivo = "va pegada a la palabra anterior (sin silencio)" if not tras_silencio else ("sin arranque claro" if not cand else f"{len(cand)} arranques posibles")
        print(f"  {c['id']:8s} «{c['palabra']}»: gráfico {ev:.3f}s · WhisperX {tw:.2f}s · {d:+.1f} f (estimado, error típico de WhisperX ±50 ms) → NO VERIFICADO a ±2 f ({motivo})")
print(f"Resumen: {ok} OK · {fuera} fuera · {nv} no verificados")
sys.exit(1 if fuera else (3 if ok == 0 else 0))
