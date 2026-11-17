import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Motion graphics de CLIENTE-A_1010_01 (pantalla completa, con emojis como los del vídeo anterior, más grano, viñeta y luz):
//  Escuela: un niño entra a la escuela, sale un empleado gris y aburrido, y aparece un jefe enorme ante el que se arrodilla.
//  Cadenas: persona con los ojos vendados y cadenas en la mente sobre fondo oscuro y rojo; se rompen y queda libre sobre fondo claro y azul.
const AZUL = "#1E8BFF", ROJO = "#E5261F";
const EMOJI = "'Apple Color Emoji', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (x: number) => 1 - Math.pow(1 - x, 3);

const Grano: React.FC<{ o?: number }> = ({ o = 0.16 }) => (
  <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: o }}>
    <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
  </AbsoluteFill>
);
const E: React.FC<{ e: string; x: number; y: number; t: number; rot?: number; o?: number; gris?: number; sombra?: string }> = ({ e, x, y, t, rot = 0, o = 1, gris = 0, sombra = "0 20px 34px rgba(0,0,0,0.5)" }) => (
  <div style={{ position: "absolute", left: x - t, top: y - t * 0.62, width: t * 2, textAlign: "center", fontFamily: EMOJI, fontSize: t, lineHeight: 1.15, opacity: o, transform: `rotate(${rot}deg)`, filter: `grayscale(${gris}) brightness(${1 - gris * 0.25}) drop-shadow(${sombra})` }}>{e}</div>
);

// Persona de pictograma (sin emojis): unidades relativas a la altura, pies en (x, y).
type Pose = "andar" | "abatido" | "rodillas" | "jefe" | "libre";
export const Figura: React.FC<{ x: number; y: number; h: number; color: string; pose: Pose; f?: number; mira?: number; brillo?: string; detalle?: string }> = ({ x, y, h, color, pose, f = 0, mira = 1, brillo, detalle }) => {
  const sw = Math.sin(f) * 0.13; let cab = [0, -0.9], l: number[][] = [], extra: React.ReactNode = null;
  if (pose === "andar") { l = [[0, -0.76, 0, -0.44, 0.17], [0, -0.44, sw, 0, 0.085], [0, -0.44, -sw, 0, 0.085], [0, -0.73, -sw * 1.1, -0.46, 0.065], [0, -0.73, sw * 1.1, -0.46, 0.065]]; extra = <rect x={-0.2} y={-0.76} width={0.14} height={0.26} rx={0.05} fill={detalle} stroke="none" />; }
  if (pose === "abatido") { cab = [0.07, -0.84]; l = [[0.03, -0.73, 0, -0.44, 0.17], [0, -0.44, sw * 0.4 + 0.03, 0, 0.085], [0, -0.44, -sw * 0.4 - 0.03, 0, 0.085], [0.05, -0.7, 0.1, -0.42, 0.065], [0, -0.7, -0.04, -0.42, 0.065]]; extra = <rect x={0.03} y={-0.4} width={0.2} height={0.14} rx={0.02} fill={detalle} stroke="none" />; }
  if (pose === "rodillas") { cab = [0.21, -0.63]; l = [[-0.22, -0.04, 0.1, -0.04, 0.08], [0.1, -0.05, -0.01, -0.3, 0.09], [-0.01, -0.32, 0.11, -0.54, 0.16], [0.12, -0.52, 0.24, -0.3, 0.06]]; }
  if (pose === "jefe") { l = [[0, -0.75, 0, -0.44, 0.25], [-0.05, -0.44, -0.13, 0, 0.1], [0.05, -0.44, 0.13, 0, 0.1], [-0.13, -0.74, -0.29, -0.58, 0.07], [-0.29, -0.58, -0.13, -0.47, 0.07], [0.13, -0.74, 0.29, -0.58, 0.07], [0.29, -0.58, 0.13, -0.47, 0.07]]; extra = <polygon points="-0.03,-0.8 0.03,-0.8 0.045,-0.6 0,-0.55 -0.045,-0.6" fill={detalle} stroke="none" />; }
  if (pose === "libre") { cab = [0, -0.91]; l = [[0, -0.76, 0, -0.44, 0.18], [-0.03, -0.44, -0.11, 0, 0.09], [0.03, -0.44, 0.11, 0, 0.09], [-0.07, -0.74, -0.3, -1.04, 0.07], [0.07, -0.74, 0.3, -1.04, 0.07]]; }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", filter: brillo ? `drop-shadow(0 0 ${h * 0.05}px ${brillo})` : undefined }}>
      <g transform={`translate(${x} ${y}) scale(${h * mira} ${h})`} stroke={color} strokeLinecap="round" fill="none">
        {pose === "andar" && extra}
        {l.map((s, i) => <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} strokeWidth={s[4]} />)}
        <circle cx={cab[0]} cy={cab[1]} r={0.088} fill={color} stroke="none" />
        {pose !== "andar" && extra}
      </g>
    </svg>
  );
};

