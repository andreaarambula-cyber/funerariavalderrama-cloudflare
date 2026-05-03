import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { toast } from "sonner";
import type { Anecdote } from "@/data/obituaries";

const tilts = ["polaroid-tilt-1", "polaroid-tilt-2", "polaroid-tilt-3", "polaroid-tilt-4"];

export function AnecdoteWall({ items, personName }: { items: Anecdote[]; personName: string }) {
  const [list, setList] = useState<Anecdote[]>(items);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article") as HTMLElement | null;
    const step = card ? card.offsetWidth + 32 : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * step;
    if (dir === 1 && next > maxScroll - 4) next = 0;
    if (dir === -1 && next < 0) next = maxScroll;
    el.scrollTo({ left: next, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused || list.length <= 1) return;
    const id = setInterval(() => scrollByCard(1), 6000);
    return () => clearInterval(id);
  }, [paused, list.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setList((l) => [{ author: author.trim(), text: text.trim() }, ...l]);
    toast.success("Gracias por compartir", { description: "Tu recuerdo se sumó al muro." });
    setAuthor("");
    setText("");
  }

  return (
    <section className="border-t border-border bg-secondary/30 py-16">
      <div className="container-prose">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Mejores recuerdos</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Anécdotas de quienes lo conocieron
          </h2>
          <div className="gold-divider mx-auto mt-5 w-24" />
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="-mx-4 flex gap-8 overflow-x-auto px-4 pb-4 pt-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-14"
          >
            {list.map((a, i) => (
              <article
                key={i}
                className={`relative w-72 shrink-0 snap-start rounded-sm bg-surface p-6 pb-10 shadow-elevated transition hover:rotate-0 hover:scale-[1.02] sm:w-80 md:w-96 ${tilts[i % tilts.length]} animate-scale-in`}
              >
                <Quote className="h-6 w-6 text-accent/60" strokeWidth={1.5} />
                <p className="mt-3 font-serif text-lg leading-snug text-primary">"{a.text}"</p>
                <p className="mt-4 text-sm italic text-muted-foreground">— {a.author}</p>
              </article>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 items-center justify-start sm:flex">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollByCard(-1)}
              className="pointer-events-auto -ml-2 rounded-full bg-primary/10 p-2 text-primary backdrop-blur-sm transition hover:bg-primary/30 hover:text-primary-foreground"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 items-center justify-end sm:flex">
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollByCard(1)}
              className="pointer-events-auto -mr-2 rounded-full bg-primary/10 p-2 text-primary backdrop-blur-sm transition hover:bg-primary/30 hover:text-primary-foreground"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-3 sm:hidden">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollByCard(-1)}
              className="rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollByCard(1)}
              className="rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-14 max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-soft"
        >
          <h3 className="font-serif text-xl text-primary">
            ¿Cuál es tu mejor recuerdo con {personName.split(" ")[0]}?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Un momento, una frase, una enseñanza. Lo que quieras compartir.
          </p>
          <label className="mt-4 block text-sm">
            <span className="font-medium">Tu nombre</span>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              maxLength={50}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="mt-4 block text-sm">
            <span className="font-medium">Tu recuerdo</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={3}
              maxLength={220}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Compartir recuerdo
          </button>
        </form>
      </div>
    </section>
  );
}
