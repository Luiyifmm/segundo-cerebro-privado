import json,os,psycopg
from psycopg.rows import dict_row
E_=json.load(open(os.path.expanduser('~/.config/claude-editor/alumnos.json')))
with psycopg.connect(E_['DATABASE_URL'], row_factory=dict_row) as c:
    cols=[r['column_name'] for r in c.execute("select column_name from information_schema.columns where table_schema='t10x' and table_name='videos' order by ordinal_position")]
    print(cols)
    for r in c.execute("""select v.id,v.cliente_id,v.estado,v.version,v.final,v.portada,v.titulo,v.duracion,v.created_at,v.entregado_at,cl.nombre
        from t10x.videos v join t10x.clientes cl on cl.id=v.cliente_id where cl.nombre ilike '%camilo%' order by v.created_at"""):
        print({k:(str(v)[:90]) for k,v in r.items()})
