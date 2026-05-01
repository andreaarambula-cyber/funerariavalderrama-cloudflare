import { useState } from "react";
import { Flame, X } from "lucide-react";
import type { Candle } from "@/data/obituaries";

function CandleSVG({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 24 40" className="h-12 w-6" aria-hidden>
      {/* base */}
      <rect x="9" y="22" width="6" height="14" rx="1" fill="oklch(0.92 0.02 80)" />
      <rect x="8" y="22" width="8" height="2" rx="1" fill="oklch(0.82 0.04 80)" />
      {/* wick */}
      <rect x="11.6" y="14" width="0.8" height="6" fill="oklch(0.25 0.02 60)" />
      {/* flame */}
      <g
        className="animate-flicker"
        style={{ animationDelay: `${delay}ms` }}
        transform-origin="12 18"
      >
        <ellipse cx="12" cy="12" rx="3" ry="6" fill="oklch(0.85 0.18 75)" />
        <ellipse cx="12" cy="13" rx="2" ry="4.5" fill="oklch(0.92 0.16 90)" />
        <ellipse cx="12" cy="14" rx="1" ry="2.8" fill="oklch(0.98 0.08 95)" />
      </g>
    </svg>
  );
}

export function CandleWall({ initial, personName }: { initial: Candle[]; personName: string }) {
  const [candles, setCandles] = useState<Candle[]>(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState<number | null>(null);

  function light(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCandles((c) => [
      { name: name.trim(), message: message.trim() || undefined, timeAgo: "Hace un instante" },
      ...c,
    ]);
    setName("");
    setMessage("");
    setOpen(false);
  }

  return (
    <section className="border-t border-border bg-gradient-to-b from-background to-secondary/30 py-16">
      <div className="container-prose">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Muro de velas</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            {candles.length} velas encendidas
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada llama es un mensaje de cariño para {personName.split(" ")[0]}.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition hover:brightness-110"
          >
            <Flame className="h-4 w-4 text-accent" /> Encender una vela
          </button>
        </div>

        <div className="relative mt-12 rounded-3xl border border-border bg-primary/95 p-6 shadow-elevated md:p-10">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {candles.map((c, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group relative flex flex-col items-center focus:outline-none"
                aria-label={`Vela de ${c.name}${c.message ? `: ${c.message}` : ""}`}
              >
                <CandleSVG delay={(i * 137) % 1800} />
                {hover === i && (
                  <div className="pointer-events-none absolute -top-2 left-1/2 z-10 w-44 -translate-x-1/2 -translate-y-full rounded-lg border border-accent/30 bg-surface px-3 py-2 text-left shadow-elevated">
                    <p className="text-xs font-semibold text-primary">{c.name}</p>
                    {c.message && (
                      <p className="mt-0.5 text-xs italic leading-snug text-foreground/80">
                        "{c.message}"
                      </p>
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.timeAgo}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Encender una vela"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={light}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-elevated animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div>
                <Flame className="h-8 w-8 text-accent" strokeWidth={1.4} />
                <h3 className="mt-2 font-serif text-2xl text-primary">Enciende una vela</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu llama acompañará a la familia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
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
                maxLength={40}
                autoFocus
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium">
                Dedicatoria <span className="text-muted-foreground">(opcional)</span>
              </span>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={80}
                placeholder="Te recordaré siempre…"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="mt-1 block text-right text-[11px] text-muted-foreground">
                {message.length}/80
              </span>
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              <Flame className="h-4 w-4 text-accent" /> Encender
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
