import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const NEGRO = "#0B0C10";
const ACENTO = "#FF4A1C";
const BLANCO = "#F5F3EE";
const SANS = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Menlo, 'SF Mono', monospace";

const suave = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Rejilla: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.07)" }) => {
  const frame = useCurrentFrame();
  const deriva = (frame * 0.6) % 90;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "90px 90px",
        backgroundPosition: `0px ${deriva}px`,
      }}
    />
  );
};

const Hud: React.FC<{ n: string; etiqueta: string; color?: string }> = ({ n, etiqueta, color = "rgba(255,255,255,0.55)" }) => (
  <AbsoluteFill style={{ fontFamily: MONO, fontSize: 22, color, letterSpacing: 2 }}>
    <div style={{ position: "absolute", top: 250, left: 70 }}>● {etiqueta}</div>
    <div style={{ position: "absolute", top: 250, right: 70 }}>{n} / 04</div>
    <div style={{ position: "absolute", bottom: 420, left: 70, width: 26, height: 26, borderLeft: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
    <div style={{ position: "absolute", bottom: 420, right: 70, width: 26, height: 26, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
  </AbsoluteFill>
);

// Texto que sube desde detrás de una máscara
const Revelar: React.FC<{ children: React.ReactNode; retraso?: number; style?: React.CSSProperties }> = ({ children, retraso = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - retraso, fps, config: { damping: 18, mass: 0.7 } });
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - s) * 110}%)` }}>{children}</div>
    </div>
  );
};

const Apertura: React.FC = () => {
  const frame = useCurrentFrame();
  const linea = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: suave });
  const sube = interpolate(frame, [14, 30], [0, 1], { ...clamp, easing: suave });
  const respira = 0.75 + 0.25 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ backgroundColor: NEGRO }}>
      <Rejilla />
      <Hud n="01" etiqueta="MOTION REEL" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 960 - sube * 190,
            height: 5,
            width: 900 * linea,
            background: ACENTO,
            boxShadow: `0 0 ${50 * respira}px ${10 * respira}px ${ACENTO}`,
          }}
        />
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Revelar retraso={16}>
            <div style={{ fontFamily: SANS, fontSize: 210, color: BLANCO, letterSpacing: -8, lineHeight: 1 }}>
              EDITA<span style={{ color: ACENTO }}>.</span>
            </div>
          </Revelar>
          <Revelar retraso={24}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: BLANCO, marginTop: 6 }}>sin tocar la línea de tiempo</div>
          </Revelar>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PALABRAS = [
  { texto: "CADA", fondo: BLANCO, color: NEGRO },
  { texto: "FRAME", fondo: ACENTO, color: NEGRO },
  { texto: "CUENTA", fondo: "#1437FF", color: BLANCO },
];

const Cinetica: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = 18;
  const i = Math.min(PALABRAS.length - 1, Math.floor(frame / paso));
  const local = frame - i * paso;
  const p = PALABRAS[i];
  const s = spring({ frame: local, fps, config: { damping: 12, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ backgroundColor: p.fondo, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      {/* eco de la palabra en contorno detrás */}
      {[-2, -1, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            top: 960 + k * 230 - 115,
            fontFamily: SANS,
            fontSize: 200,
            letterSpacing: -8,
            color: "transparent",
            WebkitTextStroke: `3px ${p.color}`,
            opacity: 0.16 * s,
            transform: `translateX(${(1 - s) * k * 160}px)`,
          }}
        >
          {p.texto}
        </div>
      ))}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 200,
          letterSpacing: -8,
          color: p.color,
          transform: `scale(${0.7 + 0.3 * s})`,
          filter: `blur(${(1 - s) * 14}px)`,
        }}
      >
        {p.texto}
      </div>
    </AbsoluteFill>
  );
};

const BARRAS = [0.22, 0.3, 0.27, 0.42, 0.5, 0.47, 0.66, 0.78, 1];

const Datos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const avance = interpolate(frame, [6, 50], [0, 1], { ...clamp, easing: suave });
  const numero = Math.round(312 * avance);
  const radio = 110;
  const circ = 2 * Math.PI * radio;
  return (
    <AbsoluteFill style={{ backgroundColor: BLANCO }}>
      <Rejilla color="rgba(0,0,0,0.05)" />
      <Hud n="03" etiqueta="RESULTADOS" color="rgba(0,0,0,0.5)" />
      <div style={{ position: "absolute", top: 400, left: 90, right: 90 }}>
        <Revelar>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: NEGRO }}>tiempo ahorrado</div>
        </Revelar>
        <div style={{ fontFamily: SANS, fontSize: 250, color: NEGRO, letterSpacing: -10, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
          +{numero}
          <span style={{ color: ACENTO }}>%</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 860, left: 90, display: "flex", alignItems: "center", gap: 40 }}>
        <svg width={260} height={260} viewBox="0 0 260 260">
          <circle cx={130} cy={130} r={radio} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={22} />
          <circle
            cx={130}
            cy={130}
            r={radio}
            fill="none"
            stroke={ACENTO}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - 0.78 * avance)}
            transform="rotate(-90 130 130)"
          />
          <text x={130} y={148} textAnchor="middle" fontFamily={SANS} fontSize={54} fill={NEGRO}>
            {Math.round(78 * avance)}%
          </text>
        </svg>
        <div style={{ fontFamily: MONO, fontSize: 30, color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>
          cortes
          <br />
          automáticos
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 470, height: 330, display: "flex", alignItems: "flex-end", gap: 18, borderBottom: `3px solid ${NEGRO}` }}>
        {BARRAS.map((h, i) => {
          const s = spring({ frame: frame - 10 - i * 3, fps, config: { damping: 14, mass: 0.6 } });
          return <div key={i} style={{ flex: 1, height: 330 * h * s, background: i === BARRAS.length - 1 ? ACENTO : NEGRO }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const PASOS = ["PROMPT", "CÓDIGO", "VÍDEO"];

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fuera = interpolate(frame, [44, 54], [1, 0], clamp);
  const logo = spring({ frame: frame - 54, fps, config: { damping: 16, mass: 0.7 } });
  const respira = 0.7 + 0.3 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ backgroundColor: NEGRO }}>
      <Rejilla />
      <Hud n="04" etiqueta="PIPELINE" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fuera }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {PASOS.map((t, i) => {
            const s = spring({ frame: frame - i * 9, fps, config: { damping: 15, mass: 0.6 } });
            const activo = i === PASOS.length - 1;
            const trazo = interpolate(frame, [i * 9 + 6, i * 9 + 16], [0, 1], { ...clamp, easing: suave });
            return (
              <React.Fragment key={t}>
                <div
                  style={{
                    width: 620,
                    padding: "44px 0",
                    textAlign: "center",
                    fontFamily: SANS,
                    fontSize: 84,
                    letterSpacing: -2,
                    color: activo ? NEGRO : BLANCO,
                    background: activo ? ACENTO : "transparent",
                    border: `3px solid ${activo ? ACENTO : "rgba(255,255,255,0.7)"}`,
                    boxShadow: activo ? `0 0 ${70 * respira}px ${ACENTO}` : "none",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 60}px)`,
                  }}
                >
                  {t}
                </div>
                {i < PASOS.length - 1 && <div style={{ width: 4, height: 90 * trazo, marginBottom: 90 * (1 - trazo), background: ACENTO }} />}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: logo }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `scale(${0.9 + 0.1 * logo})` }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: ACENTO, boxShadow: `0 0 ${60 * respira}px ${ACENTO}` }} />
          <div style={{ fontFamily: SANS, fontSize: 150, color: BLANCO, letterSpacing: -6 }}>Luiyi</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: BLANCO, marginTop: 10 }}>editor de vídeo</div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: ACENTO, letterSpacing: 6, marginTop: 36 }}>CADA FRAME, A PROPÓSITO</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NEGRO }}>
    <Sequence durationInFrames={66}>
      <Apertura />
    </Sequence>
    <Sequence from={66} durationInFrames={54}>
      <Cinetica />
    </Sequence>
    <Sequence from={120} durationInFrames={84}>
      <Datos />
    </Sequence>
    <Sequence from={204} durationInFrames={126}>
      <Cierre />
    </Sequence>
  </AbsoluteFill>
);
