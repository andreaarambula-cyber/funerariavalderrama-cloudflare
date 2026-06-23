import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Pickaxe,
  Handshake,
  Building2,
  Banknote,
  Church,
  IdCard,
  Cross,
  BookHeart,
  Flower2,
  FileSignature,
  Car,
  Caravan,
  BusFront,
  GlassWater,
  Coffee,
  HandHeart,
  Frame,
  MicVocal,
  Speaker,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import { cn } from "@/lib/utils";

import esencial1 from "@/assets/urnas/esencial-1.jpg.asset.json";
import selecto1 from "@/assets/urnas/selecto-1.jpg.asset.json";
import memorable1 from "@/assets/urnas/memorable-1.jpg.asset.json";
import velatorioCirios1 from "@/assets/equipo/cirios.jpg";
import velatorioCirios2 from "@/assets/equipo/cirios-2.jpg";
import velatorioCirios3 from "@/assets/equipo/cirios-3.jpg";
import velatorioTulipa from "@/assets/equipo/tulipa.jpg";
import velatorioLed1 from "@/assets/equipo/led.jpg";
import velatorioLed2 from "@/assets/equipo/led-2.jpg";
import vehiculoCarroza from "@/assets/vehiculos/carroza.jpg";
import vehiculoFlota1 from "@/assets/vehiculos/flota-1.jpg";
import vehiculoFlota2 from "@/assets/vehiculos/flota-2.jpg";

// Íconos a medida del equipo de velatorio (dibujados según las fotos reales).
type EquipoIconProps = { className?: string; strokeWidth?: number };

// Cirio: vela encendida sobre candelabro torneado.
function IconCirio({ className, strokeWidth = 1.5 }: EquipoIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 2.2c1.7 1.6 1.9 3 1 4-.7.8-2 .5-2.2-.6-.1-.6.2-1.2.6-1.6" />
      <rect x="9.8" y="7.8" width="4.4" height="8.4" rx="1.1" />
      <path d="M10.4 16.2h3.2l.7 1.6h-4.6z" />
      <path d="M11 17.8h2v2.2c0 .9.7 1.6 1.6 1.6h-5.2c.9 0 1.6-.7 1.6-1.6z" />
    </svg>
  );
}

// Tulipa: ampolleta tipo llama (frosted) sobre pedestal — estilo antorcha.
function IconTulipa({ className, strokeWidth = 1.5 }: EquipoIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 2c2.4 2.3 3 4.3 1.7 6.1C12.7 9.4 11 9.3 10.4 7.9c-.5-1.1 0-2.4 1-3.4" />
      <path d="M10.4 8.2c.6 1 2.6 1 3.2 0" />
      <path d="M12 9.4v7.4" />
      <path d="M10.2 16.8h3.6l.6 1.6h-4.8z" />
      <path d="M9.4 21.8h5.2" />
    </svg>
  );
}

// Modernas: columna de madera con tira LED vertical.
function IconLed({ className, strokeWidth = 1.5 }: EquipoIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="8.5" y="3" width="7" height="15.5" rx="1.2" />
      <path d="M12 6.2v9" strokeWidth={strokeWidth + 0.6} />
      <path d="M8 18.5h8l.8 2.8H7.2z" />
    </svg>
  );
}

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios funerarios y cremación — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Servicios funerarios completos en el Gran Concepción: funeral tradicional, cremación, velatorios, traslados y trámites. Atención cercana y profesional, 24/7.",
      },
    ],
  }),
  component: ServiciosPage,
});

/* ------------------------------------------------------------------ */
/* PLANES — cada servicio incluido es un medallón con ícono.           */
/* hot = lo que ESTE plan suma respecto al anterior (se resalta dorado)*/
/* ------------------------------------------------------------------ */
type Item = { icon: LucideIcon; label: string; hot?: boolean };
type Plan = {
  id: string;
  name: string;
  tagline: string;
  wood: string;
  image: string;
  items: Item[];
};

