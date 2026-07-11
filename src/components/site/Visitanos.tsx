import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";

// Sección de ubicación con mapa de Google (embed por dirección, sin API key).
// Se usa en el inicio y en la página Nosotros.
export function Visitanos() {
  const direccion = "O'Higgins 1601, esq. Galvarino, Concepción";
  const query = "O'Higgins 1601, Concepción, Chile";
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  return (
    <section className="py-20 md:py-28">
      <div className="container-prose">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto w-10" />
          <p className="mt-4 text-sm font-medium tracking-[0.02em] text-muted-foreground">Visítanos</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl lg:text-[2.75rem]">
            Dónde encontrarnos
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          {/* Datos de contacto */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface p-7 shadow-soft md:p-9">
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15">
                  <MapPin className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Dirección</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{direccion}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15">
                  <Clock className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Horario</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    Atención las 24 horas del día, los 365 días del año.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15">
                  <Phone className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Teléfono · WhatsApp</p>
                  <p className="mt-1 text-sm text-foreground">+56 9 5390 0931</p>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-soft transition hover:brightness-105"
              >
                <Navigation className="h-4 w-4" /> Cómo llegar
              </a>
              <a
                href="https://wa.me/56953900931"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition hover:bg-secondary"
              >
                <MessageCircle className="h-4 w-4 text-accent" /> Escríbenos por WhatsApp
              </a>
            </div>
          </div>

          {/* Mapa de Google */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <iframe
              title="Ubicación de Funeraria Valderrama — O'Higgins 1601, Concepción"
              src={embed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
