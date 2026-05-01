import type { TimelineItem } from "@/data/obituaries";

export function LifeTimeline({ items, personName }: { items: TimelineItem[]; personName: string }) {
  return (
    <section className="border-t border-border bg-secondary/30 py-16">
      <div className="container-prose">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Su historia</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            La vida de {personName.split(" ")[0]}
          </h2>
          <div className="gold-divider mx-auto mt-5 w-24" />
        </div>

        <ol className="relative mx-auto mt-12 max-w-3xl">
          <span
            aria-hidden
            className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent/0 via-accent/60 to-accent/0 md:left-1/2 md:-translate-x-1/2"
          />
          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <li
                key={i}
                className="relative mb-10 grid gap-2 pl-12 md:grid-cols-2 md:gap-8 md:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background md:left-1/2"
                />
                <div className={`md:col-start-${isLeft ? "1" : "2"} md:row-start-1 md:text-${isLeft ? "right" : "left"} md:pr-${isLeft ? "10" : "0"} md:pl-${isLeft ? "0" : "10"}`}>
                  <p className="font-serif text-3xl text-accent">{item.year}</p>
                  <p className="mt-1 font-medium text-primary">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
