/**
 * Going-out status UI: a soft "what I'm thinking" signal, weaker than a booking.
 *
 * `StatusStrip` shows the signed-in user's current plans as a tappable pill (tap
 * opens the picker) plus a strip of everyone else's, grouped by day and
 * color-coded to each person. `StatusPicker` is the bottom sheet that sets or
 * clears them: a Going/Maybe/Staying-home row for Today and another for Tomorrow,
 * each with an optional note, so plans can be set ahead. Data comes from
 * `../member-status`; see `supabase/migrations/0012_member_status.sql`.
 */
import { type CSSProperties, useState } from "react";
import { toaster } from "@/components/ui/toast";
import * as Ic from "@/components/veloz/icons";
import type { StatusIntent } from "@/libs/supabase/types";
import { useMemberStatuses, useSaveMyStatuses } from "../member-status";
import { addDaysISO, fullDate, relDayLabel, todayManilaISO } from "../time";
import { STATUS_NOTE_MAX, type StatusView } from "../types";
import { Avatar } from "./components";
import { personOf, useBookingUi, useMeId } from "./context";

/** Per-intent colour token, icon, and wording. */
const intentMeta: Record<
  StatusIntent,
  { color: string; Icon: typeof Ic.Car; short: string }
> = {
  going: { color: "var(--free)", Icon: Ic.Car, short: "Going Out" },
  maybe: { color: "var(--busy-ink)", Icon: Ic.Clock, short: "Maybe" },
  not: { color: "var(--ink-3)", Icon: Ic.Home, short: "Staying Home" },
};

const intentOrder: Array<StatusIntent> = ["going", "maybe", "not"];


/** Sort order within a day: heading-out first, staying-in last. */
const intentRank: Record<StatusIntent, number> = { going: 0, maybe: 1, not: 2 };

/** Full sentence shown on the pill, e.g. "Might go out tomorrow". */
function intentSentence(intent: StatusIntent, isToday: boolean): string {
  const when = isToday ? "today" : "tomorrow";

  if (intent === "going") {
    return `Going out ${when}`;
  }
  if (intent === "maybe") {
    return `Might go out ${when}`;
  }

  return `Staying home ${when}`;
}

/** A status refers to today when its date is the current Manila day. */
function statusIsToday(s: StatusView): boolean {
  return s.date === todayManilaISO();
}

/** The signed-in user's pill plus a strip of everyone else's status, by day. */
export function StatusStrip({ onEdit }: { onEdit: () => void }) {
  const me = useMeId();
  const { people } = useBookingUi();
  const { data } = useMemberStatuses();
  const statuses = data ?? [];
  const mine = statuses.filter((s) => s.userId === me);
  const others = statuses.filter((s) => s.userId !== me);
  // Group everyone else by the day a plan is about (Today, then Tomorrow), and
  // within each day sort heading-out first so staying-in sits quietly at the end.
  const days = groupByDay(others);

  return (
    <div className="plan-block">
      <MyPlanPill mine={mine} onEdit={onEdit} />
      {days.map(({ date, items }) => 
        { return <PlanGroup
          key={date}
          label={relDayLabel(date)}
          items={items}
          people={people}
        /> }
      )}
    </div>
  );
}

/** Bucket statuses by their date (ascending), sorted by intent within a day. */
function groupByDay(
  list: Array<StatusView>,
): Array<{ date: string; items: Array<StatusView> }> {
  const dates = [...new Set(list.map((s) => s.date))].sort();

  return dates.map((date) => { return {
    date,
    items: list
      .filter((s) => s.date === date)
      .sort((a, b) => intentRank[a.intent] - intentRank[b.intent]),
  } });
}

function PlanGroup({
  label,
  items,
  people,
}: {
  label: string;
  items: Array<StatusView>;
  people: ReturnType<typeof useBookingUi>["people"];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="plan-strip">
      <span className="plan-strip-label">{label}</span>
      <div className="plan-strip-row">
        {items.map((s) => (
          <PersonPlan key={s.userId} status={s} name={personOf(people, s.userId).name} />
        ))}
      </div>
    </div>
  );
}

function MyPlanPill({
  mine,
  onEdit,
}: {
  mine: Array<StatusView>;
  onEdit: () => void;
}) {
  if (mine.length === 0) {
    return (
      <button type="button" className="plan-card is-empty" onClick={onEdit}>
        <span className="plan-icon">
          <Ic.Car />
        </span>
        <span className="plan-text">
          <b>Set your plan</b>
          <span className="plan-sub">
            Let the family know if you need the car
          </span>
        </span>
        <span className="plan-edit">Set</span>
      </button>
    );
  }

  const sorted = [...mine].sort((a, b) => (a.date < b.date ? -1 : 1));
  const lead = intentMeta[sorted[0].intent];

  return (
    <button
      type="button"
      className="plan-card"
      data-intent={sorted[0].intent}
      style={{ "--ic": lead.color } as CSSProperties}
      onClick={onEdit}
    >
      <span className="plan-icon">
        <lead.Icon />
      </span>
      <span className="plan-text">
        {sorted.map((s) => 
          { return <span className="plan-line" key={s.date}>
            <b>{intentSentence(s.intent, statusIsToday(s))}</b>
            {s.note && <span className="plan-line-note">{s.note}</span>}
          </span> }
        )}
      </span>
      <span className="plan-edit">Change</span>
    </button>
  );
}

