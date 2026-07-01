import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, Upload, MapPin, KeyRound } from "lucide-react";
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
  type?: "text" | "textarea" | "select" | "datetime" | "image" | "address";
  options?: string[];
  placeholder?: string;
  half?: boolean;
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

// Subida de imágenes
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_MB = 5;

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

  const [code, setCode] = useState("");
  useEffect(() => {
    if (!supabase || !value) return;
    supabase
      .from("obituario_codes")
      .select("code")
      .eq("obituario_id", value.id)
      .maybeSingle()
      .then(({ data }) => setCode((data as { code: string } | null)?.code ?? ""));
  }, [value]);

  const generateCode = () => {
    const base =
      (form.full_name.split(" ")[0] || "FAMILIA")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Z]/g, "")
        .slice(0, 8) || "FAMILIA";
    setCode(`${base}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

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

    let obituarioId = value?.id;
    let error;
    if (value) {
      ({ error } = await supabase.from("obituarios").update(payload).eq("id", value.id));
    } else {
      const res = await supabase
        .from("obituarios")
        .insert({ ...payload, created_by: userId, display_order: 0 })
        .select("id")
        .single();
      error = res.error;
      obituarioId = (res.data as { id: string } | null)?.id;
    }
    if (error || !obituarioId) {
      setSaving(false);
      toast.error(error?.message ?? "No se pudo guardar");
      return;
    }

    // Código de auto-aprobación (tabla secreta). Si se vacía, se elimina.
    if (code.trim()) {
      await supabase
        .from("obituario_codes")
        .upsert({ obituario_id: obituarioId, code: code.trim() }, { onConflict: "obituario_id" });
    } else {
      await supabase.from("obituario_codes").delete().eq("obituario_id", obituarioId);
    }

    setSaving(false);
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
          <Field label="Foto principal">
            <ImageInput value={form.photo_url} onChange={(v) => set("photo_url", v)} />
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
            { key: "src", label: "Imagen", type: "image" },
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
            { key: "address", label: "Lugar / dirección", type: "address" },
            { key: "isoStart", label: "Inicio (para “Mi calendario”)", type: "datetime", half: true },
            { key: "isoEnd", label: "Fin (para “Mi calendario”)", type: "datetime", half: true },
          ]}
        />

        {/* CÓDIGO DE AUTO-APROBACIÓN */}
        <Card
          title="Código de la familia (auto-aprobación)"
          hint="Compártelo con los cercanos: quien lo use al dejar una vela, recuerdo o anécdota, se publica al instante sin revisión. Los demás quedan pendientes."
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={`${inputCls} max-w-xs font-mono`}
              placeholder="Ej. PEREIRA-8421 (vacío = todo se revisa)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="button"
              onClick={generateCode}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm text-primary hover:bg-background"
            >
              <KeyRound className="h-4 w-4" /> Generar
            </button>
          </div>
        </Card>

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
  if (field.type === "image") {
    return <ImageInput value={value} onChange={onChange} />;
  }
  if (field.type === "address") {
    return <AddressInput value={value} onChange={onChange} />;
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

/* ---------------- Subir imagen (archivo) o pegar URL ---------------- */

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`La imagen pesa demasiado. Máximo ${MAX_IMAGE_MB} MB.`);
      return;
    }
    if (!supabase) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `obituarios/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Imagen subida");
  };

  return (
    <div className="space-y-2">
      {value && (
        <img
          src={value}
          alt="Vista previa"
          className="h-24 w-24 rounded-lg border border-border object-cover"
        />
      )}
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-primary hover:bg-background">
          <Upload className="h-4 w-4" />
          {uploading ? "Subiendo…" : "Subir imagen"}
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Quitar
          </button>
        )}
      </div>
      <input
        className={inputCls}
        placeholder="…o pega una URL de imagen"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-[11px] text-muted-foreground">
        Formatos: JPG, PNG, WEBP o AVIF · máximo {MAX_IMAGE_MB} MB.
      </p>
    </div>
  );
}

/* ---------------- Dirección con mapa automático ---------------- */

function AddressInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
  return (
    <div className="space-y-1.5">
      <input
        className={inputCls}
        placeholder="Ej. Parroquia San Pedro Apóstol, San Pedro de la Paz"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          El mapa y el botón “Cómo llegar” se generan solos con esta dirección.
        </p>
        {value.trim() && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            <MapPin className="h-3 w-3" /> Ver en Maps
          </a>
        )}
      </div>
    </div>
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
