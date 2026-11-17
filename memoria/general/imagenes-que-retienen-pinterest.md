---
name: imagenes-que-retienen-pinterest
description: Qué tipo de imágenes de apoyo quiere el usuario en los reels (provocadoras, de Pinterest, no stock) y cómo conseguirlas sin navegador
metadata:
  type: feedback
---

El 2026-10-10, sobre AMIN_1010_01, tras ponerle fotos de banco libre (Openverse), el usuario dijo: "las imágenes sácalas de Pinterest y no es stock normal, que sean imágenes que retengan, que generen controversia, y no simples imágenes de stock".

**Why:** la imagen de apoyo tiene que retener al espectador; una foto de stock neutra no lo hace.

**How to apply:** para imágenes de apoyo buscar ilustración satírica/conceptual con mensaje (escuela como fábrica, mano con hilos, oficinistas con bola y cadena, uno contra la multitud), no fotos genéricas. Interpretación mía: vale para los tres clientes salvo que diga otra cosa. Vía que funcionó sin navegador: las páginas públicas `https://www.pinterest.com/ideas/<tema>/<id>/` (se encuentran con búsqueda web limitada a pinterest.com) traen ~150 imágenes en el HTML; la búsqueda directa de Pinterest y su API devuelven 403 incluso con la sesión de Chrome. Originales en `https://i.pinimg.com/originals/<hash>.jpg`. Son imágenes de terceros sin licencia verificada: anotar el origen en un `fuentes.json` y decirlo una vez. Relacionado: [[estilo-objetivo-julianealborna]], [[como-editar-para-el-usuario]].
