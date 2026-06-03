/**
 * VelozHub screens, ported from the design prototype (`veloz-app.jsx`):
 * Home, Week, the booking form (new/edit), and the booking detail sheet.
 *
 * The prototype kept bookings in component state and a simulated clock; here the
 * data arrives as `BookingView[]` from Supabase (already Manila-local) and the
 * status/conflict logic comes from the real helpers in `../status` / `../conflicts`.
 */
import { useMemo, useState } from "react";
import * as Ic from "@/components/veloz/icons";
import { findConflicts, suggestFreeSlot, validateDraft } from "../conflicts";
import { bookingsOnDate, dayStatus } from "../status";
import {
  addDaysISO,
  dowLong,
  dowOf,
  dowShort,
  fmtTime,
  fullDate,
  minsOf,
  monShort,
  relDayLabel,
  todayManilaISO,
} from "../time";
import type { BookingDraft, BookingView } from "../types";
import {
  AgendaItem,
  AllDayTag,
  Avatar,
  ConflictWarning,
  EmptyDay,
  PersonChip,
  StatusBanner,
  Switch,
} from "./components";
import {
  personOf,
  useBookingUi,
  useIsAdmin,
  useMeId,
  usePeopleOrder,
  usePerson,
} from "./context";
import { FuelGauge } from "./FuelGauge";

/** Day-of-month (1-31) for a "yyyy-MM-dd" date string. */
const dayNum = (iso: string) => Number(iso.split("-")[2]);
const monIdx = (iso: string) => Number(iso.split("-")[1]) - 1;

/** Compose the day-cell class from its active/today flags. */
function dayCellClass(active: boolean, isToday: boolean): string {
  return ["daycell", active && "active", isToday && "today"]
    .filter(Boolean)
    .join(" ");
}

/** Human duration like "2h 30m" / "45m" / "3h". */
function fmtDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h > 0 && m > 0) {
    return `${h}h ${m}m`;
  }

  return h > 0 ? `${h}h` : `${m}m`;
}

/** Seven ISO dates for the week containing `anchorIso` (Monday start). */
function weekDays(anchorIso: string, mondayStart = true): Array<string> {
  const dow = dowOf(anchorIso);
  // dow is 0 (Sun) to 6 (Sat); step back to the week's Monday (or Sunday).
  const back = mondayStart ? (dow + 6) % 7 : dow;
  const start = addDaysISO(anchorIso, -back);

  return [...Array(7).keys()].map((i) => addDaysISO(start, i));
}

