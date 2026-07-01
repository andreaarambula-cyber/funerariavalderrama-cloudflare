import { useEffect, useState, useCallback } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface ContentRow {
  id: string;
  section: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  is_active: boolean;
}

// Secciones simples editables del sitio. Si no existen en la BD, se crean
// al guardar (upsert por `section`).
const SECTIONS = [
  { key: "hero", label: "Portada (hero)" },
  { key: "nosotros", label: "Nosotros" },
  { key: "contacto", label: "Contacto" },
];

export function ContenidoPanel() {
  const { isStaff, user } = useAuth();
  const [rows, setRows] = useState<Record<string, ContentRow | undefined>>({});
  const [drafts, setDrafts] = useState<Record<string, { title: string; body: string; image_url: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("site_content").select("*");
    const map: Record<string, ContentRow> = {};
    const d: Record<string, { title: string; body: string; image_url: string }> = {};
    (data ?? []).forEach((r) => {
      const row = r as ContentRow;
      map[row.section] = row;
    });
    SECTIONS.forEach((s) => {
      const row = map[s.key];
      d[s.key] = {
        title: row?.title ?? "",
        body: row?.body ?? "",
        image_url: row?.image_url ?? "",
      };
    });
    setRows(map);
    setDrafts(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (key: string) => {
    if (!supabase) return;
    setSavingKey(key);
    const d = drafts[key];
    const { error } = await supabase.from("site_content").upsert(
      {
        section: key,
        title: d.title || null,
        body: d.body || null,
        image_url: d.image_url || null,
        updated_by: user?.id ?? null,
      },
      { onConflict: "section" },
    );
    setSavingKey(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Sección guardada");
    void load();
  };

  if (!isStaff) {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl text-primary">Textos del sitio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo un administrador puede editar los textos del sitio.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-primary">Textos del sitio</h1>
      <p className="text-sm text-muted-foreground">
        Edita los textos e imágenes de las secciones principales.
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="mt-6 max-w-3xl space-y-5">
          {SECTIONS.map((s) => {
            const d = drafts[s.key] ?? { title: "", body: "", image_url: "" };
            return (
              <div key={s.key} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-medium text-primary">{s.label}</h2>
                  {rows[s.key] ? null : (
                    <span className="text-xs text-muted-foreground">(se creará al guardar)</span>
                  )}
                </div>
                <div className="grid gap-3">
                  <input
                    className={inputCls}
                    placeholder="Título"
                    value={d.title}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s.key]: { ...d, title: e.target.value } }))
                    }
                  />
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Texto"
                    value={d.body}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s.key]: { ...d, body: e.target.value } }))
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="URL de imagen (opcional)"
                    value={d.image_url}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s.key]: { ...d, image_url: e.target.value } }))
                    }
                  />
                  <div>
                    <button
                      onClick={() => save(s.key)}
                      disabled={savingKey === s.key}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" /> {savingKey === s.key ? "Guardando…" : "Guardar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
