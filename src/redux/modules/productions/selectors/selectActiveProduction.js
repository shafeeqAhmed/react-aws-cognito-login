// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";

const getProductions = (state: RootReducerState) =>
  state.productions.productions;

const getActiveProductionId = (state: RootReducerState) =>
  state.productions.activeProductionID;

const selectActiveProduction = createSelector(
  [getProductions, getActiveProductionId],
  (productions, productionId) =>
    productionId ? productions.find(p => `${p.id}` === `${productionId}`) : null
);

export default selectActiveProduction;
