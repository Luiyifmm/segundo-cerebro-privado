# Panel Trainer10x sin navegador ni tokens (R2 + Neon, credenciales ~/.config/claude-editor/alumnos.json; nunca se imprimen).
# Uso (con: uv run -q --with "psycopg[binary]" python panel.py ...):
#   pendientes                 -> tabla de vídeos no entregados, con duplicados y brutos ausentes señalados
#   bajar <video_id> <carpeta> -> descarga el bruto (bruto.<ext>) y deja ficha.json (alumno, @, título, nota, guion)
#   final <video_id> <archivo> -> GET del final actual a <archivo>
#   subir <video_id> <mp4> [--si] [--nota TEXTO] -> sin --si solo dice qué haría. Con --si: PUT a final-editor-<b36>.mp4, HEAD = tamaño local,
#        estado «revisar», versión +1, historial. No borra el final anterior. NO entrega al alumno (eso lo decide Luis).
#   subir_lote <verificacion.json|carpeta_lote> [--si] -> sube todos los vídeos con OK en verificar.py (versión «música»)
import difflib, json, os, sys, hmac, hashlib, datetime, subprocess
from urllib.parse import quote, urlparse
import psycopg
from psycopg.rows import dict_row
E = json.load(open(os.path.expanduser('~/.config/claude-editor/alumnos.json')))

def firmar(metodo, clave, seg=3600):
    ep = E['S3_ENDPOINT'].rstrip('/'); b = E['S3_BUCKET']; reg = E.get('S3_REGION') or 'auto'; host = urlparse(ep).netloc
    enc = lambda s: quote(s, safe='-_.~')
    ahora = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'); dia = ahora[:8]; amb = f'{dia}/{reg}/s3/aws4_request'
    ruta = '/' + b + '/' + '/'.join(enc(p) for p in clave.split('/'))
    q = {'X-Amz-Algorithm': 'AWS4-HMAC-SHA256', 'X-Amz-Credential': f"{E['S3_KEY']}/{amb}", 'X-Amz-Date': ahora, 'X-Amz-Expires': str(seg), 'X-Amz-SignedHeaders': 'host'}
    cons = '&'.join(f'{enc(k)}={enc(q[k])}' for k in sorted(q))
    can = '\n'.join([metodo, ruta, cons, f'host:{host}\n', 'host', 'UNSIGNED-PAYLOAD'])
    af = '\n'.join(['AWS4-HMAC-SHA256', ahora, amb, hashlib.sha256(can.encode()).hexdigest()])
    h = lambda k, s: hmac.new(k, s.encode(), hashlib.sha256).digest()
    k = h(h(h(h(('AWS4' + E['S3_SECRET']).encode(), dia), reg), 's3'), 'aws4_request')
    return f"{ep}{ruta}?{cons}&X-Amz-Signature={hmac.new(k, af.encode(), hashlib.sha256).hexdigest()}"

def existe(clave):
    r = subprocess.run(['curl', '-sI', firmar('HEAD', clave, 300)], capture_output=True, text=True).stdout
    return ' 200 ' in r.split('\n')[0] if r else False

def db(): return psycopg.connect(E['DATABASE_URL'], row_factory=dict_row)

def pendientes():
    with db() as c:
        filas = list(c.execute("""select v.id, v.estado, v.version, v.titulo, v.bruto, v.bruto_nombre, v.bruto_mb, v.created_at, cl.nombre, cl.id cid
            from t10x.videos v join t10x.clientes cl on cl.id=v.cliente_id where v.estado<>'entregado' order by cl.nombre, v.created_at"""))
        entregados = list(c.execute("select v.cliente_id, v.titulo, v.bruto_mb, v.bruto_nombre from t10x.videos v where v.estado='entregado'"))
    for r in filas:
        avisos = []
        if 'borrar' in (r['nombre'] or '').lower(): avisos.append('PRUEBA')
        if r['bruto'] and not existe(r['bruto']): avisos.append('SIN BRUTO')
        for e in entregados:
            if e['cliente_id'] == r['cid'] and e['bruto_mb'] == r['bruto_mb'] and e['bruto_nombre'] == r['bruto_nombre']: avisos.append('MISMO BRUTO QUE UNO ENTREGADO')
            elif e['cliente_id'] == r['cid'] and difflib.SequenceMatcher(None, (e['titulo'] or '')[:70].lower(), (r['titulo'] or '')[:70].lower()).ratio() > 0.85: avisos.append('TÍTULO YA ENTREGADO')
        print(f"{r['id']} | {r['estado']:8} v{r['version']} | {r['nombre'][:28]:28} | {r['bruto_mb']} MB | {(r['titulo'] or '')[:60]} | {', '.join(sorted(set(avisos))) or 'editar'}")

