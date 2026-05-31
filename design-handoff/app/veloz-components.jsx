/* VelozHub shared components. Loaded as Babel JSX. Exposes window.VelozUI. */
const { useState, useEffect, useRef, useMemo } = React;
const V = window.Veloz;
const I = window.VelozIcons;

/* ---------- Atoms ---------- */
function Avatar({ pid, size }) {
  const p = V.PEOPLE[pid];
  const cls = 'avatar' + (size ? ' ' + size : '');
  return <span className={cls} style={{ '--pc': p.color }} title={p.name}>{p.initials}</span>;
}

function PersonChip({ pid }) {
  const p = V.PEOPLE[pid];
  return (
    <span className="chip" style={{ '--pc': p.color }}>
      <span className="person-dot" /> {p.name}
    </span>
  );
}

function AllDayTag() {
  return <span className="tag-allday"><I.Sun /> All day</span>;
}

function Switch({ checked, onChange, id }) {
  return (
    <button type="button" role="switch" aria-checked={checked} id={id}
      className="switch" onClick={() => onChange(!checked)}>
      <span className="knob" />
    </button>
  );
}

/* ---------- Riders inline summary ---------- */
function RiderSummary({ riders }) {
  if (!riders || riders.length === 0) {
    return <span className="meta"><span className="faint">Solo</span></span>;
  }
  return (
    <span className="meta">
      <span className="riders">{riders.map((r) => <Avatar key={r} pid={r} size="sm" />)}</span>
      <span>with {riders.map((r) => V.PEOPLE[r].name).join(' & ')}</span>
    </span>
  );
}

/* ---------- Agenda item ---------- */
function AgendaItem({ b, onOpen }) {
  const p = V.PEOPLE[b.person];
  const isMe = b.person === V.CURRENT_USER;
  return (
    <button className={'agenda-item' + (b.allDay ? ' allday' : '')} style={{ '--pc': p.color }}
      onClick={() => onOpen(b.id)}>
      <span className="time-col">
        {b.allDay
          ? <AllDayTag />
          : <>
              <span className="time-start tnum">{V.fmtTime(b.start)}</span>
              <span className="time-end tnum">to {V.fmtTime(b.end)}</span>
            </>}
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
      <span className="chev"><I.Chevron /></span>
    </button>
  );
}

/* ---------- Status banner ---------- */
function StatusBanner({ status, onPlan }) {
  let cls = 'banner', style = null, inner = null;

  if (status.kind === 'allday') {
    const p = V.PEOPLE[status.booking.person];
    const others = status.booking.riders;
    cls = 'banner is-busy'; style = { '--pc': p.color };
    inner = (
      <>
        <div className="banner-state"><span className="pulse" /><span className="state-label">Booked all day</span></div>
        <h1>{p.name} has the car all day.</h1>
        <p className="sub">
          {status.booking.note || 'Whole-day booking — the car is unavailable.'}
          {others.length > 0 && <> Travelling with {others.map((r) => V.PEOPLE[r].name).join(' & ')}.</>}
        </p>
      </>
    );
  } else if (status.kind === 'busy') {
    const p = V.PEOPLE[status.booking.person];
    cls = 'banner is-busy'; style = { '--pc': p.color };
    inner = (
      <>
        <div className="banner-state"><span className="pulse" /><span className="state-label">In use now</span></div>
        <h1>{p.name} has the car until {V.fmtTime(status.booking.end)}.</h1>
        {status.next
          ? <div className="next-pill"><Avatar pid={status.next.person} size="sm" /> Next: {V.PEOPLE[status.next.person].name} at {V.fmtTime(status.next.start)}</div>
          : <p className="sub">Free after that for the rest of the day.</p>}
      </>
    );
  } else if (status.kind === 'free') {
    cls = 'banner is-free';
    inner = (
      <>
        <div className="banner-state"><span className="pulse" /><span className="state-label">Available now</span></div>
        <h1>The car is free.</h1>
        {status.next
          ? <div className="next-pill"><Avatar pid={status.next.person} size="sm" /> Next: {V.PEOPLE[status.next.person].name} at {V.fmtTime(status.next.start)}</div>
          : <p className="sub">Nothing booked for the rest of today.</p>}
      </>
    );
  } else if (status.kind === 'day-free') {
    cls = 'banner is-free';
    inner = (
      <>
        <div className="banner-state"><span className="pulse" /><span className="state-label">Open day</span></div>
        <h1>No bookings yet.</h1>
        <p className="sub">The car is free all day. Tap New booking to claim a time.</p>
      </>
    );
  } else {
    const first = status.items[0];
    const p = V.PEOPLE[first.person];
    cls = 'banner is-busy'; style = { '--pc': p.color };
    inner = (
      <>
        <div className="banner-state"><span className="pulse" /><span className="state-label">{status.items.length} booking{status.items.length > 1 ? 's' : ''}</span></div>
        <h1>{p.name} starts the day{first.allDay ? ' (all day)' : ` at ${V.fmtTime(first.start)}`}.</h1>
        <p className="sub">{status.items.length > 1 ? `${status.items.length} trips planned. Tap a booking to see details.` : (first.note || 'One trip planned.')}</p>
      </>
    );
  }

  return (
    <div className={cls} style={style}>
      <div className="banner-content">{inner}</div>
      <img className="banner-car" src="assets/veloz.png" alt="Toyota Veloz" aria-hidden="true" />
    </div>
  );
}

/* ---------- Conflict / OK warning ---------- */
function ConflictWarning({ conflicts, draft }) {
  if (!draft || (!draft.allDay && (!draft.start || !draft.end))) return null;
  if (conflicts.length === 0) {
    return (
      <div className="warn ok">
        <I.CheckCircle />
        <div>
          <div className="w-title">No clashes</div>
          <div className="w-body">This time is open. Good to book.</div>
        </div>
      </div>
    );
  }
  const lines = conflicts.map((c) => {
    const cp = V.PEOPLE[c.person];
    const when = c.allDay ? 'all day' : `${V.fmtTime(c.start)} to ${V.fmtTime(c.end)}`;
    return <div key={c.id}>{cp.name} already has the car {when}.</div>;
  });
  return (
    <div className="warn">
      <I.Alert />
      <div>
        <div className="w-title">Double-booking</div>
        <div className="w-body">
          {lines}
          <div style={{ marginTop: 4, opacity: .85 }}>Pick another time or check with them first.</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyDay({ label }) {
  return (
    <div className="empty">
      <I.Car />
      <div className="big">Car is free {label}</div>
      <div>No bookings yet.</div>
    </div>
  );
}

window.VelozUI = { Avatar, PersonChip, AllDayTag, Switch, RiderSummary, AgendaItem, StatusBanner, ConflictWarning, EmptyDay };
