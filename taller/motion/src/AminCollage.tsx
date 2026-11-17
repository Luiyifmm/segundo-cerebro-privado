import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Motion graphics de AMIN_1010_01 en estilo collage de recortes (referencias de Pinterest del 10-10-2026):
// papel con cuadrícula, fotos recortadas en blanco y negro con borde blanco, círculo de color con glow detrás y movimiento a saltos (12 por segundo).
// Ambientación: grano, textura de papel, fuga de luz, polvo y viñeta.
const AZUL = "#1E8BFF", ROJO = "#E0221C";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const azar = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BORDE = "drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(0 18px 20px rgba(0,0,0,0.5))";

const Papel: React.FC<{ color: string; linea: string }> = ({ color, linea }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${linea} 2px, transparent 2px), linear-gradient(90deg, ${linea} 2px, transparent 2px)`, backgroundSize: "54px 54px" }} />
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.45 }}><svg width="100%" height="100%"><filter id="pp"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="3" seed="4" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#pp)" /></svg></AbsoluteFill>
  </AbsoluteFill>
);
// Capa de ambiente por encima de todo: fuga de luz, polvo, grano que cambia a saltos y viñeta.
const Ambiente: React.FC<{ luz: string; paso: number; real: number; vin?: number }> = ({ luz, paso, real, vin = 0.7 }) => (
  <>
    <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(900px 700px at ${12 + real * 3}% 6%, ${luz}, transparent 70%), radial-gradient(700px 900px at 96% ${78 - real * 3}%, ${luz}, transparent 70%)`, opacity: 0.55 }} />
    {Array.from({ length: 26 }).map((_, k) => { const s = 3 + azar(k) * 7; return <div key={k} style={{ position: "absolute", left: azar(k + 50) * 1080 + Math.sin(real * 0.8 + k) * 18, top: ((azar(k + 90) * 1920 - real * (18 + azar(k) * 40)) % 1920 + 1920) % 1920, width: s, height: s, borderRadius: s, background: "#fff", opacity: 0.1 + azar(k + 7) * 0.3, filter: `blur(${azar(k + 3) * 3}px)` }} />; })}
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.3 }}><svg width="100%" height="100%"><filter id="gg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={paso % 7} /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#gg)" /></svg></AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(1200px 1500px at 50% 38%, transparent 45%, rgba(0,0,0,${vin}) 100%)` }} />
  </>
);
// Recorte: (x, y) = centro de la base; h = alto en px.
const Recorte: React.FC<{ src: string; x: number; y: number; h: number; ar: number; rot?: number; o?: number; filtro?: string; espejo?: boolean; clip?: string; children?: React.ReactNode }> = ({ src, x, y, h, ar, rot = 0, o = 1, filtro = "", espejo, clip, children }) => (
  <div style={{ position: "absolute", left: x - (h * ar) / 2, top: y - h, height: h, width: h * ar, opacity: o, transform: `rotate(${rot}deg) scaleX(${espejo ? -1 : 1})`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", inset: 0, filter: `${filtro} ${BORDE}` }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", clipPath: clip }} /></div>
    {children}
  </div>
);
const Circulo: React.FC<{ x: number; y: number; r: number; color: string; e?: number; glow?: number }> = ({ x, y, r, color, e = 1, glow = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${e})` }}>
    <div style={{ position: "absolute", inset: -r * 0.45, borderRadius: "50%", background: `radial-gradient(circle, ${color}aa 40%, ${color}00 70%)`, opacity: 0.75 * glow, filter: "blur(30px)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 38% 30%, #ffffff55 0%, ${color} 42%, ${color} 100%)`, boxShadow: `0 0 ${60 * glow}px ${color}, 0 0 ${150 * glow}px ${color}99, inset 0 -40px 80px rgba(0,0,0,0.28)`, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ mixBlendMode: "multiply", opacity: 0.4 }}><filter id="cc"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#cc)" /></svg>
    </div>
  </div>
);
const usarSaltos = () => { const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const paso = Math.floor((frame / fps) * 12); return { frame, t: paso / 12, real: frame / fps, paso, bamboleo: (k: number, g = 1.6) => (azar(paso * 3 + k) - 0.5) * 2 * g, fin: interpolate(frame, [durationInFrames - 4, durationInFrames - 1], [1, 0], clamp) }; };
const pop = (t: number, a: number) => interpolate(t, [a, a + 0.09, a + 0.18], [0, 1.12, 1], clamp);

export const EscuelaCollage: React.FC = () => {
  const { t, real, paso, frame, bamboleo, fin } = usarSaltos(), GY = 1010;
  const nino = interpolate(t, [0.08, 0.92], [0, 1], clamp), sale = interpolate(t, [1.1, 1.95], [0, 1], clamp), f3 = interpolate(t, [2.05, 2.3], [0, 1], clamp), jefe = interpolate(t, [2.1, 2.4], [0, 1], clamp);
  const EX = 150 + f3 * 170, EW = 780, EH = 585, PX = EX + EW * 0.765;
  const linea = interpolate(real, [2.42, 2.62], [0, 1], clamp), parpadeo = real > 2.62 ? 0.8 + 0.2 * Math.sin(frame * 1.9) * (azar(frame) > 0.2 ? 1 : 0.3) : 1, pulso = 1 + 0.03 * Math.sin(real * 6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A1428" }}>
      <Papel color="#0B1730" linea="rgba(120,160,230,0.10)" />
      <Circulo x={540 + f3 * 170} y={640} r={350} color={AZUL} e={pop(t, 0) * (1 - f3 * 0.25) * pulso} glow={1 - f3 * 0.5} />
      {t >= 2.1 && <Circulo x={300} y={540} r={340} color={ROJO} e={pop(t, 2.1) * pulso} glow={1.2} />}
      {/* escuela: foto recortada con tijera */}
      <div style={{ position: "absolute", left: EX, top: GY - EH + 30, width: EW, height: EH, transform: `scale(${pop(t, 0.04) * (1 - f3 * 0.3)}) rotate(${bamboleo(1, 0.5)}deg)`, transformOrigin: "50% 100%", filter: `${BORDE} brightness(${1 - f3 * 0.55})` }}>
        <Img src={staticFile("amin2/escuela.jpg")} style={{ width: EW, height: EH, clipPath: "polygon(11% 90%, 11% 45%, 21% 33%, 24.5% 32%, 24.5% 24.5%, 30% 24.5%, 30% 30%, 44% 28%, 44% 11%, 50% 4%, 56.5% 11%, 56.5% 25.5%, 88.5% 21.5%, 91% 82%, 82% 90%)" }} />
      </div>
      <div style={{ position: "absolute", left: EX + EW * 0.63, top: GY - EH + 30 + EH * 0.39, opacity: (1 - f3) * Math.min(1, pop(t, 0.2)), transform: `rotate(${-5 + bamboleo(2, 1)}deg) scale(${pop(t, 0.2)})`, background: "#F3EFE6", color: "#111", fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: 4, padding: "8px 18px", boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }}>ESCUELA</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: GY, height: 5, background: "rgba(255,255,255,0.8)", boxShadow: `0 0 18px ${AZUL}` }} />
      {/* niña con mochila que entra */}
      {nino < 1 && <Recorte src="amin2/nino.png" ar={518 / 1254} x={70 + nino * (PX - 70)} y={GY + 6 - Math.abs(Math.sin(nino * 16)) * 14} h={330 * (1 - Math.max(0, nino - 0.8) * 2.2)} rot={bamboleo(3, 3)} o={1 - Math.max(0, nino - 0.86) * 7} />}
      {/* empleado gris que sale */}
      {t >= 1.1 && t < 2.5 && <Recorte src="amin2/empleado.png" ar={472 / 1106} x={PX + sale * (930 - PX)} y={GY + 6} h={200 + sale * 240} rot={5 + bamboleo(4, 2)} o={Math.min(1, sale * 5)} filtro="brightness(0.75) contrast(0.9)" />}
      {/* jefe enorme: sombra negra en la cabeza y línea con glow en los ojos */}
      {t >= 2.1 && <Recorte src="amin2/jefe.png" ar={856 / 1346} x={300} y={GY + 4 + (1 - jefe) * 900} h={840} rot={bamboleo(5, 0.6)} filtro="contrast(1.1) brightness(0.92)">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.9) 9%, rgba(0,0,0,0.55) 17%, rgba(0,0,0,0) 30%)", WebkitMaskImage: `url(${staticFile("amin2/jefe.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile("amin2/jefe.png")})`, maskSize: "100% 100%" }} />
        <div style={{ position: "absolute", left: "37%", top: "11.7%", width: `${31 * linea}%`, height: 12, borderRadius: 6, background: "#fff", opacity: parpadeo, boxShadow: `0 0 10px #fff, 0 0 26px ${ROJO}, 0 0 60px ${ROJO}, 0 0 110px ${ROJO}` }} />
      </Recorte>}
      {/* empleado de rodillas mirando al jefe */}
      {t >= 2.5 && <Recorte src="amin2/arrodillado.png" ar={420 / 590} x={820} y={GY + 14} h={400 * pop(t, 2.5)} rot={bamboleo(6, 1.2)} filtro="brightness(0.9)" clip="polygon(0 0, 80% 0, 84% 40%, 96% 56%, 100% 100%, 0 100%)" />}
      <Ambiente luz={f3 > 0.5 ? "rgba(224,34,28,0.35)" : "rgba(30,139,255,0.35)"} paso={paso} real={real} />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: 1 - fin }} />
    </AbsoluteFill>
  );
};

