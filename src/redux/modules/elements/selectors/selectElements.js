// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";

const getElements = (state: RootReducerState) => state.elements.list;
const getCategoryId = (state: RootReducerState, categoryId: string) =>
  categoryId;

const selectElements = createSelector(
  [getElements, getCategoryId],
  (elements, categoryId) =>
    elements.filter(
      element => !element.deleted_at && element.category_id === categoryId
    )
);

export default selectElements;
