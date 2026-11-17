"""Rellena huella + QC (qc-v1) de las versiones renderizadas que aún no lo tienen, si su MP4 está en 05 Entregas.
Uso: uv run -q --python 3.12 --with "psycopg[binary]" python ~/.claude/herramientas/edicion/qc_versiones.py [--todas]
Con --todas recalcula también las que ya tienen QC (por ejemplo, tras cambiar qc.py). El agente lo hace solo en cada render nuevo."""
import hashlib, json, os, subprocess, sys
import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

AQUI = os.path.dirname(os.path.abspath(__file__))
ENTREGAS = os.path.expanduser('~/Desktop/2 · Contenido/Edición/05 Entregas')
ENV = json.load(open(os.path.join(os.path.dirname(AQUI), 'env-sala.json')))


def qc_de(ruta, entrega, numero):
    h = hashlib.sha256()
    with open(ruta, 'rb') as f:
        for t in iter(lambda: f.read(1 << 20), b''): h.update(t)
    r = subprocess.run(['uv', 'run', '-q', '--with', 'numpy', 'python', '-I', os.path.join(AQUI, 'sistema', 'informe_qc.py'), ruta,
                        '--entrega', entrega, '--numero', str(numero)], capture_output=True, text=True, timeout=600)
    return h.hexdigest(), (json.loads(r.stdout) if r.returncode == 0 else None)


with psycopg.connect(ENV.get('DATABASE_URL') or ENV['POSTGRES_URL'], row_factory=dict_row, autocommit=True) as c:
    filas = c.execute("SELECT id, entrega, numero, archivo FROM edicion.versiones WHERE estado = 'renderizado' AND archivo IS NOT NULL"
                      + ('' if '--todas' in sys.argv else ' AND qc IS NULL') + ' ORDER BY entrega, numero').fetchall()
    for v in filas:
        ruta = os.path.join(ENTREGAS, v['archivo'])
        if not os.path.exists(ruta): print('sin archivo en el Mac:', v['archivo']); continue
        huella, qc = qc_de(ruta, v['entrega'], v['numero'])
        c.execute('UPDATE edicion.versiones SET huella = %s, qc = %s WHERE id = %s', (huella, Jsonb(qc) if qc else None, v['id']))
        print((qc or {}).get('veredicto_qc_py', 'QC FALLÓ'), '·', v['archivo'][:70])
