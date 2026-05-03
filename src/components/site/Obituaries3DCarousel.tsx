import { useState, useCallback, useRef, useEffect } from "react";
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
const DEG = Math.PI / 180;
const WHEEL_COOLDOWN = 280;

export function Obituaries3DCarousel({ obituaries }: Props) {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(obituaries.length / 2));
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const wheelTimer = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFullyVisible(entry.intersectionRatio > 0.85),
      { threshold: [0, 0.85, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardW = isMobile ? 220 : 300;
  const cardH = isMobile ? 380 : 480;
  const xStep = isMobile ? 250 : 360;
  const radius = isMobile ? 700 : 950;
  const angleStep = isMobile ? 11 : 13;
  const perspective = 500;
  const range = isMobile ? 3 : 4;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((prev) => Math.max(0, Math.min(obituaries.length - 1, prev + dir)));
    },
    [obituaries.length],
  );

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

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - wheelTimer.current < WHEEL_COOLDOWN) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 15) {
        wheelTimer.current = now;
        go(delta > 0 ? 1 : -1);
      }
    },
    [go],
  );

  const atEdge = useCallback(
    (delta: number) => {
      if (delta > 0 && activeIndex >= obituaries.length - 1) return true;
      if (delta < 0 && activeIndex <= 0) return true;
      return false;
    },
    [activeIndex, obituaries.length],
  );

  const shouldCapture = isHovered && isFullyVisible;

  useEffect(() => {
    if (!shouldCapture) return;
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!atEdge(delta)) e.preventDefault();
    };
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, [shouldCapture, atEdge]);

  return (
    <div
      ref={containerRef}
      className="relative select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Obituarios recientes"
    >
      <button
        onClick={() => go(-1)}
        disabled={activeIndex === 0}
        className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-30 md:left-6"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        disabled={activeIndex === obituaries.length - 1}
        className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-30 md:right-6"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-background via-background/70 to-transparent md:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-background via-background/70 to-transparent md:w-36" />

      <div
        className="flex items-center justify-center overflow-visible py-8 md:py-12"
        style={{
          perspective: prefersReduced ? "none" : `${perspective}px`,
          touchAction: "pan-y",
        }}
      >
        <motion.div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
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

            const angleDeg = offset * angleStep;
            const angleRad = angleDeg * DEG;
            const arcX = Math.sin(angleRad) * radius;
            const arcZ = Math.cos(angleRad) * radius - radius;
            const rotY = -angleDeg;
            const scale = Math.max(0.82, 1 - absOffset * 0.06);
            const opacity = absOffset === 0 ? 1 : Math.max(0.35, 0.55 - absOffset * 0.08);
            const blur = absOffset === 0 ? 0 : Math.min(2.5, absOffset * 1.2);
            const zIndex = obituaries.length * 2 - absOffset;

            if (prefersReduced) {
              return (
                <motion.div
                  key={o.slug}
                  className="absolute left-1/2 top-0"
                  style={{ width: cardW, height: cardH, zIndex }}
                  animate={{
                    x: offset * xStep - cardW / 2,
                    opacity: absOffset === 0 ? 1 : 0.5,
                    scale: absOffset === 0 ? 1 : 0.92,
                  }}
                  transition={SPRING}
                >
                  <ObituaryCard obituary={o} isActive={absOffset === 0} blur={0} />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={o.slug}
                className="absolute left-1/2 top-0 will-change-transform"
                style={{
                  width: cardW,
                  height: cardH,
                  transformStyle: "preserve-3d",
                  zIndex,
                }}
                animate={{
                  x: arcX - cardW / 2,
                  z: arcZ,
                  rotateY: rotY,
                  scale,
                  opacity,
                }}
                transition={SPRING}
              >
                <ObituaryCard obituary={o} isActive={absOffset === 0} blur={blur} />
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
  blur,
}: {
  obituary: Obituary;
  isActive: boolean;
  blur: number;
}) {
  return (
    <Link
      to="/obituarios/$slug"
      params={{ slug: obituary.slug }}
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-300"
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : "none",
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
        <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-accent-foreground/80">
          <MapPin className="h-3 w-3" /> {obituary.comuna}
        </p>
        {isActive && (
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Ver memorial <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </Link>
  );
}