// A single laurel branch echoing the olive wreath in the Valderrama logo.
// One almond-shaped leaf, reused along a curving stem.
function Leaf({
  x,
  y,
  rotate,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <path
      d="M0 0 C9 -7 22 -7 34 0 C22 7 9 7 0 0 Z"
      fill="currentColor"
      opacity={opacity}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    />
  );
}

export function LeafDecoration({ className }: { className?: string }) {
  // Nodes down a gentle curve near the right edge. The branch fans leaves
  // up-and-left into the card, echoing the olive wreath in the logo.
  // [x, y, tangentAngle]
  const stem: Array<[number, number, number]> = [
    [168, 12, 100],
    [160, 38, 104],
    [152, 64, 110],
    [144, 90, 116],
    [138, 116, 122],
    [134, 142, 128],
    [134, 168, 134],
    [138, 194, 140],
    [146, 220, 146],
    [158, 244, 152],
  ];
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid slice"
      className={className}
      aria-hidden="true"
    >
      {/* Curving stem */}
      <path
        d="M168 12 C160 38 150 64 144 90 C138 116 132 142 134 168 C136 194 146 220 158 244"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      {stem.map(([x, y, base], i) => (
        <g key={i}>
          {/* Outer leaf, fanning up-left into the card */}
          <Leaf x={x} y={y} rotate={base + 150} scale={1.15} opacity={0.95} />
          {/* Inner leaf */}
          <Leaf x={x} y={y} rotate={base + 195} scale={0.95} opacity={0.7} />
          {/* Berry near the node */}
          {i % 2 === 0 && (
            <circle cx={x + 3} cy={y - 2} r="2.4" fill="currentColor" opacity="0.8" />
          )}
        </g>
      ))}
    </svg>
  );
}