// Alternativa sin emojis del motion graphic de la escuela.
export const EscuelaB: React.FC = () => {
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, CX = 540, GY = 980;
  const entra = suave(interpolate(t, [0, 0.35], [0, 1], clamp));
  const nino = interpolate(t, [0.1, 0.95], [0, 1], clamp), sale = interpolate(t, [1.1, 2.0], [0, 1], clamp);
  const jefe = spring({ frame: frame - Math.round(2.15 * fps), fps, config: { damping: 15, mass: 0.9 } }), fase3 = interpolate(t, [2.05, 2.4], [0, 1], clamp);
  const rodilla = t >= 2.55, fin = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0], clamp);
  const puerta = interpolate(t, [0.7, 0.95, 1.1, 1.4], [0.35, 1, 1, 0.35], clamp), B = "rgba(255,255,255,0.9)";
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060F" }}>
      <AbsoluteFill style={{ background: "radial-gradient(1000px 1100px at 50% 40%, #12397F 0%, #0A1E4A 42%, #030814 82%)", opacity: entra }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 1000px at 28% 38%, ${ROJO}66, transparent 65%)`, opacity: fase3 }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" }} />
      <div style={{ position: "absolute", left: 70, right: 70, top: GY, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.3)", opacity: entra }} />
      {/* escuela dibujada con líneas */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: entra * (1 - fase3 * 0.9), transform: `translateX(${fase3 * 150}px)`, filter: `drop-shadow(0 0 26px ${AZUL})` }}>
        <g fill="none" stroke={B} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
          <rect x={CX - 280} y={GY - 330} width={560} height={330} fill="rgba(30,139,255,0.10)" />
          <polygon points={`${CX - 150},${GY - 330} ${CX},${GY - 470} ${CX + 150},${GY - 330}`} fill="rgba(30,139,255,0.16)" />
          <circle cx={CX} cy={GY - 385} r={36} /><path d={`M${CX} ${GY - 408} V${GY - 385} H${CX + 16}`} strokeWidth={5} />
          <line x1={CX} y1={GY - 470} x2={CX} y2={GY - 560} /><path d={`M${CX} ${GY - 560} h70 l-16 22 l16 22 h-70`} fill={AZUL} stroke={AZUL} />
          {[-205, -115, 115, 205].map((dx) => [0, 1].map((f2) => (f2 === 0 && Math.abs(dx) < 200) ? null : <rect key={dx + "-" + f2} x={CX + dx - 28} y={GY - 280 + f2 * 120} width={56} height={70} rx={6} fill="rgba(255,255,255,0.10)" strokeWidth={5} />))}
          <rect x={CX - 62} y={GY - 190} width={124} height={190} rx={8} fill={`rgba(30,139,255,${puerta})`} />
        </g>
        <text x={CX} y={GY - 235} textAnchor="middle" fill="white" style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: 7 }}>ESCUELA</text>
      </svg>
      {nino < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - Math.max(0, nino - 0.82) * 5.5 }}><Figura x={130 + nino * 410} y={GY} h={230 * (1 - Math.max(0, nino - 0.8) * 1.2)} color="#FFFFFF" pose="andar" f={t * 16} detalle={AZUL} brillo={AZUL} /></div>}
      {t >= 1.1 && !rodilla && <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, sale * 4) }}><Figura x={560 + sale * 270} y={GY} h={330} color="#8E97A8" pose="abatido" f={t * 7} detalle="#5B6373" /></div>}
      {rodilla && <Figura x={830} y={GY} h={380} color="#A9B1C0" pose="rodillas" mira={-1} />}
      {t >= 2.15 && <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - jefe) * 900}px)` }}><Figura x={330} y={GY} h={820} color="#070B14" pose="jefe" detalle={ROJO} brillo={ROJO} /></div>}
      <AbsoluteFill style={{ background: "radial-gradient(1200px 1500px at 50% 42%, transparent 45%, rgba(0,0,0,0.72) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.07) ${40 + t * 14}%, transparent ${52 + t * 14}%)` }} />
      <Grano />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: 1 - fin }} />
    </AbsoluteFill>
  );
};

