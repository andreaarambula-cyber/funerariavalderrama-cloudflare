import { mapaChile } from "@/data/chile";
import { cn } from "@/lib/utils";

// Mapa vertical de Chile por regiones. Destaca la Región del Biobío (origen)
// y marca todas las regiones, para ilustrar los traslados interregionales.
export function MapaChile({ className }: { className?: string }) {
  const { width, height, regiones } = mapaChile;
  const home = regiones.find((r) => r.home);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block w-auto", className)}
      role="img"
      aria-label="Mapa de Chile — coordinamos traslados a todas las regiones del país"
    >
      <defs>
        <radialGradient id="ch-pin" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.6 }} />
          <stop offset="55%" style={{ stopColor: "var(--accent)", stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Regiones */}
      {regiones.map((r) => (
        <path
          key={r.code}
          d={r.d}
          strokeWidth={r.home ? 1.4 : 0.9}
          style={{
            fill: r.home
              ? "var(--accent)"
              : "color-mix(in oklab, var(--accent) 20%, var(--surface))",
            stroke: r.home
              ? "color-mix(in oklab, var(--accent) 75%, black)"
              : "color-mix(in oklab, var(--accent) 42%, var(--surface))",
            filter: r.home
              ? "drop-shadow(0 0 5px color-mix(in oklab, var(--accent) 60%, transparent))"
              : "none",
          }}
        />
      ))}

      {/* Puntos en cada región */}
      {regiones.map((r) => (
        <circle
          key={`d-${r.code}`}
          cx={r.cx}
          cy={r.cy}
          r={2.6}
          style={{ fill: "color-mix(in oklab, var(--accent) 60%, black)" }}
          opacity={r.home ? 0 : 0.7}
        />
      ))}

      {/* Marcador pulsante en la Región del Biobío (origen) */}
      {home && (
        <g>
          <circle cx={home.cx} cy={home.cy} r={14} fill="url(#ch-pin)">
            <animate attributeName="r" values="9;20;9" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle
            cx={home.cx}
            cy={home.cy}
            r={4.5}
            style={{ fill: "color-mix(in oklab, var(--accent) 62%, black)", stroke: "white" }}
            strokeWidth={1.8}
          />
        </g>
      )}
    </svg>
  );
}
