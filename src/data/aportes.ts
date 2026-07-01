// Envío público de aportes (velas, recuerdos, anécdotas) a moderación.
import { supabase } from "@/integrations/supabase/client";

export type AporteTipo = "vela" | "recuerdo" | "anecdota";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_MB = 5;

/** Sube una imagen de recuerdo a media/aportes/ y devuelve su URL pública. */
export async function uploadAporteImage(file: File): Promise<string | null> {
  if (!supabase) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    throw new Error(`La imagen pesa demasiado. Máximo ${MAX_IMAGE_MB} MB.`);
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `aportes/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export interface AporteInput {
  obituarioId: string;
  tipo: AporteTipo;
  authorName: string;
  message?: string;
  imageUrl?: string;
  code?: string;
}

/**
 * Envía un aporte. Queda 'pending' salvo que el código coincida con el del
 * obituario (lo decide el trigger en la base de datos, no el navegador).
 * `autoApproved` es orientativo para el mensaje al usuario.
 */
export async function submitAporte(
  input: AporteInput,
): Promise<{ ok: boolean; autoApproved: boolean; error?: string }> {
  if (!supabase) return { ok: false, autoApproved: false, error: "Sin conexión" };
  const { error } = await supabase.from("condolencias").insert({
    obituario_id: input.obituarioId,
    tipo: input.tipo,
    author_name: input.authorName,
    message: input.message ?? null,
    image_url: input.imageUrl ?? null,
    submitted_code: input.code?.trim() || null,
    status: "pending",
  });
  if (error) return { ok: false, autoApproved: false, error: error.message };
  return { ok: true, autoApproved: Boolean(input.code?.trim()) };
}
