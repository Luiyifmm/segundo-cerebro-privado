// Dónde está la cara en cada momento del vídeo (Vision de Apple, sin instalar nada).
// Uso: swift caras.swift VIDEO [cada_segundos=0.5]
// Escribe en stdout un JSON: {"w":ancho,"h":alto,"muestras":[{"t":s,"caras":[[x,y,ancho,alto,boca], …]}]}
// Coordenadas en fracción del fotograma (0-1), con y desde ARRIBA. «boca» = apertura de los labios / alto
// de la cara: si sube y baja mucho, esa persona está hablando (así se sabe a quién seguir en un pódcast).
import AVFoundation
import Vision
import Foundation

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let paso = args.count > 2 ? Double(args[2])! : 0.5
let asset = AVURLAsset(url: url)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.maximumSize = CGSize(width: 640, height: 640)
gen.requestedTimeToleranceBefore = CMTime(seconds: 0.1, preferredTimescale: 600)
gen.requestedTimeToleranceAfter = CMTime(seconds: 0.1, preferredTimescale: 600)

let dur = CMTimeGetSeconds(asset.duration)
var muestras: [[String: Any]] = []
var w = 0, h = 0
var t = 0.0
while t < dur {
    if let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) {
        w = img.width; h = img.height
        let req = VNDetectFaceLandmarksRequest()
        try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
        let caras = (req.results ?? []).map { r -> [Double] in
            let b = r.boundingBox
            var boca = 0.0
            if let p = r.landmarks?.innerLips?.normalizedPoints, !p.isEmpty {
                let ys = p.map { Double($0.y) }
                boca = ys.max()! - ys.min()!
            }
            return [Double(b.midX), Double(1 - b.midY), Double(b.width), Double(b.height), boca].map { ($0 * 1000).rounded() / 1000 }
        }
        muestras.append(["t": (t * 100).rounded() / 100, "caras": caras])
    }
    t += paso
}
let out: [String: Any] = ["w": w, "h": h, "muestras": muestras]
print(String(data: try! JSONSerialization.data(withJSONObject: out), encoding: .utf8)!)
