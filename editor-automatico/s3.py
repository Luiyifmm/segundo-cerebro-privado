"""Almacén de vídeos de los alumnos de Trainer10x (S3 compatible: Cloudflare R2).

Lo mismo que src/lib/almacen.ts de trainer10x-contenido, en Python: enlaces firmados
(AWS Signature V4 en la URL) y curl para bajar y subir, que aguanta archivos de GB.
Las claves salen de ~/.claude/herramientas/env-trainer10x.json (S3_ENDPOINT, S3_BUCKET, S3_KEY, S3_SECRET, S3_REGION).
"""
import os, json, hmac, hashlib, datetime, subprocess
from urllib.parse import quote, urlparse

_ENV = json.load(open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'env-trainer10x.json')))
C = {k: _ENV.get(f'S3_{k.upper()}', '') for k in ('endpoint', 'bucket', 'key', 'secret', 'region')}
C['endpoint'] = C['endpoint'].rstrip('/'); C['region'] = C['region'] or 'auto'


def listo(): return all(C[k] for k in ('endpoint', 'bucket', 'key', 'secret'))


def _enc(s): return quote(s, safe='-_.~')


def firmar(metodo, clave, segundos=3600):
    ahora = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'); dia = ahora[:8]
    ambito = f'{dia}/{C["region"]}/s3/aws4_request'
    ruta = f'/{C["bucket"]}/' + '/'.join(_enc(p) for p in clave.split('/'))
    q = {'X-Amz-Algorithm': 'AWS4-HMAC-SHA256', 'X-Amz-Credential': f'{C["key"]}/{ambito}', 'X-Amz-Date': ahora,
         'X-Amz-Expires': str(segundos), 'X-Amz-SignedHeaders': 'host'}
    consulta = '&'.join(f'{_enc(k)}={_enc(q[k])}' for k in sorted(q))
    host = urlparse(C['endpoint']).netloc
    canonica = '\n'.join([metodo, ruta, consulta, f'host:{host}\n', 'host', 'UNSIGNED-PAYLOAD'])
    a_firmar = '\n'.join(['AWS4-HMAC-SHA256', ahora, ambito, hashlib.sha256(canonica.encode()).hexdigest()])
    h = lambda k, s: hmac.new(k, s.encode(), hashlib.sha256).digest()
    k = h(h(h(h(('AWS4' + C['secret']).encode(), dia), C['region']), 's3'), 'aws4_request')
    return f'{C["endpoint"]}{ruta}?{consulta}&X-Amz-Signature={hmac.new(k, a_firmar.encode(), hashlib.sha256).hexdigest()}'


def bajar(clave, destino):
    subprocess.run(['curl', '-sSf', '--retry', '3', '-o', destino, firmar('GET', clave)], check=True)
    return destino


def subir(archivo, clave, tipo='video/mp4'):
    subprocess.run(['curl', '-sSf', '--retry', '3', '-X', 'PUT', '-H', f'Content-Type: {tipo}', '-T', archivo, firmar('PUT', clave, 6 * 3600)],
                   check=True, stdout=subprocess.DEVNULL)


def borrar(clave):
    if clave: subprocess.run(['curl', '-sS', '-X', 'DELETE', firmar('DELETE', clave, 300)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
