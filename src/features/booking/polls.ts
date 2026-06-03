import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import { mapBookingError } from "./mutations";
import { bookingKeys } from "./queries";
import { type PollRow, type PollView, toPollView } from "./types";

/**
 * Booking polls.
 *
 * A new booking is a proposal (status 'pending') the household votes on.
 * `usePolls` lists the open proposals with their tallies; `useCastVote` records
 * an approve/decline through the `cast_booking_vote` RPC (which confirms or
 * rejects server-side, atomically); `usePollResolver` nudges the server to
 * auto-confirm a proposal once its 15-minute silence window elapses, so the
 * timeout works even before pg_cron is enabled.
 */

/** Open proposals (status 'pending') for the household, with their vote tally. */
export function usePolls() {
  return useQuery({
    queryKey: bookingKeys.polls,
    staleTime: 15 * 1000,
    queryFn: async (): Promise<Array<PollView>> => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "*, booking_riders(profile_id), booking_votes(profile_id, approve)",
        )
        .eq("status", "pending")
        .order("poll_deadline", { ascending: true });

      if (error) {throw error;}

      return (data as unknown as Array<PollRow>).map(toPollView);
    },
  });
}

export type CastVoteInput = { bookingId: string; approve: boolean };

/**
 * Record this member's approve/decline on a proposal. The RPC resolves the poll
 * server-side: a decline rejects it, a final approval confirms it.
 */
export function useCastVote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, approve }: CastVoteInput) => {
      const { data, error } = await supabase.rpc("cast_booking_vote", {
        p_booking_id: bookingId,
        p_approve: approve,
      });

      if (error) {throw error;}

      return data; // the resulting BookingStatus
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.polls });
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    },
  });
}

export type AdminDecideInput = {
  bookingId: string;
  decision: "confirmed" | "rejected";
};

/**
 * Admin override: force a stalled poll to confirm or reject, bypassing the vote.
 * RLS already lets an admin update any booking in the household. Confirming can
 * still hit the overlap constraint if the slot was taken, surfaced as a friendly
 * error.
 */
export function useAdminDecidePoll() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, decision }: AdminDecideInput) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: decision })
        .eq("id", bookingId);

      if (error) {throw mapBookingError(error);}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.polls });
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    },
  });
}

/**
 * Opportunistic timeout resolver. Schedules a single timer to the soonest poll
 * deadline; when it fires (or right away, for an already-overdue poll) it asks
 * the server to confirm any poll whose 15-minute silence window has elapsed,
 * then lets realtime invalidation refresh the list. Mount once, high in the
 * authenticated tree. Redundant once pg_cron is running, harmless alongside it.
 */
export function usePollResolver() {
  const qc = useQueryClient();
  const pollsQ = usePolls();
  const polls = pollsQ.data;

  useEffect(() => {
    if (!polls || polls.length === 0) {return;}

    const deadlines = polls
      .map((p) => (p.deadline ? new Date(p.deadline).getTime() : null))
      .filter((t): t is number => t !== null);

    if (deadlines.length === 0) {return;}

    const soonest = Math.min(...deadlines);
    // Small buffer so the server clock is comfortably past the deadline.
    const delay = Math.max(0, soonest - Date.now()) + 1000;

    const id = setTimeout(() => {
      void supabase.rpc("resolve_due_polls").then(() => {
        void qc.invalidateQueries({ queryKey: bookingKeys.polls });
        void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
      });
    }, delay);

    return () => { clearTimeout(id); };
  }, [polls, qc]);
}
