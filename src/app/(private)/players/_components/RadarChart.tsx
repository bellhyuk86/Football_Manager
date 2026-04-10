"use client";

interface RadarChartProps {
  values: number[]; // 6 values, each 0-100
  labels?: string[];
  size?: number;
}

const DEFAULT_LABELS = ["SPD", "SHO", "PAS", "DRI", "DEF", "PHY"];
const LABEL_PADDING = 20;

function getHexPoint(center: number, radius: number, index: number): [number, number] {
  const angle = (Math.PI / 3) * index - Math.PI / 2;
  return [
    center + radius * Math.cos(angle),
    center + radius * Math.sin(angle),
  ];
}

function hexagonPoints(center: number, radius: number): string {
  return Array.from({ length: 6 }, (_, i) =>
    getHexPoint(center, radius, i).join(",")
  ).join(" ");
}

function getLabelAnchor(index: number): "middle" | "start" | "end" {
  if (index === 0 || index === 3) return "middle";
  if (index === 1 || index === 2) return "start";
  return "end";
}

function getLabelBaseline(index: number): "auto" | "middle" | "hanging" {
  if (index === 0) return "auto"; // top
  if (index === 3) return "hanging"; // bottom
  return "middle";
}

export default function RadarChart({
  values,
  labels = DEFAULT_LABELS,
  size = 160,
}: RadarChartProps) {
  const svgSize = size + LABEL_PADDING * 2;
  const center = svgSize / 2;
  const maxR = size / 2 - 4;

  const dataPoints = values
    .map((v, i) => {
      const r = (v / 100) * maxR;
      return getHexPoint(center, r, i).join(",");
    })
    .join(" ");

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      style={{ flexShrink: 0 }}
    >
      {/* Grid rings */}
      <polygon
        points={hexagonPoints(center, maxR)}
        fill="none"
        stroke="rgba(150,170,160,0.35)"
        strokeWidth="1"
      />
      <polygon
        points={hexagonPoints(center, maxR * 0.66)}
        fill="none"
        stroke="rgba(150,170,160,0.25)"
        strokeWidth="1"
      />
      <polygon
        points={hexagonPoints(center, maxR * 0.33)}
        fill="none"
        stroke="rgba(150,170,160,0.18)"
        strokeWidth="1"
      />

      {/* Axes */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = getHexPoint(center, maxR, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="rgba(150,170,160,0.25)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="rgba(104,219,174,0.2)"
        stroke="rgba(104,219,174,0.6)"
        strokeWidth="1.5"
      />

      {/* Data dots */}
      {values.map((v, i) => {
        const r = (v / 100) * maxR;
        const [x, y] = getHexPoint(center, r, i);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="#68dbae"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const [x, y] = getHexPoint(center, maxR + 14, i);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={getLabelAnchor(i)}
            dominantBaseline={getLabelBaseline(i)}
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontWeight="600"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
