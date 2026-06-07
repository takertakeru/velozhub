/**
 * VelozHub shared components, ported from the design prototype
 * (`veloz-components.jsx`). These are presentational: they read the household
 * from context (`usePerson`, `useMeId`) and format with the real Manila-clock
 * helpers in `../time` and `../status`.
 */
import type { CSSProperties } from "react";
import { velozCarUrl } from "@/components/veloz/brand";
import * as Ic from "@/components/veloz/icons";
import { type BookingProgress, bookingProgress, type DayStatus } from "../status";
import { fmtTime } from "../time";
import type { BookingDraft, BookingView } from "../types";
import { personOf, useBookingUi, useMeId, usePerson } from "./context";

/** A CSS custom property (--pc) carrying a person's color. */
function pcStyle(color: string): CSSProperties {
  return { "--pc": color } as CSSProperties;
}

/** Round avatar bubble showing a person's initials in their color. */
export function Avatar({ pid, size }: { pid: string; size?: "sm" | "lg" }) {
  const p = usePerson(pid);
  const cls = size ? `avatar ${size}` : "avatar";

  return (
    <span className={cls} style={pcStyle(p.color)} title={p.name}>
      {p.initials}
    </span>
  );
}

export function PersonChip({ pid }: { pid: string }) {
  const p = usePerson(pid);

  return (
    <span className="chip" style={pcStyle(p.color)}>
      <span className="person-dot" /> {p.name}
    </span>
  );
}

export function AllDayTag() {
  return (
    <span className="tag-allday">
      <Ic.Sun /> All day
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      className="switch"
      onClick={() => { onChange(!checked); }}
    >
      <span className="knob" />
    </button>
  );
}

/** Right-aligned "n/max" counter shown under a note/reason field. */
export function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span className="char-count">
      {value.length}/{max}
    </span>
  );
}

/** Inline "with X & Y" rider summary for an agenda row. */
function RiderSummary({ riders }: { riders: Array<string> }) {
  const { people } = useBookingUi();

  if (riders.length === 0) {
    return (
      <span className="meta">
        <span className="faint">Solo</span>
      </span>
    );
  }

  const names = riders.map((r) => personOf(people, r).name).join(" & ");

  return (
    <span className="meta">
      <span className="riders">
        {riders.map((r) => (
          <Avatar key={r} pid={r} size="sm" />
        ))}
      </span>
      <span>with {names}</span>
    </span>
  );
}

