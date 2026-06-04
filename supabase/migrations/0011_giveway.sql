-- VelozHub: give-way requests (ask the holder to yield a confirmed slot)
-- A confirmed booking locks the car: the bookings_no_overlap exclusion
-- constraint (0001) and the pending-overlap trigger (0006) mean nobody else can
-- even propose that slot. This feature lets a member politely ask the current
-- holder to sacrifice their booking. The holder decides: GIVE WAY frees the slot
-- (their booking is cancelled), KEEP IT declines with an optional reason.
--
-- We deliberately do NOT hand the slot straight to the requester. Acceptance
-- just frees it; the requester then CLAIMS it (claim_giveway), which inserts
-- their booking confirmed-directly, skipping the poll because the holder's
-- give-way already counts as the approval. The brief window where the slot is
-- free and unclaimed is accepted: for one family with one car the risk that a
-- third person grabs it first is tiny, and if it happens the requester simply
-- gets the familiar "that time was just taken" message.

-- Status -----------------------------------------------------------------------
--   pending   awaiting the holder's answer
--   accepted  holder gave way; slot is free, requester may claim it
--   declined  holder kept their booking (response_reason may say why)
--   withdrawn no longer actionable: requester pulled it, or the booking it
--             targeted was cancelled out from under it (see the trigger below)
--   claimed   requester took the freed slot; terminal
create type public.giveway_status as enum
  ('pending', 'accepted', 'declined', 'withdrawn', 'claimed');

-- Table ------------------------------------------------------------------------
-- start_at/end_at/all_day are a snapshot of the contested booking's slot so a
-- request stays self-describing (the claim form prefills from it, and notices
-- render the slot without re-reading the now-cancelled booking).
create table public.giveway_requests (
  id              uuid primary key default gen_random_uuid(),
  household_id    uuid not null references public.households (id) on delete cascade,
  booking_id      uuid not null references public.bookings (id) on delete cascade,
  from_user       uuid not null references public.profiles (id) on delete cascade,
  to_user         uuid not null references public.profiles (id) on delete cascade,
  start_at        timestamptz not null,
  end_at          timestamptz not null,
  all_day         boolean not null default false,
  reason          text,
  status          public.giveway_status not null default 'pending',
  response_reason text,
  seen            boolean not null default false,
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz
);
create index giveway_requests_to_user_idx   on public.giveway_requests (to_user, status);
create index giveway_requests_from_user_idx on public.giveway_requests (from_user, status);
create index giveway_requests_household_idx on public.giveway_requests (household_id);
create index giveway_requests_booking_idx   on public.giveway_requests (booking_id);

-- At most one open ask per requester per booking, so re-tapping cannot spam the
-- holder. request_giveway is idempotent against this (it returns the existing
-- open request); the index is the backstop.
create unique index giveway_one_open_per_requester
  on public.giveway_requests (booking_id, from_user)
  where status = 'pending';

alter table public.giveway_requests enable row level security;

-- Read: anyone in the household (tiny family; household-wide reads keep the
-- Realtime subscription simple, mirroring nudges).
create policy "giveway readable by members"
  on public.giveway_requests for select
  using (household_id = public.current_household_id());

-- Insert: only as yourself, only within your household, only aimed at a
-- household member. In practice requests come through request_giveway (which
-- adds the confirmed/own-booking checks); this is the direct-write backstop.
create policy "giveway insert own"
  on public.giveway_requests for insert
  with check (
    from_user = auth.uid()
    and household_id = public.current_household_id()
    and exists (
      select 1 from public.profiles p
      where p.id = to_user
        and p.household_id = public.current_household_id()
    )
  );

-- Update: either party (or an admin) may touch a request in their household.
-- The requester uses this to withdraw or mark a resolution seen; the holder's
-- accept/decline goes through respond_giveway (SECURITY DEFINER) instead.
create policy "giveway update participant"
  on public.giveway_requests for update
  using (
    household_id = public.current_household_id()
    and (from_user = auth.uid() or to_user = auth.uid() or public.is_admin())
  )
  with check (household_id = public.current_household_id());

