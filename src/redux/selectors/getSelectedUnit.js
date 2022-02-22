// @flow
import { createSelector } from "reselect";
import { get, find } from "lodash";
import type { RootReducerState } from "src/redux/modules";
import type { Unit } from "src/redux/modules/units";

function getUnits(state: RootReducerState): Array<Unit> {
  return get(state, "units.units", []);
}

function getSelectedUnitId(state: RootReducerState): ?string {
  return get(state, "units.currentUnitId", null);
}

function getProductionId(state: RootReducerState): ?number {
  return get(state, "productions.activeProductionID", null);
}

const getSelectedUnit = createSelector(
  [getUnits, getSelectedUnitId, getProductionId],
  (units: Array<Unit>, unitId: ?string, productionId: ?number): ?Unit => {
    if (!units.length) return null;
    if (!productionId) return null;

    const unit = find(units, u => u.id === unitId);
    if (!unit) return null;
    if (unit.production_id !== productionId) return null;

    return unit;
  }
);

export default getSelectedUnit;
