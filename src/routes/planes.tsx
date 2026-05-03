import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planes")({
  head: () => ({
    meta: [
      { title: "Planes y precios — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Compara nuestros planes funerarios: Esencial, Tradicional y Premium. Cuotas sin interés y cobertura nacional. Plan a futuro disponible.",
      },
    ],
  }),
  component: PlanesPage,
});

const plans = [
  {
    name: "Esencial",
    price: 890000,
    blurb: "Lo necesario, con dignidad.",
    featured: false,
    features: {
      "Servicio funerario o cremación": true,
      "Ataúd / urna estándar": true,
      "Velatorio (8 horas)": true,
      "Traslado urbano": true,
      "Trámites legales": true,
      "Capilla ardiente premium": false,
      "Obituario online": false,
      "Transmisión en vivo": false,
      "Coro / música en vivo": false,
    },
  },
  {
    name: "Tradicional",
    price: 1490000,
    blurb: "El más elegido por las familias.",
    featured: true,
    features: {
      "Servicio funerario o cremación": true,
      "Ataúd / urna premium": true,
      "Velatorio (24 horas)": true,
      "Traslado urbano e interurbano": true,
      "Trámites legales": true,
      "Capilla ardiente premium": true,
      "Obituario online": true,
      "Transmisión en vivo": false,
      "Coro / música en vivo": false,
    },
  },
  {
    name: "Premium",
    price: 2390000,
    blurb: "Una despedida memorable.",
    featured: false,
    features: {
      "Servicio funerario o cremación": true,
      "Ataúd / urna premium": true,
      "Velatorio (48 horas)": true,
      "Traslado urbano e interurbano": true,
      "Trámites legales": true,
      "Capilla ardiente premium": true,
      "Obituario online": true,
      "Transmisión en vivo": true,
      "Coro / música en vivo": true,
    },
  },
];

function PlanesPage() {
  return (
    <>
      <PageHero
        eyebrow="Planes y precios"
        title="Transparencia en cada detalle"
        subtitle="Tres planes pensados para distintas necesidades, todos con la calidad de servicio y el acompañamiento que tu familia merece."
      />

      <section className="container-prose py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-surface p-8 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated",
                p.featured
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-border",
              )}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
                  <Sparkles className="h-3 w-3" /> Más elegido
                </span>
              )}
              <h3 className="font-serif text-3xl text-primary">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-6 font-serif text-4xl text-primary">
                {formatCLP(p.price)}
              </p>
              <p className="text-xs text-muted-foreground">o desde {formatCLP(Math.round(p.price / 24))} / mes en 24 cuotas</p>
              <ul className="mt-7 flex-1 space-y-2.5 text-sm">
                {Object.entries(p.features).map(([feat, ok]) => (
                  <li
                    key={feat}
                    className={cn("flex items-start gap-2.5", !ok && "text-muted-foreground/70")}
                  >
                    {ok ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                    )}
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/cotizar"
                className={cn(
                  "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition",
                  p.featured
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border text-primary hover:bg-secondary",
                )}
              >
                Contratar {p.name} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <FinancingSimulator />
      <PlanFuturoSection />
    </>
  );
}

function FinancingSimulator() {
  const [amount, setAmount] = useState(1490000);
  const [months, setMonths] = useState(24);
  const monthly = Math.round(amount / months);

  return (
    <section className="bg-secondary/40 py-20">
      <div className="container-prose grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">
            Simulador de financiamiento
          </p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Calcula tu cuota mensual
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cuotas sin interés con tarjeta de crédito. Hasta 48 meses para que puedas
            elegir el plan que mejor se adapte a tu familia.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft md:p-10">
          <label className="block text-sm">
            <span className="font-medium">Monto del servicio</span>
            <span className="float-right font-serif text-lg text-primary">
              {formatCLP(amount)}
            </span>
            <input
              type="range"
              min={500000}
              max={3000000}
              step={50000}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
            />
          </label>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Número de cuotas</p>
            <div className="grid grid-cols-5 gap-2">
              {[3, 6, 12, 24, 48].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={cn(
                    "rounded-full border py-2 text-sm transition",
                    months === m
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
              Tu cuota mensual
            </p>
            <p className="mt-1 font-serif text-4xl">{formatCLP(monthly)}</p>
            <p className="mt-1 text-xs text-primary-foreground/70">
              {months} cuotas sin interés
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanFuturoSection() {
  return (
    <section className="container-prose py-20">
      <div className="rounded-3xl border border-border bg-primary p-10 text-primary-foreground md:p-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">
              Plan a futuro
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              Decide hoy con calma, en lugar de apuro mañana
            </h2>
          </div>
          <div>
            <p className="text-primary-foreground/80">
              Contratar tu plan a futuro significa congelar el precio de hoy, elegir cada
              detalle con tranquilidad y liberar a tu familia de decisiones difíciles en
              un momento de dolor.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {["Precio congelado de por vida","Cobertura inmediata desde la primera cuota","Modificable y transferible","Cobertura nacional"].map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {b}
                </li>
              ))}
            </ul>
            <Link
              to="/contacto"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-105"
            >
              Hablar con un asesor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}