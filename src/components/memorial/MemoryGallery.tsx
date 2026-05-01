import { useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { GalleryItem } from "@/data/obituaries";

export function MemoryGallery({ items, personName }: { items: GalleryItem[]; personName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");

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

        <div className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {items.map((g, i) => (
            <figure
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition hover:shadow-elevated"
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="w-full transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary/95 to-primary/0 p-4 text-primary-foreground transition group-hover:translate-y-0">
                <p className="text-sm font-medium">{g.caption}</p>
                <p className="mt-0.5 text-xs italic text-primary-foreground/70">— {g.author}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aportar un recuerdo"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-elevated animate-scale-in"
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

            <div className="mt-5 flex aspect-video w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-background text-center text-sm text-muted-foreground hover:border-primary/40">
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
