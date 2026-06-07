-- VelozHub: allow a status per day (advance-set today AND tomorrow)
-- 0012 keyed member_status on user_id alone, so each member could hold only one
-- status at a time. To let people plan ahead (a status for today and a separate
-- one for tomorrow) we widen the key to (user_id, for_date): one row per member
-- per day. Upserts now target that pair; the per-day reads and auto-expiry are
-- unchanged.

alter table public.member_status drop constraint member_status_pkey;
alter table public.member_status
  add constraint member_status_pkey primary key (user_id, for_date);
