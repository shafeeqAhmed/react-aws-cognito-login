// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";
import { orderBy } from "lodash";

const getProductions = (state: RootReducerState) =>
  state.productions.productions;

const getActiveProductionId = (state: RootReducerState) =>
  state.productions.activeProductionID;

const selectProductions = createSelector(
  [getProductions, getActiveProductionId],
  (productions, productionId) =>
    orderBy(
      productions,
      [p => `${p.id}` === `${productionId || ""}`, "name"],
      ["desc", "asc"]
    )
);

export default selectProductions;
