// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import ScenePicker from "./scene-picker";
import {
  filterScenes,
  orderBySequence,
  removeSceneFromShootingEvent,
  splitShootingEvent,
  deleteShootingEvent,
  listShootingEvents,
  getSelectedShootingEvent
} from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import type { ShootingEvent } from "src/redux/modules/screenplay";

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +shootingEvents: Array<ShootingEvent>,
  +selectedShootingEvent: ?ShootingEvent,
  +filter: string,
  +orderedBy: string,
  +collapsed: boolean
};

type OwnProps = {
  +selectShootingEvent: Function
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    shootingEvents: listShootingEvents(state),
    selectedShootingEvent: getSelectedShootingEvent(state),
    filter: get(state, "screenplay.sceneFilter", ""),
    collapsed: get(state, "screenplay.areScenesCollapsed", false),
    orderedBy: get(state, "screenplay.scenesOrderedBy", false),
    ...ownProps
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +filterScenes: Function,
  +orderBySequence: Function,
  +removeSceneFromShootingEvent: Function,
  +splitShootingEvent: Function,
  +deleteShootingEvent: Function
};

const mapDispatchToProps: DispatchProps = {
  filterScenes,
  orderBySequence,
  removeSceneFromShootingEvent,
  splitShootingEvent,
  deleteShootingEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenePicker);
export type ReduxProps = OwnProps & StateProps & DispatchProps;