const PLANS: Plan[] = [
  {
    id: "esencial",
    name: "Esencial",
    tagline: "Una despedida sobria y digna.",
    wood: "Fibromadera · terciado",
    image: esencial1.url,
    items: [
      { icon: Church, label: "Capilla de madera" },
      { icon: IdCard, label: "Tarjetero" },
      { icon: Cross, label: "Cruz" },
      { icon: BookHeart, label: "Libro o arreglo floral" },
      { icon: FileSignature, label: "Trámites legales" },
      { icon: Car, label: "Carroza" },
      { icon: BusFront, label: "Van" },
      { icon: GlassWater, label: "Dispensador de agua" },
    ],
  },
  {
    id: "selecto",
    name: "Selecto",
    tagline: "Mayor presencia y calidez en la madera.",
    wood: "Madera de pino",
    image: selecto1.url,
    items: [
      { icon: Church, label: "Capilla a elección" },
      { icon: IdCard, label: "Tarjetero" },
      { icon: Cross, label: "Cruz" },
      { icon: BookHeart, label: "Libro de Condolencias" },
      { icon: Flower2, label: "Arreglo floral" },
      { icon: FileSignature, label: "Trámites legales" },
      { icon: Car, label: "Carroza" },
      { icon: BusFront, label: "Van" },
      { icon: GlassWater, label: "Dispensador de agua" },
      { icon: Coffee, label: "Cafetería", hot: true },
      { icon: HandHeart, label: "Tarjetas de agradecimiento", hot: true },
      { icon: Frame, label: "Fotografía A4", hot: true },
    ],
  },
  {
    id: "memorable",
    name: "Memorable",
    tagline: "Lo más completo, con detalles exclusivos.",
    wood: "Madera nativa · diseños exclusivos",
    image: memorable1.url,
    items: [
      { icon: Church, label: "Capilla a elección" },
      { icon: IdCard, label: "Tarjetero" },
      { icon: Cross, label: "Cruz" },
      { icon: BookHeart, label: "Libro de Condolencias" },
      { icon: Flower2, label: "5 arreglos florales", hot: true },
      { icon: FileSignature, label: "Trámites legales" },
      { icon: Car, label: "2 carrozas", hot: true },
      { icon: BusFront, label: "Van" },
      { icon: GlassWater, label: "Dispensador de agua" },
      { icon: Coffee, label: "Cafetería" },
      { icon: HandHeart, label: "Tarjetas de agradecimiento" },
      { icon: Frame, label: "Fotografía A4" },
      { icon: MicVocal, label: "Lírico", hot: true },
      { icon: Speaker, label: "Parlante", hot: true },
    ],
  },
];

