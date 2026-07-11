import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import { SITE_URL } from "./__root";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/contacto` }],
    meta: [
      { title: "Contacto — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Atención 24 horas en el Gran Concepción. Llámanos al +56 9 5390 0931, escríbenos por WhatsApp o envíanos un mensaje. Estamos aquí para ti.",
      },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="border-b border-accent/30 bg-accent/15">
        <div className="container-prose flex flex-wrap items-center justify-center gap-3 py-3 text-center text-sm text-accent-foreground">
          <Clock className="h-4 w-4 text-accent-foreground" />
          <span className="font-medium">Emergencia 24/7:</span>
          <a href="tel:+56953900931" className="font-semibold underline">
            +56 9 5390 0931
          </a>
        </div>
      </section>

      <PageHero
        eyebrow="Contacto"
        title="Estamos aquí, en cualquier momento"
        subtitle="Atendemos las 24 horas del día, los 365 días del año. Elige el canal que prefieras. Desde el primer llamado, nuestro equipo coordina cada detalle con cercanía, transparencia y respeto, entregando a las familias la tranquilidad de sentirse acompañadas en cada paso."
      />

      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Teléfono 24/7", val: "+56 9 5390 0931", href: "tel:+56953900931" },
            { icon: MessageCircle, label: "WhatsApp", val: "+56 9 5390 0931", href: "https://wa.me/56953900931" },
            { icon: Mail, label: "Email", val: "funerariavalderramaspa@gmail.com", href: "mailto:funerariavalderramaspa@gmail.com" },
            { icon: MapPin, label: "Casa matriz", val: "O'Higgins 1601, esq. Galvarino, Concepción", href: "#" },
          ].map(({ icon: Icon, label, val, href }) => (
            <a
              key={label}
              href={href}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-25 transition-opacity duration-300 group-hover:opacity-45" />
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="relative min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 font-medium text-primary break-words">{val}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft md:p-10">
          {sent ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/20 text-accent-foreground">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-serif text-3xl text-primary">Mensaje recibido</h2>
              <p className="mt-2 text-muted-foreground">
                Te responderemos a la brevedad. Para urgencias, llámanos al +56 9 5390 0931.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <h2 className="font-serif text-2xl text-primary">Envíanos un mensaje</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" required />
                <Field label="Teléfono" type="tel" required />
              </div>
              <Field label="Email" type="email" required />
              <label className="block">
                <span className="text-sm font-medium">Mensaje</span>
                <textarea
                  required
                  rows={5}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  type = "text",
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}