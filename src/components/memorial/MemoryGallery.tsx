import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { GalleryItem } from "@/data/obituaries";

export function MemoryGallery({ items, personName }: { items: GalleryItem[]; personName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("figure") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * step;
    if (dir === 1 && next > maxScroll - 4) next = 0;
    if (dir === -1 && next < 0) next = maxScroll;
    el.scrollTo({ left: next, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => scrollByCard(1), 6000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !caption.trim()) return;
    toast.success("Recuerdo enviado", {
      description: "La familia revisará tu aporte antes de publicarlo.",
    });
    setName("");
    setCaption("");
    setOpen(false);
  }

  return (
    <section className="border-t border-border py-16">
      <div className="container-prose">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Galería</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              Recuerdos compartidos
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Momentos que la familia y amigos quieren conservar.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-5 py-2.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ImagePlus className="h-4 w-4" /> Aportar un recuerdo
          </button>
        </div>

        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6"
          >
            {items.map((g, i) => (
              <figure
                key={i}
                className="group relative aspect-square w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition hover:shadow-elevated sm:w-64 md:w-72"
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary/95 to-primary/0 p-4 text-primary-foreground transition group-hover:translate-y-0">
                  <p className="text-sm font-medium">{g.caption}</p>
                  <p className="mt-0.5 text-xs italic text-primary-foreground/70">— {g.author}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByCard(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary backdrop-blur-sm transition hover:bg-primary/30 hover:text-primary-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByCard(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary backdrop-blur-sm transition hover:bg-primary/30 hover:text-primary-foreground"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aportar un recuerdo"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-primary/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-5 shadow-elevated animate-scale-in sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <Upload className="h-8 w-8 text-accent" strokeWidth={1.4} />
                <h3 className="mt-2 font-serif text-2xl text-primary">Comparte un recuerdo</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Una foto con {personName.split(" ")[0]} que quieras que la familia conserve.
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

            <div className="mt-5 flex min-h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-4 text-center text-sm text-muted-foreground hover:border-primary/40 sm:aspect-video sm:min-h-0">
              <div>
                <Upload className="mx-auto h-6 w-6" />
                <p className="mt-2">Haz clic o arrastra una imagen</p>
                <p className="text-xs">JPG o PNG, máx. 5 MB</p>
              </div>
            </div>

            <label className="mt-4 block text-sm">
              <span className="font-medium">Tu nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={40}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium">Cuéntanos el momento</span>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                rows={3}
                maxLength={140}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Enviar recuerdo
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              La familia revisará tu aporte antes de publicarlo.
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