// Línea azul de separación entre EXITOSO y MEDIOCRE (PNG transparente).
export const LineaAzul: React.FC = () => (
  <AbsoluteFill><div style={{ position: "absolute", left: 537, top: 50, width: 6, height: 620, borderRadius: 3, background: `linear-gradient(180deg, transparent, ${AZUL} 12%, #7CC0FF 50%, ${AZUL} 88%, transparent)`, boxShadow: `0 0 18px ${AZUL}, 0 0 44px ${AZUL}aa` }} /></AbsoluteFill>
);

export const Escuela: React.FC = () => {
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, CX = 540, CY = 780;
  const entra = suave(interpolate(t, [0, 0.35], [0, 1], clamp));
  const nino = interpolate(t, [0.1, 0.95], [0, 1], clamp), sale = interpolate(t, [1.1, 2.0], [0, 1], clamp);
  const jefe = spring({ frame: frame - Math.round(2.15 * fps), fps, config: { damping: 15, mass: 0.9 } }), fase3 = interpolate(t, [2.05, 2.4], [0, 1], clamp);
  const rodilla = t >= 2.55, paso = Math.sin(t * 22) * 7, fin = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0.0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060F" }}>
      <AbsoluteFill style={{ background: `radial-gradient(1000px 1100px at 50% 40%, #12397F 0%, #0A1E4A 42%, #030814 82%)`, opacity: entra }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 900px at 26% 40%, ${ROJO}55, transparent 65%)`, opacity: fase3 * 0.9 }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" }} />
      {/* suelo */}
      <div style={{ position: "absolute", left: 90, right: 90, top: CY + 190, height: 3, background: "rgba(255,255,255,0.25)", opacity: entra }} />
      {/* escuela */}
      <div style={{ opacity: entra * (1 - fase3 * 0.93), transform: `translateX(${fase3 * 200}px) scale(${1 - fase3 * 0.2})`, transformOrigin: `${CX}px ${CY}px`, position: "absolute", inset: 0 }}>
        <E e="🏫" x={CX} y={CY - 47} t={520} sombra={`0 0 70px ${AZUL}88`} />
      </div>
      {/* niño que entra por la izquierda */}
      {nino < 1 && <E e="🧒" x={90 + nino * 420} y={CY + 85 + paso} t={230 * (1 - Math.max(0, nino - 0.75) * 2.4)} o={1 - Math.max(0, nino - 0.8) * 5} />}
      {nino < 1 && <E e="🎒" x={10 + nino * 420} y={CY + 120 + paso} t={100 * (1 - Math.max(0, nino - 0.75) * 2.4)} o={1 - Math.max(0, nino - 0.8) * 5} />}
      {/* empleado gris que sale por la derecha, despacio */}
      {t >= 1.1 && !rodilla && <><E e="👨‍💼" x={600 + sale * 260} y={CY + 72 + Math.sin(t * 9) * 3} t={260} gris={0.9} o={Math.min(1, sale * 4)} rot={5} /><E e="💼" x={720 + sale * 260} y={CY + 150} t={84} gris={0.7} o={Math.min(1, sale * 4)} /><E e="💤" x={700 + sale * 260} y={CY - 110 - sale * 30} t={84} o={Math.min(1, sale * 3) * (1 - fase3)} /></>}
      {rodilla && <E e="🧎‍♂️" x={850} y={CY + 54} t={300} gris={0.6} sombra="0 0 40px rgba(255,255,255,0.35)" />}
      {/* jefe enorme */}
      {t >= 2.15 && <E e="👨‍💼" x={350} y={CY - 101 + (1 - jefe) * 700} t={640} sombra={`0 0 90px ${ROJO}cc`} />}
      {t >= 2.15 && <E e="👑" x={350} y={CY - 440 + (1 - jefe) * 700} t={170} rot={-6} />}
      <AbsoluteFill style={{ background: "radial-gradient(1200px 1500px at 50% 42%, transparent 45%, rgba(0,0,0,0.72) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.07) ${40 + t * 14}%, transparent ${52 + t * 14}%)` }} />
      <Grano />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: 1 - fin }} />
    </AbsoluteFill>
  );
};

