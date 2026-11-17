#!/bin/zsh
# Mantiene el Mac de Amin al día con lo que Luis aprueba en GitHub (main de edicion-motor).
# Lo llama el agente de alumnos antes de cada vuelta (cada 60 s). Nunca pisa trabajo a medias:
# - con cambios sin subir, no hace nada;
# - en main, trae lo nuevo solo si avanza en línea recta (--ff-only);
# - en una rama que ya se fusionó en main, vuelve a main.
cd "${0:a:h}" || exit 0
[ -n "$(git status --porcelain --untracked-files=no)" ] && exit 0
git fetch -q origin main 2>/dev/null || exit 0
rama=$(git branch --show-current)
if [ "$rama" != main ] && git merge-base --is-ancestor HEAD origin/main; then
  git checkout -q main && echo "$(date '+%d-%m %H:%M:%S') rama $rama ya fusionada: vuelvo a main"
  rama=main
fi
if [ "$rama" = main ] && [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  git merge -q --ff-only origin/main && echo "$(date '+%d-%m %H:%M:%S') actualizado a $(git log -1 --format='%h %s' | cut -c1-90)"
fi
exit 0
