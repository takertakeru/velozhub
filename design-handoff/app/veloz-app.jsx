/* VelozHub app: screens, navigation, booking form, detail. Exposes window.VelozApp. */
const VV = window.Veloz;
const UI = window.VelozUI;
const Ic = window.VelozIcons;
const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM, useCallback: uC } = React;

const STORE_KEY = 'veloz-bookings-v3';

/* ============ helpers ============ */
function loadBookings(persist) {
  if (persist) {
    try { const raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  }
  return VV.seed();
}
function weekDays(anchorIso, mondayStart) {
  const d = VV.parseISO(anchorIso);
  const dow = d.getDay(); // 0 Sun..6 Sat
  const back = mondayStart ? (dow + 6) % 7 : dow;
  const start = VV.addDays(d, -back);
  return Array.from({ length: 7 }, (_, i) => VV.iso(VV.addDays(start, i)));
}

/* ============ Day selector strip (phone, week view) ============ */
function DayStrip({ days, selected, onSelect, bookings }) {
  return (
    <div className="daystrip">
      {days.map((iso) => {
        const d = VV.parseISO(iso);
        const items = VV.onDate(bookings, iso);
        const isToday = iso === VV.TODAY_ISO;
        return (
          <button key={iso} className={'daycell' + (iso === selected ? ' active' : '') + (isToday ? ' today' : '')}
            onClick={() => onSelect(iso)}>
            <div className="dow">{VV.DOW[d.getDay()]}</div>
            <div className="dnum tnum">{d.getDate()}</div>
            <div className="dots">
              {items.slice(0, 3).map((b) => <i key={b.id} style={{ background: VV.PEOPLE[b.person].color }} />)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ============ HOME ============ */
function HomeScreen({ bookings, wide, onOpen }) {
  const status = uM(() => VV.dayStatus(VV.TODAY_ISO, bookings), [bookings]);
  const today = uM(() => VV.onDate(bookings, VV.TODAY_ISO), [bookings]);
  const upcoming = uM(() => [1, 2, 3].map((n) => {
    const iso = VV.iso(VV.addDays(VV.TODAY, n));
    return { iso, items: VV.onDate(bookings, iso) };
  }), [bookings]);

  const todayList = today.length
    ? <ul className="agenda">{today.map((b) => <li key={b.id}><UI.AgendaItem b={b} onOpen={onOpen} /></li>)}</ul>
    : <UI.EmptyDay label="today" />;

  if (!wide) {
    return (
      <div className="content">
        <UI.StatusBanner status={status} />
        <div className="section-head">
          <h2>Today</h2>
          <span className="count">{VV.fullDate(VV.TODAY_ISO)}</span>
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
          <div className="sub">{VV.DOW_LONG[VV.TODAY.getDay()]}, {VV.MON[VV.TODAY.getMonth()]} {VV.TODAY.getDate()}</div>
        </div>
      </header>
      <div className="home-grid">
        <div className="today-col">
          <UI.StatusBanner status={status} />
          <div className="section-head"><h2>Today's bookings</h2><span className="count">{today.length} trip{today.length !== 1 ? 's' : ''}</span></div>
          {todayList}
        </div>
        <aside className="upcoming-rail">
          <div className="section-head" style={{ margin: 0 }}><h2 style={{ fontSize: 'var(--fs-h)' }}>Coming up</h2></div>
          {upcoming.map(({ iso, items }) => (
            <div className="day-card" key={iso}>
              <div className="dc-head">
                <span className="d">{VV.relDayLabel(iso)}</span>
                <span className="n">{VV.fullDate(iso)}</span>
              </div>
              <div className="dc-list">
                {items.length
                  ? items.map((b) => <UI.AgendaItem key={b.id} b={b} onOpen={onOpen} />)
                  : <div className="faint" style={{ fontSize: 'var(--fs-sm)', padding: '2px 0 4px' }}>Free all day</div>}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

/* ============ WEEK ============ */
function WeekScreen({ bookings, wide, onOpen }) {
  const [selected, setSelected] = uS(VV.TODAY_ISO);
  const [weekOff, setWeekOff] = uS(0);

  // Phone: 14-day strip from today (this week + next week).
  const strip = uM(() => Array.from({ length: 14 }, (_, i) => VV.iso(VV.addDays(VV.TODAY, i))), []);
  // Desktop: 7-column week grid for the offset week.
  const days = uM(() => weekDays(VV.iso(VV.addDays(VV.TODAY, weekOff * 7)), true), [weekOff]);

  if (!wide) {
    const items = VV.onDate(bookings, selected);
    return (
      <div className="content">
        <div className="weeklabel">{VV.relDayLabel(strip[0]) === 'Today' ? 'This week & next' : ''}</div>
        <DayStrip days={strip} selected={selected} onSelect={setSelected} bookings={bookings} />
        <div className="section-head">
          <h2>{VV.relDayLabel(selected)}</h2>
          <span className="count">{VV.fullDate(selected)}</span>
        </div>
        {items.length
          ? <ul className="agenda">{items.map((b) => <li key={b.id}><UI.AgendaItem b={b} onOpen={onOpen} /></li>)}</ul>
          : <UI.EmptyDay label={VV.relDayLabel(selected).toLowerCase()} />}
      </div>
    );
  }

  // Desktop: 7-column week grid.
  const rangeLabel = `${VV.MON[VV.parseISO(days[0]).getMonth()]} ${VV.parseISO(days[0]).getDate()} – ${VV.MON[VV.parseISO(days[6]).getMonth()]} ${VV.parseISO(days[6]).getDate()}`;
  return (
    <div className="content">
      <header className="page-head">
        <div>
          <h1>Week</h1>
          <div className="sub">{weekOff === 0 ? 'This week' : weekOff === 1 ? 'Next week' : rangeLabel} · {rangeLabel}</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--s2)' }}>
          <button className="icon-btn" onClick={() => setWeekOff((w) => w - 1)} aria-label="Previous week"><Ic.ChevronL /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekOff(0)}>Today</button>
          <button className="icon-btn" onClick={() => setWeekOff((w) => w + 1)} aria-label="Next week"><Ic.Chevron /></button>
        </div>
      </header>
      <div className="weekgrid">
        {days.map((iso) => {
          const d = VV.parseISO(iso);
          const items = VV.onDate(bookings, iso);
          const isToday = iso === VV.TODAY_ISO;
          return (
            <div className="wcol" key={iso}>
              <div className={'wcol-head' + (isToday ? ' today' : '')}>
                <div className="dow">{VV.DOW[d.getDay()]}</div>
                <div className="dnum tnum">{d.getDate()}</div>
              </div>
              <div className="wbody">
                {items.length ? items.map((b) => {
                  const p = VV.PEOPLE[b.person];
                  return (
                    <button key={b.id} className={'wblock' + (b.allDay ? ' allday' : '')} style={{ '--pc': p.color }} onClick={() => onOpen(b.id)}>
                      <div className="wt">{b.allDay ? <><Ic.Sun /> All day</> : VV.fmtTime(b.start)}</div>
                      <div className="wn">{p.name}</div>
                    </button>
                  );
                }) : <div className="wempty">Free</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ BOOKING FORM (new / edit) ============ */
function BookingForm({ wide, initial, bookings, onSave, onClose }) {
  const [draft, setDraft] = uS(initial);
  const conflicts = uM(() => VV.findConflicts(draft, bookings), [draft, bookings]);
  const valid = VV.validateDraft(draft);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const riderOptions = VV.ORDER.filter((p) => p !== draft.person);
  const toggleRider = (r) => set({ riders: draft.riders.includes(r) ? draft.riders.filter((x) => x !== r) : [...draft.riders, r] });
  const editing = !!initial.id;

  const canSave = valid.ok; // conflicts warn but do not hard-block (family can override)

  return (
    <div className={'scrim' + (wide ? ' modal' : '')} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>{editing ? 'Edit booking' : 'New booking'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Ic.Close /></button>
        </div>
        <div className="sheet-body">
          <div className="field">
            <label htmlFor="bk-date">Date</label>
            <input id="bk-date" type="date" className="input tnum" value={draft.date} min={VV.TODAY_ISO}
              onChange={(e) => set({ date: e.target.value })} />
          </div>

          <div className="field">
            <div className="toggle-row">
              <div className="tl"><b>All day</b><span>Blocks the whole day for everyone</span></div>
              <UI.Switch checked={draft.allDay} onChange={(v) => set({ allDay: v })} />
            </div>
          </div>

          {!draft.allDay && (
            <div className="field">
              <label>Time</label>
              <div className="time-row">
                <input type="time" className="input tnum" value={draft.start} step="900" onChange={(e) => set({ start: e.target.value })} aria-label="Start time" />
                <input type="time" className="input tnum" value={draft.end} step="900" onChange={(e) => set({ end: e.target.value })} aria-label="End time" />
              </div>
            </div>
          )}

          <div className="field">
            <label>Riders <span className="faint" style={{ fontWeight: 500 }}>· optional</span></label>
            <div className="riders-grid">
              {riderOptions.map((r) => {
                const on = draft.riders.includes(r);
                return (
                  <button key={r} type="button" className="chip selectable" aria-pressed={on}
                    style={{ '--pc': VV.PEOPLE[r].color }} onClick={() => toggleRider(r)}>
                    <UI.Avatar pid={r} size="sm" />{VV.PEOPLE[r].name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label htmlFor="bk-note">Note <span className="faint" style={{ fontWeight: 500 }}>· optional</span></label>
            <textarea id="bk-note" className="input" placeholder="Where to, or anything the family should know" maxLength={120}
              value={draft.note} onChange={(e) => set({ note: e.target.value })} />
          </div>

          {!valid.ok
            ? <div className="warn"><Ic.Alert /><div><div className="w-title">Check the times</div><div className="w-body">{valid.error}</div></div></div>
            : <UI.ConflictWarning conflicts={conflicts} draft={draft} />}
        </div>
        <div className="sheet-foot">
          <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-block" disabled={!canSave}
            style={{ opacity: canSave ? 1 : .5 }}
            onClick={() => canSave && onSave(draft)}>
            <Ic.Check />{editing ? 'Save changes' : 'Book the car'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ DETAIL ============ */
function DetailSheet({ wide, booking, onEdit, onCancel, onClose }) {
  const [confirm, setConfirm] = uS(false);
  const p = VV.PEOPLE[booking.person];
  const mine = booking.person === VV.CURRENT_USER;
  const when = booking.allDay ? 'All day' : `${VV.fmtTime(booking.start)} to ${VV.fmtTime(booking.end)}`;
  return (
    <div className={'scrim' + (wide ? ' modal' : '')} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Booking</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Ic.Close /></button>
        </div>
        <div className="sheet-body">
          <div className="detail-hero">
            <UI.Avatar pid={booking.person} size="lg" />
            <div>
              <div className="name">{p.name}{mine && <span className="you-tag" style={{ marginLeft: 8 }}>You</span>}</div>
              <div className="when">{VV.relDayLabel(booking.date)}, {VV.fullDate(booking.date)}</div>
            </div>
          </div>

          <div className="kv">
            <div className="k">When</div>
            <div className="v" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {booking.allDay ? <UI.AllDayTag /> : <b className="tnum">{when}</b>}
            </div>
          </div>
          <div className="kv">
            <div className="k">Riders</div>
            <div className="v">
              {booking.riders.length
                ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{booking.riders.map((r) => <UI.PersonChip key={r} pid={r} />)}</div>
                : <span className="faint">Solo trip</span>}
            </div>
          </div>
          <div className="kv">
            <div className="k">Note</div>
            <div className="v">{booking.note ? booking.note : <span className="faint">No note</span>}</div>
          </div>

          {!mine && (
            <div className="lock-note"><Ic.Lock /> Only {p.name} can edit or cancel this booking.</div>
          )}
        </div>
        {mine && (
          <div className="sheet-foot">
            {!confirm ? (
              <>
                <button className="btn btn-danger" style={{ flex: '0 0 auto' }} onClick={() => setConfirm(true)}><Ic.Trash /> Cancel trip</button>
                <button className="btn btn-primary btn-block" onClick={() => onEdit(booking.id)}><Ic.Edit /> Edit</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setConfirm(false)}>Keep</button>
                <button className="btn btn-danger btn-block" onClick={() => onCancel(booking.id)}><Ic.Trash /> Yes, cancel this trip</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ APP SHELL ============ */
function App({ wide, initialScreen, initialDetailId, onThemeToggle, theme }) {
  const persist = App._persist !== false;
  const [bookings, setBookings] = uS(() => loadBookings(App._persist));
  const [screen, setScreen] = uS(initialScreen === 'week' ? 'week' : 'home');
  const [detailId, setDetailId] = uS(initialScreen === 'detail' ? initialDetailId : null);
  const [form, setForm] = uS(initialScreen === 'new' ? { mode: 'new' } : null);

  uE(() => { if (App._persist) { try { localStorage.setItem(STORE_KEY, JSON.stringify(bookings)); } catch (e) {} } }, [bookings]);

  const detail = detailId ? bookings.find((b) => b.id === detailId) : null;

  const openNew = () => { setDetailId(null); setForm({ mode: 'new' }); };
  const openEdit = (id) => { setForm({ mode: 'edit', id }); setDetailId(null); };
  const saveBooking = (draft) => {
    setBookings((list) => {
      if (draft.id) return list.map((b) => (b.id === draft.id ? { ...draft } : b));
      return [...list, { ...draft, id: VV.nid() }];
    });
    setForm(null);
  };
  const cancelBooking = (id) => { setBookings((list) => list.filter((b) => b.id !== id)); setDetailId(null); };

  const newDraft = () => ({ person: VV.CURRENT_USER, date: VV.TODAY_ISO, allDay: false, start: '16:00', end: '18:00', riders: [], note: '' });
  const formInitial = form && form.mode === 'edit' ? { ...bookings.find((b) => b.id === form.id) } : newDraft();

  const navItems = [
    { id: 'home', label: 'Home', icon: Ic.Home },
    { id: 'week', label: 'Week', icon: Ic.Calendar },
  ];

  return (
    <div className="app-frame">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="brand"><Ic.Mark className="mark" /> VelozHub</div>
        {navItems.map((n) => (
          <button key={n.id} className={'nav-link' + (screen === n.id ? ' active' : '')} onClick={() => setScreen(n.id)}>
            <n.icon /> {n.label}
          </button>
        ))}
        <button className="btn btn-primary new-btn" onClick={openNew}><Ic.Plus /> New booking</button>
        <div className="me">
          <UI.Avatar pid={VV.CURRENT_USER} />
          <div><div className="nm">{VV.PEOPLE[VV.CURRENT_USER].name}</div><div className="rl">Signed in · this device</div></div>
          {onThemeToggle && (
            <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onThemeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Ic.Sun /> : <Ic.Moon />}
            </button>
          )}
        </div>
      </aside>

      <div className="main">
        {/* Phone top bar */}
        <div className="topbar">
          <div className="brand"><Ic.Mark className="mark" /> VelozHub</div>
          <div className="spacer" />
          {onThemeToggle && (
            <button className="icon-btn" onClick={onThemeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Ic.Sun /> : <Ic.Moon />}
            </button>
          )}
          <UI.Avatar pid={VV.CURRENT_USER} />
        </div>

        <div className="scrollarea">
          {screen === 'home'
            ? <HomeScreen bookings={bookings} wide={wide} onOpen={setDetailId} />
            : <WeekScreen bookings={bookings} wide={wide} onOpen={setDetailId} />}
        </div>

        {/* Phone tab bar */}
        <nav className="tabbar">
          <button className={'tab' + (screen === 'home' ? ' active' : '')} onClick={() => setScreen('home')}><Ic.Home /> Home</button>
          <button className="tab fab" onClick={openNew}><span className="fab-circle"><Ic.Plus /></span><span>New</span></button>
          <button className={'tab' + (screen === 'week' ? ' active' : '')} onClick={() => setScreen('week')}><Ic.Calendar /> Week</button>
        </nav>
      </div>

      {detail && <DetailSheet wide={wide} booking={detail} onEdit={openEdit} onCancel={cancelBooking} onClose={() => setDetailId(null)} />}
      {form && <BookingForm wide={wide} initial={formInitial} bookings={bookings} onSave={saveBooking} onClose={() => setForm(null)} />}
    </div>
  );
}

/* ============ ROOT + MOUNT ============ */
function VelozRoot({ initialScreen, initialDetailId, theme: themeProp, showThemeToggle, persist, applyVars }) {
  const rootRef = uR(null);
  const [wide, setWide] = uS(false);
  const [theme, setTheme] = uS(() => {
    if (showThemeToggle) { try { const t = localStorage.getItem('veloz-theme'); if (t) return t; } catch (e) {} }
    return themeProp || 'light';
  });

  uE(() => { if (themeProp) setTheme(themeProp); }, [themeProp]);
  uE(() => { if (showThemeToggle) { try { localStorage.setItem('veloz-theme', theme); } catch (e) {} } }, [theme, showThemeToggle]);

  uE(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWide(e.contentRect.width >= 1040);
    });
    ro.observe(el);
    setWide(el.clientWidth >= 1040);
    return () => ro.disconnect();
  }, []);

  App._persist = persist;

  const styleVars = applyVars || {};
  return (
    <div className="veloz" data-theme={theme} ref={rootRef} style={styleVars}>
      <App wide={wide} initialScreen={initialScreen} initialDetailId={initialDetailId}
        theme={theme}
        onThemeToggle={showThemeToggle ? () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) : null} />
    </div>
  );
}

window.VelozApp = {
  mount(el, opts = {}) {
    const root = ReactDOM.createRoot(el);
    root.render(<VelozRoot {...opts} />);
    return root;
  },
  VelozRoot,
};
