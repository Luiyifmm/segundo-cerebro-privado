"""transcribir-whisperx.py — transcripción + ALINEADO por palabra con WhisperX (entorno aislado, experimental).

Uso (con el python del entorno aislado):
  ~/Videos-Remotion/herramientas/entornos/whisperx/bin/python transcribir-whisperx.py <audio|vídeo>
      [--inicio s] [--duracion s] [--modelo small|medium|large-v3] [--ganancia dB] [--salida carpeta]
Salida: <salida>/<nombre>[_<inicio>].palabras.json  →  [{"texto","inicio","fin","score"}…] (tiempos del ARCHIVO ORIGINAL)
- ASR: faster-whisper (CPU, int8). Detector de voz: Silero (MIT); NO usa los modelos de pyannote (exigen aceptar condiciones).
- Alineado: wav2vec2 en español (jonatasgrosman/wav2vec2-large-xlsr-53-spanish, Apache-2.0).
No sustituye a voz/transcribir.js (Whisper small), que sigue siendo la herramienta por defecto.
"""
import argparse, json, os, subprocess, sys, time, tempfile, warnings
warnings.filterwarnings("ignore")  # torchcodec avisa de su propio decodificador; el audio se lee con ffmpeg
a = argparse.ArgumentParser(); a.add_argument("archivo"); a.add_argument("--inicio", type=float, default=0); a.add_argument("--duracion", type=float, default=0)
a.add_argument("--modelo", default="small"); a.add_argument("--ganancia", type=float, default=0); a.add_argument("--idioma", default="auto")  # auto = lo detecta Whisper (14-11-2026); antes era "es" fijo
a.add_argument("--salida", default=os.path.expanduser("~/Videos-Remotion/voz/salida-whisperx"))
o = a.parse_args()
os.makedirs(o.salida, exist_ok=True)
t0 = time.time()
tmp = tempfile.mktemp(suffix=".wav")
cmd = ["/Users/luiyi/.local/bin/ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(o.inicio), "-i", o.archivo]
if o.duracion: cmd += ["-t", str(o.duracion)]
cmd += ["-vn", "-ac", "1", "-ar", "16000"] + (["-af", f"volume={o.ganancia}dB"] if o.ganancia else []) + [tmp]
subprocess.run(cmd, check=True)
import whisperx
audio = whisperx.load_audio(tmp)
t1 = time.time()
idi = None if o.idioma == "auto" else o.idioma
model = whisperx.load_model(o.modelo, "cpu", compute_type="int8", language=idi, vad_method="silero")
res = model.transcribe(audio, batch_size=8, language=idi)
idi = idi or res.get("language") or "es"
if o.idioma == "auto" and idi not in ("es", "en"): print(f"AVISO: idioma detectado «{idi}» (ni español ni inglés): comprobar y repetir con --idioma es|en", file=sys.stderr)
t2 = time.time()
am, meta = whisperx.load_align_model(language_code=idi, device="cpu")
al = whisperx.align(res["segments"], am, meta, audio, "cpu", return_char_alignments=False)
t3 = time.time()
pal = []
for s in al["segments"]:
    for w in s.get("words", []):
        if "start" in w:
            pal.append({"texto": w["word"], "inicio": round(w["start"] + o.inicio, 3), "fin": round(w["end"] + o.inicio, 3), "score": round(w.get("score", 0), 3)})
        else:
            pal.append({"texto": w["word"], "inicio": None, "fin": None, "score": 0})
base = os.path.splitext(os.path.basename(o.archivo))[0] + (f"_{o.inicio:g}" if o.inicio else "")
out = os.path.join(o.salida, base + ".palabras.json")
json.dump(pal, open(out, "w"), ensure_ascii=False, indent=0)
os.remove(tmp)
print(json.dumps({"salida": out, "idioma": idi, "palabras": len(pal), "sin_tiempo": sum(1 for p in pal if p["inicio"] is None),
                  "texto": " ".join(p["texto"] for p in pal),
                  "s_carga": round(t1 - t0, 1), "s_transcripcion": round(t2 - t1, 1), "s_alineado": round(t3 - t2, 1), "s_total": round(t3 - t0, 1)}, ensure_ascii=False))
