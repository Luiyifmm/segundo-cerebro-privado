import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// Estilo @julianealborna: escena oscura en blanco y negro con grano, foco de luz cenital,
// texto crema con brillo palabra a palabra y un único acento neón naranja.
// "y sigues en el mismo punto": hombre hundido en su silla dentro de un círculo naranja que se cierra en "punto".
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EricTriste: React.FC<{ foto?: string; palabras?: [string, number][]; anillo?: boolean; tCierra?: number; acento?: string; tSale?: number }> = ({
  foto = "eric/triste/hombre.png",
  palabras = [["y", 0.02], ["sigues", 0.2], ["en", 0.42], ["el", 0.52], ["mismo", 0.7], ["punto", 1.08]],
  anillo = false,
  tCierra = 1.08,
  acento = "#FF5A1F",
  tSale,
}) => {
  const f = useCurrentFrame(), { fps, width, height, durationInFrames } = useVideoConfig(), s = f / fps;
  const fin = tSale ?? durationInFrames / fps - 0.32;
  const sube = Easing.out(Easing.cubic), baja = Easing.in(Easing.cubic);
  // fondo: entra de abajo hacia arriba, sale hacia abajo
  const fondoY = interpolate(s, [0, 0.28], [height, 0], { ...c, easing: sube }) + interpolate(s, [fin + 0.06, fin + 0.32], [0, height], { ...c, easing: baja });
  // persona y texto: entran desde la izquierda, salen hacia la derecha
  const entraX = interpolate(s, [0.08, 0.4], [-width * 1.05, 0], { ...c, easing: Easing.out(Easing.back(1.2)) });
  const saleX = interpolate(s, [fin - 0.02, fin + 0.22], [0, width * 1.1], { ...c, easing: baja });
  const vel = Math.abs(interpolate(s, [0.08, 0.24, 0.4], [1, 0.6, 0], c)) + interpolate(s, [fin - 0.02, fin + 0.22], [0, 1], c);
  const desX = entraX + saleX;
  // movimiento de la persona: balanceo lento y sollozo
  const balanceo = Math.sin(s * 2.6) * 1.6, sollozo = Math.max(0, Math.sin(s * 9)) * 6, respira = 1 + Math.sin(s * 3.1) * 0.012;
  const zoom = interpolate(s, [0, 2.5], [1.0, 1.06], c);
  const traza = interpolate(s, [0.1, tCierra], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) });
  const golpe = interpolate(s, [tCierra, tCierra + 0.08, tCierra + 0.45], [0, 1, 0.35], c);
  const cx = width / 2, cy = 1505, rx = 360, ry = 82;
  const L = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${fondoY}px)`, background: "#060606" }}>
        <AbsoluteFill style={{ background: "radial-gradient(900px 1300px at 50% 46%, #2a2a2a 0%, #141414 45%, #050505 100%)" }} />
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
          <div style={{ position: "absolute", left: cx - 520, top: -80, width: 1040, height: 1700, background: "linear-gradient(180deg, rgba(255,250,235,0.20) 0%, rgba(255,250,235,0.07) 60%, rgba(255,250,235,0) 100%)", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(28px)" }} />
          <div style={{ position: "absolute", left: cx - 520, top: cy - 150, width: 1040, height: 300, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,248,230,0.16), rgba(255,248,230,0))" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "radial-gradient(closest-side at 50% 52%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.75) 100%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${desX}px) translateY(${fondoY * 0.15}px)`, filter: `blur(${vel * 10}px)` }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
          {anillo ? <Anillo cx={cx} cy={cy} rx={rx} ry={ry} L={L} traza={traza} golpe={golpe} acento={acento} parte="atras" /> : null}
          <div style={{ position: "absolute", left: cx - 300, top: cy - 30, width: 600, height: 70, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.6), rgba(0,0,0,0))" }} />
          <Img src={staticFile(foto)} style={{ position: "absolute", left: cx - 390, top: 560, width: 780, height: 1117, objectFit: "contain", transformOrigin: "50% 95%", transform: `rotate(${balanceo}deg) translateY(${sollozo}px) scale(${respira})`, filter: "grayscale(1) contrast(1.25) brightness(0.92) drop-shadow(0 30px 40px rgba(0,0,0,0.8))" }} />
          {anillo ? <Anillo cx={cx} cy={cy} rx={rx} ry={ry} L={L} traza={traza} golpe={golpe} acento={acento} parte="delante" /> : null}
        </AbsoluteFill>
        <div style={{ position: "absolute", top: 360, left: 80, right: 80, textAlign: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 500, fontSize: 60, letterSpacing: -2, color: "#F4ECD6", textShadow: "0 0 18px rgba(255,236,190,0.55), 0 0 42px rgba(255,220,160,0.25)" }}>
          {palabras.map(([w, t], i) => {
            const a = interpolate(s, [t, t + 0.12], [0, 1], c);
            return <span key={i} style={{ opacity: a, filter: `blur(${(1 - a) * 8}px)`, marginRight: 14, display: "inline-block" }}>{w}</span>;
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.2, mixBlendMode: "screen", transform: `translateY(${fondoY}px)` }}>
        <svg width={width} height={height}><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Anillo: React.FC<{ cx: number; cy: number; rx: number; ry: number; L: number; traza: number; golpe: number; acento: string; parte: "atras" | "delante" }> = ({ cx, cy, rx, ry, L, traza, golpe, acento, parte }) => {
  const { width, height } = useVideoConfig();
  // la mitad de atrás es la de arriba (y < cy); se recorta con clipPath
  const clip = parte === "atras" ? `inset(0 0 ${height - cy}px 0)` : `inset(${cy}px 0 0 0)`;
  const glow = 10 + golpe * 26;
  const d = `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry}`;
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, clipPath: clip, overflow: "visible" }}>
      <path d={d} fill="none" stroke={acento} strokeWidth={9 + golpe * 4} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - traza)}
        style={{ filter: `drop-shadow(0 0 ${glow}px ${acento}) drop-shadow(0 0 ${glow * 2}px ${acento})` }} />
      <path d={d} fill="none" stroke="#FFE7D2" strokeWidth={2.5} strokeDasharray={L} strokeDashoffset={L * (1 - traza)} opacity={0.9} />
    </svg>
  );
};