const progressLabel: Record<BookingProgress, string> = {
  done: "Done",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

/** Done / Ongoing / Upcoming pill, driven by the live clock. */
function StatusPill({ progress }: { progress: BookingProgress }) {
  return (
    <span className={`status-pill sp-${progress}`}>{progressLabel[progress]}</span>
  );
}

/** A tappable booking row used across the agendas. */
export function AgendaItem({
  b,
  onOpen,
  showStatus = false,
}: {
  b: BookingView;
  onOpen: (id: string) => void;
  /** Show the live Done/Ongoing/Upcoming pill (used on the Today list). */
  showStatus?: boolean;
}) {
  const p = usePerson(b.person);
  const isMe = b.person === useMeId();

  return (
    <button
      className={b.allDay ? "agenda-item allday" : "agenda-item"}
      style={pcStyle(p.color)}
      onClick={() => { onOpen(b.id); }}
    >
      <span className="time-col">
        {b.allDay ? (
          <span className="allday-col">
            <Ic.Sun />
            <span>All day</span>
          </span>
        ) : (
          <>
            <span className="time-start tnum">{fmtTime(b.start)}</span>
            <span className="time-end tnum">to {fmtTime(b.end)}</span>
          </>
        )}
      </span>
      <span className="body">
        <span className="who">
          <Avatar pid={b.person} />
          <span className="name">{p.name}</span>
          {isMe && <span className="you-tag">You</span>}
        </span>
        <RiderSummary riders={b.riders} />
        {b.note && <span className="note">{b.note}</span>}
      </span>
      <span className="agenda-end">
        {showStatus && <StatusPill progress={bookingProgress(b)} />}
        <span className="chev">
          <Ic.Chevron />
        </span>
      </span>
    </button>
  );
}

/** The "who has the car now" hero banner shown on Home. */
export function StatusBanner({
  status,
  onRequest,
}: {
  status: DayStatus;
  onRequest?: (booking: BookingView) => void;
}) {
  const { people } = useBookingUi();
  const me = useMeId();
  const isFree = status.kind === "free" || status.kind === "day-free";
  const cls = isFree ? "banner is-free" : "banner is-busy";

  let style: CSSProperties | undefined;

  if (status.kind === "allday" || status.kind === "busy") {
    style = pcStyle(personOf(people, status.booking.person).color);
  } else if (status.kind === "day-has") {
    style = pcStyle(personOf(people, status.items[0].person).color);
  }

  // Someone else holds the car right now, so offer to ask for it.
  const holder =
    status.kind === "busy" || status.kind === "allday" ? status.booking : null;

  return (
    <div className={cls} style={style}>
      <div className="banner-content">
        <BannerInner status={status} />
        {holder !== null &&
          holder.person !== me &&
          onRequest !== undefined && (
            <RequestButton booking={holder} onRequest={onRequest} />
          )}
      </div>
      <img
        className="banner-car"
        src={velozCarUrl}
        alt="Toyota Veloz"
        aria-hidden="true"
      />
    </div>
  );
}

function RequestButton({
  booking,
  onRequest,
}: {
  booking: BookingView;
  onRequest: (booking: BookingView) => void;
}) {
  const p = usePerson(booking.person);

  return (
    <button
      type="button"
      className="btn-request"
      onClick={() => { onRequest(booking); }}
    >
      <Ic.Bell /> Ask {p.name} for the car
    </button>
  );
}

function NextPill({ next }: { next: BookingView }) {
  const p = usePerson(next.person);

  return (
    <div className="next-pill">
      <Avatar pid={next.person} size="sm" /> Next: {p.name} at{" "}
      {fmtTime(next.start)}
    </div>
  );
}

function BannerInner({ status }: { status: DayStatus }) {
  if (status.kind === "allday") {
    return <AllDayBanner booking={status.booking} />;
  }
  if (status.kind === "busy") {
    return <BusyBanner booking={status.booking} next={status.next} />;
  }
  if (status.kind === "free") {
    return (
      <>
        <div className="banner-state">
          <span className="pulse" />
          <span className="state-label">Available now</span>
        </div>
        <h1>The car is free.</h1>
        {status.next ? (
          <NextPill next={status.next} />
        ) : (
          <p className="sub">Nothing booked for the rest of today.</p>
        )}
      </>
    );
  }
  if (status.kind === "day-free") {
    return (
      <>
        <div className="banner-state">
          <span className="pulse" />
          <span className="state-label">Open day</span>
        </div>
        <h1>No bookings yet.</h1>
        <p className="sub">
          The car is free all day. Tap New booking to claim a time.
        </p>
      </>
    );
  }

  return <DayHasBanner items={status.items} />;
}

function AllDayBanner({ booking }: { booking: BookingView }) {
  const { people } = useBookingUi();
  const p = personOf(people, booking.person);
  const riderNames = booking.riders
    .map((r) => personOf(people, r).name)
    .join(" & ");

  return (
    <>
      <div className="banner-state">
        <span className="pulse" />
        <span className="state-label">Booked all day</span>
      </div>
      <h1>{p.name} has the car all day.</h1>
      <p className="sub">
        {booking.note || "Whole-day booking. The car is unavailable."}
        {booking.riders.length > 0 && <> Travelling with {riderNames}.</>}
      </p>
    </>
  );
}

function BusyBanner({
  booking,
  next,
}: {
  booking: BookingView;
  next?: BookingView;
}) {
  const p = usePerson(booking.person);

  return (
    <>
      <div className="banner-state">
        <span className="pulse" />
        <span className="state-label">In use now</span>
      </div>
      <h1>
        {p.name} has the car until {fmtTime(booking.end)}.
      </h1>
      {next ? (
        <NextPill next={next} />
      ) : (
        <p className="sub">Free after that for the rest of the day.</p>
      )}
    </>
  );
}

function DayHasBanner({ items }: { items: Array<BookingView> }) {
  const first = items[0];
  const p = usePerson(first.person);

  return (
    <>
      <div className="banner-state">
        <span className="pulse" />
        <span className="state-label">
          {items.length} booking{items.length > 1 ? "s" : ""}
        </span>
      </div>
      <h1>
        {p.name} starts the day
        {first.allDay ? " (all day)" : ` at ${fmtTime(first.start)}`}.
      </h1>
      <p className="sub">
        {items.length > 1
          ? `${items.length} trips planned. Tap a booking to see details.`
          : first.note || "One trip planned."}
      </p>
    </>
  );
}

/** Live overlap feedback shown under the booking form. */
export function ConflictWarning({
  conflicts,
  draft,
}: {
  conflicts: Array<BookingView>;
  draft: BookingDraft;
}) {
  if (!draft.allDay && (!draft.start || !draft.end)) {
    return null;
  }

  if (conflicts.length === 0) {
    return (
      <div className="warn ok">
        <Ic.CheckCircle />
        <div>
          <div className="w-title">No clashes</div>
          <div className="w-body">This time is open. Good to book.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="warn">
      <Ic.Alert />
      <div>
        <div className="w-title">Double-booking</div>
        <div className="w-body">
          {conflicts.map((c) => (
            <ConflictLine key={c.id} c={c} />
          ))}
          <div style={{ marginTop: 4, opacity: 0.85 }}>
            Pick another time or check with them first.
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictLine({ c }: { c: BookingView }) {
  const p = usePerson(c.person);
  const when = c.allDay
    ? "all day"
    : `${fmtTime(c.start)} to ${fmtTime(c.end)}`;

  return (
    <div>
      {p.name} already has the car {when}.
    </div>
  );
}

/** Placeholder shown for a day with no bookings. */
export function EmptyDay({ label }: { label: string }) {
  return (
    <div className="empty">
      <Ic.Car />
      <div className="big">Car is free {label}</div>
      <div>No bookings yet.</div>
    </div>
  );
}
