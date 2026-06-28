import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, Phone, ShieldCheck, Clock, Heart, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";
import { SITE_URL } from "./__root";

export const Route = createFileRoute("/cotizar")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/cotizar` }],
    meta: [
      { title: "Solicita tu propuesta personalizada — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Cuéntanos qué necesita tu familia y te enviaremos una propuesta hecha a medida. Respuesta en menos de 30 minutos, 24/7 en el Gran Concepción.",
      },
    ],
  }),
  component: CotizarPage,
});

const SERVICIOS = [
  "Sepultura tradicional",
  
  "Velatorio",
  "Traslado",
  "Plan a futuro",
  "Aún no estoy seguro",
];

const URGENCIA = [
  { id: "urgente", title: "Necesidad inmediata", desc: "Necesito ayuda ahora" },
  { id: "futuro", title: "Necesidad a futuro", desc: "Quiero planificar con tiempo" },
];

const CANALES = ["WhatsApp", "Llamada", "Email"];

const WHATSAPP_NUMBER = "56953900931";

function CotizarPage() {
  const [servicios, setServicios] = useState<string[]>([]);
  const [urgencia, setUrgencia] = useState("dias");
  const [comuna, setComuna] = useState("");
  const [detalle, setDetalle] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [canal, setCanal] = useState("WhatsApp");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function toggleServicio(s: string) {
    setServicios((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function buildMessage() {
    const lines = [
      "*Solicitud de propuesta — Funeraria Valderrama*",
      "",
      `*Nombre:* ${name}`,
      `*Teléfono:* ${phone}`,
      email && `*Email:* ${email}`,
      `*Canal preferido:* ${canal}`,
      "",
      `*Servicios de interés:* ${servicios.join(", ")}`,
      `*Urgencia:* ${URGENCIA.find((u) => u.id === urgencia)?.title}`,
      comuna && `*Comuna:* ${comuna}`,
      detalle && `\n*Detalles:* ${detalle}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (servicios.length === 0) errs.push("Selecciona al menos un tipo de servicio.");
    if (!name.trim()) errs.push("Ingresa tu nombre.");
    if (!phone.trim()) errs.push("Ingresa un teléfono de contacto.");
    if (!consent) errs.push("Debes aceptar ser contactado.");
    setErrors(errs);
    if (errs.length > 0) return;

    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    setDone(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) return <Confirmation name={name} canal={canal} />;

  return (
    <>
      <PageHero
        eyebrow="Propuesta personalizada"
        title="Cuéntanos qué necesitas"
        subtitle="Cada despedida es única. Diseñamos una propuesta a medida según las necesidades de tu familia. Respondemos en menos de 30 minutos, las 24 horas del día."
      />

      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1fr,360px]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-surface p-6 shadow-soft md:p-10">
          {/* Servicios */}
          <Block
            num="01"
            title="¿Qué servicio necesitas?"
            hint="Puedes elegir uno o varios."
          >
            <div className="flex flex-wrap gap-2">
              {SERVICIOS.map((s) => {
                const active = servicios.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleServicio(s)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground/80 hover:border-primary/40",
                    )}
                  >
                    {active && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </Block>

          {/* Urgencia */}
          <Block num="02" title="¿Cuándo lo necesitas?">
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCIA.map((u) => {
                const active = urgencia === u.id;
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => setUrgencia(u.id)}
                    className={cn(
                      "rounded-xl border bg-background p-4 text-left transition",
                      active
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <p className="font-serif text-base text-primary">{u.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{u.desc}</p>
                  </button>
                );
              })}
            </div>
          </Block>

          {/* Comuna */}
          <Block num="03" title="Comuna" hint="Atendemos todo el Gran Concepción.">
            <input
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              placeholder="Ej. Concepción, Talcahuano, San Pedro de la Paz…"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Block>

          {/* Detalle */}
          <Block num="04" title="Cuéntanos más" hint="Opcional, pero nos ayuda a preparar mejor tu propuesta.">
            <textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              rows={4}
              placeholder="Ej. Velatorio en casa, ceremonia íntima, preferencias religiosas, presupuesto aproximado, etc."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Block>

          {/* Datos */}
          <Block num="05" title="Tus datos de contacto">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre completo *" value={name} onChange={setName} />
              <Field label="Teléfono / WhatsApp *" value={phone} onChange={setPhone} type="tel" />
              <div className="sm:col-span-2">
                <Field label="Email (opcional)" value={email} onChange={setEmail} type="email" />
              </div>
            </div>

            <p className="mt-6 text-sm font-medium">Quiero recibir la propuesta por:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CANALES.map((c) => {
                const active = canal === c;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCanal(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground/80">
                Acepto ser contactado por Funeraria Valderrama para recibir mi propuesta personalizada.
              </span>
            </label>
          </Block>

          {errors.length > 0 && (
            <ul className="mt-6 space-y-1 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {errors.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> Prefiero hablar ahora
            </a>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elevated transition hover:brightness-110 active:scale-[0.98]"
            >
              Solicitar propuesta <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-primary/20 bg-primary p-7 text-primary-foreground shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
              Cómo trabajamos tu propuesta
            </p>
            <ol className="mt-5 space-y-5">
              {[
                { t: "Recibimos tu solicitud", d: "La revisa un asesor real, no un bot." },
                { t: "Diseñamos tu propuesta", d: "Adaptada a tus necesidades, presupuesto y deseos." },
                { t: "Te contactamos", d: "En menos de 30 minutos por el canal que elijas." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/20 font-serif text-sm text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-base text-white">{s.t}</p>
                    <p className="mt-0.5 text-sm text-primary-foreground/75">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="my-6 h-px bg-primary-foreground/15" />

            <ul className="space-y-2.5 text-sm text-primary-foreground/85">
              <Bullet icon={Clock}>Atención 24/7</Bullet>
              <Bullet icon={Heart}>Sin compromiso</Bullet>
              <Bullet icon={ShieldCheck}>Transparencia total</Bullet>
              <Bullet icon={Sparkles}>+28 años de experiencia</Bullet>
            </ul>

            <a
              href="tel:+56953900931"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-105"
            >
              <Phone className="h-4 w-4" /> Llámanos +56 9 5390 0931
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}

function Block({
  num,
  title,
  hint,
  children,
}: {
  num: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border py-7 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm text-accent-foreground/70">{num}</span>
        <h3 className="font-serif text-xl text-primary md:text-2xl">{title}</h3>
      </div>
      {hint && <p className="mt-1 pl-7 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-4 pl-0 sm:pl-7">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Bullet({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-accent" />
      <span>{children}</span>
    </li>
  );
}

function Confirmation({ name, canal }: { name: string; canal: string }) {
  return (
    <section className="container-prose py-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-surface p-10 text-center shadow-soft md:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-accent-foreground">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-primary md:text-4xl">
          Recibimos tu solicitud{name ? `, ${name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Un asesor está preparando tu propuesta personalizada y te contactará por <strong className="text-primary">{canal}</strong> en menos de 30 minutos.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-medium text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Conversar por WhatsApp
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary hover:border-primary/40"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
