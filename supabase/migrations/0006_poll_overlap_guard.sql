-- VelozHub: keep poll proposals honest
-- Pending proposals are intentionally exempt from the bookings_no_overlap
-- exclusion constraint, so two people can propose the same slot and let the vote
-- decide. But a proposal that overlaps an already-CONFIRMED booking can never
-- win, so we reject it the moment it is created rather than open a doomed poll.
-- Raised with the same SQLSTATE (23P01) the exclusion constraint uses, so the
-- client maps it to the familiar "that time was just taken" message.

create or replace function public.reject_pending_overlap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status = 'pending' and exists (
    select 1 from public.bookings b
    where b.vehicle_id = new.vehicle_id
      and b.status = 'confirmed'
      and tstzrange(b.start_at, b.end_at, '[)')
          && tstzrange(new.start_at, new.end_at, '[)')
  ) then
    raise exception 'proposal overlaps a confirmed booking'
      using errcode = 'exclusion_violation';
  end if;

  return new;
end;
$$;

create trigger bookings_pending_no_overlap
  before insert on public.bookings
  for each row execute function public.reject_pending_overlap();
