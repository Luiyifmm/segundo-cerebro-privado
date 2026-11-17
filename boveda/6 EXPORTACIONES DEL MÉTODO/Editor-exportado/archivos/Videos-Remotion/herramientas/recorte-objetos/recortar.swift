// Recorta el sujeto principal de una imagen (comida, objetos) con el "levantar sujeto" de Apple (Vision) y lo guarda en PNG con transparencia,
// ajustado a su contorno. Uso: recortar <entrada> <salida.png>   (varias parejas seguidas valen)
import Foundation
import Vision
import CoreImage
import AppKit

// Con --lienzo como primer argumento el PNG conserva el tamaño y la posición de la imagen original (para superponerlo encima de ella).
var a = CommandLine.arguments
var lienzo = false
if a.count > 1 && a[1] == "--lienzo" { lienzo = true; a.remove(at: 1) }
let ctx = CIContext()
var i = 1
while i + 1 < a.count {
    let entrada = URL(fileURLWithPath: a[i]), salida = URL(fileURLWithPath: a[i + 1]); i += 2
    guard let ci = CIImage(contentsOf: entrada, options: [.applyOrientationProperty: true]) else { print("NO \(entrada.lastPathComponent): no se lee"); continue }
    let h = VNImageRequestHandler(ciImage: ci), req = VNGenerateForegroundInstanceMaskRequest()
    do {
        try h.perform([req])
        guard let r = req.results?.first, !r.allInstances.isEmpty else { print("NO \(entrada.lastPathComponent): sin sujeto"); continue }
        let buf = try r.generateMaskedImage(ofInstances: r.allInstances, from: h, croppedToInstancesExtent: !lienzo)
        let out = CIImage(cvPixelBuffer: buf)
        guard let cg = ctx.createCGImage(out, from: out.extent) else { print("NO \(entrada.lastPathComponent): sin imagen"); continue }
        let rep = NSBitmapImageRep(cgImage: cg)
        guard let png = rep.representation(using: .png, properties: [:]) else { continue }
        try png.write(to: salida)
        let frac = Double(out.extent.width * out.extent.height) / Double(ci.extent.width * ci.extent.height)
        print("OK \(salida.lastPathComponent) \(Int(out.extent.width))x\(Int(out.extent.height)) ocupa \(String(format: "%.2f", frac))")
    } catch { print("NO \(entrada.lastPathComponent): \(error.localizedDescription)") }
}