const Eslabon: React.FC<{ x: number; y: number; rot: number; o?: number; e?: number }> = ({ x, y, rot, o = 1, e = 1 }) => (
  <svg width={150} height={90} style={{ position: "absolute", left: x - 75, top: y - 45, transform: `rotate(${rot}deg) scale(${e})`, opacity: o, filter: "drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(0 8px 8px rgba(0,0,0,0.5))" }}>
    <defs><linearGradient id="met" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9E9E9" /><stop offset="0.5" stopColor="#8B8B8B" /><stop offset="1" stopColor="#3C3C3C" /></linearGradient></defs>
    <rect x={14} y={16} width={122} height={58} rx={29} fill="none" stroke="url(#met)" strokeWidth={20} />
  </svg>
);

export const CadenasCollage: React.FC<{ rompe: number }> = ({ rompe }) => {
  const { t, real, paso, bamboleo, fin, frame } = usarSaltos(), CX = 540, CY = 700;
  const libre = real >= rompe, r = interpolate(t, [rompe, rompe + 0.6], [0, 1], clamp), flash = interpolate(real, [rompe - 0.02, rompe + 0.04, rompe + 0.3], [0, 1, 0], clamp);
  const tiembla = !libre && t > rompe - 0.55 ? (azar(frame) - 0.5) * 22 * interpolate(real, [rompe - 0.55, rompe], [0.2, 1], clamp) : 0, pulso = 1 + 0.03 * Math.sin(real * 6);
  const cadena = [-3, -2, -1, 0, 1, 2, 3], HY = 500;
  return (
    <AbsoluteFill style={{ backgroundColor: "#12060A" }}>
      {!libre && <Papel color="#24080B" linea="rgba(255,120,120,0.09)" />}
      {libre && <Papel color="#1958C4" linea="rgba(200,225,255,0.13)" />}
      {!libre && <>
        <Circulo x={CX} y={CY} r={400} color={ROJO} e={pop(t, 0) * pulso} glow={1.2} />
        <div style={{ position: "absolute", left: CX - 330 + tiembla, top: CY - 345, width: 660, height: 690, transform: `scale(${pop(t, 0.05)}) rotate(${bamboleo(1, 0.7)}deg)`, borderRadius: "48% 48% 46% 46%", overflow: "hidden", filter: BORDE }}><Img src={staticFile("amin2/venda.png")} style={{ width: 660, height: 704, objectFit: "cover", filter: "contrast(1.15)" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)" }} /></div>
        {cadena.map((k) => <Eslabon key={"a" + k} x={CX + k * 98 + tiembla} y={CY - 250 + k * 34} rot={19 + (k % 2 ? 0 : 8) + bamboleo(10 + k, 2)} e={pop(t, 0.18 + (k + 3) * 0.03)} />)}
        {cadena.map((k) => <Eslabon key={"b" + k} x={CX + k * 98 - tiembla} y={CY - 250 - k * 34} rot={-19 - (k % 2 ? 0 : 8) + bamboleo(20 + k, 2)} e={pop(t, 0.24 + (k + 3) * 0.03)} />)}
        <div style={{ position: "absolute", left: CX - 62, top: CY - 300, width: 124, height: 104, borderRadius: 16, background: "linear-gradient(180deg,#E6E6E6,#6A6A6A)", border: "5px solid #fff", boxShadow: `0 10px 12px rgba(0,0,0,0.5), 0 0 40px ${ROJO}`, transform: `scale(${pop(t, 0.5)}) rotate(${bamboleo(30, 3) + tiembla * 0.3}deg)` }}><div style={{ position: "absolute", left: 22, top: -62, width: 70, height: 70, borderRadius: "40px 40px 0 0", border: "14px solid #9A9A9A", borderBottom: "none" }} /><div style={{ position: "absolute", left: 50, top: 34, width: 24, height: 24, borderRadius: 12, background: "#222" }} /><div style={{ position: "absolute", left: 57, top: 50, width: 10, height: 28, background: "#222" }} /></div>
      </>}
      {libre && <>
        {/* círculo desde el pecho hasta un poco por encima de la cabeza */}
        <Circulo x={CX} y={HY} r={255} color="#58AEFF" e={pop(t, rompe) * pulso} glow={1.5} />
        {Array.from({ length: 14 }).map((_, k) => <div key={k} style={{ position: "absolute", left: CX - 6, top: HY - 430, width: 12, height: 110, background: "#fff", borderRadius: 6, transformOrigin: "6px 430px", transform: `rotate(${-104 + k * 16 + bamboleo(40 + k, 2)}deg) scaleY(${pop(t, rompe + 0.12 + k * 0.01)})`, opacity: 0.9, boxShadow: "0 0 18px #9FD0FF" }} />)}
        <Recorte src="amin2/libre.png" ar={640 / 800} x={CX} y={1480 + (1 - pop(t, rompe + 0.04)) * 300} h={1400} rot={bamboleo(50, 0.7)} filtro="contrast(1.5) brightness(0.62)" />
        {r < 1 && cadena.concat([4, 5]).map((k) => <Eslabon key={"c" + k} x={CX + (azar(k + 9) - 0.5) * 2 * (200 + r * 700)} y={480 + (azar(k + 30) - 0.6) * 300 + r * r * 900 * (0.5 + azar(k))} rot={azar(k + 60) * 360 + r * 300} o={1 - r} e={0.8} />)}
      </>}
      <Ambiente luz={libre ? "rgba(160,210,255,0.45)" : "rgba(224,34,28,0.35)"} paso={paso} real={real} vin={libre ? 0.45 : 0.75} />
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: 1 - fin }} />
    </AbsoluteFill>
  );
};
