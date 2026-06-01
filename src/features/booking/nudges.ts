import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { Nudge } from "@/libs/supabase/types";

/**
 * Request-the-car nudges.
 *
 * `useSendNudge` records a request aimed at whoever currently has the car;
 * `useNudgeInbox` subscribes to the ones addressed to the signed-in user and
 * fires a callback (used to show a toast) the instant one arrives. The same
 * table is where a future web-push sender would read from.
 */

export type SendNudgeInput = {
  householdId: string;
  fromUser: string;
  toUser: string;
  bookingId: string | null;
  message?: string;
};

export function useSendNudge() {
  return useMutation({
    mutationFn: async ({
      householdId,
      fromUser,
      toUser,
      bookingId,
      message,
    }: SendNudgeInput) => {
      const { error } = await supabase.from("nudges").insert({
        household_id: householdId,
        from_user: fromUser,
        to_user: toUser,
        booking_id: bookingId,
        message: message ?? null,
      });

      if (error) {
        throw error;
      }
    },
  });
}

/**
 * Subscribe to incoming nudges for `me` and invoke `onReceive` for each. Pass a
 * stable `onReceive` (memoize it) so the subscription is not torn down on every
 * render.
 */
export function useNudgeInbox(me: string, onReceive: (nudge: Nudge) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("velozhub-nudges")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "nudges",
          filter: `to_user=eq.${me}`,
        },
        (payload) => {
          onReceive(payload.new as Nudge);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [me, onReceive]);
}
