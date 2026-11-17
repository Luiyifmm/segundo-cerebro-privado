import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palabras from "./palabras.json";

export const AMIN_FRAMES = 785;
const AZUL = "#1E6BFF";
const AZUL_CLARO = "#6FA8FF";
const NOCHE = "#050B1A";
const SANS = "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const NEGRA = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Times New Roman', Georgia, serif";
const MONO = "Menlo, monospace";
const suave = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Palabra = { t: string; a: number; b: number };
const P = palabras as Palabra[];
const CLAVE = /^(noche|vida|cosa|respetan|divertirse|tiempo|prosperar|cruel|innegable|proyectas|adentro|afuera|mundo|tratar|valorar|sígueme)[.,]?$/i;

// Pares de imágenes: lo que se compara en cada tramo (segundos del montaje)
const PARES = [
  { a: 0.2, m: 2.4, b: 4.9, mal: "img0.jpg", bien: "img1.jpg", malT: "UNA NOCHE", bienT: "TODA LA VIDA" },
  { a: 4.9, m: 7.7, b: 8.9, mal: "img2.jpg", bien: "img3.jpg", malT: "UNA COSA", bienT: "RESPETO" },
  { a: 8.9, m: 11.5, b: 13.5, mal: "img4.jpg", bien: "img5.jpg", malT: "PERDER EL TIEMPO", bienT: "PROSPERAR" },
];
const FRASES = [
  { a: 13.5, b: 15.5, l1: "La regla es cruel", l2: "pero innegable" },
  { a: 15.5, b: 17.9, l1: "Atraes exactamente", l2: "lo que proyectas" },
  { a: 17.9, b: 19.8, l1: "Como es adentro", l2: "es afuera" },
  { a: 19.8, b: 24.5, l1: "Cómo te presentas", l2: "dicta cómo te tratan" },
];
const FINAL = [
  { a: 19.8, b: 22.2, src: "img8.jpg" },
  { a: 22.2, b: 23.4, src: "img6.jpg" },
  { a: 23.4, b: 24.5, src: "img7.jpg" },
];
const CTA = 24.5;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
const entra = (frame: number, fps: number, desde: number, cfg = { damping: 15, mass: 0.6 }) => spring({ frame: frame - Math.round(desde * fps), fps, config: cfg });

