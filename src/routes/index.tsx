import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, Phone, ShieldCheck, Clock, MapPin, PhoneCall, Box, Flame, Truck, FileText, Coffee, Quote, Star, Heart, BadgeCheck, Users, Handshake, Building2, Banknote, Check } from "lucide-react";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import heroImg from "@/assets/hero-sunrise.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import candleImg from "@/assets/candle.jpg";
import blogDuelo from "@/assets/blog-duelo.jpg";
import blogTramites from "@/assets/blog-tramites.jpg";
import blogTradiciones from "@/assets/blog-tradiciones.jpg";
import { obituaries } from "@/data/obituaries";
import { Obituaries3DCarousel } from "@/components/site/Obituaries3DCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Funeraria Valderrama — Servicios funerarios y cremación 24/7 en el Gran Concepción" },
      {
        name: "description",
        content:
          "Acompañamos a tu familia con dignidad. Servicio funerario, cremación, planes a futuro y obituarios online. Atención 24/7 en el Gran Concepción.",
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
      <Convenios />
      <HowWeHelp />
      <FeaturedObituaries />
      <Testimonials />
      <BlogTeaser />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      >
        <source src={heroVideo.url} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70" />
      <div className="container-prose relative w-full py-16 text-primary-foreground md:py-20">
        <h1 className="max-w-3xl text-balance font-serif text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
          Acompañamos a tu familia en el momento más difícil
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
          Servicios funerarios y de cremación con dignidad, transparencia y cercanía.
          Más de 28 años cuidando a las familias del Gran Concepción.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:+56953900931"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-elevated transition hover:brightness-105"
          >
            <Phone className="h-4 w-4" /> Necesito ayuda ahora
          </a>
          <Link
            to="/cotizar"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          >
            Cotizar online <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Star, text: "+28 años de experiencia" },
    { icon: ShieldCheck, text: "Registrados en SEREMI" },
    { icon: Clock, text: "Atención 24/7" },
    { icon: MapPin, text: "Cobertura en todo el Gran Concepción" },
    { icon: Users, text: "+10.000 familias acompañadas" },
    { icon: BadgeCheck, text: "Transparencia en precios" },
    { icon: FileText, text: "Trámites incluidos" },
    { icon: Heart, text: "Atención cercana y humana" },
  ];
  return (
    <section className="group border-b border-border bg-surface py-6">
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]">
          {[...items, ...items].map(({ icon: Icon, text }, idx) => (
            <div
              key={`${text}-${idx}`}
              className="flex shrink-0 items-center gap-3 text-sm text-foreground/80"
              aria-hidden={idx >= items.length ? true : undefined}
            >
              <Icon className="h-4 w-4 shrink-0 text-accent" />
              <span className="whitespace-nowrap">{text}</span>
            </div>
          ))}
        </div>
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Nuestros servicios" title="Cuidamos cada detalle con dignidad" />

        {/* Mobile: horizontal scroll */}
        <div className="mt-10 md:hidden">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="group relative w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
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
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => scrollBy(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface shadow-soft transition hover:bg-accent hover:text-accent-foreground"
              aria-label="Anterior"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface shadow-soft transition hover:bg-accent hover:text-accent-foreground"
              aria-label="Siguiente"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="mt-12 hidden gap-5 md:grid sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
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

function Convenios() {
  const items = [
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
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Convenios" title="Beneficios y descuentos para nuestras familias" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((c) => (
            <article
              key={c.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
                <c.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-serif text-lg text-primary">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
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
      icon: PhoneCall,
      title: "Llamada",
      desc: "Te atendemos al instante, las 24 horas. Te guiamos en los primeros pasos con calma.",
    },
    {
      n: "02",
      icon: Heart,
      title: "Asesoría",
      desc: "Diseñamos contigo el servicio adecuado, transparente en precios y opciones.",
    },
    {
      n: "03",
      icon: ShieldCheck,
      title: "Acompañamiento",
      desc: "Nos hacemos cargo de los trámites para que tu familia pueda despedirse en paz.",
    },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-secondary/40 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 55%), radial-gradient(circle at 90% 100%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="container-prose">
        <SectionHeader eyebrow="Cómo te ayudamos" title="Un proceso simple, humano y transparente" />
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-8 right-8 top-12 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block"
          />
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map(({ n, icon: Icon, title, desc }) => (
              <article
                key={n}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/85 p-7 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-elevated"
              >
                <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent/25 to-accent/5 ring-1 ring-accent/20">
                  <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
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
      </div>
      <div className="mt-6">
        <Obituaries3DCarousel obituaries={obituaries.slice(0, 8)} />
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
      city: "Concepción",
    },
    {
      quote:
        "Profesionalismo y humanidad. Nos guiaron paso a paso, con total transparencia en costos y tiempos.",
      author: "Camila Rojas",
      city: "San Pedro de la Paz",
    },
    {
      quote:
        "El obituario online permitió que familiares en el extranjero se despidieran. Un detalle que nunca olvidaremos.",
      author: "Andrés Muñoz",
      city: "Talcahuano",
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

function BlogTeaser() {
  const posts = [
    {
      cat: "Duelo",
      title: "Cómo acompañar a un niño en el proceso de duelo",
      read: "5 min",
      author: "María González",
      date: "12 Mar 2025",
      image: blogDuelo,
    },
    {
      cat: "Trámites",
      title: "Posesión efectiva: paso a paso después de un fallecimiento",
      read: "7 min",
      author: "Equipo Valderrama",
      date: "28 Feb 2025",
      image: blogTramites,
    },
    {
      cat: "Tradiciones",
      title: "Rituales de despedida: tradiciones chilenas que perduran",
      read: "4 min",
      author: "Andrés Rivas",
      date: "5 Feb 2025",
      image: blogTradiciones,
    },
  ];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Acompañamiento" title="Recursos para el camino" />
        {/* Desktop grid */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-elevated"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={704}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-accent-foreground">
                  {p.cat}
                </span>
                <span className="text-xs text-muted-foreground">{p.read} de lectura</span>
              </div>
              <h3 className="mt-3 font-serif text-lg leading-snug text-primary transition-colors group-hover:text-accent-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">{p.date}</p>
              <div className="mt-auto border-t border-border pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  Leer artículo
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="mt-10 md:hidden">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((p) => (
              <article
                key={p.title}
                className="group flex w-[85%] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-accent-foreground">
                      {p.cat}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.read} de lectura</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg leading-snug text-primary">{p.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{p.date}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-primary">
                      Leer artículo <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary backdrop-blur-sm transition active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollBy(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary backdrop-blur-sm transition active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
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
