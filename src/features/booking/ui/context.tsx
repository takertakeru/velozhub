/**
 * Booking UI context.
 *
 * The design prototype hardcoded the household (a global `PEOPLE` map and a
 * `CURRENT_USER` constant). The real app gets both from Supabase: `useProfiles`
 * supplies everyone keyed by profile id, and `useMe` supplies the signed-in
 * user's id. This context threads those through the screen tree so the ported
 * components can look up a person by id and tell which booking is "yours",
 * exactly as the prototype did, without prop-drilling.
 */
import { createContext, useContext } from "react";
import type { PeopleData } from "../queries";
import type { Person } from "../types";

export type BookingUiContextValue = {
  people: PeopleData;
  /** Signed-in user's profile id. */
  me: string;
};

const BookingUiContext = createContext<BookingUiContextValue | null>(null);

export const BookingUiProvider = BookingUiContext.Provider;

export function useBookingUi(): BookingUiContextValue {
  const value = useContext(BookingUiContext);

  if (!value) {
    throw new Error("BookingUi components must be used within BookingUiProvider");
  }

  return value;
}

/**
 * Plain (non-hook) lookup of a person by id, with a neutral fallback for unknown
 * ids. Use this inside loops/branches where a hook would break the rules of
 * hooks; pass in `people` from `useBookingUi`.
 */
export function personOf(people: PeopleData, id: string): Person {
  return (
    people.byId[id] ?? {
      id,
      name: "Unknown",
      color: "var(--ink-3)",
      initials: "?",
    }
  );
}

/** Hook form for the common single-lookup case at the top of a component. */
export function usePerson(id: string): Person {
  return personOf(useBookingUi().people, id);
}

/** The signed-in user's profile id. */
export function useMeId(): string {
  return useBookingUi().me;
}

/** Profile ids in seed order. */
export function usePeopleOrder(): Array<string> {
  return useBookingUi().people.order;
}