const Base: React.FC<{ zoom?: boolean; style?: React.CSSProperties }> = ({ zoom, style }) => {
  const { frame } = useT();
  const z = zoom ? interpolate(frame, [0, AMIN_FRAMES], [1.02, 1.1]) : 1;
  return <OffthreadVideo src={staticFile("amin/base.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, ...style }} />;
};
const Persona: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <OffthreadVideo transparent muted src={staticFile("amin/persona.webm")} style={{ position: "absolute", width: "100%", height: "100%", ...style }} />
);
const Voz: React.FC = () => <Audio src={staticFile("amin/base.mp4")} />;

// Agrupa palabras en líneas cortas
const lineas = (max: number) => {
  const out: Palabra[][] = [];
  let cur: Palabra[] = [];
  for (const p of P) {
    const prev = cur[cur.length - 1];
    if (prev && (cur.length >= max || p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) {
      out.push(cur);
      cur = [];
    }
    cur.push(p);
  }
  if (cur.length) out.push(cur);
  return out;
};
const lineaActiva = (ls: Palabra[][], t: number) => {
  for (let i = ls.length - 1; i >= 0; i--) if (t >= ls[i][0].a - 0.04) return t < ls[i][ls[i].length - 1].b + 0.45 ? ls[i] : null;
  return null;
};
const limpio = (s: string) => s.replace(/[.,]$/, "");

const Seguir: React.FC<{ y?: number }> = ({ y = 1330 }) => {
  const { frame, fps } = useT();
  const s = entra(frame, fps, CTA + 0.1);
  return <Img src={staticFile("amin/seguir.png")} style={{ position: "absolute", left: 140, width: 800, top: y, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})` }} />;
};

/* ───────── 1. Limpio azul: palabra activa en caja azul, tarjetas comparadas arriba ───────── */
const L3 = lineas(3);
export const Amin1: React.FC = () => {
  const { frame, fps, t } = useT();
  const l = lineaActiva(L3, t);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Base zoom />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
      {PARES.map((p, i) => {
        if (t < p.a || t > p.b) return null;
        const s1 = entra(frame, fps, p.a);
        const s2 = entra(frame, fps, p.m);
        const sale = interpolate(t, [p.b - 0.15, p.b], [1, 0], clamp);
        const tarjeta = (src: string, s: number, izq: boolean, ok: boolean, txt: string) => (
          <div style={{ position: "absolute", top: 250, left: izq ? 70 : 560, width: 450, opacity: s * sale, transform: `translateY(${(1 - s) * -80}px) rotate(${(izq ? -3 : 3) * (1 - s * 0.4)}deg)` }}>
            <Img src={staticFile("amin/" + src)} style={{ width: 450, height: 560, objectFit: "cover", borderRadius: 28, border: `6px solid ${ok ? AZUL : "white"}`, boxShadow: ok ? `0 0 60px ${AZUL}` : "0 20px 50px rgba(0,0,0,0.5)", filter: ok ? "none" : "saturate(0.55)" }} />
            <div style={{ marginTop: -34, marginLeft: "auto", marginRight: "auto", width: "fit-content", padding: "10px 26px", borderRadius: 40, background: ok ? AZUL : "white", color: ok ? "white" : "black", fontFamily: SANS, fontWeight: 800, fontSize: 30, position: "relative" }}>{txt}</div>
          </div>
        );
        return (
          <React.Fragment key={i}>
            {tarjeta(p.mal, s1, true, false, p.malT)}
            {t >= p.m && tarjeta(p.bien, s2, false, true, p.bienT)}
          </React.Fragment>
        );
      })}
      {FINAL.map((f, i) => {
        if (t < f.a || t > f.b) return null;
        const s = entra(frame, fps, f.a);
        return <Img key={i} src={staticFile("amin/" + f.src)} style={{ position: "absolute", top: 240, left: 290, width: 500, height: 600, objectFit: "cover", borderRadius: 28, border: "6px solid white", opacity: s, transform: `scale(${0.85 + 0.15 * s})` }} />;
      })}
      {l && t < CTA + 1.7 && (
        <div style={{ position: "absolute", top: 1180, width: "100%", display: "flex", justifyContent: "center", gap: 16, fontFamily: SANS, fontWeight: 800, fontSize: 66 }}>
          {l.map((p, i) => {
            const act = t >= p.a && t < p.b + 0.08;
            const s = entra(frame, fps, p.a, { damping: 12, mass: 0.4 });
            return (
              <span key={i} style={{ padding: "4px 18px", borderRadius: 16, color: "white", background: act ? AZUL : "transparent", textShadow: act ? "none" : "0 4px 18px rgba(0,0,0,0.8)", opacity: t >= p.a - 0.04 ? 1 : 0.45, transform: `scale(${act ? 0.92 + 0.12 * s : 1})` }}>{limpio(p.t)}</span>
            );
          })}
        </div>
      )}
      <Seguir />
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / AMIN_FRAMES) * 100}%`, background: AZUL }} />
    </AbsoluteFill>
  );
};

