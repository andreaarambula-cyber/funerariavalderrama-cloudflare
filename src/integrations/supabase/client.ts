import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Las llaves son PÚBLICAS (URL + anon/publishable key): viajan en el sitio de
// todos modos. La seguridad real vive en la base de datos (RLS) y en las Edge
// Functions, nunca en el frontend. Por eso se pueden dejar como respaldo aquí,
// para que producción funcione sin configurar variables de entorno.
const FALLBACK_URL = "https://scbqoblotvxwrzzpgiic.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_VzWyo5ugR-mE9R5Hh72ROw_paNNIICp";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Cliente de Supabase. Es `null` mientras no haya llaves configuradas, para
 * que el sitio público siga compilando y funcionando sin backend.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