function PersonPlan({ status, name }: { status: StatusView; name: string }) {
  const meta = intentMeta[status.intent];
  const isToday = statusIsToday(status);
  const noteSuffix = status.note ? ` (${status.note})` : "";
  const title = `${name}: ${intentSentence(status.intent, isToday)}${noteSuffix}`;

  return (
    <div
      className="plan-chip"
      data-intent={status.intent}
      style={{ "--ic": meta.color } as CSSProperties}
      title={title}
    >
      <Avatar pid={status.userId} />
      <span className="plan-chip-text">
        <span className="plan-chip-name">{name.split(" ")[0]}</span>
        <span className="plan-chip-state">
          <meta.Icon /> {meta.short}
        </span>
        {status.note && <span className="plan-chip-note">{status.note}</span>}
      </span>
    </div>
  );
}

type DayDraft = { intent: StatusIntent | null; note: string };

/**
 * One day's editor inside the picker: an intent row plus a note when set.
 * Tapping the already-selected choice again clears that day.
 */
function DayPlanField({
  label,
  sub,
  draft,
  onIntent,
  onNote,
}: {
  label: string;
  sub: string;
  draft: DayDraft;
  onIntent: (intent: StatusIntent | null) => void;
  onNote: (note: string) => void;
}) {
  return (
    <div className="plan-day">
      <div className="plan-day-head">
        <span>{label}</span>
        <span className="d">{sub}</span>
      </div>
      <div className="plan-seg">
        {intentOrder.map((opt) => {
          const meta = intentMeta[opt];
          const isActive = draft.intent === opt;

          return (
            <button
              key={opt}
              type="button"
              className="chip selectable"
              aria-pressed={isActive}
              style={{ "--pc": meta.color } as CSSProperties}
              onClick={() => { onIntent(isActive ? null : opt); }}
            >
              <meta.Icon /> {meta.short}
            </button>
          );
        })}
      </div>
      {draft.intent !== null && (
        <div className="plan-note">
          <input
            className="input"
            placeholder="Add a note (optional)"
            value={draft.note}
            maxLength={STATUS_NOTE_MAX}
            onChange={(e) => { onNote(e.target.value.slice(0, STATUS_NOTE_MAX)); }}
          />
          <span className="plan-note-count">
            {draft.note.length}/{STATUS_NOTE_MAX}
          </span>
        </div>
      )}
    </div>
  );
}

/** Bottom sheet to set or clear your plans for today and tomorrow. */
export function StatusPicker({
  wide,
  householdId,
  onClose,
}: {
  wide: boolean;
  householdId: string;
  onClose: () => void;
}) {
  const me = useMeId();
  const { data } = useMemberStatuses();
  const today = todayManilaISO();
  const tomorrow = addDaysISO(today, 1);
  const mine = (data ?? []).filter((s) => s.userId === me);
  const hasAny = mine.length > 0;

  const [draft, setDraft] = useState<Record<string, DayDraft>>(() => {
    const forDate = (date: string) => mine.find((s) => s.date === date);

    return {
      [today]: { intent: forDate(today)?.intent ?? null, note: forDate(today)?.note ?? "" },
      [tomorrow]: { intent: forDate(tomorrow)?.intent ?? null, note: forDate(tomorrow)?.note ?? "" },
    };
  });

  const saveM = useSaveMyStatuses();
  const setDay = (date: string, patch: Partial<DayDraft>) => {
    setDraft((d) => ({ ...d, [date]: { ...d[date], ...patch } }));
  };

  const commit = (days: Array<DayDraft & { forDate: string }>) => {
    saveM.mutate(
      { householdId, me, days },
      {
        onSuccess: onClose,
        onError: (err) => {
          toaster(err instanceof Error ? err.message : "Could not save your plan.");
        },
      },
    );
  };

  const save = () => {
    commit([
      { forDate: today, ...draft[today] },
      { forDate: tomorrow, ...draft[tomorrow] },
    ]);
  };

  const clearAll = () => {
    commit([
      { forDate: today, intent: null, note: "" },
      { forDate: tomorrow, intent: null, note: "" },
    ]);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wide ? "scrim modal" : "scrim"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <div className="sheet-title">
            <h2>Set your plan</h2>
            <p>A heads-up, not a booking. Each day clears itself once it passes.</p>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>

        <div className="sheet-body">
          <DayPlanField
            label="Today"
            sub={fullDate(today)}
            draft={draft[today]}
            onIntent={(intent) => { setDay(today, { intent }); }}
            onNote={(note) => { setDay(today, { note }); }}
          />
          <DayPlanField
            label="Tomorrow"
            sub={fullDate(tomorrow)}
            draft={draft[tomorrow]}
            onIntent={(intent) => { setDay(tomorrow, { intent }); }}
            onNote={(note) => { setDay(tomorrow, { note }); }}
          />
        </div>

        <div className="sheet-foot">
          {hasAny && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={saveM.isPending}
              onClick={clearAll}
            >
              <Ic.Trash /> Clear
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={saveM.isPending}
            onClick={save}
          >
            <Ic.Check /> Save plan
          </button>
        </div>
      </div>
    </div>
  );
}
