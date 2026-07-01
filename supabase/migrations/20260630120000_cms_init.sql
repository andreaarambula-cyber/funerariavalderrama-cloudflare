-- =====================================================================
-- CMS Funeraria Valderrama — esquema inicial + seguridad
-- Roles: owner / admin / editor / viewer
-- Seguridad real en la base de datos: RLS en TODAS las tablas,
-- triggers que impedimos eludir desde el frontend, y audit logs.
-- =====================================================================

-- ---------- Tipos ----------
do $$ begin
  create type public.app_role as enum ('owner', 'admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

-- ---------- Tablas ----------

-- Perfiles (1:1 con auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Roles por usuario (los roles NUNCA van en profiles, para evitar escalada de privilegios)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Obituarios (memoriales) — modelo rico de FV
create table if not exists public.obituarios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  photo_url text,
  birth text,
  death text,
  comuna text,
  summary text,
  timeline jsonb not null default '[]'::jsonb,   -- [{year,title,description}]
  gallery jsonb not null default '[]'::jsonb,    -- [{src,caption,author}]
  anecdotes jsonb not null default '[]'::jsonb,  -- [{author,text}]
  events jsonb not null default '[]'::jsonb,     -- [{type,date,address,mapsQuery,isoStart,isoEnd}]
  status text not null default 'draft' check (status in ('draft','published','archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

-- Condolencias / velitas (moderadas)
create table if not exists public.condolencias (
  id uuid primary key default gen_random_uuid(),
  obituario_id uuid not null references public.obituarios(id) on delete cascade,
  author_name text not null,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- Contenido simple del sitio (hero, nosotros, contacto, etc.)
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,
  title text,
  body text,
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Versiones inmutables (snapshot al publicar)
create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  obituario_id uuid references public.obituarios(id) on delete cascade,
  version integer not null default 1,
  snapshot jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Bitácora de auditoría (solo se escribe desde el servidor / triggers)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity text,
  entity_id uuid,
  actor uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Funciones de seguridad
-- =====================================================================

-- ¿El usuario tiene este rol? SECURITY DEFINER + STABLE + search_path fijo
-- para evitar recursión en las políticas RLS.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- ¿Es staff con permiso de gestión (admin u owner)?
create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('owner','admin')
  );
$$;

-- updated_at automático
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Solo admin/owner pueden publicar o archivar. Un editor jamás puede
-- cambiar el estado, aunque manipule la petición desde el navegador.
create or replace function public.enforce_obituario_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  -- auth.uid() nulo = operación de servidor/seed (confiable). Los usuarios
  -- autenticados sin rol de staff no pueden publicar ni archivar.
  if auth.uid() is not null and not public.is_staff(auth.uid()) then
    if tg_op = 'INSERT' and new.status is distinct from 'draft' then
      raise exception 'Solo admin u owner pueden publicar o archivar';
    elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
      raise exception 'Solo admin u owner pueden cambiar el estado';
    end if;
  end if;
  return new;
end;
$$;

-- Cualquier visitante puede enviar una condolencia, pero SIEMPRE entra
-- como 'pending'. Solo el staff puede crear con otro estado.
create or replace function public.force_condolencia_pending()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_staff(auth.uid()) then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

-- Auditoría automática de cambios en obituarios
create or replace function public.audit_obituario()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_logs (action, entity, entity_id, actor, details)
  values (
    lower(tg_op),
    'obituario',
    coalesce(new.id, old.id),
    auth.uid(),
    jsonb_build_object(
      'slug', coalesce(new.slug, old.slug),
      'status_old', old.status,
      'status_new', new.status
    )
  );
  return coalesce(new, old);
end;
$$;

-- =====================================================================
-- Triggers
-- =====================================================================
drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_obituarios_updated on public.obituarios;
create trigger trg_obituarios_updated before update on public.obituarios
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_site_content_updated on public.site_content;
create trigger trg_site_content_updated before update on public.site_content
  for each row execute function public.update_updated_at_column();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_obituario_status on public.obituarios;
create trigger trg_obituario_status before insert or update on public.obituarios
  for each row execute function public.enforce_obituario_status();

drop trigger if exists trg_condolencia_pending on public.condolencias;
create trigger trg_condolencia_pending before insert on public.condolencias
  for each row execute function public.force_condolencia_pending();

drop trigger if exists trg_audit_obituario on public.obituarios;
create trigger trg_audit_obituario after insert or update or delete on public.obituarios
  for each row execute function public.audit_obituario();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles        enable row level security;
alter table public.user_roles      enable row level security;
alter table public.obituarios      enable row level security;
alter table public.condolencias    enable row level security;
alter table public.site_content    enable row level security;
alter table public.content_versions enable row level security;
alter table public.audit_logs      enable row level security;

-- ---------- profiles ----------
drop policy if exists "perfil propio o staff" on public.profiles;
create policy "perfil propio o staff" on public.profiles
  for select to authenticated
  using (auth.uid() = user_id or public.is_staff(auth.uid()));
drop policy if exists "actualizar perfil propio" on public.profiles;
create policy "actualizar perfil propio" on public.profiles
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- user_roles ----------
drop policy if exists "ver roles propios o staff" on public.user_roles;
create policy "ver roles propios o staff" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id or public.is_staff(auth.uid()));
-- Solo el owner gestiona roles.
drop policy if exists "owner gestiona roles" on public.user_roles;
create policy "owner gestiona roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner'))
  with check (public.has_role(auth.uid(), 'owner'));

-- ---------- obituarios ----------
drop policy if exists "publico ve obituarios publicados" on public.obituarios;
create policy "publico ve obituarios publicados" on public.obituarios
  for select using (status = 'published');
drop policy if exists "staff y editores ven todo" on public.obituarios;
create policy "staff y editores ven todo" on public.obituarios
  for select to authenticated using (true);
drop policy if exists "editores y staff crean" on public.obituarios;
create policy "editores y staff crean" on public.obituarios
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (public.is_staff(auth.uid()) or public.has_role(auth.uid(), 'editor'))
  );
drop policy if exists "staff edita todo; editor solo lo suyo" on public.obituarios;
create policy "staff edita todo; editor solo lo suyo" on public.obituarios
  for update to authenticated
  using (public.is_staff(auth.uid())
         or (public.has_role(auth.uid(), 'editor') and created_by = auth.uid()))
  with check (updated_by = auth.uid()
         and (public.is_staff(auth.uid())
              or (public.has_role(auth.uid(), 'editor') and created_by = auth.uid())));
drop policy if exists "solo staff elimina obituarios" on public.obituarios;
create policy "solo staff elimina obituarios" on public.obituarios
  for delete to authenticated using (public.is_staff(auth.uid()));

-- ---------- condolencias ----------
drop policy if exists "publico ve condolencias aprobadas" on public.condolencias;
create policy "publico ve condolencias aprobadas" on public.condolencias
  for select using (status = 'approved');
drop policy if exists "staff ve todas las condolencias" on public.condolencias;
create policy "staff ve todas las condolencias" on public.condolencias
  for select to authenticated using (public.is_staff(auth.uid()));
-- Cualquiera (incluso anónimo) puede enviar; el trigger fuerza 'pending'.
drop policy if exists "cualquiera envia condolencia" on public.condolencias;
create policy "cualquiera envia condolencia" on public.condolencias
  for insert to anon, authenticated
  with check (status = 'pending' or public.is_staff(auth.uid()));
drop policy if exists "staff modera condolencias" on public.condolencias;
create policy "staff modera condolencias" on public.condolencias
  for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
drop policy if exists "staff elimina condolencias" on public.condolencias;
create policy "staff elimina condolencias" on public.condolencias
  for delete to authenticated using (public.is_staff(auth.uid()));

-- ---------- site_content ----------
drop policy if exists "publico ve contenido activo" on public.site_content;
create policy "publico ve contenido activo" on public.site_content
  for select using (is_active = true);
drop policy if exists "autenticados ven todo el contenido" on public.site_content;
create policy "autenticados ven todo el contenido" on public.site_content
  for select to authenticated using (true);
drop policy if exists "solo staff escribe contenido" on public.site_content;
create policy "solo staff escribe contenido" on public.site_content
  for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ---------- content_versions (solo lectura staff; escritura por servidor) ----------
drop policy if exists "staff lee versiones" on public.content_versions;
create policy "staff lee versiones" on public.content_versions
  for select to authenticated using (public.is_staff(auth.uid()));

-- ---------- audit_logs (solo lectura staff; escritura por triggers/servidor) ----------
drop policy if exists "staff lee auditoria" on public.audit_logs;
create policy "staff lee auditoria" on public.audit_logs
  for select to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- Storage: fotos de obituarios
-- Bucket público para fotos publicadas; bucket privado para borradores.
-- =====================================================================
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('media-drafts', 'media-drafts', false)
  on conflict (id) do nothing;

create policy "lectura publica media" on storage.objects
  for select using (bucket_id = 'media');
create policy "staff sube media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media','media-drafts') and public.is_staff(auth.uid()));
create policy "staff edita media" on storage.objects
  for update to authenticated
  using (bucket_id in ('media','media-drafts') and public.is_staff(auth.uid()));
create policy "staff borra media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media','media-drafts') and public.is_staff(auth.uid()));
create policy "staff lee borradores media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media-drafts' and public.is_staff(auth.uid()));

-- =====================================================================
-- BOOTSTRAP (ejecutar UNA vez, después de crear tu usuario en
-- Authentication -> Users en el panel de Supabase):
--
--   insert into public.user_roles (user_id, role)
--   select id, 'owner' from auth.users where email = 'TU_CORREO_AQUI'
--   on conflict do nothing;
--
-- Eso te convierte en owner (control total). Los demás usuarios se
-- agregan luego desde el panel /admin.
-- =====================================================================
