/* VelozHub core: people, seed data, date/time + conflict helpers.
   Plain JS (no JSX) so it loads before Babel. Exposes window.Veloz. */
(function () {
  // ---- People ---------------------------------------------------------
  // Signed-in user is "leo" (this is Leo's phone).
  const PEOPLE = {
    dad:   { id: 'dad',   name: 'Dad',   color: 'var(--c-dad)',   initials: 'D' },
    mom:   { id: 'mom',   name: 'Mom',   color: 'var(--c-mom)',   initials: 'M' },
    ana:   { id: 'ana',   name: 'Ana',   color: 'var(--c-ana)',   initials: 'A' },
    marco: { id: 'marco', name: 'Marco', color: 'var(--c-marco)', initials: 'Mc' },
    leo:   { id: 'leo',   name: 'Leo',   color: 'var(--c-leo)',   initials: 'L' },
  };
  const ORDER = ['dad', 'mom', 'ana', 'marco', 'leo'];
  const CURRENT_USER = 'leo';

  // ---- Time anchor ----------------------------------------------------
  // Deterministic "today" so the prototype is stable: Sat 31 May 2026.
  // Simulated current clock = 09:15 (so Mom is mid-trip; demonstrates the rich banner state).
  const TODAY = new Date(2026, 4, 31); // months 0-indexed → 4 = May
  const NOW_MINUTES = 9 * 60 + 15;

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const TODAY_ISO = iso(TODAY);

  function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  const minsOf = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  function fmtTime(t) {
    const [h, m] = t.split(':').map(Number);
    const ap = h < 12 ? 'AM' : 'PM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hh} ${ap}` : `${hh}:${pad(m)} ${ap}`;
  }
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function relDayLabel(isoStr) {
    if (isoStr === TODAY_ISO) return 'Today';
    if (isoStr === iso(addDays(TODAY, 1))) return 'Tomorrow';
    if (isoStr === iso(addDays(TODAY, -1))) return 'Yesterday';
    const d = parseISO(isoStr);
    return `${DOW_LONG[d.getDay()]}`;
  }
  function fullDate(isoStr) { const d = parseISO(isoStr); return `${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`; }

  // ---- Seed bookings --------------------------------------------------
  // id, person, date(iso), allDay, start, end (24h "HH:MM"), riders[], note
  let _id = 100;
  const nid = () => `bk${_id++}`;
  const D = (n) => iso(addDays(TODAY, n));

  const SEED = [
    // Today (Sat) — Mom mid-trip now, Leo this afternoon, Ana + Marco tonight
    { id: nid(), person: 'mom', date: D(0), allDay: false, start: '08:00', end: '10:30', riders: ['dad'], note: 'Grocery run then pharmacy pickup' },
    { id: nid(), person: 'leo', date: D(0), allDay: false, start: '13:00', end: '15:00', riders: [], note: 'Gym, then library to return books' },
    { id: nid(), person: 'ana', date: D(0), allDay: false, start: '18:30', end: '22:00', riders: ['marco'], note: "Dinner at Marco's parents" },

    // Tomorrow (Sun) — whole-day road trip
    { id: nid(), person: 'dad', date: D(1), allDay: true, start: '', end: '', riders: ['mom'], note: 'Road trip to the coast, back late' },

    // Mon
    { id: nid(), person: 'leo', date: D(2), allDay: false, start: '07:30', end: '08:30', riders: [], note: 'Drop-off before class' },
    { id: nid(), person: 'marco', date: D(2), allDay: false, start: '19:00', end: '21:30', riders: ['ana'], note: 'Cinema downtown' },

    // Tue
    { id: nid(), person: 'mom', date: D(3), allDay: false, start: '09:00', end: '12:00', riders: [], note: 'Dentist + errands' },

    // Wed
    { id: nid(), person: 'ana', date: D(4), allDay: true, start: '', end: '', riders: [], note: 'Job interview out of town' },

    // Thu
    { id: nid(), person: 'leo', date: D(5), allDay: false, start: '17:00', end: '19:00', riders: ['dad'], note: 'Hardware store' },
    { id: nid(), person: 'mom', date: D(5), allDay: false, start: '07:00', end: '09:00', riders: [], note: 'Early shift drop-off' },

    // Fri
    { id: nid(), person: 'marco', date: D(6), allDay: false, start: '20:00', end: '23:30', riders: ['ana'], note: "Concert" },

    // Next week samples
    { id: nid(), person: 'dad', date: D(8), allDay: false, start: '06:30', end: '08:00', riders: [], note: 'Airport drop' },
    { id: nid(), person: 'leo', date: D(9), allDay: false, start: '14:00', end: '16:00', riders: ['mom'], note: 'Furniture pickup' },
    { id: nid(), person: 'ana', date: D(11), allDay: true, start: '', end: '', riders: ['marco'], note: 'Weekend away' },
  ];

  // ---- Selectors ------------------------------------------------------
  function sortBookings(list) {
    return [...list].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1; // all-day first
      return minsOf(a.start || '00:00') - minsOf(b.start || '00:00');
    });
  }
  const onDate = (list, isoStr) => sortBookings(list.filter((b) => b.date === isoStr));

  // ---- Conflict detection --------------------------------------------
  // Returns array of bookings in `list` that clash with `draft` (same date).
  // Rule: any all-day (existing or draft) blocks the whole day; otherwise time ranges overlap.
  function findConflicts(draft, list) {
    return list.filter((b) => {
      if (b.id === draft.id) return false;
      if (b.date !== draft.date) return false;
      if (draft.allDay || b.allDay) return true;
      const s1 = minsOf(draft.start), e1 = minsOf(draft.end);
      const s2 = minsOf(b.start), e2 = minsOf(b.end);
      return s1 < e2 && s2 < e1;
    });
  }

  // Validate a draft → { ok, error } (range sanity). Conflicts handled separately.
  function validateDraft(d) {
    if (!d.date) return { ok: false, error: 'Pick a date.' };
    if (!d.allDay) {
      if (!d.start || !d.end) return { ok: false, error: 'Set a start and end time.' };
      if (minsOf(d.end) <= minsOf(d.start)) return { ok: false, error: 'End time must be after the start time.' };
    }
    return { ok: true, error: null };
  }

  // ---- "Who has it now" for a given day ------------------------------
  // For TODAY uses NOW_MINUTES; for other days returns a day summary.
  function dayStatus(isoStr, list) {
    const items = onDate(list, isoStr);
    const allDay = items.find((b) => b.allDay);
    const isToday = isoStr === TODAY_ISO;

    if (allDay) {
      return { kind: 'allday', booking: allDay, isToday };
    }
    if (!isToday) {
      return { kind: items.length ? 'day-has' : 'day-free', items, isToday };
    }
    // Today, timed only:
    const timed = items.filter((b) => !b.allDay);
    const current = timed.find((b) => minsOf(b.start) <= NOW_MINUTES && NOW_MINUTES < minsOf(b.end));
    const next = timed.find((b) => minsOf(b.start) > NOW_MINUTES);
    if (current) return { kind: 'busy', booking: current, next, isToday };
    return { kind: 'free', next, isToday };
  }

  function nowLabel() {
    const h = Math.floor(NOW_MINUTES / 60), m = NOW_MINUTES % 60;
    return fmtTime(`${pad(h)}:${pad(m)}`);
  }

  window.Veloz = {
    PEOPLE, ORDER, CURRENT_USER, TODAY, TODAY_ISO, NOW_MINUTES,
    iso, addDays, parseISO, minsOf, fmtTime, DOW, DOW_LONG, MON,
    relDayLabel, fullDate, nowLabel,
    seed: () => SEED.map((b) => ({ ...b, riders: [...b.riders] })),
    nid, sortBookings, onDate, findConflicts, validateDraft, dayStatus,
  };
})();
