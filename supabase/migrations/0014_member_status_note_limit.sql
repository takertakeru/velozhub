-- VelozHub: cap the status note length
-- A status note is a glanceable hint ("around 3pm", "airport run"), not a
-- message, so keep it short. The picker input already limits to 30 characters;
-- this is the server-side backstop. char_length(null) is null, so the check
-- passes for notes left empty.

alter table public.member_status
  add constraint member_status_note_len check (char_length(note) <= 30);
