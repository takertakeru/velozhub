-- VelozHub: widen the fuel-log gas-station brands
-- The household fills up at more stations than the original four. This swaps the
-- brand CHECK on fuel_logs for the full set: Petron, Shell, Caltex, Phoenix,
-- Seaoil, Unioil, Jetti, plus the "Others" catch-all. Idempotent: drops the old
-- constraint if present, then adds the new one. (0007 already lists the full set
-- for fresh installs; this migrates databases that applied the earlier version.)

alter table public.fuel_logs
  drop constraint if exists fuel_logs_brand_check;

alter table public.fuel_logs
  add constraint fuel_logs_brand_check check (brand in (
    'Petron', 'Shell', 'Caltex', 'Phoenix',
    'Seaoil', 'Unioil', 'Jetti', 'Others'
  ));
