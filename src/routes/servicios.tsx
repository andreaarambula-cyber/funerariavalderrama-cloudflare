import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeftRight,
  Check,
  ChevronDown,
  Box,
  Pickaxe,
  Image as ImageIcon,
  Handshake,
  Building2,
  Banknote,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios funerarios y cremación — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Servicios funerarios completos en el Gran Concepción: funeral tradicional, cremación, velatorios, traslados y trámites. Precios transparentes y atención 24/7.",
      },
    ],
  }),
  component: ServiciosPage,
});

const packages = [
  {
    id: "esencial",
    name: "Esencial",
    icon: Box,
    desc: "Urnas de fibromadera-terciado, con o sin tallado, en terminación brillante u opaca.",
    includes: [
      "Urnas de fibromadera-terciado",
      "Con o sin tallado",
      "Terminación brillante u opaca",
    ],
    note: "Fotos sujetas a stock.",
  },
  {
    id: "selecto",
    name: "Selecto",
    icon: Box,
    desc: "Urnas de pino, con o sin tallado, en terminación brillante u opaca.",
    includes: [
      "Urnas de pino",
      "Con o sin tallado",
      "Terminación brillante u opaca",
    ],
    note: "Fotos sujetas a stock.",
  },
  {
    id: "memorable",
    name: "Memorable",
    icon: Box,
    desc: "Urnas de madera nativa —castaño, alerce, raulí, roble americano y pino oregón— con diseños exclusivos.",
    includes: [
      "Maderas nativas: castaño, alerce, raulí, roble americano, pino oregón",
      "Diseños exclusivos: americana, lincon, imperial, trébol y más",
      "Con o sin tallado, terminación brillante u opaca",
    ],
    note: "Fotos sujetas a stock.",
  },
];

const convenios = [
  {
    icon: Building2,
    title: "Parque Sendero",
    desc: "Descuentos especiales para nuestras familias.",
  },
  {
    icon: Building2,
    title: "Crematorio y Cementerio General de Concepción",
    desc: "Descuentos especiales para nuestras familias.",
  },
  {
    icon: Handshake,
    title: "Asesoría en cementerios y parques",
    desc: "Asesoría para la adquisición en todos los cementerios y parques de la región.",
  },
  {
    icon: Banknote,
    title: "Cobro de cuotas mortuorias",
    desc: "Tramitación en AFP's, Rentas Vitalicias, CAPREDENA, DIPRECA y Montepío.",
  },
];

const faqs = [
  {
    q: "¿Cuánto demora organizar un servicio funerario?",
    a: "Con un solo llamado coordinamos todo en menos de 2 horas. Nuestro equipo se hace cargo de los traslados, trámites y arreglos para que tu familia solo se preocupe de despedirse.",
  },
  {
    q: "¿Atienden las 24 horas?",
    a: "Sí. Estamos disponibles las 24 horas, todos los días del año. Llámanos al +56 9 5390 0931 o escríbenos por WhatsApp en cualquier momento.",
  },
  {
    q: "¿En qué comunas tienen cobertura?",
    a: "Atendemos principalmente Concepción, Chiguayante, San Pedro de la Paz, Hualpén y Talcahuano. Coordinamos también traslados a otras regiones según la necesidad de cada familia.",
  },
  {
    q: "¿Tramitan la cuota mortuoria?",
    a: "Sí. Nos encargamos de toda la tramitación legal e integral de la cuota mortuoria, además de la inscripción en el Registro Civil y los permisos sanitarios necesarios.",
  },
];

function ServiciosPage() {
  const [active, setActive] = useState(packages[0].id);
  const current = packages.find((s) => s.id === active)!;

  return (
    <>
      <PageHero
        eyebrow="Nuestros servicios"
        title="Cuidamos cada detalle, con dignidad"
        subtitle="Diseñamos servicios a la medida de cada familia, con total transparencia en precios y procesos. Atención profesional las 24 horas en el Gran Concepción."
      />

      <section className="container-prose py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Paquetes de servicios</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Elige el paquete que mejor acompañe a tu familia
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Trabajamos con paquetes de servicios que varían principalmente en la durabilidad y el tipo de urna.
          </p>
        </div>

        <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:flex-wrap md:overflow-visible">
          {packages.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm transition",
                active === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground/80 hover:border-primary/40",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 rounded-3xl border border-border bg-surface p-8 shadow-soft md:p-12 lg:grid-cols-[1.1fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15">
                <current.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-3xl text-primary md:text-4xl">{current.name}</h2>
            </div>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {current.desc}
            </p>
            <div className="mt-6 flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 text-center">
              <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon className="h-7 w-7 opacity-60" strokeWidth={1.5} />
                Fotos próximamente — sujeto a stock
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cotizar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                Solicitar este paquete <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+56953900931"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition hover:bg-secondary"
              >
                Llamar ahora
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
              Qué incluye
            </p>
            <ul className="mt-5 space-y-3.5">
              {current.includes.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-accent-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs italic text-muted-foreground">{current.note}</p>
          </div>
        </div>
      </section>

      <section className="container-prose py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Complementarios</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Otros servicios que ofrecemos
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
              <ArrowLeftRight className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </span>
            <div className="relative">
              <h3 className="font-serif text-lg text-primary">Traslados interregionales</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Coordinamos el traslado de restos a otras regiones del país con todas las gestiones legales y logísticas necesarias.
              </p>
            </div>
          </div>
          <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
              <Pickaxe className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </span>
            <div className="relative">
              <h3 className="font-serif text-lg text-primary">Exhumaciones</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Realizamos exhumaciones con el debido respeto y cumpliendo todos los requisitos legales y sanitarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container-prose">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Convenios</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              Beneficios y descuentos para nuestras familias
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {convenios.map((c) => (
              <div
                key={c.title}
                className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
                  <c.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </span>
                <div className="relative">
                  <h3 className="font-serif text-lg text-primary">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose py-16 md:py-20">
        <div className="grid gap-8 rounded-3xl border border-border bg-surface p-8 shadow-soft md:p-12 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Zona de cobertura</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              Acompañamos a las familias del Gran Concepción
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Nuestra funeraria se encuentra en <strong>O'Higgins 1601, esq. Galvarino, Concepción</strong>.
              Atendemos a familias de la comuna y del Gran Concepción, coordinando traslados y servicios en
              distintos cementerios y crematorios.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Si necesitas confirmar disponibilidad en tu comuna, contáctanos y te orientaremos de inmediato.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {[
              "Concepción",
              "Chiguayante",
              "San Pedro de la Paz",
              "Hualpén",
              "Talcahuano",
              "Otras regiones",
            ].map((c) => (
              <li
                key={c}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm"
              >
                <Check className="h-4 w-4 text-accent" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container-prose max-w-3xl">
          <h2 className="font-serif text-3xl text-primary md:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-muted-foreground transition", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden px-6 text-sm leading-relaxed text-muted-foreground transition-[max-height,padding] duration-300",
          open ? "max-h-60 pb-5" : "max-h-0",
        )}
      >
        {a}
      </div>
    </div>
  );
}