/* ───────── 2. Énfasis: palabra clave gigante detrás de la persona ───────── */
const GIGANTES = [
  { a: 1.9, b: 2.5, t: "NOCHE" }, { a: 4.3, b: 4.95, t: "VIDA" }, { a: 6.3, b: 7.6, t: "UNA COSA" }, { a: 8.1, b: 8.95, t: "RESPETO" },
  { a: 9.9, b: 11.5, t: "TIEMPO" }, { a: 12.4, b: 13.5, t: "PROSPERAR" }, { a: 14.3, b: 15.5, t: "CRUEL" }, { a: 16.4, b: 17.9, t: "PROYECTAS" },
  { a: 18.2, b: 19.2, t: "ADENTRO" }, { a: 19.2, b: 19.85, t: "AFUERA" }, { a: 21.3, b: 22.3, t: "MUNDO" }, { a: 24.2, b: 24.6, t: "VALOR" },
];
const L2 = lineas(2);
export const Amin2: React.FC = () => {
  const { frame, fps, t } = useT();
  const g = GIGANTES.find((x) => t >= x.a && t < x.b);
  const l = lineaActiva(L2, t);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Base style={{ filter: "brightness(0.55) saturate(0.8)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, rgba(30,107,255,0.35), rgba(0,0,0,0) 60%)` }} />
      {g && (() => {
        const s = entra(frame, fps, g.a, { damping: 11, mass: 0.5 });
        const tam = Math.min(300, 1300 / g.t.length);
        return (
          <div style={{ position: "absolute", top: 330, width: "100%", textAlign: "center", fontFamily: NEGRA, fontStyle: "italic", fontSize: tam, letterSpacing: -6, color: AZUL, textShadow: `0 0 80px ${AZUL}`, transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 120}px)`, opacity: s }}>{g.t}</div>
        );
      })()}
      <Persona />
      {PARES.map((p, i) => {
        if (t < p.a || t > p.b) return null;
        const foto = (src: string, desde: number, izq: boolean) => {
          const s = entra(frame, fps, desde);
          return <Img src={staticFile("amin/" + src)} style={{ position: "absolute", top: 1010, left: izq ? 40 : 760, width: 280, height: 360, objectFit: "cover", border: "10px solid white", borderBottomWidth: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", opacity: s, transform: `rotate(${izq ? -7 : 6}deg) scale(${0.7 + 0.3 * s})` }} />;
        };
        return (
          <React.Fragment key={i}>
            {foto(p.mal, p.a, true)}
            {t >= p.m && foto(p.bien, p.m, false)}
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.85) 100%)" }} />
      {l && (
        <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", lineHeight: 1 }}>
          {l.map((p, i) => {
            const clave = CLAVE.test(p.t);
            const s = entra(frame, fps, p.a, { damping: 12, mass: 0.4 });
            return (
              <span key={i} style={{ display: "inline-block", margin: "0 10px", fontFamily: clave ? NEGRA : SANS, fontStyle: clave ? "italic" : "normal", fontWeight: clave ? 900 : 500, fontSize: clave ? 104 : 64, textTransform: clave ? "uppercase" : "none", color: clave ? AZUL_CLARO : "white", textShadow: "0 6px 24px rgba(0,0,0,0.9)", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>{limpio(p.t)}</span>
            );
          })}
        </div>
      )}
      <Seguir y={1180} />
    </AbsoluteFill>
  );
};

/* ───────── 3. Estudio oscuro: fondo sustituido, rejilla, tarjetas HUD ───────── */
const L1 = lineas(1);
export const Amin3: React.FC = () => {
  const { frame, fps, t } = useT();
  const l = lineaActiva(L2, t);
  const deriva = (frame * 0.5) % 90;
  const respira = 0.7 + 0.3 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{ backgroundColor: NOCHE }}>
      <Voz />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(111,168,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(111,168,255,0.09) 1px, transparent 1px)", backgroundSize: "90px 90px", backgroundPosition: `0 ${deriva}px` }} />
      <div style={{ position: "absolute", left: 140, top: 380, width: 800, height: 800, borderRadius: 400, background: `radial-gradient(circle, rgba(30,107,255,${0.55 * respira}), rgba(30,107,255,0) 68%)` }} />
      <div style={{ position: "absolute", left: 250, top: 490, width: 580, height: 580, borderRadius: 290, border: "2px solid rgba(111,168,255,0.5)", transform: `rotate(${frame * 0.4}deg)`, borderTopColor: "transparent" }} />
      {PARES.map((p, i) => {
        if (t < p.a || t > p.b) return null;
        const hud = (src: string, desde: number, izq: boolean, ok: boolean, txt: string) => {
          const s = entra(frame, fps, desde);
          return (
            <div style={{ position: "absolute", top: 300, left: izq ? 50 : 700, width: 330, opacity: s, transform: `translateX(${(1 - s) * (izq ? -120 : 120)}px)` }}>
              <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: ok ? AZUL_CLARO : "rgba(255,255,255,0.6)", marginBottom: 10 }}>{ok ? "● " : "○ "}{txt}</div>
              <Img src={staticFile("amin/" + src)} style={{ width: 330, height: 430, objectFit: "cover", border: `2px solid ${ok ? AZUL_CLARO : "rgba(255,255,255,0.5)"}`, boxShadow: ok ? `0 0 50px ${AZUL}` : "none", filter: ok ? "none" : "grayscale(1) brightness(0.8)" }} />
            </div>
          );
        };
        return (
          <React.Fragment key={i}>
            {hud(p.mal, p.a, true, false, p.malT)}
            {t >= p.m && hud(p.bien, p.m, false, true, p.bienT)}
          </React.Fragment>
        );
      })}
      <Persona style={{ transform: "scale(1.22) translateY(7%)", filter: `drop-shadow(0 0 26px rgba(30,107,255,0.75))` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(5,11,26,0) 66%, ${NOCHE} 90%)` }} />
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>
        <span>● AMIN BUSINESS</span>
        <span>{String(Math.floor(t)).padStart(2, "0")} / 26</span>
      </div>
      {l && t < CTA && (
        <div style={{ position: "absolute", top: 1390, width: "100%", textAlign: "center", fontFamily: NEGRA, fontSize: 84, letterSpacing: -2, textTransform: "uppercase" }}>
          {l.map((p, i) => {
            const s = entra(frame, fps, p.a, { damping: 14, mass: 0.4 });
            const clave = CLAVE.test(p.t);
            return <span key={i} style={{ display: "inline-block", margin: "0 12px", color: clave ? AZUL_CLARO : "white", textShadow: clave ? `0 0 40px ${AZUL}` : "none", opacity: s, filter: `blur(${(1 - s) * 10}px)`, transform: `translateY(${(1 - s) * 40}px)` }}>{limpio(p.t)}</span>;
          })}
        </div>
      )}
      <Seguir y={1380} />
    </AbsoluteFill>
  );
};

/* ───────── 4. Pantalla partida: comparativa arriba, orador abajo ───────── */
export const Amin4: React.FC = () => {
  const { frame, fps, t } = useT();
  const l = lineaActiva(L3, t);
  const par = PARES.find((p) => t >= p.a - 0.2 && t < p.b) ?? null;
  const frase = FRASES.find((f) => t >= f.a && t < f.b) ?? null;
  const final = FINAL.find((f) => t >= f.a && t < f.b) ?? null;
  const CREMA = "#F3F1EC";
  return (
    <AbsoluteFill style={{ backgroundColor: CREMA }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 900, overflow: "hidden" }}>
        {par && [par.mal, par.bien].map((src, k) => {
          const activo = k === 0 ? t < par.m : t >= par.m;
          const s = entra(frame, fps, par.a + k * 0.12);
          return (
            <div key={src} style={{ position: "absolute", top: 200, left: k === 0 ? 50 : 555, width: 475, height: 650, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${activo ? 1 : 0.94})` }}>
              <Img src={staticFile("amin/" + src)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 24, filter: activo ? "none" : "grayscale(1) brightness(0.75)", outline: activo ? `8px solid ${k === 1 ? AZUL : "#111"}` : "none" }} />
              <div style={{ position: "absolute", left: 18, bottom: 18, padding: "8px 20px", borderRadius: 30, background: k === 1 ? AZUL : "#111", color: "white", fontFamily: SANS, fontWeight: 800, fontSize: 28 }}>{k === 0 ? par.malT : par.bienT}</div>
            </div>
          );
        })}
        {frase && !final && (() => {
          const s = entra(frame, fps, frase.a);
          const s2 = entra(frame, fps, frase.a + 0.5);
          return (
            <div style={{ position: "absolute", top: 330, left: 70, right: 70 }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: "#111", opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{frase.l1}</div>
              <div style={{ fontFamily: NEGRA, fontSize: 104, letterSpacing: -4, lineHeight: 1, color: AZUL, opacity: s2, transform: `translateY(${(1 - s2) * 40}px)` }}>{frase.l2}</div>
              <div style={{ height: 8, width: 300 * s2, background: "#111", marginTop: 30 }} />
            </div>
          );
        })()}
        {final && (() => {
          const s = entra(frame, fps, final.a);
          return <Img src={staticFile("amin/" + final.src)} style={{ position: "absolute", top: 200, left: 240, width: 600, height: 650, objectFit: "cover", borderRadius: 24, opacity: s, transform: `scale(${0.9 + 0.1 * s})` }} />;
        })()}
        {t >= CTA && (
          <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", fontFamily: NEGRA, fontSize: 120, letterSpacing: -4, color: AZUL, opacity: entra(frame, fps, CTA) }}>SÍGUEME</div>
        )}
      </div>
      <div style={{ position: "absolute", top: 900, left: 0, width: 1080, height: 1020, overflow: "hidden", borderTop: `10px solid ${AZUL}` }}>
        <OffthreadVideo muted src={staticFile("amin/base.mp4")} style={{ position: "absolute", width: 1080 * 1.75, left: -1080 * 0.375, top: -980 }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)" }} />
      </div>
      <Voz />
      {l && (
        <div style={{ position: "absolute", top: 1520, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 60, color: "white" }}>
          {l.map((p, i) => (
            <span key={i} style={{ margin: "0 9px", color: t >= p.a ? "white" : "rgba(255,255,255,0.4)", borderBottom: t >= p.a && t < p.b + 0.08 ? `8px solid ${AZUL}` : "8px solid transparent" }}>{limpio(p.t)}</span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ───────── 5. Editorial: pintura de fondo, persona recortada, títulos serif ───────── */
const TITULOS = [
  { a: 0.2, b: 2.4, t: "Una noche" }, { a: 2.4, b: 4.9, t: "Toda la vida" }, { a: 4.9, b: 7.7, t: "Una cosa" }, { a: 7.7, b: 8.9, t: "Respeto" },
  { a: 8.9, b: 11.5, t: "Perder el tiempo" }, { a: 11.5, b: 13.5, t: "Prosperar" }, { a: 13.5, b: 15.5, t: "La regla" }, { a: 15.5, b: 17.9, t: "Lo que proyectas" },
  { a: 17.9, b: 19.8, t: "Adentro, afuera" }, { a: 19.8, b: 24.5, t: "Tu presencia" }, { a: 24.5, b: 27, t: "Sígueme" },
];
const FOTO5 = [
  { a: 0.2, b: 2.4, src: "img0.jpg" }, { a: 2.4, b: 4.9, src: "img1.jpg" }, { a: 4.9, b: 7.7, src: "img2.jpg" }, { a: 7.7, b: 8.9, src: "img3.jpg" },
  { a: 8.9, b: 11.5, src: "img4.jpg" }, { a: 11.5, b: 13.5, src: "img5.jpg" },
];
export const Amin5: React.FC = () => {
  const { frame, fps, t } = useT();
  const l = lineaActiva(L3, t);
  const titulo = TITULOS.find((x) => t >= x.a && t < x.b);
  const foto = FOTO5.find((x) => t >= x.a && t < x.b);
  const pintura = t < 13.5 ? "img7.jpg" : t < 19.8 ? "img6.jpg" : "img8.jpg";
  const z = interpolate(frame, [0, AMIN_FRAMES], [1.15, 1.3]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0a08" }}>
      <Voz />
      <Img src={staticFile("amin/" + pintura)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "blur(3px) brightness(0.62) saturate(0.9)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)" }} />
      {titulo && (() => {
        const s = interpolate(t, [titulo.a, titulo.a + 0.35], [0, 1], { ...clamp, easing: suave });
        return (
          <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 124, color: "#F4EEDF", letterSpacing: -2, opacity: s, transform: `translateY(${(1 - s) * 24}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>{titulo.t}</div>
            <div style={{ height: 3, width: 220 * s, background: AZUL_CLARO, margin: "14px auto 0" }} />
          </div>
        );
      })()}
      <Persona style={{ transform: "scale(1.2) translateY(9%)", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7)) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,10,8,0) 64%, rgba(12,10,8,0.96) 88%)" }} />
      {foto && (() => {
        const s = entra(frame, fps, foto.a, { damping: 18, mass: 0.7 });
        return (
          <div style={{ position: "absolute", top: 520, left: 60, padding: 14, background: "#F4EEDF", boxShadow: "0 24px 60px rgba(0,0,0,0.7)", opacity: s, transform: `rotate(${-5 + 2 * s}deg) translateX(${(1 - s) * -200}px)` }}>
            <Img src={staticFile("amin/" + foto.src)} style={{ width: 290, height: 370, objectFit: "cover", display: "block" }} />
          </div>
        );
      })()}
      {l && t < CTA + 1.7 && (
        <div style={{ position: "absolute", top: 1500, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 68, color: "#F4EEDF" }}>
          {l.map((p, i) => {
            const s = interpolate(t, [p.a - 0.05, p.a + 0.12], [0, 1], clamp);
            return <span key={i} style={{ margin: "0 9px", opacity: 0.25 + 0.75 * s, fontStyle: CLAVE.test(p.t) ? "italic" : "normal", color: CLAVE.test(p.t) ? AZUL_CLARO : "#F4EEDF" }}>{limpio(p.t)}</span>;
          })}
        </div>
      )}
      <Seguir y={1290} />
    </AbsoluteFill>
  );
};
