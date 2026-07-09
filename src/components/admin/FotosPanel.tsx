import { useEffect, useRef, useState } from "react";
import { Plus, Upload, Trash2, X, Pencil, GripVertical, Check, Info, Camera, Images, Flame, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  fetchUrnas, fetchVelatorio, fetchTrabajos, saveGrupos, saveTrabajos, uploadFoto,
  SECTION_URNAS, SECTION_VELATORIO, GRUPOS_URNAS, GRUPOS_VELATORIO,
  type FotoGrupos, type TrabajoItem,
} from "@/data/siteFotos";

export function FotosPanel() {
  const { isStaff, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [urnas, setUrnas] = useState<FotoGrupos>({});
  const [velatorio, setVelatorio] = useState<FotoGrupos>({});
  const [trabajos, setTrabajos] = useState<TrabajoItem[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchUrnas(), fetchVelatorio(), fetchTrabajos()]).then(([u, v, t]) => {
      if (!alive) return;
      setUrnas(u ?? {});
      setVelatorio(v ?? {});
      setTrabajos(t ?? []);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  if (!isStaff) {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl text-primary">Fotos del sitio</h1>
        <p className="mt-2 text-sm text-muted-foreground">Solo un administrador puede editar las fotos del sitio.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div>
        <h1 className="font-serif text-2xl text-primary">Fotos del sitio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Agrega, ordena y elimina las fotos que se muestran en tu página web. Los cambios se guardan al instante.
        </p>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-primary/80">
          <b>Consejo:</b> elige primero el grupo (por ejemplo el plan de la urna) y ahí agrega o quita sus fotos.
          Usa imágenes horizontales y nítidas. Si un grupo tiene 2 o más fotos, se turnan solas cada 5 s en la web.
        </p>
      </div>

      <GaleriaAgrupada
        icon={Images} title="Fotos de urnas"
        sub="Elige el plan y administra sus fotos. Si un plan tiene 2 o más, se turnan solas cada 5 s en la web."
        section={SECTION_URNAS} folder="urnas" orden={GRUPOS_URNAS} separarAntesDe="Personalizados"
        initial={urnas} userId={user?.id ?? null}
      />

      <GaleriaAgrupada
        icon={Flame} title="Equipo de velatorio"
        sub="Las velas y cirios que se muestran en Servicios, separados por tipo."
        section={SECTION_VELATORIO} folder="velatorio" orden={GRUPOS_VELATORIO}
        initial={velatorio} userId={user?.id ?? null}
      />

      <TrabajosSection initial={trabajos} userId={user?.id ?? null} />
    </div>
  );
}

/* ---------------- GALERÍA AGRUPADA (urnas / velatorio) ---------------- */

function GaleriaAgrupada({
  icon: Icon, title, sub, section, folder, orden, initial, separarAntesDe, userId,
}: {
  icon: typeof Images; title: string; sub: string; section: string; folder: string;
  orden: readonly string[]; initial: FotoGrupos; separarAntesDe?: string; userId: string | null;
}) {
  const build = (src: FotoGrupos): FotoGrupos => Object.fromEntries(orden.map((k) => [k, src[k] ?? []]));
  const [grupos, setGrupos] = useState<FotoGrupos>(() => build(initial));
  const [activo, setActivo] = useState(orden[0]);
  const [uploading, setUploading] = useState(false);
  const dragFrom = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fotos = grupos[activo] ?? [];
  const total = Object.values(grupos).reduce((n, a) => n + a.length, 0);

  const persist = async (next: FotoGrupos) => {
    setGrupos(next);
    const { error } = await saveGrupos(section, next, userId);
    if (error) toast.error(error.message);
  };
  const setActivas = (fn: (a: string[]) => string[]) => persist({ ...grupos, [activo]: fn(grupos[activo] ?? []) });

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadFoto(f, folder));
      await persist({ ...grupos, [activo]: [...(grupos[activo] ?? []), ...urls] });
      toast.success(`${urls.length} foto${urls.length > 1 ? "s" : ""} en ${activo}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  };
  const remove = (i: number) => { void setActivas((a) => a.filter((_, idx) => idx !== i)); toast.success("Foto eliminada"); };
  const onDrop = (to: number) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from === null || from === to) return;
    void setActivas((a) => { const n = [...a]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n; });
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-xl text-primary"><Icon className="h-5 w-5 text-accent" /> {title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
        </div>
        <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary/70">{total} fotos</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {orden.map((n) => (
          <span key={n} className="flex items-center gap-2">
            {separarAntesDe === n && <span className="mx-1 hidden h-6 w-px bg-border sm:block" />}
            <button
              onClick={() => setActivo(n)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition ${
                activo === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground hover:text-primary"
              }`}
            >
              {n}
              <span className={`rounded-full px-1.5 text-[11px] ${activo === n ? "bg-white/20" : "bg-primary/5 text-primary/60"}`}>{(grupos[n] ?? []).length}</span>
            </button>
          </span>
        ))}
      </div>

      {fotos.length >= 2 ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
          <RotatingPreview fotos={fotos} />
          <div className="text-sm">
            <p className="font-medium text-primary">Así se verá en la web</p>
            <p className="mt-0.5 text-muted-foreground">Las {fotos.length} fotos de <b className="text-primary/80">{activo}</b> se turnan solas cada 5 segundos.</p>
          </div>
        </div>
      ) : fotos.length === 1 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground">
          ✨ <b className="text-primary/80">{activo}</b> muestra 1 foto fija. Sube una segunda y se turnarán solas cada 5 segundos.
        </p>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground">
          Aún no has subido fotos a <b className="text-primary/80">{activo}</b>. Mientras tanto, la web muestra las fotos actuales.
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fotos.map((src, i) => (
          <div
            key={src + i}
            draggable
            onDragStart={() => (dragFrom.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="group relative aspect-[4/3] cursor-grab overflow-hidden rounded-2xl border border-border bg-surface shadow-soft active:cursor-grabbing"
          >
            <img src={src} alt={`${activo} ${i + 1}`} className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-[11px] font-semibold text-white">{i + 1}</span>
            <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100"><GripVertical className="h-3.5 w-3.5" /></span>
            <button onClick={() => remove(i)} className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-red-600 opacity-0 shadow transition hover:bg-white group-hover:opacity-100">
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          </div>
        ))}

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 text-accent transition hover:border-accent hover:bg-accent/10 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Plus className="h-7 w-7" />}
          <span className="text-sm font-medium">{uploading ? "Subiendo…" : "Agregar fotos"}</span>
          {!uploading && <span className="px-3 text-center text-[11px] text-muted-foreground">a “{activo}”</span>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
      </div>
    </section>
  );
}

