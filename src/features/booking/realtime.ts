import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import { bookingKeys } from "./queries";

/**
 * Live sync. Subscribes to Postgres changes on the booking tables and
 * invalidates the bookings query so every phone in the household updates the
 * moment someone books, edits, or cancels. RLS still applies to realtime
 * payloads, so a client only hears about its own household.
 *
 * Mount once, high in the authenticated tree (the app shell).
 */
export function useBookingsRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const invalidate = () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.bookings });
    };

    const channel = supabase
      .channel("velozhub-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        invalidate,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_riders" },
        invalidate,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}
