import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, Users, MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import forestImg from "@/assets/forest-path.jpg";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Más de 30 años acompañando a familias chilenas con servicios funerarios dignos, transparentes y humanos. Conoce nuestra historia y equipo.",
      },
    ],
  }),
  component: NosotrosPage,
});

function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Una historia de cuidado, durante tres generaciones"
        subtitle="Desde 1992 hemos acompañado a más de 50.000 familias chilenas en momentos de despedida, manteniendo el mismo compromiso: dignidad, cercanía y transparencia."
      />

      <section className="container-prose grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img src={forestImg} alt="Sendero entre árboles" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">
            Nuestra historia
          </p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Tres generaciones cuidando lo más importante
          </h2>
          <p className="mt-5 text-muted-foreground">
            Funeraria Valderrama nació en Santiago en 1992 como una pequeña empresa familiar
            con una convicción clara: cada despedida merece dignidad, cada familia
            merece ser escuchada, y cada detalle merece ser cuidado.
          </p>
          <p className="mt-3 text-muted-foreground">
            Hoy contamos con sucursales en 12 ciudades de Chile, un equipo de 80
            profesionales y la misma vocación de servicio que el primer día.
          </p>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container-prose">
          <h2 className="font-serif text-3xl text-primary md:text-4xl">Nuestros valores</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: "Cercanía humana", desc: "Atendemos cada familia como si fuera la nuestra." },
              { icon: ShieldCheck, title: "Transparencia", desc: "Precios claros, sin sorpresas, en cada paso." },
              { icon: Users, title: "Profesionalismo", desc: "Equipo capacitado y certificado en cada sucursal." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
                <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-2xl text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { city: "Santiago", addr: "Av. Providencia 1234, Providencia" },
            { city: "Valparaíso", addr: "Brasil 2050, Valparaíso" },
            { city: "Concepción", addr: "Caupolicán 530, Concepción" },
          ].map((s) => (
            <div key={s.city} className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
              <MapPin className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-serif text-2xl text-primary">{s.city}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.addr}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-accent-foreground/80">
                Atención 24/7
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Visítanos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}