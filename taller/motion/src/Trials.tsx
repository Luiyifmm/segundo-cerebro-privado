import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Abundancia } from "./Abundancia";
import { Cta } from "./Cta";
import subsJson from "./t1009-subs.json";
import palabrasJson from "./t1009-palabras.json";

// Los 20 formatos de Trials sobre un mismo reel (AMIN_1009_01). Un único componente con una ficha por formato:
// dónde va el vídeo, qué fondo lleva, cómo entran las imágenes y qué tipo de subtítulo usa.
const AZUL = "#1E8BFF";
const B = "SFB", M = "SFM", S = "Nyght";
const FUENTES: [string, string][] = [[B, "marca/f/sfpro-bold.otf"], [M, "marca/f/sfpro-medium.otf"], [S, "marca/f/nyght-italic.otf"]];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (x: number) => 1 - Math.pow(1 - x, 3);
type Sub = { a: number; b: number; fin: number; linea: string; clave: string; retraso: number };
type Pal = { t: string; a: number; b: number };
const SUBS = (subsJson as Sub[]).map((s) => ({ ...s, linea: s.linea.trim().replace(/\s+/g, " ") }));
const PAL = palabrasJson as Pal[];
const DUR = 1178 / 30, CARA = { x: 513, y: 835 }, PECHO = 1075;
const PARES = [[0, 2.23, 3.87], [3.87, 5.43, 6.63], [6.63, 8.9, 10.13], [10.13, 11.8, 13.17], [13.17, 15.1, 17.03], [17.03, 18.17, 19.47]];
const CORTES = [0, 3.87, 6.63, 10.13, 13.2, 17.03, 19.47, 22.7, 26.13, 28.7, 32.87, 36.93];
const TITULO = ["Mentalidad de pobre", "vs mentalidad de rico"];
const CLAVES = new Set(SUBS.filter((s) => s.clave).map((s) => s.clave));

type Ficha = {
  nombre: string; area: { x: number; y: number; w: number; h: number; r?: number }; fondo: string; titulo: "barra" | "dentro" | "no";
  subs: "compacto" | "palabra" | "frase"; imgs: "arriba" | "columna" | "mini" | "mitad" | "caen" | "estudio" | "no";
  zoom?: number; cx?: number; glow?: boolean; bn?: boolean; portada?: boolean; bucle?: boolean; vel?: number; punch?: boolean; corto?: number; mg?: boolean; gigante?: boolean; recorte?: boolean; subsY?: number;
};
const BARRAS = { x: 0, y: 330, w: 1080, h: 1260 }, TODO = { x: 0, y: 0, w: 1080, h: 1920 }, TARJETA = { x: 60, y: 350, w: 960, h: 1220, r: 52 };
export const FICHAS: Record<number, Ficha> = {
  1: { nombre: "Base con barras", area: BARRAS, fondo: "#000", titulo: "barra", subs: "compacto", imgs: "arriba" },
  2: { nombre: "Pantalla completa", area: TODO, fondo: "#000", titulo: "dentro", subs: "compacto", imgs: "arriba" },
  3: { nombre: "Tarjeta redondeada", area: TARJETA, fondo: "#050505", titulo: "barra", subs: "compacto", imgs: "arriba" },
  4: { nombre: "Tarjeta con brillo azul", area: TARJETA, fondo: "#03060C", titulo: "barra", subs: "compacto", imgs: "arriba", glow: true },
  5: { nombre: "Fondo desenfocado", area: TARJETA, fondo: "blur", titulo: "barra", subs: "compacto", imgs: "arriba" },
  6: { nombre: "Azul noche", area: BARRAS, fondo: "#0A1730", titulo: "barra", subs: "compacto", imgs: "arriba" },
  7: { nombre: "Blanco y negro con azul", area: BARRAS, fondo: "#000", titulo: "barra", subs: "compacto", imgs: "arriba", bn: true },
  8: { nombre: "Primer plano", area: TODO, fondo: "#000", titulo: "no", subs: "compacto", imgs: "mini", zoom: 1.5 },
  9: { nombre: "Descentrado", area: TODO, fondo: "#000", titulo: "dentro", subs: "compacto", imgs: "columna", zoom: 1.42, cx: 0.29 },
  10: { nombre: "Palabra a palabra", area: BARRAS, fondo: "#000", titulo: "barra", subs: "palabra", imgs: "arriba" },
  11: { nombre: "Frase entera", area: BARRAS, fondo: "#000", titulo: "barra", subs: "frase", imgs: "arriba", subsY: 1640 },
  12: { nombre: "Portada y bucle", area: BARRAS, fondo: "#000", titulo: "barra", subs: "compacto", imgs: "arriba", portada: true, bucle: true },
  13: { nombre: "Rapido", area: BARRAS, fondo: "#000", titulo: "barra", subs: "compacto", imgs: "arriba", vel: 1.1, punch: true },
  14: { nombre: "Corto", area: BARRAS, fondo: "#000", titulo: "barra", subs: "compacto", imgs: "arriba", corto: 19.47 },
  15: { nombre: "Pantalla partida", area: { x: 0, y: 860, w: 1080, h: 1060 }, fondo: "#06080C", titulo: "no", subs: "compacto", imgs: "mitad", zoom: 1.05 },
  16: { nombre: "Estudio", area: TODO, fondo: "estudio", titulo: "dentro", subs: "compacto", imgs: "estudio", recorte: true, zoom: 1.14 },
  17: { nombre: "Miniaturas elegantes", area: TODO, fondo: "#000", titulo: "no", subs: "compacto", imgs: "mini" },
  18: { nombre: "Poster", area: TODO, fondo: "#000", titulo: "no", subs: "compacto", imgs: "arriba", mg: true },
  19: { nombre: "Palabra gigante", area: TODO, fondo: "estudio", titulo: "no", subs: "compacto", imgs: "estudio", recorte: true, gigante: true, zoom: 1.14 },
  20: { nombre: "Fotos que caen", area: TODO, fondo: "#000", titulo: "dentro", subs: "compacto", imgs: "caen" },
};
export const framesDe = (n: number) => { const f = FICHAS[n]; return Math.round(((f.corto ?? DUR) / (f.vel ?? 1)) * 30); };

