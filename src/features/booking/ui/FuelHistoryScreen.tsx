import { useMemo, useState } from "react";
import * as Ic from "@/components/veloz/icons";
import type { FuelBrand } from "@/libs/supabase/types";
import { useFuelLogs, useVehicle } from "../queries";
import { fmtDateTime, manilaDateISO, monShort, todayManilaISO } from "../time";
import { fmtPeso, fuelBrands } from "../types";
import { Avatar } from "./components";
import { personOf, useBookingUi, useMeId } from "./context";
import { FuelBrandIcon } from "./FuelBrandIcon";
import { FuelLogModal } from "./FuelLogModal";

/**
 * Fuel history: the full-screen ledger of every logged fill-up. Reached from the
 * fuel card's "Fuel history" button (not a modal). Shows peso analytics over all
 * fill-ups (total, this month, count, average, and a by-station breakdown), then
 * the entries themselves, paged newest-first. Totals always cover every entry,
 * not just the visible page.
 */

const PAGE_SIZE = 8;

export function FuelHistoryScreen({
  wide,
  onBack,
}: {
  wide: boolean;
  onBack: () => void;
}) {
  const logsQ = useFuelLogs();
  const vehicleQ = useVehicle();
  const me = useMeId();
  const { people } = useBookingUi();
  const [page, setPage] = useState(0);
  const [isLogging, setIsLogging] = useState(false);

  const logs = useMemo(() => logsQ.data ?? [], [logsQ.data]);

  const month = todayManilaISO().slice(0, 7);
  const analytics = useMemo(() => {
    let total = 0;
    let monthTotal = 0;
    const byBrand = new Map<FuelBrand, number>();

    for (const b of fuelBrands) {
      byBrand.set(b, 0);
    }
    for (const log of logs) {
      total = total + log.amount_php;
      if (manilaDateISO(log.created_at).startsWith(month)) {
        monthTotal = monthTotal + log.amount_php;
      }
      byBrand.set(log.brand, (byBrand.get(log.brand) ?? 0) + log.amount_php);
    }

    const count = logs.length;

    return {
      total,
      monthTotal,
      count,
      avg: count > 0 ? total / count : 0,
      byBrand: [...byBrand.entries()]
        .filter(([, amount]) => amount > 0)
        .sort((a, b) => b[1] - a[1]),
    };
  }, [logs, month]);

  const pageCount = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageLogs = logs.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  const monthLabel = `${monShort[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;
  const maxBrand = Math.max(1, ...analytics.byBrand.map(([, amount]) => amount));
  const vehicle = vehicleQ.data;

  let body: React.ReactNode;

  if (logsQ.isLoading && logs.length === 0) {
    body = (
      <div className="faint" style={{ padding: "var(--s6) 0" }}>
        Loading fill-ups…
      </div>
    );
  } else if (logs.length === 0) {
    body = (
      <div className="empty">
        <Ic.Fuel />
        <div className="big">No fill-ups yet</div>
        <div>Log your first fill-up to start tracking spend.</div>
        {vehicle && (
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: "var(--s4)" }}
            onClick={() => { setIsLogging(true); }}
          >
            <Ic.Fuel /> Log fill-up
          </button>
        )}
      </div>
    );
  } else {
    body = (
      <>
        <div className="fuel-analytics">
          <div className="fuel-stat">
            <div className="lbl">Total spent</div>
            <div className="val tnum">{fmtPeso(analytics.total)}</div>
          </div>
          <div className="fuel-stat">
            <div className="lbl">{monthLabel}</div>
            <div className="val tnum">{fmtPeso(analytics.monthTotal)}</div>
          </div>
          <div className="fuel-stat">
            <div className="lbl">Fill-ups</div>
            <div className="val tnum">{analytics.count}</div>
          </div>
          <div className="fuel-stat">
            <div className="lbl">Avg / fill-up</div>
            <div className="val tnum">{fmtPeso(Math.round(analytics.avg))}</div>
          </div>
        </div>

        <div className="section-head">
          <h2>By station</h2>
        </div>
        <div className="stat-list">
          {analytics.byBrand.map(([brand, amount]) => {
            return (
              <div className="stat-row" key={brand}>
                <FuelBrandIcon brand={brand} size={32} />
                <div className="stat-main">
                  <div className="stat-top">
                    <span className="nm">{brand}</span>
                    <span className="stat-val tnum">{fmtPeso(amount)}</span>
                  </div>
                  <div className="stat-bar">
                    <span style={{ width: `${(amount / maxBrand) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-head">
          <h2>All fill-ups</h2>
        </div>
        <ul className="fuel-log-list">
          {pageLogs.map((log) => {
            return (
              <li className="fuel-log-item" key={log.id}>
                <FuelBrandIcon brand={log.brand} size={36} />
                <div className="fl-main">
                  <div className="fl-brand">{log.brand}</div>
                  <div className="fl-when">
                    <Avatar pid={log.user_id} size="sm" />
                    <span>
                      {personOf(people, log.user_id).name} ·{" "}
                      {fmtDateTime(log.created_at)}
                    </span>
                  </div>
                </div>
                <div className="fl-amount tnum">{fmtPeso(log.amount_php)}</div>
              </li>
            );
          })}
        </ul>

        {pageCount > 1 && (
          <div className="pager">
            <button
              className="btn btn-ghost btn-sm"
              disabled={safePage === 0}
              onClick={() => { setPage(safePage - 1); }}
            >
              <Ic.ChevronL /> Prev
            </button>
            <span className="pager-label tnum">
              Page {safePage + 1} of {pageCount}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={safePage >= pageCount - 1}
              onClick={() => { setPage(safePage + 1); }}
            >
              Next <Ic.Chevron />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="content">
      <div className="screen-head">
        <button className="icon-btn" aria-label="Back" onClick={onBack}>
          <Ic.ChevronL />
        </button>
        <div className="screen-head-titles">
          <h1>Fuel history</h1>
          <div className="sub">
            {analytics.count} fill-up{analytics.count === 1 ? "" : "s"} logged
          </div>
        </div>
        {vehicle && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setIsLogging(true); }}
          >
            <Ic.Fuel /> Log
          </button>
        )}
      </div>

      {body}

      {isLogging && vehicle && (
        <FuelLogModal
          wide={wide}
          vehicleId={vehicle.id}
          householdId={vehicle.household_id}
          userId={me}
          onClose={() => { setIsLogging(false); }}
          onOpenHistory={() => { setIsLogging(false); }}
        />
      )}
    </div>
  );
}
