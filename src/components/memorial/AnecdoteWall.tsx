import { useState } from "react";
import { Quote } from "lucide-react";
import { toast } from "sonner";
import type { Anecdote } from "@/data/obituaries";

const tilts = ["polaroid-tilt-1", "polaroid-tilt-2", "polaroid-tilt-3", "polaroid-tilt-4"];

export function AnecdoteWall({ items, personName }: { items: Anecdote[]; personName: string }) {
  const [list, setList] = useState<Anecdote[]>(items);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <article
              key={i}
              className={`relative rounded-sm bg-surface p-6 pb-10 shadow-elevated transition hover:rotate-0 hover:scale-[1.02] ${tilts[i % tilts.length]} animate-scale-in`}
            >
              <Quote className="h-6 w-6 text-accent/60" strokeWidth={1.5} />
              <p className="mt-3 font-serif text-lg leading-snug text-primary">"{a.text}"</p>
              <p className="mt-4 text-sm italic text-muted-foreground">— {a.author}</p>
            </article>
          ))}
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
