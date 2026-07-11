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
          <p className="mb-4 flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="h-px w-8 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance font-serif text-[2.7rem] leading-[1.05] text-primary md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}