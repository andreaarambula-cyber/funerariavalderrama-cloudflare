import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ObituarioEditor } from "./ObituarioEditor";
import { type ObituarioRow, type ObituarioFull, type ObituarioStatus, STATUS_LABEL } from "./obituario";

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

function StatusBadge({ status }: { status: ObituarioStatus }) {
  const styles: Record<ObituarioStatus, string> = {
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
