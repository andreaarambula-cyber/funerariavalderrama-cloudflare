import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  type ObituarioFull,
  type ObituarioStatus,
  type Item,
  EVENT_TYPES,
  asItems,
  slugify,
} from "./obituario";

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "datetime";
  options?: string[];
  placeholder?: string;
  half?: boolean;
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function ObituarioEditor({
  value,
  userId,
  isStaff,
  onClose,
  onSaved,
}: {
  value: ObituarioFull | null;
  userId: string;
  isStaff: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: value?.full_name ?? "",
    slug: value?.slug ?? "",
    photo_url: value?.photo_url ?? "",
    birth: value?.birth ?? "",
    death: value?.death ?? "",
    comuna: value?.comuna ?? "",
    summary: value?.summary ?? "",
    status: value?.status ?? ("draft" as ObituarioStatus),
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const [gallery, setGallery] = useState<Item[]>(asItems(value?.gallery, ["src", "caption", "author"]));
  const [anecdotes, setAnecdotes] = useState<Item[]>(asItems(value?.anecdotes, ["text", "author"]));
  const [timeline, setTimeline] = useState<Item[]>(asItems(value?.timeline, ["year", "title", "description"]));
  const [events, setEvents] = useState<Item[]>(
    asItems(value?.events, ["type", "date", "address", "isoStart", "isoEnd"]),
  );

  const save = async () => {
    if (!supabase) return;
    if (!form.full_name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    const slug = form.slug.trim() || slugify(form.full_name);
    const payload = {
      full_name: form.full_name.trim(),
      slug,
      photo_url: form.photo_url || null,
      birth: form.birth || null,
      death: form.death || null,
      comuna: form.comuna || null,
      summary: form.summary || null,
      status: form.status,
      gallery,
      anecdotes,
      timeline,
      // "Cómo llegar" usa la misma dirección para Google Maps.
      events: events.map((e) => ({ ...e, mapsQuery: e.address })),
      updated_by: userId,
    };

    let error;
    if (value) {
      ({ error } = await supabase.from("obituarios").update(payload).eq("id", value.id));
    } else {
      ({ error } = await supabase
        .from("obituarios")
        .insert({ ...payload, created_by: userId, display_order: 0 }));
    }
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(value ? "Obituario actualizado" : "Obituario creado");
    onSaved();
  };

  return (
    <div className="p-8">
      <button
        onClick={onClose}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la lista
      </button>

      <h1 className="font-serif text-2xl text-primary">
        {value ? "Editar obituario" : "Nuevo obituario"}
      </h1>
      <p className="text-sm text-muted-foreground">
        Cada bloque de abajo es una sección de la página del obituario.
      </p>

      <div className="mt-6 max-w-3xl space-y-6">
        {/* 1. ENCABEZADO */}
        <Card title="Encabezado" hint="Es lo primero que se ve: “En memoria de…”.">
          <Field label="Nombre completo *">
            <input
              className={inputCls}
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              onBlur={() => !form.slug && set("slug", slugify(form.full_name))}
            />
          </Field>
          <Field label="Foto principal (URL de la imagen)">
            <input className={inputCls} value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nacimiento (ej. 22/11/1965)">
              <input className={inputCls} value={form.birth} onChange={(e) => set("birth", e.target.value)} />
            </Field>
            <Field label="Fallecimiento (ej. 25/04/2026)">
              <input className={inputCls} value={form.death} onChange={(e) => set("death", e.target.value)} />
            </Field>
          </div>
          <Field label="Comuna">
            <input className={inputCls} value={form.comuna} onChange={(e) => set("comuna", e.target.value)} />
          </Field>
          <Field label="Reseña (frase bajo el nombre)">
            <textarea
              rows={3}
              className={inputCls}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
          <Field label="Slug (dirección en la web — se llena solo)">
            <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </Field>
        </Card>

        {/* 2. GALERÍA */}
        <Section
          title="Galería — “Recuerdos compartidos”"
          hint="Fotos con una descripción y quién la aportó."
          addLabel="Agregar foto"
          items={gallery}
          setItems={setGallery}
          fields={[
            { key: "src", label: "Imagen (URL)", placeholder: "https://…" },
            { key: "caption", label: "Descripción del recuerdo" },
            { key: "author", label: "Aportado por (ej. Familia)" },
          ]}
        />

        {/* 3. ANÉCDOTAS */}
        <Section
          title="Anécdotas — “de quienes lo conocieron”"
          hint="Frases o recuerdos de familiares y amigos."
          addLabel="Agregar anécdota"
          items={anecdotes}
          setItems={setAnecdotes}
          fields={[
            { key: "text", label: "Frase / recuerdo", type: "textarea" },
            { key: "author", label: "Quién lo dijo (ej. Loreto, su esposa)" },
          ]}
        />

        {/* 4. TRAYECTORIA */}
        <Section
          title="Trayectoria — línea de vida"
          hint="Momentos importantes de su vida, en orden."
          addLabel="Agregar momento"
          items={timeline}
          setItems={setTimeline}
          fields={[
            { key: "year", label: "Año", half: true },
            { key: "title", label: "Título", half: true },
            { key: "description", label: "Descripción", type: "textarea" },
          ]}
        />

        {/* 5. EVENTOS */}
        <Section
          title="Eventos de despedida — velatorio, misa…"
          hint="Cada tarjeta con “Cómo llegar” y “Mi calendario”."
          addLabel="Agregar evento"
          items={events}
          setItems={setEvents}
          fields={[
            { key: "type", label: "Tipo", type: "select", options: EVENT_TYPES, half: true },
            { key: "date", label: "Fecha y hora (como se muestra)", placeholder: "Hoy, 19:00 a 23:00 hrs", half: true },
            { key: "address", label: "Dirección (para “Cómo llegar”)" },
            { key: "isoStart", label: "Inicio (para “Mi calendario”)", type: "datetime", half: true },
            { key: "isoEnd", label: "Fin (para “Mi calendario”)", type: "datetime", half: true },
          ]}
        />

        {/* ESTADO */}
        <Card title="Publicación" hint="Solo un administrador puede publicar o archivar.">
          <Field label="Estado">
            <select
              className={inputCls}
              value={form.status}
              disabled={!isStaff}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="draft">Borrador (no se ve en la web)</option>
              <option value="published">Publicado (visible para todos)</option>
              <option value="archived">Archivado</option>
            </select>
          </Field>
        </Card>

        <div className="sticky bottom-0 -mx-8 border-t border-border bg-background/95 px-8 py-4 backdrop-blur">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando…" : "Guardar obituario"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sección repetible (agregar / quitar) ---------------- */

function Section({
  title,
  hint,
  addLabel,
  items,
  setItems,
  fields,
}: {
  title: string;
  hint: string;
  addLabel: string;
  items: Item[];
  setItems: (v: Item[]) => void;
  fields: FieldDef[];
}) {
  const add = () =>
    setItems([...items, Object.fromEntries(fields.map((f) => [f.key, f.type === "select" ? f.options?.[0] ?? "" : ""]))]);
  const update = (i: number, key: string, val: string) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card title={title} hint={hint}>
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-center text-sm text-muted-foreground">
          Aún no hay elementos. Haz clic en “{addLabel}”.
        </p>
      )}

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                #{i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Quitar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.key} className={f.half ? "col-span-1" : "col-span-2"}>
                  <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                  <div className="mt-1">
                    <FieldInput field={f} value={item[f.key] ?? ""} onChange={(v) => update(i, f.key, v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-background"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </Card>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea rows={3} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
  if (field.type === "select") {
    return (
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={field.type === "datetime" ? "datetime-local" : "text"}
      placeholder={field.placeholder}
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ---------------- Presentación ---------------- */

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="font-serif text-lg text-primary">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-primary">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
