import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = { texto: string; subtexto: string };

export const Titulo: React.FC<Props> = ({ texto, subtexto }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const salida = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barra = spring({ frame, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 18, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: salida }}>
      <div style={{ display: "flex", fontFamily: "Helvetica Neue, Arial, sans-serif", fontWeight: 800, fontSize: 130, color: "white", letterSpacing: -2 }}>
        {texto.split("").map((letra, i) => {
          const s = spring({ frame: frame - i * 1.5, fps, config: { damping: 14, mass: 0.6 } });
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
              {letra}
            </span>
          );
        })}
      </div>
      <div style={{ height: 8, width: 900 * barra, background: "#FFD400", borderRadius: 4, marginTop: 10 }} />
      <div style={{ fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 44, color: "white", marginTop: 28, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
        {subtexto}
      </div>
    </AbsoluteFill>
  );
};
