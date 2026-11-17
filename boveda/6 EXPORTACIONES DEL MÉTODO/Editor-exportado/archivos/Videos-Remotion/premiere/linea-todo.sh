#!/bin/zsh
# Uso: linea-todo.sh <cliente> <fin del ejemplo en s>   → coloca los vídeos del plan uno tras otro, con 30 s de separación
cd ~/Videos-Remotion/premiere; S=/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad; cli=$1; fin=$2
n=$(python3 -I -c "import json,os;print(len(json.load(open(os.path.expanduser('~/Videos-Remotion/sistema/linea-$cli.json')))))")
for i in $(seq 1 $n); do ini=$(python3 -I -c "import math;print(math.ceil($fin+30))"); f=$(python3 -I linea.py video $cli $i $ini $S/info-$cli.json); ./pr.sh "$f" 900 > $S/linea-res-$cli-$i.json
  fin=$(python3 -I -c "
import json
d=json.load(open('$S/linea-res-$cli-$i.json')); r=d.get('result',d)
try: r=json.loads(r) if isinstance(r,str) else r
except Exception: pass
import sys
if not isinstance(r,dict) or 'fin' not in r: sys.stderr.write('VIDEO $i: '+str(r)[:300]+'\n'); print(-1)
else: sys.stderr.write('VIDEO $i en $ini s: '+' | '.join(r['hecho'])+' ERR:'+str(r['errores'][:3])+'\n'); print(r['fin'])")
  [ "$fin" = "-1" ] && break
done
