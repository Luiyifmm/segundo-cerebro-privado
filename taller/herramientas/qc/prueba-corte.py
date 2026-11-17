"""prueba-corte.py — ¿el audio del montaje dice exactamente lo que debería? (idea "cut-proof" de video-editor; código propio)

Uso: <python del entorno whisperx> prueba-corte.py --tramos tramos.json --fuente <bruto> --esperado "<texto>" | --palabras verificada.json
1. Monta el audio de los tramos con ffmpeg (sin Premiere).
2. Lo transcribe de nuevo con WhisperX (voz/transcribir-whisperx.py).
3. Compara palabra a palabra con el texto esperado (el guion o las palabras verificadas de los tramos):
   PERDIDA = falta en el montaje (sílaba o palabra comida) · SOBRA = aparece de más (repetición, voz ajena) · CAMBIO = otra palabra.
Salida: 0 = coincide · 1 = diferencias.
"""
import argparse, difflib, json, os, subprocess, sys, unicodedata, tempfile
a = argparse.ArgumentParser(); a.add_argument("--tramos", required=True); a.add_argument("--fuente", required=True)
a.add_argument("--esperado", default=""); a.add_argument("--palabras", default="")
o = a.parse_args()
T = json.load(open(o.tramos))
def norm(s): return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn" and c.isalnum())
if o.esperado: esp = [norm(w) for w in o.esperado.split() if norm(w)]
else:
    P = [w for w in json.load(open(o.palabras)) if w.get("inicio") is not None and w.get("voz") != "sin_voz"]
    esp = [norm(w["texto"]) for e, s in T for w in P if e <= (w["inicio"] + w["fin"]) / 2 <= s and norm(w["texto"])]
d = tempfile.mkdtemp(); wav = os.path.join(d, "montaje.wav")
f = ";".join(f"[0:a]atrim={a_}:{b_},asetpts=PTS-STARTPTS[a{i}]" for i, (a_, b_) in enumerate(T)) + ";" + "".join(f"[a{i}]" for i in range(len(T))) + f"concat=n={len(T)}:v=0:a=1[out]"
open(os.path.join(d, "f.txt"), "w").write(f)
subprocess.run(["/Users/luiyi/.local/bin/ffmpeg", "-nostdin", "-v", "error", "-y", "-i", o.fuente, "-filter_complex_script", os.path.join(d, "f.txt"), "-map", "[out]", "-ac", "1", "-ar", "16000", wav], check=True)
r = subprocess.run([sys.executable, os.path.expanduser("~/Videos-Remotion/voz/transcribir-whisperx.py"), wav, "--salida", d], capture_output=True, text=True)
res = json.loads(r.stdout.strip().splitlines()[-1]); oid = [norm(w) for w in res["texto"].split() if norm(w)]
dif = []
for op, i1, i2, j1, j2 in difflib.SequenceMatcher(a=esp, b=oid, autojunk=False).get_opcodes():
    if op == "delete": dif.append(f"PERDIDA «{' '.join(esp[i1:i2])}» (palabra {i1+1} del esperado)")
    elif op == "insert": dif.append(f"SOBRA   «{' '.join(oid[j1:j2])}» (tras la palabra {i1} del esperado)")
    elif op == "replace": dif.append(f"CAMBIO  «{' '.join(esp[i1:i2])}» → «{' '.join(oid[j1:j2])}»")
print(f"Esperado {len(esp)} palabras · oído en el montaje {len(oid)} · {len(dif)} diferencia(s)")
print("Oído:", res["texto"])
if not dif: print("COINCIDE: el montaje dice exactamente el texto esperado."); sys.exit(0)
print("\n".join("  " + x for x in dif)); print("Nota: los CAMBIO de una letra suelen ser pronunciación o transcripción; PERDIDA y SOBRA, escuchar."); sys.exit(1)
