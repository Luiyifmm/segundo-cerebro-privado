#!/usr/bin/env python3
"""Consumo de una o varias sesiones de Claude Code (fase 8B.3, 08-11). Solo LEE los registros .jsonl: no los modifica.

Uso:
  consumo.py <sesion.jsonl | id de sesión> [...] [--desde ISO] [--hasta ISO] [--hasta-peticion TEXTO]
             [--peticiones 10] [--json salida.json] [--md salida.md] [--exportaciones CARPETA]
  consumo.py --buscar "6887-08"      lista las sesiones cuyos mensajes del usuario mencionan ese texto

Separa tres cosas que NO son lo mismo:
  1. CONTEXTO: lo que el modelo lee en cada llamada (entrada + caché escrita + caché leída). Mide el tamaño de la
     conversación; no es dinero.
  2. TOKENS FACTURABLES por tipo: entrada sin caché, escritura de caché (5 min / 1 h), lectura de caché y salida
     (incluye el razonamiento). Cada tipo tiene un precio distinto.
  3. COSTE ESTIMADO: tokens × precios.json. Es el equivalente de la API, no lo que se paga con suscripción.
Sin dependencias: solo la biblioteca estándar de Python.
"""
import argparse, collections, glob, json, os, re, statistics, sys
from datetime import datetime

PROY = os.path.expanduser("~/.claude/projects")
AQUI = os.path.dirname(os.path.abspath(__file__))
HUECO_ACTIVO = 30 * 60  # s: pausas más largas no cuentan como tiempo activo


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")) if s else None


def ruta_sesion(x):
    if os.path.isfile(x):
        return x
    r = glob.glob(os.path.join(PROY, "*", x + ".jsonl"))
    if not r:
        sys.exit(f"ERROR: no encuentro la sesión {x}")
    return r[0]


def texto_usuario(m):
    c = m.get("content")
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        if any(isinstance(x, dict) and x.get("type") == "tool_result" for x in c):
            return None
        return " ".join(x.get("text", "") for x in c if isinstance(x, dict) and x.get("type") == "text")
    return None


def es_peticion(e):
    """Mensaje escrito por el usuario (no avisos, no resultados de herramientas, no resúmenes de compactación)."""
    if e.get("type") != "user" or e.get("isMeta") or e.get("isCompactSummary"):
        return None
    t = texto_usuario(e.get("message") or {})
    if t is None:
        return None
    o = e.get("origin")
    kind = o.get("kind") if isinstance(o, dict) else o
    if kind is not None:
        return t if kind == "human" else None
    s = t.strip()
    return t if s and not s.startswith(("<task-notification", "<local-command", "<command-")) else None


def resumen_peticion(t):
    t = re.sub(r"<system-reminder>.*?</system-reminder>", "", t, flags=re.S)
    t = re.sub(r"</?pasted_content[^>]*>", "", t)
    return " ".join(t.split())[:70]


def buscar(texto):
    for f in sorted(glob.glob(os.path.join(PROY, "*", "*.jsonl")), key=os.path.getmtime):
        n = 0
        with open(f, encoding="utf-8", errors="replace") as h:
            for line in h:
                if texto not in line or '"type":"user"' not in line:
                    continue
                try:
                    e = json.loads(line)
                except Exception:
                    continue
                t = es_peticion(e)
                if t and texto in t:
                    n += 1
        if n:
            print(f"{os.path.basename(f)[:-6]}  {n} peticiones lo mencionan  · {os.path.getsize(f)//1048576} MB · {f}")


def categoria_bash(cmd):
    if "correr-receta" in cmd:
        m = re.search(r"correr-receta\.sh\s+[\"']?(?:\S*/)?([\w.-]+\.jsx)", cmd)
        return "receta " + (m.group(1) if m else "(nombre en variable)")
    for clave, nombre in (("pr.sh", "pr.sh (script propio)"), ("hoja.sh", "hoja.sh"), ("transcribir", "transcribir"),
                          ("ffmpeg", "ffmpeg"), ("ffprobe", "ffprobe"), ("python", "python"), ("node", "node"),
                          ("git ", "git")):
        if clave in cmd:
            return nombre
    return "otro"


