import json,os,sys,datetime,psycopg
from psycopg.rows import dict_row
E_=json.load(open(os.path.expanduser('~/.config/claude-editor/alumnos.json')))
ID='mwc5fojxf6ybbvya'; K=open(sys.argv[1]).read().strip(); assert K.startswith(f'alumnos/mvip6dm7pelzu7y7/{ID}/final-editor-')
ap=json.dumps([{'quien':'claude-luis','que':'subió su versión (v2 completa con Space Cadet; v1 conservada en el almacén)','fecha':datetime.datetime.utcnow().isoformat()+'Z'}])
with psycopg.connect(E_['DATABASE_URL'], row_factory=dict_row) as c:
    r=c.execute("""UPDATE t10x.videos SET final=%s, portada='', estado='revisar', version=version+1, respuesta=%s, updated_at=now(),
        historial = historial || %s::jsonb WHERE id=%s RETURNING id,estado,version,final""",(K,'Versión subida a mano por Claude de Luis.',ap,ID)).fetchall()
    assert len(r)==1, r
    print(r[0])
