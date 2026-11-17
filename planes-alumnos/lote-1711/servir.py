# Sirve la carpeta del lote en http://localhost:8765 con soporte de rangos (Safari no reproduce vídeo sin respuestas 206).
# Uso: python3 servir.py [carpeta] [puerto]   → abre http://localhost:8765/auditoria.html
import os, sys, re, http.server, socketserver, webbrowser
RAIZ = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))); PUERTO = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=RAIZ, **k)
    def log_message(self, *a): pass
    def send_head(self):
        rng = self.headers.get('Range'); ruta = self.translate_path(self.path)
        if not rng or not os.path.isfile(ruta): return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)', rng); tam = os.path.getsize(ruta)
        ini = int(m.group(1)) if m.group(1) else max(0, tam - int(m.group(2) or 0)); fin = int(m.group(2)) if (m.group(1) and m.group(2)) else tam - 1
        fin = min(fin, tam - 1); f = open(ruta, 'rb'); f.seek(ini)
        self.send_response(206); self.send_header('Content-Type', self.guess_type(ruta)); self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {ini}-{fin}/{tam}'); self.send_header('Content-Length', str(fin - ini + 1)); self.end_headers()
        self._resto = fin - ini + 1; return f
    def copyfile(self, src, dst):
        n = getattr(self, '_resto', None)
        if n is None: return super().copyfile(src, dst)
        while n > 0:
            b = src.read(min(1 << 16, n))
            if not b: break
            dst.write(b); n -= len(b)
        self._resto = None
class S(socketserver.ThreadingMixIn, http.server.HTTPServer): daemon_threads = True; allow_reuse_address = True
if __name__ == '__main__':
    with S(('127.0.0.1', PUERTO), H) as s:
        print(f'http://localhost:{PUERTO}/auditoria.html', flush=True)
        if '--abrir' in sys.argv: webbrowser.open(f'http://localhost:{PUERTO}/auditoria.html')
        s.serve_forever()
