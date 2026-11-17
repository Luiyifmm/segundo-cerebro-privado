"""Exporta a un JSON local lo que Claude 2 necesita leer de la Sala, sin darle acceso a la base de datos.

Uso: uv run -q --python 3.12 --with "psycopg[binary]" python ~/.claude/herramientas/edicion/exportar_para_claude2.py
Escribe /Users/aminsproject/claude-2/entrada/sala-export.json con:
  - correcciones pendientes (items tipo «correccion» que no están hechas ni aplicadas),
  - entrenamiento activo (edicion.entreno con activa = true: estado, texto, para, tipo…),
  - referencias (items tipo «referencia»),
  - reglas aprobadas (items tipo «regla», estado «aprobada»).
Solo lectura (transacción read-only). No escribe credenciales ni la URL de la base en el archivo.
Decisión de Amin (30-10-2026): Claude 2 lee correcciones y notas solo con acceso de lectura y sin copiar credenciales.
"""
import datetime, json, os
import psycopg
from psycopg.rows import dict_row

SALIDA = '/Users/aminsproject/claude-2/entrada/sala-export.json'
ENV = json.load(open(os.path.expanduser('~/.claude/herramientas/env-sala.json')))


def limpio(fila):
    return {k: (v.isoformat() if hasattr(v, 'isoformat') else v) for k, v in fila.items()}


with psycopg.connect(ENV.get('DATABASE_URL') or ENV['POSTGRES_URL'], row_factory=dict_row) as c:
    c.execute('SET TRANSACTION READ ONLY')
    items = lambda where: [limpio(f) for f in c.execute(
        f"SELECT id, tipo, estado, datos, respuesta, autor, created_at, updated_at FROM edicion.items WHERE {where} ORDER BY created_at").fetchall()]
    datos = {
        'generado_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'como_regenerar': 'uv run -q --python 3.12 --with "psycopg[binary]" python ~/.claude/herramientas/edicion/exportar_para_claude2.py',
        'correcciones_pendientes': items("tipo = 'correccion' AND estado NOT IN ('hecha', 'aplicada')"),
        'entreno_activo': [limpio(f) for f in c.execute(
            "SELECT id, estado, texto, para, tipo, url, respuesta, autor, created_at FROM edicion.entreno WHERE activa ORDER BY created_at").fetchall()],
        'referencias': items("tipo = 'referencia'"),
        'reglas_aprobadas': items("tipo = 'regla' AND estado = 'aprobada'"),
    }

os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
tmp = SALIDA + '.tmp'
with open(tmp, 'w') as f: json.dump(datos, f, ensure_ascii=False, indent=1)
os.replace(tmp, SALIDA)
print(SALIDA, {k: len(v) for k, v in datos.items() if isinstance(v, list)})
