// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { RootReducerState } from "src/redux/modules";

const getScenes = (state: RootReducerState) =>
  get(state, "screenplay.screenplay.scenes", []);

const areAllScenesLocked = createSelector(
  [getScenes],
  scenes => !scenes.find(s => !s.sceneId)
);

export default areAllScenesLocked;
