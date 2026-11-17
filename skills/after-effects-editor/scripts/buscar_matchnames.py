"""Busca nombres internos (matchNames) dentro de los archivos de After Effects, solo leyendo.
Uso: python buscar_matchnames.py "regex" [carpeta_AE]
Ej.: python buscar_matchnames.py "ADBE Text [A-Za-z0-9 ]+"  → lista los que existen (ASCII y UTF-16)."""
import glob
import os
import re
import sys

patron = sys.argv[1]
raiz = sys.argv[2] if len(sys.argv) > 2 else r"C:\Program Files\Adobe\Adobe After Effects 2026\Support Files"
rx8 = re.compile(patron.encode("ascii"))
vistos = {}
archivos = [p for ext in ("*.dll", "*.aex", "*.exe", "*.prm") for p in glob.glob(os.path.join(raiz, "**", ext), recursive=True)]
for p in archivos:
    try:
        with open(p, "rb") as f:
            b = f.read()
    except OSError:
        continue
    for m in rx8.finditer(b):
        s = m.group(0).decode("ascii", "replace").strip()
        vistos.setdefault(s, os.path.basename(p))
    # UTF-16 LE
    u = b.replace(b"\x00", b"") if b"A\x00D\x00B\x00E" in b else b""
    if u:
        for m in rx8.finditer(u):
            s = m.group(0).decode("ascii", "replace").strip()
            vistos.setdefault(s, os.path.basename(p) + " (utf16)")
for s in sorted(vistos):
    print(s, "|", vistos[s])
print(len(vistos), "nombres en", len(archivos), "archivos")
