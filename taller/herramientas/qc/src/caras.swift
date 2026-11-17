// caras: detecta caras en imágenes con Vision de Apple (sin dependencias externas).
// Uso: caras <imagen1> [imagen2 …]  → una línea JSON por imagen: {"img":…, "w":…, "h":…, "caras":[[x0,y0,x1,y1,confianza],…]} en píxeles, origen arriba-izquierda.
import Foundation
import Vision
import AppKit
for ruta in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: ruta), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("{\"img\":\"\(ruta)\",\"error\":\"no se pudo leer\"}"); continue }
    let w = Double(cg.width), h = Double(cg.height)
    let req = VNDetectFaceRectanglesRequest()
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    let caras = (req.results ?? []).map { o -> String in
        let b = o.boundingBox
        let x0 = b.minX * w, x1 = b.maxX * w, y0 = (1 - b.maxY) * h, y1 = (1 - b.minY) * h
        return String(format: "[%.0f,%.0f,%.0f,%.0f,%.2f]", x0, y0, x1, y1, o.confidence)
    }
    print("{\"img\":\"\(ruta)\",\"w\":\(Int(w)),\"h\":\(Int(h)),\"caras\":[\(caras.joined(separator: ","))]}")
}
