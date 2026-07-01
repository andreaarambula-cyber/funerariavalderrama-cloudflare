// Acceso a los obituarios PUBLICADOS desde Supabase para el sitio público.
// El público solo puede leer status = 'published' (lo garantiza RLS).
import { supabase } from "@/integrations/supabase/client";
import type {
  Obituary,
  GalleryItem,
  Anecdote,
  FarewellEvent,
  TimelineItem,
  Candle,
} from "@/data/obituaries";

export interface ObituaryListItem {
  slug: string;
  fullName: string;
  photo: string;
  birth: string;
  death: string;
  comuna: string;
}

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "Hace instantes";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `Hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-CL");
}

interface Row {
  id: string;
  slug: string;
  full_name: string;
  photo_url: string | null;
  birth: string | null;
  death: string | null;
  comuna: string | null;
  summary: string | null;
  timeline: unknown;
  gallery: unknown;
  anecdotes: unknown;
  events: unknown;
}

const toListItem = (r: Row): ObituaryListItem => ({
  slug: r.slug,
  fullName: r.full_name,
  photo: r.photo_url ?? "",
  birth: r.birth ?? "",
  death: r.death ?? "",
  comuna: r.comuna ?? "",
});

/** Lista de obituarios publicados (para /obituarios). */
export async function fetchPublishedObituarios(): Promise<ObituaryListItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("obituarios")
    .select("id, slug, full_name, photo_url, birth, death, comuna, summary, timeline, gallery, anecdotes, events")
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Error cargando obituarios:", error.message);
    return [];
  }
  return (data as Row[]).map(toListItem);
}

interface AporteRow {
  tipo: "vela" | "recuerdo" | "anecdota";
  author_name: string;
  message: string | null;
  image_url: string | null;
  created_at: string;
}

/** Un obituario completo por slug + sus aportes aprobados (velas/recuerdos/anécdotas). */
export async function fetchObituarioBySlug(
  slug: string,
): Promise<(Obituary & { id: string; others: ObituaryListItem[] }) | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("obituarios")
    .select("id, slug, full_name, photo_url, birth, death, comuna, summary, timeline, gallery, anecdotes, events")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const r = data as Row;

  const { data: cond } = await supabase
    .from("condolencias")
    .select("tipo, author_name, message, image_url, created_at")
    .eq("obituario_id", r.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  const aportes = (cond ?? []) as AporteRow[];

  // Velas aprobadas.
  const candles: Candle[] = aportes
    .filter((a) => a.tipo === "vela")
    .map((a) => ({
      name: a.author_name,
      message: a.message ?? undefined,
      timeAgo: relativeTime(a.created_at),
    }));

  // Recuerdos aprobados del público, sumados a la galería del obituario.
  const publicGallery: GalleryItem[] = aportes
    .filter((a) => a.tipo === "recuerdo" && a.image_url)
    .map((a) => ({ src: a.image_url as string, caption: a.message ?? "", author: a.author_name }));

  // Anécdotas aprobadas del público, sumadas a las del obituario.
  const publicAnecdotes: Anecdote[] = aportes
    .filter((a) => a.tipo === "anecdota")
    .map((a) => ({ author: a.author_name, text: a.message ?? "" }));

  const others = (await fetchPublishedObituarios()).filter((o) => o.slug !== slug);

  return {
    id: r.id,
    slug: r.slug,
    fullName: r.full_name,
    photo: r.photo_url ?? "",
    birth: r.birth ?? "",
    death: r.death ?? "",
    comuna: r.comuna ?? "",
    summary: r.summary ?? "",
    timeline: arr<TimelineItem>(r.timeline),
    gallery: [...arr<GalleryItem>(r.gallery), ...publicGallery],
    anecdotes: [...arr<Anecdote>(r.anecdotes), ...publicAnecdotes],
    candles,
    events: arr<FarewellEvent>(r.events),
    others,
  };
}
