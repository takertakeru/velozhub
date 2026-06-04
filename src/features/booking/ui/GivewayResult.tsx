/**
 * The give-way result notice: shown to the asker once the holder has answered,
 * or the slot fell through. Accepted means the holder gave way and the slot is
 * free, with a one-tap Claim that books it confirmed-directly. Declined means
 * the holder kept their booking, with their reason. Withdrawn means the slot is
 * no longer available (the holder cancelled it, or another ask won it first).
 * Mirrors DeclineNotice.
 *
 * Surfaced by the shell from `useMyGivewayResults`; claiming or dismissing marks
 * it acknowledged (`useClaimGiveway` / `useAcknowledgeGiveway`) so it does not
 * pop again.
 */
import * as Ic from "@/components/veloz/icons";
import { fmtTime, fullDate, relDayLabel } from "../time";
import type { GivewayView } from "../types";
import { Avatar } from "./components";
import { personOf, useBookingUi } from "./context";

export function GivewayResult({
  wide,
  result,
  busy,
  onClaim,
  onDismiss,
}: {
  wide: boolean;
  result: GivewayView;
  busy: boolean;
  onClaim: () => void;
  onDismiss: () => void;
}) {
  const { people } = useBookingUi();
  const holder = personOf(people, result.toUser);
  const when = result.allDay
    ? "All day"
    : `${fmtTime(result.start)} to ${fmtTime(result.end)}`;
  const isAccepted = result.status === "accepted";
  const isDeclined = result.status === "declined";

  let title: string;
  let sub: string;

  if (isAccepted) {
    title = "The car is yours";
    sub = `${holder.name} gave way. Claim the slot to book it.`;
  } else if (isDeclined) {
    title = "Booking kept";
    sub = `${holder.name} is keeping their booking.`;
  } else {
    title = "Slot no longer free";
    sub = "That booking was cancelled or taken by someone else.";
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wide ? "scrim modal" : "scrim"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onDismiss();
        }
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <div className="sheet-title">
            <h2>{title}</h2>
            <p>{sub}</p>
          </div>
          <button className="icon-btn" aria-label="Dismiss" onClick={onDismiss}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          <div className="decline-notice">
            <div className="decline-slot">
              {isAccepted && (
                <span className="decline-who ok">
                  <Ic.CheckCircle /> <strong>{holder.name}</strong> gave way for
                  you
                </span>
              )}
              {isDeclined && (
                <span className="decline-who">
                  <Avatar pid={holder.id} size="sm" />
                  <strong>{holder.name}</strong> kept their booking
                </span>
              )}
              {!isAccepted && !isDeclined && (
                <span className="decline-who">That slot is no longer free</span>
              )}
              <div className="when">
                {relDayLabel(result.date)}, {fullDate(result.date)} · {when}
              </div>
            </div>

            {isDeclined && (
              <div className="decline-reason">
                <span className="grouplabel">Reason</span>
                {result.responseReason ? (
                  <p>{result.responseReason}</p>
                ) : (
                  <p className="faint">No reason given</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="sheet-foot">
          {isAccepted ? (
            <>
              <button
                className="btn btn-block"
                disabled={busy}
                onClick={onDismiss}
              >
                Not now
              </button>
              <button
                className="btn btn-primary btn-block"
                disabled={busy}
                onClick={onClaim}
              >
                <Ic.Car /> Claim the slot
              </button>
            </>
          ) : (
            <button className="btn btn-block" onClick={onDismiss}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
