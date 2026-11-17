// MG para el Eric de YouTube (@ericmentorfitness), "estoy en un país con menos de 90.000 habitantes… los bancos gestionan más de X mil millones":
// silueta de Andorra que se dibuja con línea blanca, flecha a los habitantes, banco y la cifra en rojo. 16:9, 50 fps, fondo oscuro semitransparente.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANDORRA } from "./andorra-forma";
const FUENTES: [string, string][] = [["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]];
const useFuentes = () => { const [h] = useState(() => delayRender("fuentes")); useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]); };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const miles = (n: number) => Math.round(n).toLocaleString("es-ES").replace(/,/g, ".");
export const EricAndorra: React.FC<{ millones?: number; acento?: string; verde?: string; habitantes?: number; t?: { pais: number; hab: number; banco: number; cifra: number } }> = ({ millones = 130000, acento = "#FF0000", verde = "#2BFF3A", habitantes = 90000, t = { pais: 0.0, hab: 1.36, banco: 3.1, cifra: 4.7 } }) => {
  useFuentes(); const f = useCurrentFrame(), { fps, durationInFrames: D } = useVideoConfig(); const F = (s: number) => s * fps;
  const fondo = interpolate(f, [0, 12, D - 15, D], [0, 1, 1, 0], cl);
  const trazo = interpolate(f, [F(t.pais) + 4, F(t.pais) + 70], [0, 1], { ...cl, easing: ease });
  const relleno = interpolate(f, [F(t.pais) + 40, F(t.pais) + 85], [0, 0.14], cl);
  const nombre = interpolate(f, [F(t.pais) + 50, F(t.pais) + 70], [0, 1], cl);
  const fl1 = interpolate(f, [F(t.hab), F(t.hab) + 20], [0, 1], { ...cl, easing: ease });
  const hab = interpolate(f, [F(t.hab) + 10, F(t.hab) + 45], [0, habitantes], { ...cl, easing: ease }), habOp = interpolate(f, [F(t.hab) + 8, F(t.hab) + 18], [0, 1], cl);
  const fl2 = interpolate(f, [F(t.banco) - 6, F(t.banco) + 14], [0, 1], { ...cl, easing: ease });
  const banco = spring({ frame: f - F(t.banco), fps, config: { damping: 11, stiffness: 160 } });
  const cifra = interpolate(f, [F(t.cifra) - 2, F(t.cifra) + 50], [0, millones], { ...cl, easing: ease }), cifOp = interpolate(f, [F(t.cifra) - 4, F(t.cifra) + 6], [0, 1], cl);
  const golpe = spring({ frame: f - F(t.cifra) - 50, fps, config: { damping: 9, stiffness: 220 } });
  const S = 0.92, X0 = 330, Y0 = 210; // silueta: 700x584 → ~644x537
  const dibujo = (a: [number, number], b: [number, number], p: number) => `M${a[0]} ${a[1]} L${a[0] + (b[0] - a[0]) * p} ${a[1] + (b[1] - a[1]) * p}`;
  const A1: [number, number] = [X0 + 600 * S, Y0 + 170 * S], B1: [number, number] = [1250, 300], A2: [number, number] = [X0 + 560 * S, Y0 + 420 * S], B2: [number, number] = [1250, 640];
  const punta = (a: [number, number], b: [number, number], p: number) => { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), x = a[0] + (b[0] - a[0]) * p, y = a[1] + (b[1] - a[1]) * p, l = 22; return `M${x - l * Math.cos(ang - 0.5)} ${y - l * Math.sin(ang - 0.5)} L${x} ${y} L${x - l * Math.cos(ang + 0.5)} ${y - l * Math.sin(ang + 0.5)}`; };
  return (
    <AbsoluteFill style={{ opacity: fondo }}>
      <AbsoluteFill style={{ background: "radial-gradient(1400px 900px at 50% 50%, rgba(12,12,12,0.78), rgba(5,5,5,0.9))" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="brillo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g transform={`translate(${X0} ${Y0}) scale(${S})`}>
          <path d={ANDORRA.d} fill={`rgba(255,255,255,${relleno})`} />
          <path d={ANDORRA.d} fill="none" stroke="white" strokeWidth={4.5 / S} strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - trazo} filter="url(#brillo)" />
        </g>
        {fl1 > 0 ? <g stroke="white" strokeWidth={4} fill="none" strokeLinecap="round" filter="url(#brillo)"><path d={dibujo(A1, B1, fl1)} /><path d={punta(A1, B1, fl1)} /></g> : null}
        {fl2 > 0 ? <g stroke={acento} strokeWidth={4} fill="none" strokeLinecap="round" filter="url(#brillo)"><path d={dibujo(A2, B2, fl2)} /><path d={punta(A2, B2, fl2)} /></g> : null}
      </svg>
      <div style={{ position: "absolute", left: X0, width: 700 * S, top: Y0 + 584 * S + 20, textAlign: "center", opacity: nombre, fontFamily: "SeqM", fontSize: 40, letterSpacing: 18, paddingLeft: 18, color: "rgba(255,255,255,0.85)" }}>ANDORRA</div>
      <div style={{ position: "absolute", left: 1280, top: 230, opacity: habOp, display: "flex", alignItems: "center", gap: 26 }}>
        <svg width="96" height="96" viewBox="0 0 24 24" fill="white"><circle cx="8" cy="7" r="3.2" /><circle cx="16.5" cy="8" r="2.6" /><path d="M2 20c0-4 2.8-6.5 6-6.5s6 2.5 6 6.5Z" /><path d="M14.6 20c0-2.6-.8-4.4-2-5.6 1.2-.8 2.6-1.2 3.9-1.2 3 0 5.5 2.3 5.5 6.8Z" opacity="0.75" /></svg>
        <div style={{ lineHeight: 1 }}><div style={{ fontFamily: "SeqM", fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>MENOS DE</div>
          <div style={{ fontFamily: "SeqH", fontSize: 92, color: "white", letterSpacing: -3 }}>{miles(hab)}</div>
          <div style={{ fontFamily: "SeqM", fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>HABITANTES</div></div>
      </div>
      <div style={{ position: "absolute", left: 1280, top: 560, display: "flex", alignItems: "center", gap: 26 }}>
        <svg width="110" height="110" viewBox="0 0 24 24" fill={acento} style={{ transform: `scale(${banco})`, opacity: Math.min(1, banco * 1.5) }}><path d="M12 2 2 7v2h20V7Z" /><rect x="4" y="10" width="2.4" height="8" /><rect x="8.5" y="10" width="2.4" height="8" /><rect x="13.1" y="10" width="2.4" height="8" /><rect x="17.6" y="10" width="2.4" height="8" /><rect x="2" y="19" width="20" height="2.6" /></svg>
        <div style={{ lineHeight: 1, opacity: cifOp, transform: `scale(${1 + 0.06 * Math.sin(Math.min(golpe, 1) * Math.PI)})`, transformOrigin: "0% 50%" }}>
          <div style={{ fontFamily: "SeqM", fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>LOS BANCOS GESTIONAN</div>
          <div style={{ fontFamily: "SeqH", fontSize: 92, color: verde, letterSpacing: -3, textShadow: `0 0 34px ${verde}88, 0 0 10px ${verde}55` }}>+{miles(cifra)}</div>
          <div style={{ fontFamily: "SeqM", fontSize: 34, color: "white", letterSpacing: 2 }}>MILLONES DE €</div></div>
      </div>
    </AbsoluteFill>
  );
};
