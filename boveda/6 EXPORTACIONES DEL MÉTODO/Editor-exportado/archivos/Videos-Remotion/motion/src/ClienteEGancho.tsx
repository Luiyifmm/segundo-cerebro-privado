import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Gancho al estilo del reel de referencia (22-10-2026): título enorme condensado sobre ClienteE, escena oscura con foco
// y un objeto brillando, y pantalla azul con la frase escribiéndose. Tres clips separados para poder moverlos en Premiere.
const fuentes = `@font-face{font-family:'BalboaF';src:url('${staticFile("fonts/Balboa.otf")}') format('opentype');} @font-face{font-family:'SFBoldF';src:url('${staticFile("fonts/SFProBold.otf")}') format('opentype');}`;
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ClienteEGanchoTitulo: React.FC<{ rojo: string; arriba: string; abajo: string; tAbajo: number; y: number }> = ({ rojo, arriba, abajo, tAbajo, y }) => {
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), s = f / fps, fin = durationInFrames / fps;
  const a = interpolate(s, [0.05, 0.3], [0, 1], { ...c, easing: Easing.out(Easing.cubic) }), b = interpolate(s, [tAbajo, tAbajo + 0.2], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const sale = interpolate(s, [fin - 0.18, fin], [0, 1], c);
  const linea = (txt: string, e: number, tam: number, col: string, top: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: "'BalboaF', sans-serif", fontSize: tam, lineHeight: 0.9, color: col, letterSpacing: 2, whiteSpace: "nowrap", opacity: e * (1 - sale), filter: `blur(${(1 - e) * 14 + sale * 18}px)`, transform: `scale(${1.12 - 0.12 * e + sale * 0.06})`, textShadow: "0 6px 24px rgba(0,0,0,0.35)" }}>{txt}</div>);
  return <AbsoluteFill><style>{fuentes}</style>{linea(arriba, a, 250, rojo, y)}{linea(abajo, b, 120, "#fff", y + 230)}</AbsoluteFill>;
};

export const ClienteEGanchoEscena: React.FC<{ texto: string; rojo: string }> = ({ texto, rojo }) => {
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), s = f / fps, fin = durationInFrames / fps;
  const entra = interpolate(s, [0, 0.18], [0, 1], { ...c, easing: Easing.out(Easing.cubic) }), luz = interpolate(s, [0.05, 0.45], [0, 1], c);
  const zoom = 1 + 0.07 * (s / fin), brilla = 0.75 + 0.25 * Math.sin(s * 9);
  const tarjeta = (x: number, y0: number, vel: number, giro: number, esc: number, desen: number, k: number) => {
    const yy = y0 + (s + k) * vel, r = giro * (s + k) * 60;
    return <div key={k} style={{ position: "absolute", left: x, top: yy, width: 300 * esc, height: 150 * esc, borderRadius: 14 * esc, background: "linear-gradient(135deg,#d9d9d9,#7c7c7c 45%,#e6e6e6 70%,#8a8a8a)", border: `${3 * esc}px solid ${rojo}`, transform: `rotate(${r}deg) rotateX(${30 + r / 3}deg)`, filter: `blur(${desen}px) brightness(0.55)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'BalboaF', sans-serif", fontSize: 90 * esc, color: "#1a1a1a" }}>{texto}</div>;
  };
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #1d2a36 0%, #0b1016 55%, #050709 100%)", opacity: entra, filter: `blur(${(1 - entra) * 20}px)`, overflow: "hidden" }}>
      <style>{fuentes}</style>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* foco del techo y su cono de luz */}
        <div style={{ position: "absolute", left: 540 - 130, top: 40, width: 260, height: 46, borderRadius: "50%", background: "radial-gradient(ellipse, #ffffff 0%, #dfefff 40%, rgba(160,200,255,0) 75%)", opacity: luz, filter: "blur(2px)" }} />
        <div style={{ position: "absolute", left: 540 - 520, top: 50, width: 1040, height: 1500, background: "radial-gradient(ellipse at 50% 0%, rgba(150,195,255,0.38) 0%, rgba(90,140,210,0.16) 38%, rgba(0,0,0,0) 70%)", clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", opacity: luz }} />
        {tarjeta(80, -260, 520, 0.5, 0.8, 7, 0)}{tarjeta(720, -520, 640, -0.6, 0.65, 9, 0.3)}{tarjeta(120, 980, 360, -0.4, 0.9, 5, 0.1)}{tarjeta(760, 1250, 300, 0.5, 0.7, 8, 0.2)}
        {/* objeto principal */}
        <div style={{ position: "absolute", left: 540 - 300, top: 860 - 150 + Math.sin(s * 3) * 8, width: 600, height: 300, borderRadius: 26, background: "linear-gradient(135deg,#f2f2f2 0%,#a9a9a9 35%,#ffffff 55%,#9a9a9a 80%,#dcdcdc 100%)", border: `6px solid ${rojo}`, boxShadow: `0 0 ${50 * brilla}px rgba(255,255,255,${0.55 * luz}), 0 0 120px rgba(255,0,0,${0.35 * luz}), 0 30px 60px rgba(0,0,0,0.6)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'BalboaF', sans-serif", fontSize: 200, color: "#141414", letterSpacing: 4, transform: `scale(${0.92 + 0.08 * entra})` }}>
          <span style={{ textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>{texto}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ClienteEGanchoAzul: React.FC<{ palabras: [string, number][] }> = ({ palabras }) => {
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), s = f / fps, fin = durationInFrames / fps;
  const sale = interpolate(s, [fin - 0.2, fin], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #061a3a 0%, #0c3a74 45%, #1b6db3 100%)", opacity: 1 - sale, filter: `blur(${sale * 24}px)` }}>
      <style>{fuentes}</style>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960 - 40, textAlign: "center", whiteSpace: "nowrap", fontFamily: "'SFBoldF', -apple-system, sans-serif", fontSize: 64, letterSpacing: -2.6, color: "#fff", textShadow: "0 2px 18px rgba(0,0,0,0.25)" }}>
        {palabras.map(([w, t], i) => (
          <span key={i}>{w.split("").map((ch, j) => { const e = interpolate(s, [t + j * 0.03, t + j * 0.03 + 0.18], [0, 1], c);
            return <span key={j} style={{ display: "inline-block", opacity: e, filter: `blur(${(1 - e) * 10}px)` }}>{ch === " " ? "\u00A0" : ch}</span>; })}{i < palabras.length - 1 ? "\u00A0" : ""}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