def analizar(rutas, desde=None, hasta=None, hasta_peticion=None, top=10):
    precios = json.load(open(os.path.join(AQUI, "precios.json")))
    R = dict(sesiones=set(), periodo=[None, None], llamadas=collections.Counter(), peticiones=[],
             compactaciones=0, herramientas=collections.Counter(), bash=collections.Counter(),
             tok=collections.defaultdict(collections.Counter), razonamiento=0, busquedas_web=0,
             ctx=[], imagenes_leidas=0, imagenes_devueltas=0, errores_herramienta=0,
             scripts_nuevos=set(), exportaciones=collections.Counter(), comandos=collections.Counter(),
             cost_state=[], cortado_en=None)
    vistos, marcas, id2tool, scripts_export = set(), [], {}, set()
    actual = None  # petición en curso
    for ruta in rutas:
        parar = False
        with open(ruta, encoding="utf-8", errors="replace") as h:
            for line in h:
                try:
                    e = json.loads(line)
                except Exception:
                    continue
                t = e.get("timestamp")
                if e.get("type") == "cost-state":
                    R["cost_state"].append(e)
                    continue
                if t and ((desde and t < desde) or (hasta and t > hasta)):
                    continue
                pt = es_peticion(e)
                if pt is not None and hasta_peticion and hasta_peticion in pt:
                    R["cortado_en"] = (t, resumen_peticion(pt))
                    parar = True
                    break
                if e.get("sessionId"):
                    R["sesiones"].add(e["sessionId"])
                if t:
                    marcas.append(ts(t))
                    R["periodo"][0] = R["periodo"][0] or t
                    R["periodo"][1] = t
                if e.get("isCompactSummary"):
                    R["compactaciones"] += 1
                if pt is not None:
                    actual = dict(hora=t, texto=resumen_peticion(pt), llamadas=0, contexto=0, coste=0.0)
                    R["peticiones"].append(actual)
                m = e.get("message") or {}
                if e.get("type") == "assistant":
                    mid = m.get("id") or e.get("requestId")
                    contenido = m.get("content") or []
                    if mid and mid not in vistos:
                        vistos.add(mid)
                        u = m.get("usage") or {}
                        mod = m.get("model") or "?"
                        if mod == "<synthetic>":
                            continue
                        R["llamadas"][mod] += 1
                        cc = u.get("cache_creation") or {}
                        w5 = cc.get("ephemeral_5m_input_tokens", 0) or 0
                        w1 = cc.get("ephemeral_1h_input_tokens", 0) or 0
                        wt = u.get("cache_creation_input_tokens", 0) or 0
                        if wt and not (w5 or w1):
                            w5 = wt  # registro antiguo sin desglose: se supone 5 min
                        k = R["tok"][mod]
                        k["entrada"] += u.get("input_tokens", 0) or 0
                        k["escritura_5m"] += w5
                        k["escritura_1h"] += w1
                        k["lectura_cache"] += u.get("cache_read_input_tokens", 0) or 0
                        k["salida"] += u.get("output_tokens", 0) or 0
                        R["razonamiento"] += (u.get("output_tokens_details") or {}).get("thinking_tokens", 0) or 0
                        R["busquedas_web"] += (u.get("server_tool_use") or {}).get("web_search_requests", 0) or 0
                        ctx = (u.get("input_tokens", 0) or 0) + wt + (u.get("cache_read_input_tokens", 0) or 0)
                        R["ctx"].append(ctx)
                        if actual:
                            actual["llamadas"] += 1
                            actual["contexto"] += ctx
                            p = precios["modelos"].get(mod)
                            if p:
                                actual["coste"] += sum(u2 * p[c] for c, u2 in (
                                    ("entrada", u.get("input_tokens", 0) or 0), ("escritura_5m", w5),
                                    ("escritura_1h", w1), ("lectura_cache", u.get("cache_read_input_tokens", 0) or 0),
                                    ("salida", u.get("output_tokens", 0) or 0))) / 1e6
                    for c in contenido:
                        if not (isinstance(c, dict) and c.get("type") == "tool_use"):
                            continue
                        n = c.get("name", "?")
                        R["herramientas"][n] += 1
                        id2tool[c.get("id")] = n
                        inp = c.get("input") or {}
                        if n == "Bash":
                            cmd = inp.get("command", "")
                            cat = categoria_bash(cmd)
                            R["bash"][cat] += 1
                            R["comandos"][cmd.strip()] += 1
                            if cat == "receta exportar.jsx":
                                R["exportaciones"]["WAV (receta)" if '\\"audio\\":true' in cmd or '"audio":true' in cmd else "vídeo (receta)"] += 1
                            for s in scripts_export:
                                if "pr.sh" in cmd and os.path.basename(s) in cmd:
                                    R["exportaciones"]["script propio"] += 1
                            for mm in re.finditer(r"cat\s*>\s*[\"']?([^\s\"'<]+\.jsx)", cmd):
                                R["scripts_nuevos"].add(mm.group(1))
                                if "exportAsMediaDirect" in cmd:
                                    scripts_export.add(mm.group(1))
                        elif n in ("Write",):
                            fp = inp.get("file_path", "")
                            if fp.endswith(".jsx"):
                                R["scripts_nuevos"].add(fp)
                                if "exportAsMediaDirect" in (inp.get("content") or "") and "/recetas/" not in fp:
                                    scripts_export.add(fp)
                        elif n == "Read" and re.search(r"\.(png|jpe?g|webp|gif)$", inp.get("file_path", ""), re.I):
                            R["imagenes_leidas"] += 1
                elif e.get("type") == "user":
                    c = m.get("content")
                    if isinstance(c, list):
                        for x in c:
                            if isinstance(x, dict) and x.get("type") == "tool_result":
                                if x.get("is_error"):
                                    R["errores_herramienta"] += 1
                                cc = x.get("content")
                                if isinstance(cc, list) and any(isinstance(y, dict) and y.get("type") == "image" for y in cc):
                                    R["imagenes_devueltas"] += 1
        if parar:
            break
    # Tiempo activo: suma de huecos cortos entre entradas consecutivas
    marcas.sort()
    activo = sum((b - a).total_seconds() for a, b in zip(marcas, marcas[1:]) if (b - a).total_seconds() <= HUECO_ACTIVO)
    # Coste
    coste, sin_precio = {}, []
    for mod, k in R["tok"].items():
        p = precios["modelos"].get(mod)
        if not p:
            sin_precio.append(mod)
            continue
        coste[mod] = {c: round(k[c] * p[c] / 1e6, 4) for c in ("entrada", "escritura_5m", "escritura_1h", "lectura_cache", "salida")}
    coste_web = R["busquedas_web"] * precios["busqueda_web_por_1000"] / 1000
    total_coste = round(sum(sum(v.values()) for v in coste.values()) + coste_web, 2)
    ctx = R["ctx"]
    repetidos = [(n, c[:90]) for c, n in R["comandos"].most_common(8) if n > 1]
    out = {
        "fuentes": [os.path.basename(r) for r in rutas],
        "periodo": R["periodo"], "cortado_en": R["cortado_en"],
        "actividad": {
            "sesiones": len(R["sesiones"]), "peticiones": len(R["peticiones"]),
            "llamadas_al_modelo": dict(R["llamadas"]), "compactaciones": R["compactaciones"],
            "horas_activas": round(activo / 3600, 1),
        },
        "contexto": {
            "llamadas": len(ctx),
            "media_por_llamada": int(statistics.mean(ctx)) if ctx else 0,
            "mediana_por_llamada": int(statistics.median(ctx)) if ctx else 0,
            "maximo": max(ctx) if ctx else 0,
            "total_procesado": sum(ctx),
            "nota": "tamaño de lo que el modelo lee en cada llamada; no es dinero",
        },
        "tokens_facturables": {mod: dict(k) for mod, k in R["tok"].items()},
        "razonamiento_incluido_en_salida": R["razonamiento"],
        "busquedas_web": R["busquedas_web"],
        "coste_estimado_usd": {"por_modelo_y_tipo": coste, "busquedas_web": round(coste_web, 4), "total": total_coste,
                               "modelos_sin_precio": sin_precio, "aviso": precios["_aviso"]},
        "operaciones": {
            "herramientas": dict(R["herramientas"].most_common()),
            "bash_por_tipo": dict(R["bash"].most_common()),
            "scripts_jsx_nuevos": len([x for x in R["scripts_nuevos"] if "/recetas/" not in x]),
            "recetas_creadas_o_reescritas": len([x for x in R["scripts_nuevos"] if "/recetas/" in x]),
            "exportaciones": dict(R["exportaciones"]),
            "imagenes_leidas": R["imagenes_leidas"], "imagenes_devueltas": R["imagenes_devueltas"],
            "errores_de_herramienta": R["errores_herramienta"],
            "comandos_identicos_repetidos": repetidos,
        },
        "peticiones_mas_caras": sorted(
            [dict(p, coste=round(p["coste"], 2)) for p in R["peticiones"]], key=lambda p: -p["coste"])[:top],
    }
    # Comprobación contra el coste que calcula la app (solo vale si se mide la sesión entera, sin cortes)
    if R["cost_state"] and not (desde or hasta_peticion) and len(rutas) == 1:
        app = R["cost_state"][-1]
        mu = (app.get("modelUsage") or {})
        out["comprobacion_app"] = {"coste_app_usd": round(app.get("totalCostUSD", 0), 4),
                                   "lectura_cache_app": sum(v.get("cacheReadInputTokens", 0) for v in mu.values()),
                                   "nota": "cost-state = foto que guarda la app en un momento; para comparar, cortar con --hasta en esa hora"}
    return out


