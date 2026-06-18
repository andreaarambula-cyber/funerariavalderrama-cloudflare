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
      d="M0 0 C7 -3 16 -2 22 4 C16 6 7 6 0 0 Z"
      fill="currentColor"
      opacity={opacity}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    />
  );
}

export function LeafDecoration({ className }: { className?: string }) {
  // Points sampled down a gentle S-curve from top to bottom.
  const stem: Array<[number, number, number]> = [
    [150, 6, 96],
    [146, 30, 100],
    [140, 54, 106],
    [132, 78, 112],
    [124, 102, 118],
    [118, 126, 122],
    [114, 150, 126],
    [114, 174, 130],
    [118, 198, 134],
    [126, 222, 138],
    [136, 244, 142],
  ];
  return (
    <svg
      viewBox="0 0 180 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Curving stem */}
      <path
        d="M150 6 C146 30 140 54 132 78 C124 102 116 126 114 150 C112 174 118 198 126 222 C132 238 136 244 136 244"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.9"
      />
      {stem.map(([x, y, base], i) => (
        <g key={i}>
          {/* Leaf pointing outward (to the right) */}
          <Leaf x={x} y={y} rotate={base - 70} scale={1} opacity={0.95} />
          {/* Leaf pointing inward (to the left) */}
          <Leaf x={x} y={y} rotate={base + 110} scale={0.92} opacity={0.8} />
          {/* Small berry near the node */}
          {i % 2 === 0 && (
            <circle cx={x - 4} cy={y + 2} r="1.8" fill="currentColor" opacity="0.7" />
          )}
        </g>
      ))}
    </svg>
  );
}
