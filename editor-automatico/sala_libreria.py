"""Biblioteca del editor de la Sala, sacada ENTERA de Edición/04 Recursos/PACKS (29-10, v2).

- Efectos de sonido: todos los de SOUND EFFECTS (≤ 4 s, mp3 ligero), por tipo y con la carpeta del pack.
- Música: MÚSICA DE FONDO y PACK MÚSICA V2 (45 s desde el segundo 15, con fundidos).
- Efectos visuales («plugins»): glitch, film burns, transiciones, flares, overlays cinemáticos (se mezclan en modo
  «trama» sobre el vídeo) y las flechas de Iman Gadzhi (croma verde → WebM transparente). Vertical 720x1280, ≤ 4 s.
- Fuentes pro del pack (las que tienen sentido para subtítulos), copiadas a public/fuentes.
Escribe ~/sala-edicion/public/lib/{sfx,musica,fx}/, public/fuentes/ y src/lib/libreria.json. Lo ya convertido no se repite.
Uso: python3 sala_libreria.py"""
import os, re, json, shutil, subprocess, unicodedata
PACKS = os.path.expanduser('~/Desktop/2 · Contenido/Edición/04 Recursos (logos, fotos, b-roll)/PACKS')
APP = os.path.expanduser('~/sala-edicion')
CATS = [('Golpes y bajos', r'boom|impact|hit|bass|drop|grand|thunder|warhorn|downer|punch|slam|kick'),
        ('Whoosh', r'whoosh|swoosh|woosh|whip|transici|swish|swipe'),
        ('Subidas', r'riser|riseer|drone|rise|build|tension'),
        ('Cámara y flash', r'shutter|flash|camera|camara|cam |snap|photo'),
        ('Teclas y clics', r'click|tecla|teclado|typ|keyboard|mouse|lighter|tap'),
        ('Dinero', r'cash|money|coin|dinero|caja|register|ching'),
        ('Notificaciones', r'notif|ding|bell|pop|bubble|ping|message|iphone|alert'),
        ('Cine', r'cine|movie|film|8mm|projector|reel'),
        ('Glitch', r'glitch|error|static|digital|data'),
        ('Risas y gente', r'laugh|risa|crowd|applause|aplauso|wow|ooh|boo'),
        ('Otros', r'.')]
FX = [('GLITCH TRANSITIONS', 'Glitch', 'trama'), ('FILM BURNS', 'Film burns', 'trama'), ('ART TRANSITIONS', 'Transiciones', 'trama'),
      ('ANAMORPHIC FLARES', 'Flares', 'trama'), ('CINEMATIC OVERLAYS', 'Overlays cine', 'trama'), ('FLECHAS IMAN GADZHI', 'Flechas', 'alfa')]
FUENTES = {  # id: (nombre visible, archivo dentro de FUENTES PRO ELEGANTES)
    'sequel': ('Sequel Sans Heavy', 'SEQUEL SANS (Principal)/Sequel Sans Heavy Disp.otf'),
    'sequel-bold': ('Sequel Sans Bold', 'SEQUEL SANS (Principal)/sequel-sans-bold-disp.ttf'),
    'bernstein': ('Bernstein Heavy', 'BERNSTEIN (secundaria)/Bernstein-Serial-Heavy Regular.ttf'),
    'akira': ('Akira Expanded', 'Fuentes V4 (Recomendable Instalar)/Akira Expanded Demo.otf'),
    'komet': ('Komet Black', 'Fuentes V4 (Recomendable Instalar)/fonnts.com-Komet_Black.otf'),
    'nyght': ('Nyght Serif', 'Fuentes V4 (Recomendable Instalar)/NyghtSerif-Regular.ttf'),
    'nyght-italic': ('Nyght Serif Italic', 'Fuentes V4 (Recomendable Instalar)/NyghtSerif-RegularItalic.ttf'),
    'garamond': ('Apple Garamond', 'Fuentes V4 (Recomendable Instalar)/AppleGaramond.ttf'),
    'balboa': ('Balboa Condensed', 'Fuentes V4 (Recomendable Instalar)/balboa-condensed.otf'),
    'sfpro-black': ('SF Pro Black Italic', 'Fuentes V4 (Recomendable Instalar)/SFPRODISPLAYBLACKITALIC.OTF'),
    'montserrat-black': ('Montserrat Black', 'Fuentes V4 (Recomendable Instalar)/Montserrat-BlackItalic.ttf'),
    'halagar': ('Halagar', 'Fuentes V4 (Recomendable Instalar)/Halagar.otf'),
    'signpainter': ('SignPainter', 'Fuentes V4 (Recomendable Instalar)/SignPainterHouseScript.ttf'),
    'impact': ('Impact', 'Fuentes V4 (Recomendable Instalar)/impact.ttf'),
}


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:50]
def limpio(n):
    n = re.sub(r'\.(wav|mp3|mp4|mov|aiff?)(\.wav)?$', '', n, flags=re.I)
    n = re.sub(r'^(copia de |\d+ |-)', '', n, flags=re.I)
    n = re.sub(r'(?i)(x2download\.app|y2meta\.app|onlymp3\.to|tomp3\.cc)\s*-\s*|\(\d+ kbps\)|-[A-Za-z0-9_]{11}-192k-\d+|\(getmp3\.pro\)|_', ' ', n)
    return re.sub(r'\s+', ' ', n).strip(' -')
