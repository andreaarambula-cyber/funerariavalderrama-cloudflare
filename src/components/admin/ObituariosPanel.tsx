import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, ArrowLeft, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface ObituarioRow {
  id: string;
  slug: string;
  full_name: string;
  status: "draft" | "published" | "archived";
  comuna: string | null;
  updated_at: string;
}

interface ObituarioFull extends ObituarioRow {
  photo_url: string | null;
  birth: string | null;
  death: string | null;
  summary: string | null;
  timeline: unknown;
  gallery: unknown;
  anecdotes: unknown;
  events: unknown;
  created_by: string | null;
}

const STATUS_LABEL: Record<ObituarioRow["status"], string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function ObituariosPanel() {
  const { user, isStaff } = useAuth();
  const [rows, setRows] = useState<ObituarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ObituarioFull | "new" | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("obituarios")
      .select("id, slug, full_name, status, comuna, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error("No se pudieron cargar los obituarios");
    setRows((data ?? []) as ObituarioRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = async (id: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.from("obituarios").select("*").eq("id", id).single();
    if (error || !data) {
      toast.error("No se pudo abrir el obituario");
      return;
    }
    setEditing(data as ObituarioFull);
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    if (!confirm("¿Eliminar este obituario? Esta acción no se puede deshacer.")) return;
    const { error } = await supabase.from("obituarios").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Obituario eliminado");
    void load();
  };

  if (editing) {
    return (
      <ObituarioEditor
        value={editing === "new" ? null : editing}
        userId={user?.id ?? ""}
        isStaff={isStaff}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          void load();
        }}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-primary">Obituarios</h1>
          <p className="text-sm text-muted-foreground">{rows.length} en total</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nuevo obituario
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Empty text="Aún no hay obituarios. Crea el primero." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Comuna</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary">{o.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.comuna ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(o.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-primary"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {isStaff && (
                        <button
                          onClick={() => remove(o.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-destructive"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ObituarioEditor({
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
    status: value?.status ?? ("draft" as ObituarioRow["status"]),
  });
  const [json, setJson] = useState({
    timeline: JSON.stringify(value?.timeline ?? [], null, 2),
    gallery: JSON.stringify(value?.gallery ?? [], null, 2),
    anecdotes: JSON.stringify(value?.anecdotes ?? [], null, 2),
    events: JSON.stringify(value?.events ?? [], null, 2),
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!supabase) return;
    if (!form.full_name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    let parsed;
    try {
      parsed = {
        timeline: JSON.parse(json.timeline || "[]"),
        gallery: JSON.parse(json.gallery || "[]"),
        anecdotes: JSON.parse(json.anecdotes || "[]"),
        events: JSON.parse(json.events || "[]"),
      };
    } catch {
      toast.error("Hay un campo avanzado (JSON) con formato inválido");
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
      ...parsed,
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
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <h1 className="font-serif text-2xl text-primary">
        {value ? "Editar obituario" : "Nuevo obituario"}
      </h1>

      <div className="mt-6 grid max-w-3xl gap-5">
        <Field label="Nombre completo *">
          <input
            className={inputCls}
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            onBlur={() => !form.slug && set("slug", slugify(form.full_name))}
          />
        </Field>
        <Field label="Slug (URL)">
          <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </Field>
        <Field label="URL de la foto">
          <input className={inputCls} value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nacimiento">
            <input className={inputCls} value={form.birth} onChange={(e) => set("birth", e.target.value)} />
          </Field>
          <Field label="Fallecimiento">
            <input className={inputCls} value={form.death} onChange={(e) => set("death", e.target.value)} />
          </Field>
        </div>
        <Field label="Comuna">
          <input className={inputCls} value={form.comuna} onChange={(e) => set("comuna", e.target.value)} />
        </Field>
        <Field label="Reseña / resumen">
          <textarea
            rows={4}
            className={inputCls}
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </Field>
        <Field label="Estado">
          <select
            className={inputCls}
            value={form.status}
            disabled={!isStaff}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
          {!isStaff && (
            <p className="mt-1 text-xs text-muted-foreground">
              Solo un administrador puede publicar o archivar.
            </p>
          )}
        </Field>

        <details className="rounded-xl border border-border bg-surface p-4">
          <summary className="cursor-pointer text-sm font-medium text-primary">
            Campos avanzados (línea de tiempo, galería, anécdotas, eventos)
          </summary>
          <div className="mt-4 grid gap-4">
            <JsonField label="Línea de tiempo" value={json.timeline} onChange={(v) => setJson((j) => ({ ...j, timeline: v }))} />
            <JsonField label="Galería" value={json.gallery} onChange={(v) => setJson((j) => ({ ...j, gallery: v }))} />
            <JsonField label="Anécdotas" value={json.anecdotes} onChange={(v) => setJson((j) => ({ ...j, anecdotes: v }))} />
            <JsonField label="Eventos (velatorio, misa, cortejo, sepultación)" value={json.events} onChange={(v) => setJson((j) => ({ ...j, events: v }))} />
          </div>
        </details>

        <div>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-primary">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function JsonField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        rows={5}
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function StatusBadge({ status }: { status: ObituarioRow["status"] }) {
  const styles: Record<ObituarioRow["status"], string> = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-primary/10 text-primary",
    archived: "bg-background text-muted-foreground line-through",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
