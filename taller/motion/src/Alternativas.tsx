import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import datos from "./alternativas.json";
import palabras from "./palabras.json";
import { Mg, SubsLimpios } from "./Graficos";
import { BaseElegante, Espejo, MgPantalla, Miniatura, Seguir, SubsElegantes, Versus } from "./Elegante";

const AZUL_BASE = "#1E6BFF";
const AZUL_CLARO = "#6FA8FF";
const CREMA = "#F3F1EC";
const SANS = "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const NEGRA = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Times New Roman', Georgia, serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Capa = any;
type Palabra = { t: string; a: number; b: number };
const P = palabras as Palabra[];
export const VERSIONES = datos.versiones as { n: number; nombre: string; capas: Capa[] }[];

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

const LINEAS = (() => {
  const out: Palabra[][] = [];
  let cur: Palabra[] = [];
  for (const p of P) {
    const prev = cur[cur.length - 1];
    if (prev && (cur.length >= 3 || p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) {
      out.push(cur);
      cur = [];
    }
    cur.push(p);
  }
  if (cur.length) out.push(cur);
  return out;
})();

const Subs: React.FC<{ y: number; oscuro?: boolean; color?: string; tinta?: string; vel?: number }> = ({ y, oscuro, color, tinta, vel = 1 }) => {
  const AZUL = color || AZUL_BASE;
  const { frame, fps, t: real } = useT();
  const t = real * vel; // tiempo del audio original aunque el vídeo vaya acelerado
  let l: Palabra[] | null = null;
  for (let i = LINEAS.length - 1; i >= 0; i--)
    if (t >= LINEAS[i][0].a - 0.04) {
      l = t < LINEAS[i][LINEAS[i].length - 1].b + 0.4 ? LINEAS[i] : null;
      break;
    }
  if (!l) return null;
  return (
    <div style={{ position: "absolute", top: y, width: "100%", display: "flex", justifyContent: "center", gap: 14, fontFamily: SANS, fontWeight: 800, fontSize: 62 }}>
      {l.map((p, i, l) => {
        const act = t >= p.a && (i === l.length - 1 ? t < p.b + 0.08 : t < l[i + 1].a);
        const s = spring({ frame: frame - Math.round((p.a / vel) * fps), fps, config: { damping: 12, mass: 0.4 } });
        return (
          <span key={i} style={{ padding: "2px 16px", borderRadius: 14, color: act ? tinta || "white" : oscuro ? "#111" : "white", background: act ? AZUL : "transparent", textShadow: act || oscuro ? "none" : "0 3px 14px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)", opacity: t >= p.a - 0.04 ? 1 : 0.5, transform: `scale(${act ? 0.92 + 0.1 * s : 1})` }}>
            {p.t.replace(/[.,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// Tarjeta que entra desde su lado y sale por el mismo
const Tarjeta: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps, t } = useT();
  const s = spring({ frame: frame - Math.round(c.a * fps), fps, config: { damping: 16, mass: 0.7 } });
  const fuera = interpolate(t, [c.b - 0.2, c.b], [0, 1], clamp);
  const dir = c.lado === "izq" ? -1 : 1;
  const dx = dir * 760 * (1 - s) + dir * 760 * fuera * fuera;
  const sz = spring({ frame: frame - Math.round(c.a * fps), fps, config: { damping: 11, mass: 0.6 } });
  const f2 = fuera * fuera;
  let transform = `translateX(${dx}px) rotate(${c.rot + dir * 6 * (1 - s)}deg)`;
  let opacity = 1;
  let filtro = "";
  if (c.entrada === "abajo") transform = `translateY(${(1 - s) * 1500 + f2 * 1500}px) rotate(${c.rot + dir * 14 * (1 - s)}deg)`;
  if (c.entrada === "arriba") { transform = `translateY(${-(1 - sz) * 1100}px) rotate(${c.rot + dir * 18 * (1 - sz)}deg) scale(${1 - 0.12 * fuera})`; opacity = 1 - fuera; }
  if (c.entrada === "zoom") { const k = Math.max(0, sz - f2); transform = `translate(${(540 - c.cx) * (1 - k)}px, ${(860 - c.cy) * (1 - k)}px) scale(${0.15 + 0.85 * k}) rotate(${c.rot * k}deg)`; opacity = Math.min(1, k * 4); }
  if (c.entrada === "desenfoque") { transform = `scale(${1.35 - 0.35 * s})`; opacity = Math.min(1, s) * (1 - fuera); filtro = `blur(${Math.max(0, 28 * (1 - s))}px)`; }
  const marco: React.CSSProperties =
    c.estilo === "cuadro"
      ? { border: "14px solid #1b1b1b", outline: "3px solid #c9a86a", outlineOffset: -17, boxShadow: "0 26px 40px rgba(0,0,0,0.45)", borderRadius: 2 }
      : c.estilo === "polaroid"
        ? { border: "10px solid white", borderBottomWidth: 34, boxShadow: "0 16px 34px rgba(0,0,0,0.55)" }
        : c.estilo === "comparativa"
          ? { borderRadius: 24, outline: `8px solid ${c.bueno ? AZUL : "#111"}` }
          : c.estilo === "cinta"
            ? { border: "12px solid white", borderBottomWidth: 44, boxShadow: "0 22px 44px rgba(40,30,10,0.35)" }
            : c.estilo === "circulo"
              ? { borderRadius: "50%", border: `8px solid ${c.bueno ? AZUL : "white"}`, boxShadow: c.bueno ? `0 0 60px ${AZUL}` : "0 0 40px rgba(255,255,255,0.2)" }
              : { borderRadius: 26, border: `6px solid ${c.bueno ? AZUL : "white"}`, boxShadow: c.bueno ? `0 0 50px ${AZUL}` : "0 0 40px rgba(255,255,255,0.18)" };
  return (
    <div style={{ position: "absolute", left: c.cx - c.w / 2, top: c.cy - c.h / 2, width: c.w, height: c.h, transform, opacity, filter: filtro || undefined }}>
      <Img src={staticFile("amin/" + c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", boxSizing: "border-box", filter: c.estilo === "comparativa" && !c.bueno ? "grayscale(0.6)" : "none", ...marco }} />
      {c.estilo === "cinta" && <div style={{ position: "absolute", top: -22, left: "50%", width: 150, height: 44, marginLeft: -75, background: c.bueno ? AZUL + "c0" : "rgba(60,60,60,0.45)", transform: "rotate(-3deg)" }} />}
      {c.estilo === "comparativa" && c.etiqueta && (
        <div style={{ position: "absolute", left: 18, bottom: 18, padding: "8px 20px", borderRadius: 30, background: c.bueno ? AZUL : "#111", color: "white", fontFamily: SANS, fontWeight: 800, fontSize: 28 }}>{c.etiqueta}</div>
      )}
    </div>
  );
};

const Persona: React.FC<{ c: Capa }> = ({ c }) => (
  <OffthreadVideo
    transparent
    muted
    playbackRate={c.vel || 1}
    src={staticFile("amin/persona.webm")}
    style={{ position: "absolute", width: "100%", height: "100%", transform: `translateY(${c.dy}px) scale(${c.escala})${c.espejo ? " scaleX(-1)" : ""}`, filter: `${c.filtro || ""} ${c.sombra ? "drop-shadow(0 10px 30px rgba(0,0,0,0.55))" : ""}`.trim() || "none" }}
  />
);

const Frase: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps, t } = useT();
  const s = spring({ frame: frame - Math.round(c.a * fps), fps, config: { damping: 16, mass: 0.6 } });
  const s2 = spring({ frame: frame - Math.round((c.a + 0.45) * fps), fps, config: { damping: 16, mass: 0.6 } });
  const fuera = interpolate(t, [c.b - 0.15, c.b], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 330, left: 70, right: 70, opacity: fuera }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: "#111", opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{c.l1}</div>
      <div style={{ fontFamily: NEGRA, fontSize: 100, letterSpacing: -4, lineHeight: 1.02, color: AZUL, opacity: s2, transform: `translateY(${(1 - s2) * 40}px)` }}>{c.l2}</div>
      <div style={{ height: 8, width: 300 * s2, background: "#111", marginTop: 30 }} />
    </div>
  );
};

const Gancho: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps } = useT();
  const s = spring({ frame: frame - 4, fps, config: { damping: 15, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * -40}px)` }}>
      <div style={{ padding: "14px 34px", borderRadius: 50, background: "rgba(0,0,0,0.78)", fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 1, color: "white" }}>
        {c.texto} <span style={{ color: AZUL_CLARO }}>{c.clave}</span>
      </div>
    </div>
  );
};

const AZUL = AZUL_BASE;
const BaseSplit: React.FC<{ vel?: number }> = ({ vel = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: CREMA }}>
    <div style={{ position: "absolute", top: 900, left: 0, width: 1080, height: 1020, overflow: "hidden", borderTop: `10px solid ${AZUL}` }}>
      <OffthreadVideo muted playbackRate={vel} src={staticFile("amin/base.mp4")} style={{ position: "absolute", width: 1080 * 1.75, left: -1080 * 0.375, top: -980 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)" }} />
    </div>
  </AbsoluteFill>
);

const BasePodcast: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #12306e 0%, #050B1A 70%)" }}>
    <div style={{ position: "absolute", top: 200, width: "100%", textAlign: "center", fontFamily: NEGRA, fontSize: 84, lineHeight: 1.05, letterSpacing: -3, color: "white" }}>
      ATRAES LO QUE
      <br />
      <span style={{ color: AZUL_CLARO }}>PROYECTAS</span>
    </div>
    <div style={{ position: "absolute", left: 90, top: 470, width: 900, height: 940, borderRadius: 48, overflow: "hidden", border: "4px solid rgba(255,255,255,0.18)", boxShadow: `0 0 90px rgba(30,107,255,0.45)` }}>
      <OffthreadVideo muted src={staticFile("amin/base.mp4")} style={{ position: "absolute", width: 900 * 1.5, left: -225, top: -660 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
    <div style={{ position: "absolute", top: 1600, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: "rgba(255,255,255,0.6)" }}>@AMINBUSINESSS</div>
  </AbsoluteFill>
);

// Media pantalla: la imagen ocupa su mitad entera, detrás de la persona
const Mitad: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps, t } = useT();
  const s = spring({ frame: frame - Math.round(c.a * fps), fps, config: { damping: 20, mass: 0.7 } });
  const fuera = interpolate(t, [c.b - 0.2, c.b], [1, 0], clamp);
  const izq = c.lado === "izq";
  const zoom = interpolate(t, [c.a, c.b], [1.14, 1.02], clamp);
  const oculto = Math.max(0, (1 - s) * 100);
  return (
    <div style={{ position: "absolute", left: izq ? 0 : 540, top: 0, width: 540, height: 1920, overflow: "hidden", opacity: fuera, clipPath: izq ? `inset(0 ${oculto}% 0 0)` : `inset(0 0 0 ${oculto}%)` }}>
      <Img src={staticFile("amin/" + c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: c.bueno ? "brightness(0.82)" : "grayscale(0.75) brightness(0.6)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.9) 82%)" }} />
      <div style={{ position: "absolute", [izq ? "right" : "left"]: 0, top: 0, width: 5, height: "100%", background: c.bueno ? AZUL : "white" }} />
      {c.etiqueta && (
        <div style={{ position: "absolute", top: 190, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "10px 26px", borderRadius: 40, background: c.bueno ? AZUL : "rgba(0,0,0,0.8)", border: c.bueno ? "none" : "3px solid white", color: "white", fontFamily: SANS, fontWeight: 800, fontSize: 36, transform: `scale(${0.6 + 0.4 * s})` }}>{c.etiqueta}</div>
        </div>
      )}
    </div>
  );
};

// Palabra gigante que queda detrás de la persona
const PalabraGigante: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps, t } = useT();
  const s = spring({ frame: frame - Math.round(c.a * fps), fps, config: { damping: 14, mass: 0.6 } });
  const fuera = interpolate(t, [c.b - 0.12, c.b], [1, 0], clamp);
  const lineas = String(c.texto).split(" ");
  const largo = Math.max(...lineas.map((l) => l.length));
  const tam = Math.min(300, 1010 / (largo * 0.72));
  return (
    <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center", fontFamily: NEGRA, fontSize: tam, lineHeight: 0.92, letterSpacing: -tam * 0.04, opacity: Math.min(1, s * 2) * fuera, transform: `scale(${1.5 - 0.5 * s})`, filter: `blur(${Math.max(0, 16 * (1 - s))}px)`, color: c.bueno ? AZUL : "transparent", WebkitTextStroke: c.bueno ? "0" : "5px white", textShadow: c.bueno ? `0 0 80px ${AZUL}99` : "none" }}>
      {lineas.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};

const FondoMarca: React.FC<{ c: Capa }> = ({ c }) => {
  const { t } = useT();
  const g = c.tonos || ["#2f7dff", "#0f3fb3", "#061a52", "#030b24"];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + 6 * Math.sin(t / 3)}% 34%, ${g[0]} 0%, ${g[1]} 38%, ${g[2]} 72%, ${g[3]} 100%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.06) 2px, transparent 2px)", backgroundSize: "108px 108px", maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

const FondoCrema: React.FC<{ c: Capa }> = ({ c }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, ${(c.tonos || ["#fbf9f4", "#efe9dd", "#ddd3c0"]).map((x: string, i: number) => x + " " + [0, 60, 100][i] + "%").join(", ")})` }}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 250, height: 4, background: "#111" }} />
  </AbsoluteFill>
);

const Titular: React.FC<{ c: Capa }> = ({ c }) => {
  const AZUL = c.color || AZUL_BASE;
  const { frame, fps } = useT();
  const s = spring({ frame: frame - 3, fps, config: { damping: 16, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", top: 96, left: 70, right: 70, display: "flex", alignItems: "baseline", gap: 18, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 74, color: "#111" }}>{c.l1}</span>
      <span style={{ fontFamily: NEGRA, fontSize: 74, letterSpacing: -3, color: AZUL }}>{c.l2}</span>
    </div>
  );
};

const MESA_Y = 1490;
export const Dibujo: React.FC<{ c: Capa }> = ({ c }) => {
  switch (c.tipo) {
    case "archivo":
      return c.archivo === "negro.mp4" ? <AbsoluteFill style={{ backgroundColor: "black" }} /> : <OffthreadVideo muted src={staticFile("amin/" + c.archivo)} style={{ position: "absolute", width: "100%", height: "100%" }} />;
    case "habitacion":
      return <Img src={staticFile("amin/habitacion.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />;
    case "mesa":
      return <Img src={staticFile("amin/habitacion.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(${MESA_Y}px 0 0 0)` }} />;
    case "tarjeta":
      return <Tarjeta c={c} />;
    case "persona":
      return <Persona c={c} />;
    case "subs":
      return <Subs y={c.y} oscuro={c.oscuro} color={c.color} tinta={c.tinta} vel={c.vel} />;
    case "frase":
      return <Frase c={c} />;
    case "gancho":
      return <Gancho c={c} />;
    case "video":
      return <OffthreadVideo muted playbackRate={c.vel || 1} src={staticFile("amin/" + c.src)} style={{ position: "absolute", width: "100%", height: "100%", transform: c.espejo ? "scaleX(-1)" : "none" }} />;
    case "mitad":
      return <Mitad c={c} />;
    case "palabra":
      return <PalabraGigante c={c} />;
    case "fondoMarca":
      return <FondoMarca c={c} />;
    case "fondoCrema":
      return <FondoCrema c={c} />;
    case "titular":
      return <Titular c={c} />;
    case "baseSplit":
      return <BaseSplit vel={c.vel} />;
    case "mg":
      return <Mg c={c} />;
    case "subsLimpios":
      return <SubsLimpios c={c} />;
    case "baseElegante":
      return <BaseElegante c={c} />;
    case "subsElegantes":
      return <SubsElegantes c={c} />;
    case "mini":
      return <Miniatura c={c} />;
    case "versus":
      return <Versus c={c} />;
    case "mgPantalla":
      return <MgPantalla c={c} />;
    case "espejo":
      return <Espejo c={c} />;
    case "seguir":
      return <Seguir c={c} />;
    case "basePodcast":
      return <BasePodcast />;
    default:
      return null;
  }
};

const visible = (c: Capa, t: number) => t >= c.a - 0.001 && t < c.b;

// Una sola capa (para exportarla como clip suelto)
export const CapaSuelta: React.FC<{ v: number; id: string }> = ({ v, id }) => {
  const { t } = useT();
  const c = VERSIONES.find((x) => x.n === v)?.capas.find((x) => x.id === id);
  if (!c || !visible(c, t)) return null;
  return (
    <AbsoluteFill>
      <Dibujo c={c} />
    </AbsoluteFill>
  );
};

// Todas las capas apiladas (vista previa de la versión)
export const VersionCompleta: React.FC<{ v: number }> = ({ v }) => {
  const { t } = useT();
  const capas = [...(VERSIONES.find((x) => x.n === v)?.capas ?? [])].sort((a, b) => a.pista - b.pista);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {capas.filter((c) => visible(c, t)).map((c) => (
        <AbsoluteFill key={c.id}>
          <Dibujo c={c} />
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
