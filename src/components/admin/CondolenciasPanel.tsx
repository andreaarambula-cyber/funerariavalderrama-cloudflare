import { useEffect, useState, useCallback } from "react";
import { Check, X, Flame, ImageIcon, Quote } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Tipo = "vela" | "recuerdo" | "anecdota";

interface AporteRow {
  id: string;
  tipo: Tipo;
  author_name: string;
  message: string | null;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  obituario_id: string;
  obituarios: { full_name: string } | null;
}

const STATUS_FILTERS = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobados" },
  { id: "rejected", label: "Rechazados" },
] as const;

const TIPO_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "vela", label: "Velas" },
  { id: "recuerdo", label: "Recuerdos" },
  { id: "anecdota", label: "Anécdotas" },
] as const;

const TIPO_META: Record<Tipo, { label: string; icon: typeof Flame }> = {
  vela: { label: "Vela", icon: Flame },
  recuerdo: { label: "Recuerdo", icon: ImageIcon },
  anecdota: { label: "Anécdota", icon: Quote },
};

export function CondolenciasPanel() {
  const { isStaff } = useAuth();
  const [status, setStatus] = useState<AporteRow["status"]>("pending");
  const [tipo, setTipo] = useState<(typeof TIPO_FILTERS)[number]["id"]>("todos");
  const [rows, setRows] = useState<AporteRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let query = supabase
      .from("condolencias")
      .select("id, tipo, author_name, message, image_url, status, created_at, obituario_id, obituarios(full_name)")
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (tipo !== "todos") query = query.eq("tipo", tipo);
    const { data, error } = await query;
    if (error) toast.error("No se pudieron cargar los aportes");
    setRows((data ?? []) as unknown as AporteRow[]);
    setLoading(false);
  }, [status, tipo]);

  useEffect(() => {
    void load();
  }, [load]);

  const moderate = async (id: string, next: "approved" | "rejected") => {
    if (!supabase) return;
    const { error } = await supabase.from("condolencias").update({ status: next }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(next === "approved" ? "Aporte aprobado" : "Aporte rechazado");
    void load();
  };

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-primary">Moderación</h1>
      <p className="text-sm text-muted-foreground">
        Aprueba o rechaza las velas, recuerdos y anécdotas que deja el público.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatus(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              status === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TIPO_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTipo(f.id)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              tipo === f.id
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-primary"
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
          No hay aportes en esta lista.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((c) => {
            const Meta = TIPO_META[c.tipo] ?? TIPO_META.vela;
            const Icon = Meta.icon;
            return (
              <div
                key={c.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft"
              >
                <div className="flex gap-3">
                  {c.tipo === "recuerdo" && c.image_url && (
                    <img
                      src={c.image_url}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                    />
                  )}
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <Icon className="h-3 w-3" /> {Meta.label}
                    </span>
                    <p className="mt-1 text-sm font-medium text-primary">{c.author_name}</p>
                    <p className="text-xs text-muted-foreground">
                      En memoria de {c.obituarios?.full_name ?? "—"}
                    </p>
                    {c.message && <p className="mt-2 text-sm text-foreground">{c.message}</p>}
                  </div>
                </div>
                {isStaff && status === "pending" && (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
