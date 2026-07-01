-- =====================================================================
-- Moderación de aportes del público: velas, recuerdos y anécdotas.
-- Con código de auto-aprobación por obituario.
-- Re-ejecutable.
-- =====================================================================

-- 1) La tabla de "condolencias" ahora guarda los 3 tipos de aporte.
alter table public.condolencias
  add column if not exists tipo text not null default 'vela'
    check (tipo in ('vela', 'recuerdo', 'anecdota')),
  add column if not exists image_url text,
  add column if not exists submitted_code text;

-- 2) Códigos de auto-aprobación por obituario (SECRETOS: solo el staff los ve).
create table if not exists public.obituario_codes (
  obituario_id uuid primary key references public.obituarios(id) on delete cascade,
  code text not null,
  updated_at timestamptz not null default now()
);
alter table public.obituario_codes enable row level security;
drop policy if exists "staff gestiona codigos" on public.obituario_codes;
create policy "staff gestiona codigos" on public.obituario_codes
  for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- 3) Trigger de estado: el público entra 'pending'; con el código correcto,
--    'approved' automáticamente. El staff conserva el estado que elija.
create or replace function public.force_condolencia_pending()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_code text;
begin
  if auth.uid() is not null and public.is_staff(auth.uid()) then
    return new; -- staff decide el estado
  end if;

  select code into v_code from public.obituario_codes
  where obituario_id = new.obituario_id;

  if new.submitted_code is not null and v_code is not null
     and length(trim(new.submitted_code)) > 0
     and lower(trim(new.submitted_code)) = lower(trim(v_code)) then
    new.status := 'approved';
  else
    new.status := 'pending';
  end if;
  new.submitted_code := null; -- nunca se guarda el código enviado
  return new;
end;
$$;

-- 4) La política de inserción solo permite crear; el ESTADO lo fija el trigger.
drop policy if exists "cualquiera envia condolencia" on public.condolencias;
create policy "cualquiera envia condolencia" on public.condolencias
  for insert to anon, authenticated
  with check (true);

-- 5) El público puede subir imágenes de sus recuerdos SOLO a la carpeta
--    media/aportes/ (lectura pública ya permitida).
drop policy if exists "publico sube aportes" on storage.objects;
create policy "publico sube aportes" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'aportes');

-- 6) Corrige las velas de EJEMPLO que quedaron pendientes al sembrarlas.
update public.condolencias set status = 'approved'
where status = 'pending'
  and tipo = 'vela'
  and author_name in ('Marcela P.', 'Familia Rojas', 'Don Sergio', 'Carmen L.', 'Pablo M.');
