// @flow
import { createSelector } from "reselect";
import { get, sortBy } from "lodash";
import type { RootReducerState } from "src/redux/modules";
import type { Unit } from "src/redux/modules/units";

function getUnits(state: RootReducerState): Array<Unit> {
  return get(state, "units.list", []);
}

function getProductionId(state: RootReducerState): ?number {
  return get(state, "productions.activeProductionID", "").toString();
}

const listUnits = createSelector(
  [getUnits, getProductionId],
  (units: Array<Unit>, productionId: ?number) => {
    if (!units.length) return units;

    const reduced: Array<Unit> = units.reduce((all, one) => {
      // filters
      if (one.deleted_at) return all;
      if (one.production_id !== productionId) return all;

      all.push(one);

      return all;
    }, []);

    // sort
    return sortBy(reduced, ["name"]);
  }
);

export default listUnits;
