// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type Category } from "src/redux/modules/categories";

const getProductionId = (state: RootReducerState) =>
  state.productions.activeProductionID;
const getCategories = (state: RootReducerState) => state.categories.list;

const selectCategories: RootReducerState => Array<Category> = createSelector(
  [getProductionId, getCategories],
  (productionId, categories) =>
    categories.filter(
      category =>
        `${category.production_id}` === `${productionId || ""}` &&
        !category.deleted_at
    )
);

export default selectCategories;
