import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Calendar, Share2 } from "lucide-react";
import { getObituary, obituaries } from "@/data/obituaries";
import { CandleWall } from "@/components/memorial/CandleWall";
import { LifeTimeline } from "@/components/memorial/LifeTimeline";
import { MemoryGallery } from "@/components/memorial/MemoryGallery";
import { AnecdoteWall } from "@/components/memorial/AnecdoteWall";
import { FarewellAgenda } from "@/components/memorial/FarewellAgenda";
import { MemorialQR } from "@/components/memorial/MemorialQR";
import { useState } from "react";

export const Route = createFileRoute("/obituarios/")({
  loader: ({ params }) => {
    const o = getObituary(params.slug);
    if (!o) throw notFound();
    return o;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.fullName} — Obituario | Funeraria Serena` },
            {
              name: "description",
              content: `${loaderData.fullName} (${loaderData.birth} — ${loaderData.death}). ${loaderData.summary}`,
            },
            { property: "og:title", content: `En memoria de ${loaderData.fullName}` },
            { property: "og:description", content: loaderData.summary },
            { property: "og:image", content: loaderData.photo },
          ],
        }
      : { meta: [{ title: "Obituario — Funeraria Serena" }] },
  notFoundComponent: () => (
    <div className="container-prose py-24 text-center">
      <h1 className="font-serif text-4xl text-primary">Obituario no encontrado</h1>
      <Link to="/obituarios" className="mt-6 inline-block text-primary underline">
        Ver todos los obituarios
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-prose py-24 text-center">
      <h1 className="font-serif text-3xl text-primary">Algo salió mal</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ObituarioPage,
});

function ObituarioPage() {
  const o = Route.useLoaderData();
  const memorialUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://funerariaserena.cl/obituarios/${o.slug}`;

  const [messages, setMessages] = useState<{ name: string; text: string; date: string }[]>([
    {
      name: "Familia Rodríguez",
      text: "Un alma generosa que dejó huellas en todos quienes la conocimos. Un abrazo a toda la familia.",
      date: "Hace 2 horas",
    },
    {
      name: "Juan Pablo M.",
      text: "Compañero de toda la vida. Tu sonrisa quedará para siempre en nuestra memoria.",
      date: "Hace 5 horas",
    },
  ]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setMessages((m) => [{ name: name.trim(), text: text.trim(), date: "Hace un instante" }, ...m]);
    setName("");
    setText("");
  }

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border bg-primary py-16 text-primary-foreground md:py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `url(${o.photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-primary/85" />
        <div className="container-prose">
          <Link
            to="/obituarios"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Todos los obituarios
          </Link>
          <div className="grid gap-10 md:grid-cols-[280px,1fr] md:items-end">
            <div className="overflow-hidden rounded-2xl border-4 border-accent/40 shadow-elevated">
              <img
                src={o.photo}
                alt={`Retrato de ${o.fullName}`}
                className="h-full w-full object-cover"
                width={560}
                height={700}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">En memoria de</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{o.fullName}</h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-primary-foreground/80">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" /> {o.birth} — {o.death}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> {o.comuna}
                </span>
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
                {o.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <LifeTimeline items={o.timeline} personName={o.fullName} />

      {/* GALLERY */}
      <MemoryGallery items={o.gallery} personName={o.fullName} />

      {/* ANECDOTES */}
      <AnecdoteWall items={o.anecdotes} personName={o.fullName} />

      {/* FAREWELL AGENDA */}
      <FarewellAgenda events={o.events} personName={o.fullName} />

      {/* CANDLE WALL */}
      <CandleWall initial={o.candles} personName={o.fullName} />

      {/* MESSAGES + SHARE */}
      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1fr,360px]">
        <div>
          <h2 className="font-serif text-3xl text-primary">Mensajes de condolencia</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tus palabras son un consuelo para la familia.
          </p>

          <form
            onSubmit={submit}
            className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft"
          >
            <label className="block text-sm">
              <span className="font-medium">Tu nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium">Tu mensaje</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                maxLength={500}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Enviar condolencia
            </button>
          </form>

          <ul className="mt-8 space-y-4">
            {messages.map((m, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-primary">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{m.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <MemorialQR url={memorialUrl} personName={o.fullName} />

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
              Compartir
            </p>
            <div className="mt-3 flex gap-2">
              {[
                { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`En memoria de ${o.fullName}: ${memorialUrl}`)}` },
                { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}` },
                { label: "Email", href: `mailto:?subject=${encodeURIComponent(`En memoria de ${o.fullName}`)}&body=${encodeURIComponent(memorialUrl)}` },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-border px-3 py-2 text-center text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(memorialUrl)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition hover:border-primary/40"
            >
              <Share2 className="h-3.5 w-3.5" /> Copiar enlace
            </button>
          </div>
        </aside>
      </section>

      {/* OTHER MEMORIALS */}
      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="container-prose">
          <h2 className="font-serif text-2xl text-primary">Otros memoriales</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {obituaries
              .filter((x) => x.slug !== o.slug)
              .slice(0, 3)
              .map((x) => (
                <Link
                  key={x.slug}
                  to="/obituarios/$slug"
                  params={{ slug: x.slug }}
                  className="group flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <img
                    src={x.photo}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-serif text-lg text-primary">{x.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {x.birth} — {x.death}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-accent-foreground/80">
                      {x.comuna}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
