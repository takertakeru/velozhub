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
import "@/components/veloz/veloz.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/components/ui/toast";
import {
  initialVelozTheme,
  persistVelozTheme,
  VelozMark,
} from "@/components/veloz/brand";
import * as Ic from "@/components/veloz/icons";
import type { Nudge } from "@/libs/supabase/types";
import {
  useAcknowledgeGiveway,
  useClaimGiveway,
  useGivewayInbox,
  useMyGivewayResults,
  useMyPendingGiveways,
  useRequestGiveway,
  useWithdrawGiveway,
} from "../giveway";
import { bookingsToICS, downloadICS } from "../ics";
import {
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "../mutations";
import { useNudgeInbox, useSendNudge } from "../nudges";
import {
  useAcknowledgeRejection,
  useMyRejections,
  usePollResolver,
  usePolls,
} from "../polls";
import {
  type PeopleData,
  useBookings,
  useMe,
  useProfiles,
  useVehicle,
} from "../queries";
import { useBookingsRealtime } from "../realtime";
import { todayManilaISO } from "../time";
import type {
  BookingDraft,
  BookingView,
  GivewayView,
  RejectionView,
} from "../types";
import { Avatar } from "./components";
import { BookingUiProvider, personOf, useBookingUi } from "./context";
import { DeclineNotice } from "./DeclineNotice";
import { FuelHistoryScreen } from "./FuelHistoryScreen";
import { GivewayCenter } from "./GivewayCenter";
import { GivewayResult } from "./GivewayResult";
import { PollCenter } from "./PollCenter";
import {
  BookingForm,
  DetailSheet,
  HomeScreen,
  StatsScreen,
  WeekScreen,
} from "./screens";

type Screen = "home" | "week" | "stats" | "fuel";
type FormState =
  | { mode: "new"; draft?: BookingDraft }
  | { mode: "edit"; id: string }
  | null;
type Theme = "light" | "dark";

/** Surface a mutation failure to the user as a toast notification. */
function notifyError(err: unknown, fallback: string) {
  toaster(err instanceof Error ? err.message : fallback);
}

/** Route-level entry: loads data, then renders the shell. */
export function VelozApp() {
  // Keep every phone in sync the moment a booking changes anywhere.
  useBookingsRealtime();
  // Auto-confirm proposals once their 15-minute silence window elapses.
  usePollResolver();

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

/**
 * Avatar-triggered account menu: identity, theme toggle, and sign out. Used in
 * two spots, with `placement` flipping which way the popover opens: "up" from
 * the desktop sidebar footer, "down" from the phone top bar avatar. Sign out
 * routes to `/logout`, which clears the session + query cache and redirects.
 */
function AccountMenu({
  me,
  people,
  theme,
  onToggleTheme,
  onExportCalendar,
  placement,
}: {
  me: string;
  people: PeopleData;
  theme: Theme;
  onToggleTheme: () => void;
  onExportCalendar: () => void;
  placement: "up" | "down";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const person = personOf(people, me);
  const close = () => { setIsOpen(false); };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`acct ${placement}`}
      onKeyDown={(e) => { if (e.key === "Escape") { close(); } }}
    >
      {placement === "down" ? (
        <button
          type="button"
          className="acct-trigger bare"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => { setIsOpen((o) => !o); }}
        >
          <Avatar pid={me} />
        </button>
      ) : (
        <button
          type="button"
          className="acct-trigger"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => { setIsOpen((o) => !o); }}
        >
          <Avatar pid={me} />
          <div>
            <div className="nm">{person.name}</div>
            <div className="rl">Signed in</div>
          </div>
          <span className="caret">
            <Ic.Chevron />
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            className="acct-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
          />
          <div className="acct-pop" role="menu">
            <div className="acct-head">
            <Avatar pid={me} />
            <div>
              <div className="nm">{person.name}</div>
              <div className="rl">Signed in on this device</div>
            </div>
          </div>
          <div className="acct-sep" />
          <button
            type="button"
            className="acct-item"
            role="menuitem"
            onClick={onToggleTheme}
          >
            {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            className="acct-item"
            role="menuitem"
            onClick={() => { onExportCalendar(); close(); }}
          >
            <Ic.Calendar /> Add to calendar
          </button>
          <button
            type="button"
            className="acct-item danger"
            role="menuitem"
            onClick={() => { void navigate({ to: "/logout" }); }}
          >
            <Ic.LogOut /> Sign out
          </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Nav bell that opens the poll center. Shows a badge with the number of open
 * polls still awaiting the signed-in user's vote.
 */
function PollBell({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn poll-bell"
      aria-label={
        count > 0
          ? `Pending approvals, ${count} awaiting your vote`
          : "Pending approvals"
      }
      onClick={onClick}
    >
      <Ic.Bell />
      {count > 0 && (
        <span className="poll-badge">{count > 9 ? "9+" : count}</span>
      )}
    </button>
  );
}

/**
 * Nav button that opens the give-way center. The badge counts asks awaiting the
 * signed-in user's answer; it shows with no badge when only their own outgoing
 * asks are pending, so they can still open the center to track or withdraw them.
 */
function GivewayBell({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="icon-btn poll-bell"
      aria-label={
        count > 0
          ? `Give-way requests, ${count} awaiting your answer`
          : "Give-way requests"
      }
      onClick={onClick}
    >
      <Ic.Car />
      {count > 0 && (
        <span className="poll-badge">{count > 9 ? "9+" : count}</span>
      )}
    </button>
  );
}

/**
 * A nav-styled row (desktop sidebar) that opens an alert center. Always shown so
 * the approval / give-way hubs are reachable even when empty; a count badge
 * appears on the right only when something is pending.
 */
function NavAlert({
  icon: Icon,
  label,
  count,
  onClick,
}: {
  icon: typeof Ic.Home;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button type="button" className="nav-link" onClick={onClick}>
      <Icon /> {label}
      {count > 0 && (
        <span className="nav-badge">{count > 9 ? "9+" : count}</span>
      )}
    </button>
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
  const [theme, setTheme] = useState<Theme>(initialVelozTheme);
  const [screen, setScreen] = useState<Screen>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const createM = useCreateBooking();
  const updateM = useUpdateBooking();
  const cancelM = useCancelBooking();
  const sendNudgeM = useSendNudge();
  const acknowledgeRejectionM = useAcknowledgeRejection();

  // The proposer's unseen declined bookings; show the newest as a notice modal.
  // Track the id we just acted on so the modal closes instantly, before the
  // acknowledge round-trips and the query drops it.
  const rejectionsQ = useMyRejections(me);
  const [dismissedRejectionId, setDismissedRejectionId] = useState<
    string | null
  >(null);
  const pendingRejection = rejectionsQ.data?.[0] ?? null;
  const rejection =
    pendingRejection && pendingRejection.id !== dismissedRejectionId
      ? pendingRejection
      : null;

  // Give-way: asks aimed at me (decide), my asks that resolved (claim/see), and
  // my open asks (so the detail sheet shows "waiting" on a slot already in flight).
  const givewayInboxQ = useGivewayInbox(me);
  const givewayResultsQ = useMyGivewayResults(me);
  const myPendingGivewayQ = useMyPendingGiveways(me);
  const requestGivewayM = useRequestGiveway();
  const claimGivewayM = useClaimGiveway();
  const withdrawGivewayM = useWithdrawGiveway();
  const acknowledgeGivewayM = useAcknowledgeGiveway();

  // Asks aimed at me, shown in the give-way center (a scrollable list).
  // Asks aimed at me (to answer) and asks I sent and am waiting on. Both feed the
  // give-way center; the outgoing list also drives the detail sheet's waiting
  // state and the bell's presence when nothing needs my answer.
  const givewayInbox = useMemo(
    () => givewayInboxQ.data ?? [],
    [givewayInboxQ.data],
  );
  const myPendingGiveways = useMemo(
    () => myPendingGivewayQ.data ?? [],
    [myPendingGivewayQ.data],
  );

  const [dismissedResultId, setDismissedResultId] = useState<string | null>(
    null,
  );
  const pendingGivewayResult = givewayResultsQ.data?.[0] ?? null;
  const givewayResult =
    pendingGivewayResult && pendingGivewayResult.id !== dismissedResultId
      ? pendingGivewayResult
      : null;

  // bookingId -> my open ask's id, for the detail sheet's waiting state.
  const pendingGivewayByBooking = useMemo(() => {
    const map = new Map<string, string>();

    for (const g of myPendingGiveways) {
      map.set(g.bookingId, g.id);
    }

    return map;
  }, [myPendingGiveways]);

  // Open booking polls and how many still await this user's vote.
  const pollsQ = usePolls();
  const polls = useMemo(() => pollsQ.data ?? [], [pollsQ.data]);
  const owedVotes = useMemo(
    () => polls.filter((p) => !p.votes.some((v) => v.profileId === me)).length,
    [polls, me],
  );

  const [isPollsOpen, setIsPollsOpen] = useState(false);
  // Once minimized, stay minimized until the user clears every poll; a fresh
  // batch of unvoted polls then pops the center open again on its own.
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (owedVotes === 0) {
      dismissedRef.current = false;

      return;
    }

    if (!dismissedRef.current) {
      setIsPollsOpen(true);
    }
  }, [owedVotes]);

  const openPolls = () => { setIsPollsOpen(true); };
  const minimizePolls = () => {
    dismissedRef.current = true;
    setIsPollsOpen(false);
  };

  const [isGivewayOpen, setIsGivewayOpen] = useState(false);
  // Same minimize-until-cleared behaviour as the poll center, keyed on the count
  // of open asks aimed at this holder; a fresh ask pops it open again, and the
  // give-way bell reopens it after a minimize.
  const givewayDismissedRef = useRef(false);

  useEffect(() => {
    if (givewayInbox.length === 0) {
      givewayDismissedRef.current = false;

      return;
    }

    if (!givewayDismissedRef.current) {
      setIsGivewayOpen(true);
    }
  }, [givewayInbox.length]);

  const openGiveways = () => { setIsGivewayOpen(true); };
  const minimizeGiveways = () => {
    givewayDismissedRef.current = true;
    setIsGivewayOpen(false);
  };

  /**
   * Manual data refresh. Re-fetches every active query (bookings, profiles,
   * vehicle, me) in place without reloading the page. The refetch is usually
   * near-instant, so we hold the loader for one full spin (the animation is
   * 0.8s) so it ends smoothly instead of flashing.
   */
  const refresh = () => {
    setIsRefreshing(true);
    void Promise.all([
      queryClient.invalidateQueries(),
      new Promise((resolve) => { setTimeout(resolve, 800); }),
    ]).finally(() => { setIsRefreshing(false); });
  };

  // Live in-app notification when someone asks you for the car.
  const onNudge = useCallback(
    (n: Nudge) => {
      toaster(`${personOf(people, n.from_user).name} is asking for the car.`);
    },
    [people],
  );

  useNudgeInbox(me, onNudge);

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

    // A "Book again" from the decline notice seeds the new-booking form.
    if (form?.mode === "new" && form.draft) {
      return form.draft;
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

  /**
   * Decline notice: acknowledge so it stops popping. "Book again" also reopens
   * the booking form prefilled with the declined slot (sans the old id).
   */
  const dismissRejection = (r: RejectionView) => {
    setDismissedRejectionId(r.id);
    acknowledgeRejectionM.mutate(r.id);
  };

  const rebookRejection = (r: RejectionView) => {
    setDismissedRejectionId(r.id);
    acknowledgeRejectionM.mutate(r.id);
    setForm({
      mode: "new",
      draft: {
        person: me,
        date: r.date,
        allDay: r.allDay,
        start: r.start || "16:00",
        end: r.end || "18:00",
        riders: [...r.riders],
        note: r.note,
      },
    });
  };

  /** Ask the holder of someone else's booking to give way (from the detail sheet). */
  const askGiveway = (bookingId: string, reason: string) => {
    requestGivewayM.mutate(
      { bookingId, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          setDetailId(null);
          toaster("Asked them to give way.");
        },
        onError: (err) => { notifyError(err, "Could not send the request."); },
      },
    );
  };

  const withdrawGiveway = (requestId: string) => {
    withdrawGivewayM.mutate(requestId, {
      onSuccess: () => { setDetailId(null); },
      onError: (err) => { notifyError(err, "Could not withdraw the request."); },
    });
  };

  /** Asker claims a freed slot: books it confirmed-directly at the agreed time. */
  const claimGiveway = (g: GivewayView) => {
    claimGivewayM.mutate(
      { requestId: g.id },
      {
        onSuccess: () => {
          setDismissedResultId(g.id);
          toaster("The slot is yours.");
        },
        onError: (err) => { notifyError(err, "Could not claim the slot."); },
      },
    );
  };

  const dismissGivewayResult = (g: GivewayView) => {
    setDismissedResultId(g.id);
    acknowledgeGivewayM.mutate(g.id);
  };

  const navItems: Array<{ id: Screen; label: string; icon: typeof Ic.Home }> = [
    { id: "home", label: "Home", icon: Ic.Home },
    { id: "week", label: "Week", icon: Ic.Calendar },
    { id: "stats", label: "Usage", icon: Ic.Chart },
    { id: "fuel", label: "Fuel", icon: Ic.Fuel },
  ];

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";

      persistVelozTheme(next);

      return next;
    });
  };

  const exportCalendar = () => {
    downloadICS("velozhub.ics", bookingsToICS(bookings, people));
  };

  const requestCar = (booking: BookingView) => {
    sendNudgeM.mutate(
      {
        householdId,
        fromUser: me,
        toUser: booking.person,
        bookingId: booking.id,
      },
      {
        onSuccess: () => {
          toaster(`Asked ${personOf(people, booking.person).name} for the car.`);
        },
        onError: (err) => { notifyError(err, "Could not send the request."); },
      },
    );
  };

  let screenView: React.ReactNode;

  switch (screen) {
    case "week": {
      screenView = (
        <WeekScreen bookings={bookings} wide={isWide} onOpen={setDetailId} />
      );
      break;
    }
    case "stats": {
      screenView = <StatsScreen bookings={bookings} />;
      break;
    }
    case "fuel": {
      screenView = (
        <FuelHistoryScreen wide={isWide} onBack={() => { setScreen("home"); }} />
      );
      break;
    }
    case "home": {
      screenView = (
        <HomeScreen
          bookings={bookings}
          wide={isWide}
          onOpen={setDetailId}
          onRequest={requestCar}
          onOpenFuelHistory={() => { setScreen("fuel"); }}
        />
      );
      break;
    }
  }

  return (
    <div className="veloz" data-theme={theme} ref={rootRef}>
      <div className="app-frame">
        {/* Desktop sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <button
              type="button"
              className="brand"
              aria-label="Go to home"
              onClick={() => { setScreen("home"); }}
            >
              <VelozMark className="mark" /> VelozHub
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Refresh"
              onClick={refresh}
            >
              <Ic.Refresh className={isRefreshing ? "spin" : undefined} />
            </button>
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
          {/* Always-visible alert rows: open the approval / give-way centers. */}
          <NavAlert
            icon={Ic.Bell}
            label="Approvals"
            count={owedVotes}
            onClick={openPolls}
          />
          <NavAlert
            icon={Ic.Car}
            label="Give-way"
            count={givewayInbox.length}
            onClick={openGiveways}
          />
          <button className="btn btn-primary new-btn" onClick={openNew}>
            <Ic.Plus /> New booking
          </button>
          <AccountMenu
            me={me}
            people={people}
            theme={theme}
            placement="up"
            onToggleTheme={toggleTheme}
            onExportCalendar={exportCalendar}
          />
        </aside>

        <div className="main">
          {/* Phone top bar */}
          <div className="topbar">
            <button
              type="button"
              className="brand"
              aria-label="Go to home"
              onClick={() => { setScreen("home"); }}
            >
              <VelozMark className="mark" /> VelozHub
            </button>
            <div className="spacer" />
            <div className="topbar-actions">
              <PollBell count={owedVotes} onClick={openPolls} />
              <GivewayBell count={givewayInbox.length} onClick={openGiveways} />
              <button
                type="button"
                className="icon-btn"
                aria-label="Refresh"
                onClick={refresh}
              >
                <Ic.Refresh className={isRefreshing ? "spin" : undefined} />
              </button>
            </div>
            <AccountMenu
              me={me}
              people={people}
              theme={theme}
              placement="down"
              onToggleTheme={toggleTheme}
              onExportCalendar={exportCalendar}
            />
          </div>

          <div className="scrollarea">
            {screenView}
            {isRefreshing && (
              <div className="refresh-overlay" role="status" aria-live="polite">
                <Ic.Refresh className="spin" />
                <span>Refreshing…</span>
              </div>
            )}
          </div>

          {/* Phone tab bar: every primary screen, with New as the center FAB. */}
          <nav className="tabbar">
            <button
              className={`tab${  screen === "home" ? " active" : ""}`}
              onClick={() => { setScreen("home"); }}
            >
              <Ic.Home /> Home
            </button>
            <button
              className={`tab${  screen === "week" ? " active" : ""}`}
              onClick={() => { setScreen("week"); }}
            >
              <Ic.Calendar /> Week
            </button>
            <button className="tab fab" onClick={openNew}>
              <span className="fab-circle">
                <Ic.Plus />
              </span>
              <span>New</span>
            </button>
            <button
              className={`tab${  screen === "fuel" ? " active" : ""}`}
              onClick={() => { setScreen("fuel"); }}
            >
              <Ic.Fuel /> Fuel
            </button>
            <button
              className={`tab${  screen === "stats" ? " active" : ""}`}
              onClick={() => { setScreen("stats"); }}
            >
              <Ic.Chart /> Usage
            </button>
          </nav>
        </div>

        {detail && (
          <DetailSheet
            wide={isWide}
            booking={detail}
            pendingGivewayId={pendingGivewayByBooking.get(detail.id) ?? null}
            onEdit={openEdit}
            onCancel={cancelBooking}
            onClose={() => { setDetailId(null); }}
            onAskGiveway={askGiveway}
            onWithdrawGiveway={withdrawGiveway}
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
        {isPollsOpen && (
          <PollCenter wide={isWide} polls={polls} onClose={minimizePolls} />
        )}
        {rejection && !form && (
          <DeclineNotice
            wide={isWide}
            rejection={rejection}
            onDismiss={() => { dismissRejection(rejection); }}
            onRebook={() => { rebookRejection(rejection); }}
          />
        )}
        {givewayResult && !form && !rejection && (
          <GivewayResult
            wide={isWide}
            result={givewayResult}
            busy={claimGivewayM.isPending}
            onClaim={() => { claimGiveway(givewayResult); }}
            onDismiss={() => { dismissGivewayResult(givewayResult); }}
          />
        )}
        {isGivewayOpen && (
          <GivewayCenter
            wide={isWide}
            incoming={givewayInbox}
            outgoing={myPendingGiveways}
            onClose={minimizeGiveways}
          />
        )}
      </div>
    </div>
  );
}