function RotatingPreview({ fotos }: { fotos: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    if (fotos.length < 2) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % fotos.length), 5000);
    return () => window.clearInterval(t);
  }, [fotos]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/5 sm:w-56">
      {fotos.map((src, idx) => (
        <img key={src + idx} src={src} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`} />
      ))}
      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">{i + 1}/{fotos.length} · cada 5 s</span>
    </div>
  );
}

/* ---------------- SECCIÓN TRABAJOS ---------------- */

function TrabajosSection({ initial, userId }: { initial: TrabajoItem[]; userId: string | null }) {
  const [items, setItems] = useState<TrabajoItem[]>(initial);
  const [editando, setEditando] = useState<{ item: TrabajoItem; idx: number } | "new" | null>(null);

  const persist = async (next: TrabajoItem[]) => {
    setItems(next);
    const { error } = await saveTrabajos(next, userId);
    if (error) toast.error(error.message);
  };
  const remove = (idx: number) => { void persist(items.filter((_, i) => i !== idx)); toast.success("Trabajo eliminado"); };
  const guardar = (data: TrabajoItem) => {
    if (editando && editando !== "new") {
      void persist(items.map((t, i) => (i === editando.idx ? data : t)));
      toast.success("Trabajo actualizado");
    } else {
      void persist([...items, data]);
      toast.success("Trabajo agregado");
    }
    setEditando(null);
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-xl text-primary"><Camera className="h-5 w-5 text-accent" /> Nuestros trabajos</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Los servicios que aparecen en “Servicios que hemos realizado”. Puedes agregar nuevos o editar los existentes.</p>
        </div>
        <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary/70">{items.length} en total</span>
      </div>

      {items.length === 0 && editando === null && (
        <p className="mt-4 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground">
          Aún no has agregado trabajos aquí. Mientras tanto, la web muestra los actuales.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, idx) => (
          <div key={idx} className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <div className="relative aspect-[16/11] overflow-hidden">
              <img src={t.cover} alt={t.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{t.tag}</p>
                <p className="font-serif text-lg leading-tight text-white">{t.title}</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => setEditando({ item: t, idx })} className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-primary shadow hover:bg-white"><Pencil className="h-3.5 w-3.5" /> Editar</button>
                <button onClick={() => remove(idx)} className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 shadow hover:bg-white"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="line-clamp-2 px-4 py-3 text-sm text-muted-foreground">{t.description}</p>
          </div>
        ))}

        {editando === null && (
          <button onClick={() => setEditando("new")} className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 text-accent transition hover:border-accent hover:bg-accent/10">
            <Plus className="h-8 w-8" />
            <span className="font-medium">Agregar un trabajo</span>
            <span className="px-6 text-center text-[11px] text-muted-foreground">Sube una foto, ponle nombre y una breve descripción</span>
          </button>
        )}
      </div>

      {editando !== null && (
        <TrabajoForm inicial={editando === "new" ? null : editando.item} onCancel={() => setEditando(null)} onSave={guardar} />
      )}
    </section>
  );
}

function TrabajoForm({ inicial, onCancel, onSave }: { inicial: TrabajoItem | null; onCancel: () => void; onSave: (t: TrabajoItem) => void }) {
  const [cover, setCover] = useState<string>(inicial?.cover ?? "");
  const [title, setTitle] = useState(inicial?.title ?? "");
  const [tag, setTag] = useState(inicial?.tag ?? "");
  const [description, setDescription] = useState(inicial?.description ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const editando = !!inicial;
  const valid = cover && title.trim().length > 1;

  const pickCover = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      setCover(await uploadFoto(file, "trabajos"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center gap-2"><Camera className="h-5 w-5 text-accent" /><h3 className="font-serif text-lg text-primary">{editando ? "Editar trabajo" : "Nuevo trabajo"}</h3></div>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,260px)_1fr]">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Foto principal *</label>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="relative flex aspect-[16/11] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 text-accent transition hover:border-accent hover:bg-accent/10 disabled:opacity-60">
            {cover ? (
              <>
                <img src={cover} alt="Vista previa" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-primary shadow">{uploading ? "Subiendo…" : "Cambiar foto"}</span>
              </>
            ) : uploading ? (
              <><Loader2 className="h-6 w-6 animate-spin" /><span className="text-sm font-medium">Subiendo…</span></>
            ) : (
              <><Upload className="h-6 w-6" /><span className="text-sm font-medium">Subir foto</span></>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void pickCover(e.target.files?.[0]); e.target.value = ""; }} />
        </div>

        <div className="space-y-4">
          <Field label="Nombre *" value={title} onChange={setTitle} placeholder="Ej: Don Luis Jaime Pezo Astudillo" />
          <Field label="Recorrido" value={tag} onChange={setTag} placeholder="Ej: Cortejo · Hualpén a Talcahuano" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Descripción</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Una frase breve sobre el servicio realizado." className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button disabled={!valid || uploading} onClick={() => valid && onSave({ cover, title, tag, description })} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
          <Check className="h-4 w-4" /> {editando ? "Guardar cambios" : "Guardar trabajo"}
        </button>
        <button onClick={onCancel} className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary">Cancelar</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-primary">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent" />
    </div>
  );
}