-- Open a request --------------------------------------------------------------
-- Validates the target is a confirmed, not-yet-past booking in your household
-- that is not already yours, then opens a pending request. Idempotent: re-asking
-- the same booking returns the existing open request rather than erroring.
create or replace function public.request_giveway(
  p_booking_id uuid,
  p_reason     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
  v_id      uuid;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if not found then
    raise exception 'booking not found';
  end if;
  if v_booking.household_id <> public.current_household_id() then
    raise exception 'not your household';
  end if;
  if v_booking.status <> 'confirmed' then
    raise exception 'you can only ask for a confirmed booking';
  end if;
  if v_booking.user_id = auth.uid() then
    raise exception 'that booking is already yours';
  end if;
  if v_booking.end_at <= now() then
    raise exception 'that booking has already passed';
  end if;

  select id into v_id
    from public.giveway_requests
   where booking_id = p_booking_id
     and from_user = auth.uid()
     and status = 'pending';
  if found then
    return v_id; -- already asked; do not stack a second open request
  end if;

  insert into public.giveway_requests (
    household_id, booking_id, from_user, to_user,
    start_at, end_at, all_day, reason
  )
  values (
    v_booking.household_id, p_booking_id, auth.uid(), v_booking.user_id,
    v_booking.start_at, v_booking.end_at, v_booking.all_day,
    nullif(btrim(p_reason), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Answer a request -------------------------------------------------------------
-- Only the holder (to_user) or an admin may answer, and only while pending.
-- GIVE WAY (p_accept = true) cancels the holder's booking, which frees the slot
-- and, via the trigger below, withdraws any sibling requests on it. We do not
-- create the requester's booking here; they claim it next. KEEP IT records the
-- decline with an optional reason. Returns the resulting status.
create or replace function public.respond_giveway(
  p_request_id uuid,
  p_accept     boolean,
  p_reason     text default null
)
returns public.giveway_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.giveway_requests;
begin
  select * into v_req from public.giveway_requests where id = p_request_id;
  if not found then
    raise exception 'request not found';
  end if;
  if v_req.household_id <> public.current_household_id() then
    raise exception 'not your household';
  end if;
  if v_req.to_user <> auth.uid() and not public.is_admin() then
    raise exception 'only the holder can answer this request';
  end if;
  if v_req.status <> 'pending' then
    return v_req.status; -- already answered
  end if;

  if p_accept then
    -- Free the slot. The cancel trigger flips this request (and any siblings) to
    -- 'withdrawn'; we then stamp this one 'accepted' so the requester can claim.
    update public.bookings
       set status = 'cancelled'
     where id = v_req.booking_id
       and status = 'confirmed';

    update public.giveway_requests
       set status = 'accepted',
           response_reason = nullif(btrim(p_reason), ''),
           resolved_at = now(),
           seen = false
     where id = p_request_id;
    return 'accepted';
  end if;

  update public.giveway_requests
     set status = 'declined',
         response_reason = nullif(btrim(p_reason), ''),
         resolved_at = now(),
         seen = false
   where id = p_request_id;
  return 'declined';
end;
$$;

-- Claim a freed slot -----------------------------------------------------------
-- The requester takes the slot the holder gave way on. Inserts their booking as
-- 'confirmed' directly (no poll: the give-way is the approval). Riders, if any,
-- are added by the client afterward, mirroring useCreateBooking. The
-- bookings_no_overlap constraint is still the final guard; if a third person
-- booked the freed slot first it raises 23P01, surfaced as "that time was just
-- taken." Status flips to 'claimed' so a slot cannot be claimed twice.
create or replace function public.claim_giveway(
  p_request_id uuid,
  p_note       text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.giveway_requests;
  v_id  uuid;
begin
  select * into v_req from public.giveway_requests where id = p_request_id;
  if not found then
    raise exception 'request not found';
  end if;
  if v_req.from_user <> auth.uid() then
    raise exception 'only the requester can claim this slot';
  end if;
  if v_req.household_id <> public.current_household_id() then
    raise exception 'not your household';
  end if;
  if v_req.status <> 'accepted' then
    raise exception 'this slot is not yours to claim';
  end if;

  insert into public.bookings (
    vehicle_id, household_id, user_id,
    start_at, end_at, all_day, note, status, poll_deadline
  )
  select b.vehicle_id, v_req.household_id, auth.uid(),
         v_req.start_at, v_req.end_at, v_req.all_day,
         nullif(btrim(p_note), ''), 'confirmed', null
    from public.bookings b
   where b.id = v_req.booking_id
  returning id into v_id;

  update public.giveway_requests
     set status = 'claimed', seen = true
   where id = p_request_id;

  return v_id;
end;
$$;

-- Keep requests honest when a booking is cancelled -----------------------------
-- A pending request points at a confirmed booking. If that booking is cancelled
-- (by respond_giveway giving way, or by the holder cancelling it directly), the
-- request can no longer be answered, so we withdraw it. This single trigger
-- covers both paths and prevents stale entries lingering in the holder's inbox.
create or replace function public.withdraw_giveways_on_cancel()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.giveway_requests
     set status = 'withdrawn', resolved_at = now()
   where booking_id = new.id and status = 'pending';
  return new;
end;
$$;

create trigger bookings_cancel_withdraw_giveways
  after update of status on public.bookings
  for each row
  when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
  execute function public.withdraw_giveways_on_cancel();

grant execute on function public.request_giveway(uuid, text)          to authenticated;
grant execute on function public.respond_giveway(uuid, boolean, text) to authenticated;
grant execute on function public.claim_giveway(uuid, text)            to authenticated;

-- Realtime ---------------------------------------------------------------------
-- Live delivery so the holder's inbox and the requester's result notice update
-- the instant either side acts. RLS still applies to realtime payloads.
alter publication supabase_realtime add table public.giveway_requests;
