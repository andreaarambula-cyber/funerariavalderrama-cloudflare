import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Funeraria Serena" },
      {
        name: "description",
        content:
          "Atención 24 horas en todo Chile. Llámanos al 600 123 456, escríbenos por WhatsApp o envíanos un mensaje. Estamos aquí para ti.",
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
          <a href="tel:+56600123456" className="font-semibold underline">
            600 123 456
          </a>
        </div>
      </section>

      <PageHero
        eyebrow="Contacto"
        title="Estamos aquí, en cualquier momento"
        subtitle="Atendemos las 24 horas del día, los 365 días del año. Elige el canal que prefieras."
      />

      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1fr,1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Teléfono 24/7", val: "600 123 456", href: "tel:+56600123456" },
            { icon: MessageCircle, label: "WhatsApp", val: "+56 9 1234 5678", href: "https://wa.me/56912345678" },
            { icon: Mail, label: "Email", val: "contacto@serena.cl", href: "mailto:contacto@serena.cl" },
            { icon: MapPin, label: "Casa matriz", val: "Av. Providencia 1234, Santiago", href: "#" },
          ].map(({ icon: Icon, label, val, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 font-medium text-primary">{val}</p>
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
                Te responderemos a la brevedad. Para urgencias, llámanos al 600 123 456.
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