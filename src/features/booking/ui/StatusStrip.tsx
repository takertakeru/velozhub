/**
 * Going-out status UI: a soft "what I'm thinking" signal, weaker than a booking.
 *
 * `StatusStrip` shows the signed-in user's current status as a tappable pill
 * (tap opens the picker) plus a strip of everyone else's, color-coded to each
 * person. `StatusPicker` is the bottom sheet that sets or clears it: a
 * Today/Tomorrow toggle, a Going/Maybe/Not row, and an optional note. Data comes
 * from `../member-status`; see `supabase/migrations/0012_member_status.sql`.
 */
import { type CSSProperties, useState } from "react";
import * as Ic from "@/components/veloz/icons";
import type { StatusIntent } from "@/libs/supabase/types";
import {
  useClearMyStatus,
  useMemberStatuses,
  useSetMyStatus,
} from "../member-status";
import { addDaysISO, relDayLabel, todayManilaISO } from "../time";
import type { StatusView } from "../types";
import { Avatar } from "./components";
import { personOf, useBookingUi, useMeId, usePeopleOrder } from "./context";

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

  return isToday ? "Not going out today" : "Staying in tomorrow";
}

/** A status refers to today when its date is the current Manila day. */
function statusIsToday(s: StatusView): boolean {
  return s.date === todayManilaISO();
}

/** The signed-in user's pill plus a strip of everyone else's status. */
export function StatusStrip({ onEdit }: { onEdit: () => void }) {
  const me = useMeId();
  const order = usePeopleOrder();
  const { people } = useBookingUi();
  const { data: statuses } = useMemberStatuses();
  const byId = statuses ?? {};
  const mine = me in byId ? byId[me] : null;
  const others = order.filter((id) => id !== me && id in byId);
  // Group by the day a plan is about (Today, then Tomorrow), and within each day
  // sort heading-out first so staying-in sits quietly at the bottom.
  const days = groupByDay(others, byId);

  return (
    <div className="plan-block">
      <MyPlanPill mine={mine} onEdit={onEdit} />
      {days.map(({ date, ids }) => {
        return (
          <PlanGroup
            key={date}
            label={relDayLabel(date)}
            ids={ids}
            byId={byId}
            people={people}
          />
        );
      })}
    </div>
  );
}

/** Bucket member ids by their plan's date (ascending), sorted by intent within. */
function groupByDay(
  ids: Array<string>,
  byId: Record<string, StatusView>,
): Array<{ date: string; ids: Array<string> }> {
  const dates = [...new Set(ids.map((id) => byId[id].date))].sort();

  return dates.map((date) => {
    return {
      date,
      ids: ids
        .filter((id) => byId[id].date === date)
        .sort(
          (a, b) => intentRank[byId[a].intent] - intentRank[byId[b].intent],
        ),
    };
  });
}

function PlanGroup({
  label,
  ids,
  byId,
  people,
}: {
  label: string;
  ids: Array<string>;
  byId: Record<string, StatusView>;
  people: ReturnType<typeof useBookingUi>["people"];
}) {
  if (ids.length === 0) {
    return null;
  }

  return (
    <div className="plan-strip">
      <span className="plan-strip-label">{label}</span>
      <div className="plan-strip-row">
        {ids.map((id) => 
          { return <PersonPlan
            key={id}
            status={byId[id]}
            name={personOf(people, id).name}
          /> }
        )}
      </div>
    </div>
  );
}

function MyPlanPill({
  mine,
  onEdit,
}: {
  mine: StatusView | null;
  onEdit: () => void;
}) {
  if (!mine) {
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

  const meta = intentMeta[mine.intent];

  return (
    <button
      type="button"
      className="plan-card"
      data-intent={mine.intent}
      style={{ "--ic": meta.color } as CSSProperties}
      onClick={onEdit}
    >
      <span className="plan-icon">
        <meta.Icon />
      </span>
      <span className="plan-text">
        <b>{intentSentence(mine.intent, statusIsToday(mine))}</b>
        <span className="plan-sub">
          {mine.note || "Your plan, visible to the family"}
        </span>
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
      </span>
    </div>
  );
}

/** Bottom sheet to set or clear your status. Day toggle + intent row + note. */
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
  const { data: statuses } = useMemberStatuses();
  const mine = statuses?.[me] ?? null;

  const [isTomorrow, setIsTomorrow] = useState(
    mine ? !statusIsToday(mine) : false,
  );
  const [intent, setIntent] = useState<StatusIntent | null>(
    mine?.intent ?? null,
  );
  const [note, setNote] = useState(mine?.note ?? "");

  const setM = useSetMyStatus();
  const clearM = useClearMyStatus();
  const isBusy = setM.isPending || clearM.isPending;

  const save = () => {
    if (!intent) {
      return;
    }

    const forDate = isTomorrow
      ? addDaysISO(todayManilaISO(), 1)
      : todayManilaISO();

    setM.mutate(
      { householdId, me, intent, forDate, note },
      { onSuccess: onClose },
    );
  };

  const clear = () => {
    clearM.mutate(me, { onSuccess: onClose });
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
            <p>A heads-up, not a booking. It clears itself by the next day.</p>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>

        <div className="sheet-body">
          <div className="field">
            <span className="grouplabel">When</span>
            <div className="plan-seg">
              <button
                type="button"
                className="chip selectable"
                aria-pressed={!isTomorrow}
                onClick={() => {
                  setIsTomorrow(false);
                }}
              >
                Today
              </button>
              <button
                type="button"
                className="chip selectable"
                aria-pressed={isTomorrow}
                onClick={() => {
                  setIsTomorrow(true);
                }}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className="field">
            <span className="grouplabel">Plan</span>
            <div className="plan-seg">
              {intentOrder.map((opt) => {
                const meta = intentMeta[opt];

                return (
                  <button
                    key={opt}
                    type="button"
                    className="chip selectable"
                    aria-pressed={intent === opt}
                    style={{ "--pc": meta.color } as CSSProperties}
                    onClick={() => {
                      setIntent(opt);
                    }}
                  >
                    <meta.Icon /> {meta.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label htmlFor="plan-note">Note (optional)</label>
            <textarea
              id="plan-note"
              className="input"
              placeholder="around 3pm, possible coffee run, etc."
              value={note}
              maxLength={120}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="sheet-foot">
          {mine && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={isBusy}
              onClick={clear}
            >
              <Ic.Trash /> Clear
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!intent || isBusy}
            onClick={save}
          >
            <Ic.Check /> Save plan
          </button>
        </div>
      </div>
    </div>
  );
}
