import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { granConcepcion } from "@/data/granConcepcion";

// Recorrido automático por todas las comunas del Gran Concepción (norte a sur).
const TOUR = [
  "Tomé",
  "Penco",
  "Talcahuano",
  "Hualpén",
  "Concepción",
  "Chiguayante",
  "San Pedro de la Paz",
  "Hualqui",
  "Coronel",
  "Lota",
];
// Margen de "océano" a la izquierda para la ventanita "Contáctanos".
const MARGIN_L = 360;

export function CoberturaMapa() {
  const { width, height, comunas } = granConcepcion;
  const tour = TOUR.map((n) => comunas.find((c) => c.name === n)).filter(
    (c): c is (typeof comunas)[number] => Boolean(c),
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (tour.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % tour.length), 2400);
    return () => clearInterval(id);
  }, [tour.length]);

  const active = tour[idx] ?? tour[0];
  const vbW = width + MARGIN_L;
  const px = (active.cx + MARGIN_L) / vbW;
  const py = active.cy / height;
  const labelNearRight = px > 0.62;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border"
      style={{
        background:
          "radial-gradient(120% 100% at 62% 38%, color-mix(in oklab, var(--accent) 6%, var(--surface)), color-mix(in oklab, var(--secondary) 55%, var(--surface)) 90%)",
      }}
    >
      <svg
        viewBox={`${-MARGIN_L} 0 ${vbW} ${height}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label="Mapa del Gran Concepción y comunas de cobertura"
      >
        <defs>
          <radialGradient id="cm-pin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--accent) 70%, black)", stopOpacity: 0.5 }} />
            <stop offset="50%" style={{ stopColor: "color-mix(in oklab, var(--accent) 70%, black)", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--accent) 70%, black)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Comunas del Gran Concepción: cobertura en dorado, resto como contexto */}
        {comunas.map((c) => {
          const on = c.name === active.name;
          return (
            <path
              key={c.name}
              d={c.d}
              strokeWidth={on ? 1.8 : 1.2}
              style={{
                fill: on
                  ? "var(--accent)"
                  : "color-mix(in oklab, var(--accent) 48%, var(--surface))",
                stroke: "color-mix(in oklab, var(--accent) 78%, black)",
                filter: on ? "drop-shadow(0 1px 4px color-mix(in oklab, var(--accent) 55%, transparent))" : "none",
                transition: "fill 600ms ease, stroke 600ms ease, filter 600ms ease",
              }}
            />
          );
        })}

        {/* Pines en todas las comunas del Gran Concepción */}
        {comunas.map((c) => {
            const on = c.name === active.name;
            return (
              <g key={`pin-${c.name}`}>
                <circle cx={c.cx} cy={c.cy} r={on ? 30 : 18} fill="url(#cm-pin)" opacity={on ? 1 : 0.8}>
                  {on && (
                    <animate attributeName="r" values="22;34;22" dur="2.4s" repeatCount="indefinite" />
                  )}
                </circle>
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={on ? 8 : 6}
                  style={{
                    fill: "color-mix(in oklab, var(--accent) 62%, black)",
                    stroke: "white",
                    transition: "r 400ms ease",
                  }}
                  strokeWidth={2.5}
                />
              </g>
            );
          })}
      </svg>

      {/* Etiqueta con el nombre de la comuna activa */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          left: `${px * 100}%`,
          top: `${py * 100}%`,
          transform: labelNearRight ? "translate(calc(-100% - 16px), -50%)" : "translate(16px, -50%)",
          transition:
            "left 700ms cubic-bezier(.4,0,.2,1), top 700ms cubic-bezier(.4,0,.2,1), transform 700ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <span className="whitespace-nowrap rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white shadow-elevated backdrop-blur-sm">
          {active.name}
        </span>
      </div>

      {/* Ventanita "Contáctanos" arriba a la izquierda (compacta) */}
      <div className="absolute left-2.5 top-2.5 w-[7.5rem] rounded-xl border border-border bg-surface/95 p-2.5 shadow-elevated backdrop-blur-sm sm:left-3 sm:top-3 sm:w-[11rem] sm:p-3">
        <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
          <MapPin className="h-3 w-3 shrink-0" /> Cobertura
        </p>
        <p className="mt-0.5 font-serif text-sm leading-tight text-primary sm:text-base">
          Gran Concepción
        </p>
        <Link
          to="/contacto"
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1 rounded-full bg-accent px-2 py-1.5 text-[10px] font-medium text-accent-foreground shadow-soft transition hover:brightness-105 sm:px-3 sm:text-[11px]"
        >
          Contáctanos <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
