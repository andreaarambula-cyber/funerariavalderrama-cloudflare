type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="border-b border-border/70 bg-secondary/40">
      <div className="container-prose py-16 md:py-24">
        {eyebrow && (
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
            <span className="inline-block border-b border-accent pb-1 text-accent-foreground">
              {eyebrow}
            </span>
          </p>
        )}
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}