// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type Category } from "src/redux/modules/categories";
import { type Element } from "src/redux/modules/elements";

const getProductionId = (state: RootReducerState) =>
  state.productions.activeProductionID;
const getCategories = (state: RootReducerState) => state.categories.list;
const getElements = (state: RootReducerState) => state.elements.list;
const getShootingEventId = (state: RootReducerState) =>
  state.screenplay.selectedShootingEventId;

export type CategoryWithElements = {|
  ...Category,
  elements: Array<Element>
|};

const getCategoriesWithElements: RootReducerState => Array<
  CategoryWithElements
> = createSelector(
  [getProductionId, getCategories, getElements, getShootingEventId],
  (productionId, categories, elements, shootingEventId) =>
    // Get categories with elements embedded
    categories
      .filter(
        category => `${category.production_id}` === `${productionId || ""}`
      )
      .map(category => ({
        ...category,
        elements: elements.filter(
          e =>
            e.category_id === category.id &&
            (e.shootingevents.find(
              s => s.shootingevent_id === shootingEventId
            ) ||
              e.shootingevents_scenes.find(
                s => s.shootingevent_id === shootingEventId
              ))
        )
      }))
);

export default getCategoriesWithElements;
