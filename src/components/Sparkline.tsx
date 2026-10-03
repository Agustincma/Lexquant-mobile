import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  data: number[];
  width: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width, height = 60, color = "#9FE0DC" }: Props) {
  if (data.length < 2) return null;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i * (width - pad * 2)) / (data.length - 1),
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <Svg width={width} height={height}>
      <Path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={last.x} cy={last.y} r={4} fill="#fff" />
    </Svg>
  );
}
