-- VelozHub: booking polls (part 2 of 2)
-- Every new booking starts as a proposal (status 'pending') the household votes
-- on. It confirms when every *required* member approves, or after a 15-minute
-- silence window with no objections. A single decline rejects it outright. The
-- overlap constraint (bookings_no_overlap, confirmed-only) is the final guard if
-- two polls for the same slot both try to confirm.

-- Optional voters --------------------------------------------------------------
-- Some members rarely check their phone (e.g. a parent). They may still vote,
-- but the poll never waits on them and they are not counted toward "everyone
-- approved". Flag those rows after applying this migration, e.g.:
--   update public.profiles set vote_optional = true where display_name = 'Joahn';
alter table public.profiles
  add column vote_optional boolean not null default false;

-- Poll deadline ----------------------------------------------------------------
-- The 15-minute silence window. Evaluated per row at insert, so every new
-- proposal carries its own deadline. Confirmed/cancelled rows ignore it.
alter table public.bookings
  add column poll_deadline timestamptz default (now() + interval '15 minutes');

-- Votes ------------------------------------------------------------------------
-- One row per member per proposal. approve = true (yes) or false (decline).
create table public.booking_votes (
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  approve     boolean not null,
  created_at  timestamptz not null default now(),
  primary key (booking_id, profile_id)
);
create index booking_votes_booking_id_idx on public.booking_votes (booking_id);

alter table public.booking_votes enable row level security;

-- Read: anyone in the household can see the tally on a household proposal.
create policy "votes readable by members"
  on public.booking_votes for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.household_id = public.current_household_id()
    )
  );

-- Write: only as yourself, only on a proposal in your own household. In practice
-- votes are cast through cast_booking_vote(), but the policy keeps direct writes
-- safe too.
create policy "votes write own"
  on public.booking_votes for all
  using (profile_id = auth.uid())
  with check (
    profile_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.household_id = public.current_household_id()
    )
  );

-- Confirm helper ---------------------------------------------------------------
-- Flip a pending proposal to confirmed. If the slot was already taken by another
-- poll that confirmed first, the exclusion constraint fires and we reject this
-- one instead of erroring. SECURITY DEFINER so it can write past RLS; called
-- only from the functions below.
create or replace function public.try_confirm_booking(p_booking_id uuid)
returns public.booking_status
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bookings set status = 'confirmed'
   where id = p_booking_id and status = 'pending';
  return 'confirmed';
exception when exclusion_violation then
  update public.bookings set status = 'rejected' where id = p_booking_id;
  return 'rejected';
end;
$$;

-- Cast a vote ------------------------------------------------------------------
-- Records (or changes) the caller's vote on a proposal and resolves it:
--   * a decline rejects immediately;
--   * once every required member has approved, it confirms;
--   * otherwise it stays pending until another vote or the deadline.
-- Returns the resulting status. SECURITY DEFINER, scoped to the caller's
-- household, and only acts while the poll is still open.
create or replace function public.cast_booking_vote(
  p_booking_id uuid,
  p_approve    boolean
)
returns public.booking_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking   public.bookings;
  v_required  int;
  v_approved  int;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if not found then
    raise exception 'booking not found';
  end if;
  if v_booking.household_id <> public.current_household_id() then
    raise exception 'not your household';
  end if;
  if v_booking.status <> 'pending' then
    return v_booking.status; -- already decided
  end if;

  insert into public.booking_votes (booking_id, profile_id, approve)
  values (p_booking_id, auth.uid(), p_approve)
  on conflict (booking_id, profile_id)
  do update set approve = excluded.approve, created_at = now();

  -- A single decline kills the poll.
  if not p_approve then
    update public.bookings set status = 'rejected' where id = p_booking_id;
    return 'rejected';
  end if;

  -- Confirm once every required (non-optional) member has approved.
  select count(*) into v_required
    from public.profiles
   where household_id = v_booking.household_id
     and vote_optional = false;

  select count(*) into v_approved
    from public.booking_votes v
    join public.profiles p on p.id = v.profile_id
   where v.booking_id = p_booking_id
     and v.approve = true
     and p.vote_optional = false;

  if v_approved >= v_required then
    return public.try_confirm_booking(p_booking_id);
  end if;

  return 'pending';
end;
$$;

-- Resolve stalled polls --------------------------------------------------------
-- Confirms every proposal whose 15-minute silence window has elapsed with no
-- objection (silence counts as yes). Idempotent: safe to call repeatedly. Run by
-- pg_cron every minute (see below) and opportunistically by the client on load.
create or replace function public.resolve_due_polls()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select b.id
      from public.bookings b
     where b.status = 'pending'
       and b.poll_deadline is not null
       and b.poll_deadline <= now()
       and not exists (
         select 1 from public.booking_votes v
          where v.booking_id = b.id and v.approve = false
       )
  loop
    perform public.try_confirm_booking(r.id);
  end loop;
end;
$$;

grant execute on function public.cast_booking_vote(uuid, boolean) to authenticated;
grant execute on function public.resolve_due_polls() to authenticated;

-- Scheduled resolution ---------------------------------------------------------
-- Enable pg_cron once (Supabase dashboard: Database > Extensions > pg_cron),
-- then uncomment to auto-confirm stalled polls even when no app is open:
--   create extension if not exists pg_cron;
--   select cron.schedule(
--     'resolve-due-polls', '* * * * *',
--     $cron$ select public.resolve_due_polls(); $cron$
--   );

-- Realtime ---------------------------------------------------------------------
-- Live delivery of votes so every phone's poll badge updates instantly. RLS
-- still applies to realtime payloads.
alter publication supabase_realtime add table public.booking_votes;
