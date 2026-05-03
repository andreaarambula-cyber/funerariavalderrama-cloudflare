import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, ShieldCheck, Clock, MapPin, PhoneCall, Box, Flame, Truck, FileText, Coffee, Quote, Star } from "lucide-react";
import heroImg from "@/assets/hero-sunrise.jpg";
import candleImg from "@/assets/candle.jpg";
import flowersImg from "@/assets/flowers.jpg";
import { obituaries } from "@/data/obituaries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Funeraria Valderrama — Servicios funerarios y cremación 24/7 en Chile" },
      {
        name: "description",
        content:
          "Acompañamos a tu familia con dignidad. Servicio funerario, cremación, planes a futuro y obituarios online. Atención 24/7 en todo Chile.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <HowWeHelp />
      <FeaturedObituaries />
      <Testimonials />
      <PlanFuturoCTA />
      <BlogTeaser />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt=""
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/35 to-primary/70" />
      <div className="container-prose relative py-24 text-primary-foreground md:py-36 lg:py-44">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/90 backdrop-blur">
          <Clock className="h-3.5 w-3.5 text-accent" />
          Atención 24 horas, todos los días
        </p>
        <h1 className="max-w-3xl text-balance font-serif text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
          Acompañamos a tu familia en el momento más difícil
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
          Servicios funerarios y de cremación con dignidad, transparencia y cercanía.
          Más de 30 años cuidando a las familias chilenas.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:+56953900931"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-elevated transition hover:brightness-105"
          >
            <Phone className="h-4 w-4" /> Necesito ayuda ahora
          </a>
          <Link
            to="/planes"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          >
            Ver planes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Star, text: "+30 años de experiencia" },
    { icon: ShieldCheck, text: "Registrados en SEREMI" },
    { icon: Clock, text: "Atención 24/7" },
    { icon: MapPin, text: "Cobertura nacional" },
  ];
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-prose grid grid-cols-2 gap-y-5 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-foreground/80">
            <Icon className="h-4 w-4 shrink-0 text-accent" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: PhoneCall, title: "Atención 24/7", desc: "Coordinamos el retiro y todo el proceso a cualquier hora." },
    { icon: Box, title: "Elección de urna", desc: "Variedad de urnas y ataúdes para honrar a tu ser querido." },
    { icon: Flame, title: "Equipo de velatorio", desc: "Cirios, luces y elementos para un ambiente solemne." },
    { icon: Truck, title: "Traslados y carroza", desc: "Retiro desde clínica u hospital y carroza panorámica." },
    { icon: FileText, title: "Trámites y cuota mortuoria", desc: "Inscripción en Registro Civil y gestión legal completa." },
    { icon: Coffee, title: "Servicios incluidos", desc: "Cafetería y arreglo floral para acompañar a la familia." },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Nuestros servicios" title="Cuidamos cada detalle con dignidad" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span
                aria-hidden
                className="absolute right-5 top-5 h-16 w-16 rounded-full bg-accent/10 transition group-hover:scale-110"
              />
              <Icon className="relative h-8 w-8 text-accent" strokeWidth={1.5} />
              <h3 className="relative mt-5 font-serif text-2xl text-primary">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <Link
                to="/servicios"
                className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                Conocer más <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowWeHelp() {
  const steps = [
    {
      n: "01",
      title: "Llamada",
      desc: "Te atendemos al instante, las 24 horas. Te guiamos en los primeros pasos con calma.",
    },
    {
      n: "02",
      title: "Asesoría",
      desc: "Diseñamos contigo el servicio adecuado, transparente en precios y opciones.",
    },
    {
      n: "03",
      title: "Acompañamiento",
      desc: "Nos hacemos cargo de los trámites para que tu familia pueda despedirse en paz.",
    },
  ];
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Cómo te ayudamos" title="Un proceso simple, humano y transparente" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative pl-16">
              <span className="absolute left-0 top-0 font-serif text-5xl text-accent/70">
                {s.n}
              </span>
              <div className="absolute left-12 top-3 hidden h-px w-32 bg-border md:block" />
              <h3 className="font-serif text-2xl text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedObituaries() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Obituarios recientes"
            title="Honramos su memoria"
            align="left"
          />
          <Link
            to="/obituarios"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {obituaries.slice(0, 6).map((o) => (
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
                <p className="mt-1 text-xs uppercase tracking-wider text-accent-foreground/80">
                  {o.comuna}
                </p>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground/75">
                  {o.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Dejar condolencias <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "En el peor momento de nuestras vidas, sentimos que no estábamos solos. Cada detalle fue cuidado con cariño.",
      author: "Familia Pérez",
      city: "Santiago",
    },
    {
      quote:
        "Profesionalismo y humanidad. Nos guiaron paso a paso, con total transparencia en costos y tiempos.",
      author: "Camila Rojas",
      city: "Valparaíso",
    },
    {
      quote:
        "El obituario online permitió que familiares en el extranjero se despidieran. Un detalle que nunca olvidaremos.",
      author: "Andrés Muñoz",
      city: "Concepción",
    },
  ];
  return (
    <section
      className="relative isolate overflow-hidden bg-primary py-20 text-primary-foreground md:py-28"
      style={{
        backgroundImage: `linear-gradient(rgba(30,58,82,0.92), rgba(30,58,82,0.92)), url(${candleImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-prose">
        <SectionHeader
          eyebrow="Familias que nos confiaron"
          title="Palabras que nos honran"
          tone="dark"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.author}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
            >
              <Quote className="h-6 w-6 text-accent" />
              <blockquote className="mt-4 font-serif text-lg leading-snug text-white">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 text-sm text-white/70">
                <span className="text-accent">— </span>
                {t.author}, {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanFuturoCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 aspect-[4/3] overflow-hidden lg:order-1 lg:aspect-auto">
              <img
                src={flowersImg}
                alt="Arreglo floral"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 p-8 md:p-14 lg:order-2">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
                Plan a futuro
              </p>
              <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
                Tranquilidad para los que más amas
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Planifica con calma, congela el precio de hoy y libera a tu familia de
                decisiones difíciles. Cuotas sin interés y cobertura inmediata.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "Precio congelado de por vida",
                  "Hasta 48 cuotas sin interés",
                  "Cobertura nacional inmediata",
                  "Modificable y transferible",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/planes"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
                >
                  Ver planes <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/cotizar"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition hover:bg-secondary"
                >
                  Cotizar online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogTeaser() {
  const posts = [
    {
      cat: "Duelo",
      title: "Cómo acompañar a un niño en el proceso de duelo",
      read: "5 min",
    },
    {
      cat: "Trámites",
      title: "Posesión efectiva: paso a paso después de un fallecimiento",
      read: "7 min",
    },
    {
      cat: "Tradiciones",
      title: "Rituales de despedida: tradiciones chilenas que perduran",
      read: "4 min",
    },
  ];
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Acompañamiento" title="Recursos para el camino" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border border-border bg-surface p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-foreground/80">
                {p.cat} · {p.read} de lectura
              </p>
              <h3 className="mt-4 font-serif text-xl leading-snug text-primary">
                {p.title}
              </h3>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Leer artículo <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`text-xs uppercase tracking-[0.22em] ${
          tone === "dark" ? "text-accent" : "text-accent-foreground/80"
        }`}
      >
        {eyebrow}
      </p>
      <div
        className={`gold-divider mt-3 ${align === "center" ? "mx-auto w-24" : "w-24"}`}
      />
      <h2
        className={`mt-4 font-serif text-3xl md:text-4xl lg:text-[2.75rem] ${
          tone === "dark" ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
