#!/usr/bin/env python3
# Auditoría del estilo «10 Podcast minimal»: mide lo medible de un vídeo exportado y deja la hoja para mirar lo demás.
# uso: python3 auditar-estilo-minimal.py <video.mp4> [carpeta_salida]
# Sale: <salida>/auditoria.md (tabla OK / FALLA / MIRAR) y <salida>/hoja_N.jpg (2 fotogramas por segundo).
# No aprueba nada: un OK solo dice que la medida cae en el rango de las referencias.
import sys, os, re, subprocess, statistics as st

v = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(v)[0] + ' · auditoría'
os.makedirs(out, exist_ok=True)
def run(a): return subprocess.run(a, capture_output=True, text=True)
p = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'csv=p=0', v]).stdout.split()
w, h, fr = p[0].split(','); dur = float(p[1]); a, b = fr.split('/'); fps = float(a) / float(b)
ct = os.path.join(out, 'cortes.txt')
run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-vf', "select='gt(scene,0.25)',metadata=print:file=" + ct.replace(':', '\\:').replace("'", "\\'"), '-an', '-f', 'null', '-'])
cortes = [float(x) for x in re.findall(r'pts_time:([\d.]+)', open(ct).read())] if os.path.exists(ct) else []
lim = [0.0] + cortes + [dur]; planos = [lim[i + 1] - lim[i] for i in range(len(lim) - 1)]
run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-vf', "fps=2,scale=150:266,drawtext=text='%{pts\\:hms}':x=3:y=3:fontsize=13:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=10x5", os.path.join(out, 'hoja_%d.jpg')])
# brillo medio del 25 % inferior frente al tercio central (¿hay degradado negro abajo?)
def brillo(crop):
    r = run(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'fps=1,' + crop + ',signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-an', '-f', 'null', '-']).stdout
    x = [float(m) for m in re.findall(r'YAVG=([\d.]+)', r)]; return st.mean(x) if x else None
bajo, medio = brillo('crop=iw:ih*0.2:0:ih*0.8'), brillo('crop=iw:ih*0.3:0:ih*0.35')
def fila(n, regla, valor, ok, rango): return '| %s | %s | %s | %s | %s |' % (n, regla, valor, 'OK' if ok is True else ('FALLA' if ok is False else 'MIRAR'), rango)
med = st.median(planos); largo = max(planos); primero = cortes[0] if cortes else None
F = ['# Auditoría «Podcast minimal» · ' + os.path.basename(v), '', '%sx%s · %.2f fps · %.1f s · %d planos detectados (umbral 0,25).' % (w, h, fps, dur, len(planos)), '',
     '## Medido', '| Regla | Qué | Valor | Resultado | Rango de las referencias |', '|---|---|---|---|---|',
     fila('—', 'Formato 9:16', '%sx%s' % (w, h), abs(int(w) / int(h) - 9 / 16) < 0.01, '9:16'),
     fila('—', 'Duración', '%.1f s' % dur, 20 <= dur <= 60, '25–55 s'),
     fila(4, 'Primer cambio de plano', '%.2f s' % primero if primero else 'ninguno', (1.2 <= primero <= 3.2) if primero else False, '1,5–3,0 s'),
     fila(5, 'Plano, mediana', '%.2f s' % med, 0.7 <= med <= 2.6, '0,8–2,4 s'),
     fila(2, 'Plano más largo (aproxima el tramo sin cambio)', '%.2f s' % largo, largo <= 5.5, '≤ 5 s'),
     fila(12, 'Parte baja más oscura que el centro', ('%.0f frente a %.0f' % (bajo, medio)) if bajo is not None else '—', (bajo < medio * 0.75) if bajo is not None else None, 'bajo < 75 % del centro (media de todo el vídeo: las pantallas claras lo suben)'),
     '', '## Para mirar en la hoja (lo escribo yo; decide el usuario)', '| Regla | Pregunta | Resultado | Nota |', '|---|---|---|---|']
for n, q in [(1, 'Reparto: ¿A-roll 45–60 %, b-roll y pantalla completa el resto? (contar celdas de la hoja)'), (3, '¿Abre en movimiento y con la primera palabra al decirse?'),
             (4, '¿La primera escena diseñada es la recompensa literal del gancho?'), (7, '¿Cierra en A-roll con la frase final?'),
             (8, '¿El texto va sobre el pecho (47–62 % del alto) o donde el plano lo permite, sin tapar cara ni manos?'), (9, '¿Dos tamaños, especial ≈ 2,3–2,6× el relleno, ≤ 60 % del ancho?'),
             (10, '¿Una cláusula por página, UNA frase especial?'), (11, '¿Nombre abajo a la izquierda, una vez por hablante?'), (13, '¿Un solo acento, sacado del plano o de la marca?'),
             (14, '¿Dos familias o pesos como máximo?'), (15, '¿Cada pantalla completa tiene UN concepto, fondo que contrasta con el A-roll, 2–5 s?'), (16, '¿Entradas rápidas sin rebote; nada del todo quieto?'),
             ('D', '¿Cada escena responde a lo que se dice (cifra → gráfico, enumeración → montaje…)? ¿Alguna solo decora?'), ('F', 'Sonido y música: NO VERIFICADO por este script (usar earshot)')]:
    F.append('| %s | %s | MIRAR | |' % (n, q))
F += ['', 'Tiempos de corte: ' + ', '.join('%.2f' % c for c in cortes)]
open(os.path.join(out, 'auditoria.md'), 'w', encoding='utf-8').write('\n'.join(F) + '\n')
print('\n'.join(F[:14])); print('→', os.path.join(out, 'auditoria.md'))
