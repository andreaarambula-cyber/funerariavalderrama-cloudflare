import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Phone, ShieldCheck, Clock, MapPin, PhoneCall, Box, Flame, Truck, FileText, Coffee, Star, Heart, BadgeCheck, Users, Handshake, Banknote, Check, X, Images, RotateCcw, Cross } from "lucide-react";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import { Visitanos } from "@/components/site/Visitanos";
import { CoverflowCarousel } from "@/components/site/CoverflowCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import donLuis1 from "@/assets/trabajos/don-luis-1.webp";
import donLuis2 from "@/assets/trabajos/don-luis-2.webp";
import donManuel1 from "@/assets/trabajos/don-manuel-1.webp";
import donManuel2 from "@/assets/trabajos/don-manuel-2.webp";
import cortejoMar1 from "@/assets/trabajos/cortejo-mar-1.webp";
import cortejoMar2 from "@/assets/trabajos/cortejo-mar-2.webp";
import donaMiguelina1 from "@/assets/trabajos/dona-miguelina-1.webp";
import donaMiguelina2 from "@/assets/trabajos/dona-miguelina-2.webp";
import donaCecilia1 from "@/assets/trabajos/dona-cecilia-1.webp";
import donaCecilia2 from "@/assets/trabajos/dona-cecilia-2.webp";
import donFlorentino1 from "@/assets/trabajos/don-florentino-1.webp";
import donFlorentino2 from "@/assets/trabajos/don-florentino-2.webp";
import donaTeresa1 from "@/assets/trabajos/dona-teresa-1.webp";
import donaTeresa2 from "@/assets/trabajos/dona-teresa-2.webp";
import donaRosa1 from "@/assets/trabajos/dona-rosa-1.webp";
import donaRosa2 from "@/assets/trabajos/dona-rosa-2.webp";
import heroVideo from "@/assets/hero-valderrama.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import candleImg from "@/assets/candle.webp";
import senderoLogo from "@/assets/convenios/sendero.png";
import cementerioLogo from "@/assets/convenios/cementerio-general.png";
import capredenaLogo from "@/assets/convenios/capredena.png";
import diprecaLogo from "@/assets/convenios/dipreca.png";
import chileatiendeLogo from "@/assets/convenios/chileatiende.png";
import { obituaries } from "@/data/obituaries";
import { Obituaries3DCarousel } from "@/components/site/Obituaries3DCarousel";
import { SITE_URL } from "./__root";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: heroPoster.url, fetchpriority: "high" },
      { rel: "canonical", href: `${SITE_URL}/` },
    ],
    meta: [
      { title: "Funeraria Valderrama — Servicios funerarios 24/7 en el Gran Concepción" },
      {
        name: "description",
        content:
          "Acompañamos a tu familia con dignidad. Servicio funerario, planes a futuro y obituarios online. Atención 24/7 en el Gran Concepción.",
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
      <OurWork />
      <FeaturedObituaries />
      <Testimonials />
      <Visitanos />
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
        preload="auto"
        poster={heroPoster.url}
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
          Servicios funerarios con dignidad, transparencia y cercanía.
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
    { icon: Users, text: "+2.000 familias acompañadas" },
    { icon: BadgeCheck, text: "Asesoría sin compromiso" },
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
    { icon: Box, title: "Elección de urna", desc: "Variedad de urnas y ataúdes para honrar a tu ser querido.", hash: "planes" },
    { icon: Flame, title: "Equipo de velatorio", desc: "Cirios, luces y elementos para un ambiente solemne.", hash: "equipo-velatorio" },
    { icon: Truck, title: "Traslados y carroza", desc: "Retiro desde clínica u hospital y carroza panorámica.", hash: "vehiculos" },
    { icon: FileText, title: "Trámites y cuota mortuoria", desc: "Inscripción en Registro Civil y gestión legal completa." },
    { icon: Coffee, title: "Servicios incluidos", desc: "Cafetería y arreglo floral para acompañar a la familia." },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Nuestros servicios" title="Cuidamos cada detalle con dignidad" />

        {/* Mobile: carrusel coverflow */}
        <div className="mt-10 md:hidden">
          <CoverflowCarousel
            ariaLabel="Nuestros servicios"
            cardW={262}
            cardH={244}
            items={services.map(({ icon: Icon, title, desc, hash }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft"
              >
                <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60" />
                <Icon className="relative h-8 w-8 text-accent" strokeWidth={1.5} />
                <h3 className="relative mt-5 font-serif text-2xl text-primary">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <Link
                  to="/servicios"
                  hash={hash}
                  className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Conocer más <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          />
        </div>

        {/* Desktop: grid */}
        <div className="mt-12 hidden gap-5 md:grid sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, hash }) => (
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
                hash={hash}
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
  const partners = [
    {
      logo: senderoLogo,
      name: "Parque Sendero",
      desc: "Descuentos en sus cementerios parque y crematorio para nuestras familias.",
    },
    {
      logo: cementerioLogo,
      name: "Cementerio General de Concepción",
      desc: "Descuentos en sepultación en el cementerio y crematorio.",
    },
  ];
  const gestiones = [
    {
      icon: Handshake,
      title: "Asesoría en cementerios y parques",
      desc: "Te orientamos en la adquisición de sepulturas en todos los cementerios y parques de la región.",
      logos: null as { src: string; alt: string }[] | null,
      chips: ["Cementerios municipales", "Parques privados", "Todo el Gran Concepción"] as
        | string[]
        | null,
    },
    {
      icon: Banknote,
      title: "Cobro de cuota mortuoria",
      desc: "Tramitamos el beneficio en AFP, Rentas Vitalicias, CAPREDENA, DIPRECA, IPS y Montepío.",
      logos: [
        { src: capredenaLogo, alt: "CAPREDENA" },
        { src: diprecaLogo, alt: "DIPRECA" },
        { src: chileatiendeLogo, alt: "IPS – ChileAtiende" },
      ],
      chips: null as string[] | null,
    },
  ];
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-prose">
        <SectionHeader eyebrow="Convenios" title="Beneficios y descuentos para nuestras familias" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Gracias a nuestros convenios con instituciones reconocidas, accedes a descuentos
          exclusivos y a gestiones que hacemos por ti.
        </p>

        {/* Convenios con descuento (con logo del socio) */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {partners.map((p) => (
            <article
              key={p.name}
              className="flex flex-col rounded-2xl border border-border bg-surface p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex h-12 items-center">
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-auto max-w-[78%] object-contain object-left"
                />
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                <BadgeCheck className="h-3.5 w-3.5" /> Convenio con descuento
              </span>
            </article>
          ))}
        </div>

        {/* Gestiones que hacemos por ti */}
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-2">
          {gestiones.map((g) => (
            <article
              key={g.title}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
                  <g.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-primary">{g.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
                </div>
              </div>
              {g.logos && (
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4">
                  {g.logos.map((l) => (
                    <img
                      key={l.alt}
                      src={l.src}
                      alt={l.alt}
                      loading="lazy"
                      className="h-5 w-auto object-contain"
                    />
                  ))}
                </div>
              )}
              {g.chips && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  {g.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
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
      desc: "Diseñamos contigo el servicio adecuado, con claridad en cada paso y opción.",
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

type Work = {
  images: string[];
  title: string;
  tag: string;
  description?: string;
};

const works: Work[] = [
  {
    images: [cortejoMar1, cortejoMar2],
    title: "Despedida frente al mar",
    tag: "Cortejo marítimo · Caleta de pescadores",
    description:
      "Acompañamos a una familia de la caleta en una despedida única: el último viaje por mar. En la lancha de los pescadores, entre flores y los suyos, su ser querido (Q.E.P.D.) cruzó la bahía rumbo a su descanso. Una despedida tan profunda como las aguas que tanto amó.",
  },
  {
    images: [donLuis2, donLuis1],
    title: "Don Luis Jaime Pezo Astudillo",
    tag: "Cortejo · Hualpén a Talcahuano",
    description:
      "Acompañamos a la familia en la despedida de Don Luis Jaime (Q.E.P.D.), desde la Sede Social de Peñuelas, en Hualpén, hasta el Cementerio Nº2 de Talcahuano. Un cortejo digno y sereno.",
  },
  {
    images: [donManuel1, donManuel2],
    title: "Don Manuel Heriberto Rodríguez Muñoz",
    tag: "Misa y cortejo · Santa Cruz",
    description:
      "Acompañamos a la familia y la comunidad en la despedida de Don Manuel Heriberto (Q.E.P.D.), desde la Parroquia de Santa Cruz hasta el Cementerio Parroquial. Un hombre muy amado, despedido con cariño y respeto.",
  },
  {
    images: [donaMiguelina1, donaMiguelina2],
    title: "Doña Miguelina del Carmen Ruiz Rojas",
    tag: "Cortejo · San Pedro de la Paz a Chiguayante",
    description:
      "Acompañamos a la familia en la despedida de Doña Miguelina del Carmen (Q.E.P.D.), desde la Parroquia El Buen Pastor de San Pedro de la Paz hasta el Cementerio Municipal de Chiguayante. Madre amada, esposa dedicada y mujer de espíritu fuerte; su vida será recordada como ejemplo de amor y fortaleza.",
  },
  {
    images: [donaCecilia1, donaCecilia2],
    title: "Doña Cecilia Ivonne Reyes Palavencino",
    tag: "Cortejo · Concepción a Parque San Pedro",
    description:
      "Acompañamos a la familia en la despedida de Doña Cecilia Ivonne (Q.E.P.D.), desde la Iglesia Cristiana en Juan de Dios Rivera, Concepción, hasta el Parque San Pedro. Madre dedicada, esposa leal y amiga entrañable; una mujer guerrera cuyo ejemplo permanecerá como una luz que inspira.",
  },
  {
    images: [donFlorentino1, donFlorentino2],
    title: "Don Florentino del Carmen Valenzuela Matamala",
    tag: "Cortejo · Parroquia San Miguel a Parque del Sendero",
    description:
      "Acompañamos a la familia en la despedida de Don Florentino del Carmen (Q.E.P.D.), desde la Parroquia San Miguel hasta el Parque del Sendero. Esposo, padre y abuelo profundamente amado; un hombre amoroso y organizado, cuyo ejemplo de dedicación y esfuerzo seguirá siendo motivo de orgullo para los suyos.",
  },
  {
    images: [donaTeresa1, donaTeresa2],
    title: "Doña Teresa de Jesús Vergara Turra",
    tag: "Cortejo · Capilla Jesús Resucitado a Talcahuano",
    description:
      "Acompañamos a la familia en la despedida de Doña Teresa de Jesús (Q.E.P.D.), desde la Capilla Jesús Resucitado hasta el Cementerio Nº2 de Talcahuano. Pilar de su familia, entregó cariño y cuidado dejando huella en cada hijo y nieto; un legado que permanecerá por siempre en sus corazones.",
  },
  {
    images: [donaRosa1, donaRosa2],
    title: "Doña Rosa Isabel Azzarolo Carvallo",
    tag: "Cortejo · Parroquia San Pablo a Parque Sendero",
    description:
      "Acompañamos a la familia en la despedida de Doña Rosa Isabel (Q.E.P.D.), desde la Parroquia San Pablo de Chiguayante hasta el Parque Sendero. Alma y refugio de su familia, un faro de ternura y sabiduría; su legado de amor perdurará en cada abrazo y en cada recuerdo que sigue vivo.",
  },
];

/** Tarjeta que se voltea (flip) para mostrar la 2ª foto + descripción, sin ocupar más espacio. */
function WorkCard({ work, index, size }: { work: Work; index: number; size: "lg" | "sm" }) {
  const [flipped, setFlipped] = useState(false);
  const hasBack = work.images.length > 1 || !!work.description;
  const back = work.images[1] ?? work.images[0];
  const toggle = () => hasBack && setFlipped((f) => !f);

  return (
    <div
      className={cn("group relative shrink-0 snap-center", size === "lg" ? "w-[42vw] max-w-[580px]" : "w-[78%] max-w-[330px]")}
      style={{ perspective: "1500px" }}
    >
      {/* Toda la tarjeta voltea al pulsar/tocar (funciona en desktop y móvil) */}
      <div
        onClick={toggle}
        role={hasBack ? "button" : undefined}
        tabIndex={hasBack ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasBack && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={hasBack ? `${work.title} — ${flipped ? "ver portada" : "ver más fotos y detalle"}` : undefined}
        className={cn(
          "relative w-full transition-transform duration-[750ms] ease-[cubic-bezier(.42,0,.58,1)] [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d]",
          size === "lg" ? "aspect-[16/11]" : "aspect-[3/4]",
          hasBack && "cursor-pointer",
        )}
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* FRENTE — se oculta (opacity 0) a mitad del giro; no dependemos de
            backface-visibility, que falla en iOS Safari. */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{ opacity: flipped ? 0 : 1, transition: "opacity 0s linear 375ms" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-elevated">
            <img
              src={work.images[0]}
              alt={work.title}
              loading="lazy"
              className="h-full w-full scale-105 object-cover transition-transform duration-700 md:group-hover:scale-110"
            />
            <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent ring-1 ring-accent/30">
              <Cross className="h-3 w-3" strokeWidth={2.25} />
              Q.E.P.D.
            </span>
            {hasBack && (
              <span className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white/90 ring-1 ring-white/15">
                <Images className="h-3.5 w-3.5" />
                {work.images.length > 1 ? `${work.images.length} fotos` : "Detalle"}
              </span>
            )}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent",
                size === "lg" ? "p-6 md:p-7" : "p-4",
              )}
            >
              <span
                className={cn(
                  "block font-semibold uppercase text-accent [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]",
                  size === "lg" ? "text-[11px] tracking-[0.2em]" : "text-[10px] tracking-[0.14em]",
                )}
              >
                {work.tag}
              </span>
              <h3
                className={cn(
                  "mt-1.5 font-serif leading-snug text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]",
                  size === "lg" ? "text-2xl md:text-3xl" : "text-base",
                )}
              >
                {work.title}
              </h3>
            </div>
          </div>
        </div>

        {/* REVERSO */}
        {hasBack && (
          <div
            className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ opacity: flipped ? 1 : 0, transition: "opacity 0s linear 375ms" }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 shadow-elevated">
              <img src={back} alt={`${work.title} — detalle`} loading="lazy" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/35" />
              <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white/90 ring-1 ring-white/15">
                <RotateCcw className="h-3.5 w-3.5" /> Volver
              </span>
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex flex-col justify-end",
                  size === "lg" ? "p-6 md:p-7" : "p-4",
                )}
              >
                <span
                  className={cn(
                    "block font-semibold uppercase text-accent [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]",
                    size === "lg" ? "text-[11px] tracking-[0.2em]" : "text-[10px] tracking-[0.14em]",
                  )}
                >
                  {work.tag}
                </span>
                <h3 className={cn("mt-1.5 font-serif leading-snug text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]", size === "lg" ? "text-2xl" : "text-base")}>{work.title}</h3>
                {work.description && (
                  <p className={cn("mt-2 leading-relaxed text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]", size === "lg" ? "text-[13px]" : "text-[12px]")}>{work.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OurWork() {
  const isMobile = useIsMobile();

  // ----- Carrusel horizontal con flechas (escritorio y móvil) -----
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length === 0) return;

    const elRect = el.getBoundingClientRect();
    // Tarjeta actualmente centrada (según posición real, robusto al swipe manual)
    const center = elRect.left + el.clientWidth / 2;
    let current = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < best) {
        best = d;
        current = i;
      }
    });

    let next = current + dir;
    if (next < 0) return; // atrás en la primera → se queda estático
    if (next >= cards.length) next = 0; // adelante en la última → vuelve al inicio

    // Desplazamos SOLO el scroll horizontal del carrusel (no la página): así,
    // si el usuario está mirando otra sección, el auto-avance no lo trae de vuelta.
    const t = cards[next].getBoundingClientRect();
    const cardCenterInContent = t.left - elRect.left + el.scrollLeft + t.width / 2;
    el.scrollTo({ left: cardCenterInContent - el.clientWidth / 2, behavior: "smooth" });
  };

  // Auto-avance: pasa una tarjeta cada 5 s; se pausa al interactuar (hover/touch).
  const pausedRef = useRef(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) scrollBy(1);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  return (
    <section id="trabajos" className="relative isolate bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 55%), radial-gradient(circle at 90% 100%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 50%)",
        }}
      />

      {/* Intro */}
      <div className="container-prose pt-20 md:pt-28">
        <SectionHeader eyebrow="Nuestro trabajo" title="Servicios que hemos realizado" tone="dark" align="left" />
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
          Una muestra del cuidado y la dignidad con que acompañamos a cada familia. Usa las flechas para recorrerlos.
        </p>
      </div>

      {/* Desktop: carrusel horizontal con flechas a los costados */}
      {!isMobile && (
        <div className="relative mt-12" onPointerEnter={pause} onPointerLeave={resume}>
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth px-6 pb-4 lg:gap-8 lg:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {works.map((w, i) => (
              <WorkCard key={w.title} work={w} index={i} size="lg" />
            ))}
          </div>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollBy(-1)}
            className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-primary/70 text-white shadow-elevated backdrop-blur transition hover:bg-accent hover:text-accent-foreground active:scale-95 lg:left-6"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollBy(1)}
            className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-primary/70 text-white shadow-elevated backdrop-blur transition hover:bg-accent hover:text-accent-foreground active:scale-95 lg:right-6"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Mobile: native horizontal scroll-snap */}
      {isMobile && (
        <div className="mt-10 pb-4" onPointerEnter={pause} onPointerLeave={resume} onTouchStart={pause}>
          <div
            ref={scrollerRef}
            className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {works.map((w, i) => (
              <WorkCard key={w.title} work={w} index={i} size="sm" />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollBy(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container-prose pb-20 pt-12 text-center md:pb-28">
        <Link
          to="/servicios"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
        >
          Ver todos nuestros servicios <ArrowRight className="h-4 w-4" />
        </Link>
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

/** Logo "G" de Google (multicolor) para indicar reseñas verificadas. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="flex gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("fill-accent", className)} strokeWidth={0} />
      ))}
    </span>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Glenny Castro",
      time: "Hace 3 años",
      text: "Fue la mejor decisión tener el servicio funerario de mi mamá con Funeraria Valderrama. Atentos, amables y entregados al 1000%. ¡Muchas gracias Patricio y a todo el equipo!",
    },
    {
      name: "Katherine Rodríguez",
      time: "Hace 1 año",
      text: "Excelente servicio, súper atentos, amorosos, amables, maravilloso equipo. ¡1000% recomendables!",
    },
    {
      name: "Jose Ortega",
      time: "Hace 3 años",
      text: "Muy buena decisión tomar los servicios de Funeraria Valderrama: muy respetuosos, empáticos y profesionales. Los recomiendo totalmente.",
    },
    {
      name: "Denisse Rojas",
      time: "Hace 2 años",
      text: "La mejor funeraria.",
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
          title="Lo que dicen nuestras familias"
          tone="dark"
        />
        {/* Resumen de calificación en Google */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">
            <GoogleG className="h-5 w-5" />
            <span className="text-xs text-white/65">Reseñas verificadas en Google</span>
          </div>
        </div>

        {/* Mobile: carrusel coverflow */}
        <div className="mt-12 md:hidden">
          <CoverflowCarousel
            ariaLabel="Reseñas de Google"
            tone="dark"
            cardW={272}
            cardH={296}
            edgeFade={false}
            fadeCards={false}
            items={reviews.map((r) => (
              <figure
                key={r.name}
                className="flex flex-col rounded-2xl border border-white/15 bg-[rgb(30,58,82)] p-6 shadow-elevated"
              >
                <Stars className="h-4 w-4" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/90">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-2.5 border-t border-white/10 pt-4">
                  <GoogleG className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 text-sm text-white/85">
                    {r.name}
                    <span className="block truncate text-xs text-white/40">{r.time} · Google</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          />
        </div>

        {/* Desktop: grilla (sin cambios) */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <Stars className="h-4 w-4" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/90">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-2.5 border-t border-white/10 pt-4">
                <GoogleG className="h-5 w-5 shrink-0" />
                <span className="min-w-0 text-sm text-white/85">
                  {r.name}
                  <span className="block truncate text-xs text-white/40">{r.time} · Google</span>
                </span>
              </figcaption>
            </figure>
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
        className={`mt-4 font-serif text-[2.2rem] leading-[1.1] md:text-[2.7rem] lg:text-[3.25rem] ${
          tone === "dark" ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}























