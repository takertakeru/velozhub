-- VelozHub: fuel level on the shared vehicle
-- The current driver (anyone in the household) can record how much fuel is left,
-- shown as a Toyota-style gauge on Home. Stored as a 0-100 percentage.

alter table public.vehicles
  add column fuel_level smallint not null default 50
    check (fuel_level between 0 and 100),
  add column fuel_updated_at timestamptz,
  add column fuel_updated_by uuid references public.profiles (id) on delete set null;

-- Members may update their household's vehicle (the fuel reading).
create policy "vehicles update by members"
  on public.vehicles for update
  using (household_id = public.current_household_id())
  with check (household_id = public.current_household_id());

-- Live updates so every device sees the new gauge level immediately.
alter publication supabase_realtime add table public.vehicles;