const useFuentes = () => {
  const [h] = useState(() => delayRender("fuentes trials"));
  useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
};

// Colocación del vídeo dentro de su zona: escala para cubrir y la cara en un punto fijo
const encaje = (f: Ficha, zoom: number) => {
  const { w, h } = f.area, s = Math.max(w / 1080, h / 1920) * zoom, cx = w * (f.cx ?? 0.5), cy = h * 0.42;
  const left = Math.min(0, Math.max(w - 1080 * s, cx - CARA.x * s)), top = Math.min(0, Math.max(h - 1920 * s, cy - CARA.y * s));
  return { s, left, top };
};

const Tarjeta: React.FC<{ src: string; x: number; y: number; w: number; h: number; a: number; b: number; t: number; rot?: number; bn?: boolean; borde?: string; modo?: string; pie?: string }> = ({ src, x, y, w, h, a, b, t, rot = 0, bn, borde = "white", modo = "sube", pie }) => {
  if (t < a || t >= b) return null;
  const e = suave(interpolate(t, [a, a + 0.3], [0, 1], clamp)), sale = interpolate(t, [b - 0.15, b - 0.02], [1, 0], clamp);
  const tr = modo === "cae" ? `translateY(${(1 - e) * -420}px) rotate(${rot + (1 - e) * 14}deg)` : `translateY(${(1 - e) * 34}px) rotate(${rot}deg) scale(${0.94 + 0.06 * e})`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden", border: `3px solid ${borde}`, boxSizing: "border-box", boxShadow: "0 18px 46px rgba(0,0,0,0.45)", opacity: Math.min(1, e * 1.6) * sale, transform: tr, background: "#111" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: bn ? "grayscale(1)" : "none", transform: `scale(${1 + 0.04 * ((t - a) / (b - a))})` }} />
      {pie && <><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.8))" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: S, fontSize: 40, color: pie === "rico" ? AZUL : "white" }}>{pie}</div></>}
    </div>
  );
};

