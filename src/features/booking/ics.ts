import type { PeopleData } from "./queries";
import { addDaysISO, timedRangeUtc } from "./time";
import type { BookingView, Person } from "./types";

/**
 * ICalendar (.ics) export.
 *
 * Bookings are stored and reasoned about in Manila local time, but calendars
 * speak UTC, so timed events are converted back to UTC instants (the same
 * conversion the database uses). All-day bookings use VALUE=DATE so they land as
 * proper all-day events. The output downloads as a file the family can import
 * into Google or Apple Calendar; a live subscription feed would need a server
 * endpoint and is left for later.
 */

/** Turns "2026-05-31T01:00:00.000Z" into "20260531T010000Z". */
function utcStamp(iso: string): string {
  return iso.replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Turns "2026-05-31" into "20260531". */
function dateStamp(dateISO: string): string {
  return dateISO.replaceAll("-", "");
}

/** Escape per RFC 5545 (commas, semicolons, backslashes) and flatten newlines. */
function esc(text: string): string {
  return text.replaceAll(/([,;\\])/g, "\\$1").replaceAll(/\r?\n/g, " ");
}

export function bookingsToICS(
  bookings: Array<BookingView>,
  people: PeopleData,
): string {
  const stamp = utcStamp(new Date().toISOString());
  const lines: Array<string> = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VelozHub//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:VelozHub",
  ];

  for (const b of bookings) {
    // byId may not contain the booker (e.g. a since-removed profile), so treat
    // the lookup as possibly missing even though the index type hides that.
    const name =
      (people.byId[b.person] as Person | undefined)?.name ?? "Someone";

    lines.push("BEGIN:VEVENT", `UID:${b.id}@velozhub`, `DTSTAMP:${stamp}`);

    if (b.allDay) {
      const summary = `${name} has the Veloz (all day)`;

      lines.push(
        `DTSTART;VALUE=DATE:${dateStamp(b.date)}`,
        `DTEND;VALUE=DATE:${dateStamp(addDaysISO(b.date, 1))}`,
        `SUMMARY:${esc(summary)}`,
      );
    } else {
      const range = timedRangeUtc(b.date, b.start, b.end);
      const summary = `${name} has the Veloz`;

      lines.push(
        `DTSTART:${utcStamp(range.startAt)}`,
        `DTEND:${utcStamp(range.endAt)}`,
        `SUMMARY:${esc(summary)}`,
      );
    }

    if (b.note) {
      lines.push(`DESCRIPTION:${esc(b.note)}`);
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

/** Trigger a browser download of an .ics file. */
export function downloadICS(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