/* count-up para el contador de servicios */
function useCountUp(target: number) {
  const [n, setN] = useState(target);
  useEffect(() => {
    let raf = 0;
    const dur = 650;
    let startT = 0;
    const tick = (t: number) => {
      if (!startT) startT = t;
      const p = Math.min(1, (t - startT) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return n;
}

const velatorio = [
  {
    name: "Cirios",
    tag: "Velas",
    icon: IconCirio,
    images: [velatorioCirios1, velatorioCirios2, velatorioCirios3],
    desc: "Cirios tradicionales con vela encendida sobre base de madera torneada. Aportan un ambiente sobrio y solemne a la despedida.",
  },
  {
    name: "Tradiciones",
    tag: "Tulipas",
    icon: IconTulipa,
    images: [velatorioTulipa],
    desc: "Tulipas de luz cálida tipo llama sobre pedestal de madera. El encanto de lo tradicional, de forma segura y elegante, sin fuego.",
  },
  {
    name: "Modernas",
    tag: "Luces LED",
    icon: IconLed,
    images: [velatorioLed1, velatorioLed2],
    desc: "Columnas con iluminación LED cálida integrada. Un acompañamiento luminoso, moderno y de líneas limpias.",
  },
];

// Vehículos: un solo contenedor que engloba la flota; las fotos pasan solas.
const vehiculoImagenes = [vehiculoFlota1, vehiculoCarroza, vehiculoFlota2];

const vehiculoTipos = [
  { icon: Car, name: "Carroza", desc: "Carroza Volvo para el traslado del ser querido." },
  { icon: Caravan, name: "Vans", desc: "Vans para el traslado de la familia y acompañantes." },
  { icon: BusFront, name: "Bus", desc: "Disponible ocasionalmente, según el servicio." },
];

// Cross-fade automático de fotos (sin flechas ni controles).
function CrossfadeMedia({
  images,
  alt,
  delay = 0,
  intervalMs = 4000,
  imgClassName = "",
}: {
  images: string[];
  alt: string;
  delay?: number;
  intervalMs?: number;
  imgClassName?: string;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setIdx((i) => (i + 1) % images.length);
      interval = setInterval(() => setIdx((i) => (i + 1) % images.length), intervalMs);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [images.length, delay, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out md:group-hover:scale-105",
            imgClassName,
          )}
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
    </>
  );
}

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
  const [active, setActive] = useState(PLANS[0].id);
  const current = PLANS.find((p) => p.id === active)!;
  const count = useCountUp(current.items.length);
  const hasHot = current.items.some((it) => it.hot);

  // Al llegar con un #ancla (desde el home), baja suave al apartado.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Nuestros servicios"
        title="Cuidamos cada detalle, con dignidad"
        subtitle="Diseñamos servicios a la medida de cada familia, con total transparencia y acompañamiento en cada proceso. Atención profesional las 24 horas en el Gran Concepción."
      />

      {/* ===== PLANES (urnas) ===== */}
      <section id="planes" className="container-prose scroll-mt-28 py-16 md:py-20">
        <style>{`
          @keyframes med-in { from { opacity:0; transform: translateY(20px) scale(.96); filter: blur(7px) } to { opacity:1; transform:none; filter: blur(0) } }
          @keyframes name-in { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform:none } }
          .med-in { animation: med-in .7s cubic-bezier(.22,1,.36,1) both; }
          .name-in { animation: name-in .6s cubic-bezier(.22,1,.36,1) both; }
        `}</style>

        <div className="mb-10 text-center md:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Planes de servicio</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Elige el plan que mejor acompañe a tu familia
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Cada plan reúne todo lo necesario para una despedida digna. Lo{" "}
            <span className="font-medium text-accent">dorado ✦</span> es lo que ese plan suma respecto al anterior.
          </p>
        </div>

        {/* outer shell (double-bezel) */}
        <div className="rounded-[2.6rem] bg-primary p-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
          {/* inner core */}
          <div className="relative isolate overflow-hidden rounded-[2.1rem] bg-primary px-5 py-9 text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.10)] sm:px-6 sm:py-10 md:px-10 md:py-12">
            {/* ambient gold mesh */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(60% 70% at 85% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%), radial-gradient(50% 60% at 0% 100%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 55%)",
              }}
            />

            {/* tier switcher */}
            <div className="flex justify-center">
              <div className="inline-flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur-sm">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[13px] transition-all duration-500 ease-[cubic-bezier(.32,.72,0,1)] sm:px-5 sm:text-sm",
                      active === p.id
                        ? "bg-accent text-accent-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
                        : "text-white/70 hover:text-white",
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* split */}
            <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
              {/* LEFT — urn photo hero */}
              <div key={current.id} className="name-in min-w-0">
                <div className="rounded-[1.7rem] bg-white/[0.06] p-1.5 ring-1 ring-white/10">
                  <div className="relative overflow-hidden rounded-[1.3rem]">
                    <img
                      src={current.image}
                      alt={`Urna del plan ${current.name}`}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex rounded-full bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
                      {current.wood}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h2 className="font-serif text-4xl leading-none text-white sm:text-5xl">{current.name}</h2>
                      <p className="mt-2 max-w-xs text-sm text-white/75">{current.tagline}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-accent">{count}</span>
                    <span className="text-xs leading-tight text-white/60">
                      servicios
                      <br />
                      incluidos
                    </span>
                  </div>
                  <Link
                    to="/cotizar"
                    className="group inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-5 pr-2 text-sm font-medium text-accent-foreground transition-all duration-500 ease-[cubic-bezier(.32,.72,0,1)] active:scale-[0.98]"
                  >
                    Solicitar
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15 transition-transform duration-500 ease-[cubic-bezier(.32,.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </Link>
                </div>
              </div>

              {/* RIGHT — medallion grid */}
              <div className="min-w-0">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">El servicio incluye</p>
                  {hasHot && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-white/60">
                      <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_color-mix(in_oklab,var(--accent)_85%,transparent)]" />
                      Lo que suma este plan
                    </span>
                  )}
                </div>
                {/* key fuerza re-mount → la animación se reinicia al cambiar de plan */}
                <ul key={current.id} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {current.items.map((it, i) => {
                    const Icon = it.icon;
                    return (
                      <li
                        key={it.label}
                        className={cn(
                          "med-in group/m relative flex flex-col items-center justify-start gap-2.5 rounded-[1.25rem] p-3 text-center ring-1 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 sm:p-4",
                          it.hot
                            ? "bg-accent/[0.12] ring-accent/40 shadow-[0_18px_40px_-22px_color-mix(in_oklab,var(--accent)_75%,transparent)]"
                            : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.07]",
                        )}
                        style={{ animationDelay: `${i * 42}ms` }}
                      >
                        {it.hot && (
                          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_80%,transparent)]" />
                        )}
                        <span
                          className={cn(
                            "grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/m:scale-105 sm:h-12 sm:w-12",
                            it.hot ? "bg-accent/20 text-accent" : "bg-white/[0.06] text-white/80",
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.1} />
                        </span>
                        <span className={cn("text-[11px] leading-tight", it.hot ? "text-white" : "text-white/65")}>
                          {it.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA secundaria + nota */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a
            href="tel:+56953900931"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition hover:bg-secondary"
          >
            Llamar ahora · +56 9 5390 0931
          </a>
          <p className="text-xs italic text-muted-foreground">Fotos de urnas sujetas a stock.</p>
        </div>
      </section>

      {/* ===== EQUIPO DE VELATORIO ===== */}
      <section id="equipo-velatorio" className="scroll-mt-28 bg-secondary/40 py-16 md:py-20">
        <div className="container-prose">
          <div className="mb-10 text-center md:mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Equipo de velatorio</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              Iluminación para una despedida solemne
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Disponemos de distintos tipos de iluminación para acompañar el velatorio, según el ambiente
              que la familia prefiera.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {velatorio.map((v, ci) => {
              const Icon = v.icon;
              return (
                <article
                  key={v.name}
                  className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-soft ring-1 ring-transparent transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated hover:ring-accent/30"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <CrossfadeMedia
                      images={v.images}
                      alt={`Equipo de velatorio — ${v.name}`}
                      delay={ci * 1300}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    {/* chip de ícono */}
                    <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-accent ring-1 ring-accent/30 backdrop-blur-[2px]">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-accent [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                        {v.tag}
                      </span>
                      <h3 className="mt-1 font-serif text-2xl text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                        {v.name}
                      </h3>
                    </div>
                  </div>
                  <div className="relative p-5">
                    <span className="mb-3 block h-px w-10 bg-accent/40" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== VEHÍCULOS / FLOTA ===== */}
      <section id="vehiculos" className="container-prose scroll-mt-28 py-16 md:py-20">
        <div className="mb-10 text-center md:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Traslados</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">Nuestra flota</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Contamos con flota propia para acompañar el último adiós con puntualidad y respeto:
            carroza para el ser querido y vans para la familia.
          </p>
        </div>

        {/* contenedor único que engloba la flota — layout dividido (sin zoom) */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-elevated lg:grid lg:grid-cols-[0.82fr_1.18fr]">
          {/* FOTO-FLOTA con cross-fade automático (tamaño contenido = nítida) */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[440px]">
            <CrossfadeMedia
              images={vehiculoImagenes}
              alt="Flota de vehículos — Funeraria Valderrama"
              intervalMs={4500}
              imgClassName="[object-position:50%_58%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 lg:hidden">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-accent [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                Flota propia
              </span>
              <h3 className="mt-1 font-serif text-3xl text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                Carroza y vans para el cortejo
              </h3>
            </div>
          </div>

          {/* TIPOS de vehículo */}
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <div className="mb-6 hidden lg:block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                Flota propia
              </span>
              <h3 className="mt-1 font-serif text-3xl text-primary">Carroza y vans para el cortejo</h3>
            </div>
            <ul className="divide-y divide-border">
              {vehiculoTipos.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.name} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="font-serif text-lg text-primary">{t.name}</h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs italic text-muted-foreground">
          El bus se gestiona según disponibilidad y no incluye servicios adicionales.
        </p>
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