const Imagenes: React.FC<{ f: Ficha; t: number; top: number }> = ({ f, t, top }) => {
  const out: React.ReactNode[] = [];
  PARES.forEach(([a, m, b], i) => {
    const p = `t1009/img${String(i * 2 + 1).padStart(2, "0")}.jpg`, r = `t1009/img${String(i * 2 + 2).padStart(2, "0")}.jpg`, k = { t, bn: f.bn };
    if (f.imgs === "arriba") { const y = f.area.y + top; out.push(<Tarjeta key={i + "p"} src={p} x={f.area.x + 34} y={y} w={316} h={400} a={a} b={b} {...k} />, <Tarjeta key={i + "r"} src={r} x={f.area.x + f.area.w - 350} y={y} w={316} h={400} a={m} b={b} borde={AZUL} {...k} />); }
    else if (f.imgs === "columna") out.push(<Tarjeta key={i + "p"} src={p} x={672} y={320} w={360} h={430} a={a} b={b} {...k} />, <Tarjeta key={i + "r"} src={r} x={672} y={780} w={360} h={430} a={m} b={b} borde={AZUL} {...k} />);
    else if (f.imgs === "mini") out.push(<Tarjeta key={i + "p"} src={p} x={70} y={210} w={290} h={380} a={a} b={b} rot={-3} pie="pobre" {...k} />, <Tarjeta key={i + "r"} src={r} x={720} y={210} w={290} h={380} a={m} b={b} rot={3} pie="rico" borde={AZUL} {...k} />);
    else if (f.imgs === "caen") out.push(<Tarjeta key={i + "p"} src={p} x={90} y={250} w={330} h={410} a={a} b={b} rot={-6} modo="cae" {...k} />, <Tarjeta key={i + "r"} src={r} x={660} y={270} w={330} h={410} a={m} b={b} rot={6} modo="cae" borde={AZUL} {...k} />);
    else if (f.imgs === "estudio") out.push(<Tarjeta key={i + "p"} src={p} x={40} y={300} w={300} h={390} a={a} b={b} rot={-4} {...k} />, <Tarjeta key={i + "r"} src={r} x={740} y={300} w={300} h={390} a={m} b={b} rot={4} borde={AZUL} {...k} />);
    else if (f.imgs === "mitad") {
      const ep = suave(interpolate(t, [a, a + 0.3], [0, 1], clamp)), er = suave(interpolate(t, [m, m + 0.3], [0, 1], clamp));
      if (t >= a && t < b) out.push(
        <div key={i + "p"} style={{ position: "absolute", left: 0, top: 0, width: 538, height: 858, overflow: "hidden", opacity: ep }}><Img src={staticFile(p)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", filter: "grayscale(0.7) brightness(0.8)", transform: `scale(${1.08 - 0.08 * ep})` }} /><div style={{ position: "absolute", left: 26, bottom: 24, fontFamily: B, fontSize: 30, letterSpacing: 3, color: "white", background: "rgba(0,0,0,0.6)", padding: "8px 18px", borderRadius: 30 }}>POBRE</div></div>,
        <div key={i + "r"} style={{ position: "absolute", left: 542, top: 0, width: 538, height: 858, overflow: "hidden", opacity: t >= m ? er : 0 }}><Img src={staticFile(r)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${1.08 - 0.08 * er})` }} /><div style={{ position: "absolute", left: 26, bottom: 24, fontFamily: B, fontSize: 30, letterSpacing: 3, color: "white", background: AZUL, padding: "8px 18px", borderRadius: 30 }}>RICO</div></div>,
      );
    }
  });
  return <>{out}</>;
};

const Titulo: React.FC<{ f: Ficha; t: number }> = ({ f, t }) => {
  if (f.titulo === "no") return null;
  const e = suave(interpolate(t, [0, 0.4], [0, 1], clamp)), dentro = f.titulo === "dentro";
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: dentro ? 96 : 104, textAlign: "center", fontFamily: B, fontSize: dentro ? 50 : 56, letterSpacing: -1.6, lineHeight: 1.12, color: "white", opacity: e, filter: `blur(${(1 - e) * 8}px)`, textShadow: dentro ? "0 3px 18px rgba(0,0,0,0.75)" : "none" }}>
      <div>{TITULO[0]}</div><div style={{ color: AZUL }}>{TITULO[1]}</div>
    </div>
  );
};

const frasesDe = (() => { const out: Pal[][] = []; let cur: Pal[] = []; for (const p of PAL) { const prev = cur[cur.length - 1]; if (prev && (cur.length >= 6 || /[.,?]$/.test(prev.t) || p.a - prev.b > 0.35)) { out.push(cur); cur = []; } cur.push(p); } if (cur.length) out.push(cur); return out; })();
const limpia = (s: string) => s.replace(/[.,?¿!¡]/g, "").toLowerCase().replace(/^tu$/, "tú").replace(/^tiene$/, "tienes");
const Subs: React.FC<{ f: Ficha; t: number; y: number; frame: number; fps: number; oscuro?: boolean; cxSub?: number }> = ({ f, t, y, frame, fps, oscuro, cxSub = 540 }) => {
  const tinta = oscuro ? "#111" : "white", sombra = oscuro ? "none" : "0 3px 16px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.5)";
  if (f.subs === "palabra") {
    const p = [...PAL].reverse().find((w) => t >= w.a - 0.03); if (!p || t > p.b + 0.4) return null;
    const txt = limpia(p.t), k = CLAVES.has(txt), e = suave(interpolate(frame - Math.round((p.a - 0.03) * fps), [0, 4], [0, 1], clamp));
    return <div style={{ position: "absolute", left: 0, right: 0, top: y - 20, textAlign: "center", fontFamily: B, fontSize: k ? 124 : 92, letterSpacing: -3, color: k ? AZUL : tinta, textShadow: sombra, opacity: e, transform: `scale(${0.92 + 0.08 * e})` }}>{txt}</div>;
  }
  if (f.subs === "frase") {
    const fr = [...frasesDe].reverse().find((g) => t >= g[0].a - 0.04); if (!fr || t > fr[fr.length - 1].b + 0.5) return null;
    const e = suave(interpolate(t, [fr[0].a - 0.04, fr[0].a + 0.12], [0, 1], clamp));
    return <div style={{ position: "absolute", left: 70, right: 70, top: y, textAlign: "center", fontFamily: B, fontSize: 52, letterSpacing: -1.4, lineHeight: 1.18, color: tinta, opacity: e, textShadow: sombra }}>{fr.map((w, i) => { const x = limpia(w.t); return <span key={i} style={{ color: CLAVES.has(x) ? AZUL : tinta, opacity: t >= w.a - 0.04 ? 1 : 0.45 }}>{x} </span>; })}</div>;
  }
  const s = [...SUBS].reverse().find((u) => t >= u.a); if (!s || t >= s.fin + 0.05) return null;
  const el = suave(interpolate(frame - Math.round(s.a * fps), [0, 3], [0, 1], clamp)), ek = suave(interpolate(frame - Math.round(s.a * fps) - 2, [0, 6], [0, 1], clamp));
  return (
    <div style={{ position: "absolute", left: cxSub - 540, width: 1080, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
        {s.linea && <div style={{ fontFamily: B, fontSize: 56, letterSpacing: -1.6, color: tinta, textShadow: sombra, opacity: el }}>{s.linea}</div>}
        {s.clave && <div style={{ fontFamily: B, fontSize: 136, letterSpacing: -5, color: AZUL, textShadow: oscuro ? "none" : "0 4px 22px rgba(0,0,0,0.55)", marginTop: -6, opacity: ek, transform: `translateY(${(1 - ek) * 16}px)` }}>{s.clave}</div>}
      </div>
    </div>
  );
};

export const Trial: React.FC<{ n: number }> = ({ n }) => {
  useFuentes();
  const f = FICHAS[n], frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig();
  const vel = f.vel ?? 1, t = (frame / fps) * vel;
  let seg = 0; for (let i = 0; i < CORTES.length; i++) if (t >= CORTES[i] - 0.001) seg = i;
  const zoom = (f.zoom ?? 1) * (f.punch && seg % 2 ? 1.16 : 1) * (1 + 0.02 * ((t - CORTES[seg]) / ((CORTES[seg + 1] ?? DUR) - CORTES[seg])));
  const { s, left, top } = encaje(f, zoom), A = f.area;
  const enMG = f.mg ? (t >= 28.87 && t < 33.27 ? "a" : t >= 33.27 && t < 37.07 ? "b" : "") : "";
  const subsY = f.subsY ?? A.y + top + PECHO * s;
  const finT = f.corto ?? DUR, cta = finT - 2.2;
  const video = (extra: React.CSSProperties = {}) => <OffthreadVideo muted playbackRate={vel} src={staticFile("t1009/base.mp4")} style={{ position: "absolute", left, top, width: 1080 * s, height: 1920 * s, filter: f.bn ? "grayscale(1) contrast(1.08)" : "none", ...extra }} />;
  const clave = [...SUBS].reverse().find((u) => u.clave && t >= u.a);
  return (
    <AbsoluteFill style={{ backgroundColor: f.fondo.startsWith("#") ? f.fondo : "#04070D" }}>
      {f.fondo === "blur" && <AbsoluteFill><OffthreadVideo muted playbackRate={vel} src={staticFile("t1009/base.mp4")} style={{ width: "100%", height: "100%", transform: "scale(1.35)", filter: "blur(46px) brightness(0.5) saturate(1.1)" }} /></AbsoluteFill>}
      {f.fondo === "estudio" && <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at 50% 44%, #1B4FB0 0%, #0E2C6B 45%, #050A16 88%)` }}><AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" }} /></AbsoluteFill>}
      {f.gigante && clave && t < clave.fin + 0.6 && <div style={{ position: "absolute", left: -40, right: -40, top: 470, textAlign: "center", fontFamily: B, fontSize: Math.min(340, 1620 / clave.clave.length), letterSpacing: -8, color: "rgba(255,255,255,0.13)", lineHeight: 1, transform: `scale(${1 + 0.05 * suave(interpolate(t, [clave.a, clave.a + 0.5], [0, 1], clamp))})`, whiteSpace: "nowrap" }}>{clave.clave.toUpperCase()}</div>}
      {f.glow && <div style={{ position: "absolute", left: A.x - 6, top: A.y - 6, width: A.w + 12, height: A.h + 12, borderRadius: (A.r ?? 0) + 6, boxShadow: `0 0 70px 10px ${AZUL}aa, 0 0 0 3px ${AZUL}`, opacity: 0.85 + 0.15 * Math.sin(t * 2) }} />}
      <div style={{ position: "absolute", left: A.x, top: A.y, width: A.w, height: A.h, overflow: "hidden", borderRadius: A.r ?? 0 }}>
        {f.recorte ? <OffthreadVideo muted transparent playbackRate={vel} src={staticFile("t1009/persona.webm")} style={{ position: "absolute", left, top, width: 1080 * s, height: 1920 * s, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.6))" }} /> : video()}
        {!f.recorte && A.h > 1500 && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 34%)" }} />}
      </div>
      {f.imgs === "mitad" && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 860, overflow: "hidden", background: "#06080C" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(700px 600px at 50% 45%, ${AZUL}33, transparent 70%)` }} />
        {t >= 19.47 && clave && <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: S, fontSize: 150, color: "white", opacity: suave(interpolate(t, [clave.a, clave.a + 0.3], [0, 1], clamp)) }}>{clave.clave}</div>}
        <Imagenes f={f} t={t} top={0} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: AZUL }} />
      </div>}
      {f.imgs !== "mitad" && !enMG && <Imagenes f={f} t={t} top={f.titulo === "dentro" ? 250 : 26} />}
      {enMG && <Sequence from={Math.round((enMG === "a" ? 28.87 : 33.27) * fps)} layout="none"><AbsoluteFill><Abundancia parte={enMG} /></AbsoluteFill></Sequence>}
      {!enMG && <Titulo f={f} t={t} />}
      {(f.imgs !== "mitad" || true) && <Subs f={f} t={t} y={enMG ? 1290 : subsY} frame={Math.round(t * fps)} fps={fps} oscuro={enMG === "b"} cxSub={f.cx && !enMG ? A.x + left + CARA.x * s : 540} />}
      {t >= cta && <Sequence from={Math.round((cta / vel) * fps)} layout="none"><Cta usuario="aminbusinesss" nombre="Amin Business | Marca Personal" pulsa={1.5} y={f.titulo === "barra" ? (f.subs === "frase" ? A.y + 26 : A.y + A.h + 56) : f.imgs === "mitad" ? 60 : f.corto ? 1560 : 250} /></Sequence>}
      {f.portada && frame < 16 && <AbsoluteFill>
        <Freeze frame={Math.round(1.2 * fps)}><AbsoluteFill><OffthreadVideo muted src={staticFile("t1009/base.mp4")} style={{ width: "100%", height: "100%", transform: "scale(1.25)", filter: "blur(18px) brightness(0.45)" }} /></AbsoluteFill></Freeze>
        <div style={{ position: "absolute", left: 60, right: 60, top: 700, textAlign: "center", fontFamily: B, fontSize: 104, letterSpacing: -4, lineHeight: 1.02, color: "white", opacity: interpolate(frame, [12, 16], [1, 0], clamp) }}><div>Pobre</div><div style={{ fontFamily: S, fontSize: 70, color: "rgba(255,255,255,0.7)", margin: "6px 0" }}>vs</div><div style={{ color: AZUL }}>Rico</div></div>
      </AbsoluteFill>}
      {f.bucle && frame > durationInFrames - 10 && <AbsoluteFill style={{ opacity: interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], clamp) }}><Freeze frame={0}><AbsoluteFill style={{ backgroundColor: "#000" }}><div style={{ position: "absolute", left: A.x, top: A.y, width: A.w, height: A.h, overflow: "hidden" }}><OffthreadVideo muted src={staticFile("t1009/base.mp4")} style={{ position: "absolute", left: encaje(f, f.zoom ?? 1).left, top: encaje(f, f.zoom ?? 1).top, width: 1080 * encaje(f, f.zoom ?? 1).s, height: 1920 * encaje(f, f.zoom ?? 1).s }} /></div></AbsoluteFill></Freeze></AbsoluteFill>}
    </AbsoluteFill>
  );
};
