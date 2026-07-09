import { supabase } from "@/integrations/supabase/client";

/**
 * Fotos editables del sitio, guardadas en la tabla existente `site_content`
 * (columna `metadata` jsonb) — sin necesidad de tablas nuevas. Las fotos se
 * suben al bucket público `media`, igual que las del obituario.
 *
 * Secciones:
 *  - fotos_urnas      → { grupos: { "Raíces": [url…], … "Personalizados": [url…] } }
 *  - fotos_velatorio  → { grupos: { "Cirios tradicionales": [url…], "Tulipa": […], "LED": […] } }
 *  - fotos_trabajos   → { items: [{ cover, title, tag, description }] }
 *
 * Si una sección no tiene datos, el sitio público usa sus fotos actuales
 * (respaldo), así nada se rompe hasta que el cliente suba las suyas.
 */

export type FotoGrupos = Record<string, string[]>;
export type TrabajoItem = { cover: string; title: string; tag: string; description: string };

export const SECTION_URNAS = "fotos_urnas";
export const SECTION_VELATORIO = "fotos_velatorio";
export const SECTION_TRABAJOS = "fotos_trabajos";

// Orden y nombres de los grupos — deben calzar con el sitio público.
export const GRUPOS_URNAS = ["Raíces", "Legado", "Gratitud", "Sobredimensionado", "Exhumación", "Personalizados"] as const;
export const GRUPOS_VELATORIO = ["Cirios tradicionales", "Tulipa", "LED"] as const;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_IMAGE_MB = 5;

async function fetchGrupos(section: string): Promise<FotoGrupos | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_content")
    .select("metadata")
    .eq("section", section)
    .maybeSingle();
  if (error || !data) return null;
  const grupos = (data.metadata as { grupos?: FotoGrupos } | null)?.grupos;
  return grupos && typeof grupos === "object" ? grupos : null;
}

export const fetchUrnas = () => fetchGrupos(SECTION_URNAS);
export const fetchVelatorio = () => fetchGrupos(SECTION_VELATORIO);

export async function fetchTrabajos(): Promise<TrabajoItem[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_content")
    .select("metadata")
    .eq("section", SECTION_TRABAJOS)
    .maybeSingle();
  if (error || !data) return null;
  const items = (data.metadata as { items?: TrabajoItem[] } | null)?.items;
  return Array.isArray(items) ? items : null;
}

export async function saveGrupos(section: string, grupos: FotoGrupos, userId: string | null) {
  if (!supabase) return { error: new Error("Sin conexión a Supabase.") };
  return supabase
    .from("site_content")
    .upsert({ section, metadata: { grupos }, is_active: true, updated_by: userId }, { onConflict: "section" });
}

export async function saveTrabajos(items: TrabajoItem[], userId: string | null) {
  if (!supabase) return { error: new Error("Sin conexión a Supabase.") };
  return supabase
    .from("site_content")
    .upsert({ section: SECTION_TRABAJOS, metadata: { items }, is_active: true, updated_by: userId }, { onConflict: "section" });
}

/** Sube un archivo al bucket `media` (carpeta por sección) y devuelve su URL pública. */
export async function uploadFoto(file: File, folder: string): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`La imagen pesa demasiado. Máximo ${MAX_IMAGE_MB} MB.`);
  if (!supabase) throw new Error("Sin conexión a Supabase.");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
