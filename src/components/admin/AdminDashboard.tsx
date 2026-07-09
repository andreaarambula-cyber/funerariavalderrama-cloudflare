import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Heart, Images, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ObituariosPanel } from "./ObituariosPanel";
import { CondolenciasPanel } from "./CondolenciasPanel";
import { FotosPanel } from "./FotosPanel";

type Section = "obituarios" | "condolencias" | "fotos";

const NAV: { id: Section; label: string; icon: typeof FileText }[] = [
  { id: "obituarios", label: "Obituarios", icon: FileText },
  { id: "condolencias", label: "Moderación", icon: Heart },
  { id: "fotos", label: "Fotos del sitio", icon: Images },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { session, loading, roles, configured, user, signOut } = useAuth();
  const [section, setSection] = useState<Section>("obituarios");

  useEffect(() => {
    if (configured && !loading && !session) navigate({ to: "/admin/login" });
  }, [configured, loading, session, navigate]);

  if (!configured) {
    return (
      <CenteredCard>
        <h1 className="font-serif text-xl text-primary">Backend no configurado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Falta pegar las llaves de Supabase en <code>.env.local</code> y reiniciar
          el servidor.
        </p>
      </CenteredCard>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return null; // redirigiendo a login

  // Sesión iniciada pero sin ningún rol asignado: no entra.
  if (roles.length === 0) {
    return (
      <CenteredCard>
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-3 font-serif text-xl text-primary">No tienes permisos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cuenta no tiene acceso al panel. Pide a un administrador que te
          asigne un rol.
        </p>
        <button
          onClick={() => signOut()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </CenteredCard>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70">
            Panel
          </p>
          <p className="mt-1 font-serif text-lg text-primary">Valderrama</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-2 text-xs text-muted-foreground" title={user?.email ?? ""}>
            {user?.email}
          </p>
          <p className="px-2 text-[11px] uppercase tracking-wider text-accent-foreground/70">
            {roles.join(" · ")}
          </p>
          <button
            onClick={() => signOut()}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-background hover:text-primary"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto">
        {section === "obituarios" && <ObituariosPanel />}
        {section === "condolencias" && <CondolenciasPanel />}
        {section === "fotos" && <FotosPanel />}
      </main>
    </div>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
        {children}
      </div>
    </div>
  );
}
