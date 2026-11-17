import json,os,sys,hmac,hashlib,datetime
from urllib.parse import quote,urlparse
E_=json.load(open(os.path.expanduser('~/.config/claude-editor/alumnos.json')))
def enc(s): return quote(s,safe='-_.~')
def firmar(metodo,clave,seg=3600):
    ep=E_['S3_ENDPOINT'].rstrip('/'); b=E_['S3_BUCKET']; reg=E_.get('S3_REGION') or 'auto'; host=urlparse(ep).netloc
    ahora=datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'); dia=ahora[:8]; amb=f'{dia}/{reg}/s3/aws4_request'
    ruta='/'+b+'/'+'/'.join(enc(p) for p in clave.split('/'))
    q={'X-Amz-Algorithm':'AWS4-HMAC-SHA256','X-Amz-Credential':f"{E_['S3_KEY']}/{amb}",'X-Amz-Date':ahora,'X-Amz-Expires':str(seg),'X-Amz-SignedHeaders':'host'}
    cons='&'.join(f'{enc(k)}={enc(q[k])}' for k in sorted(q))
    can='\n'.join([metodo,ruta,cons,f'host:{host}\n','host','UNSIGNED-PAYLOAD'])
    af='\n'.join(['AWS4-HMAC-SHA256',ahora,amb,hashlib.sha256(can.encode()).hexdigest()])
    h=lambda k,s: hmac.new(k,s.encode(),hashlib.sha256).digest()
    k=h(h(h(h(('AWS4'+E_['S3_SECRET']).encode(),dia),reg),'s3'),'aws4_request')
    return f"{ep}{ruta}?{cons}&X-Amz-Signature={hmac.new(k,af.encode(),hashlib.sha256).hexdigest()}"
print(firmar(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 3600))