/** Horizontal day picker shown above the agenda on the phone week view. */
function DayStrip({
  days,
  selected,
  onSelect,
  bookings,
}: {
  days: Array<string>;
  selected: string;
  onSelect: (iso: string) => void;
  bookings: Array<BookingView>;
}) {
  const { people } = useBookingUi();
  const today = todayManilaISO();

  return (
    <div className="daystrip">
      {days.map((iso) => {
        const items = bookingsOnDate(bookings, iso);
        const isToday = iso === today;

        return (
          <button
            key={iso}
            className={dayCellClass(iso === selected, isToday)}
            onClick={() => { onSelect(iso); }}
          >
            <div className="dow">{dowShort[dowOf(iso)]}</div>
            <div className="dnum tnum">{dayNum(iso)}</div>
            <div className="dots">
              {items.slice(0, 3).map((b) => 
                { return <i
                  key={b.id}
                  style={{ background: personOf(people, b.person).color }}
                /> }
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Home screen: live status banner plus today's agenda. */
export function HomeScreen({
  bookings,
  wide,
  onOpen,
  onRequest,
  onOpenFuelHistory,
}: {
  bookings: Array<BookingView>;
  wide: boolean;
  onOpen: (id: string) => void;
  onRequest: (booking: BookingView) => void;
  onOpenFuelHistory: () => void;
}) {
  const today = todayManilaISO();
  const status = useMemo(() => dayStatus(today, bookings), [today, bookings]);
  const todayItems = useMemo(
    () => bookingsOnDate(bookings, today),
    [today, bookings],
  );
  const upcoming = useMemo(
    () =>
      { return [1, 2, 3].map((n) => {
        const iso = addDaysISO(today, n);

        return { iso, items: bookingsOnDate(bookings, iso) };
      }) },
    [today, bookings],
  );

  const todayList =
    todayItems.length > 0 ? (
      <ul className="agenda">
        {todayItems.map((b) =>
          { return <li key={b.id}>
            <AgendaItem showStatus b={b} onOpen={onOpen} />
          </li> }
        )}
      </ul>
    ) : (
      <EmptyDay label="today" />
    );

  if (!wide) {
    return (
      <div className="content">
        <StatusBanner status={status} onRequest={onRequest} />
        <FuelGauge wide={wide} onOpenHistory={onOpenFuelHistory} />
        <div className="section-head">
          <h2>Today</h2>
          <span className="count">{fullDate(today)}</span>
        </div>
        {todayList}
      </div>
    );
  }

  return (
    <div className="content">
      <header className="page-head">
        <div>
          <h1>Today</h1>
          <div className="sub">
            {dowLong[dowOf(today)]}, {monShort[monIdx(today)]} {dayNum(today)}
          </div>
        </div>
      </header>
      <div className="home-grid">
        <div className="today-col">
          <StatusBanner status={status} onRequest={onRequest} />
          <FuelGauge wide={wide} onOpenHistory={onOpenFuelHistory} />
          <div className="section-head">
            <h2>Today&apos;s bookings</h2>
            <span className="count">
              {todayItems.length} trip{todayItems.length === 1 ? "" : "s"}
            </span>
          </div>
          {todayList}
        </div>
        <aside className="upcoming-rail">
          <div className="section-head" style={{ margin: 0 }}>
            <h2 style={{ fontSize: "var(--fs-h)" }}>Coming up</h2>
          </div>
          {upcoming.map(({ iso, items }) => 
            { return <div className="day-card" key={iso}>
              <div className="dc-head">
                <span className="d">{relDayLabel(iso)}</span>
                <span className="n">{fullDate(iso)}</span>
              </div>
              <div className="dc-list">
                {items.length > 0 ? (
                  items.map((b) => (
                    <AgendaItem key={b.id} b={b} onOpen={onOpen} />
                  ))
                ) : (
                  <div
                    className="faint"
                    style={{ fontSize: "var(--fs-sm)", padding: "2px 0 4px" }}
                  >
                    Free all day
                  </div>
                )}
              </div>
            </div> }
          )}
        </aside>
      </div>
    </div>
  );
}

/** Week screen: 14-day strip on phone, 7-column grid on desktop. */
export function WeekScreen({
  bookings,
  wide,
  onOpen,
}: {
  bookings: Array<BookingView>;
  wide: boolean;
  onOpen: (id: string) => void;
}) {
  const { people } = useBookingUi();
  const today = todayManilaISO();
  const [selected, setSelected] = useState(today);
  const [weekOff, setWeekOff] = useState(0);

  // Phone: 14-day strip from today (this week plus next week).
  const strip = useMemo(
    () => [...Array(14).keys()].map((i) => addDaysISO(today, i)),
    [today],
  );
  // Desktop: 7-column week grid for the offset week.
  const days = useMemo(
    () => weekDays(addDaysISO(today, weekOff * 7)),
    [today, weekOff],
  );

  if (!wide) {
    const items = bookingsOnDate(bookings, selected);

    return (
      <div className="content">
        <div className="weeklabel">
          {relDayLabel(strip[0]) === "Today" ? "This week & next" : ""}
        </div>
        <DayStrip
          days={strip}
          selected={selected}
          bookings={bookings}
          onSelect={setSelected}
        />
        <div className="section-head">
          <h2>{relDayLabel(selected)}</h2>
          <span className="count">{fullDate(selected)}</span>
        </div>
        {items.length > 0 ? (
          <ul className="agenda">
            {items.map((b) => 
              { return <li key={b.id}>
                <AgendaItem b={b} onOpen={onOpen} />
              </li> }
            )}
          </ul>
        ) : (
          <EmptyDay label={relDayLabel(selected).toLowerCase()} />
        )}
      </div>
    );
  }

  const rangeLabel = `${monShort[monIdx(days[0])]} ${dayNum(days[0])} – ${monShort[monIdx(days[6])]} ${dayNum(days[6])}`;
  let weekLabel = rangeLabel;

  if (weekOff === 0) {
    weekLabel = "This week";
  } else if (weekOff === 1) {
    weekLabel = "Next week";
  }

  return (
    <div className="content">
      <header className="page-head">
        <div>
          <h1>Week</h1>
          <div className="sub">
            {weekLabel} · {rangeLabel}
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--s2)" }}>
          <button
            className="icon-btn"
            aria-label="Previous week"
            onClick={() => { setWeekOff((w) => w - 1); }}
          >
            <Ic.ChevronL />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setWeekOff(0); }}>
            Today
          </button>
          <button
            className="icon-btn"
            aria-label="Next week"
            onClick={() => { setWeekOff((w) => w + 1); }}
          >
            <Ic.Chevron />
          </button>
        </div>
      </header>
      <div className="weekgrid">
        {days.map((iso) => {
          const items = bookingsOnDate(bookings, iso);
          const isToday = iso === today;

          return (
            <div className="wcol" key={iso}>
              <div className={isToday ? "wcol-head today" : "wcol-head"}>
                <div className="dow">{dowShort[dowOf(iso)]}</div>
                <div className="dnum tnum">{dayNum(iso)}</div>
              </div>
              <div className="wbody">
                {items.length > 0 ? (
                  items.map((b) => {
                    const p = personOf(people, b.person);

                    return (
                      <button
                        key={b.id}
                        className={b.allDay ? "wblock allday" : "wblock"}
                        style={{ "--pc": p.color } as React.CSSProperties}
                        onClick={() => { onOpen(b.id); }}
                      >
                        <div className="wt">
                          {b.allDay ? (
                            <>
                              <Ic.Sun /> All day
                            </>
                          ) : (
                            fmtTime(b.start)
                          )}
                        </div>
                        <div className="wn">{p.name}</div>
                      </button>
                    );
                  })
                ) : (
                  <div className="wempty">Free</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** New/edit booking sheet with riders, a note, and a live overlap check. */
export function BookingForm({
  wide,
  initial,
  bookings,
  onSave,
  onClose,
  saving,
}: {
  wide: boolean;
  initial: BookingDraft;
  bookings: Array<BookingView>;
  onSave: (draft: BookingDraft) => void;
  onClose: () => void;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState<BookingDraft>(initial);
  const order = usePeopleOrder();
  const conflicts = useMemo(
    () => findConflicts(draft, bookings),
    [draft, bookings],
  );
  const suggestion = useMemo(
    () => (conflicts.length > 0 ? suggestFreeSlot(draft, bookings) : null),
    [conflicts, draft, bookings],
  );
  const valid = validateDraft(draft);
  const set = (patch: Partial<BookingDraft>) =>
    { setDraft((d) => ({ ...d, ...patch })); };
  const riderOptions = order.filter((p) => p !== draft.person);
  const toggleRider = (r: string) =>
    { set({
      riders: draft.riders.includes(r)
        ? draft.riders.filter((x) => x !== r)
        : [...draft.riders, r],
    }); };
  const isEditing = Boolean(initial.id);
  // A clash here is against a confirmed booking, which the DB will always
  // reject, so block the save rather than open a doomed proposal.
  const canSave = valid.ok && !saving && conflicts.length === 0;
  const durationMins =
    !draft.allDay && draft.start && draft.end
      ? minsOf(draft.end) - minsOf(draft.start)
      : 0;
  const durationLabel = durationMins > 0 ? fmtDuration(durationMins) : null;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wide ? "scrim modal" : "scrim"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {onClose();}
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <div className="sheet-title">
            <h2>{isEditing ? "Edit booking" : "New booking"}</h2>
            <p>
              {isEditing
                ? "Update your trip on the Veloz."
                : "Reserve the family Veloz."}
            </p>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          <div className="field">
            <label htmlFor="bk-date">Date</label>
            <div className="input-wrap">
              <Ic.Calendar />
              <input
                id="bk-date"
                type="date"
                className="input has-icon tnum"
                value={draft.date}
                min={todayManilaISO()}
                onChange={(e) => { set({ date: e.target.value }); }}
              />
            </div>
          </div>

          <div className="field">
            <div className="toggle-row">
              <div className="tl">
                <b>
                  <Ic.Sun /> All day
                </b>
                <span>Blocks the whole day for everyone</span>
              </div>
              <Switch
                checked={draft.allDay}
                onChange={(v) => { set({ allDay: v }); }}
              />
            </div>
          </div>

          {!draft.allDay && (
            <div className="field">
              <label htmlFor="bk-start">
                Time
                {durationLabel && (
                  <span className="faint" style={{ fontWeight: 500 }}>
                    {" "}
                    · {durationLabel}
                  </span>
                )}
              </label>
              <div className="time-row">
                <div className="input-wrap">
                  <Ic.Clock />
                  <input
                    id="bk-start"
                    type="time"
                    className="input has-icon tnum"
                    value={draft.start}
                    step={900}
                    aria-label="Start time"
                    onChange={(e) => { set({ start: e.target.value }); }}
                  />
                </div>
                <div className="input-wrap">
                  <Ic.Clock />
                  <input
                    type="time"
                    className="input has-icon tnum"
                    value={draft.end}
                    step={900}
                    aria-label="End time"
                    onChange={(e) => { set({ end: e.target.value }); }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="field">
            <label>
              Riders{" "}
              <span className="faint" style={{ fontWeight: 500 }}>
                · optional
              </span>
            </label>
            <div className="riders-grid">
              {riderOptions.map((r) => 
                { return <RiderToggle
                  key={r}
                  pid={r}
                  on={draft.riders.includes(r)}
                  onToggle={() => { toggleRider(r); }}
                /> }
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="bk-note">
              Note{" "}
              <span className="faint" style={{ fontWeight: 500 }}>
                · optional
              </span>
            </label>
            <textarea
              id="bk-note"
              className="input"
              placeholder="Where to, or anything the family should know"
              maxLength={120}
              value={draft.note}
              onChange={(e) => { set({ note: e.target.value }); }}
            />
          </div>

          {valid.ok ? (
            <ConflictWarning conflicts={conflicts} draft={draft} />
          ) : (
            <div className="warn">
              <Ic.Alert />
              <div>
                <div className="w-title">Check the times</div>
                <div className="w-body">{valid.error}</div>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="suggest">
              <Ic.Clock />
              <span className="lbl">Nearest free time</span>
              <span className="tm tnum">
                {fmtTime(suggestion.start)} to {fmtTime(suggestion.end)}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  set({ start: suggestion.start, end: suggestion.end });
                }}
              >
                Use this
              </button>
            </div>
          )}
        </div>
        <div className="sheet-foot">
          <button
            className="btn btn-ghost"
            style={{ flex: "0 0 auto" }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary btn-block"
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.5 }}
            onClick={() => {
              if (canSave) { onSave(draft); }
            }}
          >
            <Ic.Check />
            {isEditing ? "Save changes" : "Book the car"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RiderToggle({
  pid,
  on,
  onToggle,
}: {
  pid: string;
  on: boolean;
  onToggle: () => void;
}) {
  const p = usePerson(pid);

  return (
    <button
      type="button"
      className="chip selectable"
      aria-pressed={on}
      style={{ "--pc": p.color } as React.CSSProperties}
      onClick={onToggle}
    >
      <Avatar pid={pid} size="sm" />
      {p.name}
    </button>
  );
}

/** Booking detail sheet; the owner gets edit and two-step cancel. */
export function DetailSheet({
  wide,
  booking,
  onEdit,
  onCancel,
  onClose,
}: {
  wide: boolean;
  booking: BookingView;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onClose: () => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const p = usePerson(booking.person);
  const isMine = booking.person === useMeId();
  const isAdmin = useIsAdmin();
  // The owner manages their own trip; an admin can manage anyone's (RLS allows
  // this too, so the DB agrees with the UI).
  const canManage = isMine || isAdmin;
  const when = booking.allDay
    ? "All day"
    : `${fmtTime(booking.start)} to ${fmtTime(booking.end)}`;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wide ? "scrim modal" : "scrim"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {onClose();}
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Booking</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          <div className="detail-hero">
            <Avatar pid={booking.person} size="lg" />
            <div>
              <div className="name">
                {p.name}
                {isMine && (
                  <span className="you-tag" style={{ marginLeft: 8 }}>
                    You
                  </span>
                )}
              </div>
              <div className="when">
                {relDayLabel(booking.date)}, {fullDate(booking.date)}
              </div>
            </div>
          </div>

          <div className="kv">
            <div className="k">When</div>
            <div
              className="v"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {booking.allDay ? <AllDayTag /> : <b className="tnum">{when}</b>}
            </div>
          </div>
          <div className="kv">
            <div className="k">Riders</div>
            <div className="v">
              {booking.riders.length > 0 ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {booking.riders.map((r) => (
                    <PersonChip key={r} pid={r} />
                  ))}
                </div>
              ) : (
                <span className="faint">Solo trip</span>
              )}
            </div>
          </div>
          <div className="kv">
            <div className="k">Note</div>
            <div className="v">
              {booking.note || <span className="faint">No note</span>}
            </div>
          </div>

          {!isMine && isAdmin && (
            <div className="lock-note">
              <Ic.Lock /> {p.name}&apos;s booking. You can manage it as an admin.
            </div>
          )}
          {!canManage && (
            <div className="lock-note">
              <Ic.Lock /> Only {p.name} can edit or cancel this booking.
            </div>
          )}
        </div>
        {canManage && (
          <div className="sheet-foot">
            {isConfirming ? (
              <>
                <button
                  className="btn btn-ghost"
                  style={{ flex: "0 0 auto" }}
                  onClick={() => { setIsConfirming(false); }}
                >
                  Keep
                </button>
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => { onCancel(booking.id); }}
                >
                  <Ic.Trash /> Yes, cancel this trip
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-danger"
                  style={{ flex: "0 0 auto" }}
                  onClick={() => { setIsConfirming(true); }}
                >
                  <Ic.Trash /> Cancel trip
                </button>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => { onEdit(booking.id); }}
                >
                  <Ic.Edit /> Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Usage screen: trips and hours per person for the current Manila month. */
export function StatsScreen({ bookings }: { bookings: Array<BookingView> }) {
  const { people } = useBookingUi();
  /**
   * "yyyy-MM".
   */
  const month = todayManilaISO().slice(0, 7); 

  const stats = useMemo(() => {
    const acc = new Map<string, { trips: number; mins: number }>();

    for (const id of people.order) {
      acc.set(id, { trips: 0, mins: 0 });
    }
    for (const b of bookings) {
      if (!b.date.startsWith(month)) {
        continue;
      }

      const row = acc.get(b.person) ?? { trips: 0, mins: 0 };

      row.trips = row.trips + 1;
      if (!b.allDay) {
        row.mins = row.mins + (minsOf(b.end) - minsOf(b.start));
      }
      acc.set(b.person, row);
    }

    return people.order
      .map((id) => ({ id, ...(acc.get(id) ?? { trips: 0, mins: 0 }) }))
      .sort((a, b) => b.trips - a.trips || b.mins - a.mins);
  }, [bookings, people, month]);

  const maxTrips = Math.max(1, ...stats.map((s) => s.trips));
  const totalTrips = stats.reduce((n, s) => n + s.trips, 0);
  const monthLabel = `${monShort[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;

  return (
    <div className="content">
      <header className="page-head">
        <div>
          <h1>Usage</h1>
          <div className="sub">
            {monthLabel} · {totalTrips} trip{totalTrips === 1 ? "" : "s"}
          </div>
        </div>
      </header>
      {totalTrips === 0 ? (
        <EmptyDay label="this month" />
      ) : (
        <div className="stat-list">
          {stats.map((s) => {
            const p = personOf(people, s.id);
            const hours = Math.round((s.mins / 60) * 10) / 10;

            return (
              <div
                className="stat-row"
                key={s.id}
                style={{ "--pc": p.color } as React.CSSProperties}
              >
                <Avatar pid={s.id} />
                <div className="stat-main">
                  <div className="stat-top">
                    <span className="nm">{p.name}</span>
                    <span className="stat-val">
                      {s.trips} trip{s.trips === 1 ? "" : "s"}
                      {hours > 0 ? ` · ${hours}h` : ""}
                    </span>
                  </div>
                  <div className="stat-bar">
                    <span style={{ width: `${(s.trips / maxTrips) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
