-- VelozHub: going-out status (a soft "what I'm thinking" signal)
-- Deliberately weaker than a booking. A booking locks the car (the
-- bookings_no_overlap exclusion constraint, polls, give-way); a status just
-- broadcasts intent so the family can coordinate *before* anyone commits. No
-- locking, no conflicts, no approval. Each member has at most one current
-- status (upsert overwrites), aimed at a single day.
--
-- Auto-expiry without a cron: a status carries the Manila local date it is
-- about (`for_date`). The client reads only rows with for_date >= today, so a
-- "tomorrow" status quietly becomes "today" when the day turns over and a stale
-- one simply stops showing. Mirrors the "fetch all, slice on the client"
-- approach the booking queries already use (the dataset is one tiny family).

-- Intent ----------------------------------------------------------------------
--   going  definitely taking the car that day
--   maybe  might take it
--   not    staying in / not taking it
create type public.status_intent as enum ('going', 'maybe', 'not');

-- Table -----------------------------------------------------------------------
-- One row per member (user_id is the primary key, so an upsert replaces the
-- previous status rather than stacking a history). `for_date` is the Manila
-- local date the status refers to; `note` is an optional free-text hint
-- ("around 3pm", "airport run").
create table public.member_status (
  user_id      uuid primary key references public.profiles (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  intent       public.status_intent not null,
  for_date     date not null,
  note         text,
  updated_at   timestamptz not null default now()
);
create index member_status_household_idx on public.member_status (household_id);

alter table public.member_status enable row level security;

-- Read: anyone in the household (tiny family; household-wide reads keep the
-- Realtime subscription simple, mirroring nudges and give-way).
create policy "member_status readable by members"
  on public.member_status for select
  using (household_id = public.current_household_id());

-- Set: only your own status, only within your own household.
create policy "member_status insert own"
  on public.member_status for insert
  with check (
    user_id = auth.uid()
    and household_id = public.current_household_id()
  );

create policy "member_status update own"
  on public.member_status for update
  using (user_id = auth.uid() and household_id = public.current_household_id())
  with check (user_id = auth.uid() and household_id = public.current_household_id());

-- Clear: a member may delete their own status.
create policy "member_status delete own"
  on public.member_status for delete
  using (user_id = auth.uid() and household_id = public.current_household_id());

-- Live delivery so every phone updates the instant someone sets or clears a
-- status. RLS still applies to realtime payloads.
alter publication supabase_realtime add table public.member_status;
