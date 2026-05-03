import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  PhoneCall,
  Box,
  Flame,
  Truck,
  FileText,
  Coffee,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios funerarios y cremación — Funeraria Valderrama" },
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
    id: "atencion",
    name: "Atención 24/7",
    icon: PhoneCall,
    desc: "Disponibilidad permanente para coordinar el retiro y todo el proceso, sin importar la hora del día o la noche.",
    includes: [
      "Coordinación inmediata por teléfono o WhatsApp",
      "Retiro desde clínica, hospital o domicilio",
      "Equipo de respuesta las 24 horas",
      "Acompañamiento desde el primer minuto",
      "Sin recargo por horario nocturno o festivo",
    ],
  },
  {
    id: "urna",
    name: "Elección de urna",
    icon: Box,
    desc: "Variedad de urnas y ataúdes para que elijas la opción que mejor represente a tu ser querido.",
    includes: [
      "Catálogo amplio de urnas y ataúdes",
      "Modelos en distintas maderas y terminaciones",
      "Asesoría personalizada según presupuesto",
      "Entrega y preparación incluida",
      "Opciones para cremación y sepultación",
    ],
  },
  {
    id: "velatorio",
    name: "Equipo de velatorio",
    icon: Flame,
    desc: "Luces, cirios y todos los elementos necesarios para crear un ambiente solemne y respetuoso.",
    includes: [
      "Capilla ardiente con cirios",
      "Iluminación y ornamentación",
      "Atril, libro de condolencias y cruz",
      "Instalación en domicilio o sala de velación",
      "Atención permanente durante el velatorio",
    ],
  },
  {
    id: "traslados",
    name: "Traslados y carroza",
    icon: Truck,
    desc: "Retiro desde clínica, hospital o domicilio y traslado al lugar de velatorio y cementerio en carroza panorámica.",
    includes: [
      "Carroza fúnebre panorámica",
      "Retiro desde clínica, hospital o domicilio",
      "Traslado al velatorio y al cementerio",
      "Cobertura en Concepción y alrededores",
      "Traslados a otras regiones coordinados",
    ],
  },
  {
    id: "tramites",
    name: "Trámites y cuota mortuoria",
    icon: FileText,
    desc: "Inscripción en el Registro Civil y tramitación legal e integral de la cuota mortuoria.",
    includes: [
      "Inscripción en el Registro Civil",
      "Tramitación de la cuota mortuoria",
      "Coordinación con cementerio o crematorio",
      "Gestión de permisos sanitarios",
      "Asesoría en posesión efectiva",
    ],
  },
  {
    id: "incluidos",
    name: "Servicios incluidos",
    icon: Coffee,
    desc: "Detalles que cuidan a la familia durante el velatorio, sin costo adicional.",
    includes: [
      "Servicio de cafetería",
      "Arreglo floral principal",
      "Atención cordial al velatorio",
      "Coordinador familiar dedicado",
      "Acompañamiento durante todo el proceso",
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
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15">
                <current.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-3xl text-primary md:text-4xl">{current.name}</h2>
            </div>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {current.desc}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cotizar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                Solicitar este servicio <ArrowRight className="h-4 w-4" />
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
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-16 md:py-20">
        <div className="container-prose">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Servicios complementarios</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              Cuidamos cada detalle de la despedida
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Servicios adicionales que puedes sumar al pack principal según las necesidades de tu familia.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <Icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-xl text-primary">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
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
