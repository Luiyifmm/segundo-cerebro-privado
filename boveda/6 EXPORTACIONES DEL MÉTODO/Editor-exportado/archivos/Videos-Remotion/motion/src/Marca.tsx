import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";

// Maquetas de marca: cómo debería verse un vídeo de cada cliente (4 momentos: gancho, cuerpo, énfasis, cierre)
const FUENTES: [string, string][] = [["SequelM", "marca/f/sequel-medium.otf"], ["SequelH", "marca/f/sequel-heavy.otf"], ["Nyght", "marca/f/nyght-italic.otf"]];
const useFuentes = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
};
const SF = "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const sombra = "0 4px 18px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.6)";
const Fondo: React.FC<{ c: string; zoom: number; y: number; filtro?: string }> = ({ c, zoom, y, filtro }) => (
  <Img src={staticFile(`marca/${c}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateY(${y}px)`, filter: filtro || "none" }} />
);
const Sub: React.FC<{ y: number; fam: string; peso?: number; children: React.ReactNode; tam?: number }> = ({ y, fam, peso = 700, children, tam = 60 }) => (
  <div style={{ position: "absolute", top: y, left: 90, right: 150, textAlign: "center", fontFamily: fam, fontWeight: peso, fontSize: tam, color: "white", textShadow: sombra, lineHeight: 1.1 }}>{children}</div>
);
const Zonas: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 220, borderBottom: "2px dashed rgba(255,255,255,0.35)" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 420, borderTop: "2px dashed rgba(255,255,255,0.35)" }} />
    <div style={{ position: "absolute", top: 220, bottom: 420, right: 0, width: 140, borderLeft: "2px dashed rgba(255,255,255,0.35)" }} />
  </>
);

