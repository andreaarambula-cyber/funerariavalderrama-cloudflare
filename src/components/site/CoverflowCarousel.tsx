import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 90, mass: 1 };
const DRAG_THRESHOLD = 40;

// Carrusel "coverflow" (card central destacada, vecinas asomando, deslizable)
// — pensado para mobile. Reutiliza el formato de los obituarios del inicio.
export function CoverflowCarousel({
  items,
  cardW = 260,
  cardH = 360,
  ariaLabel,
  tone = "light",
  autoplay = true,
  sideOpacity,
  edgeFade = true,
  fadeCards = true,
}: {
  items: ReactNode[];
  cardW?: number;
  cardH?: number;
  ariaLabel: string;
  tone?: "light" | "dark";
  autoplay?: boolean;
  sideOpacity?: number;
  edgeFade?: boolean;
  fadeCards?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(items.length / 2));
  const prefersReduced = useReducedMotion();
  const pausedRef = useRef(false);
  const xStep = Math.round(cardW * 0.66);
  const range = 2;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((p) => (p + dir + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (!autoplay || prefersReduced || items.length <= 1) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) go(1);
    }, 6000);
    return () => window.clearInterval(id);
  }, [go, prefersReduced, items.length, autoplay]);

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const dx = info.offset.x;
      if (dx < -DRAG_THRESHOLD) go(1);
      else if (dx > DRAG_THRESHOLD) go(-1);
    },
    [go],
  );

  const light = tone === "light";
  const fadeFrom = light ? "var(--background)" : "var(--primary)";
  const btnClass = light
    ? "border-border/40 bg-background/40 text-foreground/70 hover:bg-background/70"
    : "border-white/20 bg-white/10 text-white/80 hover:bg-white/25";
  const dotOn = light ? "bg-primary" : "bg-accent";
  const dotOff = light ? "bg-primary/25" : "bg-white/30";
  const inactiveOpacity = sideOpacity ?? 0.6;

  return (
    <div
      className="relative select-none overflow-hidden"
      role="region"
      aria-label={ariaLabel}
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onTouchStart={() => (pausedRef.current = true)}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Anterior"
        className={cn(
          "absolute left-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition-all",
          btnClass,
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Siguiente"
        className={cn(
          "absolute right-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition-all",
          btnClass,
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {edgeFade && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10"
            style={{ background: `linear-gradient(to right, ${fadeFrom}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10"
            style={{ background: `linear-gradient(to left, ${fadeFrom}, transparent)` }}
          />
        </>
      )}

      <div
        className="flex items-center justify-center overflow-visible py-6"
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          className="relative"
          style={{ width: "92vw", height: cardH + 16, touchAction: "none" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => {
            let offset = i - activeIndex;
            const half = Math.floor(items.length / 2);
            if (offset > half) offset -= items.length;
            if (offset < -half) offset += items.length;
            const abs = Math.abs(offset);
            if (abs > range) return null;
            const scale = Math.max(0.8, 1 - abs * 0.08);
            const opacity = fadeCards
              ? abs === 0
                ? 1
                : Math.max(0.3, inactiveOpacity - (abs - 1) * 0.14)
              : 1;
            const zIndex = items.length * 2 - abs;
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-0 will-change-transform [&>*]:h-full [&>*]:w-full"
                style={{ width: cardW, height: cardH, zIndex }}
                animate={{ x: offset * xStep - cardW / 2, scale, opacity }}
                transition={prefersReduced ? { duration: 0.2 } : SPRING}
              >
                {item}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-1 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Ir a ${i + 1}`}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === activeIndex ? `w-6 ${dotOn}` : `w-2 ${dotOff}`,
            )}
          />
        ))}
      </div>
    </div>
  );
}
