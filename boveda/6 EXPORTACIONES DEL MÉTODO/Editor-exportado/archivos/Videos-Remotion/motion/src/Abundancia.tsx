import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Motion graphic de CLIENTE-A_1009_01, en dos clips:
//  parte "a" (4,4 s): fondo azul oscuro, cerebro en el centro y alrededor iconos de "poca abundancia" que se tachan; al final un agujero negro lo absorbe todo y la pantalla se vuelve blanca.
//  parte "b" (3,8 s): fondo blanco, persona tranquila en el centro y alrededor corazón, dinero, pesas y paloma.
const AZUL = "#1E8BFF";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (x: number) => 1 - Math.pow(1 - x, 3);
const EMOJI = "'Apple Color Emoji', sans-serif";
const CX = 540, CY = 700;

const MALOS = ["💊", "💋", "💸", "👨‍💼", "💼", "🍺"];
const BUENOS = ["❤️", "💰", "🏋️", "🕊️"];

const ParteA: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps;
  const entra = suave(interpolate(t, [0, 0.45], [0, 1], clamp));
  const abs = interpolate(t, [3.75, 4.2], [0, 1], clamp), absE = abs * abs;
  const blanco = interpolate(t, [4.12, 4.36], [0, 1], clamp);
  const pulso = 1 + 0.03 * Math.sin(t * 4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#020817" }}>
      <AbsoluteFill style={{ background: `radial-gradient(1000px 1100px at 50% ${36 + Math.sin(t * 0.6) * 2}%, #0E3FA8 0%, #082463 38%, #030B1F 78%)`, opacity: entra }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" }} />
      <AbsoluteFill style={{ background: "radial-gradient(1200px 1500px at 50% 40%, transparent 45%, rgba(0,0,0,0.65) 100%)" }} />
      {/* anillos finos alrededor del cerebro */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: entra * (1 - abs) }}>
        <circle cx={CX} cy={CY} r={365} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={1.5} strokeDasharray="3 12" transform={`rotate(${t * 6} ${CX} ${CY})`} />
        <circle cx={CX} cy={CY} r={190} fill={`${AZUL}22`} stroke={`${AZUL}88`} strokeWidth={2} />
      </svg>
      {/* iconos de "poca abundancia" */}
      {MALOS.map((e, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / MALOS.length + t * 0.1;
        const pop = spring({ frame: frame - Math.round((0.25 + i * 0.2) * fps), fps, config: { damping: 14, mass: 0.6 } });
        const x = interpolate(t, [1.6 + i * 0.28, 1.85 + i * 0.28], [0, 1], clamp);
        const giro = absE * 2.6, r = 365 * (1 - absE);
        const px = CX + Math.cos(ang + giro) * r, py = CY + Math.sin(ang + giro) * r;
        return (
          <div key={i} style={{ position: "absolute", left: px - 100, top: py - 100, width: 200, height: 200, borderRadius: 100, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.28)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop * (1 - absE)}) rotate(${giro * 80}deg)`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
            <span style={{ fontFamily: EMOJI, fontSize: 112, lineHeight: 1, filter: `grayscale(${x}) brightness(${1 - 0.2 * x})` }}>{e}</span>
            <svg width={200} height={200} viewBox="0 0 160 160" style={{ position: "absolute", left: -1.5, top: -1.5, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}>
              <line x1={42} y1={42} x2={42 + 76 * Math.min(1, x * 2)} y2={42 + 76 * Math.min(1, x * 2)} stroke="white" strokeWidth={6} strokeLinecap="round" opacity={x > 0 ? 1 : 0} />
              <line x1={118} y1={42} x2={118 - 76 * Math.max(0, x * 2 - 1)} y2={42 + 76 * Math.max(0, x * 2 - 1)} stroke="white" strokeWidth={6} strokeLinecap="round" opacity={x > 0.5 ? 1 : 0} />
            </svg>
          </div>
        );
      })}
      {/* cerebro */}
      <div style={{ position: "absolute", left: CX - 200, top: CY - 200, width: 400, height: 400, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${entra * pulso * (1 - absE)})`, filter: `drop-shadow(0 0 50px ${AZUL})` }}>
        <span style={{ fontFamily: EMOJI, fontSize: 270, lineHeight: 1 }}>🧠</span>
      </div>
      {/* agujero negro y destello blanco */}
      <div style={{ position: "absolute", left: CX - 170, top: CY - 170, width: 340, height: 340, borderRadius: 170, background: "radial-gradient(circle, #000 55%, rgba(0,0,0,0) 72%)", boxShadow: `0 0 90px 20px ${AZUL}`, transform: `scale(${abs * (1 - blanco * 0.6)})`, opacity: abs }} />
      <div style={{ position: "absolute", left: CX - 60, top: CY - 60, width: 120, height: 120, borderRadius: 60, background: "white", transform: `scale(${blanco * blanco * 46})`, opacity: blanco > 0 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};

const ParteB: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps;
  const halo = suave(interpolate(t, [0, 0.7], [0, 1], clamp));
  const persona = spring({ frame: frame - 3, fps, config: { damping: 15, mass: 0.7 } });
  const onda = interpolate(t, [3.2, 3.75], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 1000px at 50% 36%, #DCEBFF 0%, #F4F8FF 45%, #FFFFFF 80%)`, opacity: halo }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(10,40,110,0.07) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px", WebkitMaskImage: "radial-gradient(700px 800px at 50% 36%, black 20%, transparent 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={CX} cy={CY} r={365 * halo} fill="none" stroke={`${AZUL}55`} strokeWidth={1.5} strokeDasharray="3 12" transform={`rotate(${-t * 6} ${CX} ${CY})`} />
        <circle cx={CX} cy={CY} r={200 * halo} fill={`${AZUL}1F`} stroke={AZUL} strokeWidth={2.5} />
        <circle cx={CX} cy={CY} r={200 + 420 * onda} fill="none" stroke={AZUL} strokeWidth={3} opacity={onda > 0 ? 1 - onda : 0} />
      </svg>
      {BUENOS.map((e, i) => {
        const ang = -Math.PI / 4 + (i * Math.PI) / 2;
        const pop = spring({ frame: frame - Math.round((0.45 + i * 0.25) * fps), fps, config: { damping: 12, mass: 0.6 } });
        const px = CX + Math.cos(ang) * 365 * pop, py = CY + Math.sin(ang) * 365 * pop + Math.sin(t * 1.6 + i) * 9;
        return (
          <div key={i} style={{ position: "absolute", left: px - 105, top: py - 105, width: 210, height: 210, borderRadius: 105, background: "white", border: `2px solid ${AZUL}55`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop})`, boxShadow: "0 18px 44px rgba(20,60,140,0.18)" }}>
            <span style={{ fontFamily: EMOJI, fontSize: 116, lineHeight: 1 }}>{e}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CX - 200, top: CY - 200, width: 400, height: 400, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${persona}) translateY(${Math.sin(t * 1.4) * 6}px)` }}>
        <span style={{ fontFamily: EMOJI, fontSize: 270, lineHeight: 1 }}>🧘</span>
      </div>
    </AbsoluteFill>
  );
};

export const Abundancia: React.FC<{ parte: string }> = ({ parte }) => (parte === "b" ? <ParteB /> : <ParteA />);
