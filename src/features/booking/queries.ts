import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/libs/supabase/client";
import type { FuelLog } from "@/libs/supabase/types";
import {
  type BookingRowWithRiders,
  type BookingView,
  type Person,
 toBookingView, toPerson } from "./types";

export const bookingKeys = {
  me: ["me"] as const,
  profiles: ["profiles"] as const,
  vehicle: ["vehicle"] as const,
  bookings: ["bookings"] as const,
  polls: ["polls"] as const,
  rejections: ["rejections"] as const,
  givewayInbox: ["giveway-inbox"] as const,
  givewayResults: ["giveway-results"] as const,
  givewayPending: ["giveway-pending"] as const,
  fuelLogs: ["fuel-logs"] as const,
};

export type PeopleData = {
  byId: Record<string, Person>;
  order: Array<string>;
};

/** The signed-in user's profile id (their `auth.uid()`). */
export function useMe() {
  return useQuery({
    queryKey: bookingKeys.me,
    staleTime: Infinity,
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {throw error;}

      return data.user.id;
    },
  });
}

/** Everyone in the household, keyed by profile id, plus seed order. */
export function useProfiles() {
  return useQuery({
    queryKey: bookingKeys.profiles,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<PeopleData> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {throw error;}

      const byId: Record<string, Person> = {};
      const order: Array<string> = [];

      for (const row of data) {
        byId[row.id] = toPerson(row);
        order.push(row.id);
      }

      return { byId, order };
    },
  });
}

/** The household's single vehicle (the Veloz). */
export function useVehicle() {
  return useQuery({
    queryKey: bookingKeys.vehicle,
    staleTime: Infinity,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (error) {throw error;}

      return data;
    },
  });
}

/**
 * All confirmed bookings for the household, mapped to the Manila-local UI shape.
 * The dataset is tiny (one family, one car), so we fetch them all and slice by
 * date on the client. Realtime keeps this fresh; see `useBookingsRealtime`.
 */
export function useBookings() {
  return useQuery({
    queryKey: bookingKeys.bookings,
    staleTime: 30 * 1000,
    queryFn: async (): Promise<Array<BookingView>> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, booking_riders(profile_id)")
        .eq("status", "confirmed")
        .order("start_at", { ascending: true });

      if (error) {throw error;}

      return (data as unknown as Array<BookingRowWithRiders>).map(toBookingView);
    },
  });
}

/**
 * Every fuel fill-up logged for the household, newest first. Like bookings, the
 * dataset is tiny (one family, one car), so we fetch them all and let the
 * history screen paginate and total them on the client. Realtime keeps it fresh.
 */
export function useFuelLogs() {
  return useQuery({
    queryKey: bookingKeys.fuelLogs,
    staleTime: 30 * 1000,
    queryFn: async (): Promise<Array<FuelLog>> => {
      const { data, error } = await supabase
        .from("fuel_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {throw error;}

      return data;
    },
  });
}
