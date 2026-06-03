-- VelozHub: booking-poll states (part 1 of 2)
-- A new booking is now a *proposal* the household votes on, so the status enum
-- grows two states: 'pending' (open poll) and 'rejected' (someone declined or
-- the slot was lost). Postgres will not let a new enum value be *used* in the
-- same transaction that adds it, so the value is added here and everything that
-- references it lives in 0005_polls.sql.

alter type public.booking_status add value if not exists 'pending';
alter type public.booking_status add value if not exists 'rejected';