def ff(*a): subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)

out = {'sfx': [], 'musica': [], 'fx': [], 'fuentes': []}
for d in ('sfx', 'musica', 'fx'): os.makedirs(f'{APP}/public/lib/{d}', exist_ok=True)
os.makedirs(f'{APP}/public/fuentes', exist_ok=True)

# Efectos de sonido
vistos, por_cat = set(), {}
for raiz, _, fs in sorted(os.walk(f'{PACKS}/SOUND EFFECTS')):
    pack = os.path.relpath(raiz, f'{PACKS}/SOUND EFFECTS').split(os.sep)[-1]
    for f in sorted(fs):
        if not re.search(r'\.(wav|mp3|aiff?|m4a)$', f, re.I): continue
        nombre = limpio(f); k = slug(nombre)
        if not k or k in vistos: continue
        cat = next(c for c, rx in CATS if re.search(rx, f'{nombre} {pack}', re.I))
        vistos.add(k); por_cat[cat] = por_cat.get(cat, 0) + 1
        dst = f'{APP}/public/lib/sfx/{k}.mp3'
        if not os.path.exists(dst):
            try: ff('-i', os.path.join(raiz, f), '-t', '4', '-af', 'afade=t=out:st=3.7:d=0.3,loudnorm=I=-16:TP=-2', '-ac', '2', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k', dst)
            except subprocess.CalledProcessError: continue
        out['sfx'].append({'src': f'lib/sfx/{k}.mp3', 'nombre': nombre, 'cat': cat, 'pack': pack if pack != '.' else ''})

# Música (las dos carpetas)
for raiz, pack in [(f'{PACKS}/MÚSICA DE FONDO', 'Pack 1'), (f'{PACKS}/MÚSICA DE FONDO/PACK MÚSICA V2', 'Pack V2')]:
    for f in sorted(os.listdir(raiz)):
        if not re.search(r'\.(wav|mp3|m4a)$', f, re.I): continue
        nombre = limpio(f); k = slug(nombre)
        if not k or k in vistos: continue
        vistos.add(k); dst = f'{APP}/public/lib/musica/{k}.mp3'
        if not os.path.exists(dst):
            try: ff('-ss', '15', '-i', os.path.join(raiz, f), '-t', '45', '-af', 'afade=t=in:d=1,afade=t=out:st=43:d=2,loudnorm=I=-16:TP=-2', '-ac', '2', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '72k', dst)
            except subprocess.CalledProcessError: continue
        out['musica'].append({'src': f'lib/musica/{k}.mp3', 'nombre': nombre, 'cat': pack})

# Efectos visuales: a vertical 720x1280 (llenando), máximo 4 s
for carpeta, cat, modo in FX:
    for raiz, _, fs in sorted(os.walk(f'{PACKS}/{carpeta}')):
        for f in sorted(fs):
            if not re.search(r'\.(mp4|mov)$', f, re.I): continue
            nombre = limpio(f); k = slug(f'{cat}-{nombre}')
            ext = 'webm' if modo == 'alfa' else 'mp4'
            dst = f'{APP}/public/lib/fx/{k}.{ext}'
            if not os.path.exists(dst):
                try:
                    if modo == 'alfa':  # croma verde fuera: WebM VP9 con transparencia
                        ff('-i', os.path.join(raiz, f), '-t', '4', '-vf', 'colorkey=0x34EE10:0.32:0.08,scale=720:-2,format=yuva420p', '-an',
                           '-c:v', 'libvpx-vp9', '-b:v', '600k', '-auto-alt-ref', '0', '-r', '30', dst)
                    else:
                        ff('-i', os.path.join(raiz, f), '-t', '4', '-vf', 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280', '-an',
                           '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', dst)
                except subprocess.CalledProcessError: continue
            dur = subprocess.run(['ffmpeg', '-i', dst], capture_output=True, text=True).stderr
            m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', dur)
            out['fx'].append({'src': f'lib/fx/{k}.{ext}', 'nombre': nombre, 'cat': cat, 'modo': modo,
                              'dur': round(int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]), 2) if m else 2})
            # Miniatura para elegirlo en el editor
            mini = dst.rsplit('.', 1)[0] + '.jpg'
            if not os.path.exists(mini):
                try: ff('-ss', '0.6', '-i', dst, '-frames:v', '1', '-vf', 'scale=180:-2', '-q:v', '6', mini)
                except subprocess.CalledProcessError: pass

# Fuentes pro
for fid, (nombre, rel) in FUENTES.items():
    src = f'{PACKS}/FUENTES PRO ELEGANTES/{rel}'
    if not os.path.exists(src): continue
    ext = rel.rsplit('.', 1)[1].lower()
    dst = f'{APP}/public/fuentes/{fid}.{ext}'
    if not os.path.exists(dst): shutil.copy2(src, dst)
    out['fuentes'].append({'id': fid, 'nombre': nombre, 'src': f'fuentes/{fid}.{ext}'})

json.dump(out, open(f'{APP}/src/lib/libreria.json', 'w'), ensure_ascii=False, indent=0)
print(len(out['sfx']), 'efectos', por_cat, '·', len(out['musica']), 'canciones ·', len(out['fx']), 'efectos visuales ·', len(out['fuentes']), 'fuentes')
