#!/bin/bash
# uso: medir.sh <id>  -> sonido/<id>.{sub,grave,voz,agudo,total}.txt (RMS cada 50 ms), cortes y LUFS
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
id="$1"; o="sonido/$id"
b(){ ffmpeg -nostdin -v error -i "$id.mp4" -vn -ac 1 -ar 44100 -af "$2asetnsamples=2205,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=$o.$1.txt" -f null - ; }
b sub "highpass=f=30,lowpass=f=110,lowpass=f=110," &
b grave "highpass=f=110,lowpass=f=300," &
b voz "highpass=f=300,lowpass=f=3400," &
b agudo "highpass=f=6000,highpass=f=6000," &
b total "" &
wait
ffmpeg -nostdin -i "$id.mp4" -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$o.cortes.txt"
ffmpeg -nostdin -i "$id.mp4" -vn -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|LRA:|Peak:)" | tr -s ' ' | tr '\n' ';' > "$o.lufs.txt"
