import sys,re,statistics as st
def serie(p):
    v=[]
    for l in open(p):
        m=re.search(r'RMS_level=(-?[\d.]+|-inf)',l)
        if m: v.append(-120.0 if m.group(1)=='-inf' else float(m.group(1)))
    return v
def golpes(v,salto,suelo):
    out=[];i=6
    while i<len(v):
        base=st.median(v[i-6:i-1])
        if v[i]-base>=salto and v[i]>suelo:
            j=i
            while j+1<len(v) and v[j+1]>base+salto/2: j+=1
            out.append((i*0.05,(j-i+1)*0.05,v[i]-base)); i=j+4
        else: i+=1
    return out
for id in sys.argv[1:]:
    o='sonido/'+id
    S={k:serie(f'{o}.{k}.txt') for k in ['sub','grave','voz','agudo','total']}
    n=min(len(x) for x in S.values()); dur=n*0.05
    cortes=[float(x) for x in open(o+'.cortes.txt') if x.strip()]
    voz=S['voz'][:n]; tot=S['total'][:n]
    hab=sorted(voz)[int(n*0.75)]           # nivel de voz tipico
    habla=[v>hab-14 for v in voz]
    # huecos sin voz >=0.3 s
    hue=[];i=0
    while i<n:
        if not habla[i]:
            j=i
            while j<n and not habla[j]: j+=1
            if j-i>=6: hue.append((i,j))
            i=j
        else: i+=1
    cama=[x for a,b in hue for x in tot[a+1:b-1]]
    cama_med=st.median(cama) if cama else None
    voz_tot=st.median([tot[i] for i in range(n) if habla[i]])
    sil=sum(1 for x in tot[:n] if x<-60)*0.05
    gs=golpes(S['sub'][:n],10,-38); ga=golpes(S['agudo'][:n],12,-50)
    cerca=lambda t:any(abs(t-c)<=0.2 for c in cortes)
    gs_c=sum(1 for t,_,_ in gs if cerca(t)); ga_c=sum(1 for t,_,_ in ga if cerca(t))
    cs=sum(1 for c in cortes if any(abs(t-c)<=0.2 for t,_,_ in gs+ga))
    largos=[d for _,d,_ in ga if d>=0.3]; cortos=[d for _,d,_ in ga if d<0.15]
    print(f"{id} dur={dur:.0f}s cortes={len(cortes)} ({dur/max(1,len(cortes)):.1f}s/corte) {open(o+'.lufs.txt').read().strip()}")
    print(f"   voz(total)={voz_tot:.1f}dB cama_en_huecos={cama_med if cama_med is None else round(cama_med,1)}dB dif={None if cama_med is None else round(voz_tot-cama_med,1)}dB  huecos={len(hue)} ({sum(b-a for a,b in hue)*0.05:.0f}s)  silencio_real={sil:.1f}s")
    print(f"   golpes_graves={len(gs)} (cada {dur/max(1,len(gs)):.1f}s; {gs_c} junto a corte)  eventos_agudos={len(ga)} (cortos<0.15s={len(cortos)}, largos>=0.3s={len(largos)}; {ga_c} junto a corte)  cortes_con_sonido={cs}/{len(cortes)}")
