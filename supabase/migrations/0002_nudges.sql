-- VelozHub: request-the-car nudges
-- A lightweight in-app notification a driver can send to whoever currently has
-- the car ("can I have it next?"). Delivered live via Realtime; the row is also
-- the hook a future web-push sender can read from.

create table public.nudges (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete set null,
  from_user     uuid not null references public.profiles (id) on delete cascade,
  to_user       uuid not null references public.profiles (id) on delete cascade,
  message       text,
  seen          boolean not null default false,
  created_at    timestamptz not null default now()
);
create index nudges_to_user_idx on public.nudges (to_user, created_at desc);
create index nudges_household_id_idx on public.nudges (household_id);

alter table public.nudges enable row level security;

-- Read: anyone in the household. The family is tiny, and household-wide reads
-- keep the Realtime subscription simple.
create policy "nudges readable by members"
  on public.nudges for select
  using (household_id = public.current_household_id());

-- Send: only as yourself, only to someone in your own household.
create policy "nudges insert own"
  on public.nudges for insert
  with check (
    from_user = auth.uid()
    and household_id = public.current_household_id()
    and exists (
      select 1 from public.profiles p
      where p.id = to_user
        and p.household_id = public.current_household_id()
    )
  );

-- Update: the recipient may mark their own nudges as seen.
create policy "nudges mark seen"
  on public.nudges for update
  using (to_user = auth.uid())
  with check (to_user = auth.uid());

-- Live delivery. RLS still applies to realtime payloads.
alter publication supabase_realtime add table public.nudges;
