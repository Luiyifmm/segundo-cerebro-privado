"""Rol de BD limitado para el trabajador de edición del Mac de Luis (30-10-2026).

Solo la Sala de edición (esquema edicion), decisión de Amin del 31-10. Lo mínimo para coger brutos con
FOR UPDATE SKIP LOCKED y devolver el resultado:
- edicion.items: leer todo lo de edición (brutos, entregas, correcciones, referencias, reglas); con RLS,
  insertar solo entregas y modificar solo brutos, entregas y correcciones. Nunca borrar.
- edicion.versiones: leer, insertar y modificar. Nunca borrar.
- edicion.entreno: solo leer (lo que Amin enseña en la Sala de entrenamiento).
Ningún otro esquema: al ejecutarlo se le retira cualquier permiso fuera de edicion. Nada de DDL ni de usuarios.

La contraseña NUNCA se imprime: se escribe en ~/Desktop/3 · Sistemas/PARA-LUIS-NO-COMPARTIR/bd.txt (permisos 600).

Uso:   uv run -q --python 3.12 --with "psycopg[binary]" python bd/rol_trabajador_luis.py [--rotar]
       sin nada: reaplica permisos y deja la contraseña como está.
       --rotar: contraseña nueva (la vieja deja de valer). Solo si Amin lo pide: hay que volver a pasársela a Luis.
"""
import os, sys, json, time, secrets, urllib.parse
import psycopg

ROL = 'trabajador_luis'
ENV = json.load(open(os.path.expanduser('~/.claude/herramientas/env-sala.json')))
DESTINO = os.path.expanduser('~/Desktop/3 · Sistemas/PARA-LUIS-NO-COMPARTIR/bd.txt')

PERMISOS = f"""
ALTER ROLE {ROL} NOCREATEDB NOCREATEROLE NOINHERIT CONNECTION LIMIT 4;
ALTER ROLE {ROL} SET statement_timeout = '60s';
ALTER ROLE {ROL} SET lock_timeout = '10s';
ALTER ROLE {ROL} SET idle_in_transaction_session_timeout = '5min';
GRANT CONNECT ON DATABASE neondb TO {ROL};
GRANT USAGE ON SCHEMA edicion TO {ROL};

GRANT SELECT, INSERT, UPDATE ON edicion.items TO {ROL};
GRANT SELECT, INSERT, UPDATE ON edicion.versiones TO {ROL};
GRANT SELECT ON edicion.entreno TO {ROL};
"""

# RLS en edicion.items: la app entra como dueña de la tabla (neondb_owner) y no le afecta (no hay FORCE).
RLS = f"""
ALTER TABLE edicion.items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS luis_lee ON edicion.items;
DROP POLICY IF EXISTS luis_crea ON edicion.items;
DROP POLICY IF EXISTS luis_cambia ON edicion.items;
CREATE POLICY luis_lee ON edicion.items FOR SELECT TO {ROL} USING (true);
CREATE POLICY luis_crea ON edicion.items FOR INSERT TO {ROL} WITH CHECK (tipo = 'entrega');
CREATE POLICY luis_cambia ON edicion.items FOR UPDATE TO {ROL}
  USING (tipo IN ('bruto', 'entrega', 'correccion')) WITH CHECK (tipo IN ('bruto', 'entrega', 'correccion'));
"""


def ejecutar(c, bloque):
    """Sentencia a sentencia, con lock_timeout corto y reintentos (lección del bloqueo del 30-10 en otra tabla)."""
    for sql in [s.strip() for s in bloque.split(';') if s.strip()]:
        for intento in range(5):
            try:
                c.execute(sql); break
            except psycopg.errors.LockNotAvailable:
                if intento == 4: raise
                print('tabla ocupada, reintento…', flush=True); time.sleep(3)


def solo_edicion(c):
    """Retira lo que el rol tenga fuera de edicion (tablas, columnas y esquemas), sin nombrar esquemas aquí."""
    fuera = [r[0] for r in c.execute("""
        SELECT table_schema FROM information_schema.role_table_grants WHERE grantee = %(r)s AND table_schema <> 'edicion'
        UNION SELECT table_schema FROM information_schema.column_privileges WHERE grantee = %(r)s AND table_schema <> 'edicion'
        UNION SELECT nspname FROM pg_namespace WHERE nspname <> 'edicion' AND nspacl::text LIKE '%%' || %(r)s || '=%%'""", {'r': ROL}).fetchall()]
    for esquema in fuera:
        for tabla, in c.execute("SELECT tablename FROM pg_tables WHERE schemaname = %s", (esquema,)).fetchall():
            c.execute(psycopg.sql.SQL('REVOKE ALL ON TABLE {}.{} FROM {}').format(*map(psycopg.sql.Identifier, (esquema, tabla, ROL))))
        c.execute(psycopg.sql.SQL('REVOKE ALL ON SCHEMA {} FROM {}').format(*map(psycopg.sql.Identifier, (esquema, ROL))))
        print('permisos retirados en el esquema', esquema)


def main():
    sin_clave = '--rotar' not in sys.argv
    with psycopg.connect(ENV['DATABASE_URL'], autocommit=True) as c:
        c.execute("SET lock_timeout = '3s'")
        existe = c.execute('SELECT 1 FROM pg_roles WHERE rolname = %s', (ROL,)).fetchone()
        clave = None
        if not sin_clave or not existe:
            clave = secrets.token_urlsafe(32)  # ~190 bits: Neon pide ≥ 60
            verbo = 'ALTER' if existe else 'CREATE'
            c.execute(psycopg.sql.SQL(verbo + ' ROLE {} WITH LOGIN PASSWORD {}').format(psycopg.sql.Identifier(ROL), psycopg.sql.Literal(clave)))
        if clave:
            u = urllib.parse.urlparse(ENV['DATABASE_URL'])
            url = urllib.parse.urlunparse(u._replace(netloc=f'{ROL}:{urllib.parse.quote(clave, safe="")}@{u.hostname}'))
            os.makedirs(os.path.dirname(DESTINO), mode=0o700, exist_ok=True)
            fd = os.open(DESTINO, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            with os.fdopen(fd, 'w') as f:
                f.write('# Base de datos para el trabajador de edición de Luis. NO COMPARTIR por chat ni subir a ningún repo.\n')
                f.write(f'# Rol {ROL} · creado/rotado {time.strftime("%d-%m-%Y %H:%M")} · permisos en edicion-motor/bd/rol_trabajador_luis.py\n')
                f.write(f'DATABASE_URL={url}\n')
            os.chmod(DESTINO, 0o600)
            print('contraseña nueva escrita en', DESTINO, '(600)')
        solo_edicion(c)
        ejecutar(c, PERMISOS)
        ejecutar(c, RLS)
    print('permisos aplicados a', ROL)


if __name__ == '__main__':
    import psycopg.sql
    main()
