// sujeto: analiza a la persona de una imagen con Vision de Apple (sin dependencias externas, sin instalar nada).
// Uso: sujeto <imagen1> [imagen2 …]  → una línea JSON por imagen, coordenadas en PÍXELES con origen arriba-izquierda:
//   caras:   [{caja:[x0,y0,x1,y1], conf, yaw, roll}]             (yaw en grados: + = la cara gira hacia la derecha de la imagen)
//   cuerpo:  {articulacion:[x,y,conf]}                           (VNDetectHumanBodyPose: nariz, ojos, hombros, codos, muñecas…)
//   manos:   [{lado, muneca, indice_punta, indice_base, extendidos:[pulgar,indice,medio,anular,menique], apunta:[dx,dy]|null, conf}]
//   silueta: {caja:[x0,y0,x1,y1], ocupacion:[[fila de 12 valores 0–1] × 20]}   (máscara de persona en rejilla 12×20)
// "apunta" solo se da si el ÍNDICE está extendido y los otros tres dedos NO (gesto de señalar); si no, null. No se inventa.
import Foundation
import Vision
import AppKit
func f(_ v: Double) -> String { String(format: "%.1f", v) }
for ruta in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: ruta), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("{\"img\":\"\(ruta)\",\"error\":\"no se pudo leer\"}"); continue }
    let w = Double(cg.width), h = Double(cg.height)
    func P(_ p: CGPoint) -> (Double, Double) { (Double(p.x) * w, (1 - Double(p.y)) * h) }
    let rCara = VNDetectFaceRectanglesRequest(); rCara.revision = VNDetectFaceRectanglesRequestRevision3
    let rCuerpo = VNDetectHumanBodyPoseRequest()
    let rMano = VNDetectHumanHandPoseRequest(); rMano.maximumHandCount = 2
    let rSil = VNGeneratePersonSegmentationRequest(); rSil.qualityLevel = .balanced; rSil.outputPixelFormat = kCVPixelFormatType_OneComponent8
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([rCara, rCuerpo, rMano, rSil])
    var out: [String] = []
    out.append("\"caras\":[" + (rCara.results ?? []).map { o in
        let b = o.boundingBox
        let yaw = (o.yaw?.doubleValue ?? 0) * 180 / .pi, roll = (o.roll?.doubleValue ?? 0) * 180 / .pi
        return "{\"caja\":[\(f(b.minX*w)),\(f((1-b.maxY)*h)),\(f(b.maxX*w)),\(f((1-b.minY)*h))],\"conf\":\(f(Double(o.confidence))),\"yaw\":\(f(yaw)),\"roll\":\(f(roll))}"
    }.joined(separator: ",") + "]")
    var cuerpo: [String] = []
    if let ob = rCuerpo.results?.first, let pts = try? ob.recognizedPoints(.all) {
        for (k, p) in pts where p.confidence > 0.2 { let (x, y) = P(p.location); cuerpo.append("\"\(k.rawValue.rawValue)\":[\(f(x)),\(f(y)),\(f(Double(p.confidence)))]") }
    }
    out.append("\"cuerpo\":{" + cuerpo.joined(separator: ",") + "}")
    var manos: [String] = []
    for ob in rMano.results ?? [] {
        guard let pts = try? ob.recognizedPoints(.all), let mu = pts[.wrist], mu.confidence > 0.3 else { continue }
        func d(_ a: VNRecognizedPoint, _ b: VNRecognizedPoint) -> Double { let (ax, ay) = P(a.location), (bx, by) = P(b.location); return hypot(ax - bx, ay - by) }
        // dedo extendido = la punta está claramente más lejos de la muñeca que su articulación media
        let dedos: [(VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName)] = [(.thumbTip, .thumbIP), (.indexTip, .indexPIP), (.middleTip, .middlePIP), (.ringTip, .ringPIP), (.littleTip, .littlePIP)]
        var ext: [Bool] = []
        for (t, m) in dedos { if let a = pts[t], let b = pts[m], a.confidence > 0.3, b.confidence > 0.3 { ext.append(d(a, mu) > d(b, mu) * 1.15) } else { ext.append(false) } }
        var apunta = "null"; var ip = "null", ib = "null"
        if let t = pts[.indexTip], let b = pts[.indexMCP], t.confidence > 0.3, b.confidence > 0.3 {
            let (tx, ty) = P(t.location), (bx, by) = P(b.location); ip = "[\(f(tx)),\(f(ty))]"; ib = "[\(f(bx)),\(f(by))]"
            if ext[1] && !ext[2] && !ext[3] && !ext[4] { let L = max(hypot(tx - bx, ty - by), 1); apunta = "[\(String(format: "%.2f", (tx - bx) / L)),\(String(format: "%.2f", (ty - by) / L))]" }
        }
        let (mx, my) = P(mu.location)
        let lado = ob.chirality == .left ? "izquierda" : (ob.chirality == .right ? "derecha" : "?")
        manos.append("{\"lado\":\"\(lado)\",\"muneca\":[\(f(mx)),\(f(my))],\"indice_punta\":\(ip),\"indice_base\":\(ib),\"extendidos\":[\(ext.map { $0 ? "1" : "0" }.joined(separator: ","))],\"apunta\":\(apunta),\"conf\":\(f(Double(ob.confidence)))}")
    }
    out.append("\"manos\":[" + manos.joined(separator: ",") + "]")
    if let m = rSil.results?.first?.pixelBuffer {
        CVPixelBufferLockBaseAddress(m, .readOnly)
        let mw = CVPixelBufferGetWidth(m), mh = CVPixelBufferGetHeight(m), rb = CVPixelBufferGetBytesPerRow(m)
        let base = CVPixelBufferGetBaseAddress(m)!.assumingMemoryBound(to: UInt8.self)
        var x0 = mw, y0 = mh, x1 = 0, y1 = 0; let GX = 12, GY = 20; var celdas = [[Double]](repeating: [Double](repeating: 0, count: GX), count: GY)
        for y in stride(from: 0, to: mh, by: 2) { for x in stride(from: 0, to: mw, by: 2) { let v = base[y * rb + x]; if v > 127 { x0 = min(x0, x); x1 = max(x1, x); y0 = min(y0, y); y1 = max(y1, y); celdas[y * GY / mh][x * GX / mw] += 1 } } }
        let porCelda = Double(mw * mh) / Double(GX * GY) / 4
        CVPixelBufferUnlockBaseAddress(m, .readOnly)
        let sx = w / Double(mw), sy = h / Double(mh)
        let occ = celdas.map { "[" + $0.map { String(format: "%.2f", min(1, $0 / porCelda)) }.joined(separator: ",") + "]" }.joined(separator: ",")
        out.append(x1 > x0 ? "\"silueta\":{\"caja\":[\(f(Double(x0)*sx)),\(f(Double(y0)*sy)),\(f(Double(x1)*sx)),\(f(Double(y1)*sy))],\"ocupacion\":[\(occ)]}" : "\"silueta\":null")
    }
    print("{\"img\":\"\(ruta)\",\"w\":\(Int(w)),\"h\":\(Int(h)),\(out.joined(separator: ","))}")
}
