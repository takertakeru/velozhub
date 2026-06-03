import { type CSSProperties, useState } from "react";
import { toaster } from "@/components/ui/toast";
import * as Ic from "@/components/veloz/icons";
import { useUpdateFuel } from "../mutations";
import { useVehicle } from "../queries";
import { personOf, useBookingUi, useMeId } from "./context";
import { FuelLogModal } from "./FuelLogModal";

/**
 * Fuel gauge for the shared Veloz, shown on Home.
 *
 * Anyone in the household can record the level after a fill-up or a drive; it
 * syncs live via Realtime. The reading is a 0-100 percentage rendered as eight
 * segments from E to F, colored green / amber / red as it drops. The "Log
 * fill-up" action opens a sheet to record the peso spend + station, which feeds
 * the fuel history screen (`onOpenHistory`).
 */

const SEGMENTS = 8;

/** Gauge color by remaining fuel: low reads as a warning, like a dash light. */
function fuelColor(level: number): string {
  if (level <= 12) {
    return "var(--danger)";
  }
  if (level <= 25) {
    return "var(--busy-ink)";
  }

  return "var(--free)";
}

const presets: Array<{ label: string; value: number }> = [
  { label: "E", value: 0 },
  { label: "¼", value: 25 },
  { label: "½", value: 50 },
  { label: "¾", value: 75 },
  { label: "F", value: 100 },
];

export function FuelGauge({
  wide,
  onOpenHistory,
}: {
  wide: boolean;
  onOpenHistory: () => void;
}) {
  const vehicleQ = useVehicle();
  const me = useMeId();
  const { people } = useBookingUi();
  const updateFuel = useUpdateFuel();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [draft, setDraft] = useState(0);

  const vehicle = vehicleQ.data;

  if (!vehicle) {
    return null;
  }

  const level = vehicle.fuel_level;
  const color = fuelColor(level);
  const lit = Math.round((level / 100) * SEGMENTS);
  const setterName = vehicle.fuel_updated_by
    ? personOf(people, vehicle.fuel_updated_by).name
    : null;

  const startEdit = () => {
    setDraft(level);
    setIsEditing(true);
  };

  const save = () => {
    updateFuel.mutate(
      { vehicleId: vehicle.id, level: draft, userId: me },
      {
        onSuccess: () => { setIsEditing(false); },
        onError: () => { toaster("Could not update the fuel level."); },
      },
    );
  };

  return (
    <>
    <div className="fuel-card">
      <div className="fuel-head">
        <span className="fuel-ic" style={{ color }}>
          <Ic.Fuel />
        </span>
        <div className="fuel-meta">
          <div className="fuel-labels">
            <span className="lbl">Fuel</span>
            <span className="fuel-type-badge">Unleaded</span>
          </div>
          <div className="val" style={{ color }}>
            {level}
            <span className="unit">%</span>
          </div>
        </div>
        {!isEditing && (
          <button className="btn btn-ghost btn-sm" onClick={startEdit}>
            Update
          </button>
        )}
      </div>

      <div className="fuel-gauge">
        <span className="cap">E</span>
        <span className="fuel-segs">
          {[...Array(SEGMENTS).keys()].map((i) =>
            { return <span
              key={i}
              className={i < lit ? "fuel-seg on" : "fuel-seg"}
              style={{
                height: `${9 + i * 3}px`,
                ...(i < lit ? { background: color } : null),
              } as CSSProperties}
            /> }
          )}
        </span>
        <span className="cap">F</span>
      </div>

      {isEditing ? (
        <div className="fuel-edit">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={draft}
            aria-label="Fuel level"
            onChange={(e) => { setDraft(Number(e.target.value)); }}
          />
          <div className="fuel-presets">
            {presets.map((p) => 
              { return <button
                key={p.value}
                type="button"
                className="chip selectable"
                aria-pressed={draft === p.value}
                onClick={() => { setDraft(p.value); }}
              >
                {p.label}
              </button> }
            )}
            <span className="fuel-draft tnum">{draft}%</span>
          </div>
          <div className="fuel-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setIsEditing(false); }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={updateFuel.isPending}
              onClick={save}
            >
              <Ic.Check /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="fuel-foot">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setIsLogging(true); }}
          >
            <Ic.Plus /> Log fill-up
          </button>
          {setterName && (
            <span className="by">Last set by {setterName}</span>
          )}
        </div>
      )}
    </div>

      {isLogging && (
        <FuelLogModal
          wide={wide}
          vehicleId={vehicle.id}
          householdId={vehicle.household_id}
          userId={me}
          onClose={() => { setIsLogging(false); }}
          onOpenHistory={() => {
            setIsLogging(false);
            onOpenHistory();
          }}
        />
      )}
    </>
  );
}
