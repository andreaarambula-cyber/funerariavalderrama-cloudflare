// Tipos y utilidades compartidas del editor de obituarios.

export type ObituarioStatus = "draft" | "published" | "archived";

export interface ObituarioRow {
  id: string;
  slug: string;
  full_name: string;
  status: ObituarioStatus;
  comuna: string | null;
  updated_at: string;
}

export interface ObituarioFull extends ObituarioRow {
  photo_url: string | null;
  birth: string | null;
  death: string | null;
  summary: string | null;
  timeline: unknown;
  gallery: unknown;
  anecdotes: unknown;
  events: unknown;
  created_by: string | null;
}

/** Fila genérica de una sección repetible (galería, anécdotas, etc.) */
export type Item = Record<string, string>;

export const STATUS_LABEL: Record<ObituarioStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export const EVENT_TYPES = ["Velatorio", "Misa", "Cortejo", "Sepultación"];

/** Convierte un valor jsonb en un arreglo de objetos con strings (para los formularios). */
export function asItems(value: unknown, keys: string[]): Item[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const obj = (raw ?? {}) as Record<string, unknown>;
    const item: Item = {};
    keys.forEach((k) => {
      item[k] = obj[k] == null ? "" : String(obj[k]);
    });
    return item;
  });
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
