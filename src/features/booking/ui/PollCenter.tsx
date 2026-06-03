/**
 * The poll center: a minimizable sheet listing every open booking proposal the
 * household is voting on. It is summoned on sign-in (when you still owe a vote)
 * and from the nav bell; closing it just minimizes back to the bell, since the
 * polls themselves persist until they confirm, reject, or time out.
 *
 * Each proposal shows who has approved, a live countdown to the 15-minute
 * auto-approve, and the actions available to you: Approve/Decline for others'
 * proposals, Withdraw for your own, and an admin override for either.
 */
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toast";
import * as Ic from "@/components/veloz/icons";
import { useCancelBooking } from "../mutations";
import { useAdminDecidePoll, useCastVote } from "../polls";
import { fmtTime, fullDate, relDayLabel } from "../time";
import type { PollView } from "../types";
import { Avatar } from "./components";
import {
  personOf,
  useBookingUi,
  useIsAdmin,
  useMeId,
  usePeopleOrder,
} from "./context";

/** Surface a mutation failure as a toast. */
function notify(err: unknown, fallback: string) {
  toaster(err instanceof Error ? err.message : fallback);
}

/** A member's tally state on a poll: approved, declined, or not yet voted. */
function voteState(approve: boolean | undefined): "yes" | "no" | "wait" {
  if (approve === undefined) {
    return "wait";
  }

  return approve ? "yes" : "no";
}

/** Human countdown to a poll's auto-approve deadline. */
function fmtRemaining(deadlineISO: string | null, now: number): string {
  if (!deadlineISO) {
    return "";
  }

  const ms = new Date(deadlineISO).getTime() - now;

  if (ms <= 0) {
    return "Auto-approving now";
  }

  const totalSec = Math.round(ms / 1000);
  const mins = Math.floor(totalSec / 60);

  if (mins >= 60) {
    const h = Math.floor(mins / 60);

    return `Auto-approves in ${h}h ${mins % 60}m`;
  }

  if (mins >= 1) {
    return `Auto-approves in ${mins}m`;
  }

  return `Auto-approves in ${totalSec}s`;
}

export function PollCenter({
  wide,
  polls,
  onClose,
}: {
  wide: boolean;
  polls: Array<PollView>;
  onClose: () => void;
}) {
  const me = useMeId();
  const owed = polls.filter(
    (p) => !p.votes.some((v) => v.profileId === me),
  ).length;

  // One shared clock for every countdown in the list.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

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
            <h2>Pending approvals</h2>
            <p>
              {owed > 0
                ? `${owed} ${owed === 1 ? "poll needs" : "polls need"} your vote`
                : "You have voted on everything open"}
            </p>
          </div>
          <button className="icon-btn" aria-label="Minimize" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          {polls.length === 0 ? (
            <div className="poll-empty">
              <Ic.CheckCircle />
              <div>No open polls. The whole family is in sync.</div>
            </div>
          ) : (
            <div className="poll-list">
              {polls.map((poll) => (
                <PollItem key={poll.id} poll={poll} now={now} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PollItem({ poll, now }: { poll: PollView; now: number }) {
  const { people } = useBookingUi();
  const me = useMeId();
  const isAdmin = useIsAdmin();
  const order = usePeopleOrder();
  const voteM = useCastVote();
  const cancelM = useCancelBooking();
  const adminM = useAdminDecidePoll();

  const proposer = personOf(people, poll.person);
  const isOwner = poll.person === me;
  const myVote = poll.votes.find((v) => v.profileId === me);
  const when = poll.allDay
    ? "All day"
    : `${fmtTime(poll.start)} to ${fmtTime(poll.end)}`;

  const isBusy = voteM.isPending || cancelM.isPending || adminM.isPending;

  const vote = (approve: boolean) => {
    voteM.mutate(
      { bookingId: poll.id, approve },
      {
        onError: (err) => {
          notify(err, "Could not record your vote.");
        },
      },
    );
  };

  const withdraw = () => {
    cancelM.mutate(poll.id, {
      onError: (err) => {
        notify(err, "Could not withdraw the poll.");
      },
    });
  };

  const adminDecide = (decision: "confirmed" | "rejected") => {
    adminM.mutate(
      { bookingId: poll.id, decision },
      {
        onError: (err) => {
          notify(err, "Could not update the poll.");
        },
      },
    );
  };

  return (
    <div className="poll-item">
      <div className="poll-top">
        <Avatar pid={poll.person} />
        <div className="poll-who">
          <div className="nm">
            {proposer.name}
            {isOwner && <span className="you-tag">You</span>}
          </div>
          <div className="when">
            {relDayLabel(poll.date)}, {fullDate(poll.date)} · {when}
          </div>
        </div>
      </div>

      {poll.note && <div className="poll-note">{poll.note}</div>}

      <div className="poll-meta">
        <span className="poll-deadline">
          <Ic.Clock /> {fmtRemaining(poll.deadline, now)}
        </span>
        <span className="faint">· One approval confirms it</span>
      </div>

      <div className="poll-tally">
        {order.map((id) => {
          const p = personOf(people, id);
          const v = poll.votes.find((x) => x.profileId === id);
          const state = voteState(v?.approve);

          return (
            <span className={`tally-chip ${state}`} key={id}>
              <Avatar pid={id} size="sm" />
              <span className="nm">{p.name}</span>
              {state === "yes" && <Ic.Check />}
              {state === "no" && <Ic.Close />}
              {p.voteOptional && <span className="opt">optional</span>}
            </span>
          );
        })}
      </div>

      <div className="poll-foot">
        {isOwner ? (
          <button
            className="btn btn-danger btn-block"
            disabled={isBusy}
            onClick={withdraw}
          >
            <Ic.Trash /> Withdraw proposal
          </button>
        ) : (
          <>
            <button
              className={`btn btn-vote no${myVote && !myVote.approve ? "on" : ""}`}
              disabled={isBusy}
              onClick={() => {
                vote(false);
              }}
            >
              <Ic.Close /> Decline
            </button>
            <button
              className={`btn btn-vote yes${myVote?.approve ? "on" : ""}`}
              disabled={isBusy}
              onClick={() => {
                vote(true);
              }}
            >
              <Ic.Check /> Approve
            </button>
          </>
        )}
      </div>

      {isAdmin && (
        <div className="poll-admin">
          <span className="faint">Admin</span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={isBusy}
            onClick={() => {
              adminDecide("confirmed");
            }}
          >
            Confirm now
          </button>
          <button
            className="btn btn-ghost btn-sm"
            disabled={isBusy}
            onClick={() => {
              adminDecide("rejected");
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
