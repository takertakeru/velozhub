/**
 * Hand-written database types mirroring `supabase/migrations/0001_init.sql`.
 *
 * Once the schema is applied you can regenerate these from the live project with
 * `npx supabase gen types typescript --project-id <ref> > src/libs/supabase/types.ts`
 * and drop this hand-written version. Kept manual for now so the scaffold has
 * working types before any remote project exists.
 */

export type ProfileRole = "member" | "admin";
export type BookingStatus = "confirmed" | "cancelled";

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
  created_at: string;
};

export type Vehicle = {
  id: string;
  household_id: string;
  name: string;
  plate: string | null;
  color: string;
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
  created_at: string;
};

export type BookingRider = {
  booking_id: string;
  profile_id: string;
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
        Omit<Profile, "created_at"> & { created_at?: string },
        Partial<Profile>
      >;
      vehicles: TableShape<
        Vehicle,
        Omit<Vehicle, "id" | "created_at"> & { id?: string; created_at?: string },
        Partial<Vehicle>
      >;
      bookings: TableShape<
        Booking,
        Omit<Booking, "id" | "created_at" | "status" | "all_day"> & {
          id?: string;
          created_at?: string;
          status?: BookingStatus;
          all_day?: boolean;
        },
        Partial<Booking>
      >;
      booking_riders: TableShape<BookingRider, BookingRider, Partial<BookingRider>>;
    };
    Views: Record<string, never>;
    Functions: {
      current_household_id: { Args: Record<string, never>; Returns: string };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      profile_role: ProfileRole;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