def bajar(vid, carpeta):
    os.makedirs(carpeta, exist_ok=True)
    with db() as c:
        r = c.execute("""select v.*, cl.nombre, cl.instagram from t10x.videos v join t10x.clientes cl on cl.id=v.cliente_id where v.id=%s""", (vid,)).fetchone()
        g = c.execute("select gancho, historia, moraleja, cta from t10x.guiones where id=%s", (r['guion_id'],)).fetchone() if r['guion_id'] else None
    ext = os.path.splitext(r['bruto'])[1]; dst = os.path.join(carpeta, 'bruto' + ext)
    if not os.path.exists(dst): subprocess.run(['curl', '-sSf', '--retry', '5', '-o', dst, firmar('GET', r['bruto'])], check=True)
    ficha = {'video_id': vid, 'alumno': r['nombre'], 'instagram': '@' + (r['instagram'] or ''), 'titulo': r['titulo'], 'nota': r['nota_alumno'],
             'correcciones': r['correcciones'], 'guion': g, 'bruto': os.path.basename(dst)}
    json.dump(ficha, open(os.path.join(carpeta, 'ficha.json'), 'w'), ensure_ascii=False, indent=1, default=str); print('ok', dst)

def final(vid, archivo):
    with db() as c: r = c.execute("select final from t10x.videos where id=%s", (vid,)).fetchone()
    subprocess.run(['curl', '-sSf', '-o', archivo, firmar('GET', r['final'])], check=True); print('ok', archivo)

def b36(n):
    a = '0123456789abcdefghijklmnopqrstuvwxyz'; s = ''
    while n: n, r = divmod(n, 36); s = a[r] + s
    return s
def subir(vid, mp4, si=False, nota='Versión subida por Claude de Luis (lote).'):
    with db() as c: r = c.execute("select v.id, v.cliente_id, v.estado, v.version, v.final, cl.nombre from t10x.videos v join t10x.clientes cl on cl.id=v.cliente_id where v.id=%s", (vid,)).fetchone()
    if not r: print('no existe', vid); return
    clave = f"alumnos/{r['cliente_id']}/{vid}/final-editor-{b36(int(datetime.datetime.now().timestamp() * 1000))}.mp4"; tam = os.path.getsize(mp4)
    print(f"{r['nombre']} · {vid} · {r['estado']} v{r['version']} -> {'SUBO' if si else 'subiría'} {os.path.basename(mp4)} ({tam / 1e6:.1f} MB) a «revisar» v{r['version'] + 1}")
    if not si: return
    subprocess.run(['curl', '-sSf', '-X', 'PUT', '-H', 'Content-Type: video/mp4', '-T', mp4, firmar('PUT', clave)], check=True)
    h = subprocess.run(['curl', '-sI', firmar('HEAD', clave, 300)], capture_output=True, text=True).stdout
    lon = int(next((l.split(':')[1] for l in h.splitlines() if l.lower().startswith('content-length')), '0'))
    assert lon == tam, f'tamaño en R2 {lon} != local {tam}: NO actualizo la base de datos'
    ap = json.dumps([{'quien': 'claude-luis', 'que': nota, 'fecha': datetime.datetime.now(datetime.timezone.utc).isoformat()}])
    with db() as c:
        x = c.execute("""UPDATE t10x.videos SET final=%s, portada='', estado='revisar', version=version+1, respuesta=%s, updated_at=now(),
            historial = coalesce(historial, '[]'::jsonb) || %s::jsonb WHERE id=%s RETURNING estado, version""", (clave, nota, ap, vid)).fetchall()
    print('  ok', x[0], clave)
def subir_lote(ruta, si=False):
    ruta = os.path.join(ruta, 'verificacion.json') if os.path.isdir(ruta) else ruta; L = os.path.dirname(os.path.abspath(ruta))
    MEDIA = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/')
    for v in json.load(open(ruta)):
        S = json.load(open(os.path.join(L, v['video'], 'spec.json')))
        if v['fallos']: print('SALTO (falla verificación)', v['video'], v['fallos']); continue
        subir(S['video_id'], os.path.join(MEDIA, S['alumno'], S['titulo_salida'] + ' - v1 lote (música).mp4'), si)

if __name__ == '__main__':
    a = sys.argv[1:]
    {'pendientes': lambda: pendientes(), 'bajar': lambda: bajar(a[1], a[2]), 'final': lambda: final(a[1], a[2]),
     'subir': lambda: subir(a[1], a[2], '--si' in a), 'subir_lote': lambda: subir_lote(a[1], '--si' in a)}[a[0]]()
