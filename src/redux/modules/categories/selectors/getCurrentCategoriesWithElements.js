// @flow
import { createSelector } from "reselect";
import getCurrentScheduleDayEvent from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDayEvent";
import getCategoriesWithElements, {
  type CategoryWithElements
} from "./getCategoriesWithElements";
import { type RootReducerState } from "src/redux/modules";

type GetCurrentCategoriesWithElements = RootReducerState => Array<
  CategoryWithElements
>;

const getCurrentCategoriesWithElements: GetCurrentCategoriesWithElements = createSelector(
  [getCurrentScheduleDayEvent, getCategoriesWithElements],
  (currentDayEvent, categoriesWithElements) => {
    if (!currentDayEvent) return [];

    // Get current categories with all elements
    const currentCategoriesWithElements = categoriesWithElements.filter(
      category =>
        category.elements.filter(
          element =>
            element.shootingevents_scenes.filter(
              scene =>
                scene.shootingevent_id === currentDayEvent.shootingevent_id
            ).length > 0
        ).length > 0
    );

    // Remove the elements within the current categories that are not in the
    // current shooting event
    const currentCategoriesWithCurrentElements = currentCategoriesWithElements.map(
      category => ({
        ...category,
        elements: category.elements.filter(
          element =>
            element.shootingevents_scenes.filter(
              scene =>
                scene.shootingevent_id === currentDayEvent.shootingevent_id
            ).length > 0
        )
      })
    );

    return currentCategoriesWithCurrentElements;
  }
);

export default getCurrentCategoriesWithElements;
