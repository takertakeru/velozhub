-- VelozHub: decline reason + a notice for the declined proposer
-- A declined proposal used to vanish silently: the proposer ("the declined
-- user") got no signal, and the decliner had no way to say why. This migration
-- lets a decline carry an optional reason, records who declined, and tracks
-- whether the proposer has seen the notice yet so it shows exactly once.
--
-- Only the decline branch of cast_booking_vote changes; the household check, the
-- single-approval confirm rule (from 0008), try_confirm_booking, and
-- resolve_due_polls all stay the same.

-- Decline metadata -------------------------------------------------------------
-- decline_reason / declined_by are set only by a member decline (a false vote
-- through cast_booking_vote). The slot-taken auto-reject in try_confirm_booking
-- and the admin force-reject leave them null, so neither pops a notice.
-- decline_seen lets the proposer dismiss the notice; their own RLS update policy
-- ("bookings update own or admin") already permits flipping it.
alter table public.bookings
  add column decline_reason text,
  add column declined_by    uuid references public.profiles (id) on delete set null,
  add column decline_seen   boolean not null default false;

-- Cast a vote (now reason-aware) ----------------------------------------------
-- Replace the 0008 version. Drop the old 2-arg signature first so the new
-- 3-arg form (p_reason defaulted) is unambiguous; the create-booking flow still
-- calls it with two args and p_reason simply defaults to null.
drop function if exists public.cast_booking_vote(uuid, boolean);

create or replace function public.cast_booking_vote(
  p_booking_id uuid,
  p_approve    boolean,
  p_reason     text default null
)
returns public.booking_status
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking         public.bookings;
  v_other_approvals int;
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

  -- A single decline still kills the poll, now stamped with who declined and an
  -- optional reason for the notice the proposer sees.
  if not p_approve then
    update public.bookings
       set status = 'rejected',
           decline_reason = nullif(btrim(p_reason), ''),
           declined_by = auth.uid(),
           decline_seen = false
     where id = p_booking_id;
    return 'rejected';
  end if;

  -- A single approval from anyone other than the proposer confirms it.
  -- (The proposer's own auto-approve never counts toward this.)
  select count(*) into v_other_approvals
    from public.booking_votes v
   where v.booking_id = p_booking_id
     and v.approve = true
     and v.profile_id <> v_booking.user_id;

  if v_other_approvals >= 1 then
    return public.try_confirm_booking(p_booking_id);
  end if;

  return 'pending';
end;
$$;

grant execute on function public.cast_booking_vote(uuid, boolean, text) to authenticated;
