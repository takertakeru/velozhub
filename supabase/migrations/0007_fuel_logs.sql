-- VelozHub: fuel fill-up history (peso spend log)
-- Beside the live fuel gauge (0003_fuel.sql), the household keeps a running log
-- of every fill-up: how much was spent in PHP and at which station. The Veloz
-- runs on unleaded, so fuel_type defaults to that. created_at is the moment the
-- entry was logged, which is what the history screen shows. The gauge percentage
-- on public.vehicles is a separate, current-state reading; this table is the
-- append-only ledger the analytics are summed from.

create table public.fuel_logs (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles (id) on delete cascade,
  household_id  uuid not null references public.households (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete set null,
  amount_php    numeric(10, 2) not null check (amount_php > 0),
  brand         text not null check (brand in (
                  'Petron', 'Shell', 'Caltex', 'Phoenix',
                  'Seaoil', 'Unioil', 'Jetti', 'Others'
                )),
  fuel_type     text not null default 'unleaded',
  created_at    timestamptz not null default now()
);
create index fuel_logs_household_id_idx on public.fuel_logs (household_id);
-- The history screen reads newest-first; index the sort it always uses.
create index fuel_logs_created_at_idx on public.fuel_logs (household_id, created_at desc);

alter table public.fuel_logs enable row level security;

-- Read: anyone in the household sees the shared car's fuel ledger.
create policy "fuel_logs readable by members"
  on public.fuel_logs for select
  using (household_id = public.current_household_id());

-- Insert: only as yourself, only into your own household.
create policy "fuel_logs insert own"
  on public.fuel_logs for insert
  with check (
    household_id = public.current_household_id()
    and user_id = auth.uid()
  );

-- Edit / delete a mistaken entry: the person who logged it, or an admin.
create policy "fuel_logs update own or admin"
  on public.fuel_logs for update
  using (
    household_id = public.current_household_id()
    and (user_id = auth.uid() or public.is_admin())
  )
  with check (household_id = public.current_household_id());

create policy "fuel_logs delete own or admin"
  on public.fuel_logs for delete
  using (
    household_id = public.current_household_id()
    and (user_id = auth.uid() or public.is_admin())
  );

-- Live updates so a fill-up logged on one phone appears on every other.
alter publication supabase_realtime add table public.fuel_logs;
