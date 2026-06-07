/**
 * The give-way center: a minimizable, scrollable sheet that is the single hub for
 * give-way activity, with two sections.
 *
 * "Requests for you" are open asks aimed at the signed-in holder, each with Give
 * way (frees the slot) or Keep it (declines, with an optional reason). Listing
 * them means two people asking for the same slot both show; giving way to one
 * auto-withdraws the others.
 *
 * "Your requests" are asks the user has sent and is waiting on, each with a
 * Withdraw, so the asker can track and cancel a pending ask.
 *
 * Summoned when a fresh incoming ask arrives and from the give-way bell (which
 * also surfaces when only outgoing asks are pending), minimizing back to the bell
 * since asks persist until answered.
 */
import { useState } from "react";
import { toaster } from "@/components/ui/toast";
import * as Ic from "@/components/veloz/icons";
import { useRespondGiveway, useWithdrawGiveway } from "../giveway";
import { fmtTime, fullDate, relDayLabel } from "../time";
import { type GivewayView,NOTE_MAX } from "../types";
import { Avatar, CharCount } from "./components";
import { personOf, useBookingUi } from "./context";

/** Surface a mutation failure as a toast. */
function notify(err: unknown, fallback: string) {
  toaster(err instanceof Error ? err.message : fallback);
}

/** Manila-local slot phrasing for an ask. */
function slotLabel(g: GivewayView): string {
  const when = g.allDay ? "All day" : `${fmtTime(g.start)} to ${fmtTime(g.end)}`;

  return `${relDayLabel(g.date)}, ${fullDate(g.date)} · ${when}`;
}

export function GivewayCenter({
  wide,
  incoming,
  outgoing,
  onClose,
}: {
  wide: boolean;
  incoming: Array<GivewayView>;
  outgoing: Array<GivewayView>;
  onClose: () => void;
}) {
  const summary = [
    incoming.length > 0 ? `${incoming.length} to answer` : null,
    outgoing.length > 0 ? `${outgoing.length} waiting on others` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
            <h2>Give-way requests</h2>
            <p>{summary || "Nothing pending"}</p>
          </div>
          <button className="icon-btn" aria-label="Minimize" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          {incoming.length === 0 && outgoing.length === 0 ? (
            <div className="poll-empty">
              <Ic.CheckCircle />
              <div>No give-way requests right now.</div>
            </div>
          ) : (
          <div className="giveway-sections">
            {incoming.length > 0 && (
              <section className="giveway-group">
                <div className="giveway-group-label">Requests for you</div>
                <div className="poll-list">
                  {incoming.map((r) => (
                    <GivewayIncomingItem key={r.id} request={r} />
                  ))}
                </div>
              </section>
            )}
            {outgoing.length > 0 && (
              <section className="giveway-group">
                <div className="giveway-group-label">Your requests</div>
                <div className="poll-list">
                  {outgoing.map((r) => (
                    <GivewayOutgoingItem key={r.id} request={r} />
                  ))}
                </div>
              </section>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** An ask aimed at me: decide Give way or Keep it. */
function GivewayIncomingItem({ request }: { request: GivewayView }) {
  const { people } = useBookingUi();
  const respondM = useRespondGiveway();
  const asker = personOf(people, request.fromUser);

  // Keeping opens an inline reason composer (optional) so the asker's result
  // notice can explain why, mirroring the poll decline flow.
  const [isKeeping, setIsKeeping] = useState(false);
  const [reason, setReason] = useState("");
  const isBusy = respondM.isPending;

  const giveWay = () => {
    respondM.mutate(
      { requestId: request.id, accept: true },
      {
        onSuccess: () => {
          toaster("You gave way. The slot is free for them.");
        },
        onError: (err) => {
          notify(err, "Could not give way.");
        },
      },
    );
  };

  const keep = (keepReason: string) => {
    respondM.mutate(
      { requestId: request.id, accept: false, reason: keepReason.trim() || undefined },
      {
        onSuccess: () => {
          toaster("You kept your booking.");
        },
        onError: (err) => {
          notify(err, "Could not respond.");
        },
      },
    );
  };

  return (
    <div className="poll-item">
      <div className="poll-top">
        <Avatar pid={asker.id} />
        <div className="poll-who">
          <div className="nm">{asker.name}</div>
          <div className="when">{slotLabel(request)}</div>
        </div>
      </div>

      <div className="decline-reason">
        <span className="grouplabel">Reason</span>
        {request.reason ? (
          <p>{request.reason}</p>
        ) : (
          <p className="faint">No reason given</p>
        )}
      </div>

      {isKeeping ? (
        <div className="poll-reason">
          <label htmlFor={`keep-${request.id}`}>
            Reason for keeping it <span className="faint">(optional)</span>
          </label>
          <textarea
            id={`keep-${request.id}`}
            className="input"
            placeholder="Let them know why, e.g. I need the car then."
            maxLength={NOTE_MAX}
            value={reason}
            disabled={isBusy}
            onChange={(e) => {
              setReason(e.target.value.slice(0, NOTE_MAX));
            }}
          />
          <CharCount value={reason} max={NOTE_MAX} />
          <div className="poll-foot">
            <button
              className="btn btn-ghost"
              disabled={isBusy}
              onClick={() => {
                setIsKeeping(false);
                setReason("");
              }}
            >
              Back
            </button>
            <button
              className="btn btn-danger"
              disabled={isBusy}
              onClick={() => {
                keep(reason);
              }}
            >
              <Ic.Close /> Keep my booking
            </button>
          </div>
        </div>
      ) : (
        <div className="poll-foot">
          <button
            className="btn btn-vote no"
            disabled={isBusy}
            onClick={() => {
              setIsKeeping(true);
            }}
          >
            <Ic.Close /> Keep it
          </button>
          <button
            className="btn btn-vote yes"
            disabled={isBusy}
            onClick={giveWay}
          >
            <Ic.Check /> Give way
          </button>
        </div>
      )}
    </div>
  );
}

/** An ask I sent and am waiting on: shows the holder and lets me withdraw it. */
function GivewayOutgoingItem({ request }: { request: GivewayView }) {
  const { people } = useBookingUi();
  const withdrawM = useWithdrawGiveway();
  const holder = personOf(people, request.toUser);

  const withdraw = () => {
    withdrawM.mutate(request.id, {
      onError: (err) => {
        notify(err, "Could not withdraw the request.");
      },
    });
  };

  return (
    <div className="poll-item">
      <div className="poll-top">
        <Avatar pid={holder.id} />
        <div className="poll-who">
          <div className="nm">{holder.name}</div>
          <div className="when">{slotLabel(request)}</div>
        </div>
      </div>

      {request.reason && (
        <div className="decline-reason">
          <span className="grouplabel">Your reason</span>
          <p>{request.reason}</p>
        </div>
      )}

      <div className="poll-foot giveway-foot">
        <span className="giveway-wait">
          <Ic.Clock aria-hidden="true" />
          <span>Waiting for an answer</span>
        </span>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: "0 0 auto" }}
          disabled={withdrawM.isPending}
          onClick={withdraw}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
