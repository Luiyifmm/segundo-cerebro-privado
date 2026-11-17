"""Iconos blancos en PNG con fondo transparente, sacados de la fuente de iconos de Windows 11 (Segoe Fluent Icons),
sin descargar nada. Cada PNG es cuadrado (LADO px) con el icono centrado y del mismo alto óptico (ALTO_ICONO px).
Para elegir códigos: `tabla_glifos.py` saca hojas con todos los glifos y su código.
Iconos tipo «barra de herramientas de AE» (Tanda 04 · 03): selección F8AF, mano F271, lupa E71E, rotar E7AD,
cámara E722, mover E7C2, rectángulo E739, pluma EDFB, pincel E771, borrador E75C, chincheta E718; la «T» con Segoe UI
Semibold. Otros útiles: cuentagotas EF3C, tijeras E8C6, recortar E7A8, capas F156, cubo 3D F158, casa E80F.
Uso: python iconos_png.py carpeta "nombre:codigo" ["nombre:codigo" ...]   (código en hex, o «T» para una letra)
  p. ej.  python iconos_png.py iconos "01 seleccion:F8AF" "02 mano:F271" "09 texto:T"
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

FUENTES = {"icons": r"C:\Windows\Fonts\SegoeIcons.ttf", "texto": r"C:\Windows\Fonts\seguisb.ttf"}
LADO, ALTO_ICONO = 512, 360

salida = sys.argv[1]
os.makedirs(salida, exist_ok=True)
for arg in sys.argv[2:]:
    nombre, cod = arg.rsplit(":", 1)
    if len(cod) == 1:
        ch, fu = cod, "texto"
    else:
        ch, fu = chr(int(cod, 16)), "icons"
    f = ImageFont.truetype(FUENTES[fu], 900)
    lienzo = Image.new("L", (1400, 1400), 0)
    ImageDraw.Draw(lienzo).text((250, 100), ch, font=f, fill=255)
    g = lienzo.crop(lienzo.getbbox())
    k = ALTO_ICONO / max(g.size)
    g = g.resize((max(1, round(g.width * k)), max(1, round(g.height * k))), Image.LANCZOS)
    im = Image.new("RGBA", (LADO, LADO), (255, 255, 255, 0))
    im.paste(Image.new("RGBA", g.size, (255, 255, 255, 255)), ((LADO - g.width) // 2, (LADO - g.height) // 2), g)
    im.save(os.path.join(salida, nombre + ".png"))
print("OK", len(sys.argv) - 2, "iconos en", salida)
