# Convierte las conversaciones de Claude Code (~/.claude/projects/*/*.jsonl) en Markdown legible para otra IA.
# Guarda: mensajes del usuario, respuestas de Claude y una línea por herramienta usada (nombre + descripción/entrada corta).
# Quita: imágenes, salidas de herramientas, razonamiento interno, recordatorios del sistema. Tapa secretos y correos.
# Uso: python3 chats_a_md.py <destino> [--proyectos ~/.claude/projects]
import os, sys, json, re, glob, datetime
DEST = os.path.expanduser(sys.argv[1]); SRC = os.path.expanduser(sys.argv[sys.argv.index('--proyectos') + 1]) if '--proyectos' in sys.argv else os.path.expanduser('~/.claude/projects')
SECRETOS = [(r'gh[pousr]_[A-Za-z0-9]{20,}', '<token>'), (r'sk-(ant-|proj-)?[A-Za-z0-9_-]{20,}', '<clave>'), (r'AKIA[0-9A-Z]{16}', '<clave>'),
            (r'postgres(ql)?://\S+', '<url-bd>'), (r'-----BEGIN[^-]*PRIVATE KEY-----[\s\S]*?-----END[^-]*-----', '<clave-privada>'),
            (r'X-Amz-(Signature|Credential)=[^&\s"]+', r'X-Amz-\1=<firma>'), (r'("?(S3_SECRET|S3_KEY|DATABASE_URL|password|api_key|token)"?\s*[:=]\s*)"[^"<]{8,}"', r'\1"<oculto>"'),
            (r'[\w.+-]+@(gmail|hotmail|outlook|icloud|yahoo)\.com', '<correo>')]
def limpia(t):
    for a, b in SECRETOS: t = re.sub(a, b, t)
    t = re.sub(r'<system-reminder>[\s\S]*?</system-reminder>', '', t)
    return t.strip()
def texto(c):
    if isinstance(c, str): return c
    out = []
    for b in c or []:
        if b.get('type') == 'text': out.append(b['text'])
        elif b.get('type') == 'tool_use':
            i = b.get('input', {}); d = i.get('description') or i.get('action_summary') or i.get('file_path') or i.get('url') or i.get('command') or i.get('query') or json.dumps(i, ensure_ascii=False)
            out.append(f"🔧 `{b.get('name')}` — {str(d)[:220]}")
    return '\n'.join(out)
n = 0
for f in sorted(glob.glob(os.path.join(SRC, '*', '*.jsonl'))):
    proy = os.path.basename(os.path.dirname(f)).replace('-Users-luiyi', '').strip('-') or 'inicio'
    filas, t0 = [], None
    for l in open(f, errors='ignore'):
        try: e = json.loads(l)
        except Exception: continue
        if e.get('type') not in ('user', 'assistant') or e.get('isMeta'): continue
        m = e.get('message', {}); c = m.get('content')
        if e['type'] == 'user' and isinstance(c, list) and all(b.get('type') == 'tool_result' for b in c): continue
        t = limpia(texto(c))
        if not t: continue
        if e.get('isCompactSummary') or t.startswith('This session is being continued'): t = '[RESUMEN DE CONTEXTO]\n' + t
        t0 = t0 or e.get('timestamp', '')[:16]
        filas.append(('**Luis:**' if e['type'] == 'user' else '**Claude:**') + '\n' + t)
    if not filas: continue
    d = os.path.join(DEST, proy[:90]); os.makedirs(d, exist_ok=True)
    nombre = f"{(t0 or '0000')[:10]} {os.path.basename(f)[:8]}.md"
    open(os.path.join(d, nombre), 'w').write(f"# Chat {os.path.basename(f)[:8]} · {proy}\nInicio: {t0} UTC\n\n" + '\n\n---\n\n'.join(filas) + '\n'); n += 1
print(n, 'chats en', DEST)
