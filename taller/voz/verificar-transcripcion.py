"""verificar-transcripcion.py — ¿cada palabra es de la voz principal (Amin), de una voz baja (apuntador, teléfono) o de nada?

Uso: <python con numpy> verificar-transcripcion.py <palabras.json> <audio o vídeo FUENTE de esa transcripción> [--salida verificada.json]
- Mide el nivel REAL bajo cada palabra (percentil 90, ventanas de 50 ms) en el audio fuente.
- Calibra la voz principal en el propio audio: separa los segmentos de voz en dos grupos por su nivel (el más fuerte = voz principal)
  y pone el corte en el valle entre ambos.
- Etiqueta cada palabra: "principal" | "baja" (apuntador u otra voz) | "sin_voz" (no hay señal: invención o desfase).
- "fiable" = principal + tiene tiempos + puntuación de alineado ≥ 0,5 (si existe) + duración < 1,5 s.
- Si más del 25 % de las palabras caen en "sin_voz", avisa de que la transcripción probablemente NO corresponde a ese audio
  (otro archivo, otra base de tiempos, p. ej. la de un montaje).
Solo las palabras "fiables" se pueden usar para cortar o sincronizar por palabra.
Salida: 0 = coherente · 1 = transcripción no corresponde a este audio · 2 = error.
"""
import argparse, json, subprocess, sys
import numpy as np
a = argparse.ArgumentParser(); a.add_argument("palabras"); a.add_argument("audio"); a.add_argument("--salida", default="")
o = a.parse_args()
P = json.load(open(o.palabras))
x = np.frombuffer(subprocess.run(["/Users/luiyi/.local/bin/ffmpeg", "-nostdin", "-v", "error", "-i", o.audio, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
if len(x) < 16000: print("ERROR: audio ilegible"); sys.exit(2)
hop = 800; n = len(x) // hop
db = 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
# segmentos de voz y sus niveles
ruido = np.percentile(db, 20); on = db > ruido + 15; seg = []; i = 0
while i < n:
    if on[i]:
        j = i
        while j < n and (on[j] or on[j:j + 6].any()): j += 1
        if j - i >= 4: seg.append(np.percentile(db[i:j], 90))
        i = j
    else: i += 1
seg = np.array(seg)
if len(seg) < 5: print("ERROR: casi no hay voz en el audio"); sys.exit(2)
# voz principal = el grupo de segmentos más fuerte; el umbral es el VALLE del histograma de niveles
# entre (principal − 30 dB) y (principal − 8 dB): ahí se separa de las voces bajas (apuntador, teléfono)
principal = float(np.percentile(seg, 75))
h, e = np.histogram(seg, bins=np.arange(seg.min() - 3, seg.max() + 3, 3))
hs = np.convolve(h, [1, 2, 1], "same")
centros = (e[:-1] + e[1:]) / 2
zona = (centros >= principal - 30) & (centros <= principal - 8)
umbral = float(centros[zona][np.argmin(hs[zona])]) if zona.any() else principal - 18
suelo = ruido + 10
cuenta = {"principal": 0, "baja": 0, "sin_voz": 0, "sin_tiempo": 0}; fiables = 0
for w in P:
    t0, t1 = w.get("inicio"), w.get("fin")
    if t0 is None or t1 is None: w["voz"] = "sin_tiempo"; w["fiable"] = False; cuenta["sin_tiempo"] += 1; continue
    i0, i1 = int(t0 / 0.05), max(int(t0 / 0.05) + 1, int(t1 / 0.05))
    if i0 >= n: w["voz"] = "sin_voz"; w["fiable"] = False; cuenta["sin_voz"] += 1; continue
    lv = float(np.percentile(db[i0:min(i1, n)], 90)); w["nivel_db"] = round(lv, 1)
    w["voz"] = "principal" if lv >= umbral else ("baja" if lv >= suelo else "sin_voz"); cuenta[w["voz"]] += 1
    w["fiable"] = w["voz"] == "principal" and (w.get("score", 1) >= 0.5) and (t1 - t0 < 1.5)
    fiables += w["fiable"]
tot = len(P)
print(f"{o.palabras.split('/')[-1]} contra {o.audio.split('/')[-1]}: {tot} palabras")
print(f"  voz principal ≈ {principal:.0f} dB (umbral {umbral:.0f} dB) · ruido ≈ {ruido:.0f} dB")
print(f"  principal {cuenta['principal']} · voz baja {cuenta['baja']} · sin voz {cuenta['sin_voz']} · sin tiempo {cuenta['sin_tiempo']} · FIABLES {fiables} ({100*fiables/max(1,tot):.0f} %)")
if o.salida: json.dump(P, open(o.salida, "w"), ensure_ascii=False)
if cuenta["sin_voz"] > 0.25 * tot:
    print("  ⚠ Más del 25 % de las palabras caen donde NO hay voz: esta transcripción probablemente NO es de este audio (otro archivo u otra base de tiempos). No usar."); sys.exit(1)
print("  Coherente con el audio. Solo las palabras FIABLES sirven para cortar o sincronizar."); sys.exit(0)
