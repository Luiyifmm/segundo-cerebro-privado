import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palabras from "./palabras.json";

// Estilo "elegante" (referencia: sprojectagency.com): subtítulo pequeño blanco + palabra clave en serif cursiva de un solo color,
// entradas con desenfoque, miniaturas redondeadas, zooms de plano y gráficos de línea fina.
const CREMA = "#F4DFA4";
const SANS = "MontserratE", SERIF = "Nyght";
const FUENTES: [string, string][] = [[SANS, "marca/f/montserrat-semibold.ttf"], [SERIF, "marca/f/nyght-italic.otf"]];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Capa = any;
type Palabra = { t: string; a: number; b: number };
const P = palabras as Palabra[];

const useFuentes = () => {
  const [h] = useState(() => delayRender("fuentes elegante"));
  useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
};
// Entrada con desenfoque: 0 → 1 en `dur` fotogramas desde el segundo `a`
const useEntrada = (a: number, dur = 7) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  return interpolate(frame - Math.round(a * fps), [0, dur], [0, 1], clamp);
};
const suave = (x: number) => 1 - Math.pow(1 - x, 3);

// Base: el vídeo original con cortes de zoom (plano abierto / cerrado) y un empuje lento, más un degradado oscuro arriba
const ZOOMS: [number, number][] = [[0, 1], [4.9, 1.28], [7.66, 1], [8.94, 1.22], [11.56, 1], [13.56, 1.5], [15.6, 1], [19.8, 1.5], [21.68, 1.22], [24.56, 1]];
export const BaseElegante: React.FC<{ c: Capa }> = ({ c }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps;
  let i = 0;
  for (let k = 0; k < ZOOMS.length; k++) if (t >= ZOOMS[k][0] - 0.001) i = k;
  const fin = i + 1 < ZOOMS.length ? ZOOMS[i + 1][0] : c.b;
  const z = ZOOMS[i][1] * (1 + 0.035 * ((t - ZOOMS[i][0]) / (fin - ZOOMS[i][0])));
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo muted src={staticFile("clientea/base.mp4")} style={{ position: "absolute", width: "100%", height: "100%", transform: `scale(${z})`, transformOrigin: "520px 800px" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 22%, rgba(0,0,0,0) 46%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.3) 100%)" }} />
    </AbsoluteFill>
  );
};

