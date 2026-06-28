import { Calendar, MapPin, Navigation, CalendarPlus, Flame, Church, Car, TreePine, Flower2, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { downloadIcs } from "@/lib/ics";
import type { FarewellEvent } from "@/data/obituaries";

const ICONS: Record<FarewellEvent["type"], LucideIcon> = {
  Velatorio: Flower2,
  Misa: Church,
  Cortejo: Car,
  Sepultación: TreePine,
  
};

export function FarewellAgenda({
  events,
  personName,
}: {
  events: FarewellEvent[];
  personName: string;
}) {
  function addToCalendar(ev: FarewellEvent) {
    downloadIcs(`${personName}-${ev.type}`.toLowerCase().replace(/\s+/g, "-"), {
      title: `${ev.type} — ${personName}`,
      description: `Despedida de ${personName}. Funeraria Valderrama.`,
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    {(() => {
                      const Icon = ICONS[ev.type];
                      return <Icon className="h-5 w-5" strokeWidth={1.5} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/80">
                      {ev.type}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-2 font-medium text-primary">
                      <Calendar className="h-4 w-4 text-accent" /> {ev.date}
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{ev.address}</span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md active:translate-y-0 active:scale-[0.96] active:bg-accent/15 active:border-accent active:text-accent active:shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Cómo llegar
                      </a>
                      <button
                        onClick={() => addToCalendar(ev)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md active:translate-y-0 active:scale-[0.96] active:bg-accent/15 active:border-accent active:text-accent active:shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" /> Mi calendario
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
    </section>
  );
}
