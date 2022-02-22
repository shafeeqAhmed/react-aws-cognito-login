// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import ScenePicker from "./scene-picker";
import listScreenplayScenes from "src/redux/selectors/listScreenplayScenes";
import { filterScenes, orderBySequence } from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import type { ScreenplayScene } from "src/redux/modules/screenplay";

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +selectedSceneId: string,
  +sceneFilter: string,
  +scenes: Array<ScreenplayScene>,
  +scenesOrderedBy: string,
  +areScenesCollapsed: boolean
};

type OwnProps = {
  +selectScene: (scene: ScreenplayScene) => Promise<any>,
  +omitScene: (scene: ScreenplayScene) => Promise<any>,
  +restoreScene: (scene: ScreenplayScene) => Promise<any>,
  +deleteScene: (scene: ScreenplayScene) => Promise<any>,
  +lockScene: (scene: ScreenplayScene) => Promise<any>,
  +lockScenes: (sceneCodes?: Array<string>) => Promise<any>
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  scenesOrderedBy: get(state, "screenplay.scenesOrderedBy", undefined),
  selectedSceneId: get(state, "screenplay.selectedSceneId", ""),
  areScenesCollapsed: get(state, "screenplay.areScenesCollapsed", false),
  sceneFilter: get(state, "screenplay.sceneFilter", ""),
  scenes: listScreenplayScenes(state)
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +filterScenes: Function,
  +orderBySequence: Function
};

const mapDispatchToProps: DispatchProps = {
  filterScenes,
  orderBySequence
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenePicker);
export type ReduxProps = OwnProps & StateProps & DispatchProps;
