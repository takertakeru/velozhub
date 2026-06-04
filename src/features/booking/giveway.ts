import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { GivewayRequest, GivewayStatus } from "@/libs/supabase/types";
import { mapBookingError, replaceRiders } from "./mutations";
import { bookingKeys } from "./queries";
import { type GivewayView, toGivewayView } from "./types";

/**
 * Give-way requests (ask the holder to yield a confirmed slot).
 *
 * A member asks the current holder of a confirmed booking to give it up. The
 * holder answers through `useRespondGiveway`: giving way frees the slot (their
 * booking is cancelled, server-side), keeping it declines with an optional
 * reason. Once freed, the asker takes the slot with `useClaimGiveway`, which
 * inserts their booking confirmed-directly (the give-way is the approval, so it
 * skips the poll). `useGivewayInbox` lists the holder's open asks;
 * `useMyGivewayResults` lists the asker's resolved-but-unseen ones for the
 * result notice. See `supabase/migrations/0011_giveway.sql`.
 */

/** Resolved statuses the asker still needs to see (drives the result notice). */
const unseenResultStatuses: Array<GivewayStatus> = [
  "accepted",
  "declined",
  "withdrawn",
];

/**
 * Open asks `me` has sent (`from_user = me`, still pending). Lets the booking
 * detail sheet show "waiting for an answer" with a withdraw, instead of offering
 * the ask again on a slot already in flight.
 */
export function useMyPendingGiveways(me: string) {
  return useQuery({
    queryKey: [...bookingKeys.givewayPending, me],
    staleTime: 15 * 1000,
    queryFn: async (): Promise<Array<GivewayView>> => {
      const { data, error } = await supabase
        .from("giveway_requests")
        .select("*")
        .eq("from_user", me)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {throw error;}

      return (data as Array<GivewayRequest>).map(toGivewayView);
    },
  });
}

/** Open requests aimed at `me` (the current holder), newest first. */
export function useGivewayInbox(me: string) {
  return useQuery({
    queryKey: [...bookingKeys.givewayInbox, me],
    staleTime: 15 * 1000,
    queryFn: async (): Promise<Array<GivewayView>> => {
      const { data, error } = await supabase
        .from("giveway_requests")
        .select("*")
        .eq("to_user", me)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {throw error;}

      return (data as Array<GivewayRequest>).map(toGivewayView);
    },
  });
}

/**
 * Requests `me` sent that have resolved (given way, declined, or withdrawn out
 * from under) and have not been acknowledged yet. Drives the result notice;
 * realtime keeps it fresh (see `useBookingsRealtime`).
 */
export function useMyGivewayResults(me: string) {
  return useQuery({
    queryKey: [...bookingKeys.givewayResults, me],
    staleTime: 15 * 1000,
    queryFn: async (): Promise<Array<GivewayView>> => {
      const { data, error } = await supabase
        .from("giveway_requests")
        .select("*")
        .eq("from_user", me)
        .in("status", unseenResultStatuses)
        .eq("seen", false)
        .order("resolved_at", { ascending: false });

      if (error) {throw error;}

      return (data as Array<GivewayRequest>).map(toGivewayView);
    },
  });
}

/** Open an ask for someone else's confirmed booking. Idempotent server-side. */
export function useRequestGiveway() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason?: string;
    }) => {
      const { data, error } = await supabase.rpc("request_giveway", {
        p_booking_id: bookingId,
        p_reason: reason ?? null,
      });

      if (error) {throw error;}

      return data; // the new request id
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayPending });
    },
  });
}

export type RespondGivewayInput = {
  requestId: string;
  accept: boolean;
  /** Optional free-text reason, only meaningful on a decline. */
  reason?: string;
};

/**
 * The holder's answer. Accepting cancels their booking to free the slot;
 * declining records the reason. The RPC resolves it server-side and returns the
 * resulting status.
 */
export function useRespondGiveway() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, accept, reason }: RespondGivewayInput) => {
      const { data, error } = await supabase.rpc("respond_giveway", {
        p_request_id: requestId,
        p_accept: accept,
        p_reason: reason ?? null,
      });

      if (error) {throw error;}

      return data; // the resulting GivewayStatus
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayInbox });
      // Accepting cancels the holder's booking, which frees the slot.
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    },
  });
}

export type ClaimGivewayInput = {
  requestId: string;
  note?: string;
  riders?: Array<string>;
};

/**
 * The asker takes the freed slot. The RPC inserts their booking confirmed and
 * returns its id; riders, if any, are written after (mirroring useCreateBooking).
 * If a third person grabbed the slot first, the overlap constraint surfaces as
 * the familiar "that time was just taken" message via `mapBookingError`.
 */
export function useClaimGiveway() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, note, riders }: ClaimGivewayInput) => {
      const { data, error } = await supabase.rpc("claim_giveway", {
        p_request_id: requestId,
        p_note: note ?? null,
      });

      if (error) {throw mapBookingError(error);}

      if (riders && riders.length > 0) {
        await replaceRiders(data, riders);
      }

      return data; // the new booking id
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayResults });
    },
  });
}

/**
 * Mark a resolved request's notice as acknowledged so it stops popping. The
 * participant update policy lets the asker flip their own request's `seen`.
 */
export function useAcknowledgeGiveway() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("giveway_requests")
        .update({ seen: true })
        .eq("id", requestId);

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayResults });
    },
  });
}

/**
 * The asker pulls a still-pending ask. Flips it to 'withdrawn' and marks it seen
 * so it never pops a result notice back at them. RLS already limits this to the
 * asker (the participant update policy).
 */
export function useWithdrawGiveway() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("giveway_requests")
        .update({ status: "withdrawn", seen: true })
        .eq("id", requestId);

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayInbox });
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayResults });
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayPending });
    },
  });
}
