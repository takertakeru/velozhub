import { TZDate } from "@date-fns/tz";

/**
 * Time helpers for VelozHub.
 *
 * Rule of the app: timestamps are stored in Postgres as UTC `timestamptz`, but
 * the family thinks in Manila wall-clock time. So everything that touches the
 * database goes through here. A booking draft (a Manila local date plus "HH:mm"
 * times) becomes UTC ISO strings on the way in, and a stored booking (UTC ISO
 * strings) becomes Manila local date plus "HH:mm" parts on the way out.
 *
 * We use `@date-fns/tz` TZDate so the conversion is correct year-round, rather
 * than hardcoding the +08:00 offset. Manila has no DST today, but this keeps the
 * logic honest and portable.
 */
export const MANILA_TZ = "Asia/Manila";

const pad = (n: number) => String(n).padStart(2, "0");

export const dowShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const dowLong = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const monShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** A UTC instant viewed through Manila's wall clock. */
function manilaView(instant: Date | string | number): TZDate {
  const ms =
    instant instanceof Date ? instant.getTime() : new Date(instant).getTime();

  return new TZDate(ms, MANILA_TZ);
}

function dateISOof(d: TZDate): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function hhmmOf(d: TZDate): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ---------- Local date arithmetic (operate on "yyyy-MM-dd" strings) ---------- */

/** Day of week for a local date string, 0 = Sun .. 6 = Sat. */
export function dowOf(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);

  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Add (or subtract) whole days to a "yyyy-MM-dd" string. */
export function addDaysISO(dateISO: string, n: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  dt.setUTCDate(dt.getUTCDate() + n);

  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Minutes since midnight for an "HH:mm" string. */
export function minsOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);

  return h * 60 + m;
}

/** Inverse of `minsOf`: minutes since midnight back to an "HH:mm" string. */
export function hhmmOfMins(mins: number): string {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}

/* ---------- "Now" in Manila ---------- */

/** Today's date in Manila as "yyyy-MM-dd". */
export function todayManilaISO(): string {
  return dateISOof(manilaView(new Date()));
}

/** Minutes since local midnight, right now, in Manila. */
export function nowManilaMinutes(): number {
  const d = manilaView(new Date());

  return d.getHours() * 60 + d.getMinutes();
}

/* ---------- Manila wall-clock and UTC conversion ---------- */

/** Combine a Manila local date + "HH:mm" into a UTC ISO string. */
export function manilaToUtcISO(dateISO: string, hhmm: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const local = new TZDate(y, m - 1, d, hh, mm, 0, MANILA_TZ);

  return new Date(local.getTime()).toISOString();
}

/** UTC range for a timed booking on a Manila local date. */
export function timedRangeUtc(dateISO: string, start: string, end: string) {
  return {
    startAt: manilaToUtcISO(dateISO, start),
    endAt: manilaToUtcISO(dateISO, end),
  };
}

/**
 * UTC range for an all-day booking: local midnight to next local midnight. This
 * is what makes an all-day booking overlap any timed booking that day through
 * the same Postgres exclusion constraint.
 */
export function allDayRangeUtc(dateISO: string) {
  return {
    startAt: manilaToUtcISO(dateISO, "00:00"),
    endAt: manilaToUtcISO(addDaysISO(dateISO, 1), "00:00"),
  };
}

/** Stored UTC range to Manila local date + "HH:mm" parts for display/editing. */
export function localPartsOf(startAtUtc: string, endAtUtc: string) {
  const s = manilaView(startAtUtc);
  const e = manilaView(endAtUtc);

  return { dateISO: dateISOof(s), start: hhmmOf(s), end: hhmmOf(e) };
}

/* ---------- Display formatting ---------- */

/** Format an "HH:mm" string as a friendly clock time like "9 AM" or "9:15 AM". */
export function fmtTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h < 12 ? "AM" : "PM";
  const hh = h % 12 === 0 ? 12 : h % 12;

  return m === 0 ? `${hh} ${ap}` : `${hh}:${pad(m)} ${ap}`;
}

/** "Today" / "Tomorrow" / "Yesterday" / weekday name, relative to Manila today. */
export function relDayLabel(dateISO: string, todayISO = todayManilaISO()): string {
  if (dateISO === todayISO) {return "Today";}
  if (dateISO === addDaysISO(todayISO, 1)) {return "Tomorrow";}
  if (dateISO === addDaysISO(todayISO, -1)) {return "Yesterday";}

  return dowLong[dowOf(dateISO)];
}

/** Format a local date string as "Sat, May 31". */
export function fullDate(dateISO: string): string {
  const [, m, d] = dateISO.split("-").map(Number);

  return `${dowShort[dowOf(dateISO)]}, ${monShort[m - 1]} ${d}`;
}

/** The Manila local date ("yyyy-MM-dd") for a stored UTC instant. */
export function manilaDateISO(instantUtc: string): string {
  return dateISOof(manilaView(instantUtc));
}

/**
 * Format a stored UTC instant as a Manila date + time, e.g. "May 31, 9:15 AM".
 * Used for fuel fill-up entries, which carry a `created_at` timestamp rather
 * than a wall-clock booking range.
 */
export function fmtDateTime(instantUtc: string): string {
  const d = manilaView(instantUtc);
  const dateISO = dateISOof(d);
  const [, m, day] = dateISO.split("-").map(Number);

  return `${monShort[m - 1]} ${day}, ${fmtTime(hhmmOf(d))}`;
}
