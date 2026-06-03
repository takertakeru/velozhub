/**
 * Hand-written database types mirroring `supabase/migrations/0001_init.sql`.
 *
 * Once the schema is applied you can regenerate these from the live project with
 * `npx supabase gen types typescript --project-id <ref> > src/libs/supabase/types.ts`
 * and drop this hand-written version. Kept manual for now so the scaffold has
 * working types before any remote project exists.
 */

export type ProfileRole = "member" | "admin";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "rejected";
/** Gas-station brands we track; "Others" is the catch-all for anything else. */
export type FuelBrand =
  | "Petron"
  | "Shell"
  | "Caltex"
  | "Phoenix"
  | "Seaoil"
  | "Unioil"
  | "Jetti"
  | "Others";

export type Household = {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
};

export type Profile = {
  id: string;
  household_id: string;
  display_name: string;
  color: string;
  role: ProfileRole;
  /** When true, the poll never waits on this member and their approval is not
   * required to confirm. They may still vote (and a decline still rejects). */
  vote_optional: boolean;
  created_at: string;
};

export type Vehicle = {
  id: string;
  household_id: string;
  name: string;
  plate: string | null;
  color: string;
  /** Fuel remaining, 0-100 percent. */
  fuel_level: number;
  fuel_updated_at: string | null;
  fuel_updated_by: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  vehicle_id: string;
  household_id: string;
  user_id: string;
  start_at: string;
  end_at: string;
  all_day: boolean;
  note: string | null;
  status: BookingStatus;
  /** Close of the 15-minute silence window for a pending poll; null once the
   * proposal is decided. */
  poll_deadline: string | null;
  created_at: string;
};

export type BookingRider = {
  booking_id: string;
  profile_id: string;
};

/** One member's vote on a pending booking. True approves, false declines. */
export type BookingVote = {
  booking_id: string;
  profile_id: string;
  approve: boolean;
  created_at: string;
};

/**
 * One logged fill-up on the shared vehicle. `amount_php` is the peso spend,
 * `created_at` is when it was logged (shown in the history). The live gauge
 * percentage lives on `vehicles`. This is the append-only spend ledger.
 */
export type FuelLog = {
  id: string;
  vehicle_id: string;
  household_id: string;
  user_id: string;
  amount_php: number;
  brand: FuelBrand;
  fuel_type: string;
  created_at: string;
};

export type Nudge = {
  id: string;
  household_id: string;
  booking_id: string | null;
  from_user: string;
  to_user: string;
  message: string | null;
  seen: boolean;
  created_at: string;
};

type TableShape<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      households: TableShape<
        Household,
        Omit<Household, "id" | "created_at"> & { id?: string; created_at?: string },
        Partial<Household>
      >;
      profiles: TableShape<
        Profile,
        Omit<Profile, "created_at" | "vote_optional"> & {
          created_at?: string;
          vote_optional?: boolean;
        },
        Partial<Profile>
      >;
      vehicles: TableShape<
        Vehicle,
        Omit<
          Vehicle,
          "id" | "created_at" | "fuel_level" | "fuel_updated_at" | "fuel_updated_by"
        > & {
          id?: string;
          created_at?: string;
          fuel_level?: number;
          fuel_updated_at?: string | null;
          fuel_updated_by?: string | null;
        },
        Partial<Vehicle>
      >;
      bookings: TableShape<
        Booking,
        Omit<
          Booking,
          "id" | "created_at" | "status" | "all_day" | "poll_deadline"
        > & {
          id?: string;
          created_at?: string;
          status?: BookingStatus;
          all_day?: boolean;
          poll_deadline?: string | null;
        },
        Partial<Booking>
      >;
      booking_riders: TableShape<BookingRider, BookingRider, Partial<BookingRider>>;
      booking_votes: TableShape<
        BookingVote,
        Omit<BookingVote, "created_at"> & { created_at?: string },
        Partial<BookingVote>
      >;
      fuel_logs: TableShape<
        FuelLog,
        Omit<FuelLog, "id" | "created_at" | "fuel_type"> & {
          id?: string;
          created_at?: string;
          fuel_type?: string;
        },
        Partial<FuelLog>
      >;
      nudges: TableShape<
        Nudge,
        Omit<Nudge, "id" | "created_at" | "seen"> & {
          id?: string;
          created_at?: string;
          seen?: boolean;
        },
        Partial<Nudge>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      current_household_id: { Args: Record<string, never>; Returns: string };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      cast_booking_vote: {
        Args: { p_booking_id: string; p_approve: boolean };
        Returns: BookingStatus;
      };
      resolve_due_polls: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: {
      profile_role: ProfileRole;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
