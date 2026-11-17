"""Renderiza emojis EN COLOR (fuente Segoe UI Emoji de Windows) a PNG con transparencia,
incluidos tonos de piel y secuencias con ZWJ (sin necesitar libraqm).
Truco: con fontTools se buscan las ligaduras GSUB de la secuencia y el glifo resultante
se asigna a un código de uso privado (U+F0000...) en una copia de la fuente; Pillow pinta esa copia con embedded_color.
uso: python emojis.py carpeta_salida tam nombre=emoji nombre=emoji ..."""
import sys, os
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

SRC = r"C:\Windows\Fonts\seguiemj.ttf"
out, size = sys.argv[1], int(sys.argv[2])
os.makedirs(out, exist_ok=True)
tmp_font = os.path.join(out, "_seguiemj_pua.ttf")

f = TTFont(SRC)
cmap = f.getBestCmap()
ligs = {}  # tupla de glifos -> glifo ligadura
for lk in f["GSUB"].table.LookupList.Lookup:
    for st in lk.SubTable:
        if lk.LookupType == 7:
            st = st.ExtSubTable
        if getattr(st, "ligatures", None):
            for first, lst in st.ligatures.items():
                for lg in lst:
                    ligs[(first,) + tuple(lg.Component)] = lg.LigGlyph


def glyph_for(seq):
    g = [cmap[ord(ch)] for ch in seq if ord(ch) in cmap and ord(ch) != 0xFE0F]
    changed = True
    while changed and len(g) > 1:  # aplica ligaduras (la más larga primero) hasta que no cambie
        changed = False
        for n in range(len(g), 1, -1):
            for i in range(0, len(g) - n + 1):
                k = tuple(g[i:i + n])
                if k in ligs:
                    g = g[:i] + [ligs[k]] + g[i + n:]
                    changed = True
                    break
            if changed:
                break
    return g[0] if len(g) == 1 else None


items = []
for i, arg in enumerate(sys.argv[3:]):
    name, emo = arg.split("=", 1)
    gl = glyph_for(emo)
    if gl is None:
        print("SIN LIGADURA:", name)
        continue
    items.append((name, 0xF0000 + i, gl))
for t in f["cmap"].tables:
    if t.isUnicode() and t.format == 12:
        for _, cp, gl in items:
            t.cmap[cp] = gl
f.save(tmp_font)

font = ImageFont.truetype(tmp_font, size)
for name, cp, gl in items:
    im = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((size // 4, size // 4), chr(cp), font=font, embedded_color=True)
    bb = im.getbbox()
    if bb:
        m = size // 16
        im = im.crop((max(0, bb[0] - m), max(0, bb[1] - m), bb[2] + m, bb[3] + m))
    p = os.path.join(out, name + ".png")
    im.save(p)
    print(p, im.size, gl)
os.remove(tmp_font)