def contar_exportaciones(carpeta, periodo):
    """Archivos de vídeo/audio de la carpeta modificados dentro del periodo (dato de disco, verificable)."""
    a, b = ts(periodo[0]).timestamp(), ts(periodo[1]).timestamp()
    c, peso = collections.Counter(), 0
    for raiz, _, fs in os.walk(carpeta):
        for f in fs:
            ext = f.rsplit(".", 1)[-1].lower()
            if ext in ("mp4", "mov", "wav", "m4a", "mp3"):
                q = os.path.join(raiz, f)
                if a <= os.path.getmtime(q) <= b + 3600:
                    c[ext] += 1; peso += os.path.getsize(q)
    return {"carpeta": carpeta, "por_tipo": dict(c), "gb": round(peso / 1e9, 2),
            "nota": "solo cuenta lo que sigue en la carpeta; lo sobrescrito o movido no aparece"}


def mil(n):
    return f"{n/1e6:.2f} M" if n >= 1e6 else f"{n/1e3:.1f} k" if n >= 1e3 else str(n)


def imprimir(o):
    a, c, op = o["actividad"], o["contexto"], o["operaciones"]
    print(f"Fuentes: {', '.join(o['fuentes'])}")
    print(f"Periodo: {o['periodo'][0]} → {o['periodo'][1]}" + (f"  (cortado antes de: «{o['cortado_en'][1]}» {o['cortado_en'][0]})" if o["cortado_en"] else ""))
    print(f"\n1. ACTIVIDAD · sesiones {a['sesiones']} · peticiones {a['peticiones']} · llamadas al modelo {a['llamadas_al_modelo']} · compactaciones {a['compactaciones']} · horas activas ≈ {a['horas_activas']}")
    print(f"\n2. CONTEXTO (no es dinero) · media {mil(c['media_por_llamada'])} por llamada · mediana {mil(c['mediana_por_llamada'])} · máx {mil(c['maximo'])} · total procesado {mil(c['total_procesado'])}")
    print("\n3. TOKENS FACTURABLES (por tipo)")
    for mod, k in o["tokens_facturables"].items():
        print(f"   {mod}: entrada {mil(k['entrada'])} · escritura caché 5m {mil(k['escritura_5m'])} · 1h {mil(k['escritura_1h'])} · lectura caché {mil(k['lectura_cache'])} · salida {mil(k['salida'])}")
    print(f"   (la salida incluye {mil(o['razonamiento_incluido_en_salida'])} de razonamiento) · búsquedas web {o['busquedas_web']}")
    ce = o["coste_estimado_usd"]
    print(f"\n4. COSTE ESTIMADO (equivalente API, no lo que pagas con suscripción): {ce['total']} USD")
    for mod, v in ce["por_modelo_y_tipo"].items():
        print(f"   {mod}: " + " · ".join(f"{k} {x:.2f}" for k, x in v.items()))
    if ce["modelos_sin_precio"]:
        print(f"   SIN PRECIO (no sumados): {ce['modelos_sin_precio']}")
    if "comprobacion_app" in o:
        ca = o["comprobacion_app"]
        print(f"   comprobación: la app guardó {ca['coste_app_usd']} USD (lectura de caché {mil(ca['lectura_cache_app'])}) en su última foto de la sesión")
    print(f"\n5. OPERACIONES · scripts .jsx de sesión {op['scripts_jsx_nuevos']} · recetas creadas/reescritas {op['recetas_creadas_o_reescritas']} · exportaciones {op['exportaciones']} · imágenes leídas {op['imagenes_leidas']} (devueltas {op['imagenes_devueltas']}) · errores de herramienta {op['errores_de_herramienta']}")
    print(f"   herramientas: {op['herramientas']}")
    print(f"   bash: {op['bash_por_tipo']}")
    if op["comandos_identicos_repetidos"]:
        print("   comandos idénticos repetidos: " + " | ".join(f"{n}× {c}" for n, c in op["comandos_identicos_repetidos"]))
    print("\n6. PETICIONES MÁS CARAS")
    for p in o["peticiones_mas_caras"]:
        print(f"   {p['coste']:>7.2f} USD · {p['llamadas']:>3} llamadas · contexto {mil(p['contexto']):>9} · {p['hora'][:16]} · {p['texto']}")


