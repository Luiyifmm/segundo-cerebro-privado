// Amin 6887-11 · «10 negocios del peor al mejor». Capa transparente para Premiere (diseño 1080×1920, escala 200 en la secuencia 4K).
// v5 (11-11, correcciones de Luis): la imagen aparece en el CENTRO como cuadrado con bordes redondeados y, al volar a su
// número, se va convirtiendo en círculo. Columna 1–10 más grande. Sin rótulo con el nombre (lo dice el subtítulo).
// El título pequeño entra cuando termina el título grande de Luis (3 s); la columna, a 1,23 s (donde Luis recortó la capa).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const AM = "rgb(243,255,0)";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const useFuente = () => {
  const [h] = useState(() => delayRender("fuente"));
  useEffect(() => {
    new FontFace("SFB", `url(${staticFile("marca/f/sfpro-bold.otf")})`).load().then((x) => { document.fonts.add(x); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
};

export type Negocio = { puesto: number; img: string; pop: number; vuelo: number; icono?: string; fondo?: string; tamIcono?: number; pos?: string; zoom?: number };
// v2 iconos (11-11): si hay «icono» (SVG ya coloreado), se pinta sobre «fondo» en vez de la foto.
const Contenido: React.FC<{ n: Negocio; esc?: number }> = ({ n, esc = 1 }) => {
  const tam = `${Math.min(0.9, (n.tamIcono ?? 0.64) * esc) * 100}%`;
  const ico = n.icono ? <Img src={staticFile(n.icono)} style={{ width: tam, height: tam, objectFit: "contain" }} /> : null;
  return n.icono ? (
  <div style={{ width: "100%", height: "100%", background: "#0b0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {n.fondo ? <div style={{ width: "78%", height: "78%", borderRadius: "50%", background: n.fondo, display: "flex", alignItems: "center", justifyContent: "center" }}>{ico}</div> : ico}
  </div>
) : <Img src={staticFile(n.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: n.pos ?? "50% 50%", transform: `scale(${n.zoom ?? 1})`, transformOrigin: n.pos ?? "50% 50%" }} />;
};
type P = { negocios: Negocio[]; tFin: number; titulo1: string; titulo2: string; tColumna: number; tTitulo: number; y0?: number; paso?: number; vueloRecto?: boolean; r?: number;
  sub?: { texto: string; desde: number; y: number; size: number; ls?: number; dx?: number } };

const X = 136, Y0D = 400, PASOD = 120, RD = 54;       // columna (1080 px): x 74–182, y 346–1534
const CX = 600, CY = 1370, LADO = 380;              // imagen al centro, sobre el pecho (y 0,62–0,79)
const VUELO = 0.6, VUELO_R = 0.7;
const borde = (w: number) => `${w}px #000`;

export const AminRankingNegocios: React.FC<P> = ({ negocios, tFin, titulo1, titulo2, tColumna, tTitulo, y0, paso, vueloRecto, r, sub }) => {
  useFuente();
  // r4 (12-11): y0/paso opcionales para bajar la columna bajo el título de Luis.
  const Y0 = y0 ?? Y0D, PASO = paso ?? PASOD, R = r ?? RD;
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const t = f / fps;
  const sal = interpolate(t, [tFin - 0.3, tFin], [1, 0], cl);
  const col = interpolate(t, [tColumna, tColumna + 0.3], [0, 1], cl);
  const tit = interpolate(t, [tTitulo, tTitulo + 0.3], [0, 1], cl);
  const lleno = (n: Negocio) => t >= n.vuelo + (vueloRecto ? VUELO_R : VUELO);
  const pulso = 1 + 0.07 * Math.sin(t * Math.PI * 2 * 1.2);

  return (
    <AbsoluteFill style={{ opacity: sal, fontFamily: "SFB" }}>
      <div style={{ position: "absolute", top: 256, left: 190, right: 60, textAlign: "center", lineHeight: 1, opacity: tit, transform: `translateY(${(1 - tit) * -16}px)` }}>
        <div style={{ fontSize: 80, color: AM, letterSpacing: -2, WebkitTextStroke: borde(5), paintOrder: "stroke fill", textShadow: "0 6px 26px rgba(0,0,0,0.55)" }}>{titulo1}</div>
        <div style={{ fontSize: 42, color: "white", marginTop: 8, letterSpacing: 1, WebkitTextStroke: borde(4), paintOrder: "stroke fill", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{titulo2}</div>
      </div>

      {/* r7 (12-11): continuación del texto nativo de Luis «DEL PEOR AL MEJOR» (su clip acaba en 1,57 s) */}
      {sub && t >= sub.desde ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: sub.y, textAlign: "center", fontSize: sub.size, lineHeight: 1, color: "white", letterSpacing: sub.ls ?? 0, transform: `translateX(${sub.dx ?? 0}px)`, textShadow: "0 3px 12px rgba(0,0,0,0.55)" }}>{sub.texto}</div>
      ) : null}
      {Array.from({ length: 10 }).map((_, i) => {
        const puesto = i + 1, y = Y0 + i * PASO;
        const n = negocios.find((q) => q.puesto === puesto);
        const activo = n && t >= n.vuelo && !lleno(n);
        const encaje = n ? interpolate(t, [n.vuelo + (vueloRecto ? VUELO_R : VUELO), n.vuelo + (vueloRecto ? VUELO_R : VUELO) + 0.35], [0, 1], cl) : 0;
        const a = interpolate(t, [tColumna + i * 0.03, tColumna + i * 0.03 + 0.25], [0, 1], cl);
        return (
          <div key={i} style={{ position: "absolute", left: X - R, top: y - R, width: 2 * R, height: 2 * R, opacity: a }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `scale(${activo ? 1.12 : 1})`,
              border: activo ? `6px solid ${AM}` : `4px dashed rgba(255,255,255,0.8)`, background: "rgba(0,0,0,0.4)",
              boxShadow: "0 3px 8px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 46, color: activo ? AM : "white", boxSizing: "border-box" }}>
              {puesto === 1 && !(n && t >= n.vuelo) ? <span style={{ color: AM, fontSize: 56, transform: `scale(${pulso})` }}>?</span> : puesto}
            </div>
            {n && lleno(n) ? (
              <>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: `4px solid ${AM}`, boxSizing: "border-box" }}><Contenido n={n} esc={1.18} /></div>
                <div style={{ position: "absolute", right: -14, bottom: -10, minWidth: 48, height: 48, borderRadius: 24, background: "#000", color: AM, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 7px" }}>{puesto}</div>
                {encaje > 0 && encaje < 1 ? <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `5px solid ${AM}`, transform: `scale(${1 + encaje * 0.22})`, opacity: 1 - encaje }} /> : null}
              </>
            ) : null}
          </div>
        );
      })}

      {/* Imagen: aparece al centro (cuadrado redondeado) y vuela a su número convirtiéndose en círculo */}
      {negocios.map((n, k) => {
        if (t < n.pop || lleno(n)) return null;
        const ent = spring({ frame: f - Math.round(n.pop * fps), fps, config: { damping: 13, stiffness: 170 } });
        const ty = Y0 + (n.puesto - 1) * PASO;
        let v: number, cx: number, cy: number, lado: number;
        if (vueloRecto) {
          // r5 (12-11, pedido de Luis): trayectoria recta con un arco suave (Bézier cuadrática, flecha 7 % hacia fuera de la cara)
          // y aceleración/frenada suaves. 0,7 s.
          const lin = interpolate(t, [n.vuelo, n.vuelo + VUELO_R], [0, 1], cl);
          v = Easing.bezier(0.6, 0, 0.25, 1)(lin);
          const dx = X - CX, dy = ty - CY, L = Math.hypot(dx, dy) || 1;
          const nx = dy / L, ny = -dx / L;               // normal: hacia abajo-izquierda (lejos de la cara)
          const flecha = 0.07 * L * (nx < 0 ? 1 : -1);
          const qx = CX + dx / 2 + nx * flecha, qy = CY + dy / 2 + ny * flecha;
          lado = interpolate(v, [0, 1], [LADO, 2 * R]);
          cx = (1 - v) * (1 - v) * CX + 2 * (1 - v) * v * qx + v * v * X;
          cy = (1 - v) * (1 - v) * CY + 2 * (1 - v) * v * qy + v * v * ty;
        } else {
          v = interpolate(t, [n.vuelo, n.vuelo + VUELO], [0, 1], cl);
          // Primero se desplaza en horizontal (bajo la barbilla) y luego sube o baja por el borde: nunca cruza la cara.
          const px = 1 - Math.pow(1 - v, 2.4), py = Math.pow(v, 2.2);
          lado = interpolate(v, [0, 1], [LADO, 2 * R]);
          cx = Math.max(interpolate(px, [0, 1], [CX, X]), 82 + lado / 2); cy = interpolate(py, [0, 1], [CY, ty]);
        }
        const radio = interpolate(v, [0, 0.75], [0.12, 0.5], cl); // fracción del lado: 12 % (cuadrado redondeado) → 50 % (círculo)
        return (
          <div key={k} style={{ position: "absolute", left: cx - lado / 2, top: cy - lado / 2, width: lado, height: lado,
            transform: `scale(${v > 0 ? 1 : ent})`, borderRadius: lado * radio, overflow: "hidden",
            border: `${interpolate(v, [0, 1], [7, 4])}px solid ${AM}`, boxShadow: `0 ${10 * (1 - v)}px ${24 * (1 - v)}px rgba(0,0,0,${0.55 * (1 - v)})`, boxSizing: "border-box" }}>
            <Contenido n={n} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
