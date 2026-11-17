#!/bin/bash
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
for id in "$@"; do [ -s sonido/$id.video.txt ] && continue
ffmpeg -nostdin -v error -i $id.mp4 -vf "fps=4,scale=90:160,signalstats,metadata=print:file=-" -an -f null - 2>/dev/null | awk '/pts_time/{split($0,a,"pts_time:");t=a[2]} /YAVG/{split($0,a,"=");y=a[2]} /SATAVG/{split($0,a,"=");print t,y,a[2]}' > sonido/$id.video.txt; done