def fila_md(o, nombre):
    a, c, op = o["actividad"], o["contexto"], o["operaciones"]
    ll = sum(a["llamadas_al_modelo"].values())
    return (f"| {nombre} | {a['sesiones']} | {a['peticiones']} | {ll} | {a['compactaciones']} | {mil(c['media_por_llamada'])} | "
            f"{mil(c['total_procesado'])} | {o['coste_estimado_usd']['total']} | {op['scripts_jsx_nuevos']} | "
            f"{sum(v for k, v in op['bash_por_tipo'].items() if k.startswith('receta'))} | "
            f"{sum(o.get('exportaciones_en_disco', {}).get('por_tipo', {}).values()) or str(sum(op['exportaciones'].values())) + ' (comandos)'} | {op['imagenes_leidas']} |")


def no_sobrescribir(p):
    if os.path.exists(p):
        sys.exit(f"ERROR: ya existe {p} (no sobrescribo)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sesiones", nargs="*")
    ap.add_argument("--buscar")
    ap.add_argument("--desde"); ap.add_argument("--hasta"); ap.add_argument("--hasta-peticion")
    ap.add_argument("--peticiones", type=int, default=10)
    ap.add_argument("--exportaciones", help="carpeta donde se exportó: cuenta los archivos del periodo")
    ap.add_argument("--json"); ap.add_argument("--md"); ap.add_argument("--nombre", default="vídeo")
    A = ap.parse_args()
    if A.buscar:
        buscar(A.buscar); sys.exit()
    if not A.sesiones:
        ap.error("falta la sesión")
    for p in (A.json, A.md):
        if p: no_sobrescribir(p)
    o = analizar([ruta_sesion(x) for x in A.sesiones], A.desde, A.hasta, A.hasta_peticion, A.peticiones)
    if A.exportaciones:
        o["exportaciones_en_disco"] = contar_exportaciones(A.exportaciones, o["periodo"])
    imprimir(o)
    if "exportaciones_en_disco" in o:
        e = o["exportaciones_en_disco"]
        print(f"\n7. EXPORTACIONES EN DISCO (verificable): {e['por_tipo']} · {e['gb']} GB · {e['carpeta']}")
    if A.json:
        json.dump(o, open(A.json, "w"), ensure_ascii=False, indent=1); print(f"\njson: {A.json}")
    if A.md:
        open(A.md, "w").write(fila_md(o, A.nombre) + "\n"); print(f"fila md: {A.md}")