export const Cadenas: React.FC<{ rompe: number }> = ({ rompe }) => {
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, CX = 540, CY = 760;
  const entra = suave(interpolate(t, [0, 0.3], [0, 1], clamp));
  const r = interpolate(t, [rompe, rompe + 0.5], [0, 1], clamp), rE = suave(r), libre = interpolate(t, [rompe, rompe + 0.35], [0, 1], clamp);
  const flash = interpolate(t, [rompe - 0.03, rompe + 0.05, rompe + 0.4], [0, 1, 0], clamp);
  const tiembla = t > rompe - 0.5 && t < rompe ? Math.sin(frame * 3.1) * 7 * interpolate(t, [rompe - 0.5, rompe], [0, 1], clamp) : 0;
  const sale = spring({ frame: frame - Math.round(rompe * fps), fps, config: { damping: 13, mass: 0.7 } }), pulso = 1 + 0.02 * Math.sin(t * 5), fin = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0], clamp);
  const trozos = [[-1, -1.2, -160], [1, -1.1, 140], [-1.3, 0.5, 200], [1.25, 0.6, -170], [0, -1.5, 90], [-0.4, 1.3, -220]];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0203" }}>
      <AbsoluteFill style={{ background: `radial-gradient(950px 1050px at 50% 40%, #8E0F12 0%, #3D0608 46%, #0A0203 84%)`, opacity: entra * (1 - libre) }} />
      <AbsoluteFill style={{ background: `radial-gradient(1000px 1150px at 50% 40%, #CFE6FF 0%, #5FB0FF 34%, ${AZUL} 60%, #0C3F8A 100%)`, opacity: libre }} />
      {/* libre: fondo claro, círculo azul y persona con los brazos arriba (sin emojis) */}
      <AbsoluteFill style={{ background: "radial-gradient(1100px 1000px at 50% 34%, #F2F9FF 0%, #B9DCFF 38%, #5AA9FF 72%, #1E6FD9 100%)", opacity: libre }} />
      <AbsoluteFill style={{ opacity: libre * 0.35, transform: `rotate(${t * 8}deg)`, transformOrigin: `${CX}px 700px`, background: `repeating-conic-gradient(from 0deg at ${CX}px 700px, rgba(255,255,255,0.5) 0deg 5deg, transparent 5deg 24deg)`, WebkitMaskImage: `radial-gradient(760px 760px at ${CX}px 700px, black 30%, transparent 78%)` }} />
      <div style={{ position: "absolute", left: CX - 340, top: 360, width: 680, height: 680, borderRadius: 340, background: `radial-gradient(circle at 50% 35%, #4DA6FF 0%, ${AZUL} 45%, #0B5BD3 100%)`, boxShadow: `0 0 120px ${AZUL}cc, 0 30px 60px rgba(8,50,120,0.35)`, opacity: libre, transform: `scale(${0.6 + 0.4 * sale})` }} />
      <div style={{ position: "absolute", inset: 0, opacity: libre, transform: `scale(${0.7 + 0.3 * sale})`, transformOrigin: `${CX}px 1000px` }}><Figura x={CX} y={1000 - Math.sin(t * 3) * 6} h={600} color="#FFFFFF" pose="libre" brillo="rgba(255,255,255,0.6)" /></div>
      {r > 0 && r < 1 && <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - r }}>{trozos.map(([dx, dy, rot], i) => <ellipse key={i} cx={CX + dx * rE * 460} cy={520 + dy * rE * 400 + rE * rE * 260} rx={38} ry={20} fill="none" stroke="#DCE6F2" strokeWidth={12} transform={`rotate(${rot * rE + i * 40} ${CX + dx * rE * 460} ${520 + dy * rE * 400 + rE * rE * 260})`} />)}</svg>}
      {/* persona */}
      <div style={{ transform: `translateX(${tiembla}px) scale(${entra * (1 + rE * 0.08)})`, transformOrigin: `${CX}px ${CY}px`, position: "absolute", inset: 0, opacity: 1 - libre }}>
        <E e="🧑" x={CX} y={CY + 30} t={430} gris={0.55 * (1 - libre)} />
        {/* venda */}
        <div style={{ position: "absolute", left: CX - 205, top: CY - 25 + rE * 520, width: 410, height: 86, borderRadius: 18, background: "linear-gradient(180deg, #1c1c1c, #050505)", boxShadow: "0 10px 24px rgba(0,0,0,0.6)", transform: `rotate(${-4 + rE * 38}deg)`, opacity: 1 - Math.max(0, r - 0.6) * 2.5 }} />
        {/* cadenas sobre la mente */}
        {r === 0 && <><E e="⛓️" x={CX - 20} y={CY - 250} t={250} rot={38} /><E e="⛓️" x={CX + 20} y={CY - 250} t={250} rot={-38} /><E e="🔒" x={CX} y={CY - 255} t={120} /></>}
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(1200px 1500px at 50% 42%, transparent 48%, rgba(0,0,0,${0.72 - libre * 0.6}) 100%)` }} />
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash * 0.9 }} />
      <Grano o={0.14} />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: 1 - fin }} />
    </AbsoluteFill>
  );
};
