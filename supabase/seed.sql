-- VelozHub seed data
--
-- PREREQUISITE: create the five accounts first, in the Supabase dashboard under
-- Authentication > Users > "Add user" (set a password for each, and tick
-- "Auto Confirm User"). Use the same emails you list below. Then run this file
-- in the SQL editor. It is idempotent, so re-running is safe.
--
-- This links each auth user to a profile, creates the household, and seeds the
-- Toyota Veloz. Edit the emails, names, colors, and roles to match your family.

do $$
declare
  hh uuid;
begin
  -- Household (one row, keyed by a stable join_code).
  insert into public.households (name, join_code)
  values ('Family', 'VELOZ-2026')
  on conflict (join_code) do update set name = excluded.name
  returning id into hh;

  -- Vehicle: the one shared car.
  insert into public.vehicles (household_id, name, plate, color)
  select hh, 'Toyota Veloz', 'LAT 9581', '#16a34a'
  where not exists (
    select 1 from public.vehicles where household_id = hh
  );

  -- Five drivers. profiles.id must equal the auth.users.id, so we join by email.
  -- Any email here that does not yet exist as an auth user is simply skipped.
  insert into public.profiles (id, household_id, display_name, color, role)
  select u.id, hh, m.display_name, m.color, m.role::public.profile_role
  from (
    values
      ('siekie@gmail.com',    'Siekie',          '#ef4444', 'member'),
      ('internationaljcb@gmail.com',    'Joahn',          '#ec4899', 'member'),
      ('sabrinakhyle@gmail.com', 'Khyle',       '#a855f7', 'member'),
      ('iankarl.epis123@gmail.com',     'Ian', '#3b82f6', 'member'),
      ('takertakeru@gmail.com',     'Takeru',           '#16a34a', 'admin')
  ) as m(email, display_name, color, role)
  join auth.users u on lower(u.email) = lower(m.email)
  on conflict (id) do update
    set household_id = excluded.household_id,
        display_name = excluded.display_name,
        color        = excluded.color,
        role         = excluded.role;
end $$;
