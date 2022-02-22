// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";

const getters = [
  (state: RootReducerState) => state.init.isLoading,
  (state: RootReducerState) => state.ui.showLoading,
  (state: RootReducerState) => state.auth.isFetching,
  (state: RootReducerState) => state.productions.isFetching,
  (state: RootReducerState) => state.screenplay.isFetching,
  (state: RootReducerState) => state.drive.isFetching,
  (state: RootReducerState) => state.users.isFetching,
  (state: RootReducerState) => state.users.isSaving,
  (state: RootReducerState) => state.comments.isFetching,
  (state: RootReducerState) => state.units.isFetching,
  (state: RootReducerState) => state.scenes.isFetching,
  (state: RootReducerState) => state.schedule.days.isFetching,
  (state: RootReducerState) => state.schedule.events.isFetching,
  (state: RootReducerState) => state.shooting.events.isFetching,
  (state: RootReducerState) => state.gatekeeper.isFetching,
  (state: RootReducerState) => state.categories.isFetching,
  (state: RootReducerState) => state.elements.isFetching
];

type AreWeLoading = RootReducerState => boolean;

// $FlowFixMe flow-typed lib doesn't support more than 17 getters
const areWeLoading: AreWeLoading = createSelector(getters, (...rest) =>
  rest.includes(true)
);

export default areWeLoading;
