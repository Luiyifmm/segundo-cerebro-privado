"""Máster: graves controlados, compresión suave, limitador a 4x, objetivo ~-11 LUFS y <= -1 dBTP medido en el MP3.
Uso: master.py premaster.wav salida.mp3 [lufs_objetivo]"""
import subprocess, sys, json, re, os
src, out_mp3, target = sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else -11.0
tmp = out_mp3 + '.master.wav'


def meter(p):
    r = subprocess.run(['ffmpeg', '-nostdin', '-nostats', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); tp = float(re.findall(r'Peak:\s+(-?[\d.inf]+) dBFS', r)[-1])
    lra = float(re.findall(r'LRA:\s+(-?[\d.]+) LU', r)[-1])
    return I, tp, lra


def chain(pre_gain, ceiling=-2.1):
    return (f"highpass=f=28:poles=2,equalizer=f=90:t=q:w=0.9:g=-1.0,volume={pre_gain}dB,"
            f"acompressor=threshold=-14dB:ratio=2:attack=25:release=250:knee=6:makeup=1,"
            f"aresample=176400,alimiter=limit={10**(ceiling/20):.4f}:attack=2:release=80:level=disabled:asc=1,"
            f"aresample=44100:filter_size=64:cutoff=0.97")


I0, tp0, lra0 = meter(src)
print(f'premáster: {I0:.1f} LUFS, {tp0:.1f} dBTP, LRA {lra0:.1f}')
g = target - I0 + 0.6
for it in range(7):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-af', chain(g), '-c:a', 'pcm_f32le', tmp], check=True)
    I, tp, lra = meter(tmp)
    print(f'  intento {it+1}: ganancia {g:+.1f} dB -> {I:.1f} LUFS, {tp:.2f} dBTP, LRA {lra:.1f}')
    if abs(I - target) < 0.3: break
    g += (target - I) * 1.4
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '320k', '-ar', '44100',
                '-metadata', 'title=PREDE EL PARTY - Joseph Barbosa (Final Mix)', '-metadata', 'artist=Joseph Barbosa',
                out_mp3], check=True)
os.remove(tmp)
I2, tp2, lra2 = meter(out_mp3)
print(f'MP3 final: {I2:.1f} LUFS, {tp2:.2f} dBTP, LRA {lra2:.1f}')
