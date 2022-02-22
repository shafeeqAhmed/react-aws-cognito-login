// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type Category } from "src/redux/modules/categories";

const getCategories = (state: RootReducerState) => state.categories.list;
const getCategoryId = (state: RootReducerState, categoryId: string) =>
  categoryId;

const selectCategoryById: (
  RootReducerState,
  string
) => ?Category = createSelector(
  [getCategories, getCategoryId],
  (categories, categoryId) =>
    categories.find(category => category.id === categoryId)
);

export default selectCategoryById;