// Subtítulos
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");
const CLAVES = new Set(["noche", "vida", "cosa", "respetan", "tiempo", "prosperar", "innegable", "proyectas", "adentro", "afuera", "mundo", "tratar", "valorar", "sigueme"]);
const LINEAS = (() => {
  const out: Palabra[][] = []; let cur: Palabra[] = [];
  for (const p of P) { const prev = cur[cur.length - 1]; if (prev && (cur.length >= 3 || p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) { out.push(cur); cur = []; } cur.push(p); }
  if (cur.length) out.push(cur);
  // una palabra clave suelta se une a la línea anterior: "para toda la / vida"
  const o2: Palabra[][] = [];
  for (const l of out) { const u = o2[o2.length - 1]; if (u && l.length === 1 && CLAVES.has(norm(l[0].t)) && l[0].a - u[u.length - 1].b < 0.35 && !u.some((p) => CLAVES.has(norm(p.t)))) u.push(l[0]); else o2.push([...l]); }
  return o2;
})();
const limpia = (s: string) => s.replace(/[.,?¿]/g, "").toLowerCase();

export const SubsElegantes: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps;
  let l: Palabra[] | null = null;
  for (let i = LINEAS.length - 1; i >= 0; i--) if (t >= LINEAS[i][0].a - 0.04) { l = t < LINEAS[i][LINEAS[i].length - 1].b + 0.35 ? LINEAS[i] : null; break; }
  if (!l) return null;
  const filas: { clave: boolean; ps: Palabra[] }[] = [];
  for (const p of l) { const k = CLAVES.has(norm(p.t)); const u = filas[filas.length - 1]; if (!k && u && !u.clave) u.ps.push(p); else filas.push({ clave: k, ps: [p] }); }
  const color = c.color || CREMA;
  return (
    <div style={{ position: "absolute", top: c.y, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
      {filas.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: 13, marginTop: f.clave && i ? -6 : i ? 4 : 0 }}>
          {f.ps.map((p, j) => {
            const e = suave(interpolate(frame - Math.round((p.a - 0.04) * fps), [0, f.clave ? 7 : 5], [0, 1], clamp));
            return f.clave ? (
              <span key={j} style={{ fontFamily: SERIF, fontSize: 112, letterSpacing: -2, color, textShadow: "0 4px 26px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.45)", opacity: e, filter: `blur(${(1 - e) * 14}px)`, transform: `scale(${1.08 - 0.08 * e})`, paddingBottom: 10 }}>{limpia(p.t)}</span>
            ) : (
              <span key={j} style={{ fontFamily: SANS, fontSize: 46, letterSpacing: -1.6, color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.4)", opacity: e, filter: `blur(${(1 - e) * 8}px)`, transform: `translateY(${(1 - e) * 6}px)` }}>{limpia(p.t)}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Miniatura redondeada, algo inclinada, con el rótulo dentro
export const Miniatura: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const e = suave(useEntrada(c.a, 9));
  const s = interpolate(frame, [Math.round(c.b * fps) - 5, Math.round(c.b * fps) - 1], [1, 0], clamp);
  const deriva = 1 + 0.03 * ((frame / fps - c.a) / (c.b - c.a));
  return (
    <div style={{ position: "absolute", left: c.cx - c.w / 2, top: c.cy - c.h / 2, width: c.w, height: c.h, borderRadius: 38, overflow: "hidden", opacity: e * s, filter: `blur(${(1 - e) * 16}px)`, transform: `rotate(${c.rot}deg) scale(${0.9 + 0.1 * e}) translateY(${(1 - e) * 26}px)`, boxShadow: "0 22px 60px rgba(0,0,0,0.45)", border: c.bueno && c.color ? `3px solid ${c.color}` : "2px solid rgba(255,255,255,0.75)", boxSizing: "border-box" }}>
      <Img src={staticFile("clientea/" + c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${deriva})`, filter: c.bueno ? "none" : "saturate(0.55) brightness(0.9)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.78))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: SERIF, fontSize: 40, letterSpacing: -0.5, color: c.bueno ? c.color || CREMA : "white" }}>{c.etiqueta}</div>
    </div>
  );
};

// "vs" pequeño entre las dos miniaturas
export const Versus: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const e = suave(useEntrada(c.a, 8));
  return <div style={{ position: "absolute", left: 0, right: 0, top: c.y, textAlign: "center", fontFamily: SANS, fontSize: 34, letterSpacing: 6, color: "white", opacity: 0.9 * e, filter: `blur(${(1 - e) * 8}px)`, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>VS</div>;
};

// Gráfico de línea fina: lo que proyectas → lo que atraes; después "adentro / afuera" (círculos concéntricos)
export const Espejo: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps;
  const e = suave(useEntrada(c.a, 12));
  const viaje = suave(interpolate(t, [c.viaje, c.viaje + 1.1], [0, 1], clamp));
  const junta = suave(interpolate(t, [c.junta, c.junta + 0.6], [0, 1], clamp));
  const sale = interpolate(t, [c.b - 0.2, c.b - 0.03], [1, 0], clamp);
  const L = 2 * Math.PI * 118;
  const xi = 330 + (540 - 330) * junta, xd = 750 + (540 - 750) * junta;
  const ri = 118 - 44 * junta, rd = 118 + 52 * junta;
  const px = 330 + (750 - 330) * viaje, py = 400 - Math.sin(viaje * Math.PI) * 150;
  const rot = (txt: string, x: number, y: number, o: number, serif = false) => (
    <div style={{ position: "absolute", left: x - 220, width: 440, top: y, textAlign: "center", fontFamily: serif ? SERIF : SANS, fontSize: serif ? 46 : 24, letterSpacing: serif ? -0.5 : 4, color: serif ? CREMA : "white", opacity: o, textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: e * sale, filter: `blur(${(1 - e) * 10}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={xi} cy={400} r={ri} fill="none" stroke="white" strokeWidth={3} strokeDasharray={L} strokeDashoffset={L * (1 - e)} transform={`rotate(-90 ${xi} 400)`} />
        <circle cx={xd} cy={400} r={rd} fill="none" stroke={CREMA} strokeWidth={3} strokeDasharray={L * 1.6} strokeDashoffset={L * 1.6 * (1 - e)} transform={`rotate(-90 ${xd} 400)`} />
        {viaje > 0 && viaje < 1 && <circle cx={px} cy={py} r={9} fill={CREMA} />}
      </svg>
      {rot("LO QUE PROYECTAS", 330, 548, 1 - junta)}
      {rot("LO QUE ATRAES", 750, 548, viaje * (1 - junta))}
      {rot("adentro", 540, 372, junta, true)}
      {rot("AFUERA", 540, 592, junta)}
    </AbsoluteFill>
  );
};

// Píldora de "seguir" para el cierre
export const Seguir: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const e = suave(useEntrada(c.a, 9));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: c.y, display: "flex", justifyContent: "center", opacity: e, filter: `blur(${(1 - e) * 12}px)`, transform: `translateY(${(1 - e) * 20}px) scale(${0.94 + 0.06 * e})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "white", borderRadius: 70, padding: "16px 20px 16px 34px", boxShadow: "0 18px 50px rgba(0,0,0,0.4)" }}>
        <span style={{ fontFamily: SANS, fontSize: 42, letterSpacing: -1.2, color: "#111" }}>@{c.cuenta}</span>
        <span style={{ fontFamily: SANS, fontSize: 30, letterSpacing: -0.5, color: "white", background: "#111", borderRadius: 50, padding: "14px 28px" }}>Seguir</span>
      </div>
    </div>
  );
};

// Motion graphics a pantalla completa sobre un fondo oscuro sencillo (negro de marca con un resplandor del color de acento y trama de puntos)
const Fondo: React.FC<{ color: string; t: number }> = ({ color, t }) => (
  <AbsoluteFill style={{ backgroundColor: "#06080C" }}>
    <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${50 + Math.sin(t * 0.5) * 4}% ${38 + Math.cos(t * 0.4) * 2}%, ${color}55 0%, ${color}18 42%, transparent 72%)` }} />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" }} />
    <AbsoluteFill style={{ background: "radial-gradient(1200px 1500px at 50% 45%, transparent 45%, rgba(0,0,0,0.7) 100%)" }} />
  </AbsoluteFill>
);
const FondoPapel: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ backgroundColor: "#F3F0E8" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(20,20,20,0.07) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(20,20,20,0.07) 1.5px, transparent 1.5px)", backgroundSize: "90px 90px", backgroundPosition: `${45 + t * 6}px 30px`, WebkitMaskImage: "radial-gradient(620px 760px at 50% 42%, black 30%, transparent 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(1100px 1400px at 50% 42%, transparent 50%, rgba(120,110,95,0.35) 100%)" }} />
  </AbsoluteFill>
);
// Detalles de "póster técnico": cruces, numeración, rótulo y código de barras (dentro de las zonas seguras)
const BARRAS = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2];
const Detalles: React.FC<{ tinta: string; n: string; rotulo: string; o: number }> = ({ tinta, n, rotulo, o }) => (
  <AbsoluteFill style={{ opacity: o * 0.75, color: tinta, fontFamily: SANS }}>
    <div style={{ position: "absolute", left: 90, top: 250, fontSize: 22, letterSpacing: 5 }}>{rotulo}</div>
    <div style={{ position: "absolute", right: 170, top: 244, fontSize: 30, letterSpacing: 2, fontFamily: SERIF }}>{n}</div>
    <div style={{ position: "absolute", left: 90, top: 292, width: 820, height: 1.5, background: tinta, opacity: 0.5, transform: `scaleX(${o})`, transformOrigin: "left" }} />
    {[[90, 1120], [890, 1120]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 34, lineHeight: 1, fontFamily: "Helvetica", fontWeight: 200 }}>+</div>)}
    <div style={{ position: "absolute", left: 90, top: 1410, display: "flex", gap: 4, alignItems: "flex-end", height: 54 }}>{BARRAS.map((w, i) => <div key={i} style={{ width: w * 3, height: 54, background: tinta }} />)}</div>
    <div style={{ position: "absolute", left: 400, top: 1412, fontSize: 15, letterSpacing: 3, lineHeight: 1.5, opacity: 0.8 }}>CLIENTE-A BUSINESS<br />LO QUE PROYECTAS, ATRAES</div>
  </AbsoluteFill>
);
const Rot: React.FC<{ x: number; y: number; o: number; children: React.ReactNode; serif?: boolean; color?: string; tam?: number }> = ({ x, y, o, children, serif, color = "white", tam }) => (
  <div style={{ position: "absolute", left: x - 400, width: 800, top: y, textAlign: "center", fontFamily: serif ? SERIF : SANS, fontSize: tam || (serif ? 78 : 27), letterSpacing: serif ? -1 : 6, color, opacity: o, filter: `blur(${(1 - Math.min(1, o)) * 8}px)` }}>{children}</div>
);
export const MgPantalla: React.FC<{ c: Capa }> = ({ c }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = frame / fps, color = c.color || CREMA;
  const e = suave(interpolate(frame - Math.round(c.a * fps), [0, 7], [0, 1], clamp));
  const sale = interpolate(t, [c.b - 0.2, c.b - 0.034], [1, 0], clamp);
  const en = (a: number, d = 0.5) => suave(interpolate(t, [a, a + d], [0, 1], clamp));
  let dentro: React.ReactNode = null;
  if (c.que === "proyectas") {
    const dib = en(c.a + 0.1, 0.8), viaje = en(c.viaje, 1.1), junta = c.junta ? en(c.junta, 0.7) : 0, CY = 760;
    const xi = 320 + 220 * junta, xd = 760 - 220 * junta, ri = 170 - 50 * junta, rd = 170 + 90 * junta;
    const L = 2 * Math.PI * 260;
    const px = 320 + 440 * viaje, py = CY - Math.sin(viaje * Math.PI) * 230;
    dentro = (
      <>
        <Detalles tinta="white" n="01" rotulo="LA REGLA" o={dib} />
        <svg width={1080} height={1920} style={{ position: "absolute", filter: `drop-shadow(0 0 14px ${color}aa)` }}>
          <circle cx={xi} cy={CY} r={ri} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} strokeDasharray={L} strokeDashoffset={L * (1 - dib)} transform={`rotate(-90 ${xi} ${CY})`} />
          <circle cx={xd} cy={CY} r={rd} fill={`${color}14`} stroke={color} strokeWidth={2.5} strokeDasharray={L} strokeDashoffset={L * (1 - dib)} transform={`rotate(-90 ${xd} ${CY})`} />
          {viaje > 0 && viaje < 1 && <><circle cx={px} cy={py} r={26} fill={`${color}33`} /><circle cx={px} cy={py} r={10} fill={color} /></>}
          <circle cx={540} cy={CY} r={7} fill="white" opacity={junta} />
        </svg>
        <Rot x={320} y={CY + 205} o={dib * (1 - junta)}>LO QUE PROYECTAS</Rot>
        <Rot x={760} y={CY + 205} o={viaje * (1 - junta)} color={color}>LO QUE ATRAES</Rot>
        <Rot x={540} y={CY - 76} o={junta}>ADENTRO</Rot>
        <Rot x={540} y={CY + 292} o={junta} color={color}>AFUERA</Rot>
      </>
    );
  } else if (c.que === "dentro") {
    // fondo de papel: círculos concéntricos en tinta y azul
    const dib = en(c.a + 0.05, 0.7), fuera = en(c.fuera, 0.6), CY = 760, L = 2 * Math.PI * 300;
    dentro = (
      <>
        <Detalles tinta="#141414" n="02" rotulo="COMO ES ADENTRO" o={dib} />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <circle cx={540} cy={CY} r={290 * (0.86 + 0.14 * fuera)} fill={`${color}16`} stroke={color} strokeWidth={3} strokeDasharray={L} strokeDashoffset={L * (1 - fuera)} transform={`rotate(-90 540 ${CY})`} />
          <circle cx={540} cy={CY} r={300} fill="none" stroke="#141414" strokeWidth={1.5} strokeDasharray="2 14" opacity={0.5 * fuera} transform={`rotate(${t * 12} 540 ${CY})`} />
          <circle cx={540} cy={CY} r={118} fill="#141414" opacity={dib} transform={`scale(${0.7 + 0.3 * dib})`} style={{ transformOrigin: `540px ${CY}px` }} />
        </svg>
        <Rot x={540} y={CY - 18} o={dib}>ADENTRO</Rot>
        <Rot x={540} y={CY + 205} o={fuera} color={color}>AFUERA</Rot>
      </>
    );
  } else if (c.que === "persona") {
    // el propio ClienteA recortado en blanco y negro sobre negro, con un círculo azul detrás y dos barras arriba
    const ap = en(c.a + 0.05, 0.6);
    const filas = [{ y: 300, txt: "CÓMO TE TRATAN", a: c.t1, hasta: 0.8 }, { y: 410, txt: "CÓMO TE VALORAN", a: c.t2, hasta: 0.97 }];
    dentro = (
      <>
        <div style={{ position: "absolute", left: 540 - 400, top: 900 - 400, width: 800, height: 800, borderRadius: 400, background: `radial-gradient(circle at 50% 40%, ${color}, ${color}66 70%, ${color}22)`, transform: `scale(${0.6 + 0.4 * ap})`, opacity: ap, boxShadow: `0 0 160px ${color}66` }} />
        <OffthreadVideo transparent muted src={staticFile("clientea/persona.webm")} style={{ position: "absolute", width: "100%", height: "100%", transform: "scale(1.22)", transformOrigin: "520px 800px", filter: "grayscale(1) contrast(1.15) drop-shadow(0 20px 50px rgba(0,0,0,0.6))" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, #06080C 92%)" }} />
        {filas.map((f, i) => {
          const a2 = en(c.a + 0.2 + i * 0.15), k = en(f.a, 0.9) * f.hasta, W = 560, X = 260;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: X, top: f.y, fontFamily: SANS, fontSize: 23, letterSpacing: 5, color: "white", opacity: a2 * 0.9 }}>{f.txt}</div>
              <div style={{ position: "absolute", left: X, top: f.y + 52, width: W * a2, height: 2, background: "rgba(255,255,255,0.3)" }} />
              <div style={{ position: "absolute", left: X, top: f.y + 50, width: W * k, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 26px ${color}` }} />
              <div style={{ position: "absolute", left: X + W * k - 11, top: f.y + 42, width: 22, height: 22, borderRadius: 11, background: "white", opacity: a2 }} />
            </React.Fragment>
          );
        })}
      </>
    );
  } else if (c.que === "valor") {
    const filas = [{ y: 720, txt: "CÓMO TE TRATAN", a: c.t1, hasta: 0.82 }, { y: 930, txt: "CÓMO TE VALORAN", a: c.t2, hasta: 0.96 }];
    dentro = (
      <>
        <Rot x={540} y={450} o={en(c.a + 0.1)} serif>cómo te presentas</Rot>
        <Rot x={540} y={572} o={en(c.a + 0.3)}>DICTA</Rot>
        {filas.map((f, i) => {
          const ap = en(c.a + 0.35 + i * 0.15), k = en(f.a, 0.9) * f.hasta, W = 720, X = 180;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: X, top: f.y, fontFamily: SANS, fontSize: 27, letterSpacing: 6, color: "white", opacity: ap * 0.85 }}>{f.txt}</div>
              <div style={{ position: "absolute", left: X, top: f.y + 66, width: W * ap, height: 2, background: "rgba(255,255,255,0.28)" }} />
              <div style={{ position: "absolute", left: X, top: f.y + 64, width: W * k, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 26px ${color}` }} />
              <div style={{ position: "absolute", left: X + W * k - 13, top: f.y + 54, width: 26, height: 26, borderRadius: 13, background: "white", opacity: ap, boxShadow: `0 0 0 8px ${color}44` }} />
            </React.Fragment>
          );
        })}
      </>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: e * sale }}>
      {c.que === "dentro" ? <FondoPapel t={t} /> : <Fondo color={color} t={t} />}
      <AbsoluteFill style={{ transform: `scale(${1.04 - 0.04 * e})` }}>{dentro}</AbsoluteFill>
    </AbsoluteFill>
  );
};
