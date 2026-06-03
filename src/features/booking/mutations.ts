import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { FuelBrand } from "@/libs/supabase/types";
import { bookingKeys } from "./queries";
import { allDayRangeUtc, timedRangeUtc } from "./time";
import type { BookingDraft } from "./types";

/**
 * Booking writes. The Postgres exclusion constraint is the real guard against
 * double-booking; `mapBookingError` turns its violation into a friendly message.
 */

type PostgrestLikeError = { code?: string; message?: string };

export function mapBookingError(error: PostgrestLikeError): Error {
  if (
    error.code === "23P01" ||
    (error.message ?? "").includes("bookings_no_overlap")
  ) {
    return new Error(
      "That time was just taken on the car. Pick a different time.",
    );
  }

  return new Error(error.message ?? "Could not save the booking.");
}

/** UTC range for a draft, depending on the all-day flag. */
function rangeFor(draft: BookingDraft) {
  return draft.allDay
    ? allDayRangeUtc(draft.date)
    : timedRangeUtc(draft.date, draft.start, draft.end);
}

async function replaceRiders(bookingId: string, riders: Array<string>) {
  const { error: delError } = await supabase
    .from("booking_riders")
    .delete()
    .eq("booking_id", bookingId);

  if (delError) {throw delError;}

  if (riders.length === 0) {return;}

  const rows = riders.map((profileId) => { return {
    booking_id: bookingId,
    profile_id: profileId,
  } });
  const { error: insError } = await supabase
    .from("booking_riders")
    .insert(rows);

  if (insError) {throw insError;}
}

export type CreateBookingInput = {
  draft: BookingDraft;
  vehicleId: string;
  householdId: string;
  userId: string;
};

/**
 * Create a new booking as a proposal (status 'pending') plus its riders, then
 * auto-cast the proposer's approve. The poll, not this insert, confirms the
 * booking: it stays pending until one other member approves (or the 15-minute
 * silence window elapses). Pending rows are exempt from the overlap constraint,
 * so two proposals for the same slot can coexist until one wins.
 */
export function useCreateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      draft,
      vehicleId,
      householdId,
      userId,
    }: CreateBookingInput) => {
      const range = rangeFor(draft);
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          vehicle_id: vehicleId,
          household_id: householdId,
          user_id: userId,
          start_at: range.startAt,
          end_at: range.endAt,
          all_day: draft.allDay,
          note: draft.note.trim() || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {throw mapBookingError(error);}

      await replaceRiders(data.id, draft.riders);

      const { error: voteError } = await supabase.rpc("cast_booking_vote", {
        p_booking_id: data.id,
        p_approve: true,
      });

      if (voteError) {throw voteError;}

      return data.id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
      void qc.invalidateQueries({ queryKey: bookingKeys.polls });
    },
  });
}

export type UpdateBookingInput = { id: string; draft: BookingDraft };

/** Edit an existing booking (times/all-day/note + riders). */
export function useUpdateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, draft }: UpdateBookingInput) => {
      const range = rangeFor(draft);
      const { error } = await supabase
        .from("bookings")
        .update({
          start_at: range.startAt,
          end_at: range.endAt,
          all_day: draft.allDay,
          note: draft.note.trim() || null,
        })
        .eq("id", id);

      if (error) {throw mapBookingError(error);}

      await replaceRiders(id, draft.riders);

      return id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    },
  });
}

export type UpdateFuelInput = {
  vehicleId: string;
  level: number;
  userId: string;
};

/** Record the shared vehicle's current fuel level (0-100). */
export function useUpdateFuel() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, level, userId }: UpdateFuelInput) => {
      const { error } = await supabase
        .from("vehicles")
        .update({
          fuel_level: level,
          fuel_updated_at: new Date().toISOString(),
          fuel_updated_by: userId,
        })
        .eq("id", vehicleId);

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.vehicle });
    },
  });
}

export type LogFuelInput = {
  vehicleId: string;
  householdId: string;
  userId: string;
  amountPhp: number;
  brand: FuelBrand;
};

/**
 * Record a fuel fill-up: peso amount + station brand for the shared Veloz. The
 * timestamp is the row's `created_at` default (now). The Veloz runs on unleaded,
 * so `fuel_type` falls back to the column default rather than being a form field.
 */
export function useLogFuel() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehicleId,
      householdId,
      userId,
      amountPhp,
      brand,
    }: LogFuelInput) => {
      const { error } = await supabase.from("fuel_logs").insert({
        vehicle_id: vehicleId,
        household_id: householdId,
        user_id: userId,
        amount_php: amountPhp,
        brand,
      });

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.fuelLogs });
    },
  });
}

/**
 * Cancel a booking. We soft-cancel (status = 'cancelled') rather than delete:
 * the exclusion constraint ignores cancelled rows, so the slot frees up, and we
 * keep the record. RLS already limits this to the owner or an admin.
 */
export function useCancelBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) {throw error;}

      return id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    },
  });
}
