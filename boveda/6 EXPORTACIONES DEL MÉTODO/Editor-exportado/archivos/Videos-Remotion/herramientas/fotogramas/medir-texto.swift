import CoreText
import Foundation
let a = CommandLine.arguments; let font = CTFontCreateWithName(a[1] as CFString, CGFloat(Double(a[2])!), nil)
for s in a[3...] { let at = NSAttributedString(string: s, attributes: [kCTFontAttributeName as NSAttributedString.Key: font]); let l = CTLineCreateWithAttributedString(at); print(String(format: "%.1f", CTLineGetTypographicBounds(l, nil, nil, nil)), s) }
