"""Masters de AE (los "* master.mov" de una carpeta render, plantilla "High Quality") -> H.264 1080p 50 Mbps.

Quita la pista de capítulos/datos que AE mete en el .mov y etiqueta el color como BT.709.
Uso: python masters_a_mp4.py "carpeta render"
     ("Clase 01 - X master.mov" -> "Clase 01 - X.mp4", sin audio; si el master lleva audio, añade "-map 0:a:0 -c:a aac -b:a 320k")
"""
import subprocess
import sys
from pathlib import Path

R = Path(sys.argv[1])
for m in sorted(R.glob("* master.mov")):
    out = m.with_name(m.name.replace(" master.mov", ".mp4"))
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(m), "-map", "0:v:0", "-map_chapters", "-1", "-map_metadata", "-1",
           "-c:v", "libx264", "-preset", "slow", "-b:v", "50M", "-maxrate", "60M", "-bufsize", "100M", "-pix_fmt", "yuv420p",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-an", "-movflags", "+faststart", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(out.name, "ok" if r.returncode == 0 else r.stderr[-400:], out.stat().st_size if out.exists() else 0)
