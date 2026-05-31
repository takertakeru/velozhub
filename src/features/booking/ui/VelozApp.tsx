/**
 * VelozHub app shell, ported from the design prototype (`veloz-app.jsx`).
 *
 * Where the prototype kept bookings in local state against a simulated clock,
 * this shell is wired to the real data layer: TanStack Query hooks for the
 * household, vehicle, and bookings; realtime invalidation so every phone stays
 * in sync; and the create/update/cancel mutations (the Postgres exclusion
 * constraint is the real double-booking guard, surfaced here as a toast).
 *
 * Responsive behaviour matches the prototype: container queries in `veloz.css`
 * drive the layout, and a ResizeObserver flips the `wide` flag that swaps the
 * phone and desktop component trees for Home and Week.
 */
import "./veloz.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { toaster } from "@/components/ui/toast";
import {
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "../mutations";
import { useBookings, useMe, useProfiles, useVehicle } from "../queries";
import { useBookingsRealtime } from "../realtime";
import { todayManilaISO } from "../time";
import type { BookingDraft, BookingView } from "../types";
import { Avatar } from "./components";
import { BookingUiProvider, personOf, useBookingUi } from "./context";
import * as Ic from "./icons";
import {
  BookingForm,
  DetailSheet,
  HomeScreen,
  WeekScreen,
} from "./screens";

type Screen = "home" | "week";
type FormState = { mode: "new" } | { mode: "edit"; id: string } | null;
type Theme = "light" | "dark";

/** Surface a mutation failure to the user as a toast notification. */
function notifyError(err: unknown, fallback: string) {
  toaster(err instanceof Error ? err.message : fallback);
}

/** Route-level entry: loads data, then renders the shell. */
export function VelozApp() {
  // Keep every phone in sync the moment a booking changes anywhere.
  useBookingsRealtime();

  const meQ = useMe();
  const profilesQ = useProfiles();
  const vehicleQ = useVehicle();
  const bookingsQ = useBookings();

  const isLoading =
    meQ.isLoading ||
    profilesQ.isLoading ||
    vehicleQ.isLoading ||
    bookingsQ.isLoading;

  if (isLoading) {
    return <Centered>Loading the family calendar…</Centered>;
  }

  const me = meQ.data;
  const people = profilesQ.data;
  const vehicle = vehicleQ.data;

  if (!me || !people || !vehicle) {
    return (
      <Centered>
        We could not load your household. Check your connection and try again.
      </Centered>
    );
  }

  return (
    <BookingUiProvider value={{ people, me }}>
      <Shell
        me={me}
        vehicleId={vehicle.id}
        householdId={vehicle.household_id}
        bookings={bookingsQ.data ?? []}
      />
    </BookingUiProvider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="veloz" data-theme="light">
      <div
        style={{
          height: "100%",
          display: "grid",
          placeItems: "center",
          padding: "var(--s6)",
          textAlign: "center",
          color: "var(--ink-2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Shell({
  me,
  vehicleId,
  householdId,
  bookings,
}: {
  me: string;
  vehicleId: string;
  householdId: string;
  bookings: Array<BookingView>;
}) {
  const { people } = useBookingUi();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [screen, setScreen] = useState<Screen>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);

  const createM = useCreateBooking();
  const updateM = useUpdateBooking();
  const cancelM = useCancelBooking();

  // Width-driven layout swap (container queries handle the CSS; this flips the
  // phone/desktop component trees for Home and Week).
  useEffect(() => {
    const el = rootRef.current;

    if (!el) {return;}

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {setIsWide(e.contentRect.width >= 1040);}
    });

    ro.observe(el);
    // Measure once on mount; the element width is only known after render.
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setIsWide(el.clientWidth >= 1040);

    return () => { ro.disconnect(); };
  }, []);

  const detail = detailId ? bookings.find((b) => b.id === detailId) : null;

  const openNew = () => {
    setDetailId(null);
    setForm({ mode: "new" });
  };
  const openEdit = (id: string) => {
    setForm({ mode: "edit", id });
    setDetailId(null);
  };

  const newDraft = (): BookingDraft => { return {
    person: me,
    date: todayManilaISO(),
    allDay: false,
    start: "16:00",
    end: "18:00",
    riders: [],
    note: "",
  } };

  const formInitial = useMemo<BookingDraft>(() => {
    if (form?.mode === "edit") {
      const b = bookings.find((x) => x.id === form.id);

      if (b) {
        return {
          id: b.id,
          person: b.person,
          date: b.date,
          allDay: b.allDay,
          start: b.start || "16:00",
          end: b.end || "18:00",
          riders: [...b.riders],
          note: b.note,
        };
      }
    }

    return newDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, bookings, me]);

  const saveBooking = (draft: BookingDraft) => {
    if (draft.id) {
      updateM.mutate(
        { id: draft.id, draft },
        {
          onSuccess: () => { setForm(null); },
          onError: (err) => { notifyError(err, "Could not save the booking."); },
        },
      );
    } else {
      createM.mutate(
        { draft, vehicleId, householdId, userId: me },
        {
          onSuccess: () => { setForm(null); },
          onError: (err) => { notifyError(err, "Could not save the booking."); },
        },
      );
    }
  };

  const cancelBooking = (id: string) => {
    cancelM.mutate(id, {
      onSuccess: () => { setDetailId(null); },
      onError: (err) => { notifyError(err, "Could not cancel the booking."); },
    });
  };

  const navItems: Array<{ id: Screen; label: string; icon: typeof Ic.Home }> = [
    { id: "home", label: "Home", icon: Ic.Home },
    { id: "week", label: "Week", icon: Ic.Calendar },
  ];

  const toggleTheme = () =>
    { setTheme((t) => (t === "dark" ? "light" : "dark")); };

  return (
    <div className="veloz" data-theme={theme} ref={rootRef}>
      <div className="app-frame">
        {/* Desktop sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <Ic.Mark className="mark" /> VelozHub
          </div>
          {navItems.map((n) => 
            { return <button
              key={n.id}
              className={`nav-link${  screen === n.id ? " active" : ""}`}
              onClick={() => { setScreen(n.id); }}
            >
              <n.icon /> {n.label}
            </button> }
          )}
          <button className="btn btn-primary new-btn" onClick={openNew}>
            <Ic.Plus /> New booking
          </button>
          <div className="me">
            <Avatar pid={me} />
            <div>
              <div className="nm">{personOf(people, me).name}</div>
              <div className="rl">Signed in · this device</div>
            </div>
            <button
              className="icon-btn"
              style={{ marginLeft: "auto" }}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
            </button>
          </div>
        </aside>

        <div className="main">
          {/* Phone top bar */}
          <div className="topbar">
            <div className="brand">
              <Ic.Mark className="mark" /> VelozHub
            </div>
            <div className="spacer" />
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
            </button>
            <Avatar pid={me} />
          </div>

          <div className="scrollarea">
            {screen === "home" ? (
              <HomeScreen bookings={bookings} wide={isWide} onOpen={setDetailId} />
            ) : (
              <WeekScreen bookings={bookings} wide={isWide} onOpen={setDetailId} />
            )}
          </div>

          {/* Phone tab bar */}
          <nav className="tabbar">
            <button
              className={`tab${  screen === "home" ? " active" : ""}`}
              onClick={() => { setScreen("home"); }}
            >
              <Ic.Home /> Home
            </button>
            <button className="tab fab" onClick={openNew}>
              <span className="fab-circle">
                <Ic.Plus />
              </span>
              <span>New</span>
            </button>
            <button
              className={`tab${  screen === "week" ? " active" : ""}`}
              onClick={() => { setScreen("week"); }}
            >
              <Ic.Calendar /> Week
            </button>
          </nav>
        </div>

        {detail && (
          <DetailSheet
            wide={isWide}
            booking={detail}
            onEdit={openEdit}
            onCancel={cancelBooking}
            onClose={() => { setDetailId(null); }}
          />
        )}
        {form && (
          <BookingForm
            wide={isWide}
            initial={formInitial}
            bookings={bookings}
            saving={createM.isPending || updateM.isPending}
            onSave={saveBooking}
            onClose={() => { setForm(null); }}
          />
        )}
      </div>
    </div>
  );
}
