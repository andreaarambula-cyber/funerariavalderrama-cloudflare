import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Calendar, Share2 } from "lucide-react";
import { fetchObituarioBySlug } from "@/data/obituariosApi";
import type { ObituaryListItem } from "@/data/obituariosApi";
import { CandleWall } from "@/components/memorial/CandleWall";
import { MemoryGallery } from "@/components/memorial/MemoryGallery";
import { AnecdoteWall } from "@/components/memorial/AnecdoteWall";
import { FarewellAgenda } from "@/components/memorial/FarewellAgenda";
import { MemorialQR } from "@/components/memorial/MemorialQR";

export const Route = createFileRoute("/obituarios/$slug")({
  loader: async ({ params }) => {
    const o = await fetchObituarioBySlug(params.slug);
    if (!o) throw notFound();
    return o;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.fullName} — Obituario | Funeraria Valderrama` },
            {
              name: "description",
              content: `${loaderData.fullName} (${loaderData.birth} — ${loaderData.death}). ${loaderData.summary}`,
            },
            { property: "og:title", content: `En memoria de ${loaderData.fullName}` },
            { property: "og:description", content: loaderData.summary },
            { property: "og:image", content: loaderData.photo },
          ],
        }
      : { meta: [{ title: "Obituario — Funeraria Valderrama" }] },
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
      : `https://funerariavalderrama.cl/obituarios/${o.slug}`;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-primary py-10 text-primary-foreground md:py-24">
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
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground md:mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Todos los obituarios
          </Link>
          <div className="flex flex-col items-center gap-5 text-center sm:grid sm:grid-cols-[140px_1fr] sm:items-center sm:gap-8 sm:text-left md:grid-cols-[180px_1fr] md:gap-10">
            <div className="w-32 overflow-hidden rounded-2xl border-4 border-accent/40 shadow-elevated sm:w-full">
              <img
                src={o.photo}
                alt={`Retrato de ${o.fullName}`}
                className="aspect-[4/5] h-full w-full object-cover"
                width={560}
                height={700}
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent">En memoria de</p>
              <h1 className="mt-2 font-serif text-2xl leading-tight sm:text-4xl md:text-6xl">{o.fullName}</h1>
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-primary-foreground/80 sm:justify-start sm:text-base">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" /> {o.birth} — {o.death}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> {o.comuna}
                </span>
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/90 sm:text-lg">
                {o.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      <MemoryGallery items={o.gallery} personName={o.fullName} obituarioId={o.id} />
      <AnecdoteWall items={o.anecdotes} personName={o.fullName} obituarioId={o.id} />
      <FarewellAgenda events={o.events} personName={o.fullName} />
      <CandleWall initial={o.candles} personName={o.fullName} obituarioId={o.id} />

      <section className="container-prose py-16">
        <aside className="mx-auto grid max-w-2xl gap-6">
          <MemorialQR url={memorialUrl} personName={o.fullName} />

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
              Compartir
            </p>
            <div className="mt-3 flex gap-2">
              {[
                {
                  label: "WhatsApp",
                  href: `https://wa.me/?text=${encodeURIComponent(`En memoria de ${o.fullName}: ${memorialUrl}`)}`,
                },
                {
                  label: "Facebook",
                  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`,
                },
                {
                  label: "Email",
                  href: `mailto:?subject=${encodeURIComponent(`En memoria de ${o.fullName}`)}&body=${encodeURIComponent(memorialUrl)}`,
                },
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

      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="container-prose">
          <h2 className="font-serif text-2xl text-primary">Otros memoriales</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {o.others
              .slice(0, 3)
              .map((x: ObituaryListItem) => (
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
