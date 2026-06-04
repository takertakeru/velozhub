import type {
  Booking as BookingRow,
  FuelBrand,
  GivewayRequest,
  GivewayStatus,
  Profile,
  ProfileRole,
} from "@/libs/supabase/types";
import { localPartsOf } from "./time";

/**
 * Domain models for the UI layer.
 *
 * The database stores bookings as UTC `timestamptz` ranges (see
 * `src/libs/supabase/types.ts`). The screens, however, think in Manila
 * wall-clock: a local date plus "HH:mm" start/end, mirroring the design
 * prototype. `BookingView` is that UI-facing shape, derived from a row via
 * `toBookingView`.
 */

/** A person in the household (driver). Color drives the per-person tagging. */
export type Person = {
  id: string;
  name: string;
  color: string;
  initials: string;
  role: ProfileRole;
  /** When true, a poll never waits on this member to confirm. */
  voteOptional: boolean;
};

/** UI-facing booking: Manila local date + times, riders as profile ids. */
export type BookingView = {
  id: string;
  vehicleId: string;
  householdId: string;
  /** Profile id of the person who booked. */
  person: string;
  /** Manila local date, "yyyy-MM-dd". */
  date: string;
  allDay: boolean;
  /** "HH:mm" Manila local; empty when allDay. */
  start: string;
  end: string;
  riders: Array<string>;
  note: string;
};

/** A booking draft being created or edited in the form. */
export type BookingDraft = {
  /** Present when editing an existing booking. */
  id?: string;
  person: string;
  date: string;
  allDay: boolean;
  start: string;
  end: string;
  riders: Array<string>;
  note: string;
};

/** Row shape returned by the bookings query (riders joined in). */
export type BookingRowWithRiders = BookingRow & {
  booking_riders: Array<{ profile_id: string }>;
};

/** A single member's vote on a poll, UI-facing. */
export type PollVote = { profileId: string; approve: boolean };

/** A pending booking being voted on: the proposed booking plus its tally. */
export type PollView = BookingView & {
  /** Close of the 15-minute silence window, ISO; null once decided. */
  deadline: string | null;
  votes: Array<PollVote>;
};

/** Row shape from the polls query (riders + votes joined in). */
export type PollRow = BookingRowWithRiders & {
  booking_votes: Array<{ profile_id: string; approve: boolean }>;
};

/**
 * A booking the signed-in user proposed that another member declined, shaped for
 * the notice modal: the original slot plus who declined and their reason (null
 * when they gave none).
 */
export type RejectionView = BookingView & {
  /** Profile id of the member who declined; null for non-member rejections. */
  declinedBy: string | null;
  reason: string | null;
};

/** Selectable gas-station brands, in the order shown in the log form. */
export const fuelBrands: ReadonlyArray<FuelBrand> = [
  "Petron",
  "Shell",
  "Caltex",
  "Phoenix",
  "Seaoil",
  "Unioil",
  "Jetti",
  "Others",
];

/** Peso amount as "₱2,500" (whole) or "₱2,500.50" (with centavos). */
export function fmtPeso(amount: number): string {
  const hasCentavos = Math.round(amount * 100) % 100 !== 0;

  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: hasCentavos ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Build a Person from a profile row. Initials are derived from the name. */
export function toPerson(profile: Profile): Person {
  return {
    id: profile.id,
    name: profile.display_name,
    color: profile.color,
    initials: initialsOf(profile.display_name),
    role: profile.role,
    voteOptional: profile.vote_optional,
  };
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {return parts[0].slice(0, 1).toUpperCase();}

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Map a pending booking row (with its votes) to the UI poll shape. */
export function toPollView(row: PollRow): PollView {
  return {
    ...toBookingView(row),
    deadline: row.poll_deadline,
    votes: row.booking_votes.map((v) => ({ profileId: v.profile_id, approve: v.approve })),
  };
}

/**
 * A give-way request, shaped for the UI: the contested slot in Manila-local
 * parts plus both parties, the asker's reason, the current status, and the
 * holder's reason on a decline. Drives both the holder's inbox and the asker's
 * result notice. Derived from a row via `toGivewayView`.
 */
export type GivewayView = {
  id: string;
  /** The contested confirmed booking. */
  bookingId: string;
  /** Profile id of the asker. */
  fromUser: string;
  /** Profile id of the current holder. */
  toUser: string;
  /** Manila local date, "yyyy-MM-dd". */
  date: string;
  allDay: boolean;
  /** "HH:mm" Manila local; empty when allDay. */
  start: string;
  end: string;
  /** The asker's reason for asking; null when none given. */
  reason: string | null;
  status: GivewayStatus;
  /** The holder's reason on a decline; null otherwise. */
  responseReason: string | null;
};

/** Map a give-way request row (UTC slot) to the Manila-local UI shape. */
export function toGivewayView(row: GivewayRequest): GivewayView {
  const { dateISO, start, end } = localPartsOf(row.start_at, row.end_at);

  return {
    id: row.id,
    bookingId: row.booking_id,
    fromUser: row.from_user,
    toUser: row.to_user,
    date: dateISO,
    allDay: row.all_day,
    start: row.all_day ? "" : start,
    end: row.all_day ? "" : end,
    reason: row.reason,
    status: row.status,
    responseReason: row.response_reason,
  };
}

/** Map a rejected booking row to the notice shape (slot + decliner + reason). */
export function toRejectionView(row: BookingRowWithRiders): RejectionView {
  return {
    ...toBookingView(row),
    declinedBy: row.declined_by,
    reason: row.decline_reason,
  };
}

/** Map a stored booking row (UTC) to the Manila-local UI shape. */
export function toBookingView(row: BookingRowWithRiders): BookingView {
  const { dateISO, start, end } = localPartsOf(row.start_at, row.end_at);

  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    householdId: row.household_id,
    person: row.user_id,
    date: dateISO,
    allDay: row.all_day,
    start: row.all_day ? "" : start,
    end: row.all_day ? "" : end,
    riders: row.booking_riders.map((r) => r.profile_id),
    note: row.note ?? "",
  };
}
