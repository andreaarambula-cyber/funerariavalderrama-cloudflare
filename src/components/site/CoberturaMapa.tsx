import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { granConcepcion } from "@/data/granConcepcion";

// Recorrido automático por las comunas de cobertura (de norte a sur).
const TOUR = ["Talcahuano", "Hualpén", "Concepción", "San Pedro de la Paz", "Chiguayante"];
// Margen de océano a la izquierda: desplaza las comunas a la derecha para dejar
// libre la esquina superior izquierda (donde va la ventanita "Contáctanos").
const MARGIN_L = 230;

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
  // Posición (%) de la comuna activa dentro del viewBox mostrado.
  const labelLeft = ((active.cx + MARGIN_L) / vbW) * 100;
  const labelTop = (active.cy / height) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/40">
      <svg
        viewBox={`${-MARGIN_L} 0 ${vbW} ${height}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Mapa del Gran Concepción y comunas de cobertura"
      >
        {/* Comunas del Gran Concepción que dan contexto (no destacadas) */}
        {comunas
          .filter((c) => !c.served)
          .map((c) => (
            <path
              key={c.name}
              d={c.d}
              strokeWidth={1.1}
              style={{
                fill: "color-mix(in oklab, var(--muted) 55%, var(--surface))",
                stroke: "var(--border)",
              }}
            />
          ))}

        {/* Comunas de cobertura — la activa se ilumina */}
        {comunas
          .filter((c) => c.served)
          .map((c) => {
            const on = c.name === active.name;
            return (
              <path
                key={c.name}
                d={c.d}
                strokeWidth={on ? 1.8 : 1.2}
                style={{
                  fill: on
                    ? "var(--accent)"
                    : "color-mix(in oklab, var(--accent) 52%, var(--surface))",
                  stroke: "color-mix(in oklab, var(--accent) 60%, black)",
                  transition: "fill 700ms ease, stroke 700ms ease",
                }}
              />
            );
          })}

        {/* Marcador que se desplaza de comuna en comuna */}
        <g
          style={{
            transform: `translate(${active.cx}px, ${active.cy}px)`,
            transition: "transform 700ms cubic-bezier(.4,0,.2,1)",
          }}
        >
          <circle r={20} style={{ fill: "var(--accent)" }} opacity={0.22}>
            <animate attributeName="r" values="13;26;13" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle r={8} style={{ fill: "var(--accent)", stroke: "white" }} strokeWidth={2.5} />
        </g>
      </svg>

      {/* Etiqueta con el nombre de la comuna activa (se mueve con el marcador) */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          left: `${labelLeft}%`,
          top: `${labelTop}%`,
          transform: "translate(14px, -50%)",
          transition: "left 700ms cubic-bezier(.4,0,.2,1), top 700ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <span className="whitespace-nowrap rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white shadow-elevated backdrop-blur-sm">
          {active.name}
        </span>
      </div>

      {/* Ventanita "Contáctanos" arriba a la izquierda */}
      <div className="absolute left-3 top-3 w-[min(46%,12.5rem)] rounded-xl border border-border bg-surface/95 p-4 shadow-elevated backdrop-blur-sm sm:left-4 sm:top-4">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          <MapPin className="h-3.5 w-3.5" /> Zona de cobertura
        </p>
        <p className="mt-1 font-serif text-lg leading-tight text-primary">Gran Concepción</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          ¿Tu comuna está en la zona? Escríbenos.
        </p>
        <Link
          to="/contacto"
          className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground shadow-soft transition hover:brightness-105"
        >
          Contáctanos <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
