// Pinta un emoji (fuente Apple Color Emoji) en un PNG cuadrado con fondo transparente. Uso: emoji <emoji> <salida.png> [tamaño px]
import AppKit
let a = CommandLine.arguments; let txt = a[1], out = a[2], tam = a.count > 3 ? CGFloat(Double(a[3]) ?? 512) : 512
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(tam), pixelsHigh: Int(tam), bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState(); NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let f = NSFont(name: "Apple Color Emoji", size: tam * 0.8)!; let s = NSAttributedString(string: txt, attributes: [.font: f])
let b = s.boundingRect(with: NSSize(width: tam * 2, height: tam * 2), options: [.usesLineFragmentOrigin])
s.draw(at: NSPoint(x: (tam - b.width) / 2, y: (tam - b.height) / 2 + tam * 0.02)); NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out)); print("OK", out)
