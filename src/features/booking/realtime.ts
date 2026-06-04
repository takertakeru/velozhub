import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import { bookingKeys } from "./queries";

/**
 * Live sync. Subscribes to Postgres changes on the booking tables and
 * invalidates the affected queries so every phone in the household updates the
 * moment someone books, votes, edits, or cancels. A booking or vote change can
 * flip a proposal between pending and confirmed, so both the bookings and polls
 * queries are refreshed together. RLS still applies to realtime payloads, so a
 * client only hears about its own household.
 *
 * Mount once, high in the authenticated tree (the app shell).
 */
export function useBookingsRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    /**
     * A booking/rider/vote change can move a row between the bookings
     * (confirmed) and polls (pending) lists, so refresh both.
     */
    const invalidateBookingsAndPolls = () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
      void qc.invalidateQueries({ queryKey: bookingKeys.polls });
      // A decline flips a proposal to rejected; refresh the proposer's notice.
      void qc.invalidateQueries({ queryKey: bookingKeys.rejections });
    };

    /**
     * A give-way ask, answer, or claim moves a request between the holder's
     * inbox and the asker's result notice; giving way also cancels a booking.
     */
    const invalidateGiveways = () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayInbox });
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayResults });
      void qc.invalidateQueries({ queryKey: bookingKeys.givewayPending });
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    };

    const channel = supabase
      .channel("velozhub-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        invalidateBookingsAndPolls,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_riders" },
        invalidateBookingsAndPolls,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_votes" },
        invalidateBookingsAndPolls,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "giveway_requests" },
        invalidateGiveways,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        () => {
          void qc.invalidateQueries({ queryKey: bookingKeys.vehicle });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fuel_logs" },
        () => {
          void qc.invalidateQueries({ queryKey: bookingKeys.fuelLogs });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}
