import { minsOf, nowManilaMinutes, todayManilaISO } from "./time";
import type { BookingView } from "./types";

/**
 * Selectors and the "who has it now" status used by the Home banner.
 * Ported from the design prototype's `dayStatus`, but driven by the real Manila
 * clock instead of a simulated time.
 */

/** All-day first, then by start time. */
export function sortBookings(list: Array<BookingView>): Array<BookingView> {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) {return a.date < b.date ? -1 : 1;}
    if (a.allDay !== b.allDay) {return a.allDay ? -1 : 1;}

    return minsOf(a.start || "00:00") - minsOf(b.start || "00:00");
  });
}

export function bookingsOnDate(
  list: Array<BookingView>,
  dateISO: string,
): Array<BookingView> {
  return sortBookings(list.filter((b) => b.date === dateISO));
}

export type BookingProgress = "done" | "ongoing" | "upcoming";

/**
 * Where a booking sits relative to the live Manila clock: already finished,
 * happening now, or still to come. Past/future dates short-circuit; for today a
 * timed booking is compared against the current minute, and an all-day booking
 * counts as ongoing.
 */
export function bookingProgress(b: BookingView): BookingProgress {
  const today = todayManilaISO();

  if (b.date < today) {return "done";}
  if (b.date > today) {return "upcoming";}
  if (b.allDay) {return "ongoing";}

  const now = nowManilaMinutes();

  if (now >= minsOf(b.end)) {return "done";}
  if (now >= minsOf(b.start)) {return "ongoing";}

  return "upcoming";
}

export type DayStatus =
  | { kind: "allday"; booking: BookingView; isToday: boolean }
  | { kind: "busy"; booking: BookingView; next?: BookingView; isToday: boolean }
  | { kind: "free"; next?: BookingView; isToday: boolean }
  | { kind: "day-free"; isToday: boolean }
  | { kind: "day-has"; items: Array<BookingView>; isToday: boolean };

/**
 * Status of the car on a given Manila date. For today it uses the live clock to
 * distinguish "in use right now" from "free, next at ...". For other days it
 * summarises whether anything is booked.
 */
export function dayStatus(dateISO: string, list: Array<BookingView>): DayStatus {
  const items = bookingsOnDate(list, dateISO);
  const isToday = dateISO === todayManilaISO();
  const allDay = items.find((b) => b.allDay);

  if (allDay) {return { kind: "allday", booking: allDay, isToday };}

  if (!isToday) {
    return items.length > 0
      ? { kind: "day-has", items, isToday }
      : { kind: "day-free", isToday };
  }

  const now = nowManilaMinutes();
  const timed = items.filter((b) => !b.allDay);
  const current = timed.find((b) => minsOf(b.start) <= now && now < minsOf(b.end));
  const next = timed.find((b) => minsOf(b.start) > now);

  if (current) {return { kind: "busy", booking: current, next, isToday };}

  return { kind: "free", next, isToday };
}
