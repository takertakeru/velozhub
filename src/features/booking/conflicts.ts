import { minsOf, nowManilaMinutes, todayManilaISO } from "./time";
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
