-- VelozHub initial schema
-- Single household, single vehicle (Toyota Veloz), five drivers.
-- Apply via the Supabase SQL editor, or `supabase db push` if you adopt the CLI.

-- Extensions ----------------------------------------------------------------
-- btree_gist lets a GiST exclusion constraint mix an equality column
-- (vehicle_id) with a range column (the booking interval).
create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- Enums ---------------------------------------------------------------------
create type public.profile_role as enum ('member', 'admin');
create type public.booking_status as enum ('confirmed', 'cancelled');

-- Tables --------------------------------------------------------------------
create table public.households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  join_code   text not null unique,
  created_at  timestamptz not null default now()
);

-- One profile per auth user. id == auth.users.id is what every RLS policy
-- keys off, so a signed-in driver is always scoped to their household.
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  household_id  uuid not null references public.households (id) on delete cascade,
  display_name  text not null,
  color         text not null default '#64748b',
  role          public.profile_role not null default 'member',
  created_at    timestamptz not null default now()
);
create index profiles_household_id_idx on public.profiles (household_id);

create table public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references public.households (id) on delete cascade,
  name          text not null,
  plate         text,
  color         text not null default '#0ea5e9',
  created_at    timestamptz not null default now()
);
create index vehicles_household_id_idx on public.vehicles (household_id);

create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles (id) on delete cascade,
  household_id  uuid not null references public.households (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  start_at      timestamptz not null,
  end_at        timestamptz not null,
  all_day       boolean not null default false,
  note          text,
  status        public.booking_status not null default 'confirmed',
  created_at    timestamptz not null default now(),
  constraint bookings_time_valid check (end_at > start_at)
);
create index bookings_vehicle_id_idx on public.bookings (vehicle_id);
create index bookings_household_id_idx on public.bookings (household_id);
create index bookings_user_id_idx on public.bookings (user_id);

-- Overlap prevention. No two CONFIRMED bookings on the same vehicle may share
-- any instant. The half-open range '[)' makes back-to-back bookings legal
-- (10:00-11:00 and 11:00-12:00 do not conflict). An all-day booking is stored
-- as local-midnight to next-local-midnight, so it overlaps any timed booking
-- on that day through the very same constraint. Cancelled bookings are excluded
-- by the partial WHERE so they never block a new booking.
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    vehicle_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (status = 'confirmed');

create table public.booking_riders (
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (booking_id, profile_id)
);

-- Helper functions ----------------------------------------------------------
-- SECURITY DEFINER so the lookup itself is not gated by RLS (avoids recursion
-- when policies call it). search_path is pinned for safety.
create or replace function public.current_household_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select household_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Row Level Security --------------------------------------------------------
alter table public.households     enable row level security;
alter table public.profiles       enable row level security;
alter table public.vehicles       enable row level security;
alter table public.bookings       enable row level security;
alter table public.booking_riders enable row level security;

-- Households / vehicles: read-only to members of the household.
create policy "households readable by members"
  on public.households for select
  using (id = public.current_household_id());

create policy "vehicles readable by members"
  on public.vehicles for select
  using (household_id = public.current_household_id());

-- Profiles: members see everyone in their household; a user may edit only their
-- own row (display name / color).
create policy "profiles readable by members"
  on public.profiles for select
  using (household_id = public.current_household_id());

create policy "profiles update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and household_id = public.current_household_id());

-- Bookings: members read all household bookings; a user creates bookings as
-- themselves; a user edits/deletes only their own, an admin overrides.
create policy "bookings readable by members"
  on public.bookings for select
  using (household_id = public.current_household_id());

create policy "bookings insert own"
  on public.bookings for insert
  with check (
    household_id = public.current_household_id()
    and user_id = auth.uid()
  );

create policy "bookings update own or admin"
  on public.bookings for update
  using (
    household_id = public.current_household_id()
    and (user_id = auth.uid() or public.is_admin())
  )
  with check (household_id = public.current_household_id());

create policy "bookings delete own or admin"
  on public.bookings for delete
  using (
    household_id = public.current_household_id()
    and (user_id = auth.uid() or public.is_admin())
  );

-- Booking riders: visible within the household; writable by the booking owner
-- or an admin.
create policy "riders readable by members"
  on public.booking_riders for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.household_id = public.current_household_id()
    )
  );

create policy "riders write by owner or admin"
  on public.booking_riders for all
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.household_id = public.current_household_id()
        and (b.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.household_id = public.current_household_id()
        and (b.user_id = auth.uid() or public.is_admin())
    )
  );

-- Realtime ------------------------------------------------------------------
-- Add the live tables to the realtime publication so every client updates when
-- a booking changes. RLS still applies to realtime payloads.
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.booking_riders;
