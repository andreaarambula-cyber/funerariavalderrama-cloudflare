import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { granConcepcion } from "@/data/granConcepcion";

// Recorrido automático por las comunas de cobertura (de norte a sur).
const TOUR = ["Talcahuano", "Hualpén", "Concepción", "San Pedro de la Paz", "Chiguayante"];
// Margen de "océano" a la izquierda: desplaza las comunas a la derecha para
// dejar libre la esquina superior izquierda (ventanita "Contáctanos").
const MARGIN_L = 540;

export function CoberturaMapa() {
  const { width, height, comunas } = granConcepcion;
  const tour = TOUR.map((n) => comunas.find((c) => c.name === n)).filter(
    (c): c is (typeof comunas)[number] => Boolean(c),
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (tour.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % tour.length), 2600);
    return () => clearInterval(id);
  }, [tour.length]);

  const active = tour[idx] ?? tour[0];
  const vbW = width + MARGIN_L;
  const px = (active.cx + MARGIN_L) / vbW; // 0..1 horizontal
  const py = active.cy / height; // 0..1 vertical

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-accent/15 shadow-elevated"
      style={{
        background:
          "radial-gradient(130% 100% at 62% 38%, color-mix(in oklab, var(--accent) 16%, var(--primary)), var(--primary) 72%)",
      }}
    >
      {/* Foco luminoso que sigue a la comuna activa */}
      <div
        className="pointer-events-none absolute -z-0 aspect-square w-[55%] rounded-full"
        style={{
          left: `${px * 100}%`,
          top: `${py * 100}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 55%, transparent), transparent 65%)",
          filter: "blur(28px)",
          opacity: 0.55,
          transition: "left 800ms ease, top 800ms ease",
        }}
      />

      <svg
        viewBox={`${-MARGIN_L} 0 ${vbW} ${height}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label="Mapa del Gran Concepción y comunas de cobertura"
      >
        <defs>
          <radialGradient id="cm-pin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.95 }} />
            <stop offset="40%" style={{ stopColor: "var(--accent)", stopOpacity: 0.45 }} />
            <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Comunas: las inactivas tenues, la activa encendida con glow */}
        {comunas.map((c) => {
          const on = c.name === active.name;
          return (
            <path
              key={c.name}
              d={c.d}
              strokeWidth={on ? 2 : 1.3}
              style={{
                fill: on
                  ? "color-mix(in oklab, var(--accent) 88%, white)"
                  : "color-mix(in oklab, var(--accent) 22%, transparent)",
                stroke: on
                  ? "color-mix(in oklab, var(--accent) 80%, white)"
                  : "color-mix(in oklab, var(--accent) 58%, transparent)",
                filter: on ? "drop-shadow(0 0 7px var(--accent))" : "none",
                transition: "fill 700ms ease, stroke 700ms ease, filter 700ms ease",
              }}
            />
          );
        })}

        {/* Pines luminosos en cada comuna */}
        {comunas.map((c) => {
          const on = c.name === active.name;
          return (
            <g key={`pin-${c.name}`}>
              <circle
                cx={c.cx}
                cy={c.cy}
                r={on ? 34 : 24}
                fill="url(#cm-pin)"
                style={{ transition: "r 600ms ease" }}
                opacity={on ? 1 : 0.85}
              >
                {on && (
                  <animate attributeName="r" values="28;42;28" dur="2.4s" repeatCount="indefinite" />
                )}
              </circle>
              <circle
                cx={c.cx}
                cy={c.cy}
                r={on ? 8 : 6}
                style={{
                  fill: "var(--primary)",
                  stroke: "var(--accent)",
                  filter: on ? "drop-shadow(0 0 5px var(--accent))" : "none",
                  transition: "r 400ms ease",
                }}
                strokeWidth={2.5}
              />
              <circle cx={c.cx} cy={c.cy} r={on ? 3 : 2.4} style={{ fill: "var(--accent)" }} />
            </g>
          );
        })}
      </svg>

      {/* Etiqueta con el nombre de la comuna activa (se mueve con el pin) */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          left: `${px * 100}%`,
          top: `${py * 100}%`,
          transform: "translate(18px, -50%)",
          transition: "left 800ms cubic-bezier(.4,0,.2,1), top 800ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <span className="whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-[0_2px_14px_color-mix(in_oklab,var(--accent)_60%,transparent)]">
          {active.name}
        </span>
      </div>

      {/* Ventanita "Contáctanos" arriba a la izquierda (vidrio oscuro) */}
      <div className="absolute left-2.5 top-2.5 w-[34%] max-w-[11rem] rounded-xl border border-accent/25 bg-primary/55 p-3 shadow-elevated backdrop-blur-md sm:left-3 sm:top-3">
        <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
          <MapPin className="h-3 w-3 shrink-0" /> Cobertura
        </p>
        <p className="mt-0.5 font-serif text-sm leading-tight text-white sm:text-base">
          Gran Concepción
        </p>
        <Link
          to="/contacto"
          className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-accent-foreground shadow-soft transition hover:brightness-110"
        >
          Contáctanos <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
