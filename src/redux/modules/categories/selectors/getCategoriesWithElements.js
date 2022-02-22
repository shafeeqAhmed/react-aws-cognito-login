// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type Category } from "src/redux/modules/categories";
import { type Element } from "src/redux/modules/elements";

const getProductionId = (state: RootReducerState) =>
  state.productions.activeProductionID;
const getCategories = (state: RootReducerState) => state.categories.list;
const getElements = (state: RootReducerState) => state.elements.list;

export type CategoryWithElements = {|
  ...Category,
  elements: Array<Element>
|};

const getCategoriesWithElements: RootReducerState => Array<
  CategoryWithElements
> = createSelector(
  [getProductionId, getCategories, getElements],
  (productionId, categories, elements) =>
    // Get categories with elements embedded
    categories
      .filter(
        category => `${category.production_id}` === `${productionId || ""}`
      )
      .map(category => ({
        ...category,
        elements: elements.filter(e => e.category_id === category.id)
      }))
);

export default getCategoriesWithElements;
