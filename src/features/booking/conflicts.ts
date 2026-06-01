import { hhmmOfMins, minsOf, nowManilaMinutes, todayManilaISO } from "./time";
import type { BookingDraft, BookingView } from "./types";

/**
 * Client-side conflict + validation logic.
 *
 * This mirrors the Postgres exclusion constraint so the form can warn before a
 * round trip. The database is still the source of truth: a save can fail on the
 * constraint even if the client thought it was clear (e.g. Someone booked the
 * slot a second earlier on another device). The UI treats this as a soft warning
 * that does not hard-block, exactly like the design prototype, and relies on the
 * DB to reject a true overlap.
 *
 * Rule: any all-day booking (existing or draft) blocks the whole day; otherwise
 * two timed ranges clash when they overlap. Half-open ranges, so back-to-back
 * bookings (10:00-11:00 and 11:00-12:00) do not clash.
 */
export function findConflicts(
  draft: BookingDraft,
  bookings: Array<BookingView>,
): Array<BookingView> {
  return bookings.filter((b) => {
    if (b.id === draft.id) {return false;}
    if (b.date !== draft.date) {return false;}
    if (draft.allDay || b.allDay) {return true;}

    const s1 = minsOf(draft.start);
    const e1 = minsOf(draft.end);
    const s2 = minsOf(b.start);
    const e2 = minsOf(b.end);

    return s1 < e2 && s2 < e1;
  });
}

export type DraftValidation = { ok: boolean; error: string | null };

/** Range sanity check (date present, end after start). Conflicts are separate. */
export function validateDraft(d: BookingDraft): DraftValidation {
  if (!d.date) {return { ok: false, error: "Pick a date." };}

  const today = todayManilaISO();

  if (d.date < today) {
    return { ok: false, error: "That date is in the past." };
  }

  if (!d.allDay) {
    if (!d.start || !d.end) {
      return { ok: false, error: "Set a start and end time." };
    }
    if (minsOf(d.end) <= minsOf(d.start)) {
      return { ok: false, error: "End time must be after the start time." };
    }
    // A timed booking today cannot start in the past.
    if (d.date === today && minsOf(d.start) < nowManilaMinutes()) {
      return { ok: false, error: "That start time has already passed today." };
    }
  }

  return { ok: true, error: null };
}

const DAY_END_MINS = 24 * 60;

/** Round a minute count up to the next quarter hour, capped at the day end. */
function ceilQuarter(mins: number): number {
  return Math.min(Math.ceil(mins / 15) * 15, DAY_END_MINS);
}

/**
 * Find the nearest open slot of the same length, later the same day, when a
 * timed draft clashes. Returns null when nothing fits (e.g. The day is taken by
 * an all-day booking, or there is no room left). Half-open ranges, so it can
 * butt right up against an existing booking.
 */
export function suggestFreeSlot(
  draft: BookingDraft,
  bookings: Array<BookingView>,
): { start: string; end: string } | null {
  if (draft.allDay || !draft.start || !draft.end) {
    return null;
  }

  const duration = minsOf(draft.end) - minsOf(draft.start);

  if (duration <= 0) {
    return null;
  }

  const sameDay = bookings.filter(
    (b) => b.date === draft.date && b.id !== draft.id,
  );

  // An all-day booking blocks the entire day, so there is nothing to suggest.
  if (sameDay.some((b) => b.allDay)) {
    return null;
  }

  const busy = sameDay
    .filter((b) => !b.allDay)
    .map((b) => ({ s: minsOf(b.start), e: minsOf(b.end) }))
    .sort((a, b) => a.s - b.s);

  // Earliest we are willing to suggest: the draft's own start, but never in the
  // past for today.
  const floor =
    draft.date === todayManilaISO()
      ? Math.max(minsOf(draft.start), ceilQuarter(nowManilaMinutes()))
      : minsOf(draft.start);

  // Candidate starts: the floor, plus the moment each existing booking frees up.
  const candidates = [floor, ...busy.map((b) => b.e)]
    .filter((start) => start >= floor && start + duration <= DAY_END_MINS)
    .sort((a, b) => a - b);

  for (const start of candidates) {
    const end = start + duration;
    const hasClash = busy.some((b) => start < b.e && b.s < end);

    if (!hasClash) {
      return { start: hhmmOfMins(start), end: hhmmOfMins(end) };
    }
  }

  return null;
}
