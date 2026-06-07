import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { MemberStatus, StatusIntent } from "@/libs/supabase/types";
import { bookingKeys } from "./queries";
import { todayManilaISO } from "./time";
import { type StatusView, toStatusView } from "./types";

/**
 * Going-out status (a soft "what I'm thinking" signal, weaker than a booking).
 *
 * A member may hold one status per day (today and/or tomorrow), so plans can be
 * set ahead. `useMemberStatuses` reads everyone's current ones as a flat list
 * (stale days are filtered out server-side, so a "tomorrow" status becomes
 * "today" on its own and an old one just disappears). `useSaveMyStatuses` writes
 * the signed-in user's plans for a set of days in one shot: a day with an intent
 * is upserted, a day with a null intent is cleared. Realtime keeps the household
 * in sync; see `useBookingsRealtime` and `supabase/migrations/0012_member_status.sql`.
 */

/** Everyone's current statuses (today and later), newest day last. */
export function useMemberStatuses() {
  return useQuery({
    queryKey: bookingKeys.statuses,
    staleTime: 30 * 1000,
    queryFn: async (): Promise<Array<StatusView>> => {
      const { data, error } = await supabase
        .from("member_status")
        .select("*")
        .gte("for_date", todayManilaISO());

      if (error) {throw error;}

      return (data as Array<MemberStatus>).map(toStatusView);
    },
  });
}

/** One day's desired plan. A null `intent` means "clear that day". */
export type DayPlan = {
  /** Manila local date the plan is about, "yyyy-MM-dd". */
  forDate: string;
  intent: StatusIntent | null;
  note?: string;
};

export type SaveStatusesInput = {
  householdId: string;
  /** The signed-in user's profile id. */
  me: string;
  days: Array<DayPlan>;
};

/** Narrows a DayPlan to one that actually carries an intent (is being set). */
function isSet(day: DayPlan): day is DayPlan & { intent: StatusIntent } {
  return day.intent !== null;
}

/**
 * Save the signed-in user's plans for several days at once. Days with an intent
 * are upserted (keyed on user_id + for_date); days with a null intent are
 * deleted, so deselecting a day clears it.
 */
export function useSaveMyStatuses() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, me, days }: SaveStatusesInput) => {
      const toUpsert = days.filter(isSet).map((day) => { return {
        user_id: me,
        household_id: householdId,
        intent: day.intent,
        for_date: day.forDate,
        note: day.note?.trim() || null,
        updated_at: new Date().toISOString(),
      } });
      const toClear = days.filter((day) => day.intent === null).map((day) => day.forDate);

      if (toUpsert.length > 0) {
        const { error } = await supabase
          .from("member_status")
          .upsert(toUpsert, { onConflict: "user_id,for_date" });

        if (error) {throw error;}
      }

      if (toClear.length > 0) {
        const { error } = await supabase
          .from("member_status")
          .delete()
          .eq("user_id", me)
          .in("for_date", toClear);

        if (error) {throw error;}
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.statuses });
    },
  });
}
