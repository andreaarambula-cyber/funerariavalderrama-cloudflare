import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cotizar")({
  head: () => ({
    meta: [
      { title: "Cotizador online — Funeraria Valderrama" },
      {
        name: "description",
        content:
          "Cotiza tu servicio funerario en línea en menos de 2 minutos. Precios transparentes en CLP y respuesta inmediata.",
      },
    ],
  }),
  component: CotizarPage,
});

const TIPOS = [
  { id: "sepultura", label: "Sepultura", price: 1290000 },
  { id: "cremacion", label: "Cremación", price: 890000 },
];
const URNAS = [
  { id: "estandar", label: "Estándar", price: 0 },
  { id: "premium", label: "Premium", price: 220000 },
  { id: "lujo", label: "Lujo", price: 480000 },
];
const ADICIONALES = [
  { id: "capilla", label: "Capilla ardiente premium", price: 180000 },
  { id: "coro", label: "Coro / música en vivo", price: 220000 },
  { id: "obituario", label: "Publicación de obituario", price: 90000 },
  { id: "flores", label: "Arreglo floral", price: 120000 },
];

function CotizarPage() {
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState(TIPOS[0].id);
  const [comuna, setComuna] = useState("");
  const [traslado, setTraslado] = useState(false);
  const [urna, setUrna] = useState(URNAS[0].id);
  const [adic, setAdic] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const total = useMemo(() => {
    const t = TIPOS.find((x) => x.id === tipo)!.price;
    const u = URNAS.find((x) => x.id === urna)!.price;
    const a = ADICIONALES.filter((x) => adic.includes(x.id)).reduce(
      (s, x) => s + x.price,
      0,
    );
    const tr = traslado ? 280000 : 0;
    return t + u + a + tr;
  }, [tipo, urna, adic, traslado]);

  const steps = ["Tipo de servicio", "Comuna y traslados", "Urna o ataúd", "Adicionales", "Tus datos"];

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setDone(true);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }
  function toggleAdic(id: string) {
    setAdic((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  }

  if (done) return <Confirmation total={total} name={name} />;

  return (
    <>
      <PageHero
        eyebrow="Cotizador online"
        title="Tu cotización en menos de 2 minutos"
        subtitle="Diseña el servicio paso a paso. Verás el precio actualizándose en cada decisión, sin sorpresas."
      />

      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1fr,340px]">
        <div>
          <ProgressBar step={step} total={steps.length} labels={steps} />

          <div className="mt-8 rounded-3xl border border-border bg-surface p-8 shadow-soft md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
              Paso {step + 1} de {steps.length}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-primary">{steps[step]}</h2>

            <div className="mt-6">
              {step === 0 && (
                <RadioGroup
                  options={TIPOS.map((t) => ({ id: t.id, label: t.label, hint: formatCLP(t.price) }))}
                  value={tipo}
                  onChange={setTipo}
                />
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-medium">Comuna</span>
                    <input
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      placeholder="Ej. Providencia"
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={traslado}
                      onChange={(e) => setTraslado(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-medium">Requiero traslado interurbano</span>
                      <span className="text-xs text-muted-foreground">Agrega {formatCLP(280000)}</span>
                    </span>
                  </label>
                </div>
              )}
              {step === 2 && (
                <RadioGroup
                  options={URNAS.map((u) => ({
                    id: u.id,
                    label: u.label,
                    hint: u.price === 0 ? "Incluido" : "+ " + formatCLP(u.price),
                  }))}
                  value={urna}
                  onChange={setUrna}
                />
              )}
              {step === 3 && (
                <div className="grid gap-3">
                  {ADICIONALES.map((a) => {
                    const active = adic.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-background p-4 transition",
                          active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleAdic(a.id)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm font-medium">{a.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">+ {formatCLP(a.price)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {step === 4 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre completo" value={name} onChange={setName} />
                  <Field label="Teléfono" value={phone} onChange={setPhone} type="tel" />
                  <div className="sm:col-span-2">
                    <Field label="Email" value={email} onChange={setEmail} type="email" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
              >
                {step === steps.length - 1 ? "Enviar cotización" : "Continuar"}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-primary p-7 text-primary-foreground shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
              Tu cotización
            </p>
            <p className="mt-2 font-serif text-4xl">{formatCLP(total)}</p>
            <p className="text-xs text-primary-foreground/70">CLP, IVA incluido</p>
            <ul className="mt-6 space-y-2 text-sm text-primary-foreground/85">
              <li className="flex justify-between gap-2">
                <span>{TIPOS.find((t) => t.id === tipo)?.label}</span>
                <span>{formatCLP(TIPOS.find((t) => t.id === tipo)!.price)}</span>
              </li>
              {traslado && (
                <li className="flex justify-between gap-2">
                  <span>Traslado</span>
                  <span>{formatCLP(280000)}</span>
                </li>
              )}
              {URNAS.find((u) => u.id === urna)!.price > 0 && (
                <li className="flex justify-between gap-2">
                  <span>Urna {URNAS.find((u) => u.id === urna)?.label}</span>
                  <span>{formatCLP(URNAS.find((u) => u.id === urna)!.price)}</span>
                </li>
              )}
              {ADICIONALES.filter((a) => adic.includes(a.id)).map((a) => (
                <li key={a.id} className="flex justify-between gap-2">
                  <span>{a.label}</span>
                  <span>{formatCLP(a.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

function ProgressBar({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
      <ol className="mt-3 hidden grid-cols-5 text-[11px] text-muted-foreground md:grid">
        {labels.map((l, i) => (
          <li
            key={l}
            className={cn(
              "text-center uppercase tracking-wider",
              i <= step && "text-primary",
            )}
          >
            {l}
          </li>
        ))}
      </ol>
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; hint: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border bg-background p-5 text-left transition",
              active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
            )}
          >
            <span className="font-serif text-xl text-primary">{o.label}</span>
            <span className="text-sm text-muted-foreground">{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Confirmation({ total, name }: { total: number; name: string }) {
  return (
    <section className="container-prose py-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-surface p-10 text-center shadow-soft md:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-accent-foreground">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-primary md:text-4xl">
          Cotización enviada{name ? `, ${name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Recibirás un correo con el detalle. Un asesor te contactará en menos de 30
          minutos.
        </p>
        <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Total estimado
          </p>
          <p className="mt-1 font-serif text-3xl text-primary">{formatCLP(total)}</p>
        </div>
        <a
          href="https://wa.me/56953900931"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-medium text-whatsapp-foreground"
        >
          <MessageCircle className="h-4 w-4" /> Conversar por WhatsApp
        </a>
      </div>
    </section>
  );
}

function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}