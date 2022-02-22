// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { RootReducerState } from "src/redux/modules";

const getScenes = (state: RootReducerState) =>
  get(state, "screenplay.screenplay.scenes", []);
const getSelectedSceneId = (state: RootReducerState) =>
  get(state, "screenplay.selectedSceneId", "");

const getSelectedScene = createSelector(
  [getScenes, getSelectedSceneId],
  (scenes, selectedSceneId) =>
    scenes.find(
      s =>
        s.sceneId
          ? s.sceneId === selectedSceneId
          : s.sceneCode === selectedSceneId
    )
);

export default getSelectedScene;
