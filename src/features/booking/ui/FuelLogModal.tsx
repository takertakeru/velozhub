import { useState } from "react";
import { toaster } from "@/components/ui/toast";
import * as Ic from "@/components/veloz/icons";
import type { FuelBrand } from "@/libs/supabase/types";
import { useLogFuel } from "../mutations";
import { fuelBrands } from "../types";
import { FuelBrandIcon } from "./FuelBrandIcon";

/**
 * Sheet for logging a fuel fill-up on the shared Veloz: peso amount + station
 * brand. The timestamp is set server-side (the row's `created_at`), and the
 * Veloz runs on unleaded, so neither is a field here. A footer link jumps to the
 * full history screen.
 */
export function FuelLogModal({
  wide,
  vehicleId,
  householdId,
  userId,
  onClose,
  onOpenHistory,
}: {
  wide: boolean;
  vehicleId: string;
  householdId: string;
  userId: string;
  onClose: () => void;
  onOpenHistory: () => void;
}) {
  const logFuel = useLogFuel();
  const [amount, setAmount] = useState("");
  const [brand, setBrand] = useState<FuelBrand>("Shell");

  const amountPhp = Number(amount);
  const canSave =
    !logFuel.isPending && Number.isFinite(amountPhp) && amountPhp > 0;

  const save = () => {
    if (!canSave) {
      return;
    }

    logFuel.mutate(
      { vehicleId, householdId, userId, amountPhp, brand },
      {
        onSuccess: () => { onClose(); },
        onError: () => { toaster("Could not save the fill-up."); },
      },
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wide ? "scrim modal" : "scrim"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) { onClose(); }
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-head">
          <div className="sheet-title">
            <h2>Log a fill-up</h2>
            <p>
              Toyota Veloz <span className="fuel-type-badge">Unleaded</span>
            </p>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Ic.Close />
          </button>
        </div>
        <div className="sheet-body">
          <div className="field">
            <label htmlFor="fuel-amount">Amount</label>
            <div className="input-wrap peso-wrap">
              <span className="peso-sign" aria-hidden="true">
                ₱
              </span>
              <input
                id="fuel-amount"
                type="number"
                inputMode="decimal"
                className="input has-icon tnum"
                placeholder="2,500"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { save(); }
                }}
              />
            </div>
          </div>

          <div className="field">
            <span className="grouplabel">Gas station</span>
            <div className="brand-grid">
              {fuelBrands.map((b) =>
                { return <button
                  key={b}
                  type="button"
                  className="chip selectable brand-chip"
                  aria-pressed={brand === b}
                  onClick={() => { setBrand(b); }}
                >
                  <FuelBrandIcon brand={b} size={22} />
                  {b}
                </button> }
              )}
            </div>
          </div>
        </div>
        <div className="sheet-foot fuel-log-foot">
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => { onOpenHistory(); }}
          >
            <Ic.Chart /> Fuel history
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.5 }}
            onClick={save}
          >
            <Ic.Check /> Save fill-up
          </button>
        </div>
      </div>
    </div>
  );
}
