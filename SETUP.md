# VelozHub setup

Shared-car booking PWA for one household, one car (Toyota Veloz), five drivers.
This document covers everything except the four MVP screens (built next).

## 1. Stack decisions

Built on the existing Vite + React 19 + TypeScript template. Reused as-is:

- **TanStack Router** (file-based routing) with the template's `requireAuth()` gate.
- **TanStack Query** for server state, **Zustand** for UI state.
- **Existing react-aria-components UI kit** in `src/components/ui` on **Tailwind v4**.
  We did not add shadcn/ui: the template already ships a full kit and shadcn
  assumes Radix + Tailwind v3, which would conflict.
- **date-fns** for dates. Store timestamps in UTC, display in `Asia/Manila`.

Added in this scaffold:

- **@supabase/supabase-js** for Postgres, Auth, RLS, and Realtime.
- **vite-plugin-pwa** for the installable PWA (manifest + service worker).

Auth is **Supabase email + password** with five pre-seeded accounts. We do not
hardcode credentials in the frontend, because every driver needs a real
`auth.uid()` for Row Level Security to work. Public sign-up is closed.

## 2. Create the Supabase project (from zero)

1. Go to https://supabase.com, create a free project. Pick a region near Manila
   (e.g. Singapore). Save the database password.
2. **Settings > API**: copy the **Project URL** and the **anon public** key.
3. Create `.env` from `.env.sample` and fill in:
   ```
   VITE_SUPABASE_URL="https://<your-ref>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<anon-public-key>"
   ```
4. **SQL editor > New query**: paste all of `supabase/migrations/0001_init.sql`,
   run it. This creates the tables, the overlap exclusion constraint, the RLS
   policies, and adds the booking tables to Realtime.
5. **Authentication > Users > Add user**: create the five accounts. For each,
   set a password and tick **Auto Confirm User**. Use the emails you will list
   in the seed. Hand each family member their email + password.
6. **SQL editor**: paste `supabase/seed.sql` (edit emails/names/colors/roles to
   match step 5), run it. It creates the household, the Veloz, and links each
   auth user to a profile. It is idempotent.
7. **Authentication > URL Configuration**: add your local dev URL
   (`http://localhost:3000`) and later your Vercel URL to **Redirect URLs**.

Run `yarn dev` and sign in with one of the five accounts.

## 3. Folder structure

```
src/
  libs/
    supabase/
      client.ts        # singleton typed Supabase client
      types.ts         # Database types (regenerate later with supabase gen types)
  features/
    auth/
      provider.ts      # active provider -> supabaseAuthProvider
      providers/
        supabase-provider.ts   # email+password impl of AuthProvider
    booking/           # (next) booking queries, hooks, components
  routes/
    (unauthenticated)/ # login
    (authenticated)/   # home, week, new/edit booking (next)
supabase/
  migrations/0001_init.sql
  seed.sql
.github/workflows/supabase-keepalive.yml
vercel.json
```

## 4. Testing the overlap constraint

The rule: no two **confirmed** bookings on the same vehicle may overlap, and an
all-day booking conflicts with any timed booking that day. It is enforced in
Postgres by `bookings_no_overlap` (a GiST exclusion constraint over
`vehicle_id` + `tstzrange(start_at, end_at, '[)')`, scoped to confirmed rows).

In the SQL editor, with a seeded vehicle id:

```sql
-- pick the vehicle
select id from public.vehicles limit 1;  -- call it :veh

-- 1. First booking succeeds.
insert into public.bookings (vehicle_id, household_id, user_id, start_at, end_at)
select v.id, v.household_id, p.id,
       '2026-06-01 09:00+08', '2026-06-01 11:00+08'
from public.vehicles v, public.profiles p
where p.id = (select id from public.profiles limit 1)
limit 1;

-- 2. Overlapping booking FAILS with: conflicting key value violates
--    exclusion constraint "bookings_no_overlap".
insert into public.bookings (vehicle_id, household_id, user_id, start_at, end_at)
select v.id, v.household_id, p.id,
       '2026-06-01 10:00+08', '2026-06-01 12:00+08'
from public.vehicles v, public.profiles p
where p.id = (select id from public.profiles limit 1)
limit 1;

-- 3. Back-to-back booking SUCCEEDS (half-open range, 11:00 start is fine).
--    start_at '2026-06-01 11:00+08' ... end_at '2026-06-01 12:00+08'

-- 4. An all-day booking (local midnight to next local midnight) FAILS against
--    any timed booking the same day:
--    start_at '2026-06-01 00:00+08' ... end_at '2026-06-02 00:00+08'
```

Cancelling a booking (`status = 'cancelled'`) removes it from the constraint, so
the slot frees up immediately.

## 5. Keep-alive (free tier never pauses)

`.github/workflows/supabase-keepalive.yml` runs a trivial daily REST query.
Add two repo secrets (Settings > Secrets and variables > Actions):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

You can trigger it manually once via the Actions tab (workflow_dispatch) to
confirm it prints `keep-alive HTTP 200`.

## 6. Deploy to Vercel

1. Import the repo in Vercel. Framework preset: **Vite** (already in
   `vercel.json`, which also adds the SPA rewrite).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as project env vars.
3. Add the Vercel URL to Supabase **Redirect URLs** (step 2.7).
4. Deploy. The PWA is installable from the deployed URL.
