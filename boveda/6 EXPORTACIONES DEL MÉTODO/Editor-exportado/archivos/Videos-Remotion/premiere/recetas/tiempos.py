# Imprime la transcripción con tiempos (una línea por frase/pausa) de los clips cuyo nombre empieza por un prefijo. Uso: python3 tiempos.py <prefijo> [<prefijo>...]
import json, glob, sys, os
S = "~/Videos-Remotion/voz/salida/"
for pre in sys.argv[1:]:
    for f in sorted(glob.glob(S + pre + "*.palabras.json")):
        w = json.load(open(f)); print("==", os.path.basename(f).replace(".palabras.json", ""))
        line = []; t0 = None; prev = None
        for x in w:
            if t0 is None: t0 = x["inicio"]
            if prev is not None and x["inicio"] - prev > 0.5 and line: print("  %6.2f-%6.2f %s" % (t0, prev, " ".join(line))); line = []; t0 = x["inicio"]
            line.append(x["texto"].strip()); prev = x["fin"]
            if len(line) >= 14: print("  %6.2f-%6.2f %s" % (t0, prev, " ".join(line))); line = []; t0 = None
        if line: print("  %6.2f-%6.2f %s" % (t0, prev, " ".join(line)))
