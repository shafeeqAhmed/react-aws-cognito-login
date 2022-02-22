// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import { SceneOrders } from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import type { ScreenplayScene, SceneOrder } from "src/redux/modules/screenplay";

function getScenes(state: RootReducerState): Array<ScreenplayScene> {
  return get(state, "screenplay.screenplay.scenes", []);
}

function getOrderBy(state: RootReducerState): SceneOrder {
  return get(state, "screenplay.scenesOrderedBy", SceneOrders.sequence);
}

const listOrderedScreenplayScenes = createSelector(
  [getScenes, getOrderBy],
  (scenes: Array<ScreenplayScene>, orderByOption: SceneOrder) =>
    // if (orderByOption === SceneOrders.sequence) {
    //   return orderBy(
    //     scenes.map(scene => ({
    //       ...scene,
    //       numToOrder: parseInt(scene.sceneCode, 10)
    //         ? scene.sceneCode
    //         : scene.sceneCode.substr(1, 1),
    //       charToOrder: scene.sceneCode.substr(0, 1)
    //     })),
    //     ["numToOrder", "charToOrder"],
    //     ["asc", "asc"]
    //   ).map(scene => omit(scene, "numToOrder", "charToOrder"));
    // }
    scenes
);

export default listOrderedScreenplayScenes;
