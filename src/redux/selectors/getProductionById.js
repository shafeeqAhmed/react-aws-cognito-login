// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";

const getList = (state: RootReducerState) => state.productions.productions;
const getId = (_, id: number) => id;

const getProductionById = createSelector(
  [getList, getId],
  (productions, productionId) => productions.find(p => p.id === productionId)
);

export default getProductionById;
