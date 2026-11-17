"""mp-caras.py — cara (cajas + puntos) y pose (hombros) con MediaPipe 1.2.2 (Tasks), entorno aislado. EXPERIMENTAL.

Uso: ~/Videos-Remotion/herramientas/entornos/mediapipe/bin/python mp-caras.py <vídeo> [--fps 10] [--desde 0 --duracion 0] [--json salida.json]
Por fotograma: caja de cara (detector BlazeFace), parte alta de la cabeza aproximada (puntos de la cara: frente),
barbilla, punto medio de los hombros (pose). Tiempos por fotograma para medir velocidad.
Modelos (Apache-2.0) en herramientas/entornos/mediapipe-modelos/.
"""
import argparse, json, os, subprocess, time
import numpy as np, mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision as V

MOD = os.path.expanduser("~/Videos-Remotion/herramientas/entornos/mediapipe-modelos/")
a = argparse.ArgumentParser(); a.add_argument("video"); a.add_argument("--fps", type=float, default=10)
a.add_argument("--desde", type=float, default=0); a.add_argument("--duracion", type=float, default=0); a.add_argument("--json", default="")
o = a.parse_args()
FF, FP = "/Users/luiyi/.local/bin/ffmpeg", "/Users/luiyi/.local/bin/ffprobe"
W, H = [int(x) for x in subprocess.run([FP, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", o.video], capture_output=True, text=True).stdout.strip().split(",")[:2]]
cmd = [FF, "-nostdin", "-v", "error", "-ss", str(o.desde), "-i", o.video] + (["-t", str(o.duracion)] if o.duracion else []) + ["-vf", f"fps={o.fps}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
raw = subprocess.run(cmd, capture_output=True).stdout
# el tamaño real tras autorrotación lo da el número de bytes por fotograma
n_px = len(raw)
fr_bytes = W * H * 3
if n_px % fr_bytes: W, H = H, W
n = len(raw) // (W * H * 3); F = np.frombuffer(raw[: n * W * H * 3], np.uint8).reshape(n, H, W, 3)
t0 = time.time()
det = V.FaceDetector.create_from_options(V.FaceDetectorOptions(base_options=mpt.BaseOptions(model_asset_path=MOD + "blaze_face_short_range.tflite"), min_detection_confidence=0.5))
lmk = V.FaceLandmarker.create_from_options(V.FaceLandmarkerOptions(base_options=mpt.BaseOptions(model_asset_path=MOD + "face_landmarker.task"), num_faces=2))
pose = V.PoseLandmarker.create_from_options(V.PoseLandmarkerOptions(base_options=mpt.BaseOptions(model_asset_path=MOD + "pose_landmarker_lite.task")))
t_carga = time.time() - t0
out, tiempos = [], []
for i in range(n):
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(F[i]))
    t = time.time()
    d = det.detect(img); l = lmk.detect(img); p = pose.detect(img)
    tiempos.append(time.time() - t)
    caras = [[b.bounding_box.origin_x, b.bounding_box.origin_y, b.bounding_box.origin_x + b.bounding_box.width, b.bounding_box.origin_y + b.bounding_box.height, round(b.categories[0].score, 2)] for b in d.detections]
    frente = barbilla = None
    if l.face_landmarks:
        pts = l.face_landmarks[0]; frente = int(pts[10].y * H); barbilla = int(pts[152].y * H)
    hombros = None
    if p.pose_landmarks:
        q = p.pose_landmarks[0]; hombros = [int((q[11].x + q[12].x) / 2 * W), int((q[11].y + q[12].y) / 2 * H)]
    out.append({"t": round(o.desde + i / o.fps, 3), "caras": caras, "frente_y": frente, "barbilla_y": barbilla, "hombros": hombros})
res = {"video": o.video, "w": W, "h": H, "fotogramas": n, "s_carga_modelos": round(t_carga, 2), "ms_por_fotograma": round(1000 * float(np.mean(tiempos)), 1) if tiempos else None, "datos": out}
if o.json: json.dump(res, open(o.json, "w"))
print(json.dumps({k: v for k, v in res.items() if k != "datos"}))
print("cara detectada en", sum(1 for x in out if x["caras"]), "/", n, "· puntos de cara en", sum(1 for x in out if x["frente_y"]), "· hombros en", sum(1 for x in out if x["hombros"]))
