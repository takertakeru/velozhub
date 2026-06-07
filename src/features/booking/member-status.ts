import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { MemberStatus, StatusIntent } from "@/libs/supabase/types";
import { bookingKeys } from "./queries";
import { todayManilaISO } from "./time";
import { type StatusView, toStatusView } from "./types";

/**
 * Going-out status (a soft "what I'm thinking" signal, weaker than a booking).
 *
 * Each member has at most one current status, aimed at a single Manila day.
 * `useMemberStatuses` reads everyone's current ones (stale days are filtered out
 * server-side, so a "tomorrow" status becomes "today" on its own and an old one
 * just disappears). `useSetMyStatus` upserts the signed-in user's status;
 * `useClearMyStatus` removes it. Realtime keeps the household in sync; see
 * `useBookingsRealtime`. See `supabase/migrations/0012_member_status.sql`.
 */

/** Everyone's current status, keyed by profile id (at most one per person). */
export function useMemberStatuses() {
  return useQuery({
    queryKey: bookingKeys.statuses,
    staleTime: 30 * 1000,
    queryFn: async (): Promise<Record<string, StatusView>> => {
      const { data, error } = await supabase
        .from("member_status")
        .select("*")
        .gte("for_date", todayManilaISO());

      if (error) {throw error;}

      const byId: Record<string, StatusView> = {};

      for (const row of data as Array<MemberStatus>) {
        byId[row.user_id] = toStatusView(row);
      }

      return byId;
    },
  });
}

export type SetStatusInput = {
  householdId: string;
  /** The signed-in user's profile id. */
  me: string;
  intent: StatusIntent;
  /** Manila local date the status is about, "yyyy-MM-dd". */
  forDate: string;
  note?: string;
};

/** Set (or replace) the signed-in user's status. Upsert keyed on user_id. */
export function useSetMyStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, me, intent, forDate, note }: SetStatusInput) => {
      const { error } = await supabase.from("member_status").upsert(
        {
          user_id: me,
          household_id: householdId,
          intent,
          for_date: forDate,
          note: note?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.statuses });
    },
  });
}

/** Clear the signed-in user's status. */
export function useClearMyStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (me: string) => {
      const { error } = await supabase.from("member_status").delete().eq("user_id", me);

      if (error) {throw error;}
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.statuses });
    },
  });
}
