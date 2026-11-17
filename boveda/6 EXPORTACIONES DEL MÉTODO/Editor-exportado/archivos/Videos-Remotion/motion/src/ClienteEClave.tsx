import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";

// "Clave N" estilo motion graphic: texto de contorno grande que parpadea al encenderse, rombo de cristal con el número
// que sube girando y se endereza, y frase debajo con la parte clave en serifa cursiva.
export const ClienteEClave: React.FC<{ fondo: string; num: string; antes: string; clave: string; t: number; tFrase: number; tFuera: number; y: number; color: string; kFrase?: number; lado?: number; tiempos?: number[]; frase?: boolean }> = ({ fondo, num, antes, clave, t, tFrase, tFuera, y, color, kFrase = 1, lado = 240, tiempos, frase = true }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  // parpadeo tipo neón al encender y un pulso suave después
  const lt = s - t, guion = [0, 0.08, 0.12, 0.2, 0.26, 0.4, 0.46, 0.6];
  let on = lt < 0 ? 0 : 1; for (let k = 0; k < guion.length - 1; k += 2) if (lt >= guion[k] && lt < guion[k + 1]) on = k % 4 === 0 ? 0.25 : 0.7;
  const pulso = lt > 0.6 ? 0.85 + 0.15 * Math.sin(lt * 7) : 1, fuera = interpolate(s, [tFuera, tFuera + 0.35], [1, 0], c);
  const e = interpolate(s, [t + 0.1, t + 0.9], [0, 1], { ...c, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const nE = interpolate(s, [t + 0.25, t + 1.05], [0, 1], { ...c, easing: Easing.bezier(0.2, 1.3, 0.35, 1) });
  const fr = interpolate(s, [tFrase, tFrase + 0.6], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: fuera }}>
      <style>{`@font-face{font-family:'BootzyF';src:url('${staticFile("fonts/BootzyTM.ttf")}') format('truetype');} @font-face{font-family:'AstonF';src:url('${staticFile("fonts/AstonScript.ttf")}') format('truetype');}`}</style>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 120, textAlign: "center", fontFamily: "'BootzyF', 'Bootzy TM', sans-serif", fontWeight: 400, fontSize: 250, letterSpacing: 2, color: "transparent", WebkitTextStroke: "4px rgba(255,252,190,0.95)", opacity: on * pulso, filter: `drop-shadow(0 0 ${8 + 10 * on}px rgba(255,249,0,0.85)) drop-shadow(0 0 ${26 + 20 * on}px rgba(255,220,0,${0.55 * on}))`, whiteSpace: "nowrap" }}>{fondo}</div>
      <div style={{ position: "absolute", left: "50%", top: y, width: lado, height: lado, marginLeft: -lado / 2, marginTop: -lado / 2, opacity: e, transform: `translateY(${(1 - e) * 160}px) rotate(${(1 - e) * -25}deg) scale(${0.7 + 0.3 * e})` }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotate(45deg)", borderRadius: lado * 0.18, background: "linear-gradient(145deg, rgba(40,40,40,0.78), rgba(8,8,8,0.66))", border: "5px solid rgba(255,249,0,0.85)", boxShadow: "0 0 40px rgba(255,249,0,0.45), inset 0 0 24px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.45)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'BootzyF', 'Bootzy TM', sans-serif", fontWeight: 400, fontSize: lado * 0.63, color, opacity: nE, transform: `translateY(${(1 - nE) * 90}px) rotate(${(1 - nE) * 30}deg)`, textShadow: `0 0 10px ${color}, 0 0 30px ${color}, 0 4px 14px rgba(0,0,0,0.45)` }}>{num}</div>
      </div>
      {!frase ? null : tiempos ? (() => {
        // palabra a palabra, como subtítulos: cada una entra cuando se dice; la frase ya ocupa su sitio final para no moverse
        const pa = antes.split(" "), pc = clave.split(" ");
        const pal = (w: string, i: number, clv: boolean) => { const a = interpolate(s, [tiempos[i] - 0.04, tiempos[i] + 0.2], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
          return <span key={i} style={{ display: "inline-block", opacity: a, transform: `translateY(${(1 - a) * 22}px) scale(${0.9 + 0.1 * a})`, ...(clv ? { fontFamily: "'AstonF', 'Aston Script Bold', cursive", fontWeight: 700, fontSize: 104 * kFrase, color } : { fontFamily: "'BootzyF', 'Bootzy TM', sans-serif", fontWeight: 400, fontSize: 70 * kFrase }) }}>{w}&nbsp;</span>; };
        return <div style={{ position: "absolute", left: 0, right: 0, top: y + lado * 0.425, textAlign: "center", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.6), 0 4px 22px rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>
          {pa.map((w, i) => pal(w, i, false))}{pc.map((w, i) => pal(w, pa.length + i, true))}</div>;
      })() : (
      <div style={{ position: "absolute", left: 0, right: 0, top: y + lado * 0.425, textAlign: "center", opacity: fr, transform: `translateY(${(1 - fr) * 30}px)`, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.6), 0 4px 22px rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: "'BootzyF', 'Bootzy TM', sans-serif", fontWeight: 400, fontSize: 70 * kFrase }}>{antes} </span>
        <span style={{ fontFamily: "'AstonF', 'Aston Script Bold', cursive", fontWeight: 700, fontSize: 104 * kFrase, color }}>{clave}</span>
      </div>
      )}
    </AbsoluteFill>
  );
};
