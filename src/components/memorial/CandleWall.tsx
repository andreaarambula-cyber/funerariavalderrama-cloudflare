import { useMemo, useState } from "react";
import { Flame, X } from "lucide-react";
import { toast } from "sonner";
import type { Candle } from "@/data/obituaries";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, { w: number; h: number; halo: number }> = {
  sm: { w: 26, h: 56, halo: 70 },
  md: { w: 34, h: 74, halo: 95 },
  lg: { w: 42, h: 92, halo: 120 },
};

function CandleSVG({ size = "md", delay = 0, duration = 2400, flash = false }: {
  size?: Size;
  delay?: number;
  duration?: number;
  flash?: boolean;
}) {
  const { w, h } = SIZE_MAP[size];
  return (
    <svg viewBox="0 0 24 60" width={w} height={h} aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id={`wax-${size}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.04 80)" />
          <stop offset="50%" stopColor="oklch(0.94 0.03 85)" />
          <stop offset="100%" stopColor="oklch(0.62 0.05 70)" />
        </linearGradient>
      </defs>
      {/* base shadow */}
      <ellipse cx="12" cy="58" rx="10" ry="1.6" fill="oklch(0 0 0 / 0.55)" />
      {/* candle body */}
      <rect x="6.5" y="22" width="11" height="34" rx="1.2" fill={`url(#wax-${size})`} />
      <rect x="6.5" y="22" width="11" height="2.5" rx="1" fill="oklch(0.55 0.05 70)" opacity="0.6" />
      {/* wick */}
      <rect x="11.5" y="14" width="1" height="8" fill="oklch(0.18 0.02 60)" />
      {/* flame group */}
      <g
        className={`animate-candle-sway ${flash ? "animate-candle-flash" : ""}`}
        style={{ animationDelay: `${delay}ms`, animationDuration: `${duration * 1.5}ms` }}
      >
        <g
          className="animate-flicker"
          style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms`, transformOrigin: "12px 16px" }}
        >
          {/* outer glow */}
          <ellipse cx="12" cy="10" rx="4.2" ry="9" fill="oklch(0.78 0.18 70 / 0.45)" />
          {/* manto */}
          <path d="M12 2 C 8 7, 7 12, 8.5 16 C 9.5 18.5, 14.5 18.5, 15.5 16 C 17 12, 16 7, 12 2 Z"
                fill="oklch(0.86 0.18 78)" />
          {/* core */}
          <path d="M12 6 C 10 9, 9.5 12, 10.5 15 C 11 16.5, 13 16.5, 13.5 15 C 14.5 12, 14 9, 12 6 Z"
                fill="oklch(0.96 0.12 92)" />
          {/* hot core */}
          <ellipse cx="12" cy="13" rx="1.1" ry="2.4" fill="oklch(0.99 0.04 100)" />
          {/* blue base */}
          <ellipse cx="12" cy="16" rx="0.9" ry="1.2" fill="oklch(0.7 0.15 250 / 0.7)" />
        </g>
      </g>
    </svg>
  );
}

function Dust() {
  // 14 floating motes
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: `${(i * 73) % 100}%`,
        bottom: `${(i * 41) % 40}%`,
        delay: `${(i * 0.7) % 8}s`,
        duration: `${8 + ((i * 1.3) % 6)}s`,
        size: `${2 + (i % 3)}px`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent animate-dust"
          style={{
            left: m.left,
            bottom: m.bottom,
            width: m.size,
            height: m.size,
            opacity: 0.5,
            animationDelay: m.delay,
            animationDuration: m.duration,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

function CandleNode({
  candle,
  index,
  size,
  isHovered,
  anyHovered,
  isNew,
  onHover,
}: {
  candle: Candle;
  index: number;
  size: Size;
  isHovered: boolean;
  anyHovered: boolean;
  isNew: boolean;
  onHover: (i: number | null) => void;
}) {
  const haloPx = SIZE_MAP[size].halo;
  const dimmed = anyHovered && !isHovered;
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
      aria-label={`Vela de ${candle.name}${candle.message ? `: ${candle.message}` : ""}`}
      className="group relative flex flex-col items-center rounded-full px-1 transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      style={{
        opacity: dimmed ? 0.4 : 1,
        transform: isHovered ? "scale(1.08) translateY(-4px)" : "scale(1)",
        transition: "transform 400ms ease, opacity 400ms ease",
      }}
    >
      {/* halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
        style={{
          width: haloPx,
          height: haloPx,
          background: `radial-gradient(circle, oklch(0.85 0.18 75 / ${isHovered ? 0.55 : 0.32}) 0%, transparent 70%)`,
          filter: "blur(8px)",
          transform: "translate(-50%, -35%)",
          transition: "background 400ms ease",
        }}
      />
      <CandleSVG size={size} delay={(index * 137) % 2200} duration={2000 + ((index * 313) % 1400)} flash={isNew} />
      {isHovered && (
        <div className="pointer-events-none absolute -top-3 left-1/2 z-20 w-52 -translate-x-1/2 -translate-y-full rounded-xl border border-accent/40 bg-[oklch(0.1_0.01_260_/_0.92)] px-3.5 py-2.5 text-left shadow-elevated backdrop-blur-sm animate-fade-in">
          <p className="font-serif text-base text-accent">{candle.name}</p>
          {candle.message && (
            <p className="mt-1 text-xs italic leading-snug text-[oklch(0.92_0.02_85)]">
              "{candle.message}"
            </p>
          )}
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[oklch(0.7_0.02_85)]">
            {candle.timeAgo}
          </p>
        </div>
      )}
    </button>
  );
}

export function CandleWall({ initial, personName }: { initial: Candle[]; personName: string }) {
  const [candles, setCandles] = useState<Candle[]>(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState<number | null>(null);
  const [newestKey, setNewestKey] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const firstName = personName.split(" ")[0];
  const MAX_VISIBLE = 36;
  const visible = showAll ? candles : candles.slice(0, MAX_VISIBLE);
  const overflow = candles.length - MAX_VISIBLE;

  // distribute candles into 3 tiers (back -> front), back smaller
  const rows = useMemo(() => {
    const back: { c: Candle; i: number }[] = [];
    const mid: { c: Candle; i: number }[] = [];
    const front: { c: Candle; i: number }[] = [];
    visible.forEach((c, i) => {
      const mod = i % 3;
      if (mod === 0) front.push({ c, i });
      else if (mod === 1) mid.push({ c, i });
      else back.push({ c, i });
    });
    return { back, mid, front };
  }, [visible]);

  function light(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newCandle: Candle = {
      name: name.trim(),
      message: message.trim() || undefined,
      timeAgo: "Hace un instante",
    };
    setCandles((c) => [newCandle, ...c]);
    setNewestKey(Date.now());
    setName("");
    setMessage("");
    setOpen(false);
    toast.success(`Tu vela arde por ${firstName}`);
    setTimeout(() => setNewestKey(null), 800);
  }

  return (
    <section className="border-t border-border bg-secondary/30 py-16">
      <div className="container-prose">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Muro de velas</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Enciende una luz por {firstName}
          </h2>
          <div className="gold-divider mx-auto mt-5 w-24" />
          <div className="mt-6 inline-flex flex-col items-center">
            <span className="font-serif text-5xl text-primary">{candles.length}</span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              velas encendidas
            </span>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setOpen(true)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-soft transition hover:brightness-110"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-0 rounded-full"
                style={{ boxShadow: "0 0 30px oklch(0.85 0.18 75 / 0.35)" }}
              />
              <Flame className="h-4 w-4 text-accent" /> Encender una vela
            </button>
          </div>
        </div>

        {/* Altar scene */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-[oklch(0.2_0.02_70_/_0.6)] candle-night p-6 shadow-elevated md:p-10">
          <Dust />

          {/* Back row (smallest, furthest) */}
          <Tier candles={rows.back} size="sm" hover={hover} setHover={setHover} newestKey={newestKey} />
          {/* Mid row */}
          <Tier candles={rows.mid} size="md" hover={hover} setHover={setHover} newestKey={newestKey} offset />
          {/* Front row (largest, closest) */}
          <Tier candles={rows.front} size="lg" hover={hover} setHover={setHover} newestKey={newestKey} offset />

          {/* wood plank reflection at bottom */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                "linear-gradient(to bottom, transparent, oklch(0.18 0.03 60 / 0.6))",
            }}
          />

          {overflow > 0 && !showAll && (
            <div className="relative mt-6 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="rounded-full border border-accent/40 bg-[oklch(0.12_0.02_260_/_0.6)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-accent backdrop-blur-sm transition hover:bg-[oklch(0.18_0.02_260_/_0.7)]"
              >
                Ver {overflow} velas más
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Encender una vela"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.06_0.01_260_/_0.7)] p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={light}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl candle-night p-6 shadow-elevated animate-scale-in"
          >
            <Dust />
            <div className="relative flex items-start justify-between">
              <div className="flex flex-col items-start">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, oklch(0.85 0.18 75 / 0.5), transparent 70%)", filter: "blur(6px)" }}
                  />
                  <CandleSVG size="lg" />
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[oklch(0.95_0.02_85)]">
                  Enciende una vela
                </h3>
                <p className="mt-1 text-sm text-[oklch(0.78_0.02_85)]">
                  Tu llama acompañará a la familia de {firstName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-[oklch(0.78_0.02_85)] hover:bg-[oklch(0.2_0.02_70_/_0.5)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="relative mt-5 block text-sm">
              <span className="font-medium text-[oklch(0.92_0.02_85)]">Tu nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={40}
                autoFocus
                className="mt-1.5 w-full rounded-lg border border-[oklch(0.3_0.03_70_/_0.7)] bg-[oklch(0.1_0.01_260_/_0.6)] px-4 py-2.5 text-sm text-[oklch(0.95_0.02_85)] placeholder:text-[oklch(0.6_0.02_85)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
            <label className="relative mt-4 block text-sm">
              <span className="font-medium text-[oklch(0.92_0.02_85)]">
                Dedicatoria <span className="text-[oklch(0.65_0.02_85)]">(opcional)</span>
              </span>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={80}
                placeholder="Te recordaré siempre…"
                className="mt-1.5 w-full rounded-lg border border-[oklch(0.3_0.03_70_/_0.7)] bg-[oklch(0.1_0.01_260_/_0.6)] px-4 py-2.5 text-sm text-[oklch(0.95_0.02_85)] placeholder:text-[oklch(0.55_0.02_85)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <span className="mt-1 block text-right text-[11px] text-[oklch(0.65_0.02_85)]">
                {message.length}/80
              </span>
            </label>
            <button
              type="submit"
              className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-[oklch(0.18_0.02_60)] transition hover:brightness-110"
            >
              <Flame className="h-4 w-4" /> Encender
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

function Tier({
  candles,
  size,
  hover,
  setHover,
  newestKey,
  offset = false,
}: {
  candles: { c: Candle; i: number }[];
  size: Size;
  hover: number | null;
  setHover: (i: number | null) => void;
  newestKey: number | null;
  offset?: boolean;
}) {
  if (candles.length === 0) return null;
  const gap = size === "sm" ? "gap-3" : size === "md" ? "gap-5" : "gap-7";
  return (
    <div
      className={`relative flex flex-wrap items-end justify-center ${gap}`}
      style={{ marginTop: offset ? "12px" : 0 }}
    >
      {candles.map(({ c, i }) => (
        <CandleNode
          key={`${i}-${c.name}-${c.timeAgo}`}
          candle={c}
          index={i}
          size={size}
          isHovered={hover === i}
          anyHovered={hover !== null}
          isNew={i === 0 && newestKey !== null}
          onHover={setHover}
        />
      ))}
    </div>
  );
}