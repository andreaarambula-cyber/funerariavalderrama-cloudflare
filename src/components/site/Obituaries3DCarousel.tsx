import { useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Obituary } from "@/data/obituaries";

interface Props {
  obituaries: Obituary[];
}

const SPRING = { type: "spring" as const, stiffness: 500, damping: 90, mass: 1 };
const DRAG_THRESHOLD = 40;

export function Obituaries3DCarousel({ obituaries }: Props) {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(obituaries.length / 2));
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  const cardW = isMobile ? 220 : 300;
  const cardH = isMobile ? 420 : 520;
  const xStep = isMobile ? 150 : 220;
  const range = 2;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((prev) => (prev + dir + obituaries.length) % obituaries.length);
    },
    [obituaries.length],
  );

  // Autoplay: avanza cada 6s, pausa al hover y respeta reduced-motion
  useEffect(() => {
    if (prefersReduced || isHovered || obituaries.length <= 1) return;
    const id = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(id);
  }, [go, isHovered, prefersReduced, obituaries.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    },
    [go],
  );

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const dx = info.offset.x;
      if (dx < -DRAG_THRESHOLD) go(1);
      else if (dx > DRAG_THRESHOLD) go(-1);
    },
    [go],
  );

  return (
    <div
      className="relative select-none outline-none overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Obituarios recientes"
    >
      <button
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/20 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/60 hover:text-foreground md:left-6"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/20 text-foreground/70 backdrop-blur-sm transition-all hover:bg-background/60 hover:text-foreground md:right-6"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-background via-background/70 to-transparent md:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-background via-background/70 to-transparent md:w-36" />

      <div
        className="flex items-center justify-center overflow-visible py-8 md:py-12"
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          className="relative"
          style={{
            width: isMobile ? "92vw" : "75vw",
            height: cardH + 20,
            touchAction: "none",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={isMobile ? 0.4 : 0.15}
          onDragEnd={onDragEnd}
        >
          {obituaries.map((o, i) => {
            const offset = i - activeIndex;
            const absOffset = Math.abs(offset);
            if (absOffset > range) return null;

            // Coverflow 2D: solo translateX + scale + opacity (GPU-friendly)
            const scale = Math.max(0.8, 1 - absOffset * 0.08);
            const opacity = absOffset === 0 ? 1 : Math.max(0.32, 0.6 - absOffset * 0.14);
            const zIndex = obituaries.length * 2 - absOffset;

            return (
              <motion.div
                key={o.slug}
                className="absolute left-1/2 top-0 will-change-transform"
                style={{ width: cardW, height: cardH, zIndex }}
                animate={{
                  x: offset * xStep - cardW / 2,
                  scale,
                  opacity,
                }}
                transition={prefersReduced ? { duration: 0.2 } : SPRING}
              >
                <ObituaryCard obituary={o} isActive={absOffset === 0} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-1 flex justify-center gap-1.5">
        {obituaries.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/25"
            }`}
            aria-label={`Ir al obituario ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ObituaryCard({
  obituary,
  isActive,
}: {
  obituary: Obituary;
  isActive: boolean;
}) {
  return (
    <Link
      to="/obituarios/$slug"
      params={{ slug: obituary.slug }}
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-300"
      style={{
        boxShadow: isActive
          ? "0 25px 60px -12px rgb(0 0 0 / 0.25)"
          : "0 8px 20px -8px rgb(0 0 0 / 0.08)",
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={obituary.photo}
          alt={`Retrato de ${obituary.fullName}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/70 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-primary">{obituary.fullName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {obituary.birth} — {obituary.death}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider text-accent-foreground/80">
          <MapPin className="h-3 w-3" /> {obituary.comuna}
        </p>
        {isActive && (
          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            Ver memorial <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </Link>
  );
}