import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Las llaves son públicas (URL + anon key). La seguridad real vive en la base
// de datos (RLS) y en las Edge Functions, nunca en el frontend.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true cuando ya pegaste las llaves de Supabase en .env.local */
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
