"""Un master de AE (plantilla "High Quality", .mov) CON audio → H.264 50 Mbps + AAC 320k, color BT.709, sin la pista de
datos/capítulos que AE mete en el .mov. Si el master no trae audio, sale solo el vídeo.
Uso: python master_a_mp4_audio.py "x master.mov" ["salida.mp4"]   (por defecto quita " master" del nombre)
"""
import subprocess
import sys
from pathlib import Path

m = Path(sys.argv[1])
out = Path(sys.argv[2]) if len(sys.argv) > 2 else m.with_name(m.name.replace(" master.mov", ".mp4"))
pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(m)],
                    capture_output=True, text=True)
audio = bool(pr.stdout.strip())
cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(m), "-map", "0:v:0"]
if audio:
    cmd += ["-map", "0:a:0", "-c:a", "aac", "-b:a", "320k"]
cmd += ["-map_chapters", "-1", "-map_metadata", "-1", "-c:v", "libx264", "-preset", "slow", "-b:v", "50M", "-maxrate", "60M",
        "-bufsize", "100M", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-movflags", "+faststart", str(out)]
r = subprocess.run(cmd, capture_output=True, text=True)
print(out.name, "ok" if r.returncode == 0 else r.stderr[-400:], "| audio:", audio, "|", out.stat().st_size if out.exists() else 0, "bytes")
