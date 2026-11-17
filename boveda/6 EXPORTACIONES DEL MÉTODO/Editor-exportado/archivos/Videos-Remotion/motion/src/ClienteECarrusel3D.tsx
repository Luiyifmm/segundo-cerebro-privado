import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Carrusel 3D de reels: suben de abajo, el del centro delante y grande, los laterales detrás girados en perspectiva;
// el carrusel gira a la derecha por pasos y la tarjeta que llega al frente hace un "pop".
type Reel = { src: string; desde?: number };
export const ClienteECarrusel3D: React.FC<{ reels: Reel[]; giros: number[]; fin: number; oscuro: number; ancho: number; centroY?: number; dur?: number }> = ({ reels, giros, fin, oscuro, ancho, centroY, dur = 0.55 }) => {
  const f = useCurrentFrame(), { fps, width, height } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const n = reels.length, alto = ancho * 16 / 9;
  // pasos de giro acumulados (0..giros.length), suaves
  let pasos = 0; giros.forEach((g) => { pasos += interpolate(s, [g, g + dur], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) }); });
  const fondo = interpolate(s, [0, 0.35, fin - 0.35, fin], [0, oscuro, oscuro, 0], c);
  const salida = interpolate(s, [fin - 0.5, fin], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
  const cards = reels.map((r, i) => {
    let p = ((i - 1 + pasos) % n + n) % n; if (p > n / 2) p -= n;          // posición en el aro: 0 = frente, +1 derecha, -1 izquierda
    const ap = Math.abs(p), sube = spring({ frame: f - Math.round((0.12 + ([1, 0, 2, 3][i] ?? i) * 0.12) * fps), fps, config: { damping: 16, mass: 0.7 } });
    // "pop" al llegar al frente
    let pop = 0; giros.forEach((g) => { const k = s - (g + dur * 0.7); if (k > 0 && k < 0.5) pop = Math.max(pop, Math.sin((k / 0.5) * Math.PI) * 0.06); });
    if (s < 1) { const k = s - 0.55; if (k > 0 && k < 0.5 && ap < 0.3) pop = Math.sin((k / 0.5) * Math.PI) * 0.06; }
    const x = p * ancho * 0.78, z = -ap * 300, ry = -p * 38, esc = (1 - 0.18 * Math.min(ap, 1)) + pop;
    const op = (ap > 1 ? Math.max(0, 1 - (ap - 1) * 2) : 1) * (1 - salida), y = (1 - sube) * 900 + salida * 700;
    const brillo = Math.max(0, 1 - ap * 1.6);
    return { i, r, z, el: (
      <div key={i} style={{ position: "absolute", left: width / 2 - ancho / 2, top: (centroY ?? height / 2) - alto / 2, width: ancho, height: alto, opacity: op, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) scale(${esc})`, borderRadius: 40, overflow: "hidden", background: "#000", boxShadow: `0 0 ${26 + 34 * brillo}px rgba(255,236,0,${0.45 + 0.35 * brillo}), 0 0 ${70 + 50 * brillo}px rgba(255,214,0,${0.25 + 0.2 * brillo}), 0 0 0 ${2 + 2 * brillo}px rgba(255,249,0,${0.5 + 0.4 * brillo})` }}>
        <OffthreadVideo src={staticFile(r.src)} startFrom={Math.round((r.desde ?? 0) * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * Math.min(ap, 1)})` }} />
      </div>
    ) };
  });
  cards.sort((a, b) => a.z - b.z);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo})` }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{cards.map((k) => k.el)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
