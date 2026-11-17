"""cortes-voz.py — ¿algún corte se come una palabra o deja una frase repetida?

Uso:
  <python con numpy> cortes-voz.py --fuente <audio o vídeo del bruto> --palabras <bruto.palabras.json>
        --tramos tramos.json  [--margen 0.03]
  tramos.json = [[entrada, salida], …] en segundos del BRUTO, en el orden del montaje
                (sale de una foto de secuencia: premiere/recetas/leer-secuencia.jsx → clips de A1/V1, "en" + duración).

Dos comprobaciones:
1. Corte con voz sonando (MEDIDO en el audio, no depende de la transcripción):
   - nivel en ±30 ms alrededor de cada punto de corte, frente al nivel de voz y al ruido del propio bruto;
   - si suena voz en el punto de corte → posible sílaba o palabra cortada;
   - la palabra afectada sale de la transcripción y es orientativa.
2. Repeticiones en el montaje (SÍ depende de la transcripción): las palabras que quedan, en orden,
   y la misma secuencia de 1–4 palabras dos veces seguidas, o repetida justo a ambos lados de una unión.
Salida: 0 = limpio · 1 = avisos · 2 = error. Código propio (06-11-2026).
"""
import argparse, json, subprocess, sys, unicodedata
import numpy as np

FF = "/Users/luiyi/.local/bin/ffmpeg"
a = argparse.ArgumentParser(); a.add_argument("--fuente", required=True); a.add_argument("--palabras", required=True)
a.add_argument("--tramos", required=True); a.add_argument("--margen", type=float, default=0.03)
o = a.parse_args()
tramos = json.load(open(o.tramos)); W = json.load(open(o.palabras))
pal = [(w.get("inicio", w.get("start")), w.get("fin", w.get("end")), w.get("texto", w.get("word", "")).strip()) for w in W]
SR = 16000
fin_max = max(t[1] for t in tramos) + 1
raw = subprocess.run([FF, "-nostdin", "-v", "error", "-i", o.fuente, "-t", f"{fin_max}", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
if len(x) < SR: print("ERROR: no se pudo leer el audio"); sys.exit(2)
H = int(0.01 * SR); env = np.sqrt(np.convolve(x ** 2, np.ones(H) / H, "same") + 1e-12); db = 20 * np.log10(env + 1e-9)
# nivel de voz y ruido medidos en todo lo leído (percentiles), en dB
voz, ruido = np.percentile(db, 90), np.percentile(db, 15)
umbral = ruido + 0.45 * (voz - ruido)
def nivel(t):
    i0, i1 = int(max(0, (t - o.margen) * SR)), int(min(len(db), (t + o.margen) * SR))
    return float(db[i0:i1].max()) if i1 > i0 else -120.0
def palabra_en(t):
    for p0, p1, w in pal:
        if p0 is not None and p0 + 0.04 < t < p1 - 0.04: return w, p0, p1
    return None
def norm(s): return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn" and c.isalnum())

avisos, errores, escuchar = [], [], []
print(f"Bruto: voz ≈ {voz:.0f} dB, ruido ≈ {ruido:.0f} dB → umbral de 'voz sonando' {umbral:.0f} dB · {len(tramos)} tramos, {2 * len(tramos)} puntos de corte")
t_mont = 0.0
for k, (e, s) in enumerate(tramos):
    for nombre, t in (("entrada", e), ("salida", s)):
        n = nivel(t)
        if n > umbral:
            pw = palabra_en(t); tm = t_mont + (0 if nombre == 'entrada' else s - e)
            if pw:
                errores.append(f"CORTE DENTRO DE PALABRA  tramo {k+1} {nombre} {t:.2f}s (montaje {tm:.2f}s): «{pw[0]}» {pw[1]:.2f}–{pw[2]:.2f} · {n:.0f} dB")
            else:
                escuchar.append(f"unión en habla continua  tramo {k+1} {nombre} {t:.2f}s (montaje {tm:.2f}s): {n:.0f} dB · entre palabras, escuchar")
    t_mont += s - e
# repeticiones: palabras cuyo centro cae dentro de un tramo, en orden de montaje, marcando las uniones
seq, union = [], []
for k, (e, s) in enumerate(tramos):
    dentro = [w for (p0, p1, w) in pal if p0 is not None and e <= (p0 + p1) / 2 <= s]
    if seq: union.append(len(seq))
    seq += [norm(w) for w in dentro if norm(w)]
cubiertos = []  # (i0, i1, j0, j1) de repeticiones ya avisadas, para no repetir trozos de la misma
for n in (4, 3):
    for i in range(len(seq) - 2 * n + 1):
        A, B = seq[i:i + n], seq[i + n:i + 2 * n]
        if A == B and (n > 1 or A[0] not in ("que", "la", "el", "de", "no", "y")):
            avisos.append(f"REPETICIÓN     «{' '.join(A)}» dos veces seguidas (palabra {i+1} del montaje)")
    # frase repetida cerca (tomas repetidas): el mismo grupo de n ≥ 2 palabras vuelve a salir en las 10 palabras siguientes
    if n >= 2:
        for i in range(len(seq) - n + 1):
            A = seq[i:i + n]
            for j in range(i + n, min(len(seq) - n + 1, i + n + 6)):
                if seq[j:j + n] == A:
                    if any(a0 <= i and i + n <= a1 and b0 <= j and j + n <= b1 for a0, a1, b0, b1 in cubiertos): break
                    cubiertos.append((i, i + n, j, j + n))
                    avisos.append(f"FRASE REPETIDA «{' '.join(A)}» (palabras {i+1} y {j+1} del montaje): ¿toma repetida?"); break
    for u in union:
        A, B = seq[max(0, u - n):u], seq[u:u + n]
        if len(A) == n and A == B: avisos.append(f"REPETICIÓN     «{' '.join(A)}» a ambos lados de la unión {union.index(u)+1}")
vistos, final = set(), []
for v in errores + avisos:
    if v not in vistos: vistos.add(v); final.append(v)
print("Texto que queda:", " ".join(seq))
if escuchar:
    print(f"ESCUCHAR ({len(escuchar)} uniones en habla continua, no son errores por sí mismas):"); print("\n".join("  " + v for v in escuchar))
if not final: print("QC TÉCNICO: sin palabras cortadas ni repeticiones." + (" Quedan uniones por escuchar." if escuchar else "")); sys.exit(0)
print(f"ERRORES / REPETICIONES ({len(final)}):"); print("\n".join("  " + v for v in final))
print("Nota: el nivel de corte está MEDIDO; las palabras y las repeticiones dependen de la transcripción (Whisper small) y conviene escucharlas.")
sys.exit(1)
