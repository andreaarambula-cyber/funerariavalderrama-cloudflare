import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { obituaries } from "@/data/obituaries";

export const Route = createFileRoute("/obituarios")({
  head: () => ({
    meta: [
      { title: "Obituarios online — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Memoriales digitales para honrar a quienes ya no están. Encuentra obituarios por nombre, fecha o comuna y deja tus condolencias.",
      },
    ],
  }),
  component: ObituariosPage,
});

function ObituariosPage() {
  const [q, setQ] = useState("");
  const [comuna, setComuna] = useState("Todas");

  const comunas = useMemo(
    () => ["Todas", ...Array.from(new Set(obituaries.map((o) => o.comuna)))],
    [],
  );

  const results = obituaries.filter((o) => {
    const matchQ = o.fullName.toLowerCase().includes(q.toLowerCase());
    const matchC = comuna === "Todas" || o.comuna === comuna;
    return matchQ && matchC;
  });

  return (
    <>
      <PageHero
        eyebrow="Obituarios"
        title="Honramos su memoria"
        subtitle="Un espacio para recordar a quienes ya no están y para que familiares y amigos puedan dejar un mensaje, encender una vela o asistir a la despedida."
      />

      <section className="container-prose py-12 md:py-16">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre…"
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Buscar obituarios"
            />
          </div>
          <select
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filtrar por comuna"
          >
            {comunas.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "obituario" : "obituarios"}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <Link
              key={o.slug}
              to="/obituarios/$slug"
              params={{ slug: o.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={o.photo}
                  alt={`Retrato de ${o.fullName}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-primary">{o.fullName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {o.birth} — {o.death}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent-foreground/80">
                  <MapPin className="h-3 w-3" /> {o.comuna}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ver memorial <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="font-serif text-2xl text-primary">Sin resultados</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba con otro nombre o comuna.
            </p>
          </div>
        )}
      </section>
    </>
  );
}