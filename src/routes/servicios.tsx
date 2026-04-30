import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios funerarios y cremación — Funeraria Serena" },
      {
        name: "description",
        content:
          "Servicios funerarios completos en Chile: funeral tradicional, cremación, velatorios, traslados y trámites. Precios transparentes y atención 24/7.",
      },
    ],
  }),
  component: ServiciosPage,
});

const services = [
  {
    id: "funeral",
    name: "Funeral tradicional",
    price: 1290000,
    desc: "Servicio completo de despedida con velatorio, traslado y ceremonia.",
    includes: [
      "Ataúd a elección desde catálogo",
      "Capilla ardiente y sala de velatorio",
      "Traslado al cementerio",
      "Coordinador familiar dedicado",
      "Trámites y certificados",
    ],
  },
  {
    id: "cremacion",
    name: "Cremación",
    price: 890000,
    desc: "Servicio de cremación digna con urna a elección y entrega protocolar.",
    includes: [
      "Cremación en horno certificado",
      "Urna a elección desde catálogo",
      "Velatorio opcional previo",
      "Entrega de cenizas con protocolo",
      "Certificado de cremación",
    ],
  },
  {
    id: "velatorio",
    name: "Velatorio",
    price: 350000,
    desc: "Salas privadas con todas las comodidades para recibir a familiares y amigos.",
    includes: [
      "Sala privada hasta 80 personas",
      "Servicio de café y agua",
      "Música ambiente",
      "Atención permanente",
      "Hasta 24 horas de uso",
    ],
  },
  {
    id: "traslados",
    name: "Traslados",
    price: 280000,
    desc: "Traslados nacionales e internacionales con todos los permisos requeridos.",
    includes: [
      "Traslado puerta a puerta",
      "Vehículo especializado",
      "Permisos sanitarios incluidos",
      "Coordinación 24/7",
      "Cobertura nacional",
    ],
  },
  {
    id: "tramites",
    name: "Trámites",
    price: 0,
    desc: "Te acompañamos en cada gestión legal y administrativa, sin costo adicional.",
    includes: [
      "Inscripción Registro Civil",
      "Certificado de defunción",
      "Coordinación con cementerio",
      "Asesoría posesión efectiva",
      "Gestiones AFP y seguros",
    ],
  },
];

const faqs = [
  {
    q: "¿Cuánto demora organizar un servicio funerario?",
    a: "Con un solo llamado coordinamos todo en menos de 2 horas. Nuestro equipo se hace cargo de los traslados, trámites y arreglos para que tu familia solo se preocupe de despedirse.",
  },
  {
    q: "¿Atienden las 24 horas?",
    a: "Sí. Estamos disponibles las 24 horas, todos los días del año. Llámanos al 600 123 456 o escríbenos por WhatsApp en cualquier momento.",
  },
  {
    q: "¿Tienen cobertura en regiones?",
    a: "Tenemos cobertura nacional. Trabajamos con sucursales y aliados en Arica, Antofagasta, La Serena, Valparaíso, Concepción, Temuco y Punta Arenas, entre otras ciudades.",
  },
  {
    q: "¿Aceptan seguros funerarios?",
    a: "Sí, trabajamos con las principales aseguradoras del país. Verificamos tu cobertura y gestionamos el cobro directamente con la compañía.",
  },
];

function ServiciosPage() {
  const [active, setActive] = useState(services[0].id);
  const current = services.find((s) => s.id === active)!;

  return (
    <>
      <PageHero
        eyebrow="Nuestros servicios"
        title="Cuidamos cada detalle, con dignidad"
        subtitle="Diseñamos servicios a la medida de cada familia, con total transparencia en precios y procesos. Atención profesional las 24 horas en todo Chile."
      />

      <section className="container-prose py-16 md:py-20">
        <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:flex-wrap md:overflow-visible">
          {services.map((s) => (
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
            <h2 className="font-serif text-3xl text-primary md:text-4xl">{current.name}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {current.desc}
            </p>
            <div className="mt-8 rounded-2xl bg-secondary/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {current.price === 0 ? "Servicio incluido" : "Desde"}
              </p>
              <p className="mt-1 font-serif text-4xl text-primary">
                {current.price === 0 ? "Sin costo" : formatCLP(current.price)}
              </p>
              {current.price > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cuotas sin interés disponibles
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cotizar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                Cotizar este servicio <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+56600123456"
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
          </div>
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

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL") + " CLP";
}