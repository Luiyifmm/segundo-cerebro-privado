# Uso: python3 linea.py preparar <cliente>  |  python3 linea.py video <cliente> <n> <inicio_s> <info.json>   → imprime la ruta del .jsx generado
import json,os,sys,glob
H=os.path.expanduser("~"); S="/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad"
C={"clientea":("CLIENTE-A - LOTE 11 OCT.prproj","IMG_6118","CLIENTE-A · LÍNEA DE TIEMPO (ejemplo + 4 brutos)"),"clienten":("CLIENTE-N - LOTE 11 OCT.prproj","CLIENTE-N_1010_01 - Reaccion a los pasos","CLIENTE-N · LÍNEA DE TIEMPO (ejemplo + 4 brutos)"),"clientee":("CLIENTE-E - LOTE 11 OCT.prproj","CLIENTE-E_1009_01 - v2 audio solapado","CLIENTE-E · LÍNEA DE TIEMPO (ejemplo + 4 brutos)")}
modo,cli=sys.argv[1:3]; proy,ej,linea=C[cli]; plan=json.load(open(H+f"/Videos-Remotion/sistema/linea-{cli}.json")); BIN="BRUTOS ENTEROS"
base={"proyecto":proy,"ruta":H+"/EDICION/3 PROYECTOS/Lotes de edición/"+proy,"linea":linea,"bin":BIN}
if modo=="preparar":
    px={}
    for v in plan:
        f=glob.glob(H+f"/Videos-Remotion/clientes/{cli}/{v['id']}/{v['id']}.proxies.json")
        if f: px.update(json.load(open(f[0])))
    cfg=dict(base,ejemplo=ej,fuentes=[f for v in plan for f in v["fuentes"]],proxies=px); out=f"{S}/linea-prep-{cli}.jsx"
    open(out,"w").write(open(H+"/Videos-Remotion/premiere/linea-preparar.jsx").read().replace("__CFG__",json.dumps(cfg,ensure_ascii=False)))
else:
    n=int(sys.argv[3]); ini=float(sys.argv[4]); info=json.load(open(sys.argv[5])); v=plan[n-1]
    cfg=dict(base,num=n+1,inicio=ini,dur=v["dur"],titulo=v["titulo"],resumen=v["resumen"],piezas=v["piezas"],marcadores=v["marcadores"],info=info); out=f"{S}/linea-v{n}-{cli}.jsx"
    open(out,"w").write(open(H+"/Videos-Remotion/premiere/linea-video.jsx").read().replace("__CFG__",json.dumps(cfg,ensure_ascii=False)))
print(out)
