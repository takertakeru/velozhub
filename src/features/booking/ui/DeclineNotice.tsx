/**
 * The decline notice: a modal shown to a proposer whose pending booking another
 * member declined. A declined proposal otherwise just vanishes from the poll
 * list, so this is the only signal the proposer gets. It names who declined and
 * shows their reason (or "No reason given"), and offers a one-tap "Book again"
 * that reopens the booking form prefilled with the same slot.
 *
 * Surfaced by the shell from `useMyRejections`; dismissing or re-booking marks
 * the rejection seen (`useAcknowledgeRejection`) so it does not pop again.
 */
import * as Ic from "@/components/veloz/icons";
import { fmtTime, fullDate, relDayLabel } from "../time";
import type { RejectionView } from "../types";
import { Avatar } from "./components";
import { personOf, useBookingUi } from "./context";

export function DeclineNotice({
  wide,
  rejection,
  onDismiss,
  onRebook,
}: {
  wide: boolean;
  rejection: RejectionView;
  onDismiss: () => void;
  onRebook: () => void;
}) {
  const { people } = useBookingUi();
  const decliner = rejection.declinedBy
    ? personOf(people, rejection.declinedBy)
    : null;
  const when = rejection.allDay
    ? "All day"
    : `${fmtTime(rejection.start)} to ${fmtTime(rejection.end)}`;

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
            <h2>Booking declined</h2>
            <p>Your request for the car was turned down.</p>
          </div>
          <button className="icon-btn" aria-label="Dismiss" onClick={onDismiss}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          <div className="decline-notice">
            <div className="decline-slot">
              {decliner ? (
                <span className="decline-who">
                  <Avatar pid={decliner.id} size="sm" />
                  <strong>{decliner.name}</strong> declined your booking
                </span>
              ) : (
                <span className="decline-who">
                  Your booking was declined
                </span>
              )}
              <div className="when">
                {relDayLabel(rejection.date)}, {fullDate(rejection.date)} · {when}
              </div>
            </div>

            <div className="decline-reason">
              <span className="grouplabel">Reason</span>
              {rejection.reason ? (
                <p>{rejection.reason}</p>
              ) : (
                <p className="faint">No reason given</p>
              )}
            </div>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn btn-block" onClick={onDismiss}>
            Dismiss
          </button>
          <button className="btn btn-primary btn-block" onClick={onRebook}>
            <Ic.Plus /> Book again
          </button>
        </div>
      </div>
    </div>
  );
}
