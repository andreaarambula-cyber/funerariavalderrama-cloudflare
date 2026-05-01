import { useState } from "react";
import { Calendar, MapPin, Navigation, CalendarPlus, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { downloadIcs } from "@/lib/ics";
import type { FarewellEvent } from "@/data/obituaries";

const ICONS: Record<FarewellEvent["type"], string> = {
  Velatorio: "🕯️",
  Misa: "⛪",
  Cortejo: "🚗",
  Sepultación: "🌳",
  Cremación: "🔥",
};

export function FarewellAgenda({
  events,
  personName,
}: {
  events: FarewellEvent[];
  personName: string;
}) {
  const [rsvpFor, setRsvpFor] = useState<FarewellEvent | null>(null);
  const [name, setName] = useState("");
  const [people, setPeople] = useState(1);

  function rsvp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !rsvpFor) return;
    toast.success("Asistencia confirmada", {
      description: `${name} y ${people - 1 > 0 ? people - 1 + " acompañante" + (people - 1 > 1 ? "s" : "") : "sin acompañantes"} — ${rsvpFor.type}`,
    });
    setRsvpFor(null);
    setName("");
    setPeople(1);
  }

  function addToCalendar(ev: FarewellEvent) {
    downloadIcs(`${personName}-${ev.type}`.toLowerCase().replace(/\s+/g, "-"), {
      title: `${ev.type} — ${personName}`,
      description: `Despedida de ${personName}. Funeraria Serena.`,
      location: ev.address,
      startIso: ev.isoStart,
      endIso: ev.isoEnd,
    });
    toast.success("Evento descargado", { description: "Ábrelo para agregarlo a tu calendario." });
  }

  const firstEvent = events[0];
  const mapsEmbed = firstEvent
    ? `https://www.google.com/maps?q=${encodeURIComponent(firstEvent.mapsQuery)}&output=embed`
    : "";

  return (
    <section className="border-t border-border py-16">
      <div className="container-prose">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Despedida</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Agenda y ubicación
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompáñanos en este momento de homenaje.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,1fr]">
          <ul className="space-y-4">
            {events.map((ev, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-2xl">
                    {ICONS[ev.type]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/80">
                      {ev.type}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-primary">
                      <Calendar className="h-4 w-4 text-accent" /> {ev.date}
                    </p>
                    <p className="mt-1 inline-flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {ev.address}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Cómo llegar
                      </a>
                      <button
                        onClick={() => addToCalendar(ev)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" /> Mi calendario
                      </button>
                      <button
                        onClick={() => setRsvpFor(ev)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:brightness-110"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Confirmar asistencia
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {mapsEmbed && (
            <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                title={`Mapa - ${firstEvent?.address ?? ""}`}
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 380 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>

      {rsvpFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar asistencia"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setRsvpFor(null)}
        >
          <form
            onSubmit={rsvp}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-elevated animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div>
                <UserCheck className="h-8 w-8 text-accent" strokeWidth={1.4} />
                <h3 className="mt-2 font-serif text-2xl text-primary">Confirmar asistencia</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {rsvpFor.type} — {rsvpFor.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRsvpFor(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block text-sm">
              <span className="font-medium">Tu nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                maxLength={50}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium">Cantidad de personas</span>
              <input
                type="number"
                min={1}
                max={10}
                value={people}
                onChange={(e) => setPeople(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Confirmar
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
