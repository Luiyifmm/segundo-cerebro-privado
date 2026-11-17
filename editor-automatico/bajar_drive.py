"""Baja una carpeta COMPARTIDA de Google Drive (con enlace) recursivamente, sin login.
Uso: python3 bajar_drive.py FOLDER_ID DESTINO [--solo-listar]
Lista con embeddedfolderview y baja cada archivo por drive.usercontent. Salta lo ya bajado."""
import sys, os, re, html, subprocess, urllib.request

def listar(fid):
    t = urllib.request.urlopen(f'https://drive.google.com/embeddedfolderview?id={fid}').read().decode()
    for m in re.finditer(r'<a href="([^"]+)"[^>]*>.*?flip-entry-title">([^<]+)<', t, re.S):
        url, nombre = html.unescape(m[1]), html.unescape(m[2]).strip().replace('/', '-')
        f = re.search(r'/folders/([\w-]+)', url)
        if f: yield 'carpeta', f[1], nombre
        else:
            i = re.search(r'/file/d/([\w-]+)', url) or re.search(r'id=([\w-]+)', url)
            if i: yield 'archivo', i[1], nombre

def bajar(fid, dst, solo=False, nivel=0):
    os.makedirs(dst, exist_ok=True)
    for tipo, i, nombre in listar(fid):
        ruta = os.path.join(dst, nombre)
        if tipo == 'carpeta':
            print('  ' * nivel + '[+] ' + nombre, flush=True); bajar(i, ruta, solo, nivel + 1); continue
        if solo: print('  ' * nivel + nombre); continue
        if os.path.exists(ruta) and os.path.getsize(ruta) > 0: continue
        r = subprocess.run(['curl', '-s', '-L', '-m', '900', '-o', ruta + '.part',
                            f'https://drive.usercontent.google.com/download?id={i}&export=download&confirm=t'])
        cab = open(ruta + '.part', 'rb').read(200) if os.path.exists(ruta + '.part') else b'<html'
        if r.returncode == 0 and b'<!DOCTYPE html' not in cab and b'<html' not in cab:
            os.replace(ruta + '.part', ruta); print('  ' * nivel + 'ok ' + nombre, flush=True)
        else:
            if os.path.exists(ruta + '.part'): os.remove(ruta + '.part')
            print('  ' * nivel + 'FALLO ' + nombre, flush=True)

bajar(sys.argv[1], sys.argv[2], '--solo-listar' in sys.argv)
print('FIN')
