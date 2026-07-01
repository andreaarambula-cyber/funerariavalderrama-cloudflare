import { useEffect, useState, useCallback } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface CondolenciaRow {
  id: string;
  author_name: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  obituario_id: string;
  obituarios: { full_name: string } | null;
}

const FILTERS = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobadas" },
  { id: "rejected", label: "Rechazadas" },
] as const;

export function CondolenciasPanel() {
  const { isStaff } = useAuth();
  const [filter, setFilter] = useState<CondolenciaRow["status"]>("pending");
  const [rows, setRows] = useState<CondolenciaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("condolencias")
      .select("id, author_name, message, status, created_at, obituario_id, obituarios(full_name)")
      .eq("status", filter)
      .order("created_at", { ascending: false });
    if (error) toast.error("No se pudieron cargar las condolencias");
    setRows((data ?? []) as unknown as CondolenciaRow[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const moderate = async (id: string, status: "approved" | "rejected") => {
    if (!supabase) return;
    const { error } = await supabase.from("condolencias").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(status === "approved" ? "Condolencia aprobada" : "Condolencia rechazada");
    void load();
  };

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-primary">Condolencias</h1>
      <p className="text-sm text-muted-foreground">
        Revisa y aprueba los mensajes que deja el público.
      </p>

      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-12 text-center text-sm text-muted-foreground">
          No hay condolencias en esta lista.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <div>
                <p className="text-sm font-medium text-primary">{c.author_name}</p>
                <p className="text-xs text-muted-foreground">
                  En memoria de {c.obituarios?.full_name ?? "—"}
                </p>
                {c.message && <p className="mt-2 text-sm text-foreground">{c.message}</p>}
              </div>
              {isStaff && filter === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => moderate(c.id, "approved")}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Check className="h-3.5 w-3.5" /> Aprobar
                  </button>
                  <button
                    onClick={() => moderate(c.id, "rejected")}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" /> Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