const ClienteA: React.FC<{ e: number }> = ({ e }) => {
  const AZ = "#1E8BFF";
  const tarjeta = (src: string, x: number, bueno: boolean, rot: number, et: string) => (
    <div style={{ position: "absolute", left: x, top: 300, width: 330, height: 440, transform: `rotate(${rot}deg)` }}>
      <Img src={staticFile("marca/" + src)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 22, border: `5px solid ${bueno ? AZ : "rgba(255,255,255,0.85)"}`, boxSizing: "border-box", filter: bueno ? "none" : "grayscale(0.85) brightness(0.8)", boxShadow: bueno ? `0 0 46px ${AZ}99` : "0 14px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 16, bottom: 16, padding: "6px 18px", borderRadius: 30, background: bueno ? AZ : "rgba(0,0,0,0.75)", color: "white", fontFamily: SF, fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>{et}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0D10" }}>
      <Fondo c="clientea" zoom={e === 3 ? 1.5 : e === 2 ? 1 : 1.3} y={e === 3 ? -70 : e === 2 ? 0 : 10} filtro={e === 3 ? "brightness(0.28) blur(6px)" : "contrast(1.05) saturate(0.92)"} />
      {e !== 3 && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)" }} />}
      {e === 1 && (
        <div style={{ position: "absolute", top: 250, left: 80, right: 150 }}>
          <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 58, color: "white", textShadow: sombra }}>Así se viste la mujer que quieren</div>
          <div style={{ fontFamily: "Nyght", fontSize: 112, lineHeight: 0.95, color: AZ, textShadow: "0 6px 30px rgba(0,0,0,0.6)", marginTop: 6, whiteSpace: "nowrap" }}>para toda la vida</div>
        </div>
      )}
      {e === 2 && (<>{tarjeta("clientea-bien.jpg", 50, true, -3, "TODA LA VIDA")}{tarjeta("clientea-mal.jpg", 600, false, 3, "UNA NOCHE")}
        <Sub y={1200} fam={SF}>A ésta la <span style={{ fontFamily: "Nyght", color: AZ, fontSize: 84 }}>respetan</span></Sub></>)}
      {e === 3 && (
        <div style={{ position: "absolute", top: 700, left: 80, right: 80, textAlign: "center" }}>
          <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 62, color: "white" }}>Atraes exactamente</div>
          <div style={{ fontFamily: "Nyght", fontSize: 170, lineHeight: 1, color: AZ }}>lo que proyectas</div>
          <div style={{ width: 220, height: 5, background: "white", margin: "44px auto 0" }} />
        </div>
      )}
      {e === 4 && (
        <div style={{ position: "absolute", top: 1090, left: 80, right: 150, textAlign: "center" }}>
          <div style={{ fontFamily: "Nyght", fontSize: 150, lineHeight: 1, color: AZ, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>Sígueme</div>
          <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 54, color: "white", textShadow: sombra }}>para mejorar tu vida</div>
          <div style={{ display: "inline-block", marginTop: 28, padding: "12px 30px", borderRadius: 40, background: "white", color: "#0B0D10", fontFamily: SF, fontWeight: 700, fontSize: 34 }}>@cliente_a_handle</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const ClienteE: React.FC<{ e: number }> = ({ e }) => {
  const GR = "linear-gradient(180deg, #FFE23A 0%, #FF8A1A 100%)", NA = "#FF7A1A";
  const grad: React.CSSProperties = { background: GR, WebkitBackgroundClip: "text", color: "transparent" };
  return (
    <AbsoluteFill style={{ backgroundColor: "#B5AEA8" }}>
      <Fondo c="clientee" zoom={1.08} y={70} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)" }} />
      {e === 1 && (
        <div style={{ position: "absolute", top: 240, left: 70, right: 150 }}>
          <div style={{ fontFamily: "SequelM", fontSize: 62, color: "white", textShadow: sombra }}>El alimento con más</div>
          <div style={{ fontFamily: "SequelH", fontSize: 170, lineHeight: 0.95, letterSpacing: -5, filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.5))" }}><span style={grad}>PROTEÍNA</span></div>
          <div style={{ fontFamily: "SequelM", fontSize: 44, color: "rgba(255,255,255,0.9)", textShadow: sombra, marginTop: 10 }}>y casi nadie lo consume</div>
        </div>
      )}
      {e === 2 && (<>
        <div style={{ position: "absolute", top: 250, left: 70, width: 820, padding: "30px 34px", borderRadius: 30, background: "rgba(15,15,15,0.72)" }}>
          {[["Pollo", 35, "rgba(255,255,255,0.75)"], ["Este alimento", 62, GR]].map(([n, v, col], i) => (
            <div key={i} style={{ marginBottom: i ? 0 : 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "SequelM", fontSize: 36, color: "white", marginBottom: 10 }}><span>{n}</span><span style={{ fontFamily: "SequelH", fontSize: i ? 64 : 40 }}>{i ? <span style={grad}>{v}%</span> : v + "%"}</span></div>
              <div style={{ height: 26, borderRadius: 14, background: "rgba(255,255,255,0.15)" }}><div style={{ width: `${v}%`, height: "100%", borderRadius: 14, background: col as string }} /></div>
            </div>
          ))}
        </div>
        <Sub y={1180} fam="SequelM" peso={500}>tiene un <span style={{ fontFamily: "SequelH", color: NA }}>62 % de proteína</span></Sub></>)}
      {e === 3 && (<>
        <div style={{ position: "absolute", top: 250, left: 70, width: 820, height: 340, borderRadius: 30, overflow: "hidden", border: "4px solid rgba(255,255,255,0.9)", background: "linear-gradient(135deg, #12372a, #2f7d4f 55%, #9bd27a)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "SequelM", fontSize: 34, color: "rgba(255,255,255,0.8)" }}>imagen de apoyo (siempre arriba, mismo marco)</div>
          <div style={{ position: "absolute", left: 20, bottom: 20, padding: "8px 20px", borderRadius: 30, background: "rgba(0,0,0,0.75)", color: "white", fontFamily: "SequelM", fontSize: 26 }}>Fuente: OMS</div>
        </div>
        <Sub y={1180} fam="SequelM" peso={500}>lo recomienda para la <span style={{ fontFamily: "SequelH", color: NA }}>desnutrición</span></Sub></>)}
      {e === 4 && (
        <div style={{ position: "absolute", top: 1150, left: 70, right: 150, textAlign: "center" }}>
          <div style={{ fontFamily: "SequelM", fontSize: 54, color: "white", textShadow: sombra }}>Este superalimento es la</div>
          <div style={{ fontFamily: "SequelH", fontSize: 140, lineHeight: 1, letterSpacing: -4, filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.5))" }}><span style={grad}>ESPIRULINA</span></div>
          <div style={{ display: "inline-block", marginTop: 26, padding: "14px 32px", borderRadius: 40, background: "white", color: "#111", fontFamily: "SequelH", fontSize: 34 }}>Sígueme para más nutrición</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const ClienteN: React.FC<{ e: number }> = ({ e }) => {
  const RO = "#F0241C", VE = "#22B573";
  const hueco = (x: number, img: string, t: string, col: string, activo: boolean) => (
    <div style={{ position: "absolute", left: x, top: 250, width: 400, opacity: activo ? 1 : 0.38 }}>
      <div style={{ height: 350, borderRadius: 40, background: "rgba(255,255,255,0.94)", border: `8px solid ${col}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: activo ? `0 0 50px ${col}aa` : "none" }}><Img src={staticFile("marca/" + img)} style={{ width: 270, height: 270, objectFit: "contain" }} /></div>
      <div style={{ margin: "-30px auto 0", width: "fit-content", position: "relative", padding: "10px 28px", borderRadius: 40, background: col, color: "white", fontFamily: "SequelH", fontSize: 34, letterSpacing: 1 }}>{t}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#D99A5B" }}>
      <Fondo c="clienten" zoom={1} y={0} filtro={e === 1 ? "grayscale(1) contrast(1.1) brightness(0.8)" : "none"} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)" }} />
      {e === 1 && (
        <div style={{ position: "absolute", top: 1140, left: 70, right: 150, textAlign: "center" }}>
          <div style={{ fontFamily: "SequelH", fontSize: 66, color: "white", textShadow: sombra }}>No eres gordo, estás</div>
          <div style={{ fontFamily: "SequelH", fontSize: 150, lineHeight: 1, letterSpacing: -5, color: RO, textShadow: `0 0 40px ${RO}88, 0 6px 20px rgba(0,0,0,0.6)` }}>INFLAMADO</div>
        </div>
      )}
      {(e === 2 || e === 3) && (<>{hueco(60, "CERVEZA.png", "HINCHA", RO, e === 2)}{hueco(500, "JENGIBRE.png", "DESINFLAMA", VE, e === 3)}
        <Sub y={1190} fam="SequelH" tam={64}>{e === 2 ? <>Bebida que más <span style={{ color: RO }}>hincha</span></> : <>Infusión de <span style={{ color: VE }}>jengibre</span></>}</Sub></>)}
      {e === 4 && (
        <div style={{ position: "absolute", top: 1130, left: 70, right: 150, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "26px 44px", borderRadius: "44px 44px 44px 10px", background: "white", boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}>
            <div style={{ fontFamily: "SequelM", fontSize: 44, color: "#222" }}>Comenta</div>
            <div style={{ fontFamily: "SequelH", fontSize: 120, lineHeight: 1, letterSpacing: -4, color: RO }}>BARRIGA</div>
          </div>
          <div style={{ fontFamily: "SequelH", fontSize: 50, color: "white", textShadow: sombra, marginTop: 26 }}>y te envío mi lista que <span style={{ color: VE }}>desinflama</span></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Marca: React.FC<{ c: string; e: number; zonas?: boolean }> = ({ c, e, zonas }) => {
  useFuentes();
  return (
    <AbsoluteFill>
      {c === "clientea" ? <ClienteA e={e} /> : c === "clientee" ? <ClienteE e={e} /> : <ClienteN e={e} />}
      {zonas && <Zonas />}
    </AbsoluteFill>
  );
};
