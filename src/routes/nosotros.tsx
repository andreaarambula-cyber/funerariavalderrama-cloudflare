import { createFileRoute } from "@tanstack/react-router";
import { Heart, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LeafDecoration } from "@/components/site/LeafDecoration";
import { Visitanos } from "@/components/site/Visitanos";
import forestImg from "@/assets/forest-path.jpg";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Más de 28 años acompañando a familias en momentos de despedida, con cercanía, respeto y compromiso. Conoce nuestra historia.",      },
    ],
  }),
  component: NosotrosPage,
});

function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Nuestra historia"
        subtitle="Más de 28 años acompañando a familias en momentos de despedida, con la cercanía y el compromiso que nos caracterizan desde el primer día."
      />

      <section className="container-prose grid gap-12 py-20 lg:grid-cols-2 lg:items-stretch">
        <div className="h-full min-h-[20rem] overflow-hidden rounded-3xl shadow-soft">
          <img src={forestImg} alt="Sendero entre árboles" className="h-full w-full object-cover animate-kb-slow" loading="lazy" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">
            Nuestra historia
          </p>
          <h2 className="mt-3 font-serif text-[2.2rem] leading-[1.1] text-primary md:text-[2.7rem]">
          Más de 28 años acompañando a las familias
          </h2>
        <p className="mt-5 text-muted-foreground">
        Nuestra historia no comenzó en una oficina ni con un gran plan de negocios. Comenzó hace más de 28 años, como una empresa familiar dedicada a la distribución de urnas funerarias en distintas ciudades de Chile.
        </p>
        <p className="mt-3 text-muted-foreground">
        Durante esos años conocimos de cerca la realidad de cientos de familias que enfrentaban la pérdida de un ser querido. Escuchamos sus historias, vimos sus necesidades y comprendimos que, en los momentos más difíciles, las personas no solo necesitan un producto o un trámite: necesitan apoyo, orientación y alguien que les ayude a transitar ese proceso con tranquilidad.
        </p>
      <p className="mt-3 text-muted-foreground">
      Con el tiempo entendimos que nuestra verdadera vocación era acompañar directamente a las familias. Así nació Funeraria Valderrama.
      </p>
      <p className="mt-3 text-muted-foreground">
      Desde entonces hemos trabajado con la misma cercanía y sencillez que nos caracterizó desde el principio. Somos una empresa familiar que cree en el trato humano, en escuchar, en estar disponibles cuando se nos necesita y en hacer las cosas con respeto y responsabilidad.
      </p>
      <p className="mt-3 text-muted-foreground">
      Sabemos que ninguna despedida es igual a otra, porque cada vida tiene su propia historia. Por eso nos esforzamos por entregar una atención cálida, honesta y personalizada, acompañando a las familias como nos gustaría que acompañaran a la nuestra.
      </p>
    <p className="mt-3 text-muted-foreground">
    Hoy, después de décadas de experiencia en el rubro funerario, seguimos manteniendo los mismos valores que nos dieron origen: cercanía, confianza y compromiso con las personas.
    </p>
    <p className="mt-3 text-muted-foreground">
    Porque más que realizar un servicio, creemos en acompañar a las familias cuando más lo necesitan.
    </p>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container-prose">
          <h2 className="font-serif text-[2.2rem] leading-[1.1] text-primary md:text-[2.7rem]">Nuestros valores</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: "Cercanía humana", desc: "Atendemos cada familia como si fuera la nuestra." },
              { icon: ShieldCheck, title: "Transparencia", desc: "Trato claro y honesto, sin sorpresas, en cada paso." },
              { icon: Users, title: "Profesionalismo", desc: "Equipo capacitado y certificado en cada sucursal." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft">
                <LeafDecoration className="pointer-events-none absolute right-0 top-0 h-full w-40 text-accent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                <Icon className="relative h-8 w-8 text-accent" strokeWidth={1.5} />
                <h3 className="relative mt-4 font-serif text-2xl text-primary">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Visitanos />
    </>
  );
}
