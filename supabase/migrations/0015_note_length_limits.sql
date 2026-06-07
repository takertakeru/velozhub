-- VelozHub: cap free-text notes and reasons
-- The booking note and the ask / decline / keep reasons are short prompts, not
-- messages. The inputs already cap at 140 characters; these are the server-side
-- backstops. Existing rows are trimmed first so the constraints can be added
-- even if any legacy value is longer. char_length(null) is null, so the checks
-- pass for empty fields. The going-out status note has its own tighter cap in
-- migration 0014.

update public.bookings
   set note = left(note, 140)
 where char_length(note) > 140;
update public.bookings
   set decline_reason = left(decline_reason, 140)
 where char_length(decline_reason) > 140;
update public.giveway_requests
   set reason = left(reason, 140)
 where char_length(reason) > 140;
update public.giveway_requests
   set response_reason = left(response_reason, 140)
 where char_length(response_reason) > 140;

alter table public.bookings
  add constraint bookings_note_len check (char_length(note) <= 140);
alter table public.bookings
  add constraint bookings_decline_reason_len check (char_length(decline_reason) <= 140);
alter table public.giveway_requests
  add constraint giveway_reason_len check (char_length(reason) <= 140);
alter table public.giveway_requests
  add constraint giveway_response_reason_len check (char_length(response_reason) <= 140);
