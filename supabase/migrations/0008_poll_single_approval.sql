-- VelozHub: relax poll confirmation to a single approval
-- Previously a proposal confirmed only when every required member approved (or
-- after the 15-minute silence window). The household wants it lighter: once any
-- ONE other member approves, the booking is confirmed immediately. The proposer
-- still auto-approves on creation, a single decline still rejects, and the
-- 15-minute timeout (resolve_due_polls) still confirms a proposal nobody answered.
-- Only cast_booking_vote changes; try_confirm_booking and resolve_due_polls stay.

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

  -- A single decline still kills the poll.
  if not p_approve then
    update public.bookings set status = 'rejected' where id = p_booking_id;
    return 'rejected';
  end if;

  -- New rule: a single approval from anyone other than the proposer confirms it.
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
